---
title: Incident Management in Azure SRE Agent Preview
description: Learn how the incident management capabilities in Azure SRE Agent help reduce manual intervention and accelerate resolution times for your Azure resources.
author: craigshoemaker
ms.topic: conceptual
ms.date: 12/09/2025
ms.author: cshoe
ms.service: azure-sre-agent
---

# Incident management in Azure SRE Agent Preview

Azure SRE Agent streamlines incident management by automatically collecting, analyzing, and responding to alerts from various management platforms. This article explains how the agent processes incidents, evaluates their severity, and takes appropriate actions based on your configuration.

SRE Agent receives alerts from incident management platforms such as:

* [Azure Monitor alerts](/azure/azure-monitor/alerts/alerts-overview)
* [PagerDuty](https://www.pagerduty.com/)
* [ServiceNow](https://www.servicenow.com/)

When SRE Agent receives an alert from the management platform, the agent brings the incident into its context, analyzes the incident, and determines the next steps. This process mimics how a human SRE would acknowledge and investigate an incident.

After being notified of an issue, SRE Agent reviews logs, health probes, and other telemetry to assess the incident. During the assessment step, the agent summarizes findings, determines if the alert is a false positive, and decides whether action is needed.

When SRE Agent receives an alert from the management platform, the agent brings the incident into its context, analyzes the situation, and determines the next steps. This process mimics how a human site-reliability engineer would acknowledge and investigate an incident.

The agent reviews logs, health probes, and other data to assess the incident. During the assessment step, the agent summarizes findings, determines if the alert is a false positive, and decides whether action is needed.

> [!NOTE]
> Depending on the service you integrate for incident management, incidents can take a few minutes to appear for processing by SRE Agent.
> Azure Monitor as an incident management system for Azure SRE Agent is currently experimental and is not fully functional yet.

## Platform integration

Minimal setup is required for Azure Monitor (default integration). Non-Microsoft systems like PagerDuty and ServiceNow require extra setup for incident handling preferences. All platforms automatically include a default [incident response plan](incident-response-plan.md). You can change the default settings at any time.

To access the incident management settings, open your agent in the Azure portal and select the **Incident platform** tab.

# [Azure Monitor alerts](#tab/azmon-alerts)

By default, Azure Monitor alerts are configured as the agent's incident management platform. As the agent encounters incidents, any instances of Azure Monitor in any resource groups managed by SRE Agent process incident data.

To use a different management platform, first disconnect Azure Monitor as the agent's incident management platform.

# [PagerDuty](#tab/pagerduty)

To set up PagerDuty you need an API key to handle communication with Azure SRE Agent. PagerDuty provides two types of API keys:

* **General API key**: Used for development work and general API access. This key type cannot acknowledge incidents on behalf of the agent.

* **User API key**: Associated with a specific user account and email address. This key type is required for SRE Agent to successfully acknowledge and manage incidents in PagerDuty.

> [!IMPORTANT]
> You must use a **User API key** for the SRE Agent integration. General API keys don't allow the agent to acknowledge incidents properly because they lack the user context (email address) required for incident acknowledgment.

To create a User API key in PagerDuty:

1. Sign in to your PagerDuty account.
1. Go to **User Settings** > **API Access**.
1. Select **Create API User Token**.
1. Provide a description for the key (for example, "SRE Agent Integration").
1. Copy the generated User API key and use it in the SRE Agent configuration.

Once you have the API key correctly configured, you can setup PagerDuty in SRE Agent.

1. Go to your SRE Agent in the Azure portal.

1. Select the **Incident platform** tab and enter the following settings:

   | Setting | Value |
   |---|---|
   | **Incident platform** | Select **PagerDuty**. |
   | **REST API access key** | Enter your PagerDuty **API key**. |
   | **Quickstart handler** | Keep the checkbox selected. |

1. Select **Save**. PagerDuty is now responsible for managing incidents for the agent.

You can choose to enable a series of tools that provide granular control over how PagerDuty manages incidents. To further refine the incident management process, you can also customize the instructions to better control how PagerDuty responds to incidents.

# [ServiceNow](#tab/servicenow)

To set up ServiceNow:

1. Select the **Incident platform** tab and enter the following settings:

1. From the Incident platform drop-down, select **ServiceNow**.

1. Enter the ServiceNow specific settings:

    | Property | Value |
    |---|---|
    | ServiceNow endpoint | Enter the ServiceNow integration endpoint address. |
    | Username | Enter your username. |
    | Password | Enter your password. |
    | Quickstart handler | Keep the box checked for the **default incident handler**. |

1. Select **Save**.

---

For more information on how to customize your incident response plans, see [Incident response plans in Azure SRE Agent](./incident-response-plan.md).

## Agent responses

SRE Agent responds to incidents based on its configuration and operational mode:

When it detects an incident, it creates a new thread in the chat history that includes the initial analysis.

Depending on the [incident response plan](incident-response-plan.md), the agent can respond in a semi-autonomous or fully autonomous manner.

* **Reader mode**: The agent provides recommendations and requires human intervention for resolution.

* **Autonomous mode**: The agent can automatically close incidents or take corrective actions, depending on your configuration settings. The agent can also update or close incidents in management platforms to maintain synchronization across platforms.

You control what type of incidents SRE Agent handles by controlling the configuration settings of the management platform. For instance, you might decide that all low priority incidents are sent to the SRE Agent, while high priority incidents require complete human attention.

Once an incident is sent to the SRE Agent, you then can control how the agent responds by customizing incident handlers. Within an incident handler, you have control over:

* The agent's autonomy level
* Tools available to the agent for reporting and remediation
* Custom instructions further guiding the agent on how to deal with incidents

For more information, see [Incident response plan](incident-response-plan.md).

## Dashboard

Under the **Incident management** tab, you find a dashboard that provides a centralized view of all incidents managed by the SRE Agent. The dashboard displays key metrics such as incidents reviewed, assisted, and mitigated by the agent, along with incidents pending human actions. These categories give you insight into how the agent processes incidents. By offering aggregated visualizations and AI-generated root cause analysis, the dashboard helps you identify trends, optimize response plans, and uncover gaps in incident handling.

The dashboard reports only incidents handled by your incident response plans.

The following image shows how a dashboard reports the status of a series of issues.

:::image type="content" source="media/incident-management/sre-agent-incident-dashboard.png" alt-text="Screenshot of the Azure SRE Agent incident management dashboard." lightbox="media/incident-management/sre-agent-incident-dashboard.png":::

## Related content

* [Incident response plans in Azure SRE Agent](./incident-response-plan.md)
