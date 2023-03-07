---
title: Integrate Azure Service Bus with Service Connector
description: Integrate Service Bus into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 08/11/2022
---

# Integrate Service Bus with Service Connector

This page shows the supported authentication types and client types of Azure Service Bus using Service Connector. You might still be able to connect to Service Bus in other programming languages without using Service Connector. This page also shows default environment variable names and values or Spring Boot configuration you get when you create service connections. You can learn more about the [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute services

- Azure App Service
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

Supported authentication and clients for App Service, Container Apps and Azure Spring Apps:

### [Azure App Service](#tab/app-service)

| Client type        |   System-assigned managed identity   |    User-assigned managed identity    |       Secret/connection string       |           Service principal          |
|--------------------|:------------------------------------:|:------------------------------------:|:------------------------------------:|:------------------------------------:|
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Go                 | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| None               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

### [Azure Container Apps](#tab/container-apps)

| Client type        |   System-assigned managed identity   |    User-assigned managed identity    |       Secret/connection string       |           Service principal          |
|--------------------|:------------------------------------:|:------------------------------------:|:------------------------------------:|:------------------------------------:|
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Go                 | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| None               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

### [Azure Spring Apps](#tab/spring-apps)

| Client type        |   System-assigned managed identity   | User-assigned managed identity |       Secret/connection string       |           Service principal          |
|--------------------|:------------------------------------:|:------------------------------:|:------------------------------------:|:------------------------------------:|
| .NET               | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Go                 | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js            | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python             | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| None               | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

---

## Default environment variable names or application properties

Use the connection details below to connect compute services to Service Bus. For each example below, replace the placeholder texts `<Service-Bus-namespace>`, `<access-key-name>`, `<access-key-value>` `<client-ID>`, `<client-secret>`, and `<tenant-id>` with your own Service Bus namespace, shared access key name, shared access key value, client ID, client secret and tenant ID.

### Azure App Service and Azure Container Apps

#### Secret/connection string

> [!div class="mx-tdBreakAll"]
> |Default environment variable name | Description | Sample value |
> | ----------------------------------- | ----------- | ------------ |
> | AZURE_SERVICEBUS_CONNECTIONSTRING | Service Bus connection string | `Endpoint=sb://<Service-Bus-namespace>.servicebus.windows.net/;SharedAccessKeyName=<access-key-name>;SharedAccessKey=<access-key-value>` |

#### System-assigned managed identity

| Default environment variable name      | Description          | Sample value                                 |
| -------------------------------------- | -------------------- | -------------------------------------------- |
| AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE | Service Bus namespace | `<Service-Bus-namespace>.servicebus.windows.net` |

#### User-assigned managed identity

| Default environment variable name        | Description           | Sample value                                   |
| ---------------------------------------- | ----------------------| ---------------------------------------------- |
| AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE | Service Bus namespace | `<Service-Bus-namespace>.servicebus.windows.net` |
| AZURE_SERVICEBUS_CLIENTID                | Your client ID        | `<client-ID>`                               |

#### Service principal

| Default environment variable name        | Description           | Sample value                                    |
| -----------------------------------------| --------------------- | ----------------------------------------------- |
| AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE | Service Bus namespace | `<Service-Bus-namespace>.servicebus.windows.net`  |
| AZURE_SERVICEBUS_CLIENTID                | Your client ID        | `<client-ID>`                                |
| AZURE_SERVICEBUS_CLIENTSECRET            | Your client secret    | `<client-secret>`                            |
| AZURE_SERVICEBUS_TENANTID                | Your tenant ID        | `<tenant-id>`                                |

### Azure Spring Apps

#### Spring Boot secret/connection string

> [!div class="mx-tdBreakAll"]
> | Default environment variable name   | Description | Sample value |
> | ----------------------------------- | ----------- | ------------ |
> | spring.cloud.azure.servicebus.connection-string | Service Bus connection string | `Endpoint=sb://<Service-Bus-namespace>.servicebus.windows.net/;SharedAccessKeyName=<access-key-name>;SharedAccessKey=<access-key-value>` |

#### Spring Boot system-assigned managed identity

| Default environment variable name       | Description           | Sample value                                     |
|-----------------------------------------|-----------------------|--------------------------------------------------|
| spring.cloud.azure.servicebus.namespace | Service Bus namespace | `<Service-Bus-namespace>.servicebus.windows.net` |

#### Spring Boot user-assigned managed identity

| Default environment variable name       | Description           | Sample value                                     |
|-----------------------------------------|-----------------------|--------------------------------------------------|
| spring.cloud.azure.servicebus.namespace | Service Bus namespace | `<Service-Bus-namespace>.servicebus.windows.net` |
| spring.cloud.azure.client-id            | Your client ID        | `<client-ID>`                                    |

#### Spring Boot service principal

| Default environment variable name       | Description           | Sample value                                     |
|-----------------------------------------|-----------------------|--------------------------------------------------|
| spring.cloud.azure.servicebus.namespace | Service Bus namespace | `<Service-Bus-namespace>.servicebus.windows.net` |
| spring.cloud.azure.client-id            | Your client ID        | `<client-ID>`                                    |
| spring.cloud.azure.tenant-id            | Your client secret    | `<client-secret>`                                |
| spring.cloud.azure.client-secret        | Your tenant ID        | `<tenant-id>`                                    |

## Next step

Follow the tutorial listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
