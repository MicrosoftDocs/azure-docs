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

Moving your on-premises SQL Server database to Azure SQL Database varies in complexity based on your database and application design, and your tolerance for downtime. For compatible databases, migration to SQL Database is a straightforward schema and data movement operation requiring few, if any, changes to the schema and little or no re-engineering of applications. 


>[AZURE.NOTE] To migrate a non-SQL Server database, including Microsoft Access, Sybase, MySQL Oracle, and DB2 to Azure SQL Database, see [SQL Server Migration Assistant](http://blogs.msdn.com/b/ssma/).

[SQL Database V12](../sql-database-v12-whats-new.md) brings near-complete engine compatibility with SQL Server 2014 and SQL Server 2016 databases. Most Transact-SQL statements are fully supported in SQL Database. This includes data types, operators, functions, and other Transact-SQL elements that applications depend upon. Partially or unsupported functions are usually related to differences in how SQL Database manages the database (such as file, high availability, and security features) or for special purpose features such as service broker. Because SQL Database isolates many features from dependency on the master database, many server-level activities are inappropriate and unsupported. Features deprecated in SQL Server are generally not supported in SQL Database. Databases and applications that rely on [partially or unsupported functions](../sql-database-transact-sql-information.md) will need some re-engineering before they can be migrated.

Before you can begin to migrate a compatible SQL Server database, you need to determine if your database is compatible. If it is not, you will need to fix incompatibilities that you have identified.

> [AZURE.SELECTOR]
- [Determine Compatibility](sql-database-geo-replication-portal.md)
- [Migrate Compatible Database](sql-database-geo-replication-powershell.md)
- [Fix Database Compatibility Issues](sql-database-geo-replication-transact-sql.md)
