---
title: Use Service Connector to integrate Azure Event Hubs
description: Learn how to connect Azure Event Hubs to supported Azure compute services by using Service Connector.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 04/10/2026
#customer intent: As an Azure app developer, I want to see authentication methods, environment variables, and sample code for integrating Azure Event Hubs, so I can use Service Connector to easily connect Event Hubs to my Azure compute services.

---

# Integrate Event Hubs with Service Connector

This article shows supported clients, authentication methods, and sample code you can use to connect Azure Event Hubs to other Azure services using Service Connector. The article also shows the default environment variables and Spring Boot configurations you need to create the service connections. 

>[!NOTE]
>You might be able to connect to Event Hubs in other programming languages without using Service Connector.

## Supported compute services

You can use Service Connector to connect the following compute services to Event Hubs:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Spring Apps

## Supported clients and authentication types

The following client types support connecting Event Hubs to Azure compute services by using Service Connector:

- .NET
- Go
- Java
- Java Spring Boot
- Kafka Spring Boot
- Node.js
- Python

All clients that support using Service Connector to connect Event Hubs to Azure compute services support all the following authentication types:

- System-assigned managed identity
- User-assigned managed identity
- Service principal
- Secret or connection string

> [!IMPORTANT]
> The secret or connection string authentication flow requires a high degree of trust in the application, and carries risks not present in other flows. You should use this flow only when more secure flows, such as managed identities, aren't viable.

## Default environment variables

Use the following connection details to connect supported Azure compute services to Event Hubs using the following authentication types:

