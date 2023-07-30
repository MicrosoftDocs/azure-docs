---
title: include file
description: include file
services: storage
author: khdownie
ms.service: azure-storage
ms.topic: include
ms.date: 01/19/2023
ms.author: kendownie
ms.custom: include file
---

In this step, you'll determine how many Azure file shares you need. A single Windows Server instance (or cluster) can sync up to 30 Azure file shares.

You might have more folders on your volumes that you currently share out locally as SMB shares to your users and apps. The easiest way to picture this scenario is to envision an on-premises share that maps 1:1 to an Azure file share. If you have a small enough number of shares, below 30 for a single Windows Server instance, we recommend a 1:1 mapping.

If you have more than 30 shares, mapping an on-premises share 1:1 to an Azure file share is often unnecessary. Consider the following options.

#### Share grouping

For example, if your human resources (HR) department has 15 shares, you might consider storing all the HR data in a single Azure file share. Storing multiple on-premises shares in one Azure file share doesn't prevent you from creating the usual 15 SMB shares on your local Windows Server instance. It only means that you organize the root folders of these 15 shares as subfolders under a common folder. You then sync this common folder to an Azure file share. That way, only a single Azure file share in the cloud is needed for this group of on-premises shares.

#### Volume sync

Azure File Sync supports syncing the root of a volume to an Azure file share. If you sync the volume root, all subfolders and files will go to the same Azure file share.

Syncing the root of the volume isn't always the best option. There are benefits to syncing multiple locations. For example, doing so helps keep the number of items lower per sync scope. We test Azure file shares and Azure File Sync with 100 million items (files and folders) per share. But a best practice is to try to keep the number below 20 million or 30 million in a single share. Setting up Azure File Sync with a lower number of items isn't beneficial only for file sync. A lower number of items also benefits scenarios like these:

* Initial scan of the cloud content can complete faster, which in turn decreases the wait for the namespace to appear on a server enabled for Azure File Sync.
* Cloud-side restore from an Azure file share snapshot will be faster.
* Disaster recovery of an on-premises server can speed up significantly.
* Changes made directly in an Azure file share (outside of sync) can be detected and synced faster.

> [!TIP]
> If you don't know how many files and folders you have, check out the TreeSize tool from JAM Software GmbH.

#### A structured approach to a deployment map

Before you deploy cloud storage in a later step, it's important to create a map between on-premises folders and Azure file shares. This mapping will inform how many and which Azure File Sync *sync group* resources you'll provision. A sync group ties the Azure file share and the folder on your server together and establishes a sync connection.

To decide how many Azure file shares you need, review the following limits and best practices. Doing so will help you optimize your map.

* A server on which the Azure File Sync agent is installed can sync with up to 30 Azure file shares.
* An Azure file share is deployed in a storage account. That arrangement makes the storage account a scale target for performance numbers like IOPS and throughput.

  Pay attention to a storage account's IOPS limitations when deploying Azure file shares. Ideally, you should map file shares 1:1 with storage accounts. However, this might not always be possible due to various limits and restrictions, both from your organization and from Azure. When it's not possible to have only one file share deployed in one storage account, consider which shares will be highly active and which shares will be less active to ensure that the hottest file shares don't get put in the same storage account together.

  If you plan to lift an app to Azure that will use the Azure file share natively, you might need more performance from your Azure file share. If this type of use is a possibility, even in the future, it's best to create a single standard Azure file share in its own storage account.
* There's a limit of 250 storage accounts per subscription per Azure region.

> [!TIP]
> Given this information, it often becomes necessary to group multiple top-level folders on your volumes into a new common root directory. You then sync this new root directory, and all the folders you grouped into it, to a single Azure file share. This technique allows you to stay within the limit of 30 Azure file share syncs per server.
>
> This grouping under a common root doesn't affect access to your data. Your ACLs stay as they are. You only need to adjust any share paths (like SMB or NFS shares) you might have on the local server folders that you now changed into a common root. Nothing else changes.

