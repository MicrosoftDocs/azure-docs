---
title: Integrate Azure Database for MySQL with Service Connector
description: Integrate Azure Database for MySQL into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.custom: engagement-fy23
ms.date: 02/02/2024
---

# Integrate Azure Database for MySQL with Service Connector

This page shows supported authentication methods and clients, and shows sample code you can use to connect Azure Database for MySQL - Flexible Server to other cloud services using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection.

[!INCLUDE [Azure-database-for-mysql-single-server-deprecation](../mysql/includes/azure-database-for-mysql-single-server-deprecation.md)]

## Supported compute services

Service Connector can be used to connect the following compute services to Azure Database for MySQL:

- Azure App Service
- Azure Functions
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

The table below shows which combinations of authentication methods and clients are supported for connecting your compute service to Azure Database for MySQL using Service Connector. A “Yes” indicates that the combination is supported, while a “No” indicates that it is not supported.

| Client type                     | System-assigned managed identity | User-assigned managed identity | Secret/connection string | Service principal |
|---------------------------------|:--------------------------------:|:------------------------------:|:------------------------:|:-----------------:|
| .NET                            |                Yes               |               Yes              |            Yes           |        Yes        |
| Go (go-sql-driver for mysql)    |                Yes               |               Yes              |            Yes           |        Yes        |
| Java (JDBC)                     |                Yes               |               Yes              |            Yes           |        Yes        |
| Java - Spring Boot (JDBC)       |                Yes               |               Yes              |            Yes           |        Yes        |
| Node.js (mysql)                 |                Yes               |               Yes              |            Yes           |        Yes        |
| Python (mysql-connector-python) |                Yes               |               Yes              |            Yes           |        Yes        |
| Python-Django                   |                Yes               |               Yes              |            Yes           |        Yes        |
| PHP (MySQLi)                    |                Yes               |               Yes              |            Yes           |        Yes        |
| Ruby (mysql2)                   |                Yes               |               Yes              |            Yes           |        Yes        |
| None                            |                Yes               |               Yes              |            Yes           |        Yes        |

This table indicates that all combinations of client types and authentication methods in the table are supported. All client types can use any of the authentication methods to connect to Azure Database for MySQL using Service Connector.

> [!NOTE]
> System-assigned managed identity, User-assigned managed identity and Service principal are only supported on Azure CLI.

## Default environment variable names or application properties and sample code

Reference the connection details and sample code in following tables, according to your connection's authentication type and client type, to connect compute services to Azure Database for MySQL. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### System-assigned Managed Identity

#### [.NET](#tab/dotnet)

| Default environment variable name | Description                     | Example value                                                                                                                        |
| --------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `AZURE_MYSQL_CONNECTIONSTRING ` | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;User Id=<MySQL-DBusername>;SSL Mode=Required;` |

#### [Java](#tab/java)

| Default environment variable name | Description                  | Example value                                                                                                            |
| --------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `AZURE_MYSQL_CONNECTIONSTRING`  | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>` |

#### [SpringBoot](#tab/springBoot)

| Application properties                           | Description                        | Example value                                                                                   |
| ------------------------------------------------ | ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| `spring.datasource.azure.passwordless-enabled` | Enable passwordless authentication | `true`                                                                                        |
| `spring.datasource.url`                        | Spring Boot JDBC database URL      | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required` |
| `spring.datasource.username`                   | Database username                  | `<MySQL-DB-username>`                                                                         |

#### [Python](#tab/python)

| Default environment variable name | Description       | Example value                                |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `AZURE_MYSQL_NAME`              | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST `             | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`              | Database username | `<MySQL-DB-username>@<MySQL-DB-name>`      |

#### [Django](#tab/django)

| Default environment variable name | Description       | Example value                                |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `AZURE_MYSQL_NAME`              | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`              | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`              | Database username | `<MySQL-DB-username>@<MySQL-DB-name>`      |

#### [Go](#tab/go)

| Default environment variable name | Description                     | Example value                                                              |
| --------------------------------- | ------------------------------- | -------------------------------------------------------------------------- |
| `AZURE_MYSQL_CONNECTIONSTRING`  | Go-sql-driver connection string | `<MySQL-DB-username>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |

#### [NodeJS](#tab/nodejs)

