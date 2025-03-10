---
title: Integrate Azure Blob Storage with Service Connector
description: Integrate Azure Blob Storage into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 02/02/2024
---

# Integrate Azure Blob Storage with Service Connector

This page shows the supported authentication types, client types and sample code of Azure Blob Storage using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection.

## Supported compute services

Service Connector can be used to connect the following compute services to Azure Blob Storage:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Spring Apps

## Supported authentication types and client types

The table below shows which combinations of authentication methods and clients are supported for connecting your compute service to Azure Blob Storage using Service Connector. A “Yes” indicates that the combination is supported, while a “No” indicates that it is not supported.

| Client type        | System-assigned managed identity | User-assigned managed identity | Secret / connection string | Service principal |
|--------------------|----------------------------------|--------------------------------|----------------------------|-------------------|
| .NET               | Yes                              | Yes                            | Yes                        | Yes               |
| Java               | Yes                              | Yes                            | Yes                        | Yes               |
| Java - Spring Boot | Yes                              | Yes                            | Yes                        | Yes               |
| Node.js            | Yes                              | Yes                            | Yes                        | Yes               |
| Python             | Yes                              | Yes                            | Yes                        | Yes               |
| Go                 | Yes                              | Yes                            | Yes                        | Yes               |
| None               | Yes                              | Yes                            | Yes                        | Yes               |

This table clearly indicates that all combinations of client types and authentication methods are supported, except for the Java - Spring Boot client type, which only supports the Secret / connection string method. All other client types can use any of the authentication methods to connect to Azure Blob Storage using Service Connector.

## Default environment variable names or application properties and sample code

Reference the connection details and sample code in the following tables, according to your connection's authentication type and client type, to connect compute services to Azure Blob Storage. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

### System-assigned managed identity

#### SpringBoot client

Authenticating with a system-assigned managed identity is only available for Spring Cloud Azure version 4.0 or higher.

| Default environment variable name                                   | Description                          | Example value                                           |
|---------------------------------------------------------------------|--------------------------------------|---------------------------------------------------------|
| spring.cloud.azure.storage.blob.credential.managed-identity-enabled | Whether to enable managed identity   | `True`                                                  |
| spring.cloud.azure.storage.blob.account-name                        | Name for the storage account         | `storage-account-name`                                  |
| spring.cloud.azure.storage.blob.endpoint                            | Blob Storage endpoint               | `https://<storage-account-name>.blob.core.windows.net/` |

#### Other clients

| Default environment variable name  | Description           | Example value                                             |
| ---------------------------------- | --------------------- | --------------------------------------------------------- |
| AZURE_STORAGEBLOB_RESOURCEENDPOINT | Blob Storage endpoint | `https://<storage-account-name>.blob.core.windows.net/` |

#### Sample code

Refer to the steps and code below to connect to Azure Blob Storage using a system-assigned managed identity.
[!INCLUDE [code sample for blob](./includes/code-blob-me-id.md)]

### User-assigned managed identity

#### SpringBoot client

Authenticating with a user-assigned managed identity is only available for Spring Cloud Azure version 4.0 or higher.

| Default environment variable name                                   | Description                                      | Example value                                           |
|---------------------------------------------------------------------|--------------------------------------------------|---------------------------------------------------------|
| spring.cloud.azure.storage.blob.credential.managed-identity-enabled | Whether to enable managed identity               | `True`                                                  |
| spring.cloud.azure.storage.blob.account-name                        | Name for the storage account                     | `storage-account-name`                                  |
| spring.cloud.azure.storage.blob.endpoint                            | Blob Storage endpoint                           | `https://<storage-account-name>.blob.core.windows.net/` |
| spring.cloud.azure.storage.blob.credential.client-id                | Client ID of the user-assigned managed identity  | `00001111-aaaa-2222-bbbb-3333cccc4444`                  |

#### Other clients

