---
title: Ephemeral OS disks for Azure VMs | Microsoft Docs
description: Ephemeral OS disks for Azure VMs.Use the portal to attach new or existing data disk to a Linux VM.
services: virtual-machines-linux
author: cynthn
manager: jeconnoc

ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.topic: article
ms.date: 04/24/2019
ms.author: cynthn
ms.subservice: disks
---
# Preview: Ephemeral OS disks for Azure VMs
 
Ephemeral OS disk is now in public preview for Virtual Machines  (VMs)and Virtual Machine Scale Sets. Ephemeral OS disks are created on the host node and not persisted to Azure Storage. Ephemeral disks work well for stateless workloads that can tolerate individual VM instance failures due to unexpected events such as hardware failures, and are more focused on read/write latency to the OS disk and frequent VM instance reimaging. 
 
The key features of Ephemeral disks are: 
1.	They can be used with both Marketplace images and custom images up to 30GiB.
2.	Lower run-time latency similar to a temporary disk. 
3.	Ability to fast reset or reimage their VMs to the original boot state.  
4.	Faster deployment time.
5.	No dependency on persistent storage for VM availability. 
 
To join the preview, please fill in the form at http://aka.ms/ephemeralpreviewform  
 
Key differentces between persistent and ephemeral OS disks:

|                             | Persistent OS Disk                          | Ephemeral OS Disk                              |    |
|-----------------------------|---------------------------------------------|------------------------------------------------|
| Size limit for OS disk      | 2 TiB                                                                                        | Up to 30 GiB for preview and up to VM cache size at general availability               |
| VM sizes supported          | All                                                                                          | DSv1, DSv2, DSv3, Esv2, Fs, FsV2, GS                                               |
| Disk type support           | Managed and unmanaged OS disk                                                                | Managed OS disk only                                                               |
| Region support              | All regions                                                                                  | All regions except: Azure Government, Azure Germany, and Azure China 21Vianet                                             |
| Specialized OS disk support | Yes                                                                                          | No                                                                                 |
| Data persistence            | OS disk data written to OS disk are stored in Azure Storage                                  | OS disk data is stored to local host machine and is not persisted to Azure Storage |
| Stop-deallocated state      | VMs and scale set instances can be stop-deallocated and restarted from the stop-deallocated state | VMs and scale set instances cannot be stop-deallocated                                  |
| OS disk resize              | Supported during VM creation and after VM is stop-deallocated                                | Supported during VM creation only                                                  |
| Resizing to a new VM size   | OS disk data is preserved                                                                    | Data on the OS disk is deleted, OS is re-provisioned                                      |



## Scale set depployment  
The process to create a scale set that uses an ephemeral OS disk is to add the 'diffDiskSettings' property to the 
`Microsoft.Compute/virtualMachineScaleSets/virtualMachineProfile` resource type in the resource manager template. Also, the caching policy must be set to `ReadOnly` for the ephemeral OS disk. 


```json
{ 
  "type": "Microsoft.Compute/virtualMachineScaleSets", 
  "name": "myScaleSet", 
  "location": "East US 2", 
  "apiVersion": "2018-06-01", 
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
	           	"option": "Local" 
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

## VM deployment 
You can deploy a VM with an ephemeral OS disk using an Azure Resource Manager Template. The process to create a VM that uses ephemeral OS disks is to add the `diffDiskSettings` property to the Microsoft.Compute/virtualMachines resource type in the template. Also, the caching policy must be set to `ReadOnly` for the ephemeral OS disk. 

```json
{ 
  "type": "Microsoft.Compute/virtualMachines", 
  "name": "myVirtualMachine", 
  "location": "East US 2", 
  "apiVersion": "2018-06-01", 
  "properties": { 
       "storageProfile": { 
            "osDisk": { 
              "diffDiskSettings": { 
               	"option": "Local" 
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
Currently, the only method to reimage a Virtual Machine instance with ephemeral OS disk is through using REST API. For scale sets, reimaging is already available through Powershell, CLI, and the portal.

```
POST https://management.azure.com/subscriptions/{sub-
id}/resourceGroups/{rgName}/providers/Microsoft.Compute/VirtualMachines/{vmName}/reimage?a pi-version=2018-06-01" 
```
 
## Frequently asked questions

**Q: What is the size of the local OS Disks?**

A: For preview, we will support platform images up to 30GB OS disk, where all read/writes to the OS disk will be local on the same node as the Virtual Machine. For general availability, due to limited OS image size on the drive, we will probably limit the OS disk size based on vCPU count. Currently we think this limit should be 8GiB per vCPU with a minimum of 16GiB, going up to 128GiB. 

**Q: Can the ephemeral OS disk be resized?**

A: No, once the ephemeral OS disk is provisioned, the OS disk cannot be resized. 

**Q: Can I attach a Managed Disks to an Ephemeral VM?**

A: Yes, you can attach a managed data disk to a VM that uses an ephemeral OS disk. 

**Q: Will all VM sizes will be supported for ephemeral OS disks?**

A: No, all VM sizes are supported except the B-series, M-series, N-series, and H-series sizes.  
 
**Q: Can the ephemeral OS disk be applied to existing VMs and VM Scale Sets?**

A: No, ephemeral OS disk can only be used during VM and VM Scale Set creation. 

**Q: Can you mix ephemeral and normal OS disks in a scale set?**

A: No, you can't have a mix of ephemeral and persistent OS disk instances within the same scale set. 

**Q: Can the ephemeral OS disk be created using Powershell or CLI?**

A: For preview, only resource manager template deployments are supported for creating ephemeral OS disks.

**Q: What features are not supported with ephemeral OS disk?**

A: Ephemeral disks do not support:
-	Capturing VM images
-	Disk snapshots 
-	Azure Disk Encryption 
-	Recovery Services Vault (Backup and Site Recovery) 
-	OS Disk Swap 
 
## Next steps

For more information, see [Ephemeral OS Disk in limited preview](https://azure.microsoft.com/en-us/blog/ephemeral-os-disk-limited-public-preview/).

