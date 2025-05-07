---
title: Temporary tables
description: Essential guidance for using temporary tables in dedicated SQL pool, highlighting the principles of session level temporary tables.
author: ajagadish-24
ms.author: ajagadish
ms.date: 11/02/2021
ms.service: azure-synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
---

# Temporary tables in dedicated SQL pool in Azure Synapse Analytics

This article contains essential guidance for using temporary tables and highlights the principles of session level temporary tables. 

Using the information in this article can help you modularize your code, improving both reusability and ease of maintenance.

## What are temporary tables?

Temporary tables are useful when processing data, especially during transformation where the intermediate results are transient. In dedicated SQL pool, temporary tables exist at the session level.  

Temporary tables are only visible to the session in which they were created and are automatically dropped when that session closes.  

Temporary tables offer a performance benefit because their results are written to local rather than remote storage.

## Temporary tables in dedicated SQL pool

In the dedicated SQL pool resource, temporary tables offer a performance benefit because their results are written to local rather than remote storage.

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

## Drop temporary tables
When a new session is created, no temporary tables should exist.  

If you're calling the same stored procedure, which creates a temporary with the same name, to ensure that your `CREATE TABLE` statements are successful, a simple pre-existence check with a `DROP` can be used as in the following example:

```sql
IF OBJECT_ID('tempdb..#stats_ddl') IS NOT NULL
BEGIN
    DROP TABLE #stats_ddl
END
```

For coding consistency, it's a good practice to use this pattern for both tables and temporary tables.  It's also a good idea to use `DROP TABLE` to remove temporary tables when you've finished with them in your code.  

In stored procedure development, it's common to see the drop commands bundled together at the end of a procedure to ensure these objects are cleaned up.

```sql
DROP TABLE #stats_ddl
```

## Modularize code
Since temporary tables can be seen anywhere in a user session, this capability can be leveraged to help you modularize your application code.  

For example, the following stored procedure generates DDL to update all statistics in the database by statistic name:

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
FROM    #stats_ddl
;
GO
```

At this stage, the only action that has occurred is the creation of a stored procedure that generates a temporary table, `#stats_ddl`, with DDL statements.  

This stored procedure drops an existing `#stats_ddl` to ensure it doesn't fail if run more than once within a session.  

However, since there is no `DROP TABLE` at the end of the stored procedure, when the stored procedure completes, it leaves the created table so that it can be read outside of the stored procedure.  

In dedicated SQL pool, unlike other SQL Server databases, it's possible to use the temporary table outside of the procedure that created it.  Dedicated SQL pool temporary tables can be used **anywhere** inside the session. This feature can lead to more modular and manageable code as in the following example:

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

## Temporary table limitations
Dedicated SQL pool does impose a couple of limitations when implementing temporary tables.  Currently, only session scoped temporary tables are supported.  Global Temporary Tables aren't supported.  

Also, views can't be created on temporary tables.  Temporary tables can only be created with hash or round robin distribution.  Replicated temporary table distribution isn't supported. 

## Next steps

To learn more about developing tables, see the [Designing tables using dedicated SQL pool](sql-data-warehouse-tables-overview.md) article.

