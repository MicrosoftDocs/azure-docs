---
title: Memory Optimized Azure Dedicated Host SKUs
description: Specifications for VM packing of Memory Optimized ADH SKUs.
author: vamckMS
ms.author: vakavuru
ms.reviewer: mattmcinnes
ms.service: azure-dedicated-host
ms.topic: conceptual
ms.date: 01/23/2023
---

# Memory Optimized Azure Dedicated Host SKUs
Azure Dedicated Host SKUs are the combination of a VM family and a certain hardware specification. You can only deploy VMs of the VM series that the Dedicated Host SKU specifies. For example, on the Dsv3-Type3, you can only provision [Dsv3-series](dv3-dsv3-series.md#dsv3-series) VMs. 

This document goes through the hardware specifications and VM packings for all memory optimized Dedicated Host SKUs.

## Limitations

The sizes and hardware types available for dedicated hosts vary by region. Refer to the host [pricing page](https://aka.ms/ADHPricing) to learn more.

## Eadsv5
### Eadsv5-Type1

The Eadsv5-Type1 is a Dedicated Host SKU utilizing AMD's EPYC™ 7763v processor. It offers 64 physical cores, 112 vCPUs, and 768 GiB of RAM. The Eadsv5-Type1 runs [Eadsv5-series](easv5-eadsv5-series.md#eadsv5-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto an Eadsv5-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size   | # VMs |
|----------------|-----------------|---------------|-----------|-------|
| 64             | 112             | 768 GiB       | E2ads v5  | 32    |
|                |                 |               | E4ads v5  | 21    |
|                |                 |               | E8ads v5  | 10    |
|                |                 |               | E16ads v5 | 5     |
|                |                 |               | E20ads v5 | 4     |
|                |                 |               | E32ads v5 | 2     |
|                |                 |               | E48ads v5 | 1     |
|                |                 |               | E64ads v5 | 1     |
|                |                 |               | E96ads v5 | 1     |

## Easv5
### Easv5-Type1

The Easv5-Type1 is a Dedicated Host SKU utilizing AMD's EPYC™ 7763v processor. It offers 64 physical cores, 112 vCPUs, and 768 GiB of RAM. The Easv5-Type1 runs [Easv5-series](easv5-eadsv5-series.md#easv5-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto an Easv5-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size  | # VMs |
|----------------|-----------------|---------------|----------|-------|
| 64             | 112             | 768 GiB       | E2as v5  | 32    |
|                |                 |               | E4as v5  | 21    |
|                |                 |               | E8as v5  | 10    |
|                |                 |               | E16as v5 | 5     |
|                |                 |               | E20as v5 | 4     |
|                |                 |               | E32as v5 | 2     |
|                |                 |               | E48as v5 | 1     |
|                |                 |               | E64as v5 | 1     |
|                |                 |               | E96as v5 | 1     |

## Easv4
### Easv4-Type1

The Easv4-Type1 is a Dedicated Host SKU utilizing AMD's 2.35 GHz EPYC™ 7452 processor. It offers 64 physical cores, 96 vCPUs, and 672 GiB of RAM. The Easv4-Type1 runs [Easv4-series](eav4-easv4-series.md#easv4-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto an Easv4-Type1 host.

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

### Easv4-Type2

The Easv4-Type2 is a Dedicated Host SKU utilizing AMD's EPYC™ 7763v processor. It offers 64 physical cores, 112 vCPUs, and 768 GiB of RAM. The Easv4-Type2 runs [Easv4-series](eav4-easv4-series.md#easv4-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto an Easv4-Type2 host.

| Physical cores | Available vCPUs | Available RAM | VM Size  | # VMs |
|----------------|-----------------|---------------|----------|-------|
| 64             | 112             | 768 GiB       | E2as v4  | 32    |
|                |                 |               | E4as v4  | 21    |
|                |                 |               | E8as v4  | 10    |
|                |                 |               | E16as v4 | 5     |
|                |                 |               | E20as v4 | 4     |
|                |                 |               | E32as v4 | 2     |
|                |                 |               | E48as v4 | 1     |
|                |                 |               | E64as v4 | 1     |
|                |                 |               | E96as v4 | 1     |

## Ebdsv5
### Ebdsv5-Type1

The Ebdsv5-Type1 is a Dedicated Host SKU utilizing the Intel® Ice Lake (Xeon® Platinum 8370C) processor. It offers 64 physical cores, 119 vCPUs, and 768 GiB of RAM. The Ebdsv5-Type1 runs [Ebdsv5-series](ebdsv5-ebsv5-series.md#ebdsv5-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto an Ebdsv5-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size   | # VMs |
|----------------|-----------------|---------------|-----------|-------|
| 64             | 119             | 768 GiB       | E2bds v5  | 8     |
|                |                 |               | E4bds v5  | 8     |
|                |                 |               | E8bds v5  | 6     |
|                |                 |               | E16bds v5 | 3     |
|                |                 |               | E32bds v5 | 1     |
|                |                 |               | E48bds v5 | 1     |
|                |                 |               | E64bds v5 | 1     |

## Ebsv5
### Ebsv5-Type1

The Ebsv5-Type1 is a Dedicated Host SKU utilizing the Intel® Ice Lake (Xeon® Platinum 8370C) processor. It offers 64 physical cores, 119 vCPUs, and 768 GiB of RAM. The Ebsv5-Type1 runs [Ebsv5-series](ebdsv5-ebsv5-series.md#ebsv5-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto an Ebsv5-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size  | # VMs |
|----------------|-----------------|---------------|----------|-------|
| 64             | 119             | 768 GiB       | E2bs v5  | 8     |
|                |                 |               | E4bs v5  | 8     |
|                |                 |               | E8bs v5  | 6     |
|                |                 |               | E16bs v5 | 3     |
|                |                 |               | E32bs v5 | 1     |
|                |                 |               | E48bs v5 | 1     |
|                |                 |               | E64bs v5 | 1     |

## ECadsv5
### ECadsv5-Type1

The ECadsv5-Type1 is a Dedicated Host SKU utilizing the AMD 3rd Generation EPYC™ 7763v processor. It offers 64 physical cores, 112 vCPUs, and 768 GiB of RAM. The ECadsv5-Type1 runs [ECadsv5-series](ecasv5-ecadsv5-series.md#ecadsv5-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto an ECadsv5-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size    | # VMs |
|----------------|-----------------|---------------|------------|-------|
| 64             | 112             | 768 GiB       | EC2ads v5  | 32    |
|                |                 |               | EC4ads v5  | 21    |
|                |                 |               | EC8ads v5  | 10    |
|                |                 |               | EC16ads v5 | 5     |
|                |                 |               | EC20ads v5 | 4     |
|                |                 |               | EC32ads v5 | 3     |
|                |                 |               | EC48ads v5 | 1     |
|                |                 |               | EC64ads v5 | 1     |
|                |                 |               | EC96ads v5 | 1     |

## ECasv5
### ECasv5-Type1

The ECasv5-Type1 is a Dedicated Host SKU utilizing the AMD 3rd Generation EPYC™ 7763v processor. It offers 64 physical cores, 112 vCPUs, and 768 GiB of RAM. The ECasv5-Type1 runs [ECasv5-series](ecasv5-ecadsv5-series.md#ecasv5-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto an ECasv5-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size   | # VMs |
|----------------|-----------------|---------------|-----------|-------|
| 64             | 112             | 768 GiB       | EC2as v5  | 32    |
|                |                 |               | EC4as v5  | 21    |
|                |                 |               | EC8as v5  | 10    |
|                |                 |               | EC16as v5 | 5     |
|                |                 |               | EC20as v5 | 4     |
|                |                 |               | EC32as v5 | 3     |
|                |                 |               | EC48as v5 | 1     |
|                |                 |               | EC64as v5 | 1     |
|                |                 |               | EC96as v5 | 1     |


## Edsv5
### Edsv5-Type1

The Edsv5-Type1 is a Dedicated Host SKU utilizing the Intel® Ice Lake (Xeon® Platinum 8370C) processor. It offers 64 physical cores, 119 vCPUs, and 768 GiB of RAM. The Edsv5-Type1 runs [Edsv5-series](edv5-edsv5-series.md#edsv5-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto an Edsv5-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size  | # VMs |
|----------------|-----------------|---------------|----------|-------|
| 64             | 119             | 768 GiB       | E2ds v5  | 32    |
|                |                 |               | E4ds v5  | 21    |
|                |                 |               | E8ds v5  | 10    |
|                |                 |               | E16ds v5 | 5     |
|                |                 |               | E20ds v5 | 4     |
|                |                 |               | E32ds v5 | 2     |
|                |                 |               | E48ds v5 | 1     |
|                |                 |               | E64ds v5 | 1     |

## Edsv4
### Edsv4-Type1

The Edsv4-Type1 is a Dedicated Host SKU utilizing the Intel® Cascade Lake (Xeon® Platinum 8272CL) processor. It offers 52 physical cores, 80 vCPUs, and 504 GiB of RAM. The Edsv4-Type1 runs [Edsv4-series](edv4-edsv4-series.md#edsv4-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto an Edsv4-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size  | # VMs |
|----------------|-----------------|---------------|----------|-------|
| 52             | 80              | 504 GiB       | E2ds v4  | 31    |
|                |                 |               | E4ds v4  | 15    |
|                |                 |               | E8ds v4  | 7     |
|                |                 |               | E16ds v4 | 3     |
|                |                 |               | E20ds v4 | 3     |
|                |                 |               | E32ds v4 | 1     |
|                |                 |               | E48ds v4 | 1     |
|                |                 |               | E64ds v4 | 1     |

### Edsv4-Type2

The Edsv4-Type2 is a Dedicated Host SKU utilizing the Intel® Ice Lake (Xeon® Platinum 8370C) processor. It offers 64 physical cores, 119 vCPUs, and 768 GiB of RAM. The Edsv4-Type2 runs [Edsv4-series](edv4-edsv4-series.md#edsv4-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto an Edsv4-Type2 host.

| Physical cores | Available vCPUs | Available RAM | VM Size  | # VMs |
|----------------|-----------------|---------------|----------|-------|
| 64             | 119             | 768 GiB       | E2ds v4  | 32    |
|                |                 |               | E4ds v4  | 19    |
|                |                 |               | E8ds v4  | 9     |
|                |                 |               | E16ds v4 | 4     |
|                |                 |               | E20ds v4 | 3     |
|                |                 |               | E32ds v4 | 2     |
|                |                 |               | E48ds v4 | 1     |
|                |                 |               | E64ds v4 | 1     |

## Esv5
### Esv5-Type1

The Esv5-Type1 is a Dedicated Host SKU utilizing the Intel® Ice Lake (Xeon® Platinum 8370C) processor. It offers 64 physical cores, 119 vCPUs, and 768 GiB of RAM. The Esv5-Type1 runs [Esv5-series](ev5-esv5-series.md#esv5-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto an Esv5-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 64             | 119             | 768 GiB       | E2s v5  | 32    |
|                |                 |               | E4s v5  | 21    |
|                |                 |               | E8s v5  | 10    |
|                |                 |               | E16s v5 | 5     |
|                |                 |               | E20s v5 | 4     |
|                |                 |               | E32s v5 | 2     |
|                |                 |               | E48s v5 | 1     |
|                |                 |               | E64s v5 | 1     |

## Esv4
### Esv4-Type1

The Esv4-Type1 is a Dedicated Host SKU utilizing the Intel® Cascade Lake (Xeon® Platinum 8272CL) processor. It offers 52 physical cores, 80 vCPUs, and 504 GiB of RAM. The Esv4-Type1 runs [Esv4-series](ev4-esv4-series.md#esv4-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto an Esv4-Type1 host.

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

### Esv4-Type2

The Esv4-Type2 is a Dedicated Host SKU utilizing the Intel® Ice Lake (Xeon® Platinum 8370C) processor. It offers 64 physical cores, 119 vCPUs, and 768 GiB of RAM. The Esv4-Type2 runs [Esv4-series](ev4-esv4-series.md#esv4-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto an Esv4-Type2 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 64             | 119             | 768 GiB       | E2s v4  | 32    |
|                |                 |               | E4s v4  | 21    |
|                |                 |               | E8s v4  | 10    |
|                |                 |               | E16s v4 | 5     |
|                |                 |               | E20s v4 | 4     |
|                |                 |               | E32s v4 | 2     |
|                |                 |               | E48s v4 | 1     |
|                |                 |               | E64s v4 | 1     |

## Esv3
### Esv3-Type1

> [!NOTE]
>  **The Esv3-Type1 will be retired on June 30, 2023**. Refer to the [dedicated host retirement guide](dedicated-host-retirement.md) to learn more.

The Esv3-Type1 is a Dedicated Host SKU utilizing the Intel® Broadwell (2.3 GHz Xeon® E5-2673 v4) processor. It offers 40 physical cores, 64 vCPUs, and 448 GiB of RAM. The Esv3-Type1 runs [Esv3-series](ev3-esv3-series.md#ev3-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto an Esv3-Type1 host.

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

> [!NOTE]
>  **The Esv3-Type2 will be retired on June 30, 2023**. Refer to the [dedicated host retirement guide](dedicated-host-retirement.md) to learn more.

The Esv3-Type2 is a Dedicated Host SKU utilizing the Intel® Skylake (Xeon® 8171M) processor. It offers 48 physical cores, 76 vCPUs, and 504 GiB of RAM. The Esv3-Type2 runs [Esv3-series](ev3-esv3-series.md#ev3-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto an Esv3-Type2 host.

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

The following packing configuration outlines the max packing of uniform VMs you can put onto an Esv3-Type3 host.

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

### Esv3-Type4

The Esv3-Type4 is a Dedicated Host SKU utilizing the Intel® Ice Lake (Xeon® Platinum 8370C) processor. It offers 64 physical cores, 119 vCPUs, and 768 GiB of RAM. The Esv3-Type4 runs [Esv3-series](ev3-esv3-series.md#ev3-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto an Esv3-Type4 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 64             | 119             | 768 GiB       | E2s v3  | 32    |
|                |                 |               | E4s v3  | 21    |
|                |                 |               | E8s v3  | 10    |
|                |                 |               | E16s v3 | 5     |
|                |                 |               | E20s v3 | 4     |
|                |                 |               | E32s v3 | 2     |
|                |                 |               | E48s v3 | 1     |
|                |                 |               | E64s v3 | 1     |

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

## Next steps

- For more information, see the [Dedicated hosts](dedicated-hosts.md) overview.

- There's sample template, available at [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.compute/vm-dedicated-hosts/README.md), which uses both zones and fault domains for maximum resiliency in a region.
