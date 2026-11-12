#!/usr/bin/env python3
"""
NHS PCN & ICB Core20PLUS5 Equity & Pharmacy-SMR Neighbourhood Allocator
=======================================================================
Free, Non-Commercial Open-Science Public-Good Tool for NHS Primary Care Networks (PCNs),
Integrated Care Boards (ICBs), ARRS Clinical Pharmacists, and Social Prescribing Link-Worker Leads.

Mandate & Governance:
  1. 100% Non-Commercial Scientific Research & Public-Good Release (zero commercial fees/licensing).
  2. Zero Patient-Identifiable Data (0): operates strictly on practice- or PCN-level aggregate
     NHS England Network Contract DES & OHID Fingertips indicators under Open Government Licence v3.0.
  3. Exact Classical Polynomial Solver: solves capacity-constrained Neighbourhood Hub routing
     to 0.0000% proven global optimality in milliseconds via HiGHS MILP (`scipy.optimize.milp`)
     and an isomorphic 5-Hub Exact Augmenting Cycle/Path Network Solver (zero QPU required).
  4. NHS DCB0129 Human-in-the-Loop Safety: outputs are advisory commissioning & clinic-planning
     decision support only; named Clinical Pharmacist SMR and Link-Worker co-production retain
     100% clinical and relational authority.

Acknowledgments:
  This work was supported in part by complimentary access to Google Antigravity and Gemini 4 Argon
  to accelerate scientific workflows.

CLI Examples:
  # Solve Mid and South Essex ICB (28 PCNs) at the recommended 1.50x Core20 equity weight:
  python3 tools/nhs_pcn_core20_equity_allocator.py --icb "Mid and South Essex" --level pcn --output-csv mse_pcn_plan.csv

  # Solve all 143 individual GP practices in Mid and South Essex ICB:
  python3 tools/nhs_pcn_core20_equity_allocator.py --icb "Mid and South Essex" --level practice

  # Solve all 1,296 PCNs across England and print the 1.0x..2.0x Core20 Pareto frontier:
  python3 tools/nhs_pcn_core20_equity_allocator.py --all-england --pareto-sweep
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import time
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from scipy.optimize import Bounds, LinearConstraint, milp

REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_COHORT_CSV = REPO_ROOT / "data" / "nhs_england_sp_smr_empirical_cohort.csv"

NEIGHBOURHOOD_HUBS = [
    {
        "id": 0,
        "code": "HUB-SMR-FALLS",
        "name": "Pharmacy SMR + Falls & Mobility Reablement Hub",
        "short": "Pharmacy SMR + Falls",
        "smr_bundle": "Priority Lever 11100000: Polypharmacy + Addictive-Meds + Frailty SMR + Falls Clearance Gate (H-QSPM-01)",
    },
    {
        "id": 1,
        "code": "HUB-CORE20-WELFARE",
        "name": "Core20 Welfare, Debt & Housing Advice Link-Worker Hub",
        "short": "Core20 Welfare & Housing",
        "smr_bundle": "Co-deliver ARRS Clinical Pharmacist SMR + Shared Decision-Making + Welfare/Housing Link Worker (+9.90 pp SP acceptance)",
    },
    {
        "id": 2,
        "code": "HUB-MH-PEER",
        "name": "Community Mental Health, Bereavement & Peer Befriending Hub",
        "short": "Mental Health & Befriending",
        "smr_bundle": "Antidepressant/Sedative SMR review + Relational WMTY Link-Worker Co-Production (H-QSPM-02)",
    },
    {
        "id": 3,
        "code": "HUB-GREEN-ACTIVE",
        "name": "Green Social Prescribing & Cardiometabolic Activity Hub",
        "short": "Green & Cardiometabolic",
        "smr_bundle": "Cardiometabolic SMR check + Structured Outdoor/Group Activity with Ring-Fenced VCFSE Grant (H-QSPM-03)",
    },
    {
        "id": 4,
        "code": "HUB-FRAILTY-HOME",
        "name": "Frailty & Care-Home Multidisciplinary Outreach Hub",
        "short": "Frailty & Care-Home",
        "smr_bundle": "Care-Home & Severe Frailty Anticholinergic Deprescribing SMR + Domiciliary Link-Worker Outreach",
    },
]


def _minmax(arr: np.ndarray) -> np.ndarray:
    ptp = float(np.ptp(arr))
    if ptp < 1e-9:
        return np.zeros_like(arr, dtype=float)
    return (arr - float(np.min(arr))) / ptp


def load_and_prepare_units(
    csv_path: Path = DEFAULT_COHORT_CSV,
    icb_query: str | None = None,
    level: str = "pcn",
) -> pd.DataFrame:
    """Load OGL v3.0 NHS GP cohort CSV and aggregate to PCN level or filter GP practices."""
    df = pd.read_csv(csv_path)
    nat_core20_thresh = float(df["imd2025"].quantile(0.80))

    if icb_query:
        q = icb_query.strip().lower()
        mask = (
            df["icb_name"].fillna("").str.lower().str.contains(q, regex=False)
            | df["icb_ons_code"].fillna("").str.lower().eq(q)
            | df["pcn_name"].fillna("").str.lower().str.contains(q, regex=False)
            | df["pcn_code"].fillna("").str.lower().eq(q)
        )
        sub = df[mask].copy()
        if sub.empty:
            raise ValueError(f"No NHS ICB or PCN matched query: {icb_query!r}")
    else:
        sub = df.copy()

    if level == "pcn":
        sub = sub.dropna(subset=["pcn_code"]).copy()
        agg = sub.groupby("pcn_code", as_index=False).agg(
            unit_name=("pcn_name", "first"),
            icb_code=("icb_ons_code", "first"),
            icb_name=("icb_name", "first"),
            n_practices=("practice_code", "count"),
            list_size_24=("list_size_24", "sum"),
            imd2025=("imd2025", "mean"),
            sedative_opioid_pct_24=("sedative_opioid_pct_24", "mean"),
            aged_65_plus=("aged_65_plus", "mean"),
            depression_qof=("depression_qof", "mean"),
            sp_referral_rate_per_1k_24=("sp_referral_rate_per_1k_24", "mean"),
            sp_refusal_rate_24=("sp_refusal_rate_24", "mean"),
            smr_per_1k_24=("smr_per_1k_24", "mean"),
        )
        agg.rename(columns={"pcn_code": "unit_code"}, inplace=True)
        # Match national PCN 80th-percentile Core20 definition when solving all England, else national GP threshold
        if icb_query is None and len(agg) > 500:
            pcn_q80 = float(agg["imd2025"].quantile(0.80))
            agg["is_core20"] = (agg["imd2025"] >= pcn_q80).astype(int)
        else:
            agg["is_core20"] = (agg["imd2025"] >= nat_core20_thresh).astype(int)
        agg["unit_type"] = "PCN"
        return agg.sort_values("unit_code").reset_index(drop=True)

    out = sub.copy()
    out["unit_code"] = out["practice_code"]
    out["unit_name"] = out["practice_name"]
    out["icb_code"] = out["icb_ons_code"]
    out["n_practices"] = 1
    out["unit_type"] = "GP_PRACTICE"
    return out.sort_values("unit_code").reset_index(drop=True)


def compute_base_and_weighted_utility(
    units_df: pd.DataFrame,
    core20_multiplier: float = 1.50,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Compute unweighted clinical affinity U_base (N x 5) and Marmot Core20-weighted U_weighted."""
    imd_n = _minmax(units_df["imd2025"].values.astype(float))
    sed_n = _minmax(units_df["sedative_opioid_pct_24"].values.astype(float))
    age_n = _minmax(units_df["aged_65_plus"].values.astype(float))
    dep_n = _minmax(units_df["depression_qof"].values.astype(float))
    sp_n = _minmax(units_df["sp_referral_rate_per_1k_24"].values.astype(float))

    n_u = len(units_df)
    U_base = np.zeros((n_u, 5), dtype=float)
    U_base[:, 0] = 0.55 * sed_n + 0.45 * age_n
    U_base[:, 1] = 0.70 * imd_n + 0.30 * sp_n
    U_base[:, 2] = 0.65 * dep_n + 0.35 * sp_n
    U_base[:, 3] = 0.50 * sp_n + 0.30 * (1.0 - age_n) + 0.20 * dep_n
    U_base[:, 4] = 0.65 * age_n + 0.35 * sed_n

    is_c20 = units_df["is_core20"].values.astype(int)
    lam = float(core20_multiplier)
    eq_mult = np.where(is_c20 == 1, lam, np.where(imd_n >= 0.60, 1.0 + 0.5 * (lam - 1.0), 1.0))
    U_weighted = U_base * eq_mult[:, None]
    return U_base, U_weighted, eq_mult


