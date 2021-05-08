---
title: Understand Azure File Sync cloud tiering | Microsoft Docs
description: Understand cloud tiering, an optional Azure File Sync feature. Frequently accessed files are cached locally on the server; others are tiered to Azure Files.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 04/13/2021
ms.author: rogarana
ms.subservice: files
---

# Cloud tiering overview
Cloud tiering, an optional feature of Azure File Sync, decreases the amount of local storage required while keeping the performance of an on-premises file server.

When enabled, this feature stores only frequently accessed (hot) files on your local server. Infrequently accessed (cool) files are split into namespace (file and folder structure) and file content. The namespace is stored locally and the file content stored in an Azure file share in the cloud. 

When a user opens a tiered file, Azure File Sync seamlessly recalls the file data from the file share in Azure.

## How cloud tiering works

### Cloud tiering policies
When you enable cloud tiering, there are two policies that you can set to inform Azure File Sync when to tier cool files: the **volume free space policy** and the **date policy**. 

#### Volume free space policy
The **volume free space policy** tells Azure File Sync to tier cool files to the cloud when a certain amount of space is taken up on your local disk. 

For example, if your local disk capacity is 200 GB and you want at least 40 GB of your local disk capacity to always remain free, you should set the volume free space policy to 20%. Volume free space applies at the volume level rather than at the level of individual directories or server endpoints. 

