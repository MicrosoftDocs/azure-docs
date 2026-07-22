---
title: Build shared sessions with cognition in Microsoft Discovery
description: Step-by-step guide to setting up shared sessions with the Discovery Engine, from creating your first task to monitoring an autonomous research effort.
author: hectoralinares
ms.author: hectorl
ms.service: azure
ms.topic: how-to
ms.date: 05/29/2026

#CustomerIntent: As a researcher or scientist, I want to set up a shared session with tasks and cognition so that the Discovery Engine can execute research on my behalf.
---

# Build shared sessions with cognition

This guide walks you through setting up a shared session that uses the [Discovery Engine](concept-discovery-engine.md) to execute research autonomously. By the end, you have a working shared session with tasks, validation requirements, and [cognition](concept-cognition-overview.md) running in the background.

## Prerequisites

Before you begin, verify you have:

- A Microsoft Discovery workspace with at least one project configured.
- A chat model deployment in your project. By default, your project uses the `gpt-5-4` chat model deployment (model: `gpt-5.4`). The Discovery Engine requires this model for task validation. See [Create chat model deployment](quickstart-infrastructure-portal.md#6-create-chat-model-deployment) for setup instructions.
- At least one agent deployed in your project (see [Discovery Agent concepts](concept-discovery-agent.md)).
- Access to Discovery Studio in your browser.

> [!NOTE]
> The Discovery Engine uses agents and tools that you configured in your project. If your project has no agents, cognition can't execute tasks. Check your project settings to verify that agents are available.

## Step 1: Create a shared session

Shared sessions are containers that group related tasks into a single research effort. Each shared session gets its own task list, execution history, and results.

1. Open Discovery Studio and navigate to your project.
2. In **Shared Sessions**, select **New Shared Session**.
3. Give your shared session a descriptive name that reflects the research objective.

> [!TIP]
> Use shared session names that help you identify the work later. For example, "BRCA1 binding analysis March 2026" is more useful than "Test 1."

## Step 2: Create your first task

How you structure your first task depends on the [shared session pattern](concept-advanced-investigation-patterns.md) you want to use. For your first shared session, start with a focused, structured approach so you can observe how cognition handles each step.

### Write the task

1. In your shared session, select **New task**.
2. Fill in the following fields:

**Title**: A short, specific name for the task.

> Example: "Retrieve protein sequences for BRCA1 variants from NCBI"

**Description**: What the agent needs to do, with enough context to understand the objective. Include any constraints or preferences.

> Example: "Search the NCBI protein database for human BRCA1 protein sequences. Retrieve the top 5 results by relevance. Save the sequences in FASTA format for downstream analysis. Use the protein database, not nucleotide."

**Validation requirements**: At least one criterion that defines what a successful result looks like.

> Example:
> - "At least 5 protein sequences retrieved"
> - "Results are in FASTA format"
> - "All sequences are from Homo sapiens"

### Set task relationships (optional for your first task)

If you're creating a single task, you can skip dependencies and parent relationships. If you're building a multi-step shared session, set these after creating the task and before enabling the Discovery Engine:

- **Depends on**: Select tasks that must complete before this one starts.
- **Parent**: Select the higher-level task this is part of, if applicable.

## Step 3: Add more tasks (for multi-step shared sessions)

For shared sessions with multiple steps, create all your tasks before enabling the Discovery Engine, giving cognition the full picture of what needs to happen.

### Example: a three-step shared session

```
Task 1: "Search NCBI for BRCA1 protein sequences"
  Depends on: (none)
  Validation: "At least 5 sequences retrieved in FASTA format"

Task 2: "Run BLAST search for homologous sequences"
  Depends on: Task 1
  Validation: "BLAST results include percent identity and E-values"
              "At least 10 homologous sequences identified"

Task 3: "Summarize findings in a report"
  Depends on: Task 2
  Validation: "Report includes top homologous sequences with alignment scores"
              "Report file contains a methodology section and a conclusion"
```

> [!TIP]
> When a task should produce file output, say so in the description. For example: "Write the findings to a markdown file called blast_report.md." The agent creates the file using the built-in file tools and the validation agent can read and verify its content. For details on file handling, see [Files and storage assets](concept-files-storage-assets.md).

> [!IMPORTANT]
> Set dependencies before enabling the Discovery Engine. If you enable the Discovery Engine first, it might start executing tasks in an order you didn't intend.

## Step 4: Enable the Discovery Engine

Once your tasks are set up:

1. In your shared session, find the Discovery Engine start toggle.
2. Start the Discovery Engine.

Cognition starts its reasoning loop. It reads all your tasks, checks dependencies, and begins executing tasks that are ready.

> [!NOTE]
> The Discovery Engine might incur extra costs due to background autonomous processing. The cognition service runs continuously while enabled, consuming model tokens for reasoning and decision-making. Stop the Discovery Engine when you're not actively using it.

### What to expect in the first few minutes

When cognition first starts, it goes through a warmup period:

1. **Context building** (30-90 seconds): Cognition reviews all existing tasks, their relationships, and the available agents. During this time, you might not see any visible activity.
2. **First task assignment**: Cognition selects the first task to execute and assigns an agent. The task status changes from New to Executing.
3. **Execution**: The agent works on the task. If the agent uses tools that run on the supercomputer, expect a cold start delay of 2-4 minutes for the first tool call as a compute node spins up.

## Step 5: Monitor progress

You don't need to watch cognition work in real time. Check in periodically to see how things are progressing.

### What to look for

- **Task statuses**: See which tasks moved from New to Executing, Validating, or Complete.
- **Validation results**: For completed tasks, check the validation comments to see whether the result met your requirements.
- **Execution history**: Each task records which agent ran, when it started, and how long it took.
- **File outputs**: Completed tasks that produced files show storage asset IDs in the task result. You can download these files from Discovery Studio.
- **Results**: Completed tasks include the text output produced by the agent. Review to confirm the work meets your expectations.
- **Needs User Attention**: Tasks that cognition couldn't resolve after multiple attempts are flagged for your review.

### How often to check

For a first shared session with a few tasks, check back after 15-30 minutes. For larger shared sessions, checking every few hours is sufficient. Cognition continues working whether you're watching or not.

## Step 6: Provide feedback

If a task is flagged for your attention:

1. **Add a note** to the task explaining what needs to change. Be specific. "The BLAST results should focus on the nr database, not swissprot" is more helpful than "Try again."
2. **Adjust validation requirements** if they were too strict or too loose. If a task keeps failing validation, the requirements might need to be more achievable.

## Step 7: Review final results

When all tasks reach a terminal status (Complete, Needs User Attention), the shared session is effectively done. Cognition recognizes when all work reaches a conclusion and ends its run.

Review the results of your root or parent tasks that typically synthesize the findings from child tasks into a coherent output. File outputs from child tasks propagate up to the root task, so you can find all produced files in one place.

> [!IMPORTANT]
> To view output files, you need **Storage Blob Data Reader** on the storage account and network access to the storage endpoint. Agents create files using the platform's managed identity, and your own identity is used when you view them. If you see access errors when clicking file links, contact your administrator. See [Azure Blob Storage in Microsoft Discovery](concept-storage-account.md).

If you're satisfied with the results, stop the Discovery Engine to prevent further resource consumption.

## Step 8: Iterate

Based on what you learned from your first shared session:

- **Refine validation requirements** for future shared sessions. Were they effective? Too strict? Too loose?
- **Adjust task structure**. Did you need more decompositions? Less?
- **Try a different pattern**. If you started with full structure, try giving cognition more autonomy next time, or vice versa. See [Advanced shared session patterns](concept-advanced-investigation-patterns.md) for options.

## Common issues when getting started

| Issue | Likely cause | What to do |
|-------|-------------|------------|
| Tasks stay in New status | Dependencies not met, or the Discovery Engine isn't enabled | Check that the Discovery Engine is on and that dependent tasks are complete |
| Tasks complete too quickly without good results | Missing or vague validation requirements | Add specific validation requirements and set the task back to New |
| Agent keeps retrying the same approach | Validation requirements might be impossible for the available agent to meet | Adjust requirements, or add a comment directing cognition to use a different agent |
| No tasks executing after several minutes | Cognition might still be in warmup, or there are no agents available | Wait 2-3 minutes. Check that your project has at least one agent deployed |
| Tool calls taking a long time | Supercomputer cold start (first call) or heavy computation | The first tool call in a shared session often takes 2-4 minutes. Subsequent calls are faster |

## Related content

- [Discovery Engine](concept-discovery-engine.md)
- [Cognition overview](concept-cognition-overview.md)
- [Tasks and shared sessions](concept-tasks-investigations.md)
- [Files and storage assets](concept-files-storage-assets.md)
- [Advanced shared session patterns](concept-advanced-investigation-patterns.md)
- [Task addition and execution](how-to-task-addition-execution.md)
- [Debug task execution](how-to-debug-task-execution.md)
