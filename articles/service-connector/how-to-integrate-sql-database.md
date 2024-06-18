---
title: Integrate Azure SQL Database with Service Connector
description: Integrate SQL into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.custom: engagement-fy23
ms.date: 02/02/2024
---

# Integrate Azure SQL Database with Service Connector

This page shows supported authentication methods and clients, and shows sample code you can use to connect compute services to Azure SQL Database using Service Connector. You might still be able to connect to Azure SQL Database using other methods. This page also shows default environment variable names and values you get when you create the service connection.

## Supported compute services

Service Connector can be used to connect the following compute services to Azure SQL Database:

- Azure App Service
- Azure Functions
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and clients

The table below shows which combinations of authentication methods and clients are supported for connecting your compute service to Azure SQL Database using Service Connector. A “Yes” indicates that the combination is supported, while a “No” indicates that it is not supported.

| Client type        | System-assigned managed identity | User-assigned managed identity | Secret/connection string | Service principal |
|--------------------|:--------------------------------:|:------------------------------:|:------------------------:|:-----------------:|
| .NET               |                Yes               |               Yes              |            Yes           |        Yes        |
| Go                 |                No                |               No               |            Yes           |         No        |
| Java               |                Yes               |               Yes              |            Yes           |        Yes        |
| Java - Spring Boot |                Yes               |               Yes              |            Yes           |        Yes        |
| Node.js            |                Yes               |               Yes              |            Yes           |        Yes        |
| PHP                |                No                |               No               |            Yes           |         No        |
| Python             |                Yes               |               Yes              |            Yes           |        Yes        |
| Python - Django    |                No                |               No               |            Yes           |         No        |
| Ruby               |                No                |               No               |            Yes           |         No        |
| None               |                Yes               |               Yes              |            Yes           |        Yes        |

This table indicates that the Secret/connection string method is supported for all client types. The System-assigned managed identity, User-assigned managed identity, and Service principal methods are supported for .NET, Java, Java - Spring Boot, Node.js, Python, and None client types. These methods are not supported for Go, PHP, Django, and Ruby client types.

> [!NOTE]
> System-assigned managed identity,User-assigned managed identity and Service principal are only supported on Azure CLI.

## Default environment variable names or application properties and sample code

Use the connection details below to connect compute services to Azure SQL Database. For each example below, replace the placeholder texts `<sql-server>`, `<sql-database>`, `<sql-username>`, and `<sql-password>` with your own server name, database name, user ID and password. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### System-assigned Managed Identity

#### [.NET](#tab/sql-me-id-dotnet)
> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description | Sample value |
> | --------------------------------- | ------------| ------------ |
> | `AZURE_SQL_CONNECTIONSTRING` | Azure SQL Database connection string | `Data Source=<sql-server>.database.windows.net,1433;Initial Catalog=<sql-database>;Authentication=ActiveDirectoryManagedIdentity` |

#### [Java](#tab/sql-me-id-java)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                          | Sample value                                                                                                             |
> |-----------------------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
> | `AZURE_SQL_CONNECTIONSTRING`        | Azure SQL Database connection string | `jdbc:sqlserver://<sql-server>.database.windows.net:1433;databaseName=<sql-database>;authentication=ActiveDirectoryMSI;` |

#### [SpringBoot](#tab/sql-me-id-springBoot)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                            | Sample value                                                                                                       |
> |-----------------------------------|----------------------------------------|--------------------------------------------------------------------------------------------------------------------|
> | `spring.datasource.url`             | Azure SQL Database datasource URL      | `jdbc:sqlserver://<sql-server>.database.windows.net:1433;databaseName=<sql-db>;authentication=ActiveDirectoryMSI;` |

#### [Python](#tab/sql-me-id-python)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | `AZURE_SQL_SERVER`                  | Azure SQL Database server   | `<sql-server>.database.windows.net` |
> | `AZURE_SQL_PORT`                    | Azure SQL Database port     | `1433`                              |
> | `AZURE_SQL_DATABASE`                | Azure SQL Database database | `<sql-database>`                    |
> | `AZURE_SQL_AUTHENTICATION`          | Azure SQL authentication    | `ActiveDirectoryMsi`                |

#### [NodeJS](#tab/sql-me-id-nodejs)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | `AZURE_SQL_SERVER`                  | Azure SQL Database server   | `<sql-server>.database.windows.net` |
> | `AZURE_SQL_PORT`                    | Azure SQL Database port     | `1433`                              |
> | `AZURE_SQL_DATABASE`                | Azure SQL Database database | `<sql-database>`                    |
> | `AZURE_SQL_AUTHENTICATIONTYPE`      | Azure SQL Database authentication type | `azure-active-directory-default` |

