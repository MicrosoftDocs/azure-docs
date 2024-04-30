---
title: Integrate the Azure Cosmos DB for NoSQL with Service Connector
description: Integrate the Azure Cosmos DB for NoSQL into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 02/02/2024
---

# Integrate the Azure Cosmos DB for NoSQL with Service Connector

This page shows supported authentication methods and clients, and shows sample code you can use to connect Azure Cosmos DB for NoSQL to other cloud services using Service Connector. You might still be able to connect to Azure Cosmos DB for NoSQL in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. 

## Supported compute services

Service Connector can be used to connect the following compute services to Azure Cosmos DB for NoSQL:

- Azure App Service
- Azure Functions
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

The table below shows which combinations of client types and authentication methods are supported for connecting your compute service to Azure Cosmos DB for NoSQL using Service Connector. A “Yes” indicates that the combination is supported, while a “No” indicates that it is not supported.

| Client type        | System-assigned managed identity | User-assigned managed identity | Secret / connection string | Service principal |
|--------------------|----------------------------------|--------------------------------|----------------------------|-------------------|
| .NET               | Yes                              | Yes                            | Yes                        | Yes               |
| Java               | Yes                              | Yes                            | Yes                        | Yes               |
| Java - Spring Boot | Yes                              | Yes                            | Yes                        | Yes               |
| Node.js            | Yes                              | Yes                            | Yes                        | Yes               |
| Python             | Yes                              | Yes                            | Yes                        | Yes               |
| Go                 | Yes                              | Yes                            | Yes                        | Yes               |
| None               | Yes                              | Yes                            | Yes                        | Yes               |

This table indicates that all combinations of client types and authentication methods in the table are supported. All client types can use any of the authentication methods to connect to Azure Cosmos DB for NoSQL using Service Connector.

## Default environment variable names or application properties and Sample code

Use the connection details below to connect your compute services to the Azure Cosmos DB for NoSQL. For each example below, replace the placeholder texts `<database-server>`, `<database-name>`,`<account-key>`, `<resource-group-name>`, `<subscription-ID>`, `<client-ID>`, `<SQL-server>`, `<client-secret>`, `<tenant-id>`, and `<access-key>` with your own information. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### System-assigned managed identity

#### SpringBoot client type

Using a system-assigned managed identity as the authentication type is only available for Spring Cloud Azure version 4.0 or higher.

| Default environment variable name    | Description                          | Example value                                                                                                                                                                                                      |
|--------------------------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| spring.cloud.azure.cosmos.credential.managed-identity-enabled | Whether to enable managed identity | `true` |
| spring.cloud.azure.cosmos.database                   | Your database          | `https://management.azure.com/.default`                                                                                                                                                                            |
| spring.cloud.azure.cosmos.endpoint        | Your resource endpoint               | `https://<database-server>.documents.azure.com:443/`                                                                                                                                                               |

#### Other client types

| Default environment variable name    | Description                          | Example value                                                                                                                                                                                                        |
| ------------------------------------ | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AZURE_COSMOS_LISTCONNECTIONSTRINGURL | The URL to get the connection string | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<database-server>/listConnectionStrings?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                   | Your managed identity scope          | `https://management.azure.com/.default`                                                                                                                                                                            |
| AZURE_COSMOS_RESOURCEENDPOINT        | Your resource endpoint               | `https://<database-server>.documents.azure.com:443/`                                                                                                                                                               |

#### Sample code

Refer to the steps and code below to connect to Azure Cosmos DB for NoSQL using a system-assigned identity.
[!INCLUDE [code for cosmos sql me id](./includes/code-cosmossql-me-id.md)]

### User-assigned managed identity

#### SpringBoot client type

Using a user-assigned managed identity as the authentication type is only available for Spring Cloud Azure version 4.0 or higher.

| Default environment variable name    | Description                          | Example value                                                                                                                                                                                                      |
|--------------------------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| spring.cloud.azure.cosmos.credential.managed-identity-enabled | Whether to enable managed identity | `true` |
| spring.cloud.azure.cosmos.database                   | Your database          | `https://management.azure.com/.default`                                                                                                                                                                            |
| spring.cloud.azure.cosmos.endpoint        | Your resource endpoint               | `https://<database-server>.documents.azure.com:443/`                                                                                                                                                               |
| spring.cloud.azure.cosmos.credential.client-id        | Your client ID               | `<client-ID>`                                                                                                                                                                 |

