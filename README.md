# Quantum Social Prescribing (QSPM) — Open Research & Interactive Results Portal

Live GitHub Pages site: **https://arunnadarasa.github.io/quantum-social-prescribing/**

**Author:** Arun Nadarasa (Innovation Fellow, Mid and South Essex NHS Foundation Trust; International Social Prescribing Pharmacy Association [ISPPA], London, UK)

## Included Open-Access Artifacts

- **Compiled Monograph (`downloads/Quantum_Social_Prescribing.pdf`, 2.38 MB)**:
  - 10-page publication-grade Samskrift monograph integrating live Quantinuum Nexus `Helios-1E-lite` jobs (`6,144` shots in project `Quantum-Social-Prescribing`: `b813e944`, `295cb111`, `6cc7b395`) + Cloud `aqora:nexus:H2-Emulator` jobs (`1,536` shots), Haiqu SDK v1.7.1 3-body HUBO state compression (`241 -> 14`, `-94.19%`), OpenJij + JijModeling 120-variable Core20PLUS5 QUBO, Modal + Hugging Face 4-qubit Multi-Task `QSPMLM` (`99.79%` triage accuracy, `100.00%` falls safety recall), HQS `struqture-py`/`qoqo` 4-spin Lindbladian, `QProtSim` (`1XY1` oxytocin), BioHub, Neurosnap (`6TPK` `OXTR`), Google DeepMind AlphaGenome Atlas (GENCODE v46), Arc Institute, GXL Paperclip MCP, Rhyme (`rhyme-beta`), Text2WetLab Opentrons OT-2 (`6/6 PASS`), Medicus NHS DAPB4066 FHIR R4 + NIST FIPS 204 `ML-DSA-65`, Kashefi Primitives Atlas v0.4 (`42` cards), Sandia QUOPS / `[[8,3,2]]` Color Code FTQC, and TypeSafe Jev 1.14 (`arXiv:2611.05127v2`).
- **Interactive Modules (`index.html`, `assets/app.js`, `assets/styles.css`, `assets/echarts.min.js`)**:
  - In-page `PDF.js` continuous monograph reader with section bookmarks and high-DPI page stream.
  - Real-time client-side 4-qubit complex statevector `QSPMLM` clinical triage & safety escalation simulator running exact Modal-trained weights (`receipts/qspmlm_weights.json`, `2.22e-16` parity).
  - Interactive 3D Bloch Care-Plan Sphere, 5-layer `DisCoPy` Frobenius co-production stepper, and 5 dark-native Apache `ECharts` multi-scale benchmark cards + 300-DPI figure zoom lightbox.
- **Sealed Provenance Receipts (`receipts/`)**:
  - All **8 SHA-256-verified JSON receipts** (`0` physical QPU shots claimed; `0` wet-lab/patient samples; `synthetic_payload: true`; `4 OPEN` NHS DCB0129 clinical safety hazards).

## External Cloud Links

- **Samskrift Live Paper View:** https://samskrift.com/view/0db305b3-9a91-4fdb-ada8-b760beda1ec5/668cdf7d-9840-478a-9101-88989e408c54
- **Hugging Face Model Hub (`QSPMLM`):** https://huggingface.co/socialprescribing/quantinuum-social-prescribing
- **Hugging Face Interactive Space:** https://huggingface.co/spaces/socialprescribing/quantinuum-social-prescribing

## Acknowledgments

This work was supported in part by complimentary access to Google Antigravity and Gemini 4 Argon to accelerate scientific workflows.
