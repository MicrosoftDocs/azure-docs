---
title: "include file" 
description: "include file" 
services: azure-monitor
author: rboucher
tags: azure-service-management
ms.topic: "include"
ms.date: 07/22/2019
ms.author: bwren
ms.custom: "include file"
---

### General query limits

| Limit | Description |
|:---|:---|
| Query language | Azure Monitor uses the same [Kusto Query Language (KQL)](/azure/kusto/query/) as Azure Data Explorer. See [Azure Monitor log query language differences](/azure/data-explorer/kusto/query/) for KQL language elements not supported in Azure Monitor. |
| Azure regions | Log queries can experience excessive overhead when data spans Log Analytics workspaces in multiple Azure regions. See [Query limits](../articles/azure-monitor/logs/scope.md#query-scope-limits) for details. |
| Cross resource queries | Maximum number of Application Insights resources and Log Analytics workspaces in a single query limited to 100.<br>Cross-resource query isn't supported in View Designer.<br>Cross-resource query in log alerts is supported in the new scheduledQueryRules API.<br>See [Cross-resource query limits](../articles/azure-monitor/logs/cross-workspace-query.md#cross-resource-query-limits) for details. |
| Log Analytics dashboard queries | Maximum number of records returned in a single Log Analytics dashboard query is 2,000. |

### User query throttling
Azure Monitor has several throttling limits to protect against users sending an excessive number of queries. Such behavior can potentially overload the system back-end resources and jeopardize service responsiveness. The following limits are designed to protect customers from interruptions and ensure consistent service level. The user throttling and limits are designed to affect only extreme usage scenarios and shouldn't be relevant for typical usage.

| Measure | Limit per user | Description |
|:---|:---|:---|
| Concurrent queries | 5 | A user can run up to five concurrent queries. Any other query is added to a queue. When one of the running queries finishes, the first query in the queue is pulled from the queue and starts running. Alert queries aren't part of this limit.
| Time in concurrency queue | 3 minutes | If a query sits in the queue for more than 3 minutes without being started, it's terminated with an HTTP error response with code 429. |
| Total queries in concurrency queue | 200 | When the number of queries in the queue reaches 200, the next query is rejected with an HTTP error code 429. This number is in addition to the five queries that can be running simultaneously. |
| Query rate | 200 queries per 30 seconds | Overall rate of queries that can be submitted by a single user to all workspaces. This limit applies to programmatic queries or queries initiated by visualization parts such as Azure dashboards and the Log Analytics workspace summary (deprecated) page. |

- Optimize your queries as described in [Optimize log queries in Azure Monitor](../articles/azure-monitor/logs/query-optimization.md).
- Dashboards and workbooks can contain multiple queries in a single view that generate a burst of queries every time they load or refresh. Consider breaking them up into multiple views that load on demand.
- In Power BI, consider extracting only aggregated results rather than raw logs.
