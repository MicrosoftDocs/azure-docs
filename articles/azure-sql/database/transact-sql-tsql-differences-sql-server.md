---
title: Resolving T-SQL differences-migration
description: T-SQL statements that are less than fully supported in Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: migration
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: reference
author: mokabiru
ms.author: mokabiru
ms.reviewer: mathoma
ms.date: 06/17/2021
---
# T-SQL differences between SQL Server and Azure SQL Database

When [migrating your database](migrate-to-database-from-sql-server.md) from SQL Server to Azure SQL Database, you may discover that your SQL Server databases require some re-engineering before they can be migrated. This article provides guidance to assist you in both performing this re-engineering and understanding the underlying reasons why the re-engineering is necessary. To detect incompatibilities and migrate databases to Azure SQL Database, use [Data Migration Assistant (DMA)](/sql/dma/dma-overview).

## Overview

Most T-SQL features that applications use are fully supported in both Microsoft SQL Server and Azure SQL Database. For example, the core SQL components such as data types, operators, string, arithmetic, logical, and cursor functions work identically in SQL Server and SQL Database. There are, however, a few T-SQL differences in DDL (data definition language) and DML (data manipulation language) elements resulting in T-SQL statements and queries that are only partially supported (which we discuss later in this article).

In addition, there are some features and syntax that isn't supported at all because Azure SQL Database is designed to isolate features from dependencies on the system databases and the operating system. As such, most instance-level features are not supported in SQL Database. T-SQL statements and options aren't available if they configure instance-level options, operating system components, or specify file system configuration. When such capabilities are required, an appropriate alternative is often available in some other way from SQL Database or from another Azure feature or service.

For example, high availability is built into Azure SQL Database. T-SQL statements related to availability groups are not supported by SQL Database, and the dynamic management views related to Always On Availability Groups are also not supported.

For a list of the features that are supported and unsupported by SQL Database, see [Azure SQL Database feature comparison](features-comparison.md). This page supplements that article, and focuses on T-SQL statements.

## T-SQL syntax statements with partial differences

The core DDL statements are available, but DDL statement extensions related to unsupported features, such as file placement on disk, are not supported.

- In SQL Server, `CREATE DATABASE` and `ALTER DATABASE` statements have over three dozen options. The statements include file placement, FILESTREAM, and service broker options that only apply to SQL Server. This may not matter if you create databases in SQL Database before you migrate, but if you're migrating T-SQL code that creates databases you should compare [CREATE DATABASE (Azure SQL Database)](/sql/t-sql/statements/create-database-transact-sql?view=azuresqldb-current&preserve-view=true) with the SQL Server syntax at [CREATE DATABASE (SQL Server T-SQL)](/sql/t-sql/statements/create-database-transact-sql?view=sql-server-ver15&preserve-view=true) to make sure all the options you use are supported. `CREATE DATABASE` for Azure SQL Database also has service objective and elastic pool options that apply only to SQL Database.
- The `CREATE TABLE` and `ALTER TABLE` statements have `FILETABLE` and `FILESTREAM` options that can't be used on SQL Database because these features aren't supported.
- `CREATE LOGIN` and `ALTER LOGIN` statements are supported, but do not offer all options available in SQL Server. To make your database more portable, SQL Database encourages using contained database users instead of logins whenever possible. For more information, see [CREATE LOGIN](/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-current&preserve-view=true) and [ALTER LOGIN](/sql/t-sql/statements/alter-login-transact-sql?view=azuresqldb-current&preserve-view=true) and [Manage logins and users](logins-create-manage.md).

## T-SQL syntax not supported in Azure SQL Database

In addition to T-SQL statements related to the unsupported features described in [Azure SQL Database feature comparison](features-comparison.md), the following statements and groups of statements aren't supported. As such, if your database to be migrated is using any of the following features, re-engineer your application to eliminate these T-SQL features and statements.

