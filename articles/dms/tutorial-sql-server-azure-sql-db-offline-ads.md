---
title: "Tutorial: Migrate SQL Server to Azure SQL Database (Preview) offline using Azure Data Studio"
titleSuffix: Azure Database Migration Service
description: Migrate SQL Server to an Azure SQL Database (Preview) offline using Azure Data Studio with Azure Database Migration Service
services: dms
author: croblesm
ms.author: roblescarlos
manager: 
ms.reviewer: 
ms.service: dms
ms.workload: data-services
ms.custom: "seo-lt-2019"
ms.topic: tutorial
ms.date: 09/28/2022
---
# Tutorial: Migrate SQL Server to an Azure SQL Database offline using Azure Data Studio with DMS (Preview)

You can use the Azure SQL migration extension in Azure Data Studio to migrate the database(s) from a SQL Server instance to Azure SQL Database (Preview).

In this tutorial, you will learn how to migrate the **AdventureWorks2019** database from an on-premises instance of SQL Server to Azure SQL Database (Preview) by using the Azure SQL Migration extension for Azure Data Studio. This tutorial focuses on the offline migration mode that considers an acceptable downtime during the migration process.

In this tutorial, you learn how to:
> [!div class="checklist"]
>
> * Launch the *Migrate to Azure SQL* wizard in Azure Data Studio
> * Run an assessment of your source SQL Server database(s)
> * Collect performance data from your source SQL Server
> * Get a recommendation of the Azure SQL Database (Preview) SKU best suited for your workload
> * Deploy your on-premises database schema to Azure SQL Database
> * Create a new Azure Database Migration Service
> * Start and, monitor the progress for your migration through to completion

[!INCLUDE [online-offline](../../includes/database-migration-service-offline-online.md)]

> [!IMPORTANT]
> **Online** migrations for Azure SQL Database targets, are not currently available.

## Prerequisites

To complete this tutorial, you need to:

* [Download and install Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio)
* [Install the Azure SQL migration extension](/sql/azure-data-studio/extensions/azure-sql-migration-extension) from the Azure Data Studio marketplace
* Have an Azure account that is assigned to one of the built-in roles listed below:
    - Contributor for the target Azure SQL Database
    - Reader role for the Azure Resource Groups containing the target Azure SQL Database.
    - Owner or Contributor role for the Azure subscription (required if creating a new DMS service).
    - As an alternative to using the above built-in roles, you can assign a custom role as defined in [this article.](resource-custom-roles-sql-db-ads.md)  
    > [!IMPORTANT]
    > Azure account is only required when configuring the migration steps and is not required for assessment or Azure recommendation steps in the migration wizard.
* Create a target [Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart).
* Ensure that the login to connect the source SQL Server is a member of the `db_datareader` and the login for the target SQL server is `db_owner`.
* Migrate database schema from source to target using [SQL Server dacpac extension](/sql/azure-data-studio/extensions/sql-server-dacpac-extension) or, [SQL Database Projects extension](/sql/azure-data-studio/extensions/sql-database-project-extension) for Azure Data Studio..

## Launch the Migrate to Azure SQL wizard in Azure Data Studio

1. Open Azure Data Studio, navigate to the connections section, then select and connect to your on-premises SQL Server (or SQL Server on Azure Virtual Machine).
2. On the server connection, right-click and select **Manage**.
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/ads-manage-panel.png" alt-text="Navigate to server connections":::
3. On the server's home page, navigate to the **General** panel section, then select **Azure SQL Migration** extension. 
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/launch-migrate-to-azure-sql-wizard-1.png" alt-text="Navigate to General panel"::: 
4. The Azure SQL Migration dashboard will open, then click on the **Migrate to Azure SQL** button to launch the migration wizard.
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/launch-migrate-to-azure-sql-wizard-2.png" alt-text="Launch Migrate to Azure SQL wizard":::
5. The wizard's first page will allow you to start a new session or resume a previously saved one. If no previous session is saved, the **Database assessment** blade will be displayed.

## Run database assessment, collect performance data and get right-sized recommendations

