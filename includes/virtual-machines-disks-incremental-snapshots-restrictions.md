---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 01/18/2023
 ms.author: rogarana
 ms.custom: include file
---

- Incremental snapshots currently can't be moved between subscriptions.
- You can currently only generate SAS URIs of up to five snapshots of a particular snapshot family at any given time.
- You can't create an incremental snapshot for a particular disk outside of that disk's subscription.
- Incremental snapshots can't be moved to another resource group. But, they can be copied to another resource group or region.
- Up to seven incremental snapshots per disk can be created every five minutes.
- A total of 500 incremental snapshots can be created for a single disk.
- You can't get the changes between snapshots taken before and after you changed the size of the parent disk across 4 TB boundary. For example, You took an incremental snapshot `snapshot-a` when the size of a disk was 2 TB. Now you increased the size of the disk to 6 TB and then took another incremental snapshot `snapshot-b`. You can't get the changes between `snapshot-a` and `snapshot-b`. You have to again download the full copy of `snapshot-b` created after the resize. Subsequently, you can get the changes between `snapshot-b` and snapshots created after `snapshot-b`.
- Not currently available for Premium SSD v2 managed disks.
- Available for ultra disks as a public preview and only in Sweden Central and US West 3.
- Incremental snapshots of an Ultra disk can't be used immediately after they're created. The background copy must complete before you can create a disk from the snapshot. See [Check status - CLI](#check-status---cli) or [Check status - PowerShell](#check-status---powershell) for details.