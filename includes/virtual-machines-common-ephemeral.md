---
 title: include file
 description: include file
 services: virtual-machines
 author: jonbeck7
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 05/02/2019
 ms.author: azcspmt;jonbeck;cynthn
 ms.custom: include file
---

Ephemeral OS disks are created on the local Virtual Machine (VM) storage and not persisted to the remote Azure Storage. Ephemeral OS disks work well for stateless workloads, where applications are tolerant of individual VM failures, but are more concerned about the time it takes for large-scale deployments or time to reimage the individual VM instances. It is also suitable for applications, deployed using the classic deployment model, to move to the Resource Manager deployment model. With Ephemeral OS disk, you would observe lower read/write latency to the OS disk and faster VM reimage. In addition, Ephemeral OS disk is free, you incur no storage cost for OS disk. 
 
The key features of ephemeral disks are: 
- They can be used with both Marketplace images and custom images.
- You can deploy VM Images up to the size of the VM Cache.
- Ability to fast reset or reimage their VMs to the original boot state.  
- Lower run-time latency similar to a temporary disk. 
- No cost for the OS disk. 
 
 
Key differences between persistent and ephemeral OS disks:

|                             | Persistent OS Disk                          | Ephemeral OS Disk                              |    |
|-----------------------------|---------------------------------------------|------------------------------------------------|
| Size limit for OS disk      | 2 TiB                                                                                        | Cache size for the VM size or 2TiB, whichever is smaller - [DS](../articles/virtual-machines/linux/sizes-general.md), [ES](../articles/virtual-machines/linux/sizes-memory.md), [M](../articles/virtual-machines/linux/sizes-memory.md), [FS](../articles/virtual-machines/linux/sizes-compute.md), and [GS](../articles/virtual-machines/linux/sizes-memory.md)              |
| VM sizes supported          | All                                                                                          | DSv1, DSv2, DSv3, Esv3, Fs, FsV2, GS, M                                               |
| Disk type support           | Managed and unmanaged OS disk                                                                | Managed OS disk only                                                               |
| Region support              | All regions                                                                                  | All regions                              |
| Data persistence            | OS disk data written to OS disk are stored in Azure Storage                                  | Data written to OS disk is stored to the local VM storage and is not persisted to Azure Storage. |
| Stop-deallocated state      | VMs and scale set instances can be stop-deallocated and restarted from the stop-deallocated state | VMs and scale set instances cannot be stop-deallocated                                  |
| Specialized OS disk support | Yes                                                                                          | No                                                                                 |
| OS disk resize              | Supported during VM creation and after VM is stop-deallocated                                | Supported during VM creation only                                                  |
| Resizing to a new VM size   | OS disk data is preserved                                                                    | Data on the OS disk is deleted, OS is re-provisioned                                      |

## Scale set deployment  
The process to create a scale set that uses an ephemeral OS disk is to add the `diffDiskSettings` property to the 
`Microsoft.Compute/virtualMachineScaleSets/virtualMachineProfile` resource type in the template. Also, the caching policy must be set to `ReadOnly` for the ephemeral OS disk. 


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
You can deploy a VM with an ephemeral OS disk using a template. The process to create a VM that uses ephemeral OS disks is to add the `diffDiskSettings` property to the Microsoft.Compute/virtualMachines resource type in the template. Also, the caching policy must be set to `ReadOnly` for the ephemeral OS disk. 

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

A: For preview, we will support platform and/or images up to the VM cache size, where all read/writes to the OS disk will be local on the same node as the Virtual Machine. 

**Q: Can the ephemeral OS disk be resized?**

A: No, once the ephemeral OS disk is provisioned, the OS disk cannot be resized. 

**Q: Can I attach a Managed Disks to an Ephemeral VM?**

A: Yes, you can attach a managed data disk to a VM that uses an ephemeral OS disk. 

**Q: Will all VM sizes be supported for ephemeral OS disks?**

A: No, all Premium Storage VM sizes are supported (DS, ES, FS, GS and M) except the B-series, N-series, and H-series sizes.  
 
**Q: Can the ephemeral OS disk be applied to existing VMs and scale sets?**

A: No, ephemeral OS disk can only be used during VM and scale set creation. 

**Q: Can you mix ephemeral and normal OS disks in a scale set?**

A: No, you can't have a mix of ephemeral and persistent OS disk instances within the same scale set. 

**Q: Can the ephemeral OS disk be created using Powershell or CLI?**

A: Yes, you can create VMs with Ephemeral OS Disk using REST, Templates, PowerShell and CLI.

**Q: What features are not supported with ephemeral OS disk?**

A: Ephemeral disks do not support:
- Capturing VM images
- Disk snapshots 
- Azure Disk Encryption 
- Azure Backup
- Azure Site Recovery  
- OS Disk Swap 
