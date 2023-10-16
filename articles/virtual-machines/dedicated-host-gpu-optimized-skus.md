---
title: GPU Optimized Azure Dedicated Host SKUs
description: Specifications for VM packing of GPU optimized ADH SKUs.
author: vamckMS
ms.author: vakavuru
ms.reviewer: mattmcinnes
ms.service: azure-dedicated-host
ms.topic: conceptual
ms.date: 01/23/2023
---

# GPU Optimized Azure Dedicated Host SKUs
Azure Dedicated Host SKUs are the combination of a VM family and a certain hardware specification. You can only deploy VMs of the VM series that the Dedicated Host SKU specifies. For example, on the Dsv3-Type3, you can only provision [Dsv3-series](dv3-dsv3-series.md#dsv3-series) VMs. 

This document goes through the hardware specifications and VM packings for all GPU optimized Dedicated Host SKUs.

## Limitations

The sizes and hardware types available for dedicated hosts vary by region. Refer to the host [pricing page](https://aka.ms/ADHPricing) to learn more.

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

The NVsv3-Type1 is a Dedicated Host SKU utilizing the Intel® Broadwell (E5-2690 v4) processor with NVIDIA Tesla M60 GPUs and NVIDIA GRID technology. It offers 28 physical cores, 48 vCPUs, and 448 GiB of RAM. The NVsv3-Type1 runs [NVv3-series](nvv3-series.md) VMs.

The following packing configuration outlines the max packing of uniform VMs you can put onto a NVsv3-Type1 host.

| Physical cores | Available vCPUs | Available RAM | VM Size  | # VMs |
|----------------|-----------------|---------------|----------|-------|
| 28             | 48              | 448 GiB       | NV12s v3 | 4     |
|                |                 |               | NV24s v3 | 2     |
|                |                 |               | NV48s v3 | 1     | 


## Next steps

- For more information, see the [Dedicated hosts](dedicated-hosts.md) overview.

- There is sample template, available at [Azure quickstart templates](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.compute/vm-dedicated-hosts/README.md), that uses both zones and fault domains for maximum resiliency in a region.
