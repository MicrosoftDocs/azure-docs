<properties
   pageTitle="Managing statistics on tables in SQL Data Warehouse | Microsoft Azure"
   description="Getting started with statistics on tables in Azure SQL Data Warehouse."
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
   ms.date="06/30/2016"
   ms.author="jrj;barbkess;sonyama"/>

# Managing statistics on tables in SQL Data Warehouse

> [AZURE.SELECTOR]
- [Overview][]
- [Data Types][]
- [Distribute][]
- [Index][]
- [Partition][]
- [Statistics][]
- [Temporary][]

The more SQL Data Warehouse knows about your data, the faster it can execute queries against your data.  The way that you tell SQL Data Warehouse about your data, is by collecting statistics about your data.  Having statistics on your data is one of the most important things you can do to optimize your queries.  Statistics help SQL Data Warehouse create the most optimal plan for your queries.  This is because the SQL Data Warehouse query optimizer is a cost based optimizer.  That is, it compares the cost of various query plans and then chooses the plan with the lowest cost, which should also be the plan that will execute the fastest.

Statistics can be created on a single column, multiple columns or on an index of a table.  Statistics are stored in a histogram which captures the range and selectivity of values.  This is of particular interest when the optimizer needs to evaluate JOINs, GROUP BY, HAVING and WHERE clauses in a query.  For example, if the optimizer estimates that the date you are filtering in your query will return 1 row, it may choose a very different plan than if it estimates that they date you have selected will return 1 million rows.  While creating statistics is extremely important, it is equally important that statistics *accurately* reflect the current state of the table.  Having up-to-date statistics ensures that a good plan is selected by the optimizer.  The plans created by the optimizer are only as good as the statistics on your data.

The process of creating and updating statistics is currently a manual process, but is very simple to do.  This is unlike SQL Server which automatically creates and updates statistics on single columns and indexes.  By using the information below, you can greatly automate the management of the statistics on your data. 

## Getting started with statistics

 Creating sampled statistics on every column is an easy way to get started with statistics.  Since it is equally important to keep statistics up-to-date, a conservative approach may be to update your statistics daily or after each load. There are always trade-offs between performance and the cost to create and update statistics.  If you find it is taking too long to maintain all of your statistics, you may want to try to be more selective about which columns have statistics or which columns need frequent updating.  For example, you might want to update date columns daily, as new values may be added rather than after every load. Again, you will gain the most benefit by having statistics on columns involved in JOINs, GROUP BY, HAVING and WHERE clauses.  If you have a table with a lot of columns which are only used in the SELECT clause, statistics on these columns may not help, and spending a little more effort to identify only the columns where statistics will help, can reduce the time to maintain your statistics.

## Multi-column statistics

In addition to creating statistics on single columns, you may find that your queries will benefit from multi-column statistics.  Multi-column statistics are statistics created on a list of columns.  They include single column statistics on the first column in the list, plus some cross-column correlation information called densities.  For example, if you have a table that joins to another on two columns, you may find that SQL Data Warehouse can better optimize the plan if it understands the relationship between two columns.   Multi-column statistics can improve query performance for some operations such as composite joins and group by.

## Updating statistics

Updating statistics is an important part of your database management routine.  When the distribution of data in the database changes, statistics need to be updated.  Out-of-date statistics will lead to sub-optimal query performance.

One best practice is to update statistics on date columns each day as new dates are added.  Each time new rows are loaded into the data warehouse, new load dates or transaction dates are added. These change the data distribution and make the statistics out-of-date. Conversely, statistics on a country column in a customer table might never need to be updated, as the distribution of values doesn’t generally change. Assuming the distribution is constant between customers, adding new rows to the table variation isn't going to change the data distribution. However, if your data warehouse only contains one country and you bring in data from a new country, resulting in data from multiple countries being stored, then you definitely need to update statistics on the country column.

One of the first questions to ask when troubleshooting a query is, "Are the statistics up-to-date?"

This question is not one that can be answered by the age of the data. An up to date statistics object could be very old if there's been no material change to the underlying data. When the number of rows has changed substantially or there is a material change in the distribution of values for a given column *then* it's time to update statistics.  

For reference, **SQL Server** (not SQL Data Warehouse) automatically updates statistics for these situations:

- If you have zero rows in the table, when you add rows, you’ll get an automatic update of statistics
- When you add more than 500 rows to a table starting with less than 500 rows (e.g. at start you have 499 and then add 500 rows to a total of 999 rows), you’ll get an automatic update 
- Once you’re over 500 rows you will have to add 500 additional rows + 20% of the size of the table before you’ll see an automatic update on the stats

