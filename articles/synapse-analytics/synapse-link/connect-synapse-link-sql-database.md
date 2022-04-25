---
title: Get started with Synapse Link for Azure SQL Database (Preview)
description: Learn how to connect an Azure SQL database to an Azure Synapse workspace with Azure Synapse Link (Preview).
author: SnehaGunda
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: synapse-link
ms.date: 04/24/2022
ms.author: sngun
ms.reviewer: sngun
---

# Get started with Synapse Link for Azure SQL Database (Preview)

This article provides a step-by-step guide for getting started with Azure Synapse Link for Azure SQL Database.

> [!IMPORTANT]
> Synapse Link for Azure SQL Database is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

* [Create a new Synapse workspace](https://ms.portal.azure.com/#create/Microsoft.Synapse) to get Synapse link for Azure SQL Database.

## Configure your source Azure SQL Database

1. Using Microsoft SQL Server Management Studio (SSMS) or Azure Data Studio, connect to the source Azure SQL Server with administrative privileges.

   :::image type="content" source="../media/connect-synapse-link-sql-database/connect-sql-server-management-studio.png" alt-text="Connect to SQL Server Management Studio with your log in credentials.":::

2. Connect to your source SQL database. If you're using SSMS, expand **Databases**, right select the database you created above, and select **New Query**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/ssms-new-query.png" alt-text="Select your database and create a new query.":::

3. If you want to have your Synapse workspace connect to your source Azure SQL Database using a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md), run the following script to provide the managed identity permission to the source database.

   **You can skip this step** if you instead want to have your Synapse workspace connect to your source Azure SQL Database via SQL authentication.

   ```sql
   CREATE USER workspacename FROM EXTERNAL PROVIDER;
   ALTER ROLE [db_owner] ADD MEMBER workspacename;
   ```

4. You can create a table with your own schema; the following is just an example for a `CREATE TABLE` query. You can also insert some rows into this table to ensure there's data to be replicated.

   ```sql
   CREATE TABLE myTestTable1 (c1 int primary key, c2 int, c3 nvarchar(50)) 
   ```

