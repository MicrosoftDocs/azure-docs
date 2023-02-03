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
ms.date: 09/29/2021
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

## Environment details  

The results in this article were achieved using the following environment configuration:

* Azure VMware Solution host size: AV36
* Azure VMware Solution private cloud connectivity: UltraPerformance gateway with FastPath
* Guest virtual machine(s): Ubuntu 21.04, 16 vCPU, 64 GB Memory
* Workload generator: `fio`

## Latency

Azure VMware Solution to Azure NetApp Files datastores traffic latency varies from sub-millisecond for environments under minimal load, up to 2-3 milliseconds for environments under medium to heavy load. The latency is potentially  higher for environments that attempt to push beyond the throughput limits of various components. Latency and throughput may vary depending on several factors, including I/O size, read/write ratios, competing network traffic, and so on.

## One-to-multiple virtual machines running on a single AVS host and a single Azure NetApp Files datastore

Each AVS host to Azure NetApp Files datastore connection represents a unique TCP network flow. In this scenario, all I/O occurs over a single network flow. The graphs below compare the throughput and IOPs of a single virtual machine with the aggregated throughput and IOPs of four virtual machines over a single network flow. In the subsequent scenarios, the number of network flows are increased as more hosts and datastores are added.

:::image type="content" source="../media/azure-netapp-files/performance-vmware-single-datastore.png"" alt-text="Graphs comparing throughput and IOPs of a single virtual machine with the aggregated throughput and IOPs of four virtual machines over a single network flow." lightbox="../media/azure-netapp-files/performance-vmware-single-datastore.png":::

## One-to-multiple Azure NetApp Files datastores with a single AVS host

The graphs below compare the throughput of a single virtual machine on a single Azure NetApp Files datastore with the aggregated throughput of four Azure NetApp Files datastores. In both scenarios, each virtual machine has a VMDK on each Azure NetApp Files datastore.

:::image type="content" source="../media/azure-netapp-files/performance-vmware-one-host-four-datastores.png" alt-text="Graphs comparing throughput of a single virtual machine on a single Azure NetApp Files datastore with the aggregated throughput of four Azure NetApp Files datastores." lightbox="../media/performance-vmware-one-host-four-datastores.png":::

The graphs below compare the IOPs of a single virtual machine on a single Azure NetApp Files datastore with the aggregated IOPs of eight Azure NetApp Files datastores. In both scenarios, each virtual machine has a VMDK on each Azure NetApp Files datastore.

:::image type="content" source="../media/azure-netapp-files/performance-vmware-one-host-eight-datastores.png" alt-text="Graphs comparing IOPs of a single virtual machine on a single Azure NetApp Files datastore with the aggregated IOPs of eight Azure NetApp Files datastores." lightbox="../media/performance-vmware-one-host-eight-datastores.png":::

## Scale-out Azure NetApp Files datastores with multiple AVS hosts

The graph below shows the aggregated throughput and IOPs of 16 virtual machines distributed across four AVS hosts. There are four virtual machines per AVS host, each on a different Azure NetApp Files datastore.

Nearly identical results were achieved with a single virtual machine on each host with four VMDKs per virtual machine and each of those VMDKs on a separate datastore. 

:::image type="content" source="../media/azure-netapp-files/performance-vmware-scale-out.png " alt-text="Graphs showing aggregated throughput and IOPs of 16 virtual machines distributed across four AVS hosts." lightbox="../media/performance-vmware-scale-out.png ":::

## Next steps

- [Attach Azure NetApp Files datastores to Azure VMware Solution hosts: Performance best practices ](../azure-vmware/attach-azure-netapp-files-to-azure-vmware-solution-hosts.md#performance-best-practices)
