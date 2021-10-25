---
title: Azure services that support Azure AD authentication - Azure AD
description: List of services that support Azure AD authentication
services: active-directory
author: barclayn
ms.author: barclayn
ms.date: 10/25/2021
ms.topic: conceptual
ms.service: active-directory
ms.subservice: msi
manager: karenh444
ms.custom: references_regions
---




# Azure services that support Azure AD authentication

The following services support Azure AD authentication.

## Azure Resource Manager

Refer to the following list to configure access to Azure Resource Manager:

- [Assign access via Azure portal](howto-assign-access-portal.md)
- [Assign access via PowerShell](howto-assign-access-powershell.md)
- [Assign access via Azure CLI](howto-assign-access-CLI.md)
- [Assign access via Azure Resource Manager template](../../role-based-access-control/role-assignments-template.md)

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://management.azure.com/`| ![Available][check] |
| Azure Government | `https://management.usgovcloudapi.net/` | ![Available][check] |
| Azure Germany | `https://management.microsoftazure.de/` | ![Available][check] |
| Azure China 21Vianet | `https://management.chinacloudapi.cn` | ![Available][check] |

## Azure Key Vault

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://vault.azure.net`| ![Available][check] |
| Azure Government | `https://vault.usgovcloudapi.net` | ![Available][check] |
| Azure Germany |  `https://vault.microsoftazure.de` | ![Available][check] |
| Azure China 21Vianet | `https://vault.azure.cn` | ![Available][check] |

## Azure Data Lake

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://datalake.azure.net/` | ![Available][check] |
| Azure Government |  | Not Available |
| Azure Germany |   | Not Available |
| Azure China 21Vianet |  | Not Available |

## Azure SQL

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://database.windows.net/` | ![Available][check] |
| Azure Government | `https://database.usgovcloudapi.net/` | ![Available][check] |
| Azure Germany | `https://database.cloudapi.de/` | ![Available][check] |
| Azure China 21Vianet | `https://database.chinacloudapi.cn/` | ![Available][check] |

## Azure Data Explorer

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://<account>.<region>.kusto.windows.net` | ![Available][check] |
| Azure Government | `https://<account>.<region>.kusto.usgovcloudapi.net` | ![Available][check] |
| Azure Germany | `https://<account>.<region>.kusto.cloudapi.de` | ![Available][check] |
| Azure China 21Vianet | `https://<account>.<region>.kusto.chinacloudapi.cn` | ![Available][check] |

## Azure Event Hubs

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://eventhubs.azure.net` | ![Available][check] |
| Azure Government |  | Not Available |
| Azure Germany |   | Not Available |
| Azure China 21Vianet |  | Not Available |

## Azure Service Bus

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://servicebus.azure.net`  | ![Available][check] |
| Azure Government |  | ![Available][check] |
| Azure Germany |   | Not Available |
| Azure China 21Vianet |  | Not Available |

## Azure Storage blobs and queues

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://storage.azure.com/` <br /><br />`https://<account>.blob.core.windows.net` <br /><br />`https://<account>.queue.core.windows.net` | ![Available][check] |
| Azure Government | `https://storage.azure.com/`<br /><br />`https://<account>.blob.core.usgovcloudapi.net` <br /><br />`https://<account>.queue.core.usgovcloudapi.net` | ![Available][check] |
| Azure Germany | `https://storage.azure.com/`<br /><br />`https://<account>.blob.core.cloudapi.de` <br /><br />`https://<account>.queue.core.cloudapi.de` | ![Available][check] |
| Azure China 21Vianet | `https://storage.azure.com/`<br /><br />`https://<account>.blob.core.chinacloudapi.cn` <br /><br />`https://<account>.queue.core.chinacloudapi.cn` | ![Available][check] |

## Azure Analysis Services

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://*.asazure.windows.net` | ![Available][check] |
| Azure Government | `https://*.asazure.usgovcloudapi.net` | ![Available][check] |
| Azure Germany | `https://*.asazure.cloudapi.de` | ![Available][check] |
| Azure China 21Vianet | `https://*.asazure.chinacloudapi.cn` | ![Available][check] |

> [!Note]
> Microsoft Power BI also [supports managed identities](../../stream-analytics/powerbi-output-managed-identity.md).

[check]: media/services-support-managed-identities/check.png "Available"