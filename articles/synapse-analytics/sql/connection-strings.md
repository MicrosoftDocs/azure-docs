---
title: Connection strings for Synapse SQL (preview)
description: Connection strings for Synapse SQL (preview)
services: synapse-analytics 
author: azaricstefan 
ms.service: synapse-analytics 
ms.topic: overview 
ms.subservice: 
ms.date: 04/15/2020 
ms.author: v-stazar 
ms.reviewer: jrasnick
---

# Connection strings for Synapse SQL (preview)

You can connect to Synapse SQL (preview) with several different application protocols such as, [ADO.NET](https://msdn.microsoft.com/library/e80y5yhx(v=vs.110).aspx), [ODBC](https://msdn.microsoft.com/library/jj730314.aspx), [PHP](https://msdn.microsoft.com/library/cc296172.aspx?f=255&MSPPError=-2147217396), and [JDBC](https://msdn.microsoft.com/library/mt484311(v=sql.110).aspx). Below are some examples of connections strings for each protocol. 

You can also use the Azure portal to build your connection string.  To build your connection string using the Azure portal, navigate to your database blade, under *Essentials* click on *Show database connection strings*.

## Sample ADO.NET connection string

```csharp
Server=tcp:{your_server}.sql.azuresynapse.net,1433;Database={your_database};User ID={your_user_name};Password={your_password_here};Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

## Sample ODBC connection string

```csharp
Driver={SQL Server Native Client 11.0};Server=tcp:{your_server}.sql.azuresynapse.net,1433;Database={your_database};Uid={your_user_name};Pwd={your_password_here};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;
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
> Consider setting the connection timeout to 300 seconds to allow the connection to survive short periods of unavailability.

## Recommendations

For executing **SQL on-demand** queries, recommended tools are [Azure Data Studio](get-started-azure-data-studio.md) and Azure Synapse Studio.

## Next steps

To start querying your analytics with Visual Studio and other applications, see [Query with Visual Studio](../sql-data-warehouse/sql-data-warehouse-query-visual-studio.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).
