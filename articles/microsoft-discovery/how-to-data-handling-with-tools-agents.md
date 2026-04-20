---
title: Manage data handling with tools and agents in Microsoft Discovery
description: Learn how to configure Microsoft Discovery agents to manage storage assets produced and consumed by tools, including resource URIs, built-in resource management tools, storage asset promotion, and input and output mounts.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: how-to
ms.date: 04/07/2026

#CustomerIntent: As a researcher or scientist, I want to configure how Microsoft Discovery manages data between agents and tools so that I can design reliable scientific workflows with predictable data handling behavior.
---

# Manage data handling with tools and agents in Microsoft Discovery

Microsoft Discovery uses a resource-based data model to manage all data exchanged between agents and tools. Every file, directory, or dataset produced during a conversation is a **resource** in your workspace that agents can inspect, describe, and share with you.

In this article, you learn how to manage data in Discovery conversations, control what outputs you see, and set up tools to work with your data.

> [!NOTE]
> This article applies to agents using API version **2026-02-01-preview**.

## Understand how resources work in a conversation

When you start a conversation with a Discovery agent, a workspace resource context is created for that conversation. The context tracks every resource that agents and tools produce using stable **resource URIs** in the format:

```
discovery://resources/{storage-container-name}/paths/{path}
```

For example: `discovery://resources/myproject-container/paths/simulation-outputs/run1/results`

Agents use these URIs to reference data between steps. You don't interact with raw storage paths; instead, the platform manages the mapping between resource URIs and the underlying storage.

By default, resources produced by tool executions are **not visible to you** in the Discovery interface. Agents must explicitly **share** a resource before it appears in your conversation response. This experience prevents intermediate computations from cluttering your results.

> [!IMPORTANT]
> Resource URIs that end with `/` are treated as directories. URIs that don't end with `/` are treated as files. This distinction matters when mounting resources into tool containers.

## Storage containers and storage assets

Discovery organizes resources into two concepts:

| Concept | Description |
|---|---|
| **Storage container** | A logical storage boundary linked to a project. Tools write outputs into storage containers. Each project has a default storage container, and tool authors can specify alternative containers for outputs. |
| **Storage asset** | A named, user-visible reference to a specific file or directory within a storage container. When an agent shares a resource, a storage asset is created and shown to you. |

Storage assets are what appear as results in Discovery Studio. Until a resource is promoted to a storage asset and shared, it exists only as intermediate working data.

## Built-in resource management tools

Discovery automatically provides five built-in tools to every agent for managing resources within a conversation. These tools are the primary mechanism for working with data produced by tool executions.

### GetResourceContext

Lists all resources in the current conversation. Returns each resource's URI, type (file or directory), visibility (shared or not), and description.

**When to use:** Calls this tool at the start of any workflow step to understand what data is available before taking action.

**Parameters:** None.

**Example output:**
```
discovery://resources/myproject/paths/simulation/run1/            [directory] [not shared]
discovery://resources/myproject/paths/simulation/run1/results/    [directory] [not shared]
discovery://resources/myproject/paths/writes/analysis.md          [file]      [shared] - Summary of run 1 results
```

### PreviewResource

Reads the contents of a resource. For files, returns the content. For directories, returns a listing of contents.

**When to use:** Inspect tool outputs before deciding whether to share them. Verify that a file contains the expected data before referencing it in downstream steps.

**Example:**
```json
{
  "uri": "discovery://resources/myproject/paths/simulation/run1/results/metrics.csv"
}
```

PreviewResource tool only supports text based content, for example, csv, yaml, json, or pure text.

### WriteResource

Creates a new file from agent-generated content and immediately shares it with you. Uses this tool when the agent produces a report, summary, or structured output directly, rather than through a compute tool.

**When to use:** The agent generates content itself (a markdown report, a CSV summary, a JSON configuration) and you want to see it immediately.

**Example:**
```json
{
  "fileName": "summary.md",
  "content": "# Simulation Summary\n\nRun 1 completed with RMSD of 2.3 Å...",
  "description": "Markdown summary of molecular simulation run 1"
}
```

> [!NOTE]
> `WriteResource` always creates a new file and immediately makes it visible.

### ShareResource

Makes an existing resource visible to you by promoting it to a storage asset. Uses this tool for outputs produced by compute tools that the agent verifies to be complete.

**When to use:** A compute tool wrote output to a directory (captured via output mounts). The agent inspects the outputs with `PreviewResource` and confirmed they're valid. The agent calls `ShareResource` to make them visible.

