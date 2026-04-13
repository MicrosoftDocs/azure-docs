---
title: Integrate Azure Web PubSub using Service Connector
description: Learn how to connect Web PubSub to supported Azure compute services by using Service Connector.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 04/08/2026
#customer intent: As an Azure app developer, I want to see authentication methods, environment variables, and sample code for using Service Connector with Web PubSub, so I can easily integrate Web PubSub into my apps.

---

# Integrate Azure Web PubSub with Service Connector

This article shows supported clients, authentication methods, and sample code you can use to connect Azure Web PubSub to other Azure services using Service Connector. The article also shows the default environment variables you need to create the service connections. 

## Supported compute services

You can use Service Connector to connect the following Azure compute services to Web PubSub:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Spring Apps

## Supported clients and authentication types

The following client types support connecting Web PubSub to Azure compute services by using Service Connector:

- .NET
- Java
- Node.js
- Python

>[!NOTE]
>You might be able to connect to Web PubSub in other programming languages without using Service Connector.

All clients that support using Service Connector to connect Web PubSub to Azure compute services support all the following authentication types:

- System-assigned managed identity
- User-assigned managed identity
- Service principal
- Connection string

> [!IMPORTANT]
> The connection string authentication flow requires a high degree of trust in the application, and carries risks not present in other flows. You should use this flow only when more secure flows, such as managed identities, aren't viable.

## Default environment variables

Use the following connection details to connect supported Azure compute services to Web PubSub using the following authentication types:

- [System-assigned managed identity](#system-assigned-managed-identity)
- [User-assigned managed identity](#user-assigned-managed-identity)
- [Service principal](#service-principal)
- [Connection string](#connection-string)

In the examples, replace the following placeholders with the values for your Web PubSub account:

- `<name>`
- `<client-ID>`
- `<client-secret>`
- `<access-key>`
- `<tenant-ID>`

For more information about naming conventions, see [Configuration naming convention](concept-service-connector-internals.md#configuration-naming-convention).

### System-assigned managed identity

Use the following environment variables for system-assigned managed identity connections.

| Default environment variable name | Description           | Sample value                   |
| --------------------------------- | --------------------- | ------------------------------ |
| AZURE_WEBPUBSUB_HOST              | Azure Web PubSub host | `<name>.webpubsub.azure.com` |

### User-assigned managed identity

Use the following environment variables for user-assigned managed identity connections.

| Default environment variable name | Description                | Sample value                   |
| --------------------------------- | -------------------------- | ------------------------------ |
| AZURE_WEBPUBSUB_HOST              | Azure Web PubSub host      | `<name>.webpubsub.azure.com` |
| AZURE_WEBPUBSUB_CLIENTID          | Azure Web PubSub client ID | `<client-ID>`                |

### Service principal

Use the following environment variables for service principal connections.

| Default environment variable name | Description                    | Sample value                   |
| --------------------------------- | ------------------------------ | ------------------------------ |
| AZURE_WEBPUBSUB_HOST              | Azure Web PubSub host          | `<name>.webpubsub.azure.com` |
| AZURE_WEBPUBSUB_CLIENTID          | Azure Web PubSub client ID     | `<client-ID>`                |
| AZURE_WEBPUBSUB_CLIENTSECRET      | Azure Web PubSub client secret | `<client-secret>`            |
| AZURE_WEBPUBSUB_TENANTID          | Azure Web PubSub tenant ID     | `<tenant-ID>`                |

### Connection string

Use the following environment variables for connection string connections.

> [!IMPORTANT]
> The connection string authentication flow requires a high degree of trust in the application, and carries risks not present in other flows. You should use this flow only when more secure flows, such as managed identities, aren't viable.

| Default environment variable name | Description   | Sample value  |
| --------------|------------------- | ------------------------------- |
| AZURE_WEBPUBSUB_CONNECTIONSTRING  | Web PubSub connection string | `Endpoint=https://<name>.webpubsub.azure.com;AccessKey=<access-key>;Version=1.0;` |

## Sample connection code

The following steps and sample code connect to Web PubSub using Service Connector with [managed identity, service principal](#misp), or [connection string](#connection-string) authentication. The code gets the variable values from the environment variables Service Connector sets.

<a name="misp"></a>
### Managed identity or service principal

Use the following steps and code to connect your services to Web PubSub using a managed identity or service principal. In the code, uncomment the lines for the authentication type you want to use: System-assigned managed identity, user-assigned managed identity, or service principal.

[!INCLUDE [code for web pubsub](./includes/code-webpubsub-me-id.md)]

### Connection string

Use the following steps and code to connect to Web PubSub using a connection string.

> [!IMPORTANT]
> The connection string authentication flow requires a high degree of trust in the application, and carries risks not present in other flows. You should use this flow only when more secure flows, such as managed identities, aren't viable.

[!INCLUDE [code for web pubsub](./includes/code-webpubsub-secret.md)]

## Related content

- [Service Connector concepts](concept-service-connector-internals.md)
- [Configuration naming convention](concept-service-connector-internals.md#configuration-naming-convention)
