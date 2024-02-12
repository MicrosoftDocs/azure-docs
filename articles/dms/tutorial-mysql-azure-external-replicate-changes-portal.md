---
title: "Tutorial: Migrate from MySQL to Azure Database for MySQL - Flexible Server using DMS Replicate Changes via the Azure portal"
titleSuffix: "Azure Database Migration Service"
description: "Learn to perform an online migration from MySQL to Azure Database for MySQL - Flexible Server by using Azure Database Migration Service Replicate Changes Scenario"
author: adig
ms.author: adig
ms.reviewer: maghan
ms.date: 08/07/2023
ms.service: dms
ms.topic: tutorial
ms.custom:
  - sql-migration-content
---

# Tutorial: Migrate from MySQL to Azure Database for MySQL - Flexible Server online using DMS Replicate Changes scenario

> [!NOTE]
> This article contains references to the term *slave*, a term that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

You can migrate your on-premises or other cloud services MySQL Server to Azure Database for MySQL – Flexible Server by using Azure Database Migration Service (DMS), a fully managed service designed to enable seamless migrations from multiple database sources to Azure data platforms. In this tutorial, we’ll perform an online migration of a sample database from an on-premises MySQL server to an Azure Database for MySQL - Flexible Server (both running version 5.7) using a DMS Replicate Changes migration activity.

Running a Replicate changes Migration, with our offline scenario with "Enable Transactional Consistency" enables businesses to migrate their databases to Azure while the databases remain operational. In other words, migrations can be completed with minimum downtime for critical applications, limiting the impact on service level availability and inconvenience to their end customers.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
>
> * Create a MySQL Replicate Changes migration project in DMS.
> * Run the Replicate Changes migration.
> * Monitor the migration.
> * Perform post-migration steps.

## Prerequisites

To complete this tutorial, you need to:

* Use the MySQL command line tool of your choice to determine whether **log_bin** is enabled on the source server. The Binlog isn't always turned on by default, so verify that it's enabled before starting the migration. To determine whether log_bin is enabled on the source server, run the command: **SHOW VARIABLES LIKE 'log_bin'**.
* Ensure that the user has **"REPLICATION_APPLIER"** or **"BINLOG_ADMIN"** permission on target server for applying the bin log.
* Ensure that the user has **"REPLICATION SLAVE"** permission on the target server.
* Ensure that the user has **"REPLICATION CLIENT"** and **"REPLICATION SLAVE"** permission on the source server for reading and applying the bin log.
* Run an offline migration scenario with "**Enable Transactional Consistency"** to get the bin log file and position.
    :::image type="content" source="media/tutorial-mysql-to-azure-single-replicate-changes/01-offline-migration-binlog-pos.png" alt-text="Screenshot of binlog position of an Azure Database Migration Service offline migration.":::

* If you're targeting a replicate changes migration, configure the **binlog_expire_logs_seconds** parameter on the source server to ensure that binlog files aren't purged before the replica commits the changes. We recommend at least two days, to begin with. After a successful cutover, the value can be reset.

## Limitations

As you prepare for the migration, be sure to consider the following limitations.

* When performing a replicate changes migration, the name of the database on the target server must be the same as the name on the source server.
* Support is limited to the ROW binlog format.
* DDL changes replication is supported only when you have selected the option for **Replicate data definition and administration statements for selected objects** on DMS UI. The replication feature supports replicating data definition and administration statements that occur after the initial load and are logged in the binary log to the target.
* Renaming databases or tables is not supported when replicating changes.

### Create a Replicate Changes migration project

To create a Replicate Changes migration project, perform the following steps.  

1. In the Azure portal, select **All services**, search for Azure Database Migration Service, and then select **Azure Database Migration Services**.

    :::image type="content" source="media/tutorial-azure-mysql-single-to-flex-online/10-dms-search.png" alt-text="Screenshot of a Locate all instances of Azure Database Migration Service.":::

2. In the search results, select the DMS instance that you created for running the preliminary offline migration, and then select **+ New Migration Project**.

    :::image type="content" source="media/tutorial-azure-mysql-single-to-flex-online/11-select-create.png" alt-text="Screenshot of a Select a new migration project.":::

3. On the **New migration project** page, specify a name for the project, in the **Source server type** selection box, select **MySQL**, in the **Target server type** selection box, select **Azure Database For MySQL - Flexible Server**, in the **Migration activity type** selection box, select **Replicate changes**, and then select **Create and run activity**.

### Configure the migration project

To configure your DMS migration project, perform the following steps.

1. On the **Select source** screen, we have to ensure that DMS is in the VNet which has connectivity to the source server. Here you will input source server name, server port, username, and password to your source server.
       :::image type="content" source="media/tutorial-azure-mysql-external-to-flex-online/select-source-server.png" alt-text="Screenshot of an Add source details screen.":::

2. Select **Next : Select target>>**, and then, on the **Select target** screen, locate the server based on the subscription, location, and resource group. The user name is auto populated, then provide the password for the target flexible server.
       
    :::image type="content" source="media/tutorial-mysql-to-azure-mysql-online/select-target-online.png" alt-text="Screenshot of a Select target.":::

3. Select **Next : Select databases>>**, and then, on the **Select databases** tab, under **Server migration options**, select **Migrate all applicable databases** or under **Select databases** select the server objects that you want to migrate.

    > [!NOTE]
    > There is now a **Migrate all applicable databases** option. When selected, this option will migrate all user created databases and tables. Note that because Azure Database for MySQL - Flexible Server does not support mixed case databases, mixed case databases on the source will not be included for an online migration.

    :::image type="content" source="media/tutorial-azure-mysql-external-to-flex-online/select-databases.png" alt-text="Screenshot of a Select database.":::

