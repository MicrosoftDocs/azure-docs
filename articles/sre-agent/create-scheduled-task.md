---
title: "Tutorial: Create and Edit Scheduled Tasks in Azure SRE Agent"
description: Set up a recurring automated task and learn how to modify it.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/18/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As an SRE, I want to create a scheduled task so that my agent automates routine checks on a recurring basis.
---

# Tutorial: Create and edit scheduled tasks in Azure SRE Agent

In this tutorial, you set up your agent to run tasks automatically on a schedule (from daily health checks to weekly reports) then modify them as your needs change.

**Estimated time**: 5 minutes

In this tutorial, you:

> [!div class="checklist"]
> - Create a recurring automated task from the Scheduled tasks dashboard
> - Verify task execution through conversation threads
> - Edit a task's schedule, instructions, or autonomy level
> - Create a scheduled task from the Agent Canvas

## Prerequisites

- An agent with the connectors and permissions needed for your task
- A clear understanding of what you want to automate

## Create a scheduled task

Follow these steps to create a new scheduled task from the portal.

1. Go to your agent, and select **Scheduled tasks** in the left sidebar.

    :::image type="content" source="media/common/portal-scheduled-tasks.png" alt-text="Screenshot of scheduled tasks dashboard showing task list and toolbar.":::

1. Select **Create task** in the toolbar.

1. Fill in the form:

    | Field | Example value |
    |-------|---------------|
    | **Task name** | Daily Health Check |
    | **Task details** | Check Azure Resource Health for all resources in prod-rg. Summarize healthy, warning, and critical counts. |
    | **Frequency** | Daily |
    | **Time of day (*timezone*)** | 9:00 AM |

    Don't change the default values for optional fields:

    - **Response subagent**: Leave empty to use the main agent.
    - **Message grouping for updates**: Select **Use same thread** to group results together.
    - **Agent autonomy level**: Select **Autonomous (Default)** to let the agent act without approval.

    > [!TIP]
    > When you select **Weekly**, a **Day of week** dropdown appears (default: Monday). For **Monthly**, a **Day of month** dropdown appears (default: 1). For **Custom cron**, the time picker is replaced by a **Cron expression (UTC)** text field.

1. Select **Create task**.

**Checkpoint:** Your task appears in the list with status **On**. You see the task name, frequency, and next run time you configured.

## Verify task execution

After the first scheduled run, select the task name to view the execution history. Each execution creates a conversation thread that shows:

- **Planning steps**: How the agent decides what to do.
- **Tool usage**: Which connectors and tools the agent calls, with timing.
- **Memory context**: Relevant past findings the agent considers.
- **Outcome summary**: Results, recommendations, and any notifications sent.

If a run fails, the thread shows the error. After three consecutive failures, the task status changes to **Failed**.

## Edit a scheduled task

To change the schedule, update instructions, or switch the agent mode, edit the task directly.

:::image type="content" source="media/create-scheduled-task/portal-scheduled-task-edit-dialog.png" alt-text="Screenshot of edit scheduled task dialog with prepopulated fields.":::

1. In the task list, either check the task's checkbox and select **Edit task** in the toolbar, or select the task name to open it directly.

1. The edit dialog opens with all current values prepopulated. Change the fields you need:

    | What to change | Field to update |
    |----------------|-----------------|
    | When it runs | **Frequency** and **Time of day (*timezone*)** |
    | What it does | **Task details** |
    | Who handles it | **Response subagent** |
    | How long it runs | **Repeat until** or **Run limit** |
    | Safety level | **Agent autonomy level** |

1. Select **Save**.

Your changes take effect immediately. The next run uses the updated configuration.

> [!TIP]
> Use **Refine with AI** on the Task details field to improve your instructions after seeing initial results.

## Alternative: Create from the Agent Canvas

You can also create a scheduled task directly from a custom agent node in the canvas view. This approach preselects the custom agent as the task responder, which is useful when you want a specialized custom agent to handle the task.

1. Go to **Builder** > **Agent Canvas**.
1. Find the custom agent you want to assign the task to.
1. Select the circular **+** button on the left side of the custom agent node.
1. Under the **Trigger** group, select **Add scheduled task**.
1. The create dialog opens with the **Response custom agent** preselected. Fill in the remaining fields as described in [Create a scheduled task](#create-a-scheduled-task).

The task appears both on the canvas (connected to the custom agent) and in the **Scheduled tasks** list.

## Common schedules

The following table lists example schedules for common use cases.

| Use case | Frequency | Time |
|----------|-----------|------|
| Morning health check | Daily | 9:00 AM |
| Hourly error scan | Custom cron: `0 * * * *` | Every hour |
| Weekly cost report | Weekly (Monday) | 8:00 AM |
| Monthly capacity review | Monthly (1st) | 9:00 AM |

## Next step

> [!div class="nextstepaction"]
> [Learn about scheduled tasks](./scheduled-tasks.md)

## Related content

- [Scheduled tasks](scheduled-tasks.md)
- [Workflow automation](workflow-automation.md)
- [Custom agents](sub-agents.md)
