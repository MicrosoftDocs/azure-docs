---
title: Compute benchmark scores for Azure Windows VMs 
description: Compare SPECint compute benchmark scores for Azure VMs running Windows Server.
author: cynthn
ms.service: virtual-machines
ms.subservice: benchmark
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 03/31/2021
ms.author: cynthn
ms.reviewer: davberg

---
# Compute benchmark scores for Windows VMs
The following SPECInt benchmark scores show compute performance for select Azure VMs running Windows Server. Compute benchmark scores are also available for [Linux VMs](../linux/compute-benchmark-scores.md).


| Type | Families | 
| ---- | -------- | 
|  | [A0-7](#a0-7-standard-general-compute) [Lv2](#lv2---storage-optimized)  | 
| Compute optimized | [Fsv2](#fsv2---compute--storage-optimized)  | 
| General purpose | [Av2](#av2---general-compute) [B](#b---burstable) [DSv3](#dsv3---general-compute---premium-storage) [Dv3](#dv3---general-compute) [Dasv4](#dasv4) [Dav4](#dav4) [DCS](#dcs---confidential-compute-series) [DCsv2](#dcsv2) [DCv2](#dcv2) [DDSv4](#ddsv4) [DDv4](#ddv4) [Dsv4](#dsv4) [Dv4](#dv4)  | 
| High performance compute | [H](#h---high-performance-compute--hpc) [HBrsv2](#hbrsv2) [HBS](#hbs---memory-bandwidth--amd-epyc) [HCS](#hcs---dense-computation--intel-xeon-platinum-8168)  | 
| Memory optimized | [DSv2](#dsv2---storage-optimized) [Dv2](#dv2---general-compute) [Esv3](#esv3---memory-optimized---premium-storage) [Ev3](#ev3---memory-optimized) [Easv4](#easv4) [Eav4](#eav4) [EDSv4](#edsv4) [EDv4](#edv4) [Esv4](#esv4) [Ev4](#ev4) [Msv2](#msv2---memory-optimized) [Msv2s](#msv2-small---memory-optimized) [M](#m---memory-optimized)  | 

## A0-7 Standard General Compute
(09/30/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_A0</span> | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 1 | 1 | 0.6 | <span class="Score">3,757</span> | 39 | 1.05% | 42 |
| <span class="VMSize">Standard_A0</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 0.6 | <span class="Score">4,158</span> | 137 | 3.30% | 140 |
| <span class="VMSize">Standard_A0</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 0.6 | <span class="Score">3,877</span> | 24 | 0.62% | 7 |
| <span class="VMSize">Standard_A0</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 0.6 | <span class="Score">4,982</span> | 181 | 3.64% | 14 |
| <span class="VMSize">Standard_A1</span> | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 1 | 1 | 1.6 | <span class="Score">7,665</span> | 98 | 1.27% | 35 |
| <span class="VMSize">Standard_A1</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 1.6 | <span class="Score">8,018</span> | 305 | 3.80% | 147 |
| <span class="VMSize">Standard_A1</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 1.6 | <span class="Score">7,612</span> | 11 | 0.15% | 7 |
| <span class="VMSize">Standard_A1</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 1.6 | <span class="Score">9,970</span> | 149 | 1.50% | 14 |
| <span class="VMSize">Standard_A2</span> | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 2 | 1 | 3.4 | <span class="Score">15,181</span> | 125 | 0.83% | 28 |
| <span class="VMSize">Standard_A2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 3.4 | <span class="Score">16,145</span> | 369 | 2.29% | 84 |
| <span class="VMSize">Standard_A2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 3.3 | <span class="Score">15,608</span> | 607 | 3.89% | 70 |
| <span class="VMSize">Standard_A2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 3.4 | <span class="Score">15,312</span> | 34 | 0.22% | 7 |
| <span class="VMSize">Standard_A2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 3.4 | <span class="Score">20,137</span> | 428 | 2.12% | 14 |
| <span class="VMSize">Standard_A3</span> | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 6.8 | <span class="Score">30,324</span> | 327 | 1.08% | 35 |
| <span class="VMSize">Standard_A3</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 6.8 | <span class="Score">31,617</span> | 764 | 2.42% | 147 |
| <span class="VMSize">Standard_A3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 6.8 | <span class="Score">31,325</span> | 242 | 0.77% | 7 |
| <span class="VMSize">Standard_A3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 6.8 | <span class="Score">40,424</span> | 1,062 | 2.63% | 14 |
| <span class="VMSize">Standard_A4</span> | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 8 | 1 | 13.6 | <span class="Score">60,989</span> | 763 | 1.25% | 14 |
| <span class="VMSize">Standard_A4</span> | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 8 | 1 | 13.7 | <span class="Score">61,217</span> | 179 | 0.29% | 21 |
| <span class="VMSize">Standard_A4</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 13.7 | <span class="Score">62,162</span> | 4,457 | 7.17% | 91 |
| <span class="VMSize">Standard_A4</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 13.6 | <span class="Score">62,975</span> | 679 | 1.08% | 56 |
| <span class="VMSize">Standard_A4</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 13.7 | <span class="Score">60,900</span> | 271 | 0.45% | 7 |
| <span class="VMSize">Standard_A4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 13.7 | <span class="Score">81,917</span> | 323 | 0.39% | 14 |
| <span class="VMSize">Standard_A5</span> | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 2 | 1 | 13.7 | <span class="Score">15,130</span> | 37 | 0.25% | 7 |
| <span class="VMSize">Standard_A5</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 13.6 | <span class="Score">15,645</span> | 611 | 3.90% | 70 |
| <span class="VMSize">Standard_A5</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 13.7 | <span class="Score">16,058</span> | 299 | 1.86% | 98 |
| <span class="VMSize">Standard_A5</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 13.7 | <span class="Score">15,356</span> | 40 | 0.26% | 7 |
| <span class="VMSize">Standard_A5</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 13.7 | <span class="Score">20,393</span> | 237 | 1.16% | 14 |
| <span class="VMSize">Standard_A6</span> | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 27.4 | <span class="Score">30,419</span> | 266 | 0.88% | 21 |
| <span class="VMSize">Standard_A6</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 27.4 | <span class="Score">31,478</span> | 979 | 3.11% | 154 |
| <span class="VMSize">Standard_A6</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 27.4 | <span class="Score">30,197</span> | 170 | 0.56% | 7 |
| <span class="VMSize">Standard_A6</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 27.4 | <span class="Score">38,896</span> | 957 | 2.46% | 14 |
| <span class="VMSize">Standard_A7</span> | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 8 | 1 | 54.9 | <span class="Score">60,861</span> | 536 | 0.88% | 28 |
| <span class="VMSize">Standard_A7</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 54.9 | <span class="Score">63,163</span> | 673 | 1.07% | 161 |
| <span class="VMSize">Standard_A7</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 54.9 | <span class="Score">82,084</span> | 265 | 0.32% | 14 |

## Lv2 - Storage Optimized
(10/13/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_L8s_v2</span> | AMD EPYC 7551 32-Core Processor | 8 | 1 | 62.8 | <span class="Score">102,237</span> | 1,320 | 1.29% | 77 |
| <span class="VMSize">Standard_L16s_v2</span> | AMD EPYC 7551 32-Core Processor | 16 | 2 | 125.9 | <span class="Score">198,472</span> | 3,734 | 1.88% | 70 |
| <span class="VMSize">Standard_L32s_v2</span> | AMD EPYC 7551 32-Core Processor | 32 | 4 | 251.9 | <span class="Score">390,015</span> | 10,126 | 2.60% | 77 |
| <span class="VMSize">Standard_L48s_v2</span> | AMD EPYC 7551 32-Core Processor | 48 | 6 | 377.9 | <span class="Score">583,388</span> | 15,479 | 2.65% | 77 |
| <span class="VMSize">Standard_L64s_v2</span> | AMD EPYC 7551 32-Core Processor | 64 | 8 | 503.9 | <span class="Score">774,827</span> | 19,205 | 2.48% | 77 |
| <span class="VMSize">Standard_L80s_v2</span> | AMD EPYC 7551 32-Core Processor | 80 | 10 | 629.9 | <span class="Score">966,682</span> | 22,811 | 2.36% | 77 |

## Compute optimized
## Fsv2 - Compute + Storage Optimized
(10/10/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_F2s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 2 | 1 | 3.8 | <span class="Score">35,747</span> | 514 | 1.44% | 98 |
| <span class="VMSize">Standard_F2s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 2 | 1 | 3.8 | <span class="Score">35,951</span> | 465 | 1.29% | 105 |
| <span class="VMSize">Standard_F2s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 2 | 1 | 3.8 | <span class="Score">36,065</span> | 748 | 2.07% | 105 |
| <span class="VMSize">Standard_F2s_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 3.8 | <span class="Score">35,535</span> | 79 | 0.22% | 35 |
| <span class="VMSize">Standard_F2s_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 3.8 | <span class="Score">35,888</span> | 476 | 1.33% | 42 |
| <span class="VMSize">Standard_F2s_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 3.8 | <span class="Score">35,507</span> | 41 | 0.12% | 35 |
| <span class="VMSize">Standard_F4s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 4 | 1 | 7.7 | <span class="Score">65,624</span> | 384 | 0.58% | 35 |
| <span class="VMSize">Standard_F4s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 4 | 1 | 7.8 | <span class="Score">65,797</span> | 719 | 1.09% | 140 |
| <span class="VMSize">Standard_F4s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 4 | 1 | 7.8 | <span class="Score">66,210</span> | 1,444 | 2.18% | 42 |
| <span class="VMSize">Standard_F4s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 4 | 1 | 7.7 | <span class="Score">65,589</span> | 424 | 0.65% | 28 |
| <span class="VMSize">Standard_F4s_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 7.8 | <span class="Score">65,625</span> | 473 | 0.72% | 49 |
| <span class="VMSize">Standard_F4s_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 7.8 | <span class="Score">65,741</span> | 442 | 0.67% | 49 |
| <span class="VMSize">Standard_F8s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 8 | 1 | 15.6 | <span class="Score">136,015</span> | 1,308 | 0.96% | 161 |
| <span class="VMSize">Standard_F8s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 8 | 1 | 15.6 | <span class="Score">136,054</span> | 1,201 | 0.88% | 77 |
| <span class="VMSize">Standard_F8s_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 15.6 | <span class="Score">135,966</span> | 1,058 | 0.78% | 49 |
| <span class="VMSize">Standard_F8s_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 15.6 | <span class="Score">135,669</span> | 682 | 0.50% | 42 |
| <span class="VMSize">Standard_F16s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 16 | 1 | 31.3 | <span class="Score">272,051</span> | 1,559 | 0.57% | 63 |
| <span class="VMSize">Standard_F16s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 16 | 1 | 31.4 | <span class="Score">270,872</span> | 2,086 | 0.77% | 91 |
| <span class="VMSize">Standard_F16s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 16 | 1 | 31.4 | <span class="Score">270,950</span> | 1,968 | 0.73% | 70 |
| <span class="VMSize">Standard_F16s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 16 | 1 | 31.3 | <span class="Score">271,750</span> | 1,534 | 0.56% | 28 |
| <span class="VMSize">Standard_F16s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 16 | 1 | 31.4 | <span class="Score">272,039</span> | 2,115 | 0.78% | 21 |
| <span class="VMSize">Standard_F16s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 16 | 1 | 31.3 | <span class="Score">272,367</span> | 1,783 | 0.65% | 7 |
| <span class="VMSize">Standard_F16s_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 31.4 | <span class="Score">271,171</span> | 1,278 | 0.47% | 49 |
| <span class="VMSize">Standard_F16s_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 31.4 | <span class="Score">271,189</span> | 1,441 | 0.53% | 35 |
| <span class="VMSize">Standard_F16s_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 31.4 | <span class="Score">271,463</span> | 1,269 | 0.47% | 21 |
| <span class="VMSize">Standard_F32s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 32 | 1 | 62.8 | <span class="Score">539,014</span> | 3,770 | 0.70% | 154 |
| <span class="VMSize">Standard_F32s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 32 | 1 | 62.8 | <span class="Score">537,952</span> | 3,739 | 0.70% | 84 |
| <span class="VMSize">Standard_F32s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 32 | 1 | 62.8 | <span class="Score">541,941</span> | 2,719 | 0.50% | 7 |
| <span class="VMSize">Standard_F32s_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 62.8 | <span class="Score">537,746</span> | 7,210 | 1.34% | 49 |
| <span class="VMSize">Standard_F32s_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 62.8 | <span class="Score">537,145</span> | 8,624 | 1.61% | 35 |
| <span class="VMSize">Standard_F32s_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 62.8 | <span class="Score">542,949</span> | 2,525 | 0.47% | 7 |
| <span class="VMSize">Standard_F48s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 48 | 2 | 94.4 | <span class="Score">780,785</span> | 8,791 | 1.13% | 168 |
| <span class="VMSize">Standard_F48s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 48 | 2 | 94.4 | <span class="Score">778,334</span> | 7,620 | 0.98% | 14 |
| <span class="VMSize">Standard_F48s_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 94.3 | <span class="Score">749,662</span> | 21,751 | 2.90% | 56 |
| <span class="VMSize">Standard_F64s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 64 | 2 | 125.9 | <span class="Score">1,035,218</span> | 11,486 | 1.11% | 154 |
| <span class="VMSize">Standard_F64s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 64 | 2 | 125.9 | <span class="Score">1,036,935</span> | 12,247 | 1.18% | 21 |
| <span class="VMSize">Standard_F64s_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 125.9 | <span class="Score">1,022,958</span> | 17,594 | 1.72% | 56 |
| <span class="VMSize">Standard_F64s_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 125.9 | <span class="Score">1,031,140</span> | 13,512 | 1.31% | 7 |
| <span class="VMSize">Standard_F72s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 72 | 2 | 141.6 | <span class="Score">1,126,247</span> | 12,165 | 1.08% | 168 |
| <span class="VMSize">Standard_F72s_v2</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 72 | 2 | 141.6 | <span class="Score">1,124,044</span> | 11,432 | 1.02% | 14 |
| <span class="VMSize">Standard_F72s_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 72 | 2 | 141.6 | <span class="Score">1,120,116</span> | 15,662 | 1.40% | 42 |

## General purpose
## Av2 - General Compute
(09/24/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_A1_v2</span> | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 1 | 1 | 1.9 | <span class="Score">7,689</span> | 60 | 0.78% | 42 |
| <span class="VMSize">Standard_A1_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 1.9 | <span class="Score">8,090</span> | 213 | 2.63% | 70 |
| <span class="VMSize">Standard_A1_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 1.9 | <span class="Score">8,576</span> | 696 | 8.11% | 63 |
| <span class="VMSize">Standard_A1_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 1.9 | <span class="Score">7,738</span> | 313 | 4.05% | 63 |
| <span class="VMSize">Standard_A2_v2</span> | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 2 | 1 | 3.8 | <span class="Score">15,263</span> | 173 | 1.14% | 35 |
| <span class="VMSize">Standard_A2_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 3.8 | <span class="Score">15,879</span> | 705 | 4.44% | 56 |
| <span class="VMSize">Standard_A2_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 3.8 | <span class="Score">16,767</span> | 1,071 | 6.39% | 91 |
| <span class="VMSize">Standard_A2_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 3.8 | <span class="Score">15,798</span> | 795 | 5.03% | 49 |
| <span class="VMSize">Standard_A2_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 3.8 | <span class="Score">15,087</span> | 26 | 0.17% | 7 |
| <span class="VMSize">Standard_A2m_v2</span> | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 2 | 1 | 15.6 | <span class="Score">15,296</span> | 50 | 0.33% | 35 |
| <span class="VMSize">Standard_A2m_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 15.6 | <span class="Score">16,031</span> | 718 | 4.48% | 77 |
| <span class="VMSize">Standard_A2m_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 15.6 | <span class="Score">16,173</span> | 693 | 4.28% | 77 |
| <span class="VMSize">Standard_A2m_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 15.6 | <span class="Score">15,595</span> | 490 | 3.14% | 35 |
| <span class="VMSize">Standard_A2m_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 15.6 | <span class="Score">14,823</span> | 71 | 0.48% | 14 |
| <span class="VMSize">Standard_A4_v2</span> | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 7.7 | <span class="Score">30,303</span> | 289 | 0.95% | 21 |
| <span class="VMSize">Standard_A4_v2</span> | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 7.8 | <span class="Score">30,250</span> | 218 | 0.72% | 14 |
| <span class="VMSize">Standard_A4_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 7.8 | <span class="Score">31,757</span> | 418 | 1.32% | 49 |
| <span class="VMSize">Standard_A4_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 7.7 | <span class="Score">31,008</span> | 176 | 0.57% | 14 |
| <span class="VMSize">Standard_A4_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 7.8 | <span class="Score">34,602</span> | 2,442 | 7.06% | 35 |
| <span class="VMSize">Standard_A4_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 7.7 | <span class="Score">32,746</span> | 1,118 | 3.41% | 35 |
| <span class="VMSize">Standard_A4_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 7.7 | <span class="Score">30,998</span> | 881 | 2.84% | 35 |
| <span class="VMSize">Standard_A4_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 7.8 | <span class="Score">32,232</span> | 210 | 0.65% | 14 |
| <span class="VMSize">Standard_A4_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 7.8 | <span class="Score">28,524</span> | 480 | 1.68% | 14 |
| <span class="VMSize">Standard_A4m_v2</span> | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 31.4 | <span class="Score">30,100</span> | 460 | 1.53% | 28 |
| <span class="VMSize">Standard_A4m_v2</span> | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 4 | 1 | 31.3 | <span class="Score">30,413</span> | 61 | 0.20% | 7 |
| <span class="VMSize">Standard_A4m_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 31.4 | <span class="Score">31,880</span> | 473 | 1.48% | 49 |
| <span class="VMSize">Standard_A4m_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 31.3 | <span class="Score">30,762</span> | 1,009 | 3.28% | 21 |
| <span class="VMSize">Standard_A4m_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 31.3 | <span class="Score">34,386</span> | 2,087 | 6.07% | 56 |
| <span class="VMSize">Standard_A4m_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 31.4 | <span class="Score">29,844</span> | 4,111 | 13.77% | 21 |
| <span class="VMSize">Standard_A4m_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 31.3 | <span class="Score">30,571</span> | 887 | 2.90% | 21 |
| <span class="VMSize">Standard_A4m_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 31.4 | <span class="Score">29,996</span> | 118 | 0.39% | 35 |
| <span class="VMSize">Standard_A8_v2</span> | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 8 | 1 | 15.6 | <span class="Score">61,206</span> | 333 | 0.54% | 35 |
| <span class="VMSize">Standard_A8_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 15.6 | <span class="Score">62,640</span> | 2,304 | 3.68% | 84 |
| <span class="VMSize">Standard_A8_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 15.6 | <span class="Score">63,555</span> | 1,607 | 2.53% | 49 |
| <span class="VMSize">Standard_A8_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 15.6 | <span class="Score">61,686</span> | 1,528 | 2.48% | 70 |
| <span class="VMSize">Standard_A8m_v2</span> | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 8 | 2 | 62.9 | <span class="Score">60,101</span> | 987 | 1.64% | 42 |
| <span class="VMSize">Standard_A8m_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 62.8 | <span class="Score">63,085</span> | 509 | 0.81% | 70 |
| <span class="VMSize">Standard_A8m_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 62.8 | <span class="Score">64,624</span> | 2,560 | 3.96% | 77 |
| <span class="VMSize">Standard_A8m_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 62.8 | <span class="Score">61,223</span> | 872 | 1.42% | 42 |

## B - Burstable
(09/24/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_B1s</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 0.9 | <span class="Score">18,768</span> | 429 | 2.29% | 35 |
| <span class="VMSize">Standard_B1s</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 0.9 | <span class="Score">19,725</span> | 1,258 | 6.38% | 112 |
| <span class="VMSize">Standard_B1s</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 0.9 | <span class="Score">18,287</span> | 2,316 | 12.66% | 70 |
| <span class="VMSize">Standard_B1s</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 0.9 | <span class="Score">21,992</span> | 371 | 1.69% | 21 |
| <span class="VMSize">Standard_B1ls</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 0.4 | <span class="Score">19,162</span> | 605 | 3.16% | 28 |
| <span class="VMSize">Standard_B1ls</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 0.4 | <span class="Score">19,365</span> | 810 | 4.18% | 126 |
| <span class="VMSize">Standard_B1ls</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 0.4 | <span class="Score">18,780</span> | 2,840 | 15.12% | 63 |
| <span class="VMSize">Standard_B1ls</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 0.4 | <span class="Score">21,954</span> | 461 | 2.10% | 21 |
| <span class="VMSize">Standard_B1ms</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 1.9 | <span class="Score">18,167</span> | 82 | 0.45% | 14 |
| <span class="VMSize">Standard_B1ms</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 1.9 | <span class="Score">20,113</span> | 1,188 | 5.90% | 126 |
| <span class="VMSize">Standard_B1ms</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 1.9 | <span class="Score">18,882</span> | 2,434 | 12.89% | 77 |
| <span class="VMSize">Standard_B1ms</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 1.9 | <span class="Score">22,182</span> | 57 | 0.26% | 21 |
| <span class="VMSize">Standard_B2s</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 3.8 | <span class="Score">36,074</span> | 431 | 1.20% | 21 |
| <span class="VMSize">Standard_B2s</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 3.8 | <span class="Score">37,634</span> | 1,445 | 3.84% | 119 |
| <span class="VMSize">Standard_B2s</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 3.8 | <span class="Score">37,824</span> | 5,913 | 15.63% | 70 |
| <span class="VMSize">Standard_B2s</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 3.8 | <span class="Score">44,147</span> | 397 | 0.90% | 28 |
| <span class="VMSize">Standard_B2ms</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 7.7 | <span class="Score">36,044</span> | 137 | 0.38% | 14 |
| <span class="VMSize">Standard_B2ms</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 7.8 | <span class="Score">36,632</span> | 157 | 0.43% | 14 |
| <span class="VMSize">Standard_B2ms</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 7.8 | <span class="Score">37,499</span> | 1,837 | 4.90% | 63 |
| <span class="VMSize">Standard_B2ms</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 7.7 | <span class="Score">38,618</span> | 1,444 | 3.74% | 56 |
| <span class="VMSize">Standard_B2ms</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 7.8 | <span class="Score">36,826</span> | 4,926 | 13.38% | 63 |
| <span class="VMSize">Standard_B2ms</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 7.7 | <span class="Score">49,168</span> | 501 | 1.02% | 7 |
| <span class="VMSize">Standard_B2ms</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 7.8 | <span class="Score">44,227</span> | 349 | 0.79% | 21 |
| <span class="VMSize">Standard_B4ms</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 15.6 | <span class="Score">70,362</span> | 3,310 | 4.70% | 28 |
| <span class="VMSize">Standard_B4ms</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 15.6 | <span class="Score">74,405</span> | 2,647 | 3.56% | 112 |
| <span class="VMSize">Standard_B4ms</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 15.6 | <span class="Score">71,174</span> | 8,008 | 11.25% | 77 |
| <span class="VMSize">Standard_B4ms</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 15.6 | <span class="Score">85,894</span> | 1,445 | 1.68% | 21 |
| <span class="VMSize">Standard_B8ms</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 31.4 | <span class="Score">146,987</span> | 470 | 0.32% | 21 |
| <span class="VMSize">Standard_B8ms</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 31.3 | <span class="Score">141,401</span> | 2,118 | 1.50% | 14 |
| <span class="VMSize">Standard_B8ms</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 31.3 | <span class="Score">144,994</span> | 1,595 | 1.10% | 77 |
| <span class="VMSize">Standard_B8ms</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 31.4 | <span class="Score">145,146</span> | 812 | 0.56% | 21 |
| <span class="VMSize">Standard_B8ms</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 31.3 | <span class="Score">142,930</span> | 1,509 | 1.06% | 21 |
| <span class="VMSize">Standard_B8ms</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 31.4 | <span class="Score">137,487</span> | 13,573 | 9.87% | 63 |
| <span class="VMSize">Standard_B8ms</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 31.4 | <span class="Score">170,427</span> | 2,402 | 1.41% | 14 |
| <span class="VMSize">Standard_B12ms</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 12 | 1 | 47.1 | <span class="Score">219,829</span> | 1,398 | 0.64% | 7 |
| <span class="VMSize">Standard_B12ms</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 12 | 1 | 47.0 | <span class="Score">213,031</span> | 4,092 | 1.92% | 21 |
| <span class="VMSize">Standard_B12ms</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 12 | 1 | 47.0 | <span class="Score">219,374</span> | 2,513 | 1.15% | 84 |
| <span class="VMSize">Standard_B12ms</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 12 | 1 | 47.1 | <span class="Score">219,409</span> | 845 | 0.38% | 28 |
| <span class="VMSize">Standard_B12ms</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 12 | 1 | 47.1 | <span class="Score">201,820</span> | 17,647 | 8.74% | 70 |
| <span class="VMSize">Standard_B12ms</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 12 | 1 | 47.0 | <span class="Score">213,829</span> | 818 | 0.38% | 7 |
| <span class="VMSize">Standard_B12ms</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 12 | 1 | 47.1 | <span class="Score">256,373</span> | 1,768 | 0.69% | 21 |
| <span class="VMSize">Standard_B16ms</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 62.9 | <span class="Score">276,669</span> | 8,921 | 3.22% | 35 |
| <span class="VMSize">Standard_B16ms</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 62.8 | <span class="Score">294,079</span> | 3,437 | 1.17% | 112 |
| <span class="VMSize">Standard_B16ms</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 62.8 | <span class="Score">270,563</span> | 27,650 | 10.22% | 70 |
| <span class="VMSize">Standard_B16ms</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 62.8 | <span class="Score">340,582</span> | 6,378 | 1.87% | 21 |
| <span class="VMSize">Standard_B20ms</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 20 | 2 | 78.6 | <span class="Score">347,035</span> | 6,272 | 1.81% | 7 |
| <span class="VMSize">Standard_B20ms</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 20 | 2 | 78.7 | <span class="Score">347,278</span> | 6,146 | 1.77% | 7 |
| <span class="VMSize">Standard_B20ms</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 20 | 1 | 78.5 | <span class="Score">363,144</span> | 3,598 | 0.99% | 77 |
| <span class="VMSize">Standard_B20ms</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 20 | 1 | 78.6 | <span class="Score">363,353</span> | 4,370 | 1.20% | 35 |
| <span class="VMSize">Standard_B20ms</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 20 | 1 | 78.6 | <span class="Score">340,887</span> | 22,155 | 6.50% | 84 |
| <span class="VMSize">Standard_B20ms</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 20 | 1 | 78.5 | <span class="Score">358,116</span> | 1,617 | 0.45% | 7 |
| <span class="VMSize">Standard_B20ms</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 78.6 | <span class="Score">416,103</span> | 3,337 | 0.80% | 21 |

## DSv3 - General Compute + Premium Storage
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_D2s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 7.7 | <span class="Score">24,941</span> | 165 | 0.66% | 14 |
| <span class="VMSize">Standard_D2s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 7.8 | <span class="Score">27,510</span> | 114 | 0.41% | 14 |
| <span class="VMSize">Standard_D2s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 7.7 | <span class="Score">26,711</span> | 271 | 1.01% | 7 |
| <span class="VMSize">Standard_D2s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 7.8 | <span class="Score">28,456</span> | 1,277 | 4.49% | 14 |
| <span class="VMSize">Standard_D2s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 7.7 | <span class="Score">27,578</span> | 2,196 | 7.96% | 70 |
| <span class="VMSize">Standard_D2s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 7.7 | <span class="Score">27,664</span> | 2,208 | 7.98% | 28 |
| <span class="VMSize">Standard_D2s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 7.8 | <span class="Score">26,584</span> | 675 | 2.54% | 63 |
| <span class="VMSize">Standard_D2s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 7.8 | <span class="Score">31,342</span> | 18 | 0.06% | 21 |
| <span class="VMSize">Standard_D4s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 15.6 | <span class="Score">50,716</span> | 1,058 | 2.09% | 35 |
| <span class="VMSize">Standard_D4s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 15.6 | <span class="Score">52,445</span> | 3,515 | 6.70% | 77 |
| <span class="VMSize">Standard_D4s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 15.6 | <span class="Score">50,029</span> | 3,332 | 6.66% | 91 |
| <span class="VMSize">Standard_D4s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 15.6 | <span class="Score">57,991</span> | 277 | 0.48% | 35 |
| <span class="VMSize">Standard_D8s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 31.3 | <span class="Score">99,350</span> | 179 | 0.18% | 7 |
| <span class="VMSize">Standard_D8s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 31.3 | <span class="Score">101,431</span> | 8,392 | 8.27% | 98 |
| <span class="VMSize">Standard_D8s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 31.4 | <span class="Score">99,730</span> | 3,179 | 3.19% | 28 |
| <span class="VMSize">Standard_D8s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 31.4 | <span class="Score">100,765</span> | 1,636 | 1.62% | 28 |
| <span class="VMSize">Standard_D8s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 31.3 | <span class="Score">104,205</span> | 3,364 | 3.23% | 28 |
| <span class="VMSize">Standard_D8s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 31.4 | <span class="Score">120,003</span> | 546 | 0.46% | 35 |
| <span class="VMSize">Standard_D16s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 1 | 62.8 | <span class="Score">199,434</span> | 1,886 | 0.95% | 35 |
| <span class="VMSize">Standard_D16s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 62.8 | <span class="Score">196,242</span> | 5,336 | 2.72% | 77 |
| <span class="VMSize">Standard_D16s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 62.8 | <span class="Score">200,086</span> | 3,164 | 1.58% | 98 |
| <span class="VMSize">Standard_D16s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 62.8 | <span class="Score">239,837</span> | 1,457 | 0.61% | 28 |
| <span class="VMSize">Standard_D32s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 32 | 2 | 125.9 | <span class="Score">389,200</span> | 3,438 | 0.88% | 35 |
| <span class="VMSize">Standard_D32s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 1 | 125.8 | <span class="Score">390,983</span> | 1,845 | 0.47% | 91 |
| <span class="VMSize">Standard_D32s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 1 | 125.8 | <span class="Score">397,239</span> | 2,996 | 0.75% | 77 |
| <span class="VMSize">Standard_D32s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 125.8 | <span class="Score">478,885</span> | 1,968 | 0.41% | 35 |
| <span class="VMSize">Standard_D32-8s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 2 | 125.9 | <span class="Score">101,726</span> | 2,382 | 2.34% | 42 |
| <span class="VMSize">Standard_D32-8s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 125.8 | <span class="Score">105,753</span> | 5,955 | 5.63% | 98 |
| <span class="VMSize">Standard_D32-8s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 125.8 | <span class="Score">107,108</span> | 4,937 | 4.61% | 105 |
| <span class="VMSize">Standard_D32-8s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 125.8 | <span class="Score">120,209</span> | 743 | 0.62% | 21 |
| <span class="VMSize">Standard_D32-16s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 125.9 | <span class="Score">196,647</span> | 3,095 | 1.57% | 49 |
| <span class="VMSize">Standard_D32-16s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 125.8 | <span class="Score">197,817</span> | 4,826 | 2.44% | 84 |
| <span class="VMSize">Standard_D32-16s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 125.8 | <span class="Score">201,608</span> | 3,166 | 1.57% | 119 |
| <span class="VMSize">Standard_D32-16s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 125.8 | <span class="Score">240,473</span> | 992 | 0.41% | 14 |
| <span class="VMSize">Standard_D48s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 48 | 2 | 188.9 | <span class="Score">571,460</span> | 4,725 | 0.83% | 112 |
| <span class="VMSize">Standard_D48s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 48 | 1 | 188.7 | <span class="Score">581,930</span> | 3,357 | 0.58% | 63 |
| <span class="VMSize">Standard_D48s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 48 | 2 | 188.9 | <span class="Score">578,181</span> | 5,736 | 0.99% | 35 |
| <span class="VMSize">Standard_D48s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 188.7 | <span class="Score">698,208</span> | 8,889 | 1.27% | 28 |
| <span class="VMSize">Standard_D64s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 64 | 2 | 251.9 | <span class="Score">761,965</span> | 4,971 | 0.65% | 49 |
| <span class="VMSize">Standard_D64s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 64 | 2 | 251.9 | <span class="Score">767,645</span> | 10,497 | 1.37% | 154 |
| <span class="VMSize">Standard_D64s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 251.9 | <span class="Score">909,271</span> | 7,791 | 0.86% | 28 |
| <span class="VMSize">Standard_D64-16s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 2 | 251.9 | <span class="Score">234,884</span> | 2,434 | 1.04% | 28 |
| <span class="VMSize">Standard_D64-16s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 251.7 | <span class="Score">206,157</span> | 4,216 | 2.04% | 168 |
| <span class="VMSize">Standard_D64-16s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 2 | 251.9 | <span class="Score">209,045</span> | 11,695 | 5.59% | 42 |
| <span class="VMSize">Standard_D64-16s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 251.7 | <span class="Score">240,195</span> | 1,105 | 0.46% | 21 |
| <span class="VMSize">Standard_D64-32s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 2 | 251.9 | <span class="Score">411,563</span> | 3,587 | 0.87% | 28 |
| <span class="VMSize">Standard_D64-32s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 1 | 251.7 | <span class="Score">399,849</span> | 1,906 | 0.48% | 161 |
| <span class="VMSize">Standard_D64-32s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 2 | 251.9 | <span class="Score">395,114</span> | 9,722 | 2.46% | 49 |
| <span class="VMSize">Standard_D64-32s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 251.7 | <span class="Score">479,644</span> | 2,193 | 0.46% | 21 |

## Dv3 - General Compute
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_D2_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 7.8 | <span class="Score">25,572</span> | 987 | 3.86% | 63 |
| <span class="VMSize">Standard_D2_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 7.7 | <span class="Score">25,268</span> | 937 | 3.71% | 28 |
| <span class="VMSize">Standard_D2_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 7.8 | <span class="Score">26,544</span> | 1,708 | 6.43% | 42 |
| <span class="VMSize">Standard_D2_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 7.7 | <span class="Score">26,686</span> | 657 | 2.46% | 28 |
| <span class="VMSize">Standard_D2_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 7.7 | <span class="Score">28,394</span> | 1,802 | 6.35% | 21 |
| <span class="VMSize">Standard_D2_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 7.8 | <span class="Score">26,569</span> | 1,313 | 4.94% | 49 |
| <span class="VMSize">Standard_D2_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 7.8 | <span class="Score">31,352</span> | 22 | 0.07% | 7 |
| <span class="VMSize">Standard_D4_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 15.6 | <span class="Score">49,708</span> | 2,668 | 5.37% | 77 |
| <span class="VMSize">Standard_D4_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 15.6 | <span class="Score">51,650</span> | 3,799 | 7.35% | 91 |
| <span class="VMSize">Standard_D4_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 15.6 | <span class="Score">50,025</span> | 2,210 | 4.42% | 70 |
| <span class="VMSize">Standard_D8_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 31.3 | <span class="Score">100,278</span> | 1,144 | 1.14% | 49 |
| <span class="VMSize">Standard_D8_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 31.4 | <span class="Score">100,566</span> | 1,479 | 1.47% | 49 |
| <span class="VMSize">Standard_D8_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 31.3 | <span class="Score">98,018</span> | 6,731 | 6.87% | 70 |
| <span class="VMSize">Standard_D8_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 31.4 | <span class="Score">97,339</span> | 344 | 0.35% | 21 |
| <span class="VMSize">Standard_D8_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 31.4 | <span class="Score">100,365</span> | 1,478 | 1.47% | 14 |
| <span class="VMSize">Standard_D8_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 31.3 | <span class="Score">101,057</span> | 1,630 | 1.61% | 28 |
| <span class="VMSize">Standard_D8_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 31.4 | <span class="Score">120,063</span> | 559 | 0.47% | 7 |
| <span class="VMSize">Standard_D16_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 1 | 62.8 | <span class="Score">198,362</span> | 2,228 | 1.12% | 84 |
| <span class="VMSize">Standard_D16_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 62.8 | <span class="Score">193,498</span> | 2,080 | 1.07% | 77 |
| <span class="VMSize">Standard_D16_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 62.8 | <span class="Score">199,683</span> | 1,862 | 0.93% | 63 |
| <span class="VMSize">Standard_D16_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 62.8 | <span class="Score">239,145</span> | 1,767 | 0.74% | 7 |
| <span class="VMSize">Standard_D32_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 32 | 2 | 125.9 | <span class="Score">387,724</span> | 3,770 | 0.97% | 63 |
| <span class="VMSize">Standard_D32_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 1 | 125.8 | <span class="Score">388,466</span> | 9,936 | 2.56% | 112 |
| <span class="VMSize">Standard_D32_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 1 | 125.8 | <span class="Score">397,605</span> | 2,423 | 0.61% | 49 |
| <span class="VMSize">Standard_D32_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 125.8 | <span class="Score">479,158</span> | 1,356 | 0.28% | 14 |
| <span class="VMSize">Standard_D48_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 48 | 2 | 188.9 | <span class="Score">569,331</span> | 6,445 | 1.13% | 140 |
| <span class="VMSize">Standard_D48_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 48 | 1 | 188.7 | <span class="Score">578,441</span> | 6,615 | 1.14% | 70 |
| <span class="VMSize">Standard_D48_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 48 | 2 | 188.9 | <span class="Score">576,459</span> | 7,500 | 1.30% | 21 |
| <span class="VMSize">Standard_D48_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 188.7 | <span class="Score">693,147</span> | 8,980 | 1.30% | 7 |
| <span class="VMSize">Standard_D64_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 64 | 2 | 251.9 | <span class="Score">762,667</span> | 5,489 | 0.72% | 42 |
| <span class="VMSize">Standard_D64_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 64 | 2 | 251.9 | <span class="Score">766,739</span> | 7,516 | 0.98% | 189 |
| <span class="VMSize">Standard_D64_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 251.9 | <span class="Score">916,549</span> | 8,944 | 0.98% | 7 |

## Dasv4
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_D2as_v4</span> | AMD EPYC 7452 32-Core Processor | 2 | 1 | 7.8 | <span class="Score">38,230</span> | 313 | 0.82% | 77 |
| <span class="VMSize">Standard_D4as_v4</span> | AMD EPYC 7452 32-Core Processor | 4 | 1 | 15.6 | <span class="Score">71,707</span> | 790 | 1.10% | 98 |
| <span class="VMSize">Standard_D8as_v4</span> | AMD EPYC 7452 32-Core Processor | 8 | 1 | 31.4 | <span class="Score">151,474</span> | 1,599 | 1.06% | 56 |
| <span class="VMSize">Standard_D16as_v4</span> | AMD EPYC 7452 32-Core Processor | 16 | 2 | 62.9 | <span class="Score">292,074</span> | 9,782 | 3.35% | 91 |
| <span class="VMSize">Standard_D32as_v4</span> | AMD EPYC 7452 32-Core Processor | 32 | 4 | 125.9 | <span class="Score">575,465</span> | 14,574 | 2.53% | 98 |
| <span class="VMSize">Standard_D48as_v4</span> | AMD EPYC 7452 32-Core Processor | 48 | 6 | 188.9 | <span class="Score">843,316</span> | 21,739 | 2.58% | 105 |
| <span class="VMSize">Standard_D64as_v4</span> | AMD EPYC 7452 32-Core Processor | 64 | 8 | 251.9 | <span class="Score">1,120,467</span> | 30,714 | 2.74% | 7 |

## Dav4
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_D2a_v4</span> | AMD EPYC 7452 32-Core Processor | 2 | 1 | 7.8 | <span class="Score">38,061</span> | 1,219 | 3.20% | 119 |
| <span class="VMSize">Standard_D4a_v4</span> | AMD EPYC 7452 32-Core Processor | 4 | 1 | 15.6 | <span class="Score">70,996</span> | 2,280 | 3.21% | 140 |
| <span class="VMSize">Standard_D8a_v4</span> | AMD EPYC 7452 32-Core Processor | 8 | 1 | 31.4 | <span class="Score">151,379</span> | 1,946 | 1.29% | 147 |
| <span class="VMSize">Standard_D16a_v4</span> | AMD EPYC 7452 32-Core Processor | 16 | 2 | 62.9 | <span class="Score">293,654</span> | 6,263 | 2.13% | 161 |
| <span class="VMSize">Standard_D32a_v4</span> | AMD EPYC 7452 32-Core Processor | 32 | 4 | 125.9 | <span class="Score">571,897</span> | 16,009 | 2.80% | 147 |
| <span class="VMSize">Standard_D48a_v4</span> | AMD EPYC 7452 32-Core Processor | 48 | 6 | 188.9 | <span class="Score">837,332</span> | 22,923 | 2.74% | 161 |
| <span class="VMSize">Standard_D64a_v4</span> | AMD EPYC 7452 32-Core Processor | 64 | 8 | 251.9 | <span class="Score">1,126,793</span> | 29,148 | 2.59% | 21 |
| <span class="VMSize">Standard_D96a_v4</span> | AMD EPYC 7452 32-Core Processor | 96 | 12 | 377.9 | <span class="Score">1,590,434</span> | 31,887 | 2.00% | 14 |

## DCS - Confidential Compute Series
(10/01/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_DC2s</span> | Intel(R) Xeon(R) E-2176G CPU @ 3.70GHz | 2 | 1 | 7.8 | <span class="Score">63,114</span> | 271 | 0.43% | 14 |
| <span class="VMSize">Standard_DC2s</span> | Intel(R) Xeon(R) E-2176G CPU @ 3.70GHz | 2 | 1 | 7.8 | <span class="Score">63,738</span> | 189 | 0.30% | 14 |
| <span class="VMSize">Standard_DC4s</span> | Intel(R) Xeon(R) E-2176G CPU @ 3.70GHz | 4 | 1 | 15.6 | <span class="Score">123,683</span> | 460 | 0.37% | 7 |
| <span class="VMSize">Standard_DC4s</span> | Intel(R) Xeon(R) E-2176G CPU @ 3.70GHz | 4 | 1 | 15.6 | <span class="Score">124,182</span> | 267 | 0.21% | 14 |

## DCsv2
(10/08/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_DC1s_v2</span> | Intel(R) Xeon(R) E-2288G CPU @ 3.70GHz | 1 | 1 | 3.8 | <span class="Score">34,418</span> | 162 | 0.47% | 77 |
| <span class="VMSize">Standard_DC2s_v2</span> | Intel(R) Xeon(R) E-2288G CPU @ 3.70GHz | 2 | 1 | 7.8 | <span class="Score">68,562</span> | 758 | 1.11% | 77 |
| <span class="VMSize">Standard_DC4s_v2</span> | Intel(R) Xeon(R) E-2288G CPU @ 3.70GHz | 4 | 1 | 15.6 | <span class="Score">133,836</span> | 1,964 | 1.47% | 77 |

## DCv2
(10/13/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_DC8_v2</span> | Intel(R) Xeon(R) E-2288G CPU @ 3.70GHz | 8 | 1 | 31.4 | <span class="Score">252,047</span> | 3,051 | 1.21% | 77 |

## DDSv4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_D2ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 7.8 | <span class="Score">35,557</span> | 740 | 2.08% | 189 |
| <span class="VMSize">Standard_D4ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 15.6 | <span class="Score">65,958</span> | 788 | 1.19% | 189 |
| <span class="VMSize">Standard_D8ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 31.4 | <span class="Score">135,907</span> | 1,108 | 0.81% | 189 |
| <span class="VMSize">Standard_D16ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 62.8 | <span class="Score">271,137</span> | 1,374 | 0.51% | 189 |
| <span class="VMSize">Standard_D32ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 125.8 | <span class="Score">540,212</span> | 4,954 | 0.92% | 189 |
| <span class="VMSize">Standard_D48ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 188.7 | <span class="Score">756,538</span> | 15,048 | 1.99% | 154 |
| <span class="VMSize">Standard_D48ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 188.9 | <span class="Score">775,291</span> | 11,776 | 1.52% | 35 |
| <span class="VMSize">Standard_D64ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 251.9 | <span class="Score">1,025,017</span> | 14,482 | 1.41% | 182 |

## DDv4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_D2d_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 7.8 | <span class="Score">35,640</span> | 371 | 1.04% | 189 |
| <span class="VMSize">Standard_D4d_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 15.6 | <span class="Score">65,767</span> | 590 | 0.90% | 189 |
| <span class="VMSize">Standard_D8d_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 31.4 | <span class="Score">135,756</span> | 901 | 0.66% | 189 |
| <span class="VMSize">Standard_D16d_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 62.8 | <span class="Score">271,216</span> | 1,630 | 0.60% | 189 |
| <span class="VMSize">Standard_D32d_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 125.8 | <span class="Score">540,052</span> | 4,426 | 0.82% | 189 |
| <span class="VMSize">Standard_D48d_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 188.7 | <span class="Score">744,246</span> | 20,864 | 2.80% | 147 |
| <span class="VMSize">Standard_D48d_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 188.9 | <span class="Score">769,702</span> | 10,800 | 1.40% | 42 |
| <span class="VMSize">Standard_D64d_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 251.9 | <span class="Score">1,021,118</span> | 15,896 | 1.56% | 189 |

## Dsv4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_D2s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 7.8 | <span class="Score">35,794</span> | 578 | 1.61% | 175 |
| <span class="VMSize">Standard_D4s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 15.6 | <span class="Score">65,910</span> | 668 | 1.01% | 182 |
| <span class="VMSize">Standard_D8s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 31.4 | <span class="Score">135,542</span> | 835 | 0.62% | 182 |
| <span class="VMSize">Standard_D16s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 62.8 | <span class="Score">271,053</span> | 1,429 | 0.53% | 182 |
| <span class="VMSize">Standard_D32s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 125.8 | <span class="Score">539,271</span> | 8,236 | 1.53% | 182 |
| <span class="VMSize">Standard_D48s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 188.7 | <span class="Score">743,539</span> | 18,204 | 2.45% | 140 |
| <span class="VMSize">Standard_D48s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 188.9 | <span class="Score">772,877</span> | 9,466 | 1.22% | 35 |
| <span class="VMSize">Standard_D64s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 251.9 | <span class="Score">1,024,799</span> | 15,499 | 1.51% | 182 |

## Dv4
(09/21/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_D2_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 7.8 | <span class="Score">35,651</span> | 228 | 0.64% | 182 |
| <span class="VMSize">Standard_D4_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 15.6 | <span class="Score">65,896</span> | 647 | 0.98% | 175 |
| <span class="VMSize">Standard_D8_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 31.4 | <span class="Score">135,803</span> | 963 | 0.71% | 182 |
| <span class="VMSize">Standard_D16_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 62.8 | <span class="Score">271,203</span> | 1,345 | 0.50% | 182 |
| <span class="VMSize">Standard_D32_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 125.8 | <span class="Score">539,406</span> | 5,745 | 1.07% | 182 |
| <span class="VMSize">Standard_D48_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 1 | 188.7 | <span class="Score">745,137</span> | 17,607 | 2.36% | 154 |
| <span class="VMSize">Standard_D48_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 188.9 | <span class="Score">771,269</span> | 7,936 | 1.03% | 28 |
| <span class="VMSize">Standard_D64_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 251.9 | <span class="Score">1,020,266</span> | 19,814 | 1.94% | 182 |

## High performance compute
## H - High Performance Compute (HPC)
(10/14/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_H8</span> | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 8 | 1 | 54.9 | <span class="Score">187,938</span> | 583 | 0.31% | 84 |
| <span class="VMSize">Standard_H8m</span> | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 8 | 1 | 110.0 | <span class="Score">187,485</span> | 676 | 0.36% | 84 |
| <span class="VMSize">Standard_H16</span> | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 16 | 2 | 110.1 | <span class="Score">357,575</span> | 7,150 | 2.00% | 42 |
| <span class="VMSize">Standard_H16m</span> | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 16 | 2 | 220.4 | <span class="Score">356,089</span> | 8,598 | 2.41% | 42 |
| <span class="VMSize">Standard_H16mr</span> | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 16 | 2 | 220.4 | <span class="Score">355,363</span> | 8,104 | 2.28% | 42 |
| <span class="VMSize">Standard_H16r</span> | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 16 | 2 | 110.1 | <span class="Score">356,840</span> | 8,148 | 2.28% | 42 |

## HBrsv2
(10/16/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_HB120rs_v2</span> | AMD EPYC 7V12 64-Core Processor | 120 | 30 | 448.8 | <span class="Score">2,631,430</span> | 81,949 | 3.11% | 21 |

## HBS - memory bandwidth (AMD EPYC)
(10/14/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_HB60rs</span> | AMD EPYC 7551 32-Core Processor | 60 | 15 | 224.3 | <span class="Score">986,593</span> | 28,102 | 2.85% | 21 |

## HCS - dense computation (Intel Xeon Platinum 8168)
(10/14/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_HC44rs</span> | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 44 | 2 | 346.4 | <span class="Score">995,006</span> | 25,995 | 2.61% | 21 |

## Memory optimized
## DSv2 - Storage Optimized
(09/30/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_DS1_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 3.4 | <span class="Score">19,102</span> | 870 | 4.55% | 35 |
| <span class="VMSize">Standard_DS1_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 3.3 | <span class="Score">18,575</span> | 798 | 4.30% | 14 |
| <span class="VMSize">Standard_DS1_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 3.3 | <span class="Score">19,895</span> | 924 | 4.64% | 56 |
| <span class="VMSize">Standard_DS1_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 3.4 | <span class="Score">20,752</span> | 642 | 3.10% | 14 |
| <span class="VMSize">Standard_DS1_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 3.4 | <span class="Score">19,877</span> | 1,759 | 8.85% | 84 |
| <span class="VMSize">Standard_DS1_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 3.3 | <span class="Score">18,786</span> | 600 | 3.20% | 14 |
| <span class="VMSize">Standard_DS1_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 3.4 | <span class="Score">22,210</span> | 25 | 0.11% | 14 |
| <span class="VMSize">Standard_DS2_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 6.8 | <span class="Score">37,635</span> | 977 | 2.60% | 70 |
| <span class="VMSize">Standard_DS2_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 6.8 | <span class="Score">39,784</span> | 2,446 | 6.15% | 84 |
| <span class="VMSize">Standard_DS2_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 6.8 | <span class="Score">37,761</span> | 1,322 | 3.50% | 70 |
| <span class="VMSize">Standard_DS2_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 6.8 | <span class="Score">44,728</span> | 39 | 0.09% | 7 |
| <span class="VMSize">Standard_DS3_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 13.6 | <span class="Score">72,874</span> | 1,809 | 2.48% | 56 |
| <span class="VMSize">Standard_DS3_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 13.7 | <span class="Score">74,142</span> | 685 | 0.92% | 14 |
| <span class="VMSize">Standard_DS3_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 13.7 | <span class="Score">74,717</span> | 5,368 | 7.18% | 35 |
| <span class="VMSize">Standard_DS3_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 13.6 | <span class="Score">76,449</span> | 2,608 | 3.41% | 35 |
| <span class="VMSize">Standard_DS3_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 13.6 | <span class="Score">72,710</span> | 1,182 | 1.63% | 28 |
| <span class="VMSize">Standard_DS3_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 13.7 | <span class="Score">72,348</span> | 1,243 | 1.72% | 63 |
| <span class="VMSize">Standard_DS4_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 27.4 | <span class="Score">146,804</span> | 1,270 | 0.86% | 49 |
| <span class="VMSize">Standard_DS4_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 27.4 | <span class="Score">147,510</span> | 3,214 | 2.18% | 98 |
| <span class="VMSize">Standard_DS4_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 27.4 | <span class="Score">144,002</span> | 1,731 | 1.20% | 70 |
| <span class="VMSize">Standard_DS4_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 27.4 | <span class="Score">116,687</span> | 59,050 | 50.61% | 14 |
| <span class="VMSize">Standard_DS5_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 55.0 | <span class="Score">284,713</span> | 4,702 | 1.65% | 63 |
| <span class="VMSize">Standard_DS5_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 54.9 | <span class="Score">297,550</span> | 1,502 | 0.50% | 70 |
| <span class="VMSize">Standard_DS5_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 54.9 | <span class="Score">287,238</span> | 4,723 | 1.64% | 84 |
| <span class="VMSize">Standard_DS5_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 54.9 | <span class="Score">345,144</span> | 2,027 | 0.59% | 14 |
| <span class="VMSize">Standard_DS11_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 13.7 | <span class="Score">37,809</span> | 1,561 | 4.13% | 28 |
| <span class="VMSize">Standard_DS11_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 13.6 | <span class="Score">37,063</span> | 720 | 1.94% | 21 |
| <span class="VMSize">Standard_DS11_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 13.6 | <span class="Score">40,002</span> | 2,903 | 7.26% | 42 |
| <span class="VMSize">Standard_DS11_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 13.7 | <span class="Score">40,342</span> | 3,836 | 9.51% | 28 |
| <span class="VMSize">Standard_DS11_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 13.7 | <span class="Score">37,470</span> | 602 | 1.61% | 63 |
| <span class="VMSize">Standard_DS11_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 13.6 | <span class="Score">39,147</span> | 1,284 | 3.28% | 21 |
| <span class="VMSize">Standard_DS11_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 13.7 | <span class="Score">44,107</span> | 406 | 0.92% | 28 |
| <span class="VMSize">Standard_DS11-1_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 13.7 | <span class="Score">19,904</span> | 907 | 4.56% | 28 |
| <span class="VMSize">Standard_DS11-1_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 13.6 | <span class="Score">19,038</span> | 92 | 0.48% | 14 |
| <span class="VMSize">Standard_DS11-1_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 13.6 | <span class="Score">21,121</span> | 2,000 | 9.47% | 35 |
| <span class="VMSize">Standard_DS11-1_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 13.7 | <span class="Score">19,407</span> | 328 | 1.69% | 7 |
| <span class="VMSize">Standard_DS11-1_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 13.6 | <span class="Score">18,118</span> | 248 | 1.37% | 42 |
| <span class="VMSize">Standard_DS11-1_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 13.7 | <span class="Score">19,088</span> | 733 | 3.84% | 84 |
| <span class="VMSize">Standard_DS11-1_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 13.7 | <span class="Score">23,145</span> | 1,425 | 6.16% | 21 |
| <span class="VMSize">Standard_DS12_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 27.4 | <span class="Score">73,222</span> | 1,506 | 2.06% | 42 |
| <span class="VMSize">Standard_DS12_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 27.4 | <span class="Score">76,452</span> | 5,858 | 7.66% | 77 |
| <span class="VMSize">Standard_DS12_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 27.4 | <span class="Score">73,140</span> | 3,323 | 4.54% | 84 |
| <span class="VMSize">Standard_DS12_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 27.4 | <span class="Score">86,916</span> | 1,044 | 1.20% | 28 |
| <span class="VMSize">Standard_DS12-1_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 27.4 | <span class="Score">19,387</span> | 899 | 4.64% | 56 |
| <span class="VMSize">Standard_DS12-1_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 27.4 | <span class="Score">22,048</span> | 1,729 | 7.84% | 77 |
| <span class="VMSize">Standard_DS12-1_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 27.4 | <span class="Score">19,102</span> | 943 | 4.94% | 70 |
| <span class="VMSize">Standard_DS12-1_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 1 | 1 | 27.4 | <span class="Score">22,205</span> | 32 | 0.14% | 28 |
| <span class="VMSize">Standard_DS12-2_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 27.4 | <span class="Score">38,766</span> | 1,060 | 2.74% | 56 |
| <span class="VMSize">Standard_DS12-2_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 27.4 | <span class="Score">41,447</span> | 3,954 | 9.54% | 91 |
| <span class="VMSize">Standard_DS12-2_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 27.4 | <span class="Score">37,639</span> | 1,579 | 4.19% | 70 |
| <span class="VMSize">Standard_DS12-2_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 27.4 | <span class="Score">44,226</span> | 810 | 1.83% | 14 |
| <span class="VMSize">Standard_DS13_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 54.9 | <span class="Score">147,234</span> | 1,202 | 0.82% | 56 |
| <span class="VMSize">Standard_DS13_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 54.9 | <span class="Score">147,218</span> | 1,636 | 1.11% | 70 |
| <span class="VMSize">Standard_DS13_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 54.9 | <span class="Score">144,612</span> | 1,582 | 1.09% | 84 |
| <span class="VMSize">Standard_DS13_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 54.9 | <span class="Score">172,617</span> | 755 | 0.44% | 21 |
| <span class="VMSize">Standard_DS13-2_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 54.9 | <span class="Score">38,688</span> | 816 | 2.11% | 56 |
| <span class="VMSize">Standard_DS13-2_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 54.9 | <span class="Score">39,898</span> | 2,493 | 6.25% | 84 |
| <span class="VMSize">Standard_DS13-2_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 54.9 | <span class="Score">38,861</span> | 2,788 | 7.17% | 91 |
| <span class="VMSize">Standard_DS13-4_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 54.9 | <span class="Score">73,105</span> | 1,727 | 2.36% | 70 |
| <span class="VMSize">Standard_DS13-4_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 54.9 | <span class="Score">77,848</span> | 4,307 | 5.53% | 84 |
| <span class="VMSize">Standard_DS13-4_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 54.9 | <span class="Score">74,935</span> | 4,384 | 5.85% | 63 |
| <span class="VMSize">Standard_DS13-4_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 54.9 | <span class="Score">86,402</span> | 529 | 0.61% | 14 |
| <span class="VMSize">Standard_DS14_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 110.2 | <span class="Score">285,413</span> | 4,484 | 1.57% | 42 |
| <span class="VMSize">Standard_DS14_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 110.1 | <span class="Score">281,094</span> | 5,932 | 2.11% | 7 |
| <span class="VMSize">Standard_DS14_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 110.1 | <span class="Score">298,062</span> | 1,022 | 0.34% | 35 |
| <span class="VMSize">Standard_DS14_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 110.0 | <span class="Score">298,510</span> | 1,662 | 0.56% | 28 |
| <span class="VMSize">Standard_DS14_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 110.1 | <span class="Score">285,729</span> | 3,543 | 1.24% | 56 |
| <span class="VMSize">Standard_DS14_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 110.0 | <span class="Score">288,679</span> | 2,388 | 0.83% | 42 |
| <span class="VMSize">Standard_DS14_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 110.1 | <span class="Score">345,521</span> | 1,549 | 0.45% | 21 |
| <span class="VMSize">Standard_DS14-4_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 2 | 110.1 | <span class="Score">69,990</span> | 2,231 | 3.19% | 28 |
| <span class="VMSize">Standard_DS14-4_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 2 | 110.2 | <span class="Score">73,881</span> | 1,284 | 1.74% | 14 |
| <span class="VMSize">Standard_DS14-4_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 110.0 | <span class="Score">84,897</span> | 5,587 | 6.58% | 28 |
| <span class="VMSize">Standard_DS14-4_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 110.1 | <span class="Score">78,523</span> | 4,990 | 6.36% | 28 |
| <span class="VMSize">Standard_DS14-4_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 110.1 | <span class="Score">74,740</span> | 2,801 | 3.75% | 84 |
| <span class="VMSize">Standard_DS14-4_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 110.0 | <span class="Score">76,184</span> | 2,385 | 3.13% | 28 |
| <span class="VMSize">Standard_DS14-4_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 110.1 | <span class="Score">86,598</span> | 517 | 0.60% | 21 |
| <span class="VMSize">Standard_DS14-8_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 2 | 110.1 | <span class="Score">141,815</span> | 5,056 | 3.57% | 14 |
| <span class="VMSize">Standard_DS14-8_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 2 | 110.2 | <span class="Score">144,709</span> | 3,397 | 2.35% | 35 |
| <span class="VMSize">Standard_DS14-8_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 110.0 | <span class="Score">150,020</span> | 3,234 | 2.16% | 42 |
| <span class="VMSize">Standard_DS14-8_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 110.1 | <span class="Score">150,943</span> | 6,037 | 4.00% | 28 |
| <span class="VMSize">Standard_DS14-8_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 110.1 | <span class="Score">145,942</span> | 2,372 | 1.63% | 63 |
| <span class="VMSize">Standard_DS14-8_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 110.0 | <span class="Score">145,974</span> | 2,009 | 1.38% | 42 |
| <span class="VMSize">Standard_DS14-8_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 110.1 | <span class="Score">171,910</span> | 754 | 0.44% | 7 |
| <span class="VMSize">Standard_DS15_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 20 | 2 | 137.7 | <span class="Score">355,354</span> | 6,693 | 1.88% | 49 |
| <span class="VMSize">Standard_DS15_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 137.5 | <span class="Score">421,202</span> | 56,292 | 13.36% | 154 |

## Dv2 - General Compute
(09/30/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_D1_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 3.4 | <span class="Score">18,954</span> | 831 | 4.38% | 63 |
| <span class="VMSize">Standard_D1_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 1 | 1 | 3.3 | <span class="Score">19,349</span> | 834 | 4.31% | 42 |
| <span class="VMSize">Standard_D1_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 3.4 | <span class="Score">20,143</span> | 1,073 | 5.33% | 21 |
| <span class="VMSize">Standard_D1_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1 | 3.3 | <span class="Score">23,159</span> | 937 | 4.05% | 28 |
| <span class="VMSize">Standard_D1_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 3.4 | <span class="Score">19,572</span> | 880 | 4.50% | 49 |
| <span class="VMSize">Standard_D1_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 1 | 1 | 3.3 | <span class="Score">19,882</span> | 412 | 2.07% | 14 |
| <span class="VMSize">Standard_D2_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 6.8 | <span class="Score">36,684</span> | 1,542 | 4.20% | 112 |
| <span class="VMSize">Standard_D2_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 6.8 | <span class="Score">40,452</span> | 2,922 | 7.22% | 42 |
| <span class="VMSize">Standard_D2_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 6.8 | <span class="Score">37,109</span> | 1,525 | 4.11% | 63 |
| <span class="VMSize">Standard_D3_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 13.6 | <span class="Score">72,178</span> | 1,334 | 1.85% | 35 |
| <span class="VMSize">Standard_D3_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 13.7 | <span class="Score">73,040</span> | 1,389 | 1.90% | 49 |
| <span class="VMSize">Standard_D3_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 13.6 | <span class="Score">76,530</span> | 4,589 | 6.00% | 49 |
| <span class="VMSize">Standard_D3_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 13.7 | <span class="Score">76,867</span> | 5,816 | 7.57% | 21 |
| <span class="VMSize">Standard_D3_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 13.6 | <span class="Score">72,856</span> | 476 | 0.65% | 28 |
| <span class="VMSize">Standard_D3_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 13.7 | <span class="Score">74,680</span> | 2,938 | 3.93% | 28 |
| <span class="VMSize">Standard_D4_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 27.4 | <span class="Score">141,204</span> | 19,309 | 13.67% | 70 |
| <span class="VMSize">Standard_D4_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 27.4 | <span class="Score">149,027</span> | 1,783 | 1.20% | 98 |
| <span class="VMSize">Standard_D4_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 27.4 | <span class="Score">143,576</span> | 1,305 | 0.91% | 49 |
| <span class="VMSize">Standard_D5_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 55.0 | <span class="Score">281,644</span> | 9,594 | 3.41% | 105 |
| <span class="VMSize">Standard_D5_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 54.9 | <span class="Score">296,879</span> | 2,069 | 0.70% | 28 |
| <span class="VMSize">Standard_D5_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 54.9 | <span class="Score">284,996</span> | 5,417 | 1.90% | 77 |
| <span class="VMSize">Standard_D11_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 13.7 | <span class="Score">37,709</span> | 2,023 | 5.36% | 63 |
| <span class="VMSize">Standard_D11_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 1 | 13.6 | <span class="Score">37,178</span> | 207 | 0.56% | 7 |
| <span class="VMSize">Standard_D11_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 13.6 | <span class="Score">40,408</span> | 3,063 | 7.58% | 49 |
| <span class="VMSize">Standard_D11_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 13.7 | <span class="Score">38,891</span> | 2,688 | 6.91% | 21 |
| <span class="VMSize">Standard_D11_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 13.7 | <span class="Score">38,271</span> | 2,074 | 5.42% | 35 |
| <span class="VMSize">Standard_D11_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 13.6 | <span class="Score">37,494</span> | 1,222 | 3.26% | 21 |
| <span class="VMSize">Standard_D12_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 4 | 1 | 27.4 | <span class="Score">71,521</span> | 4,218 | 5.90% | 77 |
| <span class="VMSize">Standard_D12_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 27.4 | <span class="Score">77,439</span> | 5,095 | 6.58% | 70 |
| <span class="VMSize">Standard_D12_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 27.4 | <span class="Score">73,464</span> | 1,263 | 1.72% | 56 |
| <span class="VMSize">Standard_D12_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 27.4 | <span class="Score">87,100</span> | 434 | 0.50% | 7 |
| <span class="VMSize">Standard_D13_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 8 | 1 | 54.9 | <span class="Score">141,552</span> | 16,057 | 11.34% | 70 |
| <span class="VMSize">Standard_D13_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 54.9 | <span class="Score">148,352</span> | 2,754 | 1.86% | 70 |
| <span class="VMSize">Standard_D13_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 54.9 | <span class="Score">141,946</span> | 3,604 | 2.54% | 42 |
| <span class="VMSize">Standard_D13_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 54.9 | <span class="Score">167,641</span> | 1,680 | 1.00% | 7 |
| <span class="VMSize">Standard_D14_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 110.2 | <span class="Score">283,477</span> | 5,197 | 1.83% | 70 |
| <span class="VMSize">Standard_D14_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 2 | 110.1 | <span class="Score">286,946</span> | 4,485 | 1.56% | 7 |
| <span class="VMSize">Standard_D14_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 110.0 | <span class="Score">297,542</span> | 1,887 | 0.63% | 42 |
| <span class="VMSize">Standard_D14_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 110.1 | <span class="Score">296,405</span> | 1,422 | 0.48% | 21 |
| <span class="VMSize">Standard_D14_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 110.1 | <span class="Score">285,820</span> | 4,423 | 1.55% | 35 |
| <span class="VMSize">Standard_D14_v2</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 110.0 | <span class="Score">289,307</span> | 1,353 | 0.47% | 14 |
| <span class="VMSize">Standard_D15_v2</span> | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 20 | 2 | 137.7 | <span class="Score">354,279</span> | 6,021 | 1.70% | 35 |
| <span class="VMSize">Standard_D15_v2</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 137.5 | <span class="Score">418,475</span> | 58,044 | 13.87% | 154 |

## Esv3 - Memory Optimized + Premium Storage
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_E2s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 15.6 | <span class="Score">27,008</span> | 2,136 | 7.91% | 105 |
| <span class="VMSize">Standard_E2s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 15.6 | <span class="Score">26,729</span> | 987 | 3.69% | 98 |
| <span class="VMSize">Standard_E2s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 15.6 | <span class="Score">31,341</span> | 14 | 0.04% | 21 |
| <span class="VMSize">Standard_E4s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 31.4 | <span class="Score">51,505</span> | 2,770 | 5.38% | 42 |
| <span class="VMSize">Standard_E4s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 31.3 | <span class="Score">51,743</span> | 3,712 | 7.17% | 63 |
| <span class="VMSize">Standard_E4s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 31.4 | <span class="Score">49,062</span> | 2,278 | 4.64% | 63 |
| <span class="VMSize">Standard_E4s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 31.3 | <span class="Score">50,172</span> | 2,552 | 5.09% | 35 |
| <span class="VMSize">Standard_E4s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 31.4 | <span class="Score">57,986</span> | 283 | 0.49% | 35 |
| <span class="VMSize">Standard_E4-2s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 31.4 | <span class="Score">25,263</span> | 1,603 | 6.35% | 35 |
| <span class="VMSize">Standard_E4-2s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 31.3 | <span class="Score">27,070</span> | 1,908 | 7.05% | 70 |
| <span class="VMSize">Standard_E4-2s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 31.3 | <span class="Score">25,803</span> | 873 | 3.38% | 28 |
| <span class="VMSize">Standard_E4-2s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 31.4 | <span class="Score">26,784</span> | 553 | 2.07% | 56 |
| <span class="VMSize">Standard_E4-2s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 31.4 | <span class="Score">31,350</span> | 15 | 0.05% | 42 |
| <span class="VMSize">Standard_E8s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 62.8 | <span class="Score">101,750</span> | 7,494 | 7.36% | 126 |
| <span class="VMSize">Standard_E8s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 62.8 | <span class="Score">101,526</span> | 1,976 | 1.95% | 77 |
| <span class="VMSize">Standard_E8s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 62.8 | <span class="Score">120,073</span> | 826 | 0.69% | 35 |
| <span class="VMSize">Standard_E8-2s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 62.8 | <span class="Score">26,318</span> | 1,665 | 6.33% | 140 |
| <span class="VMSize">Standard_E8-2s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 62.8 | <span class="Score">27,219</span> | 1,167 | 4.29% | 56 |
| <span class="VMSize">Standard_E8-2s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 62.8 | <span class="Score">31,322</span> | 38 | 0.12% | 42 |
| <span class="VMSize">Standard_E8-4s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 62.8 | <span class="Score">52,719</span> | 3,706 | 7.03% | 119 |
| <span class="VMSize">Standard_E8-4s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 62.8 | <span class="Score">49,518</span> | 2,675 | 5.40% | 77 |
| <span class="VMSize">Standard_E8-4s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 62.8 | <span class="Score">57,859</span> | 378 | 0.65% | 42 |
| <span class="VMSize">Standard_E16s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 125.8 | <span class="Score">195,755</span> | 5,337 | 2.73% | 126 |
| <span class="VMSize">Standard_E16s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 125.8 | <span class="Score">199,681</span> | 2,067 | 1.04% | 77 |
| <span class="VMSize">Standard_E16s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 125.8 | <span class="Score">240,250</span> | 984 | 0.41% | 28 |
| <span class="VMSize">Standard_E16-4s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 125.8 | <span class="Score">54,920</span> | 3,833 | 6.98% | 140 |
| <span class="VMSize">Standard_E16-4s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 125.8 | <span class="Score">50,869</span> | 3,400 | 6.68% | 77 |
| <span class="VMSize">Standard_E16-4s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 125.8 | <span class="Score">58,019</span> | 307 | 0.53% | 21 |
| <span class="VMSize">Standard_E16-8s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 125.8 | <span class="Score">103,358</span> | 6,272 | 6.07% | 133 |
| <span class="VMSize">Standard_E16-8s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 125.8 | <span class="Score">102,945</span> | 2,982 | 2.90% | 63 |
| <span class="VMSize">Standard_E16-8s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 125.8 | <span class="Score">120,189</span> | 963 | 0.80% | 35 |
| <span class="VMSize">Standard_E20s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 20 | 1 | 157.2 | <span class="Score">245,271</span> | 1,479 | 0.60% | 112 |
| <span class="VMSize">Standard_E20s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 20 | 1 | 157.2 | <span class="Score">249,245</span> | 2,057 | 0.83% | 98 |
| <span class="VMSize">Standard_E20s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 157.2 | <span class="Score">300,197</span> | 1,881 | 0.63% | 28 |
| <span class="VMSize">Standard_E32s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 2 | 251.9 | <span class="Score">379,015</span> | 6,761 | 1.78% | 126 |
| <span class="VMSize">Standard_E32s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 1 | 251.7 | <span class="Score">397,086</span> | 2,450 | 0.62% | 84 |
| <span class="VMSize">Standard_E32s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 251.7 | <span class="Score">477,740</span> | 4,873 | 1.02% | 28 |
| <span class="VMSize">Standard_E32-8s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 2 | 251.9 | <span class="Score">105,799</span> | 5,853 | 5.53% | 98 |
| <span class="VMSize">Standard_E32-8s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 251.7 | <span class="Score">103,535</span> | 2,602 | 2.51% | 105 |
| <span class="VMSize">Standard_E32-8s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 251.7 | <span class="Score">120,109</span> | 593 | 0.49% | 28 |
| <span class="VMSize">Standard_E32-16s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 2 | 251.9 | <span class="Score">199,765</span> | 7,562 | 3.79% | 119 |
| <span class="VMSize">Standard_E32-16s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 251.7 | <span class="Score">202,033</span> | 3,104 | 1.54% | 77 |
| <span class="VMSize">Standard_E32-16s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 251.7 | <span class="Score">240,249</span> | 1,126 | 0.47% | 42 |
| <span class="VMSize">Standard_E48s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 48 | 2 | 377.9 | <span class="Score">570,727</span> | 4,290 | 0.75% | 98 |
| <span class="VMSize">Standard_E48s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 48 | 2 | 377.9 | <span class="Score">578,285</span> | 5,864 | 1.01% | 105 |
| <span class="VMSize">Standard_E48s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 377.9 | <span class="Score">687,857</span> | 6,709 | 0.98% | 35 |
| <span class="VMSize">Standard_E64s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 64 | 2 | 425.1 | <span class="Score">763,127</span> | 5,541 | 0.73% | 42 |
| <span class="VMSize">Standard_E64s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 64 | 2 | 425.1 | <span class="Score">770,574</span> | 7,440 | 0.97% | 161 |
| <span class="VMSize">Standard_E64s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 425.1 | <span class="Score">913,390</span> | 9,287 | 1.02% | 21 |
| <span class="VMSize">Standard_E64-16s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 2 | 425.2 | <span class="Score">234,395</span> | 2,364 | 1.01% | 42 |
| <span class="VMSize">Standard_E64-16s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 2 | 425.2 | <span class="Score">211,606</span> | 7,587 | 3.59% | 105 |
| <span class="VMSize">Standard_E64-16s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 2 | 425.1 | <span class="Score">212,108</span> | 8,357 | 3.94% | 56 |
| <span class="VMSize">Standard_E64-16s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 2 | 425.2 | <span class="Score">232,571</span> | 3,046 | 1.31% | 28 |
| <span class="VMSize">Standard_E64-32s_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 2 | 425.2 | <span class="Score">411,194</span> | 4,489 | 1.09% | 56 |
| <span class="VMSize">Standard_E64-32s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 2 | 425.1 | <span class="Score">395,301</span> | 4,536 | 1.15% | 63 |
| <span class="VMSize">Standard_E64-32s_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 2 | 425.2 | <span class="Score">395,180</span> | 5,677 | 1.44% | 98 |
| <span class="VMSize">Standard_E64-32s_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 425.2 | <span class="Score">464,744</span> | 6,855 | 1.48% | 21 |

## Ev3 - Memory Optimized
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_E2_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 2 | 1 | 15.6 | <span class="Score">27,615</span> | 2,226 | 8.06% | 133 |
| <span class="VMSize">Standard_E2_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 2 | 1 | 15.6 | <span class="Score">27,471</span> | 1,897 | 6.90% | 84 |
| <span class="VMSize">Standard_E4_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 31.3 | <span class="Score">52,598</span> | 4,066 | 7.73% | 98 |
| <span class="VMSize">Standard_E4_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 1 | 31.4 | <span class="Score">50,682</span> | 2,560 | 5.05% | 77 |
| <span class="VMSize">Standard_E4_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 31.4 | <span class="Score">48,754</span> | 1,076 | 2.21% | 35 |
| <span class="VMSize">Standard_E4_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 4 | 1 | 31.3 | <span class="Score">47,415</span> | 1,143 | 2.41% | 28 |
| <span class="VMSize">Standard_E8_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 8 | 1 | 62.8 | <span class="Score">100,794</span> | 5,678 | 5.63% | 154 |
| <span class="VMSize">Standard_E8_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 8 | 1 | 62.8 | <span class="Score">100,458</span> | 1,381 | 1.38% | 84 |
| <span class="VMSize">Standard_E16_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 16 | 1 | 125.8 | <span class="Score">196,170</span> | 4,590 | 2.34% | 189 |
| <span class="VMSize">Standard_E16_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 16 | 1 | 125.8 | <span class="Score">199,986</span> | 1,534 | 0.77% | 42 |
| <span class="VMSize">Standard_E16_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 125.8 | <span class="Score">240,246</span> | 680 | 0.28% | 7 |
| <span class="VMSize">Standard_E20_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 20 | 1 | 157.2 | <span class="Score">243,816</span> | 2,644 | 1.08% | 196 |
| <span class="VMSize">Standard_E20_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 20 | 1 | 157.2 | <span class="Score">245,193</span> | 6,282 | 2.56% | 35 |
| <span class="VMSize">Standard_E20_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 157.2 | <span class="Score">300,653</span> | 666 | 0.22% | 7 |
| <span class="VMSize">Standard_E32_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 2 | 251.9 | <span class="Score">377,052</span> | 7,434 | 1.97% | 147 |
| <span class="VMSize">Standard_E32_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 32 | 1 | 251.7 | <span class="Score">393,569</span> | 5,278 | 1.34% | 70 |
| <span class="VMSize">Standard_E32_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 251.7 | <span class="Score">479,255</span> | 2,237 | 0.47% | 14 |
| <span class="VMSize">Standard_E48_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 48 | 2 | 377.9 | <span class="Score">569,428</span> | 5,166 | 0.91% | 147 |
| <span class="VMSize">Standard_E48_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 48 | 2 | 377.9 | <span class="Score">577,766</span> | 6,460 | 1.12% | 77 |
| <span class="VMSize">Standard_E48_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 377.9 | <span class="Score">687,699</span> | 7,983 | 1.16% | 14 |
| <span class="VMSize">Standard_E64_v3</span> | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 64 | 2 | 425.1 | <span class="Score">761,587</span> | 5,928 | 0.78% | 63 |
| <span class="VMSize">Standard_E64_v3</span> | Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz | 64 | 2 | 425.1 | <span class="Score">765,301</span> | 11,204 | 1.46% | 161 |
| <span class="VMSize">Standard_E64_v3</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 425.1 | <span class="Score">913,332</span> | 12,240 | 1.34% | 14 |

## Easv4
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_E2as_v4</span> | AMD EPYC 7452 32-Core Processor | 2 | 1 | 15.6 | <span class="Score">38,228</span> | 504 | 1.32% | 154 |
| <span class="VMSize">Standard_E2as_v4</span> | AMD EPYC 7452 32-Core Processor | 2 | 1 | 15.6 | <span class="Score">38,047</span> | 264 | 0.69% | 105 |
| <span class="VMSize">Standard_E4as_v4</span> | AMD EPYC 7452 32-Core Processor | 4 | 1 | 31.4 | <span class="Score">71,440</span> | 1,525 | 2.14% | 154 |
| <span class="VMSize">Standard_E4as_v4</span> | AMD EPYC 7452 32-Core Processor | 4 | 1 | 31.4 | <span class="Score">71,587</span> | 709 | 0.99% | 105 |
| <span class="VMSize">Standard_E8as_v4</span> | AMD EPYC 7452 32-Core Processor | 8 | 1 | 62.8 | <span class="Score">150,940</span> | 3,901 | 2.58% | 154 |
| <span class="VMSize">Standard_E8as_v4</span> | AMD EPYC 7452 32-Core Processor | 8 | 1 | 62.8 | <span class="Score">151,583</span> | 1,517 | 1.00% | 105 |
| <span class="VMSize">Standard_E16as_v4</span> | AMD EPYC 7452 32-Core Processor | 16 | 2 | 125.9 | <span class="Score">293,431</span> | 6,423 | 2.19% | 175 |
| <span class="VMSize">Standard_E16as_v4</span> | AMD EPYC 7452 32-Core Processor | 16 | 2 | 125.9 | <span class="Score">293,336</span> | 7,883 | 2.69% | 21 |
| <span class="VMSize">Standard_E16as_v4</span> | AMD EPYC 7452 32-Core Processor | 16 | 2 | 125.9 | <span class="Score">292,638</span> | 5,877 | 2.01% | 84 |
| <span class="VMSize">Standard_E20as_v4</span> | AMD EPYC 7452 32-Core Processor | 20 | 3 | 157.4 | <span class="Score">363,325</span> | 9,013 | 2.48% | 175 |
| <span class="VMSize">Standard_E20as_v4</span> | AMD EPYC 7452 32-Core Processor | 20 | 3 | 157.4 | <span class="Score">364,780</span> | 7,754 | 2.13% | 63 |
| <span class="VMSize">Standard_E20as_v4</span> | AMD EPYC 7452 32-Core Processor | 20 | 3 | 157.4 | <span class="Score">360,921</span> | 8,685 | 2.41% | 42 |
| <span class="VMSize">Standard_E32as_v4</span> | AMD EPYC 7452 32-Core Processor | 32 | 4 | 251.9 | <span class="Score">569,811</span> | 14,299 | 2.51% | 189 |
| <span class="VMSize">Standard_E32as_v4</span> | AMD EPYC 7452 32-Core Processor | 32 | 4 | 251.9 | <span class="Score">570,897</span> | 13,889 | 2.43% | 105 |
| <span class="VMSize">Standard_E48as_v4</span> | AMD EPYC 7452 32-Core Processor | 48 | 6 | 377.9 | <span class="Score">839,615</span> | 20,812 | 2.48% | 203 |
| <span class="VMSize">Standard_E48as_v4</span> | AMD EPYC 7452 32-Core Processor | 48 | 6 | 377.9 | <span class="Score">845,549</span> | 23,487 | 2.78% | 98 |
| <span class="VMSize">Standard_E64as_v4</span> | AMD EPYC 7452 32-Core Processor | 64 | 8 | 503.9 | <span class="Score">1,119,218</span> | 27,799 | 2.48% | 14 |
| <span class="VMSize">Standard_E64as_v4</span> | AMD EPYC 7452 32-Core Processor | 64 | 8 | 503.9 | <span class="Score">1,097,083</span> | 26,154 | 2.38% | 14 |
| <span class="VMSize">Standard_E96as_v4</span> | AMD EPYC 7452 32-Core Processor | 96 | 12 | 661.4 | <span class="Score">1,580,637</span> | 27,418 | 1.73% | 28 |
| <span class="VMSize">Standard_E96as_v4</span> | AMD EPYC 7452 32-Core Processor | 96 | 12 | 661.4 | <span class="Score">1,573,773</span> | 26,789 | 1.70% | 14 |

## Eav4
(09/23/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_E2a_v4</span> | AMD EPYC 7452 32-Core Processor | 2 | 1 | 15.6 | <span class="Score">38,035</span> | 900 | 2.37% | 196 |
| <span class="VMSize">Standard_E4a_v4</span> | AMD EPYC 7452 32-Core Processor | 4 | 1 | 31.4 | <span class="Score">71,345</span> | 949 | 1.33% | 196 |
| <span class="VMSize">Standard_E8a_v4</span> | AMD EPYC 7452 32-Core Processor | 8 | 1 | 62.8 | <span class="Score">151,511</span> | 1,940 | 1.28% | 189 |
| <span class="VMSize">Standard_E16a_v4</span> | AMD EPYC 7452 32-Core Processor | 16 | 2 | 125.9 | <span class="Score">292,668</span> | 7,220 | 2.47% | 196 |
| <span class="VMSize">Standard_E20a_v4</span> | AMD EPYC 7452 32-Core Processor | 20 | 3 | 157.4 | <span class="Score">361,845</span> | 9,332 | 2.58% | 196 |
| <span class="VMSize">Standard_E32a_v4</span> | AMD EPYC 7452 32-Core Processor | 32 | 4 | 251.9 | <span class="Score">570,615</span> | 14,419 | 2.53% | 196 |
| <span class="VMSize">Standard_E48a_v4</span> | AMD EPYC 7452 32-Core Processor | 48 | 6 | 377.9 | <span class="Score">841,419</span> | 26,181 | 3.11% | 196 |
| <span class="VMSize">Standard_E64a_v4</span> | AMD EPYC 7452 32-Core Processor | 64 | 8 | 503.9 | <span class="Score">1,116,891</span> | 28,545 | 2.56% | 14 |
| <span class="VMSize">Standard_E96a_v4</span> | AMD EPYC 7452 32-Core Processor | 96 | 12 | 661.4 | <span class="Score">1,592,228</span> | 32,515 | 2.04% | 14 |

## EDSv4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_E2ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 15.6 | <span class="Score">35,975</span> | 673 | 1.87% | 189 |
| <span class="VMSize">Standard_E4ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 31.4 | <span class="Score">65,819</span> | 523 | 0.79% | 182 |
| <span class="VMSize">Standard_E4-2ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 31.4 | <span class="Score">35,623</span> | 312 | 0.88% | 189 |
| <span class="VMSize">Standard_E8ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 62.8 | <span class="Score">135,576</span> | 723 | 0.53% | 189 |
| <span class="VMSize">Standard_E8-2ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 62.8 | <span class="Score">35,831</span> | 529 | 1.48% | 189 |
| <span class="VMSize">Standard_E8-4ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 62.8 | <span class="Score">66,007</span> | 778 | 1.18% | 189 |
| <span class="VMSize">Standard_E16ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 125.8 | <span class="Score">271,138</span> | 1,608 | 0.59% | 189 |
| <span class="VMSize">Standard_E16-4ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 125.8 | <span class="Score">66,495</span> | 1,258 | 1.89% | 182 |
| <span class="VMSize">Standard_E16-4ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 125.8 | <span class="Score">65,582</span> | 556 | 0.85% | 7 |
| <span class="VMSize">Standard_E16-8ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 125.8 | <span class="Score">135,960</span> | 1,073 | 0.79% | 189 |
| <span class="VMSize">Standard_E20ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 157.2 | <span class="Score">339,000</span> | 1,496 | 0.44% | 189 |
| <span class="VMSize">Standard_E32ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 251.7 | <span class="Score">538,949</span> | 6,669 | 1.24% | 168 |
| <span class="VMSize">Standard_E32ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 251.9 | <span class="Score">527,258</span> | 11,587 | 2.20% | 21 |
| <span class="VMSize">Standard_E32-8ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 251.7 | <span class="Score">136,425</span> | 1,166 | 0.85% | 147 |
| <span class="VMSize">Standard_E32-8ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 2 | 251.9 | <span class="Score">136,743</span> | 2,124 | 1.55% | 42 |
| <span class="VMSize">Standard_E32-16ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 251.7 | <span class="Score">271,264</span> | 1,345 | 0.50% | 154 |
| <span class="VMSize">Standard_E32-16ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 2 | 251.9 | <span class="Score">269,101</span> | 4,332 | 1.61% | 28 |
| <span class="VMSize">Standard_E48ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 377.9 | <span class="Score">775,434</span> | 10,356 | 1.34% | 189 |
| <span class="VMSize">Standard_E64ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 496.0 | <span class="Score">1,027,169</span> | 12,890 | 1.25% | 182 |
| <span class="VMSize">Standard_E64-16ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 2 | 496.0 | <span class="Score">266,956</span> | 4,181 | 1.57% | 189 |
| <span class="VMSize">Standard_E64-32ds_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 496.0 | <span class="Score">521,183</span> | 6,655 | 1.28% | 182 |

## EDv4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_E2d_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 15.6 | <span class="Score">35,901</span> | 490 | 1.36% | 189 |
| <span class="VMSize">Standard_E4d_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 31.4 | <span class="Score">65,859</span> | 786 | 1.19% | 189 |
| <span class="VMSize">Standard_E8d_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 62.8 | <span class="Score">135,986</span> | 1,194 | 0.88% | 189 |
| <span class="VMSize">Standard_E16d_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 125.8 | <span class="Score">271,196</span> | 1,448 | 0.53% | 182 |
| <span class="VMSize">Standard_E20d_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 157.2 | <span class="Score">338,449</span> | 2,948 | 0.87% | 189 |
| <span class="VMSize">Standard_E32d_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 251.7 | <span class="Score">539,487</span> | 5,562 | 1.03% | 161 |
| <span class="VMSize">Standard_E32d_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 251.9 | <span class="Score">529,841</span> | 13,344 | 2.52% | 28 |
| <span class="VMSize">Standard_E48d_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 377.9 | <span class="Score">772,684</span> | 11,745 | 1.52% | 189 |
| <span class="VMSize">Standard_E64d_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 496.0 | <span class="Score">1,025,563</span> | 13,902 | 1.36% | 189 |

## Esv4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_E2s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 15.6 | <span class="Score">35,750</span> | 491 | 1.37% | 175 |
| <span class="VMSize">Standard_E4s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 31.4 | <span class="Score">65,919</span> | 696 | 1.06% | 182 |
| <span class="VMSize">Standard_E4-2s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 31.4 | <span class="Score">35,875</span> | 598 | 1.67% | 182 |
| <span class="VMSize">Standard_E8s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 62.8 | <span class="Score">136,061</span> | 1,199 | 0.88% | 182 |
| <span class="VMSize">Standard_E8-2s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 62.8 | <span class="Score">35,762</span> | 404 | 1.13% | 182 |
| <span class="VMSize">Standard_E8-4s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 62.8 | <span class="Score">65,865</span> | 530 | 0.81% | 182 |
| <span class="VMSize">Standard_E16s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 125.8 | <span class="Score">270,956</span> | 1,486 | 0.55% | 182 |
| <span class="VMSize">Standard_E16-4s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 125.8 | <span class="Score">66,290</span> | 1,010 | 1.52% | 182 |
| <span class="VMSize">Standard_E16-8s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 125.8 | <span class="Score">135,990</span> | 1,139 | 0.84% | 182 |
| <span class="VMSize">Standard_E20s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 157.2 | <span class="Score">339,149</span> | 1,689 | 0.50% | 182 |
| <span class="VMSize">Standard_E32s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 251.7 | <span class="Score">540,883</span> | 3,428 | 0.63% | 154 |
| <span class="VMSize">Standard_E32s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 251.9 | <span class="Score">533,105</span> | 10,700 | 2.01% | 28 |
| <span class="VMSize">Standard_E32-8s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 251.7 | <span class="Score">136,061</span> | 1,055 | 0.78% | 140 |
| <span class="VMSize">Standard_E32-8s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 2 | 251.9 | <span class="Score">136,911</span> | 3,347 | 2.44% | 35 |
| <span class="VMSize">Standard_E32-16s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 251.7 | <span class="Score">271,570</span> | 1,334 | 0.49% | 147 |
| <span class="VMSize">Standard_E32-16s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 2 | 251.9 | <span class="Score">264,434</span> | 5,182 | 1.96% | 35 |
| <span class="VMSize">Standard_E48s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 377.9 | <span class="Score">774,071</span> | 9,926 | 1.28% | 182 |
| <span class="VMSize">Standard_E64s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 496.0 | <span class="Score">1,024,690</span> | 13,752 | 1.34% | 182 |
| <span class="VMSize">Standard_E64-16s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 2 | 496.0 | <span class="Score">266,980</span> | 3,951 | 1.48% | 182 |
| <span class="VMSize">Standard_E64-32s_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 496.0 | <span class="Score">521,342</span> | 7,052 | 1.35% | 182 |

## Ev4
(09/22/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_E2_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 2 | 1 | 15.6 | <span class="Score">35,781</span> | 422 | 1.18% | 182 |
| <span class="VMSize">Standard_E4_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 4 | 1 | 31.4 | <span class="Score">65,742</span> | 489 | 0.74% | 175 |
| <span class="VMSize">Standard_E8_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 8 | 1 | 62.8 | <span class="Score">135,668</span> | 847 | 0.62% | 182 |
| <span class="VMSize">Standard_E16_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 16 | 1 | 125.8 | <span class="Score">270,553</span> | 2,565 | 0.95% | 182 |
| <span class="VMSize">Standard_E20_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 20 | 1 | 157.2 | <span class="Score">338,166</span> | 4,445 | 1.31% | 175 |
| <span class="VMSize">Standard_E32_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 1 | 251.7 | <span class="Score">541,040</span> | 2,289 | 0.42% | 154 |
| <span class="VMSize">Standard_E32_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 32 | 2 | 251.9 | <span class="Score">520,279</span> | 6,500 | 1.25% | 28 |
| <span class="VMSize">Standard_E48_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 48 | 2 | 377.9 | <span class="Score">774,116</span> | 10,210 | 1.32% | 175 |
| <span class="VMSize">Standard_E64_v4</span> | Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz | 64 | 2 | 496.0 | <span class="Score">1,025,603</span> | 13,715 | 1.34% | 182 |

## Msv2 - Memory Optimized
(10/05/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_M24s_v2</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 24 | 1 | 251.7 | <span class="Score">392,829</span> | 4,129 | 1.05% | 84 |
| <span class="VMSize">Standard_M24ms_v2</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 24 | 1 | 503.7 | <span class="Score">393,051</span> | 4,425 | 1.13% | 84 |
| <span class="VMSize">Standard_M48s_v2</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 48 | 1 | 503.7 | <span class="Score">773,060</span> | 5,164 | 0.67% | 84 |
| <span class="VMSize">Standard_M48ms_v2</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 48 | 1 | 1,007.5 | <span class="Score">765,723</span> | 10,281 | 1.34% | 77 |
| <span class="VMSize">Standard_M48ms_v2</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 48 | 2 | 1,007.9 | <span class="Score">740,041</span> | 7,538 | 1.02% | 7 |
| <span class="VMSize">Standard_M96s_v2</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 96 | 2 | 1,007.9 | <span class="Score">1,410,639</span> | 22,303 | 1.58% | 84 |
| <span class="VMSize">Standard_M96ms_v2</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 96 | 2 | 2,015.9 | <span class="Score">1,403,923</span> | 21,874 | 1.56% | 49 |
| <span class="VMSize">Standard_M96ms_v2</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 96 | 4 | 2,015.9 | <span class="Score">1,419,370</span> | 21,098 | 1.49% | 35 |
| <span class="VMSize">Standard_M192s_v2</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 192 | 4 | 2,015.9 | <span class="Score">2,825,266</span> | 43,208 | 1.53% | 84 |
| <span class="VMSize">Standard_M208s_v2</span> | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 208 | 4 | 2,805.3 | <span class="Score">3,020,762</span> | 55,134 | 1.83% | 84 |
| <span class="VMSize">Standard_M208ms_v2</span> | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 208 | 4 | 5,610.8 | <span class="Score">3,009,120</span> | 58,843 | 1.96% | 42 |
| <span class="VMSize">Standard_M208ms_v2</span> | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 208 | 8 | 5,610.8 | <span class="Score">3,093,184</span> | 33,253 | 1.08% | 42 |
| <span class="VMSize">Standard_M416s_v2</span> | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 416 | 8 | 5,610.8 | <span class="Score">5,959,252</span> | 93,933 | 1.58% | 84 |
| <span class="VMSize">Standard_M416-208s_v2</span> | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 208 | 4 | 5,610.8 | <span class="Score">2,992,729</span> | 52,652 | 1.76% | 14 |
| <span class="VMSize">Standard_M416-208s_v2</span> | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 208 | 8 | 5,610.8 | <span class="Score">3,085,232</span> | 36,568 | 1.19% | 70 |
| <span class="VMSize">Standard_M416ms_v2</span> | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 416 | 8 | 11,221.7 | <span class="Score">5,910,261</span> | 101,190 | 1.71% | 84 |
| <span class="VMSize">Standard_M416-208ms_v2</span> | Intel(R) Xeon(R) Platinum 8180M CPU @ 2.50GHz | 208 | 8 | 11,221.7 | <span class="Score">3,064,892</span> | 40,531 | 1.32% | 77 |

## Msv2 Small - Memory Optimized
(10/05/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_M192ms_v2</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 192 | 4 | 4,031.9 | <span class="Score">2,794,826</span> | 44,549 | 1.59% | 84 |

## M - Memory Optimized
(09/29/2020 PBIID:7668456)

| VM Size | CPU | vCPUs | NUMA Nodes | Memory(GiB) | Avg Score | StdDev | StdDev% | #Runs |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| <span class="VMSize">Standard_M64</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,007.9 | <span class="Score">820,580</span> | 12,081 | 1.47% | 49 |
| <span class="VMSize">Standard_M64</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,007.9 | <span class="Score">823,600</span> | 9,080 | 1.10% | 28 |
| <span class="VMSize">Standard_M64</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 1,007.9 | <span class="Score">754,180</span> | 5,686 | 0.75% | 7 |
| <span class="VMSize">Standard_M64m</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,763.9 | <span class="Score">813,316</span> | 8,430 | 1.04% | 35 |
| <span class="VMSize">Standard_M64m</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,763.9 | <span class="Score">824,205</span> | 6,649 | 0.81% | 21 |
| <span class="VMSize">Standard_M64m</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 1,763.9 | <span class="Score">753,651</span> | 10,647 | 1.41% | 21 |
| <span class="VMSize">Standard_M64m</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 1,763.9 | <span class="Score">758,764</span> | 10,081 | 1.33% | 7 |
| <span class="VMSize">Standard_M128</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 2,015.9 | <span class="Score">1,643,836</span> | 17,434 | 1.06% | 49 |
| <span class="VMSize">Standard_M128</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 2,015.9 | <span class="Score">1,643,613</span> | 19,060 | 1.16% | 21 |
| <span class="VMSize">Standard_M128</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 128 | 4 | 2,015.9 | <span class="Score">1,476,444</span> | 17,028 | 1.15% | 7 |
| <span class="VMSize">Standard_M128</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 128 | 4 | 2,015.9 | <span class="Score">1,475,243</span> | 16,662 | 1.13% | 7 |
| <span class="VMSize">Standard_M128m</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 3,831.1 | <span class="Score">1,629,949</span> | 19,953 | 1.22% | 42 |
| <span class="VMSize">Standard_M128m</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 3,831.0 | <span class="Score">1,633,359</span> | 15,204 | 0.93% | 28 |
| <span class="VMSize">Standard_M128m</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 128 | 4 | 3,831.1 | <span class="Score">1,471,781</span> | 17,646 | 1.20% | 14 |
| <span class="VMSize">Standard_M8ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 8 | 1 | 215.0 | <span class="Score">110,398</span> | 335 | 0.30% | 56 |
| <span class="VMSize">Standard_M8ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 8 | 1 | 215.0 | <span class="Score">110,314</span> | 423 | 0.38% | 28 |
| <span class="VMSize">Standard_M8-2ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 2 | 1 | 215.0 | <span class="Score">28,044</span> | 31 | 0.11% | 56 |
| <span class="VMSize">Standard_M8-2ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 2 | 1 | 215.0 | <span class="Score">28,036</span> | 42 | 0.15% | 28 |
| <span class="VMSize">Standard_M8-4ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 4 | 1 | 215.0 | <span class="Score">56,289</span> | 330 | 0.59% | 49 |
| <span class="VMSize">Standard_M8-4ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 4 | 1 | 215.0 | <span class="Score">56,130</span> | 362 | 0.65% | 28 |
| <span class="VMSize">Standard_M8-4ms</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 4 | 1 | 215.1 | <span class="Score">48,391</span> | 280 | 0.58% | 7 |
| <span class="VMSize">Standard_M16ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 16 | 1 | 430.4 | <span class="Score">220,411</span> | 457 | 0.21% | 42 |
| <span class="VMSize">Standard_M16ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 16 | 1 | 430.3 | <span class="Score">220,210</span> | 478 | 0.22% | 28 |
| <span class="VMSize">Standard_M16ms</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 16 | 1 | 430.4 | <span class="Score">200,561</span> | 877 | 0.44% | 14 |
| <span class="VMSize">Standard_M16-4ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 4 | 1 | 430.4 | <span class="Score">56,215</span> | 310 | 0.55% | 42 |
| <span class="VMSize">Standard_M16-4ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 4 | 1 | 430.3 | <span class="Score">56,222</span> | 300 | 0.53% | 28 |
| <span class="VMSize">Standard_M16-4ms</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 4 | 1 | 430.4 | <span class="Score">48,401</span> | 205 | 0.42% | 14 |
| <span class="VMSize">Standard_M16-8ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 8 | 1 | 430.4 | <span class="Score">110,460</span> | 367 | 0.33% | 35 |
| <span class="VMSize">Standard_M16-8ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 8 | 1 | 430.3 | <span class="Score">110,369</span> | 411 | 0.37% | 21 |
| <span class="VMSize">Standard_M16-8ms</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 8 | 1 | 430.4 | <span class="Score">100,476</span> | 419 | 0.42% | 21 |
| <span class="VMSize">Standard_M16-8ms</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 8 | 1 | 430.4 | <span class="Score">100,081</span> | 397 | 0.40% | 7 |
| <span class="VMSize">Standard_M32ls</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 1 | 251.7 | <span class="Score">431,893</span> | 4,055 | 0.94% | 42 |
| <span class="VMSize">Standard_M32ls</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 1 | 251.7 | <span class="Score">435,095</span> | 3,961 | 0.91% | 28 |
| <span class="VMSize">Standard_M32ls</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 32 | 1 | 251.7 | <span class="Score">400,287</span> | 1,610 | 0.40% | 14 |
| <span class="VMSize">Standard_M32ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 1 | 860.8 | <span class="Score">434,694</span> | 2,723 | 0.63% | 42 |
| <span class="VMSize">Standard_M32ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 1 | 860.8 | <span class="Score">435,126</span> | 2,318 | 0.53% | 28 |
| <span class="VMSize">Standard_M32ms</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 32 | 1 | 860.9 | <span class="Score">400,583</span> | 1,596 | 0.40% | 14 |
| <span class="VMSize">Standard_M32-8ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 8 | 1 | 860.8 | <span class="Score">110,418</span> | 358 | 0.32% | 35 |
| <span class="VMSize">Standard_M32-8ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 8 | 1 | 860.8 | <span class="Score">110,392</span> | 334 | 0.30% | 21 |
| <span class="VMSize">Standard_M32-8ms</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 8 | 1 | 860.9 | <span class="Score">100,605</span> | 682 | 0.68% | 21 |
| <span class="VMSize">Standard_M32-8ms</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 8 | 1 | 860.9 | <span class="Score">100,269</span> | 464 | 0.46% | 7 |
| <span class="VMSize">Standard_M32-16ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 16 | 1 | 860.8 | <span class="Score">220,526</span> | 592 | 0.27% | 42 |
| <span class="VMSize">Standard_M32-16ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 16 | 1 | 860.8 | <span class="Score">220,449</span> | 539 | 0.24% | 28 |
| <span class="VMSize">Standard_M32-16ms</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 16 | 1 | 860.9 | <span class="Score">200,494</span> | 723 | 0.36% | 14 |
| <span class="VMSize">Standard_M32ts</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 1 | 188.7 | <span class="Score">435,945</span> | 1,629 | 0.37% | 49 |
| <span class="VMSize">Standard_M32ts</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 1 | 188.7 | <span class="Score">435,504</span> | 2,887 | 0.66% | 28 |
| <span class="VMSize">Standard_M32ts</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 32 | 1 | 188.7 | <span class="Score">399,771</span> | 1,291 | 0.32% | 7 |
| <span class="VMSize">Standard_M64s</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,007.9 | <span class="Score">822,500</span> | 7,532 | 0.92% | 49 |
| <span class="VMSize">Standard_M64s</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,007.9 | <span class="Score">821,652</span> | 6,704 | 0.82% | 21 |
| <span class="VMSize">Standard_M64s</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 1,007.9 | <span class="Score">752,940</span> | 10,871 | 1.44% | 7 |
| <span class="VMSize">Standard_M64s</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 1,007.9 | <span class="Score">748,465</span> | 9,002 | 1.20% | 7 |
| <span class="VMSize">Standard_M64ls</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 503.9 | <span class="Score">818,871</span> | 14,661 | 1.79% | 56 |
| <span class="VMSize">Standard_M64ls</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 503.9 | <span class="Score">824,500</span> | 8,965 | 1.09% | 21 |
| <span class="VMSize">Standard_M64ls</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 503.9 | <span class="Score">759,753</span> | 7,639 | 1.01% | 7 |
| <span class="VMSize">Standard_M64ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,763.9 | <span class="Score">822,143</span> | 7,039 | 0.86% | 49 |
| <span class="VMSize">Standard_M64ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 2 | 1,763.9 | <span class="Score">826,498</span> | 8,036 | 0.97% | 21 |
| <span class="VMSize">Standard_M64ms</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 1,763.9 | <span class="Score">757,535</span> | 10,449 | 1.38% | 7 |
| <span class="VMSize">Standard_M64ms</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 2 | 1,763.9 | <span class="Score">753,546</span> | 8,391 | 1.11% | 7 |
| <span class="VMSize">Standard_M64-16ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 16 | 2 | 1,763.9 | <span class="Score">211,238</span> | 2,838 | 1.34% | 49 |
| <span class="VMSize">Standard_M64-16ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 16 | 2 | 1,763.9 | <span class="Score">210,437</span> | 2,606 | 1.24% | 28 |
| <span class="VMSize">Standard_M64-16ms</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 16 | 2 | 1,763.9 | <span class="Score">191,761</span> | 3,503 | 1.83% | 7 |
| <span class="VMSize">Standard_M64-32ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 2 | 1,763.9 | <span class="Score">416,715</span> | 3,858 | 0.93% | 35 |
| <span class="VMSize">Standard_M64-32ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 2 | 1,763.9 | <span class="Score">417,151</span> | 3,711 | 0.89% | 28 |
| <span class="VMSize">Standard_M64-32ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 3 | 1,763.9 | <span class="Score">417,771</span> | 4,820 | 1.15% | 7 |
| <span class="VMSize">Standard_M64-32ms</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 32 | 2 | 1,763.9 | <span class="Score">382,773</span> | 3,547 | 0.93% | 14 |
| <span class="VMSize">Standard_M128s</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 2,015.9 | <span class="Score">1,640,544</span> | 16,795 | 1.02% | 49 |
| <span class="VMSize">Standard_M128s</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 2,015.9 | <span class="Score">1,642,650</span> | 16,784 | 1.02% | 21 |
| <span class="VMSize">Standard_M128s</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 128 | 4 | 2,015.9 | <span class="Score">1,478,576</span> | 15,040 | 1.02% | 7 |
| <span class="VMSize">Standard_M128s</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 128 | 4 | 2,015.9 | <span class="Score">1,475,931</span> | 17,285 | 1.17% | 7 |
| <span class="VMSize">Standard_M128ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 3,831.1 | <span class="Score">1,645,513</span> | 17,488 | 1.06% | 42 |
| <span class="VMSize">Standard_M128ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 128 | 4 | 3,831.0 | <span class="Score">1,644,701</span> | 18,480 | 1.12% | 21 |
| <span class="VMSize">Standard_M128ms</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 128 | 4 | 3,831.1 | <span class="Score">1,481,933</span> | 18,017 | 1.22% | 14 |
| <span class="VMSize">Standard_M128ms</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 128 | 4 | 3,831.1 | <span class="Score">1,474,028</span> | 14,454 | 0.98% | 7 |
| <span class="VMSize">Standard_M128-32ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 4 | 3,831.1 | <span class="Score">414,154</span> | 4,284 | 1.03% | 42 |
| <span class="VMSize">Standard_M128-32ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 32 | 4 | 3,831.0 | <span class="Score">415,315</span> | 5,571 | 1.34% | 21 |
| <span class="VMSize">Standard_M128-32ms</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 32 | 4 | 3,831.1 | <span class="Score">380,471</span> | 5,707 | 1.50% | 14 |
| <span class="VMSize">Standard_M128-32ms</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 32 | 4 | 3,831.1 | <span class="Score">380,891</span> | 5,984 | 1.57% | 7 |
| <span class="VMSize">Standard_M128-64ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 4 | 3,831.1 | <span class="Score">817,683</span> | 7,892 | 0.97% | 35 |
| <span class="VMSize">Standard_M128-64ms</span> | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 64 | 4 | 3,831.0 | <span class="Score">817,183</span> | 9,471 | 1.16% | 21 |
| <span class="VMSize">Standard_M128-64ms</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 4 | 3,831.1 | <span class="Score">751,087</span> | 8,355 | 1.11% | 21 |
| <span class="VMSize">Standard_M128-64ms</span> | Intel(R) Xeon(R) Platinum 8280M CPU @ 2.70GHz | 64 | 4 | 3,831.1 | <span class="Score">745,940</span> | 8,351 | 1.12% | 7 |


## About CoreMark
Windows numbers were computed by running [CoreMark](https://www.eembc.org/coremark/faq.php) on Windows Server 2019. CoreMark was configured with the number of threads set to the number of virtual CPUs, and concurrency set to `PThreads`. The target number of iterations was adjusted based on expected performance to provide a runtime of at least 20 seconds (typically much longer). The final score represents the number of iterations completed divided by the number of seconds it took to run the test. Each test was run at least seven times on each VM. Test run dates shown above. Tests run on multiple VMs across Azure public regions the VM was supported in on the
date run. Basic A and B (Burstable) series not shown because performance is variable. N series not shown as they are GPU centric and Coremark doesn't measure GPU performance.

## Next steps
* For storage capacities, disk details, and additional considerations for choosing among VM sizes, see [Sizes for virtual machines](../sizes.md).