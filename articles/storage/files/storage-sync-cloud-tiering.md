---
title: Understanding Azure File Sync Cloud Tiering | Microsoft Docs
description: Learn about Azure File Sync's feature Cloud Tiering
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 06/15/2020
ms.author: rogarana
ms.subservice: files
---

# Cloud Tiering Overview
Cloud tiering is an optional feature of Azure File Sync in which frequently accessed files are cached locally on the server while all other files are tiered to Azure Files based on policy settings. When a file is tiered, the Azure File Sync file system filter (StorageSync.sys) replaces the file locally with a pointer, or reparse point. The reparse point represents a URL to the file in Azure Files. A tiered file has both the "offline" attribute and the FILE_ATTRIBUTE_RECALL_ON_DATA_ACCESS attribute set in NTFS so that third-party applications can securely identify tiered files.
 
When a user opens a tiered file, Azure File Sync seamlessly recalls the file data from Azure Files without the user needing to know that the file is stored in Azure. 
 
 > [!Important]  
 > Cloud tiering is not supported on the Windows system volume.
    
 > [!Important]  
 > To recall files that have been tiered, the network bandwidth should be at least 1 Mbps. If network bandwidth is less than 1 Mbps, files may fail to recall with a timeout error.

## Cloud Tiering FAQ

<a id="afs-cloud-tiering"></a>
### How does cloud tiering work?
The Azure File Sync system filter builds a "heatmap" of your namespace on each server endpoint. It monitors accesses (read and write operations) over time and then, based on both the frequency and recency of access, assigns a heat score to every file. A frequently accessed file that was recently opened will be considered hot, whereas a file that is barely touched and has not been accessed for some time will be considered cool. When the file volume on a server exceeds the volume free space threshold you set, it will tier the coolest files to Azure Files until your free space percentage is met.

Additionally, you can specify a date policy on each server endpoint that will tier any files not accessed within a specified number of days, regardless of available local storage capacity. This is a good choice to proactively free up local disk space if you know that files in that server endpoint don't need to be retained locally beyond a certain age. That frees up valuable local disk capacity for other endpoints on the same volume, to cache more of their files.

The cloud tiering heatmap is essentially an ordered list of all the files that are syncing and are in a location that has cloud tiering enabled. To determine the relative position of an individual file in that heatmap, the system uses the maximum of either of the following timestamps, in that order: MAX(Last Access Time, Last Modified Time, Creation Time). Typically, last access time is tracked and available. However, when a new server endpoint is created, with cloud tiering enabled, then initially not enough time has passed to observe file access. In the absence of a last access time, the last modified time is used to evaluate the relative position in the heatmap. The same fallback is applicable to the date policy. Without a last access time, the date policy will act on the last modified time. Should that be unavailable, it will fall back to the create time of a file. Over time, the system will observe more and more file access requests and pivot to predominantly use the self-tracked last access time.

Cloud tiering does not depend on the NTFS feature for tracking last access time. This NTFS feature is off by default and due to performance considerations, we do not recommend that you manually enable this feature. Cloud tiering tracks last access time separately and very efficiently.

<a id="tiering-minimum-file-size"></a>
### What is the minimum file size for a file to tier?

For agent versions 9 and newer, the minimum file size for a file to tier is based on the file system cluster size. The following table illustrates the minimum file sizes that can be tiered, based on the volume cluster size:

|Volume cluster size (Bytes) |Files of this size or larger can be tiered  |
|----------------------------|---------|
|4 KB (4096)                 | 8 KB    |
|8 KB (8192)                 | 16 KB   |
|16 KB (16384)               | 32 KB   |
|32 KB (32768) and larger    | 64 KB   |

All file systems that are used by Windows organize your hard disk based on cluster size (also known as allocation unit size). Cluster size represents the smallest amount of disk space that can be used to hold a file. When file sizes do not come out to an even multiple of the cluster size, additional space must be used to hold the file (up to the next multiple of the cluster size).

Azure File Sync is supported on NTFS volumes with Windows Server 2012 R2 and newer. The following table describes the default cluster sizes when you create a new NTFS volume. 

|Volume size    |Windows Server 2012R2 and newer |
|---------------|---------------|
|7 MB – 16 TB   | 4 KB          |
|16TB – 32 TB   | 8 KB          |
|32TB – 64 TB   | 16 KB         |
|64TB – 128 TB  | 32 KB         |
|128TB – 256 TB | 64 KB         |
|> 256 TB       | Not supported |

