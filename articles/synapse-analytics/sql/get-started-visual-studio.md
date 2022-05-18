---
title: Connect and query Synapse SQL with Visual Studio and SSDT
description: Use Visual Studio to query dedicated SQL pool using Azure Synapse Analytics.
services: synapse analytics
author: azaricstefan 
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: sql
ms.date: 04/15/2020
ms.author: stefanazaric 
ms.reviewer: sngun
---

# Connect to Synapse SQL with Visual Studio and SSDT

> [!div class="op_single_selector"]
> * [Azure Data Studio](get-started-azure-data-studio.md)
> * [Power BI](get-started-power-bi-professional.md)
> * [Visual Studio](get-started-visual-studio.md)
> * [sqlcmd](get-started-connect-sqlcmd.md) 
> * [SSMS](get-started-ssms.md)
> 
> 

Use Visual Studio to query dedicated SQL pool using Azure Synapse Analytics. This method uses the SQL Server Data Tools (SSDT) extension in Visual Studio 2019. 

> [!NOTE]
> Serverless SQL pool is not supported by SSDT.

## Prerequisites

To use this tutorial, you need to have the following components:

- An existing Synapse workspace, If you need to create one see [Creating a Synapse workspace](../get-started-create-workspace.md)
- A dedicated SQL pool. If you do not have one, see [Create a dedicated SQL pool](../get-started-analyze-sql-pool.md#create-a-dedicated-sql-pool).
- SSDT for Visual Studio. If you have Visual Studio, you probably already have this component. For installation instructions and options, see [Installing Visual Studio and SSDT](../sql-data-warehouse/sql-data-warehouse-install-visual-studio.md?context=/azure/synapse-analytics/context/context).
- The fully qualified SQL server name. To find this server name, see [Connect to a dedicated SQL pool](connect-overview.md).

## 1. Connect to a dedicated SQL pool
1. Open Visual Studio 2019.
2. Open the SQL Server Object Explorer by selecting **View** > **SQL Server Object Explorer**.
   
    ![SQL Server Object Explorer](./media/get-started-visual-studio/open-ssdt.png)
3. Click the **Add SQL Server** icon.
   
    ![Add SQL Server](./media/get-started-visual-studio/add-server.png)
4. Fill in the fields in the Connect to Server window.
   
    ![Connect to Server](./media/get-started-visual-studio/connection-dialog.png)
   
   * **Server name**: Enter the **server name** previously identified.
   * **Authentication**: Select **SQL Server Authentication** or **Active Directory Integrated Authentication**:
   * **User Name** and **Password**: Enter your user name and password if SQL Server Authentication was selected above.
   * Click **Connect**.
5. To explore, expand your Azure SQL server. You can view the databases associated with the server. Expand AdventureWorksDW to see the tables in your sample database.
   
    ![Explore AdventureWorksDW](./media/get-started-visual-studio/explore-sample.png)

## 2. Run a sample query
Now that a connection has been established to your database, you'll write a query.

1. Right-click your database in SQL Server Object Explorer.
2. Select **New Query**. A new query window opens.
   
    ![New query](./media/get-started-visual-studio/new-query2.png)
3. Copy the following T-SQL query into the query window:
   
    ```sql
    SELECT COUNT(*) FROM dbo.FactInternetSales;
    ```
4. Run the query by clicking the green arrow or use the following shortcut: `CTRL`+`SHIFT`+`E`.
   
    ![Run query](./media/get-started-visual-studio/run-query.png)
5. Look at the query results. In this example, the FactInternetSales table has 60398 rows.
   
    ![Query results](./media/get-started-visual-studio/query-results.png)

## Next steps
Now that you can connect and query, try [visualizing the data with Power BI](get-started-power-bi-professional.md).
To configure your environment for Azure Active Directory authentication, see [Authenticate to dedicated SQL pool](sql-authentication.md?tabs=provisioned).
 