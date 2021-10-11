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
ms.custom: devx-track-azurepowershell
---

# Ephemeral OS disks for Azure VMs

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Ephemeral OS disks are created on the local virtual machine (VM) storage and not saved to the remote Azure Storage. Ephemeral OS disks work well for stateless workloads, where applications are tolerant of individual VM failures but are more affected by VM deployment time or reimaging of individual VM instances. With Ephemeral OS disk, you get lower read/write latency to the OS disk and faster VM reimage. 
 
The key features of ephemeral disks are: 
- Ideal for stateless applications.
- They can be used with both Marketplace and custom images.
- Ability to fast reset or reimage VMs and scale set instances to the original boot state.  
- Lower latency, similar to a temporary disk. 
- Ephemeral OS disks are free, you incur no storage cost for OS disk.
- Available in all Azure regions. 
- Ephemeral OS Disk is supported by [Shared Image Gallery](./shared-image-galleries.md). 
 

 
Key differences between persistent and ephemeral OS disks:

|                             | Persistent OS Disk                          | Ephemeral OS Disk                              |
|-----------------------------|---------------------------------------------|------------------------------------------------|
| **Size limit for OS disk**      | 2 TiB                                                                                        | Cache size for the VM size or 2 TiB, whichever is smaller. For the **cache size in GiB**, see [DS](sizes-general.md), [ES](sizes-memory.md), [M](sizes-memory.md), [FS](sizes-compute.md), and [GS](sizes-previous-gen.md#gs-series)              |
| **VM sizes supported**          | All                                                                                          | VM sizes that support Premium storage such as DSv1, DSv2, DSv3, Esv3, Fs, FsV2, GS, M                                               |
| **Disk type support**           | Managed and unmanaged OS disk                                                                | Managed OS disk only                                                               |
| **Region support**              | All regions                                                                                  | All regions                              |
| **Data persistence**            | OS disk data written to OS disk are stored in Azure Storage                                  | Data written to OS disk is stored on local VM storage and isn't persisted to Azure Storage. |
| **Stop-deallocated state**      | VMs and scale set instances can be stop-deallocated and restarted from the stop-deallocated state | VMs and scale set instances cannot be stop-deallocated                                  |
| **Specialized OS disk support** | Yes                                                                                          | No                                                                                 |
| **OS disk resize**              | Supported during VM creation and after VM is stop-deallocated                                | Supported during VM creation only                                                  |
| **Resizing to a new VM size**   | OS disk data is preserved                                                                    | Data on the OS disk is deleted, OS is reprovisioned       
| **Page file placement**   | For Windows, page file is stored on the resource disk                                              | For Windows, page file is stored on the OS disk (for both OS cache placement and Temp disk placement).   |


## Size requirements

You can choose to deploy Ephemeral OS Disk on VM cache or VM temp disk.
The image OS disk’s size should be equal to or greater than the temp/cache size of the disk chosen.

For example, if you want to opt for **OS cache placement**: Standard Windows Server images from the marketplace are about 127 GiB, which means that you need a VM size that has a cache equal to or larger than 127 GiB. The Standard_DS3_v2 has a cache size of 127 GiB, which is large enough. In this case, the Standard_DS3_v2 is the smallest size in the DSv2 series that you can use with this image. 

If you want to opt for **Temp disk placement**: Standard Ubuntu server image from marketplace comes with 30-GiB OS disk space. To enable Ephemeral OS disk, the disk size must be equal to or larger than 30 GiB. Standard_B4ms has a temp size of 32 GiB, which can fit the 30 GiB OS disk. But Standard_B2ms has a temp size of 16 GiB, which wouldn't be able to fit 30 GiB of OS disk.

Basic Linux and Windows Server images in the Marketplace that are denoted by `[smallsize]` tend to be around 30 GiB and can use most of the available VM sizes.
Ephemeral disks also require that the VM size supports **Premium storage**. The sizes usually (but not always) have an `s` in the name, like DSv2 and EsV3. For more information, see [Azure VM sizes](sizes.md) for details around which sizes support Premium storage.


## Ephemeral OS Disks can now be stored on temp/Resource disks
Ephemeral OS disk can now be stored either in VM cache disk or VM temp/resource disk. 
This feature enables Ephemeral OS disks to be created for all the VMs, which don't have a cache or insufficient cache (such as Dav3, Dav4, Eav4, and Eav3) but has temp disk to store the Ephemeral OS disk.
[DiffDiskPlacement](/rest/api/compute/virtualmachines/list#diffdiskplacement) is the new property that can be used to specify where you want to place the Ephemeral OS disk. 
With this feature, when a Windows VM is provisioned, we configure the pagefile to be located on the OS Disk.

## PowerShell
To use an ephemeral disk for a PowerShell VM deployment, use [Set-AzVMOSDisk](/powershell/module/az.compute/set-azvmosdisk) in your VM configuration. Set the `-DiffDiskSetting` to `Local` and `-Caching` to `ReadOnly`.     
```powershell
Set-AzVMOSDisk -DiffDiskSetting Local -Caching ReadOnly
```
For scale set deployments, use the [Set-AzVmssStorageProfile](/powershell/module/az.compute/set-azvmssstorageprofile) cmdlet in your configuration. Set the `-DiffDiskSetting` to `Local` and `-Caching` to `ReadOnly`.

```powershell
Set-AzVmssStorageProfile -DiffDiskSetting Local -OsDiskCaching ReadOnly
```

## CLI

To use an ephemeral disk for a CLI VM deployment, set the `--ephemeral-os-disk` parameter in [az vm create](/cli/azure/vm#az_vm_create) to `true` and the `--os-disk-caching` parameter to `ReadOnly`.

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --image UbuntuLTS \
  --ephemeral-os-disk true \
  --os-disk-caching ReadOnly \
  --admin-username azureuser \
  --generate-ssh-keys
```

For scale sets, you use the same `--ephemeral-os-disk true` parameter for [az-vmss-create](/cli/azure/vmss#az_vmss_create) and set the `--os-disk-caching` parameter to `ReadOnly`.

## Portal

In the Azure portal, you can choose to use ephemeral disks when deploying a virtual machine or virtual machine scale sets by opening the **Advanced** section of the **Disks** tab. For choosing placement of Ephemeral OS disk, select **OS cache placement** or **Temp disk placement**.

![Screenshot showing the radio button for choosing to use an ephemeral OS disk](./media/virtual-machines-common-ephemeral/ephemeral-portal-temp.png)

If the option for using an ephemeral disk or OS cache placement or Temp disk placement is greyed out, you might have selected a VM size that doesn't have a cache/temp size larger than the OS image or that doesn't support Premium storage. Go back to the **Basics** page and try choosing another VM size.


## Scale set template deployment  
The process to create a scale set that uses an ephemeral OS disk is to add the `diffDiskSettings` property to the 
`Microsoft.Compute/virtualMachineScaleSets/virtualMachineProfile` resource type in the template. Also, the caching policy must be set to `ReadOnly` for the ephemeral OS disk. placement can be changed to `CacheDisk` for OS cache disk placement.


```json
{ 
  "type": "Microsoft.Compute/virtualMachineScaleSets", 
  "name": "myScaleSet", 
  "location": "East US 2", 
  "apiVersion": "2019-12-01", 
  "sku": { 
    "name": "Standard_DS2_v2", 
    "capacity": "2" 
  }, 
  "properties": { 
    "upgradePolicy": { 
      "mode": "Automatic" 
    }, 
    "virtualMachineProfile": { 
       "storageProfile": { 
        "osDisk": { 
          "diffDiskSettings": { 
            "option": "Local" ,
            "placement": "ResourceDisk"
          }, 
          "caching": "ReadOnly", 
          "createOption": "FromImage" 
        }, 
        "imageReference":  { 
          "publisher": "Canonical", 
          "offer": "UbuntuServer", 
          "sku": "16.04-LTS", 
          "version": "latest" 
        } 
      }, 
      "osProfile": { 
        "computerNamePrefix": "myvmss", 
        "adminUsername": "azureuser", 
        "adminPassword": "P@ssw0rd!" 
      } 
    } 
  } 
}  
```

## VM template deployment 
You can deploy a VM with an ephemeral OS disk using a template. The process to create a VM that uses ephemeral OS disks is to add the `diffDiskSettings` property to Microsoft.Compute/virtualMachines resource type in the template. Also, the caching policy must be set to `ReadOnly` for the ephemeral OS disk. placement option can be changed to `CacheDisk` for OS cache disk placement.

```json
{ 
  "type": "Microsoft.Compute/virtualMachines", 
  "name": "myVirtualMachine", 
  "location": "East US 2", 
  "apiVersion": "2019-12-01", 
  "properties": { 
       "storageProfile": { 
            "osDisk": { 
              "diffDiskSettings": { 
                "option": "Local" ,
                "placement": "ResourceDisk"
              }, 
              "caching": "ReadOnly", 
              "createOption": "FromImage" 
            }, 
            "imageReference": { 
                "publisher": "MicrosoftWindowsServer", 
                "offer": "WindowsServer", 
                "sku": "2016-Datacenter-smalldisk", 
                "version": "latest" 
            }, 
            "hardwareProfile": { 
                 "vmSize": "Standard_DS2_v2" 
             } 
      }, 
      "osProfile": { 
        "computerNamePrefix": "myvirtualmachine", 
        "adminUsername": "azureuser", 
        "adminPassword": "P@ssw0rd!" 
      } 
    } 
 } 
```


## Reimage a VM using REST
You can reimage a Virtual Machine instance with ephemeral OS disk using REST API as described below and via Azure portal by going to Overview pane of the VM. For scale sets, reimaging is already available through PowerShell, CLI, and the portal.

```
POST https://management.azure.com/subscriptions/{sub-
id}/resourceGroups/{rgName}/providers/Microsoft.Compute/VirtualMachines/{vmName}/reimage?a pi-version=2019-12-01" 
```
 
## Frequently asked questions

**Q: What is the size of the local OS Disks?**

A: We support platform and custom images, up to the VM cache size, where all read/writes to the OS disk will be local on the same node as the Virtual Machine. 

**Q: Can the ephemeral OS disk be resized?**

A: No, once the ephemeral OS disk is provisioned, the OS disk cannot be resized. 

**Q: Can the ephemeral OS disk placement be modified after creation of VM?**

A: No, once the ephemeral OS disk is provisioned, the OS disk placement cannot be changed. But the VM can be recreated via ARM template deployment/PowerShell/CLI by updating the OS disk placement of choosing. Resulting in the recreation of the VM with Data on the OS disk deleted and OS is reprovisioned.

**Q: Can I attach a Managed Disks to an Ephemeral VM?**

A: Yes, you can attach a managed data disk to a VM that uses an ephemeral OS disk. 

**Q: Will all VM sizes be supported for ephemeral OS disks?**

A: No, most Premium Storage VM sizes are supported (DS, ES, FS, GS, M, etc.). To know whether a particular VM size supports ephemeral OS disks, you can:

Call the `Get-AzComputeResourceSku` PowerShell cmdlet
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

**Q: Can the ephemeral OS disk be created using Powershell or CLI?**

A: Yes, you can create VMs with Ephemeral OS Disk using REST, Templates, PowerShell, and CLI.

**Q: What features are not supported with ephemeral OS disk?**

A: Ephemeral disks do not support:
- Capturing VM images
- Disk snapshots 
- Azure Disk Encryption 
- Azure Backup
- Azure Site Recovery  
- OS Disk Swap 

> [!NOTE]
> 
> Ephemeral disk will not be accessible through the portal. You will receive a "Resource not Found" or "404" error when accessing the ephemeral disk which is expected.
> 
 
## Next steps
You can create a VM with an ephemeral OS disk using the [Azure CLI](/cli/azure/vm#az_vm_create).