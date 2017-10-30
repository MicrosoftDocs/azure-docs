---
title: MySQL drivers and management tools compatibility | Microsoft Docs
description: MySQL drivers and management tools compatible with Azure Database for MySQL
services: mysql
author: seanli1988
ms.author: seanli
editor: jasonwhowell
manager: jhubbard
ms.service: mysql-database
ms.topic: article
ms.date: 10/27/2017
---

## MySQL Drivers
Since Azure Database for MySQL uses the world's most popular community edition of MySQL database, it is compatible with a wide variety of popular program languages and drivers. Our goal is to support the most recent 3 versions MySQL drivers and we are working with authors from the open source community to constantly improve  functionality and usability of MySQL drivers. The table below documents a list of drivers that we have tested to be compatible with Azure Database for MySQL 5.6 and 5.7.

| **Driver** | **Links** | **Supported Versions** | **Unsupporteed Versions** | **Notes** |
| :-------- | :------------------------ | :----------- | :---------------------- | :--------------------------------------- |
| PHP | http://php.net/downloads.php | 5.5 5.6 7.x | 5.3 | For PHP 7.0 connection with SSL MySQLi, add MYSQLI_CLIENT_SSL_DONT_VERIFY_SERVER_CERT in the connection string. <br>i.e.: mysqli_real_connect($conn, $host, $username, $password, $db_name, 3306,NULL,MYSQLI_CLIENT_SSL_DONT_VERIFY_SERVER_CERT);<br> PDO set: PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT option to false.|
| .Net | Github: https://github.com/mysql-net/MySqlConnector/releases <br> Install: https://www.nuget.org/packages/MySqlConnector/ | 0.27 and after | 0.26.5 and before | |
| Nodejs |  Github: https://github.com/mysqljs/mysql/releases <br> Install: Run “npm install mysql” from NPM | 2.15 | 2.14.1 and before | |
| GO | https://github.com/go-sql-driver/mysql/releases | 1.3 | 1.2 and before | Use allowNativePasswords=true in the connection string |
| Python | https://pypi.python.org/pypi/mysql-connector-python | 1.2.3, 2.0, 2.1, 2.2 | 1.2.2 and before | |
| Java | https://downloads.mariadb.org/connector-java/ | 2.1 2.0 1.6 | 1.5.5 and before | |

## Management Tools
Our compatibility advantage extends to database management tools as well. Your existing tools should continue to work with Azure Database for MySQL, as long as the database manipulation operates within the confines of user permissions. The following table shows 3 common database management tools that we have tested and compatible with Azure Database for MySQL 5.6 and 5.7.

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










