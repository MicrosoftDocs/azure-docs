---
title: Azure Monitor Log Analytics language reference | Microsoft Docs
description: Reference information for Kusto language used by Log Analytics. Includes additional elements specific to Log Analytics and elements not supported in Log Analytics queries.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''
ms.assetid: 
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/25/2018
ms.author: bwren
ms.component: na
---

# Log Analytics query language reference
[Log Analytics queries](../log-analytics-queries.md) use the same query language and engine used by [Azure Data Explorer](/azure/data-explorer/). You can access the language reference and other details about the language from the following location: [Kusto language reference](/azure/kusto/query)



## Kusto elements not support in Log Analytics
While Log Analytics queries use an implementation of Kusto, there are some Kusto elements it does not support as described in the following sections.

### Statements not supported in Log Analytics

* [Alias](/kusto/query/aliasstatement)
* [Query parameters](/azure/kusto/query/queryparametersstatement)

### Functions not supported in Log Analytics

* [cluster()](/azure/kusto/query/clusterfunction)
* [cursor_after()](/azure/kusto/query/cursorafterfunction)
* [cursor_before_or_at()](/azure/kusto/query/cursorbeforeoratfunction)
* [cursor_current(), current_cursor()](/azure/kusto/query/cursorcurrent)
* [database()](/azure/kusto/query/databasefunction)
* [current_principal()](/azure/kusto/query/current-principalfunction)
* [extent_id()](/azure/kusto/query/extentidfunction)
* [extent_tags()](/azure/kusto/query/extenttagsfunction)

### Operators not supported in Log Analytics

* [Cross-Cluster Join](/azure/kusto/query/joincrosscluster)
* [externaldata operator](/azure/kusto/query/externaldata-operator)

### Plugins not supported in Log Analytics

* [sql_request plugin](/azure/kusto/query/sqlrequestplugin)


## Additional operators in Log Analytics
In order to support specific Log Analytics features, the following additional Kusto operators are provided that are not available outside of Log Analytics. 

* [app()](app-expression.md)
* [workspace()](workspace-expression.md)

## Next steps

- Read about queries in [Log Analytics](../log-analytics-queries.md).
- Walk through a lesson on writing on a [Log Analytics query](/log-analytics/query-language/get-started-queries.md).
- Access the complete [reference documentation for Kusto](/azure/kusto/query/).