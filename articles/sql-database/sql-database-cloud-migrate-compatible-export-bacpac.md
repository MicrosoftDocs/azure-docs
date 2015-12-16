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
   ms.date="10/12/2015"
   ms.author="carlrab"/>

# Use a BACPAC to Migrate a SQL Server Database to Azure SQL Database

For medium to large databases or when you have connectivity challenges, you can separate the migration process into two discrete steps. You can export of the schema and its data into a [BACPAC](https://msdn.microsoft.com/library/ee210546.aspx#Anchor_4) file using one or two methods.

- [Export to a BACPAC file using SQL Server Management Studio](#export-a-compatible-sql-server-database-to-a-bacpac-file-using-sql-server-management-studio)
- [Export to a BACPAC using SqlPackage](#export-a-compatible-sql-server-database-to-a-bacpac-file-using-sqlpackage)

You can store this BACPAC locally or in an Azure blob. You can then import this BACPAC file into Azure SQL Database using one of several methods.

- [Import from a BACPAC file into Azure SQL Database using SQL Server Management Studio](#import-from-a-bacpac-file-into-azure-sql-database-using-sql-server-management-studio)
- [Import from a BACPAC file into Azure SQL Database using SqlPackage](#import-from-a-bacpac-file-into-azure-sql-database-using-sqlpackage)
- [Import from a BACPAC file into Azure SQL Database using the Azure portal](sql-database-import.md)
- [Import from a BACPAC file into Azure SQL Database using or PowerShell](sql-database-import-powershell.md)

## Export a compatible SQL Server database to a BACPAC file using SQL Server Management Studio

Use the steps below to use Management Studio to export a migrating a [compatible](#determine-if-your-database-is-compatible) SQL Server database to a BACPAC file.

1. Verify that you have version 13.0.600.65 or later of SQL Server Management Studio. New versions of Management Studio are updated monthly to remain in sync with updates to the Azure portal.

	 > [AZURE.IMPORTANT] Download the [latest](https://msdn.microsoft.com/library/mt238290.aspx) version of SQL Server Management Studio. It is recommended that you always use the latest version of Management Studio.

2. Open Management Studio and connect to your source database in Object Explorer.

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/MigrateUsingBACPAC01.png)

3. Right-click the source database in the Object Explorer, point to **Tasks**, and click **Export Data-Tier Application…**

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSSMS01.png)

4. In the export wizard, configure the export to save the BACPAC file to either a local disk location or to an Azure blob. The exported BACPAC always includes the complete database schema and, by default, data from all the tables. Use the Advanced tab if you want to exclude data from some or all of the tables. You might, for example, choose to export only the data for reference tables rather than from all tables.

	![Export settings](./media/sql-database-cloud-migrate/MigrateUsingBACPAC02.png)

## Export a compatible SQL Server database to a BACPAC file using SqlPackage

Use the steps below to use the [SqlPackage.exe](https://msdn.microsoft.com/library/hh550080.aspx) command line utility to export a migrating a [compatible](#determine-if-your-database-is-compatible) database to a BACPAC file.

> [AZURE.NOTE] The steps below assume that you have already provisioned an Azure SQL Database server, have the connection information on hand, and have verified that your source database is compatible.

1. Open a command prompt and change a directory containing the sqlpackage.exe command line utility - this utility ships with both Visual Studio and SQL Server.
2. Execute the following sqlpackage.exe command with the following arguments for your environment:

	'sqlpackage.exe /Action:Export /ssn:< server_name > /sdn:< database_name > /tf:< target_file >

	| Argument  | Description  |
	|---|---|
	| < server_name >  | source server name  |
	| < database_name >  | source database name  |
	| < target_file >  | file name and location for BACPAC file  |

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSQLPackage01b.png)

## Import from a BACPAC file into Azure SQL Database using SQL Server Management Studio

Use the steps below to import from a BACPAC file into Azure SQL Database.

> [AZURE.NOTE] The steps below assume that you have already provisioned your Azure SQL logical instance and have the connection information on hand.

1. Verify that you have version 13.0.600.65 or later of SQL Server Management Studio. New versions of Management Studio are updated monthly to remain in sync with updates to the Azure portal.

	> [AZURE.IMPORTANT] Download the [latest](https://msdn.microsoft.com/library/mt238290.aspx) version of SQL Server Management Studio. It is recommended that you always use the latest version of Management Studio.

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

## Import from a BACPAC file into Azure SQL Database using SqlPackage

Use the steps below to use the [SqlPackage.exe](https://msdn.microsoft.com/library/hh550080.aspx) command line utility to import a compatible SQL Server database (or Azure SQL database) from a BACPAC file.

> [AZURE.NOTE] The steps below assume that you have already provisioned an Azure SQL Database server and have the connection information on hand.

1. Open a command prompt and change a directory containing the sqlpackage.exe command line utility - this utility ships with both Visual Studio and SQL Server.
2. Execute the following sqlpackage.exe command with the following arguments for your environment:

	'sqlpackage.exe /Action:Import /tsn:< server_name > /tdn:< database_name > /tu:< user_name > /tp:< password > /sf:< source_file >

	| Argument  | Description  |
	|---|---|
	| < server_name >  | target server name  |
	| < database_name >  | target database name  |
	| < user_name >  | the user name in the target server |
	| < password >  | the user's password  |
	| < source_file >  | the file name and location for the BACPAC file being imported  |

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSQLPackage01c.png)

