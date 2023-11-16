---
title: Integrate Azure Blob Storage with Service Connector
description: Integrate Azure Blob Storage into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 10/20/2023
---

# Integrate Azure Blob Storage with Service Connector

This page shows the supported authentication types, client types and sample code of Azure Blob Storage using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection.

## Supported compute services

- Azure App Service
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

Supported authentication and clients for App Service, Container Apps and Azure Spring Apps:


| Client type        | System-assigned managed identity     | User-assigned managed identity       | Secret / connection string           | Service principal                    |
|--------------------|--------------------------------------|--------------------------------------|--------------------------------------|--------------------------------------|
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot |                                      |                                      | ![yes icon](./media/green-check.png) |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Go             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| None               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |


---

## Default environment variable names or application properties and sample code

Reference the connection details and sample code in the following tables, according to your connection's authentication type and client type, to connect compute services to Azure Blob Storage. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

### System-assigned managed identity
For default environment variables and sample code of other authentication type, please choose from beginning of the documentation.

| Default environment variable name  | Description           | Example value                                           |
|------------------------------------|-----------------------|---------------------------------------------------------|
| AZURE_STORAGEBLOB_RESOURCEENDPOINT | Blob Storage endpoint | `https://<storage-account-name>.blob.core.windows.net/` |


#### Sample code

Refer to the steps and code below to connect to Azure Blob Storage using a system-assigned managed identity.
[!INCLUDE [code sample for blob](./includes/code-blob-me-id.md)]

### User-assigned managed identity

For default environment variables and sample code of other authentication type, please choose from beginning of the documentation.

| Default environment variable name  | Description           | Example value                                           |
|------------------------------------|-----------------------|---------------------------------------------------------|
| AZURE_STORAGEBLOB_RESOURCEENDPOINT | Blob Storage endpoint | `https://<storage-account-name>.blob.core.windows.net/` |
| AZURE_STORAGEBLOB_CLIENTID         | Your client ID        | `<client-ID>`                                           |

#### Sample code

Refer to the steps and code below to connect to Azure Blob Storage using a user-assigned managed identity.
[!INCLUDE [code sample for blob](./includes/code-blob-me-id.md)]

### Connection string

For default environment variables and sample code of other authentication type, please choose from beginning of the documentation.

#### SpringBoot client type

| Application properties      | Description                    | Example value                                           |
|-----------------------------|--------------------------------|---------------------------------------------------------|
| azure.storage.account-name  | Your Blob storage-account-name | `<storage-account-name>`                                |
| azure.storage.account-key   | Your Blob Storage account key  | `<account-key>`                                          |
| azure.storage.blob-endpoint | Your Blob Storage endpoint     | `https://<storage-account-name>.blob.core.windows.net/` |


#### Other client types
| Default environment variable name  | Description                    | Example value                                                                                                       |
|------------------------------------|--------------------------------|---------------------------------------------------------------------------------------------------------------------|
| AZURE_STORAGEBLOB_CONNECTIONSTRING | Blob Storage connection string | `DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net` |


#### Sample code

Refer to the steps and code below to connect to Azure Blob Storage using a connection string.
[!INCLUDE [code sample for blob](./includes/code-blob-secret.md)]

### Service principal

For default environment variables and sample code of other authentication type, please choose from beginning of the documentation.

| Default environment variable name  | Description           | Example value                                           |
|------------------------------------|-----------------------|---------------------------------------------------------|
| AZURE_STORAGEBLOB_RESOURCEENDPOINT | Blob Storage endpoint | `https://<storage-account-name>.blob.core.windows.net/` |
| AZURE_STORAGEBLOB_CLIENTID         | Your client ID        | `<client-ID>`                                           |
| AZURE_STORAGEBLOB_CLIENTSECRET     | Your client secret    | `<client-secret>`                                       |
| AZURE_STORAGEBLOB_TENANTID         | Your tenant ID        | `<tenant-ID>`                                           |

#### Sample code

Refer to the steps and code below to connect to Azure Blob Storage using a service principal.
[!INCLUDE [code sample for blob](./includes/code-blob-me-id.md)]

## Next steps

Follow the tutorials to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
