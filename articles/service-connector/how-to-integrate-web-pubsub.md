---
title: Integrate Azure Web PubSub with service connector
description: Integrate Azure Web PubSub into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 02/02/2024
---

# Integrate Azure Web PubSub with service connector

This page shows supported authentication methods and clients, and shows sample code you can use to connect Azure Web PubSub to other cloud services using Service Connector. You might still be able to connect to App Configuration using other methods. This page also shows default environment variable names and values you get when you create the service connection.

## Supported compute services

Service Connector can be used to connect the following compute services to Azure Web PubSub:

- Azure App Service
- Azure Functions
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

The table below shows which combinations of authentication methods and clients are supported for connecting your compute service to Azure Web PubSub using Service Connector. A “Yes” indicates that the combination is supported, while a “No” indicates that it is not supported.

| Client type | System-assigned managed identity | User-assigned managed identity | Secret/connection string | Service principal |
|-------------|:--------------------------------:|:------------------------------:|:------------------------:|:-----------------:|
| .NET        |                Yes               |               Yes              |            Yes           |        Yes        |
| Java        |                Yes               |               Yes              |            Yes           |        Yes        |
| Node.js     |                Yes               |               Yes              |            Yes           |        Yes        |
| Python      |                Yes               |               Yes              |            Yes           |        Yes        |

This table indicates that all combinations of client types and authentication methods in the table are supported. Other client types are not supported to connect to Azure Web PubSub using Service Connector. 

## Default environment variable names or application properties and sample code

Use the environment variable names and application properties listed below, according to your connection's authentication type and client type, to connect compute services to Web PubSub using .NET, Java, Node.js, or Python. For each example below, replace the placeholder texts `<name>`, `<client-id>`, `<client-secret`, `<access-key>`, and `<tenant-id>` with your own resource name, client ID, client secret, access-key, and tenant ID. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### System-assigned managed identity

| Default environment variable name | Description           | Sample value                   |
| --------------------------------- | --------------------- | ------------------------------ |
| AZURE_WEBPUBSUB_HOST              | Azure Web PubSub host | `<name>.webpubsub.azure.com` |

#### Sample code

Refer to the steps and code below to connect to Azure Web PubSub using a system-assigned managed identity.
[!INCLUDE [code for web pubsub](./includes/code-webpubsub-me-id.md)]

### User-assigned managed identity

| Default environment variable name | Description                | Sample value                   |
| --------------------------------- | -------------------------- | ------------------------------ |
| AZURE_WEBPUBSUB_HOST              | Azure Web PubSub host      | `<name>.webpubsub.azure.com` |
| AZURE_WEBPUBSUB_CLIENTID          | Azure Web PubSub client ID | `<client-id>`                |

#### Sample code

Refer to the steps and code below to connect to Azure Web PubSub using a user-assigned managed identity.
[!INCLUDE [code for web pubsub](./includes/code-webpubsub-me-id.md)]

### Connection string

> [!div class="mx-tdBreakAll"]
>
> | Default environment variable name | Description                        | Sample value                                                                        |
> | --------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------- |
> | AZURE_WEBPUBSUB_CONNECTIONSTRING  | Azure Web PubSub connection string | `Endpoint=https://<name>.webpubsub.azure.com;AccessKey=<access-key>;Version=1.0;` |

#### Sample code

Refer to the steps and code below to connect to Azure Web PubSub using a connection string.
[!INCLUDE [code for web pubsub](./includes/code-webpubsub-secret.md)]

### Service principal

| Default environment variable name | Description                    | Sample value                   |
| --------------------------------- | ------------------------------ | ------------------------------ |
| AZURE_WEBPUBSUB_HOST              | Azure Web PubSub host          | `<name>.webpubsub.azure.com` |
| AZURE_WEBPUBSUB_CLIENTID          | Azure Web PubSub client ID     | `<client-id>`                |
| AZURE_WEBPUBSUB_CLIENTSECRET      | Azure Web PubSub client secret | `<client-secret>`            |
| AZURE_WEBPUBSUB_TENANTID          | Azure Web PubSub tenant ID     | `<tenant-id>`                |

#### Sample code

Refer to the steps and code below to connect to Azure Web PubSub using a service principal.
[!INCLUDE [code for web pubsub](./includes/code-webpubsub-me-id.md)]

## Next steps

Read the article listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
