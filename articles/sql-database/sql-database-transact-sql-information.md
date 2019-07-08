---
title: Resolving T-SQL differences-migration-Azure SQL Database | Microsoft Docs
description: Transact-SQL statements that are less than fully supported in Azure SQL Database
services: sql-database
ms.service: sql-database
ms.subservice: single-database
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer:
manager: craigg
ms.date: 12/03/2018
---
# Resolving Transact-SQL differences during migration to SQL Database

When [migrating your database](sql-database-single-database-migrate.md) from SQL Server to Azure SQL Server, you may discover that your database requires some re-engineering before the SQL Server can be migrated. This article provides guidance to assist you in both performing this re-engineering and understanding the underlying reasons why the re-engineering is necessary. To detect incompatibilities, use the [Data Migration Assistant (DMA)](https://www.microsoft.com/download/details.aspx?id=53595).

## Overview

Most Transact-SQL features that applications use are fully supported in both Microsoft SQL Server and Azure SQL Database. For example, the core SQL components such as data types, operators, string, arithmetic, logical, and cursor functions, work identically in SQL Server and SQL Database. There are, however, a few T-SQL differences in DDL (data-definition language) and DML (data manipulation language) elements resulting in T-SQL statements and queries that are only partially supported (which we discuss later in this article).

In addition, there are some features and syntax that is not supported at all because Azure SQL Database is designed to isolate features from dependencies on the master database and the operating system. As such, most server-level activities are inappropriate for SQL Database. T-SQL statements and options are not available if they configure server-level options, operating system components, or specify file system configuration. When such capabilities are required, an appropriate alternative is often available in some other way from SQL Database or from another Azure feature or service.

For example, high availability is built into Azure SQL Database using technology similar to [Always On Availability Groups](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/always-on-availability-groups-sql-server). T-SQL statements related to availability groups are not supported by SQL Database, and the dynamic management views related to Always On Availability Groups are also not supported.

For a list of the features that are supported and unsupported by SQL Database, see [Azure SQL Database feature comparison](sql-database-features.md). The list on this page supplements that guidelines and features article, and focuses on Transact-SQL statements.

## Transact-SQL syntax statements with partial differences

The core DDL (data definition language) statements are available, but some DDL statements have extensions related to disk placement and unsupported features.

- CREATE and ALTER DATABASE statements have over three dozen options. The statements include file placement, FILESTREAM, and service broker options that only apply to SQL Server. This may not matter if you create databases before you migrate, but if you are migrating T-SQL code that creates databases you should compare [CREATE DATABASE (Azure SQL Database)](https://msdn.microsoft.com/library/dn268335.aspx) with the SQL Server syntax at [CREATE DATABASE (SQL Server Transact-SQL)](https://msdn.microsoft.com/library/ms176061.aspx) to make sure all the options you use are supported. CREATE DATABASE for Azure SQL Database also has service objective and elastic scale options that apply only to SQL Database.
- The CREATE and ALTER TABLE statements have FileTable options that cannot be used on SQL Database because FILESTREAM is not supported.
- CREATE and ALTER login statements are supported but SQL Database does not offer all the options. To make your database more portable, SQL Database encourages using contained database users instead of logins whenever possible. For more information, see [CREATE/ALTER LOGIN](https://msdn.microsoft.com/library/ms189828.aspx) and [Controlling and granting database access](sql-database-manage-logins.md).

## Transact-SQL syntax not supported in Azure SQL Database

In addition to Transact-SQL statements related to the unsupported features described in [Azure SQL Database feature comparison](sql-database-features.md), the following statements and groups of statements, are not supported. As such, if your database to be migrated is using any of the following features, re-engineer your T-SQL to eliminate these T-SQL features and statements.

- Collation of system objects
- Connection related: Endpoint statements. SQL Database does not support Windows authentication, but does support the similar Azure Active Directory authentication. Some authentication types require the latest version of SSMS. For more information, see [Connecting to SQL Database or SQL Data Warehouse By Using Azure Active Directory Authentication](sql-database-aad-authentication.md).
- Cross database queries using three or four part names. (Read-only cross-database queries are supported by using [elastic database query](sql-database-elastic-query-overview.md).)
- Cross database ownership chaining, `TRUSTWORTHY` setting
- `EXECUTE AS LOGIN` Use 'EXECUTE AS USER' instead.
- Encryption is supported except for extensible key management
- Eventing: Events, event notifications, query notifications
- File placement: Syntax related to database file placement, size, and database files that are automatically managed by Microsoft Azure.
- High availability: Syntax related to high availability, which is managed through your Microsoft Azure account. This includes syntax for backup, restore, Always On, database mirroring, log shipping, recovery modes.
- Log reader: Syntax that relies upon the log reader, which is not available on SQL Database: Push Replication, Change Data Capture. SQL Database can be a subscriber of a push replication article.
- Functions: `fn_get_sql`, `fn_virtualfilestats`, `fn_virtualservernodes`
- Hardware: Syntax related to hardware-related server settings: such as memory, worker threads, CPU affinity, trace flags. Use service tiers and compute sizes instead.
- `KILL STATS JOB`
- `OPENQUERY`, `OPENROWSET`, `OPENDATASOURCE`, and four-part names
- .NET Framework: CLR integration with SQL Server
- Semantic search
- Server credentials: Use [database scoped credentials](https://msdn.microsoft.com/library/mt270260.aspx) instead.
- Server-level items: Server roles, `sys.login_token`. `GRANT`, `REVOKE`, and `DENY` of server level permissions are not available though some are replaced by database-level permissions. Some useful server-level DMVs have equivalent database-level DMVs.
- `SET REMOTE_PROC_TRANSACTIONS`
- `SHUTDOWN`
- `sp_addmessage`
- `sp_configure` options and `RECONFIGURE`. Some options are available using [ALTER DATABASE SCOPED CONFIGURATION](https://msdn.microsoft.com/library/mt629158.aspx).
- `sp_helpuser`
- `sp_migrate_user_to_contained`
- SQL Server Agent: Syntax that relies upon the SQL Server Agent or the MSDB database: alerts, operators, central management servers. Use scripting, such as Azure PowerShell instead.
- SQL Server audit: Use SQL Database auditing instead.
- SQL Server trace
- Trace flags: Some trace flag items have been moved to compatibility modes.
- Transact-SQL debugging
- Triggers: Server-scoped or logon triggers
- `USE` statement: To change the database context to a different database, you must make a new connection to the new database.

## Full Transact-SQL reference

For more information about Transact-SQL grammar, usage, and examples, see [Transact-SQL Reference (Database Engine)](https://msdn.microsoft.com/library/bb510741.aspx) in SQL Server Books Online.

### About the "Applies to" tags

The Transact-SQL reference includes articles related to SQL Server versions 2008 to the present. Below the article title there is an icon bar, listing the four SQL Server platforms, and indicating applicability. For example, availability groups were introduced in SQL Server 2012. The [CREATE AVAILABILITY GROUP](https://msdn.microsoft.com/library/ff878399.aspx) article indicates that the statement applies to **SQL Server (starting with 2012)**. The statement does not apply to SQL Server 2008, SQL Server 2008 R2, Azure SQL Database, Azure SQL Data Warehouse, or Parallel Data Warehouse.

In some cases, the general subject of an article can be used in a product, but there are minor differences between products. The differences are indicated at midpoints in the article as appropriate. In some cases, the general subject of an article can be used in a product, but there are minor differences between products. The differences are indicated at midpoints in the article as appropriate. For example the CREATE TRIGGER article is available in SQL Database. But the **ALL SERVER** option for server-level triggers, indicates that server-level triggers cannot be used in SQL Database. Use database-level triggers instead.

## Next steps

For a list of the features that are supported and unsupported by SQL Database, see [Azure SQL Database feature comparison](sql-database-features.md). The list on this page supplements that guidelines and features article, and focuses on Transact-SQL statements.
