<properties
   pageTitle="Concurrency and workload management in SQL Data Warehouse | Microsoft Azure"
   description="Understand concurrency and workload management in Azure SQL Data Warehouse for developing solutions."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="jrowlandjones"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/22/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

# Concurrency and workload management in SQL Data Warehouse
To deliver predictable performance at scale SQL Data Warehouse implements mechanisms for managing both workload concurrency and computational resource assignment.

This article introduces you to the concepts of concurrency and workload management; explaining the how both features have been implemented and how you can control them in your data warehouse.

## Concurrency
It is important to understand that concurrency in SQL Data Warehouse is governed by two concepts; **concurrent queries** and **concurrency slots**. 

Concurrent queries equates to the number of queries executing at the same time. SQL Data Warehouse supports up to 32 **concurrent queries**. Each query execution counts as a single query regardless of whether it is a serial query (single threaded) or parallel query (multi-threaded). This is a fixed cap and applies to all service levels. 

Concurrency slots is a more dynamic concept and is relative to the Data Warehouse Unit (DWU) service level objective for your data warehouse. As you increase the number of DWU allocated to SQL Data Warehouse more compute resources are assigned. However, increasing DWU also increases the number of **concurrency slots** available.

SQL Data Warehouse has to live within both thresholds. If there are more than 32 concurrent queries or you exceed the number of concurrency slots then the query will be queued until both thresholds can be satisfied.

Each concurrently executing query consumes one or more concurrency slots. The exact number of slots depends on two factors:

1) The DWU setting for the SQL Data Warehouse
2) The **resource class** that the user belongs to 

<!--
| Concurrency Slot Consumption | DW100 | DW200 | DW300 | DW400 | DW500 | DW600 | DW1000 | DW1200 | DW1500 | DW2000 | DW3000 | DW6000 |
| :--------------------------- | :---- | :---- | :---- | :---- | :---- | :---- | :----- | :----- | :----- | :----- | :----- | :----- |
| Max Concurrent Queries       | 32    | 32    | 32    | 32    | 32    | 32    | 32     | 32     | 32     | 32     | 32     | 32     |
| Max Concurrency Slots        | 4     | 8     | 12    | 16    | 20    | 24    | 40     | 48     | 60     | 80     | 120    | 240    |
-->

| Concurrency Slot Consumption | DW100 | DW200 | DW300 | DW400 | DW500 | DW600 | DW1000 | DW1200 | DW1500 | DW2000 | 
| :--------------------------- | :---- | :---- | :---- | :---- | :---- | :---- | :----- | :----- | :----- | :----- | 
| Max Concurrent Queries       | 32    | 32    | 32    | 32    | 32    | 32    | 32     | 32     | 32     | 32     | 
| Max Concurrency Slots        | 4     | 8     | 12    | 16    | 20    | 24    | 40     | 48     | 60     | 80     | 

Resource classes are an essential part of SQL Data Warehouse workload management as they also govern computational resources allocated to the query. These will be covered in the workload management section below.

## Workload management

SQL Data Warehouse exposes four different resource classes in the form of **database roles** as part of its workload management implementation.  

The roles are:
- smallrc
- mediumrc
- largerc
- xlargerc

You can see the roles for yourself with the following query.

```
SELECT  ro.[name]           AS [db_role_name]
FROM    sys.database_principals ro
WHERE   ro.[type_desc]      = 'DATABASE_ROLE'
AND     ro.[is_fixed_role]  = 0
;
```

By default each user is a member of the small resource class - smallrc. However, any user can be added to one or more of the higher resource classes. SQL Data Warehouse will take the highest role membership for query execution. Adding a user to a higher resource class will increase the resources for that user but it will also consume greater concurrency slots; potentially limiting your concurrency. This is due to the fact that as more resources are allocated to one query the system needs to limit resources consumed by others. There is no free lunch. 

The most important resource governed by the higher resource class is memory. Most data warehouse tables of any meaningful size will be using clustered columnstore indexes. Whilst this typically provides the best performance for data warehouse workloads maintaining them is a memory intensive operation. It is often highly beneficial to use the higher resource classes for data management operations such as index rebuilds.

To increase your memory simply add your database user to one of the roles mentioned above.

You can add and remove yourself to the workload management database role using the `sp_addrolemember` and `sp_droprolemember` procedures. Note you will require `ALTER ROLE` permission to do this. You are not able to use the ALTER ROLE DDL syntax. You must use the aforementioned stored procedures.

> [AZURE.NOTE] Rather than adding a user into and out of a workload management group it is often simpler to initiate those more intensive operations through a separate login/user that is permanently assigned to the higher resource class.

