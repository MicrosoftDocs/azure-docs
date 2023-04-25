---
title: Configure network features for an Azure NetApp Files volume | Microsoft Docs
description: Describes the options for network features and how to configure the Network Features option for a volume. 
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/31/2023
ms.custom: references_regions
ms.author: anfdocs
---
# Configure network features for an Azure NetApp Files volume

The **Network Features** functionality enables you to indicate whether you want to use VNet features for an Azure NetApp Files volume. With this functionality, you can set the option to ***Standard*** or ***Basic***. You can specify the setting when you create a new NFS, SMB, or dual-protocol volume. See [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md) for details about network features.

This article helps you understand the options and shows you how to configure network features.

The **Network Features** functionality is not available in Azure Government regions. See [supported regions](azure-netapp-files-network-topologies.md#supported-regions) for a full list. 

## Options for network features 

Two settings are available for network features: 

* ***Standard***  
    This setting enables VNet features for the volume.  

    If you need higher IP limits or VNet features such as [network security groups](../virtual-network/network-security-groups-overview.md), [user-defined routes](../virtual-network/virtual-networks-udr-overview.md#user-defined), or additional connectivity patterns, you should set **Network Features** to *Standard*.

* ***Basic***  
    This setting provides reduced IP limits (<1000) and no additional VNet features for the volumes.

    You should set **Network Features** to *Basic* if you do not require VNet features.  

## Considerations

* Regardless of the Network Features option you set (*Standard* or *Basic*), an Azure VNet can only have one subnet delegated to Azure NetApp files. See [Delegate a subnet to Azure NetApp Files](azure-netapp-files-delegate-subnet.md#considerations). 
 
* Currently, you can specify the network features setting only during the creation process of a new volume. You cannot modify the setting on existing volumes. 

* You can create volumes with the Standard network features only if the corresponding [Azure region supports the Standard volume capability](azure-netapp-files-network-topologies.md#supported-regions). 
    * If the Standard volume capability is supported for the region, the Network Features field of the Create a Volume page defaults to *Standard*. You can change this setting to *Basic*. 
    * If the Standard volume capability is not available for the region, the Network Features field of the Create a Volume page defaults to *Basic*, and you cannot modify the setting.

* The ability to locate storage compatible with the desired type of network features depends on the VNet specified. If you cannot create a volume because of insufficient resources, you can try a different VNet for which compatible storage is available.

* You can create Basic volumes from Basic volume snapshots and Standard volumes from Standard volume snapshots. Creating a Basic volume from a Standard volume snapshot is not supported. Creating a Standard volume from a Basic volume snapshot is not supported.

* When restoring a backup to a new volume, the new volume can be configure with Basic or Standard network features. 

* Conversion between Basic and Standard network features in either direction is not currently supported.
  
## Set the Network Features option

This section shows you how to set the Network Features option. 

1. During the process of creating a new [NFS](azure-netapp-files-create-volumes.md), [SMB](azure-netapp-files-create-volumes-smb.md), or [dual-protocol](create-volumes-dual-protocol.md) volume, you can set the **Network Features** option to **Basic** or **Standard** under the Basic tab of the Create a Volume screen.

    The following screenshot shows a volume creation example for a region that supports the Standard network features capabilities: 

    ![Screenshot that shows volume creation for Standard network features.](../media/azure-netapp-files/network-features-create-standard.png)

    The following screenshot shows a volume creation example for a region that does *not* support the Standard network features capabilities: 

    ![Screenshot that shows volume creation for Basic network features.](../media/azure-netapp-files/network-features-create-basic.png)

2. Before completing the volume creation process, you can display the specified network features setting in the **Review + Create** tab of the Create a Volume screen. Select **Create** to complete the volume creation.

    ![Screenshot that shows the Review and Create tab of volume creation.](../media/azure-netapp-files/network-features-review-create-tab.png)

3. You can select **Volumes** to display the network features setting for each volume:

    [ ![Screenshot that shows the Volumes page displaying the network features setting.](../media/azure-netapp-files/network-features-volume-list.png)](../media/azure-netapp-files/network-features-volume-list.png#lightbox)

## Next steps  

* [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md)
* [Create an NFS volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
* [Create an SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md) 
* [Create a dual-protocol volume for Azure NetApp Files](create-volumes-dual-protocol.md) 
* [Configure Virtual WAN for Azure NetApp Files](configure-virtual-wan.md)
