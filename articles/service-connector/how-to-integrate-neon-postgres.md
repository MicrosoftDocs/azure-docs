---
title: Integrate Neon Serverless Postgres with Service Connector
description: Integrate Neon Serverless Postgres into your application with Service Connector.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.custom: engagement-fy23
ms.date: 02/21/2025
---

# Integrate Neon Serverless Postgres with Service Connector

This page shows supported authentication methods and clients, and shows sample code you can use to connect Neon Serverless Postgres from Azure compute services using Service Connector. You might still be able to connect to Neon Serverless Postgres in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection.

## Supported compute services

Service Connector can be used to connect the following compute services to Neon Serverless Postgres:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Spring Apps

## Supported authentication types and client types

The table below shows which combinations of authentication methods and clients are supported for connecting your compute service to Neon Serverless Postgres using Service Connector. A “Yes” indicates that the combination is supported, while a “No” indicates that it is not supported.

| Client type               | System-assigned managed identity | User-assigned managed identity | Secret/connection string | Service principal |
|---------------------------|:--------------------------------:|:------------------------------:|:------------------------:|:-----------------:|
| .NET                      |                No                |                No              |            Yes           |        No         |
| Go (pg)                   |                No                |                No              |            Yes           |        No         |
| Java (JDBC)               |                No                |                No              |            Yes           |        No         |
| Java - Spring Boot (JDBC) |                No                |                No              |            Yes           |        No         |
| Node.js (pg)              |                No                |                No              |            Yes           |        No         |
| PHP (native)              |                No                |                No              |            Yes           |        No         |
| Python (psycopg2)         |                No                |                No              |            Yes           |        No         |
| Python-Django             |                No                |                No              |            Yes           |        No         |
| Ruby (ruby-pg)            |                No                |                No              |            Yes           |        No         |
| None                      |                No                |                No              |            Yes           |        No         |

This table indicates that all combinations of client types and authentication methods in the table are supported. All client types can use any of the authentication methods to connect to Neon Serverless Postgres using Service Connector.

## Default environment variable names or application properties and sample code

Reference the connection details and sample code in the following tables, according to your connection's authentication type and client type, to connect compute services to Neon Serverless Postgres. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### Connection String

> [!WARNING]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

#### [.NET](#tab/dotnet)

| Default environment variable name     | Description                       | Example value                                                                                                                           |
| ------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `NEON_POSTGRESQL_CONNECTIONSTRING` | .NET PostgreSQL connection string | `Server=ep-still-mud-a12aa123.eastus2.azure.neon.tech;Database=<database-name>;Port=5432;Ssl Mode=Require;User Id=<username>;` |

#### [Java](#tab/java)

| Default environment variable name     | Description                       | Example value                                                                                                                                       |
| ------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEON_POSTGRESQL_CONNECTIONSTRING` | JDBC PostgreSQL connection string | `jdbc:postgresql://ep-still-mud-a12aa123.eastus2.azure.neon.tech:5432/<database-name>?sslmode=require&user=<username>&password=<password>` |

#### [SpringBoot](#tab/springBoot)

| Application properties         | Description       | Example value                                                                                                   |
| ------------------------------ | ----------------- | --------------------------------------------------------------------------------------------------------------- |
| `spring.datasource.url`      | Database URL      | `jdbc:postgresql://ep-still-mud-a12aa123.eastus2.azure.neon.tech:5432/<database-name>?sslmode=require` |
| `spring.datasource.username` | Database username | `<username>`                                                                                                  |
| `spring.datasource.password` | Database password | `<password>`                                                                                                  |

#### [Python](#tab/python)

| Default environment variable name     | Description                | Example value                                                                                                                                      |
| ------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEON_POSTGRESQL_CONNECTIONSTRING` | psycopg2 connection string | `dbname=<database-name> host=ep-still-mud-a12aa123.eastus2.azure.neon.tech port=5432 sslmode=require user=<username> password=<password>` |

#### [Django](#tab/django)

| Default environment variable name | Description       | Example value                                            |
| --------------------------------- | ----------------- | -------------------------------------------------------- |
| `NEON_POSTGRESQL_NAME`         | Database name     | `<database-name>`                                      |
| `NEON_POSTGRESQL_HOST`         | Database host URL | `ep-still-mud-a12aa123.eastus2.azure.neon.tech` |
| `NEON_POSTGRESQL_USER`         | Database username | `<username>`                                           |
| `NEON_POSTGRESQL_PASSWORD`     | Database password | `<database-password>`                                  |

#### [Go](#tab/go)

| Default environment variable name   | Description                     | Example value                                                                                                                   |
|-------------------------------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `NEON_POSTGRESQL_CONNECTIONSTRING` | Go PostgreSQL connection string   | `host=ep-still-mud-a12aa123.eastus2.azure.neon.tech dbname=<database-name> sslmode=require user=<username> password=<password>`             |

#### [NodeJS](#tab/nodejs)

| Default environment variable name | Description       | Example value                                            |
| --------------------------------- | ----------------- | -------------------------------------------------------- |
| `NEON_POSTGRESQL_HOST`         | Database host URL | `ep-still-mud-a12aa123.eastus2.azure.neon.tech` |
| `NEON_POSTGRESQL_USER`         | Database username | `<username>`                                           |
| `NEON_POSTGRESQL_PASSWORD`     | Database password | `<password>`                                           |
| `NEON_POSTGRESQL_DATABASE`     | Database name     | `<database-name>`                                      |
| `NEON_POSTGRESQL_PORT`         | Port number       | `5432`                                                 |
| `NEON_POSTGRESQL_SSL`          | SSL option        | `true`                                                 |

#### [PHP](#tab/php)

| Default environment variable name | Description                          | Example value                                                                                                                   |
|-----------------------------------|--------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `NEON_POSTGRESQL_CONNECTIONSTRING` | PHP native PostgreSQL connection string | `host=ep-still-mud-a12aa123.eastus2.azure.neon.tech port=5432 dbname=<database-name> sslmode=require user=<username> password=<password>` |

#### [Ruby](#tab/ruby)

| Default environment variable name | Description                     | Example value                                                                    |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------|
| `NEON_POSTGRESQL_CONNECTIONSTRING` | Ruby PostgreSQL connection string | `host=<your-postgres-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username> password=<password>` |

#### [Other](#tab/none)

| Default environment variable name | Description       | Example value                                            |
| --------------------------------- | ----------------- | -------------------------------------------------------- |
| `NEON_POSTGRESQL_HOST`         | Database host URL | `ep-still-mud-a12aa123.eastus2.azure.neon.tech` |
| `NEON_POSTGRESQL_USERNAME`     | Database username | `<username>`                                           |
| `NEON_POSTGRESQL_DATABASE`     | Database name     | `<database-name>`                                      |
| `NEON_POSTGRESQL_PORT`         | Port number       | `5432`                                                 |
| `NEON_POSTGRESQL_SSL`          | SSL option        | `true`                                                 |
| `NEON_POSTGRESQL_PASSWORD`     | Database password | `<password>`|

---

#### Sample code

Refer to the steps and code below to connect to Neon Serverless Postgres using a connection string.
[!INCLUDE [code sample for postgresql secrets](./includes/code-neon-postgres-secret.md)]


## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
