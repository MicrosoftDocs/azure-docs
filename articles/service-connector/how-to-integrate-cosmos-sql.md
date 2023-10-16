---
title: Integrate the Azure Cosmos DB for NoSQL with Service Connector
description: Integrate the Azure Cosmos DB SQL into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 09/19/2022
ms.custom: event-tier1-build-2022, ignite-2022
---
# Integrate the Azure Cosmos DB for NoSQL with Service Connector

This page shows the supported authentication types and client types for the Azure Cosmos DB for NoSQL using Service Connector. You might still be able to connect to the Azure Cosmos DB for SQL in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute services

- Azure App Service
- Azure Funtions
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

Supported authentication and clients for App Service, Azure Functions, Container Apps and Azure Spring Apps:

### [Azure App Service](#tab/app-service)

| Client type        | System-assigned managed identity   | User-assigned managed identity     | Secret / connection string         | Service principal                  |
| ------------------ | ---------------------------------- | ---------------------------------- | ---------------------------------- | ---------------------------------- |
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot |                                    |                                    | ![yes icon](./media/green-check.png) |                                    |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

### [Azure Functions](#tab/azure-functions)

| Client type        | System-assigned managed identity   | User-assigned managed identity     | Secret / connection string         | Service principal                  |
| ------------------ | ---------------------------------- | ---------------------------------- | ---------------------------------- | ---------------------------------- |
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot |                                    |                                    | ![yes icon](./media/green-check.png) |                                    |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

### [Azure Container Apps](#tab/container-apps)

| Client type        | System-assigned managed identity   | User-assigned managed identity     | Secret / connection string         | Service principal                  |
| ------------------ | ---------------------------------- | ---------------------------------- | ---------------------------------- | ---------------------------------- |
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot |                                    |                                    | ![yes icon](./media/green-check.png) |                                    |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

### [Azure Spring Apps](#tab/spring-apps)

| Client type        | System-assigned managed identity   | User-assigned managed identity | Secret / connection string         | Service principal                  |
| ------------------ | ---------------------------------- | ------------------------------ | ---------------------------------- | ---------------------------------- |
| .NET               | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot |                                    |                                | ![yes icon](./media/green-check.png) |                                    |
| Node.js            | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python             | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

---

## Default environment variable names or application properties

Use the connection details below to connect your compute services to the Azure Cosmos DB for NoSQL. For each example below, replace the placeholder texts `<database-server>`, `<database-name>`,`<account-key>`, `<resource-group-name>`, `<subscription-ID>`, `<client-ID>`, `<SQL-server>`, `<client-secret>`, `<tenant-id>`, and `<access-key>` with your own information.

### Azure App Service and Azure Container Apps

#### Secret / Connection string

| Default environment variable name | Description                                 | Example value                                                                                   |
| --------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| AZURE_COSMOS_CONNECTIONSTRING     | Azure Cosmos DB for NoSQL connection string | `AccountEndpoint=https://<database-server>.documents.azure.com:443/;AccountKey=<account-key>` |

#### System-assigned managed identity

| Default environment variable name    | Description                          | Example value                                                                                                                                                                                                        |
| ------------------------------------ | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AZURE_COSMOS_LISTCONNECTIONSTRINGURL | The URL to get the connection string | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<database-server>/listConnectionStrings?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                   | Your managed identity scope          | `https://management.azure.com/.default`                                                                                                                                                                            |
| AZURE_COSMOS_RESOURCEENDPOINT        | Your resource endpoint               | `https://<database-server>.documents.azure.com:443/`                                                                                                                                                               |

#### User-assigned managed identity

| Default environment variable name    | Description                          | Example value                                                                                                                                                                                                        |
| ------------------------------------ | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AZURE_COSMOS_LISTCONNECTIONSTRINGURL | The URL to get the connection string | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<database-server>/listConnectionStrings?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                   | Your managed identity scope          | `https://management.azure.com/.default`                                                                                                                                                                            |
| AZURE_COSMOS_CLIENTID                | Your client secret ID                | `<client-ID>`                                                                                                                                                                                                      |
| AZURE_COSMOS_RESOURCEENDPOINT        | Your resource endpoint               | `https://<database-server>.documents.azure.com:443/`                                                                                                                                                               |

#### Service principal

| Default environment variable name    | Description                          | Example value                                                                                                                                                                                                        |
| ------------------------------------ | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AZURE_COSMOS_LISTCONNECTIONSTRINGURL | The URL to get the connection string | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<database-server>/listConnectionStrings?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                   | Your managed identity scope          | `https://management.azure.com/.default`                                                                                                                                                                            |
| AZURE_COSMOS_CLIENTID                | Your client secret ID                | `<client-ID>`                                                                                                                                                                                                      |
| AZURE_COSMOS_CLIENTSECRET            | Your client secret                   | `<client-secret>`                                                                                                                                                                                                  |
| AZURE_COSMOS_TENANTID                | Your tenant ID                       | `<tenant-ID>`                                                                                                                                                                                                      |
| AZURE_COSMOS_RESOURCEENDPOINT        | Your resource endpoint               | `https://<database-server>.documents.azure.com:443/`                                                                                                                                                               |

### Azure Spring Apps

| Default environment variable name | Description                      | Example value                                          |
| --------------------------------- | -------------------------------- | ------------------------------------------------------ |
| azure.cosmos.key                  | The access key for your database | `<access-key>`                                       |
| azure.cosmos.database             | Your database                    | `<database-name>`                                    |
| azure.cosmos.uri                  | Your database URI                | `https://<database-server>.documents.azure.com:443/` |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
