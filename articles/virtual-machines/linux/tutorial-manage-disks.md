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
ms.date: 04/21/2017
ms.author: nepeters
---

# Manage Azure disks with the Azure CLI

In this tutorial, you will learn about the different types of VM disks, how to select a disk configuration, and how to create and attach data disks to Azure virtual machines. This tutorial also covers taking disk snapshots. 

The steps in this tutorial can be completed using the latest [Azure CLI 2.0](/cli/azure/install-azure-cli).

## Default Azure disks

When an Azure virtual machine is created, two disks are automatically attached to the virtual machine. 

**Operating system disk** - Operating system disk are 1023 gigabytes in size and host the operating system. The OS disk is labeled `/dev/sda` by default. For optimal VM performance, the operating system disk should not host applications or data.

**Temporary disk** - Temporary disks use a solid-state drive that is located on the same Azure host as the VM. Temp disks are highly performant, however any data stored on a temporary disk may be removed if the VM is moved to a new host. The size of the temporary disk is determined by the VM size. Temporary disks are labeled `/dev/sdb` by default and are mounted to `/mnt`.

### Temporary disk sizes

| Type | VM Size | Max temp disk size |
|----|----|----|
| [General purpose](sizes-general.md) | A and D series | 800 |
| [Compute optimized](sizes-compute.md) | F series | 800 |
| [Memory optimized](../virtual-machines-windows-sizes-memory.md) | D and G series | 6144 |
| [Storage optimized](../virtual-machines-windows-sizes-storage.md) | L series | 5630 |
| [GPU](sizes-gpu.md) | N series | 1440 |
| [High performance](sizes-hpc.md) | A and H series | 2000 |

## Azure data disks

Additional data disks can be added for installing applications and storing data. Each data disk has a maximum capacity of 1023 GB. The size of the virtual machine determines how many data disks can be attached to a VM. For each VM core, two data disks can be attached. 

### Max data disks

| Type | VM Size | Max data disks |
|----|----|----|
| [General purpose](sizes-general.md) | A and D series | 32 |
| [Compute optimized](sizes-compute.md) | F series | 32 |
| [Memory optimized](../virtual-machines-windows-sizes-memory.md) | D and G series | 64 |
| [Storage optimized](../virtual-machines-windows-sizes-storage.md) | L series | 64 |
| [GPU](sizes-gpu.md) | N series | 48 |
| [High performance](sizes-hpc.md) | A and H series | 32 |

## Disk types

Azure provides two types of disk. Each type can be used as an operating system or data disk. 

### Standard disk

Standard Storage is backed by HDDs, and delivers cost-effective storage while still being performant. Standard disks are ideal for a cost effective dev and test workload.

### Premium disk

SSD-based high-performance, low-latency disk. Perfect for VMs running production workload. Premium Storage supports DS-series, DSv2-series, GS-series, and Fs-series VMs. Premium disks come in three types (P10, P20, P30), the size of the disk determines the disk type.

### Premium disk performance

|Premium storage disk type | P10 | P20 | P30 |
| --- | --- | --- | --- |
| Disk size (round up) | 128 GB | 512 GB | 1,024 GB (1 TB) |
| IOPS per disk | 500 | 2,300 | 5,000 |
Throughput per disk | 100 MB/s | 150 MB/s | 200 MB/s |

## Create and attach disks

Additional disks can be created and attached at VM creation time or to an existing VM. Each of these operations is detailed in this step.

### Attach disk at VM creation

