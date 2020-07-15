---
title: Tutorial - Create and use disks for scale sets with Azure CLI
description: Learn how to use the Azure CLI to create and use Managed Disks with virtual machine scale set, including how to add, prepare, list, and detach disks.
author: ju-shim
ms.author: jushiman
ms.topic: tutorial
ms.service: virtual-machine-scale-sets
ms.subservice: disks
ms.date: 03/27/2018
ms.reviewer: mimckitt
ms.custom: mimckitt

---
# Tutorial: Create and use disks with virtual machine scale set with the Azure CLI
Virtual machine scale sets use disks to store the VM instance's operating system, applications, and data. As you create and manage a scale set, it is important to choose a disk size and configuration appropriate to the expected workload. This tutorial covers how to create and manage VM disks. In this tutorial you learn how to:

> [!div class="checklist"]
> * OS disks and temporary disks
> * Data disks
> * Standard and Premium disks
> * Disk performance
> * Attach and prepare data disks

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.29 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).


## Default Azure disks
When a scale set is created or scaled, two disks are automatically attached to each VM instance.

**Operating system disk** - Operating system disks can be sized up to 2 TB, and hosts the VM instance's operating system. The OS disk is labeled */dev/sda* by default. The disk caching configuration of the OS disk is optimized for OS performance. Because of this configuration, the OS disk **should not** host applications or data. For applications and data, use data disks, which are detailed later in this article.

**Temporary disk** - Temporary disks use a solid-state drive that is located on the same Azure host as the VM instance. These are high-performance disks and may be used for operations such as temporary data processing. However, if the VM instance is moved to a new host, any data stored on a temporary disk is removed. The size of the temporary disk is determined by the VM instance size. Temporary disks are labeled */dev/sdb* and have a mountpoint of */mnt*.

### Temporary disk sizes
| Type | Common sizes | Max temp disk size (GiB) |
|----|----|----|
| [General purpose](../virtual-machines/linux/sizes-general.md) | A, B, and D series | 1600 |
| [Compute optimized](../virtual-machines/linux/sizes-compute.md) | F series | 576 |
| [Memory optimized](../virtual-machines/linux/sizes-memory.md) | D, E, G, and M series | 6144 |
| [Storage optimized](../virtual-machines/linux/sizes-storage.md) | L series | 5630 |
| [GPU](../virtual-machines/linux/sizes-gpu.md) | N series | 1440 |
| [High performance](../virtual-machines/linux/sizes-hpc.md) | A and H series | 2000 |


## Azure data disks
Additional data disks can be added if you need to install applications and store data. Data disks should be used in any situation where durable and responsive data storage is desired. Each data disk has a maximum capacity of 4 TB. The size of the VM instance determines how many data disks can be attached. For each VM vCPU, two data disks can be attached up to an absolute maximum of 64 disks per virtual machine.

## VM disk types
Azure provides two types of disk.

### Standard disk
Standard Storage is backed by HDDs, and delivers cost-effective storage and performance. Standard disks are ideal for a cost effective dev and test workload.

### Premium disk
Premium disks are backed by SSD-based high-performance, low-latency disk. These disks are recommended for VMs that run production workloads. Premium Storage supports DS-series, DSv2-series, GS-series, and FS-series VMs. When you select a disk size, the value is rounded up to the next type. For example, if the disk size is less than 128 GB, the disk type is P10. If the disk size is between 129 GB and 512 GB, the size is a P20. Over, 512 GB, the size is a P30.

### Premium disk performance
|Premium storage disk type | P4 | P6 | P10 | P20 | P30 | P40 | P50 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Disk size (round up) | 32 GB | 64 GB | 128 GB | 512 GB | 1,024 GB (1 TB) | 2,048 GB (2 TB) | 4,095 GB (4 TB) |
| Max IOPS per disk | 120 | 240 | 500 | 2,300 | 5,000 | 7,500 | 7,500 |
Throughput per disk | 25 MB/s | 50 MB/s | 100 MB/s | 150 MB/s | 200 MB/s | 250 MB/s | 250 MB/s |

While the above table identifies max IOPS per disk, a higher level of performance can be achieved by striping multiple data disks. For instance, a Standard_GS5 VM can achieve a maximum of 80,000 IOPS. For detailed information on max IOPS per VM, see [Linux VM sizes](../virtual-machines/linux/sizes.md).


