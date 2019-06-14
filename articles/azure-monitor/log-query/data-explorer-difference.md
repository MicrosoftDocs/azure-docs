---
title: Azure Monitor log query language differences | Microsoft Docs
description: Reference information for Kusto query language used by Azure Monitor. Includes additional elements specific to Azure Monitor and elements not supported in Azure Monitor log queries.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''
ms.assetid: 
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 10/31/2018
ms.author: bwren
---

# Azure Monitor log query language differences

While [logs in Azure Monitor](log-query-overview.md) is built on [Azure Data Explorer](/azure/data-explorer) and uses the same [Kusto query language](/azure/kusto/query), the version of the language does have some differences. This article identifies elements that are different between the version of the language used for Data Explorer and the version used for Azure Monitor log queries.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-log-analytics-rebrand.md)]

## KQL elements not supported in Azure Monitor
The following sections describe elements of the Kusto query language that aren't supported by Azure Monitor.

### Statements not supported in Azure Monitor

* [Alias](/azure/kusto/query/aliasstatement)
* [Query parameters](/azure/kusto/query/queryparametersstatement)

### Functions not supported in Azure Monitor

* [cluster()](/azure/kusto/query/clusterfunction)
* [cursor_after()](/azure/kusto/query/cursorafterfunction)
* [cursor_before_or_at()](/azure/kusto/query/cursorbeforeoratfunction)
* [cursor_current(), current_cursor()](/azure/kusto/query/cursorcurrent)
* [database()](/azure/kusto/query/databasefunction)
* [current_principal()](/azure/kusto/query/current-principalfunction)
* [extent_id()](/azure/kusto/query/extentidfunction)
* [extent_tags()](/azure/kusto/query/extenttagsfunction)

### Operators not supported in Azure Monitor

* [Cross-Cluster Join](/azure/kusto/query/joincrosscluster)
* [externaldata operator](/azure/kusto/query/externaldata-operator)

### Plugins not supported in Azure Monitor

* [sql_request plugin](/azure/kusto/query/sqlrequestplugin)


## Additional operators in Azure Monitor
The following operators support specific Azure Monitor features and are not available outside of Azure Monitor.

* [app()](app-expression.md)
* [workspace()](workspace-expression.md)

## Next steps

- Get references to different [resources for writing Azure Monitor log queries](query-language.md).
- Access the complete [reference documentation for Kusto query language](/azure/kusto/query/).
