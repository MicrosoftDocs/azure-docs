---
title: Compute Optimized Azure Dedicated Host SKUs
description: Specifications for VM packing of Compute Optimized ADH SKUs.
author: vamckMS
ms.author: vakavuru
ms.reviewer: mattmcinnes
ms.service: azure-dedicated-host
ms.topic: conceptual
ms.date: 01/23/2023
---

# Compute Optimized Azure Dedicated Host SKUs
Azure Dedicated Host SKUs are the combination of a VM family and a certain hardware specification. You can only deploy VMs of the VM series that the Dedicated Host SKU specifies. For example, on the Dsv3-Type3, you can only provision [Dsv3-series](dv3-dsv3-series.md#dsv3-series) VMs. 

This document goes through the hardware specifications and VM packings for all compute optimized Dedicated Host SKUs.

## Limitations

The sizes and hardware types available for dedicated hosts vary by region. Refer to the host [pricing page](https://aka.ms/ADHPricing) to learn more.

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

The Fsv2-Type3 is a Dedicated Host SKU utilizing the Intel® Cascade Lake (Xeon® Platinum 8272CL) processor. It offers 52 physical cores, 80 vCPUs, and 504 GiB of RAM. The Fsv2-Type3 runs [Fsv2-series](fsv2-series.md) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Fsv2-Type3 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 52             | 80              | 504 GiB       | F2s v2  | 32    |
|                |                 |               | F4s v2  | 21    |
|                |                 |               | F8s v2  | 10    |
|                |                 |               | F16s v2 | 5     |
|                |                 |               | F32s v2 | 2     |
|                |                 |               | F48s v2 | 1     |
|                |                 |               | F64s v2 | 1     |
|                |                 |               | F72s v2 | 1     |

### Fsv2-Type4

The Fsv2-Type4 is a Dedicated Host SKU utilizing the Intel® Ice Lake (Xeon® Platinum 8370C) processor. It offers 64 physical cores, 119 vCPUs, and 768 GiB of RAM. The Fsv2-Type4 runs [Fsv2-series](fsv2-series.md) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Fsv2-Type4 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 64             | 119             | 768 GiB       | F2s v2  | 32    |
|                |                 |               | F4s v2  | 24    |
|                |                 |               | F8s v2  | 12    |
|                |                 |               | F16s v2 | 6     |
|                |                 |               | F32s v2 | 3     |
|                |                 |               | F48s v2 | 2     |
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

## Next steps

- For more information, see the [Dedicated hosts](dedicated-hosts.md) overview.

- There is sample template, available at [Azure quickstart templates](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.compute/vm-dedicated-hosts/README.md), that uses both zones and fault domains for maximum resiliency in a region.
