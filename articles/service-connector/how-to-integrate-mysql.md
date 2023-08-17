---
title: Integrate Azure Database for MySQL with Service Connector
description: Integrate Azure Database for MySQL into your application with Service Connector
author: mcleanbyron
ms.author: mcleans
ms.service: service-connector
ms.topic: how-to
ms.date: 11/29/2022
ms.custom: event-tier1-build-2022, engagement-fy23
---

# Integrate Azure Database for MySQL with Service Connector

This page shows the supported authentication types and client types of Azure Database for MySQL - Flexible Server using Service Connector. You might still be able to connect to Azure Database for MySQL in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).


[!INCLUDE [Azure-database-for-mysql-single-server-deprecation](../mysql/includes/azure-database-for-mysql-single-server-deprecation.md)]

## Supported compute service

- Azure App Service
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

Supported authentication and clients for App Service, Container Apps, and Azure Spring Apps:

| Client type                     | System-assigned managed identity     | User-assigned managed identity      | Secret/connection string             | Service principal                    |
|---------------------------------|:------------------------------------:|:-----------------------------------:|:------------------------------------:|:------------------------------------:|
| .NET                            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Go (go-sql-driver for mysql)    | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java (JDBC)                     | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot (JDBC)       | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js (mysql)                 | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python (mysql-connector-python) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python-Django                   | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| PHP (MySQLi)                    | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Ruby (mysql2)                   | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| None                            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

> [!NOTE]
> System-assigned managed identity, User-assigned managed identity and Service principal are only supported on Azure CLI. 

## Default environment variable names or application properties

Use the connection details below to connect compute services to Azure Database for MySQL. For each example below, replace the placeholder texts `<MySQL-DB-name>`, `<MySQL-DB-username>`, `<MySQL-DB-password>`, `<server-host>`, and `<port>` with your Azure Database for MySQL name, Azure Database for MySQL username, Azure Database for MySQL password, server host, and port.

### .NET (MySqlConnector)

#### .NET (MySqlConnector) System-assigned managed identity

| Default environment variable name | Description                     | Example value                                                                                                                                                  |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Azure_MYSQL_CONNECTIONSTRING `     | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;User Id=<MySQL-DBusername>;SSL Mode=Required;` |

#### .NET (MySqlConnector) User-assigned managed identity

| Default environment variable name | Description                     | Example value                                                                                                                                                  |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Azure_MYSQL_CLIENTID`              | Your client ID                  | `<identity-client-ID>`                                                                                                                    |
| `Azure_MYSQL_CONNECTIONSTRING`     | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;User Id=<MySQL-DBusername>;SSL Mode=Required;` |

#### .NET (MySqlConnector) secret / connection string

| Default environment variable name | Description                     | Example value                                                                                                                                                  |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Azure_MYSQL_CONNECTIONSTRING`      | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;User Id=<MySQL-DBusername>;Password=<MySQL-DB-password>;SSL Mode=Required` |

#### .NET (MySqlConnector) Service principal

| Default environment variable name | Description                     | Example value                                                                                                                                                  |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Azure_MYSQL_CLIENTID`              | Your client ID                  | `<client-ID>`                                                                                                                                                  |
| `Azure_MYSQL_CLIENTSECRET`          | Your client secret              | `<client-secret>`                                                                                                                                              |
| `Azure_MYSQL_TENANTID`              | Your tenant ID                  | `<tenant-ID>`                                                                                                                                                  |
| `Azure_MYSQL_CONNECTIONSTRING`      | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;User Id=<MySQL-DBusername>;SSL Mode=Required` |

### Go (go-sql-driver for mysql)

#### Go (go-sql-driver for mysql) System-assigned managed identity

| Default environment variable name | Description                     | Example value                                                                                                |
|-----------------------------------|---------------------------------|--------------------------------------------------------------------------------------------------------------|
| `Azure_MYSQL_CONNECTIONSTRING`      | Go-sql-driver connection string | `<MySQL-DB-username>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |

#### Go (go-sql-driver for mysql) User-assigned managed identity

| Default environment variable name | Description                     | Example value                                                                                                |
|-----------------------------------|---------------------------------|--------------------------------------------------------------------------------------------------------------|
| `Azure_MYSQL_CONNECTIONSTRING`      | Go-sql-driver connection string | `<MySQL-DB-username>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |


#### Go (go-sql-driver for mysql) secret / connection string

