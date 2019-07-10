---
author: msmbaldwin
ms.service: virtual-machines  
ms.topic: include
ms.date: 07/10/2019
ms.author: mbaldwin
---

## Preventative

| Security attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features) | Yes | See [How to encrypt a Linux virtual machine in Azure](/azure/virtual-machines/linux/encrypt-disks.md) and [Encrypt virtual disks on a Windows VM](/azure/virtual-machines/windows/encrypt-disks.md). |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| Yes | Azure Virtual Machines supports [ExpressRoute](/azure/expressroute) and VNET encryption. See [In-transit encryption in VMs](/azure/security/security-azure-encryption-overview.md#in-transit-encryption-in-vms). |
| Encryption key handling (CMK, BYOK, etc.)| Yes | Customer-managed keys is a supported Azure encryption scenario; see [Azure encryption overview](/azure/security/security-azure-encryption-overview#in-transit-encryption-in-vms.md).|
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Via HTTPS and SSL. |

## Network segmentation

| Security attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| Yes | |
| VNet injection support| Yes | . |
| Network Isolation and Firewalling support| Yes |  |
| Forced tunneling support| Yes | See [Configure forced tunneling using the Azure Resource Manager deployment model](/azure/vpn-gateway/vpn-gateway-forced-tunneling-rm.md). |

## Detection

| Security attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | See [Monitor and update a Linux virtual machine in Azure](/azure/virtual-machines/linux/tutorial-monitoring.md) and [Monitor and update a Windows virtual machine in Azure](/azure/virtual-machines/windows/tutorial-monitoring.md). |

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
