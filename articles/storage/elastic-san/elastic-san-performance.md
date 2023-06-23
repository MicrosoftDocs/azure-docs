---
title: Azure Elastic SAN Preview performance
description: Performance article example data.
author: roygara
ms.service: storage
ms.topic: overview
ms.date: 06/22/2023
ms.author: rogarana
ms.subservice: elastic-san
---

# Elastic SAN Preview performance

This article helps clarify the performance of an Elastic SAN volume and how they work when used with Azure Virtual Machines (VM).

## How performance works

Azure VMs have input/output operations per second (IOPS) and throughput performance limits based on the type and size of the VM. Elastic SAN volumes can be attached to VMs and the volumes have their own IOPS and throughput limits.

Your application's performance gets capped when it requests more IOPS or throughput than what is allotted for the VM or attached volumes. When capped, the application has suboptimal performance. This can lead to negative consequences like increased latency.

## Examples

- Standard_DS2_v2 VM - AKS - 
- Standard_L48s_v2 - Workload 1
- Standard_L32s_v3 - Workload 2
- Standard_L48_v3 - Workload 3
- Elastic SAN
    - 25 TiB total capacity, 135,000 IOPS, 2160 MB/s
    - 3 TiB AKS volume
    - 10 TiB volume for Workload 1
    - 4 TiB volume for workload 2
    - 2 TiB volume for workload 3

### Scenario 1

This scenario is constructed so that no throttling is occurring at either the VM or SAN level. With this configuration, if an application on the AKS cluster makes a request for 3000 IOPS from the VM, workload 1 requests 10,000 IOPS from its VM, workload 2 requests 8,000 IOPS from its VM, and workload 3 requests 20,000 IOPS from its VM. In this configuration, the SAN itself has 135,000 IOPS, each volume is large enough to be able to serve up to 64,000 IOPS if they're available from the SAN, and the total IOPS requested is 41,000. The AKS VM's IOPS limit is 5,000, w1 is 48,000, w2 is 51,200, w3 is 76,800. So the workloads all execute without any throttling.

### Scenario 2

One of the main benefits of an Elastic SAN is its ability to provision IOPS automatically, based on demand. The IOPS of your SAN is shared amongst all its volumes, so that if a workload peaks, it can be handled without issue or extra cost.

In this scenario, workload 3 peaks by requesting 65,000 IOPS (the max IOPS requirements of that workload) and the peak lasts for ~30 minutes. Simultaneously, the other workloads are all running at different levels of efficiency but not at their peaks. Workload 1 runs at 10k IOPS, the AKS cluster is running at 2k IOPS, and workload 2 is running at 10k IOPS. The total IOPS of these workloads is less than the max IOPS of the SAN and lower than each of the VM supported IOPS. Now, if the remaining workloads peak at different intervals, like if workload 2 peaks at 2 pm and the peak lasts for ~45 minutes, then workload 1 peaks at 4 pm and the peak lasts for ~1 hour. As long as none of the other respective workloads are close to the peaks, the SAN will distribute its available IOPS and handle the extra demand transparently. This is how a SAN should be configured when sharing workloads, it's best to have enough performance to handle normal operations of each workload, as well as being able to handle occasional peaks.

### Scenario 3

 Same Elastic SAN configuration with the workloads peaking at the same time. This example will show what will happen in the worst case when your workloads peak around the same time and will display how exactly throttling happens for an Elastic SAN.  

In this scenario, all the workloads hit their peak at noon. At that point, the total IOPS required by all the workloads combined (65,000 + 45,000 + 40,000 + 5,000) is more than the IOPS provisioned at the SAN level (135,000). So the workloads are throttled. This throttling happens on a first-come, first-served basis, so whichever workloads request IOPS after the max capacity has been reached won't get additional performance. For example, if workload 1 requested the last remaining IOPS from the SAN, then workload 2 makes a request while the SAN's IOPS are all allocated, workload 2 won't receive any additional IOPS.

## Next steps