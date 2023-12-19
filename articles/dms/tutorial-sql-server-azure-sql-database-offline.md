---
title: "Tutorial: Migrate SQL Server to Azure SQL Database (offline)"
titleSuffix: Azure Database Migration Service
description: Learn how to migrate on-premises SQL Server to Azure SQL Database offline by using Azure Database Migration Service.
author: abhims14
ms.author: abhishekum
ms.reviewer: randolphwest
ms.date: 10/10/2023
ms.service: dms
ms.topic: tutorial
ms.custom:
  - seo-lt-2019
  - sql-migration-content
---

# Tutorial: Migrate SQL Server to Azure SQL Database (offline)

You can use Azure Database Migration Service via the Azure SQL Migration extension for Azure Data Studio, or the Azure portal, to migrate databases from an on-premises instance of SQL Server to Azure SQL Database (offline).

In this tutorial, learn how to migrate the sample `AdventureWorks2019` database from an on-premises instance of SQL Server to an instance of Azure SQL Database, by using Database Migration Service. This tutorial uses offline migration mode, which considers an acceptable downtime during the migration process.

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Open the Migrate to Azure SQL wizard in Azure Data Studio
> - Run an assessment of your source SQL Server databases
> - Collect performance data from your source SQL Server instance
> - Get a recommendation of the Azure SQL Database SKU that will work best for your workload
> - Deploy your on-premises database schema to Azure SQL Database
> - Create an instance of Azure Database Migration Service
> - Start your migration and monitor progress to completion

[!INCLUDE [online-offline](../../includes/database-migration-service-offline-online.md)]

> [!IMPORTANT]  
> Currently, *online* migrations for Azure SQL Database targets aren't available.

## Migration options

The following section describes how to use Azure Database Migration Service with the Azure SQL Migration extension, or in the Azure portal.

## [Migrate using Azure SQL Migration extension](#tab/azure-data-studio)

### Prerequisites

Before you begin the tutorial:

- [Download and install Azure Data Studio](/azure-data-studio/download-azure-data-studio).
- [Install the Azure SQL Migration extension](/azure-data-studio/extensions/azure-sql-migration-extension) from Azure Data Studio Marketplace.
- Have an Azure account that's assigned to one of the following built-in roles:

  - Contributor for the target instance of Azure SQL Database
  - Reader role for the Azure resource group that contains the target instance of Azure SQL Database
  - Owner or Contributor role for the Azure subscription (required if you create a new instance of Azure Database Migration Service)

  As an alternative to using one of these built-in roles, you can [assign a custom role](resource-custom-roles-sql-database-ads.md).

  > [!IMPORTANT]  
  > An Azure account is required only when you configure the migration steps. An Azure account isn't required for the assessment or to view Azure recommendations in the migration wizard in Azure Data Studio.

- Create a target instance of [Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart).

- Make sure that the SQL Server login that connects to the source SQL Server instance is a member of the db_datareader role and that the login for the target SQL Server instance is a member of the db_owner role.

- Migrate the database schema from source to target by using the [SQL Server dacpac extension](/azure-data-studio/extensions/sql-server-dacpac-extension) or the [SQL Database Projects extension](/azure-data-studio/extensions/sql-database-project-extension) in Azure Data Studio.

- If you're using Database Migration Service for the first time, make sure that the Microsoft.DataMigration [resource provider is registered in your subscription](quickstart-create-data-migration-service-portal.md#register-the-resource-provider).

> [!NOTE]  
> Make sure to migrate the database schema from source to target by using the [SQL Server dacpac extension](/azure-data-studio/extensions/sql-server-dacpac-extension) or the [SQL Database Projects extension](/azure-data-studio/extensions/sql-database-project-extension) in Azure Data Studio before selecting the list of tables to migrate.
>  
> If no tables exist on the Azure SQL Database target, or no tables are selected before starting the migration, the **Next** button isn't available to select to initiate the migration task.