| Default environment variable name | Description       | Example value                                |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `AZURE_MYSQL_HOST`              | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`              | Database username | `MySQL-DB-username`                        |
| `AZURE_MYSQL_DATABASE`          | Database name     | `<database-name>`                          |
| `AZURE_MYSQL_PORT`              | Port number       | `3306`                                     |
| `AZURE_MYSQL_SSL`               | SSL option        | `true`                                     |

#### [PHP](#tab/php)

| Default environment variable name | Description        | Example value                                |
| --------------------------------- | ------------------ | -------------------------------------------- |
| `AZURE_MYSQL_DBNAME`            | Database name      | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`              | Database host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_PORT`              | Port number        | `3306`                                     |
| `AZURE_MYSQL_FLAG`              | SSL or other flags | `MySQL_CLIENT_SSL`                         |
| `AZURE_MYSQL_USERNAME`          | Database username  | `<MySQL-DB-username>`                      |

#### [Ruby](#tab/ruby)

| Default environment variable name | Description       | Example value                                |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `AZURE_MYSQL_DATABASE`          | Database name     | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`              | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USERNAME`          | Database username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_SSLMODE`           | SSL option        | `required`                                 |

#### [Other](#tab/none)
| Default environment variable name | Description       | Example value                                |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `AZURE_MYSQL_HOST`              | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USERNAME`              | Database username | `MySQL-DB-username`                        |
| `AZURE_MYSQL_DATABASE`          | Database name     | `<database-name>`                          |
| `AZURE_MYSQL_PORT`              | Port number       | `3306`                                     |
| `AZURE_MYSQL_SSL`               | SSL option        | `true`                                     |

---

#### Sample code

Refer to the steps and code below to connect to Azure Database for MySQL using a system-assigned managed identity.
[!INCLUDE [code sample for mysql system mi](./includes/code-mysql-me-id.md)]

### User-assigned Managed Identity

#### [.NET](#tab/dotnet)

| Default environment variable name | Description                     | Example value                                                                                                                        |
| --------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `AZURE_MYSQL_CLIENTID`          | Your client ID                  | `<identity-client-ID>`                                                                                                             |
| `AZURE_MYSQL_CONNECTIONSTRING`  | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;User Id=<MySQL-DBusername>;SSL Mode=Required;` |

#### [Java](#tab/java)

| Default environment variable name | Description                  | Example value                                                                                                            |
| --------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `AZURE_MYSQL_CLIENTID`          | Your client ID               | `<identity-client-ID>`                                                                                                 |
| `AZURE_MYSQL_CONNECTIONSTRING`  | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>` |

#### [SpringBoot](#tab/springBoot)

| Application properties                                            | Description                        | Example value                                                                                   |
| ----------------------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| `spring.datasource.azure.passwordless-enabled`                  | Enable passwordless authentication | `true`                                                                                        |
| `spring.cloud.azure.credential.client-id`                       | Your client ID                     | `<identity-client-ID>`                                                                        |
| `spring.cloud.azure.credential.client-managed-identity-enabled` | Enable client managed identity     | `true`                                                                                        |
| `spring.datasource.url`                                         | Database URL                       | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required` |
| `spring.datasource.username`                                    | Database username                  | `username`                                                                                    |

#### [Python](#tab/python)

| Default environment variable name | Description       | Example value                                |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `AZURE_MYSQL_NAME`              | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`              | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`              | Database username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`          | Your client ID    | `identity-client-ID`                       |

#### [Django](#tab/django)

| Default environment variable name | Description       | Example value                                |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `AZURE_MYSQL_NAME`              | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`              | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER `             | Database username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`          | Your client ID    | `<identity-client-ID>`                     |

#### [Go](#tab/go)

| Default environment variable name | Description                     | Example value                                                              |
| --------------------------------- | ------------------------------- | -------------------------------------------------------------------------- |
| `AZURE_MYSQL_CLIENTID`          | Your client ID                  | `<identity-client-ID>`                                                   |
| `AZURE_MYSQL_CONNECTIONSTRING`  | Go-sql-driver connection string | `<MySQL-DB-username>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |

#### [NodeJS](#tab/nodejs)

| Default environment variable name | Description       | Example value                                |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `AZURE_MYSQL_HOST`              | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`              | Database username | `MySQL-DB-username`                        |
| `AZURE_MYSQL_DATABASE`          | Database name     | `<database-name>`                          |
| `AZURE_MYSQL_PORT`              | Port number       | `3306`                                     |
| `AZURE_MYSQL_SSL`               | SSL option        | `true`                                     |
| `AZURE_MYSQL_CLIENTID`          | Your client ID    | `<identity-client-ID>`                     |