| Default environment variable name | Description                     | Example value                                                                                                |
|-----------------------------------|---------------------------------|--------------------------------------------------------------------------------------------------------------|
| `Azure_MYSQL_CONNECTIONSTRING`      | Go-sql-driver connection string | `<MySQL-DB-username>:<MySQL-DB-password>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |

#### Go (go-sql-driver for mysql) Service principal

| Default environment variable name | Description                     | Example value                                                                                                |
|-----------------------------------|---------------------------------|--------------------------------------------------------------------------------------------------------------|
| `Azure_MYSQL_CONNECTIONSTRING`      | Go-sql-driver connection string | `<MySQL-DB-username>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |

### Java (JDBC)

#### Java (JDBC) System-assigned managed identity

| Default environment variable name | Description                  | Example value                                                                                                          |
|-----------------------------------|------------------------------|------------------------------------------------------------------------------------------------------------------------|
| `Azure_MYSQL_CONNECTIONSTRING`      | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>` |

#### Java (JDBC) User-assigned managed identity

| Default environment variable name | Description                  | Example value                                                                                                          |
|-----------------------------------|------------------------------|------------------------------------------------------------------------------------------------------------------------|
| `Azure_MYSQL_CLIENTID`              | Your client ID               | `<identity-client-ID>`                                                                                                          |
| `Azure_MYSQL_CONNECTIONSTRING`      | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>` |

#### Java (JDBC) secret / connection string

| Default environment variable name | Description                  | Example value                                                                                                                                                              |
|-----------------------------------|------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Azure_MYSQL_CONNECTIONSTRING`      | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>&password=<Uri.EscapeDataString(<MySQL-DB-password>)` |

#### Java (JDBC) Service principal

| Default environment variable name   | Description                  | Example value                                           |
|-------------------------------------|------------------------------|---------------------------------------------------------|
| `Azure_MYSQL_CLIENTID`              | Your client ID               | `<client-ID>`                                           |
| `Azure_MYSQL_CLIENTSECRET`          | Your client secret           | `<client-secret>`                                       |
| `Azure_MYSQL_TENANTID`              | Your tenant ID               | `<tenant-ID>`                                           |
| `Azure_MYSQL_CONNECTIONSTRING`      | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>` |

### Java - Spring Boot (JDBC)                                                                   

#### Java - Spring Boot (JDBC) System-assigned managed identity

| Application properties                   | Description                           | Example value                                                                                 |
|------------------------------------------|---------------------------------------|-----------------------------------------------------------------------------------------------|
| `spring.datasource.azure.passwordless-enabled` | Enable passwordless authentication    | `true`                                                                                        |
| `spring.datasource.url`                  | Spring Boot JDBC database URL         | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required` |
| `spring.datasource.username`             | Database username                     | `<MySQL-DB-username>`                                                                         |


#### Java - Spring Boot (JDBC) User-assigned managed identity

| Application properties                                          | Description                       | Example value                                                                                                 |
|-----------------------------------------------------------------|-----------------------------------|---------------------------------------------------------------------------------------------------------------|
| `spring.datasource.azure.passwordless-enabled`                        | Enable passwordless authentication| `true`                                                                                                  |
| `spring.cloud.azure.credential.client-id`                       | Your client ID                    | `<identity-client-ID>`                                                                                        |
| `spring.cloud.azure.credential.client-managed-identity-enabled` | Enable client managed identity    | `true`                                                                                                        |
| `spring.datasource.url`                                         | Database URL                      | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required`                 |
| `spring.datasource.username`                                    | Database username                 | `username`                                                                                             |

#### Java - Spring Boot (JDBC) secret / connection string

| Application properties       | Description                   | Example value                                                                                 |
|------------------------------|-------------------------------|-----------------------------------------------------------------------------------------------|
| `spring.datasource.url`      | Spring Boot JDBC database URL | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required` |
| `spring.datasource.username` | Database username             | `<MySQL-DB-username>`                                                         |
| `spring.datasource.password` | Database password             | `MySQL-DB-password`     

#### Java - Spring Boot (JDBC) Service principal

| Application properties                                          | Description                       | Example value                                                                                                 |
|-----------------------------------------------------------------|-----------------------------------|---------------------------------------------------------------------------------------------------------------|
| `spring.datasource.azure.passwordless-enabled`                        | Enable passwordless authentication| `true`                                                                                                  |
| `spring.cloud.azure.credential.client-id`                       | Your client ID                    | `<client-ID>`                                                                                                 |
| `spring.cloud.azure.credential.client-secret`                   | Your client secret                | `<client-secret>`                                                                                             |
| `spring.cloud.azure.credential.tenant-id`                       | Your tenant ID                    | `<tenant-ID>`                                                                                                 |
| `spring.datasource.url`                                         | Database URL                      | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required`                 |
| `spring.datasource.username`                                    | Database username                 | `username`                             |

### Node.js (mysql)

#### Node.js (mysql) System-assigned managed identity

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `Azure_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `Azure_MYSQL_USER`                  | Database Username | `MySQL-DB-username`                        |
| `Azure_MYSQL_DATABASE`              | Database name     | `<database-name>`                         |
| `Azure_MYSQL_PORT`                  | Port number       | `3306`                                     |
| `Azure_MYSQL_SSL`                   | SSL option        | `true`                                     |

