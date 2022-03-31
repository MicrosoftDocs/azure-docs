---
title: Connect to Azure Synapse Link for Azure Cosmos DB
description: Learn how to connect an Azure Cosmos DB database to an Azure Synapse workspace with Azure Synapse Link.
author: Rodrigossz
ms.service: synapse-analytics
ms.topic: quickstart
ms.subservice: synapse-link
ms.date: 03/02/2021
ms.author: rosouz
ms.reviewer: sngun
ms.custom: cosmos-db, mode-other
---

# Getting Started with Synapse Link for Azure SQL Database

This is a step-by-step guide for getting started with the Private Preview of Azure Synapse Link for Azure SQL Database.

:information_source: Note: This PREVIEW feature is subject to the [Preview Terms](https://azure.microsoft.com/en-us/support/legal/preview-supplemental-terms/).

Azure Synapse Link enables a seamless data pipeline between OLTP and OLAP platforms, without undesired burden on OLTP sources, for real-time analytics, including advanced BI and AI/ML processing. 

Azure Synapse Link for Azure SQL Database enables a seamless, fully managed data pipeline from Azure SQL databases to Synapse SQL Pools with 1-1 column and data type mapping. It adds minimum impact on source databases with a new change feed technology. Azure Synapse Link for Azure SQL Database supports in average minimum latency to publish incremental data changes from Azure SQL DB to Azure Synapse Link tables with full consistency. It guarantees no data loss and transactional consistency at Synapse Link connection level for all the link tables in healthy state. 

If at any point you run into issues, first check the [Known issues and restrictions page](./known-issues-restrictions-link-sql-db.md), then reach out to [SynapseLinkSQL@microsoft.com](mailto:SynapseLinkSQL@microsoft.com?subject=SQL%20DB%20-%20Private%20Preview%20issue). 

## Initial setup

1.	First, make sure your subscription and source SQL logical server (and database) are whitelisted, if you are not sure please email us at [SynapseLinkSQL@microsoft.com](mailto:SynapseLinkSQL@microsoft.com?subject=SQL%20DB%20-%20Private%20Preview%20allow%20list%20request). 	 Please wait for confirmaiton from us on whitelisting before proceeding with the next step.

2.	[Create a new Synapse workspace](https://ms.portal.azure.com/#create/Microsoft.Synapse) in the Azure subscription that has been added to the preview. To use this feature, currently you need to create a new Synapse workspace.
    

## Configure your source Azure SQL Database

3. Using Microsoft SQL Server Management Studio (SSMS) or Azure Data Studio, connect to the source Azure SQL Server with administrative privileges.

    
   ![SSMS connection](./media/ssms-connection.png)
   

4. Connect to your source SQL Database. If you are using SSMS, expand **Databases**, right click the database you created above, and select **New Query**.

   ![SSMS new query](./media/ssms-new-query.png)
   
5. If you wish to have your Synapse workspace connect to your source Azure SQL Database using a [managed identity](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview), run the following script to provide the managed identity permission to the source database. 

   **You can skip this step** if you instead wish to have your Synapse workspace connect to your source Azure SQL Database via SQL authentication.

       CREATE USER workspacename FROM EXTERNAL PROVIDER;
       ALTER ROLE [db_owner] ADD MEMBER workspacename;

6. Create the master key for your source Azure SQL Database and create at least one new table. You can create a table with your own schema; below is just an example for a `CREATE TABLE` query. You can also insert some rows into this table to ensure there is data to be replicated.

       CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'a new password'
       CREATE TABLE myTestTable1 (c1 int primary key, c2 int, c3 nvarchar(50)) 

7. Enable the source Azure SQL server's system-assigned managed identity for your source logical server using [Azure PowerShell](https://shell.azure.com/), if it is not already enabled. This managed identity will be used by your source Azure SQL server to send changes from the source database to your Synapse workspace. 
  
       Set-AzSqlServer -ResourceGroupName <resource group name> -ServerName <source server name> -AssignIdentity

    ![Azure PowerShell enable source managed identity](./media/powershell-enable-source-mi.png)
   
   Then, run this to check that the system-assigned identity has been created:
   
        $x = Get-AzSqlServer -ResourceGroupName <resource group name> -ServerName <source server name>
        $x.Identity

    ![Azure PowerShell verify source managed identity](./media/powershell-verify-source-mi.png)

8. Make sure you update your source Azure SQL Database's firewall rules, as needed, to allow access from your Synapse workspace.
   
   To do this within the Azure Portal, navigate to the source Azure SQL Database, open **Firewalls and virtual networks**, then set **Allow Azure services and resources to access this server** to **Yes**.

   ![Portal SQL DB firewall settings allow Azure services](./media/portal-sql-db-firewall.png)

## Create your target Synapse SQL pool and database

1. Launch Synapse Studio using the following link:

    [aka.ms/synapselinkpreview](https://aka.ms/synapselinkpreview)

2. Open the **Manage** hub, navigate to **SQL pools**, click **+ New**.

    ![Studio new Synapse SQL pool](./media/studio-new-sql-pool.png)

3. Enter a unique pool name, use the default settings, and create the dedicated pool.
4. While the pool is being created, navigate to the **Data** hub, click **+ New**, and select **Synapse SQL database**.

    ![Studio new Synapse SQL database](./media/studio-new-sql-database.png)

5. Select **Dedicated** and enter a name for your target Synapse SQL database.
6. Create the target database and schema.
    
    Once the pool, database and schema are created successfully, proceed to the next step.

7. In the **Data** hub, under **Workspace**, you should see your new Synapse SQL database listed under **Databases**.

    Next to your new Synapse SQL database, select **New SQL script**, then **Empty script**. 

    ![Studio new empty SQL script](./media/studio-new-empty-sql-script.png)

8. Paste the script below and click **Run** to create the master key for your target Synapse SQL database.

        CREATE MASTER KEY

## Create the Synapse Link connection

1. Open the **Integrate** hub, and click **+ Link connection(Preview)**.

    ![Studio new link connection](./media/studio-new-link-connection.png)

2. Under **Source linked service**, select **New**.

    ![Studio new linked service dropdown](./media/studio-new-linked-service-dropdown.png)

3. Enter the information for your source Azure SQL Database.

    * Select the subscription, server, and database corresponding to your Azure SQL Database.
    * If you wish to connect your Synapse workspace to the source DB using the workspace’s managed identity, set **Authentication type** to **Managed Identity**.
      
      If you wish to use SQL authentication instead and know the username/password to use, you may select **SQL Authentication** instead. 

    Note: If you choose to use Managed Identity, please make sure you have completed **Step 6**.
    
    ![Studio new linked service](./media/studio-new-linked-service.png)

4. Click **Test connection** to ensure the firewall rules are properly configured and the workspace can successfully connect to the source Azure SQL Database.
5. Click **Save**.
6. Select one or more source tables to replicate to your Synapse workspace.

    Note:
    * Please see the [Known issues and restrictions page](./known-issues-restrictions-link-sql-db.md) for the supported data types.
    * A given source table can only be enabled in at most one link connection at a time.

7. Click **Continue**.
8. Select a target Synapse SQL database and pool.
9. Provide a name for your Synapse Link connection.
10. Select the number of cores. These cores will be used for the movement of data from the source to the target.
    
    Note: We recommend starting low and increasing as needed.
 
11. Click **OK**.
12. With the new Synapse Link connection open, you have chance to update the target table name, distribution type and structure type. 

    Note: 
    * Consider heap table for structure type when your data contains varchar(max), nvarchar(max), and varbinary(max). 
    * Please make sure the schema in your Synapse SQL pool has already been created before you start the link connection. Synapse link will help you to create tables automatically under your schema in Synapse SQL Pool. 

    ![Studio edit connection](./media/studio-edit-link.png)
	
13. Click **Publish all** to save the new link connection to the service.

    ![Studio publish all](./media/studio-publish-all.png)

## Start the Synapse Link connection

1. Click **Start**.

    ![Studio start connection](./media/studio-start-connection.png)
    
    Note for later: When you are done with this guide, click **Stop** on this screen. For now, continue with the rest of the guide.

2. Wait a few minutes for data to be replicated.

## Validate and make updates to the Synapse Link connection

3. In the **Data** hub, under **Workspace**, open your target database, and within **Tables**, right-click one of your target tables.

    Choose **New SQL script**, then **Select TOP 100 rows**.

    ![Studio query target table](./media/studio-query-target-table.png)

4. Run this query to check that the target database has the expected target table(s) and data.
5. Try making changes to your source table(s) in your source Azure SQL Database. You may also add additional tables to the source database.
6. To include new tables to your running connection, go back to the Synapse Link connection in the **Integrate** hub.

    Click **New table**, select your additional table(s), Save, and click **Publish all** to persist the change.

    ![Studio new link connection table](./media/studio-new-link-connection-table.png)

## Monitor the status of the Synapse Link connection

You may monitor the status of your Synapse Link connection, see which tables are being initially copied over (Snapshotting), and see which tables are in continuous replication mode (Replicating).

7. Navigate to the **Monitor** hub, and click **Link connections**.

    ![Studio monitor hub](./media/studio-monitor-link-connections.png)

8. Open the Synapse Link connection you started and view the status of each table.
9. Click **Refresh** on the monitoring view for your connection to observe any updates to the status.

## Query replicated data

You may now explore the replicated tables in your target Synapse SQL database.

10. In the **Data** hub, under **Workspace**, open your target database, and within **Tables**, right-click one of your target tables.

    Choose **New SQL script**, then **Select TOP 100 rows**.

    ![Studio query target table](./media/studio-query-target-table.png)

11. Run this query to view the replicated data in your target Synapse SQL database.
12. You can also query the target database with SSMS (or other tools).

    Use the dedicated SQL endpoint for your workspace as the server name. This is typically `<workspacename>.sql.azuresynapse.net`.

    Add `Database=databasename@poolname` as an additional connection string parameter when connecting via SSMS (or other tools).

## Known issues and restrictions

Please see the [Known issues and restrictions page](./known-issues-restrictions-link-sql-db.md).

If you encounter an issue not documented on that page, please reach out to [SynapseLinkSQL@microsoft.com](mailto:SynapseLinkSQL@microsoft.com?subject=SQL%20DB%20-%20Private%20Preview%20issue). 