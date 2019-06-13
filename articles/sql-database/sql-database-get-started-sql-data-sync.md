---
title: Set up Azure SQL Data Sync | Microsoft Docs
description: This tutorial shows you how to set up Azure SQL Data Sync
services: sql-database
ms.service: sql-database
ms.subservice: data-movement
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: allenwux
ms.author: xiwu
ms.reviewer: carlrab
manager: craigg
ms.date: 01/14/2019
---
# Tutorial: Set up SQL Data Sync between Azure SQL Database and SQL Server on-premises

In this tutorial, you learn how to set up Azure SQL Data Sync by creating a sync group that contains both Azure SQL Database and SQL Server instances. The sync group is custom configured and synchronizes on the schedule you set.

The tutorial assumes you have at least some prior experience with SQL Database and SQL Server.

For an overview of SQL Data Sync, see [Sync data across cloud and on-premises databases with Azure SQL Data Sync](sql-database-sync-data.md).

For PowerShell examples on how to configure SQL Data Sync, see [How to sync between Azure SQL databases](scripts/sql-database-sync-data-between-sql-databases.md) or [an Azure SQL Database and a SQL Server on-premises database](scripts/sql-database-sync-data-between-azure-onprem.md)

> [!IMPORTANT]
> Azure SQL Data Sync does **not** support Azure SQL Database Managed Instance at this time.

## Create sync group

1. In the browser, navigate to the Azure portal. Locate your SQL database from the dashboard or, select the **SQL databases** icon on the toolbar and on the **SQL databases** page, select the database you want to use as the hub database for Data Sync.

    > [!NOTE]
    > The hub database a sync topology's central endpoint, in which a sync group has multiple database endpoints. All other member databases with endpoints in the sync group, sync with the hub database.

1. On the **SQL database** page for the selected database, select **Sync to other databases**.

    ![Sync to other databases option](media/sql-database-get-started-sql-data-sync/datasync-overview.png)

1. On the **Sync to other databases** page, select **New Sync Group**. The **New sync group** page opens with **Create sync group (step 1)** highlighted.

   ![Step 1 settings](media/sql-database-get-started-sql-data-sync/stepone.png)

   On the **Create Data Sync Group** page, change the following settings:

   | Setting                        | Description |
   | ------------------------------ | ------------------------------------------------- |
   | **Sync Group Name** | Enter a name for the new sync group. This name is distinct from the name of the database itself. |
   | **Sync Metadata Database** | Choose to create a database (recommended) or to use an existing database.<br/><br/>If you choose **New database**, select **Create new database.** Then on the **SQL Database** page, name and configure the new database and select **OK**.<br/><br/>If you choose **Use existing database**, select the database from the list. |
   | **Automatic Sync** | Select **On** or **Off**.<br/><br/>If you choose **On**, enter a number and select **Seconds**, **Minutes**, **Hours**, or **Days** in the **Sync Frequency** section. |
   | **Conflict Resolution** | Select **Hub win** or **Member win**.<br/><br/>**Hub win** means when conflicts occur, data in the hub database overwrites conflicting data in the member database.<br/><br/>**Member win** means when conflicts occur, data in the member database overwrites conflicting data in the hub database. |

   > [!NOTE]
   > Microsoft recommends to create a new, empty database for use as the **Sync Metadata Database**. Data Sync creates tables in this database and runs a frequent workload. This database is shared as the **Sync Metadata Database** for all Sync Groups in a selected region and you can't change the database or its name without removing all Sync Groups and Sync Agents in the region.

   Select **OK** and wait for the sync group to be created and deployed.

## Add sync members

After the new sync group is created and deployed, **Add sync members (step 2)** is highlighted on the **New sync group** page.

In the **Hub Database** section, enter existing credentials for the SQL Database server on which the hub database is located. Don't enter *new* credentials in this section.

![Step 2 settings](media/sql-database-get-started-sql-data-sync/steptwo.png)

### To add an Azure SQL Database

