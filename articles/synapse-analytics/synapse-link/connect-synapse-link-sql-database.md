---
title: Get started with Synapse Link for Azure SQL Database (Preview)
description: Learn how to connect an Azure SQL database to an Azure Synapse workspace with Azure Synapse Link (Preview).
author: SnehaGunda
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: synapse-link
ms.date: 05/24/2022
ms.author: sngun
ms.reviewer: sngun
---

# Get started with Synapse Link for Azure SQL Database (Preview)

This article provides a step-by-step guide for getting started with Azure Synapse Link for Azure SQL Database.

> [!IMPORTANT]
> Synapse Link for Azure SQL Database is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Synapse Link enables a seamless data pipeline between OLTP and OLAP platforms. It eliminates undesired burden on OLTP sources for real-time analytics which includes advanced BI and AI/ML processing.

Azure Synapse Link for Azure SQL Database enables a seamless and fully managed data pipeline from Azure SQL Databases to Synapse SQL Pools with one to one column and data type mapping. It adds minimum impact on source databases with a new change feed technology. Azure Synapse Link for Azure SQL Database supports an average minimum latency to publish incremental data changes from Azure SQL DB to Azure Synapse Link tables with full consistency. In a healthy state, it guarantees no data loss and transactional consistency at Synapse Link connection level for all the link tables.

If at any point you run into issues, check the [Known issues and restrictions page](./known-issues-restrictions-link-sql-db.md), then reach out to [SynapseLinkSQL@microsoft.com](mailto:SynapseLinkSQL@microsoft.com?subject=SQL%20DB%20-%20Private%20Preview%20issue).

## Prerequisites

* First, make sure your subscription, the source SQL logical server, and the database are whitelisted. If you are not sure email us at [SynapseLinkSQL@microsoft.com](mailto:SynapseLinkSQL@microsoft.com?subject=SQL%20DB%20-%20Private%20Preview%20allow%20list%20request). Please wait for a confirmation from the team before proceeding with the next steps.

