---
title: Indexing tables
description: Recommendations and examples for indexing tables in Synapse SQL pool.
services: synapse-analytics
author: XiaoyuMSFT
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: 
ms.date: 03/18/2019
ms.author: xiaoyul
ms.reviewer: igorstan
ms.custom: seo-lt-2019, azure-synapse
---

# Indexing tables in Synapse SQL pool

Recommendations and examples for indexing tables in Synapse SQL pool.

## Index types

Synapse SQL pool offers several indexing options including [clustered columnstore indexes](/sql/relational-databases/indexes/columnstore-indexes-overview?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), [clustered indexes and nonclustered indexes](/sql/relational-databases/indexes/clustered-and-nonclustered-indexes-described?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), and a non-index option also known as [heap](/sql/relational-databases/indexes/heaps-tables-without-clustered-indexes?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest).  

To create a table with an index, see the [CREATE TABLE (Synapse SQL pool)](/sql/t-sql/statements/create-table-azure-sql-data-warehouse?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest) documentation.

## Clustered columnstore indexes

By default, Synapse SQL pool creates a clustered columnstore index when no index options are specified on a table. Clustered columnstore tables offer both the highest level of data compression as well as the best overall query performance.  Clustered columnstore tables will generally outperform clustered index or heap tables and are usually the best choice for large tables.  For these reasons, clustered columnstore is the best place to start when you are unsure of how to index your table.  

To create a clustered columnstore table, simply specify CLUSTERED COLUMNSTORE INDEX in the WITH clause, or leave the WITH clause off:

```SQL
CREATE TABLE myTable
  (  
    id int NOT NULL,  
    lastName varchar(20),  
    zipCode varchar(6)  
  )  
WITH ( CLUSTERED COLUMNSTORE INDEX );
```

There are a few scenarios where clustered columnstore may not be a good option:

- Columnstore tables do not support varchar(max), nvarchar(max) and varbinary(max). Consider heap or clustered index instead.
- Columnstore tables may be less efficient for transient data. Consider heap and perhaps even temporary tables.
- Small tables with less than 60 million rows. Consider heap tables.

## Heap tables

When you are temporarily landing data in Synapse SQL pool, you may find that using a heap table makes the overall process faster. This is because loads to heaps are faster than to index tables and in some cases the subsequent read can be done from cache.  If you are loading data only to stage it before running more transformations, loading the table to heap table is much faster than loading the data to a clustered columnstore table. In addition, loading data to a [temporary table](sql-data-warehouse-tables-temporary.md) loads faster than loading a table to permanent storage.  After data loading, you can create indexes in the table for faster query performance.  

Cluster columnstore tables begin to achieve optimal compression once there is more than 60 million rows.  For small lookup tables, less than 60 million rows, consider using HEAP or clustered index for faster query performance. 

To create a heap table, simply specify HEAP in the WITH clause:

```SQL
CREATE TABLE myTable
  (  
    id int NOT NULL,  
    lastName varchar(20),  
    zipCode varchar(6)  
  )  
WITH ( HEAP );
```

## Clustered and nonclustered indexes

Clustered indexes may outperform clustered columnstore tables when a single row needs to be quickly retrieved. For queries where a single or very few row lookup is required to perform with extreme speed, consider a cluster index or nonclustered secondary index. The disadvantage to using a clustered index is that only queries that benefit are the ones that use a highly selective filter on the clustered index column. To improve filter on other columns a nonclustered index can be added to other columns. However, each index which is added to a table adds both space and processing time to loads.

To create a clustered index table, simply specify CLUSTERED INDEX in the WITH clause:

```SQL
CREATE TABLE myTable
  (  
    id int NOT NULL,  
    lastName varchar(20),  
    zipCode varchar(6)  
  )  
WITH ( CLUSTERED INDEX (id) );
```

To add a non-clustered index on a table, use the following syntax:

```SQL
CREATE INDEX zipCodeIndex ON myTable (zipCode);
```

## Optimizing clustered columnstore indexes

