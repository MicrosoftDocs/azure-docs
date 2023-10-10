---
title: Integrate Azure Database for PostgreSQL with Service Connector
description: Integrate Azure Database for PostgreSQL into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 11/29/2022
ms.custom: event-tier1-build-2022, engagement-fy23
---

# Integrate Azure Database for PostgreSQL with Service Connector

This page shows the supported authentication types and client types of Azure Database for PostgreSQL using Service Connector. You might still be able to connect to Azure Database for PostgreSQL in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection and the sample code of how to use them. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service
- Azure App Configuration
- Azure Spring Apps

## Supported authentication types and client types

Supported authentication and clients for App Service, Container Apps, and Azure Spring Apps:

| Client type               | System-assigned managed identity     | User-assigned managed identity      | Secret/connection string             | Service principal                    |
|---------------------------|:------------------------------------:|:-----------------------------------:|:------------------------------------:|:------------------------------------:|
| .NET                      | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Go (pg)                   | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java (JDBC)               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot (JDBC) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js (pg)              | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| PHP (native)              | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python (psycopg2)         | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python-Django             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Ruby (ruby-pg)            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| None                      | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

> [!NOTE]
> System-assigned managed identity, User-assigned managed identity and Service principal are only supported on Azure CLI. 

## Default environment variable names or application properties and Sample codes

Reference the connection details and sample codes in following tables, according to your connection's authentication type and client type, to connect compute services to Azure Database for PostgreSQL.

### Connect with System-assigned Managed Identity

#### [.NET](#tab/dotnet)

| Default environment variable name  | Description                          | Example value                                                                                                                                                                      |
|------------------------------------|--------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CONNECTIONSTRING`  | .NET PostgreSQL connection string    | `Server=<PostgreSQL-server-name>.postgres.database.azure.com;Database=<database-name>;Port=5432;Ssl Mode=Require;User Id=<username>;` |


#### [Java](#tab/java)

| Default environment variable name   | Description                       | Example value                                                                                                                        |
|-------------------------------------|-----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | JDBC PostgreSQL connection string | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require&user=<username>` |

#### [SpringBoot](#tab/spring)
| Application properties                    | Description                         | Example value                                                                                                 |
|-------------------------------------------|-------------------------------------|---------------------------------------------------------------------------------------------------------------|
| `spring.datasource.azure.passwordless-enabled`  | Enable passwordless authentication  | `true`                                                                                                        |
| `spring.datasource.url`                   | Database URL                        | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require` |
| `spring.datasource.username`              | Database username                   | `username` |


#### [Python](#tab/python)

| Default environment variable name | Description                | Example value                                                                                                                   |
|-----------------------------------|----------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | psycopg2 connection string | `dbname=<database-name> host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 sslmode=require user=<username>` |

#### [Django](#tab/django)

| Default environment variable name | Description       | Example value                                          |
|-----------------------------------|-------------------|--------------------------------------------------------|
| `AZURE_POSTGRESQL_NAME`             | Database name     | `<database-name>`                                      |
| `AZURE_POSTGRESQL_HOST`             | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `AZURE_POSTGRESQL_USER`             | Database username | `<username>`                  |


#### [Go](#tab/go)

| Default environment variable name   | Description                     | Example value                                                                                                                   |
|-------------------------------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | Go postgres connection string   | `host=<PostgreSQL-server-name>.postgres.database.azure.com dbname=<database-name> sslmode=require user=<username>`|

#### [NodeJS](#tab/node)

| Default environment variable name | Description       | Example value                                          |
|-----------------------------------|-------------------|--------------------------------------------------------|
| `AZURE_POSTGRESQL_HOST`             | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `AZURE_POSTGRESQL_USER`             | Database username | `<username>`                  |
| `AZURE_POSTGRESQL_DATABASE`         | Database name     | `<database-name>`                                      |
| `AZURE_POSTGRESQL_PORT`             | Port number       | `5432`                                                 |
| `AZURE_POSTGRESQL_SSL`              | SSL option        | `true`                                                 |

#### [PHP](#tab/php)

| Default environment variable name | Description                           | Example value                                                                                                                                                             |
|-----------------------------------|---------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | PHP native postgres connection string | `host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>` |

#### [Ruby](#tab/ruby)

| Default environment variable name | Description                     | Example value                                                                    |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | Ruby postgres connection string | `host=<your-postgres-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>` |

---

### Sample codes

Follow these steps and sample codes to connect to Azure Database for PostgreSQL.
[!INCLUDE [code sample for postgresql system mi](./includes/code-postgres-me-id.md)]


### Connect with User-assigned Managed Identity

#### [.NET](#tab/dotnet)

| Default environment variable name  | Description                       | Example value                                           |
|------------------------------------|-----------------------------------|---------------------------------------------------------|
| `AZURE_POSTGRESQL_CLIENTID`          | Your client ID                    | `<identity-client-ID>`                                  |
| `AZURE_POSTGRESQL_CONNECTIONSTRING`  | .NET PostgreSQL connection string | `Server=<PostgreSQL-server-name>.postgres.database.azure.com;Database=<database-name>;Port=5432;Ssl Mode=Require;User Id=<username>;` |

#### [Java](#tab/java)

| Default environment variable name    | Description                       | Example value                                           |
|--------------------------------------|-----------------------------------|---------------------------------------------------------|
| `AZURE_POSTGRESQL_CLIENTID`          | Your client ID                    | `<identity-client-ID>`                                  |
| `AZURE_POSTGRESQL_CONNECTIONSTRING`  | JDBC PostgreSQL connection string | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require&user=<username>` |

