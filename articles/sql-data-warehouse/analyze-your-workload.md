---
title: Analyze your workload - Azure SQL Data Warehouse | Microsoft Docs
description: Techniques for analyzing query prioritization for your workload in Azure SQL Data Warehouse.
services: sql-data-warehouse
author: kevinvngo
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: manage
ms.date: 04/17/2018
ms.author: kevin
ms.reviewer: igorstan
---

# Analyze your workload in Azure SQL Data Warehouse
Techniques for analyzing query prioritization for your workload in Azure SQL Data Warehouse.

## Workload groups 
SQL Data Warehouse implements resource classes by using workload groups. There are a total of eight workload groups that control the behavior of the resource classes across the various DWU sizes. For any DWU, SQL Data Warehouse uses only four of the eight workload groups. This approach makes sense because each workload group is assigned to one of four resource classes: smallrc, mediumrc, largerc, or xlargerc. The importance of understanding the workload groups is that some of these workload groups are set to higher *importance*. Importance is used for CPU scheduling. Queries run with high importance get three times more CPU cycles than queries run with medium importance. Therefore, concurrency slot mappings also determine CPU priority. When a query consumes 16 or more slots, it runs as high importance.

The following table shows the importance mappings for each workload group.

### Workload group mappings to concurrency slots and importance

| Workload groups | Concurrency slot mapping | MB / Distribution (Elasticity) | MB / Distribution (Compute) | Importance mapping |
|:---------------:|:------------------------:|:------------------------------:|:---------------------------:|:------------------:|
| SloDWGroupC00   | 1                        |    100                         | 250                         | Medium             |
| SloDWGroupC01   | 2                        |    200                         | 500                         | Medium             |
| SloDWGroupC02   | 4                        |    400                         | 1000                        | Medium             |
| SloDWGroupC03   | 8                        |    800                         | 2000                        | Medium             |
| SloDWGroupC04   | 16                       |  1,600                         | 4000                        | High               |
| SloDWGroupC05   | 32                       |  3,200                         | 8000                        | High               |
| SloDWGroupC06   | 64                       |  6,400                         | 16,000                      | High               |
| SloDWGroupC07   | 128                      | 12,800                         | 32,000                      | High               |
| SloDWGroupC08   | 256                      | 25,600                         | 64,000                      | High               |

<!-- where are the allocation and consumption of concurrency slots charts? -->
The **Allocation and consumption of concurrency slots** chart shows a DW500 uses 1, 4, 8 or 16 concurrency slots for smallrc, mediumrc, largerc, and xlargerc, respectively. To find the importance for each resource class, you can look up those values in the preceding chart.

### DW500 mapping of resource classes to importance
| Resource class | Workload group | Concurrency slots used | MB / Distribution | Importance |
|:-------------- |:-------------- |:----------------------:|:-----------------:|:---------- |
| smallrc        | SloDWGroupC00  | 1                      | 100               | Medium     |
| mediumrc       | SloDWGroupC02  | 4                      | 400               | Medium     |
| largerc        | SloDWGroupC03  | 8                      | 800               | Medium     |
| xlargerc       | SloDWGroupC04  | 16                     | 1,600             | High       |
| staticrc10     | SloDWGroupC00  | 1                      | 100               | Medium     |
| staticrc20     | SloDWGroupC01  | 2                      | 200               | Medium     |
| staticrc30     | SloDWGroupC02  | 4                      | 400               | Medium     |
| staticrc40     | SloDWGroupC03  | 8                      | 800               | Medium     |
| staticrc50     | SloDWGroupC03  | 16                     | 1,600             | High       |
| staticrc60     | SloDWGroupC03  | 16                     | 1,600             | High       |
| staticrc70     | SloDWGroupC03  | 16                     | 1,600             | High       |
| staticrc80     | SloDWGroupC03  | 16                     | 1,600             | High       |

## View workload groups
The following query shows details of the memory resource allocation from the perspective of the resource governor. This is helpful for analyzing active and historic usage of the workload groups when troubleshooting.

```sql
WITH rg
AS
(   SELECT  
     pn.name                                AS node_name
    ,pn.[type]                              AS node_type
    ,pn.pdw_node_id                         AS node_id
    ,rp.name                                AS pool_name
    ,rp.max_memory_kb*1.0/1024              AS pool_max_mem_MB
    ,wg.name                                AS group_name
    ,wg.importance                          AS group_importance
    ,wg.request_max_memory_grant_percent    AS group_request_max_memory_grant_pcnt
    ,wg.max_dop                             AS group_max_dop
    ,wg.effective_max_dop                   AS group_effective_max_dop
    ,wg.total_request_count                 AS group_total_request_count
    ,wg.total_queued_request_count          AS group_total_queued_request_count
    ,wg.active_request_count                AS group_active_request_count
    ,wg.queued_request_count                AS group_queued_request_count
    FROM    sys.dm_pdw_nodes_resource_governor_workload_groups wg
    JOIN    sys.dm_pdw_nodes_resource_governor_resource_pools rp    
            ON  wg.pdw_node_id  = rp.pdw_node_id
            AND wg.pool_id      = rp.pool_id
    JOIN    sys.dm_pdw_nodes pn
            ON    wg.pdw_node_id    = pn.pdw_node_id
    WHERE   wg.name like 'SloDWGroup%'
    AND     rp.name    = 'SloDWPool'
)
SELECT  pool_name
,       pool_max_mem_MB
,       group_name
,       group_importance
,       (pool_max_mem_MB/100)*group_request_max_memory_grant_pcnt AS max_memory_grant_MB
,       node_name
,       node_type
,       group_total_request_count
,       group_total_queued_request_count
,       group_active_request_count
,       group_queued_request_count
FROM    rg
ORDER BY
        node_name
,       group_request_max_memory_grant_pcnt
,       group_importance
;
```

