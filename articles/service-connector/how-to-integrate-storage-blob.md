---
title: Integrate Azure Blob Storage with Service Connector
description: Integrate Azure Blob Storage into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: service-connector
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 05/03/2022
---

# Integrate Azure Blob Storage with Service Connector

This page shows the supported authentication types and client types of Azure Blob Storage using Service Connector. You might still be able to connect to Azure Blob Storage in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service
- Azure Spring Cloud

## Supported Authentication types and client types

| Client Type | System-assigned Managed Identity | User-assigned Managed Identity | Secret/ConnectionString | Service Principal |
| --- | --- | --- | --- | --- |
| .NET | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot | | | ![yes icon](./media/green-check.png) | |
| Node.js | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |


## Default environment variable names or application properties

### .NET, Java, Node.JS, Python

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_STORAGEBLOB_CONNECTIONSTRING | Blob storage connection string | `DefaultEndpointsProtocol=https;AccountName={accountName};AccountKey={****};EndpointSuffix=core.windows.net` |

**System-assigned Managed Identity**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_STORAGEBLOB_RESOURCEENDPOINT | Blob storage endpoint | `https://{storageAccountName}.blob.core.windows.net/` |

**User-assigned Managed Identity**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_STORAGEBLOB_RESOURCEENDPOINT | Blob storage endpoint | `https://{storageAccountName}.blob.core.windows.net/` |
| AZURE_STORAGEBLOB_CLIENTID | Your client ID | `{yourClientID}` |

**Service Principal**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_STORAGEBLOB_RESOURCEENDPOINT | Blob storage endpoint | `https://{storageAccountName}.blob.core.windows.net/` |
| AZURE_STORAGEBLOB_CLIENTID | Your client ID | `{yourClientID}` |
| AZURE_STORAGEBLOB_CLIENTSECRET | Your client secret | `{yourClientSecret}` |
| AZURE_STORAGEBLOB_TENANTID | Your tenant ID | `{yourTenantID}` |

### Java - Spring Boot

**Secret/ConnectionString**

| Application properties | Description | Example value |
| --- | --- | --- |
| azure.storage.account-name | Your blob storage account name | `{storageAccountName}` |
| azure.storage.account-key | Your blob storage account key | `{yourSecret}` |
| azure.storage.blob-endpoint | Your blob storage endpoint | `https://{storageAccountName}.blob.core.windows.net/` |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
