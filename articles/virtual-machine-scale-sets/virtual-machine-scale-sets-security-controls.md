---
title: Security controls for Azure Virtual Machine Scale Sets
description: A checklist of security controls for evaluating Azure Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.topic: conceptual
ms.service: virtual-machine-scale-sets
ms.subservice: security
ms.date: 09/05/2019
ms.reviewer: jushiman
ms.custom: mimckitt

---
# Security controls for Azure Virtual Machine Scale Sets

This article documents the security controls built into Azure Virtual Machine Scale Sets.

[!INCLUDE [Security controls header](../../includes/security-controls-header.md)]

## Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes | |
| VNet injection support| Yes | |
| Network Isolation and Firewalling support| Yes |  |
| Forced tunneling support| Yes | See [Configure forced tunneling using the Azure Resource Manager deployment model](/azure/vpn-gateway/vpn-gateway-forced-tunneling-rm). |

## Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | See [Monitor and update a Linux virtual machine in Azure](/azure/virtual-machines/linux/tutorial-monitoring) and [Monitor and update a Windows virtual machine in Azure](/azure/virtual-machines/windows/tutorial-monitoring). |
| Control and management plane logging and audit| Yes |  |
| Data plane logging and audit | No |  |

## Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes |  |
| Authorization| Yes |  |

## Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft-managed keys | Yes | See [Azure Disk Encryption for Virtual Machine Scale Sets](disk-encryption-overview.md). |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| Yes | Azure Virtual Machines supports [ExpressRoute](/azure/expressroute) and VNet encryption. See [In-transit encryption in VMs](/azure/security/security-azure-encryption-overview#in-transit-encryption-in-vms). |
| Server-side encryption at rest: customer-managed keys (BYOK) | Yes | Customer-managed keys is a supported Azure encryption scenario; see  See [Azure Disk Encryption for Virtual Machine Scale Sets](disk-encryption-overview.md)|
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Via HTTPS and TLS. |

## Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes |  | 

## Next steps

- Learn more about the [built-in security controls across Azure services](../security/fundamentals/security-controls.md).