## Queued query detection and other DMVs
You can use the `sys.dm_pdw_exec_requests` DMV to identify queries that are waiting in a concurrency queue. Queries waiting for a concurrency slot have a status of **suspended**.

```sql
SELECT  r.[request_id]                           AS Request_ID
,       r.[status]                               AS Request_Status
,       r.[submit_time]                          AS Request_SubmitTime
,       r.[start_time]                           AS Request_StartTime
,       DATEDIFF(ms,[submit_time],[start_time])  AS Request_InitiateDuration_ms
,       r.resource_class                         AS Request_resource_class
FROM    sys.dm_pdw_exec_requests r
;
```

Workload management roles can be viewed with `sys.database_principals`.

```sql
SELECT  ro.[name]           AS [db_role_name]
FROM    sys.database_principals ro
WHERE   ro.[type_desc]      = 'DATABASE_ROLE'
AND     ro.[is_fixed_role]  = 0
;
```

The following query shows which role each user is assigned to.

```sql
SELECT  r.name AS role_principal_name
,       m.name AS member_principal_name
FROM    sys.database_role_members rm
JOIN    sys.database_principals AS r            ON rm.role_principal_id      = r.principal_id
JOIN    sys.database_principals AS m            ON rm.member_principal_id    = m.principal_id
WHERE   r.name IN ('mediumrc','largerc','xlargerc')
;
```

SQL Data Warehouse has the following wait types:

* **LocalQueriesConcurrencyResourceType**: Queries that sit outside of the concurrency slot framework. DMV queries and system functions such as `SELECT @@VERSION` are examples of local queries.
* **UserConcurrencyResourceType**: Queries that sit inside the concurrency slot framework. Queries against end-user tables represent examples that would use this resource type.
* **DmsConcurrencyResourceType**: Waits resulting from data movement operations.
* **BackupConcurrencyResourceType**: This wait indicates that a database is being backed up. The maximum value for this resource type is 1. If multiple backups have been requested at the same time, the others queue.

The `sys.dm_pdw_waits` DMV can be used to see which resources a request is waiting for.

```sql
SELECT  w.[wait_id]
,       w.[session_id]
,       w.[type]                                           AS Wait_type
,       w.[object_type]
,       w.[object_name]
,       w.[request_id]
,       w.[request_time]
,       w.[acquire_time]
,       w.[state]
,       w.[priority]
,       SESSION_ID()                                       AS Current_session
,       s.[status]                                         AS Session_status
,       s.[login_name]
,       s.[query_count]
,       s.[client_id]
,       s.[sql_spid]
,       r.[command]                                        AS Request_command
,       r.[label]
,       r.[status]                                         AS Request_status
,       r.[submit_time]
,       r.[start_time]
,       r.[end_compile_time]
,       r.[end_time]
,       DATEDIFF(ms,r.[submit_time],r.[start_time])        AS Request_queue_time_ms
,       DATEDIFF(ms,r.[start_time],r.[end_compile_time])   AS Request_compile_time_ms
,       DATEDIFF(ms,r.[end_compile_time],r.[end_time])     AS Request_execution_time_ms
,       r.[total_elapsed_time]
FROM    sys.dm_pdw_waits w
JOIN    sys.dm_pdw_exec_sessions s  ON w.[session_id] = s.[session_id]
JOIN    sys.dm_pdw_exec_requests r  ON w.[request_id] = r.[request_id]
WHERE    w.[session_id] <> SESSION_ID()
;
```

The `sys.dm_pdw_resource_waits` DMV shows only the resource waits consumed by a given query. Resource wait time only measures the time waiting for resources to be provided, as opposed to signal wait time, which is the time it takes for the underlying SQL servers to schedule the query onto the CPU.

```sql
SELECT  [session_id]
,       [type]
,       [object_type]
,       [object_name]
,       [request_id]
,       [request_time]
,       [acquire_time]
,       DATEDIFF(ms,[request_time],[acquire_time])  AS acquire_duration_ms
,       [concurrency_slots_used]                    AS concurrency_slots_reserved
,       [resource_class]
,       [wait_id]                                   AS queue_position
FROM    sys.dm_pdw_resource_waits
WHERE    [session_id] <> SESSION_ID()
;
```
You can also use the `sys.dm_pdw_resource_waits` DMV calculate how many concurrency slots have been granted.

```sql
SELECT  SUM([concurrency_slots_used]) as total_granted_slots 
FROM    sys.[dm_pdw_resource_waits] 
WHERE   [state]           = 'Granted' 
AND     [resource_class] is not null
AND     [session_id]     <> session_id()
;
```

The `sys.dm_pdw_wait_stats` DMV can be used for historic trend analysis of waits.

```sql
SELECT   w.[pdw_node_id]
,        w.[wait_name]
,        w.[max_wait_time]
,        w.[request_count]
,        w.[signal_time]
,        w.[completed_count]
,        w.[wait_time]
FROM    sys.dm_pdw_wait_stats w
;
```

## Next steps
For more information about managing database users and security, see [Secure a database in SQL Data Warehouse](sql-data-warehouse-overview-manage-security.md). For more information about how larger resource classes can improve clustered columnstore index quality, see [Rebuilding indexes to improve segment quality](sql-data-warehouse-tables-index.md#rebuilding-indexes-to-improve-segment-quality).


