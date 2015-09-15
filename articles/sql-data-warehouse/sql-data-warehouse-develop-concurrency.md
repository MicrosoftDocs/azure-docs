<properties
   pageTitle="Concurrency and workload management in SQL Data Warehouse | Microsoft Azure"
   description="Understand concurrency and workload management in Azure SQL Data Warehouse for developing solutions."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="jrowlandjones"
   manager="barbkess"
   editor="jrowlandjones"/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/26/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

# Concurrency and workload management in SQL Data Warehouse
To deliver predictable performance at scale SQL Data Warehouse implements mechanisms for managing both workload concurrency and computational resource assignment.

This article introduces you to the concepts of concurrency and workload management; explaining how both features have been implemented and how you can control them in your data warehouse.

## Concurrency
It is important to understand that concurrency in SQL Data Warehouse is governed by two concepts; **concurrent queries** and **concurrency slots**. 

Concurrent queries equates to the number of queries executing at the same time. SQL Data Warehouse supports up to 32 **concurrent queries**. Each query execution counts as a single query regardless of whether it is a serial query (single threaded) or parallel query (multi-threaded). This is a fixed cap and applies to all service levels and all queries. 

Concurrency slots is a more dynamic concept and is relative to the Data Warehouse Unit (DWU) service level objective for your data warehouse. As you increase the number of DWU allocated to SQL Data Warehouse more compute resources are assigned. However, increasing DWU also increases the number of **concurrency slots** available.

As a general rule, each concurrently executing query consumes one or more concurrency slots. The exact number of slots depends on three factors:

1. The DWU setting for the SQL Data Warehouse
2. The **resource class** that the user belongs to
3. Whether the query or operation is governed by the concurrency slot model 

