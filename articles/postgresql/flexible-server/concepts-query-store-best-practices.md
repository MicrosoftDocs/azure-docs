---
title: Query Store best practices
description: This article describes best practices for Query Store in Azure Database for PostgreSQL - Flexible Server.
author: markingmyname
ms.author: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Best practices for Query Store - Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article outlines best practices for using Query Store in Azure Database for PostgreSQL flexible server.

## Set the optimal query capture mode

Let Query Store capture the data that matters to you. 

|**pg_qs.query_capture_mode** |	**Scenario**|
|---|---|
|_All_	| Analyze your workload thoroughly in terms of all queries (top-level or nested) and their execution frequencies and other statistics. Identify new queries in your workload. Detect if ad hoc queries are used, to identify opportunities for user defined parameterization or automatic parameterization. _All_ comes with an increased resource consumption cost. |
|_Top_ | Focus your attention on top-level queries - those issued by clients. Doesn't include nested statements (statements executed inside a procedure or a function). |
|_None_	|If set to None, Query Store won't capture any new queries. You've already captured a query set and time window that you want to investigate and you want to eliminate the distractions that other queries may introduce. _None_ is suitable for testing and bench-marking environments. _None_ should be used with caution as you might miss the opportunity to track and optimize important new queries. |


> [!NOTE] 
> **pg_qs.query_capture_mode** supersedes **pgms_wait_sampling.query_capture_mode**. If pg_qs.query_capture_mode is _none_, the pgms_wait_sampling.query_capture_mode setting has no effect. 


## Keep the data you need

The **pg_qs.retention_period_in_days** parameter specifies in days the data retention period for Query Store. Older query and statistics data is deleted. By default, Query Store is configured to retain the data for seven days. Avoid keeping historical data you don't plan to use. Increase the value if you need to keep data longer.


## Next steps

- Learn how to get or set parameters using the [Azure portal](how-to-configure-server-parameters-using-portal.md) or the [Azure CLI](how-to-configure-server-parameters-using-cli.md).
