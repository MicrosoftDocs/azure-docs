---
title: Create a tool definition for Microsoft Discovery
description: Learn how to write a tool definition YAML file that describes how Microsoft Discovery deploys, configures, and invokes your containerized tool.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: how-to
ms.date: 04/07/2026

#CustomerIntent: As a tool publisher, I want to write a tool definition YAML file so that Microsoft Discovery can correctly deploy, configure, and invoke my containerized tool within investigations.
---

# Create a tool definition for Microsoft Discovery

A tool definition is a YAML file that serves as the integration contract between your containerized tool and Microsoft Discovery. It tells the platform where your container image is, what compute resources the tool needs, and how to invoke each operation the tool exposes.

This article explains each section of a tool definition and provides complete examples for the three supported tool types: action-based, code environment, and hybrid.

> [!NOTE]
> This article assumes your container image is already published to Azure Container Registry. See [Publish a tool container image to Azure Container Registry](how-to-publish-tool-to-acr.md).

## Prerequisites

- A container image published to Azure Container Registry (ACR).
- The full ACR image reference for your tool (for example, `myregistry.azurecr.io/my-tool:v1.0.0`).
- The compute resource requirements benchmarked for your tool.

## Step 1: Create the metadata section

Start your tool definition with the basic metadata. This information appears in the Discovery tool catalog.

```yaml
name: my-analysis-tool          # Unique identifier for the tool
description: >
  A tool that performs molecular analysis including functional group
  identification and hazard screening. Accepts SMILES, CSV, or JSON input.
version: 1.0.0                  # Semantic version; increment when making breaking changes
category: Scientific Computing  # Category for organizing tools in the catalog
license: MIT                    # License for this tool definition
```

- Use a clear, lowercase `name` with hyphens rather than spaces. If you maintain multiple versions, include the version in the name (for example, `my-tool-v2`).
- Write a `description` that explains what the tool does in enough detail for agents to understand when to invoke it. Agents use this description to decide which tool is appropriate for a given task.

## Step 2: Define the infrastructure

The `infra` section specifies the container image and compute resources.

```yaml
infra:
  - name: worker
    infra_type: container
    image:
      acr: myregistry.azurecr.io/my-analysis-tool:v1.0.0
    compute:
      min_resources:
        cpu: 4          # Cores (integer) or millicores (e.g., 4000m)
        ram: 16Gi       # Memory in GiB
        storage: 64Gi   # Scratch storage in GiB
        gpu: 0          # Integer; 0 means no GPU
      max_resources:
        cpu: 8
        ram: 32Gi
        storage: 128Gi
        gpu: 0
      infiniband: false           # Set true for tightly coupled MPI workloads
      recommended_sku:
        - Standard_D4_v4
        - Standard_D8_v4
      pool_type: static           # Only supported pool type during preview
      pool_size: 1                # Number of container instances to run
```

**Resource sizing guidance:**

| Field | Guidance |
|---|---|
| `min_resources` | The minimum resources your tool needs to run. Must account for platform overhead. |
| `max_resources` | The maximum your tool may use under peak load. If the tool exceeds the memory limit, it is forcefully stopped. |
| `recommended_sku` | Suggest Azure Virtual Machine (VM) SKUs that match your resource profile. The platform uses this field as a hint when scheduling. |
| `pool_size` | For parallel workloads that run many simultaneous instances, increase this value. For most tools, `1` is correct. |

> [!NOTE]
> Dynamic GPU sharing isn't currently supported. When a tool definition specifies GPUs, the `min_resources.gpu` value is used for scheduling.

## Step 3a: Define actions (action-based and hybrid tools)

Add an `actions` section for each discrete operation your tool exposes. Each action needs a name, a description, an input schema, and a command template.