#### Other client types
| Default environment variable name    | Description                          | Example value                                                                                                                                                                                                      |
|--------------------------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AZURE_COSMOS_LISTCONNECTIONSTRINGURL | The URL to get the connection string | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<database-server>/listConnectionStrings?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                   | Your managed identity scope          | `https://management.azure.com/.default`                                                                                                                                                                            |
| AZURE_COSMOS_CLIENTID                | Your client ID                | `<client-ID>`                                                                                                                                                                                                      |
| AZURE_COSMOS_RESOURCEENDPOINT        | Your resource endpoint               | `https://<database-server>.documents.azure.com:443/`                                                                                                                                                               |

#### Sample code

Refer to the steps and code below to connect to Azure Cosmos DB for NoSQL using a user-assigned identity.
[!INCLUDE [code for cosmos sql me id](./includes/code-cosmossql-me-id.md)]

### Connection string

#### SpringBoot client type

| Default environment variable name | Description                      | Example value                                                                                                                                                                                |
|-----------------------------------|----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| azure.cosmos.key                  | The access key for your database for Spring Cloud Azure version below 4.0 | `<access-key>`                                                                                                                                                                               |
| azure.cosmos.database             | Your database for Spring Cloud Azure version below 4.0                    | `<database-name>`                                                                                                                                                                            |
| azure.cosmos.uri                  | Your database URI for Spring Cloud Azure version below 4.0                | `https://<database-server>.documents.azure.com:443/` |
| spring.cloud.azure.cosmos.key     | The access key for your database for Spring Cloud Azure version over 4.0  | `<access-key>`                                                                                                                                                                               |
| spring.cloud.azure.cosmos.database| Your database for Spring Cloud Azure version over 4.0                     | `<database-name>`                                                                                                                                                                            |
| spring.cloud.azure.cosmos.endpoint| Your database URI for Spring Cloud Azure version over 4.0                 | `https://<database-server>.documents.azure.com:443/` |

#### Other client types

| Default environment variable name | Description                         | Example value                                                                                                                                                                                |
|-----------------------------------|-------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AZURE_COSMOS_CONNECTIONSTRING     | Azure Cosmos DB for NoSQL connection string | `AccountEndpoint=https://<database-server>.documents.azure.com:443/;AccountKey=<account-key>` |

#### Sample code

Refer to the steps and code below to connect to Azure Cosmos DB for NoSQL using a connection string.
[!INCLUDE [code for cosmos sql](./includes/code-cosmossql-secret.md)]

#### Service principal

#### SpringBoot client type

| Default environment variable name    | Description                          | Example value                                                                                                                                                                                                      |
|--------------------------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| spring.cloud.azure.cosmos.credential.client-id                | Your client ID                | `<client-ID>`                                                                                                                                                                                                      |
| spring.cloud.azure.cosmos.credential.client-secret            | Your client secret                   | `<client-secret>`                                                                                                                                                                                                  |
| spring.cloud.azure.cosmos.profile.tenant-id            | Your tenant ID                   | `<tenant-ID>`  |
| spring.cloud.azure.cosmos.database                | Your database                      | `<database-name>`                                                                                                                                                                                                      |
| spring.cloud.azure.cosmos.endpoint        | Your resource endpoint               | `https://<database-server>.documents.azure.com:443/`                                                                                                                                                               |


#### Other client types
| Default environment variable name    | Description                          | Example value                                                                                                                                                                                                      |
|--------------------------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AZURE_COSMOS_LISTCONNECTIONSTRINGURL | The URL to get the connection string | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<database-server>/listConnectionStrings?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                   | Your managed identity scope          | `https://management.azure.com/.default`                                                                                                                                                                            |
| AZURE_COSMOS_CLIENTID                | Your client secret ID                | `<client-ID>`                                                                                                                                                                                                      |
| AZURE_COSMOS_CLIENTSECRET            | Your client secret                   | `<client-secret>`                                                                                                                                                                                                  |
| AZURE_COSMOS_TENANTID                | Your tenant ID                       | `<tenant-ID>`                                                                                                                                                                                                      |
| AZURE_COSMOS_RESOURCEENDPOINT        | Your resource endpoint               | `https://<database-server>.documents.azure.com:443/`                                                                                                                                                               |

#### Sample code

Refer to the steps and code below to connect to Azure Cosmos DB for NoSQL using a service principal.
[!INCLUDE [code for cosmos sql me id](./includes/code-cosmossql-me-id.md)]

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
