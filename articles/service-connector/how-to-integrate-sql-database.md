---
title: Integrate Azure SQL Database with Service Connector
description: Integrate SQL into your application with Service Connector
author: mcleanbyron
ms.author: mcleans
ms.service: service-connector
ms.topic: how-to
ms.date: 11/29/2022
ms.custom: event-tier1-build-2022, engagement-fy23
---

# Integrate Azure SQL Database with Service Connector

This page shows all the supported compute services, clients, and authentication types to connect services to Azure SQL Database instances, using Service Connector. This page also shows the default environment variable names and application properties needed to create service connections. You might still be able to connect to an Azure SQL Database instance using other programming languages, without using Service Connector. Learn more about the [Service Connector environment variable naming conventions](concept-service-connector-internals.md).

## Supported compute services

- Azure App Service
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and clients

Supported authentication and clients for App Service, Container Apps, and Azure Spring Apps:

| Client type        | System-assigned managed identity     | User-assigned managed identity      | Secret/connection string             | Service principal                    |
|--------------------|:------------------------------------:|:-----------------------------------:|:------------------------------------:|:------------------------------------:|
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Go                 |                                      |                                     | ![yes icon](./media/green-check.png) |                                      |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| PHP                |                                      |                                     | ![yes icon](./media/green-check.png) |                                      |
| Python             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python - Django    |                                      |                                     | ![yes icon](./media/green-check.png) |                                      |
| Ruby               |                                      |                                     | ![yes icon](./media/green-check.png) |                                      |
| None               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

> [!NOTE]
> System-assigned managed identity,User-assigned managed identity and Service principal are only supported on Azure CLI. 

## Default environment variable names or application properties

Use the environment variable names and application properties listed below to connect compute services to Azure SQL Database. For each example below, replace the placeholder texts `<sql-server>`, `<sql-database>`, `<sql-username>`, and `<sql-password>` with your own server name, database name, user ID and password.

### .NET (sqlClient)

#### .NET System-assigned managed identity

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description | Sample value |
> | --------------------------------- | ------------| ------------ |
> | `Azure_SQL_CONNECTIONSTRING` | Azure SQL Database connection string | `Data Source=<sql-server>.database.windows.net,1433;Initial Catalog=<sql-database>;Authentication=ActiveDirectoryManagedIdentity` |

#### .NET User-assigned managed identity

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description | Sample value |
> | --------------------------------- | ------------| ------------ |
> | `Azure_SQL_CONNECTIONSTRING`        | Azure SQL Database connection string | `Data Source=<sql-server>.database.windows.net,1433;Initial Catalog=<sql-database>;User ID=<identity-client-ID>;Authentication=ActiveDirectoryManagedIdentity` |

#### .NET secret / connection string

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description | Sample value |
> | --------------------------------- | ------------| ------------ |
> | `Azure_SQL_CONNECTIONSTRING` | Azure SQL Database connection string | `Data Source=<sql-server>.database.windows.net,1433;Initial Catalog=<sql-database>;Password=<sql-password>` |

#### .NET Service principal

> [!div class="mx-tdBreakAll"]
>| Default environment variable name | Description                       | Example value                                           |
>|-----------------------------------|-----------------------------------|---------------------------------------------------------|
>| `Azure_SQL_CLIENTID`                | Your client ID                    | `<client-ID>`                                           |
>| `Azure_SQL_CLIENTSECRET`            | Your client secret                | `<client-secret>`                                       |
>| `Azure_SQL_TENANTID`                | Your tenant ID                    | `<tenant-ID>`                                           |
>| `Azure_SQL_CONNECTIONSTRING`        | Azure SQL Database connection string | `Data Source=<sql-server>.database.windows.net,1433;Initial Catalog=<sql-database>;User ID=a30eeedc-e75f-4301-b1a9-56e81e0ce99c;Password=asdfghwerty;Authentication=ActiveDirectoryServicePrincipal` |


### Go (go-mssqldb)

#### Go (go-mssqldb) secret / connection string

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                          | Sample value                                                                                                                 |
> |-----------------------------------|--------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
> | `Azure_SQL_CONNECTIONSTRING`        | Azure SQL Database connection string | `server=<sql-server>.database.windows.net;port=1433;database=<sql-database>;user id=<sql-username>;password=<sql-password>;` |


### Java Database Connectivity (JDBC)


#### Java Database Connectivity (JDBC) System-assigned managed identity

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                          | Sample value                                                                                                             |
> |-----------------------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
> | `Azure_SQL_CONNECTIONSTRING`        | Azure SQL Database connection string | `jdbc:sqlserver://<sql-server>.database.windows.net:1433;databaseName=<sql-database>;authentication=ActiveDirectoryMSI;` |

#### Java Database Connectivity (JDBC) User-assigned managed identity

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                          | Sample value                                                                                                             |
> |-----------------------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
> | `Azure_SQL_CONNECTIONSTRING`        | Azure SQL Database connection string | `jdbc:sqlserver://<sql-server>.database.windows.net:1433;databaseName=<sql-database>;msiClientId=<msiClientId>;authentication=ActiveDirectoryMSI;` |

