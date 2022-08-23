---
title: Migrate from legacy agents to Azure Monitor Agent
description: This article provides guidance for migrating from the existing legacy agents to the new Azure Monitor Agent (AMA) and data collection rules (DCR).
ms.topic: conceptual
author: guywild
ms.author: guywild
ms.reviewer: shseth
ms.date: 08/04/2022 
ms.custom: devx-track-azurepowershell, devx-track-azurecli
# Customer intent: As an IT manager, I want to understand if and when I should move from using legacy agents to Azure Monitor Agent.    
---

# Migrate to Azure Monitor Agent from Log Analytics agent
[Azure Monitor Agent (AMA)](./agents-overview.md) collects monitoring data from the guest operating system of Azure and hybrid virtual machines. The agent delivers the data to Azure Monitor for use by features, insights, and other services, such as [Microsoft Sentinel](../../sentintel/../sentinel/overview.md) and [Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md).  Azure Monitor Agent replaces the Log Analytics agent (also known as MMA and OMS) for both Windows and Linux machines Azure Monitor and introduces a simplified, flexible method of configuring collection configuration called [Data Collection Rules (DCRs)](../essentials/data-collection-rule-overview.md). This article provides high-level guidance on when and how to migrate to the new Azure Monitor Agent (AMA) based on the agent's benefits and limitations.

## Benefits
- **Security and performance**
  - AMA uses Managed Identity or Azure Active Directory (Azure AD) tokens (for clients), which are much more secure than the legacy authentication methods. 
  - AMA provides a higher events per second (EPS) upload rate compared to legacy agents.
- **Cost savings** using data collection [using Data Collection Rules](data-collection-rule-azure-monitor-agent.md). This is one of the most useful advantages of using AMA.
  - DCRs lets you configure data collection for specific machines connected to a workspace as compared to the “all or nothing” mode that legacy agents have.
  - Using DCRs you can define which data to ingest and which data to filter out to reduce workspace clutter and save on costs.  
- **Simpler management** of data collection, including ease of troubleshooting
  - Easy **multihoming** on Windows and Linux.
  - Centralized, ‘in the cloud’ agent configuration makes every action, across the data collection lifecycle, simpler and more easily scalable, from onboarding to deployment to updates and changes over time.
  - Greater transparency and control of more capabilities and services, such as Sentinel, Defender for Cloud, and VM Insights.
- **A single agent** that consolidates all features necessary to address all telemetry data collection needs across servers and client devices (running Windows 10, 11). This is the goal, though Azure Monitor Agent currently converges with the Log Analytics agents.

## When should I migrate to the Azure Monitor Agent?
Your migration plan to the Azure Monitor Agent should include the following considerations:

