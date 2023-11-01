---
title: Integrate the Azure Cosmos DB for Apache Cassandra with Service Connector
description: Integrate the Azure Cosmos DB for Apache Cassandra into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 10/20/2023
ms.custom: event-tier1-build-2022, ignite-2022
---

# Integrate Azure Cosmos DB for Cassandra with Service Connector

This page shows the supported authentication types and client types for the Azure Cosmos DB for Apache Cassandra using Service Connector. You might still be able to connect to the Azure Cosmos DB for Cassandra in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection and sample code showing how to use them. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

## Supported compute services

- Azure App Service
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

Supported authentication and clients for App Service, Container Apps and Azure Spring Apps:

| Client type        | System-assigned managed identity     | User-assigned managed identity       | Secret / connection string           | Service principal                    |
|--------------------|--------------------------------------|--------------------------------------|--------------------------------------|--------------------------------------|
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Go                 | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot |                                      |                                      | ![yes icon](./media/green-check.png) |                                      |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

---

## Default environment variable names or application properties and Sample code

Reference the connection details and sample code in the following tables, according to your connection's authentication type and client type, to connect your compute services to Azure Cosmos DB for Apache Cassandra.

### Connect with System-assigned Managed Identity

| Default environment variable name | Description                          | Example value                                                                                                                                                                                                      |
|-----------------------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AZURE_COSMOS_LISTKEYURL           | The URL to get the connection string | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<Azure-Cosmos-DB-account>/listKeys?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                | Your managed identity scope          | `https://management.azure.com/.default`                                                                                                                                                                            |
| AZURE_COSMOS_RESOURCEENDPOINT     | Your resource endpoint               | `https://<Azure-Cosmos-DB-account>.documents.azure.com:443/`                                                                                                                                                               |
| AZURE_COSMOS_CONTACTPOINT         | Azure Cosmos DB for Apache Cassandra contact point          | `<Azure-Cosmos-DB-account>.cassandra.cosmos.azure.com`                                                                                                                                                                     |
| AZURE_COSMOS_PORT                 | Cassandra connection port            | 10350                                                                                                                                                                                                              |
| AZURE_COSMOS_KEYSPACE             | Cassandra keyspace                   | `<keyspace>`                                                                                                                                                                                                       |
| AZURE_COSMOS_USERNAME             | Cassandra username                   | `<username>`                                                                                                                                                                                                       |

#### Sample code

Refer to the steps and code below to connect to Azure Cosmos DB for Cassandra using a system-assigned managed identity.
[!INCLUDE [code sample for cassandra](./includes/code-cosmoscassandra-me-id.md)]

### Connect with User-assigned Managed Identity

| Default environment variable name | Description                          | Example value                                                                                                                                                                                                      |
|-----------------------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AZURE_COSMOS_LISTKEYURL           | The URL to get the connection string | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<Azure-Cosmos-DB-account>/listKeys?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                | Your managed identity scope          | `https://management.azure.com/.default`                                                                                                                                                                            |
| AZURE_COSMOS_RESOURCEENDPOINT     | Your resource endpoint               | `https://<Azure-Cosmos-DB-account>.documents.azure.com:443/`                                                                                                                                                               |
| AZURE_COSMOS_CONTACTPOINT         | Azure Cosmos DB for Apache Cassandra contact point          | `<Azure-Cosmos-DB-account>.cassandra.cosmos.azure.com`                                                                                                                                                                     |
| AZURE_COSMOS_PORT                 | Cassandra connection port            | 10350                                                                                                                                                                                                              |
| AZURE_COSMOS_KEYSPACE             | Cassandra keyspace                   | `<keyspace>`                                                                                                                                                                                                       |
| AZURE_COSMOS_USERNAME             | Cassandra username                   | `<username>`                                                                                                                                                                                                       |
| AZURE_COSMOS_CLIENTID             | Your client ID                       | `<client-ID>`                                                                                                                                                                                                      |

