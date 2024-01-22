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
---

# Frequently asked questions about Ephemeral OS disks

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

A: No, most Premium Storage VM sizes are supported (DS, ES, FS, GS, M, etc.). To know whether a particular VM size supports ephemeral OS disks for an OS image size you can use the below script. It takes the OS image size and location as inputs and provides a list of VM SKUs and corresponding placement supported. If both OS Cache and temp disk placement are marked as not supported then Ephemeral OS disk cannot be used for the given OS image size.

```azurepowershell-interactive
[CmdletBinding()]
param([Parameter(Mandatory=$true)]
      [ValidateNotNullOrEmpty()]
      [string]$Location,
      [Parameter(Mandatory=$true)]
      [long]$OSImageSizeInGB
      )
 
Function HasSupportEphemeralOSDisk([object[]] $capability)
{
    return $capability | where { $_.Name -eq "EphemeralOSDiskSupported" -and $_.Value -eq "True"}
}
 
Function Get-MaxTempDiskAndCacheSize([object[]] $capabilities)
{
    $MaxResourceVolumeGB = 0;
    $CachedDiskGB = 0;
 
    foreach($capability in $capabilities)
    {
        if ($capability.Name -eq "MaxResourceVolumeMB")
        { $MaxResourceVolumeGB = [int]($capability.Value / 1024) }
 
        if ($capability.Name -eq "CachedDiskBytes")
        { $CachedDiskGB = [int]($capability.Value / (1024 * 1024 * 1024)) }
    }
 
    return ($MaxResourceVolumeGB, $CachedDiskGB)
}
 
Function Get-EphemeralSupportedVMSku
{
    [CmdletBinding()]
    Param
    (
        [Parameter(Mandatory=$true)]
        [long]$OSImageSizeInGB,
        [Parameter(Mandatory=$true)]
        [string]$Location
    )
 
    $VmSkus = Get-AzComputeResourceSku $Location | Where-Object { $_.ResourceType -eq "virtualMachines" -and (HasSupportEphemeralOSDisk $_.Capabilities) -ne $null }
 
    $Response = @()
    foreach ($sku in $VmSkus)
    {
        ($MaxResourceVolumeGB, $CachedDiskGB) = Get-MaxTempDiskAndCacheSize $sku.Capabilities
 
        $Response += New-Object PSObject -Property @{
            ResourceSKU = $sku.Size
            TempDiskPlacement = @{ $true = "NOT SUPPORTED"; $false = "SUPPORTED"}[$MaxResourceVolumeGB -lt $OSImageSizeInGB]
            CacheDiskPlacement = @{ $true = "NOT SUPPORTED"; $false = "SUPPORTED"}[$CachedDiskGB -lt $OSImageSizeInGB]
        };
    }
 
    return $Response
}
 
Get-EphemeralSupportedVMSku -OSImageSizeInGB $OSImageSizeInGB -Location $Location | Format-Table
```
 
**Q: Can the ephemeral OS disk be applied to existing VMs and scale sets?**

A: No, ephemeral OS disk can only be used during VM and scale set creation. 

**Q: Can you mix ephemeral and normal OS disks in a scale set?**

A: No, you can't have a mix of ephemeral and persistent OS disk instances within the same scale set. 

**Q: Can the ephemeral OS disk be created using PowerShell or CLI?**

A: Yes, you can create VMs with Ephemeral OS Disk using REST, Templates, PowerShell, and CLI.
