---
title: Resource limits for Azure NetApp Files | Microsoft Docs
description: Describes limits for Azure NetApp Files resources and how to request resource limit increase.
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 09/29/2023
ms.author: anfdocs
---
# Resource limits for Azure NetApp Files

Understanding resource limits for Azure NetApp Files helps you manage your volumes.

## Resource limits

The following table describes resource limits for Azure NetApp Files:

|  Resource  |  Default limit  |  Adjustable via support request  |
|----------------|---------------------|--------------------------------------|
|  [Regional capacity quota per subscription](regional-capacity-quota.md)   |  25 TiB  |  Yes  |
|  Number of NetApp accounts per Azure region per subscription  |  10    |  Yes   |
|  Number of capacity pools per NetApp account   |    25     |   Yes   |
|  Number of volumes per subscription   |    500     |   Yes   |
|  Number of volumes per capacity pool     |    500   |    Yes     |
|  Number of snapshots per volume       |    255     |    No        |
|  Number of IPs in a virtual network (including immediately peered VNets) accessing volumes in an Azure NetApp Files hosting VNet    |   <ul><li>**Basic**: 1000</li><li>**Standard**: [Same standard limits as VMs](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-resource-manager-virtual-networking-limits)</li></ul>  |    No    |
|  Minimum size of a single capacity pool   |  1 TiB*     |    No  |
|  Maximum size of a single capacity pool    |  1000 TiB   |   Yes   |
|  Minimum size of a single regular volume    |    100 GiB    |    No    |
|  Maximum size of a single regular volume     |    100 TiB    |    No    |
|  Minimum size of a single [large volume](large-volumes-requirements-considerations.md) |     102,401 GiB |     No |
|  Maximum size of a single large volume     |    500 TiB    |    No    |
|  Maximum size of a single file     |    16 TiB    |    No    |    
|  Maximum size of directory metadata in a single directory      |    320 MB    |    No    |    
|  Maximum number of files in a single directory  | *Approximately* 4 million. <br> See [Determine if a directory is approaching the limit size](#directory-limit).  |    No    |   
|  Maximum number of files [`maxfiles`](#maxfiles) per volume     |    106,255,630    |    Yes    |    
|  Maximum number of export policy rules per volume     |    5  |    No    | 
|  Maximum number of quota rules per volume     |   100  |    Yes    | 
|  Minimum assigned throughput for a manual QoS volume     |    1 MiB/s   |    No    |    
|  Maximum assigned throughput for a manual QoS volume     |    4,500 MiB/s    |    No    |    
|  Number of cross-region replication data protection volumes (destination volumes)     |    20    |    Yes    |     
|  Number of cross-zone replication data protection volumes (destination volumes)     |    20    |    Yes    |     
|  Maximum numbers of policy-based (scheduled) backups per volume  | <ul><li> Daily retention count: 2 (minimum) to 1019 (maximum) </li> <li> Weekly retention count: 1 (minimum) to 1019 (maximum) </li> <li> Monthly retention count: 1 (minimum) to 1019 (maximum) </ol></li> <br> The maximum hourly, daily, weekly, and monthly backup retention counts *combined* is 1019.  |  No  |
|  Maximum size of protected volume  |  100 TiB  |  No  |
|  Maximum number of volumes that can be backed up per subscription   |  20  |  Yes  |
|  Maximum number of manual backups per volume per day |  5  |  No  |
|  Maximum number of volumes supported for cool access per subscription per region |  10  |  Yes  |

\* [!INCLUDE [Limitations for capacity pool minimum of 1 TiB](includes/2-tib-capacity-pool.md)]

For more information, see [Capacity management FAQs](faq-capacity-management.md).

For limits and constraints related to Azure NetApp Files network features, see [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md#considerations).

## Determine if a directory is approaching the limit size <a name="directory-limit"></a>  

You can use the `stat` command from a client to see whether a directory is approaching the maximum size limit for directory metadata (320 MB). If you reach the maximum size limit for a single directory for Azure NetApp Files, the error `No space left on device` occurs.   

For a 320-MB directory, the number of blocks is 655360, with each block size being 512 bytes.  (That is, 320x1024x1024/512.)  This number translates to approximately 4 million files maximum for a 320-MB directory. However, the actual number of maximum files might be lower, depending on factors such as the number of files with non-ASCII characters in the directory. As such, you should use the `stat` command as follows to determine whether your directory is approaching its limit.  

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

## `Maxfiles` limits <a name="maxfiles"></a> 

Azure NetApp Files volumes have a limit called *`maxfiles`*. The `maxfiles` limit is the number of files a volume can contain. Linux file systems refer to the limit as *inodes*. The `maxfiles` limit for an Azure NetApp Files volume is indexed based on the size (quota) of the volume. The `maxfiles` limit for a volume increases or decreases at the rate of 21,251,126 files per TiB of provisioned volume size. 

The service dynamically adjusts the `maxfiles` limit for a volume based on its provisioned size. For example, a volume configured initially with a size of 1 TiB would have a `maxfiles` limit of 21,251,126. Subsequent changes to the size of the volume would result in an automatic readjustment of the `maxfiles` limit based on the following rules: 

**For volumes up to 100 TiB in size:**

|    Volume size (quota)     |  Automatic readjustment of the `maxfiles` limit    |
|----------------------------|-------------------|
|    <= 1 TiB                |    21,251,126     |
|    > 1 TiB but <= 2 TiB    |    42,502,252     |
|    > 2 TiB but <= 3 TiB    |    63,753,378     |
|    > 3 TiB but <= 4 TiB    |    85,004,504     |
|    > 4 TiB but <= 100 TiB  |    106,255,630    |

>[!IMPORTANT]
> If your volume has a volume size (quota) of more than 4 TiB and you want to increase the `maxfiles` limit, you must initiate [a support request](#request-limit-increase).

For volumes 100 TiB or under, if you've allocated at least 5 TiB of quota for a volume, you can initiate a support request to increase the `maxfiles` (inodes) limit beyond 106,255,630. For every 106,255,630 files you increase (or a fraction thereof), you need to increase the corresponding volume quota by 5 TiB. For example, if you increase the `maxfiles` limit from 106,255,630 files to 212,511,260 files (or any number in between), you need to increase the volume quota from 5 TiB to 10 TiB. 

For volumes 100 TiB or under, you can increase the `maxfiles` limit up to 531,278,150 if your volume quota is at least 25 TiB.

>[!IMPORTANT]
> When files or folders are allocated to an Azure NetApp Files volume, they count against the `maxfiles` limit. If a file or folder is deleted, the internal data structures for `maxfiles` allocation remain the same. For instance, if the files used in a volume increase to 63,753,378 and 100,000 files are deleted, the `maxfiles` allocation will remain at 63,753,378. 
> Once a volume has exceeded a `maxfiles` limit, you cannot reduce volume size below the quota corresponding to that `maxfiles` limit even if you have reduced the actual used file count. For example, the `maxfiles` limit for a 2 TiB volume is 63,753,378. If you create more than 63,753,378 files in that volume, the volume quota cannot be reduced below its corresponding index of 2 TiB.

**For [large volumes](azure-netapp-files-understand-storage-hierarchy.md#large-volumes):**

| Volume size (quota) | Automatic readjustment of the `maxfiles` limit |
| - | - |
|   > 100 TiB    | 2,550,135,120                  |
             
You can increase the `maxfiles` limit beyond 2,550,135,120 using a support request. For every 2,550,135,120 files you increase (or a fraction thereof), you need to increase the corresponding volume quota by 120 TiB. For example, if you increase `maxfiles` limit from 2,550,135,120 to 5,100,270,240 files (or any number in between), you need to increase the volume quota to at least 240 TiB.
 
The maximum `maxfiles` value for a 500 TiB volume is 10,625,563,000 files.

You cannot set `maxfiles` limits for data protection volumes via a quota request.  Azure NetApp Files automatically increases the `maxfiles` limit of a data protection volume to accommodate the number of files replicated to the volume.  When a failover happens to a data protection volume, the `maxfiles` limit remains the last value before the failover.  In this situation, you can submit a `maxfiles` [quota request](#request-limit-increase) for the volume.

## Request limit increase

You can create an Azure support request to increase the adjustable limits from the [Resource Limits](#resource-limits) table. 

>[!NOTE]
> Depending on available resources in the region and the limit increase requested, Azure support may require additional information in order to determine the feasibility of the request.

1. Go to **New Support Request** under **Support + troubleshooting**.   

2. Under the **Problem description** tab, provide the required information:
    1. For **Issue Type**, select **Service and Subscription Limits (Quotas)**.
    2. For **Subscription**, select your subscription. 
    3. For **Quota Type**, select **Storage: Azure NetApp Files limits**.  

    ![Screenshot that shows the Problem Description tab.](../media/azure-netapp-files/support-problem-descriptions.png)

3. Under the **Additional details** tab, select **Enter details** in the Request Details field.  

    ![Screenshot that shows the Details tab and the Enter Details field.](../media/azure-netapp-files/quota-additional-details.png)

4. To request limit increase, provide the following information in the Quota Details window that appears:
    1. In **Quota Type**, select the type of resource you want to increase.  
        For example:   
        * *Regional Capacity Quota per Subscription (TiB)*
        * *Number of NetApp accounts per Azure region per subscription*
        * *Number of volumes per subscription*

    2. In **Region Requested**, select your region.   
        The current and default sizes are displayed under Quota State.
    
    3. Enter a value to request an increase for the quota type you specified.
    
    ![Screenshot that shows how to display and request increase for regional quota.](../media/azure-netapp-files/quota-details-regional-request.png)

5. Select **Save and continue**. Select **Review + create** to create the request.

## Next steps  

- [Understand the storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
- [Requirements and considerations for large volumes](large-volumes-requirements-considerations.md)
- [Cost model for Azure NetApp Files](azure-netapp-files-cost-model.md)
- [Regional capacity quota for Azure NetApp Files](regional-capacity-quota.md)
- [Request region access for Azure NetApp Files](request-region-access.md)
- [Application resilience FAQs for Azure NetApp Files](faq-application-resilience.md)