4. In the **Select databases** section, under **Source Database**, select the database(s) to migrate.

    The non-table objects in the database(s) you specified will be migrated, while the items you didn’t select will be skipped. You can only select the source and target databases whose names match that on the source and target server.
    If you select a database on the source server that doesn’t exist on the target server, it will be created on the target server.

5. Select **Next : Select tables>>** to navigate to the **Select tables** tab.

    Before the tab populates, DMS fetches the tables from the selected database(s) on the source and target and then determines whether the table exists and contains data.

6. Select the tables that you want to migrate.

    If the selected source table doesn't exist on the target server, the online migration process will ensure that the table schema and data is migrated to the target server.
   :::image type="content" source="media/tutorial-azure-mysql-external-to-flex-online/select-tables.png" alt-text="Screenshot of a Select Tables.":::

    DMS validates your inputs, and if the validation passes, you'll be able to start the migration.

7. After configuring for schema migration, select **Review and start migration**.
    > [!NOTE]
    > You only need to navigate to the **Configure migration settings** tab if you are trying to troubleshoot failing migrations.

8. On the **Summary** tab, in the **Activity name** text box, specify a name for the migration activity, and then review the summary to ensure that the source and target details match what you previously specified.
   :::image type="content" source="media/tutorial-azure-mysql-external-to-flex-online/summary-page.png" alt-text="Screenshot of a Select Summary.":::

9. Select **Start migration**.

    The migration activity window appears, and the Status of the activity is Initializing. The Status changes to Running when the table migrations start.
   :::image type="content" source="media/tutorial-mysql-to-azure-mysql-online/running-online-migration.png" alt-text="Screenshot of a Running status.":::

### Monitor the migration

1. After the **Initial Load** activity is completed, navigate to the **Initial Load** tab to view the completion status and the number of tables completed.
       :::image type="content" source="media/tutorial-azure-mysql-external-to-flex-online/initial-load.png" alt-text="Screenshot of a completed initial load migration.":::

   After  the **Initial Load** activity is completed, you're navigated to the **Replicate Data Changes** tab automatically. You can monitor the migration progress as the screen is auto-refreshed every 30  seconds.

2. Select **Refresh** to update the display and view the seconds behind source when needed.

     :::image type="content" source="media/tutorial-azure-mysql-external-to-flex-online/replicate-changes.png" alt-text="Screenshot of a Monitoring migration.":::

3. Monitor the **Seconds behind source** and as soon as it nears 0, proceed to start cutover by navigating to the **Start Cutover** menu tab at the top of the migration activity screen.

4. Follow the steps in the cutover window before you're ready to perform a cutover.

5. After completing all steps, select **Confirm**, and then select **Apply**.
     :::image type="content" source="media/tutorial-mysql-to-azure-mysql-online/21-complete-cutover-online.png" alt-text="Screenshot of a Perform cutover.":::

## Perform post-migration activities

When the migration has finished, be sure to complete the following post-migration activities.

* Perform sanity testing of the application against the target database to certify the migration.
* Update the connection string to point to the new flexible server.
* Delete the source server after you have ensured application continuity.
* To clean up the DMS  resources, perform the following steps:
    1. In the Azure portal, select **All services**, search for Azure Database Migration Service, and then select **Azure Database Migration Services**.
    2. Select your migration service instance from the search results, and then select **Delete service**.
    3. In the confirmation dialog box, in the **TYPE THE DATABASE MIGRATION SERVICE NAME** textbox, specify the name of the instance, and then select **Delete**.

## Migration best practices

When performing a migration, be sure to consider the following best practices.

* As part of discovery and assessment, take the server SKU, CPU usage, storage, database sizes, and extensions usage as some of the critical data to help with migrations.
* Perform test migrations before migrating for production:
  * Test migrations are important for ensuring that you cover all aspects of the database migration, including application testing. The best practice is to begin by running a migration entirely for testing purposes. After a newly started migration enters the Replicate Data Changes phase with minimal lag, only use your Flexible Server target for running test workloads. Use that target for testing the application to ensure expected performance and results. If you're migrating to a higher MySQL version, test for application compatibility.
  * After testing is completed, you can migrate the production databases. At this point, you need to finalize the day and time of production migration. Ideally, there's low application use at this time. All stakeholders who need to be involved should be available and ready. The production migration requires close monitoring. For an online migration, the replication must be completed before you perform the cutover, to prevent data loss.
* Redirect all dependent applications to access the new primary database and make the source server read-only. Then, open the applications for production usage.
* After the application starts running on the target flexible server, monitor the database performance closely to see if performance tuning is required.

## Next steps

* For information about Azure Database for MySQL - Flexible Server, see [Overview - Azure Database for MySQL Flexible Server](./../mysql/flexible-server/overview.md).
* For information about Azure Database Migration Service, see [What is Azure Database Migration Service?](./dms-overview.md).
* For information about known issues and limitations when migrating to Azure Database for MySQL - Flexible Server using DMS, see [Known Issues With Migrations To Azure Database for MySQL - Flexible Server](./known-issues-azure-mysql-fs-online.md).
* For information about known issues and limitations when performing migrations using DMS, see [Common issues - Azure Database Migration Service](./known-issues-troubleshooting-dms.md).
* For troubleshooting source database connectivity issues while using DMS, see article [Issues connecting source databases](./known-issues-troubleshooting-dms-source-connectivity.md).