### Open the Migrate to Azure SQL wizard in Azure Data Studio

To open the Migrate to Azure SQL wizard:

1. In Azure Data Studio, go to **Connections**. Select and connect to your on-premises instance of SQL Server. You also can connect to SQL Server on an Azure virtual machine.

1. Right-click the server connection and select **Manage**.

   :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/azure-data-studio-manage-panel.png" alt-text="Screenshot that shows a server connection and the Manage option in Azure Data Studio." lightbox="media/tutorial-sql-server-azure-sql-database-offline/azure-data-studio-manage-panel.png":::

1. In the server menu under **General**, select **Azure SQL Migration**.

   :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/launch-migrate-to-azure-sql-wizard-1.png" alt-text="Screenshot that shows the Azure Data Studio server menu.":::

1. In the Azure SQL Migration dashboard, select **Migrate to Azure SQL** to open the migration wizard.

   :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/launch-migrate-to-azure-sql-wizard-2.png" alt-text="Screenshot that shows the Migrate to Azure SQL wizard.":::

1. On the first page of the wizard, start a new session or resume a previously saved session.

### Run database assessment, collect performance data, and get Azure recommendations

1. In **Step 1: Databases for assessment** in the Migrate to Azure SQL wizard, select the databases you want to assess. Then, select **Next**.

   :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/assessment-database-selection.png" alt-text="Screenshot that shows selecting a database for assessment.":::

1. In **Step 2: Assessment results and recommendations**, complete the following steps:

   1. In **Choose your Azure SQL target**, select **Azure SQL Database**.

      :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/assessment-target-selection.png" alt-text="Screenshot that shows selecting the Azure SQL Database target.":::

   1. Select **View/Select** to view the assessment results.

      :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/assessment.png" alt-text="Screenshot that shows view/select assessment results.":::

   1. In the assessment results, select the database, and then review the assessment report to make sure no issues were found.

      :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/assessment-issues-details.png" alt-text="Screenshot that shows the assessment report.":::

   1. Select **Get Azure recommendation** to open the recommendations pane.

       :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/get-azure-recommendation.png" alt-text="Screenshot that shows Azure recommendations.":::

   1. Select **Collect performance data now**. Select a folder on your local computer to store the performance logs, and then select **Start**.

      :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/get-azure-recommendation-zoom.png" alt-text="Screenshot that shows performance data collection.":::

      Azure Data Studio collects performance data until you either stop data collection or you close Azure Data Studio.

      After 10 minutes, Azure Data Studio indicates that a recommendation is available for Azure SQL Database. After the first recommendation is generated, you can select **Restart data collection** to continue the data collection process and refine the SKU recommendation. An extended assessment is especially helpful if your usage patterns vary over time.

      :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/get-azure-recommendation-collected.png" alt-text="Screenshot that shows performance data collected.":::

   1. In the selected **Azure SQL Database** target, select **View details** to open the detailed SKU recommendation report:

      :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/get-azure-recommendation-view-details.png" alt-text="Screenshot that shows the View details link for the target database recommendations.":::

   1. In **Review Azure SQL Database Recommendations**, review the recommendation. To save a copy of the recommendation, select **Save recommendation report**.

       :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/azure-sku-recommendation-zoom.png" alt-text="Screenshot that shows SKU recommendation details.":::

1. Select **Close** to close the recommendations pane.

1. Select **Next** to continue your database migration in the wizard.

### Configure migration settings

1. In **Step 3: Azure SQL target** in the Migrate to Azure SQL wizard, complete these steps for your target Azure SQL Database instance:

   1. Select your Azure account, Azure subscription, the Azure region or location, and the resource group that contains the Azure SQL Database deployment.

      :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/configuration-azure-target-account.png" alt-text="Screenshot that shows Azure account details.":::

   1. For **Azure SQL Database Server**, select the target Azure SQL Database server (logical server). Enter a username and password for the target database deployment. Then, select **Connect**. Enter the credentials to verify connectivity to the target database.

      :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/configuration-azure-target-database.png" alt-text="Screenshot that shows Azure SQL Database details.":::

   1. Next, map the source database and the target database for the migration. For **Target database**, select the Azure SQL Database target. Then, select **Next** to move to the next step in the migration wizard.

      :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/configuration-azure-target-map.png" alt-text="Screenshot that shows source and target mapping.":::

