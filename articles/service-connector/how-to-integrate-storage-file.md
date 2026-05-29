---
title: Integrate Azure Files with Service Connector
description: Integrate Azure Files into your application by using Service Connector.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 04/08/2026
#customer intent: As an Azure app developer, I want to see authentication methods, environment variables, and sample code for connecting Azure Files, so I can integrate Azure Files into my Azure apps.
---

# Integrate Azure Files with Service Connector

This article shows supported clients, authentication methods, and sample code you can use to connect Azure Files to other Azure services using Service Connector. This article also shows the default environment variables you need to create the service connections.

## Supported compute services

You can use Service Connector to connect the following Azure compute services to Azure Files:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Spring Apps

## Supported clients and authentication type

The following client types support connecting Azure Files to Azure compute services by using Service Connector:

- .NET
- Java
- Java Spring Boot
- Node.js
- Python
- PHP
- Ruby

>[!NOTE]
>You might be able to connect to Azure Files in other programming languages without using Service Connector.

Azure Files supports only secret or connection string authentication. System-assigned managed identity, user-assigned managed identity, and service principal authentication aren't available.

> [!IMPORTANT]
> The secret or connection string authentication flow requires a high degree of trust in the application, and carries risks not present in other flows. You should use this flow only when more secure flows, such as managed identities, aren't available.

## Default environment variables

Use the following connection details to connect supported Azure compute services to Azure Files. In the values, replace the following placeholders with the values for your app:

- `<account-name>`
- `<account-key>`
- `<storage-account-name>`
- `<storage-account-key>`

For more information about naming conventions, see [Configuration naming convention](concept-service-connector-internals.md#configuration-naming-convention).

#### All client types except Spring Boot

| Default environment variable name  | Description                    | Example value                                                                                                        |
|------------------------------------|--------------------------------|----------------------------------------------------------------------------------------------------------------------|
| AZURE_STORAGEFILE_CONNECTIONSTRING | File storage connection string | `DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net` |

#### Spring Boot client type

| Application properties      | Description               | Example value                                             |
| --------------------------- | ------------------------- | --------------------------------------------------------- |
| azure.storage.account-name  | File storage account name | `<storage-account-name>`                                |
| azure.storage.account-key   | File storage account key  | `<storage-account-key>`                                 |
| azure.storage.file-endpoint | File storage endpoint     | `https://<storage-account-name>.file.core.windows.net/` |
| spring.cloud.azure.storage.fileshare.account-name | File storage account name for Spring Cloud Azure version above 4.0 | `<storage-account-name>`   |
| spring.cloud.azure.storage.fileshare.account-key  | File storage account key for Spring Cloud Azure version above 4.0  | `<storage-account-key>`    |
| spring.cloud.azure.storage.fileshare.endpoint     | File storage endpoint for Spring Cloud Azure version above 4.0     | `https://<storage-account-name>.file.core.windows.net/` |

## Sample connection code

Use the following steps and sample code to connect to Azure Files using an account key with Service Connector.

[!INCLUDE [code sample for azure files](includes/code-file-secret.md)]

## Related content

- [Service Connector concepts](concept-service-connector-internals.md)
- [Configuration naming convention](concept-service-connector-internals.md#configuration-naming-convention)
