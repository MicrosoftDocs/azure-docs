---
title: Support matrix for VM restore points
description: Support matrix for VM restore points
author: dikethir
ms.author: dikethir
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 07/05/2022
ms.custom: template-concept
---

# Support matrix for VM restore points

This article summarizes support settings and limitations for using [VM restore points](virtual-machines-create-restore-points.md).


## Limitations

- Restore points are supported only for managed disks. 
- Ultra-disks, Ephemeral OS disks, and Shared disks are not supported. 
- Restore points APIs require an API of version 2021-03-01 or higher. 
- A maximum of 500 VM restore points can be retained at any time for a VM, irrespective of the number of restore point collections. 
- Concurrent creation of restore points for a VM is not supported. 
- Movement of Virtual Machines (VM) between Resource Groups (RG), or Subscriptions is not supported when the VM has restore points. Moving the VM between Resource Groups or Subscriptions will not update the source VM reference in the restore point and will cause a mismatch of ARM processor IDs between the actual VM and the restore points. 
 > [!Note]
 > Public preview of cross-region creation and copying of VM restore points are available, with the following limitations: 
 > - Private links are not supported when copying restore points across regions or creating restore points in a region other than the source VM. 
 > - Customer-managed key encrypted restore points, when copied to a target region or created directly in the target region are created as platform-managed key encrypted restore points.

## VM restore points support matrix

The following table summarizes the support for local region VM restore points.

**Feature/Operation/Configuration/Scenario** | **Support for Local region VM restore points**
--- | ---
**VMs using Managed disks** | Yes
**VMs using unmanaged disks** | No
**VMs using Ultra Disks** | No
**VMs using Ephemeral OS Disks** | No
**VMs using Azure Disk Encryption - Platform managed keys** | Yes
**VMs using Azure Disk Encryption - Customer managed keys** | Yes
**VMs using shared disks** | No
**VMs with extensions** | Yes
**VMs with trusted enabled** | Yes
**Confidential VMs** | Yes
**Generation 2 VMs (UEFI boot)** | Yes
**VMs with NVMe disks (Storage optimized - Lsv2-series)** | Yes
**VMs in Proximity placement groups** | Yes
**XIO Collocated VMs** | Yes
**VMs in an availability set** | Yes
**Reserved VM instances (Azure reservations) - Not a feature but a billing model** | Yes
**VMSS unified** | No
**VMSS Flex** | Yes
**Spot VMs (Low priority VMs)** | Yes
**VMs with dedicated hosts** | Yes
**VMs with Host caching enabled** | Yes
**VMs with pinned nodes** | Yes
**VMs created from marketplace images** | Yes
**VMs created from custom images** | Yes
**VMs using classic deployment model** | No
**VMs using ARM (Azure Resource Manager)** | Yes
**VM with HUB (Hybrid Use Benefit) license - Not a feature but a licensing model** | Yes
**VMs migrated from on-prem using Azure Migrate** | Yes
**VMs with RBAC policies** | Yes
**Temporary disk in VMs** | No
**VMs with different disk type (standard and premium)** | Yes
**Redundancies - LRS** | Yes
**Redundancies - GRS** | Yes
**Redundancies - GZRS** | Yes
**Redundancies - ZRS** | Yes
**VMs with cool, hot and archive storage** | Yes
**VMs with Encryption at rest (SSE - Azure Storage Service Encryption) storage accounts** | Yes
**VMs with Encryption at rest (CMK) storage accounts** | Yes
**VMs with double encryption at rest** | Yes
**VMs with Host based encryption enabled with PMK/CMK/Double encryption** | Yes
**VMs with ADE (Azure Disk Encryption)** | Yes
**VMs with keys in Key Vault** | Yes
**VMs using Accelerated Networking** | Yes
**Pre-Provisioning Service (PPS) VMs** | Yes
**VMs using Azure Backup** | Yes
**VMs using ASR** | Yes
**VMs using Monitor** | Yes
**VMs that are live migrated** | Yes
**VMs that are service healed** | Yes
**VMs that are part of AKS with managed disks** | Yes
**VMs that are part of AKS without managed disks** | No
**VMs that are part of Azure Batch** | Yes
**VMs that are part of Service Fabric Mesh** | Yes
**VMs that are part of App Service** | Yes

## Next steps

- Learn how to create VM restore points using [CLI](virtual-machines-create-restore-points-cli.md), [Azure portal](virtual-machines-create-restore-points-portal.md), and [PowerShell](virtual-machines-create-restore-points-powershell.md).