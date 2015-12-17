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
   ms.date="12/17/2015"
   ms.author="carlrab"/>

# Migrating a SQL Server database to Azure SQL Database

In this article you learn to how to migrate an on-premises SQL Server 2005 or later database to Azure SQL Database. In this migration process you migrate your schema and your data from the SQL Server database in your current environment into SQL Database, provided the existing database passes compatibility tests. With [SQL Database V12](sql-database-v12-whats-new.md), there are very few remaining compatibility issues other than server-level and cross-database operations. Databases and applications that rely on [partially or unsupported functions](sql-database-transact-sql-information.md) will need some re-engineering  to [fix these incompatibilities](sql-database-cloud-migrate-fix-compatibility-issues.md) before the SQL Server database can be migrated. 

> [AZURE.NOTE] To migrate a non-SQL Server database, including Microsoft Access, Sybase, MySQL Oracle, and DB2 to Azure SQL Database, see [SQL Server Migration Assistant](http://blogs.msdn.com/b/ssma/).

## Determine if a SQL Server database is compatible to migrate to SQL Database

> [AZURE.SELECTOR]
- [SqlPackage](sql-database-cloud-migrate-determine-compatibility-sqlpackage.md)
- [SQL Server Management Studio](sql-database-cloud-migrate-determine-compatibility-ssms.md)

To test for SQL Database compatibility issues before you start the migration process, use one of the following methods:

- [Use SqlPackage](sql-database-cloud-migrate-determine-compatibility-sqlpackage.md): SqlPackage is a command-prompt utility will test for and, if found, generate a report containing detected compatibility issues.
- [Use SSMS](sql-database-cloud-migrate-determine-compatibility-ssms.md): The Export Data Tier application wizard in SQL Server management studio will display detected errors to the screen.

## Fix compatibility issues

If compatibility issues are detected, you must fix these compatibility issues before proceeding with the migration.

- Use [SQL Azure Migration Wizard](sql-database-cloud-migrate-fix-compatibility-issues.md#using-sql-azure-migration-wizard)
- Use [SQL Server Data Tools for Visual Studio](sql-database-cloud-migrate-fix-compatibility-issues.md#using-sql-server-data-tools-for-visual-studio)
- Use [SQL Server Management Studio](sql-database-cloud-migrate-fix-compatibility-issues.md#using-sql-server-management-studio)

## Migrate a compatible SQL Server database to SQL Database

To migrate a compatible SQL Server database, Microsoft provides several migration methods for various scenarios. The method you choose depends upon your tolerance for downtime, the size and complexity of your SQL Server database, and your connectivity to the Microsoft Azure cloud.  

> [AZURE.SELECTOR]
- [SSMS Migration Wizard](sql-database-cloud-migrate-compatible-using-ssms-migration-wizard.md)
- [Export to BACPAC File](sql-database-cloud-migrate-compatible-export-bacpac-ssms.md)
- [Import from BACPAC File](sql-database-cloud-migrate-compatible-import-bacpac-ssms.md)
- [Transactional Replication](sql-database-cloud-migrate-compatible-using-transactional-replication.md)

To choose your migration method, the first question to ask is can you afford to take the database out of production during the migration. Migrating a database while active transactions are occurring can result in database inconsistencies and possible database corruption. There are many methods to quiesce a database, from disabling client connectivity to creating a [database snapshot](https://msdn.microsoft.com/library/ms175876.aspx).

To migrate with minimal downtime, use [SQL Server transaction replication](sql-database-cloud-migrate-compatible-using-transactional-replication.md) if your database meets the requirements for transactional replication. If you can afford some downtime or you are performing a test migration of a production database for later migration, consider one of the following three methods:

- [SSMS Migration Wizard](sql-database-cloud-migrate-compatible-using-ssms-migration-wizard.md): For small to medium databases, migrating a compatible SQL Server 2005 or later database is as simple as running the [Deploy Database to Microsoft Azure Database Wizard](sql-database-cloud-migrate-compatible-using-migration-wizard.md) in SQL Server Management Studio. 
- [Export to BACPAC File](sql-database-cloud-migrate-compatible-export-bacpac-ssms.md) and then [Import from BACPAC File](sql-database-cloud-migrate-compatible-import-bacpac-ssms.md): If you have connectivity challenges (no connectivity, low bandwidth, or timeout issues) and for medium to large databases, use a [BACPAC](https://msdn.microsoft.com/library/ee210546.aspx#Anchor_4) file. With this method, you export the SQL Server schema and data to a BACPAC file and then import the BACPAC file into SQL Database using the Export Data Tier Application Wizard in SQL Server Management Studio or the [SqlPackage](https://msdn.microsoft.com/library/hh550080.aspx) command-prompt utility.
- Use BACPAC and BCP together: Use a [BACPAC](https://msdn.microsoft.com/library/ee210546.aspx#Anchor_4) file and [BCP](https://msdn.microsoft.com/library/ms162802.aspx) for much large databases to achieve greater parallelization for increases performance, albeit with greater complexity. With this method, migrate the schema and the data separately. 
 - [Export the schema only to a BACPAC file](sql-database-cloud-migrate-compatible-export-bacpac-ssms.md).
 - [Import the schema only from the BACPAC File](sql-database-cloud-migrate-compatible-import-bacpac-ssms.md) into SQL Database. 
 - Use [BCP](https://msdn.microsoft.com/library/ms162802.aspx) to extract the data into flat files and then [parallel load](https://technet.microsoft.com/library/dd425070.aspx) these files into Azure SQL Database.

	 ![SSMS migration diagram](./media/sql-database-cloud-migrate/01SSMSDiagram_new.png)

