<properties
   pageTitle="Import to SQL Database from a BACPAC file using SqlPackage"
   description="Microsoft Azure SQL Database, database migration, import database, import BACPAC file, sqlpackage"
   services="sql-database"
   documentationCenter=""
   authors="CarlRabeler"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="sqldb-migrate"
   ms.date="06/07/2016"
   ms.author="carlrab"/>

# Import to SQL Database from a BACPAC file using SqlPackage

> [AZURE.SELECTOR]
- [SSMS](sql-database-cloud-migrate-compatible-import-bacpac-ssms.md)
- [SqlPackage](sql-database-cloud-migrate-compatible-import-bacpac-sqlpackage.md)
- [Azure Portal](sql-database-import.md)
- [PowerShell](sql-database-import-powershell.md)

This article shows how to import to SQL database from a [BACPAC](https://msdn.microsoft.com/library/ee210546.aspx#Anchor_4) file using the [SqlPackage](https://msdn.microsoft.com/library/hh550080.aspx) command-prompt utility. This utility ships with both Visual Studio and SQL Server. You can also [download](https://msdn.microsoft.com/library/mt204009.aspx) the latest version of SQL Server Data Tools to get this utility.

> [AZURE.NOTE] The steps below assume that you have already provisioned a SQL Database server, have the connection information on hand, and have verified that your source database is compatible.

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

## Next steps

- [Newest version of SSDT](https://msdn.microsoft.com/library/mt204009.aspx)
- [Newest version of SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx)

## Additional resources

- [SQL Database V12](sql-database-v12-whats-new.md)
- [Transact-SQL partially or unsupported functions](sql-database-transact-sql-information.md)
- [Migrate non-SQL Server databases using SQL Server Migration Assistant](http://blogs.msdn.com/b/ssma/)