> [AZURE.NOTE] It is worth noting that not every query is governed by the concurrency slot query rule. However, most user queries are. Some queries and operations do not consume concurrency slots at all. These queries and operations are still limited by the concurrent query limit which is why both rules are described. Please refer to the [resource class exceptions](#exceptions) section below for more details. 

The table below describes the limits for both concurrent queries and concurrency slots; assuming your query is resource governed.

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

SQL Data Warehouse query workloads have to live within these thresholds. If there are more than 32 concurrent queries or you exceed the number of concurrency slots then the query will be queued until both thresholds can be satisfied.

## Workload management

SQL Data Warehouse exposes four different resource classes in the form of **database roles** as part of its workload management implementation.  

The roles are:

- smallrc
- mediumrc
- largerc
- xlargerc

Resource classes are an essential part of SQL Data Warehouse workload management. They govern the computational resources allocated to the query.

By default each user is a member of the small resource class - smallrc. However, any user can be added to one or more of the higher resource classes. As a general rule, SQL Data Warehouse will take the highest role membership for query execution. Adding a user to a higher resource class will increase the resources for that user but it will also consume greater concurrency slots; potentially limiting your concurrency. This is due to the fact that as more resources are allocated to one query the system needs to limit resources consumed by others. There is no free lunch.

The most important resource governed by the higher resource class is memory. Most data warehouse tables of any meaningful size will be using clustered columnstore indexes. Whilst this typically provides the best performance for data warehouse workloads maintaining them is a memory intensive operation. It is often highly beneficial to use the higher resource classes for data management operations such as index rebuilds.

SQL Data Warehouse has implemented resource classes through the use of database roles. To become a member of a higher resource class and increase your memory simply and priority you simply add your database user to one of the roles / resource classes mentioned above.

### Resource class membership

You can add and remove yourself to the workload management database role using the `sp_addrolemember` and `sp_droprolemember` procedures. Note you will require `ALTER ROLE` permission to do this. You are not able to use the ALTER ROLE DDL syntax. You must use the aforementioned stored procedures. A full example of how to create logins and users is provided in the [managing users)[#managing-users] section at the end of this article. 

> [AZURE.NOTE] Rather than adding a user into and out of a workload management group it is often simpler to initiate those more intensive operations through a separate login/user that is permanently assigned to the higher resource class.

### Memory allocation

The following table details the increase in memory available to each query; subject to the resource class applied to the user executing it:

<!--
| Memory Available (per dist) | Priority | DW100  | DW200  | DW300  | DW400   | DW500   | DW600   | DW1000  | DW1200  | DW1500  | DW2000  | DW3000  | DW6000   |
| :-------------------------- | :------- | :----  | :----- | :----- | :------ | :------ | :------ | :------ | :------ | :------ | :------ | :------ | :------- |
| smallrc(default) (s)        | Medium   | 100 MB | 100 MB | 100 MB | 100  MB | 100 MB  | 100 MB  | 100 MB  | 100 MB  | 100 MB  | 100 MB  | 100  MB | 100   MB |
| mediumrc (m)                | Medium   | 100 MB | 200 MB | 200 MB | 400  MB | 400 MB  | 400 MB  | 800 MB  | 800 MB  | 800 MB  | 1600 MB | 1600 MB | 3200  MB |
| largerc (l)                 | High     | 200 MB | 400 MB | 400 MB | 800  MB | 800 MB  | 800 MB  | 1600 MB | 1600 MB | 1600 MB | 3200 MB | 3200 MB | 6400  MB |
| xlargerc (xl)               | High     | 400 MB | 800 MB | 800 MB | 1600 MB | 1600 MB | 1600 MB | 3200 MB | 3200 MB | 3200 MB | 6400 MB | 6400 MB | 12800 MB |
-->

<!--
| Memory Available (per dist) | Priority | DW100  | DW200  | DW300  | DW400   | DW500   | DW600   | DW1000  | DW1200  | DW1500  | DW2000  |
| :-------------------------- | :------- | :----  | :----- | :----- | :------ | :------ | :------ | :------ | :------ | :------ | :------ |
| smallrc(default) (s)        | Medium   | 100 MB | 100 MB | 100 MB | 100  MB | 100 MB  | 100 MB  | 100 MB  | 100 MB  | 100 MB  | 100 MB  |
| mediumrc (m)                | Medium   | 100 MB | 200 MB | 200 MB | 400  MB | 400 MB  | 400 MB  | 800 MB  | 800 MB  | 800 MB  | 1600 MB |
| largerc (l)                 | High     | 200 MB | 400 MB | 400 MB | 800  MB | 800 MB  | 800 MB  | 1600 MB | 1600 MB | 1600 MB | 3200 MB |
| xlargerc (xl)               | High     | 400 MB | 800 MB | 800 MB | 1600 MB | 1600 MB | 1600 MB | 3200 MB | 3200 MB | 3200 MB | 6400 MB |
-->

| Memory Available (per dist) | DW100  | DW200  | DW300  | DW400   | DW500   | DW600   | DW1000  | DW1200  | DW1500  | DW2000  |
| :-------------------------- | :----  | :----- | :----- | :------ | :------ | :------ | :------ | :------ | :------ | :------ |
| smallrc(default) (s)        | 100 MB | 100 MB | 100 MB | 100  MB | 100 MB  | 100 MB  | 100 MB  | 100 MB  | 100 MB  | 100 MB  |
| mediumrc (m)                | 100 MB | 200 MB | 200 MB | 400  MB | 400 MB  | 400 MB  | 800 MB  | 800 MB  | 800 MB  | 1600 MB |
| largerc (l)                 | 200 MB | 400 MB | 400 MB | 800  MB | 800 MB  | 800 MB  | 1600 MB | 1600 MB | 1600 MB | 3200 MB |
| xlargerc (xl)               | 400 MB | 800 MB | 800 MB | 1600 MB | 1600 MB | 1600 MB | 3200 MB | 3200 MB | 3200 MB | 6400 MB |

### Concurrency slot consumption

Furthermore, as mentioned above, the higher the resource class assigned to the user the greater the concurrency slot consumption. The following table documents the consumption of concurrency slots by queries in a given resource class.

<!--
| Consumption | DW100 | DW200 | DW300 | DW400 | DW500 | DW600 | DW1000 | DW1200 | DW1500 | DW2000 | DW3000 | DW6000 |
| :--------------------------- | :---- | :---- | :---- | :---- | :---- | :---- | :----- | :----- | :----- | :----- | :----- | :----- |
| Max Concurrent Queries       | 32    | 32    | 32    | 32    | 32    | 32    | 32     | 32     | 32     | 32     | 32     | 32     |
| Max Concurrency Slots        | 4     | 8     | 12    | 16    | 20    | 24    | 40     | 48     | 60     | 80     | 120    | 240    |
| smallrc(default) (s)         | 1     | 1     | 1     | 1     | 1     | 1     | 1      | 1      | 1      | 1      | 1      | 1      |
| mediumrc (m)                 | 1     | 2     | 2     | 4     | 4     | 4     | 8      | 8      | 8      | 16     | 16     | 32     |
| largerc (l)                  | 2     | 4     | 4     | 8     | 8     | 8     | 16     | 16     | 16     | 32     | 32     | 64     |
| xlargerc (xl)                | 4     | 8     | 8     | 16    | 16    | 16    | 32     | 32     | 32     | 64     | 64     | 128    |
-->

| Consumption | DW100 | DW200 | DW300 | DW400 | DW500 | DW600 | DW1000 | DW1200 | DW1500 | DW2000 |
| :--------------------------- | :---- | :---- | :---- | :---- | :---- | :---- | :----- | :----- | :----- | :----- |
| Max Concurrent Queries       | 32    | 32    | 32    | 32    | 32    | 32    | 32     | 32     | 32     | 32     |
| Max Concurrency Slots        | 4     | 8     | 12    | 16    | 20    | 24    | 40     | 48     | 60     | 80     |
| smallrc(default) (s)         | 1     | 1     | 1     | 1     | 1     | 1     | 1      | 1      | 1      | 1      |
| mediumrc (m)                 | 1     | 2     | 2     | 4     | 4     | 4     | 8      | 8      | 8      | 16     |
| largerc (l)                  | 2     | 4     | 4     | 8     | 8     | 8     | 16     | 16     | 16     | 32     |
| xlargerc (xl)                | 4     | 8     | 8     | 16    | 16    | 16    | 32     | 32     | 32     | 64     |

### Exceptions

There are occasions where membership of a higher resource class does not alter the resources assigned to the query or operation. Typically this occurs when the resources required to fulfil the action are low. In these cases the default or small resource class (smallrc) is always used irrespective of the resource class assigned to the user. As an example, `CREATE LOGIN` will always run in the smallrc. The resources required to fulfil this operation are very low and so it would not make sense to include the query in the concurrency slot model. It would be wasteful to pre-allocate large amounts of memory for this action. By excluding `CREATE LOGIN` from the concurrency slot model SQL Data Warehouse can be much more efficient.  

Below is a list of statements and operations that **are** governed by resource classes:

- INSERT-SELECT
- UPDATE
- DELETE
- SELECT (when not exclusively querying DMVs)
- ALTER INDEX REBUILD
- ALTER INDEX REORGANIZE
- ALTER TABLE REBUILD
- CREATE CLUSTERED INDEX
- CREATE CLUSTERED COLUMNSTORE INDEX
- CREATE TABLE AS SELECT 
- Data loading 

<!--
Removed as these two are not confirmed / supported under SQLDW
- CREATE REMOTE TABLE AS SELECT
- CREATE EXTERNAL TABLE AS SELECT 
-->
   
> [AZURE.NOTE] It is worth highlighting that `SELECT` queries executing exclusively against dynamic management views and catalog views are **not** governed by resource classes.

It is important to remember that the majority of end user queries are likely to be governed by resource classes. The general rule is that the active query workload must fit inside both the concurrent query and concurrency slot thresholds unless it has been specifically excluded by the platform. As an end user you cannot choose to exclude a query from the concurrency slot model. Once either threshold has been exceeded queries will begin to queue. Queued queries will be addressed in priority order followed by submission time.

### Internals 

Under the covers of SQL Data Warehouse's workload management things are a little bit more complicated. The resource classes are dynamically mapped to a generic set of workload management groups within resource governor. The groups used will depend on the DWU value for the warehouse. However, there are total of eight workload groups used by SQL Data Warehouse. They are:

- SloDWGroupC00
- SloDWGroupC01
- SloDWGroupC02
- SloDWGroupC03
- SloDWGroupC04
- SloDWGroupC05
- SloDWGroupC06
- SloDWGroupC07

These 8 groups map across to the concurrency slot consumption

| Workload Group | Concurrency Slot Mapping | Priority Mapping |
| :------------  | :----------------------- | :--------------- |
| SloDWGroupC00  | 1                        | Medium           |
| SloDWGroupC01  | 2                        | Medium           |
| SloDWGroupC02  | 4                        | Medium           |
| SloDWGroupC03  | 8                        | Medium           |
| SloDWGroupC04  | 16                       | High             |
| SloDWGroupC05  | 32                       | High             |
| SloDWGroupC06  | 64                       | High             |
| SloDWGroupC07  | 128                      | High             |

So, for example, if DW500 is the current DWU setting for your SQL Data Warehouse then the active workload groups would be mapped to the resource classes as follows:

| Resource Class | Workload Group | Concurrency Slots Used   | Importance |
| :------------- | :------------- | :---------------------   | :--------- |
| smallrc        | SloDWGroupC00  | 1                        | Medium     |
| mediumrc       | SloDWGroupC02  | 4                        | Medium     |
| largerc        | SloDWGroupC03  | 8                        | Medium     |
| xlargerc       | SloDWGroupC04  | 16                       | High       |

To look at the differences in memory resource allocation in detail from the perspective of the resource governor use the following query:

```
WITH rg
AS
(   SELECT  pn.name									AS node_name
	,		pn.[type]								AS node_type
	,		pn.pdw_node_id							AS node_id
	,		rp.name									AS pool_name
    ,       rp.max_memory_kb*1.0/1024				AS pool_max_mem_MB
    ,       wg.name									AS group_name
    ,       wg.importance							AS group_importance
    ,       wg.request_max_memory_grant_percent		AS group_request_max_memory_grant_pcnt
    ,       wg.max_dop								AS group_max_dop
    ,       wg.effective_max_dop					AS group_effective_max_dop
	,		wg.total_request_count					AS group_total_request_count
	,		wg.total_queued_request_count			AS group_total_queued_request_count
	,		wg.active_request_count					AS group_active_request_count
	,		wg.queued_request_count					AS group_queued_request_count
    FROM    sys.dm_pdw_nodes_resource_governor_workload_groups wg
    JOIN    sys.dm_pdw_nodes_resource_governor_resource_pools rp    ON  wg.pdw_node_id  = rp.pdw_node_id
															        AND wg.pool_id      = rp.pool_id
	JOIN	sys.dm_pdw_nodes pn										ON	wg.pdw_node_id	= pn.pdw_node_id
	WHERE   wg.name like 'SloDWGroup%'
	AND     rp.name = 'SloDWPool'
) 
SELECT	pool_name
,		pool_max_mem_MB
,		group_name
,		group_importance
,		(pool_max_mem_MB/100)*group_request_max_memory_grant_pcnt AS max_memory_grant_MB
,		node_name
,		node_type
,       group_total_request_count
,       group_total_queued_request_count
,       group_active_request_count
,       group_queued_request_count
FROM	rg
ORDER BY 
	node_name
,	group_request_max_memory_grant_pcnt
,	group_importance
;
```

> [AZURE.NOTE] The query above can also be used to analyse active and historic usage of the workload groups when troubleshooting 

## Workload management examples

This section provides some additional examples to work through for managing users and detecting queries that are queuing.

### Managing users

To grant access to a user to the SQL Data Warehouse they will first need a login.

Open a connection to the master database for your SQL Data Warehouse and execute the following commands:

```
CREATE LOGIN newperson WITH PASSWORD = 'mypassword'

CREATE USER newperson for LOGIN newperson
```

[AZURE.NOTE] it is a good idea to create users for your logins in the master database for when working with both Azure SQL database and SQL Data Warehouse. There are two server roles available at this level that require the login to have a user in master in order to grant membership. The roles are `Loginmanager` and `dbmanager`. In both Azure SQL database and SQL Data Warehouse these roles grant rights to manage logins and to create databases. This is different to SQL Server. For more details please refer to the [Managing Databases and Logins in Azure SQL Database] article for more details.

Once the login has been created then a user account now needs to be added.

Open a connection to the SQL Data Warehouse database and execute the following command:

```
CREATE USER newperson FOR LOGIN newperson
```

Once complete permissions will need to be granted to the user. The example below grants `CONTROL` on the SQL Data Warehouse database. `CONTROL` at the database level is the equivalent of db_owner in SQL Server.

```
GRANT CONTROL ON DATABASE::MySQLDW to newperson
```

To see the workload management roles use the following query:

```
SELECT  ro.[name]           AS [db_role_name]
FROM    sys.database_principals ro
WHERE   ro.[type_desc]      = 'DATABASE_ROLE'
AND     ro.[is_fixed_role]  = 0
;
```

To add a user to an increase workload management role use the following query:

``` 
EXEC sp_addrolemember 'largerc', 'newperson' 
```

To remove a user from an workload management role use the following query:

``` 
EXEC sp_droprolemember 'largerc', 'newperson' 
```

> [AZURE.NOTE] It is not possible to remove a user from the smallrc.

To see which users are members of a given role use the following query:

```
SELECT	r.name AS role_principal_name
,		m.name AS member_principal_name
FROM	sys.database_role_members rm
JOIN	sys.database_principals AS r			ON rm.role_principal_id		= r.principal_id
JOIN	sys.database_principals AS m			ON rm.member_principal_id	= m.principal_id
WHERE	r.name IN ('mediumrc','largerc', 'xlargerc')
;
```

### Queued query detection
To identify queries that are held in a concurrency queue you can always refer to the `sys.dm_pdw_exec_requests` DMV.

```
SELECT 	 r.[request_id]									AS Request_ID
		,r.[status]										AS Request_Status
		,r.[submit_time]								AS Request_SubmitTime
		,r.[start_time]									AS Request_StartTime
        ,DATEDIFF(ms,[submit_time],[start_time])		AS Request_InitiateDuration_ms
        ,r.resource_class                               AS Request_resource_class
FROM    sys.dm_pdw_exec_requests r
;
```

SQL Data Warehouse has specific wait types for measuring concurrency. 

They are:
 
- LocalQueriesConcurrencyResourceType
- UserConcurrencyResourceType
- DmsConcurrencyResourceType
- BackupConcurrencyResourceType

The LocalQueriesConcurrencyResourceType refers to queries that sit outside of the concurrency slot framework. DMV queries and system functions such as `SELECT @@VERSION` are examples of local queries.

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
For more development tips, see [development overview][].

<!--Image references-->

<!--Article references-->
[development overview]: sql-data-warehouse-overview-develop.md

<!--MSDN references-->
[Managing Databases and Logins in Azure SQL Database]:https://msdn.microsoft.com/en-us/library/azure/ee336235.aspx

<!--Other Web references-->


