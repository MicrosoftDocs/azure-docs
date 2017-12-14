---
title: Concurrency and workload management in SQL Data Warehouse | Microsoft Docs
description: Understand concurrency and workload management in Azure SQL Data Warehouse for developing solutions.
services: sql-data-warehouse
documentationcenter: NA
author: hirokib
manager: jhubbard
editor: ''

ms.assetid: ef170f39-ae24-4b04-af76-53bb4c4d16d4
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: performance
ms.date: 08/23/2017
ms.author: elbutter

---

#Introduction to workload management

Workload management is the management of system resources to enable prioritization, performance, and predictability of queries in a database system. Workload management controls among other things, the amount of memory each query receives, concurrency, and prioritization of queries. To ensure predictable performance at scale, SQL Data Warehouse allows you to control resource allocations such as memory and CPU prioritization. SQL Data Warehouse workload management is intended to help you support multi-user environments. It is not intended for multi-tenant workloads.

## Workload management in SQL Data Warehouse

Workload management in SQL Data Warehouse is governed by the use of resource classes, concurrency slots, and workload groups. 

*Resource classes* assign a set amount of system resources such as memory to users. 

*Concurrency slots* represent the reservation of total concurrency a particular query will have based on its resource class. 

*Workload groups* assigns *importance* to various resource classes which manages the systems priority in granting resources.

Users should focus on workload management to:

- Ensure queries are prioritized according to business need
- Ensure predictable query performance
- Maximize the number of queries that are handled by the system concurrently
- Maximize query performance
- Optimize index quality
- Prevent system bottlenecks

## Concurrency

SQL Data Warehouse allows up to 1,024 concurrent connections. All 1,024 connections can submit queries concurrently. However, to optimize throughput, SQL Data Warehouse may queue some queries to ensure that each query receives a minimal memory grant. **Queuing occurs at query execution time**. By queuing queries when concurrency limits are reached, SQL Data Warehouse can increase total throughput by ensuring that active queries get access to critically needed memory resources.  

Concurrency limits are governed by two concepts: *concurrent queries* and *concurrency slots*. For a query to execute, it must execute within both the query concurrency limit and the concurrency slot allocation.

