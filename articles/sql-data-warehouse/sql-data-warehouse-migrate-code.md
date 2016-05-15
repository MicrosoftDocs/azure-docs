<properties
   pageTitle="Migrate your SQL code to SQL Data Warehouse | Microsoft Azure"
   description="Tips for migrating your SQL code to Azure SQL Data Warehouse for developing solutions."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="lodipalm"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="05/14/2016"
   ms.author="jrj;barbkess;sonyama"/>

# Migrate your SQL code to SQL Data Warehouse

When migrating your code from another database to SQL Data Warehouse, you will most likely need to make changes to your code base. Some SQL Data Warehouse features can significantly improve performance as they are designed to work in a distributed fashion. However, to maintain performance and scale, some features are also not available.

## Transact-SQL code changes

The following list summarizes the most common feature which are not supported in Azure SQL Data Warehouse. The links take you to workarounds for the unsupported feature:

- [ANSI joins on updates][]
- [ANSI joins on deletes][]
- [merge statement][]
- cross-database joins
- [cursors][]
- [SELECT..INTO][]
- [INSERT..EXEC][]
- output clause
- inline user-defined functions
- multi-statement functions
- [common table expressions](#Common-table-expressions)
- [recursive common table expressions (CTE)](#Recursive-common-table-expressions-(CTE)
- CLR functions and procedures
- $partition function
- table variables
- table value parameters
- distributed transactions
- commit / rollback work
- save transaction
- execution contexts (EXECUTE AS)
- [group by clause with rollup / cube / grouping sets options][]
- [nesting levels beyond 8][]
- [updating through views][]
- [use of select for variable assignment][]
- [no MAX data type for dynamic SQL strings][]

Fortunately most of these limitations can be worked around. Explanations are provided in the relevant development articles referenced above.

### Common table expressions
The current implementation of common table expressions (CTEs) within SQL Data Warehouse has the following funcationality and limitations:

**CTE Functionality**

- A CTE can be specified in a SELECT statement.
- A CTE can be specified in a CREATE VIEW statement.
- A CTE can be specified in a CREATE TABLE AS SELECT (CTAS) statement.
- A CTE can be specified in a CREATE REMOTE TABLE AS SELECT (CRTAS) statement.
- A CTE can be specified in a CREATE EXTERNAL TABLE AS SELECT (CETAS) statement.
- A remote table can be referenced from a CTE.
- An external table can be referenced from a CTE.
- Multiple CTE query definitions can be defined in a CTE.

**CTE Limitations**

- A CTE must be followed by a single SELECT statement. INSERT, UPDATE, DELETE, and MERGE statements are not supported.
- A common table expression that includes references to itself (a recursive common table expression) is not supported (see below section).
- Specifying more than one WITH clause in a CTE is not allowed. For example, if a CTE_query_definition contains a subquery, that subquery cannot contain a nested WITH clause that defines another CTE.
- An ORDER BY clause cannot be used in the CTE_query_definition, except when a TOP clause is specified.
- When a CTE is used in a statement that is part of a batch, the statement before it must be followed by a semicolon.
- When used in statements prepared by sp_prepare, CTEs will behave the same way as other SELECT statements in PDW. However, if CTEs are used as part of CETAS prepared by sp_prepare, the behavior can defer from SQL Server and other PDW statements because of the way binding is implemented for sp_prepare. If SELECT that references CTE is using a wrong column that does not exist in CTE, the sp_prepare will pass without detecting the error, but the error will be thrown during sp_execute instead.

### Recursive common table expressions (CTE)

This is a complex migration scenario, and the best process is for the CTE to be broken down and handled in steps. You can typically use a loop and populate a temporary table as you iterate over the recursive interim queries. Once the temporary table is populated you can then return the data as a single result set. A similar approach has been used to solve `GROUP BY WITH CUBE` in the [group by clause with rollup / cube / grouping sets options][] article.

### System functions

There are also some system functions that are not supported. Some of the main ones you might typically find used in data warehousing are:

- NEWSEQUENTIALID()
- @@NESTLEVEL()
- @@IDENTITY()
- @@ROWCOUNT()
- ROWCOUNT_BIG
- ERROR_LINE()

Again many of these issues can be worked around.

For example the code below is an alternative solution for retrieving @@ROWCOUNT information:

```sql
SELECT  SUM(row_count) AS row_count
FROM    sys.dm_pdw_sql_requests
WHERE   row_count <> -1
AND     request_id IN
                    (   SELECT TOP 1    request_id
                        FROM            sys.dm_pdw_exec_requests
                        WHERE           session_id = SESSION_ID()
                        ORDER BY end_time DESC
                    )
;
```

## Next steps
For advice on developing your code please refer to the [development overview][].

<!--Image references-->

<!--Article references-->
[ANSI joins on updates]: sql-data-warehouse-develop-ctas.md
[ANSI joins on deletes]: sql-data-warehouse-develop-ctas.md
[merge statement]: sql-data-warehouse-develop-ctas.md
[INSERT..EXEC]: sql-data-warehouse-develop-temporary-tables.md

[cursors]: sql-data-warehouse-develop-loops.md
[SELECT..INTO]: sql-data-warehouse-develop-ctas.md
[group by clause with rollup / cube / grouping sets options]: sql-data-warehouse-develop-group-by-options.md
[nesting levels beyond 8]: sql-data-warehouse-develop-transactions.md
[updating through views]: sql-data-warehouse-develop-views.md
[use of select for variable assignment]: sql-data-warehouse-develop-variable-assignment.md
[no MAX data type for dynamic SQL strings]: sql-data-warehouse-develop-dynamic-sql.md
[development overview]: sql-data-warehouse-overview-develop.md

<!--MSDN references-->

<!--Other Web references-->