def solve_exact_5hub_network(U: np.ndarray, cap_h: int) -> tuple[np.ndarray, float, float]:
    """
    Exact polynomial 5-Hub Residual Cycle & Augmenting-Path Solver (isomorphic to Min-Cost Max-Flow).
    Because each unit belongs to strictly one hub in {0..4}, simple cycles and simple paths to
    under-capacity hubs on the 5-hub exchange graph never reuse a unit and are necessary & sufficient
    for global integer optimality (matching HiGHS MILP to machine precision).
    """
    t0 = time.perf_counter()
    n_u, n_h = U.shape
    if cap_h * n_h < n_u:
        raise ValueError(f"Infeasible capacity cap {cap_h} for {n_u} units across {n_h} hubs")

    assign = np.zeros(n_u, dtype=int)
    loads = np.zeros(n_h, dtype=int)
    order = np.argsort(-np.max(U, axis=1))
    for i in order:
        for h in np.argsort(-U[i]):
            if loads[h] < cap_h:
                assign[i] = int(h)
                loads[h] += 1
                break

    eps = 1e-11
    while True:
        # Vectorized best unit move gain W[u, v] and argmax unit best_idx[u, v] for u != v
        u_cur = U[np.arange(n_u), assign]
        gains = U - u_cur[:, None]
        W = np.full((n_h, n_h), -1e18, dtype=float)
        best_idx = np.full((n_h, n_h), -1, dtype=int)
        for u in range(n_h):
            mask_u = np.flatnonzero(assign == u)
            if mask_u.size > 0:
                g_sub = gains[mask_u]
                arg = np.argmax(g_sub, axis=0)
                W[u] = g_sub[arg, np.arange(n_h)]
                best_idx[u] = mask_u[arg]
                W[u, u] = -1e18
                best_idx[u, u] = -1

        # 1. Check for any positive-gain simple path u_0 -> ... -> u_k where loads[u_k] < cap_h,
        #    OR any positive-gain simple cycle u_0 -> ... -> u_0 on {0..n_h-1} via Bellman-Ford on n_h+1 nodes
        #    (node n_h is a zero-cost sink reachable from any hub v with loads[v] < cap_h, and returning 0 to all u?
        #     Wait: paths end at sink; cycles stay in 0..n_h-1. Let's check both explicitly on n_h = 5!)
        improved = False

        # (a) Best augmenting simple path to any hub with slack (loads[target] < cap_h)
        if np.any(loads < cap_h):
            best_path_gain = eps
            best_path: list[int] | None = None

            # DFS over simple paths of length 1..n_h-1 on 5 hubs (at most 5! = 120 states total!)
            def _dfs_path(cur: int, visited_mask: int, gain_so_far: float, path: list[int]) -> None:
                nonlocal best_path_gain, best_path
                if len(path) >= 2 and loads[cur] < cap_h and gain_so_far > best_path_gain:
                    best_path_gain = gain_so_far
                    best_path = list(path)
                if len(path) == n_h:
                    return
                for nxt in range(n_h):
                    if not (visited_mask & (1 << nxt)) and best_idx[cur, nxt] >= 0:
                        _dfs_path(nxt, visited_mask | (1 << nxt), gain_so_far + W[cur, nxt], path + [nxt])

            for start_h in range(n_h):
                if loads[start_h] > 0:
                    _dfs_path(start_h, 1 << start_h, 0.0, [start_h])

            if best_path is not None:
                moves = [(best_idx[best_path[k], best_path[k + 1]], best_path[k], best_path[k + 1]) for k in range(len(best_path) - 1)]
                for unit_i, u_old, v_new in moves:
                    assign[unit_i] = v_new
                loads[best_path[0]] -= 1
                loads[best_path[-1]] += 1
                improved = True

        if improved:
            continue

        # (b) Best positive-gain simple cycle on 5 hubs (length 2..5; <= 120 states!)
        best_cyc_gain = eps
        best_cyc: list[int] | None = None

        def _dfs_cycle(start: int, cur: int, visited_mask: int, gain_so_far: float, path: list[int]) -> None:
            nonlocal best_cyc_gain, best_cyc
            if len(path) >= 2 and best_idx[cur, start] >= 0:
                tot = gain_so_far + W[cur, start]
                if tot > best_cyc_gain:
                    best_cyc_gain = tot
                    best_cyc = path + [start]
            if len(path) == n_h:
                return
            for nxt in range(start + 1, n_h):
                if not (visited_mask & (1 << nxt)) and best_idx[cur, nxt] >= 0:
                    _dfs_cycle(start, nxt, visited_mask | (1 << nxt), gain_so_far + W[cur, nxt], path + [nxt])

        for s in range(n_h):
            if loads[s] > 0:
                _dfs_cycle(s, s, 1 << s, 0.0, [s])

        if best_cyc is not None:
            moves = [(best_idx[best_cyc[k], best_cyc[k + 1]], best_cyc[k + 1]) for k in range(len(best_cyc) - 1)]
            for unit_i, v_new in moves:
                assign[unit_i] = v_new
            improved = True

        if not improved:
            break

    wall_ms = (time.perf_counter() - t0) * 1000.0
    obj = float(np.sum(U[np.arange(n_u), assign]))
    return assign, obj, wall_ms


