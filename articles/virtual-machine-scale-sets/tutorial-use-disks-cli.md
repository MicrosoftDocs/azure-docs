---
title: Tutorial - Create and use disks for scale sets with Azure CLI
description: Learn how to use the Azure CLI to create and use Managed Disks with Virtual Machine Scale Set. Including how to add, prepare, list, and detach disks.
author: ju-shim
ms.author: jushiman
ms.topic: tutorial
ms.service: virtual-machine-scale-sets
ms.subservice: disks
ms.date: 12/16/2022
ms.reviewer: mimckitt
ms.custom: mimckitt, devx-track-azurecli

---
# Tutorial: Create and use disks with Virtual Machine Scale Set with the Azure CLI
Virtual Machine Scale Sets use disks to store the VM instance's operating system, applications, and data. As you create and manage a scale set, it's important to choose a disk size and configuration appropriate to the expected workload. This tutorial covers how to create and manage VM disks. In this tutorial you learn about:

> [!div class="checklist"]
> * OS disks and temporary disks
> * Data disks
> * Standard and Premium disks
> * Disk performance
> * Attach and prepare data disks

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.29 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Default Azure disks
When a scale set is created or scaled, two disks are automatically attached to each VM instance.

**Operating system disk** - Operating system disks can be sized up to 2 TB, and hosts the VM instance's operating system. The OS disk is labeled */dev/sda* by default. The disk caching configuration of the OS disk is optimized for OS performance. Because of this configuration, the OS disk **should not** host applications or data. For applications and data, use data disks, which are detailed later in this article.

**Temporary disk** - Temporary disks use a solid-state drive that is located on the same Azure host as the VM instance. Temporary disks are high-performance disks and may be used for operations such as temporary data processing. However, if the VM instance is moved to a new host, any data stored on a temporary disk is removed. The size of the temporary disk is determined by the VM instance size. Temporary disks are labeled */dev/sdb* and have a mountpoint of */mnt*.

## Azure data disks
Additional data disks can be added if you need to install applications and store data. Data disks should be used in any situation where durable and responsive data storage is desired. Each data disk has a maximum capacity of 4 TB. The size of the VM instance determines how many data disks can be attached. For each VM vCPU, two data disks can be attached up to an absolute maximum of 64 disks per virtual machine.

## VM disk types
Azure provides two types of disk.

### Standard disk
Standard Storage is backed by HDDs, and delivers cost-effective storage and performance. Standard disks are ideal for a cost effective dev and test workload.

### Premium disk
Premium disks are backed by SSD-based high-performance, low-latency disk. These disks are recommended for VMs that run production workloads. Premium Storage supports DS-series, DSv2-series, GS-series, and FS-series VMs. When you select a disk size, the value is rounded up to the next type. For example, if the disk size is less than 128 GB, the disk type is P10. If the disk size is between 129 GB and 512 GB, the size is a P20. Over, 512 GB, the size is a P30.

## Create and attach disks
You can create and attach disks when you create a scale set, or with an existing scale set.

As of API version `2019-07-01`, you can set the size of the OS disk in a Virtual Machine Scale Set with the [storageProfile.osDisk.diskSizeGb](/rest/api/compute/virtualmachinescalesets/createorupdate#virtualmachinescalesetosdisk) property. After provisioning, you may have to expand or repartition the disk to make use of the whole space. Learn more about how to expand the volume in your OS in either [Windows](../virtual-machines/windows/expand-os-disk.md#expand-the-volume-in-the-operating-system) or [Linux](../virtual-machines/linux/expand-disks.md#expand-a-disk-partition-and-filesystem).

### Attach disks at scale set creation
First, create a resource group with the [az group create](/cli/azure/group) command. In this example, a resource group named *myResourceGroup* is created in the *eastus* region.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Create a Virtual Machine Scale Set with the [az vmss create](/cli/azure/vmss#az-vmss-create) command. The following example creates a scale set named *myScaleSet*, and generates SSH keys if they don't exist. Two disks are created with the `--data-disk-sizes-gb` parameter. The first disk is *64* GB in size, and the second disk is *128* GB:

```azurecli-interactive
az vmss create \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --image Ubuntu2204 \
  --orchestration-mode Flexible \
  --admin-username azureuser \
  --generate-ssh-keys \
  --data-disk-sizes-gb 64 128
```

It takes a few minutes to create and configure all the scale set resources and VM instances.

### Attach a disk to existing scale set
You can also attach additional disks to each instance in an existing scale set. Use the scale set created in the previous step to add another disk with [az vmss disk attach](/cli/azure/vmss/disk#az-vmss-disk-attach). The following example attaches an additional *128* GB disk:

```azurecli-interactive
az vmss disk attach \
  --resource-group myResourceGroup \
  --vmss-name myScaleSet \
  --size-gb 128
```

Alternatively, if you want to add a data disk to an individual instance in a scale set, use [az vm disk attach](/cli).

```azurecli-interactive
az vm disk attach \
  --vm-name myScaleSet_Instance1 \
  --resource-group myResourceGroup \
  --size-gb 30 \
  --name disk_name \
  --new
```

## List attached disks
To view information about disks attached to a scale set, use [az vmss show](/cli/azure/vmss#az-vmss-show) and query on *virtualMachineProfile.storageProfile.dataDisks*:

```azurecli-interactive
az vmss show \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --query virtualMachineProfile.storageProfile.dataDisks
```

Information on the disk size, storage tier, and LUN (Logical Unit Number) is shown. The following example output details the three data disks attached to the scale set:

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
      "storageAccountType": "StandardSSD_LRS"
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
      "storageAccountType": "StandardSSD_LRS"
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
      "storageAccountType": "StandardSSD_LRS"
    },
    "name": null
  }
]
```

## Detach a disk
When you no longer need a given disk, you can detach it from the scale set. The disk is removed from all VM instances in the scale set. To detach a disk from a scale set, use [az vmss disk detach](/cli/azure/vmss/disk#az-vmss-disk-detach) and specify the LUN of the disk. The LUNs are shown in the output from [az vmss show](/cli/azure/vmss#az-vmss-show) in the previous section. The following example detaches LUN *2* from the scale set:

```azurecli-interactive
az vmss disk detach \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --lun 2
```

You can also use [az vm disk detach](/cli/azure/vmss/disk#az-vmss-disk-detac) to detach a disk from an individual instance. 

```azurepowershell-interactive
az vm disk detach \
  --vm-name myScaleSet_Instance1
  --name disk_name
```

## Clean up resources
To remove your scale set and disks, delete the resource group and all its resources with [az group delete](/cli/azure/group). The `--no-wait` parameter returns control to the prompt without waiting for the operation to complete. The `--yes` parameter confirms that you wish to delete the resources without an additional prompt to do so.

```azurecli-interactive
az group delete --name myResourceGroup --no-wait --yes
```

## Next steps
In this tutorial, you learned how to create and use disks with scale sets with the Azure CLI:

> [!div class="checklist"]
> * OS disks and temporary disks
> * Data disks
> * Standard and Premium disks
> * Disk performance
> * Attach and prepare data disks

Advance to the next tutorial to learn how to use a custom image for your scale set VM instances.

> [!div class="nextstepaction"]
> [Use a custom image for scale set VM instances](tutorial-use-custom-image-cli.md)