---
title: Integrate Azure Cosmos DB with Service Connector
description: Integrate Azure Cosmos DB into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: service-connector
ms.topic: how-to 
ms.date: 05/03/2022
---

# Integrate Azure Cosmos DB with Service Connector

This page shows the supported authentication types and client types of Azure Cosmos DB using Service Connector. You might still be able to connect to Azure Cosmos DB in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service
- Azure Spring Cloud

## Supported Authentication types and client types

| Client Type | System-assigned Managed Identity | User-assigned Managed Identity | Secret/ConnectionString | Service Principal |
| --- | --- | --- | --- | --- |
| .NET | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java  | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot | | | ![yes icon](./media/green-check.png) | |
| Node.js | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Go | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |


## Default environment variable names or application properties

### Dotnet, Java, Nodejs, and Go

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_COSMOS_CONNECTIONSTRING | Mango DB in Cosmos DB connection string | `mongodb://{mango-db-admin-user}:{********}@{mango-db-server}.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@{mango-db-server}@` |

**System-assigned Managed Identity**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_COSMOS_LISTCONNECTIONSTRINGURL | The URL to get the connection string | `https://management.azure.com/subscriptions/{your-subscription-id}/resourceGroups/{your-resource-group-name}/providers/Microsoft.DocumentDB/databaseAccounts/{your-database-server}/listConnectionStrings?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE | Your managed identity scope | `https://management.azure.com/.default` |
| AZURE_COSMOS_RESOURCEENDPOINT | Your resource endpoint| `https://{your-database-server}.documents.azure.com:443/` |

**User-assigned Managed Identity**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_COSMOS_LISTCONNECTIONSTRINGURL | The URL to get the connection string | `https://management.azure.com/subscriptions/{your-subscription-id}/resourceGroups/{your-resource-group-name}/providers/Microsoft.DocumentDB/databaseAccounts/{your-database-server}/listConnectionStrings?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE | Your managed identity scope | `https://management.azure.com/.default` |
| AZURE_COSMOS_CLIENTID | Your client secret ID | `{client-id}` |
| AZURE_COSMOS_SUBSCRIPTIONID | Your subscription ID | `{your-subscription-id}` |
| AZURE_COSMOS_RESOURCEENDPOINT | Your resource endpoint| `https://{your-database-server}.documents.azure.com:443/` |

**Service Principal**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_COSMOS_LISTCONNECTIONSTRINGURL | The URL to get the connection string | `https://management.azure.com/subscriptions/{your-subscription-id}/resourceGroups/{your-resource-group-name}/providers/Microsoft.DocumentDB/databaseAccounts/{your-database-server}/listConnectionStrings?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE | Your managed identity scope | `https://management.azure.com/.default` |
| AZURE_COSMOS_CLIENTID | Your client secret ID | `{client-id}` |
| AZURE_COSMOS_CLIENTSECRET | Your client secret secret | `{client-secret}` |
| AZURE_COSMOS_TENANTID | Your tenant ID | `{tenant-id}` |
| AZURE_COSMOS_SUBSCRIPTIONID | Your subscription ID | `{your-subscription-id}` |
| AZURE_COSMOS_RESOURCEENDPOINT | Your resource endpoint| `https://{your-database-server}.documents.azure.com:443/` |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
