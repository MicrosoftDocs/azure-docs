---
title: Azure Monitor Log Analytics language reference | Microsoft Docs
description: Reference information for Data Explorer query language used by Log Analytics. Includes additional elements specific to Log Analytics and elements not supported in Log Analytics queries.
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
ms.date: 10/31/2018
ms.author: bwren
ms.component: na
---

# Log Analytics query language differences

While [Log Analytics](../log-analytics-queries.md) is built on [Azure Data Explorer](/azure//data-explorer) and uses the [same query language](/azure/kusto/query), the version of the language does have some differences. This article identifies elements that are different between the version of the language used for Data Explorer and the version used for Log Analytics queries.

## Data Explorer elements not supported in Log Analytics
The following sections describe elements of the Data Explorer query language that aren't supported by Log Analytics.

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
The following operators support specific Log Analytics features and are not available outside of Log Analytics.

* [app()](app-expression.md)
* [workspace()](workspace-expression.md)

## Next steps

- Get references to different [resources for writing Log Analytics queries](query-language.md).
- Access the complete [reference documentation for Data Explorer query language](/azure/kusto/query/).
