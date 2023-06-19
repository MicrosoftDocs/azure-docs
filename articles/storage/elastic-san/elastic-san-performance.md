---
title: Azure Elastic SAN Preview performance
description: An overview of Azure Elastic SAN Preview, a service that enables you to create a virtual SAN to act as the storage for multiple compute options.
author: roygara
ms.service: storage
ms.topic: overview
ms.date: 05/02/2023
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

This scenario is constructed so that no throttling is occuring at either the VM or SAN level. With this configuration, if an application on the AKS cluster makes a request for 3000 IOPS from the VM, workload 1 requests 10,000 IOPS from its VM, workload 2 requests 8,000 IOPS from its VM, and workload 3 requests 20,000 IOPS from its VM. In this configuration, the SAN itself has 135,000 IOPS, each volume is large enough to be able to serve up to 64,000 IOPS if they're available from the SAN, and the total IOPS requested is 41,000. The AKS VM 