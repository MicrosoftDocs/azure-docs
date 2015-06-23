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
- Cursors
- SELECT..INTO
- INSERT..EXEC
- Output clause
- Recursive common table expressions (CTE)
- Updates through CTEs
- CLR functions and procedures
- $partition function
- Table variables
- Table value parameters
- Group by clause with rollup / cube / grouping sets options
- Triggers
- Nesting levels beyond 8
- Updating through views
- Using select for variable assignment
- [No MAX data type for dynamic SQL strings][]

Happily most of these limitations can be worked around. Explanations have been included in the relevant development articles.


## Next steps
For advice on developing your code please refer to the [SQL Data Warehouse development overview][].

<!--Image references-->

<!--Article references-->
[Pivot and unpivot statements]: ./sql-data-warehouse-develop-pivot-unpivot/
[No MAX data type for dynamic SQL strings]: ./sql-data-warehouse-develop-dynamic-sql/

[SQL Data Warehouse development overview]:  ./sql-data-warehouse-overview-develop/

<!--
[Concurrency]: ./sql-data-warehouse-develop-concurrency/
[Connections]: ./sql-data-warehouse-develop-connections/
[CTAS]: ./sql-data-warehouse-develop-ctas/
[Group by options]: ./sql-data-warehouse-develop-group-by-options/
[Choosing hash distribution keys]: ./sql-data-warehouse-develop-hash-distribution-key/
[Labels]: ./sql-data-warehouse-develop-label/
[Looping]: ./sql-data-warehouse-develop-loops/
[Renaming objects]: ./sql-data-warehouse-develop-rename/
[Statistics]: ./sql-data-warehouse-develop-statistics/
[Stored procedures]: ./sql-data-warehouse-develop-stored-procedures/
[Table design]: ./sql-data-warehouse-develop-table-design/
[Table partitions]: ./sql-data-warehouse-develop-table-partitions/
[Temporary tables]: ./sql-data-warehouse-develop-temporary-tables/
[Transactions]: ./sql-data-warehouse-develop-transactions/
[User Defined Schemas]: ./sql-data-warehouse-develop-user-defined-schemas/
[Variable assignment]: ./sql-data-warehouse-develop-variable-assignment/
[Views]: ./sql-data-warehouse-develop-views/
-->

<!--MSDN references-->

<!--Other Web references-->