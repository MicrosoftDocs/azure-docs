---
title: Common security attributes for Azure API Management
description: A checklist of common security attributes for evaluating API Management
services: api-management
documentationcenter: ''
author: msmbaldwin
manager: barbkess
ms.service: api-management

ms.topic: conceptual
ms.date: 04/16/2019
ms.author: mbaldwin

---
# Common security attributes for API Management

Security is integrated into every aspect of an Azure service. This article documents the common security attributes built into API Management.

[!INCLUDE [Security Attributes Header](../../includes/security-attributes-header.md)]

## Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>| Yes | Sensitive data such as certificates, keys, and secret-named values are encrypted with service-managed, per service instance keys. |
| Encryption in transit:<ul><li>Express route encryption</li><li>In Vnet encryption</li><li>VNet-VNet encryption</ul>| Yes | [Express Route](../expressroute/index.yml) and VNET encryption is provided by [Azure networking](../virtual-network/index.yml). |
| Encryption key handling (CMK, BYOK, etc.)| No | All encryption keys are per service instance and are service managed. |
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Management plane calls are made through [Azure Resource Manager](../azure-resource-manager/index.yml) over TLS. A valid JSON web token (JWT) is required.  Data plane calls can be secured with TLS and one of supported authentication mechanisms (e.g. client certificate or JWT).
 |

## Network segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| No | |
| vNET injection support| Yes | |
| Network isolation and firewalling support| Yes | Using networking security groups (NSG) and Azure Application Gateway (or other software appliance) respectively. |
| Forced tunneling support| Yes | Azure networking provides forced tunneling. |

## Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | |

## Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | |
| Authorization| Yes | |


## Audit trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | [Azure Monitor activity logs](../azure-monitor/platform/activity-logs-overview.md) |
| Data plane logging and audit| Yes | [Azure Monitor diagnostic logs](../azure-monitor/platform/diagnostic-logs-overview.md) and (optionally) [Azure Application Insights](../azure-monitor/app/app-insights-overview.md).  |

## Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Using the [Azure API Management DevOps Resource Kit](https://aka.ms/apimdevops) |
