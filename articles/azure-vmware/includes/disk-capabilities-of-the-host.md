---
title: Disk capabilities of the hosts
description: Hosts used to build or scale clusters come from an isolated pool of hosts.
ms.topic: include
ms.service: azure-vmware
ms.date: 06/15/2022
author: suzizuber
ms.author: v-szuber
---

<!-- Used in plan-private-cloud-deployment.md and concepts-private-cloud-clusters.md -->


Azure VMware Solution clusters are based on hyper-converged, bare-metal infrastructure. The following table shows the RAM, CPU, and disk capacities of the host.

| Host Type | CPU (GHz)   | RAM (GB)  | vSAN Cache Tier (TB, raw)  | vSAN Capacity Tier (TB, raw)  | Regional availability |
| :---      | :---: | :---:     | :---:                      | :---:                         | :---:                 |
| AV36      |  dual Intel 18 core 2.3 GHz (SkyLake)      |  576  | 3.2 (NVMe)               | 15.20 (SSD)  | All product regions |
| AV36P     |  dual Intel 18 core 2.6 GHz / 3.9 GHz turbo (Cascade Lake) |  768  | 1.5 (Intel Optane Cache) | 19.20 (NVMe) | Selected regions (*) |
| AV52      |  dual Intel 26 core 2.7 GHz / 4.0 GHz turbo (Cascade Lake) | 1536  | 1.5 (Intel Optane Cache) | 38.40 (NVMe) | Selected regions (*) |

An Azure VMware cluster requires a minimum number of three hosts. You can only use host of the same type in a single cluster. You can use multiple clusters with different host types in a single Azure VMware Private Cloud.
Hosts used to build or scale clusters come from an isolated pool of hosts. Those hosts have passed hardware tests and have had all data securely deleted before being added to a cluster. 

(*) details available via the Azure pricing calculator.
