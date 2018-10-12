---
title: Resource classes for workload management - Azure SQL Data Warehouse | Microsoft Docs
description: Guidance for using resource classes to manage concurrency and compute resources for queries in Azure SQL Data Warehouse.
services: sql-data-warehouse
author: ronortloff
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: manage
ms.date: 04/26/2018
ms.author: rortloff
ms.reviewer: igorstan
---

# Workload management with resource classes in Azure SQL Data Warehouse
Guidance for using resource classes to manage memory and concurrency for queries in your Azure SQL Data Warehouse.  
 
## What is workload management?
Workload management is the ability to optimize the overall performance of all queries. A well-tuned workload runs queries and load operations efficiently regardless of whether they are compute-intensive or IO-intensive.  SQL Data Warehouse provides workload management capabilities for multi-user environments. A data warehouse is not intended for multi-tenant workloads.

The performance capacity of a data warehouse is determined by the [data warehouse units](what-is-a-data-warehouse-unit-dwu-cdwu.md). 

- To view the memory and concurrency limits for all the performance profiles, see [Memory and concurrency limits](memory-and-concurrency-limits.md).
- To adjust performance capacity, you can [scale up or down](quickstart-scale-compute-portal.md).

The performance capacity of a query is determined by the query's resource class. The remainder of this article explains what resource classes are and how to adjust them.

## What are resource classes?
The performance capacity of a query is determined by the user's resource class.  Resource classes are pre-determined resource limits in Azure SQL Data Warehouse that govern compute resources and concurrency for query execution. Resource classes can help you manage your workload by setting limits on the number of queries that run concurrently and the compute-resources assigned to each query. There is a trade off between memory and concurrency.

- Smaller resource classes reduce the maximum memory per query, but increase concurrency.
- Larger resource classes increases the maximum memory per query, but reduce concurrency. 

There are two types of resource classes:

- Static resources classes, which are well suited for increased concurrency on a data set size that is fixed.
- Dynamic resource classes, which are well suited for data sets that are growing in size and increasing performance as the service level is scaled up.   

