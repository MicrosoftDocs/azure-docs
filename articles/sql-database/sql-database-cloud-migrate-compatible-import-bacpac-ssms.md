<properties
   pageTitle="Migrating a SQL Server database to Azure SQL Database"
   description="Microsoft Azure SQL Database, database deploy, database migration, import database, export database, migration wizard"
   services="sql-database"
   documentationCenter=""
   authors="carlrabeler"
   manager="jeffreyg"
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management"
   ms.date="03/14/2016"
   ms.author="carlrab"/>

# Import from BACPAC to SQL Database using SSMS

> [AZURE.SELECTOR]
- [SSMS](sql-database-cloud-migrate-compatible-import-bacpac-ssms.md)
- [SqlPackage](sql-database-cloud-migrate-compatible-import-bacpac-sqlpackage.md)
- [Azure Portal](sql-database-import.md)
- [PowerShell](sql-database-import-powershell.md)

This article shows how to import from a [BACPAC](https://msdn.microsoft.com/library/ee210546.aspx#Anchor_4) file to SQL Database using the Export Data Tier Application Wizard in SQL Server Management Studio.

> [AZURE.NOTE] The steps below assume that you have already provisioned your Azure SQL logical instance and have the connection information on hand.

1. Verify that you have the latest version of SQL Server Management Studio. New versions of Management Studio are updated monthly to remain in sync with updates to the Azure portal.

	 > [AZURE.IMPORTANT] It is recommended that you always use the latest version of Management Studio to remain synchronized with updates to Microsoft Azure and SQL Database. [Update SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx).

2. Open Management Studio and connect to your source database in Object Explorer.

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/MigrateUsingBACPAC01.png)

3. Once the BACPAC has been created, connect to your Azure SQL Database server, right-click the **Databases** folder and click **Import Data-tier Application...**

    ![Import data-tier application menu item](./media/sql-database-cloud-migrate/MigrateUsingBACPAC03.png)

4.	In the import wizard, choose the BACPAC file you just exported to create the new database in Azure SQL Database.

    ![Import settings](./media/sql-database-cloud-migrate/MigrateUsingBACPAC04.png)

5.	Provide the **New database name** for the database on Azure SQL DB, set the **Edition of Microsoft Azure SQL Database** (service tier), **Maximum database size** and **Service Objective** (performance level).

    ![Database settings](./media/sql-database-cloud-migrate/MigrateUsingBACPAC05.png)

6.	Click **Next** and then click **Finish** to import the BACPAC file into a new database in the Azure SQL Database server.

7. Using Object Explorer, connect to your migrated database in your Azure SQL Database server.

8.	Using the Azure Portal, view your database and its properties.

