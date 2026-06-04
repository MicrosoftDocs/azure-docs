---
title: Files and storage assets in Microsoft Discovery
description: Learn how files work in Microsoft Discovery shared sessions, including how agents create and read files, supported file types, how files move between tasks through inheritance, and current limitations.
author: hectoralinares
ms.author: hectorl
ms.service: azure
ms.topic: concept-article
ms.date: 05/29/2026

#CustomerIntent: As a researcher or scientist, I want to understand how files are handled in Microsoft Discovery so that I can design shared sessions that produce and use file outputs effectively.
---

# Files and storage assets

When agents work on tasks in a Microsoft Discovery shared session, they often produce files such as research reports, datasets, configuration files, or computational results. These files are stored as **storage assets** in Azure Blob Storage and tracked as part of the task results. Understanding how files flow through a shared session helps you design tasks that produce useful outputs and write validation requirements that verify file content. The Microsoft Discovery app stores these files locally on disk instead of in Azure Blob Storage, but the lifecycle and inheritance behavior described here apply to both. See [Microsoft Discovery and the Microsoft Discovery app](concept-discovery-and-discovery-app.md).

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
> You can still **store** binary files in a shared session through custom tools running on a [supercomputer](how-to-manage-supercomputers.md). The file exists as a storage asset and can be downloaded, but agents can't read its content using the built-in tools. To work with binary formats, use a custom tool that understands the format, such as a Word document tool that can create and read `.docx` files through its own actions.

## Storage assets and the data context

Two concepts are central to how files work in Microsoft Discovery:

- **Storage asset**: An Azure Resource Manager resource that represents a file in blob storage. Each storage asset has a unique ID, a path to the blob content, and metadata like a name and description. When you see `storageAssetIds` on a task result, these are references to storage assets.

- **Data context**: A per-conversation index that maps virtual file URIs to physical blob locations. When an agent calls **GetResourceContext**, it reads from the data context to discover what files are available. Files inherited from upstream or parent tasks also appear in the data context, so **GetResourceContext** is the single discovery point regardless of where a file was originally written.

Files are addressed using `discovery://` URIs. Agents see URIs like `discovery://resources/my-container/paths/writes/report.md` and pass them to **PreviewResource** to read content. The platform handles the translation from these virtual URIs to physical blob storage paths.

## How files move between tasks

Understanding file visibility is important when you design multi-task shared sessions. Files reach a downstream task through two inheritance paths plus the task's own state.

### What an agent can see

When a task starts, its agent can see:

- Files explicitly listed in the task's own `storageAssetIds` (set when the task was created or updated).
- Files from the task's own previous execution runs (stored in `taskResult.storageAssetIds`).
- **Parent-chain inheritance.** A subtask inherits the storage assets attached to its parent's `storageAssetIds`. Inputs you attach to a root task flow down to every subtask under it, transitively.
- **Dependency-graph inheritance.** A task with `dependsOn=[A]` inherits the outputs from A's `taskResult.StorageAssetIds`. Inheritance is transitive: if A → B → C, then C sees both B's and A's outputs. Duplicates are deduplicated.

Every inherited file is recorded in execution history under the `inheritedStorageAssets` action, with a breakdown of `parentStorageAssetCount` and `dependencyStorageAssetCount` so you can audit where each file came from.

Inherited files appear in the agent's data context alongside locally written files. The agent must still call **GetResourceContext** to list them and **PreviewResource** to read content — files are not auto-injected into the prompt.

### What doesn't propagate automatically

- **Sibling tasks without an explicit `dependsOn` edge.** Two siblings that don't declare a dependency don't share file outputs, even if one finishes before the other.
- **Cross-shared-session files.** Inheritance is scoped to a single shared session. Files don't cross shared-session boundaries.
- **Prompt content.** Inherited files are discoverable through the data context; their contents only enter the conversation when the agent reads them with **PreviewResource**.

### Upward propagation (root visibility)

When a child task completes, its output files are also copied to the parent task's `taskResult.storageAssetIds`. This propagation continues up the hierarchy, from child to parent to grandparent, all the way to the root task. Propagation ensures that the root task accumulates all output files from the entire shared session, giving you a single place to find every artifact.

> [!IMPORTANT]
> Upward propagation and dependency inheritance are **two different mechanisms**. Upward propagation aggregates outputs onto the root task so *you* can find them. Dependency and parent-chain inheritance is what makes upstream files available to *downstream agents*.

### Practical implications

Consider this task hierarchy:

```
Root Task
├── Task A (produces findings.csv)
├── Task B (produces analysis.md)
├── Task C (dependsOn=[A, B], produces report.md)
└── Task D (no dependsOn, produces notes.md)
```

- Task A's agent writes `findings.csv`. Task B's agent writes `analysis.md`.
- Task C's agent **inherits** `findings.csv` from A and `analysis.md` from B because C depends on both. Both files appear in C's data context, and C's agent can read them with **PreviewResource**.
- Task D has no `dependsOn` edge to A or B, so D's agent **doesn't** see `findings.csv` or `analysis.md`. Siblings without an explicit dependency don't share outputs.
- After all tasks complete, the root task's `storageAssetIds` contains every output (`findings.csv`, `analysis.md`, `report.md`, `notes.md`) through upward propagation, regardless of inheritance edges.

Including key findings in the **task result text** is still good practice — cognition uses that text when building context for downstream tasks, and it surfaces conclusions even when an agent doesn't open every inherited file. But it's no longer the only way to share information; `dependsOn` is the supported mechanism for propagating files.

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
| **No file upload from Discovery Studio** | You can link existing data assets to tasks and shared sessions, but you can't upload files from your local machine through the Studio interface. |
| **Sibling tasks don't share files automatically** | Inheritance follows the task hierarchy and the `dependsOn` graph. Sibling tasks without an explicit `dependsOn` edge don't see each other's outputs, and files don't cross shared-session boundaries. |
| **Text-only native tools** | Built-in file tools work with text content only. Binary files require custom tools on a supercomputer. |
| **30 KB preview limit** | **PreviewResource** returns the first 30 KB of a file. Larger files are truncated. |
| **No file content awareness during planning** | The Discovery Engine evaluates files during task validation but doesn't inspect file contents when planning or decomposing tasks. |

## Related content

- [Discovery Engine overview](concept-discovery-engine.md)
- [Tasks and shared sessions](concept-tasks-investigations.md)
- [Cognition overview](concept-cognition-overview.md)
- [Build shared sessions with cognition](how-to-build-investigations-cognition.md)
- [Task addition and execution](how-to-task-addition-execution.md)