#### Java Database Connectivity (JDBC) secret / connection string

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description | Sample value |
> | --------------------------------- | ------------| ------------ |
> | `Azure_SQL_CONNECTIONSTRING` | Azure SQL Database connection string | `jdbc:sqlserver://<sql-server>.database.windows.net:1433;databaseName=<sql-database>;user=<sql-username>;password=<sql-password>;` |

#### Java Database Connectivity (JDBC) Service principal
 
> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                          | Sample value                                                                                                             |
> |-----------------------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
> | `Azure_SQL_CONNECTIONSTRING`        | Azure SQL Database connection string | `jdbc:sqlserver://<sql-server>.database.windows.net:1433;databaseName=<sql-database>;user=<client-Id>;password=<client-secret>;authentication=ActiveDirectoryServicePrincipal;` |


### Java Spring Boot (spring-boot-starter-jdbc)

#### Java Spring Boot System-assigned managed identity

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                            | Sample value                                                                                                       |
> |-----------------------------------|----------------------------------------|--------------------------------------------------------------------------------------------------------------------|
> | `spring.datasource.url`             | Azure SQL Database datasource URL      | `jdbc:sqlserver://<sql-server>.database.windows.net:1433;databaseName=<sql-db>;authentication=ActiveDirectoryMSI;` |

#### Java Spring Boot User-assigned managed identity

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                            | Sample value                                                                                                       |
> |-----------------------------------|----------------------------------------|--------------------------------------------------------------------------------------------------------------------|
> | `spring.datasource.url`             | Azure SQL Database datasource URL      | `jdbc:sqlserver://<sql-server>.database.windows.net:1433;databaseName=<sql-db>;msiClientId=<msiClientId>;authentication=ActiveDirectoryMSI;` |

#### Java Spring Boot secret / connection string

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                            | Sample value                                                                     |
> |-----------------------------------|----------------------------------------|----------------------------------------------------------------------------------|
> | `spring.datasource.url`             | Azure SQL Database datasource URL      | `jdbc:sqlserver://<sql-server>.database.windows.net:1433;databaseName=<sql-db>;` |
> | `spring.datasource.username`        | Azure SQL Database datasource username | `<sql-user>`                                                                     |
> | `spring.datasource.password`        | Azure SQL Database datasource password | `<sql-password>`                                                                 |

#### Java Spring Boot Service principal

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                            | Sample value                                                                     |
> |-----------------------------------|----------------------------------------|----------------------------------------------------------------------------------|
> | `spring.datasource.url`             | Azure SQL Database datasource URL      | `jdbc:sqlserver://<sql-server>.database.windows.net:1433;databaseName=<sql-db>;authentication=ActiveDirectoryServicePrincipal;` |
> | `spring.datasource.username`        | Azure SQL Database datasource username | `<client-Id>`                                                                                                                   |
> | `spring.datasource.password`        | Azure SQL Database datasource password | `<client-Secret>`                                                                |

### Node.js

#### Node.js System-assigned managed identity

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | `Azure_SQL_SERVER`                  | Azure SQL Database server   | `<sql-server>.database.windows.net` |
> | `Azure_SQL_PORT`                    | Azure SQL Database port     | `1433`                              |
> | `Azure_SQL_DATABASE`                | Azure SQL Database database | `<sql-database>`                    |
> | `Azure_SQL_AUTHENTICATIONTYPE`      | Azure SQL Database authentication type | `azure-active-directory-default` |

#### Node.js User-assigned managed identity

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                            | Sample value                        |
> |-----------------------------------|----------------------------------------|-------------------------------------|
> | `Azure_SQL_SERVER`                  | Azure SQL Database server              | `<sql-server>.database.windows.net` |
> | `Azure_SQL_PORT`                    | Azure SQL Database port                | `1433`                              |
> | `Azure_SQL_DATABASE`                | Azure SQL Database database            | `<sql-database>`                    |
> | `Azure_SQL_AUTHENTICATIONTYPE`      | Azure SQL Database authentication type | `azure-active-directory-default`    |
> | `Azure_SQL_CLIENTID`                | Azure SQL Database client ID           | `<identity-client-ID>`              |
 
#### Node.js secret / connection string

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | `Azure_SQL_SERVER`                  | Azure SQL Database server   | `<sql-server>.database.windows.net` |
> | `Azure_SQL_PORT`                    | Azure SQL Database port     | `1433`                              |
> | `Azure_SQL_DATABASE`                | Azure SQL Database database | `<sql-database>`                    |
> | `Azure_SQL_USERNAME`                | Azure SQL Database username | `<sql-username>`                    |
> | `Azure_SQL_PASSWORD`                | Azure SQL Database password | `<sql-password>`                    |

