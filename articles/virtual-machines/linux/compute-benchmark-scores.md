---
title: Compute benchmark scores for Linux VMs | Microsoft Docs
description: Compare CoreMark compute benchmark scores for Azure VMs running Linux
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager,azure-service-management

ms.assetid: 93e812c1-79dd-40c5-b97b-aa79f5cd7d76
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 09/25/2017
ms.author: cynthn;davberg

---
# Compute benchmark scores for Linux VMs
The following CoreMark benchmark scores show compute performance for Azure's high-performance VM lineup running Ubuntu. Compute benchmark scores are also available for [Windows VMs](../windows/compute-benchmark-scores.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

## Av2 - General Compute
(3/23/2018 7:32:49 PM pbi 2050259)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_A1_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 1 | 1 | 1.9 | 6,514 | 56 | 119 |
| Standard_A1_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 1.9 | 6,162 | 195 | 70 |
| Standard_A1_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 1.9 | 6,505 | 425 | 63 |
| Standard_A2_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 2 | 1 | 3.9 | 13,061 | 282 | 112 |
| Standard_A2_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 3.9 | 12,270 | 390 | 56 |
| Standard_A2_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 3.9 | 13,406 | 793 | 35 |
| Standard_A2m_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 2 | 1 | 16.0 | 13,148 | 130 | 84 |
| Standard_A2m_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 16.0 | 12,450 | 563 | 35 |
| Standard_A2m_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 16.0 | 12,929 | 988 | 56 |
| Standard_A4_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 8.0 | 26,037 | 356 | 70 |
| Standard_A4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 8.0 | 24,728 | 594 | 77 |
| Standard_A4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 8.0 | 26,549 | 1,375 | 42 |
| Standard_A4m_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 32.1 | 25,865 | 672 | 70 |
| Standard_A4m_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 32.1 | 24,646 | 1,104 | 63 |
| Standard_A4m_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 32.1 | 25,058 | 1,292 | 35 |
| Standard_A8_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 8 | 1 | 16.0 | 52,963 | 694 | 98 |
| Standard_A8_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 16.0 | 49,908 | 970 | 35 |
| Standard_A8_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 16.0 | 48,584 | 742 | 77 |
| Standard_A8m_v2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 8 | 2 | 64.4 | 52,900 | 815 | 133 |
| Standard_A8m_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 64.4 | 49,733 | 861 | 84 |
| Standard_A8m_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 64.4 | 48,494 | 501 | 49 |

## A0-7 Standard General Compute
(3/23/2018 9:06:07 PM pbi 2050259)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_A0 | AMD Opteron(tm) Processor 4171 HE | 1 | 1 | 0.6 | 3,556 | 14 | 21 |
| Standard_A0 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 1 | 1 | 0.6 | 3,137 | 16 | 70 |
| Standard_A0 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 0.6 | 3,146 | 134 | 63 |
| Standard_A1 | AMD Opteron(tm) Processor 4171 HE | 1 | 1 | 1.7 | 6,862 | 169 | 42 |
| Standard_A1 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 1 | 1 | 1.7 | 6,471 | 104 | 98 |
| Standard_A1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 1.7 | 6,211 | 262 | 98 |
| Standard_A2 | AMD Opteron(tm) Processor 4171 HE | 2 | 1 | 3.4 | 13,950 | 415 | 35 |
| Standard_A2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 2 | 1 | 3.4 | 13,205 | 187 | 112 |
| Standard_A2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 3.4 | 12,563 | 639 | 84 |
| Standard_A3 | AMD Opteron(tm) Processor 4171 HE | 4 | 1 | 6.9 | 28,069 | 679 | 28 |
| Standard_A3 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 6.9 | 26,238 | 236 | 98 |
| Standard_A3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 6.9 | 25,195 | 827 | 77 |
| Standard_A4 | AMD Opteron(tm) Processor 4171 HE | 8 | 2 | 14.0 | 56,604 | 305 | 7 |
| Standard_A4 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 8 | 1 | 14.0 | 53,271 | 577 | 63 |
| Standard_A4 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 14.0 | 49,744 | 1,118 | 147 |
| Standard_A5 | AMD Opteron(tm) Processor 4171 HE | 2 | 1 | 14.0 | 14,164 | 273 | 21 |
| Standard_A5 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 2 | 1 | 14.0 | 13,136 | 151 | 98 |
| Standard_A5 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 14.0 | 12,510 | 615 | 84 |
| Standard_A6 | AMD Opteron(tm) Processor 4171 HE | 4 | 1 | 28.1 | 28,272 | 392 | 28 |
| Standard_A6 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 28.1 | 26,165 | 294 | 105 |
| Standard_A6 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 28.1 | 25,178 | 1,009 | 70 |
| Standard_A7 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 8 | 1 | 56.3 | 52,949 | 1,114 | 112 |
| Standard_A7 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 56.3 | 49,677 | 894 | 133 |

