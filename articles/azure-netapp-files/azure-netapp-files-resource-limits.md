---
title: Resource limits for Azure NetApp Files | Microsoft Docs
description: Describes limits for Azure NetApp Files resources and how to request resource limit increase.
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
ms.date: 04/22/2021
ms.author: b-juche
---
# Resource limits for Azure NetApp Files

Understanding resource limits for Azure NetApp Files helps you manage your volumes.

## Resource limits

The following table describes resource limits for Azure NetApp Files:

|  Resource  |  Default limit  |  Adjustable via support request  |
|----------------|---------------------|--------------------------------------|
|  Number of NetApp accounts per Azure region per subscription  |  10    |  Yes   |
|  Number of capacity pools per NetApp account   |    25     |   Yes   |
|  Number of volumes per subscription   |    500     |   Yes   |
|  Number of volumes per capacity pool     |    500   |    Yes     |
|  Number of snapshots per volume       |    255     |    No        |
|  Number of subnets delegated to Azure NetApp Files (Microsoft.NetApp/volumes) per Azure Virtual Network    |   1   |    No    |
|  Number of used IPs in a VNet (including immediately peered VNets) with Azure NetApp Files   |    1000   |    No   |
|  Minimum size of a single capacity pool   |  4 TiB     |    No  |
|  Maximum size of a single capacity pool    |  500 TiB   |   No   |
|  Minimum size of a single volume    |    100 GiB    |    No    |
|  Maximum size of a single volume     |    100 TiB    |    No    |
|  Maximum size of a single file     |    16 TiB    |    No    |    
|  Maximum size of directory metadata in a single directory      |    320 MB    |    No    |    
|  Maximum number of files in a single directory  | *Approximately* 4 million. <br> See [Determine if a directory is approaching the limit size](#directory-limit).  |    No    |   
|  Maximum number of files ([maxfiles](#maxfiles)) per volume     |    100 million    |    Yes    |    
|  Maximum number of export policy rules per volume     |    5  |    No    | 
|  Minimum assigned throughput for a manual QoS volume     |    1 MiB/s   |    No    |    
|  Maximum assigned throughput for a manual QoS volume     |    4,500 MiB/s    |    No    |    
|  Number of cross-region replication data protection volumes (destination volumes)     |    5    |    Yes    |     

For more information, see [Capacity management FAQs](azure-netapp-files-faqs.md#capacity-management-faqs).

## Determine if a directory is approaching the limit size <a name="directory-limit"></a>  

You can use the `stat` command from a client to see whether a directory is approaching the maximum size limit for directory metadata (320 MB).   

For a 320-MB directory, the number of blocks is 655360, with each block size being 512 bytes.  (That is, 320x1024x1024/512.)  This number translates to approximately 4 million files maximum for a 320-MB directory. However, the actual number of maximum files might be lower, depending on factors such as the number of files containing non-ASCII characters in the directory. As such, you should use the `stat` command as follows to determine whether your directory is approaching its limit.  

Examples:

```console
[makam@cycrh6rtp07 ~]$ stat bin
File: 'bin'
Size: 4096            Blocks: 8          IO Block: 65536  directory

[makam@cycrh6rtp07 ~]$ stat tmp
File: 'tmp'
Size: 12288           Blocks: 24         IO Block: 65536  directory
 
[makam@cycrh6rtp07 ~]$ stat tmp1
File: 'tmp1'
Size: 4096            Blocks: 8          IO Block: 65536  directory
```

## Maxfiles limits <a name="maxfiles"></a> 

Azure NetApp Files volumes have a limit called *maxfiles*. The maxfiles limit is the number of files a volume can contain. Linux file systems refer to the limit as *inodes*. The maxfiles limit for an Azure NetApp Files volume is indexed based on the size (quota) of the volume. The maxfiles limit for a volume increases or decreases at the rate of 20 million files per TiB of provisioned volume size. 

The service dynamically adjusts the maxfiles limit for a volume based on its provisioned size. For example, a volume configured initially with a size of 1 TiB would have a maxfiles limit of 20 million. Subsequent changes to the size of the volume would result in an automatic readjustment of the maxfiles limit based on the following rules: 

|    Volume size (quota)     |  Automatic readjustment of the maxfiles limit    |
|----------------------------|-------------------|
|    <= 1 TiB                |    20 million     |
|    > 1 TiB but <= 2 TiB    |    40 million     |
|    > 2 TiB but <= 3 TiB    |    60 million     |
|    > 3 TiB but <= 4 TiB    |    80 million     |
|    > 4 TiB                 |    100 million    |

If you have already allocated at least 4 TiB of quota for a volume, you can initiate a [support request](#limit_increase) to increase the maxfiles (inodes) limit beyond 100 million. For every 100 million files you increase (or a fraction thereof), you need to increase the corresponding volume quota by 4 TiB.  For example, if you increase the maxfiles limit from 100 million files to 200 million files (or any number in between), you need to increase the volume quota from 4 TiB to 8 TiB.

You can increase the maxfiles limit to 500 million if your volume quota is at least 20 TiB. <!-- ANF-11854 --> 

## Request limit increase <a name="limit_increase"></a> 

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
        |  Pool    |  *Subscription ID, NetApp account URI*  |  *Requested new maximum **pool** number*   |  *What scenario or use case prompted the request?*  |
        |  Volume  |  *Subscription ID, NetApp account URI, capacity pool URI*   |  *Requested new maximum **volume** number*     |  *What scenario or use case prompted the request?*  |
        |  Maxfiles  |  *Subscription ID, NetApp account URI, capacity pool URI, volume URI*   |  *Requested new maximum **maxfiles** number*     |  *What scenario or use case prompted the request?*  |    
        |  Cross-region replication data protection volumes  |  *Subscription ID, destination NetApp account URI, destination capacity pool URI, source NetApp account URI, source capacity pool URI, source volume URI*   |  *Requested new maximum number of **cross-region replication data protection volumes (destination volumes)***     |  *What scenario or use case prompted the request?*  |    

    2. Specify the appropriate support method and provide your contract information.

    3. Click **Next: Review + create** to create the request. 


## Next steps  

- [Understand the storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
- [Cost model for Azure NetApp Files](azure-netapp-files-cost-model.md)
