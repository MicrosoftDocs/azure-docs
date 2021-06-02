---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 04/21/2021
 ms.author: rogarana
 ms.custom: include file
---

Incremental snapshots are point in time backups for managed disks that, when taken, consist only of the changes since the last snapshot. When you restore a disk from an incremental snapshot, the system reconstruct the full disk which represents the point in time backup of the disk when the incremental snapshot was taken. This capability for managed disk snapshots potentially allows them to be more cost effective, since, unless you choose to, you do not have to store the entire disk with each individual snapshot. Just like full snapshots, incremental snapshots can be used to either create a full managed disk or a full snapshot. Both full snapshots and incremental snapshots can be used immediately after being taken. In other words, once you take either snapshot, you can immediately read the underlying VHD and use it to restore disks.

There are a few differences between an incremental snapshot and a full snapshot. Incremental snapshots will always use standard HDDs storage, irrespective of the storage type of the disk, whereas full snapshots can use premium SSDs. If you are using full snapshots on Premium Storage to scale up VM deployments, we recommend you use custom images on standard storage in the [Shared Image Gallery](../articles/virtual-machines/shared-image-galleries.md). It will help you achieve a more massive scale with lower cost. Additionally, incremental snapshots potentially offer better reliability with [zone-redundant storage](../articles/storage/common/storage-redundancy.md) (ZRS). If ZRS is available in the selected region, an incremental snapshot will use ZRS automatically. If ZRS is not available in the region, then the snapshot will default to [locally-redundant storage](../articles/storage/common/storage-redundancy.md) (LRS). You can override this behavior and select one manually but, we do not recommend that.

Incremental snapshots also offer a differential capability, only available to managed disks. They enable you to get the changes between two incremental snapshots of the same managed disks, down to the block level. You can use this capability to reduce your data footprint when copying snapshots across regions.  For example, you can download the first incremental snapshot as a base blob in another region. For the subsequent incremental snapshots, you can copy only the changes since the last snapshot to the base blob. After copying the changes, you can take snapshots on the base blob that represent your point in time backup of the disk in another region. You can restore your disk either from the base blob or from a snapshot on the base blob in another region.

:::image type="content" source="media/virtual-machines-disks-incremental-snapshots-description/incremental-snapshot-diagram.png" alt-text="Diagram depicting incremental snapshots copied across regions. Snapshots make various API calls until eventually forming page blobs per each snapshot.":::

Incremental snapshots are billed for the used size only. You can find the used size of your snapshots by looking at the [Azure usage report](../articles/cost-management-billing/understand/review-individual-bill.md). For example, if the used data size of a snapshot is 10 GiB, the **daily** usage report will show 10 GiB/(31 days) = 0.3226 as the consumed quantity.