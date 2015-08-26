<properties
   pageTitle="Table partitions in SQL Data Warehouse | Microsoft Azure"
   description="Tips for using table partitions in Azure SQL Data Warehouse for developing solutions."
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
   ms.date="06/22/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

# Table partitions in SQL Data Warehouse

To migrate SQL Server partition definitions to SQL Data Warehouse:

- Remove SQL Server partition functions and schemes since this is managed for you when you create the table.
- Define the partitions when you create the table. Simply specify partition boundary points and whether you want the boundary point to be effective `RANGE RIGHT` or `RANGE LEFT`.

### Partition sizing
SQL DW offers a DBA several choices for table types: heap, clustered index (CI), and clustered column-store index (CCI).   For each of these table types, the DBA can also partition the table, which means dividing it into multiple sections to improve performance.  However, creating a table with too many partitions can actually cause performance degradations or query failures under some circumstances.  These concerns are especially true for CCI tables.  For partitioning to be helpful, it is important for a DBA to understand when to use partitioning and the number of partitions to create.  These guidelines are intended to help DBAs make the best choices for their scenarios. 

Normally table partitions are useful in two primary ways: 

1. Using partition switching to quickly truncate a section of a table.  A commonly used design is for a fact table to contain rows only for some predetermined finite period.  For example, a sales fact table might contain data only for the past 36 months.  At the end of every month, the oldest month of sales data is deleted from the table.  This could be accomplished by simply deleting all of the rows for the oldest month, but deleting a large amount of data row-by-row can take a very long time.  To optimize for this scenario, SQL DW supports partition swapping, which enables the entire set of rows in a partition to be dropped in a single fast operation.   

2. Partitioning enables queries to easily exclude processing a large set of rows (i.e. a partition) if queries place a predicate on the partitioning column.  For example, if the sales fact table is partitioned into 36 months using the sales date field, then queries that filter on the sale date can skip processing partitions that don’t match the filter.   In effect, partitioning used in this way is a coarse grained index. 

When creating clustered column-store indexes in SQL DW, a DBA needs to consider an additional factor: number of row.   CCI tables can achieve a high degree of compression and helps SQL DW accelerate query performance.  Due to how compression works internally in SQL DW, each partition in a CCI table needs to have a fairly large number of rows before data is compressed. In addition, SQL DW spreads data across a large number of distributions, and each distribution is further divided by partitions.  For optimal compression and performance, a minimum of 100,000 rows per distribution & partition is needed.  Using the example above, if the sales fact table contained 36 monthly partitions, and given that SQL DW has 60 distributions, then the sales fact table should contain 6 million rows per month, or 216 million rows when all months are populated.  If a table contains significantly less rows than the recommended minimum, then the DBA should consider creating the table with fewer partitions in order to make the number of rows per distribution larger.  


To size your current database at the partition level use a query like the one below:

```
SELECT      s.[name]                        AS      [schema_name]
,           t.[name]                        AS      [table_name]
,           i.[name]                        AS      [index_name]
,           p.[partition_number]            AS      [partition_number]
,           SUM(a.[used_pages]*8.0)         AS      [partition_size_kb]
,           SUM(a.[used_pages]*8.0)/1024    AS      [partition_size_mb]
,           SUM(a.[used_pages]*8.0)/1048576 AS      [partition_size_gb]
,           p.[rows]                        AS      [partition_row_count]
,           rv.[value]                      AS      [partition_boundary_value]
,           p.[data_compression_desc]       AS      [partition_compression_desc]
FROM        sys.schemas s
JOIN        sys.tables t                    ON      t.[schema_id]         = s.[schema_id]
JOIN        sys.partitions p                ON      p.[object_id]         = t.[object_id]
JOIN        sys.allocation_units a          ON      a.[container_id]        = p.[partition_id]
JOIN        sys.indexes i                   ON      i.[object_id]         = p.[object_id]
                                            AND     i.[index_id]          = p.[index_id]
JOIN        sys.data_spaces ds              ON      ds.[data_space_id]    = i.[data_space_id]
LEFT JOIN   sys.partition_schemes ps        ON      ps.[data_space_id]    = ds.[data_space_id]
LEFT JOIN   sys.partition_functions pf      ON      pf.[function_id]      = ps.[function_id]
LEFT JOIN   sys.partition_range_values rv   ON      rv.[function_id]      = pf.[function_id]
                                            AND     rv.[boundary_id]      = p.[partition_number]
WHERE       p.[index_id] <=1
GROUP BY    s.[name]
,           t.[name]
,           i.[name]
,           p.[partition_number]
,           p.[rows]
,           rv.[value]
,           p.[data_compression_desc]
;
```

The total number of distributions equals the number of storage locations used when we create a table. That's a complex way of saying that each table is created once per distribution.

You can also anticipate roughly how many rows, and therefore how big, each partition will be. The partition in the source data warehouse will be subdivided into each distribution.

Use the following calculation to guide you when determining your partition size:

MPP Partition Size = SMP Partition Size / Number of Distributions

You can find out how many distributions your SQL Data Warehouse database has using the following query:

