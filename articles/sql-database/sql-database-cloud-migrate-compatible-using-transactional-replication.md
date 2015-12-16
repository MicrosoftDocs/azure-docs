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

# Using transactional replication to migrate to SQL Database with no downtime

When you need to cannot afford to remove your your SQL Server database from production while the migration is occurring, you can use SQL Server transactional replication as your migration solution. With transactional replication, all changes to your data or schema that happen between the moment you start migrating and the moment you complete the migration will show up in your Azure SQL Database. Once the migration is complete, you just need to change the connection string of your applications to point them to your Azure SQL Database instead of pointing them to your on premise database. Once transactional replication drains any changes left on your on-premises database and all your applications point to Azure DB, you can now safely uninstall replication leaving your Azure SQL Database as the production system.

 ![SeedCloudTR diagram](./media/sql-database-cloud-migrate/SeedCloudTR.png)


Transactional replication is a technology built-in and integrated with SQL Server since SQL Server 6.5. It is a very mature and proven technology that most of DBAs know with which they have experience. With the [SQL Server 2016 preview](http://www.microsoft.com/server-cloud/products/sql-server-2016/), it is now possible to configure your Azure SQL Database as a [transactional replication subscriber](https://msdn.microsoft.com/library/mt589530.aspx) to your on-premises publication. The experience that you get setting it up from Management Studio is exactly the same as if you set up a transactional replication subscriber on an on-premises server. Support for this scenario is supported with the following SQL Server versions:

 - SQL Server 2016 CTP3 (preview) and above 
 - SQL Server 2014 SP1 CU3 and above
 - SQL Server 2014 RTM CU10 and above
 - SQL Server 2012 SP2 CU8 and above
 - SQL Server 2013 SP3 when it will release

You can also use transactional replication to migrate a subset of your on-premises database. The publication that you replicate to Azure SQL Database can be limited to a subset of the tables in the database being replicated. Additionally, for each table being replicated, you can limit the data to a subset of the rows and/or a subset of the columns.

## Use Deploy Database to Microsoft Azure Database Wizard

The Deploy Database to Microsoft Azure Database wizard in SQL Server Management Studio migrates a migrating a [compatible](#determine-if-your-database-is-compatible) SQL Server 2005 or later database directly to your Azure SQL logical server instance.

> [AZURE.NOTE] The steps below assume that you have already [provisioned](../sql-database-get-started.md) your Azure SQL logical instance and have the connection information on hand.

1. Verify that you have version 13.0.600.65 or later of SQL Server Management Studio. New versions of Management Studio are updated monthly to remain in sync with updates to the Azure portal.

	 > [AZURE.IMPORTANT] Download the [latest](https://msdn.microsoft.com/library/mt238290.aspx) version of SQL Server Management Studio. It is recommended that you always use the latest version of Management Studio.

2. Open Management Studio and connect to your source database in Object Explorer.
3. Right-click the source database in the Object Explorer, point to **Tasks**, and click **Deploy Database to Microsoft Azure SQL Database…**

	![Deploy to Azure from Tasks menu](./media/sql-database-cloud-migrate/MigrateUsingDeploymentWizard01.png)

4.	In the deployment wizard, click **Next**, and then click **Connect** to configure the connection to your Azure SQL Database server.

	![Deploy to Azure from Tasks menu](./media/sql-database-cloud-migrate/MigrateUsingDeploymentWizard002.png)

5. In the Connect to Server dialog box, enter your connection information to connect to your Azure SQL Database server.

	![Deploy to Azure from Tasks menu](./media/sql-database-cloud-migrate/MigrateUsingDeploymentWizard00.png)

5.	Provide the **New database name** for the database on Azure SQL DB, set the **Edition of Microsoft Azure SQL Database** (service tier), **Maximum database size**, **Service Objective** (performance level), and **Temporary file name** for the BACPAC file that this wizard creates during the migration process. See [Azure SQL Database service tiers](sql-database-service-tiers.md) for more information on service tiers and performance levels.

	![Export settings](./media/sql-database-cloud-migrate/MigrateUsingDeploymentWizard02.png)

6.	Complete the wizard to migrate the database. Depending on the size and complexity of the database, deployment may take from a few minutes to many hours.
7.	Using Object Explorer, connect to your migrated database in your Azure SQL Database server.
8.	Using the Azure Portal, view your database and its properties.

## Use a BACPAC to Migrate a SQL Server Database to Azure SQL Database

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


## Fix database compatibility issues

If you determine that your source SQL Server database is not compatible, you have a number of options to fix the database compatibility issues that you [identified previously](#determine-if-your-database-is-compatible).

- Use the [SQL Azure Migration wizard](http://sqlazuremw.codeplex.com/). You can use this Codeplex tool to generate a T-SQL script from an incompatible source database that is then transformed by the wizard to make it compatible with the SQL Database and then connect to Azure SQL Database to execute the script. This tool will also analyze trace files to determine compatiblity issues. The script can be generated with schema only or can include data in BCP format. Additional documentation, including step-by-step guidance is available on Codeplex at [SQL Azure Migration wizard](http://sqlazuremw.codeplex.com/).  

 ![SAMW migration diagram](./media/sql-database-cloud-migrate/02SAMWDiagram.png)

 > [AZURE.NOTE] Note that not all incompatible schema that can be detected by the wizard can be processed by its built-in transformations. Incompatible script that cannot be addressed will be reported as errors, with comments injected into the generated script. If many errors are detected, use either Visual Studio or SQL Server Management Studio to step through and fix each error that could not be fixed using the SQL Server Migration Wizard.

- Use Visual Studio. You can use Visual Studio to import the database schema into a Visual Studio database project for analysis. To analyze, you specify the target platform for the project as SQL Database V12 and then build the project. If the build is successful, the database is compatible. If the build fails, you can resolve the errors in SQL Server Data Tools for Visual Studio ("SSDT"). Once the project builds successfully, you can publish it back as a copy of the source database and then use the data compare feature in SSDT to copy the data from the source database to the Azure SQL V12 compatible database. This updated database is then deployed to Azure SQL Database using the options [discussed previously](#options-to-migrate-a-compatible-database-to-azure-sql-database).

 ![VSSSDT migration diagram](./media/sql-database-cloud-migrate/03VSSSDTDiagram.png)

 > [AZURE.NOTE] If schema-only migration is required, the schema can be published directly from Visual Studio directly to Azure SQL Database. Use this method when the database schema requires more changes than can be handled by the migration wizard alone.

- SQL Server Management Studio. You can fix the issues in Management Studio using various Transact-SQL commands, such as **ALTER DATABASE**.
