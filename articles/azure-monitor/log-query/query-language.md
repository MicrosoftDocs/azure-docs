---
title: Azure Monitor log queries | Microsoft Docs
description: References to resources for learning how to write log queries in Azure Monitor.
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
ms.date: 01/11/2019
ms.author: bwren
---

# Azure Monitor log queries
Azure Monitor logs are built on Azure Data Explorer, and Azure Monitor log queries use a version of the same Kusto query language. The [Kusto query language documentation](/azure/kusto/query) has all of the details for the language and should be your primary resource for writing Azure Monitor log queries. This page provides links to other resources for learning how to write queries and on differences with the Azure Monitor implementation of the language.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-log-analytics-rebrand.md)]

## Getting started

- [Get started with Azure Monitor Log Analytics](get-started-portal.md) is a lesson for writing queries and working with results in the Azure portal.
- [Get started with Azure Monitor log queries](get-started-queries.md) is a lesson for writing queries using Azure Monitor log data.

## Concepts
- [Analyze log data in Azure Monitor](../../azure-monitor/log-query/log-query-overview.md) gives a brief overview of log queries and describes how Azure Monitor log data is structured.
- [Viewing and analyzing log data in Azure Monitor](../../azure-monitor/log-query/portals.md) explains the portals where you create and run log queries.

## Reference

- [Query language reference](/azure/kusto/query)  is the complete language reference for the Kusto query language.
- [Azure Monitor log query language differences](data-explorer-difference.md) describes differences between versions of the Kusto query language.
- [Standard properties in Azure Monitor log records](../../azure-monitor/platform/log-standard-properties.md) describes properties that are standard to all Azure Monitor log data.
- [Perform cross-resource log queries in Azure Monitor](../../azure-monitor/log-query/cross-workspace-query.md) describes how to write log queries that use data from multiple Log Analytics workspaces and Application Insights applications.


## Examples

- [Azure Monitor log query examples](examples.md) provides example queries using Azure Monitor log data.



## Lessons

- [Working with strings in Azure Monitor log queries](string-operations.md) describes how to work with string data.
- [Working with date time values in Azure Monitor log queries](datetime-operations.md) describes how to work with date and time data. 
- [Aggregations in Azure Monitor log queries](aggregations.md) and [Advanced aggregations in Azure Monitor log queries](advanced-aggregations.md) describe how to aggregate and summarize data.
- [Joins in Azure Monitor log queries](joins.md) describes how to join data from multiple tables.
- [Working with JSON and data Structures in Azure Monitor log queries](json-data-structures.md) describes how to parse json data.
- [Writing advanced log queries in Azure Monitor](advanced-query-writing.md) describes strategies for creating complex queries and reusing code.
- [Creating charts and diagrams from Azure Monitor log queries](charts.md) describes how to visualize data from a log query.

## Cheatsheets

-  [SQL to Azure Monitor log query](sql-cheatsheet.md) assists users who are already familiar with SQL.
-  [Splunk to Azure Monitor log query](splunk-cheatsheet.md) assists users who are already familiar with Splunk.
 
## Next steps

- Access the complete [reference documentation for the Kusto query language](/azure/kusto/query/).
