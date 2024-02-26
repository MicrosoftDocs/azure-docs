---
title: Azure File Sync cloud tiering policies
description: Details on how the date and volume free space policies work together for different scenarios.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 06/07/2022
ms.author: kendownie
---

# Cloud tiering policies

Cloud tiering has two policies that determine which files are tiered to the cloud: the **volume free space policy** and the **date policy**.

The **volume free space policy** ensures that a specified percentage of the local volume the server endpoint is located on is always kept free.

The **date policy** tiers files last accessed x days ago or later. The volume free space policy will always take precedence. When there isn't enough free space on the volume to store as many days worth of files as described by the date policy, Azure File Sync will override the date policy and continue tiering the coldest files until the volume free space percentage is met.

## How both policies work together

We'll use an example to illustrate how these policies work: Let's say you configured Azure File Sync on a 500-GiB local volume, and cloud tiering was never enabled. These are the files in your file share:

|File Name |Last Access Time  |File Size  |Stored In |
|----------|------------------|-----------|----------|
|File 1    | 2 days ago  | 10 GiB | Server and Azure file share
|File 2    | 10 days ago | 30 GiB | Server and Azure file share
|File 3    | 1 year ago | 200 GiB | Server and Azure file share
|File 4    | 1 year, 2 days ago | 120 GiB | Server and Azure file share
|File 5    | 2 years, 1 day ago | 140 GiB | Server and Azure file share

**Change 1:** You enabled cloud tiering, set a volume free space policy of 20%, and kept the date policy disabled. With that configuration, cloud tiering ensures 20% (in this case 100 GiB) of space is kept free and available on the local machine. As a result, the total capacity of the local cache is 400 GiB. That 400 GiB will store the most recently and frequently accessed files on the local volume.

With this configuration, only files 1 through 4 would be stored in the local cache, and file 5 would be tiered. This only accounts for 360 GiB out of the 400 GiB that could be used. File 5 is 140 GiB and would exceed the 400-GiB limit if it was locally cached.

**Change 2:** Say a user accesses file 5. This makes file 5 the most recently accessed file in the share. As a result, File 5 would be stored in the local cache and to fit under the 400-GiB limit, file 4 would be tiered. The following table shows where the files are stored, with these updates:

|File Name |Last Access Time  |File Size  |Stored In |
|----------|------------------|-----------|----------|
|File 5    | 2 hours ago | 140 GiB | Server and Azure file share
|File 1    | 2 days ago  | 10 GiB | Server and Azure file share
|File 2    | 10 days ago | 30 GiB | Server and Azure file share
|File 3    | 1 year ago | 200 GiB | Server and Azure file share
|File 4    | 1 year, 2 days ago | 120 GiB | Azure file share, tiered locally

**Change 3:** Imagine you updated the policies so that the date-based tiering policy is 60 days and the volume free space policy is 70%. Now, only up to 150 GiB can be stored in the local cache. Although File 2 has been accessed less than 60 days ago, the volume free space policy will override the date policy, and file 2 is tiered to maintain the 70% local free space.

**Change 4:** If you changed the volume free space policy to 20% and then used `Invoke-StorageSyncFileRecall` to recall all the files that fit on the local drive while adhering to the cloud tiering policies, the table would look like this:

|File Name |Last Access Time  |File Size  |Stored In |
|----------|------------------|-----------|----------|
|File 5    | 1 hour ago  | 140 GiB | Server and Azure file share
|File 1    | 2 days ago  | 10 GiB | Server and Azure file share
|File 2    | 10 days ago | 30 GiB | Server and Azure file share
|File 3    | 1 year ago | 200 GiB | Azure file share, tiered locally
|File 4    | 1 year, 2 days ago | 120 GiB | Azure file share, tiered locally

In this case, files 1, 2 and 5 would be locally cached and files 3 and 4 would be tiered. Because the date policy is 60 days, files 3 and 4 are tiered, even though the volume free space policy allows for up to 400 GiB locally.

> [!NOTE]
> Files are not automatically recalled when customers change the volume free space policy to a smaller value (for example, from 20% to 10%) or change the date policy to a larger value (for example, from 20 days to 50 days).

## Multiple server endpoints on a local volume

Cloud tiering can be enabled for multiple server endpoints on a single local volume. For this configuration, you should set the volume free space to the same amount for all the server endpoints on the same volume. If you set different volume free space policies for several server endpoints on the same volume, the largest volume free space percentage will take precedence. This is called the **effective volume free space policy**. For example, if you have three server endpoints on the same local volume, one set to 15%, another set to 20%, and a third set to 30%, they'll all begin to tier the coldest files when they have less than 30% free space available.

## Next steps

- [Monitor cloud tiering](file-sync-monitor-cloud-tiering.md)
