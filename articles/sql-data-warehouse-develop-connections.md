<properties
   pageTitle="Connect to SQL Data Warehouse | Microsoft Azure"
   description="Tips for connecting to SQL Data Warehouse for developing solutions."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="jrowlandjones"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/26/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

# Connect to SQL Data Warehouse 
To connect to SQL Data Warehouse you will need to pass in security credentials for authentication purposes. Upon establishing a connection you will also find that certain connection settings are configured as part of establishing your query session.

This article details the following aspects of connecting to SQL Data warehouse:

- Authentication
- Connection Settings
- Sessions and Request Identifiers


## Authentication
To connect to SQL Data Warehouse you will need to provide the following information:

- Fully qualified servername 
- Specify SQL authentication
- Username 
- Password
- Default database (optional)

It is important to note that users must authenticate using SQL authentication. Trusted authentication is not supported at this time.

By default your connection will connect to the master database and not your user database. To connect to your user database you can choose to do one of two things:

1. Specify the default database when registering your server with the SQL Server Object Explorer in SSDT or in your application connection string. For example by including the InitialCatalog parameter for an ODBC connection.
2. First highlight the user database prior to creating a session in SSDT.

> [AZURE.NOTE] For guidance connecting to SQL Data Warehouse with SSDT please refer back to the [connect and query][] getting started article. 

It is again important to note that the Transact-SQL statement **USE <your DB>** is not supported for changing the database for a connection 

## Application connection protocols
You can connect to SQL Data Warehouse using any of the following protocols:

- ADO.NET
- ODBC
- PHP
- JDBC

### Sample ADO.NET connection string

```
Server=tcp:{your_server}.database.windows.net,1433;Database={your_database};User ID={your_user_name};Password={your_password_here};Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

### Sample ODBC connection string

```
Driver={SQL Server Native Client 11.0};Server=tcp:{your_server}.database.windows.net,1433;Database={your_database};Uid={your_user_name};Pwd={your_password_here};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;
```

### Sample PHP connection string

```
Server: {your_server}.database.windows.net,1433 \r\nSQL Database: {your_database}\r\nUser Name: {your_user_name}\r\n\r\nPHP Data Objects(PDO) Sample Code:\r\n\r\ntry {\r\n   $conn = new PDO ( \"sqlsrv:server = tcp:{your_server}.database.windows.net,1433; Database = {your_database}\", \"{your_user_name}\", \"{your_password_here}\");\r\n    $conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );\r\n}\r\ncatch ( PDOException $e ) {\r\n   print( \"Error connecting to SQL Server.\" );\r\n   die(print_r($e));\r\n}\r\n\rSQL Server Extension Sample Code:\r\n\r\n$connectionInfo = array(\"UID\" => \"{your_user_name}\", \"pwd\" => \"{your_password_here}\", \"Database\" => \"{your_database}\", \"LoginTimeout\" => 30, \"Encrypt\" => 1, \"TrustServerCertificate\" => 0);\r\n$serverName = \"tcp:{your_server}.database.windows.net,1433\";\r\n$conn = sqlsrv_connect($serverName, $connectionInfo);
```

### Sample JDBC connection string

```
jdbc:sqlserver://yourserver.database.windows.net:1433;database=yourdatabase;user={your_user_name};password={your_password_here};encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;
```

## Connection settings
SQL Data Warehouse standardizes a few settings during connection and object creation. These cannot be overridden.

| Database Setting   | Value                        |
| :----------------- | :--------------------------- |
| ANSI_NULLS         | ON                           |
| QUOTED_IDENTIFIERS | ON                           |
| NO_COUNT           | OFF                          |
| DATEFORMAT         | mdy                          |
| DATEFIRST          | 7                            |
| Database Collation | SQL_Latin1_General_CP1_CI_AS |

## Sessions and requests
Once a connection has been made and a session has been established you are ready to write and submit queries to SQL Data Warehouse.

Each query will be represented by one or more request identifiers. All queries submitted on that connection are part of a single session and will therefore be represented by a single session id.

However, as SQL Data Warehouse is a distributed MPP system both session and request identifiers are exposed a little differently when compared to SQL Server. 

Sessions and requests are logically represented by their respective identifiers.
	
| Identifier | Example value |
| :--------- | :------------ |
| Session ID | SID123456     |
| Request ID | QID123456     |

Notice that the Session ID is prefixed by SID - shorthand for Session ID - and the requests are prefixed by QID which is shorthand for Query ID.

You will need this information to help you identify your query when monitoring your query performance. You can monitor your query performance by using either the [Azure Portal] and the dynamic management views.

To identify which session you are currently using the following function:

```
SELECT SESSION_ID()
;
```

To view all the queries that are either running or have recently run against your data warehouse you can use a query like the one below:

```
CREATE VIEW dbo.vSessionRequests
AS
SELECT 	 s.[session_id]									AS Session_ID
		,s.[status]										AS Session_Status
		,s.[login_name]									AS Session_LoginName
		,s.[login_time]									AS Session_LoginTime
        ,r.[request_id]									AS Request_ID
		,r.[status]										AS Request_Status
		,r.[submit_time]								AS Request_SubmitTime
		,r.[start_time]									AS Request_StartTime
		,r.[end_compile_time]							AS Request_EndCompileTime
		,r.[end_time]									AS Request_EndTime
		,r.[total_elapsed_time]							AS Request_TotalElapsedDuration_ms
        ,DATEDIFF(ms,[submit_time],[start_time])		AS Request_InitiateDuration_ms
        ,DATEDIFF(ms,[start_time],[end_compile_time])	AS Request_CompileDuration_ms
        ,DATEDIFF(ms,[end_compile_time],[end_time])		AS Request_ExecDuration_ms
		,[label]										AS Request_QueryLabel
		,[command]										AS Request_Command
		,[database_id]									AS Request_Database_ID
FROM    sys.dm_pdw_exec_requests r
JOIN    sys.dm_pdw_exec_sessions s	ON	r.[session_id] = s.[session_id]
WHERE   s.[session_id] <> SESSION_ID()
;
```

Note this query has been encapsulated in a view so that you can incorporate it into your solution. However to see the results you will need to create the view and execute it.

## Next steps
Once connected you can begin designing your tables. Please refer to the [table design] article for further details.

<!--Image references-->

<!--Azure.com references-->
[connect and query]: sql-data-warehouse-connect-query.md
[table design]: sql-data-warehouse-develop-table-design.md

<!--MSDN references-->

<!--Other references-->
