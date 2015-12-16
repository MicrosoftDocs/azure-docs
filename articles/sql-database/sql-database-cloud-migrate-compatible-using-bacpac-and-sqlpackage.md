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

# Using sqlpackage.exe to migrate to SQL Database Using a BACPAC

To migrate a compatible SQL Server database to SQL Database using a BACPAC using sqlpackage.exe involves two distinct steps, exporting to a BACPAC file and then importing the BACPAC file into SQL Database. After exporting, you may choose to upload the exported BACPAC file to Azure blob storage using ???

## Export a compatible SQL Server database to a BACPAC file using SqlPackage

Use the steps below to use the [SqlPackage.exe](https://msdn.microsoft.com/library/hh550080.aspx) command line utility to export [compatible](#determine-if-your-database-is-compatible) database to a BACPAC file.

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
