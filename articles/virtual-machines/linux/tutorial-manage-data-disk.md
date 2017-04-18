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
ms.date: 04/14/2017
ms.author: nepeters
---

# Manage Azure disks with the Azure CLI

In this tutorial, you will learn about the different types of VM disks, how to select a disk configuration, and how to create and attach data disks to Azure virtual machines. This tutorial will also cover taking disk snapshots. 

The steps demonstrated in this tutorial can be completed using the latest [Azure CLI 2.0](/cli/azure/install-azure-cli).

## Default Azure disks

When an Azure virtual machine is created, two disks are automatically created and attached to the virtual machine. 

- **Operating system disk** - Registered as a SATA drive and is labeled /dev/sda by default. This disk should only be used to host the VM operating system.
- **Temporary disk** - Temporary disks use SSD that are stored in the same blade as the VM. This makes temp disks highly performant, however any data stored on a temporary disk may be removed as the VM is moved to a new blade. 

> [!Note]
> Operating system disks are configured for Read/write caching and should not be used to host applications that require performant disk read and write operations. A data disk can be attached to the VM and configured with an application appropriate I/O and cache configuration. 

## Azure data disks

Additional 'data disks' can be added for task such as installing applications and storing data. Each data disk has a maximum capacity of 1023 GB. The size of the virtual machine determines how many data disks you can attach (**cores * 2**) to it and the type of storage you can use to host the disks.

The following table categorizes sizes into use cases, select each type for more detailed information.

| Type | VM Size | Max data disks | Temp disk GiB |
|----|----|----|----|----|
| [General purpose](sizes-general.md) | A and D series | 32 | 800 |
| [Compute optimized](sizes-compute.md) | F series | 32 | 800 |
| [Memory optimized](../virtual-machines-windows-sizes-memory.md) | D and G series | 64 | 6144 |
| [Storage optimized](../virtual-machines-windows-sizes-storage.md) | L series | 64 |
| [GPU](sizes-gpu.md) | N series | |
| [High performance compute](sizes-hpc.md) | A and H series | 32 | 2000 |

MAX IOPS per disk type:

| Type | IOPS |
|----|----|
| HDD | 500 |
| Premium P10 | 500 |
| Premium P20 | 2500 | 
| Premium P10 | 5000 | 

### Disk types

Azure provides two types of disk. Each type can be used as an operating system or data disk. 

- **Standard disk** - Cost effective disk for Dev/Test scenarios.
- **Premium disk** - SSD-based high-performance, low-latency disk. Perfect for VMs running production workload.

## Create and attach disks

Additional disks can be created and attached at VM creation time or to an existing VM. Each of these operations is detailed in this step.

### Attach disk at VM creation

Create a VM using the [az vm create]( /cli/azure/vm#create) command. The `--datadisk-sizes-gb` argument is used to specify that an additional disk should be created and attached to the virtual machine. This operation may take a few minutes to complete. 

```azurecli
az vm create --resource-group myTutorial3 --name myVM --image UbuntuLTS --size Standard_F4s --data-disk-sizes-gb 50 --generate-ssh-keys
```

### Attach disk to existing VM

To create and attach a new disk to an existing virtual machine, use the [az vm disk attach]( /cli/azure/vm/disk#attach) command. The following example creates a premium disk, 100 gigabytes in size, and attaches it to the VM created in the last step. 

```azurecli
az vm disk attach --vm-name myVM --resource-group myTutorial3 --disk myDataDisk --size-gb 100 --sku Premium_LRS --new 
```

## Prepare data disks

Once a disk has been attached to the virtual machine, the operating system needs to be configured to use the disk. The following example shows how to manually configure the first disk added to the VM. This process can also be automated using cloud-init, which is covered in a later tutorial.

Note, this example only shows configuring the first disk created in the previous step. The process would be similar for the second disk.

### Manual configuration

Create an SSH connection with the virtual machine. Replace the example IP address with the public IP of the virtual machine.

```azurecli
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

The disk can now be accesses through the `datadrive` mountpoint, which can be verified by running the `df -h` command. 

```bash
df -h
```

The output shows the new drive mounted on `/datadrive`.

```bash
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        30G  1.4G   28G   5% /
/dev/sdb1       6.8G   16M  6.4G   1% /mnt
/dev/sdc1        50G   52M   47G   1% /datadrive
```

Now that the disk has been configured, close the SSH session.

```bash
exit
```

## Snapshot Azure disks

Taking a disk snapshot creates a read only, point-in-time copy of the disk. For this example, a snapshot of the operating system disk is taken. Azure VM snapshots are useful for quickly saving the state of a VM before making configuration changes. In the event the configuration changes prove to be undesired, VM state can be restored using the snapshot. For taking application consistent backups, use the [Azure Backup service]( /azure/backup/). 

### Create snapshot

Before creating a virtual machine disk snapshot, the Id or name of the disk is needed. Use the [az vm show](https://docs.microsoft.com/en-us/cli/azure/vm#show) command to return the disk id. In this example, the disk id is stored in a variable so that it can be used in a later step.

```azurecli
osdiskid=$(az vm show -g myTutorial3 -n myVM --query "storageProfile.osDisk.managedDisk.id" -o tsv)
```

Now that you have the id of the virtual machine disk, the following command creates a snapshot of the disk.

```azurcli
az snapshot create -g myTutorial3 --source "$osdiskid" --name osDisk-backup
```

### Create disk from snapshot

This snapshot can then be converted into a disk, which can be used to recreate the virtual machine.

```azurecli
az disk create --resource-group myTutorial3 --name mySnapshotDisk --source osDisk-backup
```

### Restore virtual machine from snapshot

To demonstrate virtual machine recovery, delete the existing virtual machine. 

```azurecli
az vm delete --resource-group myTutorial3 --name myVM
```

Create a new virtual machine from the snapshot disk.

```azurecli
az vm create --resource-group myTutorial3 --name myVM --attach-os-disk mySnapshotDisk --os-type linux
```

### Reattach data disk

The data disk can now be reattached to the virtual machine. Note, this example only shows reattaching the first disk created in the previous step. The process would be similar for the second disk.

First find the data disks name using the [az disk list](https://docs.microsoft.com/cli/azure/disk#list) command. This example places the name of the disk in a variable named `datadisk`, which is used in the next step.

```azurecli
datadisk=$(az disk list -g myTutorial3 --query "[?contains(name,'myVM')].[name]" -o tsv)
```

Use the [az vm disk attach](https://docs.microsoft.com/cli/azure/vm/disk#attach) command to attach the disk.

```azurecli
az vm disk attach –g myTutorial3 –-vm-name myVM –-disk $datadisk
```

The disk also needs to be made available to the operating system. To mount the disk, connect to the virtual machine and run `sudo mount /dev/sdc1 /datadrive`, or your preferred disk mounting operation. 

## Next steps

Tutorial - [Automate VM configuration](./tutorial-automate-vm-deployment.md)

Further reading - [Optimize Azure data disks](./optimization.md)