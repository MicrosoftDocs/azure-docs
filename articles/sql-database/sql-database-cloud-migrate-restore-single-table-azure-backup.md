<properties
	pageTitle="Restore a single table from Azure SQL Database backup | Microsoft Azure"
	description="Learn how to restore a single table from Azure SQL Database backup."
	keywords="sql connection,connection string,connectivity issues,transient error,connection error"
	services="sql-database"
	documentationCenter=""
	authors="dalechen"
	manager="felixwu"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/19/2016"
	ms.author="daleche"/>


# How to restore a single table in a database from an Azure SQL Database backup

This article describes the steps about how to restore a single table in a database from an Azure SQL Database backup. To do this, follow these steps:

## Preparation steps: Rename the table and restore a copy of the database
1. Identify the table in your Azure SQL Database that you want to replace with the restored copy, and then rename the table by using Microsoft SQL Management Studio. For example, rename the table’s name to &lt;Table name&gt;_bak.

	**Note** Make sure that there's no activity on the table that's being renamed. If you encounter issues, please do this procedure during maintenance window.

2. Restore your database to the desired restore time. To do this, refer to the steps in [Recover an Azure SQL Database from a user error](../sql-database/sql-database-user-error-recovery.md).

	**Notes**:
	- The restore process restores the database that uses DBName+TimeStamp as database name, for example, **MyTestdb_2016-01-01T22-12Z**. This step won't overwrite the existing database name on the server. This is part of safety measure, and the intention is to verify the restored database before user drops their current database and rename the restored DB for their production use.
	- This step will create a new database in the server where your current database is. Microsoft maintains PITR for every Performance tier from Basic to Premier. The restore point varies between each tiers.

| DB Restore | Basic tier | Standard tiers | Premium tiers |
| :-- | :-- | :-- | :-- |
|  Point In Time Restore |  Any restore point within 7 days|Any restore point within 14 days| Any restore point within 35 days|

## Copying the table from the restored database by using SQL Database Migration tool
1. Download and install [SQL Database Migration Wizard](https://sqlazuremw.codeplex.com).

2. Open **SQL Database Migration wizard**, in the **Select Process** page, select **Database under Analyze/migrate**, and then click **Next**.
![SQL Database Migration wizard - Select Process](./media/sql-database-cloud-migrate-restore-single-table-azure-backup/1.png)
3. In **Connect to Server** dialog box, use the following settings:
 - **Server name**: Your SQL Azure instance
 - **Authentication**: **SQL Server Authentication**. Fill in the corresponding login credentials.
 - **Database**: **Master DB (List all databases)**.
 - **Note** By default the wizard saves your Login information. You can select **Forget Login information**.
![SQL Database Migration wizard - Select Source - step 1](./media/sql-database-cloud-migrate-restore-single-table-azure-backup/2.png)
4. On **Select Source** dialog box, select the restored DB name from the **Preparation steps** section as source, and then click **Next**.

	![SQL Database Migration wizard - Select Source - step 2](./media/sql-database-cloud-migrate-restore-single-table-azure-backup/3.png)

5. In **Choose Objects** dialog box, select **Select specific database objects**, and then select the table(s) that you want to migrate to the target server.
![SQL Database Migration wizard - Choose Objects](./media/sql-database-cloud-migrate-restore-single-table-azure-backup/4.png)

6. In **Script Wizard Summary**, click **Yes** to Ready to generate SQL Script prompt. Optionally, you get an option to save the TSQL Script for later use.
![SQL Database Migration wizard - Script Wizard Summary](./media/sql-database-cloud-migrate-restore-single-table-azure-backup/5.png)

7. In **Results Summary**, click **Next**.
![SQL Database Migration wizard - Results Summary](./media/sql-database-cloud-migrate-restore-single-table-azure-backup/6.png)

8. In **Setup Target Server**,  click **Connect to Server**, and then fill the details as follows:
	- **Server Name**: Target Server instance
	- **Authentication**: **SQL Server authentication**. Fill in the corresponding login credentials.
	- **Database**: **Master DB (List all databases)**. This option lists all the databases on the target server.

	![SQL Database Migration wizard - Setup Target Server Connection](./media/sql-database-cloud-migrate-restore-single-table-azure-backup/7.png)

9. Click **Connect**, and then select the target database that you want to move the table to, and then click **Next**. This should complete executing the previously generated script and you should see the table that's moved copied to the target database.

## Verification step
1. Query and test the newly copied table to make sure the data is intact. Upon confirmation, you can drop the renamed table that is form **Preparation steps** section. For example, &lt;Table name&gt;_bak.
