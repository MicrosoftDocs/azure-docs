<properties
   pageTitle="Dynamic SQL in SQL Data Warehouse | Microsoft Azure"
   description="Tips for using dynamic SQL in Azure SQL Data Warehouse for developing solutions."
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
   ms.date="06/26/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

# Dynamic SQL in SQL Data Warehouse
When developing application code for SQL Data Warehouse you may find yourself needing to use dynamic sql to help deliver flexible, generic and modular solutions. However, SQL Data Warehouse does not support blob data types at this time. This may limit the size of your strings as blob types include both varchar(max) and nvarchar(max) types. You may find that you have used these types in your application code when building very large strings of dynamic SQL code you need to execute. 

In these situations you will need to break the code into chunks and use the EXEC statement instead. 

A simplified example is available below:

```
DECLARE @sql_fragment1 VARCHAR(8000)=' SELECT name '
,       @sql_fragment2 VARCHAR(8000)=' FROM sys.system_views '
,       @sql_fragment3 VARCHAR(8000)=' WHERE name like ''%table%''';

EXEC( @sql_fragment1 + @sql_fragment2 + @sql_fragment3);
```

If the string is not particularly long then you can use [sp_executesql][] as normal.


## Next steps
For more development tips, see [development overview][].

<!--Image references-->

<!--Article references-->
[development overview]: sql-data-warehouse-overview-develop.md

<!--MSDN references-->
[sp_executesql]: https://msdn.microsoft.com/en-us/library/ms188001.aspx

<!--Other Web references-->
