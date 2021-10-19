---
title: Integrate Azure Database for SQL DB with Service Connector
description: Integrate Azure Database for SQL DB into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: serviceconnector
ms.topic: how-to 
ms.date: 10/29/2021
---

# Integrate Azure SQL Database with Service Connector

This page shows the supported authentication types and client types of Azure SQL Database using Service Connector. You might still be able to connect to Azure SQL Database in other programming languages without using Service Connector. This page also shows default environment variable name and value (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service
- Azure Spring Cloud

## Supported Authentication types and client types

| Client Type | System-assigned Managed Identity | User-assigned Managed Identity | Secret/ConnectionString | Service Principal |
| --- | --- | --- | --- | --- |
| .Net (sqlClient) | | | ![yes icon](./media/green-check.png) | |
| Java (JDBC) | | | ![yes icon](./media/green-check.png) | |
| Java - Spring Boot (spring-boot-starter-jdbc) | | | ![yes icon](./media/green-check.png) | |
| Node.js | | | ![yes icon](./media/green-check.png) | |
| Python (pyodbc) | | | ![yes icon](./media/green-check.png) | |
| Python-Django (mssql-django) | | | ![yes icon](./media/green-check.png) | |
| Go (go-mssqldb) | | | ![yes icon](./media/green-check.png) | |
| PHP | | | ![yes icon](./media/green-check.png) | |
| Ruby | | | ![yes icon](./media/green-check.png) | |

## Default environment variable names or application properties

### .NET (sqlClient) 

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_SQL_CONNECTIONSTRING | sqlClient connection string | `Data Source={your-sql-server}.database.windows.net,1433;Initial Catalog={sql-db};User ID={sql-user};Password={sql-pass}` |

### Java (JDBC)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_SQL_CONNECTIONSTRING | JDBC SQL connection string | `jdbc:sqlserver://{your-sql-server}.database.windows.net:1433;databaseName={sql-db};user={sql-user};password={sql-pass};` |

### Java - Spring Boot (spring-boot-starter-jdbc)

**Secret/ConnectionString**

| Application properties | Description | Example value |
| --- | --- | --- |
| spring.datatsource.url | Spring Boot JDBC database URL | `jdbc:sqlserver://{your-sql-server}.database.windows.net:1433;databaseName={sql-db};` |
| spring.datatsource.username | Database username | `{sql-user}` |
| spring.datatsource.password | Database password | `{sql-pass}` |

### Node.js

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
|---------|---------|---------|
| AZURE_SQL_HOST | Database URL  | `{sql-server}.database.windows.net` |
| AZURE_SQL_USER | Database username  | `{sql-user}` |
| AZURE_SQL_PASSWORD | Database password | `{sql-pass}` |
| AZURE_SQL_DATABASE | Database name  | `{sql-db}` |
| AZURE_SQL_PORT | Port number | `1433` |

### Python (pyodbc)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_SQL_SERVER | Database URL | `{sql-server}.database.windows.net` |
| AZURE_SQL_PORT | Port number | `1433` |
| AZURE_SQL_PASSWORD | Database password | `{sql-pass}` |
| AZURE_SQL_DATABASE | Database name | `{sql-db}` |
| AZURE_SQL_USER | Database username | `{sql-user}` |

### Python-Django (mssql-django)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_SQL_HOST | Database URL | `{sql-server}.database.windows.net` |
| AZURE_SQL_PORT | Port number | `1433` |
| AZURE_SQL_PASSWORD | Database password | `{sql-pass}` |
| AZURE_SQL_NAME | Database name | `{sql-db}` |
| AZURE_SQL_USER | Database username | `{sql-user}` |


### Go (go-mssqldb)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_SQL_CONNECTIONSTRING | go-mssqldb connection string | `server={sql-server}.database.windows.net;port=1433;database={sql-db};user id={sql-user};password={sql-pass};` |


### PHP

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
|---------|---------|---------|
| AZURE_SQL_SERVERNAME | Database server name  | `{sql-server}.database.windows.net,1433` |
| AZURE_SQL_UID | Database username | `{sql-user}` |
| AZURE_SQL_PWD | Database password  | `{sql-pass}` |
| AZURE_SQL_DATABASE | Database name  | `{sql-db}` |


### Ruby 

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_SQL_HOST | Database URL | `{sql-server}.database.windows.net` |
| AZURE_SQL_PORT | Port number | `1433` |
| AZURE_SQL_PASSWORD | Database password | `{sql-pass}` |
| AZURE_SQL_DATABASE | Database name | `{sql-db}` |
| AZURE_SQL_USERNAME | Database username | `{sql-user}` |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
