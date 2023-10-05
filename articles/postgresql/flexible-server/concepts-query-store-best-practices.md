---
title: Query Store best practices in Azure Database for PostgreSQL - Flex Server
description: This article describes best practices for Query Store in Azure Database for PostgreSQL - Flex Server.
author: ssen-msft
ms.author: ssen
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 7/1/2023
---

# Best practices for Query Store - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

**Applies to:** Azure Database for PostgreSQL - Flex Server versions 11, 12

This article outlines best practices for using Query Store in Azure Database for PostgreSQL.

## Set the optimal query capture mode
Let Query Store capture the data that matters to you. 

|**pg_qs.query_capture_mode** |	**Scenario**|
|---|---|
|_All_	|Analyze your workload thoroughly in terms of all queries and their execution frequencies and other statistics. Identify new queries in your workload. Detect if ad hoc queries are used to identify opportunities for user or auto parameterization. _All_ comes with an increased resource consumption cost. |
|_Top_	|Focus your attention on top queries - those issued by clients.
|_None_	|If set to None, Query Store will not capture any new queries. You've already captured a query set and time window that you want to investigate and you want to eliminate the distractions that other queries may introduce. _None_ is suitable for testing and bench-marking environments. _None_ should be used with caution as you might miss the opportunity to track and optimize important new queries. |


> [!NOTE] 
> **pg_qs.query_capture_mode** supersedes **pgms_wait_sampling.query_capture_mode**. If pg_qs.query_capture_mode is _none_, the pgms_wait_sampling.query_capture_mode setting has no effect. 


## Keep the data you need
The **pg_qs.retention_period_in_days** parameter specifies in days the data retention period for Query Store. Older query and statistics data is deleted. By default, Query Store is configured to retain the data for 7 days. Avoid keeping historical data you do not plan to use. Increase the value if you need to keep data longer.


## Next steps
- Learn how to get or set parameters using the [Azure portal](howto-configure-server-parameters-using-portal.md) or the [Azure CLI](howto-configure-server-parameters-using-cli.md).
