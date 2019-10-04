---
title: "Troubleshooting connectivity issues with Microsoft Azure SQL Database| Microsoft Docs"
description: "Troubleshooting connectivity issues with Microsoft Azure SQL Database"
services: sql-database
ms.service: sql-database
ms.topic: troubleshooting
author: v-miegge
ms.author: ramakoni
ms.reviewer: ""
ms.date: 09/27/2019
---

# Troubleshooting connectivity issues with Microsoft Azure SQL Database

You receive error messages when the connection to Azure SQL Database fails. The connection problems can be caused by SQL Azure database reconfiguration, firewall settings, connection time-out, or incorrect login information. Additionally, if the maximum limit on some Azure SQL Database resources is reached, you cannot connect to Azure SQL Database.

## Error 40613: Database < x > on server < y > is not currently available

**Detailed Error**

``40613: Database <DBname> on server <server name> is not currently available. Please retry the connection later. If the problem persists, contact customer support, and provide them the session tracing ID of '<Tracing ID>'.``

To resolve this issue:

1. Check the [Microsoft Azure Service Dashboard](https://status.azure.com/status) for any known outages. 
2. If there are no known outages go to the [Microsoft Azure Support website](http://azure.microsoft.com/support/options) to open a support case.

For more information, see [Troubleshoot "Database on server is not currently available" error](https://docs.microsoft.com/azure/sql-database/sql-database-troubleshoot-common-connection-issues#troubleshoot-transient-errors).

## A network-related or instance-specific error occurred while establishing a connection to SQL Server

The issue occurs because the application is not able to connect to the server.

To resolve this issue, try the steps (in order) in the section below, titled **Steps to fix common connection issues**.

## The server was not found or was not accessible (Errors 26, 40, 10053)

### Error 26: Error Locating Server/Instance Specified

**Detailed Error**

``System.Data.SqlClient.SqlException: A network-related or instance-specific error occurred while establishing a connection to SQL Server. The server was not found or was not accessible. Verify that the instance name is correct and that SQL Server is configured to allow remote connections.(provider: SQL Network Interfaces, error: 26 – Error Locating Server/Instance Specified)``

### Error 40: Could not open a connection to SQL Server

**Detailed Error**

``A network-related or instance-specific error occurred while establishing a connection to SQL Server. The server was not found or was not accessible. Verify that the instance name is correct and that SQL Server is configured to allow remote connections. (provider: Named Pipes Provider, error: 40 - Could not open a connection to SQL Server)``

### Error 10053: A transport-level error has occurred when receiving results from the server.

**Detailed Error**

``10053: A transport-level error has occurred when receiving results from the server. (Provider: TCP Provider, error: 0 - An established connection was aborted by the software in your host machine)``

These issues occur because the application is not able to connect to the server.

To resolve this issue, try the steps (in order) in the section below, titled **Steps to fix common connection issues**.

## Cannot connect to < servername > due to firewall issues

### Error 40615: Cannot connect to < servername >

To resolve this issue, [configure firewall settings on SQL Database using the Azure portal.](https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure)

### Error 5: Cannot connect to < servername >

To resolve this issue, make sure that port 1433 is open for outbound connections on all firewalls between the client and the Internet. 

For more information, see [Configure the Windows Firewall to Allow SQL Server Access](https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure).

## Unable to login to the server (Errors 18456, 40531)

### Login failed for user '< User name >'

**Detailed Error**

``Login failed for user '<User name>'.This session has been assigned a tracing ID of '<Tracing ID>'. Provide this tracing ID to customer support when you need assistance. (Microsoft SQL Server, Error: 18456)``

To resolve this issue, contact your service administrator to provide you with a valid SQL user name and password.

Typically, the service administrator can use the following steps to add the login:

1. Log in to the server using SQL Server Management Studio (SSMS).
2. Check whether the login name is disabled by using the following SQL query:

   ```
   SELECT name, is_disabled FROM sys.sql_logins
   ```

3. If the corresponding name is disabled, enable it by using the following statement: 

   ```
   Alter login <User name> enable
   ```

4. If the SQL login user name does not exist, create it by using SSMS:

   1. Double-click **Security** to expand it. 
   2. Right-click **Logins**, and then select **New login**. 
   3. In the generated script with placeholders, you can edit and run the following SQL query:
 
   ```
   CREATE LOGIN <SQL_login_name, sysname, login_name>
   WITH PASSWORD = ‘<password, sysname, Change_Password>’
   GO
   ```       
5. Double-click **Database**. 
6. Select the database to which you want to grant user the permission.
7. Double-click **Security**. 
8. Right-click **Users**, and then select **New User**. 
9. In the generated script with placeholders, you can edit and run the following SQL query: 

   ```
   CREATE USER <user_name, sysname, user_name>          
   FOR LOGIN <login_name, sysname, login_name>
   WITH DEFAULT_SCHEMA = <default_schema, sysname, dbo>
   GO
   
   -- Add user to the database owner role

   EXEC sp_addrolemember N’db_owner’, N’<user_name, sysname, user_name>’
   GO
   ```
   
   > [!NOTE]
   > You can also use `sp_addrolemember` to map specific users to specific database roles. 

For more information, see [Managing Databases and Logins in Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-manage-logins).

## Connection timeout expired errors

### System.Data.SqlClient.SqlException (0x80131904): Connection Timeout Expired.

**Detailed Error**

``System.Data.SqlClient.SqlException (0x80131904): Connection Timeout Expired. The timeout period elapsed while attempting to consume the pre-login handshake acknowledgement. This could be because the pre-login handshake failed or the server was unable to respond back in time. The duration spent while attempting to connect to this server was - [Pre-Login] initialization=3; handshake=29995;``

### System.Data.SqlClient.SqlException (0x80131904): Timeout expired.

**Detailed Error**

``System.Data.SqlClient.SqlException (0x80131904): Timeout expired. The timeout period elapsed prior to completion of the operation or the server is not responding.``

### System.Data.Entity.Core.EntityException: The underlying provider failed on Open.

**Detailed Error**

``System.Data.Entity.Core.EntityException: The underlying provider failed on Open. -> System.Data.SqlClient.SqlException: Timeout expired. The timeout period elapsed prior to completion of the operation or the server is not responding. -> System.ComponentModel.Win32Exception: The wait operation timed out``

### Cannot connect to < server name >.``

**Detailed Error**

``Cannot connect to <server name>.ADDITIONAL INFORMATION:Connection Timeout Expired. The timeout period elapsed during the post-login phase. The connection could have timed out while waiting for server to complete the login process and respond; Or it could have timed out while attempting to create multiple active connections. The duration spent while attempting to connect to this server was - [Pre-Login] initialization=231; handshake=983; [Login] initialization=0; authentication=0; [Post-Login] complete=13000; (Microsoft SQL Server, Error: -2) For help, click: http://go.microsoft.com/fwlink?ProdName=Microsoft%20SQL%20Server&EvtSrc=MSSQLServer&EvtID=-2&LinkId=20476 The wait operation timed out``

These exceptions can occur either because of connection or query issues. To confirm this error is because of connectivity issues, check the section below titled **Confirm whether the error is due to a connectivity issue**:

Connection timeouts occur because the application is not able to connect to the server. To resolve this issue, try the steps (in order) in the section below, titled **Steps to fix common connection issues**.

## Transient errors (Errors 40197, 40545)

### Error 40197: The service has encountered an error processing your request. Please try again. Error code < code >

This issue occurs because of a transient error encountered during a reconfiguration/failover on the backend.

To resolve this issue, wait a short period and retry. No support case is required unless the issue remains persistent.

As a best practice, ensure retry logic is in place. For more information about the retry logic, see [Troubleshoot transient faults and connection errors to SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-connectivity-issues).

## Connection Terminated due to hitting some system-defined limit

### Error 10928: Resource ID: %d.

**Detailed Error**

``10928: Resource ID: %d. The %s limit for the database is %d and has been reached. See http://go.microsoft.com/fwlink/?LinkId=267637 for assistance. The Resource ID value in error message indicates the resource for which limit has been reached. For sessions, Resource ID = 2.``

To work around this issue, try one of the following methods:

* Verify whether there are long-running queries:

  > [!NOTE]
  > This is a minimalist approach that may not necessarily resolve the issue.

  1. Check the [sys.dm_exec_requests](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql) view to see any blocking requests, by executing the following SQL query:

     ```
     SELECT * FROM dm_exec_requests
     ```

  2. Determine the **input buffer** for the head blocker.
  3. Tune the head blocker query.

    For an in-depth troubleshooting procedure, see [Is my query running fine in the cloud?](http://blogs.msdn.com/b/sqlblog/archive/2013/11/01/is-my-query-running-fine-in-the-cloud.aspx).

* If the database consistently reaches its limit despite addressing blocking and long-running queries, consider upgrading to one of the new Preview editions (such as [Standard or Premium editions](https://azure.microsoft.com/pricing/details/sql-database/)).

For more information about SQL Database pricing options review [Azure SQL Database Pricing](https://azure.microsoft.com/pricing/details/sql-database/single/).

For more information about dynamic management views, see [System Dynamic Management Views](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/system-dynamic-management-views).

For more information about this error message, see  [SQL Database resource limits for Azure SQL Database server](https://docs.microsoft.com/azure/sql-database/sql-database-resource-limits-database-server).

### Error 10929: Resource ID: 1.

**Detailed Error**

``10929: Resource ID: 1. The %s minimum guarantee is %d, maximum limit is %d and the current usage for the database is %d. However, the server is currently too busy to support requests greater than %d for this database. See http://go.microsoft.com/fwlink/?LinkId=267637 for assistance. Otherwise, please try again later.``

For more information about this error, see [Error messages for SQL Database client programs](https://docs.microsoft.com/azure/sql-database/sql-database-develop-error-messages)

### Error 40501: The service is currently busy

**Detailed Error**

``40501: The service is currently busy. Retry the request after 10 seconds. Incident ID: %ls. Code: %d.``

This is an engine throttling error, an indication that resource limits are being exceeded.

For more information about resource limits, see [Database server resource limits](https://docs.microsoft.com/azure/sql-database/sql-database-resource-limits-database-server).

### Error 40544 : The database has reached its size quota

**Detailed Error**

``40544: The database has reached its size quota. Partition or delete data, drop indexes, or consult the documentation for possible resolutions. Incident ID: <ID>. Code: <code>.``

This error occurs when the database has reached its size quota.

The following steps can help you with either working around the problem or provide you with additional options that you can consider.

1. Check the current size of the database by using the dashboard in the Azure portal.

   > [!NOTE]
   > To identify which tables are consuming the most space and potential candidates for cleanup, you can use the following SQL query:

   ```
   SELECT o.name,
    a.SUM(p.row_count) AS 'Row Count',
    b.SUM(p.reserved_page_count) * 8.0 / 1024 AS 'Table Size (MB)'
   FROM sys.objects o
   JOIN sys.dm_db_partition_stats p on p.object_id = o.object_id
   GROUP BY o.name
   ORDER BY [Table Size (MB)] DESC
   ```

2. If the current size does not exceed the maximum size supported for your edition, you can use ALTER DATABASE to increase the MAXSIZE setting. 
3. If the database size is already past the maximum supported size for your edition, you can take one of the following steps:
   1. Perform normal database cleanup activities (cleaning up the unwanted data by using truncate/delete etc. or move data out using SSIS, bcp etc.)
   2. Partition or delete data, drop indexes, or consult the documentation for possible resolutions. 
   
   *  For database scaling, see [Scale single database resources](https://docs.microsoft.com/azure/sql-database/sql-database-single-database-scale) and [Scale elastic pool resources](https://docs.microsoft.com/azure/sql-database/sql-database-elastic-pool-scale).

### Error 40549: Session is terminated because you have a long-running transaction.

**Detailed Error**

``40549: Session is terminated because you have a long-running transaction. Try shortening your transaction.``

If you repeatedly encounter this error message, try these steps to resolve this issue: 

1. Check the sys.dm_exec_requests view to see any open sessions that have a high value for the total_elapsed_time column by executing the following SQL Script:

   ```
   SELECT * FROM dm_exec_requests
   ```
2. Determine the input buffer for the query that is long running. 
3. Tune the query.

Also consider batching your queries. For information on batching, see [How to use batching to improve SQL Database application performance](https://docs.microsoft.com/azure/sql-database/sql-database-use-batching-to-improve-performance).

For an in-depth troubleshooting procedure, see [Is my query running fine in the cloud?](http://blogs.msdn.com/b/sqlblog/archive/2013/11/01/is-my-query-running-fine-in-the-cloud.aspx).

### Error 40551: The session has been terminated because of excessive TEMPDB usage.

**Detailed Error**

``40551: The session has been terminated because of excessive TEMPDB usage. Try modifying your query to reduce the temporary table space usage.``

To work around this issue, follow these steps:

1. Change the queries to reduce the temporary table space usage. 
2. Drop temporary objects after they are no longer needed. 
3. Truncate tables or remove unused tables.

### Error 40552: The session has been terminated because of excessive transaction log space usage.

**Detailed Error**

``40552: The session has been terminated because of excessive transaction log space usage. Try modifying fewer rows in a single transaction.``

To resolve this issue, follow these methods: 

* The issue occurs because of insert, update, or delete operations. 
Try to reduce the number of rows that are operated on immediately by implementing batching or splitting into multiple smaller transactions.
* The issue occurs because of the index rebuild operations. Make sure that you adhere to the following formula: 
number of rows that are affected in table * (average size of field that is updated in bytes + 80) < 2 GB

  > [!NOTE]
  > For index rebuild, the average size of the field that is updated should be substituted by average index size.

### Error 40553: The session has been terminated because of excessive memory usage.

**Detailed Error**

``40553 : The session has been terminated because of excessive memory usage. Try modifying your query to process fewer rows.``

To work around this issue, try to optimize the query.

For an in-depth troubleshooting procedure, see [Is my query running fine in the cloud?](http://blogs.msdn.com/b/sqlblog/archive/2013/11/01/is-my-query-running-fine-in-the-cloud.aspx).


### Cannot open database "master" requested by the login. The login failed.

This issue occurs because the account does not have access permission to the master database. However, by default, SQL Server Management Studio (SSMS) tries to connect to the master database.

To resolve this issue, follow these steps:

1. On the login screen of SSMS, click **Options**, then click **Connection Properties**. 
2. In **Connect to database**, type the user’s default database name as the default login database, then click **Connect**.

   ![cannot-open-database-master.png](media/troubleshoot-connectivity-issues-microsoft-azure-sql-database/cannot-open-database-master.png)

## Confirm whether an error is due to a connectivity issue

To confirm whether an error is due to a connectivity issue, review the stack trace for frames that show calls to open a connection like the following ones (Note the reference to the **SqlConnection** class):

```
System.Data.SqlClient.SqlConnection.TryOpen(TaskCompletionSource`1 retry)
 at System.Data.SqlClient.SqlConnection.Open()
 at AzureConnectionTest.Program.Main(String[] args)
ClientConnectionId:<Client connection ID>
```

When the exception happens due to query issues, you will notice a call stack that is similar to the following ones (Note the reference to the **SqlCommand** class). In these scenarios, [tune your queries](http://blogs.msdn.com/b/sqlblog/archive/2013/11/01/is-my-query-running-fine-in-the-cloud.aspx).

```
  at System.Data.SqlClient.SqlCommand.ExecuteReader()
  at AzureConnectionTest.Program.Main(String[] args)
  ClientConnectionId:<Client ID>
```
For additional guidance on fine tuning performance, please see the following:

* [How to maintain Azure SQL Indexes and Statistics](https://techcommunity.microsoft.com/t5/Azure-Database-Support-Blog/How-to-maintain-Azure-SQL-Indexes-and-Statistics/ba-p/368787)
* [Manual tune query performance in Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-performance-guidance)
* [Monitoring performance Azure SQL Database using dynamic management views](https://docs.microsoft.com/azure/sql-database/sql-database-monitoring-with-dmvs)
* [Operating the Query Store in Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-operate-query-store)


## Steps to fix common connection issues

1. Make sure that TCP IP is enabled as a client protocol on the application server. For more information, see [Configure client protocols](https://docs.microsoft.com/sql/database-engine/configure-windows/configure-client-protocols). On application servers where you do not have SQL Server tools installed, check that TCP IP is enabled by running **cliconfg.exe** (SQL Server Client Network Utility). 
2. Check the application’s connection string to make sure that it is correctly configured. For example, make sure that the connection string specifies the correct port (1433) and the fully qualified server name.
See [Get SQL Server connection information](https://docs.microsoft.com/azure/sql-database/sql-database-connect-query-ssms#get-sql-server-connection-information).
3. Try increasing the connection **timeout**. Microsoft recommends using a connection timeout of at least 30 seconds. 
4. Test the connectivity between the application server and the Azure SQL database by using [SQL Server management Studio (SSMS)](https://docs.microsoft.com/azure/sql-database/sql-database-connect-query-ssms), a UDL file, ping, and telnet. For more information, see [Troubleshooting SQL Server connectivity issues](https://support.microsoft.com/help/4009936/solving-connectivity-errors-to-sql-server) and [Diagnostics for connectivity issues](https://docs.microsoft.com/azure/sql-database/sql-database-connectivity-issues#diagnostics).

   > [!NOTE]
   > As a troubleshooting step, you can also try to test the connectivity on a different client computer.

5. As a best practice, ensure retry logic is in place. For more information about the retry logic, see [Troubleshoot transient faults and connection errors to SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-connectivity-issues).

If the previous steps do not resolve your problem, try to collect more data and contact support. If your application is a cloud service, enable the logging. This step returns a UTC time stamp of the failure. Additionally, SQL Azure returns the tracing ID. [Microsoft Customer Support Services](http://azure.microsoft.com/support/options/) can use this information. 

For more information about how to enable the logging, see [Enable diagnostics logging for web apps in Azure App Service](https://azure.microsoft.com/documentation/articles/web-sites-enable-diagnostic-log/).

**Related documents**

* [Azure SQL Connectivity Architecture](https://docs.microsoft.com/azure/sql-database/sql-database-connectivity-architecture)<br>
* [Azure SQL Database and Data Warehouse network access controls](https://docs.microsoft.com/azure/sql-database/sql-database-networkaccess-overview)