---
title: Choosing Cloud Tiering Policies | Microsoft Docs
description: Details on how to choose a cloud tiering policy and how the date and volume free space policy work together.
author: mtalasila
ms.service: storage
ms.topic: conceptual
ms.date: 11/18/2020
ms.author: mtalasila
ms.subservice: files
---

# Choosing cloud tiering policies

## I'm new to cloud tiering

If you intend to enable cloud tiering for a server endpoint, we recommend creating one local virtual drive per server endpoint. Isolating the server endpoint makes it easier to understand how cloud tiering works and adjust your policy accordingly. However, Azure File Sync will still work if you have multiple server endpoints and/or other applications on the same drive. We also recommend that when you first enable cloud tiering, you keep the date policy disabled and volume free space at around 10% to 20%. After setting your policies, monitor egress (see [Monitoring cloud tiering](storage-sync-monitoring-cloud-tiering.md)) and adjust both policies accordingly. 20% volume free space seems to be the best option for the majority of general purpose file server volumes.

For simplicity and to have a clear understanding of how items will be tiered, we recommend you primarily adjust your volume free space policy and keep your date policy disabled unless needed. We recommend this because most customers find it valuable to fill the local cache with as many hot files as possible and tier the rest to the cloud. However, the date policy may be beneficial if you want to proactively free up local disk space and you know that files in that server endpoint accessed after the number of days specified in the policy don't need to be kept locally. Setting the date policy frees up valuable local disk capacity for other endpoints on the same volume to cache more of their files.

## How both policies work together

Keep in mind that the volume free space policy always takes precedence. Therefore, when there isn't enough free space on the volume to store as many days worth of files as described by the date policy, Azure File Sync will continue tiering the coldest files until the volume free space percentage is met. 

Let's take a scenario. Say you have the following files in a cloud file share. The capacity of the local volume hosting the server endpoint is 1000 GB and cloud tiering was never enabled.

|File Name |Last Access Time  |File Size  |Stored In |
|----------|------------------|-----------|----------|
|File 1    | 2 days ago  | 10 GB | Server and Azure file share
|File 2    | 10 days ago | 30 GB | Server and Azure file share
|File 3    | 1 year ago | 100 GB | Server and Azure file share
|File 4    | 1 year, 2 days ago | 130 GB | Server and Azure file share
|File 5    | 2 years, 1 day ago | 140 GB | Server and Azure file share
|File 6    | 2 years ago | 20 GB | Server and Azure file share
|File 7    | 2 years, 80 days ago  | 700 GB | Server and Azure file share
|File 8    | 3 years ago  | 100 GB | Server and Azure file share
|File 9    | 3 years, 1 day ago | 10 GB | Server and Azure file share

Let's say you enable cloud tiering and set a volume free space policy of 20% and keep the date policy disabled. Cloud tiering will now ensure 20% (in this case 200 GB) of space are kept free and available for users to store new files or change existing files. As a result, the total capacity of the local cache is 800 GB. This capacity will be used to store the most recently and frequently accessed files on the local volume. 

Looking at the table above, with this policy, only Files 1 through 6 would be stored in the local cache, and Files 7 through 9 would be tiered. Although this is only 430 GB out of the 800 GB that can be used, the next most recently accessed file (File 7) is 700 GB, which would put us over the 800-GB limit if that file was locally cached. However, say a user accesses File 7. Now, File 7 is the most recently accessed file in the file share. As a result, File 7 would be stored in the local cache and to fit under the 800-GB limit, Files 3 through 6 would be tiered. Below is the updated table, with the new access time for File 7.

|File Name |Last Access Time  |File Size  |Stored In |
|----------|------------------|-----------|----------|
|File 7    | 2 hours ago  | 700 GB | Server and Azure file share
|File 1    | 2 days ago  | 10 GB | Server and Azure file share
|File 2    | 10 days ago | 30 GB | Server and Azure file share
|File 3    | 1 year ago | 100 GB | Azure file share, tiered locally
|File 4    | 1 year, 2 days ago | 130 GB | Azure file share, tiered locally
|File 5    | 2 years, 1 day ago | 140 GB | Azure file share, tiered locally
|File 6    | 2 years ago | 20 GB | Azure file share, tiered locally
|File 8    | 3 years ago  | 100 GB | Azure file share, tiered locally
|File 9    | 3 years, 1 day ago | 10 GB | Azure file share, tiered locally

A few hours later, you decide to change the policy to a date-based tiering policy of 60 days and a volume free space policy of 30%. Now, only up to 700 GB can be stored in the local cache. Although files 1 and 2 have been accessed less than 60 days ago, the volume free space policy kicks in, overrides the date policy, and tiers File 1 and File 2 to maintain the 30% free space on the local volume. 