Clustered columnstore tables are organized in data into segments.  Having high segment quality is critical to achieving optimal query performance on a columnstore table.  Segment quality can be measured by the number of rows in a compressed row group.  Segment quality is most optimal where there are at least 100K rows per compressed row group and gain in performance as the number of rows per row group approach 1,048,576 rows, which is the most rows a row group can contain.

The below view can be created and used on your system to compute the average rows per row group and identify any sub-optimal cluster columnstore indexes.  The last column on this view generates a SQL statement which can be used to rebuild your indexes.

```sql
CREATE VIEW dbo.vColumnstoreDensity
AS
SELECT
        GETDATE()                                                               AS [execution_date]
,       DB_Name()                                                               AS [database_name]
,       s.name                                                                  AS [schema_name]
,       t.name                                                                  AS [table_name]
,    COUNT(DISTINCT rg.[partition_number])                    AS [table_partition_count]
,       SUM(rg.[total_rows])                                                    AS [row_count_total]
,       SUM(rg.[total_rows])/COUNT(DISTINCT rg.[distribution_id])               AS [row_count_per_distribution_MAX]
,    CEILING    ((SUM(rg.[total_rows])*1.0/COUNT(DISTINCT rg.[distribution_id]))/1048576) AS [rowgroup_per_distribution_MAX]
,       SUM(CASE WHEN rg.[State] = 0 THEN 1                   ELSE 0    END)    AS [INVISIBLE_rowgroup_count]
,       SUM(CASE WHEN rg.[State] = 0 THEN rg.[total_rows]     ELSE 0    END)    AS [INVISIBLE_rowgroup_rows]
,       MIN(CASE WHEN rg.[State] = 0 THEN rg.[total_rows]     ELSE NULL END)    AS [INVISIBLE_rowgroup_rows_MIN]
,       MAX(CASE WHEN rg.[State] = 0 THEN rg.[total_rows]     ELSE NULL END)    AS [INVISIBLE_rowgroup_rows_MAX]
,       AVG(CASE WHEN rg.[State] = 0 THEN rg.[total_rows]     ELSE NULL END)    AS [INVISIBLE_rowgroup_rows_AVG]
,       SUM(CASE WHEN rg.[State] = 1 THEN 1                   ELSE 0    END)    AS [OPEN_rowgroup_count]
,       SUM(CASE WHEN rg.[State] = 1 THEN rg.[total_rows]     ELSE 0    END)    AS [OPEN_rowgroup_rows]
,       MIN(CASE WHEN rg.[State] = 1 THEN rg.[total_rows]     ELSE NULL END)    AS [OPEN_rowgroup_rows_MIN]
,       MAX(CASE WHEN rg.[State] = 1 THEN rg.[total_rows]     ELSE NULL END)    AS [OPEN_rowgroup_rows_MAX]
,       AVG(CASE WHEN rg.[State] = 1 THEN rg.[total_rows]     ELSE NULL END)    AS [OPEN_rowgroup_rows_AVG]
,       SUM(CASE WHEN rg.[State] = 2 THEN 1                   ELSE 0    END)    AS [CLOSED_rowgroup_count]
,       SUM(CASE WHEN rg.[State] = 2 THEN rg.[total_rows]     ELSE 0    END)    AS [CLOSED_rowgroup_rows]
,       MIN(CASE WHEN rg.[State] = 2 THEN rg.[total_rows]     ELSE NULL END)    AS [CLOSED_rowgroup_rows_MIN]
,       MAX(CASE WHEN rg.[State] = 2 THEN rg.[total_rows]     ELSE NULL END)    AS [CLOSED_rowgroup_rows_MAX]
,       AVG(CASE WHEN rg.[State] = 2 THEN rg.[total_rows]     ELSE NULL END)    AS [CLOSED_rowgroup_rows_AVG]
,       SUM(CASE WHEN rg.[State] = 3 THEN 1                   ELSE 0    END)    AS [COMPRESSED_rowgroup_count]
,       SUM(CASE WHEN rg.[State] = 3 THEN rg.[total_rows]     ELSE 0    END)    AS [COMPRESSED_rowgroup_rows]
,       SUM(CASE WHEN rg.[State] = 3 THEN rg.[deleted_rows]   ELSE 0    END)    AS [COMPRESSED_rowgroup_rows_DELETED]
,       MIN(CASE WHEN rg.[State] = 3 THEN rg.[total_rows]     ELSE NULL END)    AS [COMPRESSED_rowgroup_rows_MIN]
,       MAX(CASE WHEN rg.[State] = 3 THEN rg.[total_rows]     ELSE NULL END)    AS [COMPRESSED_rowgroup_rows_MAX]
,       AVG(CASE WHEN rg.[State] = 3 THEN rg.[total_rows]     ELSE NULL END)    AS [COMPRESSED_rowgroup_rows_AVG]
,       'ALTER INDEX ALL ON ' + s.name + '.' + t.NAME + ' REBUILD;'             AS [Rebuild_Index_SQL]
FROM    sys.[pdw_nodes_column_store_row_groups] rg
JOIN    sys.[pdw_nodes_tables] nt                   ON  rg.[object_id]          = nt.[object_id]
                                                    AND rg.[pdw_node_id]        = nt.[pdw_node_id]
                                                    AND rg.[distribution_id]    = nt.[distribution_id]
JOIN    sys.[pdw_table_mappings] mp                 ON  nt.[name]               = mp.[physical_name]
JOIN    sys.[tables] t                              ON  mp.[object_id]          = t.[object_id]
JOIN    sys.[schemas] s                             ON t.[schema_id]            = s.[schema_id]
GROUP BY
        s.[name]
,       t.[name]
;
```

