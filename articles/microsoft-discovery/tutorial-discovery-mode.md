---
title: "Tutorial: Run your first shared session with Discovery Engine in Microsoft Discovery"
description: Walk through an end-to-end shared session using the Discovery Engine, from creating tasks to reviewing results produced by cognition.
author: hectoralinares
ms.author: hectorl
ms.service: azure
ms.topic: tutorial
ms.date: 05/29/2026

#CustomerIntent: As a researcher or scientist, I want to walk through a complete shared session with the Discovery Engine so that I understand the full process before using it for real research.
---

# Tutorial: Run your first shared session with Discovery Engine

In this tutorial, you create a shared session, set up a small set of tasks, start the Discovery Engine, and observe how the [Discovery Engine](concept-discovery-engine.md) executes your work autonomously. By the end, you have a completed shared session with results that were planned, executed, and validated using [cognition](concept-cognition-overview.md).

**Time to complete**: 30-45 minutes (including wait time for cognition to execute)

## Prerequisites

Before starting this tutorial, verify you have:
- Access to Discovery Studio in your browser
- A Microsoft Discovery workspace with a project created
- Project contains default chat model deployment. The Discovery Engine requires this model for task validation. 

Create an agent as part of this tutorial. You don't need prior agent setup.

1. Create an agent for the tutorial
2. Create a new shared session
3. Add a root task with a broad objective
4. Add two child tasks with specific steps and validation requirements
5. Start the Discovery Engine and observe cognition at work
6. Review validation outcomes and final result

## Step 1: Create an agent

Before cognition can execute tasks, your project needs at least one agent. For this tutorial, create a prompt agent that can answer scientific questions.

1. In Discovery Studio, navigate to your project.
2. Select **Resources**, then in Agents, select **Add Agent**, then select **Create new agent**.
3. Fill in the  values:

| Field | Value |
|-------|-------|
| **Name** | TutorialScienceAgent |
| **Description** | A general-purpose agent that answers scientific questions about chemistry, biology, and physics. |
| **Model** | Select an available model (for example, gpt-5-4 (gpt-5.4)) |
| **Instructions** | You're a knowledgeable science assistant. Provide clear, accurate, and well-structured answers to scientific questions. Include specific data points, values, and explanations where relevant. When asked to compare or analyze, organize your response with clear sections. |

4. Leave **Enable plan confirmation** unselected.
5. Don't select any tools.
6. Don't select any knowledge bases.
7. Select **Create Agent**.

Your agent is now available in the project. Cognition can assign it to tasks.

> [!TIP]
> For more information on agent configuration options, see [Discovery Agent concepts](concept-discovery-agent.md) and the [agents quickstart](quickstart-agents-studio.md).

## Step 2: Create a shared session

1. Open Discovery Studio and navigate to your project.
2. In **Shared Sessions**, select **New Shared Session**.
3. Type in a friendly name for the shared session: "Tutorial: Water molecule analysis".
4. Confirm the **Discovery** agent is selected.
5. Submit the request.

Your shared session is now ready. It has no tasks yet.

## Step 3: Create the root task

The root task describes your overall objective. Cognition uses it as the anchor for the entire shared session.

1. In your shared session, select the **Tasks** tab.
2. Select **New task**.
3. Fill in the fields:

| Field | Value |
|-------|-------|
| **Name** | Investigate the properties of water (H2O) |
| **Shared Session** | Select **Tutorial: Water molecule analysis** | 
| **Description** | Provide a comprehensive overview of the water molecule, including its chemical structure, key physical properties, biological importance, and any notable anomalous behaviors compared to similar molecules. Synthesize findings from the child tasks into a final summary. |
| **Validation requirements** | Summary covers chemical structure, physical properties, and biological importance. At least one anomalous property of water is explained |

4. Select **Submit**.

The task appears in your shared session with New status.

## Step 4: Add child tasks

Now add two child tasks that break the root objective into specific pieces of work. These tasks feed into the root task.

### Child task 1: Chemical structure

1. Select **New task**.
2. Fill in the fields:

| Field | Value |
|-------|-------|
| **Name** | Describe the chemical structure of H2O |
| **Shared Session** | Select **Tutorial: Water molecule analysis** | 
| **Description** | Explain the molecular structure of water, including bond angles, molecular geometry, polarity, and hydrogen bonding. Explain why these structural features are significant. |
| **Validation requirements** | Bond angle and molecular geometry are specified. Polarity and hydrogen bonding are explained |

