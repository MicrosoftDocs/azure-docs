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

This page shows the supported authentication types and client types of Azure Database for PostgreSQL using Service Connector. You might still be able to connect to Azure Database for PostgreSQL in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

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
> System-assigned managed identity,User-assigned managed identity and Service principal are only supported on Azure CLI. 

## Default environment variable names or application properties

Use the connection details below to connect compute services to PostgreSQL. For each example below, replace the placeholder texts `<postgreSQL-server-name>`, `<database-name>`, `<username>`, and `<password>` with your server name, database name, username and password.

### .NET (ADO.NET)

#### .NET (ADO.NET) System-assigned managed identity

| Default environment variable name  | Description                          | Example value                                                                                                                                                                      |
|------------------------------------|--------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Azure_POSTGRESQL_CONNECTIONSTRING`  | .NET PostgreSQL connection string    | `Server=<PostgreSQL-server-name>.postgres.database.azure.com;Database=<database-name>;Port=5432;Ssl Mode=Require;User Id=<username>@<PostgreSQL-server-name>;` |

#### .NET (ADO.NET) User-assigned managed identity

| Default environment variable name  | Description                       | Example value                                           |
|------------------------------------|-----------------------------------|---------------------------------------------------------|
| `Azure_POSTGRESQL_CLIENTID`          | Your client ID                    | `<identity-client-ID>`                                  |
| `Azure_POSTGRESQL_CONNECTIONSTRING`  | .NET PostgreSQL connection string | `Server=<PostgreSQL-server-name>.postgres.database.azure.com;Database=<database-name>;Port=5432;Ssl Mode=Require;User Id=<username>@<PostgreSQL-server-name>;` |

#### .NET (ADO.NET) secret / connection string

| Default environment variable name | Description                          | Example value                                                                                                                                                                      |
|-----------------------------------|--------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Azure_POSTGRESQL_CONNECTIONSTRING` | .NET PostgreSQL connection string    | `Server=<PostgreSQL-server-name>.postgres.database.azure.com;Database=<database-name>;Port=5432;Ssl Mode=Require;User Id=<username>@<PostgreSQL-server-name>;Password=<password>;` |

#### .NET (ADO.NET) Service principal

| Default environment variable name   | Description                       | Example value                                           |
|-------------------------------------|-----------------------------------|---------------------------------------------------------|
| `Azure_POSTGRESQL_CLIENTID`         | Your client ID                    | `<client-ID>`                                           |
| `Azure_POSTGRESQL_CLIENTSECRET`     | Your client secret                | `<client-secret>`                                       |
| `Azure_POSTGRESQL_TENANTID`         | Your tenant ID                    | `<tenant-ID>`                                           |
| `Azure_POSTGRESQL_CONNECTIONSTRING` | .NET PostgreSQL connection string | `Server=<PostgreSQL-server-name>.postgres.database.azure.com;Database=<database-name>;Port=5432;Ssl Mode=Require;User Id=<username>@<PostgreSQL-server-name>;` |

### Go (pg)

#### Go (pg) System-assigned managed identity

| Default environment variable name   | Description                     | Example value                                                                                                                   |
|-------------------------------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `Azure_POSTGRESQL_CONNECTIONSTRING` | Go postgres connection string   | `host=<PostgreSQL-server-name>.postgres.database.azure.com dbname=<database-name> sslmode=require user=<username>@<server-name>`|


#### Go (pg) User-assigned managed identity

| Default environment variable name   | Description                     | Example value                                                                                                                   |
|-------------------------------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `Azure_POSTGRESQL_CLIENTID`         | Your client ID                  | `<identity-client-ID>`                                                                                                          |
| `Azure_POSTGRESQL_CONNECTIONSTRING` | Go postgres connection string   | `host=<PostgreSQL-server-name>.postgres.database.azure.com dbname=<database-name> sslmode=require user=<username>@<server-name>`|

#### Go (pg) secret / connection string

