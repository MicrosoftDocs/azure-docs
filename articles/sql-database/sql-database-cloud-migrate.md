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

# Migrating a SQL Server database to Azure SQL Database

> [AZURE.SELECTOR]
- [Determine Compatibility](sql-database-cloud-migrate-determine-compatibility-sqlpackage.md)
- [Migrate Compatible Database](sql-database-migrate-compatible.md)
- [Fix Database Compatibility Issues](sql-database-fix-compatibility-issues.md)

This article discusses migrating an on-premises SQL Server 2005 or later database to Azure SQL Database. The migration process requires that you validate the existing database for compatibility and then migrate your schema and your data from your current environment into SQL Database. With [SQL Database V12](../sql-database-v12-whats-new.md), you will see very few or not compatibility issues during this migration. Databases and applications that rely on [partially or unsupported functions](../sql-database-transact-sql-information.md) will need some re-engineering  to [fix these incompatibilities](../sql-database-cloud-migrate-fix-compatibility-issues.md) before the SQL Server database can be migrated. 

>[AZURE.NOTE] To migrate a non-SQL Server database, including Microsoft Access, Sybase, MySQL Oracle, and DB2 to Azure SQL Database, see [SQL Server Migration Assistant](http://blogs.msdn.com/b/ssma/).

## Determine if a SQL Server database is compatible to migrate to SQL Database

To test for SQL Database compatibility issues before you start the migration process, use one of the following methods:

- The [SqlPackage command prompt utility](../sql-database-cloud-migrate-determine-compatibility-sqlpackage.md), which will generate a report containing detected issues.
- The [Export Data Tier application wizard](../sql-database-cloud-migrate-determine-compatibility-export-data-tier-application.md), which will display detected errors to the screen.

To migrate a compatible SQL Server database, Microsoft provides several migration methods for various scenarios. The method you choose depends upon your tolerance for downtime, the size and complexity of your SQL Server database, and your connectivity to the Microsoft Azure cloud.  

## Migrate a compatible SQL Server database to SQL Database

After you have verified that you have a compatible database, you choose your migration method. First, you need to decide if you can afford to take the database out of production during the migration. If not, use [SQL Server transaction replication](sql-database-cloud-migrate-compatible-using-transactional-replication.md). If you can afford some downtime or you are performing a test migration of your production database that you may later choose to migrate using transactional replication, consider one of the following three methods:

> [AZURE.SELECTOR]
- [SSMS Migration Wizard](sql-database-cloud-migrate-compatible-using-ssms-migration-wizard.md)
- [Export to BACPAC File](sql-database-cloud-migrate-compatible-export-bacpac.md)
- [Import from BACPAC File](sql-database-cloud-migrate-compatible-import-bacpac.md)
- [Transactional Replication](sql-database-cloud-migrate-compatible-using-transactional-replication.md)

- Use the Deploy Database to Microsoft Azure Database Wizard in SQL Server Management Studio for small to medium databases, migrating a compatible SQL Server 2005 or later database is as simple as running the [Deploy Database to Microsoft Azure Database Wizard](sql-database-cloud-migrate-compatible-using-migration-wizard.md) in SQL Server Management Studio. 
- Use a [BACPAC](https://msdn.microsoft.com/en-us/library/ee210546.aspx#Anchor_4) file if you have connectivity challenges (no connectivity, low bandwidth, or timeout issues) and for medium to large databases. With this method, you export the SQL Server schema and data to a BACPAC file and then import the BACPAC file into SQL Database.
- Use a [BACPAC](https://msdn.microsoft.com/en-us/library/ee210546.aspx#Anchor_4) file and [BCP](https://msdn.microsoft.com/library/ms162802.aspx) for much large database to achieve greater parallelization. With this method, migrate the schema and the data separately. You begin by creating a BACPAC file with no data and import this BACPAC into SQL Database. After the schema has been imported into Azure SQL Database, you then use BCP to extract the data into flat files and then [parallel load](https://technet.microsoft.com/en-us/library/dd425070.aspx) these files into Azure SQL Database.

	 ![SSMS migration diagram](./media/sql-database-cloud-migrate/01SSMSDiagram_new.png)

> [AZURE.WARNING] Before migrating your database using any of these methods, ensure that no active transactions are occurring to ensure transactional consistency during the migration. There are many methods to quiesce a database, from disabling client connectivity to creating a [database snapshot](https://msdn.microsoft.com/library/ms175876.aspx).
