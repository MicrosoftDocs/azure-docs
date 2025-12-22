---
title: Include file
description: Include file
services: storage
author: khdownie
ms.service: azure-file-storage
ms.topic: include
ms.date: 09/26/2025
ms.author: kendownie
ms.custom: include file
---

In this step, you determine how many Azure file shares you need. A single Windows Server instance (or cluster) can sync up to 30 Azure file shares.

You might have more folders on your volumes that you currently share out locally as SMB shares to your users and apps. The easiest way to picture this scenario is to envision an on-premises share that maps 1:1 to an Azure file share. If you have a small-enough number of shares, below 30 for a single Windows Server instance, we recommend a 1:1 mapping.

If you have more than 30 shares, mapping an on-premises share 1:1 to an Azure file share is often unnecessary. Consider the following options.

#### Share grouping

For example, if your human resources (HR) department has 15 shares, you might consider storing all the HR data in a single Azure file share. Storing multiple on-premises shares in one Azure file share doesn't prevent you from creating the usual 15 SMB shares on your local Windows Server instance. It only means that you organize the root folders of these 15 shares as subfolders under a common folder. You then sync this common folder to an Azure file share. That way, you need only a single Azure file share in the cloud for this group of on-premises shares.

#### Volume sync

Azure File Sync supports syncing the root of a volume to an Azure file share. If you sync the volume root, all subfolders and files go to the same Azure file share.

Syncing the root of the volume isn't always the best option. There are benefits to syncing multiple locations. For example, doing so helps keep the number of items lower per sync scope. We test Azure file shares and Azure File Sync with 100 million items (files and folders) per share. But a best practice is to try to keep the number below 20 million or 30 million in a single share.

Setting up Azure File Sync with a lower number of items isn't beneficial only for file sync. A lower number of items also benefits scenarios like these:

* Initial scan of the cloud content can finish faster, which in turn decreases the wait for the namespace to appear on a server enabled for Azure File Sync.
* Cloud-side restore from an Azure file share snapshot is faster.
* Disaster recovery of an on-premises server can speed up significantly.
* Changes made directly in an Azure file share (outside a sync) can be detected and synced faster.

> [!TIP]
> If you don't know how many files and folders you have, check out the TreeSize tool from JAM Software.

#### Structured approach to a deployment map

Before you deploy cloud storage in a later step, it's important to create a map between on-premises folders and Azure file shares. This mapping informs how many and which Azure File Sync *sync group* resources you'll provision. A sync group ties the Azure file share and the folder on your server together and establishes a sync connection.

To optimize your map and decide how many Azure file shares you need, review the following limits and best practices:

* A server on which the Azure File Sync agent is installed can sync with up to 30 Azure file shares.
* An Azure file share is deployed in a storage account. That arrangement makes the storage account a scale target for performance numbers like IOPS and throughput.

  Pay attention to a storage account's IOPS limitations when you deploy Azure file shares. Ideally, you should map file shares 1:1 with storage accounts. However, this mapping might not always be possible due to various limits and restrictions, both from your organization and from Azure. When you can't deploy only one file share in one storage account, consider which shares will be highly active and which shares will be less active. Don't put the hottest file shares together in the same storage account.

  If you plan to lift an app to Azure that will use the Azure file share natively, you might need more performance from your Azure file share. If this type of use is a possibility, even in the future, it's best to create a single standard Azure file share in its own storage account.
* There's a limit of 250 storage accounts per subscription per Azure region.

> [!TIP]
> Based on this information, it often becomes necessary to group multiple top-level folders on your volumes into a new common root directory. You then sync this new root directory, and all the folders that you grouped into it, to a single Azure file share. This technique allows you to stay within the limit of 30 Azure file share syncs per server.
>
> This grouping under a common root doesn't affect access to your data. Your ACLs stay as they are. You only need to adjust any share paths (like SMB or NFS shares) that you might have on the local server folders that you now changed into a common root. Nothing else changes.

> [!IMPORTANT]
> The most important scale vector for Azure File Sync is the number of items (files and folders) that need to be synced. Review the [Azure File Sync scale targets](../articles/storage/file-sync/file-sync-scale-targets.md) for more details.

It's possible that, in your situation, a set of folders can logically sync to the same Azure file share (by using the common-root approach mentioned earlier). But it might still be better to regroup folders so that they sync to two Azure file shares instead of one. You can use this approach to keep the number of files and folders per file share balanced across the server. You can also split your on-premises shares and sync across more on-premises servers, to add the ability to sync with 30 more Azure file shares per extra server.

