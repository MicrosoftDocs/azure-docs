---
title: Improve columnstore index performance
description: Reduce memory requirements or increase the available memory to maximize the number of rows a columnstore index compresses into each rowgroup.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.date: 10/18/2021
ms.service: synapse-analytics
ms.subservice: sql
ms.topic: conceptual
ms.custom: azure-synapse
---

# Maximize rowgroup quality for columnstore index performance

Rowgroup quality is determined by the number of rows in a rowgroup. Increasing the available memory can maximize the number of rows a columnstore index compresses into each rowgroup.  Use these methods to improve compression rates and query performance for columnstore indexes.

## Why the rowgroup size matters

Since a columnstore index scans a table by scanning column segments of individual rowgroups, maximizing the number of rows in each rowgroup enhances query performance. When rowgroups have a high number of rows, data compression improves which means there is less data to read from disk.

For more information about rowgroups, see [Columnstore Indexes Guide](/sql/relational-databases/indexes/columnstore-indexes-overview?view=azure-sqldw-latest&preserve-view=true).

## Target size for rowgroups

For best query performance, the goal is to maximize the number of rows per rowgroup in a columnstore index. A rowgroup can have a maximum of 1,048,576 rows. It's okay to not have the maximum number of rows per rowgroup. Columnstore indexes achieve good performance when rowgroups have at least 100,000 rows.

## Rowgroups can get trimmed during compression

During a bulk load or columnstore index rebuild, sometimes there's not enough memory available to compress all the rows designated for each rowgroup. When there is memory pressure, columnstore indexes trim the rowgroup sizes so compression into the columnstore can succeed.

When there is insufficient memory to compress at least 10,000 rows into each rowgroup, an error will be generated.

