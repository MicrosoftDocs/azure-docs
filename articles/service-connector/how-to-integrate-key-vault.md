---
title: Integrate Azure Key Vault with Service Connector
description: Integrate Azure Key Vault into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: service-connector
ms.topic: how-to
ms.date: 10/29/2021
ms.custom: ignite-fall-2021
---

# Integrate Azure Key Vault with Service Connector

> [!NOTE]
> When you use Service Connector to connect your key vault or manage key vault connections, Service Connector will be using your token to perform the corresponding operations.

This page shows the supported authentication types and client types of Azure Key Vault using Service Connector. You might still be able to connect to Azure Key Vault in other programming languages without using Service Connector. This page also shows default environment variable name and value (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service
- Azure Spring Cloud

## Supported Authentication types and client types

| Client Type | System-assigned Managed Identity | User-assigned Managed Identity | Secret/ConnectionString | Service Principal |
| --- | --- | --- | --- | --- |
| .Net | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | | ![yes icon](./media/green-check.png) |
| Java | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | | ![yes icon](./media/green-check.png) |
| Java - Spring Boot | | ![yes icon](./media/green-check.png) | | ![yes icon](./media/green-check.png) |
| Node.js | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | | ![yes icon](./media/green-check.png) |
| Python | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | | ![yes icon](./media/green-check.png) |

## Default environment variable names or application properties

### .NET, Java, Node.JS, Python

**System-assigned Managed Identity**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_KEYVAULT_SCOPE | Your Azure RBAC scope | `https://management.azure.com/.default` |
| AZURE_KEYVAULT_RESOURCEENDPOINT | Your Key Vault endpoint | `https://{yourKeyVault}.vault.azure.net/` |

**User-assigned Managed Identity**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_KEYVAULT_SCOPE | Your Azure RBAC scope | `https://management.azure.com/.default` |
| AZURE_KEYVAULT_RESOURCEENDPOINT | Your Key Vault endpoint | `https://{yourKeyVault}.vault.azure.net/` |
| AZURE_KEYVAULT_CLIENTID | Your Client ID | `{yourClientID}` |

**Service Principal**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_KEYVAULT_SCOPE | Your Azure RBAC scope | `https://management.azure.com/.default` |
| AZURE_KEYVAULT_RESOURCEENDPOINT | Your Key Vault endpoint | `https://{yourKeyVault}.vault.azure.net/` |
| AZURE_KEYVAULT_CLIENTID | Your Client ID | `{yourClientID}` |
| AZURE_KEYVAULT_CLIENTSECRET | Your Client secret | `{yourClientSecret}` |
| AZURE_KEYVAULT_TENANTID | Your Tenant ID | `{yourTenantID}` |

### Java - Spring Boot

**Service Principal**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| azure.keyvault.uri | Your Key Vault endpoint URL | `"https://{yourKeyVaultName}.vault.azure.net/"` |
| azure.keyvault.client-id | Your Client ID | `{yourClientID}` |
| azure.keyvault.client-key | Your Client secret | `{yourClientSecret}` |
| azure.keyvault.tenant-id |  Your Tenant ID | `{yourTenantID}` |
| azure.keyvault.scope | Your Azure RBAC scope | `https://management.azure.com/.default` |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