1. Select the database(s) to run the assessment, then click **Next**.
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/assessment-database-selection.png" alt-text="Run assessment":::
2. Select **Azure SQL Database (Preview)** as the target.
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/assessment-target-selection.png" alt-text="Select Azure SQL Database target":::
3. Click on the **View/Select** button at the bottom of this page to view details of the assessment results.
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/assessment.png" alt-text="View/Select assessment results":::
4. Select the database(s), and review the assessment report making sure no issues are found.
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/assessment-issues-details.png" alt-text="Review the assessment report":::
5. Click the **Get Azure recommendation** button to open the recommendations panel.
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/get-azure-recommendation.png" alt-text="Get Azure recommendations":::
6. Select the **Collect performance data now** option, then choose a folder from your local drive to store the performance logs. When you are ready, then click the **Start** button.
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/get-azure-recommendation-zoom.png" alt-text="Collect performance data"::: x
7. Azure Data Studio will now collect performance data until you either stop the collection or close Azure Data Studio.  
8. After 10 minutes, you will see a **recommendation available** for your Azure SQL Database (Preview). After the first recommendation is generated, you can use the **Restart data collection** option to continue the data collection process to refine the SKU recommendation, especially if your usage patterns vary for an extended time.
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/get-azure-recommendation-collected.png" alt-text="Performance data collected":::
9. Navigate to your Azure SQL target section, with  **Azure SQL Database (Preview)** selected click the **View details** button to open the detailed SKU recommendation report. You can also click on the save recommendation report button at the bottom of this page for later analysis.
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/azure-sku-recommendation-zoom.png" alt-text="SKU recommendation details":::
Close the recommendations blade, and press the **Next**** button to continue with your migration.

## Configure migration settings
1. Start with the upper section, specifying Azure account details. Select your subscription, location, and resource group from the corresponding drop-down lists.
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/configuration-azure-target-account.png" alt-text="Azure account details":::
2. Move to the next section, selecting the target Azure SQL Database server (logical server) from the drop-down list. Specify the target username and password, then click the **Connect** button to verify the connectivity with the specified credentials.
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/configuration-azure-target-db.png" alt-text="Azure SQL Database details":::
3. Map the source and target databases for the migration, using the drop-down list for the Azure SQL Database target. Then click **Next** to move to the next step in the migration wizard.
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/configuration-azure-target-map.png" alt-text="Source and target mapping":::
4. Select **Offline migration** as the migration mode and click Next.
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/migration-mode.png" alt-text="Select offline migrations":::
5. Enter source SQL Server credentials, then click **Edit** to select the list of tables to migrate between source and target.  
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/migration-source-credentials.png" alt-text="Source SQL Server credentials":::
6. Select the tables that you want to migrate to target. Notice the **Has rows** column indicates whether the target table has rows in the target database. You can select one or more tables. In the example below, a text filter was applied to select just the tables that contain the word **Employee**. However, you can select the list of tables based on your migration needs. When you are ready, click **Update** to proceed with the next step.
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/migration-source-tables.png" alt-text="Select tables":::
7. The list of selected tables can be updated anytime before starting the migration. Click **Next** when you are ready to move to the next step in the migration wizard.
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/migration-target-tables.png" alt-text="Migrate selected tables":::
> [!NOTE]
> If no tables are selected or credentials fields are empty, the **Next** button will be disabled.

## Create Azure Database Migration Service

1. Create a new Azure Database Migration Service or reuse an existing Service that you previously created.
    > [!NOTE]
    > If you had previously created DMS using the Azure Portal, you cannot reuse it in the migration wizard in Azure Data Studio. Only DMS created previously using Azure Data Studio can be reused.
2. Select the **Resource group** where you have an existing DMS or need to create a new one. The **Azure Database Migration Service** dropdown will list any existing DMS in the selected resource group.
3. To reuse an existing DMS, select it from the dropdown list and press **Next** to view the summary screen. When ready to begin the migration, press the **Start migration** button.
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/create-dms.png" alt-text="Select DMS":::
4. To create a new DMS, select **Create new**. On the **Create Azure Database Migration Service**, the screen provides the name for your DMS, and select **Create**.  
5. After successfully creating DMS, you'll be provided details to set up **integration runtime**.  
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/create-dms-ir-details.png" alt-text="Integration runtime":::
6. Select **Download and** install integration runtime** to open the download link in a web browser. Complete the download. Install the integration runtime on a machine that meets the prerequisites of connecting to the source SQL Server.  
7. After the installation is complete, the **Microsoft Integration Runtime Configuration Manager** will automatically launch to begin the registration process.  
8. Copy and paste one of the authentication keys provided in the wizard screen in Azure Data Studio. If the authentication key is valid, a green check icon is displayed in the Integration Runtime Configuration Manager, indicating that you can continue to **Register**.  
9. After completing the registration of the self-hosted integration runtime, close the **Microsoft Integration Runtime Configuration Manager** and switch back to the migration wizard in Azure Data Studio.
   > [!Note]
   > Refer [Create and configure a self-hosted integration runtime](/azure/data-factory/create-self-hosted-integration-runtime) for additional information regarding self-hosted integration runtime.
