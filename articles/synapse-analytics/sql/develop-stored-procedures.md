---
title: Use stored procedures
description: Tips for implementing stored procedures using Synapse SQL in Azure Synapse Analytics for solution development.
author: mstehrani
ms.author: emtehran
ms.reviewer: wiassaf
ms.date: 11/03/2020
ms.service: synapse-analytics
ms.subservice: sql
ms.topic: conceptual
---

# Stored procedures using Synapse SQL in Azure Synapse Analytics

Synapse SQL provisioned and serverless pools enable you to place complex data processing logic into SQL stored procedures. Stored procedures are a great way for encapsulating your SQL code and storing it close to your data in the data warehouse. Stored procedures help developers modularize their solutions by encapsulating the code into manageable units, and facilitating greater reusability of code. Each stored procedure can also accept parameters to make them even more flexible.
In this article you will find some tips for implementing stored procedures in Synapse SQL pool for developing solutions.

## What to expect

Synapse SQL supports many of the T-SQL features that are used in SQL Server. More importantly, there are scale-out specific features that you can use to maximize the performance of your solution. In this article, you will learn about the features that you can place in stored procedures.

> [!NOTE]
> In the procedure body you can use only the features that are supported in Synapse SQL surface area. Review [this article](overview-features.md) to identify objects, statement that can be used in stored procedures. The examples in these articles use generic features that are available both in serverless and dedicated surface area. See additional [limitations in provisioned and serverless Synapse SQL pools](#limitations) at the end of this article.

To maintain the scale and performance of SQL pool, there are also some features and functionality that have behavioral differences and others that aren't supported.

## Stored procedures in Synapse SQL

In the following example, you can see the procedures that drop external objects if they exist in the database:

```sql
CREATE PROCEDURE drop_external_table_if_exists @name SYSNAME
AS BEGIN
    IF (0 <> (SELECT COUNT(*) FROM sys.external_tables WHERE name = @name))
    BEGIN
        DECLARE @drop_stmt NVARCHAR(200) = N'DROP EXTERNAL TABLE ' + @name; 
        EXEC sp_executesql @tsql = @drop_stmt;
    END
END
GO
CREATE PROCEDURE drop_external_file_format_if_exists @name SYSNAME
AS BEGIN
    IF (0 <> (SELECT COUNT(*) FROM sys.external_file_formats WHERE name = @name))
    BEGIN
        DECLARE @drop_stmt NVARCHAR(200) = N'DROP EXTERNAL FILE FORMAT ' + @name; 
        EXEC sp_executesql @tsql = @drop_stmt;
    END
END
GO
CREATE PROCEDURE drop_external_data_source_if_exists @name SYSNAME
AS BEGIN
    IF (0 <> (SELECT COUNT(*) FROM sys.external_data_sources WHERE name = @name))
    BEGIN
        DECLARE @drop_stmt NVARCHAR(200) = N'DROP EXTERNAL DATA SOURCE ' + @name; 
        EXEC sp_executesql @tsql = @drop_stmt;
    END
END
```

These procedures can be executed using `EXEC` statement where you can specify the procedure name and parameters:

```sql
EXEC drop_external_table_if_exists 'mytest';
EXEC drop_external_file_format_if_exists 'mytest';
EXEC drop_external_data_source_if_exists 'mytest';
```

Synapse SQL provides a simplified and streamlined stored procedure implementation. The biggest difference compared to SQL Server is that the stored procedure is not pre-compiled code. In data warehouses, the compilation time is small in comparison to the time it takes to run queries against large data volumes. It is more important to ensure the stored procedure code is correctly optimized for large queries. The goal is to save hours, minutes, and seconds, not milliseconds. It is therefore more helpful to think of stored procedures as containers for SQL logic.

When Synapse SQL executes your stored procedure, the SQL statements are parsed, translated, and optimized at run time. During this process, each statement is converted into distributed queries. The SQL code that is executed against the data is different than the query submitted.

## Encapsulate validation rules

Stored procedures enable you to locate validation logic in a single module stored in SQL database. In the following example, you can see how to validate the values of parameters and change their default values.

```sql
CREATE PROCEDURE count_objects_by_date_created 
                            @start_date DATETIME2,
                            @end_date DATETIME2
AS BEGIN 

    IF( @start_date >= GETUTCDATE() )
    BEGIN
        THROW 51000, 'Invalid argument @start_date. Value should be in past.', 1;  
    END

    IF( @end_date IS NULL )
    BEGIN
        SET @end_date = GETUTCDATE();
    END

    IF( @start_date >= @end_date )
    BEGIN
        THROW 51000, 'Invalid argument @end_date. Value should be greater than @start_date.', 2;  
    END

    SELECT
         year = YEAR(create_date),
         month = MONTH(create_date),
         objects_created = COUNT(*)
    FROM
        sys.objects
    WHERE
        create_date BETWEEN @start_date AND @end_date
    GROUP BY
        YEAR(create_date), MONTH(create_date);
END
```

The logic in the sql procedure will validate the input parameters when the procedure is called.

```sql

EXEC count_objects_by_date_created '2020-08-01', '2020-09-01'

EXEC count_objects_by_date_created '2020-08-01', NULL

EXEC count_objects_by_date_created '2020-09-01', '2020-08-01'
-- Error
-- Invalid argument @end_date. Value should be greater than @start_date.

EXEC count_objects_by_date_created '2120-09-01', NULL
-- Error
-- Invalid argument @start_date. Value should be in past.
```

## Nesting stored procedures

When stored procedures call other stored procedures, or execute dynamic SQL, then the inner stored procedure or code invocation is said to be nested.
An example of nested procedure is shown in the following code:

```sql
CREATE PROCEDURE clean_up @name SYSNAME
AS BEGIN
    EXEC drop_external_table_if_exists @name;
    EXEC drop_external_file_format_if_exists @name;
    EXEC drop_external_data_source_if_exists @name;
END
```

This procedure accepts a parameter that represents some name and then calls other procedures to drop the objects with this name.
Synapse SQL pool supports a maximum of eight nesting levels. This capability is slightly different than SQL Server. The nest level in SQL Server is 32.

The top-level stored procedure call equates to nest level 1.

```sql
EXEC clean_up 'mytest'
```

If the stored procedure also makes another EXEC call, the nest level increases to two.

```sql
CREATE PROCEDURE clean_up @name SYSNAME
AS
    EXEC drop_external_table_if_exists @name  -- This call is nest level 2
GO
EXEC clean_up 'mytest'  -- This call is nest level 1
```

If the second procedure then executes some dynamic SQL, the nest level increases to three.

```sql
CREATE PROCEDURE drop_external_table_if_exists @name SYSNAME
AS BEGIN
    /* See full code in the previous example */
    EXEC sp_executesql @tsql = @drop_stmt;  -- This call is nest level 3
END
GO
CREATE PROCEDURE clean_up @name SYSNAME
AS
    EXEC drop_external_table_if_exists @name  -- This call is nest level 2
GO
EXEC clean_up 'mytest'  -- This call is nest level 1
```

> [!NOTE]
> Synapse SQL does not currently support [@@NESTLEVEL](/sql/t-sql/functions/nestlevel-transact-sql?view=azure-sqldw-latest&preserve-view=true). You need to track the nest level. It is unlikely for you to exceed the eight nest level limit, but if you do, you need to rework your code to fit the nesting levels within this limit.

## INSERT..EXECUTE

Provisioned Synapse SQL pool doesn't permit you to consume the result set of a stored procedure with an INSERT statement. There's an alternative approach you can use. For an example, see the article on [temporary tables](develop-tables-temporary.md) for provisioned Synapse SQL pool.

## Limitations

There are some aspects of Transact-SQL stored procedures that aren't implemented in Synapse SQL, such as:

| Feature/option | Provisioned | Serverless |
| --- | --- |
| Temporary stored procedures | No | Yes |
| Numbered stored procedures | No | No |
| Extended stored procedures | No | No |
| CLR stored procedures | No | No |
| Encryption option | No | Yes |
| Replication option | No | No |
| Table-valued parameters | No | No |
| Read-only parameters | No | No |
| Default parameters | No | Yes |
| Execution contexts | No | No |
| Return statement | No | Yes |
| INSERT INTO .. EXEC | No | Yes |

## Next steps

For more development tips, see [development overview](develop-overview.md).
