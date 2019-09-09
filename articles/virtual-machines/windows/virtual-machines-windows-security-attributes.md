---
title: Security attributes for Azure Windows Virtual Machines
description: A checklist of security attributes for evaluating Azure Windows Virtual Machines
services: virtual-machines
ms.service: virtual-machines
documentationcenter: ''
author: msmbaldwin
manager: barbkess

ms.topic: conceptual
ms.date: 06/05/2019
ms.author: mbaldwin

---
# Security attributes for Windows Virtual Machines

This article documents the security attributes built into Windows Virtual Machines.

[!INCLUDE [Security attributes header](../../../includes/security-attributes-header.md)]

## Data protection

| Security attribute | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys | Yes | See [How to encrypt a Linux virtual machine in Azure](/azure/virtual-machines/linux/encrypt-disks) and [Encrypt virtual disks on a Windows VM](/azure/virtual-machines/windows/encrypt-disks). |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| Yes | Azure Virtual Machines supports [ExpressRoute](/azure/expressroute) and VNet encryption. See [In-transit encryption in VMs](/azure/security/security-azure-encryption-overview#in-transit-encryption-in-vms). |
| Server-side encryption at rest: customer managed keys (BYOK) | Yes | Customer-managed keys is a supported Azure encryption scenario; see [Azure encryption overview](/azure/security/security-azure-encryption-overview#in-transit-encryption-in-vms).|
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Via HTTPS and SSL. |

## Network

| Security attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes | |
| VNet injection support| Yes | . |
| Network Isolation and Firewalling support| Yes |  |
| Forced tunneling support| Yes | See [Configure forced tunneling using the Azure Resource Manager deployment model](/azure/vpn-gateway/vpn-gateway-forced-tunneling-rm). |

## Monitoring & logging

| Security attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | See [Monitor and update a Linux virtual machine in Azure](/azure/virtual-machines/linux/tutorial-monitoring) and [Monitor and update a Windows virtual machine in Azure](/azure/virtual-machines/windows/tutorial-monitoring). |

## Identity

| Security attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes |  |
| Authorization| Yes |  |


## Audit trail

| Security attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes |  |
| Data plane logging and audit | No |  |

## Configuration management

| Security attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes |  | 