- [System-assigned managed identity](#system-assigned-managed-identity)
- [User-assigned managed identity](#user-assigned-managed-identity)
- [Service principal](#service-principal)
- [Secret or connection string](#connection-string)

In the examples, replace the following placeholders with the values from your Event Hubs instance:

- `<Event-Hubs-namespace>`
- `<access-key-name>`
- `<access-key-value>`
- `<client-ID>`
- `<client-secret>`
- `<tenant-ID>`

For more information about naming conventions, see [Configuration naming convention](concept-service-connector-internals.md#configuration-naming-convention).

### System-assigned managed identity

Use the following environment variables for system-assigned managed identity connections.

#### All client types except Spring Boot and Kafka Spring Boot

| Default environment variable name      | Description          | Sample value                                      |
| -------------------------------------- | -------------------- | ------------------------------------------------- |
| AZURE_EVENTHUB_FULLYQUALIFIEDNAMESPACE | Event Hubs namespace | `<Event-Hubs-namespace>.servicebus.windows.net` |

#### Spring Boot client type

| Default environment variable name     | Description                                                   | Sample value                                   |
|---------------------------------------|---------------------------------------------------------------|------------------------------------------------|
| spring.cloud.azure.eventhub.namespace | Event Hubs namespace                                          | `<Event-Hubs-namespace>.servicebus.windows.net` |
| spring.cloud.azure.eventhubs.namespace| Event Hubs namespace for Spring Cloud Azure version above 4.0 | `<Event-Hubs-namespace>.servicebus.windows.net` |
| spring.cloud.azure.eventhubs.credential.managed-identity-enabled | Whether to enable managed identity | `true`                   |

#### Kafka Spring Boot client type

| Default environment variable name     | Description            | Sample value                                   |
|---------------------------------------|------------------------|------------------------------------------------|
| spring.kafka.bootstrap-servers        | Kafka bootstrap server | `<Event-Hubs-namespace>.servicebus.windows.net` |

### User-assigned managed identity

Use the following environment variables for user-assigned managed identity connections.

#### All client types except Spring Boot and Kafka Spring Boot

| Default environment variable name      | Description          | Sample value                                      |
| -------------------------------------- | -------------------- | ------------------------------------------------- |
| AZURE_EVENTHUB_FULLYQUALIFIEDNAMESPACE | Event Hubs namespace | `<Event-Hubs-namespace>.servicebus.windows.net` |
| AZURE_EVENTHUB_CLIENTID                | Client ID       | `<client-ID>`                                   |

#### Spring Boot client type

| Default environment variable name     | Description          | Sample value                                   |
|---------------------------------------|----------------------|------------------------------------------------|
| spring.cloud.azure.eventhub.namespace | Event Hubs namespace | `<Event-Hubs-namespace>.servicebus.windows.net` |
| spring.cloud.azure.client-id          | Client ID       | `<client-ID>`                                  |
| spring.cloud.azure.eventhubs.namespace| Event Hubs namespace for Spring Cloud Azure version above 4.0 | `<Event-Hubs-namespace>.servicebus.windows.net`|
| spring.cloud.azure.eventhubs.credential.client-id     | Client ID for Spring Cloud Azure version above 4.0     | `<client-ID>`                   |
| spring.cloud.azure.eventhubs.credential.managed-identity-enabled | Whether to enable managed identity               | `true`                          |

#### Kafka-Spring Boot client type

| Default environment variable name     | Description            | Sample value                                   |
|---------------------------------------|------------------------|------------------------------------------------|
| spring.kafka.bootstrap-servers        | Kafka bootstrap server | `<Event-Hubs-namespace>.servicebus.windows.net` |
| spring.kafka.properties.azure.credential.managed-identity-enabled | Whether to enable managed identity | `true` |
| spring.kafka.properties.azure.credential.client-id | Client ID | `<client-ID>`                             |

### Service principal

Use the following environment variables for service principal connections.

#### All client types except Spring Boot and Kafka Spring Boot

| Default environment variable name      | Description          | Sample value                                      |
| -------------------------------------- | -------------------- | ------------------------------------------------- |
| AZURE_EVENTHUB_FULLYQUALIFIEDNAMESPACE | Event Hubs namespace | `<Event-Hubs-namespace>.servicebus.windows.net` |
| AZURE_EVENTHUB_CLIENTID                | Client ID       | `<client-ID>`                                   |
| AZURE_EVENTHUB_CLIENTSECRET            | Client secret   | `<client-secret>`                               |
| AZURE_EVENTHUB_TENANTID                | Tenant ID       | `<tenant-ID>`                                   |

#### Spring Boot client type

| Default environment variable name     | Description          | Sample value                                   |
|---------------------------------------|----------------------|------------------------------------------------|
| spring.cloud.azure.eventhub.namespace | Event Hubs namespace | `<Event-Hubs-namespace>.servicebus.windows.net` |
| spring.cloud.azure.client-id          | Client ID       | `<client-ID>`                                  |
| spring.cloud.azure.tenant-id          | Tenant ID   | `<tenant-ID>`                              |
| spring.cloud.azure.client-secret      | Client secret       | `<client-secret>`                                  |
| spring.cloud.azure.eventhubs.namespace| Event Hubs namespace for Spring Cloud Azure version above 4.0 | `<Event-Hubs-namespace>.servicebus.windows.net`|
| spring.cloud.azure.eventhubs.credential.client-id     | Client ID for Spring Cloud Azure version above 4.0     | `<client-ID>`                   |
| spring.cloud.azure.eventhubs.credential.client-secret | Client secret for Spring Cloud Azure version above 4.0 | `<client-secret>`               |  
| spring.cloud.azure.eventhubs.profile.tenant-id        | Tenant ID for Spring Cloud Azure version above 4.0     | `<tenant-ID>`                   |

#### Kafka Spring Boot client type

| Default environment variable name     | Description            | Sample value                                   |
|---------------------------------------|------------------------|------------------------------------------------|
| spring.kafka.bootstrap-servers        | Kafka bootstrap server | `<Event-Hubs-namespace>.servicebus.windows.net` |
| spring.kafka.properties.azure.credential.client-id | Client ID | `<client-ID>`                             |
| spring.kafka.properties.azure.credential.client-secret | Client secret | `<client-secret>`                 |
| spring.kafka.properties.azure.profile.tenant-id | Tenant ID            | `<tenant-ID>`                     |

### Connection string

Use the following environment variables for connection string connections.

> [!IMPORTANT]
> The connection string authentication flow requires a high degree of trust in the application, and carries risks not present in other flows. You should use this flow only when more secure flows, such as managed identities, aren't viable.

#### All client types except Spring Boot and Kafka Spring Boot

|Default environment variable name | Description | Sample value |
| ----------------------------------- | ----------- | ------------ |
| AZURE_EVENTHUB_CONNECTIONSTRING | Event Hubs connection string | `Endpoint=sb://<Event-Hubs-namespace>.servicebus.windows.net/;SharedAccessKeyName=<access-key-name>;SharedAccessKey=<access-key-value>` |

#### Spring Boot client type

| Default environment variable name | Description | Sample value |
|-----------------------------------| ----------- | ------------ |
| spring.cloud.azure.storage.connection-string | Event Hubs connection string | `Endpoint=sb://servicelinkertesteventhub.servicebus.windows.net/;SharedAccessKeyName=<access-key-name>;SharedAccessKey=<access-key-value>` |
| spring.cloud.azure.eventhubs.connection-string| Event Hubs connection string for Spring Cloud Azure version above 4.0| `Endpoint=sb://servicelinkertesteventhub.servicebus.windows.net/;SharedAccessKeyName=<access-key-name>;SharedAccessKey=<access-key-value>` |

#### Kafka Spring Boot client type

| Default environment variable name | Description | Sample value |
|-----------------------------------| ----------- | ------------ |
| spring.cloud.azure.eventhubs.connection-string| Event Hubs connection string| `Endpoint=sb://servicelinkertesteventhub.servicebus.windows.net/;SharedAccessKeyName=<access-key-name>;SharedAccessKey=<access-key-value>` |

## Sample connection code

The following steps and sample code connect to Event Hubs using Service Connector using [managed identity, service principal](#misp), or [connection string](#connection-string) authentication. The code gets the variable values from the environment variables Service Connector sets. In the code, replace the `<NAME OF THE EVENT HUB>` placeholder with your event hub name.

<a name="misp"></a>
### Managed identity or service principal

Use the following steps and code to connect your services to Event Hubs using managed identity or service principal authentication. In the code, uncomment the part of the code snippet for the authentication type you want to use: System-assigned managed identity, user-assigned managed identity, or service principal.

[!INCLUDE [code for event hubs](./includes/code-eventhubs-me-id.md)]

### Connection string

Use the following steps and code to connect to Event Hubs using a connection string.

> [!IMPORTANT]
> The connection string authentication flow requires a high degree of trust in the application, and carries risks not present in other flows. You should use this flow only when more secure flows, such as managed identities, aren't viable.

[!INCLUDE [code for event hubs](includes/code-eventhubs-secret.md)]

## Related content

- [Service Connector concepts](concept-service-connector-internals.md)
- [Configuration naming convention](concept-service-connector-internals.md#configuration-naming-convention)