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

Migrating an on-premises SQL Server 2005 or later database to Azure SQL Database requires that you migrate your schema and your data from your current environment into SQL Database. With [SQL Database V12](../sql-database-v12-whats-new.md), you will see very few or not compatibility issues during this migration. Databases and applications that rely on [partially or unsupported functions](../sql-database-transact-sql-information.md) will need some re-engineering  to [fix these incompatibilities](../sql-database-cloud-migrate-fix-compatibility-issues.md) before the SQL Server database can be migrated. 

>[AZURE.NOTE] To migrate a non-SQL Server database, including Microsoft Access, Sybase, MySQL Oracle, and DB2 to Azure SQL Database, see [SQL Server Migration Assistant](http://blogs.msdn.com/b/ssma/).

To test for SQL Database compatibility issues before you start the migration process, use one of the following methods:

- The [sqlpackage.exe command prompt utility](../sql-database-cloud-migrate-determine-compatibility-sqlpackage.md), which will generate a report containing detected issues.
- The [Export Data Tier application wizard](../sql-database-cloud-migrate-determine-compatibility-export-data-tier-application.md), which will display detected errors to the screen.

To migrate a compatible SQL Server datbase, Microsoft provides several migration methods for various scenarios. The method you choose depends upon your tolerance for downtime, the size and complexity of your SQL Server database, and your connectivity to the Microsoft Azure cloud.  

- To migrate a compatible small to medium SQL Server database with downtime, use the [Deploy Database to Microsoft Azure Database Wizard](../sql-database-cloud-migrate-compatible-using-migration-wizard.md) in SQL Server Management Studio to validate compatibility and perform the migration in a single operation. If compatibility issues are detected as the wizard starts the migration process, these issues will be displayed on the console and you must fix these before continuing. 
- To migrate a compatible larger SQL Server database with downtime, use the [BACPAC method](../sql-database-cloud-migrate-compatible-using-bacpac.md) to export the schema and data to a BACPAC file and then import into SQL Database from that BACPAC file. If compatibility issues are detected during generation of the BACPAC file, a report is generated containing these issues and you must fix these before continuing.
- To migrate a compatible database with downtime when you do not have connectivity from the SQL Server database to the Microsoft Azure cloud, use the [BACPAC method](../sql-database-cloud-migrate-compatible-using-bacpac.md). 
- To migrate a compatible SQL Server database with minimal downtime, [use SQL Server transactional replication](../sql-database-cloud-migrate-compatible-using-transactional-replication.md).    


> [AZURE.SELECTOR]
- [Determine Compatibility](sql-database-determine-compatibility.md)
- [Migrate Compatible Database](sql-database-migrate-compatible.md)
- [Fix Database Compatibility Issues](sql-database-fix-compatibility-issues.md)


 