```
SELECT  COUNT(*)
FROM    sys.pdw_distributions
;
```

Now you know how big each partition is in the source system and what size you are anticipating for SQLDW you can decide on your partition boundary.

### Workload manangement
One final piece of information you need to factor in to the table partition decision is workload management. In SQL Data Warehouse the maximum memory allocated to each distribution during query execution is governed by this feature. Please refer to the following article for more details on [workload management]. Ideally your partition will be sized with inmemory operations such as columnstore index rebuilds in mind. An index rebuild is a memory intensive operation. Therefore you will want to ensure that the partition index rebuild is not starved of memory. Increasing the amount of memory available to your query can be achieved by switching from the default role to one of the other roles available.

Information on the allocation of memory per distribution is available by querying the resource governor dynamic management views. In reality your memory grant will be less than the figures below. However, this provides a level of guidance that you can use when sizing your partitions for data management operations.

```
SELECT  rp.[name]								AS [pool_name]
,       rp.[max_memory_kb]						AS [max_memory_kb]
,       rp.[max_memory_kb]/1024					AS [max_memory_mb]
,       rp.[max_memory_kb]/1048576				AS [mex_memory_gb]
,       rp.[max_memory_percent]					AS [max_memory_percent]
,       wg.[name]								AS [group_name]
,       wg.[importance]							AS [group_importance]
,       wg.[request_max_memory_grant_percent]	AS [request_max_memory_grant_percent]
FROM    sys.dm_pdw_nodes_resource_governor_workload_groups	wg
JOIN    sys.dm_pdw_nodes_resource_governor_resource_pools	rp ON wg.[pool_id] = rp.[pool_id]
WHERE   wg.[name] like 'SloDWGroup%'
AND     rp.[name]    = 'SloDWPool'
```

> [AZURE.NOTE] Try to avoid sizing your partitions beyond the memory grant provided by the extra large resource class. If your partitions grow beyond this figure you run the risk of memory pressure which in turn leads to less optimal compression.

## Partition switching
To switch partitions between two tables you must ensure that the partitions align on their respective boundaries and that the table definitions match. As check constraints are not available to enforce the range of values in a table the source table must contain the same partition boundaries as the target table. If this is not the case then the parition switch will fail as the partition metadata will not be synchronised.

### How to split a partition that contains data
The most efficient method to split a partition that already contains data is to use a `CTAS` statement. If the partitioned table is a clustered columnstore then the table partition must be empty before it can be split.

Below is a sample partitioned columnstore table containing one row in the final partition:

```
CREATE TABLE [dbo].[FactInternetSales]
(
        [ProductKey]            int          NOT NULL
    ,   [OrderDateKey]          int          NOT NULL
    ,   [CustomerKey]           int          NOT NULL
    ,   [PromotionKey]          int          NOT NULL
    ,   [SalesOrderNumber]      nvarchar(20) NOT NULL
    ,   [OrderQuantity]         smallint     NOT NULL
    ,   [UnitPrice]             money        NOT NULL
    ,   [SalesAmount]           money        NOT NULL
)
WITH
(   CLUSTERED COLUMNSTORE INDEX
,   DISTRIBUTION = HASH([ProductKey])
,   PARTITION   (   [OrderDateKey] RANGE RIGHT FOR VALUES
                    (20000101
                    )
                )
)
;

INSERT INTO dbo.FactInternetSales
VALUES (1,20010101,1,1,1,1,1,1)

CREATE STATISTICS Stat_dbo_FactInternetSales_OrderDateKey ON dbo.FactInternetSales(OrderDateKey)
```

> [AZURE.NOTE] By Creating the statistic object we ensure that table metadata is more accurate. If we omit creating statistics then SQL Data Warehouse will use default values. For details on statistics please review [statistics][].

We can then query for the row count leveraging the `sys.partitions` catalog view:

```
SELECT  QUOTENAME(s.[name])+'.'+QUOTENAME(t.[name]) as Table_name
,       i.[name] as Index_name
,       p.partition_number as Partition_nmbr
,       p.[rows] as Row_count
,       p.[data_compression_desc] as Data_Compression_desc
FROM    sys.partitions p
JOIN    sys.tables     t    ON    p.[object_id]   = t.[object_id]
JOIN    sys.schemas    s    ON    t.[schema_id]   = s.[schema_id]
JOIN    sys.indexes    i    ON    p.[object_id]   = i.[object_Id]
                            AND   p.[index_Id]    = i.[index_Id]
WHERE t.[name] = 'FactInternetSales'
```

If we try to split this table we will get an error:

```
ALTER TABLE FactInternetSales SPLIT RANGE (20020101)
```

Msg 35346, Level 15, State 1, Line 44
SPLIT clause of ALTER PARTITION statement failed because the partition is not empty.  Only empty partitions can be split in when a columnstore index exists on the table. Consider disabling the columnstore index before issuing the ALTER PARTITION statement, then rebuilding the columnstore index after ALTER PARTITION is complete.

However we can use `CTAS` to create a new table to hold our data.

