<properties
   pageTitle="Query Azure SQL Data Warehouse (sqlcmd)| Microsoft Azure"
   description="Querying Azure SQL Data Warehouse with the sqlcmd Command-line Utility."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="sonyam"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="07/22/2016"
   ms.author="mausher;barbkess;sonyama"/>

# Query Azure SQL Data Warehouse (sqlcmd)

> [AZURE.SELECTOR]
- [Power BI](sql-data-warehouse-get-started-visualize-with-power-bi.md)
- [Azure Machine Learning](sql-data-warehouse-get-started-analyze-with-azure-machine-learning.md)
- [Visual Studio](sql-data-warehouse-query-visual-studio.md)
- [sqlcmd](sql-data-warehouse-get-started-connect-sqlcmd.md) 

This walkthrough uses the sqlcmd Command-line Utility to query an Azure SQL Data Warehouse .  

## Prerequisites

To step through this tutorial, you need:

-  [sqlcmd.exe][]. To download this, see [Microsoft Command Line Utilities 11 for SQL Server][] which may also require [Microsoft ODBC Driver 11 for SQL Server Windows][].

## 1. Connect

To get started with sqlcmd, open the command prompt and enter **sqlcmd** followed by the connection string for your SQL Data Warehouse database. The connection string will need following required parameters:

+ **Server (-S):** Server in the form `<`Server Name`>`.database.windows.net
+ **Database (-d):** Database name.
+ **User (-U):** Server user in the form `<`User`>`
+ **Password (-P):** Password associated with the user.
+ **Enable Quoted Identifiers (-I):** Quoted identifiers must be enabled in order to connect to a SQL Data Warehouse instance.

For example, your connection string might look like the following:

```sql
C:\>sqlcmd -S MySqlDw.database.windows.net -d Adventure_Works -U myuser -P myP@ssword -I
```

> [AZURE.NOTE] The -I option which enables quoted identfiers, is currently required to connect to SQL Data Warehouse.

## 2. Query

After connection, you can issue any supported Transact-SQL statements against the instance.  In this example, queries are submitted in interactive mode.

```sql
C:\>sqlcmd -S MySqlDw.database.windows.net -d Adventure_Works -U myuser -P myP@ssword -I
1> SELECT name FROM sys.tables;
2> GO
3> QUIT
```

These next examples show how you can run your queries in batch mode using the -Q option or piping your SQL to sqlcmd.

```sql
C:\>sqlcmd -S MySqlDw.database.windows.net -d Adventure_Works -U myuser -P myP@ssword -I -Q "SELECT name FROM sys.tables;"
```

```sql
C:\>"SELECT name FROM sys.tables;" | sqlcmd -S MySqlDw.database.windows.net -d Adventure_Works -U myuser -P myP@ssword -I > .\tables.out
```

## Next steps

To learn about all of the sqlcmd options, see the [sqlcmd documentation][sqlcmd.exe].

<!--Image references-->

<!--Article references-->

<!--MSDN references--> 
[sqlcmd.exe]: https://msdn.microsoft.com/library/ms162773.aspx
[Microsoft ODBC Driver 11 for SQL Server Windows]: https://www.microsoft.com/download/details.aspx?id=36434
[Microsoft Command Line Utilities 11 for SQL Server]: http://go.microsoft.com/fwlink/?LinkId=321501
[Azure portal]: https://portal.azure.com

<!--Other Web references-->
