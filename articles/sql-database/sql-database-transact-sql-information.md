---
title: Unsupported in Azure SQL Database T-SQL | Microsoft Docs
description: Transact-SQL statements that are less than fully supported in Azure SQL Database
services: sql-database
documentationcenter: ''
author: BYHAM
manager: jhubbard
editor: ''
tags: ''

ms.assetid: c05abd9e-28a7-4c97-9bdf-bc60d08fc92e
ms.service: sql-database
ms.custom: overview
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: data-management
ms.date: 02/22/2017
ms.author: rickbyh

---
# Azure SQL Database Transact-SQL differences   
Most of the Transact-SQL features that applications depend on are supported in both Microsoft SQL Server and Azure SQL Database. For example, the core SQL components such as data types, operators, string, arithmetic, logical, and cursor functions, etc., work without differences from SQL Server.

## Why some Transact-SQL is not supported
Azure SQL Database is designed to isolate features from dependencies on the master database and the operating system. As a consequence many server-level activities are inappropriate for SQL Database. Transact-SQL statements are usually not available if they configure server-level options, operating system components, or specify file system configuration. When features that are outside of the user database are necessary, an appropriate alternative is often available in some other way from SQL Database or from another Azure feature or service. 

For example, Always On does not apply to Azure SQL Database, since high availability is built into the service - every database is highly available. For that reason, any Transact-SQL statements related to availability groups are not supported by SQL Database, and the dynamic management views related to Always On are not supported.  

For a list of the features that are supported and unsupported by SQL Database, see [Azure SQL Database considerations, guidelines and features](sql-database-features.md).


## Transact-SQL syntax partially supported in SQL Database
SQL Database supports some but not all the arguments that exist in the corresponding SQL Server 2016 Transact-SQL statements for managing databases and logins. For example, the `CREATE DATABASE` statement is available in Azure SQL Database, and not all the options supported in SQL Server are supported in Azure SQL Database, and vice versa. Refer to the linked syntax topics for details about the supported areas of each statement.

- Databases: [CREATE](https://msdn.microsoft.com/library/dn268335.aspx)/[ALTER DATABASE](https://msdn.microsoft.com/library/mt574871.aspx)   
- Logins: [CREATE](https://msdn.microsoft.com/library/ms189751.aspx)/[ALTER LOGIN](https://msdn.microsoft.com/library/ms189828.aspx)   

## Transact-SQL syntax not supported in SQL Database   
In addition to Transact-SQL statements related to the unsupported features described in [Azure SQL Database considerations, guidelines and features](sql-database-features.md), the following statements and groups of statements, are not supported.
- Collation of system objects
- Connection related: Endpoint statements, `ORIGINAL_DB_NAME`. SQL Database does not support Windows authentication, but does support the similar Azure Active Directory authentication. Some authentication types require the latest version of SSMS. For more information, see [Connecting to SQL Database or SQL Data Warehouse By Using Azure Active Directory Authentication](sql-database-aad-authentication.md).
- Cross database queries using three or four part names. (Read-only cross-database queries are supported by using [elastic database query](sql-database-elastic-query-overview.md).)
- Cross database ownership chaining, `TRUSTWORTHY` setting
- `DATABASEPROPERTY` Use `DATABASEPROPERTYEX` instead.
- `EXECUTE AS LOGIN` Use 'EXECUTE AS USER' instead.
- Encryption is supported except for extensible key management
- Eventing: events, event notifications, query notifications
- Syntax related to database file placement, size, and database files that are automatically managed by Microsoft Azure.
- Syntax related to high availability, which is managed through your Microsoft Azure account. This includes syntax for backup, restore, Always On, database mirroring, log shipping, recovery modes.
- Syntax that relies upon the log reader, which is not available on SQL Database: Push Replication, Change Data Capture. SQL Database can be a subscriber of a push replication article.
- Syntax that relies upon the SQL Server Agent or the MSDB database: alerts, operators, central management servers. Use scripting, such as Azure PowerShell instead.
- Functions: `fn_get_sql`, `fn_virtualfilestats`, `fn_virtualservernodes`
- Global temporary tables
- Syntax related to hardware-related server settings: memory, worker threads, CPU affinity, trace flags, etc. Use service levels instead.
- `HAS_DBACCESS`
- `KILL STATS JOB`
- `OPENQUERY`, `OPENROWSET`, `OPENDATASOURCE`, `BULK INSERT`, and four-part names
- .NET Framework [CLR integration with SQL Server](http://msdn.microsoft.com/library/ms254963.aspx)
- Semantic search
- Server credentials. Use database scoped credentials instead.
- Server-level items: Server roles, `IS_SRVROLEMEMBER`, `sys.login_token`. `GRANT`, `REVOKE`, and `DENY` of server level permissions are not available though some are replaced by database-level permissions. Some useful server-level DMVs have equivalent database-level DMVs.
- `SET REMOTE_PROC_TRANSACTIONS`
- `SHUTDOWN`
- `sp_addmessage`
- `sp_configure` options and `RECONFIGURE`. Some options are available using [ALTER DATABASE SCOPED CONFIGURATION](https://msdn.microsoft.com/library/mt629158.aspx).
- `sp_helpuser`
- `sp_migrate_user_to_contained`
- SQL Server audit. Use SQL Database auditing instead.
- SQL Server trace
- Trace flags. Some trace flag items have been moved to compatibility modes.
- Transact-SQL debugging
- Triggers: Server-scoped or logon triggers
- `USE` statement: To change the database context to a different database, you must make a new connection to the new database.

## Full Transact-SQL reference
For more information about Transact-SQL grammar, usage, and examples, see [Transact-SQL Reference (Database Engine)](https://msdn.microsoft.com/library/bb510741.aspx) in SQL Server Books Online. 

### About the "Applies to" tags
The Transact-SQL reference includes topics related to SQL Server versions 2008 to the present. Below the topic title there is an icon bar, listing the four SQL Server platforms, and indicating applicability. For example, availability groups were introduced in SQL Server 2012. The [CREATE AVAILABILTY GROUP](https://msdn.microsoft.com/library/ff878399.aspx) topic indicates that the statement applies to **SQL Server (starting with 2012)**. The statement does not apply to SQL Server 2008, SQL Server 2008 R2, Azure SQL Database, Azure SQL Data Warehouse, or Parallel Data Warehouse.

In some cases, the general subject of a topic can be used in a product, but there are minor differences between products. The differences are indicated at midpoints in the topic as appropriate.
