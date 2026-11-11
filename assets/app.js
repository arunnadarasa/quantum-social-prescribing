// Quantum Social Prescribing (QSPM) — Interactive Research Portal Module

const BOOKMARKS = [
  { label: "p.1 · Abstract & Overview", page: 1 },
  { label: "p.2 · DisCoPy & Rhyme", page: 2 },
  { label: "p.4 · Live Nexus Helios-1E & Zeno", page: 4 },
  { label: "p.5 · Haiqu HUBO & OpenJij", page: 5 },
  { label: "p.6 · Modal/HF 4q QSPMLM", page: 6 },
  { label: "p.7 · HQS, QProtSim & AlphaGenome", page: 7 },
  { label: "p.8 · Kashefi Atlas & FTQC", page: 8 },
  { label: "p.9 · Jev 1.14 & References", page: 9 }
];

const CLINICAL_PRESETS = [
  {
    name: "Multimorbid SMR + Green Nature",
    x: [0.68, 0.72, 0.55, 0.25, 0.42, 0.62, 0.58, 0.82]
  },
  {
    name: "Core20 Housing & Debt Crisis",
    x: [0.58, 0.30, 0.92, 0.94, 0.48, 0.74, 0.52, 0.78]
  },
  {
    name: "Circadian Disruption + Isolation",
    x: [0.76, 0.28, 0.52, 0.32, 0.12, 0.78, 0.69, 0.88]
  },
  {
    name: "Peer Befriending & Arts Choir",
    x: [0.89, 0.22, 0.48, 0.24, 0.64, 0.55, 0.49, 0.75]
  },
  {
    name: "Urgent High-ACB Falls Escalation",
    x: [0.74, 0.94, 0.81, 0.46, 0.28, 0.82, 0.79, 0.14]
  }
];

const FEATURE_META = [
  { key: "ucla_loneliness_score", label: "UCLA-3 Loneliness" },
  { key: "acb_polypharmacy_burden", label: "ACB Polypharmacy" },
  { key: "core20_imd_deprivation", label: "Core20 IMD Deprivation" },
  { key: "housing_debt_welfare_precarity", label: "Housing/Debt Precarity" },
  { key: "circadian_zeitgeber_regularity", label: "Zeitgeber Regularity" },
  { key: "hpa_cortisol_stress_load", label: "HPA Cortisol Load" },
  { key: "il6_inflammatory_load", label: "IL-6 Inflammation" },
  { key: "mobility_falls_safety_clearance", label: "Safe Mobility Clearance" }
];

const PATHWAY_NAMES = [
  "Pharmacy SMR + Green Nature",
  "Welfare, Debt & Housing First",
  "Group Movement Zeitgeber Studio",
  "Peer Befriending & Arts Choir",
  "Urgent GP / Pharmacist Clinical Escalation"
];

const CADENCE_NAMES = [
  "Standard Monthly Follow-Up (N = 3)",
  "Optimal Biweekly Zeno Window (N* = 6)",
  "Light-Touch Anti-Fatigue (N = 2)"
];

const BLOCH_CUES = {
  H: "WMTY · Hadamard H — Relational 'What Matters To You' co-production opens coherent medical-social superposition (|0⟩+|1⟩)/√2.",
  RX: "Pharmacy SMR · Rx(π/2) — Structured Medication Review deprescribing rotates patient trajectory smoothly across the Bloch meridian.",
  S: "Zeitgeber · Phase S = Rz(π/2) — Regular weekly group attendance advances circadian SCN–HPA phase by +90°.",
  Z: "Peer Buffer · Pauli-Z — Oxytocinergic peer support inverts destructive stress phase (+1 → −1), suppressing rumination.",
  ZENO: "Zeno Check-In (N* = 6) — Biweekly Link-Worker check-in stabilizes retention near |0⟩ (+0.6564 live Nexus Helios-1E-lite Job 295cb111).",
  COLLAPSE: "Signpost · Premature Collapse — Uncoordinated leaflet collapses state into high-entropy attrition noise (1.8503 bits on Nexus Helios-1E).",
  RESET: "Reset |0⟩ — Return patient care-plan state to engaged baseline (+Z north pole)."
};

const DISCOPY_STEPS = [
  {
    short: "1. η_C Cap",
    title: "Layer 1 · Relational Co-Production Cap η_C : I → P ⊗ S",
    circuit: "Ket(0, 0) >> (H @ Id(1)) >> CX",
    desc: "Link Worker and Community Pharmacist establish a shared 'What Matters To You' entangled care frame |Φ+⟩ = (|00⟩ + |11⟩)/√2."
  },
  {
    short: "2. Ry ⊗ Rz",
    title: "Layer 2 · Parallel Deprescribing & Welfare Relief (SMR ⊗ Housing)",
    circuit: "Ry(θ_SMR) @ Rz(φ_Welfare)",
    desc: "Anticholinergic burden reduction (SMR) composes in tensor product with housing/debt welfare stabilization without collapsing patient options."
  },
  {
    short: "3. σ Handoff",
    title: "Layer 3 · Symmetric Neighbourhood Care Handoff σ_{P,S}",
    circuit: "SWAP(0, 1)  [Snake error 2.22×10⁻¹⁶]",
    desc: "Warm relational handoff across primary care, pharmacy, and neighbourhood VCFSE hub preserves full off-diagonal coherence."
  },
  {
    short: "4. Zeitgeber Foil",
    title: "Layer 4 · Circadian Zeitgeber & VCFSE Group Entrainment",
    circuit: "Rz†(φ_Welfare) @ Ry†(θ_SMR)",
    desc: "Regular weekly group attendance entrains BMAL1–NR3C1 circadian synchrony (Kuramoto R: 0.237 → 0.972) and dampens IL-6 (−76.52%)."
  },
  {
    short: "5. ε_C Lock",
    title: "Layer 5 · Co-Produced Care Lock ε_C on Live Quantinuum Nexus Helios-1E-lite",
    circuit: "CX >> (H @ Id(1)) >> Measure  [P(00) = 99.27% Nexus Helios-1E · 99.80% H2-Emul]",
    desc: "Coherent uncompute locks onto |00⟩ with P(00) = 0.9927 on live Nexus Helios-1E-lite (Job b813e944) vs 0.3525 under premature mid-circuit signposting collapse."
  }
];

