---
title: Concurrency and workload management in SQL Data Warehouse | Microsoft Docs
description: Understand concurrency and workload management in Azure SQL Data Warehouse for developing solutions.
services: sql-data-warehouse
documentationcenter: NA
author: hirokib
manager: johnmac
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

*Concurrency slots* represent the reservation of total concurrency a particular query has based on its resource class. 

*Workload groups* assign *importance* to various resource classes, which manages the systems priority in granting resources.

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

Static resource classes (**staticrc10, staticrc20, staticrc30, staticrc40, staticrc50, staticrc60, staticrc70, staticrc80**) allocate the same amount of memory regardless of the current DWU provided that the current DWU has enough memory. On larger DWUs, you can run more queries concurrently with more granular static resource classes. **We recommend users to select static resource class assignments for most resource class assignments.**

#### Dynamic Resource Classes

Dynamic resource classes (**smallrc, mediumrc, largerc, xlargerc**) allocate a variable amount of memory depending on the current DWU. If you scale up to a larger DWU, your queries will automatically receive  more memory. 

### Memory allocation

Different resource classes offer benefits and drawbacks for users' queries. A larger resource class gives a user's queries access to more memory, which may mean queries execute faster.  However, higher resource classes also reduce the number of concurrent queries that can run. **This is the trade-off between allocating large amounts of memory to a single query or allowing other queries, which also need memory allocations, to run concurrently**.

Users in **smallrc** and **staticrc10** are given a smaller amount of memory and can take advantage of higher concurrency. In contrast, users assigned to **xlargerc** or **staticrc80** are given large amounts of memory, and therefore fewer of their queries can run
concurrently.

For memory mappings of resource classes, visit [memory allocation mappings][memory allocation mappings].

### Query importance

SQL Data Warehouse implements resource classes by using workload groups. There are a total of eight workload groups that control the behavior of the resource classes across the various DWU sizes. Workload groups control the *importance* of queries, which in turn affect the priority of resource allocation to those queries. Importance is used for CPU scheduling. Queries run with *high importance* receive three times more CPU cycles than those with *medium importance*. Therefore, concurrency slot mappings also determine CPU priority. When a query consumes 16 or more slots, it runs as high importance. By extension, the resource class is mapped directly to the assignment of *importance* to a query.

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

Some queries do not honor the resource class to which the user is assigned. These exceptions to the concurrency limits are made when the memory resources needed for a particular command are low, often because the command is a metadata operation. The goal of these exceptions is to avoid larger memory allocations for queries that do not need significant amounts of memory. In these cases, the default small resource class (smallrc) is always used regardless of the actual resource class assigned to the user. For example, `CREATE LOGIN` will always run in smallrc. The resources required to fulfill this operation are low, so it does not make sense to include the query in the concurrency slot model.  These queries are also not limited by the 32 user concurrency limit, an unlimited number of these queries can run up to the session limit of 1,024 sessions.

The following statements do not honor resource classes:

- CREATE or DROP TABLE
- ALTER TABLE ... SWITCH, SPLIT, or MERGE PARTITION
- ALTER INDEX DISABLE
- DROP INDEX
- CREATE, UPDATE, or DROP STATISTICS
- TRUNCATE TABLE
- ALTER AUTHORIZATION
- CREATE LOGIN
- CREATE, ALTER, or DROP USER
- CREATE, ALTER, or DROP PROCEDURE
- CREATE or DROP VIEW
- INSERT VALUES
- SELECT from system views and DMVs
- EXPLAIN
- DBCC

## Selecting proper resource class

A good practice is to permanently assign users to a resource class rather than changing their resource classes. For example, loads to clustered columnstore tables create higher-quality indexes when allocated more memory. To ensure that loads have access to higher memory, create a user specifically for loading data and permanently assign this user to a higher resource class.

### Resource classes and loading

1. If the expectations are loads with regular amount of data, a static resource class is a good choice. Later, when scaling up to get more computational power, the data warehouse will be able to run more concurrent queries out-of-the-box, as the load user does not consume more memory.
2. If the expectations are bigger loads in some occasions, a dynamic resource class is a good choice. Later, when scaling up to get more computational power, the load user will get more memory out-of-the-box, hence allowing the load to perform faster.

The memory needed to process loads efficiently depends on the nature of the table loaded and the amount of data processed. For instance, loading data into CCI tables requires some memory to let CCI rowgroups reach optimality. 

As a best practice, one should use at least 200MB of memory for load queries.

### Resource classes and querying

Queries have different requirements depending on their complexity. Increasing memory per query or increasing the concurrency are both valid ways to augment overall throughput depending on the query needs.

1. If the expectations are regular, complex queries (for instance, to generate daily and weekly reports) and do not need to take advantage of concurrency, a dynamic resource class is a good choice. If the system has more data to process, scaling up the data warehouse will therefore automatically provide more memory to the user running the query.
2. If the expectations are variable or diurnal concurrency patterns (for instance if the database is queried through a web UI broadly accessible), a static resource class is a good choice. Later, when scaling up to data warehouse, the user associated with the static resource class will automatically be able to run more concurrent queries.

Selecting proper memory grant depending on the need of your query is non-trivial, as it depends on many factors, such as the amount of data queried, the nature of the table schemas, and various join, selection, and group predicates. From a general standpoint, allocating more memory allows queries to complete faster, but would reduce the overall concurrency. If concurrency is not an issue, over-allocating memory does not harm. To fine-tune throughput, trying various flavors of resource classes may be required.

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
