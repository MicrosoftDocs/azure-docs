---
title: Write action scripts for a Microsoft Discovery tool
description: Learn how to implement action scripts for action-based tools in Microsoft Discovery, including entrypoint structure, input format handling, batch processing, and output conventions.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: how-to
ms.date: 04/07/2026

#CustomerIntent: As a tool publisher, I want to write well-structured action scripts so that my tool exposes reliable, deterministic operations that Discovery agents can invoke predictably.
---

# Write action scripts for a Microsoft Discovery tool

Action scripts implement the operations that your tool exposes to Discovery agents. Each action maps to a script (or a command dispatched by a central entrypoint) that the Discovery platform calls when an agent invokes that action.

This article describes how to structure action scripts, handle multiple input formats, implement batch processing, and produce consistent output, using a molecular analysis tool as a reference example.

> [!NOTE]
> This article applies to **action-based** and **hybrid** tools. If you're building a code environment tool, see [Create a tool definition](how-to-create-tool-definition.md) instead.

## Prerequisites

- You have identified the actions your tool exposes. See [Plan tool requirements for Microsoft Discovery](how-to-plan-tool-requirements.md).
- You have a working implementation of the tool's core logic.
- Python 3.8 or later (if following the Python patterns in this article).

## Understand the action-based tool structure

An action-based tool container typically contains:

| Component | Purpose |
|---|---|
| **Entrypoint script** | Receives the action name and parameters, validates inputs, and dispatches to the appropriate action function. |
| **Action modules** | Python modules (or equivalent) that contain the logic for each action. |
| **I/O utilities** | Helper functions for reading input files in supported formats and writing structured results. |
| **Tool definition YAML** | The file that declares each action to the Discovery platform. The `command` field in the YAML calls the entrypoint script. |

## Step 1: Design the entrypoint script

The entrypoint is the single executable the platform calls for every action. It receives the action name and all action parameters as command-line arguments, then dispatches to the appropriate function.

```python
#!/usr/bin/env python3
"""Entrypoint script for action-based tool."""

import argparse
import sys

AVAILABLE_ACTIONS = {
    'action_one': {'description': 'Performs the first action'},
    'action_two': {'description': 'Performs the second action'},
}

def parse_arguments():
    parser = argparse.ArgumentParser(description="My Tool")
    parser.add_argument('--action', choices=AVAILABLE_ACTIONS.keys(),
                        required=True, help='Action to perform')
    parser.add_argument('--input', required=True,
                        help='Path to input directory or file')
    parser.add_argument('--output', required=True,
                        help='Path to output directory')
    # Add action-specific optional parameters here
    return parser.parse_args()

def main():
    args = parse_arguments()

    if args.action == 'action_one':
        success = run_action_one(args.input, args.output, vars(args))
    elif args.action == 'action_two':
        success = run_action_two(args.input, args.output, vars(args))
    else:
        print(f"Unknown action: {args.action}", file=sys.stderr)
        return 1

    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
```

**Key principles:**

- Return exit code `0` on success and a non-zero code on failure. The Discovery platform uses the exit code to determine whether an action succeeded.
- Write error messages to `stderr` and results to `stdout` or to the output directory.
- Keep the entrypoint thin and dispatch quickly to action-specific modules rather than implementing logic directly in the entrypoint.

## Step 2: Implement action functions

Each action function follows a consistent pattern: validate inputs, process data, write outputs, and return a boolean result.

```python
def run_action_one(input_path: str, output_path: str, params: dict) -> bool:
    """
    Run action_one.

    Args:
        input_path: Path to the input directory or file (mounted by Discovery platform).
        output_path: Path to the output directory (mounted by Discovery platform).
        params: Additional parameters from the command line.

    Returns:
        True if the action completed successfully, False otherwise.
    """
    try:
        # 1. Set up logging
        setup_logger('action_one', output_path)

        # 2. Find and validate input files
        input_files = find_input_files(input_path, params)
        if not input_files:
            log_error("No valid input files found at: " + input_path)
            return False

        # 3. Process each file
        results = []
        for file_path in input_files:
            file_results = process_file(file_path, params)
            results.extend(file_results)

        # 4. Write structured output
        write_results(output_path, results)

        return True

    except Exception as e:
        log_error(f"Error in action_one: {e}")
        return False
```

> [!IMPORTANT]
> Use absolute paths throughout. The Discovery platform mounts input and output directories at container-level absolute paths such as `/input` and `/output`. Don't use relative paths.

## Step 3: Support multiple input formats

Design your scripts to handle the input file formats your users are likely to provide. A common pattern is to detect the file format from the extension and delegate to a format-specific reader.

**Example: supporting SMILES, CSV, and JSON inputs**

```python
# Plain SMILES file (one SMILES string per line)
# molecules.smi
CCO
CC(=O)O
c1ccccc1
CN1C=NC2=C1C(=O)N(C(=O)N2C)C
```

```csv
# CSV file with named columns
smiles,name
CCO,ethanol
CC(=O)O,acetic acid
c1ccccc1,benzene
```

