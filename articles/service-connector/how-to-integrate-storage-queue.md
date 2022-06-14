---
title: Integrate Azure Queue Storage with Service Connector
description: Integrate Azure Queue Storage into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: service-connector
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 06/13/2022
---

# Integrate Azure Queue Storage with Service Connector

This page shows the supported authentication types and client types of Azure Queue Storage using Service Connector. You might still be able to connect to Azure Queue Storage in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service
- Azure Container Apps
- Azure Spring Cloud

## Supported authentication types and client types

| Client type | System-assigned managed identity | User-assigned managed identity | Secret / connection string  | Service principal |
| --- | --- | --- | --- | --- |
| .NET | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot | ![yes icon](./media/green-check.png) | | | |
| Node.js | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

## Default environment variable names or application properties

### .NET, Java, Node.JS, Python

#### Secret/ connection string

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_STORAGEQUEUE_CONNECTIONSTRING | Queue storage connection string | `DefaultEndpointsProtocol=https;AccountName={accountName};AccountKey={****};EndpointSuffix=core.windows.net` |

#### System-assigned managed identity

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_STORAGEQUEUE_RESOURCEENDPOINT | Queue storage endpoint | `https://{StorageAccountName}.queue.core.windows.net/` |

#### User-assigned managed identity

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_STORAGEQUEUE_RESOURCEENDPOINT | Queue storage endpoint | `https://{storageAccountName}.queue.core.windows.net/` |
| AZURE_STORAGEQUEUE_CLIENTID | Your client ID | `{yourClientID}` |

#### Service principal

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_STORAGEQUEUE_RESOURCEENDPOINT | Queue storage endpoint | `https://{storageAccountName}.queue.core.windows.net/` |
| AZURE_STORAGEQUEUE_CLIENTID | Your client ID | `{yourClientID}` |
| AZURE_STORAGEQUEUE_CLIENTSECRET | Your client secret | `{yourClientSecret}` |
| AZURE_STORAGEQUEUE_TENANTID | Your tenant ID | `{yourTenantID}` |

### Java - Spring Boot

#### Java - Spring Boot secret / connection string

| Application properties | Description | Example value |
| --- | --- | --- |
| azure.storage.account-name | Queue storage account name | `{storageAccountName}` |
| azure.storage.account-key | Queue storage account key | `{yourSecret}` |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
