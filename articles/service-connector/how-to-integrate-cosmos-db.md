---
title: Integrate Azure Cosmos DB for MongoDB with Service Connector
description: Integrate Azure Cosmos DB for MongoDB into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 10/31/2023
ms.custom: event-tier1-build-2022, ignite-2022
---
# Integrate Azure Cosmos DB for MongoDB with Service Connector

This page shows supported authentication methods and clients, and shows sample code you can use to connect the Azure Cosmos DB for MongoDB to other cloud services using Service Connector. You might still be able to connect to Azure Cosmos DB for MongoDB in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. 

## Supported compute services

- Azure App Service
- Azure Functions
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

Supported authentication and clients for App Service, Azure Functions, Container Apps, and Azure Spring Apps:

### [Azure App Service](#tab/app-service)

| Client type        | System-assigned managed identity   | User-assigned managed identity     | Secret / connection string         | Service principal                  |
| ------------------ | ---------------------------------- | ---------------------------------- | ---------------------------------- | ---------------------------------- |
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot |                                    |                                    | ![yes icon](./media/green-check.png) |                                    |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Go                 | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

### [Azure Functions](#tab/azure-functions)

| Client type        | System-assigned managed identity   | User-assigned managed identity     | Secret / connection string         | Service principal                  |
| ------------------ | ---------------------------------- | ---------------------------------- | ---------------------------------- | ---------------------------------- |
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot |                                    |                                    | ![yes icon](./media/green-check.png) |                                    |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Go                 | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

### [Azure Container Apps](#tab/container-apps)

| Client type        | System-assigned managed identity   | User-assigned managed identity     | Secret / connection string         | Service principal                  |
| ------------------ | ---------------------------------- | ---------------------------------- | ---------------------------------- | ---------------------------------- |
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot |                                    |                                    | ![yes icon](./media/green-check.png) |                                    |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Go                 | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

### [Azure Spring Apps](#tab/spring-apps)

| Client type        | System-assigned managed identity   | User-assigned managed identity | Secret / connection string         | Service principal                  |
| ------------------ | ---------------------------------- | ------------------------------ | ---------------------------------- | ---------------------------------- |
| .NET               | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot |                                    |                                | ![yes icon](./media/green-check.png) |                                    |
| Node.js            | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Go                 | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

---

## Default environment variable names or application properties and sample code

Use the connection details below to connect compute services to Azure Cosmos DB. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection, as well as sample code. For each example below, replace the placeholder texts `<mongo-db-admin-user>`, `<password>`, `<Azure-Cosmos-DB-API-for-MongoDB-account>`, `<subscription-ID>`, `<resource-group-name>`, `<client-secret>`, and `<tenant-id>` with your own information. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### Azure App Service and Azure Container Apps

#### Secret / Connection string

| Default environment variable name | Description                   | Example value                                                                                                                                                                                  |
| --------------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AZURE_COSMOS_CONNECTIONSTRING     | MongoDB API connection string | `mongodb://<mongo-db-admin-user>:<password>@<mongo-db-server>.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@<mongo-db-server>@` |


### System-assigned managed identity

| Default environment variable name    | Description                          | Example value                                                                                                                                                                                                                                |
| ------------------------------------ | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AZURE_COSMOS_LISTCONNECTIONSTRINGURL | The URL to get the connection string | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<Azure-Cosmos-DB-API-for-MongoDB-account>/listConnectionStrings?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                   | Your managed identity scope          | `https://management.azure.com/.default`                                                                                                                                                                                                    |
| AZURE_COSMOS_RESOURCEENDPOINT        | Your resource endpoint               | `https://<Azure-Cosmos-DB-API-for-MongoDB-account>.documents.azure.com:443/`                                                                                                                                                               |

#### Sample code
Refer to the steps and code below to connect to Azure Cosmos DB for MongoDB using a system-assigned managed identity.
[!INCLUDE [code sample for mongo](./includes/code-cosmosmongo-me-id.md)]

### User-assigned managed identity

| Default environment variable name    | Description                          | Example value                                                                                                                                                                                                                                |
| ------------------------------------ | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AZURE_COSMOS_LISTCONNECTIONSTRINGURL | The URL to get the connection string | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<Azure-Cosmos-DB-API-for-MongoDB-account>/listConnectionStrings?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                   | Your managed identity scope          | `https://management.azure.com/.default`                                                                                                                                                                                                    |
| AZURE_COSMOS_CLIENTID                | Your client ID                       | `<client-ID>`                                                                                                                                                                                                                              |
| AZURE_COSMOS_RESOURCEENDPOINT        | Your resource endpoint               | `https://<Azure-Cosmos-DB-API-for-MongoDB-account>.documents.azure.com:443/`                                                                                                                                                               |

#### Sample code
Refer to the steps and code below to connect to Azure Cosmos DB for MongoDB using a user-assigned managed identity.
[!INCLUDE [code sample for mongo](./includes/code-cosmosmongo-me-id.md)]

### Connection string

#### SpringBoot client type

| Default environment variable name | Description       | Example value                                                                                                                                                                                |
|-----------------------------------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| spring.data.mongodb.database      | Your database     | `<database-name>`                                                                                                                                                                            |
| spring.data.mongodb.uri           | Your database URI | `mongodb://<mongo-db-admin-user>:<password>@<mongo-db-server>.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@<mongo-db-server>@` |

#### Other client types

| Default environment variable name | Description                   | Example value                                                                                                                                                                                |
|-----------------------------------|-------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AZURE_COSMOS_CONNECTIONSTRING     | MongoDB API connection string | `mongodb://<mongo-db-admin-user>:<password>@<mongo-db-server>.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@<mongo-db-server>@` |

#### Sample code
Refer to the steps and code below to connect to Azure Cosmos DB for MongoDB using a connection string.
[!INCLUDE [code sample for mongo](./includes/code-cosmosmongo-secret.md)]

### Service principal

| Default environment variable name    | Description                          | Example value                                                                                                                                                                                                                                |
| ------------------------------------ | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AZURE_COSMOS_LISTCONNECTIONSTRINGURL | The URL to get the connection string | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<Azure-Cosmos-DB-API-for-MongoDB-account>/listConnectionStrings?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                   | Your managed identity scope          | `https://management.azure.com/.default`                                                                                                                                                                                                    |
| AZURE_COSMOS_CLIENTID                | Your client ID                       | `<client-ID>`                                                                                                                                                                                                                              |
| AZURE_COSMOS_CLIENTSECRET            | Your client secret                   | `<client-secret>`                                                                                                                                                                                                                          |
| AZURE_COSMOS_TENANTID                | Your tenant ID                       | `<tenant-ID>`                                                                                                                                                                                                                              |
| AZURE_COSMOS_RESOURCEENDPOINT        | Your resource endpoint               | `https://<Azure-Cosmos-DB-API-for-MongoDB-account>.documents.azure.com:443/`                                                                                                                                                               |

### Azure Spring Apps

| Default environment variable name | Description       | Example value                                                                                                                                                                                  |
| --------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| spring.data.mongodb.database      | Your database     | `<database-name>`                                                                                                                                                                            |
| spring.data.mongodb.uri           | Your database URI | `mongodb://<mongo-db-admin-user>:<password>@<mongo-db-server>.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@<mongo-db-server>@` |

#### Sample code
Refer to the steps and code below to connect to Azure Cosmos DB for MongoDB using a service principal.
[!INCLUDE [code sample for mongo](./includes/code-cosmosmongo-me-id.md)]

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
