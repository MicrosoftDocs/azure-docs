---
title: Security controls for Azure Service Bus Messaging
description: A checklist of security controls for evaluating Azure Service Bus Messaging
services: service-bus-messaging
ms.service: service-bus-messaging
documentationcenter: ''
author: axisc

ms.topic: conceptual
ms.date: 04/23/2019
ms.author: aschhab

---
# Security controls for Azure Service Bus Messaging

This article documents the security controls built into Azure Service Bus Messaging.

[!INCLUDE [Security controls Header](../../includes/security-attributes-header.md)]

## Network

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes (Premium tier only) | VNet service endpoints are supported for [Service Bus Premium tier](service-bus-premium-messaging.md) only. |
| VNet injection support| No | |
| Network isolation and firewalling support| Yes (Premium tier only) |  |
| Forced tunneling support| No |  |

## Monitoring & logging

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Supported via [Azure Monitor and Alerts](service-bus-metrics-azure-monitor.md). |
| Control and management plane logging and audit| Yes | Operations logs are available; see [Service Bus diagnostic logs](service-bus-diagnostic-logs.md).  |
| Data plane logging and audit| No |  |

## Identity

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Managed through [Azure Active Directory Managed Service Identity](service-bus-managed-service-identity.md); see [Service Bus authentication and authorization](service-bus-authentication-and-authorization.md).|
| Authorization| Yes | Supports authorization via [RBAC](authenticate-application.md) and SAS token; see [Service Bus authentication and authorization](service-bus-authentication-and-authorization.md). |

## Data protection

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys |  Yes for server-side encryption-at-rest by default. | Customer managed keys and BYOK are not yet supported. Client side encryption is the client's responsibility |
| Server-side encryption at rest: customer managed keys (BYOK) | No |   |
| Column level encryption (Azure Data Services)| N/A | |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| Yes | Supports standard HTTPS/TLS mechanism. |
| API calls encrypted| Yes | API calls are made through [Azure Resource Manager](../azure-resource-manager/index.yml) and HTTPS. |

## Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Supports resource provider versioning through the [Azure Resource Manager API](/rest/api/resources/).|
