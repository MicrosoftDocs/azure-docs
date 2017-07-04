---
title: Design guidance for replicated tables - Azure SQL Data Warehouse | Microsoft Docs
description: High-level recommendations for designing replicated tables in your Azure SQL Data Warehouse schema. 
services: sql-data-warehouse
documentationcenter: NA
author: ronortloff
manager: jhubbard
editor: ''

ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: tables
ms.date: 07/04/2017	
ms.author: rortloff;barbkess

---

# Design guidance for using replicated tables in Azure SQL Data Warehouse
These are recommendations for designing replicated tables in your SQL Data Warehouse schema. Leveraging these principles helps to improve query performance by reducing data movement, and the number of query steps.

## Prerequisites
This article assumes you are familiar with data distribution and data movement concepts in SQL Data Warehouse.  For more information, see [Distributing tables](sql-data-warehouse-tables-distribute). 

 
## What is a replicated table?

A replicated table is a table for which all rows are accessible on each Compute node. Unlike a distributed table that might incur data movement during query execution, a replicated table does not require data movement during queries. 

To create a replicated table, use one of these statements:

- [CREATE TABLE (Azure SQL Data Warehouse)](https://docs.microsoft.com/sql/t-sql/statements/create-table-azure-sql-data-warehouse)
- [CREATE TABLE AS SELECT (Azure SQL Data Warehouse](https://docs.microsoft.com/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse)

### Replicated tables use a persisted cache
In SQL Data Warehouse, a full copy of each replicated table is accessible from one distribution database on each Compute node. The table is permanently stored in Azure storage, and the data is cached to each Compute node. The needs to be rebuilt after data modifications. Therefore, when designing replicated tables, consider the impact of the cache on performance.  

These operations require a replicated table cache rebuild:

- Loading or modifying data in the table
- Scaling the data warehouse

These operations do not require a replicated table cache rebuild:

- pause
- resume

SQL Data Warehouse does not rebuild the cache immediately after data is changed or the data warehouse is scaled.  When a rebuild is required, the rebuild happens upon the first select from the table.

## Use replicated tables for small dimension tables
Before designing your schema with replicated tables, understand as much as possible about your data and how the data will be queried.  For example, consider these questions:

- How large is the table?   
- How often is the table refreshed?   
- Do I have fact and dimension tables in a data warehouse?   

Replicated tables typically work well for small dimension tables in a star schema. Dimension tables are usually of a size that makes it feasible to store multiple copies. Dimensions store descriptive data that changes slowly, such as customer name and address, product skus, or product information. The slowly changing nature of the data leads to fewer rebuilds of the replicated table cache. 
 
Consider using a replicated table when:

- The table size is less than 5 GB, regardless of the number of rows. To find the size of a table, use the [DBCC PDW_SHOWSPACEUSED](https://docs.microsoft.com/en-us/sql/t-sql/database-console-commands/dbcc-pdw-showspaceused-transact-sql) command: `DBCC PDW_SHOWSPACEUSED('ReplTableCandidate')`. 
- The table is used in distribution-incompatible joins. These are joins that require data movement because the joins are not on the same distribution column of hash-distributed tables. Joining a hash-distributed table to a replicated table does not require data movement.

Consider converting an existing distributed table to a replicated table when:

- Query plans use data movement operations that broadcast the data to all the Compute nodes. The BroadcastMoveOperation is expensive and slows query performance. To view data movement operations in query plans, use [sys.dm_pdw_request_steps](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-request-steps-transact-sql).
 
Avoid using a replicated table when:

- The table has frequent insert, update and delete operations. These data manipulation language (DML) operations invalidate the replicated table cache, which forces a rebuild. When a table has continual updates and selects, the cache is continually rebuilt, which slows performance.
- The data warehouse is scaled frequently. Scaling a data warehouse changes the number of Compute nodes, which incurs a cache rebuild.
- The table has a large number of columns, but data operations typically access only a small number of columns. In this scenario, instead of replicating the entire table, it might be more effective to hash distribute the table, and then create an index on the frequently accessed columns. Even if the index does not reduce data movement, SQL Data Warehouse will only need to move data in the requested columns. 

## Convert existing round-robin tables to replicated tables.
If you already have round-robin tables, we recommend converting them to replicated tables. Replicated tables improve performance over round-robin tables because they eliminate the need for data movement.  A round-robin table always requires data movement for joins. 
 
A typical data warehouse has one or more large fact tables that are hash distributed  and many small dimension tables that are replicated or distributed with round-robin. Here is a query againt the TPC-H schema: 
 
```sql
  SELECT COUNT_BIG(*)  
  FROM lineitem l 
  INNER JOIN supplier s  
    ON s.s_suppkey = l.l_suppkey 
  INNER JOIN nation n 
    ON n.n_nationkey = s.s_nationkey 
  INNER JOIN region r 
    ON r.r_regionkey = n.n_regionkey 
  WHERE r.r_name = 'America' 
```
 
For the 10 TB TPC-H database, the lineitem fact table has 60 billion rows and is hash-distributed. The supplier, nation, and region tables are smaller dimension table. If the dimension tables are round-robin distributed, the query requires that each dimension table is copied in full to each Compute node. To move the data, the query plan contains an operation called BroadcastMoveOperation. This type of data movement operation slows query performance and is eliminated by using replicated tables.

To view query plan steps, use the [sys.dm_pdw_request_steps](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-request-steps-transact-sql) system catalog view. This example shows the difference in the query steps for round-robin versus replicated dimension tables.
   
|Step index | Round-Robin operations     | Replicated operations  |
|:----------|:---------------------------|:-----------------------|
| 0         | RandomIDOperation          | RandomIDOperation      |
| 1         | OnOperation                | OnOperation            |
| 2         | BroadcastMoveOperation     | BroadcastMoveOperation |
| 3         | RandomIDOperation          | RandomIDOperation      |
| 4         | OnOperation                | |
| 5         | BroadcastMoveOperation     | |
| 6         | OnOperation                | |
| 7         | RandomIDOperation          | |
| 8         | OnOperation                | |
| 9         | BroadcastMoveOperation     | |
| 10        | OnOperation                | |
| 11        | OnOperation                | |
| 12        | PartitionMoveOperation     | |
| 13        | OnOperation                | |
| 14        | ReturnOperation            | |
| 15        | OnOperation                | |

## Use replicated tables with simple query predicates
Before you choose to distribute or replicate a table, think about the types of queries you plan to run against the table. Whenever possible,

- Use replicated tables for queries with simple query predicates, such as equality or inequality.
- Use distributed tables for queries with complex query predicates, such as LIKE or NOT LIKE.

CPU-intensive queries perform best when the work is distributed across all of the Compute nodes. For example, queries that run computations on each row of a table perform better on distributed tables than replicated tables. Since a replicated table is stored in full on each Compute node, a CPU-intensive query against a replicated table runs against the entire table on every Compute node. The extra computation can slow query performance.

For example, this query has a complex predicate.  It runs faster when supplier is a distributed table instead of a replicated table. In this example, supplier can be hash-distributed or round-robin distributed.

```sql
SELECT s_suppkey 
FROM supplier 
WHERE s_comment LIKE '%Customer%Complaints%'  
```

## Use indexes sparingly
Although standard indexing practices apply to replicated tables, in SQL Data Warehouse each index incurs an additional cost when the replicated table cache is rebuilt. For every replicated cache build, SQL Data Warehouse first creates the cache, and then creates the indexes. Only use indexes when the performance gain outweighs the cost of rebuilding the indexes.  
 
## Load data with batching to reduce the cache rebuilds 
When loading data into replicated tables, try to minimize the number of cache rebuilds by batching loads together. Perform all the batched loads before running select statements.

For example, this load pattern loads data from 4 sources and invokes four cache rebuilds. 

- Load data from source 1 into a replicated table
- Select from the replicated table. This invokes cache rebuild #1.
- Load data from source 2 into the same replicated table.
- Select from the replicated table. This invokes cache rebuild #2.
- Load data from source 3 into the same replicated table.
- Select from the replicated table. This invokes cache rebuild #3.
- Load data from source 4 into the same replicated table.
- Select from the replicated table. This invokes cache rebuild #4.

For example, this load pattern loads data from 4 sources, but only invokes one cache rebuild.

- Load data from source 1 into a replicated table.
- Load data from source 2 into the same replicated table.
- Load data from source 3 into the same replicated table.
- Load data from source 4 into the same replicated table.
- Select from the replicated table. This invokes cache rebuild #1.


## Rebuild the replicated table cache after loading data
To ensure consistent query execution times, we recommend rebuilding the replicated table cache after completing a batched load. If the table cache is not rebuilt after a load, the first query must wait for the replicated cache and the indexes to be rebuilt.
Depending on the size and number of replicated table caches, the performance impact could be significant.  

### To rebuild the cache

Use this query to get a list of replicated tables that need a cache rebuild.

```sql 
SELECT t.name 
  FROM sys.tables t  
  JOIN sys.pdw_replicated_table_cache_state c  
    ON c.object_id = t.object_id 
  JOIN sys.pdw_table_distribution_properties p 
    ON p.object_id = t.object_id 
  WHERE c.[state] = 'Not built' 
    AND p.[distribution] = 'Replicate'
```
 
To force a cache rebuild, run the following statement on each table in the above output. 

```sql
SELECT TOP 1 * FROM [ReplicatedTable]
``` 
 
## Next Steps 
To design distributed tables, see [distributed tables](sql-data-warehouse-tables-distribute).



