---
title: Resource limits for Azure NetApp Files | Microsoft Docs
description: Describes limits for Azure NetApp Files resources, including limits for NetApp accounts, capacity pools, volumes, snapshots, and the delegated subnet.
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: b-juche
---
# Resource limits for Azure NetApp Files

Understanding resource limits for Azure NetApp Files helps you manage your volumes.

## Resource limits

The following table describes resource limits for Azure NetApp Files:

|  Resource  |  Default limit  |  Adjustable via support request  |
|----------------|---------------------|--------------------------------------|
|  Number of NetApp accounts per Azure  Subscription   |  10    |  Yes   |
|  Number of capacity pools per NetApp account   |    25     |   Yes   |
|  Number of volumes per capacity pool     |    500   |    Yes     |
|  Number of snapshots per volume       |    255     |    No        |
|  Number of subnets delegated to Azure NetApp Files (Microsoft.NetApp/volumes) per Azure Virtual Network    |   1   |    No    |
|  Maximum number of VMs (includes peered VNets) that can connect to a volume     |    1000   |    No   |
|  Minimum size of a single capacity pool   |  4 TiB     |    No  |
|  Maximum size of a single capacity pool    |  500 TiB   |   No   |
|  Minimum size of a single volume    |    100 GiB    |    No    |
|  Maximum assigned quota of a single volume*   |   92 TiB   |    No   |
|  Maximum size of a single volume*     |    100 TiB    |    No       |

*A volume can be manually created or resized to maximally 92 TiB. However, a volume can grow up to 100 TiB in an overage scenario. See [Cost model for Azure NetApp Files](azure-netapp-files-cost-model.md) for details on capacity overage. 

## Request limit increase 

You can create an Azure support request to increase the adjustable limits from the table above. 

From Azure portal navigation plane: 

1. Click **Help + support**.
2. Click **+ New support request**.
3. On the Basics tab, provide the following information: 
    1. Issue type: Select **Service and subscription limits (quotas)**.
    2. Subscriptions: Select the subscription for the resource that you need the quota increased.
    3. Quota type: Select **Storage: Azure NetApp Files limits**.
    4. Click **Next: Solutions**.
4. On the Details tab:
    1. In the Description box, provide the following information for the corresponding resource type:

        |  Resource  |    Parent resources      |    Requested new limits     |    Reason for quota increase       |
        |----------------|------------------------------|---------------------------------|------------------------------------------|
        |  Account |  *Subscription ID*   |  *Requested new maximum **account** number*    |  *What scenario or use case prompted the request?*  |
        |  Pool    |  *Subscription ID, Account URI*  |  *Requested new maximum **pool** number*   |  *What scenario or use case prompted the request?*  |
        |  Volume  |  *Subscription ID, Account URI, Pool URI*   |  *Requested new maximum **volume** number*     |  *What scenario or use case prompted the request?*  |

    2. Specify the appropriate support method and provide your contract information.

    3. Click **Next: Review + create** to create the request. 


## Next steps  

- [Understand the storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
- [Cost model for Azure NetApp Files](azure-netapp-files-cost-model.md)
