---
title: Constrained vCPU sizes 
description: Lists the Vm sizes that are capable of having a constrained vCPU count.
author: mimckitt
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 03/09/2018
ms.author: mimckitt
---

# Constrained vCPU capable VM sizes

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

> [!TIP]
> Try the **[Virtual Machine selector tool](https://aka.ms/vm-selector)** to find other sizes that best fit your workload.

Some database workloads like SQL Server require high memory, storage, and I/O bandwidth, but not a high number of cores. Many database workloads are not CPU-intensive. Azure offers pre-defined VM sizes with lower vCPU count which can help to reduce the cost of software licensing, while maintaining the same memory, storage, and I/O bandwidth.

The available vCPU count can be  reduced to one half or one quarter of the original VM specification. These new VM sizes have a suffix that specifies the number of available vCPUs to make them easier for you to identify. There are no additional cores available that can be used by the VM.

For example, the Standard_E32s_v5 VM size comes with 32 vCPUs, 256 GiB RAM, 32 disks, and 80,000 IOPs or 2 GB/s of I/O bandwidth. The pre-defined Standard_E32-16s_v5 and Standard_E32-8s_v5 VM sizes comes with 16 and 8 active vCPUs respectively, while maintaining the memory, storage, and I/O bandwidth specifications of the Standard_E32s_v5.

The licensing fees charged for SQL Server are based on the avaialble vCPU count. Third party products should count the available vCPU which represents the max to be used and licensed. This results in a 50% to 75% increase in the ratio of the VM specs to available (billable) vCPUs. At this time, the VM pricing, which includes OS licensing, remains the same as the original size. For more information, see [Azure VM sizes for more cost-effective database workloads](https://azure.microsoft.com/blog/announcing-new-azure-vm-sizes-for-more-cost-effective-database-workloads/).


| Name                    | vCPU | Specs              |
|-------------------------|------|--------------------|
| Standard_M8-2ms         | 2    | Same as M8ms       |
| Standard_M8-4ms         | 4    | Same as M8ms       |
| Standard_M16-4ms        | 4    | Same as M16ms      |
| Standard_M16-8ms        | 8    | Same as M16ms      |
| Standard_M32-8ms        | 8    | Same as M32ms      |
| Standard_M32-16ms       | 16   | Same as M32ms      |
| Standard_M64-32ms       | 32   | Same as M64ms      |
| Standard_M64-16ms       | 16   | Same as M64ms      |
| Standard_M128-64ms      | 64   | Same as M128ms     |
| Standard_M128-32ms      | 32   | Same as M128ms     |
| Standard_E4-2s_v3       | 2    | Same as E4s_v3     |
| Standard_E8-4s_v3       | 4    | Same as E8s_v3     |
| Standard_E8-2s_v3       | 2    | Same as E8s_v3     |
| Standard_E16-8s_v3      | 8    | Same as E16s_v3    |
| Standard_E16-4s_v3      | 4    | Same as E16s_v3    |
| Standard_E32-16s_v3     | 16   | Same as E32s_v3    |
| Standard_E32-8s_v3      | 8    | Same as E32s_v3    |
| Standard_E64-32s_v3     | 32   | Same as E64s_v3    |
| Standard_E64-16s_v3     | 16   | Same as E64s_v3    |
| Standard_E4-2s_v4       | 2    | Same as E4s_v4     |
| Standard_E8-4s_v4       | 4    | Same as E8s_v4     |
| Standard_E8-2s_v4       | 2    | Same as E8s_v4     |
| Standard_E16-8s_v4      | 8    | Same as E16s_v4    |
| Standard_E16-4s_v4      | 4    | Same as E16s_v4    |
| Standard_E32-16s_v4     | 16   | Same as E32s_v4    |
| Standard_E32-8s_v4      | 8    | Same as E32s_v4    |
| Standard_E64-32s_v4     | 32   | Same as E64s_v4    |
| Standard_E64-16s_v4     | 16   | Same as E64s_v4    |
| Standard_E4-2ds_v4      | 2    | Same as E4ds_v4    |
| Standard_E8-4ds_v4      | 4    | Same as E8ds_v4    |
| Standard_E8-2ds_v4      | 2    | Same as E8ds_v4    |
| Standard_E16-8ds_v4     | 8    | Same as E16ds_v4   |
| Standard_E16-4ds_v4     | 4    | Same as E16ds_v4   |
| Standard_E32-16ds_v4    | 16   | Same as E32ds_v4   |
| Standard_E32-8ds_v4     | 8    | Same as E32ds_v4   |
| Standard_E64-32ds_v4    | 32   | Same as E64ds_v4   |
| Standard_E64-16ds_v4    | 16   | Same as E64ds_v4   |
| Standard_E4-2s_v5       | 2    | Same as E4s_v5     |
| Standard_E8-4s_v5       | 4    | Same as E8s_v5     |
| Standard_E8-2s_v5       | 2    | Same as E8s_v5     |
| Standard_E16-8s_v5      | 8    | Same as E16s_v5    |
| Standard_E16-4s_v5      | 4    | Same as E16s_v5    |
| Standard_E32-16s_v5     | 16   | Same as E32s_v5    |
| Standard_E32-8s_v5      | 8    | Same as E32s_v5    |
| Standard_E64-32s_v5     | 32   | Same as E64s_v5    |
| Standard_E64-16s_v5     | 16   | Same as E64s_v5    |
| Standard_E96-48s_v5     | 48   | Same as E96s_v5    |
| Standard_E96-24s_v5     | 24   | Same as E96s_v5    |
| Standard_E4-2ds_v5      | 2    | Same as E4ds_v5    |
| Standard_E8-4ds_v5      | 4    | Same as E8ds_v5    |
| Standard_E8-2ds_v5      | 2    | Same as E8ds_v5    |
| Standard_E16-8ds_v5     | 8    | Same as E16ds_v5   |
| Standard_E16-4ds_v5     | 4    | Same as E16ds_v5   |
| Standard_E32-16ds_v5    | 16   | Same as E32ds_v5   |
| Standard_E32-8ds_v5     | 8    | Same as E32ds_v5   |
| Standard_E64-32ds_v5    | 32   | Same as E64ds_v5   |
| Standard_E64-16ds_v5    | 16   | Same as E64ds_v5   |
| Standard_E96-48ds_v5    | 48   | Same as E96ds_v5   |
| Standard_E96-24ds_v5    | 24   | Same as E96ds_v5   |
| Standard_E4-2as_v4      | 2    | Same as E4as_v4    |
| Standard_E8-4as_v4      | 4    | Same as E8as_v4    |
| Standard_E8-2as_v4      | 2    | Same as E8as_v4    |
| Standard_E16-8as_v4     | 8    | Same as E16as_v4   |
| Standard_E16-4as_v4     | 4    | Same as E16as_v4   |
| Standard_E32-16as_v4    | 16   | Same as E32as_v4   |
| Standard_E32-8as_v4     | 8    | Same as E32as_v4   |
| Standard_E64-32as_v4    | 32   | Same as E64as_v4   |
| Standard_E64-16as_v4    | 16   | Same as E64as_v4   |
| Standard_E96-48as_v4    | 48   | Same as E96as_v4   |
| Standard_E96-24as_v4    | 24   | Same as E96as_v4   |
| Standard_E4-2ads_v5     | 2    | Same as E4ads_v5   |
| Standard_E8-4ads_v5     | 4    | Same as E8ads_v5   |
| Standard_E8-2ads_v5     | 2    | Same as E8ads_v5   |
| Standard_E16-8ads_v5    | 8    | Same as E16ads_v5  |
| Standard_E16-4ads_v5    | 4    | Same as E16ads_v5  |
| Standard_E32-16ads_v5   | 16   | Same as E32ads_v5  |
| Standard_E32-8ads_v5    | 8    | Same as E32ads_v5  |
| Standard_E64-32ads_v5   | 32   | Same as E64ads_v5  |
| Standard_E64-16ads_v5   | 16   | Same as E64ads_v5  |
| Standard_E96-48ads_v5   | 48   | Same as E96ads_v5  |
| Standard_E96-24ads_v5   | 24   | Same as E96ads_v5  |
| Standard_E4-2as_v5      |	2    | Same as E4as_v5    |  
| Standard_E8-4as_v5      |	4    | Same as E8as_v5    | 
| Standard_E8-2as_v5      |	2    | Same as E8as_v5    |  
| Standard_E16-8as_v5     |	8    | Same as E16as_v5   |
| Standard_E16-4as_v5     |	4    | Same as E16as_v5   |
| Standard_E32-16as_v5    |	16   | Same as E32as_v5   |
| Standard_E32-8as_v5     |	8    | Same as E32as_v5   |
| Standard_E64-32as_v5    |	32   | Same as E64as_v5   |
| Standard_E64-16as_v5    | 16   | Same as E64as_v5   |
| Standard_E96-48as_v5    | 48   | Same as E96as_v5   |
| Standard_E96-24as_v5    | 24   | Same as E96as_v5   |
| Standard_GS4-8          | 8    | Same as GS4        |
| Standard_GS4-4          | 4    | Same as GS4        |
| Standard_GS5-16         | 16   | Same as GS5        |
| Standard_GS5-8          | 8    | Same as GS5        |
| Standard_DS11-1_v2      | 1    | Same as DS11_v2    |
| Standard_DS12-2_v2      | 2    | Same as DS12_v2    |
| Standard_DS12-1_v2      | 1    | Same as DS12_v2    |
| Standard_DS13-4_v2      | 4    | Same as DS13_v2    |
| Standard_DS13-2_v2      | 2    | Same as DS13_v2    |
| Standard_DS14-8_v2      | 8    | Same as DS14_v2    |
| Standard_DS14-4_v2      | 4    | Same as DS14_v2    |
| Standard_M416-208s_v2   | 208  | Same as M416s_v2   |
| Standard_M416-208ms_v2  | 208  | Same as M416ms_v2  |

## Other sizes
- [Compute optimized](./sizes-compute.md)
- [Memory optimized](./sizes-memory.md)
- [Storage optimized](./sizes-storage.md)
- [GPU](./sizes-gpu.md)
- [High performance compute](./sizes-hpc.md)

## Next steps
Learn more about how [Azure compute units (ACU)](./acu.md) can help you compare compute performance across Azure SKUs.