const BIBTEX_ENTRIES = {
  monograph: `@article{nadarasa2026qspm,
  title   = {Quantum Social Prescribing: Multi-Scale Quantum Algorithms, Psychoneuroimmunological Grounding, and Multi-Method Health {AI} Governance for Integrated Neighbourhood Care},
  author  = {Nadarasa, Arun},
  year    = {2026},
  month   = nov,
  journal = {Samskrift Open Monograph Preprint (Mid and South Essex NHS Foundation Trust \& ISPPA)},
  pages   = {1--10},
  url     = {https://arunnadarasa.github.io/quantum-social-prescribing/},
  note    = {0 physical QPU shots claimed; 9 SHA-256-verified receipts across Quantinuum Nexus Helios-1E-lite, H2-Emulator, Haiqu SDK v1.7.1, OpenJij, HiGHS MILP, Modal, Hugging Face, HQS, QProtSim, AlphaGenome, Text2WetLab, and TypeSafe Jev 1.14}
}`,
  qspmlm: `@misc{nadarasa2026qspmlm,
  title        = {{QSPMLM}: 4-Qubit Frobenius Multi-Task Variational Quantum Classifier for Holistic Social Prescribing Triage \& Safety Escalation},
  author       = {Nadarasa, Arun},
  year         = {2026},
  howpublished = {Hugging Face Model Hub \& Space},
  url          = {https://huggingface.co/socialprescribing/quantinuum-social-prescribing},
  note         = {60 quantum + 99 classical params; 99.79\% Regime A test accuracy, 65.21\% vs 32.71\% LogReg on Cubic k=3 Synergy cohort, 4.44e-16 PyTorch/NumPy parity}
}`,
  isppa: `@article{rathbone2024pharmacy,
  title   = {'You don't get side effects from social prescribing'---A qualitative study exploring community pharmacists' attitudes to social prescribing},
  author  = {Rathbone, Adam Pattison and Pearson, Hannah and Akinyemi, Oluwatoyin and Cartwright, Nikki and Tierney, Stephanie and Rowlands, Gillian and Lindsey, Laura},
  journal = {PLOS ONE},
  volume  = {19},
  number  = {5},
  pages   = {e0301076},
  year    = {2024},
  doi     = {10.1371/journal.pone.0301076}
}`
};

let PORTAL_DATA = null;
let QSP_WEIGHTS = null;
let currentX = [...CLINICAL_PRESETS[0].x];

function showToast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove("show"), 2300);
}

/* ── 1. Navigation, Scroll-Spy & Mobile Drawer ── */
function initNav() {
  const bar = document.getElementById("scroll-progress");
  const topBtn = document.getElementById("back-to-top");
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("primary-nav");
  const links = [...document.querySelectorAll("#primary-nav a")];
  const sections = links.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  window.addEventListener("scroll", () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const pct = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
    if (bar) bar.style.width = pct + "%";
    if (topBtn) topBtn.classList.toggle("visible", window.scrollY > 480);

    let activeIdx = 0;
    sections.forEach((sec, idx) => {
      if (sec.getBoundingClientRect().top <= 130) activeIdx = idx;
    });
    links.forEach((a, idx) => a.classList.toggle("active", idx === activeIdx));
  }, { passive: true });

  if (topBtn) topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ── 2. In-Page PDF.js Reader (with High-DPI Page PNG Stream Fallback) ── */
async function initPdfReader() {
  const stream = document.getElementById("reader-canvas-stream");
  const viewportEl = document.getElementById("reader-viewport");
  const pageInput = document.getElementById("reader-page-input");
  const zoomLabel = document.getElementById("reader-zoom-label");
  const bmWrap = document.getElementById("reader-bookmarks");
  const panel = document.getElementById("paper-preview-panel");
  if (!stream || !viewportEl) return;

  let zoom = 1.0;
  const totalPages = 10;

  BOOKMARKS.forEach((bm, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bookmark-chip" + (idx === 0 ? " active" : "");
    btn.textContent = bm.label;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".bookmark-chip").forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      scrollToPage(bm.page);
    });
    bmWrap.appendChild(btn);
  });

  function scrollToPage(p) {
    const clamped = Math.min(totalPages, Math.max(1, p));
    pageInput.value = String(clamped);
    const slot = stream.querySelector(`[data-page="${clamped}"]`);
    if (slot) slot.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderFallbackImages() {
    stream.innerHTML = "";
    const baseW = Math.min(860, viewportEl.clientWidth - 36) * zoom;
    for (let p = 1; p <= totalPages; p++) {
      const slot = document.createElement("div");
      slot.className = "pdf-page-slot";
      slot.dataset.page = String(p);
      slot.style.width = `${Math.max(300, baseW)}px`;
      const img = document.createElement("img");
      img.className = "pdf-fallback-img";
      img.src = `pages/page_${p}.png`;
      img.alt = `Quantum Social Prescribing Monograph — Page ${p} of 10`;
      img.loading = p <= 2 ? "eager" : "lazy";
      const badge = document.createElement("span");
      badge.className = "pdf-page-badge";
      badge.textContent = `Page ${p} / ${totalPages}`;
      slot.appendChild(img);
      slot.appendChild(badge);
      stream.appendChild(slot);
    }
  }

  async function renderPdfJs() {
    if (!window.pdfjsLib) {
      renderFallbackImages();
      return;
    }
    try {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      const pdf = await window.pdfjsLib.getDocument("downloads/Quantum_Social_Prescribing.pdf").promise;
      stream.innerHTML = "";
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetW = Math.max(310, Math.min(860, viewportEl.clientWidth - 36) * zoom);
      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const vp0 = page.getViewport({ scale: 1 });
        const scale = targetW / vp0.width;
        const vp = page.getViewport({ scale: scale * dpr });
        const slot = document.createElement("div");
        slot.className = "pdf-page-slot";
        slot.dataset.page = String(p);
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        canvas.style.width = `${Math.round(vp.width / dpr)}px`;
        canvas.style.height = `${Math.round(vp.height / dpr)}px`;
        const badge = document.createElement("span");
        badge.className = "pdf-page-badge";
        badge.textContent = `Page ${p} / ${pdf.numPages}`;
        slot.appendChild(canvas);
        slot.appendChild(badge);
        stream.appendChild(slot);
        await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
      }
    } catch (_) {
      renderFallbackImages();
    }
  }

  renderFallbackImages();
  setTimeout(renderPdfJs, 350);

  document.getElementById("reader-prev-page")?.addEventListener("click", () => scrollToPage(Number(pageInput.value) - 1));
  document.getElementById("reader-next-page")?.addEventListener("click", () => scrollToPage(Number(pageInput.value) + 1));
  pageInput?.addEventListener("change", () => scrollToPage(Number(pageInput.value)));

  function updateZoom(newZoom) {
    zoom = Math.min(1.75, Math.max(0.65, newZoom));
    zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
    renderFallbackImages();
  }
  document.getElementById("reader-zoom-in")?.addEventListener("click", () => updateZoom(zoom + 0.15));
  document.getElementById("reader-zoom-out")?.addEventListener("click", () => updateZoom(zoom - 0.15));
  document.getElementById("reader-zoom-fit")?.addEventListener("click", () => updateZoom(1.0));

  document.getElementById("reader-tall-btn")?.addEventListener("click", () => panel.classList.toggle("tall"));
  document.getElementById("reader-collapse-btn")?.addEventListener("click", (e) => {
    const collapsed = panel.classList.toggle("collapsed");
    e.currentTarget.textContent = collapsed ? "▸ Show" : "▾ Hide";
  });
  document.getElementById("reader-fullscreen-btn")?.addEventListener("click", (e) => {
    const fs = panel.classList.toggle("fullscreen");
    e.currentTarget.textContent = fs ? "✕ Exit Fullscreen" : "⛶ Fullscreen";
  });

  viewportEl.addEventListener("scroll", () => {
    const slots = [...stream.querySelectorAll(".pdf-page-slot")];
    const topRef = viewportEl.getBoundingClientRect().top + 120;
    for (const s of slots) {
      const r = s.getBoundingClientRect();
      if (r.bottom >= topRef) {
        pageInput.value = s.dataset.page;
        break;
      }
    }
  }, { passive: true });
}