1. In **Step 4: Migration mode**, select **Offline migration**, and then select **Next**.

   :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/migration-mode.png" alt-text="Screenshot that shows offline migrations selection.":::

1. In **Step 5: Data source configuration**, complete the following steps:

   1. Under **Source credentials**, enter the source SQL Server credentials.

   1. Under **Select tables**, select the **Edit** pencil icon.

      :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/migration-source-credentials.png" alt-text="Screenshot that shows source SQL Server credentials.":::

   1. In **Select tables for \<database-name\>**, select the tables to migrate to the target. The **Has rows** column indicates whether the target table has rows in the target database. You can select one or more tables. Then, select **Update**.

      You can update the list of selected tables anytime before you start the migration.

      In the following example, a text filter is applied to select tables that contain the word `Employee`. Select a list of tables based on your migration needs.

      :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/migration-source-tables.png" alt-text="Screenshot that shows the table selection.":::

1. Review your table selections, and then select **Next** to move to the next step in the migration wizard.

   :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/migration-target-tables.png" alt-text="Screenshot that shows selected tables to migrate.":::

> [!NOTE]  
> If no tables are selected or if a username and password aren't entered, the **Next** button isn't available to select.
>  
> Make sure to migrate the database schema from source to target by using the [SQL Server dacpac extension](/azure-data-studio/extensions/sql-server-dacpac-extension) or the [SQL Database Projects extension](/azure-data-studio/extensions/sql-database-project-extension) in Azure Data Studio before selecting the list of tables to migrate.

### Create a Database Migration Service instance

In **Step 6: Azure Database Migration Service** in the Migrate to Azure SQL wizard, create a new instance of Database Migration Service, or reuse an existing instance that you created earlier.

> [!NOTE]  
> If you previously created a Database Migration Service instance by using the Azure portal, you can't reuse the instance in the migration wizard in Azure Data Studio. You can reuse an instance only if you created the instance by using Azure Data Studio.

#### Use an existing instance of Database Migration Service

To use an existing instance of Database Migration Service:

1. In **Resource group**, select the resource group that contains an existing instance of Database Migration Service.

1. In **Azure Database Migration Service**, select an existing instance of Database Migration Service that's in the selected resource group.

1. Select **Next**.

   :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/create-dms.png" alt-text="Screenshot that shows Database Migration Service selection.":::

#### Create a new instance of Database Migration Service

To create a new instance of Database Migration Service:

1. In **Resource group**, create a new resource group to contain a new instance of Database Migration Service.

1. Under **Azure Database Migration Service**, select **Create new**.

1. In **Create Azure Database Migration Service**, enter a name for your Database Migration Service instance, and then select **Create**.

1. Under **Set up integration runtime**, complete the following steps:

   1. Select the **Download and install integration runtime** link to open the download link in a web browser. Download the integration runtime, and then install it on a computer that meets the prerequisites for connecting to the source SQL Server instance.

      :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/create-dms-integration-runtime-download.png" alt-text="Screenshot that shows the Download and install integration runtime link.":::

      When installation is finished, Microsoft Integration Runtime Configuration Manager automatically opens to begin the registration process.

   1. In the **Authentication key** table, copy one of the authentication keys that are provided in the wizard and paste it in Azure Data Studio.

      :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/create-dms-integration-runtime-authentication-key.png" alt-text="Screenshot that highlights the authentication key table in the wizard.":::

      If the authentication key is valid, a green check icon appears in Integration Runtime Configuration Manager. A green check indicates that you can continue to **Register**.

      After you register the self-hosted integration runtime, close Microsoft Integration Runtime Configuration Manager.

      > [!NOTE]  
      > For more information about the self-hosted integration runtime, see [Create and configure a self-hosted integration runtime](../data-factory/create-self-hosted-integration-runtime.md).

