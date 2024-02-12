---
title: Create and update statistics using Azure Synapse SQL resources
description: Recommendations and examples for creating and updating query-optimization statistics in Azure Synapse SQL.
author: filippopovic
ms.author: fipopovi
ms.reviewer: sngun, wiassaf
ms.date: 10/11/2022
ms.service: synapse-analytics
ms.subservice: sql
ms.topic: conceptual
---
# Statistics in Synapse SQL

Provided in this article are recommendations and examples for creating and updating query-optimization statistics using the Synapse SQL resources: dedicated SQL pool and serverless SQL pool.

## Statistics in dedicated SQL pool

### Why use statistics

The more dedicated SQL pool knows about your data, the faster it can execute queries. After loading data into a dedicated SQL pool, collecting statistics on your data is one of the most important things you can do for query optimization.  

The dedicated SQL pool query optimizer is a cost-based optimizer. It compares the cost of various query plans, and then chooses the plan with the lowest cost. In most cases, it chooses the plan that will execute the fastest.

For example, if the optimizer estimates that the date your query is filtering on will return one row, it will choose one plan. If it estimates that the selected date will return 1 million rows, it will return a different plan.

### Automatic creation of statistics

The dedicated SQL pool engine will analyze incoming user queries for missing statistics when the database AUTO_CREATE_STATISTICS option is set to `ON`.  If statistics are missing, the query optimizer creates statistics on individual columns in the query predicate or join condition. 

This function is used to improve cardinality estimates for the query plan.

> [!IMPORTANT]
> Automatic creation of statistics is currently turned on by default.

You can check if your data warehouse has AUTO_CREATE_STATISTICS configured by running the following command:

```sql
SELECT name, is_auto_create_stats_on
FROM sys.databases
```

If your data warehouse doesn't have AUTO_CREATE_STATISTICS enabled, we recommend you enable this property by running the following command:

```sql
ALTER DATABASE <yourdatawarehousename>
SET AUTO_CREATE_STATISTICS ON
```

These statements will trigger the automatic creation of statistics:

- SELECT
- INSERT-SELECT
- CTAS
- UPDATE
- DELETE
- EXPLAIN when containing a join or the presence of a predicate is detected

> [!NOTE]
> The automatic creation of statistics is not generated on temporary or external tables.

Automatic creation of statistics is done synchronously. So, you may incur slightly degraded query performance if your columns are missing statistics. The time to create statistics for a single column depends on the size of the table.

To avoid measurable performance degradation, you should ensure stats have been created first by executing the benchmark workload before profiling the system.

> [!NOTE]
> The creation of stats is logged in [sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql?view=azure-sqldw-latest&preserve-view=true) under a different user context.

When automatic statistics are created, they'll take the form: _WA_Sys_<8 digit column id in Hex>_<8 digit table id in Hex>. You can view already created stats by running the [DBCC SHOW_STATISTICS](/sql/t-sql/database-console-commands/dbcc-show-statistics-transact-sql?view=azure-sqldw-latest&preserve-view=true) command:

```sql
DBCC SHOW_STATISTICS (<table_name>, <target>)
```

The table_name is the name of the table that contains the statistics to display, which can't be an external table. The target is the name of the target index, statistics, or column for which to display statistics information.

### Update statistics

One best practice is to update statistics on date columns each day as new dates are added. Each time new rows are loaded into the data warehouse, new load dates or transaction dates are added. These additions change the data distribution and make the statistics out of date.

Statistics on a country or region column in a customer table might never need to be updated because the distribution of values doesn't usually change. Assuming the distribution is constant between customers, adding new rows to the table variation isn't going to change the data distribution.

However, when your data warehouse only contains one country or region and you bring in data from a new country or region, then you need to update statistics on the country or region column.

The following are recommendations for updating statistics:

|Type|Recommendation|
|-|-|
| **Frequency of stats updates**  | Conservative: Daily </br> After loading or transforming your data |
| **Sampling** |  Less than 1 billion rows, use default sampling (20 percent). </br> With more than 1 billion rows, use sampling of two percent. |

### Determine last statistics update

One of the first questions to ask when you're troubleshooting a query is, **"Are the statistics up to date?"**

This question isn't one that can be answered by the age of the data. An up-to-date statistics object might be old if there's been no material change to the underlying data. When the number of rows has changed substantially, or a material change in the distribution of values for a column occurs, *then* it's time to update statistics.

There isn't a dynamic management view available to determine if data within the table has changed since the last time statistics were updated. Knowing the age of your statistics can provide you with part of the picture. 

You can use the following query to determine the last time your statistics were updated on each table.

> [!NOTE]
> If there is a material change in the distribution of values for a column, you should update statistics regardless of the last time they were updated.

