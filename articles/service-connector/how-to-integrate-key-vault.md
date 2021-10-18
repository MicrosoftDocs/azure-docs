---
title: Integrate Azure Key Vault with Service Connector
description: Integrate Azure Key Vault into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: serviceconnector
ms.topic: how-to 
ms.date: 10/29/2021
---

# Integrate Azure Key Vault with Service Connector

## Supported compute service

- Azure App Service
- Azure Spring Cloud

## Supported Authentication types and client types

| Client Type | System-assigned Managed Identity | User-assigned Managed Identity | Secret/ConnectionString | Service Principal |
| --- | --- | --- | --- | --- |
| .Net | | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java | | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot | | | | ![yes icon](./media/green-check.png) |
| Node.js | | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python | | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

## Default environment variable names or application properties

### .NET, Java, Node.JS, Python

**System-assigned Managed Identity**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_KEYVAULT_SCOPE | | `https://management.azure.com/.default` |
| AZURE_KEYVAULT_RESOURCEENDPOINT | | `https://{yourKeyVault}.vault.azure.net/` |

**User-assigned Managed Identity**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_KEYVAULT_SCOPE | | `https://management.azure.com/.default` |
| AZURE_KEYVAULT_RESOURCEENDPOINT | | `https://{yourKeyVault}.vault.azure.net/` |
| AZURE_KEYVAULT_CLIENTID | | `{yourClientID}` |

**Service Principal**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_KEYVAULT_SCOPE | | `https://management.azure.com/.default` |
| AZURE_KEYVAULT_RESOURCEENDPOINT | | `https://{yourKeyVault}.vault.azure.net/` |
| AZURE_KEYVAULT_CLIENTID | | `{yourClientID}` |
| AZURE_KEYVAULT_CLIENTSECRET | | `{yourClientSecret}` |
| AZURE_KEYVAULT_CLIENTID | | `{yourTenantID}` |

### Java - Spring Boot

**Service Principal**
| Default environment variable name | Description | Example value |
| --- | --- | --- |
| azure.keyvault.uri | | `"https://{yourKeyVaultName}.vault.azure.net/"` |
| azure.keyvault.client-id | | `{yourClientID}` |
| azure.keyvault.client-key | | `{yourClientSecret}` |
| azure.keyvault.tenant-id | | `{yourTenantID}` |
| azure.keyvault.scope | | `https://management.azure.com/.default` |