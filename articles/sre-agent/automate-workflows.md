---
title: "Step 5: Automate workflows in Azure SRE Agent"
description: Schedule recurring health checks, connect notification tools, and build automated workflows with connectors and subagents.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 08/21/2026
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
| **Azure context for this example** | Access to the Azure resources the task checks. A logging provider is needed only if the task requests logs. The connector identity needs suitable RBAC for the requested data. |
| **Recipient** | An email address that can receive the test report |

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

Connectors let the agent interact with external services. Start with a notification tool so your agent can report findings. This article walks through setting up an Outlook connector. For Teams, see [Set up a Teams connector](set-up-teams-connector.md).

1. Go to **Builder** > **Connectors** in the left navigation.
1. Select **Add connector**.
1. Select the **Notification** tab.
1. Select the preview **Office 365 Outlook** connector with service **Microsoft Outlook**.
1. Sign in and authorize access.
1. In **Configure tools**, select the email-send operation.
1. Set its **Policy** to **Ask**.
1. Turn on **Parameter policy** for the email-send operation.
1. In its recipient or **To** parameter, enter the fixed address from the prerequisites.
1. Review the configuration, and then select **Create**.

**Checkpoint:** The connector appears in the connectors list. Verify that its status becomes **Connected**. A connector can instead show **Connecting**, **Failed**, or **Error** if setup is incomplete or unhealthy.

> [!TIP]
> More connectors
> You can also add MCP-based connectors for Datadog, Splunk, Elasticsearch, Dynatrace, New Relic, and custom MCP servers. See [MCP Connectors](mcp-connectors.md) for the full list.

## Create a custom agent

Custom agents are specialized workers with access to specific tools. This section assumes the workspace-enabled **Agent Canvas** experience.

1. Go to **Builder** > **Agent Canvas** in the left navigation.
1. Select **Create** in the toolbar, and then select **Custom Agent**. The creation dialog opens with two tabs: **Form** and **YAML**.
1. Fill in the required fields:
   - **Custom agent name**: for example, `health-check-reporter`
   - **Instructions**: describe what this custom agent does and include the report recipient, for example, "You are a health check reporter. Check Azure resource health for my container apps and email the summary to ops@example.com."
1. Select **Choose tools** and select the notification tool from your connector.
1. Select **Create**.

The custom agent appears as a node on the visual canvas. Its selected Outlook operation appears in a toolbox node, typically with an **MCP** badge.

**Checkpoint:** The canvas shows the custom-agent node and a toolbox node containing the selected Outlook tool.

> [!TIP]
> More options
> The custom agent form also lets you configure skills, hooks, and other advanced settings. See [Create a Custom Agent](create-subagent.md) for the full walkthrough.

## Schedule a recurring task

Link a scheduled task to the custom agent so it runs automatically.

1. Select the **+** button on the left side of your custom-agent node.
1. Select **Add scheduled task**. The dialog opens with **Response subagent** populated with that agent.
1. Fill in the required fields:
   - **Task name**: for example, `daily-health-report`.
   - **Response subagent**: verify that your custom agent is selected.
   - **Task details**: describe what the agent should do:

    | Field | Example value |
    |---|---|
    | **Task name** | `daily-health-report` |
    | **Task details** | Check the health of the resources in my resource group. Verify all apps are running, check CPU, and memory metrics over the last hour, review any recent warning logs. Summarize findings and send the report. |
    | **Frequency** | Daily |
   | **Time of day** | 8:00 AM; the label includes your local timezone, such as **Time of day (PST)**. |

1. Set **Frequency**, which defaults to **Daily**, and set **Time of day**.
1. Select **Create task**.

The canvas now shows the complete workflow chain visually.

**Checkpoint:** The canvas shows a scheduled-task node connected to the custom-agent node. The custom agent connects to a toolbox node that contains the Outlook tool.

## Test it

Run the task immediately to verify everything works:

1. Go to **Automation** in the left sidebar.
1. Select your task by checking the checkbox.
1. Select **Run now** in the toolbar.
1. To watch execution, select the **task name** to open the executions view, and then select the **thread name** link. You can also find the thread under **Chats** in the sidebar.

**Run now** submits the execution request and refreshes the automation list. The requested health checks, metrics, logs, report, and email depend on the available tools, resource access, telemetry, connector health, and successful execution.

**Checkpoint:** An execution appears for the task. If the execution resolves a thread, the executions view shows a **Thread name** link; otherwise it shows **No thread found**. If the execution succeeds and invokes the Outlook tool, verify that the recipient receives the report.

After testing, use **Turn off** or **Delete** for a scheduled task you don't plan to keep. Use **Remove** or **Disconnect** for the connector. Revoke the Outlook OAuth grant when it's no longer needed.

## You completed the getting-started journey

Your agent is now configured for four workflows:

- **Incident response**: Investigate alerts that match a response plan.
- **Root cause analysis**: Use connected code, telemetry, and Azure context during investigations.
- **Workflow automation**: Run scheduled tasks through custom agents and connectors.
- **Team context**: Use the knowledge sources connected during setup.

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
