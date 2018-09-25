---
title: Azure Monitor Log Analytics and Kusto language differences | Microsoft Docs
description: Describes differences between Log Analytics queries and core Kusto language.
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

# Log Analytics and Kusto language differences
[Log Analytics queries](../log-analytics/log-analytics-queries.md) are written with the [Kusto language](/azure/kusto/query). There are some differences from the standard language and the Log Analytics implementation though as described in this article.


## Statements not supported in Log Analytics
The following statements are not supported in Log Analytics.

* [Alias](/kusto/query/aliasstatement)
* [Query parameters](/azure/kusto/query/queryparametersstatement)

## Functions not supported in Log Analytics
The following functions are not supported in Log Analytics.

* [cluster()](/azure/kusto/query/clusterfunction)
* [cursor_after()](/azure/kusto/query/cursorafterfunction)
* [cursor_before_or_at()](/azure/kusto/query/cursorbeforeoratfunction)
* [cursor_current(), current_cursor()](/azure/kusto/query/cursorcurrent)
* [database()](/azure/kusto/query/databasefunction)
* [current_principal()](/azure/kusto/query/current-principalfunction)
* [extent_id()](/azure/kusto/query/extentidfunction)
* [extent_tags()](/azure/kusto/query/extenttagsfunction)

## Operators not supported in Log Analytics
The following operators are not supported in Log Analytics.

* [Cross-Cluster Join](/azure/kusto/query/joincrosscluster)
* [externaldata operator](/azure/kusto/query/externaldata-operator)

## Plugins not supported in Log Analytics
The following plugins are not supported in Log Analytics.
* [sql_request plugin](/azure/kusto/query/sqlrequestplugin)


## Log Analytics specific operators
* [app()](../log-analytics/query-language/app-expression.md)
* [workspace()](../log-analytics/query-language/workspace-expression.md)

## Next steps

- Read about queries in [Log Analytics](../log-analytics/log-analytics-queries.md).
- Walk through a lesson on writing on a [Log Analytics query](/log-analytics/query-language/get-started-queries.md).
- Access the complete [reference documentation for Kusto](/azure/kusto/query/).