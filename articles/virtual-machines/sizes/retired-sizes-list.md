---
title: Retired Azure VM size series 
description: A list containing all retired and soon to be retired VM size series and their replacement series.
author: mattmcinnes
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 02/02/2024
ms.author: mattmcinnes
ms.reviewer: iamwilliew
---

# Retired Azure VM size series

This article provides a list of all sizes that are retired or have been announced for retirement. For sizes that require it there are migration guides to help move to replacement sizes.

> [!WARNING]
> Series with *Retirement Status* listed as *Retired* are **no longer available** and can't be provisioned.

## What are retired size series?
Retired virtual machine size series are running on older hardware which is no longer supported. The hardware will be replaced with newer generations of hardware.

Series with *Retirement Status* listed as *Announced* are still available, but will be retired on the *Planned Retirement Date*. It's recommended that you plan your migration to a replacement series well before the listed retirement date.

To learn more about size series retirement, previous-gen sizes, and the retirement process, see the [size series retirement overview](./retirement-overview.md).

> [!IMPORTANT] 
> If you are currently using one of the size series listed as *Retired*, view the migration guide to switch to a replacement series as soon as possible.

*Previous-gen* size series are not retired and still fully supported, but they have limitations similar to series that are announced for retirement. For a list of previous-gen sizes, see [previous generation Azure VM sizes](./previous-gen-sizes-list.md).

## General purpose retired sizes

|Series name        | Retirement Status |Retirement Announcement Date | Planned Retirement Date | Migration Guide |
|-------------------|-------------------|-----------------------------|-------------------------|-----------------|
| Av1-series        | **Announced**     | 11/02/23                    | 8/31/24                 | [Av1-series Retirement](./migration-guides/av1-series-retirement.md)  |

## Compute optimized retired sizes

Currently there are no compute optimized series retired or announced for retirement.

## Memory optimized retired sizes

Currently there are no memory optimized series retired or announced for retirement.

## Storage optimized retired sizes

Currently there are no retired storage optimized series retired or announced for retirement.

## GPU accelerated retired sizes

| Series name       | Retirement Status |Retirement Announcement Date | Planned Retirement Date | Migration Guide
|-------------------|-------------------|-----------------------------|-------------------------|-----------------|
| NV-Series         | **Retired**       | -                           | 9/6/23                  | [NV-series Retirement](./migration-guides/nv-series-retirement.md)    |
| NC-Series         | **Retired**       | -                           | 9/6/23                  | [NC-series Retirement](./migration-guides/nc-series-retirement.md)    |
| NCv2-Series       | **Retired**       | -                           | 9/6/23                  | [NCv2-series Retirement](./migration-guides/ncv2-series-retirement.md)  |
| ND-Series         | **Retired**       | -                           | 9/6/23                  | [ND-series Retirement](./migration-guides/nd-series-retirement.md)    |

## FPGA accelerated retired sizes

Currently there are no retired FPGA accelerated series retired or announced for retirement.

## HPC retired sizes

| Series name       | Retirement Status |Retirement Announcement Date | Planned Retirement Date | Migration Guide
|-------------------|-------------------|-----------------------------|-------------------------|-----------------|
| HB-Series         | **Announced**     | 12/07/23                    | 8/31/24                  | [NV-series Retirement](./migration-guides/nv-series-retirement.md)    |

## ADH retired sizes

| Series name       | Retirement Status |Retirement Announcement Date | Planned Retirement Date | Migration Guide
|-------------------|-------------------|-----------------------------|-------------------------|-----------------|
| Dsv3-Type1        | **Retired**       | -                           | 6/30/23                  | [Dedicated Host SKU Retirement](./migration-guides/dedicated-host-retirement.md)    |
| Dsv3-Type2        | **Retired**       | -                           | 6/30/23                  | [Dedicated Host SKU Retirement](./migration-guides/dedicated-host-retirement.md)    |
| Esv3-Type1        | **Retired**       | -                           | 6/30/23                  | [Dedicated Host SKU Retirement](./migration-guides/dedicated-host-retirement.md)    |
| Esv3-Type2        | **Retired**       | -                           | 6/30/23                  | [Dedicated Host SKU Retirement](./migration-guides/dedicated-host-retirement.md)    |


## Next steps
- For a list of older and capacity limited sizes, see [Previous generation Azure VM sizes](./previous-gen-sizes-list.md).
- For more information on VM sizes, see [Sizes for virtual machines in Azure](../sizes.md).
