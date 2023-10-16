---
title: Integrate the Azure Cosmos DB for Apache Cassandra with Service Connector
description: Integrate the Azure Cosmos DB for Apache Cassandra into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 09/19/2022
ms.custom: event-tier1-build-2022, ignite-2022
---
# Integrate the Azure Cosmos DB for Cassandra with Service Connector

This page shows the supported authentication types and client types for the Azure Cosmos DB for Apache Cassandra using Service Connector. You might still be able to connect to the Azure Cosmos DB for Cassandra in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute services

- Azure App Service
- Azure Functions
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

Supported authentication and clients for App Service, Functions, Container Apps and Azure Spring Apps:

### [Azure App Service](#tab/app-service)

| Client type        | System-assigned managed identity   | User-assigned managed identity     | Secret / connection string         | Service principal                  |
| ------------------ | ---------------------------------- | ---------------------------------- | ---------------------------------- | ---------------------------------- |
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Go                 | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot |                                    |                                    | ![yes icon](./media/green-check.png) |                                    |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

### [Azure Functions](#tab/azure-functions)

| Client type        | System-assigned managed identity   | User-assigned managed identity     | Secret / connection string         | Service principal                  |
| ------------------ | ---------------------------------- | ---------------------------------- | ---------------------------------- | ---------------------------------- |
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Go                 | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot |                                    |                                    | ![yes icon](./media/green-check.png) |                                    |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

### [Azure Container Apps](#tab/container-apps)

| Client type        | System-assigned managed identity   | User-assigned managed identity     | Secret / connection string         | Service principal                  |
| ------------------ | ---------------------------------- | ---------------------------------- | ---------------------------------- | ---------------------------------- |
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Go                 | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot |                                    |                                    | ![yes icon](./media/green-check.png) |                                    |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

### [Azure Spring Apps](#tab/spring-apps)

| Client type        | System-assigned managed identity   | User-assigned managed identity | Secret / connection string         | Service principal                  |
| ------------------ | ---------------------------------- | ------------------------------ | ---------------------------------- | ---------------------------------- |
| .NET               | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Go                 | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot |                                    |                                | ![yes icon](./media/green-check.png) |                                    |
| Node.js            | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python             | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

---

## Default environment variable names or application properties

Use the connection details below to connect your compute services to the Azure Cosmos DB for Apache Cassandra. For each example below, replace the placeholder texts `<Azure-Cosmos-DB-account>`, `keyspace`, `<username>`, `<password>`, `<resource-group-name>`, `<subscription-ID>`, `<client-ID>`,`<client-secret>`, `<tenant-id>`, and `<Azure-region>` with your own information.

### Azure App Service and Azure Container Apps

#### Secret / Connection string

| Default environment variable name | Description                                        | Example value                                            |
| --------------------------------- | -------------------------------------------------- | -------------------------------------------------------- |
| AZURE_COSMOS_CONTACTPOINT         | Azure Cosmos DB for Apache Cassandra contact point | `<Azure-Cosmos-DB-account>.cassandra.cosmos.azure.com` |
| AZURE_COSMOS_PORT                 | Cassandra connection port                          | 10350                                                    |
| AZURE_COSMOS_KEYSPACE             | Cassandra keyspace                                 | `<keyspace>`                                           |
| AZURE_COSMOS_USERNAME             | Cassandra username                                 | `<username>`                                           |
| AZURE_COSMOS_PASSWORD             | Cassandra password                                 | `<password>`                                           |

#### System-assigned managed identity

| Default environment variable name | Description                                        | Example value                                                                                                                                                                                                   |
| --------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AZURE_COSMOS_LISTKEYURL           | The URL to get the connection string               | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<Azure-Cosmos-DB-account>/listKeys?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                | Your managed identity scope                        | `https://management.azure.com/.default`                                                                                                                                                                       |
| AZURE_COSMOS_RESOURCEENDPOINT     | Your resource endpoint                             | `https://<Azure-Cosmos-DB-account>.documents.azure.com:443/`                                                                                                                                                  |
| AZURE_COSMOS_CONTACTPOINT         | Azure Cosmos DB for Apache Cassandra contact point | `<Azure-Cosmos-DB-account>.cassandra.cosmos.azure.com`                                                                                                                                                        |
| AZURE_COSMOS_PORT                 | Cassandra connection port                          | 10350                                                                                                                                                                                                           |
| AZURE_COSMOS_KEYSPACE             | Cassandra keyspace                                 | `<keyspace>`                                                                                                                                                                                                  |
| AZURE_COSMOS_USERNAME             | Cassandra username                                 | `<username>`                                                                                                                                                                                                  |

