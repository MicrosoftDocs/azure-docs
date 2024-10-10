---
title: Performance considerations for Azure NetApp Files storage with cool access
description: Understand use cases for cool access and the effect it can have on performance. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 09/05/2024
ms.author: anfdocs
---
# Performance considerations for Azure NetApp Files storage with cool access

Data sets aren't always actively used. Up to 80% of data in a set can be considered "cool," meaning it's not currently in use or hasn't been accessed recently. When storing data on high performance storage such as Azure NetApp Files, the money spent on the capacity being used is essentially being wasted since cool data doesn't require high performance storage until it's being accessed again. 

[Azure NetApp Files storage with cool access](cool-access-introduction.md) is intended to reduce costs for cloud storage in Azure. There are performance considerations in specific use cases that need to be considered.

Accessing data that has moved to the cool tiers incurs more latency, particularly for random I/O. In a worst-case scenario, all of the data being accessed might be on the cool tier, so every request would need to conduct a retrieval of the data. It's uncommon for all of the data in an actively used dataset to be in the cool tier, so it's unlikely to observe such latency. 

When the default cool access retrieval policy is selected, sequential I/O reads are served directly from the cool tier and doesn't repopulate into the hot tier. Randomly read data is repopulated into the hot tier, increasing the performance of subsequent reads. Optimizations for sequential workloads often reduce the latency incurred by cloud retrieval as compared to random reads and improves overall performance.  

In a recent test performed using Standard storage with cool access for Azure NetApp Files, the following results were obtained.

## 100% sequential reads on hot/cool tier (single job)

In the following scenario, a single job on one D32_V5 virtual machine (VM) was used on a 50-TiB Azure NetApp Files volume using the Ultra performance tier. Different block sizes were used to test performance on hot and cool tiers.

>[!NOTE]
>The maximum for the Ultra service level is 128 MiB/s per tebibyte of allocated capacity. An Azure NetApp Files regular volume can manage a throughput up to approximately 5,000 MiB/s.

The following graph shows the cool tier performance for this test using a variety of queue depths. The maximum throughput for a single VM was approximately 400 MiB/s.

:::image type="content" source="./media/performance-considerations-cool-access/cool-tier-block-sizes.png" alt-text="Chart of cool tier throughput at varying block sizes." lightbox="./media/performance-considerations-cool-access/cool-tier-block-sizes.png":::

Hot tier performance was around 2.75x better, capping out at approximately 11,180 MiB/s.

:::image type="content" source="./media/performance-considerations-cool-access/hot-tier-block-sizes.png" alt-text="Chart of hot tier throughput at varying block sizes." lightbox="./media/performance-considerations-cool-access/hot-tier-block-sizes.png":::

This graph shows a side-by-side comparison of cool and hot tier performance with a 256K block size.

:::image type="content" source="./media/performance-considerations-cool-access/throughput-graph.png" alt-text="Chart of throughput at varying `iodepths` with one job." lightbox="./media/performance-considerations-cool-access/throughput-graph.png":::

## 100% sequential reads on hot/cool tier (multiple jobs)

For this scenario, the test was conducted with 16 job using a 256=KB block size on a single D32_V5 VM on a 50-TiB Azure NetApp Files volume using the Ultra performance tier. 

>[!NOTE]
>The maximum for the Ultra service level is 128 MiB/s per tebibyte of allocated capacity. An Azure NetApp Files regular volume can manage a throughput of up to approximately 5,000 MiB/s.

It's possible to push for more throughput for the hot and cool tiers using a single VM when running multiple jobs. The performance difference between hot and cool tiers is less drastic when running multiple jobs. The following graph displays results for hot and cool tiers when running 16 jobs with 16 threads at a 256-KB block size. 

:::image type="content" source="./media/performance-considerations-cool-access/throughput-sixteen-jobs.png" alt-text="Chart of throughput at varying `iodepths` with 16 jobs." lightbox="./media/performance-considerations-cool-access/throughput-sixteen-jobs.png":::

- Throughput improved by nearly three times for the hot tier.
- Throughput improved by 6.5 times for the cool tier.
- The performance difference for the hot and cool tier decreased from 2.9x to just 1.3x.

