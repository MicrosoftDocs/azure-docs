---
title: Integrate Azure Key Vault with Service Connector
description: Integrate Azure Key Vault into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 02/02/2024
---

# Integrate Azure Key Vault with Service Connector

> [!NOTE]
> When you use Service Connector to connect your Key Vault or manage Key Vault connections, Service Connector uses your token to perform the corresponding operations.

This page shows supported authentication methods and clients, and shows sample code you can use to connect Azure Key Vault to other cloud services using Service Connector. You might still be able to connect to Azure Key Vault in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. 

## Supported compute services

Service Connector can be used to connect the following compute services to Azure Key Vault:

- Azure App Service
- Azure Functions
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

The table below shows which combinations of client types and authentication methods are supported for connecting your compute service to Azure Key Vault using Service Connector. A “Yes” indicates that the combination is supported, while a “No” indicates that it is not supported.

| Client type        | System-assigned managed identity | User-assigned managed identity | Secret / connection string | Service principal |
|--------------------|----------------------------------|--------------------------------|----------------------------|-------------------|
| .NET               | Yes                              | Yes                            | No                         | Yes               |
| Java               | Yes                              | Yes                            | No                         | Yes               |
| Java - Spring Boot | Yes                              | Yes                            | No                         | Yes               |
| Node.js            | Yes                              | Yes                            | No                         | Yes               |
| Python             | Yes                              | Yes                            | No                         | Yes               |
| None               | Yes                              | Yes                            | No                         | Yes               |

This table indicates that all combinations of client types and authentication methods in the table are supported, except for the Secret / connection string method, which is not supported for any of the client types. All client types can use any of the other authentication methods to connect to Azure Key Vault using Service Connector.

## Default environment variable names or application properties and sample code

Use the connection details below to connect compute services to Azure Key Vault. For each example below, replace the placeholder texts `<vault-name>`, `<client-ID>`, `<client-secret>`, and `<tenant-id>` with your Key Vault name, client-ID, client secret and tenant ID. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### System-assigned managed identity

#### SpringBoot client type

| Default environment variable name | Description                 | Example value                             |
|-----------------------------------|-----------------------------|-------------------------------------------|
| azure.keyvault.uri                | Your Key Vault endpoint URL | `"https://<vault-name>.vault.azure.net/"` |
| azure.keyvault.scope              | Your Azure RBAC scope       | `https://management.azure.com/.default`   |
| spring.cloud.azure.keyvault.secret.credential.managed-identity-enabled | Whether to enable managed identity for Spring Cloud Azure version 4.0 and above | `true` |
| spring.cloud.azure.keyvault.secret.endpoint | Your Key Vault endpoint URL for Spring Cloud Azure version 4.0 and above | `"https://<vault-name>.vault.azure.net/"` |

#### Other client types

| Default environment variable name | Description             | Example value                             |
| --------------------------------- | ----------------------- | ----------------------------------------- |
| AZURE_KEYVAULT_SCOPE              | Your Azure RBAC scope   | `https://management.azure.com/.default` |
| AZURE_KEYVAULT_RESOURCEENDPOINT   | Your Key Vault endpoint | `https://<vault-name>.vault.azure.net/` |

#### Sample code

Refer to the steps and code below to connect to Azure Key Vault using a system-assigned managed identity.
[!INCLUDE [code sample for key vault](./includes/code-keyvault-me-id.md)]

### User-assigned managed identity

#### SpringBoot client type

| Default environment variable name | Description                 | Example value                             |
|-----------------------------------|-----------------------------|-------------------------------------------|
| azure.keyvault.uri                | Your Key Vault endpoint URL | `"https://<vault-name>.vault.azure.net/"` |
| azure.keyvault.client-id          | Your Client ID              | `<client-ID>`                             |
| azure.keyvault.scope              | Your Azure RBAC scope       | `https://management.azure.com/.default`   |
| spring.cloud.azure.keyvault.secret.credential.managed-identity-enabled | Whether to enable managed identity for Spring Cloud Azure version 4.0 and above | `true` |
| spring.cloud.azure.keyvault.secret.endpoint | Your Key Vault endpoint URL for Spring Cloud Azure version 4.0 and above | `"https://<vault-name>.vault.azure.net/"` |
| spring.cloud.azure.keyvault.secret.credential.client-id | Your Client ID for Spring Cloud Azure version 4.0 and above | `<client-ID>`  |

#### Other client types

| Default environment variable name | Description             | Example value                           |
|-----------------------------------|-------------------------|-----------------------------------------|
| AZURE_KEYVAULT_SCOPE              | Your Azure RBAC scope   | `https://management.azure.com/.default` |
| AZURE_KEYVAULT_RESOURCEENDPOINT   | Your Key Vault endpoint | `https://<vault-name>.vault.azure.net/` |
| AZURE_KEYVAULT_CLIENTID           | Your Client ID          | `<client-ID>`                           |

#### Sample code

Refer to the steps and code below to connect to Azure Key Vault using a system-assigned managed identity.
[!INCLUDE [code sample for key vault](./includes/code-keyvault-me-id.md)]

### Service principal

#### SpringBoot client type

| Default environment variable name | Description                 | Example value                             |
|-----------------------------------|-----------------------------|-------------------------------------------|
| azure.keyvault.uri                | Your Key Vault endpoint URL | `"https://<vault-name>.vault.azure.net/"` |
| azure.keyvault.client-id          | Your Client ID              | `<client-ID>`                             |
| azure.keyvault.client-key         | Your Client secret          | `<client-secret>`                         |
| azure.keyvault.tenant-id          | Your Tenant ID              | `<tenant-id>`                             |
| azure.keyvault.scope              | Your Azure RBAC scope       | `https://management.azure.com/.default`   |
| spring.cloud.azure.keyvault.secret.endpoint | Your Key Vault endpoint URL for Spring Cloud Azure version 4.0 and above | `"https://<vault-name>.vault.azure.net/"` |
| spring.cloud.azure.keyvault.secret.credential.client-id | Your Client ID for Spring Cloud Azure version 4.0 and above | `<client-ID>`  |
| spring.cloud.azure.keyvault.secret.credential.client-secret | Your Client secret for Spring Cloud Azure version 4.0 and above | `<client-secret>`                       |
| spring.cloud.azure.keyvault.secret.profile.tenant-id | Your Tenant ID for Spring Cloud Azure version 4.0 and above | `<tenant-id>`                             |

#### Other client types

| Default environment variable name | Description             | Example value                           |
|-----------------------------------|-------------------------|-----------------------------------------|
| AZURE_KEYVAULT_SCOPE              | Your Azure RBAC scope   | `https://management.azure.com/.default` |
| AZURE_KEYVAULT_RESOURCEENDPOINT   | Your Key Vault endpoint | `https://<vault-name>.vault.azure.net/` |
| AZURE_KEYVAULT_CLIENTID           | Your Client ID          | `<client-ID>`                           |
| AZURE_KEYVAULT_CLIENTSECRET       | Your Client secret      | `<client-secret>`                       |
| AZURE_KEYVAULT_TENANTID           | Your Tenant ID          | `<tenant-id>`                           |

#### Sample code

Refer to the steps and code below to connect to Azure Key Vault using a system-assigned managed identity.
[!INCLUDE [code sample for key vault](./includes/code-keyvault-me-id.md)]

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
