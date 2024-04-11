---
title: Integrate Azure SignalR Service with Service Connector
description: Integrate Azure SignalR Service into your application with Service Connector. Learn about authentication types and client types of Azure SignalR Service.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 02/02/2024
ms.custom:
  - kr2b-contr-experiment
---

# Integrate Azure SignalR Service with Service Connector

This article shows supported authentication methods and clients, and shows sample code you can use to connect Azure SignalR Service to other cloud services using Service Connector. This article also shows default environment variable name and value (or Spring Boot configuration) that you get when you create the service connection.

## Supported compute services

Service Connector can be used to connect the following compute services to Azure SignalR Service:

- Azure App Service
- Azure Functions
- Azure Container Apps

## Supported authentication types and client types

The table below shows which combinations of authentication methods and clients are supported for connecting your compute service to Azure SignalR Service using Service Connector. A “Yes” indicates that the combination is supported, while a “No” indicates that it is not supported.


| Client type | System-assigned managed identity | User-assigned managed identity | Secret / connection string | Service principal |
|-------------|----------------------------------|--------------------------------|----------------------------|-------------------|
| .NET        | Yes                              | Yes                            | Yes                        | Yes               |
| None        | Yes                              | Yes                            | Yes                        | Yes               |

This table indicates that all combinations of client types and authentication methods in the table are supported. Other client types are not supported to connect to Azure SignalR Service using Service Connector.

## Default environment variable names or application properties

Use environment variable names listed below to connect compute services to Azure SignalR Service. For each example below, replace the placeholder texts
`<SignalR-name>`, `<access-key>`, `<client-ID>`, `<tenant-ID>`, and `<client-secret>` with your own SignalR name, access key, client ID, tenant ID and client secret. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

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

| Default environment variable name | Description                                              | Example value                                                                                                                                            |
| --------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AZURE_SIGNALR_CONNECTIONSTRING    | SignalR Service connection string with Service Principal | `Endpoint=https://<SignalR-name>.service.signalr.net;AuthType=aad;ClientId=<client-ID>;ClientSecret=<client-secret>;TenantId=<tenant-ID>;Version=1.0;` |

#### Sample code
Refer to the steps and code below to connect to Azure SignalR Service using a service principal.
[!INCLUDE [code for signalR](./includes/code-signalr.md)]

## Next steps

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