#### [PHP](#tab/php)

| Default environment variable name | Description        | Example value                                |
| --------------------------------- | ------------------ | -------------------------------------------- |
| `AZURE_MYSQL_DBNAME`            | Database name      | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`              | Database host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_PORT`              | Port number        | `3306`                                     |
| `AZURE_MYSQL_FLAG`              | SSL or other flags | `MySQL_CLIENT_SSL`                         |
| `AZURE_MYSQL_USERNAME`          | Database username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`          | Your client ID     | `<identity-client-ID>`                     |

#### [Ruby](#tab/ruby)

| Default environment variable name | Description       | Example value                                |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `AZURE_MYSQL_DATABASE`          | Database name     | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`              | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USERNAME`          | Database username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_SSLMODE`           | SSL option        | `required`                                 |
| `AZURE_MYSQL_CLIENTID`          | Your client ID    | `<identity-client-ID>`                     |

#### [Other](#tab/none)
| Default environment variable name | Description       | Example value                                |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `AZURE_MYSQL_HOST`              | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USERNAME`              | Database username | `MySQL-DB-username`                        |
| `AZURE_MYSQL_DATABASE`          | Database name     | `<database-name>`                          |
| `AZURE_MYSQL_PORT`              | Port number       | `3306`                                     |
| `AZURE_MYSQL_SSL`               | SSL option        | `true`                                     |
| `AZURE_MYSQL_CLIENTID`          | Your client ID     | `<identity-client-ID>`                     |

---

#### Sample code

Refer to the steps and code below to connect to Azure Database for MySQL using a user-assigned managed identity.
[!INCLUDE [code sample for mysql system mi](./includes/code-mysql-me-id.md)]

### Connection String

#### [.NET](#tab/dotnet)

| Default environment variable name | Description                     | Example value                                                                                                                                                    |
| --------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AZURE_MYSQL_CONNECTIONSTRING`  | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;User Id=<MySQL-DBusername>;Password=<MySQL-DB-password>;SSL Mode=Required` |

#### [Java](#tab/java)

| Default environment variable name | Description                  | Example value                                                                                                                                                                |
| --------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AZURE_MYSQL_CONNECTIONSTRING`  | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>&password=<Uri.EscapeDataString(<MySQL-DB-password>)` |

#### [SpringBoot](#tab/springBoot)

| Application properties         | Description                   | Example value                                                                                   |
| ------------------------------ | ----------------------------- | ----------------------------------------------------------------------------------------------- |
| `spring.datasource.url`      | Spring Boot JDBC database URL | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required` |
| `spring.datasource.username` | Database username             | `<MySQL-DB-username>`                                                                         |
| `spring.datasource.password` | Database password             | `MySQL-DB-password`                                                                           |

After created a `springboot` client type connection, Service Connector service will automatically add properties `spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password`. So Spring boot application could add beans automatically.

#### [Python](#tab/python)

| Default environment variable name | Description       | Example value                                |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `AZURE_MYSQL_NAME`              | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`              | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`              | Database username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_PASSWORD`          | Database password | `MySQL-DB-password`                        |

#### [Django](#tab/django)

| Default environment variable name | Description       | Example value                                |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `AZURE_MYSQL_NAME`              | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`              | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`              | Database username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_PASSWORD`          | Database password | `MySQL-DB-password`                        |

#### [Go](#tab/go)

| Default environment variable name | Description                     | Example value                                                                                  |
| --------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------- |
| `AZURE_MYSQL_CONNECTIONSTRING`  | Go-sql-driver connection string | `<MySQL-DB-username>:<MySQL-DB-password>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |

#### [NodeJS](#tab/nodejs)

| Default environment variable name | Description       | Example value                                |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `AZURE_MYSQL_HOST`              | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`              | Database username | `MySQL-DB-username`                        |
| `AZURE_MYSQL_PASSWORD`          | Database password | `MySQL-DB-password`                        |
| `AZURE_MYSQL_DATABASE`          | Database name     | `<database-name>`                          |
| `AZURE_MYSQL_PORT`              | Port number       | `3306`                                     |
| `AZURE_MYSQL_SSL`               | SSL option        | `true`                                     |