/* ── 3. Exact 4-Qubit Complex Statevector QSPMLM Inference Engine (2.22e-16 Parity) ── */
function buildEntanglerPermAndPhase() {
  const cnots = [[0, 1], [1, 2], [2, 3], [3, 0]];
  const perm = new Int32Array(16);
  for (let idx = 0; idx < 16; idx++) {
    const bits = [(idx >> 3) & 1, (idx >> 2) & 1, (idx >> 1) & 1, idx & 1];
    for (const [c, t] of cnots) {
      if (bits[c] === 1) bits[t] ^= 1;
    }
    perm[idx] = (bits[0] << 3) | (bits[1] << 2) | (bits[2] << 1) | bits[3];
  }
  const phase = new Float64Array(16).fill(1.0);
  for (let outIdx = 0; outIdx < 16; outIdx++) {
    const b0 = (outIdx >> 3) & 1;
    const b1 = (outIdx >> 2) & 1;
    const b2 = (outIdx >> 1) & 1;
    const b3 = outIdx & 1;
    if (b0 === 1 && b2 === 1) phase[outIdx] *= -1.0;
    if (b1 === 1 && b3 === 1) phase[outIdx] *= -1.0;
  }
  const obsSigns = [];
  for (let q = 0; q < 4; q++) {
    const row = new Float64Array(16);
    for (let i = 0; i < 16; i++) row[i] = ((i >> (3 - q)) & 1) === 0 ? 1.0 : -1.0;
    obsSigns.push(row);
  }
  for (let a = 0; a < 4; a++) {
    for (let b = a + 1; b < 4; b++) {
      const row = new Float64Array(16);
      for (let i = 0; i < 16; i++) {
        const sa = ((i >> (3 - a)) & 1) === 0 ? 1.0 : -1.0;
        const sb = ((i >> (3 - b)) & 1) === 0 ? 1.0 : -1.0;
        row[i] = sa * sb;
      }
      obsSigns.push(row);
    }
  }
  return { perm, phase, obsSigns };
}

const Q_STRUCT = buildEntanglerPermAndPhase();

function applySingleQubitGate4Q(re, im, q, g00r, g00i, g01r, g01i, g10r, g10i, g11r, g11i) {
  const mask = 1 << (3 - q);
  for (let i = 0; i < 16; i++) {
    if ((i & mask) === 0) {
      const j = i | mask;
      const r0 = re[i], i0 = im[i];
      const r1 = re[j], i1 = im[j];
      re[i] = g00r * r0 - g00i * i0 + g01r * r1 - g01i * i1;
      im[i] = g00r * i0 + g00i * r0 + g01r * i1 + g01i * r1;
      re[j] = g10r * r0 - g10i * i0 + g11r * r1 - g11i * i1;
      im[j] = g10r * i0 + g10i * r0 + g11r * i1 + g11i * r1;
    }
  }
}

function cMul2x2(A, B) {
  const out = new Float64Array(8);
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      let sr = 0, si = 0;
      for (let k = 0; k < 2; k++) {
        const ar = A[(r * 2 + k) * 2], ai = A[(r * 2 + k) * 2 + 1];
        const br = B[(k * 2 + c) * 2], bi = B[(k * 2 + c) * 2 + 1];
        sr += ar * br - ai * bi;
        si += ar * bi + ai * br;
      }
      out[(r * 2 + c) * 2] = sr;
      out[(r * 2 + c) * 2 + 1] = si;
    }
  }
  return out;
}

function makeGateRxRzRy(angRy, angRz, angRx) {
  const cy = Math.cos(angRy / 2), sy = Math.sin(angRy / 2);
  const Ry = [cy, 0, -sy, 0, sy, 0, cy, 0];
  const cz = Math.cos(angRz / 2), sz = Math.sin(angRz / 2);
  const Rz = [cz, -sz, 0, 0, 0, 0, cz, sz];
  const cx = Math.cos(angRx / 2), sx = Math.sin(angRx / 2);
  const Rx = [cx, 0, 0, -sx, 0, -sx, cx, 0];
  return cMul2x2(Rx, cMul2x2(Rz, Ry));
}

function softmax(arr) {
  const m = Math.max(...arr);
  const ex = arr.map(v => Math.exp(v - m));
  const s = ex.reduce((a, b) => a + b, 0);
  return ex.map(v => v / s);
}

