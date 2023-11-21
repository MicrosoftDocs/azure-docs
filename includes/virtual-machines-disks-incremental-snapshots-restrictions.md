---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 11/17/2023
 ms.author: rogarana
 ms.custom: include file
---

- Incremental snapshots currently can't be moved between subscriptions.
- You can currently only generate SAS URIs of up to five snapshots of a particular snapshot family at any given time.
- You can't create an incremental snapshot for a particular disk outside of that disk's subscription.
- Incremental snapshots can't be moved to another resource group. But, they can be copied to another resource group or region.
- Up to seven incremental snapshots per disk can be created every five minutes.
- A total of 500 incremental snapshots can be created for a single disk.
- You can't get the changes between snapshots taken before and after you changed the size of the parent disk across 4-TB boundary. For example, You took an incremental snapshot `snapshot-a` when the size of a disk was 2 TB. Now you increased the size of the disk to 6 TB and then took another incremental snapshot `snapshot-b`. You can't get the changes between `snapshot-a` and `snapshot-b`. You have to download the full copy of `snapshot-b` created after the resize. Subsequently, you can get the changes between `snapshot-b` and snapshots created after `snapshot-b`.
- When you create a managed disk from a snapshot, it starts a background copy process. You can attach a disk to a VM while this process is running but you'll experience [performance impact](../articles/virtual-machines/premium-storage-performance.md#latency). You can use CompletionPercent property to [check the status of the background copy](../articles/virtual-machines/scripts/create-managed-disk-from-snapshot.md#check-disk-status) for Ultra Disks and Premium SSD v2 disks.

### Incremental snapshots of Premium SSD v2 and Ultra Disks

Incremental snapshots of Premium SSD v2 and Ultra Disks have the following extra restrictions:

- Snapshots with a 512 logical sector size are stored as VHD, and can be used to create any disk type. Snapshots with a 4096 logical sector size are stored as VHDX and can only be used to create Ultra Disks and Premium SSD v2 disks, they can't be used to create other disk types. To determine which sector size your snapshot is, see [check sector size](#check-sector-size).
- Up to five disks may be simultaneously created from a snapshot of a Premium SSD v2 or an Ultra Disk.
- When an incremental snapshot of either a Premium SSD v2 or an Ultra Disk is created, a background copy process for that disk is started. While a background copy is ongoing, you can have up to three total snapshots pending. The process must complete before any more snapshots of that disk can be created.
- Incremental snapshots of a Premium SSD v2 or an Ultra disk can't be used immediately after they're created. The background copy must complete before you can create a disk from the snapshot. See [Check snapshot status](#check-snapshot-status) for details.
- Taking increment snapshots of a Premium SSD v2 or an Ultra disk while the CompletionPercent property of the disk hasn't reached 100 isn't supported.
- When you attach a Premium SSD v2 or Ultra disk created from snapshot to a running Virtual Machine while CompletionPercnet property hasn't reached 100, the disk suffers performance impact. Specifically, if the disk has a 4k sector size, it may experience slower read. If the disk has a 512e sector size, it may experience slower read and write. To track the progress of this background copy process, see the the check disk status section of either the Azure [PowerShell sample](../articles/virtual-machines/scripts/virtual-machines-powershell-sample-create-managed-disk-from-snapshot.md#check-disk-status) or the [Azure CLI sample](../articles/virtual-machines/scripts/create-managed-disk-from-snapshot.md#check-disk-status).

> [!NOTE]
> Normally, when you take an incremental snapshot, and there aren't any changes, the size of that snapshot is 0 MiB. Currently, empty snapshots of disks with a 4096 logical sector size instead have a size of 6 MiB, when they'd normally be 0 MiB.
