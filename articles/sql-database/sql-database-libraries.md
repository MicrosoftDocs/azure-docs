---
title: Connection libraries for SQL Database | Microsoft Docs
description: Provides links for downloads of modules that enable connection to SQL Server and SQL Database from a broad variety of client programming languages. 
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: MightyPen
ms.author: genemi
ms.reviewer:
manager: craigg
ms.date: 04/01/2018
---
# Connectivity libraries and frameworks for SQL Server

Check out our [Get started tutorials](http://aka.ms/sqldev) to quickly get started with programming languages such as C#, Java, Node.js, PHP, and Python. Then build an app by using SQL Server on Linux or Windows or Docker on macOS.

The following table lists connectivity libraries or *drivers* that client applications can use from a variety of languages to connect to and use SQL Server running on-premises or in the cloud. You can use them on Linux, Windows, or Docker and use them to connect to Azure SQL Database and Azure SQL Data Warehouse. 

| Language | Platform | Additional resources | Download | Get started |
| :-- | :-- | :-- | :-- | :-- |
| C# | Windows, Linux, macOS | [Microsoft ADO.NET for SQL Server](https://docs.microsoft.com/sql/connect/ado-net/microsoft-ado-net-for-sql-server) | [Download](https://www.microsoft.com/net/download/) | [Get started](https://www.microsoft.com/sql-server/developer-get-started/csharp/ubuntu)
| Java | Windows, Linux, macOS | [Microsoft JDBC driver for SQL Server](http://msdn.microsoft.com/library/mt484311.aspx) | [Download](https://go.microsoft.com/fwlink/?linkid=852460) |  [Get started](https://www.microsoft.com/sql-server/developer-get-started/java/ubuntu)
| PHP | Windows, Linux, macOS| [PHP SQL driver for SQL Server](http://msdn.microsoft.com/library/dn865013.aspx) | Operating system: <br/> \* [Windows](https://www.microsoft.com/download/details.aspx?id=55642) <br/> \* [Linux](https://github.com/Microsoft/msphpsql/tree/dev#install-unix) <br/> \* [macOS](https://github.com/Microsoft/msphpsql/tree/dev#install-unix) |  [Get started](https://www.microsoft.com/sql-server/developer-get-started/php/ubuntu)
| Node.js | Windows, Linux, macOS | [Node.js driver for SQL Server](http://msdn.microsoft.com/library/mt652093.aspx) | [Install](https://msdn.microsoft.com/library/mt652094.aspx) |  [Get started](https://www.microsoft.com/sql-server/developer-get-started/node/ubuntu)
| Python | Windows, Linux, macOS | [Python SQL driver](http://msdn.microsoft.com/library/mt652092.aspx) | Install choices: <br/> \* [pymssql](https://msdn.microsoft.com/library/mt694094.aspx) <br/> \* [pyodbc](http://msdn.microsoft.com/library/mt763257.aspx) |  [Get started](https://www.microsoft.com/sql-server/developer-get-started/python/ubuntu)
| Ruby | Windows, Linux, macOS | [Ruby driver for SQL Server](http://msdn.microsoft.com/library/mt691981.aspx) | [Install](https://msdn.microsoft.com/library/mt711041.aspx) | [Get started](https://www.microsoft.com/sql-server/developer-get-started/ruby/ubuntu)
| C++ | Windows, Linux, macOS | [Microsoft ODBC driver for SQL Server](https://msdn.microsoft.com/library/mt654048(v=sql.1).aspx) | [Download](https://msdn.microsoft.com/library/mt654048(v=sql.1).aspx) |  

The following table lists examples of object-relational mapping (ORM) frameworks and web frameworks that client applications can use with SQL Server running on-premises or in the cloud. You can use the frameworks on Linux, Windows, or Docker and use them to connect to SQL Database and SQL Data Warehouse. 

| Language | Platform | ORM(s) |
| :-- | :-- | :-- |
| C# | Windows, Linux, macOS | [Entity Framework](https://docs.microsoft.com/ef)<br>[Entity Framework Core](https://docs.microsoft.com/ef/core/index) |
| Java | Windows, Linux, macOS |[Hibernate ORM](http://hibernate.org/orm)|
| PHP | Windows, Linux | [Laravel (Eloquent)](https://laravel.com/docs/5.0/eloquent) |
| Node.js | Windows, Linux, macOS | [Sequelize ORM](http://docs.sequelizejs.com) |
| Python | Windows, Linux, macOS |[Django](https://www.djangoproject.com/) |
| Ruby | Windows, Linux, macOS | [Ruby on Rails](http://rubyonrails.org/) |
||||

## Related links
- [SQL Server drivers](http://msdn.microsoft.com/library/mt654049.aspx) that are used to connect from client applications
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