```sql
SELECT
    sm.[name] AS [schema_name],
    tb.[name] AS [table_name],
    co.[name] AS [stats_column_name],
    st.[name] AS [stats_name],
    STATS_DATE(st.[object_id],st.[stats_id]) AS [stats_last_updated_date]
FROM
    sys.objects ob
    JOIN sys.stats st
        ON  ob.[object_id] = st.[object_id]
    JOIN sys.stats_columns sc
        ON  st.[stats_id] = sc.[stats_id]
        AND st.[object_id] = sc.[object_id]
    JOIN sys.columns co
        ON  sc.[column_id] = co.[column_id]
        AND sc.[object_id] = co.[object_id]
    JOIN sys.types  ty
        ON  co.[user_type_id] = ty.[user_type_id]
    JOIN sys.tables tb
        ON  co.[object_id] = tb.[object_id]
    JOIN sys.schemas sm
        ON  tb.[schema_id] = sm.[schema_id]
WHERE
    st.[user_created] = 1;
```

**Date columns** in a data warehouse, for example, usually need frequent statistics updates. Each time new rows are loaded into the data warehouse, new load dates or transaction dates are added. These additions change the data distribution and make the statistics out of date.

Statistics on a gender column in a customer table might never need to be updated. Assuming the distribution is constant between customers, adding new rows to the table variation isn't going to change the data distribution.

But, if your data warehouse contains only one gender and a new requirement results in multiple genders, then you need to update statistics on the gender column. 

For further information, review the [Statistics](/sql/relational-databases/statistics/statistics) article.

### Implement statistics management

It's often a good idea to extend your data-loading process to ensure that statistics are updated at the end of the load. The data load is when tables most frequently change their size, distribution of values, or both. As such, the load process is a logical place to implement some management processes.

The following guiding principles are provided for updating your statistics during the load process:

- Ensure that each loaded table has at least one statistics object updated. This process updates the table size (row count and page count) information as part of the statistics update.
- Focus on columns participating in JOIN, GROUP BY, ORDER BY, and DISTINCT clauses.
- Consider updating "ascending key" columns such as transaction dates more frequently because these values won't be included in the statistics histogram.
- Consider updating static distribution columns less frequently.
- Remember, each statistic object is updated in sequence. Simply implementing `UPDATE STATISTICS <TABLE_NAME>` isn't always ideal, especially for wide tables with lots of statistics objects.

For more information, see [Cardinality Estimation](/sql/relational-databases/performance/cardinality-estimation-sql-server).

### Examples: Create statistics

These examples show how to use various options for creating statistics. The options that you use for each column depend on the characteristics of your data and how the column will be used in queries.

#### Create single-column statistics with default options

To create statistics on a column, provide a name for the statistics object and the name of the column.
This syntax uses all of the default options. By default, dedicated SQL pool samples **20 percent** of the table when it creates statistics.

```sql
CREATE STATISTICS [statistics_name]
    ON [schema_name].[table_name]([column_name]);
```

For example:

```sql
CREATE STATISTICS col1_stats
    ON dbo.table1 (col1);
```

#### Create single-column statistics by examining every row

The default sampling rate of 20 percent is sufficient for most situations. However, you can adjust the sampling rate. To sample the full table, use this syntax:

```sql
CREATE STATISTICS [statistics_name]
    ON [schema_name].[table_name]([column_name])
    WITH FULLSCAN;
```

For example:

```sql
CREATE STATISTICS col1_stats
    ON dbo.table1 (col1)
    WITH FULLSCAN;
```

#### Create single-column statistics by specifying the sample size

Another option you have is to specify the sample size as a percent:

```sql
CREATE STATISTICS col1_stats
    ON dbo.table1 (col1)
    WITH SAMPLE 50 PERCENT;
```

#### Create single-column statistics on only some of the rows

You can also create statistics on a portion of the rows in your table, which is called a filtered statistic.

For example, you can use filtered statistics when you plan to query a specific partition of a large partitioned table. By creating statistics on only the partition values, the accuracy of the statistics will improve. You'll also experience an improvement in query performance.

This example creates statistics on a range of values. The values can easily be defined to match the range of values in a partition.

```sql
CREATE STATISTICS stats_col1
    ON table1(col1)
    WHERE col1 > '2000101' AND col1 < '20001231';
```

> [!NOTE]
> For the query optimizer to consider using filtered statistics when it chooses the distributed query plan, the query must fit inside the definition of the statistics object. Using the previous example, the query's WHERE clause needs to specify col1 values between 2000101 and 20001231.

#### Create single-column statistics with all the options

You can also combine the options together. The following example creates a filtered statistics object with a custom sample size:

```sql
CREATE STATISTICS stats_col1
    ON table1 (col1)
    WHERE col1 > '2000101' AND col1 < '20001231'
    WITH SAMPLE 50 PERCENT;
```

For the full reference, see [CREATE STATISTICS](/sql/t-sql/statements/create-statistics-transact-sql?view=azure-sqldw-latest&preserve-view=true).

#### Create multi-column statistics