The following table details the increase in memory available to each query; subject to the resource class applied to the user executing it:

<!--
| Memory Available (per dist) | Priority | DW100  | DW200  | DW300  | DW400   | DW500   | DW600   | DW1000  | DW1200  | DW1500  | DW2000  | DW3000  | DW6000   |
| :-------------------------- | :------- | :----  | :----- | :----- | :------ | :------ | :------ | :------ | :------ | :------ | :------ | :------ | :------- |
| smallrc(default) (s)        | Medium   | 100 MB | 100 MB | 100 MB | 100  MB | 100 MB  | 100 MB  | 100 MB  | 100 MB  | 100 MB  | 100 MB  | 100  MB | 100   MB |
| mediumrc (m)                | Medium   | 100 MB | 200 MB | 200 MB | 400  MB | 400 MB  | 400 MB  | 800 MB  | 800 MB  | 800 MB  | 1600 MB | 1600 MB | 3200  MB |
| largerc (l)                 | High     | 200 MB | 400 MB | 400 MB | 800  MB | 800 MB  | 800 MB  | 1600 MB | 1600 MB | 1600 MB | 3200 MB | 3200 MB | 6400  MB |
| xlargerc (xl)               | High     | 400 MB | 800 MB | 800 MB | 1600 MB | 1600 MB | 1600 MB | 3200 MB | 3200 MB | 3200 MB | 6400 MB | 6400 MB | 12800 MB |
-->
| Memory Available (per dist) | Priority | DW100  | DW200  | DW300  | DW400   | DW500   | DW600   | DW1000  | DW1200  | DW1500  | DW2000  |
| :-------------------------- | :------- | :----  | :----- | :----- | :------ | :------ | :------ | :------ | :------ | :------ | :------ |
| smallrc(default) (s)        | Medium   | 100 MB | 100 MB | 100 MB | 100  MB | 100 MB  | 100 MB  | 100 MB  | 100 MB  | 100 MB  | 100 MB  |
| mediumrc (m)                | Medium   | 100 MB | 200 MB | 200 MB | 400  MB | 400 MB  | 400 MB  | 800 MB  | 800 MB  | 800 MB  | 1600 MB |
| largerc (l)                 | High     | 200 MB | 400 MB | 400 MB | 800  MB | 800 MB  | 800 MB  | 1600 MB | 1600 MB | 1600 MB | 3200 MB |
| xlargerc (xl)               | High     | 400 MB | 800 MB | 800 MB | 1600 MB | 1600 MB | 1600 MB | 3200 MB | 3200 MB | 3200 MB | 6400 MB |


Furthermore, as mentioned above, the higher the resource class assigned to the user the greater the concurrency slot consumption. The following table documents the consumption of concurrency slots by queries in a given resource class.

<!--
| Concurrency slot consumption | DW100 | DW200 | DW300 | DW400 | DW500 | DW600 | DW1000 | DW1200 | DW1500 | DW2000 | DW3000 | DW6000 |
| :--------------------------- | :---- | :---- | :---- | :---- | :---- | :---- | :----- | :----- | :----- | :----- | :----- | :----- |
| Max Concurrent Queries       | 32    | 32    | 32    | 32    | 32    | 32    | 32     | 32     | 32     | 32     | 32     | 32     |
| Max Concurrency Slots        | 4     | 8     | 12    | 16    | 20    | 24    | 40     | 48     | 60     | 80     | 120    | 240    |
| smallrc(default) (s)         | 1     | 1     | 1     | 1     | 1     | 1     | 1      | 1      | 1      | 1      | 1      | 1      |
| mediumrc (m)                 | 1     | 2     | 2     | 4     | 4     | 4     | 8      | 8      | 8      | 16     | 16     | 32     |
| largerc (l)                  | 2     | 4     | 4     | 8     | 8     | 8     | 16     | 16     | 16     | 32     | 32     | 64     |
| xlargerc (xl)                | 4     | 8     | 8     | 16    | 16    | 16    | 32     | 32     | 32     | 64     | 64     | 128    |
-->

