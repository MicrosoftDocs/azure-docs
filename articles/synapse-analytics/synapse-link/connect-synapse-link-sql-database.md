---
title: Get started with Azure Synapse Link for Azure SQL Database
description: Learn how to connect an Azure SQL database to an Azure Synapse workspace with Azure Synapse Link.
author: SnehaGunda
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: synapse-link
ms.custom: event-tier1-build-2022
ms.date: 11/16/2022
ms.author: sngun
ms.reviewer: sngun, wiassaf
---

# Get started with Azure Synapse Link for Azure SQL Database

This article is a step-by-step guide for getting started with Azure Synapse Link for Azure SQL Database. For an overview of this feature, see [Azure Synapse Link for Azure SQL Database](sql-database-synapse-link.md). 

## Prerequisites

* To get Azure Synapse Link for SQL, see [Create a new Azure Synapse workspace](https://portal.azure.com/#create/Microsoft.Synapse). The current tutorial is to create Azure Synapse Link for SQL in a public network. This article assumes that you selected **Disable Managed virtual network** and **Allow connections from all IP address** when you created an Azure Synapse workspace. If you want to configure Azure Synapse Link for Azure SQL Database with network security, also see [Configure Azure Synapse Link for Azure SQL Database with network security](connect-synapse-link-sql-database-vnet.md).

* For database transaction unit (DTU)-based provisioning, make sure that your Azure SQL Database service is at least Standard tier with a minimum of 100 DTUs. Free, Basic, or Standard tiers with fewer than 100 DTUs provisioned aren't supported.

## Configure your source Azure SQL database

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your Azure SQL logical server, select **Identity**, and then set **System assigned managed identity** to **On**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/set-identity-sql-database.png" alt-text="Screenshot of turning on the system assigned managed identity.":::

1. Go to **Networking**, and then select the **Allow Azure services and resources to access this server** checkbox. 

   :::image type="content" source="../media/connect-synapse-link-sql-database/configure-network-firewall-sql-database.png" alt-text="Screenshot that shows how to configure firewalls for your SQL database by using the Azure portal.":::

1. Using Microsoft SQL Server Management Studio (SSMS) or Azure Data Studio, connect to the logical server. If you want to have your Azure Synapse workspace connect to your Azure SQL database by using a managed identity, set the Microsoft Entra admin permissions on the logical server. To apply the privileges in step 6, use the same admin name to connect to the logical server with administrative privileges.

1. Expand **Databases**, right-click the database you've created, and then select **New Query**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/ssms-new-query.png" alt-text="Screenshot that shows how to select your database and create a new query.":::

1. If you want to have your Azure Synapse workspace connect to your source Azure SQL database by using a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md), run the following script to provide the managed identity permission to the source database.

   **You can skip this step** if you instead want to have your Azure Synapse workspace connect to your source Azure SQL database via SQL authentication.

   ```sql
   CREATE USER <workspace name> FROM EXTERNAL PROVIDER;
   ALTER ROLE [db_owner] ADD MEMBER <workspace name>;
   ```

1. You can create a table with your own schema. The following code is just an example of a `CREATE TABLE` query. You can also insert some rows into this table to ensure that there's data to be replicated.

   ```sql
   CREATE TABLE myTestTable1 (c1 int primary key, c2 int, c3 nvarchar(50)) 
   ```

## Create your target Azure Synapse SQL pool

