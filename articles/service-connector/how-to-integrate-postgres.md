---
title: Integrate Azure Database for PostgreSQL with Service Connector
description: Integrate Azure Database for PostgreSQL into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: service-connector
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 05/03/2022
---

# Integrate Azure Database for PostgreSQL with Service Connector

This page shows the supported authentication types and client types of Azure Database for PostgreSQL using Service Connector. You might still be able to connect to Azure Database for PostgreSQL in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service
- Azure Spring Cloud

## Supported Authentication types and client types

| Client Type | System-assigned Managed Identity | User-assigned Managed Identity | Secret/ConnectionString | Service Principal |
| --- | --- | --- | --- | --- |
| .NET (ADO.NET) | | | ![yes icon](./media/green-check.png) | |
| Java (JDBC) | | | ![yes icon](./media/green-check.png) | |
| Java - Spring Boot (JDBC) | | | ![yes icon](./media/green-check.png) | |
| Node.js (pg) | | | ![yes icon](./media/green-check.png) | |
| Python (psycopg2) | | | ![yes icon](./media/green-check.png) | |
| Python-Django | | | ![yes icon](./media/green-check.png) | |
| Go (pg) | | | ![yes icon](./media/green-check.png) | |
| PHP (native) | | | ![yes icon](./media/green-check.png) | |
| Ruby (ruby-pg) | | | ![yes icon](./media/green-check.png) | |

## Default environment variable names or application properties

### .NET (ADO.NET) 

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_POSTGRESQL_CONNECTIONSTRING | ADO.NET PostgreSQL connection string | `Server={your-postgres-server-name}.postgres.database.azure.com;Database={database-name};Port=5432;Ssl Mode=Require;User Id={username}@{servername};Password=****;` |

### Java (JDBC)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_POSTGRESQL_CONNECTIONSTRING | JDBC PostgreSQL connection string | `jdbc:postgresql://{your-postgres-server-name}.postgres.database.azure.com:5432/{database-name}?sslmode=require&user={username}%40{servername}l&password=****` |

### Java - Spring Boot (JDBC)

**Secret/ConnectionString**

| Application properties | Description | Example value |
| --- | --- | --- |
| spring.datatsource.url | Database URL | `jdbc:postgresql://{your-postgres-server-name}.postgres.database.azure.com:5432/{database-name}?sslmode=require` |
| spring.datatsource.username | Database username | `{username}@{servername}` |
| spring.datatsource.password | Database password | `****` |

### Node.js (pg) 

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
|---------|---------|---------|
| AZURE_POSTGRESQL_HOST | Database host URL | `{your-postgres-server-name}.postgres.database.azure.com` |
| AZURE_POSTGRESQL_USER | Database username | `{username}@{servername}` |
| AZURE_POSTGRESQL_PASSWORD | Database password | `****` |
| AZURE_POSTGRESQL_DATABASE | Database name | `{database-name}` |
| AZURE_POSTGRESQL_PORT | Port number  | `5432` |
| AZURE_POSTGRESQL_SSL | SSL option  | `true` |

### Python (psycopg2)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_POSTGRESQL_CONNECTIONSTRING | psycopg2 connection string | `dbname={database-name} host={your-postgres-server-name}.postgres.database.azure.com port=5432 sslmode=require user={username}@{servername} password=****` |

### Python-Django

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_POSTGRESQL_HOST | Database host URL | `{your-postgres-server-name}.postgres.database.azure.com` |
| AZURE_POSTGRESQL_USER | Database username | `{username}@{servername}` |
| AZURE_POSTGRESQL_PASSWORD | Database password | `****` |
| AZURE_POSTGRESQL_NAME | Database name | `{database-name}` |


### Go (pg)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_POSTGRESQL_CONNECTIONSTRING | Go pg connection string | `host={your-postgres-server-name}.postgres.database.azure.com dbname={database-name} sslmode=require user={username}@{servername} password=****` |


### PHP (native)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_POSTGRESQL_CONNECTIONSTRING | PHP native postgres connection string | `host={your-postgres-server-name}.postgres.database.azure.com port=5432 dbname={database-name} sslmode=requrie user={username}@{servername} password=****` |

### Ruby (ruby-pg)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_POSTGRESQL_CONNECTIONSTRING | Ruby pg connection string | `host={your-postgres-server-name}.postgres.database.azure.com port=5432 dbname={database-name} sslmode=require user={username}@{servername} password=****` |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