#### User-assigned managed identity

| Default environment variable name | Description                                        | Example value                                                                                                                                                                                                   |
| --------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AZURE_COSMOS_LISTKEYURL           | The URL to get the connection string               | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<Azure-Cosmos-DB-account>/listKeys?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                | Your managed identity scope                        | `https://management.azure.com/.default`                                                                                                                                                                       |
| AZURE_COSMOS_RESOURCEENDPOINT     | Your resource endpoint                             | `https://<Azure-Cosmos-DB-account>.documents.azure.com:443/`                                                                                                                                                  |
| AZURE_COSMOS_CONTACTPOINT         | Azure Cosmos DB for Apache Cassandra contact point | `<Azure-Cosmos-DB-account>.cassandra.cosmos.azure.com`                                                                                                                                                        |
| AZURE_COSMOS_PORT                 | Cassandra connection port                          | 10350                                                                                                                                                                                                           |
| AZURE_COSMOS_KEYSPACE             | Cassandra keyspace                                 | `<keyspace>`                                                                                                                                                                                                  |
| AZURE_COSMOS_USERNAME             | Cassandra username                                 | `<username>`                                                                                                                                                                                                  |
| AZURE_COSMOS_CLIENTID             | Your client ID                                     | `<client-ID>`                                                                                                                                                                                                 |

#### Service principal

| Default environment variable name | Description                                        | Example value                                                                                                                                                                                                   |
| --------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AZURE_COSMOS_LISTKEYURL           | The URL to get the connection string               | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<Azure-Cosmos-DB-account>/listKeys?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                | Your managed identity scope                        | `https://management.azure.com/.default`                                                                                                                                                                       |
| AZURE_COSMOS_RESOURCEENDPOINT     | Your resource endpoint                             | `https://<Azure-Cosmos-DB-account>.documents.azure.com:443/`                                                                                                                                                  |
| AZURE_COSMOS_CONTACTPOINT         | Azure Cosmos DB for Apache Cassandra contact point | `<Azure-Cosmos-DB-account>.cassandra.cosmos.azure.com`                                                                                                                                                        |
| AZURE_COSMOS_PORT                 | Cassandra connection port                          | 10350                                                                                                                                                                                                           |
| AZURE_COSMOS_KEYSPACE             | Cassandra keyspace                                 | `<keyspace>`                                                                                                                                                                                                  |
| AZURE_COSMOS_USERNAME             | Cassandra username                                 | `<username>`                                                                                                                                                                                                  |
| AZURE_COSMOS_CLIENTID             | Your client ID                                     | `<client-ID>`                                                                                                                                                                                                 |
| AZURE_COSMOS_CLIENTSECRET         | Your client secret                                 | `<client-secret>`                                                                                                                                                                                             |
| AZURE_COSMOS_TENANTID             | Your tenant ID                                     | `<tenant-ID>`                                                                                                                                                                                                 |

### Azure Spring Apps

| Default environment variable name      | Description                                        | Example value                                            |
| -------------------------------------- | -------------------------------------------------- | -------------------------------------------------------- |
| spring.data.cassandra.contact_points   | Azure Cosmos DB for Apache Cassandra contact point | `<Azure-Cosmos-DB-account>.cassandra.cosmos.azure.com` |
| spring.data.cassandra.port             | Cassandra connection port                          | 10350                                                    |
| spring.data.cassandra.keyspace_name    | Cassandra keyspace                                 | `<keyspace>`                                           |
| spring.data.cassandra.username         | Cassandra username                                 | `<username>`                                           |
| spring.data.cassandra.password         | Cassandra password                                 | `<password>`                                           |
| spring.data.cassandra.local_datacenter | Azure Region                                       | `<Azure-region>`                                       |
| spring.data.cassandra.ssl              | SSL status                                         | true                                                     |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
