# Quantum Social Prescribing (QSPM) — Open Research & Interactive Results Portal

Live GitHub Pages site: **https://arunnadarasa.github.io/quantum-social-prescribing/**

**Author:** Arun Nadarasa (Innovation Fellow, Mid and South Essex NHS Foundation Trust; International Social Prescribing Pharmacy Association [ISPPA], London, UK)

## Included Open-Access Artifacts

- **Focused Empirical Clinical-Informatics Paper (`downloads/Focused_Clinical_Informatics_Social_Prescribing.pdf`, 1.88 MB · 8 Pages)**:
  - Empirically calibrated optimization & governance study across **`6,105` active NHS England GP practices** (`1,296` PCNs, `42` ICBs, `61,832,846` patients; Open Government Licence v3.0), all **`143` GP practices** (`28` PCNs, `1,266,245` patients) in **Mid and South Essex ICB**, and published **ELSA Wave 10** (`PMC12322337`, `PMC13017203`) & **CPRD Aurum** (`PMC13245770`, Bu et al. 2025) cohorts: replicates `21.93%` vs `22.30%` refusal, identifies Core20 cubic (`k=3`) clinical-pharmacist + shared-decision-making synergies (`+9.90` pp acceptance, `p = 1.13e-3`), benchmarks Haiqu SDK v1.7.1 HUBO compression (`253 -> 14`, `-94.47%`) against exact `19.19 ms` Rosenberg + HiGHS MILP (`E0 = -1.7181`) and `200.95 ms` national `1,296`-PCN routing, evaluates `80/20` held-out NHS triage + live Quantinuum Nexus `Helios-1E-lite` Job `af987c9a` (`Y02177` Southend Victoria PCN), and seals aggregate MSE commissioning bundles with NIST FIPS 204 `ML-DSA-65` + live TypeSafe Jev 1.14 (`P_auto = 0.00`).
- **Full Exploratory Monograph (`downloads/Quantum_Social_Prescribing.pdf`, 2.57 MB · 10 Pages)**:
  - 10-page publication-grade Samskrift monograph (`33` verified references) structured as a Three-Tier Architecture across **9 SHA-256-sealed JSON receipts**: live Quantinuum Nexus `Helios-1E-lite` jobs (`6,144` shots in project `Quantum-Social-Prescribing`: `b813e944`, `295cb111`, `6cc7b395`) + Cloud `aqora:nexus:H2-Emulator` jobs (`1,536` shots), Haiqu SDK v1.7.1 pure 3-body HUBO state compression (`241 -> 14`, `-94.19%`, `74.71%` raw pre-postprocessing ground-state sampling) + Rosenberg/HiGHS MILP scaling controls (`≤ 1.32 s` up to `n_path = 60`), OpenJij + JijModeling 120-variable Core20PLUS5 QUBO + 4-bit Kempe-swap controls (`100.00%` of exact MILP in `8.72 ms`), Modal + Hugging Face 4-qubit Multi-Task `QSPMLM` (`99.79%` Regime A triage accuracy & full-split IQP `QKernel` `99.79%`, plus Regime B Cubic `k=3` Non-Linear Synergy benchmark vs `GBDT` & `RBF-SVM`), HQS `struqture-py`/`qoqo` 4-spin phenomenological Lindbladian (with 49-point sensitivity sweep), `QProtSim` on crystal deamino-oxytocin (`PDB 1XY1`), AlphaGenome Atlas (GENCODE v46), Rhyme (`rhyme-beta`), Text2WetLab Opentrons OT-2 (`6/6 PASS`), Medicus NHS DAPB4066 FHIR R4 + NIST FIPS 204 `ML-DSA-65`, Kashefi Primitives Atlas v0.4 (`42` cards), 2×2 matched-depth barren-plateau controls (`5.83x` at `L=2n`), decoupled active-QEC Lindbladian FTQC scaling, and TypeSafe Jev 1.14 (`arXiv:2611.05127`).
- **Interactive Modules (`index.html`, `assets/app.js`, `assets/styles.css`, `assets/echarts.min.js`)**:
  - In-page `PDF.js` continuous monograph reader with section bookmarks and high-DPI page stream.
  - Real-time client-side 4-qubit complex statevector `QSPMLM` clinical triage & safety escalation simulator running exact Modal-trained weights (`receipts/qspmlm_weights.json`, `4.44e-16` parity).
  - Interactive 3D Bloch Care-Plan Sphere, 5-layer `DisCoPy` Frobenius co-production stepper, 5 dark-native Apache `ECharts` multi-scale benchmark cards, and the **Interactive Multi-Tier Knowledge Graph Explorer (`QSPM-KG v1.0`, `#kg`, `receipts/qspm_knowledge_graph.json`, `figures/fig6_qspm_knowledge_graph.png`)** across 56 ontology nodes and 86 typed semantic edges.
- **Sealed Provenance Receipts (`receipts/`)**:
  - All **9 SHA-256-verified experimental JSON receipts** plus the sealed **JSON-LD 1.1 Knowledge Graph (`qspm_knowledge_graph.json`)** (`0` physical QPU shots claimed; `0` wet-lab/patient samples; `synthetic_payload: true`; `4 OPEN` NHS DCB0129 clinical safety hazards).

## External Cloud Links

- **Samskrift Live Paper View:** https://samskrift.com/view/0db305b3-9a91-4fdb-ada8-b760beda1ec5/668cdf7d-9840-478a-9101-88989e408c54
- **Hugging Face Model Hub (`QSPMLM`):** https://huggingface.co/socialprescribing/quantinuum-social-prescribing
- **Hugging Face Interactive Space:** https://huggingface.co/spaces/socialprescribing/quantinuum-social-prescribing

## Acknowledgments

This work was supported in part by complimentary access to Google Antigravity and Gemini 4 Argon to accelerate scientific workflows.
