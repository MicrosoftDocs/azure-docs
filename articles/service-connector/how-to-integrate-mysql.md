---
title: Integrate Azure Database for MySQL with Service Connector
description: Integrate Azure Database for MySQL into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 10/20/2023
ms.custom: event-tier1-build-2022, engagement-fy23
---

# Integrate Azure Database for MySQL with Service Connector

This page shows supported authentication methods and clients, and shows sample code you can use to connect Azure Database for MySQL - Flexible Server to other cloud services using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection.

[!INCLUDE [Azure-database-for-mysql-single-server-deprecation](../mysql/includes/azure-database-for-mysql-single-server-deprecation.md)]

## Supported compute service

- Azure App Service. You can get the configurations from Azure App Service configurations.
- Azure Container Apps. You can get the configurations from Azure Container Apps environment variables.
- Azure Spring Apps. You can get the configurations from Azure Spring Apps runtime.

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

## Default environment variable names or application properties and sample code

Reference the connection details and sample code in following tables, according to your connection's authentication type and client type, to connect compute services to Azure Database for MySQL. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### System-assigned Managed Identity

#### [.NET](#tab/dotnet)

| Default environment variable name | Description                     | Example value                                                                                                                                                  |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CONNECTIONSTRING `     | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;User Id=<MySQL-DBusername>;SSL Mode=Required;` |



#### [Java](#tab/java)

| Default environment variable name | Description                  | Example value                                                                                                          |
|-----------------------------------|------------------------------|------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CONNECTIONSTRING`      | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>` |



#### [SpringBoot](#tab/springBoot)

| Application properties                   | Description                           | Example value                                                                                 |
|------------------------------------------|---------------------------------------|-----------------------------------------------------------------------------------------------|
| `spring.datasource.azure.passwordless-enabled` | Enable passwordless authentication    | `true` |
| `spring.datasource.url`                  | Spring Boot JDBC database URL         | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required` |
| `spring.datasource.username`             | Database username        | `<MySQL-DB-username>`  |


#### [Python](#tab/python)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST `                 | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database username | `<MySQL-DB-username>@<MySQL-DB-name>`      |


#### [Django](#tab/django)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database username | `<MySQL-DB-username>@<MySQL-DB-name>`      |


#### [Go](#tab/go)

| Default environment variable name | Description                     | Example value                                                                                                |
|-----------------------------------|---------------------------------|--------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CONNECTIONSTRING`      | Go-sql-driver connection string | `<MySQL-DB-username>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |


#### [NodeJS](#tab/nodejs)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_HOST`                  | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database username | `MySQL-DB-username`                        |
| `AZURE_MYSQL_DATABASE`              | Database name     | `<database-name>`                          |
| `AZURE_MYSQL_PORT`                  | Port number       | `3306`                                     |
| `AZURE_MYSQL_SSL`                   | SSL option        | `true`                                     |


#### [PHP](#tab/php)

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `AZURE_MYSQL_DBNAME`                | Database name      | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_PORT`                  | Port number        | `3306`                                     |
| `AZURE_MYSQL_FLAG`                  | SSL or other flags | `MySQL_CLIENT_SSL`                         |
| `AZURE_MYSQL_USERNAME`              | Database username  | `<MySQL-DB-username>`                      |

#### [Ruby](#tab/ruby)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_DATABASE`              | Database name     | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USERNAME`              | Database username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_SSLMODE`               | SSL option        | `required`                                 |


---

#### Sample code

Refer to the steps and code below to connect to Azure Database for MySQL using a system-assigned managed identity.
[!INCLUDE [code sample for mysql system mi](./includes/code-mysql-me-id.md)]

### User-assigned Managed Identity
#### [.NET](#tab/dotnet)

| Default environment variable name | Description                     | Example value                                                                                                                                                  |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CLIENTID`              | Your client ID                  | `<identity-client-ID>` |
| `AZURE_MYSQL_CONNECTIONSTRING`     | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;User Id=<MySQL-DBusername>;SSL Mode=Required;` |


#### [Java](#tab/java)

| Default environment variable name | Description                  | Example value                                                                                                          |
|-----------------------------------|------------------------------|------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CLIENTID`              | Your client ID               | `<identity-client-ID>` |
| `AZURE_MYSQL_CONNECTIONSTRING`      | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>` |



#### [SpringBoot](#tab/springBoot)

| Application properties                                          | Description                       | Example value                                                                                                 |
|-----------------------------------------------------------------|-----------------------------------|---------------------------------------------------------------------------------------------------------------|
| `spring.datasource.azure.passwordless-enabled`                        | Enable passwordless authentication| `true` |
| `spring.cloud.azure.credential.client-id`                       | Your client ID                    | `<identity-client-ID>` |
| `spring.cloud.azure.credential.client-managed-identity-enabled` | Enable client managed identity    | `true` |
| `spring.datasource.url`                                         | Database URL                      | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required`                 |
| `spring.datasource.username`                                    | Database username                 | `username` |


#### [Python](#tab/python)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`              | Your client ID    | `identity-client-ID`                       |

