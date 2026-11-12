# Quantum Social Prescribing (QSPM) — Open Research & Interactive Results Portal

Live GitHub Pages site: **https://arunnadarasa.github.io/quantum-social-prescribing/**

**Author:** Arun Nadarasa (Innovation Fellow, Mid and South Essex NHS Foundation Trust; International Social Prescribing Pharmacy Association [ISPPA], London, UK)

## 100% Non-Commercial Scientific Research & Public-Good NHS Mandate

- **Non-Commercial Scientific Research Use Only:** All publications, datasets, quantum emulator benchmarks, and clinical-informatics software in this project are produced and released **100% free of commercial fees or proprietary licensing** strictly for **non-commercial scientific research and public-sector NHS health-equity planning**, in full compliance with:
  1. **Google Antigravity for Scientific Workflows** (*Non-commercial scientific research program*),
  2. **Google DeepMind AlphaGenome 2 (`v2.0.0`)** non-commercial Research-Use-Only Terms of Service (https://deepmind.google.com/science/alphagenome/), and
  3. **UK Open Government Licence v3.0 (`OGL v3.0`)** (`0` patient-identifiable records) & **NHS DCB0129** mandatory human-in-the-loop governance.
- **Free Public-Good NHS PCN & ICB Core20PLUS5 Equity Allocator (`#pcn-tool`):** Because single-period Neighbourhood Hub capacity routing is polynomial-time classical (`0.00%` MIP gap), we release the exact classical solver **free to every NHS Primary Care Network (PCN), Integrated Care Board (ICB), ARRS Clinical Pharmacist, and Social Prescribing Link-Worker team**:
  - **Live Browser Tool (`1,296` English PCNs · `42` ICBs · `143` MSE GP Practices):** https://arunnadarasa.github.io/quantum-social-prescribing/#pcn-tool
  - **Zero-Install Offline Single-File HTML App (`downloads/NHS_PCN_Core20_Equity_Allocator_Free_Tool.html`):** Runs 100% offline in any NHS Trust browser (`0` data transmitted).
  - **Open-Source Python CLI & `HiGHS` MILP Reference Solver (`downloads/nhs_pcn_core20_equity_allocator.py`):** Exact `< 1e-12` objective parity with `scipy.optimize.milp` (`HiGHS`).

## Included Open-Access Artifacts

- **Free NHS PCN & ICB Core20PLUS5 Equity & Pharmacy-SMR Allocator (`#pcn-tool`, `downloads/NHS_PCN_Core20_Equity_Allocator_Free_Tool.html`, `downloads/nhs_pcn_core20_equity_allocator.py`)**:
  - Solves exact capacity-constrained Neighbourhood Hub routing across all **`1,296` PCNs in England (`42` ICBs, `61.83M` patients)** and **`143` individual GP practices in Mid and South Essex ICB** in `< 5 ms` directly in-browser (`0` server calls, `0` patient-identifiable data). Raises `Core20` deprived-ward first-choice VCFSE hub attainment by **`+12.69 pp` (`53.46% -> 66.15%`)** at the recommended `1.50×` Marmot equity weight while retaining **`99.81%`** of unweighted efficiency with `0` VCFSE charity overload violations.
- **Focused Empirical Clinical-Informatics Paper (`downloads/Focused_Clinical_Informatics_Social_Prescribing.pdf`, 1.97 MB · 8 Pages)**:
  - Empirically calibrated optimization & governance study across **`6,105` active NHS England GP practices** (`1,296` PCNs, `42` ICBs, `61,832,846` patients; Open Government Licence v3.0), all **`143` GP practices** (`28` PCNs, `1,266,245` patients) in **Mid and South Essex ICB**, and published **ELSA Wave 10** (`PMC12322337`, `PMC13017203`) & **CPRD Aurum** (`PMC13245770`, Bu et al. 2025) cohorts: replicates `21.93%` vs `22.30%` refusal, identifies Core20 cubic (`k=3`) clinical-pharmacist + shared-decision-making synergies (`+9.90` pp acceptance, `p = 1.13e-3`), benchmarks Haiqu SDK v1.7.1 HUBO compression (`253 -> 14`, `-94.47%`) against exact `19.19 ms` Rosenberg + HiGHS MILP (`E0 = -1.7181`) and `200.95 ms` national `1,296`-PCN routing, evaluates `80/20` held-out NHS triage + live Quantinuum Nexus `Helios-1E-lite` Job `af987c9a` (`Y02177` Southend Victoria PCN), and seals aggregate MSE commissioning bundles with NIST FIPS 204 `ML-DSA-65` + live TypeSafe Jev 1.14 (`P_auto = 0.00`).
- **Focused Quantum Optimization Technical Note (`downloads/Integrality_Wall_Quantum_Optimization_Note.pdf`, 1.36 MB · 6 Pages)**:
  - Standalone polyhedral optimization & trapped-ion benchmark mapping the classical `HiGHS` MILP Integrality Wall (`75` sparse `CSC` primary-integrality runs across $N \in [24, 120]$ and $lpha_3 = |E_3|/N \in [0.0, 4.5]$ calibrated to `143` Mid and South Essex practices), proving fractional McCormick symmetry collapse ($x_i^{	ext{LP}} = 0.4831$ across `89/96` variables, `37.92%` unresolved MIP gap at `10.0 s`), and executing `LP-WS-BF-QAOA` (`148` and `176` `CX` gates, `2,560` raw shots, zero post-processing) live on **Quantinuum Nexus `Helios-1E-lite`** (`0813dc16` & `faf7ccda`): **`55.57%` Top-5% on `12q`** (`2.29×` LP rounding, exact GS `110101000001`) and **`83.40%` Top-5% on `16q`** (`3.09×` LP rounding, `95.7%` retention of ideal noiseless statevector concentration).
- **Full Exploratory Monograph (`downloads/Quantum_Social_Prescribing.pdf`, 2.66 MB · 11 Pages)**:
  - 11-page publication-grade Samskrift monograph (`34` verified references) structured as a Three-Tier Architecture across **12 SHA-256-sealed JSON receipts**: live Quantinuum Nexus `Helios-1E-lite` jobs (`9,728` shots across 7 jobs in project `Quantum-Social-Prescribing`) + Cloud `aqora:nexus:H2-Emulator` jobs (`1,536` shots), Haiqu SDK v1.7.1 pure 3-body HUBO state compression (`241 -> 14`, `-94.19%`, `74.71%` raw pre-postprocessing ground-state sampling) + Rosenberg/HiGHS MILP scaling controls (`≤ 1.32 s` up to `n_path = 60`), OpenJij + JijModeling 120-variable Core20PLUS5 QUBO + 4-bit Kempe-swap controls (`100.00%` of exact MILP in `8.72 ms`), Modal + Hugging Face 4-qubit Multi-Task `QSPMLM` (`99.79%` Regime A triage accuracy & full-split IQP `QKernel` `99.79%`, plus Regime B Cubic `k=3` Non-Linear Synergy benchmark vs `GBDT` & `RBF-SVM`), HQS `struqture-py`/`qoqo` 4-spin phenomenological Lindbladian (with 49-point sensitivity sweep), live **Google DeepMind AlphaGenome 2 (`alphagenome==2.0.0`, v2)** cell-state SMR pharmacogenomic (`CYP2C19`, `CYP2D6`) & PNI neuroimmune (`IL6`, `NR3C1`, `FKBP5`) CpG methylation / 1-Mb `E2G` enhancer attribution (Research-Use-Only; https://deepmind.google.com/science/alphagenome/), `QProtSim` on crystal deamino-oxytocin (`PDB 1XY1`), Rhyme (`rhyme-beta`), Text2WetLab Opentrons OT-2 (`6/6 PASS`), Medicus NHS DAPB4066 FHIR R4 + NIST FIPS 204 `ML-DSA-65`, Kashefi Primitives Atlas v0.4 (`42` cards), 2×2 matched-depth barren-plateau controls (`5.83x` at `L=2n`), decoupled active-QEC Lindbladian FTQC scaling, and TypeSafe Jev 1.14 (`arXiv:2611.05127`).
- **Interactive Modules (`index.html`, `assets/app.js`, `assets/styles.css`, `assets/echarts.min.js`)**:
  - In-page `PDF.js` continuous triple-paper reader (`8p` NHS Study, `6p` Quantum Opt Note, `11p` Full Monograph) with section bookmarks and high-DPI page stream.
  - Free NHS PCN & ICB `Core20PLUS5` Equity & Pharmacy-SMR Allocator (`#pcn-tool`, `assets/nhs_pcn_directory.json`) with 1-click `.csv` commissioning export.
  - Real-time client-side 4-qubit complex statevector `QSPMLM` clinical triage & safety escalation simulator running exact Modal-trained weights (`receipts/qspmlm_weights.json`, `4.44e-16` parity).
  - Interactive 3D Bloch Care-Plan Sphere, 5-layer `DisCoPy` Frobenius co-production stepper, 5 dark-native Apache `ECharts` multi-scale benchmark cards, and the **Interactive Multi-Tier Knowledge Graph Explorer (`QSPM-KG v1.2`, `#kg`, `receipts/qspm_knowledge_graph.json`, `figures/fig6_qspm_knowledge_graph.png`)** across 64 ontology nodes and 108 typed semantic edges.
- **Sealed Provenance Receipts (`receipts/`)**:
  - All **12 SHA-256-verified experimental JSON receipts** plus the sealed **JSON-LD 1.1 Knowledge Graph (`qspm_knowledge_graph.json`)** (`0` physical QPU shots claimed; `0` wet-lab/patient samples; `synthetic_payload: true`; `4 OPEN` NHS DCB0129 clinical safety hazards; AlphaGenome 2 outputs strictly non-clinical Research-Use-Only per https://deepmind.google.com/science/alphagenome/ and NCBI dbSNP https://www.ncbi.nlm.nih.gov/snp/).

## External Cloud Links

- **Free NHS PCN Core20 Equity Tool (Live Browser):** https://arunnadarasa.github.io/quantum-social-prescribing/#pcn-tool
- **Samskrift Focused Empirical NHS Paper (8 Pages):** https://samskrift.com/view/e6628414-9373-4a34-accd-cc8b6d46e0ce/7c7a2c96-238a-4e05-9d8d-230d04da8440
- **Samskrift Focused Quantum Optimization Note (6 Pages):** https://samskrift.com/view/b2cef0ea-fbe0-4df7-8546-92b62c7498b3/6631fd61-d667-4328-a798-55b12b7a57fd
- **Samskrift Full Monograph View (11 Pages):** https://samskrift.com/view/0db305b3-9a91-4fdb-ada8-b760beda1ec5/668cdf7d-9840-478a-9101-88989e408c54
- **Hugging Face Model Hub (`QSPMLM`):** https://huggingface.co/socialprescribing/quantinuum-social-prescribing
- **Hugging Face Interactive Space:** https://huggingface.co/spaces/socialprescribing/quantinuum-social-prescribing

## Acknowledgments

This work was supported in part by complimentary access to Google Antigravity and Gemini 4 Argon to accelerate scientific workflows.
