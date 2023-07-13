---
title: Azure Elastic SAN Preview performance
description: Performance article example data.
author: roygara
ms.service: storage
ms.topic: overview
ms.date: 07/11/2023
ms.author: rogarana
ms.subservice: elastic-san
---

# Elastic SAN Preview performance

This article helps clarify the performance of an Elastic SAN volume and how they work when used with Azure Virtual Machines (VM).

## How performance works

Azure VMs have input/output operations per second (IOPS) and throughput performance limits based on the type and size of the VM. An Elastic SAN has a pool of performance that it allocates to each of its volumes. Elastic SAN volumes can be attached to VMs and each volume has its own IOPS and throughput limits.

Your application's performance gets throttled when it requests more IOPS or throughput than what is allotted for the VM or attached volumes. When throttled, the application has suboptimal performance, and can experience negative consequences like increased latency. One of the main benefits of an Elastic SAN is its ability to provision IOPS automatically, based on demand. Your SAN's IOPS are shared amongst all its volumes, so when a workload peaks, it can be handled without throttling or extra cost. This article shows how this provisioning works.

## Examples

Each of the example scenarios use the following configuration for the VMs and the Elastic SAN:

### VM limits

|VM  |VM IOPS limit  |
|---------|---------|
|Standard_DS2_v2 (AKS)     |5,000         |
|Standard_L48s_v2 (workload 1)     |48,000     |
|Standard_L32s_v3 (workload 2)    |51,200         |
|Standard_L48_v3 (workload 3)    |76,800         |

### Elastic SAN limits

|Resource  |Capacity  |IOPS  |
|---------|---------|---------|
|Elastic SAN     |25 TiB         |135,000 (provisioned)         |
|AKS SAN volume     |3 TiB         | Up to 64,000         |
|Workload 1 SAN volume     |10 TiB         |Up to 64,000         |
|Workload 2 SAN volume     |4 TiB         |Up to 64,000         |
|Workload 3 SAN volume     |2 TiB          |Up to 64,000         |


### Typical workload

|Workload  |Requested IOPS  |Served IOPS  |
|---------|---------|---------|
|AKS workload     |3,000         |3,000         |
|Workload 1     |10,000         |10,000         |
|Workload 2     |8,000         |8,000         |
|Workload 3     |20,000         |20,000         |

In this scenario, no throttling occurs at either the VM or SAN level. The SAN itself has 135,000 IOPS, each volume is large enough to serve up to 64,000 IOPS, enough IOPS are available from the SAN, none of the VM's IOPS limits have been surpassed, and the total IOPS requested is 41,000. So the workloads all execute without any throttling.

:::image type="content" source="media/elastic-san-performance/scenario_one.png" alt-text="Average scenario example diagram." lightbox="media/elastic-san-performance/scenario_one.png":::

### Single workload spike


|Workload  |Requested IOPS  |Served IOPS  |Spike time and duration  |
|---------|---------|---------|---------|
|AKS workload     |2,000         |2,000         |         |
|Workload 1     |10,000         |10,000         |         |
|Workload 2     |10,000         |10,000         |         |
|Workload 3     |64,000         |64,000         |         |


In this scenario, workload 3 peaks for roughly 30 minutes at noon, requesting 65,000 IOPS (the max IOPS requirements of that workload) for the entire spike. At the same time, the other workloads continue operating normally but, haven't peaked. Workload 1 runs at 10k IOPS, the AKS cluster is running at 2k IOPS, and workload 2 is running at 10k IOPS. The total IOPS of these workloads are less than the maximum IOPS of the SAN and less than each of the VM's supported IOPS. If the remaining workloads spike at different points of time, like if workload 2 peaks at 2 pm and the spike lasts for ~45 minutes, then workload 1 peaks at 4 pm and the spike lasts for ~1 hour. As long as none of the other respective workloads are close to the peaks, the SAN distributes its available IOPS and handle the extra demand transparently. This is the ideal configuration for a SAN when sharing workloads. It's best to have enough performance to handle occasional workload peaks, and the normal operations of each workload.

:::image type="content" source="media/elastic-san-performance/scenario_two.png" alt-text="Single workload spike example diagram." lightbox="media/elastic-san-performance/scenario_two.png":::

### All workloads spike

It's important to know the behavior of a SAN in the worst case scenario, where each workload peaks at the same time.

In this scenario, all the workloads hit their spike at noon. At that point, the total IOPS required by all the workloads combined (64,000 + 45,000 + 40,000 + 5,000) is more than the IOPS provisioned at the SAN level (135,000). So the workloads are throttled. Throttling happens on a first-come, first-served basis, so whichever workloads request IOPS after the max capacity has been reached doesn't get more performance. So if workload 1 requested the last remaining IOPS from the SAN at 12:01 pm, then workload 2 makes a request at 12:02 pm, since the SAN's IOPS are already allocated, workload 2 doesn't receive any more IOPS.

:::image type="content" source="media/elastic-san-performance/scenario_three.png" alt-text="All workloads peaking example diagram." lightbox="media/elastic-san-performance/scenario_three.png":::

## Next steps