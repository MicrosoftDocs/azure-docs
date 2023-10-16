---
title: Integrate Azure Table Storage with Service Connector
description: Integrate Azure Table Storage into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 08/11/2022
ms.custom: event-tier1-build-2022
---
# Integrate Azure Table Storage with Service Connector

This page shows the supported authentication types and client types of Azure Table Storage using Service Connector. You might still be able to connect to Azure Table Storage in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service
- Azure Functions
- Azure Container Apps
- Azure Spring Apps

Supported authentication and clients for App Service, Azure Functions, Container Apps and Azure Spring Apps:

| Client type | System-assigned managed identity   | User-assigned managed identity     | Secret / connection string         | Service principal                  |
| ----------- | ---------------------------------- | ---------------------------------- | ---------------------------------- | ---------------------------------- |
| .NET        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js     | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python      | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

## Default environment variable names or application properties

Use the connection details below to connect compute services to Azure Table Storage. For each example below, replace the placeholder texts `<account-name>` and `<account-key>` with your own account name and account key.

### Secret / connection string

| Default environment variable name   | Description                     | Example value                                                                                                          |
| ----------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| AZURE_STORAGETABLE_CONNECTIONSTRING | Table storage connection string | `DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net` |

### System-assigned managed identity

| Default environment variable name   | Description            | Example value                                              |
| ----------------------------------- | ---------------------- | ---------------------------------------------------------- |
| AZURE_STORAGETABLE_RESOURCEENDPOINT | Table storage endpoint | `https://<storage-account-name>.table.core.windows.net/` |

### User-assigned managed identity

| Default environment variable name   | Description            | Example value                                              |
| ----------------------------------- | ---------------------- | ---------------------------------------------------------- |
| AZURE_STORAGETABLE_RESOURCEENDPOINT | Table storage endpoint | `https://<storage-account-name>.table.core.windows.net/` |
| AZURE_STORAGETABLE_CLIENTID         | Your client ID         | `<client-ID>`                                            |

### Service principal

| Default environment variable name   | Description            | Example value                                              |
| ----------------------------------- | ---------------------- | ---------------------------------------------------------- |
| AZURE_STORAGETABLE_RESOURCEENDPOINT | Table storage endpoint | `https://<storage-account-name>.table.core.windows.net/` |
| AZURE_STORAGETABLE_CLIENTID         | Your client ID         | `<client-ID>`                                            |
| AZURE_STORAGETABLE_CLIENTSECRET     | Your client secret     | `<client-secret>`                                        |
| AZURE_STORAGETABLE_TENANTID         | Your tenant ID         | `<tenant-ID>`                                            |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
