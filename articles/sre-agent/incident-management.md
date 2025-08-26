---
title: Incident Management in Azure SRE Agent Preview
description: Learn how the incident management capabilities in Azure SRE Agent help reduce manual intervention and accelerate resolution times for your Azure resources.
author: craigshoemaker
ms.topic: conceptual
ms.date: 07/21/2025
ms.author: cshoe
ms.service: azure-sre-agent
---

# Incident management in Azure SRE Agent Preview

Azure SRE Agent Preview streamlines incident management by automatically collecting, analyzing, and responding to alerts from various management platforms. This article explains how the agent processes incidents, evaluates their severity, and takes appropriate actions based on your configuration.

SRE Agent receives alerts from incident management platforms such as:

* [Azure Monitor](/azure/azure-monitor/fundamentals/overview)
* [PagerDuty](https://www.pagerduty.com/)

Predefined conditions that you configure in these platforms trigger the alerts.

When SRE Agent receives an alert from the management platform, the agent brings the incident into its context, analyzes the situation, and determines the next steps. This process mimics how a human site-reliability engineer would acknowledge and investigate an incident.

The agent reviews logs, health probes, and other data to assess the incident. During the assessment step, the agent summarizes findings, determines if the alert is a false positive, and decides whether action is needed.

## Agent responses

SRE Agent responds to incidents based on its configuration and operational mode:

* **Reader mode**: The agent provides recommendations and requires human intervention for resolution.

* **Autonomous mode**: The agent can automatically close incidents or take corrective actions, depending on your configuration settings. The agent can also update or close incidents in management platforms to maintain synchronization across platforms.

You define the rules for how the agent handles incidents of various priorities. By customizing the rules in the management platforms, you decide which incidents the agent should acknowledge, resolve, or escalate. You can set these rules via prompts or configuration options.

## Platform integration

Minimal setup is required for Azure Monitor (default integration). Non-Microsoft systems like PagerDuty require extra setup for incident handling preferences.

To access the incident management settings, open your agent in the Azure portal. Then select **Settings** > **Incident platform**.

### Azure Monitor

By default, Azure Monitor is configured as the agent's incident management platform. As the agent encounters incidents, any instances of Azure Monitor in any resource groups managed by SRE Agent process incident data.

To use a different management platform, first disconnect Azure Monitor as the agent's incident management platform.

### PagerDuty

To set up PagerDuty:

1. After you select **Settings** > **Incident platform** in the Azure portal, enter the following settings:

   | Setting | Value |
   |---|---|
   | **Incident platform** | Select **PagerDuty**. |
   | **REST API access key** | Enter your PagerDuty REST API access key. |
   | **Quickstart handler** | Keep the checkbox selected. |

1. Select **Save**. PagerDuty is now responsible for managing incidents for the agent.

You can choose to enable a series of tools that provide granular control over how PagerDuty manages incidents. To further refine the incident management process, you can also add free-form text instructions in the form of a large language model (LLM) prompt to customize how PagerDuty responds to incidents.

## Related content

* [Security contexts in Azure SRE Agent](./access-management.md)