Now that you have created the view, run this query to identify tables with row groups with less than 100K rows. Of course, you may want to increase the threshold of 100K if you are looking for more optimal segment quality.

```sql
SELECT    *
FROM    [dbo].[vColumnstoreDensity]
WHERE    COMPRESSED_rowgroup_rows_AVG < 100000
        OR INVISIBLE_rowgroup_rows_AVG < 100000
```

Once you have run the query you can begin to look at the data and analyze your results. This table explains what to look for in your row group analysis.

| Column | How to use this data |
| --- | --- |
| [table_partition_count] |If the table is partitioned, then you may expect to see higher Open row group counts. Each partition in the distribution could in theory have an open row group associated with it. Factor this into your analysis. A small table that has been partitioned could be optimized by removing the partitioning altogether as this would improve compression. |
| [row_count_total] |Total row count for the table. For example, you can use this value to calculate percentage of rows in the compressed state. |
| [row_count_per_distribution_MAX] |If all rows are evenly distributed this value would be the target number of rows per distribution. Compare this value with the compressed_rowgroup_count. |
| [COMPRESSED_rowgroup_rows] |Total number of rows in columnstore format for the table. |
| [COMPRESSED_rowgroup_rows_AVG] |If the average number of rows is significantly less than the maximum # of rows for a row group, then consider using CTAS or ALTER INDEX REBUILD to recompress the data |
| [COMPRESSED_rowgroup_count] |Number of row groups in columnstore format. If this number is very high in relation to the table it is an indicator that the columnstore density is low. |
| [COMPRESSED_rowgroup_rows_DELETED] |Rows are logically deleted in columnstore format. If the number is high relative to table size, consider recreating the partition or rebuilding the index as this removes them physically. |
| [COMPRESSED_rowgroup_rows_MIN] |Use this in conjunction with the AVG and MAX columns to understand the range of values for the row groups in your columnstore. A low number over the load threshold (102,400 per partition aligned distribution) suggests that optimizations are available in the data load |
| [COMPRESSED_rowgroup_rows_MAX] |As above |
| [OPEN_rowgroup_count] |Open row groups are normal. One would reasonably expect one OPEN row group per table distribution (60). Excessive numbers suggest data loading across partitions. Double check the partitioning strategy to make sure it is sound |
| [OPEN_rowgroup_rows] |Each row group can have 1,048,576 rows in it as a maximum. Use this value to see how full the open row groups are currently |
| [OPEN_rowgroup_rows_MIN] |Open groups indicate that data is either being trickle loaded into the table or that the previous load spilled over remaining rows into this row group. Use the MIN, MAX, AVG columns to see how much data is sat in OPEN row groups. For small tables it could be 100% of all the data! In which case ALTER INDEX REBUILD to force the data to columnstore. |
| [OPEN_rowgroup_rows_MAX] |As above |
| [OPEN_rowgroup_rows_AVG] |As above |
| [CLOSED_rowgroup_rows] |Look at the closed row group rows as a sanity check. |
| [CLOSED_rowgroup_count] |The number of closed row groups should be low if any are seen at all. Closed row groups can be converted to compressed row groups using the ALTER INDEX ... REORGANIZE command. However, this is not normally required. Closed groups are automatically converted to columnstore row groups by the background "tuple mover" process. |
| [CLOSED_rowgroup_rows_MIN] |Closed row groups should have a very high fill rate. If the fill rate for a closed row group is low, then further analysis of the columnstore is required. |
| [CLOSED_rowgroup_rows_MAX] |As above |
| [CLOSED_rowgroup_rows_AVG] |As above |
| [Rebuild_Index_SQL] |SQL to rebuild columnstore index for a table |