1. In **Create Azure Database Migration Service** in Azure Data Studio, select **Test connection** to validate that the newly created Database Migration Service instance is connected to the newly registered self-hosted integration runtime.

   :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/create-dms-integration-runtime-connected.png" alt-text="Screenshot that shows IR connectivity test.":::

1. Return to the migration wizard in Azure Data Studio.

### Start the database migration

In **Step 7: Summary** in the Migrate to Azure SQL wizard, review the configuration you created, and then select **Start migration** to start the database migration.

:::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/summary-start-migration.png" alt-text="Screenshot that shows how to start migration.":::

### Monitor the database migration

1. In Azure Data Studio, in the server menu under **General**, select **Azure SQL Migration** to go to the dashboard for your Azure SQL Database migrations.

   Under **Database migration status**, you can track migrations that are in progress, completed, and failed (if any), or you can view all database migrations.

   :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/monitor-migration-dashboard.png" alt-text="Screenshot that shows monitor migration dashboard." lightbox="media/tutorial-sql-server-azure-sql-database-offline/monitor-migration-dashboard.png":::

1. Select **Database migrations in progress** to view active migrations.

   To get more information about a specific migration, select the database name.

   :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/monitor-migration-dashboard-details.png" alt-text="Screenshot that shows database migration details." lightbox="media/tutorial-sql-server-azure-sql-database-offline/monitor-migration-dashboard-details.png":::

   Database Migration Service returns the latest known migration status each time migration status refreshes. The following table describes possible statuses:

   | Status | Description |
   | --- | --- |
   | Preparing for copy | The service is disabling autostats, triggers, and indexes in the target table. |
   | Copying | Data is being copied from the source database to the target database. |
   | Copy finished | Data copy is finished. The service is waiting on other tables to finish copying to begin the final steps to return tables to their original schema. |
   | Rebuilding indexes | The service is rebuilding indexes on target tables. |
   | Succeeded | All data is copied and the indexes are rebuilt. |

1. Check the migration details page to view the current status for each database.

   Here's an example of the `AdventureWorks2019` database migration with the status **Creating**:

   :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/monitor-migration-dashboard-creating.png" alt-text="Screenshot that shows a creating migration status." lightbox="media/tutorial-sql-server-azure-sql-database-offline/monitor-migration-dashboard-creating.png":::

1. In the menu bar, select **Refresh** to update the migration status.

   After migration status is refreshed, the updated status for the example `AdventureWorks2019` database migration is **In progress**:

   :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/monitor-migration-dashboard-in-progress.png" alt-text="Screenshot that shows a migration in progress status." lightbox="media/tutorial-sql-server-azure-sql-database-offline/monitor-migration-dashboard-in-progress.png":::

1. Select a database name to open the table view. In this view, you see the current status of the migration, the number of tables that currently are in that status, and a detailed status of each table.

   :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/monitor-migration-monitoring-panel-in-progress.png" alt-text="Screenshot that shows monitoring table migration." lightbox="media/tutorial-sql-server-azure-sql-database-offline/monitor-migration-monitoring-panel-in-progress.png":::

   When all table data is migrated to the Azure SQL Database target, Database Migration Service updates the migration status from **In progress** to **Succeeded**.

   :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/monitor-migration-monitoring-panel-succeeded.png" alt-text="Screenshot that shows succeeded migration." lightbox="media/tutorial-sql-server-azure-sql-database-offline/monitor-migration-monitoring-panel-succeeded.png":::

> [!NOTE]  
> Database Migration Service optimizes migration by skipping tables with no data (0 rows). Tables that don't have data don't appear in the list, even if you select the tables when you create the migration.

