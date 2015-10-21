<properties
   pageTitle="Get started: Connect to Azure SQL Data Warehouse | Microsoft Azure"
   description="Get started with connecting to SQL Data Warehouse and running some queries."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="twounder"
   manager=""
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="10/20/2015"
   ms.author="twounder"/>

# Connect and query with SQLCMD

> [AZURE.SELECTOR]
- [Visual Studio](sql-data-warehouse-get-started-connect-query.md)
- [SQLCMD](sql-data-warehouse-get-started-connect-query-sqlcmd.md)

This walkthrough shows you how to connect and query an Azure SQL Data Warehouse database in just a few minutes by using the sqlcmd.exe utility. In this walkthrough, you will:

+ Install prerequisite software
+ Connect to a database that contains the AdventureWorksDW sample database
+ Execute a query against the sample database  

## Prerequisites

+ [sqlcmd.exe](https://msdn.microsoft.com/library/azure/ms162773.aspx) - To download sqlcmd.exe, please see the [Microsoft Command Line Utilities 11 for SQL Server](http://go.microsoft.com/fwlink/?LinkId=321501).

## Get your fully qualified Azure SQL server name

To connect to your database you need the full name  of the server (***servername**.database.windows.net*) that contains the database you want to connect to.

1. Go to the [Azure preview portal](https://portal.azure.com).
2. Browse to the database you want to connect to.
3. Locate the full server name (we'll use this in the steps below):

![][1]


## Connect to SQL Data Warehouse with sqlcmd

To connect to a specific instance of SQL Data Warehouse when using sqlcmd you will need to open the command prompt and enter **sqlcmd** followed by the connection string for your SQL Data Warehouse database. The connection string will need to contain the following parameters:

+ **User (-U):** Server user in the form `<`User`>`
+ **Password (-P):** Password associated with the user.
+ **Server (-S):** Server in the form `<`Server Name`>`.database.windows.net
+ **Database (-D):** Database name.
+ **Enable Quoted Identifiers (-I):** Quoted identifiers must be enabled in order to connect to a SQL Data Warehouse instance.

Therefore, to connect to a SQL Data Warehouse instance, you would enter the following:

```
C:\>sqlcmd -S <Server Name>.database.windows.net -d <Database> -U <User> -P <Password> -I
```

## Run sample queries

After connection, you can issue any supported Transact-SQL statements against the instance. 

```
C:\>sqlcmd -S <Server Name>.database.windows.net -d <Database> -U <User> -P <Password> -I
1> SELECT COUNT(*) FROM dbo.FactInternetSales;
2> GO
3> QUIT
```

For additional information about sqlcmd refer to the [sqlcmd documentation](https://msdn.microsoft.com/library/azure/ms162773.aspx).


## Next steps

Now that you can connect and query, try [connecting with PowerBI][].

[connecting with PowerBI]: ./sql-data-warehouse-integrate-power-bi.md
 

<!--Image references-->
[1]: ./media/sql-data-warehouse-get-started-connect-query/get-server-name.png
