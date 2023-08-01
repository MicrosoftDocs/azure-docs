---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 06/05/2023
 ms.author: rogarana
 ms.custom: include file, references_regions
---

- Incremental snapshots currently can't be moved between subscriptions.
- You can currently only generate SAS URIs of up to five snapshots of a particular snapshot family at any given time.
- You can't create an incremental snapshot for a particular disk outside of that disk's subscription.
- Incremental snapshots can't be moved to another resource group. But, they can be copied to another resource group or region.
- Up to seven incremental snapshots per disk can be created every five minutes.
- A total of 500 incremental snapshots can be created for a single disk.
- You can't get the changes between snapshots taken before and after you changed the size of the parent disk across 4 TB boundary. For example, You took an incremental snapshot `snapshot-a` when the size of a disk was 2 TB. Now you increased the size of the disk to 6 TB and then took another incremental snapshot `snapshot-b`. You can't get the changes between `snapshot-a` and `snapshot-b`. You have to download the full copy of `snapshot-b` created after the resize. Subsequently, you can get the changes between `snapshot-b` and snapshots created after `snapshot-b`.

### Incremental snapshots of Premium SSD v2 and Ultra Disks

Incremental snapshots of Premium SSD v2 and Ultra Disks have the following extra restrictions:

- You must request and receive access to the feature from this [link](https://aka.ms/UltraPremiumv2SnapshotPreview).
- Snapshots with a 512 logical sector size are stored as VHD, and can be used to create any disk type. Snapshots with a 4096 logical sector size are stored as VHDX and can only be used to create Ultra Disks and Premium SSD v2 disks, they can't be used to create other disk types. To determine which sector size your snapshot is, see [check sector size](#check-sector-size).
- Up to five disks may be simultaneously created from a snapshot of a Premium SSD v2 or an Ultra Disk.
- When an incremental snapshot of either a Premium SSD v2 or an Ultra Disk is created, a background copy process for that disk is started. While a background copy is ongoing, you can have up to three total snapshots pending. The process must complete before any more snapshots of that disk can be created.
- Incremental snapshots of a Premium SSD v2 or an Ultra disk can't be used immediately after they're created. The background copy must complete before you can create a disk from the snapshot. See [Check status of snapshots or disks](#check-status-of-snapshots-or-disks) for details.
- Disks created from an incremental snapshot of a Premium SSD v2 or an Ultra Disk can't be immediately attached to a VM once it's created. The background copy must complete before it can be attached. See [Check disk creation status](#check-disk-creation-status) for details.

> [!NOTE]
> Normally, when you take an incremental snapshot, and there aren't any changes, the size of that snapshot is 0 MiB. Currently, empty snapshots of disks with a 4096 logical sector size instead have a size of 6 MiB, when they'd normally be 0 MiB.

#### Regional availability

Incremental snapshots of Premium SSD v2 and Ultra Disks are currently available in the following regions:

- Incremental snapshots of Ultra Disks are currently only available in North Europe, West Europe, Sweden Central, East US, East US 2, North Central US, South Central US, and West US 2.
- Incremental snapshots of Premium SSD v2 disks are currently only available in North Europe, West Europe, Central US, East US, East US 2, West US 2.
