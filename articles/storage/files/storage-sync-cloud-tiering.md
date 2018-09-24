---
title: Understanding Cloud Tiering | Microsoft Docs
description: Learn about Azure File Sync's feature Cloud Tiering
services: storage
author: sikoo
ms.service: storage
ms.topic: article
ms.date: 09/21/2018
ms.author: sikoo
ms.component: files
---

# Cloud tiering overview
Cloud tiering is an optional feature of Azure File Sync in which frequently accessed files are cached locally on the server while all other files are tiered to Azure Files based on policy settings. When a file is tiered, the Azure File Sync file system filter (StorageSync.sys) replaces the file locally with a pointer, or reparse point. The reparse point represents a URL to the file in Azure Files. A tiered file has both the "offline" attribute and the FILE_ATTRIBUTE_RECALL_ON_DATA_ACCESS attribute set in NTFS so that third-party applications can securely identify tiered files.
 
When a user opens a tiered file, Azure File Sync seamlessly recalls the file data from Azure Files without the user needing to know that the file is not stored locally on the system. 
 
 > [!Important]  
    > Important: Cloud tiering is not supported for server endpoints on the Windows system volumes, and only files greater than 64 KiB in size can be tiered to Azure Files.
    
Azure File Sync does not support tiering files smaller than 64 KiB as the performance overhead of tiering and recalling such small files would outweigh the space savings.

## How does cloud tiering work?
The Azure File Sync system filter builds a "heatmap" of your namespace on each server endpoint. It monitors accesses (read and write operations) over time and then, based on both the the frequency and recency of access, assigns a heat score to every file. A frequently accessed file that was just opened will be considered hot, whereas a file that is barely touched and has not been accessed for some time will be considered cool. When the file volume on a server exceeds the volume free space threshold you set, it will tier the coolest files to Azure Files until your free space percentage is met.

## How does the volume free space tiering policy work?
Volume free space is the amount of free space you wish to reserve on the volume on which a server endpoint is located. For example, if volume free space is set to 20% on a volume that has one server endpoint, up to 80% of the volume space will be occupied by the most recently accessed files, with any remaining files that do not fit into this space tiered up to Azure. Note that volume free space applies at the volume level rather than at the level of individual directories or sync groups. 

## How does the volume free space tiering policy work with regards to new server endpoints?
When a server endpoint is newly provisioned and connected to an Azure file share, the server will first pull down the namespace and then will pull down the actual files until it hits its volume free space threshold. This process is also known as fast disaster recovery or rapid namespace restore.

## How is volume free space interpreted when I have multiple server endpoints on a volume?
When there is more than one server endpoint on a volume, the effective volume free space threshold is the largest volume free space specified across any server endpoint on that volume. Files will be tiered according to their usage patterns regardless of which server endpoint to which they belong. For example, if you have two server endpoints on a volume, Endpoint1 and Endpoint2, where Endpoint1 has a volume free space threshold of 25% and Endpoint2 has a volume free space threshold of 50%, the volume free space threshold for both server endpoints will be 50%. 

## How do I determine the appropriate amount of volume free space?
The amount of data you should keep local is determined by a few factors: your bandwidth, your dataset's access pattern, and your budget. If you have a low-bandwidth connection, you may want to keep more of your data local to ensure there is minimal lag for your users. Otherwise, you can base it on the churn rate during a given period. For example, if you know that about 10% of your 1TB dataset changes or is actively accessed each month, then you may want to keep 100GB local so you are not frequently recalling files. If your volume is 2TB, then you will want to keep 5% (or 100GB) local, meaning the remaining 95% is your volume free space percentage. However, we recommend that you add a buffer to account for periods of higher churn – in other words, starting with a lower volume free space percentage and then adjusting it if needed later. 

Keeping more data local means lower egress costs as fewer files will be recalled from Azure, but also requires you to maintain a larger amount of on-premises storage, which comes at its own cost. Once you have an instance of Azure File Sync deployed, you can look at your storage account’s egress to roughly gauge whether your volume free space settings are appropriate for your usage. Assuming the storage account contains only your Azure File Sync Cloud Endpoint (that is, your sync share), then high egress means that many files are being recalled from the cloud, and you should consider increasing your local cache.

## Next steps
* [Planning for an Azure File Sync Deployment](storage-sync-files-planning.md)
