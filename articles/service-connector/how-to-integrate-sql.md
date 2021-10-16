---
title: Integrate Azure Database for SQL DB with Service Connector
description: Integrate Azure Database for SQL DB into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: service-connector
ms.topic: how-to 
ms.date: 10/29/2021
---

# Integrate Azure SQL Database with Service Connector

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
| spring.datatsource.url | | `jdbc:sqlserver://{your-sql-server}.database.windows.net:1433;databaseName={sql-db};` |
| spring.datatsource.username | | `{sql-user}` |
| spring.datatsource.password | | `{sql-pass}` |

### Node.js

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
|---------|---------|---------|
| AZURE_SQL_HOST |  | `{sql-server}.database.windows.net` |
| AZURE_SQL_USER |  | `{sql-user}` |
| AZURE_SQL_PASSWORD |  | `{sql-pass}` |
| AZURE_SQL_DATABASE |  | `{sql-db}` |
| AZURE_SQL_PORT |  | `1433` |

### Python (pyodbc)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_SQL_SERVER |  | `{sql-server}.database.windows.net` |
| AZURE_SQL_PORT |  | `1433` |
| AZURE_SQL_PASSWORD |  | `{sql-pass}` |
| AZURE_SQL_DATABASE |  | `{sql-db}` |
| AZURE_SQL_USER |  | `{sql-user}` |

### Python-Django (mssql-django)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_SQL_HOST |  | `{sql-server}.database.windows.net` |
| AZURE_SQL_PORT |  | `1433` |
| AZURE_SQL_PASSWORD |  | `{sql-pass}` |
| AZURE_SQL_NAME |  | `{sql-db}` |
| AZURE_SQL_USER |  | `{sql-user}` |


### Go (go-mssqldb)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_SQL_CONNECTIONSTRING | go-mssqldb connection string | `server={sql-server}.database.windows.net;port=1433;database={sql-db};user id={sql-user};password={sql-pass};` |


### PHP

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
|---------|---------|---------|
| AZURE_SQL_SERVERNAME|  | `{sql-server}.database.windows.net,1433` |
| AZURE_SQL_UID |  | `{sql-user}` |
| AZURE_SQL_PWD |  | `{sql-pass}` |
| AZURE_SQL_DATABASE |  | `{sql-db}` |


### Ruby 

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_SQL_HOST |  | `{sql-server}.database.windows.net` |
| AZURE_SQL_PORT |  | `1433` |
| AZURE_SQL_PASSWORD |  | `{sql-pass}` |
| AZURE_SQL_DATABASE |  | `{sql-db}` |
| AZURE_SQL_USERNAME |  | `{sql-user}` |