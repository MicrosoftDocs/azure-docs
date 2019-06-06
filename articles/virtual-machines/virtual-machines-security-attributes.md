---
title: Common security attributes for Azure ExpressRoute
description: A checklist of common security attributes for evaluating Azure ExpressRoute
services: expressroute
ms.service: expressroute
documentationcenter: ''
author: msmbaldwin
manager: barbkess

ms.topic: conceptual
ms.date: 06/05/2019
ms.author: mbaldwin

---
# Common security attributes for Azure Virtual Machines

This article documents the common security attributes built into Azure Virtual Machines.

[!INCLUDE [Security attributes header](../../includes/security-attributes-header.md)]

## Preventative

| Security attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features) | Yes | See [How to encrypt a Linux virtual machine in Azure](linux/encrypt-disks.md) and [Encrypt virtual disks on a Windows VM](windows/encrypt-disks.md). |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| Yes | Azure Virtual Machines supports [ExpressRoute](/azure/expressroute) and VNET encryption. See [In-transit encryption in VMs](../security/security-azure-encryption-overview.md#in-transit-encryption-in-vms.md). |
| Encryption key handling (CMK, BYOK, etc.)| Yes | Customer-mamanged keys is a supporter Azure encryption scenation; see [Azure encryption overview](../security/security-azure-encryption-overview#in-transit-encryption-in-vms.md).|
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Via HTTPS and SSL. |

## Network segmentation

| Security attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes | |
| VNet injection support| Yes | . |
| Network Isolation and Firewalling support| Yes |  |
| Forced tunneling support| Yes | See [Configure forced tunneling using the Azure Resource Manager deployment model](../vpn-gateway/vpn-gateway-forced-tunneling-rm.md). |

## Detection

| Security attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | See [Monitor and update a Linux virtual machine in Azure](linux/tutorial-monitoring.md) and [Monitor and update a Windows virtual machine in Azure](windows/tutorial-monitoring.md). |

## Identity and access management

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