To create a multi-column statistics object, use the previous examples, but specify more columns.

> [!NOTE]
> The histogram, which is used to estimate the number of rows in the query result, is only available for the first column listed in the statistics object definition.

In this example, the histogram is on *product\_category*. Cross-column statistics are calculated on *product\_category* and *product\_sub_category*:

```sql
CREATE STATISTICS stats_2cols
    ON table1 (product_category, product_sub_category)
    WHERE product_category > '2000101' AND product_category < '20001231'
    WITH SAMPLE 50 PERCENT;
```

Because a correlation exists between *product\_category* and *product\_sub\_category*, a multi-column statistics object can be useful if these columns are accessed at the same time. When querying this table, the multi-column statistics will improve cardinality estimations for joins, GROUP BY aggregations, distinct counts, and WHERE filters (so long as the primary statistics column is a part of the filter).

#### Create statistics on all columns in a table

One way to create statistics is to issue CREATE STATISTICS commands after creating the table:

```sql
CREATE TABLE dbo.table1
(
   col1 int
,  col2 int
,  col3 int
)
WITH
  (
    CLUSTERED COLUMNSTORE INDEX
  )
;

CREATE STATISTICS stats_col1 on dbo.table1 (col1);
CREATE STATISTICS stats_col2 on dbo.table2 (col2);
CREATE STATISTICS stats_col3 on dbo.table3 (col3);
```

#### Use a stored procedure to create statistics on all columns in a database

SQL pool doesn't have a system stored procedure equivalent to `sp_create_stats` in SQL Server. This stored procedure creates a single column statistics object on every column of the database that doesn't already have statistics.

The following example will help you get started with your database design. Feel free to adapt it to your needs:

```sql
CREATE PROCEDURE    [dbo].[prc_sqldw_create_stats]
(   @create_type    tinyint -- 1 default, 2 Fullscan, 3 Sample
,   @sample_pct     tinyint
)
AS

IF @create_type IS NULL
BEGIN
    SET @create_type = 1;
END;

IF @create_type NOT IN (1,2,3)
BEGIN
    THROW 151000,'Invalid value for @stats_type parameter. Valid range 1 (default), 2 (fullscan) or 3 (sample).',1;
END;

IF @sample_pct IS NULL
BEGIN;
    SET @sample_pct = 20;
END;

IF OBJECT_ID('tempdb..#stats_ddl') IS NOT NULL
BEGIN;
    DROP TABLE #stats_ddl;
END;

CREATE TABLE #stats_ddl
WITH    (   DISTRIBUTION    = HASH([seq_nmbr])
        ,   LOCATION        = USER_DB
        )
AS
WITH T
AS
(
SELECT      t.[name]                        AS [table_name]
,           s.[name]                        AS [table_schema_name]
,           c.[name]                        AS [column_name]
,           c.[column_id]                   AS [column_id]
,           t.[object_id]                   AS [object_id]
,           ROW_NUMBER()
            OVER(ORDER BY (SELECT NULL))    AS [seq_nmbr]
FROM        sys.[tables] t
JOIN        sys.[schemas] s         ON  t.[schema_id]       = s.[schema_id]
JOIN        sys.[columns] c         ON  t.[object_id]       = c.[object_id]
LEFT JOIN   sys.[stats_columns] l   ON  l.[object_id]       = c.[object_id]
                                    AND l.[column_id]       = c.[column_id]
                                    AND l.[stats_column_id] = 1
LEFT JOIN    sys.[external_tables] e    ON    e.[object_id]        = t.[object_id]
WHERE       l.[object_id] IS NULL
AND            e.[object_id] IS NULL -- not an external table
)
SELECT  [table_schema_name]
,       [table_name]
,       [column_name]
,       [column_id]
,       [object_id]
,       [seq_nmbr]
,       CASE @create_type
        WHEN 1
        THEN    CAST('CREATE STATISTICS '+QUOTENAME('stat_'+table_schema_name+ '_' + table_name + '_'+column_name)+' ON '+QUOTENAME(table_schema_name)+'.'+QUOTENAME(table_name)+'('+QUOTENAME(column_name)+')' AS VARCHAR(8000))
        WHEN 2
        THEN    CAST('CREATE STATISTICS '+QUOTENAME('stat_'+table_schema_name+ '_' + table_name + '_'+column_name)+' ON '+QUOTENAME(table_schema_name)+'.'+QUOTENAME(table_name)+'('+QUOTENAME(column_name)+') WITH FULLSCAN' AS VARCHAR(8000))
        WHEN 3
        THEN    CAST('CREATE STATISTICS '+QUOTENAME('stat_'+table_schema_name+ '_' + table_name + '_'+column_name)+' ON '+QUOTENAME(table_schema_name)+'.'+QUOTENAME(table_name)+'('+QUOTENAME(column_name)+') WITH SAMPLE '+CONVERT(varchar(4),@sample_pct)+' PERCENT' AS VARCHAR(8000))
        END AS create_stat_ddl
FROM T
;

DECLARE @i INT              = 1
,       @t INT              = (SELECT COUNT(*) FROM #stats_ddl)
,       @s NVARCHAR(4000)   = N''
;

WHILE @i <= @t
BEGIN
    SET @s=(SELECT create_stat_ddl FROM #stats_ddl WHERE seq_nmbr = @i);

    PRINT @s
    EXEC sp_executesql @s
    SET @i+=1;
END

DROP TABLE #stats_ddl;
```

