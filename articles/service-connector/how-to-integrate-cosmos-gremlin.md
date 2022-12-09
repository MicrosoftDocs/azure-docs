---
title: Integrate the Azure Cosmos DB for Apache Gremlin with Service Connector
description: Integrate the Azure Cosmos DB for Apache Gremlin into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 09/19/2022
ms.custom: event-tier1-build-2022, ignite-2022
---

# Integrate the Azure Cosmos DB for Gremlin with Service Connector

This page shows the supported authentication types and client types for the Azure Cosmos DB for Apache Gremlin using Service Connector. You might still be able to connect to the Azure Cosmos DB for Gremlin in other programming languages without using Service Connector. This page also shows default environment variable names and values you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute services

- Azure App Service
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

Supported authentication and clients for App Service, Container Apps and Azure Spring Apps:

### [Azure App Service](#tab/app-service)

| Client type | System-assigned managed identity     | User-assigned managed identity       | Secret / connection string           | Service principal                    |
|-------------|--------------------------------------|--------------------------------------|--------------------------------------|--------------------------------------|
| .NET        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js     | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| PHP         | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python      | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

### [Azure Container Apps](#tab/container-apps)

 Client type | System-assigned managed identity     | User-assigned managed identity       | Secret / connection string           | Service principal                    |
|-------------|--------------------------------------|--------------------------------------|--------------------------------------|--------------------------------------|
| .NET        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js     | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| PHP         | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python      | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

### [Azure Spring Apps](#tab/spring-apps)

| Client type | System-assigned managed identity     | User-assigned managed identity | Secret / connection string           | Service principal                    |
|-------------|--------------------------------------|--------------------------------|--------------------------------------|--------------------------------------|
| .NET        | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java        | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js     | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| PHP         | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python      | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

---

## Default environment variable names or application properties

Use the connection details below to connect your compute services to the Azure Cosmos DB for Apache Gremlin. For each example below, replace the placeholder texts `<Azure-Cosmos-DB-account>`, `<database>`, `<collection or graphs>`, `<username>`, `<password>`, `<resource-group-name>`, `<subscription-ID>`, `<client-ID>`,`<client-secret>`, and `<tenant-id>` with your own information.

### Azure App Service and Azure Container Apps

#### Secret / Connection string

| Default environment variable name | Description                                   | Example value                                  |
|-----------------------------------|-----------------------------------------------|------------------------------------------------|
| AZURE_COSMOS_HOSTNAME             | Your Gremlin Unique Resource Identifier (UFI) | `<Azure-Cosmos-DB-account>.gremlin.cosmos.azure.com`   |
| AZURE_COSMOS_PORT                 | Connection port                               | 443                                            |
| AZURE_COSMOS_USERNAME             | Your username                                 | `/dbs/<database>/colls/<collection or graphs>` |
| AZURE_COSMOS_PASSWORD             | Your password                                 | `<password>`                                   |

#### System-assigned managed identity

| Default environment variable name | Description                                   | Example value                                                                                                                                                                                         |
|-----------------------------------|-----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AZURE_COSMOS_LISTKEYURL           | The URL to get the connection string          | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<Azure-Cosmos-DB-account>/listKeys?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                | Your managed identity scope                   | `https://management.azure.com/.default`                                                                                                                                                               |
| AZURE_COSMOS_RESOURCEENDPOINT     | Your resource endpoint                        | `https://<Azure-Cosmos-DB-account>.documents.azure.com:443/`                                                                                                                                                  |
| AZURE_COSMOS_HOSTNAME             | Your Gremlin Unique Resource Identifier (UFI) | `<Azure-Cosmos-DB-account>.gremlin.cosmos.azure.com`                                                                                                                                                          |
| AZURE_COSMOS_PORT                 | Connection port                               | 443                                                                                                                                                                                                   |
| AZURE_COSMOS_USERNAME             | Your username                                 | `/dbs/<database>/colls/<collection or graphs>`                                                                                                                                                        |

#### User-assigned managed identity

| Default environment variable name | Description                                   | Example value                                                                                                                                                                                         |
|-----------------------------------|-----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AZURE_COSMOS_LISTKEYURL           | The URL to get the connection string          | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<Azure-Cosmos-DB-account>/listKeys?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                | Your managed identity scope                   | `https://management.azure.com/.default`                                                                                                                                                               |
| AZURE_COSMOS_RESOURCEENDPOINT     | Your resource endpoint                        | `https://<Azure-Cosmos-DB-account>.documents.azure.com:443/`                                                                                                                                                  |
| AZURE_COSMOS_HOSTNAME             | Your Gremlin Unique Resource Identifier (UFI) | `<Azure-Cosmos-DB-account>.gremlin.cosmos.azure.com`                                                                                                                                                          |
| AZURE_COSMOS_PORT                 | Connection port                               | 443                                                                                                                                                                                                   |
| AZURE_COSMOS_USERNAME             | Your username                                 | `/dbs/<database>/colls/<collection or graphs>`                                                                                                                                                        |
| AZURE_CLIENTID                    | Your client ID                                | `<client_ID>`                                                                                                                                                                                         |

#### Service principal

| Default environment variable name | Description                                   | Example value                                                                                                                                                                                         |
|-----------------------------------|-----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AZURE_COSMOS_LISTKEYURL           | The URL to get the connection string          | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<Azure-Cosmos-DB-account>/listKeys?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                | Your managed identity scope                   | `https://management.azure.com/.default`                                                                                                                                                               |
| AZURE_COSMOS_RESOURCEENDPOINT     | Your resource endpoint                        | `https://<Azure-Cosmos-DB-account>.documents.azure.com:443/`                                                                                                                                                  |
| AZURE_COSMOS_HOSTNAME             | Your Gremlin Unique Resource Identifier (UFI) | `<Azure-Cosmos-DB-account>.gremlin.cosmos.azure.com`                                                                                                                                                          |
| AZURE_COSMOS_PORT                 | Gremlin connection port                       | 10350                                                                                                                                                                                                 |
| AZURE_COSMOS_USERNAME             | Your username                                 | `</dbs/<database>/colls/<collection or graphs>`                                                                                                                                                                                          |
| AZURE_COSMOS_CLIENTID             | Your client ID                                | `<client-ID>`                                                                                                                                                                                         |
| AZURE_COSMOS_CLIENTSECRET         | Your client secret                            | `<client-secret>`                                                                                                                                                                                     |
| AZURE_COSMOS_TENANTID             | Your tenant ID                                | `<tenant-ID>`                                                                                                                                                                                         |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
