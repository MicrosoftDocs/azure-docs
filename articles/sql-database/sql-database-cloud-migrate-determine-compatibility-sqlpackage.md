<properties
   pageTitle="Determine SQL Database compatibility using SqlPackage.exe"
   description="Microsoft Azure SQL Database, database migration, SQL Database compatibility, SqlPackage"
   services="sql-database"
   documentationCenter=""
   authors="carlrabeler"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management"
   ms.date="03/14/2016"
   ms.author="carlrab"/>

# Determine SQL Database compatibility using SqlPackage.exe

> [AZURE.SELECTOR]
- [SqlPackage](sql-database-cloud-migrate-determine-compatibility-sqlpackage.md)
- [SQL Server Management Studio](sql-database-cloud-migrate-determine-compatibility-ssms.md)

In this article you learn to determine if a SQL Server database is compatible to migrate to SQL Database using the [SqlPackage](https://msdn.microsoft.com/library/hh550080.aspx) command-prompt utility.

## Using SqlPackage.exe

1. Open a command prompt and change a directory containing the newest version of sqlpackage.exe. This utility ships with both Visual Studio and SQL Server. Download the [newest version of SQL Server Data Tools for Visual Studio](https://msdn.microsoft.com/library/mt204009.aspx) to get the latest version of the SqlPackage utility.
2. Execute the following SqlPackage command with the following arguments for your environment:

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

3. Open the output file and review the compatibility errors, if any. 

	![Export a data-tier application from the Tasks menu](./media/sql-database-cloud-migrate/TestForCompatibilityUsingSQLPackage02.png)

## Next step: Fix compatibility issues, if any

[Fix database compatibility issues](sql-database-cloud-migrate-fix-compatibility-issues.md), if any.
