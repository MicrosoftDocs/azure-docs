---
title: Azure Monitor Logs
description: Describes Azure Monitor Logs which are used for advanced analysis of monitoring data.
documentationcenter: ''
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.date: 10/22/2020
ms.author: bwren
---

# Azure Monitor Logs overview
Azure Monitor Logs is a feature of Azure Monitor that collects and organizes log and performance data from [monitored resources](../monitor-reference.md). Data from different sources such as [platform logs](../essentials/platform-logs-overview.md) from Azure services, log and performance data from [virtual machines agents](../agents/agents-overview.md), and usage and performance data from [applications](../app/app-insights-overview.md) can be consolidated into a single workspace so they can be analyzed together using a sophisticated query language that's capable of quickly analyzing millions of records. You may perform a simple query that just retrieves a specific set of records or perform sophisticated data analysis to identify critical patterns in your monitoring data. Work with log queries and their results interactively using Log Analytics, use them in an alert rules to be proactively notified of issues, or visualize their results in a workbook or dashboard.

> [!NOTE]
> Azure Monitor Logs is one half of the data platform supporting Azure Monitor. The other is [Azure Monitor Metrics](../essentials/data-platform-metrics.md) which stores numeric data in a time-series database. This makes this data more lightweight than data in Azure Monitor Logs and capable of supporting near real-time scenarios making them particularly useful for alerting and fast detection of issues. Metrics though can only store numeric data in a particular structure, while Logs can store a variety of different data types each with their own structure. You can also perform complex analysis on Logs data using log queries which cannot be used for analysis of Metrics data.


## What can you do with Azure Monitor Logs?
The following table describes some of the different ways that you can use Logs in Azure Monitor:

