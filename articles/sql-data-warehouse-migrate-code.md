<properties
   pageTitle="Migrate your SQL code to SQL Data Warehouse | Microsoft Azure"
   description="Tips for migrating your SQL code to Azure SQL Data Warehouse for developing solutions."
   services="SQL Data Warehouse"
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
- Recursive common table expressions (CTE)
- Updates through CTEs
- CLR functions and procedures
- $partition function
- Table variables
- Table value parameters
- [Group by clause with rollup / cube / grouping sets options][]
- Triggers
- [Nesting levels beyond 8][]
- [Updating through views][]
- [Use of Select for variable assignment][]
- [No MAX data type for dynamic SQL strings][]

Happily most of these limitations can be worked around. Explanations have been included in the relevant development articles that have been referenced above.


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