#### Node.js (mysql) User-assigned managed identity

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `Azure_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `Azure_MYSQL_USER`                  | Database Username | `MySQL-DB-username`                        |
| `Azure_MYSQL_DATABASE`              | Database name     | `<database-name>`                      |
| `Azure_MYSQL_PORT`                  | Port number       | `3306`                                     |
| `Azure_MYSQL_SSL`                   | SSL option        | `true`                                     |
| `Azure_MYSQL_CLIENTID`              | Your client ID    | `<identity-client-ID>`                     |

#### Node.js (mysql) secret / connection string

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `Azure_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `Azure_MYSQL_USER`                  | Database Username | `MySQL-DB-username`                        |
| `Azure_MYSQL_PASSWORD`              | Database password | `MySQL-DB-password`                        |
| `Azure_MYSQL_DATABASE`              | Database name     | `<database-name>`      |
| `Azure_MYSQL_PORT`                  | Port number       | `3306`                                     |
| `Azure_MYSQL_SSL`                   | SSL option        | `true`                                     |

#### Node.js (mysql) Service principal

| Default environment variable name   | Description           | Example value                                          |
|-------------------------------------|-----------------------|--------------------------------------------------------|
| `Azure_MYSQL_HOST `                 | Database host URL     | `<MySQL-DB-name>.mysql.database.azure.com`             |
| `Azure_MYSQL_USER`                  | Database username     | `MySQL-DB-username`                                    |
| `Azure_MYSQL_DATABASE`              | Database name         | `<database-name>`                                      |
| `Azure_MYSQL_PORT `                 | Port number           | `3306`                                                 |
| `Azure_MYSQL_SSL`                   | SSL option            | `true`                                                 |
| `Azure_MYSQL_CLIENTID`              | Your client ID        | `<client-ID>`                                          |
| `Azure_MYSQL_CLIENTSECRET`          | Your client secret    | `<client-secret>`                                      |
| `Azure_MYSQL_TENANTID`              | Your tenant ID        | `<tenant-ID>`                                          |

### Python (mysql-connector-python)