Say File 7 is accessed again and half the file is deleted. Now, the file size of File 7 is only 350 GB. Here is the updated table.

|File Name |Last Access Time  |File Size  |Stored In |
|----------|------------------|-----------|----------|
|File 7    | 1 hour ago  | 350 GB | Server and Azure file share
|File 1    | 2 days ago  | 10 GB | Server and Azure file share
|File 2    | 10 days ago | 30 GB | Server and Azure file share
|File 3    | 1 year ago | 100 GB | Azure file share, tiered locally
|File 4    | 1 year, 2 days ago | 130 GB | Azure file share, tiered locally
|File 5    | 2 years, 1 day ago | 140 GB | Azure file share, tiered locally
|File 6    | 2 years ago | 20 GB | Azure file share, tiered locally
|File 8    | 3 years ago  | 100 GB | Azure file share, tiered locally
|File 9    | 3 years, 1 day ago | 10 GB | Azure file share, tiered locally

In this case, Files 1, 2 and 7 would be locally cached and Files 3 through 9 would be tiered. This is because although the volume free space policy allows for up to 700 GB in the local cache and Files 1, 2, and 7 only take up 390 GB, the date policy is 60 days, which means Files 3 through 9 don't make the cutoff. 

> [!NOTE] 
> When customers change the volume free space policy to a smaller value, we will not automatically recall files.

Cloud tiering uses the last access time and the access frequency of a file to determine which files should be tiered. The cloud tiering filter driver (storagesync.sys) tracks last access time and logs the information in the cloud tiering heat store. You can retrieve the heat store and save it into a CSV file by using a server-local PowerShell cmdlet.

There is a single heat store for files on a volume/server endpoint/individual file. The heat store can get very large. If you only need to retrieve the "coolest" number of items, use -Limit and a number.

- Import the PowerShell module:
    `Import-Module '<SyncAgentInstallPath>\StorageSync.Management.ServerCmdlets.dll'`

- VOLUME FREE SPACE: To get the order in which files will be tiered using the volume free space policy:
    `Get-StorageSyncHeatStoreInformation -VolumePath '<DriveLetter>:\' -ReportDirectoryPath '<FolderPathToStoreResultCSV>' -IndexName FilesToBeTieredBySpacePolicy`

- DATE POLICY: To get the order in which files will be tiered using the date policy:
    `Get-StorageSyncHeatStoreInformation -VolumePath '<DriveLetter>:\' -ReportDirectoryPath '<FolderPathToStoreResultCSV>' -IndexName FilesToBeTieredByDatePolicy`

- Find the heat store information for a particular file:
    `Get-StorageSyncHeatStoreInformation -FilePath '<PathToSpecificFile>'`

- See all files in descending order by last access time:
    `Get-StorageSyncHeatStoreInformation -VolumePath '<DriveLetter>:\' -ReportDirectoryPath '<FolderPathToStoreResultCSV>' -IndexName DescendingLastAccessTime`

- See the order by which tiered files will be recalled by background recall or on-demand recall through PowerShell:
    `Get-StorageSyncHeatStoreInformation -VolumePath '<DriveLetter>:\' -ReportDirectoryPath '<FolderPathToStoreResultCSV>' -IndexName OrderTieredFilesWillBeRecalled`

## Multiple server endpoints on local volume

It's possible to enable cloud tiering with multiple server endpoints on a single local volume. In this case, we strongly recommend that you set the volume free space to the same amount to all the server endpoints on the same volume. However, if you set the volume free space to different percentages, the largest volume free space percentage will take precedence. 

For example, if you have server endpoint 1 with 15% volume free space, server endpoint 2 with 20% volume free space, and server endpoint 3 with 30% volume free space, all server endpoints will automatically begin to tier the coldest files when the volume has less than 30% free space available. 

## Understanding egress

To get a better idea of how much egress is from cloud tiering and which applications are doing the recalling, we recommend looking at the cloud tiering recall size and cloud tiering recall size by application metrics in Azure Monitor. More information can be found in [Monitoring cloud tiering](storage-sync-monitoring-cloud-tiering.md). 

If your cloud tiering recall size is larger than you hoped for, we recommend first increasing your local volume size if possible, and/or decreasing your volume free space policy percentage in small increments. Higher churn requires more free space for recall before tiering kicks in, which is why we recommend increasing your local volume size as a first line of action. 

Keeping more data local means lower egress costs as fewer files will be recalled from Azure, but also requires a larger amount of on-premises storage which comes at its own cost. 

