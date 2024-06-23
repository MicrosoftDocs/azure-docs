---
title: Azure File Sync cloud tiering policies
description: How the date policy and volume free space policy work together for different cloud tiering scenarios in Azure File Sync.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 06/03/2024
ms.author: kendownie
---

# Cloud tiering policies

Cloud tiering has two policies that determine which files are tiered to the cloud: the **volume free space policy** and the **date policy**.

The **volume free space policy** ensures that a specified percentage of the local volume the server endpoint is located on is always kept free.

The **date policy** tiers files last accessed x days ago or later. The volume free space policy always takes precedence. When there isn't enough free space on the volume to store as many days worth of files as the date policy specifies, Azure File Sync overrides the date policy. It continues tiering the coldest files until meeting the volume free space percentage.

## How both policies work together

Here's an example to illustrate how these policies work. Let's say you configure Azure File Sync on a 500 GiB local volume, and cloud tiering isn't enabled. You have these files in your file share:

|File Name |Last Access Time  |File Size  |Stored In |
|----------|------------------|-----------|----------|
|File A    | 2 days ago  | 10 GiB | Server and Azure file share
|File B    | 10 days ago | 30 GiB | Server and Azure file share
|File C    | 1 year ago | 200 GiB | Server and Azure file share
|File D    | 1 year, 2 days ago | 120 GiB | Server and Azure file share
|File E    | 2 years, 1 day ago | 140 GiB | Server and Azure file share

**Change 1:** You enabled cloud tiering, set a volume free space policy of 20%, and kept the date policy disabled. With that configuration, cloud tiering ensures 20% (in this case 100 GiB) of space is kept free and available on the local machine. As a result, the total capacity of the local cache is 400 GiB. This cache stores the most recently and frequently accessed files on the local volume.

With this configuration, only files A through D would be stored in the local cache, and file E would be tiered. This only accounts for 360 GiB out of the 400 GiB that could be used. File E is 140 GiB and would exceed the limit if it was locally cached.

**Change 2:** Say a user accesses file E, making file E the most recently accessed file in the share. As a result, file E would be stored in the local cache, and to fit under the limit of 400 GiB, file D would be tiered. The following table shows where the files are stored with these updates:

|File Name |Last Access Time  |File Size  |Stored In |
|----------|------------------|-----------|----------|
|File E    | 2 hours ago | 140 GiB | Server and Azure file share
|File A    | 2 days ago  | 10 GiB | Server and Azure file share
|File B    | 10 days ago | 30 GiB | Server and Azure file share
|File C    | 1 year ago | 200 GiB | Server and Azure file share
|File D    | 1 year, 2 days ago | 120 GiB | Azure file share tiered locally

**Change 3:** Imagine you updated the policies so that the date policy is 60 days and the volume free space policy is 70%. Now, only up to 150 GiB can be stored in the local cache. Although file B was accessed less than 60 days ago, the volume free space policy overrides the date policy, and file B is tiered to maintain the 70% local free space.

**Change 4:** If you changed the volume free space policy to 20% and then used `Invoke-StorageSyncFileRecall` to recall all the files that fit on the local drive while adhering to the cloud tiering policies, the table would look like this:

|File Name |Last Access Time  |File Size  |Stored In |
|----------|------------------|-----------|----------|
|File E    | 1 hour ago  | 140 GiB | Server and Azure file share
|File A    | 2 days ago  | 10 GiB | Server and Azure file share
|File B    | 10 days ago | 30 GiB | Server and Azure file share
|File C    | 1 year ago | 200 GiB | Azure file share tiered locally
|File D    | 1 year, 2 days ago | 120 GiB | Azure file share tiered locally

In this case, files A, B, and E would be locally cached and files C and D would be tiered. Because the date policy is 60 days, files C and D are tiered, even though the volume free space policy allows for up to 400 GiB locally.

> [!NOTE]
> Files aren't automatically recalled when customers change the volume free space policy to a smaller value (for example, from 20% to 10%) or change the date policy to a larger value (for example, from 20 days to 50 days).

## Multiple server endpoints on a local volume

You can enable cloud tiering for multiple server endpoints on a single local volume. For this configuration, you should set the volume free space to the same amount for all the server endpoints on the same volume. If you set different volume free space policies for several server endpoints on the same volume, the largest volume free space percentage takes precedence. This is called the **effective volume free space policy**. For example, let's say you have three server endpoints on the same local volume: one set to 15%, another set to 20%, and a third set to 30%. All three will begin to tier the coldest files when they have less than 30% free space available.

## Next step

- [Monitor cloud tiering](file-sync-monitor-cloud-tiering.md)