- Concurrent queries are the queries executing at the same time. SQL Data Warehouse supports up to 32 concurrent queries on the larger DWU sizes.
- Concurrency slots are allocated based on DWU. Each 100 DWU provides 4 concurrency slots. For example, a DW100 allocates 4 concurrency slots and DW1000 allocates 40. Each query consumes one or more concurrency slots, dependent on the [resource class](#resource-class-overview) of the query. 

When concurrency limits are met, new queries are queued and executed on a first-in, first-out basis.  As a queries finishes and the number of queries and slots falls below the limits, queued queries are released. 

> [!NOTE]  
> *Select* queries executing exclusively on dynamic management views (DMVs) or catalog views are not governed by any of the concurrency limits. You can monitor the system regardless of the number of queries executing on it.
>
> 

For concurrency limits based on DWU sizes, visit [concurrency limits][concurrency limits].

## Resource class overview

Resource classes help you control memory allocation and CPU cycles given to a query. Resource classes are assigned to individual users. Therefore, each query statement submitted by the user in turn receives all of the resources granted to it by its resource class assignment. The amount of resources granted to a all users' queries in turn dictates the number of queries that may run concurrently. 

### Resource class types

#### Static Resource Classes

Static resource classes (**staticrc10, staticrc20, staticrc30, staticrc40, staticrc50, staticrc60, staticrc70, staticrc80**) allocate the same amount of memory regardless of the current DWU provided that the current DWU has enough memory. This means that on larger DWUs, you can run more queries in each resource class concurrently. **We recommend users to select static resource class assignments for most resource class assignments.**

#### Dynamic Resource Classes

Dynamic resource classes (**smallrc, mediumrc, largerc, xlargerc**) allocate a variable amount of memory depending on the current DWU. This means that when you scale up to a larger DWU, your queries automatically get more memory. 

### Memory allocation

Different resource classes offer benefits and drawbacks for users' queries. A larger resource class gives a user's queries access to more memory, which may mean queries execute faster.  However, higher resource classes also reduce the number of concurrent queries that can run. **This is the trade-off between allocating large amounts of memory to a single query or allowing other queries, which also need memory allocations, to run concurrently**. If one user is given high allocations of memory for a query, other users will not have access to that same memory to run a query.

Users in **smallrc** and **staticrc10** are given a smaller amount of memory and can take advantage of higher concurrency. In contrast, users assigned to **xlargerc** or **staticrc80** are given large amounts of memory, and therefore fewer of their queries can run
concurrently.

For memory mappings of resource classes, visit [memory allocation mappings][memory allocation mappings].

### Query importance

SQL Data Warehouse implements resource classes by using workload groups. There are a total of eight workload groups that control the behavior of the resource classes across the various DWU sizes. Workload groups control the *importance* of query which affects the priority of resource allocation to queries.. Importance is used for CPU scheduling. Queries run with high importance will get three times more CPU cycles than those with medium importance. Therefore, concurrency slot mappings also determine CPU priority. When a query consumes 16 or more slots, it runs as high importance. By extension, the resource class is mapped directly to the assignment of *importance* to a query.

For workload group assignments to resource classes, visit [workload group mappings][workload group mappings].

### Details on resource class assignment

A few more details on resource class:

- *Alter role* permission is required to change the resource class of a user.
- Adding or removing roles in SQL Data Warehouse is done through [sp_addrolemember](/sql/t-sql/statements/sp-addrolemember-transact-sql) and [sp_droprolemember](/sql/t-sql/statements/sp-droprolemember-transact-sql)
- Although you can add a user to one or more of the higher resource classes, dynamic resource classes take precedence over static resource classes. That is, if a user is assigned to both **mediumrc**(dynamic) and **staticrc80**(static), **mediumrc** is the resource class that is honored.
- When a user is assigned to more than one resource class in a specific resource class type (more than one dynamic resource class or more than one static resource class), the highest resource class is honored. That is, if a user is assigned to both mediumrc and largerc, the higher resource class (largerc) is honored. And if a user is assigned to both **staticrc20** and **statirc80**, **staticrc80** is honored.
- The resource class of the system administrative user **cannot** be changed.

## Queries that honor concurrency limits

Most queries are governed by resource classes. These queries must fit inside both the concurrent query and concurrency slot thresholds. A user cannot choose to exclude a query from the concurrency slot model.

To reiterate, the following statements honor resource classes:

- INSERT-SELECT
- UPDATE
- DELETE
- SELECT (when querying user tables)
- ALTER INDEX REBUILD
- ALTER INDEX REORGANIZE
- ALTER TABLE REBUILD
- CREATE INDEX
- CREATE CLUSTERED COLUMNSTORE INDEX
- CREATE TABLE AS SELECT (CTAS)
- Data loading
- Data movement operations conducted by the Data Movement Service (DMS)

## Query exceptions to concurrency limits

Some queries do not honor the resource class to which the user is assigned. These exceptions to the concurrency limits are made when the memory resources needed for a particular command are low, often because the command is a metadata operation. The goal of these exceptions is to avoid larger memory allocations for queries that will never need them. In these cases, the default small resource class (smallrc) is always used regardless of the actual resource class assigned to the user. For example, `CREATE LOGIN` will always run in smallrc. The resources required to fulfill this operation are very low, so it does not make sense to include the query in the concurrency slot model.  These queries are also not limited by the 32 user concurrency limit, an unlimited number of these queries can run up to the session limit of 1,024 sessions.

The following statements do not honor resource classes:

- CREATE or DROP TABLE
- ALTER TABLE ... SWITCH, SPLIT, or MERGE PARTITION
- ALTER INDEX DISABLE
- DROP INDEX
- CREATE, UPDATE, or DROP STATISTICS
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

## Selecting proper resource class

A good practice is to permanently assign users to a resource class rather than changing their resource classes. For example, loads to clustered columnstore tables create higher-quality indexes when allocated more memory. To ensure that loads have access to higher memory, create a user specifically for loading data and permanently assign this user to a higher resource class.
There are a couple of best practices to follow here. As mentioned above, SQL DW supports two kinds of resource class types: static resource classes and dynamic resource classes.

### Resource classes and loading

1. If the expectations are loads with regular amount of data, a static resource class is a good choice. Later, when scaling up to get more computational power, the data warehouse will be able to run more concurrent queries out-of-the-box, as the load user does not consume more memory.
2. If the expectations are bigger loads in some occasions, a dynamic resource class is a good choice. Later, when scaling up to get more computational power, the load user will get more memory out-of-the-box, hence allowing the load to perform faster.

The memory needed to process loads efficiently depends on the nature of the table loaded and the amount of data processed. For instance, loading data into CCI tables requires some memory to let CCI rowgroups reach optimality. For more details, see the Columnstore indexes - data loading guidance.

As a best practice, we advise you to use at least 200MB of memory for loads.

### Resource classes and querying

Queries have different requirements depending on their complexity. Increasing memory per query or increasing the concurrency are both valid ways to augment overall throughput depending on the query needs.

1. If the expectations are regular, complex queries (for instance, to generate daily and weekly reports) and do not need to take advantage of concurrency, a dynamic resource class is a good choice. If the system has more data to process, scaling up the data warehouse will therefore automatically provide more memory to the user running the query.
2. If the expectations are variable or diurnal concurrency patterns (for instance if the database is queried through a web UI broadly accessible), a static resource class is a good choice. Later, when scaling up to data warehouse, the user associated with the static resource class will automatically be able to run more concurrent queries.

Selecting proper memory grant depending on the need of your query is non-trivial, as it depends on many factors, such as the amount of data queried, the nature of the table schemas, and various join, selection, and group predicates. From a general standpoint, allocating more memory will allow queries to complete faster, but would reduce the overall concurrency. If concurrency is not an issue, over-allocating memory does not harm. To fine-tune throughput, trying various flavors of resource classes may be required.

### Identifying proper resource classes

You can use the following stored procedure to figure out concurrency and memory grant per resource class at a given SLO and the closest best resource class for memory intensive CCI operations on non-partitioned CCI table at a given resource class.

This stored procedure will:

1. To help user figure out concurrency and memory grant per resource class at a given SLO. User needs to provide NULL for both schema and table name for this as shown in the example below.  
2. To help user figure out the closest best resource class for the memory intensed CCI operations (load, copy table, rebuild index, etc.) on non partitioned CCI table at a given resource class. The stored proc uses table schema to find out the required memory grant for this.

#### Dependencies & Restrictions

- This stored proc is not designed to calculate memory requirement for partitioned-cci table.    
- This stored proc doesn't take memory requirement into account for the SELECT part of CTAS/INSERT-SELECT and assumes it to be a simple SELECT.
- This stored proc uses a temp table so this can be used in the session where this stored proc was created.    
- This stored proc depends on the current offerings (e.g. hardware configuration, DMS config) and if any of that changes then this stored proc would not work correctly.  
- This stored proc depends on existing offered concurrency limit and if that changes then this stored proc would not work correctly.  
- This stored proc depends on existing resource class offerings and if that changes then this stored proc wuold not work correctly.  

> [!NOTE]  
> If you are not getting output after executing stored procedure with parameters provided then there could be two cases. <br />1. Either DW Parameter contains invalid SLO value <br />2. OR there are no matching resource class for CCI operation if table name was provided. <br />For example, at DW100, highest memory grant available is 400MB and if table schema is wide enough to cross the requirement of 400MB.

#### Usage example

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

Table1 used in the above examples could be created as below:  
`CREATE TABLE Table1 (a int, b varchar(50), c decimal (18,10), d char(10), e varbinary(15), f float, g datetime, h date);`

#### Stored procedure

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
(   @DWU VARCHAR(7),
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

-- Creating ref. temptable (CTAS) to hold mapping info.
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

### Detecting queued queries and other DMVs

You can use the `sys.dm_pdw_exec_requests` DMV to identify queries that are waiting in a concurrency queue. Queries waiting for a concurrency slot will have a status of **suspended**.

```sql
SELECT      r.[request_id]                 AS Request_ID
        ,r.[status]                 AS Request_Status
        ,r.[submit_time]             AS Request_SubmitTime
        ,r.[start_time]                 AS Request_StartTime
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
SELECT     r.name AS role_principal_name
        ,m.name AS member_principal_name
FROM    sys.database_role_members rm
JOIN    sys.database_principals AS r            ON rm.role_principal_id        = r.principal_id
JOIN    sys.database_principals AS m            ON rm.member_principal_id    = m.principal_id
WHERE    r.name IN ('mediumrc','largerc', 'xlargerc');
```

SQL Data Warehouse has the following wait types:

- **LocalQueriesConcurrencyResourceType**: Queries that sit outside of the concurrency slot framework. DMV queries and system functions such as `SELECT @@VERSION` are examples of local queries.
- **UserConcurrencyResourceType**: Queries that sit inside the concurrency slot framework. Queries against end-user tables represent examples that would use this resource type.
- **DmsConcurrencyResourceType**: Waits resulting from data movement operations.
- **BackupConcurrencyResourceType**: This wait indicates that a database is being backed up. The maximum value for this resource type is 1. If multiple backups have been requested at the same time, the others will queue.

The `sys.dm_pdw_waits` DMV can be used to see which resources a request is waiting for.

```sql
SELECT  w.[wait_id]
,       w.[session_id]
,       w.[type]            AS Wait_type
,       w.[object_type]
,       w.[object_name]
,       w.[request_id]
,       w.[request_time]
,       w.[acquire_time]
,       w.[state]
,       w.[priority]
,    SESSION_ID()            AS Current_session
,    s.[status]            AS Session_status
,    s.[login_name]
,    s.[query_count]
,    s.[client_id]
,    s.[sql_spid]
,    r.[command]            AS Request_command
,    r.[label]
,    r.[status]            AS Request_status
,    r.[submit_time]
,    r.[start_time]
,    r.[end_compile_time]
,    r.[end_time]
,    DATEDIFF(ms,r.[submit_time],r.[start_time])        AS Request_queue_time_ms
,    DATEDIFF(ms,r.[start_time],r.[end_compile_time])    AS Request_compile_time_ms
,    DATEDIFF(ms,r.[end_compile_time],r.[end_time])        AS Request_execution_time_ms
,    r.[total_elapsed_time]
FROM    sys.dm_pdw_waits w
JOIN    sys.dm_pdw_exec_sessions s  ON w.[session_id] = s.[session_id]
JOIN    sys.dm_pdw_exec_requests r  ON w.[request_id] = r.[request_id]
WHERE    w.[session_id] <> SESSION_ID();
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
WHERE    [session_id] <> SESSION_ID();
```

The `sys.dm_pdw_wait_stats` DMV can be used for historic trend analysis of waits.

```sql
SELECT    w.[pdw_node_id]
,        w.[wait_name]
,        w.[max_wait_time]
,        w.[request_count]
,        w.[signal_time]
,        w.[completed_count]
,        w.[wait_time]
FROM    sys.dm_pdw_wait_stats w;
```

## Next steps

For more information about managing database users and security, see [Secure a database in SQL Data Warehouse][Secure a database in SQL Data Warehouse]. For more information about how larger resource classes can improve clustered columnstore index quality, see [Rebuilding indexes to improve segment quality].

<!--Image references-->

<!--Article references-->

[memory allocation mappings]: ./workload-management-mappings.md#memory-allocations
[workload group mappings]: ./workload-management-mappings.md#workload-group-mappings
[concurrency slot mappings]: ./workload-management-mappings.md#concurrency-slot-consumption
[concurrency limits]: ./workload-management-mappings.md#concurrency-limits
[Rebuilding indexes to improve segment quality]: ./sql-data-warehouse-tables-index.md#rebuilding-indexes-to-improve-segment-quality
[Secure a database in SQL Data Warehouse]: ./sql-data-warehouse-overview-manage-security.md

<!--MSDN references-->

[Managing Databases and Logins in Azure SQL Database]: https://msdn.microsoft.com/library/azure/ee336235.aspx

<!--Other Web references-->