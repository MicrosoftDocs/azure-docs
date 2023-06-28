---
title: Azure Elastic SAN Preview performance
description: Performance article example data.
author: roygara
ms.service: storage
ms.topic: overview
ms.date: 06/28/2023
ms.author: rogarana
ms.subservice: elastic-san
---

# Elastic SAN Preview performance

This article helps clarify the performance of an Elastic SAN volume and how they work when used with Azure Virtual Machines (VM).

## How performance works

Azure VMs have input/output operations per second (IOPS) and throughput performance limits based on the type and size of the VM. Elastic SAN volumes can be attached to VMs and the volumes have their own IOPS and throughput limits.

Your application's performance gets capped when it requests more IOPS or throughput than what is allotted for the VM or attached volumes. When capped, the application has suboptimal performance. This can lead to negative consequences like increased latency.

## Examples

Each of the following example scenarios use the following configuration for the VMs and the Elastic SAN:

- Standard_DS2_v2 VM - AKS - IOPS limit of 5,000
- Standard_L48s_v2 - Workload 1 - IOPS limit of 48,000
- Standard_L32s_v3 - Workload 2 - IOPS limit of 51,200
- Standard_L48_v3 - Workload 3 - IOPS limit of 76,800
- Elastic SAN
    - 25 TiB total capacity, 135,000 IOPS, 2160 MB/s
    - 3 TiB AKS volume
    - 10 TiB volume for Workload 1
    - 4 TiB volume for workload 2
    - 2 TiB volume for workload 3

### Average scenario

In this scenario, no throttling occurs at either the VM or SAN level. An application on the AKS cluster makes a request for 3000 IOPS from the VM, workload 1 requests 10,000 IOPS from its VM, workload 2 requests 8,000 IOPS from its VM, and workload 3 requests 20,000 IOPS from its VM. Since the SAN itself has 135,000 IOPS, each volume is large enough to serve up to 64,000 IOPS if they're available from the SAN, none of the VM's IOPS limits have been surpassed, and the total IOPS requested is 41,000. So the workloads all execute without any throttling.

:::image type="content" source="media/elastic-san-performance/scenario_one.png" alt-text="Average scenario example diagram." lightbox="media/elastic-san-performance/scenario_one.png":::

### Single workload peak

One of the main benefits of an Elastic SAN is its ability to provision IOPS automatically, based on demand. Your SAN's IOPS are shared amongst all its volumes, so when a workload peaks, it can be handled without throttling or extra cost.

In this scenario, workload 3 peaks for roughly 30 minutes at noon, requesting 65,000 IOPS (the max IOPS requirements of that workload) for the entire peak. At the same time, the other workloads continue operating normally but, haven't peaked. Workload 1 runs at 10k IOPS, the AKS cluster is running at 2k IOPS, and workload 2 is running at 10k IOPS. The total IOPS of these workloads is less than the maximum IOPS of the SAN and less than each of the VM's supported IOPS. If the remaining workloads peak at different points of time, like if workload 2 peaks at 2 pm and the peak lasts for ~45 minutes, then workload 1 peaks at 4 pm and the peak lasts for ~1 hour. As long as none of the other respective workloads are close to the peaks, the SAN will distribute its available IOPS and handle the extra demand transparently. This is the ideal configuration for a SAN when sharing workloads. It's best to have enough performance to handle occasional workload peaks, as well as the normal operations of each workload.

:::image type="content" source="media/elastic-san-performance/scenario_two.png" alt-text="Single workload peak example diagram." lightbox="media/elastic-san-performance/scenario_two.png":::

### All workloads peak

It's important to know the behavior of a SAN in the worst case scenario, where each workload peaks at the same time.

In this scenario, all the workloads hit their peak at noon. At that point, the total IOPS required by all the workloads combined (65,000 + 45,000 + 40,000 + 5,000) is more than the IOPS provisioned at the SAN level (135,000). So the workloads are throttled. Throttling happens on a first-come, first-served basis, so whichever workloads request IOPS after the max capacity has been reached won't get additional performance. So if workload 1 requested the last remaining IOPS from the SAN at 12:01 pm, then workload 2 makes a request at 12:02 pm, while the SAN's IOPS are already allocated, workload 2 won't receive any additional IOPS.

:::image type="content" source="media/elastic-san-performance/scenario_three.png" alt-text="All workloads peaking example diagram." lightbox="media/elastic-san-performance/scenario_three.png":::

## Next steps