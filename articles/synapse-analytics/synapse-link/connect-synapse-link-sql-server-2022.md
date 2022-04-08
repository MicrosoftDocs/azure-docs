---
title: Create Synapse Link for SQL Server 2022 (Preview)
description: Learn how to create and connect a SQL Server 2022 instance to an Azure Synapse workspace with Azure Synapse Link (Preview).
author: SnehaGunda
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: synapse-link
ms.date: 04/24/2022
ms.author: sngun
ms.reviewer: sngun
---

# Get started with Synapse Link for SQL Server 2022 (Preview)

This article provides a step-by-step guide for getting started with Azure Synapse Link for SQL Server 2022.

> [!IMPORTANT]
> Synapse Link for Azure SQL Database is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Initial setup

* First, add your test subscription to the Private Preview of Synapse Link for SQL Server 2022 by emailing us at [SynapseLinkSQL@microsoft.com](mailto:SynapseLinkSQL@microsoft.com?subject=SQL%20DB%20-%20Private%20Preview%20allow%20list%20request). In the email, include the Azure region that will be hosting your Synapse Workspace. Wait for the confirmation from the product group before moving to the next step.

* [Create a new Synapse workspace](https://portal.azure.com/#create/Microsoft.Synapse) in the Azure subscription that has been added to the preview. To use this feature, currently you need to create a new Synapse workspace for the subscription and the region you requested to enable private preview.

* You need to create an Azure Data Lake Storage Gen2 account of type *block blob* used as the landing zone to stage the data submitted by SQL Server 2022. See [how to create a Azure Data Lake Storage Gen2 account](../../storage/blobs/create-data-lake-storage-account.md) article for more details.

* Start SQL Server 2022 with the following trace flags `-T13800 -T12701 -T12711 -T4511 –T13803` to enable Synapse Link.

* Make sure the source database has master key created.

   ```sql
   CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<a new password>'
   ```

## Create the Synapse Link connection in your workspace

1. Launch [Synapse Studio](https://aka.ms/synapselinkpreview).

### Create linked service for your source SQL Server 2022

1. Open the **Manage** hub, and navigate to **Linked services**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/studio-linked-service-navigation.png" alt-text="Navigate to linked services from Synapse studio":::

1. Press **+ New**, select **SQL Server** and select **Continue**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/studio-linked-service-select.png" alt-text="Create a SQL server linked service":::

1. Enter the **name** of linked service of SQL Server 2022.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/studio-linked-service-new.png" alt-text="Enter server and database names to connect":::

1. When selecting the integration runtime, choose your **self-hosted integration runtime**. If your synapse workspace doesn't have self-hosted integration runtime available, create one.

1. Use the following steps to create a self-hosted integration runtime to connect to your source SQL Server 2022 (optional)

   * Select **+New**.

     :::image type="content" source="../media/connect-synapse-link-sql-server-2022/create-new-integration-runtime.png" alt-text="Creating a new self-hosted integration runtime.":::

   * Select **Self-hosted** and select **continue**.

   * Input the **name** of Self-hosted integration runtime and select **Create**.

     :::image type="content" source="../media/connect-synapse-link-sql-server-2022/input-name-integration-runtime.png" alt-text="Enter a name for the self-hosted integration runtime.":::

   * Now a self-hosted integration runtime is available in your Synapse workspace. Follow the prompts in the UI to **download**, **install** and use the key to **register** your integration runtime agent on your windows machine, which has direct access on your SQL Server 2022. For more information, see [Create a self-hosted integration runtime - Azure Data Factory & Azure Synapse](../../data-factory/create-self-hosted-integration-runtime.md?context=%2Fazure%2Fsynapse-analytics%2Fcontext%2Fcontext&tabs=synapse-analytics#install-and-register-a-self-hosted-ir-from-microsoft-download-center)

     :::image type="content" source="../media/connect-synapse-link-sql-server-2022/set-up-integration-runtime.png" alt-text="Download, install and register the integration runtime.":::

   * Select **Close**, and go to monitoring page to make sure your self-hosted integration runtime is running by clicking **refresh** to get the latest status of integration runtime.

     :::image type="content" source="../media/connect-synapse-link-sql-server-2022/integration-runtime-status.png" alt-text="Get the status of integration runtime.":::

1. Continue to input the rest information on your linked service including **SQL Server name**, **Database name**, **Authentication type**, **User name** and **Password** to connect to your SQL Server 2022.

1. Select **Test Connection** to ensure your self-hosted integration runtime can access on your SQL Server.

1. Select **Create**, and you'll have your new linked service connecting to SQL Server 2022 available in your workspace.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/view-linked-service-connection.png" alt-text="View the linked service connection.":::

### Create linked service to connect to your landing zone on Azure Data Lake Storage Gen2

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

### Create and start your Synapse Link connection

1. From the Synapse studio, open the **Integrate** hub, and select **+Link connection(Preview)**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/new-link-connection.png" alt-text="New link connection.":::

1. Input your source database:

    * Select Source type to **SQL Server**.

    * Select your source **linked service** to connect to you SQL Server 2022.

    * Select **table names** from your SQL Server to be replicated to your Synapse SQL pool.

    * Select **Continue**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/input-source-database-details-link-connection.png" alt-text="Input source database details.":::

1. Input your destination database. Select a target database name from **Synapse SQL Dedicated Pools V2**. Make sure the target database has a master key by running the following command:

   ```sql
   CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'a new password'
   ```

1. Select **Continue**.

1. Input your link connection settings:

   * Input your **link connection name**.

   * Select your **Core count**. We recommend starting from small number and increasing as needed.

   * Configure your landing zone. Select your **linked service** connecting to your landing zone.

   * Input your ADLS gen2 **container name or container/folder name** as landing zone folder path for staging the data. The container is required to be created first.

   * Input your ADLS gen2 SAS token. SAS token is required for SQL change feed to get access on landing zone. If your ADLS gen2 doesn't have SAS token, you can create one by clicking **+Generate token**.

   * Select **OK**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/link-connection-compute-settings.png" alt-text="Input the link connection settings.":::

1. With the new Synapse Link connection open, you have chance to update the target table name, distribution type and structure type.

   > [!NOTE]
   > * Consider heap table for structure type when your data contains varchar(max), nvarchar(max), and varbinary(max).
   > * Make sure the schema in your Synapse SQL pool has already been created before you start the link connection. Synapse link will help you to create tables automatically under your schema in Synapse SQL Pool.

1. Select **Publish all** to save the new link connection to the service.

1. With the new Synapse Link connection open, select **Start**.  We recommend starting from small number and increasing as needed.

## Monitor Synapse Link for SQL Server 2022

Wait for few more minutes, then check the target database has the expected table and data. See the data available in your Synapse SQL gen2 destination store.

The SLA for starting the link connection is 5 min. If the link connection didn't move to Running state within 5 min, then this isn't an expected state, please file a bug by following the instructions below. Once the state of the link connection is Running, data should be replicated in target tables.

You can make changes to the source tables in your Azure SQL Database, and you may also add extra tables to the source database.

You may monitor the status of your Synapse Link connection, see which tables are being initially copied over (Snapshotting), and see which tables are in continuous replication mode (Replicating).

1. Navigate to the **Monitor hub** of your Synapse workspace.

1. Select **Link connections**.

1. Open the link connection you started and view the status of each table.

1. Select **Refresh** on the monitoring view for your connection to observe any updates to the status.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/monitor-link-connection.png" alt-text="Monitor the linked connection.":::

## Query replicated data

You may now explore the replicated tables in your target Synapse SQL database.

1. In the **Data** hub, under **Workspace**, open your target database, and within **Tables**, right-click one of your target tables.

1. Choose **New SQL script**, then **Select TOP 100 rows**.

1. Run this query to view the replicated data in your target Synapse SQL database.

1. You can also query the target database with SSMS (or other tools). Use the dedicated SQL endpoint for your workspace as the server name. This is typically `<workspacename>.sql.azuresynapse.net`. Add `Database=databasename@poolname` as an extra connection string parameter when connecting via SSMS (or other tools).

## Add/remove table in existing Synapse Link connection

You can add/remove tables on Synapse Studio as following:

1. Open the **Integrate Hub**.

1. Select the **Link connection** you want to edit and open it.  

1. Select **+New** table to add tables on Synapse Studio or remove the existing tables.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/link-connection-add-remove-tables.png" alt-text="Link connection add table.":::

## Stop the Synapse Link connection

You can stop the Synapse link connection on Synapse Studio as following:

1. Open the **Integrate Hub** of your Synapse workspace.

1. Select the **Link connection** you want to edit and open it.  

1. Select **Stop** to stop the Synapse link for SQL 2022.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/stop-link-connection.png" alt-text="Link connection stop lin.k":::

## Rotate the SAS token for landing zone

SAS token is required for SQL change feed to get access on landing zone and push data there. It has expiry date so that you need to rotate the SAS token before the expiry date. Otherwise, Synapse link will fail to replicate the data from SQL Server to Synapse SQL pool.

1. Open the **Integrate Hub** of your Synapse workspace.

1. Select the **Link connection** you want to edit and open it.  

1. Select **Rotate token**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/link-connection-locate-rotate-token.png" alt-text="Rotate SAS token":::

1. Select **Generate automatically** or **Input manually** to get the new SAS token, and then select **OK**.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/landing-zone-rotate-sas-token.png" alt-text="Get the new SAS token.":::

## Limitations

There are some temporary limitations we're aware of and working on to remove them in further CTPs, please see the list below.

* When creating SQL Server linked service, please choose SQL Auth or Windows Auth.

* VNet isn't supported when creating Synapse workspace for private preview.  

* Synapse Link isn't supported with SQL Server on Linux.

* Synapse Link CANNOT be enabled for SQL Server tables in following conditions:

  * Tables without a primary key.

  * Tables with computed columns.

  * Tables with column data types, which aren't supported by Azure Synapse including image, text, xml, timestamp, sql_variant, UDT, geometry, geography.

  * Time(7) value “23:59:59.9999999” and datetime2(7) value “'9999-12-31 23:59:59.9999999” in source table  

  * Maximum 40,000 tables can be added to a single link connection in private preview.

* The following DDL operations aren't allowed on tables, which are enabled for Azure Synapse Link.  

  * Add/Drop/Alter Column, Switch partition, alter PK, drop/truncate table, rename table isn't allowed if the table is part of Synapse Link.  

  * All other DDL operations are allowed, but not published to Synapse at this time.  

  * If DDL + DML is executed in an explicit transaction (between Begin Transaction and End Transaction statements), replication for corresponding tables will fail within the link connection.

   > [!NOTE]
   > If a table is critical for transactional consistency at the topic level, please review the state of the Synapse Link table in the Monitoring tab.

* When source columns with type datetime2(7) and time(7) are replicated using Synapse Link,  the target columns will have last digit truncated.

* Synapse Link can't be enabled if any of the following features are in use for the source SQL Server tables:

  * Transactional Replication
  * Change Data Capture
  * Hekaton, Column Store index, Graph table, temporal table.
  * Always encrypted.  

* Internal tables won't be replicated.  

* Security configuration of source will NOT be reflected to the target tables.

* Change tracking can be used with Synapse Link side by side.

* Sub core SLOs on the source databases aren't supported.

* In Synapse Studio, you may see error messages that mention `linkTopics` – this refers to `linkConnections`.

* When publishing a new link connection, you may see an error if the link connection name is already taken.

* Source string value can't contain the double quote character if link table is in Synapse SQL gen2.

* Tables with non-default collations: UTF8, Japanese cannot be replicated ot Synapse.

* SQL Server can be part of a VNET, but the landing zone should be configured with public endpoint for this scenario.

* When you pause Synapse SQL Pool, although you'll see error message on UI, the link connection keep running and retrying to write data to Synapse SQL Pool until it's resumed.

## Next steps

* [SQL Server Change Feed Feature](https://github.com/microsoft/SQLEAP/blob/main/docs/synapse-link/sql-server-change-feed-feature.md)
* [SQL Server Change Feed Stored Procedures and DMVs](https://github.com/microsoft/SQLEAP/blob/main/docs/synapse-link/sql-server-change-feed-interface.md) 