You've completed the migration to Azure SQL Database. We encourage you to go through a series of post-migration tasks to ensure that everything functions smoothly and efficiently.

> [!IMPORTANT]  
> Be sure to take advantage of the advanced cloud-based features of Azure SQL Database. The features include [built-in high availability](/azure/azure-sql/database/high-availability-sla), [threat detection](/azure/azure-sql/database/azure-defender-for-sql), and [monitoring and tuning your workload](/azure/azure-sql/database/monitor-tune-overview).

## [Migrate using Azure portal](#tab/portal)

### Prerequisites

Before you begin the tutorial:

- Ensure that you can access the [Azure portal](https://portal.azure.com)

- Have an Azure account that's assigned to one of the following built-in roles:
  - Contributor for the target instance of Azure SQL Database
  - Reader role for the Azure resource group that contains the target instance of Azure SQL Database
  - Owner or Contributor role for the Azure subscription (required if you create a new instance of Azure Database Migration Service)

  As an alternative to using one of these built-in roles, you can [assign a custom role](resource-custom-roles-sql-database-ads.md).

- Create a target instance of [Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart).

- Make sure that the SQL Server login that connects to the source SQL Server instance is a member of the **db_datareader** role, and that the login for the target SQL Server instance is a member of the **db_owner** role.

- Migrate the database schema from source to target by using the [SQL Server dacpac extension](/azure-data-studio/extensions/sql-server-dacpac-extension) or the [SQL Database Projects extension](/azure-data-studio/extensions/sql-database-project-extension) in Azure Data Studio.

- If you're using Database Migration Service for the first time, make sure that the `Microsoft.DataMigration` [resource provider is registered in your subscription](quickstart-create-data-migration-service-portal.md#register-the-resource-provider).

> [!NOTE]  
> Make sure to migrate the database schema from source to target by using the [SQL Server dacpac extension](/azure-data-studio/extensions/sql-server-dacpac-extension) or the [SQL Database Projects extension](/azure-data-studio/extensions/sql-database-project-extension) in Azure Data Studio before selecting the list of tables to migrate.
>
> If no tables exists on the Azure SQL Database target, or no tables are selected before starting the migration. The **Next** button isn't available to select to initiate the migration task.

[!INCLUDE [create-database-migration-service-instance](includes/create-database-migration-service-instance.md)]

### Start a new migration

1. In **Step 2** to start a new migration using Database Migration Service from Azure portal, under **Azure Database Migration Services**, select an existing instance of Database Migration Service that you want to use, and then select either **New Migration** or **Start migrations**.

1. Under **Select new migration** scenario, choose your source, target server type, migration mode and choose **Select**.

   :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/dms-portal-select-migration.png" alt-text="Screenshot that shows new migration scenario details.":::

1. Now under Azure SQL Database Offline Migration wizard:

   1. Provide below details to **connect to source SQL server** and select Next:

      - Source server name
      - Authentication type
      - User name and password
      - Connection properties

      :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/dms-portal-sql-database-connect.png" alt-text="Screenshot that shows source SQL server details." lightbox="media/tutorial-sql-server-azure-sql-database-offline/dms-portal-sql-database-connect.png":::

   1. On next page, **select databases for migration**. This page might take some time to populate the list of databases from source.

      :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/dms-portal-sql-database-select-database.png" alt-text="Screenshot that shows list of databases from source.":::

   1. Assuming you have already provisioned the Target based upon the assessment results,  provide the target details on **Connect to target Azure SQL Database** page, and select Next:

      - Azure subscription
      - Azure resource group
      - Target Azure SQL Database server
      - Authentication type
      - User name and password

      :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/dms-portal-sql-database-connect-target.png" alt-text="Screenshot that shows details for target.":::

   1. Under **Map source and target databases**, map the databases between source and target.

      :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/dms-portal-sql-database-map-target.png" alt-text="Screenshot that shows list of mapping between source and target.":::

   1. Before moving to this step, ensure to migrate the schema from source to target for all selected databases. Then, **Select database tables to migrate** for each selected database and select the table/s for which you want to migrate the data".

      :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/dms-portal-sql-database-select-table.png" alt-text="Screenshot that shows list of tables select source database to migrate data to target." lightbox="media/tutorial-sql-server-azure-sql-database-offline/dms-portal-sql-database-select-table.png":::

   1. Review all the inputs provided on **Database migration summary** page and select **Start migration** button to start the database migration.

      :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/dms-portal-sql-database-summary.png" alt-text="Screenshot that shows summary of the migration configuration." lightbox="media/tutorial-sql-server-azure-sql-database-offline/dms-portal-sql-database-summary.png":::

      > [!NOTE]
      > In an offline migration, application downtime starts when the migration starts.
      >
      > Make sure to migrate the database schema from source to target by using the [SQL Server dacpac extension](/azure-data-studio/extensions/sql-server-dacpac-extension) or the [SQL Database Projects extension](/azure-data-studio/extensions/sql-database-project-extension) in Azure Data Studio before selecting the list of tables to migrate.

### Monitor the database migration

1. In the Database Migration Service instance overview, select Monitor migrations to view the details of your database migrations.

   :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/dms-portal-overview.png" alt-text="Screenshot that shows monitor migration dashboard." lightbox="media/tutorial-sql-server-azure-sql-database-offline/dms-portal-overview.png":::

1. Under the **Migrations** tab, you can track migrations that are in progress, completed, and failed (if any), or you can view all database migrations. In the menu bar, select **Refresh** to update the migration status.

   :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/dms-portal-monitor-in-progress.png" alt-text="Screenshot that shows database migration details." lightbox="media/tutorial-sql-server-azure-sql-database-offline/dms-portal-monitor-in-progress.png":::

   Database Migration Service returns the latest known migration status each time migration status refreshes. The following table describes possible statuses:

   | Status | Description |
   | --- | --- |
   | Preparing for copy | The service is disabling autostats, triggers, and indexes in the target table. |
   | Copying | Data is being copied from the source database to the target database. |
   | Copy finished | Data copy is finished. The service is waiting on other tables to finish copying to begin the final steps to return tables to their original schema. |
   | Rebuilding indexes | The service is rebuilding indexes on target tables. |
   | Succeeded | All data is copied and the indexes are rebuilt. |

1. Under **Source name** , select a database name to open the table view. In this view, you see the current status of the migration, the number of tables that currently are in that status, and a detailed status of each table.

   :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/dms-portal-monitor-copy.png" alt-text="Screenshot that shows a migration status." lightbox="media/tutorial-sql-server-azure-sql-database-offline/dms-portal-monitor-copy.png":::

1. When all table data is migrated to the Azure SQL Database target, Database Migration Service updates the migration status from **In progress** to **Succeeded**.

   :::image type="content" source="media/tutorial-sql-server-azure-sql-database-offline/dms-portal-monitor-succeeded.png" alt-text="Screenshot that shows succeeded migration." lightbox="media/tutorial-sql-server-azure-sql-database-offline/dms-portal-monitor-succeeded.png":::

> [!NOTE]
> Database Migration Service optimizes migration by skipping tables with no data (0 rows). Tables that don't have data don't appear in the list, even if you select the tables when you create the migration.

You've completed the migration to Azure SQL Database. We encourage you to go through a series of post-migration tasks to ensure that everything functions smoothly and efficiently.

---

## Limitations

[!INCLUDE [sql-db-limitations](includes/sql-database-limitations.md)]

## Next steps

- [Create an Azure SQL database](/azure/azure-sql/database/single-database-create-quickstart)
- [Azure SQL Database overview](/azure/azure-sql/database/sql-database-paas-overview)
- [Connect apps to Azure SQL Database](/azure/azure-sql/database/connect-query-content-reference-guide)
- [Known issues](known-issues-azure-sql-migration-azure-data-studio.md)