Since there is no DMV to determine if data within the table has changed since the last time statistics were updated, knowing the age of your statistics can provide you with part of the picture.  You can use the following query to determine the last time your statistics where updated on each table.  

> [AZURE.NOTE] Remember if there is a material change in the distribution of values for a given column, you should update statistics regardless of the last time they were updated.  

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

Date columns in a data warehouse, for example, usually need frequent statistics updates. Each time new rows are loaded into the data warehouse, new load dates or transaction dates are added. These change the data distribution and make the statistics out-of-date.  Conversely, statistics on a gender column on a customer table might never need to be updated. Assuming the distribution is constant between customers, adding new rows to the table variation isn't going to change the data distribution. However, if your data warehouse only contains one gender and a new requirement results in multiple genders then you definitely need to update statistics on the gender column.

For further explanation, see [Statistics][] on MSDN.

## Implementing statistics management

It is often a good idea to extend your data loading process to ensure that statistics are updated at the end of the load. The data load is when tables most frequently change their size and/or their distribution of values. Therefore, this is a logical place to implement some management processes.

Some guiding principles are provided below for updating your statistics during the load process:

- Ensure that each loaded table has at least one statistics object updated. This updates the tables size (row count and page count) information as part of the stats update.
- Focus on columns participating in JOIN, GROUP BY, ORDER BY and DISTINCT clauses
- Consider updating "ascending key" columns such as transaction dates more frequently as these values will not be included in the statistics histogram.
- Consider updating static distribution columns less frequently.
- Remember each statistic object is updated in series. Simply implementing `UPDATE STATISTICS <TABLE_NAME>` may not be ideal - especially for wide tables with lots of statistics objects.

> [AZURE.NOTE] For more details on [ascending key] please refer to the SQL Server 2014 cardinality estimation model whitepaper.

For further explanation, see  [Cardinality Estimation][] on MSDN.

## Examples: Create statistics

These examples show how to use various options for creating statistics. The options that you use for each column depend on the characteristics of your data and how the column will be used in queries.

### A. Create single-column statistics with default options

To create statistics on a column, simply provide a name for the statistics object and the name of the column.

This syntax uses all of the default options. By default, SQL Data Warehouse samples 20 percent of the table when it creates statistics.

```sql
CREATE STATISTICS [statistics_name] ON [schema_name].[table_name]([column_name]);
```

For example:

```sql
CREATE STATISTICS col1_stats ON dbo.table1 (col1);
```

### B. Create single-column statistics by examining every row

The default sampling rate of 20 percent is sufficient for most situations. However, you can adjust the sampling rate.

To sample the full table, use this syntax:

```sql
CREATE STATISTICS [statistics_name] ON [schema_name].[table_name]([column_name]) WITH FULLSCAN;
```

For example:

```sql
CREATE STATISTICS col1_stats ON dbo.table1 (col1) WITH FULLSCAN;
```

### C. Create single-column statistics by specifying the sample size

Alternatively, you can specify the sample size as a percent:

```sql
CREATE STATISTICS col1_stats ON dbo.table1 (col1) WITH SAMPLE = 50 PERCENT;
```

### D. Create single-column statistics on only some of the rows

Another option, you can create statistics on a portion of the rows in your table. This is called a filtered statistic.

For example, you could use filtered statistics when you plan to query a specific partition of a large partitioned table. By creating statistics on only the partition values, the accuracy of the statistics will improve, and therefore improve query performance.

This example creates statistics on a range of values. The values could easily be defined to match the range of values in a partition.

```sql
CREATE STATISTICS stats_col1 ON table1(col1) WHERE col1 > '2000101' AND col1 < '20001231';
```

> [AZURE.NOTE] For the query optimizer to consider using filtered statistics when it chooses the distributed query plan, the query must fit inside the definition of the statistics object. Using the previous example, the query's where clause needs to specify col1 values between 2000101 and 20001231.

### E. Create single-column statistics with all the options

You can, of course, combine the options together. The example below creates a filtered statistics object with a custom sample size:

```sql
CREATE STATISTICS stats_col1 ON table1 (col1) WHERE col1 > '2000101' AND col1 < '20001231' WITH SAMPLE = 50 PERCENT;
```

For the full reference, see [CREATE STATISTICS][] on MSDN.

### F. Create multi-column statistics

To create a multi-column statistics, simply use the previous examples, but specify more columns.

