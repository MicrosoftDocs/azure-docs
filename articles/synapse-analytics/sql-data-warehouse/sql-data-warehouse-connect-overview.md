---
title: Connect to Synapse SQL pool 
description: Get connected to SQL pool.
services: synapse-analytics
author: XiaoyuMSFT 
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: 
ms.date: 04/17/2018
ms.author: xiaoyul
ms.reviewer: igorstan
ms.custom: seo-lt-2019
---

# Connect to Synapse SQL pool
Get connected to SQL pool.

## Find your server name
The server name in the following example is sqlpoolservername.database.windows.net. To find the fully qualified server name:

1. Go to the [Azure portal](https://portal.azure.com).
2. Click on **Azure Synapse Analytics**.
3. Click on the SQL pool you want to connect to.
4. Locate the full server name.
   
    ![Full server name](media/sql-data-warehouse-connect-overview/server-connect.PNG)

## Supported drivers and connection strings
SQL pool supports [ADO.NET](https://msdn.microsoft.com/library/e80y5yhx(v=vs.110).aspx), [ODBC](https://msdn.microsoft.com/library/jj730314.aspx), [PHP](https://msdn.microsoft.com/library/cc296172.aspx?f=255&MSPPError=-2147217396), and [JDBC](https://msdn.microsoft.com/library/mt484311(v=sql.110).aspx). To find the latest version and documentation, click on one of the preceding drivers. 

To automatically generate the connection string for the driver that you are using from the Azure portal, click on the **Show database connection strings** from the preceding example. Following are also some examples of what a connection string looks like for each driver.

> [!NOTE]
> Consider setting the connection timeout to 300 seconds to allow your connection to survive short periods of unavailability.
> 
> 

### ADO.NET connection string example
```csharp
Server=tcp:{your_server}.database.windows.net,1433;Database={your_database};User ID={your_user_name};Password={your_password_here};Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

### ODBC connection string example
```csharp
Driver={SQL Server Native Client 11.0};Server=tcp:{your_server}.database.windows.net,1433;Database={your_database};Uid={your_user_name};Pwd={your_password_here};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;
```

### PHP connection string example
```PHP
Server: {your_server}.database.windows.net,1433 \r\nSQL Database: {your_database}\r\nUser Name: {your_user_name}\r\n\r\nPHP Data Objects(PDO) Sample Code:\r\n\r\ntry {\r\n   $conn = new PDO ( \"sqlsrv:server = tcp:{your_server}.database.windows.net,1433; Database = {your_database}\", \"{your_user_name}\", \"{your_password_here}\");\r\n    $conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );\r\n}\r\ncatch ( PDOException $e ) {\r\n   print( \"Error connecting to SQL Server.\" );\r\n   die(print_r($e));\r\n}\r\n\rSQL Server Extension Sample Code:\r\n\r\n$connectionInfo = array(\"UID\" => \"{your_user_name}\", \"pwd\" => \"{your_password_here}\", \"Database\" => \"{your_database}\", \"LoginTimeout\" => 30, \"Encrypt\" => 1, \"TrustServerCertificate\" => 0);\r\n$serverName = \"tcp:{your_server}.database.windows.net,1433\";\r\n$conn = sqlsrv_connect($serverName, $connectionInfo);
```

### JDBC connection string example
```Java
jdbc:sqlserver://yourserver.database.windows.net:1433;database=yourdatabase;user={your_user_name};password={your_password_here};encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;
```

## Connection settings
SQL pool standardizes some settings during connection and object creation. These settings cannot be overridden and include:

| Database Setting | Value |
|:--- |:--- |
| [ANSI_NULLS](https://msdn.microsoft.com/library/ms188048.aspx) |ON |
| [QUOTED_IDENTIFIERS](https://msdn.microsoft.com/library/ms174393.aspx) |ON |
| [DATEFORMAT](https://msdn.microsoft.com/library/ms189491.aspx) |mdy |
| [DATEFIRST](https://msdn.microsoft.com/library/ms181598.aspx) |7 |

## Next steps
To connect and query with Visual Studio, see [Query with Visual Studio](sql-data-warehouse-query-visual-studio.md). To learn more about authentication options, see [Authentication to Azure Synapse Analytics](sql-data-warehouse-authentication.md).

