---
title: Analyze Log Analytics data in Azure Monitor | Microsoft Docs
description: You require a log search to retrieve any data from Log Analytics.  This article describes how new log searches are used in Log Analytics and provides concepts that you need to understand before creating one.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''

ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/05/2018
ms.author: bwren
ms.component: 
---

# Analyze Log Analytics data in Azure Monitor

Log data collected by Azure Monitor is stored in Log Analytics which collects telemetry and other data from a variety of sources and provides a query language for advanced analytics.

> [!NOTE]
> Log Analytics was previously treated as its own service in Azure. It is now considered a part of Azure Monitor and focuses on storage and analysis of log data using its query language. Features that were considered part of Log Analytics, such as Windows and Linux agents for data collection, views to visualize existing data, and alerts to proactively notify you of issues, have not changed but are now considered part of Azure Monitor.



## Log queries

You require a log query to retrieve any data from Log Analytics.  Whether you're [analyzing data in the portal](log-analytics-log-search-portals.md), [configuring an alert rule](../monitoring-and-diagnostics/monitor-alerts-unified-usage.md) to be notified of a particular condition, or retrieving data using the [Log Analytics API](https://dev.loganalytics.io/), you will use a query to specify the data you want.  This article describes how log queries are used in Log Analytics and provides concepts that should understand before creating one.



## Where log queries are used

The different ways that you will use queries in Log Analytics include the following:

- **Portals.** You can perform interactive analysis of log data in the [Azure portal](log-analytics-log-search-portals.md).  This allows you to edit your query and analyze the results in a variety of formats and visualizations.  
- **Alert rules.** [Alert rules](log-analytics-alerts.md) proactively identify issues from data in your workspace.  Each alert rule is based on a log search that is automatically run at regular intervals.  The results are inspected to determine if an alert should be created.
- **Dashboards.** You can pin the results of any query into an [Azure dashboard]() which allow you to visualize log and metric data together and optionally share with other Azure users. 
- **Views.**  You can create visualizations of data to be included in user dashboards with [View Designer](log-analytics-view-designer.md).  Log queries provide the data used by [tiles](log-analytics-view-designer-tiles.md) and [visualization parts](log-analytics-view-designer-parts.md) in each view.  
- **Export.**  When you import data from Log Analytics workspace into Excel or [Power BI](log-analytics-powerbi.md), you create a log query to define the data to export.
- **PowerShell.** You can run a PowerShell script from a command line or an Azure Automation runbook that uses [Get-​Azure​Rm​Operational​Insights​Search​Results](https://docs.microsoft.com/powershell/module/azurerm.operationalinsights/get-azurermoperationalinsightssearchresults?view=azurermps-4.0.0) to retrieve data from Log Analytics.  This cmdlet requires a query to determine the data to retrieve.
- **Log Analytics API.**  The [Log Analytics log search API](log-analytics-log-search-api.md) allows any REST API client to retrieve log data from the workspace.  The API request includes a query that is run against Log Analytics to determine the data to retrieve.

![Log searches](media/log-analytics-queries/queries-overview.png)

## Write a query
Log Analytics includes [an extensive query language](query-language/get-started-queries.md) that lets you retrieve and analyze log data in a variety of ways.  You'll typically start with basic queries and then progress to use more advanced functions as your requirements become more complex.

The basic structure of a query is a source table followed by a series of operators separated by a pipe character `|`.  You can chain together multiple operators to refine the data and perform advanced functions.

For example, suppose you wanted to find the top ten computers with the most error events over the past day.

	Event
	| where (EventLevelName == "Error")
	| where (TimeGenerated > ago(1days))
	| summarize ErrorCount = count() by Computer
	| top 10 by ErrorCount desc

Or maybe you want to find computers that haven't had a heartbeat in the last day.

	Heartbeat
	| where TimeGenerated > ago(7d)
	| summarize max(TimeGenerated) by Computer
	| where max_TimeGenerated < ago(1d)  

How about a line chart with the processor utilization for each computer from last week?

	Perf
	| where ObjectName == "Processor" and CounterName == "% Processor Time"
	| where TimeGenerated  between (startofweek(ago(7d)) .. endofweek(ago(7d)) )
	| summarize avg(CounterValue) by Computer, bin(TimeGenerated, 5min)
	| render timechart    

You can see from these quick samples that regardless of the kind of data that you're working with, the structure of the query is similar.  You can break it down into distinct steps where the resulting data from one command is sent through the pipeline to the next command.

You can also query data across Log Analytics workspaces within your subscription.

	union Update, workspace("contoso-workspace").Update
	| where TimeGenerated >= ago(1h)
	| summarize dcount(Computer) by Classification 

## How Log Analytics data is organized
When you build a query, you start by determining which tables have the data that you're looking for. Different kinds of data are separated into dedicated tables in each [Log Analytics workspace](log-analytics-quick-create-workspace.md).  Documentation for different data sources includes the name of the data type that it creates and a description of each of its properties.  Many queries will only require data from a single tables, but others may use a variety of options to include data from multiple tables.

While [Application Insights](../application-insights/app-insights-overview.md) stores application data such as requests, exceptions, traces, and usage in Log Analytics, this data is stored in a different partition than the other log data. You use the same query language to access this data but must the [Application Insights console](../application-insights/app-insights-analytics.md) or [Application Insights REST API](https://dev.applicationinsights.io/) to access it. You can use [cross-resources queries](log-analytics-cross-workspace-search.md) to combine Application Insights data with other data in Log Analytics.


![Tables](media/log-analytics-queries/queries-tables.png)







## Next steps

- Learn about the [portals that you use to create and edit log searches](log-analytics-log-search-portals.md).
- Check out a [tutorial on writing queries](log-analytics-tutorial-viewdata.md) using the new query language.
