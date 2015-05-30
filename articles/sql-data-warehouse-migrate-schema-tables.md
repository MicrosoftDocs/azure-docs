<properties
   pageTitle="Page title that displays in the browser tab and search results"
   description="Article description that will be displayed on landing pages and in most search results"
   services="service-name"
   documentationCenter="dev-center-name"
   authors="GitHub-alias-of-only-one-author"
   manager="manager-alias"
   editor=""/>

<tags
   ms.service="required"
   ms.devlang="may be required"
   ms.topic="article"
   ms.tgt_pltfrm="may be required"
   ms.workload="required"
   ms.date="mm/dd/yyyy"
   ms.author="JRJ@BigBangData.co.uk"/>

# Migrate your table schemas #
Migrating table schemas to SQL Data Warehouse will undoubtedly require some changes. This article describes how to migrate each category of SQL Server table definitions.

Reasons for differences:

- As a Cloud service, SQL Data Warehouse does not require all of the SQL Server features.
- As a massively parallel processing (MPP) system, SQL Data Warehouse has some differences in the way tables are stored. 
- Support for Transact-SQL features in SQL Server is constantly improving. New compatibility features are added on an on-going basis.

Basic table schema migration steps

### Prerequisites
Work through the [Database schema migration tutorial][].


## Step 1: Profile your existing data source

It is a good idea to perform a simple profile of your existing data warehouse. This will speed up the decision making process for table schema migration.

Create a profile of your data for:

- Table Size
- Key Columns
- Query Patterns - joins, group by, and distinct

### Step 1.1. Identify table sizes ###
Knowing the table size will help you decide how to distribute your tables. If the table is small, like a date dimension, then distributing with the round-robin method is usually the best choice. If the table is large, then performance will usually improve with the hash distribution method.


- Start an Excel spreadsheet that lists all your tables names and their sizes. Then sort by size in descending order so you can prioritize your migration efforts according to table size.

### Step 1.2. Identify candidates for distribution columns ###
Knowing the key columns will help you make table distribution decisions, especially for the tables that you decide to hash distribute. 

For each large table in your spreadsheet, list the columns that are primary keys, foreign keys, and frequent joining columns. Ask yourself the following questions about each column you identified.

- Is the column NULL-able?
- How many distinct values does the column contain?
- How evenly are the distinct values spread across the rows in the column?
- What data type is used for the column?
- Do queries frequently join this column to another table?
- Do queries use this column in the group by clause or in other aggregation operations?

For best performance, the distribution column should have as many of these characteristics as possible.

- NOT NULL-able column
- Large numbers of distinct values in the column (>1000)
- No dominating values within the rows of the column. Ideally, every row contains a different value.
- Integer based column
- Used frequently as a joining column
- Used in aggregations

Create a list of columns that are good candidates for the distribution key column. The best candidates are the columns that most closely match the performance characteristics we just described. 

Save this shortlist of columns, which are sometimes called distribution candidate keys. Your final decision should be based on the principles laid out in the [database design] article.


## Step 2: Identify and fix inconsistent data types ##

### Why type consistency is important
Type consistency is very important, especially for distribution columns that are used in joins.

- The hash function is deterministic, which means it hashes the same values to the same distributed location.
- SQL Data Warehouse performs the hash on the literal byte values, not the logical value. 
- Therefore the same value stored in different data types will not hash to the same distributed location.
- As a result, queries on distribution columns will not recognize values that are logically the same, but physically different.

> [AZURE.NOTE] Different types have different physical byte values even when the logical value is the same. For example, the logical value "4" as a tinyint is '00000100' and as a smallint is '00000000 00000100'. The hash function does not hash these physical values to the same distributed location.

> [AZURE.NOTE] For high MPP performance, SQL Data Warehouse does not perform implicit type conversions on distribution columns. Therefore, queries on distribution columns will not recognize values that are logically the same, but physically different.

If you put explicit type conversions into your queries, you will get the correct query results, but at the expense of slower query performance. Since the types don't match, SQL Data Warehouse must re-distribute data prior to performing the query. Although this is transparent to you as a user, it does result in slower execution.

2.1. Identify inconsistent data types

There are several approaches you can take to finding columns with inconsistent data types. This query finds type inconsistency based on matching column names:

