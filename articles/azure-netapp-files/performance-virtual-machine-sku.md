---
title: Azure virtual machine SKUs best practices for Azure NetApp Files | Microsoft Docs
description: Describes Azure NetApp Files best practices about Azure virtual machine SKUs, including differences within and between SKUs.   
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
ms.date: 07/02/2021
ms.author: anfdocs
---
# Azure virtual machine SKUs best practices for Azure NetApp Files

This article describes Azure NetApp Files best practices about Azure virtual machine SKUs, including differences within and between SKUs.   

## SKU selection considerations

Storage performance involves more than the speed of the storage itself. The processor speed and architecture have a lot to do with the overall experience from any particular compute node. As part of the selection process for a given SKU, you should consider the following factors:

* AMD or Intel: For example, SAS uses a math kernel library designed specifically for Intel processors.  In this case, Intel SKUs are preferred over AMD SKU.
* The F2, E_v3, and D_v3 machine types are each based on more than one chipset.  In using Azure Dedicated Hosts, you might select specific models (Broadwell, Cascade Lake, or Skylake when selecting the E type for example). Otherwise, the chipset selection is non-deterministic.  If you are deploying an HPC cluster and a consistent experience across the inventory is important, then you can consider single Azure Dedicated Hosts or go with single chipset SKUs such as the E_v4 or D_v4.
* Performance variability with network-attached storage (NAS) has been observed in testing with both the Intel Broadwell based SKUs and the AMD EPYC™ 7551  based SKUs. Two issues have been observed:
    * When the accelerated network interface is inappropriately mapped to a sub optimal NUMA Node, read performance decreases significantly.   Although mapping the accelerated networking interface to a specific NUMA node is beneficial on newer SKUs, it must be considered a requirement on SKUs with these chipsets (Lv2|E_v3|D_v3).
    * Virtual machines running on the Lv2, or either E_v3  or D_v3 running on a Broadwell chipset are more susceptible to resource contention than when running on other SKUs.  When testing using multiple virtual machines running within a single Azure Dedicated Host, running network-based storage workload from one virtual machine has been seen to decrease the performance of network-based storage workloads running from a second virtual machine. The decrease is more pronounced when any of the virtual machines on the node have not had their accelerated network interface/NUMA node optimally mapped.  Keep in mind that the E_v3 and D_V3 may between them land on Haswell, Broadwell, Cascade Lake, or Skylake. 

For the most consistent performance when selecting virtual machines, select from SKUs with a single type of chipset – newer SKUs are preferred over the older models where available.  Keep in mind that, aside from using a dedicated host, predicting correctly which type of hardware the E_v3 or D_v3 virtual machines land on is unlikely.  When using the E_v3 or D_v3 SKU:

* When a virtual machine is turned off, de-allocated, and then turned on again, the virtual machine is likely to change hosts and as such hardware models.
* When applications are deployed across multiple virtual machines, expect the virtual machines to run on heterogenous hardware.

## Differences within and between SKUs
 
The following table highlights  the differences within and between SKUs.  Note, for example, that the chipset of the underlying E_v3 and D_v3 vary between the Broadwell, Cascade Lake, Skylake, and also in the case of the D_v3.  

|     Family    |     Version    |   Description     |     Frequency (GHz)    |
|-|-|-|-|
|     E    |     V3    |     Intel® Xeon® E5-2673   v4 (Broadwell)    |     2.3 (3.6)    |
|     E    |     V3    |     Intel® Xeon®   Platinum 8272CL (Cascade Lake)    |     2.6 (3.7)    |
|     E    |     V3    |     Intel® Xeon® Platinum   8171M (Skylake)    |     2.1 (3.8)    |
|     E    |     V4    |     Intel® Xeon®   Platinum 8272CL (Cascade Lake)    |     2.6 (3.7)    |
|     Ea    |     V4    |     AMD EPYC™ 7452    |     2.35 (3.35)    |
|     D    |     V3    |     Intel® Xeon®   E5-2673 v4 (Broadwell)    |     2.3 (3.6)    |
|     D    |     V3    |     Intel® Xeon® E5-2673   v3 (Haswell)    |     2.3 (2.3)    |
|     D    |     V3    |     Intel® Xeon®   Platinum 8272CL (Cascade Lake)    |     2.6 (3.7)    |
|     D    |     V3    |     Intel® Xeon® Platinum   8171M (Skylake)    |     2.1 (3.8)    |
|     D    |     V4    |     Intel® Xeon® Platinum   8272CL (Cascade Lake)    |     2.6 (3.7)    |
|     Da    |     V4    |     AMD EPYC™ 7452    |     2.35 (3.35)    |
|     L    |     V2    |     AMD EPYC™   7551    |     2.0 (3.2)    |
|     F    |     1    |     Intel Xeon® E5-2673 v3 (Haswell)     |     2.3 (2.3)    |
|     F    |     2    |     Intel® Xeon®   Platinum 8168M (Cascade Lake)    |     2.7 (3.7)    |
|     F    |     2    |     Gen 2 Intel® Xeon® Platinum 8272CL (Skylake)    |     2.1 (3.8)   |

When preparing a multi-node SAS GRID environment for production, you might notice a repeatable one-hour-and-fifteen-minute variance between analytics runs with no other difference than underlying hardware.  

|     SKU and hardware   platform    |     Job run times    |
|-|-|
|     E32-8_v3 (Broadwell)    |     5.5 hours    |
|     E32-8_v3 (Cascade   Lake)    |     4.25 hours    |

In both sets of tests, an E32-8_v3 SKU was selected, and RHEL 8.3 was used along with the `nconnect=8` mount option.

## Best practices 

* Whenever possible, select the E_v4, D_v4, or newer rather than the E_v3 or D_v3 SKUs.  
* Whenever possible, select the Ed_v4, Dd_v4, or newer rather than the L2 SKU.

## Next steps  

* [Linux direct I/O best practices for Azure NetApp Files](performance-linux-direct-io.md)
* [Linux filesystem cache best practices for Azure NetApp Files](performance-linux-filesystem-cache.md)
* [Linux NFS mount options best practices for Azure NetApp Files](performance-linux-mount-options.md)
* [Linux concurrency best practices](performance-linux-concurrency-session-slots.md)
* [Linux NFS read-ahead best practices](performance-linux-nfs-read-ahead.md)
* [Performance benchmarks for Linux](performance-benchmarks-linux.md) 