1. Open [Synapse Studio](https://web.azuresynapse.net/).

1. Go to the **Manage** hub, select **SQL pools**, and then select **New**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-new-sql-pool.png" alt-text="Screenshot that shows how to create a new SQL dedicated pool from Synapse Studio.":::

1. Enter a unique pool name, use the default settings, and create the dedicated pool.

1. You need to create a schema if your expected schema isn't available in the target Azure Synapse SQL database. If your schema is *database owner* (dbo), you can skip this step.


## Create the Azure Synapse Link connection

1. On the left pane of the Azure portal, select **Integrate**.

1. On the **Integrate** pane, select the plus sign (**+**), and then select **Link connection**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-new-link-connection.png" alt-text="Screenshot that shows how to select a new link connection from Synapse Studio.":::

1. Under **Source linked service**, select **New**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-new-linked-service-dropdown.png" alt-text="Screenshot that shows how to select a new linked service.":::

1. Enter the information for your source Azure SQL database.

   * Select the subscription, server, and database corresponding to your Azure SQL database.
   * Do either of the following:
     * To connect your Azure Synapse workspace to the source database by using the workspace's managed identity, set **Authentication type** to **Managed Identity**.
     * To use SQL authentication instead, if you know the username and password to use, select **SQL Authentication**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-new-linked-service.png" alt-text="Screenshot that shows how to enter the server and database details to create a new linked service.":::

1. Select **Test connection** to ensure that the firewall rules are properly configured and the workspace can successfully connect to the source Azure SQL database.

1. Select **Create**.

   > [!NOTE]
   > The linked service that you create here isn't dedicated to Azure Synapse Link for SQL. It can be used by any workspace user who has the appropriate permissions. Take time to understand the scope of users who might have access to this linked service and its credentials. For more information about permissions in Azure Synapse workspaces, see [Azure Synapse workspace access control overview - Azure Synapse Analytics](../security/synapse-workspace-access-control-overview.md).

1. Select one or more source tables to replicate to your Azure Synapse workspace, and then select **Continue**.

   > [!NOTE]
   > A specified source table can be enabled in only one link connection at a time.

1. Select a target Azure Synapse SQL database and pool.

1. Provide a name for your Azure Synapse Link connection, and select the number of cores for the [link connection compute](sql-database-synapse-link.md#link-connection). These cores will be used for the movement of data from the source to the target.

   > [!NOTE]
   > * The number of cores you select here are allocated to the ingestion service for processing data loading and changes. They don't affect the source Azure SQL Database configuration or the target dedicated SQL pool confiruation.
   > * We recommend starting low and increasing the number of cores as needed.

1. Select **OK**.

1. With the new Azure Synapse Link connection open, you can update the target table name, distribution type, and structure type.

   > [!NOTE]
   > * Consider using *heap table* for the structure type when your data contains varchar(max), nvarchar(max), and varbinary(max).
   > * Make sure that the schema in your Azure Synapse SQL dedicated pool has already been created before you start the link connection. Azure Synapse Link for SQL will create tables automatically under your schema in the Azure Synapse SQL dedicated pool.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-edit-link.png" alt-text="Screenshot that shows where to edit the Azure Synapse Link connection from Synapse Studio.":::

1. Select **Publish all** to save the new link connection to the service.

## Start the Azure Synapse Link connection

Select **Start**, and then wait a few minutes for the data to be replicated.

   > [!NOTE]
   > A link connection will start from a full initial load from your source database, followed by incremental change feeds via the change feed feature in Azure SQL Database. For more information, see [Azure Synapse Link for SQL change feed](/sql/sql-server/synapse-link/synapse-link-sql-server-change-feed).

## Monitor the status of the Azure Synapse Link connection

You can monitor the status of your Azure Synapse Link connection, see which tables are being initially copied over (*snapshotting*), and see which tables are in continuous replication mode (*replicating*).

1. Go to the **Monitor** hub, and then select **Link connections**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-monitor-link-connections.png" alt-text="Screenshot that shows how to monitor the status of the Azure Synapse Link connection from the monitor hub.":::

1. Open the Azure Synapse Link connection that you started, and view the status of each table.

1. Select **Refresh** on the monitoring view for your connection to observe any updates to the status.

## Query the replicated data

Wait for a few minutes, and then check to ensure that the target database has the expected table and data. You can also now explore the replicated tables in your target Azure Synapse SQL dedicated pool.

1. In the **Data** hub, under **Workspace**, open your target database.

1. Under **Tables**, right-click one of your target tables.

1. Select **New SQL script**, and then select **Top 100 rows**.

1. Run this query to view the replicated data in your target Azure Synapse SQL dedicated pool.

1. You can also query the target database by using SSMS or other tools. Use the SQL dedicated endpoint for your workspace as the server name. This name is usually `<workspacename>.sql.azuresynapse.net`. Add `Database=databasename@poolname` as an extra connection string parameter when you're connecting via SSMS or other tools.

## Add or remove a table in an existing Azure Synapse Link connection

To add or remove tables in Synapse Studio, do the following:

1. Open the **Integrate** hub.

1. Select the link connection that you want to edit, and then open it.  

1. Do either of the following:

   * To add a table, select **New table**.
   * To remove a table, select the trash can icon next to it.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/link-connection-add-remove-tables.png" alt-text="Screenshot of the link connection pane for adding or removing tables.":::

   > [!NOTE]
   > You can directly add or remove tables when a link connection is running.

## Stop the Azure Synapse Link connection

To stop the Azure Synapse Link connection in Synapse Studio, do the following:

1. In your Azure Synapse workspace, open the **Integrate** hub.

1. Select the link connection that you want to edit, and then open it.  

1. Select **Stop** to stop the link connection, and it will stop replicating your data.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/stop-link-connection.png" alt-text="Screenshot of the pane for stopping a link connection.":::

   > [!NOTE]
   > If you restart a link connection after stopping it, it will start from a full initial load from your source database, and incremental change feeds will follow.

## Next steps

If you're using a database other than an Azure SQL database, see:

* [Configure Azure Synapse Link for Azure Cosmos DB](../../cosmos-db/configure-synapse-link.md?context=/azure/synapse-analytics/context/context)
* [Configure Azure Synapse Link for Dataverse](/powerapps/maker/data-platform/azure-synapse-link-synapse?context=/azure/synapse-analytics/context/context)
* [Get started with Azure Synapse Link for SQL Server 2022](connect-synapse-link-sql-server-2022.md)
* [Get or set a managed identity for an Azure SQL Database logical server or managed instance](/azure/azure-sql/database/authentication-azure-ad-user-assigned-managed-identity#get-or-set-a-managed-identity-for-a-logical-server-or-managed-instance)
