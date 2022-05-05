---
title: Ephemeral OS disks 
description: Learn more about ephemeral OS disks for Azure VMs.
author: Aarthi-Vijayaraghavan
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 07/23/2020
ms.author: aarthiv
ms.subservice: disks 
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Ephemeral OS disks for Azure VMs

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Ephemeral OS disks are created on the local virtual machine (VM) storage and not saved to the remote Azure Storage. Ephemeral OS disks work well for stateless workloads, where applications are tolerant of individual VM failures but are more affected by VM deployment time or reimaging of individual VM instances. With Ephemeral OS disk, you get lower read/write latency to the OS disk and faster VM reimage. 
 
The key features of ephemeral disks are: 
- Ideal for stateless applications.
- Supported by  Marketplace, custom images, and by [Azure Compute Gallery](./shared-image-galleries.md) (formerly known as Shared Image Gallery).
- Ability to fast reset or reimage VMs and scale set instances to the original boot state.  
- Lower latency, similar to a temporary disk. 
- Ephemeral OS disks are free, you incur no storage cost for OS disks.
- Available in all Azure regions.  

 
Key differences between persistent and ephemeral OS disks:

|   | Persistent OS Disk | Ephemeral OS Disk |
|---|---|---|
| **Size limit for OS disk** | 2 TiB | Cache size or temp size for the VM size or 2040 GiB, whichever is smaller. For the **cache or temp size in GiB**, see [DS](sizes-general.md), [ES](sizes-memory.md), [M](sizes-memory.md), [FS](sizes-compute.md), and [GS](sizes-previous-gen.md#gs-series) |
| **VM sizes supported** | All | VM sizes that support Premium storage such as DSv1, DSv2, DSv3, Esv3, Fs, FsV2, GS, M, Mdsv2, Bs, Dav4, Eav4 |
| **Disk type support**| Managed and unmanaged OS disk| Managed OS disk only|
| **Region support**| All regions| All regions|
| **Data persistence**| OS disk data written to OS disk are stored in Azure Storage| Data written to OS disk is stored on local VM storage and isn't persisted to Azure Storage. |
| **Stop-deallocated state**| VMs and scale set instances can be stop-deallocated and restarted from the stop-deallocated state | Not Supported |
| **Specialized OS disk support** | Yes| No|
| **OS disk resize**| Supported during VM creation and after VM is stop-deallocated| Supported during VM creation only|
| **Resizing to a new VM size**| OS disk data is preserved| Data on the OS disk is deleted, OS is reprovisioned |
| **Redeploy** | OS disk data is preserved | Data on the OS disk is deleted, OS is reprovisioned | 
| **Stop/ Start of VM** | OS disk data is preserved | Not Supported | 
| **Page file placement**| For Windows, page file is stored on the resource disk| For Windows, page file is stored on the OS disk (for both OS cache placement and Temp disk placement).|


## Size requirements

You can choose to deploy Ephemeral OS Disk on VM cache or VM temp disk.
The image OS disk’s size should be less than or equal to the temp/cache size of the VM size chosen.

For example, if you want to opt for **OS cache placement**: Standard Windows Server images from the marketplace are about 127 GiB, which means that you need a VM size that has a cache equal to or larger than 127 GiB. The Standard_DS3_v2 has a cache size of 127 GiB, which is large enough. In this case, the Standard_DS3_v2 is the smallest size in the DSv2 series that you can use with this image. 

If you want to opt for **Temp disk placement**: Standard Ubuntu server image from marketplace is about 30 GiB. To enable Ephemeral OS disk on temp, the temp disk size must be equal to or larger than 30 GiB. Standard_B4ms has a temp size of 32 GiB, which can fit the 30 GiB OS disk. Upon creation of the VM, the temp disk space would be 2 GiB. 
> [!Important] 
> If opting for temp disk placement the Final Temp disk size = (Initial temp disk size - OS image size).

Basic Linux and Windows Server images in the Marketplace that are denoted by `[smallsize]` tend to be around 30 GiB and can use most of the available VM sizes.
Ephemeral disks also require that the VM size supports **Premium storage**. The sizes usually (but not always) have an `s` in the name, like DSv2 and EsV3. For more information, see [Azure VM sizes](sizes.md) for details around which sizes support Premium storage.

## Placement options for Ephemeral OS disks
Ephemeral OS disk can be stored either on VM's OS cache disk or VM's temp/resource disk. 
[DiffDiskPlacement](/rest/api/compute/virtualmachines/list#diffdiskplacement) is the new property that can be used to specify where you want to place the Ephemeral OS disk. 
With this feature, when a Windows VM is provisioned, we configure the pagefile to be located on the OS Disk.

## Unsupported features 
- Capturing VM images
- Disk snapshots 
- Azure Disk Encryption 
- Azure Backup
- Azure Site Recovery  
- OS Disk Swap 

 ## Trusted Launch for Ephemeral OS disks (Preview)
Ephemeral OS disks can be created with Trusted launch. Not all VM sizes and regions are supported for trusted launch. Please check [limitations of trusted launch](trusted-launch.md#limitations) for supported sizes and regions.
VM guest state (VMGS) is specific to trusted launch VMs. It is a blob that is managed by Azure and contains the unified extensible firmware interface (UEFI) secure boot signature databases and other security information. While using trusted launch by default **1 GiB** from the **OS cache** or **temp storage** based on the chosen placement option is reserved for VMGS.The lifecycle of the VMGS blob is tied to that of the OS Disk.

For example, If you try to create a Trusted launch Ephemeral OS disk VM using OS image of size 56 GiB with VM size [Standard_DS4_v2](dv2-dsv2-series.md) using temp disk placement you would get an error as 
**"OS disk of Ephemeral VM with size greater than 55 GB is not allowed for VM size Standard_DS4_v2 when the DiffDiskPlacement is ResourceDisk."**
This is because the temp storage for [Standard_DS4_v2](dv2-dsv2-series.md) is 56 GiB, and 1 GiB is reserved for VMGS when using trusted launch.
For the same example above if you create a standard Ephemeral OS disk VM you would not get any errors and it would be a successful operation.

> [!NOTE]
> 
> While using ephemeral disks for Trusted Launch VMs, keys and secrets generated or sealed by the vTPM after VM creation may not be persisted for operations like reimaging and platform events like service healing.
> 
For more information on [how to deploy a trusted launch VM](trusted-launch-portal.md)

## Frequently asked questions

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

> [!NOTE]
> 
> Ephemeral disk will not be accessible through the portal. You will receive a "Resource not Found" or "404" error when accessing the ephemeral disk which is expected.
> 
 
## Next steps
Create a VM with ephemeral OS disk using [Azure Portal/CLI/Powershell/ARM template](ephemeral-os-disks-deploy.md).
