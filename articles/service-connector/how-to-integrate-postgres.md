---
title: Integrate Azure Database for PostgreSQL with Service Connector
description: Integrate Azure Database for PostgreSQL into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 08/11/2022
ms.custom: event-tier1-build-2022
---

# Integrate Azure Database for PostgreSQL with Service Connector

This page shows the supported authentication types and client types of Azure Database for PostgreSQL using Service Connector. You might still be able to connect to Azure Database for PostgreSQL in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service
- Azure App Configuration
- Azure Spring Apps

## Supported authentication types and client types

Supported authentication and clients for App Service, Container Apps and Azure Spring Apps:


| Client type               | System-assigned managed identity | User-assigned managed identity | Secret / connection string           | Service principal |
|---------------------------|----------------------------------|--------------------------------|--------------------------------------|-------------------|
| .NET (ADO.NET)            |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Go (pg)                   |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Java (JDBC)               |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Java - Spring Boot (JDBC) |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Node.js (pg)              |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Python (psycopg2)         |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Python-Django             |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| PHP (native)              |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Ruby (ruby-pg)            |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| None                      |                                  |                                | ![yes icon](./media/green-check.png) |                   |

## Default environment variable names or application properties

Use the connection details below to connect compute services to PostgreSQL. For each example below, replace the placeholder texts `<postgreSQL-server-name>`, `<database-name>`, `<username>`, and `<password>` with your server name, database name, username and password.

### .NET (ADO.NET) secret / connection string

| Default environment variable name | Description                          | Example value                                                                                                                                                                      |
|-----------------------------------|--------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AZURE_POSTGRESQL_CONNECTIONSTRING | ADO.NET PostgreSQL connection string | `Server=<PostgreSQL-server-name>.postgres.database.azure.com;Database=<database-name>;Port=5432;Ssl Mode=Require;User Id=<username>@<PostgreSQL-server-name>;Password=<password>;` |

### Java (JDBC) secret / connection string

| Default environment variable name | Description                       | Example value                                                                                                                                                             |
|-----------------------------------|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AZURE_POSTGRESQL_CONNECTIONSTRING | JDBC PostgreSQL connection string | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require&user=<username>%40<PostgreSQL-server-name>l&password=<password>` |

### Java - Spring Boot (JDBC) secret / connection string

| Application properties      | Description       | Example value                                                                                                 |
|-----------------------------|-------------------|---------------------------------------------------------------------------------------------------------------|
| spring.datatsource.url      | Database URL      | `jdbc:postgresql://<PostgreSQL-server-name>.postgres.database.azure.com:5432/<database-name>?sslmode=require` |
| spring.datatsource.username | Database username | `<username>@<PostgreSQL-server-name>`                                                                         |
| spring.datatsource.password | Database password | `<password>`                                                                                                  |

### Node.js (pg) secret / connection string

| Default environment variable name | Description       | Example value                                          |
|-----------------------------------|-------------------|--------------------------------------------------------|
| AZURE_POSTGRESQL_HOST             | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| AZURE_POSTGRESQL_USER             | Database username | `<username>@<PostgreSQL-server-name>`                  |
| AZURE_POSTGRESQL_PASSWORD         | Database password | `<password>`                                           |
| AZURE_POSTGRESQL_DATABASE         | Database name     | `<database-name>`                                      |
| AZURE_POSTGRESQL_PORT             | Port number       | `5432`                                                 |
| AZURE_POSTGRESQL_SSL              | SSL option        | `true`                                                 |

### Python (psycopg2) secret / connection string

| Default environment variable name | Description                | Example value                                                                                                                                                             |
|-----------------------------------|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AZURE_POSTGRESQL_CONNECTIONSTRING | psycopg2 connection string | `dbname=<database-name> host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 sslmode=require user=<username>@<PostgreSQL-server-name> password=<password>` |

### Python-Django secret / connection string

| Default environment variable name | Description       | Example value                                          |
|-----------------------------------|-------------------|--------------------------------------------------------|
| AZURE_POSTGRESQL_HOST             | Database host URL | `<PostgreSQL-server-name>.postgres.database.azure.com` |
| AZURE_POSTGRESQL_USER             | Database username | `<username>@<PostgreSQL-server-name>`                  |
| AZURE_POSTGRESQL_PASSWORD         | Database password | `<password>`                                           |
| AZURE_POSTGRESQL_NAME             | Database name     | `<database-name>`                                      |

### Go (pg) secret / connection string

| Default environment variable name | Description             | Example value                                                                                                                                        |
|-----------------------------------|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| AZURE_POSTGRESQL_CONNECTIONSTRING | Go pg connection string | `host=<PostgreSQL-server-name>.postgres.database.azure.com dbname=<database-name> sslmode=require user=<username>@<server-name> password=<password>` |

### PHP (native) secret / connection string

| Default environment variable name | Description                           | Example value                                                                                                                                                             |
|-----------------------------------|---------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AZURE_POSTGRESQL_CONNECTIONSTRING | PHP native postgres connection string | `host=<PostgreSQL-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>@<PostgreSQL-server-name> password=<password>` |

### Ruby (ruby-pg) secret / connection string

| Default environment variable name | Description               | Example value                                                                                                                                                    |
|-----------------------------------|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AZURE_POSTGRESQL_CONNECTIONSTRING | Ruby pg connection string | `host=<your-postgres-server-name>.postgres.database.azure.com port=5432 dbname=<database-name> sslmode=require user=<username>@<servername> password=<password>` |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