## Causes of poor columnstore index quality

If you have identified tables with poor segment quality, you want to identify the root cause.  Below are some other common causes of poor segment quality:

1. Memory pressure when index was built
2. High volume of DML operations
3. Small or trickle load operations
4. Too many partitions

These factors can cause a columnstore index to have significantly less than the optimal 1 million rows per row group. They can also cause rows to go to the delta row group instead of a compressed row group.

### Memory pressure when index was built

The number of rows per compressed row group are directly related to the width of the row and the amount of memory available to process the row group.  When rows are written to columnstore tables under memory pressure, columnstore segment quality may suffer.  Therefore, the best practice is to give the session which is writing to your columnstore index tables access to as much memory as possible.  Since there is a trade-off between memory and concurrency, the guidance on the right memory allocation depends on the data in each row of your table, the data warehouse units allocated to your system, and the number of concurrency slots you can give to the session which is writing data to your table.

### High volume of DML operations

A high volume of DML operations that update and delete rows can introduce inefficiency into the columnstore. This is especially true when the majority of the rows in a row group are modified.

- Deleting a row from a compressed row group only logically marks the row as deleted. The row remains in the compressed row group until the partition or table is rebuilt.
- Inserting a row adds the row to an internal rowstore table called a delta row group. The inserted row is not converted to columnstore until the delta row group is full and is marked as closed. Row groups are closed once they reach the maximum capacity of 1,048,576 rows.
- Updating a row in columnstore format is processed as a logical delete and then an insert. The inserted row may be stored in the delta store.

Batched update and insert operations that exceed the bulk threshold of 102,400 rows per partition-aligned distribution go directly to the columnstore format. However, assuming an even distribution, you would need to be modifying more than 6.144 million rows in a single operation for this to occur. If the number of rows for a given partition-aligned distribution is less than 102,400 then the rows go to the delta store and stay there until sufficient rows have been inserted or modified to close the row group or the index has been rebuilt.

### Small or trickle load operations

Small loads that flow into Synapse SQL pool are also sometimes known as trickle loads. They typically represent a near constant stream of data being ingested by the system. However, as this stream is near continuous the volume of rows is not particularly large. More often than not the data is significantly under the threshold required for a direct load to columnstore format.

In these situations, it is often better to land the data first in Azure blob storage and let it accumulate prior to loading. This technique is often known as *micro-batching*.

### Too many partitions

Another thing to consider is the impact of partitioning on your clustered columnstore tables.  Before partitioning, Synapse SQL pool already divides your data into 60 databases.  Partitioning further divides your data.  If you partition your data, then consider that **each** partition needs at least 1 million rows to benefit from a clustered columnstore index.  If you partition your table into 100 partitions, then your table needs at least 6 billion rows to benefit from a clustered columnstore index (60 distributions *100 partitions* 1 million rows). If your 100-partition table does not have 6 billion rows, either reduce the number of partitions or consider using a heap table instead.

Once your tables have been loaded with some data, follow the below steps to identify and rebuild tables with sub-optimal clustered columnstore indexes.

## Rebuilding indexes to improve segment quality