#### [PHP](#tab/php)

| Default environment variable name | Description        | Example value                                |
| --------------------------------- | ------------------ | -------------------------------------------- |
| `AZURE_MYSQL_DBNAME`            | Database name      | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`              | Database host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_PORT`              | Port number        | `3306`                                     |
| `AZURE_MYSQL_FLAG`              | SSL or other flags | `MySQL_CLIENT_SSL`                         |
| `AZURE_MYSQL_USERNAME`          | Database username  | `<MySQL-DB-username>`                      |
| `AZURE_MYSQL_PASSWORD`          | Database password  | `<MySQL-DB-password>`                      |

#### [Ruby](#tab/ruby)

| Default environment variable name | Description       | Example value                                |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `AZURE_MYSQL_DATABASE`          | Database name     | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`              | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USERNAME`          | Database username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_PASSWORD`          | Database password | `<MySQL-DB-password>`                      |
| `AZURE_MYSQL_SSLMODE`           | SSL option        | `required`                                 |

#### [Other](#tab/none)
| Default environment variable name | Description       | Example value                                |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `AZURE_MYSQL_HOST`              | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USERNAME`          | Database username | `MySQL-DB-username`                        |
| `AZURE_MYSQL_PASSWORD`          | Database password | `MySQL-DB-password`                        |
| `AZURE_MYSQL_DATABASE`          | Database name     | `<database-name>`                          |
| `AZURE_MYSQL_PORT`              | Port number       | `3306`                                     |
| `AZURE_MYSQL_SSL`               | SSL option        | `true`                                     |

---

#### Sample code

Refer to the steps and code below to connect to Azure Database for MySQL using a connection string.
[!INCLUDE [code sample for mysql secrets](./includes/code-mysql-secret.md)]

### Service Principal

#### [.NET](#tab/dotnet)

| Default environment variable name | Description                     | Example value                                                                                                                       |
| --------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `AZURE_MYSQL_CLIENTID`          | Your client ID                  | `<client-ID>`                                                                                                                     |
| `AZURE_MYSQL_CLIENTSECRET`      | Your client secret              | `<client-secret>`                                                                                                                 |
| `AZURE_MYSQL_TENANTID`          | Your tenant ID                  | `<tenant-ID>`                                                                                                                     |
| `AZURE_MYSQL_CONNECTIONSTRING`  | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;User Id=<MySQL-DBusername>;SSL Mode=Required` |

#### [Java](#tab/java)

| Default environment variable name | Description                  | Example value                                                                                                            |
| --------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `AZURE_MYSQL_CLIENTID`          | Your client ID               | `<client-ID>`                                                                                                          |
| `AZURE_MYSQL_CLIENTSECRET`      | Your client secret           | `<client-secret>`                                                                                                      |
| `AZURE_MYSQL_TENANTID`          | Your tenant ID               | `<tenant-ID>`                                                                                                          |
| `AZURE_MYSQL_CONNECTIONSTRING`  | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>` |

#### [SpringBoot](#tab/springBoot)

| Application properties                           | Description                        | Example value                                                                                   |
| ------------------------------------------------ | ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| `spring.datasource.azure.passwordless-enabled` | Enable passwordless authentication | `true`                                                                                        |
| `spring.cloud.azure.credential.client-id`      | Your client ID                     | `<client-ID>`                                                                                 |
| `spring.cloud.azure.credential.client-secret`  | Your client secret                 | `<client-secret>`                                                                             |
| `spring.cloud.azure.credential.tenant-id`      | Your tenant ID                     | `<tenant-ID>`                                                                                 |
| `spring.datasource.url`                        | Database URL                       | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required` |
| `spring.datasource.username`                   | Database username                  | `username`                                                                                    |

#### [Python](#tab/python)

| Default environment variable name | Description        | Example value                                |
| --------------------------------- | ------------------ | -------------------------------------------- |
| `AZURE_MYSQL_NAME`              | Database name      | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`              | Database host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`              | Database username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`          | Your client ID     | `<client-ID>`                              |
| `AZURE_MYSQL_CLIENTSECRET`      | Your client secret | `<client-secret>`                          |
| `AZURE_MYSQL_TENANTID`          | Your tenant ID     | `<tenant-ID>`                              |

#### [Django](#tab/django)