3. Select **Submit**.
4. Open the new task and select **Edit**.
5. In **Parent Task**, select **Investigate the properties of water (H2O)**.
6. Select **Save**.

### Child task 2: Physical properties

1. Select **New task**.
2. Fill in the fields:

| Field | Value |
|-------|-------|
| **Name** | Describe the key physical properties of water |
| **Shared Session** | Select **Tutorial: Water molecule analysis** | 
| **Description** | List and explain the key physical properties of water, including boiling point, freezing point, density behavior, specific heat capacity, and surface tension. Highlight any properties that are anomalous compared to similar-sized molecules. |
| **Validation requirements** | At least four physical properties are described with values. At least one anomalous property is identified and explained |

3. Select **Submit**.
4. Open the new task and select **Edit**.
5. In **Parent Task**, select **Investigate the properties of water (H2O)**.
6. Select **Save**.

### Set dependencies

The root task should wait for both child tasks to complete before it synthesizes the results.

1. Open the root task ("Investigate the properties of water").
2. Select the **Linked Tasks** tab.
3. Select **Add dependent task**.
4. In **Add dependencies**, select both child tasks.
5. Select **OK**.

Your shared session now has three tasks:

```
"Investigate the properties of water (H2O)" [root]
  Depends on: Child 1, Child 2

  "Describe the chemical structure of H2O" [child 1]
    No dependencies

  "Describe the key physical properties of water" [child 2]
    No dependencies
```

## Step 5: Start the Discovery Engine

1. In the **Tutorial: Water molecule analysis** shared session, select the **Tasks** tab.
2. Next to **Discovery Engine**, select **Start**.

Cognition starts its reasoning loop. Here's what happens over the next few minutes:

### First 1-2 minutes: warmup

Cognition reviews your tasks, their relationships, and the available agents. You might not see visible activity during this period. 

### Minutes 2-5: execution begins

Cognition identifies that Child 1 and Child 2 have no dependencies and are ready to start. It assigns an agent to each and starts execution. Both tasks move from New to Executing.

Watch for:
- Task statuses changing from New to Executing
- Agent assignments appearing on each task

### Minutes 5-7: results and validation

As each child task completes, it moves through the Validating status while cognition checks the result against your validation requirements. If validation passes, the task moves to Complete.

Watch for:
- Tasks moving from Executing to Validating to Complete
- Validation comments appearing on each task

### Minutes 7-10: root task execution

Once both child tasks are Complete, cognition starts the root task. The agent executing the root task has access to the results from both children and synthesizes them into a comprehensive summary.

Watch for:
- The root task moving from New to Executing
- The final result appearing after validation
- Discovery Engine auto-stops

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

3. **Check the shared session** for overall progress: all three tasks should show as Complete.

## What you learned

- Created a prompt agent for the tutorial (TutorialScienceAgent)
- Created a shared session with a task hierarchy (root task with two children)
- Set up dependencies so the root task waits for child tasks to complete
- Wrote validation requirements that guided cognition's quality evaluation
- Observed cognition's warmup, agent selection, parallel execution, validation, and auto-shutdown

## Next steps

Now that you understand the mechanics of the Discovery Engine:

- **Try a real research question**: Use a problem from your own domain. Start with the [guided exploration pattern](concept-advanced-investigation-patterns.md) for a balance of structure and autonomy.
- **Experiment with validation requirements**: See how different levels of specificity affect result quality. Refer to [Trust relationship and basic shared session patterns](concept-trust-basic-investigation-patterns.md).
- **Scale up**: Create shared sessions with more tasks, deeper hierarchies, and agents that use tools. Refer to [Build shared sessions with cognition](how-to-build-investigations-cognition.md).
- **Learn to troubleshoot**: When things don't go as expected, see [Debug task execution](how-to-debug-task-execution.md).

## Related content

- [Discovery Engine](concept-discovery-engine.md)
- [Cognition overview](concept-cognition-overview.md)
- [Tasks and shared sessions](concept-tasks-investigations.md)
- [Build shared sessions with cognition](how-to-build-investigations-cognition.md)
