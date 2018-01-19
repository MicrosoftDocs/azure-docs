---
title: Create and use disks for scale sets with the Azure CLI 2.0 | Microsoft Docs
description: Learn how to create and use Managed Disks with virtual machine scale set using the Azure CLI 2.0, including how to add, prepare, list, and detach disks.
services: virtual-machine-scale-sets
documentationcenter: ''
author: iainfoulds
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 01/18/2018
ms.author: iainfou
ms.custom: mvc

---
# Create and use Disks with virtual machine scale set using the Azure CLI 2.0
Virtual machine scale sets use disks to store the VM instance's operating system, applications, and data. As you create and manage a scale set, it is important to choose a disk size and configuration appropriate to the expected workload. This tutorial covers deploying and managing VM disks. In this tutorial you learn how to:

> [!div class="checklist"]
> * OS disks and temporary disks
> * Data disks
> * Standard and Premium disks
> * Disk performance
> * Attaching and preparing data disks

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.24 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 


## Default Azure disks
When a scale set is created or scaled, two disks are automatically attached to each VM instance. 

**Operating system disk** - Operating system disks can be sized up to 2 TB, and hosts the VM instance's operating system. The OS disk is labeled */dev/sda* by default. The disk caching configuration of the OS disk is optimized for OS performance. Because of this configuration, the OS disk **should not** host applications or data. For applications and data, use data disks, which are detailed later in this article. 

**Temporary disk** - Temporary disks use a solid-state drive that is located on the same Azure host as the VM instance. Temp disks are highly performant and may be used for operations such as temporary data processing. However, if the VM instance is moved to a new host, any data stored on a temporary disk is removed. The size of the temporary disk is determined by the VM instance size. Temporary disks are labeled */dev/sdb* and have a mountpoint of */mnt*.

### Temporary disk sizes
| Type | Common sizes | Max temp disk size (GiB) |
|----|----|----|
| [General purpose](sizes-general.md) | A, B, and D series | 1600 |
| [Compute optimized](sizes-compute.md) | F series | 576 |
| [Memory optimized](../virtual-machines-windows-sizes-memory.md) | D, E, G, and M series | 6144 |
| [Storage optimized](../virtual-machines-windows-sizes-storage.md) | L series | 5630 |
| [GPU](sizes-gpu.md) | N series | 1440 |
| [High performance](sizes-hpc.md) | A and H series | 2000 |


## Azure data disks
Additional data disks can be added for installing applications and storing data. Data disks should be used in any situation where durable and responsive data storage is desired. Each data disk has a maximum capacity of 4 TB. The size of the VM instance determines how many data disks can be attached. For each VM vCPU, two data disks can be attached. 

### Max data disks per VM
| Type | Common sizes | Max data disks per VM |
|----|----|----|
| [General purpose](sizes-general.md) | A, B, and D series | 64 |
| [Compute optimized](sizes-compute.md) | F series | 64 |
| [Memory optimized](../virtual-machines-windows-sizes-memory.md) | D, E, G, and M series | 64 |
| [Storage optimized](../virtual-machines-windows-sizes-storage.md) | L series | 64 |
| [GPU](sizes-gpu.md) | N series | 64 |
| [High performance](sizes-hpc.md) | A and H series | 64 |


## VM disk types
Azure provides two types of disk.

### Standard disk
Standard Storage is backed by HDDs, and delivers cost-effective storage while still being performant. Standard disks are ideal for a cost effective dev and test workload.

### Premium disk
Premium disks are backed by SSD-based high-performance, low-latency disk. Perfect for VMs running production workload. Premium Storage supports DS-series, DSv2-series, GS-series, and FS-series VMs. When selecting, a disk size the value is rounded up to the next type. For example, if the disk size is less than 128 GB, the disk type is P10. If the disk size is between 129 GB and 512 GB, the size is a P20. Anything over 512 GB, the size is a P30.

### Premium disk performance
|Premium storage disk type | P4 | P6 | P10 | P20 | P30 | P40 | P50 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Disk size (round up) | 32 GB | 64 GB | 128 GB | 512 GB | 1,024 GB (1 TB) | 2,048 GB (2 TB) | 4,095 GB (4 TB) |
| Max IOPS per disk | 120 | 240 | 500 | 2,300 | 5,000 | 7,500 | 7,500 |
Throughput per disk | 25 MB/s | 50 MB/s | 100 MB/s | 150 MB/s | 200 MB/s | 250 MB/s | 250 MB/s |

While the above table identifies max IOPS per disk, a higher level of performance can be achieved by striping multiple data disks. For instance, a Standard_GS5 VM can achieve a maximum of 80,000 IOPS. For detailed information on max IOPS per VM, see [Linux VM sizes](sizes.md).


## Create and attach disks to a scale set
You can create and attach disks when you create a scale set, or with an existing scale set.

