---
title: Cognition overview in Microsoft Discovery
description: Learn how cognition works in Microsoft Discovery. Understand the reasoning loop, task management, agent selection, and how to interact with the autonomous research process.
author: hectoralinares
ms.author: hectorl
ms.service: azure
ms.topic: concept-article
ms.date: 03/30/2026

#CustomerIntent: As a researcher or scientist, I want to understand how cognition works so that I can effectively collaborate with it on long-running research.
---

# Cognition overview

Cognition is the goal-seeking reasoning process that powers investigations in Microsoft Discovery. Rather than executing a fixed sequence of steps, it continuously assesses the current state of your investigation, decides what to do next, and adapts as results come in. When you enable Discovery Mode, cognition starts running in the background. It reads your tasks, selects agents, executes work, validates results, and creates new tasks when it identifies gaps.

Cognition continues the cycle until your objectives are met or it encounters something that requires your input.

Unlike a chat-based assistant that waits for your next message, cognition operates on its own. It picks up work, handles errors, retries when tools fail, and creates new tasks when it identifies gaps. You interact with it by reviewing progress, adding comments, and adjusting tasks.

## The reasoning loop

Cognition runs in a continuous loop with two modules working in tandem: a **thinking module** and an **acting module**. Together, these modules carry out the collaboration cycle described in the [Discovery Engine overview](concept-discovery-engine.md). The thinking module decides what to do next, and the acting module executes that decision.

### Thinking module

The thinking module decides *what to do next*. On each cycle, it:

1. Assesses the current state of all tasks (which are new, executing, complete, or waiting on dependencies)
1. Considers what it already knows from prior task results and your feedback
1. Decides whether to act now or wait for running tasks to complete
1. Formulates a plan for the next action

The thinking module can operate in two modes. **Fast thinking** makes quick decisions when the next step is clear, such as starting a task whose dependencies completed. **Slow thinking** takes more time to reason through ambiguous situations, such as deciding which of several possible approaches to try first or how to interpret an unexpected result.

When cognition first starts, you might notice a warmup period where the thinking module runs several reasoning cycles before taking its first action. This behavior is normal. Cognition is building context by reviewing all existing tasks, understanding their relationships, and planning its approach before it begins execution.

### Acting module

The acting module carries out the decisions made by the thinking module. It interacts with the task management system to:

- List available tasks and check their status
- Assign agents to tasks and start execution
- Retrieve task results after execution completes
- Validate completed tasks against your validation requirements
- Create new subtasks when the work calls for further decomposition
- Flag tasks for your review when it can't make progress

The acting module also manages agent selection. Given a task's description and requirements, it picks the agent whose capabilities are the best fit from the agents available in your project.

## How cognition manages tasks

### Task lifecycle

When cognition encounters a new task, it follows a consistent pattern:

1. **Assess readiness**: Check if all dependencies are satisfied. If a task depends on another task that is not yet complete, cognition waits.
1. **Select agent**: Review the available agents and pick the one whose capabilities match the task requirements.
1. **Start execution**: Hand the task to the selected agent. The task status changes to Executing.
1. **Monitor progress**: Wait for the agent to complete its work. If the agent uses tools that run on the supercomputer, execution can take minutes.
1. **Review result**: Once execution finishes, the task moves to the Validating state.
1. **Validate**: Compare the result against the task's validation requirements. Validation can pass (the task moves to Complete) or fail (the task might be retried or flagged).

### How validation works with files

When a completed task includes file outputs (storage assets), the validation agent can read those files and verify their content against your validation requirements. For example, if a task produced a CSV dataset, validation can open the file and confirm it contains the expected columns and row count.

Write validation requirements that describe what the file should contain in plain language:

- "Read the output file and verify it includes a methodology section"
- "Verify the CSV contains at least five rows of compound data with molecular weights"
- "Confirm the JSON output contains a valid configuration with a project name"

Validation works with text-based files (.md, .csv, .json, .txt, .py, .yaml). For binary files produced by custom tools, validation can confirm the file exists but can't read its content. In those cases, write validation requirements that focus on what the agent reported in the task result text.

