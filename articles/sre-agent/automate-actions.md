---
title: "Step 5: Automate Actions in Azure SRE Agent"
description: Create scheduled tasks with email notifications using connectors, subagents, and scheduled task triggers.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/06/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: automation, scheduled tasks, MCP, notifications, getting started
#customer intent: As a site reliability engineer, I want to automate health checks with email notifications so that I can proactively monitor my systems without manual intervention.
---

# Step 5: Automate actions in Azure SRE Agent
**Estimated time**: 10 minutes

Build an automated health check that runs on a schedule and sends results by email. You connect a tool (Outlook), create a subagent to use it, and attach a scheduled task to trigger it.

## What you accomplish

By the end of this step, your agent has the following capabilities:

- An Outlook connector that provides email tools
- A subagent configured with the `SendOutlookEmail` tool
- A scheduled task that executes the subagent daily

## Prerequisites

| Requirement | Details |
|---|---|
| **Agent created** | Complete [Step 1: Create an agent](create-agent.md) first. |

> [!TIP]
> While not required, completing [Step 2: Add knowledge](first-value.md) and [Step 3: Connect source code](connect-source-code.md) makes your scheduled tasks more effective. Health checks can reference your runbooks and correlate findings to recent code changes, which turns generic reports into actionable insights.

## Add the Outlook connector

First, connect an external tool. You need the connector before you can assign its tools to a subagent.

1. Select **Builder** in the left sidebar.
1. Select **Connectors**.
1. Select **Add connector**.
1. Select the **Notification** tab, then select **Send email (Office 365 Outlook)**.
1. Sign in with your Microsoft account.
1. Select **Add connector**.

:::image type="content" source="media/automate-actions/connectors-outlook.png" alt-text="Screenshot of the connectors list showing Outlook connected.":::

The connector creates tools your subagents can use, including `SendOutlookEmail`, `GetOutlookEmail`, `ListOutlookEmails`, and others.

## Create a subagent with the email tool

Next, create a subagent that can send emails. Subagents are specialized workers that the agent can invoke for specific tasks.

1. Select **Builder** > **Subagent builder**.
1. Select **Create subagent** (or the plus icon on the canvas).
1. Name the subagent `email-notifications`.
1. Set **Autonomy** to **Autonomous** (runs without user confirmation).
1. Add the tool by selecting the tools dropdown, then select **SendOutlookEmail**.
1. Select **Save**.

:::image type="content" source="media/automate-actions/sub-agent-builder.png" alt-text="Screenshot of the subagent builder showing the email-notifications subagent configuration.":::

Your subagent now appears on the canvas with its connected tool.

## Add a scheduled task to the subagent

Link a scheduled task to the subagent. You do this step directly from the subagent node.

1. Select the **plus sign (+)** on the left side of the `email-notifications` subagent node.
1. Select **Add scheduled task**.
1. Fill in the task details:

    | Field | Value |
    |---|---|
    | **Task name** | `daily-resource-health-report` |
    | **Schedule** | Every 24 hours (or use cron: `0 8 * * *` for 8 AM daily) |
    | **Notification channel** | (Optional) Teams webhook URL |

1. Enter the task prompt:

    ```text
    Check the health of our Azure resources:
    1. Verify all container apps are running
    2. Check CPU and memory metrics over the last hour
    3. Review any recent warning logs
    4. Summarize findings and send a report via email using SendOutlookEmail
    ```

1. Select **Save**.

The canvas now shows the complete workflow: scheduled task to subagent to tool.

:::image type="content" source="media/automate-actions/canvas-workflow-visualization.png" alt-text="Screenshot of the canvas showing a scheduled task connected to a subagent with an email tool.":::

> [!TIP]
> The scheduled task triggers the subagent, which has access to the `SendOutlookEmail` tool from the Outlook connector. Without the connector, the subagent has no email tool. Without the subagent, the scheduled task has no way to send notifications.

## Verify the scheduled task

Test your scheduled task to confirm everything works together.

1. Select **Scheduled tasks** in the left sidebar.
1. Select your task in the list (check the checkbox).
1. Select **Run task now** in the toolbar.
1. Select the chat thread that opens to see execution details.

:::image type="content" source="media/automate-actions/scheduled-task-execution.png" alt-text="Screenshot of the scheduled task execution results in chat, showing tool invocations and completion confirmation.":::

The agent shows:

- Active status and execution time
- Planning and reasoning steps
- Tool invocations (`SendOutlookEmail`)
- Completion confirmation

## Summary

Your agent now connects to external tools (Outlook), runs subagents with specific tool access, executes scheduled tasks automatically, and sends proactive notifications without manual triggers.

You completed the getting started series.

## Next step

> [!div class="nextstepaction"]
> [Ask your agent for help](./ask-agent.md)

## Related content

- [Subagents](./sub-agents.md): How subagents work, when to use them, and autonomy levels
- [Scheduled tasks](./scheduled-tasks.md): Full details for automated recurring work
- [Send notifications](./send-notifications.md): Notify your team via Teams, Outlook, or MCP tools
- [Workflow automation](./workflow-automation.md): Chain actions together for complex workflows
- [Create a scheduled task](./create-scheduled-task.md): Cron expressions, business hours, and chained workflows