It is possible that upon creation of the volume, you manually formatted the volume with a different cluster (allocation unit) size. If your volume stems from an older version of Windows, default cluster sizes may also be different. [This article has more details on default cluster sizes.](https://support.microsoft.com/help/140365/default-cluster-size-for-ntfs-fat-and-exfat)

<a id="afs-volume-free-space"></a>
### How does the volume free space tiering policy work?
Volume free space is the amount of free space you wish to reserve on the volume on which a server endpoint is located. For example, if volume free space is set to 20% on a volume that has one server endpoint, up to 80% of the volume space will be occupied by the most recently accessed files, with any remaining files that do not fit into this space tiered up to Azure. Volume free space applies at the volume level rather than at the level of individual directories or sync groups. 

<a id="volume-free-space-fastdr"></a>
### How does the volume free space tiering policy work with regards to new server endpoints?
When a server endpoint is newly provisioned and connected to an Azure file share, the server will first pull down the namespace and then will pull down the actual files until it hits its volume free space threshold. This process is also known as fast disaster recovery or rapid namespace restore.

<a id="afs-effective-vfs"></a>
### How is volume free space interpreted when I have multiple server endpoints on a volume?
When there is more than one server endpoint on a volume, the effective volume free space threshold is the largest volume free space specified across any server endpoint on that volume. Files will be tiered according to their usage patterns regardless of which server endpoint to which they belong. For example, if you have two server endpoints on a volume, Endpoint1 and Endpoint2, where Endpoint1 has a volume free space threshold of 25% and Endpoint2 has a volume free space threshold of 50%, the volume free space threshold for both server endpoints will be 50%. 

<a id="date-tiering-policy"></a>
### How does the date tiering policy work in conjunction with the volume free space tiering policy? 
When enabling cloud tiering on a server endpoint, you set a volume free space policy. It always takes precedence over any other policies, including the date policy. Optionally, you can enable a date policy for each server endpoint on that volume. This policy manages that only files accessed (that is, read or written to) within the range of days this policy describes will be kept local. Files not accessed with the number of days specified, will be tiered. 

Cloud Tiering uses the last access time to determine which files should be tiered. The cloud tiering filter driver (storagesync.sys) tracks last access time and logs the information in the cloud tiering heat store. You can see the heat store using a local PowerShell cmdlet.

```powershell
Import-Module '<SyncAgentInstallPath>\StorageSync.Management.ServerCmdlets.dll'
Get-StorageSyncHeatStoreInformation '<LocalServerEndpointPath>'
```

> [!IMPORTANT]
> The last-accessed-timestamp is not a property tracked by NTFS and therefore not visible by default in File Explorer. Don't use the last-modified-timestamp on a file to check whether the date-policy works as expected. This timestamp only tracks writes, not reads. Use the cmdlet shown to get the last-accessed-timestamp for this evaluation.

> [!WARNING]
> Don't turn on the NTFS feature of tracking last-accessed-timestamp for files and folders. This feature is off by default because it has a large performance impact. Azure File Sync will track last-accessed times automatically and very efficiently and does not utilize this NTFS feature.

Keep in mind that the volume free space policy always takes precedence, and when there isn't enough free space on the volume to retain as many days worth of files as described by the date policy, Azure File Sync will continue tiering the coldest files until the volume free space percentage is met.

For example, say you have a date-based tiering policy of 60 days and a volume free space policy of 20%. If, after applying the date policy, there is less than 20% of free space on the volume, the volume free space policy will kick in and override the date policy. This will result in more files being tiered, such that the amount of data kept on the server may be reduced from 60 days of data to 45 days. Conversely, this policy will force the tiering of files that fall outside of your time range even if you have not hit your free space threshold – so a file that is 61 days old will be tiered even if your volume is empty.

<a id="volume-free-space-guidelines"></a>
### How do I determine the appropriate amount of volume free space?
The amount of data you should keep local is determined by a few factors: your bandwidth, your dataset's access pattern, and your budget. If you have a low-bandwidth connection, you may want to keep more of your data local to ensure there is minimal lag for your users. Otherwise, you can base it on the churn rate during a given period. For example, if you know that about 10% of your 1 TB dataset changes or is actively accessed each month, then you may want to keep 100 GB local so you are not frequently recalling files. If your volume is 2TB, then you will want to keep 5% (or 100 GB) local, meaning the remaining 95% is your volume free space percentage. However, we recommend that you add a buffer to account for periods of higher churn – in other words, starting with a lower volume free space percentage, and then adjusting it if needed later. 

Keeping more data local means lower egress costs as fewer files will be recalled from Azure, but also requires you to maintain a larger amount of on-premises storage, which comes at its own cost. Once you have an instance of Azure File Sync deployed, you can look at your storage account's egress to roughly gauge whether your volume free space settings are appropriate for your usage. Assuming the storage account contains only your Azure File Sync Cloud Endpoint (that is, your sync share), then high egress means that many files are being recalled from the cloud, and you should consider increasing your local cache.

<a id="how-long-until-my-files-tier"></a>
### I've added a new server endpoint. How long until my files on this server tier?

Whether or not files need to be tiered per set policies is evaluated once an hour. You can encounter two situations when a new server endpoint is created:

1. When you add a new server endpoint, then often files exist in that server location. They need to be uploaded first, before cloud tiering can begin. The volume free space policy will not begin its work until initial upload of all files has finished. However, the optional date policy will begin to work on an individual file basis, as soon as a file has been uploaded. The one-hour interval applies here as well. 
2. When you add a new server endpoint, it is possible that you connect an empty server location to an Azure file share with your data in it. Whether that is for a second server or during a disaster recovery situation. If you choose to download the namespace and recall content during initial download to your server, then after the namespace comes down, files will be recalled based on the last modified timestamp. Only as many files will be recalled as fit within the volume free space policy and the optional date policy.

<a id="is-my-file-tiered"></a>
### How can I tell whether a file has been tiered?
There are several ways to check whether a file has been tiered to your Azure file share:
    
   *  **Check the file attributes on the file.**
     Right-click on a file, go to **Details**, and then scroll down to the **Attributes** property. A tiered file has the following attributes set:     
        
        | Attribute letter | Attribute | Definition |
        |:----------------:|-----------|------------|
        | A | Archive | Indicates that the file should be backed up by backup software. This attribute is always set, regardless of whether the file is tiered or stored fully on disk. |
        | P | Sparse file | Indicates that the file is a sparse file. A sparse file is a specialized type of file that NTFS offers for efficient use when the file on the disk stream is mostly empty. Azure File Sync uses sparse files because a file is either fully tiered or partially recalled. In a fully tiered file, the file stream is stored in the cloud. In a partially recalled file, that part of the file is already on disk. If a file is fully recalled to disk, Azure File Sync converts it from a sparse file to a regular file. This attribute is only set on Windows Server 2016 and older.|
        | M | Recall on data access | Indicates that the file's data is not fully present on local storage. Reading the file will cause at least some of the file content to be fetched from an Azure file share to which the server endpoint is connected. This attribute is only set on Windows Server 2019. |
        | L | Reparse point | Indicates that the file has a reparse point. A reparse point is a special pointer for use by a file system filter. Azure File Sync uses reparse points to define to the Azure File Sync file system filter (StorageSync.sys) the cloud location where the file is stored. This supports seamless access. Users won't need to know that Azure File Sync is being used or how to get access to the file in your Azure file share. When a file is fully recalled, Azure File Sync removes the reparse point from the file. |
        | O | Offline | Indicates that some or all of the file's content is not stored on disk. When a file is fully recalled, Azure File Sync removes this attribute. |

        ![The Properties dialog box for a file, with the Details tab selected](media/storage-files-faq/azure-file-sync-file-attributes.png)
        
        You can see the attributes for all the files in a folder by adding the **Attributes** field to the table display of File Explorer. To do this, right-click on an existing column (for example, **Size**), select **More**, and then select **Attributes** from the drop-down list.
        
   * **Use `fsutil` to check for reparse points on a file.**
       As described in the preceding option, a tiered file always has a reparse point set. A reparse pointer is a special pointer for the Azure File Sync file system filter (StorageSync.sys). To check whether a file has a reparse point, in an elevated Command Prompt or PowerShell window, run the `fsutil` utility:
    
        ```powershell
        fsutil reparsepoint query <your-file-name>
        ```

        If the file has a reparse point, you can expect to see **Reparse Tag Value: 0x8000001e**. This hexadecimal value is the reparse point value that is owned by Azure File Sync. The output also contains the reparse data that represents the path to your file on your Azure file share.

        > [!WARNING]  
        > The `fsutil reparsepoint` utility command also has the ability to delete a reparse point. Do not execute this command unless the Azure File Sync engineering team asks you to. Running this command might result in data loss. 

<a id="afs-recall-file"></a>
### A file I want to use has been tiered. How can I recall the file to disk to use it locally?
The easiest way to recall a file to disk is to open the file. The Azure File Sync file system filter (StorageSync.sys) seamlessly downloads the file from your Azure file share without any work on your part. For file types that can be partially read from, such as multimedia or .zip files, opening a file doesn't download the entire file.

You also can use PowerShell to force a file to be recalled. This option might be useful if you want to recall multiple files at once, such as all the files in a folder. Open a PowerShell session to the server node where Azure File Sync is installed, and then run the following PowerShell commands:
    
```powershell
Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
Invoke-StorageSyncFileRecall -Path <path-to-to-your-server-endpoint>
```
Optional parameters:
* `-Order CloudTieringPolicy` will recall the most recently modified or accessed files first and is allowed by the current tiering policy. 
	* If volume free space policy is configured, files will be recalled until the volume free space policy setting is reached. For example if the volume free policy setting is 20%, recall will stop once the volume free space reaches 20%.  
	* If volume free space and date policy is configured, files will be recalled until the volume free space or date policy setting is reached. For example, if the volume free policy setting is 20% and the date policy is 7 days, recall will stop once the volume free space reaches 20% or all files accessed or modified within 7 days are local.
* `-ThreadCount` determines how many files can be recalled in parallel.
* `-PerFileRetryCount`determines how often a recall will be attempted of a file that is currently blocked.
* `-PerFileRetryDelaySeconds`determines the time in seconds between retry to recall attempts and should always be used in combination with the previous parameter.

Example:
```powershell
Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
Invoke-StorageSyncFileRecall -Path <path-to-to-your-server-endpoint> -ThreadCount 8 -Order CloudTieringPolicy -PerFileRetryCount 3 -PerFileRetryDelaySeconds 10
``` 

> [!Note]  
> - The Invoke-StorageSyncFileRecall cmdlet can also be used to improve file download performance when adding a new server endpoint to an existing sync group.  
>- If the local volume hosting the server does not have enough free space to recall all the tiered data, the `Invoke-StorageSyncFileRecall` cmdlet fails.  

<a id="sizeondisk-versus-size"></a>
### Why doesn't the *Size on disk* property for a file match the *Size* property after using Azure File Sync? 
Windows File Explorer exposes two properties to represent the size of a file: **Size** and **Size on disk**. These properties differ subtly in meaning. **Size** represents the complete size of the file. **Size on disk** represents the size of the file stream that's stored on the disk. The values for these properties can differ for a variety of reasons, such as compression, use of Data Deduplication, or cloud tiering with Azure File Sync. If a file is tiered to an Azure file share, the size on the disk is zero, because the file stream is stored in your Azure file share, and not on the disk. It's also possible for a file to be partially tiered (or partially recalled). In a partially tiered file, part of the file is on disk. This might occur when files are partially read by applications like multimedia players or zip utilities. 

<a id="afs-force-tiering"></a>
### How do I force a file or directory to be tiered?

> [!NOTE]
> When you select a directory to be tiered, only the files currently in the directory are tiered. Any files created after that time aren't automatically tiered.

When the cloud tiering feature is enabled, cloud tiering automatically tiers files based on last access and modify times to achieve the volume free space percentage specified on the cloud endpoint. Sometimes, though, you might want to manually force a file to tier. This might be useful if you save a large file that you don't intend to use again for a long time, and you want the free space on your volume now to use for other files and folders. You can force tiering by using the following PowerShell commands:

```powershell
Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
Invoke-StorageSyncCloudTiering -Path <file-or-directory-to-be-tiered>
```

<a id="afs-image-thumbnail"></a>
### Why are my tiered files not showing thumbnails or previews in Windows Explorer?
For tiered files, thumbnails and previews won't be visible at your server endpoint. This behavior is expected since the thumbnail cache feature in Windows intentionally skips reading files with the offline attribute. With Cloud Tiering enabled, reading through tiered files would cause them to be downloaded (recalled).

This behavior is not specific to Azure File Sync, Windows Explorer displays a "grey X" for any files that have the offline attribute set. You will see the X icon when accessing files over SMB. For a detailed explanation of this behavior, refer to [https://blogs.msdn.microsoft.com/oldnewthing/20170503-00/?p=96105](https://blogs.msdn.microsoft.com/oldnewthing/20170503-00/?p=96105)

<a id="afs-tiering-disabled"></a>
### I have cloud tiering disabled, why are there tiered files in the server endpoint location?

There are two reasons why tiered files may exist in the server endpoint location:

- When adding a new server endpoint to an existing sync group, the metadata is first synced to the server and the files are then downloaded to the server in the background. The files will show as tiered until they're downloaded locally. To improve the file download performance when adding a new server to a sync group, use the [Invoke-StorageSyncFileRecall](storage-sync-cloud-tiering.md#afs-recall-file) cmdlet.

- If cloud tiering was enabled on the server endpoint and then disabled, files will remain tiered until they're accessed.


## Next Steps
* [Planning for an Azure File Sync Deployment](storage-sync-files-planning.md)
