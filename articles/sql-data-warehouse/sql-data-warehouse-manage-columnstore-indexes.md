<properties
   pageTitle="Manage columnstore indexes in Azure SQL Data Warehouse | Microsoft Azure"
   description="Tutorial for managing columnstore indexes to improve compression and query performance in Azure SQL Data Warehouse."
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
   ms.date="04/07/2016"
   ms.author="jrj;barbkess;sonyama"/>

# Manage columnstore indexes in Azure SQL Data Warehouse

This tutorial explains how to manage columnstore indexes to improve query performance. 

Queries on columnstore indexes run best when the index compresses rows together into "rowgroups" of one million rows (1,048,576 to be exact). This gives the best compression and the best query performance. However, conditions can occur that cause the rowgroups to have significantly less than a million rows. When rowgroups are not densely populated with rows, you should consider making adjustments. 

In this tutorial you will learn how to:

- Use metadata to determine the average number of rows per rowgroup
- Consider the root cause for sparsely populated rowgroups
- Rebuild a columnstore index to re-compress all rows into new rowgroups 

To learn the basics about columnstore indexes, see [Columnstore Guide](https://msdn.microsoft.com/library/gg492088.aspx).

## Step 1: Create a view that displays rowgroup metadata

This view computes the average rows per rowgroup. It also shows additional information about rowgroups.

```sql
CREATE VIEW dbo.vColumnstoreDensity
AS
WITH CSI
AS
(
SELECT
        SUBSTRING(@@version,34,4)                                               AS [build_number]
,       GETDATE()                                                               AS [execution_date]
,       DB_Name()                                                               AS [database_name]
,       t.name                                                                  AS [table_name]
,		COUNT(DISTINCT rg.[partition_number])									AS [table_partition_count]
,       SUM(rg.[total_rows])                                                    AS [row_count_total]
,       SUM(rg.[total_rows])/COUNT(DISTINCT rg.[distribution_id])               AS [row_count_per_distribution_MAX]
,		CEILING	(	(SUM(rg.[total_rows])*1.0/COUNT(DISTINCT rg.[distribution_id])
						)/1048576
				)																AS [rowgroup_per_distribution_MAX]
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
FROM    sys.[pdw_nodes_column_store_row_groups] rg
JOIN    sys.[pdw_nodes_tables] nt                   ON  rg.[object_id]          = nt.[object_id]
                                                    AND rg.[pdw_node_id]        = nt.[pdw_node_id]
                                                    AND rg.[distribution_id]    = nt.[distribution_id]
JOIN    sys.[pdw_table_mappings] mp                 ON  nt.[name]               = mp.[physical_name]
JOIN    sys.[tables] t                              ON  mp.[object_id]          = t.[object_id]
GROUP BY
        t.[name]
)
SELECT  *
FROM    CSI
;
```

## Step 2: Query the view

Now that you have created the view, run this example query to see the rowgroup metadata for your columnstore index. 

```sql
SELECT	[table_name]
,		[table_partition_count]
,		[row_count_total]
,		[row_count_per_distribution_MAX]
,		[COMPRESSED_rowgroup_rows]
,		[COMPRESSED_rowgroup_rows_AVG]
,		[COMPRESSED_rowgroup_rows_DELETED]
,		[COMPRESSED_rowgroup_count]
,		[OPEN_rowgroup_count]
,		[OPEN_rowgroup_rows]
,		[CLOSED_rowgroup_count]
,		[CLOSED_rowgroup_rows]
FROM	[dbo].[vColumnstoreDensity]
WHERE	[table_name] = 'FactInternetSales'
```

## Step 3: Analyze the results

Once you have run the query you can begin to look at the data and analyze your results. This table explains what to look for in your rowgroup analysis.


| Column                             | How to use this data                                                                                                                                                                      |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [table_partition_count]            | If the table is partitioned then you may expect to see higher Open rowgroup counts. Each partition in the distribution could in theory have an open rowgroup associated with it. Factor this into your analysis. A small table that has been partitioned could be optimised by removing the partitioning altogether as this would improve compression.                                                                        |
| [row_count_total]                  | Total row count for the table. For example, you can use this value to calculate percentage of rows in the compressed state.                                                                      |
| [row_count_per_distribution_MAX]   | If all rows are evenly distributed this value would be the target number of rows per distribution. Compare this value with the compressed_rowgroup_count.                                 |
| [COMPRESSED_rowgroup_rows]         | Total number of rows in columnstore format for the table.                                                                                                                                 |
| [COMPRESSED_rowgroup_rows_AVG]     | If the average number of rows is significantly less than the maximum # of rows for a row group then consider using CTAS or ALTER INDEX REBUILD to recompress the data                     |
| [COMPRESSED_rowgroup_count]        | Number of row groups in columnstore format. If this number is very high in relation to the table it is an indicator that the columnstore density is low.                                  |
| [COMPRESSED_rowgroup_rows_DELETED] | Rows are logically deleted in columnstore format. If the number is high relative to table size consider recreating the partition or rebuilding the index as this removes them physically. |
| [COMPRESSED_rowgroup_rows_MIN]     | Use this in conjunction with the AVG and MAX columns to understand the range of values for the rowgroups in your columnstore. A low number over the load threshold (102,400 per partition aligned distribution) suggests that optimisations are available in the data load                                                                                                                                                 |
| [COMPRESSED_rowgroup_rows_MAX]     | As above                                                                                                                                                                                  |
| [OPEN_rowgroup_count]              | Open row groups are normal. One would reasonably expect one OPEN rowgroup per table distribution (60). Excessive numbers suggest data loading across partitions. Double check the partitioning strategy to make sure it is sound                                                                                                                                                                                                |
| [OPEN_rowgroup_rows]               | Each rowgroup can have 1,048,576 rows in it as a maximum. Use this value to see how full the open rowgroups are currently                                                                 |
| [OPEN_rowgroup_rows_MIN]           | Open groups indicate that data is either being trickle loaded into the table or that the previous load spilled over remaining rows into this rowgroup. Use the MIN, MAX, AVG columns to see how much data is sat in OPEN rowgroups. For small tables it could be 100% of all the data! In which case ALTER INDEX REBUILD to force the data to columnstore.                                                                       |
| [OPEN_rowgroup_rows_MAX]           | As above                                                                                                                                                                                  |
| [OPEN_rowgroup_rows_AVG]           | As above                                                                                                                                                                                  |
| [CLOSED_rowgroup_rows]             | Look at the closed rowgroup rows as a sanity check.                                                                                                                                       |
| [CLOSED_rowgroup_count]            | The number of closed rowgroups should be low if any are seen at all. Closed rowgroups can be converted to compressed rowgroups using the ALTER INDEX ... REORGANISE command. However, this is not normally required. Closed groups are automatically converted to columnstore rowgroups by the background "tuple mover" process.                                                                                               |
| [CLOSED_rowgroup_rows_MIN]         | Closed rowgroups should have a very high fill rate. If the fill rate for a closed rowgroup is low then further analysis of the columnstore is required.                                   |
| [CLOSED_rowgroup_rows_MAX]         | As above                                                                                                                                                                                  |
| [CLOSED_rowgroup_rows_AVG]         | As above                                                                                                                                                                                  |


## Step 4: Examine root cause

Examining the root cause helps you to know if you can make table design, loading, or other process changes that will improve the row density in your rowgroups; thereby improving compression and query performance. 

These factors can cause a columnstore index to have significantly less than 1,048,576 rows per each rowgroup. They can also cause rows to go to the delta rowgroup instead of a compressed rowgroup. 

1. Heavy DML operations
2. Small or trickle load operations
3. Too many partitions

### Heavy DML operations** 

Heavy DML operations that update, and delete rows introduce inefficiency into the columnstore. This is especially true when the majority of the rows in a rowgroup are modified.

- Deleting a row from a compressed rowgroup only logically marks the row as deleted. The row remains in the compressed rowgroup until the partition or table is rebuilt.
- Inserting a row adds the row to to an internal rowstore table called a delta rowgroup. The inserted row is not converted to columnstore until the delta rowgroup is full and is marked as closed. Rowgroups are closed once they reach the maximum capacity of 1,048,576 rows. 
- Updating a row in columnstore format is processed as a logical delete and then an insert. The inserted row will be stored in the delta store.

Batched update and insert operations that exceed the bulk threshold of 102,400 rows per partition aligned distribution will be written directly to the columnstore format. However, assuming an even distribution, you would need to be modifying more than 6.144 million rows in a single operation for this to occur. If the number of rows for a given partition aligned distribution is less than 102,400 then the rows will go to the delta store and will stay there until sufficient rows have been inserted or modified to close the rowgroup or the index has been rebuilt.

### Small or Trickle load operations

Small loads that flow into SQL Data Warehouse are also sometimes known as trickle loads. They typically represent a near constant stream of data being ingested by the system. However, as this stream is near continuous the volume of rows is not particularly large. More often than not the data is significantly under the threshold required for a direct load to columnstore format.

In these situations it is often better to land the data first in Azure blob storage and let it accumulate prior to loading. This technique is often known as *micro-batching*.

### Too many partitions

You might have too many partitions. In the massively parallel processing (MPP) architecture one user-defined table is distributed and implemented as 60 tables under the covers. Therefore every columnstore index is implemented as 60 columnstore indexes. Similarly, every partition is implemented across those 60 columnstore indexes. This is a **big difference** from SQL Server which has a symmetric multi-processing (SMP) architecture.  

If you load 1,048,576 rows into one partition of a SMP SQL Server table, it will get compressed into the columnstore. However, if you load 1,048,576 rows into one partition of a SQL Data Warehouse table, only 17,467 rows will land in each of the 60 distributions (assuming even distribution of data). Since 17,467 is less than the threshold of 102,400 rows per distribution, SQL Data Warehouse will hold the data in deltastore rowgroups. Therefore, to load rows directly into compressed columnstore format, you need to load more than 6.1444 million rows (60 x 102,400) into a single partition of a SQL Data Warehouse table. 

## Step 5: Allocate additional compute resources

Rebuilding indexes, especially on large tables, often needs additional resources. SQL Data Warehouse has a workload management feature that can allocate more memory to a user. To understand how to reserve more memory for your index rebuilds, refer to the workload management section of the [concurrency][] article.

## Step 6: Rebuild the index to improve average rows per rowgroup

To merge existing compressed rowgroups and force delta rowgroups into the columnstore, you need to rebuild the index. Usually, there is too much data to rebuild the entire index, and so its best to rebuild one or more partitions. In SQL Data Warehouse, you can rebuild the index in one of these two ways:

1. Use [ALTER INDEX][] to rebuild a partition.
2. Use [CTAS][] to re-create a partition into a new table, and then use partition switching to move the partition back to the original table.

Which way is best? For large volumes of data, [CTAS][] is usually faster than [ALTER INDEX][]. For smaller volumes of data, [ALTER INDEX][] is easier to use.

### Method #1: Use ALTER INDEX to rebuild small volumes of data offline

These examples show how to rebuild the entire columnstore index and rebuild a single partition. On large tables, it is only practical to rebuild a single partition. This is an offline operation.

```sql
-- Rebuild the entire clustered index
ALTER INDEX ALL ON [dbo].[DimProduct] REBUILD
```

```sql
-- Rebuild a single partition
ALTER INDEX ALL ON [dbo].[FactInternetSales] REBUILD Partition = 5
```

For more information, see the ALTER INDEX REBUILD section in [Columnstore Indexes Defragmentation](https://msdn.microsoft.com/library/dn935013.aspx#Anchor_1) and the syntax topic [ALTER INDEX (Transact-SQL)](https://msdn.microsoft.com/library/ms188388.aspx).

### Method #2: Use CTAS to rebuild and partition switch large volumes of data online

This example uses [CTAS][] and partition switching to rebuild a table partition. 


```sql
-- Step 01. Select the partition of data and write it out to a new table using CTAS
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

-- Step 02. Create a SWITCH out table
 
CREATE TABLE dbo.FactInternetSales_20000101
    WITH    (   DISTRIBUTION = HASH(ProductKey)
            ,   CLUSTERED COLUMNSTORE INDEX
            ,   PARTITION   (   [OrderDateKey] RANGE RIGHT FOR VALUES
                                (20000101
                                )
                            )
            )
AS
SELECT *
FROM    [dbo].[FactInternetSales]
WHERE   1=2 -- Note this table will be empty

-- Step 03. Switch OUT the data 
ALTER TABLE [dbo].[FactInternetSales] SWITCH PARTITION 2 TO  [dbo].[FactInternetSales_20000101] PARTITION 2;

-- Step 04. Switch IN the rebuilt data
ALTER TABLE [dbo].[FactInternetSales_20000101_20010101] SWITCH PARTITION 2 TO  [dbo].[FactInternetSales] PARTITION 2;
```

For more details about re-creating partitions using `CTAS`, see [Table partitioning][] and [concurrency][].


## Next Steps

For more detailed advice on index management, review the [manage indexes][] article.

For more management tips head over to the [management][] overview.

<!--Image references-->

<!--Article references-->
[CTAS]: sql-data-warehouse-develop-ctas.md
[Table partitioning]: sql-data-warehouse-develop-table-partitions.md
[Concurrency]: sql-data-warehouse-develop-concurrency.md
[Management]: sql-data-warehouse-manage-monitor.md
[Manage indexes]: sql-data-warehouse-manage-indexes.md

<!--MSDN references-->
[ALTER INDEX]:https://msdn.microsoft.com/library/ms188388.aspx


<!--Other Web references-->