## DSv3 - General Compute + Premium Storage
(3/23/2018 7:28:44 PM pbi 2050259)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 8.0 | 20,259 | 729 | 140 |
| Standard_D2s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 8.0 | 20,364 | 1,007 | 70 |
| Standard_D4s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 16.0 | 39,662 | 1,757 | 182 |
| Standard_D4s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 16.0 | 40,632 | 2,422 | 168 |
| Standard_D8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 32.1 | 80,055 | 1,022 | 133 |
| Standard_D8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 32.1 | 80,639 | 2,844 | 56 |
| Standard_D16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 1 | 64.4 | 158,407 | 3,267 | 119 |
| Standard_D16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 64.4 | 154,146 | 4,432 | 63 |
| Standard_D32s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 32 | 2 | 128.9 | 307,408 | 3,203 | 70 |
| Standard_D32s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 1 | 128.9 | 309,183 | 3,132 | 56 |
| Standard_D32-8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 128.9 | 80,160 | 3,912 | 84 |
| Standard_D32-8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 128.9 | 84,406 | 1,939 | 70 |
| Standard_D32-16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 32 | 2 | 128.9 | 157,154 | 2,152 | 84 |
| Standard_D32-16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 1 | 128.9 | 155,460 | 3,663 | 112 |
| Standard_D64s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 64 | 2 | 257.9 | 615,873 | 7,266 | 140 |
| Standard_D64-16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 2 | 257.9 | 170,309 | 2,169 | 98 |
| Standard_D64-32s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 64 | 2 | 257.9 | 306,578 | 4,095 | 98 |

## Dv3 - General Compute
(3/23/2018 7:32:37 PM pbi 2050259)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D2_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 8.0 | 20,791 | 1,531 | 175 |
| Standard_D2_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 8.0 | 21,326 | 1,622 | 84 |
| Standard_D4_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 16.0 | 39,978 | 1,853 | 98 |
| Standard_D4_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 16.0 | 41,842 | 2,798 | 77 |
| Standard_D8_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 32.1 | 80,559 | 1,990 | 154 |
| Standard_D8_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 32.1 | 79,711 | 4,368 | 63 |
| Standard_D16_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 1 | 64.4 | 160,309 | 3,371 | 133 |
| Standard_D16_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 64.4 | 155,447 | 3,426 | 56 |
| Standard_D32_v3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 32 | 2 | 128.9 | 309,021 | 4,128 | 105 |
| Standard_D32_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 1 | 128.9 | 311,375 | 3,714 | 49 |
| Standard_D64_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 64 | 2 | 257.9 | 613,424 | 19,225 | 84 |

## Esv3 - Memory Optimized + Premium Storage
(3/23/2018 7:31:01 PM pbi 2050259)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 16.0 | 21,015 | 1,112 | 210 |
| Standard_E4s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 32.1 | 40,691 | 1,928 | 287 |
| Standard_E8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 64.4 | 79,841 | 2,856 | 161 |
| Standard_E16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 128.9 | 155,976 | 2,666 | 161 |
| Standard_E32s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 2 | 257.9 | 297,695 | 8,535 | 140 |
| Standard_E32-8s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 2 | 257.9 | 86,375 | 7,300 | 140 |
| Standard_E32-16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 2 | 257.9 | 158,842 | 10,809 | 189 |
| Standard_E64s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 64 | 2 | 435.3 | 613,160 | 8,637 | 63 |
| Standard_E64-16s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 2 | 435.3 | 170,343 | 2,052 | 126 |
| Standard_E64-32s_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 64 | 2 | 435.3 | 307,110 | 3,759 | 126 |
| Standard_E64is_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 64 | 2 | 435.3 | 613,892 | 7,763 | 140 |