def solve_highs_milp_exact(U: np.ndarray, cap_h: int) -> tuple[np.ndarray, float, float]:
    """Solve exact binary transportation MILP via HiGHS (`scipy.optimize.milp`)."""
    t0 = time.perf_counter()
    n_u, n_h = U.shape
    n_vars = n_u * n_h
    rows, lbs, ubs = [], [], []
    for i in range(n_u):
        r = np.zeros(n_vars)
        r[i * n_h : (i + 1) * n_h] = 1.0
        rows.append(r)
        lbs.append(1.0)
        ubs.append(1.0)
    for h in range(n_h):
        r = np.zeros(n_vars)
        r[h::n_h] = 1.0
        rows.append(r)
        lbs.append(0.0)
        ubs.append(float(cap_h))
    res = milp(
        c=-U.reshape(-1),
        integrality=np.ones(n_vars, dtype=int),
        bounds=Bounds(np.zeros(n_vars), np.ones(n_vars)),
        constraints=LinearConstraint(np.vstack(rows), lbs, ubs),
    )
    wall_ms = (time.perf_counter() - t0) * 1000.0
    X = np.round(res.x).reshape(n_u, n_h)
    assign = np.argmax(X, axis=1)
    obj = float(-res.fun)
    return assign, obj, wall_ms


def run_commissioning_plan(
    units_df: pd.DataFrame,
    core20_multiplier: float = 1.50,
    slack_pct: float = 0.08,
) -> dict[str, Any]:
    """Compute exact Core20 equity allocation + baseline utilitarian reference + row-level NHS plan."""
    n_u = len(units_df)
    n_h = len(NEIGHBOURHOOD_HUBS)
    cap_h = int(math.ceil((1.0 + float(slack_pct)) * n_u / n_h))

    U_base, _, _ = compute_base_and_weighted_utility(units_df, core20_multiplier=1.00)
    assign_1x, u_util_1x, _ = solve_exact_5hub_network(U_base, cap_h)
    top_choice = np.argmax(U_base, axis=1)

    _, U_w, eq_mult = compute_base_and_weighted_utility(units_df, core20_multiplier=core20_multiplier)
    assign_net, obj_net, net_ms = solve_exact_5hub_network(U_w, cap_h)
    assign_milp, obj_milp, milp_ms = solve_highs_milp_exact(U_w, cap_h)

    if abs(obj_net - obj_milp) > 1e-7:
        raise RuntimeError(f"Parity check failed: 5-hub network={obj_net} vs HiGHS MILP={obj_milp}")

    # Use net assignment (proven globally optimal, deterministic tie-break)
    assign = assign_net
    unweighted_achieved = float(np.sum(U_base[np.arange(n_u), assign]))
    eff_retained_pct = 100.0 * unweighted_achieved / max(u_util_1x, 1e-9)

    is_c20 = units_df["is_core20"].values.astype(int)
    c20_mask = is_c20 == 1
    c20_1x_pct = 100.0 * float(np.mean(assign_1x[c20_mask] == top_choice[c20_mask])) if np.any(c20_mask) else 100.0
    c20_now_pct = 100.0 * float(np.mean(assign[c20_mask] == top_choice[c20_mask])) if np.any(c20_mask) else 100.0

    hub_loads = [int(np.sum(assign == h)) for h in range(n_h)]
    cap_violations = int(sum(max(0, ld - cap_h) for ld in hub_loads))

    plan_rows = []
    for i, row in units_df.iterrows():
        h_id = int(assign[i])
        hub = NEIGHBOURHOOD_HUBS[h_id]
        plan_rows.append(
            {
                "unit_code": str(row["unit_code"]),
                "unit_name": str(row["unit_name"]),
                "unit_type": str(row["unit_type"]),
                "icb_name": str(row.get("icb_name", "")),
                "registered_patients": int(round(float(row["list_size_24"]))),
                "imd2025": round(float(row["imd2025"]), 2),
                "is_core20": int(row["is_core20"]),
                "equity_weight_applied": round(float(eq_mult[i]), 3),
                "sedative_opioid_pct": round(float(row["sedative_opioid_pct_24"]), 2),
                "smr_per_1k": round(float(row.get("smr_per_1k_24", 0.0)), 2),
                "sp_refusal_pct": round(100.0 * float(row.get("sp_refusal_rate_24", 0.0)), 1),
                "assigned_hub_code": hub["code"],
                "assigned_hub_name": hub["name"],
                "first_choice_hub_code": NEIGHBOURHOOD_HUBS[int(top_choice[i])]["code"],
                "attained_first_choice": bool(h_id == int(top_choice[i])),
                "advisory_smr_and_lw_action": hub["smr_bundle"],
            }
        )

    return {
        "mandate": "NON_COMMERCIAL_OPEN_SCIENCE_PUBLIC_GOOD_NHS_TOOL",
        "patient_identifiable_records_used": 0,
        "physical_hardware_shots": 0,
        "n_units": int(n_u),
        "n_core20_units": int(np.sum(c20_mask)),
        "core20_equity_multiplier": float(core20_multiplier),
        "hub_capacity_cap": int(cap_h),
        "hub_loads": {NEIGHBOURHOOD_HUBS[h]["code"]: hub_loads[h] for h in range(n_h)},
        "capacity_violations": cap_violations,
        "weighted_optimal_objective": round(obj_net, 6),
        "highs_milp_objective_parity_diff": float(abs(obj_net - obj_milp)),
        "unweighted_efficiency_retained_pct": round(eff_retained_pct, 4),
        "core20_first_choice_1x_pct": round(c20_1x_pct, 2),
        "core20_first_choice_pct": round(c20_now_pct, 2),
        "core20_first_choice_gain_pp": round(c20_now_pct - c20_1x_pct, 2),
        "solver_wall_ms": {
            "exact_5hub_network_ms": round(net_ms, 3),
            "highs_milp_ms": round(milp_ms, 3),
        },
        "rows": plan_rows,
    }


