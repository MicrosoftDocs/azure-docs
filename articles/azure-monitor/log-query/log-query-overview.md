---
title: Overview of log queries in Azure Monitor | Microsoft Docs
description: You require a log query to retrieve log data from Azure Monitor.  This article describes how new log queries are used in Azure Monitor and provides concepts that you need to understand before creating one.
services: log-analytics
author: bwren
ms.service: log-analytics
ms.topic: conceptual
ms.date: 01/10/2019
ms.author: bwren
---

# Overview of log queries in Azure Monitor
A _log query_ in Azure Monitor is a read only request to retrieve and process data from [Azure Monitor Logs](../platform/data-platform-logs.md). Some features in Azure Monitor such as [insights](../insights/insights-overview.md) and [solutions](../insights/solutions-inventory.md) process log data without exposing you to the underlying queries. To fully leverage other features of Azure Monitor, you should understand how queries are constructed and how you can use them to interactively analyze data in Azure Monitor Logs. 

This article includes a brief overview and answers to common questions about log queries in Azure Monitor. Links are provided to other documentation that provide further details and lessons for constructing log queries to meet different requirements.

For a tutorial on log queries, see [Get started with log queries in Azure Monitor](get-started-queries.md).


## What is Log Analytics?
Log Analytics is the primary tool that you'll use in the Azure portal for writing log queries and interactively analyzing their results. Even if a log query is used elsewhere in Azure Monitor, you'll typically write and test the query first using Log Analytics.

