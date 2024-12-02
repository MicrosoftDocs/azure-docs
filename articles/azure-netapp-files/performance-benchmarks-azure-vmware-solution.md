---
title: Azure NetApp Files datastore performance benchmarks for Azure VMware Solution | Microsoft Docs
description: Describes performance benchmarks that Azure NetApp Files datastores deliver for virtual machines on Azure VMware Solution.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 12/02/2024
ms.author: anfdocs
---
# Azure NetApp Files datastore performance benchmarks for Azure VMware Solution

This article describes performance benchmarks that Azure NetApp Files datastores deliver for virtual machines on Azure VMware Solution (AVS). 

The tested scenarios are as follows: 
* One-to-multiple virtual machines running on a single AVS host and a single Azure NetApp Files datastore   
* One-to-multiple Azure NetApp Files datastores with a single AVS host
* Scale-out Azure NetApp Files datastores with multiple AVS hosts 

The following `read:write` I/O ratios were tested for each scenario: `100:0, 75:25, 50:50, 25:75, 0:100` 

Benchmarks documented in this article were performed with sufficient volume throughput to prevent soft limits from affecting performance. Benchmarks can be achieved with Azure NetApp Files Premium and Ultra service levels, and in some cases with Standard service level. For more information on volume throughput, see [Performance considerations for Azure NetApp Files](azure-netapp-files-performance-considerations.md).

Consult the [Azure NetApp Files datastore for Azure VMware Solution TCO Estimator](https://aka.ms/anfavscalc) to understand the sizing and associated cost benefits of Azure NetApp Files datastores.

## Latency

Traffic latency from AVS to Azure NetApp Files datastores varies from submillisecond (for environments under minimal load) up to 2-3 milliseconds (for environments under medium to heavy load). The latency is potentially higher for environments that attempt to push beyond the throughput limits of various components. Latency and throughput may vary depending on factors including I/O size, read/write ratios, competing network traffic, and others.

## Performance scaling 

Each AVS Host connects to each Azure NetApp Files datastore with a fixed number of network flows which may limit an individual VM disk's (VMDK) or AVS host’s throughput to each datastore. Multiple datastores might be required depending on a given set of workloads and their performance demands. Overall storage performance for each AVS host can be increased by spreading workloads across multiple datastores. You can also increase performance by spreading workload to each datastore across AVS hosts. The following graph shows the relative performance scaling of additional datastores. 

:::image type="content" source="./media/performance-benchmarks-azure-vmware-solution/performance-gains.png" alt-text="Graph of performance gains." lightbox="./media/performance-benchmarks-azure-vmware-solution/performance-gains.png":::

>[!NOTE]
>Throughput ceiling for external datastores may be limited by other factors including network bandwidth, SKU limits, or service level ceilings for Azure NetApp Files volumes.

Throughput for each individual host may be affected by the selected AVS SKU. The AV64 SKU has 100-Gigabit Ethernet (GbE) network interface cards (NICs). The other SKUs have 25 GbE NICs. Individual network flows (such as NFS mounts) may be limited by the 25 GbE NICs. 

## Environment details  

The results in this article were achieved using the following environment configuration:

* Azure VMware Solution host size: AV64 running VMware ESXi version 7u3
* Azure VMware Solution private cloud connectivity: UltraPerformance gateway with FastPath
* Guest virtual machines: Rocky Linux 9, 16 vCPU, 64 GB memory
* Workload generator: `fio` 3.35

>[!NOTE]
> The AV64 tests focus only on the evaluation of a single ESXi host. Scaling out the number of ESXi hosts is discussed in the AV36 section. 

## Next steps

- [Attach Azure NetApp Files datastores to Azure VMware Solution hosts: Performance best practices ](../azure-vmware/attach-azure-netapp-files-to-azure-vmware-solution-hosts.md#performance-best-practices)

<!-- -->



## Latency

Traffic latency from AVS to Azure NetApp Files datastores varies from sub-millisecond (for environments under minimal load) up to 2-3 milliseconds (for environments under medium to heavy load). The latency is potentially  higher for environments that attempt to push beyond the throughput limits of various components. Latency and throughput may vary depending on several factors, including I/O size, read/write ratios, competing network traffic, and so on.

## One-to-multiple virtual machines running on a single AVS host and a single Azure NetApp Files datastore

In a single AVS host scenario, the AVS to Azure NetApp Files datastore I/O occurs over a single network flow. The following graphs compare the throughput and IOPs of a single virtual machine with the aggregated throughput and IOPs of four virtual machines. In the subsequent scenarios, the number of network flows increases as more hosts and datastores are added.


## One-to-multiple Azure NetApp Files datastores with a single AVS host

The following graphs compare the throughput of a single virtual machine on a single Azure NetApp Files datastore with the aggregated throughput of four Azure NetApp Files datastores. In both scenarios, each virtual machine has a VMDK on each Azure NetApp Files datastore.

:::image type="content" source="./media/performance-benchmarks-azure-vmware-solution/performance-vmware-one-host-four-datastores.png" alt-text="Graphs comparing a single virtual machine on a single datastore with four datastores." lightbox="./media/performance-benchmarks-azure-vmware-solution/performance-vmware-one-host-four-datastores.png":::

The following graphs compare the IOPs of a single virtual machine on a single Azure NetApp Files datastore with the aggregated IOPs of eight Azure NetApp Files datastores. In both scenarios, each virtual machine has a VMDK on each Azure NetApp Files datastore.

:::image type="content" source="./media/performance-benchmarks-azure-vmware-solution/performance-vmware-one-host-eight-datastores.png" alt-text="Graphs comparing a single virtual machine on a single datastore with eight datastores." lightbox="./media/performance-benchmarks-azure-vmware-solution/performance-vmware-one-host-eight-datastores.png":::

## Scale-out Azure NetApp Files datastores with multiple AVS hosts

The following graph shows the aggregated throughput and IOPs of 16 virtual machines distributed across four AVS hosts. There are four virtual machines per AVS host, each on a different Azure NetApp Files datastore.

Nearly identical results were achieved with a single virtual machine on each host with four VMDKs per virtual machine and each of those VMDKs on a separate datastore. 

:::image type="content" source="./media/performance-benchmarks-azure-vmware-solution/performance-vmware-scale-out.png" alt-text="Graphs showing aggregated throughput and IOPs of 16 virtual machines distributed across four AVS hosts." lightbox="./media/performance-benchmarks-azure-vmware-solution/performance-vmware-scale-out.png":::


