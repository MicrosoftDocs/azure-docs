---
title: Use temporary tables with Synapse SQL
description: Essential guidance for using temporary tables in Synapse SQL. 
services: synapse-analytics
author: XiaoyuMSFT
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice:
ms.date: 04/15/2020
ms.author: xiaoyul
ms.reviewer: igorstan
---

# Temporary tables in Synapse SQL

This article contains essential guidance for using temporary tables and highlights the principles of session level temporary tables within Synapse SQL. 

Both the SQL pool and SQL on-demand (preview) resources can utilize temporary tables. SQL on-demand has limitations that are discussed at the end of this article. 

## What are temporary tables?

Temporary tables are useful when processing data, especially during transformation where the intermediate results are transient. With Synapse SQL, temporary tables exist at the session level.  They're only visible to the session in which they were created. As such, they're automatically dropped when that session logs off. 

## Temporary tables in SQL pool

In the SQL pool resource, temporary tables offer a performance benefit because their results are written to local rather than remote storage.

### Create a temporary table

Temporary tables are created by prefixing your table name with a `#`.  For example:

```sql
CREATE TABLE #stats_ddl
(
    [schema_name]        NVARCHAR(128) NOT NULL
,    [table_name]            NVARCHAR(128) NOT NULL
,    [stats_name]            NVARCHAR(128) NOT NULL
,    [stats_is_filtered]     BIT           NOT NULL
,    [seq_nmbr]              BIGINT        NOT NULL
,    [two_part_name]         NVARCHAR(260) NOT NULL
,    [three_part_name]       NVARCHAR(400) NOT NULL
)
WITH
(
    DISTRIBUTION = HASH([seq_nmbr])
,    HEAP
)
```

Temporary tables can also be created with a `CTAS` using exactly the same approach:

```sql
CREATE TABLE #stats_ddl
WITH
(
    DISTRIBUTION = HASH([seq_nmbr])
,    HEAP
)
AS
(
SELECT
        sm.[name]                                                                AS [schema_name]
,        tb.[name]                                                                AS [table_name]
,        st.[name]                                                                AS [stats_name]
,        st.[has_filter]                                                            AS [stats_is_filtered]
,       ROW_NUMBER()
        OVER(ORDER BY (SELECT NULL))                                            AS [seq_nmbr]
,                                 QUOTENAME(sm.[name])+'.'+QUOTENAME(tb.[name])  AS [two_part_name]
,        QUOTENAME(DB_NAME())+'.'+QUOTENAME(sm.[name])+'.'+QUOTENAME(tb.[name])  AS [three_part_name]
FROM    sys.objects            AS ob
JOIN    sys.stats            AS st    ON    ob.[object_id]        = st.[object_id]
JOIN    sys.stats_columns    AS sc    ON    st.[stats_id]        = sc.[stats_id]
                                    AND st.[object_id]        = sc.[object_id]
JOIN    sys.columns            AS co    ON    sc.[column_id]        = co.[column_id]
                                    AND    sc.[object_id]        = co.[object_id]
JOIN    sys.tables            AS tb    ON    co.[object_id]        = tb.[object_id]
JOIN    sys.schemas            AS sm    ON    tb.[schema_id]        = sm.[schema_id]
WHERE    1=1
AND        st.[user_created]   = 1
GROUP BY
        sm.[name]
,        tb.[name]
,        st.[name]
,        st.[filter_definition]
,        st.[has_filter]
)
;
```

> [!NOTE]
> `CTAS` is a powerful command and has the added advantage of being efficient in its use of transaction log space. 
> 
> 

### Dropping temporary tables
When a new session is created, no temporary tables should exist.  However, if you're calling the same stored procedure that creates a temporary with the same name, to ensure that your `CREATE TABLE` statements are successful, use a simple pre-existence check with  `DROP`: 

```sql
IF OBJECT_ID('tempdb..#stats_ddl') IS NOT NULL
BEGIN
    DROP TABLE #stats_ddl
END
```

For coding consistency, it's a good practice to use this pattern for both tables and temporary tables.  It's also a good idea to use `DROP TABLE` to remove temporary tables when you're finished with them.  

In stored procedure development, it's common to see the drop commands bundled together at the end of a procedure to ensure these objects are cleaned up.

```sql
DROP TABLE #stats_ddl
```

### Modularizing code
Temporary tables can be used anywhere in a user session. This capability can then be exploited to help you modularize your application code.  To demonstrate, the following stored procedure generates DDL to update all statistics in the database by statistic name:

