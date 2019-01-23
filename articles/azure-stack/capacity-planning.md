---
title: Capacity planning for Azure Stack | Microsoft Docs
description: Learn about capacity planning for Azure Stack deployments.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/18/2018
ms.author: jeffgilb
ms.reviewer: prchint
---

# Azure Stack capacity planning
When evaluating an Azure Stack Solution, there are hardware configuration choices that have a direct impact on the overall capacity of the Azure Stack Cloud. These are the classic choices of CPU, memory density, storage configuration, and overall solution scale or number of servers. Unlike a traditional virtualization solution, the simple arithmetic of these components to determine usable capacity does not apply. The first reason for this is that Azure Stack is architected to host the infrastructure or management components within the solution itself. The second reason is that some of the solution’s capacity is reserved in support of resiliency; the updating of the solution’s software in a way to minimize disruption of tenant workloads.

> [!IMPORTANT]
> The provided capacity planning information, and accompanying spreadsheet, are intended only as a guide to help you make Azure Stack planning and configuration decisions. They are not intended to serve as a substitute for your own investigation and analysis. 

## Compute and storage capacity planning
An Azure Stack Solution is built as a hyper-converged cluster of compute, networking, and storage. This allows effective use or sharing of all hardware capacity in the cluster, referred to as a Scale Unit for Azure Stack, in a way that provides availability and scalability. All infrastructure software is hosted within a set of virtual machines (VMs) and shares the same physical servers as the tenant VMs. All VMs are then managed by the Scale Unit’s Windows Server clustering technologies and individual Hyper-V instances. This approach simplifies the acquisition and management of an Azure Stack solution and affords for the movement and scalability of all services (tenant and infrastructure) across the entirety of the Scale Unit.

The only physical resource that is not over-provisioned in an Azure Stack solution is server memory. The other resources, CPU cores, networking bandwidth, and storage capacity, will be overprovisioned to make the best use of available resources. When calculating available capacity for a solution, physical server memory is the main contributor. The utilization of other resources is then understanding the ratio of overprovisioning that is possible and what will be acceptable to the intended workload.

Approximately 28 VMs are used to host Azure Stack’s infrastructure and, in total, consume about 208 GB of memory and 124 virtual cores.  The rationale for this number of VMs is to satisfy the needed service separation to meet security, scalability, servicing and patching requirements. This internal service structure allows for the future introduction of new infrastructure services as they are developed.

To support the automated update of all physical server and infrastructure software components, or patch and update, infrastructure and user VM placements will not consume all memory resources of the Scale Unit. An amount of the total memory across all servers of a Scale Unit will be unallocated in support of the solution’s resiliency requirements. For example, when the physical server's Windows Server image is updated, the VMs hosted on the server are moved elsewhere within the Scale Unit while the server’s Windows Server images is updated. When the update is complete, the server is restarted and returned to servicing workloads. The goal for the patch and update of an Azure Stack solution is to avoid the need to stop hosted VMs. In striving to meet that goal, a bare minimum of one server’s memory capacity is unallocated to allow for the movement of VMs within the Scale Unit. This placement and movement applies to both infrastructure VMs and VMs created on the behalf of the user or tenant of the Azure Stack solution. The final implementation results are such that the amount of memory reserved to support the needed VM movement can be much more than a single server’s capacity because of placement challenges when VMs have varying memory requirements. An additional overhead in the category of memory use is that of the Windows Server instance itself. The base operating system instance for each server will consume memory for the operating system and its virtual page tables along with the memory used by Hyper-V in managing each of the hosted VMs.

A further description of the complexities of capacity calculations is describe later in this section. In this introduction, the following examples are provided to assist in understanding the available capacity of varying solution sizes. These are estimates and as a result make assumptions about tenant VM memory use that may not be true for production installations. For this table, the Standard D2 Azure VM size is used. Azure Standard D2 VMs are defined with 2 virtual CPUs and 7 GB of memory.

|     |Per Server Capacity|| Scale Unit Capacity|  |  |||
|-----|-----|-----|-----|-----|-----|-----|-----|
|     | Memory | CPU Cores | Number of servers | Memory | CPU Cores | Tenant VMs<sup>1</sup>     | Core ratio<sup>2</sup>    |
|Example 1|256 GB|28|4|1024 GB| 112 | 54 |4:3|
|Example 2|512 GB|28|4|2024 GB|112|144|4:1|
|Example 3|384 GB|28|12|4608 GB|336|432|3:1|
|     |     |     |     |     |     |     |     |

> <sup>1</sup> Standard D2 VMs.

> <sup>2</sup> Virtual core to physical core ratio.

As mentioned above, the VM capacity is determined by available memory. The virtual-cores to physical-core ratios exemplify how the VM density will change available CPU capacity unless the solution is constructed with a larger number of physical cores (another CPU is chosen). The same is true of storage capacity and storage cache capacity.

The above examples of VM density are for explanation purposes only. There is further complexity in the calculations in support. Contact with Microsoft or a solution partner is required to further understand capacity planning choices and the resulting, available capacity.

The remainder of this section describes Azure Stack deployment requirements for compute and storage. Use this information to gain a base understanding of what components are required and their minimum configuration values. Additional information is also provided to describe how the solution is configured with regards to available capacity and potential limits of the system with regard to tenant capacity and performance capability.

> [!NOTE]
> The capacity planning requirements for networking are minimal as only the size of the Public VIP is configurable. For information about how to add more Public IP Addresses to Azure Stack see [Add Public IP Addresses](azure-stack-add-ips.md).


## Next steps
[Compute capacity planning](capacity-planning-compute.md)
