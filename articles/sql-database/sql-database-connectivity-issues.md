---
title: Fix a SQL connection error, transient error | Microsoft Docs
description: Learn how to troubleshoot, diagnose, and prevent a SQL connection error or transient error in Azure SQL Database.
keywords: sql connection,connection string,connectivity issues,transient error,connection error
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: dalechen
ms.author: ninarn
ms.reviewer: carlrab
manager: craigg
ms.date: 08/01/2018
---
# Troubleshoot, diagnose, and prevent SQL connection errors and transient errors for SQL Database
This article describes how to prevent, troubleshoot, diagnose, and mitigate connection errors and transient errors that your client application encounters when it interacts with Azure SQL Database. Learn how to configure retry logic, build the connection string, and adjust other connection settings.

<a id="i-transient-faults" name="i-transient-faults"></a>

## Transient errors (transient faults)
A transient error, also known as a transient fault, has an underlying cause that soon resolves itself. An occasional cause of transient errors is when the Azure system quickly shifts hardware resources to better load-balance various workloads. Most of these reconfiguration events finish in less than 60 seconds. During this reconfiguration time span, you might have connectivity issues to SQL Database. Applications that connect to SQL Database should be built to expect these transient errors. To handle them, implement retry logic in their code instead of surfacing them to users as application errors.

If your client program uses ADO.NET, your program is told about the transient error by the throw of **SqlException**. Compare the **Number** property against the list of transient errors that are found near the top of the article
[SQL error codes for SQL Database client applications](sql-database-develop-error-messages.md).

<a id="connection-versus-command" name="connection-versus-command"></a>

### Connection vs. command
Retry the SQL connection or establish it again, depending on the following:

* **A transient error occurs during a connection try**: After a delay of several seconds, retry the connection.
* **A transient error occurs during a SQL query command**: Do not immediately retry the command. Instead, after a delay, freshly establish the connection. Then retry the command.


<a id="j-retry-logic-transient-faults" name="j-retry-logic-transient-faults"></a>

## Retry logic for transient errors
Client programs that occasionally encounter a transient error are more robust when they contain retry logic.

When your program communicates with SQL Database through third-party middleware, ask the vendor whether the middleware contains retry logic for transient errors.

<a id="principles-for-retry" name="principles-for-retry"></a>

### Principles for retry
* If the error is transient, retry to open a connection.
* Do not directly retry a SQL SELECT statement that failed with a transient error.
  * Instead, establish a fresh connection, and then retry the SELECT.
* When a SQL UPDATE statement fails with a transient error, establish a fresh connection before you retry the UPDATE.
  * The retry logic must ensure that either the entire database transaction finished or that the entire transaction is rolled back.

### Other considerations for retry
* A batch program that automatically starts after work hours and finishes before morning can afford to be very patient with long time intervals between its retry attempts.
* A user interface program should account for the human tendency to give up after too long a wait.
  * The solution must not retry every few seconds, because that policy can flood the system with requests.

### Interval increase between retries
We recommend that you wait for 5 seconds before your first retry. Retrying after a delay shorter than 5 seconds risks overwhelming the cloud service. For each subsequent retry, the delay should grow exponentially, up to a maximum of 60 seconds.

