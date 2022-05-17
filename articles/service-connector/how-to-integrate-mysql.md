---
title: Integrate Azure Database for MySQL with Service Connector
description: Integrate Azure Database for MySQL into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: service-connector
ms.topic: how-to
ms.date: 05/03/2022
---

# Integrate Azure Database for MySQL with Service Connector

This page shows the supported authentication types and client types of Azure Database for MySQL using Service Connector. You might still be able to connect to Azure Database for MySQL in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service
- Azure Spring Cloud

## Supported Authentication types and client types

| Client Type | System-assigned Managed Identity | User-assigned Managed Identity | Secret/ConnectionString | Service Principal |
| --- | --- | --- | --- | --- |
| .NET (MySqlConnector) | | | ![yes icon](./media/green-check.png) | |
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
| spring.datatsource.url | Spring Boot JDBC database URL | `jdbc:mysql://{MySQLName}.mysql.database.azure.com:3306/{MySQLDbName}?sslmode=required` |
| spring.datatsource.username | Database username | `{MySQLUsername}@{MySQLName}` |
| spring.datatsource.password | Database password | `****` |

### Node.js (mysql) 

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
|---------|---------|---------|
| AZURE_MYSQL_HOST | Database Host URL  | `{MySQLName}.mysql.database.azure.com` |
| AZURE_MYSQL_USER | Database Username | `MySQLDbName` |
| AZURE_MYSQL_PASSWORD | Database password | `****` |
| AZURE_MYSQL_DATABASE | Database name  | `{MySQLUsername}@{MySQLName}` |
| AZURE_MYSQL_PORT | Port number | `3306` |
| AZURE_MYSQL_SSL | SSL option | `true` |

### Python (mysql-connector-python)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_MYSQL_HOST | Database Host URL  | `{MySQLName}.mysql.database.azure.com` |
| AZURE_MYSQL_NAME | Database name | `{MySQLDbName}` |
| AZURE_MYSQL_PASSWORD | Database password  | `****` |
| AZURE_MYSQL_USER | Database Username  | `{MySQLUsername}@{MySQLName}` |

### Python-Django

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_MYSQL_HOST | Database Host URL  | `{MySQLName}.mysql.database.azure.com` |
| AZURE_MYSQL_USER | Database Username | `{MySQLUsername}@{MySQLName}` |
| AZURE_MYSQL_PASSWORD | Database password | `****` |
| AZURE_MYSQL_NAME | Database name | `MySQLDbName` |


### Go (go-sql-driver for mysql)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_MYSQL_CONNECTIONSTRING | Go-sql-driver connection string | `{MySQLUsername}@{MySQLName}:{Password}@tcp({ServerHost}:{Port})/{Database}?tls=true` |


### PHP (mysqli)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
|---------|---------|---------|
| AZURE_MYSQL_HOST | Database Host URL | `{MySQLName}.mysql.database.azure.com` |
| AZURE_MYSQL_USERNAME | Database Username | `{MySQLUsername}@{MySQLName}` |
| AZURE_MYSQL_PASSWORD | Database password | `****` |
| AZURE_MYSQL_DBNAME | Database name | `{MySQLDbName}` |
| AZURE_MYSQL_PORT | Port number  | `3306` |
| AZURE_MYSQL_FLAG | SSL or other flags | `MYSQLI_CLIENT_SSL` |

### Ruby (mysql2)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
|---------|---------|---------|
| AZURE_MYSQL_HOST | Database Host URL  | `{MySQLName}.mysql.database.azure.com` |
| AZURE_MYSQL_USERNAME | Database Username | `{MySQLUsername}@{MySQLName}` |
| AZURE_MYSQL_PASSWORD | Database password | `****` |
| AZURE_MYSQL_DATABASE | Database name | `{MySQLDbName}` |
| AZURE_MYSQL_SSLMODE | SSL option | `required` |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
