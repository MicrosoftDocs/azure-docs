---
title: Integrate Azure Database for MySQL with Service Connector
description: Integrate Azure Database for MySQL into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 08/11/2022
ms.custom: event-tier1-build-2022
---

# Integrate Azure Database for MySQL with Service Connector

This page shows the supported authentication types and client types of Azure Database for MySQL using Service Connector. You might still be able to connect to Azure Database for MySQL in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

Supported authentication and clients for App Service, Container Apps and Azure Spring Apps:

| Client type                     | System-assigned managed identity | User-assigned managed identity | Secret / connection string           | Service principal |
|---------------------------------|----------------------------------|--------------------------------|--------------------------------------|-------------------|
| .NET (MySqlConnector)           |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Go (go-sql-driver for mysql)    |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Java (JDBC)                     |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Java - Spring Boot (JDBC)       |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Node.js (mysql)                 |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Python (mysql-connector-python) |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Python-Django                   |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| PHP (mysqli)                    |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Ruby (mysql2)                   |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| None                            |                                  |                                | ![yes icon](./media/green-check.png) |                   |

## Default environment variable names or application properties

Use the connection details below to connect compute services to Azure Database for MySQL. For each example below, replace the placeholder texts `<MySQL-DB-name>`, `<MySQL-DB-username>`, `<MySQL-DB-password>`, `<server-host>`, and `<port>` with your Azure Database for MySQL name, Azure Database for MySQL username, Azure Database for MySQL password, server host, and port.

### .NET (MySqlConnector) secret / connection string

| Default environment variable name | Description                     | Example value                                                                                                                                                  |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AZURE_MYSQL_CONNECTIONSTRING      | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;SSL Mode=Required;User Id=<MySQL-DBusername>;Password=<MySQL-DB-password>` |

### Java (JDBC) secret / connection string

| Default environment variable name | Description                  | Example value                                                                                                                                                              |
|-----------------------------------|------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AZURE_MYSQL_CONNECTIONSTRING      | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>&password=<Uri.EscapeDataString(<MySQL-DB-password>)` |

### Java - Spring Boot (JDBC) secret / connection string

| Application properties      | Description                   | Example value                                                                                 |
|-----------------------------|-------------------------------|-----------------------------------------------------------------------------------------------|
| spring.datatsource.url      | Spring Boot JDBC database URL | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required` |
| spring.datatsource.username | Database username             | `<MySQL-DB-username>@<MySQL-DB-name>`                                                         |
| spring.datatsource.password | Database password             | `MySQL-DB-password`                                                                           |

### Node.js (mysql) secret / connection string

| Default environment variable name | Description       | Example value                              |
|-----------------------------------|-------------------|--------------------------------------------|
| AZURE_MYSQL_HOST                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| AZURE_MYSQL_USER                  | Database Username | `MySQL-DB-username`                        |
| AZURE_MYSQL_PASSWORD              | Database password | `MySQL-DB-password`                        |
| AZURE_MYSQL_DATABASE              | Database name     | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| AZURE_MYSQL_PORT                  | Port number       | `3306`                                     |
| AZURE_MYSQL_SSL                   | SSL option        | `true`                                     |

### Python (mysql-connector-python) secret / connection string

| Default environment variable name | Description       | Example value                              |
|-----------------------------------|-------------------|--------------------------------------------|
| AZURE_MYSQL_HOST                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| AZURE_MYSQL_NAME                  | Database name     | `MySQL-DB-name`                            |
| AZURE_MYSQL_PASSWORD              | Database password | `MySQL-DB-password`                        |
| AZURE_MYSQL_USER                  | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |

### Python-Django secret / connection string

| Default environment variable name | Description       | Example value                              |
|-----------------------------------|-------------------|--------------------------------------------|
| AZURE_MYSQL_HOST                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| AZURE_MYSQL_USER                  | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| AZURE_MYSQL_PASSWORD              | Database password | `MySQL-DB-password`                        |
| AZURE_MYSQL_NAME                  | Database name     | `MySQL-DB-name`                            |

### Go (go-sql-driver for mysql) secret / connection string

| Default environment variable name | Description                     | Example value                                                                                                |
|-----------------------------------|---------------------------------|--------------------------------------------------------------------------------------------------------------|
| AZURE_MYSQL_CONNECTIONSTRING      | Go-sql-driver connection string | `<MySQL-DB-username>@<MySQL-DB-name>:<MySQL-DB-password>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |

### PHP (mysqli) secret / connection string

| Default environment variable name | Description        | Example value                              |
|-----------------------------------|--------------------|--------------------------------------------|
| AZURE_MYSQL_HOST                  | Database Host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| AZURE_MYSQL_USERNAME              | Database Username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| AZURE_MYSQL_PASSWORD              | Database password  | `<MySQL-DB-password>`                      |
| AZURE_MYSQL_DBNAME                | Database name      | `<MySQL-DB-name>`                          |
| AZURE_MYSQL_PORT                  | Port number        | `3306`                                     |
| AZURE_MYSQL_FLAG                  | SSL or other flags | `MYSQLI_CLIENT_SSL`                        |

### Ruby (mysql2) secret / connection string

| Default environment variable name | Description       | Example value                              |
|-----------------------------------|-------------------|--------------------------------------------|
| AZURE_MYSQL_HOST                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| AZURE_MYSQL_USERNAME              | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| AZURE_MYSQL_PASSWORD              | Database password | `<MySQL-DB-password>`                      |
| AZURE_MYSQL_DATABASE              | Database name     | `<MySQL-DB-name>`                          |
| AZURE_MYSQL_SSLMODE               | SSL option        | `required`                                 |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
