---
title: Integrate Azure Database for PostgreSQL with Service Connector
description: Integrate Azure Database for PostgreSQL into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.custom: engagement-fy23
ms.date: 02/02/2024
---

# Integrate Azure Database for PostgreSQL with Service Connector

This page shows supported authentication methods and clients, and shows sample code you can use to connect Azure Database for PostgreSQL to other cloud services using Service Connector. You might still be able to connect to Azure Database for PostgreSQL in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection.

## Supported compute services

Service Connector can be used to connect the following compute services to Azure Database for PostgreSQL:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Spring Apps

## Supported authentication types and client types

The table below shows which combinations of authentication methods and clients are supported for connecting your compute service to Azure Database for PostgreSQL using Service Connector. A “Yes” indicates that the combination is supported, while a “No” indicates that it is not supported.

| Client type               | System-assigned managed identity | User-assigned managed identity | Secret/connection string | Service principal |
|---------------------------|:--------------------------------:|:------------------------------:|:------------------------:|:-----------------:|
| .NET                      |                Yes               |               Yes              |            Yes           |        Yes        |
| Go (pg)                   |                Yes               |               Yes              |            Yes           |        Yes        |
| Java (JDBC)               |                Yes               |               Yes              |            Yes           |        Yes        |
| Java - Spring Boot (JDBC) |                Yes               |               Yes              |            Yes           |        Yes        |
| Node.js (pg)              |                Yes               |               Yes              |            Yes           |        Yes        |
| PHP (native)              |                Yes               |               Yes              |            Yes           |        Yes        |
| Python (psycopg2)         |                Yes               |               Yes              |            Yes           |        Yes        |
| Python-Django             |                Yes               |               Yes              |            Yes           |        Yes        |
| Ruby (ruby-pg)            |                Yes               |               Yes              |            Yes           |        Yes        |
| None                      |                Yes               |               Yes              |            Yes           |        Yes        |

This table indicates that all combinations of client types and authentication methods in the table are supported. All client types can use any of the authentication methods to connect to Azure Database for PostgreSQL using Service Connector.

> [!NOTE]
> System-assigned managed identity, User-assigned managed identity and Service principal are only supported on Azure CLI.

## Default environment variable names or application properties and sample code

Reference the connection details and sample code in the following tables, according to your connection's authentication type and client type, to connect compute services to Azure Database for PostgreSQL. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### System-assigned Managed Identity

#### [.NET](#tab/dotnet)

| Default environment variable name     | Description                       | Example value                                                                                                                           |
| ------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | .NET PostgreSQL connection string | `Server=<PostgreSQL-server-name>.postgres.database.azure.com;Database=<database-name>;Port=5432;Ssl Mode=Require;User Id=<username>;` |

#### [Java](#tab/java)

| Default environment variable name     | Description                       | Example value                                                                                                                   |
| ------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | JDBC PostgreSQL connection string | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require&user=<username>` |

#### [SpringBoot](#tab/springBoot)
| Application properties                    | Description                         | Example value                                                                                                 |
|-------------------------------------------|-------------------------------------|---------------------------------------------------------------------------------------------------------------|
| `spring.datasource.azure.passwordless-enabled`  | Enable passwordless authentication  | `true`                                                                                                        |
| `spring.datasource.url`                   | Database URL                        | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require` |
| `spring.datasource.username`              | Database username                   | `username` |

#### [Python](#tab/python)

| Default environment variable name     | Description                | Example value                                                                                                                  |
| ------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | psycopg2 connection string | `dbname=<database-name> host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 sslmode=require user=<username>` |

#### [Django](#tab/django)

| Default environment variable name | Description       | Example value                                            |
| --------------------------------- | ----------------- | -------------------------------------------------------- |
| `AZURE_POSTGRESQL_NAME`         | Database name     | `<database-name>`                                      |
| `AZURE_POSTGRESQL_HOST`         | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `AZURE_POSTGRESQL_USER`         | Database username | `<username>`                                           |

#### [Go](#tab/go)

| Default environment variable name     | Description                   | Example value                                                                                                        |
| ------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | Go PostgreSQL connection string | `host=<PostgreSQL-server-name>.postgres.database.azure.com dbname=<database-name> sslmode=require user=<username>` |

#### [NodeJS](#tab/nodejs)

