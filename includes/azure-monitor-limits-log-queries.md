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
| Query language | Azure Monitor uses the same [Kusto query language](/azure/kusto/query/) as Azure Data Explorer. See [Azure Monitor log query language differences](../articles/azure-monitor/log-query/data-explorer-difference.md) for KQL language elements not supported in Azure Monitor. |
| Azure regions | Log queries can experience excessive overhead when data spans Log Analytics workspaces in multiple Azure regions. See [Query limits](../articles/azure-monitor/log-query/scope.md#query-limits) for details. |
| Cross resource queries | Maximum number of Application Insights resources and Log Analytics workspaces in a single query limited to 100.<br>Cross-resource query is not supported in View Designer.<br>Cross-resource query in log alerts is supported in the new scheduledQueryRules API.<br>See [Cross-resource query limits](../articles/azure-monitor/log-query/cross-workspace-query.md#cross-resource-query-limits) for details. |

### User query throttling
Azure Monitor has several throttling limits to protect against users sending an excessive number of queries. Such behavior can potentially overload the system backend resources and jeopardize service responsiveness. The following limits are designed to protect customers from interruptions and ensure consistent service level. The user throttling and limits are designed to impact only extreme usage scenario and should not be relevant for typical usage.


| Measure | Limit per user | Description |
|:---|:---|:---|
| Concurrent queries | 5 | If there are already 5 queries running for the user, any new queries are placed in a per-user concurrency queue. When one of the running queries ends, the next query will be pulled from the queue and started. This does not include queries from alert rules.
| Time in concurrency queue | 2.5 minutes | If a query sits in the queue for more than 2.5 minutes without being started, it will be terminated with an HTTP error response with code 429. |
| Total queries in concurrency queue | 40 | Once the number of queries in the queue reaches 40, any additional queries will by rejected with an HTTP error code 429. This number is in addition to the 5 queries that can be running simultaneously. |
| Query rate | 200 queries per 30 seconds | This is the overall rate that queries can be submitted by a single user to all workspaces.  This limit applies to programmatic queries or queries initiated by visualization parts such as Azure dashboards and the Log Analytics workspace summary page. |

- Optimize your queries as described in [Optimize log queries in Azure Monitor](../articles/azure-monitor/log-query/query-optimization.md).
- Dashboards and workbooks can contain multiple queries in a single view that generate a burst of queries every time they load or refresh. Consider breaking them up into multiple views that load on demand. 
- In Power BI, consider extracting only aggregated results rather than raw logs.