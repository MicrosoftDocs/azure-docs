---
title: Integrate Azure Key Vault with Service Connector
description: Integrate Azure Key Vault into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 08/11/2022
ms.custom: event-tier1-build-2022
---

# Integrate Azure Key Vault with Service Connector

> [!NOTE]
> When you use Service Connector to connect your key vault or manage key vault connections, Service Connector use your token to perform the corresponding operations.

This page shows the supported authentication types and client types of Azure Key Vault using Service Connector. You might still be able to connect to Azure Key Vault in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

Supported authentication and clients for App Service, Container Apps and Azure Spring Apps:

### [Azure App Service](#tab/app-service)

| Client type        | System-assigned managed identity     | User-assigned managed identity       | Secret / connection string | Service principal                    |
|--------------------|--------------------------------------|--------------------------------------|----------------------------|--------------------------------------|
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |                            | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |                            | ![yes icon](./media/green-check.png) |
| Java - Spring Boot |                                      | ![yes icon](./media/green-check.png) |                            | ![yes icon](./media/green-check.png) |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |                            | ![yes icon](./media/green-check.png) |
| Python             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |                            | ![yes icon](./media/green-check.png) |
| None               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |                            | ![yes icon](./media/green-check.png) |

### [Azure Container Apps](#tab/container-apps)

| Client type        | System-assigned managed identity     | User-assigned managed identity       | Secret / connection string | Service principal                    |
|--------------------|--------------------------------------|--------------------------------------|----------------------------|--------------------------------------|
| .NET               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |                            | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |                            | ![yes icon](./media/green-check.png) |
| Java - Spring Boot |                                      | ![yes icon](./media/green-check.png) |                            | ![yes icon](./media/green-check.png) |
| Node.js            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |                            | ![yes icon](./media/green-check.png) |
| Python             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |                            | ![yes icon](./media/green-check.png) |
| None               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |                            | ![yes icon](./media/green-check.png) |

### [Azure Spring Apps](#tab/spring-apps)

| Client type        | System-assigned managed identity     | User-assigned managed identity       | Secret / connection string | Service principal                    |
|--------------------|--------------------------------------|--------------------------------------|----------------------------|--------------------------------------|
| .NET               | ![yes icon](./media/green-check.png) |                                      |                            | ![yes icon](./media/green-check.png) |
| Java               | ![yes icon](./media/green-check.png) |                                      |                            | ![yes icon](./media/green-check.png) |
| Java - Spring Boot | ![yes icon](./media/green-check.png) |                                      |                            | ![yes icon](./media/green-check.png) |
| Node.js            | ![yes icon](./media/green-check.png) |                                      |                            | ![yes icon](./media/green-check.png) |
| Python             | ![yes icon](./media/green-check.png) |                                      |                            | ![yes icon](./media/green-check.png) |
| None               | ![yes icon](./media/green-check.png) |                                      |                            | ![yes icon](./media/green-check.png) |

---

## Default environment variable names or application properties

Use the connection details below to connect compute services to Azure Key Vault. For each example below, replace the placeholder texts `<vault-name>`, `<client-ID>`, `<client-secret>`, and `<tenant-id>` with your key vault name,  client-ID, client secret and tenant ID.

### System-assigned managed identity

| Default environment variable name | Description             | Example value                           |
|-----------------------------------|-------------------------|-----------------------------------------|
| AZURE_KEYVAULT_SCOPE              | Your Azure RBAC scope   | `https://management.azure.com/.default` |
| AZURE_KEYVAULT_RESOURCEENDPOINT   | Your Key Vault endpoint | `https://<vault-name>.vault.azure.net/` |

### User-assigned managed identity

| Default environment variable name | Description             | Example value                           |
|-----------------------------------|-------------------------|-----------------------------------------|
| AZURE_KEYVAULT_SCOPE              | Your Azure RBAC scope   | `https://management.azure.com/.default` |
| AZURE_KEYVAULT_RESOURCEENDPOINT   | Your Key Vault endpoint | `https://<vault-name>.vault.azure.net/` |
| AZURE_KEYVAULT_CLIENTID           | Your Client ID          | `<client-ID>`                           |

### Service principal

| Default environment variable name | Description             | Example value                           |
|-----------------------------------|-------------------------|-----------------------------------------|
| AZURE_KEYVAULT_SCOPE              | Your Azure RBAC scope   | `https://management.azure.com/.default` |
| AZURE_KEYVAULT_RESOURCEENDPOINT   | Your Key Vault endpoint | `https://<vault-name>.vault.azure.net/` |
| AZURE_KEYVAULT_CLIENTID           | Your Client ID          | `<client-ID>`                           |
| AZURE_KEYVAULT_CLIENTSECRET       | Your Client secret      | `<client-secret>`                       |
| AZURE_KEYVAULT_TENANTID           | Your Tenant ID          | `<tenant-id>`                           |

### Java - Spring Boot service principal

| Default environment variable name | Description                 | Example value                             |
|-----------------------------------|-----------------------------|-------------------------------------------|
| azure.keyvault.uri                | Your Key Vault endpoint URL | `"https://<vault-name>.vault.azure.net/"` |
| azure.keyvault.client-id          | Your Client ID              | `<client-ID>`                             |
| azure.keyvault.client-key         | Your Client secret          | `<client-secret>`                         |
| azure.keyvault.tenant-id          | Your Tenant ID              | `<tenant-id>`                             |
| azure.keyvault.scope              | Your Azure RBAC scope       | `https://management.azure.com/.default`   |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