#### Sample code

Refer to the steps and code below to connect to Azure Cosmos DB for Cassandra using a user-assigned managed identity.
[!INCLUDE [code sample for cassandra](./includes/code-cosmoscassandra-me-id.md)]

### Connect with Connection String

#### SpringBoot client type

| Default environment variable name      | Description                 | Example value                                          |
|----------------------------------------|-----------------------------|--------------------------------------------------------|
| spring.data.cassandra.contact-points   | Azure Cosmos DB for Apache Cassandra contact point | `<Azure-Cosmos-DB-account>.cassandra.cosmos.azure.com` |
| spring.data.cassandra.port             | Cassandra connection port   | 10350                                                  |
| spring.data.cassandra.keyspace-name    | Cassandra keyspace          | `<keyspace>`                                           |
| spring.data.cassandra.username         | Cassandra username          | `<username>`                                           |
| spring.data.cassandra.password         | Cassandra password          | `<password>`                                           |
| spring.data.cassandra.local-datacenter | Azure Region                | `<Azure-region>`                                       |
| spring.data.cassandra.ssl              | SSL status                  | true                                                   |

#### Other client types

| Default environment variable name | Description                 | Example value                                  |
|-----------------------------------|-----------------------------|------------------------------------------------|
| AZURE_COSMOS_CONTACTPOINT         | Azure Cosmos DB for Apache Cassandra contact point | `<Azure-Cosmos-DB-account>.cassandra.cosmos.azure.com` |
| AZURE_COSMOS_PORT                 | Cassandra connection port   | 10350                                          |
| AZURE_COSMOS_KEYSPACE             | Cassandra keyspace          | `<keyspace>`                                   |
| AZURE_COSMOS_USERNAME             | Cassandra username          | `<username>`                                   |
| AZURE_COSMOS_PASSWORD             | Cassandra password          | `<password>`                                   |

#### Sample code

Refer to the steps and code below to connect to Azure Cosmos DB for Cassandra using a connection string.
[!INCLUDE [code sample for blob](./includes/code-cosmoscassandra-secret.md)]


#### Service principal

| Default environment variable name | Description                          | Example value                                                                                                                                                                                                      |
|-----------------------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AZURE_COSMOS_LISTKEYURL           | The URL to get the connection string | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<Azure-Cosmos-DB-account>/listKeys?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                | Your managed identity scope          | `https://management.azure.com/.default`                                                                                                                                                                            |
| AZURE_COSMOS_RESOURCEENDPOINT     | Your resource endpoint               | `https://<Azure-Cosmos-DB-account>.documents.azure.com:443/`                                                                                                                                                               |
| AZURE_COSMOS_CONTACTPOINT         | Azure Cosmos DB for Apache Cassandra contact point          | `<Azure-Cosmos-DB-account>.cassandra.cosmos.azure.com`                                                                                                                                                                     |
| AZURE_COSMOS_PORT                 | Cassandra connection port            | 10350                                                                                                                                                                                                              |
| AZURE_COSMOS_KEYSPACE             | Cassandra keyspace                   | `<keyspace>`                                                                                                                                                                                                       |
| AZURE_COSMOS_USERNAME             | Cassandra username                   | `<username>`                                                                                                                                                                                                       |
| AZURE_COSMOS_CLIENTID             | Your client ID                       | `<client-ID>`                                                                                                                                                                                                      |
| AZURE_COSMOS_CLIENTSECRET         | Your client secret                   | `<client-secret>`                                                                                                                                                                                                  |
| AZURE_COSMOS_TENANTID             | Your tenant ID                       | `<tenant-ID>`                                                                                                                                                                                                      |

#### Sample code

Refer to the steps and code below to connect to Azure Cosmos DB for Cassandra using a service principal.
[!INCLUDE [code sample for cassandra](./includes/code-cosmoscassandra-me-id.md)]

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
