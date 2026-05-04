---
title: Debug task execution in Microsoft Discovery
description: Learn how to identify and resolve common issues with task execution in the Discovery Engine - including stuck tasks, validation failures, agent errors, and cognition behavior.
author: hectoralinares
ms.author: hectorl
ms.service: azure
ms.topic: how-to
ms.date: 03/30/2026

#CustomerIntent: As a researcher or scientist, I want to diagnose and fix problems with task execution so that my investigation can make progress.
---

# Debug task execution

When tasks in your investigation aren't progressing as expected, this guide helps you identify the cause and take action. Most issues fall into a few categories: 
- Tasks that are stuck
- Validation that's too strict or too loose
- Agent or tool errors
- Cognition behavior that seems unexpected

## Tasks stuck in New status

A task stays in New state. Common causes:

### Unmet dependencies

The task depends on another task that isn't in a terminal status.

**How to check**: Open the task and review the **Depends on** field. Check the status of each dependency.

**How to fix**:
- If the dependency is stuck, debug that task first.
- If the dependency is no longer relevant, remove it from the **Depends on** field.
- If the dependency completed but the task still shows New, cognition isn't working on the task yet. Wait 1-2 minutes.

### Cognition isn't running

Discovery Mode might be stopped.

**How to check**: Verify that Discovery Mode is enabled in your investigation.

**How to fix**: Enable Discovery Mode. Cognition starts its reasoning loop and picks up tasks that are ready.

> [!NOTE]
> Discovery Mode may stop during service upgrades. This is expected. Your investigation data, task results, and execution history are preserved. Re-enable Discovery Mode to resume.

### Discovery Engine won't start

The required chat model for task validation might not be deployed.

**How to check**: Verify that your workspace has a chat model deployment named `gpt-5-2` (model: `gpt-5.2`).

**How to fix**: Deploy the model (see [Create Chat Model Deployment](quickstart-infrastructure-portal.md#6-create-chat-model-deployment)), then enable Discovery Mode.

### Cognition is busy with other tasks

If many tasks are executing or in validation, cognition might be waiting for capacity before starting new ones.

**How to check**: Look at how many tasks are currently in Executing status. Check if cognition is in a wait cycle by looking at the investigation activity.

**How to fix**: Wait for some tasks to finish. Cognition prioritizes tasks based on priority and dependency readiness.

## Tasks stuck in Executing status

A task stays in Executing while an agent is working on it. If it persists for an unusually long time, something might be wrong.

### Normal execution times

Before assuming a task is stuck, consider what's happening:

- **Agent-only tasks** (no tool calls): Usually complete in under 1 minute.
- **Tasks with tool calls**: First tool call in a session can take 2-4 minutes due to supercomputer cold start. Subsequent calls are faster (under 1 minute).
- **Tasks with heavy computation**: Some tools run simulations or large-scale analysis that take 5-15 minutes.

### The agent's response is stalled

If a task has been Executing for more than 15 minutes with no tool activity, the underlying model response might be stuck.

**How to check**: Look at the task's execution history for the current run. If the response shows "in progress" with no new output for an extended period, the response is likely stalled at the model layer.

**How to fix**:
- Stop and restart Discovery Mode. This causes cognition to reassess all tasks and retry the stalled one.
- If the problem persists, check whether the model deployment in your workspace is healthy.

### Tool execution failed

The agent called a tool, but the tool returned an error.

**How to check**: Look at the execution history for tool call results. Error messages from tools typically include details about what went wrong.

**Common tool errors and fixes**:

| Error | Likely cause | Fix |
|-------|-------------|-----|
| "Tool execution failed" with no logs | Supercomputer node couldn't start (VM SKU restricted, quota exceeded) | Check your node pool configuration and VM SKU availability |
| Connection time out to external API | Network restrictions on the supercomputer subnet | Verify that the required endpoints are accessible from the node pool. See [Manage Supercomputer and Node pools](how-to-manage-supercomputers.md) |
| Authentication error (403) | Missing role assignment for the workspace or supercomputer identity | Verify that the managed identity has the required roles on storage accounts, container registries, and other resources |
| Container image pull failure | ACR not accessible from supercomputer, or image doesn't exist | Check ACR network rules and verify the image is pushed |

## Tasks cycling between Executing and Incomplete

When a task repeatedly moves from Executing to Incomplete and back, cognition is retrying because the result doesn't meet validation requirements.

### Validation requirements are too strict

The agent produces reasonable results, but they don't precisely match what the validation criteria demand.

**How to check**: Read the validation comments on the task. Each attempt includes comments explaining which requirements passed and which failed.

**How to fix**:
- Adjust validation requirements to be achievable with the available agents and tools.
- Reword requirements to focus on what matters most rather than requiring exhaustive detail.
- See [Trust relationship and basic investigation patterns](concept-trust-basic-investigation-patterns.md) for guidance on calibrating validation.

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

When you first enable Discovery Mode, cognition goes through a warmup period where it builds context by reviewing all tasks and planning its approach. Typically takes 30-90 seconds and involves several internal reasoning cycles before the first task starts.

**This is normal behavior.** Don't stop and re-enable Discovery Mode during warmup, as each restart triggers a new warmup period.

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

**Why this happens**: Agents create files using the platform's managed identity. When you view files in VS Code, the browser uses **your** identity to access blob storage directly. These are two separate access paths.

**Three things must be in place for you to view files:**

| Check | What's needed | Who fixes it |
|-------|--------------|-------------|
| **Network** | Your IP (or VPN) must be allowed by the storage account firewall | Administrator |
| **CORS** | Storage account must allow requests from `vscode.dev` and `*.vscode-cdn.net` | Administrator |
| **Permissions** | Your account needs **Storage Blob Data Reader** on the storage account | Administrator |

If any of these is missing, you'll see an error when clicking file links, even though the files were created successfully.

**How to fix**: Contact your administrator with the storage account name (visible in the storage container properties) and ask them to verify all three items. See [Azure Blob Storage in Microsoft Discovery](concept-storage-account.md) for the full configuration requirements.

> [!NOTE]
> Investigations continue to work correctly regardless of your file access. Agents can read and write files, cognition can validate file content, and task results capture the text output. The access issue only affects your ability to view files directly.

## Checking investigation health

For a quick assessment of your investigation's state:

- **Count tasks by status**: How many are Complete vs. New vs. Executing vs. Needs User Attention?
- **Identify blockers**: Are there tasks in Executing or Needs User Attention that are holding up other work?
- **Check cognition state**: Is Discovery Mode enabled? Is cognition actively cycling?
- **Review recent activity**: Has anything changed in the last 30 minutes? If not, something might be stalled.

If you need help with interpreting investigation state, the execution history on individual tasks provides the most detailed information about what happened and why.

## Related content

- [Tasks and investigations](concept-tasks-investigations.md)
- [Cognition overview](concept-cognition-overview.md)
- [Trust relationship and basic investigation patterns](concept-trust-basic-investigation-patterns.md)
- [Build investigations with cognition](how-to-build-investigations-cognition.md)
- [Manage Supercomputer and Node pools](how-to-manage-supercomputers.md)
