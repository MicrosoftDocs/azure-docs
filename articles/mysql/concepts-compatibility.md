---
title: Driver and tools compatibility - Azure Database for MySQL
description: This article describes the MySQL drivers and management tools that are compatible with Azure Database for MySQL. 
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 3/18/2020
---
# MySQL drivers and management tools compatible with Azure Database for MySQL
This article describes the drivers and management tools that are compatible with Azure Database for MySQL.

## MySQL Drivers
Azure Database for MySQL uses the world's most popular community edition of MySQL database. Therefore, it is compatible with a wide variety of programming languages and drivers. The goal is to support the three most recent versions MySQL drivers, and efforts with authors from the open source community to constantly improve the functionality and usability of MySQL drivers continue. A list of drivers that have been tested and found to be compatible with Azure Database for MySQL 5.6 and 5.7 is provided in the following table:

| **Programming Language** | **Driver** | **Links** | **Compatible Versions** | **Incompatible Versions** | **Notes** |
| :----------------------- | :--------- | :-------- | :---------------------- | :------------------------ | :-------- |
| PHP | mysqli, pdo_mysql, mysqlnd | https://secure.php.net/downloads.php | 5.5, 5.6, 7.x | 5.3 | For PHP 7.0 connection with SSL MySQLi, add MYSQLI_CLIENT_SSL_DONT_VERIFY_SERVER_CERT in the connection string. <br> ```mysqli_real_connect($conn, $host, $username, $password, $db_name, 3306, NULL, MYSQLI_CLIENT_SSL_DONT_VERIFY_SERVER_CERT);```<br> PDO set: ```PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT``` option to false.|
| .NET | Async MySQL Connector for .NET | https://github.com/mysql-net/MySqlConnector <br> [Installation package from Nuget](https://www.nuget.org/packages/MySqlConnector/) | 0.27 and after | 0.26.5 and before | |
| .NET | MySQL Connector/NET | https://github.com/mysql/mysql-connector-net | 6.6.3 ,7.0 ,8.0 |  | An encoding bug may cause connections to fail on some non-UTF8 Windows systems. |
| Node.js | mysqljs | https://github.com/mysqljs/mysql/ <br> Installation package from NPM:<br> Run `npm install mysql` from NPM | 2.15 | 2.14.1 and before | |
| Node.js | node-mysql2 | https://github.com/sidorares/node-mysql2 | 1.3.4+ | | |
| Go | Go MySQL Driver | https://github.com/go-sql-driver/mysql/releases | 1.3, 1.4 | 1.2 and before | Use `allowNativePasswords=true` in the connection string for version 1.3. Version 1.4 contains a fix and `allowNativePasswords=true` is no longer required. |
| Python | MySQL Connector/Python | https://pypi.python.org/pypi/mysql-connector-python | 1.2.3, 2.0, 2.1, 2.2, use 8.0.16+ with MySQL 8.0  | 1.2.2 and before | |
| Python | PyMySQL | https://pypi.org/project/PyMySQL/ | 0.7.11, 0.8.0, 0.8.1, 0.9.3+ | 0.9.0 - 0.9.2 (regression in web2py) | |
| Java | MariaDB Connector/J | https://downloads.mariadb.org/connector-java/ | 2.1, 2.0, 1.6 | 1.5.5 and before | | 
| Java | MySQL Connector/J | https://github.com/mysql/mysql-connector-j | 5.1.21+, use 8.0.17+ with MySQL 8.0 | 5.1.20 and below | |
| C | MySQL Connector/C (libmysqlclient) | https://dev.mysql.com/doc/refman/5.7/en/c-api-implementations.html | 6.0.2+ | | |
| C | MySQL Connector/ODBC (myodbc) | https://github.com/mysql/mysql-connector-odbc | 3.51.29+ | | |
| C++ | MySQL Connector/C++ | https://github.com/mysql/mysql-connector-cpp | 1.1.9+ | 1.1.3 and below | | 
| C++ | MySQL++| https://tangentsoft.net/mysql++ | 3.2.3+ | | |
| Ruby | mysql2 | https://github.com/brianmario/mysql2 | 0.4.10+ | | |
| R | RMySQL | https://github.com/rstats-db/RMySQL | 0.10.16+ | | |
| Swift | mysql-swift | https://github.com/novi/mysql-swift | 0.7.2+ | | |
| Swift | vapor/mysql | https://github.com/vapor/mysql-kit | 2.0.1+ | | |

## Management Tools
The compatibility advantage extends to database management tools as well. Your existing tools should continue to work with Azure Database for MySQL, as long as the database manipulation operates within the confines of user permissions. Three common database management tools that have been tested and found to be compatible with Azure Database for MySQL 5.6 and 5.7 are listed in the following table:

|                                     | **MySQL Workbench 6.x and up** | **Navicat 12** | **PHPMyAdmin 4.x and up** |
| :---------------------------------- | :----------------------------- | :------------- | :-------------------------|
| Create, Update, Read, Write, Delete | X | X | X |
| SSL Connection | X | X | X |
| SQL Query Auto Completion | X | X |  |
| Import and Export Data | X | X | X | 
| Export to Multiple Formats | X | X | X |
| Backup and Restore |  | X |  |
| Display Server Parameters | X | X | X |
| Display Client Connections | X | X | X |

## Next steps

- [Troubleshoot connection issues to Azure Database for MySQL](howto-troubleshoot-common-connection-issues.md)