For more information on bulk loading, see [Bulk load into a clustered columnstore index](/sql/relational-databases/indexes/columnstore-indexes-data-loading-guidance?view=azure-sqldw-latest#bulk&preserve-view=true).

## How to monitor rowgroup quality

The dynamic management view (DMV) ([sys.dm_db_column_store_row_group_physical_stats](/sql/relational-databases/system-dynamic-management-views/sys-dm-db-column-store-row-group-physical-stats-transact-sql?view=azure-sqldw-latest&preserve-view=true) contains the view definition matching SQL DB) that exposes useful information such as number of rows in rowgroups and the reason for trimming if there was trimming. You can create the following view as a handy way to query this DMV to get information on rowgroup trimming.

```sql
CREATE VIEW dbo.vCS_rg_physical_stats
AS
WITH cte
AS
(
select   tb.[name]                    AS [logical_table_name]
,        rg.[row_group_id]            AS [row_group_id]
,        rg.[state]                   AS [state]
,        rg.[state_desc]              AS [state_desc]
,        rg.[total_rows]              AS [total_rows]
,        rg.[trim_reason_desc]        AS trim_reason_desc
,        mp.[physical_name]           AS physical_name
FROM    sys.[schemas] sm
JOIN    sys.[tables] tb               ON  sm.[schema_id]          = tb.[schema_id]
JOIN    sys.[pdw_table_mappings] mp   ON  tb.[object_id]          = mp.[object_id]
JOIN    sys.[pdw_nodes_tables] nt     ON  nt.[name]               = mp.[physical_name]
JOIN    sys.[dm_pdw_nodes_db_column_store_row_group_physical_stats] rg      ON  rg.[object_id]     = nt.[object_id]
                                                                            AND rg.[pdw_node_id]   = nt.[pdw_node_id]
                                        AND rg.[distribution_id]    = nt.[distribution_id]
)
SELECT *
FROM cte;
```

The `trim_reason_desc` column indicates whether the rowgroup was trimmed (trim_reason_desc = NO_TRIM implies there was no trimming and row group is of optimal quality). The following trim reasons indicate premature trimming of the rowgroup:

- BULKLOAD: This trim reason is used when the incoming batch of rows for the load had less than 1 million rows. The engine will create compressed row groups if there are greater than 100,000 rows being inserted (as opposed to inserting into the delta store) but sets the trim reason to BULKLOAD. In this scenario, consider increasing your batch load to include more rows. Also, reevaluate your partitioning scheme to ensure it is not too granular as row groups cannot span partition boundaries.
- MEMORY_LIMITATION: To create row groups with 1 million rows, a certain amount of working memory is required by the engine. When available memory of the loading session is less than the required working memory, row groups get prematurely trimmed. The following sections explain how to estimate memory required and allocate more memory.
- DICTIONARY_SIZE: This trim reason indicates that rowgroup trimming occurred because there was at least one string column with wide and/or high cardinality strings. The dictionary size is limited to 16 MB in memory and once this limit is reached the row group is compressed. If you do run into this situation, consider isolating the problematic column into a separate table.

## How to estimate memory requirements

The maximum required memory to compress one rowgroup is, approximately, as follows:

- 72 MB +
- \#rows \* \#columns \* 8 bytes +
- \#rows \* \#short-string-columns \* 32 bytes +
- \#long-string-columns \* 16 MB for compression dictionary

> [!NOTE]
> Where short-string-columns use string data types of <= 32 bytes and long-string-columns use string data types of > 32 bytes.

Long strings are compressed with a compression method designed for compressing text. This compression method uses a *dictionary* to store text patterns. The maximum size of a dictionary is 16 MB. There is only one dictionary for each long string column in the rowgroup.

## Ways to reduce memory requirements

Use the following techniques to reduce the memory requirements for compressing rowgroups into columnstore indexes.

### Use fewer columns

If possible, design the table with fewer columns. When a rowgroup is compressed into the columnstore, the columnstore index compresses each column segment separately. Therefore the memory requirements to compress a rowgroup increase as the number of columns increases.

### Use fewer string columns

Columns of string data types require more memory than numeric and date data types. To reduce memory requirements, consider removing string columns from fact tables and putting them in smaller dimension tables.

Additional memory requirements for string compression:

- String data types up to 32 characters can require 32 additional bytes per value.
- String data types with more than 32 characters are compressed using dictionary methods.  Each column in the rowgroup can require up to an additional 16 MB to build the dictionary.

### Avoid over-partitioning

Columnstore indexes create one or more rowgroups per partition. For data warehousing in Azure Synapse Analytics, the number of partitions grows quickly because the data is distributed and each distribution is partitioned. If the table has too many partitions, there might not be enough rows to fill the rowgroups. The lack of rows does not create memory pressure during compression, but it leads to rowgroups that do not achieve the best columnstore query performance.

Another reason to avoid over-partitioning is there is a memory overhead for loading rows into a columnstore index on a partitioned table. During a load, many partitions could receive the incoming rows, which are held in memory until each partition has enough rows to be compressed. Having too many partitions creates additional memory pressure.

### Simplify the load query

The database shares the memory grant for a query among all the operators in the query. When a load query has complex sorts and joins, the memory available for compression is reduced.

Design the load query to focus only on loading the query. If you need to run transformations on the data, run them separate from the load query. For example, stage the data in a heap table, run the transformations, and then load the staging table into the columnstore index. 

### Adjust MAXDOP

Each distribution compresses rowgroups into the columnstore in parallel when there's more than one CPU core available per distribution. The parallelism requires additional memory resources, which can lead to memory pressure and rowgroup trimming.

To reduce memory pressure, you can use the MAXDOP query hint to force the load operation to run in serial mode within each distribution.

```sql
CREATE TABLE MyFactSalesQuota
WITH (DISTRIBUTION = ROUND_ROBIN)
AS SELECT * FROM FactSalesQuota
OPTION (MAXDOP 1);
```

## Ways to allocate more memory

DWU size and the user resource class together determine how much memory is available for a user query. To increase the memory grant for a load query, you can either increase the number of DWUs or increase the resource class.

- To increase the DWUs, see [How do I scale performance?](../sql-data-warehouse/quickstart-scale-compute-portal.md?context=/azure/synapse-analytics/context/context)
- To change the resource class for a query, see [Change a user resource class example](../sql-data-warehouse/resource-classes-for-workload-management.md?context=/azure/synapse-analytics/context/context#change-a-users-resource-class).

## Next steps

To find more ways to improve performance in Synapse SQL, see the [Performance overview](../overview-terminology.md).