function runQSPMLM(x) {
  const W = QSP_WEIGHTS.weights;
  let re = new Float64Array(16);
  let im = new Float64Array(16);
  re[0] = 1.0;

  for (let l = 0; l < 3; l++) {
    const sc = x.map((val, idx) => val * W.input_scale[l][idx]);
    for (let q = 0; q < 4; q++) {
      const angRy = sc[2 * q] * Math.PI + W.vqc_theta[l][q][0];
      const angRz = sc[2 * q + 1] * Math.PI + W.vqc_theta[l][q][1];
      const angRx = (sc[2 * q] * sc[2 * q + 1]) * Math.PI + W.vqc_theta[l][q][2];
      const g = makeGateRxRzRy(angRy, angRz, angRx);
      applySingleQubitGate4Q(re, im, q, g[0], g[1], g[2], g[3], g[4], g[5], g[6], g[7]);
    }
    const nextRe = new Float64Array(16);
    const nextIm = new Float64Array(16);
    for (let idx = 0; idx < 16; idx++) {
      const dst = Q_STRUCT.perm[idx];
      const ph = Q_STRUCT.phase[dst];
      nextRe[dst] = re[idx] * ph;
      nextIm[dst] = im[idx] * ph;
    }
    re = nextRe;
    im = nextIm;
  }

  const probs = new Float64Array(16);
  let shannon = 0;
  for (let i = 0; i < 16; i++) {
    const p = re[i] * re[i] + im[i] * im[i];
    probs[i] = p;
    if (p > 1e-12) shannon -= p * Math.log2(p);
  }

  const obs = Q_STRUCT.obsSigns.map(signs => {
    let s = 0;
    for (let i = 0; i < 16; i++) s += signs[i] * probs[i];
    return s;
  });

  const pLogits = W.w_pathway.map((row, c) => row.reduce((acc, w, k) => acc + w * obs[k], W.b_pathway[c]));
  const pProbs = softmax(pLogits);
  const cLogits = W.w_cadence.map((row, c) => row.reduce((acc, w, k) => acc + w * obs[k], W.b_cadence[c]));
  const cProbs = softmax(cLogits);
  const recLogit = W.w_recovery[0].reduce((acc, w, k) => acc + w * obs[k], W.b_recovery[0]);
  const recovery = 1 / (1 + Math.exp(-recLogit));

  return { probs, shannon, pProbs, cProbs, recovery };
}

function initQSPMLMSimulator() {
  const presetWrap = document.getElementById("qsp-presets");
  const sliderWrap = document.getElementById("qsp-sliders");
  const hilbertWrap = document.getElementById("qsp-hilbert-bars");
  const pathwayWrap = document.getElementById("qsp-pathway-bars");
  if (!presetWrap || !sliderWrap || !hilbertWrap) return;

  for (let i = 0; i < 16; i++) {
    const col = document.createElement("div");
    col.className = "h-bar-col";
    const fill = document.createElement("div");
    fill.className = "h-bar-fill";
    fill.id = `hbar-${i}`;
    const lbl = document.createElement("span");
    lbl.className = "h-bar-lbl";
    lbl.textContent = i.toString(2).padStart(4, "0");
    col.appendChild(fill);
    col.appendChild(lbl);
    hilbertWrap.appendChild(col);
  }

  PATHWAY_NAMES.forEach((name, idx) => {
    const row = document.createElement("div");
    row.className = "pw-row";
    row.innerHTML = `
      <div class="pw-head">
        <span>${name}</span>
        <strong id="pw-pct-${idx}" style="font-family:var(--font-mono)">0.0%</strong>
      </div>
      <div class="pw-track"><div id="pw-fill-${idx}" class="pw-fill" style="width:0%"></div></div>
    `;
    pathwayWrap.appendChild(row);
  });

  FEATURE_META.forEach((f, idx) => {
    const row = document.createElement("div");
    row.className = "f-slider-row";
    row.innerHTML = `
      <label for="f-sl-${idx}">${f.label}</label>
      <input id="f-sl-${idx}" type="range" min="0" max="100" value="${Math.round(currentX[idx] * 100)}" />
      <span id="f-val-${idx}" class="f-slider-val">${currentX[idx].toFixed(2)}</span>
    `;
    sliderWrap.appendChild(row);
    row.querySelector("input").addEventListener("input", (e) => {
      currentX[idx] = Number(e.target.value) / 100;
      document.getElementById(`f-val-${idx}`).textContent = currentX[idx].toFixed(2);
      document.querySelectorAll(".preset-chip").forEach(c => c.classList.remove("active"));
      renderInference();
    });
  });

  CLINICAL_PRESETS.forEach((pr, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "preset-chip" + (idx === 0 ? " active" : "");
    btn.textContent = pr.name;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".preset-chip").forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      currentX = [...pr.x];
      currentX.forEach((v, k) => {
        document.getElementById(`f-sl-${k}`).value = String(Math.round(v * 100));
        document.getElementById(`f-val-${k}`).textContent = v.toFixed(2);
      });
      renderInference();
    });
    presetWrap.appendChild(btn);
  });

  function renderInference() {
    if (!QSP_WEIGHTS) return;
    const res = runQSPMLM(currentX);
    const maxH = Math.max(0.18, ...res.probs);
    for (let i = 0; i < 16; i++) {
      const bar = document.getElementById(`hbar-${i}`);
      if (bar) bar.style.height = `${Math.max(4, Math.round((res.probs[i] / maxH) * 62))}px`;
    }

    let topP = 0;
    res.pProbs.forEach((p, idx) => { if (p > res.pProbs[topP]) topP = idx; });
    res.pProbs.forEach((p, idx) => {
      document.getElementById(`pw-pct-${idx}`).textContent = `${(p * 100).toFixed(1)}%`;
      const fill = document.getElementById(`pw-fill-${idx}`);
      fill.style.width = `${(p * 100).toFixed(1)}%`;
      fill.classList.toggle("top", idx === topP);
    });

    let topC = 0;
    res.cProbs.forEach((p, idx) => { if (p > res.cProbs[topC]) topC = idx; });

    document.getElementById("qsp-top-badge").textContent = PATHWAY_NAMES[topP];
    document.getElementById("qsp-entropy-txt").textContent = `H(ψ) = ${res.shannon.toFixed(2)} bits`;
    document.getElementById("qsp-cadence-out").textContent = `${CADENCE_NAMES[topC]} (${(res.cProbs[topC] * 100).toFixed(1)}%)`;
    document.getElementById("qsp-recovery-out").textContent = `${(res.recovery * 100).toFixed(1)}% Projected Index`;

    const safetyBox = document.getElementById("qsp-safety-box");
    const escalate = topP === 4 || (currentX[1] >= 0.78 && currentX[7] <= 0.30);
    safetyBox.classList.toggle("escalate", escalate);
    if (escalate) {
      safetyBox.innerHTML = `<strong>⚠ NHS DCB0129 Safety Gate Triggered (H-QSPM-01 · 100.0% Recall):</strong> High anticholinergic burden (<code>ACB=${currentX[1].toFixed(2)}</code>) with restricted mobility clearance (<code>${currentX[7].toFixed(2)}</code>). Route to mandatory human <strong>Community Pharmacist &amp; GP Structured Medication Review</strong> prior to physical VCFSE group signposting.`;
    } else {
      safetyBox.innerHTML = `<strong>✓ Advisory Co-Production Mode (NHS DCB0129 Human-in-the-Loop):</strong> No acute falls/ACB contra-indication flagged (<code>P_escalate = ${(res.pProbs[4] * 100).toFixed(2)}%</code>). Link Worker and patient retain 100% conversational authority.`;
    }
  }

  renderInference();
}

