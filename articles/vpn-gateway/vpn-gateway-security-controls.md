---
title: Security controls for Azure VPN Gateway
description: A checklist of security controls for evaluating Azure VPN Gateway
services: sql-database
author: msmbaldwin
manager: rkarlin
ms.service: vpn-gateway

ms.topic: conceptual
ms.date: 09/06/2019
ms.author: mbaldwin

---
# Security controls for Azure VPN Gateway

This article documents the security controls built into Azure VPN Gateway.

[!INCLUDE [Security controls Header](../../includes/security-controls-header.md)]

## Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| N/A | |
| VNet injection support| N/A | |
| Network Isolation and Firewalling support| Yes | VPN gateways are dedicated VM instances for each customer Virtual Network  |
| Forced tunneling support| Yes |  |

## Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | See [Azure Monitor Diagnostics Logs/alert](vpn-gateway-howto-setup-alerts-virtual-network-gateway-log.md) & [Azure Monitor Metrics/alert](vpn-gateway-howto-setup-alerts-virtual-network-gateway-metric.md).  |
| Control and management plane logging and audit| Yes | Azure Resource Manager Activity Log. |
| Data plane logging and audit | Yes | [Azure Monitor Diagnostic Logs](../azure-resource-manager/management/view-activity-logs.md) for VPN connectivity logging and auditing. |

## Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) for managing the service and configuring the Azure VPN gateway. |
| Authorization| Yes | Support Authorization via [RBAC](../role-based-access-control/overview.md). |

## Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft-managed keys | N/A | VPN gateway transit customer data, does NOT store customer data |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| Yes | VPN gateway encrypt customer packets between Azure VPN gateways and customer on-premises VPN devices (S2S) or VPN clients (P2S). VPN gateways also support VNet-to-VNet encryption. |
| Server-side encryption at rest: customer-managed keys (BYOK) | No | Customer-specified pre-shared keys are encrypted at rest; but not integrated with CMK yet. |
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Through [Azure Resource Manager](../azure-resource-manager/index.yml) and HTTPS  |

## Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | For management operations, the state of an Azure VPN gateway configuration can be exported as an Azure Resource Manager template and versioned over time. |

## Next steps

- Learn more about the [built-in security controls across Azure services](../security/fundamentals/security-controls.md).
