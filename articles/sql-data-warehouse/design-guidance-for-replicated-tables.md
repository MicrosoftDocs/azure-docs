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
ms.date: 07/12/2017	
ms.author: rortloff;barbkess

---

# Design guidance for using replicated tables in Azure SQL Data Warehouse
This article gives recommendations for designing replicated tables in your SQL Data Warehouse schema. Use these recommendations to improve query performance by reducing data movement and query complexity.

## Prerequisites
This article assumes you are familiar with data distribution and data movement concepts in SQL Data Warehouse.  For more information, see [Distributed tables](sql-data-warehouse-tables-distribute.md). 

 
## What is a replicated table?

A replicated table is a table for which all rows are accessible on each Compute node. Unlike a distributed table that might incur data movement during query execution, a replicated table does not require data movement during queries. 

### Replicated tables require rebuilds after modifications
SQL Data Warehouse implements a replicated table by maintaining a master version of the table and copying the master version in full to one distribution database on each Compute node. After data is modified in the master table, SQL Data Warehouse must rebuild the tables on each Compute node. A rebuild of a replicated table includes copying the table to each Compute node and then rebuilding the indexes.

A rebuild of a replicated table is required after data is loaded or modified, the data warehouse is scaled to a different DWU setting, or the table definition is changed. Pause and resume operations to not require a rebuild. The rebuild does not happen immediately after data is modified. Instead, the rebuild is triggered the first time a query selects from the table.

Rebuilding the replicated table can slow query performance. Therefore, when designing a replicated table, try to minimize the number of times the table is refreshed. We discuss ways to minimize rebuilds in the loading section.

## Use replicated tables for tables of size < 2 GB
As part of table design, understand as much as possible about your data and how the data is queried.  For example, consider these questions:

- How large is the table?   
- How often is the table refreshed?   
- Do I have fact and dimension tables in a data warehouse?   

Replicated tables typically work well for small dimension tables in a star schema. Dimension tables are usually of a size that makes it feasible to store and maintain multiple copies. Dimensions store descriptive data that changes slowly, such as customer name and address, and product details. The slowly changing nature of the data leads to fewer rebuilds of the replicated table. 
 
Consider using a replicated table when:

