---
title: Integrate Azure SignalR Service with Service Connector
description: Integrate Azure SignalR Service into your application with Service Connector. Learn about authentication types and client types of Azure SignalR Service.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 08/11/2022
ms.custom:
- ignite-fall-2021
- kr2b-contr-experiment
- event-tier1-build-2022
---

# Integrate Azure SignalR Service with Service Connector

This article shows the supported authentication types and client types of Azure SignalR Service using Service Connector. This article also shows default environment variable name and value or Spring Boot configuration that you get when you create the service connection. For more information, see [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service
- Azure Container Apps

## Supported authentication types and client types

Supported authentication and clients for App Service and Container Apps:

### [Azure App Service](#tab/app-service)

| Client type | System-assigned managed identity     | User-assigned managed identity       | Secret / connection string           | Service principal                    |
|-------------|--------------------------------------|--------------------------------------|--------------------------------------|--------------------------------------|
| .NET        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| None        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

### [Azure Container Apps](#tab/container-apps)

| Client type | System-assigned managed identity     | User-assigned managed identity       | Secret / connection string           | Service principal                    |
|-------------|--------------------------------------|--------------------------------------|--------------------------------------|--------------------------------------|
| .NET        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| None        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

---

## Default environment variable names or application properties

Use the connection details below to connect compute services to SignalR. For each example below, replace the placeholder texts
`<SignalR-name>`, `<access-key>`, `<client-ID>`, `<tenant-ID>`, and `<client-secret>` with your own SignalR name, access key, client ID, tenant ID and client secret.

### .NET

#### Secret / Connection string

  | Default environment variable name | Description | Example value |
  | --- | --- | --- |
  | AZURE_SIGNALR_CONNECTIONSTRING | SignalR Service connection string | `Endpoint=https://<SignalR-name>.service.signalr.net;AccessKey=<access-key>;Version=1.0;` |

#### System-assigned Managed Identity

  | Default environment variable name | Description | Example value |
  | --- | --- | --- |
  | AZURE_SIGNALR_CONNECTIONSTRING | SignalR Service connection string with Managed Identity | `Endpoint=https://<SignalR-name>.service.signalr.net;AuthType=aad;<client-ID>;Version=1.0;` |

#### User-assigned Managed Identity

  | Default environment variable name | Description | Example value |
  | --- | --- | --- |
  | AZURE_SIGNALR_CONNECTIONSTRING | SignalR Service connection string with Managed Identity | `Endpoint=https://<SignalR-name>.service.signalr.net;AuthType=aad;client-id=<client-id>;Version=1.0;` |

#### Service Principal

  | Default environment variable name | Description | Example value |
  | --- | --- | --- |
  | AZURE_SIGNALR_CONNECTIONSTRING | SignalR Service connection string with Service Principal | `Endpoint=https://<SignalR-name>.service.signalr.net;AuthType=aad;ClientId=<client-ID>;ClientSecret=<client-secret>;TenantId=<tenant-ID>;Version=1.0;` |

## Next steps

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