```
WITH T
AS
(
SELECT 	T.NAME
,		C.NAME CNAME
,		Y.NAME YNAME
,		C.IS_NULLABLE
,		C.MAX_LENGTH
,		C.PRECISION
,		C.SCALE
,		C.COLUMN_ID
FROM SYS.COLUMNS C
JOIN SYS.TABLES T	ON C.OBJECT_ID 		= T.OBJECT_ID
JOIN SYS.TYPES Y	ON C.USER_TYPE_ID 	= Y.USER_TYPE_ID
)
SELECT *
FROM T      as T1
FULL JOIN T as T2 ON T1.[CNAME] = T2.[CNAME]
WHERE	T1.[YNAME]			<> T2.[YNAME]
OR		T1.[IS_NULLABLE]	<> T2.[IS_NULLABLE]
OR		T1.[MAX_LENGTH]		<> T2.[MAX_LENGTH]
OR		T1.[PRECISION]		<> T2.[PRECISION]
OR		T1.[SCALE]			<> T2.[SCALE]
;
```

## Step 3: Migrate table definitions
The following summaries will help you understand the differences between SQL Server and SQL Data Warehouse.

### Table features
SQL Data Warehouse does not use or support these features:

- Primary Keys
- Foreign Keys
- Check Constraints
- Unique constraints
- Unique indexes
- Computed columns
- Sparse columns
- User defined types
- Indexed views
- Identities
- Sequences
- Triggers
- Synonyms

### Data type differences
SQL Data Warehouse supports these common business data types:

- **bigint**
- **binary**
- **bit**
- **char**
- **date**
- **datetime**
- **datetime2**
- **datetimeoffset**
- **decimal**
- **float**
- **int**
- **money**
- **nchar**
- **nvarchar**
- **real**
- **smalldatetime**
- **smallint**
- **smallmoney**
- **time**
- **tinyint**
- **varbinary**
- **varchar**

You can use this query to identify columns in your data warehouse that contain incompatible or user-defined data types:

```
SELECT  t.[name]
,       c.[name]
,       c.[system_type_id]
,       c.[user_type_id]
,       y.[is_user_defined]
,       y.[name]
FROM sys.tables  t
JOIN sys.columns c on t.[object_id]    = c.[object_id]
JOIN sys.types   y on c.[user_type_id] = y.[user_type_id]
WHERE y.[name] IN
                (   'geography'
                ,   'geometry'
                ,   'hierarchyid'
                ,   'image'
                ,   'ntext'
                ,   'numeric'
                ,   'sql_variant'
                ,   'sysname'
                ,   'text'
                ,   'timestamp'
                ,   'uniqueidentifier'
                ,   'xml'
                )

OR  (   y.[name] IN (  'nvarchar','varchar','varbinary')
    AND c.[max_length] = -1
    )
OR  y.[is_user_defined] = 1
;

```

If you have unsupported types in your database do not worry. The following are some alternatives.

Instead of:

- **geometry**, use a varbinary type
- **geography**, use a varbinary type
- **hierarchyid**, CLR type not native
- **image**, **text**, or **ntext** when text based use varchar/nvarchar (smaller is better)
- **nvarchar(max)**, use varchar(4000) or smaller for better performance
- **numeric**, use decimal
- **sql_variant**, split column into several strongly typed columns
- **sysname**, use nvarchar(128)
- **table**, convert to temporary tables
- **timestamp**, re-work code to use datetime2 and `CURRENT_TIMESTAMP` function. Note you cannot have current_timestamp as a default constraint and the value will not automatically update. If you need to migrate rowversion values from a timestamp typed column then use BINARY(8) or VARBINARY(8) for NOT NULL or NULL row version values.
- **varchar(max)**, use varchar(8000) or smaller for better performance
- **uniqueidentifier**, use varbinary(8)
- **user defined types**, convert back to their native types where possible
- **xml**, use a varchar(8000) or smaller for better performance - split across columns if needed

Partial support:

- Default constraints support literals and constants only. Non-deterministic expressions or functions, such as `GETDATE()` or `CURRENT_TIMESTAMP`, are not supported.

> [AZURE.NOTE] Define your tables so that the maximum possible row size, including the full length of variable length columns, does not exceed 32,767 bytes. While you can define a row with variable length data that can exceed this figure, you will not be be able to insert data into the table. Also, try to limit the size of your variable length columns for even better throughput for running queries.

