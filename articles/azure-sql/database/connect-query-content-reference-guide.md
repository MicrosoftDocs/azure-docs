---
title: Connect and query 
description: Links to Azure SQL Database quickstarts showing how to connect to and query Azure SQL Database, and Azure SQL Managed Instance. 
titleSuffix: Azure SQL Database & SQL Managed Instance
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: quickstart
author: stevestein
ms.author: sstein
ms.reviewer: 
ms.date: 05/29/2020
---
# Azure SQL Database and Azure SQL Managed Instance connect and query articles
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

The following document includes links to Azure examples showing how to connect and query Azure SQL Database and Azure SQL Managed Instance. For some related recommendations for Transport Level Security, see [TLS considerations for database connectivity](#tls-considerations-for-database-connectivity).

## Quickstarts

| |  |
|---|---|
|[SQL Server Management Studio](connect-query-ssms.md)|This quickstart demonstrates how to use SSMS to connect to a database, and then use Transact-SQL statements to query, insert, update, and delete data in the database.|
|[Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio/quickstart-sql-database?toc=/azure/sql-database/toc.json)|This quickstart demonstrates how to use Azure Data Studio to connect to a database, and then use Transact-SQL (T-SQL) statements to create the TutorialDB used in Azure Data Studio tutorials.|
|[Azure portal](connect-query-portal.md)|This quickstart demonstrates how to use the Query editor to connect to a database (Azure SQL Database only), and then use Transact-SQL statements to query, insert, update, and delete data in the database.|
|[Visual Studio Code](connect-query-vscode.md)|This quickstart demonstrates how to use Visual Studio Code to connect to a database, and then use Transact-SQL statements to query, insert, update, and delete data in the database.|
|[.NET with Visual Studio](connect-query-dotnet-visual-studio.md)|This quickstart demonstrates how to use the .NET framework to create a C# program with Visual Studio to connect to a database and use Transact-SQL statements to query data.|
|[.NET core](connect-query-dotnet-core.md)|This quickstart demonstrates how to use .NET Core on Windows/Linux/macOS to create a C# program to connect to a database and use Transact-SQL statements to query data.|
|[Go](connect-query-go.md)|This quickstart demonstrates how to use Go to connect to a database. Transact-SQL statements to query and modify data are also demonstrated.|
|[Java](connect-query-java.md)|This quickstart demonstrates how to use Java to connect to a database and then use Transact-SQL statements to query data.|
|[Node.js](connect-query-nodejs.md)|This quickstart demonstrates how to use Node.js to create a program to connect to a database and use Transact-SQL statements to query data.|
|[PHP](connect-query-php.md)|This quickstart demonstrates how to use PHP to create a program to connect to a database and use Transact-SQL statements to query data.|
|[Python](connect-query-python.md)|This quickstart demonstrates how to use Python to connect to a database and use Transact-SQL statements to query data. |
|[Ruby](connect-query-ruby.md)|This quickstart demonstrates how to use Ruby to create a program to connect to a database and use Transact-SQL statements to query data.|
|[R](connect-query-r.md)|This quickstart demonstrates how to use R with Azure SQL Database Machine Learning Services to create a program to connect to a database in Azure SQL Database and use Transact-SQL statements to query data.|
|||

## TLS considerations for database connectivity

Transport Layer Security (TLS) is used by all drivers that Microsoft supplies or supports for connecting to databases in Azure SQL Database or Azure SQL Managed Instance. No special configuration is necessary. For all connections to a SQL Server instance, a database in Azure SQL Database, or an instance of Azure SQL Managed Instance, we recommend that all applications set
the following configurations, or their equivalents:

- **Encrypt = On**
- **TrustServerCertificate = Off**

Some systems use different yet equivalent keywords for those configuration keywords. These configurations ensure that the client driver
verifies the identity of the TLS certificate received from the server.

We also recommend that you disable TLS 1.1 and 1.0 on the client if you need to comply with Payment Card Industry - Data Security
Standard (PCI-DSS).

Non-Microsoft drivers might not use TLS by default. This can be a factor when connecting to Azure SQL Database or Azure SQL Managed Instance. Applications with embedded drivers might not allow you to control these connection settings. We recommend that you examine the security of such drivers and applications before using them on systems that interact with sensitive data.

## Libraries

You can use various libraries and frameworks to connect to Azure SQL Database or Azure SQL Managed Instance. Check out our [Get started tutorials](https://aka.ms/sqldev) to quickly get started with programming languages such as C#, Java, Node.js, PHP, and Python. Then build an app by using SQL Server on Linux or Windows or Docker on macOS.

The following table lists connectivity libraries or *drivers* that client applications can use from a variety of languages to connect to and use SQL Server running on-premises or in the cloud. You can use them on Linux, Windows, or Docker and use them to connect to Azure SQL Database, Azure SQL Managed Instance, and Azure SQL Data Warehouse.

| Language | Platform | Additional resources | Download | Get started |
| :-- | :-- | :-- | :-- | :-- |
| C# | Windows, Linux, macOS | [Microsoft ADO.NET for SQL Server](https://docs.microsoft.com/sql/connect/ado-net/microsoft-ado-net-sql-server) | [Download](https://www.microsoft.com/net/download/) | [Get started](https://www.microsoft.com/sql-server/developer-get-started/csharp/ubuntu)
| Java | Windows, Linux, macOS | [Microsoft JDBC driver for SQL Server](/sql/connect/jdbc/microsoft-jdbc-driver-for-sql-server/) | [Download](https://go.microsoft.com/fwlink/?linkid=852460) |  [Get started](https://www.microsoft.com/sql-server/developer-get-started/java/ubuntu)
| PHP | Windows, Linux, macOS| [PHP SQL driver for SQL Server](https://docs.microsoft.com/sql/connect/php/microsoft-php-driver-for-sql-server) | [Download](https://docs.microsoft.com/sql/connect/php/download-drivers-php-sql-server) | [Get started](https://www.microsoft.com/sql-server/developer-get-started/php/ubuntu/)
| Node.js | Windows, Linux, macOS | [Node.js driver for SQL Server](/sql/connect/node-js/node-js-driver-for-sql-server/) | [Install](/sql/connect/node-js/step-1-configure-development-environment-for-node-js-development/) |  [Get started](https://www.microsoft.com/sql-server/developer-get-started/node/ubuntu)
| Python | Windows, Linux, macOS | [Python SQL driver](/sql/connect/python/python-driver-for-sql-server/) | Install choices: <br/> \* [pymssql](/sql/connect/python/pymssql/step-1-configure-development-environment-for-pymssql-python-development/) <br/> \* [pyodbc](/sql/connect/python/pyodbc/step-1-configure-development-environment-for-pyodbc-python-development/) |  [Get started](https://www.microsoft.com/sql-server/developer-get-started/python/ubuntu)
| Ruby | Windows, Linux, macOS | [Ruby driver for SQL Server](/sql/connect/ruby/ruby-driver-for-sql-server/) | [Install](/sql/connect/ruby/step-1-configure-development-environment-for-ruby-development/) | [Get started](https://www.microsoft.com/sql-server/developer-get-started/ruby/ubuntu)
| C++ | Windows, Linux, macOS | [Microsoft ODBC driver for SQL Server](/sql/connect/odbc/microsoft-odbc-driver-for-sql-server/) | [Download](/sql/connect/odbc/microsoft-odbc-driver-for-sql-server/) |  

The following table lists examples of object-relational mapping (ORM) frameworks and web frameworks that client applications can use with SQL Server, Azure SQL Database, Azure SQL Managed Instance, or Azure Synapse Analytics. You can use the frameworks on Linux, Windows, or Docker.

| Language | Platform | ORM(s) |
| :-- | :-- | :-- |
| C# | Windows, Linux, macOS | [Entity Framework](https://docs.microsoft.com/ef)<br>[Entity Framework Core](https://docs.microsoft.com/ef/core/index) |
| Java | Windows, Linux, macOS |[Hibernate ORM](https://hibernate.org/orm)|
| PHP | Windows, Linux, macOS | [Laravel (Eloquent)](https://laravel.com/docs/eloquent)<br>[Doctrine](https://www.doctrine-project.org/projects/orm.html) |
| Node.js | Windows, Linux, macOS | [Sequelize ORM](https://sequelize.org/) |
| Python | Windows, Linux, macOS |[Django](https://www.djangoproject.com/) |
| Ruby | Windows, Linux, macOS | [Ruby on Rails](https://rubyonrails.org/) |
||||

## Next steps

- For connectivity architecture information, see [Azure SQL Database Connectivity Architecture](connectivity-architecture.md).
- Find [SQL Server drivers](/sql/connect/sql-connection-libraries/) that are used to connect from client applications.
- Connect to Azure SQL Database or Azure SQL Managed Instance:
  - [Connect and query using .NET (C#)](connect-query-dotnet-core.md)
  - [Connect and query using PHP](connect-query-php.md)
  - [Connect and query using Node.js](connect-query-nodejs.md)
  - [Connect and query using Java](connect-query-java.md)
  - [Connect and query using Python](connect-query-python.md)
  - [Connect and query using Ruby](connect-query-ruby.md)
- Retry logic code examples:
  - [Connect resiliently with ADO.NET][step-4-connect-resiliently-to-sql-with-ado-net-a78n]
  - [Connect resiliently with PHP][step-4-connect-resiliently-to-sql-with-php-p42h]

<!-- Link references. -->

[step-4-connect-resiliently-to-sql-with-ado-net-a78n]: https://docs.microsoft.com/sql/connect/ado-net/step-4-connect-resiliently-sql-ado-net

[step-4-connect-resiliently-to-sql-with-php-p42h]: https://docs.microsoft.com/sql/connect/php/step-4-connect-resiliently-to-sql-with-php