- The table size on disk is less than 2 GB, regardless of the number of rows. To find the size of a table, you can use the [DBCC PDW_SHOWSPACEUSED](https://docs.microsoft.com/en-us/sql/t-sql/database-console-commands/dbcc-pdw-showspaceused-transact-sql) command: `DBCC PDW_SHOWSPACEUSED('ReplTableCandidate')`. 
- The table is used in distribution-incompatible joins. These joins require data movement because the joins are not on the same distribution column of hash-distributed tables, or because the joins involve round-robin tables. Joining a hash-distributed table to a replicated table does not require data movement.

Consider converting an existing distributed table to a replicated table when:

- Query plans use data movement operations that broadcast the data to all the Compute nodes. The BroadcastMoveOperation is expensive and slows query performance. To view data movement operations in query plans, use [sys.dm_pdw_request_steps](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-request-steps-transact-sql).
 
Avoid using a replicated table when:

- The table has frequent insert, update, and delete operations. These data manipulation language (DML) operations require a rebuild of the replicated table. Continual rebuilds slows performance.
- The data warehouse is scaled frequently. Scaling a data warehouse changes the number of Compute nodes, which incurs a rebuild.
- The table has a large number of columns, but data operations typically access only a small number of columns. In this scenario, instead of replicating the entire table, it might be more effective to hash distribute the table, and then create an index on the frequently accessed columns. When a query requires data movement, SQL Data Warehouse will only need to move data in the requested columns. 

## Convert existing round-robin tables to replicated tables
If you already have round-robin tables, we recommend converting them to replicated tables. Replicated tables improve performance over round-robin tables because they eliminate the need for data movement.  A round-robin table always requires data movement for joins. 

This example uses [CTAS](https://docs.microsoft.com/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse) to change the DimSalesTerritory table to a replicated table. This example works regardless of whether DimSalesTerritory is hash-distributed or round-robin.

```
-- Change DimSalesTerritory to a replicated table
CREATE TABLE [dbo].[DimSalesTerritory_REPLICATE]   
WITH   
  (   
    CLUSTERED COLUMNSTORE INDEX,  
    DISTRIBUTION = REPLICATE  
  )  
AS SELECT * FROM [dbo].[DimSalesTerritory]
OPTION  (LABEL  = 'CTAS : DimSalesTerritory_REPLICATE') 

--Create statistics on new table
CREATE STATISTICS [SalesTerritoryKey] ON [DimSalesTerritory_REPLICATE] ([SalesTerritoryKey]);
CREATE STATISTICS [SalesTerritoryAlternateKey] ON [DimSalesTerritory_REPLICATE] ([SalesTerritoryAlternateKey]);
CREATE STATISTICS [SalesTerritoryRegion] ON [DimSalesTerritory_REPLICATE] ([SalesTerritoryRegion]);
CREATE STATISTICS [SalesTerritoryCountry] ON [DimSalesTerritory_REPLICATE] ([SalesTerritoryCountry]);
CREATE STATISTICS [SalesTerritoryGroup] ON [DimSalesTerritory_REPLICATE] ([SalesTerritoryGroup]);

-- Switch table names

RENAME OBJECT [dbo].[DimSalesTerritory] to [DimSalesTerritory_old];
RENAME OBJECT [dbo].[DimSalesTerritory_REPLICATE] TO [DimSalesTerritory];

DROP TABLE [dbo].[DimSalesTerritory_old];

```  

### Why round-robin tables require data movement and replicated tables do not

A replicated table does not require any data movement for joins because the entire table is already present on each Compute node. If the dimension tables are round-robin distributed, a join copies the dimension table in full to each Compute node. To move the data, the query plan contains an operation called BroadcastMoveOperation. This type of data movement operation slows query performance and is eliminated by using replicated tables. To view query plan steps, use the [sys.dm_pdw_request_steps](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-request-steps-transact-sql) system catalog view. 

For example, in following query against the AdventureWorks schema, the ` FactInternetSales` table is hash-distributed. The `DimDate` and `DimSalesTerritory` tables are smaller dimension tables recreated as round robin tables, then as replicated tables.  To get the total sales in North America for fiscal year 2004, the following query can be run:
 
```sql
SELECT [TotalSalesAmount] = SUM(SalesAmount)
FROM dbo.FactInternetSales s
INNER JOIN dbo.DimDate d
  ON d.DateKey = s.OrderDateKey
INNER JOIN dbo.DimSalesTerritory t
  ON t.SalesTerritoryKey = s.SalesTerritoryKey
WHERE d.FiscalYear = 2004
  AND t.SalesTerritoryGroup = 'North America'
```

You can see that the query plan for the round-robin table has broadcast moves. The query plan for the replicated table is much shorter and does not have any broadcast moves.


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
Standard indexing practices apply to replicated tables. In SQL Data Warehouse each index on a replicated table is rebuilt as part of the replicated table rebuild. Only use indexes when the performance gain outweighs the cost of rebuilding the indexes.  
 
## Load data with batching to reduce the replicated table rebuilds 
When loading data into replicated tables, try to minimize rebuilds by batching loads together. Perform all the batched loads before running select statements.

For example, this load pattern loads data from four sources and invokes four rebuilds. 

- Load from source 1.
- Select statement triggers rebuild 1.
- Load from source 2.
- Select statement triggers rebuild 2.
- Load from source 3.
- Select statement triggers rebuild 3.
- Load from source 4.
- Select statement triggers rebuild 4.

For example, this load pattern loads data from four sources, but only invokes one rebuild.

- Load from source 1.
- Load from source 2.
- Load from source 3.
- Load from source 4.
- Select statement triggers rebuild.


## Rebuild a replicated table after a batch load
To ensure consistent query execution times, we recommend forcing a fresh of the replicated tables after a batch load. Otherwise, the first query must wait for the tables to refresh, which includes rebuilding the indexes. Depending on the size and number of replicated tables affected, the performance impact can be significant.  

This query uses the [sys.pdw_replicated_table_cache_state](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-pdw-replicated-table-cache-state-transact-sql) DMV to list the replicated tables that have been modified, but not rebuilt.

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
 
To force a rebuild, run the following statement on each table in the preceding output. 

```sql
SELECT TOP 1 * FROM [ReplicatedTable]
``` 
 
## Next Steps 
To create a replicated table, use one of these statements:

- [CREATE TABLE (Azure SQL Data Warehouse)](https://docs.microsoft.com/sql/t-sql/statements/create-table-azure-sql-data-warehouse)
- [CREATE TABLE AS SELECT (Azure SQL Data Warehouse](https://docs.microsoft.com/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse)

For an overview of distributed tables, see [distributed tables](sql-data-warehouse-tables-distribute.md).



