---
title: Migrate from legacy agents to Azure Monitor Agent
description: This article provides guidance for migrating from the existing legacy agents to the new Azure Monitor Agent (AMA) and data collection rules (DCRs).
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.reviewer: shseth
ms.date: 1/10/2023 
ms.custom: devx-track-azurepowershell, devx-track-azurecli
# Customer intent: As an IT manager, I want to understand how I should move from using legacy agents to Azure Monitor Agent.
---

# Migrate to Azure Monitor Agent from Log Analytics agent

[Azure Monitor Agent (AMA)](./agents-overview.md) replaces the Log Analytics agent (also known as MMA and OMS) for both Windows and Linux machines, in both Azure and non-Azure (on-premises and third-party clouds) environments. It introduces a simplified, flexible method of configuring collection configuration called [data collection rules (DCRs)](../essentials/data-collection-rule-overview.md). This article outlines the benefits of migrating to Azure Monitor Agent and provides guidance on how to implement a successful migration.

> [!IMPORTANT]
> The Log Analytics agent will be [retired on **August 31, 2024**](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). If you're currently using the Log Analytics agent with Azure Monitor or other supported features and services, you should start planning your migration to Azure Monitor Agent by using the information in this article.

## Benefits

In addition to consolidating and improving upon legacy Log Analytics agents, Azure Monitor Agent provides additional immediate benefits for **cost savings, simplified management experience, security and performance.** [Learn more about these benefits](./azure-monitor-agent-overview.md)


## Migration steps

1. Review and follow the **[prerequisites](./azure-monitor-agent-manage.md#prerequisites)** for use with Azure Monitor Agent. 
  - For non-Azure and on premises servers, [installing the Azure Arc agent](../../azure-arc/servers/agent-overview.md) is required though it's not mandatory to use Azure Arc for management overall. As such, this should incur no additional cost for Arc. 
2. **Service (legacy Solutions) requirements** - The legacy Log Analytics agents are used by various Azure services to collect required data. If you're not using any additional Azure service, you may skip this step altogether.   
  - Use the [AMA Migration Helper](./azure-monitor-agent-migration-tools.md#using-ama-migration-helper) to **discover solutions enabled** on your workspace(s) that use the legacy agents, and follow the per-solution migration recommendation<sup>1</sup> shown under Workspace overview tab. 
  - If you use Microsoft Sentinel, see [Gap analysis for Microsoft Sentinel](../../sentinel/ama-migrate.md#gap-analysis-between-agents) for a comparison of the extra data collected by Microsoft Sentinel.

<sup>1</sup> Start testing your scenarios during the preview phase. This will save time, avoid surprises later and ensure you're ready to deploy to production as soon as the service becomes generally available. Moreover you benefit from added security and reduced cost immediately.  

- **Installing Azure Monitor Agent alongside a legacy agent:** 
  - If you're setting up a *new environment* with resources, such as deployment scripts and onboarding templates, assess the effort of migrating to Azure Monitor Agent later. If the setup will take a significant amount of rework, install Azure Monitor Agent together with a legacy agent in your new environment to decrease the migration effort later.
  - Azure Monitor Agent **can run alongside the legacy Log Analytics agents on the same machine** so that you can continue to use existing functionality during evaluation or migration. You can begin the transition, but ensure you understand the **limitations below**:
    - Be careful when you collect duplicate data from the same machine, as this could skew query results, affect downstream features like alerts, dashboards, workbooks and generate more charges for data ingestion and retention. To avoid data duplication, ensure the agents are *collecting data from different machines* or *sending the data to different destinations*. Additionally,
      - For **Defender for Cloud**, you will only be [billed once per machine](../../defender-for-cloud/auto-deploy-azure-monitoring-agent.md#impact-of-running-with-both-the-log-analytics-and-azure-monitor-agents) when running both agents 
      - For **Sentinel**, you can easily [disable the legacy connector](../../sentinel/ama-migrate.md#recommended-migration-plan) to stop ingestion of logs from legacy agents.    
    - Running two telemetry agents on the same machine consumes double the resources, including but not limited to CPU, memory, storage space, and network bandwidth.

## Prerequisites



## Migration testing

To ensure safe deployment during migration, begin testing with few resources running Azure Monitor Agent in your nonproduction environment. After you validate the data collected on these test resources, roll out to production by following the same steps.

To start collecting some of the existing data types, see [Create new data collection rules](./data-collection-rule-azure-monitor-agent.md#create-a-data-collection-rule). Alternatively, you can use the [DCR Config Generator](./azure-monitor-agent-migration-tools.md#installing-and-using-dcr-config-generator) to convert existing legacy agent configuration into data collection rules.

After you *validate* that data is flowing as expected with Azure Monitor Agent, check the `Category` column in the [Heartbeat](/azure/azure-monitor/reference/tables/heartbeat) table for the value *Azure Monitor Agent* for AMA collected data. Ensure it matches data flowing through the existing Log Analytics agent.

## At-scale migration using Azure Policy

We recommend using [Azure Policy](../../governance/policy/overview.md) to migrate a large number of agents. Start by analyzing your current monitoring setup with the Log Analytics agent by using the [AMA Migration Helper](./azure-monitor-agent-migration-tools.md#using-ama-migration-helper). Use this tool to find sources like virtual machines, virtual machine scale sets, and non-Azure servers.

Use the [DCR Config Generator](./azure-monitor-agent-migration-tools.md#installing-and-using-dcr-config-generator) to migrate legacy agent configuration, including data sources and destinations, from the workspace to the new DCRs.

> [!IMPORTANT]
> Before you deploy a large number of agents, consider [configuring the workspace](agent-data-sources.md) to disable data collection for the Log Analytics agent. If you leave data collection for the Log Analytics agent enabled, you might collect duplicate data and increase your costs. You might choose to collect duplicate data for a short period during migration until you verify that you've deployed and configured Azure Monitor Agent correctly.

Validate that Azure Monitor Agent is collecting data as expected and all downstream dependencies, such as dashboards, alerts, and workbooks, function properly.

After you confirm that Azure Monitor Agent is collecting data properly, [uninstall the Log Analytics agent](./agent-manage.md#uninstall-agent) from monitored resources. Clean up any configuration files, workspace keys, or certificates that were used previously by the Log Analytics agent.

> [!IMPORTANT]
> Don't uninstall the legacy agent if you need to use it for System Center Operations Manager scenarios or others solutions not yet available on Azure Monitor Agent.

## Next steps

For more information, see:

- [Azure Monitor Agent overview](agents-overview.md)
- [Azure Monitor Agent migration for Microsoft Sentinel](../../sentinel/ama-migrate.md)
- [Frequently asked questions for Azure Monitor Agent migration](/azure/azure-monitor/faq#azure-monitor-agent)
