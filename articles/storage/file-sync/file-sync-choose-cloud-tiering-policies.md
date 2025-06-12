---
title: Choose Azure File Sync cloud tiering policies
description: Details on what to keep in mind when choosing Azure File Sync cloud tiering policies.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 05/06/2024
ms.author: kendownie
---

# Choose cloud tiering policies

This article provides guidance on selecting and adjusting cloud tiering policies for Azure File Sync. Before reading this article, ensure that you understand how cloud tiering works. For cloud tiering fundamentals, see [Understand Azure File Sync cloud tiering](file-sync-cloud-tiering-overview.md). For an in-depth explanation of cloud tiering policies with examples, see [Azure File Sync cloud tiering policies](file-sync-cloud-tiering-policy.md).

## Limitations

- Cloud tiering isn't supported on the Windows system volume.

- If you're using File Server Resource Manager (FSRM) for quota management on server endpoints, we recommend applying the quotas at the folder level and not at the volume level. You can still enable cloud tiering if you have a volume-level FSRM quota. Once an FSRM quota is set, the free space query APIs that get called automatically report the free space on the volume as per the quota setting. However, when a hard quota is present on a volume root, the actual free space on the volume and the quota restricted space on the volume might not be the same. This could cause endless tiering if Azure File Sync thinks there isn't enough volume free space on the server endpoint.

### Minimum file size for a file to tier

The minimum file size for a file to tier is based on the file system cluster size. The minimum file size eligible for cloud tiering is calculated by 2x the cluster size and at a minimum 8 KiB. The following table illustrates the minimum file sizes that can be tiered, based on the volume cluster size:

|Volume cluster size  |Files of this size or larger can be tiered  |
|----------------------------|---------|
|4 KiB or smaller (4,096 bytes)      | 8 KiB    |
|8 KiB (8,192 bytes)                 | 16 KiB   |
|16 KiB (16,384 bytes)               | 32 KiB   |
|32 KiB (32,768 bytes)               | 64 KiB   |
|64 KiB (65,536 bytes)    | 128 KiB  |
|128 KiB (131,072 bytes) | 256 KiB |
|256 KiB (262,144 bytes) | 512 KiB |
|512 KiB (524,288 bytes) | 1 MiB |
|1 MiB (1,048,576 bytes) | 2 MiB |
|2 MiB (2,097,152 bytes) | 4 MiB |

Azure File Sync supports cloud tiering on volumes with cluster sizes up to 2 MiB.

All file systems that are used by Windows organize your hard disk based on cluster size (also known as allocation unit size). Cluster size represents the smallest amount of disk space that can be used to hold a file. When file sizes don't come out to an even multiple of the cluster size, additional space must be used to hold the file - up to the next multiple of the cluster size.

Azure File Sync is supported on NTFS volumes with Windows Server 2012 R2 and newer. The following table describes the default cluster sizes when you create a new NTFS volume with Windows Server.

|Volume size    |Windows Server             |
|---------------|--------------------------------|
|7 MiB – 16 TiB   | 4 KiB                |
|16 TiB – 32 TiB   | 8 KiB                |
|32 TiB – 64 TiB   | 16 KiB               |

It's possible that upon creation of the volume, you manually formatted the volume with a different cluster size. If your volume stems from an older version of Windows, default cluster sizes might also be different. Even if you choose a cluster size smaller than 4 KiB, an 8 KiB limit as the smallest file size that can be tiered still applies. (Even if technically 2x cluster size would equate to less than 8 KiB.)

The reason for the absolute minimum is due to the way NTFS stores extremely small files - 1 KiB to 4 KiB sized files. Depending on other parameters of the volume, it's possible that small files aren't stored in a cluster on disk at all. It's possibly more efficient to store such files directly in the volume's Master File Table or "MFT record". The cloud tiering reparse point is always stored on disk and takes up exactly one cluster. Tiering such small files could end up with no space savings. Extreme cases could even end up using more space with cloud tiering enabled. To safeguard against that, the smallest size of a file that cloud tiering will tier is 8 KiB on a 4 KiB or smaller cluster size.

## Selecting your initial policies

Generally, when you enable cloud tiering on a server endpoint, you should create one local virtual drive for each individual server endpoint. Isolating the server endpoint makes it easier to understand how cloud tiering works and adjust your policies accordingly. However, Azure File Sync works even if you have multiple server endpoints on the same drive, for details see the [Multiple server endpoints on local volume](file-sync-cloud-tiering-policy.md#multiple-server-endpoints-on-a-local-volume) section. We also recommend that when you first enable cloud tiering, you keep the date policy disabled and volume free space policy at around 10% to 20%. For most file server volumes, 20% volume free space is usually the best option.

> [!NOTE]
> In some migration scenarios, if you provisioned less storage on your Windows Server instance than your source, you can temporarily set volume free space to 99% during the migration to tier files to the cloud, and then set it to a more useful level after the migration is complete.

For simplicity and to have a clear understanding of how items will be tiered, we recommend you primarily adjust your volume free space policy and keep your date policy disabled unless needed. We recommend this because most customers find it valuable to fill the local cache with as many hot files as possible and tier the rest to the cloud. However, the date policy may be beneficial if you want to proactively free up local disk space and you know files in that server endpoint accessed after the number of days specified in your date policy don't need to be kept locally. Setting the date policy frees up valuable local disk capacity for other endpoints on the same volume to cache more of their files.

After setting your policies, monitor egress and adjust both policies accordingly. We recommend looking at the **cloud tiering recall size** and **cloud tiering recall size by application** metrics in Azure Monitor. We also recommend monitoring the cache hit rate for the server endpoint to determine the percentage of opened files that are already in the local cache. To learn how to monitor egress, see [Monitor cloud tiering](file-sync-monitor-cloud-tiering.md).

## Adjusting your policies

If the number of files constantly recalled from Azure is larger than you want, you might have more hot files than you have space to save them on the local server volume. Increase your local volume size if possible, and/or decrease your volume free space policy percentage in small increments. Decreasing the volume free space percentage too much can also have negative consequences. Higher churn in your dataset requires more free space - for new files and recall of "cold" files. Tiering kicks in with a delay of up to one hour and then needs processing time, which is why you should always have ample free space on your volume.

Keeping more data local means lower egress costs as fewer files will be recalled from Azure, but also requires a larger amount of on-premises storage, which comes at its own cost.

When adjusting your volume free space policy, the amount of data you should keep local is determined by the following factors: your bandwidth, dataset's access pattern, and budget. With a low-bandwidth connection, you may want more local data, to ensure minimal lag for users. Otherwise, you can base it on the churn rate during a given period. As an example, if you know that 10% of your 1 TiB dataset changes or is actively accessed each month, then you might want to keep 100 GiB local so you aren't frequently recalling files. If your volume is 2 TiB, then you will want to keep 5% (or 100 GiB) local, meaning the remaining 95% is your volume free space percentage. However, you should add a buffer for periods of higher churn – in other words, start with a larger volume free space percentage, and then adjust it if needed later.

## Standard operating procedures

- When first migrating to Azure Files via Azure File Sync, cloud tiering is dependent on initial upload
- Cloud tiering checks compliance with the volume free space and date policies every sixty minutes
- Using the /LFSM switch on Robocopy when migrating files will allow files to sync and cloud tiering to make space during initial upload
- If tiering occurs before a heatmap is formed, files will be tiered by last modified timestamp

## Next steps

- [Planning for an Azure File Sync deployment](file-sync-planning.md)