| Default environment variable name | Description        | Example value                                |
| --------------------------------- | ------------------ | -------------------------------------------- |
| `AZURE_MYSQL_NAME`              | Database name      | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`              | Database host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`             | Database username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`          | Your client ID     | `<client-ID>`                              |
| `AZURE_MYSQL_CLIENTSECRET`      | Your client secret | `<client-secret>`                          |
| `AZURE_MYSQL_TENANTID`          | Your tenant ID     | `<tenant-ID>`                              |

#### [Go](#tab/go)

| Default environment variable name | Description                     | Example value                                                              |
| --------------------------------- | ------------------------------- | -------------------------------------------------------------------------- |
| `AZURE_MYSQL_CLIENTID`          | Your client ID                  | `<client-ID>`                                                            |
| `AZURE_MYSQL_CLIENTSECRET`      | Your client secret              | `<client-secret>`                                                        |
| `AZURE_MYSQL_TENANTID`          | Your tenant ID                  | `<tenant-ID>`                                                            |
| `AZURE_MYSQL_CONNECTIONSTRING`  | Go-sql-driver connection string | `<MySQL-DB-username>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |

#### [NodeJS](#tab/nodejs)

| Default environment variable name | Description        | Example value                                |
| --------------------------------- | ------------------ | -------------------------------------------- |
| `AZURE_MYSQL_HOST`             | Database host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`              | Database username  | `MySQL-DB-username`                        |
| `AZURE_MYSQL_DATABASE`          | Database name      | `<database-name>`                          |
| `AZURE_MYSQL_PORT`             | Port number        | `3306`                                     |
| `AZURE_MYSQL_SSL`               | SSL option         | `true`                                     |
| `AZURE_MYSQL_CLIENTID`          | Your client ID     | `<client-ID>`                              |
| `AZURE_MYSQL_CLIENTSECRET`      | Your client secret | `<client-secret>`                          |
| `AZURE_MYSQL_TENANTID`          | Your tenant ID     | `<tenant-ID>`                              |

#### [PHP](#tab/php)

| Default environment variable name | Description        | Example value                                |
| --------------------------------- | ------------------ | -------------------------------------------- |
| `AZURE_MYSQL_DBNAME`            | Database name      | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`              | Database host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_PORT`              | Port number        | `3306`                                     |
| `AZURE_MYSQL_FLAG`              | SSL or other flags | `MySQL_CLIENT_SSL`                         |
| `AZURE_MYSQL_USERNAME`          | Database username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`          | Your client ID     | `<client-ID>`                              |
| `AZURE_MYSQL_CLIENTSECRET`      | Your client secret | `<client-secret>`                          |
| `AZURE_MYSQL_TENANTID`          | Your tenant ID     | `<tenant-ID>`                              |

#### [Ruby](#tab/ruby)

| Default environment variable name | Description        | Example value                                |
| --------------------------------- | ------------------ | -------------------------------------------- |
| `AZURE_MYSQL_DATABASE`          | Database name      | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`              | Database host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USERNAME`          | Database username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_SSLMODE`           | SSL option         | `required`                                 |
| `AZURE_MYSQL_CLIENTID`          | Your client ID     | `<client-ID>`                              |
| `AZURE_MYSQL_CLIENTSECRET`      | Your client secret | `<client-secret>`                          |
| `AZURE_MYSQL_TENANTID`          | Your tenant ID     | `<tenant-ID>`                              |

#### [Other](#tab/none)
| Default environment variable name | Description       | Example value                                |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `AZURE_MYSQL_HOST`              | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USERNAME`              | Database username | `MySQL-DB-username`                        |
| `AZURE_MYSQL_DATABASE`          | Database name     | `<database-name>`                          |
| `AZURE_MYSQL_PORT`              | Port number       | `3306`                                     |
| `AZURE_MYSQL_SSL`               | SSL option        | `true`                                     |
| `AZURE_MYSQL_CLIENTID`          | Your client ID     | `<identity-client-ID>`                     |
| `AZURE_MYSQL_CLIENTSECRET`      | Your client secret | `<client-secret>`                          |
| `AZURE_MYSQL_TENANTID`          | Your tenant ID     | `<tenant-ID>`                              |

---

#### Sample code

Refer to the steps and code below to connect to Azure Database for MySQL using a service principal.
[!INCLUDE [code sample for mysql system mi](./includes/code-mysql-me-id.md)]

## Next steps

Follow the documentations to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
