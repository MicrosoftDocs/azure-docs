---
title: Azure Monitor Agent overview
description: Overview of the Azure Monitor Agent, which collects monitoring data from the guest operating system of virtual machines.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 07/10/2024
ms.custom: references_regions
ms.reviewer: jeffwo

# Customer intent: As an IT manager, I want to understand the capabilities of Azure Monitor Agent to determine whether I can use the agent to collect the data I need from the operating systems of my virtual machines.

---

# Azure Monitor Agent overview

Azure Monitor Agent (AMA) collects monitoring data from the guest operating system of Azure and hybrid virtual machines and delivers it to Azure Monitor for use by features, insights, and other services such as [Microsoft Sentinel](../../sentintel/../sentinel/overview.md) and [Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md). This article provides an overview of Azure Monitor Agent's capabilities and supported use cases.

See a short video introduction to Azure Monitor agent, which includes a demo of how to deploy the agent from the Azure portal:  [ITOps Talk: Azure Monitor Agent](https://www.youtube.com/watch?v=f8bIrFU8tCs)

> [!NOTE]
> Azure Monitor Agent replaces the [Legacy Agent](./log-analytics-agent.md) for Azure Monitor. The Log Analytics agent is on a **deprecation path** and won't be supported after **August 31, 2024**. Any new data centers brought online after January 1 2024 will not support the Log Analytics agent. If you use the Log Analytics agent to ingest data to Azure Monitor, [migrate to the new Azure Monitor agent](./azure-monitor-agent-migration.md) prior to that date. 

## Installation
The Azure Monitor agent is one method of [data collection for Azure Monitor](../data-sources.md). It's installed on virtual machines running in Azure, in other clouds, or on-premises where it has access to local logs and performance data. Without the agent, you could only collect data from the host machine since you would have no access to the client operating system and running processes.

The agent can be installed using different methods as described in [Install and manage Azure Monitor Agent](./azure-monitor-agent-manage.md). You can install the agent on a single machine or at scale using Azure Policy or other tools. In some cases, the agent will be automatically installed when you enable a feature that requires it, such as Microsoft Sentinel.

## Data collection
All data collected by the Azure Monitor agent is done with a [data collection rule (DCR)](../essentials/data-collection-rule-overview.md) where you define the following:

- Data type being collected.
- Transforming the data, including filtering, aggregating, and shaping.
- Destination for collected data.

A single DCR can contain multiple data sources of different types. Depending on your requirements, you can choose whether to include several data sources in a few DCRs or create separate DCRs for each data source. This allows you to centrally define the logic for different data collection scenarios and apply them to different sets of machines. See [Best practices for data collection rule creation and management in Azure Monitor](../essentials/data-collection-rule-best-practices.md) for recommendations on how to organize your DCRs.

The DCR is applied to a particular agent by creating a [data collection rule association (DCRA)](../essentials/data-collection-rule-overview.md#data-collection-rule-associations-dcra) between the DCR and the agent. One DCR can be associated with multiple agents, and each agent can be associated with multiple DCRs. When an agent is installed, it connects to Azure Monitor to retrieve any DCRs that are associated with it. The agent periodically checks back with Azure Monitor to determine if there are any changes to existing DCRs or associations with new ones.

:::image type="content" source="media/azure-monitor-agent-overview/data-collection-rule-associations.png" alt-text="Diagram showing data collection rule associations connecting each VM to a single DCR." lightbox="media/azure-monitor-agent-overview/data-collection-rule-associations.png" border="false":::

## Costs

There's no cost for the Azure Monitor Agent, but you might incur charges for the data ingested and stored. For information on Log Analytics data collection and retention and for customer metrics, see [Azure Monitor Logs cost calculations and options](../logs/cost-logs.md) and [Analyze usage in a Log Analytics workspace](../logs/analyze-usage.md).


## Supported regions

Azure Monitor Agent is available in all public regions, Azure Government and China clouds, for generally available features. It's not yet supported in air-gapped clouds. For more information, see [Product availability by region](https://azure.microsoft.com/global-infrastructure/services/?products=monitor&rar=true&regions=all).


## Supported services and features

The following tables identify the different environments and features that are currently supported by Azure Monitor agent in addition to those supported by the legacy agent. This information will assist you in determining whether Azure Monitor agent can support your current requirements. See [Migrate to Azure Monitor Agent from Log Analytics agent](../agents/azure-monitor-agent-migration.md) for guidance on migrating specific features.


### Windows agents

|	Category |	Area	|	Azure Monitor Agent	|	Legacy Agent |
|:---|:---|:---|:---|
|	**Environments supported**	|		|		|		|
|		|	Azure	| ✓ | ✓ |
|		|	Other cloud (Azure Arc)	| ✓ | ✓ |
|		|	On-premises (Azure Arc)	| ✓ | ✓ |
|		|	Windows Client OS	| ✓ |		|
|	**Data collected**	|		|		|		|
|		|	Event Logs	| ✓ | ✓ |
|		|	Performance	| ✓ | ✓ |
|		|	File based logs	|	✓ 	| ✓ |
|		|	IIS logs	|	✓ 	| ✓ |
|	**Data sent to**	|		|		|		|
|		|	Azure Monitor Logs	| ✓ | ✓ |
|	**Services and features supported**	|		|		|		|
|		|	Microsoft Sentinel 	|	✓ ([View scope](./azure-monitor-agent-migration.md#understand-additional-dependencies-and-services))	| ✓ |
|		|	VM Insights	|	✓ | ✓ |
|		|	Microsoft Defender for Cloud - Only uses MDE agent	|		|  |
|		|	Automation Update Management - Moved to Azure Update Manager	| ✓	| ✓ |
|   | Azure Stack HCI | ✓ |  |
|		|	Update Manager - no longer uses agents	| 	|		|
|		|	Change Tracking	| ✓ | ✓ |
|   | SQL Best Practices Assessment | ✓ |     |

### Linux agents

|	Category	|	Area	|	Azure Monitor Agent	|	Legacy Agent	|
|:---|:---|:---|:---|
|	**Environments supported**	|		|		|		|
|		|	Azure	| ✓ | ✓ |
|		|	Other cloud (Azure Arc)	| ✓ | ✓ |
|		|	On-premises (Azure Arc)	| ✓ | ✓ |
|	**Data collected**	|		|		|
|		|	Syslog	| ✓ | ✓ |
|		|	Performance	| ✓ | ✓ |
|		|	File based logs	| ✓ |		|
|	**Data sent to**	|		|		|		|
|		|	Azure Monitor Logs	| ✓ | ✓ |
|	**Services and features supported**	|		|		|		|
|		|	Microsoft Sentinel 	|	✓ ([View scope](./azure-monitor-agent-migration.md#understand-additional-dependencies-and-services))	| ✓ |
|		|	VM Insights	| ✓ |	✓ |
|		|	Microsoft Defender for Cloud - Only use MDE agent	| | |
|		|	Automation Update Management - Moved to Azure Update Manager	|	✓	| ✓ |
|		|	Update Manager - no longer uses agents	|	|	|
|		|	Change Tracking	| ✓ | ✓ |


## Supported data sources
See [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md) for a list of the data sources that can be collected by the Azure Monitor Agent and details on how to configure each.

## Next steps

- [Install the Azure Monitor Agent](azure-monitor-agent-manage.md) on Windows and Linux virtual machines.
- [Create a data collection rule](./azure-monitor-agent-data-collection.md) to collect data from the agent and send it to Azure Monitor.
