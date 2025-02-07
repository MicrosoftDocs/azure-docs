---
title: Performance considerations for Azure NetApp Files storage with cool access
description: Understand use cases for cool access and the effect it can have on performance. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 10/24/2024
ms.author: anfdocs
---
# Performance considerations for Azure NetApp Files storage with cool access

Data sets aren't always actively used. Up to 80% of data in a set can be considered "cool," meaning it's not currently in use or hasn't been accessed recently. When storing data on high performance storage such as Azure NetApp Files, the money spent on the capacity being used is essentially being wasted since cool data doesn't require high performance storage until it's being accessed again. 

[Azure NetApp Files storage with cool access](cool-access-introduction.md) is intended to reduce costs for cloud storage in Azure. There are performance considerations in specific use cases that need to be considered.

Accessing data that has moved to the cool tiers incurs more latency, particularly for random I/O. In a worst-case scenario, all of the data being accessed might be on the cool tier, so every request would need to conduct a retrieval of the data. It's uncommon for all of the data in an actively used dataset to be in the cool tier, so it's unlikely to observe such latency. 

When the default cool access retrieval policy is selected, sequential I/O reads are served directly from the cool tier and doesn't repopulate into the hot tier. Randomly read data is repopulated into the hot tier, increasing the performance of subsequent reads. Optimizations for sequential workloads often reduce the latency incurred by cloud retrieval as compared to random reads and improves overall performance.  

In a recent test performed using Standard storage with cool access for Azure NetApp Files, the following results were obtained.

>[!NOTE]
>All results published are for reference purposes only. Results are not guaranteed as performance in production workloads can vary due to numerous factors.

## 100% sequential reads on hot/cool tier (single job)

In the following scenario, a single job on one D32_V5 virtual machine (VM) was used on a 50-TiB Azure NetApp Files volume using the Ultra performance tier. Different block sizes were used to test performance on hot and cool tiers.

>[!NOTE]
>The maximum for the Ultra service level is 128 MiB/s per tebibyte of allocated capacity. An Azure NetApp Files regular volume can manage a throughput up to approximately 5,000 MiB/s.

The following graph shows the cool tier performance for this test using a variety of queue depths. The maximum throughput for a single VM was approximately 400 MiB/s.

:::image type="content" source="./media/performance-considerations-cool-access/cool-tier-block-sizes.png" alt-text="Chart of cool tier throughput at varying block sizes." lightbox="./media/performance-considerations-cool-access/cool-tier-block-sizes.png":::

Hot tier performance was around 2.75x better, capping out at approximately 1,180 MiB/s.

:::image type="content" source="./media/performance-considerations-cool-access/hot-tier-block-sizes.png" alt-text="Chart of hot tier throughput at varying block sizes." lightbox="./media/performance-considerations-cool-access/hot-tier-block-sizes.png":::

This graph shows a side-by-side comparison of cool and hot tier performance with a 256K block size.

:::image type="content" source="./media/performance-considerations-cool-access/throughput-graph.png" alt-text="Chart of throughput at varying `iodepths` with one job." lightbox="./media/performance-considerations-cool-access/throughput-graph.png":::

## What causes latency in hot and cool tiers?

Latency in the hot tier is a factor of the storage system itself, where system resources are exhausted when more I/O is sent to the service than can be handled at any given time. As a result, operations need to queue until previously sent operations can be complete.

Latency in the cool tier is generally seen with the cloud retrieval operations: either requests over the network for I/O to the object store (sequential workloads) or cool block rehydration into the hot tier (random workloads).

## Results summary

- When a workload is 100% sequential, the cool tier's throughput decreases by roughly 47% versus the hot tier (3330 MiB/s compared to 1742 MiB/s).
- When a workload is 100% random, the cool tier’s throughput decreases by roughly 88% versus the hot tier (2,479 MiB/s compared to 280 MiB/s).
- The performance drop for hot tier when doing 100% sequential (3,330 MiB/s) and 100% random (2,479 MiB/s) workloads was roughly 25%. The performance drop for the cool tier when doing 100% sequential (1,742 MiB/s) and 100% random (280 MiB/s) workloads was roughly 88%.
- When a workload contains any percentage of random I/O, overall throughput for the cool tier is closer to 100% random than 100% sequential.
- Reads from cool tier dropped by about 50% when moving from 100% sequential to an 80/20 sequential/random mix.
- Sequential I/O can take advantage of a `readahead` cache in Azure NetApp Files that random I/O doesn't. This benefit to sequential I/O helps reduce the overall performance differences between the hot and cool tiers.

## Considerations and recommendations

- If your workload frequently changes access patterns in an unpredictable manner, cool access may not be ideal due to the performance differences between hot and cool tiers.
- If your workload contains any percentage of random I/O, performance expectations when accessing data on the cool tier should be adjusted accordingly.
- Configure the coolness window and cool access retrieval settings to match your workload patterns and to minimize the amount of cool tier retrieval. 
- Performance from cool access can vary depending on the dataset and system load where the application is running. It's recommended to conduct relevant tests with your dataset to understand and account for performance variability from cool access.

## Next steps
* [Azure NetApp Files storage with cool access](cool-access-introduction.md)
* [Manage Azure NetApp Files storage with cool access](manage-cool-access.md)
