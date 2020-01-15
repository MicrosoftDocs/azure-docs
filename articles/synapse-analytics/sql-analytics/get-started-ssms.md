---
title: Connect to SQL Analytics with SQL Server Management Studio (SSMS) | Microsoft Docs
description: Use SQL Server Management Studio (SSMS) to connect to and query SQL Analytics. 
services: synapse analytics
author: azaricstefan 
ms.service: synapse-analytics
ms.topic: overview 
ms.subservice: 
ms.date: 10/21/2019 
ms.author: v-stazar 
ms.reviewer: jrasnick
---

# Connect to SQL analytics with SQL Server Management Studio (SSMS)
> [!div class="op_single_selector"]
> * [Azure Data Studio](get-started-azure-data-studio.md)
> * [Power BI](get-started-power-bi-professional.md)
> * [Visual Studio](../../sql-data-warehouse/sql-data-warehouse-query-visual-studio.md)
> * [sqlcmd](get-started-connect-sqlcmd.md)
> * [SSMS](get-started-ssms.md)
> 
> 

You can use SQL Server Management Studio (SSMS) to connect to and query SQL Analytics through either the SQL on-demand or SQL pool resources. 

## Supported tools for SQL on-demand
Azure Data Studio is a fully supported tool. SSMS is supported partially from version 18.5 and with limited features such as connecting and querying. 

## Prerequisites
Before you begin, make sure you've completed the following prerequisites:  

* Have an existing data warehouse. To create one, see [Create a data warehouse](https://docs.microsoft.com/azure/sql-data-warehouse/create-data-warehouse-portal#create-a-data-warehouse).
* Install SQL Server Management Studio (SSMS). You can [install SSMS][Install SSMS] for free if you don't already have it.
* Have the fully qualified SQL server name. To find this, see [Connect to SQL analytics](connect-overview.md).

## 1. Connect to SQL Analytics


### SQL pool
1. Open SSMS.
2. Open Object Explorer. To do this, select **File** > **Connect Object Explorer**.
   
    ![SQL Server Object Explorer][1a]
3. Fill in the fields in the Connect to Server window.
   
    ![Connect to Server][2a]
   
   * **Server name**: Enter the **server name** previously identified.
   * **Authentication**: Select **SQL Server Authentication** or **Active Directory Integrated Authentication**.
   * **User Name** and **Password**: Enter your user name and password if SQL Server Authentication was selected above.
   * Click **Connect**.
4. To explore, expand your Azure SQL server. You can view the databases associated with the server. Expand AdventureWorksDW to see the tables in your sample database.
   
    ![Explore AdventureWorksDW][3a]

### SQL on-demand
1. Open SSMS.
2. Open the Object Explorer. To do this, select **File** > **Connect Object Explorer**.
   
    ![SQL Server Object Explorer][1]
3. Fill in the fields in the Connect to Server window.
   
    ![Connect to Server][2]
   
   * **Server name**: Enter the **server name** previously identified.
   * **Authentication**: Select **SQL Server Authentication** or **Active Directory Integrated Authentication**:
   * **User Name** and **Password**: Enter your user name and password if SQL Server Authentication was selected above.
   * Click **Connect**.
4. To explore, expand your Azure SQL server. You can view the databases associated with the server. Expand demo to see the content in your sample database.
   
    ![Explore AdventureWorksDW][3]


## 2. Run a sample query

### SQL pool
Now that a connection has been established to your database, you'll write a query.

1. Right-click your database in SQL Server Object Explorer.
2. Select **New Query**. A new query window opens.
   
    ![New query][4a]
3. Copy this T-SQL query into the query window:
   
    ```sql
    SELECT COUNT(*) FROM dbo.FactInternetSales;
    ```
4. Run the query. To do this, click `Execute` or use the following shortcut: `F5`.
   
    ![Run query][5a]
5. Look at the query results. In this example, the FactInternetSales table has 60398 rows.
   
    ![Query results][6a]

### SQL on-demand

Now that a connection has been established to your database, you'll write a query.

1. Right-click your database in SQL Server Object Explorer.
2. Select **New Query**. A new query window opens.
   
    ![New query][4]
3. Copy this T-SQL query into the query window:
   
    ```sql
    SELECT COUNT(*) FROM demo.dbo.usPopulationView
    ```
4. Run the query. To do this, click `Execute` or use the following shortcut: `F5`.
   
    ![Run query][5]
5. Look at the query results. In this example, the usPopulationView view has 3664512 rows.
   
    ![Query results][6]

## Next steps
Now that you can connect and query, try [visualizing the data with Power BI][visualizing the data with Power BI].

To configure your environment for Azure Active Directory authentication, see [Authenticate to SQL analytics][Authenticate to SQL analytics].

<!--Arcticles-->
[Create a SQL analytics]: https://docs.microsoft.com/azure/sql-data-warehouse/create-data-warehouse-portal
[Authenticate to SQL analytics]: ../../sql-data-warehouse/sql-data-warehouse-authentication.md
[visualizing the data with PowerBI]: get-started-power-bi-professional.md 

<!--Other-->
[Azure portal]: https://portal.azure.com
[Install SSMS]: https://msdn.microsoft.com/library/hh213248.aspx


<!--Image references-->

[1]: media/sql-analytics-query-ssms/connect-object-explorer.png
[2]: media/sql-analytics-query-ssms/connect-object-explorer1.png
[3]: media/sql-analytics-query-ssms/explore-tables.png
[4]: media/sql-analytics-query-ssms/new-query.png
[5]: media/sql-analytics-query-ssms/execute-query.png
[6]: media/sql-analytics-query-ssms/results.png
[1a]: ../../sql-data-warehouse/media/sql-data-warehouse-query-ssms/connect-object-explorer.png
[2a]: ../../sql-data-warehouse/media/sql-data-warehouse-query-ssms/connect-object-explorer1.png
[3a]: ../../sql-data-warehouse/media/sql-data-warehouse-query-ssms/explore-tables.png
[4a]: ../../sql-data-warehouse/media/sql-data-warehouse-query-ssms/new-query.png
[5a]: ../../sql-data-warehouse/media/sql-data-warehouse-query-ssms/execute-query.png
[6a]: ../../sql-data-warehouse/media/sql-data-warehouse-query-ssms/results.png