## Ev3 - Memory Optimized
(3/23/2018 7:29:35 PM pbi 2050259)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_E2_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 16.0 | 23,318 | 2,734 | 245 |
| Standard_E4_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 32.1 | 42,612 | 3,834 | 154 |
| Standard_E8_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 64.4 | 83,488 | 4,888 | 189 |
| Standard_E16_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 128.9 | 159,537 | 4,999 | 175 |
| Standard_E32_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 2 | 257.9 | 306,311 | 8,547 | 196 |
| Standard_E64_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 64 | 2 | 435.3 | 605,599 | 36,245 | 168 |
| Standard_E64i_v3 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 64 | 2 | 435.3 | 618,198 | 10,022 | 154 |

## DSv2 - Storage Optimized
(3/23/2018 7:30:03 PM pbi 2050259)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_DS1_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 3.4 | 14,691 | 626 | 182 |
| Standard_DS1_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 3.4 | 14,577 | 1,120 | 63 |
| Standard_DS2_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 6.9 | 29,156 | 1,095 | 91 |
| Standard_DS2_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 6.9 | 29,157 | 1,945 | 56 |
| Standard_DS3_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 14.0 | 55,981 | 1,625 | 98 |
| Standard_DS3_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 14.0 | 57,921 | 2,628 | 77 |
| Standard_DS4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 28.1 | 115,636 | 1,963 | 161 |
| Standard_DS4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 28.1 | 111,527 | 494 | 14 |
| Standard_DS5_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 1 | 56.3 | 220,333 | 4,856 | 91 |
| Standard_DS5_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 56.3 | 217,812 | 5,320 | 35 |
| Standard_DS5_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 56.3 | 222,116 | 4,445 | 56 |
| Standard_DS11_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 14.0 | 28,364 | 929 | 105 |
| Standard_DS11_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 14.0 | 28,772 | 1,351 | 70 |
| Standard_DS12_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 28.1 | 56,130 | 2,174 | 119 |
| Standard_DS12_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 28.1 | 58,490 | 2,670 | 63 |
| Standard_DS13_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 56.3 | 115,107 | 2,525 | 126 |
| Standard_DS13_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 56.3 | 111,429 | 1,111 | 35 |
| Standard_DS13-2_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 56.3 | 28,933 | 1,176 | 154 |
| Standard_DS13-2_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 56.3 | 30,336 | 1,635 | 98 |
| Standard_DS13-4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 56.3 | 57,644 | 1,893 | 126 |
| Standard_DS13-4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 56.3 | 57,927 | 1,306 | 84 |
| Standard_DS14_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 112.8 | 218,363 | 3,866 | 154 |
| Standard_DS14_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 112.8 | 224,791 | 4,363 | 77 |
| Standard_DS14-4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 2 | 112.8 | 56,398 | 2,675 | 126 |
| Standard_DS14-4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 112.8 | 61,709 | 1,468 | 49 |
| Standard_DS14-8_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 2 | 112.8 | 112,282 | 4,368 | 147 |
| Standard_DS14-8_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 112.8 | 111,469 | 3,747 | 49 |
| Standard_DS15_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 20 | 2 | 141.0 | 271,529 | 3,749 | 189 |
| Standard_DS2_v2_Promo | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 6.9 | 28,363 | 1,093 | 133 |
| Standard_DS2_v2_Promo | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 6.9 | 29,518 | 1,641 | 63 |
| Standard_DS3_v2_Promo | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 14.0 | 56,617 | 2,233 | 112 |
| Standard_DS3_v2_Promo | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 14.0 | 59,714 | 2,042 | 42 |
| Standard_DS4_v2_Promo | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 28.1 | 115,522 | 2,064 | 161 |
| Standard_DS4_v2_Promo | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 28.1 | 111,668 | 2,276 | 98 |
| Standard_DS5_v2_Promo | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 1 | 56.3 | 222,599 | 5,380 | 126 |
| Standard_DS5_v2_Promo | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 56.3 | 218,790 | 4,884 | 14 |
| Standard_DS5_v2_Promo | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 56.3 | 225,079 | 3,425 | 70 |
| Standard_DS11_v2_Promo | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 14.0 | 28,570 | 1,138 | 119 |
| Standard_DS11_v2_Promo | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 14.0 | 28,600 | 866 | 63 |
| Standard_DS12_v2_Promo | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 28.1 | 56,455 | 1,772 | 133 |
| Standard_DS12_v2_Promo | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 28.1 | 59,037 | 2,777 | 70 |
| Standard_DS13_v2_Promo | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 56.3 | 114,748 | 2,128 | 119 |
| Standard_DS13_v2_Promo | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 56.3 | 112,117 | 2,319 | 63 |
| Standard_DS14_v2_Promo | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 112.8 | 218,855 | 3,767 | 119 |
| Standard_DS14_v2_Promo | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 112.8 | 220,556 | 11,991 | 49 |