#### Python (mysql-connector-python) System-assigned managed identity

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `Azure_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `Azure_MYSQL_HOST `                 | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `Azure_MYSQL_USER`                  | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |

#### Python (mysql-connector-python) User-assigned managed identity

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `Azure_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `Azure_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `Azure_MYSQL_USER`                  | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `Azure_MYSQL_CLIENTID`              | Your client ID    | `identity-client-ID`                       |

#### Python (mysql-connector-python) secret / connection string

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `Azure_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `Azure_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `Azure_MYSQL_USER`                  | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `Azure_MYSQL_PASSWORD`              | Database password | `MySQL-DB-password`                        |

#### Python (mysql-connector-python) Service principal

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `Azure_MYSQL_NAME`                  | Database name      | `MySQL-DB-name`                            |
| `Azure_MYSQL_HOST`                  | Database Host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `Azure_MYSQL_USER`                  | Database Username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `Azure_MYSQL_CLIENTID`              | Your client ID     | `<client-ID>`                              |
| `Azure_MYSQL_CLIENTSECRET`          | Your client secret | `<client-secret>`                          |
| `Azure_MYSQL_TENANTID`              | Your tenant ID     | `<tenant-ID>`                              |

#### Python-Django System-assigned managed identity

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `Azure_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `Azure_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `Azure_MYSQL_USER`                  | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |

#### Python-Django  User-assigned managed identity

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `Azure_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `Azure_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `Azure_MYSQL_USER `                 | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `Azure_MYSQL_CLIENTID`              | Your client ID    | `<identity-client-ID>`                     |

#### Python-Django secret / connection string

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `Azure_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `Azure_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `Azure_MYSQL_USER`                  | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `Azure_MYSQL_PASSWORD`              | Database password | `MySQL-DB-password`                        |


#### Python-Django Service principal

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `Azure_MYSQL_NAME`                  | Database name      | `MySQL-DB-name`                            |
| `Azure_MYSQL_HOST`                  | Database Host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `Azure_MYSQL_USER `                 | Database Username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `Azure_MYSQL_CLIENTID`              | Your client ID     | `<client-ID>`                              |
| `Azure_MYSQL_CLIENTSECRET`          | Your client secret | `<client-secret>`                          |
| `Azure_MYSQL_TENANTID`              | Your tenant ID     | `<tenant-ID>`                              |

#### PHP (MySQLi)

#### PHP (MySQLi) System-assigned managed identity

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `Azure_MYSQL_DBNAME`                | Database name      | `<MySQL-DB-name>`                          |
| `Azure_MYSQL_HOST`                  | Database Host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `Azure_MYSQL_PORT`                  | Port number        | `3306`                                     |
| `Azure_MYSQL_FLAG`                  | SSL or other flags | `MySQL_CLIENT_SSL`                         |
| `Azure_MYSQL_USERNAME`              | Database Username  | `<MySQL-DB-username>`       |

#### PHP (MySQLi) User-assigned managed identity

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `Azure_MYSQL_DBNAME`                | Database name      | `<MySQL-DB-name>`                          |
| `Azure_MYSQL_HOST`                  | Database Host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `Azure_MYSQL_PORT`                  | Port number        | `3306`                                     |
| `Azure_MYSQL_FLAG`                  | SSL or other flags | `MySQL_CLIENT_SSL`                         |
| `Azure_MYSQL_USERNAME`              | Database Username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `Azure_MYSQL_CLIENTID`              | Your client ID     | `<identity-client-ID>`                     |

#### PHP (MySQLi) secret / connection string

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `Azure_MYSQL_DBNAME`                | Database name      | `<MySQL-DB-name>`                          |
| `Azure_MYSQL_HOST`                  | Database Host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `Azure_MYSQL_PORT`                  | Port number        | `3306`                                     |
| `Azure_MYSQL_FLAG`                  | SSL or other flags | `MySQL_CLIENT_SSL`                         |
| `Azure_MYSQL_USERNAME`              | Database Username  | `<MySQL-DB-username>`                      |
| `Azure_MYSQL_PASSWORD`              | Database password  | `<MySQL-DB-password>`                      |


#### PHP (MySQLi) Service principal

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `Azure_MYSQL_DBNAME`                | Database name      | `<MySQL-DB-name>`                          |
| `Azure_MYSQL_HOST`                  | Database Host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `Azure_MYSQL_PORT`                  | Port number        | `3306`                                     |
| `Azure_MYSQL_FLAG`                  | SSL or other flags | `MySQL_CLIENT_SSL`                         |
| `Azure_MYSQL_USERNAME`              | Database Username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `Azure_MYSQL_CLIENTID`              | Your client ID     | `<client-ID>`                              |
| `Azure_MYSQL_CLIENTSECRET`          | Your client secret | `<client-secret>`                          |
| `Azure_MYSQL_TENANTID`              | Your tenant ID     | `<tenant-ID>`                              |


### Ruby (mysql2)

#### Ruby (mysql2) System-assigned managed identity

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `Azure_MYSQL_DATABASE`              | Database name     | `<MySQL-DB-name>`                          |
| `Azure_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `Azure_MYSQL_USERNAME`              | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `Azure_MYSQL_SSLMODE`               | SSL option        | `required`                                 |

#### Ruby (mysql2) User-assigned managed identity

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `Azure_MYSQL_DATABASE`              | Database name     | `<MySQL-DB-name>`                          |
| `Azure_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `Azure_MYSQL_USERNAME`              | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `Azure_MYSQL_SSLMODE`               | SSL option        | `required`                                 |
| `Azure_MYSQL_CLIENTID`              | Your client ID    | `<identity-client-ID>`                     |


#### Ruby (mysql2) secret / connection string

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `Azure_MYSQL_DATABASE`              | Database name     | `<MySQL-DB-name>`                          |
| `Azure_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `Azure_MYSQL_USERNAME`              | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `Azure_MYSQL_PASSWORD`              | Database password | `<MySQL-DB-password>`                      |
| `Azure_MYSQL_SSLMODE`               | SSL option        | `required`                                 |

#### Ruby (mysql2) Service principal

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `Azure_MYSQL_DATABASE`              | Database name     | `<MySQL-DB-name>`                          |
| `Azure_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `Azure_MYSQL_USERNAME`              | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `Azure_MYSQL_SSLMODE`               | SSL option        | `required`                                 |
| `Azure_MYSQL_CLIENTID`              | Your client ID    | `<client-ID>`                              |
| `Azure_MYSQL_CLIENTSECRET`          | Your client secret| `<client-secret>`                          |
| `Azure_MYSQL_TENANTID`              | Your tenant ID    | `<tenant-ID>`                              |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)