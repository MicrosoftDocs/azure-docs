---
title: Cloud Tiering - I Have More Questions (FAQ) | Microsoft Docs
description: Frequently asked cloud tiering questions and answers
author: mtalasila
ms.service: storage
ms.topic: conceptual
ms.date: 1/4/2021
ms.author: mtalasila
ms.subservice: files
---

# Cloud tiering FAQ

### Why are my tiered files not showing thumbnails or previews in Windows Explorer?

For tiered files, thumbnails and previews won't be visible at your server endpoint. This behavior is expected since the thumbnail cache feature in Windows intentionally skips reading files with the offline attribute. With Cloud Tiering enabled, reading through tiered files would cause them to be downloaded (recalled).

This behavior is not specific to Azure File Sync, Windows Explorer displays a "grey X" for any files that have the offline attribute set. You will see the X icon when accessing files over SMB. For a detailed explanation of this behavior, refer to [https://blogs.msdn.microsoft.com/oldnewthing/20170503-00/?p=96105](https://blogs.msdn.microsoft.com/oldnewthing/20170503-00/?p=96105)

### I have cloud tiering disabled. Why are there tiered files in the server endpoint location?

There are two reasons why tiered files may exist in the server endpoint location:

- When adding a new server endpoint to an existing sync group, if you choose either the recall namespace first option or recall namespace only option for initial download mode, files will show up as tiered until they're downloaded locally. To avoid this, select the avoid tiered files option for initial download mode. To manually recall files, use the [Invoke-StorageSyncFileRecall](storage-sync-how-to-manage-tiered-files.md#how-to-recall-a-tiered-file-to-disk-to-use-it-locally) cmdlet.

- If cloud tiering was enabled on the server endpoint and then disabled, files will remain tiered until they're accessed.

### Minimum file size for a file to tier

For agent versions 9 and newer, the minimum file size for a file to tier is based on the file system cluster size. The minimum file size eligible for cloud tiering is calculated by 2x the cluster size and at a minimum 8 KB. The following table illustrates the minimum file sizes that can be tiered, based on the volume cluster size:

|Volume cluster size (Bytes) |Files of this size or larger can be tiered  |
|----------------------------|---------|
|4 KB or smaller (4096)      | 8 KB    |
|8 KB (8192)                 | 16 KB   |
|16 KB (16384)               | 32 KB   |
|32 KB (32768)               | 64 KB   |
|64 KB (65536)    | 128 KB  |

Cluster sizes up to 64 KB are currently supported but, for larger sizes, cloud tiering does not work.

All file systems that are used by Windows, organize your hard disk based on cluster size (also known as allocation unit size). Cluster size represents the smallest amount of disk space that can be used to hold a file. When file sizes do not come out to an even multiple of the cluster size, additional space must be used to hold the file - up to the next multiple of the cluster size.

Azure File Sync is supported on NTFS volumes with Windows Server 2012 R2 and newer. The following table describes the default cluster sizes when you create a new NTFS volume with Windows Server 2019.

|Volume size    |Windows Server 2019             |
|---------------|--------------------------------|
|7 MB – 16 TB   | 4 KB                |
|16TB – 32 TB   | 8 KB                |
|32TB – 64 TB   | 16 KB               |
|64TB – 128 TB  | 32 KB               |
|128TB – 256 TB | 64 KB (earlier max) |
|256 TB – 512 TB| 128 KB              |
|512 TB – 1 PB  | 256 KB              |
|1 PB – 2 PB    | 512 KB              |
|2 TB – 4 PB    | 1024 KB             |
|4 TB – 8 TB    | 2048 KB (max size)  |
|> 8 TB         | not supported       |

It is possible that upon creation of the volume, you manually formatted the volume with a different cluster size. If your volume stems from an older version of Windows, default cluster sizes may also be different. [This article has more details on default cluster sizes.](https://support.microsoft.com/help/140365/default-cluster-size-for-ntfs-fat-and-exfat) Even if you choose a cluster size smaller than 4 KB, an 8 KB limit as the smallest file size that can be tiered, still applies. (Even if technically 2x cluster size would equate to less than 8 KB.)

The reason for the absolute minimum is found in the way NTFS stores extremely small files - 1 KB to 4 KB sized files. Depending on other parameters of the volume, it is possible that small files are not stored in a cluster on disk at all. It's possibly more efficient to store such files directly in the volume's Master File Table or "MFT record". The cloud tiering reparse point is always stored on disk and takes up exactly one cluster. Tiering such small files could end up with no space savings. Extreme cases could even end up using more space with cloud tiering enabled. To safeguard against that, the smallest size of a file that cloud tiering will tier, is 8 KB on a 4 KB or smaller cluster size. 

> [!IMPORTANT]
> Cloud tiering is not supported on the Windows system volume.

> [!Note]
> To recall files that have been tiered, the network bandwidth should be at least 1 Mbps. If network bandwidth is less than 1 Mbps, files may fail to recall with a timeout error.

> [!IMPORTANT]
> You can still enable cloud tiering if you have an FSRM quota on your local volume. Once an FSRM quota is set, the free space query APIs that get called automatically report the free space on the volume as per the quota setting. 

For questions on how to manage tiered files, please see [How to manage tiered files](storage-sync-how-to-manage-tiered-files.md).