#### [SpringBoot](#tab/spring)

| Application properties                                        | Description                         | Example value                                                                                                 |
|---------------------------------------------------------------|-------------------------------------|---------------------------------------------------------------------------------------------------------------|
| `spring.datasource.azure.passwordless-enabled`                      | Enable passwordless authentication  | `true`                                                                                                        |
| `spring.cloud.azure.credential.client-id`                     | Your client ID                      | `<identity-client-ID>`                                                                                        |
| `spring.cloud.azure.credential.client-managed-identity-enabled`| Enable client managed identity      | `true`                                                                                                 |
| `spring.datasource.url`                                       | Database URL                        | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require` | 
| `spring.datasource.username`                                  | Database username                   | `username`  |

#### [Python](#tab/python)

| Default environment variable name | Description                | Example value                                                                                                                   |
|-----------------------------------|----------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID             | `<identity-client-ID>`  |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | psycopg2 connection string | `dbname=<database-name> host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 sslmode=require user=<username>` |

#### [Django](#tab/django)

| Default environment variable name | Description       | Example value                                          |
|-----------------------------------|-------------------|--------------------------------------------------------|
| `AZURE_POSTGRESQL_NAME`             | Database name     | `<database-name>`                                      |
| `AZURE_POSTGRESQL_HOST`             | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `AZURE_POSTGRESQL_USER`             | Database username | `<username>`                  |
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID    | `<<identity-client-ID>>`                               |

#### [Go](#tab/go)

| Default environment variable name   | Description                     | Example value                                                                                                                   |
|-------------------------------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID                  | `<identity-client-ID>`                                                                                                          |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | Go postgres connection string   | `host=<PostgreSQL-server-name>.postgres.database.azure.com dbname=<database-name> sslmode=require user=<username>`|

#### [NodeJS](#tab/node)

| Default environment variable name | Description       | Example value                                          |
|-----------------------------------|-------------------|--------------------------------------------------------|
| `AZURE_POSTGRESQL_HOST`             | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `AZURE_POSTGRESQL_USER`             | Database username | `<username>`                  |
| `AZURE_POSTGRESQL_DATABASE`         | Database name     | `<database-name>`                                      |
| `AZURE_POSTGRESQL_PORT`             | Port number       | `5432`                                                 |
| `AZURE_POSTGRESQL_SSL`              | SSL option        | `true`                                                 |
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID    | `<identity-client-ID>`                                 |

#### [PHP](#tab/php)

| Default environment variable name | Description                           | Example value                                                                                                                                                             |
|-----------------------------------|---------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID                        | `<identity-client-ID>`|
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | PHP native postgres connection string | `host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>` |

#### [Ruby](#tab/ruby)

| Default environment variable name | Description                     | Example value                                                                    |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID                  | `<identity-client-ID>`                                                           |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | Ruby postgres connection string | `host=<your-postgres-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username> ` |

---

### Sample codes

Follow these steps and sample codes to connect to Azure Database for PostgreSQL.
[!INCLUDE [code sample for postgresql user mi](./includes/code-postgres-me-id.md)]

### Connect with Connection String

#### [.NET](#tab/dotnet)

| Default environment variable name | Description                          | Example value                                                                                                                                                                      |
|-----------------------------------|--------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | .NET PostgreSQL connection string    | `Server=<PostgreSQL-server-name>.postgres.database.azure.com;Database=<database-name>;Port=5432;Ssl Mode=Require;User Id=<username>;` |

#### [Java](#tab/java)

| Default environment variable name | Description                       | Example value                                                                                                                                                                 |
|-----------------------------------|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | JDBC PostgreSQL connection string | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require&user=<username>&password=<password>` |

