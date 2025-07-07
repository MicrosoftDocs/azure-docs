---
title: Integrate Azure Event Hubs with Service Connector
description: Integrate Azure Event Hubs into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 02/02/2024
---

# Integrate Azure Event Hubs with Service Connector

This page shows supported authentication methods and clients, and shows sample code you can use to connect Azure Event Hubs to other cloud services using Service Connector. You might still be able to connect to Event Hubs in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create service connections. 

## Supported compute services

Service Connector can be used to connect the following compute services to Azure Event Hubs:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Spring Apps

## Supported authentication types and client types

The table below shows which combinations of client types and authentication methods are supported for connecting your compute service to Azure Event Hubs using Service Connector. A “Yes” indicates that the combination is supported, while a “No” indicates that it is not supported.

| Client type         | System-assigned managed identity | User-assigned managed identity | Secret / connection string | Service principal |
|---------------------|:--------------------------------:|:------------------------------:|:--------------------------:|:-----------------:|
| .NET                |                Yes               |               Yes              |             Yes            |        Yes        |
| Go                  |                Yes               |               Yes              |             Yes            |        Yes        |
| Java                |                Yes               |               Yes              |             Yes            |        Yes        |
| Java - Spring Boot  |                Yes               |               Yes              |             Yes            |        Yes        |
| Kafka - Spring Boot |                Yes               |               Yes              |             Yes            |        Yes        |
| Node.js             |                Yes               |               Yes              |             Yes            |        Yes        |
| Python              |                Yes               |               Yes              |             Yes            |        Yes        |
| None                |                Yes               |               Yes              |             Yes            |        Yes        |

This table indicates that all combinations of client types and authentication methods in the table are supported. All client types can use any of the authentication methods to connect to Azure Event Hubs using Service Connector.

## Default environment variable names or application properties

Use the connection details below to connect compute services to Event Hubs. For each example below, replace the placeholder texts `<Event-Hubs-namespace>`, `<access-key-name>`, `<access-key-value>` `<client-ID>`, `<client-secret>`, and `<tenant-id>` with your Event Hubs namespace, shared access key name, shared access key value, client ID, client secret and tenant ID. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### System-assigned managed identity

#### SpringBoot client type

| Default environment variable name     | Description                                                   | Sample value                                   |
|---------------------------------------|---------------------------------------------------------------|------------------------------------------------|
| spring.cloud.azure.eventhub.namespace | Event Hubs namespace                                          | `<Event-Hub-namespace>.servicebus.windows.net` |
| spring.cloud.azure.eventhubs.namespace| Event Hubs namespace for Spring Cloud Azure version above 4.0 | `<Event-Hub-namespace>.servicebus.windows.net` |
| spring.cloud.azure.eventhubs.credential.managed-identity-enabled | Whether to enable managed identity | `true`                   |


#### Kafka-SpringBoot client type

| Default environment variable name     | Description            | Sample value                                   |
|---------------------------------------|------------------------|------------------------------------------------|
| spring.kafka.bootstrap-servers        | Kafka bootstrap server | `<Event-Hub-namespace>.servicebus.windows.net` |

#### Other client types

| Default environment variable name      | Description          | Sample value                                      |
| -------------------------------------- | -------------------- | ------------------------------------------------- |
| AZURE_EVENTHUB_FULLYQUALIFIEDNAMESPACE | Event Hubs namespace | `<Event-Hubs-namespace>.servicebus.windows.net` |

#### Sample code
Refer to the steps and code below to connect to Azure Event Hubs using a system-assigned managed identity.
[!INCLUDE [code for event hubs](./includes/code-eventhubs-me-id.md)]

### User-assigned managed identity

#### SpringBoot client type

| Default environment variable name     | Description          | Sample value                                   |
|---------------------------------------|----------------------|------------------------------------------------|
| spring.cloud.azure.eventhub.namespace | Event Hubs namespace | `<Event-Hub-namespace>.servicebus.windows.net` |
| spring.cloud.azure.client-id          | Your client ID       | `<client-ID>`                                  |
| spring.cloud.azure.eventhubs.namespace| Event Hubs namespace for Spring Cloud Azure version above 4.0 | `<Event-Hub-namespace>.servicebus.windows.net`|
| spring.cloud.azure.eventhubs.credential.client-id     | Your client ID for Spring Cloud Azure version above 4.0     | `<client-ID>`                   |
| spring.cloud.azure.eventhubs.credential.managed-identity-enabled | Whether to enable managed identity               | `true`                          |


#### Kafka-SpringBoot client type

| Default environment variable name     | Description            | Sample value                                   |
|---------------------------------------|------------------------|------------------------------------------------|
| spring.kafka.bootstrap-servers        | Kafka bootstrap server | `<Event-Hub-namespace>.servicebus.windows.net` |
| spring.kafka.properties.azure.credential.managed-identity-enabled | Whether to enable managed identity | `true` |
| spring.kafka.properties.azure.credential.client-id | Your client ID | `<client-ID>`                             |


#### Other client types

