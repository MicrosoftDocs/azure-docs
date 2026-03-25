---
title: Incident Platforms in Azure SRE Agent
description: Connect an incident platform to your agent so it can receive alerts, investigate issues, and take action automatically.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: incidents, incident platform, pagerduty, servicenow, azure monitor, response plans
#customer intent: As an SRE, I want to connect my incident platform to my agent so that it can receive alerts and respond to incidents automatically.
---

# Incident platforms in Azure SRE Agent
An incident platform is the system that tells your agent when something goes wrong. When you connect your incident platform, the agent receives alerts, investigates problems, and takes action automatically, without waiting for someone to start a chat.

:::image type="content" source="media/incident-platforms/incident-platform-flow.svg" alt-text="Flow diagram showing an incident platform sending alerts through response plans to agent investigation and action." lightbox="media/incident-platforms/incident-platform-flow.svg":::

Without an incident platform, your agent is reactive: users ask questions and the agent investigates on demand. When you connect an incident platform, your agent becomes proactive. It picks up incidents the moment they fire and starts working immediately.

## Supported platforms

Your agent integrates with the following incident platforms.

| Platform | What it provides |
|---|---|
| **Azure Monitor** | Connected by default. Alerts from your managed resource groups flow to the agent automatically. |
| **PagerDuty** | Incident alerting and on-call management with API-based integration. |
| **ServiceNow** | Enterprise IT service management integration. |

Only one incident platform can be active at a time. Azure Monitor is the default. Switching to another platform disconnects Azure Monitor.

> [!NOTE]
> **ServiceNow authentication options**
>
> ServiceNow supports two authentication methods: **Basic Authentication** (username/password) and **OAuth 2.0** (token-based). Use OAuth 2.0 for production because tokens refresh automatically and no passwords are stored in your agent configuration. For setup instructions, see [Connect to ServiceNow](connect-servicenow.md).

## What connecting an incident platform enables

Connecting an incident platform gives your agent the following capabilities.

### Automatic incident reception

Your agent receives incidents as soon as they're created in your platform. No one needs to copy and paste alerts or manually start an investigation. The agent automatically picks up incidents.

### Rich incident cards

Incoming incidents from all supported platforms (PagerDuty, ServiceNow, Azure Monitor, and IcM) display as **rich cards** in the chat interface. Each card shows the following information.

| Field | Details |
|---|---|
| **Severity badge** | Color-coded by priority (for example, P1/Sev0 = red, P2/Sev1 = orange) |
| **Timestamp** | When the incident fired |
| **Title** | Incident title with platform prefix |
| **Status** | Current status (for example, Triggered, Acknowledged) |
| **Description** | Incident summary |
| **Response plan** | Link to the response plan handling the incident, if configured |
| **View Details** | Link to the incident in its source platform |

Rich cards replace the plain-text incident notifications used previously, making it easier to scan incident details at a glance.

### Incident interaction

Your agent can read from and write back to the incident platform.

| Platform | Read capabilities | Write capabilities |
|---|---|---|
| **Azure Monitor** | Alert details, severity, affected resources | Close alerts |
| **PagerDuty** | Incident details, history, on-call info | Acknowledge, resolve, add notes |
| **ServiceNow** | Incident details, related records | Post discussion entries, acknowledge, resolve |

### Response plans

Response plans define what your agent does when specific types of incidents arrive. You configure rules based on incident severity, title patterns, or other criteria, and the agent follows the plan automatically.

:::image type="content" source="media/incident-platforms/response-plan-flow.svg" alt-text="Screenshot of diagram showing how response plans combine filters, autonomy levels, and custom instructions." lightbox="media/incident-platforms/response-plan-flow.svg":::

A response plan can:

- Run specific investigation steps.
- Use particular connectors and tools.
- Operate at a defined autonomy level (from "gather info only" to "take corrective action").
- Retry investigation automatically (up to a configurable limit) before escalating to a human.

Response plans turn your agent from a general-purpose assistant into an incident responder with defined procedures for known incident types.

#### Quickstart response plan

When you connect an incident platform, you can enable the **Quickstart response plan** to automatically create a default response plan. This option gets you started immediately.

| Platform | Default plan handles | Autonomy level |
|---|---|---|
| **Azure Monitor** | Sev3 alerts | Autonomous |
| **PagerDuty** | P1 incidents | Autonomous |

The quickstart plan creates a response plan named `quickstart_handler` that:

- Matches incidents by priority or severity.
- Covers all impacted services.
- Runs in fully autonomous mode.
- Can be customized or disabled later.

You can customize this default plan or create more response plans with different filters and autonomy levels.

### Incident metrics

The **Monitor > Incident metrics** section gives you visibility into how your agent handles incidents over time.

:::image type="content" source="media/incident-platforms/incident-metrics-dashboard.svg" alt-text="Diagram of KPI cards showing incidents reviewed, mitigated by agent, assisted, and pending." lightbox="media/incident-platforms/incident-metrics-dashboard.svg":::

| Metric | What it shows |
|---|---|
| **Incidents reviewed** | Total incidents processed by the agent |
| **Mitigated by agent** | Incidents the agent resolved autonomously |
| **Assisted by agent** | Incidents where agent helped, user completed resolution |
| **Mitigated by user** | Incidents resolved by user with agent-provided information |
| **Pending user action** | Incidents waiting for human input |

Use these metrics to understand your agent's effectiveness and identify response plans that might need tuning.

## Incident platforms vs. connectors

Incident platforms and connectors are different concepts that work together.

| Aspect | Incident platforms | Connectors |
|---|---|---|
| **Purpose** | Where alerts come from | Data and actions the agent can use |
| **Configured in** | Settings > Incident Platform | Builder > Connectors |
| **Direction** | Inbound (incidents flow to the agent) | Outbound (agent reaches out to systems) |
| **Example** | PagerDuty sends an alert, then the agent investigates | Agent queries Kusto, then finds root cause |

Your agent uses both concepts: the incident platform *triggers* the investigation, and connectors provide the *tools* to investigate.

## Next step

> [!div class="nextstepaction"]
> [Connect to PagerDuty](./connect-pagerduty.md)

## Related content

- [Set up incident response plans](response-plan.md): End-to-end guide to set up automated incident handling.
- [Incident response plans](incident-response-plans.md): Define how your agent handles different incident types.
- [Connectors](connectors.md): Give your agent access to data sources and actions.