#### [SpringBoot](#tab/spring)

| Application properties                                        | Description       | Example value                                                                                                 |
|---------------------------------------------------------------|-------------------|---------------------------------------------------------------------------------------------------------------|
| `spring.datasource.url`                                         | Database URL      | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require` |
| `spring.datasource.username`                                    | Database username | `<username>`                                                                         |
| `spring.datasource.password`                                   | Database password | `<password>`                                                                                                  |

#### [Python](#tab/python)

| Default environment variable name | Description                | Example value                                                                                                                   |
|-----------------------------------|----------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | psycopg2 connection string | `dbname=<database-name> host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 sslmode=require user=<username> password=<password>` |

#### [Django](#tab/django)

| Default environment variable name | Description       | Example value                                          |
|-----------------------------------|-------------------|--------------------------------------------------------|
| `AZURE_POSTGRESQL_NAME`             | Database name     | `<database-name>`                                      |
| `AZURE_POSTGRESQL_HOST`             | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `AZURE_POSTGRESQL_USER`             | Database username | `<username>`                  |
| `AZURE_POSTGRESQL_PASSWORD`         | Database password | `<database-password>`                                  |

#### [Go](#tab/go)

| Default environment variable name   | Description                     | Example value                                                                                                                   |
|-------------------------------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | Go postgres connection string   | `host=<PostgreSQL-server-name>.postgres.database.azure.com dbname=<database-name> sslmode=require user=<username> password=<password>`             |

#### [NodeJS](#tab/node)

| Default environment variable name | Description       | Example value                                          |
|-----------------------------------|-------------------|--------------------------------------------------------|
| `AZURE_POSTGRESQL_HOST`             | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `AZURE_POSTGRESQL_USER`             | Database username | `<username>`                  |
| `AZURE_POSTGRESQL_PASSWORD`         | Database password | `<password>`                                           |
| `AZURE_POSTGRESQL_DATABASE`         | Database name     | `<database-name>`                                      |
| `AZURE_POSTGRESQL_PORT`             | Port number       | `5432`                                                 |
| `AZURE_POSTGRESQL_SSL`              | SSL option        | `true`                                                 |

#### [PHP](#tab/php)

| Default environment variable name | Description                          | Example value                                                                                                                   |
|-----------------------------------|--------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | PHP native postgres connection string | `host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username> password=<password>` |

#### [Ruby](#tab/ruby)

| Default environment variable name | Description                     | Example value                                                                    |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | Ruby postgres connection string | `host=<your-postgres-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username> password=<password>` |

---

### Sample codes

Follow these steps and sample codes to connect to Azure Database for PostgreSQL.
[!INCLUDE [code sample for postgresql secrets](./includes/code-postgres-secret.md)]

### Connect with Service Principal

#### [.NET](#tab/dotnet)

| Default environment variable name   | Description                       | Example value                                           |
|-------------------------------------|-----------------------------------|---------------------------------------------------------|
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID                    | `<client-ID>`                                           |
| `AZURE_POSTGRESQL_CLIENTSECRET`     | Your client secret                | `<client-secret>`                                       |
| `AZURE_POSTGRESQL_TENANTID`         | Your tenant ID                    | `<tenant-ID>`                                           |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | .NET PostgreSQL connection string | `Server=<PostgreSQL-server-name>.postgres.database.azure.com;Database=<database-name>;Port=5432;Ssl Mode=Require;User Id=<username>;` |


#### [Java](#tab/java)

| Default environment variable name   | Description                       | Example value                                           |
|-------------------------------------|-----------------------------------|---------------------------------------------------------|
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID                    | `<client-ID>`                                           |
| `AZURE_POSTGRESQL_CLIENTSECRET`     | Your client secret                | `<client-secret>`                                       |
| `AZURE_POSTGRESQL_TENANTID`         | Your tenant ID                    | `<tenant-ID>`                                           |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | JDBC PostgreSQL connection string | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require&user=<username>` |

#### [SpringBoot](#tab/spring)

