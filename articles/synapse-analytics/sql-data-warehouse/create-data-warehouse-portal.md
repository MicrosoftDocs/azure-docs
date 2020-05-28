---
title: Create and query a Synapse SQL pool (Azure portal)
description: Create and query a Synapse SQL pool using the Azure portal
services: synapse-analytics
author: kevinvngo
manager: craigg
ms.service: synapse-analytics
ms.topic: quickstart
ms.subservice: 
ms.date: 05/28/2019
ms.author: Kevin
ms.reviewer: igorstan
ms.custom: seo-lt-2019, azure-synapse 
---

# Quickstart: Create and query a Synapse SQL pool using the Azure portal

Quickly create and query a Synapse SQL pool (data warehouse) in Azure Synapse Analytics (formerly SQL DW) using the Azure portal.

## Prerequisites

1. If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

   > [!NOTE]
   > Creating a SQL pool in Azure Synapse may result in a new billable service. For more information, see [Azure Synapse Analytics pricing](https://azure.microsoft.com/pricing/details/synapse-analytics/).

2. Download and install the newest version of [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest) (SSMS).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create a SQL pool

Data warehouses are created using SQL pool in Azure Synapse Analytics. A SQL pool is created with a defined set of [compute resources](memory-concurrency-limits.md). The database is created within an [Azure resource group](../../azure-resource-manager/management/overview.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) and in a [logical SQL server](../../azure-sql/database/logical-servers.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).

Follow these steps to create a SQL pool that contains the **AdventureWorksDW** sample data.

1. select **Create a resource** in the upper left-hand corner of the Azure portal.

   ![create a resource in Azure portal](./media/create-data-warehouse-portal/create-a-resource.png)

2. Select **Databases** on the **New** page, and select **Azure Synapse Analytics (formerly SQL DW)** in the **Featured** list.

   ![create empty data warehouse](./media/create-data-warehouse-portal/create-a-data-warehouse.png)

3. In **Basics**, provide your subscription, resource group, SQL pool name, and server name:

   | Setting | Suggested value | Description |
   | :------ | :-------------- | :---------- |
   | **Subscription** | Your subscription | For details about your subscriptions, see [Subscriptions](https://account.windowsazure.com/Subscriptions). |
   | **Resource group** | myResourceGroup | For valid resource group names, see [Naming rules and restrictions](/azure/architecture/best-practices/resource-naming?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json). |
   | **SQL pool name** | Any globally unique name  (An example is *mySampleDataWarehouse*) | For valid database names, see [Database Identifiers](/sql/relational-databases/databases/database-identifiers?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest). Note, a SQL pool is one type of database. |
   | **Server** | Any globally unique name | Select existing server, or create a new server name, select **Create new**. For valid server names, see [Naming rules and restrictions](/azure/architecture/best-practices/resource-naming?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json). |

   ![create a data warehouse basic details](./media/create-data-warehouse-portal/create-sql-pool-basics.png)

4. Under **Performance level**, select **Select performance level** to optionally change your configuration with a slider.

   ![change data warehouse performance level](./media/create-data-warehouse-portal/create-sql-pool-performance-level.png)  

   For more information about performance levels, see [Manage compute in Azure Synapse Analytics](sql-data-warehouse-manage-compute-overview.md).

5. Select **Additional Settings**, under **Use existing data**, choose **Sample** so that AdventureWorksDW will be created as the sample database.

    ![select Use existing data](./media/create-data-warehouse-portal/create-sql-pool-additional-1.png) 

6. Now that you've completed the Basics tab of the Azure Synapse Analytics form, select **Review + Create** and then **Create** to create the SQL pool. Provisioning takes a few minutes.

   ![select Review + Create](./media/create-data-warehouse-portal/create-sql-pool-review-create.png)

   ![select create](./media/create-data-warehouse-portal/create-sql-pool-create.png)

7. On the toolbar, select **Notifications** to monitor the deployment process.

   ![notification](./media/create-data-warehouse-portal/notification.png)

## Create a server-level firewall rule

The Azure Synapse service creates a firewall at the server-level. This firewall prevents external applications and tools from connecting to the server or any databases on the server. To enable connectivity, you can add firewall rules that enable connectivity for specific IP addresses. Follow these steps to create a [server-level firewall rule](../../azure-sql/database/firewall-configure.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) for your client's IP address.

> [!NOTE]
> Azure Synapse communicates over port 1433. If you are trying to connect from within a corporate network, outbound traffic over port 1433 might not be allowed by your network's firewall. If so, you cannot connect to your server unless your IT department opens port 1433.

1. After the deployment completes, select **All services** from the left-hand menu. Select **Databases**, select the star next to **Azure Synapse Analytics** to add Azure Synapse Analytics to your favorites.

2. Select **Azure Synapse Analytics** from the left-hand menu and then select **mySampleDataWarehouse** on the **Azure Synapse Analytics** page. The overview page for your database opens, showing you the fully qualified server name (such as **sqlpoolservername.database.windows.net**) and provides options for further configuration.

3. Copy this fully qualified server name for use to connect to your server and its databases in this and other quick starts. To open server settings, select the server name.

   ![find server name](./media/create-data-warehouse-portal/find-server-name.png)

4. Select **Show firewall settings**.

   ![server settings](./media/create-data-warehouse-portal/server-settings.png)

5. The **Firewall settings** page for the server opens.

   ![server firewall rule](./media/create-data-warehouse-portal/server-firewall-rule.png)

6. To add your current IP address to a new firewall rule, select **Add client IP** on the toolbar. A firewall rule can open port 1433 for a single IP address or a range of IP addresses.

7. select **Save**. A server-level firewall rule is created for your current IP address opening port 1433 on the server.

8. select **OK** and then close the **Firewall settings** page.

You can now connect to the server and its SQL pools using this IP address. The connection works from SQL Server Management Studio or another tool of your choice. When you connect, use the ServerAdmin account you created previously.

> [!IMPORTANT]
> By default, access through the SQL Database firewall is enabled for all Azure services. select **OFF** on this page and then select **Save** to disable the firewall for all Azure services.

## Get the fully qualified server name

Get the fully qualified server name for your server in the Azure portal. Later you use the fully qualified name when connecting to the server.

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Select **Azure Synapse Analytics** from the left-hand menu, and select your  on the **Azure Synapse Analytics** page.

3. In the **Essentials** pane in the Azure portal page for your database, locate and then copy the **Server name**. In this example, the fully qualified name is sqlpoolservername.database.windows.net.

    ![connection information](./media/create-data-warehouse-portal/find-server-name-copy.png)

## Connect to the server as server admin

This section uses [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest) (SSMS) to establish a connection to your server.

1. Open SQL Server Management Studio.

2. In the **Connect to Server** dialog box, enter the following information:

   | Setting | Suggested value | Description |
   | :------ | :-------------- | :---------- |
   | Server type | Database engine | This value is required |
   | Server name | The fully qualified server name | Here's an example: **sqlpoolservername.database.windows.net**. |
   | Authentication | SQL Server Authentication | SQL Authentication is the only authentication type that is configured in this tutorial. |
   | Login | The server admin account | Account that you specified when you created the server. |
   | Password | The password for your server admin account | Password that you specified when you created the server. |
   ||||

   ![connect to server](./media/create-data-warehouse-portal/connect-to-server-ssms.png)

3. select **Connect**. The Object Explorer window opens in SSMS.

4. In Object Explorer, expand **Databases**. Then expand **mySampleDatabase** to view the objects in your new database.

   ![database objects](./media/create-data-warehouse-portal/connected-ssms.png)

## Run some queries

It is not recommended to run large queries while being logged as the server admin, as it uses a [limited resource class](resource-classes-for-workload-management.md). Instead configure [Workload Isolation](https://docs.microsoft.com/azure/synapse-analytics/sql-data-warehouse/quickstart-configure-workload-isolation-tsql) as [illustrated in the tutorials](https://docs.microsoft.com/azure/synapse-analytics/sql-data-warehouse/load-data-wideworldimportersdw#create-a-user-for-loading-data).

SQL Data Warehouse uses T-SQL as the query language. To open a query window and run some T-SQL queries, use the following steps:

1. Right-select **mySampleDataWarehouse** and select **New Query**. A new query window opens.

2. In the query window, enter the following command to see a list of databases.

    ```sql
    SELECT * FROM sys.databases
    ```

3. select **Execute**. The query results show two databases: **master** and **mySampleDataWarehouse**.

   ![Query databases](./media/create-data-warehouse-portal/query-databases.png)

4. To look at some data, use the following command to see the number of customers with last name of Adams that have three children at home. The results list six customers.

    ```sql
    SELECT LastName, FirstName FROM dbo.dimCustomer
    WHERE LastName = 'Adams' AND NumberChildrenAtHome = 3;
    ```

   ![Query dbo.dimCustomer](./media/create-data-warehouse-portal/query-customer.png)

## Clean up resources

You're being charged for data warehouse units and data stored your SQL pool. These compute and storage resources are billed separately.

- If you want to keep the data in storage, you can pause compute when you aren't using the SQL pool. By pausing compute, you're only charged for data storage. You can resume compute whenever you're ready to work with the data.

- If you want to remove future charges, you can delete the SQL pool.

Follow these steps to clean up resources you no longer need.

1. Sign in to the [Azure portal](https://portal.azure.com), select your SQL pool.

   ![Clean up resources](./media/create-data-warehouse-portal/clean-up-resources.png)

2. To pause compute, select the **Pause** button. When the SQL pool is paused, you see a **Resume** button. To resume compute, select **Resume**.

3. To remove the SQL pool so you aren't charged for compute or storage, select **Delete**.

4. To remove the server you created, select **sqlpoolservername.database.windows.net** in the previous image, and then select **Delete**. Be careful with this deletion, since deleting the server also deletes all databases assigned to the server.

5. To remove the resource group, select **myResourceGroup**, and then select **Delete resource group**.

## Next steps

To learn more about loading data into your SQL pool, continue to the [Load data into SQL pool](load-data-from-azure-blob-storage-using-polybase.md) article.