When adjusting your volume free space policy, keep in mind that the amount of data you should keep local is determined by a few factors: your bandwidth, your dataset's access pattern, and your budget. If you have a low-bandwidth connection, you may want to keep more of your data local to ensure there is minimal lag for your users. Otherwise, you can base it on the churn rate during a given period. For example, if you know that about 10% of your 1-TB dataset changes or is actively accessed each month, then you may want to keep 100 GB local so you are not frequently recalling files. If your volume is 2 TB, then you will want to keep 5% (or 100 GB) local, meaning the remaining 95% is your volume free space percentage. However, we recommend that you add a buffer to account for periods of higher churn – in other words, starting with a larger volume free space percentage, and then adjusting it if needed later.

## Are my files being tiered?

Whether or not files need to be tiered per set policies is evaluated once an hour. You can come across two situations when a new server endpoint is created:

When you first add a new server endpoint, often files exist in that server location. They need to be uploaded before cloud tiering can begin. The volume free space policy will not begin its work until initial upload of all files has finished. However, the optional date policy will begin to work on an individual file basis, as soon as a file has been uploaded. The one-hour interval applies here as well. 

When you add a new server endpoint, it is possible you connected an empty server location to an Azure file share with your data in it. If you choose to download the namespace and recall content during initial download to your server, then after the namespace comes down, files will be recalled based on the last modified timestamp till the volume free space policy and the optional date policy limits are reached.

There are several ways to check whether a file has been tiered to your Azure file share:
    
   *  **Check the file attributes on the file.**
     Right-click on a file, go to **Details**, and then scroll down to the **Attributes** property. A tiered file has the following attributes set:     
        
        | Attribute letter | Attribute | Definition |
        |:----------------:|-----------|------------|
        | A | Archive | Indicates that the file should be backed up by backup software. This attribute is always set, regardless of whether the file is tiered or stored fully on disk. |
        | P | Sparse file | Indicates that the file is a sparse file. A sparse file is a specialized type of file that NTFS offers for efficient use when the file on the disk stream is mostly empty. Azure File Sync uses sparse files because a file is either fully tiered or partially recalled. In a fully tiered file, the file stream is stored in the cloud. In a partially recalled file, that part of the file is already on disk. This might occur when files are partially read by applications like multimedia players or zip utilities. If a file is fully recalled to disk, Azure File Sync converts it from a sparse file to a regular file. This attribute is only set on Windows Server 2016 and older.|
        | M | Recall on data access | Indicates that the file's data is not fully present on local storage. Reading the file will cause at least some of the file content to be fetched from an Azure file share to which the server endpoint is connected. This attribute is only set on Windows Server 2019. |
        | L | Reparse point | Indicates that the file has a reparse point. A reparse point is a special pointer for use by a file system filter. Azure File Sync uses reparse points to define to the Azure File Sync file system filter (StorageSync.sys) the cloud location where the file is stored. This supports seamless access. Users won't need to know that Azure File Sync is being used or how to get access to the file in your Azure file share. When a file is fully recalled, Azure File Sync removes the reparse point from the file. |
        | O | Offline | Indicates that some or all of the file's content is not stored on disk. When a file is fully recalled, Azure File Sync removes this attribute. |

        ![The Properties dialog box for a file, with the Details tab selected](media/storage-files-faq/azure-file-sync-file-attributes.png)
        
        You can see the attributes for all the files in a folder by adding the **Attributes** field to the table display of File Explorer. To do this, right-click on an existing column (for example, **Size**), select **More**, and then select **Attributes** from the drop-down list.

> [!NOTE]
> All of these attributes will be visible for partially recalled files as well.
        
   * **Use `fsutil` to check for reparse points on a file.**
       As described in the preceding option, a tiered file always has a reparse point set. A reparse point allows the Azure File Sync file system filter driver (StorageSync.sys) to retrieve content from Azure file shares that is not stored locally on the server. To check whether a file has a reparse point, in an elevated Command Prompt or PowerShell window, run the `fsutil` utility:
    
        ```powershell
        fsutil reparsepoint query <your-file-name>
        ```

        If the file has a reparse point, you can expect to see **Reparse Tag Value: 0x8000001e**. This hexadecimal value is the reparse point value that is owned by Azure File Sync. The output also contains the reparse data that represents the path to your file on your Azure file share.

> [!WARNING]
> The `fsutil reparsepoint` utility command also has the ability to delete a reparse point. Do not execute this command unless the Azure File Sync engineering team asks you to. Running this command might result in data loss. 

## Next Steps
* [Monitoring cloud tiering](storage-sync-monitoring-cloud-tiering.md)