> [AZURE.NOTE] The histogram, which is used to estimate number of rows in the query result, is only available for the first column listed in the statistics object definition.

In this example, the histogram is on *product\_category*. Cross-column statistics are calculated on *product\_category* and *product\_sub_c\ategory*:

```sql
CREATE STATISTICS stats_2cols ON table1 (product_category, product_sub_category) WHERE product_category > '2000101' AND product_category < '20001231' WITH SAMPLE = 50 PERCENT;
```

Since there is a correlation between *product\_category* and *product\_sub\_category*, a multi-column stat can be useful if these columns are accessed at the same time.

### G. Create statistics on all the columns in a table

One way to create statistics is to issues CREATE STATISTICS commands after creating the table.

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

### H. Use a stored procedure to create statistics on all columns in a database

SQL Data Warehouse does not have a system stored procedure equivalent to [sp_create_stats][] in SQL Server. This stored procedure creates a single column statistics object on every column of the database that doesn't already have statistics.

This will help you get started with your database design. Feel free to adapt it to your needs.

```sql
CREATE PROCEDURE    [dbo].[prc_sqldw_create_stats]
(   @create_type    tinyint -- 1 default 2 Fullscan 3 Sample
,   @sample_pct     tinyint
)
AS

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
LEFT JOIN	sys.[external_tables] e	ON	e.[object_id]		= t.[object_id]
WHERE       l.[object_id] IS NULL
AND			e.[object_id] IS NULL -- not an external table
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
        THEN    CAST('CREATE STATISTICS '+QUOTENAME('stat_'+table_schema_name+ '_' + table_name + '_'+column_name)+' ON '+QUOTENAME(table_schema_name)+'.'+QUOTENAME(table_name)+'('+QUOTENAME(column_name)+') WITH SAMPLE '+@sample_pct+'PERCENT' AS VARCHAR(8000))
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

To create statistics on all columns in the table with this procedure, simply call the procedure.

```sql
prc_sqldw_create_stats;
```

## Examples: update statistics

To update statistics, you can:

1. Update one statistics object. Specify the name of the statistics object you wish to update.
2. Update all statistics objects on a table. Specify the name of the table instead of one specific statistics object.


### A. Update one specific statistics object ###
Use the following syntax to update a specific statistics object:

```sql
UPDATE STATISTICS [schema_name].[table_name]([stat_name]);
```

For example:

```sql
UPDATE STATISTICS [dbo].[table1] ([stats_col1]);
```

By updating specific statistics objects, you can minimize the time and resources required to manage statistics. This requires some thought, though, to choose the best statistics objects to update.


### B. Update all statistics on a table ###
This shows a simple method for updating all the statistics objects on a table.

```sql
UPDATE STATISTICS [schema_name].[table_name];
```

For example:

```sql
UPDATE STATISTICS dbo.table1;
```

This statement is easy to use. Just remember this updates all statistics on the table, and therefore might perform more work than is necessary. If the performance is not an issue, this is definitely the easiest and most complete way to guarantee statistics are up-to-date.

> [AZURE.NOTE] When updating all statistics on a table, SQL Data Warehouse does a scan to sample the table for each statistics. If the table is large, has many columns, and many statistics, it might be more efficient to update individual statistics based on need.

For an implementation of an `UPDATE STATISTICS` procedure please see the [Temporary Tables][Temporary] article. The implementation method is slightly different to the `CREATE STATISTICS` procedure above but the end result is the same.

For the full syntax, see [Update Statistics][] on MSDN.

## Statistics metadata
There are several system view and functions that you can use to find information about statistics. For example, you can see if a statistics object might be out-of-date by using the stats-date function to see when statistics were last created or updated.

### Catalog views for statistics
These system views provide information about statistics:

| Catalog View | Description |
| :----------- | :---------- |
| [sys.columns][]  | One row for each column. |
| [sys.objects][]  | One row for each object in the database. |  |
| [sys.schemas][]  | One row for each schema in the database. |  |
| [sys.stats][] | One row for each statistics object. |
| [sys.stats_columns][] | One row for each column in the statistics object. Links back to sys.columns. |
| [sys.tables][] | One row for each table (includes external tables). |
| [sys.table_types][] | One row for each data type. |


### System functions for statistics
These system functions are useful for working with statistics:

| System Function | Description |
| :-------------- | :---------- |
| [STATS_DATE][]    | Date the statistics object was last updated. |
| [DBCC SHOW_STATISTICS][] | Provides summary level and detailed information about the distribution of values as understood by the statistics object. |

### Combine statistics columns and functions into one view

This view brings columns that relate to statistics, and results from the [STATS_DATE()][]function together.

```sql
CREATE VIEW dbo.vstats_columns
AS
SELECT
        sm.[name]                           AS [schema_name]
