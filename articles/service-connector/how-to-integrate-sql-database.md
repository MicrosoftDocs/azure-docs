---
title: Integrate Azure SQL Database with Service Connector
description: Integrate SQL into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 08/11/2022
---

# Integrate Azure SQL Database with Service Connector

This page shows all the supported compute services, clients, and authentication types to connect services to Azure SQL Database instances, using Service Connector. This page also shows the default environment variable names and application properties needed to create service connections. You might still be able to connect to an Azure SQL Database instance using other programming languages, without using Service Connector. Learn more about the [Service Connector environment variable naming conventions](concept-service-connector-internals.md).

## Supported compute services

- Azure App Service
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and clients

Supported authentication and clients for App Service, Container Apps and Azure Spring Apps:

| Client type        | System-assigned managed identity | User-assigned managed identity |       Secret/connection string       | Service principal |
|--------------------|:--------------------------------:|:------------------------------:|:------------------------------------:|:-----------------:|
| .NET               |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Go                 |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Java               |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Java - Spring Boot |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| PHP                |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Node.js            |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Python             |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Python - Django    |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Ruby               |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| None               |                                  |                                | ![yes icon](./media/green-check.png) |                   |

## Default environment variable names or application properties

Use the environment variable names and application properties listed below to connect compute services to Azure SQL Database using a secret and a connection string.

### Azure Container Apps

Use the connection details below to connect Azure App Service and Azure Container Apps instances with .NET, Go, Java, Java - Spring Boot, PHP, Node.js, Python, Python - Django and Ruby. For each example below, replace the placeholder texts `<sql-server>`, `<sql-database>`, `<sql-username>`, and `<sql-password>` with your own server name, database name, user ID and password.

#### .NET (sqlClient)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description | Sample value |
> | --------------------------------- | ------------| ------------ |
> | AZURE_SQL_CONNECTIONSTRING | Azure SQL Database connection string | `Data Source=<sql-server>.database.windows.net,1433;Initial Catalog=<sql-database>;User ID=<sql-username>;Password=<sql-password>` |

#### Java Database Connectivity (JDBC)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description | Sample value |
> | --------------------------------- | ------------| ------------ |
> | AZURE_SQL_CONNECTIONSTRING | Azure SQL Database connection string | `jdbc:sqlserver://<sql-server>.database.windows.net:1433;databaseName=<sql-database>;user=<sql-username>;password=<sql-password>;` |

#### Java Spring Boot (spring-boot-starter-jdbc)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                            | Sample value                                                                     |
> |-----------------------------------|----------------------------------------|----------------------------------------------------------------------------------|
> | spring.datasource.url             | Azure SQL Database datasource URL      | `jdbc:sqlserver://<sql-server>.database.windows.net:1433;databaseName=<sql-db>;` |
> | spring.datasource.username        | Azure SQL Database datasource username | `<sql-user>`                                                                     |
> | spring.datasource.password        | Azure SQL Database datasource password | `<sql-password>`                                                                     |

#### Go (go-mssqldb)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description | Sample value |
> | --------------------------------- | ------------| ------------ |
> | AZURE_SQL_CONNECTIONSTRING        | Azure SQL Database connection string | `server=<sql-server>.database.windows.net;port=1433;database=<sql-database>;user id=<sql-username>;password=<sql-password>;` |

#### Node.js

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | AZURE_SQL_SERVER                  | Azure SQL Database server   | `<sql-server>.database.windows.net` |
> | AZURE_SQL_PORT                    | Azure SQL Database port     | `1433`                              |
> | AZURE_SQL_DATABASE                | Azure SQL Database database | `<sql-database>`                          |
> | AZURE_SQL_USERNAME                | Azure SQL Database username | `<sql-username>`                        |
> | AZURE_SQL_PASSWORD                | Azure SQL Database password | `<sql-password>`                        |

#### PHP

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                                | Sample value                        |
> |-----------------------------------|--------------------------------------------|-------------------------------------|
> | AZURE_SQL_SERVERNAME              | Azure SQL Database servername              | `<sql-server>.database.windows.net` |
> | AZURE_SQL_DATABASE                | Azure SQL Database database                | `<sql-database>`                          |
> | AZURE_SQL_UID                     | Azure SQL Database unique identifier (UID) | `<sql-username>`                        |
> | AZURE_SQL_PASSWORD                | Azure SQL Database password                | `<sql-password>`                        |

#### Python (pyobdc)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | AZURE_SQL_SERVER                  | Azure SQL Database server   | `<sql-server>.database.windows.net` |
> | AZURE_SQL_PORT                    | Azure SQL Database port     | `1433`                              |
> | AZURE_SQL_DATABASE                | Azure SQL Database database | `<sql-database>`                          |
> | AZURE_SQL_USER                    | Azure SQL Database user     | `<sql-username>`                        |
> | AZURE_SQL_PASSWORD                | Azure SQL Database password | `<sql-password>`                        |

#### ADjango (mssql-django)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | AZURE_SQL_HOST                    | Azure SQL Database host     | `<sql-server>.database.windows.net` |
> | AZURE_SQL_PORT                    | Azure SQL Database port     | `1433`                              |
> | AZURE_SQL_NAME                    | Azure SQL Database name     | `<sql-database>`                          |
> | AZURE_SQL_USER                    | Azure SQL Database user     | `<sql-username>`                        |
> | AZURE_SQL_PASSWORD                | Azure SQL Database password | `<sql-password>`                        |

#### Ruby

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | AZURE_SQL_HOST                    | Azure SQL Database host     | `<sql-server>.database.windows.net` |
> | AZURE_SQL_PORT                    | Azure SQL Database port     | `1433`                              |
> | AZURE_SQL_DATABASE                | Azure SQL Database database | `<sql-database>`                          |
> | AZURE_SQL_USERNAME                | Azure SQL Database username | `<sql-username>`                        |
> | AZURE_SQL_PASSWORD                | Azure SQL Database password | `<sql-password>`                        |

### Azure Spring Cloud

Use the connection details below to connect Azure Spring Cloud instances with Java Spring Boot.

#### Java Spring Boot (spring-boot-starter-jdbc)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                            | Sample value                                                                     |
> |-----------------------------------|----------------------------------------|----------------------------------------------------------------------------------|
> | spring.datasource.url             | Azure SQL Database datasource URL      | `jdbc:sqlserver://<sql-server>.database.windows.net:1433;databaseName=<sql-database>;` |
> | spring.datasource.username        | Azure SQL Database datasource username | `<sql-username>`                                                                     |
> | spring.datasource.password        | Azure SQL Database datasource password | `<sql-password>`                                                                     |

## Next steps

Follow the tutorial listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
