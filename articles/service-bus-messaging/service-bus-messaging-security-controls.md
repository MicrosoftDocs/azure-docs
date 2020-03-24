---
title: Security controls for Azure Service Bus Messaging
description: A checklist of security controls for evaluating Azure Service Bus Messaging
services: service-bus-messaging
ms.service: service-bus-messaging
author: spelluru

ms.topic: conceptual
ms.date: 09/23/2019
ms.author: spelluru

---
# Security controls for Azure Service Bus Messaging

This article documents the security controls built into Azure Service Bus Messaging.

[!INCLUDE [Security controls Header](../../includes/security-controls-header.md)]

## Network

| Security control | Yes/No | Notes | Documentation |
|---|---|--|--|
| Service endpoint support| Yes (Premium tier only) | VNet service endpoints are supported for [Service Bus Premium tier](service-bus-premium-messaging.md) only. |  |
| VNet injection support| No | |  |
| Network isolation and firewalling support| Yes (Premium tier only) |  |  |
| Forced tunneling support| No |  |  |

## Monitoring & logging

| Security control | Yes/No | Notes| Documentation |
|---|---|--|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Supported via [Azure Monitor and Alerts](service-bus-metrics-azure-monitor.md). |  |
| Control and management plane logging and audit| Yes | Operations logs are available.  | [Service Bus diagnostic logs](service-bus-diagnostic-logs.md) |
| Data plane logging and audit| No |  |

## Identity

| Security control | Yes/No | Notes| Documentation |
|---|---|--|--|
| Authentication| Yes | Managed through [Azure Active Directory Managed Service Identity](service-bus-managed-service-identity.md).| [Service Bus authentication and authorization](service-bus-authentication-and-authorization.md). |
| Authorization| Yes | Supports authorization via [RBAC](authenticate-application.md) and SAS token. | [Service Bus authentication and authorization](service-bus-authentication-and-authorization.md). |

## Data protection

| Security control | Yes/No | Notes | Documentation |
|---|---|--|--|
| Server-side encryption at rest: Microsoft-managed keys |  Yes for server-side encryption-at-rest by default. |  |  |
| Server-side encryption at rest: customer-managed keys (BYOK) | Yes. | A customer managed key in Azure KeyVault can be used to encrypt the data on the Service Bus Namespace at rest. | [Configure customer-managed keys for encrypting Azure Service Bus data at rest by using the Azure portal](configure-customer-managed-key.md)  |
| Column level encryption (Azure Data Services)| N/A | |   |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| Yes | Supports standard HTTPS/TLS mechanism. |   |
| API calls encrypted| Yes | API calls are made through [Azure Resource Manager](../azure-resource-manager/index.yml) and HTTPS. |   |

## Configuration management

| Security control | Yes/No | Notes| Documentation |
|---|---|--|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Supports resource provider versioning through the [Azure Resource Manager API](/rest/api/resources/).|   |

## Next steps

- Learn more about the [built-in security controls across Azure services](../security/fundamentals/security-controls.md).
