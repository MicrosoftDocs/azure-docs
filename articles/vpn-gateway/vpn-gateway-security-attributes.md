---
title: Security attributes for Azure VPN Gateway
description: A checklist of security attributes for evaluating Azure VPN Gateway
services: sql-database
author: msmbaldwin
manager: barbkess
ms.service: load-balancer

ms.topic: conceptual
ms.date: 05/06/2019
ms.author: mbaldwin

---
# Security attributes for Azure VPN Gateway

This article documents the common security attributes built into Azure VPN Gateway.

[!INCLUDE [Security Attributes Header](../../includes/security-attributes-header.md)]


## Preventative

| Security attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features) | N/A | VPN gateway transit customer data, does NOT store customer data |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| Yes | VPN gateway encrypt customer packets between Azure VPN gateways and customer on-premises VPN devices (S2S) or VPN clients (P2S). VPN gateways also support VNet-to-VNet encryption. |
| Encryption key handling (CMK, BYOK, etc.)| No | Customer-specified pre-shared keys are encrypted at rest; but not integrated with CMK yet. |
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Through [Azure Resource Manager](../azure-resource-manager/index.yml) and HTTPS  |

## Network segmentation

| Security attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| N/A | |
| VNet injection support| N/A | . |
| Network Isolation and Firewalling support| Yes | VPN gateways are dedicated VM instances for each customer Virtual Network  |
| Forced tunneling support| Yes |  |

## Detection

| Security attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | See [Azure Monitor Diagnostics Logs/alert](vpn-gateway-howto-setup-alerts-virtual-network-gateway-log.md) & [Azure Monitor Metrics/alert](vpn-gateway-howto-setup-alerts-virtual-network-gateway-metric.md).  |

## Identity and access management

| Security attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) for managing the service and configuring the Azure VPN gateway. |
| Authorization| Yes | Support Authorization via [RBAC](../role-based-access-control/overview.md). |


## Audit trail

| Security attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | Azure Resource Manager Activity Log. |
| Data plane logging and audit | Yes | [Azure Monitor Diagnostic Logs](../azure-resource-manager/resource-group-audit.md) for VPN connectivity logging and auditing. |

## Configuration management

| Security attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | For management operations, the state of an Azure VPN gateway configuration can be exported as an Azure Resource Manager template and versioned over time. | 