- **Environment requirements:** Azure Monitor Agent supports [these operating systems](./agents-overview.md#supported-operating-systems) today. Support for future operating system versions, environment support, and networking requirements will only be provided in this new agent. If Azure Monitor Agent supports your current environment, start transitioning to it.

- **Current and new feature requirements:** Azure Monitor Agent introduces several new capabilities, such as filtering, scoping, and multi-homing. But it isn't at parity yet with the current agents for other functionality. For more information, see [Azure Monitor Agent's supported services and features](agents-overview.md#supported-services-and-features).

  Most new capabilities in Azure Monitor will be made available only with Azure Monitor Agent. Review whether Azure Monitor Agent has the features you require and if there are some features that you can temporarily do without to get other important features in the new agent.

  If Azure Monitor Agent has all the core capabilities you need, start transitioning to it. If there are critical features that you require, continue with the current agent until Azure Monitor Agent reaches parity.

- **Tolerance for rework:** If you're setting up a new environment with resources such as deployment scripts and onboarding templates, assess the effort involved. If the setup will take a significant amount of work, consider setting up your new environment with the new agent as it's now generally available.

> [!IMPORTANT]
> The Log Analytics agent will be [retired on **31 August, 2024**](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). If you are currently using the Log Analytics agent with Azure Monitor or other supported features and services, you should start planning your migration to Azure Monitor Agent using the information in this article.

## Should I install Azure Monitor Agent together with a legacy agent? 

Azure Monitor Agent can run alongside the legacy Log Analytics agents on the same machine so that you can continue to use their existing functionality during evaluation or migration. While this allows you to begin the transition given the limitations, keep in mind the considerations below:
- Be careful in collecting duplicate data because it could skew query results and affect downstream features like alerts, dashboards or workbooks. For example, VM insights uses the Log Analytics agent to send performance data to a Log Analytics workspace. You might also have configured the workspace to collect Windows events and Syslog events from agents. If you install Azure Monitor Agent and create a data collection rule for these events and performance data, you'll collect duplicate data. Make sure you're not collecting the same data from both agents. If you're collecting the same data with both agents, ensure they're **collecting from different machines** or **going to separate destinations**. Collecting duplicate data also generates more charges for data ingestion and retention.
- Running two telemetry agents on the same machine consumes double the resources, including, but not limited to CPU, memory, storage space, and network bandwidth.

> [!NOTE]
> When you use both agents during evaluation or migration, you can use the **Category** column of the [Heartbeat](/azure/azure-monitor/reference/tables/Heartbeat) table in your Log Analytics workspace, and filter for **Azure Monitor Agent**.

## Current capabilities

For full details about the capabilities of Azure Monitor Agent and a comparison with legacy agent capabilities, see [Azure Monitor Agent overview](../agents/agents-overview.md).

If you use Microsoft Sentinel, see [Gap analysis for Microsoft Sentinel](../../sentinel/ama-migrate.md#gap-analysis-between-agents) for a comparison of the extra data collected by Microsoft Sentinel.

## Test migration
To ensure safe deployment during migration, begin testing with few resources running the existing Log Analytics agent in your nonproduction environment. After you validate the data collected on these test resources, roll out to production by following the same steps.

See [create new data collection rules](./data-collection-rule-azure-monitor-agent.md#create-data-collection-rule-and-association) to start collecting some of the existing data types. After you validate that data is flowing as expected with Azure Monitor Agent, check the `Category` column in the [Heartbeat](/azure/azure-monitor/reference/tables/heartbeat) table for the value *Azure Monitor Agent* for AMA collected data. Ensure it matches data flowing through the existing Log Analytics agent.

## At-scale migration using Azure Policy
[Azure Policy](../../governance/policy/overview.md) and [Resource Manager templates](../resource-manager-samples.md) provide scalability to migrate a large number of agents. 
Start by analyzing your current monitoring setup with the Log Analytics agent using the following criteria:

  - Sources, such as virtual machines, virtual machine scale sets, and on-premises servers
  - Data sources, such as performance counters, Windows event logs, and Syslog
  - Destinations, such as Log Analytics workspaces

> [!IMPORTANT]
> Before you deploy to a large number of agents, you should consider [configuring the workspace](agent-data-sources.md) to disable data collection for the Log Analytics agent. If you leave it enabled, you may collect duplicate data resulting in increased cost until you remove the Log Analytics agents from your virtual machines. Alternatively, you may choose to have duplicate collection during the migration period until you can confirm that the AMA has been deployed and configured correctly.

See [Using Azure Policy](azure-monitor-agent-manage.md#using-azure-policy) for details on deploying Azure Monitor Agent across a set of virtual machines. Associate the agents to the data collection rules developed during your [testing](#test-migration). 

Validate that data is flowing as expected with the Azure Monitor Agent and that all downstream dependencies like dashboards, alerts, and runbook workers. Workbooks should all continue to function using data from the new agent.

When you confirm that data is being collected properly, [uninstall the Log Analytics agent](./agent-manage.md#uninstall-agent) from the resources. Don't uninstall it if you need to use it for System Center Operations Manager scenarios or others solutions not yet available on Azure Monitor Agent. Clean up any configuration files, workspace keys, or certificates that were used previously by the Log Analytics agent.

## Next steps

For more information, see:

- [Azure Monitor Agent overview](agents-overview.md)
- [Azure Monitor Agent migration for Microsoft Sentinel](../../sentinel/ama-migrate.md)
- [Frequently asked questions for Azure Monitor Agent migration](/azure/azure-monitor/faq#azure-monitor-agent)