| Default environment variable name   | Description                     | Example value                                                                                                                   |
|-------------------------------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `Azure_POSTGRESQL_CONNECTIONSTRING` | Go postgres connection string   | `host=<PostgreSQL-server-name>.postgres.database.azure.com dbname=<database-name> sslmode=require user=<username>@<server-name> password=<password>`             |

#### Go (pg) Service principal

| Default environment variable name   | Description                     | Example value                                                                                                                   |
|-------------------------------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `Azure_POSTGRESQL_CLIENTID`         | Your client ID                  | `<client-ID>`                                                                                                                   |
| `Azure_POSTGRESQL_CLIENTSECRET`     | Your client SECRET              | `<client-secret>`                                                                                                               |
| `Azure_POSTGRESQL_TENANTID`         | Your tenant ID                  | `<tenant-ID>`                                                                                                                   |
| `Azure_POSTGRESQL_CONNECTIONSTRING` | Go postgres connection string   | `host=<PostgreSQL-server-name>.postgres.database.azure.com dbname=<database-name> sslmode=require user=<username>@<servername>` |


### Java (JDBC)

#### Java (JDBC) System-assigned managed identity

| Default environment variable name   | Description                       | Example value                                                                                                                        |
|-------------------------------------|-----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| `Azure_POSTGRESQL_CONNECTIONSTRING` | JDBC PostgreSQL connection string | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require&user=<username>` |


#### Java (JDBC) User-assigned managed identity

| Default environment variable name    | Description                       | Example value                                           |
|--------------------------------------|-----------------------------------|---------------------------------------------------------|
| `Azure_POSTGRESQL_CLIENTID`          | Your client ID                    | `<identity-client-ID>`                                  |
| `Azure_POSTGRESQL_CONNECTIONSTRING`  | JDBC PostgreSQL connection string | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require&user=<username>` |

#### Java (JDBC) secret / connection string

| Default environment variable name | Description                       | Example value                                                                                                                                                                 |
|-----------------------------------|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Azure_POSTGRESQL_CONNECTIONSTRING` | JDBC PostgreSQL connection string | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require&user=<username>%40<PostgreSQL-server-name>&password=<password>` |

#### Java (JDBC) Service principal

| Default environment variable name   | Description                       | Example value                                           |
|-------------------------------------|-----------------------------------|---------------------------------------------------------|
| `Azure_POSTGRESQL_CLIENTID`         | Your client ID                    | `<client-ID>`                                           |
| `Azure_POSTGRESQL_CLIENTSECRET`     | Your client secret                | `<client-secret>`                                       |
| `Azure_POSTGRESQL_TENANTID`         | Your tenant ID                    | `<tenant-ID>`                                           |
| `Azure_POSTGRESQL_CONNECTIONSTRING` | JDBC PostgreSQL connection string | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require&user=<username>` |

### Java - Spring Boot (JDBC)

#### Java - Spring Boot (JDBC) System-assigned managed identity
| Application properties                    | Description                         | Example value                                                                                                 |
|-------------------------------------------|-------------------------------------|---------------------------------------------------------------------------------------------------------------|
| `spring.datasource.azure.passwordless-enabled`  | Enable passwordless authentication  | `true`                                                                                                        |
| `spring.datasource.url`                   | Database URL                        | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require` |
| `spring.datasource.username`              | Database username                   | `username`                                                                                             |

#### Java - Spring Boot (JDBC) User-assigned managed identity

| Application properties                                        | Description                         | Example value                                                                                                 |
|---------------------------------------------------------------|-------------------------------------|---------------------------------------------------------------------------------------------------------------|
| `spring.datasource.azure.passwordless-enabled`                      | Enable passwordless authentication  | `true`                                                                                                        |
| `spring.cloud.azure.credential.client-id`                     | Your client ID                      | `<identity-client-ID>`                                                                                        |
| `spring.cloud.azure.credential.client-managed-identity-enabled`| Enable client managed identity      | `true`                                                                                                 |
| `spring.datasource.url`                                       | Database URL                        | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require` | 
| `spring.datasource.username`                                  | Database username                   | `username`                                                                                             |

#### Java - Spring Boot (JDBC) secret / connection string

| Application properties                                        | Description       | Example value                                                                                                 |
|---------------------------------------------------------------|-------------------|---------------------------------------------------------------------------------------------------------------|
| `spring.datasource.url`                                         | Database URL      | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require` |
| `spring.datasource.username`                                    | Database username | `<username>@<PostgreSQL-server-name>`                                                                         |
| `spring.datasource.password`                                   | Database password | `<password>`                                                                                                  |