### Step 1: Identify or create user which uses the right resource class

One quick way to immediately improve segment quality is to rebuild the index.  The SQL returned by the above view returns an ALTER INDEX REBUILD statement which can be used to rebuild your indexes. When rebuilding your indexes, be sure that you allocate enough memory to the session that rebuilds your index.  To do this, increase the resource class of a user which has permissions to rebuild the index on this table to the recommended minimum.

Below is an example of how to allocate more memory to a user by increasing their resource class. To work with resource classes, see [Resource classes for workload management](resource-classes-for-workload-management.md).

```sql
EXEC sp_addrolemember 'xlargerc', 'LoadUser'
```

### Step 2: Rebuild clustered columnstore indexes with higher resource class user

Sign in as the user from step 1 (e.g. LoadUser), which is now using a higher resource class, and execute the ALTER INDEX statements. Be sure that this user has ALTER permission to the tables where the index is being rebuilt. These examples show how to rebuild the entire columnstore index or how to rebuild a single partition. On large tables, it is more practical to rebuild indexes a single partition at a time.

Alternatively, instead of rebuilding the index, you could copy the table to a new table [using CTAS](sql-data-warehouse-develop-ctas.md). Which way is best? For large volumes of data, CTAS is usually faster than [ALTER INDEX](/sql/t-sql/statements/alter-index-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest). For smaller volumes of data, ALTER INDEX is easier to use and won't require you to swap out the table.

```sql
-- Rebuild the entire clustered index
ALTER INDEX ALL ON [dbo].[DimProduct] REBUILD
```

```sql
-- Rebuild a single partition
ALTER INDEX ALL ON [dbo].[FactInternetSales] REBUILD Partition = 5
```

```sql
-- Rebuild a single partition with archival compression
ALTER INDEX ALL ON [dbo].[FactInternetSales] REBUILD Partition = 5 WITH (DATA_COMPRESSION = COLUMNSTORE_ARCHIVE)
```

```sql
-- Rebuild a single partition with columnstore compression
ALTER INDEX ALL ON [dbo].[FactInternetSales] REBUILD Partition = 5 WITH (DATA_COMPRESSION = COLUMNSTORE)
```

Rebuilding an index in Synapse SQL pool is an offline operation.  For more information about rebuilding indexes, see the ALTER INDEX REBUILD section in [Columnstore Indexes Defragmentation](/sql/relational-databases/indexes/columnstore-indexes-defragmentation?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), and [ALTER INDEX](/sql/t-sql/statements/alter-index-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest).

### Step 3: Verify clustered columnstore segment quality has improved

Rerun the query which identified table with poor segment quality and verify segment quality has improved.  If segment quality did not improve, it could be that the rows in your table are extra wide.  Consider using a higher resource class or DWU when rebuilding your indexes.

## Rebuilding indexes with CTAS and partition switching

This example uses the [CREATE TABLE AS SELECT (CTAS)](/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest) statement and partition switching to rebuild a table partition.

```sql
-- Step 1: Select the partition of data and write it out to a new table using CTAS
CREATE TABLE [dbo].[FactInternetSales_20000101_20010101]
    WITH    (   DISTRIBUTION = HASH([ProductKey])
            ,   CLUSTERED COLUMNSTORE INDEX
            ,   PARTITION   (   [OrderDateKey] RANGE RIGHT FOR VALUES
                                (20000101,20010101
                                )
                            )
            )
AS
SELECT  *
FROM    [dbo].[FactInternetSales]
WHERE   [OrderDateKey] >= 20000101
AND     [OrderDateKey] <  20010101
;

-- Step 2: Switch IN the rebuilt data with TRUNCATE_TARGET option
ALTER TABLE [dbo].[FactInternetSales_20000101_20010101] SWITCH PARTITION 2 TO  [dbo].[FactInternetSales] PARTITION 2 WITH (TRUNCATE_TARGET = ON);
```

For more details about re-creating partitions using CTAS, see [Using partitions in Synapse SQL pool](sql-data-warehouse-tables-partition.md).

## Next steps

For more information about developing tables, see [Developing tables](sql-data-warehouse-tables-overview.md).