```
CREATE TABLE dbo.FactInternetSales_20010101
    WITH    (   DISTRIBUTION = HASH(ProductKey)
            ,   CLUSTERED COLUMNSTORE INDEX
            ,   PARTITION   (   [OrderDateKey] RANGE RIGHT FOR VALUES
                                (20010101
                                )
                            )
            )
AS
SELECT *
FROM	FactInternetSales
WHERE	1=2
```

As the partition boundaries are aligned a switch is permitted. This will leave the source table with an empty partition that we can subsequently split.

```
ALTER TABLE FactInternetSales SWITCH PARTITION 2 TO  FactInternetSales_20010101 PARTITION 2

ALTER TABLE FactInternetSales SPLIT RANGE (20020101)
```

All that is left to do is to align our data to the new partition boundaries using `CTAS` and switch our data back in to the main table

```
CREATE TABLE [dbo].[FactInternetSales_20010101_20020101]
    WITH    (   DISTRIBUTION = HASH([ProductKey])
            ,   CLUSTERED COLUMNSTORE INDEX
            ,   PARTITION   (   [OrderDateKey] RANGE RIGHT FOR VALUES
                                (20010101,20020101
                                )
                            )
            )
AS
SELECT  *
FROM	[dbo].[FactInternetSales_20010101]
WHERE	[OrderDateKey] >= 20010101
AND     [OrderDateKey] <  20020101

ALTER TABLE FactInternetSales_20010101_20020101 SWITCH PARTITION 3 TO  FactInternetSales PARTITION 3
```

Once you have completed the movement of the data it is a good idea to refresh the statistics on the target table to ensure they accurately reflect the new distribution of the data in their respective partitions:

```
UPDATE STATISTICS [dbo].[FactInternetSales]
```

### Table partitioning source control
To avoid your table definition from **rusting** in your source control system you may want to consider the following approach:

1. Create the table as a partitioned table but with no partition values

```
CREATE TABLE [dbo].[FactInternetSales]
(
    [ProductKey]            int          NOT NULL
,   [OrderDateKey]          int          NOT NULL
,   [CustomerKey]           int          NOT NULL
,   [PromotionKey]          int          NOT NULL
,   [SalesOrderNumber]      nvarchar(20) NOT NULL
,   [OrderQuantity]         smallint     NOT NULL
,   [UnitPrice]             money        NOT NULL
,   [SalesAmount]           money        NOT NULL
)
WITH
(   CLUSTERED COLUMNSTORE INDEX
,   DISTRIBUTION = HASH([ProductKey])
,   PARTITION   (   [OrderDateKey] RANGE RIGHT FOR VALUES
                    ()
                )
)
;
```

2. `SPLIT` the table as part of the deployment process:

```
-- Create a table containing the partition boundaries

CREATE TABLE #partitions
WITH
(
    LOCATION = USER_DB
,   DISTRIBUTION = HASH(ptn_no)
)
AS
SELECT  ptn_no
,       ROW_NUMBER() OVER (ORDER BY (ptn_no)) as seq_no
FROM    (
        SELECT CAST(20000101 AS INT) ptn_no
        UNION ALL
        SELECT CAST(20010101 AS INT)
        UNION ALL
        SELECT CAST(20020101 AS INT)
        UNION ALL
        SELECT CAST(20030101 AS INT)
        UNION ALL
        SELECT CAST(20040101 AS INT)
        ) a
;

-- Iterate over the partition boundaries and split the table

DECLARE @c INT = (SELECT COUNT(*) FROM #partitions)
,       @i INT = 1                     --iterator for while loop
,       @q NVARCHAR(4000)              --query
,       @p NVARCHAR(20)     = N''      --partition_number
,       @s NVARCHAR(128)    = N'dbo'   --schema
,       @t NVARCHAR(128)    = N'table' --table
;

WHILE @i <= @c
BEGIN
    SET @p = (SELECT ptn_no FROM #partitions WHERE seq_no = @i);
    SET @q = (SELECT N'ALTER TABLE '+@s+N'.'+@t+N' SPLIT RANGE ('+@p+N');');

    -- PRINT @q;
    EXECUTE sp_executesql @q;

    SET @i+=1;
END

-- Code clean-up

DROP TABLE #partitions;
```

With this approach the code in source control remains static and the partitioning boundary values are allowed to be dynamic; evolving with the warehouse over time.

>[AZURE.NOTE] Partition switching has a few differences in comparison to SQL Server. Be sure to read [Migrate your code][] to learn more about this subject.


## Next steps
Once you have successfully migrated your database schema to SQL Data Warehouse you can proceed to one of the following articles:

- [Migrate your data][]
- [Migrate your code][]

<!--Image references-->

<!-- Article references -->
[Migrate your code]: sql-data-warehouse-migrate-code.md
[Migrate your data]: sql-data-warehouse-migrate-data.md
[statistics]: sql-data-warehouse-develop-statistics.md
[workload management]: sql-data-warehouse-develop-concurrency.md

<!-- MSDN Articles -->

<!-- Other web references -->

