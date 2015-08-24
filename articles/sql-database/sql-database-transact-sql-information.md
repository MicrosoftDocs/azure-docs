<properties
   pageTitle="Azure SQL Database Transact-SQL Information | Microsoft Azure"
   description="Transact-SQL statements in Azure SQL Database"
   services="sql-database"
   documentationCenter=""
   authors="BYHAM"
   manager="jeffreyg"
   editor=""
   tags=""/>

<tags
   ms.service="sql-database"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management"
   ms.date="08/07/2015"
   ms.author="rick.byham@microsoft.com"/>

# Azure SQL Database Transact-SQL information

Most SQL Server 2016 Transact-SQL statements are fully supported in Microsoft Azure SQL Database. This includes the SQL Server data types, operators, and the string, arithmetic, logical, cursor functions, and the other Transact-SQL elements that most applications depend upon. Partially or unsupported functions are usually related to differences in how SQL Database manages the database (such as file, high availability, and security features) or for special purpose features such as service broker. Because SQL Database isolates many features from dependency on the master database, many server-level activities are inappropriate and unsupported. Features deprecated in SQL Server are generally not supported in SQL Database.

## Upgrading to SQL Database V12

This topic discusses the features that are available with SQL Database when upgraded to the free SQL Database V12. For more information about V12, see [SQL Database V12 What's New](sql-database-v12-whats-new.md). SQL Database V12 adds performance and manageability improvements, as well as support for additional features. The added features are listed below, separated into the features that are fully supported, and the features that are partially supported. 

## Features that are partially supported in SQL Database V12

SQL Database V12 supports some but not all of the arguments that exist in the corresponding SQL Server 2016 Transact-SQL statements. For example, the CREATE PROCEDURE statement is available however the WITH ENCRYPTION option of CREATE PROCEDURE is not available. Refer to the linked syntax topics for details about the supported areas of each statement.

- CLR assemblies: [CREATE ASSEMBLY](https://msdn.microsoft.com/library/ms189524.aspx)
- Databases: [CREATE](https://msdn.microsoft.com/library/dn268335.aspx )/[ALTER](https://msdn.microsoft.com/library/ms174269.aspx)
- DMV's are generally available for features that are available
- Functions: [CREATE](https://msdn.microsoft.com/library/ms186755.aspx)/[ALTER FUNCTION](https://msdn.microsoft.com/library/ms186967.aspx)
- [KILL](https://msdn.microsoft.com/library/ms173730.aspx) 
- Logins: [CREATE](https://msdn.microsoft.com/library/ms189751.aspx)/[ALTER LOGIN](https://msdn.microsoft.com/library/ms189828.aspx)
- Stored procedures: [CREATE](https://msdn.microsoft.com/library/ms187926.aspx)/[ALTER PROCEDURE](https://msdn.microsoft.com/library/ms189762.aspx)
- Tables: [CREATE](https://msdn.microsoft.com/library/dn305849.aspx)/[ALTER](https://msdn.microsoft.com/library/ms190273.aspx)
- Types (custom): [CREATE TYPE](https://msdn.microsoft.com/library/ms175007.aspx)
- Users: [CREATE](https://msdn.microsoft.com/library/ms173463.aspx)/[ALTER USER](https://msdn.microsoft.com/library/ms176060.aspx)
- Views: [CREATE](https://msdn.microsoft.com/library/ms187956.aspx)/[ALTER VIEW](https://msdn.microsoft.com/library/ms173846.aspx)

## Features that are not supported in SQL Database

- Collation of system objects
- Connection related: Endpoint statements, ORIGINAL_DB_NAME. Windows authentication is not available for logins or contained database users.
- Cross database queries, cross database ownership chaining, TRUSTWORTHY setting
- Data Collector
- Database Diagrams
- Database Mail
- DATABASEPROPERTY (use DATABASEPROPERTYEX instead)
- Distributed transactions
- EXECUTE AS logins
- Encryption: extensible key management
- Eventing: events, event notifications, query notifications
- Features related to database file placement, size, and database files which are automatically managed by Microsoft Azure.
- Features that relate to high availability which is managed through your Microsoft Azure account: backup, restore, AlwaysOn, database mirroring, log shipping, recovery modes. For more information, see Azure SQL Database Backup and Restore.
- Features that rely upon the log reader: Replication, Change Data Capture.
- Features that rely upon the SQL Server Agent or the MSDB database: jobs, alerts, operators, Policy-Based Management, database mail, central management servers.
- FILESTREAM
- Functions: fn_get_sql, fn_virtualfilestats, fn_virtualservernodes
- Global temporary tables
- Hardware related server settings: memory, worker threads, CPU affinity, trace flags, etc. Use service levels instead.
- HAS_DBACCESS
- KILL STATS JOB
- Linked servers, OPENQUERY, OPENROWSET, OPENDATASOURCE, BULK INSERT, 3 and 4 part names
- Master/target servers
- Resource governor
- Semantic search
- Server credentials
- Sever-level items: Server roles, IS_SRVROLEMEMBER, sys.login_token. Server level permissions are not available though some are replaced by database-level permissions. Some server-level DMV's are not available though some are replaced by database-level DMV's.
- Serverless express: localdb, user instances
- Service broker
- SET REMOTE_PROC_TRANSACTIONS
- SHUTDOWN
- sp_addmessage
- sp_configure options and RECONFIGURE
- SQL Server audit (use SQL Database auditing instead)
- SQL Server Profiler
- SQL Server trace
- Trace flags
- Transact-SQL debugging
- Triggers: Server-scoped or logon triggers
- USE statement

## Full Transact-SQL reference

For more information about Transact-SQL grammar, usage, and examples, see [Transact-SQL Reference (Database Engine)](https://msdn.microsoft.com/library/bb510741.aspx) in SQL Server Books Online. 

### About the "Applies to" tags

The Transact-SQL reference includes topics related to SQL Server 2008, SQL Server 2008 R2, SQL Server 2012, SQL Server 2014, and Microsoft Azure SQL Database. Near the top of each topic is a section indicating which products support the subject of the topic. If a product is omitted, then the feature described by the topic is not available in that product. For example, availability groups were introduced in SQL Server 2012. The **CREATE AVAILABILTY GROUP** topic indicates it applies to **SQL Server (SQL Server 2012 through current version)** because it does not apply to SQL Server 2008, SQL Server 2008 R2, or Microsoft Azure SQL Database.

In some cases, the general subject of topic can be used in a product, but all of the arguments are not supported. For example, contained database users were introduced in SQL Server 2012. The **CREATE USER** statement can be used in any SQL Server product, however the **WITH PASSWORD** syntax cannot be used with older versions. In this case, additional **Applies to** sections are inserted into the appropriate argument descriptions in the body of the topic.