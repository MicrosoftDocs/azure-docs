---
title: Get started with Azure Synapse Link for Azure SQL Database (Preview)
description: Learn how to connect an Azure SQL database to an Azure Synapse workspace with Azure Synapse Link (Preview).
author: SnehaGunda
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: synapse-link
ms.date: 04/24/2022
ms.author: sngun
ms.reviewer: sngun
---

# Get started with Azure Synapse Link for Azure SQL Database (Preview)

This article provides a step-by-step guide for getting started with Azure Synapse Link for Azure SQL Database.

> [!IMPORTANT]
> Azure Synapse Link for Azure SQL Database is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

* [Create a new Synapse workspace](https://ms.portal.azure.com/#create/Microsoft.Synapse) to get Azure Synapse Link for Azure SQL Database. Ensure to check “Disable Managed virtual network” and “Allow connections from all IP address” when creating Synapse workspace.

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

1. Launch [Synapse Studio](https://ms.web.azuresynapse.net/).

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
   * If you wish to connect your Synapse workspace to the source DB using the workspace’s managed identity, set **Authentication type** to **Managed Identity**.
   * If you wish to use SQL authentication instead and know the username/password to use, select **SQL Authentication** instead.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-new-linked-service.png" alt-text="Enter the server, database details to create a new linked service.":::

1. Select **Test connection** to ensure the firewall rules are properly configured and the workspace can successfully connect to the source Azure SQL Database.

1. Select **Create**.

1. Select one or more source tables to replicate to your Synapse workspace and select **Continue**.

   > [!NOTE]
   > A given source table can only be enabled in at most one link connection at a time. See the [Known issues and restrictions page](#known-issues) section to learn more about the supported data types.

1. Select a target Synapse SQL database and pool.

1. Provide a name for your Azure Synapse Link connection, and select the number of cores. These cores will be used for the movement of data from the source to the target.

   > [!NOTE]
   > We recommend starting low and increasing as needed.

1. Select **OK**.

1. With the new Azure Synapse Link connection open, you can update the target table name, distribution type and structure type.

   > [!NOTE]
   > * Consider heap table for structure type when your data contains varchar(max), nvarchar(max), and varbinary(max).
   > * Make sure the schema in your Synapse SQL pool has already been created before you start the link connection. Azure Synapse Link will help you to create tables automatically under your schema in Synapse SQL Pool.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-edit-link.png" alt-text="Edit Azure Synapse Link connection from Synapse Studio.":::

1. Select **Publish all** to save the new link connection to the service.

## Start the Azure Synapse Link connection

1. Select **Start** and wait a few minutes for the data to be replicated.

   > [!NOTE]
   > When being started, a link connection will start from a full initial load from your source database followed by incremental change feeds via the change feed feature in Azure SQL database.

## Monitor the status of the Azure Synapse Link connection

You may monitor the status of your Azure Synapse Link connection, see which tables are being initially copied over (Snapshotting), and see which tables are in continuous replication mode (Replicating).

1. Navigate to the **Monitor** hub, and select **Link connections**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/studio-monitor-link-connections.png" alt-text="Monitor the status of Azure Synapse Link connection from the monitor hub.":::

1. Open the Azure Synapse Link connection you started and view the status of each table.

1. Select **Refresh** on the monitoring view for your connection to observe any updates to the status.

## Query replicated data

Wait for a few minutes, then check the target database has the expected table and data. You can also now explore the replicated tables in your target Synapse SQL database.

1. In the **Data** hub, under **Workspace**, open your target database, and within **Tables**, right-click one of your target tables.

1. Choose **New SQL script**, then **Select TOP 100 rows**.

1. Run this query to view the replicated data in your target Synapse SQL database.

1. You can also query the target database with SSMS (or other tools). Use the dedicated SQL endpoint for your workspace as the server name. This is typically `<workspacename>.sql.azuresynapse.net`. Add `Database=databasename@poolname` as another connection string parameter when connecting via SSMS (or other tools).

## Add/remove table in existing Azure Synapse Link connection

You can add/remove tables on Synapse Studio as following:

1. Open the **Integrate Hub**.

1. Select the **Link connection** you want to edit and open it.  

1. Select **+New** table to add tables on Synapse Studio or click the trash can icon to the right or a table to remove an existing table. You can add or remove tables when the link connection is running.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/link-connection-add-remove-tables.png" alt-text="Screenshot of link connection to add table.":::

   > [!NOTE]
   > You can directly add or remove tables when a link connection is running.

## Stop the Azure Synapse Link connection

You can stop the Azure Synapse Link connection on Synapse Studio as following:

1. Open the **Integrate Hub** of your Synapse workspace.

1. Select the **Link connection** you want to edit and open it.  

1. Select **Stop** to stop the link connection, and it will stop replicating your data.

   :::image type="content" source="../media/connect-synapse-link-sql-server-2022/stop-link-connection.png" alt-text="Screenshot of link connection to stop link.":::

   > [!NOTE]
   > If you restart a link connection after stopping it, it will start from a full initial load from your source database followed by incremental change feeds.

## <a name="known-issues"></a>Known limitations

The following is the list of known limitations for Azure Synapse Link for Azure SQL Database.

* Users must create new Synapse workspace to get Azure Synapse Link for SQL DB. 

* Azure Synapse link for SQL DB is not supported on Free, Basic or Standard tier with fewer than 100 DTUs.

* Azure Synapse Link for SQL DB is not supported on Azure SQL Managed Instances.

* Azure Synapse link for SQL DB cannot be used in virtual network environment. Users need to check “Allow Azure Service and resources to access to this server” on Azure SQL database and check “Disable Managed virtual network” and “Allow connections from all IP address” for Synapse workspace.

* Users need to manually create schema in destination Synapse SQL pool in advance if your expected schema is not available in Synapse SQL pool. The destination database schema object will not be automatically created in data replication. If your schema is dbo, you can skip this step.

* Service principal and user-assigned managed identity are not supported for authenticating to source Azure SQL DB, so when creating Azure SQL DB linked service, please choose SQL auth or service assigned managed Identity (SAMI).

* Azure Synapse Link for Azure SQL DB CANNOT be enabled for source tables in Azure SQL DB in following conditions:

  * Source tables do not have primary keys.
  * The PK columns in source tables contain the unsupported data types including real, float, hierarchyid, sql_variant and timestamp.  
  * Source table row size exceeds the limit of 7500 bytes. SQL Server supports row-overflow storage, which enables variable length columns to be pushed off-row. Only a 24-byte root is stored in the main record for variable length columns pushed out of row.

* Tables enabled for Azure Synapse Link can have a maximum of 1020 columns.
* While a database can have multiple links enabled, a table can only belong to one link.
* When SQL DB owner does not have a mapped login, Azure Synapse Link for SQL DB will run into error when enabling a link connection. User can set database owner to a valid user with the ALTER AUTHORIZATION command to fix this.

* The computed columns and the column containing unsupported data types by Synapse SQL Pool including image, text, xml, timestamp, sql_variant, UDT, geometry, geography in source tables in Azure SQL DB will be skipped, and not to replicate to the Synapse SQL Pool.

* Maximum 5000 tables can be added to a single link connection.

* When source columns with type datetime2(7) and time(7) are replicated using Azure Synapse Link, the target columns will have last digit truncated.

* The following DDL operations are not allowed on source tables in Azure SQL DB which are enabled for Azure Synapse Link for Azure SQL DB.

  * Switch partition, add/drop/alter column, alter PK, drop/truncate table, rename table are not allowed if the tables have been added into a running link connection of Azure Synapse Link for Azure SQL DB. 
  * All other DDL operations are allowed, but those DDL operations will not be replicated to the Synapse SQL Pool.

* If DDL + DML is executed in an explicit transaction (between Begin Transaction and End Transaction statements), replication for corresponding tables will fail within the link connection.

  > [!NOTE]
  > If a table is critical for transactional consistency at the link connection level, please review the state of the Azure Synapse Link table in the Monitoring tab.

* Azure Synapse Link for SQL DB cannot be enabled if any of the following features are in use for the source tables in Azure SQL database:

  * Change Data Capture
  * Temporal history table
  * Always encrypted
  * In-Memory OLTP
  * Column Store Index
  * Graph
	
* System tables in SQL database will not be replicated.
* Security configuration of Azure SQL database will NOT be reflected to Synapse SQL Pool. 
* Enabling Synpase Link will create a new schema on the Azure SQL DB as 'changefeed', please do not use this schema name for your workload.
* Non-dbo schemas will not be automatically created in the target dedicated SQL pool. Please manually create any schemas you will need prior to starting the link.
* Source tables with non-default collations: UTF8, Japanese cannot be replicated to Synapse. Here is the [supported collations in Synapse SQL Pool](../sql/reference-collation-types.md).
* Azure Synapse Link cannot be enabled on the secondary database once a GeoDR failover has happened.
* If you enabled Azure Synapse Link on your database as an AAD user, Point-in-time restore (PITR) will not work and it will fail.  PITR will only work when you enable Azure Synapse Link on your database as a SQL user.
* If you create a database as an AAD user and enable Azure Synapse Link, a SQL authentication user (e.g. even sysadmin role) will not be able to disable/make changes to Azure Synapse Link artifacts.  However, another AAD user will be able to enable/disable Azure Synapse Link on the same database.  Similarly, if you create a database as an SQL authentication user, enabling/disabling Azure Synapse Link as an AAD user will not work.
* When enablilng Azure Synapse Link on your Azure SQL Database, you should ensure that aggressive log truncation is disabled.

## Known Issues
### Deleteing an Azure Synapse Analytics workspace with a running link could cause log on source database to fill
* Issue - When you delete an Azure Synapse Analytics workspace, it is possible that running links might not be stopped.  This will cause the source database to think that the link is still operational, and could lead to the log filling and not being truncated.
* Resolution - There are two possible resolutions to this situation:
1. Stop any running links prior to deleting the Azure Synapse Analytics workspace.
1. Manually clean up the link definition in the source database.  To do this:
    1. Find the table_group_id for the link(s) that need to be stopped using the following query:
        ```sql
        SELECT table_group_id, workspace_id, synapse_workgroup_name
        FROM [changefeed].[change_feed_table_groups]
        WHERE synapse_workgroup_name = <synapse workspace name>
        ```
    1. Drop each link identified using the following procedure:
        ```sql
        EXEC sys.sp_change_feed_drop_table_group @table_group_id = <table_group_id>
        ```
    1. Optionally, if you are disabling all of the table groups for a given database, you can also disable change feed on the database with the following command:
        ```sql
        EXEC sys.sp_change_feed_disable_db
        ```
### User may receive error indicating invalid primary key column data type even when primary key is of a supported type
* Issue - If your source database contains a table that has a table with a primary key that is not a supported data type (real, float, hierarchyid, sql_variant, and timestamp), it could cause a table with a supported primary key data type to not be enabled for Synapse Link.  This is a known issue that we are in the process of fixing.
* Resolution - Change the data type of all primary key columns to a supported data type.

## Next steps

If you are using a different type of database, see how to:

* [Configure Synapse Link for Azure Cosmos DB](../../cosmos-db/configure-synapse-link.md?context=/azure/synapse-analytics/context/context)
* [Configure Synapse Link for Dataverse](/powerapps/maker/data-platform/azure-synapse-link-synapse?context=/azure/synapse-analytics/context/context)
