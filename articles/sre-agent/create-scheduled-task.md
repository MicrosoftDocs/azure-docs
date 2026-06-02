---
title: "Tutorial: Create and edit scheduled tasks in Azure SRE Agent"
description: Set up a recurring automated task and learn how to modify it.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 04/02/2026
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
#customer intent: As an SRE, I want to create a scheduled task so that my agent automates routine checks on a recurring basis.
---

# Create and edit scheduled tasks in Azure SRE Agent

Scheduled tasks let your agent run automated checks on a recurring basis without manual intervention. You define what the agent should do, set a frequency, and the agent executes the task on schedule. Each run produces a conversation thread with full details on what the agent found and any actions it took.

In this tutorial, you create a scheduled task, verify it runs successfully, and then edit the task to adjust its configuration.

## Prerequisites

- An agent with the connectors and permissions needed for your task
- A clear understanding of what you want to automate

---

## Create a scheduled task

### 1. Open Scheduled Tasks

1. Go to your agent, and select **Scheduled tasks** in the sidebar.

<!-- Screenshot placeholder -->

### 2. Select Create Task

Select **Create task** in the toolbar.

Fill in the form:

| Field | Example value |
|-------|---------------|
| **Task name** | Daily Health Check |
| **Task details** | Check Azure Resource Health for all resources in prod-rg. Summarize healthy, warning, and critical counts. |
| **Frequency** | Daily |
| **Time of day** | 9:00 AM |

Leave optional fields at their defaults:

- **Response custom agent**: Leave empty to use the main agent.
- **Message grouping for updates**: "Use same thread" groups results together.
- **Agent autonomy level**: Autonomous (Default) lets the agent act without approval.

> [!TIP]
> When you select **Weekly**, a **Day of week** dropdown appears (default: Monday). For **Monthly**, a **Day of month** dropdown appears (default: 1). For **Custom cron**, the time picker is replaced by a **Cron expression (UTC)** text field.

### 3. Select Create task

**Checkpoint:** Your task appears in the list with status **On**. You should see the task name, frequency, and next run time you configured.

### Verify it works

After the first scheduled run, select the task name to view execution history. Each execution creates a conversation thread that shows:
- **Planning steps**: How the agent decided what to do.
- **Tool usage**: Which connectors and tools were called, with timing.
- **Memory context**: Relevant past findings the agent considered.
- **Outcome summary**: Results, recommendations, and any notifications sent.

If a run fails, the thread shows the error. After three consecutive failures, the task status changes to **Failed**.

## Edit a scheduled task

Need to change the schedule, update instructions, or switch the agent mode? Edit the task directly without recreating it. The task's execution history is preserved across edits.

<!-- Screenshot placeholder -->

### 1. Select the task

In the task list, either:
- Check the task's checkbox and select **Edit task** in the toolbar
- Select **⋯** on the task row and select **Edit task**
- Or select the task name to open execution history, and then select **Edit task**

### 2. Modify fields

The edit dialog opens with all current values pre-populated. Change what you need:

| What to change | Field to update |
|----------------|-----------------|
| When it runs | **Frequency** and **Time of day** |
| What it does | **Task details** |
| Who handles it | **Response custom agent** |
| How long it runs | **Repeat until** or **Run limit** |
| Safety level | **Agent autonomy level** |

### 3. Select Save

Your changes take effect immediately. The next run uses the updated configuration.

**Checkpoint:** A notification confirms the update. Select the task name to verify your execution history is still intact – all previous runs remain visible alongside future runs with the updated settings.

> [!TIP]
> Use **Refine with AI** on the Task details field to improve your instructions after seeing initial results.

## Alternative: Create from the Agent Canvas

You can also create a scheduled task directly from a custom agent node in the canvas view. This approach preselects the custom agent as the task responder, which is useful when you want a specialized custom agent to handle the task.

1. Go to **Builder** → **Agent Canvas**.
1. Find the custom agent you want to assign the task to.
1. Select the circular **+** button on the side of the custom agent node.
1. Under the **Trigger** group, select **Add scheduled task**.
1. The create dialog opens with the **Response custom agent** preselected. Fill in the remaining fields as described earlier.

The task appears both on the canvas (connected to the custom agent) and in the **Scheduled tasks** list.

## Common schedules

| Use case | Frequency | Time |
|----------|-----------|------|
| Morning health check | Daily | 9:00 AM |
| Hourly error scan | Custom cron: `0 * * * *` | Every hour |
| Weekly cost report | Weekly (Monday) | 8:00 AM |
| Monthly capacity review | Monthly (1st) | 9:00 AM |

## What you learned

- How to create a scheduled task from the **Scheduled tasks** page and from the **Agent Canvas**.
- How to configure frequency, time, and response custom agent.
- How to edit a task in place while preserving execution history.
- How to verify scheduled tasks.

## Related content

| Resource | What you learn |
|----------|-------------------|
| [Scheduled Tasks](scheduled-tasks.md) | Full capability reference |
| [Workflow Automation](workflow-automation.md) | Connect tasks with triggers and custom agents |
| [Custom agents](sub-agents.md) | Assign specialized custom agents to handle scheduled tasks |
