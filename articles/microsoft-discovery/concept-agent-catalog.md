---
title: Microsoft Discovery agent catalog
description: Explore Microsoft Discovery research agents by category and capability to find agents for your investigation.
author: yousefi-msft
ms.author: yousefi
ms.service: azure
ms.topic: concept-article
ms.date: 10/10/2026
ms.custom: template-concept

#CustomerIntent: As a researcher, I want to compare available research agents by category and capability so that I can identify agents for my investigation.
---

# Microsoft Discovery agent catalog

Microsoft Discovery agents support scientific research tasks, from molecular design and protein analysis to materials simulation and literature review. Browse the categories to find agents for your investigation.

> [!TIP]
> Use the [Discovery agent skill](https://github.com/microsoft/discovery/blob/main/skills/add-example-agents/SKILL.md) on the Discovery GitHub site to help you quickly install agents.

## Choose a category

Browse agents by research category. Each table summarizes the agents and their capability tags.

| Category | Research tasks | Agents |
| --- | --- | --- |
| [Chemistry and drug discovery](#chemistry-and-drug-discovery) | Molecular properties, chemical data, docking, molecular generation, and synthesis planning | 27 |
| [Engineering and hardware](#engineering-and-hardware) | Fluid dynamics, circuit simulation, and digital hardware analysis | 5 |
| [Genomics and systems biology](#genomics-and-systems-biology) | Sequence analysis, genomics, gene expression, and biochemical network modeling | 17 |
| [Materials and simulation](#materials-and-simulation) | Materials data, crystal structures, quantum chemistry, and molecular dynamics | 15 |
| [Proteins and structure](#proteins-and-structure) | Protein structure prediction, design, analysis, and biomolecular simulation | 18 |
| [Research and data](#research-and-data) | Literature research, clinical-trial data, patent analysis, and statistical validation | 7 |
| [Spectroscopy and metabolomics](#spectroscopy-and-metabolomics) | Mass-spectrum processing and metabolite identification | 2 |

## Chemistry and drug discovery

These agents support chemical data retrieval, molecular analysis and generation, property prediction, docking, and synthesis planning.

| Agent | Description | Capability tags |
| --- | --- | --- |
| [AiZynthFinder](https://github.com/microsoft/discovery/tree/main/agents/aizynthfinder) | Plans synthesis routes from target molecules to available precursors. | `drug-discovery`, `retrosynthesis`, `trained-model` |
| [AutoDock Vina](https://github.com/microsoft/discovery/tree/main/agents/autodock) | Predicts protein-ligand binding and supports virtual screening. | `drug-discovery`, `molecule-docking`, `virtual-screening` |
| [BindingDB](https://github.com/microsoft/discovery/tree/main/agents/bindingdb) | Finds protein-ligand binding affinity data. | `binding-affinity`, `database`, `drug-discovery` |
| [Boltz-2](https://github.com/microsoft/discovery/tree/main/agents/boltztwo) | Predicts biomolecular structures and binding affinity. | `binding-affinity`, `drug-discovery`, `protein-folding`, `structure-prediction`, `trained-model` |
| [Cantera](https://github.com/microsoft/discovery/tree/main/agents/cantera) | Analyzes chemical reactions, thermodynamics, and transport. | `cantera`, `chemical-kinetics`, `combustion`, `thermodynamics` |
| [ChemBERTa](https://github.com/microsoft/discovery/tree/main/agents/chemberta) | Predicts molecular properties and compares molecular similarity. | `cheminformatics`, `molecular-property-prediction`, `trained-model`, `transformer` |
| [ChEMBL](https://github.com/microsoft/discovery/tree/main/agents/chembl) | Finds compound, target, and bioactivity data. | `bioactivity`, `cheminformatics`, `database` |
| [Chemprop](https://github.com/microsoft/discovery/tree/main/agents/chemprop) | Predicts molecular properties for chemical research. | `d-mpnn`, `molecular-properties`, `property-prediction`, `trained-model` |
| [COCONUT](https://github.com/microsoft/discovery/tree/main/agents/coconut) | Finds natural product structures, properties, and biological sources. | `cheminformatics`, `database`, `natural-products` |
| [Core Python Agent](https://github.com/microsoft/discovery/tree/main/agents/core-python-agent) | Analyzes molecular structures and chemical properties. | `cheminformatics`, `molecular-science`, `python`, `rdkit` |
| [CREST](https://github.com/microsoft/discovery/tree/main/agents/crest) | Explores molecular conformations and chemical space. | `conformational-search`, `semiempirical` |
| [De Novo Molecule Generator (powered by JANUS)](https://github.com/microsoft/discovery/tree/main/agents/janus) | Generates candidate molecules for specified research goals. | `de-novo`, `generative`, `genetic-algorithm`, `inverse-design`, `materials-discovery`, `molecular-design`, `selfies` |
| [GWP & Atmospheric Lifetime Predictor](https://github.com/microsoft/discovery/tree/main/agents/gwp-predictor) | Predicts global warming potential and atmospheric lifetime. | `atmospheric-lifetime`, `chemistry`, `chemprop`, `climate`, `d-mpnn`, `gwp`, `heat-transfer-fluid`, `property-prediction`, `trained-model` |
| [KEGG](https://github.com/microsoft/discovery/tree/main/agents/kegg) | Finds biological pathways, reactions, compounds, and genes. | `api`, `bioinformatics`, `kegg`, `pathways`, `reactions` |
| [Molecular Groups](https://github.com/microsoft/discovery/tree/main/agents/molecular-groups) | Identifies functional groups and potential chemical hazards. | `cheminformatics`, `functional-groups`, `safety-screening` |
| [MolToolkit](https://github.com/microsoft/discovery/tree/main/agents/mol-toolkit) | Supports molecular analysis and cheminformatics. | `cheminformatics` |
| [Mordred](https://github.com/microsoft/discovery/tree/main/agents/mordred) | Describes molecular features for property prediction. | `cheminformatics`, `descriptors`, `mordred`, `qsar` |
| [nmrglue](https://github.com/microsoft/discovery/tree/main/agents/nmrglue) | Processes and analyzes nuclear magnetic resonance spectra. | `nmr`, `nmrglue`, `signal-processing`, `spectroscopy` |
| [Open Babel](https://github.com/microsoft/discovery/tree/main/agents/openbabel) | Converts chemical data and analyzes molecular structures. | `cheminformatics`, `descriptors`, `file-conversion`, `openbabel` |
| [OPSIN](https://github.com/microsoft/discovery/tree/main/agents/opsin) | Interprets chemical names as molecular structures. | `cheminformatics`, `iupac`, `name-to-structure`, `opsin` |
| [PubChem](https://github.com/microsoft/discovery/tree/main/agents/pubchem) | Finds chemical structures, properties, and compound information. | `cheminformatics`, `database` |
| [rDock](https://github.com/microsoft/discovery/tree/main/agents/rdock) | Predicts molecular docking poses for binding studies. | `cheminformatics`, `docking`, `rdock`, `virtual-screening` |
| [Retrosynthesis Predictor (powered by RetroChimera)](https://github.com/microsoft/discovery/tree/main/agents/retrochimera) | Predicts chemical reactions and synthesis routes. | `computational-chemistry`, `drug-discovery`, `gnn`, `reaction-prediction`, `retrosynthesis`, `trained-model` |
| [RXNMapper](https://github.com/microsoft/discovery/tree/main/agents/rxnmapper) | Maps corresponding atoms across chemical reactions. | `atom-mapping`, `cheminformatics`, `reactions`, `rxnmapper` |
| [TamGen](https://github.com/microsoft/discovery/tree/main/agents/tamgen) | Generates candidate molecules for protein binding sites. | `drug-discovery`, `generative-model`, `language-model`, `molecular-generation`, `trained-model` |
| [ToxPred](https://github.com/microsoft/discovery/tree/main/agents/toxpred) | Predicts molecular toxicity and safety-related properties. | `cheminformatics`, `d-mpnn`, `property-prediction`, `safety-assessment`, `toxicology`, `trained-model` |
| [ZINC](https://github.com/microsoft/discovery/tree/main/agents/zinc) | Finds commercially available compounds for molecular screening. | `cheminformatics`, `compound-search`, `database`, `virtual-screening` |

## Engineering and hardware

These agents support computational fluid dynamics, Verilog analysis and synthesis, static timing analysis, and circuit simulation.

| Agent | Description | Capability tags |
| --- | --- | --- |
| [CFDopenFOAM](https://github.com/microsoft/discovery/tree/main/agents/openfoam) | Simulates fluid flow, aerodynamics, and heat transfer. | `cfd`, `computational-fluid-dynamics`, `engineering`, `openfoam`, `simulation` |
| [OpenSTA-Static-Timing-Analysis](https://github.com/microsoft/discovery/tree/main/agents/opensta) | Evaluates timing behavior in digital circuit designs. | `asic`, `gf180mcu`, `netlist`, `sky130`, `sta`, `static-timing-analysis`, `timing`, `verilog` |
| [RTL-IVerilog-Linter](https://github.com/microsoft/discovery/tree/main/agents/rtl-ivlg-linter) | Checks digital hardware designs for syntax errors. | `eda`, `hardware-design`, `iverilog`, `linting`, `rtl`, `systemverilog`, `verilog` |
| [Xyce Transistor Simulator](https://github.com/microsoft/discovery/tree/main/agents/xyce) | Simulates electronic circuit behavior. | `analog`, `asic`, `circuit-simulation`, `gf180mcu`, `sky130`, `spice`, `transient`, `xyce` |
| [Yosys-RTL-Synthesis](https://github.com/microsoft/discovery/tree/main/agents/rtl-yosys-syn) | Transforms digital hardware designs into circuit representations. | `asic`, `digital-design`, `rtl`, `synthesis`, `verilog` |

## Genomics and systems biology

These agents support biological sequence analysis, genomic data retrieval, gene expression analysis, and metabolic or biochemical network modeling.

| Agent | Description | Capability tags |
| --- | --- | --- |
| [Biopython](https://github.com/microsoft/discovery/tree/main/agents/biopython) | Analyzes and compares biological sequences. | `bioinformatics`, `biopython`, `fasta`, `genbank`, `sequences` |
| [COBRApy](https://github.com/microsoft/discovery/tree/main/agents/cobrapy) | Models metabolic networks and evaluates gene effects. | `cobrapy`, `flux-balance`, `metabolic-modeling`, `systems-biology` |
| [COPASI (basico)](https://github.com/microsoft/discovery/tree/main/agents/copasi-basico) | Simulates biochemical reaction networks. | `basico`, `biochemical-networks`, `copasi`, `systems-biology` |
| [Ensembl REST](https://github.com/microsoft/discovery/tree/main/agents/ensembl) | Finds gene, transcript, and variant information across species. | `api`, `bioinformatics`, `ensembl`, `genes`, `genomics`, `variants` |
| [HMMER](https://github.com/microsoft/discovery/tree/main/agents/hmmer) | Finds related sequences and protein domains. | `bioinformatics`, `domains`, `hmmer`, `profile-hmm` |
| [IQ-TREE](https://github.com/microsoft/discovery/tree/main/agents/iqtree) | Infers evolutionary relationships from biological sequences. | `bioinformatics`, `iqtree`, `maximum-likelihood`, `phylogenetics` |
| [MMseqs2](https://github.com/microsoft/discovery/tree/main/agents/mmseqs2) | Searches and groups protein and nucleotide sequences. | `bioinformatics`, `clustering`, `mmseqs2`, `sequence-search` |
| [Multiple Sequence Alignment (MAFFT/MUSCLE/Clustal Omega)](https://github.com/microsoft/discovery/tree/main/agents/msa-align) | Aligns multiple protein or nucleotide sequences. | `alignment`, `bioinformatics`, `clustal`, `mafft`, `msa`, `muscle` |
| [NCBI BLAST+](https://github.com/microsoft/discovery/tree/main/agents/blast-plus) | Finds similarities between biological sequences. | `alignment`, `bioinformatics`, `blast`, `sequence-search` |
| [Nucleotide Transformer](https://github.com/microsoft/discovery/tree/main/agents/nucleotide-tf) | Analyzes DNA sequences and potential variant effects. | `bioinformatics`, `dna-analysis`, `embeddings`, `genomics`, `trained-model`, `transformer` |
| [pyOpenMS](https://github.com/microsoft/discovery/tree/main/agents/pyopenms) | Processes mass-spectrometry data for proteomics and metabolomics. | `mass-spectrometry`, `metabolomics`, `proteomics`, `pyopenms` |
| [RNA-seq Analysis](https://github.com/microsoft/discovery/tree/main/agents/rnaseq) | Analyzes gene expression differences and related pathways. | `bioinformatics`, `rna-seq`, `transcriptomics` |
| [Samtools / BCFtools](https://github.com/microsoft/discovery/tree/main/agents/samtools-suite) | Processes sequencing alignments and genetic variant data. | `alignments`, `bioinformatics`, `genomics`, `samtools`, `variants` |
| [Synthesize Bio](https://github.com/microsoft/discovery/tree/main/agents/synthesize-bio) | Generates synthetic gene expression profiles for research. | `bioinformatics`, `gene-expression`, `life-sciences`, `rna-seq`, `single-cell`, `transcriptomics` |
| [Tellurium](https://github.com/microsoft/discovery/tree/main/agents/tellurium) | Models the behavior of biochemical networks. | `kinetic-modeling`, `sbml`, `systems-biology`, `tellurium` |
| [UniProt](https://github.com/microsoft/discovery/tree/main/agents/uniprot) | Finds protein sequences and functional information. | `annotations`, `api`, `bioinformatics`, `proteins`, `uniprot` |
| [ViennaRNA](https://github.com/microsoft/discovery/tree/main/agents/viennarna) | Predicts RNA secondary structures and thermodynamic properties. | `bioinformatics`, `rna`, `secondary-structure`, `viennarna` |

## Materials and simulation

These agents support materials data retrieval and analysis, atomistic simulations, crystal structure generation, and quantum chemistry calculations.

| Agent | Description | Capability tags |
| --- | --- | --- |
| [ASE (Atomic Simulation Environment)](https://github.com/microsoft/discovery/tree/main/agents/ase) | Builds and optimizes atomic structures for simulation. | `ase`, `atomistic`, `materials-science`, `optimization` |
| [CP2K](https://github.com/microsoft/discovery/tree/main/agents/cp2k) | Studies molecular and materials properties through quantum simulations. | `dft`, `materials-science`, `quantum-chemistry` |
| [DFTB+](https://github.com/microsoft/discovery/tree/main/agents/dftbplus) | Estimates quantum properties of molecules and materials. | `dftbplus`, `quantum-chemistry`, `semi-empirical`, `tight-binding` |
| [GROMACS](https://github.com/microsoft/discovery/tree/main/agents/gromacs) | Simulates molecular dynamics. | `molecular-dynamics` |
| [LAMMPS CPU](https://github.com/microsoft/discovery/tree/main/agents/lammps) | Simulates molecular systems and materials behavior. | `materials-science`, `molecular-dynamics` |
| [Materials Project](https://github.com/microsoft/discovery/tree/main/agents/materials-project) | Finds computed properties of inorganic materials. | `api`, `database`, `materials-project`, `materials-science`, `properties` |
| [Matminer](https://github.com/microsoft/discovery/tree/main/agents/matminer) | Describes material features for property analysis. | `featurization`, `machine-learning`, `materials-science`, `matminer` |
| [MatterGen Crystal Generator](https://github.com/microsoft/discovery/tree/main/agents/mattergen) | Generates crystal structures with desired material properties. | `computational-chemistry`, `crystal-structure`, `diffusion-model`, `generative-model`, `materials-science`, `trained-model` |
| [MDAnalysis](https://github.com/microsoft/discovery/tree/main/agents/mdanalysis) | Analyzes molecular motion and structural changes over time. | `mdanalysis`, `molecular-dynamics`, `trajectory-analysis` |
| [Phonopy](https://github.com/microsoft/discovery/tree/main/agents/phonopy) | Studies lattice vibrations and thermal properties. | `lattice-dynamics`, `materials-science`, `phonons`, `phonopy` |
| [Psi4](https://github.com/microsoft/discovery/tree/main/agents/psi4) | Calculates molecular energies, structures, and chemical properties. | `ab-initio`, `dft`, `quantum-chemistry` |
| [Pymatgen](https://github.com/microsoft/discovery/tree/main/agents/pymatgen) | Analyzes crystal structures, symmetry, and materials properties. | `crystallography`, `materials-science`, `pymatgen`, `symmetry` |
| [PySCF](https://github.com/microsoft/discovery/tree/main/agents/pyscf) | Calculates electronic and molecular properties. | `dft`, `hartree-fock`, `pyscf`, `quantum-chemistry` |
| [Quantum ESPRESSO](https://github.com/microsoft/discovery/tree/main/agents/quantum-espresso) | Studies electronic structure and materials properties. | `dft`, `materials-science`, `quantum-chemistry` |
| [spglib](https://github.com/microsoft/discovery/tree/main/agents/spglib) | Identifies and analyzes crystal symmetry. | `crystallography`, `materials-science`, `spglib`, `symmetry` |

## Proteins and structure

These agents support protein structure retrieval, prediction, design, comparison, and analysis, together with biomolecular simulation.

| Agent | Description | Capability tags |
| --- | --- | --- |
| [AlphaFold](https://github.com/microsoft/discovery/tree/main/agents/alphafold) | Predicts structures of proteins and protein complexes. | `alphafold`, `protein-folding`, `structural-biology`, `structure-prediction`, `trained-model` |
| [AlphaFold DB](https://github.com/microsoft/discovery/tree/main/agents/alphafold-db) | Finds predicted protein structures and confidence assessments. | `alphafold`, `api`, `protein-structure`, `structural-biology` |
| [AmberTools](https://github.com/microsoft/discovery/tree/main/agents/ambertools) | Simulates biomolecular systems and analyzes their behavior. | `biomolecular-simulation`, `molecular-dynamics` |
| [BoltzGen](https://github.com/microsoft/discovery/tree/main/agents/boltzgen) | Generates and evaluates protein binder designs. | `diffusion-model`, `generative-model`, `protein-design`, `structure-prediction`, `trained-model` |
| [DSSP](https://github.com/microsoft/discovery/tree/main/agents/dssp) | Identifies secondary structures in proteins. | `dssp`, `secondary-structure`, `structural-biology` |
| [ESM-2 Protein Embeddings](https://github.com/microsoft/discovery/tree/main/agents/esm-embed) | Represents protein sequences for similarity and structure analysis. | `bioinformatics`, `embedding-model`, `embeddings`, `esm2`, `gpu`, `language-model`, `protein`, `representation-learning`, `structure-prediction`, `trained-model`, `transformer` |
| [Foldseek](https://github.com/microsoft/discovery/tree/main/agents/foldseek) | Searches and compares protein structures. | `alignment`, `foldseek`, `structural-biology`, `structure-search` |
| [fpocket](https://github.com/microsoft/discovery/tree/main/agents/fpocket) | Identifies potential ligand-binding pockets in proteins. | `binding-site`, `druggability`, `fpocket`, `structural-biology` |
| [FreeSASA](https://github.com/microsoft/discovery/tree/main/agents/freesasa) | Measures solvent-accessible areas of protein structures. | `freesasa`, `sasa`, `structural-biology`, `surface-area` |
| [MODELLER](https://github.com/microsoft/discovery/tree/main/agents/modeller) | Builds protein structure models from related structures. | `homology-modeling`, `modeller`, `structural-biology` |
| [OpenMM](https://github.com/microsoft/discovery/tree/main/agents/openmm) | Simulates molecular motion and analyzes biomolecular behavior. | `biomolecular-simulation`, `gpu`, `molecular-dynamics` |
| [P2Rank](https://github.com/microsoft/discovery/tree/main/agents/p2rank) | Predicts ligand-binding sites in protein structures. | `binding-site`, `machine-learning`, `p2rank`, `structural-biology` |
| [PDB Insights](https://github.com/microsoft/discovery/tree/main/agents/pdb-insights) | Assesses protein structure quality and biological context. | `protein-structure`, `structural-biology` |
| [PDB Search](https://github.com/microsoft/discovery/tree/main/agents/pdb-search) | Finds and retrieves experimentally determined protein structures. | `database`, `protein-structure` |
| [PLIP (Protein-Ligand Interaction Profiler)](https://github.com/microsoft/discovery/tree/main/agents/plip) | Characterizes interactions between proteins and ligands. | `interactions`, `plip`, `protein-ligand`, `structural-biology` |
| [ProDy](https://github.com/microsoft/discovery/tree/main/agents/prody) | Analyzes protein motion and structural flexibility. | `dynamics`, `normal-mode-analysis`, `prody`, `structural-biology` |
| [RFDiffusion](https://github.com/microsoft/discovery/tree/main/agents/rfdiffusion) | Designs protein structures and binders. | `diffusion-model`, `generative-model`, `protein-design`, `trained-model` |
| [TM-align / US-align](https://github.com/microsoft/discovery/tree/main/agents/tmalign) | Aligns protein structures and measures structural similarity. | `structural-biology`, `structure-alignment`, `tm-score`, `tmalign` |

## Research and data

These agents support literature reviews, evidence synthesis, clinical-trial data retrieval, patent analysis, and statistical validation.

| Agent | Description | Capability tags |
| --- | --- | --- |
| [Bookshelf Researcher](https://github.com/microsoft/discovery/tree/main/agents/bookshelf-researcher) | Synthesizes research evidence from attached knowledge sources. | `knowledge-base`, `literature-review`, `research` |
| [Clinical Trials](https://github.com/microsoft/discovery/tree/main/agents/clinical-trials) | Finds clinical studies and trial information. | `clinical-trials`, `database` |
| [Nexus Researcher](https://github.com/microsoft/discovery/tree/main/agents/wiley-nexus) | Synthesizes scientific publications to answer research questions. | `evidence-synthesis`, `full-text-analysis`, `literature-review`, `research`, `scholarly-publishing` |
| [Online Researcher](https://github.com/microsoft/discovery/tree/main/agents/online-researcher) | Reviews literature across scientific and engineering fields. | `literature-review`, `research` |
| [Patent Prior Art](https://github.com/microsoft/discovery/tree/main/agents/patent-prior-art) | Compares patent claims with prior art. | `legal-tech`, `patent-analysis`, `prior-art` |
| [PubMed](https://github.com/microsoft/discovery/tree/main/agents/pubmed) | Finds biomedical literature and research evidence. | `biomedical`, `literature-search` |
| [Statistical Validation Agent](https://github.com/microsoft/discovery/tree/main/agents/stat-agent) | Evaluates experimental results and statistical evidence. | `data-analysis`, `hypothesis-testing`, `statistics` |

## Spectroscopy and metabolomics

These agents support spectral comparison and metabolite identification.

| Agent | Description | Capability tags |
| --- | --- | --- |
| [matchms](https://github.com/microsoft/discovery/tree/main/agents/matchms) | Compares mass spectra for metabolite identification. | `mass-spectrometry`, `matchms`, `metabolomics`, `spectral-similarity` |
| [SIRIUS](https://github.com/microsoft/discovery/tree/main/agents/sirius) | Identifies molecular formulas and candidate metabolite structures. | `mass-spectrometry`, `metabolomics`, `sirius`, `structure-elucidation` |

## Related content

- [Microsoft Discovery agent types](concept-discovery-agent-types.md)
- [Responsible AI in Microsoft Discovery](concept-responsible-ai.md)