| Default environment variable name | Description       | Example value                                            |
| --------------------------------- | ----------------- | -------------------------------------------------------- |
| `AZURE_POSTGRESQL_HOST`         | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `AZURE_POSTGRESQL_USER`         | Database username | `<username>`                                           |
| `AZURE_POSTGRESQL_DATABASE`     | Database name     | `<database-name>`                                      |
| `AZURE_POSTGRESQL_PORT`         | Port number       | `5432`                                                 |
| `AZURE_POSTGRESQL_SSL`          | SSL option        | `true`                                                 |

#### [PHP](#tab/php)

| Default environment variable name     | Description                           | Example value                                                                                                                  |
| ------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | PHP native PostgreSQL connection string | `host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>` |

#### [Ruby](#tab/ruby)

| Default environment variable name     | Description                     | Example value                                                                                                                     |
| ------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | Ruby PostgreSQL connection string | `host=<your-postgres-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>` |

#### [Other](#tab/none)
| Default environment variable name | Description       | Example value                                            |
| --------------------------------- | ----------------- | -------------------------------------------------------- |
| `AZURE_POSTGRESQL_HOST`         | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `AZURE_POSTGRESQL_USERNAME`         | Database username | `<username>`                                           |
| `AZURE_POSTGRESQL_DATABASE`     | Database name     | `<database-name>`                                      |
| `AZURE_POSTGRESQL_PORT`         | Port number       | `5432`                                                 |
| `AZURE_POSTGRESQL_SSL`          | SSL option        | `true`                                                 |


---

#### Sample code

Refer to the steps and code below to connect to Azure Database for PostgreSQL using a system-assigned managed identity.
[!INCLUDE [code sample for postgresql system mi](./includes/code-postgres-me-id.md)]


### User-assigned Managed Identity

#### [.NET](#tab/dotnet)

| Default environment variable name     | Description                       | Example value                                                                                                                           |
| ------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID                    | `<identity-client-ID>`                                                                                                                |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | .NET PostgreSQL connection string | `Server=<PostgreSQL-server-name>.postgres.database.azure.com;Database=<database-name>;Port=5432;Ssl Mode=Require;User Id=<username>;` |

#### [Java](#tab/java)

| Default environment variable name     | Description                       | Example value                                                                                                                   |
| ------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID                    | `<identity-client-ID>`                                                                                                        |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | JDBC PostgreSQL connection string | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require&user=<username>` |

#### [SpringBoot](#tab/springBoot)

| Application properties                                            | Description                        | Example value                                                                                                   |
| ----------------------------------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `spring.datasource.azure.passwordless-enabled`                  | Enable passwordless authentication | `true`                                                                                                        |
| `spring.cloud.azure.credential.client-id`                       | Your client ID                     | `<identity-client-ID>`                                                                                        |
| `spring.cloud.azure.credential.client-managed-identity-enabled` | Enable client managed identity     | `true`                                                                                                        |
| `spring.datasource.url`                                         | Database URL                       | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require` |
| `spring.datasource.username`                                    | Database username                  | `username`                                                                                                    |

#### [Python](#tab/python)

| Default environment variable name     | Description                | Example value                                                                                                                  |
| ------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID             | `<identity-client-ID>`                                                                                                       |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | psycopg2 connection string | `dbname=<database-name> host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 sslmode=require user=<username>` |

#### [Django](#tab/django)

| Default environment variable name | Description       | Example value                                            |
| --------------------------------- | ----------------- | -------------------------------------------------------- |
| `AZURE_POSTGRESQL_NAME`         | Database name     | `<database-name>`                                      |
| `AZURE_POSTGRESQL_HOST`         | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `AZURE_POSTGRESQL_USER`         | Database username | `<username>`                                           |
| `AZURE_POSTGRESQL_CLIENTID`     | Your client ID    | `<<identity-client-ID>>`                               |

#### [Go](#tab/go)

| Default environment variable name   | Description                     | Example value                                                                                                                   |
|-------------------------------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID                  | `<identity-client-ID>`                                                                                                          |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | Go PostgreSQL connection string   | `host=<PostgreSQL-server-name>.postgres.database.azure.com dbname=<database-name> sslmode=require user=<username>`|

#### [NodeJS](#tab/nodejs)

