---
title: Integrate Azure Service Bus with Service Connector
description: Integrate Service Bus into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 02/21/2022
---

# Integrate Service Bus with Service Connector

This page shows the supported authentication types and client types of Azure Service Bus using Service Connector. You might still be able to connect to Service Bus in other programming languages without using Service Connector. This page also shows default environment variable names and values or Spring Boot configuration you get when you create service connections. You can learn more about the [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute services

- Azure App Service
- Azure Spring Cloud

## Supported authentication types and client types

| Client type        | System-assigned managed identity     | User-assigned managed identity        | Secret/connection string               | Service principal                     |
| ------------------ | :----------------------------------: | :-----------------------------------: | :-----------------------------------: | :-----------------------------------: |
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  |
| Go                 | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  |
| Java - Spring Boot | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  |
| Python             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  |

## Default environment variable names or application properties

### .NET, Java, Node.JS, Python

#### Secret/connection string

> [!div class="mx-tdBreakAll"]
> |Default environment variable name | Description | Sample value |
> | ----------------------------------- | ----------- | ------------ |
> | AZURE_SERVICEBUS_CONNECTIONSTRING | Service Bus connection string | `Endpoint=sb://{ServiceBusNamespace}.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey={****}` |

#### System-assigned managed identity

| Default environment variable name      | Description          | Sample value                                 |
| -------------------------------------- | -------------------- | -------------------------------------------- |
| AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE | Service Bus namespace | `{ServiceBusNamespace}.servicebus.windows.net` |

#### User-assigned managed identity

| Default environment variable name        | Description           | Sample value                                   |
| ---------------------------------------- | ----------------------| ---------------------------------------------- |
| AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE | Service Bus namespace | `{ServiceBusNamespace}.servicebus.windows.net` |
| AZURE_SERVICEBUS_CLIENTID                | Your client ID        | `{yourClientID}`                               |

#### Service principal

| Default environment variable name        | Description           | Sample value                                    |
| -----------------------------------------| --------------------- | ----------------------------------------------- |
| AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE | Service Bus namespace | `{ServiceBusNamespace}.servicebus.windows.net`  |
| AZURE_SERVICEBUS_CLIENTID                | Your client ID        | `{yourClientID}`                                |
| AZURE_SERVICEBUS_CLIENTSECRET            | Your client secret    | `{yourClientSecret}`                            |
| AZURE_SERVICEBUS_TENANTID                | Your tenant ID        | `{yourTenantID}`                                |

### Java - Spring Boot

#### Spring Boot secret/connection string

> [!div class="mx-tdBreakAll"]
> | Default environment variable name   | Description | Sample value |
> | ----------------------------------- | ----------- | ------------ |
> | spring.cloud.azure.servicebus.connection-string | Service Bus connection string | `Endpoint=sb://{ServiceBusNamespace}.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=***` |

#### Spring Boot system-assigned managed identity

| Default environment variable name       | Description           | Sample value                                   |
| --------------------------------------- | --------------------- | ---------------------------------------------- |
| spring.cloud.azure.servicebus.namespace | Service Bus namespace | `{ServiceBusNamespace}.servicebus.windows.net` |

#### Spring Boot user-assigned managed identity

| Default environment variable name       | Description           | Sample value                                   |
| --------------------------------------- | --------------------- | ---------------------------------------------- |
| spring.cloud.azure.servicebus.namespace | Service Bus namespace | `{ServiceBusNamespace}.servicebus.windows.net` |
| spring.cloud.azure.client-id            | Your client ID        | `{yourClientID}                      `         |

#### Spring Boot service principal

| Default environment variable name       | Description           | Sample value                                   |
| --------------------------------------- | --------------------- | ---------------------------------------------- |
| spring.cloud.azure.servicebus.namespace | Service Bus namespace | `{ServiceBusNamespace}.servicebus.windows.net` |
| spring.cloud.azure.client-id            | Your client ID        | `{yourClientID}`         |
| spring.cloud.azure.tenant-id            | Your client secret    | `******`                                       |
| spring.cloud.azure.client-secret        | Your tenant ID        | `{yourTenantID}`         |

## Next step

Follow the tutorial listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