* [Create a new Synapse workspace](https://ms.portal.azure.com/#create/Microsoft.Synapse) in the Azure subscription that has been added to the preview. To use this feature, currently you need to create a new Synapse workspace.

## Configure your source Azure SQL Database

1. Using Microsoft SQL Server Management Studio (SSMS) or Azure Data Studio, connect to the source Azure SQL Server with administrative privileges.

   :::image type="content" source="./media/connect-synapse-link-sql-database/ssms-connection.png" alt-text="Connect to SQL Server Management Studio with your login credentials.":::

1. Connect to your source SQL database. If you are using SSMS, expand **Databases**, right click the database you created above, and select **New Query**.

   :::image type="content" source="./media/connect-synapse-link-sql-database/ssms-new-query.png" alt-text="Select your database and create a new query.":::

1. If you want to have your Synapse workspace connect to your source Azure SQL Database using a [managed identity](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview), run the following script to provide the managed identity permission to the source database.

   **You can skip this step** if you instead want to have your Synapse workspace connect to your source Azure SQL Database via SQL authentication.

   ```sql
   CREATE USER workspacename FROM EXTERNAL PROVIDER;
   ALTER ROLE [db_owner] ADD MEMBER workspacename;
   ```

1. Create the master key for your source Azure SQL Database and create at least one new table. You can create a table with your own schema; the following is just an example for a `CREATE TABLE` query. You can also insert some rows into this table to ensure there is data to be replicated.

   ```sql
   CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<a new password>'
   CREATE TABLE myTestTable1 (c1 int primary key, c2 int, c3 nvarchar(50)) 
   ```

1. If it is not already enabled, enable the source Azure SQL server's system-assigned managed identity for your source logical server using [Azure PowerShell](https://shell.azure.com/). This managed identity will be used by your source Azure SQL server to send changes from the source database to your Synapse workspace.

   ```azurepowershell
   Set-AzSqlServer -ResourceGroupName <resource group name> -ServerName <source server name> -AssignIdentity
   ```

   :::image type="content" source="./media/connect-synapse-link-sql-database/powershell-enable-source-mi.png" alt-text="Enable source managed identity using Azure PowerShell.":::

   Then, run this to check that the system-assigned identity has been created:

   ```azurepowershell
   $x = Get-AzSqlServer -ResourceGroupName <resource group name> -ServerName <source server name>
   $x.Identity
   ```

   :::image type="content" source="./media/connect-synapse-link-sql-database/powershell-verify-source-mi.png" alt-text="Verify source managed identity using Azure PowerShell.":::

1. Make sure to update your source Azure SQL Database's firewall rules as needed, to allow access from your Synapse workspace. To do this within the Azure portal, navigate to the source Azure SQL Database, open **Firewalls and virtual networks**, then set **Allow Azure services and resources to access this server** to **Yes**.

   :::image type="content" source="./media/connect-synapse-link-sql-database/portal-sql-db-firewall.png" alt-text="Configure firewalls and virtual networks for your SQL DB using Azure portal.":::

## Create your target Synapse SQL pool and database

1. Launch [Synapse Studio](https://aka.ms/synapselinkpreview).

1. Open the **Manage** hub, navigate to **SQL pools**, and select **+ New**.

   :::image type="content" source="./media/connect-synapse-link-sql-database/studio-new-sql-pool.png" alt-text="Create a new SQL dedicated pool from Synapse Studio.":::

1. Enter a unique pool name, use the default settings, and create the dedicated pool.

1. While the pool is being created, navigate to the **Data** hub, select **+ New**, and select **Synapse SQL database**.

   :::image type="content" source="./media/connect-synapse-link-sql-database/studio-new-sql-database.png" alt-text="Create a new Synapse SQL database from Synapse Studio.":::

1. Select **Dedicated** and enter a name for your target Synapse SQL database.

1. Create the target database and schema. After the pool, database, and schema are created successfully, proceed to the next step.

1. From the **Data** hub, under **Workspace**, you should see your new Synapse SQL database listed under **Databases**. From your new Synapse SQL database, select **New SQL script**, then **Empty script**.

   :::image type="content" source="./media/connect-synapse-link-sql-database/studio-new-empty-sql-script.png" alt-text="Create a new empty SQL script from Synapse Studio.":::

1. Paste the folowing script and select **Run** to create the master key for your target Synapse SQL database.

   ```sql
   CREATE MASTER KEY
   ```

## Create the Synapse Link connection

1. Open the **Integrate** hub, and select **+ Link connection(Preview)**.

   :::image type="content" source="./media/connect-synapse-link-sql-database/studio-new-link-connection.png" alt-text="Select a new link connection from Synapse Studio.":::

1. Under **Source linked service**, select **New**.

   :::image type="content" source="./media/connect-synapse-link-sql-database/studio-new-linked-service-dropdown.png" alt-text="Select a new linked service.":::

1. Enter the information for your source Azure SQL Database.

   * Select the subscription, server, and database corresponding to your Azure SQL Database.
   * If you wish to connect your Synapse workspace to the source DB using the workspace’s managed identity, set **Authentication type** to **Managed Identity**.
   * If you wish to use SQL authentication instead and know the username/password to use, select **SQL Authentication** instead.

   > [!NOTE]
   > If you choose to use Managed Identity, please make sure you have completed **Step 6**.

   :::image type="content" source="./media/connect-synapse-link-sql-database/studio-new-linked-service.png" alt-text="Enter the server, database details to create a new linked service.":::

1. Select **Test connection** to ensure the firewall rules are properly configured and the workspace can successfully connect to the source Azure SQL Database.

1. Select **Save**.

1. Select one or more source tables to replicate to your Synapse workspace and select **Continue**.

   > [!NOTE]
   > A given source table can only be enabled in at most one link connection at a time. See the [Known issues and restrictions page](./known-issues-restrictions-link-sql-db.md) section to learn more about the supported data types.

1. Select a target Synapse SQL database and pool.

1. Provide a name for your Synapse Link connection.

1. Select the number of cores. These cores will be used for the movement of data from the source to the target.

   > [!NOTE]
   > We recommend starting low and increasing as needed.

1. Select **OK**.

1. With the new Synapse Link connection open, you can update the target table name, distribution type and structure type.

   * Consider heap table for structure type when your data contains `varchar(max)`, `nvarchar(max)`, and `varbinary(max)`.

   * Make sure the schema in your Synapse SQL pool has already been created before you start the link connection. Synapse link will help you to create tables automatically under your schema in Synapse SQL Pool.

   :::image type="content" source="./media/connect-synapse-link-sql-database/studio-edit-link.png" alt-text="Edit Synapse Link connection from Synapse Studio.":::

1. Select **Publish all** to save the new link connection to the service.

   :::image type="content" source="./media/connect-synapse-link-sql-database/studio-publish-all.png" alt-text="Select publish all to save the new link connection.":::

## Start the Synapse Link connection

1. Select **Start** and wait a few minutes for the data to be replicated.

   > [!NOTE]
   > When you complete the steps in this article, select **Stop** from the same screen. For now, continue with the rest of the guide.

## Validate and make updates to the Synapse Link connection

1. In the **Data** hub, under **Workspace**, open your target database, and within **Tables**, right-click one of your target tables. Choose **New SQL script**, then **Select TOP 100 rows**.

   :::image type="content" source="./media/connect-synapse-link-sql-database/studio-query-target-table.png" alt-text="Query target table for top 100 rows.":::

1. Run this query to check that the target database has the expected target table(s) and data.

1. Try making changes to your source table(s) in your source Azure SQL Database. You may also add additional tables to the source database.

1. To include new tables to your running connection, go back to the Synapse Link connection in the **Integrate** hub. Select **New table**, select your additional table(s), Save, and select **Publish all** to persist the change.

   :::image type="content" source="./media/connect-synapse-link-sql-database/studio-new-link-connection-table.png" alt-text="Include new tables into the link connection table.":::

## Monitor the status of the Synapse Link connection

You may monitor the status of your Synapse Link connection, see which tables are being initially copied over (Snapshotting), and see which tables are in continuous replication mode (Replicating).

1. Navigate to the **Monitor** hub, and select **Link connections**.

   :::image type="content" source="./media/connect-synapse-link-sql-database/studio-monitor-link-connections.png" alt-text="Monitor the status of Synapse Link connection from the monitor hub.":::

1. Open the Synapse Link connection you started and view the status of each table.

1. Select **Refresh** on the monitoring view for your connection to observe any updates to the status.

## Query replicated data

You may now explore the replicated tables in your target Synapse SQL database.

1. In the **Data** hub, under **Workspace**, open your target database, and within **Tables**, right-click one of your target tables.

1. Choose **New SQL script**, then **Select TOP 100 rows**.

   :::image type="content" source="./media/connect-synapse-link-sql-database/studio-query-target-table.png" alt-text="Query the target table.":::

1. Run this query to view the replicated data in your target Synapse SQL database.

1. You can also query the target database with SSMS (or other tools). Use the dedicated SQL endpoint for your workspace as the server name. This is typically `<workspacename>.sql.azuresynapse.net`. Add `Database=databasename@poolname` as an additional connection string parameter when connecting via SSMS (or other tools).

## Known issues and restrictions

The following is the list of known issues, restrictions, and limits for Synapse Link for Azure SQL Database. If you encounter an issue that is not documented in the following section, please reach out to the [SynapseLinkSQL@microsoft.com](mailto:SynapseLinkSQL@microsoft.com?subject=SQL%20DB%20-%20Private%20Preview%20issue) team.

Many of these are on our roadmap to address and may be supported in the future. However, we do not have any timelines for these at this point.

* Service principal and user-assigned managed identity is not supported for authenticating to source DB, so when creating Azure SQL linked service, please choose SQL Auth or Service Assigned Managed Identity (SAMI).

* VNet is not supported when creating Synapse workspace for private preview.

* Synapse Link CANNOT be enabled for Azure SQL DB tables in following conditions:

  * tables without a primary key.
  * tables with computed columns.
  * tables with column data types which are not supported by Azure Synapse including image, text, xml, timestamp, sql_variant, UDT, geometry, geography.
  * time(7) value “23:59:59.9999999” and datetime2(7) value “'9999-12-31 23:59:59.9999999” in source table

* Maximum 40,000 tables can be added to a single link connection in private preview.

* The following DDL operations are not allowed on tables which are enabled for Azure Synapse Link.

  * Switch partition, add/drop/alter column, alter PK, drop/truncate table, rename table is not allowed if the table is part of Synapse Link.

  * All other DDL operations are allowed, but not published to Synapse.

* If DDL + DML is executed in an explicit transaction (between Begin Transaction and End Transaction statements), replication for corresponding tables will fail within the link connection.

  > [!NOTE]
  > If a table is critical for transactional consistency at the topic level, please review the state of the Synapse Link table in the Monitoring tab.

* When source columns with type datetime2(7) and time(7) are replicated using Synapse Link,  the target columns will have last digit truncated.

* Synapse Link cannot be enabled if any of the following features are in use for the source Azure SQL database tables:

  * Transactional Replication
  * Change Data Capture
  * Hekaton, Column Store index, Graph table, temporal table.
  * Always encrypted.
  * Internal tables will not be replicated.
  * Security configuration of source will NOT be reflected to the target tables.
  * Change tracking can be used with Synapse Link side by side.

* S0 (Sub core) SLO on the source databases are not supported.
* Enabling Synpase Link will create a new schema on the DB as 'SynpaseLink', please do not use this schema name for your workload.
* In Synapse Studio, you may see error messages that mention `linkTopics` – this refers to `linkConnections`.
* When publishing a new link connection, you may see an error if the link connection name is already taken.
* When you pause Synapse SQL Pool, although you will see error message on UI, the link connection keep running and retrying to write data to Synapse SQL Pool until it is resumed.

## Next steps
