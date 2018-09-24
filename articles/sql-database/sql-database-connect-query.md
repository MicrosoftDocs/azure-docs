---
title: Azure SQL Database Connect and Query quickstarts | Microsoft Docs
description: Azure SQL Database quickstarts showing you how to connect to and query an Azure SQL database. 
services: sql-database
ms.service: sql-database
ms.subservice: operations
ms.custom: 
ms.devlang: 
ms.topic: quickstart
author: CarlRabeler
ms.author: carlrab
ms.reviewer: 
manager: craigg
ms.date: 04/24/2018
---
# Azure SQL Database Connect and Query Quickstarts

The following document includes links to Azure examples showing how to connect and query an Azure SQL database. It also provides some recommendations for Transport Level Security.

## Quickstarts

| |  |
|---|---|
|[SQL Server Management Studio](sql-database-connect-query-ssms.md)|This quickstart demonstrates how to use SSMS to connect to an Azure SQL database, and then use Transact-SQL statements to query, insert, update, and delete data in the database.|
|[Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio/quickstart-sql-database?toc=/azure/sql-database/toc.json)|This quickstart demonstrates how to use Azure Data Studio to connect to an Azure SQL database, and then use Transact-SQL (T-SQL) statements to create the TutorialDB used in Azure Data Studio tutorials.|
|[Azure portal](sql-database-connect-query-portal.md)|This quickstart demonstrates how to use the Query editor to connect to a SQL database, and then use Transact-SQL statements to query, insert, update, and delete data in the database.|
|[Visual Studio Code](sql-database-connect-query-vscode.md)|This quickstart demonstrates how to use Visual Studio Code to connect to an Azure SQL database, and then use Transact-SQL statements to query, insert, update, and delete data in the database.|
|[.NET with Visual Studio](sql-database-connect-query-dotnet-visual-studio.md)|This quickstart demonstrates how to use the .NET framework to create a C# program with Visual Studio to connect to an Azure SQL database and use Transact-SQL statements to query data.|
|[.NET core](sql-database-connect-query-dotnet-core.md)|This quickstart demonstrates how to use .NET Core on Windows/Linux/macOS to create a C# program to connect to an Azure SQL database and use Transact-SQL statements to query data.|
|[Go](sql-database-connect-query-go.md)|This quickstart demonstrates how to use Go to connect to an Azure SQL database. Transact-SQL statements to query and modify data are also demonstrated.|
|[Java](sql-database-connect-query-java.md)|This quickstart demonstrates how to use Java to connect to an Azure SQL database and then use Transact-SQL statements to query data.|
|[Node.js](sql-database-connect-query-nodejs.md)|This quickstart demonstrates how to use Node.js to create a program to connect to an Azure SQL database and use Transact-SQL statements to query data.|
|[PHP](sql-database-connect-query-php.md)|This quickstart demonstrates how to use PHP to create a program to connect to an Azure SQL database and use Transact-SQL statements to query data.|
|[Python](sql-database-connect-query-python.md)|This quickstart demonstrates how to use Python to connect to an Azure SQL database and use Transact-SQL statements to query data. |
|[Ruby](sql-database-connect-query-ruby.md)|This quickstart demonstrates how to use Ruby to create a program to connect to an Azure SQL database and use Transact-SQL statements to query data.|
|||

## TLS considerations for SQL Database connectivity
Transport Layer Security (TLS) is used by all drivers that Microsoft supplies or supports for connecting to Azure SQL Database. No
special configuration is necessary. For all connections to SQL Server or to Azure SQL Database, we recommend that all applications set
the following configurations, or their equivalents:

 - **Encrypt = On**
 - **TrustServerCertificate = Off**

Some systems use different yet equivalent keywords for those configuration keywords. These configurations ensure that the client driver
verifies the identity of the TLS certificate received from the server.

We also recommend that you disable TLS 1.1 and 1.0 on the client if you need to comply with Payment Card Industry - Data Security
Standard (PCI-DSS).

Non-Microsoft drivers might not use TLS by default. This can be a factor when connecting to Azure SQL Database. Applications with
embedded drivers might not allow you to control these connection settings. We recommend that you examine the security of such drivers
and applications before using them on systems that interact with sensitive data.

## Next steps

For connectivity architecture information, see [Azure SQL Database Connectivity Architecture](sql-database-connectivity-architecture.md).