---
title: Choosing Cloud Tiering Policies | Microsoft Docs
description: Details on what to keep in mind when choosing your policies.
author: mtalasila
ms.service: storage
ms.topic: conceptual
ms.date: 1/24/2021
ms.author: mtalasila
ms.subservice: files
---

# Choosing cloud tiering policies

This document intends to guide customers while selecting and adjusting cloud tiering policies. Before reading through this document, please ensure that you understand how cloud tiering works. For cloud tiering fundamentals, (see [Cloud tiering overview](storage-sync-cloud-tiering-overview.md)). For an in-depth explanation of cloud tiering policies with examples, (see [Cloud tiering policies](storage-sync-cloud-tiering-policy.md)).

## Selecting your initial policies

If you intend to enable cloud tiering for a server endpoint, we recommend creating one local virtual drive per server endpoint. Isolating the server endpoint makes it easier to understand how cloud tiering works and adjust your policy accordingly. However, Azure File Sync will still work if you have multiple server endpoints and/or other applications on the same drive (see [Cloud tiering policy](storage-sync-cloud-tiering-policy.md#multiple-server-endpoints-on-local-volume)). We also recommend that when you first enable cloud tiering, you keep the date policy disabled and volume free space at around 10% to 20%. 20% volume free space seems to be the best option for the majority of general purpose file server volumes.

After setting your policies, monitor egress (see [Monitoring cloud tiering](storage-sync-monitoring-cloud-tiering.md)) and adjust both policies accordingly. We recommend specifically looking at the cloud tiering recall size and cloud tiering recall size by application metrics in Azure Monitor.

For simplicity and to have a clear understanding of how items will be tiered, we recommend you primarily adjust your volume free space policy and keep your date policy disabled unless needed. We recommend this because most customers find it valuable to fill the local cache with as many hot files as possible and tier the rest to the cloud. However, the date policy may be beneficial if you want to proactively free up local disk space and you know files in that server endpoint accessed after the number of days specified in the policy don't need to be kept locally. Setting the date policy frees up valuable local disk capacity for other endpoints on the same volume to cache more of their files.

## Adjusting your policies

If your cloud tiering recall size is larger than you hoped for, we recommend first increasing your local volume size if possible, and/or decreasing your volume free space policy percentage in small increments. Higher churn requires more free space for recall before tiering kicks in, which is why we recommend increasing your local volume size as a first line of action. 

Keeping more data local means lower egress costs as fewer files will be recalled from Azure, but also requires a larger amount of on-premises storage which comes at its own cost. 

When adjusting your volume free space policy, keep in mind that the amount of data you should keep local is determined by a few factors: your bandwidth, your dataset's access pattern, and your budget. If you have a low-bandwidth connection, you may want to keep more of your data local to ensure there is minimal lag for your users. Otherwise, you can base it on the churn rate during a given period. For example, if you know that about 10% of your 1-TB dataset changes or is actively accessed each month, then you may want to keep 100 GB local so you are not frequently recalling files. If your volume is 2 TB, then you will want to keep 5% (or 100 GB) local, meaning the remaining 95% is your volume free space percentage. However, we recommend that you add a buffer to account for periods of higher churn – in other words, starting with a larger volume free space percentage, and then adjusting it if needed later.