```json
[
    {"smiles": "CCO", "name": "ethanol"},
    {"smiles": "CC(=O)O", "name": "acetic acid"}
]
```

```python
def find_input_files(input_path: str, params: dict) -> list:
    """Return a list of supported input files from a directory or single file path."""
    import os, glob

    if os.path.isfile(input_path):
        return [input_path]

    pattern = params.get('file_pattern', '*.*')
    return glob.glob(os.path.join(input_path, pattern))


def read_molecules(file_path: str, column_name: str = 'smiles') -> list:
    """Read molecule SMILES strings from a .smi, .csv, or .json file."""
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.smi':
        with open(file_path) as f:
            return [line.strip() for line in f if line.strip() and not line.startswith('#')]
    elif ext == '.csv':
        import pandas as pd
        df = pd.read_csv(file_path)
        return df[column_name].dropna().tolist()
    elif ext == '.json':
        import json
        with open(file_path) as f:
            data = json.load(f)
        return [item[column_name] for item in data if column_name in item]
    else:
        raise ValueError(f"Unsupported file format: {ext}")
```

## Step 4: Implement batch processing

If your tool has an upper limit on how many items it can process at once, add batching logic in the container rather than relying on the agent to manage it.

```python
def process_in_batches(items: list, batch_size: int, process_fn) -> list:
    """
    Process items in chunks to avoid memory exhaustion.

    Args:
        items: Full list of items to process.
        batch_size: Maximum items per batch.
        process_fn: Callable that processes a single batch and returns results.

    Returns:
        Aggregated results across all batches.
    """
    results = []
    total = len(items)

    for start in range(0, total, batch_size):
        batch = items[start:start + batch_size]
        print(f"Processing batch {start // batch_size + 1} "
              f"({start + 1}–{min(start + batch_size, total)} of {total})")
        batch_results = process_fn(batch)
        results.extend(batch_results)

    return results
```

> [!TIP]
> Print progress messages to `stdout`. These messages appear in the Discovery conversation history and help agents and researchers understand where a long-running action is in its execution.

## Step 5: Write structured output

Write results to a `results.json` file in the output directory, along with any supporting files (CSVs, PDB files, plots). The JSON summary provides a machine-readable record the agent can inspect with `PreviewResource`.

```python
import json
import os
from datetime import datetime

def write_results(output_path: str, results: list, action_name: str, params: dict):
    """Write results to the output directory."""
    os.makedirs(output_path, exist_ok=True)

    summary = {
        "action": action_name,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "parameters": params,
        "summary": {
            "total_items": len(results),
            "successful": sum(1 for r in results if r.get('status') == 'ok'),
        },
        "output_files": {},
        "status": "completed"
    }

    # Write detailed results to CSV
    import pandas as pd
    detail_path = os.path.join(output_path, f"{action_name}_detailed.csv")
    pd.DataFrame(results).to_csv(detail_path, index=False)
    summary["output_files"]["detailed"] = detail_path

    # Write summary JSON
    summary_path = os.path.join(output_path, "results.json")
    with open(summary_path, 'w') as f:
        json.dump(summary, f, indent=2)
```

**Example `results.json`:**

```json
{
  "action": "identify_functional_groups",
  "timestamp": "2026-04-07 14:30:00",
  "parameters": { "files_processed": 1 },
  "summary": {
    "total_molecules": 4,
    "total_groups_found": 12,
    "group_distribution": {
      "alcohol": 2,
      "carbonyl": 1,
      "aromatic": 2
    }
  },
  "output_files": {
    "detailed_analysis": "/output/functional_groups_detailed.csv"
  },
  "status": "completed"
}
```

## Step 6: Test the scripts locally

Before building your container image, verify that the scripts work as expected locally.

```bash
# Test a single action
python app/entrypoint.py \
  --action identify_functional_groups \
  --input ./sample-input/ \
  --output ./sample-output/

# Verify output was written
ls ./sample-output/
cat ./sample-output/results.json
```

## Step 7: Integrate with the tool definition

Once your scripts are working locally, create the tool definition YAML that exposes each action to the Discovery platform. The `command` field uses Handlebars syntax to map action parameters to the entrypoint arguments.

```yaml
actions:
  - name: identify_functional_groups
    description: Identifies common functional groups in molecule input files (SMILES, CSV, or JSON format).
    infra_node: worker
    input_schema:
      type: object
      properties:
        input_directory:
          type: string
          description: "Directory containing input files (SMILES, CSV, or JSON)."
        output_directory:
          type: string
          description: "Directory where output files and analysis results are written."
        column_name:
          type: string
          description: "For CSV files, the column containing SMILES strings. Defaults to 'smiles'."
        batch_size:
          type: number
          description: "Molecules per batch. Defaults to 100."
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
```

For full tool definition guidance, see [Create a tool definition](how-to-create-tool-definition.md).

## Related content

- [Plan tool requirements for Microsoft Discovery](how-to-plan-tool-requirements.md)
- [Create a Dockerfile for a Discovery tool](how-to-create-tool-docker-file.md)
- [Create a tool definition](how-to-create-tool-definition.md)
