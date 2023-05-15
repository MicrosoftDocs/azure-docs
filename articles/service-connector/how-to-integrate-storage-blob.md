---
title: Integrate Azure Blob Storage with Service Connector
description: Integrate Azure Blob Storage into your application with Service Connector
author: mcleanbyron
ms.author: mcleans
ms.service: service-connector
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 06/13/2022
---

# Integrate Azure Blob Storage with Service Connector

This page shows the supported authentication types and client types of Azure Blob Storage using Service Connector. You might still be able to connect to Azure Blob Storage in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

Supported authentication and clients for App Service, Container Apps and Azure Spring Apps:

### [Azure App Service](#tab/app-service)

| Client type        | System-assigned managed identity     | User-assigned managed identity       | Secret / connection string           | Service principal                    |
|--------------------|--------------------------------------|--------------------------------------|--------------------------------------|--------------------------------------|
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot |                                      |                                      | ![yes icon](./media/green-check.png) |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| None               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

### [Azure Container Apps](#tab/container-apps)

| Client type        | System-assigned managed identity     | User-assigned managed identity       | Secret / connection string           | Service principal                    |
|--------------------|--------------------------------------|--------------------------------------|--------------------------------------|--------------------------------------|
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot |                                      |                                      | ![yes icon](./media/green-check.png) |                                      |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| None               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

### [Azure Spring Apps](#tab/spring-apps)

| Client type        | System-assigned managed identity     | User-assigned managed identity | Secret / connection string           | Service principal                    |
|--------------------|--------------------------------------|--------------------------------|--------------------------------------|--------------------------------------|
| .NET               | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot |                                      |                                | ![yes icon](./media/green-check.png) |                                      |
| Node.js            | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python             | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| None               | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

---

## Default environment variable names or application properties

Use the connection details below to connect compute services to Blob Storage. For each example below, replace the placeholder texts
`<account name>`, `<account-key>`, `<client-ID>`,  `<client-secret>`, `<tenant-ID>`, and `<storage-account-name>` with your own account name, account key, client ID, client secret, tenant ID and storage account name.

### Azure App Service and Azure Container Apps

#### Secret / connection string

| Default environment variable name  | Description                    | Example value                                                                                                       |
|------------------------------------|--------------------------------|---------------------------------------------------------------------------------------------------------------------|
| AZURE_STORAGEBLOB_CONNECTIONSTRING | Blob Storage connection string | `DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net` |

#### system-assigned managed identity

| Default environment variable name  | Description           | Example value                                           |
|------------------------------------|-----------------------|---------------------------------------------------------|
| AZURE_STORAGEBLOB_RESOURCEENDPOINT | Blob Storage endpoint | `https://<storage-account-name>.blob.core.windows.net/` |

#### User-assigned managed identity

| Default environment variable name  | Description           | Example value                                           |
|------------------------------------|-----------------------|---------------------------------------------------------|
| AZURE_STORAGEBLOB_RESOURCEENDPOINT | Blob Storage endpoint | `https://<storage-account-name>.blob.core.windows.net/` |
| AZURE_STORAGEBLOB_CLIENTID         | Your client ID        | `<client-ID>`                                           |

#### Service principal

| Default environment variable name  | Description           | Example value                                           |
|------------------------------------|-----------------------|---------------------------------------------------------|
| AZURE_STORAGEBLOB_RESOURCEENDPOINT | Blob Storage endpoint | `https://<storage-account-name>.blob.core.windows.net/` |
| AZURE_STORAGEBLOB_CLIENTID         | Your client ID        | `<client-ID>`                                           |
| AZURE_STORAGEBLOB_CLIENTSECRET     | Your client secret    | `<client-secret>`                                       |
| AZURE_STORAGEBLOB_TENANTID         | Your tenant ID        | `<tenant-ID>`                                           |

### Azure Spring Apps

#### secret / connection string

| Application properties      | Description                    | Example value                                           |
|-----------------------------|--------------------------------|---------------------------------------------------------|
| azure.storage.account-name  | Your Blob storage-account-name | `<storage-account-name>`                                |
| azure.storage.account-key   | Your Blob Storage account key  | `<account-key>`                                          |
| azure.storage.blob-endpoint | Your Blob Storage endpoint     | `https://<storage-account-name>.blob.core.windows.net/` |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