5. If it isn't already enabled, enable the source Azure SQL server's system-assigned managed identity for your source logical server using [Azure PowerShell](https://shell.azure.com/). This managed identity will be used by your source Azure SQL server to send changes from the source database to your Synapse workspace.

   ```azurepowershell
   Set-AzSqlServer -ResourceGroupName <resource group name> -ServerName <source server name> -AssignIdentity
   ```

   Then, run this to check that the system-assigned identity has been created:

   ```azurepowershell
   $x = Get-AzSqlServer -ResourceGroupName <resource group name> -ServerName <source server name>
   $x.Identity
   ```

6. Make sure to update your source Azure SQL Database's firewall rules as needed, to allow access from your Synapse workspace. To do this within the Azure portal, navigate to the source Azure SQL Database, open **Firewalls and virtual networks**, then set **Allow Azure services and resources to access this server** to **Yes**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/configure-firewall-sql-database.png" alt-text="Configure firewalls and virtual networks for your SQL DB using Azure portal.":::

## Create your target Synapse SQL pool and database

1. Launch Synapse Studio

2. Open the **Manage** hub, navigate to **SQL pools**, and select **+ New**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-new-sql-pool.png" alt-text="Create a new SQL dedicated pool from Synapse Studio.":::

3. Enter a unique pool name, use the default settings, and create the dedicated pool.

4. While the pool is being created, navigate to the **Data** hub, select **+ New**, and select **Synapse SQL database**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-new-sql-database.png" alt-text="Create a new Synapse SQL database from Synapse Studio.":::

5. Select **Dedicated** and enter a name for your target Synapse SQL database.

6. Create the target database and schema. After the pool, database, and schema are created successfully, proceed to the next step.

7. From the **Data** hub, under **Workspace**, you should see your new Synapse SQL database listed under **Databases**. From your new Synapse SQL database, select **New SQL script**, then **Empty script**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-new-empty-sql-script.png" alt-text="Create a new empty SQL script from Synapse Studio.":::

8. Paste the following script and select **Run** to create the master key for your target Synapse SQL database.

   ```sql
   CREATE MASTER KEY
   ```

## Create the Synapse Link connection

1. Open the **Integrate** hub, and select **+ Link connection(Preview)**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-new-link-connection.png" alt-text="Select a new link connection from Synapse Studio.":::

2. Under **Source linked service**, select **New**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-new-linked-service-dropdown.png" alt-text="Select a new linked service.":::

3. Enter the information for your source Azure SQL Database.

   * Select the subscription, server, and database corresponding to your Azure SQL Database.
   * If you wish to connect your Synapse workspace to the source DB using the workspace’s managed identity, set **Authentication type** to **Managed Identity**.
   * If you wish to use SQL authentication instead and know the username/password to use, select **SQL Authentication** instead.

   > [!NOTE]
   > If you choose to use Managed Identity, please make sure you have completed **Step 6**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-new-linked-service.png" alt-text="Enter the server, database details to create a new linked service.":::

4. Select **Test connection** to ensure the firewall rules are properly configured and the workspace can successfully connect to the source Azure SQL Database.

5. Select **Save**.

6. Select one or more source tables to replicate to your Synapse workspace and select **Continue**.

   > [!NOTE]
   > A given source table can only be enabled in at most one link connection at a time. See the [Known issues and restrictions page](#known-issues) section to learn more about the supported data types.

7. Select a target Synapse SQL database and pool.

8. Provide a name for your Synapse Link connection.

9. Select the number of cores. These cores will be used for the movement of data from the source to the target.

   > [!NOTE]
   > We recommend starting low and increasing as needed.

10. Select **OK**.

11. With the new Synapse Link connection open, you can update the target table name, distribution type and structure type.

   * Consider heap table for structure type when your data contains `varchar(max)`, `nvarchar(max)`, and `varbinary(max)`.

   * Make sure the schema in your Synapse SQL pool has already been created before you start the link connection. Synapse link will help you to create tables automatically under your schema in Synapse SQL Pool.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-edit-link.png" alt-text="Edit Synapse Link connection from Synapse Studio.":::

12. Select **Publish all** to save the new link connection to the service.

## Start the Synapse Link connection

1. Select **Start** and wait a few minutes for the data to be replicated.

   > [!NOTE]
   > When you complete the steps in this article, select **Stop** from the same screen. For now, continue with the rest of the guide.

## Validate and make updates to the Synapse Link connection

1. In the **Data** hub, under **Workspace**, open your target database, and within **Tables**, right-click one of your target tables. Choose **New SQL script**, then **Select TOP 100 rows**.

2. Run this query to check that the target database has the expected target table(s) and data.

3. Try making changes to your source table(s) in your source Azure SQL Database. You may also add more tables to the source database.

4. To include new tables to your running connection, go back to the Synapse Link connection in the **Integrate** hub. Select **New table**, select your other table(s), Save, and select **Publish all** to persist the change.

## Monitor the status of the Synapse Link connection

You may monitor the status of your Synapse Link connection, see which tables are being initially copied over (Snapshotting), and see which tables are in continuous replication mode (Replicating).

1. Navigate to the **Monitor** hub, and select **Link connections**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-monitor-link-connections.png" alt-text="Monitor the status of Synapse Link connection from the monitor hub.":::

2. Open the Synapse Link connection you started and view the status of each table.

3. Select **Refresh** on the monitoring view for your connection to observe any updates to the status.

## Query replicated data

You may now explore the replicated tables in your target Synapse SQL database.

1. In the **Data** hub, under **Workspace**, open your target database, and within **Tables**, right-click one of your target tables.

2. Choose **New SQL script**, then **Select TOP 100 rows**.

3. Run this query to view the replicated data in your target Synapse SQL database.

4. You can also query the target database with SSMS (or other tools). Use the dedicated SQL endpoint for your workspace as the server name. This is typically `<workspacename>.sql.azuresynapse.net`. Add `Database=databasename@poolname` as another connection string parameter when connecting via SSMS (or other tools).

## <a name="known-issues"></a>Known issues and restrictions

The following is the list of known issues, restrictions, and limits for Synapse Link for Azure SQL Database. If you encounter an issue that isn't documented in the following section, please reach out to the [SynapseLinkSQL@microsoft.com](mailto:SynapseLinkSQL@microsoft.com?subject=SQL%20DB%20-%20Private%20Preview%20issue) team.

Many of these are on our road map to address and may be supported in the future. However, we don't have any timelines for these at this point.

* Users must create new Synapse workspace to get Synapse link for SQL DB. 

* Synapse link for SQL DB is not supported on Free, Basic or Standard tier (S0,S1,S2) in Azure SQL database. Users need to use Azure SQL databases tiers above Standard 3.

* Synapse link for SQL DB can not be used in virtual network environment. Users need to check “Allow Azure Service and resources to access to this server” on Azure SQL database and check “Allow connections from all IP address” for Synapse workspace.

* User need to manually create schema in destination Synapse SQL pool in advance, as target database schema object will not be automatically created in data replication. 

* Service principal and user-assigned managed identity are not supported for authenticating to source Azure SQL DB, so when creating Azure SQL DB linked service, please choose SQL auth or service assigned managed Identity (SAMI).

* Synapse Link for Azure SQL DB CANNOT be enabled for source tables in Azure SQL DB in following conditions:

  * Source table do not have primary keys.
  * The PK columns in source tables contain the unsupported data types including real and float.  
  * Source table row size exceeds the limit of 7500 bytes. 

* When SQL DB owner does not have a mapped login, Synapse link for SQL DB will run into error when enabling a link connection. User can set database owner to sa to fix this.

* The computed columns and the column containing unsupported data types by Synapse SQL Pool including image, text, xml, timestamp, sql_variant, UDT, geometry, geography in source tables in Azure SQL DB will be skipped, and not to replicate to the Synapse SQL Pool.

* Maximum 5000 tables can be added to a single link connection.

* When source columns with type datetime2(7) and time(7) are replicated using Synapse Link, the target columns will have last digit truncated.

* The following DDL operations are not allowed on source tables in Azure SQL DB which are enabled for Synapse Link for Azure SQL DB.

  * Switch partition, add/drop/alter column, alter PK, drop/truncate table, rename table are not allowed if the tables have been added into a running link connection of Synapse Link for Azure SQL DB. 
  * All other DDL operations are allowed, but those DDL operations will not be replicated to the Synapse SQL Pool.

* If DDL + DML is executed in an explicit transaction (between Begin Transaction and End Transaction statements), replication for corresponding tables will fail within the link connection.

  > [!NOTE]
  > If a table is critical for transactional consistency at the link connection level, please review the state of the Synapse Link table in the Monitoring tab.

* Synapse Link for SQL DB cannot be enabled if any of the following features are in use for the source tables in Azure SQL database:

  * Transactional Replication
  * Change Data Capture
  * Hekaton, Column Store index, Graph table, temporal table.
  * Always encrypted
	
* System tables in SQL database will not be replicated.
* Security configuration of Azure SQL database will NOT be reflected to Synapse SQL Pool. 
* Enabling Synpase Link will create a new schema on the Azure SQL DB as 'changefeed', please do not use this schema name for your workload.
* Source tables with non-default collations: UTF8, Japanese can not be replicated ot Synapse. Here is the [supported collations in Synapse SQL Pool](https://docs.microsoft.com/en-us/azure/synapse-analytics/sql/reference-collation-types).

## Next steps

If you are using a different type of database, see how to:

* [Configure Synapse Link for Azure Cosmos DB](../../cosmos-db/configure-synapse-link.md?context=/azure/synapse-analytics/context/context)
* [Configure Synapse Link for Dataverse](/powerapps/maker/data-platform/azure-synapse-link-synapse?context=/azure/synapse-analytics/context/context)