---
title: Query Store best practices in Azure Database for PostgreSQL
description: This article describes best practices for the Query Store in Azure Database for PostgreSQL.
services: postgresql
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/26/2018
---

# Best practices for Query Store

**Applies to:** Azure Database for PostgreSQL 9.6 and 10

> [!IMPORTANT]
> The Query Store feature is in Public Preview in a limited number of regions.


This article outlines best practices for using Query Store in Azure Database for PostgreSQL.

## Set the optimal query capture mode
Let Query Store capture the data that matters to you. 

|**pg_qs.query_capture_mode** |	**Scenario**|
|---|---|
|_All_	|Analyze your workload thoroughly in terms of all queries and their execution frequencies and other statistics. Identify new queries in your workload. Detect if ad-hoc queries are used to identify opportunities for user or auto parameterization. _All_ comes with an increased resource consumption cost. |
|_Top_	|Focus your attention on top queries - those issued by clients.
|_None_	|You've already captured a query set and time window that you want to investigate and you want to eliminate the distractions that other queries may introduce. _None_ is suitable for testing and bench-marking environments. _None_ should be used with caution as you might miss the opportunity to track and optimize important new queries. You can't recover data on those past time windows. |

Query Store also includes a store for wait statistics. There is an additional capture mode query that governs wait statistics: **pgms_wait_sampling.query_capture_mode** can be set to _none_ or _all_. 

> [!NOTE] 
> **pg_qs.query_capture_mode** supersedes **pgms_wait_sampling.query_capture_mode**. If pg_qs.query_capture_mode is _none_, the pgms_wait_sampling.query_capture_mode setting has no effect. 


## Keep the data you need
The **pg_qs.retention_period_in_days** parameter specifies in days the data retention period for Query Store. Older query and statistics data is deleted. By default, Query Store is configured to retain the data for 7 days. Avoid keeping historical data you do not plan to use. Increase the value if you need to keep data longer.


## Set the frequency of wait stats sampling 
The **pgms_wait_sampling.history_period** parameter specifies how often (in milliseconds) wait events are sampled. The shorter the period, the more frequent the sampling. More information is retrieved, but that comes with the cost of greater resource consumption. Increase this period if the server is under load or you don't need the granularity


## Get quick insights into Query Store
You can use [Query Performance Insight](concepts-query-performance-insight.md) in the Azure portal to get quick insights into the data in Query Store. The visualizations surface the longest running queries and longest wait events over time.

## Next steps
- Learn how to get or set parameters using the [Azure portal](howto-configure-server-parameters-using-portal.md) or the [Azure CLI](howto-configure-server-parameters-using-cli.md).