## Step 4: Migrate table partitions ##
To migrate SQL Server partition definitions to SQL Data Warehouse:
- Remove SQL Server partition functions and schemes since this is managed for you when you create the table.
- Define the partitions when you create the table. Simply specify partition boundary points and whether you want the boundary point to be effective `RANGE RIGHT` or `RANGE LEFT`.

### Partition Sizing ###
Partition sizing is an important consideration for SQL DW. Typically data management operations and data loading routines target individual partitions rather than tackling the whole table all at once. This is particularly relevant to clustered columnstores (CCI). CCI's can consume significant amounts of memory. Therefore, whilst we may want to revise the granularity of the partitioning plan we do not want to size the partitions to such a size that we run into memory pressure when trying to perform management tasks.

When deciding the granularity of the partitions it is important to remember that SQL DW will automatically distribute the data into distributions. Consequently, data that would have normally existed in one table in one partition in an SQL Server database now exists in one partition across many tables in a SQL DW data warehouse. To maintain a meaningful number of rows in each partition one typically changes the partition boundary size. For example, if you have used day level partitioning for your data warehouse you may want to consider something less granular such as month or quarter.

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

You can find out how many distributions your SQL DW database has using the following query:

```
SELECT  COUNT(*)
FROM    sys.pdw_distributions
;
```

Now you know how big each partition is in the source system and what size you are anticipating for SQLDW you can decide on your partition boundary.

### Workload Manangement ###
One final piece of information you need to factor in to the table partition decision is workload management. In SQLDW the maximum memory allocated to each distribution during query execution is governed by this feature. Please refer to the following article for more details on [workload management]. Ideally your partition will be sized with inmemory operations such as columnstore index rebuilds in mind. An index rebuild is a memory intensive operation. Therefore you will want to ensure that the partition index rebuild is not starved of memory. Increasing the amount of memory available to your query can be achieved by switching from the default role to one of the other roles available.

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

## Partition Switching ##
To switch partitions between two tables you must ensure that the partitions align on their respective boundaries and that the table definitions match. As check constraints are not available to enforce the range of values in a table the source table must contain the same partition boundaries as the target table. If this is not the case then the parition switch will fail as the partition metadata will not be synchronised.

### How to split a partition that contains data ###
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

> [AZURE.NOTE] By Creating the statistic object we ensure that SQLDW table metadata is more accurate. If we omit creating statistics then SQLDW will use default values. For details on statistics please review this article [MOREINFO]

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

### Table Partitioning Source Control ###
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

>[AZURE.NOTE] Partition switching has a few differences in comparison to SQL Server. Be sure to read [Migrate Your Code] to learn more about this subject.

## Implement Statistics Management Procedures ##
Statistics in SQLDW are implemented slightly differently in SQLDW compared to SQL Server and Azure SQL Database in that there is no automated management of statistics. It is therefore up to you to both create them and periodically update them. Please refer to the [product differences] article for more information.

A good set of up-to-date statistics is an important part of SQLDW. You should extend your data loading process to ensure that statistics are updated at the end of the load. Below are some points to guide you on how best to achieve this:

- Ensure that each loaded table has at least one statistics object updated. This updates the tables size (row count and page count) information as part of the stats update.
- Focus on columns participating in JOIN, GROUP BY, ORDER BY and DISTINCT clauses
- Consider updating "ascending key" columns such as transaction dates more frequently as these values will not be included in the statistics histogram.
- Consider updating static distribution columns less frequently.
- Remember each statistic object is updated in series. Simply implementing `UPDATE STATISTICS <TABLE_NAME>` may not be ideal - especially for wide tables with lots of statistics objects.
> [AZURE. NOTE] For more details on [ascending key] please refer to the SQL Server 2014 cardinality estimation model whitepaper

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
Once you have successfully migrated your database schema to SQLDW you can proceed to one of the following articles:
- [migrate your data]
- [migrate your code]

<!--Image references-->

<!-- GitHub Articles -->
[Database schema migration tutorial]: ./sql-data-warehouse-migrate-schema-database.md

[migrate your code]: ./sql-dw-migrate-code/
[migrate your data]: ./sql-dw-migrate-data/
[database design]: ./sql-dw-develop-database-design/
[generate statistics]: ./sql-dw-develop-generate-statistics/
[limitations and restrictions]: ./sql-dw-develop-limitations-restictions/
[product differences]: ./sql-dw-develop-product-differences/

<!-- MSDN Articles -->
[workload management]: (http://msdn.microsoft.com/BLAH)
