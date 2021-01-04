---
title: Cloud Tiering Policies | Microsoft Docs
description: Details on how the date and volume free space policies work together for different scenarios.
author: mtalasila
ms.service: storage
ms.topic: conceptual
ms.date: 1/4/2021
ms.author: mtalasila
ms.subservice: files
---

# Cloud tiering policies

There are two policies that determine which files are tiered to the cloud versus locally cached: the **volume free space policy** and the **date policy**.

The **volume free space policy** ensures that x% of the local drive the server endpoint is on will always be free. The **date policy** tiers files last accessed x days ago or later. The volume free space policy will always take precedence; when there isn't enough free space on the volume to store as many days worth of files as described by the date policy, Azure File Sync will continue tiering the coldest files until the volume free space percentage is met.

## How both policies work together

Let's take a scenario. Say you have the following files in a cloud file share. The capacity of the local volume hosting the server endpoint is 500 GB and cloud tiering was never enabled.

|File Name |Last Access Time  |File Size  |Stored In |
|----------|------------------|-----------|----------|
|File 1    | 2 days ago  | 10 GB | Server and Azure file share
|File 2    | 10 days ago | 30 GB | Server and Azure file share
|File 3    | 1 year ago | 200 GB | Server and Azure file share
|File 4    | 1 year, 2 days ago | 130 GB | Server and Azure file share
|File 5    | 2 years, 1 day ago | 140 GB | Server and Azure file share

**Change 1:** Let's say you enable cloud tiering and set a volume free space policy of 20% and keep the date policy disabled. Cloud tiering will now ensure 20% (in this case 100 GB) of space is kept free and available for users to store new files or change existing files. As a result, the total capacity of the local cache is 400 GB. This capacity will be used to store the most recently and frequently accessed files on the local volume. 

Looking at the table above, with this policy, only Files 1 through 4 would be stored in the local cache, and File 5 would be tiered. Although this is only 370 GB out of the 400 GB that can be used, File 5 is 140 GB, which would put us over the 400-GB limit if that file was locally cached. 

**Change 2:** Say a user accesses File 5. Now, File 5 is the most recently accessed file in the file share. As a result, File 5 would be stored in the local cache and to fit under the 400-GB limit, File 4 would be tiered. Below is the updated table, with the new access time for File 5.

|File Name |Last Access Time  |File Size  |Stored In |
|----------|------------------|-----------|----------|
|File 5    | 2 hours ago | 140 GB | Server and Azure file share
|File 1    | 2 days ago  | 10 GB | Server and Azure file share
|File 2    | 10 days ago | 30 GB | Server and Azure file share
|File 3    | 1 year ago | 200 GB | Server and Azure file share
|File 4    | 1 year, 2 days ago | 130 GB | Azure file share, tiered locally

**Change 3:** A few hours later, you decide to change the policy to a date-based tiering policy of 60 days and a volume free space policy of 70%. Now, only up to 150 GB can be stored in the local cache. Although File 2 has been accessed less than 60 days ago, the volume free space policy kicks in, overrides the date policy, and tiers File 2 to maintain the 70% free space on the local volume. 

**Change 4:** Say the volume free space policy changed to 20% and the Invoke-StorageSyncRecall cmdlet is used to recall all the files that fit on the local drive while adhering to the cloud tiering policies.

|File Name |Last Access Time  |File Size  |Stored In |
|----------|------------------|-----------|----------|
|File 5    | 1 hour ago  | 140 GB | Server and Azure file share
|File 1    | 2 days ago  | 10 GB | Server and Azure file share
|File 2    | 10 days ago | 30 GB | Server and Azure file share
|File 3    | 1 year ago | 200 GB | Azure file share, tiered locally
|File 4    | 1 year, 2 days ago | 130 GB | Azure file share, tiered locally

In this case, Files 1, 2 and 5 would be locally cached and Files 3 and 4 would be tiered. This is because although the volume free space policy allows for up to 400 GB in the local cache and Files 1, 2, and 5 only take up 180 GB, the date policy is 60 days, which means Files 3 and 4 don't make the cutoff. 

> [!NOTE] 
> When customers change the volume free space policy to a smaller value, we will not automatically recall files.

## Multiple server endpoints on local volume

It's possible to enable cloud tiering with multiple server endpoints on a single local volume. In this case, we strongly recommend that you set the volume free space to the same amount to all the server endpoints on the same volume. However, if you set the volume free space to different percentages, the largest volume free space percentage will take precedence. This is called the **effective volume free space policy**.

For example, if you have server endpoint 1 with 15% volume free space, server endpoint 2 with 20% volume free space, and server endpoint 3 with 30% volume free space, all server endpoints will automatically begin to tier the coldest files when the volume has less than 30% free space available. 

## Next Steps
* [Monitoring cloud tiering](storage-sync-monitoring-cloud-tiering.md)
