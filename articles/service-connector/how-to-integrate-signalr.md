---
title: Integrate Azure SignalR Service with Service Connector
description: Integrate Azure SignalR Service into your application with Service Connector. Learn about authentication types and client types of Azure SignalR Service.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 10/31/2023
ms.custom:
- ignite-fall-2021
- kr2b-contr-experiment
- event-tier1-build-2022
---

# Integrate Azure SignalR Service with Service Connector

This article supported authentication methods and clients, and shows sample code you can use to connect Azure SignalR Service to other cloud services using Service Connector. This article also shows default environment variable name and value or Spring Boot configuration that you get when you create the service connection. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

## Supported compute service

- Azure App Service
- Azure Container Apps

## Supported authentication types and client types

Supported authentication and clients for App Service and Container Apps:

| Client type | System-assigned managed identity     | User-assigned managed identity       | Secret / connection string           | Service principal                    |
|-------------|--------------------------------------|--------------------------------------|--------------------------------------|--------------------------------------|
| .NET        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| None        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

---

## Default environment variable names or application properties

Use environment variable names listed below to connect compute services to Azure SignalR Service. For each example below, replace the placeholder texts
`<SignalR-name>`, `<access-key>`, `<client-ID>`, `<tenant-ID>`, and `<client-secret>` with your own SignalR name, access key, client ID, tenant ID and client secret.

### System-assigned Managed Identity

  | Default environment variable name | Description | Example value |
  | --- | --- | --- |
  | AZURE_SIGNALR_CONNECTIONSTRING | SignalR Service connection string with Managed Identity | `Endpoint=https://<SignalR-name>.service.signalr.net;AuthType=aad;<client-ID>;Version=1.0;` |

#### Sample code
Refer to the steps and code below to connect to Azure SignalR Service using a system-assigned managed identity.
[!INCLUDE [code for signalR](./includes/code-signalr.md)]

### User-assigned Managed Identity

  | Default environment variable name | Description | Example value |
  | --- | --- | --- |
  | AZURE_SIGNALR_CONNECTIONSTRING | SignalR Service connection string with Managed Identity | `Endpoint=https://<SignalR-name>.service.signalr.net;AuthType=aad;client-id=<client-id>;Version=1.0;` |

#### Sample code
Refer to the steps and code below to connect to Azure SignalR Service using a user-assigned managed identity.
[!INCLUDE [code for signalR](./includes/code-signalr.md)]


### Connection string

  | Default environment variable name | Description | Example value |
  | --- | --- | --- |
  | AZURE_SIGNALR_CONNECTIONSTRING | SignalR Service connection string | `Endpoint=https://<SignalR-name>.service.signalr.net;AccessKey=<access-key>;Version=1.0;` |

#### Sample code
Refer to the steps and code below to connect to Azure SignalR Service using a connection string.
[!INCLUDE [code for signalR](./includes/code-signalr.md)]

### Service Principal

  | Default environment variable name | Description | Example value |
  | --- | --- | --- |
  | AZURE_SIGNALR_CONNECTIONSTRING | SignalR Service connection string with Service Principal | `Endpoint=https://<SignalR-name>.service.signalr.net;AuthType=aad;ClientId=<client-ID>;ClientSecret=<client-secret>;TenantId=<tenant-ID>;Version=1.0;` |

#### Sample code
Refer to the steps and code below to connect to Azure SignalR Service using a service principal.
[!INCLUDE [code for signalR](./includes/code-signalr.md)]

## Next steps

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
