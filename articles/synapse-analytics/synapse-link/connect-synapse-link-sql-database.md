---
title: Get started with Azure Synapse Link for Azure SQL Database (Preview)
description: Learn how to connect an Azure SQL database to an Azure Synapse workspace with Azure Synapse Link (Preview).
author: SnehaGunda
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: synapse-link
ms.custom: event-tier1-build-2022
ms.date: 05/09/2022
ms.author: sngun
ms.reviewer: sngun, wiassaf
---

# Get started with Azure Synapse Link for Azure SQL Database (Preview)

This article provides a step-by-step guide for getting started with Azure Synapse Link for Azure SQL Database. For more information, see [Synapse Link for Azure SQL Database (Preview)](sql-database-synapse-link.md). 

> [!IMPORTANT]
> Azure Synapse Link for SQL is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

* [Create a new Synapse workspace](https://portal.azure.com/#create/Microsoft.Synapse) to get Azure Synapse Link for SQL. The current tutorial is to create Synapse link for SQL in public network. The assumption is that you have checked "Disable Managed virtual network" and "Allow connections from all IP address" when creating Synapse workspace. If you want to configure Synapse link for Azure SQL Database with network security, please also refer to [Configure Synapse link for Azure SQL Database with network security](connect-synapse-link-sql-database-vnet.md).

* For DTU-based provisioning, make sure your Azure SQL Database service is at least Standard tier with a minimum of 100 DTUs. Free, Basic, or Standard tiers with fewer than 100 DTUs provisioned are not supported.

## Configure your source Azure SQL Database

1. Go to Azure portal, navigate to your Azure SQL Server, select **Identity**, and then set **System assigned managed identity** to **On**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/set-identity-sql-database.png" alt-text="Screenshot of turning on system assigned managed identity.":::

1. Navigate to **Networking**, then check **Allow Azure services and resources to access this server**. 

   :::image type="content" source="../media/connect-synapse-link-sql-database/configure-network-firewall-sql-database.png" alt-text="Screenshot of configuring firewalls for your SQL DB using Azure portal.":::

1. Using Microsoft SQL Server Management Studio (SSMS) or Azure Data Studio, connect to the Azure SQL Server. If you want to have your Synapse workspace connect to your Azure SQL Database using a managed identity, set the Azure Active Directory admin on Azure SQL Server, and use the same admin name to connect to Azure SQL Server with administrative privileges in order to have the privileges in step 5.

1. Expand **Databases**, right select the database you created above, and select **New Query**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/ssms-new-query.png" alt-text="Select your database and create a new query.":::

1. If you want to have your Synapse workspace connect to your source Azure SQL Database using a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md), run the following script to provide the managed identity permission to the source database.

   **You can skip this step** if you instead want to have your Synapse workspace connect to your source Azure SQL Database via SQL authentication.

   ```sql
   CREATE USER <workspace name> FROM EXTERNAL PROVIDER;
   ALTER ROLE [db_owner] ADD MEMBER <workspace name>;
   ```

1. You can create a table with your own schema; the following is just an example for a `CREATE TABLE` query. You can also insert some rows into this table to ensure there's data to be replicated.

   ```sql
   CREATE TABLE myTestTable1 (c1 int primary key, c2 int, c3 nvarchar(50)) 
   ```

## Create your target Synapse SQL pool

