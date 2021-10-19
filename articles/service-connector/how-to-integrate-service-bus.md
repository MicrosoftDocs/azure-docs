---
title: Integrate Azure Service Bus with Service Connector
description: Integrate Azure Service Bus into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: serviceconnector
ms.topic: how-to 
ms.date: 10/29/2021
---

# Integrate Azure Service Bus with Service Connector

This page shows the supported authentication types and client types of Azure Service Bus using Service Connector. You might still be able to connect to Azure Service Bus in other programming languages without using Service Connector. This page also shows default environment variable name and value (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service
- Azure Spring Cloud

## Supported Authentication types and client types

| Client Type | System-assigned Managed Identity | User-assigned Managed Identity | Secret/ConnectionString | Service Principal |
| --- | --- | --- | --- | --- |
| .Net | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot | ![yes icon](./media/green-check.png) | | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Go | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |


## Default environment variable names or application properties

### .NET, Java, Node.JS, Python

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_SERVICEBUS_CONNECTIONSTRING | Service Bus connection string | `Endpoint=sb://{serviceBusName}.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=***` |

**System-assigned Managed Identity**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE | Service Bus namespace | `{serviceBusNamespace}.servicebus.windows.net` |

**User-assigned Managed Identity**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE | Service Bus namespace | `{serviceBusNamespace}.servicebus.windows.net` |
| AZURE_SERVICEBUS_CLIENTID | Your client ID | `{yourClientID}` |

**Service Principal**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE | Service Bus namespace | `{serviceBusNamespace}.servicebus.windows.net` |
| AZURE_SERVICEBUS_CLIENTID | Your client ID | `{yourClientID}` |
| AZURE_SERVICEBUS_CLIENTSECRET | Your client secret | `{yourClientSecret}` |
| AZURE_SERVICEBUS_TENANTID | Your tenant ID | `{yourTenantID}` |

### Java - Spring Boot

**Secret/ConnectionString**

| Application properties | Description | Example value |
| --- | --- | --- |
| spring.cloud.azure.servicebus.connection-string | Service Bus connection string | `Endpoint=sb://{eventHubName}.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey={****}` |

**System-assigned Managed Identity**

| Application properties | Description | Example value |
| --- | --- | --- |
| spring.cloud.azure.servicebus.namespace | Service Bus namespace | `{serviceBusNamespace}.servicebus.windows.net` |


**Service Principal**

| Application properties | Description | Example value |
| --- | --- | --- |
| spring.cloud.azure.servicebus.namespace | Service Bus namespace | `{serviceBusNamespace}.servicebus.windows.net` |
| spring.cloud.azure.client-id | Your client ID | `{yourSecret}` |
| spring.cloud.azure.tenant-id | Your tenant ID | `{yourTenantID}` |
| spring.cloud.azure.client-secret | Your client secret | `{yourClientSecret}` |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
