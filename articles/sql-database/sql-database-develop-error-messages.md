<properties 
	pageTitle="Error messages for SQL Database client programs"
	description="For each error, this gives the numeric ID and the textual message. Feel free to cross-reference your own preferred friendlier error message text if you see fit."
	services="sql-database"
	documentationCenter=""
	authors="MightyPen"
	manager="jeffreyg"
	editor="" />


<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/21/2015" 
	ms.author="genemi"/>


# Error messages for SQL Database client programs


<!--
Old Title on MSDN:  Error Messages (Azure SQL Database)
ShortId on MSDN:  ff394106.aspx
Dx 4cff491e-9359-4454-bd7c-fb72c4c452ca
-->


This topic lists several categories of error messages. Most categories are particular to Azure SQL Database, and do not apply to Microsoft SQL Server.


In your client program you have the option of providing your user with an alternative message customized by you, for any given error.


**Tip:** Of extra importance is the section of *transient fault* errors. These errors should prompt your client program to run the *retry* logic you design to retry the operation.


<a id="bkmk_connection_errors" name="bkmk_connection_errors">&nbsp;</a>


## Transient faults, Connection-Loss, and other temporary errors

The following table covers the connection-loss errors, and other transient errors, that you might encounter while working over the Internet with Azure SQL Database.

Transient errors are also called transient faults. When your program catches a `SqlException`, your program can check whether the `sqlException.Number` value is a value listed in this section of transient faults. If the `Number` value indicates a transient fault, your program can retry establishing a connection, and then retry querying through the connection. For code examples of retry logic, see:


- [Client development and quick start code samples to SQL Database](sql-database-develop-quick-start-client-code-samples.md)

