---
title: Security controls for Azure Windows Virtual Machines
description: A checklist of security controls for evaluating Azure Windows Virtual Machines
ms.service: virtual-machines
ms.subservice: security
author: msmbaldwin
manager: barbkess
ms.topic: conceptual
ms.date: 09/05/2019
ms.author: mbaldwin

---
# Security controls for Windows Virtual Machines

This article documents the security controls built into Windows Virtual Machines.

[!INCLUDE [Security controls header](../../../includes/security-controls-header.md)]

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
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | [Monitor and update a Windows virtual machine in Azure](tutorial-monitoring.md). |
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
| Server-side encryption at rest: Microsoft-managed keys | Yes | See [Encrypt virtual disks on a Windows VM](/azure/virtual-machines/windows/disk-encryption-overview). |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption )| Yes | Azure Virtual Machines supports [ExpressRoute](/azure/expressroute) and VNet encryption. See [In-transit encryption in VMs](/azure/security/security-azure-encryption-overview#in-transit-encryption-in-vms). |
| Server-side encryption at rest: customer-managed keys (BYOK) | Yes | Customer-managed keys is a supported Azure encryption scenario; see [Azure encryption overview](/azure/security/security-azure-encryption-overview#in-transit-encryption-in-vms).|
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | Via HTTPS and TLS. |



## Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes |  | 

## Next steps

- Learn more about the [built-in security controls across Azure services](../../security/fundamentals/security-controls.md).
