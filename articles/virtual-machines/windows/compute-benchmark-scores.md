---
title: Compute benchmark scores for Azure Windows VMs 
description: Compare Coremark compute benchmark scores for Azure VMs running Windows Server.
author:: DavidBerg-MSFT
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 05/31/2022
ms.author: davberg
ms.reviewer: ladolan

---
# Compute benchmark scores for Windows VMs

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets

The following CoreMark benchmark scores show compute performance for select Azure VMs running Windows Server 2019. Compute benchmark scores are also available for [Linux VMs](../linux/compute-benchmark-scores.md).

| Type | Families |
| ---- | -------- |
| [Compute optimized](#compute-optimized) | [Fsv2](#fsv2---compute--premium-storage), [Fs](#fs---compute-optimized--premium-storage), [F](#f---compute-optimized), [GS](#gs---compute-optimized--premium-storage), [G](#g---compute-optimized) |
| [General purpose](#general-purpose) |  [B](#b---burstable), [Dasv4](#dasv4), [Dav4](#dav4), [Ddsv4](#ddsv4), [Ddv4](#ddv4), [Dsv4](#dsv4), [Dv4](#dv4), [Dsv3](#dsv3---general-compute--premium-storage), [Dv3](#dv3---general-compute), [DSv2](#dsv2---general-purpose--premium-storage), [Dv2](#dv2---general-compute),  [Av2](#av2---general-compute) |
| [High performance compute](#high-performance-compute) | [HB](#hbs---memory-bandwidth-amd-epyc), [HC](#hcs---dense-computation-intel-xeon-platinum-8168)  |
| [Memory optimized](#memory-optimized) | [Easv4](#easv4), [Eav4](#eav4), [Edsv4](#edsv4), [Edv4](#edv4), [Esv4](#esv4), [Ev4](#ev4), [Esv3](#esv3---memory-optimized--premium-storage), [Ev3](#ev3---memory-optimized),  [DSv2](#dsv2---memory-optimized--premium-storage), [Dv2](#dv2---general-compute)  |
| [Storage optimized](#storage-optimized) | [Lsv2](#lsv2---storage-optimized), [Ls](#ls---storage-optimized--premium-storage) |

## Compute optimized

### Fsv2 - Compute + Premium Storage
(03/29/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_F2s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70 GHz | 2 | 1 | 4.0 | 34,903 | 1,101 | 3.15% | 112 |
| Standard_F2s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 2 | 1 | 4.0 | 34,738 | 1,331 | 3.83% | 224 |
| Standard_F4s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70 GHz | 4 | 1 | 8.0 | 66,828 | 1,524 | 2.28% | 168 |
| Standard_F4s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 4 | 1 | 8.0 | 66,903 | 1,047 | 1.57% | 182 |
| Standard_F8s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70 GHz | 8 | 1 | 16.0 | 131,477 | 2,180 | 1.66% | 140 |
| Standard_F8s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 8 | 1 | 16.0 | 132,533 | 1,732 | 1.31% | 210 |
| Standard_F16s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70 GHz | 16 | 1 | 32.0 | 260,760 | 3,629 | 1.39% | 112 |
| Standard_F16s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 16 | 1 | 32.0 | 265,158 | 2,185 | 0.82% | 182 |
| Standard_F32s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70 GHz | 32 | 1 | 64.0 | 525,608 | 6,270 | 1.19% | 98 |
| Standard_F32s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 32 | 1 | 64.0 | 530,137 | 6,085 | 1.15% | 140 |
| Standard_F48s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70 GHz | 48 | 2 | 96.0 | 769,768 | 7,567 | 0.98% | 112 |
| Standard_F48s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 48 | 1 | 96.0 | 742,828 | 17,316 | 2.33% | 112 |
| Standard_F64s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70 GHz | 64 | 2 | 128.0 | 1,030,552 | 8,106 | 0.79% | 70 |
| Standard_F64s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 64 | 2 | 128.0 | 1,028,052 | 9,373 | 0.91% | 168 |
| Standard_F72s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70 GHz | 72 | 2 | 144.0 | N/A | - | - | - |
| Standard_F72s_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 72 | 2 | 144.0 | N/A | - | - | - |


### Fs - Compute Optimized + Premium Storage
(04/28/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_F1s | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40 GHz | 1 | 1 | 2.0 | 16,445 | 825 | 5.02% | 42 |
| Standard_F1s | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30 GHz | 1 | 1 | 2.0 | 17,614 | 2,873 | 16.31% | 210 |
| Standard_F1s | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60 GHz | 1 | 1 | 2.0 | 16,053 | 1,802 | 11.22% | 70 |
| Standard_F1s | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 1 | 1 | 2.0 | 20,007 | 1,684 | 8.42% | 28 |
| Standard_F2s | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40 GHz | 2 | 1 | 4.0 | 33,451 | 3,424 | 10.24% | 70 |
| Standard_F2s | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30 GHz | 2 | 1 | 4.0 | 33,626 | 2,990 | 8.89% | 154 |
| Standard_F2s | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60 GHz | 2 | 1 | 4.0 | 34,386 | 3,851 | 11.20% | 98 |
| Standard_F2s | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 2 | 1 | 4.0 | 36,826 | 344 | 0.94% | 28 |
| Standard_F4s | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40 GHz | 4 | 1 | 8.0 | 67,351 | 4,407 | 6.54% | 42 |
| Standard_F4s | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30 GHz | 4 | 1 | 8.0 | 67,009 | 4,637 | 6.92% | 196 |
| Standard_F4s | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60 GHz | 4 | 1 | 8.0 | 63,668 | 3,375 | 5.30% | 84 |
| Standard_F4s | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 4 | 1 | 8.0 | 79,153 | 15,034 | 18.99% | 28 |
| Standard_F8s | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40 GHz | 8 | 1 | 16.0 | 128,232 | 1,272 | 0.99% | 42 |
| Standard_F8s | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30 GHz | 8 | 1 | 16.0 | 127,871 | 5,109 | 4.00% | 154 |
| Standard_F8s | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60 GHz | 8 | 1 | 16.0 | 122,811 | 5,481 | 4.46% | 126 |
| Standard_F8s | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 8 | 1 | 16.0 | 154,842 | 10,354 | 6.69% | 28 |
| Standard_F16s | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40 GHz | 16 | 2 | 32.0 | 260,883 | 15,853 | 6.08% | 42 |
| Standard_F16s | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30 GHz | 16 | 1 | 32.0 | 255,762 | 4,966 | 1.94% | 182 |
| Standard_F16s | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60 GHz | 16 | 1 | 32.0 | 248,884 | 11,035 | 4.43% | 70 |
| Standard_F16s | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 16 | 1 | 32.0 | 310,303 | 21,942 | 7.07% | 28 |

### F - Compute Optimized
(04/28/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_F1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40 GHz | 1 | 1 | 2.0 | 17,356 | 1,151 | 6.63% | 112 |
| Standard_F1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30 GHz | 1 | 1 | 2.0 | 16,508 | 1,740 | 10.54% | 154 |
| Standard_F1 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60 GHz | 1 | 1 | 2.0 | 16,076 | 2,065 | 12.84% | 70 |
| Standard_F1 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 1 | 1 | 2.0 | 20,074 | 1,612 | 8.03% | 14 |
| Standard_F2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40 GHz | 2 | 1 | 4.0 | 32,770 | 1,915 | 5.84% | 126 |
| Standard_F2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30 GHz | 2 | 1 | 4.0 | 33,081 | 2,242 | 6.78% | 126 |
| Standard_F2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60 GHz | 2 | 1 | 4.0 | 33,310 | 2,532 | 7.60% | 84 |
| Standard_F2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 2 | 1 | 4.0 | 40,746 | 2,027 | 4.98% | 14 |
| Standard_F4 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40 GHz | 4 | 1 | 8.0 | 65,694 | 3,512 | 5.35% | 126 |
| Standard_F4 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30 GHz | 4 | 1 | 8.0 | 65,054 | 3,457 | 5.31% | 154 |
| Standard_F4 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60 GHz | 4 | 1 | 8.0 | 61,607 | 3,662 | 5.94% | 56 |
| Standard_F4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 4 | 1 | 8.0 | 76,884 | 1,763 | 2.29% | 14 |
| Standard_F8 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40 GHz | 8 | 1 | 16.0 | 130,415 | 5,353 | 4.10% | 98 |
| Standard_F8 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30 GHz | 8 | 1 | 16.0 | 126,139 | 2,917 | 2.31% | 126 |
| Standard_F8 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60 GHz | 8 | 1 | 16.0 | 122,443 | 4,391 | 3.59% | 98 |
| Standard_F8 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 8 | 1 | 16.0 | 144,696 | 2,172 | 1.50% | 14 |
| Standard_F16 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40 GHz | 16 | 2 | 32.0 | 253,473 | 8,597 | 3.39% | 140 |
| Standard_F16 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30 GHz | 16 | 1 | 32.0 | 257,457 | 7,596 | 2.95% | 126 |
| Standard_F16 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60 GHz | 16 | 1 | 32.0 | 244,559 | 8,036 | 3.29% | 70 |
| Standard_F16 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 16 | 1 | 32.0 | 283,565 | 8,683 | 3.06% | 14 |

### GS - Compute Optimized + Premium Storage
(05/27/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_GS1 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00 GHz | 2 | 1 | 28.0 | 35,593 | 2,888 | 8.11% | 252 |
| Standard_GS2 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00 GHz | 4 | 1 | 56.0 | 72,188 | 5,949 | 8.24% | 252 |
| Standard_GS3 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00 GHz | 8 | 1 | 112.0 | 132,665 | 6,910 | 5.21% | 238 |
| Standard_GS4 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00 GHz | 16 | 1 | 224.0 | 261,542 | 3,722 | 1.42% | 252 |
| Standard_GS4-4 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00 GHz | 4 | 1 | 224.0 | 79,352 | 4,935 | 6.22% | 224 |
| Standard_GS4-8 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00 GHz | 8 | 1 | 224.0 | 137,774 | 6,887 | 5.00% | 238 |
| Standard_GS5 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.0 0GHz | 32 | 2 | 448.0 | 507,026 | 6,895 | 1.36% | 252 |
| Standard_GS5-8 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00 GHz | 8 | 2 | 448.0 | 157,541 | 3,151 | 2.00% | 238 |
| Standard_GS5-16 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00 GHz | 16 | 2 | 448.0 | 278,656 | 5,235 | 1.88% | 224 |

### G - Compute Optimized
(05/27/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_G1 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00 GHz | 2 | 1 | 28.0 | 36,386 | 4,100 | 11.27% | 252 |
| Standard_G2 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00 GHz | 4 | 1 | 56.0 | 72,484 | 5,563 | 7.67% | 252 |
| Standard_G3 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00 GHz | 8 | 1 | 112.0 | 136,618 | 5,714 | 4.18% | 252 |
| Standard_G4 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00 GHz | 16 | 1 | 224.0 | 261,708 | 3,426 | 1.31% | 238 |
| Standard_G5 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00 GHz | 32 | 2 | 448.0 | 507,423 | 7,261 | 1.43% | 252 |

## General purpose

### B - Burstable
(04/12/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_B1ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40 GHz | 1 | 1 | 2.0 | 18,093 | 679 | 3.75% | 42 |
| Standard_B1ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30 GHz | 1 | 1 | 2.0 | 18,197 | 1,341 | 7.37% | 168 |
| Standard_B1ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60 GHz | 1 | 1 | 2.0 | 17,975 | 920 | 5.12% | 112 |
| Standard_B1ms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 1 | 1 | 2.0 | 20,176 | 1,568 | 7.77% | 28 |
| Standard_B2s | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40 GHz | 2 | 1 | 4.0 | 35,546 | 660 | 1.86% | 42 |
| Standard_B2s | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30 GHz | 2 | 1 | 4.0 | 36,569 | 2,172 | 5.94% | 154 |
| Standard_B2s | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60 GHz | 2 | 1 | 4.0 | 36,136 | 924 | 2.56% | 140 |
| Standard_B2s | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 2 | 1 | 4.0 | 42,546 | 834 | 1.96% | 14 |
| Standard_B2hms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40 GHz | 2 | 1 | 8.0 | 36,949 | 1,494 | 4.04% | 28 |
| Standard_B2hms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30 GHz | 2 | 1 | 8.0 | 36,512 | 2,537 | 6.95% | 70 |
| Standard_B2hms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60 GHz | 2 | 1 | 8.0 | 36,389 | 990 | 2.72% | 56 |
| Standard_B2ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40 GHz | 2 | 1 | 8.0 | 35,758 | 1,028 | 2.88% | 42 |
| Standard_B2ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30 GHz | 2 | 1 | 8.0 | 36,028 | 1,605 | 4.45% | 182 |
| Standard_B2ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60 GHz | 2 | 1 | 8.0 | 36,122 | 2,128 | 5.89% | 112 |
| Standard_B2ms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 2 | 1 | 8.0 | 42,525 | 672 | 1.58% | 14 |
| Standard_B4hms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40 GHz | 4 | 1 | 16.0 | 71,028 | 879 | 1.24% | 28 |
| Standard_B4hms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30 GHz | 4 | 1 | 16.0 | 73,126 | 2,954 | 4.04% | 56 |
| Standard_B4hms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60 GHz | 4 | 1 | 16.0 | 68,451 | 1,571 | 2.29% | 56 |
| Standard_B4hms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 4 | 1 | 16.0 | 83,525 | 563 | 0.67% | 14 |
| Standard_B4ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40 GHz | 4 | 1 | 16.0 | 70,831 | 1,135 | 1.60% | 28 |
| Standard_B4ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30 GHz | 4 | 1 | 16.0 | 70,987 | 2,287 | 3.22% | 168 |
| Standard_B4ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60 GHz | 4 | 1 | 16.0 | 68,796 | 1,897 | 2.76% | 84 |
| Standard_B4ms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 4 | 1 | 16.0 | 81,712 | 4,042 | 4.95% | 70 |
| Standard_B8ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40 GHz | 8 | 1 | 32.0 | 141,620 | 2,256 | 1.59% | 42 |
| Standard_B8ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30 GHz | 8 | 1 | 32.0 | 139,090 | 3,229 | 2.32% | 182 |
| Standard_B8ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60 GHz | 8 | 1 | 32.0 | 135,510 | 2,653 | 1.96% | 112 |
| Standard_B8ms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 8 | 1 | 32.0 | 164,510 | 2,254 | 1.37% | 14 |
| Standard_B12ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40 GHz | 12 | 1 | 48.0 | 206,957 | 5,240 | 2.53% | 56 |
| Standard_B12ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30 GHz | 12 | 1 | 48.0 | 211,461 | 4,115 | 1.95% | 154 |
| Standard_B12ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60 GHz | 12 | 1 | 48.0 | 200,729 | 3,475 | 1.73% | 140 |
| Standard_B16ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40 GHz | 16 | 2 | 64.0 | 273,257 | 3,862 | 1.41% | 42 |
| Standard_B16ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30 GHz | 16 | 1 | 64.0 | 282,187 | 5,030 | 1.78% | 154 |
| Standard_B16ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60 GHz | 16 | 1 | 64.0 | 265,834 | 5,545 | 2.09% | 112 |
| Standard_B16ms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 16 | 1 | 64.0 | 331,694 | 3,537 | 1.07% | 28 |
| Standard_B20ms | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40 GHz | 20 | 2 | 80.0 | 334,369 | 8,555 | 2.56% | 42 |
| Standard_B20ms | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30 GHz | 20 | 1 | 80.0 | 345,686 | 6,702 | 1.94% | 154 |
| Standard_B20ms | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60 GHz | 20 | 1 | 80.0 | 328,900 | 7,625 | 2.32% | 126 |
| Standard_B20ms | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60 GHz | 20 | 1 | 80.0 | 409,515 | 4,792 | 1.17% | 14 |

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
| Standard_D96as_v4 | AMD EPYC 7452 32-Core Processor                 | 96 | 12 | 384.0 | N/A | - | - | - |

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
| Standard_D96a_v4 | AMD EPYC 7452 32-Core Processor                 | 96 | 12 | 384.0 | N/A | - | - | - |

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

### DSv2 - General Purpose + Premium Storage
(05/24/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_DS1_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 3.5 | 17,338 | 2,482 | 14.32% | 98 |
| Standard_DS1_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 3.5 | 18,579 | 2,267 | 12.20% | 112 |
| Standard_DS1_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 3.5 | 18,617 | 2,963 | 15.92% | 168 |
| Standard_DS1_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 3.5 | 20,095 | 2,368 | 11.79% | 154 |
| Standard_DS2_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 7.0 | 33,367 | 1,923 | 5.76% | 98 |
| Standard_DS2_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 7.0 | 34,329 | 4,015 | 11.70% | 182 |
| Standard_DS2_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 7.0 | 34,084 | 3,226 | 9.46% | 154 |
| Standard_DS2_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 7.0 | 38,782 | 4,385 | 11.31% | 112 |
| Standard_DS3_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 14.0 | 67,964 | 4,394 | 6.47% | 112 |
| Standard_DS3_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 14.0 | 67,396 | 5,434 | 8.06% | 168 |
| Standard_DS3_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 14.0 | 63,593 | 4,477 | 7.04% | 112 |
| Standard_DS3_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 14.0 | 78,599 | 8,145 | 10.36% | 140 |
| Standard_DS4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 28.0 | 129,452 | 4,586 | 3.54% | 98 |
| Standard_DS4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 28.0 | 128,545 | 6,193 | 4.82% | 140 |
| Standard_DS4_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 28.0 | 125,892 | 6,614 | 5.25% | 140 |
| Standard_DS4_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 28.0 | 150,995 | 10,036 | 6.65% | 98 |
| Standard_DS5_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 56.0 | 250,112 | 1,907 | 0.76% | 84 |
| Standard_DS5_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 56.0 | 263,493 | 11,774 | 4.47% | 182 |
| Standard_DS5_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 56.0 | 248,170 | 10,260 | 4.13% | 126 |
| Standard_DS5_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 56.0 | 304,566 | 25,421 | 8.35% | 98 |

### Dv2 - General Compute
(05/24/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D1_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 3.5 | 17,093 | 1,249 | 7.30% | 224 |
| Standard_D1_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 3.5 | 17,229 | 1,954 | 11.34% | 182 |
| Standard_D1_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 3.5 | 16,474 | 1,558 | 9.46% | 112 |
| Standard_D1_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 3.5 | 21,631 | 306 | 1.41% | 14 |
| Standard_D2_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 7.0 | 33,613 | 1,961 | 5.83% | 196 |
| Standard_D2_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 7.0 | 34,301 | 2,859 | 8.34% | 168 |
| Standard_D2_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 7.0 | 34,041 | 2,386 | 7.01% | 140 |
| Standard_D2_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 7.0 | 37,309 | 911 | 2.44% | 14 |
| Standard_D3_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 14.0 | 65,186 | 3,256 | 4.99% | 196 |
| Standard_D3_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 14.0 | 66,161 | 3,850 | 5.82% | 168 |
| Standard_D3_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 14.0 | 65,731 | 4,742 | 7.21% | 126 |
| Standard_D3_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 14.0 | 78,383 | 5,224 | 6.67% | 28 |
| Standard_D4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 28.0 | 129,637 | 5,291 | 4.08% | 238 |
| Standard_D4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 28.0 | 126,313 | 2,045 | 1.62% | 182 |
| Standard_D4_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 28.0 | 120,903 | 1,877 | 1.55% | 84 |
| Standard_D4_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 28.0 | 145,529 | 1,683 | 1.16% | 14 |
| Standard_D5_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 56.0 | 253,120 | 9,301 | 3.67% | 238 |
| Standard_D5_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 56.0 | 258,915 | 10,136 | 3.91% | 126 |
| Standard_D5_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 56.0 | 242,876 | 4,157 | 1.71% | 112 |
| Standard_D5_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 56.0 | 284,831 | 20,223 | 7.10% | 28 |

### Av2 - General Compute
(04/12/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_A1_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 1 | 1 | 2.0 | 6,854 | 551 | 8.04% | 28 |
| Standard_A1_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 2.0 | 6,798 | 724 | 10.65% | 140 |
| Standard_A1_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 2.0 | 6,476 | 1,151 | 17.77% | 84 |
| Standard_A1_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 2.0 | 6,195 | 397 | 6.41% | 56 |
| Standard_A1_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 2.0 | 5,924 | 674 | 11.38% | 28 |
| Standard_A2_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 4.0 | 13,666 | 1,079 | 7.89% | 168 |
| Standard_A2_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 4.0 | 14,276 | 756 | 5.29% | 84 |
| Standard_A2_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 4.0 | 14,223 | 1,010 | 7.10% | 70 |
| Standard_A2_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 4.0 | 14,805 | 166 | 1.12% | 14 |
| Standard_A2m_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 2 | 1 | 16.0 | 15,159 | 72 | 0.47% | 14 |
| Standard_A2m_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 16.0 | 14,315 | 1,255 | 8.76% | 126 |
| Standard_A2m_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 16.0 | 14,149 | 1,121 | 7.92% | 98 |
| Standard_A2m_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 16.0 | 13,791 | 1,201 | 8.71% | 98 |
| Standard_A2m_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 16.0 | 11,336 | 898 | 7.93% | 14 |
| Standard_A4_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 8.0 | 28,551 | 1,839 | 6.44% | 42 |
| Standard_A4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 8.0 | 27,710 | 2,001 | 7.22% | 98 |
| Standard_A4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 8.0 | 28,371 | 2,769 | 9.76% | 98 |
| Standard_A4_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 8.0 | 26,780 | 2,141 | 7.99% | 84 |
| Standard_A4_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 8.0 | 26,476 | 1,608 | 6.07% | 14 |
| Standard_A4m_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 32.0 | 28,710 | 1,032 | 3.59% | 14 |
| Standard_A4m_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 32.0 | 28,128 | 2,283 | 8.12% | 112 |
| Standard_A4m_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 32.0 | 28,220 | 2,997 | 10.62% | 126 |
| Standard_A4m_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 32.0 | 27,720 | 1,839 | 6.63% | 98 |
| Standard_A8_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 8 | 1 | 16.0 | 52,295 | 1,356 | 2.59% | 28 |
| Standard_A8_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 16.0 | 56,004 | 4,045 | 7.22% | 140 |
| Standard_A8_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 16.0 | 53,367 | 3,252 | 6.09% | 84 |
| Standard_A8_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 16.0 | 51,525 | 3,170 | 6.15% | 84 |
| Standard_A8_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 16.0 | 49,802 | 1,009 | 2.03% | 14 |
| Standard_A8m_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 8 | 2 | 64.0 | 51,496 | 1,643 | 3.19% | 14 |
| Standard_A8m_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 64.0 | 54,477 | 3,024 | 5.55% | 126 |
| Standard_A8m_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 64.0 | 55,195 | 4,426 | 8.02% | 126 |
| Standard_A8m_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 64.0 | 52,768 | 3,528 | 6.69% | 70 |
| Standard_A8m_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 64.0 | 49,188 | 1,869 | 3.80% | 14 |


## High performance compute

### HBS - memory bandwidth (AMD EPYC)
(04/29/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_HB60rs | AMD EPYC 7551 32-Core Processor                 | 60 | 15 | 228.0 | 1,023,210 | 20,154 | 1.97% | 42 |

### HCS - dense computation (Intel Xeon Platinum 8168)
(04/28/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_HC44rs | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 44 | 2 | 352.0 | 963,560 | 17,319 | 1.80% | 84 |

## Memory optimized

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
| Standard_E96as_v4 | AMD EPYC 7452 32-Core Processor                 | 96 | 12 | 672.0 | N/A | - | - | - |
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
| Standard_E96a_v4 | AMD EPYC 7452 32-Core Processor                 | 96 | 12 | 672.0 | N/A | - | - | - |

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
| Standard_E80ids_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 80 | 2 | 504.0 |N/A | - | - | - |

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
| Standard_E96ias_v4 | AMD EPYC 7452 32-Core Processor                 | 96 | 12 | 672.0 | N/A | - | - | - |

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
| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E80is_v4 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 80 | 2 | 504.0 | N/A | - | - | - |

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

### DSv2 - Memory Optimized + Premium Storage
(05/24/2021 PBIID:9198755 OS: MicrosoftWindowsServer-WindowsServer-2019-Datacenter-latest)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_DS11_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 14.0 | 33,150 | 2,097 | 6.33% | 112 |
| Standard_DS11_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 14.0 | 34,294 | 3,107 | 9.06% | 182 |
| Standard_DS11_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 14.0 | 33,447 | 2,690 | 8.04% | 98 |
| Standard_DS11_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 14.0 | 37,222 | 3,740 | 10.05% | 126 |
| Standard_DS11-1_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 14.0 | 16,994 | 1,127 | 6.63% | 98 |
| Standard_DS11-1_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 14.0 | 17,538 | 2,029 | 11.57% | 112 |
| Standard_DS11-1_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 14.0 | 17,255 | 1,647 | 9.54% | 140 |
| Standard_DS11-1_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 14.0 | 19,463 | 3,017 | 15.50% | 140 |
| Standard_DS12_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 28.0 | 65,209 | 2,830 | 4.34% | 98 |
| Standard_DS12_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 28.0 | 70,755 | 5,315 | 7.51% | 140 |
| Standard_DS12_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 28.0 | 62,898 | 3,666 | 5.83% | 126 |
| Standard_DS12_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 28.0 | 76,876 | 7,628 | 9.92% | 140 |
| Standard_DS12-1_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 28.0 | 17,253 | 1,094 | 6.34% | 56 |
| Standard_DS12-1_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 28.0 | 17,748 | 2,342 | 13.20% | 182 |
| Standard_DS12-1_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 28.0 | 16,866 | 1,506 | 8.93% | 154 |
| Standard_DS12-1_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 28.0 | 18,925 | 2,461 | 13.00% | 140 |
| Standard_DS12-2_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 28.0 | 35,288 | 2,477 | 7.02% | 98 |
| Standard_DS12-2_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 28.0 | 35,716 | 2,923 | 8.19% | 140 |
| Standard_DS12-2_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 28.0 | 33,884 | 3,285 | 9.70% | 112 |
| Standard_DS12-2_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 28.0 | 39,473 | 3,712 | 9.40% | 140 |
| Standard_DS13_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 56.0 | 136,322 | 6,996 | 5.13% | 70 |
| Standard_DS13_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 56.0 | 127,110 | 4,330 | 3.41% | 154 |
| Standard_DS13_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 56.0 | 126,037 | 6,952 | 5.52% | 126 |
| Standard_DS13_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 56.0 | 158,319 | 11,403 | 7.20% | 140 |
| Standard_DS13-2_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 56.0 | 34,673 | 1,705 | 4.92% | 56 |
| Standard_DS13-2_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 56.0 | 34,869 | 4,134 | 11.86% | 182 |
| Standard_DS13-2_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 56.0 | 33,986 | 2,411 | 7.09% | 112 |
| Standard_DS13-2_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 56.0 | 39,104 | 3,607 | 9.22% | 140 |
| Standard_DS13-4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 56.0 | 67,217 | 3,774 | 5.61% | 84 |
| Standard_DS13-4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 56.0 | 69,377 | 6,103 | 8.80% | 210 |
| Standard_DS13-4_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 56.0 | 66,193 | 6,252 | 9.45% | 70 |
| Standard_DS13-4_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 56.0 | 76,528 | 6,662 | 8.71% | 126 |
| Standard_DS14_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 112.0 | 255,718 | 11,055 | 4.32% | 98 |
| Standard_DS14_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 112.0 | 263,225 | 11,664 | 4.43% | 182 |
| Standard_DS14_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 112.0 | 257,737 | 11,726 | 4.55% | 84 |
| Standard_DS14_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 112.0 | 296,962 | 22,427 | 7.55% | 126 |
| Standard_DS14-4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 2 | 112.0 | 67,170 | 4,554 | 6.78% | 70 |
| Standard_DS14-4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 112.0 | 66,748 | 4,294 | 6.43% | 140 |
| Standard_DS14-4_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 112.0 | 67,116 | 7,254 | 10.81% | 140 |
| Standard_DS14-4_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 112.0 | 75,100 | 4,719 | 6.28% | 154 |
| Standard_DS14-8_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 2 | 112.0 | 125,558 | 1,961 | 1.56% | 84 |
| Standard_DS14-8_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 112.0 | 128,904 | 4,055 | 3.15% | 84 |
| Standard_DS14-8_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 112.0 | 127,309 | 8,301 | 6.52% | 182 |
| Standard_DS14-8_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 112.0 | 148,717 | 13,028 | 8.76% | 140 |
| Standard_DS15_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 20 | 2 | 140.0 | 314,358 | 3,189 | 1.01% | 56 |
| Standard_DS15_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 20 | 1 | 140.0 | 324,517 | 14,805 | 4.56% | 168 |
| Standard_DS15_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 20 | 1 | 140.0 | 312,229 | 16,417 | 5.26% | 126 |
| Standard_DS15_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 140.0 | 369,680 | 36,859 | 9.97% | 126 |
| Standard_DS15i_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 20 | 2 | 140.0 | 330,307 | 18,294 | 5.54% | 28 |
| Standard_DS15i_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 20 | 1 | 140.0 | 330,397 | 17,469 | 5.29% | 294 |
| Standard_DS15i_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 140.0 | 371,086 | 33,246 | 8.96% | 140 |

### Dv2 - Memory Optimized
(05/24/2021 PBIID:9198755 OS: MicrosoftWindowsServer-WindowsServer-2019-Datacenter-latest)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D11_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 14.0 | 33,085 | 1,835 | 5.55% | 196 |
| Standard_D11_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 14.0 | 33,998 | 3,523 | 10.36% | 168 |
| Standard_D11_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 14.0 | 32,964 | 2,690 | 8.16% | 140 |
| Standard_D11_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 14.0 | 39,330 | 3,092 | 7.86% | 28 |
| Standard_D12_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 28.0 | 65,877 | 3,537 | 5.37% | 196 |
| Standard_D12_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 28.0 | 66,128 | 4,438 | 6.71% | 210 |
| Standard_D12_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 28.0 | 63,397 | 4,021 | 6.34% | 98 |
| Standard_D12_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 28.0 | 80,559 | 3,760 | 4.67% | 14 |
| Standard_D13_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 56.0 | 133,275 | 7,394 | 5.55% | 182 |
| Standard_D13_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 56.0 | 127,557 | 3,854 | 3.02% | 210 |
| Standard_D13_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 56.0 | 120,793 | 1,444 | 1.20% | 70 |
| Standard_D13_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 56.0 | 151,473 | 7,667 | 5.06% | 42 |
| Standard_D14_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 112.0 | 253,422 | 9,024 | 3.56% | 224 |
| Standard_D14_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 112.0 | 261,437 | 12,701 | 4.86% | 140 |
| Standard_D14_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 112.0 | 246,994 | 6,166 | 2.50% | 98 |
| Standard_D14_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 112.0 | 315,200 | 15,164 | 4.81% | 28 |
| Standard_D15_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 20 | 2 | 140.0 | 315,711 | 8,560 | 2.71% | 252 |
| Standard_D15_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 20 | 1 | 140.0 | 321,475 | 12,246 | 3.81% | 168 |
| Standard_D15_v2 | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 20 | 1 | 140.0 | 314,692 | 11,528 | 3.66% | 56 |
| Standard_D15i_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 20 | 1 | 140.0 | 323,411 | 10,041 | 3.10% | 462 |
| Standard_D15i_v2 | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 140.0 | 370,436 | 5,018 | 1.35% | 28 |


## Storage optimized

### Lsv2 - Storage Optimized
(04/29/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_L8s_v2 | AMD EPYC 7551 32-Core Processor                 | 8 | 1 | 64.0 | 101,433 | 844 | 0.83% | 448 |
| Standard_L16s_v2 | AMD EPYC 7551 32-Core Processor                 | 16 | 2 | 128.0 | 200,664 | 2,866 | 1.43% | 448 |
| Standard_L32s_v2 | AMD EPYC 7551 32-Core Processor                 | 32 | 4 | 256.0 | 396,781 | 7,237 | 1.82% | 462 |
| Standard_L48s_v2 | AMD EPYC 7551 32-Core Processor                 | 48 | 6 | 384.0 | 584,059 | 13,101 | 2.24% | 112 |
| Standard_L64s_v2 | AMD EPYC 7551 32-Core Processor                 | 64 | 8 | 512.0 | 768,442 | 19,518 | 2.54% | 70 |

### Ls - Storage Optimized + Premium Storage
(05/25/2021 PBIID:9198755)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_L4s | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 4 | 1 | 32.0 | 69,902 | 6,012 | 8.60% | 294 |
| Standard_L8s | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 8 | 1 | 64.0 | 133,859 | 7,026 | 5.25% | 280 |
| Standard_L16s | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 16 | 1 | 128.0 | 259,512 | 7,269 | 2.80% | 252 |
| Standard_L32s | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 32 | 2 | 256.0 | 506,359 | 7,472 | 1.48% | 252 |


## About CoreMark

[CoreMark](https://www.eembc.org/coremark/faq.php) is a benchmark that tests the functionality of a microctronoller (MCU) or central processing unit (CPU). CoreMark isn't system dependent, so it functions the same regardless of the platform (for example, big or little endian, high-end or low-end processor).

Windows numbers were computed by running CoreMark on Windows Server 2019. CoreMark was configured with the number of threads set to the number of virtual CPUs, and concurrency set to `PThreads`. The target number of iterations was adjusted based on expected performance to provide a runtime of at least 20 seconds (typically much longer). The final score represents the number of iterations completed divided by the number of seconds it took to run the test. Each test was run at least seven times on each VM. Test run dates shown above. Tests run on multiple VMs across Azure public regions the VM was supported in on the date run.

Windows numbers were computed by running CoreMark on Windows Server 2019. CoreMark was configured with the number of threads set to the number of virtual CPUs, and concurrency set to `PThreads`. The target number of iterations was adjusted based on expected performance to provide a runtime of at least 20 seconds (typically much longer). The final score represents the number of iterations completed divided by the number of seconds it took to run the test. Each test was run at least seven times on each VM. Test run dates shown above. Tests run on multiple VMs across Azure public regions the VM was supported in on the date run. (Coremark doesn't properly support more than 64 vCPUs on Windows, therefore SKUs with > 64 vCPUs have been marked as N/A.)

### Running Coremark on Azure VMs

**Download:**

CoreMark is an open source tool that can be downloaded from [GitHub](https://github.com/eembc/coremark).

**Building and Running:**

To build and run the benchmark, type:

`> make`

Full results are available in the files ```run1.log``` and ```run2.log```.
```run1.log``` contains CoreMark results with performance parameters.
```run2.log``` contains benchmark results with validation parameters.

**Run Time:**

By default, the benchmark will run between 10-100 seconds. To override, use ```ITERATIONS=N```

`% make ITERATIONS=10`

above flag will run the benchmark for 10 iterations.
**Results are only valid for reporting if the benchmark ran for at least 10 seconds!**

**Parallel Execution:**

Use ```XCFLAGS=-DMULTITHREAD=N``` where N is number of threads to run in parallel. Several implementations are available to execute in multiple contexts.

`% make XCFLAGS="-DMULTITHREAD=4 -DUSE_PTHREAD"`

The above will compile the benchmark for execution on 4 cores.

**Recommendations for best results**

- The benchmark needs to run for at least 10 seconds, probably longer on larger systems.
- All source files must be compiled with same flags.
- Don't change source files other than ```core_portme*``` (use ```make check``` to validate)
- Multiple runs are suggested for best results.

## GPU Series
Performance of GPU based VM series is best understood by using GPU appropriate benchmarks and running at the scale required for your workloads. Azure ranks among the best there:

- Top 10 Supercomputer: [November 2021 | TOP500](https://top500.org/lists/top500/2021/11/) (Azure powered #10: Voyager-EUS2)
- Machine Learning: MLCommons Training: [v1.1 Results | MLCommons](https://mlcommons.org/en/training-normal-11/) (2 highest at scale and largest in the cloud)


## Next steps
* For storage capacities, disk details, and other considerations for choosing among VM sizes, see [Sizes for virtual machines](../sizes.md).
