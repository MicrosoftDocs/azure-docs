---
title: Integrate the Azure Cosmos DB for Apache Gremlin with Service Connector
description: Integrate the Azure Cosmos DB for Apache Gremlin into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 10/31/2023
ms.custom: event-tier1-build-2022, ignite-2022
---
# Integrate the Azure Cosmos DB for Gremlin with Service Connector

This page shows supported authentication methods and clients, and shows sample code you can use to connect the Azure Cosmos DB for Apache Gremlin to other cloud services using Service Connector. You might still be able to connect to the Azure Cosmos DB for Gremlin in other programming languages without using Service Connector. This page also shows default environment variable names and values you get when you create the service connection.

## Supported compute services

- Azure App Service
- Azure Functions
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

Supported authentication and clients for App Service, Azure Functions, Container Apps and Azure Spring Apps:

| Client type | System-assigned managed identity     | User-assigned managed identity       | Secret / connection string           | Service principal                    |
|-------------|--------------------------------------|--------------------------------------|--------------------------------------|--------------------------------------|
| .NET        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js     | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| PHP         | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python      | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

---

## Default environment variable names or application properties and sample code

Use the connection details below to connect your compute services to Azure Cosmos DB for Apache Gremlin. For each example below, replace the placeholder texts `<Azure-Cosmos-DB-account>`, `<database>`, `<collection or graphs>`, `<username>`, `<password>`, `<resource-group-name>`, `<subscription-ID>`, `<client-ID>`,`<client-secret>`, and `<tenant-id>` with your own information. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.


### System-assigned managed identity

| Default environment variable name | Description                                   | Example value                                                                                                                                                                                                   |
| --------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AZURE_COSMOS_LISTKEYURL           | The URL to get the connection string          | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<Azure-Cosmos-DB-account>/listKeys?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                | Your managed identity scope                   | `https://management.azure.com/.default`                                                                                                                                                                       |
| AZURE_COSMOS_RESOURCEENDPOINT     | Your resource endpoint                        | `https://<Azure-Cosmos-DB-account>.documents.azure.com:443/`                                                                                                                                                  |
| AZURE_COSMOS_HOSTNAME             | Your Gremlin Unique Resource Identifier (UFI) | `<Azure-Cosmos-DB-account>.gremlin.cosmos.azure.com`                                                                                                                                                          |
| AZURE_COSMOS_PORT                 | Connection port                               | 443                                                                                                                                                                                                             |
| AZURE_COSMOS_USERNAME             | Your username                                 | `/dbs/<database>/colls/<collection or graphs>`                                                                                                                                                                |

#### Sample code

Refer to the steps and code below to connect to Azure Cosmos DB for Gremlin using a system-assigned managed identity.
[!INCLUDE [code sample for gremlin](./includes/code-cosmosgremlin-me-id.md)]

### User-assigned managed identity

| Default environment variable name | Description                                   | Example value                                                                                                                                                                                                   |
| --------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AZURE_COSMOS_LISTKEYURL           | The URL to get the connection string          | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<Azure-Cosmos-DB-account>/listKeys?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                | Your managed identity scope                   | `https://management.azure.com/.default`                                                                                                                                                                       |
| AZURE_COSMOS_RESOURCEENDPOINT     | Your resource endpoint                        | `https://<Azure-Cosmos-DB-account>.documents.azure.com:443/`                                                                                                                                                  |
| AZURE_COSMOS_HOSTNAME             | Your Gremlin Unique Resource Identifier (UFI) | `<Azure-Cosmos-DB-account>.gremlin.cosmos.azure.com`                                                                                                                                                          |
| AZURE_COSMOS_PORT                 | Connection port                               | 443                                                                                                                                                                                                   |
| AZURE_COSMOS_USERNAME             | Your username                                 | `/dbs/<database>/colls/<collection or graphs>`                                                                                                                                                        |
| AZURE_CLIENTID                    | Your client ID                                | `<client_ID>`                                                                                                                                                                                         |
#### Sample code

Refer to the steps and code below to connect to Azure Cosmos DB for Gremlin using a user-assigned managed identity.
[!INCLUDE [code sample for gremlin](./includes/code-cosmosgremlin-me-id.md)]

### Connection string

| Default environment variable name | Description                                   | Example value                                  |
|-----------------------------------|-----------------------------------------------|------------------------------------------------|
| AZURE_COSMOS_HOSTNAME             | Your Gremlin Unique Resource Identifier (UFI) | `<Azure-Cosmos-DB-account>.gremlin.cosmos.azure.com`   |
| AZURE_COSMOS_PORT                 | Connection port                               | 443                                            |
| AZURE_COSMOS_USERNAME             | Your username                                 | `/dbs/<database>/colls/<collection or graphs>` |
| AZURE_COSMOS_PASSWORD             | Your password                                 | `<password>`                                   |

#### Sample code

Refer to the steps and code below to connect to Azure Cosmos DB for Gremlin using a connection string.
[!INCLUDE [code sample for gremlin](./includes/code-cosmosgremlin-secret.md)]

### Service principal

| Default environment variable name | Description                                   | Example value                                                                                                                                                                                                   |
| --------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AZURE_COSMOS_LISTKEYURL           | The URL to get the connection string          | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<Azure-Cosmos-DB-account>/listKeys?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                | Your managed identity scope                   | `https://management.azure.com/.default`                                                                                                                                                                       |
| AZURE_COSMOS_RESOURCEENDPOINT     | Your resource endpoint                        | `https://<Azure-Cosmos-DB-account>.documents.azure.com:443/`                                                                                                                                                  |
| AZURE_COSMOS_HOSTNAME             | Your Gremlin Unique Resource Identifier (UFI) | `<Azure-Cosmos-DB-account>.gremlin.cosmos.azure.com`                                                                                                                                                          |
| AZURE_COSMOS_PORT                 | Gremlin connection port                       | 10350                                                                                                                                                                                                           |
| AZURE_COSMOS_USERNAME             | Your username                                 | `</dbs/<database>/colls/<collection or graphs>`                                                                                                                                                               |
| AZURE_COSMOS_CLIENTID             | Your client ID                                | `<client-ID>`                                                                                                                                                                                                 |
| AZURE_COSMOS_CLIENTSECRET         | Your client secret                            | `<client-secret>`                                                                                                                                                                                             |
| AZURE_COSMOS_TENANTID             | Your tenant ID                                | `<tenant-ID>`                                                                                                                                                                                                 |

#### Sample code

Refer to the steps and code below to connect to Azure Cosmos DB for Gremlin using a service principal.
[!INCLUDE [code sample for gremlin](./includes/code-cosmosgremlin-me-id.md)]

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
