---
title: Ephemeral OS disks for Azure VMs | Microsoft Docs
description: Preview: Ephemeral OS disks for Azure VMs.Use the portal to attach new or existing data disk to a Linux VM.
services: virtual-machines-linux
author: cynthn
manager: jeconnoc

ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.topic: article
ms.date: 04/23/2019
ms.author: cynthn
ms.subservice: disks
---
# Preview: Ephemeral OS disks for Azure VMs
 
Ephemeral OS disk is now in limited public preview with Virtual Machines and Virtual Machine Scale Set (VMSS). Ephemeral OS disks are directly created on the host node and not persisted to Azure Storage and can be leveraged by stateless workloads that can tolerate individual VM instance failures due to unexpected events such as hardware failures, but are more focused about read/write latency to the OS disk and frequent VM instance reimage operations. 
 
Key value propositions of Ephemeral OS Disk… 
1.	Can be used with both Marketplace images and custom images up to 30GiB 
2.	Lower run-time latency similar to temp disk. 
3.	Ability to fast reset/reimage their VMs (for OS Disk) to the original boot state.  
4.	Improved deployment time 
5.	No dependency on persistence storage for VM availability. 
 
To join the preview, please fill in the form at http://aka.ms/ephemeralpreviewform  
 
Key Comparisons between persistent OS disk and non 	-persistent OS disk 

|                             | Persistent OS Disk                          | Ephemeral OS Disk                              |    |
|-----------------------------|---------------------------------------------|------------------------------------------------|
| Size limit for OS disk      | 2 TiB                                                                                        | Up to 30 GiB for preview Up to VM cache size at general availability               |
| VM sizes supported          | All                                                                                          | DSv1, DSv2, DSv3, Esv2, Fs, FsV2, GS                                               |
| Disk type support           | Managed and unmanaged OS disk                                                                | Managed OS disk only                                                               |
| Region support              | All regions                                                                                  | All regions excluding sovereign clouds                                             |
| Specialized OS disk support | Yes                                                                                          | No                                                                                 |
| Data persistence            | OS disk data written to OS disk are stored in Azure Storage                                  | OS disk data is stored to local host machine and is not persisted to Azure Storage |
| Stop-deallocated state      | VMSS instances and VMs can be stop-deallocated and restarted from the stop-deallocated state | VMSS instances and VMs cannot be stop-deallocated                                  |
| OS disk resize              | Supported during VM creation and after VM is stop-deallocated                                | Supported during VM creation only                                                  |
| Resizing to a new VM size   | OS disk data is preserved                                                                    | OS disk data is deleted, OS is re-provisioned                                      |



How to Deploy VMSS with ephemeral OS disk using Azure Resource Manager Template 
The process to create a scale set that uses ephemeral OS is to add the 'diffDiskSettings' property to the 
Microsoft.Compute/virtualMachineScaleSets/virtualMachineProfile resource type in the Azure Resource Manager Template as highlighted below. Note that the caching policy must be set to ReadOnly for Ephemeral OS disk. 


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

How to Deploy a Virtual Machine with ephemeral OS disk using Azure Resource Manager Template 
The process to create a scale set that uses ephemeral OS is to add the 'diffDiskSettings' property to the Microsoft.Compute/virtualMachines resource type in the Azure Resource Manager Template as highlighted below. Note that the caching policy must be set to ReadOnly for Ephemeral OS disk. 

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


How to Reimage a Virtual Machine using REST API 
Currently, the only method to reimage a Virtual Machine instance with ephemeral OS disk is through using REST API. For VMSS, reimage operation is already available through Powershell/CLI/Portal

```
POST https://management.azure.com/subscriptions/{sub-
id}/resourceGroups/{rgName}/providers/Microsoft.Compute/VirtualMachines/{vmName}/reimage?a pi-version=2018-06-01" 
```
 
## Frequently asked questions

Q: What is the size of the local OS Disks? 
A: For preview,we will support platform images up to 30GB OS disk, where all read/writes to the OS disk will be local on the same node as the Virtual Machine. For general availability, due to limit OS image size in drive, we propose to limit the OS disk size based on vCPU. Current thinking is that we should limit it to 8GiB per vCPU with min 16GiB up to 128GiB for OS images. 

Q: Can the ephemeral OS disk be resized? 
A: No, once the ephemeral OS disk is provisioned, the OS disk cannot be resized. 

Q: Can I attach a Managed Disks to an Ephemeral VM? 
A: Yes, this functionality to attach managed data disk is supported. 

Q: What VM sizes will be supported for ephemeral VM? 
A: All *S VM sizes are supported except B-, M-, N-, H- sizes.  
 
Q: Can the ephemeral OS disk be applied to existing VM and VM Scale Set? 
A: No, ephemeral OS disk can only be leveraged during VM and VM Scale Set creation. It is also not supported to have a mix of Ephemeral OS Disk and persistent OS Disks VM instances within the same VM Scaleset. 

Q: Can the ephemeral OS disk be created using Powershell or CLI? 
A: For preview, only ARM template is supported for creating ephemeral OS disk.

Q: What features are not supported with ephemeral OS disk? 
A: Ephermeral disks do not support:
-	Capturing VM 
-	Disk snapshots 
-	Azure Disk Encryption 
-	Recovery Services Vault (Backup and Site Recovery) 
-	OS Disk Swap 
 
## Next steps



