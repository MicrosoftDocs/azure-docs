---
title: Integrate Azure Blob Storage with Service Connector
description: Integrate Azure Blob Storage into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: service-connector
ms.topic: how-to 
ms.date: 10/29/2021
---

# Integrate Azure Blob Storage with Service Connector

## Supported compute service

- Azure App Service
- Azure Spring Cloud

## Supported Authentication types and client types

| Client Type | System-assigned Managed Identity | User-assigned Managed Identity | Secret/ConnectionString | Service Principal |
| --- | --- | --- | --- | --- |
| .Net | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |


## Default environment variable names or application properties

### .NET, Java, Node.JS, Python

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_STORAGEBLOB_CONNECTIONSTRING | | `DefaultEndpointsProtocol=https;AccountName={accountName};AccountKey={****};EndpointSuffix=core.windows.net` |

**System-assigned Managed Identity**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_STORAGEBLOB_RESOURCEENDPOINT | | `https://{storageAccountName}.blob.core.windows.net/` |

**User-assigned Managed Identity**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_STORAGEBLOB_RESOURCEENDPOINT | | `https://{storageAccountName}.blob.core.windows.net/` |
| AZURE_STORAGEBLOB_CLIENTID | | `{yourClientID}` |

**Service Principal**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_STORAGEBLOB_RESOURCEENDPOINT | | `https://{storageAccountName}.blob.core.windows.net/` |
| AZURE_STORAGEBLOB_CLIENTID | | `{yourClientID}` |
| AZURE_STORAGEBLOB_CLIENTSECRET | | `{yourClientSecret}` |
| AZURE_STORAGEBLOB_TENANTID | | `{yourTenantID}` |

### Java - Spring Boot

**Secret/ConnectionString**

| Application properties | Description | Example value |
| --- | --- | --- |
| azure.storage.account-name | | `{storageAccountName}` |
| azure.storage.account-key | | `{yourSecret}` |
| azure.storage.blob-endpoint | | `https://{storageAccountName}.blob.core.windows.net/` |
