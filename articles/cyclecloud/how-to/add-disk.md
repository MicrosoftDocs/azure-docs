---
title: Managed Disk Options
description: Learn about volumes (Azure managed disks) within Azure CycleCloud. Understand persistent volumes and disk type options.
author: mvrequa
ms.date: 06/30/2025
ms.author: adjohnso
---

# Managed Disks

CycleCloud automatically attaches volumes ([Azure Managed Disks](/azure/virtual-machines/linux/disks-types)) to your nodes for extra storage space. Managed disks come in four types and have capacities up to 64 TiB.

To create a 100 GB volume, add the following code to your `[[node]]` element in your cluster template:

``` ini
[[[volume example-vol]]]
Size = 100
```

## Persistent volumes

By default, the volume is created when the instance starts and deleted when the instance terminates. To preserve the data on the volume even after the instance terminates, make it a **persistent** volume:

``` ini
[[[volume example-vol]]]
Size = 100
Persistent = true
```

This volume is created the first time the instance starts but isn't deleted when the instance terminates. Instead, the volume is kept and reattached to the instance the next time the node starts. Persistent volumes are deleted only when the cluster is deleted.

> [!WARNING]
> When you delete your cluster, you also delete all persistent volumes. To keep your storage available after your cluster is deleted, attach a preexisting volume by ID.

## Disk types

::: moniker range="=cyclecloud-7"
There are four [Azure disk types](/azure/virtual-machines/linux/disks-types). CycleCloud uses standard hard disk drives (HDD) by default. To use a more performant SSD drive for the disk, set `SSD` to `true`:

``` ini
[[[volume example-vol]]]
Size = 100
Persistent = true
SSD = true
```

When you use a VM series that works with premium storage, the default is a premium SSH disk.

::: moniker-end
::: moniker range=">=cyclecloud-8"
Azure offers four basic storage options: [Ultra](/azure/virtual-machines/windows/disks-types#ultra-disk), [Premium SSD](/azure/virtual-machines/windows/disks-types#premium-ssd), [Standard SSD](/azure/virtual-machines/windows/disks-types#standard-ssd), and [Standard HDD](/azure/virtual-machines/windows/disks-types#standard-hdd).

To specify the storage type for your virtual machine, use: `StorageAccountType = [UltraSSD_LRS|Premium_LRS|StandardSSD_LRS|Standard_LRS]` on your volume.

For example:

``` ini
[[[volume example-vol]]]
Size = 100
Persistent = true
StorageAccountType = StandardSSD_LRS
```

For backward compatibility, `SSD=true` selects `Premium_LRS` or `StandardSSD_LRS` depending on the capabilities of the VM size you select.
::: moniker-end

> [!NOTE]
> For [pricing](https://azure.microsoft.com/pricing/details/managed-disks), Azure SSD rounds up to the next size. For example, if you create a disk size of 100 GB, you pay at the 128 GB rate.

When you specify a volume, you attach the devices to your instance but don't mount or format the device.

## Further reading

* [Mounting Volumes](mount-disk.md)
* [Creating a Fileserver](create-fileserver.md)
* [Mounting a Fileserver](mount-fileserver.md)