| Default environment variable name      | Description          | Sample value                                      |
| -------------------------------------- | -------------------- | ------------------------------------------------- |
| AZURE_EVENTHUB_FULLYQUALIFIEDNAMESPACE | Event Hubs namespace | `<Event-Hubs-namespace>.servicebus.windows.net` |
| AZURE_EVENTHUB_CLIENTID                | Your client ID       | `<client-ID>`                                   |


#### Sample code
Refer to the steps and code below to connect to Azure Event Hubs using a user-assigned managed identity.
[!INCLUDE [code for event hubs](./includes/code-eventhubs-me-id.md)]



### Connection string

> [!WARNING]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

#### SpringBoot client type

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description | Sample value |
> |-----------------------------------| ----------- | ------------ |
> | spring.cloud.azure.storage.connection-string | Event Hubs connection string | `Endpoint=sb://servicelinkertesteventhub.servicebus.windows.net/;SharedAccessKeyName=<access-key-name>;SharedAccessKey=<access-key-value>` |
> | spring.cloud.azure.eventhubs.connection-string| Event Hubs connection string for Spring Cloud Azure version above 4.0| `Endpoint=sb://servicelinkertesteventhub.servicebus.windows.net/;SharedAccessKeyName=<access-key-name>;SharedAccessKey=<access-key-value>` |

#### Kafka-SpringBoot client type

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description | Sample value |
> |-----------------------------------| ----------- | ------------ |
> | spring.cloud.azure.eventhubs.connection-string| Event Hubs connection string| `Endpoint=sb://servicelinkertesteventhub.servicebus.windows.net/;SharedAccessKeyName=<access-key-name>;SharedAccessKey=<access-key-value>` |

#### Other client types

> [!div class="mx-tdBreakAll"]
> |Default environment variable name | Description | Sample value |
> | ----------------------------------- | ----------- | ------------ |
> | AZURE_EVENTHUB_CONNECTIONSTRING | Event Hubs connection string | `Endpoint=sb://<Event-Hubs-namespace>.servicebus.windows.net/;SharedAccessKeyName=<access-key-name>;SharedAccessKey=<access-key-value>` |

#### Sample code
Refer to the steps and code below to connect to Azure Event Hubs using a connection string.
[!INCLUDE [code for event hubs](./includes/code-eventhubs-secret.md)]



### Service principal

#### SpringBoot client type

| Default environment variable name     | Description          | Sample value                                   |
|---------------------------------------|----------------------|------------------------------------------------|
| spring.cloud.azure.eventhub.namespace | Event Hubs namespace | `<Event-Hub-namespace>.servicebus.windows.net` |
| spring.cloud.azure.client-id          | Your client ID       | `<client-ID>`                                  |
| spring.cloud.azure.tenant-id          | Your client secret   | `<client-secret>`                              |
| spring.cloud.azure.client-secret      | Your tenant ID       | `<tenant-id>`                                  |
| spring.cloud.azure.eventhubs.namespace| Event Hubs namespace for Spring Cloud Azure version above 4.0 | `<Event-Hub-namespace>.servicebus.windows.net`|
| spring.cloud.azure.eventhubs.credential.client-id     | Your client ID for Spring Cloud Azure version above 4.0     | `<client-ID>`                   |
| spring.cloud.azure.eventhubs.credential.client-secret | Your client secret for Spring Cloud Azure version above 4.0 | `<client-secret>`               |  
| spring.cloud.azure.eventhubs.profile.tenant-id        | Your tenant ID for Spring Cloud Azure version above 4.0     | `<tenant-id>`                   |

#### Kafka-SpringBoot client type

| Default environment variable name     | Description            | Sample value                                   |
|---------------------------------------|------------------------|------------------------------------------------|
| spring.kafka.bootstrap-servers        | Kafka bootstrap server | `<Event-Hub-namespace>.servicebus.windows.net` |
| spring.kafka.properties.azure.credential.client-id | Your client ID | `<client-ID>`                             |
| spring.kafka.properties.azure.credential.client-secret | Your client secret | `<client-secret>`                 |
| spring.kafka.properties.azure.profile.tenant-id | Your tenant ID            | `<tenant-id>`                     |


#### Other client types

| Default environment variable name      | Description          | Sample value                                      |
| -------------------------------------- | -------------------- | ------------------------------------------------- |
| AZURE_EVENTHUB_FULLYQUALIFIEDNAMESPACE | Event Hubs namespace | `<Event-Hubs-namespace>.servicebus.windows.net` |
| AZURE_EVENTHUB_CLIENTID                | Your client ID       | `<client-ID>`                                   |
| AZURE_EVENTHUB_CLIENTSECRET            | Your client secret   | `<client-secret>`                               |
| AZURE_EVENTHUB_TENANTID                | Your tenant ID       | `<tenant-id>`                                   |

#### Sample code
Refer to the steps and code below to connect to Azure Event Hubs using a service principal.
[!INCLUDE [code for event hubs](./includes/code-eventhubs-me-id.md)]


## Next steps

Follow the tutorial listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
