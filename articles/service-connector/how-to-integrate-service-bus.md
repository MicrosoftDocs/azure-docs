---
title: Integrate Azure Service Bus with Service Connector
description: Use these code samples to integrate Azure Service Bus into your application with Service Connector.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 08/18/2025
#customer intent: As a cloud developer, I want to connect my compute services to Azure Service Bus using Service Connector.
---

# Integrate Service Bus with Service Connector

This page shows supported authentication methods and clients. It provides sample code you can use to connect compute services to Azure Service Bus using Service Connector. You might still be able to connect to Service Bus in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create service connections. 

## Supported compute services

Service Connector can be used to connect the following compute services to Azure Service Bus:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Spring Apps

## Supported authentication types and client types

This table shows which combinations of authentication methods and clients are supported for connecting your compute service to Azure Service Bus using Service Connector. A "Yes" indicates that the combination is supported, while a "No" indicates that it isn't supported.

| Client type        | System-assigned managed identity | User-assigned managed identity | Secret/connection string | Service principal |
|--------------------|:--------------------------------:|:------------------------------:|:------------------------:|:-----------------:|
| .NET               |                Yes               |               Yes              |            Yes           |        Yes        |
| Go                 |                Yes               |               Yes              |            Yes           |        Yes        |
| Java               |                Yes               |               Yes              |            Yes           |        Yes        |
| Java - Spring Boot |                Yes               |               Yes              |            Yes           |        Yes        |
| Node.js            |                Yes               |               Yes              |            Yes           |        Yes        |
| Python             |                Yes               |               Yes              |            Yes           |        Yes        |
| None               |                Yes               |               Yes              |            Yes           |        Yes        |

This table indicates that all combinations of client types and authentication methods in the table are supported. All client types can use any of the authentication methods to connect to Azure Service Bus using Service Connector.

## Default environment variable names or application properties

Use the following connection details to connect compute services to Service Bus. For each example, replace the placeholder texts `<Service-Bus-namespace>`, `<access-key-name>`, `<access-key-value>` `<client-ID>`, `<client-secret>`, and `<tenant-id>` with your own Service Bus namespace, shared access key name, shared access key value, client ID, client secret, and tenant ID. For more information, see [Configuration naming convention](concept-service-connector-internals.md#configuration-naming-convention).

### System-assigned managed identity

#### Spring Boot client type

| Default environment variable name       | Description           | Sample value                                     |
|-----------------------------------------|-----------------------|--------------------------------------------------|
| spring.cloud.azure.servicebus.namespace | Service Bus namespace | `<Service-Bus-namespace>.servicebus.windows.net` |

#### Other client types

| Default environment variable name        | Description           | Sample value                                       |
| ---------------------------------------- | --------------------- | -------------------------------------------------- |
| AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE | Service Bus namespace | `<Service-Bus-namespace>.servicebus.windows.net` |

#### Sample code

To connect to Service Bus using a system-assigned managed identity, refer to the following steps and code.
[!INCLUDE [code sample for service bus](./includes/code-servicebus-me-id.md)]

### User-assigned managed identity

#### Spring Boot client type

| Default environment variable name       | Description           | Sample value                                     |
|-----------------------------------------|-----------------------|--------------------------------------------------|
| spring.cloud.azure.servicebus.namespace | Service Bus namespace | `<Service-Bus-namespace>.servicebus.windows.net` |
| spring.cloud.azure.client-id            | Your client ID        | `<client-ID>`                                    |

#### Other client types

| Default environment variable name        | Description           | Sample value                                       |
| ---------------------------------------- | --------------------- | -------------------------------------------------- |
| AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE | Service Bus namespace | `<Service-Bus-namespace>.servicebus.windows.net` |
| AZURE_SERVICEBUS_CLIENTID                | Your client ID        | `<client-ID>`                                    |

#### Sample code

To connect to Service Bus using a user-assigned managed identity, refer to the following steps and code.
[!INCLUDE [code sample for service bus](./includes/code-servicebus-me-id.md)]

### Connection string

> [!WARNING]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application. It carries risks that aren't present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

#### Spring Boot client type

> [!div class="mx-tdBreakAll"]
>
> | Default environment variable name               | Description                   | Sample value                                                                                                                               |
> | ----------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
> | spring.cloud.azure.servicebus.connection-string | Service Bus connection string | `Endpoint=sb://<Service-Bus-namespace>.servicebus.windows.net/;SharedAccessKeyName=<access-key-name>;SharedAccessKey=<access-key-value>` |

#### Other client types

> [!div class="mx-tdBreakAll"]
> |Default environment variable name | Description | Sample value |
> | ----------------------------------- | ----------- | ------------ |
> | AZURE_SERVICEBUS_CONNECTIONSTRING | Service Bus connection string | `Endpoint=sb://<Service-Bus-namespace>.servicebus.windows.net/;SharedAccessKeyName=<access-key-name>;SharedAccessKey=<access-key-value>` |

#### Sample code

To connect to Service Bus using a connection string, refer to the following steps and code.
[!INCLUDE [code sample for service bus](./includes/code-servicebus-secret.md)]


### Service principal

#### Spring Boot client type

| Default environment variable name       | Description           | Sample value                                       |
| --------------------------------------- | --------------------- | -------------------------------------------------- |
| spring.cloud.azure.servicebus.namespace | Service Bus namespace | `<Service-Bus-namespace>.servicebus.windows.net` |
| spring.cloud.azure.client-id            | Your client ID        | `<client-ID>`                                    |
| spring.cloud.azure.tenant-id            | Your client secret    | `<client-secret>`                                |
| spring.cloud.azure.client-secret        | Your tenant ID        | `<tenant-id>`                                    |

#### Other client types

| Default environment variable name        | Description           | Sample value                                    |
| -----------------------------------------| --------------------- | ----------------------------------------------- |
| AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE | Service Bus namespace | `<Service-Bus-namespace>.servicebus.windows.net`  |
| AZURE_SERVICEBUS_CLIENTID                | Your client ID        | `<client-ID>`                                |
| AZURE_SERVICEBUS_CLIENTSECRET            | Your client secret    | `<client-secret>`                            |
| AZURE_SERVICEBUS_TENANTID                | Your tenant ID        | `<tenant-id>`                                |

#### Sample code

To connect to Service Bus using a service principal, refer to the following steps and code.
[!INCLUDE [code sample for service bus](./includes/code-servicebus-me-id.md)]

## Next step

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
