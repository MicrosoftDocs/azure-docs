---
title: Dedicated Host SKU configuration tables
description: Specifications for VM packing of ADH SKUs.
author: brittanyrowe
ms.author: brittanyrowe
ms.reviewer: mimckitt
ms.service: virtual-machines
ms.subservice: dedicated-hosts
ms.topic: conceptual
ms.date: 10/01/2021
---

# Azure Dedicated Host SKU configuration tables
Azure Dedicated Host SKUs are the combination of a VM family and a certain hardware specification. You can only deploy VMs of the VM series that the Dedicated Host SKU specifies. For example, on the Dsv3-Type3, you can only provision [Dsv3-series](dv3-dsv3-series.md#dsv3-series) VMs. 

This document goes through the hardware specifications and VM packings for all Dedicated Host SKUs.

## Dasv4
### Dasv4-Type1
The Dasv4-Type1 is a Dedicated Host SKU utilizing AMD's 2.35 GHz EPYC™ 7452 processor. It offers 64 physical cores, 96 vCPUs, and 672 GiB of RAM. The Dasv4-Type1 runs [Dasv4-series](dav4-dasv4-series.md#dasv4-series) VMs. Please refer to the VM size documentation to better understand specific VM performance information.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Dasv4-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size  | # VMs |
|----------------|-----------------|---------------|----------|-------|
| 64             | 96              | 672 GiB       | D2as v4  | 32    |
|                |                 |               | D4as v4  | 24    |
|                |                 |               | D8as v4  | 12    |
|                |                 |               | D16as v4 | 6     |
|                |                 |               | D32as v4 | 3     |
|                |                 |               | D48as v4 | 2     |
|                |                 |               | D64as v4 | 1     |
|                |                 |               | D96as v4 | 1     |

You can also mix multiple VM sizes on the Dasv4-Type1. The following are sample combinations of VM packings on the Dasv4-Type1:
- 1 D48asv4 + 3 D16asv4
- 1 D32asv4 + 2 D16asv4 + 8 D4asv4
- 20 D4asv4 + 8 D2asv4

## Ddsv4
### Ddsv4-Type1
The Ddsv4-Type1 is a Dedicated Host SKU utilizing the Intel® Cascade Lake (Xeon® Platinum 8272CL) processor. It offers 52 physical cores, 68 vCPUs, and 504 GiB of RAM. The Ddsv4-Type1 runs [Ddsv4-series](ddv4-ddsv4-series.md#ddsv4-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Ddsv4-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size  | # VMs |
|----------------|-----------------|---------------|----------|-------|
| 52             | 68              | 504 GiB       | D2ds v4  | 32    |
|                |                 |               | D4ds v4  | 17    |
|                |                 |               | D8ds v4  | 8     |
|                |                 |               | D16ds v4 | 4     |
|                |                 |               | D32ds v4 | 1     |
|                |                 |               | D48ds v4 | 1     |
|                |                 |               | D64ds v4 | 1     |

You can also mix multiple VM sizes on the Ddsv4-Type1. The following are sample combinations of VM packings on the Ddsv4-Type1:
- 1 D48dsv4 + 4 D4dsv4 + 2 D2dsv4
- 1 D32dsv4 + 2 D16dsv4 + 1 D4dsv4
- 10 D4dsv4 + 14 D2dsv4

## Dsv4
### Dsv4-Type1

The Dsv4-Type1 is a Dedicated Host SKU utilizing the Intel® Cascade Lake (Xeon® Platinum 8272CL) processor. It offers 52 physical cores, 80 vCPUs, and 504 GiB of RAM. The Dsv4-Type1 runs [Dsv4-series](dv4-dsv4-series.md#dsv4-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Dsv4-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 52             | 80              | 504 GiB       | D2s v4  | 32    |
|                |                 |               | D4s v4  | 20    |
|                |                 |               | D8s v4  | 10    |
|                |                 |               | D16s v4 | 5     |
|                |                 |               | D32s v4 | 2     |
|                |                 |               | D48s v4 | 1     |
|                |                 |               | D64s v4 | 1     |

You can also mix multiple VM sizes on the Dsv4-Type1. The following are sample combinations of VM packings on the Dsv4-Type1:
- 1 D64sv4 + 1 D16sv4
- 1 D32sv4 + 2 D16dsv4 + 2 D8sv4
- 10 D4sv4 + 20 D2sv4

## Dsv3
### Dsv3-Type1

The Dsv3-Type1 is a Dedicated Host SKU utilizing the Intel® Broadwell (2.3 GHz Xeon® E5-2673 v4) processor. It offers 40 physical cores, 64 vCPUs, and 256 GiB of RAM. The Dsv3-Type1 runs [Dsv3-series](dv3-dsv3-series.md#dsv3-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Dsv3-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 40             | 64              | 256 GiB       | D2s v3  | 32    |
|                |                 |               | D4s v3  | 16    |
|                |                 |               | D8s v3  | 8     |
|                |                 |               | D16s v3 | 4     |
|                |                 |               | D32s v3 | 2     |
|                |                 |               | D48s v3 | 1     |
|                |                 |               | D64s v3 | 1     |

You can also mix multiple VM sizes on the Dsv3-Type1. The following are sample combinations of VM packings on the Dsv3-Type1:
- 1 D32sv3 + 1 D16sv3 + 1 D8sv3
- 1 D48sv3 + 3 D4sv3 + 2 D2sv3
- 10 D4sv3 + 12 D2sv3

### Dsv3-Type2

The Dsv3-Type2 is a Dedicated Host SKU utilizing the Intel® Skylake (2.1 GHz Xeon® Platinum 8171M) processor. It offers 48 physical cores, 76 vCPUs, and 504 GiB of RAM. The Dsv3-Type2 runs [Dsv3-series](dv3-dsv3-series.md#dsv3-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Dsv3-Type2 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 48             | 76              | 504 GiB       | D2s v3  | 32    |
|                |                 |               | D4s v3  | 18    |
|                |                 |               | D8s v3  | 9     |
|                |                 |               | D16s v3 | 4     |
|                |                 |               | D32s v3 | 2     |
|                |                 |               | D48s v3 | 1     |
|                |                 |               | D64s v3 | 1     |

You can also mix multiple VM sizes on the Dsv3-Type2. The following are sample combinations of VM packings on the Dsv3-Type2:
- 1 D64sv3 + 2 D4vs3 + 2 D2sv3
- 1 D48sv3 + 4 D4sv3 + 6 D2sv3
- 12 D4sv3 + 14 D2sv3

### Dsv3-Type3

The Dsv3-Type3 is a Dedicated Host SKU utilizing the Intel® Cascade Lake (Xeon® Platinum 8272CL) processor. It offers 52 physical cores, 80 vCPUs, and 504 GiB of RAM. The Dsv3-Type3 runs [Dsv3-series](dv3-dsv3-series.md#dsv3-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Dsv3-Type3 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 52             | 80              | 504 GiB       | D2s v3  | 32    |
|                |                 |               | D4s v3  | 20    |
|                |                 |               | D8s v3  | 10    |
|                |                 |               | D16s v3 | 5     |
|                |                 |               | D32s v3 | 2     |
|                |                 |               | D48s v3 | 1     |
|                |                 |               | D64s v3 | 1     |

You can also mix multiple VM sizes on the Dsv3-Type3. The following are sample combinations of VM packings on the Dsv3-Type3:
- 1 D64sv3 + 1 D8sv3 + 2 D4sv3
- 1 D48sv3 + 1 D16sv3 + 4 D4sv3
- 15 D4sv3 +  10 D2sv3

## DCsv2
### DCsv2-Type1

The DCsv2-Type1 is a Dedicated Host SKU utilizing the Intel® Coffee Lake (Xeon® E-2288G with SGX technology) processor. It offers 8 physical cores, 8 vCPUs, and 64 GiB of RAM. The DCsv2-Type1 runs [DCsv2-series](dcv2-series.md) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a DCsv2-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 8              | 8               | 64 GiB        | DC8s v2 | 1     |

## Easv4
### Easv4-Type1

The Easv4-Type1 is a Dedicated Host SKU utilizing AMD's 2.35 GHz EPYC™ 7452 processor. It offers 64 physical cores, 96 vCPUs, and 672 GiB of RAM. The Easv4-Type1 runs [Easv4-series](eav4-easv4-series.md#easv4-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Easv4-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size  | # VMs |
|----------------|-----------------|---------------|----------|-------|
| 64             | 96              | 672 GiB       | E2as v4  | 32    |
|                |                 |               | E4as v4  | 21    |
|                |                 |               | E8as v4  | 10    |
|                |                 |               | E16as v4 | 5     |
|                |                 |               | E20as v4 | 4     |
|                |                 |               | E32as v4 | 2     |
|                |                 |               | E48as v4 | 1     |
|                |                 |               | E64as v4 | 1     |
|                |                 |               | E96as v4 | 1     |

## Edsv4
### Edsv4-Type1

The Edsv4-Type1 is a Dedicated Host SKU utilizing the Intel® Cascade Lake (Xeon® Platinum 8272CL) processor. It offers 52 physical cores, 64 vCPUs, and 504 GiB of RAM. The Edsv4-Type1 runs [Edsv4-series](edv4-edsv4-series.md#edsv4-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Edsv4-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size  | # VMs |
|----------------|-----------------|---------------|----------|-------|
| 52             | 64              | 504 GiB       | E2ds v4  | 31    |
|                |                 |               | E4ds v4  | 15    |
|                |                 |               | E8ds v4  | 7     |
|                |                 |               | E16ds v4 | 3     |
|                |                 |               | E20ds v4 | 3     |
|                |                 |               | E32ds v4 | 1     |
|                |                 |               | E48ds v4 | 1     |
|                |                 |               | E64ds v4 | 1     |

## Esv4
### Esv4-Type1

The Esv4-Type1 is a Dedicated Host SKU utilizing the Intel® Cascade Lake (Xeon® Platinum 8272CL) processor. It offers 52 physical cores, 80 vCPUs, and 504 GiB of RAM. The Esv4-Type1 runs [Esv4-series](ev4-esv4-series.md#esv4-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Esv4-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 52             | 80              | 504 GiB       | E2s v4  | 31    |
|                |                 |               | E4s v4  | 15    |
|                |                 |               | E8s v4  | 7     |
|                |                 |               | E16s v4 | 3     |
|                |                 |               | E20s v4 | 3     |
|                |                 |               | E32s v4 | 1     |
|                |                 |               | E48s v4 | 1     |
|                |                 |               | E64s v4 | 1     |

## Esv3
### Esv3-Type1

The Esv3-Type1 is a Dedicated Host SKU utilizing the Intel® Broadwell (2.3 GHz Xeon® E5-2673 v4) processor. It offers 40 physical cores, 64 vCPUs, and 448 GiB of RAM. The Esv3-Type1 runs [Esv3-series](ev3-esv3-series.md#ev3-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Esv3-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 40             | 64              | 448 GiB       | E2s v3  | 28    |
|                |                 |               | E4s v3  | 14    |
|                |                 |               | E8s v3  | 7     |
|                |                 |               | E16s v3 | 3     |
|                |                 |               | E20s v3 | 2     |
|                |                 |               | E32s v3 | 1     |
|                |                 |               | E48s v3 | 1     |
|                |                 |               | E64s v3 | 1     |

### Esv3-Type2

The Esv3-Type2 is a Dedicated Host SKU utilizing the Intel® Skylake (Xeon® 8171M) processor. It offers 48 physical cores, 78 vCPUs, and 504 GiB of RAM. The Esv3-Type2 runs [Esv3-series](ev3-esv3-series.md#ev3-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Esv3-Type2 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 48             | 76              | 504 GiB       | E2s v3  | 31    |
|                |                 |               | E4s v3  | 15    |
|                |                 |               | E8s v3  | 7     |
|                |                 |               | E16s v3 | 3     |
|                |                 |               | E20s v3 | 3     |
|                |                 |               | E32s v3 | 1     |
|                |                 |               | E48s v3 | 1     |
|                |                 |               | E64s v3 | 1     |

### Esv3-Type3

The Esv3-Type3 is a Dedicated Host SKU utilizing the Intel® Cascade Lake (Xeon® Platinum 8272CL) processor. It offers 52 physical cores, 80 vCPUs, and 504 GiB of RAM. The Esv3-Type3 runs [Esv3-series](ev3-esv3-series.md#ev3-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Esv3-Type3 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 52             | 80              | 504 GiB       | E2s v3  | 31    |
|                |                 |               | E4s v3  | 15    |
|                |                 |               | E8s v3  | 7     |
|                |                 |               | E16s v3 | 3     |
|                |                 |               | E20s v3 | 3     |
|                |                 |               | E32s v3 | 1     |
|                |                 |               | E48s v3 | 1     |
|                |                 |               | E64s v3 | 1     |

## Fsv2
### Fsv2-Type2

The Fsv2-Type2 is a Dedicated Host SKU utilizing the Intel® Skylake (Xeon® Platinum 8168) processor. It offers 48 physical cores, 72 vCPUs, and 144 GiB of RAM. The Fsv2-Type2 runs [Fsv2-series](fsv2-series.md) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Fsv2-Type2 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 48             | 72              | 144 GiB       | F2s v2  | 32    |
|                |                 |               | F4s v2  | 18    |
|                |                 |               | F8s v2  | 9     |
|                |                 |               | F16s v2 | 4     |
|                |                 |               | F32s v2 | 2     |
|                |                 |               | F48s v2 | 1     |
|                |                 |               | F64s v2 | 1     |
|                |                 |               | F72s v2 | 1     |

### Fsv2-Type3

The Fsv2-Type3 is a Dedicated Host SKU utilizing the Intel® Cascade Lake (Xeon® Platinum 8272CL) processor. It offers 52 physical cores, 86 vCPUs, and 504 GiB of RAM. The Fsv2-Type3 runs [Fsv2-series](fsv2-series.md) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Fsv2-Type3 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 52             | 86              | 504 GiB       | F2s v2  | 32    |
|                |                 |               | F4s v2  | 21    |
|                |                 |               | F8s v2  | 10    |
|                |                 |               | F16s v2 | 5     |
|                |                 |               | F32s v2 | 2     |
|                |                 |               | F48s v2 | 1     |
|                |                 |               | F64s v2 | 1     |
|                |                 |               | F72s v2 | 1     |

## FXmds
### FXmds-Type1

The FXmds-Type1 is a Dedicated Host SKU utilizing the Intel® Cascade Lake (Xeon® Gold 6246R) processor. It offers 32 physical cores, 48 vCPUs, and 1,152 GiB of RAM. The FXmds-Type1 runs [FX-series](fx-series.md) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a FXmds-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 32             | 48              | 1,152 GiB     | FX4mds  | 12    |
|                |                 |               | FX12mds | 4     |
|                |                 |               | FX24mds | 2     |
|                |                 |               | FX36mds | 1     |
|                |                 |               | FX48mds | 1     |

## Lsv2
### Lsv2-Type1

The Lsv2-Type1 is a Dedicated Host SKU utilizing the Intel® Cascade Lake (Xeon® Gold 6246R) processor. It offers 64 physical cores, 80 vCPUs, and 640 GiB of RAM. The Lsv2-Type1 runs [Lsv2-series](lsv2-series.md) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Lsv2-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 64             | 80              | 640 GiB       | L8s v2  | 10    |
|                |                 |               | L16s v2 | 5     |
|                |                 |               | L32s v2 | 2     |
|                |                 |               | L48s v2 | 1     |
|                |                 |               | L64s v2 | 1     |
|                |                 |               | L80s v2 | 1     |

## M
### Ms-Type1

The Ms-Type1 is a Dedicated Host SKU utilizing the Intel® Cascade Lake (Xeon® Platinum 8280) processor. It offers 112 physical cores, 128 vCPUs, and 2,048 GiB of RAM. The Ms-Type1 runs [M-series](m-series.md) VMs, including M, Mls, Ms, and Mts VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Ms-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 112            | 128             | 2,048 GiB     | M32ls   | 4     |
|                |                 |               | M32ts   | 4     |
|                |                 |               | M64     | 2     | 
|                |                 |               | M64s    | 2     |
|                |                 |               | M64ls   | 2     |
|                |                 |               | M128    | 1     | 
|                |                 |               | M128s   | 1     |

### Msm-Type1

The Msm-Type1 is a Dedicated Host SKU utilizing the Intel® Cascade Lake (Xeon® Platinum 8280) processor. It offers 112 physical cores, 128 vCPUs, and 3,892 GiB of RAM. The Msm-Type1 runs [M-series](m-series.md) VMs, including Ms, Mms, Mts, and Mls VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Msm-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size   | # VMs |
|----------------|-----------------|---------------|-----------|-------|
| 112            | 128             | 3,892 GiB     | M8ms      | 16    |
|                |                 |               | M8-2ms    | 16    |
|                |                 |               | M8-4ms    | 16    |
|                |                 |               | M16ms     | 8     |
|                |                 |               | M16-4ms   | 8     |
|                |                 |               | M16-8ms   | 8     |
|                |                 |               | M32ts     | 4     |
|                |                 |               | M32ls     | 4     |
|                |                 |               | M32ms     | 4     |
|                |                 |               | M32-8ms   | 4     |
|                |                 |               | M32-16ms  | 4     |
|                |                 |               | M64ms     | 2     |
|                |                 |               | M64       | 2     | 
|                |                 |               | M64s      | 2     |
|                |                 |               | M64m      | 2     |
|                |                 |               | M64ls     | 2     |
|                |                 |               | M64-16ms  | 2     |
|                |                 |               | M64-32ms  | 2     |
|                |                 |               | M128ms    | 1     |
|                |                 |               | M128s     | 1     |
|                |                 |               | M128m     | 1     |
|                |                 |               | M128      | 1     | 
|                |                 |               | M128-32ms | 1     |
|                |                 |               | M128-64ms | 1     |

## Mv2
### Msmv2-Type1

The Msm-Type1 is a Dedicated Host SKU utilizing the Intel® Skylake (Xeon® Platinum 8180M) processor. It offers 224 physical cores, 416 vCPUs, and 11,400 GiB of RAM. The Msmv2-Type1 runs [Mv2-series](mv2-series.md) VMs, including Msv2 and Mmsv2 VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Msm-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size       | # VMs |
|----------------|-----------------|---------------|---------------|-------|
| 224            | 416             | 11,400 GiB    | M208ms v2     | 2     |
|                |                 |               | M208s  v2     | 2     |
|                |                 |               | M416-208ms v2 | 1     | 
|                |                 |               | M416-208s v2  | 1     | 
|                |                 |               | M416ms v2     | 1     |  
|                |                 |               | M416s v2      | 1     |  

### Msv2-Type1

The Msv2-Type1 is a Dedicated Host SKU utilizing the Intel® Skylake (Xeon® Platinum 8180M) processor. It offers 224 physical cores, 416 vCPUs, and 5,700 GiB of RAM. The Msv2-Type1 runs [Mv2-series](mv2-series.md) VMs, including Msv2 and Mmsv2 VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Msv2-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size       | # VMs |
|----------------|-----------------|---------------|---------------|-------|
| 224            | 416             | 5,700 GiB     | M208ms v2     | 2     |
|                |                 |               | M208s v2      | 1     |
|                |                 |               | M416-208s v2  | 1     |
|                |                 |               | M416s v2      | 1     |

## Msv2
### Mmsv2MedMem-Type1
The Mmsv2MedMem-Type1 is a Dedicated Host SKU utilizing the Intel® Cascade Lake (Xeon® Platinum 8280) processor. It offers 112 physical cores, 192 vCPUs, and 4,096 GiB of RAM. The Mmsv2MedMem-Type1 runs [Msv2-series](msv2-mdsv2-series.md) VMs, including Msv2 and Mmsv2 VMs.

| Physical cores | Available vCPUs | Available RAM | VM Size   | # VMs |
|----------------|-----------------|---------------|-----------|-------|
| 112            | 192             | 4,096 GiB     | M32ms v2  | 4     |
|                |                 |               | M64s v2   | 3     |
|                |                 |               | M64ms v2  | 2     |
|                |                 |               | M128ms v2 | 1     |
|                |                 |               | M128s v2  | 1     |

### Msv2MedMem-Type1
The Msv2MedMem-Type1 is a Dedicated Host SKU utilizing the Intel® Cascade Lake (Xeon® Platinum 8280) processor. It offers 112 physical cores, 192 vCPUs, and 2,048 GiB of RAM. The Msv2MedMem-Type1 runs [Msv2-series](msv2-mdsv2-series.md) VMs, including Msv2 and Mmsv2 VMs.

| Physical cores | Available vCPUs | Available RAM | VM Size    | # VMs |
|----------------|-----------------|---------------|------------|-------|
| 112            | 192             | 2,048 GiB     | M32ms v2   | 2     |
|                |                 |               | M64s v2    | 2     |
|                |                 |               | M64ms v2   | 1     |
|                |                 |               | M128s v2   | 1     |

## Mdsv2
### Mdmsv2MedMem-Type1
The Mdmsv2MedMem-Type1 is a Dedicated Host SKU utilizing the Intel® Cascade Lake (Xeon® Platinum 8280) processor. It offers 112 physical cores, 192 vCPUs, and 4,096 GiB of RAM. The Mdmsv2MedMem-Type1 runs [Msv2-series](msv2-mdsv2-series.md) VMs, including Mdsv2 and Mdmsv2 VMs.

| Physical cores | Available vCPUs | Available RAM | VM Size    | # VMs |
|----------------|-----------------|---------------|------------|-------|
| 112            | 192             | 4,096 GiB     | M32dms v2  | 4     |
|                |                 |               | M64ds v2   | 2     |
|                |                 |               | M64dms v2  | 2     |
|                |                 |               | M128ds v2  | 1     |
|                |                 |               | M128dms v2 | 1     |

### Mdsv2MedMem-Type1
The Mdsv2MedMem-Type1 is a Dedicated Host SKU utilizing the Intel® Cascade Lake (Xeon® Platinum 8280) processor. It offers 112 physical cores, 192 vCPUs, and 2,048 GiB of RAM. The Mdsv2MedMem-Type1 runs [Msv2-series](msv2-mdsv2-series.md) VMs, including Mdsv2 and Mdmsv2 VMs.

| Physical cores | Available vCPUs | Available RAM | VM Size   | # VMs |
|----------------|-----------------|---------------|-----------|-------|
| 112            | 192             | 2,048 GiB     | M32dms v2 | 2     |
|                |                 |               | M64ds v2  | 2     |
|                |                 |               | M64dms v2 | 1     |
|                |                 |               | M128ds v2 | 1     |

## NVasv4
### NVasv4-Type1

The NVasv4-Type1 is a Dedicated Host SKU utilizing the AMD® Rome (EPYC™ 7V12) processor with AMD Radeon Instinct MI25 GPUs. It offers 128 physical cores, 128 vCPUs, and 448 GiB of RAM. The NVasv4-Type1 runs [NVsv4-series](nvv4-series.md) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a NVasv4-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size   | # VMs |
|----------------|-----------------|---------------|-----------|-------|
| 128            | 128             | 448 GiB       | NV4as v4  | 30    |
|                |                 |               | NV8as v4  | 15    |
|                |                 |               | NV16as v4 | 7     |
|                |                 |               | NV32as v4 | 3     |

## NVsv3
### NVsv3-Type1

The NVsv3-Type1 is a Dedicated Host SKU utilizing the Intel® Broadwell (E5-2690 v4) processor with NVDIDIA Tesla M60 GPUs and NVIDIA GRID technology. It offers 28 physical cores, 48 vCPUs, and 448 GiB of RAM. The NVsv3-Type1 runs [NVv3-series](nvv3-series.md) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a NVsv3-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size  | # VMs |
|----------------|-----------------|---------------|----------|-------|
| 28             | 48              | 448 GiB       | NV12s v3 | 4     |
|                |                 |               | NV24s v3 | 2     |
|                |                 |               | NV48s v3 | 1     | 


## Next steps

- For more information, see the [Dedicated hosts](dedicated-hosts.md) overview.

- There is sample template, available at [Azure quickstart templates](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.compute/vm-dedicated-hosts/README.md), that uses both zones and fault domains for maximum resiliency in a region.