- Collation of system objects.
- Connection related: Endpoint statements. SQL Database doesn't support Windows authentication, but does support Azure Active Directory authentication. This includes authentication of Active Directory principals federated with Azure Active Directory. For more information, see [Connecting to SQL Database or Azure Azure Synapse Analytics By Using Azure Active Directory Authentication](authentication-aad-overview.md).
- Cross-database and cross-instance queries using three or four part names. Three part names referencing the `tempdb` database and the current database are supported. [Elastic query](elastic-query-overview.md) supports read-only references to tables in other MSSQL databases.
- Cross database ownership chaining and the `TRUSTWORTHY` database property.
- `EXECUTE AS LOGIN`. Use `EXECUTE AS USER` instead.
- Extensible key management (EKM) for encryption keys. Transparent Data Encryption (TDE) [customer-managed keys](transparent-data-encryption-byok-overview.md) and Always Encrypted [column master keys](always-encrypted-azure-key-vault-configure.md) may be stored in Azure Key Vault.
- Eventing: event notifications, query notifications.
- File properties: Syntax related to database file name, placement, size, and other file properties automatically managed by SQL Database.
- High availability: Syntax related to high availability and database recovery, which are managed by SQL Database. This includes syntax for backup, restore, Always On, database mirroring, log shipping, recovery models.
- Syntax related to snapshot, transactional, and merge replication, which is not available in SQL Database. [Replication subscriptions](replication-to-sql-database.md) are supported.
- Functions: `fn_get_sql`, `fn_virtualfilestats`, `fn_virtualservernodes`.
- Instance configuration: Syntax related to server memory, worker threads, CPU affinity, trace flags. Use service tiers and compute sizes instead.
- `KILL STATS JOB`.
- `OPENQUERY`, `OPENDATASOURCE`, and four-part names.
- .NET Framework: CLR integration
- Semantic search
- Server credentials: Use [database scoped credentials](/sql/t-sql/statements/create-database-scoped-credential-transact-SQL) instead.
- Server-level permissions: `GRANT`, `REVOKE`, and `DENY` of server level permissions are not supported. Some server-level permissions are replaced by database-level permissions, or granted implicitly by built-in server roles. Some server-level DMVs and catalog views have similar database-level views.
- `SET REMOTE_PROC_TRANSACTIONS`
- `SHUTDOWN`
- `sp_addmessage`
- `sp_configure` and `RECONFIGURE`. [ALTER DATABASE SCOPED CONFIGURATION](/sql/t-sql/statements/alter-database-scoped-configuration-transact-sql) is supported.
- `sp_helpuser`
- `sp_migrate_user_to_contained`
- SQL Server Agent: Syntax that relies upon the SQL Server Agent or the MSDB database: alerts, operators, central management servers. Use scripting, such as PowerShell, instead.
- SQL Server audit: Use SQL Database [auditing](auditing-overview.md) instead.
- SQL Server trace.
- Trace flags.
- T-SQL debugging.
- Server-scoped or logon triggers.
- `USE` statement: To change database context to a different database, you must create a new connection to that database.

## Full T-SQL reference

For more information about T-SQL grammar, usage, and examples, see [T-SQL Reference (Database Engine)](/sql/t-sql/language-reference).

### About the "Applies to" tags

The T-SQL reference includes articles related to all recent SQL Server versions. Below the article title there's an icon bar, listing MSSQL platforms, and indicating applicability. For example, availability groups were introduced in SQL Server 2012. The [CREATE AVAILABILITY GROUP](/sql/t-sql/statements/create-availability-group-transact-sql) article indicates that the statement applies to **SQL Server (starting with 2012)**. The statement doesn't apply to SQL Server 2008, SQL Server 2008 R2, Azure SQL Database, Azure Azure Synapse Analytics, or Parallel Data Warehouse.

In some cases, the general subject of an article can be used in a product, but there are minor differences between products. The differences are indicated at midpoints in the article as appropriate. For example, the `CREATE TRIGGER` article is available in SQL Database. But the `ALL SERVER` option for server-level triggers, indicates that server-level triggers can't be used in SQL Database. Use database-level triggers instead.

## Next steps

For a list of the features that are supported and unsupported by SQL Database, see [Azure SQL Database feature comparison](features-comparison.md).

To detect compatibility issues in your SQL Server databases before migrating to Azure SQL Database, and to migrate your databases, use [Data Migration Assistant (DMA)](/sql/dma/dma-overview).