#### Java - Spring Boot (JDBC) Service principal

| Application properties                                        | Description                         | Example value                                                                                                 |
|---------------------------------------------------------------|-------------------------------------|---------------------------------------------------------------------------------------------------------------|
| `spring.datasource.azure.passwordless-enabled`                     | Enable passwordless authentication  | `true`                                                                                                        |
| `spring.cloud.azure.credential.client-id`                     | Your client ID                      | `<client-ID>`                                                                                                 |
| `spring.cloud.azure.credential.client-secret`                 | Your client secret                  | `<client-secret>`                                                                                             |
| `spring.cloud.azure.credential.tenant-id`                     | Your tenant ID                      | `<tenant-ID>`                                                                                                 |
| `spring.datasource.url`                                       | Database URL                        | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require` |
| `spring.datasource.username`                                  | Database username                   | `username`                                                                                             |

### Node.js (pg)

#### Node.js (pg) System-assigned managed identity

| Default environment variable name | Description       | Example value                                          |
|-----------------------------------|-------------------|--------------------------------------------------------|
| `Azure_POSTGRESQL_HOST`             | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `Azure_POSTGRESQL_USER`             | Database username | `<username>@<PostgreSQL-server-name>`                  |
| `Azure_POSTGRESQL_DATABASE`         | Database name     | `<database-name>`                                      |
| `Azure_POSTGRESQL_PORT`             | Port number       | `5432`                                                 |
| `Azure_POSTGRESQL_SSL`              | SSL option        | `true`                                                 |

#### Node.js (pg) User-assigned managed identity

| Default environment variable name | Description       | Example value                                          |
|-----------------------------------|-------------------|--------------------------------------------------------|
| `Azure_POSTGRESQL_HOST`             | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `Azure_POSTGRESQL_USER`             | Database username | `<username>@<PostgreSQL-server-name>`                  |
| `Azure_POSTGRESQL_DATABASE`         | Database name     | `<database-name>`                                      |
| `Azure_POSTGRESQL_PORT`             | Port number       | `5432`                                                 |
| `Azure_POSTGRESQL_SSL`              | SSL option        | `true`                                                 |
| `Azure_POSTGRESQL_CLIENTID`         | Your client ID    | `<identity-client-ID>`                                 |

#### Node.js (pg) secret / connection string

| Default environment variable name | Description       | Example value                                          |
|-----------------------------------|-------------------|--------------------------------------------------------|
| `Azure_POSTGRESQL_HOST`             | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `Azure_POSTGRESQL_USER`             | Database username | `<username>@<PostgreSQL-server-name>`                  |
| `Azure_POSTGRESQL_PASSWORD`         | Database password | `<password>`                                           |
| `Azure_POSTGRESQL_DATABASE`         | Database name     | `<database-name>`                                      |
| `Azure_POSTGRESQL_PORT`             | Port number       | `5432`                                                 |
| `Azure_POSTGRESQL_SSL`              | SSL option        | `true`                                                 |

#### Node.js (pg) Service principal

| Default environment variable name | Description           | Example value                                          |
|-----------------------------------|-----------------------|--------------------------------------------------------|
| `Azure_POSTGRESQL_HOST`             | Database host URL     | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `Azure_POSTGRESQL_USER`             | Database username     | `<username>@<PostgreSQL-server-name>`                  |
| `Azure_POSTGRESQL_DATABASE`         | Database name         | `<database-name>`                                      |
| `Azure_POSTGRESQL_PORT`             | Port number           | `5432`                                                 |
| `Azure_POSTGRESQL_SSL`              | SSL option            | `true`                                                 |
| `Azure_POSTGRESQL_CLIENTID`         | Your client ID        | `<client-ID>`                                          |
| `Azure_POSTGRESQL_CLIENTSECRET`     | Your client secret    | `<client-secret>`                                      |
| `Azure_POSTGRESQL_TENANTID`         | Your tenant ID        | `<tenant-ID>`                                          |


#### PHP (native)

#### PHP (native) System-assigned managed identity

| Default environment variable name | Description                           | Example value                                                                                                                                                             |
|-----------------------------------|---------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Azure_POSTGRESQL_CONNECTIONSTRING` | PHP native postgres connection string | `host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>@<PostgreSQL-server-name>` |

