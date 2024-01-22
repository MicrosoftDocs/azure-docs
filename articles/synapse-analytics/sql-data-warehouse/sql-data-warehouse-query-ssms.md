---
title: Connect to dedicated SQL pool (formerly SQL DW) with SSMS 
description: Use SQL Server Management Studio (SSMS) to connect to and query a dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics. 
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: sql-dw 
ms.date: 04/17/2018
author: WilliamDAssafMSFT 
ms.author: wiassaf
ms.custom: seo-lt-2019
---

# Connect to a dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics with SQL Server Management Studio (SSMS)

> [!div class="op_single_selector"]
>
> * [Power BI](/power-bi/connect-data/service-azure-sql-data-warehouse-with-direct-connect)
> * [Azure Machine Learning](sql-data-warehouse-get-started-analyze-with-azure-machine-learning.md)
> * [Visual Studio](sql-data-warehouse-query-visual-studio.md)
> * [sqlcmd](sql-data-warehouse-get-started-connect-sqlcmd.md)
> * [SSMS](sql-data-warehouse-query-ssms.md)

Use SQL Server Management Studio (SSMS) to connect to and query a dedicated SQL pool (formerly SQL DW).

## Prerequisites

To use this tutorial, you need:

* An existing dedicated SQL pool. To create one, see [Create a dedicated SQL pool (formerly SQL DW)](create-data-warehouse-portal.md).
* SQL Server Management Studio (SSMS) installed. [Download SSMS](/sql/ssms/download-sql-server-management-studio-ssms?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) for free if you don't already have it.
* The fully qualified SQL server name. To find this information, see [Dedicated SQL pool (formerly SQL DW)](sql-data-warehouse-connect-overview.md).

## 1. Connect to your dedicated SQL pool (formerly SQL DW)

1. Open SSMS.
2. Open Object Explorer by selecting **File** > **Connect Object Explorer**.

    ![SQL Server Object Explorer](./media/sql-data-warehouse-query-ssms/connect-object-explorer.png)
3. Fill in the fields in the Connect to Server window.

   ![Connect to Server](./media/sql-data-warehouse-query-ssms/connect-object-explorer1.png)

   * **Server name**. Enter the **server name** previously identified.
   * **Authentication**. Select **SQL Server Authentication** or **Active Directory Integrated Authentication**.
   * **User Name** and **Password**. Enter user name and password if SQL Server Authentication was selected above.
   * Click **Connect**.
4. To explore, expand your Azure SQL server. You can view the databases associated with the server. Expand AdventureWorksDW to see the tables in your sample database.

   ![Explore AdventureWorksDW](./media/sql-data-warehouse-query-ssms/explore-tables.png)

## 2. Run a sample query

Now that a connection has been established to your database, let's write a query.

1. Right-click your database in SQL Server Object Explorer.
2. Select **New Query**. A new query window opens.

   ![New query](./media/sql-data-warehouse-query-ssms/new-query.png)
3. Copy the following T-SQL query into the query window:

   ```sql
   SELECT COUNT(*) FROM dbo.FactInternetSales;
   ```

4. Run the query by clicking `Execute` or use the following shortcut: `F5`.

   ![Run query](./media/sql-data-warehouse-query-ssms/execute-query.png)
5. Look at the query results. In this example, the FactInternetSales table has 60398 rows.

   ![Query results](./media/sql-data-warehouse-query-ssms/results.png)

## Next steps

Now that you can connect and query, try [visualizing the data with Power BI](/power-bi/connect-data/service-azure-sql-data-warehouse-with-direct-connect). To configure your environment for Microsoft Entra authentication, see [Authenticate to dedicated SQL pool](sql-data-warehouse-authentication.md).
