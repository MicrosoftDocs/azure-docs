---
title: Integrate Azure Queue Storage with Service Connector
description: Integrate Azure Queue Storage into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 10/25/2023
ms.custom: event-tier1-build-2022
---
# Integrate Azure Queue Storage with Service Connector

This page shows supported authentication methods and clients, and shows sample code you can use to connect Azure Queue Storage to other cloud services using Service Connector. You might still be able to connect to Azure Queue Storage in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. 

## Supported compute services

- Azure App Service
- Azure Functions
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

Supported authentication and clients for App Service, Azure Functions, Container Apps and Azure Spring Apps:

| Client type        | System-assigned managed identity   | User-assigned managed identity     | Secret / connection string         | Service principal                  |
| ------------------ | ---------------------------------- | ---------------------------------- | ---------------------------------- | ---------------------------------- |
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot |                                    |                                    | ![yes icon](./media/green-check.png) |                                    |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

---

## Default environment variable names or application properties and sample code

Use the connection details below to connect compute services to Queue Storage. For each example below, replace the placeholder texts
`<account name>`, `<account-key>`, `<client-ID>`,  `<client-secret>`, `<tenant-ID>`, and `<storage-account-name>` with your own account name, account key, client ID, client secret, tenant ID and storage account name. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### System-assigned managed identity

| Default environment variable name   | Description            | Example value                                              |
| ----------------------------------- | ---------------------- | ---------------------------------------------------------- |
| AZURE_STORAGEQUEUE_RESOURCEENDPOINT | Queue storage endpoint | `https://<storage-account-name>.queue.core.windows.net/` |

#### Sample code
Refer to the steps and code below to connect to Azure Queue Storage using a system-assigned managed identity.
[!INCLUDE [code sample for queue](./includes/code-queue-me-id.md)]


### User-assigned managed identity

| Default environment variable name   | Description            | Example value                                              |
| ----------------------------------- | ---------------------- | ---------------------------------------------------------- |
| AZURE_STORAGEQUEUE_RESOURCEENDPOINT | Queue storage endpoint | `https://<storage-account-name>.queue.core.windows.net/` |
| AZURE_STORAGEQUEUE_CLIENTID         | Your client ID         | `<client-ID>`                                            |

#### Sample code
Refer to the steps and code below to connect to Azure Queue Storage using a user-assigned managed identity.
[!INCLUDE [code sample for queue](./includes/code-queue-me-id.md)]

### Connection string

#### SpringBoot client type

| Application properties                 | Description                | Example value            |
|----------------------------------------|----------------------------|--------------------------|
| spring.cloud.azure.storage.account     | Queue storage account name | `<storage-account-name>` |
| spring.cloud.azure.storage.access-key  | Queue storage account key  | `<account-key>`          |
| spring.cloud.azure.storage.queue.account-name | Queue storage account name for Spring Cloud Azure version above 4.0 | `<storage-account-name>` |
| spring.cloud.azure.storage.queue.account-key  | Queue storage account key for Spring Cloud Azure version above 4.0  | `<account-key>`          |
| spring.cloud.azure.storage.queue.endpoint     | Queue storage endpoint for Spring Cloud Azure version above 4.0     | `https://<storage-account-name>.queue.core.windows.net/` |

#### Other client types

| Default environment variable name   | Description                     | Example value                                                                                                        |
|-------------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------|
| AZURE_STORAGEQUEUE_CONNECTIONSTRING | Queue storage connection string | `DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net` |


#### Sample code
Refer to the steps and code below to connect to Azure Queue Storage using a connection string.
[!INCLUDE [code sample for queue](./includes/code-queue-secret.md)]

### Service principal

| Default environment variable name   | Description            | Example value                                              |
| ----------------------------------- | ---------------------- | ---------------------------------------------------------- |
| AZURE_STORAGEQUEUE_RESOURCEENDPOINT | Queue storage endpoint | `https://<storage-account-name>.queue.core.windows.net/` |
| AZURE_STORAGEQUEUE_CLIENTID         | Your client ID         | `<client-ID>`                                            |
| AZURE_STORAGEQUEUE_CLIENTSECRET     | Your client secret     | `<client-secret>`                                        |
| AZURE_STORAGEQUEUE_TENANTID         | Your tenant ID         | `<tenant-ID>`                                            |

#### Sample code
Refer to the steps and code below to connect to Azure Queue Storage using a service principal.
[!INCLUDE [code sample for queue](./includes/code-queue-me-id.md)]

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
