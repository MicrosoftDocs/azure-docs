<properties
   pageTitle="Connect to SQL Data Warehouse with Visual Studio | Microsoft Azure"
   description="Get started with connecting to SQL Data Warehouse and running some queries."
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
   ms.date="05/13/2016"
   ms.author="sonyama;barbkess"/>

# Connect to SQL Data Warehouse with Visual Studio

> [AZURE.SELECTOR]
- [Visual Studio](sql-data-warehouse-get-started-connect.md)
- [SQLCMD](sql-data-warehouse-get-started-connect-sqlcmd.md)

This walkthrough shows you how to get connected to an Azure SQL Data Warehouse in just a few minutes by using the SQL Server Data Tools (SSDT) extention in Visual Studio. Once connected, you will run a simple query.

## Prerequisites

+ AdventureWorksDW sample data in SQL Data Warehouse. To create this, see [Create a SQL Data Warehouse][].
+ SQL Server Data Tools for Visual Studio. For installation instructions and options, see [Installing Visual Studio and SSDT][].

## Step 1: Find the fully qualified Azure SQL server name

Your SQL Data Warehouse database is associated with an Azure SQL Server. To connect to your database you need the fully qualified name of the server (**servername**.database.windows.net*).

To find the fully qualified server name.

1. Go to the [Azure portal][].
2. Click **SQL databases** and click the database you want to connect to. This example uses the AdventureWorksDW sample database.
3. Locate the full server name.

    ![Full server name][1]

## Step 2: Connect to your SQL Data Warehouse

1. Open Visual Studio 2013 or 2015.
2. Open SQL Server Object Explorer. To do this, select **View** > **SQL Server Object Explorer**.

    ![SQL Server Object Explorer][2]

3. Click the **Add SQL Server** icon.

    ![Add SQL Server][3]

4. Fill in the fields in the Connect to Server window.

    ![Connect to Server][4]

    - **Server name**. Enter the *server name* previously identified.
    - **Authentication**. Select SQL Server Authentication.
    - **User Name** and **Password**. Enter user name and password for the Azure SQL server.
    - Click **Connect**.

5. To explore, expand your Azure SQL server. You can view the databases associated with the server. Expand AdventureWorksDW to see the tables in your sample database.

    ![Explore AdventureWorksDW][5]

## Step 3: Run a sample query

Now that a connection has been established to your database, let's write a query.

1. Right-click your database in SQL Server Object Explorer.

2. Select **New Query**. A new query window opens.

    ![New query][6]

3. Copy this TSQL query into the query window:

    ```sql
    SELECT COUNT(*) FROM dbo.FactInternetSales;
    ```

4. Run the query. To do this, click the green arrow or use the following shortcut: `CTRL`+`SHIFT`+`E`.

    ![Run query][7]

5. Look at the query results. In this example, the FactInternetSales table has 60398 rows.

    ![Query results][8]

## Next steps

Now that you can connect and query, try [visualizing the data with PowerBI][].

To configure your environment for Windows authentication, see [Connecting to SQL Database or SQL Data Warehouse By Using Azure Active Directory Authentication][].

<!--Arcticles-->
[Create a SQL Data Warehouse]: sql-data-warehouse-get-started-provision.md
[Installing Visual Studio and SSDT]: sql-data-warehouse-install-visual-studio.md
[Connecting to SQL Database or SQL Data Warehouse By Using Azure Active Directory Authentication]: ../sql-database/sql-database-aad-authentication.md
[visualizing the data with PowerBI]: ./sql-data-warehouse-get-started-visualize-with-power-bi.md  

<!--Other-->
[Azure portal]: https://portal.azure.com

<!--Image references-->

[1]: ./media/sql-data-warehouse-get-started-connect/get-server-name.png
[2]: ./media/sql-data-warehouse-get-started-connect/open-ssdt.png
[3]: ./media/sql-data-warehouse-get-started-connect/add-server.png
[4]: ./media/sql-data-warehouse-get-started-connect/connection-dialog.png
[5]: ./media/sql-data-warehouse-get-started-connect/explore-sample.png
[6]: ./media/sql-data-warehouse-get-started-connect/new-query2.png
[7]: ./media/sql-data-warehouse-get-started-connect/run-query.png
[8]: ./media/sql-data-warehouse-get-started-connect/query-results.png
