---
title: Migrate your SQL code to SQL Data Warehouse | Microsoft Docs
description: Tips for migrating your SQL code to Azure SQL Data Warehouse for developing solutions.
services: sql-data-warehouse
author: jrowlandjones
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: implement
ms.date: 04/17/2018
ms.author: jrj
ms.reviewer: igorstan
---

# Migrate your SQL code to SQL Data Warehouse
This article explains code changes you will probably need to make when migrating your code from another database to SQL Data Warehouse. Some SQL Data Warehouse features can significantly improve performance as they are designed to work in a distributed fashion. However, to maintain performance and scale, some features are also not available.

## Common T-SQL Limitations
The following list summarizes the most common features that SQL Data Warehouse does not support. The links take you to workarounds for the unsupported features:

* [ANSI joins on updates][ANSI joins on updates]
* [ANSI joins on deletes][ANSI joins on deletes]
* [merge statement][merge statement]
* cross-database joins
* [cursors][cursors]
* [INSERT..EXEC][INSERT..EXEC]
* output clause
* inline user-defined functions
* multi-statement functions
* [common table expressions](#Common-table-expressions)
* [recursive common table expressions (CTE)](#Recursive-common-table-expressions-(CTE)
* CLR functions and procedures
* $partition function
* table variables
* table value parameters
* distributed transactions
* commit / rollback work
* save transaction
* execution contexts (EXECUTE AS)
* [group by clause with rollup / cube / grouping sets options][group by clause with rollup / cube / grouping sets options]
* [nesting levels beyond 8][nesting levels beyond 8]
* [updating through views][updating through views]
* [use of select for variable assignment][use of select for variable assignment]
* [no MAX data type for dynamic SQL strings][no MAX data type for dynamic SQL strings]

Fortunately most of these limitations can be worked around. Explanations are provided in the relevant development articles referenced above.

## Supported CTE features
Common table expressions (CTEs) are partially supported in SQL Data Warehouse.  The following CTE features are currently supported:

* A CTE can be specified in a SELECT statement.
* A CTE can be specified in a CREATE VIEW statement.
* A CTE can be specified in a CREATE TABLE AS SELECT (CTAS) statement.
* A CTE can be specified in a CREATE REMOTE TABLE AS SELECT (CRTAS) statement.
* A CTE can be specified in a CREATE EXTERNAL TABLE AS SELECT (CETAS) statement.
* A remote table can be referenced from a CTE.
* An external table can be referenced from a CTE.
* Multiple CTE query definitions can be defined in a CTE.

## CTE Limitations
Common table expressions have some limitations in SQL Data Warehouse including:

* A CTE must be followed by a single SELECT statement. INSERT, UPDATE, DELETE, and MERGE statements are not supported.
* A common table expression that includes references to itself (a recursive common table expression) is not supported (see below section).
* Specifying more than one WITH clause in a CTE is not allowed. For example, if a CTE_query_definition contains a subquery, that subquery cannot contain a nested WITH clause that defines another CTE.
* An ORDER BY clause cannot be used in the CTE_query_definition, except when a TOP clause is specified.
* When a CTE is used in a statement that is part of a batch, the statement before it must be followed by a semicolon.
* When used in statements prepared by sp_prepare, CTEs will behave the same way as other SELECT statements in PDW. However, if CTEs are used as part of CETAS prepared by sp_prepare, the behavior can defer from SQL Server and other PDW statements because of the way binding is implemented for sp_prepare. If SELECT that references CTE is using a wrong column that does not exist in CTE, the sp_prepare will pass without detecting the error, but the error will be thrown during sp_execute instead.

## Recursive CTEs
Recursive CTEs are not supported in SQL Data Warehouse.  The migration of recursive CTE can be somewhat complex and the best process is to break it into multiple steps. You can typically use a loop and populate a temporary table as you iterate over the recursive interim queries. Once the temporary table is populated you can then return the data as a single result set. A similar approach has been used to solve `GROUP BY WITH CUBE` in the [group by clause with rollup / cube / grouping sets options][group by clause with rollup / cube / grouping sets options] article.

## Unsupported system functions
There are also some system functions that are not supported. Some of the main ones you might typically find used in data warehousing are:

* NEWSEQUENTIALID()
* @@NESTLEVEL()
* @@IDENTITY()
* @@ROWCOUNT()
* ROWCOUNT_BIG
* ERROR_LINE()

Some of these issues can be worked around.

## @@ROWCOUNT workaround
To work around lack of support for @@ROWCOUNT, create a stored procedure that will retrieve the last row count from sys.dm_pdw_request_steps and then execute `EXEC LastRowCount` after a DML statement.

```sql
CREATE PROCEDURE LastRowCount AS
WITH LastRequest as 
(   SELECT TOP 1    request_id
    FROM            sys.dm_pdw_exec_requests
    WHERE           session_id = SESSION_ID()
    AND             resource_class IS NOT NULL
    ORDER BY end_time DESC
),
LastRequestRowCounts as
(
    SELECT  step_index, row_count
    FROM    sys.dm_pdw_request_steps
    WHERE   row_count >= 0
    AND     request_id IN (SELECT request_id from LastRequest)
)
SELECT TOP 1 row_count FROM LastRequestRowCounts ORDER BY step_index DESC
;
```

## Next steps
For a complete list of all supported T-SQL statements, see [Transact-SQL topics][Transact-SQL topics].

<!--Image references-->

<!--Article references-->
[ANSI joins on updates]: ./sql-data-warehouse-develop-ctas.md#ansi-join-replacement-for-update-statements
[ANSI joins on deletes]: ./sql-data-warehouse-develop-ctas.md#ansi-join-replacement-for-delete-statements
[merge statement]: ./sql-data-warehouse-develop-ctas.md#replace-merge-statements
[INSERT..EXEC]: ./sql-data-warehouse-tables-temporary.md#modularizing-code
[Transact-SQL topics]: ./sql-data-warehouse-reference-tsql-statements.md

[cursors]: ./sql-data-warehouse-develop-loops.md
[group by clause with rollup / cube / grouping sets options]: ./sql-data-warehouse-develop-group-by-options.md
[nesting levels beyond 8]: ./sql-data-warehouse-develop-transactions.md
[updating through views]: ./sql-data-warehouse-develop-views.md
[use of select for variable assignment]: ./sql-data-warehouse-develop-variable-assignment.md
[no MAX data type for dynamic SQL strings]: ./sql-data-warehouse-develop-dynamic-sql.md

<!--MSDN references-->

<!--Other Web references-->
