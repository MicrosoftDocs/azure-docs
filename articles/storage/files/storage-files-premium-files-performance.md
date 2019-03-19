---
title: Azure premium files performance
description: This article discusses the performance benefits of premium files and file shares. It also describes the credit burst system unique to premium files.
services: storage
author: roygara
ms.service: storage
ms.topic: concept
ms.date: 03/15/2019
ms.author: rogarana
ms.subservice: files
#Customer intent: As a < type of user >, I want < what? > so that < why? >.
---

# H1

## Overview

Premium Files provides consistent low latency, high IOPS, and high throughput shares.

Premium Files is built for high transaction workloads and transactions are included in the per GB pricing.

There are limits on the amount of transactions (IOPS) and bandwidth which are detailed in this document.

## Provisioning Shares

Shares are provisioned based on a fixed GiB/IOPS/Throughput ratio. For each GiB provisioned the share will be issued 1 IOPS and 0.1MB/s throughput up to the max per share. Min GiB provisioned is 100 GiB with min IOPS/Throughput.

On a best effort basis, all shares can burst up to 3 IOPS per GIB of provisioned storage for up to 1 hour and can run steady at 1 IOPS per GiB of provisioned capacity up to the maximum of the share.

New shares start with the full burst credit based on the provisioned capacity. Shares with larger capacity with over 50 TiB can burst for longer than 1 hour duration if they have enough credits in their burst bucket.

All shares can burst up to at least 100 IOPS and target throughput of 100 MBPS. Shares must be provisioned in 1 GiB increments. Min size is 100 GiB, next size is 101 GIB and so on.

Share size can be increased at any time and decreased any time but can be decreased once every 24 hours since the last increase. IOPS/Throughput scale changes will be effective within 24 hours after the size change

|Capacity (GiB) | Baseline IOPS | Burst limit | Throughput (MB/s) |
|---------|---------|---------|---------|
|100         | 100     | 300     | 110   |
|500         | 500     | 1,500   | 150   |
|1,000       | 1,024   | 3,072   | 202   |
|5,000       | 5,120   | 15,360  | 612   |
|10,000      | 10,240  | 30,720  | 1,124 |
|33,333      | 33,792  | 100,000 | 3,479 |
|50,000      | 51,200  | 100,000 | 5,000 |
|100,000     | 100,000 | 100,000 | 5,000 |

## Bursting

Premium file shares can burst their IOPS up to a factor of three. Bursting is automated and operates based on a credit system. Bursting works on a best effort basis and the burst limit is not a guarantee, file shares can burst *up to* the limit.

Credits accumulate in a burst bucket whenever traffic for your fileshares are below baseline IOPS. For example, a 100 GiB share has 100 baseline IOPS. If actual traffic on the share was 40 IOPS for a specific 1-second interval, then the 60 unused IOPS are credited to a burst bucket. These credits will then be used later when operations would exceed the baseline IOPs, the formula is: (Baseline_IOPS * 2 * 3600).

Whenever a share exceeds the baseline IOPS and has credits in a burst bucket, it will burst. Shares can continue to burst as long as credits are remaining, though they will only stay at the burst limit for up to an hour. Each IO beyond baseline IOPS consumes one credit and once all credits are consumed the share would return to baseline IOPS.

Share credits have three states:

- Accuring, when the file share is using less than the baseline IOPS
- Declining, when the file share is bursting
- Remaining at zero, when there are either no credits or baseline IOPS is in use.

New file shares start with a full amount of credits in its burst bucket. You can track how many credits you have as a metric in Azure monitor and even setup alerts on them.

## Premium files limits

There are three categories of limitations to consider for premium files: storage accounts, shares, and files.

For example: A single share can achieve 100,000 IOPS and a single file can scale up to 5,000 IOPS. So, if you only have three files, the max IOPs you could get from the share is 15,000.

### Premium filestorage account limits

|Area  |Target  |
|---------|---------|
|Size     |500 TB     |
|Shares   |Unlimited  |
|IOPS     |100,000    |
|Bandwidth|5 GB/s     |

### Premium file share limits

> [!IMPORTANT]
> Storage account limits apply to all shares. Scaling up to the max for storage accounts is only achievable if there is only one share per storage account.

|Area  |Target  |
|---------|---------|
|Min size     |100 GiB         |
|Max size     |100 TiB         |
|Minimum size increase/decrease     |1 GiB         |
|Baseline IOPS     |1 IOPS per GiB up to 100,000         |
|IOPS bursting     |3x IOPS per GB up to 100,000         |
|Min bandwidth     |100         |
|Bandwidth     |0.1 MB/s per GiB up to 5 GiB/s         |
|Maximum number of snapshots     |200         |

### Premium file limits


|Area  |Target  |
|---------|---------|
|Size     |1 TiB         |
|Max IOPS per file     |5,000         |
|Concurrent handles     |2,000         |