Create a resource group with the [az group create](https://docs.microsoft.com/cli/azure/group#create) command. 

```azurecli
az group create --name myRGVMDisks --location westus
```

Create a VM using the [az vm create]( /cli/azure/vm#create) command. The `--datadisk-sizes-gb` argument is used to specify that an additional disk should be created and attached to the virtual machine. This operation may take a few minutes to complete.

```azurecli
az vm create --resource-group myRGVMDisks --name myVM --image UbuntuLTS --size Standard_F4s --data-disk-sizes-gb 50 --generate-ssh-keys
```

### Attach disk to existing VM

To create and attach a new disk to an existing virtual machine, use the [az vm disk attach]( /cli/azure/vm/disk#attach) command. The following example creates a premium disk, 100 gigabytes in size, and attaches it to the VM created in the last step. 

```azurecli
az vm disk attach --vm-name myVM --resource-group myRGVMDisks --disk myDataDisk --size-gb 100 --sku Premium_LRS --new 
```

## Prepare data disks

Once a disk has been attached to the virtual machine, the operating system needs to be configured to use the disk. The following example shows how to manually configure a disk. This process can also be automated using cloud-init, which is covered in a later tutorial.

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

To ensure that the drive is remounted after a reboot, it must be added to the `/stc/fstab` file. To do so, get the UUIS of the disk with the `blkid` utility.

```bash
sudo -i blkid
```

The output will display the UUID of the drive, `/dev/sdc1` in this case.

```bash
/dev/sdc1: UUID="33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e" TYPE="ext4"
```

Add a line similar to the following to the `/etc/fstab` file. Also note that write barriers can be disabled on Azure using `barrier=0`, this will improve disk performance. 

```bash
UUID=33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e   /datadrive   ext4   defaults,nofail,barrier=0   1   2
```

Now that the disk has been configured, close the SSH session.

```bash
exit
```

## Snapshot Azure disks

Taking a disk snapshot creates a read only, point-in-time copy of the disk. Azure VM snapshots are useful for quickly saving the state of a VM before making configuration changes. In the event the configuration changes prove to be undesired, VM state can be restored using the snapshot. When a VM has more than one disk, a snapshot is taken of each disk independently of the others. This independence can lead to consistency issues. For taking application consistent backups, use the [Azure Backup service]( /azure/backup/). 

### Create snapshot

Before creating a virtual machine disk snapshot, the Id or name of the disk is needed. Use the [az vm show](https://docs.microsoft.com/en-us/cli/azure/vm#show) command to return the disk id. In this example, the disk id is stored in a variable so that it can be used in a later step.

```azurecli
osdiskid=$(az vm show -g myRGVMDisks -n myVM --query "storageProfile.osDisk.managedDisk.id" -o tsv)
```

Now that you have the id of the virtual machine disk, the following command creates a snapshot of the disk.

```azurcli
az snapshot create -g myRGVMDisks --source "$osdiskid" --name osDisk-backup
```

### Create disk from snapshot

This snapshot can then be converted into a disk, which can be used to recreate the virtual machine.

```azurecli
az disk create --resource-group myRGVMDisks --name mySnapshotDisk --source osDisk-backup
```

### Restore virtual machine from snapshot

To demonstrate virtual machine recovery, delete the existing virtual machine. 

```azurecli
az vm delete --resource-group myRGVMDisks --name myVM
```

Create a new virtual machine from the snapshot disk.

```azurecli
az vm create --resource-group myRGVMDisks --name myVM --attach-os-disk mySnapshotDisk --os-type linux
```

### Reattach data disk

All data disk need to be reattached to the virtual machine.

First find the data disks name using the [az disk list](https://docs.microsoft.com/cli/azure/disk#list) command. This example places the name of the disk in a variable named `datadisk`, which is used in the next step.

```azurecli
datadisk=$(az disk list -g myRGVMDisks --query "[?contains(name,'myVM')].[name]" -o tsv)
```

Use the [az vm disk attach](https://docs.microsoft.com/cli/azure/vm/disk#attach) command to attach the disk.

```azurecli
az vm disk attach –g myRGVMDisks –-vm-name myVM –-disk $datadisk
```

The disk also needs to be mounted with the operating system. To mount the disk, connect to the virtual machine and run `sudo mount /dev/sdc1 /datadrive`, or your preferred disk mounting operation. 

## Next steps

Tutorial - [Automate VM configuration](./tutorial-automate-vm-deployment.md)

Further reading - [Optimize Azure data disks](./optimization.md)