In the **Member Database** section, optionally add an Azure SQL Database to the sync group by selecting **Add an Azure SQL Database**. The **Configure Azure SQL Database** page opens.

  ![Step 2 - configure database](media/sql-database-get-started-sql-data-sync/steptwo-configure.png)

  On the **Configure Azure SQL Database** page, change the following settings:

  | Setting                       | Description |
  | ----------------------------- | ------------------------------------------------- |
  | **Sync Member Name** | Provide a name for the new sync member. This name is distinct from the database name itself. |
  | **Subscription** | Select the associated Azure subscription for billing purposes. |
  | **Azure SQL Server** | Select the existing SQL Database server. |
  | **Azure SQL Database** | Select the existing SQL database. |
  | **Sync Directions** | Select **Bi-directional Sync**, **To the Hub**, or **From the Hub**. |
  | **Username** and **Password** | Enter the existing credentials for the SQL Database server on which the member database is located. Don't enter *new* credentials in this section. |

  Select **OK** and wait for the new sync member to be created and deployed.

<a name="add-on-prem"></a>
### To add an on-premises SQL Server database

In the **Member Database** section, optionally add an on-premises SQL Server to the sync group by selecting **Add an On-Premises Database**. The **Configure On-Premises** page opens where you can do the following things:

1. Select **Choose the Sync Agent Gateway**. The **Select Sync Agent** page opens.

   ![Creating a sync agent](media/sql-database-get-started-sql-data-sync/steptwo-agent.png)

