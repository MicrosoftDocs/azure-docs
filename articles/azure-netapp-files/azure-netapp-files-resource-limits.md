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

The following table describes resource limits for Azure NetApp Files:

|  **Resource**  |  **Default Limit**  |  **Adjustable via Support Request**  |
|----------------|---------------------|--------------------------------------|
|  Number of NetApp accounts per Azure  Subscription   |  10    |  Yes   |
|  Number of capacity pools per NetApp account   |    25     |   Yes   |
|  Number of volumes per capacity pool     |    500   |    Yes     |
|  Number of snapshots per volume       |    255     |    No        |
|  Number of subnets delegated to Azure NetApp Files (Microsoft.NetApp/volumes) per Azure Virtual Network    |   1   |    No    |
|  Minimum size of a single capacity pool   |  4 TiB     |    No  |
|  Maximum size of a single capacity pool    |  500 TiB   |   No   |
|  Minimum size of a single volume    |    100 GiB    |    No    |
|  Maximum assigned quota of a single volume   |   92 TiB   |    No   |
|  Maximum size of a single volume     |    100 TiB    |    No       |


## Request Limit Increase 

You can create an Azure support request to increase the adjustable limits from the table above. 

From Azure portal navigation plane: 

1. Click **Help + support**.
2. Click **+ New support request**.
3. On the Basics tab, provide the following information: 
    * Issue type: Select **Service and subscription limits (quotas)**.
    * Subscriptions: Select the subscription with the resource that needs the quota increase.
    * Quota type: Select **Storage: Azure NetApp Files limits**.
    * Click **Next: Solutions**.
4. On the Details tab, provide the following information for the corresponding resource type in the Description box:

|  **Resource**  |    **Parent Resources**      |    **Requested New Limits**     |    **Reason for quota increase**       |
|----------------|------------------------------|---------------------------------|------------------------------------------|
|  Account |  *Subscription ID*   |  *Requested new maximum **account** number*    |  *What scenario or use case prompted the request?*  |
|  Pool    |  *Subscription ID, Account URI*  |  *Requested new maximum **pool** number*   |  *What scenario or use case prompted the request?*  |
|  Volume  |  *Subscription ID, Account URI, Pool URI*   |  *Requested new maximum **volume** number*     |  *What scenario or use case prompted the request?*  |


**Next steps**

[Understand the storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
