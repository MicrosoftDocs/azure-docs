---
title: Tutorial - Manage Azure disks with the Azure CLI 
description: In this tutorial, you learn how to use the Azure CLI to create and manage Azure disks for virtual machines
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: gwallace

tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.topic: tutorial
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 11/14/2018
ms.author: cynthn
ms.custom: mvc
ms.subservice: disks

#Customer intent: As an IT administrator, I want to learn about Azure Managed Disks so that I can create and manage storage for Linux VMs in Azure.
---

# Tutorial - Manage Azure disks with the Azure CLI

Azure virtual machines (VMs) use disks to store the operating system, applications, and data. When you create a VM, it is important to choose a disk size and configuration appropriate to the expected workload. This tutorial shows you how to deploy and manage VM disks. You learn about:

> [!div class="checklist"]
> * OS disks and temporary disks
> * Data disks
> * Standard and Premium disks
> * Disk performance
> * Attaching and preparing data disks
> * Disk snapshots


## Default Azure disks

When an Azure virtual machine is created, two disks are automatically attached to the virtual machine.

**Operating system disk** - Operating system disks can be sized up to 2 TB, and hosts the VMs operating system. The OS disk is labeled */dev/sda* by default. The disk caching configuration of the OS disk is optimized for OS performance. Because of this configuration, the OS disk **should not** be used for applications or data. For applications and data, use data disks, which are detailed later in this tutorial.

**Temporary disk** - Temporary disks use a solid-state drive that is located on the same Azure host as the VM. Temp disks are highly performant and may be used for operations such as temporary data processing. However, if the VM is moved to a new host, any data stored on a temporary disk is removed. The size of the temporary disk is determined by the VM size. Temporary disks are labeled */dev/sdb* and have a mountpoint of */mnt*.

## Azure data disks

To install applications and store data, additional data disks can be added. Data disks should be used in any situation where durable and responsive data storage is desired. The size of the virtual machine determines how many data disks can be attached to a VM.

## VM disk types

Azure provides two types of disks, standard and Premium.

### Standard disk

Standard Storage is backed by HDDs, and delivers cost-effective storage while still being performant. Standard disks are ideal for a cost effective dev and test workload.

### Premium disk

Premium disks are backed by SSD-based high-performance, low-latency disk. Perfect for VMs running production workload. Premium Storage supports DS-series, DSv2-series, GS-series, and FS-series VMs. When you select a disk size, the value is rounded up to the next type. For example, if the disk size is less than 128 GB, the disk type is P10. If the disk size is between 129 GB and 512 GB, the size is a P20. Over, 512 GB, the size is a P30.

### Premium disk performance
[!INCLUDE [disk-storage-premium-ssd-sizes](../../../includes/disk-storage-premium-ssd-sizes.md)]

While the above table identifies max IOPS per disk, a higher level of performance can be achieved by striping multiple data disks. For instance, a Standard_GS5 VM can achieve a maximum of 80,000 IOPS. For detailed information on max IOPS per VM, see [Linux VM sizes](sizes.md).