For more details on supported file types and how agents interact with files, see [Files and storage assets](concept-files-storage-assets.md).

### Handling failures

Not everything succeeds on the first try. Cognition handles failures at multiple levels:

**Tool failures**: If a tool returns an error or times out, the agent typically retries the operation. Common causes include temporary network issues or container cold starts on the supercomputer.

**Agent execution failures**: If the agent produces a result that doesn't meet validation requirements, cognition retries. It might use the same agent, try a different agent, or update the task with more context before retrying.

**Repeated failures**: If a task fails after multiple attempts (typically 2-3 retries), cognition flags the task for your review rather than continuing to retry indefinitely. The task status changes to Needs User Attention, which signals that the situation needs human judgment.

**Infrastructure errors**: Gateway timeouts, authentication failures, and similar system-level errors trigger automatic retries with backoff. If these persist, cognition flags the task.

## How cognition validates results

When an agent completes a task, cognition doesn't accept the result automatically. Instead, it runs a separate validation step that evaluates the result against the validation requirements you defined for the task.

An independent process validates the result, not the agent that produced it. The agent that did the work never grades its own output. This separation ensures that validation requirements are evaluated objectively.

> [!IMPORTANT]
> Validation requires a chat model deployment named `gpt-5-2` (model: `gpt-5.2`) in your workspace. Without this deployment, the Discovery Engine cannot start. See [Create Chat Model Deployment](quickstart-infrastructure-portal.md#6-create-chat-model-deployment) for setup instructions.

During validation, the process:

1. **Reads the task result** - the text output the agent produced.
1. **Checks each validation requirement**: evaluates whether the result addresses what you asked for.
1. **Inspects file outputs** - if the task produced files (storage assets), validation can read text-based files and verify their content against your requirements.
1. **Reviews execution history** - considers prior attempts, comments, and any context from earlier cycles.
1. **Considers agent capabilities** - understands what the available agents can and can't do, which informs whether a retry is likely to succeed.

Validation produces one of four outcomes:

| Outcome | What it means | What happens next |
|---------|--------------|-------------------|
| **Complete** | The result meets all validation requirements. | The task moves to Complete status. Cognition moves on to dependent tasks. |
| **Incomplete** | The result partially meets requirements, but fixable gaps remain. | Cognition retries the task, potentially with the same agent or a different one. |
| **Needs User Attention** | No available agent can resolve the gaps. | The task is flagged for your review. Cognition moves on to other work. |
| **Failed** | The task execution failed and can't be recovered. | Terminal state. No further retries. |

The validation step adds a comment to the task explaining its decision. The comment covers what was evaluated, what passed, what was missing, and why it chose the outcome. You can see these comments in the task's execution history.

### Retry loop protection

If an agent produces the same incomplete result multiple times, validation detects the pattern. After three or more attempts with the same unresolved gaps, validation escalates to Needs User Attention rather than requesting another retry. This escalation prevents investigations from getting stuck in infinite retry loops where the agent fundamentally can't satisfy the requirements.

Common reasons for escalation include:

- The task requires capabilities that no available agent has (for example, live web access for citation verification).
- Persistent infrastructure errors that the agent can't resolve (gateway timeouts, authentication failures).
- Validation requirements that are more precise than the agent can reliably deliver.

When a task is flagged for your attention, review the validation comments to understand what was tried and what's missing. You can then provide the missing information, adjust the validation requirements, or add a comment directing cognition to use a specific agent on the next attempt.

> [!TIP]
> The quality of validation depends directly on the quality of your validation requirements. Vague requirements lead to lenient validation. Overly specific requirements lead to excessive retries. For guidance on writing effective validation requirements, see [Trust relationship and basic investigation patterns](concept-trust-basic-investigation-patterns.md).

### Task completion and the Complete function

Cognition distinguishes between completing individual tasks and completing an entire investigation. These operations are separate:

**Completing a task**: After successful validation, a task's status changes to Complete. Its result becomes available to any tasks that depend on it.

**Completing the investigation**: When all tasks reach a terminal state and cognition determines there's no remaining work, it calls a Complete function that ends the research session. Before ending the session, cognition verifies:

- All tasks are in a terminal state (Complete, Removed, Failed, or Needs User Attention)
- No tasks remain in an active state (New, Incomplete, Executing, Validating, or On Hold)
- The original root task is in completed state and its result synthesizes the findings from child tasks

If the root task is in Needs User Attention or Failed state, cognition might still end the session but documents why further AI work isn't possible.

## What you see when cognition is running

When cognition is active, you see the investigation progressing without your direct involvement:

- **New sub-tasks appearing** as cognition breaks down objectives
- **Tasks moving through statuses** as they go from New to Executing to Complete
- **Execution history growing** with records of which agents ran, what tools were called, and what results came back
- **New data assets appearing** as agents produce output files and reports
- **Validation comments** showing how cognition evaluated the results against your requirements

This activity happens in the background. You don't need to watch it happen in real time. Check in every few hours, review completed work, and provide feedback where needed.

## How to interact with cognition

Your primary interaction with cognition is through tasks, not direct messages. For an overview of collaboration patterns (full delegation, structured delegation, parallel work), see [Discovery Engine](concept-discovery-engine.md).

When cognition is running, the most effective ways to steer it are:

- **Add comments to tasks**: Explain what's good about a result or what needs to change. Cognition reads comments and factors them into its next decision.
- **Update validation requirements**: If results are close but not right, adjust the criteria rather than creating a new task.
- **Create new tasks**: When completed work reveals new questions or directions, add tasks. Cognition picks them up on its next cycle.
- **Remove irrelevant tasks**: Mark tasks as Removed if cognition created subtasks that aren't useful. Removing irrelevant tasks keeps the investigation focused.
- **Complete tasks yourself**: If you have specific expertise, do the work manually and mark the task complete. Cognition sees your result and builds on it.

## Enabling and stopping Discovery Mode

You control the Discovery Engine through Discovery Mode in the interface:

- **Enable**: Cognition starts its reasoning loop and begins working on available tasks.
- **Disable**: Cognition stops its reasoning loop. Any currently executing agent tasks continue to completion, but cognition doesn't start new work or make new decisions.

You can enable and stop Discovery Mode as many times as needed during an investigation. When you re-enable it, cognition picks up where the task state left off. It reviews all current tasks and resumes work.

> [!NOTE]
> When cognition is disabled and re-enabled, the internal reasoning history (working memory) resets. Cognition rebuilds its understanding from the current task state, which means it starts with a fresh warmup period. Task results, execution history, and validation comments persist because cognition stores them on the tasks themselves.

> [!NOTE]
> The system may also stop Discovery Mode during service upgrades to apply updates. When a service upgrade stops Discovery Mode, your investigation data is preserved. Re-enable Discovery Mode to resume.

## When cognition needs your help

Cognition works autonomously, but it recognizes situations where the situation needs human judgment. Look for these signals:

- **Needs User Attention tasks**: Cognition tried multiple approaches and couldn't produce a result that meets your validation requirements. Review the execution history and comments to understand what was attempted.
- **Repeated execution with no progress**: If you notice a task cycling through multiple runs without completing, the validation requirements might be too restrictive or the task description might need more context.
- **Slow or stalled progress**: If the investigation isn't moving forward, check whether tasks have unmet dependencies. Verify that agents have the right tools, and check whether cognition is waiting on a task that is stuck in Executing.

For guidance on diagnosing these situations, see [Debug task execution](how-to-debug-task-execution.md).

## Related content

- [Discovery Engine](concept-discovery-engine.md)
- [Tasks and investigations](concept-tasks-investigations.md)
- [Files and storage assets](concept-files-storage-assets.md)
- [Build investigations with cognition](how-to-build-investigations-cognition.md)
- [Debug task execution](how-to-debug-task-execution.md)