## Create and attach disks
You can create and attach disks when you create a scale set, or with an existing scale set.

### Attach disks at scale set creation
First, create a resource group with the [az group create](/cli/azure/group) command. In this example, a resource group named *myResourceGroup* is created in the *eastus* region.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Create a virtual machine scale set with the [az vmss create](/cli/azure/vmss) command. The following example creates a scale set named *myScaleSet*, and generates SSH keys if they do not exist. Two disks are created with the `--data-disk-sizes-gb` parameter. The first disk is *64* GB in size, and the second disk is *128* GB:

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
You can also attach disks to an existing scale set. Use the scale set created in the previous step to add another disk with [az vmss disk attach](/cli/azure/vmss/disk). The following example attaches an additional *128* GB disk:

```azurecli-interactive
az vmss disk attach \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --size-gb 128
```


## Prepare the data disks
The disks that are created and attached to your scale set VM instances are raw disks. Before you can use them with your data and applications, the disks must be prepared. To prepare the disks, you create a partition, create a filesystem, and mount them.

To automate the process across multiple VM instances in a scale set, you can use the Azure Custom Script Extension. This extension can execute scripts locally on each VM instance, such as to prepare attached data disks. For more information, see the [Custom Script Extension overview](../virtual-machines/linux/extensions-customscript.md).

The following example executes a script from a GitHub sample repo on each VM instance with [az vmss extension set](/cli/azure/vmss/extension) that prepares all the raw attached data disks:

```azurecli-interactive
az vmss extension set \
  --publisher Microsoft.Azure.Extensions \
  --version 2.0 \
  --name CustomScript \
  --resource-group myResourceGroup \
  --vmss-name myScaleSet \
  --settings '{"fileUris":["https://raw.githubusercontent.com/Azure-Samples/compute-automation-configurations/master/prepare_vm_disks.sh"],"commandToExecute":"./prepare_vm_disks.sh"}'
```

To confirm that the disks have been prepared correctly, SSH to one of the VM instances. List the connection information for your scale set with [az vmss list-instance-connection-info](/cli/azure/vmss):

```azurecli-interactive
az vmss list-instance-connection-info \
  --resource-group myResourceGroup \
  --name myScaleSet
```

Use your own public IP address and port number to connect to the first VM instance, as shown in the following example:

```console
ssh azureuser@52.226.67.166 -p 50001
```

Examine the partitions on the VM instance as follows:

```bash
sudo fdisk -l
```

The following example output shows that three disks are attached to the VM instance - */dev/sdc*, */dev/sdd*, and */dev/sde*. Each of those disks has a single partition that uses all the available space:

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

Disk /dev/sde: 128 GiB, 137438953472 bytes, 268435456 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x9312fdf5

Device     Boot Start       End   Sectors  Size Id Type
/dev/sde1        2048 268435455 268433408  128G 83 Linux
```

Examine the filesystems and mount points on the VM instance as follows:

```bash
sudo df -h
```

The following example output shows that the three disks have their filesystems correctly mounted under */datadisks*:

```output
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        30G  1.3G   28G   5% /
/dev/sdb1        50G   52M   47G   1% /mnt
/dev/sdc1        63G   52M   60G   1% /datadisks/disk1
/dev/sdd1       126G   60M  120G   1% /datadisks/disk2
/dev/sde1       126G   60M  120G   1% /datadisks/disk3
```

The disks on each VM instance in your scale are automatically prepared in the same way. As your scale set would scale up, the required data disks are attached to the new VM instances. The Custom Script Extension also runs to automatically prepare the disks.

Close the SSH connection to your VM instance:

```bash
exit
```


## List attached disks
To view information about disks attached to a scale set, use [az vmss show](/cli/azure/vmss) and query on *virtualMachineProfile.storageProfile.dataDisks*:

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
When you no longer need a given disk, you can detach it from the scale set. The disk is removed from all VM instances in the scale set. To detach a disk from a scale set, use [az vmss disk detach](/cli/azure/vmss/disk) and specify the LUN of the disk. The LUNs are shown in the output from [az vmss show](/cli/azure/vmss) in the previous section. The following example detaches LUN *2* from the scale set:

```azurecli-interactive
az vmss disk detach \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --lun 2
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
