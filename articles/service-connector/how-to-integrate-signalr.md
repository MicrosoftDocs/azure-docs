---
title: Integrate Azure SignalR Service with Service Connector
description: Integrate Azure SignalR Service into your application with Service Connector. Learn about authentication types and client types of Azure SignalR Service.
author: shizn
ms.author: xshi
ms.service: service-connector
ms.topic: how-to
ms.date: 5/25/2022
ms.custom:
- ignite-fall-2021
- kr2b-contr-experiment
- event-tier1-build-2022
---

# Integrate Azure SignalR Service with Service Connector

This article shows the supported authentication types and client types of Azure SignalR Service using Service Connector. This article also shows default environment variable name and value or Spring Boot configuration that you get when you create the service connection. For more information, see [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service

## Supported authentication types and client types

| Client Type | System-assigned Managed Identity | User-assigned Managed Identity | Secret/ConnectionString | Service Principal |
| --- | --- | --- | --- | --- |
| .NET | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

## Default environment variable names or application properties

### .NET

- Secret/ConnectionString

  | Default environment variable name | Description | Example value |
  | --- | --- | --- |
  | AZURE_SIGNALR_CONNECTIONSTRING | SignalR Service connection string | `Endpoint=https://{signalrName}.service.signalr.net;AccessKey={};Version=1.0;` |

- System-assigned Managed Identity

  | Default environment variable name | Description | Example value |
  | --- | --- | --- |
  | AZURE_SIGNALR_CONNECTIONSTRING | SignalR Service connection string with Managed Identity | `Endpoint=https://{signalrName}.service.signalr.net;AuthType=aad;ClientId={};Version=1.0;` |

- User-assigned Managed Identity

  | Default environment variable name | Description | Example value |
  | --- | --- | --- |
  | AZURE_SIGNALR_CONNECTIONSTRING | SignalR Service connection string with Managed Identity | `Endpoint=https://{signalrName}.service.signalr.net;AuthType=aad;ClientId={};Version=1.0;` |

- Service Principal

  | Default environment variable name | Description | Example value |
  | --- | --- | --- |
  | AZURE_SIGNALR_CONNECTIONSTRING | SignalR Service connection string with Service Principal | `Endpoint=https://{signalrName}.service.signalr.net;AuthType=aad;ClientId={};ClientSecret={};TenantId={};Version=1.0;` |

## Next steps

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
