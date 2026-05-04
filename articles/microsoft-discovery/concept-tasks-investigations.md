---
title: Tasks and investigations in Microsoft Discovery
description: Learn how tasks work in Microsoft Discovery. Understand task structure, the status lifecycle, dependencies, and how cognition uses tasks to organize and execute research.
author: hectoralinares
ms.author: hectorl
ms.service: azure
ms.topic: concept-article
ms.date: 03/30/2026

#CustomerIntent: As a researcher or scientist, I want to understand how to structure tasks so that the Discovery Engine can execute my research effectively.
---

# Tasks and investigations

Tasks are how you define the work you want the [Discovery Engine](concept-discovery-engine.md) to carry out. Each task represents a discrete piece of work with a clear objective and success criteria. When [cognition](concept-cognition-overview.md) is enabled, it reads your tasks, understands their relationships, and orchestrates execution across agents and tools.

Tasks serve two purposes. First, they organize your work into manageable pieces, whether you created those pieces yourself or cognition decomposed them from a broader objective. Second, they provide an asynchronous interface to work with the engine. You define what needs to happen, check back later to review results, and adjust direction based on what you find.

## Structure of a task

A task captures everything needed to understand, execute, and evaluate a piece of work. Here are the fields and what they're for:

| Field | Purpose |
|-------|---------|
| **Title** | A concise name that summarizes what the task is intended to accomplish. Keep it short but specific. |
| **Description** | A detailed explanation of what needs to be done. Include context, objectives, and any constraints. The agent executing this task relies on the description to understand what you're asking for. |
| **Validation requirements** | Specific criteria that define what a successful result looks like. Cognition uses these criteria to evaluate whether a completed task actually meets your expectations. |
| **Priority** | The relative importance of this task compared to others. Cognition considers priority when deciding what to work on next. |
| **Status** | The current state of the task in its lifecycle. See [Task status lifecycle](#task-status-lifecycle). |
| **Dependencies (depends on)** | Other tasks that must complete before this task can start. Cognition respects these dependencies when sequencing work. |
| **Parent** | The higher-level task that this task is a subtask of. Use parent-child relationships to build task hierarchies. |
| **Related to** | Tasks that share context or objectives but aren't direct dependencies. Useful for cognition to understand the broader landscape. |
| **Assigned to** | The agent currently assigned to this task. Cognition selects agents automatically based on its assessment of agent capabilities and task requirements. To influence which agent cognition selects, add a comment to the task specifying the agent and the reason. |
| **Comments** | Notes, observations, and feedback from you, from agents, and from the validation process. Comments accumulate over the task's lifetime and provide a running record of decisions and context. |
| **Execution history** | A chronological record of all execution attempts, including which agent ran, when it started, and what happened. |
| **Result** | The output produced when the task completes. The result can be text, data references, or a combination. Results from completed tasks become available to dependent tasks. |
| **Data assets** | References to files, datasets, or other resources that are inputs to or outputs from this task. |

### What you need to get started

Every task should have at minimum:

- **A title** that clearly names the objective.
- **A description** that provides enough detail for an agent to understand and execute the work.
- **At least one validation requirement** that tells cognition how to judge whether the result is good enough.

The title and description tell cognition *what* to do. The validation requirements tell it *when the work meets your standard*. Without validation requirements, cognition can still execute the task, but it has no objective basis for evaluating quality. Missing requirements can lead to results that look complete on the surface but miss important details.

Dependencies, parent relationships, and priority are optional but become important as your investigation grows. They give cognition the information it needs to sequence work correctly and focus effort where it matters most.

## Task status lifecycle

Every task moves through a series of statuses as it progresses from creation to completion. Understanding these statuses helps you interpret what's happening in your investigation and when to intervene.

### Active statuses

These statuses indicate work that is in progress or waiting to begin:

| Status | What it means | What you should do |
|--------|--------------|-------------------|
| **New** | The task is created but cognition isn't working on it yet. It might be waiting for dependencies to complete, or cognition might not have reached it in its planning cycle yet. | If it stays New for a long time, check whether its dependencies are stuck or whether Discovery Mode is enabled. |
| **Executing** | An agent is actively working on this task. Tool calls might be running on the supercomputer. The system sets this status automatically. | No action needed unless it stays in this state for an unusually long time (more than 10-15 minutes for tasks that don't involve heavy computation). |
| **Validating** (`ExecutionDone`) | The agent finished its work and produced a result, but validation isn't yet complete. Cognition is evaluating the result against your validation requirements. The system sets this status automatically. | Normally you don't need to act on this status. Cognition moves tasks out of this state quickly. If a task stays here, Discovery Mode might be stopped or might have encountered an issue. |
| **Incomplete** | The task was executed but the result didn't meet the validation requirements. Cognition might retry with the same or a different agent, or it might update the task before trying again. | Review the validation comments to understand what was missing. You can add comments with more guidance or adjust the validation requirements if they were too restrictive. |
| **On Hold** (`OnHold`) | The task is temporarily paused. The system sets this status automatically. | Resume by changing the status back to New when you're ready for cognition to pick it up. |

### Terminal statuses

These statuses indicate work that's complete. Cognition treats tasks in terminal statuses as finished.

| Status | What it means | What you should do |
|--------|--------------|-------------------|
| **Complete** | The task was executed and the result passed validation. The work meets the criteria you defined in the validation requirements. | Review the result. If it doesn't meet your expectations despite passing validation, adjust the validation requirements and create a follow-up task. |
| **Needs User Attention** (`FlaggedHuman`) | Cognition tried multiple approaches and couldn't produce a result that passes validation, or the validation process determined that human judgment is needed. | Review the execution history and validation comments. Decide whether to provide more guidance, modify the task, or accept the current result. |
| **Failed** | The task encountered errors that prevented execution from completing. A failed status usually indicates a technical problem rather than a quality issue. | Check the execution history for error details. Common causes include agent configuration issues, tool failures, or missing dependencies. |
| **Removed** | The task was intentionally removed from the investigation. Use this status for tasks that are no longer relevant. | No action needed. Cognition ignores Removed tasks. |

### Status transitions

The typical path through statuses is:

```
New  >  Executing  >  Validating  >  Complete
```

When validation fails:

```
New  >  Executing  >  Validating  >  Incomplete  >  Executing  >  ...
```

When cognition gives up:

```
...  >  Incomplete  >  Needs User Attention
```

> [!IMPORTANT]
> If you change a task's status while cognition is running, cognition sees the change on its next cycle and adjusts accordingly. For example, changing a task from New to Removed prevents cognition from starting it. Changing a task from Incomplete back to New causes cognition to retry it.

> [!TIP]
> If you plan to make several manual status changes at once, consider pausing cognition (disabling Discovery Mode) first. Make your changes, then re-enable. Pausing first prevents cognition from reacting to partial changes.

## Task relationships

Tasks don't exist in isolation. The relationships between tasks give cognition the context it needs to plan and sequence work.

### Dependencies (depends on)

A dependency means "don't start this task until the dependency reached completed state." Cognition checks dependencies before assigning an agent.

Use dependencies when:
- Task B needs the result from Task A as input
- Task B doesn't make sense without Task A's output
- You want to enforce a specific execution order

Example: "Compute molecular properties" depends on "Generate candidate molecules." The property computation needs the molecules to exist first.

### Parent-child relationships

A parent-child relationship means "this task is part of that larger task." Parent tasks represent high-level objectives. Child tasks (also referred to as subtasks) are the specific pieces of work that contribute to the parent.

Use parent-child relationships when:
- You want to decompose a broad objective into specific steps
- You want to track progress at different levels of detail
- The parent task's result should synthesize the children's results

When cognition encounters a parent task whose children are all complete, it can execute the parent to produce a summary that aggregates the child results.

### Combining dependencies and parent-child

Dependencies and parent-child relationships serve different purposes and can be used together:

- **Parent-child** expresses "is part of"
- **Dependencies** express "must happen before"

A common pattern is a parent task with several children where some children depend on others:

```
Parent: "Analyze target molecule"
  Child 1: "Retrieve molecular structure"         (no dependencies)
  Child 2: "Compute binding properties"            (depends on Child 1)
  Child 3: "Predict solubility"                    (depends on Child 1)
  Child 4: "Rank candidates by combined criteria"  (depends on Children 2 and 3)
```

In this structure, cognition starts Child 1, then runs Children 2 and 3 in parallel (since both depend only on Child 1), and finally runs Child 4 after both 2 and 3 complete.

## Writing effective tasks

### Titles

Good titles are specific enough to distinguish the task from others but short enough to scan at a glance.

| Less effective | More effective |
|---------------|---------------|
| "Analysis" | "Compute RDKit properties for candidate molecules" |
| "Research" | "Identify existing drugs for [disease] and their activation pathways" |
| "Step 2" | "Predict solubility using Graphormer for top five candidates" |

### Descriptions

The description is what the executing agent reads to understand its job. Include:

- **The objective**: What specific output do you want?
- **Context**: Why does this matter? What should the agent know about the broader investigation?
- **Constraints**: Are there specific methods, databases, or parameters to use?
- **Input references**: If this task depends on another, mention what data to expect from the dependency.

### Validation requirements

Validation requirements are the criteria cognition uses to evaluate whether a task's result is acceptable. Write them as clear, verifiable statements.

| Less effective | More effective |
|---------------|---------------|
| "Good results" | "Results include binding affinity scores for all five candidate molecules" |
| "Complete analysis" | "Analysis covers at least three properties: solubility, molecular weight, and synthetic accessibility score" |
| "Accurate" | "Predicted values include confidence intervals or error estimates" |

Each task should have at least one validation requirement. For complex tasks, provide several requirements that cover different aspects of quality. Cognition evaluates each requirement independently, so partial failures are visible in the validation comments.

For guidance on balancing validation strictness, see [Trust relationship and basic investigation patterns](concept-trust-basic-investigation-patterns.md).

## Related content

- [Discovery Engine](concept-discovery-engine.md)
- [Cognition overview](concept-cognition-overview.md)
- [Trust relationship and basic investigation patterns](concept-trust-basic-investigation-patterns.md)
- [Task addition and execution](how-to-task-addition-execution.md)
