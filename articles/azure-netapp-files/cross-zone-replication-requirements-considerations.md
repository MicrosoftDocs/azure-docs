---
title: Requirements and considerations for Azure NetApp Files cross-zone replication | Microsoft Docs
description: Describes the requirements and considerations for using the volume cross-zone replication functionality of Azure NetApp Files.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 08/18/2023
ms.author: anfdocs
---
# Requirements and considerations for using cross-zone replication 

This article describes requirements and considerations about [using the volume cross-zone replication](create-cross-zone-replication.md) functionality of Azure NetApp Files.

## Requirements and considerations 

* The cross-zone replication feature uses the [availability zone volume placement feature](use-availability-zones.md) of Azure NetApp Files.
    * You can only use cross-zone replication in regions that support the availability zone volume placement. [!INCLUDE [Azure NetApp Files cross-zone-replication supported regions](includes/cross-zone-regions.md)]
* To establish cross-zone replication, you must create the source volume in an availability zone.  
* You can’t use cross-zone replication and cross-region replication together on the same source volume.
* You can use cross-zone replication with SMB and NFS volumes. Replication of SMB volumes requires an Active Directory connection in the source and destination NetApp accounts. The destination AD connection must have access to the DNS servers or AD DS Domain Controllers that are reachable from the delegated subnet in the destination zone. For more information, see [Requirements for Active Directory connections](create-active-directory-connections.md#requirements-for-active-directory-connections). 
* The destination account must be in a different zone from the source volume zone. You can also select an existing NetApp account in a different zone.  
* The replication destination volume is read-only until you fail over to the destination zone to enable the destination volume for read and write. For more information about the failover process, see [fail over to the destination volume](cross-region-replication-manage-disaster-recovery.md#fail-over-to-destination-volume).
    >[!IMPORTANT]
    >Failover is a manual process. When you need to activate the destination volume (for example, when you want to fail over to the destination region), you need to break replication peering then mount the destination volume. For more information, see [fail over to the destination volume](cross-region-replication-manage-disaster-recovery.md#fail-over-to-destination-volume)
* Azure NetApp Files replication doesn't currently support multiple subscriptions; all replications must be performed under a single subscription.
* See [resource limits](azure-netapp-files-resource-limits.md) for the maximum number of cross-zone destination volumes. You can open a support ticket to [request a limit increase](azure-netapp-files-resource-limits.md#request-limit-increase) in the default quota of replication destination volumes (per subscription in a region). 
* There can be a delay up to five minutes for the interface to reflect a newly added snapshot on the source volume.  
* Cross-zone replication does not support cascading and fan in/out topologies.
* After you set up cross-zone replication, the replication process creates *SnapMirror snapshots* to provide references between the source volume and the destination volume. SnapMirror snapshots are cycled automatically when a new one is created for every incremental transfer. You cannot delete SnapMirror snapshots until you delete the replication relationship and volume. 
* You cannot mount a dual-protocol volume until you [authorize replication from the source volume](cross-region-replication-create-peering.md#authorize-replication-from-the-source-volume) and the initial [transfer](cross-region-replication-display-health-status.md#display-replication-status) happens.
* You can delete manual snapshots on the source volume of a replication relationship when the replication relationship is active or broken, and also after you've deleted replication relationship. You cannot delete manual snapshots for the destination volume until you break the replication relationship.
* When reverting a source volume with an active volume replication relationship, only snapshots that are more recent than the SnapMirror snapshot can be used in the revert operation. For more information, see [Revert a volume using snapshot revert with Azure NetApp Files](snapshots-revert-volume.md).
* Data replication volumes support [customer-managed keys](configure-customer-managed-keys.md).
* [Large volumes](large-volumes-requirements-considerations.md) are supported with cross-zone replication only with an hourly or daily replication schedule.

## Large volumes configuration

[Large volumes](azure-netapp-files-understand-storage-hierarchy.md#large-volumes) are supported in cross-zone replication. You must [first register for the large volumes feature](large-volumes-requirements-considerations.md#register-the-feature) then register to use large volumes with cross-zone replication:

>[!NOTE]
>Cross-zone and cross-region replication use the same Azure Feature Exposure Control (AFEC) name of `ANFLargeVolumesCRR`. If you've registered for cross-region replication, the registration also works for cross-zone replication. 

1.  Register the feature by running the following commands:

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFLargeVolumesCRR
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is `Registered` before continuing.
    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFLargeVolumesCRR
    ```

You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

## Next steps
* [Understand cross-zone replication](cross-zone-replication-introduction.md)
* [Create cross-zone replication relationships](create-cross-zone-replication.md)
