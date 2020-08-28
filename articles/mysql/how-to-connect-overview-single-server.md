---
title: Connect and query - Single Server MySQL
description: Links to Azure My SQL Database quickstarts showing how to connect to your server and run queries.
services: mysql
ms.service: mysql
ms.topic: how-to
author: mksuni
ms.author: sumuth
ms.date: 09/22/2020
---

# Connect and query overview for Azure database for MySQL- Single Server
The following document includes links to examples showing how to connect and query with Azure Database for MySQL Single Server. This guide also includes TLS recommendations and libraries that you can use to connect to the server in supported languages below.

## Quickstarts

| Quickstart | Description |
|---|---|
|[MySQL workbench](connect-workbench.md)|This quickstart demonstrates how to use MySQL Workbench Client to connect to a database. You can then use MySQL statements to query, insert, update, and delete data in the database.|
|[Azure Cloud Shell](https://docs.microsoft.com/azure/mysql/quickstart-create-mysql-server-database-using-azure-cli#connect-to-azure-database-for-mysql-server-using-mysql-command-line-client)|This article shows how to run **mysql.exe** in [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview) to connect to your server and then run statements to query, insert, update, and delete data in the database.|
|[MySQL with Visual Studio](https://www.mysql.com/why-mysql/windows/visualstudio)|You can use MySQL for Visual Studio for connecting to your MySQL server. MySQL for Visual Studio integrates directly into Server Explorer making it easy to setup new connections and working with database objects.|
|[PHP](connect-php.md)|This quickstart demonstrates how to use PHP to create a program to connect to a database and use MySQL statements to query data.|
|[Java](connect-java.md)|This quickstart demonstrates how to use Java to connect to a database and then use MySQL statements to query data.|
|[Node.js](connect-nodejs.md)|This quickstart demonstrates how to use Node.js to create a program to connect to a database and use MySQL statements to query data.|
|[.NET(C#)](connect-csharp.md)|This quickstart demonstrates how to use.NET (C#) to create a C# program to connect to a database and use MySQL statements to query data.|
|[Go](connect-go.md)|This quickstart demonstrates how to use Go to connect to a database. Transact-SQL statements to query and modify data are also demonstrated.|
|[Python](connect-python.md)|This quickstart demonstrates how to use Python to connect to a database and use MySQL statements to query data. |
|[Ruby](connect-ruby.md)|This quickstart demonstrates how to use Ruby to create a program to connect to a database and use MySQL statements to query data.|
|[C++](connect-cpp.md)|This quickstart demonstrates how to use C+++ to create a program to connect to a database and use  query data.|


## TLS considerations for database connectivity

Transport Layer Security (TLS) is used by all drivers that Microsoft supplies or supports for connecting to databases in Azure Database for MySQL. No special configuration is necessary but do enforce TLS 1.2 for newly created servers. We recommend if you are using TLS 1.0 and 1.1, then you update the TLS version for your servers. See [ How to configure TLS](howto-tls-configurations.md)


## Libraries

Azure Database for MySQL uses the world's most popular community edition of MySQL database. Hence, it is compatible with a wide variety of programming languages and drivers. The goal is to support the three most recent versions MySQL drivers, and efforts with authors from the open source community to constantly improve the functionality and usability of MySQL drivers continue.

Here is the list of drivers that have been tested and found to be compatible with Azure Database for MySQL:


| **Programming Language** | **Driver** | **Compatible Versions** | **Incompatible Versions**|
| :----------------------- | :--------- | :-------- | :---------------------- | :------------------------ |
| PHP |[mysqli, pdo_mysql, mysqlnd ](https://secure.php.net/downloads.php ) | 5.5, 5.6, 7.x | 5.3 |
|.NET |[Async MySQL Connector for.NET](https://github.com/mysql-net/MySqlConnector)|  0.27 and after | 0.26.5 and before |
|.NET | [MySQL Connector/NET](https://github.com/mysql/mysql-connector-net)| 6.6.3,7.0,8.0 |  |
| Node.js |[mysqljs](https://github.com/mysqljs/mysql/) |  2.15 | 2.14.1 and before |
| Node.js |[node-mysql2](https://github.com/sidorares/node-mysql2) | 1.3.4+ | None |
| Go |[Go MySQL Driver](https://github.com/go-sql-driver/mysql/releases) | 1.3, 1.4 | 1.2 and before | Use `allowNativePasswords=true` in the connection string for version 1.3. Version 1.4 contains a fix and `allowNativePasswords=true` is no longer required. |
| Python | [MySQL Connector/Python](https://pypi.python.org/pypi/mysql-connector-python) | 1.2.3, 2.0, 2.1, 2.2, use 8.0.16+ with MySQL 8.0  | 1.2.2 and before |
| Python | [PyMySQL](https://pypi.org/project/PyMySQL/) | 0.7.11, 0.8.0, 0.8.1, 0.9.3+ | 0.9.0 - 0.9.2 (regression in web2py) |
| Java | [MySQL Connector/J](https://github.com/mysql/mysql-connector-j) | 5.1.21+, use 8.0.17+ with MySQL 8.0 | 5.1.20 and below |
| C | [MySQL Connector/C (libmysqlclient)](https://dev.mysql.com/doc/refman/5.7/en/c-api-implementations.html)| 6.0.2+ | |
| C | [MySQL Connector/ODBC (myodbc)](https://github.com/mysql/mysql-connector-odbc) | 3.51.29+ | |
| C++ | [MySQL Connector/C++](https://github.com/mysql/mysql-connector-cpp)| 1.1.9+ | 1.1.3 and below | |
| C++ | [MySQL++](https://tangentsoft.net/mysql++) | 3.2.3+ | |
| Ruby | [mysql2](https://github.com/brianmario/mysql2) | 0.4.10+ | |
| R | [RMySQL](https://github.com/rstats-db/RMySQL) | 0.10.16+ | |
| Swift | [mysql-swift](https://github.com/novi/mysql-swift) | 0.7.2+ | |
| Swift | [vapor/mysql](https://github.com/vapor/mysql-kit) | 2.0.1+ | |

## Next Steps 
- [Migrate data using dump and restore](howto-migrate-using-dump-and-restore.md)
- [Migrate data using import and export](howto-migrate-using-export-and-import.md)