To create statistics on all columns in the table using the defaults, execute the stored procedure.

```sql
EXEC [dbo].[prc_sqldw_create_stats] 1, NULL;
```

To create statistics on all columns in the table using a fullscan, call this procedure:

```sql
EXEC [dbo].[prc_sqldw_create_stats] 2, NULL;
```

To create sampled statistics on all columns in the table, enter 3, and the sample percent. The procedure below uses a 20 percent sample rate.

```sql
EXEC [dbo].[prc_sqldw_create_stats] 3, 20;
```

### Examples: Update statistics

To update statistics, you can:

- Update one statistics object. Specify the name of the statistics object you want to update.
- Update all statistics objects on a table. Specify the name of the table instead of one specific statistics object.

#### Update one specific statistics object

Use the following syntax to update a specific statistics object:

```sql
UPDATE STATISTICS [schema_name].[table_name]([stat_name]);
```

For example:

```sql
UPDATE STATISTICS [dbo].[table1] ([stats_col1]);
```

By updating specific statistics objects, you can minimize the time and resources required to manage statistics. This action requires some thought for selecting the best statistics objects to update.

#### Update all statistics on a table

A simple method for updating all the statistics objects on a table is:

```sql
UPDATE STATISTICS [schema_name].[table_name];
```

For example:

```sql
UPDATE STATISTICS dbo.table1;
```

The UPDATE STATISTICS statement is easy to use. Just remember that it updates *all* statistics on the table, prompting more work than is necessary. 

If performance isn't an issue, this method is the easiest and most complete way to guarantee that statistics are up to date.

> [!NOTE]
> When updating all statistics on a table, dedicated SQL pool does a scan to sample the table for each statistics object. If the table is large and has many columns and many statistics, it might be more efficient to update individual statistics based on need.

For an implementation of an `UPDATE STATISTICS` procedure, see [Temporary tables](develop-tables-temporary.md). The implementation method is slightly different from the preceding `CREATE STATISTICS` procedure, but the result is the same.
For the full syntax, see [Update statistics](/sql/t-sql/statements/update-statistics-transact-sql?view=azure-sqldw-latest&preserve-view=true).

### Statistics metadata

There are several system views and functions that you can use to find information about statistics. For example, you can see if a statistics object might be out of date by using the STATS_DATE() function. STATS_DATE() allows you to see when statistics were last created or updated.

#### Catalog views for statistics

These system views provide information about statistics:

| Catalog view | Description |
|:--- |:--- |
| [sys.columns](/sql/relational-databases/system-catalog-views/sys-columns-transact-sql?view=azure-sqldw-latest&preserve-view=true) |One row for each column. |
| [sys.objects](/sql/relational-databases/system-catalog-views/sys-objects-transact-sql?view=azure-sqldw-latest&preserve-view=true) |One row for each object in the database. |
| [sys.schemas](/sql/relational-databases/system-catalog-views/sys-objects-transact-sql?view=azure-sqldw-latest&preserve-view=true) |One row for each schema in the database. |
| [sys.stats](/sql/relational-databases/system-catalog-views/sys-stats-transact-sql?view=azure-sqldw-latest&preserve-view=true) |One row for each statistics object. |
| [sys.stats_columns](/sql/relational-databases/system-catalog-views/sys-stats-columns-transact-sql?view=azure-sqldw-latest&preserve-view=true) |One row for each column in the statistics object. Links back to sys.columns. |
| [sys.tables](/sql/relational-databases/system-catalog-views/sys-tables-transact-sql?view=azure-sqldw-latest&preserve-view=true) |One row for each table (includes external tables). |
| [sys.table_types](/sql/relational-databases/system-catalog-views/sys-table-types-transact-sql?view=azure-sqldw-latest&preserve-view=true) |One row for each data type. |

#### System functions for statistics

These system functions are useful for working with statistics:

| System function | Description |
|:--- |:--- |
| [STATS_DATE](/sql/t-sql/functions/stats-date-transact-sql?view=azure-sqldw-latest&preserve-view=true) |Date the statistics object was last updated. |
| [DBCC SHOW_STATISTICS](/sql/t-sql/database-console-commands/dbcc-show-statistics-transact-sql?view=azure-sqldw-latest&preserve-view=true) |Summary level and detailed information about the distribution of values as understood by the statistics object. |

#### Combine statistics columns and functions into one view

