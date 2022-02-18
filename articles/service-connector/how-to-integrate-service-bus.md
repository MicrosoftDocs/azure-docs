---
title: Integrate Service Bus with Service Connector
description: Integrate Service Bus into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 02/18/2021
---

# Integrate Service Bus with Service Connector

This page shows the supported authentication types and client types of Azure Service Bus using Service Connector. You might still be able to connect to Service Bus in other programming languages without using Service Connector. This page also shows default environment variable names and values or Spring Boot configuration you get when you create service connections. You can learn more about the [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute services

Service Connector supports the following compute services:

- Azure App Service
- Azure Spring Cloud

## Supported Authentication types and client types

| Client Type        | System-assigned Managed Identity     | User-assigned Managed Identity        | Secret/ConnectionString               | Service Principal                     |
| ------------------ | :----------------------------------: | :-----------------------------------: | :-----------------------------------: | :-----------------------------------: |
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  |
| Go                 | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  |
| Java - Spring Boot | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  |
| Python             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  | ![yes icon](./media/green-check.png)  |

## Default environment variable names or application properties

### .NET, Java, Node.JS, Python

#### Secret/ConnectionString

> [!div class="mx-tdBreakAll"]
> |Default environment variable name | Description | Sample value |
> | ----------------------------------- | ----------- | ------------ |
> | AZURE_SERVICEBUS_CONNECTIONSTRING | Service Bus connection string | `Endpoint=sb://{ServiceBusNamespace}.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey={****}` |

#### System-assigned Managed Identity

| Default environment variable name      | Description          | Sample value                                 |
| -------------------------------------- | -------------------- | -------------------------------------------- |
| AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE | Service Bus namespace | `{ServiceBusNamespace}.servicebus.windows.net` |

#### User-assigned Managed Identity

| Default environment variable name        | Description           | Sample value                                   |
| ---------------------------------------- | ----------------------| ---------------------------------------------- |
| AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE | Service Bus namespace | `{ServiceBusNamespace}.servicebus.windows.net` |
| AZURE_SERVICEBUS_CLIENTID                | Your client ID        | `28011635-0dea-4326-896c-3b746a2d90a4`         |

#### Service Principal

| Default environment variable name        | Description           | Sample value                                    |
| -----------------------------------------| --------------------- | ----------------------------------------------- |
| AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE | Service Bus namespace | `{ServiceBusNamespace}.servicebus.windows.net`  |
| AZURE_SERVICEBUS_CLIENTID                | Your client ID        | `{yourClientID}`                                |
| AZURE_SERVICEBUS_CLIENTSECRET            | Your client secret    | `{yourClientSecret}`                            |
| AZURE_SERVICEBUS_TENANTID                | Your tenant ID        | `{yourTenantID}`                                |

### Java - Spring Boot

#### Spring Boot Secret/ConnectionString

> [!div class="mx-tdBreakAll"]
> | Default environment variable name   | Description | Sample value |
> | ----------------------------------- | ----------- | ------------ |
> | spring.cloud.azure.servicebus.connection-string | Service Bus connection string | `Endpoint=sb://{ServiceBusNamespace}.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=***` |

#### Spring Boot System-assigned Managed Identity

| Default environment variable name       | Description           | Sample value                                   |
| --------------------------------------- | --------------------- | ---------------------------------------------- |
| spring.cloud.azure.servicebus.namespace | Service Bus namespace | `{ServiceBusNamespace}.servicebus.windows.net` |

#### Spring Boot Service Principal

| Default environment variable name       | Description           | Sample value                                   |
| --------------------------------------- | --------------------- | ---------------------------------------------- |
| spring.cloud.azure.servicebus.namespace | Service Bus namespace | `{ServiceBusNamespace}.servicebus.windows.net` |
| spring.cloud.azure.client-id            | Your client ID        | `28011635-0dea-4326-896c-3b746a2d90a4`         |
| spring.cloud.azure.tenant-id            | Your client secret    | `******`                                       |
| spring.cloud.azure.client-secret        | Your tenant ID        | `72f988bf-86f1-41af-91ab-2d7cd011db47`         |

## Next step

Follow the tutorial listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
