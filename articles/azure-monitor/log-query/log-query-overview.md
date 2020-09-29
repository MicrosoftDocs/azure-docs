---
title: Overview of Log Analytics in Azure Monitor
description: Answers common questions related to log queries and gets you started in using them.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/19/2019

---

# Overview of Log Analytics in Azure Monitor
[Azure Monitor Logs](../platform/data-platform-logs.md) stores monitoring data from all of your resources monitored by Azure Monitor. Log Analytics is the primary tool in Azure Monitor to create and run log queries to retrieve this data. You can use interactive tools in Log Analytics to analyze the results of log queries interactively or use the query to visualize results in a workbook or to create a log alert rule.


## Relationship to Azure Data Explorer
If you're already familiar with Azure Data Explorer, then Log Analytics should look familiar. That's because it's built on top of Azure Data Explorer and uses the same Kusto Query Language (KQL). There are some difference in the Azure Monitor flavor of the language that are noted in the [KQL reference](/azure/data-explorer/kusto/query/).

 
## What language do log queries use?
Azure Monitor Logs is based on [Azure Data Explorer](/azure/data-explorer), and log queries are written using the same Kusto query language (KQL). This is a rich language designed to be easy to read and author, and you should be able to start using it with minimal guidance.

See [Azure Data Explorer KQL documentation](/azure/kusto/query) for complete documentation on KQL and reference on different functions available.<br>
See [Get started with log queries in Azure Monitor](get-started-queries.md) for a quick walkthrough of the language using data from Azure Monitor Logs.
 See [Azure Monitor log query language differences](data-explorer-difference.md) for minor differences in the version of KQL used by Azure Monitor.

## What data is available to log queries?
All data collected in Azure Monitor Logs is available to retrieve and analyze in log queries. Different data sources will write their data to different tables, but you can include multiple tables in a single query to analyze data across multiple sources. When you build a query, you start by determining which tables have the data that you're looking for. See [Structure of Azure Monitor Logs](logs-structure.md) for an explanation of how the data is structured.




## What is Log Analytics?
Log Analytics is the primary tool in the Azure portal for writing log queries and interactively analyzing their results. Even if a log query is used elsewhere in Azure Monitor, you'll typically write and test the query first using Log Analytics.

You can start Log Analytics from several places in the Azure portal. The scope of the data available to Log Analytics is determined by how you start it. See [Query Scope](scope.md) for more details.

- Select **Logs** from the **Azure Monitor** menu or **Log Analytics workspaces** menu.
- Select **Logs** from the **Overview** page of an Application Insights application.
- Select **Logs** from the menu of an Azure resource.

![Log Analytics](media/log-query-overview/log-analytics.png)

See [Get started with Log Analytics in Azure Monitor](get-started-portal.md) for a tutorial walkthrough of Log Analytics that introduces several of its features.

## Where else are log queries used?
In addition to interactively working with log queries and their results in Log Analytics, areas in Azure Monitor where you will use queries include the following:

- **Alert rules.** [Alert rules](../platform/alerts-overview.md) proactively identify issues from data in your workspace.  Each alert rule is based on a log search that is automatically run at regular intervals.  The results are inspected to determine if an alert should be created.
- **Dashboards.** You can pin the results of any query into an [Azure dashboard](../learn/tutorial-logs-dashboards.md) which allow you to visualize log and metric data together and optionally share with other Azure users.
- **Views.**  You can create visualizations of data to be included in user dashboards with [View Designer](../platform/view-designer.md).  Log queries provide the data used by [tiles](../platform/view-designer-tiles.md) and [visualization parts](../platform/view-designer-parts.md) in each view.  
- **Export.**  When you import log data from Azure Monitor into Excel or [Power BI](../platform/powerbi.md), you create a log query to define the data to export.
- **PowerShell.** You can run a PowerShell script from a command line or an Azure Automation runbook that uses [Get-AzOperationalInsightsSearchResults](/powershell/module/az.operationalinsights/get-azoperationalinsightssearchresult) to retrieve log data from Azure Monitor.  This cmdlet requires a query to determine the data to retrieve.
- **Azure Monitor Logs API.**  The [Azure Monitor Logs API](https://dev.loganalytics.io) allows any REST API client to retrieve log data from the workspace.  The API request includes a query that is run against Azure Monitor to determine the data to retrieve.


## Next steps
- Walk through a [tutorial on using Log Analytics in the Azure portal](get-started-portal.md).
- Walk through a [tutorial on writing queries](get-started-queries.md).
