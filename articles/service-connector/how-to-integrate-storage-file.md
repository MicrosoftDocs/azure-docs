---
title: Integrate Azure Files with Service Connector
description: Integrate Azure Files into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 08/11/2022
ms.custom: event-tier1-build-2022
---
# Integrate Azure Files with Service Connector

This page shows the supported authentication types and client types of Azure Files using Service Connector. You might still be able to connect to Azure Files in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service
- Azure Functions
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

Supported authentication and clients for App Service, Azure Functions, Container Apps and Azure Spring Apps:

| Client Type        | System-assigned managed identity | User-assigned managed identity | Secret / connection string         | Service principal |
| ------------------ | -------------------------------- | ------------------------------ | ---------------------------------- | ----------------- |
| .NET               |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Java               |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Java - Spring Boot |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Node.js            |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Python             |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| PHP                |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| Ruby               |                                  |                                | ![yes icon](./media/green-check.png) |                   |
| None               |                                  |                                | ![yes icon](./media/green-check.png) |                   |

## Default environment variable names or application properties

Use the connection details below to connect compute services to Azure Files. For each example below, replace the placeholder texts `<account-name>`, `<account-key>`, `<storage-account-name>` and `<storage-account-key>` with your own account name, account key, storage account name, and storage account key.

### Azure App Service secret / connection string

| Default environment variable name  | Description                    | Example value                                                                                                          |
| ---------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| AZURE_STORAGEFILE_CONNECTIONSTRING | File storage connection string | `DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net` |

### Azure Spring Cloud secret / connection string

| Application properties      | Description               | Example value                                             |
| --------------------------- | ------------------------- | --------------------------------------------------------- |
| azure.storage.account-name  | File storage account name | `<storage-account-name>`                                |
| azure.storage.account-key   | File storage account key  | `<storage-account-key>`                                 |
| azure.storage.file-endpoint | File storage endpoint     | `https://<storage-account-name>.file.core.windows.net/` |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
