---
title: H-series-retirement
description: H-series retirement starting September 1, 2021
author: vermagit
ms.service: virtual-machines
ms.subservice: vm-sizes-hpc
ms.topic: conceptual
ms.date: 08/02/2021
ms.author: amverma
---

# Migrate your H and H_Promo series virtual machines by August 31, 2022
As Microsoft Azure has introduced newer generations of High Performance Computing (HPC), General Purpose, and Memory Optimized virtual machines, we recommend migrating workloads from original H-series (inclusive of H-series promo) virtual machines to our newer offerings.

Azure [HC](hc-series.md), [HBv2](hbv2-series.md), [HBv3](hbv3-series.md), [Dv4](dv4-dsv4-series.md), [Dav4](dav4-dasv4-series.md), [Ev4](ev4-esv4-series.md), and [Eav4](eav4-easv4-series.md) virtual machines have greater memory bandwidth, improved networking capabilities, and better cost/performance across a broad variety of HPC workloads. Consequently, we are retiring our H-series Azure Virtual Machine sizes (H8, H8m, H16, H16r, H16m, H16mr, H8 Promo, H8m Promo, H16 Promo, H16r Promo, H16m Promo, and H16mr Promo) on 31 August 2022.

## How does the H-series migration affect me?  

After 31 August 2022, any remaining H-series virtual machine subscriptions stated above will be set to a deallocated state, will stop working, and will no longer incur billing charges. 

The current VM size retirement only impacts the VM sizes in the [H-series](h-series.md), including H-series promo. 

## What actions should I take?  

You will need to resize or deallocate your H-series virtual machines. We recommend migrating workloads from original H-series (inclusive of H-series promo) virtual machines to our newer offerings.

For HPC workloads, [HC](hc-series.md), [HBv2](hbv2-series.md), and [HBv3](hbv3-series.md) VMs offer substantially higher levels of HPC workload performance and cost efficiency due to large improvements in CPU core architecture, higher memory bandwidth, larger L3 caches, and enhanced InfiniBand networking hardware and software support as compared to H-series. As a result, HC, HBv2, and HBv3-series will in general offer substantially better performance per unit of cost (maximizing performance for a fixed amount of spend) and cost per performance (minimizing cost for a fixed amount of performance). 

For General Purpose workloads, [Dv4](dv4-dsv4-series.md), [Dav4](dav4-dasv4-series.md), and Dv5 VMs offer the same or better CPU performance at identical or larger core counts, a comparable amount of memory per physical CPU core, better Azure Networking capabilities, and lower overall cost. 

For Memory Optimized workloads, [Ev4](ev4-esv4-series.md), [Eav4](eav4-easv4-series.md), and Ev5 VMs offer the same or better CPU performance at identical or larger core counts, a comparable amount of memory per physical CPU core, better Azure Networking capabilities, and lower overall cost. 

[H-series](h-series.md) VMs (inclusive of H-series Promo) will not be retired until September 2022, so we are providing this guide in advance to give customers a long window to assess, plan, and execute their migration. 


### Migration Steps 
1. Choose a series and size for migration. 
2. Get quota for the target VM series 
3. Resize the current H-series VM size to the target size 


### Breaking Changes 
If you use H-series VM sizes that expose an InfiniBand networking interface (such as those with an ‘r’ in the VM size name) and you want your new VM sizes to also support InfiniBand networking, you will no longer be able to use legacy OS images with built-in InfiniBand driver support (CentOS 7.4 and prior, Windows Server 2012). Instead, use modern OS images such as those on the Azure Marketplace that support modern operating systems (CentOS 7.5 and newer, Windows Server 2016 and newer) and standard OFED drivers. See the [supported software stack](hbv3-series.md#get-started), including supported OS for the respective VM sizes. 


### Get quota for the target VM family 

Follow the guide to [request an increase in vCPU quota by VM family](../azure-portal/supportability/per-vm-quota-requests.md).


### Resize the current virtual machine
You can [resize the virtual machine](resize-vm.md).
