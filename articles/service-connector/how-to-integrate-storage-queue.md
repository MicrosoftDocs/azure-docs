---
title: Integrate Azure Queue Storage with Service Connector
description: Integrate Azure Queue Storage into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 02/02/2024
---

# Integrate Azure Queue Storage with Service Connector

This page shows supported authentication methods and clients, and shows sample code you can use to connect Azure Queue Storage to other cloud services using Service Connector. You might still be able to connect to Azure Queue Storage in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. 

## Supported compute services

Service Connector can be used to connect the following compute services to Azure Queue Storage:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Spring Apps

## Supported authentication types and client types

The table below shows which combinations of authentication methods and clients are supported for connecting your compute service to Azure Queue Storage using Service Connector. A “Yes” indicates that the combination is supported, while a “No” indicates that it is not supported.

| Client type        | System-assigned managed identity | User-assigned managed identity | Secret / connection string | Service principal |
|--------------------|----------------------------------|--------------------------------|----------------------------|-------------------|
| .NET               | Yes                              | Yes                            | Yes                        | Yes               |
| Java               | Yes                              | Yes                            | Yes                        | Yes               |
| Java - Spring Boot | Yes                              | Yes                            | Yes                        | Yes               |
| Node.js            | Yes                              | Yes                            | Yes                        | Yes               |
| Python             | Yes                              | Yes                            | Yes                        | Yes               |

This table indicates that all combinations of client types and authentication methods are supported, except for the Java - Spring Boot client type, which only supports the Secret / connection string method. All other client types can use any of the authentication methods to connect to Azure Queue Storage using Service Connector.

## Default environment variable names or application properties and sample code

Use the connection details below to connect compute services to Queue Storage. For each example below, replace the placeholder texts
`<account name>`, `<account-key>`, `<client-ID>`,  `<client-secret>`, `<tenant-ID>`, and `<storage-account-name>` with your own account name, account key, client ID, client secret, tenant ID and storage account name. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### System-assigned managed identity

#### SpringBoot client

Authenticating with a system-assigned managed identity is only available for Spring Cloud Azure version 4.0 or higher.

| Default environment variable name                                   | Description                          | Example value                                           |
|---------------------------------------------------------------------|--------------------------------------|---------------------------------------------------------|
| spring.cloud.azure.storage.queue.credential.managed-identity-enabled | Whether to enable managed identity   | `True`                                                  |
| spring.cloud.azure.storage.queue.account-name                        | Name for the storage account         | `storage-account-name`                                  |
| spring.cloud.azure.storage.queue.endpoint                            | Queue Storage endpoint               | `https://<storage-account-name>.queue.core.windows.net/` |

#### Other clients

| Default environment variable name   | Description            | Example value                                              |
| ----------------------------------- | ---------------------- | ---------------------------------------------------------- |
| AZURE_STORAGEQUEUE_RESOURCEENDPOINT | Queue storage endpoint | `https://<storage-account-name>.queue.core.windows.net/` |

#### Sample code
Refer to the steps and code below to connect to Azure Queue Storage using a system-assigned managed identity.
[!INCLUDE [code sample for queue](./includes/code-queue-me-id.md)]


### User-assigned managed identity

#### SpringBoot client

Authenticating with a user-assigned managed identity is only available for Spring Cloud Azure version 4.0 or higher.

| Default environment variable name                                   | Description                                      | Example value                                           |
|---------------------------------------------------------------------|--------------------------------------------------|---------------------------------------------------------|
| spring.cloud.azure.storage.queue.credential.managed-identity-enabled | Whether to enable managed identity               | `True`                                                  |
| spring.cloud.azure.storage.queue.account-name                        | Name for the storage account                     | `storage-account-name`                                  |
| spring.cloud.azure.storage.queue.endpoint                            | Queue Storage endpoint                           | `https://<storage-account-name>.queue.core.windows.net/` |
| spring.cloud.azure.storage.queue.credential.client-id                | Client ID of the user-assigned managed identity  | `00001111-aaaa-2222-bbbb-3333cccc4444`                  |

#### Other clients


| Default environment variable name   | Description            | Example value                                              |
| ----------------------------------- | ---------------------- | ---------------------------------------------------------- |
| AZURE_STORAGEQUEUE_RESOURCEENDPOINT | Queue storage endpoint | `https://<storage-account-name>.queue.core.windows.net/` |
| AZURE_STORAGEQUEUE_CLIENTID         | Your client ID         | `<client-ID>`                                            |

#### Sample code
Refer to the steps and code below to connect to Azure Queue Storage using a user-assigned managed identity.
[!INCLUDE [code sample for queue](./includes/code-queue-me-id.md)]

### Connection string

> [!WARNING]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

#### SpringBoot client


| Application properties                 | Description                | Example value            |
|----------------------------------------|----------------------------|--------------------------|
| spring.cloud.azure.storage.account     | Queue storage account name | `<storage-account-name>` |
| spring.cloud.azure.storage.access-key  | Queue storage account key  | `<account-key>`          |
| spring.cloud.azure.storage.queue.account-name | Queue storage account name for Spring Cloud Azure version above 4.0 | `<storage-account-name>` |
| spring.cloud.azure.storage.queue.account-key  | Queue storage account key for Spring Cloud Azure version above 4.0  | `<account-key>`          |
| spring.cloud.azure.storage.queue.endpoint     | Queue storage endpoint for Spring Cloud Azure version above 4.0     | `https://<storage-account-name>.queue.core.windows.net/` |

#### Other clients

| Default environment variable name   | Description                     | Example value                                                                                                        |
|-------------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------|
| AZURE_STORAGEQUEUE_CONNECTIONSTRING | Queue storage connection string | `DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net` |


#### Sample code
Refer to the steps and code below to connect to Azure Queue Storage using a connection string.
[!INCLUDE [code sample for queue](./includes/code-queue-secret.md)]

### Service principal

#### SpringBoot client

Authenticating with a service principal is only available for Spring Cloud Azure version 4.0 or higher.

| Default environment variable name                                   | Description                                      | Example value                                           |
|---------------------------------------------------------------------|--------------------------------------------------|---------------------------------------------------------|
| spring.cloud.azure.storage.queue.account-name                        | Name for the storage account                     | `storage-account-name`                                  |
| spring.cloud.azure.storage.queue.endpoint                          | 	Queue Storage endpoint                         | `https://<storage-account-name>.queue.core.windows.net/` |
| spring.cloud.azure.storage.queue.credential.client-id                | Client ID of the service principal               | `00001111-aaaa-2222-bbbb-3333cccc4444`                  |
| spring.cloud.azure.storage.queue.credential.client-secret            | Client secret to perform service principal authentication | `Aa1Bb~2Cc3.-Dd4Ee5Ff6Gg7Hh8Ii9_Jj0Kk1Ll2`     |

#### Other clients

| Default environment variable name   | Description            | Example value                                              |
| ----------------------------------- | ---------------------- | ---------------------------------------------------------- |
| AZURE_STORAGEQUEUE_RESOURCEENDPOINT | Queue storage endpoint | `https://<storage-account-name>.queue.core.windows.net/` |
| AZURE_STORAGEQUEUE_CLIENTID         | Your client ID         | `<client-ID>`                                            |
| AZURE_STORAGEQUEUE_CLIENTSECRET     | Your client secret     | `<client-secret>`                                        |
| AZURE_STORAGEQUEUE_TENANTID         | Your tenant ID         | `<tenant-ID>`                                            |

#### Sample code
Refer to the steps and code below to connect to Azure Queue Storage using a service principal.
[!INCLUDE [code sample for queue](./includes/code-queue-me-id.md)]

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
