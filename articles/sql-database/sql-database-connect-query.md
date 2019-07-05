---
title: Azure SQL Database Connect and Query quickstarts | Microsoft Docs
description: Azure SQL Database quickstarts showing you how to connect to and query an Azure SQL database. 
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.custom: 
ms.devlang: 
ms.topic: quickstart
author: stevestein
ms.author: sstein
ms.reviewer: 
manager: craigg
ms.date: 12/18/2018
---
# Quickstarts: Azure SQL Database connect and query

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
|[R](sql-database-connect-query-r.md)|This quickstart demonstrates how to use R with Azure SQL Database Machine Learning Services to create a program to connect to an Azure SQL database and use Transact-SQL statements to query data.|
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

## Libraries

You can use various libraries and frameworks to connect to Azure SQL Database. Check out our [Get started tutorials](https://aka.ms/sqldev) to quickly get started with programming languages such as C#, Java, Node.js, PHP, and Python. Then build an app by using SQL Server on Linux or Windows or Docker on macOS.

The following table lists connectivity libraries or *drivers* that client applications can use from a variety of languages to connect to and use SQL Server running on-premises or in the cloud. You can use them on Linux, Windows, or Docker and use them to connect to Azure SQL Database and Azure SQL Data Warehouse. 

| Language | Platform | Additional resources | Download | Get started |
| :-- | :-- | :-- | :-- | :-- |
| C# | Windows, Linux, macOS | [Microsoft ADO.NET for SQL Server](https://docs.microsoft.com/sql/connect/ado-net/microsoft-ado-net-for-sql-server) | [Download](https://www.microsoft.com/net/download/) | [Get started](https://www.microsoft.com/sql-server/developer-get-started/csharp/ubuntu)
| Java | Windows, Linux, macOS | [Microsoft JDBC driver for SQL Server](https://msdn.microsoft.com/library/mt484311.aspx) | [Download](https://go.microsoft.com/fwlink/?linkid=852460) |  [Get started](https://www.microsoft.com/sql-server/developer-get-started/java/ubuntu)
| PHP | Windows, Linux, macOS| [PHP SQL driver for SQL Server](https://docs.microsoft.com/sql/connect/php/microsoft-php-driver-for-sql-server) | [Download](https://docs.microsoft.com/sql/connect/php/download-drivers-php-sql-server) | [Get started](https://www.microsoft.com/sql-server/developer-get-started/php/ubuntu/)
| Node.js | Windows, Linux, macOS | [Node.js driver for SQL Server](https://msdn.microsoft.com/library/mt652093.aspx) | [Install](https://msdn.microsoft.com/library/mt652094.aspx) |  [Get started](https://www.microsoft.com/sql-server/developer-get-started/node/ubuntu)
| Python | Windows, Linux, macOS | [Python SQL driver](https://msdn.microsoft.com/library/mt652092.aspx) | Install choices: <br/> \* [pymssql](https://msdn.microsoft.com/library/mt694094.aspx) <br/> \* [pyodbc](https://msdn.microsoft.com/library/mt763257.aspx) |  [Get started](https://www.microsoft.com/sql-server/developer-get-started/python/ubuntu)
| Ruby | Windows, Linux, macOS | [Ruby driver for SQL Server](https://msdn.microsoft.com/library/mt691981.aspx) | [Install](https://msdn.microsoft.com/library/mt711041.aspx) | [Get started](https://www.microsoft.com/sql-server/developer-get-started/ruby/ubuntu)
| C++ | Windows, Linux, macOS | [Microsoft ODBC driver for SQL Server](https://msdn.microsoft.com/library/mt654048(v=sql.1).aspx) | [Download](https://msdn.microsoft.com/library/mt654048(v=sql.1).aspx) |  

The following table lists examples of object-relational mapping (ORM) frameworks and web frameworks that client applications can use with SQL Server running on-premises or in the cloud. You can use the frameworks on Linux, Windows, or Docker and use them to connect to SQL Database and SQL Data Warehouse. 

| Language | Platform | ORM(s) |
| :-- | :-- | :-- |
| C# | Windows, Linux, macOS | [Entity Framework](https://docs.microsoft.com/ef)<br>[Entity Framework Core](https://docs.microsoft.com/ef/core/index) |
| Java | Windows, Linux, macOS |[Hibernate ORM](https://hibernate.org/orm)|
| PHP | Windows, Linux, macOS | [Laravel (Eloquent)](https://laravel.com/docs/eloquent)<br>[Doctrine](https://www.doctrine-project.org/projects/orm.html) |
| Node.js | Windows, Linux, macOS | [Sequelize ORM](https://docs.sequelizejs.com) |
| Python | Windows, Linux, macOS |[Django](https://www.djangoproject.com/) |
| Ruby | Windows, Linux, macOS | [Ruby on Rails](https://rubyonrails.org/) |
||||

## Next steps

- For connectivity architecture information, see [Azure SQL Database Connectivity Architecture](sql-database-connectivity-architecture.md).
- Find [SQL Server drivers](https://msdn.microsoft.com/library/mt654049.aspx) that are used to connect from client applications
- Connect to SQL Database:
  - [Connect to SQL Database by using .NET (C#)](sql-database-connect-query-dotnet.md) 
  - [Connect to SQL Database by using PHP](sql-database-connect-query-php.md) 
  - [Connect to SQL Database by using Node.js](sql-database-connect-query-nodejs.md) 
  - [Connect to SQL Database by using Java](sql-database-connect-query-java.md) 
  - [Connect to SQL Database by using Python](sql-database-connect-query-python.md)
  - [Connect to SQL Database by using Ruby](sql-database-connect-query-ruby.md)
- Retry logic code examples:
  - [Connect resiliently to SQL with ADO.NET][step-4-connect-resiliently-to-sql-with-ado-net-a78n]
  - [Connect resiliently to SQL with PHP][step-4-connect-resiliently-to-sql-with-php-p42h]

<!-- Link references. -->

[step-4-connect-resiliently-to-sql-with-ado-net-a78n]: https://docs.microsoft.com/sql/connect/ado-net/step-4-connect-resiliently-to-sql-with-ado-net

[step-4-connect-resiliently-to-sql-with-php-p42h]: https://docs.microsoft.com/sql/connect/php/step-4-connect-resiliently-to-sql-with-php