## Dv2 Series - General Compute
(3/23/2018 7:27:28 PM pbi 2050259)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D1_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 3.4 | 15,027 | 963 | 105 |
| Standard_D1_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 3.4 | 15,296 | 1,696 | 77 |
| Standard_D2_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 6.9 | 29,060 | 1,405 | 133 |
| Standard_D2_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 6.9 | 31,552 | 2,315 | 63 |
| Standard_D3_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 14.0 | 57,666 | 1,559 | 168 |
| Standard_D3_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 14.0 | 58,312 | 3,640 | 77 |
| Standard_D4_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 28.1 | 114,708 | 2,019 | 147 |
| Standard_D4_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 28.1 | 114,971 | 5,415 | 42 |
| Standard_D5_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 1 | 56.3 | 221,546 | 5,093 | 112 |
| Standard_D5_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 56.3 | 214,933 | 3,741 | 21 |
| Standard_D5_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 56.3 | 225,410 | 5,421 | 77 |
| Standard_D11_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 14.0 | 29,125 | 1,267 | 154 |
| Standard_D11_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 14.0 | 31,315 | 1,762 | 63 |
| Standard_D12_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 28.1 | 57,386 | 1,712 | 168 |
| Standard_D12_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 28.1 | 57,903 | 3,322 | 112 |
| Standard_D13_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 56.3 | 114,319 | 2,482 | 126 |
| Standard_D13_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 56.3 | 114,933 | 3,486 | 49 |
| Standard_D14_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 112.8 | 219,594 | 5,752 | 119 |
| Standard_D14_v2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 112.8 | 225,880 | 3,699 | 77 |
| Standard_D15_v2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 20 | 2 | 141.0 | 275,417 | 6,457 | 154 |

## D Series - General Compute
(3/23/2018 7:28:16 PM pbi 2050259)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_D1 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 1 | 1 | 3.4 | 10,331 | 303 | 112 |
| Standard_D1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 3.4 | 14,547 | 916 | 14 |
| Standard_D2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 2 | 1 | 6.9 | 21,112 | 383 | 119 |
| Standard_D2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 6.9 | 27,545 | 173 | 7 |
| Standard_D3 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 14.0 | 41,910 | 974 | 133 |
| Standard_D3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 14.0 | 57,567 | 2,166 | 21 |
| Standard_D4 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 8 | 1 | 28.1 | 85,255 | 971 | 119 |
| Standard_D4 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 28.1 | 112,324 | 1,367 | 14 |
| Standard_D11 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 2 | 1 | 14.0 | 21,172 | 479 | 140 |
| Standard_D11 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 14.0 | 29,935 | 1,702 | 14 |
| Standard_D12 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 28.1 | 41,788 | 1,185 | 98 |
| Standard_D12 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 28.1 | 57,105 | 761 | 28 |
| Standard_D13 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 8 | 1 | 56.3 | 85,180 | 1,395 | 119 |
| Standard_D13 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 56.3 | 113,421 | 1,695 | 28 |
| Standard_D14 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 16 | 2 | 112.8 | 165,497 | 3,376 | 105 |
| Standard_D14 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 112.8 | 217,813 | 4,869 | 35 |

## DS - Storage Optimized
(3/23/2018 7:34:52 PM pbi 2050259)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_DS1 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 1 | 1 | 3.4 | 10,666 | 134 | 126 |
| Standard_DS11 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 2 | 1 | 14.0 | 21,330 | 268 | 49 |
| Standard_DS12 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 28.1 | 42,225 | 555 | 126 |
| Standard_DS12 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 28.1 | 56,288 | 976 | 14 |
| Standard_DS13 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 8 | 1 | 56.3 | 85,292 | 1,303 | 98 |
| Standard_DS14 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 16 | 2 | 112.8 | 162,996 | 3,911 | 70 |
| Standard_DS14 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 112.8 | 217,038 | 3,540 | 28 |
| Standard_DS2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 2 | 1 | 6.9 | 21,398 | 193 | 119 |
| Standard_DS3 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 14.0 | 42,470 | 559 | 126 |
| Standard_DS3 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 14.0 | 55,664 | 385 | 7 |
| Standard_DS4 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 8 | 1 | 28.1 | 84,956 | 1,087 | 105 |

