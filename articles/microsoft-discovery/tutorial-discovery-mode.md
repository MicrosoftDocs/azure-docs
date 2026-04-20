---
title: "Tutorial: Run your first investigation with Discovery Mode in Microsoft Discovery"
description: Walk through an end-to-end investigation using the Discovery Engine, from creating tasks to reviewing results produced by cognition.
author: hectoralinares
ms.author: hectorl
ms.service: azure
ms.topic: tutorial
ms.date: 03/30/2026

#CustomerIntent: As a researcher or scientist, I want to walk through a complete investigation with the Discovery Engine so that I understand the full investigation process before using it for real research.
---

# Tutorial: Run your first investigation with Discovery Mode

In this tutorial, you create an investigation, set up a small set of tasks, enable Discovery Mode, and observe how the [Discovery Engine](concept-discovery-engine.md) executes your work autonomously. By the end, you have a completed investigation with results that were planned, executed, and validated using [cognition](concept-cognition-overview.md).

**Time to complete**: 30-45 minutes (including wait time for cognition to execute)

## Prerequisites

Before starting this tutorial, verify you have:

- A Microsoft Discovery workspace with a project created
- A chat model deployment named `gpt-5-2` (model: `gpt-5.2`) in your workspace. The Discovery Engine requires this model for task validation. See [Create Chat Model Deployment](quickstart-infrastructure-portal.md#5-create-chat-model-deployment) for setup instructions.
- Access to Discovery Studio in your browser

Create an agent as part of this tutorial. You don't need prior agent setup.

1. Create an agent for the tutorial
2. Create a new investigation
3. Add a root task with a broad objective
4. Add two child tasks with specific steps and validation requirements
5. Enable Discovery Mode and observe cognition at work
6. Review the results and validation outcomes
7. Provide feedback and see cognition respond

## Step 1: Create an agent

Before cognition can execute tasks, your project needs at least one agent. For this tutorial, create a prompt agent that can answer scientific questions.

1. In Discovery Studio, navigate to your project.
2. Select **Agents**, then select **Create Agent**.
3. Fill in the  values:

| Field | Value |
|-------|-------|
| **Name** | TutorialScienceAgent |
| **Description** | A general-purpose agent that answers scientific questions about chemistry, biology, and physics. |
| **Model** | Select an available model (for example, gpt-4o or gpt-5) |
| **Instructions** | You're a knowledgeable science assistant. Provide clear, accurate, and well-structured answers to scientific questions. Include specific data points, values, and explanations where relevant. When asked to compare or analyze, organize your response with clear sections. |

4. Leave **Enable plan confirmation** unselected.
5. Don't select any tools.
6. Don't select any knowledge bases.
7. Select **Create**.

Your agent is now available in the project. Cognition can assign it to tasks.

> [!TIP]
> For more information on agent configuration options, see [Discovery Agent concepts](concept-discovery-agent.md) and the [agents quickstart](quickstart-agents-studio.md).

## Step 2: Create an investigation

1. Open Discovery Studio and navigate to your project.
2. Select **New Investigation**.
3. Name your investigation something descriptive, for example: "Tutorial: Water molecule analysis"
4. Select **Create**.

Your investigation is now ready. It has no tasks yet.

## Step 3: Create the root task

The root task describes your overall objective. Cognition uses it as the anchor for the entire investigation.

1. In your investigation, select **Add Task**.
2. Fill in the fields:

| Field | Value |
|-------|-------|
| **Title** | Investigate the properties of water (H2O) |
| **Description** | Provide a comprehensive overview of the water molecule, including its chemical structure, key physical properties, biological importance, and any notable anomalous behaviors compared to similar molecules. Synthesize findings from the child tasks into a final summary. |
| **Validation requirements** | "Summary covers chemical structure, physical properties, and biological importance" |
| | "At least one anomalous property of water is explained" |
| **Priority** | Medium |

3. Select **Save**.

The task appears in your investigation with New status.

## Step 4: Add child tasks

Now add two child tasks that break the root objective into specific pieces of work. These tasks feed into the root task.

### Child task 1: Chemical structure

1. Select **Add Task**.
2. Fill in the fields:

| Field | Value |
|-------|-------|
| **Title** | Describe the chemical structure of H2O |
| **Description** | Explain the molecular structure of water, including bond angles, molecular geometry, polarity, and hydrogen bonding. Explain why these structural features are significant. |
| **Validation requirements** | "Bond angle and molecular geometry are specified" |
| | "Polarity and hydrogen bonding are explained" |
| **Parent** | Investigate the properties of water (H2O) |

3. Select **Save**.

### Child task 2: Physical properties

1. Select **Add Task**.
2. Fill in the fields:

| Field | Value |
|-------|-------|
| **Title** | Describe the key physical properties of water |
| **Description** | List and explain the key physical properties of water, including boiling point, freezing point, density behavior, specific heat capacity, and surface tension. Highlight any properties that are anomalous compared to similar-sized molecules. |
| **Validation requirements** | "At least four physical properties are described with values" |
| | "At least one anomalous property is identified and explained" |
| **Parent** | Investigate the properties of water (H2O) |
| **Priority** | Medium |

3. Select **Save**.

### Set dependencies

The root task should wait for both child tasks to complete before it synthesizes the results.

1. Open the root task ("Investigate the properties of water").
2. In the **Depends on** field, select both child tasks.
3. Select **Save**.

Your investigation now has three tasks:

```
"Investigate the properties of water (H2O)" [root]
  Depends on: Child 1, Child 2

  "Describe the chemical structure of H2O" [child 1]
    No dependencies

  "Describe the key physical properties of water" [child 2]
    No dependencies
```

## Step 5: Enable Discovery Mode

1. Find the Discovery Mode toggle in your investigation.
2. Enable Discovery Mode.

Cognition starts its reasoning loop. Here's what happens over the next few minutes:

### First 1-2 minutes: warmup

Cognition reviews your tasks, their relationships, and the available agents. You might not see visible activity during this period. 

### Minutes 2-5: execution begins

Cognition identifies that Child 1 and Child 2 have no dependencies and are ready to start. It assigns an agent to each and starts execution. Both tasks move from New to Executing.

Watch for:
- Task statuses changing from New to Executing
- Agent assignments appearing on each task

### Minutes 5-10: results and validation

As each child task completes, it moves through the Validating status while cognition checks the result against your validation requirements. If validation passes, the task moves to Complete.

Watch for:
- Tasks moving from Executing to Validating to Complete
- Validation comments appearing on each task

### Minutes 10-15: root task execution

Once both child tasks are Complete, cognition starts the root task. The agent executing the root task has access to the results from both children and synthesizes them into a comprehensive summary.

Watch for:
- The root task moving from New to Executing
- The final result appearing after validation

> [!NOTE]
> Actual timing varies depending on agent response times and whether tool calls are involved. Simple text-based tasks like these typically complete faster than tasks that require supercomputer tool execution.

## Step 6: Review the results

> [!IMPORTANT]
> To view output files attached to tasks, you need **Storage Blob Data Reader** on the storage account and network access to the storage endpoint. If you see access errors when clicking file links, contact your administrator. See [Azure Blob Storage in Microsoft Discovery](concept-storage-account.md).

Once all three tasks are Complete:

1. **Open each child task** and review:
   - The **Result** field containing the agent's output
   - The **Validation comments** showing which requirements passed
   - The **Execution history** showing which agent ran and how long it took

2. **Open the root task** and review:
   - The synthesized result that combines findings from both children
   - Whether the validation requirements ("covers chemical structure, physical properties, and biological importance" and "at least one anomalous property") were met

3. **Check the investigation dashboard** for overall progress: all three tasks should show as Complete.

## Step 7: Provide feedback and iterate

Now try influencing cognition's behavior:

1. **Add a follow-up task**:
   - Title: "Compare water's properties to hydrogen sulfide (H2S)"
   - Description: "Compare the physical properties of water (H2O) and hydrogen sulfide (H2S). Explain why two molecules with similar molecular structure have such different properties, focusing on the role of hydrogen bonding."
   - Validation: "Comparison covers at least three properties" and "Role of hydrogen bonding in the difference is explained"
   - Depends on: Child task 1 (chemical structure) and Child task 2 (physical properties)

2. **Observe cognition pick up the new task**. Since its dependencies are already Complete, cognition should start this task on its next cycle.

3. **Review the result** when it completes. Did the agent reference the findings from the earlier tasks?

## Step 8: Stop Discovery Mode

When you're done reviewing:

1. Stop Discovery Mode to prevent further resource consumption.
2. Your investigation and all its results persist. You can re-enable Discovery Mode at any time to continue the work.

## What you learned

- Created a prompt agent for the tutorial (TutorialScienceAgent)
- Created an investigation with a task hierarchy (root task with two children)
- Set up dependencies so the root task waits for child tasks to complete
- Wrote validation requirements that guided cognition's quality evaluation
- Observed cognition's warmup, agent selection, parallel execution, and validation
- Added a follow-up task and saw cognition incorporate it into the existing investigation
- Controlled cognition by enabling and disabling Discovery Mode

## Next steps

Now that you understand the mechanics of Discovery Mode:

- **Try a real research question**: Use a problem from your own domain. Start with the [guided exploration pattern](concept-advanced-investigation-patterns.md) for a balance of structure and autonomy.
- **Experiment with validation requirements**: See how different levels of specificity affect result quality. Refer to [Trust relationship and basic investigation patterns](concept-trust-basic-investigation-patterns.md).
- **Scale up**: Create investigations with more tasks, deeper hierarchies, and agents that use tools. Refer to [Build investigations with cognition](how-to-build-investigations-cognition.md).
- **Learn to troubleshoot**: When things don't go as expected, see [Debug task execution](how-to-debug-task-execution.md).

## Related content

- [Discovery Engine](concept-discovery-engine.md)
- [Cognition overview](concept-cognition-overview.md)
- [Tasks and investigations](concept-tasks-investigations.md)
- [Build investigations with cognition](how-to-build-investigations-cognition.md)
