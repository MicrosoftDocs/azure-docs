---
title: Choose Azure File Sync Cloud Tiering Policies
description: Details on what to keep in mind when choosing Azure File Sync cloud tiering policies.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 08/03/2026
ms.author: kendownie
# Customer intent: As a storage administrator, I want to configure cloud tiering policies in Azure File Sync so that I can optimize local storage usage and manage costs while ensuring efficient access to frequently used files.
---

# Choose Azure File Sync cloud tiering policies

This article provides guidance on selecting and adjusting cloud tiering policies for Azure File Sync. Before proceeding, understand how cloud tiering works. For fundamentals, see [Understand Azure File Sync cloud tiering](file-sync-cloud-tiering-overview.md). For an in-depth explanation with examples, see [Azure File Sync cloud tiering policies](file-sync-cloud-tiering-policy.md).

## Limitations

- Cloud tiering isn't supported on the Windows system volume.

- If you're using File Server Resource Manager (FSRM) for quota management on server endpoints, apply the quotas at the folder level and not at the volume level. You can still enable cloud tiering with a volume-level FSRM quota, but when a hard quota is present on a volume root, the actual free space and the quota-restricted space might not match. This mismatch can cause endless tiering if Azure File Sync thinks there isn't enough volume free space on the server endpoint.

### Minimum file size for a file to tier

Windows file systems organize disk storage by cluster size (also known as allocation unit size) - the smallest unit of space that can hold a file. Files that aren't a multiple of the cluster size use space up to the next multiple.

Azure File Sync supports cloud tiering on volumes with cluster sizes up to 2 MiB.

The minimum file size eligible for cloud tiering is 2× the cluster size, with a minimum of 8 KiB. The following table shows minimum tierable file sizes by volume cluster size:

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

To find the volume cluster size, run `fsutil fsinfo ntfsinfo volumedriveletter:` from an elevated command prompt. The **Bytes Per Cluster** field shows the cluster size in bytes (kilobytes in parentheses).

Azure File Sync supports NTFS volumes. Default cluster sizes for new NTFS volumes:

|Volume size    |Windows Server             |
|---------------|--------------------------------|
|7 MiB – 16 TiB   | 4 KiB                |
|16 TiB – 32 TiB   | 8 KiB                |
|32 TiB – 64 TiB   | 16 KiB               |

You might have formatted the volume with a non-default cluster size, or older Windows versions might use different defaults. In either case, the 8 KiB minimum still applies even if 2× the cluster size would be less than 8 KiB.

The 8 KiB minimum exists because NTFS sometimes stores very small files (1–4 KiB) directly in the Master File Table rather than on disk. Since the cloud tiering reparse point always occupies one cluster, tiering such files could save no space or even increase storage usage. The smallest file cloud tiering tiers is 8 KiB on a 4 KiB or smaller cluster size.

## Selecting your initial policies

When you enable cloud tiering, create one local virtual drive for each server endpoint to simplify policy management. Azure File Sync supports multiple server endpoints on the same drive (see [Multiple server endpoints on local volume](file-sync-cloud-tiering-policy.md#multiple-server-endpoints-on-a-local-volume)), but isolating endpoints makes tuning easier.

Azure File Sync has two tiering policies: the **volume free space policy** keeps a specified percentage of the volume free by tiering older files, and the **date policy** tiers files that aren't accessed within a specified number of days. Start with the date policy disabled and volume free space set to 10–20%. For most volumes, 20% is the best starting point.

> [!NOTE]
> In some migration scenarios, if you provisioned less storage on your Windows Server instance than your source, you can temporarily set volume free space to 99% during the migration to tier files to the cloud, and then set it to a more useful level after the migration is complete.

For simplicity and to have a clear understanding of how items are tiered, primarily adjust your volume free space policy and keep your date policy disabled unless needed. Most customers find it valuable to fill the local cache with as many hot files as possible and tier the rest to the cloud. However, the date policy might be beneficial if you want to proactively free up local disk space and you know files in that server endpoint accessed after the number of days specified in your date policy don't need to be kept locally. Setting the date policy frees up valuable local disk capacity for other endpoints on the same volume to cache more of their files.

After setting your policies, monitor egress and adjust both policies accordingly. Look at the **cloud tiering recall size** and **cloud tiering recall size by application** metrics in Azure Monitor. Also monitor the cache hit rate for the server endpoint to determine the percentage of opened files that are already in the local cache. To learn how to monitor egress, see [Monitor cloud tiering](file-sync-monitor-cloud-tiering.md).

## Adjusting your policies

If files are recalled more than expected, you likely have more hot files than local space. Increase the local volume size if possible, or decrease the volume free space percentage in small increments - but not too aggressively. Higher churn requires more free space for new files and cold-file recalls. Tiering kicks in with up to an hour delay plus processing time, so keep ample free space on your volume.

Keeping more data local means lower egress costs as fewer files will be recalled from Azure, but also requires a larger amount of on-premises storage, which comes at its own cost.

When adjusting your volume free space policy, the amount of data you should keep local is determined by the following factors: your bandwidth, dataset's access pattern, and budget. With a low-bandwidth connection, you might want more local data, to ensure minimal lag for users. Otherwise, you can base it on the churn rate during a given period. As an example, if you know that 10% of your 1 TiB dataset changes or is actively accessed each month, then you might want to keep 100 GiB local so you aren't frequently recalling files. If your volume is 2 TiB, then you want to keep 5% (or 100 GiB) local, meaning the remaining 95% is your volume free space percentage. However, add a buffer for periods of higher churn – in other words, start with a larger volume free space percentage, and then adjust it if needed later.

## Impact of aggressive cloud tiering configurations

Configure the volume free space percentage and date policy based on actual server usage. For example, to cache the last seven days of data, set the date policy to seven days and ensure the volume can accommodate seven days of churn. If the volume is 100 GiB and churn is about 10 GiB over seven days, a 20% free space setting (20 GiB) accommodates new content and leaves room for overhead.

A very high volume free space setting reduces locally cached data significantly, effectively tiering most files. If only a small percentage of the working dataset is cached locally, users experience more frequent recalls, increasing latency and potentially adding transaction and data transfer costs.

The volume free space policy takes precedence over the date policy: Azure File Sync tiers files to reach the free space target regardless of recent access. A short date policy threshold can also cause recently inactive files to tier quickly, even when free space isn't constrained.

Use the following approach:
- Configure a volume free space policy that aligns with the volume capacity and expected working set to be cached on server.
- Select a date policy that reflects actual file usage patterns. This setting is optional.
- Monitor current free space, cache hit rate, recall size, data tiering size, and overall workload performance to fine tune the free space policy or the total volume size.

This approach helps maintain an appropriate balance between local performance and cloud storage utilization.

## Standard operating procedures

- When you first migrate to Azure Files via Azure File Sync, cloud tiering depends on the initial upload completing first.
- Azure File Sync checks compliance with the volume free space and date policies every 60 minutes.
- Using the `/LFSM` switch on RoboCopy when migrating files lets files sync while cloud tiering frees space during the initial upload.
- If tiering occurs before a heatmap is formed, Azure File Sync tiers files by last modified timestamp.

## Next steps

- [Planning for an Azure File Sync deployment](file-sync-planning.md)