#### [Other](#tab/sql-me-id-none)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                            | Sample value                        |
> |-----------------------------------|----------------------------------------|-------------------------------------|
> | `AZURE_SQL_HOST`                    | Azure SQL Database server              | `<sql-server>.database.windows.net` |
> | `AZURE_SQL_PORT`                    | Azure SQL Database port                | `1433`                              |
> | `AZURE_SQL_DATABASE`                | Azure SQL Database database            | `<sql-database>`                    |
> | `AZURE_SQL_AUTHENTICATION`          | Azure SQL Database authentication type | `azure-active-directory-default`    |

---

#### Sample code

Refer to the steps and code below to connect to Azure SQL Database using a system-assigned managed identity.
[!INCLUDE [code sample for sql](./includes/code-sql-me-id.md)]


### User-assigned managed identity

#### [.NET](#tab/sql-me-id-dotnet)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description | Sample value |
> | --------------------------------- | ------------| ------------ |
> | `AZURE_SQL_CONNECTIONSTRING`        | Azure SQL Database connection string | `Data Source=<sql-server>.database.windows.net,1433;Initial Catalog=<sql-database>;User ID=<identity-client-ID>;Authentication=ActiveDirectoryManagedIdentity` |

#### [Java](#tab/sql-me-id-java)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                          | Sample value                                                                                                             |
> |-----------------------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
> | `AZURE_SQL_CONNECTIONSTRING`        | Azure SQL Database connection string | `jdbc:sqlserver://<sql-server>.database.windows.net:1433;databaseName=<sql-database>;msiClientId=<msiClientId>;authentication=ActiveDirectoryMSI;` |

#### [SpringBoot](#tab/sql-me-id-springBoot)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                            | Sample value                                                                                                       |
> |-----------------------------------|----------------------------------------|--------------------------------------------------------------------------------------------------------------------|
> | `spring.datasource.url`             | Azure SQL Database datasource URL      | `jdbc:sqlserver://<sql-server>.database.windows.net:1433;databaseName=<sql-db>;msiClientId=<msiClientId>;authentication=ActiveDirectoryMSI;` |

#### [Python](#tab/sql-me-id-python)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | `AZURE_SQL_SERVER`                  | Azure SQL Database server   | `<sql-server>.database.windows.net` |
> | `AZURE_SQL_PORT`                    | Azure SQL Database port     | `1433`                              |
> | `AZURE_SQL_DATABASE`                | Azure SQL Database database | `<sql-database>`                    |
> | `AZURE_SQL_USER`                    | Azure SQL Database user     | `Object (principal) ID`             |
> | `AZURE_SQL_AUTHENTICATION`          | Azure SQL authentication    | `ActiveDirectoryMsi`                |

#### [NodeJS](#tab/sql-me-id-nodejs)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                            | Sample value                        |
> |-----------------------------------|----------------------------------------|-------------------------------------|
> | `AZURE_SQL_SERVER`                  | Azure SQL Database server              | `<sql-server>.database.windows.net` |
> | `AZURE_SQL_PORT`                    | Azure SQL Database port                | `1433`                              |
> | `AZURE_SQL_DATABASE`                | Azure SQL Database database            | `<sql-database>`                    |
> | `AZURE_SQL_AUTHENTICATIONTYPE`      | Azure SQL Database authentication type | `azure-active-directory-default`    |
> | `AZURE_SQL_CLIENTID`                | Azure SQL Database client ID           | `<identity-client-ID>`              |

#### [Other](#tab/sql-me-id-none)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                            | Sample value                        |
> |-----------------------------------|----------------------------------------|-------------------------------------|
> | `AZURE_SQL_HOST`                    | Azure SQL Database server              | `<sql-server>.database.windows.net` |
> | `AZURE_SQL_PORT`                    | Azure SQL Database port                | `1433`                              |
> | `AZURE_SQL_DATABASE`                | Azure SQL Database database            | `<sql-database>`                    |
> | `AZURE_SQL_AUTHENTICATION`          | Azure SQL Database authentication type | `azure-active-directory-default`    |
> | `AZURE_SQL_USERNAME`                | Azure SQL Database client ID           | `<your Client ID>`                  |

---

#### Sample code

Refer to the steps and code below to connect to Azure SQL Database using a user-assigned managed identity.
[!INCLUDE [code sample for sql](./includes/code-sql-me-id.md)]


### Connection String

#### [.NET](#tab/sql-secret-dotnet)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description | Sample value |
> | --------------------------------- | ------------| ------------ |
> | `AZURE_SQL_CONNECTIONSTRING` | Azure SQL Database connection string | `Data Source=<sql-server>.database.windows.net,1433;Initial Catalog=<sql-database>;Password=<sql-password>` |

#### [Java](#tab/sql-secret-java)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description | Sample value |
> | --------------------------------- | ------------| ------------ |
> | `AZURE_SQL_CONNECTIONSTRING` | Azure SQL Database connection string | `jdbc:sqlserver://<sql-server>.database.windows.net:1433;databaseName=<sql-database>;user=<sql-username>;password=<sql-password>;` |

