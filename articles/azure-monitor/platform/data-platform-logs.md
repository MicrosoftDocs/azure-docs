---
title: Azure Monitor Logs
description: Describes logs in Azure Monitor, which are used for advanced analysis of monitoring data.
documentationcenter: ''
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.date: 09/09/2020
ms.author: bwren
---

# Azure Monitor Logs overview
Azure Monitor Logs is a feature of Azure Monitor that collects and organizes log and performance data from a [variety of sources](../monitor-reference.md). Data from different sources such [platform logs](platform-logs-overview.md), log and performance data from [virtual machines agents](agents-overview.md), and usage and performance data from [applications](../app/app-insights-overview.md) can be consolidated into a single workspace so they can be analyzed together using a sophisticated query language that's capable of quickly analyzing millions of records and performing sophisticated data analysis. Work with log queries and their results interactively using Log Analytics or use their results in various Azure Monitor features such as alerts and workbooks.

> [!NOTE]
> Azure Monitor Logs is one part of the data platform supporting Azure Monitor. The other is [Azure Monitor Metrics](data-platform-metrics.md) stores numeric data in a time-series database, which makes this data more lightweight than Azure Monitor Logs and capable of supporting near real-time scenarios making them particularly useful for alerting and fast detection of issues. Metrics though can only store numeric data in a particular structure, while Logs can store a variety of different data types each with their own structure. You can also perform complex analysis on Logs data using log queries which cannot be used for analysis of Metrics data.

![Azure Monitor overview](media/data-platform/overview.png)


## Log Analytics workspace
Data collected by Azure Monitor Logs is stored in a [Log Analytics workspace](./design-logs-deployment.md). The workspace defines the geographic location of the data, access rights defining which users can access data, and configuration settings such as the pricing tier and data retention.  

You must create at least one workspace to use Azure Monitor Logs. A single workspace may be sufficient for all of your monitoring data, or may choose to create multiple workspaces depending on your requirements. 

- See [Create a Log Analytics workspace in the Azure portal](../learn/quick-create-workspace.md) to create a new workspace.
- See [Designing your Azure Monitor Logs deployment](design-logs-deployment.md) on considerations for creating multiple workspaces.


## Log collection
Once you create a Log Analytics workspace, you must configure different sources to send their data. No data is collected automatically. This configuration will be different depending on the data source. For example, create diagnostic settings to send resource logs from Azure resources to the workspace. Configure data sources on the workspace to collect data from Log Analytics agents on virtual machines.

- See 


## Log queries
Data is retrieved from a Log Analytics workspace using a log query which is a read-only request to process data and return results. Log queries are written in Kusto Query Language (KQL), which is the query language used by Azure Data Explorer. 

- See [Log queries in Azure Monitor](log-query/../../log-query/log-query-overview.md) for a list of where log queries are used and references to tutorials and other documentation to get you started.


## Log Analytics
Use Log Analytics, which is a tool in the Azure portal to edit and run log queries and interactively analyze their results. You can then use the queries that you create to support other features in Azure Monitor such as log query alerts and workbooks. 

- See [Overview of Log Analytics in Azure Monitor](/log-query/log-analytics-overview.md) for a description of Log Analytics. 
- See [Log Analytics tutorial](/log-query/log-analytics-tutorial.md) to walk through using Log Analytics features to create a simple log query and analyze its results.



## Relationship to Azure Data Explorer
Azure Monitor Logs is based on Azure Data Explorer. A Log Analytics workspace is roughly the equivalent of a database in Azure Data Explorer, tables are structured the same, and both use the same Kusto Query Language (KQL). The experience of using Log Analytics to work with Azure Monitor queries in the Azure portal is similar to the experience using the Azure Data Explorer Web UI. You can even [include data from a Log Analytics workspace in an Azure Data Explorer query](/azure/data-explorer/query-monitor-data). 


## Next steps

- Learn about [log queries](../log-query/log-query-overview.md) to retrieve and analyze data from a Log Analytics workspace.
- Learn about [metrics in Azure Monitor](data-platform-metrics.md).
- Learn about the [monitoring data available](data-sources.md) for different resources in Azure.




## Parking lot

- that contains multiple tables that each store data from a particular source.