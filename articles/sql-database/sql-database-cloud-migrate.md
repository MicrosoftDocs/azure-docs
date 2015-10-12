<properties
   pageTitle="Migrating a SQL Server Database to Azure SQL Database"
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

# Migrating a SQL Server database to Azure SQL Database

Azure SQL Database V12 brings near-complete engine compatibility with SQL Server 2014 and SQL Server 2016. For compatible databases, migration to Azure SQL Database is a straightforward schema and data movement operation requiring few, if any, changes to the schema and little or no re-engineering of applications. Where databases need to be changed, the scope of these changes is more confined than with Azure SQL Database V11.

By design, server-scoped features of SQL Server are not supported by Azure SQL Database V12. Databases and applications that rely on these features will need some re-engineering before they can be migrated.

> [AZURE.IMPORTANT] These options do not catch all of the compatibility issues between different levels of SQL Server databases (i.e. level 90, 100, and 110). If you are migrating from an older database (level 80, 90, 100, and 110), you should go through the upgrade process first (at least in the dev environment) and once on SQL Server 2014 or later, then migrate to Azure SQL Database.
<br></br>
>[AZURE.NOTE] To migrate other types of databases, including Microsoft Access, Sybase, MySQL Oracle, and DB2 to Azure SQL Database, see [SQL Server Migration Assistant](http://blogs.msdn.com/b/ssma/).

The workflow for migrating a SQL Server database to Azure SQL Database are:

 1. [Determine if your database is compatible](#determine-if-your-database-is-compatible)
 2. [If not compatible, fix database compatibility issues](#fix-database-compatibility-issues)
 3. [Migrate a compatible database](#options-to-migrate-a-compatible-database-to-azure-sql-database)

## Determine if your database is compatible
Use the Export Data Tier Application wizard in Management Studio or use the [sqlpackage.exe](https://msdn.microsoft.com/library/hh550080.aspx) command-line version of this wizard. If database incompatibilities are detected, you will need to fix these incompatibilities before you can migrate your database to Azure SQL Database. For guidance on how to fix compatibility issues, go to [fix compatibility issues](#fix-compatibility-issues).

> [AZURE.TIP] If you want to generate a report of database incompatibilities that you will need to fix, use [sqlpackage.exe](https://msdn.microsoft.com/library/hh550080.aspx).


##Determine if your database is compatible using sqlpackage.exe

1. Open a command prompt and change a directory containing the newest version of sqlpackage.exe. This utility ships with both Visual Studio and SQL Server.
2. Execute the following command, substituting for the following arguments: < server_name >, < database_name >, < target_file >, < schema_name.table_name > and < output_file >. The reason for the /p:TableName argument is that we only want to test for database compability for export to Azure SQL DB V12 rather than export the data from all tables. Unfortunately, the export argument for sqlpackage.exe does not support extracting no tables, so you will need to specify a single small table. The < outputfile > will contain the report of any errors.

	'sqlpackage.exe /Action:Export /ssn:< server_name > /sdn:< database_name > /tf:< target_file > /p:TableData=< schema_name.table_name > > < output_file > 2>&1'

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSQLPackage01.png)

3. Open the output file and review the compatibility errors, if any. For guidance on how to fix compatibility issues, go to [fix compatibility issues](#fix-compatibility-issues).

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSQLPackage02.png)

##Determine if your database is compatible using Export Data Tier Application

 1. Verify that you have version 13.0.600.65 or later of SQL Server Management Studio. New versions of Management Studio are updated monthly to remain in sync with updates to the Azure portal.

 > [AZURE.IMPORTANT] Download the [latest](https://msdn.microsoft.com/library/mt238290.aspx) version of SQL Server Management Studio. It is recommended that you always use the latest version of Management Studio.

2. Open Management Studio and connect to your source database.
3. Right-click the source database in the Object Explorer, point to **Tasks**, and click **Export Data-Tier Application…**

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSSMS01.png)

3. In the export wizard, on the **Settings** tab, configure the export to save a BACPAC file to either a local disk location or to an Azure blob. A BACPAC file will only be saved if you have no database compatibility issues. If there are compatibility issues, they will be displayed on the console.

	![Export settings](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSSMS02.png)

4. Click the **Advanced tab** and clear the **Select All** checkbox to skip exportation of the data at this point. Our goal here is only to test for compatibility.

	![Export settings](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSSMS03.png)

5. Click **Next** and then click **Finish**.
6. Database compatibility issues, if any, will appear after the wizard validates the schema.

	![Export settings](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSSMS04.png)

7. If no errors appear, your database is compatible and you are ready to migrate. If you have errors, you will need to fix them. To see the errors, click **Error** for **Validating schema**. For how to fix these errors, go to [fix compatibility issues](#fix-compatibility-issues).

	![Export settings](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSSMS05.png)

## Options to migrate a compatible database to Azure SQL Database

- For small to medium databases, migrating compatible SQL Server 2005 or later databases is as simple as running the [Deploy Database to Microsoft Azure Database wizard in SQL Server Management Studio](#use-the-deploy-database-to-microsoft-azure-database-wizard-in-sql-server-management-studio). If you have connectivity challenges (no connectivity, low bandwidth, or timeout issues), you can [use a BACPAC to migrate](#use-a-bacpac-to-migrate-a-database-to-azure-sql-database) a SQL Server database to Azure SQL Database.
- For medium to large databases or when you have connectivity challenges, [use a BACPAC to migrate](#use-a-bacpac-to-migrate-a-database-to-azure-sql-database) a SQL Server database to Azure SQL Database. With this method, you use SQL Server Management Studio to export the data and schema to a [BACPAC](https://msdn.microsoft.com/library/ee210546.aspx) file (stored locally or in an Azure blob) and then import the BACPAC file into your Azure SQL instance. If you store the BACPAC in an Azure blob, you can also [import the BACPAC file](sql-database-import.md) from within the Azure portal or using PowerShell.
- For larger databases, you will achieve the best performance by migrating the schema and the data separately. With this method, you script the schema using SQL Server Management Studio or create a database project in Visual Studio and then deploy the schema to Azure SQL Database. After the schema has been imported into Azure SQL Database, you then use [BCP](https://msdn.microsoft.com/library/ms162802.aspx) to extract the data into flat files and then import these files into Azure SQL Database.

 ![SSMS migration diagram](./media/sql-database-migrate-ssms/01SSMSDiagram.png)

##Use the Deploy Database to Microsoft Azure Database wizard in SQL Server Management Studio

The Deploy Database to Microsoft Azure Database wizard in SQL Server Management Studio migrates a compatible SQL Server 2005 or later database directly to your Azure SQL logical server instance.

> [AZURE.NOTE] The steps below assume that you have already provisioned your Azure SQL logical instance and have the connection information on hand.

1. Verify that you have version 13.0.600.65 or later of SQL Server Management Studio. New versions of Management Studio are updated monthly to remain in sync with updates to the Azure portal.

	 > [AZURE.IMPORTANT] Download the [latest](https://msdn.microsoft.com/library/mt238290.aspx) version of SQL Server Management Studio. It is recommended that you always use the latest version of Management Studio.

2. Open Management Studio and connect to your source database in Object Explorer.
3. Right-click the source database in the Object Explorer, point to **Tasks**, and click **Deploy Database to Microsoft Azure SQL Database…**

	![Deploy to Azure from Tasks menu](./media/sql-database-cloud-migrate/MigrateUsingDeploymentWizard01.png)

4.	In the deployment wizard, configure the connection to your Azure SQL Database server.
5.	Provide the **New database name** for the database on Azure SQL DB, set the **Edition of Microsoft Azure SQL Database** (service tier), **Maximum database size**, **Service Objective** (performance level), and **Temporary file name** for the BACPAC file that this wizard creates during the migration process.

	> [AZURE.NOTE]	See [Azure SQL Database service tiers](sql-database-service-tiers.md) for more information on service tiers and performance levels.

	![Export settings](./media/sql-database-cloud-migrate/MigrateUsingDeploymentWizard02.png)

6.	Complete the wizard to migrate the database. Depending on the size and complexity of the database, deployment may take from a few minutes to many hours.
7.	Using Object Explorer, connect to your migrated database in your Azure SQL Database server.
8.	Using the Azure Portal, view your database and its properties.

##Use a BACPAC to Migrate a Database to Azure SQL Database

For medium to large databases or when you have connectivity challenges, you can separate the migration process into two discrete steps. You can export of the schema and its data into a [BACPAC](https://msdn.microsoft.com/library/ee210546.aspx) file. You can store this BACPAC locally or in an Azure blob. Next, you can import this BACPAC file into Azure SQL Database.

##Export a compatible database to a BACPAC file using SQL Server Management Studio

Use the steps below to use Management Studio to export a compatible database to a BACPAC file.

1. Verify that you have version 13.0.600.65 or later of SQL Server Management Studio. New versions of Management Studio are updated monthly to remain in sync with updates to the Azure portal.

	 > [AZURE.IMPORTANT] Download the [latest](https://msdn.microsoft.com/library/mt238290.aspx) version of SQL Server Management Studio. It is recommended that you always use the latest version of Management Studio.

2. Open Management Studio and connect to your source database in Object Explorer.

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/MigrateUsingBACPAC01.png)

3. Right-click the source database in the Object Explorer, point to **Tasks**, and click **Export Data-Tier Application…**

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSSMS01.png)

4. In the export wizard, configure the export to save the BACPAC file to either a local disk location or to an Azure blob. The exported BACPAC always includes the complete database schema and, by default, data from all the tables. Use the Advanced tab if you want to exclude data from some or all of the tables. You might, for example, choose to export only the data for reference tables rather than from all tables.

	![Export settings](./media/sql-database-cloud-migrate/MigrateUsingBACPAC02.png)

##Export a compatible database to a BACPAC file using SqlPackage.exe

Use the steps below to use the [SqlPackage.exe](https://msdn.microsoft.com/library/hh550080.aspx) command line utility to export a compatible database to a BACPAC file.

> [AZURE.NOTE] The steps below assume that you have already provisioned an Azure SQL Database server, have the connection information on hand, and have verified that your source database is compatible.

1. Open a command prompt and change a directory containing the sqlpackage.exe command line utility - this utility ships with both Visual Studio and SQL Server.
2. Execute the following command, substituting for the following arguments: < server_name >, < database_name >, and < target_file >.

	'sqlpackage.exe /Action:Export /ssn:< server_name > /sdn:< database_name > /tf:< target_file >

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSQLPackage01.png)

##Import from a BACPAC file into Azure SQL Database using SQL Server Management Studio

Use the steps below to import from a BACPAC file into Azure SQL Database.

> [AZURE.NOTE] The steps below assume that you have already provisioned your Azure SQL logical instance and have the connection information on hand.

1. Verify that you have version 13.0.600.65 or later of SQL Server Management Studio. New versions of Management Studio are updated monthly to remain in sync with updates to the Azure portal.

	 > [AZURE.IMPORTANT] Download the [latest](https://msdn.microsoft.com/library/mt238290.aspx) version of SQL Server Management Studio. It is recommended that you always use the latest version of Management Studio.

2. Open Management Studio and connect to your source database in Object Explorer.

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/MigrateUsingBACPAC01.png)

    Once the BACPAC has been created, connect to your Azure SQL Database server, right-click the **Databases** folder and click **Import Data-tier Application...**

    	>[AZURE.NOTE] Note: You could also import the BACPAC file stored in an Azure blob directly from within the Azure management portal.

    	![Import data-tier application menu item](./media/sql-database-cloud-migrate/MigrateUsingBACPAC03.png)

3.	In the import wizard, choose the BACPAC file you just exported to create the new database in Azure SQL Database.

    	![Import settings](./media/sql-database-cloud-migrate/MigrateUsingBACPAC04.png)

4.	Provide the **New database name** for the database on Azure SQL DB, set the **Edition of Microsoft Azure SQL Database** (service tier), **Maximum database size** and **Service Objective** (performance level).

        > [AZURE.NOTE]	See [Azure SQL Database service tiers](sql-database-service-tiers.md) for more information on service tiers and performance levels.

        ![Database settings](./media/sql-database-cloud-migrate/MigrateUsingBACPAC05.png)

5.	Click **Next** and then click **Finish** to import the BACPAC file into a new database in the Azure SQL Database server.

6. Using Object Explorer, connect to your migrated database in your Azure SQL Database server.

7.	Using the Azure Portal, view your database and its properties.

###Import from a BACPAC file into Azure SQL Database using the Azure portal or PowerShell

You can also import a BACPAC file into Azure SQL Database from within the Azure portal or by using PowerShell. For more information, see [Import a BACPAC to a SQL Database](sql-database-import.md)

##Fix database compatibility issues

If you determine that your source SQL Server database is not compatible, you have a number of options to fix the database compatibility issues that you [identified previously](#determine-if-your-database-is-compatible).

- Use the [SQL Azure Migration wizard](http://sqlazuremw.codeplex.com/). You can use this Codeplex tool to generate a T-SQL script from an incompatible source database that is then transformed by the wizard to make it compatible with the SQL Database and then connect to Azure SQL Database to execute the script. This tool will also analyze trace files to determine compatiblity issues. The script can be generated with schema only or can include data in BCP format. Additional documentation, including step-by-step guidance is available on Codeplex at [SQL Azure Migration wizard](http://sqlazuremw.codeplex.com/).  

 ![SAMW migration diagram](./media/sql-database-cloud-migrate/02SAMWDiagram.png)

 > [AZURE.NOTE] Note that not all incompatible schema that can be detected by the wizard can be processed by its built-in transformations. Incompatible script that cannot be addressed will be reported as errors, with comments injected into the generated script. If many errors are detected, use either Visual Studio or SQL Server Management Studio to step through and fix each error that could not be fixed using the SQL Server Migration Wizard.

- Use Visual Studio. You can use Visual Studio to import the database schema into a Visual Studio database project for analysis. To analyze, you specify the target platform for the project as SQL Database V12 and then build the project. If the build is successful, the database is compatible. If the build fails, you can resolve the errors in SQL Server Data Tools for Visual Studio ("SSDT"). Once the project builds successfully, you can publish it back as a copy of the source database and then use the data compare feature in SSDT to copy the data from the source database to the Azure SQL V12 compatible database. This updated database is then deployed to Azure SQL Database using the options [discussed previously](#options-to-migrate-a-compatible-database-to-azure-sql-database).

 ![VSSSDT migration diagram](./media/sql-database-cloud-migrate/03VSSSDTDiagram.png)

 > [AZURE.NOTE] If schema-only migration is required, the schema can be published directly from Visual Studio directly to Azure SQL Database. Use this method when the database schema requires more changes than can be handled by the migration wizard alone.

- SQL Server Management Studio. You can fix the issues in Management Studio using various Transact-SQL commands, such as **ALTER DATABASE**.