#### PHP (native) User-assigned managed identity

| Default environment variable name | Description                           | Example value                                                                                                                                                             |
|-----------------------------------|---------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Azure_POSTGRESQL_CLIENTID`         | Your client ID                        | `<identity-client-ID>`|
| `Azure_POSTGRESQL_CONNECTIONSTRING` | PHP native postgres connection string | `host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>@<PostgreSQL-server-name>` |

#### PHP (native) secret / connection string

| Default environment variable name | Description                          | Example value                                                                                                                   |
|-----------------------------------|--------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `Azure_POSTGRESQL_CONNECTIONSTRING` | PHP native postgres connection string | `host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>@<PostgreSQL-server-name> password=<password>` |

#### PHP (native) Service principal

| Default environment variable name | Description                           | Example value                                                                                                        |
|-----------------------------------|---------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| `Azure_POSTGRESQL_CLIENTID`         | Your client ID                        | `<client-ID>`                                                                                                        |
| `Azure_POSTGRESQL_CLIENTSECRET`     | Your client SECRET                    | `<client-secret>`                                                                                                        |
| `Azure_POSTGRESQL_TENANTID`         | Your tenant ID                        | `<tenant-ID>`                                                                                                        |
| `Azure_POSTGRESQL_CONNECTIONSTRING` | PHP native postgres connection string | `host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>@<PostgreSQL-server-name>` |

### Python

#### Python (psycopg2) System-assigned managed identity

| Default environment variable name | Description                | Example value                                                                                                                   |
|-----------------------------------|----------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `Azure_POSTGRESQL_CONNECTIONSTRING` | psycopg2 connection string | `dbname=<database-name> host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 sslmode=require user=<username>@<PostgreSQL-server-name>` |

#### Python (psycopg2) User-assigned managed identity

| Default environment variable name | Description                | Example value                                                                                                                   |
|-----------------------------------|----------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `Azure_POSTGRESQL_CLIENTID`         | Your client ID             | `<identity-client-ID>`  |
| `Azure_POSTGRESQL_CONNECTIONSTRING` | psycopg2 connection string | `dbname=<database-name> host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 sslmode=require user=<username>@<PostgreSQL-server-name>` |

#### Python (psycopg2) secret / connection string

| Default environment variable name | Description                | Example value                                                                                                                   |
|-----------------------------------|----------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `Azure_POSTGRESQL_CONNECTIONSTRING` | psycopg2 connection string | `dbname=<database-name> host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 sslmode=require user=<username>@<PostgreSQL-server-name> password=<password>` |

#### Python (psycopg2) Service principal

| Default environment variable name | Description                | Example value                                                                                                                   |
|-----------------------------------|----------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `Azure_POSTGRESQL_CLIENTID`         | Your client ID             | `<client-ID>`                                                                                                                   |
| `Azure_POSTGRESQL_CLIENTSECRET`     | Your client SECRET         | `<client-secret>`                                                                                                               |
| `Azure_POSTGRESQL_TENANTID`         | Your tenant ID             | `<tenant-ID>`                                                                                                                   |
| `Azure_POSTGRESQL_CONNECTIONSTRING` | psycopg2 connection string | `dbname=<database-name> host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 sslmode=require user=<username>@<PostgreSQL-server-name>` |

#### Python-Django System-assigned managed identity

| Default environment variable name | Description       | Example value                                          |
|-----------------------------------|-------------------|--------------------------------------------------------|
| `Azure_POSTGRESQL_NAME`             | Database name     | `<database-name>`                                      |
| `Azure_POSTGRESQL_HOST`             | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `Azure_POSTGRESQL_USER`             | Database username | `<username>@<PostgreSQL-server-name>`                  |

#### Python-Django User-assigned managed identity

| Default environment variable name | Description       | Example value                                          |
|-----------------------------------|-------------------|--------------------------------------------------------|
| `Azure_POSTGRESQL_NAME`             | Database name     | `<database-name>`                                      |
| `Azure_POSTGRESQL_HOST`             | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `Azure_POSTGRESQL_USER`             | Database username | `<username>@<PostgreSQL-server-name>`                  |
| `Azure_POSTGRESQL_CLIENTID`         | Your client ID    | `<<identity-client-ID>>`                               |

#### Python-Django secret / connection string

| Default environment variable name | Description       | Example value                                          |
|-----------------------------------|-------------------|--------------------------------------------------------|
| `Azure_POSTGRESQL_NAME`             | Database name     | `<database-name>`                                      |
| `Azure_POSTGRESQL_HOST`             | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `Azure_POSTGRESQL_USER`             | Database username | `<username>@<PostgreSQL-server-name>`                  |
| `Azure_POSTGRESQL_PASSWORD`         | Database password | `<database-password>`                                  |

#### Python-Django Service principal

| Default environment variable name | Description       | Example value                                          |
|-----------------------------------|-------------------|--------------------------------------------------------|
| `Azure_POSTGRESQL_NAME`             | Database name     | `<database-name>`                                      |
| `Azure_POSTGRESQL_HOST`             | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| `Azure_POSTGRESQL_USER`             | Database username | `<username>@<PostgreSQL-server-name>`                  |
| `Azure_POSTGRESQL_CLIENTID`         | Your client ID    | `<client-ID>`                                          |
| `Azure_POSTGRESQL_CLIENTSECRET`     | Your client SECRET| `<client-secret>`                                      |
| `Azure_POSTGRESQL_TENANTID`         | Your tenant ID    | `<tenant-ID>`                                          |


### Ruby (ruby-pg)

#### Ruby (ruby-pg) System-assigned managed identity

| Default environment variable name | Description                     | Example value                                                                    |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------|
| `Azure_POSTGRESQL_CONNECTIONSTRING` | Ruby postgres connection string | `host=<your-postgres-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>@<servername>` |

#### Ruby (ruby-pg) User-assigned managed identity

| Default environment variable name | Description                     | Example value                                                                    |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------|
| `Azure_POSTGRESQL_CLIENTID`         | Your client ID                  | `<identity-client-ID>`                                                           |
| `Azure_POSTGRESQL_CONNECTIONSTRING` | Ruby postgres connection string | `host=<your-postgres-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>@<servername> ` |

#### Ruby (ruby-pg) secret / connection string

| Default environment variable name | Description                     | Example value                                                                    |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------|
| `Azure_POSTGRESQL_CONNECTIONSTRING` | Ruby postgres connection string | `host=<your-postgres-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>@<servername> password=<password>` |

#### Ruby (ruby-pg) Service principal

| Default environment variable name | Description                     | Example value                                                                    |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------|
| `Azure_POSTGRESQL_CLIENTID`         | Your client ID                  | `<client-ID>`                                                                    |
| `Azure_POSTGRESQL_CLIENTSECRET`     | Your client SECRET              | `<client-secret>`                                                                |
| `Azure_POSTGRESQL_TENANTID`         | Your tenant ID                  | `<tenant-ID>`                                                                    |
| `Azure_POSTGRESQL_CONNECTIONSTRING` | Ruby postgres connection string | `host=<your-postgres-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>@<servername>` |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)