- [How to: Reliably connect to Azure SQL Database](http://msdn.microsoft.com/library/azure/dn864744.aspx)


| Error number | Severity | Description |
| ---: | ---: | :--- |
| 4060 | 16 | Cannot open database "%.&#x2a;ls" requested by the login. The login failed. |
|10928|20|Resource ID: %d. The %s limit for the database is %d and has been reached. For more information, see [http://go.microsoft.com/fwlink/?LinkId=267637](http://go.microsoft.com/fwlink/?LinkId=267637).<br/><br/>The Resource ID indicates the resource that has reached the limit. For worker threads, the Resource ID = 1. For sessions, the Resource ID = 2.<br/><br/>*Note:* For more information about this error and how to resolve it, see:<br/>• [Azure SQL Database Resource Governance](http://msdn.microsoft.com/library/azure/dn338078.aspx). |
|10929|20|Resource ID: %d. The %s minimum guarantee is %d, maximum limit is %d and the current usage for the database is %d. However, the server is currently too busy to support requests greater than %d for this database. For more information, see [http://go.microsoft.com/fwlink/?LinkId=267637](http://go.microsoft.com/fwlink/?LinkId=267637). Otherwise, please try again later.<br/><br/>The Resource ID indicates the resource that has reached the limit. For worker threads, the Resource ID = 1. For sessions, the Resource ID = 2.<br/><br/>*Note:* For more information about this error and how to resolve it, see:<br/>• [Azure SQL Database Resource Governance](http://msdn.microsoft.com/library/azure/dn338078.aspx).|
|40197|17|The service has encountered an error processing your request. Please try again. Error code %d.<br/><br/>You will receive this error, when the service is down due to software or hardware upgrades, hardware failures, or any other failover problems. The error code (%d) embedded within the message of error 40197 provides additional information about the kind of failure or failover that occurred. Some examples of the error codes are embedded within the message of error 40197 are 40020, 40143, 40166, and 40540.<br/><br/>Reconnecting to your SQL Database server will automatically connect you to a healthy copy of your database. Your application must catch error 40197, log the embedded error code (%d) within the message for troubleshooting, and try reconnecting to SQL Database until the resources are available, and your connection is established again.|
|40501|20|The service is currently busy. Retry the request after 10 seconds. Incident ID: %ls. Code: %d.<br/><br/>*Note:* For more information about this error and how to resolve it, see:<br/>• [Azure SQL Database Throttling](http://msdn.microsoft.com/library/azure/dn338079.aspx).
|40613|17|Database '%.&#x2a;ls' on server '%.&#x2a;ls' is not currently available. Please retry the connection later. If the problem persists, contact customer support, and provide them the session tracing ID of '%.&#x2a;ls'.|
|49918|16|Cannot process request. Not enough resources to process request.<br/><br/>The service is currently busy. Please retry the request later. |
|49919|16|Cannot process create or update request. Too many create or update operations in progress for subscription "%ld".<br/><br/>The service is busy processing multiple create or update requests for your subscription or server. Requests are currently blocked for resource optimization. Query [sys.dm_operation_stats](https://msdn.microsoft.com/library/dn270022.aspx) for pending operations. Wait till pending create or update requests are complete or delete one of your pending requests and retry your request later. |
|49920|16|Cannot process request. Too many operations in progress for subscription "%ld".<br/><br/>The service is busy processing multiple requests for this subscription. Requests are currently blocked for resource optimization. Query [sys.dm_operation_stats](https://msdn.microsoft.com/library/dn270022.aspx) for operation stats. Wait until pending requests are complete or delete one of your pending requests and retry your request later. |

**Note:** Federation errors 10053 and 10054 might also deserve inclusion in your retry logic.


## Database copy errors


The following table covers the various errors you can encounter while copying a database in Azure SQL Database. For more information, see [Copying Databases in Azure SQL Database](http://msdn.microsoft.com/library/azure/ff951624.aspx).


|Error number|Severity|Description|
|---:|---:|:---|
|40635|16|Client with IP address '%.&#x2a;ls' is temporarily disabled.|
|40637|16|Create database copy is currently disabled.|
|40561|16|Database copy failed. Either the source or target database does not exist.|
|40562|16|Database copy failed. The source database has been dropped.|
|40563|16|Database copy failed. The target database has been dropped.|
|40564|16|Database copy failed due to an internal error. Please drop target database and try again.|
|40565|16|Database copy failed. No more than 1 concurrent database copy from the same source is allowed. Please drop target database and try again later.|
|40566|16|Database copy failed due to an internal error. Please drop target database and try again.|
|40567|16|Database copy failed due to an internal error. Please drop target database and try again.|
|40568|16|Database copy failed. Source database has become unavailable. Please drop target database and try again.|
|40569|16|Database copy failed. Target database has become unavailable. Please drop target database and try again.|
|40570|16|Database copy failed due to an internal error. Please drop target database and try again later.|
|40571|16|Database copy failed due to an internal error. Please drop target database and try again later.|


## Resource governance errors


The following table covers the errors caused by excessive use of resources while working with Azure SQL Database. For example:


- Maybe your transaction has been open for too long.
- Maybe your transaction is holding too many locks.
- Maybe your program is consuming too much memory.
- Maybe your program is consuming too much `TempDb` space.


**Tip:** The following link provides more information that applies to most or all errors in this section:


- [Azure SQL Database Resource Limits](http://msdn.microsoft.com/library/azure/dn338081.aspx).


|Error number|Severity|Description|
|---:|---:|:---|
|40544|20|The database has reached its size quota. Partition or delete data, drop indexes, or consult the documentation for possible resolutions.|
|40549|16|Session is terminated because you have a long-running transaction. Try shortening your transaction.|
|40550|16|The session has been terminated because it has acquired too many locks. Try reading or modifying fewer rows in a single transaction.|
|40551|16|The session has been terminated because of excessive `TEMPDB` usage. Try modifying your query to reduce the temporary table space usage.<br/><br/>*Tip:* If you are using temporary objects, conserve space in the `TEMPDB` database by dropping temporary objects after they are no longer needed by the session.|
|40552|16|The session has been terminated because of excessive transaction log space usage. Try modifying fewer rows in a single transaction.<br/><br/>*Tip:* If you perform bulk inserts using the `bcp.exe` utility or the `System.Data.SqlClient.SqlBulkCopy` class, try using the `-b batchsize` or `BatchSize` options to limit the number of rows copied to the server in each transaction. If you are rebuilding an index with the `ALTER INDEX` statement, try using the `REBUILD WITH ONLINE = ON` option.|
|40553|16|The session has been terminated because of excessive memory usage. Try modifying your query to process fewer rows.<br/><br/>*Tip:* Reducing the number of `ORDER BY` and `GROUP BY` operations in your Transact-SQL code reduces the memory requirements of your query.|


For additional discussion of resource governance and associated errors, see:


- [Azure SQL Database Resource Governance](http://msdn.microsoft.com/library/azure/dn338078.aspx).


## Federation errors


The following table covers the errors that you might encounter while working with federations. For more information, see [Managing Database Federations (Azure SQL Database)](http://msdn.microsoft.com/library/azure/hh597455.aspx).


> [AZURE.IMPORTANT] The current implementation of Federations will be retired with Web and Business service tiers. Version V12 of Azure SQL Database does not support the Web and Business service tiers.
> 
> The Elastic Scale feature is designed to create sharding applications with minimal effort.
> 
> For more information about Elastic Scale, see [Azure SQL Database Elastic Scale Topics](sql-database-elastic-scale-documentation-map.md). Consider deploying custom sharding solutions to maximize scalability, flexibility, and performance. For more information about custom sharding, see [Scaling Out Azure SQL Databases](http://msdn.microsoft.com/library/azure/dn495641.aspx).


|Error number|Severity|Description|Mitigation|
|---:|---:|:---|:---|
|266|16|<statement> statement not allowed within multi-statement transaction|Check that `@@trancount` is 0 on the connection before issuing the statement.|
|2072|16|Database '%.&#x2a;ls' does not exist|Check `sys.databases` for the database state before issuing `USE FEDERATION`.|
|2209|16|%s Syntax error near ‘%ls’|`FEDERATED ON` can only be used when creating tables in federation members.|
|2714|16|There is already an object named ‘%.&#x2a;ls’ in the database|Federation name already exists.|
|10054, 10053|20|A transport-level error has occurred when receiving results from the server. An established connection was aborted by the software in your host machine|Implement retry logic in your application.|
|40530|15|<statement> needs to be the only statement in the batch|Ensure that no other statements are in the batch|
|40604|16|Could not `CREATE DATABASE` because it would exceed the quota of the server|Expand the server db count quota|
|45000|16|<statement> operation failed. Specified federation name <federation_name> is not valid|Federation_name does not comply with federation name rules or is not a valid identifier|
|45001|16|<statement> operation failed. Specified federation name does not exist|Federation name does not exist|
|45002|16|<statement> operation failed. Specified federation key name <distribution_name> is not valid|Non-existent or invalid federation key|
|45004|16|<statement> operation failed. Specified value is not valid for federation key <distribution_name> and federation <federation_name>|`USE FEDERATION`: Use a boundary value that is in the domain of the federation key data type, or that is not NULL.<br/><br/>`ALTER FEDERATION SPLIT`: Use a valid value in the domain of the federation key that is not already an existing split point.<br/><br/>`ALTER FEDERATION DROP`: Use a valid value in the domain of the federation key that is already a split point.|
|45005|16|<statement>  cannot be run while another federation operation is in progress on  federation <federation_name> and member with id <member_id>|Wait for the concurrent operation to finish.|
|45006|16|<statement> operations failed. Foreign key relationships in reference tables referencing federated tables are not allowed in federation members|Unsupported.|
|45007|16|<statement> operation failed. Foreign key relationships between federate tables must include the federation key column(s).|Unsupported|
|45008|16|<statement> operation failed. Federation key data type does not match the column data type|Unsupported.|
|45009|16|<statement> operation failed. The operation is not supported on filtering connections|Unsupported.|
|45010|16|<statement> operation failed. Federation key cannot be updated|Unsupported.|
|45011|16|<statement> operation failed. Federation key schema cannot be updated|Unsupported.|
|45012|16|Value specified for the federation key is not valid|Value must be in the range that the connection is addressing.<br/><br/>If filtered, the federation key value specified.<br/><br/>If unfiltered, the range covered by the federation member.|
|45013|16|The SID already exists under a different user name|The SID for a user in a federation member is copied from the SID of the same user account in the federation root. Under certain conditions, the SID may already be in use.|
|45014|16|%ls is not supported on %ls|Unsupported operation.|
|45022|16|<statement> operation failed. Specified boundary value already exists for federation key <distribution_name> and federation <federation_name>|Specify a value that is already a boundary value.|
|45023|16|<statement> operation failed. Specified boundary value does not exists for federation key <distribution_name> and federation <federation_name>|Specify a value that is not already a boundary value.|


## General errors


The following table lists all the general errors that do not fall into any previous category.


|Error number|Severity|Description|
|---:|---:|:---|
|15006|16|<AdministratorLogin> is not a valid name because it contains invalid characters.|
|18452|14|Login failed. The login is from an untrusted domain and cannot be used with Windows authentication.%.&#x2a;ls (Windows logins are not supported in this version of SQL Server.)|
|18456|14|Login failed for user '%.&#x2a;ls'.%.&#x2a;ls%.&#x2a;ls(The login failed for user "%.&#x2a;ls". The password change failed. Password change during login is not supported in this version of SQL Server.)|
|18470|14|Login failed for user '%.&#x2a;ls'. Reason: The account is disabled.%.&#x2a;ls|
|40014|16|Multiple databases cannot be used in the same transaction.|
|40054|16|Tables without a clustered index are not supported in this version of SQL Server. Create a clustered index and try again.|
|40133|15|This operation is not supported in this version of SQL Server.|
|40506|16|Specified SID is invalid for this version of SQL Server.|
|40507|16|'%.&#x2a;ls' cannot be invoked with parameters in this version of SQL Server.|
|40508|16|USE statement is not supported to switch between databases. Use a new connection to connect to a different database.|
|40510|16|Statement '%.&#x2a;ls' is not supported in this version of SQL Server|
|40511|16|Built-in function '%.&#x2a;ls' is not supported in this version of SQL Server.|
|40512|16|Deprecated feature '%ls' is not supported in this version of SQL Server.|
|40513|16|Server variable '%.&#x2a;ls' is not supported in this version of SQL Server.|
|40514|16|'%ls' is not supported in this version of SQL Server.|
|40515|16|Reference to database and/or server name in '%.&#x2a;ls' is not supported in this version of SQL Server.|
|40516|16|Global temp objects are not supported in this version of SQL Server.|
|40517|16|Keyword or statement option '%.&#x2a;ls' is not supported in this version of SQL Server.|
|40518|16|DBCC command '%.&#x2a;ls' is not supported in this version of SQL Server.|
|40520|16|Securable class '%S_MSG' not supported in this version of SQL Server.|
|40521|16|Securable class '%S_MSG' not supported in the server scope in this version of SQL Server.|
|40522|16|Database principal '%.&#x2a;ls' type is not supported in this version of SQL Server.|
|40523|16|Implicit user '%.&#x2a;ls' creation is not supported in this version of SQL Server. Explicitly create the user before using it.|
|40524|16|Data type '%.&#x2a;ls' is not supported in this version of SQL Server.|
|40525|16|WITH '%.ls' is not supported in this version of SQL Server.|
|40526|16|'%.&#x2a;ls' rowset provider not supported in this version of SQL Server.|
|40527|16|Linked servers are not supported in this version of SQL Server.|
|40528|16|Users cannot be mapped to certificates, asymmetric keys, or Windows logins in this version of SQL Server.|
|40529|16|Built-in function '%.&#x2a;ls' in impersonation context is not supported in this version of SQL Server.|
|40532|11|Cannot open server "%.&#x2a;ls" requested by the login. The login failed.|
|40553|16|The session has been terminated because of excessive memory usage. Try modifying your query to process fewer rows.<br/><br/>*Note:* Reducing the number of `ORDER BY` and `GROUP BY` operations in your Transact-SQL code helps reduce the memory requirements of your query.|
|40604|16|Could not CREATE/ALTER DATABASE because it would exceed the quota of the server.|
|40606|16|Attaching databases is not supported in this version of SQL Server.|
|40607|16|Windows logins are not supported in this version of SQL Server.|
|40611|16|Servers can have at most 128 firewall rules defined.|
|40614|16|Start IP address of firewall rule cannot exceed End IP address.|
|40615|16|Cannot open server '{0}' requested by the login. Client with IP address '{1}' is not allowed to access the server.  To enable access, use the SQL Database Portal or run sp_set_firewall_rule on the master database to create a firewall rule for this IP address or address range.  It may take up to five minutes for this change to take effect.|
|40617|16|The firewall rule name that starts with <rule name> is too long. Maximum length is 128.|
|40618|16|The firewall rule name cannot be empty.|
|40620|16|The login failed for user "%.&#x2a;ls". The password change failed. Password change during login is not supported in this version of SQL Server.|
|40627|20|Operation on server '{0}' and database '{1}' is in progress. Please wait a few minutes before trying again.|
|40630|16|Password validation failed. The password does not meet policy requirements because it is too short.|
|40631|16|The password that you specified is too long. The password should have no more than 128 characters.|
|40632|16|Password validation failed. The password does not meet policy requirements because it is not complex enough.|
|40636|16|Cannot use a reserved database name '%.&#x2a;ls' in this operation.|
|40638|16|Invalid subscription id <subscription-id>. Subscription does not exist.|
|40639|16|Request does not conform to schema: <schema error>.|
|40640|20|The server encountered an unexpected exception.|
|40641|16|The specified location is invalid.|
|40642|17|The server is currently too busy. Please try again later.|
|40643|16|The specified x-ms-version header value is invalid.|
|40644|14|Failed to authorize access to the specified subscription.|
|40645|16|Servername <servername> cannot be empty or null. It can only be made up of lowercase letters 'a'-'z', the numbers 0-9 and the hyphen. The hyphen may not lead or trail in the name.|
|40646|16|Subscription ID cannot be empty.|
|40647|16|Subscription <subscription-id does not have server servername.|
|40648|17|Too many requests have been performed. Please retry later.|
|40649|16|Invalid content-type is specified. Only application/xml is supported.|
|40650|16|Subscription <subscription-id> does not exist or is not ready for the operation.|
|40651|16|Failed to create server because the subscription <subscription-id> is disabled.|
|40652|16|Cannot move or create server. Subscription <subscription-id> will exceed server quota.|
|40671|17|Communication failure between the gateway and the management service. Please retry later.|
|45168|16|The SQL Azure system is under load, and is placing an upper limit on concurrent DB CRUD operations for a single server (e.g., create database). The server specified in the error message has exceeded the maximum number of concurrent connections. Try again later.|
|45169|16|The SQL azure system is under load, and is placing an upper limit on the number of concurrent server CRUD operations for a single subscription (e.g., create server). The subscription specified in the error message has exceeded the maximum number of concurrent connections, and the request was denied. Try again later.|


## Related links

- [Azure SQL Database General Guidelines and Limitations](http://msdn.microsoft.com/library/azure/ee336245.aspx)
- [Resource Management](http://msdn.microsoft.com/library/azure/dn338083.aspx)
