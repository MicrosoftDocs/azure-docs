---
title: Migrate to Azure Monitor Agent from Log Analytics agent 
description: Procedure to migrate to Azure Monitor Agent from MMA
author: SnehaSudhirG
ms.author: prijaisw
ms.topic: how-to
ms.date: 09/18/2024

# Customer intent: As an azure administrator, I want to understand the process of migrating from the MMA agent to the AMA agent.

---

# Agent-based dependency analysis using Azure monitor agent (AMA)

Dependency analysis helps you to identify and understand dependencies across servers that you want to assess and migrate to Azure. We currently perform agent-based dependency analysis by downloading the  [MMA agent and associating a Log Analytics workspace](concepts-dependency-visualization.md) with the Azure Migrate project.

[Azure Monitor Agent (AMA)](/azure/azure-monitor/agents/azure-monitor-agent-overview) replaces the Log Analytics agent, also known as Microsoft Monitor Agent (MMA) and OMS, for Windows and Linux machines, in Azure and non-Azure environments, on-premises, and other clouds. 

This article describes the impact on agent-based dependency analysis because of Azure Monitor Agent (AMA) replacing the Log Analytics agent (also known as Microsoft Monitor agent (MMA)) and provides guidance to migrate from the Log Analytics agent to Azure Monitor Agent.

> [!IMPORTANT]
> The Log Analytics agent will be [retired on **August 31, 2024**](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). You can expect the following when you use the MMA or OMS agent after this date.
> - **Data upload:** Cloud ingestion services will gradually reduce support for MMA agents, which may result in decreased support and potential compatibility issues for MMA agents over time.  Ingestion for MMA will be unchanged until February 1 2025.
> - **Installation:** The ability to install the legacy agents will be removed from the Azure portal and installation policies for legacy agents will be removed. You can still install the MMA agents extension as well as perform offline installations.
> - **Customer Support:** You will not be able to get support for legacy agent issues.
> - **OS Support:** Support for new Linux or Windows distros, including service packs, won't be added after the deprecation of the legacy agents.

> [!Note]
>  Starting July 1, 2024, [Standard Log Analytics charges](https://go.microsoft.com/fwlink/?linkid=2278207) are applicable for Agent-based dependency visualization. We suggest moving to [agentless dependency analysis](how-to-create-group-machine-dependencies-agentless.md) for a seamless experience.

> [!Note]
> The pricing estimation has been covered in [Estimate the price change](#estimate-the-price-change) section.

## Migrate from Log analytics agent (MMA) to Azure Monitor agent (AMA)

If you already set up MMA and the associated Log Analytics workspace with your Azure Migrate project, you can migrate from the existing Log analytics agent to Azure Monitor agent without breaking/changing the association of the Log Analytics workspace with the Azure Migrate project by following these steps.

1. To deploy the Azure Monitor agent, it's recommended to first clean up the existing Service Map to avoid duplicates. [Learn more](/azure/azure-monitor/vm/vminsights-migrate-from-service-map#remove-the-service-map-solution-from-the-workspace).

1. Review the [prerequisites](/azure/azure-monitor/agents/azure-monitor-agent-manage#prerequisites) to install the Azure Monitor Agent. 

1. Download and run the script on the host machine as detailed in [Installation options](/azure/azure-monitor/agents/azure-monitor-agent-manage?tabs=azure-portal#installation-options). To get the Azure Monitor agent and the Dependency agent deployed on the guest machine, create the [Data collection rule (DCR)](/azure/azure-monitor/agents/azure-monitor-agent-data-collection) that maps to the Log analytics workspace ID. 

In the transition scenario, the Log analytics workspace would be the same as the one that was configured for Service Map agent. DCR allows you to enable the collection of Processes and Dependencies. By default, it's disabled. 

## Estimate the price change

You'll now be charged for associating a Log Analytics workspace with Azure Migrate project. This was earlier free for the first 180 days.
As per the pricing change, you'll be billed against the volume of data gathered by the AMA agent and transmitted to the workspace. To review the volume of data you're gathering, follow these steps:

1. Sign in to the Log analytics workspace. 
1. Navigate to the **Logs** section and run the following query: 
 
   ```
    let AzureMigrateDataTables = dynamic(["ServiceMapProcess_CL","ServiceMapComputer_CL","VMBoundPort","VMConnection","VMComputer","VMProcess","InsightsMetrics"]); Usage  

    | where StartTime >= startofday(ago(30d)) and StartTime < startofday(now()) 

    | where DataType in (AzureMigrateDataTables)  

    | summarize AzureMigrateGBperMonth=sum(Quantity)/1000 
    ```

## Support for Azure Monitor agent in Azure Migrate 

Install and manage Azure Monitor agent as mentioned [here](/azure/azure-monitor/agents/azure-monitor-agent-manage?tabs=azure-portal). Currently, you can download the Log Analytics agent through the Azure Migrate portal. 

## Next steps
[Learn](how-to-create-group-machine-dependencies.md) how to create dependencies for a group.