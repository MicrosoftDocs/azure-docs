---
title: Managed Disk Options
description: Learn about volumes (Azure managed disks) within Azure CycleCloud. Understand persistent volumes and disk type options.
author: mvrequa
ms.date: 01/20/2020
ms.author: adjohnso
---

# Managed Disks

CycleCloud will automatically attach volumes ([Azure Managed Disks](https://docs.microsoft.com/azure/virtual-machines/linux/disks-types)) to your nodes for additional storage space. The managed disks come in four flavors and have capacities up to 64TiB.

To create a 100GB volume, add the following to your `[[node]]` element in your cluster template:

``` ini
[[[volume example-vol]]]
Size = 100
```

## Persistent Volumes

By default, a volume will be created when the instance is started, and deleted when the instance is terminated. If you want to preserve the data on the volume even after the instance is terminated, make it a **persistent** volume:

``` ini
[[[volume example-vol]]]
Size = 100
Persistent = true
```

This volume will be created the first time the instance is started, but will not be deleted when the instance is terminated. Instead, it will be kept and re-attached to the instance the next time the node is started. Persistent volumes are not deleted until the cluster is deleted.

> [!WARNING]
> When your cluster is deleted, all persistent volumes are deleted as well! If you want your storage to persist longer than your cluster, you must attach a preexisting volume by ID.

## Disk Types

::: moniker range="=cyclecloud-7"
There are four [Azure disk types](https://docs.microsoft.com/azure/virtual-machines/linux/disks-types). CycleCloud uses standard hard disk drives (HDD) by default. To use a more performant SSD drive for the disk, use `SSD = true`:

``` ini
[[[volume example-vol]]]
Size = 100
Persistent = true
SSD = true
```

A premium SSH disk is used by default when you are using a VM series that is premium storage-compatible.

::: moniker-end
::: moniker range=">=cyclecloud-8"
Azure offers four basic storage options: [Ultra](https://docs.microsoft.com/azure/virtual-machines/windows/disks-types#ultra-disk), [Premium SSD](https://docs.microsoft.com/azure/virtual-machines/windows/disks-types#premium-ssd), [Standard SSD](https://docs.microsoft.com/azure/virtual-machines/windows/disks-types#standard-ssd), and [Standard HDD](https://docs.microsoft.com/azure/virtual-machines/windows/disks-types#standard-hdd).

To specify the storage type to use for your virtual machine, use: `StorageAccountType = [UltraSSD_LRS|Premium_LRS|StandardSSD_LRS|Standard_LRS]` on your volume.

For example:

``` ini
[[[volume example-vol]]]
Size = 100
Persistent = true
StorageAccountType = StandardSSD_LRS
```

For backwards compatibility, `SSD=true` will select `Premium_LRS` or `StandardSSD_LRS` depending on the capabilities of the VM size selected.
::: moniker-end

> [!NOTE]
> Azure SSD will round up to the next size for [pricing](https://azure.microsoft.com/pricing/details/managed-disks). For example, if you create a disk size of 100GB, you will be charged at the 128GB rate.

Specifying a volume attaches the device(s) to your instance, but does not mount and format the device.

## Further Reading

* [Mounting Volumes](mount-disk.md)
* [Creating a Fileserver](create-fileserver.md)
* [Mounting a Fileserver](mount-fileserver.md)