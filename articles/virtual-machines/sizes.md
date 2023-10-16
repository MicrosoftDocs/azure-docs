---
title: VM sizes 
description: Lists the different sizes available for virtual machines in Azure.
author: lauradolan
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 03/06/2023
ms.author: ladolan
---

# Sizes for virtual machines in Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

This article describes the available sizes and options for the Azure virtual machines you can use to run your apps and workloads. It also provides deployment considerations to be aware of when you're planning to use these resources. 

> [!TIP]
> Try the **[Virtual machines selector tool](https://aka.ms/vm-selector)** to find other sizes that best fit your workload.

:::image type="content" source="media/sizes/azurevmsthumb.jpg" alt-text="YouTube video for selecting the right size for your VM." link="https://youtu.be/zOSvnJFd3ZM":::

| Type | Sizes | Description |
|------|-------|-------------|
| [General purpose](sizes-general.md)   | B, Dsv3, Dv3, Dasv4, Dav4, DSv2, Dv2, Av2, DC, DCv2, Dpdsv5, Dpldsv5, Dpsv5, Dplsv5, Dv4, Dsv4, Ddv4, Ddsv4, Dv5, Dsv5, Ddv5, Ddsv5, Dasv5, Dadsv5, DCasv5, DCadsv5 | Balanced CPU-to-memory ratio. Ideal for testing and development, small to medium databases, and low to medium traffic web servers. |
| [Compute optimized](sizes-compute.md) | F, Fs, Fsv2, FX | High CPU-to-memory ratio. Good for medium traffic web servers, network appliances, batch processes, and application servers. |
| [Memory optimized](sizes-memory.md) | Esv3, Ev3, Easv4, Eav4, Epdsv5, Epsv5, Ev4, Esv4, Edv4, Edsv4, Ev5, Esv5, Edv5, Edsv5, Easv5, Eadsv5, Mv2, M, DSv2, Dv2, ECasv5, ECadsv5 | High memory-to-CPU ratio. Great for relational database servers, medium to large caches, and in-memory analytics.                 |
| [Storage optimized](sizes-storage.md) | Lsv2, Lsv3, Lasv3 | High disk throughput and IO ideal for Big Data, SQL, NoSQL databases, data warehousing and large transactional databases.  |
| [GPU](sizes-gpu.md) | NC, NCv2, NCv3, NCasT4_v3, NC A100 v4, ND, NDv2, NGads V620, NV, NVv3, NVv4, NDasrA100_v4, NDm_A100_v4 | Specialized virtual machines targeted for heavy graphic rendering and video editing, as well as model training and inferencing (ND) with deep learning. Available with single or multiple GPUs. |
| [High performance compute](sizes-hpc.md) | HB, HBv2, HBv3, HBv4, HC, HX | Our fastest and most powerful CPU virtual machines with optional high-throughput network interfaces (RDMA). |

- For information about pricing of the various sizes, see the pricing pages for [Linux](https://azure.microsoft.com/pricing/details/virtual-machines/#Linux) or [Windows](https://azure.microsoft.com/pricing/details/virtual-machines/Windows/#Windows).
- For availability of VM sizes in Azure regions, see [Products available by region](https://azure.microsoft.com/regions/services/).
- To see general limits on Azure VMs, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).
- For more information on how Azure names its VMs, see [Azure virtual machine sizes naming conventions](./vm-naming-conventions.md).

## REST API

For information on using the REST API to query for VM sizes, see the following articles:

- [List available virtual machine sizes for resizing](/rest/api/compute/virtualmachines/listavailablesizes)
- [List available virtual machine sizes for a subscription](/rest/api/compute/resourceskus/list)
- [List available virtual machine sizes in an availability set](/rest/api/compute/availabilitysets/listavailablesizes)

## ACU

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.

## Benchmark scores

Learn more about compute performance for Linux VMs using the [CoreMark benchmark scores](./linux/compute-benchmark-scores.md).

Learn more about compute performance for Windows VMs using the [SPECInt benchmark scores](./windows/compute-benchmark-scores.md).

## Manage costs

[!INCLUDE [cost-management-horizontal](../../includes/cost-management-horizontal.md)]

## Next steps

Learn more about the different VM sizes that are available:

- [General purpose](sizes-general.md)
- [Compute optimized](sizes-compute.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- Check the [Previous generation](sizes-previous-gen.md) page for A Standard, Dv1 (D1-4 and D11-14 v1), and A8-A11 series
