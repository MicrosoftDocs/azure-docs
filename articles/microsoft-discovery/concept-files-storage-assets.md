---
title: Files and storage assets in Microsoft Discovery
description: Learn how files work in Microsoft Discovery investigations, including how agents create and read files, supported file types, how files move between tasks, and current limitations.
author: hectoralinares
ms.author: hectorl
ms.service: azure
ms.topic: concept-article
ms.date: 04/02/2026

#CustomerIntent: As a researcher or scientist, I want to understand how files are handled in Microsoft Discovery so that I can design investigations that produce and use file outputs effectively.
---

# Files and storage assets

When agents work on tasks in a Microsoft Discovery investigation, they often produce files such as research reports, datasets, configuration files, or computational results. These files are stored as **storage assets** in Azure Blob Storage and tracked as part of the task results. Understanding how files flow through an investigation helps you design tasks that produce useful outputs and write validation requirements that verify file content.

## How agents work with files

Agents don't interact with Azure Blob Storage directly. Instead, they use a set of built-in tools that the platform injects into every agent:

| Tool | Purpose |
|------|---------|
| **GetResourceContext** | Lists all files available in the agent's workspace. Returns file names, URIs, and descriptions. |
| **PreviewResource** | Reads the content of a file. Works like opening a file to see what's inside. |
| **WriteResource** | Creates a new file with the specified content and file name. |
| **ShareResource** | Makes a file visible to the user by promoting it to a storage asset. |
| **UpdateResourceDetails** | Updates the description or metadata of an existing file. |

When an agent calls **WriteResource**, the platform uploads the content to blob storage, creates a storage asset (an Azure Resource Manager resource), and adds the file to the task's data context so other tools can find it. The file also appears in the task result as a `storageAssetId`.

> [!IMPORTANT]
> Agents access blob storage through the platform's managed identity, not your identity. This means agents can create files that **you can't view** unless your administrator has granted you access. To view output files in VS Code, you need **Storage Blob Data Reader** (or Contributor) on the storage account, and your network must be able to reach the storage endpoint. If you see access errors when clicking file links, contact your administrator. See [Azure Blob Storage in Microsoft Discovery](concept-storage-account.md) for the required configuration.

## Supported file types

The built-in file tools work with **text-based content only**. When an agent writes a file, the content is stored as UTF-8 encoded text. When an agent reads a file, the content is returned as text with a maximum preview size of 30 KB.

### Natively supported formats

Files in these formats can be created with **WriteResource** and read with **PreviewResource**:

- Markdown (`.md`)
- Plain text (`.txt`)
- CSV (`.csv`)
- JSON (`.json`)
- Python (`.py`)
- YAML (`.yaml`, `.yml`)
- Files with no extension

### Formats that can't be previewed

**PreviewResource** blocks binary file formats and returns an error message instead of file content. Blocked formats include:

- Documents (`.docx`, `.pdf`)
- Images (`.jpg`, `.png`, `.gif`)
- Audio/Video (`.mp3`, `.mp4`)
- Archives (`.zip`, `.tar`, `.gz`)
- Scientific data (`.hdf5`)
- Executables (`.exe`)

> [!NOTE]
> You can still **store** binary files in an investigation through custom tools running on a [supercomputer](how-to-manage-supercomputers.md). The file exists as a storage asset and can be downloaded, but agents can't read its content using the built-in tools. To work with binary formats, use a custom tool that understands the format, such as a Word document tool that can create and read `.docx` files through its own actions.

## Storage assets and the data context

Two concepts are central to how files work in Microsoft Discovery:

- **Storage asset**: An Azure Resource Manager resource that represents a file in blob storage. Each storage asset has a unique ID, a path to the blob content, and metadata like a name and description. When you see `storageAssetIds` on a task result, these are references to storage assets.

- **Data context**: A per-conversation index that maps virtual file URIs to physical blob locations. When an agent calls **GetResourceContext**, it reads from the data context to discover what files are available.

Files are addressed using `discovery://` URIs. Agents see URIs like `discovery://resources/my-container/paths/writes/report.md` and pass them to **PreviewResource** to read content. The platform handles the translation from these virtual URIs to physical blob storage paths.

