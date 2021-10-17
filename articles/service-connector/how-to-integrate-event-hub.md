---
title: Integrate Azure Event Hubs with Service Connector
description: Integrate Azure Event Hubs into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: serviceconnector
ms.topic: how-to 
ms.date: 10/29/2021
---

# Integrate Azure Event Hubs with Service Connector

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
| AZURE_EVENTHUB_CONNECTIONSTRING | | `Endpoint=sb://{eventHubName}.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey={****}` |

**System-assigned Managed Identity**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_EVENTHUB_FULLYQUALIFIEDNAMESPACE | | `{eventHubNamespace}.servicebus.windows.net` |

**User-assigned Managed Identity**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_EVENTHUB_FULLYQUALIFIEDNAMESPACE | | `{eventHubNamespace}.servicebus.windows.net` |
| AZURE_EVENTHUB_CLIENTID | | `{yourClientID}` |

**Service Principal**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_EVENTHUB_FULLYQUALIFIEDNAMESPACE | | `{eventHubNamespace}.servicebus.windows.net` |
| AZURE_EVENTHUB_CLIENTID | | `{yourClientID}` |
| AZURE_EVENTHUB_CLIENTSECRET | | `{yourClientSecret}` |
| AZURE_EVENTHUB_CLIENTID | | `{yourTenantID}` |

### Java - Spring Boot

**Secret/ConnectionString**

| Application properties | Description | Example value |
| --- | --- | --- |
| spring.cloud.azure.servicebus.connection-string | | `Endpoint=sb://{eventHubName}.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey={****}` |

**System-assigned Managed Identity**

| Application properties | Description | Example value |
| --- | --- | --- |
| spring.cloud.azure.eventhub.namespace | | `{eventHubNamespace}.servicebus.windows.net` |


**Service Principal**

| Application properties | Description | Example value |
| --- | --- | --- |
| spring.cloud.azure.eventhub.namespace | | `{eventHubNamespace}.servicebus.windows.net` |
| spring.cloud.azure.client-id | | `{yourSecret}` |
| spring.cloud.azure.tenant-id | | `{yourTenantID}` |
| spring.cloud.azure.client-secret | | `{yourClientSecret}` |