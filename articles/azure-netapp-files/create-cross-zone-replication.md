---
title: Create cross-zone replication relationships for Azure NetApp Files | Microsoft Docs
description: This article shows you how to create and manage cross-zone replication relationships for Azure NetApp Files.
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/04/2023
ms.author: anfdocs
---
# Create cross-zone replication relationships for Azure NetApp Files

[Cross-zone replication](cross-zone-replication-introduction.md) enables you to replicate volumes across availability zones within the same region. It enables you to fail over your critical application if a region-wide outage or disaster happens. 

For information about availability zones, see [Use availability zones for high availability in Azure NetApp Files](use-availability-zones.md) and [Manage availability zone volume placement for Azure NetApp Files](manage-availability-zone-volume-placement.md). 

## Requirements

Before you begin, you should review the [requirements and considerations for cross-zone replication](cross-zone-replication-requirements-considerations.md).

[!INCLUDE [Azure NetApp Files cross-zone-replication supported regions](includes/cross-zone-regions.md)]

## Register the feature 

Cross-zone replication is currently in preview. You need to register the feature before using it for the first time. After registration, the feature is enabled and works in the background. No UI control is required. 

1. Register the feature: 

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFCrossZoneReplication
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to`Registered`. Wait until the status is **Registered** before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFCrossZoneReplication
    ```
You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

## Create the source volume with an availability zone  

This process requires that your account is subscribed to the [availability zone volume placement feature](use-availability-zones.md).

1.	Select **Volumes** from your capacity pool. Then select **+ Add volume** to create a volume.

    For details about volume creation, refer to:
    * [Create an NFS volume](azure-netapp-files-create-volumes.md)
    * [Create an SMB volume](azure-netapp-files-create-volumes-smb.md)
    * [Create a dual-protocol volume](create-volumes-dual-protocol.md)

1. In the **Create a Volume** page, under the Basic tab, select the **Availability Zone** pulldown menu to specify an availability zone where Azure NetApp Files resources are present.
    > [!IMPORTANT]
    > Logical availability zones for the subscription without Azure NetApp Files presence are marked `(Unavailable)` and are greyed out.

    :::image type="content" source="../media/azure-netapp-files/create-volume-availability-zone.png" alt-text="Screenshot of the 'Create a Zone' menu requires you to select an availability zone." lightbox="../media/azure-netapp-files/create-volume-availability-zone.png":::

1. Follow the steps indicated in the interface to create the volume. The **Review + Create** page shows the selected availability zone you specified.
    
    :::image type="content" source="../media/azure-netapp-files/zone-replication-review-create.png" alt-text="Screenshot showing the need to confirm selection of correct availability zone in the Review and Create page." lightbox="../media/azure-netapp-files/zone-replication-review-create.png":::

1. After you create the volume, the **Volume Overview** page includes availability zone information for the volume.

    :::image type="content" source="../media/azure-netapp-files/zone-replication-volume-overview.png" alt-text="The selected availability zone will display when you create the volume." lightbox="../media/azure-netapp-files/zone-replication-volume-overview.png":::

## Create the data replication volume in another availability zone of the same region

1. [Locate the volume source ID.](cross-region-replication-create-peering.md#locate-the-source-volume-resource-id)

1. Create the data replication volume (the destination volume) _in another availability zone, but in the same region as the source volume_. In the **Basics** tab of the **Create a new protection volume** page, select an available availability zone.
> [!IMPORTANT]
> Logical availability zones for the subscription without Azure NetApp Files presence are marked `(Unavailable)` and are greyed out.
    :::image type="content" source="../media/azure-netapp-files/zone-replication-create-new-volume.png" alt-text="Select an availability zone for the cross-zone replication volume." lightbox="../media/azure-netapp-files/zone-replication-create-new-volume.png":::

## Complete cross-zone replication configuration

Follow the same workflow as cross-region replication to complete cross-zone replication configuration:

1. [Authorize replication from the source volume.](cross-region-replication-create-peering.md#authorize-replication-from-the-source-volume)
1. [Display health and monitor status of replication relationship.](cross-region-replication-display-health-status.md)
1. [Manage disaster recovery](cross-region-replication-manage-disaster-recovery.md)