**Example:**
```json
{
  "uri": "discovery://resources/myproject/paths/simulation/run1/results/",
  "name": "SimulationRun1Results",
  "description": "Output files from molecular dynamics simulation run 1, including trajectory and metrics"
}
```

You can share a specific file within a directory by using the file's URI directly:

```json
{
  "uri": "discovery://resources/myproject/paths/simulation/run1/results/final_structure.pdb",
  "name": "FinalStructure",
  "description": "Final equilibrated protein structure after 100ns simulation"
}
```

> [!NOTE]
> If a resource is already shared, calling `ShareResource` again for the same URI has no effect. The tool returns a message confirming it's already visible.

### UpdateResourceDetails

Updates the description of a resource. Calls this tool after a scientific tool execution to document what was produced.

**When to use:** Set a meaningful description on tool outputs immediately after they're created, before sharing them. Good descriptions help you understand what each result contains.

**Example:**
```json
{
  "uri": "discovery://resources/myproject/paths/simulation/run1/results/",
  "description": "Molecular dynamics simulation outputs: 100ns NVT trajectory, energy logs, and final structure"
}
```

> [!IMPORTANT]
> Call `UpdateResourceDetails` **before** calling `ShareResource`. Descriptions set after sharing aren't reflected in the storage asset that was already created.

### Disabling built-in resource management tools

If you're building a specialized agent that manages its own resource handling—or one that shouldn't interact with the workspace filesystem at all, you can disable all five built-in tools by setting `disableDataHandlingTools: true` in the agent's `discovery_extensions` configuration:

```json
{
  "discovery_extensions": {
    "disableDataHandlingTools": true
  }
}
```

When disabled, the agent no longer has access to `GetResourceContext`, `PreviewResource`, `WriteResource`, `ShareResource`, or `UpdateResourceDetails`. All resource management is handled by custom tools or through agent instructions that rely on other mechanisms.

> [!NOTE]
> Use this setting only when your agent has an explicit alternative mechanism for producing user-visible outputs. Disabling these tools without a replacement means no storage assets are created and nothing is shared with you during the conversation.

## Share storage assets with users

Discovery supports three ways for agents to share storage assets with you. Each is suited to different situations.

### Approach 1: ShareResource after tool execution

Use this approach when a compute tool produces outputs that the agent needs to inspect before sharing.

**When to use:** You want the agent to verify outputs before surfacing them. This step includes checking file integrity, confirming expected columns exist, or validating numerical results.

**Typical workflow:**

1. Agent invokes a compute tool (for example, a molecular dynamics simulation tool)
2. Tool outputs are captured via output mounts
3. Agent calls `GetResourceContext` to discover the new resource URIs
4. Agent calls `PreviewResource` to inspect the outputs
5. Agent calls `UpdateResourceDetails` to set a meaningful description
6. Agent calls `ShareResource` to make the outputs visible

**Example conversation flow:**

The agent receives your request to run a protein folding simulation. After the simulation tool completes:

```
Agent → GetResourceContext
  Returns: discovery://resources/myproject/paths/folding/run1/ [not shared]

Agent → PreviewResource(uri="discovery://resources/myproject/paths/folding/run1/")
  Returns: energy.log, final.pdb, trajectory.dcd (3 files, sizes look reasonable)

Agent → UpdateResourceDetails(uri="discovery://resources/myproject/paths/folding/run1/",
  description="Protein folding simulation outputs: trajectory, final structure, and energy log")

Agent → ShareResource(uri="discovery://resources/myproject/paths/folding/run1/",
  name="FoldingRun1", description="...")
  → You see the results in the conversation
```

### Approach 2: WriteResource for agent-generated content

Use this approach when the agent itself produces textual content (example - a report, a structured summary, a configuration file, or annotated data) and you want to see it immediately without a separate sharing step.

**When to use:** The agent has analyzed results and produced a markdown report, a JSON summary, or a CSV comparison that it generates directly from its reasoning.

**Example:**

```
Agent → WriteResource(
  fileName="analysis-report.md",
  content="# Analysis Report\n\n## Key Findings\n...",
  description="Summary report of comparative analysis across three simulation runs")
  → File created and immediately visible to you
```

`WriteResource` is a single step: it writes the file and shares it simultaneously. There's no separate `ShareResource` call needed.