## Launch Azure Cloud Shell

Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open Cloud Shell, select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/powershell](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

## Create and attach disks

Data disks can be created and attached at VM creation time or to an existing VM.

### Attach disk at VM creation

Create a resource group with the [az group create](/cli/azure/group#az-group-create) command.

```azurecli-interactive
az group create --name myResourceGroupDisk --location eastus
```

Create a VM using the [az vm create](/cli/azure/vm#az-vm-create) command. The following example creates a VM named *myVM*, adds a user account named *azureuser*, and generates SSH keys if they do not exist. The `--datadisk-sizes-gb` argument is used to specify that an additional disk should be created and attached to the virtual machine. To create and attach more than one disk, use a space-delimited list of disk size values. In the following example, a VM is created with two data disks, both 128 GB. Because the disk sizes are 128 GB, these disks are both configured as P10s, which provide maximum 500 IOPS per disk.

```azurecli-interactive
az vm create \
  --resource-group myResourceGroupDisk \
  --name myVM \
  --image UbuntuLTS \
  --size Standard_DS2_v2 \
  --generate-ssh-keys \
  --data-disk-sizes-gb 128 128
```

### Attach disk to existing VM

To create and attach a new disk to an existing virtual machine, use the [az vm disk attach](/cli/azure/vm/disk#az-vm-disk-attach) command. The following example creates a premium disk, 128 gigabytes in size, and attaches it to the VM created in the last step.

```azurecli-interactive
az vm disk attach \
    --resource-group myResourceGroupDisk \
    --vm-name myVM \
    --name myDataDisk \
    --size-gb 128 \
    --sku Premium_LRS \
    --new
```

## Prepare data disks

Once a disk has been attached to the virtual machine, the operating system needs to be configured to use the disk. The following example shows how to manually configure a disk. This process can also be automated using cloud-init, which is covered in a [later tutorial](./tutorial-automate-vm-deployment.md).


Create an SSH connection with the virtual machine. Replace the example IP address with the public IP of the virtual machine.

```console
ssh 10.101.10.10
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

Add a line similar to the following to the */etc/fstab* file.

```bash
UUID=33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e   /datadrive  ext4    defaults,nofail   1  2
```

Now that the disk has been configured, close the SSH session.

```bash
exit
```

## Take a disk snapshot

When you take a disk snapshot, Azure creates a read only, point-in-time copy of the disk. Azure VM snapshots are useful to quickly save the state of a VM before you make configuration changes. In the event of an issue or error, VM can be restored using a snapshot. When a VM has more than one disk, a snapshot is taken of each disk independently of the others. To take application consistent backups, consider stopping the VM before you take disk snapshots. Alternatively, use the [Azure Backup service](/azure/backup/), which enables you to perform automated backups while the VM is running.

### Create snapshot

Before you create a virtual machine disk snapshot, the ID or name of the disk is needed. Use the [az vm show](/cli/azure/vm#az-vm-show) command to return the disk ID. In this example, the disk ID is stored in a variable so that it can be used in a later step.

```azurecli-interactive
osdiskid=$(az vm show \
   -g myResourceGroupDisk \
   -n myVM \
   --query "storageProfile.osDisk.managedDisk.id" \
   -o tsv)
```

Now that you have the ID of the virtual machine disk, the following command creates a snapshot of the disk.

```azurecli-interactive
az snapshot create \
    --resource-group myResourceGroupDisk \
    --source "$osdiskid" \
    --name osDisk-backup
```

### Create disk from snapshot

This snapshot can then be converted into a disk, which can be used to recreate the virtual machine.

```azurecli-interactive
az disk create \
   --resource-group myResourceGroupDisk \
   --name mySnapshotDisk \
   --source osDisk-backup
```

### Restore virtual machine from snapshot

To demonstrate virtual machine recovery, delete the existing virtual machine.

```azurecli-interactive
az vm delete \
--resource-group myResourceGroupDisk \
--name myVM
```

Create a new virtual machine from the snapshot disk.

```azurecli-interactive
az vm create \
    --resource-group myResourceGroupDisk \
    --name myVM \
    --attach-os-disk mySnapshotDisk \
    --os-type linux
```

### Reattach data disk

All data disks need to be reattached to the virtual machine.

First find the data disk name using the [az disk list](/cli/azure/disk#az-disk-list) command. This example places the name of the disk in a variable named *datadisk*, which is used in the next step.

```azurecli-interactive
datadisk=$(az disk list \
   -g myResourceGroupDisk \
   --query "[?contains(name,'myVM')].[id]" \
   -o tsv)
```

Use the [az vm disk attach](/cli/azure/vm/disk#az-vm-disk-attach) command to attach the disk.

```azurecli-interactive
az vm disk attach \
   –g myResourceGroupDisk \
   --vm-name myVM \
   --name $datadisk
```

## Next steps

In this tutorial, you learned about VM disks topics such as:

> [!div class="checklist"]
> * OS disks and temporary disks
> * Data disks
> * Standard and Premium disks
> * Disk performance
> * Attaching and preparing data disks
> * Disk snapshots

Advance to the next tutorial to learn about automating VM configuration.

> [!div class="nextstepaction"]
> [Automate VM configuration](./tutorial-automate-vm-deployment.md)