#### [SpringBoot](#tab/sql-secret-springBoot)

> [!div class="mx-tdBreakAll"]
>
> | Default environment variable name | Description                            | Sample value                                                                       |
> | --------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------- |
> | `spring.datasource.url`         | Azure SQL Database datasource URL      | `jdbc:sqlserver://<sql-server>.database.windows.net:1433;databaseName=<sql-db>;` |
> | `spring.datasource.username`    | Azure SQL Database datasource username | `<sql-user>`                                                                     |
> | `spring.datasource.password`    | Azure SQL Database datasource password | `<sql-password>`                                                                 |

#### [Python](#tab/sql-secret-python)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | `AZURE_SQL_SERVER`                  | Azure SQL Database server   | `<sql-server>.database.windows.net` |
> | `AZURE_SQL_PORT`                    | Azure SQL Database port     | `1433`                              |
> | `AZURE_SQL_DATABASE`                | Azure SQL Database database | `<sql-database>`                    |
> | `AZURE_SQL_USER`                    | Azure SQL Database user     | `<sql-username>`                    |
> | `AZURE_SQL_PASSWORD`                | Azure SQL Database password | `<sql-password>`                    |

#### [Django](#tab/sql-secret-django)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | `AZURE_SQL_HOST`                    | Azure SQL Database host     | `<sql-server>.database.windows.net` |
> | `AZURE_SQL_PORT`                    | Azure SQL Database port     | `1433`                              |
> | `AZURE_SQL_NAME`                    | Azure SQL Database name     | `<sql-database>`                    |
> | `AZURE_SQL_USER`                    | Azure SQL Database user     | `<sql-username>`                    |
> | `AZURE_SQL_PASSWORD`                | Azure SQL Database password | `<sql-password>`                    |

#### [Go](#tab/sql-secret-go)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                          | Sample value                                                                                                                 |
> |-----------------------------------|--------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
> | `AZURE_SQL_CONNECTIONSTRING`        | Azure SQL Database connection string | `server=<sql-server>.database.windows.net;port=1433;database=<sql-database>;user id=<sql-username>;password=<sql-password>;` |

#### [NodeJS](#tab/sql-secret-nodejs)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | `AZURE_SQL_SERVER`                  | Azure SQL Database server   | `<sql-server>.database.windows.net` |
> | `AZURE_SQL_PORT`                    | Azure SQL Database port     | `1433`                              |
> | `AZURE_SQL_DATABASE`                | Azure SQL Database database | `<sql-database>`                    |
> | `AZURE_SQL_USERNAME`                | Azure SQL Database username | `<sql-username>`                    |
> | `AZURE_SQL_PASSWORD`                | Azure SQL Database password | `<sql-password>`                    |

#### [PHP](#tab/sql-secret-php)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                                | Sample value                        |
> |-----------------------------------|--------------------------------------------|-------------------------------------|
> | `AZURE_SQL_SERVERNAME`              | Azure SQL Database servername              | `<sql-server>.database.windows.net,1433` |
> | `AZURE_SQL_DATABASE`               | Azure SQL Database database                | `<sql-database>`                    |
> | `AZURE_SQL_UID`                     | Azure SQL Database unique identifier (UID) | `<sql-username>`                    |
> | `AZURE_SQL_PASSWORD`                | Azure SQL Database password                | `<sql-password>`                    |

#### [Ruby](#tab/sql-secret-ruby)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | `AZURE_SQL_HOST`                    | Azure SQL Database host     | `<sql-server>.database.windows.net` |
> | `AZURE_SQL_PORT`                    | Azure SQL Database port     | `1433`                              |
> | `AZURE_SQL_DATABASE`                | Azure SQL Database database | `<sql-database>`                    |
> | `AZURE_SQL_USERNAME`                | Azure SQL Database username | `<sql-username>`                    |
> | `AZURE_SQL_PASSWORD`                | Azure SQL Database password | `<sql-password>`                    |

#### [Other](#tab/sql-secret-none)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | `AZURE_SQL_HOST`                    | Azure SQL Database host     | `<sql-server>.database.windows.net` |
> | `AZURE_SQL_PORT`                    | Azure SQL Database port     | `1433`                              |
> | `AZURE_SQL_DATABASE`                | Azure SQL Database database | `<sql-database>`                    |
> | `AZURE_SQL_USERNAME`                | Azure SQL Database username | `<sql-username>`                    |
> | `AZURE_SQL_PASSWORD`                | Azure SQL Database password | `<sql-password>`                    |

---

#### Sample code

Refer to the steps and code below to connect to Azure SQL Database using a connection string.
[!INCLUDE [code sample for sql](./includes/code-sql-secret.md)]


