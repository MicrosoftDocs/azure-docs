---
title: SQL error codes - database connection error | Microsoft Docs
description: 'Learn about SQL error codes for SQL Database client applications, such as common database connection errors, database copy issues, and general errors. '
keywords: sql error code,access sql,database connection error,sql error codes
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: 
ms.devlang:
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer:
manager: craigg
ms.date: 09/14/2018
---
# SQL error codes for SQL Database client applications: Database connection errors and other issues

This article lists SQL error codes for SQL Database client applications, including database connection errors, transient errors (also called transient faults), resource governance errors, database copy issues, elastic pool, and other errors. Most categories are particular to Azure SQL Database, and do not apply to Microsoft SQL Server. See also [system error messages](https://technet.microsoft.com/library/cc645603(v=sql.105).aspx).

## Database connection errors, transient errors, and other temporary errors
The following table covers the SQL error codes for connection loss errors, and other transient errors you might encounter when your application attempts to access SQL Database. For getting started tutorials on how to connect to Azure SQL Database, see [Connecting to Azure SQL Database](sql-database-libraries.md).

### Most common database connection errors and transient fault errors
The Azure infrastructure has the ability to dynamically reconfigure servers when heavy workloads arise in the SQL Database service.  This dynamic behavior might cause your client program to lose its connection to SQL Database. This kind of error condition is called a *transient fault*.

It is strongly recommended that your client program has retry logic so that it could reestablish a connection after giving the transient fault time to correct itself.  We recommend that you delay for 5 seconds before your first retry. Retrying after a delay shorter than 5 seconds risks overwhelming the cloud service. For each subsequent retry the delay should grow exponentially, up to a maximum of 60 seconds.

Transient fault errors typically manifest as one of the following error messages from your client programs:

* Database &lt;db_name&gt; on server &lt;Azure_instance&gt; is not currently available. Please retry the connection later. If the problem persists, contact customer support, and provide them the session tracing ID of &lt;session_id&gt;
* Database &lt;db_name&gt; on server &lt;Azure_instance&gt; is not currently available. Please retry the connection later. If the problem persists, contact customer support, and provide them the session tracing ID of &lt;session_id&gt;. (Microsoft SQL Server, Error: 40613)
* An existing connection was forcibly closed by the remote host.
* System.Data.Entity.Core.EntityCommandExecutionException: An error occurred while executing the command definition. See the inner exception for details. ---> System.Data.SqlClient.SqlException: A transport-level error has occurred when receiving results from the server. (provider: Session Provider, error: 19 - Physical connection is not usable)
* An connection attempt to a secondary database failed because the database is in the process of reconfiguration and it is busy applying new pages while in the middle of an active transaction on the primary database. 

For code examples of retry logic, see:

* [Connection Libraries for SQL Database and SQL Server](sql-database-libraries.md) 
* [Actions to fix connection errors and transient errors in SQL Database](sql-database-connectivity-issues.md)

A discussion of the *blocking period* for clients that use ADO.NET is available in [SQL Server Connection Pooling (ADO.NET)](http://msdn.microsoft.com/library/8xx3tyca.aspx).

### Transient fault error codes
The following errors are transient, and should be retried in application logic: 

| Error code | Severity | Description |
| ---:| ---:|:--- |
| 4060 |16 |Cannot open database "%.&#x2a;ls" requested by the login. The login failed. |
| 40197 |17 |The service has encountered an error processing your request. Please try again. Error code %d.<br/><br/>You receive this error when the service is down due to software or hardware upgrades, hardware failures, or any other failover problems. The error code (%d) embedded within the message of error 40197 provides additional information about the kind of failure or failover that occurred. Some examples of the error codes are embedded within the message of error 40197 are 40020, 40143, 40166, and 40540.<br/><br/>Reconnecting to your SQL Database server automatically connects you to a healthy copy of your database. Your application must catch error 40197, log the embedded error code (%d) within the message for troubleshooting, and try reconnecting to SQL Database until the resources are available, and your connection is established again. |
| 40501 |20 |The service is currently busy. Retry the request after 10 seconds. Incident ID: %ls. Code: %d.<br/><br/>For more information, see:<br/>• [Azure SQL Database resource limits](sql-database-service-tiers-dtu.md). |
| 40613 |17 |Database '%.&#x2a;ls' on server '%.&#x2a;ls' is not currently available. Please retry the connection later. If the problem persists, contact customer support, and provide them the session tracing ID of '%.&#x2a;ls'. |
| 49918 |16 |Cannot process request. Not enough resources to process request.<br/><br/>The service is currently busy. Please retry the request later. |
| 49919 |16 |Cannot process create or update request. Too many create or update operations in progress for subscription "%ld".<br/><br/>The service is busy processing multiple create or update requests for your subscription or server. Requests are currently blocked for resource optimization. Query [sys.dm_operation_status](https://msdn.microsoft.com/library/dn270022.aspx) for pending operations. Wait until pending create or update requests are complete or delete one of your pending requests and retry your request later. |
| 49920 |16 |Cannot process request. Too many operations in progress for subscription "%ld".<br/><br/>The service is busy processing multiple requests for this subscription. Requests are currently blocked for resource optimization. Query [sys.dm_operation_status](https://msdn.microsoft.com/library/dn270022.aspx) for operation status. Wait until pending requests are complete or delete one of your pending requests and retry your request later. |
| 4221 |16 |Login to read-secondary failed due to long wait on 'HADR_DATABASE_WAIT_FOR_TRANSITION_TO_VERSIONING'. The replica is not available for login because row versions are missing for transactions that were in-flight when the replica was recycled. The issue can be resolved by rolling back or committing the active transactions on the primary replica. Occurrences of this condition can be minimized by avoiding long write transactions on the primary. |

## Database copy errors
The following errors can be encountered while copying a database in Azure SQL Database. For more information, see [Copy an Azure SQL Database](sql-database-copy.md).

| Error code | Severity | Description |
| ---:| ---:|:--- |
| 40635 |16 |Client with IP address '%.&#x2a;ls' is temporarily disabled. |
| 40637 |16 |Create database copy is currently disabled. |
| 40561 |16 |Database copy failed. Either the source or target database does not exist. |
| 40562 |16 |Database copy failed. The source database has been dropped. |
| 40563 |16 |Database copy failed. The target database has been dropped. |
| 40564 |16 |Database copy failed due to an internal error. Please drop target database and try again. |
| 40565 |16 |Database copy failed. No more than 1 concurrent database copy from the same source is allowed. Please drop target database and try again later. |
| 40566 |16 |Database copy failed due to an internal error. Please drop target database and try again. |
| 40567 |16 |Database copy failed due to an internal error. Please drop target database and try again. |
| 40568 |16 |Database copy failed. Source database has become unavailable. Please drop target database and try again. |
| 40569 |16 |Database copy failed. Target database has become unavailable. Please drop target database and try again. |
| 40570 |16 |Database copy failed due to an internal error. Please drop target database and try again later. |
| 40571 |16 |Database copy failed due to an internal error. Please drop target database and try again later. |

## Resource governance errors
The following errors are caused by excessive use of resources while working with Azure SQL Database. For example:

* A transaction has been open for too long.
* A transaction is holding too many locks.
* An application is consuming too much memory.
* An application is consuming too much `TempDb` space.

Related topics:

* More detailed information is available here: [Azure SQL Database resource limits](sql-database-service-tiers-dtu.md).

| Error code | Severity | Description |
| ---:| ---:|:--- |
| 10928 |20 |Resource ID: %d. The %s limit for the database is %d and has been reached. For more information, see [http://go.microsoft.com/fwlink/?LinkId=267637](http://go.microsoft.com/fwlink/?LinkId=267637).<br/><br/>The Resource ID indicates the resource that has reached the limit. For worker threads, the Resource ID = 1. For sessions, the Resource ID = 2.<br/><br/>For more information about this error and how to resolve it, see:<br/>• [Azure SQL Database resource limits](sql-database-service-tiers-dtu.md). |
| 10929 |20 |Resource ID: %d. The %s minimum guarantee is %d, maximum limit is %d, and the current usage for the database is %d. However, the server is currently too busy to support requests greater than %d for this database. For more information, see [http://go.microsoft.com/fwlink/?LinkId=267637](http://go.microsoft.com/fwlink/?LinkId=267637). Otherwise, please try again later.<br/><br/>The Resource ID indicates the resource that has reached the limit. For worker threads, the Resource ID = 1. For sessions, the Resource ID = 2.<br/><br/>For more information about this error and how to resolve it, see:<br/>• [Azure SQL Database resource limits](sql-database-service-tiers-dtu.md). |
| 40544 |20 |The database has reached its size quota. Partition or delete data, drop indexes, or consult the documentation for possible resolutions. |
| 40549 |16 |Session is terminated because you have a long-running transaction. Try shortening your transaction. |
| 40550 |16 |The session has been terminated because it has acquired too many locks. Try reading or modifying fewer rows in a single transaction. |
| 40551 |16 |The session has been terminated because of excessive `TEMPDB` usage. Try modifying your query to reduce the temporary table space usage.<br/><br/>If you are using temporary objects, conserve space in the `TEMPDB` database by dropping temporary objects after they are no longer needed by the session. |
| 40552 |16 |The session has been terminated because of excessive transaction log space usage. Try modifying fewer rows in a single transaction.<br/><br/>If you perform bulk inserts using the `bcp.exe` utility or the `System.Data.SqlClient.SqlBulkCopy` class, try using the `-b batchsize` or `BatchSize` options to limit the number of rows copied to the server in each transaction. If you are rebuilding an index with the `ALTER INDEX` statement, try using the `REBUILD WITH ONLINE = ON` option. |
| 40553 |16 |The session has been terminated because of excessive memory usage. Try modifying your query to process fewer rows.<br/><br/>Reducing the number of `ORDER BY` and `GROUP BY` operations in your Transact-SQL code reduces the memory requirements of your query. |

## Elastic pool errors
The following errors are related to creating and using elastic pools:

| ErrorNumber | ErrorSeverity | ErrorFormat | ErrorInserts | ErrorCause | ErrorCorrectiveAction |
|:--- |:--- |:--- |:--- |:--- |:--- |
| 1132 |EX_RESOURCE |The elastic pool has reached its storage limit. The storage usage for the elastic pool cannot exceed (%d) MBs. |Elastic pool space limit in MBs. |Attempting to write data to a database when the storage limit of the elastic pool has been reached. |Consider increasing the DTUs of and/or adding storage to the elastic pool if possible in order to increase its storage limit, reduce the storage used by individual databases within the elastic pool, or remove databases from the elastic pool. |
| 10929 |EX_USER |The %s minimum guarantee is %d, maximum limit is %d, and the current usage for the database is %d. However, the server is currently too busy to support requests greater than %d for this database. See [http://go.microsoft.com/fwlink/?LinkId=267637](http://go.microsoft.com/fwlink/?LinkId=267637) for assistance. Otherwise, please try again later. |DTU / vCore min per database; DTU / vCore max per database |The total number of concurrent workers (requests) across all databases in the elastic pool attempted to exceed the pool limit. |Consider increasing the DTUs or vCores of the elastic pool if possible in order to increase its worker limit, or remove databases from the elastic pool. |
| 40844 |EX_USER |Database '%ls' on Server '%ls' is a '%ls' edition database in an elastic pool and cannot have a continuous copy relationship. |database name, database edition, server name |A StartDatabaseCopy command is issued for a non-premium db in an elastic pool. |Coming soon |
| 40857 |EX_USER |Elastic pool not found for server: '%ls', elastic pool name: '%ls'. |name of server; elastic pool name |Specified elastic pool does not exist in the specified server. |Provide a valid elastic pool name. |
| 40858 |EX_USER |Elastic pool '%ls' already exists in server: '%ls' |elastic pool name, server name |Specified elastic pool already exists in the specified logical server. |Provide new elastic pool name. |
| 40859 |EX_USER |Elastic pool does not support service tier '%ls'. |elastic pool service tier |Specified service tier is not supported for elastic pool provisioning. |Provide the correct edition or leave service tier blank to use the default service tier. |
| 40860 |EX_USER |Elastic pool '%ls' and service objective '%ls' combination is invalid. |elastic pool name; service tier |Elastic pool and service tier can be specified together only if resource type is specified as 'ElasticPool'. |Specify correct combination of elastic pool and service tier. |
| 40861 |EX_USER |The database edition '%.*ls' cannot be different than the elastic pool service tier which is '%.*ls'. |database edition, elastic pool service tier |The database edition is different than the elastic pool service tier. |Do not specify a database edition which is different than the elastic pool service tier.  Note that the database edition does not need to be specified. |
| 40862 |EX_USER |Elastic pool name must be specified if the elastic pool service objective is specified. |None |Elastic pool service objective does not uniquely identify an elastic pool. |Specify the elastic pool name if using the elastic pool service objective. |
| 40864 |EX_USER |The DTUs for the elastic pool must be at least (%d) DTUs for service tier '%.*ls'. |DTUs for elastic pool; elastic pool service tier. |Attempting to set the DTUs for the elastic pool below the minimum limit. |Retry setting the DTUs for the elastic pool to at least the minimum limit. |
| 40865 |EX_USER |The DTUs for the elastic pool cannot exceed (%d) DTUs for service tier '%.*ls'. |DTUs for elastic pool; elastic pool service tier. |Attempting to set the DTUs for the elastic pool above the maximum limit. |Retry setting the DTUs for the elastic pool to no greater than the maximum limit. |
| 40867 |EX_USER |The DTU max per database must be at least (%d) for service tier '%.*ls'. |DTU max per database; elastic pool service tier |Attempting to set the DTU max per database below the supported limit. | Consider using the elastic pool service tier that supports the desired setting. |
| 40868 |EX_USER |The DTU max per database cannot exceed (%d) for service tier '%.*ls'. |DTU max per database; elastic pool service tier. |Attempting to set the DTU max per database beyond the supported limit. | Consider using the elastic pool service tier that supports the desired setting. |
| 40870 |EX_USER |The DTU min per database cannot exceed (%d) for service tier '%.*ls'. |DTU min per database; elastic pool service tier. |Attempting to set the DTU min per database beyond the supported limit. | Consider using the elastic pool service tier that supports the desired setting. |
| 40873 |EX_USER |The number of databases (%d) and DTU min per database (%d) cannot exceed the DTUs of the elastic pool (%d). |Number databases in elastic pool; DTU min per database; DTUs of elastic pool. |Attempting to specify DTU min for databases in the elastic pool that exceeds the DTUs of the elastic pool. | Consider increasing the DTUs of the elastic pool, or decrease the DTU min per database, or decrease the number of databases in the elastic pool. |
| 40877 |EX_USER |An elastic pool cannot be deleted unless it does not contain any databases. |None |The elastic pool contains one or more databases and therefore cannot be deleted. |Remove databases from the elastic pool in order to delete it. |
| 40881 |EX_USER |The elastic pool '%.*ls' has reached its database count limit.  The database count limit for the elastic pool cannot exceed (%d) for an elastic pool with (%d) DTUs. |Name of elastic pool; database count limit of elastic pool; eDTUs for resource pool. |Attempting to create or add database to elastic pool when the database count limit of the elastic pool has been reached. | Consider increasing the DTUs of the elastic pool if possible in order to increase its database limit, or remove databases from the elastic pool. |
| 40889 |EX_USER |The DTUs or storage limit for the elastic pool '%.*ls' cannot be decreased since that would not provide sufficient storage space for its databases. |Name of elastic pool. |Attempting to decrease the storage limit of the elastic pool below its storage usage. | Consider reducing the storage usage of individual databases in the elastic pool or remove databases from the pool in order to reduce its DTUs or storage limit. |
| 40891 |EX_USER |The DTU min per database (%d) cannot exceed the DTU max per database (%d). |DTU min per database; DTU max per database. |Attempting to set the DTU min per database higher than the DTU max per database. |Ensure the DTU min per databases does not exceed the DTU max per database. |
| TBD |EX_USER |The storage size for an individual database in an elastic pool cannot exceed the max size allowed by '%.*ls' service tier elastic pool. |elastic pool service tier |The max size for the database exceeds the max size allowed by the elastic pool service tier. |Set the max size of the database within the limits of the max size allowed by the elastic pool service tier. |

Related topics:

* [Create an elastic pool (C#)](sql-database-elastic-pool-manage-csharp.md) 
* [Manage an elastic pool (C#)](sql-database-elastic-pool-manage-csharp.md). 
* [Create an elastic pool (PowerShell)](sql-database-elastic-pool-manage-powershell.md) 
* [Monitor and manage an elastic pool (PowerShell)](sql-database-elastic-pool-manage-powershell.md).

## General errors
The following errors do not fall into any previous categories.

| Error code | Severity | Description |
| ---:| ---:|:--- |
| 15006 |16 |(AdministratorLogin) is not a valid name because it contains invalid characters. |
| 18452 |14 |Login failed. The login is from an untrusted domain and cannot be used with Windows authentication.%.&#x2a;ls (Windows logins are not supported in this version of SQL Server.) |
| 18456 |14 |Login failed for user '%.&#x2a;ls'.%.&#x2a;ls%.&#x2a;ls(The login failed for user "%.&#x2a;ls". The password change failed. Password change during login is not supported in this version of SQL Server.) |
| 18470 |14 |Login failed for user '%.&#x2a;ls'. Reason: The account is disabled.%.&#x2a;ls |
| 40014 |16 |Multiple databases cannot be used in the same transaction. |
| 40054 |16 |Tables without a clustered index are not supported in this version of SQL Server. Create a clustered index and try again. |
| 40133 |15 |This operation is not supported in this version of SQL Server. |
| 40506 |16 |Specified SID is invalid for this version of SQL Server. |
| 40507 |16 |'%.&#x2a;ls' cannot be invoked with parameters in this version of SQL Server. |
| 40508 |16 |USE statement is not supported to switch between databases. Use a new connection to connect to a different database. |
| 40510 |16 |Statement '%.&#x2a;ls' is not supported in this version of SQL Server |
| 40511 |16 |Built-in function '%.&#x2a;ls' is not supported in this version of SQL Server. |
| 40512 |16 |Deprecated feature '%ls' is not supported in this version of SQL Server. |
| 40513 |16 |Server variable '%.&#x2a;ls' is not supported in this version of SQL Server. |
| 40514 |16 |'%ls' is not supported in this version of SQL Server. |
| 40515 |16 |Reference to database and/or server name in '%.&#x2a;ls' is not supported in this version of SQL Server. |
| 40516 |16 |Global temp objects are not supported in this version of SQL Server. |
| 40517 |16 |Keyword or statement option '%.&#x2a;ls' is not supported in this version of SQL Server. |
| 40518 |16 |DBCC command '%.&#x2a;ls' is not supported in this version of SQL Server. |
| 40520 |16 |Securable class '%S_MSG' not supported in this version of SQL Server. |
| 40521 |16 |Securable class '%S_MSG' not supported in the server scope in this version of SQL Server. |
| 40522 |16 |Database principal '%.&#x2a;ls' type is not supported in this version of SQL Server. |
| 40523 |16 |Implicit user '%.&#x2a;ls' creation is not supported in this version of SQL Server. Explicitly create the user before using it. |
| 40524 |16 |Data type '%.&#x2a;ls' is not supported in this version of SQL Server. |
| 40525 |16 |WITH '%.ls' is not supported in this version of SQL Server. |
| 40526 |16 |'%.&#x2a;ls' rowset provider not supported in this version of SQL Server. |
| 40527 |16 |Linked servers are not supported in this version of SQL Server. |
| 40528 |16 |Users cannot be mapped to certificates, asymmetric keys, or Windows logins in this version of SQL Server. |
| 40529 |16 |Built-in function '%.&#x2a;ls' in impersonation context is not supported in this version of SQL Server. |
| 40532 |11 |Cannot open server "%.&#x2a;ls" requested by the login. The login failed. |
| 40553 |16 |The session has been terminated because of excessive memory usage. Try modifying your query to process fewer rows.<br/><br/> Reducing the number of `ORDER BY` and `GROUP BY` operations in your Transact-SQL code helps reduce the memory requirements of your query. |
| 40604 |16 |Could not CREATE/ALTER DATABASE because it would exceed the quota of the server. |
| 40606 |16 |Attaching databases is not supported in this version of SQL Server. |
| 40607 |16 |Windows logins are not supported in this version of SQL Server. |
| 40611 |16 |Servers can have at most 128 firewall rules defined. |
| 40614 |16 |Start IP address of firewall rule cannot exceed End IP address. |
| 40615 |16 |Cannot open server '{0}' requested by the login. Client with IP address '{1}' is not allowed to access the server.<br /><br />To enable access, use the SQL Database Portal or run sp\_set\_firewall\_rule on the master database to create a firewall rule for this IP address or address range. It may take up to five minutes for this change to take effect. |
| 40617 |16 |The firewall rule name that starts with (rule name) is too long. Maximum length is 128. |
| 40618 |16 |The firewall rule name cannot be empty. |
| 40620 |16 |The login failed for user "%.&#x2a;ls". The password change failed. Password change during login is not supported in this version of SQL Server. |
| 40627 |20 |Operation on server '{0}' and database '{1}' is in progress. Please wait a few minutes before trying again. |
| 40630 |16 |Password validation failed. The password does not meet policy requirements because it is too short. |
| 40631 |16 |The password that you specified is too long. The password should have no more than 128 characters. |
| 40632 |16 |Password validation failed. The password does not meet policy requirements because it is not complex enough. |
| 40636 |16 |Cannot use a reserved database name '%.&#x2a;ls' in this operation. |
| 40638 |16 |Invalid subscription id (subscription-id). Subscription does not exist. |
| 40639 |16 |Request does not conform to schema: (schema error). |
| 40640 |20 |The server encountered an unexpected exception. |
| 40641 |16 |The specified location is invalid. |
| 40642 |17 |The server is currently too busy. Please try again later. |
| 40643 |16 |The specified x-ms-version header value is invalid. |
| 40644 |14 |Failed to authorize access to the specified subscription. |
| 40645 |16 |Servername (servername) cannot be empty or null. It can only be made up of lowercase letters 'a'-'z', the numbers 0-9 and the hyphen. The hyphen may not lead or trail in the name. |
| 40646 |16 |Subscription ID cannot be empty. |
| 40647 |16 |Subscription (subscription-id) does not have server (servername). |
| 40648 |17 |Too many requests have been performed. Please retry later. |
| 40649 |16 |Invalid content-type is specified. Only application/xml is supported. |
| 40650 |16 |Subscription (subscription-id) does not exist or is not ready for the operation. |
| 40651 |16 |Failed to create server because the subscription (subscription-id) is disabled. |
| 40652 |16 |Cannot move or create server. Subscription (subscription-id) will exceed server quota. |
| 40671 |17 |Communication failure between the gateway and the management service. Please retry later. |
| 40852 |16 |Cannot open database '%.\*ls' on server '%.\*ls' requested by the login. Access to the database is only allowed using a security-enabled connection string. To access this database, modify your connection strings to contain ‘secure’ in the server FQDN  -  'server name'.database.windows.net should be modified to 'server name'.database.`secure`.windows.net. |
| 40914 | 16 | Cannot open server '*[server-name]*' requested by the login. Client is not allowed to access the server.<br /><br />To fix, consider adding a [virtual network rule](sql-database-vnet-service-endpoint-rule-overview.md). |
| 45168 |16 |The SQL Azure system is under load, and is placing an upper limit on concurrent DB CRUD operations for a single server (e.g., create database). The server specified in the error message has exceeded the maximum number of concurrent connections. Try again later. |
| 45169 |16 |The SQL azure system is under load, and is placing an upper limit on the number of concurrent server CRUD operations for a single subscription (e.g., create server). The subscription specified in the error message has exceeded the maximum number of concurrent connections, and the request was denied. Try again later. |

## Next steps
* Read about [Azure SQL Database features](sql-database-features.md).
* Read about [DTU-based purchasing model](sql-database-service-tiers-dtu.md).
* Read about [vCore-based purchasing model](sql-database-service-tiers-vcore.md).

