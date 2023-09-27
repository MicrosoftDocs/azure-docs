---
title: Integrate Azure Blob Storage with Service Connector
description: Integrate Azure Blob Storage into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 06/13/2022
zone_pivot_group_filename: service-connector/zone-pivot-groups.json
zone_pivot_groups: howto-authtype
---

# Integrate Azure Blob Storage with Service Connector

This page shows the supported authentication types, client types and sample codes of Azure Blob Storage using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. Also detail steps with sample codes about how to make connection to the blob storage. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

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

## Default environment variable names or application properties and sample codes

Reference the connection details and sample codes in following tables, accordings to your connection's authentication type and client type, to connect compute services to Azure Blob Storage. Please go to beginning of the documentation to choose authentication type.

::: zone pivot="system-identity"

### System-assigned managed identity
For default environment variables and sample codes of other authentication type, please choose from beginning of the documentation.

| Default environment variable name  | Description           | Example value                                           |
|------------------------------------|-----------------------|---------------------------------------------------------|
| AZURE_STORAGEBLOB_RESOURCEENDPOINT | Blob Storage endpoint | `https://<storage-account-name>.blob.core.windows.net/` |


#### Sample codes

Follow these steps and sample codes to connect to Azure Blob Storage with system-assigned managed identity.
[!INCLUDE [code sample for blob](./includes/code-blob-me-id.md)]

::: zone-end

::: zone pivot="user-identity"

### User-assigned managed identity

For default environment variables and sample codes of other authentication type, please choose from beginning of the documentation.

| Default environment variable name  | Description           | Example value                                           |
|------------------------------------|-----------------------|---------------------------------------------------------|
| AZURE_STORAGEBLOB_RESOURCEENDPOINT | Blob Storage endpoint | `https://<storage-account-name>.blob.core.windows.net/` |
| AZURE_STORAGEBLOB_CLIENTID         | Your client ID        | `<client-ID>`                                           |

#### Sample codes

Follow these steps and sample codes to connect to Azure Blob Storage with user-assigned managed identity.
[!INCLUDE [code sample for blob](./includes/code-blob-me-id.md)]

::: zone-end


::: zone pivot="connection-string"

### Connection string

For default environment variables and sample codes of other authentication type, please choose from beginning of the documentation.

#### SpringBoot client type

| Application properties      | Description                    | Example value                                           |
|-----------------------------|--------------------------------|---------------------------------------------------------|
| azure.storage.account-name  | Your Blob storage-account-name | `<storage-account-name>`                                |
| azure.storage.account-key   | Your Blob Storage account key  | `<account-key>`                                          |
| azure.storage.blob-endpoint | Your Blob Storage endpoint     | `https://<storage-account-name>.blob.core.windows.net/` |


#### other client types
| Default environment variable name  | Description                    | Example value                                                                                                       |
|------------------------------------|--------------------------------|---------------------------------------------------------------------------------------------------------------------|
| AZURE_STORAGEBLOB_CONNECTIONSTRING | Blob Storage connection string | `DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net` |


#### Sample codes

Follow these steps and sample codes to connect to Azure Blob Storage with connection string.
[!INCLUDE [code sample for blob](./includes/code-blob-secret.md)]

::: zone-end

::: zone pivot="service-principal"

### Service principal

For default environment variables and sample codes of other authentication type, please choose from beginning of the documentation.

| Default environment variable name  | Description           | Example value                                           |
|------------------------------------|-----------------------|---------------------------------------------------------|
| AZURE_STORAGEBLOB_RESOURCEENDPOINT | Blob Storage endpoint | `https://<storage-account-name>.blob.core.windows.net/` |
| AZURE_STORAGEBLOB_CLIENTID         | Your client ID        | `<client-ID>`                                           |
| AZURE_STORAGEBLOB_CLIENTSECRET     | Your client secret    | `<client-secret>`                                       |
| AZURE_STORAGEBLOB_TENANTID         | Your tenant ID        | `<tenant-ID>`                                           |

#### Sample codes

Follow these steps and sample codes to connect to Azure Blob Storage with service principal.
[!INCLUDE [code sample for blob](./includes/code-blob-me-id.md)]

::: zone-end

## Next steps

Follow the tutorials to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
