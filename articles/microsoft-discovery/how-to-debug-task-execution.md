---
title: Debug task execution in Microsoft Discovery
description: Learn how to identify and resolve common issues with task execution in the Discovery Engine - including stuck tasks, validation failures, agent errors, and cognition behavior.
author: hectoralinares
ms.author: hectorl
ms.service: azure
ms.topic: how-to
ms.date: 11/10/2026

#CustomerIntent: As a researcher or scientist, I want to diagnose and fix problems with task execution so that my shared session can make progress.
---

# Debug task execution

When tasks in your shared session aren't progressing as expected, this guide helps you identify the cause and take action. Most issues fall into a few categories:

- Tasks that are stuck
- Validation that's too strict or too loose
- Agent or tool errors
- Cognition behavior that seems unexpected

> [!IMPORTANT]
> Before manually changing task statuses, stop the Discovery Engine and check for agent or tool executions that are still active. Don't assume that stopping cognition cancels them; confirm their status before resetting or resubmitting work to avoid duplicate execution.

## Tasks stuck in New status

A task stays in New state. Common causes:

### Unmet dependencies

The task has an unresolved dependency. Check both the dependency's status and whether its result provides the input this task needs; a terminal status doesn't necessarily indicate success.

**How to check**: Open the task and review the **Depends on** field. Check the status of each dependency.

**How to fix**:
- If the dependency is stuck, debug that task first.
- If the dependency is no longer relevant, remove it from the **Depends on** field.
- If the dependency completed but the task still shows New, cognition isn't working on the task yet. Wait 1-2 minutes.

### Cognition isn't running

The Discovery Engine might be stopped.

**How to check**: Verify that the Discovery Engine is running in your shared session.

**How to fix**: Start the Discovery Engine. Cognition starts its reasoning loop and picks up tasks that are ready.

> [!NOTE]
> The Discovery Engine might stop during service upgrades. This is expected. Your shared session data, task results, and execution history are preserved. Start the Discovery Engine again to resume.

### Discovery Engine won't start

The required chat model for task validation might not be deployed.

**How to check**: Verify that your workspace has a chat model deployment named `gpt-5-4` (model: `gpt-5.4`).