> [!IMPORTANT]
> The most important scale vector for Azure File Sync is the number of items (files and folders) that need to be synced. For more details, review the [Azure File Sync scale targets](../articles/storage/file-sync/file-sync-scale-targets.md).

#### Common file sync scenarios and considerations

| Sync scenario | Supported | Considerations (or limitations) | Solution (or workaround) |
|---|:---:|---|---|
| File server with multiple disks/volumes and multiple shares to the same target Azure file share (consolidation) | No | A target Azure file share (cloud endpoint) supports syncing with only one sync group. <br/> <br/> A sync group supports only one server endpoint per registered server. | 1) Start with syncing one disk (its root volume) to a target Azure file share. Starting with the largest disk/volume will help with storage requirements on-premises. Configure cloud tiering to tier all data to cloud, so that you can free up space on the file server disk. Move data from other volumes/shares into the current volume that's syncing. Continue the steps one by one until all data is tiered up to the cloud or migrated.<br/> 2) Target one root volume (disk) at a time. Use cloud tiering to tier all data to the target Azure file share. Remove the server endpoint from the sync group, re-create the endpoint with the next root volume/disk, sync, and then repeat the process. Note that you might need to reinstall the agent.<br/> 3) Recommend using multiple target Azure file shares (same or different storage account, based on performance requirements). |
| File server with a single volume and multiple shares to the same target Azure file share (consolidation) | Yes | You can't have multiple server endpoints per registered server syncing to same target Azure file share (same as the previous scenario). | Sync the root of the volume that holds multiple shares or top-level folders. |
| File server with multiple shares and/or volumes to multiple Azure file shares under a single storage account (1:1 share mapping) | Yes | A single Windows Server instance (or cluster) can sync up to 30 Azure file shares.<br/><br/> A storage account is a scale target for performance. IOPS and throughput are shared across file shares.<br/><br/> Keep the number of items per sync group within 100 million items (files and folders) per share. It's best to stay below 20 or 30 million per share. | 1) Use multiple sync groups (number of sync groups = number of Azure file shares to sync to).<br/>  2) Only 30 shares at a time can be synced in this scenario. If you have more than 30 shares on that file server, use share grouping and volume sync to reduce the number of root or top-level folders at the source.<br/> 3) Use additional Azure File Sync servers on-premises, and split or move data to these servers to work around limitations on the source Windows Server instance. |
| File server with multiple shares and/or volumes to multiple Azure file shares under a different storage account (1:1 share mapping) | Yes | A single Windows Server instance (or cluster) can sync up to 30 Azure file shares (same or different storage account).<br/><br/> Keep the number of items per sync group within 100 million items (files and folders) per share. It's best to stay below 20 or 30 million per share. | Same as the previous approach. |
| Multiple file servers with a single root volume or share to the same target Azure file share (consolidation) | No | A sync group can't use a cloud endpoint (Azure file share) that's already configured in another sync group.<br/><br/> Although a sync group can have server endpoints on different file servers, the files can't be distinct. | Follow the guidance in the first scenario, with the additional consideration of targeting one file server at a time. |
| Cross-tenant topology (using managed identity across tenants) | No | The Storage Sync Service, the server resource (Azure Arc–enabled server or Azure VM), the managed identity, and the RBAC assignments on the storage account must all be in the same Microsoft Entra tenant. Cross-tenant topologies aren’t supported. | Cross-tenant setups fail authentication and authorization, and the server can’t connect. To proceed, ensure all resources (Sync Service, server, managed identity, and RBAC assignments) are created in the same Microsoft Entra tenant. |

#### Create a mapping table

:::row:::
    :::column:::
        [![Diagram that shows an example of a mapping table. Download the following file to experience and use the content of this image.](media/storage-files-migration-namespace-mapping/namespace-mapping.png)](media/storage-files-migration-namespace-mapping/namespace-mapping-expanded.png#lightbox)
    :::column-end:::
    :::column:::
        Use the previous information to determine how many Azure file shares you need and which parts of your existing data will end up in which Azure file share.

        Create a table that records your thoughts so that you can refer to it when you need to. Staying organized is important, because losing details of your mapping plan can happen easily when you're provisioning many Azure resources at once. Download the following Excel file to use as a template to help create your mapping.

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
