---
title: Connect to Synapse SQL with SQL Server Management Studio
description: Use SQL Server Management Studio (SSMS) to connect to and query Synapse SQL in Azure Synapse Analytics. 
author: azaricstefan 
ms.service: azure-synapse-analytics
ms.topic: overview 
ms.subservice: sql 
ms.date: 02/11/2025 
ms.author: stefanazaric 
---

# Connect to Synapse SQL with SQL Server Management Studio

> [!div class="op_single_selector"]
> * [Azure Data Studio](get-started-azure-data-studio.md)
> * [Power BI](get-started-power-bi-professional.md)
> * [Visual Studio](../sql/get-started-visual-studio.md)
> * [sqlcmd](../sql/get-started-connect-sqlcmd.md)
> * [SSMS](get-started-ssms.md)

You can use [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms) to connect to and query Synapse SQL in Azure Synapse Analytics through either serverless SQL pool or dedicated SQL pool resources.

> [!NOTE]
> Supported tools for serverless SQL pool:
> - The [mssql extension](https://aka.ms/mssql-marketplace) for [Visual Studio Code](https://code.visualstudio.com/docs).
> - SSMS is partially supported starting from version 18.5. You can use it to connect and query only.

## Prerequisites

* [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms).
* A data warehouse. To create a data warehouse for dedicated SQL pool, see [Create a dedicated SQL pool](../quickstart-create-sql-pool-portal.md). For serverless SQL pool, a data warehouse named *Built-in* is already provisioned in your workspace at creation time.
* The fully qualified SQL Server name. To find this name, see [Connect to Synapse SQL](connect-overview.md).

## Connect to Synapse SQL

### [Dedicated SQL pool](#tab/dedicated-sql-pool)

To connect to Synapse SQL using dedicated SQL pool, follow these steps:

1. Open SQL Server Management Studio (SSMS).

1. In the **Connect to Server** dialog box, fill in the fields, and then select **Connect**:
  
    :::image type="content" source="../sql-data-warehouse/media/sql-data-warehouse-query-ssms/connect-object-explorer1.png" alt-text="Screenshot that shows the Connect to Server dialog box.":::

   * **Server name**: Enter the server name previously identified.
   * **Authentication**: Choose an authentication type, such as *SQL Server Authentication* or *Active Directory Integrated Authentication*.
   * **Login** and **Password**: Enter your user name and password if SQL Server Authentication was selected.

1. Expand your Azure SQL Server in **Object Explorer**. You can view the databases associated with the server, such as the sample `AdventureWorksDW` database. You can expand the database to see the tables:

    :::image type="content" source="../sql-data-warehouse/media/sql-data-warehouse-query-ssms/explore-tables.png" alt-text="Screenshot that shows the Object Explorer window.":::

### [Serverless SQL pool](#tab/serverless-sql-pool)

To connect to Synapse SQL using serverless SQL pool, follow these steps:

1. Open SQL Server Management Studio (SSMS).

1. In the **Connect to Server** dialog box, fill in the fields, and then select **Connect**:

    :::image type="content" source="media/get-started-ssms/connect-object-explorer1.png" alt-text="Screenshot that shows the Connect to Server dialog box for serverless SQL pool.":::

   * **Server name**: Enter the server name previously identified.
   * **Authentication**: Choose an authentication type, such as *SQL Server Authentication* or *Microsoft Entra Authentication*.
   * **Login** and **Password**: Enter your user name and password if SQL Server Authentication was selected.

1. To explore, expand your Azure SQL server. You can view the databases associated with the server. Expand *demo* to see the content in your sample database.

    :::image type="content" source="media/get-started-ssms/explore-tables.png" alt-text="Screenshot that shows the Object Explorer window for serverless SQL pool.":::

---

## Run a sample query

### [Dedicated SQL pool](#tab/dedicated-sql-pool)

After you establish a database connection, you can query the data.

1. Right-click your database in SQL Server Object Explorer.

1. Select **New Query**. A new query window opens.

    :::image type="content" source="../sql-data-warehouse/media/sql-data-warehouse-query-ssms/new-query.png" alt-text="Screenshot of the New Query window.":::

1. Copy the following Transact-SQL (T-SQL) query into the query window:

    ```sql
    SELECT COUNT(*) FROM dbo.FactInternetSales;
    ```

1. Run the query by selecting `Execute` or use the following shortcut: `F5`.

    :::image type="content" source="../sql-data-warehouse/media/sql-data-warehouse-query-ssms/execute-query.png" alt-text="Screenshot of the Execute button to run the query.":::

1. Look at the query results. In the following example, the `FactInternetSales` table has 60,398 rows.

    :::image type="content" source="../sql-data-warehouse/media/sql-data-warehouse-query-ssms/results.png" alt-text="Screenshot of the query results.":::

### [Serverless SQL pool](#tab/serverless-sql-pool)

After you establish a database connection, you can query the data.

1. Right-click your database in SQL Server Object Explorer.

1. Select **New Query**. A new query window opens.

    :::image type="content" source="media/get-started-ssms/new-query.png" alt-text="Screenshot of the New Query window for serverless SQL pool.":::

1. Copy the following Transact-SQL (T-SQL) query into the query window:

    ```sql
    SELECT COUNT(*) FROM demo.dbo.usPopulationView;
    ```

1. Run the query by selecting `Execute` or use the following shortcut: `F5`.

    :::image type="content" source="media/get-started-ssms/execute-query.png" alt-text="Screenshot of the Execute button to run the query for serverless SQL pool.":::

1. Look at the query results. In this example, the `usPopulationView` view has 3,664,512 rows.

    :::image type="content" source="media/get-started-ssms/results.png" alt-text="Screenshot of the query results for serverless SQL pool.":::

---

## Related content

- [Connect to serverless SQL pool with Power BI Professional](get-started-power-bi-professional.md)
- [SQL Authentication in Azure Synapse Analytics](../sql/sql-authentication.md)
