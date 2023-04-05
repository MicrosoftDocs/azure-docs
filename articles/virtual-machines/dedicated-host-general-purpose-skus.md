---
title: General Purpose Azure Dedicated Host SKUs
description: Specifications for VM packing of General Purpose ADH SKUs.
author: vamckMS
ms.author: vakavuru
ms.reviewer: mattmcinnes
ms.service: azure-dedicated-host
ms.topic: conceptual
ms.date: 01/23/2023
---

# General Purpose Azure Dedicated Host SKUs
Azure Dedicated Host SKUs are the combination of a VM family and a certain hardware specification. You can only deploy VMs of the VM series that the Dedicated Host SKU specifies. For example, on the Dsv3-Type3, you can only provision [Dsv3-series](dv3-dsv3-series.md#dsv3-series) VMs. 

This document goes through the hardware specifications and VM packings for all general purpose Dedicated Host SKUs.

## Limitations

The sizes and hardware types available for dedicated hosts vary by region. Refer to the host [pricing page](https://aka.ms/ADHPricing) to learn more.

## Dadsv5
### Dadsv5-Type1

The Dadsv5-Type1 is a Dedicated Host SKU utilizing AMD's EPYC™ 7763v processor. It offers 64 physical cores, 112 vCPUs, and 768 GiB of RAM. The Dadsv5-Type1 runs [Dadsv5-series](dasv5-dadsv5-series.md#dadsv5-series) VMs. Refer to the VM size documentation to better understand specific VM performance information.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Dadsv5-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size   | # VMs |
|----------------|-----------------|---------------|-----------|-------|
| 64             | 112             | 768 GiB       | D2ads v5  | 32    |
|                |                 |               | D4ads v5  | 27    |
|                |                 |               | D8ads v5  | 14    |
|                |                 |               | D16ads v5 | 7     |
|                |                 |               | D32ads v5 | 3     |
|                |                 |               | D48ads v5 | 2     |
|                |                 |               | D64ads v5 | 1     |
|                |                 |               | D96ads v5 | 1     |


## Dasv5
### Dasv5-Type1

The Dasv5-Type1 is a Dedicated Host SKU utilizing AMD's EPYC™ 7763v processor. It offers 64 physical cores, 112 vCPUs, and 768 GiB of RAM. The Dasv5-Type1 runs [Dasv5-series](dasv5-dadsv5-series.md#dasv5-series) VMs. Refer to the VM size documentation to better understand specific VM performance information.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Dasv5-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size  | # VMs |
|----------------|-----------------|---------------|----------|-------|
| 64             | 112             | 768 GiB       | D2as v5  | 32    |
|                |                 |               | D4as v5  | 28    |
|                |                 |               | D8as v5  | 14    |
|                |                 |               | D16as v5 | 7     |
|                |                 |               | D32as v5 | 3     |
|                |                 |               | D48as v5 | 2     |
|                |                 |               | D64as v5 | 1     |
|                |                 |               | D96as v5 | 1     |

## Dasv4
### Dasv4-Type1
The Dasv4-Type1 is a Dedicated Host SKU utilizing AMD's 2.35 GHz EPYC™ 7452 processor. It offers 64 physical cores, 96 vCPUs, and 672 GiB of RAM. The Dasv4-Type1 runs [Dasv4-series](dav4-dasv4-series.md#dasv4-series) VMs. Refer to the VM size documentation to better understand specific VM performance information.

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

### Dasv4-Type2
The Dasv4-Type2 is a Dedicated Host SKU utilizing AMD's EPYC™ 7763v processor. It offers 64 physical cores, 112 vCPUs, and 768 GiB of RAM. The Dasv4-Type2 runs [Dasv4-series](dav4-dasv4-series.md#dasv4-series) VMs. Refer to the VM size documentation to better understand specific VM performance information.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Dasv4-Type2 host.

| Physical cores | Available vCPUs | Available RAM | VM Size  | # VMs |
|----------------|-----------------|---------------|----------|-------|
| 64             | 112             | 768 GiB       | D2as v4  | 32    |
|                |                 |               | D4as v4  | 25    |
|                |                 |               | D8as v4  | 12    |
|                |                 |               | D16as v4 | 6     |
|                |                 |               | D32as v4 | 3     |
|                |                 |               | D48as v4 | 2     |
|                |                 |               | D64as v4 | 1     |
|                |                 |               | D96as v4 | 1     |

## DCadsv5
### DCadsv5-Type1

The DCadsv5-Type1 is a Dedicated Host SKU utilizing the AMD 3rd Generation EPYC™ 7763v processor. It offers 64 physical cores, 112 vCPUs, and 768 GiB of RAM. The DCadsv5-Type1 runs [DCadsv5-series](dcasv5-dcadsv5-series.md#dcadsv5-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto an DCadsv5-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size    | # VMs |
|----------------|-----------------|---------------|------------|-------|
| 64             | 112             | 768 GiB       | DC2ads v5  | 32    |
|                |                 |               | DC4ads v5  | 27    |
|                |                 |               | DC8ads v5  | 14    |
|                |                 |               | DC16ads v5 | 7     |
|                |                 |               | DC32ads v5 | 3     |
|                |                 |               | DC48ads v5 | 2     |
|                |                 |               | DC64ads v5 | 1     |
|                |                 |               | DC96ads v5 | 1     |

## DCasv5
### DCasv5-Type1

The DCasv5-Type1 is a Dedicated Host SKU utilizing the AMD 3rd Generation EPYC™ 7763v processor. It offers 64 physical cores, 112 vCPUs, and 768 GiB of RAM. The DCasv5-Type1 runs [DCasv5-series](dcasv5-dcadsv5-series.md#dcasv5-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto an DCasv5-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size   | # VMs |
|----------------|-----------------|---------------|-----------|-------|
| 64             | 112             | 768 GiB       | DC2as v5  | 32    |
|                |                 |               | DC4as v5  | 28    |
|                |                 |               | DC8as v5  | 14    |
|                |                 |               | DC16as v5 | 7     |
|                |                 |               | DC32as v5 | 3     |
|                |                 |               | DC48as v5 | 2     |
|                |                 |               | DC64as v5 | 1     |
|                |                 |               | DC96as v5 | 1     |

## DCsv3
### DCsv3-Type1

The DCsv3-Type1 is a Dedicated Host SKU utilizing the 3rd Generation Intel® Xeon Scalable Processor 8370C. It offers 48 physical cores, 48 vCPUs, and 384 GiB of RAM. The DCsv3-Type1 runs [DCsv3-series](dcv3-series.md#dcsv3-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a DCsv3-Type1 host.

| Physical cores  | Available vCPUs  |  Available RAM | VM Size    | # VMs |
|-----------------|------------------|----------------|------------|-------|
| 48              | 48               | 384 GiB        | DC1s v3    | 32    |
|                 |                  |                | DC2s v3    | 24    |
|                 |                  |                | DC4s v3    | 12    |
|                 |                  |                | DC8s v3    | 6     |
|                 |                  |                | DC16s v3   | 3     |
|                 |                  |                | DC24s v3   | 2     |

## DCdsv3
### DCdsv3-Type1

The DCdsv3-Type1 is a Dedicated Host SKU utilizing the 3rd Generation Intel® Xeon Scalable Processor 8370C. It offers 48 physical cores, 48 vCPUs, and 384 GiB of RAM. The DCdsv3-Type1 runs [DCdsv3-series](dcv3-series.md#dcdsv3-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a DCdsv3-Type1 host.

| Physical cores  | Available vCPUs  |  Available RAM | VM Size    | # VMs |
|-----------------|------------------|----------------|------------|-------|
| 48              | 48               | 384 GiB        | DC16ds v3  | 2     |
|                 |                  |                | DC24ds v3  | 1     |
|                 |                  |                | DC32ds v3  | 1     |
|                 |                  |                | DC48ds v3  | 1     |

## DCsv2
### DCsv2-Type1

The DCsv2-Type1 is a Dedicated Host SKU utilizing the Intel® Coffee Lake (Xeon® E-2288G with SGX technology) processor. It offers 8 physical cores, 8 vCPUs, and 64 GiB of RAM. The DCsv2-Type1 runs [DCsv2-series](dcv2-series.md) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a DCsv2-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 8              | 8               | 64 GiB        | DC8 v2  | 1     |

## Ddsv5
### Ddsv5-Type1

The Ddsv5-Type1 is a Dedicated Host SKU utilizing the Intel® Ice Lake (Xeon® Platinum 8370C) processor. It offers 64 physical cores, 119 vCPUs, and 768 GiB of RAM. The Ddsv5-Type1 runs [Ddsv5-series](ddv5-ddsv5-series.md#ddsv5-series) VMs. Refer to the VM size documentation to better understand specific VM performance information.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Ddsv5-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size  | # VMs |
|----------------|-----------------|---------------|----------|-------|
| 64             | 119             | 768 GiB       | D2ds v5  | 32    |
|                |                 |               | D4ds v5  | 22    |
|                |                 |               | D8ds v5  | 11    |
|                |                 |               | D16ds v5 | 5     |
|                |                 |               | D32ds v5 | 2     |
|                |                 |               | D48ds v5 | 1     |
|                |                 |               | D64ds v5 | 1     |
|                |                 |               | D96ds v5 | 1     |

## Ddsv4
### Ddsv4-Type1
The Ddsv4-Type1 is a Dedicated Host SKU utilizing the Intel® Cascade Lake (Xeon® Platinum 8272CL) processor. It offers 52 physical cores, 80 vCPUs, and 504 GiB of RAM. The Ddsv4-Type1 runs [Ddsv4-series](ddv4-ddsv4-series.md#ddsv4-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Ddsv4-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size  | # VMs |
|----------------|-----------------|---------------|----------|-------|
| 52             | 80              | 504 GiB       | D2ds v4  | 32    |
|                |                 |               | D4ds v4  | 17    |
|                |                 |               | D8ds v4  | 8     |
|                |                 |               | D16ds v4 | 4     |
|                |                 |               | D32ds v4 | 2     |
|                |                 |               | D48ds v4 | 1     |
|                |                 |               | D64ds v4 | 1     |

You can also mix multiple VM sizes on the Ddsv4-Type1. The following are sample combinations of VM packings on the Ddsv4-Type1:
- 1 D48dsv4 + 4 D4dsv4 + 2 D2dsv4
- 1 D32dsv4 + 2 D16dsv4 + 1 D4dsv4
- 10 D4dsv4 + 14 D2dsv4

### Ddsv4-Type2
The Ddsv4-Type2 is a Dedicated Host SKU utilizing the Intel® Ice Lake (Xeon® Platinum 8370C) processor. It offers 64 physical cores, 119 vCPUs, and 768 GiB of RAM. The Ddsv4-Type2 runs [Ddsv4-series](ddv4-ddsv4-series.md#ddsv4-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Ddsv4-Type2 host.

| Physical cores | Available vCPUs | Available RAM | VM Size  | # VMs |
|----------------|-----------------|---------------|----------|-------|
| 64             | 119             | 768 GiB       | D2ds v4  | 32    |
|                |                 |               | D4ds v4  | 19    |
|                |                 |               | D8ds v4  | 9     |
|                |                 |               | D16ds v4 | 4     |
|                |                 |               | D32ds v4 | 2     |
|                |                 |               | D48ds v4 | 1     |
|                |                 |               | D64ds v4 | 1     |

## Dsv5
### Dsv5-Type1

The Dsv5-Type1 is a Dedicated Host SKU utilizing the Intel® Ice Lake (Xeon® Platinum 8370C) processor. It offers 64 physical cores, 119 vCPUs, and 768 GiB of RAM. The Dsv5-Type1 runs [Dsv5-series](dv5-dsv5-series.md#dsv5-series) VMs. Refer to the VM size documentation to better understand specific VM performance information.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Dsv5-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 64             | 119             | 768 GiB       | D2s v5  | 32    |
|                |                 |               | D4s v5  | 25    |
|                |                 |               | D8s v5  | 12    |
|                |                 |               | D16s v5 | 6     |
|                |                 |               | D32s v5 | 3     |
|                |                 |               | D48s v5 | 2     |
|                |                 |               | D64s v5 | 1     |
|                |                 |               | D96s v5 | 1     |

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

### Dsv4-Type2

The Dsv4-Type2 is a Dedicated Host SKU utilizing the Intel® Ice Lake (Xeon® Platinum 8370C) processor. It offers 64 physical cores, 119 vCPUs, and 768 GiB of RAM. The Dsv4-Type2 runs [Dsv4-series](dv4-dsv4-series.md#dsv4-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Dsv4-Type2 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 64             | 119             | 768 GiB       | D2s v4  | 32    |
|                |                 |               | D4s v4  | 25    |
|                |                 |               | D8s v4  | 12    |
|                |                 |               | D16s v4 | 6     |
|                |                 |               | D32s v4 | 3     |
|                |                 |               | D48s v4 | 2     |
|                |                 |               | D64s v4 | 1     |

## Dsv3
### Dsv3-Type1

> [!NOTE]
>  **The Dsv3-Type1 will be retired on June 30, 2023**. Refer to the [dedicated host retirement guide](dedicated-host-retirement.md) to learn more.

The Dsv3-Type1 is a Dedicated Host SKU utilizing the Intel® Broadwell (2.3 GHz Xeon® E5-2673 v4) processor. It offers 40 physical cores, 64 vCPUs, and 256 GiB of RAM. The Dsv3-Type1 runs [Dsv3-series](dv3-dsv3-series.md#dsv3-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Dsv3-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 40             | 64              | 256 GiB       | D2s v3  | 32    |
|                |                 |               | D4s v3  | 17    |
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

> [!NOTE]
>  **The Dsv3-Type2 will be retired on June 30, 2023**. Refer to the [dedicated host retirement guide](dedicated-host-retirement.md) to learn more.

The Dsv3-Type2 is a Dedicated Host SKU utilizing the Intel® Skylake (2.1 GHz Xeon® Platinum 8171M) processor. It offers 48 physical cores, 76 vCPUs, and 504 GiB of RAM. The Dsv3-Type2 runs [Dsv3-series](dv3-dsv3-series.md#dsv3-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Dsv3-Type2 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 48             | 76              | 504 GiB       | D2s v3  | 32    |
|                |                 |               | D4s v3  | 20    |
|                |                 |               | D8s v3  | 10    |
|                |                 |               | D16s v3 | 5     |
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
|                |                 |               | D4s v3  | 21    |
|                |                 |               | D8s v3  | 10    |
|                |                 |               | D16s v3 | 5     |
|                |                 |               | D32s v3 | 2     |
|                |                 |               | D48s v3 | 1     |
|                |                 |               | D64s v3 | 1     |

You can also mix multiple VM sizes on the Dsv3-Type3. The following are sample combinations of VM packings on the Dsv3-Type3:
- 1 D64sv3 + 1 D8sv3 + 2 D4sv3
- 1 D48sv3 + 1 D16sv3 + 4 D4sv3
- 15 D4sv3 +  10 D2sv3

### Dsv3-Type4

The Dsv3-Type4 is a Dedicated Host SKU utilizing the Intel® Ice Lake (Xeon® Platinum 8370C) processor. It offers 64 physical cores, 119 vCPUs, and 768 GiB of RAM. The Dsv3-Type4 runs [Dsv3-series](dv3-dsv3-series.md#dsv3-series) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Dsv3-Type4 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 64             | 119             | 768 GiB       | D2s v3  | 32    |
|                |                 |               | D4s v3  | 24    |
|                |                 |               | D8s v3  | 12    |
|                |                 |               | D16s v3 | 6     |
|                |                 |               | D32s v3 | 3     |
|                |                 |               | D48s v3 | 2     |
|                |                 |               | D64s v3 | 1     |

## Next steps

- For more information, see the [Dedicated hosts](dedicated-hosts.md) overview.

- There is sample template, available at [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.compute/vm-dedicated-hosts/README.md) that uses both zones and fault domains for maximum resiliency in a region.
