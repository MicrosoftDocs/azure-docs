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
   ms.date="10/07/2015"
   ms.author="twounder"/>

> [AZURE.SELECTOR]
- [Visual Studio](sql-data-warehouse-get-started-connect-query.md)
- [SQLCMD](sql-data-warehouse-get-started-connect-query-bcp.md)

# Connect and query with Visual Studio

This walkthrough shows you how to connect and query an Azure SQL Data Warehouse database in just a few minutes by using Visual Studio. In this walkthrough, you will:

+ Install prerequisite software
+ Connect to a database that contains the AdventureWorksDW sample database
+ Execute a query against the sample database  

## Prerequisites##
+ Visual Studio 2013/2015 - To download and install Visual Studio 2015 and/or SSDT, see [Install Visual Studio and SSDT](sql-data-warehouse-install-visual-studio.md)

## Get your fully qualified Azure SQL server name##

To connect to your database you need the full name  of the server (***servername**.database.windows.net*) that contains the database you want to connect to.

1. Go to the [Azure preview portal](https://portal.azure.com).
2. Browse to the database you want to connect to.
3. Locate the full server name (we'll use this in the steps below):

![][1]

## Connect to your SQL Database##

1. Open Visual Studio.
2. Open the **SQL Server Object Explorer** from the View menu
 
![][2]

3. Click the **Add SQL Server** button

![][3]

4. Enter the *server name* we captured above
5. In the **Authentication** list, select **SQL Server Authentication**.
6. Enter the **Login** and **Password** you specified when you created your SQL Database server, and click **Connect**.

## Run sample queries ##

Now that we have registered our server let's go ahead and write a query.

1. Click the user database in SSDT.

2. Click the **New Query** button. A new window opens.

![][4]

3. Type the following code into the query window:

	```
	SELECT COUNT(*) FROM dbo.FactInternetSales;
	```

4. Run the query.

	To run the query click the green arrow or use the following shortcut: `CTRL`+`SHIFT`+`E`.

## Next steps ##
Now that you can connect and query, try [connecting with PowerBI][].

[connecting with PowerBI]: ./sql-data-warehouse-integrate-power-bi.md  


<!--Image references-->

[1]: ./media/sql-data-warehouse-get-started-connect-query/get-server-name.png
[2]: ./media/sql-data-warehouse-get-started-connect-query/open-ssdt.png
[3]: ./media/sql-data-warehouse-get-started-connect-query/connection-dialog.png
[4]: ./media/sql-data-warehouse-get-started-connect-query/new-query.png