> [!NOTE]
> To make use of this function, ensure your agent definition or prompt says to write the results and that should in turn invoke this function.

### Approach 3: Auto-promotion via output mount configuration

Use this approach when a tool is expected to always produce a shareable output, for example, a validated analysis tool that reliably produces a final results directory.

**When to use:** You're defining a tool and its output should always be shared immediately after execution, without requiring the agent to call `ShareResource` explicitly.

Tool authors configure auto-promotion in the tool definition under `output_mount_configurations`:

```json
"output_mount_configurations": [
  {
    "mount_path": "/app/outputs",
    "auto_promote": true,
    "output_name": "SimulationResults",
    "output_description": "Validated simulation output files"
  }
]
```

When the tool finishes execution and the platform captures the `/app/outputs` directory, it automatically creates a storage asset and makes it visible, without the agent calling `ShareResource`.

> [!NOTE]
> If a tool output is configured with `auto_promote: true`, the agent should **not** call `ShareResource` for that output. The resource is already visible after tool execution completes.

## Provide data to tools using input mounts

Input mounts let you provide existing resources from the conversation as inputs to tool containers. When a tool runs, the platform places the resource content at the specified path inside the container.

Each input mount specifies:

| Field | Description |
|---|---|
| `uri` | The `discovery://` URI of the resource to mount (from `GetResourceContext`). Both files and directories are supported. |
| `mountPath` | The absolute path inside the container where the resource content is placed. |

**Example:**
```json
"inputMounts": [
  {
    "uri": "discovery://resources/myproject/paths/simulation/run1/results/",
    "mountPath": "/app/inputs/run1"
  }
]
```

After this mount, the tool container can read files from `/app/inputs/run1/`.

> [!IMPORTANT]
> Provide only absolute paths in `mountPath`. Relative paths aren't supported. If the URI points to a directory, the directory contents are placed at the mount path. If the URI points to a file, the file is placed at the mount path.
> If not specified explicitly, default value for input is /app/inputs and for output mounts, it's /app/outputs.

### Tell the agent which paths to use in tool descriptions

The agent has no inherent knowledge of the internal file system layout of a tool container. It doesn't know what directories exist inside the container or which paths your tool reads from. **You must document the expected mount paths in the tool's description or in the agent's instructions**, so the agent knows what value to use for `mountPath` when invoking the tool.

For example, if your tool reads input from `/app/inputs` and writes output to `/app/outputs`, include this in the tool's action description:

```yaml
actions:
  - name: run_simulation
    description: >
      Runs a molecular dynamics simulation. Before invoking, mount the input
      structure file to /app/inputs using an input mount. After invocation,
      output files are written to /app/outputs — specify /app/outputs as an
      output mount to capture results.
```

You can also guide the agent in your agent instructions. For example:

```
When invoking the simulation tool, always mount the user's input structure file
to /app/inputs on the tool container. Capture outputs from /app/outputs.
Use GetResourceContext to find the correct resource URI before calling the tool.
```

> [!NOTE]
> Until Discovery supports explicit tool input/output configuration in the agent definition, describing expected mount paths clearly in tool, and agent descriptions is the primary way to ensure the agent passes the correct paths consistently.

### What input mounts look like in agent logs

When an agent invokes a tool with input mounts, the tool call appears in the agent logs with the full mount specification. This is how a typical tool invocation looks like when inspecting logs:

```json
{
  "input_directory": "/app/inputs",
  "output_directory": "/app/outputs",
  "nodePool: "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso-rg/providers/Microsoft.Discovery/supercomputers/contoso-sc/nodepools/nodepool1",
  "inputMounts": [
    {
      "uri": "discovery://resources/myproject/paths/structures/input.pdb",
      "mountPath": "/app/inputs/input.pdb"
    }
  ],
  "outputMounts": ["/app/outputs"]
}
```

**Common issues:**

| Problem | Cause | Resolution |
|---|---|---|
| Tool can't find input file | URI point to a directory but the tool expects a file at `mountPath` | Use the specific file URI rather than the parent directory URI |
| URI not found | Resource doesn't exist in the current conversation | Call `GetResourceContext` to confirm the URI exists before invoking the tool |
| Content not at expected path | Relative path used in `mountPath` | Use absolute paths only (for example, `/app/inputs`) |
| Agent uses wrong `mountPath` | Tool description doesn't document expected container paths | Add explicit path guidance to the tool action description and agent instructions |

## Capture tool outputs using output mounts

