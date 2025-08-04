---
title: Incident management in Azure SRE Agent (preview)
description: Learn how the Azure SRE Agent incident management capabilities help reduce manual intervention and accelerate resolution times for your Azure resources.
author: craigshoemaker
ms.topic: conceptual
ms.date: 07/21/2025
ms.author: cshoe
ms.service: azure
---

# Incident management in Azure SRE Agent (preview)

Azure SRE Agent streamlines incident management by automatically collecting, analyzing, and responding to alerts from various management platforms. This article explains how the agent processes incidents, evaluates their severity, and takes appropriate actions based on your configuration.

Azure SRE Agent receives alerts from incident management platforms such as:

* [Azure Monitor](/azure/azure-monitor/fundamentals/overview)
* [PagerDuty](https://www.pagerduty.com/)

Alerts are triggered by predefined conditions configured in these systems external to SRE Agent.

When SRE Agent receives an alert from the management platform, the agent brings the incident into its context, analyzes the situation, and determines the next steps. This process mimics how a human SRE would acknowledge and investigate an incident.

The agent reviews logs, health probes, and other telemetry to assess the incident. During the assessment step, the agent summarizes findings, determines if the alert is a false positive, and decides whether action is needed.

## How agents respond

SRE Agent responds to incidents based on its configuration and operational mode.

* **Reader**: In reader mode, the agent provides recommendations and requires human intervention for resolution.

* **Autonomous**: In autonomous mode, the agent could automatically close incidents or take corrective actions, depending on your configuration settings. The agent can also update or close incidents in management platforms to maintain synchronization across platforms.

You define the rules for how incidents of different priorities are handled. By customizing the rules in the management platforms, you decide which incidents the agent should acknowledge, resolve, or escalate. These rules can be set via prompts or configuration options.

## Platform integration

Minimal setup is required for Azure Monitor (default integration), while non-Microsoft systems like PagerDuty require extra setup for incident handling preferences.

To access the incident management settings, open your agent in the Azure portal. Select **Settings** and select **Incident platform**.

### Azure Monitor

By default, Azure Monitor is configured as the agent's incident management platform. As the agent encounters incidents any instances of Azure Monitor in any resource groups managed by SRE Agent process incident data.

To use a different management platform, first disconnect Azure Monitor as the incident management platform for the SRE Agent.

### PagerDuty

To set up PagerDuty, open the agent in the Azure portal, select **Settings** then select **Incident platform**, and enter the following settings:

| Setting | Value |
|---|---|
| Incident platform | Select **PagerDuty**. |
| REST API access key | Enter your PagerDuty REST API access key. |
| Quickstart handler | Keep the checkbox for the quickstart handler checked. |

Select **Save** to save your changes.

Once the changes are saved, PagerDuty is now responsible to manage incidents for the agent.

#### Tools

You can choose to enable a series of tools that provide granular control over how PagerDuty manages incidents. To further refine the incident management process, you can also add free-form text instructions (in the form of an LLM prompt) to customize how PagerDuty responds to incidents.

## Related content

* [Security contexts](./security-context.md)