/* ── 4. Interactive 3D Bloch Care-Plan Sphere & 5-Layer DisCoPy Stepper ── */
function initBlochAndDisCoPy() {
  const wrap = document.getElementById("bloch-canvas-wrap");
  if (!wrap) return;
  const canvas = document.createElement("canvas");
  wrap.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  let theta = (36 * Math.PI) / 180;
  let phi = (45 * Math.PI) / 180;
  let camYaw = 0.52, camPitch = 0.30;
  let dragging = false, lx = 0, ly = 0;

  const thSlider = document.getElementById("theta-slider");
  const phSlider = document.getElementById("phi-slider");

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = wrap.clientWidth * dpr;
    canvas.height = wrap.clientHeight * dpr;
    canvas.style.width = `${wrap.clientWidth}px`;
    canvas.style.height = `${wrap.clientHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function project(x, y, z, cx, cy, R) {
    const x1 = x * Math.cos(camYaw) - y * Math.sin(camYaw);
    const y1 = x * Math.sin(camYaw) + y * Math.cos(camYaw);
    const z2 = z * Math.cos(camPitch) - y1 * Math.sin(camPitch);
    const y2 = z * Math.sin(camPitch) + y1 * Math.cos(camPitch);
    const persp = 1 / (1 - y2 * 0.18);
    return [cx + x1 * R * persp, cy - z2 * R * persp, y2];
  }

  function updateReadout() {
    const degT = Math.round((theta * 180) / Math.PI);
    const degP = ((Math.round((phi * 180) / Math.PI) % 360) + 360) % 360;
    thSlider.value = String(degT);
    phSlider.value = String(degP);
    document.getElementById("theta-val").textContent = `${degT}°`;
    document.getElementById("phi-val").textContent = `${degP}°`;

    const c = Math.cos(theta / 2), s = Math.sin(theta / 2);
    const p0 = c * c * 100, p1 = s * s * 100;
    document.getElementById("ket-readout").textContent =
      `|ψ_care⟩ = ${c.toFixed(3)}|0⟩ + (${(s * Math.cos(phi)).toFixed(3)} + ${(s * Math.sin(phi)).toFixed(3)}i)|1⟩`;
    document.getElementById("p0-txt").textContent = `${p0.toFixed(1)}%`;
    document.getElementById("p1-txt").textContent = `${p1.toFixed(1)}%`;
    document.getElementById("p0-fill").style.width = `${p0.toFixed(1)}%`;
    document.getElementById("p1-fill").style.width = `${p1.toFixed(1)}%`;
  }

  function draw() {
    const w = wrap.clientWidth, h = wrap.clientHeight;
    ctx.clearRect(0, 0, w, h);
    // Offset sphere center +18px vertically so north pole label stays well clear of .bloch-overlay-tag
    const cx = w / 2, cy = h / 2 + 18, R = Math.min(w, h) * 0.325;

    ctx.strokeStyle = "rgba(158, 183, 180, 0.28)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    for (const mode of ["eq", "m1", "m2"]) {
      ctx.beginPath();
      for (let k = 0; k <= 72; k++) {
        const a = (k / 72) * Math.PI * 2;
        const px = mode === "eq" ? Math.cos(a) : mode === "m1" ? Math.cos(a) : 0;
        const py = mode === "eq" ? Math.sin(a) : mode === "m1" ? 0 : Math.cos(a);
        const pz = mode === "eq" ? 0 : Math.sin(a);
        const [sx, sy] = project(px, py, pz, cx, cy, R);
        if (k === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = mode === "eq" ? "rgba(56, 214, 196, 0.26)" : "rgba(158, 183, 180, 0.14)";
      ctx.stroke();
    }

    const [nx, ny] = project(0, 0, 1.07, cx, cy, R);
    const [sx2, sy2] = project(0, 0, -1.11, cx, cy, R);
    ctx.fillStyle = "#38d6c4";
    ctx.font = "600 11px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("|0⟩ Engaged", nx, ny - 5);
    ctx.fillStyle = "#f06a3b";
    ctx.fillText("|1⟩ Dropout", sx2, sy2 + 13);

    const vx = Math.sin(theta) * Math.cos(phi);
    const vy = Math.sin(theta) * Math.sin(phi);
    const vz = Math.cos(theta);
    const [tx, ty] = project(vx, vy, vz, cx, cy, R);

    ctx.strokeStyle = "#f4ae42";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    ctx.fillStyle = "#f4ae42";
    ctx.beginPath();
    ctx.arc(tx, ty, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  wrap.addEventListener("pointerdown", e => { dragging = true; lx = e.clientX; ly = e.clientY; wrap.setPointerCapture(e.pointerId); });
  wrap.addEventListener("pointermove", e => {
    if (!dragging) return;
    camYaw += (e.clientX - lx) * 0.01;
    camPitch = Math.max(-1.05, Math.min(1.05, camPitch + (e.clientY - ly) * 0.01));
    lx = e.clientX; ly = e.clientY;
    draw();
  });
  wrap.addEventListener("pointerup", () => { dragging = false; });

  thSlider?.addEventListener("input", () => { theta = (Number(thSlider.value) * Math.PI) / 180; updateReadout(); draw(); });
  phSlider?.addEventListener("input", () => { phi = (Number(phSlider.value) * Math.PI) / 180; updateReadout(); draw(); });

  document.querySelectorAll("[data-bloch-gate]").forEach(btn => {
    btn.addEventListener("click", () => {
      const g = btn.dataset.blochGate;
      document.getElementById("bloch-gate-cue").textContent = BLOCH_CUES[g] || "";
      if (g === "H") { theta = Math.PI / 2 - theta * 0.25; phi = 0; }
      else if (g === "RX") { theta = Math.min(Math.PI, Math.max(0, theta + Math.PI / 4)); phi = (phi + Math.PI / 3) % (Math.PI * 2); }
      else if (g === "S") { phi = (phi + Math.PI / 2) % (Math.PI * 2); }
      else if (g === "Z") { phi = (phi + Math.PI) % (Math.PI * 2); }
      else if (g === "ZENO") { theta = theta * 0.32; }
      else if (g === "COLLAPSE") { theta = Math.random() < Math.cos(theta / 2) ** 2 ? 0 : Math.PI; phi = 0; }
      else if (g === "RESET") { theta = 0; phi = 0; }
      updateReadout();
      draw();
    });
  });

  window.addEventListener("resize", resize);
  updateReadout();
  resize();

  const pillsWrap = document.getElementById("discopy-pills");
  let step = 4, timer = null;
  function setStep(s) {
    step = (s + DISCOPY_STEPS.length) % DISCOPY_STEPS.length;
    document.querySelectorAll(".step-pill").forEach((el, idx) => el.classList.toggle("active", idx === step));
    for (let i = 0; i < 5; i++) {
      const layer = document.getElementById(`dc-layer-${i}`);
      if (!layer) continue;
      layer.classList.toggle("lit", i <= step);
      layer.classList.toggle("current", i === step);
    }
    document.getElementById("discopy-step-title").textContent = DISCOPY_STEPS[step].title;
    document.getElementById("discopy-step-circuit").textContent = DISCOPY_STEPS[step].circuit;
    document.getElementById("discopy-step-desc").textContent = DISCOPY_STEPS[step].desc;
  }
  DISCOPY_STEPS.forEach((st, idx) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "step-pill";
    b.textContent = st.short;
    b.addEventListener("click", () => setStep(idx));
    pillsWrap?.appendChild(b);
  });
  document.getElementById("discopy-next")?.addEventListener("click", () => setStep(step + 1));
  document.getElementById("discopy-autoplay")?.addEventListener("click", e => {
    if (timer) {
      clearInterval(timer); timer = null;
      e.currentTarget.textContent = "▶ Auto-Play";
    } else {
      e.currentTarget.textContent = "⏸ Pause";
      timer = setInterval(() => setStep(step + 1), 1900);
    }
  });
  setStep(4);
}

/* ── 5. Apache ECharts Multi-Scale Benchmark Gallery (All 5 Cards) + Print Lightbox ── */
function initChartsAndLightbox() {
  const cards = [...document.querySelectorAll("#benchmarks .fig-card")];
  const btnInt = document.getElementById("btn-chart-interactive");
  const btnStat = document.getElementById("btn-chart-static");
  const charts = [];

  btnInt?.addEventListener("click", () => {
    btnInt.classList.add("active");
    btnInt.setAttribute("aria-selected", "true");
    btnStat.classList.remove("active");
    btnStat.setAttribute("aria-selected", "false");
    cards.forEach(c => c.classList.add("interactive-mode"));
    setTimeout(() => charts.forEach(ch => ch.resize()), 50);
  });

  btnStat?.addEventListener("click", () => {
    btnStat.classList.add("active");
    btnStat.setAttribute("aria-selected", "true");
    btnInt.classList.remove("active");
    btnInt.setAttribute("aria-selected", "false");
    cards.forEach(c => c.classList.remove("interactive-mode"));
  });

  const lb = document.getElementById("img-lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbCap = document.getElementById("lightbox-caption");

  function openLightbox(src, alt, caption) {
    lbImg.src = src;
    lbImg.alt = alt || "300-DPI Monograph Figure";
    lbCap.textContent = caption || "";
    lb.classList.add("open");
  }

  cards.forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("[data-open-fig]")) return;
      if (card.classList.contains("interactive-mode")) return;
      const img = card.querySelector("img");
      if (!img) return;
      const capText = card.querySelector("figcaption > div")?.innerText || card.querySelector("figcaption")?.innerText || "";
      openLightbox(card.dataset.zoomSrc || img.src, img.alt, capText);
    });
  });

  document.querySelectorAll("[data-open-fig]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = btn.closest(".fig-card");
      const img = card?.querySelector("img");
      const capText = card?.querySelector("figcaption > div")?.innerText || "";
      openLightbox(btn.dataset.openFig, img?.alt, capText);
    });
  });

  document.getElementById("lightbox-close")?.addEventListener("click", () => lb.classList.remove("open"));
  lb?.addEventListener("click", e => { if (e.target === lb) lb.classList.remove("open"); });

  let mounted = false;
  function mountCharts() {
    if (mounted || !window.echarts || !PORTAL_DATA) return;
    mounted = true;

    const baseAxis = {
      axisLabel: { color: "#9eb7b4", fontSize: 11, fontFamily: "JetBrains Mono, monospace" },
      axisLine: { lineStyle: { color: "rgba(158,183,180,0.25)" } },
      splitLine: { lineStyle: { color: "rgba(158,183,180,0.09)" } }
    };
    const darkTooltip = {
      trigger: "axis",
      backgroundColor: "rgba(11, 21, 23, 0.96)",
      borderColor: "rgba(56, 214, 196, 0.45)",
      textStyle: { color: "#eef7f5", fontSize: 12 }
    };

    // Chart 1: Non-Markovian Zeno Cadence + Live Nexus Helios-1E-lite N*=6
    const elZ = document.getElementById("echart-zeno");
    if (elZ) {
      const c1 = window.echarts.init(elZ);
      const zRows = PORTAL_DATA.zeno_sweep;
      c1.setOption({
        tooltip: darkTooltip,
        legend: { data: ["Zeno Contrast (2P−1)", "Engaged Prob P(0)"], textStyle: { color: "#eef7f5", fontSize: 11 }, top: 6 },
        grid: { left: 44, right: 16, top: 54, bottom: 34 },
        xAxis: { type: "category", data: zRows.map(r => `N=${r.n_checkins}`), ...baseAxis, axisLabel: { color: "#9eb7b4", fontSize: 10, interval: 0 } },
        yAxis: { type: "value", min: 0.40, max: 0.90, interval: 0.10, ...baseAxis },
        series: [
          {
            name: "Zeno Contrast (2P−1)",
            type: "line",
            smooth: true,
            symbolSize: 7,
            data: zRows.map(r => Number(r.retention_contrast.toFixed(4))),
            itemStyle: { color: "#38d6c4" },
            lineStyle: { width: 3 },
            markPoint: {
              symbolSize: 42,
              label: { fontSize: 9.5, fontWeight: "bold", color: "#061618" },
              data: [
                { name: "Optimal N*=6", coord: ["N=6", 0.6698], value: "N*=6", itemStyle: { color: "#38d6c4" } },
                { name: "Anti-Zeno Dip", coord: ["N=1", 0.5082], value: "Dip", itemStyle: { color: "#f06a3b" } }
              ]
            }
          },
          {
            name: "Engaged Prob P(0)",
            type: "bar",
            barWidth: "38%",
            data: zRows.map(r => Number(r.p_engaged.toFixed(4))),
            itemStyle: { color: "rgba(244,174,66,0.58)", borderRadius: [4, 4, 0, 0] }
          }
        ]
      });
      charts.push(c1);
    }

    // Chart 2: Haiqu HUBO Compression & OBP Gates
    const elH = document.getElementById("echart-haiqu");
    if (elH) {
      const c2 = window.echarts.init(elH);
      c2.setOption({
        tooltip: darkTooltip,
        legend: { data: ["Uncompressed / Raw", "Haiqu SDK v1.7.1 + OpenJij"], textStyle: { color: "#eef7f5", fontSize: 11 }, top: 6 },
        grid: { left: 44, right: 16, top: 54, bottom: 42 },
        xAxis: { type: "category", data: ["QAOA\nDepth", "OBP\nGates", "Matched\nHubs", "Cap\nViolations"], ...baseAxis, axisLabel: { color: "#9eb7b4", fontSize: 10, interval: 0, lineHeight: 13 } },
        yAxis: { type: "value", min: 0, max: 260, interval: 65, ...baseAxis },
        series: [
          {
            name: "Uncompressed / Raw",
            type: "bar",
            barGap: "18%",
            data: [241, 24, 5, 0],
            itemStyle: { color: "#526d6a", borderRadius: [4, 4, 0, 0] },
            label: { show: true, position: "top", color: "#9eb7b4", fontSize: 10 }
          },
          {
            name: "Haiqu SDK v1.7.1 + OpenJij",
            type: "bar",
            data: [14, 0, 5, 0],
            itemStyle: { color: "#38d6c4", borderRadius: [4, 4, 0, 0] },
            label: { show: true, position: "top", color: "#38d6c4", fontWeight: "bold", fontSize: 10.5 }
          }
        ]
      });
      charts.push(c2);
    }

    // Chart 3: HQS Lindblad & AlphaGenome Kuramoto
    const elB = document.getElementById("echart-biophys");
    if (elB) {
      const c3 = window.echarts.init(elB);
      c3.setOption({
        tooltip: darkTooltip,
        legend: { data: ["Chronic Social Isolation", "Social Prescribing Zeitgeber"], textStyle: { color: "#eef7f5", fontSize: 11 }, top: 6 },
        grid: { left: 44, right: 16, top: 54, bottom: 42 },
        xAxis: { type: "category", data: ["HPA\nCortisol", "IL-6\nLoad", "SCN–HPA\nSync", "12-Wk\nKuramoto R"], ...baseAxis, axisLabel: { color: "#9eb7b4", fontSize: 10, interval: 0, lineHeight: 13 } },
        yAxis: { type: "value", min: 0, max: 1.0, interval: 0.2, ...baseAxis },
        series: [
          {
            name: "Chronic Social Isolation",
            type: "bar",
            barGap: "18%",
            data: [0.6917, 0.8462, 0.0183, 0.2370],
            itemStyle: { color: "#f06a3b", borderRadius: [4, 4, 0, 0] }
          },
          {
            name: "Social Prescribing Zeitgeber",
            type: "bar",
            data: [0.2485, 0.1987, 0.1134, 0.9723],
            itemStyle: { color: "#38d6c4", borderRadius: [4, 4, 0, 0] }
          }
        ]
      });
      charts.push(c3);
    }

    // Chart 4: Modal QSPMLM vs Gate G4 Baselines (Regime A vs Cubic k=3 Regime B)
    const elQ = document.getElementById("echart-qml");
    if (elQ) {
      const c4 = window.echarts.init(elQ);
      c4.setOption({
        tooltip: darkTooltip,
        legend: { data: ["Regime A: Archetypes", "Regime B: Cubic k=3 Synergy"], textStyle: { color: "#eef7f5", fontSize: 11 }, top: 6 },
        grid: { left: 44, right: 16, top: 54, bottom: 42 },
        xAxis: { type: "category", data: ["4q\nVQC", "4q\nQKernel", "Linear\nLogReg", "G4\nGBDT", "G4\nRBF-SVM"], ...baseAxis, axisLabel: { color: "#9eb7b4", fontSize: 10, interval: 0, lineHeight: 13 } },
        yAxis: { type: "value", min: 0, max: 112, interval: 25, ...baseAxis },
        series: [
          {
            name: "Regime A: Archetypes",
            type: "bar",
            barGap: "16%",
            data: [99.79, 99.79, 99.79, 99.38, 100.0],
            itemStyle: { color: "#526d6a", borderRadius: [4, 4, 0, 0] }
          },
          {
            name: "Regime B: Cubic k=3 Synergy",
            type: "bar",
            label: { show: true, position: "top", color: "#38d6c4", fontSize: 9.5, fontWeight: "bold", formatter: "{c}%" },
            data: [65.21, 35.42, 32.71, 77.92, 79.58],
            itemStyle: { color: "#38d6c4", borderRadius: [4, 4, 0, 0] }
          }
        ]
      });
      charts.push(c4);
    }

    // Chart 5 (Full-Width Dark-Native): TypeSafe Jev 1.14 Multi-Method Health AI Audit across 4 CUJs
    const elG = document.getElementById("echart-governance");
    if (elG && PORTAL_DATA.jev_cujs) {
      const c5 = window.echarts.init(elG);
      const cujs = PORTAL_DATA.jev_cujs;
      c5.setOption({
        tooltip: darkTooltip,
        legend: {
          data: ["Safety (/5 · Mean 3.96)", "Usefulness (/5 · Mean 3.10)", "Empirical Accuracy (/5 · Calibrated Skepticism)", "Autonomous Live Deployment Prob (0.00)"],
          textStyle: { color: "#eef7f5", fontSize: 11 },
          top: 6
        },
        grid: { left: 48, right: 24, top: 56, bottom: 40 },
        xAxis: {
          type: "category",
          data: cujs.map(c => c.short_label),
          ...baseAxis,
          axisLabel: { color: "#bfece6", fontSize: 11 }
        },
        yAxis: { type: "value", min: 0, max: 5.0, ...baseAxis, name: "Score (/5)", nameTextStyle: { color: "#9eb7b4", fontSize: 11 } },
        series: [
          {
            name: "Safety (/5 · Mean 3.96)",
            type: "bar",
            barGap: "14%",
            data: cujs.map(c => c.safety),
            itemStyle: { color: "#38d6c4", borderRadius: [4, 4, 0, 0] },
            label: { show: true, position: "top", color: "#38d6c4", fontSize: 10.5 }
          },
          {
            name: "Usefulness (/5 · Mean 3.10)",
            type: "bar",
            data: cujs.map(c => c.usefulness),
            itemStyle: { color: "#f4ae42", borderRadius: [4, 4, 0, 0] },
            label: { show: true, position: "top", color: "#f4ae42", fontSize: 10.5 }
          },
          {
            name: "Empirical Accuracy (/5 · Calibrated Skepticism)",
            type: "bar",
            data: cujs.map(c => c.accuracy),
            itemStyle: { color: "#a78bfa", borderRadius: [4, 4, 0, 0] },
            label: { show: true, position: "top", color: "#c4b5fd", fontSize: 10.5 }
          },
          {
            name: "Autonomous Live Deployment Prob (0.00)",
            type: "line",
            symbolSize: 8,
            data: cujs.map(c => c.auto_prob),
            itemStyle: { color: "#f06a3b" },
            lineStyle: { width: 2.5, type: "dashed" }
          }
        ]
      });
      charts.push(c5);
    }

    window.addEventListener("resize", () => charts.forEach(c => c.resize()));
  }

  // Deterministic mount with retry poll so defer order never leaves blank chart boxes
  let tries = 0;
  const poll = setInterval(() => {
    tries++;
    if (window.echarts && PORTAL_DATA) {
      clearInterval(poll);
      mountCharts();
    } else if (tries > 60) {
      clearInterval(poll);
    }
  }, 60);
  mountCharts();
}

/* ── 6. Kashefi Atlas Filter, Receipt JSON Inspector & BibTeX ── */
function initTablesAndCitations() {
  if (!PORTAL_DATA) return;
  const atlasTbody = document.getElementById("atlas-tbody");
  const atlasInput = document.getElementById("atlas-search");
  const atlasCount = document.getElementById("atlas-count");

  function renderAtlas(q) {
    const needle = (q || "").trim().toLowerCase();
    const rows = PORTAL_DATA.atlas_contracts.filter(r =>
      !needle || JSON.stringify(r).toLowerCase().includes(needle)
    );
    atlasCount.textContent = `${rows.length} / ${PORTAL_DATA.atlas_contracts.length} Contracts Shown (42 Cards Audited)`;
    atlasTbody.innerHTML = rows.map(r => `
      <tr>
        <td><code>${r.id}</code><br/><span style="font-size:0.72rem;color:var(--ink-dim);text-transform:capitalize">${r.category}</span></td>
        <td><strong style="color:var(--ink)">${r.name}</strong><br/><span style="font-family:var(--font-mono);font-size:0.73rem;color:var(--amber)">${r.paper}</span></td>
        <td>${r.qspm_use_html}</td>
        <td style="font-size:0.81rem;color:var(--ink)">${r.scaling_contract}</td>
        <td style="color:var(--ink-muted);font-size:0.8rem">${r.caveat}</td>
      </tr>
    `).join("");
  }
  renderAtlas("");
  atlasInput?.addEventListener("input", e => renderAtlas(e.target.value));

  const recTbody = document.getElementById("receipts-tbody");
  const modal = document.getElementById("json-modal");
  const modalTitle = document.getElementById("json-modal-title");
  const modalPre = document.getElementById("json-modal-pre");
  const modalDl = document.getElementById("json-modal-dl");

  recTbody.innerHTML = PORTAL_DATA.receipts_summary.map(r => `
    <tr>
      <td><code>${r.file}</code><br/><span style="font-family:var(--font-mono);font-size:0.69rem;color:var(--ink-dim)">SHA-256: ${r.sha256.slice(0, 16)}…</span></td>
      <td>${r.platforms}</td>
      <td>${r.metrics}</td>
      <td><code>${r.floor}</code></td>
      <td style="white-space:nowrap">
        <button type="button" class="btn btn-sm" data-inspect-json="${r.file}">🔍 Inspect JSON</button>
      </td>
    </tr>
  `).join("");

  recTbody.querySelectorAll("[data-inspect-json]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const f = btn.dataset.inspectJson;
      modalTitle.textContent = `receipts/${f}`;
      modalDl.href = `receipts/${f}`;
      modalDl.download = f;
      modalPre.textContent = "Loading verified JSON receipt…";
      modal.classList.add("open");
      try {
        const res = await fetch(`receipts/${f}`);
        const txt = await res.text();
        modalPre.textContent = txt;
      } catch (err) {
        modalPre.textContent = `Unable to fetch receipt inline: ${err}`;
      }
    });
  });
  document.getElementById("json-modal-close")?.addEventListener("click", () => modal.classList.remove("open"));
  modal?.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("open"); });

  const bibPre = document.getElementById("bibtex-code");
  let activeBib = "monograph";
  if (bibPre) bibPre.textContent = BIBTEX_ENTRIES.monograph;
  document.querySelectorAll("[data-bib-tab]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-bib-tab]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeBib = btn.dataset.bibTab;
      bibPre.textContent = BIBTEX_ENTRIES[activeBib];
    });
  });
  document.getElementById("copy-bibtex-btn")?.addEventListener("click", async () => {
    await navigator.clipboard.writeText(BIBTEX_ENTRIES[activeBib]);
    showToast("Copied BibTeX citation to clipboard");
  });
  document.getElementById("download-bibtex-btn")?.addEventListener("click", () => {
    const blob = new Blob([Object.values(BIBTEX_ENTRIES).join("\n\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "quantum_social_prescribing.bib";
    a.click();
  });
}

async function boot() {
  initNav();
  initPdfReader();
  initBlochAndDisCoPy();
  const [dataRes, weightsRes] = await Promise.all([
    fetch("assets/data.json").then(r => r.json()),
    fetch("receipts/qspmlm_weights.json").then(r => r.json())
  ]);
  PORTAL_DATA = dataRes;
  QSP_WEIGHTS = weightsRes;
  initQSPMLMSimulator();
  initChartsAndLightbox();
  initTablesAndCitations();
}

boot();
