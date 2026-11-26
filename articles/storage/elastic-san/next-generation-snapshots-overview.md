---
title: Azure Elastic SAN Next Generation Preview snapshots overview
description: Learn how Azure Elastic SAN Next Generation Preview snapshots work, including instant access, background copy, capacity, billing, retention, and deletion behavior.
author: normesta
ms.service: azure-elastic-san
ms.topic: concept-article
ms.date: 11/04/2026
ms.author: chenannie
# Customer intent: "As a cloud administrator, I want to understand Azure Elastic SAN Next Generation snapshots so that I can plan snapshot creation, restoration, retention, and deletion."
---

# Azure Elastic SAN Next Generation snapshots overview

Azure Elastic SAN Next Generation volume snapshots provide point-in-time backup and recovery options to protect your workload data. You can use snapshots to create new volumes for recovery, testing, or other workflows without changing the source volume.

Azure Elastic SAN Next Generation snapshots are incremental. The first snapshot contains the used data on the volume. Each subsequent snapshot stores only the changes since the previous snapshot, which reduces the amount of storage that a series of snapshots consumes.

You can't use snapshots to overwrite or change an existing volume. You can only create a new volume from the snapshot or export it to a managed disk snapshot.

> [!IMPORTANT]
> Azure Elastic SAN Next Generation is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Snapshot differences between Elastic SAN

Azure Elastic SAN Next Generation snapshots differ from Azure Elastic SAN (Classic) snapshots in how Azure stores, bills, and retains them.

| Capability | Azure Elastic SAN Next Generation snapshot | Azure Elastic SAN (Classic) snapshot |
| --- | --- | --- |
| Creating a volume | Available immediately during the five-hour instant-access period. If the period expires before the background copy finishes, volume creation is unavailable until the background copy finishes. | Available immediately, no background copy. |
| Source dependency | Depends on the source volume until the background copy finishes. | Always associated with the source volume. |
| Source volume deletion | After the background copy finishes, force-deleting the source volume preserves its durable snapshots. A standard delete fails while the volume has snapshots. | Deleting the source volume also deletes its snapshots. |
| Capacity and billing | During the instant-access period, the snapshot's used capacity counts toward the Elastic SAN's used capacity. After instant access, snapshots don't consume the Elastic SAN's used capacity and are billed separately based on used capacity. The first snapshot stores the volume's used data, and each subsequent snapshot stores only changes since the previous snapshot. | Snapshots reside on the Elastic SAN and don’t incur separate capacity or billing. The first snapshot doesn't consume additional SAN capacity. Each subsequent snapshot consumes SAN capacity for changes since the previous snapshot. Snapshots don't incur a separate charge. |

## Instant access and background copy

When you create an Elastic SAN Next Generation volume snapshot, you can instantly use the snapshot to create a new volume while the system copies its data to a lower-cost durable storage in the background. Instant access snapshots aren't a separate snapshot resource class to manage. They're incremental snapshots that temporarily enter the **InstantAccess** state for five hours. Volumes created from instant access snapshots rapidly hydrate with minimal performance impact and you can attach them to a running VM immediately.

After five hours, the snapshot automatically leaves the **InstantAccess** state. If the background data copy is still in progress, you must wait for it to complete to use the snapshot. You can monitor a snapshot's background data copy progress by checking the `SnapshotAccessState` property. This property indicates the snapshot's current access state and its readiness for operations.

Until the background data copy finishes, snapshots in the **InstantAccess** state depend on the availability of the source volume and don't provide protection against source volume failures. After the background copy completes, the snapshot lifecycle is independent of the source volume.

| **SnapshotAccessState** | **Description** | **Applies to** |
| --- | --- | --- |
| **Pending** | You can't use this snapshot to create a new volume or export it to a managed disk snapshot. | When background copy is still in progress after five-hours instant access period. |
| **Available** | You can use this snapshot to create a new volume (with a performance impact) or export it to a managed disk snapshot. | When the background copy completes. |
| **InstantAccess** | You can use this snapshot to create a rapidly hydrated volume with minimal performance impact, but you can't export the snapshot to a managed disk snapshot. | When the instant access duration hasn't lapsed and the background copy is ongoing. |
| **AvailableWithInstantAccess** | You can use this snapshot to create a rapidly hydrated disk with minimal performance impact, and you can export the snapshot to a managed disk snapshot. | When the instant access duration hasn't lapsed and the background data copy has completed. |

