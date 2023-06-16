---
title: Azure NetApp Files datastore performance benchmarks for Azure VMware Solution | Microsoft Docs
description: Describes performance benchmarks that Azure NetApp Files datastores deliver for virtual machines on Azure VMware Solution.
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 03/15/2023
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

Refer to the [Azure NetApp Files datastore for Azure VMware Solution TCO Estimator](https://aka.ms/anfavscalc) to understand the sizing and associated cost benefits of Azure NetApp Files datastores.

## Environment details  

The results in this article were achieved using the following environment configuration:

* Azure VMware Solution host size: AV36
* Azure VMware Solution private cloud connectivity: UltraPerformance gateway with FastPath
* Guest virtual machine(s): Ubuntu 21.04, 16 vCPU, 64 GB Memory
* Workload generator: `fio`

## Latency

Traffic latency from AVS to Azure NetApp Files datastores varies from sub-millisecond (for environments under minimal load) up to 2-3 milliseconds (for environments under medium to heavy load). The latency is potentially  higher for environments that attempt to push beyond the throughput limits of various components. Latency and throughput may vary depending on several factors, including I/O size, read/write ratios, competing network traffic, and so on.

## One-to-multiple virtual machines running on a single AVS host and a single Azure NetApp Files datastore

In a single AVS host scenario, the AVS to Azure NetApp Files datastore I/O occurs over a single network flow. The following graphs compare the throughput and IOPs of a single virtual machine with the aggregated throughput and IOPs of four virtual machines. In the subsequent scenarios, the number of network flows increases as more hosts and datastores are added.

:::image type="content" source="../media/azure-netapp-files/performance-vmware-single-datastore.png" alt-text="Graphs comparing a single virtual machine with four virtual machines over a single network flow." lightbox="../media/azure-netapp-files/performance-vmware-single-datastore.png":::

## One-to-multiple Azure NetApp Files datastores with a single AVS host

The following graphs compare the throughput of a single virtual machine on a single Azure NetApp Files datastore with the aggregated throughput of four Azure NetApp Files datastores. In both scenarios, each virtual machine has a VMDK on each Azure NetApp Files datastore.

:::image type="content" source="../media/azure-netapp-files/performance-vmware-one-host-four-datastores.png" alt-text="Graphs comparing a single virtual machine on a single datastore with four datastores." lightbox="../media/azure-netapp-files/performance-vmware-one-host-four-datastores.png":::

The following graphs compare the IOPs of a single virtual machine on a single Azure NetApp Files datastore with the aggregated IOPs of eight Azure NetApp Files datastores. In both scenarios, each virtual machine has a VMDK on each Azure NetApp Files datastore.

:::image type="content" source="../media/azure-netapp-files/performance-vmware-one-host-eight-datastores.png" alt-text="Graphs comparing a single virtual machine on a single datastore with eight datastores." lightbox="../media/azure-netapp-files/performance-vmware-one-host-eight-datastores.png":::

## Scale-out Azure NetApp Files datastores with multiple AVS hosts

The following graph shows the aggregated throughput and IOPs of 16 virtual machines distributed across four AVS hosts. There are four virtual machines per AVS host, each on a different Azure NetApp Files datastore.

Nearly identical results were achieved with a single virtual machine on each host with four VMDKs per virtual machine and each of those VMDKs on a separate datastore. 

:::image type="content" source="../media/azure-netapp-files/performance-vmware-scale-out.png" alt-text="Graphs showing aggregated throughput and IOPs of 16 virtual machines distributed across four AVS hosts." lightbox="../media/azure-netapp-files/performance-vmware-scale-out.png":::

## Next steps

- [Attach Azure NetApp Files datastores to Azure VMware Solution hosts: Performance best practices ](../azure-vmware/attach-azure-netapp-files-to-azure-vmware-solution-hosts.md#performance-best-practices)
