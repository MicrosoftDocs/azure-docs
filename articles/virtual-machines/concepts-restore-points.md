---
title: Support matrix for VM restore points
description: Support matrix for VM restore points
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
**VMs using unmanaged disks** | No
**VMs using Ultra Disks** | Yes. Supported for application consistency. Not supported for crash consistency. Exclude these disks and create a VM restore point when using crash consistency.
**VMs using Premium SSD v2 Disks** | Yes. Supported for application consistency. Not supported for crash consistency. Exclude these disks and create a VM restore point when using crash consistency.
**VMs using Ephemeral OS Disks** | No. Exclude these disks and create a VM restore point.
**VMs using shared disks** | No. Exclude these disks and create a VM restore point.
**VMs with extensions** | Yes
**VMs with trusted launch** | Yes
**Confidential VMs** | No
**Generation 2 VMs (UEFI boot)** | Yes
**VMs with NVMe disks (Storage optimized - Lsv2-series)** | Yes
**VMs in Proximity placement groups** | Yes
**VMs in an availability set** | Yes. You can create VM restore points for individual VMs within an availability set. You need to create restore points for all the VMs within an availability set to protect an entire availability set instance.
**VMs inside VMSS with uniform orchestration** | No
**VMs inside VMSS with flexible orchestration** | Yes. You can create VM restore points for individual VMs within the virtual machine scale set flex. However, you need to create restore points for all the VMs within the virtual machine scale set flex to protect an entire virtual machine scale set flex instance.
**Spot VMs (Low priority VMs)** | Yes
**VMs with dedicated hosts** | Yes
**VMs with Host caching enabled** | Yes
**VMs created from marketplace images** | Yes
**VMs created from custom images** | Yes
**VM with HUB (Hybrid Use Benefit) license** | Yes
**VMs migrated from on-prem using Azure Migrate** | Yes
**VMs with RBAC policies** | Yes
**Temporary disk in VMs** | Yes. You can create VM restore point for VMs with temporary disks. However, the restore points created don't contain the data from the temporary disks.
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
**Minimum Frequency at which App consistent restore point can be taken** | 3 hours
**Minimum Frequency at which [crash consistent restore points (preview)](https://github.com/Azure/Virtual-Machine-Restore-Points/tree/main/Crash%20consistent%20VM%20restore%20points%20(preview)) can be taken** | 1 hour
**API version for Application consistent restore point** | 2021-03-01 or later
**API version for Crash consistent restore point (in preview)** | 2021-07-01 or later

> [!Note]
> Restore Points (App consistent or crash consistent) can be created by customer at the minimum supported frequency as mentioned above. Taking restore points at a frequency lower than supported would result in failure.

## Operating system support for application consistency 

### Windows

The following Windows operating systems are supported when creating restore points for Azure VMs running on Windows.

- Windows 10 Client (64 bit only)
- Windows Server 2022 (Datacenter/Datacenter Core/Standard)
- Windows Server 2019 (Datacenter/Datacenter Core/Standard)
- Windows Server 2016 (Datacenter/Datacenter Core/Standard)
- Windows Server 2012 R2 (Datacenter/Standard)
- Windows Server 2012 (Datacenter/Standard)
- Windows Server 2008 R2 (RTM and SP1 Standard)
- Windows Server 2008 (64 bit only)

Restore points don't support 32-bit operating systems.

### Linux

For Azure VM Linux VMs, restore points support the list of Linux [distributions endorsed by Azure](../virtual-machines/linux/endorsed-distros.md). Note the following:

- Restore points don't support Core OS Linux.
- Restore points don't support 32-bit operating systems.
- Other bring-your-own Linux distributions might work as long as the [Azure VM agent for Linux](../virtual-machines/extensions/agent-linux.md) is available on the VM, and as long as Python is supported.
- Restore points don't support a proxy-configured Linux VM if it doesn't have Python version 2.7 or higher installed.
- Restore points don't back up NFS files that are mounted from storage, or from any other NFS server, to Linux or Windows machines. It only backs up disks that are locally attached to the VM.
 
## Operating system support for crash consistency

- All Operating systems are supported.

## Other limitations

- Restore points are supported only for managed disks. 
- Ultra-disks, Ephemeral OS disks, and Shared disks aren't supported. 
- Restore points APIs require an API of version 2021-03-01 or later for application consistency. 
- Restore points APIs require an API of version 2021-03-01 or later for crash consistency. (in preview)
- A maximum of 500 VM restore points can be retained at any time for a VM, irrespective of the number of restore point collections. 
- Concurrent creation of restore points for a VM isn't supported. 
- Movement of Virtual Machines (VM) between Resource Groups (RG), or Subscriptions isn't supported when the VM has restore points. Moving the VM between Resource Groups or Subscriptions won't update the source VM reference in the restore point and will cause a mismatch of ARM processor IDs between the actual VM and the restore points. 
 > [!Note]
 > Public preview of cross-region creation and copying of VM restore points is available, with the following limitations: 
 > - Private links aren't supported when copying restore points across regions or creating restore points in a region other than the source VM. 
 > - Customer-managed key encrypted restore points, when copied to a target region or created directly in the target region are created as platform-managed key encrypted restore points.
 > - No portal support for cross region copy and cross region creation of restore points

## Next steps

- Learn how to create VM restore points using [CLI](virtual-machines-create-restore-points-cli.md), [Azure portal](virtual-machines-create-restore-points-portal.md), and [PowerShell](virtual-machines-create-restore-points-powershell.md).