To learn how the volume free space policy affects files initially downloaded when a new server endpoint is added, (see the [Sync policies that affect cloud tiering](#sync-policies-that-affect-cloud-tiering)) section.

#### Date policy
With the **date policy**, cool files are tiered to the cloud if they haven't been accessed (that is, read or written to) for x number of days. For example, if you noticed that files that have gone more than 15 days without being accessed are typically archival files, you should set your date policy to 15 days. 

For more examples on how the date policy and volume free space policy work together, see [Choose Azure File Sync cloud tiering policies](file-sync-choose-cloud-tiering-policies.md).

### Windows Server data deduplication
Data deduplication is supported on volumes that have cloud tiering enabled beginning with Windows Server 2016. For more details, please see [Planning for an Azure File Sync deployment](file-sync-planning.md#data-deduplication).

### Cloud tiering heatmap
Azure File Sync monitors file access (read and write operations) over time and, based on how frequent and recent access is, assigns a heat score to every file. It uses these scores to build a "heatmap" of your namespace on each server endpoint. This heatmap is a list of all syncing files in a location with cloud tiering enabled, ordered by their heat score. Frequently accessed files that were recently opened are considered hot, while files that were barely touched and haven't been accessed for some time are considered cool. 

To determine the relative position of an individual file in that heatmap, the system uses the maximum of its timestamps, in the following order: MAX(Last Access Time, Last Modified Time, Creation Time). 

Typically, last access time is tracked and available. However, when a new server endpoint is created, with cloud tiering enabled, not enough time has passed to observe file access. If there is no valid last access time, the last modified time is used instead, to evaluate the relative position in the heatmap.  

The date policy works the same way. Without a last access time, the date policy will act on the last modified time. If that is unavailable, it will fall back to the create time of a file. Over time, the system will observe more and more file access requests and automatically start to use the self-tracked last access time.

> [!Note]
> Cloud tiering does not depend on the NTFS feature for tracking last access time. This NTFS feature is off by default and due to performance considerations, we do not recommend that you manually enable this feature. Cloud tiering tracks last access time separately.

### Sync policies that affect cloud tiering

With Azure File Sync agent version 11, there are two additional Azure File Sync policies you can set that affects cloud tiering: **initial download** and **proactive recalling**.

#### Initial download

When a server is connecting to an Azure file share with files in it, you can now decide how you want the server to initially download the file share data. When cloud tiering is enabled, you have two options. 

![A screenshot of initial download when cloud tiering is enabled](media/storage-sync-cloud-tiering-overview/cloud-tiering-overview-3.png)  

The first option is to recall the namespace first, and then recall the file content by last-modified timestamp, until local disk capacity is reached. If you have enough disk space and you know that files that are last modified should be cached locally, this option is ideal. Files that are unable to be stored locally due to lack of disk space will be tiered.        

The second option is to initially recall the namespace only, and recall the file content only when accessed. This option is best if you want to minimize the capacity used on your local disk and want users to decide which files should be cached locally. All files will start off as tiered files with this option.

![A screenshot of initial download when cloud tiering is disabled](media/storage-sync-cloud-tiering-overview/cloud-tiering-overview-4.png)

When cloud tiering is disabled, you have a third option, which is to avoid tiered files all together. In this situation, files will only appear on the server once they are fully downloaded. If you have applications that require full files to be present and cannot tolerate tiered files in its namespace, this is ideal.      

#### Proactive recalling

When a file is created or modified, you can proactively recall a file to servers that you specify. This makes the new or modified file readily available for consumption in each specified server. 

For example, a globally distributed company has branch offices in the US and in India. In the morning (US time) information workers create a new folder and new files for a brand new project and work all day on it. Azure File Sync will sync folder and files to the Azure file share (cloud endpoint). Information workers in India will continue working on the project in their timezone. When they arrive in the morning, the local Azure File Sync enabled server in India needs to have these new files available locally, such that the India team can efficiently work off of a local cache. Enabling this mode prevents the initial file access to be slower because of on-demand recall and enables the server to proactively recall the files as soon as they were changed or created in the Azure file share.

If files recalled to the server are not actually needed locally, then the unnecessary recall can increase your egress traffic and costs. Therefore, only enable proactive recalling when you know that pre-populating a server's cache with recent changes from the cloud will have a positive effect on users or applications using the files on that server. 

Enabling proactive recalling may also result in increased bandwidth usage on the server and may cause other relatively new content on the local server to be aggressively tiered due to the increase in files being recalled. In turn, this may lead to more recalls if the files being tiered are considered hot by servers. 

:::image type="content" source="media/storage-sync-files-deployment-guide/proactive-download.png" alt-text="An image showing the Azure file share download behavior for a server endpoint currently in effect and a button to open a menu that allows to change it.":::

For more details on proactive recalling, see [Deploy Azure File Sync](file-sync-deployment-guide.md#proactively-recall-new-and-changed-files-from-an-azure-file-share).

## Tiered vs. locally cached file behavior

Cloud tiering is the separation between namespace (the file and folder hierarchy as well as file properties) and the file content. 

#### Tiered file

For tiered files, the size on disk is zero since the file content itself isn't being stored locally. When a file is tiered, the Azure File Sync file system filter (StorageSync.sys) replaces the file locally with a pointer (reparse point). The reparse point represents a URL to the file in the Azure file share. A tiered file has both the "offline" attribute and the FILE_ATTRIBUTE_RECALL_ON_DATA_ACCESS attribute set in NTFS so that third-party applications can securely identify tiered files.   

![A screenshot of a file's properties when it is tiered - namespace only.](media/storage-sync-cloud-tiering-overview/cloud-tiering-overview-2.png)    

#### Locally cached file

On the other hand, for a file stored in an on-premises file server, the size on disk is about equal to the logical size of the file since the entire file (file attributes + file content) is stored locally.     

![A screenshot of a file's properties when it is not tiered - namespace + file content.](media/storage-sync-cloud-tiering-overview/cloud-tiering-overview-1.png) 

It's also possible for a file to be partially tiered (or partially recalled). In a partially tiered file, part of the file is on disk. This might occur when files are partially read by applications like multimedia players or zip utilities that support streaming access to files. Azure File Sync is smart and recalls only the requested information from the connected Azure file share.

> [!NOTE]
> Size represents the logical size of the file. Size on disk represents the physical size of the file stream that's stored on the disk.

## Next steps

* [Choose Azure File Sync cloud tiering policies](file-sync-choose-cloud-tiering-policies.md)
* [Planning for an Azure File Sync deployment](file-sync-planning.md)