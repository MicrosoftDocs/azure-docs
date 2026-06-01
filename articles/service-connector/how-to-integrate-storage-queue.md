---
title: Integrate Azure Queue Storage using Service Connector
description: Learn how to connect Queue Storage to supported Azure compute services by using Service Connector.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 04/08/2026
#customer intent: As an Azure app developer, I want to see authentication methods, environment variables, and sample code for using Service Connector with Queue Storage, so I can easily integrate Queue Storage into my apps.

---

# Integrate Azure Queue Storage with Service Connector

This article shows supported clients, authentication methods, and sample code you can use to connect Azure Queue Storage to other Azure services using Service Connector. The article also shows the default environment variables and Spring Boot configurations you need to create the service connections. 

## Supported compute services

You can use Service Connector to connect the following Azure compute services to Queue Storage:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Spring Apps

## Supported clients and authentication types

The following client types support connecting Queue Storage to Azure compute services by using Service Connector:

- .NET
- Go
- Java
- Java Spring Boot
- Node.js
- Python

>[!NOTE]
>You might be able to connect to Queue Storage in other programming languages without using Service Connector.

All clients that support using Service Connector to connect Queue Storage to Azure compute services support all the following authentication types:

- System-assigned managed identity
- User-assigned managed identity
- Service principal
- Connection string

> [!NOTE]
> For Spring Boot connections, authenticating with a managed identity or service principal is available only for Spring Cloud Azure version 4.0 or higher. Connections for Spring Cloud Azure versions lower than 4.0 must use connection string authentication.

> [!IMPORTANT]
> The connection string authentication flow requires a high degree of trust in the application, and carries risks not present in other flows. You should use this flow only when more secure flows, such as managed identities, aren't viable.

## Default environment variables

Use the following connection details to connect supported Azure compute services to Queue Storage using the following authentication types:

- [System-assigned managed identity](#system-assigned-managed-identity)
- [User-assigned managed identity](#user-assigned-managed-identity)
- [Service principal](#service-principal)
- [Connection string](#connection-string)

In the examples, replace the following placeholders with the values for your Queue Storage account:

- `<account name>`
- `<account-key>`
- `<client-ID>`
- `<client-secret>`
- `<tenant-ID>`
- `<storage-account-name>`

For more information about naming conventions, see [Configuration naming convention](concept-service-connector-internals.md#configuration-naming-convention).

### System-assigned managed identity

Use the following environment variables for system-assigned managed identity connections.

#### All client types except Spring Boot

| Default environment variable name   | Description            | Example value    |
| ----------------------------------- | ---------------------- | --------------- |
| AZURE_STORAGEQUEUE_RESOURCEENDPOINT | Queue Storage endpoint | `https://<storage-account-name>.queue.core.windows.net/` |

#### Spring Boot client

Authenticating with a system-assigned managed identity is available only for Spring Cloud Azure version 4.0 or higher.

| Default environment variable name    | Description   | Example value   |
|-------------------|-----------------------------|---------------------|
| spring.cloud.azure.storage.queue.credential.managed-identity-enabled | Whether to enable managed identity | `True`|
| spring.cloud.azure.storage.queue.account-name | Name of the storage account  | `<storage-account-name>`|
| spring.cloud.azure.storage.queue.endpoint  | Queue Storage endpoint | `https://<storage-account-name>.queue.core.windows.net/` |

### User-assigned managed identity

Use the following environment variables for user-assigned managed identity connections.

#### All client types except Spring Boot

| Default environment variable name   | Description            | Example value                                              |
| ----------------------------------- | ---------------------- | ---------------------------------------------------------- |
| AZURE_STORAGEQUEUE_RESOURCEENDPOINT | Queue Storage endpoint | `https://<storage-account-name>.queue.core.windows.net/` |
| AZURE_STORAGEQUEUE_CLIENTID         | Client ID         | `<client-ID>`                                            |

#### Spring Boot client

Authenticating with a user-assigned managed identity is available only for Spring Cloud Azure version 4.0 or higher.

| Default environment variable name   | Description  | Example value  |
|-------|---------------|-------------------|
| spring.cloud.azure.storage.queue.credential.managed-identity-enabled | Whether to enable managed identity | `True`|
| spring.cloud.azure.storage.queue.account-name   | Storage account name | `<storage-account-name>`  |
| spring.cloud.azure.storage.queue.endpoint   | Queue Storage endpoint  | `https://<storage-account-name>.queue.core.windows.net/` |
| spring.cloud.azure.storage.queue.credential.client-id  | User-assigned managed identity client ID | `<client-ID>`  |

### Service principal

Use the following environment variables for service principal connections.

#### All client types except Spring Boot

| Default environment variable name   | Description            | Example value                                              |
| ----------------------------------- | ---------------------- | ---------------------------------------------------------- |
| AZURE_STORAGEQUEUE_RESOURCEENDPOINT | Queue Storage endpoint | `https://<storage-account-name>.queue.core.windows.net/` |
| AZURE_STORAGEQUEUE_CLIENTID         | Client ID         | `<client-ID>`                                            |
| AZURE_STORAGEQUEUE_CLIENTSECRET     | Client secret     | `<client-secret>`                                        |
| AZURE_STORAGEQUEUE_TENANTID         | Tenant ID         | `<tenant-ID>`                                            |

#### Spring Boot client

Authenticating with a service principal is available only for Spring Cloud Azure version 4.0 or higher.

| Default environment variable name   | Description | Example value   |
|------------------------------|--------------------|-------------------|
| spring.cloud.azure.storage.queue.account-name | Name for the storage account   | `storage-account-name`   |
| spring.cloud.azure.storage.queue.endpoint  | 	Queue Storage endpoint  | `https://<storage-account-name>.queue.core.windows.net/` |
| spring.cloud.azure.storage.queue.credential.client-id | Service principal client ID | `<client-ID>`   |
| spring.cloud.azure.storage.queue.credential.client-secret  | Service principal client secret | `<client-secret>` |

### Connection string

Use the following environment variables for connection string connections.

> [!IMPORTANT]
> The connection string authentication flow requires a high degree of trust in the application, and carries risks not present in other flows. You should use this flow only when more secure flows, such as managed identities, aren't viable.

#### All client types except Spring Boot

| Default environment variable name   | Description                     | Example value  |
|-------------------------------------|---------------------------------|-----------------|
| AZURE_STORAGEQUEUE_CONNECTIONSTRING | Queue Storage connection string | `DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net` |

#### Spring Boot client

| Application properties                 | Description                | Example value            |
|----------------------------------------|----------------------------|--------------------------|
| spring.cloud.azure.storage.account     | Queue Storage account name | `<storage-account-name>` |
| spring.cloud.azure.storage.access-key  | Queue Storage account key  | `<account-key>`          |
| spring.cloud.azure.storage.queue.account-name | Queue Storage account name for Spring Cloud Azure version above 4.0 | `<storage-account-name>` |
| spring.cloud.azure.storage.queue.account-key  | Queue Storage account key for Spring Cloud Azure version above 4.0  | `<account-key>`|
| spring.cloud.azure.storage.queue.endpoint     | Queue Storage endpoint for Spring Cloud Azure version above 4.0 | `https://<storage-account-name>.queue.core.windows.net/` |

## Sample connection code

The following steps and sample code connect to Queue Storage using Service Connector with [managed identity, service principal](#misp), or [connection string](#connection-string) authentication. The code gets the variable values from the environment variables Service Connector sets.

<a name="misp"></a>
### Managed identity or service principal

Use the following steps and code to connect your services to Queue Storage using a managed identity or service principal. In the code, uncomment the lines for the authentication type you want to use: System-assigned managed identity, user-assigned managed identity, or service principal.

[!INCLUDE [code sample for queue](./includes/code-queue-me-id.md)]

### Connection string

Use the following steps and code to connect to Queue Storage using a connection string.

> [!IMPORTANT]
> The connection string authentication flow requires a high degree of trust in the application, and carries risks not present in other flows. You should use this flow only when more secure flows, such as managed identities, aren't viable.

[!INCLUDE [code sample for queue](./includes/code-queue-secret.md)]

## Related content

- [Service Connector concepts](concept-service-connector-internals.md)
- [Configuration naming convention](concept-service-connector-internals.md#configuration-naming-convention)

