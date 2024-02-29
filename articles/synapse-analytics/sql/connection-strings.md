---
title: Connection strings for Synapse SQL
description: Connection strings for Synapse SQL
author: azaricstefan 
ms.service: synapse-analytics 
ms.topic: overview 
ms.subservice: sql
ms.date: 04/15/2020 
ms.author: stefanazaric 
ms.reviewer: sngun
ms.custom: devx-track-csharp
---

# Connection strings for Synapse SQL

You can connect to Synapse SQL with several different application libraries such as, [ADO.NET](/dotnet/framework/data/adonet/), [ODBC](/sql/connect/odbc/windows/microsoft-odbc-driver-for-sql-server-on-windows), [PHP](/sql/connect/php/overview-of-the-php-sql-driver?f=255&MSPPError=-2147217396), and [JDBC](/sql/connect/jdbc/microsoft-jdbc-driver-for-sql-server). Below are some examples of connections strings for each library. 

You can also use the Azure portal to build your connection string.  To build your connection string using the Azure portal, navigate to your database blade, under *Essentials* select *Show database connection strings*.

## Sample ADO.NET connection string

```csharp
Server=tcp:{your_server}.sql.azuresynapse.net,1433;Database={your_database};User ID={your_user_name};Password={your_password_here};Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

## Sample ODBC connection string

```csharp
Driver={ODBC Driver 18 for SQL Server};Server=tcp:{your_server}.sql.azuresynapse.net,1433;Database={your_database};Uid={your_user_name};Pwd={your_password_here};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;
```

## Sample PHP connection string

```PHP
Server: {your_server}.sql.azuresynapse.net,1433 \r\nSQL Database: {your_database}\r\nUser Name: {your_user_name}\r\n\r\nPHP Data Objects(PDO) Sample Code:\r\n\r\ntry {\r\n   $conn = new PDO ( \"sqlsrv:server = tcp:{your_server}.sql.azuresynapse.net,1433; Database = {your_database}\", \"{your_user_name}\", \"{your_password_here}\");\r\n    $conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );\r\n}\r\ncatch ( PDOException $e ) {\r\n   print( \"Error connecting to SQL Server.\" );\r\n   die(print_r($e));\r\n}\r\n\rSQL Server Extension Sample Code:\r\n\r\n$connectionInfo = array(\"UID\" => \"{your_user_name}\", \"pwd\" => \"{your_password_here}\", \"Database\" => \"{your_database}\", \"LoginTimeout\" => 30, \"Encrypt\" => 1, \"TrustServerCertificate\" => 0);\r\n$serverName = \"tcp:{your_server}.sql.azuresynapse.net,1433\";\r\n$conn = sqlsrv_connect($serverName, $connectionInfo);
```

## Sample JDBC connection string

```Java
jdbc:sqlserver://yourserver.sql.azuresynapse.net:1433;database=yourdatabase;user={your_user_name};password={your_password_here};encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.sql.azuresynapse.net;loginTimeout=30;
```

> [!NOTE]
> Consider setting the connection timeout to 300 seconds to allow the connection to survive short periods of unavailability and provide enough time for paused instances to resume.

## Recommendations

For executing **serverless SQL pool** queries, recommended tools are [Azure Data Studio](get-started-azure-data-studio.md) and Azure Synapse Studio.

## Next steps

To start querying your analytics with Visual Studio and other applications, see [Query with Visual Studio](../sql-data-warehouse/sql-data-warehouse-query-visual-studio.md?context=/azure/synapse-analytics/context/context).