| Default environment variable name | Description       | Example value                                            |
| --------------------------------- | ----------------- | -------------------------------------------------------- |
| `AZURE_POSTGRESQL_HOST`         | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `AZURE_POSTGRESQL_USER`         | Database username | `<username>`                                           |
| `AZURE_POSTGRESQL_DATABASE`     | Database name     | `<database-name>`                                      |
| `AZURE_POSTGRESQL_PORT`         | Port number       | `5432`                                                 |
| `AZURE_POSTGRESQL_SSL`          | SSL option        | `true`                                                 |
| `AZURE_POSTGRESQL_CLIENTID`     | Your client ID    | `<identity-client-ID>`                                 |

#### [PHP](#tab/php)

| Default environment variable name | Description                           | Example value                                                                                                                                                             |
|-----------------------------------|---------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID                        | `<identity-client-ID>`|
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | PHP native PostgreSQL connection string | `host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>` |

#### [Ruby](#tab/ruby)

| Default environment variable name | Description                     | Example value                                                                    |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID                  | `<identity-client-ID>`                                                           |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | Ruby PostgreSQL connection string | `host=<your-postgres-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>` |

#### [Other](#tab/none)

| Default environment variable name | Description       | Example value                                            |
| --------------------------------- | ----------------- | -------------------------------------------------------- |
| `AZURE_POSTGRESQL_HOST`         | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `AZURE_POSTGRESQL_USERNAME`     | Database username | `<username>`                                           |
| `AZURE_POSTGRESQL_DATABASE`     | Database name     | `<database-name>`                                      |
| `AZURE_POSTGRESQL_PORT`         | Port number       | `5432`                                                 |
| `AZURE_POSTGRESQL_SSL`          | SSL option        | `true`                                                 |
| `AZURE_POSTGRESQL_CLIENTID`     | Your client ID                        | `<identity-client-ID>`|

---

#### Sample code

Refer to the steps and code below to connect to Azure Database for PostgreSQL using a user-assigned managed identity.
[!INCLUDE [code sample for postgresql user mi](./includes/code-postgres-me-id.md)]

### Connection String

> [!WARNING]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

#### [.NET](#tab/dotnet)

| Default environment variable name     | Description                       | Example value                                                                                                                           |
| ------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | .NET PostgreSQL connection string | `Server=<PostgreSQL-server-name>.postgres.database.azure.com;Database=<database-name>;Port=5432;Ssl Mode=Require;User Id=<username>;` |

#### [Java](#tab/java)

| Default environment variable name     | Description                       | Example value                                                                                                                                       |
| ------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | JDBC PostgreSQL connection string | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require&user=<username>&password=<password>` |

#### [SpringBoot](#tab/springBoot)

| Application properties         | Description       | Example value                                                                                                   |
| ------------------------------ | ----------------- | --------------------------------------------------------------------------------------------------------------- |
| `spring.datasource.url`      | Database URL      | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require` |
| `spring.datasource.username` | Database username | `<username>`                                                                                                  |
| `spring.datasource.password` | Database password | `<password>`                                                                                                  |

#### [Python](#tab/python)

| Default environment variable name     | Description                | Example value                                                                                                                                      |
| ------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | psycopg2 connection string | `dbname=<database-name> host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 sslmode=require user=<username> password=<password>` |

#### [Django](#tab/django)

| Default environment variable name | Description       | Example value                                            |
| --------------------------------- | ----------------- | -------------------------------------------------------- |
| `AZURE_POSTGRESQL_NAME`         | Database name     | `<database-name>`                                      |
| `AZURE_POSTGRESQL_HOST`         | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `AZURE_POSTGRESQL_USER`         | Database username | `<username>`                                           |
| `AZURE_POSTGRESQL_PASSWORD`     | Database password | `<database-password>`                                  |

#### [Go](#tab/go)

| Default environment variable name   | Description                     | Example value                                                                                                                   |
|-------------------------------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | Go PostgreSQL connection string   | `host=<PostgreSQL-server-name>.postgres.database.azure.com dbname=<database-name> sslmode=require user=<username> password=<password>`             |

#### [NodeJS](#tab/nodejs)