Resource classes use concurrency slots to measure resource consumption.  [Concurrency slots](#concurrency-slots) are explained later in this article. 

- To view the resource utilization for the resource classes, see [Memory and concurrency limits](memory-and-concurrency-limits.md#concurrency-maximums).
- To adjust the resource class, you can run the query under a different user or [change the current user's resource class](#change-a-users-resource-class) membership. 

### Static resource classes
Static resource classes allocate the same amount of memory regardless of the current performance level, which is measured in [data warehouse units](what-is-a-data-warehouse-unit-dwu-cdwu.md). Since queries get the same memory allocation regardless of the performance level, [scaling out the data warehouse](quickstart-scale-compute-portal.md) allows more queries to run within a resource class.  Static resource classes are ideal if the data volume is known and constant.

The static resource classes are implemented with these pre-defined database roles:

- staticrc10
- staticrc20
- staticrc30
- staticrc40
- staticrc50
- staticrc60
- staticrc70
- staticrc80

### Dynamic resource classes
Dynamic Resource Classes allocate a variable amount of memory depending on the current service level. While static resource classes are beneficial for higher concurrency and static data volumes, dynamic resource classes are better suited for a growing or variable amount of data.  When you scale up to a larger service level, your queries automatically get more memory.  

The dynamic resource classes are implemented with these pre-defined database roles:

- smallrc
- mediumrc
- largerc
- xlargerc 

### Gen2 dynamic resource classes are truly dynamic
When digging into the details of dynamic resource classes on Gen1, there are a few details that add additional complexity to understanding their behavior:

- The smallrc resources class operates with a fixed memory model like a static resource class.  Smallrc queries do not dynamically get more memory as the service level is increased.
- As service levels change, the available query concurrency can go up or down.
- Scaling services levels does not provide a proportional change the memory allocated to the same resource classes.

On **Gen2 only**, dynamic resource classes are truly dynamic addressing the points mentioned above.  The new rule is 3-10-22-70 for memory percentage allocations for small-medium-large-xlarge resource classes, **regardless of service level**.  The below table has the consolidated details of memory allocation percentages and the minimum number of concurrent queries that run, regardless of the service level.

| Resource Class | Percentage Memory | Min Concurrent Queries |
|:--------------:|:-----------------:|:----------------------:|
| smallrc        | 3%                | 32                     |
| mediumrc       | 10%               | 10                     |
| largerc        | 22%               | 4                      |
| xlargerc       | 70%               | 1                      |


### Default resource class
By default, each user is a member of the dynamic resource class **smallrc**. 

The resource class of the service administrator is fixed and cannot be changed.  The service administrator is the user created during the provisioning process.

> [!NOTE]
> Users or groups defined as Active Directory admin are also service administrators.
>
>

## Resource class operations

Resource classes are designed to improve performance for data management and manipulation activities. Complex queries can also benefit from running under a large resource class. For example, query performance for large joins and sorts can improve when the resource class is large enough to enable the query to execute in memory.

### Operations governed by resource classes

These operations are governed by resource classes:

* INSERT-SELECT, UPDATE, DELETE
* SELECT (when querying user tables)
* ALTER INDEX - REBUILD or REORGANIZE
* ALTER TABLE REBUILD
* CREATE INDEX
* CREATE CLUSTERED COLUMNSTORE INDEX
* CREATE TABLE AS SELECT (CTAS)
* Data loading
* Data movement operations conducted by the Data Movement Service (DMS)

> [!NOTE]  
> SELECT statements on dynamic management views (DMVs) or other system views are not governed by any of the concurrency limits. You can monitor the system regardless of the number of queries executing on it.
> 
> 

### Operations not governed by resource classes
Some queries always run in the smallrc resource class even though the user is a member of a larger resource class. These exempt queries do not count towards the concurrency limit. For example, if the concurrency limit is 16, many users can be selecting from system views without impacting the available concurrency slots.

The following statements are exempt from resource classes and always run in smallrc:

* CREATE or DROP TABLE
* ALTER TABLE ... SWITCH, SPLIT, or MERGE PARTITION
* ALTER INDEX DISABLE
* DROP INDEX
* CREATE, UPDATE, or DROP STATISTICS
* TRUNCATE TABLE
* ALTER AUTHORIZATION
* CREATE LOGIN
* CREATE, ALTER, or DROP USER
* CREATE, ALTER, or DROP PROCEDURE
* CREATE or DROP VIEW
* INSERT VALUES
* SELECT from system views and DMVs
* EXPLAIN
* DBCC

<!--
Removed as these two are not confirmed / supported under SQLDW
- CREATE REMOTE TABLE AS SELECT
- CREATE EXTERNAL TABLE AS SELECT
- REDISTRIBUTE
-->

## Concurrency slots
Concurrency slots are a convenient way to track the resources available for query execution. They are like tickets that you purchase to reserve seats at a concert because seating is limited. The total number of concurrency slots per data warehouse is determined by the service level. Before a query can start executing, it must be able to reserve enough concurrency slots. When a query finishes, it releases its concurrency slots.  

- A query running with 10 concurrency slots can access 5 times more compute resources than a query running with 2 concurrency slots.
- If each query requires 10 concurrency slots and there are 40 concurrency slots, then only 4 queries can run concurrently.
 
Only resource governed queries consume concurrency slots. System queries and some trivial queries do not consume any slots.The exact number of concurrency slots consumed is determined by the query's resource class.

## View the resource classes

Resource classes are implemented as pre-defined database roles. There are two types of resource classes: dynamic and static. To view a list of the resource classes, use the following query:

```sql
SELECT name 
FROM   sys.database_principals
WHERE  name LIKE '%rc%' AND type_desc = 'DATABASE_ROLE';
```

## Change a user's resource class

Resource classes are implemented by assigning users to database roles. When a user runs a query, the query runs with the user's resource class. For example, when a user is a member of the smallrc or staticrc10 database role, their queries run with small amounts of memory. When a database user is a member of the xlargerc or staticrc80 database roles, their queries run with large amounts of memory. 

To increase a user's resource class, use the stored procedure [sp_addrolemember](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-addrolemember-transact-sql). 

```sql
EXEC sp_addrolemember 'largerc', 'loaduser';
```

To decrease the resource class, use [sp_droprolemember](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-droprolemember-transact-sql).  

```sql
EXEC sp_droprolemember 'largerc', 'loaduser';
```

## Resource class precedence
Users can be members of multiple resource classes. When a user belongs to more than one resource class:

- Dynamic resource classes take precedence over static resource classes. For example, if a user is a member of both mediumrc(dynamic) and staticrc80 (static), queries run with mediumrc.
- Larger resource classes take precedence over smaller resource classes. For example, if a user is a member of mediumrc and largerc, queries run with largerc. Likewise, if a user is a member of both staticrc20 and statirc80, queries run with staticrc80 resource allocations.

## Recommendations
We recommend creating a user that is dedicated to running a specific type of query or load operations. Then give that user a permanent resource class instead of changing the resource class on a frequent basis. Given that static resource classes afford greater overall control on the workload we also suggest using those first before considering dynamic resource classes.

### Resource classes for load users
`CREATE TABLE` uses clustered columnstore indexes by default. Compressing data into a columnstore index is a memory-intensive operation, and memory pressure can reduce the index quality. Therefore, you are most likely to require a higher resource class when loading data. To ensure loads have enough memory, you can create a user that is designated for running loads and assign that user to a higher resource class.

The memory needed to process loads efficiently depends on the nature of the table loaded and the data size. For more information on memory requirements, see [Maximizing rowgroup quality](sql-data-warehouse-memory-optimizations-for-columnstore-compression.md).

Once you have determined the memory requirement, choose whether to assign the load user to a static or dynamic resource class.

- Use a static resource class when table memory requirements fall within a specific range. Loads run with appropriate memory. When you scale the data warehouse, the loads do not need more memory. By using a static resource class, the memory allocations stay constant. This consistency conserves memory and allows more queries to run concurrently. We recommend that new solutions use the static resource classes first as these provide greater control.
- Use a dynamic resource class when table memory requirements vary widely. Loads might require more memory than the current DWU or cDWU level provides. Therefore, scaling the data warehouse adds more memory to load operations, which allows loads to perform faster.

### Resource classes for queries

Some queries are compute-intensive and some are not.  

- Choose a dynamic resource class when queries are complex, but do not need high concurrency.  For example, generating daily or weekly reports is an occasional need for resources. If the reports are processing large amounts of data, scaling the data warehouse provides more memory to the user's existing resource class.
- Choose a static resource class when resource expectations vary throughout the day. For example, a static resource class works well when the data warehouse is queried by many people. When scaling the data warehouse, the amount of memory allocated to the user does not change. Consequently, more queries can be executed in parallel on the system.

Selecting a proper memory grant depends on many factors, such as the amount of data queried, the nature of the table schemas, and various join, select, and group predicates. In general, allocating more memory allows queries to complete faster, but reduces the overall concurrency. If concurrency is not an issue, over-allocating memory does not harm throughput. 

To tune performance, use different resource classes. The next section gives a stored procedure that helps you figure out the best resource class.

## Example code for finding the best resource class
 
You can use the following stored procedure on **Gen1 only** to figure out concurrency and memory grant per resource class at a given SLO and the closest best resource class for memory intensive CCI operations on non-partitioned CCI table at a given resource class:

Here's the purpose of this stored procedure:  
1. To see the concurrency and memory grant per resource class at a given SLO. User needs to provide NULL for both schema and tablename as shown in this example.  
2. To see the closest best resource class for the memory-intensive CCI operations (load, copy table, rebuild index, etc.) on non partitioned CCI table at a given resource class. The stored proc uses table schema to find out the required memory grant.

### Dependencies & Restrictions:
- This stored procedure is not designed to calculate the memory requirement for a partitioned cci table.    
- This stored procedure doesn't take memory requirement into account for the SELECT part of CTAS/INSERT-SELECT and assumes it is a SELECT.
- This stored procedure uses a temp table, which is available in the session where this stored procedure was created.    
- This stored procedure depends on the current offerings (for example, hardware configuration, DMS config), and if any of that changes then this stored proc does not work correctly.  
- This stored procedure depends on existing offered concurrency limit and if that changes then this stored procedure would not work correctly.  
- This stored procedure depends on existing resource class offerings and if that changes then this stored procedure would not work correctly.  

>  [!NOTE]  
>  If you are not getting output after executing stored procedure with parameters provided, then there could be two cases. <br />1. Either DW Parameter contains an invalid SLO value <br />2. Or, there is no matching resource class for the CCI operation on the table. <br />For example, at DW100, the highest memory grant available is 400 MB, and if table schema is wide enough to cross the requirement of 400 MB.
      
### Usage example:
Syntax:  
`EXEC dbo.prc_workload_management_by_DWU @DWU VARCHAR(7), @SCHEMA_NAME VARCHAR(128), @TABLE_NAME VARCHAR(128)`  
1. @DWU: Either provide a NULL parameter to extract the current DWU from the DW DB or provide any supported DWU in the form of 'DW100'
2. @SCHEMA_NAME: Provide a schema name of the table
3. @TABLE_NAME: Provide a table name of the interest

Examples executing this stored proc:  
```sql  
EXEC dbo.prc_workload_management_by_DWU 'DW2000', 'dbo', 'Table1';  
EXEC dbo.prc_workload_management_by_DWU NULL, 'dbo', 'Table1';  
EXEC dbo.prc_workload_management_by_DWU 'DW6000', NULL, NULL;  
EXEC dbo.prc_workload_management_by_DWU NULL, NULL, NULL;  
```
> [!NOTE]
> The values defined in this version of the stored procedure only apply to Gen1.
>
>

The following statement creates Table1 that is used in the preceding examples.
`CREATE TABLE Table1 (a int, b varchar(50), c decimal (18,10), d char(10), e varbinary(15), f float, g datetime, h date);`

### Stored procedure definition

```sql  
-------------------------------------------------------------------------------
-- Dropping prc_workload_management_by_DWU procedure if it exists.
-------------------------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'prc_workload_management_by_DWU')
DROP PROCEDURE dbo.prc_workload_management_by_DWU
GO

-------------------------------------------------------------------------------
-- Creating prc_workload_management_by_DWU.
-------------------------------------------------------------------------------
CREATE PROCEDURE dbo.prc_workload_management_by_DWU
(@DWU VARCHAR(7),
 @SCHEMA_NAME VARCHAR(128),
 @TABLE_NAME VARCHAR(128)
)
AS
IF @DWU IS NULL
BEGIN
-- Selecting proper DWU for the current DB if not specified.
SET @DWU = (
  SELECT 'DW'+CAST(COUNT(*)*100 AS VARCHAR(10))
  FROM sys.dm_pdw_nodes
  WHERE type = 'COMPUTE')
END

DECLARE @DWU_NUM INT
SET @DWU_NUM = CAST (SUBSTRING(@DWU, 3, LEN(@DWU)-2) AS INT)

-- Raise error if either schema name or table name is supplied but not both them supplied
--IF ((@SCHEMA_NAME IS NOT NULL AND @TABLE_NAME IS NULL) OR (@TABLE_NAME IS NULL AND @SCHEMA_NAME IS NOT NULL))
--     RAISEERROR('User need to supply either both Schema Name and Table Name or none of them')
       
-- Dropping temp table if exists.
IF OBJECT_ID('tempdb..#ref') IS NOT NULL
BEGIN
  DROP TABLE #ref;
END

-- Creating ref. temp table (CTAS) to hold mapping info.
-- CREATE TABLE #ref
CREATE TABLE #ref
WITH (DISTRIBUTION = ROUND_ROBIN)
AS 
WITH
-- Creating concurrency slots mapping for various DWUs.
alloc
AS
(
  SELECT 'DW100' AS DWU, 4 AS max_queries, 4 AS max_slots, 1 AS slots_used_smallrc, 1 AS slots_used_mediumrc,
        2 AS slots_used_largerc, 4 AS slots_used_xlargerc, 1 AS slots_used_staticrc10, 2 AS slots_used_staticrc20,
        4 AS slots_used_staticrc30, 4 AS slots_used_staticrc40, 4 AS slots_used_staticrc50,
        4 AS slots_used_staticrc60, 4 AS slots_used_staticrc70, 4 AS slots_used_staticrc80
  UNION ALL
    SELECT 'DW200', 8, 8, 1, 2, 4, 8, 1, 2, 4, 8, 8, 8, 8, 8
  UNION ALL
    SELECT 'DW300', 12, 12, 1, 2, 4, 8, 1, 2, 4, 8, 8, 8, 8, 8
  UNION ALL
    SELECT 'DW400', 16, 16, 1, 4, 8, 16, 1, 2, 4, 8, 16, 16, 16, 16
  UNION ALL
    SELECT 'DW500', 20, 20, 1, 4, 8, 16, 1, 2, 4, 8, 16, 16, 16, 16
  UNION ALL
    SELECT 'DW600', 24, 24, 1, 4, 8, 16, 1, 2, 4, 8, 16, 16, 16, 16
  UNION ALL
    SELECT 'DW1000', 32, 40, 1, 8, 16, 32, 1, 2, 4, 8, 16, 32, 32, 32
  UNION ALL
    SELECT 'DW1200', 32, 48, 1, 8, 16, 32, 1, 2, 4, 8, 16, 32, 32, 32
  UNION ALL
    SELECT 'DW1500', 32, 60, 1, 8, 16, 32, 1, 2, 4, 8, 16, 32, 32, 32
  UNION ALL
    SELECT 'DW2000', 32, 80, 1, 16, 32, 64, 1, 2, 4, 8, 16, 32, 64, 64
  UNION ALL
    SELECT 'DW3000', 32, 120, 1, 16, 32, 64, 1, 2, 4, 8, 16, 32, 64, 64
  UNION ALL
    SELECT 'DW6000', 32, 240, 1, 32, 64, 128, 1, 2, 4, 8, 16, 32, 64, 128
)
-- Creating workload mapping to their corresponding slot consumption and default memory grant.
,map
AS
(
  SELECT 'SloDWGroupC00' AS wg_name,1 AS slots_used,100 AS tgt_mem_grant_MB
  UNION ALL
    SELECT 'SloDWGroupC01',2,200
  UNION ALL
    SELECT 'SloDWGroupC02',4,400
  UNION ALL
    SELECT 'SloDWGroupC03',8,800
  UNION ALL
    SELECT 'SloDWGroupC04',16,1600
  UNION ALL
    SELECT 'SloDWGroupC05',32,3200
  UNION ALL
    SELECT 'SloDWGroupC06',64,6400
  UNION ALL
    SELECT 'SloDWGroupC07',128,12800
)
-- Creating ref based on current / asked DWU.
, ref
AS
(
  SELECT  a1.*
  ,       m1.wg_name          AS wg_name_smallrc
  ,       m1.tgt_mem_grant_MB AS tgt_mem_grant_MB_smallrc
  ,       m2.wg_name          AS wg_name_mediumrc
  ,       m2.tgt_mem_grant_MB AS tgt_mem_grant_MB_mediumrc
  ,       m3.wg_name          AS wg_name_largerc
  ,       m3.tgt_mem_grant_MB AS tgt_mem_grant_MB_largerc
  ,       m4.wg_name          AS wg_name_xlargerc
  ,       m4.tgt_mem_grant_MB AS tgt_mem_grant_MB_xlargerc
  ,       m5.wg_name          AS wg_name_staticrc10
  ,       m5.tgt_mem_grant_MB AS tgt_mem_grant_MB_staticrc10
  ,       m6.wg_name          AS wg_name_staticrc20
  ,       m6.tgt_mem_grant_MB AS tgt_mem_grant_MB_staticrc20
  ,       m7.wg_name          AS wg_name_staticrc30
  ,       m7.tgt_mem_grant_MB AS tgt_mem_grant_MB_staticrc30
  ,       m8.wg_name          AS wg_name_staticrc40
  ,       m8.tgt_mem_grant_MB AS tgt_mem_grant_MB_staticrc40
  ,       m9.wg_name          AS wg_name_staticrc50
  ,       m9.tgt_mem_grant_MB AS tgt_mem_grant_MB_staticrc50
  ,       m10.wg_name          AS wg_name_staticrc60
  ,       m10.tgt_mem_grant_MB AS tgt_mem_grant_MB_staticrc60
  ,       m11.wg_name          AS wg_name_staticrc70
  ,       m11.tgt_mem_grant_MB AS tgt_mem_grant_MB_staticrc70
  ,       m12.wg_name          AS wg_name_staticrc80
  ,       m12.tgt_mem_grant_MB AS tgt_mem_grant_MB_staticrc80
  FROM alloc a1
  JOIN map   m1  ON a1.slots_used_smallrc     = m1.slots_used
  JOIN map   m2  ON a1.slots_used_mediumrc    = m2.slots_used
  JOIN map   m3  ON a1.slots_used_largerc     = m3.slots_used
  JOIN map   m4  ON a1.slots_used_xlargerc    = m4.slots_used
  JOIN map   m5  ON a1.slots_used_staticrc10    = m5.slots_used
  JOIN map   m6  ON a1.slots_used_staticrc20    = m6.slots_used
  JOIN map   m7  ON a1.slots_used_staticrc30    = m7.slots_used
  JOIN map   m8  ON a1.slots_used_staticrc40    = m8.slots_used
  JOIN map   m9  ON a1.slots_used_staticrc50    = m9.slots_used
  JOIN map   m10  ON a1.slots_used_staticrc60    = m10.slots_used
  JOIN map   m11  ON a1.slots_used_staticrc70    = m11.slots_used
  JOIN map   m12  ON a1.slots_used_staticrc80    = m12.slots_used
-- WHERE   a1.DWU = @DWU
  WHERE   a1.DWU = UPPER(@DWU)
)
SELECT  DWU
,       max_queries
,       max_slots
,       slots_used
,       wg_name
,       tgt_mem_grant_MB
,       up1 as rc
,       (ROW_NUMBER() OVER(PARTITION BY DWU ORDER BY DWU)) as rc_id
FROM
(
    SELECT  DWU
    ,       max_queries
    ,       max_slots
    ,       slots_used
    ,       wg_name
    ,       tgt_mem_grant_MB
    ,       REVERSE(SUBSTRING(REVERSE(wg_names),1,CHARINDEX('_',REVERSE(wg_names),1)-1)) as up1
    ,       REVERSE(SUBSTRING(REVERSE(tgt_mem_grant_MBs),1,CHARINDEX('_',REVERSE(tgt_mem_grant_MBs),1)-1)) as up2
    ,       REVERSE(SUBSTRING(REVERSE(slots_used_all),1,CHARINDEX('_',REVERSE(slots_used_all),1)-1)) as up3
    FROM    ref AS r1
    UNPIVOT
    (
        wg_name FOR wg_names IN (wg_name_smallrc,wg_name_mediumrc,wg_name_largerc,wg_name_xlargerc,
        wg_name_staticrc10, wg_name_staticrc20, wg_name_staticrc30, wg_name_staticrc40, wg_name_staticrc50,
        wg_name_staticrc60, wg_name_staticrc70, wg_name_staticrc80)
    ) AS r2
    UNPIVOT
    (
        tgt_mem_grant_MB FOR tgt_mem_grant_MBs IN (tgt_mem_grant_MB_smallrc,tgt_mem_grant_MB_mediumrc,
        tgt_mem_grant_MB_largerc,tgt_mem_grant_MB_xlargerc, tgt_mem_grant_MB_staticrc10, tgt_mem_grant_MB_staticrc20,
        tgt_mem_grant_MB_staticrc30, tgt_mem_grant_MB_staticrc40, tgt_mem_grant_MB_staticrc50,
        tgt_mem_grant_MB_staticrc60, tgt_mem_grant_MB_staticrc70, tgt_mem_grant_MB_staticrc80)
    ) AS r3
    UNPIVOT
    (
        slots_used FOR slots_used_all IN (slots_used_smallrc,slots_used_mediumrc,slots_used_largerc,
        slots_used_xlargerc, slots_used_staticrc10, slots_used_staticrc20, slots_used_staticrc30,
        slots_used_staticrc40, slots_used_staticrc50, slots_used_staticrc60, slots_used_staticrc70,
        slots_used_staticrc80)
    ) AS r4
) a
WHERE   up1 = up2
AND     up1 = up3
;
-- Getting current info about workload groups.
WITH  
dmv  
AS  
(
  SELECT
          rp.name                                           AS rp_name
  ,       rp.max_memory_kb*1.0/1048576                      AS rp_max_mem_GB
  ,       (rp.max_memory_kb*1.0/1024)
          *(request_max_memory_grant_percent/100)           AS max_memory_grant_MB
  ,       (rp.max_memory_kb*1.0/1048576)
          *(request_max_memory_grant_percent/100)           AS max_memory_grant_GB
  ,       wg.name                                           AS wg_name
  ,       wg.importance                                     AS importance
  ,       wg.request_max_memory_grant_percent               AS request_max_memory_grant_percent
  FROM    sys.dm_pdw_nodes_resource_governor_workload_groups wg
  JOIN    sys.dm_pdw_nodes_resource_governor_resource_pools rp    ON  wg.pdw_node_id  = rp.pdw_node_id
                                                                  AND wg.pool_id      = rp.pool_id
  WHERE   rp.name = 'SloDWPool'
  GROUP BY
          rp.name
  ,       rp.max_memory_kb
  ,       wg.name
  ,       wg.importance
  ,       wg.request_max_memory_grant_percent
)
-- Creating resource class name mapping.
,names
AS
(
  SELECT 'smallrc' as resource_class, 1 as rc_id
  UNION ALL
    SELECT 'mediumrc', 2
  UNION ALL
    SELECT 'largerc', 3
  UNION ALL
    SELECT 'xlargerc', 4
  UNION ALL
    SELECT 'staticrc10', 5
  UNION ALL
    SELECT 'staticrc20', 6
  UNION ALL
    SELECT 'staticrc30', 7
  UNION ALL
    SELECT 'staticrc40', 8
  UNION ALL
    SELECT 'staticrc50', 9
  UNION ALL
    SELECT 'staticrc60', 10
  UNION ALL
    SELECT 'staticrc70', 11
  UNION ALL
    SELECT 'staticrc80', 12
)
,base AS
(   SELECT  schema_name
    ,       table_name
    ,       SUM(column_count)                   AS column_count
    ,       ISNULL(SUM(short_string_column_count),0)   AS short_string_column_count
    ,       ISNULL(SUM(long_string_column_count),0)    AS long_string_column_count
    FROM    (   SELECT  sm.name                                             AS schema_name
                ,       tb.name                                             AS table_name
                ,       COUNT(co.column_id)                                 AS column_count
                           ,       CASE    WHEN co.system_type_id IN (36,43,106,108,165,167,173,175,231,239) 
                                AND  co.max_length <= 32 
                                THEN COUNT(co.column_id) 
                        END                                                 AS short_string_column_count
                ,       CASE    WHEN co.system_type_id IN (165,167,173,175,231,239) 
                                AND  co.max_length > 32 and co.max_length <=8000
                                THEN COUNT(co.column_id) 
                        END                                                 AS long_string_column_count
                FROM    sys.schemas AS sm
                JOIN    sys.tables  AS tb   on sm.[schema_id] = tb.[schema_id]
                JOIN    sys.columns AS co   ON tb.[object_id] = co.[object_id]
                           WHERE tb.name = @TABLE_NAME AND sm.name = @SCHEMA_NAME
                GROUP BY sm.name
                ,        tb.name
                ,        co.system_type_id
                ,        co.max_length            ) a
GROUP BY schema_name
,        table_name
)
, size AS
(
SELECT  schema_name
,       table_name
,       75497472                                            AS table_overhead

,       column_count*1048576*8                              AS column_size
,       short_string_column_count*1048576*32                       AS short_string_size,       (long_string_column_count*16777216) AS long_string_size
FROM    base
UNION
SELECT CASE WHEN COUNT(*) = 0 THEN 'EMPTY' END as schema_name
         ,CASE WHEN COUNT(*) = 0 THEN 'EMPTY' END as table_name
         ,CASE WHEN COUNT(*) = 0 THEN 0 END as table_overhead
         ,CASE WHEN COUNT(*) = 0 THEN 0 END as column_size
         ,CASE WHEN COUNT(*) = 0 THEN 0 END as short_string_size

,CASE WHEN COUNT(*) = 0 THEN 0 END as long_string_size
FROM   base
)
, load_multiplier as 
(
SELECT  CASE 
                     WHEN FLOOR(8 * (CAST (@DWU_NUM AS FLOAT)/6000)) > 0 THEN FLOOR(8 * (CAST (@DWU_NUM AS FLOAT)/6000)) 
                     ELSE 1 
              END AS multipliplication_factor
) 
       SELECT  r1.DWU
       , schema_name
       , table_name
       , rc.resource_class as closest_rc_in_increasing_order
       , max_queries_at_this_rc = CASE
             WHEN (r1.max_slots / r1.slots_used > r1.max_queries)
                  THEN r1.max_queries
             ELSE r1.max_slots / r1.slots_used
                  END
       , r1.max_slots as max_concurrency_slots
       , r1.slots_used as required_slots_for_the_rc
       , r1.tgt_mem_grant_MB  as rc_mem_grant_MB
       , CAST((table_overhead*1.0+column_size+short_string_size+long_string_size)*multipliplication_factor/1048576    AS DECIMAL(18,2)) AS est_mem_grant_required_for_cci_operation_MB       
       FROM    size, load_multiplier, #ref r1, names  rc
       WHERE r1.rc_id=rc.rc_id
                     AND CAST((table_overhead*1.0+column_size+short_string_size+long_string_size)*multipliplication_factor/1048576    AS DECIMAL(18,2)) < r1.tgt_mem_grant_MB
       ORDER BY ABS(CAST((table_overhead*1.0+column_size+short_string_size+long_string_size)*multipliplication_factor/1048576    AS DECIMAL(18,2)) - r1.tgt_mem_grant_MB)
GO
```




## Next steps
For more information about managing database users and security, see [Secure a database in SQL Data Warehouse][Secure a database in SQL Data Warehouse]. For more information about how larger resource classes can improve clustered columnstore index quality, see [Memory optimizations for columnstore compression](sql-data-warehouse-memory-optimizations-for-columnstore-compression.md).

<!--Image references-->

<!--Article references-->
[Secure a database in SQL Data Warehouse]: ./sql-data-warehouse-overview-manage-security.md
[Rebuilding indexes to improve segment quality]: ./sql-data-warehouse-tables-index.md#rebuilding-indexes-to-improve-segment-quality
[Secure a database in SQL Data Warehouse]: ./sql-data-warehouse-overview-manage-security.md

<!--MSDN references-->
[Managing Databases and Logins in Azure SQL Database]:https://msdn.microsoft.com/library/azure/ee336235.aspx

<!--Other Web references-->