You can start Log Analytics from several places in the Azure portal. The scope of the data available to Log Analytics is determined by how you start it. See [Query Scope](#query-scope) for more details.

- Select **Logs** from the **Azure Monitor** menu.
- Select **Logs** from the **Log Analytics workspaces** menu.
- Select **Analytics** from the **Overview** page of an Application Insights application.
- Select **Logs** from the menu of an Azure resource.

For a tutorial walkthrough of Log Analytics that introduces several of its features, see [Get started with Log Analytics in Azure Monitor](get-started-portal.md).

![Log Analytics](media/portals/log-analytics.png)


## Where are log queries used?
In addition to Log Analytics, areas in Azure Monitor where you will use queries include the following:

- **Alert rules.** [Alert rules](../platform/alerts-overview.md) proactively identify issues from data in your workspace.  Each alert rule is based on a log search that is automatically run at regular intervals.  The results are inspected to determine if an alert should be created.
- **Dashboards.** You can pin the results of any query into an [Azure dashboard](../learn/tutorial-logs-dashboards.md) which allow you to visualize log and metric data together and optionally share with other Azure users. 
- **Views.**  You can create visualizations of data to be included in user dashboards with [View Designer](../platform/view-designer.md).  Log queries provide the data used by [tiles](../platform/view-designer-tiles.md) and [visualization parts](../platform/view-designer-parts.md) in each view.  
- **Export.**  When you import log data from Azure Monitor into Excel or [Power BI](../platform/powerbi.md), you create a log query to define the data to export.
- **PowerShell.** You can run a PowerShell script from a command line or an Azure Automation runbook that uses [Get-AzOperationalInsightsSearchResults](/powershell/module/az.operationalinsights/get-azoperationalinsightssearchresult) to retrieve log data from Azure Monitor.  This cmdlet requires a query to determine the data to retrieve.
- **Azure Monitor Logs API.**  The [Azure Monitor Logs API](../platform/alerts-overview.md) allows any REST API client to retrieve log data from the workspace.  The API request includes a query that is run against Azure Monitor to determine the data to retrieve.

## What language do log queries use?
Azure Monitor Logs is based on [Azure Data Explorer](/azure/data-explorer), and log queries are written using the same Kusto query language (KQL). Refer to the [Azure Data Explorer KQL documentation](/azure/kusto/query) for reference, but note [Azure Monitor log query language differences](data-explorer-difference.md) for minor differences in Azure Monitor.


## How do I write a query?
Since Azure Monitor Logs is based on [Azure Data Explorer](/azure/data-explorer/), log queries are written using [Kusto Query Language (KQL)](/azure/kusto/query/)




A query could be as simple as a single table name for retrieving all records from that table:

```Kusto
Syslog
```

Or it could 


Azure Monitor uses [a version of the Kusto query language](get-started-queries.md) to retrieve and analyze log data in a variety of ways.  You'll typically start with basic queries and then progress to use more advanced functions as your requirements become more complex.

For example, suppose you wanted to find the top ten computers with the most error events over the past day.

```Kusto
Event
| where (EventLevelName == "Error")
| where (TimeGenerated > ago(1days))
| summarize ErrorCount = count() by Computer
| top 10 by ErrorCount desc
```

Or maybe you want to find computers that haven't had a heartbeat in the last day.

```Kusto
Heartbeat
| where TimeGenerated > ago(7d)
| summarize max(TimeGenerated) by Computer
| where max_TimeGenerated < ago(1d)  
```

How about a line chart with the processor utilization for each computer from last week?

```Kusto
Perf
| where ObjectName == "Processor" and CounterName == "% Processor Time"
| where TimeGenerated  between (startofweek(ago(7d)) .. endofweek(ago(7d)) )
| summarize avg(CounterValue) by Computer, bin(TimeGenerated, 5min)
| render timechart    
```

You can see from these quick samples that regardless of the kind of data that you're working with, the structure of the query is similar.  You can break it down into distinct steps where the resulting data from one command is sent through the pipeline to the next command.

You can also query data across Log Analytics workspaces within your subscription.

```Kusto
union Update, workspace("contoso-workspace").Update
| where TimeGenerated >= ago(1h)
| summarize dcount(Computer) by Classification 
```

## How do I get started?
Start with the tutorials [Get started with Log Anlaytics in Azure Monitor](get-started-portal.md) [Get started with log queries in Azure Monitor](get-started-queries.md). These will introduce you to the basic features and operation of Log Analytics and the basic structure of a query. You can walkthrough these tutorials using data in your own environment, or use our demo environment that includes test data.

Once you've completed the tutorials, look through the other lessons and examples in this documentation to learn more complex queries.

## What data is available in log queries?
All data collected in Azure Monitor Logs is available to retrieve and analyze in log queries. Different data sources will write their data to different tables, but you can include multiple tables in a single query to analyze data across multiple data sources. For a list of different data sources that populate Azure Monitor Logs, see [Sources of Azure Monitor Logs](../platform/data-platform-logs.md#sources-of-azure-monitor-logs). To understand how data from different sources is structured, see []().

## How is data organized in Azure Monitor Logs?
Most data in Azure Monitor Logs is stored in a Log Analytics workspace. You can create one or more workspaces depending on your requirements.

[Data Sources](../platform/data-sources.md) such as Activity Logs and Diagnostic logs from Azure resources, agents on virtual machines, and data from insights and monitoring solutions will write data to one or more workspaces. Different kinds of data are stored in different tables in the portal, and each table has its own set of properties. New tables may be added to the workspaces as new data sources are configured to write to it.




When you build a query, you start by determining which tables have the data that you're looking for. Different kinds of data are separated into dedicated tables in each [Log Analytics workspace](../learn/quick-create-workspace.md).  Documentation for different data sources includes the name of the data type that it creates and a description of each of its properties.  Many queries will only require data from a single table, but others may use a variety of options to include data from multiple tables.

While [Application Insights](../app/app-insights-overview.md) stores application data such as requests, exceptions, traces, and usage in Azure Monitor logs, this data is stored in a different partition than the other log data. You use the same query language to access this data but must use the [Application Insights console](../app/analytics.md) or [Application Insights REST API](https://dev.applicationinsights.io/) to access it. You can use [cross-resources queries](../log-query/cross-workspace-query.md) to combine Application Insights data with other log data in Azure Monitor.


![Tables](media/log-query-overview/queries-tables.png)




## Next steps
- Learn about using [Log Analytics to create and edit log searches](../log-query/portals.md).
- Check out a [tutorial on writing queries](../log-query/get-started-queries.md) using the new query language.
