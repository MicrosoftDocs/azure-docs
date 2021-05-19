---
title: Compute benchmark scores for Azure Windows VMs 
description: Compare SPECint compute benchmark scores for Azure VMs running Windows Server.
author: cynthn
ms.service: virtual-machines
ms.subservice: benchmark
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 04/08/2021
ms.author: cynthn
ms.reviewer: davberg

---
# Compute benchmark scores for Windows VMs
The following CoreMark benchmark scores show compute performance for select Azure VMs running Windows Server 2019. Compute benchmark scores are also available for [Linux VMs](../linux/compute-benchmark-scores.md).

| Type | Families |
| ---- | -------- |
| [Compute optimized](#compute-optimized) | [Fsv2](#fsv2---compute--premium-storage)  |
| [General purpose](#general-purpose) | [Dsv3](#dsv3---general-compute--premium-storage) [Dv3](#dv3---general-compute) [Dasv4](#dasv4) [Dav4](#dav4) [Ddsv4](#ddsv4) [Ddv4](#ddv4) [Dsv4](#dsv4) [Dv4](#dv4)  |
| [Memory optimized](#memory-optimized) | [Esv3](#esv3---memory-optimized--premium-storage) [Ev3](#ev3---memory-optimized) [Easv4](#easv4) [Eav4](#eav4) [Edsv4](#edsv4) [Edv4](#edv4) [Esv4](#esv4) [Ev4](#ev4)  |

## Compute optimized
### Fsv2 - Compute + Premium Storage
(03/29/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_F2s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 2 | 1 | 4.0 | 34,903 | 1,101 | 3.15% | 112 |
| Standard_F2s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 4.0 | 34,738 | 1,331 | 3.83% | 224 |
| Standard_F4s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 4 | 1 | 8.0 | 66,828 | 1,524 | 2.28% | 168 |
| Standard_F4s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 8.0 | 66,903 | 1,047 | 1.57% | 182 |
| Standard_F8s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 8 | 1 | 16.0 | 131,477 | 2,180 | 1.66% | 140 |
| Standard_F8s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 16.0 | 132,533 | 1,732 | 1.31% | 210 |
| Standard_F16s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 16 | 1 | 32.0 | 260,760 | 3,629 | 1.39% | 112 |
| Standard_F16s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 32.0 | 265,158 | 2,185 | 0.82% | 182 |
| Standard_F32s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 32 | 1 | 64.0 | 525,608 | 6,270 | 1.19% | 98 |
| Standard_F32s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 64.0 | 530,137 | 6,085 | 1.15% | 140 |
| Standard_F48s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 48 | 2 | 96.0 | 769,768 | 7,567 | 0.98% | 112 |
| Standard_F48s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 96.0 | 742,828 | 17,316 | 2.33% | 112 |
| Standard_F64s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 64 | 2 | 128.0 | 1,030,552 | 8,106 | 0.79% | 70 |
| Standard_F64s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 128.0 | 1,028,052 | 9,373 | 0.91% | 168 |
| Standard_F72s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 72 | 2 | 144.0 | 561,588 | 8,677 | 1.55% | 84 |
| Standard_F72s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 72 | 2 | 144.0 | 561,997 | 9,731 | 1.73% | 98 |

## General purpose
### DSv3 - General Compute + Premium Storage
(04/05/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 8.0 | 23,534 | 724 | 3.08% | 42 |
| Standard_D2s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 8.0 | 24,742 | 2,045 | 8.27% | 112 |
| Standard_D2s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 8.0 | 24,822 | 3,702 | 14.91% | 126 |
| Standard_D2s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 8.0 | 30,392 | 1,514 | 4.98% | 28 |
| Standard_D4s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 16.0 | 44,404 | 537 | 1.21% | 28 |
| Standard_D4s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 16.0 | 45,725 | 4,388 | 9.60% | 154 |
| Standard_D4s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 16.0 | 46,590 | 3,963 | 8.51% | 112 |
| Standard_D4s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 16.0 | 50,797 | 306 | 0.60% | 28 |
| Standard_D8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 32.0 | 89,102 | 849 | 0.95% | 56 |
| Standard_D8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 32.0 | 89,422 | 6,441 | 7.20% | 154 |
| Standard_D8s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 32.0 | 85,673 | 2,704 | 3.16% | 112 |
| Standard_D8s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 32.0 | 101,753 | 1,013 | 1.00% | 14 |
| Standard_D16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 1 | 64.0 | 179,390 | 1,403 | 0.78% | 42 |
| Standard_D16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 64.0 | 173,313 | 14,382 | 8.30% | 98 |
| Standard_D16s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 64.0 | 171,750 | 1,261 | 0.73% | 70 |
| Standard_D16s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 64.0 | 204,568 | 2,434 | 1.19% | 14 |
| Standard_D32s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 32 | 2 | 128.0 | 358,426 | 6,880 | 1.92% | 56 |
| Standard_D32s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 1 | 128.0 | 364,032 | 20,351 | 5.59% | 84 |
| Standard_D32s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 1 | 128.0 | 346,172 | 2,859 | 0.83% | 84 |

### Dv3 - General Compute
(04/05/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 8.0 | 23,795 | 1,893 | 7.96% | 70 |
| Standard_D2_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 8.0 | 24,582 | 2,036 | 8.28% | 154 |
| Standard_D2_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 8.0 | 24,376 | 1,915 | 7.86% | 84 |
| Standard_D4_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 16.0 | 45,883 | 3,929 | 8.56% | 70 |
| Standard_D4_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 16.0 | 46,836 | 5,296 | 11.31% | 140 |
| Standard_D4_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 16.0 | 46,281 | 4,133 | 8.93% | 112 |
| Standard_D8_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 32.0 | 88,815 | 1,091 | 1.23% | 126 |
| Standard_D8_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 32.0 | 89,625 | 6,366 | 7.10% | 112 |
| Standard_D8_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 32.0 | 87,549 | 3,215 | 3.67% | 98 |
| Standard_D32_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 32 | 2 | 128.0 | 353,069 | 3,792 | 1.07% | 70 |
| Standard_D32_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 1 | 128.0 | 358,984 | 19,517 | 5.44% | 126 |
| Standard_D32_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 1 | 128.0 | 356,479 | 16,176 | 4.54% | 126 |

### Dasv4
(03/25/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2as_v4 | AMD EPYC 7452 32-Core Processor                 | 2 | 1 | 8.0 | 37,986 | 1,199 | 3.16% | 238 |
| Standard_D4as_v4 | AMD EPYC 7452 32-Core Processor                 | 4 | 1 | 16.0 | 75,828 | 1,343 | 1.77% | 196 |
| Standard_D8as_v4 | AMD EPYC 7452 32-Core Processor                 | 8 | 1 | 32.0 | 150,134 | 2,511 | 1.67% | 210 |
| Standard_D16as_v4 | AMD EPYC 7452 32-Core Processor                 | 16 | 2 | 64.0 | 286,789 | 5,984 | 2.09% | 224 |
| Standard_D32as_v4 | AMD EPYC 7452 32-Core Processor                 | 32 | 4 | 128.0 | 566,270 | 8,484 | 1.50% | 140 |
| Standard_D48as_v4 | AMD EPYC 7452 32-Core Processor                 | 48 | 6 | 192.0 | 829,547 | 15,679 | 1.89% | 126 |
| Standard_D64as_v4 | AMD EPYC 7452 32-Core Processor                 | 64 | 8 | 256.0 | 1,088,030 | 16,708 | 1.54% | 28 |
| Standard_D96as_v4 | AMD EPYC 7452 32-Core Processor                 | 96 | 12 | 384.0 | 751,849 | 6,836 | 0.91% | 14 |

### Dav4
(03/25/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2a_v4 | AMD EPYC 7452 32-Core Processor                 | 2 | 1 | 8.0 | 38,028 | 995 | 2.62% | 238 |
| Standard_D4a_v4 | AMD EPYC 7452 32-Core Processor                 | 4 | 1 | 16.0 | 75,058 | 1,874 | 2.50% | 238 |
| Standard_D8a_v4 | AMD EPYC 7452 32-Core Processor                 | 8 | 1 | 32.0 | 149,706 | 2,520 | 1.68% | 168 |
| Standard_D16a_v4 | AMD EPYC 7452 32-Core Processor                 | 16 | 2 | 64.0 | 287,479 | 4,907 | 1.71% | 238 |
| Standard_D32a_v4 | AMD EPYC 7452 32-Core Processor                 | 32 | 4 | 128.0 | 567,019 | 11,019 | 1.94% | 210 |
| Standard_D48a_v4 | AMD EPYC 7452 32-Core Processor                 | 48 | 6 | 192.0 | 835,617 | 13,097 | 1.57% | 140 |
| Standard_D64a_v4 | AMD EPYC 7452 32-Core Processor                 | 64 | 8 | 256.0 | 1,099,165 | 21,962 | 2.00% | 252 |
| Standard_D96a_v4 | AMD EPYC 7452 32-Core Processor                 | 96 | 12 | 384.0 | 749,340 | 8,728 | 1.16% | 126 |

### DDSv4
(03/26/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 8.0 | 34,621 | 1,588 | 4.59% | 336 |
| Standard_D4ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 16.0 | 66,583 | 2,327 | 3.49% | 336 |
| Standard_D8ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 32.0 | 131,888 | 3,913 | 2.97% | 336 |
| Standard_D16ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 64.0 | 262,436 | 9,177 | 3.50% | 336 |
| Standard_D32ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 128.0 | 531,747 | 5,956 | 1.12% | 322 |
| Standard_D48ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 192.0 | 750,843 | 15,060 | 2.01% | 420 |
| Standard_D48ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 192.0 | 753,948 | 31,559 | 4.19% | 252 |

### DDv4
(03/26/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 8.0 | 34,704 | 1,455 | 4.19% | 336 |
| Standard_D4d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 16.0 | 66,629 | 2,005 | 3.01% | 336 |
| Standard_D8d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 32.0 | 131,953 | 3,911 | 2.96% | 336 |
| Standard_D16d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 64.0 | 263,568 | 7,317 | 2.78% | 336 |
| Standard_D32d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 128.0 | 527,571 | 11,076 | 2.10% | 336 |
| Standard_D48d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 192.0 | 742,908 | 19,323 | 2.60% | 378 |
| Standard_D48d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 192.0 | 759,921 | 18,783 | 2.47% | 280 |

### Dsv4
(03/24/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 8.0 | 31,643 | 3,054 | 9.65% | 406 |
| Standard_D4s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 16.0 | 60,878 | 4,594 | 7.55% | 392 |
| Standard_D8s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 32.0 | 119,076 | 7,683 | 6.45% | 406 |
| Standard_D16s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 64.0 | 242,206 | 16,772 | 6.92% | 406 |
| Standard_D32s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 128.0 | 483,021 | 28,105 | 5.82% | 392 |
| Standard_D48s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 192.0 | 694,366 | 33,144 | 4.77% | 280 |
| Standard_D48s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 192.0 | 705,192 | 24,651 | 3.50% | 126 |
| Standard_D64s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 256.0 | 1,023,014 | 17,746 | 1.73% | 364 |

### Dv4
(03/25/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 8.0 | 31,469 | 2,948 | 9.37% | 406 |
| Standard_D4_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 16.0 | 61,806 | 4,467 | 7.23% | 406 |
| Standard_D8_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 32.0 | 120,421 | 8,407 | 6.98% | 392 |
| Standard_D16_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 64.0 | 245,522 | 17,151 | 6.99% | 812 |
| Standard_D32_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 128.0 | 487,165 | 28,119 | 5.77% | 378 |
| Standard_D48_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 192.0 | 688,018 | 24,945 | 3.63% | 252 |
| Standard_D48_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 192.0 | 696,691 | 30,283 | 4.35% | 112 |
| Standard_D64_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 256.0 | 1,018,300 | 23,085 | 2.27% | 392 |

## Memory optimized
### Esv3 - Memory Optimized + Premium Storage
(04/05/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 16.0 | 23,704 | 2,155 | 9.09% | 168 |
| Standard_E2s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 16.0 | 21,917 | 1,521 | 6.94% | 112 |
| Standard_E2s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 16.0 | 28,549 | 3,105 | 10.88% | 42 |
| Standard_E4s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 32.0 | 46,370 | 4,256 | 9.18% | 140 |
| Standard_E4s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 32.0 | 47,178 | 3,791 | 8.04% | 98 |
| Standard_E4s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 32.0 | 53,636 | 4,231 | 7.89% | 84 |
| Standard_E16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 128.0 | 175,905 | 7,275 | 4.14% | 196 |
| Standard_E16s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 128.0 | 176,579 | 9,650 | 5.47% | 112 |
| Standard_E16s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 128.0 | 206,776 | 19,901 | 9.62% | 28 |
| Standard_E20s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 20 | 1 | 160.0 | 219,370 | 7,086 | 3.23% | 224 |
| Standard_E20s_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 20 | 1 | 160.0 | 224,353 | 11,954 | 5.33% | 98 |
| Standard_E20s_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 160.0 | 280,572 | 13,326 | 4.75% | 28 |

### Ev3 - Memory Optimized
(04/05/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 16.0 | 23,304 | 2,074 | 8.90% | 182 |
| Standard_E2_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 16.0 | 24,513 | 2,428 | 9.90% | 112 |
| Standard_E2_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 16.0 | 26,171 | 153 | 0.58% | 14 |
| Standard_E4_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 32.0 | 46,224 | 3,713 | 8.03% | 238 |
| Standard_E4_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 32.0 | 49,200 | 3,457 | 7.03% | 42 |
| Standard_E4_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 32.0 | 53,476 | 4,219 | 7.89% | 42 |
| Standard_E8_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 64.0 | 90,915 | 7,711 | 8.48% | 224 |
| Standard_E8_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 64.0 | 89,968 | 5,738 | 6.38% | 84 |
| Standard_E16_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 128.0 | 174,677 | 7,198 | 4.12% | 210 |
| Standard_E16_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 128.0 | 180,002 | 14,028 | 7.79% | 98 |
| Standard_E16_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 128.0 | 217,439 | 13,826 | 6.36% | 28 |
| Standard_E20_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 20 | 1 | 160.0 | 221,787 | 10,447 | 4.71% | 238 |
| Standard_E20_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 20 | 1 | 160.0 | 234,854 | 10,704 | 4.56% | 70 |
| Standard_E20_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 160.0 | 293,226 | 3,480 | 1.19% | 14 |
| Standard_E32_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 2 | 256.0 | 349,134 | 13,895 | 3.98% | 210 |
| Standard_E32_v3 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 1 | 256.0 | 352,509 | 14,689 | 4.17% | 84 |
| Standard_E32_v3 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 256.0 | 413,946 | 2,239 | 0.54% | 14 |

### Easv4
(03/26/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2as_v4 | AMD EPYC 7452 32-Core Processor                 | 2 | 1 | 16.0 | 38,070 | 1,150 | 3.02% | 210 |
| Standard_E4as_v4 | AMD EPYC 7452 32-Core Processor                 | 4 | 1 | 32.0 | 75,733 | 1,444 | 1.91% | 196 |
| Standard_E4-2as_v4 | AMD EPYC 7452 32-Core Processor                 | 2 | 1 | 32.0 | 38,105 | 943 | 2.47% | 168 |
| Standard_E8as_v4 | AMD EPYC 7452 32-Core Processor                 | 8 | 1 | 64.0 | 149,522 | 2,333 | 1.56% | 210 |
| Standard_E8-2as_v4 | AMD EPYC 7452 32-Core Processor                 | 2 | 1 | 64.0 | 38,103 | 1,078 | 2.83% | 168 |
| Standard_E8-4as_v4 | AMD EPYC 7452 32-Core Processor                 | 4 | 1 | 64.0 | 76,060 | 1,132 | 1.49% | 168 |
| Standard_E16as_v4 | AMD EPYC 7452 32-Core Processor                 | 16 | 2 | 128.0 | 288,136 | 4,720 | 1.64% | 210 |
| Standard_E16-4as_v4 | AMD EPYC 7452 32-Core Processor                 | 4 | 2 | 128.0 | 73,038 | 2,310 | 3.16% | 196 |
| Standard_E16-8as_v4 | AMD EPYC 7452 32-Core Processor                 | 8 | 2 | 128.0 | 144,266 | 2,782 | 1.93% | 168 |
| Standard_E20as_v4 | AMD EPYC 7452 32-Core Processor                 | 20 | 3 | 160.0 | 346,277 | 7,387 | 2.13% | 14 |
| Standard_E20as_v4 | AMD EPYC 7452 32-Core Processor                 | 20 | 5 | 160.0 | 351,213 | 7,002 | 1.99% | 196 |
| Standard_E32as_v4 | AMD EPYC 7452 32-Core Processor                 | 32 | 4 | 256.0 | 561,950 | 7,679 | 1.37% | 42 |
| Standard_E32-8as_v4 | AMD EPYC 7452 32-Core Processor                 | 8 | 4 | 256.0 | 143,569 | 3,393 | 2.36% | 182 |
| Standard_E32-16as_v4 | AMD EPYC 7452 32-Core Processor                 | 16 | 4 | 256.0 | 283,614 | 5,018 | 1.77% | 182 |
| Standard_E48as_v4 | AMD EPYC 7452 32-Core Processor                 | 48 | 6 | 384.0 | 832,627 | 19,565 | 2.35% | 210 |
| Standard_E64as_v4 | AMD EPYC 7452 32-Core Processor                 | 64 | 8 | 512.0 | 1,097,588 | 26,100 | 2.38% | 280 |
| Standard_E64-16as_v4 | AMD EPYC 7452 32-Core Processor                 | 16 | 8 | 512.0 | 284,934 | 5,065 | 1.78% | 154 |
| Standard_E64-32as_v4 | AMD EPYC 7452 32-Core Processor                 | 32 | 8 | 512.0 | 561,951 | 9,691 | 1.72% | 140 |
| Standard_E96as_v4 | AMD EPYC 7452 32-Core Processor                 | 96 | 12 | 672.0 | 750,338 | 9,645 | 1.29% | 182 |
| Standard_E96-24as_v4 | AMD EPYC 7452 32-Core Processor                 | 24 | 11 | 672.0 | 423,442 | 8,504 | 2.01% | 182 |
| Standard_E96-48as_v4 | AMD EPYC 7452 32-Core Processor                 | 48 | 11 | 672.0 | 839,993 | 14,218 | 1.69% | 70 |

### Eav4
(03/27/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2a_v4 | AMD EPYC 7452 32-Core Processor                 | 2 | 1 | 16.0 | 38,008 | 995 | 2.62% | 210 |
| Standard_E4a_v4 | AMD EPYC 7452 32-Core Processor                 | 4 | 1 | 32.0 | 75,410 | 1,431 | 1.90% | 196 |
| Standard_E8a_v4 | AMD EPYC 7452 32-Core Processor                 | 8 | 1 | 64.0 | 148,810 | 2,630 | 1.77% | 210 |
| Standard_E16a_v4 | AMD EPYC 7452 32-Core Processor                 | 16 | 2 | 128.0 | 286,811 | 4,877 | 1.70% | 182 |
| Standard_E20a_v4 | AMD EPYC 7452 32-Core Processor                 | 20 | 3 | 160.0 | 351,049 | 6,268 | 1.79% | 210 |
| Standard_E32a_v4 | AMD EPYC 7452 32-Core Processor                 | 32 | 4 | 256.0 | 565,363 | 10,941 | 1.94% | 126 |
| Standard_E48a_v4 | AMD EPYC 7452 32-Core Processor                 | 48 | 6 | 384.0 | 837,493 | 15,803 | 1.89% | 126 |
| Standard_E64a_v4 | AMD EPYC 7452 32-Core Processor                 | 64 | 8 | 512.0 | 1,097,111 | 30,290 | 2.76% | 336 |
| Standard_E96a_v4 | AMD EPYC 7452 32-Core Processor                 | 96 | 12 | 672.0 | 749,908 | 8,646 | 1.15% | 196 |

### EDSv4
(03/27/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 16.0 | 34,923 | 1,107 | 3.17% | 336 |
| Standard_E4ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 32.0 | 66,921 | 1,294 | 1.93% | 322 |
| Standard_E4-2ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 32.0 | 34,909 | 811 | 2.32% | 294 |
| Standard_E8ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 64.0 | 132,164 | 2,102 | 1.59% | 154 |
| Standard_E8-2ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 64.0 | 35,031 | 965 | 2.76% | 252 |
| Standard_E8-4ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 64.0 | 67,144 | 1,200 | 1.79% | 182 |
| Standard_E16ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 128.0 | 265,181 | 2,634 | 0.99% | 336 |
| Standard_E16-4ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 128.0 | 67,155 | 1,596 | 2.38% | 336 |
| Standard_E16-8ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 128.0 | 132,939 | 1,471 | 1.11% | 336 |
| Standard_E20ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 160.0 | 331,456 | 2,766 | 0.83% | 336 |
| Standard_E32ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 256.0 | 531,560 | 5,700 | 1.07% | 196 |
| Standard_E32ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 256.0 | 512,931 | 5,110 | 1.00% | 14 |
| Standard_E32-8ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 256.0 | 132,929 | 1,671 | 1.26% | 182 |
| Standard_E32-16ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 256.0 | 265,471 | 2,268 | 0.85% | 154 |
| Standard_E48ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 384.0 | 768,428 | 6,891 | 0.90% | 224 |
| Standard_E64ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 504.0 | 1,005,554 | 78,398 | 7.80% | 140 |
| Standard_E64-16ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 2 | 504.0 | 260,677 | 3,340 | 1.28% | 154 |
| Standard_E64-32ds_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 504.0 | 514,504 | 4,082 | 0.79% | 98 |

### Edsv4 Isolated Extended
(04/05/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E80ids_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 80 | 2 | 504.0 | 622,608 | 10,276 | 1.65% | 336 |

### EDv4
(03/26/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 16.0 | 34,916 | 1,063 | 3.04% | 322 |
| Standard_E4d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 32.0 | 66,889 | 1,283 | 1.92% | 336 |
| Standard_E8d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 64.0 | 132,382 | 2,020 | 1.53% | 322 |
| Standard_E16d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 128.0 | 265,094 | 2,803 | 1.06% | 336 |
| Standard_E20d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 160.0 | 331,516 | 2,568 | 0.77% | 336 |
| Standard_E32d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 256.0 | 530,364 | 9,914 | 1.87% | 336 |
| Standard_E48d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 384.0 | 761,410 | 21,640 | 2.84% | 336 |
| Standard_E64d_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 504.0 | 1,030,708 | 9,500 | 0.92% | 322 |

### EIASv4
(04/05/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E96ias_v4 | AMD EPYC 7452 32-Core Processor                 | 96 | 12 | 672.0 | 749,545 | 8,690 | 1.16% | 28 |

### Esv4
(03/25/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 16.0 | 31,390 | 2,786 | 8.88% | 336 |
| Standard_E4s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 32.0 | 59,677 | 3,904 | 6.54% | 336 |
| Standard_E4-2s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 32.0 | 31,443 | 2,480 | 7.89% | 364 |
| Standard_E8s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 64.0 | 117,898 | 7,464 | 6.33% | 406 |
| Standard_E8-2s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 64.0 | 30,989 | 2,864 | 9.24% | 406 |
| Standard_E8-4s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 64.0 | 59,589 | 4,762 | 7.99% | 406 |
| Standard_E16s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 128.0 | 236,972 | 13,376 | 5.64% | 406 |
| Standard_E16-4s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 128.0 | 60,316 | 4,792 | 7.94% | 406 |
| Standard_E16-8s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 128.0 | 117,057 | 6,569 | 5.61% | 392 |
| Standard_E20s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 160.0 | 294,231 | 15,477 | 5.26% | 406 |
| Standard_E32s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 256.0 | 481,943 | 22,707 | 4.71% | 266 |
| Standard_E32-8s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 256.0 | 116,774 | 6,791 | 5.82% | 224 |
| Standard_E32-16s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 256.0 | 235,620 | 11,909 | 5.05% | 266 |
| Standard_E32-16s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 2 | 256.0 | 222,478 | 3,411 | 1.53% | 14 |
| Standard_E48s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 384.0 | 693,841 | 23,265 | 3.35% | 182 |
| Standard_E64s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 504.0 | 922,196 | 7,708 | 0.84% | 182 |
| Standard_E64-16s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 2 | 504.0 | 224,499 | 3,955 | 1.76% | 168 |
| Standard_E64-32s_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 504.0 | 441,521 | 30,939 | 7.01% | 168 |

### Esv4 Isolated Extended
(04/05/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E80is_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 80 | 2 | 504.0 | 623,225 | 9,806 | 1.57% | 322 |

### Ev4
(03/25/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 16.0 | 30,825 | 2,765 | 8.97% | 406 |
| Standard_E4_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 32.0 | 60,495 | 4,419 | 7.30% | 406 |
| Standard_E8_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 64.0 | 119,562 | 8,628 | 7.22% | 406 |
| Standard_E16_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 128.0 | 237,126 | 13,328 | 5.62% | 392 |
| Standard_E20_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 160.0 | 299,681 | 17,288 | 5.77% | 406 |
| Standard_E32_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 256.0 | 486,051 | 28,085 | 5.78% | 378 |
| Standard_E48_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 384.0 | 686,812 | 20,561 | 2.99% | 378 |
| Standard_E64_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 504.0 | 919,491 | 15,261 | 1.66% | 378 |


## About CoreMark

[CoreMark](https://www.eembc.org/coremark/faq.php) is a benchmark that tests the functionality of a microctronoller (MCU) or central processing unit (CPU). CoreMark is not system dependent, so it functions the same regardless of the platform (e.g. big or little endian, high-end or low-end processor). 

Windows numbers were computed by running CoreMark on Windows Server 2019. CoreMark was configured with the number of threads set to the number of virtual CPUs, and concurrency set to `PThreads`. The target number of iterations was adjusted based on expected performance to provide a runtime of at least 20 seconds (typically much longer). The final score represents the number of iterations completed divided by the number of seconds it took to run the test. Each test was run at least seven times on each VM. Test run dates shown above. Tests run on multiple VMs across Azure public regions the VM was supported in on the date run. 

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

## Next steps
* For storage capacities, disk details, and additional considerations for choosing among VM sizes, see [Sizes for virtual machines](../sizes.md).