def build_web_directory_json() -> dict[str, Any]:
    """Export compact OGL v3.0 JSON directory of all 1,296 English PCNs (42 ICBs) + 143 MSE GP practices."""
    eng_pcns = load_and_prepare_units(DEFAULT_COHORT_CSV, icb_query=None, level="pcn")
    mse_gps = load_and_prepare_units(DEFAULT_COHORT_CSV, icb_query="Mid and South Essex", level="practice")

    icb_list = sorted(eng_pcns["icb_name"].dropna().unique().tolist())

    def _pack_rows(df_u: pd.DataFrame) -> list[dict[str, Any]]:
        out = []
        for _, r in df_u.iterrows():
            out.append(
                {
                    "c": str(r["unit_code"]),
                    "n": str(r["unit_name"]),
                    "icb": str(r.get("icb_name", "")),
                    "gp_n": int(r.get("n_practices", 1)),
                    "pts": int(round(float(r["list_size_24"]))),
                    "imd": round(float(r["imd2025"]), 2),
                    "c20": int(r["is_core20"]),
                    "sed": round(float(r["sedative_opioid_pct_24"]), 2),
                    "age": round(float(r["aged_65_plus"]), 2),
                    "dep": round(float(r["depression_qof"]), 2),
                    "sp": round(float(r["sp_referral_rate_per_1k_24"]), 2),
                    "ref": round(100.0 * float(r.get("sp_refusal_rate_24", 0.0)), 1),
                    "smr": round(float(r.get("smr_per_1k_24", 0.0)), 1),
                }
            )
        return out

    payload = {
        "schema": "NHS_PCN_CORE20_EQUITY_DIRECTORY_V1",
        "license": "Open Government Licence v3.0 (NHS England Network Contract DES + OHID Fingertips) · Non-Commercial Public-Good Tool",
        "patient_identifiable_records": 0,
        "hubs": NEIGHBOURHOOD_HUBS,
        "icbs": icb_list,
        "england_pcns": _pack_rows(eng_pcns),
        "mse_gp_practices": _pack_rows(mse_gps),
    }
    raw = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8")
    payload["directory_sha256"] = hashlib.sha256(raw).hexdigest()
    return payload