## Attach disks at scale set creation
First, create a resource group with the [az group create](/cli/azure/group#az_group_create) command. In this example, a resource group named *myResourceGroup* is created in the *eastus* region. 

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Create a virtual machine scale set with the [az vmss create](/cli/azure/vmss#az_vmss_create) command. The following example creates a scale set named *myScaleSet*, and generates SSH keys if they do not exist. Two disks are created with the `--data-disk-sizes-gb` parameter. The first disk is *64* GB in size, and the second disk is *128* GB:

```azurecli-interactive
az vmss create \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --image UbuntuLTS \
  --upgrade-policy automatic \
  --admin-username azureuser \
  --generate-ssh-keys \
  --data-disk-sizes-gb 64 128
```

It takes a few minutes to create and configure all the scale set resources and VM instances.

### Attach a disk to existing scale set
You can also attach disks to an existing scale set. Use the scale set created in the previous step to add another disk with [az vmss disk attach](/cli/azure/vmss/disk#az_vmss_disk_attach). The following example attaches an additional *128* GB disk:

```azurecli-interactive
az vmss disk attach \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --size-gb 128
```

## Prepare the data disks
The disks that are created and attached to your scale set VM instances are raw disks. Before you can use them with your data and applications, the disks must be prepared. This step involves creating a partition, creating a filesystem, and mounting them. To automate the process across multiple VM instances in a scale set, you can use the Azure Custom Script Extension. This extension can execute scripts locally on each VM instance. The following example executes a script from a GitHub samples repo on each VM instance with [az vmss extension set](/cli/azure/vmss/extension#az_vmss_extension_set) that prepares all the raw attached data disks:

```azurecli-interactive
az vmss extension set \
  --publisher Microsoft.Azure.Extensions \
  --version 2.0 \
  --name CustomScript \
  --resource-group myResourceGroup \
  --vmss-name myScaleSet \
  --settings '{"fileUris":["https://raw.githubusercontent.com/iainfoulds/compute-automation-configurations/preparevmdisks/prepare_vm_disks.sh"],"commandToExecute":"./prepare_vm_disks.sh"}'
```

From `sudo fdisk -l` on a VM:

```bash
Disk /dev/sdc: 64 GiB, 68719476736 bytes, 134217728 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xa47874cb

Device     Boot Start       End   Sectors Size Id Type
/dev/sdc1        2048 134217727 134215680  64G 83 Linux

Disk /dev/sdd: 128 GiB, 137438953472 bytes, 268435456 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xd5c95ca0

Device     Boot Start       End   Sectors  Size Id Type
/dev/sdd1        2048 268435455 268433408  128G 83 Linux
```

From `sudo df -h` on a VM instance:

```bash
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        30G  1.3G   28G   5% /
/dev/sdb1        50G   52M   47G   1% /mnt
/dev/sdc1        63G   52M   60G   1% /datadisks/disk1
/dev/sdd1       126G   60M  120G   1% /datadisks/disk2
```


## List attached disks
```azurecli-interactive
az vmss show \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --query virtualMachineProfile.storageProfile.dataDisks
```

```json
[
  {
    "additionalProperties": {},
    "caching": "None",
    "createOption": "Empty",
    "diskSizeGb": 64,
    "lun": 0,
    "managedDisk": {
      "additionalProperties": {},
      "storageAccountType": "Standard_LRS"
    },
    "name": null
  },
  {
    "additionalProperties": {},
    "caching": "None",
    "createOption": "Empty",
    "diskSizeGb": 128,
    "lun": 1,
    "managedDisk": {
      "additionalProperties": {},
      "storageAccountType": "Standard_LRS"
    },
    "name": null
  },
  {
    "additionalProperties": {},
    "caching": "None",
    "createOption": "Empty",
    "diskSizeGb": 128,
    "lun": 2,
    "managedDisk": {
      "additionalProperties": {},
      "storageAccountType": "Standard_LRS"
    },
    "name": null
  }
]
```


## Detach a disk
```azurecli-interactive
az vmss disk detach \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --lun 2
```

## Delete resource group
When you delete a resource group, all resources contained within, such as the VM instances, virtual network, and disks, are also deleted. The `--no-wait` parameter returns control to the prompt without waiting for the operation to complete. The `--yes` parameter confirms that you wish to delete the resources without an additional prompt to do so.

```azurecli-interactive 
az group delete --name myResourceGroup --no-wait --yes
```


## Next steps
In this tutorial, you learned how to create and use disks with scale sets using the Azure CLI 2.0:

> [!div class="checklist"]
> * OS disks and temporary disks
> * Data disks
> * Standard and Premium disks
> * Disk performance
> * Attaching and preparing data disks

Advance to the next tutorial to learn how to use a custom image for your scale set VM instances.

> [!div class="nextstepaction"]
> [Use a custom image for scale set VM instances]()