1. On the **Choose the Sync Agent** page, choose whether to use an existing agent or create an agent.

   If you choose **Existing agents**, select the existing agent from the list.

   If you choose **Create a new agent**, do the following things:

   1. Download the data sync agent from the link provided and install it on the computer where the SQL Server is located. You can also download the agent directly from [SQL Azure Data Sync Agent](https://www.microsoft.com/download/details.aspx?id=27693).

      > [!IMPORTANT]
      > You have to open outbound TCP port 1433 in the firewall to let the client agent communicate with the server.

   1. Enter a name for the agent.

   1. Select **Create and Generate Key** and copy the agent key to the clipboard.

   1. Select **OK** to close the **Select Sync Agent** page.

1. On the SQL Server computer, locate and run the Client Sync Agent app.

   ![The data sync client agent app](media/sql-database-get-started-sql-data-sync/datasync-preview-clientagent.png)

    1. In the sync agent app, select **Submit Agent Key**. The **Sync Metadata Database Configuration** dialog box opens.

    1. In the **Sync Metadata Database Configuration** dialog box, paste in the agent key copied from the Azure portal. Also provide the existing credentials for the Azure SQL Database server on which the metadata database is located. (If you created a metadata database, this database is on the same server as the hub database.) Select **OK** and wait for the configuration to finish.

        ![Enter the agent key and server credentials](media/sql-database-get-started-sql-data-sync/datasync-preview-agent-enterkey.png)

        > [!NOTE]
        > If you get a firewall error, create a firewall rule on Azure to allow incoming traffic from the SQL Server computer. You can create the rule manually in the portal or in SQL Server Management Studio (SSMS). In SSMS, connect to the hub database on Azure by entering its name as <hub_database_name>.database.windows.net.

    1. Select **Register** to register a SQL Server database with the agent. The **SQL Server Configuration** dialog box opens.

        ![Add and configure a SQL Server database](media/sql-database-get-started-sql-data-sync/datasync-preview-agent-adddb.png)

    1. In the **SQL Server Configuration** dialog box, choose to connect using SQL Server authentication or Windows authentication. If you choose SQL Server authentication, enter the existing credentials. Provide the SQL Server name and the name of the database that you want to sync and select **Test connection** to test your settings. Then select **Save** and the registered database appears in the list.

        ![SQL Server database is now registered](media/sql-database-get-started-sql-data-sync/datasync-preview-agent-dbadded.png)

    1. Close the Client Sync Agent app.

1. In the portal, on the **Configure On-Premises** page, select **Select the Database**.

1. On the **Select Database** page, in the **Sync Member Name** field, provide a name for the new sync member. This name is distinct from the name of the database itself. Select the database from the list. In the **Sync Directions** field, select **Bi-directional Sync**, **To the Hub**, or **From the Hub**.

    ![Select the on premises database](media/sql-database-get-started-sql-data-sync/datasync-preview-selectdb.png)

1. Select **OK** to close the **Select Database** page. Then select **OK** to close the **Configure On-Premises** page and wait for the new sync member to be created and deployed. Finally, select **OK** to close the **Select sync members** page.

> [!NOTE]
> To connect to SQL Data Sync and the local agent, add your user name to the role *DataSync_Executor*. Data Sync creates this role on the SQL Server instance.

## Configure sync group

After the new sync group members are created and deployed, **Configure sync group (step 3)** is highlighted in the **New sync group** page.

![Step 3 settings](media/sql-database-get-started-sql-data-sync/stepthree.png)

1. On the **Tables** page, select a database from the list of sync group members and select **Refresh schema**.

1. From the list, select the tables you want to sync. By default, all columns are selected, so disable the checkbox for the columns you don't want to sync. Be sure to leave the primary key column selected.

1. Select **Save**.

1. By default, databases are not synced until scheduled or manually run. To run a manual sync, navigate to your SQL database in the Azure portal, select **Sync to other databases**, and select the sync group. The **Data Sync** page opens. Select **Sync**.

    ![Manual sync](media/sql-database-get-started-sql-data-sync/datasync-sync.png)

## FAQ

**How frequently can Data Sync synchronize my data?**

The minimal duration between synchronizations is five minutes.

**Does SQL Data Sync fully create tables?**

If sync schema tables are missing in the destination database, SQL Data Sync creates them with the columns you selected. However, this doesn't result in a full-fidelity schema for the following reasons:

- Only columns you select are created in the destination table. Columns not selected are ignored.
- Only selected column indexes are created in the destination table. For columns not selected, those indexes are ignored.
- Indexes on XML type columns aren't created.
- CHECK constraints aren't created.
- Triggers on the source tables aren't created.
- Views and stored procedures aren't created.

Because of these limitations, we recommend the following things:

- For production environments, create the full-fidelity schema yourself.
- When experimenting with the service, use the auto-provisioning feature.

**Why do I see tables I didn't create?**

Data Sync creates additional tables in the database for change tracking. Don't delete these or Data Sync stops working.

**Is my data convergent after a sync?**

Not necessarily. Take a sync group with a hub and three spokes (A, B, and C) where synchronizations are Hub to A, Hub to B, and Hub to C. If a change is made to database A *after* the Hub to A sync, that change isn't written to database B or database C until the next sync task.

**How do I get schema changes into a sync group?**

Make and propagate all schema changes manually.

1. Replicate the schema changes manually to the hub and to all sync members.
1. Update the sync schema.

For adding new tables and columns:

New tables and columns don't impact the current sync and Data Sync ignores them until they're added to the sync schema. When adding new database objects, follow the sequence:

1. Add new tables or columns to the hub and to all sync members.
1. Add new tables or columns to the sync schema.
1. Begin inserting values into the new tables and columns.

For changing the data type of a column:

When you change the data type of an existing column, Data Sync continues to work as long as the new values fit the original data type defined in the sync schema. For example, if you change the type in the source database from **int** to **bigint**, Data Sync continues to work until you insert a value too large for the **int** data type. To complete the change, replicate the schema change manually to the hub and to all sync members, then update the sync schema.

**How can I export and import a database with Data Sync?**

After you export a database as a *.bacpac* file and import the file to create a database, do the following to use Data Sync in the new database:

1. Clean up the Data Sync objects and additional tables on the new database by using [this script](https://github.com/vitomaz-msft/DataSyncMetadataCleanup/blob/master/Data%20Sync%20complete%20cleanup.sql). The script deletes all the required Data Sync objects from the database.
1. Recreate the sync group with the new database. If you no longer need the old sync group, delete it.

**Where can I find information on the client agent?**

For frequently asked questions about the client agent, see [Agent FAQ](sql-database-data-sync-agent.md#agent-faq).

## Next steps

Congratulations. You've created a sync group that includes both a SQL Database instance and a SQL Server database.

For more info about SQL Data Sync, see:

- [Data Sync Agent for Azure SQL Data Sync](sql-database-data-sync-agent.md)
- [Best practices](sql-database-best-practices-data-sync.md) and [How to troubleshoot issues with Azure SQL Data Sync](sql-database-troubleshoot-data-sync.md)
- [Monitor SQL Data Sync with Azure Monitor logs](sql-database-sync-monitor-oms.md)
- [Update the sync schema with Transact-SQL](sql-database-update-sync-schema.md) or [PowerShell](scripts/sql-database-sync-update-schema.md)

For more info about SQL Database, see:

- [SQL Database Overview](sql-database-technical-overview.md)
- [Database Lifecycle Management](https://msdn.microsoft.com/library/jj907294.aspx)
