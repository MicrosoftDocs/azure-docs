<properties
	pageTitle="Actions to fix transient connection loss | Microsoft Azure"
	description="Actions to prevent, diagnose, and fix connection errors and other transient faults when interacting with Azure SQL Database."
	services="sql-database"
	documentationCenter=""
	authors="MightyPen"
	manager="jeffreyg"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.workload="sql-database"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="10/19/2015"
	ms.author="genemi"/>


# Actions to fix connection errors and transient faults in SQL Database


This topic describes how to prevent, diagnose, and mitigate connection errors and transient faults that your client program encounters when it interacts with Azure SQL Database.


## Connection: Connection string


The connection string necessary for connecting to Azure SQL Database is slightly different from the string for connecting to Microsoft SQL Server. You can copy the connection string for your database from the [Azure preview portal](http://portal.azure.com/).


[AZURE.INCLUDE [sql-database-include-connection-string-20-portalshots](../../includes/sql-database-include-connection-string-20-portalshots.md)]



#### 30 seconds for connection timeout


Connecting over the Internet is less robust than over a private network. Therefore in we recommend that in your connection string you:
- Set the **Connection Timeout** parameter to **30** seconds (instead of 15 seconds).


## Connection: IP address


You must configure the SQL Database server to accept communication from the IP address of the computer that hosts your client program. You do this by editing the firewall settings through the [Azure preview portal](http://portal.azure.com/).


If you forget to configure the IP address, your program will fail with a handy error message that states the necessary IP address.


[AZURE.INCLUDE [sql-database-include-ip-address-22-v12portal](../../includes/sql-database-include-ip-address-22-v12portal.md)]


For more information, see: 
[How to: Configure firewall settings on SQL Database](sql-database-configure-firewall-settings.md)


## Connection: Ports


Typically you only need to ensure that port 1433 is open for outbound communication, on the computer that hosts you client program.


For example, when your client program is hosted on a Windows computer, the Windows Firewall on the host enables you to open port 1433:


1. Open the Control Panel
2. &gt; All Control Panel Items
3. &gt; Windows Firewall
4. &gt; Advanced Settings
5. &gt; Outbound Rules
6. &gt; Actions
7. &gt; New Rule


If your client program is hosted on an Azure virtual machine (VM), you should read:<br/>[Ports beyond 1433 for ADO.NET 4.5 and SQL Database V12](sql-database-develop-direct-route-ports-adonet-v12.md).


For background information about cofiguration of ports and IP address, see: 
[Azure SQL Database firewall](sql-database-firewall-configure.md)


## Connection: ADO.NET 4.5


If your program uses ADO.NET classes like **System.Data.SqlClient.SqlConnection** to connect to Azure SQL Database, we recommend that you use .NET Framework version 4.5 or higher.


ADO.NET 4.5:
- Adds support the TDS 7.4 protocol. This includes connection enhancements beyond those in 4.0.
- Supports connection pooling. This includes an efficient verification that the connection object it gives your program is functioning.


When you use a connection object from a connection pool, we recommend that your program temporarily close the connection when not immediately using it. Re-opening a connection is not expensive the way creating a new connection is.


If you are using ADO.NET 4.0 or earlier, we recommend that you upgrade to the latest ADO.NET.
- As of July 2015, you can [download ADO.NET 4.6](http://blogs.msdn.com/b/dotnet/archive/2015/07/20/announcing-net-framework-4-6.aspx).


## Diagnostics: Test whether utilities can connect


If your program is failing to connect to Azure SQL Database, one diagnostic option is to try to connect with a utility program. Ideally the utility would connect by using the same library that your program uses.


On any Windows computer, you can try these utilities:
- SQL Server Management Studio (ssms.exe), which connects by using ADO.NET.
- sqlcmd.exe, which connects by using [ODBC](http://msdn.microsoft.com/library/jj730308.aspx).


Once connected, test whether a short SQL SELECT query works.


## Diagnostics: Check the open ports


Suppose you suspect that connection attempts are failing due to port issues. On your computer you can run a utility that reports on the port configurations.


On Linux the following utilities might be helpful:
- `netstat -nap`
- `nmap -sS -O 127.0.0.1`
 - (Change the example value to be your IP address.)


On Windows the [PortQry.exe](http://www.microsoft.com/download/details.aspx?id=17148) utility might be helpful. Here is an example execution that queried the port situation on an Azure SQL Database server, and which was run on a laptop computer:


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


## Diagnostics: Log your errors


An intermittant problem is sometimes best diagnosed by detection of a general pattern over days or weeks.


Your client can assist in a diagnosis by logging all errors it encounters. You might be able to correlate the log entries with error data that Azure SQL Database logs itself internally.


Enterprise Library 6 (EntLib60) offers .NET managed classes to assist with logging:
- [5 - As Easy As Falling Off a Log: Using the Logging Application Block](http://msdn.microsoft.com/library/dn440731.aspx)


## Diagnostics: Examine system logs for errors


Here are some Transact-SQL SELECT statements that query logs of error and other information.


| Query of log | Description |
| :-- | :-- |
| `SELECT e.*`<br/>`FROM sys.event_log AS e`<br/>`WHERE e.database_name = 'myDbName'`<br/>`AND e.event_category = 'connectivity'`<br/>`AND 2 >= DateDiff`<br/>&nbsp;&nbsp;`(hour, e.end_time, GetUtcDate())`<br/>`ORDER BY e.event_category,`<br/>&nbsp;&nbsp;`e.event_type, e.end_time;` | The [sys.event_log](http://msdn.microsoft.com/library/dn270018.aspx) view offers information about individual events, including connectivity failures related to reconfiguration, throttling, and excessive resource accumulation.<br/><br/>Ideally you can correlate the **start_time** or **end_time** values with information about when your client program experienced problems.<br/><br/>**TIP:** You must connect to the **master** database to run this. |
| `SELECT c.*`<br/>`FROM sys.database_connection_stats AS c`<br/>`WHERE c.database_name = 'myDbName'`<br/>`AND 24 >= DateDiff`<br/>&nbsp;&nbsp;`(hour, c.end_time, GetUtcDate())`<br/>`ORDER BY c.end_time;` | The [sys.database_connection_stats](http://msdn.microsoft.com/library/dn269986.aspx) view offers aggregated counts of event types, for additional diagnostics.<br/><br/>**TIP:** You must connect to the **master** database to run this. |


### Diagnostics: Search for problem events in the SQL Database log


You can search for entries about problem events in the log of Azure SQL Database. Try the following Transact-SQL SELECT statement in the **master** database:


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


Next is what a returned row might look like. The null values shown are often not null in other rows.


```
object_name                   timestamp                    error  state  is_success  database_name

database_xml_deadlock_report  2015-10-16 20:28:01.0090000  NULL   NULL   NULL        AdventureWorks
```


## Transient faults


A transient fault is an error for which the underlying cause will soon resolve itself. An occasional cause of transient faults is when the Azure system quickly shifts hardware resources to better load-balance various workloads. During this reconfiguration timespan, connections to Azure SQL database might be lost.


If your client program is using ADO.NET, your program is told about the transient fault by the throw of an **SqlException**. The **Number** property can be compared against the list of transient faults near the top of the topic: 
[Error messages for SQL Database client programs](sql-database-develop-error-messages).


### Connection versus command


When a transient error occurs during a connection try, the connection should be retried after delay for several seconds.


When a transient error occurs during an SQL query command, the command should not be immediately retried. Instead, after a delay, the connection should be freshly established. Then the command can be retried.


## Retry logic for transient faults


Client programs that occasionally encounter a transient fault are more robust when they contain retry logic.


When your program communicates with Azure SQL Database through a 3rd party middleware, inquire with the vendor whether the middleware contains retry logic for transient faults.


### Principles for retry


- An attempt to open a connection should be retried if the error is a transient fault.


- An SQL SELECT statement that fails with a transient fault should not be retried directly.
 - Instead, establish a fresh connection, and then retry the SELECT.


- When an SQL UPDATE statement fails with a transient fault, a fresh connection should be established before the UPDATE is retried.
 - The retry logic must ensure that either the entire database transaction completed, or that the entire transaction is rolled back.


#### Other considerations for retry


- A batch program that is automatically started after work hours, and which will complete before morning, can afford to very patient with long time intervals between its retry attempts.


- A user interface program should account for the human tendency to give up after too long a wait.
 - However, the solution must not be to retry every few seconds, because that policy can flood the system with requests.


### Interval increase between retries


Your program should always wait at least 6-10 seconds before its first retry. Otherwise the cloud service can suddenly become flooded with requests it is not yet ready to process.


If more than one retry is necessary, the interval must increase before each successive retry, up to a maximum. Two of the alternative strategies are:


- Monotonic increase of the interval. For example, you could add another 5 seconds to each successive interval.


- Exponential increase of the interval. For example, you could multiply each successive interval by 1.5.


You might also want to set a maximum number of retries before the program self-terminates.


### Code samples with retry logic


Code samples with retry logic, in a variety of programming languages, are available at:

- [Quick start code samples](sql-database-develop-quick-start-client-code-samples.md) 


## Test your retry logic


To test your retry logic, you must simulate or cause an error than can be corrected while your program is still running.


### Test by disconnecting from the network


One way you can test your retry logic is to disconnect your client computer from the network while the program is running. The error will be:
- **SqlException.Number** = 11001
- Message: "No such host is known"


As part of the first retry attempt, your program can correct the misspelling, and then attempt to connect.


To make this practical, you unplug your computer from the network before you start your program. Then your program recognizes a run time parameter that causes the program to:
1. Temporarily add 11001 to its list of errors to consider as transient.
2. Attempt its first connection as usual.
3. After the error is caught, remove 11001 from the list.
4. Display a message telling the user to plug the computer into the network.
 - Pause further execution by using either the **Console.ReadLine** method or a dialog with an OK button. The user presses the Enter key after the computer plugged into the network.
5. Attempt again to connect, expecting success.


### Test by misspelling the database name when connecting


Your program can purposely misspell the user name before the first connection attempt. The error will be:
- **SqlException.Number** = 18456
- Message: "Login failed for user 'WRONG_MyUserName'."


As part of the first retry attempt, your program can correct the misspelling, and then attempt to connect.


To make this practical, your program could recognize a run time parameter that causes the program to:
1. Temporarily add 18456 to its list of errors to consider as transient.
2. Purposely add 'WRONG_' to the user name.
3. After the error is caught, remove 18456 from the list.
4. Remove 'WRONG_' from the user name.
5. Attempt again to connect, expecting success.


## Enterprise Library 6


Enterprise Library 6 (EntLib60) is a framework of .NET classes that helps you implement robust clients of cloud services, one of which is the Azure SQL Database service. You can locate topics dedicated to each area in which EntLib60 can assist by first visiting:
- [Enterprise Library 6 – April 2013](http://msdn.microsoft.com/library/dn169621%28v=pandp.60%29.aspx)


Retry logic for handling transient faults is one area in which EntLib60 can assist:
- [4 - Perseverance, Secret of All Triumphs: Using the Transient Fault Handling Application Block](http://msdn.microsoft.com/library/dn440719%28v=pandp.60%29.aspx)


A short C# code sample that uses EntLib60 in its retry logic is available at:
- [Code sample: Retry logic from Enterprise Library 6, in C# for connecting to SQL Database](sql-database-develop-entlib-csharp-retry-windows.md)


### EntLib60 classes for transient faults and retry


The following EntLib60 classes are particularly useful for retry logic. All these  are in, or are further under, the namespace **Microsoft.Practices.EnterpriseLibrary.TransientFaultHandling**:

*In the namespace **Microsoft.Practices.EnterpriseLibrary.TransientFaultHandling**:*

- **RetryPolicy** class
 - **ExecuteAction** method


- **ExponentialBackoff** class


- **SqlDatabaseTransientErrorDetectionStrategy** class


- **ReliableSqlConnection** class
 - **ExecuteCommand** method


In the namespace **Microsoft.Practices.EnterpriseLibrary.TransientFaultHandling.TestSupport**:

- **AlwaysTransientErrorDetectionStrategy** class

- **NeverTransientErrorDetectionStrategy** class


Here are links to information about EntLib60:

- Free [Book Download: Developer's Guide to Microsoft Enterprise Library, 2nd Edition](http://www.microsoft.com/download/details.aspx?id=41145)

- Best practices: [Retry general guidance](best-practices-retry-general.md) has an excellent in-depth discussion of retry logic.

- NuGet download of [Enterprise Library - Transient Fault Handling application block 6.0](http://www.nuget.org/packages/EnterpriseLibrary.TransientFaultHandling/)


### EntLib60: The logging block


- The Logging block is a highly flexible and configurable solution that allows you to:
 - Create and store log messages in a wide variety of locations.
 - Categorize and filter messages.
 - Collect contextual information that is useful for debugging and tracing, as well as for auditing and general logging requirements.


- The Logging block abstracts the logging functionality from the log destination so that the application code is consistent, irrespective of the location and type of the target logging store.


For details see: 
[5 - As Easy As Falling Off a Log: Using the Logging Application Block](https://msdn.microsoft.com/library/dn440731%28v=pandp.60%29.aspx)


### EntLib60 IsTransient method source code


Next, from the **SqlDatabaseTransientErrorDetectionStrategy** class, is the C# source code for the **IsTransient** method. The source code clarifies which errors are considered to be transient and worthy of retry.

Numerous **//comment** lines have been removed from this copy to emphasize readability.


```
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


There is no need to download the source code for EntLib60. But if you want to download the source code, you can visit the following topic, and then click the [Download code](http://go.microsoft.com/fwlink/p/?LinkID=290898) button: 
- [Enterprise Library 6 – April 2013](http://msdn.microsoft.com/library/dn169621%28v=pandp.60%29.aspx)


## More information


- [SQL Server Connection Pooling (ADO.NET)](http://msdn.microsoft.com/library/8xx3tyca.aspx)


- [*Retrying* is an Apache 2.0 licensed general-purpose retrying library, written in **Python**, to simplify the task of adding retry behavior to just about anything.](https://pypi.python.org/pypi/retrying)
