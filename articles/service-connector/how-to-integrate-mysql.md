---
title: Integrate Azure Database for MySQL with Service Connector
description: Integrate Azure Database for MySQL into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: serviceconnector
ms.topic: how-to 
ms.date: 10/29/2021
---

# Integrate Azure Database for MySQL with Service Connector

## Supported compute service

- Azure App Service
- Azure Spring Cloud

## Supported Authentication types and client types

| Client Type | System-assigned Managed Identity | User-assigned Managed Identity | Secret/ConnectionString | Service Principal |
| --- | --- | --- | --- | --- |
| .Net (MySqlConnector) | | | ![yes icon](./media/green-check.png) | |
| Java (JDBC) | | | ![yes icon](./media/green-check.png) | |
| Java - Spring Boot (JDBC) | | | ![yes icon](./media/green-check.png) | |
| Node.js (mysql) | | | ![yes icon](./media/green-check.png) | |
| Python (mysql-connector-python) | | | ![yes icon](./media/green-check.png) | |
| Python-Django | | | ![yes icon](./media/green-check.png) | |
| Go (go-sql-driver for mysql) | | | ![yes icon](./media/green-check.png) | |
| PHP (mysqli) | | | ![yes icon](./media/green-check.png) | |
| Ruby (mysql2) | | | ![yes icon](./media/green-check.png) | |

## Default environment variable names or application properties

### .NET (MySqlConnector) 

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_MYSQL_CONNECTIONSTRING | ADO.NET MySQL connection string | `Server={MySQLName}.mysql.database.azure.com;Database={MySQLDbName};Port=3306;SSL Mode=Required;User Id={MySQLUsername};Password={TestDbPassword}` |

### Java (JDBC)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_MYSQL_CONNECTIONSTRING | JDBC MySQL connection string | `jdbc:mysql://{MySQLName}.mysql.database.azure.com:3306/{MySQLDbName}?sslmode=required&user={MySQLUsername}&password={Uri.EscapeDataString(TestDbPassword)}` |

### Java - Spring Boot (JDBC)

**Secret/ConnectionString**

| Application properties | Description | Example value |
| --- | --- | --- |
| spring.datatsource.url | | `jdbc:mysql://{MySQLName}.mysql.database.azure.com:3306/{MySQLDbName}?sslmode=required` |
| spring.datatsource.username | | `{MySQLUsername}@{MySQLName}` |
| spring.datatsource.password | | `****` |

### Node.js (mysql) 

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
|---------|---------|---------|
| AZURE_MYSQL_HOST |  | `{MySQLName}.mysql.database.azure.com` |
| AZURE_MYSQL_USER |  | `MySQLDbName` |
| AZURE_MYSQL_PASSWORD |  | `****` |
| AZURE_MYSQL_DATABASE |  | `{MySQLUsername}@{MySQLName}` |
| AZURE_MYSQL_PORT |  | `3306` |
| AZURE_MYSQL_SSL |  | `true` |

### Python (mysql-connector-python)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_MYSQL_HOST |  | `{MySQLName}.mysql.database.azure.com` |
| AZURE_MYSQL_NAME |  | `{MySQLDbName}` |
| AZURE_MYSQL_PASSWORD |  | `****` |
| AZURE_MYSQL_USER |  | `{MySQLUsername}@{MySQLName}` |

### Python-Django

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_MYSQL_HOST |  | `{MySQLName}.mysql.database.azure.com` |
| AZURE_MYSQL_USER |  | `{MySQLUsername}@{MySQLName}` |
| AZURE_MYSQL_PASSWORD |  | `****` |
| AZURE_MYSQL_NAME |  | `MySQLDbName` |


### Go (go-sql-driver for mysql)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_MYSQL_CONNECTIONSTRING | Go-sql-driver connection string | `{MySQLUsername}@{MySQLName}:{Password}@tcp({ServerHost}:{Port})/{Database}?tls=true` |


### PHP (mysqli)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
|---------|---------|---------|
| AZURE_MYSQL_HOST |  | `{MySQLName}.mysql.database.azure.com` |
| AZURE_MYSQL_USERNAME |  | `{MySQLUsername}@{MySQLName}` |
| AZURE_MYSQL_PASSWORD |  | `****` |
| AZURE_MYSQL_DBNAME |  | `{MySQLDbName}` |
| AZURE_MYSQL_PORT |  | `3306` |
| AZURE_MYSQL_FLAG |  | `MYSQLI_CLIENT_SSL` |

### Ruby (mysql2)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
|---------|---------|---------|
| AZURE_MYSQL_HOST |  | `{MySQLName}.mysql.database.azure.com` |
| AZURE_MYSQL_USERNAME |  | `{MySQLUsername}@{MySQLName}` |
| AZURE_MYSQL_PASSWORD |  | `****` |
| AZURE_MYSQL_DATABASE |  | `{MySQLDbName}` |
| AZURE_MYSQL_SSLMODE |  | `required` |