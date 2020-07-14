---
title: Connect with VSTS 
description: Query Azure Synapse Analytics with Visual Studio.
services: synapse-analytics
author: kevinvngo 
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: 
ms.date: 08/15/2019
ms.author: kevin
ms.reviewer: igorstan
ms.custom: seo-lt-2019
---

# Connect to Azure Synapse Analytics with Visual Studio and SSDT
> [!div class="op_single_selector"]
> * [Azure Data Studio](../sql/get-started-azure-data-studio.md)
> * [Power BI](sql-data-warehouse-get-started-visualize-with-power-bi.md)
> * [Visual Studio](sql-data-warehouse-query-visual-studio.md)
> * [sqlcmd](../sql/get-started-connect-sqlcmd.md) 
> * [SSMS](sql-data-warehouse-query-ssms.md)
> 
> 

Use Visual Studio to query a SQL pool within Azure Synapse in just a few minutes. This method uses the SQL Server Data Tools (SSDT) extension in Visual Studio 2019. 

## Prerequisites
To use this tutorial, you need:

* An existing SQL pool. To create one, see [Create a SQL pool](create-data-warehouse-portal.md).
* SSDT for Visual Studio. If you have Visual Studio, you probably already have SSDT for Visual Studio. For installation instructions and options, see [Installing Visual Studio and SSDT](sql-data-warehouse-install-visual-studio.md).
* The fully qualified SQL server name. To find this information, see [Connect to SQL pool](../sql/connect-overview.md).

## 1. Connect to your SQL pool
1. Open Visual Studio 2019.
2. Open SQL Server Object Explorer by selecting **View** > **SQL Server Object Explorer**.
   
    ![SQL Server Object Explorer](./media/sql-data-warehouse-query-visual-studio/open-ssdt.png)
3. Click the **Add SQL Server** icon.
   
    ![Add SQL Server](./media/sql-data-warehouse-query-visual-studio/add-server.png)
4. Fill in the fields in the Connect to Server window.
   
    ![Connect to Server](./media/sql-data-warehouse-query-visual-studio/connection-dialog.png)
   
   * **Server name**. Enter the **server name** previously identified.
   * **Authentication**. Select **SQL Server Authentication** or **Active Directory Integrated Authentication**.
   * **User Name** and **Password**. Enter user name and password if SQL Server Authentication was selected above.
   * Click **Connect**.
5. To explore, expand your Azure SQL server. You can view the databases associated with the server. Expand AdventureWorksDW to see the tables in your sample database.
   
    ![Explore AdventureWorksDW](./media/sql-data-warehouse-query-visual-studio/explore-sample.png)

## 2. Run a sample query
Now that a connection has been established to your database, let's write a query.

1. Right-click your database in SQL Server Object Explorer.
2. Select **New Query**. A new query window opens.
   
    ![New query](./media/sql-data-warehouse-query-visual-studio/new-query2.png)
3. Copy the following T-SQL query into the query window:
   
    ```sql
    SELECT COUNT(*) FROM dbo.FactInternetSales;
    ```
4. Run the query by clicking the green arrow or use the following shortcut: `CTRL`+`SHIFT`+`E`.
   
    ![Run query](./media/sql-data-warehouse-query-visual-studio/run-query.png)
5. Look at the query results. In this example, the FactInternetSales table has 60398 rows.
   
    ![Query results](./media/sql-data-warehouse-query-visual-studio/query-results.png)

## Next steps
Now that you can connect and query, try [visualizing the data with Power BI](sql-data-warehouse-get-started-visualize-with-power-bi.md).

To configure your environment for Azure Active Directory authentication, see [Authenticate to SQL pool](sql-data-warehouse-authentication.md).
