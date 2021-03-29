---
title: Compute benchmark scores for Azure Linux VMs 
description: Compare CoreMark compute benchmark scores for Azure VMs running Linux.
ms.service: virtual-machines
ms.subservice: benchmark
ms.collection: linux
ms.topic: conceptual
ms.date: 03/31/2021
ms.reviewer: davberg

---
# Compute benchmark scores for Linux VMs
The following CoreMark benchmark scores show compute performance for Azure's high-performance VM lineup running Ubuntu. Compute benchmark scores are also available for [Windows VMs](../windows/compute-benchmark-scores.md).

| Type | Families | 
| ---- | -------- | 
|  | [A0-7](#a0-7-standard-general-compute) [Lv2](#lv2---storage-optimized)  | 
| Compute optimized | [Fsv2](#fsv2---compute--storage-optimized)  | 
| General purpose | [Av2](#av2---general-compute) [B](#b---burstable) [DSv3](#dsv3---general-compute--premium-storage) [Dv3](#dv3---general-compute) [Dasv4](#dasv4) [Dav4](#dav4) [DCS](#dcs---confidential-compute-series) [DCsv2](#dcsv2) [DCv2](#dcv2) [DDSv4](#ddsv4) [DDv4](#ddv4) [Dsv4](#dsv4) [Dv4](#dv4)  | 
| High performance compute | [H](#h---high-performance-compute-hpc) [HBrsv2](#hbrsv2) [HBS](#hbs---memory-bandwidth--amd-epyc) [HCS](#hcs---dense-computation--intel-xeon-platinum-8168)  | 
| Memory optimized | [DSv2](#dsv2---storage-optimized) [Dv2](#dv2---general-compute) [Esv3](#esv3---memory-optimized--premium-storage) [Ev3](#ev3---memory-optimized) [Easv4](#easv4) [Eav4](#eav4) [EDSv4](#edsv4) [EDv4](#edv4) [Esv4](#esv4) [Ev4](#ev4) [Msv2](#msv2---memory-optimized) [Msv2s](#msv2-small---memory-optimized) [M](#m---memory-optimized)  | 


## A0-7 Standard General Compute
(09/30/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_A0 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 1 | 1 | 0.6 | 65 | 1.05% | 3.57% | 42 |
| Standard_A0 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 0.6 | 72 | 3.30% | 13.25% | 140 |
| Standard_A0 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 0.6 | 67 | 0.62% | 1.55% | 7 |
| Standard_A0 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 0.6 | 86 | 3.64% | 9.57% | 14 |
| Standard_A1 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 1 | 1 | 1.6 | 132 | 1.27% | 4.76% | 35 |
| Standard_A1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 1.6 | 138 | 3.80% | 15.05% | 147 |
| Standard_A1 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 1.6 | 131 | 0.15% | 0.45% | 7 |
| Standard_A1 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 1.6 | 172 | 1.50% | 3.45% | 14 |
| Standard_A2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 2 | 1 | 3.4 | 262 | 0.83% | 2.53% | 28 |
| Standard_A2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 3.4 | 278 | 2.29% | 8.02% | 84 |
| Standard_A2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 3.3 | 269 | 3.89% | 12.81% | 70 |
| Standard_A2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 3.4 | 264 | 0.22% | 0.66% | 7 |
| Standard_A2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 3.4 | 347 | 2.12% | 6.09% | 14 |
| Standard_A3 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 6.8 | 523 | 1.08% | 3.00% | 35 |
| Standard_A3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 6.8 | 545 | 2.42% | 12.20% | 147 |
| Standard_A3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 6.8 | 540 | 0.77% | 2.27% | 7 |
| Standard_A3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 6.8 | 697 | 2.63% | 7.12% | 14 |
| Standard_A4 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 8 | 1 | 13.6 | 1,052 | 1.25% | 4.24% | 14 |
| Standard_A4 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 8 | 1 | 13.7 | 1,055 | 0.29% | 1.16% | 21 |
| Standard_A4 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 13.7 | 1,072 | 7.17% | 29.75% | 91 |
| Standard_A4 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 13.6 | 1,086 | 1.08% | 3.73% | 56 |
| Standard_A4 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 13.7 | 1,050 | 0.45% | 1.27% | 7 |
| Standard_A4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 13.7 | 1,412 | 0.39% | 1.51% | 14 |
| Standard_A5 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 2 | 1 | 13.7 | 261 | 0.25% | 0.67% | 7 |
| Standard_A5 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 13.6 | 270 | 3.90% | 13.18% | 70 |
| Standard_A5 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 13.7 | 277 | 1.86% | 8.62% | 98 |
| Standard_A5 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 13.7 | 265 | 0.26% | 0.72% | 7 |
| Standard_A5 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 13.7 | 352 | 1.16% | 3.15% | 14 |
| Standard_A6 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 27.4 | 524 | 0.88% | 2.29% | 21 |
| Standard_A6 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 27.4 | 543 | 3.11% | 11.94% | 154 |
| Standard_A6 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 27.4 | 521 | 0.56% | 1.53% | 7 |
| Standard_A6 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 27.4 | 671 | 2.46% | 7.68% | 14 |
| Standard_A7 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 8 | 1 | 54.9 | 1,049 | 0.88% | 4.04% | 28 |
| Standard_A7 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 54.9 | 1,089 | 1.07% | 5.90% | 161 |
| Standard_A7 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 54.9 | 1,415 | 0.32% | 1.07% | 14 |

## Lv2 - Storage Optimized
(10/13/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_L8s_v2 | AMD EPYC 7551 32-Core Processor | 8 | 1 | 62.8 | 1,763 | 1.29% | 4.15% | 77 |
| Standard_L16s_v2 | AMD EPYC 7551 32-Core Processor | 16 | 2 | 125.9 | 3,422 | 1.88% | 9.05% | 70 |
| Standard_L32s_v2 | AMD EPYC 7551 32-Core Processor | 32 | 4 | 251.9 | 6,724 | 2.60% | 8.84% | 77 |
| Standard_L48s_v2 | AMD EPYC 7551 32-Core Processor | 48 | 6 | 377.9 | 10,058 | 2.65% | 10.14% | 77 |
| Standard_L64s_v2 | AMD EPYC 7551 32-Core Processor | 64 | 8 | 503.9 | 13,359 | 2.48% | 8.14% | 77 |
| Standard_L80s_v2 | AMD EPYC 7551 32-Core Processor | 80 | 10 | 629.9 | 16,667 | 2.36% | 6.51% | 77 |


## Fsv2 - Compute + Storage Optimized
(10/10/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_F2s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 2 | 1 | 3.8 | 616 | 1.44% | 7.35% | 98 |
| Standard_F2s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 2 | 1 | 3.8 | 620 | 1.29% | 5.17% | 105 |
| Standard_F2s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 2 | 1 | 3.8 | 622 | 2.07% | 10.76% | 105 |
| Standard_F2s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 3.8 | 613 | 0.22% | 0.88% | 35 |
| Standard_F2s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 3.8 | 619 | 1.33% | 4.42% | 42 |
| Standard_F2s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 3.8 | 612 | 0.12% | 0.33% | 35 |
| Standard_F4s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 4 | 1 | 7.7 | 1,131 | 0.58% | 1.99% | 35 |
| Standard_F4s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 4 | 1 | 7.8 | 1,134 | 1.09% | 6.89% | 140 |
| Standard_F4s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 4 | 1 | 7.8 | 1,142 | 2.18% | 7.30% | 42 |
| Standard_F4s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 4 | 1 | 7.7 | 1,131 | 0.65% | 2.43% | 28 |
| Standard_F4s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 7.8 | 1,131 | 0.72% | 2.61% | 49 |
| Standard_F4s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 7.8 | 1,133 | 0.67% | 3.46% | 49 |
| Standard_F8s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 8 | 1 | 15.6 | 2,345 | 0.96% | 5.82% | 161 |
| Standard_F8s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 8 | 1 | 15.6 | 2,346 | 0.88% | 4.90% | 77 |
| Standard_F8s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 15.6 | 2,344 | 0.78% | 4.17% | 49 |
| Standard_F8s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 15.6 | 2,339 | 0.50% | 2.42% | 42 |
| Standard_F16s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 16 | 1 | 31.3 | 4,691 | 0.57% | 2.93% | 63 |
| Standard_F16s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 16 | 1 | 31.4 | 4,670 | 0.77% | 3.65% | 91 |
| Standard_F16s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 16 | 1 | 31.4 | 4,672 | 0.73% | 3.23% | 70 |
| Standard_F16s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 16 | 1 | 31.3 | 4,685 | 0.56% | 2.20% | 28 |
| Standard_F16s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 16 | 1 | 31.4 | 4,690 | 0.78% | 2.51% | 21 |
| Standard_F16s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 16 | 1 | 31.3 | 4,696 | 0.65% | 1.76% | 7 |
| Standard_F16s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 31.4 | 4,675 | 0.47% | 2.04% | 49 |
| Standard_F16s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 31.4 | 4,676 | 0.53% | 1.94% | 35 |
| Standard_F16s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 31.4 | 4,680 | 0.47% | 1.46% | 21 |
| Standard_F32s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 32 | 1 | 62.8 | 9,293 | 0.70% | 3.73% | 154 |
| Standard_F32s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 32 | 1 | 62.8 | 9,275 | 0.70% | 2.91% | 84 |
| Standard_F32s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 32 | 1 | 62.8 | 9,344 | 0.50% | 1.37% | 7 |
| Standard_F32s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 62.8 | 9,271 | 1.34% | 5.28% | 49 |
| Standard_F32s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 62.8 | 9,261 | 1.61% | 5.36% | 35 |
| Standard_F32s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 62.8 | 9,361 | 0.47% | 1.35% | 7 |
| Standard_F48s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 48 | 2 | 94.4 | 13,462 | 1.13% | 5.24% | 168 |
| Standard_F48s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 48 | 2 | 94.4 | 13,420 | 0.98% | 3.43% | 14 |
| Standard_F48s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 94.3 | 12,925 | 2.90% | 9.31% | 56 |
| Standard_F64s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 64 | 2 | 125.9 | 17,849 | 1.11% | 4.64% | 154 |
| Standard_F64s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 64 | 2 | 125.9 | 17,878 | 1.18% | 4.70% | 21 |
| Standard_F64s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 125.9 | 17,637 | 1.72% | 6.74% | 56 |
| Standard_F64s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 125.9 | 17,778 | 1.31% | 3.38% | 7 |
| Standard_F72s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 72 | 2 | 141.6 | 19,418 | 1.08% | 4.79% | 168 |
| Standard_F72s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 72 | 2 | 141.6 | 19,380 | 1.02% | 3.34% | 14 |
| Standard_F72s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 72 | 2 | 141.6 | 19,312 | 1.40% | 5.06% | 42 |

## Av2 - General Compute
(09/24/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_A1_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 1 | 1 | 1.9 | 133 | 0.78% | 2.82% | 42 |
| Standard_A1_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 1.9 | 139 | 2.63% | 12.84% | 70 |
| Standard_A1_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 1.9 | 148 | 8.11% | 23.41% | 63 |
| Standard_A1_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 1.9 | 133 | 4.05% | 13.72% | 63 |
| Standard_A2_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 2 | 1 | 3.8 | 263 | 1.14% | 3.67% | 35 |
| Standard_A2_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 3.8 | 274 | 4.44% | 15.42% | 56 |
| Standard_A2_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 3.8 | 289 | 6.39% | 18.51% | 91 |
| Standard_A2_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 3.8 | 272 | 5.03% | 17.87% | 49 |
| Standard_A2_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 3.8 | 260 | 0.17% | 0.44% | 7 |
| Standard_A2m_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 2 | 1 | 15.6 | 264 | 0.33% | 1.30% | 35 |
| Standard_A2m_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 15.6 | 276 | 4.48% | 16.31% | 77 |
| Standard_A2m_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 15.6 | 279 | 4.28% | 20.70% | 77 |
| Standard_A2m_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 15.6 | 269 | 3.14% | 12.05% | 35 |
| Standard_A2m_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 15.6 | 256 | 0.48% | 1.30% | 14 |
| Standard_A4_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 7.7 | 522 | 0.95% | 3.17% | 21 |
| Standard_A4_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 7.8 | 522 | 0.72% | 1.81% | 14 |
| Standard_A4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 7.8 | 548 | 1.32% | 4.47% | 49 |
| Standard_A4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 7.7 | 535 | 0.57% | 1.43% | 14 |
| Standard_A4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 7.8 | 597 | 7.06% | 24.52% | 35 |
| Standard_A4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 7.7 | 565 | 3.41% | 11.44% | 35 |
| Standard_A4_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 7.7 | 534 | 2.84% | 8.36% | 35 |
| Standard_A4_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 7.8 | 556 | 0.65% | 2.17% | 14 |
| Standard_A4_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 7.8 | 492 | 1.68% | 5.88% | 14 |
| Standard_A4m_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 31.4 | 519 | 1.53% | 4.52% | 28 |
| Standard_A4m_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 31.3 | 524 | 0.20% | 0.53% | 7 |
| Standard_A4m_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 31.4 | 550 | 1.48% | 5.92% | 49 |
| Standard_A4m_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 31.3 | 530 | 3.28% | 7.83% | 21 |
| Standard_A4m_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 31.3 | 593 | 6.07% | 20.45% | 56 |
| Standard_A4m_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 31.4 | 515 | 13.77% | 38.15% | 21 |
| Standard_A4m_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 31.3 | 527 | 2.90% | 7.33% | 21 |
| Standard_A4m_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 31.4 | 517 | 0.39% | 1.47% | 35 |
| Standard_A8_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 8 | 1 | 15.6 | 1,055 | 0.54% | 2.24% | 35 |
| Standard_A8_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 15.6 | 1,080 | 3.68% | 15.62% | 84 |
| Standard_A8_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 15.6 | 1,096 | 2.53% | 8.94% | 49 |
| Standard_A8_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 15.6 | 1,064 | 2.48% | 8.31% | 70 |
| Standard_A8m_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 8 | 2 | 62.9 | 1,036 | 1.64% | 5.79% | 42 |
| Standard_A8m_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 62.8 | 1,088 | 0.81% | 2.89% | 70 |
| Standard_A8m_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 62.8 | 1,114 | 3.96% | 12.33% | 77 |
| Standard_A8m_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 62.8 | 1,056 | 1.42% | 5.60% | 42 |

## B - Burstable
(09/24/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_B1s | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 0.9 | 324 | 2.29% | 9.39% | 35 |
| Standard_B1s | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 0.9 | 340 | 6.38% | 25.56% | 112 |
| Standard_B1s | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 0.9 | 315 | 12.66% | 63.91% | 70 |
| Standard_B1s | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 0.9 | 379 | 1.69% | 4.90% | 21 |
| Standard_B1ls | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 0.4 | 330 | 3.16% | 9.31% | 28 |
| Standard_B1ls | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 0.4 | 334 | 4.18% | 17.82% | 126 |
| Standard_B1ls | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 0.4 | 324 | 15.12% | 67.30% | 63 |
| Standard_B1ls | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 0.4 | 379 | 2.10% | 7.55% | 21 |
| Standard_B1ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 1.9 | 313 | 0.45% | 1.69% | 14 |
| Standard_B1ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 1.9 | 347 | 5.90% | 22.55% | 126 |
| Standard_B1ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 1.9 | 326 | 12.89% | 57.97% | 77 |
| Standard_B1ms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 1.9 | 382 | 0.26% | 0.81% | 21 |
| Standard_B2s | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 3.8 | 622 | 1.20% | 3.71% | 21 |
| Standard_B2s | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 3.8 | 649 | 3.84% | 18.05% | 119 |
| Standard_B2s | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 3.8 | 652 | 15.63% | 76.27% | 70 |
| Standard_B2s | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 3.8 | 761 | 0.90% | 3.18% | 28 |
| Standard_B2ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 7.7 | 621 | 0.38% | 1.35% | 14 |
| Standard_B2ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 7.8 | 632 | 0.43% | 1.69% | 14 |
| Standard_B2ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 7.8 | 647 | 4.90% | 18.82% | 63 |
| Standard_B2ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 7.7 | 666 | 3.74% | 13.81% | 56 |
| Standard_B2ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 7.8 | 635 | 13.38% | 55.80% | 63 |
| Standard_B2ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 7.7 | 848 | 1.02% | 2.96% | 7 |
| Standard_B2ms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 7.8 | 763 | 0.79% | 2.49% | 21 |
| Standard_B4ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 15.6 | 1,213 | 4.70% | 12.75% | 28 |
| Standard_B4ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 15.6 | 1,283 | 3.56% | 13.72% | 112 |
| Standard_B4ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 15.6 | 1,227 | 11.25% | 53.19% | 77 |
| Standard_B4ms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 15.6 | 1,481 | 1.68% | 6.54% | 21 |
| Standard_B8ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 31.4 | 2,534 | 0.32% | 1.18% | 21 |
| Standard_B8ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 31.3 | 2,438 | 1.50% | 3.95% | 14 |
| Standard_B8ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 31.3 | 2,500 | 1.10% | 4.26% | 77 |
| Standard_B8ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 31.4 | 2,503 | 0.56% | 2.16% | 21 |
| Standard_B8ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 31.3 | 2,464 | 1.06% | 3.75% | 21 |
| Standard_B8ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 31.4 | 2,370 | 9.87% | 40.56% | 63 |
| Standard_B8ms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 31.4 | 2,938 | 1.41% | 4.52% | 14 |
| Standard_B12ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 12 | 1 | 47.1 | 3,790 | 0.64% | 1.98% | 7 |
| Standard_B12ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 12 | 1 | 47.0 | 3,673 | 1.92% | 5.48% | 21 |
| Standard_B12ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 12 | 1 | 47.0 | 3,782 | 1.15% | 5.69% | 84 |
| Standard_B12ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 12 | 1 | 47.1 | 3,783 | 0.38% | 1.46% | 28 |
| Standard_B12ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 12 | 1 | 47.1 | 3,480 | 8.74% | 35.25% | 70 |
| Standard_B12ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 12 | 1 | 47.0 | 3,687 | 0.38% | 1.11% | 7 |
| Standard_B12ms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 12 | 1 | 47.1 | 4,420 | 0.69% | 2.42% | 21 |
| Standard_B16ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 62.9 | 4,770 | 3.22% | 14.36% | 35 |
| Standard_B16ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 62.8 | 5,070 | 1.17% | 6.33% | 112 |
| Standard_B16ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 62.8 | 4,665 | 10.22% | 32.22% | 70 |
| Standard_B16ms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 62.8 | 5,872 | 1.87% | 7.40% | 21 |
| Standard_B20ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 20 | 2 | 78.6 | 5,983 | 1.81% | 4.95% | 7 |
| Standard_B20ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 20 | 2 | 78.7 | 5,988 | 1.77% | 5.08% | 7 |
| Standard_B20ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 20 | 1 | 78.5 | 6,261 | 0.99% | 4.48% | 77 |
| Standard_B20ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 20 | 1 | 78.6 | 6,265 | 1.20% | 4.49% | 35 |
| Standard_B20ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 20 | 1 | 78.6 | 5,877 | 6.50% | 23.38% | 84 |
| Standard_B20ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 20 | 1 | 78.5 | 6,174 | 0.45% | 1.14% | 7 |
| Standard_B20ms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 78.6 | 7,174 | 0.80% | 2.87% | 21 |

## DSv3 - General Compute + Premium Storage
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 7.7 | 430 | 0.66% | 2.06% | 14 |
| Standard_D2s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 7.8 | 474 | 0.41% | 1.36% | 14 |
| Standard_D2s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 7.7 | 461 | 1.01% | 2.96% | 7 |
| Standard_D2s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 7.8 | 491 | 4.49% | 9.51% | 14 |
| Standard_D2s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 7.7 | 475 | 7.96% | 34.62% | 70 |
| Standard_D2s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 7.7 | 477 | 7.98% | 20.21% | 28 |
| Standard_D2s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 7.8 | 458 | 2.54% | 9.97% | 63 |
| Standard_D2s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 7.8 | 540 | 0.06% | 0.25% | 21 |
| Standard_D4s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 15.6 | 874 | 2.09% | 6.58% | 35 |
| Standard_D4s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 15.6 | 904 | 6.70% | 22.61% | 77 |
| Standard_D4s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 15.6 | 863 | 6.66% | 27.57% | 91 |
| Standard_D4s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 15.6 | 1,000 | 0.48% | 1.63% | 35 |
| Standard_D8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 31.3 | 1,713 | 0.18% | 0.50% | 7 |
| Standard_D8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 31.3 | 1,749 | 8.27% | 27.86% | 98 |
| Standard_D8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 31.4 | 1,719 | 3.19% | 10.06% | 28 |
| Standard_D8s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 31.4 | 1,737 | 1.62% | 5.74% | 28 |
| Standard_D8s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 31.3 | 1,797 | 3.23% | 10.63% | 28 |
| Standard_D8s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 31.4 | 2,069 | 0.46% | 2.39% | 35 |
| Standard_D16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 1 | 62.8 | 3,439 | 0.95% | 3.01% | 35 |
| Standard_D16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 62.8 | 3,383 | 2.72% | 9.79% | 77 |
| Standard_D16s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 62.8 | 3,450 | 1.58% | 7.11% | 98 |
| Standard_D16s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 62.8 | 4,135 | 0.61% | 2.63% | 28 |
| Standard_D32s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 32 | 2 | 125.9 | 6,710 | 0.88% | 3.68% | 35 |
| Standard_D32s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 1 | 125.8 | 6,741 | 0.47% | 2.22% | 91 |
| Standard_D32s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 1 | 125.8 | 6,849 | 0.75% | 3.56% | 77 |
| Standard_D32s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 125.8 | 8,257 | 0.41% | 1.57% | 35 |
| Standard_D32-8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 2 | 125.9 | 1,754 | 2.34% | 9.94% | 42 |
| Standard_D32-8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 125.8 | 1,823 | 5.63% | 17.63% | 98 |
| Standard_D32-8s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 125.8 | 1,847 | 4.61% | 18.59% | 105 |
| Standard_D32-8s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 125.8 | 2,073 | 0.62% | 2.27% | 21 |
| Standard_D32-16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 125.9 | 3,390 | 1.57% | 5.81% | 49 |
| Standard_D32-16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 125.8 | 3,411 | 2.44% | 12.03% | 84 |
| Standard_D32-16s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 125.8 | 3,476 | 1.57% | 7.96% | 119 |
| Standard_D32-16s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 125.8 | 4,146 | 0.41% | 1.19% | 14 |
| Standard_D48s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 48 | 2 | 188.9 | 9,853 | 0.83% | 3.83% | 112 |
| Standard_D48s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 48 | 1 | 188.7 | 10,033 | 0.58% | 2.94% | 63 |
| Standard_D48s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 48 | 2 | 188.9 | 9,969 | 0.99% | 4.99% | 35 |
| Standard_D48s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 188.7 | 12,038 | 1.27% | 4.79% | 28 |
| Standard_D64s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 64 | 2 | 251.9 | 13,137 | 0.65% | 2.30% | 49 |
| Standard_D64s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 64 | 2 | 251.9 | 13,235 | 1.37% | 6.72% | 154 |
| Standard_D64s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 251.9 | 15,677 | 0.86% | 3.45% | 28 |
| Standard_D64-16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 2 | 251.9 | 4,050 | 1.04% | 3.80% | 28 |
| Standard_D64-16s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 251.7 | 3,554 | 2.04% | 10.96% | 168 |
| Standard_D64-16s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 2 | 251.9 | 3,604 | 5.59% | 20.13% | 42 |
| Standard_D64-16s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 251.7 | 4,141 | 0.46% | 1.39% | 21 |
| Standard_D64-32s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 2 | 251.9 | 7,096 | 0.87% | 3.77% | 28 |
| Standard_D64-32s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 1 | 251.7 | 6,894 | 0.48% | 2.21% | 161 |
| Standard_D64-32s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 2 | 251.9 | 6,812 | 2.46% | 10.19% | 49 |
| Standard_D64-32s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 251.7 | 8,270 | 0.46% | 1.77% | 21 |

## Dv3 - General Compute
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 7.8 | 441 | 3.86% | 16.60% | 63 |
| Standard_D2_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 7.7 | 436 | 3.71% | 10.59% | 28 |
| Standard_D2_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 7.8 | 458 | 6.43% | 22.12% | 42 |
| Standard_D2_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 7.7 | 460 | 2.46% | 7.86% | 28 |
| Standard_D2_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 7.7 | 490 | 6.35% | 18.46% | 21 |
| Standard_D2_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 7.8 | 458 | 4.94% | 14.45% | 49 |
| Standard_D2_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 7.8 | 541 | 0.07% | 0.21% | 7 |
| Standard_D4_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 15.6 | 857 | 5.37% | 24.84% | 77 |
| Standard_D4_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 15.6 | 891 | 7.35% | 24.16% | 91 |
| Standard_D4_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 15.6 | 862 | 4.42% | 16.75% | 70 |
| Standard_D8_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 31.3 | 1,729 | 1.14% | 4.17% | 49 |
| Standard_D8_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 31.4 | 1,734 | 1.47% | 6.44% | 49 |
| Standard_D8_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 31.3 | 1,690 | 6.87% | 29.28% | 70 |
| Standard_D8_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 31.4 | 1,678 | 0.35% | 1.29% | 21 |
| Standard_D8_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 31.4 | 1,730 | 1.47% | 4.94% | 14 |
| Standard_D8_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 31.3 | 1,742 | 1.61% | 5.57% | 28 |
| Standard_D8_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 31.4 | 2,070 | 0.47% | 1.22% | 7 |
| Standard_D16_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 1 | 62.8 | 3,420 | 1.12% | 5.14% | 84 |
| Standard_D16_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 62.8 | 3,336 | 1.07% | 4.55% | 77 |
| Standard_D16_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 62.8 | 3,443 | 0.93% | 3.74% | 63 |
| Standard_D16_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 62.8 | 4,123 | 0.74% | 1.68% | 7 |
| Standard_D32_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 32 | 2 | 125.9 | 6,685 | 0.97% | 5.05% | 63 |
| Standard_D32_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 1 | 125.8 | 6,698 | 2.56% | 11.73% | 112 |
| Standard_D32_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 1 | 125.8 | 6,855 | 0.61% | 2.64% | 49 |
| Standard_D32_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 125.8 | 8,261 | 0.28% | 0.83% | 14 |
| Standard_D48_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 48 | 2 | 188.9 | 9,816 | 1.13% | 8.66% | 140 |
| Standard_D48_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 48 | 1 | 188.7 | 9,973 | 1.14% | 4.51% | 70 |
| Standard_D48_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 48 | 2 | 188.9 | 9,939 | 1.30% | 4.79% | 21 |
| Standard_D48_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 188.7 | 11,951 | 1.30% | 3.08% | 7 |
| Standard_D64_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 64 | 2 | 251.9 | 13,149 | 0.72% | 2.62% | 42 |
| Standard_D64_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 64 | 2 | 251.9 | 13,220 | 0.98% | 4.58% | 189 |
| Standard_D64_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 251.9 | 15,803 | 0.98% | 2.55% | 7 |

## Dasv4
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2as_v4 | AMD EPYC 7452 32-Core Processor | 2 | 1 | 7.8 | 659 | 0.82% | 3.10% | 77 |
| Standard_D4as_v4 | AMD EPYC 7452 32-Core Processor | 4 | 1 | 15.6 | 1,236 | 1.10% | 4.55% | 98 |
| Standard_D8as_v4 | AMD EPYC 7452 32-Core Processor | 8 | 1 | 31.4 | 2,612 | 1.06% | 4.05% | 56 |
| Standard_D16as_v4 | AMD EPYC 7452 32-Core Processor | 16 | 2 | 62.9 | 5,036 | 3.35% | 27.39% | 91 |
| Standard_D32as_v4 | AMD EPYC 7452 32-Core Processor | 32 | 4 | 125.9 | 9,922 | 2.53% | 8.01% | 98 |
| Standard_D48as_v4 | AMD EPYC 7452 32-Core Processor | 48 | 6 | 188.9 | 14,540 | 2.58% | 9.42% | 105 |
| Standard_D64as_v4 | AMD EPYC 7452 32-Core Processor | 64 | 8 | 251.9 | 19,318 | 2.74% | 5.82% | 7 |

## Dav4
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2a_v4 | AMD EPYC 7452 32-Core Processor | 2 | 1 | 7.8 | 656 | 3.20% | 17.51% | 119 |
| Standard_D4a_v4 | AMD EPYC 7452 32-Core Processor | 4 | 1 | 15.6 | 1,224 | 3.21% | 17.46% | 140 |
| Standard_D8a_v4 | AMD EPYC 7452 32-Core Processor | 8 | 1 | 31.4 | 2,610 | 1.29% | 7.07% | 147 |
| Standard_D16a_v4 | AMD EPYC 7452 32-Core Processor | 16 | 2 | 62.9 | 5,063 | 2.13% | 9.81% | 161 |
| Standard_D32a_v4 | AMD EPYC 7452 32-Core Processor | 32 | 4 | 125.9 | 9,860 | 2.80% | 12.08% | 147 |
| Standard_D48a_v4 | AMD EPYC 7452 32-Core Processor | 48 | 6 | 188.9 | 14,437 | 2.74% | 12.71% | 161 |
| Standard_D64a_v4 | AMD EPYC 7452 32-Core Processor | 64 | 8 | 251.9 | 19,427 | 2.59% | 6.57% | 21 |
| Standard_D96a_v4 | AMD EPYC 7452 32-Core Processor | 96 | 12 | 377.9 | 27,421 | 2.00% | 4.79% | 14 |

## DCS - Confidential Compute Series
(10/01/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_DC2s | Intel(R) Xeon(R) E-2176G CPU @ 3.70GHz | 2 | 1 | 7.8 | 1,088 | 0.43% | 1.38% | 14 |
| Standard_DC2s | Intel(R) Xeon(R) E-2176G CPU @ 3.70GHz | 2 | 1 | 7.8 | 1,099 | 0.30% | 1.03% | 14 |
| Standard_DC4s | Intel(R) Xeon(R) E-2176G CPU @ 3.70GHz | 4 | 1 | 15.6 | 2,132 | 0.37% | 0.81% | 7 |
| Standard_DC4s | Intel(R) Xeon(R) E-2176G CPU @ 3.70GHz | 4 | 1 | 15.6 | 2,141 | 0.21% | 0.60% | 14 |

## DCsv2
(10/08/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_DC1s_v2 | Intel(R) Xeon(R) E-2288G CPU @ 3.70GHz | 1 | 1 | 3.8 | 593 | 0.47% | 1.97% | 77 |
| Standard_DC2s_v2 | Intel(R) Xeon(R) E-2288G CPU @ 3.70GHz | 2 | 1 | 7.8 | 1,182 | 1.11% | 5.16% | 77 |
| Standard_DC4s_v2 | Intel(R) Xeon(R) E-2288G CPU @ 3.70GHz | 4 | 1 | 15.6 | 2,308 | 1.47% | 6.53% | 77 |

## DCv2
(10/13/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_DC8_v2 | Intel(R) Xeon(R) E-2288G CPU @ 3.70GHz | 8 | 1 | 31.4 | 4,346 | 1.21% | 6.95% | 77 |

## DDSv4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 7.8 | 613 | 2.08% | 12.24% | 189 |
| Standard_D4ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 15.6 | 1,137 | 1.19% | 7.62% | 189 |
| Standard_D8ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 31.4 | 2,343 | 0.81% | 4.06% | 189 |
| Standard_D16ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 62.8 | 4,675 | 0.51% | 2.89% | 189 |
| Standard_D32ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 125.8 | 9,314 | 0.92% | 5.71% | 189 |
| Standard_D48ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 188.7 | 13,044 | 1.99% | 8.50% | 154 |
| Standard_D48ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 188.9 | 13,367 | 1.52% | 6.11% | 35 |
| Standard_D64ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 251.9 | 17,673 | 1.41% | 6.23% | 182 |

## DDv4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 7.8 | 614 | 1.04% | 6.03% | 189 |
| Standard_D4d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 15.6 | 1,134 | 0.90% | 6.36% | 189 |
| Standard_D8d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 31.4 | 2,341 | 0.66% | 3.86% | 189 |
| Standard_D16d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 62.8 | 4,676 | 0.60% | 3.33% | 189 |
| Standard_D32d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 125.8 | 9,311 | 0.82% | 4.33% | 189 |
| Standard_D48d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 188.7 | 12,832 | 2.80% | 11.82% | 147 |
| Standard_D48d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 188.9 | 13,271 | 1.40% | 5.30% | 42 |
| Standard_D64d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 251.9 | 17,605 | 1.56% | 7.53% | 189 |

## Dsv4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 7.8 | 617 | 1.61% | 6.73% | 175 |
| Standard_D4s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 15.6 | 1,136 | 1.01% | 5.42% | 182 |
| Standard_D8s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 31.4 | 2,337 | 0.62% | 5.06% | 182 |
| Standard_D16s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 62.8 | 4,673 | 0.53% | 2.86% | 182 |
| Standard_D32s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 125.8 | 9,298 | 1.53% | 9.08% | 182 |
| Standard_D48s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 188.7 | 12,820 | 2.45% | 10.82% | 140 |
| Standard_D48s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 188.9 | 13,325 | 1.22% | 4.73% | 35 |
| Standard_D64s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 251.9 | 17,669 | 1.51% | 6.31% | 182 |

## Dv4
(09/21/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 7.8 | 615 | 0.64% | 3.84% | 182 |
| Standard_D4_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 15.6 | 1,136 | 0.98% | 5.16% | 175 |
| Standard_D8_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 31.4 | 2,341 | 0.71% | 4.11% | 182 |
| Standard_D16_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 62.8 | 4,676 | 0.50% | 2.67% | 182 |
| Standard_D32_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 125.8 | 9,300 | 1.07% | 6.93% | 182 |
| Standard_D48_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 188.7 | 12,847 | 2.36% | 8.94% | 154 |
| Standard_D48_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 188.9 | 13,298 | 1.03% | 4.31% | 28 |
| Standard_D64_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 251.9 | 17,591 | 1.94% | 11.76% | 182 |


## H - High Performance Compute (HPC)
(10/14/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_H8 | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 8 | 1 | 54.9 | 3,240 | 0.31% | 1.60% | 84 |
| Standard_H8m | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 8 | 1 | 110.0 | 3,233 | 0.36% | 1.66% | 84 |
| Standard_H16 | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 16 | 2 | 110.1 | 6,165 | 2.00% | 8.31% | 42 |
| Standard_H16m | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 16 | 2 | 220.4 | 6,139 | 2.41% | 9.13% | 42 |
| Standard_H16mr | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 16 | 2 | 220.4 | 6,127 | 2.28% | 8.63% | 42 |
| Standard_H16r | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 16 | 2 | 110.1 | 6,152 | 2.28% | 8.75% | 42 |

## HBrsv2
(10/16/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_HB120rs_v2 | AMD EPYC 7V12 64-Core Processor | 120 | 30 | 448.8 | 45,369 | 3.11% | 8.34% | 21 |

## HBS - memory bandwidth (AMD EPYC)
(10/14/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_HB60rs | AMD EPYC 7551 32-Core Processor | 60 | 15 | 224.3 | 17,010 | 2.85% | 8.60% | 21 |

## HCS - dense computation (Intel Xeon Platinum 8168)
(10/14/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_HC44rs | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 44 | 2 | 346.4 | 17,155 | 2.61% | 10.42% | 21 |


## DSv2 - Storage Optimized
(09/30/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_DS1_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 3.4 | 329 | 4.55% | 13.51% | 35 |
| Standard_DS1_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 3.3 | 320 | 4.30% | 10.72% | 14 |
| Standard_DS1_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 3.3 | 343 | 4.64% | 15.69% | 56 |
| Standard_DS1_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 3.4 | 358 | 3.10% | 9.29% | 14 |
| Standard_DS1_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 3.4 | 343 | 8.85% | 32.36% | 84 |
| Standard_DS1_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 3.3 | 324 | 3.20% | 7.50% | 14 |
| Standard_DS1_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 3.4 | 383 | 0.11% | 0.40% | 14 |
| Standard_DS2_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 6.8 | 649 | 2.60% | 10.45% | 70 |
| Standard_DS2_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 6.8 | 686 | 6.15% | 25.58% | 84 |
| Standard_DS2_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 6.8 | 651 | 3.50% | 12.51% | 70 |
| Standard_DS2_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 6.8 | 771 | 0.09% | 0.21% | 7 |
| Standard_DS3_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 13.6 | 1,256 | 2.48% | 7.59% | 56 |
| Standard_DS3_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 13.7 | 1,278 | 0.92% | 3.10% | 14 |
| Standard_DS3_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 13.7 | 1,288 | 7.18% | 20.08% | 35 |
| Standard_DS3_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 13.6 | 1,318 | 3.41% | 12.32% | 35 |
| Standard_DS3_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 13.6 | 1,254 | 1.63% | 5.84% | 28 |
| Standard_DS3_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 13.7 | 1,247 | 1.72% | 6.87% | 63 |
| Standard_DS4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 27.4 | 2,531 | 0.86% | 3.25% | 49 |
| Standard_DS4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 27.4 | 2,543 | 2.18% | 9.75% | 98 |
| Standard_DS4_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 27.4 | 2,483 | 1.20% | 5.73% | 70 |
| Standard_DS4_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 27.4 | 2,012 | 50.61% | 99.42% | 14 |
| Standard_DS5_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 55.0 | 4,909 | 1.65% | 7.53% | 63 |
| Standard_DS5_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 54.9 | 5,130 | 0.50% | 2.28% | 70 |
| Standard_DS5_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 54.9 | 4,952 | 1.64% | 7.67% | 84 |
| Standard_DS5_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 54.9 | 5,951 | 0.59% | 2.09% | 14 |
| Standard_DS11_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 13.7 | 652 | 4.13% | 11.34% | 28 |
| Standard_DS11_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 13.6 | 639 | 1.94% | 5.15% | 21 |
| Standard_DS11_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 13.6 | 690 | 7.26% | 23.99% | 42 |
| Standard_DS11_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 13.7 | 696 | 9.51% | 35.78% | 28 |
| Standard_DS11_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 13.7 | 646 | 1.61% | 7.57% | 63 |
| Standard_DS11_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 13.6 | 675 | 3.28% | 8.96% | 21 |
| Standard_DS11_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 13.7 | 760 | 0.92% | 4.26% | 28 |
| Standard_DS11-1_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 13.7 | 343 | 4.56% | 12.06% | 28 |
| Standard_DS11-1_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 13.6 | 328 | 0.48% | 1.55% | 14 |
| Standard_DS11-1_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 13.6 | 364 | 9.47% | 26.85% | 35 |
| Standard_DS11-1_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 13.7 | 335 | 1.69% | 5.56% | 7 |
| Standard_DS11-1_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 13.6 | 312 | 1.37% | 4.44% | 42 |
| Standard_DS11-1_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 13.7 | 329 | 3.84% | 17.69% | 84 |
| Standard_DS11-1_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 13.7 | 399 | 6.16% | 13.22% | 21 |
| Standard_DS12_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 27.4 | 1,262 | 2.06% | 5.95% | 42 |
| Standard_DS12_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 27.4 | 1,318 | 7.66% | 26.86% | 77 |
| Standard_DS12_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 27.4 | 1,261 | 4.54% | 19.04% | 84 |
| Standard_DS12_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 27.4 | 1,499 | 1.20% | 4.45% | 28 |
| Standard_DS12-1_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 27.4 | 334 | 4.64% | 18.48% | 56 |
| Standard_DS12-1_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 27.4 | 380 | 7.84% | 27.81% | 77 |
| Standard_DS12-1_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 27.4 | 329 | 4.94% | 18.20% | 70 |
| Standard_DS12-1_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 27.4 | 383 | 0.14% | 0.76% | 28 |
| Standard_DS12-2_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 27.4 | 668 | 2.74% | 9.77% | 56 |
| Standard_DS12-2_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 27.4 | 715 | 9.54% | 27.42% | 91 |
| Standard_DS12-2_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 27.4 | 649 | 4.19% | 18.29% | 70 |
| Standard_DS12-2_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 27.4 | 763 | 1.83% | 7.12% | 14 |
| Standard_DS13_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 54.9 | 2,539 | 0.82% | 2.62% | 56 |
| Standard_DS13_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 54.9 | 2,538 | 1.11% | 4.95% | 70 |
| Standard_DS13_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 54.9 | 2,493 | 1.09% | 5.45% | 84 |
| Standard_DS13_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 54.9 | 2,976 | 0.44% | 1.50% | 21 |
| Standard_DS13-2_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 54.9 | 667 | 2.11% | 8.27% | 56 |
| Standard_DS13-2_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 54.9 | 688 | 6.25% | 19.87% | 84 |
| Standard_DS13-2_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 54.9 | 670 | 7.17% | 24.97% | 91 |
| Standard_DS13-4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 54.9 | 1,260 | 2.36% | 9.66% | 70 |
| Standard_DS13-4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 54.9 | 1,342 | 5.53% | 20.46% | 84 |
| Standard_DS13-4_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 54.9 | 1,292 | 5.85% | 28.08% | 63 |
| Standard_DS13-4_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 54.9 | 1,490 | 0.61% | 2.33% | 14 |
| Standard_DS14_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 110.2 | 4,921 | 1.57% | 7.33% | 42 |
| Standard_DS14_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 110.1 | 4,846 | 2.11% | 5.74% | 7 |
| Standard_DS14_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 110.1 | 5,139 | 0.34% | 1.19% | 35 |
| Standard_DS14_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 110.0 | 5,147 | 0.56% | 2.28% | 28 |
| Standard_DS14_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 110.1 | 4,926 | 1.24% | 5.16% | 56 |
| Standard_DS14_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 110.0 | 4,977 | 0.83% | 4.21% | 42 |
| Standard_DS14_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 110.1 | 5,957 | 0.45% | 1.99% | 21 |
| Standard_DS14-4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 2 | 110.1 | 1,207 | 3.19% | 12.00% | 28 |
| Standard_DS14-4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 2 | 110.2 | 1,274 | 1.74% | 6.87% | 14 |
| Standard_DS14-4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 110.0 | 1,464 | 6.58% | 17.26% | 28 |
| Standard_DS14-4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 110.1 | 1,354 | 6.36% | 14.51% | 28 |
| Standard_DS14-4_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 110.1 | 1,289 | 3.75% | 15.47% | 84 |
| Standard_DS14-4_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 110.0 | 1,314 | 3.13% | 9.28% | 28 |
| Standard_DS14-4_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 110.1 | 1,493 | 0.60% | 2.02% | 21 |
| Standard_DS14-8_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 2 | 110.1 | 2,445 | 3.57% | 9.48% | 14 |
| Standard_DS14-8_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 2 | 110.2 | 2,495 | 2.35% | 8.22% | 35 |
| Standard_DS14-8_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 110.0 | 2,587 | 2.16% | 6.89% | 42 |
| Standard_DS14-8_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 110.1 | 2,602 | 4.00% | 13.13% | 28 |
| Standard_DS14-8_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 110.1 | 2,516 | 1.63% | 6.92% | 63 |
| Standard_DS14-8_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 110.0 | 2,517 | 1.38% | 5.06% | 42 |
| Standard_DS14-8_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 110.1 | 2,964 | 0.44% | 1.26% | 7 |
| Standard_DS15_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 20 | 2 | 137.7 | 6,127 | 1.88% | 7.32% | 49 |
| Standard_DS15_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 137.5 | 7,262 | 13.36% | 80.97% | 154 |

## Dv2 - General Compute
(09/30/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D1_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 3.4 | 327 | 4.38% | 16.87% | 63 |
| Standard_D1_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 3.3 | 334 | 4.31% | 13.78% | 42 |
| Standard_D1_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 3.4 | 347 | 5.33% | 17.84% | 21 |
| Standard_D1_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 3.3 | 399 | 4.05% | 13.52% | 28 |
| Standard_D1_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 3.4 | 337 | 4.50% | 15.17% | 49 |
| Standard_D1_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 3.3 | 343 | 2.07% | 6.56% | 14 |
| Standard_D2_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 6.8 | 632 | 4.20% | 22.11% | 112 |
| Standard_D2_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 6.8 | 697 | 7.22% | 20.91% | 42 |
| Standard_D2_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 6.8 | 640 | 4.11% | 16.98% | 63 |
| Standard_D3_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 13.6 | 1,244 | 1.85% | 5.05% | 35 |
| Standard_D3_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 13.7 | 1,259 | 1.90% | 8.23% | 49 |
| Standard_D3_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 13.6 | 1,319 | 6.00% | 20.32% | 49 |
| Standard_D3_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 13.7 | 1,325 | 7.57% | 17.92% | 21 |
| Standard_D3_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 13.6 | 1,256 | 0.65% | 2.50% | 28 |
| Standard_D3_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 13.7 | 1,288 | 3.93% | 15.05% | 28 |
| Standard_D4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 27.4 | 2,435 | 13.67% | 47.01% | 70 |
| Standard_D4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 27.4 | 2,569 | 1.20% | 5.05% | 98 |
| Standard_D4_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 27.4 | 2,475 | 0.91% | 4.04% | 49 |
| Standard_D5_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 55.0 | 4,856 | 3.41% | 17.50% | 105 |
| Standard_D5_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 54.9 | 5,119 | 0.70% | 2.41% | 28 |
| Standard_D5_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 54.9 | 4,914 | 1.90% | 10.57% | 77 |
| Standard_D11_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 13.7 | 650 | 5.36% | 19.50% | 63 |
| Standard_D11_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 13.6 | 641 | 0.56% | 1.47% | 7 |
| Standard_D11_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 13.6 | 697 | 7.58% | 25.29% | 49 |
| Standard_D11_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 13.7 | 671 | 6.91% | 25.55% | 21 |
| Standard_D11_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 13.7 | 660 | 5.42% | 20.70% | 35 |
| Standard_D11_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 13.6 | 646 | 3.26% | 9.05% | 21 |
| Standard_D12_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 27.4 | 1,233 | 5.90% | 23.17% | 77 |
| Standard_D12_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 27.4 | 1,335 | 6.58% | 20.71% | 70 |
| Standard_D12_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 27.4 | 1,267 | 1.72% | 8.31% | 56 |
| Standard_D12_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 27.4 | 1,502 | 0.50% | 1.48% | 7 |
| Standard_D13_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 54.9 | 2,441 | 11.34% | 42.84% | 70 |
| Standard_D13_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 54.9 | 2,558 | 1.86% | 6.51% | 70 |
| Standard_D13_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 54.9 | 2,447 | 2.54% | 14.34% | 42 |
| Standard_D13_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 54.9 | 2,890 | 1.00% | 2.41% | 7 |
| Standard_D14_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 110.2 | 4,888 | 1.83% | 8.82% | 70 |
| Standard_D14_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 110.1 | 4,947 | 1.56% | 4.47% | 7 |
| Standard_D14_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 110.0 | 5,130 | 0.63% | 2.51% | 42 |
| Standard_D14_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 110.1 | 5,110 | 0.48% | 1.67% | 21 |
| Standard_D14_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 110.1 | 4,928 | 1.55% | 5.75% | 35 |
| Standard_D14_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 110.0 | 4,988 | 0.47% | 1.68% | 14 |
| Standard_D15_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 20 | 2 | 137.7 | 6,108 | 1.70% | 6.73% | 35 |
| Standard_D15_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 137.5 | 7,215 | 13.87% | 82.45% | 154 |

## Esv3 - Memory Optimized + Premium Storage
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 15.6 | 466 | 7.91% | 33.80% | 105 |
| Standard_E2s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 15.6 | 461 | 3.69% | 34.98% | 98 |
| Standard_E2s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 15.6 | 540 | 0.04% | 0.15% | 21 |
| Standard_E4s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 31.4 | 888 | 5.38% | 17.16% | 42 |
| Standard_E4s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 31.3 | 892 | 7.17% | 31.07% | 63 |
| Standard_E4s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 31.4 | 846 | 4.64% | 18.75% | 63 |
| Standard_E4s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 31.3 | 865 | 5.09% | 17.56% | 35 |
| Standard_E4s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 31.4 | 1,000 | 0.49% | 1.72% | 35 |
| Standard_E4-2s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 31.4 | 436 | 6.35% | 21.03% | 35 |
| Standard_E4-2s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 31.3 | 467 | 7.05% | 22.88% | 70 |
| Standard_E4-2s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 31.3 | 445 | 3.38% | 14.28% | 28 |
| Standard_E4-2s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 31.4 | 462 | 2.07% | 6.88% | 56 |
| Standard_E4-2s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 31.4 | 541 | 0.05% | 0.26% | 42 |
| Standard_E8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 62.8 | 1,754 | 7.36% | 30.06% | 126 |
| Standard_E8s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 62.8 | 1,750 | 1.95% | 8.54% | 77 |
| Standard_E8s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 62.8 | 2,070 | 0.69% | 3.85% | 35 |
| Standard_E8-2s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 62.8 | 454 | 6.33% | 28.89% | 140 |
| Standard_E8-2s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 62.8 | 469 | 4.29% | 12.54% | 56 |
| Standard_E8-2s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 62.8 | 540 | 0.12% | 0.47% | 42 |
| Standard_E8-4s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 62.8 | 909 | 7.03% | 24.29% | 119 |
| Standard_E8-4s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 62.8 | 854 | 5.40% | 24.06% | 77 |
| Standard_E8-4s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 62.8 | 998 | 0.65% | 3.02% | 42 |
| Standard_E16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 125.8 | 3,375 | 2.73% | 12.86% | 126 |
| Standard_E16s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 125.8 | 3,443 | 1.04% | 5.66% | 77 |
| Standard_E16s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 125.8 | 4,142 | 0.41% | 1.86% | 28 |
| Standard_E16-4s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 125.8 | 947 | 6.98% | 25.92% | 140 |
| Standard_E16-4s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 125.8 | 877 | 6.68% | 26.47% | 77 |
| Standard_E16-4s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 125.8 | 1,000 | 0.53% | 1.58% | 21 |
| Standard_E16-8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 125.8 | 1,782 | 6.07% | 24.25% | 133 |
| Standard_E16-8s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 125.8 | 1,775 | 2.90% | 9.57% | 63 |
| Standard_E16-8s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 125.8 | 2,072 | 0.80% | 3.53% | 35 |
| Standard_E20s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 20 | 1 | 157.2 | 4,229 | 0.60% | 2.54% | 112 |
| Standard_E20s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 20 | 1 | 157.2 | 4,297 | 0.83% | 3.95% | 98 |
| Standard_E20s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 157.2 | 5,176 | 0.63% | 2.46% | 28 |
| Standard_E32s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 2 | 251.9 | 6,535 | 1.78% | 8.34% | 126 |
| Standard_E32s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 1 | 251.7 | 6,846 | 0.62% | 2.90% | 84 |
| Standard_E32s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 251.7 | 8,237 | 1.02% | 3.61% | 28 |
| Standard_E32-8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 2 | 251.9 | 1,824 | 5.53% | 22.71% | 98 |
| Standard_E32-8s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 251.7 | 1,785 | 2.51% | 11.46% | 105 |
| Standard_E32-8s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 251.7 | 2,071 | 0.49% | 2.38% | 28 |
| Standard_E32-16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 2 | 251.9 | 3,444 | 3.79% | 18.50% | 119 |
| Standard_E32-16s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 251.7 | 3,483 | 1.54% | 6.84% | 77 |
| Standard_E32-16s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 251.7 | 4,142 | 0.47% | 1.90% | 42 |
| Standard_E48s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 48 | 2 | 377.9 | 9,840 | 0.75% | 3.48% | 98 |
| Standard_E48s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 48 | 2 | 377.9 | 9,970 | 1.01% | 4.75% | 105 |
| Standard_E48s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 377.9 | 11,860 | 0.98% | 3.88% | 35 |
| Standard_E64s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 64 | 2 | 425.1 | 13,157 | 0.73% | 2.75% | 42 |
| Standard_E64s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 64 | 2 | 425.1 | 13,286 | 0.97% | 4.76% | 161 |
| Standard_E64s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 425.1 | 15,748 | 1.02% | 3.49% | 21 |
| Standard_E64-16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 2 | 425.2 | 4,041 | 1.01% | 4.63% | 42 |
| Standard_E64-16s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 2 | 425.2 | 3,648 | 3.59% | 15.44% | 105 |
| Standard_E64-16s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 2 | 425.1 | 3,657 | 3.94% | 15.54% | 56 |
| Standard_E64-16s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 2 | 425.2 | 4,010 | 1.31% | 4.20% | 28 |
| Standard_E64-32s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 2 | 425.2 | 7,090 | 1.09% | 4.39% | 56 |
| Standard_E64-32s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 2 | 425.1 | 6,816 | 1.15% | 5.11% | 63 |
| Standard_E64-32s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 2 | 425.2 | 6,813 | 1.44% | 7.45% | 98 |
| Standard_E64-32s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 425.2 | 8,013 | 1.48% | 5.68% | 21 |

## Ev3 - Memory Optimized
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 15.6 | 476 | 8.06% | 32.83% | 133 |
| Standard_E2_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 15.6 | 474 | 6.90% | 23.64% | 84 |
| Standard_E4_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 31.3 | 907 | 7.73% | 30.64% | 98 |
| Standard_E4_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 31.4 | 874 | 5.05% | 20.78% | 77 |
| Standard_E4_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 31.4 | 841 | 2.21% | 8.67% | 35 |
| Standard_E4_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 31.3 | 818 | 2.41% | 7.39% | 28 |
| Standard_E8_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 62.8 | 1,738 | 5.63% | 29.03% | 154 |
| Standard_E8_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 62.8 | 1,732 | 1.38% | 6.20% | 84 |
| Standard_E16_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 125.8 | 3,382 | 2.34% | 12.72% | 189 |
| Standard_E16_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 125.8 | 3,448 | 0.77% | 3.29% | 42 |
| Standard_E16_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 125.8 | 4,142 | 0.28% | 0.67% | 7 |
| Standard_E20_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 20 | 1 | 157.2 | 4,204 | 1.08% | 7.37% | 196 |
| Standard_E20_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 20 | 1 | 157.2 | 4,227 | 2.56% | 7.91% | 35 |
| Standard_E20_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 157.2 | 5,184 | 0.22% | 0.60% | 7 |
| Standard_E32_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 2 | 251.9 | 6,501 | 1.97% | 11.15% | 147 |
| Standard_E32_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 1 | 251.7 | 6,786 | 1.34% | 7.03% | 70 |
| Standard_E32_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 251.7 | 8,263 | 0.47% | 1.71% | 14 |
| Standard_E48_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 48 | 2 | 377.9 | 9,818 | 0.91% | 4.13% | 147 |
| Standard_E48_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 48 | 2 | 377.9 | 9,961 | 1.12% | 4.92% | 77 |
| Standard_E48_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 377.9 | 11,857 | 1.16% | 4.15% | 14 |
| Standard_E64_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 64 | 2 | 425.1 | 13,131 | 0.78% | 2.94% | 63 |
| Standard_E64_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 64 | 2 | 425.1 | 13,195 | 1.46% | 8.36% | 161 |
| Standard_E64_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 425.1 | 15,747 | 1.34% | 4.90% | 14 |

## Easv4
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2as_v4 | AMD EPYC 7452 32-Core Processor | 2 | 1 | 15.6 | 659 | 1.32% | 7.66% | 154 |
| Standard_E2as_v4 | AMD EPYC 7452 32-Core Processor | 2 | 1 | 15.6 | 656 | 0.69% | 3.15% | 105 |
| Standard_E4as_v4 | AMD EPYC 7452 32-Core Processor | 4 | 1 | 31.4 | 1,232 | 2.14% | 11.28% | 154 |
| Standard_E4as_v4 | AMD EPYC 7452 32-Core Processor | 4 | 1 | 31.4 | 1,234 | 0.99% | 4.62% | 105 |
| Standard_E8as_v4 | AMD EPYC 7452 32-Core Processor | 8 | 1 | 62.8 | 2,602 | 2.58% | 14.40% | 154 |
| Standard_E8as_v4 | AMD EPYC 7452 32-Core Processor | 8 | 1 | 62.8 | 2,614 | 1.00% | 4.85% | 105 |
| Standard_E16as_v4 | AMD EPYC 7452 32-Core Processor | 16 | 2 | 125.9 | 5,059 | 2.19% | 9.45% | 175 |
| Standard_E16as_v4 | AMD EPYC 7452 32-Core Processor | 16 | 2 | 125.9 | 5,058 | 2.69% | 8.10% | 21 |
| Standard_E16as_v4 | AMD EPYC 7452 32-Core Processor | 16 | 2 | 125.9 | 5,045 | 2.01% | 9.13% | 84 |
| Standard_E20as_v4 | AMD EPYC 7452 32-Core Processor | 20 | 3 | 157.4 | 6,264 | 2.48% | 9.16% | 175 |
| Standard_E20as_v4 | AMD EPYC 7452 32-Core Processor | 20 | 3 | 157.4 | 6,289 | 2.13% | 8.64% | 63 |
| Standard_E20as_v4 | AMD EPYC 7452 32-Core Processor | 20 | 3 | 157.4 | 6,223 | 2.41% | 7.92% | 42 |
| Standard_E32as_v4 | AMD EPYC 7452 32-Core Processor | 32 | 4 | 251.9 | 9,824 | 2.51% | 11.33% | 189 |
| Standard_E32as_v4 | AMD EPYC 7452 32-Core Processor | 32 | 4 | 251.9 | 9,843 | 2.43% | 9.26% | 105 |
| Standard_E48as_v4 | AMD EPYC 7452 32-Core Processor | 48 | 6 | 377.9 | 14,476 | 2.48% | 9.71% | 203 |
| Standard_E48as_v4 | AMD EPYC 7452 32-Core Processor | 48 | 6 | 377.9 | 14,578 | 2.78% | 9.22% | 98 |
| Standard_E64as_v4 | AMD EPYC 7452 32-Core Processor | 64 | 8 | 503.9 | 19,297 | 2.48% | 6.46% | 14 |
| Standard_E64as_v4 | AMD EPYC 7452 32-Core Processor | 64 | 8 | 503.9 | 18,915 | 2.38% | 7.20% | 14 |
| Standard_E96as_v4 | AMD EPYC 7452 32-Core Processor | 96 | 12 | 661.4 | 27,252 | 1.73% | 4.68% | 28 |
| Standard_E96as_v4 | AMD EPYC 7452 32-Core Processor | 96 | 12 | 661.4 | 27,134 | 1.70% | 4.64% | 14 |

## Eav4
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2a_v4 | AMD EPYC 7452 32-Core Processor | 2 | 1 | 15.6 | 656 | 2.37% | 15.39% | 196 |
| Standard_E4a_v4 | AMD EPYC 7452 32-Core Processor | 4 | 1 | 31.4 | 1,230 | 1.33% | 7.91% | 196 |
| Standard_E8a_v4 | AMD EPYC 7452 32-Core Processor | 8 | 1 | 62.8 | 2,612 | 1.28% | 8.43% | 189 |
| Standard_E16a_v4 | AMD EPYC 7452 32-Core Processor | 16 | 2 | 125.9 | 5,046 | 2.47% | 13.06% | 196 |
| Standard_E20a_v4 | AMD EPYC 7452 32-Core Processor | 20 | 3 | 157.4 | 6,239 | 2.58% | 10.03% | 196 |
| Standard_E32a_v4 | AMD EPYC 7452 32-Core Processor | 32 | 4 | 251.9 | 9,838 | 2.53% | 10.24% | 196 |
| Standard_E48a_v4 | AMD EPYC 7452 32-Core Processor | 48 | 6 | 377.9 | 14,507 | 3.11% | 26.41% | 196 |
| Standard_E64a_v4 | AMD EPYC 7452 32-Core Processor | 64 | 8 | 503.9 | 19,257 | 2.56% | 5.85% | 14 |
| Standard_E96a_v4 | AMD EPYC 7452 32-Core Processor | 96 | 12 | 661.4 | 27,452 | 2.04% | 4.99% | 14 |

## EDSv4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 15.6 | 620 | 1.87% | 6.75% | 189 |
| Standard_E4ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 31.4 | 1,135 | 0.79% | 4.38% | 182 |
| Standard_E4-2ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 31.4 | 614 | 0.88% | 5.36% | 189 |
| Standard_E8ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 62.8 | 2,338 | 0.53% | 3.00% | 189 |
| Standard_E8-2ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 62.8 | 618 | 1.48% | 7.13% | 189 |
| Standard_E8-4ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 62.8 | 1,138 | 1.18% | 7.10% | 189 |
| Standard_E16ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 125.8 | 4,675 | 0.59% | 3.74% | 189 |
| Standard_E16-4ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 125.8 | 1,146 | 1.89% | 8.06% | 182 |
| Standard_E16-4ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 125.8 | 1,131 | 0.85% | 1.91% | 7 |
| Standard_E16-8ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 125.8 | 2,344 | 0.79% | 5.49% | 189 |
| Standard_E20ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 157.2 | 5,845 | 0.44% | 3.03% | 189 |
| Standard_E32ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 251.7 | 9,292 | 1.24% | 5.70% | 168 |
| Standard_E32ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 251.9 | 9,091 | 2.20% | 6.35% | 21 |
| Standard_E32-8ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 251.7 | 2,352 | 0.85% | 4.61% | 147 |
| Standard_E32-8ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 2 | 251.9 | 2,358 | 1.55% | 7.44% | 42 |
| Standard_E32-16ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 251.7 | 4,677 | 0.50% | 2.39% | 154 |
| Standard_E32-16ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 2 | 251.9 | 4,640 | 1.61% | 5.80% | 28 |
| Standard_E48ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 377.9 | 13,370 | 1.34% | 6.99% | 189 |
| Standard_E64ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 496.0 | 17,710 | 1.25% | 5.54% | 182 |
| Standard_E64-16ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 2 | 496.0 | 4,603 | 1.57% | 6.96% | 189 |
| Standard_E64-32ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 496.0 | 8,986 | 1.28% | 6.11% | 182 |

## EDv4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 15.6 | 619 | 1.36% | 6.52% | 189 |
| Standard_E4d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 31.4 | 1,136 | 1.19% | 6.67% | 189 |
| Standard_E8d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 62.8 | 2,345 | 0.88% | 5.45% | 189 |
| Standard_E16d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 125.8 | 4,676 | 0.53% | 2.51% | 182 |
| Standard_E20d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 157.2 | 5,835 | 0.87% | 6.20% | 189 |
| Standard_E32d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 251.7 | 9,301 | 1.03% | 6.02% | 161 |
| Standard_E32d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 251.9 | 9,135 | 2.52% | 7.09% | 28 |
| Standard_E48d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 377.9 | 13,322 | 1.52% | 7.72% | 189 |
| Standard_E64d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 496.0 | 17,682 | 1.36% | 5.70% | 189 |

## Esv4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 15.6 | 616 | 1.37% | 6.75% | 175 |
| Standard_E4s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 31.4 | 1,137 | 1.06% | 6.33% | 182 |
| Standard_E4-2s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 31.4 | 619 | 1.67% | 6.68% | 182 |
| Standard_E8s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 62.8 | 2,346 | 0.88% | 4.17% | 182 |
| Standard_E8-2s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 62.8 | 617 | 1.13% | 4.23% | 182 |
| Standard_E8-4s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 62.8 | 1,136 | 0.81% | 5.41% | 182 |
| Standard_E16s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 125.8 | 4,672 | 0.55% | 3.42% | 182 |
| Standard_E16-4s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 125.8 | 1,143 | 1.52% | 7.09% | 182 |
| Standard_E16-8s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 125.8 | 2,345 | 0.84% | 4.64% | 182 |
| Standard_E20s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 157.2 | 5,847 | 0.50% | 2.35% | 182 |
| Standard_E32s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 251.7 | 9,326 | 0.63% | 4.13% | 154 |
| Standard_E32s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 251.9 | 9,191 | 2.01% | 5.63% | 28 |
| Standard_E32-8s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 251.7 | 2,346 | 0.78% | 3.20% | 140 |
| Standard_E32-8s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 2 | 251.9 | 2,361 | 2.44% | 12.58% | 35 |
| Standard_E32-16s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 251.7 | 4,682 | 0.49% | 2.28% | 147 |
| Standard_E32-16s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 2 | 251.9 | 4,559 | 1.96% | 6.72% | 35 |
| Standard_E48s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 377.9 | 13,346 | 1.28% | 6.82% | 182 |
| Standard_E64s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 496.0 | 17,667 | 1.34% | 6.17% | 182 |
| Standard_E64-16s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 2 | 496.0 | 4,603 | 1.48% | 7.45% | 182 |
| Standard_E64-32s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 496.0 | 8,989 | 1.35% | 6.16% | 182 |

## Ev4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 15.6 | 617 | 1.18% | 6.05% | 182 |
| Standard_E4_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 31.4 | 1,133 | 0.74% | 3.82% | 175 |
| Standard_E8_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 62.8 | 2,339 | 0.62% | 4.04% | 182 |
| Standard_E16_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 125.8 | 4,665 | 0.95% | 7.25% | 182 |
| Standard_E20_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 157.2 | 5,830 | 1.31% | 9.31% | 175 |
| Standard_E32_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 251.7 | 9,328 | 0.42% | 2.19% | 154 |
| Standard_E32_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 251.9 | 8,970 | 1.25% | 4.89% | 28 |
| Standard_E48_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 377.9 | 13,347 | 1.32% | 5.47% | 175 |
| Standard_E64_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 496.0 | 17,683 | 1.34% | 6.38% | 182 |

## Msv2 - Memory Optimized
(10/05/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_M24s_v2 | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 24 | 1 | 251.7 | 6,773 | 1.05% | 4.99% | 84 |
| Standard_M24ms_v2 | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 24 | 1 | 503.7 | 6,777 | 1.13% | 5.25% | 84 |
| Standard_M48s_v2 | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 48 | 1 | 503.7 | 13,329 | 0.67% | 3.61% | 84 |
| Standard_M48ms_v2 | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 48 | 1 | 1,007.5 | 13,202 | 1.34% | 5.14% | 77 |
| Standard_M48ms_v2 | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 48 | 2 | 1,007.9 | 12,759 | 1.02% | 2.50% | 7 |
| Standard_M96s_v2 | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 96 | 2 | 1,007.9 | 24,321 | 1.58% | 6.93% | 84 |
| Standard_M96ms_v2 | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 96 | 2 | 2,015.9 | 24,206 | 1.56% | 6.20% | 49 |
| Standard_M96ms_v2 | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 96 | 4 | 2,015.9 | 24,472 | 1.49% | 5.98% | 35 |
| Standard_M192s_v2 | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 192 | 4 | 2,015.9 | 48,711 | 1.53% | 6.36% | 84 |
| Standard_M208s_v2 | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 208 | 4 | 2,805.3 | 52,082 | 1.83% | 7.44% | 84 |
| Standard_M208ms_v2 | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 208 | 4 | 5,610.8 | 51,881 | 1.96% | 8.16% | 42 |
| Standard_M208ms_v2 | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 208 | 8 | 5,610.8 | 53,331 | 1.08% | 3.41% | 42 |
| Standard_M416s_v2 | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 416 | 8 | 5,610.8 | 102,746 | 1.58% | 6.77% | 84 |
| Standard_M416-208s_v2 | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 208 | 4 | 5,610.8 | 51,599 | 1.76% | 4.65% | 14 |
| Standard_M416-208s_v2 | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 208 | 8 | 5,610.8 | 53,194 | 1.19% | 4.25% | 70 |
| Standard_M416ms_v2 | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 416 | 8 | 11,221.7 | 101,901 | 1.71% | 8.11% | 84 |
| Standard_M416-208ms_v2 | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 208 | 8 | 11,221.7 | 52,843 | 1.32% | 4.48% | 77 |

## Msv2 Small - Memory Optimized
(10/05/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_M192ms_v2 | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 192 | 4 | 4,031.9 | 48,187 | 1.59% | 7.49% | 84 |

## M - Memory Optimized
(09/29/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg ACU | StdDev% | Var % | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_M64 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,007.9 | 14,148 | 1.47% | 6.19% | 49 |
| Standard_M64 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,007.9 | 14,200 | 1.10% | 4.22% | 28 |
| Standard_M64 | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 1,007.9 | 13,003 | 0.75% | 2.36% | 7 |
| Standard_M64m | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,763.9 | 14,023 | 1.04% | 4.05% | 35 |
| Standard_M64m | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,763.9 | 14,210 | 0.81% | 2.52% | 21 |
| Standard_M64m | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 1,763.9 | 12,994 | 1.41% | 4.85% | 21 |
| Standard_M64m | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 1,763.9 | 13,082 | 1.33% | 3.30% | 7 |
| Standard_M128 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 2,015.9 | 28,342 | 1.06% | 4.42% | 49 |
| Standard_M128 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 2,015.9 | 28,338 | 1.16% | 3.89% | 21 |
| Standard_M128 | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 128 | 4 | 2,015.9 | 25,456 | 1.15% | 2.94% | 7 |
| Standard_M128 | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 128 | 4 | 2,015.9 | 25,435 | 1.13% | 2.71% | 7 |
| Standard_M128m | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 3,831.1 | 28,103 | 1.22% | 5.07% | 42 |
| Standard_M128m | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 3,831.0 | 28,161 | 0.93% | 4.02% | 28 |
| Standard_M128m | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 128 | 4 | 3,831.1 | 25,376 | 1.20% | 3.67% | 14 |
| Standard_M8ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 8 | 1 | 215.0 | 1,903 | 0.30% | 1.31% | 56 |
| Standard_M8ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 8 | 1 | 215.0 | 1,902 | 0.38% | 2.19% | 28 |
| Standard_M8-2ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 2 | 1 | 215.0 | 484 | 0.11% | 0.35% | 56 |
| Standard_M8-2ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 2 | 1 | 215.0 | 483 | 0.15% | 0.56% | 28 |
| Standard_M8-4ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 4 | 1 | 215.0 | 970 | 0.59% | 2.06% | 49 |
| Standard_M8-4ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 4 | 1 | 215.0 | 968 | 0.65% | 2.19% | 28 |
| Standard_M8-4ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 4 | 1 | 215.1 | 834 | 0.58% | 1.51% | 7 |
| Standard_M16ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 16 | 1 | 430.4 | 3,800 | 0.21% | 0.98% | 42 |
| Standard_M16ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 16 | 1 | 430.3 | 3,797 | 0.22% | 0.95% | 28 |
| Standard_M16ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 16 | 1 | 430.4 | 3,458 | 0.44% | 1.55% | 14 |
| Standard_M16-4ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 4 | 1 | 430.4 | 969 | 0.55% | 1.85% | 42 |
| Standard_M16-4ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 4 | 1 | 430.3 | 969 | 0.53% | 1.83% | 28 |
| Standard_M16-4ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 4 | 1 | 430.4 | 834 | 0.42% | 1.44% | 14 |
| Standard_M16-8ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 8 | 1 | 430.4 | 1,904 | 0.33% | 1.23% | 35 |
| Standard_M16-8ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 8 | 1 | 430.3 | 1,903 | 0.37% | 1.71% | 21 |
| Standard_M16-8ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 8 | 1 | 430.4 | 1,732 | 0.42% | 1.25% | 21 |
| Standard_M16-8ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 8 | 1 | 430.4 | 1,726 | 0.40% | 1.13% | 7 |
| Standard_M32ls | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 1 | 251.7 | 7,446 | 0.94% | 3.41% | 42 |
| Standard_M32ls | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 1 | 251.7 | 7,502 | 0.91% | 3.20% | 28 |
| Standard_M32ls | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 32 | 1 | 251.7 | 6,901 | 0.40% | 1.59% | 14 |
| Standard_M32ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 1 | 860.8 | 7,495 | 0.63% | 2.84% | 42 |
| Standard_M32ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 1 | 860.8 | 7,502 | 0.53% | 1.79% | 28 |
| Standard_M32ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 32 | 1 | 860.9 | 6,907 | 0.40% | 1.21% | 14 |
| Standard_M32-8ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 8 | 1 | 860.8 | 1,904 | 0.32% | 1.62% | 35 |
| Standard_M32-8ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 8 | 1 | 860.8 | 1,903 | 0.30% | 1.22% | 21 |
| Standard_M32-8ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 8 | 1 | 860.9 | 1,735 | 0.68% | 2.96% | 21 |
| Standard_M32-8ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 8 | 1 | 860.9 | 1,729 | 0.46% | 1.34% | 7 |
| Standard_M32-16ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 16 | 1 | 860.8 | 3,802 | 0.27% | 0.92% | 42 |
| Standard_M32-16ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 16 | 1 | 860.8 | 3,801 | 0.24% | 1.09% | 28 |
| Standard_M32-16ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 16 | 1 | 860.9 | 3,457 | 0.36% | 1.40% | 14 |
| Standard_M32ts | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 1 | 188.7 | 7,516 | 0.37% | 1.76% | 49 |
| Standard_M32ts | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 1 | 188.7 | 7,509 | 0.66% | 2.44% | 28 |
| Standard_M32ts | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 32 | 1 | 188.7 | 6,893 | 0.32% | 0.89% | 7 |
| Standard_M64s | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,007.9 | 14,181 | 0.92% | 4.32% | 49 |
| Standard_M64s | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,007.9 | 14,166 | 0.82% | 2.96% | 21 |
| Standard_M64s | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 1,007.9 | 12,982 | 1.44% | 4.14% | 7 |
| Standard_M64s | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 1,007.9 | 12,905 | 1.20% | 3.46% | 7 |
| Standard_M64ls | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 503.9 | 14,118 | 1.79% | 7.73% | 56 |
| Standard_M64ls | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 503.9 | 14,216 | 1.09% | 3.75% | 21 |
| Standard_M64ls | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 503.9 | 13,099 | 1.01% | 2.29% | 7 |
| Standard_M64ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,763.9 | 14,175 | 0.86% | 3.42% | 49 |
| Standard_M64ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,763.9 | 14,250 | 0.97% | 4.09% | 21 |
| Standard_M64ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 1,763.9 | 13,061 | 1.38% | 3.13% | 7 |
| Standard_M64ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 1,763.9 | 12,992 | 1.11% | 3.23% | 7 |
| Standard_M64-16ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 16 | 2 | 1,763.9 | 3,642 | 1.34% | 6.19% | 49 |
| Standard_M64-16ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 16 | 2 | 1,763.9 | 3,628 | 1.24% | 4.17% | 28 |
| Standard_M64-16ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 16 | 2 | 1,763.9 | 3,306 | 1.83% | 4.96% | 7 |
| Standard_M64-32ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 2 | 1,763.9 | 7,185 | 0.93% | 3.89% | 35 |
| Standard_M64-32ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 2 | 1,763.9 | 7,192 | 0.89% | 3.42% | 28 |
| Standard_M64-32ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 3 | 1,763.9 | 7,203 | 1.15% | 3.28% | 7 |
| Standard_M64-32ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 32 | 2 | 1,763.9 | 6,600 | 0.93% | 3.56% | 14 |
| Standard_M128s | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 2,015.9 | 28,285 | 1.02% | 4.64% | 49 |
| Standard_M128s | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 2,015.9 | 28,322 | 1.02% | 3.96% | 21 |
| Standard_M128s | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 128 | 4 | 2,015.9 | 25,493 | 1.02% | 3.23% | 7 |
| Standard_M128s | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 128 | 4 | 2,015.9 | 25,447 | 1.17% | 3.44% | 7 |
| Standard_M128ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 3,831.1 | 28,371 | 1.06% | 4.93% | 42 |
| Standard_M128ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 3,831.0 | 28,357 | 1.12% | 4.29% | 21 |
| Standard_M128ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 128 | 4 | 3,831.1 | 25,551 | 1.22% | 3.30% | 14 |
| Standard_M128ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 128 | 4 | 3,831.1 | 25,414 | 0.98% | 2.80% | 7 |
| Standard_M128-32ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 4 | 3,831.1 | 7,141 | 1.03% | 4.65% | 42 |
| Standard_M128-32ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 4 | 3,831.0 | 7,161 | 1.34% | 4.14% | 21 |
| Standard_M128-32ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 32 | 4 | 3,831.1 | 6,560 | 1.50% | 4.74% | 14 |
| Standard_M128-32ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 32 | 4 | 3,831.1 | 6,567 | 1.57% | 3.84% | 7 |
| Standard_M128-64ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 4 | 3,831.1 | 14,098 | 0.97% | 4.36% | 35 |
| Standard_M128-64ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 4 | 3,831.0 | 14,089 | 1.16% | 4.49% | 21 |
| Standard_M128-64ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 4 | 3,831.1 | 12,950 | 1.11% | 4.35% | 21 |
| Standard_M128-64ms | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 4 | 3,831.1 | 12,861 | 1.12% | 2.88% | 7 |



## About CoreMark

Linux numbers were computed by running [CoreMark](https://www.eembc.org/coremark/faq.php) on Ubuntu 18.04. CoreMark was configured with the number of threads set to the number of virtual CPUs, and concurrency set to `PThreads`. The target number of iterations was adjusted based on expected performance to provide a runtime of at least 20 seconds (typically much longer). The final score represents the number of iterations completed divided by the number of seconds it took to run the test. Each test was run at least seven times on each VM. Test run dates shown above. Tests run on multiple VMs across Azure public regions the VM was supported in on the
date run. Basic A and B (Burstable) series not shown because performance is variable. N series not shown as they are GPU centric and Coremark doesn't measure GPU performance.

## Next steps
* For storage capacities, disk details, and additional considerations for choosing among VM sizes, see [Sizes for virtual machines](../sizes.md).
* To run the CoreMark scripts on Linux VMs, download the [CoreMark script pack](https://download.microsoft.com/download/3/0/5/305A3707-4D3A-4599-9670-AAEB423B4663/AzureCoreMarkScriptPack.zip).