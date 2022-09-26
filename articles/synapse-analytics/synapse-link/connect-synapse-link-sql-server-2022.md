---
title: Create Azure Synapse Link for SQL Server 2022 (Preview)
description: Learn how to create and connect a SQL Server 2022 instance to an Azure Synapse workspace with Azure Synapse Link (Preview).
author: SnehaGunda
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: synapse-link
ms.custom: event-tier1-build-2022
ms.date: 05/09/2022
ms.author: sngun
ms.reviewer: sngun, wiassaf
---

# Get started with Azure Synapse Link for SQL Server 2022 (Preview)

This article provides a step-by-step guide for getting started with Azure Synapse Link for SQL Server 2022. For more information, see [Get started with Azure Synapse Link for SQL Server 2022 (Preview)](sql-server-2022-synapse-link.md). 

> [!IMPORTANT]
> Azure Synapse Link for SQL is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

* [Create a new Synapse workspace](https://portal.azure.com/#create/Microsoft.Synapse) to get Azure Synapse Link for SQL. Ensure to check "Disable Managed virtual network" and "Allow connections from all IP address" when creating Synapse workspace. If you have a workspace created after May 24, 2022, you do not need to create a new workspace.

* Create an Azure Data Lake Storage Gen2 account (different from the account created with the Azure Synapse Analytics workspace) used as the landing zone to stage the data submitted by SQL Server 2022. See [how to create a Azure Data Lake Storage Gen2 account](../../storage/blobs/create-data-lake-storage-account.md) article for more details.


* Make sure your database in SQL Server 2022 has a master key created.

   ```sql
   CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<a new password>'
   ```

## Create your target Synapse dedicated SQL pool

1. Launch [Synapse Studio](https://ms.web.azuresynapse.net/).

1. Open the **Manage** hub, navigate to **SQL pools**, and select **+ New**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-new-sql-pool.png" alt-text="Screenshot of creating a new SQL dedicated pool from Synapse Studio.":::

1. Enter a unique pool name, use the default settings, and create the dedicated pool.

1. From the **Data** hub, under **Workspace**, you should see your new Synapse SQL database listed under **Databases**. From your new Synapse SQL database, select **New SQL script**, then **Empty script**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/studio-new-empty-sql-script.png" alt-text="Screenshot of creating a new empty SQL script from Synapse Studio.":::

1. Paste the following script and select **Run** to create the master key for your target Synapse SQL database. You also need to create a schema if your expected schema is not available in target Synapse SQL database.

   ```sql
   CREATE MASTER KEY
   ```

## Create linked service for your source SQL Server 2022

1. Open the **Manage** hub, and navigate to **Linked services**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/studio-linked-service-navigation.png" alt-text="Navigate to linked services from Synapse studio.":::

1. Press **+ New**, select **SQL Server** and select **Continue**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/studio-linked-service-select.png" alt-text="Create a SQL server linked service.":::

1. Enter the **name** of linked service of SQL Server 2022.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/studio-linked-service-new.png" alt-text="Enter server and database names to connect.":::

1. When selecting the integration runtime, choose your **self-hosted integration runtime**. If your synapse workspace doesn't have self-hosted integration runtime available, create one.

1. Use the following steps to create a self-hosted integration runtime to connect to your source SQL Server 2022 (optional)

   * Select **+New**.

     :::image type="content" source="../media/connect-synapse-link-sql-server-2022/create-new-integration-runtime.png" alt-text="Creating a new self-hosted integration runtime.":::

   * Select **Self-hosted** and select **continue**.

   * Input the **name** of Self-hosted integration runtime and select **Create**.

     :::image type="content" source="../media/connect-synapse-link-sql-server-2022/input-name-integration-runtime.png" alt-text="Enter a name for the self-hosted integration runtime.":::

   * Now a self-hosted integration runtime is available in your Synapse workspace. Follow the prompts in the UI to **download**, **install** and use the key to **register** your integration runtime agent on your windows machine, which has direct access on your SQL Server 2022. For more information, see [Create a self-hosted integration runtime - Azure Data Factory & Azure Synapse](../../data-factory/create-self-hosted-integration-runtime.md?context=%2Fazure%2Fsynapse-analytics%2Fcontext%2Fcontext&tabs=synapse-analytics#install-and-register-a-self-hosted-ir-from-microsoft-download-center)

     :::image type="content" source="../media/connect-synapse-link-sql-server-2022/set-up-integration-runtime.png" alt-text="Download, install and register the integration runtime.":::

   * Select **Close**, and go to monitoring page to make sure your self-hosted integration runtime is running by selecting **refresh** to get the latest status of integration runtime.

     :::image type="content" source="../media/connect-synapse-link-sql-server-2022/integration-runtime-status.png" alt-text="Get the status of integration runtime.":::

1. Continue to input the rest information on your linked service including **SQL Server name**, **Database name**, **Authentication type**, **User name** and **Password** to connect to your SQL Server 2022.

   > [!NOTE]
   > We recommend that you enable encryption on this connection. To enable encryption, add the `Encrypt` property with a value of `true` as an Additional connection property, and also set the `Trust Server Certificate` property to either `true` or `false` - depending on your server configuration. For more information, see [Enable encrypted connections to the Database Engine](/sql/database-engine/configure-windows/enable-encrypted-connections-to-the-database-engine).

1. Select **Test Connection** to ensure your self-hosted integration runtime can access on your SQL Server.

1. Select **Create**, and you'll have your new linked service connecting to SQL Server 2022 available in your workspace.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/view-linked-service-connection.png" alt-text="View the linked service connection.":::

   > [!NOTE]
   > The linked service that you create here is not dedicated to Azure Synapse Link for SQL - it can be used by any workspace user that has the appropriate permissions. Please take time to understand the scope of users who may have access to this linked service and its credentials. For more information on permissions in Azure Synapse workspaces, see [Azure Synapse workspace access control overview - Azure Synapse Analytics](../security/synapse-workspace-access-control-overview.md).

## Create linked service to connect to your landing zone on Azure Data Lake Storage Gen2

1. Go to your created Azure Data Lake Storage Gen2 account, navigate to **Access Control (IAM)**, select **+Add**, and select **Add role assignment**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/adls-gen2-access-control.png" alt-text="Navigate to Access Control (IAM) of the Data Lake Storage Gen2 account.":::

1. Select **Storage Blob Data Contributor** for the selected role, choose **Managed identity** in Managed identity, and select your Synapse workspace in **Members**. This may take a few minutes to take effect to add role assignment.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/adls-gen2-assign-blob-data-contributor-role.png" alt-text="Add a role assignment.":::

   > [!NOTE]
   > Make sure that you have granted your Synapse workspace managed identity permissions to ADLS Gen2 storage account used as the landing zone. For more information, see how to [Grant permissions to managed identity in Synapse workspace - Azure Synapse Analytics](../security/how-to-grant-workspace-managed-identity-permissions.md#grant-the-managed-identity-permissions-to-adls-gen2-storage-account)

1. Open the **Manage** hub in your Synapse workspace, and navigate to **Linked services**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/studio-linked-service-navigation.png" alt-text="Navigate to the linked service.":::

1. Press **+ New** and select **Azure Data Lake Storage Gen2**.

1. Input the following settings:

    * Enter the **name** of linked service for your landing zone.

    * Input **Authentication method**, and it must be **Managed Identity**.

    * Select the **Storage account name** which had already been created.  

1. Select **Test Connection** to ensure you get access on your Azure Data Lake Storage Gen2.

1. Select **Create** and you'll have your new linked service connecting to Azure Data Lake Storage Gen2.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/storage-gen2-linked-service-created.png" alt-text="New linked service to Azure Data Lake Storage Gen2.":::

   > [!NOTE]
   > The linked service that you create here is not dedicated to Azure Synapse Link for SQL - it can be used by any workspace user that has the appropriate permissions. Please take time to understand the scope of users who may have access to this linked service and its credentials. For more information on permissions in Azure Synapse workspaces, see [Azure Synapse workspace access control overview - Azure Synapse Analytics](../security/synapse-workspace-access-control-overview.md).

## Create the Azure Synapse Link connection

1. From the Synapse studio, open the **Integrate** hub, and select **+Link connection(Preview)**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/new-link-connection.png" alt-text="New link connection.":::

1. Input your source database:

    * Select Source type to **SQL Server**.

    * Select your source **linked service** to connect to your SQL Server 2022.

    * Select **table names** from your SQL Server to be replicated to your Synapse SQL pool.

    * Select **Continue**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/input-source-database-details-link-connection.png" alt-text="Input source database details.":::

1. Select a target database name from **Synapse SQL Dedicated Pools**. 

1. Select **Continue**.

1. Input your link connection settings:

   * Input your **link connection name**.

   * Select your **Core count** for the [link connection compute](sql-server-2022-synapse-link.md#link-connection). These cores will be used for the movement of data from the source to the target. We recommend starting from small number and increasing as needed.

   * Configure your landing zone. Select your **linked service** connecting to your landing zone.

   * Input your ADLS Gen2 **container name or container/folder name** as landing zone folder path for staging the data. The container is required to be created first.

   * Input your ADLS Gen2 shared access signature (SAS) token. SAS token is required for SQL change feed to get access on landing zone. If your ADLS Gen2 doesn't have SAS token, you can create one by selecting **+Generate token**.

   * Select **OK**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/link-connection-compute-settings.png" alt-text="Input the link connection settings.":::

1. With the new Azure Synapse Link connection open, you have chance to update the target table name, distribution type and structure type.

   > [!NOTE]
   > * Consider heap table for structure type when your data contains varchar(max), nvarchar(max), and varbinary(max).
   > * Make sure the schema in your Synapse SQL pool has already been created before you start the link connection. Azure Synapse Link will help you to create tables automatically under your schema in Azure Synapse SQL Pool.

1. Select **Publish all** to save the new link connection to the service.

## Start the Azure Synapse Link connection

1. Select **Start** and wait a few minutes for the data to be replicated.

   > [!NOTE]
   > When being started, a link connection will start from a full initial load from your source database followed by incremental change feeds via the change feed feature in SQL Server 2022. For more information, see [Azure Synapse Link for SQL change feed](/sql/sql-server/synapse-link/synapse-link-sql-server-change-feed).

## Monitor Azure Synapse Link for SQL Server 2022

You may monitor the status of your Azure Synapse Link connection, see which tables are being initially copied over (Snapshotting), and see which tables are in continuous replication mode (Replicating).

1. Navigate to the **Monitor hub** of your Synapse workspace.

1. Select **Link connections**.

1. Open the link connection you started and view the status of each table.

1. Select **Refresh** on the monitoring view for your connection to observe any updates to the status.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/monitor-link-connection.png" alt-text="Monitor the linked connection.":::

## Query replicated data

Wait for a few minutes, then check the target database has the expected table and data. See the data available in your Synapse dedicated SQL pool destination store. You can also now explore the replicated tables in your target Synapse dedicated SQL pool.

1. In the **Data** hub, under **Workspace**, open your target database, and within **Tables**, right-click one of your target tables.

1. Choose **New SQL script**, then **Select TOP 100 rows**.

1. Run this query to view the replicated data in your target Synapse dedicated SQL pool.

1. You can also query the target database with SSMS (or other tools). Use the dedicated SQL endpoint for your workspace as the server name. This is typically `<workspacename>.sql.azuresynapse.net`. Add `Database=databasename@poolname` as an extra connection string parameter when connecting via SSMS (or other tools).

## Add/remove table in existing Azure Synapse Link connection

You can add/remove tables on Synapse Studio as follows:

1. Open the **Integrate Hub**.

1. Select the **Link connection** you want to edit and open it.  

1. Select **+New** table to add tables on Synapse Studio or select the trash can icon to the right of a table to remove an existing table. You can add or remove tables when the link connection is running.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/link-connection-add-remove-tables.png" alt-text="Link connection add table.":::

   > [!NOTE]
   > You can directly add or remove tables when a link connection is running.
   
## Stop the Azure Synapse Link connection

You can stop the Azure Synapse Link connection on Synapse Studio as follows:

1. Open the **Integrate Hub** of your Synapse workspace.

1. Select the **Link connection** you want to edit and open it.  

1. Select **Stop** to stop the link connection, and it will stop replicating your data.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/stop-link-connection.png" alt-text="Link connection stop link.":::

   > [!NOTE]
   > If you restart a link connection after stopping it, it will start from a full initial load from your source database followed by incremental change feeds.

## Rotate the SAS token for landing zone

A SAS token is required for SQL change feed to get access to the landing zone and push data there. It has an expiration date so you need to rotate the SAS token before the expiration date. Otherwise, Azure Synapse Link will fail to replicate the data from SQL Server to the Synapse dedicated SQL pool.

1. Open the **Integrate Hub** of your Synapse workspace.

1. Select the **Link connection** you want to edit and open it.  

1. Select **Rotate token**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/link-connection-locate-rotate-token.png" alt-text="Rotate S A S token.":::

1. Select **Generate automatically** or **Input manually** to get the new SAS token, and then select **OK**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/landing-zone-rotate-sas-token.png" alt-text="Get the new S A S token.":::


## Next steps

If you are using a different type of database, see how to:

* [Configure Azure Synapse Link for Azure Cosmos DB](../../cosmos-db/configure-synapse-link.md?context=/azure/synapse-analytics/context/context)
* [Configure Azure Synapse Link for Dataverse](/powerapps/maker/data-platform/azure-synapse-link-synapse?context=/azure/synapse-analytics/context/context)
* [Get started with Azure Synapse Link for Azure SQL Database](connect-synapse-link-sql-database.md)
