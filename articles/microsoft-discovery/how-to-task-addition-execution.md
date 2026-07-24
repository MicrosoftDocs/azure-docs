---
title: Task addition and execution in Microsoft Discovery
description: Learn how to add tasks to a shared session, manage task relationships, monitor execution progress, and handle results in the Discovery Engine.
author: hectoralinares
ms.author: hectorl
ms.service: azure
ms.topic: how-to
ms.date: 05/29/2026

#CustomerIntent: As a researcher or scientist, I want to know how to create and manage tasks so that I can effectively guide the Discovery Engine through my research.
---

# Task addition and execution

This guide covers the practical steps for creating tasks, setting up relationships between them, monitoring execution, and managing results in the [Discovery Engine](concept-discovery-engine.md). For conceptual background on task structure and statuses, see [Tasks and shared sessions](concept-tasks-investigations.md).

## Adding a task

### Using Discovery Studio

1. Open your shared session in Discovery Studio.
2. Select **New task**.
3. Fill in the required fields:
   - **Title**: A short, specific name.
   - **Shared session**: The shared session the task belongs to.
   - **Description**: Detailed context for the executing agent.
   - **Validation requirements**: At least one criterion for evaluating the result.
4. Optionally set:
   - **Priority**: High, Medium, or Low.
   - **Dependent tasks**: Select tasks that must complete first.
5. Select **Submit**.

The task appears in your shared session with a status of New.

### Adding tasks while cognition is running

We recommend that you stop the Discovery Engine before adding tasks to a shared session. After you start the Discovery Engine again, cognition detects new tasks on its next cycle and evaluates whether they're ready to execute based on their dependencies.

Keep in mind:

- If the new task depends on tasks that are still in progress, cognition waits for the dependent task to complete.
- If you're adding several related tasks with dependencies between them, add all the tasks first, then set the dependencies. Setting up dependencies last prevents cognition from starting a task before its relationships are defined.

## Setting up task relationships

### Dependencies

Dependencies control execution order. A task with a dependency waits until the dependency reaches a terminal status (Complete, Needs User Attention, Failed, or Removed).

To add a dependency:

1. Open the task you want to add a dependency to.
2. Select the **Linked tasks** tab.
3. In the **Add dependent task** field, select the tasks this task needs to wait for.
4. Select **OK**.

**Common dependency patterns:**

Sequential chain:
```
Task A → Task B → Task C
```
Each task waits for the previous one to finish.

Fan-out (parallel):
```
Task A → Task B
Task A → Task C
```
Tasks B and C both wait for A, then run in parallel.

Fan-in (merge):
```
Task B → Task D
Task C → Task D
```
Task D waits for both B and C to finish before starting.

Diamond (combine fan-out and fan-in):
```
Task A → Task B → Task D
Task A → Task C → Task D
```
A runs first, then B and C in parallel, then D after both complete.

### Parent-child relationships

Parent-child relationships organize tasks into a hierarchy. They don't control execution order on their own. Use dependencies alongside parent-child relationships when you need both structure and sequencing.

To set a parent:

1. Open the child task.
2. Select **Edit**.
3. In the **Parent task** dropdown, select the parent task.
4. Save.

When all child tasks of a parent reach terminal status, cognition can execute the parent task to synthesize the child results into a combined output.

> [!NOTE]
> Setting a parent doesn't automatically create a dependency. If you want the parent task to wait for all children, set explicit dependencies from the parent to each child task.

## Monitoring task execution

### Task statuses

As cognition works, tasks move through statuses. The key statuses to watch for are:

| Status | What's happening |
|--------|-----------------|
| **New** | Waiting to start (dependencies might not be met yet) |
| **Executing** | An agent is actively working on this task |
| **Validating** | Agent finished; cognition is evaluating the result |
| **Complete** | Result passed validation |
| **Incomplete** | Result didn't meet validation requirements; cognition might retry |
| **Needs User Attention** | Cognition couldn't resolve this task after multiple attempts |