| Default environment variable name  | Description           | Example value                                             |
| ---------------------------------- | --------------------- | --------------------------------------------------------- |
| AZURE_STORAGEBLOB_RESOURCEENDPOINT | Blob Storage endpoint | `https://<storage-account-name>.blob.core.windows.net/` |
| AZURE_STORAGEBLOB_CLIENTID         | Your client ID        | `<client-ID>`                                           |

#### Sample code

Refer to the steps and code below to connect to Azure Blob Storage using a user-assigned managed identity.
[!INCLUDE [code sample for blob](./includes/code-blob-me-id.md)]

### Connection string

> [!WARNING]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

#### SpringBoot client

| Application properties      | Description                    | Example value                                             |
| --------------------------- | ------------------------------ | --------------------------------------------------------- |
| azure.storage.account-name  | Your Blob storage-account-name | `<storage-account-name>`                                |
| azure.storage.account-key   | Your Blob Storage account key  | `<account-key>`                                         |
| azure.storage.blob-endpoint | Your Blob Storage endpoint     | `https://<storage-account-name>.blob.core.windows.net/` |
| spring.cloud.azure.storage.blob.account-name | Your Blob storage-account-name for Spring Cloud Azure version 4.0 or above | `<storage-account-name>`                                |
| spring.cloud.azure.storage.blob.account-key   | Your Blob Storage account key for Spring Cloud Azure version 4.0 or above  | `<account-key>`                                         |
| spring.cloud.azure.storage.blob.endpoint | Your Blob Storage endpoint for Spring Cloud Azure version 4.0 or above    | `https://<storage-account-name>.blob.core.windows.net/` |

#### Other clients

| Default environment variable name  | Description                    | Example value                                                                                                       |
|------------------------------------|--------------------------------|---------------------------------------------------------------------------------------------------------------------|
| AZURE_STORAGEBLOB_CONNECTIONSTRING | Blob Storage connection string | `DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net` |

#### Sample code

Refer to the steps and code below to connect to Azure Blob Storage using a connection string.
[!INCLUDE [code sample for blob](./includes/code-blob-secret.md)]

### Service principal

#### SpringBoot client

Authenticating with a service principal is only available for Spring Cloud Azure version 4.0 or higher.

| Default environment variable name                                   | Description                                      | Example value                                           |
|---------------------------------------------------------------------|--------------------------------------------------|---------------------------------------------------------|
| spring.cloud.azure.storage.blob.account-name                        | Name for the storage account                     | `storage-account-name`                                  |
| spring.cloud.azure.storage.blob.endpoint                            | Blob Storage endpoint                           | `https://<storage-account-name>.blob.core.windows.net/` |
| spring.cloud.azure.storage.blob.credential.client-id                | Client ID of the service principal               | `00001111-aaaa-2222-bbbb-3333cccc4444`                  |
| spring.cloud.azure.storage.blob.credential.client-secret            | Client secret to perform service principal authentication | `Aa1Bb~2Cc3.-Dd4Ee5Ff6Gg7Hh8Ii9_Jj0Kk1Ll2`     |

#### Other clients

| Default environment variable name  | Description           | Example value                                             |
| ---------------------------------- | --------------------- | --------------------------------------------------------- |
| AZURE_STORAGEBLOB_RESOURCEENDPOINT | Blob Storage endpoint | `https://<storage-account-name>.blob.core.windows.net/` |
| AZURE_STORAGEBLOB_CLIENTID         | Your client ID        | `<client-ID>`                                           |
| AZURE_STORAGEBLOB_CLIENTSECRET     | Your client secret    | `<client-secret>`                                       |
| AZURE_STORAGEBLOB_TENANTID         | Your tenant ID        | `<tenant-ID>`                                           |

#### Sample code

Refer to the steps and code below to connect to Azure Blob Storage using a service principal.
[!INCLUDE [code sample for blob](./includes/code-blob-me-id.md)]

## Next steps

Follow the tutorials to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