## Fsv2 - Compute + Storage Optimized
(3/23/2018 7:33:11 PM pbi 2050259)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_F2s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 2 | 1 | 3.9 | 25,392 | 157 | 49 |
| Standard_F4s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 4 | 1 | 8.0 | 48,065 | 656 | 42 |
| Standard_F8s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 8 | 1 | 16.0 | 95,026 | 1,205 | 49 |
| Standard_F16s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 16 | 1 | 32.1 | 187,039 | 2,681 | 42 |
| Standard_F32s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 32 | 1 | 64.4 | 375,828 | 5,180 | 70 |
| Standard_F64s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 64 | 2 | 128.9 | 741,859 | 5,954 | 49 |
| Standard_F72s_v2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 72 | 2 | 145.0 | 831,616 | 4,867 | 42 |

## F - Compute Optimized
(3/23/2018 7:28:54 PM pbi 2050259)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_F1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 1.9 | 14,762 | 815 | 175 |
| Standard_F1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 1.9 | 15,756 | 1,653 | 91 |
| Standard_F2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 3.9 | 29,265 | 1,593 | 182 |
| Standard_F2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 3.9 | 32,105 | 3,072 | 70 |
| Standard_F4 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 8.0 | 57,174 | 2,009 | 182 |
| Standard_F4 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 8.0 | 57,613 | 3,076 | 91 |
| Standard_F8 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 16.0 | 114,851 | 1,983 | 182 |
| Standard_F8 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 16.0 | 113,706 | 2,797 | 105 |
| Standard_F16 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 1 | 32.1 | 220,641 | 5,114 | 140 |
| Standard_F16 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 32.1 | 217,174 | 4,952 | 28 |
| Standard_F16 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 32.1 | 226,457 | 5,507 | 49 |

## Fs - Compute and Storage Optimized
(3/23/2018 7:30:14 PM pbi 2050259)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_F1s | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 1.9 | 14,630 | 678 | 203 |
| Standard_F1s | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 1.9 | 15,247 | 801 | 91 |
| Standard_F2s | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 3.9 | 28,931 | 1,105 | 133 |
| Standard_F2s | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 3.9 | 29,079 | 1,454 | 77 |
| Standard_F4s | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 8.0 | 56,674 | 1,518 | 189 |
| Standard_F4s | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 8.0 | 57,051 | 2,872 | 91 |
| Standard_F8s | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 16.0 | 113,709 | 11,105 | 196 |
| Standard_F8s | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 16.0 | 111,477 | 2,531 | 70 |
| Standard_F16s | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 1 | 32.1 | 222,637 | 4,405 | 140 |
| Standard_F16s | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 32.1 | 218,297 | 4,284 | 14 |
| Standard_F16s | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 32.1 | 225,001 | 3,033 | 98 |

## G - Compute Optimized
(3/23/2018 7:27:25 PM pbi 2050259)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_G1 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 2 | 1 | 28.1 | 32,071 | 4,239 | 182 |
| Standard_G2 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 4 | 1 | 56.3 | 60,598 | 6,048 | 175 |
| Standard_G3 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 8 | 1 | 112.8 | 111,058 | 6,536 | 161 |
| Standard_G4 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 16 | 1 | 225.7 | 200,516 | 1,833 | 154 |
| Standard_G5 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 32 | 2 | 451.5 | 395,591 | 5,192 | 154 |