## How files move between tasks

Understanding file visibility is important when you design multi-task investigations.

### What an agent can see

When a task starts, its agent can see:

- Files explicitly listed in the task's own `storageAssetIds` (set when the task was created or updated)
- Files from the task's own previous execution runs (stored in `taskResult.storageAssetIds`)

The agent **cannot** see files produced by other tasks in the investigation, including parent tasks, sibling tasks, and child tasks. File visibility is scoped to the individual task.

### Upward propagation

When a child task completes, its output files are automatically copied to the parent task's `taskResult.storageAssetIds`. This propagation continues up the hierarchy, from child to parent to grandparent, all the way to the root task. Propagation ensures that the root task accumulates all output files from the entire investigation, giving you a single place to find every artifact.

> [!IMPORTANT]
> Upward propagation is for **customer visibility**. It puts all file references on the root task so you can find them. It does **not** make those files available to agents working on other tasks. Each agent only sees its own task's files.

### Practical implications

Consider this task hierarchy:

```
Root Task
├── Task A (produces findings.csv)
├── Task B (produces analysis.md)
└── Task C (depends on A and B, produces report.md)
```

- Task A's agent writes `findings.csv`. Only Task A's agent can see it.
- Task B's agent writes `analysis.md`. Only Task B's agent can see it.
- Task C's agent **cannot** read `findings.csv` or `analysis.md` directly, even though Task C depends on Tasks A and B.
- After all tasks complete, the root task's `storageAssetIds` contains `findings.csv`, `analysis.md`, and `report.md` from propagation.

To share information between tasks, agents should include key findings in the **task result text**, which cognition uses when building context for downstream tasks. Dependencies (`dependsOn`) control execution order, not file access.

## How the Discovery Engine validates file outputs

When [cognition](concept-cognition-overview.md) validates a completed task, it can inspect file outputs as part of the validation process. The validation agent receives the task's storage assets and uses the same built-in tools (**GetResourceContext** and **PreviewResource**) to read and evaluate file content against your validation requirements.

Write validation requirements that describe **what the file should contain**, not which tools to use:

**Effective validation requirements:**
- "Read the output file and verify it contains at least five data rows"
- "Verify the report includes a methodology section and a conclusion"
- "Confirm the JSON output contains a valid molecular weight value"

**Less effective validation requirements:**
- "Verify the file was created" (too vague, doesn't check content)
- "Verify the storageAssetId isn't empty" (checks metadata, not content)

> [!NOTE]
> Validation can only inspect text-based files. If a task produces binary files (such as `.docx` from a custom tool), the validation agent can confirm the file exists as a storage asset but can't read its content. For binary outputs, write validation requirements that focus on what the agent reported in the task result text rather than file content verification.

## Working with binary files through custom tools

For file formats that the built-in tools don't support, you can create [custom tools](concept-discovery-agent-types.md) that run on a [supercomputer](how-to-manage-supercomputers.md). A custom tool handles the binary format internally and exposes actions that agents can call.

## Current limitations

| Limitation | Description |
|-----------|-------------|
| **No file upload from Discovery Studio** | You can link existing data assets to tasks and investigations, but you can't upload files from your local machine through the Studio interface. |
| **Task-scoped file visibility** | Agents can only see files from their own task. Files from parent, sibling, or other tasks aren't available, even when dependencies are defined. |
| **Text-only native tools** | Built-in file tools work with text content only. Binary files require custom tools on a supercomputer. |
| **30 KB preview limit** | **PreviewResource** returns the first 30 KB of a file. Larger files are truncated. |
| **No file content awareness during planning** | The Discovery Engine evaluates files during task validation but doesn't inspect file contents when planning or decomposing tasks. |

## Related content

- [Discovery Engine overview](concept-discovery-engine.md)
- [Tasks and investigations](concept-tasks-investigations.md)
- [Cognition overview](concept-cognition-overview.md)
- [Build investigations with cognition](how-to-build-investigations-cognition.md)
- [Task addition and execution](how-to-task-addition-execution.md)