**How to fix**: Deploy the model (see [Create chat model deployment](quickstart-infrastructure.md#6-create-chat-model-deployment)), then start the Discovery Engine.

### Cognition is busy with other tasks

If many tasks are executing or in validation, cognition might be waiting for capacity before starting new ones.

**How to check**: Look at how many tasks are currently in Executing status. Check whether cognition is in a wait cycle by looking at the shared session activity.

**How to fix**: Wait for some tasks to finish. Cognition prioritizes tasks based on priority and dependency readiness.

## Tasks stuck in Executing status

A task stays in Executing while an agent is working on it. If it persists for an unusually long time, something might be wrong.

### Normal execution times

Before assuming a task is stuck, consider what's happening:

- **Agent-only tasks** (no tool calls): Usually complete in under 1 minute.
- **Tasks with tool calls**: First tool call in a session can take 2-4 minutes due to supercomputer cold start. Subsequent calls are faster (under 1 minute).
- **Tasks with heavy computation**: Some tools run simulations or large-scale analysis that take 5-15 minutes.

### The agent's response is stalled

If a task remains Executing without new tool activity, investigate the current run. Elapsed time alone doesn't identify the cause.

**How to check**: Review the task's execution history, the current agent response, and any tool-run status or errors. Missing or delayed logs don't prove that work stopped or didn't run.

**How to fix**:
- Check the current agent execution and model error details before retrying. Don't rely on restarting the Discovery Engine to cancel or retry an execution; confirm its current state before resubmitting.
- If the problem persists, check whether the model deployment in your workspace is healthy.

### Tool execution failed

The agent called a tool, but the tool returned an error.

**How to check**: Look at the execution history for tool call results. Error messages from tools typically include details about what went wrong.

**Common tool errors and fixes**:

| Error | Likely cause | Fix |
|-------|-------------|-----|
| "Tool execution failed" with no logs | Insufficient evidence to identify the failing stage | Check the tool-run status, node pool provisioning, quota, and available errors. Missing logs don't prove the tool didn't run |
| Connection time out to external API | Network restrictions on the supercomputer subnet | Verify that the required endpoints are accessible from the node pool. See [Manage Supercomputer and Node pools](how-to-manage-supercomputers.md) |
| Access denied (403) | Missing role assignment or a network access restriction | Check the error details, the calling identity's required roles, and the target resource's network rules |
| Container image pull failure | ACR not accessible from supercomputer, or image doesn't exist | Check ACR network rules and verify the image is pushed |

For failures involving service-managed infrastructure, collect the operation and correlation IDs and [request support](troubleshoot-microsoft-discovery.md#advanced-troubleshooting-and-data-collection). Don't attempt repairs to resources in service-managed resource groups.

## Tasks cycling between Executing and Incomplete

When a task repeatedly moves from Executing to Incomplete and back, cognition is retrying because the result doesn't meet validation requirements.

### Validation requirements are too strict

The agent produces reasonable results, but they don't precisely match what the validation criteria demand.

**How to check**: Read the validation comments on the task. Each attempt includes comments explaining which requirements passed and which failed.

**How to fix**:
- Adjust validation requirements to be achievable with the available agents and tools.
- Reword requirements to focus on what matters most rather than requiring exhaustive detail.
- See [Trust relationship and basic shared session patterns](concept-trust-basic-investigation-patterns.md) for guidance on calibrating validation.

### The agent isn't capable of the task

The assigned agent might not have the right tools or instructions for the type of work the task requires.

**How to check**: Look at which agent cognition assigned. Check whether the agent has the tools needed for the task. Compare the agent's capability summary with the task requirements.

**How to fix**:
- If a different agent would be more appropriate, add a comment to the task specifying which agent to use and why (for example, "Use molToolkit for this task. It requires RDKit for SMILES validation"). Cognition reads comments when selecting agents.
- If no suitable agent exists, you might need to create or configure one. See [Discovery Agent concepts](concept-discovery-agent.md).

### The task description is ambiguous

If the task description doesn't give the agent enough context, the agent might produce results that are technically valid but miss the point.

**How to check**: Read the agent's result and compare it to what you actually wanted. If the result addresses the description literally but misses your intent, the description needs more context.

**How to fix**: Update the task description with more specific details about what you're looking for, then set the status back to New.

## Tasks flagged as Needs User Attention

When cognition flags a task, it means cognition tried multiple approaches and couldn't produce a result that passes validation. 

**How to diagnose**:

1. **Check execution history**: How many runs were attempted? What approaches were tried?
2. **Read validation comments**: What specific requirements failed on each attempt?
3. **Review the latest result**: Is it what you need, or off?

**Options for resolving**:

- **Accept the result**: If the latest result is good enough, update the validation requirements and mark the task Complete.
- **Provide guidance**: Add a comment explaining what's missing or what approach to try. Set the status back to New.
- **Break the task down**: If the task is too complex for a single agent, decompose it into smaller child tasks.
- **Guide agent selection**: If the current agent doesn't have the right capabilities, add a comment specifying which agent to use and why, then set the status back to New.
- **Remove the task**: If the task is no longer relevant, set its status to Removed so cognition moves on.

## Cognition behavior issues

### Cognition warmup takes a long time

When you first start the Discovery Engine, cognition goes through a warmup period where it builds context by reviewing all tasks and planning its approach. The warmup typically takes 30-90 seconds and involves several internal reasoning cycles before the first task starts.

**This is normal behavior.** Don't stop and start the Discovery Engine again during warmup, because each restart triggers a new warmup period.

### Cognition keeps waiting instead of working

If cognition appears to be in a wait loop (repeatedly checking task status without starting new work), it might block other tasks in active states.

**How to check**: Look for tasks in Executing or Validating status that are there for a long time. The task state might be blocking cognition from moving forward.

**How to fix**: Resolve the stuck tasks first. Once the blockers clear, cognition resumes normal operation.

### Cognition assigns the wrong agent

Cognition selects agents based on its assessment of agent capabilities and task requirements. Occasionally, it might choose an agent that doesn't have the right tools for the job.

**How to check**: Look at the task's assigned agent and compare its capability summary with what the task needs.

**How to fix**:
- Add a comment to the task specifying which agent to use (for example, "This task requires paperAnalyzer. It needs literature search capabilities"). Cognition reads comments when selecting agents on the next attempt.
- If this happens repeatedly, check that your agents have clear, descriptive capability summaries so cognition can make better selections.

### Cognition creates too many subtasks

Cognition might decompose broad objectives into more subtasks than necessary.

**How to fix**:
- Remove subtasks that aren't useful by setting their status to Removed.
- Add a comment to the parent task guiding cognition to focus on specific areas.
- Use the [guided exploration pattern](concept-advanced-investigation-patterns.md) instead of full autonomy to give cognition boundaries.

## Can't view output files

Tasks show as Complete and results mention file outputs, but you see access errors when clicking file links.

**Why this happens**: Platform-mediated file access uses the managed identity configured for the workspace or tool workload. When you view files in VS Code, the browser uses **your** identity to access blob storage directly. These are two separate access paths.

**Three things must be in place for you to view files:**

| Check | What's needed | Who fixes it |
|-------|--------------|-------------|
| **Network** | Your browser needs an approved route to the blob endpoint, through selected public networks or a private endpoint with working DNS | Administrator |
| **CORS** | Blob service CORS must allow the Studio and integrated VS Code origins. See [CORS configuration](how-to-configure-project-storage.md#cors-configuration) | Administrator |
| **Permissions** | Your account needs **Storage Blob Data Reader** at the backing blob container or storage account, plus Discovery storage container permissions to inspect asset metadata. Discovery metadata roles don't grant direct blob-data access | Administrator |

If any of these is missing, you can see an error when opening file links even if the files were created successfully. Check the asset metadata and backing blob to confirm that the output exists.

**How to fix**: Contact your administrator with the storage account name (visible in the storage container properties) and ask them to verify all three items. For the full configuration requirements, see [Azure Blob Storage in Microsoft Discovery](how-to-configure-project-storage.md).

> [!NOTE]
> Browser file access and agent storage access use separate identities and network paths. A browser access error doesn't by itself indicate agent execution failed, but it also doesn't prove the platform's storage access is healthy. Diagnose each path separately.

## Checking shared session health

For a quick assessment of your shared session's state:

- **Count tasks by status**: How many are Complete vs. New vs. Executing vs. Needs User Attention?
- **Identify blockers**: Are there tasks in Executing or Needs User Attention that are holding up other work?
- **Check cognition state**: Is the Discovery Engine running? Is cognition actively cycling?
- **Review recent activity**: Has anything changed in the last 30 minutes? If not, something might be stalled.

If you need help interpreting shared session state, the execution history on individual tasks provides the most detailed information about what happened and why.

## Related content

- [Tasks and shared sessions](concept-tasks-investigations.md)
- [Cognition overview](concept-cognition-overview.md)
- [Trust relationship and basic shared session patterns](concept-trust-basic-investigation-patterns.md)
- [Build shared sessions with cognition](how-to-build-investigations-cognition.md)
- [Manage Supercomputer and Node pools](how-to-manage-supercomputers.md)