For the full status reference, see [Task status lifecycle](concept-tasks-investigations.md#task-status-lifecycle).

### Execution history

Each task maintains a record of every execution attempt. The execution history shows:

- Which agent cognition assigned
- When execution started and how long it took
- Whether tools were called and what they returned
- The validation outcome and any comments

To view execution history, open a task and look at the **Execution History** section.

### Validation comments

After each execution attempt, the validation process adds comments to the task explaining whether each validation requirement was met. These comments help you understand:

- What passed and what failed
- Why a task was marked Incomplete
- What cognition tried differently on subsequent attempts

## Managing task results

### Reviewing results

When a task reaches Complete status, its result is available in the task updates. Results typically include:

- **Text output** from the agent (analysis, summaries, recommendations)
- **File outputs** (storage assets) created during execution, such as reports, datasets, or configuration files
- **Structured data** (tables, sequences, computed properties)

File outputs appear in the **Artifacts** tab on the task. You can download these files from Discovery Studio or access them through the API. For details on how agents create and work with files, see [Files and storage assets](concept-files-storage-assets.md).

### Designing tasks that produce file outputs

To get an agent to produce files, describe what you want in the task description. Be specific about the file name, format, and expected content:

- "Create a file called findings.csv with columns for compound name, molecular weight, and solubility"
- "Write a markdown report summarizing the analysis results with an introduction, methodology, and conclusion"
- "Generate a JSON configuration file with parameters for temperature, pressure, and concentration"

When writing validation requirements for file outputs, describe what the file should contain rather than how to check it:

- "Read the CSV file and verify it contains at least 10 rows of compound data"
- "Verify the report includes a conclusion section that references the experimental results"
- "Confirm the JSON file contains a valid temperature value between 200 and 400 Kelvin"

> [!NOTE]
> Agents can create and read text-based files (.md, .csv, .json, .txt, .py, .yaml). Binary formats like .docx or .pdf require custom tools. For supported formats and limitations, see [Files and storage assets](concept-files-storage-assets.md).

### Using results in dependent tasks

When Task B depends on Task A, the agent executing Task B receives Task A's result text as context. Cognition builds this dependency context automatically. You don't need to manually pass text data between tasks.

File outputs (storage assets) also flow across dependencies. When Task A finishes, the storage assets it produced are inherited by every downstream task that depends on Task A — directly or transitively. Task B's agent can list inherited files with `GetResourceContext` and read them with `PreviewResource`, the same tools it uses for its own workspace files. Each inheritance event is captured in Task B's execution history under `inheritedStorageAssets`, with a breakdown of which file came from which upstream task.

#### Two inheritance paths

| Wiring | What Task B inherits |
|---|---|
| Task B `dependsOn` Task A | The storage assets Task A produced, plus any assets attached to Task A's own inputs. Inheritance is transitive: if A → B → C, then C sees A's and B's outputs through its direct dependency on B. |
| Task B is a subtask of (parented to) Task A | The storage assets attached as inputs to Task A — for example, files the user uploaded to a root task before decomposition. |

#### What doesn't propagate automatically

- Files don't flow between sibling tasks that have no dependency edge between them. If two tasks need to share outputs, declare the dependency explicitly.
- Files don't cross shared session boundaries. Each shared session is its own scope.
- Inherited files are made available to the downstream agent, but the agent still has to call `GetResourceContext` or `PreviewResource` to read them — file contents aren't auto-injected into the prompt.

#### To make this work well

- Set explicit `dependsOn` edges when one task needs another's file outputs.
- Write Task B's description to reference what it should expect from Task A. For example: "Using the protein sequences produced by the previous analysis, compute molecular properties."
- Include key findings in the task's result text (not only in files). This gives downstream agents an at-a-glance summary without opening every file, and it keeps the dependency context useful even for agents that don't open inherited files.

### Handling unsatisfactory results

If a completed task's result doesn't meet your expectations and the task is flagged for user attention:

1. **Adjust the validation requirements** to be more specific about what was missing.
2. **Add a note** explaining what needs to change.

## Tasks created by cognition

When cognition decomposes a broad objective, it creates child tasks automatically. These tasks appear in your shared session alongside the ones you created. Cognition adds tasks with description, validation requirements, and dependencies as needed. Cognition-created tasks are the same as tasks created manually.

## Related content

- [Tasks and shared sessions](concept-tasks-investigations.md)
- [Files and storage assets](concept-files-storage-assets.md)
- [Build shared sessions with cognition](how-to-build-investigations-cognition.md)
- [Advanced shared session patterns](concept-advanced-investigation-patterns.md)
- [Debug task execution](how-to-debug-task-execution.md)