This view brings columns that relate to statistics and results from the STATS_DATE() function together.

```sql
CREATE VIEW dbo.vstats_columns
AS
SELECT
        sm.[name]                           AS [schema_name]
,       tb.[name]                           AS [table_name]
,       st.[name]                           AS [stats_name]
,       st.[filter_definition]              AS [stats_filter_definition]
,       st.[has_filter]                     AS [stats_is_filtered]
,       STATS_DATE(st.[object_id],st.[stats_id])
                                            AS [stats_last_updated_date]
,       co.[name]                           AS [stats_column_name]
,       ty.[name]                           AS [column_type]
,       co.[max_length]                     AS [column_max_length]
,       co.[precision]                      AS [column_precision]
,       co.[scale]                          AS [column_scale]
,       co.[is_nullable]                    AS [column_is_nullable]
,       co.[collation_name]                 AS [column_collation_name]
,       QUOTENAME(sm.[name])+'.'+QUOTENAME(tb.[name])
                                            AS two_part_name
,       QUOTENAME(DB_NAME())+'.'+QUOTENAME(sm.[name])+'.'+QUOTENAME(tb.[name])
                                            AS three_part_name
FROM    sys.objects                         AS ob
JOIN    sys.stats           AS st ON    ob.[object_id]      = st.[object_id]
JOIN    sys.stats_columns   AS sc ON    st.[stats_id]       = sc.[stats_id]
                            AND         st.[object_id]      = sc.[object_id]
JOIN    sys.columns         AS co ON    sc.[column_id]      = co.[column_id]
                            AND         sc.[object_id]      = co.[object_id]
JOIN    sys.types           AS ty ON    co.[user_type_id]   = ty.[user_type_id]
JOIN    sys.tables          AS tb ON    co.[object_id]      = tb.[object_id]
JOIN    sys.schemas         AS sm ON    tb.[schema_id]      = sm.[schema_id]
WHERE   1=1
AND     st.[user_created] = 1
;
```

### DBCC SHOW_STATISTICS() examples

DBCC SHOW_STATISTICS() shows the data held within a statistics object. This data comes in three parts:

- Header
- Density vector
- Histogram

The header is the metadata about the statistics. The histogram displays the distribution of values in the first key column of the statistics object. 

The density vector measures cross-column correlation. Dedicated SQL pool computes cardinality estimates with any of the data in the statistics object.

#### Show header, density, and histogram

This simple example shows all three parts of a statistics object:

```sql
DBCC SHOW_STATISTICS([<schema_name>.<table_name>],<stats_name>)
```

For example:

```sql
DBCC SHOW_STATISTICS ('dbo.table1', 'stats_col1');
```

#### Show one or more parts of DBCC SHOW_STATISTICS()

If you're only interested in viewing specific parts, use the `WITH` clause and specify which parts you want to see:

```sql
DBCC SHOW_STATISTICS([<schema_name>.<table_name>],<stats_name>)
    WITH stat_header, histogram, density_vector
```

For example:

```sql
DBCC SHOW_STATISTICS ('dbo.table1', 'stats_col1')
    WITH histogram, density_vector
```

### DBCC SHOW_STATISTICS() differences

`DBCC SHOW_STATISTICS()` is more strictly implemented in dedicated SQL pool compared to SQL Server:

- Undocumented features aren't supported.
- Can't use Stats_stream.
- Can't join results for specific subsets of statistics data. For example, STAT_HEADER JOIN DENSITY_VECTOR.
- NO_INFOMSGS can't be set for message suppression.
- Square brackets around statistics names can't be used.
- Can't use column names to identify statistics objects.
- Custom error 2767 isn't supported.


## Statistics in serverless SQL pool

Statistics are created per particular column for particular dataset (storage path).

> [!NOTE]
> Statistics cannot be created for LOB columns.

### Why use statistics

The more serverless SQL pool knows about your data, the faster it can execute queries against it. Collecting statistics on your data is one of the most important things you can do to optimize your queries. 

The serverless SQL pool query optimizer is a cost-based optimizer. It compares the cost of various query plans, and then chooses the plan with the lowest cost. In most cases, it chooses the plan that will execute the fastest. 

For example, if the optimizer estimates that the date your query is filtering on will return one row it will choose one plan. If it estimates that the selected date will return 1 million rows, it will pick a different plan.

### Automatic creation of statistics

Serverless SQL pool analyzes incoming user queries for missing statistics. If statistics are missing, the query optimizer creates statistics on individual columns in the query predicate or join condition to improve cardinality estimates for the query plan.

The SELECT statement will trigger automatic creation of statistics.

> [!NOTE]
> For automatic creation of statistics sampling is used and in most cases sampling percentage will be less than 100%. This flow is the same for every file format. Have in mind that when reading CSV with parser version 1.0 sampling is not supported and automatic creation of statistics will not happen with sampling percentage less than 100%. For small tables with estimated low cardinality (number of rows) automatic statistics creation will be triggered with sampling percentage of 100%. That basically means that fullscan is triggered and automatic statistics are created even for CSV with parser version 1.0.

