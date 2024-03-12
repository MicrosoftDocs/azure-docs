---
title: Hardware specifications of the hosts
description: Hosts used to build or scale clusters come from an isolated pool of hosts.
ms.topic: include
ms.service: azure-vmware
ms.date: 3/6/2024
author: suzizuber
ms.author: v-szuber
ms.custom: engagement-fy23
---

<!-- Used in plan-private-cloud-deployment.md and concepts-private-cloud-clusters.md -->

Azure VMware Solution clusters are based upon hyper-converged infrastructure. The following table shows the CPU, memory, disk and network specifications of the host.

| Host Type | CPU (Cores/GHz)   | RAM (GB)  | vSAN Cache Tier (TB, raw)  | vSAN Capacity Tier (TB, raw)  | Regional availability |
| :---      | :---: | :---:     | :---:                      | :---:                                        | :---:                 |
| AV36      | Dual Intel Xeon Gold 6140 CPUs (Skylake microarchitecture) with 18 cores/CPU @ 2.3 GHz, Total 36 physical cores (72 logical cores with hyperthreading) |  576  | 3.2 (NVMe)               | 15.20 (SSD)  | Selected regions (*) |
| AV36P     |  Dual Intel Xeon Gold 6240 CPUs (Cascade Lake microarchitecture) with 18 cores/CPU @ 2.6 GHz / 3.9 GHz Turbo, Total 36 physical cores (72 logical cores with hyperthreading) |  768  | 1.5 (Intel Cache) | 19.20 (NVMe) | Selected regions (*) |
| AV52      | Dual Intel Xeon Platinum 8270 CPUs (Cascade Lake microarchitecture) with 26 cores/CPU @ 2.7 GHz / 4.0 GHz Turbo, Total 52 physical cores (104 logical cores with hyperthreading) | 1,536  | 1.5 (Intel Cache) | 38.40 (NVMe) | Selected regions (*) |
| AV64      | Dual Intel Xeon Platinum 8370C CPUs (Ice Lake microarchitecture) with 32 cores/CPU @ 2.8 GHz / 3.5 GHz Turbo, Total 64 physical cores (128 logical cores with hyperthreading) |  1,024  | 3.84 (NVMe) | 15.36 (NVMe) | Selected regions (**) |

An Azure VMware Solution cluster requires a minimum number of three hosts. You can only use hosts of the same type in a single Azure VMware Solution private cloud. Hosts used to build or scale clusters come from an isolated pool of hosts. Those hosts passed hardware tests and had all data securely deleted before being added to a cluster.

All the above Host Types have 100 Gbps network interface throughput.

(*) details available via the Azure pricing calculator.

(**) AV64 Prerequisite: An Azure VMware Solution private cloud deployed with AV36, AV36P, or AV52 is required prior to adding AV64.
