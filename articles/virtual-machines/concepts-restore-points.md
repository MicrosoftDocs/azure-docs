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

This article summarizes the support matrix and limitations of using [VM restore points](virtual-machines-create-restore-points.md).


## VM restore points support matrix

The following table summarizes the support matrix for VM restore points.

**Scenarios** | **Supported by VM restore points**
--- | ---
**VMs using Managed disks** | Yes
**VMs using unmanaged disks** | No. Exclude these disks and create a VM restore point.
**VMs using Ultra Disks** | No. Exclude these disks and create a VM restore point.
**VMs using Ephemeral OS Disks** | No. Exclude these disks and create a VM restore point.
**VMs using shared disks** | No. Exclude these disks and create a VM restore point.
**VMs with extensions** | Yes
**VMs with trusted enabled** | Yes
**Confidential VMs** | Yes
**Generation 2 VMs (UEFI boot)** | Yes
**VMs with NVMe disks (Storage optimized - Lsv2-series)** | Yes
**VMs in Proximity placement groups** | Yes
**VMs in an availability set** | Yes. You can create VM restore points for individual VMs within an AvSet. You need to create restore points for all the VMs within an AvSet to protect an entire AvSet instance.
**Reserved VM instances (Azure reservations)** | Yes
**VMs inside VMSS unified** | No
**VMs inside VMSS Flex** | Yes. You can create VM restore points for individual VMs within the VMSS flex. However, you need to create restore points for all the VMs within the VMSS flex to protect an entire VMSS flex instance.
**Spot VMs (Low priority VMs)** | Yes
**VMs with dedicated hosts** | Yes
**VMs with Host caching enabled** | Yes
**VMs with pinned nodes** | Yes
**VMs created from marketplace images** | Yes
**VMs created from custom images** | Yes
**VM with HUB (Hybrid Use Benefit) license** | Yes
**VMs migrated from on-prem using Azure Migrate** | Yes
**VMs with RBAC policies** | Yes
**Temporary disk in VMs** | Yes. You can create VM restore point for VMs with temporary disks. However, the restore points created do not contain the data from the temporary disks.
**VMs with standard HDDs** | Yes
**VMs with standard SSDs** | Yes
**VMs with premium SSDs** | Yes
**VMs with ZRS disks** | Yes
**VMs with server-side encryption using service-managed keys** | Yes
**VMs with server-side encryption using customer-managed keys** | Yes
**VMs with double encryption at rest** | Yes
**VMs with Host based encryption enabled with PMK/CMK/Double encryption** | Yes
**VMs with ADE (Azure Disk Encryption)** | Yes
**VMs using Accelerated Networking** | Yes
**VMs that are live migrated** | Yes
**VMs that are service healed** | Yes

## Limitations

- Restore points are supported only for managed disks. 
- Ultra-disks, Ephemeral OS disks, and Shared disks are not supported. 
- Restore points APIs require an API of version 2021-03-01 or later. 
- A maximum of 500 VM restore points can be retained at any time for a VM, irrespective of the number of restore point collections. 
- Concurrent creation of restore points for a VM is not supported. 
- Movement of Virtual Machines (VM) between Resource Groups (RG), or Subscriptions is not supported when the VM has restore points. Moving the VM between Resource Groups or Subscriptions will not update the source VM reference in the restore point and will cause a mismatch of ARM processor IDs between the actual VM and the restore points. 
 > [!Note]
 > Public preview of cross-region creation and copying of VM restore points is available, with the following limitations: 
 > - Private links are not supported when copying restore points across regions or creating restore points in a region other than the source VM. 
 > - Customer-managed key encrypted restore points, when copied to a target region or created directly in the target region are created as platform-managed key encrypted restore points.

## Next steps

- Learn how to create VM restore points using [CLI](virtual-machines-create-restore-points-cli.md), [Azure portal](virtual-machines-create-restore-points-portal.md), and [PowerShell](virtual-machines-create-restore-points-powershell.md).