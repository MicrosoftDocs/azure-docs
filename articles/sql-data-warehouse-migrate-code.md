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

- ANSI JOINS on updates
- ANSI JOINs on deletes
- Merge statement
- Cross database joins
- Pivot and unpivot statements
- Intersect and except statement
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
- Nesting levels beyond 8
- Updating through views
- Using select for variable assignment
- No MAX data type for dynamic SQL strings

Happily most of these limitations can be worked around. Explanations have been included in the relevant development articles.


## Next steps
For more development tips, see [SQL Data Warehouse development overview][].

<!--Image references-->

<!--Article references-->
[SQL Data Warehouse development overview]:  ./sql-data-warehouse-overview-develop/

<!--MSDN references-->

<!--Other Web references-->