```sql
CREATE PROCEDURE    [dbo].[prc_sqldw_update_stats]
(   @update_type    tinyint -- 1 default 2 fullscan 3 sample 4 resample
    ,@sample_pct     tinyint
)
AS

IF @update_type NOT IN (1,2,3,4)
BEGIN;
    THROW 151000,'Invalid value for @update_type parameter. Valid range 1 (default), 2 (fullscan), 3 (sample) or 4 (resample).',1;
END;

IF @sample_pct IS NULL
BEGIN;
    SET @sample_pct = 20;
END;

IF OBJECT_ID('tempdb..#stats_ddl') IS NOT NULL
BEGIN
    DROP TABLE #stats_ddl
END

CREATE TABLE #stats_ddl
WITH
(
    DISTRIBUTION = HASH([seq_nmbr])
)
AS
(
SELECT
        sm.[name]                                                                AS [schema_name]
,        tb.[name]                                                                AS [table_name]
,        st.[name]                                                                AS [stats_name]
,        st.[has_filter]                                                            AS [stats_is_filtered]
,       ROW_NUMBER()
        OVER(ORDER BY (SELECT NULL))                                            AS [seq_nmbr]
,                                 QUOTENAME(sm.[name])+'.'+QUOTENAME(tb.[name])  AS [two_part_name]
,        QUOTENAME(DB_NAME())+'.'+QUOTENAME(sm.[name])+'.'+QUOTENAME(tb.[name])  AS [three_part_name]
FROM    sys.objects            AS ob
JOIN    sys.stats            AS st    ON    ob.[object_id]        = st.[object_id]
JOIN    sys.stats_columns    AS sc    ON    st.[stats_id]        = sc.[stats_id]
                                    AND st.[object_id]        = sc.[object_id]
JOIN    sys.columns            AS co    ON    sc.[column_id]        = co.[column_id]
                                    AND    sc.[object_id]        = co.[object_id]
JOIN    sys.tables            AS tb    ON    co.[object_id]        = tb.[object_id]
JOIN    sys.schemas            AS sm    ON    tb.[schema_id]        = sm.[schema_id]
WHERE    1=1
AND        st.[user_created]   = 1
GROUP BY
        sm.[name]
,        tb.[name]
,        st.[name]
,        st.[filter_definition]
,        st.[has_filter]
)
SELECT
    CASE @update_type
    WHEN 1
    THEN 'UPDATE STATISTICS '+[two_part_name]+'('+[stats_name]+');'
    WHEN 2
    THEN 'UPDATE STATISTICS '+[two_part_name]+'('+[stats_name]+') WITH FULLSCAN;'
    WHEN 3
    THEN 'UPDATE STATISTICS '+[two_part_name]+'('+[stats_name]+') WITH SAMPLE '+CAST(@sample_pct AS VARCHAR(20))+' PERCENT;'
    WHEN 4
    THEN 'UPDATE STATISTICS '+[two_part_name]+'('+[stats_name]+') WITH RESAMPLE;'
    END AS [update_stats_ddl]
,   [seq_nmbr]
FROM    t1
;
GO
```

At this stage, the only action that has occurred is the creation of a stored procedure that generates the #stats_ddl temporary table.  The stored procedure drops #stats_ddl if it already exists. This drop ensures it doesn't fail if run more than once within a session.  

Since there isn't a `DROP TABLE` at the end of the stored procedure, when the stored procedure completes, the created table remains and can be read outside of the stored procedure.  

In contrast to other SQL Server databases, Synapse SQL allows you to use the temporary table outside of the procedure that created it.  The temporary tables created via SQL pool can be used **anywhere** inside the session. As a result, you'll have more modular and manageable code, as demonstrated in the sample below:

```sql
EXEC [dbo].[prc_sqldw_update_stats] @update_type = 1, @sample_pct = NULL;

DECLARE @i INT              = 1
,       @t INT              = (SELECT COUNT(*) FROM #stats_ddl)
,       @s NVARCHAR(4000)   = N''

WHILE @i <= @t
BEGIN
    SET @s=(SELECT update_stats_ddl FROM #stats_ddl WHERE seq_nmbr = @i);

    PRINT @s
    EXEC sp_executesql @s
    SET @i+=1;
END

DROP TABLE #stats_ddl;
```

### Temporary table limitations

SQL pool does have a few implementation limitations for temporary tables:

- Only session scoped temporary tables are supported.  Global Temporary Tables aren't supported.
- Views can't be created on temporary tables.
- Temporary tables can only be created with hash or round robin distribution.  Replicated temporary table distribution isn't supported. 

## Temporary tables in SQL on-demand (preview)

Temporary tables in SQL on-demand are supported but their usage is limited. They can't be used in queries which target files. 

For example, you can't join a temporary table with data from files in storage. The number of temporary tables is limited to 100, and their total size is limited to 100MB.

## Next steps

To learn more about developing tables, see the [Designing tables using the Synapse SQL resources](develop-tables-overview.md) article.

