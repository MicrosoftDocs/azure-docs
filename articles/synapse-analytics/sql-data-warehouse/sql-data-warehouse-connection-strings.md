---
title: Connection strings
description: Connection strings for Synapse SQL pool
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: joanpo
ms.date: 09/23/2024
ms.service: azure-synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom:
  - azure-synapse
  - devx-track-csharp
---

# Connection strings for SQL pools in Azure Synapse

You can connect to a SQL pool in Azure Synapse with several different application protocols such as, [ADO.NET](/dotnet/framework/data/adonet?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json), [ODBC](/sql/connect/odbc/windows/microsoft-odbc-driver-for-sql-server-on-windows?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true), [PHP](/sql/connect/php/overview-of-the-php-sql-driver?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true), and [JDBC](/sql/connect/jdbc/microsoft-jdbc-driver-for-sql-server?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true). Below are some examples of connections strings for each protocol.  You can also use the Azure portal to build your connection string.  

> [!IMPORTANT]
> Use Microsoft Entra authentication when possible. For more information, see [Use Microsoft Entra authentication for authentication with Synapse SQL](../sql/active-directory-authentication.md). 

To build your connection string using the Azure portal, navigate to your SQL pool blade, under **Essentials** select **Show database connection strings**.

## Sample ADO.NET connection string

This simple example uses SQL authentication, but [Microsoft Entra authentication with ADO.NET is more secure and recommended](/sql/connect/ado-net/sql/azure-active-directory-authentication?view=azure-sqldw-latest&preserve-view=true). 

```csharp
Server=tcp:{your_server}.database.windows.net,1433;Database={your_database};User ID={your_user_name};Password={your_password_here};Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

## Sample ODBC connection string

This simple example uses SQL authentication, but [Microsoft Entra authentication with ODBC is more secure and recommended](/sql/connect/odbc/using-azure-active-directory?view=azure-sqldw-latest&preserve-view=true).

```csharp
Driver={SQL Server Native Client 11.0};Server=tcp:{your_server}.database.windows.net,1433;Database={your_database};Uid={your_user_name};Pwd={your_password_here};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;
```

## Sample PHP connection string

This simple example uses SQL authentication, but [Microsoft Entra authentication with PHP is more secure and recommended](/sql/connect/php/azure-active-directory?view=azure-sqldw-latest&preserve-view=true).

```PHP
Server: {your_server}.database.windows.net,1433 \r\nSQL Database: {your_database}\r\nUser Name: {your_user_name}\r\n\r\nPHP Data Objects(PDO) Sample Code:\r\n\r\ntry {\r\n   $conn = new PDO ( \"sqlsrv:server = tcp:{your_server}.database.windows.net,1433; Database = {your_database}\", \"{your_user_name}\", \"{your_password_here}\");\r\n    $conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );\r\n}\r\ncatch ( PDOException $e ) {\r\n   print( \"Error connecting to SQL Server.\" );\r\n   die(print_r($e));\r\n}\r\n\rSQL Server Extension Sample Code:\r\n\r\n$connectionInfo = array(\"UID\" => \"{your_user_name}\", \"pwd\" => \"{your_password_here}\", \"Database\" => \"{your_database}\", \"LoginTimeout\" => 30, \"Encrypt\" => 1, \"TrustServerCertificate\" => 0);\r\n$serverName = \"tcp:{your_server}.database.windows.net,1433\";\r\n$conn = sqlsrv_connect($serverName, $connectionInfo);
```

## Sample JDBC connection string

This simple example uses SQL authentication, but [Microsoft Entra authentication with JDBC is more secure and recommended](/sql/connect/jdbc/connecting-using-azure-active-directory-authentication?view=azure-sqldw-latest&preserve-view=true).

```Java
jdbc:sqlserver://yourserver.database.windows.net:1433;database=yourdatabase;user={your_user_name};password={your_password_here};encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;
```

> [!NOTE]
> Consider setting the connection timeout to 300 seconds in order to allow the connection to survive short periods of unavailability.

## Related content

To start querying your SQL pool with Visual Studio and other applications, see [Query with Visual Studio](sql-data-warehouse-query-visual-studio.md).