## GS - Storage Optimized
(3/23/2018 7:25:12 PM pbi 2050259)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_GS1 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 2 | 1 | 28.1 | 28,771 | 2,006 | 231 |
| Standard_GS2 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 4 | 1 | 56.3 | 54,947 | 3,699 | 203 |
| Standard_GS3 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 8 | 1 | 112.8 | 105,054 | 4,441 | 182 |
| Standard_GS4 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 16 | 1 | 225.7 | 199,189 | 12,092 | 168 |
| Standard_GS4-4 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 4 | 1 | 225.7 | 59,066 | 2,935 | 196 |
| Standard_GS4-8 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 8 | 1 | 225.7 | 107,076 | 3,209 | 168 |
| Standard_GS5 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 32 | 2 | 451.5 | 386,803 | 9,303 | 161 |
| Standard_GS5-8 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 8 | 2 | 451.5 | 116,094 | 1,935 | 42 |
| Standard_GS5-16 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 16 | 2 | 451.5 | 209,500 | 2,622 | 63 |

## H - High Performance Compute (HPC)
(3/23/2018 7:27:16 PM pbi 2050259)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_H8 | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 8 | 1 | 56.3 | 140,445 | 2,840 | 147 |
| Standard_H8m | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 8 | 1 | 112.8 | 141,086 | 2,209 | 147 |
| Standard_H16 | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 16 | 2 | 112.8 | 270,129 | 6,502 | 56 |
| Standard_H16m | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 16 | 2 | 225.7 | 272,667 | 6,686 | 112 |
| Standard_H16mr | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 16 | 2 | 225.7 | 272,683 | 6,484 | 70 |
| Standard_H16r | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 16 | 2 | 112.8 | 271,822 | 6,126 | 98 |

## HPC - A8-11
(3/23/2018 7:35:10 PM pbi 2050259)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_A8 | Intel(R) Xeon(R) CPU E5-2670 0 @ 2.60GHz | 8 | 1 | 56.3 | 117,148 | 1,877 | 189 |
| Standard_A9 | Intel(R) Xeon(R) CPU E5-2670 0 @ 2.60GHz | 16 | 2 | 112.8 | 225,608 | 7,532 | 147 |
| Standard_A10 | Intel(R) Xeon(R) CPU E5-2670 0 @ 2.60GHz | 8 | 1 | 56.3 | 117,638 | 1,988 | 168 |
| Standard_A11 | Intel(R) Xeon(R) CPU E5-2670 0 @ 2.60GHz | 16 | 2 | 112.8 | 225,980 | 7,067 | 161 |

## Ls - Storage Optimized
(3/23/2018 7:58:51 PM pbi 2050259)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_L4s | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 4 | 1 | 32.1 | 55,962 | 3,567 | 154 |
| Standard_L8s | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 8 | 1 | 64.4 | 106,482 | 3,178 | 168 |
| Standard_L16s | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 16 | 1 | 128.9 | 197,906 | 12,605 | 168 |
| Standard_L32s | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 32 | 2 | 257.9 | 388,652 | 6,274 | 126 |

## M - Memory Optimized
(3/23/2018 8:57:07 PM pbi 2050259)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Standard_M64-32ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,806.2 | 339,412 | 4,655 | 21 |
| Standard_M64ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,806.2 | 662,070 | 16,539 | 70 |
| Standard_M64s | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,032.1 | 659,757 | 22,439 | 21 |
| Standard_M128-32ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 4 | 3,923.0 | 332,861 | 6,061 | 42 |
| Standard_M128-64ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 3,923.0 | 656,788 | 16,341 | 35 |
| Standard_M128ms | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 3,923.0 | 1,275,328 | 16,544 | 70 |
| Standard_M128s | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 2,064.3 | 1,275,445 | 19,510 | 42 |

## About CoreMark
Linux numbers were computed by running [CoreMark](http://www.eembc.org/coremark/faq.php) on Ubuntu. CoreMark was configured with the number of threads set to the number of virtual CPUs, and concurrency set to PThreads. The target number of iterations was adjusted based on expected performance to provide a runtime of at least 20 seconds (typically much longer). The final score represents the number of iterations completed divided by the number of seconds it took to run the test. Each test was run at least seven times on each VM. Test run dates shown above. Tests run on multiple VMs across Azure public regions the VM was supported in on the
date run. Basic A and B (Burstable) series not shown because performance is variable. N series not shown as they are GPU centric and Coremark doesn't measure GPU performance.

## Next steps
* For storage capacities, disk details, and additional considerations for choosing among VM sizes, see [Sizes for virtual machines](sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
* To run the CoreMark scripts on Linux VMs, download the [CoreMark script pack](http://download.microsoft.com/download/3/0/5/305A3707-4D3A-4599-9670-AAEB423B4663/AzureCoreMarkScriptPack.zip).

