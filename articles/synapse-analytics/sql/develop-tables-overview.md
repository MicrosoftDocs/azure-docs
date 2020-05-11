---
title: Design tables using Synapse SQL
description: Introduction to designing tables in Synapse SQL. 
services: synapse-analytics
author: filippopovic
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice:
ms.date: 04/15/2020
ms.author: fipopovi
ms.reviewer: jrasnick
---

# Design tables using Synapse SQL

This document includes key concepts for designing tables with SQL pool and SQL on-demand (preview).  

[SQL on-demand (preview)](on-demand-workspace-overview.md) is a query service over the data in your data lake. It doesn't have local storage for data ingestion. [SQL pool](best-practices-sql-pool.md) represents a collection of analytic resources that are being provisioned when using Synapse SQL. The size of SQL pool is determined by Data Warehousing Units (DWU).

The following table lists the topics that are relevant to SQL pool vs. SQL on-demand:

| Topic                                                        | SQL pool | SQL on-demand |
| ------------------------------------------------------------ | ------------------ | ----------------------- |
| [Determine table category](#determine-table-category)        | Yes                | No                      |
| [Schema names](#schema-names)                                | Yes                | Yes                     |
| [Table names](#table-names)                                  | Yes                | No                      |
| [Table persistence](#table-persistence)                      | Yes                | No                      |
| [Regular table](#regular-table)                              | Yes                | No                      |
| [Temporary table](#temporary-table)                          | Yes                | Yes                     |
| [External table](#external-table)                            | Yes                | Yes                     |
| [Data types](#data-types)                                    | Yes                | Yes                     |
| [Distributed tables](#distributed-tables)                    | Yes                | No                      |
| [Hash-distributed tables](#hash-distributed-tables)          | Yes                | No                      |
| [Replicated tables](#replicated-tables)                      | Yes                | No                      |
| [Round-robin tables](#round-robin-tables)                    | Yes                | No                      |
| [Common distribution methods for tables](#common-distribution-methods-for-tables) | Yes                | No                      |
| [Partitions](#partitions)                                    | Yes                | Yes                     |
| [Columnstore indexes](#columnstore-indexes)                  | Yes                | No                      |
| [Statistics](#statistics)                                    | Yes                | Yes                     |
| [Primary key and unique key](#primary-key-and-unique-key)    | Yes                | No                      |
| [Commands for creating tables](#commands-for-creating-tables) | Yes                | No                      |
| [Aligning source data with the data warehouse](#aligning-source-data-with-the-data-warehouse) | Yes                | No                      |
| [Unsupported table features](#unsupported-table-features)    | Yes                | No                      |
| [Table size queries](#table-size-queries)                    | Yes                | No                      |

## Determine table category

A [star schema](https://en.wikipedia.org/wiki/Star_schema) organizes data into fact and dimension tables. Some tables are used for integration or staging data before moving to a fact or dimension table. As you design a table, decide whether the table data belongs in a fact, dimension, or integration table. This decision informs the appropriate table structure and distribution.

- **Fact tables** contain quantitative data that are commonly generated in a transactional system, and then loaded into the data warehouse. For example, a retail business generates sales transactions every day, and then loads the data into a data warehouse fact table for analysis.

- **Dimension tables** contain attribute data that might change but usually changes infrequently. For example, a customer's name and address are stored in a dimension table and updated only when the customer's profile changes. To minimize the size of a large fact table, the customer's name and address don't need to be in every row of a fact table. Instead, the fact table and the dimension table can share a customer ID. A query can join the two tables to associate a customer's profile and transactions.

- **Integration tables** provide a place for integrating or staging data. You can create an integration table as a regular table, an external table, or a temporary table. For example, you can load data to a staging table, perform transformations on the data in staging, and then insert the data into a production table.

## Schema names

Schemas are a good way to group together objects that are used in a similar fashion. The following code creates a [user-defined schema](/sql/t-sql/statements/create-schema-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) called wwi.

```sql
CREATE SCHEMA wwi;
```

## Table names

If you're migrating multiple databases from an on-prem solution to SQL pool, the best practice is to migrate all of the fact, dimension, and integration tables to one SQL pool schema. For example, you could store all the tables in the [WideWorldImportersDW](/sql/samples/wide-world-importers-dw-database-catalog?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) sample data warehouse within one schema called wwi.

To show the organization of the tables in SQL pool, you could use fact, dim, and int as prefixes to the table names. The table below shows some of the schema and table names for WideWorldImportersDW.  

| WideWorldImportersDW table  | Table type | SQL pool |
|:-----|:-----|:------|:-----|
| City | Dimension | wwi.DimCity |
| Order | Fact | wwi.FactOrder |

## Table persistence

Tables store data either permanently in Azure Storage, temporarily in Azure Storage, or in a data store external to the data warehouse.

### Regular table

A regular table stores data in Azure Storage as part of the data warehouse. The table and the data persist whether or not a session is open.  The example below creates a regular table with two columns.

```sql
CREATE TABLE MyTable (col1 int, col2 int );  
```

### Temporary table

A temporary table only exists for the duration of the session. You can use a temporary table to prevent other users from seeing temporary results. Using temporary tables also reduces the need for cleanup.  Temporary tables utilize local storage and, in SQL pool, can offer faster performance.  

SQL on-demand supports temporary tables. But, its usage is limited since you can select from temporary table but cannot join it with files in storage.

For more information, see  [Temporary tables](develop-tables-temporary.md).

### External table

[External tables](develop-tables-external-tables.md) point to data located in Azure Storage blob or Azure Data Lake Storage.

Import data from external tables into SQL pool using the [CREATE TABLE AS SELECT](../sql-data-warehouse/sql-data-warehouse-develop-ctas.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) statement. For a loading tutorial, see [Use PolyBase to load data from Azure blob storage](../sql-data-warehouse/load-data-from-azure-blob-storage-using-polybase.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

For SQL on-demand, you can use [CETAS](develop-tables-cetas.md) to save the query result to an external table in Azure Storage.

## Data types

SQL pool supports the most commonly used data types. For a list of the supported data types, see [data types in CREATE TABLE reference](/sql/t-sql/statements/create-table-azure-sql-data-warehouse?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest#DataTypes) in the CREATE TABLE statement. For more information on using data types, see [Data types](../sql/develop-tables-data-types.md).

## Distributed tables

A fundamental feature of SQL pool is the way it can store and operate on tables across [distributions](../sql-data-warehouse/massively-parallel-processing-mpp-architecture.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json#distributions).  SQL pool supports three methods for distributing data:

- Round-robin (default)
- Hash
- Replicated

### Hash-distributed tables

A hash distributed table distributes rows based on the value in the distribution column. A hash distributed table is designed to achieve high performance for queries on large tables. There are several factors to consider when choosing a distribution column.

For more information, see [Design guidance for distributed tables](../sql-data-warehouse/sql-data-warehouse-tables-distribute.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

### Replicated tables

A replicated table has a full copy of the table available on every Compute node. Queries run fast on replicated tables because joins on replicated tables don't require data movement. Replication requires extra storage, though, and isn't practical for large tables.

For more information, see [Design guidance for replicated tables](../sql-data-warehouse/design-guidance-for-replicated-tables.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

### Round-robin tables

A round-robin table distributes table rows evenly across all distributions. The rows are distributed randomly. Loading data into a round-robin table is fast.  But, queries can require more data movement than the other distribution methods.

For more information, see [Design guidance for distributed tables](../sql-data-warehouse/sql-data-warehouse-tables-distribute.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

### Common distribution methods for tables

The table category often determines the optimal option for table distribution.

| Table category | Recommended distribution option |
|:---------------|:--------------------|
| Fact           | Use hash-distribution with clustered columnstore index. Performance improves when two hash tables are joined on the same distribution column. |
| Dimension      | Use replicated for smaller tables. If tables are too large to store on each Compute node, use hash-distributed. |
| Staging        | Use round-robin for the staging table. The load with CTAS is fast. Once the data is in the staging table, use INSERT...SELECT to move the data to production tables. |

## Partitions

In SQL pool, a partitioned table stores and executes operations on the table rows according to data ranges. For example, a table could be partitioned by day, month, or year. You can improve query performance through partition elimination, which limits a query scan to data within a partition.

You can also maintain the data through partition switching. Since the data in SQL pool is already distributed, too many partitions can slow query performance. For more information, see [Partitioning guidance](../sql-data-warehouse/sql-data-warehouse-tables-partition.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).  

> [!TIP]
> When partition switching into table partitions that are not empty, consider using the TRUNCATE_TARGET option in your [ALTER TABLE](/sql/t-sql/statements/alter-table-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) statement if the existing data is to be truncated.

The code below switches the transformed daily data into a SalesFact partition and overwrites any existing data.

```sql
ALTER TABLE SalesFact_DailyFinalLoad SWITCH PARTITION 256 TO SalesFact PARTITION 256 WITH (TRUNCATE_TARGET = ON);  
```

In SQL on-demand, you can limit the files/folders (partitions) that will be read by your query. Partitioning by path is supported using the filepath and fileinfo functions described in [Querying storage files](develop-storage-files-overview.md). The following example reads a folder with data for year 2017:

```sql
SELECT
    nyc.filepath(1) AS [year],
    payment_type,
    SUM(fare_amount) AS fare_total
FROM  
    OPENROWSET(
        BULK 'https://sqlondemandstorage.blob.core.windows.net/parquet/taxi/year=*/month=*/*.parquet',
        FORMAT='PARQUET'
    ) AS nyc
WHERE
    nyc.filepath(1) = 2017
GROUP BY
    nyc.filepath(1),
    payment_type
ORDER BY
    nyc.filepath(1),
    payment_type
```

## Columnstore indexes

By default, SQL pool stores a table as a clustered columnstore index. This form of data storage achieves high data compression and query performance on large tables.  The clustered columnstore index is usually the best choice, but in some cases a clustered index or a heap is the appropriate storage structure.  

> [!TIP]
> A heap table can be especially useful for loading transient data, such as a staging table, which is transformed into a final table.

For a list of columnstore features, see [What's new for columnstore indexes](/sql/relational-databases/indexes/columnstore-indexes-what-s-new?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest). To improve columnstore index performance, see [Maximizing rowgroup quality for columnstore indexes](../sql/data-load-columnstore-compression.md).

## Statistics


The query optimizer uses column-level statistics when it creates the plan for executing a query. To improve query performance, it's important to have statistics on individual columns, especially columns used in query joins. Synapse SQL supports automatic creation of statistics. 

Statistical updating doesn't happen automatically. Update statistics after a significant number of rows are added or changed. For instance, update statistics after a load. Additional information is provided in the [Statistics guidance](develop-tables-statistics.md) article.

## Primary key and unique key

PRIMARY KEY is only supported when NONCLUSTERED and NOT ENFORCED are both used.  UNIQUE constraint is only supported when NOT ENFORCED is used.  For more information, see the [SQL pool Table Constraints](../sql-data-warehouse/sql-data-warehouse-table-constraints.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) article.

## Commands for creating tables

You can create a table as a new empty table. You can also create and populate a table with the results of a select statement. The following are the T-SQL commands for creating a table.

| T-SQL Statement | Description |
|:----------------|:------------|
| [CREATE TABLE](/sql/t-sql/statements/create-table-azure-sql-data-warehouse?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) | Creates an empty table by defining all the table columns and options. |
| [CREATE EXTERNAL TABLE](/sql/t-sql/statements/create-external-table-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) | Creates an external table. The definition of the table is stored in SQL pool. The table data is stored in Azure Blob storage or Azure Data Lake Storage. |
| [CREATE TABLE AS SELECT](/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) | Populates a new table with the results of a select statement. The table columns and data types are based on the select statement results. To import data, this statement can select from an external table. |
| [CREATE EXTERNAL TABLE AS SELECT](/sql/t-sql/statements/create-external-table-as-select-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) | Creates a new external table by exporting the results of a select statement to an external location.  The location is either Azure Blob storage or Azure Data Lake Storage. |

## Aligning source data with the data warehouse

Data warehouse tables are populated by loading data from another data source. To achieve a successful load, the number and data types of the columns in the source data must align with the table definition in the data warehouse.

> [!NOTE]
> Getting the data to align might be the hardest part of designing your tables.

If data is coming from multiple data stores, you can port the data into the data warehouse and store it in an integration table. Once data is in the integration table, you can use the power of SQL pool to implement transformation operations. Once the data is prepared, you can insert it into production tables.

## Unsupported table features

SQL pool supports many, but not all, of the table features offered by other databases.  The following list shows some of the table features that aren't supported in SQL pool.

- Foreign key, check [Table Constraints](/sql/t-sql/statements/alter-table-table-constraint-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)
- [Computed Columns](/sql/t-sql/statements/alter-table-computed-column-definition-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)
- [Indexed Views](/sql/relational-databases/views/create-indexed-views?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)
- [Sequence](/sql/t-sql/statements/create-sequence-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)
- [Sparse Columns](/sql/relational-databases/tables/use-sparse-columns?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)
- Surrogate Keys, implement with [Identity](../sql-data-warehouse/sql-data-warehouse-tables-identity.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)
- [Synonyms](/sql/t-sql/statements/create-synonym-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)
- [Triggers](/sql/t-sql/statements/create-trigger-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)
- [Unique Indexes](/sql/t-sql/statements/create-index-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)
- [User-Defined Types](/sql/relational-databases/native-client/features/using-user-defined-types?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest)

## Table size queries

One simple way to identify space and rows consumed by a table in each of the 60 distributions is to use [DBCC PDW_SHOWSPACEUSED](/sql/t-sql/database-console-commands/dbcc-pdw-showspaceused-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest).

```sql
DBCC PDW_SHOWSPACEUSED('dbo.FactInternetSales');
```

Keep in mind that using DBCC commands can be quite limiting.  Dynamic management views (DMVs) show more detail than DBCC commands. Start by creating the view below.

```sql
CREATE VIEW dbo.vTableSizes
AS
WITH base
AS
(
SELECT
 GETDATE()                                                             AS  [execution_time]
, DB_NAME()                                                            AS  [database_name]
, s.name                                                               AS  [schema_name]
, t.name                                                               AS  [table_name]
, QUOTENAME(s.name)+'.'+QUOTENAME(t.name)                              AS  [two_part_name]
, nt.[name]                                                            AS  [node_table_name]
, ROW_NUMBER() OVER(PARTITION BY nt.[name] ORDER BY (SELECT NULL))     AS  [node_table_name_seq]
, tp.[distribution_policy_desc]                                        AS  [distribution_policy_name]
, c.[name]                                                             AS  [distribution_column]
, nt.[distribution_id]                                                 AS  [distribution_id]
, i.[type]                                                             AS  [index_type]
, i.[type_desc]                                                        AS  [index_type_desc]
, nt.[pdw_node_id]                                                     AS  [pdw_node_id]
, pn.[type]                                                            AS  [pdw_node_type]
, pn.[name]                                                            AS  [pdw_node_name]
, di.name                                                              AS  [dist_name]
, di.position                                                          AS  [dist_position]
, nps.[partition_number]                                               AS  [partition_nmbr]
, nps.[reserved_page_count]                                            AS  [reserved_space_page_count]
, nps.[reserved_page_count] - nps.[used_page_count]                    AS  [unused_space_page_count]
, nps.[in_row_data_page_count]
    + nps.[row_overflow_used_page_count]
    + nps.[lob_used_page_count]                                        AS  [data_space_page_count]
, nps.[reserved_page_count]
 - (nps.[reserved_page_count] - nps.[used_page_count])
 - ([in_row_data_page_count]
         + [row_overflow_used_page_count]+[lob_used_page_count])       AS  [index_space_page_count]
, nps.[row_count]                                                      AS  [row_count]
from
    sys.schemas s
INNER JOIN sys.tables t
    ON s.[schema_id] = t.[schema_id]
INNER JOIN sys.indexes i
    ON  t.[object_id] = i.[object_id]
    AND i.[index_id] <= 1
INNER JOIN sys.pdw_table_distribution_properties tp
    ON t.[object_id] = tp.[object_id]
INNER JOIN sys.pdw_table_mappings tm
    ON t.[object_id] = tm.[object_id]
INNER JOIN sys.pdw_nodes_tables nt
    ON tm.[physical_name] = nt.[name]
INNER JOIN sys.dm_pdw_nodes pn
    ON  nt.[pdw_node_id] = pn.[pdw_node_id]
INNER JOIN sys.pdw_distributions di
    ON  nt.[distribution_id] = di.[distribution_id]
INNER JOIN sys.dm_pdw_nodes_db_partition_stats nps
    ON nt.[object_id] = nps.[object_id]
    AND nt.[pdw_node_id] = nps.[pdw_node_id]
    AND nt.[distribution_id] = nps.[distribution_id]
LEFT OUTER JOIN (select * from sys.pdw_column_distribution_properties where distribution_ordinal = 1) cdp
    ON t.[object_id] = cdp.[object_id]
LEFT OUTER JOIN sys.columns c
    ON cdp.[object_id] = c.[object_id]
    AND cdp.[column_id] = c.[column_id]
WHERE pn.[type] = 'COMPUTE'
)
, size
AS
(
SELECT
   [execution_time]
,  [database_name]
,  [schema_name]
,  [table_name]
,  [two_part_name]
,  [node_table_name]
,  [node_table_name_seq]
,  [distribution_policy_name]
,  [distribution_column]
,  [distribution_id]
,  [index_type]
,  [index_type_desc]
,  [pdw_node_id]
,  [pdw_node_type]
,  [pdw_node_name]
,  [dist_name]
,  [dist_position]
,  [partition_nmbr]
,  [reserved_space_page_count]
,  [unused_space_page_count]
,  [data_space_page_count]
,  [index_space_page_count]
,  [row_count]
,  ([reserved_space_page_count] * 8.0)                                 AS [reserved_space_KB]
,  ([reserved_space_page_count] * 8.0)/1000                            AS [reserved_space_MB]
,  ([reserved_space_page_count] * 8.0)/1000000                         AS [reserved_space_GB]
,  ([reserved_space_page_count] * 8.0)/1000000000                      AS [reserved_space_TB]
,  ([unused_space_page_count]   * 8.0)                                 AS [unused_space_KB]
,  ([unused_space_page_count]   * 8.0)/1000                            AS [unused_space_MB]
,  ([unused_space_page_count]   * 8.0)/1000000                         AS [unused_space_GB]
,  ([unused_space_page_count]   * 8.0)/1000000000                      AS [unused_space_TB]
,  ([data_space_page_count]     * 8.0)                                 AS [data_space_KB]
,  ([data_space_page_count]     * 8.0)/1000                            AS [data_space_MB]
,  ([data_space_page_count]     * 8.0)/1000000                         AS [data_space_GB]
,  ([data_space_page_count]     * 8.0)/1000000000                      AS [data_space_TB]
,  ([index_space_page_count]  * 8.0)                                   AS [index_space_KB]
,  ([index_space_page_count]  * 8.0)/1000                              AS [index_space_MB]
,  ([index_space_page_count]  * 8.0)/1000000                           AS [index_space_GB]
,  ([index_space_page_count]  * 8.0)/1000000000                        AS [index_space_TB]
FROM base
)
SELECT *
FROM size
;
```

### Table space summary

This query returns the rows and space by table.  Table space summary allows you to see which tables are your largest tables. You'll also see whether they're round-robin, replicated, or hash-distributed.  For hash-distributed tables, the query shows the distribution column.  

```sql
SELECT
     database_name
,    schema_name
,    table_name
,    distribution_policy_name
,      distribution_column
,    index_type_desc
,    COUNT(distinct partition_nmbr) as nbr_partitions
,    SUM(row_count)                 as table_row_count
,    SUM(reserved_space_GB)         as table_reserved_space_GB
,    SUM(data_space_GB)             as table_data_space_GB
,    SUM(index_space_GB)            as table_index_space_GB
,    SUM(unused_space_GB)           as table_unused_space_GB
FROM
    dbo.vTableSizes
GROUP BY
     database_name
,    schema_name
,    table_name
,    distribution_policy_name
,      distribution_column
,    index_type_desc
ORDER BY
    table_reserved_space_GB desc
;
```

### Table space by distribution type

```sql
SELECT
     distribution_policy_name
,    SUM(row_count)                as table_type_row_count
,    SUM(reserved_space_GB)        as table_type_reserved_space_GB
,    SUM(data_space_GB)            as table_type_data_space_GB
,    SUM(index_space_GB)           as table_type_index_space_GB
,    SUM(unused_space_GB)          as table_type_unused_space_GB
FROM dbo.vTableSizes
GROUP BY distribution_policy_name
;
```

### Table space by index type

```sql
SELECT
     index_type_desc
,    SUM(row_count)                as table_type_row_count
,    SUM(reserved_space_GB)        as table_type_reserved_space_GB
,    SUM(data_space_GB)            as table_type_data_space_GB
,    SUM(index_space_GB)           as table_type_index_space_GB
,    SUM(unused_space_GB)          as table_type_unused_space_GB
FROM dbo.vTableSizes
GROUP BY index_type_desc
;
```

### Distribution space summary

```sql
SELECT
    distribution_id
,    SUM(row_count)                as total_node_distribution_row_count
,    SUM(reserved_space_MB)        as total_node_distribution_reserved_space_MB
,    SUM(data_space_MB)            as total_node_distribution_data_space_MB
,    SUM(index_space_MB)           as total_node_distribution_index_space_MB
,    SUM(unused_space_MB)          as total_node_distribution_unused_space_MB
FROM dbo.vTableSizes
GROUP BY     distribution_id
ORDER BY    distribution_id
;
```

## Next steps

After creating the tables for your data warehouse, the next step is to load data into the table.  For a loading tutorial, see [Loading data into SQL pool](../sql-data-warehouse/load-data-wideworldimportersdw.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json#load-the-data-into-sql-pool).
