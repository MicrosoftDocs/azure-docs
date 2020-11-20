---
title: Cloud Tiering - I Have More Questions (FAQ) | Microsoft Docs
description: Frequently asked cloud tiering questions and answers
author: mtalasila
ms.service: storage
ms.topic: conceptual
ms.date: 11/18/2020
ms.author: mtalasila
ms.subservice: files
---

# Cloud tiering FAQ

### How can I recall a tiered file to disk to use it locally?

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

### How do I force a file or directory to be tiered?

> [!NOTE]
> When you select a directory to be tiered, only the files currently in the directory are tiered. Any files created after that time aren't automatically tiered.

When the cloud tiering feature is enabled, cloud tiering automatically tiers files based on last access and modify times to achieve the volume free space percentage specified on the cloud endpoint. Sometimes, though, you might want to manually force a file to tier. This might be useful if you save a large file that you don't intend to use again for a long time, and you want the free space on your volume now to use for other files and folders. You can force tiering by using the following PowerShell commands:

```powershell
Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
Invoke-StorageSyncCloudTiering -Path <file-or-directory-to-be-tiered>
```

### Why are my tiered files not showing thumbnails or previews in Windows Explorer?

For tiered files, thumbnails and previews won't be visible at your server endpoint. This behavior is expected since the thumbnail cache feature in Windows intentionally skips reading files with the offline attribute. With Cloud Tiering enabled, reading through tiered files would cause them to be downloaded (recalled).

This behavior is not specific to Azure File Sync, Windows Explorer displays a "grey X" for any files that have the offline attribute set. You will see the X icon when accessing files over SMB. For a detailed explanation of this behavior, refer to [https://blogs.msdn.microsoft.com/oldnewthing/20170503-00/?p=96105](https://blogs.msdn.microsoft.com/oldnewthing/20170503-00/?p=96105)

### I have cloud tiering disabled. Why are there tiered files in the server endpoint location?

There are two reasons why tiered files may exist in the server endpoint location:

- When adding a new server endpoint to an existing sync group, if you choose either the recall namespace first option or recall namespace only option for initial download mode, files will show up as tiered until they're downloaded locally. To avoid this, select the avoid tiered files option for initial download mode. To manually recall files, use the [Invoke-StorageSyncFileRecall](#how-can-I-recall-a-tiered-file-to-disk-to-use-it-locally) cmdlet.

- If cloud tiering was enabled on the server endpoint and then disabled, files will remain tiered until they're accessed.

### How do I exclude applications from cloud tiering last access time tracking?

With Azure File Sync agent version 11.1, you can now exclude applications from last access tracking. When an application accesses a file, the last access time for the file is updated in the cloud tiering database. Applications that scan the file system like anti-virus cause all files to have the same last access time, which impacts when files are tiered.

To exclude applications from last access time tracking, add the process name to the HeatTrackingProcessNameExclusionList registry setting that is located under HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Azure\StorageSync.

Example: reg ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Azure\StorageSync" /v HeatTrackingProcessNameExclusionList /t REG_MULTI_SZ /d "SampleApp.exe\0AnotherApp.exe" /f

> [!NOTE]
> Data Deduplication and File Server Resource Manager (FSRM) processes are excluded by default (hard coded) and the process exclusion list is refreshed every 5 minutes.

