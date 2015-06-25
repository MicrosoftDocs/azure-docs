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
   ms.date="06/22/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

# Migrate your SQL code to SQL Data Warehouse

In order to ensure your code is compliant with SQL Data Warehouse it is quite likely that you will need to make changes to your code base. Some SQL Data Warehouse features can also significantly improve performance as they are designed to work directly in a distributed fashion. However, to maintain performance and scale, some features are also not available.

## Transact-SQL code changes

The following list summarizes the main features that are not supported in Azure SQL Data Warehouse:

- ANSI joins on updates
- ANSI joins on deletes
- Merge statement
- Cross database joins
- [Pivot and unpivot statements][]
- [Cursors][]
- [SELECT..INTO][]
- INSERT..EXEC
- Output clause
- Inline user-defined functions
- Multi-statement functions
- Recursive common table expressions (CTE)
- Updates through CTEs
- CLR functions and procedures
- $partition function
- Table variables
- Table value parameters
- Distributed transactions
- Commit / Rollback work
- Save transaction
- Execution contexts (EXECUTE AS)
- [Group by clause with rollup / cube / grouping sets options][]
- [Nesting levels beyond 8][]
- [Updating through views][]
- [Use of Select for variable assignment][]
- [No MAX data type for dynamic SQL strings][]

Happily most of these limitations can be worked around. Explanations have been included in the relevant development articles referenced above.

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
For advice on developing your code please refer to the [SQL Data Warehouse development overview][].

<!--Image references-->

<!--Article references-->
[Pivot and unpivot statements]: ./sql-data-warehouse-develop-pivot-unpivot/
[Cursors]: ./sql-data-warehouse-develop-loops/
[SELECT..INTO]: ./sql-data-warehouse-develop-ctas/
[Group by clause with rollup / cube / grouping sets options]: ./sql-data-warehouse-develop-group-by-options/
[Nesting levels beyond 8]: ./sql-data-warehouse-develop-transactions/
[Updating through views]: ./sql-data-warehouse-develop-views/
[Use of Select for variable assignment]: ./sql-data-warehouse-develop-variable-assignment/
[No MAX data type for dynamic SQL strings]: ./sql-data-warehouse-develop-dynamic-sql/

[SQL Data Warehouse development overview]:  ./sql-data-warehouse-overview-develop/


<!--MSDN references-->

<!--Other Web references-->