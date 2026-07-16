---
title: "Step 5: Automate workflows in Azure SRE Agent"
description: Schedule recurring health checks, connect notification tools, and build automated workflows with connectors and subagents.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 04/24/2026
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
ms.custom: automation, scheduled tasks, connectors, subagents, workflow, notifications, getting started
#customer intent: As a site reliability engineer, I want to connect tools, create subagents, and schedule recurring tasks so that my agent automates routine operational work without manual intervention.
---

# Step 5: Automate workflows in Azure SRE Agent

Your team probably has recurring tasks like checking service health every morning, reviewing overnight alerts, verifying certificate expirations, or posting weekly capacity reports. Connect your tools, build a workflow, and let the agent run it on a schedule.

## What you accomplish

- Connect a notification tool so the agent can send messages
- Create a custom agent that uses that tool
- Schedule a recurring health check that runs automatically
- See the complete workflow on the visual canvas

## Prerequisites

| Requirement | Details |
|-------------|---------|
| **Completed Steps 1 and 2** | Create and set up your agent, and complete team onboarding |

> [!TIP]
> Steps 3 and 4 (first investigation and automating incidents) aren't required for this step.
> Completing them first gives you a better understanding of what workflows can automate.

## How it works

Automation connects three building blocks, each one set up through the portal:

| Building block | What it does | Example |
|---------------|-------------|---------|
| **Connector** | Gives the agent access to an external service | Teams, Outlook, Jira, Grafana |
| **Custom agent** | A specialized worker with access to specific tools | `health-check-reporter` with permission to send messages |
| **Scheduled task** | Triggers a custom agent on a recurring schedule | "Every morning at 8 AM, check resource health and send a summary" |

## Add a connector

Connectors let the agent interact with external services. Start with a notification tool so your agent can report findings. This article walks through setting up the **Outlook** connector. For Teams, see [Set Up Teams Connector](set-up-teams-connector.md).

1. Go to **Builder** > **Connectors** in the left sidebar.
1. Select **Add connector**.
1. Select **Outlook Tools (Office 365 Outlook)**.
1. Select the **Notification** tab, and then select **Send email (Office 365 Outlook)**.
1. Sign in and authorize access.
1. Select **Next**.
1. Select a **Managed identity**. The agent uses this identity at runtime to securely access the connector. Use a **User assigned** managed identity so you can reuse it across connectors and manage its lifecycle independently.
1. Select **Next**, review your configuration, and then select **Add connector**.

> [!NOTE]
> Some connectors require both OAuth sign-in and a managed identity. OAuth authorizes access to the external service, while the managed identity authenticates the agent to Azure Resource Manager at runtime.

**Checkpoint:** The connector appears in your connectors list with a **Connected** status.

> [!TIP]
> More connectors
> You can also add MCP-based connectors for Datadog, Splunk, Elasticsearch, Dynatrace, New Relic, and custom MCP servers. See [MCP Connectors](mcp-connectors.md) for the full list.

## Create a custom agent

Custom agents are specialized workers with access to specific tools. Create one for health reporting.

1. Go to **Builder** > **Agent Canvas** in the left sidebar.
1. Select **Create** in the toolbar, and then select **Custom Agent**. The creation dialog opens with two tabs: **Form** and **YAML**.
1. Fill in the required fields:
   - **Custom agent name**: for example, `health-check-reporter`
   - **Instructions**: describe what this custom agent does, for example, "You are a health check reporter. Check Azure resource health for my container apps and send a summary via email."
1. Select **Choose tools** and select the notification tool from your connector.
1. Select **Create**.

The custom agent appears as a node on the visual canvas.

**Checkpoint:** Your custom agent shows on the canvas with the notification tool connected to it.

> [!TIP]
> More options
> The custom agent form also lets you configure skills, hooks, and other advanced settings. See [Create a Custom Agent](create-subagent.md) for the full walkthrough.

## Schedule a recurring task

Link a scheduled task to the custom agent so it runs automatically.

1. Select the **+** button on the left side of your custom agent node on the canvas. The **Response custom agent** field automatically populates with that agent.
1. Select **Add scheduled task**.
1. Fill in the required fields:
   - **Task name**: for example, `daily-health-report`.
   - **Task details**: describe what the agent should do:

    | Field | Example value |
    |---|---|
    | **Task name** | `daily-health-report` |
    | **Task details** | Check the health of the resources in my resource group. Verify all apps are running, check CPU, and memory metrics over the last hour, review any recent warning logs. Summarize findings and send the report. |
    | **Frequency** | Daily |
    | **Time of day** | 8:00 AM (label shows your local timezone) |

1. Set the **Frequency** (Daily by default) and **Time of day** (for example, 8:00 AM).
1. Select **Create task**.

The canvas now shows the complete workflow chain visually.

**Checkpoint:** The task appears on the canvas connected to your custom agent. You can see the full automation chain: **Scheduled task → Custom agent → Tool**.

## Test it

Run the task immediately to verify everything works:

1. Go to **Scheduled tasks** in the left sidebar.
1. Select your task by checking the checkbox.
1. Select **Run task now** in the toolbar.
1. To watch execution, select the **task name** to open the executions view, and then select the **thread name** link. You can also find the thread under **Chats** in the sidebar.

The agent shows each step in real time: checking resources, collecting metrics, composing the report, and sending via your notification tool.

**Checkpoint:** You receive a health report. The chat thread shows the complete execution trace.

## You completed the getting-started journey

Your agent now delivers four outcomes:

- **Autonomous incident response**: Alerts are acknowledged, investigated, and resolved without you typing a message.
- **Lightning-fast root cause analysis**: The agent reads your code, queries your infrastructure, and traces issues to specific lines and configurations.
- **Extensible automation**: Scheduled tasks, connectors, and custom agents handle recurring work on your behalf.
- **Knowledge that never leaves**: Every investigation, every runbook, every conversation builds persistent expertise that stays with your team forever.

The longer you use it, the better it gets. The runbooks you uploaded in Step 2, the investigation you ran in Step 3, and the incidents it handled in Step 4 all become persistent expertise the agent recalls automatically in future investigations.

## Related capabilities

| Capability | What it adds |
|------------|-------------|
| [Scheduled Tasks](scheduled-tasks.md) | Advanced scheduling options and task management |
| [Connectors](connectors.md) | How connectors provide tools to your agent |
| [Custom Agents](sub-agents.md) | How custom agents delegate and specialize work |

## Related content

Now that you're set up, explore Concepts to understand how the agent thinks, or dive into Tutorials for hands-on guides on advanced features.

| Where to go | What you'll find |
|-------------|-----------------|
| [Concepts](user-roles.md) | How roles, permissions, memory, connectors, and agent reasoning work |
| [Capabilities](incident-response.md) | Detailed pages on every feature the agent offers |
| [Tutorials](deep-investigation.md) | Step-by-step guides for deep investigation, connectors, hooks, and more |
