<properties
   pageTitle="Migrate your SQL code to SQL Data Warehouse | Microsoft Azure"
   description="Tips for migrating your SQL code to Azure SQL Data Warehouse for developing solutions."
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
   ms.date="06/25/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

# Migrate your SQL code to SQL Data Warehouse

In order to ensure your code is compliant with SQL Data Warehouse it is quite likely that you will need to make changes to your code base. Some SQL Data Warehouse features can also significantly improve performance as they are designed to work directly in a distributed fashion. However, to maintain performance and scale, some features are also not available.

## Transact-SQL code changes

The following list summarizes the main features that are not supported in Azure SQL Data Warehouse. The links provided take you to workarounds for the unsupported feature:

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
- [recursive common table expressions (CTE)](#Recursive-common-table-expressions-(CTE)
- [updates through CTEs](#Updates-through-CTEs)
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

Happily most of these limitations can be worked around. Explanations have been included in the relevant development articles referenced above.

### Recursive common table expressions (CTE)

This is a complex scenario with no quick fix. The CTE will need to be broken down and handled in steps. You can typically use a fairly complex loop; populating a temporary table as you iterate over the recursive interim queries. Once the temporary table is populated you can then return the data as a single result set. A similar approach has been used to solve `GROUP BY WITH CUBE` in the [group by clause with rollup / cube / grouping sets options][] article.

### Updates through CTEs

If the CTE is non-recursive then you can re-write the query to use sub-queries. For recursive CTEs you will need to build up the resultset first as described above; then join the final resultset to the target table and perform the update.

### System functions

There are also some system functions that are not supported. Some of the main ones you might typically find used in data warehousing are:

- NEWID()
- NEWSEQUENTIALID()
- @@NESTLEVEL()
- @@IDENTITY()
- @@ROWCOUNT()
- ROWCOUNT_BIG
- ERROR_LINE()

Again many of these issues can be worked around. 

For example the code below is an alternative solution for retrieving @@ROWCOUNT information:

```
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