1. Launch [Synapse Studio](https://web.azuresynapse.net/).

1. Open the **Manage** hub, navigate to **SQL pools**, and select **+ New**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-new-sql-pool.png" alt-text="Create a new SQL dedicated pool from Synapse Studio.":::

1. Enter a unique pool name, use the default settings, and create the dedicated pool.

1. You need to create a schema if your expected schema is not available in target Synapse SQL database. If your schema is dbo, you can skip this step.


## Create the Azure Synapse Link connection

1. Open the **Integrate** hub, and select **+ Link connection(Preview)**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-new-link-connection.png" alt-text="Select a new link connection from Synapse Studio.":::

1. Under **Source linked service**, select **New**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-new-linked-service-dropdown.png" alt-text="Select a new linked service.":::

1. Enter the information for your source Azure SQL Database.

   * Select the subscription, server, and database corresponding to your Azure SQL Database.
   * If you wish to connect your Synapse workspace to the source DB using the workspace's managed identity, set **Authentication type** to **Managed Identity**.
   * If you wish to use SQL authentication instead and know the username/password to use, select **SQL Authentication** instead.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-new-linked-service.png" alt-text="Enter the server, database details to create a new linked service.":::

1. Select **Test connection** to ensure the firewall rules are properly configured and the workspace can successfully connect to the source Azure SQL Database.

1. Select **Create**.
   > [!NOTE]
   > The linked service that you create here is not dedicated to Azure Synapse Link for SQL - it can be used by any workspace user that has the appropriate permissions. Please take time to understand the scope of users who may have access to this linked service and its credentials. For more information on permissions in Azure Synapse workspaces, see [Azure Synapse workspace access control overview - Azure Synapse Analytics](../security/synapse-workspace-access-control-overview.md).

1. Select one or more source tables to replicate to your Synapse workspace and select **Continue**.

   > [!NOTE]
   > A given source table can only be enabled in at most one link connection at a time.

1. Select a target Synapse SQL database and pool.

1. Provide a name for your Azure Synapse Link connection, and select the number of cores for the [link connection compute](sql-database-synapse-link.md#link-connection). These cores will be used for the movement of data from the source to the target.

   > [!NOTE]
   > We recommend starting low and increasing as needed.

1. Select **OK**.

1. With the new Azure Synapse Link connection open, you can update the target table name, distribution type and structure type.

   > [!NOTE]
   > * Consider heap table for structure type when your data contains varchar(max), nvarchar(max), and varbinary(max).
   > * Make sure the schema in your Synapse dedicated SQL pool has already been created before you start the link connection. Azure Synapse Link for SQL will create tables automatically under your schema in the Synapse dedicated SQL pool.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-edit-link.png" alt-text="Edit Azure Synapse Link connection from Synapse Studio.":::

1. Select **Publish all** to save the new link connection to the service.

## Start the Azure Synapse Link connection

1. Select **Start** and wait a few minutes for the data to be replicated.

   > [!NOTE]
   > When being started, a link connection will start from a full initial load from your source database followed by incremental change feeds via the change feed feature in Azure SQL database. For more information, see [Azure Synapse Link for SQL change feed](/sql/sql-server/synapse-link/synapse-link-sql-server-change-feed).

## Monitor the status of the Azure Synapse Link connection

You may monitor the status of your Azure Synapse Link connection, see which tables are being initially copied over (Snapshotting), and see which tables are in continuous replication mode (Replicating).

1. Navigate to the **Monitor** hub, and select **Link connections**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-monitor-link-connections.png" alt-text="Monitor the status of Azure Synapse Link connection from the monitor hub.":::

1. Open the Azure Synapse Link connection you started and view the status of each table.

1. Select **Refresh** on the monitoring view for your connection to observe any updates to the status.

## Query replicated data

Wait for a few minutes, then check the target database has the expected table and data. You can also now explore the replicated tables in your target Synapse dedicated SQL pool.

1. In the **Data** hub, under **Workspace**, open your target database, and within **Tables**, right-click one of your target tables.

1. Choose **New SQL script**, then **Select TOP 100 rows**.

1. Run this query to view the replicated data in your target Synapse dedicated SQL pool.

1. You can also query the target database with SSMS (or other tools). Use the dedicated SQL endpoint for your workspace as the server name. This is typically `<workspacename>.sql.azuresynapse.net`. Add `Database=databasename@poolname` as another connection string parameter when connecting via SSMS (or other tools).

## Add/remove table in existing Azure Synapse Link connection

You can add/remove tables on Synapse Studio as following:

1. Open the **Integrate Hub**.

1. Select the **Link connection** you want to edit and open it.  

1. Select **+New** table to add tables on Synapse Studio or select the trash can icon to the right or a table to remove an existing table. You can add or remove tables when the link connection is running.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/link-connection-add-remove-tables.png" alt-text="Screenshot of link connection to add table.":::

   > [!NOTE]
   > You can directly add or remove tables when a link connection is running.

## Stop the Azure Synapse Link connection

You can stop the Azure Synapse Link connection in Synapse Studio as follows:

1. Open the **Integrate Hub** of your Synapse workspace.

1. Select the **Link connection** you want to edit and open it.  

1. Select **Stop** to stop the link connection, and it will stop replicating your data.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/stop-link-connection.png" alt-text="Screenshot of link connection to stop link.":::

   > [!NOTE]
   > If you restart a link connection after stopping it, it will start from a full initial load from your source database followed by incremental change feeds.

## Next steps

If you are using a different type of database, see how to:

* [Configure Azure Synapse Link for Azure Cosmos DB](../../cosmos-db/configure-synapse-link.md?context=/azure/synapse-analytics/context/context)
* [Configure Azure Synapse Link for Dataverse](/powerapps/maker/data-platform/azure-synapse-link-synapse?context=/azure/synapse-analytics/context/context)
* [Get started with Azure Synapse Link for SQL Server 2022](connect-synapse-link-sql-server-2022.md)
* [Get or set a managed identity for an Azure SQL Database logical server or managed instance](/sql/azure-sql/database/authentication-azure-ad-user-assigned-managed-identity.md#get-or-set-a-managed-identity-for-a-logical-server-or-managed-instance)