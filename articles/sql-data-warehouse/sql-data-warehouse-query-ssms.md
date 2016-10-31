<properties
  pageTitle="SQL Data Warehouse Community & News | Microsoft Azure"
  description="Join the Azure SQL Data Warehouse community to build relationships, showcase your work, and sharpen your skills."
  services="sql-data-warehouse"
  documentationCenter=""
  authors="hirokib"
  manager="johnmac"
  editor="barbkess"/>

<tags
  ms.service="sql-data-warehouse"
  ms.devlang="na"
  ms.topic="article"
  ms.tgt_pltfrm="na"
  ms.workload="data-services"
  ms.date="09/30/2016"
  ms.author="elbutter"/>

# Query Azure SQL Data Warehouse (SQL Server Management Studio)

> [AZURE.SELECTOR]
- [Power BI](sql-data-warehouse-get-started-visualize-with-power-bi.md)
- [Azure Machine Learning](sql-data-warehouse-get-started-analyze-with-azure-machine-learning.md)
- [Visual Studio](sql-data-warehouse-query-visual-studio.md)
- [sqlcmd](sql-data-warehouse-get-started-connect-sqlcmd.md) 
- [SSMS](sql-data-warehouse-query-ssms.md)

Use SQL Server Management Studio (SSMS) to query Azure SQL Data Warehouse in just a few minutes. 

## Prerequisites

To use this tutorial, you need:

+ An existing SQL data warehouse. To create one, see [Create a SQL Data Warehouse][].
+ SQL Server Management Studio (SSMS) installed. [Install SSMS][] for free if you don't already have it.
+ The fully qualified SQL server name. To find this, see [Connect to SQL Data Warehouse][].

## 1. Connect to your SQL Data Warehouse

1. Open SSMS.
2. Open Object Explorer. To do this, select **File** > **Connect Object Explorer**.

    ![SQL Server Object Explorer][1]

3. Fill in the fields in the Connect to Server window.

    ![Connect to Server][2]

    - **Server name**. Enter the **server name** previously identified.
    - **Authentication**. Select **SQL Server Authentication** or **Active Directory Integrated Authentication**.
    - **User Name** and **Password**. Enter user name and password if SQL Server Authentication was selected above.
    - Click **Connect**.

4. To explore, expand your Azure SQL server. You can view the databases associated with the server. Expand AdventureWorksDW to see the tables in your sample database.

    ![Explore AdventureWorksDW][3]

## 2. Run a sample query

Now that a connection has been established to your database, let's write a query.

1. Right-click your database in SQL Server Object Explorer.

2. Select **New Query**. A new query window opens.

    ![New query][4]

3. Copy this TSQL query into the query window:

    ```sql
    SELECT COUNT(*) FROM dbo.FactInternetSales;
    ```

4. Run the query. To do this, click `Execute` or use the following shortcut: `F5`.

    ![Run query][5]


5. Look at the query results. In this example, the FactInternetSales table has 60398 rows.

    ![Query results][6]

## Next steps

Now that you can connect and query, try [visualizing the data with PowerBI][].

To configure your environment for Azure Active Directory authentication, see [Authenticate to SQL Data Warehouse][].

<!--Arcticles-->
[Connect to SQL Data Warehouse]: sql-data-warehouse-connect-overview.md
[Create a SQL Data Warehouse]: sql-data-warehouse-get-started-provision.md
[Authenticate to SQL Data Warehouse]: sql-data-warehouse-authentication.md
[visualizing the data with PowerBI]: sql-data-warehouse-get-started-visualize-with-power-bi.md 

<!--Other-->
[Azure portal]: https://portal.azure.com
[Install SSMS]: https://msdn.microsoft.com/en-US/library/hh213248.aspx


<!--Image references-->

[1]: media/sql-data-warehouse-query-ssms/connect-object-explorer.png
[2]: media/sql-data-warehouse-query-ssms/connect-object-explorer1.png
[3]: media/sql-data-warehouse-query-ssms/explore-tables.png
[4]: media/sql-data-warehouse-query-ssms/new-query.png
[5]: media/sql-data-warehouse-query-ssms/execute-query.png
[6]: media/sql-data-warehouse-query-ssms/results.png
