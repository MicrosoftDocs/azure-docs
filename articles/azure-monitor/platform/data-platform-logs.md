---
title: Logs in Azure Monitor | Microsoft Docs
description: Describes logs in Azure Monitor, which are used for advanced analysis of monitoring data.
documentationcenter: ''
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.date: 09/09/2020
ms.author: bwren
---

# Azure Monitor Logs overview
Azure Monitor Logs is a feature of Azure Monitor that collects and organizes log data from a variety of sources and makes it available for analysis using a sophisticated query language. Data from different sources can be consolidated into a single workspace and analyzed together to perform such tasks and trending analysis, alerting, and visualization.

## Relationship to Azure Monitor Metrics
[Azure Monitor Metrics](data-platform-metrics.md) stores numeric data in a time-series database, which makes this data more lightweight than Azure Monitor Logs and capable of supporting near real-time scenarios making them particularly useful for alerting and fast detection of issues. Metrics though can only store numeric data in a particular structure, while Logs can store a variety of different data types each with their own structure. You can also perform complex analysis on Logs data using log queries which cannot be used for analysis of Metrics data.

![Azure Monitor overview](media/data-platform/overview.png)

Numeric data is often sent from data sources to Logs in addition to Metrics. While there is an additional charge for collecting and retaining this data in Logs, it allows you to include metric data in log queries and analyze it with your other monitoring data.


## Relationship to Azure Data Explorer
Azure Monitor Logs is based on Azure Data Explorer. A Log Analytics workspace is roughly the equivalent of a database in Azure Data Explorer, tables are structured the same, and both use the same Kusto Query Language (KQL). The experience of using Log Analytics to work with Azure Monitor queries in the Azure portal is similar to the experience using the Azure Data Explorer Web UI. You can even [include data from a Log Analytics workspace in an Azure Data Explorer query](/azure/data-explorer/query-monitor-data). 


## Structure of data
Data collected by Azure Monitor Logs is stored in a [Log Analytics workspace](./design-logs-deployment.md) that contains multiple tables that each store data from a particular source. The workspace defines the geographic location of the data, access rights defining which users can access data, and configuration settings such as the pricing tier and data retention. You may use a single workspace for all of your monitoring data or create multiple workspaces depending on your requirements. See [Designing your Azure Monitor Logs deployment](design-logs-deployment.md) on considerations for creating multiple workspaces.

Each workspace contains multiple tables are that are organized into separate columns with multiple rows of data. Each table is defined by a unique set of columns that are shared by the rows of data provided by the data source. 

[![Azure Monitor Logs structure](media/data-platform-logs/logs-structure.png)](media/data-platform-logs/logs-structure.png#lightbox)


Log data from Application Insights is also stored in Azure Monitor Logs, but it's stored different depending on how your application is configured. For a workspace-based application, data is stored in a Log Analytics workspace in a standard set of tables to hold data such as application requests, exceptions, and page views. Multiple applications can use the same workspace. For a classic application, the data is not stored in a Log Analytics workspace. It uses the same query language, and you create and run queries using the same Log Analytics tool in the Azure portal. Data for classic applications though is stored separately from each other. Its general structure is the same as workspace-based applications although the table and column names are different. 


> [!NOTE]
> We still provide full backwards compatibility for your Application Insights classic resource queries, workbooks, and log-based alerts within the Application Insights experience. To query/view against the [new workspace-based table structure/schema](../app/apm-tables.md) you must first navigate to your Log Analytics workspace. During the preview, selecting **Logs** from within the Application Insights panes will give you access to the classic Application Insights query experience. See [Query scope](../log-query/scope.md) for more details.


[![Azure Monitor Logs structure for Application Insights](media/data-platform-logs/logs-structure-ai.png)](media/data-platform-logs/logs-structure-ai.png#lightbox)

- See [Workspace-based resource changes](../app/apm-tables.md) for a detailed comparison of the schema for workspace-based and classic applications.

## Log queries
Data is retrieved from a Log Analytics workspace using a log query which is a read-only request to process data and return results. Areas in Azure Monitor where you will use queries include the following:

- [Log Analytics](../log-query/log-analytics-overview.md) is the primary tool in the Azure portal for editing log queries and interactively analyzing their results. Even if you intend to use a log query elsewhere in Azure Monitor, you'll typically write and test it in Log Analytics before copying it to its final location.
- [Log alert rules](../platform/alerts-overview.md) proactively identify issues from data in your workspace.  Each alert rule is based on a log query that is automatically run at regular intervals.  The results are inspected to determine if an alert should be created.
- [Azure Dashboards](../learn/tutorial-logs-dashboards.md).** Pin the results of any query into an Azure dashboard which allow you to visualize log and metric data together and optionally share with other Azure users.
- [Export to Azure storage]()  When you import log data from Azure Monitor into Excel or [Power BI](../platform/powerbi.md), you create a log query to define the data to export.
- **PowerShell.** You can run a PowerShell script from a command line or an Azure Automation runbook that uses [Get-AzOperationalInsightsSearchResults](/powershell/module/az.operationalinsights/get-azoperationalinsightssearchresult) to retrieve log data from Azure Monitor.  This cmdlet requires a query to determine the data to retrieve.
- [Azure Monitor Logs API](https://dev.loganalytics.io) allows any REST API client to retrieve log data from the workspace.  The API request includes a query that is run against Azure Monitor to determine the data to retrieve.

Log queries are written in Kusto Query Language (KQL), which is the query language used by Azure Data Explorer. 

- See [Kusto Query Language reference](/azure/data-explorer/kusto/query/)
- See [KQL Tutorial](/azure/data-explorer/kusto/query/tutorial?pivots=azuremonitor) for a tutorial writing log queries.


## Log Analytics
Use Log Analytics, which is a tool in the Azure portal to edit and run log queries and interactively analyze their results. You can then use the queries that you create to support other features in Azure Monitor such as log query alerts and workbooks.

- See [Overview of Log Analytics in Azure Monitor](../log-query/log-analytics-overview.md) for a description of Log Analytics and a short tour of its interface.
- See [Log Analytics tutorial](../log-query/log-analytics-tutorial.md) for a tutorial using Log Analytics.



## Sources of data for Azure Monitor Logs
Azure Monitor collects log data from a variety of sources including resources in Azure Monitor and agents running in virtual machines. 

- See [What is monitored by Azure Monitor?](../monitor-reference.md) for a complete list of data sources that send data to a Log Analytics workspace.



## Next steps

- Learn about [log queries](../log-query/log-query-overview.md) to retrieve and analyze data from a Log Analytics workspace.
- Learn about [metrics in Azure Monitor](data-platform-metrics.md).
- Learn about the [monitoring data available](data-sources.md) for different resources in Azure.

