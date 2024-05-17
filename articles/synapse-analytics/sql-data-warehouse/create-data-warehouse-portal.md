---
title: "Quickstart: Create and query a dedicated SQL pool (formerly SQL DW) (Azure portal)"
description: Create and query a dedicated SQL pool (formerly SQL DW) using the Azure portal
author: pimorano
ms.author: pimorano
ms.reviewer: wiassaf
ms.date: 02/21/2023
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: quickstart
ms.custom:
  - azure-synapse
  - mode-ui
---

# Quickstart: Create and query a dedicated SQL pool (formerly SQL DW) in Azure synapse Analytics using the Azure portal

Quickly create and query a dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics using the Azure portal.

> [!IMPORTANT]  
> This quickstart helps you to create a dedicated SQL pool (formerly SQL DW). To create a dedicated SQL pool in Azure Synapse Analytics workspace and take advantage of the latest features and integration in your Azure Synapse Analytics workspace, instead use [Quickstart: Create a dedicated SQL pool using Synapse Studio](../quickstart-create-sql-pool-studio.md).

## Prerequisites

1. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

   > [!NOTE]  
   > Creating a dedicated SQL pool (formerly SQL DW) in Azure Synapse may result in a new billable service. For more information, see [Azure Synapse Analytics pricing](https://azure.microsoft.com/pricing/details/synapse-analytics/).

1. Download and install the newest version of [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) (SSMS). Note: SSMS is only available on Windows based platforms, see the [full list of supported platforms](/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15&preserve-view=true#supported-operating-systems-ssms-185t).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create a SQL pool

Data warehouses are created using dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics. A dedicated SQL pool (formerly SQL DW) is created with a defined set of [compute resources](memory-concurrency-limits.md). The database is created within an [Azure resource group](../../azure-resource-manager/management/overview.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) and in a [logical SQL server](/azure/azure-sql/database/logical-servers?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).

Follow these steps to create a dedicated SQL pool (formerly SQL DW) that contains the `AdventureWorksDW` sample data.

1. Select **Create a resource** in the upper left-hand corner of the Azure portal.

   :::image type="content" source="./media/create-data-warehouse-portal/create-a-resource.png" alt-text="A screenshot of the Azure portal. Create a resource in Azure portal.":::

1. In the search bar, type "dedicated SQL pool" and select dedicated SQL pool (formerly SQL DW). Select **Create** on the page that opens.

   :::image type="content" source="./media/create-data-warehouse-portal/create-a-data-warehouse.png" alt-text="A screenshot of the Azure portal. Create an empty data warehouse.":::

1. In **Basics**, provide your subscription, resource group, dedicated SQL pool (formerly SQL DW) name, and server name:

   | Setting | Suggested value | Description  |
   | :--- | :--- | :--- |
   | **Subscription** | Your subscription | For details about your subscriptions, see [Subscriptions](https://account.windowsazure.com/Subscriptions). |
   | **Resource group** | myResourceGroup | For valid resource group names, see [Naming rules and restrictions](/azure/architecture/best-practices/resource-naming?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json). |
   | **SQL pool name** | Any globally unique name (An example is *mySampleDataWarehouse*) | For valid database names, see [Database Identifiers](/sql/relational-databases/databases/database-identifiers?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true). |
   | **Server** | Any globally unique name | Select existing server, or create a new server name, select **Create new**. For valid server names, see [Naming rules and restrictions](/azure/architecture/best-practices/resource-naming?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json). |

   :::image type="content" source="./media/create-data-warehouse-portal/create-sql-pool-basics.png" alt-text="A screenshot of the Azure portal. Create a data warehouse basic details.":::

1. Under **Performance level**, select **Select performance level** to optionally change your configuration with a slider.

   :::image type="content" source="./media/create-data-warehouse-portal/create-sql-pool-performance-level.png" alt-text="A screenshot of the Azure portal. Change data warehouse performance level.":::

   For more information about performance levels, see [Manage compute in Azure Synapse Analytics](sql-data-warehouse-manage-compute-overview.md).

1. Select **Additional Settings**, under **Use existing data**, choose **Sample** so that `AdventureWorksDW` will be created as the sample database.

    :::image type="content" source="./media/create-data-warehouse-portal/create-sql-pool-additional-1.png" alt-text="A screenshot of the Azure portal. Select Use existing data.":::

1. Now that you've completed the Basics tab of the Azure Synapse Analytics form, select **Review + Create** and then **Create** to create the SQL pool. Provisioning takes a few minutes.

   :::image type="content" source="./media/create-data-warehouse-portal/create-sql-pool-review-create.png" alt-text="A screenshot of the Azure portal. Select Review + Create.":::

   :::image type="content" source="./media/create-data-warehouse-portal/create-sql-pool-create.png" alt-text="A screenshot of the Azure portal. Select create.":::

1. On the toolbar, select **Notifications** to monitor the deployment process.

   :::image type="content" source="./media/create-data-warehouse-portal/notification.png" alt-text="A screenshot of the Azure portal shows Notifications with Deployment in progress.":::

## Create a server-level firewall rule

The Azure Synapse service creates a firewall at the server-level. This firewall prevents external applications and tools from connecting to the server or any databases on the server. To enable connectivity, you can add firewall rules that enable connectivity for specific IP addresses. Follow these steps to create a [server-level firewall rule](/azure/azure-sql/database/firewall-configure?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) for your client's IP address.

> [!NOTE]  
> Azure Synapse communicates over port 1433. If you are trying to connect from within a corporate network, outbound traffic over port 1433 might not be allowed by your network's firewall. If so, you cannot connect to your server unless your IT department opens port 1433.

1. After the deployment completes, select **All services** from the menu. Select **Databases**, select the star next to **Azure Synapse Analytics** to add Azure Synapse Analytics to your favorites.

1. Select **Azure Synapse Analytics** from the left-hand menu and then select **mySampleDataWarehouse** on the **Azure Synapse Analytics** page. The overview page for your database opens, showing you the fully qualified server name (such as `sqlpoolservername.database.windows.net`) and provides options for further configuration.

1. Copy this fully qualified server name for use to connect to your server and its databases in this and other quick starts. To open server settings, select the server name.

   :::image type="content" source="./media/create-data-warehouse-portal/find-server-name.png" alt-text="A screenshot of the Azure portal. Find server name and copy the server name to clipboard.":::

1. Select **Show firewall settings**.

   :::image type="content" source="./media/create-data-warehouse-portal/server-settings.png" alt-text="A screenshot of the Azure portal. Server settings, Show firewall settings.":::

1. The **Firewall settings** page for the server opens.

   :::image type="content" source="./media/create-data-warehouse-portal/server-firewall-rule.png" alt-text="A screenshot of the Azure portal. Server firewall rule via the Add Client IP button.":::

1. To add your current IP address to a new firewall rule, select **Add client IP** on the toolbar. A firewall rule can open port 1433 for a single IP address or a range of IP addresses.

1. Select **Save**. A server-level firewall rule is created for your current IP address opening port 1433 on the server.

1. Select **OK** and then close the **Firewall settings** page.

You can now connect to the server and its SQL pools using this IP address. The connection works from SQL Server Management Studio or another tool of your choice. When you connect, use the ServerAdmin account you created previously.

> [!IMPORTANT]  
> By default, access through the SQL Database firewall is enabled for all Azure services. Select **OFF** on this page and then select **Save** to disable the firewall for all Azure services.

## Get the fully qualified server name

Get the fully qualified server name for your server in the Azure portal. Later you use the fully qualified name when connecting to the server.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **Azure Synapse Analytics** from the left-hand menu, and select your workspace on the **Azure Synapse Analytics** page.

1. In the **Essentials** pane in the Azure portal page for your database, locate and then copy the **Server name**. In this example, the fully qualified name is `sqlpoolservername.database.windows.net`.

    :::image type="content" source="./media/create-data-warehouse-portal/find-server-name.png" alt-text="A screenshot of the Azure portal. Connection information.":::

## Connect to the server as server admin

This section uses [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) (SSMS) to establish a connection to your server.

1. Open SQL Server Management Studio.

1. In the **Connect to Server** dialog box, enter the following information:

   | Setting | Suggested value | Description  |
   | :--- | :--- | :--- |
   | Server type | Database engine | This value is required |
   | Server name | The fully qualified server name | Here's an example: `sqlpoolservername.database.windows.net`. |
   | Authentication | SQL Server Authentication | SQL Authentication is the only authentication type that is configured in this tutorial. |
   | Login | The server admin account | Account that you specified when you created the server. |
   | Password | The password for your server admin account | Password that you specified when you created the server. |

   :::image type="content" source="./media/create-data-warehouse-portal/connect-to-server-ssms.png" alt-text="A screenshot of SQL Server Management Studio (SSMS). Connect to server.":::

1. Select **Connect**. The Object Explorer window opens in SSMS.

1. In Object Explorer, expand **Databases**. Then expand **mySampleDatabase** to view the objects in your new database.

   :::image type="content" source="./media/create-data-warehouse-portal/connected-ssms.png" alt-text="A screenshot of SQL Server Management Studio (SSMS), showing database objects in Object Explorer.":::

## Run some queries

It is not recommended to run large queries while being logged as the server admin, as it uses a [limited resource class](resource-classes-for-workload-management.md). Instead configure [Workload Isolation](./quickstart-configure-workload-isolation-tsql.md) as [illustrated in the tutorials](./load-data-wideworldimportersdw.md#create-a-user-for-loading-data).

Azure Synapse Analytics uses T-SQL as the query language. To open a query window and run some T-SQL queries, use the following steps in SQL Server Management Studio (SSMS):

1. In Object Explorer, right-click **mySampleDataWarehouse** and select **New Query**. A new query window opens.

1. In the query window, enter the following command to see a list of databases.

    ```sql
    SELECT * FROM sys.databases
    ```

1. Select **Execute**. The query results show two databases: `master` and `mySampleDataWarehouse`.

   :::image type="content" source="./media/create-data-warehouse-portal/query-databases.png" alt-text="A screenshot of SQL Server Management Studio (SSMS). Query databases in SSMS, showing master and mySampleDataWarehouse in the resultset.":::

1. To look at some data, use the following command to see the number of customers with last name of Adams that have three children at home. The results list six customers.

    ```sql
    SELECT LastName, FirstName FROM dbo.dimCustomer
    WHERE LastName = 'Adams' AND NumberChildrenAtHome = 3;
    ```

   :::image type="content" source="./media/create-data-warehouse-portal/query-customer.png" alt-text="A screenshot of the SQL Server Management Studio (SSMS) query window. Query dbo.dimCustomer.":::

## Clean up resources

You're being charged for data warehouse units and data stored your dedicated SQL pool (formerly SQL DW). These compute and storage resources are billed separately.

- If you want to keep the data in storage, you can pause compute when you aren't using the dedicated SQL pool (formerly SQL DW). By pausing compute, you're only charged for data storage. You can resume compute whenever you're ready to work with the data.

- If you want to remove future charges, you can delete the dedicated SQL pool (formerly SQL DW).

Follow these steps to clean up resources you no longer need.

1. Sign in to the [Azure portal](https://portal.azure.com), select your dedicated SQL pool (formerly SQL DW).

   :::image type="content" source="./media/create-data-warehouse-portal/clean-up-resources.png" alt-text="A screenshot of the Azure portal. Clean up resources.":::

1. To pause compute, select the **Pause** button. When the dedicated SQL pool (formerly SQL DW) is paused, you see a **Resume** button. To resume compute, select **Resume**.

1. To remove the dedicated SQL pool (formerly SQL DW) so you aren't charged for compute or storage, select **Delete**.

1. To remove the server you created, select **sqlpoolservername.database.windows.net** in the previous image, and then select **Delete**. Be careful with this deletion, since deleting the server also deletes all databases assigned to the server.

1. To remove the resource group, select **myResourceGroup**, and then select **Delete resource group**.

Want to optimize and save on your cloud spending?

[!INCLUDE [cost-management-horizontal](../../../includes/cost-management-horizontal.md)]

## Next steps

- To learn more about loading data into your dedicated SQL pool (formerly SQL DW), continue to the [Load data into a dedicated SQL pool](load-data-from-azure-blob-storage-using-copy.md) article.