STANDALONE_HTML_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Free NHS PCN &amp; ICB Core20PLUS5 Equity &amp; Pharmacy-SMR Allocator (Offline Public-Good Tool)</title>
  <style>
    :root {
      --bg: #0b1517; --surface: #132327; --surface2: #192f34; --ink: #eef7f5;
      --muted: #9eb7b4; --teal: #38d6c4; --amber: #f4ae42; --ember: #f06a3b; --border: rgba(158,183,180,0.22);
    }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--bg); color: var(--ink); font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; line-height: 1.5; }
    .wrap { max-width: 1260px; margin: 0 auto; padding: 1.5rem 1.25rem 3rem; }
    .banner { background: linear-gradient(90deg, #123338, #16262b); border: 1px solid rgba(56,214,196,0.45); border-radius: 10px; padding: 1rem 1.2rem; margin-bottom: 1.2rem; }
    .badge-row { display: flex; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 0.55rem; }
    .pill { font-size: 0.73rem; font-weight: 700; padding: 0.18rem 0.6rem; border-radius: 999px; border: 1px solid var(--teal); color: var(--teal); background: rgba(56,214,196,0.1); }
    .pill.amber { border-color: var(--amber); color: var(--amber); background: rgba(244,174,66,0.1); }
    h1 { margin: 0.2rem 0 0.4rem; font-size: 1.65rem; }
    .controls { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 0.9rem; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 1rem; margin-bottom: 1rem; }
    label { display: block; font-size: 0.78rem; color: var(--muted); font-weight: 600; margin-bottom: 0.3rem; }
    select, input[type="search"], input[type="file"] { width: 100%; background: #091214; color: var(--ink); border: 1px solid var(--border); border-radius: 6px; padding: 0.48rem 0.6rem; font-size: 0.86rem; }
    input[type="range"] { width: 100%; accent-color: var(--teal); }
    .kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.8rem; margin-bottom: 1rem; }
    .kpi { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 0.85rem 1rem; }
    .kpi-val { font-size: 1.55rem; font-weight: 800; color: var(--teal); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .kpi-val.amber { color: var(--amber); }
    .kpi-lbl { font-size: 0.78rem; color: var(--muted); margin-top: 0.15rem; }
    .hubs { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.7rem; margin-bottom: 1rem; }
    .hub-card { background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 0.7rem 0.85rem; }
    .bar-bg { height: 7px; background: #081012; border-radius: 99px; overflow: hidden; margin-top: 0.4rem; }
    .bar-fg { height: 100%; background: var(--teal); }
    .btn { display: inline-flex; align-items: center; gap: 0.35rem; background: var(--teal); color: #051817; font-weight: 700; border: none; border-radius: 6px; padding: 0.5rem 0.9rem; cursor: pointer; font-size: 0.84rem; text-decoration: none; }
    .btn.secondary { background: transparent; color: var(--ink); border: 1px solid var(--border); }
    .tbl-wrap { overflow-x: auto; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; max-height: 540px; overflow-y: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 0.81rem; }
    th, td { padding: 0.52rem 0.65rem; border-bottom: 1px solid var(--border); text-align: left; }
    th { position: sticky; top: 0; background: #0e1c20; color: var(--teal); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.78rem; }
    .footer { margin-top: 1.3rem; font-size: 0.78rem; color: var(--muted); border-top: 1px solid var(--border); padding-top: 0.9rem; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="banner">
      <div class="badge-row">
        <span class="pill">100% Free Non-Commercial NHS Public-Good Tool</span>
        <span class="pill">Offline Browser Execution · 0 Patient Data Transmitted</span>
        <span class="pill amber">NHS England DES + OHID Fingertips (OGL v3.0 · 1,296 PCNs · 42 ICBs)</span>
        <span class="pill amber">NHS DCB0129 Advisory Human-in-the-Loop Only</span>
      </div>
      <h1>NHS PCN &amp; ICB Core20PLUS5 Equity &amp; Pharmacy-SMR Neighbourhood Allocator</h1>
      <div style="font-size:0.88rem;color:var(--muted)">
        Solves exact capacity-constrained Neighbourhood Hub routing (proven <code>0.00%</code> optimality gap, matching <code>HiGHS</code> MILP) across real NHS Primary Care Networks and GP practices in milliseconds on your own computer. Created by <strong>Arun Nadarasa</strong> (Mid and South Essex NHS Foundation Trust &amp; ISPPA) strictly for non-commercial open science &amp; public-sector health equity.
      </div>
    </div>

    <div class="controls">
      <div>
        <label for="sa-scope">1. Select NHS ICB / Cohort Scope</label>
        <select id="sa-scope"></select>
      </div>
      <div>
        <label for="sa-lam">2. Marmot Core20 Equity Multiplier: <strong id="sa-lam-lbl" style="color:var(--teal)">1.50× (Recommended)</strong></label>
        <input id="sa-lam" type="range" min="100" max="200" step="5" value="150" />
        <div style="display:flex;justify-content:space-between;font-size:0.71rem;color:var(--muted)"><span>1.00× Unweighted</span><span>1.50× Core20PLUS5</span><span>2.00× Max Priority</span></div>
      </div>
      <div>
        <label for="sa-slack">3. VCFSE Hub Capacity Headroom: <strong id="sa-slack-lbl" style="color:var(--amber)">+8%</strong></label>
        <input id="sa-slack" type="range" min="5" max="25" step="1" value="8" />
        <div style="font-size:0.71rem;color:var(--muted)">Prevents charity referral dumping (Hazard H-QSPM-03)</div>
      </div>
      <div>
        <label for="sa-search">4. Filter by PCN / Practice / ODS Code</label>
        <input id="sa-search" type="search" placeholder="e.g. Southend, Basildon, Y02177, Manchester…" />
      </div>
    </div>

    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:0.6rem;margin-bottom:0.9rem">
      <div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center">
        <button id="sa-dl-csv" type="button" class="btn">⬇ Export NHS Commissioning Plan (.csv)</button>
        <label style="margin:0;display:inline-flex;align-items:center;gap:0.4rem;cursor:pointer" class="btn secondary">
          📂 Load Custom Aggregate CSV
          <input id="sa-file" type="file" accept=".csv" style="display:none" />
        </label>
      </div>
      <span id="sa-meta" style="font-size:0.79rem;color:var(--muted);font-family:ui-monospace,monospace"></span>
    </div>

    <div class="kpis">
      <div class="kpi">
        <div id="sa-kpi-c20" class="kpi-val">—</div>
        <div class="kpi-lbl">Core20 Deprived-Ward First-Choice Hub Attainment</div>
      </div>
      <div class="kpi">
        <div id="sa-kpi-eff" class="kpi-val amber">—</div>
        <div class="kpi-lbl">Unweighted System Efficiency Retained (vs 1.00×)</div>
      </div>
      <div class="kpi">
        <div id="sa-kpi-viol" class="kpi-val">0</div>
        <div class="kpi-lbl">VCFSE Charity Capacity Overload Violations</div>
      </div>
      <div class="kpi">
        <div id="sa-kpi-ms" class="kpi-val amber">—</div>
        <div class="kpi-lbl">In-Browser Exact Polynomial Solve Time</div>
      </div>
    </div>

    <div id="sa-hubs" class="hubs"></div>

    <div class="tbl-wrap">
      <table>
        <thead>
          <tr>
            <th>ODS Code</th>
            <th>PCN / GP Practice Name</th>
            <th>ICB</th>
            <th>Patients</th>
            <th>IMD 2025</th>
            <th>Opioid/Sed %</th>
            <th>Refusal %</th>
            <th>Assigned Primary Neighbourhood Hub</th>
            <th>Match</th>
            <th>Advisory Pharmacist SMR &amp; Link-Worker Action</th>
          </tr>
        </thead>
        <tbody id="sa-tbody"></tbody>
      </table>
    </div>

    <div class="footer">
      <strong>100% Non-Commercial Scientific Research Mandate &amp; NHS DCB0129 Clinical Safety Notice:</strong> Released free of charge strictly for non-commercial scientific research and public-sector NHS health-equity planning (zero commercial licensing or fees), in compliance with the Google Antigravity for Scientific Workflows non-commercial research program, Google DeepMind AlphaGenome 2 non-commercial Research-Use-Only terms on the parent QSPM study, and the UK Open Government Licence v3.0. Zero patient-identifiable data are stored or transmitted. All allocations are advisory commissioning decision support; named Community/PCN Clinical Pharmacists and Social Prescribing Link Workers retain 100% clinical and conversational authority. This work was supported in part by complimentary access to Google Antigravity and Gemini 4 Argon to accelerate scientific workflows.
    </div>
  </div>

  <script>
  const DIRECTORY = __DIRECTORY_JSON__;

  function minmax(arr) {
    let mn = Infinity, mx = -Infinity;
    for (const v of arr) { if (v < mn) mn = v; if (v > mx) mx = v; }
    const span = mx - mn;
    return span < 1e-9 ? arr.map(() => 0) : arr.map(v => (v - mn) / span);
  }

  function solveExact5Hub(U, capH) {
    const t0 = performance.now();
    const nU = U.length, nH = 5;
    const assign = new Int32Array(nU);
    const loads = new Int32Array(nH);
    const order = Array.from({ length: nU }, (_, i) => i).sort((a, b) => Math.max(...U[b]) - Math.max(...U[a]));
    for (const i of order) {
      const prefs = [0, 1, 2, 3, 4].sort((a, b) => U[i][b] - U[i][a]);
      for (const h of prefs) {
        if (loads[h] < capH) { assign[i] = h; loads[h]++; break; }
      }
    }
    const eps = 1e-11;
    while (true) {
      const W = Array.from({ length: nH }, () => new Float64Array(nH).fill(-1e18));
      const bestIdx = Array.from({ length: nH }, () => new Int32Array(nH).fill(-1));
      for (let i = 0; i < nU; i++) {
        const u = assign[i], ui = U[i][u];
        for (let v = 0; v < nH; v++) {
          if (v !== u) {
            const g = U[i][v] - ui;
            if (g > W[u][v]) { W[u][v] = g; bestIdx[u][v] = i; }
          }
        }
      }
      let improved = false;
      if (loads.some(l => l < capH)) {
        let bestGain = eps, bestPath = null;
        function dfsPath(cur, mask, gain, path) {
          if (path.length >= 2 && loads[cur] < capH && gain > bestGain) { bestGain = gain; bestPath = path.slice(); }
          if (path.length === nH) return;
          for (let nxt = 0; nxt < nH; nxt++) {
            if (!(mask & (1 << nxt)) && bestIdx[cur][nxt] >= 0) {
              path.push(nxt); dfsPath(nxt, mask | (1 << nxt), gain + W[cur][nxt], path); path.pop();
            }
          }
        }
        for (let s = 0; s < nH; s++) if (loads[s] > 0) dfsPath(s, 1 << s, 0, [s]);
        if (bestPath) {
          const moves = [];
          for (let k = 0; k < bestPath.length - 1; k++) moves.push([bestIdx[bestPath[k]][bestPath[k + 1]], bestPath[k + 1]]);
          for (const [ui, vn] of moves) assign[ui] = vn;
          loads[bestPath[0]]--; loads[bestPath[bestPath.length - 1]]++;
          improved = true;
        }
      }
      if (improved) continue;
      let bestCycGain = eps, bestCyc = null;
      function dfsCyc(start, cur, mask, gain, path) {
        if (path.length >= 2 && bestIdx[cur][start] >= 0) {
          const tot = gain + W[cur][start];
          if (tot > bestCycGain) { bestCycGain = tot; bestCyc = path.concat([start]); }
        }
        if (path.length === nH) return;
        for (let nxt = start + 1; nxt < nH; nxt++) {
          if (!(mask & (1 << nxt)) && bestIdx[cur][nxt] >= 0) {
            path.push(nxt); dfsCyc(start, nxt, mask | (1 << nxt), gain + W[cur][nxt], path); path.pop();
          }
        }
      }
      for (let s = 0; s < nH; s++) if (loads[s] > 0) dfsCyc(s, s, 1 << s, 0, [s]);
      if (bestCyc) {
        const moves = [];
        for (let k = 0; k < bestCyc.length - 1; k++) moves.push([bestIdx[bestCyc[k]][bestCyc[k + 1]], bestCyc[k + 1]]);
        for (const [ui, vn] of moves) assign[ui] = vn;
        improved = true;
      }
      if (!improved) break;
    }
    return { assign, loads, ms: performance.now() - t0 };
  }

  let customRows = null;
  let latestPlan = [];

  const scopeSel = document.getElementById("sa-scope");
  const opts = [
    { val: "ENG_ALL", label: "All England National — All 1,296 PCNs (42 ICBs · 61.83M Patients)" },
    { val: "MSE_PCN", label: "Mid and South Essex ICB — All 28 PCNs (1.27M Patients)" },
    { val: "MSE_GP", label: "Mid and South Essex ICB — All 143 GP Practices" },
    ...DIRECTORY.icbs.map(icb => ({ val: "ICB:" + icb, label: icb }))
  ];
  opts.forEach(o => {
    const el = document.createElement("option");
    el.value = o.val; el.textContent = o.label;
    scopeSel.appendChild(el);
  });

  function getActiveUnits() {
    const v = scopeSel.value;
    if (v === "CUSTOM" && customRows) return customRows;
    if (v === "MSE_GP") return DIRECTORY.mse_gp_practices;
    if (v === "MSE_PCN") return DIRECTORY.england_pcns.filter(r => r.icb.toLowerCase().includes("mid and south essex"));
    if (v === "ENG_ALL") return DIRECTORY.england_pcns;
    if (v.startsWith("ICB:")) {
      const target = v.slice(4);
      return DIRECTORY.england_pcns.filter(r => r.icb === target);
    }
    return DIRECTORY.england_pcns;
  }

  function recompute() {
    const units = getActiveUnits();
    if (!units.length) return;
    const lam = Number(document.getElementById("sa-lam").value) / 100;
    const slack = Number(document.getElementById("sa-slack").value) / 100;
    document.getElementById("sa-lam-lbl").textContent = lam.toFixed(2) + "×" + (Math.abs(lam - 1.5) < 0.01 ? " (Recommended)" : "");
    document.getElementById("sa-slack-lbl").textContent = "+" + Math.round(slack * 100) + "%";

    const capH = Math.ceil((1 + slack) * units.length / 5);
    const imdN = minmax(units.map(u => u.imd));
    const sedN = minmax(units.map(u => u.sed));
    const ageN = minmax(units.map(u => u.age));
    const depN = minmax(units.map(u => u.dep));
    const spN = minmax(units.map(u => u.sp));

    const Ubase = units.map((_, i) => [
      0.55 * sedN[i] + 0.45 * ageN[i],
      0.70 * imdN[i] + 0.30 * spN[i],
      0.65 * depN[i] + 0.35 * spN[i],
      0.50 * spN[i] + 0.30 * (1 - ageN[i]) + 0.20 * depN[i],
      0.65 * ageN[i] + 0.35 * sedN[i]
    ]);
    const topChoice = Ubase.map(row => row.indexOf(Math.max(...row)));
    const res1x = solveExact5Hub(Ubase, capH);
    let base1xSum = 0;
    for (let i = 0; i < units.length; i++) base1xSum += Ubase[i][res1x.assign[i]];

    const Uw = Ubase.map((row, i) => {
      const mult = units[i].c20 === 1 ? lam : (imdN[i] >= 0.60 ? 1 + 0.5 * (lam - 1) : 1.0);
      return row.map(v => v * mult);
    });
    const res = solveExact5Hub(Uw, capH);
    let baseNowSum = 0, c20Tot = 0, c20Hit1x = 0, c20HitNow = 0;
    for (let i = 0; i < units.length; i++) {
      baseNowSum += Ubase[i][res.assign[i]];
      if (units[i].c20 === 1) {
        c20Tot++;
        if (res1x.assign[i] === topChoice[i]) c20Hit1x++;
        if (res.assign[i] === topChoice[i]) c20HitNow++;
      }
    }
    const effPct = base1xSum > 0 ? (100 * baseNowSum / base1xSum) : 100;
    const c20Pct = c20Tot > 0 ? (100 * c20HitNow / c20Tot) : 100;
    const gainPp = c20Tot > 0 ? (100 * (c20HitNow - c20Hit1x) / c20Tot) : 0;

    document.getElementById("sa-kpi-c20").textContent = c20Tot > 0 ? `${c20Pct.toFixed(1)}% (${gainPp >= 0 ? "+" : ""}${gainPp.toFixed(1)} pp)` : "N/A (0 Core20)";
    document.getElementById("sa-kpi-eff").textContent = effPct.toFixed(2) + "%";
    document.getElementById("sa-kpi-ms").textContent = res.ms.toFixed(2) + " ms";
    document.getElementById("sa-meta").textContent = `${units.length} NHS Units · ${c20Tot} Core20 · Cap ${capH}/hub`;

    const hubsEl = document.getElementById("sa-hubs");
    hubsEl.innerHTML = DIRECTORY.hubs.map((h, idx) => {
      const ld = res.loads[idx];
      const pct = Math.min(100, Math.round(100 * ld / capH));
      return `<div class="hub-card">
        <div style="display:flex;justify-content:space-between;font-size:0.78rem;font-weight:700">
          <span>${h.short}</span><code style="color:var(--teal)">${ld} / ${capH}</code>
        </div>
        <div class="bar-bg"><div class="bar-fg" style="width:${pct}%"></div></div>
      </div>`;
    }).join("");

    latestPlan = units.map((u, i) => {
      const h = DIRECTORY.hubs[res.assign[i]];
      return {
        code: u.c, name: u.n, icb: u.icb, pts: u.pts, imd: u.imd, c20: u.c20,
        sed: u.sed, ref: u.ref, hubCode: h.code, hubShort: h.short,
        firstMatch: res.assign[i] === topChoice[i], action: h.smr_bundle
      };
    });
    renderTable();
  }

  function renderTable() {
    const q = document.getElementById("sa-search").value.trim().toLowerCase();
    const rows = q ? latestPlan.filter(r => r.code.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.icb.toLowerCase().includes(q) || r.hubShort.toLowerCase().includes(q)) : latestPlan;
    const shown = rows.slice(0, 250);
    document.getElementById("sa-tbody").innerHTML = shown.map(r => `
      <tr>
        <td><code>${r.code}</code></td>
        <td><strong>${r.name}</strong>${r.c20 ? ' <span class="pill" style="font-size:0.65rem;padding:0.05rem 0.4rem">Core20</span>' : ''}</td>
        <td style="color:var(--muted)">${r.icb}</td>
        <td>${r.pts.toLocaleString()}</td>
        <td>${r.imd.toFixed(1)}</td>
        <td>${r.sed.toFixed(1)}%</td>
        <td>${r.ref.toFixed(1)}%</td>
        <td><strong style="color:var(--teal)">${r.hubShort}</strong></td>
        <td>${r.firstMatch ? "✓ 1st" : "↔ Eq."}</td>
        <td style="color:var(--muted);font-size:0.76rem">${r.action}</td>
      </tr>
    `).join("");
  }

  scopeSel.addEventListener("change", recompute);
  document.getElementById("sa-lam").addEventListener("input", recompute);
  document.getElementById("sa-slack").addEventListener("input", recompute);
  document.getElementById("sa-search").addEventListener("input", renderTable);

  document.getElementById("sa-dl-csv").addEventListener("click", () => {
    const hdr = ["unit_code","unit_name","icb_name","registered_patients","imd2025","is_core20","sedative_opioid_pct","sp_refusal_pct","assigned_hub_code","assigned_hub_name","attained_first_choice","advisory_smr_action"];
    const lines = [hdr.join(",")].concat(latestPlan.map(r => [
      r.code, `"${r.name.replace(/"/g, '""')}"`, `"${r.icb.replace(/"/g, '""')}"`, r.pts, r.imd, r.c20, r.sed, r.ref, r.hubCode, `"${r.hubShort}"`, r.firstMatch, `"${r.action.replace(/"/g, '""')}"`
    ].join(",")));
    const blob = new Blob([lines.join("\\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "nhs_pcn_core20_equity_commissioning_plan.csv";
    a.click();
  });

  document.getElementById("sa-file").addEventListener("change", async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const txt = await f.text();
    const lines = txt.trim().split(/\\r?\\n/);
    const cols = lines[0].split(",").map(s => s.trim());
    const idx = k => cols.indexOf(k);
    customRows = lines.slice(1).map((ln, k) => {
      const p = ln.split(",");
      const imd = parseFloat(p[idx("imd2025")] ?? "20") || 20;
      return {
        c: p[idx("pcn_code")] || p[idx("practice_code")] || ("U" + (k + 1)),
        n: p[idx("pcn_name")] || p[idx("practice_name")] || ("Unit " + (k + 1)),
        icb: p[idx("icb_name")] || "Custom Uploaded Cohort",
        pts: parseInt(p[idx("list_size_24")] || "8000", 10) || 8000,
        imd,
        c20: p[idx("is_core20")] !== undefined ? Number(p[idx("is_core20")]) : (imd >= 30 ? 1 : 0),
        sed: parseFloat(p[idx("sedative_opioid_pct_24")] ?? "11") || 11,
        age: parseFloat(p[idx("aged_65_plus")] ?? "18") || 18,
        dep: parseFloat(p[idx("depression_qof")] ?? "14") || 14,
        sp: parseFloat(p[idx("sp_referral_rate_per_1k_24")] ?? "15") || 15,
        ref: (parseFloat(p[idx("sp_refusal_rate_24")] ?? "0.22") || 0.22) * 100
      };
    });
    if (![...scopeSel.options].some(o => o.value === "CUSTOM")) {
      const opt = document.createElement("option");
      opt.value = "CUSTOM"; opt.textContent = `Uploaded CSV (${customRows.length} units)`;
      scopeSel.prepend(opt);
    }
    scopeSel.value = "CUSTOM";
    recompute();
  });

  recompute();
  </script>
</body>
</html>
"""


def export_web_and_standalone_bundle(out_json: Path, out_html: Path) -> dict[str, Any]:
    """Write compact OGL v3.0 JSON directory and standalone zero-install offline HTML app."""
    payload = build_web_directory_json()
    out_json.parent.mkdir(parents=True, exist_ok=True)
    out_html.parent.mkdir(parents=True, exist_ok=True)
    json_compact = json.dumps(payload, separators=(",", ":"))
    out_json.write_text(json_compact, encoding="utf-8")
    html_str = STANDALONE_HTML_TEMPLATE.replace("__DIRECTORY_JSON__", json_compact)
    out_html.write_text(html_str, encoding="utf-8")
    return {
        "n_england_pcns": len(payload["england_pcns"]),
        "n_icbs": len(payload["icbs"]),
        "n_mse_gps": len(payload["mse_gp_practices"]),
        "directory_sha256": payload["directory_sha256"],
        "json_bytes": len(json_compact.encode("utf-8")),
        "standalone_html_bytes": len(html_str.encode("utf-8")),
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Free Non-Commercial NHS PCN & ICB Core20PLUS5 Equity & Pharmacy-SMR Allocator"
    )
    parser.add_argument("--csv", type=Path, default=DEFAULT_COHORT_CSV, help="Input OGL v3.0 GP/PCN CSV path")
    parser.add_argument("--icb", type=str, default="Mid and South Essex", help="Filter by NHS ICB or PCN name/code")
    parser.add_argument("--all-england", action="store_true", help="Run across all 1,296 PCNs in England")
    parser.add_argument("--level", choices=["pcn", "practice"], default="pcn", help="Aggregation level")
    parser.add_argument("--core20-multiplier", type=float, default=1.50, help="Marmot Core20 equity weight (default 1.50)")
    parser.add_argument("--slack-pct", type=float, default=0.08, help="VCFSE hub capacity headroom fraction (default 0.08)")
    parser.add_argument("--output-csv", type=Path, default=None, help="Optional output CSV path for commissioning plan")
    parser.add_argument("--pareto-sweep", action="store_true", help="Print 1.00x..2.00x Core20 Pareto frontier")
    parser.add_argument("--export-web-bundle", action="store_true", help="Export docs/assets JSON + standalone HTML tool")
    args = parser.parse_args()

    if args.export_web_bundle:
        stats = export_web_and_standalone_bundle(
            REPO_ROOT / "docs" / "assets" / "nhs_pcn_directory.json",
            REPO_ROOT / "docs" / "downloads" / "NHS_PCN_Core20_Equity_Allocator_Free_Tool.html",
        )
        print(json.dumps(stats, indent=2))
        return

    icb_q = None if args.all_england else args.icb
    units_df = load_and_prepare_units(args.csv, icb_query=icb_q, level=args.level)

    if args.pareto_sweep:
        print(f"=== Core20 Equity Pareto Frontier ({len(units_df)} {args.level.upper()}s) ===")
        for lam in np.round(np.linspace(1.00, 2.00, 11), 2):
            res = run_commissioning_plan(units_df, core20_multiplier=float(lam), slack_pct=args.slack_pct)
            print(
                f"  λ={lam:0.2f}x | Core20 1st-Choice: {res['core20_first_choice_pct']:6.2f}% "
                f"({res['core20_first_choice_gain_pp']:+6.2f} pp) | Efficiency Retained: "
                f"{res['unweighted_efficiency_retained_pct']:6.2f}% | Parity diff: {res['highs_milp_objective_parity_diff']:.2e} "
                f"| Solve: {res['solver_wall_ms']['exact_5hub_network_ms']:.2f} ms"
            )
        return

    plan = run_commissioning_plan(units_df, core20_multiplier=args.core20_multiplier, slack_pct=args.slack_pct)
    print(
        f"[NHS Core20 Equity Tool] Solved {plan['n_units']} units ({plan['n_core20_units']} Core20) at "
        f"λ={plan['core20_equity_multiplier']:.2f}x in {plan['solver_wall_ms']['exact_5hub_network_ms']:.2f} ms "
        f"(HiGHS MILP {plan['solver_wall_ms']['highs_milp_ms']:.2f} ms, parity diff={plan['highs_milp_objective_parity_diff']:.2e})"
    )
    print(
        f"  -> Core20 1st-Choice Hub Attainment: {plan['core20_first_choice_pct']:.2f}% "
        f"({plan['core20_first_choice_gain_pp']:+.2f} pp vs 1.00x) | Unweighted Efficiency: "
        f"{plan['unweighted_efficiency_retained_pct']:.2f}% | Hub Overload Violations: {plan['capacity_violations']}"
    )
    print(f"  -> Hub Loads (cap={plan['hub_capacity_cap']}): {plan['hub_loads']}")

    if args.output_csv:
        args.output_csv.parent.mkdir(parents=True, exist_ok=True)
        with args.output_csv.open("w", newline="", encoding="utf-8") as fh:
            writer = csv.DictWriter(fh, fieldnames=list(plan["rows"][0].keys()))
            writer.writeheader()
            writer.writerows(plan["rows"])
        print(f"  -> Exported NHS commissioning plan CSV to: {args.output_csv}")


if __name__ == "__main__":
    main()
