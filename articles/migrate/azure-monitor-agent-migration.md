---
title: Migrate to Azure Monitor Agent from Log Analytics agent 
description: Guidance for migrating to Azure Monitor Agent from MMA
author: v-sreedevank
ms.author: prijaisw
ms.topic: conceptual 
ms.date: 08/07/2024

# Customer intent: As an azure administrator, I want to understand the process of migrating from the MMA agent to the AMA agent.

---

# Migrate to Azure Monitor Agent from Log Analytics agent

[Azure Monitor Agent (AMA)](./agents-overview.md) replaces the Log Analytics agent, also known as Microsoft Monitor Agent (MMA) and OMS, for Windows and Linux machines, in Azure and non-Azure environments, on-premises and other clouds. This article describes the impact on agent-based dependency analysis in lieu of Azure Monitor Agent (AMA) replacing the Log Analytics agent (also known as Microsoft Monitor agent (MMA)) and provides guidance to migrate from the Log Analytics agent to Azure Monitor Agent.

> [!IMPORTANT]
> The Log Analytics agent will be [retired on **August 31, 2024**](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). You can expect the following when you use the MMA or OMS agent after this date.
> - **Data upload:** Cloud ingestion services will gradually reduce support for MMA agents, which may result in decreased support and potential compatibility issues for MMA agents over time.  Ingestion for MMA will be unchanged until February 1 2025.
> - **Installation:** The ability to install the legacy agents will be removed from the Azure Portal and installation policies for legacy agents will be removed. You can still install the MMA agents extension as well as perform offline installations.
> - **Customer Support:** You will not be able to get support for legacy agent issues.
> - **OS Support:** Support for new Linux or Windows distros, including service packs, won't be added after the deprecation of the legacy agents.

> [!Note]
>  Starting July 1, 2024, [standard Log Analytics charges](https://go.microsoft.com/fwlink/?linkid=2278207) are applicable for Agent-based dependency visualization. We suggest moving to [agentless dependency analysis](how-to-create-group-machine-dependencies-agentless.md) for a seamless experience.

## Migrate from MMA to AMA

1: To deploy the AMA agent, it is recommended to first clean up the existing Service Map to avoid duplicates. [Learn more](/azure/azure-monitor/vm/vminsights-migrate-from-service-map#remove-the-service-map-solution-from-the-workspace).

2: Review the [prerequisites](/azure/azure-monitor/agents/azure-monitor-agent-manage#prerequisites) for installing Azure Monitor Agent. 

3: Download and run the script on the host machine.https://learn.microsoft.com/en-us/azure/azure-monitor/agents/azure-monitor-agent-manage?tabs=azure-portal#installation-options To get the AMA and the Dependency Agent deployed on the guest machine, the customer needs to create the Data collection rule (DCR) that maps to Log analytics workspace Id Collect data with Azure Monitor Agent - Azure Monitor | Microsoft Learn 

In the transition scenario, the Log analytics workspace would be the same as the one that was configured for Service Map agent. DCR will allow the Customer to enable the collection of Processes and Dependencies. By default, it is disabled. 

Log Analytics Size to estimate the price change customer will incur 

The customer would be billed against the data volume per workspace. To know the volume of their workspace pls ask the customers to follow below steps 

Customer logs in to the log analytics workspace. 

Navigates to Logs section and run below query. 

let AzureMigrateDataTables = dynamic(["ServiceMapProcess_CL","ServiceMapComputer_CL","VMBoundPort","VMConnection","VMComputer","VMProcess","InsightsMetrics"]); Usage | where StartTime >= startofday(ago(30d)) and StartTime < startofday(now()) | where DataType in (AzureMigrateDataTables) | summarize AzureMigateGBperMonth=sum(Quantity)/1000 

Azure Migrate support for AMA(Greenfield customers) 

Currently customer can download MMA agent via azure migrate portal. We will soon start supporting download of AMA agent via azure migrate portal.  