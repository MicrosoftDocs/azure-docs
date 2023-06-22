---
title: Azure Elastic SAN Preview performance
description: An overview of Azure Elastic SAN Preview, a service that enables you to create a virtual SAN to act as the storage for multiple compute options.
author: roygara
ms.service: storage
ms.topic: overview
ms.date: 06/22/2023
ms.author: rogarana
ms.subservice: elastic-san
ms.custom: ignite-2022
---

# What is Azure Elastic SAN? Preview

This article helps clarify the performance of an Elastic SAN volume and how they work when used with Azure Virtual Machines (VM).

## How performance works

Azure VMs have input/output operations per second (IOPS) and throughput performance limits based on the type and size of the VM. Elastic SAN volumes can be attached to VMs and the volumes have their own IOPS and throughput limits.

Your application's performance gets capped when it requests more IOPS or thoughput than what is allotted for the VM or attached volumes. When capped, the application has suboptimal performance. This can lead to negative consequences like increased latency.

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

Let’s say that with the above Elastic SAN configuration, the application running on workload 3 peaks at 12 pm, i.e., the workload requests 65,000 IOPS (the max IOPS requirements of that workload) and the peak lasts for ~30 minutes. Simultaneously, in the background, the other workloads are all running at different levels of efficiency but not at their peaks. Workload 1 runs at 10k IOPS, the AKS cluster is running at 2k IOPS, and workload 2 is running at 10k IOPS. The total IOPS of these workloads is less than the max IOPS of the SAN and lower than each of the VM level maxima. Now, let’s say workload 2 peaks at 2 pm and the peak lasts for ~45 minutes while workload 1 peaks at 4 pm and the peak lasts for ~1 hour. Let us also say that in each of these scenarios that neither of the other respective workloads are even close to their peaks. This is a good example of how a SAN should be used for sharing workloads – the idea being that none of the workloads will be peaking at the same time and so the pool of performance that is provisioned at the SAN level is shared between the volumes of the SAN. This is what a typical SAN use case should look like if it is planned well.

### Scenario 3

 Same Elastic SAN configuration with the workloads peaking at the same time. This example will show what will happen in the worst case when your workloads peak around the same time and will display how exactly throttling happens for an Elastic SAN.  

Let’s say that with the above Elastic SAN configuration, all the workloads hit their peak at noon. At that point, the total IOPS required by all the workloads combined (65,000 + 45,000 + 40,000 + 5,000) is more than the IOPS provisioned at the SAN level (135,000). Therefore, the workloads will begin to experience throttling. This throttling happens on a first-come, first-served basis, which means that whichever workloads request IOPS after the max capacity has been reached will no longer receive additional performance. For example, if the last bit of IOPS went to workload 1 and workload 2 requests some more performance after the SAN level cap has been hit, it will not receive the requested performance. Similarly, any workloads that request more performance after the cap has been reached will not receive it. To put it into numbers, if workload 3 has 65,000 IOPS, workload 2 has 45,000 IOPS and the AKS one has 5,000 IOPS, workload 1 will only be able to use 20,000 IOPS for its purposes.

## Next steps