#### [Django](#tab/django)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER `                 | Database username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`              | Your client ID    | `<identity-client-ID>`                     |


#### [Go](#tab/go)

| Default environment variable name | Description                     | Example value                                                                                                |
|-----------------------------------|---------------------------------|--------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CLIENTID`              | Your client ID               | `<identity-client-ID>` |
| `AZURE_MYSQL_CONNECTIONSTRING`      | Go-sql-driver connection string | `<MySQL-DB-username>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |



#### [NodeJS](#tab/nodejs)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_HOST`                  | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database username | `MySQL-DB-username`                        |
| `AZURE_MYSQL_DATABASE`              | Database name     | `<database-name>`                          |
| `AZURE_MYSQL_PORT`                  | Port number       | `3306`                                     |
| `AZURE_MYSQL_SSL`                   | SSL option        | `true`                                     |
| `AZURE_MYSQL_CLIENTID`              | Your client ID    | `<identity-client-ID>`                     |


#### [PHP](#tab/php)

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `AZURE_MYSQL_DBNAME`                | Database name      | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_PORT`                  | Port number        | `3306`                                     |
| `AZURE_MYSQL_FLAG`                  | SSL or other flags | `MySQL_CLIENT_SSL`                         |
| `AZURE_MYSQL_USERNAME`              | Database username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`              | Your client ID     | `<identity-client-ID>`                     |

#### [Ruby](#tab/ruby)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_DATABASE`              | Database name     | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USERNAME`              | Database username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_SSLMODE`               | SSL option        | `required`                                 |
| `AZURE_MYSQL_CLIENTID`              | Your client ID    | `<identity-client-ID>`                     |

---

#### Sample code

Refer to the steps and code below to connect to Azure Database for MySQL using a user-assigned managed identity.
[!INCLUDE [code sample for mysql system mi](./includes/code-mysql-me-id.md)]

### Connection String

#### [.NET](#tab/dotnet)

| Default environment variable name | Description                     | Example value                                                                                                                                                  |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CONNECTIONSTRING`      | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;User Id=<MySQL-DBusername>;Password=<MySQL-DB-password>;SSL Mode=Required` |

#### [Java](#tab/java)

| Default environment variable name | Description                  | Example value                                                                                                                                                              |
|-----------------------------------|------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CONNECTIONSTRING`      | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>&password=<Uri.EscapeDataString(<MySQL-DB-password>)` |


#### [SpringBoot](#tab/springBoot)

| Application properties       | Description                   | Example value                                                                                 |
|------------------------------|-------------------------------|-----------------------------------------------------------------------------------------------|
| `spring.datasource.url`      | Spring Boot JDBC database URL | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required` |
| `spring.datasource.username` | Database username             | `<MySQL-DB-username>`  |
| `spring.datasource.password` | Database password             | `MySQL-DB-password`    |

After created a `springboot` client type connection, Service Connector service will automatically add properties `spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password`. So Spring boot application could add beans automatically.



#### [Python](#tab/python)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_PASSWORD`              | Database password | `MySQL-DB-password`                        |


#### [Django](#tab/django)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_PASSWORD`              | Database password | `MySQL-DB-password`                        |

#### [Go](#tab/go)

| Default environment variable name | Description                     | Example value                                                                                                |
|-----------------------------------|---------------------------------|--------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CONNECTIONSTRING`      | Go-sql-driver connection string | `<MySQL-DB-username>:<MySQL-DB-password>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |


#### [NodeJS](#tab/nodejs)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_HOST`                  | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database username | `MySQL-DB-username`                        |
| `AZURE_MYSQL_PASSWORD`              | Database password | `MySQL-DB-password`                        |
| `AZURE_MYSQL_DATABASE`              | Database name     | `<database-name>`                          |
| `AZURE_MYSQL_PORT`                  | Port number       | `3306`                                     |
| `AZURE_MYSQL_SSL`                   | SSL option        | `true`                                     |


#### [PHP](#tab/php)

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `AZURE_MYSQL_DBNAME`                | Database name      | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_PORT`                  | Port number        | `3306`                                     |
| `AZURE_MYSQL_FLAG`                  | SSL or other flags | `MySQL_CLIENT_SSL`                         |
| `AZURE_MYSQL_USERNAME`              | Database username  | `<MySQL-DB-username>`                      |
| `AZURE_MYSQL_PASSWORD`              | Database password  | `<MySQL-DB-password>`                      |



#### [Ruby](#tab/ruby)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_DATABASE`              | Database name     | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USERNAME`              | Database username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_PASSWORD`              | Database password | `<MySQL-DB-password>`                      |
| `AZURE_MYSQL_SSLMODE`               | SSL option        | `required`                                 |