,       tb.[name]                           AS [table_name]
,       st.[name]                           AS [stats_name]
,       st.[filter_definition]              AS [stats_filter_defiinition]
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
JOIN    sys.tables          AS tb ON  co.[object_id]        = tb.[object_id]
JOIN    sys.schemas         AS sm ON  tb.[schema_id]        = sm.[schema_id]
WHERE   1=1
AND     st.[user_created] = 1
;
```

## DBCC SHOW_STATISTICS() examples

DBCC SHOW_STATISTICS() shows the data held within a statistics object. This data comes in three parts.

1. Header
2. Density Vector
3. Histogram

The header metadata about the statistics. The histogram displays the distribution of values in the first key column of the statistics object. The density vector measures cross-column correlation. SQLDW computes cardinality estimates with any of the data in the statistics object.

### Show header, density, and histogram

This simple example shows all three parts of a statistics object.

```sql
DBCC SHOW_STATISTICS([<schema_name>.<table_name>],<stats_name>)
```

For example:

```sql
DBCC SHOW_STATISTICS (dbo.table1, stats_col1);
```

### Show one or more parts of DBCC SHOW_STATISTICS();

If you are only interested in viewing specific parts, use the `WITH` clause and specify which parts you want to see:

```sql
DBCC SHOW_STATISTICS([<schema_name>.<table_name>],<stats_name>) WITH stat_header, histogram, density_vector
```

For example:

```sql
DBCC SHOW_STATISTICS (dbo.table1, stats_col1) WITH histogram, density_vector
```

## DBCC SHOW_STATISTICS() differences
DBCC SHOW_STATISTICS() is more strictly implemented in SQL Data Warehouse compared to SQL Server.

1. Undocumented features are not supported
- Cannot use Stats_stream
- Cannot join results for specific subsets of statistics data e.g. (STAT_HEADER JOIN DENSITY_VECTOR)
2. NO_INFOMSGS cannot be set for message suppression
3. Square brackets around statistics names cannot be used
4. Cannot use column names to identify statistics objects
5. Custom error 2767 is not supported

## Next steps

For more details, see [DBCC SHOW_STATISTICS][] on MSDN.  To learn more, see the articles on [Table Overview][Overview], [Table Data Types][Data Types], [Distributing a Table][Distribute], [Indexing a Table][Index],  [Partitioning a Table][Partition] and [Temporary Tables][Temporary].  For more about best practices, see [SQL Data Warehouse Best Practices][].  

<!--Image references-->

<!--Article references-->
[Overview]: ./sql-data-warehouse-tables-overview.md
[Data Types]: ./sql-data-warehouse-tables-data-types.md
[Distribute]: ./sql-data-warehouse-tables-distribute.md
[Index]: ./sql-data-warehouse-tables-index.md
[Partition]: ./sql-data-warehouse-tables-partition.md
[Statistics]: ./sql-data-warehouse-tables-statistics.md
[Temporary]: ./sql-data-warehouse-tables-temporary.md
[SQL Data Warehouse Best Practices]: ./sql-data-warehouse-best-practices.md

<!--MSDN references-->  
[Cardinality Estimation]: https://msdn.microsoft.com/library/dn600374.aspx
[CREATE STATISTICS]: https://msdn.microsoft.com/library/ms188038.aspx
[DBCC SHOW_STATISTICS]:https://msdn.microsoft.com/library/ms174384.aspx
[Statistics]: https://msdn.microsoft.com/library/ms190397.aspx
[STATS_DATE]: https://msdn.microsoft.com/library/ms190330.aspx
[sys.columns]: https://msdn.microsoft.com/library/ms176106.aspx
[sys.objects]: https://msdn.microsoft.com/library/ms190324.aspx
[sys.schemas]: https://msdn.microsoft.com/library/ms190324.aspx
[sys.stats]: https://msdn.microsoft.com/library/ms177623.aspx
[sys.stats_columns]: https://msdn.microsoft.com/library/ms187340.aspx
[sys.tables]: https://msdn.microsoft.com/library/ms187406.aspx
[sys.table_types]: https://msdn.microsoft.com/library/bb510623.aspx
[UPDATE STATISTICS]: https://msdn.microsoft.com/library/ms187348.aspx

<!--Other Web references-->  
