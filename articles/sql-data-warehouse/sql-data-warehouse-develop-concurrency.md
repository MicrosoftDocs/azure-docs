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
   ms.date="08/02/2016"
   ms.author="jrj;barbkess;sonyama"/>

# Concurrency and workload management in SQL Data Warehouse

To deliver predictable performance at scale SQL Data Warehouse allows users to control concurrency levels as well as resource allocations like memory and CPU prioritization.  This article introduces you to the concepts of concurrency and workload management, explaining how both features have been implemented and how you can control them in your data warehouse.  SQL Data Warehouse workload management is intended to help you support multi-user environments.  It is not intended for multi-tenant workloads.

## Concurrency limits

SQL Data Warehouse allows up to 1,024 concurrent connections.  All 1,024 connections can submit queries concurrently.  However, in order to optimize throughput, SQL Data Warehouse may queue some queries to ensure that each query receives a minimal memory grant.  Queuing occurs at query execution time.  By queuing queries when concurrency limits are reached, SQL Data Warehouse is able to increase total throughput by ensuring that active queries get access to critically needed memory resources.  

Concurrency limits are governed by two concepts, **concurrent queries** and **concurrency slots**.  For a query to execute, it must execute under both the query concurrency limit and within the concurrency slot allocation.

- **Concurrent queries** are simply the number of queries executing at the same time. SQL Data Warehouse supports up to 32 **concurrent queries** on the larger DW sizes, DW1000 and above.  However, since the number of concurrent queries varies by the number of DWUs, we have provided a table below to show the limitations by DWU.
- **Concurrency slots** is a more dynamic concept.  Each query can consume one or more concurrency slots. The exact number of slots a query consumes depends on the size of your SQL Data Warehouse and the [resource class](#resource-classes) of the query.

The below table describes the limits for both concurrent queries and concurrency slots.

### Concurrency limits

|  DWU   | Max Concurrent Queries  | Concurrency Slots Allocated |
| :----  | :---------------------: | :-------------------------: |
| DW100  |           32            |                4            |
| DW200  |           32            |                8            |
| DW300  |           32            |               12            |
| DW400  |           32            |               16            |
| DW500  |           32            |               20            |
| DW600  |           32            |               24            |
| DW1000 |           32            |               40            |
| DW1200 |           32            |               48            |
| DW1500 |           32            |               60            |
| DW2000 |           32            |               80            |
| DW3000 |           32            |              120            |
| DW6000 |           32            |              240            |

When one of these thresholds are met, new queries are queued.  Queued queries are executed in on a first in first out basis as other queries complete and the number of queries and slots fall below the limits.  

> [AZURE.NOTE]  SELECT queries executing exclusively on dynamic management views (DMVs) or catalog views are **not** governed by any of the concurrency limits.  This allows users to monitor the system regardless of the number of the number of queries executing on the system.

## Resource classes

Resource classes are an essential part of SQL Data Warehouse workload management as they allow more memory and or CPU cycles to be allocated to queries run by a given user.  There are four resource classes which can be assigned to a user in the form of a **database role**.  The four resource classes are **smallrc, mediumrc, largerc and xlargerc**.  Users in smallrc are given a smaller amount of memory and thus allow for higher concurrency.  In contrast, users assigned to xlargerc are given large amounts of memory and therefore less of these queries are allowed to run concurrently.

By default, each user is a member of the small resource class, smallrc.  The procedure `sp_addrolemember` is used to increase the resource class and `sp_droprolemember` is used to decrease the resource class.  For example, this command would increase the resource class of the loaduser to largerc:

```sql
EXEC sp_addrolemember 'largerc', 'loaduser'
```

A good practice is to create users which are permanently assigned to a resource class rather than changing the resource class of a user.  For example, loads to clustered columnstore tables create higher quality indexes when allocated more memory.  To ensure that loads have access to higher memory, create a user specifically for loading data and permanently assign this user to a higher resource class.

There are a few types of queries which do not benefit from a larger memory allocation and the system will ignore their resource class allocation and always run these queries in the small resource class instead.  Forcing these queries to always run in the small resource class allow for these queries to run when concurrency slots are under pressure and prevents these queres from consuming more slots than needed.  These [Resource class exceptions](#resource-class-exceptions) are covered later in this article.

A few more details on resource class:

- `ALTER ROLE` permission is required to change the resource class of a user.  
- While a user can be added to one or more of the higher resource classes, users will take on the attributes of the highest resource class to which they are assigned.  That is, if a user is assigned to both mediumrc and largerc, the higher resource class, largerc is the resource class that will be honored.  
- The resource class of the system administrative user cannot be changed.
 
More details and examples of creating users an assigning them to resource classes can be found in the [Managing users](#Managing-users) section at the end of this article.

## Memory allocation

There are pros and cons to increasing a user's resource class. While increasing a resource class for a user may mean their queries have access to more memory and may execute faster, higher resource classes also reduces the number of concurrent queries that can run. This is the trade-off between allocating large amounts of memory to a single query and allowing other queries to run concurrently, which also need memory allocations. If one user is given high allocations of memory for a query, other users will not have access to that same memory in order to run a query.

The following table maps the memory allocated to each distribution by DWU and resource class.  In SQL Data Warehouse there are 60 distributions per database.  For example, a query running on a DW2000 in the xlarge resource class would have access to 6,400 MB within each of the 60 distributed databases.

### Memory allocations per distribution (MB)

|  DWU   | smallrc | mediumrc | largerc | xlargerc |
| :----- | :-----: | :------: | :-----: | :------: |
| DW100  |   100   |    100   |    200  |    400   |
| DW200  |   100   |    200   |    400  |    800   |
| DW300  |   100   |    200   |    400  |    800   |
| DW400  |   100   |    400   |    800  |  1,600   |
| DW500  |   100   |    400   |    800  |  1,600   |
| DW600  |   100   |    400   |    800  |  1,600   |
| DW1000 |   100   |    800   |  1,600  |  3,200   |
| DW1200 |   100   |    800   |  1,600  |  3,200   |
| DW1500 |   100   |    800   |  1,600  |  3,200   |
| DW2000 |   100   |  1,600   |  3,200  |  6,400   |
| DW3000 |   100   |  1,600   |  3,200  |  6,400   |
| DW6000 |   100   |  3,200   |  6,400  |  12,800  |


Using the same example above, system wide a query running on a DW2000 in the xlarge resource class is allocated a total of 375 GB of memory (6,400 MB * 60 distributions / 1,024 to convert to GB).

### Memory allocations system wide (GB)

|  DWU   | smallrc | mediumrc | largerc | xlargerc |
| :----- | :-----: | :------: | :-----: | :------: |
| DW100  |    6    |    6     |    12   |    23    |
| DW200  |    6    |    12    |    23   |    47    |
| DW300  |    6    |    12    |    23   |    47    |
| DW400  |    6    |    23    |    47   |    94    |
| DW500  |    6    |    23    |    47   |    94    |
| DW600  |    6    |    23    |    47   |    94    |
| DW1000 |    6    |    47    |    94   |   188    |
| DW1200 |    6    |    47    |    94   |   188    |
| DW1500 |    6    |    47    |    94   |   188    |
| DW2000 |    6    |    94    |   188   |   375    |
| DW3000 |    6    |    94    |   188   |   375    |
| DW6000 |    6    |   188    |   375   |   750    |


## Concurrency slot consumption

As mentioned above, the higher the resource class the more memory granted.  Since memory is a fixed resource, the more memory allocated per query, the less concurrency which can be supported.  The following table reiterates all of the above concepts in to a single view showing the number of concurrency slots available by DWU as well as the slots consumed by each resource class.

### Allocation and consumption of concurrency slots

|  DWU   | Max Concurrent Queries  | Concurrency Slots Allocated | Slots used by smallrc |  Slots used by mediumrc |  Slots used by largerc |  Slots used by xlargerc |
| :----  | :---------------------: | :-------------------------: | :-----: | :------: | :-----: | :------: |
| DW100  |           32            |                4            |    1    |     1    |    2    |    4     |
| DW200  |           32            |                8            |    1    |     2    |    4    |    8     |
| DW300  |           32            |               12            |    1    |     2    |    4    |    8     |
| DW400  |           32            |               16            |    1    |     4    |    8    |   16     |
| DW500  |           32            |               20            |    1    |     4    |    8    |   16     |
| DW600  |           32            |               24            |    1    |     4    |    8    |   16     |
| DW1000 |           32            |               40            |    1    |     8    |   16    |   32     |
| DW1200 |           32            |               48            |    1    |     8    |   16    |   32     |
| DW1500 |           32            |               60            |    1    |     8    |   16    |   32     |
| DW2000 |           32            |               80            |    1    |    16    |   32    |   64     |
| DW3000 |           32            |              120            |    1    |    16    |   32    |   64     |
| DW6000 |           32            |              240            |    1    |    32    |   64    |  128     |


From this table you can see that a SQL Data Warehouse running as DW1000 offers a total of 40 concurrency slots and a max of 32 concurrent queries.  If all users are running in the small resource class, 32 concurrent queries would be allowed as each of the queries would consume 1 concurrency slot.  If all users were running in medium resource class, each user would be allocated 800 MB per distribution for a total memory allocation of 47 GB and concurrency would be limited to 8 users.

## Query importance

Under the covers there are a total of eight workload groups which control the behavior of the resource classes.  However, only four of the eight workload groups are utilized at any given DWU.  This makes sense since each workload group is assigned to either smallrc, mediumrc, largerc, or xlargerc.  The importance of understanding these behind the scenes workload groups is that some of these workload groups are set to higher **IMPORTANCE**.  Importance is used for CPU scheduling.  Queries run with high importance will get 3X more CPU cycles than those with medium importance.  Therefore, concurrency slot mappings also determine CPU importance.  When a query consumes 16 or more slots, it runs as high importance.

Below are the importance mappings for each workload group.

| Workload groups | Concurrency Slot Mapping | Importance Mapping |
| :-------------- | :----------------------: | :----------------- |
| SloDWGroupC00   |            1             | Medium             |
| SloDWGroupC01   |            2             | Medium             |
| SloDWGroupC02   |            4             | Medium             |
| SloDWGroupC03   |            8             | Medium             |
| SloDWGroupC04   |           16             | High               |
| SloDWGroupC05   |           32             | High               |
| SloDWGroupC06   |           64             | High               |
| SloDWGroupC07   |          128             | High               |

For a DW500 SQL Data Warehouse, the active workload groups would be mapped to the resource classes as follows.

| Resource class | Workload Group | Concurrency Slots Used | Importance |
| :------------- | :------------- | :--------------------: | :--------- |
| smallrc        | SloDWGroupC00  |           1            | Medium     |
| mediumrc       | SloDWGroupC02  |           4            | Medium     |
| largerc        | SloDWGroupC03  |           8            | Medium     |
| xlargerc       | SloDWGroupC04  |          16            | High       |


The following DMV query can be used to look at the differences in memory resource allocation in detail from the perspective of the resource governor, or to analyze active and historic usage of the workload groups when troubleshooting:

```sql
WITH rg
AS
(   SELECT  
     pn.name						AS node_name
    ,pn.[type]						AS node_type
    ,pn.pdw_node_id					AS node_id
    ,rp.name						AS pool_name
    ,rp.max_memory_kb*1.0/1024				AS pool_max_mem_MB
    ,wg.name						AS group_name
    ,wg.importance					AS group_importance
    ,wg.request_max_memory_grant_percent		AS group_request_max_memory_grant_pcnt
    ,wg.max_dop						AS group_max_dop
    ,wg.effective_max_dop				AS group_effective_max_dop
    ,wg.total_request_count				AS group_total_request_count
    ,wg.total_queued_request_count			AS group_total_queued_request_count
    ,wg.active_request_count				AS group_active_request_count
    ,wg.queued_request_count				AS group_queued_request_count
    FROM    sys.dm_pdw_nodes_resource_governor_workload_groups wg
    JOIN    sys.dm_pdw_nodes_resource_governor_resource_pools rp    
            ON  wg.pdw_node_id  = rp.pdw_node_id
    	    AND wg.pool_id      = rp.pool_id
    JOIN    sys.dm_pdw_nodes pn	
            ON	wg.pdw_node_id	= pn.pdw_node_id
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

## Resource class exceptions

Most queries honor resource classes, however, there are some exceptions.  Typically, this occurs when the resources required to fulfil the action are low.  That is, the exceptions are generally cases where a query will never utilize the higher memory allocated by higher resource classes.  In these cases, the default or small resource class (smallrc) is always used regardless of the resource class assigned to the user. For example, `CREATE LOGIN` will always run in the smallrc. The resources required to fulfil this operation are very low and so it would not make sense to include the query in the concurrency slot model. It would be wasteful to pre-allocate large amounts of memory for this action. By excluding `CREATE LOGIN` from the concurrency slot model SQL Data Warehouse can be much more efficient.  

The following statements **do not** honor resource classes:

- CREATE or DROP TABLE
- ALTER TABLE ... SWITCH, SPLIT or MERGE PARTITION
- ALTER INDEX DISABLE
- DROP INDEX
- CREATE, UPDATE or DROP STATISTICS
- TRUNCATE TABLE
- ALTER AUTHORIZATION
- CREATE LOGIN
- CREATE, ALTER or DROP USER
- CREATE, ALTER or DROP PROCEDURE
- CREATE or DROP VIEW
- INSERT VALUES
- SELECT from system views and DMVs
- EXPLAIN
- DBCC

<!--
Removed as these two are not confirmed / supported under SQLDW
- CREATE REMOTE TABLE AS SELECT
- CREATE EXTERNAL TABLE AS SELECT
- REDISTRIBUTE
-->

### Queries which honor concurrency limits

It is important to remember that the majority of end user queries are likely to be governed by resource classes. The general rule is that the active query workload must fit inside both the concurrent query and concurrency slot thresholds unless it has been specifically excluded by the platform. As an end user you cannot choose to exclude a query from the concurrency slot model. Once either threshold has been exceeded queries will begin to queue. Queued queries will be addressed in priority order followed by submission time.

To reiterate, the following statements do **honor** resource classes:

- INSERT-SELECT
- UPDATE
- DELETE
- SELECT (when querying user tables)
- ALTER INDEX REBUILD
- ALTER INDEX REORGANIZE
- ALTER TABLE REBUILD
- CREATE INDEX
- CREATE CLUSTERED COLUMNSTORE INDEX
- CREATE TABLE AS SELECT
- Data loading
- Data movement operations conducted by the Data Movement Service (DMS)


## Managing users

1. **Create login:** Open a connection to the **master** database for your SQL Data Warehouse and execute the following commands.
	
	```sql
	CREATE LOGIN newperson WITH PASSWORD = 'mypassword';
	CREATE USER newperson for LOGIN newperson;
	```

	> [AZURE.NOTE] It is a good idea to create users for logins in the master database in both Azure SQL database and Azure SQL Data Warehouse. There are two server roles available at this level that require the login to have a user in master in order to grant membership. The roles are `Loginmanager` and `dbmanager`. In both Azure SQL database and SQL Data Warehouse these roles grant rights to manage logins and to create databases. This is different to SQL Server. For more details, please refer to the [Managing Databases and Logins in Azure SQL Database][] article for more details.

2. **Create user account:** Open a connection to the **SQL Data Warehouse database** and execute the following command.

	```sql
	CREATE USER newperson FOR LOGIN newperson;
	```

3. **Grant permissions:** The example below grants `CONTROL` on the SQL Data Warehouse database. `CONTROL` at the database level is the equivalent of db_owner in SQL Server.

	```sql
	GRANT CONTROL ON DATABASE::MySQLDW to newperson;
	```

4. **Increase resource class:** To add a user to a higher workload management role use the following query.

	```sql
	EXEC sp_addrolemember 'largerc', 'newperson'
	```

5. **Decrease resource class:** To remove a user from an workload management role use the following query.

	```sql
	EXEC sp_droprolemember 'largerc', 'newperson';
	```

	> [AZURE.NOTE] It is not possible to remove a user from the smallrc.

## Queued query detection and other DMVs

The `sys.dm_pdw_exec_requests` DMV can be used to identify queries that are waiting in a concurrency queue.

```sql
SELECT 	 r.[request_id]				 AS Request_ID
	,r.[status]				 AS Request_Status
	,r.[submit_time]			 AS Request_SubmitTime
	,r.[start_time]				 AS Request_StartTime
        ,DATEDIFF(ms,[submit_time],[start_time]) AS Request_InitiateDuration_ms
        ,r.resource_class                         AS Request_resource_class
FROM    sys.dm_pdw_exec_requests r;
```

Workload management roles can be viewed with `sys.database_principals`.

```sql
SELECT  ro.[name]           AS [db_role_name]
FROM    sys.database_principals ro
WHERE   ro.[type_desc]      = 'DATABASE_ROLE'
AND     ro.[is_fixed_role]  = 0;
```

The following query shows which role each user is assigned to.

```sql
SELECT	r.name AS role_principal_name
,		m.name AS member_principal_name
FROM	sys.database_role_members rm
JOIN	sys.database_principals AS r			ON rm.role_principal_id		= r.principal_id
JOIN	sys.database_principals AS m			ON rm.member_principal_id	= m.principal_id
WHERE	r.name IN ('mediumrc','largerc', 'xlargerc');
```

SQL Data Warehouse has the following wait types.

- LocalQueriesConcurrencyResourceType: Queries that sit outside of the concurrency slot framework. DMV queries and system functions such as `SELECT @@VERSION` are examples of local queries.
- UserConcurrencyResourceType: Queries that sit inside the concurrency slot framework. Queries against end user tables represent examples which would use this resource type.
- DmsConcurrencyResourceType: Waits resulting from data movement operations
- BackupConcurrencyResourceType: This wait indicates that a database is being backed up. The maximum value for this resource type is 1. If multiple backups have been requested at the same time the others will queue.

The `sys.dm_pdw_waits` DMV can be used to see what resources a request is waiting for. 

```sql
SELECT  w.[wait_id]
,       w.[session_id]
,       w.[type]			AS Wait_type
,       w.[object_type]
,       w.[object_name]
,       w.[request_id]
,       w.[request_time]
,       w.[acquire_time]
,       w.[state]
,       w.[priority]
,	SESSION_ID()			AS Current_session
,	s.[status]			AS Session_status
,	s.[login_name]
,	s.[query_count]
,	s.[client_id]
,	s.[sql_spid]
,	r.[command]			AS Request_command
,	r.[label]
,	r.[status]			AS Request_status
,	r.[submit_time]
,	r.[start_time]
,	r.[end_compile_time]
,	r.[end_time]
,	DATEDIFF(ms,r.[submit_time],r.[start_time])		AS Request_queue_time_ms
,	DATEDIFF(ms,r.[start_time],r.[end_compile_time])	AS Request_compile_time_ms
,	DATEDIFF(ms,r.[end_compile_time],r.[end_time])		AS Request_execution_time_ms
,	r.[total_elapsed_time]
FROM    sys.dm_pdw_waits w
JOIN    sys.dm_pdw_exec_sessions s  ON w.[session_id] = s.[session_id]
JOIN    sys.dm_pdw_exec_requests r  ON w.[request_id] = r.[request_id]
WHERE	w.[session_id] <> SESSION_ID();
```

The `sys.dm_pdw_resource_waits` DMV shows only the resource waits consumed by a given query.  Resource wait time only measures the time waiting for resources to be provided, as opposed to signal wait time, which is the time it takes for the underlying SQL Server's to schedule the query onto the CPU.

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
WHERE	[session_id] <> SESSION_ID();
```

The `sys.dm_pdw_wait_stats` DMV can be used for historic trend analysis of waits.

```sql
SELECT	w.[pdw_node_id]
,		w.[wait_name]
,		w.[max_wait_time]
,		w.[request_count]
,		w.[signal_time]
,		w.[completed_count]
,		w.[wait_time]
FROM	sys.dm_pdw_wait_stats w;
```

## Next steps

For more about managing database users and security, see [Secure a database in SQL Data Warehouse][].  For more about how larger resource classes can improve clustered columnstore index quality, see [Rebuilding indexes to improve segment quality].

<!--Image references-->

<!--Article references-->
[Secure a database in SQL Data Warehouse]: ./sql-data-warehouse-overview-manage-security.md
[Rebuilding indexes to improve segment quality]: ./sql-data-warehouse-tables-index.md#rebuilding-indexes-to-improve-segment-quality

<!--MSDN references-->
[Managing Databases and Logins in Azure SQL Database]:https://msdn.microsoft.com/library/azure/ee336235.aspx

<!--Other Web references-->
