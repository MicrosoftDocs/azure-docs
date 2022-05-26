---
title: FAQ Ephemeral OS disks 
description: Frequently asked questions on ephemeral OS disks for Azure VMs.
author: Aarthi-Vijayaraghavan
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 05/26/2022
ms.author: aarthiv
ms.subservice: disks 
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Frequently asked questions

**Q: What is the size of the local OS Disks?**

A: We support platform, Shared Image Gallery, and custom images, up to the VM cache size with OS cache placement and up to Temp disk size with Temp disk placement, where all read/writes to the OS disk will be local on the same node as the Virtual Machine. 

**Q: Can the ephemeral OS disk be resized?**

A: No, once the ephemeral OS disk is provisioned, the OS disk cannot be resized. 

**Q: Can the ephemeral OS disk placement be modified after creation of VM?**

A: No, once the ephemeral OS disk is provisioned, the OS disk placement cannot be changed. But the VM can be recreated via ARM template deployment/PowerShell/CLI by updating the OS disk placement of choosing. This would result in the recreation of the VM with Data on the OS disk deleted and OS is reprovisioned.

**Q: Is there any Temp disk created if image size equals to Temp disk size of VM size selected?**

A: No, in that case, there won't be any Temp disk drive created.

**Q: Are Ephemeral OS disks supported on low-priority VMs and Spot VMs?**

A: Yes. There is no option of Stop-Deallocate for Ephemeral VMs, rather users need to Delete instead of deallocating them.

**Q: Can I attach a Managed Disks to an Ephemeral VM?**

A: Yes, you can attach a managed data disk to a VM that uses an ephemeral OS disk. 

**Q: Will all VM sizes be supported for ephemeral OS disks?**

A: No, most Premium Storage VM sizes are supported (DS, ES, FS, GS, M, etc.). To know whether a particular VM size supports ephemeral OS disks, you can:

Call `Get-AzComputeResourceSku` PowerShell cmdlet
```azurepowershell-interactive
 
$vmSizes=Get-AzComputeResourceSku | where{$_.ResourceType -eq 'virtualMachines' -and $_.Locations.Contains('CentralUSEUAP')} 

foreach($vmSize in $vmSizes)
{
   foreach($capability in $vmSize.capabilities)
   {
       if($capability.Name -eq 'EphemeralOSDiskSupported' -and $capability.Value -eq 'true')
       {
           $vmSize
       }
   }
}
```
 
**Q: Can the ephemeral OS disk be applied to existing VMs and scale sets?**

A: No, ephemeral OS disk can only be used during VM and scale set creation. 

**Q: Can you mix ephemeral and normal OS disks in a scale set?**

A: No, you can't have a mix of ephemeral and persistent OS disk instances within the same scale set. 

**Q: Can the ephemeral OS disk be created using PowerShell or CLI?**

A: Yes, you can create VMs with Ephemeral OS Disk using REST, Templates, PowerShell, and CLI.