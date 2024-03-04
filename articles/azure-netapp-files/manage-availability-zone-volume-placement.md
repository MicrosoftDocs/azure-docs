---
title: Manage availability zone volume placement for Azure NetApp Files  | Microsoft Docs
description: Describes how to create a volume with an availability zone by using Azure NetApp Files.
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 01/13/2023
ms.author: anfdocs
---
# Manage availability zone volume placement for Azure NetApp Files

You can deploy new volumes in the logical availability zone of your choice. You can also populate existing volumes with availability zone information. To better understand availability zones, see [Using availability zones for high availability](use-availability-zones.md).

## Requirements and considerations 

* This feature doesn't guarantee free capacity in the availability zone. For example, even if you can deploy a VM in availability zone 3 of the East US region, it doesn’t guarantee free Azure NetApp Files capacity in that zone. If no sufficient capacity is available, volume creation will fail.

* After a volume is created with an availability zone, the specified availability zone can’t be modified. Volumes can’t be moved between availability zones.

* NetApp accounts and capacity pools aren't bound by the availability zone. A capacity pool can contain volumes in different availability zones.  

* This feature provides zonal volume placement, with latency within the zonal latency envelopes. It ***does not*** provide proximity placement towards compute. As such, it ***does not*** provide lowest latency guarantee.

* Each data center is assigned to a physical zone. Physical zones are mapped to logical zones in your Azure subscription. Azure subscriptions are automatically assigned this mapping at the time a subscription is created. This feature aligns with the generic logical-to-physical availability zone mapping for the subscription. 

* VMs and Azure NetApp Files volumes are to be deployed separately, within the same logical availability zone to create zone alignment between VMs and Azure NetApp Files. The availability zone volume placement feature doesn't create zonal VMs upon volume creation, or vice versa.

[!INCLUDE [Availability Zone volumes have the same level of support as other volumes in the subscription](includes/availability-zone-service-callout.md)]

## Create a volume with an availability zone 

1.	Select **Volumes** from your capacity pool. Then select **+ Add volume** to create a volume.

    For details about volume creation, see:   
    * [Create an NFS volume](azure-netapp-files-create-volumes.md)   
    * [Create an SMB volume](azure-netapp-files-create-volumes-smb.md)      
    * [Create a dual-protocol volume](create-volumes-dual-protocol.md)    

2.	In the **Create a Volume** page, under the **Basic** tab, select the **Availability Zone** pulldown to specify an availability zone where Azure NetApp Files resources are present.   

    > [!IMPORTANT]
    > Logical availability zones for the subscription without Azure NetApp Files presence are marked `(Unavailable)` and are greyed out.

    [ ![Screenshot that shows the Availability Zone menu.](../media/azure-netapp-files/availability-zone-menu-drop-down.png) ](../media/azure-netapp-files/availability-zone-menu-drop-down.png#lightbox)

 
3.	Follow the UI to create the volume. The **Review + Create** page shows the selected availability zone you specified.

    [ ![Screenshot that shows the Availability Zone review.](../media/azure-netapp-files/availability-zone-display-down.png) ](../media/azure-netapp-files/availability-zone-display-down.png#lightbox)
 
4. Navigate to **Properties** to confirm your availability zone configuration.

    :::image type="content" source="../media/azure-netapp-files/availability-zone-volume-overview.png" alt-text="Screenshot of volume properties interface." lightbox="../media/azure-netapp-files/availability-zone-volume-overview.png":::

## Populate an existing volume with availability zone information

1. The feature to populate existing volumes with availability zone information is currently in preview. If you're using this feature for the first time, you need to register the feature first.  
    1. Register the feature: 

    ```azurepowershell-interactive
     Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFPopulateAvailabilityZone
    ```   
    2. Check the status of the feature registration: 

    ```azurepowershell-interactive
   
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFPopulateAvailabilityZone
    ```

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is **Registered** before continuing.
    
    You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status.   
    
1. Navigate to the volume that you want to populate with availability zone information.
1. Select **Populate availability zone**.
1. The Populate Availability Zone window appears and displays the availability zone in which the Azure NetApp Files volume is deployed.
1. Click **Save** if you want to populate this availability zone to the volume, or click **Cancel** if you want to keep the volume regional.

    > [!IMPORTANT]
    > Availability zone information can only be populated as provided. You can't select an availability zone or move the volume to another availability zone by using this feature. If you want to move this volume to another availability zone, consider using [cross-zone replication](create-cross-zone-replication.md) (after populating the volume with the availability zone information). 
    :::image type="content" source="../media/azure-netapp-files/populate-availability-zone.png" alt-text="Screenshot of the Populate Availability Zone window." lightbox="../media/azure-netapp-files/populate-availability-zone.png":::
    
## Next steps  

* [Use availability zones for high availability](use-availability-zones.md)
* [Create an NFS volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)   
* [Create an SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md)      
* [Create a dual-protocol volume for Azure NetApp Files](create-volumes-dual-protocol.md)    
* [Understand cross-zone replication of Azure NetApp Files](cross-zone-replication-introduction.md)
* [Create cross-zone replication](create-cross-zone-replication.md)