Output mounts tell the platform which directories in the tool container should be captured back into the resource context after the tool finishes. You specify these mount paths as an array of absolute directory paths.

```json
"outputMounts": ["/app/outputs", "/app/results"]
```

After the tool runs, the platform captures these directories and adds them to the resource context with `discovery://` URIs. The agent then calls `GetResourceContext` to discover the new URIs and can share them as needed.

> [!IMPORTANT]
> Specify only directory paths in `outputMounts`. File paths aren't supported.

You can optionally specify which storage container should receive the outputs:

```json
"outputStorageContainerName": "myproject-results"
```

If you omit `outputStorageContainerName`, outputs go to the project's default storage container.

### What output mounts look like in agent logs

After a tool completes, the platform reports the captured output directories and the `discovery://` URIs assigned to them. This is what you see in agent logs after a successful tool run:

```
Tool execution completed.

Captured output mounts:
  /app/outputs  →  discovery://resources/myproject/paths/simulation/run1/outputs/
  /app/results  →  discovery://resources/myproject/paths/simulation/run1/results/

Resources added to conversation context: 2
```

The agent then calls `GetResourceContext` to see these new URIs before deciding what to share.

## Handle failures and maintain data integrity

To design agents that handle failures reliably:

- **Validate inputs before execution.** Use `GetResourceContext` and `PreviewResource` to confirm that required resources exist and contain expected data before invoking a compute tool.
- **Save incremental progress.** After each successful tool execution, use `UpdateResourceDetails` to document what was produced. This makes it easy to identify which steps were completed if a later step fails.
- **Do not use `WriteResource` to compensate for tool failures.** If a compute tool was expected to produce output but failed, don't have the agent generate placeholder content and write it with `WriteResource`. This unblocks downstream steps that depend on valid compute output, leading to incorrect results.

## Troubleshooting

### Understanding normal agent behavior in logs

When reviewing agent logs in depth, you may notice the agent calling tools with incorrect parameters, for example, trying to call `PreviewResource` on a URI that doesn't exist yet, or calling `GetResourceContext` multiple times in a row. **This is normal.** The agent reasons iteratively: it tries an action, reads the result, and adjusts its next step based on what it learned.

Common patterns you see in logs that aren't errors:

| What you see in logs | What it means |
|---|---|
| `PreviewResource` called on a URI, returns "resource not found" | The agent attempted to inspect an output before the tool had finished writing it, or used the wrong URI. It reads the error and retries with the correct URI from `GetResourceContext`. |
| `GetResourceContext` called multiple times | The agent is rechecking the resource list after each tool run to pick up newly created URIs. Expected behavior. |
| `ShareResource` called, returns "already shared" | The agent attempted to share something that was already visible. The tool returns a success confirmation and the agent continues. |
| `UpdateResourceDetails` called after `ShareResource` | The description update applies to the resource but isn't retroactively reflected in the already-created storage asset. The agent may not realize this until it reads the docs or observes the behavior. |

> [!NOTE]
> If you see the agent make a mistake and self-correct in the logs, there's no need to intervene. The agent is designed to recover from tool errors by re-reading the response and adjusting its approach. Only intervene if the agent appears stuck in a loop making the same failing call repeatedly without progress.

### Resource doesn't appear in your conversation

If a resource doesn't appear in your conversation, use the following steps:

1. Call `GetResourceContext` to confirm the resource URI exists in the conversation context
2. Check whether the resource shows as **not shared**, this means the agent hasn't called `ShareResource` yet
3. Call `PreviewResource` on the URI to confirm it contains content
4. Verify that `UpdateResourceDetails` was called before `ShareResource` if the description is missing
5. If the resource still isn't visible, navigate to `discoveryOutputs/{projectName}/{investigationName}/{conversationGuid}/` in Azure Storage Explorer to confirm the file was written to blob storage at all

### Tool outputs not appearing in GetResourceContext

- Confirm that the tool's output directory was specified in `outputMounts`
- Verify the tool ran successfully by checking conversation history for error messages
- Confirm the `outputMounts` path is an absolute directory path (not a file path)

## Related content

- [Microsoft Discovery agents](concept-discovery-agent.md)
- [Agent types in Microsoft Discovery](concept-discovery-agent-types.md)
- [Bookshelf and knowledge bases](concept-bookshelf-knowledge-bases.md)
- [Storage assets and storage containers in Microsoft Discovery](concept-storage-account.md)