10. Select **Test connection** in the **Create Azure Database Migration Service** screen in Azure Data Studio to validate that the newly created DMS is connected to the newly registered self-hosted integration runtime. 
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/create-dms-ir-connected.png" alt-text="Test IR connectivity":::
11. Review the summary and select **Start migration** to start the database migration.
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/summary-start-migration.png" alt-text="Start migration":::

## Monitor your migration  
1. On The Azure SQL Migration dashboard, navigate to the **Database Migration Status** section.   
2. Using the different options in the panel below, you can track migrations in progress, completed, and failed migrations (if any) or list all database migrations together.  
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/monitor-migration-dashboard.png" alt-text="Monitor migration dashboard":::
3. Click on **Database migrations in progress** to view ongoing migrations and get further details.
    :::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/monitor-migration-dashboard-in-progress.png" alt-text="Database migration in progress":::
4. DMS will return the latest known migration status every time the migration status section gets refreshed. Please check the following table to learn more about the possible statuses:

    | Status | Description |
    |--------|-------------|
    |Preparing for copy| Disabling autostats, triggers, and indexes for target table |
    |Copying| Data is being copied from source to target |
    |Copy finished| Data copy has finished and, waiting on other tables to finish copying to begin final steps to return tables to original schema|
    |Rebuilding indexes| Rebuilding indexes on target tables|
    |Succeeded| This table has all data copied to it and, indexes rebuilt |

5. The migration details page displays the current status per database. As you can see from the screenshot below, the **AdventureWorks2019** database migration is in *Creating* status.
:::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/monitor-migration-dashboard-creating.png" alt-text="Creating migration status":::
6. Click on the **Refresh** link to update the status. As you can see from the screenshot below, DMS has updated the migration status to *In progress*.
:::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/monitor-migration-dashboard-inprogress.png" alt-text="In progress status ":::
7. Click on the database name link to open the table-level view. The upper section of this dashboard displays the current status of the migration, while the lower section provides a detailed status of each table.
:::image type="content" source="/media/tutorial-sql-server-azure-sql-db-offline-ads/monitor-migration-monitoring-panel-inprogress.png" alt-text="Monitoring table migration":::
8. After all table data is migrated to the Azure SQL Database (Preview) target, DMS will update the migration status from *In progress* to *Succeeded*. 
:::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/monitor-migration-dashboard-succeeded.png" alt-text="Succeeded status":::
9. Once again, you can click on the database name link to open the table-level view. The upper section of this dashboard displays the current status of the migration; the lower section provides information to verify all data is the same on both the source and the target (*rows read vs. rows copied*).
:::image type="content" source="media/tutorial-sql-server-azure-sql-db-offline-ads/monitor-migration-monitoring-panel-succeeded.png" alt-text="Succeeded migration":::

At this point, you have completed the migration to Azure SQL Database. We encourage you to go through a series of post-migration tasks to ensure everything functions smoothly and efficiently. 

> [!IMPORTANT]
> Be sure to take advantage of the advanced cloud-based features offered by Azure SQL Database, such as [built-in high availability](/azure/azure-sql/database/high-availability-sla), [threat detection](/azure/azure-sql/database/azure-defender-for-sql), and [monitoring and tuning your workload](/azure/azure-sql/database/monitor-tune-overview).

## Next steps

* For a tutorial showing you how to create an Azure SQL Database using the Azure portal, Powershell, or AZ CLI commands, see [Create a single database - Azure SQL Database](/azure-sql/database/single-database-create-quickstart).
* For information about Azure SQL Database, see [What is Azure SQL DB](/azure-sql/database/sql-database-paas-overview).
* For information about connecting to Azure SQL Database, see [Connect applications](/azure-sql/database/connect-query-content-reference-guide).