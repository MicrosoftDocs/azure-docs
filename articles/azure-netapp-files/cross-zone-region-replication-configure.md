---
title: Manage cross-zone-region replication for Azure NetApp Files
description: Describes how to manage disaster recovery by using Azure NetApp Files cross-zone-region replication.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 05/12/2025
ms.author: anfdocs 
# Customer intent: As a cloud administrator, I want to configure cross-zone-region replication for Azure NetApp Files, so that I can ensure data accessibility and disaster recovery across multiple regions and availability zones.
---
# Manage cross-zone-region replication for Azure NetApp Files (preview)

Azure NetApp Files supports volume cross-zone and cross-region replication on the same source volume. 

## Requirements 

- Cross-zone-region replication supports creating two replication relationships for a source volume: cross-zone replication, cross-region replication, or a combination.  
- Cross-zone-region replication volumes must abide by the same requirements and considerations as individual [cross-zone replication](cross-zone-replication-requirements-considerations.md) and [cross-region replication](cross-region-replication-requirements-considerations.md) volumes.  
- You must break the secondary relationship before you can perform a reverse resync operation with cross-zone-region replication. For more information, see [Resync volumes after disaster recovery](cross-region-replication-manage-disaster-recovery.md#resync-replication).
- Azure NetApp Files replication is supported within a subscription and between subscriptions under the same tenant.
- Fan-out deployments are supported for two destination volumes: one source (read/write) volume and two destination volumes. 

>[!NOTE]
>Data protection is limited to two volumes.

## Register for cross-zone-region replication 

Cross-zone-region replication for Azure NetApp Files is currently in preview. You need to register the feature before using it for the first time. Feature registration may take up to 60 minutes to complete.

1. Register the feature

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFOneToTwoReplication
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is `Registered` before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFOneToTwoReplication
    ```
You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

## Configure replication

1. On the source volume: 
    - **If you're using an existing volume without an availability zone:** [populate it with an availability zone](manage-availability-zone-volume-placement.md#populate-an-existing-volume-with-availability-zone-information).
    - **If you're creating a new volume:** [create it with an availability zone](manage-availability-zone-volume-placement.md#create-a-volume-with-an-availability-zone). 

1. Under Properties, take note of the source volume’s resource ID. The source volume's resource ID is required to complete the next two steps. 
1. [Create the cross-zone replication destination volume](create-cross-zone-replication.md#create-the-data-replication-volume-in-another-availability-zone-of-the-same-region). 
1. [Create the cross-region replication destination volume](cross-region-replication-create-peering.md#create-the-data-replication-volume-the-destination-volume).   
1. [Authorize data replication from the source volume](cross-region-replication-create-peering.md#authorize-replication-from-the-source-volume).  
1. In the source volume’s menu, select **Replication**. Confirm there are two volumes listed under **Destination volumes**. 

>[!NOTE]
>With cross-zone-region replication, you can create a combination of a cross-zone and a cross-region replication relationship, two cross-region replication relationships, or two cross-zone replication relationships. The cross-zone relationship can be within the same zone.

:::image type="content" source="./media/cross-zone-region-replication-configure/complete-configuration.png" alt-text="Screenshot of successful configuration." lightbox="./media/cross-zone-region-replication-configure/complete-configuration.png":::


## Next steps 

* [Understand cross-zone-region replication](cross-zone-region-replication.md)
* [Cross-region replication](cross-region-replication-introduction.md)
* [Requirements and considerations for using cross-region replication](cross-region-replication-requirements-considerations.md)
* [Display health status of replication relationship](cross-region-replication-display-health-status.md)
* [Volume replication metrics](azure-netapp-files-metrics.md#replication)
* [Manage disaster recovery](cross-region-replication-manage-disaster-recovery.md)
* [Delete volume replications or volumes](cross-region-replication-delete.md)
* [Troubleshoot cross-region-replication](troubleshoot-cross-region-replication.md)