| Concurrency slot consumption | DW100 | DW200 | DW300 | DW400 | DW500 | DW600 | DW1000 | DW1200 | DW1500 | DW2000 |
| :--------------------------- | :---- | :---- | :---- | :---- | :---- | :---- | :----- | :----- | :----- | :----- |
| Max Concurrent Queries       | 32    | 32    | 32    | 32    | 32    | 32    | 32     | 32     | 32     | 32     |
| Max Concurrency Slots        | 4     | 8     | 12    | 16    | 20    | 24    | 40     | 48     | 60     | 80     |
| smallrc(default) (s)         | 1     | 1     | 1     | 1     | 1     | 1     | 1      | 1      | 1      | 1      |
| mediumrc (m)                 | 1     | 2     | 2     | 4     | 4     | 4     | 8      | 8      | 8      | 16     |
| largerc (l)                  | 2     | 4     | 4     | 8     | 8     | 8     | 16     | 16     | 16     | 32     |
| xlargerc (xl)                | 4     | 8     | 8     | 16    | 16    | 16    | 32     | 32     | 32     | 64     |

It is important to remember that the active query workload must fit inside both the concurrent query and concurrency slot thresholds. Once either threshold has been exceeded queries will begin to queue. Queued queries will be addressed in priority order followed by submission time.

## Queued query detection
To identify queries that are held in a concurrency queue you can always refer to the `sys.dm_pdw_exec_requests` DMV.
```
SELECT 	 r.[request_id]									AS Request_ID
		,r.[status]										AS Request_Status
		,r.[submit_time]								AS Request_SubmitTime
		,r.[start_time]									AS Request_StartTime
        ,DATEDIFF(ms,[submit_time],[start_time])		AS Request_InitiateDuration_ms
FROM    sys.dm_pdw_exec_requests r
;
```

SQL Data Warehouse has specific wait types for measuring concurrency. 

They are:
 
- LocalQueriesConcurrencyResourceType
- UserConcurrencyResourceType
- DmsConcurrencyResourceType
- BackupConcurrencyResourceType

The LocalQueriesConcurrencyResourceType refers to queries that sit outside of the concurrency slot framework. DMV queries and system functions such as SELECT @@VERSION are examples of localqueries.

The UserConcurrencyResourceType refers to queries that sit inside the concurrency slot framework. Queries against end user tables represent examples which would use this resource type.

The DmsConcurrencyResourceType refers to waits resulting from data movement operations.

The BackupConcurrencyResourceType can be seen when a database is being backed up. The maximum value for this resource type is 1. If multiple backups have been requested at the same time the others will queue.


To perform analysis of currently queued queries to find out what resources a request is waiting for please refer to the `sys.dm_pdw_waits` DMV.
```
SELECT  w.[wait_id]
,       w.[session_id]
,       w.[type]											AS Wait_type
,       w.[object_type]
,       w.[object_name]
,       w.[request_id]
,       w.[request_time]
,       w.[acquire_time]
,       w.[state]
,       w.[priority]
,		SESSION_ID()										AS Current_session
,		s.[status]											AS Session_status
,		s.[login_name]
,		s.[query_count]
,		s.[client_id]
,		s.[sql_spid]
,		r.[command]											AS Request_command
,		r.[label]
,		r.[status]											AS Request_status
,		r.[submit_time]
,		r.[start_time]
,		r.[end_compile_time]
,		r.[end_time]
,		DATEDIFF(ms,r.[submit_time],r.[start_time])			AS Request_queue_time_ms
,		DATEDIFF(ms,r.[start_time],r.[end_compile_time])	AS Request_compile_time_ms
,		DATEDIFF(ms,r.[end_compile_time],r.[end_time])		AS Request_execution_time_ms
,		r.[total_elapsed_time]
FROM    sys.dm_pdw_waits w
JOIN    sys.dm_pdw_exec_sessions s  ON w.[session_id] = s.[session_id]
JOIN    sys.dm_pdw_exec_requests r  ON w.[request_id] = r.[request_id]
WHERE	w.[session_id] <> SESSION_ID()
;
```
To view just the resource waits consumed by a given query you can refer to the `sys.dm_pdw_resource_waits` DMV. Resource wait time only measures the time waiting for resources to be provided as opposed to signal wait time which is the time it takes for the underlying SQL Server's to schedule the query onto the CPU. 
```
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
WHERE	[session_id] <> SESSION_ID()
;
```
Finally, for historic trend analysis of waits then SQL Datawarehouse provides the `sys.dm_pdw_wait_stats` DMV.
```
SELECT	w.[pdw_node_id]
,		w.[wait_name]
,		w.[max_wait_time]
,		w.[request_count]
,		w.[signal_time]
,		w.[completed_count]
,		w.[wait_time]
FROM	sys.dm_pdw_wait_stats w
;
```

## Next steps
For more development tips, see [SQL Data Warehouse development overview][].

<!--Image references-->

<!--Article references-->
[SQL Data Warehouse development overview]:  ./sql-data-warehouse-overview-develop/

<!--MSDN references-->


<!--Other Web references-->
[Azure Management Portal]: http://portal.azure.com

