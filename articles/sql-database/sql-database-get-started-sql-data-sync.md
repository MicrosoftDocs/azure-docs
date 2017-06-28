---
title: Getting started with Azure SQL Data Sync (Preview) | Microsoft Docs
description: This tutorial helps you get started with Azure SQL Data Sync (Preview).
services: sql-database
documentationcenter: ''
author: douglaslms
manager: jhubbard
editor: ''

ms.assetid: a295a768-7ff2-4a86-a253-0090281c8efa
ms.service: sql-database
ms.custom: load & move data
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/08/2017
ms.author: douglasl

---
# Getting Started with Azure SQL Data Sync (Preview)
In this tutorial, you learn how to set up Azure SQL Data Sync by creating a hybrid sync group that contains both Azure SQL Database and SQL Server instances. The new sync group is fully configured and synchronizes on the schedule you set.

This tutorial assumes that you have at least some prior experience with SQL Database and with SQL Server. 

For an overview of SQL Data Sync, see [Sync data](sql-database-sync-data.md).

> [!NOTE]
> The complete technical documentation set for Azure SQL Data Sync, formerly located on MSDN, is available as a .pdf. Download it [here](https://github.com/Microsoft/sql-server-samples/raw/master/samples/features/sql-data-sync/Data_Sync_Preview_full_documentation.pdf?raw=true).

## Step 1 - Create sync group

### Locate the Data Sync settings

1.  In your browser, navigate to the Azure portal.

2.  In the portal, locate your SQL databases from your Dashboard or from the SQL Databases icon on the toolbar.

    ![List of Azure SQL databases](media/sql-database-get-started-sql-data-sync/datasync-preview-sqldbs.png)

3.  On the **SQL databases** blade, select the existing SQL database that you want to use as the hub database for Data Sync. The SQL database blade opens.

4.  On the SQL database blade for the selected database, select **Sync to other databases**. The Data Sync blade opens.

    ![Sync to other databases option](media/sql-database-get-started-sql-data-sync/datasync-preview-newsyncgroup.png)

### Create a new Sync Group

1.  On the Data Sync blade, select **New Sync Group**. The **New sync group** blade opens with Step 1, **Create sync group**, highlighted. The **Create Data Sync Group** blade also opens.

2.  On the **Create Data Sync Group** blade, do the following things:

    1.  In the **Sync Group Name** field, enter a name for the new sync group.

    2.  In the **Sync Metadata Database** section, choose whether to create a new database (recommended) or to use an existing database.

        > [!NOTE]
        > Microsoft recommends that you create a new, empty database to use as the Sync Metadata Database. Data Sync creates tables in this database and runs a frequent workload. This database is automatically shared as the Sync Metadata Database for all of your Sync groups in the selected region. You can't change the Sync Metadata Database, its name, or its service level without dropping it.

        If you chose **New database**, select **Create new database.** The **SQL Database** blade opens. On the **SQL Database** blade, name and configure the new database. Then select **OK**.

        If you chose **Use existing database**, select the database from the list.

    3.  In the **Automatic Sync** section, first select **On** or **Off**.

        If you chose **On**, in the **Sync Frequency** section, enter a number and select Seconds, Minutes, Hours, or Days.

        ![Specify sync frequency](media/sql-database-get-started-sql-data-sync/datasync-preview-syncfreq.png)

    4.  In the **Conflict Resolution** section, select "Hub wins" or "Member wins."

        ![Specify how conflicts are resolved](media/sql-database-get-started-sql-data-sync/datasync-preview-conflictres.png)

    5.  Select **OK** and wait for the new sync group to be created and deployed.

## Step 2 - Add sync members

After the new sync group is created and deployed, Step 2, **Add sync members**, is highlighted in the **New sync group** blade.

In the **Hub Database** section, enter the existing credentials for the SQL Database server on which the hub database is located. Don't enter *new* credentials in this section.

![Hub database has been added to sync group](media/sql-database-get-started-sql-data-sync/datasync-preview-hubadded.png)

## Add an Azure SQL Database

In the **Member Database** section, optionally add an Azure SQL Database to the sync group by selecting **Add an Azure Database**. The **Configure Azure Database** blade opens.

On the **Configure Azure Database** blade, do the following things:

1.  In the **Sync Member Name** field, provide a name for the new sync member. This name is distinct from the name of the database itself.

2.  In the **Subscription** field, select the associated Azure subscription for billing purposes.

3.  In the **Azure SQL Server** field, select the existing SQL database server.

4.  In the **Azure SQL Database** field, select the existing SQL database.

5.  In the **Sync Directions** field, select Bi-directional Sync, To the Hub, or From the Hub.

    ![Adding a new SQL Database sync member](media/sql-database-get-started-sql-data-sync/datasync-preview-memberadding.png)

6.  In the **Username** and **Password** fields, enter the existing credentials for the SQL Database server on which the member database is located. Don't enter *new* credentials in this section.

7.  Select **OK** and wait for the new sync member to be created and deployed.

    ![New SQL Database sync member has been added](media/sql-database-get-started-sql-data-sync/datasync-preview-memberadded.png)

## Add an on-premises SQL Server database

In the **Member Database** section, optionally add an on-premises SQL Server to the sync group by selecting **Add an On-Premises Database**. The **Configure On-Premises** blade opens.

On the **Configure On-Premises** blade, do the following things:

1.  Select **Choose the Sync Agent Gateway**. The **Select Sync Agent** blade opens.

    ![Choose the sync agent gateway](media/sql-database-get-started-sql-data-sync/datasync-preview-choosegateway.png)

2.  On the **Choose the Sync Agent Gateway** blade, choose whether to use an existing agent or create a new agent.

    If you chose **Existing agents**, select the existing agent from the list.

    If you chose **Create a new agent**, do the following things:

    1.  Download the client sync agent software from the link provided and install it on the computer where the SQL Server is located.
 
        > [!IMPORTANT]
        > You have to open outbound TCP port 1433 in the firewall to let the client agent communicate with the server.


    2.  Enter a name for the agent.

    3.  Select **Create and Generate Key**.

    4.  Copy the agent key to the clipboard.
        
        ![Creating a new sync agent](media/sql-database-get-started-sql-data-sync/datasync-preview-selectsyncagent.png)

    5.  Select **OK** to close the **Select Sync Agent** blade.

    6.  On the SQL Server computer, locate and run the Client Sync Agent app.

        ![The data sync client agent app](media/sql-database-get-started-sql-data-sync/datasync-preview-clientagent.png)

    7.  In the sync agent app, select **Submit Agent Key**. The **Sync Metadata Database Configuration** dialog box opens.

    8.  In the **Sync Metadata Database Configuration** dialog box, paste in the agent key copied from the Azure portal. Also provide the existing credentials for the Azure SQL Database server on which the metadata database is located. (If you created a new metadata database, this database is on the same server as the hub database.) Select **OK** and wait for the configuration to finish.

        ![Enter the agent key and server credentials](media/sql-database-get-started-sql-data-sync/datasync-preview-agent-enterkey.png)

        >   [!NOTE] 
        >   If you get a firewall error at this point, you have to create a firewall rule on Azure to allow incoming traffic from the SQL Server computer. You can create the rule manually in the portal, but you may find it easier to create it in SQL Server Management Studio (SSMS). In SSMS, try to connect to the hub database on Azure. Enter its name as \<hub_database_name\>.database.windows.net. Follow the steps in the dialog box to configure the Azure firewall rule. Then return to the Client Sync Agent app.

    9.  In the Client Sync Agent app, click **Register** to register a SQL Server database with the agent. The **SQL Server Configuration** dialog box opens.

        ![Add and configure a SQL Server database](media/sql-database-get-started-sql-data-sync/datasync-preview-agent-adddb.png)

    10. In the **SQL Server Configuration** dialog box, choose whether to connect by using SQL Server authentication or Windows authentication. If you chose SQL Server authentication, enter the existing credentials. Provide the SQL Server name and the name of the database that you want to sync. Select **Test connection** to test your settings. Then select **Save**. The registered database appears in the list.

        ![SQL Server database is now registered](media/sql-database-get-started-sql-data-sync/datasync-preview-agent-dbadded.png)

    11. You can now close the Client Sync Agent app.

    12. In the portal, on the **Configure On-Premises** blade, select **Select the Database.** The **Select Database** blade opens.

    13. On the **Select Database** blade, in the **Sync Member Name** field, provide a name for the new sync member. This name is distinct from the name of the database itself. Select the database from the list. In the **Sync Directions** field, select Bi-directional Sync, To the Hub, or From the Hub.

        ![Select the on premises database](media/sql-database-get-started-sql-data-sync/datasync-preview-selectdb.png)

    14. Select **OK** to close the **Select Database** blade. Then select **OK** to close the **Configure On-Premises** blade and wait for the new sync member to be created and deployed. Finally, click **OK** to close the **Select sync members** blade.

        ![On premises database added to sync group](media/sql-database-get-started-sql-data-sync/datasync-preview-onpremadded.png)

3.  To connect to SQL Data Sync and the local agent, add your user name to the role `DataSync_Executor`. Data Sync creates this role on the SQL Server instance.

## Step 3 - Configure sync group

After the new sync group members are created and deployed, Step 3, **Configure sync group**, is highlighted in the **New sync group** blade.

1.  On the **Tables** blade, select a database from the list of sync group members, and then select **Refresh schema**.

2.  From the list of available tables, select the tables that you want to sync.

    ![Select tables to sync](media/sql-database-get-started-sql-data-sync/datasync-preview-tables.png)

3.  By default, all columns in the table are selected. If you don't want to sync all the columns, disable the checkbox for the columns that you don't want to sync.

    ![Select fields to sync](media/sql-database-get-started-sql-data-sync/datasync-preview-tables2.png)

4.  Finally, select **Save**.

## Next steps
Congratulations. You have created a sync group that includes both a SQL Database instance and a SQL Server database.

For more info about SQL Database and SQL Data Sync, see:

-   [Download the complete SQL Data Sync technical documentation](https://github.com/Microsoft/sql-server-samples/raw/master/samples/features/sql-data-sync/Data_Sync_Preview_full_documentation.pdf?raw=true)
-   [Download the SQL Data Sync REST API documentation](https://github.com/Microsoft/sql-server-samples/raw/master/samples/features/sql-data-sync/Data_Sync_Preview_REST_API.pdf?raw=true)
-   [SQL Database Overview](sql-database-technical-overview.md)
-   [Database Lifecycle Management](https://msdn.microsoft.com/library/jj907294.aspx)