## Maximum viable job scale for cool tier – 100% sequential reads

The cool tier has a limit of how many jobs can be pushed to a single Azure NetApp Files volume before latency starts to spike to levels that are generally unusable for most workloads.

In the case of cool tiering, that limit is around 16 jobs with a queue depth of no more than 15. The following graph shows that latency spikes from approximately 23 milliseconds (ms) with 16 jobs/15 queue depth with slightly less throughput than with a queue depth of 14. Latency spikes as high as about 63 ms when pushing 32 jobs and throughput drops by roughly 14%.

:::image type="content" source="./media/performance-considerations-cool-access/sixteen-jobs-line-graph.png" alt-text="Chart of throughput and latency for tests with 16 jobs." lightbox="./media/performance-considerations-cool-access/sixteen-jobs-line-graph.png":::

## What causes latency in hot and cool tiers?

Latency in the hot tier is a factor of the storage system itself, where system resources are exhausted when more I/O is sent to the service than can be handled at any given time. As a result, operations need to queue until previously sent operations can be complete.

Latency in the cool tier is generally seen with the cloud retrieval operations: either requests over the network for I/O to the object store (sequential workloads) or cool block rehydration into the hot tier (random workloads).

## Mixed workload:  sequential and random

A mixed workload contains both random and sequential I/O patterns. In mixed workloads, performance profiles for hot and cool tiers can have drastically different results compared to a purely sequential I/O workload but are very similar to a workload that's 100% random.

The following graph shows the results using 16 jobs on a single VM with a queue depth of one and varying random/sequential ratios. 

:::image type="content" source="./media/performance-considerations-cool-access/mixed-workload-throughput.png" alt-text="Chart showing throughput for mixed workloads." lightbox="./media/performance-considerations-cool-access/mixed-workload-throughput.png":::

The impact on performance when mixing workloads can also be observed when looking at the latency as the workload mix changes. The graphs show how latency impact for cool and hot tiers as the workload mix goes from 100% sequential to 100% random. Latency starts to spike for the cool tier at around a 60/40 sequential/random mix (greater than 12 ms), while latency remains the same (under 2 ms) for the hot tier.

:::image type="content" source="./media/performance-considerations-cool-access/mixed-workload-throughput-latency.png" alt-text="Chart showing throughput and latency for mixed workloads." lightbox="./media/performance-considerations-cool-access/mixed-workload-throughput-latency.png":::


## Results summary

- When a workload is 100% sequential, the cool tier's throughput decreases by roughly 47% versus the hot tier (3330 MiB/s compared to 1742 MiB/s).
- When a workload is 100% random, the cool tier’s throughput decreases by roughly 88% versus the hot tier (2,479 MiB/s compared to 280 MiB/s).
- The performance drop for hot tier when doing 100% sequential (3,330 MiB/s) and 100% random (2,479 MiB/s) workloads was roughly 25%. The performance drop for the cool tier when doing 100% sequential (1,742 MiB/s) and 100% random (280 MiB/s) workloads was roughly 88%.
- Hot tier throughput maintains about 2,300 MiB/s regardless of the workload mix.
- When a workload contains any percentage of random I/O, overall throughput for the cool tier is closer to 100% random than 100% sequential.
- Reads from cool tier dropped by about 50% when moving from 100% sequential to an 80/20 sequential/random mix.
- Sequential I/O can take advantage of a `readahead` cache in Azure NetApp Files that random I/O doesn't. This benefit to sequential I/O helps reduce the overall performance differences between the hot and cool tiers.

## General recommendations

To avoid worst-case scenario performance with cool access in Azure NetApp Files, follow these recommendations:

- If your workload frequently changes access patterns in an unpredictable manner, cool access may not be ideal due to the performance differences between hot and cool tiers.
- If your workload contains any percentage of random I/O, performance expectations when accessing data on the cool tier should be adjusted accordingly.
- Configure the coolness window and cool access retrieval settings to match your workload patterns and to minimize the amount of cool tier retrieval. 

## Next steps
* [Azure NetApp Files storage with cool access](cool-access-introduction.md)
* [Manage Azure NetApp Files storage with cool access](manage-cool-access.md)
