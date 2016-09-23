<properties
	pageTitle="Getting started with SQL Databases Data Sync"
	description="This tutorial helps you get started with the Azure SQL Data Sync (Preview)."
	services="sql-database"
	documentationCenter=""
	authors="jennieHubbard"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/11/2016"
	ms.author="jhubbard"/>


#Getting Started with Azure SQL Data Sync (Preview)
In this tutorial, you learn the fundamentals of Azure SQL Data Sync using the Azure Classic Portal.

This tutorial assumes minimal prior experience with SQL Server and Azure SQL Database. In this tutorial, you create a hybrid (SQL Server and SQL Database instances) sync group fully configured and synchronizing on the schedule you set.

> [AZURE.NOTE] The complete technical documentation set for Azure SQL Data Sync, formerly located on MSDN, is available as a .pdf. Download it [here](http://download.microsoft.com/download/4/E/3/4E394315-A4CB-4C59-9696-B25215A19CEF/SQL_Data_Sync_Preview.pdf).

## Step 1: Connect to the Azure SQL Database

1. Sign in to the [Classic Portal](http://manage.windowsazure.com).

2. Click **SQL DATABASES** in the left pane.

3. Click **SYNC** at the bottom of the page. When you click SYNC, a list appears showing the things you can add - **New Sync Group** and **New Sync Agent**.

4. To launch the New SQL Data Sync Agent wizard, click **New Sync Agent**.

5. If you haven't added an agent before, **click download it here**.

	![Image1](./media/sql-database-get-started-sql-data-sync/SQLDatabaseScreen-Figure1.PNG)


## Step 2: Add a Client Agent
This step is required only if you are going to have an on-premises SQL Server database included in your sync group. 
Skip to Step 4 if your sync group has only SQL Database instances.

<a id="InstallRequiredSoftware"></a>
### Step 2a: Install the required software
Be sure that you have the following installed on the computer where you install the Client Agent.

- **.NET Framework 4.0**

 Install .NET Framework 4.0 from [here](http://go.microsoft.com/fwlink/?linkid=205836).

- **Microsoft SQL Server 2008 R2 SP1 System CLR Types (x86)**

 Install the Microsoft SQL Server 2008 R2 SP1 System CLR Types (x86) from  [here](http://www.microsoft.com/download/en/details.aspx?id=26728)

- **Microsoft SQL Server 2008 R2 SP1 Shared Management Objects (x86)**

 Install the Microsoft SQL Server 2008 R2 SP1 Shared Management Objects (x86) from [here](http://www.microsoft.com/download/en/details.aspx?id=26728)



<a id="InstallClient"></a>
### Step 2b: Install a new Client Agent

Follow the instructions in [Install a Client Agent (SQL Data Sync)](http://download.microsoft.com/download/4/E/3/4E394315-A4CB-4C59-9696-B25215A19CEF/SQL_Data_Sync_Preview.pdf) to install the agent.



<a id="RegisterSSDb"></a>
### Step 2c: Finish the New SQL Data Sync Agent wizard

1. 	Return to the New SQL Data Sync Agent wizard.
2.	Give the agent a meaningful name.
3.	From the dropdown, select the **REGION** (data center) to host this agent.
4.	From the dropdown, select the **SUBSCRIPTION** to host this agent.
5.	Click the right-arrow.



## Step 3: Register a SQL Server database with the Client Agent

After the Client Agent is installed, register every on-premises SQL Server database that you intend to include in a sync group with the agent.
To register a database with the agent, follow the instructions at [Register a SQL Server Database with a Client Agent](http://download.microsoft.com/download/4/E/3/4E394315-A4CB-4C59-9696-B25215A19CEF/SQL_Data_Sync_Preview.pdf).



## Step 4: Create a sync group


<a id="StartNewSGWizard"></a>
### Step 4a: Start the New Sync Group wizard

1.	Return to the [Classic Portal](http://manage.windowsazure.com).
2.	Click **SQL DATABASES**.
3.	Click **ADD SYNC** at the bottom of the page then select New Sync Group from the drawer.

	![Image2](./media/sql-database-get-started-sql-data-sync/NewSyncGroup-Figure2.png)



<a id=""></a>
### Step 4b: Enter the basic settings


1.	Enter a meaningful name for the sync group.
2.	From the dropdown, select the **REGION** (Data Center) to host this sync group.
3. Click the right-arrow.

	![Image3](./media/sql-database-get-started-sql-data-sync/NewSyncGroupName-Figure3.PNG)


<a id="DefineHubDB"></a>
### Step 4c: Define the sync hub

1. From the dropdown, select the SQL Database instance to serve as the sync group hub.
2. Enter the credentials for this SQL Database instance - **HUB USERNAME** and **HUB PASSWORD**.
3. Wait for SQL Data Sync to confirm the USERNAME and PASSWORD. You will see a green check mark appear to the right of the PASSWORD when the credentials are confirmed.
4. From the dropdown, select the **CONFLICT RESOLUTION** policy.

 **Hub Wins** - any change written to the hub database write to the reference databases, overwriting changes in the same reference database record. Functionally, this means that the first change written to the hub propagates to the other databases.


 **Client Wins** - changes written to the hub are overwritten by changes in reference databases. Functionally, this means that the last change written to the hub is the one kept and propagated to the other databases.

5.	Click the right-arrow.

	![Image4](./media/sql-database-get-started-sql-data-sync/NewSyncGroupHub-Figure4.PNG)

<a id="AddRefDB"></a>
### Step 4d: Add a reference database


Repeat this step for each additional database you want to add to the sync group.

1. From the dropdown, select the database to add.

	Databases in the dropdown include both SQL Server databases that have been registered with the agent and SQL Database instances.
2.	Enter credentials for this database - **USERNAME** and **PASSWORD**.
3.	From the dropdown, select the **SYNC DIRECTION** for this database.

	**Bi-directional** - changes in the reference database are written to the hub database, and changes to the hub database are written to the reference database.

	**Sync from the Hub** - The database receives updates from the Hub. It does not send changes to the Hub.

	**Sync to the Hub** - The database sends updates to the Hub. Changes in the Hub are not written to this database.

4.	To finish creating the sync group, click the check mark in the lower right of the wizard. Wait for the SQL Data Sync to confirm the credentials. A green check indicates that the credentials are confirmed.

5.	Click the check mark a second time. This returns you to the **SYNC** page under SQL Databases. This sync group is now listed with your other sync groups and agents.

	![Image5](./media/sql-database-get-started-sql-data-sync/NewSyncGroupReference-Figure5.PNG)


## Step 5: Define the data to sync

Azure SQL Data Sync allows you to select tables and columns to synchronize. If you also want to filter a column so that only rows with specific values (such as, Age>=65) synchronize, use the SQL Data Sync portal at Azure and the documentation at Select the Tables, Columns, and Rows to Synchronize to define the data to sync.

1.	Return to the [Classic Portal](http://manage.windowsazure.com).
2.	Click **SQL DATABASES**.
3.	Click the **SYNC** tab.
4.	Click the name of this sync group.
5.	Click the **SYNC RULES** tab.
6.	Select the database you want to provide the sync group schema.
7.	Click the right-arrow.
8.	Click **REFRESH SCHEMA**.
9.	For each table in the database, select the columns to include in the synchronizations.
	- Columns with unsupported data types cannot be selected.
	- If no columns in a table are selected, the table is not included in the sync group.
	- To select/unselect all the tables, click SELECT at the bottom of the screen.
10.	Click **SAVE**, then wait for the sync group to finish provisioning.
11.	To return to the Data Sync landing page, click the back-arrow in the upper left of the screen (above the sync group's name).

	![Image6](./media/sql-database-get-started-sql-data-sync/NewSyncGroupSyncRules-Figure6.PNG)

## Step 6: Configure your sync group

You can always synchronize a sync group by clicking SYNC at the bottom of the Data Sync landing page.
To synchronize on a schedule, you configure the sync group.

1.	Return to the [Classic Portal](http://manage.windowsazure.com).
2.	Click **SQL DATABASES**.
3.	Click the **SYNC** tab.
4.	Click the name of this sync group.
5.	Click the **CONFIGURE** tab.
6.	**AUTOMATIC SYNC**
	- To configure the sync group to sync on a set frequency, click **ON**. You can still sync on demand by clicking SYNC.
	- Click **OFF** to configure the sync group to sync only when you click SYNC.
7.	**SYNC FREQUENCY**
	- If AUTOMATIC SYNC is ON, set the synchronization frequency. The frequency must be between 5 Minutes and 1 Month.
8.	Click **SAVE**.

![Image7](./media/sql-database-get-started-sql-data-sync/NewSyncGroupConfigure-Figure7.PNG)

Congratulations. You have created a sync group that includes both a SQL Database instance and a SQL Server database.

## Next steps
For additional information on SQL Database and SQL Data Sync see:

* [Download the complete SQL Data Sync technical documentation](http://download.microsoft.com/download/4/E/3/4E394315-A4CB-4C59-9696-B25215A19CEF/SQL_Data_Sync_Preview.pdf)
* [SQL Database Overview](sql-database-technical-overview.md)
* [Database Lifecycle Management](https://msdn.microsoft.com/library/jj907294.aspx)
 

 
