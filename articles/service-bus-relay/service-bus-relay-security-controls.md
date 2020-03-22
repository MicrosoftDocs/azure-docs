---
title: Security controls for Azure Service Bus Relay
description: This articles provides a checklist of built-in security controls for evaluating Azure Service Bus Relay.
services: service-bus-relay
ms.service: service-bus-relay
author: spelluru

ms.topic: conceptual
ms.date: 01/21/2020
ms.author: spelluru

---
# Security controls for Azure Service Bus Relay

This article documents the security controls built into Azure Service Bus Relay.

[!INCLUDE [Security controls Header](../../includes/security-controls-header.md)]

## Network

| Security control | Yes/No | Notes | Documentation |
|---|---|--|--|
| Service endpoint support| No |  |   |
| Network isolation and firewalling support| No |  |   |
| Forced tunneling support| N/A | Relay is the TLS tunnel  |   |

## Monitoring & logging

| Security control | Yes/No | Notes| Documentation |
|---|---|--|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | |   |
| Control and management plane logging and audit| Yes | Through [Azure Resource Manager](../azure-resource-manager/index.yml). |   |
| Data plane logging and audit| Yes | Connection success / failure and errors and logged.  |   |

## Identity

| Security control | Yes/No | Notes| Documentation |
|---|---|--|--|
| Authentication| Yes | Via SAS. | [Azure Relay authentication and authorization](relay-authentication-and-authorization.md) |
| Authorization|  Yes | Via SAS. | [Azure Relay authentication and authorization](relay-authentication-and-authorization.md) |

## Data protection

| Security control | Yes/No | Notes | Documentation |
|---|---|--|--|
| Server-side encryption at rest: Microsoft-managed keys |  N/A | Relay is a web socket and does not persist data. |   |
| Server-side encryption at rest: customer-managed keys (BYOK) | No | Uses Microsoft TLS certs only.  |   |
| Column level encryption (Azure Data Services)| N/A | |   |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| Yes | Service requires TLS. |   |
| API calls encrypted| Yes | HTTPS. |


## Configuration management

| Security control | Yes/No | Notes| Documentation |
|---|---|--|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Through [Azure Resource Manager](../azure-resource-manager/index.yml).|   |

## Next steps

- Learn more about the [built-in security controls across Azure services](../security/fundamentals/security-controls.md).