#### Node.js Service principal

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                            | Sample value                        |
> |-----------------------------------|----------------------------------------|-------------------------------------|
> | `Azure_SQL_SERVER`                  | Azure SQL Database server              | `<sql-server>.database.windows.net` |
> | `Azure_SQL_PORT`                    | Azure SQL Database port                | `1433`                              |
> | `Azure_SQL_DATABASE`                | Azure SQL Database database            | `<sql-database>`                    |
> | `Azure_SQL_AUTHENTICATIONTYPE`      | Azure SQL Database authentication type | `azure-active-directory-default`    |
> | `Azure_SQL_CLIENTID`                | Azure SQL Database client ID           | `<your Client ID>`                  |
> | `Azure_SQL_CLIENTSECRET`            | Azure SQL Database client Secret       | `<your Client Secret >`             |
> | `Azure_SQL_TENANTID`                | Azure SQL Database Tenant ID           | `<your Tenant ID>`                  |

### PHP

#### PHP secret / connection string

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                                | Sample value                        |
> |-----------------------------------|--------------------------------------------|-------------------------------------|
> | `Azure_SQL_SERVERNAME`              | Azure SQL Database servername              | `<sql-server>.database.windows.net,1433` |
> | `Azure_SQL_DATABASE`               | Azure SQL Database database                | `<sql-database>`                    |
> | `Azure_SQL_UID`                     | Azure SQL Database unique identifier (UID) | `<sql-username>`                    |
> | `Azure_SQL_PASSWORD`                | Azure SQL Database password                | `<sql-password>`                    |

### Python (pyobdc)

#### Python (pyobdc) system-assigned managed identity

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | `Azure_SQL_SERVER`                  | Azure SQL Database server   | `<sql-server>.database.windows.net` |
> | `Azure_SQL_PORT`                    | Azure SQL Database port     | `1433`                              |
> | `Azure_SQL_DATABASE`                | Azure SQL Database database | `<sql-database>`                    |
> | `Azure_SQL_AUTHENTICATION`          | Azure SQL authentication    | `ActiveDirectoryMsi`                |

#### Python (pyobdc) User-assigned managed identity

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | `Azure_SQL_SERVER`                  | Azure SQL Database server   | `<sql-server>.database.windows.net` |
> | `Azure_SQL_PORT`                    | Azure SQL Database port     | `1433`                              |
> | `Azure_SQL_DATABASE`                | Azure SQL Database database | `<sql-database>`                    |
> | `Azure_SQL_USER`                    | Azure SQL Database user     | `Object (principal) ID`             |
> | `Azure_SQL_AUTHENTICATION`          | Azure SQL authentication    | `ActiveDirectoryMsi`                |

#### Python (pyobdc) secret / connection string

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | `Azure_SQL_SERVER`                  | Azure SQL Database server   | `<sql-server>.database.windows.net` |
> | `Azure_SQL_PORT`                    | Azure SQL Database port     | `1433`                              |
> | `Azure_SQL_DATABASE`                | Azure SQL Database database | `<sql-database>`                    |
> | `Azure_SQL_USER`                    | Azure SQL Database user     | `<sql-username>`                    |
> | `Azure_SQL_PASSWORD`                | Azure SQL Database password | `<sql-password>`                    |

#### Python (pyobdc) Service principal

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | `Azure_SQL_SERVER`                  | Azure SQL Database server   | `<sql-server>.database.windows.net` |
> | `Azure_SQL_PORT`                    | Azure SQL Database port     | `1433`                              |
> | `Azure_SQL_DATABASE`                | Azure SQL Database database | `<sql-database>`                    |
> | `Azure_SQL_USER`                    | Azure SQL Database user     | `your Client Id`                    |
> | `Azure_SQL_AUTHENTICATION`          | Azure SQL authentication    | `ActiveDirectoryServerPrincipal`    |
> | `Azure_SQL_PASSWORD`               | Azure SQL Database password | `your Client Secret`                |


### Python-Django (mssql-django)

#### Python-Django (mssql-django) secret / connection string

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | `Azure_SQL_HOST`                    | Azure SQL Database host     | `<sql-server>.database.windows.net` |
> | `Azure_SQL_PORT`                    | Azure SQL Database port     | `1433`                              |
> | `Azure_SQL_NAME`                    | Azure SQL Database name     | `<sql-database>`                    |
> | `Azure_SQL_USER`                    | Azure SQL Database user     | `<sql-username>`                    |
> | `Azure_SQL_PASSWORD`                | Azure SQL Database password | `<sql-password>`                    |

### Ruby

 #### Ruby secret / connection string

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | `Azure_SQL_HOST`                    | Azure SQL Database host     | `<sql-server>.database.windows.net` |
> | `Azure_SQL_PORT`                    | Azure SQL Database port     | `1433`                              |
> | `Azure_SQL_DATABASE`                | Azure SQL Database database | `<sql-database>`                    |
> | `Azure_SQL_USERNAME`                | Azure SQL Database username | `<sql-username>`                    |
> | `Azure_SQL_PASSWORD`                | Azure SQL Database password | `<sql-password>`                    |

## Next steps

Follow the tutorial listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