---

#### Sample code

Refer to the steps and code below to connect to Azure Database for MySQL using a connection string.
[!INCLUDE [code sample for mysql secrets](./includes/code-mysql-secret.md)]

### Service Principal

#### [.NET](#tab/dotnet)

| Default environment variable name | Description                     | Example value                                                                                                                                                  |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CLIENTID`              | Your client ID                  | `<client-ID>`     |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret              | `<client-secret>` |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID                  | `<tenant-ID>`     |
| `AZURE_MYSQL_CONNECTIONSTRING`      | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;User Id=<MySQL-DBusername>;SSL Mode=Required` |


#### [Java](#tab/java)

| Default environment variable name   | Description                  | Example value                                           |
|-------------------------------------|------------------------------|---------------------------------------------------------|
| `AZURE_MYSQL_CLIENTID`              | Your client ID               | `<client-ID>`                                           |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret           | `<client-secret>`                                       |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID               | `<tenant-ID>`                                           |
| `AZURE_MYSQL_CONNECTIONSTRING`      | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>` |


#### [SpringBoot](#tab/springBoot)

| Application properties                                          | Description                       | Example value                                                                                                 |
|-----------------------------------------------------------------|-----------------------------------|---------------------------------------------------------------------------------------------------------------|
| `spring.datasource.azure.passwordless-enabled`                  | Enable passwordless authentication| `true`            |
| `spring.cloud.azure.credential.client-id`                       | Your client ID                    | `<client-ID>`     |
| `spring.cloud.azure.credential.client-secret`                   | Your client secret                | `<client-secret>` |
| `spring.cloud.azure.credential.tenant-id`                       | Your tenant ID                    | `<tenant-ID>`     |
| `spring.datasource.url`                                         | Database URL                      | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required`                 |
| `spring.datasource.username`                                    | Database username                 | `username`        |


#### [Python](#tab/python)

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name      | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`              | Your client ID     | `<client-ID>`                              |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret | `<client-secret>`                          |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID     | `<tenant-ID>`                              |


#### [Django](#tab/django)

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name      | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER `                 | Database username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`              | Your client ID     | `<client-ID>`                              |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret | `<client-secret>`                          |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID     | `<tenant-ID>`                              |


#### [Go](#tab/go)

| Default environment variable name | Description                     | Example value                                                                                                |
|-----------------------------------|---------------------------------|--------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CLIENTID`              | Your client ID                  |`<client-ID>`      |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret              | `<client-secret>` |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID                  | `<tenant-ID>` 
| `AZURE_MYSQL_CONNECTIONSTRING`      | Go-sql-driver connection string | `<MySQL-DB-username>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |


#### [NodeJS](#tab/nodejs)

| Default environment variable name   | Description           | Example value                                          |
|-------------------------------------|-----------------------|--------------------------------------------------------|
| `AZURE_MYSQL_HOST `                 | Database host URL     | `<MySQL-DB-name>.mysql.database.azure.com`             |
| `AZURE_MYSQL_USER`                  | Database username     | `MySQL-DB-username`                                    |
| `AZURE_MYSQL_DATABASE`              | Database name         | `<database-name>`                                      |
| `AZURE_MYSQL_PORT `                 | Port number           | `3306`                                                 |
| `AZURE_MYSQL_SSL`                   | SSL option            | `true`                                                 |
| `AZURE_MYSQL_CLIENTID`              | Your client ID        | `<client-ID>`                                          |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret    | `<client-secret>`                                      |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID        | `<tenant-ID>`                                          |


#### [PHP](#tab/php)

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `AZURE_MYSQL_DBNAME`                | Database name      | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_PORT`                  | Port number        | `3306`                                     |
| `AZURE_MYSQL_FLAG`                  | SSL or other flags | `MySQL_CLIENT_SSL`                         |
| `AZURE_MYSQL_USERNAME`              | Database username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`              | Your client ID     | `<client-ID>`                              |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret | `<client-secret>`                          |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID     | `<tenant-ID>`                              |

#### [Ruby](#tab/ruby)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_DATABASE`              | Database name     | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USERNAME`              | Database username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_SSLMODE`               | SSL option        | `required`                                 |
| `AZURE_MYSQL_CLIENTID`              | Your client ID    | `<client-ID>`                              |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret| `<client-secret>`                          |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID    | `<tenant-ID>`                              |

---

#### Sample code

Refer to the steps and code below to connect to Azure Database for MySQL using a service principal.
[!INCLUDE [code sample for mysql system mi](./includes/code-mysql-me-id.md)]

## Next steps

Follow the documentations to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)