| Default environment variable name | Description       | Example value                                            |
| --------------------------------- | ----------------- | -------------------------------------------------------- |
| `AZURE_POSTGRESQL_HOST`         | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `AZURE_POSTGRESQL_USER`         | Database username | `<username>`                                           |
| `AZURE_POSTGRESQL_PASSWORD`     | Database password | `<password>`                                           |
| `AZURE_POSTGRESQL_DATABASE`     | Database name     | `<database-name>`                                      |
| `AZURE_POSTGRESQL_PORT`         | Port number       | `5432`                                                 |
| `AZURE_POSTGRESQL_SSL`          | SSL option        | `true`                                                 |

#### [PHP](#tab/php)

| Default environment variable name | Description                          | Example value                                                                                                                   |
|-----------------------------------|--------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | PHP native PostgreSQL connection string | `host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username> password=<password>` |

#### [Ruby](#tab/ruby)

| Default environment variable name | Description                     | Example value                                                                    |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | Ruby PostgreSQL connection string | `host=<your-postgres-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username> password=<password>` |

#### [Other](#tab/none)

| Default environment variable name | Description       | Example value                                            |
| --------------------------------- | ----------------- | -------------------------------------------------------- |
| `AZURE_POSTGRESQL_HOST`         | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `AZURE_POSTGRESQL_USERNAME`     | Database username | `<username>`                                           |
| `AZURE_POSTGRESQL_DATABASE`     | Database name     | `<database-name>`                                      |
| `AZURE_POSTGRESQL_PORT`         | Port number       | `5432`                                                 |
| `AZURE_POSTGRESQL_SSL`          | SSL option        | `true`                                                 |
| `AZURE_POSTGRESQL_PASSWORD`     | Database password | `<password>`|

---

#### Sample code

Refer to the steps and code below to connect to Azure Database for PostgreSQL using a connection string.
[!INCLUDE [code sample for postgresql secrets](./includes/code-postgres-secret.md)]

### Service Principal

#### [.NET](#tab/dotnet)

| Default environment variable name     | Description                       | Example value                                                                                                                           |
| ------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID                    | `<client-ID>`                                                                                                                         |
| `AZURE_POSTGRESQL_CLIENTSECRET`     | Your client secret                | `<client-secret>`                                                                                                                     |
| `AZURE_POSTGRESQL_TENANTID`         | Your tenant ID                    | `<tenant-ID>`                                                                                                                         |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | .NET PostgreSQL connection string | `Server=<PostgreSQL-server-name>.postgres.database.azure.com;Database=<database-name>;Port=5432;Ssl Mode=Require;User Id=<username>;` |

#### [Java](#tab/java)

| Default environment variable name     | Description                       | Example value                                                                                                                   |
| ------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID                    | `<client-ID>`                                                                                                                 |
| `AZURE_POSTGRESQL_CLIENTSECRET`     | Your client secret                | `<client-secret>`                                                                                                             |
| `AZURE_POSTGRESQL_TENANTID`         | Your tenant ID                    | `<tenant-ID>`                                                                                                                 |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | JDBC PostgreSQL connection string | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require&user=<username>` |

#### [SpringBoot](#tab/springBoot)

| Application properties                           | Description                        | Example value                                                                                                   |
| ------------------------------------------------ | ---------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `spring.datasource.azure.passwordless-enabled` | Enable passwordless authentication | `true`                                                                                                        |
| `spring.cloud.azure.credential.client-id`      | Your client ID                     | `<client-ID>`                                                                                                 |
| `spring.cloud.azure.credential.client-secret`  | Your client secret                 | `<client-secret>`                                                                                             |
| `spring.cloud.azure.credential.tenant-id`      | Your tenant ID                     | `<tenant-ID>`                                                                                                 |
| `spring.datasource.url`                        | Database URL                       | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require` |
| `spring.datasource.username`                   | Database username                  | `username`                                                                                                    |

#### [Python](#tab/python)

| Default environment variable name     | Description                | Example value                                                                                                                  |
| ------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID             | `<client-ID>`                                                                                                                |
| `AZURE_POSTGRESQL_CLIENTSECRET`     | Your client secret         | `<client-secret>`                                                                                                            |
| `AZURE_POSTGRESQL_TENANTID`         | Your tenant ID             | `<tenant-ID>`                                                                                                                |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | psycopg2 connection string | `dbname=<database-name> host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 sslmode=require user=<username>` |

#### [Django](#tab/django)

