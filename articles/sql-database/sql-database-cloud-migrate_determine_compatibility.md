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
   ms.date="12/15/2015"
   ms.author="carlrab"/>

# Determine if your database is compatible
There are two primary methods to use to determine if your source database is compatible.
- Export Data Tier Application: This method uses a wizard in Management Studio to analyze your database and displays database compatibility issues, if any,  on the console.
- SQLPackage: This method uses the SQLPackage.exe [sqlpackage.exe](https://msdn.microsoft.com/library/hh550080.aspx) command-line utility to analyze your database and generate a report. SQLPackage ships with Visual Studio and SQL Server.

> [AZURE.NOTE] There is a third method that will uses trace files as additional source information to test for compatibility at the application level as well as at the database level. This is the [SQL Azure Migration wizard](http://sqlazuremw.codeplex.com/), a free tool on Codeplex. However, this tool currently may find compatibility errors that were issues for Azure SQL Database V11 that are not issues for Azure SQL Database V12.

If database incompatibilities are detected, you must fix these incompatibilities before you can migrate your database to Azure SQL Database. For guidance on how to fix database compatibility issues, go to [fix database compatibility issues](#fix-database-compatibility-issues).

> [AZURE.IMPORTANT] These options do not catch all of the compatibility issues between different levels of SQL Server databases (i.e. level 90, 100, and 110). If you are migrating from an older database (level 80, 90, 100, and 110), you should go through the upgrade process first (at least in the dev environment) and once on SQL Server 2014 or later, then migrate to Azure SQL Database.

## Determine if your database is compatible using sqlpackage.exe

1. Open a command prompt and change a directory containing the newest version of sqlpackage.exe. This utility ships with both Visual Studio and SQL Server. You can also [download](https://msdn.microsoft.com/library/mt204009.aspx) the latest version of SQL Server Data Tools to get this utility.
2. Execute the following sqlpackage.exe command with the following arguments for your environment:

	'sqlpackage.exe /Action:Export /ssn:< server_name > /sdn:< database_name > /tf:< target_file > /p:TableData=< schema_name.table_name > > < output_file > 2>&1'

	| Argument  | Description  |
	|---|---|
	| < server_name >  | source server name  |
	| < database_name >  | source database name  |
	| < target_file >  | file name and location for BACPAC file  |
	| < schema_name.table_name >  | the tables for which data will be output to the target file  |
	| < output_file >  | the file name and location for the output file with errors, if any  |

	The reason for the /p:TableName argument is that we only want to test for database compability for export to Azure SQL DB V12 rather than export the data from all tables. Unfortunately, the export argument for sqlpackage.exe does not support extracting no tables, so you will need to specify a single small table. The < output_file > will contain the report of any errors. The "> 2>&1" string pipes both the standard output and the standard error resulting from the command execution to specified output file.

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSQLPackage01.png)

3. Open the output file and review the compatibility errors, if any. For guidance on how to fix database compatibility issues, go to [fix database compatibility issues](#fix-database-compatibility-issues).

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSQLPackage02.png)

## Determine if your database is compatible using Export Data Tier Application

1. Verify that you have version 13.0.600.65 or later of SQL Server Management Studio. New versions of Management Studio are updated monthly to remain in sync with updates to the Azure portal.

 	 > [AZURE.IMPORTANT] Download the [latest](https://msdn.microsoft.com/library/mt238290.aspx) version of SQL Server Management Studio. It is recommended that you always use the latest version of Management Studio.

2. Open Management Studio and connect to your source database in Object Explorer.
3. Right-click the source database in the Object Explorer, point to **Tasks**, and click **Export Data-Tier Application…**

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSSMS01.png)

4. In the export wizard, click **Next**, and then on the **Settings** tab, configure the export to save the BACPAC file to either a local disk location or to an Azure blob. A BACPAC file will only be saved if you have no database compatibility issues. If there are compatibility issues, they will be displayed on the console.

	![Export settings](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSSMS02.png)

5. Click the **Advanced tab** and clear the **Select All** checkbox to skip exporting data. Our goal at this point is only to test for compatibility.

	![Export settings](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSSMS03.png)

6. Click **Next** and then click **Finish**. Database compatibility issues, if any, will appear after the wizard validates the schema.

	![Export settings](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSSMS04.png)

7. If no errors appear, your database is compatible and you are ready to migrate. If you have errors, you will need to fix them. To see the errors, click **Error** for **Validating schema**. For how to fix these errors, go to [fix database compatibility issues](#fix-database-compatibility-issues).

	![Export settings](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSSMS05.png)

8.	If the *.BACPAC file is successfully generated, then your database is compatible with SQL Database, and you are ready to migrate.

