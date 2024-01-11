---
title: Drivers and tools compatibility - Azure Database for MariaDB
description: This article describes the MariaDB drivers and management tools that are compatible with Azure Database for MariaDB. 
ms.service: mariadb
author: SudheeshGH
ms.author: sunaray
ms.topic: conceptual
ms.date: 06/24/2022
---
# MariaDB drivers and management tools compatible with Azure Database for MariaDB

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

This article describes the drivers and management tools that are compatible with Azure Database for MariaDB.

## MariaDB Drivers

Azure Database for MariaDB uses the community edition of MariaDB server. Therefore, it's compatible with a wide variety of programming languages and drivers. The MariaDB API and protocol are compatible with those used by MySQL. This means that connectors that work with MySQL should also work with MariaDB.

The goal is to support the three most recent versions MariaDB drivers, and efforts with authors from the open source community to constantly improve the functionality and usability of MariaDB drivers continue. A list of drivers that have been tested and found to be compatible with Azure Database for MariaDB 10.2 is provided in the following table:

**Driver** | **Links** | **Compatible Versions** | **Incompatible Versions** | **Notes**
---|---|---|---|---
PHP | https://secure.php.net/downloads.php | 5.5, 5.6, 7.x | 5.3 | For PHP 7.0 connection with SSL MySQLi, add MYSQLI_CLIENT_SSL_DONT_VERIFY_SERVER_CERT in the connection string. <br> ```mysqli_real_connect($conn, $host, $username, $password, $db_name, 3306, NULL, MYSQLI_CLIENT_SSL_DONT_VERIFY_SERVER_CERT);```<br> PDO set: ```PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT``` option to false.
.NET | [MySqlConnector on GitHub](https://github.com/mysql-net/MySqlConnector) <br> [Installation package from NuGet](https://www.nuget.org/packages/MySqlConnector/) | 0.27 and after | 0.26.5 and before |
MySQL Connector/NET | [MySQL Connector/NET](https://github.com/mysql/mysql-connector-net) | 8.0, 7.0, 6.10 |  | An encoding bug may cause connections to fail on some non-UTF8 Windows systems.
Node.js |  [MySQLjs on GitHub](https://github.com/mysqljs/mysql/) <br> Installation package from NPM:<br> Run `npm install mysql` from NPM | 2.15 | 2.14.1 and before
GO | https://github.com/go-sql-driver/mysql/releases | 1.3, 1.4 | 1.2 and before | Use `allowNativePasswords=true` in the connection string for version 1.3. Version 1.4 contains a fix and `allowNativePasswords=true` is no longer required.
Python | https://pypi.python.org/pypi/mysql-connector-python | 1.2.3, 2.0, 2.1, 2.2 | 1.2.2 and before |
Java | https://downloads.mariadb.org/connector-java/ | 2.1, 2.0, 1.6 | 1.5.5 and before |

## Management Tools

The compatibility advantage extends to database management tools as well. Your existing tools should continue to work with Azure Database for MariaDB, as long as the database manipulation operates within the confines of user permissions. Three common database management tools that have been tested and found to be compatible with Azure Database for MariaDB 10.2 are listed in the following table:

| Action | **MySQL Workbench 6.x and up** | **Navicat 12** | **PHPMyAdmin 4.x and up**
---|---|---|---
Create, Update, Read, Write, Delete | X | X | X
SSL Connection | X | X | X
SQL Query Auto Completion | X | X |
Import and Export Data | X | X | X
Export to Multiple Formats | X | X | X
Back up and Restore |  | X |
Display Server Parameters | X | X | X
Display Client Connections | X | X | X

## Next steps

- [Troubleshoot connection issues to Azure Database for MariaDB](howto-troubleshoot-common-connection-issues.md)
