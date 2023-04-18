---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 01/20/2023
 ms.author: rogarana
 ms.custom: include file
---

Incremental snapshots are point-in-time backups for managed disks that, when taken, consist only of the changes since the last snapshot. The first incremental snapshot is a full copy of the disk. The subsequent incremental snapshots occupy only delta changes to disks since the last snapshot. When you restore a disk from an incremental snapshot, the system reconstructs the full disk that represents the point in time backup of the disk when the incremental snapshot was taken. This capability for managed disk snapshots potentially allows them to be more cost-effective, since, unless you choose to, you don't have to store the entire disk with each individual snapshot. Just like full snapshots, incremental snapshots can be used to either create a full managed disk or a full snapshot. Both full snapshots and incremental snapshots can be used immediately after being taken. In other words, once you take either snapshot, you can immediately read the underlying data and use it to restore disks.

There are a few differences between an incremental snapshot and a full snapshot. Incremental snapshots will always use standard HDD storage, irrespective of the storage type of the disk, whereas full snapshots can use premium SSDs. If you're using full snapshots on Premium Storage to scale up VM deployments, we recommend you use custom images on standard storage in the [Azure Compute Gallery](../articles/virtual-machines/shared-image-galleries.md). It will help you achieve a more massive scale with lower cost. Additionally, incremental snapshots potentially offer better reliability with [zone-redundant storage](../articles/storage/common/storage-redundancy.md) (ZRS). If ZRS is available in the selected region, an incremental snapshot will use ZRS automatically. If ZRS isn't available in the region, then the snapshot will default to [locally-redundant storage](../articles/storage/common/storage-redundancy.md) (LRS). You can override this behavior and select one manually but, we don't recommend that.

Incremental snapshots are billed for the used size only. You can find the used size of your snapshots by looking at the [Azure usage report](../articles/cost-management-billing/understand/review-individual-bill.md). For example, if the used data size of a snapshot is 10 GiB, the **daily** usage report will show 10 GiB/(31 days) = 0.3226 as the consumed quantity.