For a discussion of the blocking period for clients that use ADO.NET, see [SQL Server connection pooling (ADO.NET)](http://msdn.microsoft.com/library/8xx3tyca.aspx).

You also might want to set a maximum number of retries before the program self-terminates.

### Code samples with retry logic
Code examples with retry logic are available at:

- [Connect resiliently to SQL with ADO.NET][step-4-connect-resiliently-to-sql-with-ado-net-a78n]
- [Connect resiliently to SQL with PHP][step-4-connect-resiliently-to-sql-with-php-p42h]

<a id="k-test-retry-logic" name="k-test-retry-logic"></a>

### Test your retry logic
To test your retry logic, you must simulate or cause an error that can be corrected while your program is still running.

#### Test by disconnecting from the network
One way you can test your retry logic is to disconnect your client computer from the network while the program is running. The error is:

* **SqlException.Number** = 11001
* Message: "No such host is known"

As part of the first retry attempt, your program can correct the misspelling and then attempt to connect.

To make this test practical, unplug your computer from the network before you start your program. Then your program recognizes a runtime parameter that causes the program to:

* Temporarily add 11001 to its list of errors to consider as transient.
* Attempt its first connection as usual.
* After the error is caught, remove 11001 from the list.
* Display a message that tells the user to plug the computer into the network.
   * Pause further execution by using either the **Console.ReadLine** method or a dialog with an OK button. The user presses the Enter key after the computer is plugged into the network.
* Attempt again to connect, expecting success.

#### Test by misspelling the database name when connecting
Your program can purposely misspell the user name before the first connection attempt. The error is:

* **SqlException.Number** = 18456
* Message: "Login failed for user 'WRONG_MyUserName'."

As part of the first retry attempt, your program can correct the misspelling and then attempt to connect.

To make this test practical, your program recognizes a runtime parameter that causes the program to:

* Temporarily add 18456 to its list of errors to consider as transient.
* Purposely add 'WRONG_' to the user name.
* After the error is caught, remove 18456 from the list.
* Remove 'WRONG_' from the user name.
* Attempt again to connect, expecting success.


<a id="net-sqlconnection-parameters-for-connection-retry" name="net-sqlconnection-parameters-for-connection-retry"></a>

## .NET SqlConnection parameters for connection retry
If your client program connects to SQL Database by using the .NET Framework class **System.Data.SqlClient.SqlConnection**, use .NET 4.6.1 or later (or .NET Core) so that you can use its connection retry feature. For more information on the feature, see [this webpage](http://go.microsoft.com/fwlink/?linkid=393996).

<!--
2015-11-30, FwLink 393996 points to dn632678.aspx, which links to a downloadable .docx related to SqlClient and SQL Server 2014.
-->

When you build the [connection string](http://msdn.microsoft.com/library/System.Data.SqlClient.SqlConnection.connectionstring.aspx) for your **SqlConnection** object, coordinate the values among the following parameters:

* **ConnectRetryCount**:&nbsp;&nbsp;Default is 1. Range is 0 through 255.
* **ConnectRetryInterval**:&nbsp;&nbsp;Default is 1 second. Range is 1 through 60.
* **Connection Timeout**:&nbsp;&nbsp;Default is 15 seconds. Range is 0 through 2147483647.

Specifically, your chosen values should make the following equality true:

Connection Timeout = ConnectRetryCount * ConnectionRetryInterval

For example, if the count equals 3 and the interval equals 10 seconds, a timeout of only 29 seconds doesn't give the system enough time for its third and final retry to connect: 29 < 3 * 10.

<a id="connection-versus-command" name="connection-versus-command"></a>

## Connection vs. command
The **ConnectRetryCount** and **ConnectRetryInterval** parameters let your **SqlConnection** object retry the connect operation without telling or bothering your program, such as returning control to your program. The retries can occur in the following situations:

* mySqlConnection.Open method call
* mySqlConnection.Execute method call

There is a subtlety. If a transient error occurs while your *query* is being executed, your **SqlConnection** object doesn't retry the connect operation. It certainly doesn't retry your query. However, **SqlConnection** very quickly checks the connection before sending your query for execution. If the quick check detects a connection problem, **SqlConnection** retries the connect operation. If the retry succeeds, your query is sent for execution.

### Should ConnectRetryCount be combined with application retry logic?
Suppose your application has robust custom retry logic. It might retry the connect operation four times. If you add **ConnectRetryInterval** and **ConnectRetryCount** =3 to your connection string, you will increase the retry count to 4 * 3 = 12 retries. You might not intend such a high number of retries.


<a id="a-connection-connection-string" name="a-connection-connection-string"></a>

## Connections to SQL Database
<a id="c-connection-string" name="c-connection-string"></a>

### Connection: Connection string
The connection string that's necessary to connect to SQL Database is slightly different from the string used to connect to SQL Server. You can copy the connection string for your database from the [Azure portal](https://portal.azure.com/).

[!INCLUDE [sql-database-include-connection-string-20-portalshots](../../includes/sql-database-include-connection-string-20-portalshots.md)]

<a id="b-connection-ip-address" name="b-connection-ip-address"></a>

### Connection: IP address
You must configure the SQL Database server to accept communication from the IP address of the computer that hosts your client program. To set up this configuration, edit the firewall settings through the [Azure portal](https://portal.azure.com/).

If you forget to configure the IP address, your program fails with a handy error message that states the necessary IP address.

[!INCLUDE [sql-database-include-ip-address-22-portal](../../includes/sql-database-include-ip-address-22-v12portal.md)]

For more information, see
[Configure firewall settings on SQL Database](sql-database-configure-firewall-settings.md).
<a id="c-connection-ports" name="c-connection-ports"></a>

### Connection: Ports
Typically, you need to ensure that only port 1433 is open for outbound communication on the computer that hosts your client program.

For example, when your client program is hosted on a Windows computer, you can use Windows Firewall on the host to open port 1433.

1. Open Control Panel.

2. Select **All Control Panel Items** > **Windows Firewall** > **Advanced Settings** > **Outbound Rules** > **Actions** > **New Rule**.

If your client program is hosted on an Azure virtual machine (VM), read [Ports beyond 1433 for ADO.NET 4.5 and SQL Database](sql-database-develop-direct-route-ports-adonet-v12.md).

For background information about configuration of ports and IP addresses, see
[Azure SQL Database firewall](sql-database-firewall-configure.md).

<a id="d-connection-ado-net-4-5" name="d-connection-ado-net-4-5"></a>

### Connection: ADO.NET 4.6.2 or later
If your program uses ADO.NET classes like **System.Data.SqlClient.SqlConnection** to connect to SQL Database, we recommend that you use .NET Framework version 4.6.2 or later.

Starting with ADO.NET 4.6.2:

- The connection open attempt to be retried immediately for Azure SQL databases, thereby improving the performance of cloud-enabled apps.

Starting with ADO.NET 4.6.1:

* For SQL Database, reliability is improved when you open a connection by using the **SqlConnection.Open** method. The **Open** method now incorporates best-effort retry mechanisms in response to transient faults for certain errors within the connection timeout period.
* Connection pooling is supported, which includes an efficient verification that the connection object it gives your program is functioning.

When you use a connection object from a connection pool, we recommend that your program temporarily closes the connection when it's not immediately in use. It's not expensive to reopen a connection, but it is to create a new connection.

If you use ADO.NET 4.0 or earlier, we recommend that you upgrade to the latest ADO.NET. As of August 2018, you can [download ADO.NET 4.6.2](https://blogs.msdn.microsoft.com/dotnet/2018/04/30/announcing-the-net-framework-4-7-2/).

<a id="e-diagnostics-test-utilities-connect" name="e-diagnostics-test-utilities-connect"></a>

## Diagnostics
<a id="d-test-whether-utilities-can-connect" name="d-test-whether-utilities-can-connect"></a>

### Diagnostics: Test whether utilities can connect
If your program fails to connect to SQL Database, one diagnostic option is to try to connect with a utility program. Ideally, the utility connects by using the same library that your program uses.

On any Windows computer, you can try these utilities:

* SQL Server Management Studio (ssms.exe), which connects by using ADO.NET
* sqlcmd.exe, which connects by using [ODBC](http://msdn.microsoft.com/library/jj730308.aspx)

After your program is connected, test whether a short SQL SELECT query works.

<a id="f-diagnostics-check-open-ports" name="f-diagnostics-check-open-ports"></a>

### Diagnostics: Check the open ports
If you suspect that connection attempts fail due to port issues, you can run a utility on your computer that reports on the port configurations.

On Linux, the following utilities might be helpful:

* `netstat -nap`
* `nmap -sS -O 127.0.0.1`
  * Change the example value to be your IP address.

On Windows, the [PortQry.exe](http://www.microsoft.com/download/details.aspx?id=17148) utility might be helpful. Here's an example execution that queried the port situation on a SQL Database server and that was run on a laptop computer:

```
[C:\Users\johndoe\]
>> portqry.exe -n johndoesvr9.database.windows.net -p tcp -e 1433

Querying target system called:
 johndoesvr9.database.windows.net

Attempting to resolve name to IP address...
Name resolved to 23.100.117.95

querying...
TCP port 1433 (ms-sql-s service): LISTENING

[C:\Users\johndoe\]
>>
```


<a id="g-diagnostics-log-your-errors" name="g-diagnostics-log-your-errors"></a>

### Diagnostics: Log your errors
An intermittent problem is sometimes best diagnosed by detection of a general pattern over days or weeks.

Your client can assist in a diagnosis by logging all errors it encounters. You might be able to correlate the log entries with error data that SQL Database logs itself internally.

Enterprise Library 6 (EntLib60) offers .NET managed classes to assist with logging. For more information, see [5 - As easy as falling off a log: Use the Logging Application Block](http://msdn.microsoft.com/library/dn440731.aspx).

<a id="h-diagnostics-examine-logs-errors" name="h-diagnostics-examine-logs-errors"></a>

### Diagnostics: Examine system logs for errors
Here are some Transact-SQL SELECT statements that query error logs and other information.

| Query of log | Description |
|:--- |:--- |
| `SELECT e.*`<br/>`FROM sys.event_log AS e`<br/>`WHERE e.database_name = 'myDbName'`<br/>`AND e.event_category = 'connectivity'`<br/>`AND 2 >= DateDiff`<br/>&nbsp;&nbsp;`(hour, e.end_time, GetUtcDate())`<br/>`ORDER BY e.event_category,`<br/>&nbsp;&nbsp;`e.event_type, e.end_time;` |The [sys.event_log](http://msdn.microsoft.com/library/dn270018.aspx) view offers information about individual events, which includes some that can cause transient errors or connectivity failures.<br/><br/>Ideally, you can correlate the **start_time** or **end_time** values with information about when your client program experienced problems.<br/><br/>You must connect to the *master* database to run this query. |
| `SELECT c.*`<br/>`FROM sys.database_connection_stats AS c`<br/>`WHERE c.database_name = 'myDbName'`<br/>`AND 24 >= DateDiff`<br/>&nbsp;&nbsp;`(hour, c.end_time, GetUtcDate())`<br/>`ORDER BY c.end_time;` |The [sys.database_connection_stats](http://msdn.microsoft.com/library/dn269986.aspx) view offers aggregated counts of event types for additional diagnostics.<br/><br/>You must connect to the *master* database to run this query. |

<a id="d-search-for-problem-events-in-the-sql-database-log" name="d-search-for-problem-events-in-the-sql-database-log"></a>

### Diagnostics: Search for problem events in the SQL Database log
You can search for entries about problem events in the SQL Database log. Try the following Transact-SQL SELECT statement in the *master* database:

```
SELECT
   object_name
  ,CAST(f.event_data as XML).value
      ('(/event/@timestamp)[1]', 'datetime2')                      AS [timestamp]
  ,CAST(f.event_data as XML).value
      ('(/event/data[@name="error"]/value)[1]', 'int')             AS [error]
  ,CAST(f.event_data as XML).value
      ('(/event/data[@name="state"]/value)[1]', 'int')             AS [state]
  ,CAST(f.event_data as XML).value
      ('(/event/data[@name="is_success"]/value)[1]', 'bit')        AS [is_success]
  ,CAST(f.event_data as XML).value
      ('(/event/data[@name="database_name"]/value)[1]', 'sysname') AS [database_name]
FROM
  sys.fn_xe_telemetry_blob_target_read_file('el', null, null, null) AS f
WHERE
  object_name != 'login_event'  -- Login events are numerous.
  and
  '2015-06-21' < CAST(f.event_data as XML).value
        ('(/event/@timestamp)[1]', 'datetime2')
ORDER BY
  [timestamp] DESC
;
```


#### A few returned rows from sys.fn_xe_telemetry_blob_target_read_file
The following example shows what a returned row might look like. The null values shown are often not null in other rows.

```
object_name                   timestamp                    error  state  is_success  database_name

database_xml_deadlock_report  2015-10-16 20:28:01.0090000  NULL   NULL   NULL        AdventureWorks
```


<a id="l-enterprise-library-6" name="l-enterprise-library-6"></a>

## Enterprise Library 6
Enterprise Library 6 (EntLib60) is a framework of .NET classes that helps you implement robust clients of cloud services, one of which is the SQL Database service. To locate topics dedicated to each area in which EntLib60 can assist, see [Enterprise Library 6 - April 2013](http://msdn.microsoft.com/library/dn169621%28v=pandp.60%29.aspx).

Retry logic for handling transient errors is one area in which EntLib60 can assist. For more information, see [4 - Perseverance, secret of all triumphs: Use the Transient Fault Handling Application Block](http://msdn.microsoft.com/library/dn440719%28v=pandp.60%29.aspx).

> [!NOTE]
> The source code for EntLib60 is available for public download from the [Download Center](http://go.microsoft.com/fwlink/p/?LinkID=290898). Microsoft has no plans to make further feature updates or maintenance updates to EntLib.
>
>

<a id="entlib60-classes-for-transient-errors-and-retry" name="entlib60-classes-for-transient-errors-and-retry"></a>

### EntLib60 classes for transient errors and retry
The following EntLib60 classes are particularly useful for retry logic. All these classes are found in or under the namespace **Microsoft.Practices.EnterpriseLibrary.TransientFaultHandling**.

In the namespace **Microsoft.Practices.EnterpriseLibrary.TransientFaultHandling**:

* **RetryPolicy** class

  * **ExecuteAction** method
* **ExponentialBackoff** class
* **SqlDatabaseTransientErrorDetectionStrategy** class
* **ReliableSqlConnection** class

  * **ExecuteCommand** method

In the namespace **Microsoft.Practices.EnterpriseLibrary.TransientFaultHandling.TestSupport**:

* **AlwaysTransientErrorDetectionStrategy** class
* **NeverTransientErrorDetectionStrategy** class

Here are some links to information about EntLib60:

* Free book download: [Developer's Guide to Microsoft Enterprise Library, 2nd edition](http://www.microsoft.com/download/details.aspx?id=41145).
* Best practices: [Retry general guidance](../best-practices-retry-general.md) has an excellent in-depth discussion of retry logic.
* NuGet download: [Enterprise Library - Transient Fault Handling Application Block 6.0](http://www.nuget.org/packages/EnterpriseLibrary.TransientFaultHandling/).

<a id="entlib60-the-logging-block" name="entlib60-the-logging-block"></a>

### EntLib60: The logging block
* The logging block is a highly flexible and configurable solution that you can use to:

  * Create and store log messages in a wide variety of locations.
  * Categorize and filter messages.
  * Collect contextual information that is useful for debugging and tracing, as well as for auditing and general logging requirements.
* The logging block abstracts the logging functionality from the log destination so that the application code is consistent, irrespective of the location and type of the target logging store.

For more information, see
[5 - As easy as falling off a log: Use the Logging Application Block](https://msdn.microsoft.com/library/dn440731%28v=pandp.60%29.aspx).

<a id="entlib60-istransient-method-source-code" name="entlib60-istransient-method-source-code"></a>

### EntLib60 IsTransient method source code
Next, from the **SqlDatabaseTransientErrorDetectionStrategy** class, is the C# source code for the **IsTransient** method. The source code clarifies which errors were considered transient and worthy of retry, as of April 2013.

```csharp
public bool IsTransient(Exception ex)
{
  if (ex != null)
  {
    SqlException sqlException;
    if ((sqlException = ex as SqlException) != null)
    {
      // Enumerate through all errors found in the exception.
      foreach (SqlError err in sqlException.Errors)
      {
        switch (err.Number)
        {
            // SQL Error Code: 40501
            // The service is currently busy. Retry the request after 10 seconds.
            // Code: (reason code to be decoded).
          case ThrottlingCondition.ThrottlingErrorNumber:
            // Decode the reason code from the error message to
            // determine the grounds for throttling.
            var condition = ThrottlingCondition.FromError(err);

            // Attach the decoded values as additional attributes to
            // the original SQL exception.
            sqlException.Data[condition.ThrottlingMode.GetType().Name] =
              condition.ThrottlingMode.ToString();
            sqlException.Data[condition.GetType().Name] = condition;

            return true;

          case 10928:
          case 10929:
          case 10053:
          case 10054:
          case 10060:
          case 40197:
          case 40540:
          case 40613:
          case 40143:
          case 233:
          case 64:
            // DBNETLIB Error Code: 20
            // The instance of SQL Server you attempted to connect to
            // does not support encryption.
          case (int)ProcessNetLibErrorCode.EncryptionNotSupported:
            return true;
        }
      }
    }
    else if (ex is TimeoutException)
    {
      return true;
    }
    else
    {
      EntityException entityException;
      if ((entityException = ex as EntityException) != null)
      {
        return this.IsTransient(entityException.InnerException);
      }
    }
  }

  return false;
}
```


## Next steps
* For more information on troubleshooting other common SQL Database connection issues, see [Troubleshoot connection issues to Azure SQL Database](sql-database-troubleshoot-common-connection-issues.md).
* [Connection libraries for SQL Database and SQL Server](sql-database-libraries.md)
* [SQL Server connection pooling (ADO.NET)](https://docs.microsoft.com/dotnet/framework/data/adonet/sql-server-connection-pooling)
* [*Retrying* is an Apache 2.0 licensed general-purpose retrying library, written in Python,](https://pypi.python.org/pypi/retrying) to simplify the task of adding retry behavior to just about anything.


<!-- Link references. -->

[step-4-connect-resiliently-to-sql-with-ado-net-a78n]: https://docs.microsoft.com/sql/connect/ado-net/step-4-connect-resiliently-to-sql-with-ado-net

[step-4-connect-resiliently-to-sql-with-php-p42h]: https://docs.microsoft.com/sql/connect/php/step-4-connect-resiliently-to-sql-with-php