> [!IMPORTANT]
> The most important scale vector for Azure File Sync is the number of items (files and folders) that need to be synced. Review the [Azure File Sync scale targets](../articles/storage/files/storage-files-scale-targets.md#azure-file-sync-scale-targets) for more details.

It's a best practice to keep the number of items per sync scope low. That's an important factor to consider in your mapping of folders to Azure file shares. Azure File Sync is tested with 100 million items (files and folders) per share. But it's often best to keep the number of items below 20 million or 30 million in a single share. Split your namespace into multiple shares if you start to exceed these numbers. You can continue to group multiple on-premises shares into the same Azure file share if you stay roughly below these numbers. This practice will provide you with room to grow.

It's possible that, in your situation, a set of folders can logically sync to the same Azure file share (by using the new common root folder approach mentioned earlier). But it might still be better to regroup folders so they sync to two instead of one Azure file share. You can use this approach to keep the number of files and folders per file share balanced across the server. You can also split your on-premises shares and sync across more on-premises servers, adding the ability to sync with 30 more Azure file shares per extra server.

#### Common file sync scenarios and considerations

| # | Sync scenario | Supported | Considerations (or limitations) | Solution (or workaround) | 
|---|---|:---:|---|---|
| 1 | File server with multiple disks/volumes and multiple shares to same target Azure file share (consolidation) | No | A target Azure file share (cloud endpoint) only supports syncing with one sync group. <br/> <br/> A sync group only supports one server endpoint per registered server. | 1) Start with syncing one disk (its root volume) to target Azure file share. Starting with largest disk/volume will help with storage requirements on-premises. Configure cloud tiering to tier all data to cloud, thereby freeing up space on the file server disk. Move data from other volumes/shares into the current volume which is syncing. Continue the steps one by one until all data is tiered up to cloud/migrated.<br/> 2) Target one root volume (disk) at a time. Use cloud tiering to tier all data to target Azure file share. Remove server endpoint from sync group, re-create the endpoint with the next root volume/disk, sync, and repeat the process. Note: Agent re-install might be required.<br/> 3) Recommend using multiple target Azure file shares (same or different storage account based on performance requirements) |
| 2 | File server with single volume and multiple shares to same target Azure file share (consolidation) | Yes | Can't have multiple server endpoints per registered server syncing to same target Azure file share (same as above) | Sync root of the volume holding multiple shares or top-level folders. Refer to [Share grouping concept](#share-grouping) and [Volume sync](#volume-sync) for more information. |
| 3 | File server with multiple shares and/or volumes to multiple Azure file shares under single storage account (1:1 share mapping) | Yes | A single Windows Server instance (or cluster) can sync up to 30 Azure file shares.<br/><br/> A storage account is a scale target for performance. IOPS and throughput get shared across file shares.<br/><br/> Keep number of items per sync group within 100 million items (files and folders) per share. Ideally it's best to stay below 20 or 30 million per share. | 1) Use multiple sync groups (number of sync groups = number of Azure file shares to sync to).<br/>  2) Only 30 shares can be synced in this scenario at a time. If you have more than 30 shares on that file server, use [Share grouping concept](#share-grouping) and [Volume sync](#volume-sync) to reduce the number of root or top-level folders at source.<br/> 3) Use additional File Sync servers on-premises and split/move data to these servers to work around limitations on the source Windows server. |
| 4 | File server with multiple shares and/or volumes to multiple Azure file shares under different storage account (1:1 share mapping) | Yes | A single Windows Server instance (or cluster) can sync up to 30 Azure file shares (same or different storage account).<br/><br/> Keep number of items per sync group within 100 million items (files and folders) per share. Ideally it's best to stay below 20 or 30 million per share. | Same approach as above |
| 5 | Multiple file servers with single (root volume or share) to same target Azure file share (consolidation) | No | A sync group can't use cloud endpoint (Azure file share) already configured in another sync group.<br/><br/> Although a sync group can have server endpoints on different file servers, the files can't be distinct. | *Follow guidance in Scenario # 1 above with additional consideration of targeting one file server at a time.* |

#### Create a mapping table

:::row:::
    :::column:::
        [![Diagram that shows an example of a mapping table. Download the following file to experience and use the content of this image.](media/storage-files-migration-namespace-mapping/namespace-mapping.png)](media/storage-files-migration-namespace-mapping/namespace-mapping-expanded.png#lightbox)
    :::column-end:::
    :::column:::
        Use the previous information to determine how many Azure file shares you need and which parts of your existing data will end up in which Azure file share.
        
        Create a table that records your thoughts so you can refer to it when you need to. Staying organized is important because it can be easy to lose details of your mapping plan when you're provisioning many Azure resources at once. Download the following Excel file to use as a template to help create your mapping.

[//]: # (HTML appears as the only way to accomplish adding a nested two-column table with working image parsing and text/hyperlink on the same line.)

<br>
<table>
    <tr>
        <td>
            <img src="media/storage-files-migration-namespace-mapping/excel.png" alt="Excel icon that sets the context for the download.">
        </td>
        <td>
            <a href="https://download.microsoft.com/download/1/8/D/18DC8184-E7E2-45EF-823F-F8A36B9FF240/Azure File Sync - Namespace Mapping.xlsx">Download a namespace-mapping template.</a>
        </td>
    </tr>
</table>
    :::column-end:::
:::row-end:::