Automatic creation of statistics is done synchronously so you may incur slightly degraded query performance if your columns are missing statistics. The time to create statistics for a single column depends on the size of the files targeted.

### Manual creation of statistics

Serverless SQL pool lets you create statistics manually. In case you are using parser version 1.0 with CSV, you will probably have to create statistics manually, because this parser version does not support sampling. Automatic creation of statistics in case of parser version 1.0 will not happen, unless the sampling percent is 100%.

See the following examples for instructions on how to manually create statistics.

### Update statistics

Changes to data in files, deleting, and adding files result in data distribution changes and makes statistics out of date. In that case, statistics needs to be updated.

Serverless SQL pool automatically recreates statistics if data is changed significantly. Every time statistics are automatically created, the current state of the dataset is also saved: file paths, sizes, last modification dates.

When statistics are stale, new ones will be created. The algorithm goes through the data and compares it to the current state of the dataset. If the size of the changes is greater than the specific threshold, then old stats are deleted and will be re-created over the new dataset.

Manual stats are never declared stale.

> [!NOTE]
> For automatic recreation of statistics sampling is used and in most cases sampling percentage will be less than 100%. This flow is the same for every file format. Have in mind that when reading CSV with parser version 1.0 sampling is not supported and automatic recreation of statistics will not happen with sampling percentage less than 100%. In that case you need to drop and recreate statistics manually. Check the examples below on how to drop and create statistics. For small tables with estimated low cardinality (number of rows) automatic statistics recreation will be triggered with sampling percentage of 100%. That basically means that fullscan is triggered and automatic statistics are created even for CSV with parser version 1.0.

One of the first questions to ask when you're troubleshooting a query is, **"Are the statistics up to date?"**

When the number of rows has changed substantially, or there's a material change in the distribution of values for a column, *then* it's time to update statistics.

> [!NOTE]
> If there is a material change in the distribution of values for a column, you should update statistics regardless of the last time they were updated.

### Implement statistics management

You may want to extend your data pipeline to ensure that statistics are updated when data is significantly changed through addition, deletion, or change of files.

The following guiding principles are provided for updating your statistics:

- Ensure that the dataset has at least one statistics object updated. This updates size (row count and page count) information as part of the statistics update.
- Focus on columns participating in WHERE, JOIN, GROUP BY, ORDER BY, and DISTINCT clauses.
- Update "ascending key" columns such as transaction dates more frequently because these values won't be included in the statistics histogram.
- Update static distribution columns less frequently.

For more information, see [Cardinality Estimation](/sql/relational-databases/performance/cardinality-estimation-sql-server).

### Examples: Create statistics for column in OPENROWSET path 

The following examples show you how to use various options for creating statistics in Azure Synapse serverless SQL pools. The options that you use for each column depend on the characteristics of your data and how the column will be used in queries. For more information on the stored procedures used in these examples, review [sys.sp_create_openrowset_statistics](/sql/relational-databases/system-stored-procedures/sp-create-openrowset-statistics) and [sys.sp_drop_openrowset_statistics](/sql/relational-databases/system-stored-procedures/sp-drop-openrowset-statistics), which apply to serverless SQL pools only.

> [!NOTE]
> You can create single-column statistics only at this moment.
>
> Following permissions are required to execute `sp_create_openrowset_statistics` and `sp_drop_openrowset_statistics`: ADMINISTER BULK OPERATIONS or ADMINISTER DATABASE BULK OPERATIONS.

The following stored procedure is used to create statistics:

```sql
sys.sp_create_openrowset_statistics [ @stmt = ] N'statement_text'
```

Arguments:
[ @stmt = ] N'statement_text' -
Specifies a Transact-SQL statement that will return column values to be used for statistics. You can use TABLESAMPLE to specify samples of data to be used. If TABLESAMPLE isn't specified, FULLSCAN will be used.

```syntaxsql
<tablesample_clause> ::= TABLESAMPLE ( sample_number PERCENT )
```

> [!NOTE]
> CSV sampling does not work if you are using parser version 1.0, only FULLSCAN is supported for CSV with parser version 1.0.

#### Create single-column statistics by examining every row

To create statistics on a column, provide a query that returns the column for which you need statistics.

By default, if you don't specify otherwise when manually creating statistics, serverless SQL pool uses 100% of the data provided in the dataset when it creates statistics.

For example, to create statistics with default options (FULLSCAN) for a population column of the dataset based on the us_population.csv file:

```sql

EXEC sys.sp_create_openrowset_statistics N'SELECT 
    population
FROM OPENROWSET(
    BULK ''Https://azureopendatastorage.blob.core.windows.net/censusdatacontainer/raw_us_population_county/us_population.csv'',
    FORMAT = ''CSV'',
    PARSER_VERSION = ''2.0'',
    HEADER_ROW = TRUE)
AS [r]'

```

