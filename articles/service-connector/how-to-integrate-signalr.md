---
title: Integrate Azure SignalR Service with Service Connector
description: Integrate Azure SignalR Service into your application with Service Connector. Learn about authentication types and client types of Azure SignalR Service.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 04/07/2026
ms.custom:
  - kr2b-contr-experiment
#customer intent: As an Azure app developer, I want to see authentication methods, environment variables, and sample code for integrating Azure SignalR Service, so I can use Service Connector to easily connect SignalR to my Azure compute services.

---

# Integrate Azure SignalR Service with Service Connector

This article shows supported clients, authentication methods, and sample code you can use to connect Azure SignalR Service to other Azure services using Service Connector. The article also shows the default environment variables and Spring Boot configurations you need to create the service connections.

## Supported compute services

You can use Service Connector to connect the following compute services to Azure SignalR Service:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Spring Apps

## Supported clients and authentication types

You can use Service Connector to connect Azure SignalR Service to Azure compute services by using .NET or other languages. All clients that support using Service Connector to connect Azure SignalR Service to Azure compute services support managed identity, service principal, or secret authentication types.

> [!IMPORTANT]
> The secret connection string authentication flow requires a high degree of trust in the application, and carries risks not present in other flows. You should use this flow only when more secure flows, such as managed identities, aren't viable.

## Default environment variables

Use the following connection details to connect supported Azure compute services to Azure SignalR Service using managed identity, service principal, or secret authentication types. In the examples, replace the following placeholders with the values from your Azure SignalR Service:

- `<SignalR-name>`
- `<access-key>`
- `<client-ID>`
- `<tenant-ID>`
- `<client-secret>`

For more information about naming conventions, see [Configuration naming convention](concept-service-connector-internals.md#configuration-naming-convention).

### System- or user-assigned managed identity

| Default environment variable  | Description | Example value |
| --- | --- | --- |
| AZURE_SIGNALR_CONNECTIONSTRING | SignalR Service connection string with managed identity | `Endpoint=https://<SignalR-name>.service.signalr.net;AuthType=aad;client-id=<client-id>;Version=1.0;` |

### Service principal

| Default environment variable name | Description   | Example value |
| ----------|------------|----------- |
| AZURE_SIGNALR_CONNECTIONSTRING | SignalR Service connection string with Service Principal | `Endpoint=https://<SignalR-name>.service.signalr.net;AuthType=aad;ClientId=<client-ID>;ClientSecret=<client-secret>;TenantId=<tenant-ID>;Version=1.0;` |

### Secret

  | Default environment variable name | Description | Example value |
  | --- | --- | --- |
  | AZURE_SIGNALR_CONNECTIONSTRING | SignalR Service connection string | `Endpoint=https://<SignalR-name>.service.signalr.net;AccessKey=<access-key>;Version=1.0;` |

> [!IMPORTANT]
> The secret connection string authentication flow requires a high degree of trust in the application, and carries risks not present in other flows. You should use this flow only when more secure flows, such as managed identities, aren't viable.

## Sample connection code

Use the following steps and sample code to connect to Azure SignalR Service using Service Connector.

[!INCLUDE [code for signalR](./includes/code-signalr.md)]

## Related content

- [Service Connector concepts](concept-service-connector-internals.md)
- [Configuration naming convention](concept-service-connector-internals.md#configuration-naming-convention)
