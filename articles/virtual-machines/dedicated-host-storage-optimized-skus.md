---
title: Storage Optimized Azure Dedicated Host SKUs
description: Specifications for VM packing of Storage Optimized ADH SKUs.
author: vamckMS
ms.author: vakavuru
ms.reviewer: mattmcinnes
ms.service: azure-dedicated-host
ms.topic: conceptual
ms.date: 01/23/2023
---

# Storage Optimized Azure Dedicated Host SKUs
Azure Dedicated Host SKUs are the combination of a VM family and a certain hardware specification. You can only deploy VMs of the VM series that the Dedicated Host SKU specifies. For example, on the Dsv3-Type3, you can only provision [Dsv3-series](dv3-dsv3-series.md#dsv3-series) VMs. 

This document goes through the hardware specifications and VM packings for all storage optimized Dedicated Host SKUs.

## Limitations

The sizes and hardware types available for dedicated hosts vary by region. Refer to the host [pricing page](https://aka.ms/ADHPricing) to learn more.

## Lasv3
### Lasv3-Type1

The Lasv3-Type1 is a Dedicated Host SKU utilizing the AMD 3rd Generation EPYC™ 7763v processor. It offers 64 physical cores, 112 vCPUs, and 1024 GiB of RAM. The Lasv3-Type1 runs [Lasv3-series](lasv3-series.md) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Lasv3-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size  | # VMs |
|----------------|-----------------|---------------|----------|-------|
| 64             | 112             | 1024 GiB      | L8as v3  | 10    |
|                |                 |               | L16as v3 | 5     |
|                |                 |               | L32as v3 | 2     |
|                |                 |               | L48as v3 | 1     |
|                |                 |               | L64as v3 | 1     |
|                |                 |               | L80as v3 | 1     |

## Lsv3
### Lsv3-Type1

The Lsv3-Type1 is a Dedicated Host SKU utilizing the Intel® 3rd Generation Xeon® Platinum 8370C (Ice Lake) processor. It offers 64 physical cores, 119 vCPUs, and 1024 GiB of RAM. The Lsv3-Type1 runs [Lsv3-series](lsv3-series.md) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Lsv3-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 64             | 119             | 1024 GiB      | L8s v3  | 10    |
|                |                 |               | L16s v3 | 5     |
|                |                 |               | L32s v3 | 2     |
|                |                 |               | L48s v3 | 1     |
|                |                 |               | L64s v3 | 1     |
|                |                 |               | L80s v3 | 1     |

## Lsv2
### Lsv2-Type1

The Lsv2-Type1 is a Dedicated Host SKU utilizing the AMD 2.55 GHz EPYC™ 7551 processor. It offers 64 physical cores, 80 vCPUs, and 640 GiB of RAM. The Lsv2-Type1 runs [Lsv2-series](lsv2-series.md) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a Lsv2-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size | # VMs |
|----------------|-----------------|---------------|---------|-------|
| 64             | 80              | 640 GiB       | L8s v2  | 10    |
|                |                 |               | L16s v2 | 5     |
|                |                 |               | L32s v2 | 2     |
|                |                 |               | L48s v2 | 1     |
|                |                 |               | L64s v2 | 1     |
|                |                 |               | L80s v2 | 1     |

## Next steps

- For more information, see the [Dedicated hosts](dedicated-hosts.md) overview.

- There's a sample template, available at [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.compute/vm-dedicated-hosts/README.md) that uses both zones and fault domains for maximum resiliency in a region.
