<properties
   pageTitle="Managing table distribution skew | Microsoft Azure"
   description="Guidance to help users identify distribution skew in their distributed tables"
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
   ms.date="03/23/2016"
   ms.author="jrj;barbkess;sonyama"/>

# Managing columnstore indexes
Columnstore indexes are the backbone of Azure SQL Data Warehouse. By keeping the indexes in an optimal state you will maximise the performance of your system.

This article explains how to interrogate the columnstore index metadata for your tables; helping you to diagnose issues and resolve them quickly.

## Querying Columnstore metadata
To understand the density of your columnstore index a query against the system metadata is required. Below is an example of the kind of information you can uncover.

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

Once the view has been created the columnstore metadata can be easily analysed. An example query is provided below.

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

## Improving columnstore density
Once you have run the query you can begin to look at the data and analyse your results. 

There are several things to look at:

| Column                             | How to use this data                                                                                                                                                                      |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [table_partition_count]            | If the table is partitioned then you may expect to see higher Open rowgroup counts. Each partition in the distribution could in theory have an open rowgroup associated with it. Factor this into your analysis. A small table that has been partitioned could be optimised by removing the partitioning altogether as this would improve compression.                                                                        |
| [row_count_total]                  | Total row count for the table this value can be used to calculate percentage of rows in compressed state for example                                                                      |
| [row_count_per_distribution_MAX]   | If all rows are evenly distributed this value would be the target number of rows per distribution. Compare this value with the compressed_rowgroup_count.                                 |
| [COMPRESSED_rowgroup_rows]         | Total number of rows in columnstore format for the table                                                                                                                                  |
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
| [CLOSED_rowgroup_rows]             | Look at the closed rowgroup rows as a sanity check. If there                                                                                                                              |
| [CLOSED_rowgroup_count]            | The number of closed rowgroups should be low if any are seen at all. Closed rowgroups can be converted to compressed rowgroups using the ALTER INDEX ... REORGANISE command. However, this is not normally required. Closed groups are automatically converted to columnstore rowgroups by the background "tuple mover" process.                                                                                               |
| [CLOSED_rowgroup_rows_MIN]         | Closed rowgroups should have a very high fill rate. If the fill rate for a closed rowgroup is low then further analysis of the columnstore is required.                                   |
| [CLOSED_rowgroup_rows_MAX]         | As above                                                                                                                                                                                  |
| [CLOSED_rowgroup_rows_AVG]         | As above                                                                                                                                                                                  |

## Index Management
Recompressing the rowgroups can be achieved by either creating the partitions using [CTAS][] or by rebuilding the index itself using [ALTER INDEX][]. [CTAS][] generally performs faster than [ALTER INDEX][] - especially for large tables or partitions. However, for smaller tables or partitions [ALTER INDEX][] is often much more convenient.

>[AZURE.NOTE] ALTER INDEX...REBUILD is an offline operation. ALTER INDEX...REORGANISE is an online operation. However REORGANISE does not touch open rowgroups. To include open rowgroups ALTER INDEX...REBUILD is required.

Rebuilding indexes, especially largely tables, often benefit from additional resources. Azure SQL Data Warehouse has a workload management feature which can be used to allocate more memory to a user. To understand how to reserve more memory for your index rebuilds please refer to the workload management section of the [concurrency][] article.

## Next Steps
For more details on recreating partitions using `CTAS` please refer to the following articles:

* [Table partitioning][]
* [concurrency][]

For more detailed advice on index management please review the [manage indexes][] article.

For more management tips head over to the [management][] overview

<!--Image references-->

<!--Article references-->
[CTAS]: sql-data-warehouse-develop-ctas.md
[Table partitioning]: sql-data-warehouse-develop-table-partitions.md
[Concurrency]: sql-data-warehouse-develop-concurrency.md
[Management]: sql-data-warehouse-manage-monitor.md
[Manage indexes]: sql-data-warehouse-manage-indexes.md

<!--MSDN references-->
[ALTER INDEX]:https://msdn.microsoft.com/en-us/library/ms188388.aspx


<!--Other Web references-->