| Default environment variable name | Description        | Example value                                            |
| --------------------------------- | ------------------ | -------------------------------------------------------- |
| `AZURE_POSTGRESQL_NAME`         | Database name      | `<database-name>`                                      |
| `AZURE_POSTGRESQL_HOST`         | Database host URL  | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `AZURE_POSTGRESQL_USER`         | Database username  | `<username>`                                           |
| `AZURE_POSTGRESQL_CLIENTID`     | Your client ID     | `<client-ID>`                                          |
| `AZURE_POSTGRESQL_CLIENTSECRET` | Your client SECRET | `<client-secret>`                                      |
| `AZURE_POSTGRESQL_TENANTID`     | Your tenant ID     | `<tenant-ID>`                                          |

#### [Go](#tab/go)

| Default environment variable name   | Description                     | Example value                                                                                                                   |
|-------------------------------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID                  | `<client-ID>`                                                                                                                   |
| `AZURE_POSTGRESQL_CLIENTSECRET`     | Your client secret              | `<client-secret>`                                                                                                               |
| `AZURE_POSTGRESQL_TENANTID`         | Your tenant ID                  | `<tenant-ID>`                                                                                                                   |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | Go PostgreSQL connection string   | `host=<PostgreSQL-server-name>.postgres.database.azure.com dbname=<database-name> sslmode=require user=<username>` |

#### [NodeJS](#tab/nodejs)

| Default environment variable name | Description        | Example value                                            |
| --------------------------------- | ------------------ | -------------------------------------------------------- |
| `AZURE_POSTGRESQL_HOST`         | Database host URL  | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `AZURE_POSTGRESQL_USER`         | Database username  | `<username>`                                           |
| `AZURE_POSTGRESQL_DATABASE`     | Database name      | `<database-name>`                                      |
| `AZURE_POSTGRESQL_PORT`         | Port number        | `5432`                                                 |
| `AZURE_POSTGRESQL_SSL`          | SSL option         | `true`                                                 |
| `AZURE_POSTGRESQL_CLIENTID`     | Your client ID     | `<client-ID>`                                          |
| `AZURE_POSTGRESQL_CLIENTSECRET` | Your client secret | `<client-secret>`                                      |
| `AZURE_POSTGRESQL_TENANTID`     | Your tenant ID     | `<tenant-ID>`                                          |

#### [PHP](#tab/php)

| Default environment variable name | Description                           | Example value                                                                                                        |
|-----------------------------------|---------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID                        | `<client-ID>`                                                                                                        |
| `AZURE_POSTGRESQL_CLIENTSECRET`     | Your client secret                    | `<client-secret>`                                                                                                        |
| `AZURE_POSTGRESQL_TENANTID`         | Your tenant ID                        | `<tenant-ID>`                                                                                                        |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | PHP native PostgreSQL connection string | `host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>` |

#### [Ruby](#tab/ruby)

| Default environment variable name | Description                     | Example value                                                                    |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID                  | `<client-ID>`                                                                    |
| `AZURE_POSTGRESQL_CLIENTSECRET`     | Your client secret              | `<client-secret>`                                                                |
| `AZURE_POSTGRESQL_TENANTID`         | Your tenant ID                  | `<tenant-ID>`                                                                    |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | Ruby PostgreSQL connection string | `host=<your-postgres-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>` |

#### [Other](#tab/none)

| Default environment variable name | Description       | Example value                                            |
| --------------------------------- | ----------------- | -------------------------------------------------------- |
| `AZURE_POSTGRESQL_HOST`         | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `AZURE_POSTGRESQL_USERNAME`     | Database username | `<username>`                                           |
| `AZURE_POSTGRESQL_DATABASE`     | Database name     | `<database-name>`                                      |
| `AZURE_POSTGRESQL_PORT`         | Port number       | `5432`                                                 |
| `AZURE_POSTGRESQL_SSL`          | SSL option        | `true`                                                 |
| `AZURE_POSTGRESQL_CLIENTID`     | Your client ID                  | `<identity-client-ID>`|
| `AZURE_POSTGRESQL_CLIENTSECRET`     | Your client secret      | `<client-secret>`                    |
| `AZURE_POSTGRESQL_TENANTID`         | Your tenant ID                  | `<tenant-ID>`         |

---

#### Sample code

Refer to the steps and code below to connect to Azure Database for PostgreSQL using a service principal.
[!INCLUDE [code sample for postgresql service principal](./includes/code-postgres-me-id.md)]

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