#### Create single-column statistics by specifying the sample size

You can specify the sample size as a percent:

```sql
/* make sure you have credentials for storage account access created
IF EXISTS (SELECT * FROM sys.credentials WHERE name = 'https://azureopendatastorage.blob.core.windows.net/censusdatacontainer')
DROP CREDENTIAL [https://azureopendatastorage.blob.core.windows.net/censusdatacontainer]
GO

CREATE CREDENTIAL [https://azureopendatastorage.blob.core.windows.net/censusdatacontainer]  
WITH IDENTITY='SHARED ACCESS SIGNATURE',  
SECRET = ''
GO
*/

EXEC sys.sp_create_openrowset_statistics N'SELECT payment_type
FROM OPENROWSET(
        BULK ''https://sqlondemandstorage.blob.core.windows.net/parquet/taxi/year=2018/month=6/*.parquet'',
         FORMAT = ''PARQUET''
    ) AS [nyc]
    TABLESAMPLE(5 PERCENT)
'
```

### Examples: Update statistics

To update statistics, you need to drop and create statistics. For more information, review [sys.sp_create_openrowset_statistics](/sql/relational-databases/system-stored-procedures/sp-create-openrowset-statistics) and [sys.sp_drop_openrowset_statistics](/sql/relational-databases/system-stored-procedures/sp-drop-openrowset-statistics). 

The `sys.sp_drop_openrowset_statistics` stored procedure is used to drop statistics:

```sql
sys.sp_drop_openrowset_statistics [ @stmt = ] N'statement_text'
```

> [!NOTE]
> Following permissions are required to execute `sp_create_openrowset_statistics` and `sp_drop_openrowset_statistics`: ADMINISTER BULK OPERATIONS or ADMINISTER DATABASE BULK OPERATIONS.

Arguments:
[ @stmt = ] N'statement_text' -
Specifies the same Transact-SQL statement used when the statistics were created.

To update the statistics for the year column in the dataset, which is based on the `population.csv` file, you need to drop and create statistics:

```sql
EXEC sys.sp_drop_openrowset_statistics N'SELECT payment_type
FROM OPENROWSET(
        BULK ''https://sqlondemandstorage.blob.core.windows.net/parquet/taxi/year=2018/month=6/*.parquet'',
         FORMAT = ''PARQUET''
    ) AS [nyc]
    TABLESAMPLE(5 PERCENT)
'
GO

/* make sure you have credentials for storage account access created
IF EXISTS (SELECT * FROM sys.credentials WHERE name = 'https://azureopendatastorage.blob.core.windows.net/censusdatacontainer')
DROP CREDENTIAL [https://azureopendatastorage.blob.core.windows.net/censusdatacontainer]
GO

CREATE CREDENTIAL [https://azureopendatastorage.blob.core.windows.net/censusdatacontainer]  
WITH IDENTITY='SHARED ACCESS SIGNATURE',  
SECRET = ''
GO
*/

EXEC sys.sp_create_openrowset_statistics N'SELECT payment_type
FROM OPENROWSET(
        BULK ''https://sqlondemandstorage.blob.core.windows.net/parquet/taxi/year=2018/month=6/*.parquet'',
         FORMAT = ''PARQUET''
    ) AS [nyc]
    TABLESAMPLE(5 PERCENT)
'
```

### Examples: Create statistics for external table column

The following examples show you how to use various options for creating statistics. The options that you use for each column depend on the characteristics of your data and how the column will be used in queries.

> [!NOTE]
> You can create single-column statistics only at this moment.

To create statistics on a column, provide a name for the statistics object and the name of the column.

```sql
CREATE STATISTICS statistics_name
ON { external_table } ( column )
    WITH
        { FULLSCAN
          | [ SAMPLE number PERCENT ] }
        , { NORECOMPUTE }
```

Arguments:
external_table
Specifies external table that statistics should be created.

FULLSCAN
Compute statistics by scanning all rows. FULLSCAN and SAMPLE 100 PERCENT have the same results. FULLSCAN can't be used with the SAMPLE option.

SAMPLE number PERCENT
Specifies the approximate percentage or number of rows in the table or indexed view for the query optimizer to use when it creates statistics. Number can be from 0 through 100.

SAMPLE can't be used with the FULLSCAN option.

> [!NOTE]
> CSV sampling does not work if you are using parser version 1.0, only FULLSCAN is supported for CSV with parser version 1.0.

#### Create single-column statistics by examining every row

```sql
CREATE STATISTICS sState
    on census_external_table (STATENAME)
    WITH FULLSCAN, NORECOMPUTE
```

#### Create single-column statistics by specifying the sample size

```sql
-- following sample creates statistics with sampling 5%
CREATE STATISTICS sState
    on census_external_table (STATENAME)
    WITH SAMPLE 5 percent, NORECOMPUTE
```

