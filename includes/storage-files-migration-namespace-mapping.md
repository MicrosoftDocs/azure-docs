---
title: Map a folder structure to an Azure File Sync topology
description: Mapping an existing file and folder structure to Azure file shares for use with Azure File Sync. A common text block, shared between migration docs.
author: fauhse
ms.service: storage
ms.topic: conceptual
ms.date: 2/20/2020
ms.author: fauhse
ms.subservice: files
---

In this step, you are evaluating how many Azure file shares you need. A single Windows Server (or cluster) can sync up to 30 Azure file shares.

You may have more folders on your volumes that you currently share out locally as SMB shares to your users and apps. The easiest would be to envision for an on-premises share to map 1:1 to an Azure file share. If you have a small enough number, below 30 for a single Windows Server, then a 1:1 mapping is recommended.

If you have more shares than 30, it is often unnecessary to map an on-premises share 1:1 to an Azure file share.
Consider the following options:

#### Share grouping

For instance, if your HR department has a total of 15 shares, then you could consider storing all of the HR data in a single Azure file share. Storing multiple on-premises shares in one Azure file share does not prevent you from creating the usual 15 SMB shares on your local Windows Server. It only means that you organize the root folders of these 15 shares as subfolders under a common folder. You then sync this common folder to an Azure file share. That way, only a single Azure file share in the cloud is needed for this group of on-premises shares.

#### Volume sync

Azure File Sync supports syncing the root of a volume to an Azure file share.
If you sync the root folder, then all subfolders and files will end up in the same Azure file share.

Synching the root of the volume will not always be the best answer. There are benefits in syncing multiple locations, doing so helps keep the number of items lower per sync scope. Setting up Azure File Sync with a lower number of items is not just beneficial for file sync. A lower number of items also benefits other scenarios like:

* cloud-side restore from an Azure file share snapshot taken as a backup
* disaster recovery of an on-premises server can speed up significantly
* changes made directly in an Azure file share (outside of sync) can be detected and synced faster

#### A structured approach to a deployment map

Before deploying cloud storage in a subsequent step, it is important to create a map between on-premises folders and Azure file shares. This mapping will then inform how many and which Azure File Sync "sync group" resources you will provision. A sync group ties the Azure file share and the folder on your server together and establishes a sync connection.

To make the decision about how many Azure file shares you need, review the following limits and best practices. Doing so will help you optimize your map:

* A server with the Azure File Sync agent installed, can sync with up to 30 Azure file shares.
* An Azure file share is deployed inside of a storage account. That makes the storage account a scale target for performance numbers such as IOPS and throughput. Two standard (not premium) Azure file shares could theoretically saturate the maximum performance a storage account can deliver. If you plan to only attach Azure File Sync to these file shares, then grouping several Azure file shares into the same storage account is not creating a problem. Review the Azure file share performance targets for deeper insight into the relevant metrics to consider. If you plan on lifting an app to Azure that will use the Azure file share natively, then you might need more performance from your Azure file share. If this is a possibility, even in the future, then mapping an Azure file share to its own storage account is best.
* There is a limit of 250 storage accounts per subscription in a single Azure region.

> [!TIP]
> With this information in mind, it often becomes necessary to group multiple top-level folders on your volumes into a common, new root directory. You will then sync this new root directory and all the folders you grouped into it, to a single Azure file share.                                                    

This technique allows you to stay within the 30 Azure file share sync limit per server.
This grouping under a common root has no impact on access to your data. Your ACLs stay as is, you would only need to adjust any share paths (like SMB or NFS shares) you might have on the server folders that you now changed into a common root. Nothing else changes.

Another important aspect of Azure File Sync and a balanced performance and experience is an understanding of the scale factors for Azure File Sync performance. Obviously, when files are synced over the internet, larger files take more time and bandwidth to sync.

> [!IMPORTANT]
> The most important scale vector for Azure File Sync is the number of items (files and folders) that need to be synchronized.

Azure File Sync supports syncing up to 100,000 items to a single Azure file share. This limit can be exceeded and only depicts what the Azure File Sync team tests on a regular basis.

It is a best practice to keep the number of items per sync scope low. That aspect is an important factor to be considered in your mapping of folders to Azure file shares.

Even if in your situation a set of folders can logically sync to the same Azure file share (using the new, common root folder approach from above) it might still be better to regroup folders such that they sync to two instead of one Azure file share. This approach can be used to keep the number of files and folders per file share balanced across the server.

#### Create a mapping table

:::row:::
    :::column:::
        [![](media/storage-files-migration-namespace-mapping/namespace-mapping.png "An example of a mapping table. Download the file below to experience and use the content of this image.")](media/storage-files-migration-namespace-mapping/namespace-mapping-expanded.png#lightbox)
    :::column-end:::
    :::column:::
        Use a combination of the previous concepts to help determine how many Azure file shares you need, and which parts of your existing data will end up in which Azure file share.
        
        Create a table that records your thoughts, such that you can refer to it in the next step. Staying organized is important as it can be easy to lose details of your mapping plan when provisioning many Azure resources at once. To help you in creating a complete mapping, you can download a Microsoft Excel file as a template.

[//]: # (HTML appears as the only way to accomplish adding a nested two-column table with working image parsing and text/hyperlink on the same line.)

<br>
<table>
    <tr>
        <td>
            <img src="media/storage-files-migration-namespace-mapping/excel.png" alt="Microsoft Excel file icon that helps to set the context for the type of file download for the link next to it.">
        </td>
        <td>
            <a href="https://download.microsoft.com/download/1/8/D/18DC8184-E7E2-45EF-823F-F8A36B9FF240/Azure File Sync - Namespace Mapping.xlsx">Download a namespace-mapping template.</a>
        </td>
    </tr>
</table>
    :::column-end:::
:::row-end:::
