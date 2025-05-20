---
title: Requirements and considerations for Azure NetApp Files cross-region replication 
description: Describes the requirements and considerations for using the volume cross-region replication functionality of Azure NetApp Files.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 05/12/2025
ms.author: anfdocs
---

# Requirements and considerations for Azure NetApp Files cross-region replication

This article describes requirements and considerations about [using the volume cross-region replication](cross-region-replication-create-peering.md) functionality of Azure NetApp Files.

## Requirements and considerations 

* Azure NetApp Files replication is only available in certain fixed region pairs. See [Supported region pairs](cross-region-replication-introduction.md#supported-region-pairs). 
* SMB volumes are supported along with NFS volumes. Replicating SMB volumes requires an Active Directory connection in the source and destination NetApp accounts. The destination AD connection must have access to the DNS servers or AD DS Domain Controllers that are reachable from the delegated subnet in the destination region. For more information, see [Requirements for Active Directory connections](create-active-directory-connections.md#requirements-for-active-directory-connections). 
* Cross-region replication requires a NetApp account in the destination region. 
* The replication destination volume is read-only until you [fail over to the destination region](cross-region-replication-manage-disaster-recovery.md#fail-over-to-destination-volume) to enable the destination volume for read and write. 
    >[!IMPORTANT]
    >Failover is a manual process. When you need to activate the destination volume (for example, when you want to fail over to the destination region), you need to break replication peering then mount the destination volume. For more information, see [fail over to the destination volume](cross-region-replication-manage-disaster-recovery.md#fail-over-to-destination-volume)
    >[!IMPORTANT]
    > A volume with an active backup policy enabled can't be the destination volume in a reverse resync operation. You must suspend the backup policy on the volume prior to starting the reverse resync then resume when the reverse resync completes. 
* Azure NetApp Files replication is supported within a subscription and between subscriptions under the same tenant. You must [register this feature](cross-region-replication-create-peering.md#register-for-cross-subscription-replication) before using it for the first time. 
* See [resource limits](azure-netapp-files-resource-limits.md) for the maximum number of cross-region replication destination volumes. You can open a support ticket to [request a limit increase](azure-netapp-files-resource-limits.md#request-limit-increase) in the default quota of replication destination volumes (per subscription in a region).
* There can be a delay up to five minutes for the interface to reflect a newly added snapshot on the source volume.  
* Cascading and fan-in topologies aren't supported. For support of fan-out deployments, see [configure cross-zone-region replication](cross-zone-region-replication-configure.md#requirements).
* After you set up cross-region replication, the replication process creates *SnapMirror snapshots* to provide references between the source volume and the destination volume. SnapMirror snapshots are cycled automatically when a new one is created for every incremental transfer. You can't delete SnapMirror snapshots until replication relationship and volume is deleted. 
* You can't mount a dual-protocol volume until you [authorize replication from the source volume](cross-region-replication-create-peering.md#authorize-replication-from-the-source-volume) and the initial [transfer](cross-region-replication-display-health-status.md#display-replication-status) happens.
* You can delete manual snapshots on the source volume of a replication relationship when the replication relationship is active or broken, and also after the replication relationship is deleted. You can't delete manual snapshots for the destination volume until the replication relationship is broken.
* You can revert a source or destination volume of a cross-region replication to a snapshot, provided the snapshot is newer than the most recent SnapMirror snapshot. Snapshots older than the SnapMirror snapshot can't be used for a volume revert operation. For more information, see [Revert a volume using snapshot revert](snapshots-revert-volume.md). 
* Data replication volumes support [customer-managed keys](configure-customer-managed-keys.md).
* If you are copying large data sets into a volume that has cross-region replication enabled and you have spare capacity in the capacity pool, you should set the replication interval to 10 minutes, increase the volume size to allow for the changes to be stored, and temporarily disable replication.
* If you use the cool access feature, see [Manage Azure NetApp Files storage with cool access](manage-cool-access.md#considerations) for more considerations.
* [Large volumes](large-volumes-requirements-considerations.md) are supported with cross-region replication only with an hourly or daily replication schedule.
* If the volume's size exceeds 95% utilization, there's a risk that replication to the destination volume can fail depending on the rate of data changes. 

## Next steps

* [Create volume replication](cross-region-replication-create-peering.md)
* [Display health status of replication relationship](cross-region-replication-display-health-status.md)
* [Manage disaster recovery](cross-region-replication-manage-disaster-recovery.md)
* [Volume replication metrics](azure-netapp-files-metrics.md#replication)
* [Delete volume replications or volumes](cross-region-replication-delete.md)
* [Troubleshoot cross-region replication](troubleshoot-cross-region-replication.md)
* [Revert a volume using snapshot revert using Azure NetApp Files](snapshots-revert-volume.md)
* [Test disaster recovery for Azure NetApp Files](test-disaster-recovery.md)