```yaml
actions:
  - name: identify_functional_groups
    description: >
      Identifies common functional groups in molecular structures including
      carbonyls, amines, alcohols, ethers, and halides. Accepts SMILES (.smi),
      CSV, or JSON input files. Writes detailed results to a CSV and a summary
      to results.json in the output directory.
    infra_node: worker
    input_schema:
      type: object
      properties:
        input_directory:
          type: string
          description: "Directory containing input files (SMILES, CSV, or JSON format)."
        output_directory:
          type: string
          description: "Directory where analysis results and output files are written."
        column_name:
          type: string
          description: >
            For CSV or TSV input files, the name of the column that contains
            SMILES strings. Defaults to 'smiles' if not provided.
        batch_size:
          type: number
          description: "Number of molecules to process per batch. Defaults to 100."
        file_pattern:
          type: string
          description: "Glob pattern to filter files in the input directory. Defaults to '*.*'."
      required:
        - input_directory
        - output_directory
    command: >
      python3 /app/entrypoint.py
      --action identify_functional_groups
      --input {{input_directory}}
      --output {{output_directory}}
      {{#if column_name}}--column-name {{column_name}}{{/if}}
      {{#if batch_size}}--batch-size {{batch_size}}{{/if}}
      {{#if file_pattern}}--file-pattern {{file_pattern}}{{/if}}
    environment_variables:
      - name: TOOL_INPUT_DIR
        value: "{{ input_directory }}"
      - name: TOOL_OUTPUT_DIR
        value: "{{ output_directory }}"
    output_mount_configurations:
      - mount_path: "{{ output_directory }}"
        auto_promote: false
        output_name: "FunctionalGroupResults"
        output_description: "Functional group analysis results"
```

**Action fields:**

| Field | Required | Description |
|---|---|---|
| `name` | Yes | Unique identifier for the action within the tool. |
| `description` | Yes | Explains what the action does, what inputs it expects, and what outputs it produces. Agents use this description to decide when to invoke the action. |
| `infra_node` | Yes | Which infrastructure node runs this action. Must match a `name` in the `infra` section. |
| `input_schema` | Yes | JSON Schema describing all parameters the action accepts. |
| `input_schema.required` | Yes | Array of parameter names that must always be provided. |
| `command` | Yes | Command template executed in the container. Uses `{{parameter}}` to insert values and `{{#if parameter}}...{{/if}}` for optional parameters. |
| `environment_variables` | No | Environment variable set in the container before the command runs. |
| `output_mount_configurations` | No | Directories to capture after the action runs. Set `auto_promote: true` to automatically share outputs as storage assets without the agent calling `ShareResource`. |

**`output_mount_configurations` fields:**

| Field | Required | Description |
|---|---|---|
| `mount_path` | Yes | Absolute path in the container to capture after execution. |
| `auto_promote` | Yes | If `true`, the platform automatically creates a storage asset from the captured directory after each run. If `false`, the agent must call `ShareResource` to share the outputs. |
| `output_name` | Yes | Display name for the storage asset created when `auto_promote` is `true`. |
| `output_description` | Yes | Description of the storage asset. |

## Step 3b: Define code environments (code environment and hybrid tools)

Add a `code_environments` section to allow agents to write and execute custom scripts using your container's installed libraries.

```yaml
code_environments:
  - language: python
    command: "python \"/{{scriptName}}\""
    description: >
      Python 3.11 environment with RDKit, ASE, pandas, NumPy, SciPy, and
      scikit-learn pre-installed. Use this environment to write custom
      molecular analysis scripts.
    infra_node: worker
```

When an agent uses a code environment, the Discovery platform generates a Python script, mounts it into the container at the path specified by `{{scriptName}}`, and executes it using the `command` template.

## Complete examples

### Example 1: Action-based tool

A tool that exposes two specific molecular analysis operations:

