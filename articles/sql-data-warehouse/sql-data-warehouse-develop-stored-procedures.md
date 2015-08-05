<properties
   pageTitle="Stored procedures in SQL Data Warehouse | Microsoft Azure"
   description="Tips for implementing stored procedures in Azure SQL Data Warehouse for developing solutions."
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

# Stored procedures in SQL Data Warehouse 

SQL Data Warehouse supports many of the Transact-SQL features found in SQL Server. More importantly there are scale out specific features that we will want to leverage to maximize the performance of your solution.

However, to maintain the scale and performance of SQL Data Warehouse there are also some features and functionality that have behavioral differences and others that are not supported.

This article explains how to implement stored procedures within SQL Data Warehouse.

## Introducing stored procedures
Stored procedures are a great way for encapsulating your SQL code; storing it close to your data in the data warehouse. By encapsulating the code into manageable units stored procedures help developers modularize their solutions; facilitating greater re-usability of code. Each stored procedure can also accept parameters to make them even more flexible.

SQL Data Warehouse provides a simplified and streamlined stored procedure implementation. The biggest difference compared to SQL Server is that the stored procedure is not pre-compiled code. In data warehouses we are generally less concerned with the compilation time. It is more important that the stored procedure code is correctly optimised when operating against large data volumes. The goal is to save hours, minutes and seconds not milliseconds. It is therefore more helpful to think of stored procedures as containers for SQL logic.     
 
When SQL Data Warehouse executes your stored procedure the SQL statements are parsed, translated and optimized at run time. During this process each statement is converted into distributed queries. The SQL code that is actually executed against the data is different to the query submitted.

## Nesting stored procedures
When stored procedures call other stored procedures or execute dynamic sql then the inner stored procedure or code invocation is said to be nested.

SQL Data Warehouse support a maximum of 8 nesting levels. This is slightly different to SQL Server. The nest level in SQL Server is 32.

The top level stored procedure call equates to nest level 1

```
EXEC prc_nesting
``` 
If the stored procedure also makes another EXEC call then this will increase the nest level to 2
```
CREATE PROCEDURE prc_nesting
AS
EXEC prc_nesting_2  -- This call is nest level 2
GO
EXEC prc_nesting
```
If the second procedure then executes some dynamic sql then this will increase the nest level to 3
```
CREATE PROCEDURE prc_nesting_2
AS
EXEC sp_executesql 'SELECT 'another nest level'  -- This call is nest level 2
GO
EXEC prc_nesting
```

Note SQL Data Warehouse does not currently support @@NESTLEVEL. You will need to keep a track of your nest level yourself. It is unlikely you will hit the 8 nest level limit but if you do you will need to re-work your code and "flatten" it so that it fits within this limit. 

## INSERT..EXECUTE
SQL Data Warehouse does not permit you to consume the result set of a stored procedure with an INSERT statement. However, there is an alternative approach you can use.

Please refer to the following article on [temporary tables] for an example on how to do this.

## Limitations

There are some aspects of Transact-SQL stored procedures that are not implemented in SQL Data Warehouse.

They are:

- temporary stored procedures
- numbered stored procedures
- extended stored procedures
- CLR stored procedures
- encryption option
- replication option
- table-valued parameters
- read-only parameters
- default parameters
- execution contexts
- return statement

## Next steps
For more development tips, see [development overview][].

<!--Image references-->

<!--Article references-->
[temporary tables]: sql-data-warehouse-develop-temporary-tables.md
[development overview]: sql-data-warehouse-overview-develop.md

<!--MSDN references-->
[nest level]: https://msdn.microsoft.com/en-us/library/ms187371.aspx

<!--Other Web references-->