|  | Description |
|:---|:---|
| **Analyze** | Use [Log Analytics](./log-analytics-tutorial.md) in the Azure portal to write [log queries](./log-query-overview.md) and interactively analyze log data using a powerful analysis engine |
| **Alert** | Configure a [log alert rule](../alerts/alerts-log.md) that sends a notification or takes [automated action](../alerts/action-groups.md) when the results of the query match a particular result. |
| **Visualize** | Pin query results rendered as tables or charts to an [Azure dashboard](../../azure-portal/azure-portal-dashboards.md).<br>Create a [workbook](../visualize/workbooks-overview.md) to combine with multiple sets of data in an interactive report. <br>Export the results of a query to [Power BI](../visualize/powerbi.md) to use different visualizations and share with users outside of Azure.<br>Export the results of a query to [Grafana](../visualize/grafana-plugin.md) to leverage its dashboarding and combine with other data sources.|
| **Insights** | Support [insights](../monitor-reference.md#insights-and-core-solutions) that provide a customized monitoring experience for particular applications and services.  |
| **Retrieve** | Access log query results from a command line using [Azure CLI](/cli/azure/monitor/log-analytics).<br>Access log query results from a command line using [PowerShell cmdlets](/powershell/module/az.operationalinsights).<br>Access log query results from a custom application using [REST API](https://dev.loganalytics.io/). |
| **Export** | Configure [automated export of log data](./logs-data-export.md) to Azure storage account or Azure Event Hubs.<br>Build a workflow to retrieve log data and copy it to an external location using [Logic Apps](./logicapp-flow-connector.md). |

![Logs overview](media/data-platform-logs/logs-overview.png)


## Data collection
Once you create a Log Analytics workspace, you must configure different sources to send their data. No data is collected automatically. This configuration will be different depending on the data source. For example, [create diagnostic settings](../essentials/diagnostic-settings.md) to send resource logs from Azure resources to the workspace. [Enable VM insights](../vm/vminsights-enable-overview.md) to collect data from virtual machines. Configure [data sources on the workspace](../agents/data-sources.md) to collect additional events and performance data.

- See [What is monitored by Azure Monitor?](../monitor-reference.md) for a complete list of data sources that you can configure to send data to Azure Monitor Logs.


## Log Analytics workspaces
Data collected by Azure Monitor Logs is stored in one or more [Log Analytics workspaces](./design-logs-deployment.md). The workspace defines the geographic location of the data, access rights defining which users can access data, and configuration settings such as the pricing tier and data retention.  

You must create at least one workspace to use Azure Monitor Logs. A single workspace may be sufficient for all of your monitoring data, or may choose to create multiple workspaces depending on your requirements. For example, you might have one workspace for your production data and another for testing. 

- See [Create a Log Analytics workspace in the Azure portal](./quick-create-workspace.md) to create a new workspace.
- See [Designing your Azure Monitor Logs deployment](design-logs-deployment.md) on considerations for creating multiple workspaces.

## Data structure
Log queries retrieve their data from a Log Analytics workspace. Each workspace contains multiple tables are that are organized into separate columns with multiple rows of data. Each table is defined by a unique set of columns that are shared by the rows of data provided by the data source. 

[![Azure Monitor Logs structure](media/data-platform-logs/logs-structure.png)](media/data-platform-logs/logs-structure.png#lightbox)


Log data from Application Insights is also stored in Azure Monitor Logs, but it's stored different depending on how your application is configured. For a workspace-based application, data is stored in a Log Analytics workspace in a standard set of tables to hold data such as application requests, exceptions, and page views. Multiple applications can use the same workspace. For a classic application, the data is not stored in a Log Analytics workspace. It uses the same query language, and you create and run queries using the same Log Analytics tool in the Azure portal. Data for classic applications though is stored separately from each other. Its general structure is the same as workspace-based applications although the table and column names are different. See [Workspace-based resource changes](../app/apm-tables.md) for a detailed comparison of the schema for workspace-based and classic applications.


> [!NOTE]
> We still provide full backwards compatibility for your Application Insights classic resource queries, workbooks, and log-based alerts within the Application Insights experience. To query/view against the [new workspace-based table structure/schema](../app/apm-tables.md) you must first navigate to your Log Analytics workspace. During the preview, selecting **Logs** from within the Application Insights panes will give you access to the classic Application Insights query experience. See [Query scope](./scope.md) for more details.


[![Azure Monitor Logs structure for Application Insights](media/data-platform-logs/logs-structure-ai.png)](media/data-platform-logs/logs-structure-ai.png#lightbox)


## Log queries
Data is retrieved from a Log Analytics workspace using a log query which is a read-only request to process data and return results. Log queries are written in [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/), which is the same query language used by Azure Data Explorer. You can write log queries in Log Analytics to interactively analyze their results, use them in alert rules to be proactively notified of issues, or include their results in workbooks or dashboards. Insights include prebuilt queries to support their views and workbooks.

- See [Log queries in Azure Monitor](./log-query-overview.md) for a list of where log queries are used and references to tutorials and other documentation to get you started.

![Log Analytics](media/data-platform-logs/log-analytics.png)

## Log Analytics
Use Log Analytics, which is a tool in the Azure portal, to edit and run log queries and interactively analyze their results. You can then use the queries that you create to support other features in Azure Monitor such as log query alerts and workbooks. Access Log Analytics from the **Logs** option in the Azure Monitor menu or from most other services in the Azure portal.

- See [Overview of Log Analytics in Azure Monitor](./log-analytics-overview.md) for a description of Log Analytics. 
- See [Log Analytics tutorial](./log-analytics-tutorial.md) to walk through using Log Analytics features to create a simple log query and analyze its results.



## Relationship to Azure Data Explorer
Azure Monitor Logs is based on Azure Data Explorer. A Log Analytics workspace is roughly the equivalent of a database in Azure Data Explorer, tables are structured the same, and both use the same Kusto Query Language (KQL). The experience of using Log Analytics to work with Azure Monitor queries in the Azure portal is similar to the experience using the Azure Data Explorer Web UI. You can even [include data from a Log Analytics workspace in an Azure Data Explorer query](/azure/data-explorer/query-monitor-data). 


## Next steps

- Learn about [log queries](./log-query-overview.md) to retrieve and analyze data from a Log Analytics workspace.
- Learn about [metrics in Azure Monitor](../essentials/data-platform-metrics.md).
- Learn about the [monitoring data available](../agents/data-sources.md) for different resources in Azure.