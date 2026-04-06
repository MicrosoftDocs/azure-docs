---
title: Automate workflows in Azure SRE Agent
description: Schedule recurring health checks, connect notification tools, and build automated workflows with connectors and subagents.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: automation, scheduled tasks, connectors, subagents, workflow, notifications, getting started
#customer intent: As a site reliability engineer, I want to connect tools, create subagents, and schedule recurring tasks so that my agent automates routine operational work without manual intervention.
---

# Automate workflows in Azure SRE Agent

**Estimated time**: 10 minutes

Your team probably has recurring tasks, such as checking service health every morning, reviewing overnight alerts, verifying certificate expirations, or posting weekly capacity reports. In this tutorial, you connect your tools, build a subagent, and schedule a task that runs automatically.

## What you accomplish

By the end of this tutorial, your agent:

- Connects a notification tool so it can send messages
- Has a subagent that uses that tool
- Runs a recurring health check on a schedule
- Displays the complete workflow on the visual canvas

## Prerequisites

| Requirement | Details |
|---|---|
| **Agent created** | Complete [Step 1: Create an agent](create-agent.md) first. |

> [!TIP]
> While not required, completing [Step 3: Connect source code](connect-source-code.md) and [Step 4: Incident response](incident-response.md) first gives you a better understanding of what workflows can automate. Health checks can reference your runbooks and correlate findings to recent code changes.

## How it works

Automation connects three building blocks, each configured through the portal.

| Building block | What it does | Example |
|---|---|---|
| **Connector** | Gives the agent access to an external service | Teams, Outlook, Jira, Grafana |
| **Subagent** | A specialized worker with access to specific tools | `health-check-reporter` with permission to send messages |
| **Scheduled task** | Triggers a subagent on a recurring schedule | "Every morning at 8 AM, check resource health and send a summary" |

## Add a connector

Connectors let the agent interact with external services. Start with a notification tool so your agent can report findings. The following steps walk through setting up the **Outlook** connector. For Teams setup, see [Send notifications](send-notifications.md).

1. Go to **Builder** > **Connectors** in the left sidebar.
1. Select **Add connector**.
1. Select **Send email (Office 365 Outlook)**.
1. Sign in and authorize access.
1. Select **Next**.
1. Select a **Managed identity**. The agent uses this identity at runtime to securely access the connector. Use a **User assigned** managed identity so you can reuse it across connectors and manage its lifecycle independently.
1. Select **Next**, review your configuration, and then select **Add connector**.

> [!NOTE]
> Some connectors require both OAuth sign-in and a managed identity. OAuth authorizes access to the external service, while the managed identity authenticates the agent to Azure Resource Manager at runtime.

The connector appears in your connectors list with a **Connected** status.

:::image type="content" source="media/automate-workflows/connectors-list.png" alt-text="Screenshot of the connectors list showing a connected notification tool with green Connected status." lightbox="media/automate-workflows/connectors-list.png":::

> [!TIP]
> You can also add MCP-based connectors for Datadog, Splunk, Elasticsearch, Dynatrace, New Relic, and custom MCP servers. See [Set up an MCP connector](mcp-connector.md) for setup instructions.

## Create a subagent

Subagents are specialized workers with access to specific tools. Create one for health reporting.

1. Go to **Builder** > **Subagent builder** in the left sidebar.
1. Select **Create** in the toolbar and choose **Subagent**. The creation dialog opens.
1. Fill in the required fields:

    | Field | Example value |
    |---|---|
    | **Name** | `health-check-reporter` |
    | **Instructions** | You're a health check reporter. Check Azure resource health for my resources and send a summary via email. |

1. Select **Choose tools** and select the notification tool from your connector.
1. Select **Create**.

The subagent appears as a node on the visual canvas.

:::image type="content" source="media/automate-workflows/subagent-builder.png" alt-text="Screenshot of the Subagent builder canvas showing a subagent node with a connected notification tool." lightbox="media/automate-workflows/subagent-builder.png":::

**Checkpoint:** Your subagent shows on the canvas with the notification tool connected to it.

> [!TIP]
> The subagent creation form also lets you configure skills, hooks, and other advanced settings. For the full reference, see [Subagents](sub-agents.md).

## Schedule a recurring task

Link a scheduled task to the subagent so it runs automatically.

1. Select the **+** button on the left side of your subagent node on the canvas. The **Response subagent** field automatically populates with that subagent.
1. Select **Add scheduled task**.
1. Fill in the required fields:

    | Field | Example value |
    |---|---|
    | **Task name** | `daily-health-report` |
    | **Task details** | Check the health of the resources in my resource group. Verify all apps are running, check CPU, and memory metrics over the last hour, review any recent warning logs. Summarize findings and send the report. |
    | **Frequency** | Daily |
    | **Time of day** | 8:00 AM |

1. Select **Create task**.

The canvas now shows the complete workflow chain visually.

:::image type="content" source="media/automate-workflows/subagent-with-scheduled-task.png" alt-text="Screenshot of the canvas showing a scheduled task connected to a subagent connected to a notification tool." lightbox="media/automate-workflows/subagent-with-scheduled-task.png":::

**Checkpoint:** The task appears on the canvas connected to your subagent. You can see the full automation chain: **Scheduled task → Subagent → Tool**.

## Test the workflow

Run the task immediately to verify everything works.

1. Go to **Builder** > **Scheduled tasks**.
1. Select your task by checking the checkbox.
1. Select **Run task now** in the toolbar.
1. To watch execution, select the **task name** to open the executions view, and then select the **thread name** link. You can also find the thread under **Chats** in the sidebar.

The agent shows each step in real time: checking resources, collecting metrics, composing the report, and sending it through your notification tool.

**Checkpoint:** You receive a health report. The chat thread shows the complete execution trace.

## Getting started journey complete

Your agent now delivers four outcomes:

- **Autonomous incident response**: Alerts are acknowledged, investigated, and resolved without you typing a message.
- **Fast root cause analysis**: The agent reads your code, queries your infrastructure, and traces issues to specific lines and configurations.
- **Extensible automation**: Scheduled tasks, connectors, and subagents handle recurring work on your behalf.
- **Persistent knowledge**: Every investigation, every runbook, every conversation builds expertise that stays with your team.

The longer you use it, the better it gets. The runbooks you uploaded, the investigations you ran, and the incidents the agent handled all become persistent expertise that the agent recalls automatically in future investigations.

## Next step

> [!div class="nextstepaction"]
> [Ask your agent for help](./ask-agent.md)

## Related content

- [Scheduled tasks](scheduled-tasks.md)
- [Connectors](connectors.md)
- [Subagents](sub-agents.md)
- [Workflow automation](workflow-automation.md)
- [Create a scheduled task](create-scheduled-task.md)
- [Send notifications](send-notifications.md)