```yaml
name: molecular-groups-analyzer
description: >
  Analyzes molecular structures from SMILES input to identify functional groups
  and screen for hazardous chemical groups. Accepts SMILES (.smi), CSV, or JSON
  input files.
version: 1.0.0
category: Cheminformatics
license: MIT

infra:
  - name: worker
    infra_type: container
    image:
      acr: myregistry.azurecr.io/molecular-groups-analyzer:v1.0.0
    compute:
      min_resources:
        cpu: 2
        ram: 8Gi
        storage: 32Gi
        gpu: 0
      max_resources:
        cpu: 4
        ram: 16Gi
        storage: 64Gi
        gpu: 0
      recommended_sku:
        - Standard_D4s_v3
      pool_type: static
      pool_size: 1

actions:
  - name: identify_functional_groups
    description: >
      Identifies common functional groups in molecules (carbonyls, amines,
      alcohols, ethers, halides). Accepts SMILES, CSV, or JSON input. Writes
      a detailed CSV and results.json summary to the output directory.
    infra_node: worker
    input_schema:
      type: object
      properties:
        input_directory:
          type: string
          description: "Directory containing input molecule files."
        output_directory:
          type: string
          description: "Directory to write analysis results."
        column_name:
          type: string
          description: "Column name for SMILES strings in CSV files. Defaults to 'smiles'."
        batch_size:
          type: number
          description: "Molecules per batch. Defaults to 100."
      required:
        - input_directory
        - output_directory
    command: >
      python3 /app/entrypoint.py --action identify_functional_groups
      --input {{input_directory}} --output {{output_directory}}
      {{#if column_name}}--column-name {{column_name}}{{/if}}
      {{#if batch_size}}--batch-size {{batch_size}}{{/if}}

  - name: identify_hazardous_groups
    description: >
      Screens molecules for hazardous functional groups including explosives,
      PFAS, chemical weapon convention (CWC) compounds, and reactive groups.
      Accepts SMILES, CSV, or JSON input.
    infra_node: worker
    input_schema:
      type: object
      properties:
        input_directory:
          type: string
          description: "Directory containing input molecule files."
        output_directory:
          type: string
          description: "Directory to write hazard assessment results."
        categories:
          type: string
          description: >
            Comma-separated list of hazard categories to screen, or 'all' to
            screen all categories. Supported values: us_pfas_groups, cwc_groups,
            explosive_groups, self_reactive_groups, pnnl_hazardous_groups.
            Defaults to 'all'.
        batch_size:
          type: number
          description: "Molecules per batch. Defaults to 100."
      required:
        - input_directory
        - output_directory
    command: >
      python3 /app/entrypoint.py --action identify_hazardous_groups
      --input {{input_directory}} --output {{output_directory}}
      {{#if categories}}--categories {{categories}}{{/if}}
      {{#if batch_size}}--batch-size {{batch_size}}{{/if}}
```

### Example 2: Code environment tool

A tool that exposes a Python runtime with preinstalled molecular analysis libraries:

```yaml
name: moltoolkit
description: >
  A comprehensive molecular analysis toolkit providing Python 3.11 with RDKit,
  ASE, Biopython, pandas, NumPy, PyMOL, and OpenBabel pre-installed. Use the
  Python code environment to write custom molecular analysis scripts.
version: 1.0.0
category: Scientific Computing
license: MIT

infra:
  - name: worker
    infra_type: container
    image:
      acr: myregistry.azurecr.io/moltoolkit:v1.0.0
    compute:
      min_resources:
        cpu: 1
        ram: 8Gi
        storage: 8Gi
        gpu: 0
      max_resources:
        cpu: 2
        ram: 16Gi
        storage: 32Gi
        gpu: 0
      recommended_sku:
        - Standard_D4s_v3
      pool_type: static
      pool_size: 1

code_environments:
  - language: python
    command: "python \"/{{scriptName}}\""
    description: >
      Python 3.11 environment with RDKit, ASE, Biopython, MDAnalysis,
      pandas, NumPy, SciPy, PyMOL, and OpenBabel. Use for custom molecular
      analysis, conformer generation, descriptor calculation, and data processing.
    infra_node: worker
```

## Step 4: Validate the tool definition

Before registering your tool in Discovery, validate the YAML structure:

1. **Syntax check**: Run the YAML through a validator (for example, `python -c "import yaml; yaml.safe_load(open('tool-definition.yaml'))"`) to catch formatting errors.

2. **Command template check**: Manually expand each `command` template with representative parameter values and verify the resulting command matches what your container expects.

3. **Required parameters**: Confirm every parameter referenced in `command` is listed in `input_schema.properties` and that any required ones are in the `required` array.

4. **Image reference**: Confirm the `image.acr` value matches the exact tag you pushed to ACR.

## Step 5: Register the tool in Microsoft Discovery

After validating the definition, register the tool as a resource in your Discovery workspace. You can do register a tool through the Azure portal or via the REST API.

To perform this action, you need to convert the tool definition yaml created in [steps-3](#step-3a-define-actions-action-based-and-hybrid-tools) to corresponding json and provide that as an input during Discovery Tool resource creation.

## Related content

- [Plan tool requirements for Microsoft Discovery](how-to-plan-tool-requirements.md)
- [Write action scripts for a Discovery tool](how-to-write-tool-action-scripts.md)
- [Create a Dockerfile for a Discovery tool](how-to-create-tool-docker-file.md)
- [Publish a tool container image to Azure Container Registry](how-to-publish-tool-to-acr.md)
- [Manage data handling with tools and agents](how-to-data-handling-with-tools-agents.md)
