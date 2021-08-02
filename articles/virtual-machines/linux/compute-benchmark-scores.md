---
title: Compute benchmark scores for Azure Linux VMs 
description: Compare CoreMark compute benchmark scores for Azure VMs running Linux.
ms.service: virtual-machines
ms.subservice: benchmark
ms.collection: linux
ms.topic: conceptual
ms.date: 04/08/2021
ms.reviewer: davberg

---

# Compute benchmark scores for Linux VMs
The following CoreMark benchmark scores show compute performance for Azure's high-performance VM lineup running Ubuntu 18.04. Compute benchmark scores are also available for [Windows VMs](../windows/compute-benchmark-scores.md).

## Azure (Coremark) TOC
| Type | Families |
| ---- | -------- |
| [Compute optimized](#compute-optimized) | [Fsv2](#fsv2---compute--premium-storage)  |
| [General purpose](#general-purpose) | [B](#b---burstable) [Dsv3](#dsv3---general-compute--premium-storage) [Dv3](#dv3---general-compute) [DSv2](#dsv2---general-purpose--premium-storage) [Dv2](#dv2---general-compute) [Dasv4](#dasv4) [Dav4](#dav4) [DC](#dcs---confidential-compute-series) [DCv2](#dcsv2) [Ddsv4](#ddsv4) [Ddv4](#ddv4) [Dsv4](#dsv4) [Dv4](#dv4)  |
| [High performance compute](#high-performance-compute) | [HBv2](#hbrsv2) [HB](#hbs---memory-bandwidth-amd-epyc) [HC](#hcs---dense-computation-intel-xeon-platinum-8168)  |
| [Memory optimized](#memory-optimized) | [DSv2](#dsv2---general-purpose--premium-storage) [Dv2](#dv2---general-compute) [Esv3](#esv3---memory-optimized--premium-storage) [Ev3](#ev3---memory-optimized) [Easv4](#easv4) [Eav4](#eav4) [Edsv4](#edsv4) [Edv4](#edv4) [Esv4](#esv4) [Ev4](#ev4) [Msv2](#msv2-high-memory) [Ms](#m-series-medium-memory)  |
| [Storage optimized](#storage-optimized) | [Lsv2](#lsv2---storage-optimized)  |


## Compute optimized
### Fsv2 - Compute + Premium Storage
(10/10/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_F2s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 2 | 1 | 4.0 | 35,925 | 603 | 1.68% | 308 |
| Standard_F2s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 4.0 | 35,659 | 344 | 0.96% | 112 |
| Standard_F4s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 4 | 1 | 8.0 | 65,819 | 851 | 1.29% | 245 |
| Standard_F4s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 8.0 | 65,683 | 459 | 0.70% | 98 |
| Standard_F8s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 8 | 1 | 16.0 | 136,027 | 1,272 | 0.94% | 238 |
| Standard_F8s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 16.0 | 135,829 | 912 | 0.67% | 91 |
| Standard_F16s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 16 | 1 | 32.0 | 271,369 | 1,955 | 0.72% | 280 |
| Standard_F16s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 32.0 | 271,236 | 1,325 | 0.49% | 105 |
| Standard_F32s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 32 | 1 | 64.0 | 538,734 | 3,795 | 0.70% | 245 |
| Standard_F32s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 64.0 | 537,915 | 7,646 | 1.42% | 91 |
| Standard_F48s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 48 | 2 | 96.0 | 780,596 | 8,712 | 1.12% | 182 |
| Standard_F48s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 96.0 | 749,662 | 21,751 | 2.90% | 56 |
| Standard_F64s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 64 | 2 | 128.0 | 1,035,424 | 11,557 | 1.12% | 175 |
| Standard_F64s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 128.0 | 1,023,867 | 17,292 | 1.69% | 63 |
| Standard_F72s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 72 | 2 | 144.0 | 1,126,078 | 12,094 | 1.07% | 182 |
| Standard_F72s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 72 | 2 | 144.0 | 1,120,116 | 15,662 | 1.40% | 42 |

## General purpose
### B - Burstable
(09/24/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_B1s | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 1.0 | 18,768 | 429 | 2.29% | 35 |
| Standard_B1s | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 1.0 | 19,725 | 1,258 | 6.38% | 112 |
| Standard_B1s | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 1.0 | 18,287 | 2,316 | 12.66% | 70 |
| Standard_B1s | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 1.0 | 21,992 | 371 | 1.69% | 21 |
| Standard_B1ls | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 0.5 | 19,162 | 605 | 3.16% | 28 |
| Standard_B1ls | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 0.5 | 19,365 | 810 | 4.18% | 126 |
| Standard_B1ls | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 0.5 | 18,780 | 2,840 | 15.12% | 63 |
| Standard_B1ls | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 0.5 | 21,954 | 461 | 2.10% | 21 |
| Standard_B1ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 2.0 | 18,167 | 82 | 0.45% | 14 |
| Standard_B1ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 2.0 | 20,113 | 1,188 | 5.90% | 126 |
| Standard_B1ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 2.0 | 18,882 | 2,434 | 12.89% | 77 |
| Standard_B1ms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 2.0 | 22,182 | 57 | 0.26% | 21 |
| Standard_B2s | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 4.0 | 36,074 | 431 | 1.20% | 21 |
| Standard_B2s | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 4.0 | 37,634 | 1,445 | 3.84% | 119 |
| Standard_B2s | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 4.0 | 37,824 | 5,913 | 15.63% | 70 |
| Standard_B2s | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 4.0 | 44,147 | 397 | 0.90% | 28 |
| Standard_B2ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 8.0 | 36,338 | 333 | 0.92% | 28 |
| Standard_B2ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 8.0 | 38,026 | 1,749 | 4.60% | 119 |
| Standard_B2ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 8.0 | 38,060 | 5,978 | 15.71% | 70 |
| Standard_B2ms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 8.0 | 44,227 | 349 | 0.79% | 21 |
| Standard_B4ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 16.0 | 70,362 | 3,310 | 4.70% | 28 |
| Standard_B4ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 16.0 | 74,405 | 2,647 | 3.56% | 112 |
| Standard_B4ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 16.0 | 71,174 | 8,008 | 11.25% | 77 |
| Standard_B4ms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 16.0 | 85,894 | 1,445 | 1.68% | 21 |
| Standard_B8ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 32.0 | 144,753 | 3,091 | 2.14% | 35 |
| Standard_B8ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 32.0 | 145,027 | 1,460 | 1.01% | 98 |
| Standard_B8ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 32.0 | 138,848 | 11,991 | 8.64% | 84 |
| Standard_B8ms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 32.0 | 170,427 | 2,402 | 1.41% | 14 |
| Standard_B12ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 12 | 1 | 48.0 | 214,731 | 4,672 | 2.18% | 28 |
| Standard_B12ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 12 | 1 | 48.0 | 219,383 | 2,213 | 1.01% | 112 |
| Standard_B12ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 12 | 1 | 48.0 | 202,912 | 17,172 | 8.46% | 77 |
| Standard_B12ms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 12 | 1 | 48.0 | 256,373 | 1,768 | 0.69% | 21 |
| Standard_B16ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 64.0 | 276,669 | 8,921 | 3.22% | 35 |
| Standard_B16ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 64.0 | 294,079 | 3,437 | 1.17% | 112 |
| Standard_B16ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 64.0 | 270,563 | 27,650 | 10.22% | 70 |
| Standard_B16ms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 64.0 | 340,582 | 6,378 | 1.87% | 21 |
| Standard_B20ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 20 | 2 | 80.0 | 347,156 | 5,967 | 1.72% | 14 |
| Standard_B20ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 20 | 1 | 80.0 | 363,209 | 3,837 | 1.06% | 112 |
| Standard_B20ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 20 | 1 | 80.0 | 342,212 | 21,775 | 6.36% | 91 |
| Standard_B20ms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 80.0 | 416,103 | 3,337 | 0.80% | 21 |

### DSv3 - General Compute + Premium Storage
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 8.0 | 26,323 | 1,194 | 4.54% | 35 |
| Standard_D2s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 8.0 | 27,724 | 2,091 | 7.54% | 84 |
| Standard_D2s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 8.0 | 26,916 | 1,424 | 5.29% | 91 |
| Standard_D2s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 8.0 | 31,342 | 18 | 0.06% | 21 |
| Standard_D4s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 16.0 | 50,716 | 1,058 | 2.09% | 35 |
| Standard_D4s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 16.0 | 52,445 | 3,515 | 6.70% | 77 |
| Standard_D4s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 16.0 | 50,029 | 3,332 | 6.66% | 91 |
| Standard_D4s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 16.0 | 57,991 | 277 | 0.48% | 35 |
| Standard_D8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 32.0 | 99,350 | 179 | 0.18% | 7 |
| Standard_D8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 32.0 | 101,053 | 7,572 | 7.49% | 126 |
| Standard_D8s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 32.0 | 102,485 | 3,143 | 3.07% | 56 |
| Standard_D8s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 32.0 | 120,003 | 546 | 0.46% | 35 |
| Standard_D16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 1 | 64.0 | 199,434 | 1,886 | 0.95% | 35 |
| Standard_D16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 64.0 | 196,242 | 5,336 | 2.72% | 77 |
| Standard_D16s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 64.0 | 200,086 | 3,164 | 1.58% | 98 |
| Standard_D16s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 64.0 | 239,837 | 1,457 | 0.61% | 28 |
| Standard_D32s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 32 | 2 | 128.0 | 389,200 | 3,438 | 0.88% | 35 |
| Standard_D32s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 1 | 128.0 | 390,983 | 1,845 | 0.47% | 91 |
| Standard_D32s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 1 | 128.0 | 397,239 | 2,996 | 0.75% | 77 |
| Standard_D32s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 128.0 | 478,885 | 1,968 | 0.41% | 35 |
| Standard_D48s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 48 | 2 | 192.0 | 571,460 | 4,725 | 0.83% | 112 |
| Standard_D48s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 48 | 1 | 192.0 | 581,930 | 3,357 | 0.58% | 63 |
| Standard_D48s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 48 | 2 | 192.0 | 578,181 | 5,736 | 0.99% | 35 |
| Standard_D48s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 192.0 | 698,208 | 8,889 | 1.27% | 28 |
| Standard_D64s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 64 | 2 | 256.0 | 761,965 | 4,971 | 0.65% | 49 |
| Standard_D64s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 64 | 2 | 256.0 | 767,645 | 10,497 | 1.37% | 154 |
| Standard_D64s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 256.0 | 909,271 | 7,791 | 0.86% | 28 |

### Dv3 - General Compute
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 8.0 | 25,478 | 977 | 3.84% | 91 |
| Standard_D2_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 8.0 | 26,601 | 1,381 | 5.19% | 70 |
| Standard_D2_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 8.0 | 27,116 | 1,688 | 6.23% | 70 |
| Standard_D2_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 8.0 | 31,352 | 22 | 0.07% | 7 |
| Standard_D4_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 16.0 | 49,708 | 2,668 | 5.37% | 77 |
| Standard_D4_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 16.0 | 51,650 | 3,799 | 7.35% | 91 |
| Standard_D4_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 16.0 | 50,025 | 2,210 | 4.42% | 70 |
| Standard_D8_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 32.0 | 100,422 | 1,323 | 1.32% | 98 |
| Standard_D8_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 32.0 | 97,861 | 5,903 | 6.03% | 91 |
| Standard_D8_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 32.0 | 100,826 | 1,597 | 1.58% | 42 |
| Standard_D8_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 32.0 | 120,063 | 559 | 0.47% | 7 |
| Standard_D16_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 1 | 64.0 | 198,362 | 2,228 | 1.12% | 84 |
| Standard_D16_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 64.0 | 193,498 | 2,080 | 1.07% | 77 |
| Standard_D16_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 64.0 | 199,683 | 1,862 | 0.93% | 63 |
| Standard_D16_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 64.0 | 239,145 | 1,767 | 0.74% | 7 |
| Standard_D32_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 32 | 2 | 128.0 | 387,724 | 3,770 | 0.97% | 63 |
| Standard_D32_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 1 | 128.0 | 388,466 | 9,936 | 2.56% | 112 |
| Standard_D32_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 1 | 128.0 | 397,605 | 2,423 | 0.61% | 49 |
| Standard_D32_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 128.0 | 479,158 | 1,356 | 0.28% | 14 |
| Standard_D48_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 48 | 2 | 192.0 | 569,331 | 6,445 | 1.13% | 140 |
| Standard_D48_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 48 | 1 | 192.0 | 578,441 | 6,615 | 1.14% | 70 |
| Standard_D48_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 48 | 2 | 192.0 | 576,459 | 7,500 | 1.30% | 21 |
| Standard_D48_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 192.0 | 693,147 | 8,980 | 1.30% | 7 |
| Standard_D64_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 64 | 2 | 256.0 | 762,667 | 5,489 | 0.72% | 42 |
| Standard_D64_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 64 | 2 | 256.0 | 766,739 | 7,516 | 0.98% | 189 |
| Standard_D64_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 256.0 | 916,549 | 8,944 | 0.98% | 7 |

### DSv2 - General Purpose + Premium Storage
(09/30/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_DS1_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 3.5 | 18,952 | 876 | 4.62% | 49 |
| Standard_DS1_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 3.5 | 20,066 | 937 | 4.67% | 70 |
| Standard_DS1_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 3.5 | 19,721 | 1,686 | 8.55% | 98 |
| Standard_DS1_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 3.5 | 22,210 | 25 | 0.11% | 14 |
| Standard_DS2_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 7.0 | 37,635 | 977 | 2.60% | 70 |
| Standard_DS2_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 7.0 | 39,784 | 2,446 | 6.15% | 84 |
| Standard_DS2_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 7.0 | 37,761 | 1,322 | 3.50% | 70 |
| Standard_DS2_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 7.0 | 44,728 | 39 | 0.09% | 7 |
| Standard_DS3_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 14.0 | 73,128 | 1,720 | 2.35% | 70 |
| Standard_DS3_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 14.0 | 75,583 | 4,279 | 5.66% | 70 |
| Standard_DS3_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 14.0 | 72,459 | 1,230 | 1.70% | 91 |
| Standard_DS4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 28.0 | 146,804 | 1,270 | 0.86% | 49 |
| Standard_DS4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 28.0 | 147,510 | 3,214 | 2.18% | 98 |
| Standard_DS4_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 28.0 | 144,002 | 1,731 | 1.20% | 70 |
| Standard_DS4_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 28.0 | 116,687 | 59,050 | 50.61% | 14 |
| Standard_DS5_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 56.0 | 284,713 | 4,702 | 1.65% | 63 |
| Standard_DS5_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 56.0 | 297,550 | 1,502 | 0.50% | 70 |
| Standard_DS5_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 56.0 | 287,238 | 4,723 | 1.64% | 84 |
| Standard_DS5_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 56.0 | 345,144 | 2,027 | 0.59% | 14 |

### Dv2 - General Compute
(09/30/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D1_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 3.5 | 19,112 | 851 | 4.45% | 105 |
| Standard_D1_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 3.5 | 21,866 | 1,802 | 8.24% | 49 |
| Standard_D1_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 3.5 | 19,641 | 808 | 4.11% | 63 |
| Standard_D2_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 7.0 | 36,684 | 1,542 | 4.20% | 112 |
| Standard_D2_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 7.0 | 40,452 | 2,922 | 7.22% | 42 |
| Standard_D2_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 7.0 | 37,109 | 1,525 | 4.11% | 63 |
| Standard_D3_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 14.0 | 72,681 | 1,424 | 1.96% | 84 |
| Standard_D3_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 14.0 | 76,631 | 4,948 | 6.46% | 70 |
| Standard_D3_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 14.0 | 73,768 | 2,279 | 3.09% | 56 |
| Standard_D4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 28.0 | 141,204 | 19,309 | 13.67% | 70 |
| Standard_D4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 28.0 | 149,027 | 1,783 | 1.20% | 98 |
| Standard_D4_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 28.0 | 143,576 | 1,305 | 0.91% | 49 |
| Standard_D5_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 56.0 | 281,644 | 9,594 | 3.41% | 105 |
| Standard_D5_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 56.0 | 296,879 | 2,069 | 0.70% | 28 |
| Standard_D5_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 56.0 | 284,996 | 5,417 | 1.90% | 77 |

### Dasv4
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2as_v4 | AMD EPYC 7452 32-Core Processor | 2 | 1 | 8.0 | 38,230 | 313 | 0.82% | 77 |
| Standard_D4as_v4 | AMD EPYC 7452 32-Core Processor | 4 | 1 | 16.0 | 71,707 | 790 | 1.10% | 98 |
| Standard_D8as_v4 | AMD EPYC 7452 32-Core Processor | 8 | 1 | 32.0 | 151,474 | 1,599 | 1.06% | 56 |
| Standard_D16as_v4 | AMD EPYC 7452 32-Core Processor | 16 | 2 | 64.0 | 292,074 | 9,782 | 3.35% | 91 |
| Standard_D32as_v4 | AMD EPYC 7452 32-Core Processor | 32 | 4 | 128.0 | 575,465 | 14,574 | 2.53% | 98 |
| Standard_D48as_v4 | AMD EPYC 7452 32-Core Processor | 48 | 6 | 192.0 | 843,316 | 21,739 | 2.58% | 105 |
| Standard_D64as_v4 | AMD EPYC 7452 32-Core Processor | 64 | 8 | 256.0 | 1,120,467 | 30,714 | 2.74% | 7 |

### Dav4
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2a_v4 | AMD EPYC 7452 32-Core Processor | 2 | 1 | 8.0 | 38,061 | 1,219 | 3.20% | 119 |
| Standard_D4a_v4 | AMD EPYC 7452 32-Core Processor | 4 | 1 | 16.0 | 70,996 | 2,280 | 3.21% | 140 |
| Standard_D8a_v4 | AMD EPYC 7452 32-Core Processor | 8 | 1 | 32.0 | 151,379 | 1,946 | 1.29% | 147 |
| Standard_D16a_v4 | AMD EPYC 7452 32-Core Processor | 16 | 2 | 64.0 | 293,654 | 6,263 | 2.13% | 161 |
| Standard_D32a_v4 | AMD EPYC 7452 32-Core Processor | 32 | 4 | 128.0 | 571,897 | 16,009 | 2.80% | 147 |
| Standard_D48a_v4 | AMD EPYC 7452 32-Core Processor | 48 | 6 | 192.0 | 837,332 | 22,923 | 2.74% | 161 |
| Standard_D64a_v4 | AMD EPYC 7452 32-Core Processor | 64 | 8 | 256.0 | 1,126,793 | 29,148 | 2.59% | 21 |
| Standard_D96a_v4 | AMD EPYC 7452 32-Core Processor | 96 | 12 | 384.0 | 1,590,434 | 31,887 | 2.00% | 14 |

### DCS - Confidential Compute Series
(10/01/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_DC2s | Intel(R) Xeon(R) E-2176G CPU @ 3.70GHz | 2 | 1 | 8.0 | 63,426 | 391 | 0.62% | 28 |
| Standard_DC4s | Intel(R) Xeon(R) E-2176G CPU @ 3.70GHz | 4 | 1 | 16.0 | 124,015 | 410 | 0.33% | 21 |

### DCsv2
(10/08/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_DC1s_v2 | Intel(R) Xeon(R) E-2288G CPU @ 3.70GHz | 1 | 1 | 4.0 | 34,418 | 162 | 0.47% | 77 |
| Standard_DC2s_v2 | Intel(R) Xeon(R) E-2288G CPU @ 3.70GHz | 2 | 1 | 8.0 | 68,562 | 758 | 1.11% | 77 |
| Standard_DC4s_v2 | Intel(R) Xeon(R) E-2288G CPU @ 3.70GHz | 4 | 1 | 16.0 | 133,836 | 1,964 | 1.47% | 77 |

### DCv2
(10/13/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_DC8_v2 | Intel(R) Xeon(R) E-2288G CPU @ 3.70GHz | 8 | 1 | 32.0 | 252,047 | 3,051 | 1.21% | 77 |

### DDSv4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 8.0 | 35,557 | 740 | 2.08% | 189 |
| Standard_D4ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 16.0 | 65,958 | 788 | 1.19% | 189 |
| Standard_D8ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 32.0 | 135,907 | 1,108 | 0.81% | 189 |
| Standard_D16ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 64.0 | 271,137 | 1,374 | 0.51% | 189 |
| Standard_D32ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 128.0 | 540,212 | 4,954 | 0.92% | 189 |
| Standard_D48ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 192.0 | 756,538 | 15,048 | 1.99% | 154 |
| Standard_D48ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 192.0 | 775,291 | 11,776 | 1.52% | 35 |
| Standard_D64ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 256.0 | 1,025,017 | 14,482 | 1.41% | 182 |

### DDv4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 8.0 | 35,640 | 371 | 1.04% | 189 |
| Standard_D4d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 16.0 | 65,767 | 590 | 0.90% | 189 |
| Standard_D8d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 32.0 | 135,756 | 901 | 0.66% | 189 |
| Standard_D16d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 64.0 | 271,216 | 1,630 | 0.60% | 189 |
| Standard_D32d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 128.0 | 540,052 | 4,426 | 0.82% | 189 |
| Standard_D48d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 192.0 | 744,246 | 20,864 | 2.80% | 147 |
| Standard_D48d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 192.0 | 769,702 | 10,800 | 1.40% | 42 |
| Standard_D64d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 256.0 | 1,021,118 | 15,896 | 1.56% | 189 |

### Dsv4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 8.0 | 35,794 | 578 | 1.61% | 175 |
| Standard_D4s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 16.0 | 65,910 | 668 | 1.01% | 182 |
| Standard_D8s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 32.0 | 135,542 | 835 | 0.62% | 182 |
| Standard_D16s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 64.0 | 271,053 | 1,429 | 0.53% | 182 |
| Standard_D32s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 128.0 | 539,271 | 8,236 | 1.53% | 182 |
| Standard_D48s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 192.0 | 743,539 | 18,204 | 2.45% | 140 |
| Standard_D48s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 192.0 | 772,877 | 9,466 | 1.22% | 35 |
| Standard_D64s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 256.0 | 1,024,799 | 15,499 | 1.51% | 182 |

### Dv4
(09/21/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 8.0 | 35,651 | 228 | 0.64% | 182 |
| Standard_D4_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 16.0 | 65,896 | 647 | 0.98% | 175 |
| Standard_D8_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 32.0 | 135,803 | 963 | 0.71% | 182 |
| Standard_D16_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 64.0 | 271,203 | 1,345 | 0.50% | 182 |
| Standard_D32_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 128.0 | 539,406 | 5,745 | 1.07% | 182 |
| Standard_D48_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 192.0 | 745,137 | 17,607 | 2.36% | 154 |
| Standard_D48_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 192.0 | 771,269 | 7,936 | 1.03% | 28 |
| Standard_D64_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 256.0 | 1,020,266 | 19,814 | 1.94% | 182 |

## High performance compute
### HBrsv2
(10/16/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_HB120rs_v2 | AMD EPYC 7V12 64-Core Processor | 120 | 30 | 456.0 | 2,631,430 | 81,949 | 3.11% | 21 |

### HBS - memory bandwidth (AMD EPYC)
(10/14/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_HB60rs | AMD EPYC 7551 32-Core Processor | 60 | 15 | 228.0 | 986,593 | 28,102 | 2.85% | 21 |

### HCS - dense computation (Intel Xeon Platinum 8168)
(10/14/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_HC44rs | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 44 | 2 | 352.0 | 995,006 | 25,995 | 2.61% | 21 |

## Memory optimized
### DSv2 - General Purpose + Premium Storage
(09/30/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_DS11_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 14.0 | 37,489 | 1,314 | 3.50% | 49 |
| Standard_DS11_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 14.0 | 40,138 | 3,286 | 8.19% | 70 |
| Standard_DS11_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 14.0 | 37,889 | 1,096 | 2.89% | 84 |
| Standard_DS11_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 14.0 | 44,107 | 406 | 0.92% | 28 |
| Standard_DS11-1_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 14.0 | 19,615 | 846 | 4.31% | 42 |
| Standard_DS11-1_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 14.0 | 20,835 | 1,937 | 9.30% | 42 |
| Standard_DS11-1_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 14.0 | 18,765 | 767 | 4.09% | 126 |
| Standard_DS11-1_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 14.0 | 23,145 | 1,425 | 6.16% | 21 |
| Standard_DS12_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 28.0 | 73,222 | 1,506 | 2.06% | 42 |
| Standard_DS12_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 28.0 | 76,452 | 5,858 | 7.66% | 77 |
| Standard_DS12_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 28.0 | 73,140 | 3,323 | 4.54% | 84 |
| Standard_DS12_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 28.0 | 86,916 | 1,044 | 1.20% | 28 |
| Standard_DS12-1_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 28.0 | 19,387 | 899 | 4.64% | 56 |
| Standard_DS12-1_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 28.0 | 22,048 | 1,729 | 7.84% | 77 |
| Standard_DS12-1_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 28.0 | 19,102 | 943 | 4.94% | 70 |
| Standard_DS12-1_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 28.0 | 22,205 | 32 | 0.14% | 28 |
| Standard_DS12-2_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 28.0 | 38,766 | 1,060 | 2.74% | 56 |
| Standard_DS12-2_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 28.0 | 41,447 | 3,954 | 9.54% | 91 |
| Standard_DS12-2_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 28.0 | 37,639 | 1,579 | 4.19% | 70 |
| Standard_DS12-2_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 28.0 | 44,226 | 810 | 1.83% | 14 |
| Standard_DS13_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 56.0 | 147,234 | 1,202 | 0.82% | 56 |
| Standard_DS13_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 56.0 | 147,218 | 1,636 | 1.11% | 70 |
| Standard_DS13_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 56.0 | 144,612 | 1,582 | 1.09% | 84 |
| Standard_DS13_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 56.0 | 172,617 | 755 | 0.44% | 21 |
| Standard_DS13-2_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 56.0 | 38,688 | 816 | 2.11% | 56 |
| Standard_DS13-2_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 56.0 | 39,898 | 2,493 | 6.25% | 84 |
| Standard_DS13-2_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 56.0 | 38,861 | 2,788 | 7.17% | 91 |
| Standard_DS13-4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 56.0 | 73,105 | 1,727 | 2.36% | 70 |
| Standard_DS13-4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 56.0 | 77,848 | 4,307 | 5.53% | 84 |
| Standard_DS13-4_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 56.0 | 74,935 | 4,384 | 5.85% | 63 |
| Standard_DS13-4_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 56.0 | 86,402 | 529 | 0.61% | 14 |
| Standard_DS14_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 112.0 | 284,796 | 4,889 | 1.72% | 49 |
| Standard_DS14_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 112.0 | 298,261 | 1,351 | 0.45% | 63 |
| Standard_DS14_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 112.0 | 286,993 | 3,418 | 1.19% | 98 |
| Standard_DS14_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 112.0 | 345,521 | 1,549 | 0.45% | 21 |
| Standard_DS14-4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 2 | 112.0 | 71,287 | 2,692 | 3.78% | 42 |
| Standard_DS14-4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 112.0 | 81,710 | 6,156 | 7.53% | 56 |
| Standard_DS14-4_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 112.0 | 75,101 | 2,765 | 3.68% | 112 |
| Standard_DS14-4_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 112.0 | 86,598 | 517 | 0.60% | 21 |
| Standard_DS14-8_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 2 | 112.0 | 143,882 | 4,104 | 2.85% | 49 |
| Standard_DS14-8_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 112.0 | 150,389 | 4,548 | 3.02% | 70 |
| Standard_DS14-8_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 112.0 | 145,955 | 2,224 | 1.52% | 105 |
| Standard_DS14-8_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 112.0 | 171,910 | 754 | 0.44% | 7 |
| Standard_DS15_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 20 | 2 | 140.0 | 355,354 | 6,693 | 1.88% | 49 |
| Standard_DS15_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 140.0 | 421,202 | 56,292 | 13.36% | 154 |

### Dv2 - General Compute
(09/30/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D11_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 14.0 | 37,655 | 1,925 | 5.11% | 70 |
| Standard_D11_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 14.0 | 39,953 | 3,019 | 7.56% | 70 |
| Standard_D11_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 14.0 | 37,979 | 1,830 | 4.82% | 56 |
| Standard_D12_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 28.0 | 71,521 | 4,218 | 5.90% | 77 |
| Standard_D12_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 28.0 | 77,439 | 5,095 | 6.58% | 70 |
| Standard_D12_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 28.0 | 73,464 | 1,263 | 1.72% | 56 |
| Standard_D12_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 28.0 | 87,100 | 434 | 0.50% | 7 |
| Standard_D13_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 56.0 | 141,552 | 16,057 | 11.34% | 70 |
| Standard_D13_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 56.0 | 148,352 | 2,754 | 1.86% | 70 |
| Standard_D13_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 56.0 | 141,946 | 3,604 | 2.54% | 42 |
| Standard_D13_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 56.0 | 167,641 | 1,680 | 1.00% | 7 |
| Standard_D14_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 112.0 | 283,793 | 5,207 | 1.83% | 77 |
| Standard_D14_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 112.0 | 297,163 | 1,817 | 0.61% | 63 |
| Standard_D14_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 112.0 | 286,817 | 4,109 | 1.43% | 49 |
| Standard_D15_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 20 | 2 | 140.0 | 354,279 | 6,021 | 1.70% | 35 |
| Standard_D15_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 140.0 | 418,475 | 58,044 | 13.87% | 154 |

### Esv3 - Memory Optimized + Premium Storage
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 16.0 | 27,008 | 2,136 | 7.91% | 105 |
| Standard_E2s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 16.0 | 26,729 | 987 | 3.69% | 98 |
| Standard_E2s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 16.0 | 31,341 | 14 | 0.04% | 21 |
| Standard_E4s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 32.0 | 51,647 | 3,354 | 6.49% | 105 |
| Standard_E4s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 32.0 | 49,459 | 2,426 | 4.91% | 98 |
| Standard_E4s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 32.0 | 57,986 | 283 | 0.49% | 35 |
| Standard_E4-2s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 32.0 | 26,468 | 1,997 | 7.54% | 105 |
| Standard_E4-2s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 32.0 | 26,457 | 817 | 3.09% | 84 |
| Standard_E4-2s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 32.0 | 31,350 | 15 | 0.05% | 42 |
| Standard_E8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 64.0 | 101,750 | 7,494 | 7.36% | 126 |
| Standard_E8s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 64.0 | 101,526 | 1,976 | 1.95% | 77 |
| Standard_E8s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 64.0 | 120,073 | 826 | 0.69% | 35 |
| Standard_E8-2s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 64.0 | 26,318 | 1,665 | 6.33% | 140 |
| Standard_E8-2s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 64.0 | 27,219 | 1,167 | 4.29% | 56 |
| Standard_E8-2s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 64.0 | 31,322 | 38 | 0.12% | 42 |
| Standard_E8-4s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 64.0 | 52,719 | 3,706 | 7.03% | 119 |
| Standard_E8-4s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 64.0 | 49,518 | 2,675 | 5.40% | 77 |
| Standard_E8-4s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 64.0 | 57,859 | 378 | 0.65% | 42 |
| Standard_E16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 128.0 | 195,755 | 5,337 | 2.73% | 126 |
| Standard_E16s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 128.0 | 199,681 | 2,067 | 1.04% | 77 |
| Standard_E16s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 128.0 | 240,250 | 984 | 0.41% | 28 |
| Standard_E16-4s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 128.0 | 54,920 | 3,833 | 6.98% | 140 |
| Standard_E16-4s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 128.0 | 50,869 | 3,400 | 6.68% | 77 |
| Standard_E16-4s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 128.0 | 58,019 | 307 | 0.53% | 21 |
| Standard_E16-8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 128.0 | 103,358 | 6,272 | 6.07% | 133 |
| Standard_E16-8s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 128.0 | 102,945 | 2,982 | 2.90% | 63 |
| Standard_E16-8s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 128.0 | 120,189 | 963 | 0.80% | 35 |
| Standard_E20s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 20 | 1 | 160.0 | 245,271 | 1,479 | 0.60% | 112 |
| Standard_E20s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 20 | 1 | 160.0 | 249,245 | 2,057 | 0.83% | 98 |
| Standard_E20s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 160.0 | 300,197 | 1,881 | 0.63% | 28 |
| Standard_E32s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 2 | 256.0 | 379,015 | 6,761 | 1.78% | 126 |
| Standard_E32s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 1 | 256.0 | 397,086 | 2,450 | 0.62% | 84 |
| Standard_E32s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 256.0 | 477,740 | 4,873 | 1.02% | 28 |
| Standard_E32-8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 2 | 256.0 | 105,799 | 5,853 | 5.53% | 98 |
| Standard_E32-8s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 256.0 | 103,535 | 2,602 | 2.51% | 105 |
| Standard_E32-8s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 256.0 | 120,109 | 593 | 0.49% | 28 |
| Standard_E32-16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 2 | 256.0 | 199,765 | 7,562 | 3.79% | 119 |
| Standard_E32-16s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 256.0 | 202,033 | 3,104 | 1.54% | 77 |
| Standard_E32-16s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 256.0 | 240,249 | 1,126 | 0.47% | 42 |
| Standard_E48s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 48 | 2 | 384.0 | 570,727 | 4,290 | 0.75% | 98 |
| Standard_E48s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 48 | 2 | 384.0 | 578,285 | 5,864 | 1.01% | 105 |
| Standard_E48s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 384.0 | 687,857 | 6,709 | 0.98% | 35 |
| Standard_E64s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 64 | 2 | 432.0 | 763,127 | 5,541 | 0.73% | 42 |
| Standard_E64s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 64 | 2 | 432.0 | 770,574 | 7,440 | 0.97% | 161 |
| Standard_E64s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 432.0 | 913,390 | 9,287 | 1.02% | 21 |
| Standard_E64-16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 2 | 432.0 | 234,395 | 2,364 | 1.01% | 42 |
| Standard_E64-16s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 2 | 432.0 | 211,781 | 7,841 | 3.70% | 161 |
| Standard_E64-16s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 2 | 432.0 | 232,571 | 3,046 | 1.31% | 28 |
| Standard_E64-32s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 2 | 432.0 | 411,194 | 4,489 | 1.09% | 56 |
| Standard_E64-32s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 2 | 432.0 | 395,227 | 5,245 | 1.33% | 161 |
| Standard_E64-32s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 432.0 | 464,744 | 6,855 | 1.48% | 21 |

### Ev3 - Memory Optimized
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 16.0 | 27,615 | 2,226 | 8.06% | 133 |
| Standard_E2_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 16.0 | 27,471 | 1,897 | 6.90% | 84 |
| Standard_E4_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 32.0 | 51,755 | 3,604 | 6.96% | 175 |
| Standard_E4_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 32.0 | 48,159 | 1,286 | 2.67% | 63 |
| Standard_E8_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 64.0 | 100,794 | 5,678 | 5.63% | 154 |
| Standard_E8_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 64.0 | 100,458 | 1,381 | 1.38% | 84 |
| Standard_E16_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 128.0 | 196,170 | 4,590 | 2.34% | 189 |
| Standard_E16_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 128.0 | 199,986 | 1,534 | 0.77% | 42 |
| Standard_E16_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 128.0 | 240,246 | 680 | 0.28% | 7 |
| Standard_E20_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 20 | 1 | 160.0 | 243,816 | 2,644 | 1.08% | 196 |
| Standard_E20_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 20 | 1 | 160.0 | 245,193 | 6,282 | 2.56% | 35 |
| Standard_E20_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 160.0 | 300,653 | 666 | 0.22% | 7 |
| Standard_E32_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 2 | 256.0 | 377,052 | 7,434 | 1.97% | 147 |
| Standard_E32_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 1 | 256.0 | 393,569 | 5,278 | 1.34% | 70 |
| Standard_E32_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 256.0 | 479,255 | 2,237 | 0.47% | 14 |
| Standard_E48_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 48 | 2 | 384.0 | 569,428 | 5,166 | 0.91% | 147 |
| Standard_E48_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 48 | 2 | 384.0 | 577,766 | 6,460 | 1.12% | 77 |
| Standard_E48_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 384.0 | 687,699 | 7,983 | 1.16% | 14 |
| Standard_E64_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 64 | 2 | 432.0 | 761,587 | 5,928 | 0.78% | 63 |
| Standard_E64_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 64 | 2 | 432.0 | 765,301 | 11,204 | 1.46% | 161 |
| Standard_E64_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 432.0 | 913,332 | 12,240 | 1.34% | 14 |

### Easv4
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2as_v4 | AMD EPYC 7452 32-Core Processor | 2 | 1 | 16.0 | 38,155 | 432 | 1.13% | 259 |
| Standard_E4as_v4 | AMD EPYC 7452 32-Core Processor | 4 | 1 | 32.0 | 71,500 | 1,260 | 1.76% | 259 |
| Standard_E8as_v4 | AMD EPYC 7452 32-Core Processor | 8 | 1 | 64.0 | 151,201 | 3,171 | 2.10% | 259 |
| Standard_E16as_v4 | AMD EPYC 7452 32-Core Processor | 16 | 2 | 128.0 | 293,186 | 6,371 | 2.17% | 280 |
| Standard_E20as_v4 | AMD EPYC 7452 32-Core Processor | 20 | 3 | 160.0 | 363,292 | 8,744 | 2.41% | 280 |
| Standard_E32as_v4 | AMD EPYC 7452 32-Core Processor | 32 | 4 | 256.0 | 570,199 | 14,140 | 2.48% | 294 |
| Standard_E48as_v4 | AMD EPYC 7452 32-Core Processor | 48 | 6 | 384.0 | 841,547 | 21,858 | 2.60% | 301 |
| Standard_E64as_v4 | AMD EPYC 7452 32-Core Processor | 64 | 8 | 512.0 | 1,108,151 | 28,783 | 2.60% | 28 |
| Standard_E96as_v4 | AMD EPYC 7452 32-Core Processor | 96 | 12 | 672.0 | 1,578,349 | 27,080 | 1.72% | 42 |

### Eav4
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2a_v4 | AMD EPYC 7452 32-Core Processor | 2 | 1 | 16.0 | 38,035 | 900 | 2.37% | 196 |
| Standard_E4a_v4 | AMD EPYC 7452 32-Core Processor | 4 | 1 | 32.0 | 71,345 | 949 | 1.33% | 196 |
| Standard_E8a_v4 | AMD EPYC 7452 32-Core Processor | 8 | 1 | 64.0 | 151,511 | 1,940 | 1.28% | 189 |
| Standard_E16a_v4 | AMD EPYC 7452 32-Core Processor | 16 | 2 | 128.0 | 292,668 | 7,220 | 2.47% | 196 |
| Standard_E20a_v4 | AMD EPYC 7452 32-Core Processor | 20 | 3 | 160.0 | 361,845 | 9,332 | 2.58% | 196 |
| Standard_E32a_v4 | AMD EPYC 7452 32-Core Processor | 32 | 4 | 256.0 | 570,615 | 14,419 | 2.53% | 196 |
| Standard_E48a_v4 | AMD EPYC 7452 32-Core Processor | 48 | 6 | 384.0 | 841,419 | 26,181 | 3.11% | 196 |
| Standard_E64a_v4 | AMD EPYC 7452 32-Core Processor | 64 | 8 | 512.0 | 1,116,891 | 28,545 | 2.56% | 14 |
| Standard_E96a_v4 | AMD EPYC 7452 32-Core Processor | 96 | 12 | 672.0 | 1,592,228 | 32,515 | 2.04% | 14 |

### EDSv4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 16.0 | 35,975 | 673 | 1.87% | 189 |
| Standard_E4ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 32.0 | 65,819 | 523 | 0.79% | 182 |
| Standard_E4-2ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 32.0 | 35,623 | 312 | 0.88% | 189 |
| Standard_E8ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 64.0 | 135,576 | 723 | 0.53% | 189 |
| Standard_E8-2ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 64.0 | 35,831 | 529 | 1.48% | 189 |
| Standard_E8-4ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 64.0 | 66,007 | 778 | 1.18% | 189 |
| Standard_E16ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 128.0 | 271,138 | 1,608 | 0.59% | 189 |
| Standard_E16-4ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 128.0 | 66,461 | 1,250 | 1.88% | 189 |
| Standard_E16-8ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 128.0 | 135,960 | 1,073 | 0.79% | 189 |
| Standard_E20ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 160.0 | 339,000 | 1,496 | 0.44% | 189 |
| Standard_E32ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 256.0 | 538,949 | 6,669 | 1.24% | 168 |
| Standard_E32ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 256.0 | 527,258 | 11,587 | 2.20% | 21 |
| Standard_E32-8ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 256.0 | 136,425 | 1,166 | 0.85% | 147 |
| Standard_E32-8ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 2 | 256.0 | 136,743 | 2,124 | 1.55% | 42 |
| Standard_E32-16ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 256.0 | 271,264 | 1,345 | 0.50% | 154 |
| Standard_E32-16ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 2 | 256.0 | 269,101 | 4,332 | 1.61% | 28 |
| Standard_E48ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 384.0 | 775,434 | 10,356 | 1.34% | 189 |
| Standard_E64ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 504.0 | 1,027,169 | 12,890 | 1.25% | 182 |
| Standard_E64-16ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 2 | 504.0 | 266,956 | 4,181 | 1.57% | 189 |
| Standard_E64-32ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 504.0 | 521,183 | 6,655 | 1.28% | 182 |

### EDv4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 16.0 | 35,901 | 490 | 1.36% | 189 |
| Standard_E4d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 32.0 | 65,859 | 786 | 1.19% | 189 |
| Standard_E8d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 64.0 | 135,986 | 1,194 | 0.88% | 189 |
| Standard_E16d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 128.0 | 271,196 | 1,448 | 0.53% | 182 |
| Standard_E20d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 160.0 | 338,449 | 2,948 | 0.87% | 189 |
| Standard_E32d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 256.0 | 539,487 | 5,562 | 1.03% | 161 |
| Standard_E32d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 256.0 | 529,841 | 13,344 | 2.52% | 28 |
| Standard_E48d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 384.0 | 772,684 | 11,745 | 1.52% | 189 |
| Standard_E64d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 504.0 | 1,025,563 | 13,902 | 1.36% | 189 |

### Esv4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 16.0 | 35,750 | 491 | 1.37% | 175 |
| Standard_E4s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 32.0 | 65,919 | 696 | 1.06% | 182 |
| Standard_E4-2s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 32.0 | 35,875 | 598 | 1.67% | 182 |
| Standard_E8s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 64.0 | 136,061 | 1,199 | 0.88% | 182 |
| Standard_E8-2s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 64.0 | 35,762 | 404 | 1.13% | 182 |
| Standard_E8-4s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 64.0 | 65,865 | 530 | 0.81% | 182 |
| Standard_E16s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 128.0 | 270,956 | 1,486 | 0.55% | 182 |
| Standard_E16-4s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 128.0 | 66,290 | 1,010 | 1.52% | 182 |
| Standard_E16-8s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 128.0 | 135,990 | 1,139 | 0.84% | 182 |
| Standard_E20s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 160.0 | 339,149 | 1,689 | 0.50% | 182 |
| Standard_E32s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 256.0 | 540,883 | 3,428 | 0.63% | 154 |
| Standard_E32s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 256.0 | 533,105 | 10,700 | 2.01% | 28 |
| Standard_E32-8s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 256.0 | 136,061 | 1,055 | 0.78% | 140 |
| Standard_E32-8s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 2 | 256.0 | 136,911 | 3,347 | 2.44% | 35 |
| Standard_E32-16s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 256.0 | 271,570 | 1,334 | 0.49% | 147 |
| Standard_E32-16s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 2 | 256.0 | 264,434 | 5,182 | 1.96% | 35 |
| Standard_E48s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 384.0 | 774,071 | 9,926 | 1.28% | 182 |
| Standard_E64s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 504.0 | 1,024,690 | 13,752 | 1.34% | 182 |
| Standard_E64-16s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 2 | 504.0 | 266,980 | 3,951 | 1.48% | 182 |
| Standard_E64-32s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 504.0 | 521,342 | 7,052 | 1.35% | 182 |

### Ev4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 16.0 | 35,781 | 422 | 1.18% | 182 |
| Standard_E4_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 32.0 | 65,742 | 489 | 0.74% | 175 |
| Standard_E8_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 64.0 | 135,668 | 847 | 0.62% | 182 |
| Standard_E16_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 128.0 | 270,553 | 2,565 | 0.95% | 182 |
| Standard_E20_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 160.0 | 338,166 | 4,445 | 1.31% | 175 |
| Standard_E32_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 256.0 | 541,040 | 2,289 | 0.42% | 154 |
| Standard_E32_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 256.0 | 520,279 | 6,500 | 1.25% | 28 |
| Standard_E48_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 384.0 | 774,116 | 10,210 | 1.32% | 175 |
| Standard_E64_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 504.0 | 1,025,603 | 13,715 | 1.34% | 182 |

### Msv2 High Memory
(10/05/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_M208ms_v2 | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 208 | 4 | 5,700.0 | 3,009,120 | 58,843 | 1.96% | 42 |
| Standard_M208ms_v2 | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 208 | 8 | 5,700.0 | 3,093,184 | 33,253 | 1.08% | 42 |
| Standard_M208s_v2 | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 208 | 4 | 2,850.0 | 3,020,762 | 55,134 | 1.83% | 84 |
| Standard_M416s_v2 | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 416 | 8 | 5,700.0 | 5,959,252 | 93,933 | 1.58% | 84 |
| Standard_M416-208s_v2 | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 208 | 4 | 5,700.0 | 2,992,729 | 52,652 | 1.76% | 14 |
| Standard_M416-208s_v2 | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 208 | 8 | 5,700.0 | 3,085,232 | 36,568 | 1.19% | 70 |
| Standard_M416ms_v2 | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 416 | 8 | 11,400.0 | 5,910,261 | 101,190 | 1.71% | 84 |
| Standard_M416-208ms_v2 | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 208 | 8 | 11,400.0 | 3,064,892 | 40,531 | 1.32% | 77 |

### M-series Medium Memory
(09/29/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_M64 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,024.0 | 821,678 | 11,118 | 1.35% | 77 |
| Standard_M64 | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 1,024.0 | 754,180 | 5,686 | 0.75% | 7 |
| Standard_M64m | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,792.0 | 817,400 | 9,397 | 1.15% | 56 |
| Standard_M64m | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 1,792.0 | 754,929 | 10,566 | 1.40% | 28 |
| Standard_M128 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 2,048.0 | 1,643,769 | 17,798 | 1.08% | 70 |
| Standard_M128 | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 128 | 4 | 2,048.0 | 1,475,843 | 16,197 | 1.10% | 14 |
| Standard_M128m | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 3,892.0 | 1,631,313 | 18,162 | 1.11% | 70 |
| Standard_M128m | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 128 | 4 | 3,892.0 | 1,471,781 | 17,646 | 1.20% | 14 |
| Standard_M8ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 8 | 1 | 218.8 | 110,370 | 366 | 0.33% | 84 |
| Standard_M8-2ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 2 | 1 | 218.8 | 28,041 | 35 | 0.12% | 84 |
| Standard_M8-4ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 4 | 1 | 218.8 | 56,231 | 348 | 0.62% | 77 |
| Standard_M8-4ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 4 | 1 | 218.8 | 48,391 | 280 | 0.58% | 7 |
| Standard_M16ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 16 | 1 | 437.5 | 220,331 | 473 | 0.21% | 70 |
| Standard_M16ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 16 | 1 | 437.5 | 200,561 | 877 | 0.44% | 14 |
| Standard_M16-4ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 4 | 1 | 437.5 | 56,218 | 304 | 0.54% | 70 |
| Standard_M16-4ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 4 | 1 | 437.5 | 48,401 | 205 | 0.42% | 14 |
| Standard_M16-8ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 8 | 1 | 437.5 | 110,426 | 383 | 0.35% | 56 |
| Standard_M16-8ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 8 | 1 | 437.5 | 100,377 | 442 | 0.44% | 28 |
| Standard_M32ls | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 1 | 256.0 | 433,173 | 4,290 | 0.99% | 70 |
| Standard_M32ls | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 32 | 1 | 256.0 | 400,287 | 1,610 | 0.40% | 14 |
| Standard_M32ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 1 | 875.0 | 434,866 | 2,560 | 0.59% | 70 |
| Standard_M32ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 32 | 1 | 875.0 | 400,583 | 1,596 | 0.40% | 14 |
| Standard_M32-8ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 8 | 1 | 875.0 | 110,408 | 346 | 0.31% | 56 |
| Standard_M32-8ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 8 | 1 | 875.0 | 100,521 | 643 | 0.64% | 28 |
| Standard_M32-16ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 16 | 1 | 875.0 | 220,495 | 569 | 0.26% | 70 |
| Standard_M32-16ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 16 | 1 | 875.0 | 200,494 | 723 | 0.36% | 14 |
| Standard_M32ts | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 1 | 192.0 | 435,785 | 2,164 | 0.50% | 77 |
| Standard_M32ts | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 32 | 1 | 192.0 | 399,771 | 1,291 | 0.32% | 7 |
| Standard_M64s | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,024.0 | 822,245 | 7,256 | 0.88% | 70 |
| Standard_M64s | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 1,024.0 | 750,702 | 9,866 | 1.31% | 14 |
| Standard_M64ls | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 512.0 | 820,406 | 13,530 | 1.65% | 77 |
| Standard_M64ls | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 512.0 | 759,753 | 7,639 | 1.01% | 7 |
| Standard_M64ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,792.0 | 823,449 | 7,565 | 0.92% | 70 |
| Standard_M64ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 1,792.0 | 755,541 | 9,337 | 1.24% | 14 |
| Standard_M64-16ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 16 | 2 | 1,792.0 | 210,947 | 2,766 | 1.31% | 77 |
| Standard_M64-16ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 16 | 2 | 1,792.0 | 191,761 | 3,503 | 1.83% | 7 |
| Standard_M64-32ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 2 | 1,792.0 | 416,909 | 3,769 | 0.90% | 63 |
| Standard_M64-32ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 3 | 1,792.0 | 417,771 | 4,820 | 1.15% | 7 |
| Standard_M64-32ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 32 | 2 | 1,792.0 | 382,773 | 3,547 | 0.93% | 14 |
| Standard_M128s | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 2,048.0 | 1,641,176 | 16,698 | 1.02% | 70 |
| Standard_M128s | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 128 | 4 | 2,048.0 | 1,477,253 | 15,626 | 1.06% | 14 |
| Standard_M128ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 3,892.0 | 1,645,242 | 17,679 | 1.07% | 63 |
| Standard_M128ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 128 | 4 | 3,892.0 | 1,479,298 | 16,978 | 1.15% | 21 |
| Standard_M128-32ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 4 | 3,892.0 | 414,541 | 4,739 | 1.14% | 63 |
| Standard_M128-32ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 32 | 4 | 3,892.0 | 380,611 | 5,653 | 1.49% | 21 |
| Standard_M128-64ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 4 | 3,892.0 | 817,496 | 8,437 | 1.03% | 56 |
| Standard_M128-64ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 4 | 3,892.0 | 749,800 | 8,506 | 1.13% | 28 |

## Storage optimized
### Lsv2 - Storage Optimized
(10/13/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_L8s_v2 | AMD EPYC 7551 32-Core Processor | 8 | 1 | 64.0 | 102,237 | 1,320 | 1.29% | 77 |
| Standard_L16s_v2 | AMD EPYC 7551 32-Core Processor | 16 | 2 | 128.0 | 198,472 | 3,734 | 1.88% | 70 |
| Standard_L32s_v2 | AMD EPYC 7551 32-Core Processor | 32 | 4 | 256.0 | 390,015 | 10,126 | 2.60% | 77 |
| Standard_L48s_v2 | AMD EPYC 7551 32-Core Processor | 48 | 6 | 384.0 | 583,388 | 15,479 | 2.65% | 77 |
| Standard_L64s_v2 | AMD EPYC 7551 32-Core Processor | 64 | 8 | 512.0 | 774,827 | 19,205 | 2.48% | 77 |
| Standard_L80s_v2 | AMD EPYC 7551 32-Core Processor | 80 | 10 | 640.0 | 966,682 | 22,811 | 2.36% | 77 |


## About CoreMark

[CoreMark](https://www.eembc.org/coremark/faq.php) is a benchmark that tests the functionality of a microcontroller (MCU) or central processing unit (CPU). CoreMark is not system dependent, so it functions the same regardless of the platform (e.g. big or little endian, high-end or low-end processor). 

Linux numbers were computed by running CoreMark on Ubuntu 18.04. CoreMark was configured with the number of threads set to the number of virtual CPUs, and concurrency set to `PThreads`. The target number of iterations was adjusted based on expected performance to provide a runtime of at least 20 seconds (typically much longer). The final score represents the number of iterations completed divided by the number of seconds it took to run the test. Each test was run at least seven times on each VM. Test run dates shown above. Tests run on multiple VMs across Azure public regions the VM was supported in on the date run. 

### Running Coremark on Azure VMs

**Download:**

CoreMark is an open source tool that can be downloaded from [GitHub](https://github.com/eembc/coremark).

**Building and Running:**

To build and run the benchmark, type:

```> make```

Full results are available in the files ```run1.log``` and ```run2.log```. 
```run1.log``` contains CoreMark results. These are the benchmark results with performance parameters.
```run2.log``` contains benchmark results with validation parameters. 

**Run Time:**

By default, the benchmark will run between 10-100 seconds. To override, use ```ITERATIONS=N```

```% make ITERATIONS=10```

above flag will run the benchmark for 10 iterations. 
**Results are only valid for reporting if the benchmark ran for at least 10 seconds!**

**Parallel Execution:**

Use ```XCFLAGS=-DMULTITHREAD=N``` where N is number of threads to run in parallel. Several implementations are available to execute in multiple contexts.

```% make XCFLAGS="-DMULTITHREAD=4 -DUSE_PTHREAD"```

The above will compile the benchmark for execution on 4 cores.

**Recommendations for best results**

- The benchmark needs to run for at least 10 seconds, probably longer on larger systems.
- All source files must be compiled with same flags.
- Do not change source files other than ```core_portme*``` (use ```make check``` to validate)
- Multiple runs are suggested for best results.

## Coverage

Older deprecated series are not shown. N series not shown as they are GPU centric and Coremark doesn't measure GPU performance.  Newer series may not have been benchmarked yet.
Previous versions of this document cited benchmark runs from Ubuntu 16.04 which resulted in slightly lower performance than the current benchmarks running on Ubuntu 18.04.


## Next steps
* For storage capacities, disk details, and additional considerations for choosing among VM sizes, see [Sizes for virtual machines](../sizes.md).