| Application properties                                        | Description                         | Example value                                                                                                 |
|---------------------------------------------------------------|-------------------------------------|---------------------------------------------------------------------------------------------------------------|
| `spring.datasource.azure.passwordless-enabled`                     | Enable passwordless authentication  | `true`                                                                                                        |
| `spring.cloud.azure.credential.client-id`                     | Your client ID                      | `<client-ID>`                                                                                                 |
| `spring.cloud.azure.credential.client-secret`                 | Your client secret                  | `<client-secret>`                                                                                             |
| `spring.cloud.azure.credential.tenant-id`                     | Your tenant ID                      | `<tenant-ID>`                                                                                                 |
| `spring.datasource.url`                                       | Database URL                        | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require` |
| `spring.datasource.username`                                  | Database username                   | `username`                                                                                             |

#### [Python](#tab/python)

| Default environment variable name | Description                | Example value                                                                                                                   |
|-----------------------------------|----------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID             | `<client-ID>`                                                                                                                   |
| `AZURE_POSTGRESQL_CLIENTSECRET`     | Your client SECRET         | `<client-secret>`                                                                                                               |
| `AZURE_POSTGRESQL_TENANTID`         | Your tenant ID             | `<tenant-ID>`                                                                                                                   |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | psycopg2 connection string | `dbname=<database-name> host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 sslmode=require user=<username>` |

#### [Django](#tab/django)

| Default environment variable name | Description       | Example value                                          |
|-----------------------------------|-------------------|--------------------------------------------------------|
| `AZURE_POSTGRESQL_NAME`             | Database name     | `<database-name>`                                      |
| `AZURE_POSTGRESQL_HOST`             | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `AZURE_POSTGRESQL_USER`             | Database username | `<username>`                  |
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID    | `<client-ID>`                                          |
| `AZURE_POSTGRESQL_CLIENTSECRET`     | Your client SECRET| `<client-secret>`                                      |
| `AZURE_POSTGRESQL_TENANTID`         | Your tenant ID    | `<tenant-ID>`                                          |


#### [Go](#tab/go)

| Default environment variable name   | Description                     | Example value                                                                                                                   |
|-------------------------------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID                  | `<client-ID>`                                                                                                                   |
| `AZURE_POSTGRESQL_CLIENTSECRET`     | Your client SECRET              | `<client-secret>`                                                                                                               |
| `AZURE_POSTGRESQL_TENANTID`         | Your tenant ID                  | `<tenant-ID>`                                                                                                                   |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | Go postgres connection string   | `host=<PostgreSQL-server-name>.postgres.database.azure.com dbname=<database-name> sslmode=require user=<username>` |

#### [NodeJS](#tab/node)

| Default environment variable name | Description           | Example value                                          |
|-----------------------------------|-----------------------|--------------------------------------------------------|
| `AZURE_POSTGRESQL_HOST`             | Database host URL     | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `AZURE_POSTGRESQL_USER`             | Database username     | `<username>`                  |
| `AZURE_POSTGRESQL_DATABASE`         | Database name         | `<database-name>`                                      |
| `AZURE_POSTGRESQL_PORT`             | Port number           | `5432`                                                 |
| `AZURE_POSTGRESQL_SSL`              | SSL option            | `true`                                                 |
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID        | `<client-ID>`                                          |
| `AZURE_POSTGRESQL_CLIENTSECRET`     | Your client secret    | `<client-secret>`                                      |
| `AZURE_POSTGRESQL_TENANTID`         | Your tenant ID        | `<tenant-ID>`                                          |


#### [PHP](#tab/php)

| Default environment variable name | Description                           | Example value                                                                                                        |
|-----------------------------------|---------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID                        | `<client-ID>`                                                                                                        |
| `AZURE_POSTGRESQL_CLIENTSECRET`     | Your client SECRET                    | `<client-secret>`                                                                                                        |
| `AZURE_POSTGRESQL_TENANTID`         | Your tenant ID                        | `<tenant-ID>`                                                                                                        |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | PHP native postgres connection string | `host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>` |

#### [Ruby](#tab/ruby)

| Default environment variable name | Description                     | Example value                                                                    |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------|
| `AZURE_POSTGRESQL_CLIENTID`         | Your client ID                  | `<client-ID>`                                                                    |
| `AZURE_POSTGRESQL_CLIENTSECRET`     | Your client SECRET              | `<client-secret>`                                                                |
| `AZURE_POSTGRESQL_TENANTID`         | Your tenant ID                  | `<tenant-ID>`                                                                    |
| `AZURE_POSTGRESQL_CONNECTIONSTRING` | Ruby postgres connection string | `host=<your-postgres-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>` |

---

### Sample codes

Follow these steps and sample codes to connect to Azure Database for PostgreSQL.
[!INCLUDE [code sample for postgresql service principal](./includes/code-postgres-me-id.md)]


## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)