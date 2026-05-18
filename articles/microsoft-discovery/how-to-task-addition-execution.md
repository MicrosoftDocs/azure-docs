---
title: Task addition and execution in Microsoft Discovery
description: Learn how to add tasks to an investigation, manage task relationships, monitor execution progress, and handle results in the Discovery Engine.
author: hectoralinares
ms.author: hectorl
ms.service: azure
ms.topic: how-to
ms.date: 03/30/2026

#CustomerIntent: As a researcher or scientist, I want to know how to create and manage tasks so that I can effectively guide the Discovery Engine through my research.
---

# Task addition and execution

This guide covers the practical steps for creating tasks, setting up relationships between them, monitoring execution, and managing results in the [Discovery Engine](concept-discovery-engine.md). For conceptual background on task structure and statuses, see [Tasks and investigations](concept-tasks-investigations.md).

## Adding a task

### Using Discovery Studio

1. Open your investigation in Discovery Studio.
2. Select **Add Task**.
3. Fill in the required fields:
   - **Title**: A short, specific name.
   - **Description**: Detailed context for the executing agent.
   - **Validation requirements**: At least one criterion for evaluating the result.
4. Optionally set:
   - **Priority**: High, Medium, or Low.
   - **Depends on**: Select tasks that must complete first.
   - **Parent**: Select the parent task that is part of a larger objective.
5. Select **Save**.

The task appears in your investigation with a status of New. If Discovery Mode is enabled, cognition picks up the task on its next reasoning cycle.

### Adding tasks while cognition is running

You can add tasks to an active investigation at any time. Cognition detects new tasks on its next cycle and evaluates whether they're ready to execute based on their dependencies.

Keep in mind:

- If the new task has no dependencies, cognition might start it immediately.
- If the new task depends on tasks that are already complete, cognition starts it on the next cycle.
- If the new task depends on tasks that are still in progress, cognition waits.

> [!TIP]
> If you're adding several related tasks with dependencies between them, add all the tasks first, then set the dependencies. Setting up dependencies prevents cognition from starting a task before defining its relationships.

## Setting up task relationships

### Dependencies

Dependencies control execution order. A task with a dependency waits until the dependency reaches a terminal status (Complete, Needs User Attention, Failed, or Removed).

To add a dependency:

1. Open the task you want to add a dependency to.
2. In the **Depends on** field, select the tasks this task needs to wait for.
3. Save the task.

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
2. In the **Parent** field, select the parent task.
3. Save.

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

When a task reaches Complete status, its result is available in the task detail view. Results typically include:

- **Text output** from the agent (analysis, summaries, recommendations)
- **File outputs** (storage assets) created during execution, such as reports, datasets, or configuration files
- **Structured data** (tables, sequences, computed properties)

File outputs appear as `storageAssetIds` on the task result. You can download these files from Discovery Studio or access them through the API. For details on how agents create and work with files, see [Files and storage assets](concept-files-storage-assets.md).

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

However, file outputs don't transfer between tasks automatically. Task B's agent cannot read files that Task A produced. To share file-based findings across tasks, make sure agents include key content in the task result text, not just as files. This gives downstream agents access to the information through the dependency context.

To make this work well:

- Write Task B's description to reference what it should expect from Task A. For example: "Using the protein sequences from the previous analysis, compute molecular properties."
- Set explicit dependencies so cognition knows which tasks provide input.
- When creating Task A, include instructions to put important findings in the response text in addition to any files it creates.

### Handling unsatisfactory results

If a completed task's result doesn't meet your expectations, even though it passed validation:

1. **Adjust the validation requirements** to be more specific about what was missing.
2. **Add a comment** explaining what needs to change.
3. **Change the status** back to New. Cognition retries the task with your updated requirements and comments as more context.

Alternatively, create a new follow-up task that builds on the existing result rather than replacing it.

## Adding tasks created by cognition

When cognition decomposes a broad objective, it creates child tasks automatically. These tasks appear in your investigation alongside the ones you created.

You can:

- **Review and edit** child tasks that cognition created. Adjust descriptions or validation requirements if they don't match your expectations.
- **Remove** child tasks that aren't relevant by setting their status to Removed.
- **Add dependencies** between cognition-created tasks and your own tasks.
- **Add comments** to guide cognition's approach for specific child tasks.

Cognition-created tasks aren't special. They work exactly like tasks you create manually.

## Manually completing tasks

To complete a task, yourself rather than having an agent do it:

1. Open the task.
2. Add your result in the **Result** field.
3. Change the status to **Complete**.

Cognition sees your result and makes it available to any dependent tasks. Useful when you have domain expertise for a specific step, or when you want to provide ground truth data that agents can build on.

## Related content

- [Tasks and investigations](concept-tasks-investigations.md)
- [Files and storage assets](concept-files-storage-assets.md)
- [Build investigations with cognition](how-to-build-investigations-cognition.md)
- [Advanced investigation patterns](concept-advanced-investigation-patterns.md)
- [Debug task execution](how-to-debug-task-execution.md)