## Snapshot capacity and billing

Azure stores the durable snapshots in a lower-cost storage, and bills those snapshots separately from your Elastic SAN's provisioned capacity and at a lower rate. Azure bills snapshots based on the used capacity. 

During the snapshot's instant-access period, two components can incur additional resources: a potential storage increase and a one-time restore fee.
- Storage increase: When you create a snapshot, it starts at zero capacity, as it references the source disk as its base. As data on the source disk changes or is deleted over time, the snapshot preserves the original point-in-time state, and its used capacity grows accordingly. This capacity counts toward the parent Elastic SAN's used capacity, and there's no additional charge. 
- Restore charge: Each time you restore a volume from an instant access snapshot, Azure applies a one-time restore operation fee. Azure calculates this fee based on the used size of the source volume at the time of snapshot creation.
 
For more information, see [Azure Elastic SAN pricing](https://azure.microsoft.com/pricing/details/elastic-san/).


## Snapshot retention and source-resource deletion

Azure retains a snapshot until you delete it. You can delete a snapshot without changing its source volume. To retain snapshot data outside the Elastic SAN, export the volume snapshot to a managed disk snapshot. Export time depends on the snapshot size, and the resulting managed disk snapshot incurs separate managed disk snapshot charges.

Deleting a source volume, volume group, or Elastic SAN that contains snapshots has different results depending on whether the background copy is complete. 

| Resource and snapshot state | Standard delete | Force delete |
| --- | --- | --- |
| Source volume with completed background copy | Fails while the volume has snapshots. | Deletes the source volume and associated instant access snapshots, but preserves its durable snapshots that have completed. |
| Source volume with background copy in progress | Fails while background copy is in progress. | Deletes the source volume, instant access snapshot, and in-progress durable snapshots. The snapshots data is lost. |
| Elastic SAN or volume group without any snapshot export in-process | Fails while the resource contains any volumes or snapshots. | Deletes all resources, including the source volume, instant-access snapshots, and in-progress durable snapshots. The snapshots data is lost. Confirm you no longer need any snapshot data or export volume snapshots to managed disk snapshots before deletion. |
| Elastic SAN or volume group with snapshot export in-process | Fails while the resource contains the source snapshot. | Also fails while the resource contains the source snapshot. |

Before you force-delete a source volume, volume group, or Elastic SAN, check whether snapshot background copy is completed and confirm that you no longer need any snapshot data that the operation deletes. You can use `CompletionPercent` property to check the status of the background copy. The background copy is complete when the value reaches 100.

## Limitations

- You can have up to 200 snapshots per volume.
- You can create up to seven snapshots per volume every five minutes.
- The instant-access period lasts five hours and currently can't be configured.
- You can create a volume from a snapshot only in the same region and subscription as the snapshot.
- A snapshot with a background copy in progress depends on its source volume. It doesn't protect against a failure of the source volume until the background copy finishes.
  - Check the `CompletionPercent` property of the snapshot. If it's below 100, the background copy is still ongoing.
- You can't get a SAS URI for a volume snapshot.
- You can simultaneously create up to five volumes from a snapshot once the background copy completes.
- You can create up to fifteen volumes concurrently from all instant access snapshots of an individual volume.
- You can't use an instant access snapshot to create a volume larger than the snapshot's size.
- A volume can have up to three snapshot background copy operations in progress. You must wait for one of the background copies to finish before you create another snapshot.
- If a volume is being hydrated from a snapshot, you can't create an instant access snapshot of that volume.
- If you increase the size of a volume, any of its snapshots with a background copy in progress fail.
- You can't update encryption settings while a snapshot background copy is in progress.
- You can have up to 50 active background copies per subscription.

## Next steps

- [Manage Azure Elastic SAN Next Generation Preview snapshots](next-generation-manage-snapshots.md)
- [Explore partner backup and recovery solutions](next-generation-backup-solutions.md)
