---
title: Create Azure Synapse Link for SQL Server 2022
description: Learn how to create and connect a SQL Server 2022 instance to an Azure Synapse workspace by using Azure Synapse Link.
author: SnehaGunda
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: synapse-link
ms.custom: event-tier1-build-2022, engagement-fy23
ms.date: 11/16/2022
ms.author: sngun
ms.reviewer: sngun, wiassaf
---

# Get started with Azure Synapse Link for SQL Server 2022

This article is a step-by-step guide for getting started with Azure Synapse Link for SQL Server 2022. For an overview, see [Azure Synapse Link for SQL Server 2022](sql-server-2022-synapse-link.md). 

## Prerequisites

* Before you begin, see [Create a new Azure Synapse workspace](https://portal.azure.com/#create/Microsoft.Synapse) to get Azure Synapse Link for SQL. The current tutorial is to create Azure Synapse Link for SQL in a public network. This article assumes that you selected **Disable Managed virtual network** and **Allow connections from all IP addresses** when you created an Azure Synapse workspace. If you want to configure Azure Synapse Link for SQL Server 2022 with network security, also see [Configure Azure Synapse Link for SQL Server 2022 with network security](connect-synapse-link-sql-server-2022-vnet.md).

* Create an Azure Data Lake Storage Gen2 account, which is different from the account you create with the Azure Synapse Analytics workspace. You'll use this account as the landing zone to stage the data submitted by SQL Server 2022. For more information, see [Create an Azure Data Lake Storage Gen2 account](../../storage/blobs/create-data-lake-storage-account.md).

* Make sure that your SQL Server 2022 database has a master key created.

   ```sql
   CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<a new password>'
   ```

## Create your target Azure Synapse SQL dedicated pool

1. Open [Synapse Studio](https://ms.web.azuresynapse.net/).

1. Open the **Manage** hub, go to **SQL pools**, and then select **New**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-new-sql-pool.png" alt-text="Screenshot that shows how to create a new Azure Synapse SQL dedicated pool from Synapse Studio.":::

1. Enter a unique pool name, use the default settings, and create the dedicated pool.

1. From the **Data** hub, under **Workspace**, your new Azure Synapse SQL database should be listed under **Databases**. From your new Azure Synapse SQL database, select **New SQL script**, and then select **Empty script**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/studio-new-empty-sql-script.png" alt-text="Screenshot that shows how to create a new empty SQL script from Synapse Studio.":::

1. To create the master key for your target Azure Synapse SQL database, paste the following script, and then select **Run**.

   ```sql
   CREATE MASTER KEY
   ```

## Create a linked service for your source SQL Server 2022 database

1. Select the **Manage** hub button, and then select **Linked services**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/studio-linked-service-navigation.png" alt-text="Go to linked services from Synapse Studio.":::

1. Press **New**, select **SQL Server** and select **Continue**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/studio-linked-service-select.png" alt-text="Screenshot that shows how to create a SQL server linked service.":::

1. In the **Name** box, enter the name of the linked service of SQL Server 2022.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/studio-linked-service-new.png" alt-text="Screenshot that shows where to enter the server and database names to connect.":::

1. When you're choosing the integration runtime, select your self-hosted integration runtime. If your Azure Synapse workspace doesn't have an available self-hosted integration runtime, create one.

1. (Optional) To create a self-hosted integration runtime to connect to your source SQL Server 2022, do the following:

   a. Select **New**.

     :::image type="content" source="../media/connect-synapse-link-sql-server-2022/create-new-integration-runtime.png" alt-text="Screenshot that shows how to create a new self-hosted integration runtime.":::

   b. Select **Self-hosted**, and then select **Continue**.

   c. In the **Name** box, enter the name of the self-hosted integration runtime, and then select **Create**.

     :::image type="content" source="../media/connect-synapse-link-sql-server-2022/input-name-integration-runtime.png" alt-text="Screenshot that shows where to enter a name for the self-hosted integration runtime.":::

     A self-hosted integration runtime is now available in your Azure Synapse workspace. 
   
   d. Follow the prompts to download, install, and use the key to register your integration runtime agent on your Windows machine, which has direct access to your SQL Server 2022 instance. For more information, see [Create a self-hosted integration runtime - Azure Data Factory and Azure Synapse](../../data-factory/create-self-hosted-integration-runtime.md?context=%2Fazure%2Fsynapse-analytics%2Fcontext%2Fcontext&tabs=synapse-analytics#install-and-register-a-self-hosted-ir-from-microsoft-download-center).

     :::image type="content" source="../media/connect-synapse-link-sql-server-2022/set-up-integration-runtime.png" alt-text="Screenshot that shows where to download, install, and register the integration runtime.":::

   e. Select **Close**. 

     :::image type="content" source="../media/connect-synapse-link-sql-server-2022/integration-runtime-status.png" alt-text="Get the status of integration runtime.":::

   f. Go to the monitoring page, and then ensure that your self-hosted integration runtime is running by selecting **Refresh** to get the latest status of integration runtime. 

1. Continue to enter the remaining information for your linked service, including **SQL Server name**, **Database name**, **Authentication type**, **User name**, and **Password** to connect to your SQL Server 2022 instance.

   > [!NOTE]
   > We recommend that you enable encryption on this connection. To do so, add the `Encrypt` property with a value of `true` as an additional connection property. Also set the `Trust Server Certificate` property to either `true` or `false`, depending on your server configuration. For more information, see [Enable encrypted connections to the database engine](/sql/database-engine/configure-windows/enable-encrypted-connections-to-the-database-engine).

1. Select **Test Connection** to ensure that your self-hosted integration runtime can access your SQL Server instance.

1. Select **Create**.

   Your new linked service will be connected to the SQL Server 2022 instance that's available in your workspace.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/view-linked-service-connection.png" alt-text="Screenshot that shows where to view the linked service connection.":::

   > [!NOTE]
   > The linked service that you create here isn't dedicated to Azure Synapse Link for SQL. It can be used by any workspace user who has the appropriate permissions. Take time to understand the scope of users who might have access to this linked service and its credentials. For more information about permissions in Azure Synapse workspaces, see [Azure Synapse workspace access control overview - Azure Synapse Analytics](../security/synapse-workspace-access-control-overview.md).

## Create a linked service to connect to your landing zone on Azure Data Lake Storage Gen2

1. Go to your newly created Azure Data Lake Storage Gen2 account, select **Access Control (IAM)**, select **Add**, and then select **Add role assignment**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/adls-gen2-access-control.png" alt-text="Screenshot of the 'Access Control (IAM)' pane of the Data Lake Storage Gen2 account.":::

1. Select **Storage Blob Data Contributor** for the chosen role, select **Managed identity** and then, under **Members**, select your Azure Synapse workspace. Adding this role assignment might take a few minutes.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/adls-gen2-assign-blob-data-contributor-role.png" alt-text="Screenshot that shows how to add a role assignment.":::

   > [!NOTE]
   > Make sure that you've granted your Azure Synapse workspace managed identity permissions to the Azure Data Lake Storage Gen2 storage account that's used as the landing zone. For more information, see [Grant permissions to a managed identity in an Azure Synapse workspace - Azure Synapse Analytics](../security/how-to-grant-workspace-managed-identity-permissions.md#grant-the-managed-identity-permissions-to-adls-gen2-storage-account).

1. Open the **Manage** hub in your Azure Synapse workspace, and go to **Linked services**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/studio-linked-service-navigation.png" alt-text="Screenshot that shows how to go to the linked service.":::

1. Select **New**, and then select **Azure Data Lake Storage Gen2**.

1. Do the following:

    a. In the **Name** box, enter the name of the linked service for your landing zone.

    b. For **Authentication method**, enter **Managed Identity**.

    c. Select the **Storage account name**, which has already been created.  

1. Select **Test Connection** to ensure that you can access your Azure Data Lake Storage Gen2 account.

1. Select **Create**.

   Your new linked service will be connected to the Azure Data Lake Storage Gen2 account.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/storage-gen2-linked-service-created.png" alt-text="Screenshot that shows the new linked service to Azure Data Lake Storage Gen2.":::

   > [!NOTE]
   > The linked service that you create here isn't dedicated to Azure Synapse Link for SQL. It can be used by any workspace user who has the appropriate permissions. Take time to understand the scope of users who might have access to this linked service and its credentials. For more information about permissions in Azure Synapse workspaces, see [Azure Synapse workspace access control overview - Azure Synapse Analytics](../security/synapse-workspace-access-control-overview.md).
   
## Create the Azure Synapse Link connection

1. From Synapse Studio, open the **Integrate** hub.


1. On the **Integrate** pane, select the plus sign (**+**), and then select **Link connection**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/new-link-connection.png" alt-text="Screenshot that shows the 'Link connection' button.":::

1. Enter your source database:

    a. For **Source type**, select **SQL Server**.

    b, For your source **Linked service**, select the service that connects to your SQL Server 2022 instance.

    c. For **Table names**, select names from your SQL Server instance to be replicated to your Azure Synapse SQL pool.

    d. Select **Continue**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/input-source-database-details-link-connection.png" alt-text="Screenshot that shows where to enter source database details.":::

1. From **Synapse SQL Dedicated Pools**, select a target database name. 

1. Select **Continue**.

1. Enter your link connection settings:

   a. For **Link connection name**, enter the name.

   b. For **Core count** for the [link connection compute](sql-server-2022-synapse-link.md#link-connection), enter the number of cores. These cores will be used for the movement of data from the source to the target. We recommend that you start with a small number and increase the count as needed.

   c. For **Linked service**, select the service that will connect to your landing zone.

   d. Enter your Azure Data Lake Storage Gen2 **container name or container/folder name** as a landing zone folder path for staging the data. The container must be created first.

   e. Enter your Azure Data Lake Storage Gen2 shared access signature token. The token is required for the SQL change feed to access the landing zone. If your Azure Data Lake Storage Gen2 account doesn't have a shared access signature token, you can create one by selecting **Generate token**.

   f. Select **OK**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/link-connection-compute-settings.png" alt-text="Screenshot that shows where to enter the link connection settings.":::

   > [!NOTE]
   > The number of cores you select here are allocated to the ingestion service for processing data loading and changes. They don't affect the target dedicated SQL pool confiruation.
   > If you can’t connect to landing zone using generated SAS token due to limitation from your storage, you can try to use delegation SAS token to connect to landing zone as well. 

1. With the new Azure Synapse Link connection open, you can now update the target table name, distribution type, and structure type.

   > [!NOTE]
   > * Consider using *heap table* for the structure type when your data contains varchar(max), nvarchar(max), and varbinary(max).
   > * Make sure that the schema in your Azure Synapse SQL dedicated pool has already been created before you start the link connection. Azure Synapse Link for SQL will create tables automatically under your schema in the Azure Synapse SQL pool.

1. Select **Publish all** to save the new link connection to the service.

## Start the Azure Synapse Link connection

Select **Start**, and then wait a few minutes for the data to be replicated.

> [!NOTE]
> A link connection will start from a full initial load from your source database, followed by incremental change feeds via the change feed feature in SQL Server 2022. For more information, see [Azure Synapse Link for SQL change feed](/sql/sql-server/synapse-link/synapse-link-sql-server-change-feed).

## Monitor Azure Synapse Link for SQL Server 2022

You can monitor the status of your Azure Synapse Link connection, see which tables are being initially copied over (*snapshotting*), and see which tables are in continuous replication mode (*replicating*).

1. Go to the **Monitor hub** of your Azure Synapse workspace, and then select **Link connections**.

1. Open the link connection you started, and view the status of each table.

1. Select **Refresh** on the monitoring view for your connection to observe any updates to the status.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/monitor-link-connection.png" alt-text="Monitor the linked connection.":::

## Query the replicated data

Wait for a few minutes, and then check to ensure that the target database has the expected table and data. See the data available in your Azure Synapse SQL dedicated pool destination store. You can also now explore the replicated tables in your target Azure Synapse SQL dedicated pool.

1. In the **Data** hub, under **Workspace**, open your target database.

1. Under **Tables**, right-click one of your target tables.

1. Select **New SQL script**, and then select **Top 100 rows**.

1. Run this query to view the replicated data in your target Azure Synapse SQL dedicated pool.

1. You can also query the target database by using Microsoft SQL Server Management Studio (SSMS) or other tools. Use the SQL dedicated endpoint for your workspace as the server name. This name is usually `<workspacename>.sql.azuresynapse.net`. Add `Database=databasename@poolname` as an extra connection string parameter when connecting via SSMS or other tools.

## Add or remove a table in an existing Azure Synapse Link connection

To add or remove tables in Synapse Studio, do the following:

1. In your Azure Synapse workspace, open the **Integrate** hub.

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
   > If you restart a link connection after stopping it, it will start from a full initial load from your source database and incremental change feeds will follow.

## Rotate the shared access signature token for the landing zone

A shared access signature token is required for the SQL change feed to get access to the landing zone and push data there. It has an expiration date, so you need to rotate the token before that date. Otherwise, Azure Synapse Link will fail to replicate the data from the SQL Server instance to the Azure Synapse SQL dedicated pool.

1. In your Azure Synapse workspace, open the **Integrate** hub.

1. Select the link connection that you want to edit, and then open it.  

1. Select **Rotate token**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/link-connection-locate-rotate-token.png" alt-text="Screenshot that shows where to rotate a shared access signature token.":::

1. To get the new shared access signature token, select **Generate automatically** or **Input manually**, and then select **OK**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/landing-zone-rotate-sas-token.png" alt-text="Screenshot that shows how to get a new shared access signature token.":::

   > [!NOTE]
   > If you can’t connect to landing zone using generated SAS token due to limitation from your storage, you can try to use delegation SAS token to connect to landing zone as well. 


## Next steps

If you're using a database other than SQL Server 2022, see:

* [Configure Azure Synapse Link for Azure Cosmos DB](../../cosmos-db/configure-synapse-link.md?context=/azure/synapse-analytics/context/context)
* [Configure Azure Synapse Link for Dataverse](/powerapps/maker/data-platform/azure-synapse-link-synapse?context=/azure/synapse-analytics/context/context)
* [Get started with Azure Synapse Link for Azure SQL Database](connect-synapse-link-sql-database.md)
