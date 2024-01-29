---
title: Prepare for deprecation of the Log Analytics MMA agent 
description: Learn how to prepare for the deprecation of the Log Analytics MMA agent in Microsoft Defender for Cloud
author: AlizaBernstein
ms.author: v-bernsteina
ms.topic: how-to
ms.date: 01/29/2024
---

# Prepare for deprecation of the Log Analytics agent

The Log Analytics agent, also known as the Microsoft Monitoring Agent (MMA) [will retire in August 2024](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation), and be replaced by the Azure Monitoring Agent (AMA). The Log Analytics agent and the AMA are used by the Defender for Servers and Defender for SQL servers on machines plans in Microsoft Defender for Cloud.

This article summarizes plans for agent deprecation.

## Preparing Defender for Servers

The Defender for Servers plan uses the Log Analytics agent (in general availability (GA)) and AMA (in public preview) for [several capabilities](plan-defender-for-servers-agents.md). Here's what's happening:

- All Defender for Servers capabilities will be provided by integration with Microsoft Defender for Endpoint, and with agentless machine scanning.
- Using AMA for Defender for Servers features won’t be released in GA.
- You can continue to use AMA in public preview until all features supported by AMA are supported by Defender for Endpoint integration or agentless machine scanning.
- After August 2024, use of the Log Analytics agent for Defender for Servers features will be deprecated.
- By enabling Defender for Endpoint integration and agentless scanning early, your Defender for Servers deployment stays up to date and supported.

## Preparing Defender for SQL on Machines

The use of the Log Analytics agent in Defender for SQL on Machines will be replaced by new SQL-targeted autoprovisioning process for the AMA. Migration to AMA autoprovisioning is seamless and ensures continuous machine protection.

## Support dates

Dates are summarized in the following table.

| Agent in use | Plan in use | Details |
| --- | --- | --- |
| Log Analytics agent | Defender for Servers, Defender for SQL on Machines | The Log Analytics agent is supported in GA until August 2024.|
| AMA | Defender for SQL on Machines | The AMA is available with a new autoprovisioning process. |
| AMA | Defender for Servers | The AMA is available in public preview until August 2024. |

## Scheduling migration

Many of the Defender for Servers features supported by the Log Analytics agent/AMA are already generally available with Microsoft Defender for Endpoint integration or agentless scanning.  

All of the Defender for SQL servers on machines features are already generally available with the autoprovisioned AMA.  

Depending on your scenario, the table summarizes our scheduling recommendations.

| Using AMA in Defender for SQL on machines?  | Using Defender for Servers with free security recommendations, file integrity monitoring, integrated Defender for Endpoint, adaptive application control?  | Schedule |
| --- | --- | --- |
| No | Yes | Wait for GA of all features with Defender for Endpoint integration and agentless scanning. You can use public preview earlier.<br/>Remove Log Analytics agent after August 2024. |
| No | No | Remove the Log Analytics agent now.|
| Yes | No | Migrate from the Log Analytics agent to AMA autoprovisioning now. |
| Yes | Yes | Use the Log Analytics agent and AMA side-by-side to ensure all capabilities are GA. [Learn more](auto-deploy-azure-monitoring-agent.md#impact-of-running-with-both-the-log-analytics-and-azure-monitor-agents) about running side-by-side.<br/>Alternatively, start migration from Log Analytics agent to AMA now. |

## Migration steps

The following table summarizes the migration steps for each scenario.

| Which scenario are you using? | Recommended action |
| --- | --- |
| Defender for SQL on Machines only | Migrate to [SQL autoprovisioning for AMA](defender-for-sql-autoprovisioning.md). |
| Defender for Servers only.<br/>Using one or more of these features: free security recommendations, file integrity monitoring, endpoint protection with integrated Defender for Endpoint, adaptive application control. | 1. Enable [Defender for Endpoint integration](enable-defender-for-endpoint.md).<br/>2. Enable [agentless scanning](enable-agentless-scanning-vms.md).<br/>3. Disable the [Log Analytics agent and the AMA](defender-for-sql-autoprovisioning.md#disable-the-log-analytics-agentazure-monitor-agent).<br/>4. Uninstall the Log Analytics agent on all machines protected by Defender for Cloud. |
| Defender for Servers only.<br/>Not using any of the features mentioned in the previous row. | 1. Enable [Defender for Endpoint integration](enable-defender-for-endpoint.md).<br/>2. Enable [agentless scanning](enable-agentless-scanning-vms.md).<br/>3. Disable the [Log Analytics agent and the AMA](defender-for-sql-autoprovisioning.md#disable-the-log-analytics-agentazure-monitor-agent).<br/> 4. Uninstall the Log Analytics agent and the AMA on all machines protected by Defender for Cloud. |
| Defender for SQL on Machines and Defender for Servers.<br/>Using one or more of these Defender for Servers features: free security recommendations, file integrity monitoring, endpoint protection with integrated Defender for Endpoint, adaptive application control. | 1. Enable [Defender for Endpoint integration](enable-defender-for-endpoint.md).<br/>2. Enable [agentless scanning](enable-agentless-scanning-vms.md).<br/>3. Migrate to [SQL autoprovisioning for AMA](defender-for-sql-autoprovisioning.md) in Defender for SQL on machines.<br/>4. Disable the [Log Analytics agent and the AMA](defender-for-sql-autoprovisioning.md#disable-the-log-analytics-agentazure-monitor-agent).<br/>5. Uninstall the Log Analytics agent on all machines protected by Defender for Cloud. |
| Defender for SQL on machines and Defender for Servers.<br/>You don't need any Defender for Servers features described in the previous row. | 1. Enable [Defender for Endpoint integration in Defender for Servers](enable-defender-for-endpoint.md).<br/>2. Disable the [Log Analytics agent and the AMA](defender-for-sql-autoprovisioning.md#disable-the-log-analytics-agentazure-monitor-agent).<br/>3. Uninstall the Log Analytics agent on all machines protected by Defender for Cloud. |

## Next steps

See the [upcoming changes for the Defender for Cloud plan and strategy for the Log Analytics agent deprecation](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation).
