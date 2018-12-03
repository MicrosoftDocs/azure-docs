---
title: Azure Monitor Log Analytics query language | Microsoft Docs
description: References to resources for learning how to write queries in Log Analytics.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''
ms.assetid: 
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 10/29/2018
ms.author: bwren
---

# Log Analytics query language
Log Analytics provides log collection and analysis for Azure Monitor. It's built on Azure Data Explorer and uses a version of the same query language. The [Azure Data Explorer query language documentation](/azure/kusto/query) has all of the details for the language and should be your primary resource for writing Log Analytics queries. This page provides links to other resources for learning how to write queries and on differences with the Log Analytics implementation of the language.

## Getting started

- [Get started with Log Analytics in the Azure portal](get-started-portal.md) is a lesson for writing queries and working with results in the Azure portal.
-  [Get started with queries in Log Analytics](get-started-queries.md) is a lesson for writing queries using Log Analytics data.

## Concepts
- [Analyze Log Analytics data in Azure Monitor](../../azure-monitor/log-query/log-query-overview.md) gives a brief overview of log queries and describes how Log Analytics data is structured.
- [Viewing and analyzing data in Log Analytics](../../log-analytics/log-analytics-log-search-portals.md) explains the portals where you create and run Log Analytics queries.

## Reference

- [Query language reference](/azure/kusto/query)  is the complete language reference for the Data Explorer query language.
- [Log Analytics query language differences](data-explorer-difference.md) describes differences between versions of the Data Explorer query language.
- [Standard properties in Log Analytics records](../../log-analytics/log-analytics-standard-properties.md) describes properties that are standard to all Log Analytics data.
- [Perform cross-resource log searches in Log Analytics](../../log-analytics/log-analytics-cross-workspace-search.md) describes how to write queries that use data from multiple Log Analytics workspaces and Application Insights applications.


## Examples

- [Log Analytics query examples](examples.md) provides example queries using Log Analytics data.



## Lessons

- [Working with strings in Log Analytics queries](string-operations.md) describes how to work with string data.
- [Working with date time values in Log Analytics queries](datetime-operations.md) describes how to work with date and time data. 
- [Aggregations in Log Analytics queries](aggregations.md) and [Advanced aggregations in Log Analytics queries](advanced-aggregations.md) describe how to aggregate and summarize data.
- [Joins in Log Analytics queries](joins.md) describes how to join data from multiple tables.
- [Working with JSON and data Structures in Log Analytics queries](json-data-structures.md) describes how to parse json data.
- [Writing advanced queries in Log Analytics](advanced-query-writing.md) describes strategies for creating complex queries and reusing code.
- [Creating charts and diagrams from Log Analytics queries](charts.md) describes how to visualize data from a query.

## Cheatsheets

-  [SQL to Log Analytics query language cheat sheet](sql-cheatsheet.md) assists users who are already familiar with SQL.
-  [Splunk to Log Analytics query language cheat sheet](sql-cheatsheet.md) assists users who are already familiar with Splunk.
 
## Next steps

- Access the complete [reference documentation for the Data Explorer query language](/azure/kusto/query/).