### Examples: Update statistics

To update statistics, you need to drop and create statistics. Drop statistics first:

```sql
DROP STATISTICS census_external_table.sState
```

And create statistics:

```sql
CREATE STATISTICS sState
    on census_external_table (STATENAME)
    WITH FULLSCAN, NORECOMPUTE
```

### Statistics metadata

There are several system views and functions that you can use to find information about statistics. For example, you can see if a statistics object might be out of date by using the STATS_DATE() function. STATS_DATE() allows you to see when statistics were last created or updated.

> [!NOTE]
> Statistics metadata is available for external table columns only. Statistics metadata is not available for OPENROWSET columns.

#### Catalog views for statistics

These system views provide information about statistics:

| Catalog view                                                 | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [sys.columns](/sql/relational-databases/system-catalog-views/sys-columns-transact-sql?view=azure-sqldw-latest&preserve-view=true) | One row for each column.                                     |
| [sys.objects](/sql/relational-databases/system-catalog-views/sys-objects-transact-sql?view=azure-sqldw-latest&preserve-view=true) | One row for each object in the database.                     |
| [sys.schemas](/sql/relational-databases/system-catalog-views/sys-objects-transact-sql?view=azure-sqldw-latest&preserve-view=true) | One row for each schema in the database.                     |
| [sys.stats](/sql/relational-databases/system-catalog-views/sys-stats-transact-sql?view=azure-sqldw-latest&preserve-view=true) | One row for each statistics object.                          |
| [sys.stats_columns](/sql/relational-databases/system-catalog-views/sys-stats-columns-transact-sql?view=azure-sqldw-latest&preserve-view=true) | One row for each column in the statistics object. Links back to sys.columns. |
| [sys.tables](/sql/relational-databases/system-catalog-views/sys-tables-transact-sql?view=azure-sqldw-latest&preserve-view=true) | One row for each table (includes external tables).           |
| [sys.table_types](/sql/relational-databases/system-catalog-views/sys-table-types-transact-sql?view=azure-sqldw-latest&preserve-view=true) | One row for each data type.                                  |

#### System functions for statistics

These system functions are useful for working with statistics:

| System function                                              | Description                                  |
| :----------------------------------------------------------- | :------------------------------------------- |
| [STATS_DATE](/sql/t-sql/functions/stats-date-transact-sql?view=azure-sqldw-latest&preserve-view=true) | Date the statistics object was last updated. |

#### Combine statistics columns and functions into one view

This view brings columns that relate to statistics and results from the STATS_DATE() function together.

```sql
CREATE VIEW dbo.vstats_columns
AS
SELECT
        sm.[name]                           AS [schema_name]
,       tb.[name]                           AS [table_name]
,       st.[name]                           AS [stats_name]
,       st.[filter_definition]              AS [stats_filter_definition]
,       st.[has_filter]                     AS [stats_is_filtered]
,       STATS_DATE(st.[object_id],st.[stats_id])
                                            AS [stats_last_updated_date]
,       co.[name]                           AS [stats_column_name]
,       ty.[name]                           AS [column_type]
,       co.[max_length]                     AS [column_max_length]
,       co.[precision]                      AS [column_precision]
,       co.[scale]                          AS [column_scale]
,       co.[is_nullable]                    AS [column_is_nullable]
,       co.[collation_name]                 AS [column_collation_name]
,       QUOTENAME(sm.[name])+'.'+QUOTENAME(tb.[name])
                                            AS two_part_name
,       QUOTENAME(DB_NAME())+'.'+QUOTENAME(sm.[name])+'.'+QUOTENAME(tb.[name])
                                            AS three_part_name
FROM    sys.objects                         AS ob
JOIN    sys.stats           AS st ON    ob.[object_id]      = st.[object_id]
JOIN    sys.stats_columns   AS sc ON    st.[stats_id]       = sc.[stats_id]
                            AND         st.[object_id]      = sc.[object_id]
JOIN    sys.columns         AS co ON    sc.[column_id]      = co.[column_id]
                            AND         sc.[object_id]      = co.[object_id]
JOIN    sys.types           AS ty ON    co.[user_type_id]   = ty.[user_type_id]
JOIN    sys.tables          AS tb ON    co.[object_id]      = tb.[object_id]
JOIN    sys.schemas         AS sm ON    tb.[schema_id]      = sm.[schema_id]
WHERE   st.[user_created] = 1
;
```

## Next steps

To further improve query performance for dedicated SQL pool, see [Monitor your workload](../sql-data-warehouse/sql-data-warehouse-manage-monitor.md?context=/azure/synapse-analytics/context/context) and [Best practices for dedicated SQL pool](best-practices-dedicated-sql-pool.md#maintain-statistics).

To further improve query performance for serverless SQL pool, see [Best practices for serverless SQL pool](best-practices-serverless-sql-pool.md).
