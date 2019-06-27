---
title: Common security attributes for Azure Service Bus Messaging
description: A checklist of common security attributes for evaluating Azure Service Bus Messaging
services: service-bus-messaging
ms.service: service-bus-messaging
documentationcenter: ''
author: msmbaldwin
manager: barbkess

ms.topic: conceptual
ms.date: 04/23/2019
ms.author: mbaldwin

---
# Security attributes for Azure Service Bus Messaging

This article documents the security attributes built into Azure Service Bus Messaging.

[!INCLUDE [Security Attributes Header](../../includes/security-attributes-header.md)]

## Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>|  Yes for server-side encryption-at-rest by default. | Customer managed keys and BYOK are not yet supported. Client side encryption is the client's responsibility |
| Encryption in transit:<ul><li>Express route encryption</li><li>In VNet encryption</li><li>VNet-VNet encryption</ul>| Yes | Supports standard HTTPS/TLS mechanism. |
| Encryption key handling (CMK, BYOK, etc.)| No |   |
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | API calls are made through [Azure Resource Manager](../azure-resource-manager/index.yml) and HTTPS. |

## Network segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes (Premium tier only) | VNet service endpoints are supported for [Service Bus Premium tier](service-bus-premium-messaging.md) only. |
| VNet injection support| No | |
| Network isolation and firewalling support| Yes (Premium tier only) |  |
| Forced tunneling support| No |  |

## Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Supported via [Azure Monitor and Alerts](service-bus-metrics-azure-monitor.md). |

## Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Managed through [Azure Active Directory Managed Service Identity](service-bus-managed-service-identity.md); see [Service Bus authentication and authorization](service-bus-authentication-and-authorization.md).|
| Authorization| Yes | Supports authorization via [RBAC](service-bus-role-based-access-control.md) (Preview) and SAS token; see [Service Bus authentication and authorization](service-bus-authentication-and-authorization.md). |



## Audit trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | Operations logs are available; see [Service Bus diagnostic logs](service-bus-diagnostic-logs.md).  |
| Data plane logging and audit| No |  |

## Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Supports resource provider versioning through the [Azure Resource Manager API](/rest/api/resources/).|