### Service Principal

#### [.NET](#tab/sql-me-id-dotnet)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                       | Example value                                           |
> |-----------------------------------|-----------------------------------|---------------------------------------------------------|
> | `AZURE_SQL_CLIENTID`                | Your client ID                    | `<client-ID>`                                           |
> | `AZURE_SQL_CLIENTSECRET`            | Your client secret                | `<client-secret>`                                       |
> | `AZURE_SQL_TENANTID`                | Your tenant ID                    | `<tenant-ID>`                                           |
> | `AZURE_SQL_CONNECTIONSTRING`        | Azure SQL Database connection string | `Data Source=<sql-server>.database.windows.net,1433;Initial Catalog=<sql-database>;User ID=<client-Id>;Password=<client-secret>;Authentication=ActiveDirectoryServicePrincipal` |

#### [Java](#tab/sql-me-id-java)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                          | Sample value                                                                                                             |
> |-----------------------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
> | `AZURE_SQL_CONNECTIONSTRING`        | Azure SQL Database connection string | `jdbc:sqlserver://<sql-server>.database.windows.net:1433;databaseName=<sql-database>;user=<client-Id>;password=<client-secret>;authentication=ActiveDirectoryServicePrincipal;` |


#### [SpringBoot](#tab/sql-me-id-springBoot)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                            | Sample value                                                                     |
> |-----------------------------------|----------------------------------------|----------------------------------------------------------------------------------|
> | `spring.datasource.url`             | Azure SQL Database datasource URL      | `jdbc:sqlserver://<sql-server>.database.windows.net:1433;databaseName=<sql-db>;authentication=ActiveDirectoryServicePrincipal;` |
> | `spring.datasource.username`        | Azure SQL Database datasource username | `<client-Id>`                                                                                                                   |
> | `spring.datasource.password`        | Azure SQL Database datasource password | `<client-Secret>`                                                                |


#### [Python](#tab/sql-me-id-python)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                 | Sample value                        |
> |-----------------------------------|-----------------------------|-------------------------------------|
> | `AZURE_SQL_SERVER`                  | Azure SQL Database server   | `<sql-server>.database.windows.net` |
> | `AZURE_SQL_PORT`                    | Azure SQL Database port     | `1433`                              |
> | `AZURE_SQL_DATABASE`                | Azure SQL Database database | `<sql-database>`                    |
> | `AZURE_SQL_USER`                    | Azure SQL Database user     | `your Client Id`                    |
> | `AZURE_SQL_AUTHENTICATION`          | Azure SQL authentication    | `ActiveDirectoryServerPrincipal`    |
> | `AZURE_SQL_PASSWORD`               | Azure SQL Database password | `your Client Secret`                |


#### [NodeJS](#tab/sql-me-id-nodejs)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                            | Sample value                        |
> |-----------------------------------|----------------------------------------|-------------------------------------|
> | `AZURE_SQL_SERVER`                  | Azure SQL Database server              | `<sql-server>.database.windows.net` |
> | `AZURE_SQL_PORT`                    | Azure SQL Database port                | `1433`                              |
> | `AZURE_SQL_DATABASE`                | Azure SQL Database database            | `<sql-database>`                    |
> | `AZURE_SQL_AUTHENTICATIONTYPE`      | Azure SQL Database authentication type | `azure-active-directory-default`    |
> | `AZURE_SQL_CLIENTID`                | Azure SQL Database client ID           | `<your Client ID>`                  |
> | `AZURE_SQL_CLIENTSECRET`            | Azure SQL Database client Secret       | `<your Client Secret >`             |
> | `AZURE_SQL_TENANTID`                | Azure SQL Database Tenant ID           | `<your Tenant ID>`                  |

#### [Other](#tab/sql-me-id-none)

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                            | Sample value                        |
> |-----------------------------------|----------------------------------------|-------------------------------------|
> | `AZURE_SQL_HOST`                    | Azure SQL Database server              | `<sql-server>.database.windows.net` |
> | `AZURE_SQL_PORT`                    | Azure SQL Database port                | `1433`                              |
> | `AZURE_SQL_DATABASE`                | Azure SQL Database database            | `<sql-database>`                    |
> | `AZURE_SQL_AUTHENTICATION`          | Azure SQL Database authentication type | `azure-active-directory-default`    |
> | `AZURE_SQL_USERNAME`                | Azure SQL Database client ID           | `<your Client ID>`                  |
> | `AZURE_SQL_PASSWORD`            | Azure SQL Database client Secret       | `<your Client Secret >`             |

---

#### Sample code

Refer to the steps and code below to connect to Azure SQL Database using a service principal.
[!INCLUDE [code sample for sql](./includes/code-sql-me-id.md)]


## Next steps

Follow the tutorial listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
