---
title: Plan tool requirements for Microsoft Discovery
description: Learn how to identify functionalities, compute needs, tool type, and dependencies before building and publishing a tool to Microsoft Discovery.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: how-to
ms.date: 04/07/2026

#CustomerIntent: As a tool publisher, I want to plan my tool's requirements and structure before building it so that I can produce a well-designed, efficient containerized tool for Microsoft Discovery.
---

# Plan tool requirements for Microsoft Discovery

Before containerizing and publishing a tool to Microsoft Discovery, carefully plan the tool's functionality, compute needs, and dependencies. A thorough planning phase reduces issues during containerization and helps ensure your tool works reliably within Discovery investigations.

> [!NOTE]
> This article applies to tools targeting Microsoft Discovery API version **2026-02-01-preview**.

## Prerequisites

- Familiarity with the tool or scientific capability you intend to publish
- Understanding of the target user workflows and expected inputs and outputs
- Access to the tool's source code, libraries, or binaries

Follow the steps as outlined here to plan your tool requirements:

## Step 1: Identify key functionalities

Start by deciding which capabilities your tool exposes to Discovery agents. A tool may have many internal functions, but you only need to publish the subset most useful in investigation workflows.

When evaluating your tool's scope, consider:

- **Core capabilities**: What are the primary scientific operations the tool performs?
- **User workflows**: How will researchers invoke this tool within an investigation?
- **Input and output formats**: What data formats does the tool accept, and what does it produce?
- **Action granularity**: Should each major operation be its own action, or can related operations be grouped?

> [!TIP]
> Start with a small, well-defined set of actions. You can add more in future versions. A focused tool with clear inputs and outputs integrates more reliably than one that exposes too many operations at once.

## Step 2: Document compute requirements

Record the compute resources your tool needs to run reliably. These values feed directly into the tool definition's `infra.compute` section.

| Requirement | What to capture |
|---|---|
| **Workload type** | Standard, intrinsically parallel (embarrassingly parallel workloads), or tightly coupled (MPI-based) |
| **CPU** | Number of cores needed; |
| **Memory** | RAM for typical workloads and for peak or worst-case inputs |
| **Storage** | Scratch storage for temporary files during execution |
| **GPU** | Whether the tool requires GPU; if so, GPU memory and compute level |
| **InfiniBand** | Whether tightly coupled Message Passing Interface (MPI) workloads require high-speed interconnect |
| **Scalability** | Whether to use a static pool (fixed number of containers) or elastic scaling |

Capture both a **minimum** (what the tool needs to start at all) and a **maximum** (the most it will ever use). The platform enforces max resource limits. Tools that exceed them will be forcefully stopped.

## Step 3: Select a tool type

Microsoft Discovery supports three tool types. Choose the one that best matches your tool's design:

| Tool type | Description | When to use |
|---|---|---|
| **Action-based** | Exposes specific, named operations through a command-line entrypoint. Each action has a defined input schema and a command template. | You have a well-defined set of operations with predictable inputs and outputs. Best for proprietary tools or when strict reproducibility is required. |
| **Code environment** | Provides a runtime environment (for example, Python or R) in which agents can write and execute custom code using the tool's pre-installed libraries. | You want agents to be able to write custom analysis scripts using the tool's scientific libraries. Best for open-ended or exploratory workflows. |
| **Hybrid** | Combines both actions and a code environment in a single tool definition. | You have some common predefined operations and custom scripting against the same libraries. |

For detailed guidance on choosing between types, see [Create a tool definition](how-to-create-tool-definition.md).

## Step 4: Plan action scripts (action-based and hybrid tools)

If you're building an action-based or hybrid tool, identify the scripts that implement each action. Each script must:

- Accept standardized, parameterized inputs (typically as command-line arguments)
- Perform robust input validation and return clear error messages on invalid input
- Expect input data at predictable filesystem mount points inside the container
- Write outputs to designated output directories inside the container
- Support batch processing for large inputs where applicable

> [!NOTE]
> Input and output directories are **mounted** into the container at runtime by the Discovery platform. Design your scripts to read from and write to absolute paths, not relative paths. For example, `/input` and `/output` rather than `./input` and `./output`. Also, the agent has no inherent knowledge of the internal file system layout of a tool container. It doesn't know what directories exist inside the container or which paths your tool reads from. **You must document the expected mount paths in the tool's description or in the agent's instructions**, so the agent knows what value to use for `mountPath` when invoking the tool.


## Step 5: Identify base image and dependencies

Identify every component that needs to be included in the container image. Container images must be self-contained. The tool can't assume any external dependencies are available at runtime.

**Components to include:**

| Component | Description |
|---|---|
| **Base OS image** | The Linux distribution your tool runs on. Choose one that supports required system libraries. |
| **Runtime dependencies** | Language runtimes such as Python, R, or Java. |
| **System libraries** | Required OS-level libraries such as libsm6, CUDA drivers for GPU, or MPI for parallel workloads. |
| **Application code** | Your tool's scripts, binaries, or compiled executables. |
| **Entrypoint script** | The script that the platform calls to execute an action. |
| **Package manifests** | `requirements.txt`, `environment.yml`, or equivalent, so dependencies are reproducible. |

**Batch processing:**

If your tool processes collections of items (for example, lists of SMILES strings, a directory of PDB files), plan how the container handles large batches. Options include:

- **Container-managed batching**: Add a script that splits large inputs into smaller chunks, processes each chunk, and aggregates results. Route all invocations through this script.
- **Agent-managed batching**: Rely on the agent to split large inputs and make multiple tool calls, each processing a manageable subset.

Container-managed batching is preferred for tools where the agent can't easily predict the correct batch size.

## Related content

- [Write action scripts for a Discovery tool](how-to-write-tool-action-scripts.md)
- [Create a Dockerfile for a Discovery tool](how-to-create-tool-docker-file.md)
- [Create a tool definition](how-to-create-tool-definition.md)
