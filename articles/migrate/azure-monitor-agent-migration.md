---
title: Migrate to Azure Monitor Agent from Log Analytics agent 
description: Procedure to migrate to Azure Monitor Agent from MMA
author: v-sreedevank
ms.author: prijaisw
ms.topic: tutorial 
ms.date: 08/07/2024

# Customer intent: As an azure administrator, I want to understand the process of migrating from the MMA agent to the AMA agent.

---

# Migrate to Azure Monitor Agent

[Azure Monitor Agent (AMA)](/azure/azure-monitor/agents/azure-monitor-agent-overview) replaces the Log Analytics agent, also known as Microsoft Monitor Agent (MMA) and OMS, for Windows and Linux machines, in Azure and non-Azure environments, on-premises and other clouds. This article describes the impact on agent-based dependency analysis in lieu of Azure Monitor Agent (AMA) replacing the Log Analytics agent (also known as Microsoft Monitor agent (MMA) and provides guidance to migrate from the Log Analytics agent to Azure Monitor Agent.

> [!IMPORTANT]
> The Log Analytics agent will be [retired on **August 31, 2024**](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). You can expect the following when you use the MMA or OMS agent after this date.
> - **Data upload:** Cloud ingestion services will gradually reduce support for MMA agents, which may result in decreased support and potential compatibility issues for MMA agents over time.  Ingestion for MMA will be unchanged until February 1 2025.
> - **Installation:** The ability to install the legacy agents will be removed from the Azure Portal and installation policies for legacy agents will be removed. You can still install the MMA agents extension as well as perform offline installations.
> - **Customer Support:** You will not be able to get support for legacy agent issues.
> - **OS Support:** Support for new Linux or Windows distros, including service packs, won't be added after the deprecation of the legacy agents.

> [!Note]
>  Starting July 1, 2024, [Standard Log Analytics charges](https://go.microsoft.com/fwlink/?linkid=2278207) are applicable for Agent-based dependency visualization. We suggest moving to [agentless dependency analysis](how-to-create-group-machine-dependencies-agentless.md) for a seamless experience.

## Migrate from Log analytics agent to Azure Monitor agent

To migrate from Log analytics agent to Azure Monitor agent, follow these steps:

1. To deploy the AMA agent, it is recommended to first clean up the existing Service Map to avoid duplicates. [Learn more](/azure/azure-monitor/vm/vminsights-migrate-from-service-map#remove-the-service-map-solution-from-the-workspace).

1. Review the [prerequisites](/azure/azure-monitor/agents/azure-monitor-agent-manage#prerequisites) to install the Azure Monitor Agent. 

1. Download and run the script on the host machine as detailed in [Installation options](/azure/azure-monitor/agents/azure-monitor-agent-manage?tabs=azure-portal#installation-options). To get the AMA and the Dependency Agent deployed on the guest machine, create the [Data collection rule (DCR)](/azure/azure-monitor/agents/azure-monitor-agent-data-collection) that maps to the Log analytics workspace ID. 

In the transition scenario, the Log analytics workspace would be the same as the one that was configured for Service Map agent. DCR allows you to enable the collection of Processes and Dependencies. By default, it is disabled. 

### Estimate the price change

You will be billed against the data volume per workspace. To know the volume of your workspace, follow these steps.

1. Sign in to the Log analytics workspace. 
1. Navigate to the **Logs** section and run the following query: 
 
```
let AzureMigrateDataTables = dynamic(["ServiceMapProcess_CL","ServiceMapComputer_CL","VMBoundPort","VMConnection","VMComputer","VMProcess","InsightsMetrics"]); Usage | where StartTime >= startofday(ago(30d)) and StartTime < startofday(now()) | where DataType in (AzureMigrateDataTables) | summarize AzureMigateGBperMonth=sum(Quantity)/1000 
```

### Support for AMA in Azure Migrate 

Currently, you can download the MMA agent through the Azure Migrate portal. Support for downloading the AMA agent will be added shortly.

## Next steps
[Learn](how-to create-group-machine-dependencies.md) how to create dependencies for a group.