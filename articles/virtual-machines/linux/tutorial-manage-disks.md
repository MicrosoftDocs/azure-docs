---
title: Manage Azure disks with the Azure CLI | Microsoft Docs
description: Tutorial - Manage Azure disks with the Azure CLI 
services: virtual-machines-linux
documentationcenter: virtual-machines
author: neilpeterson
manager: timlt
editor: tysonn
tags: azure-service-management

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/02/2017
ms.author: nepeters
ms.custom: mvc
---

# Manage Azure disks with the Azure CLI

Azure virtual machines use disks to store the VMs operating system, applications, and data. When creating a VM it is important to choose a disk size and configuration appropriate to the expected workload. This tutorial covers deploying and managing VM disks. You learn about:

> [!div class="checklist"]
> * OS disks and temporary disks
> * Data disks
> * Standard and Premium disks
> * Disk performance
> * Attaching and preparing data disks
> * Resizing disks
> * Disk snapshots


[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Default Azure disks

When an Azure virtual machine is created, two disks are automatically attached to the virtual machine. 

**Operating system disk** - Operating system disks can be sized up to 1 terabyte, and hosts the VMs operating system. The OS disk is labeled */dev/sda* by default. The disk caching configuration of the OS disk is optimized for OS performance. Because of this configuration, the OS disk **should not** host applications or data. For applications and data, use data disks, which are detailed later in this article. 

**Temporary disk** - Temporary disks use a solid-state drive that is located on the same Azure host as the VM. Temp disks are highly performant and may be used for operations such as temporary data processing. However, if the VM is moved to a new host, any data stored on a temporary disk is removed. The size of the temporary disk is determined by the VM size. Temporary disks are labeled */dev/sdb* and have a mountpoint of */mnt*.

### Temporary disk sizes

| Type | VM Size | Max temp disk size (GB) |
|----|----|----|
| [General purpose](sizes-general.md) | A and D series | 800 |
| [Compute optimized](sizes-compute.md) | F series | 800 |
| [Memory optimized](../virtual-machines-windows-sizes-memory.md) | D and G series | 6144 |
| [Storage optimized](../virtual-machines-windows-sizes-storage.md) | L series | 5630 |
| [GPU](sizes-gpu.md) | N series | 1440 |
| [High performance](sizes-hpc.md) | A and H series | 2000 |

## Azure data disks

Additional data disks can be added for installing applications and storing data. Data disks should be used in any situation where durable and responsive data storage is desired. Each data disk has a maximum capacity of 1 terabyte. The size of the virtual machine determines how many data disks can be attached to a VM. For each VM core, two data disks can be attached. 

### Max data disks per VM

| Type | VM Size | Max data disks per VM |
|----|----|----|
| [General purpose](sizes-general.md) | A and D series | 32 |
| [Compute optimized](sizes-compute.md) | F series | 32 |
| [Memory optimized](../virtual-machines-windows-sizes-memory.md) | D and G series | 64 |
| [Storage optimized](../virtual-machines-windows-sizes-storage.md) | L series | 64 |
| [GPU](sizes-gpu.md) | N series | 48 |
| [High performance](sizes-hpc.md) | A and H series | 32 |

## VM disk types

Azure provides two types of disk.

### Standard disk

Standard Storage is backed by HDDs, and delivers cost-effective storage while still being performant. Standard disks are ideal for a cost effective dev and test workload.

### Premium disk

Premium disks are backed by SSD-based high-performance, low-latency disk. Perfect for VMs running production workload. Premium Storage supports DS-series, DSv2-series, GS-series, and FS-series VMs. Premium disks come in three types (P10, P20, P30), the size of the disk determines the disk type. When selecting, a disk size the value is rounded up to the next type. For example, if the disk size is less than 128 GB, the disk type is P10. If the disk size is between 129 GB and 512 GB, the size is a P20. Anything over 512 GB, the size is a P30.

### Premium disk performance

|Premium storage disk type | P10 | P20 | P30 |
| --- | --- | --- | --- |
| Disk size (round up) | 128 GB | 512 GB | 1,024 GB (1 TB) |
| Max IOPS per disk | 500 | 2,300 | 5,000 |
Throughput per disk | 100 MB/s | 150 MB/s | 200 MB/s |

While the above table identifies max IOPS per disk, a higher level of performance can be achieved by striping multiple data disks. For instance, a Standard_GS5 VM can achieve a maximum of 80,000 IOPS. For detailed information on max IOPS per VM, see [Linux VM sizes](sizes.md).

## Create and attach disks

Data disks can be created and attached at VM creation time or to an existing VM.

### Attach disk at VM creation

Create a resource group with the [az group create](https://docs.microsoft.com/cli/azure/group#create) command. 

```azurecli-interactive 
az group create --name myResourceGroupDisk --location eastus
```

Create a VM using the [az vm create]( /cli/azure/vm#create) command. The `--datadisk-sizes-gb` argument is used to specify that an additional disk should be created and attached to the virtual machine. To create and attach more than one disk, use a space-delimited list of disk size values. In the following example, a VM is created with two data disks, both 128 GB. Because the disk sizes are 128 GB, these disks are both configured as P10s, which provide maximum 500 IOPS per disk.

```azurecli-interactive 
az vm create \
  --resource-group myResourceGroupDisk \
  --name myVM \
  --image UbuntuLTS \
  --size Standard_DS2_v2 \
  --data-disk-sizes-gb 128 128 \
  --generate-ssh-keys
```

### Attach disk to existing VM

To create and attach a new disk to an existing virtual machine, use the [az vm disk attach](/cli/azure/vm/disk#attach) command. The following example creates a premium disk, 128 gigabytes in size, and attaches it to the VM created in the last step.

```azurecli-interactive 
az vm disk attach --vm-name myVM --resource-group myResourceGroupDisk --disk myDataDisk --size-gb 128 --sku Premium_LRS --new 
```

## Prepare data disks

Once a disk has been attached to the virtual machine, the operating system needs to be configured to use the disk. The following example shows how to manually configure a disk. This process can also be automated using cloud-init, which is covered in a [later tutorial](./tutorial-automate-vm-deployment.md).

### Manual configuration

Create an SSH connection with the virtual machine. Replace the example IP address with the public IP of the virtual machine.

```azurecli-interactive 
ssh 52.174.34.95
```

Partition the disk with `fdisk`.

```bash
(echo n; echo p; echo 1; echo ; echo ; echo w) | sudo fdisk /dev/sdc
```

Write a file system to the partition by using the `mkfs` command.

```bash
sudo mkfs -t ext4 /dev/sdc1
```

Mount the new disk so that it is accessible in the operating system.

```bash
sudo mkdir /datadrive && sudo mount /dev/sdc1 /datadrive
```

The disk can now be accessed through the *datadrive* mountpoint, which can be verified by running the `df -h` command. 

```bash
df -h
```

The output shows the new drive mounted on */datadrive*.

```bash
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        30G  1.4G   28G   5% /
/dev/sdb1       6.8G   16M  6.4G   1% /mnt
/dev/sdc1        50G   52M   47G   1% /datadrive
```

To ensure that the drive is remounted after a reboot, it must be added to the */etc/fstab* file. To do so, get the UUID of the disk with the `blkid` utility.

```bash
sudo -i blkid
```

The output displays the UUID of the drive, `/dev/sdc1` in this case.

```bash
/dev/sdc1: UUID="33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e" TYPE="ext4"
```

Add a line similar to the following to the */etc/fstab* file. Also note that write barriers can be disabled using *barrier=0*, this configuration can improve disk performance. 

```bash
UUID=33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e   /datadrive  ext4    defaults,nofail,barrier=0   1  2
```

Now that the disk has been configured, close the SSH session.

```bash
exit
```

## Resize VM disk

Once a VM has been deployed, the operating system disk or any attached data disks can be increased in size. Increasing the size of a disk is beneficial when needing more storage space or a higher level of performance (P10, P20, P30). Note, disks cannot be decreased in size.

Before increasing disk size, the Id or name of the disk is needed. Use the [az disk list](/cli/azure/vm/disk#list) command to return all disks in a resource group. Take note of the disk name that you would like to resize.

```azurecli-interactive 
az disk list -g myResourceGroupDisk --query '[*].{Name:name,Gb:diskSizeGb,Tier:accountType}' --output table
```

The VM must also be deallocated. Use the [az vm deallocate]( /cli/azure/vm#deallocate) command to stop and deallocate the VM.

```azurecli-interactive 
az vm deallocate --resource-group myResourceGroupDisk --name myVM
```

Use the [az disk update](/cli/azure/vm/disk#update) command to resize the disk. This example resizes a disk named *myDataDisk* to 1 terabyte.

```azurecli-interactive 
az disk update --name myDataDisk --resource-group myResourceGroupDisk --size-gb 1023
```

Once the resize operation has completed, start the VM.

```azurecli-interactive 
az vm start --resource-group myResourceGroupDisk --name myVM
```

If you’ve resized the operating system disk, the partition is automatically be expanded. If you have resized a data disk, any current partitions need to be expanded in the VMs operating system.

## Snapshot Azure disks

Taking a disk snapshot creates a read only, point-in-time copy of the disk. Azure VM snapshots are useful for quickly saving the state of a VM before making configuration changes. In the event the configuration changes prove to be undesired, VM state can be restored using the snapshot. When a VM has more than one disk, a snapshot is taken of each disk independently of the others. For taking application consistent backups, consider stopping the VM before taking disk snapshots. Alternatively, use the [Azure Backup service](/azure/backup/), which enables you to perform automated backups while the VM is running.

### Create snapshot

Before creating a virtual machine disk snapshot, the Id or name of the disk is needed. Use the [az vm show](https://docs.microsoft.com/en-us/cli/azure/vm#show) command to return the disk id. In this example, the disk id is stored in a variable so that it can be used in a later step.

```azurecli-interactive 
osdiskid=$(az vm show -g myResourceGroupDisk -n myVM --query "storageProfile.osDisk.managedDisk.id" -o tsv)
```

Now that you have the id of the virtual machine disk, the following command creates a snapshot of the disk.

```azurcli
az snapshot create -g myResourceGroupDisk --source "$osdiskid" --name osDisk-backup
```

### Create disk from snapshot

This snapshot can then be converted into a disk, which can be used to recreate the virtual machine.

```azurecli-interactive 
az disk create --resource-group myResourceGroupDisk --name mySnapshotDisk --source osDisk-backup
```

### Restore virtual machine from snapshot

To demonstrate virtual machine recovery, delete the existing virtual machine. 

```azurecli-interactive 
az vm delete --resource-group myResourceGroupDisk --name myVM
```

Create a new virtual machine from the snapshot disk.

```azurecli-interactive 
az vm create --resource-group myResourceGroupDisk --name myVM --attach-os-disk mySnapshotDisk --os-type linux
```

### Reattach data disk

All data disks need to be reattached to the virtual machine.

First find the data disk name using the [az disk list](https://docs.microsoft.com/cli/azure/disk#list) command. This example places the name of the disk in a variable named *datadisk*, which is used in the next step.

```azurecli-interactive 
datadisk=$(az disk list -g myResourceGroupDisk --query "[?contains(name,'myVM')].[name]" -o tsv)
```

Use the [az vm disk attach](https://docs.microsoft.com/cli/azure/vm/disk#attach) command to attach the disk.

```azurecli-interactive 
az vm disk attach –g myResourceGroupDisk –-vm-name myVM –-disk $datadisk
```

## Next steps

In this tutorial, you learned about VM disks topics such as:

> [!div class="checklist"]
> * OS disks and temporary disks
> * Data disks
> * Standard and Premium disks
> * Disk performance
> * Attaching and preparing data disks
> * Resizing disks
> * Disk snapshots

Advance to the next tutorial to learn about automating VM configuration.

> [!div class="nextstepaction"]
> [Automate VM configuration](./tutorial-automate-vm-deployment.md)
