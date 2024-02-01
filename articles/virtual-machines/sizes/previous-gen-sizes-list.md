---
title: Previous generation Azure VM sizes 
description: A list containing all previous generation and capacity limited VM size series.
author: mattmcinnes
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 01/31/2024
ms.author: mattmcinnes
ms.reviewer: iamwilliew
---

# Previous generation Azure VM sizes 

This article provides a list of all sizes that are considered *previous-gen* or *capacity limited*. For sizes that require it there are *migration guides* to help move to replacement sizes.

To learn more about size series retirement, see the [size series retirement overview](./retirement-overview.md).

> [!NOTE]
> *Previous generation* and *capacity limited* sizes **are not currently retired** and can still be used.

## What are previous-gen sizes?
Previous generations virtual machine sizes can still be used, but there are newer generations available. Capacity increases are not guaranteed for previous-gen sizes. It's recommended to migrate to the latest generation replacements.

## What are capacity limited previous-gen sizes?
Capacity limited virtual machine sizes are are older sizes which are still fully supported, but they won't receive more capacity. Unlike other size series which will be deployed based on demand, capacity limited sizes are limited to what is currently deployed and decreases as hardware is phased out. There are newer or alternative sizes that are generally available.



## General Purpose previous-gen sizes

|Series name                 | Status                 | Migration guide   |
|----------------------------|------------------------|-------------------|
| Basic A-series             | Capacity limited       |
| Standard A-series          | Capacity limited       |
| Compute-intensive A-series | Capacity limited       |
| Standard D-series          | Capacity limited       | 
| Preview DC-series          | Capacity limited       |
| DS-series                  | Capacity limited       |

For a list of general purpose sizes listed as "retired" and "announced for retirement" (sizes that are no longer available or soon to be unavailable for use), see [retired general purpose sizes](./retired-sizes-list.md#general-purpose-retired-sizes).

## Compute optimized previous-gen sizes

|Series name                | Status                  | Migration guide   |
|---------------------------|-------------------------|-------------------|
| F-series                  | Previous-gen            |                   |
| Fs-series                 | Previous-gen            |                   |

For a list of compute optimized sizes listed as "retired" and "announced for retirement" (sizes that are no longer available or soon to be unavailable for use), see [retired compute optimized sizes](./retired-sizes-list.md#compute-optimized-retired-sizes).

## Memory optimized previous-gen sizes

|Series name                | Replacement series      |Migration guide |
|---------------------------|-------------------------|----------------|
| GS-series                 | Capacity limited        |                |
| G-series                  | Capacity limited        |                |
| Memory-optimized D-series | Capacity limited        |                |
| Memory-optimized DS-series| Capacity limited        |                |

For a list of memory optimized sizes listed as "retired" and "announced for retirement" (sizes that are no longer available or soon to be unavailable for use), see [retired memory optimized sizes](./retired-sizes-list.md#memory-optimized-retired-sizes).

## Storage optimized previous-gen sizes

|Series name                | Replacement series   | Migration guide|
|---------------------------|----------------------|----------------|
| Ls-series                 | Capacity limited     |                |

For a list of storage optimized sizes listed as "retired" and "announced for retirement" (sizes that are no longer available or soon to be unavailable for use), see [retired storage optimized sizes](./retired-sizes-list.md#storage-optimized-retired-sizes).

## GPU accelerated previous-gen sizes

|Series name                 | Status                 | Migration guide   |
|----------------------------|------------------------|-------------------|
| NVv2-series                | Previous-gen           |                   |

For a list of GPU accelerated sizes listed as "retired" and "announced for retirement" (sizes that are no longer available or soon to be unavailable for use), see [retired gpu accelerated sizes](./retired-sizes-list.md#gpu-accelerated-retired-sizes).

## FPGA accelerated previous-gen sizes

Currently there are no previous-gen or capacity limited FPGA accelerated sizes.

For a list of FPGA accelerated sizes listed as "retired" and "announced for retirement" (sizes that are no longer available or soon to be unavailable for use), see [retired fpga accelerated sizes](./retired-sizes-list.md#fpga-accelerated-retired-sizes).

## HPC previous-gen sizes

Currently there are no previous-gen or capacity limited HPC sizes.

For a list of HPC sizes listed as "retired" and "announced for retirement" (sizes that are no longer available or soon to be unavailable for use), see [retired HPC sizes](./retired-sizes-list.md#hpc-retired-sizes).

## ADH previous-gen sizes

Currently there are no previous-gen or capacity limited ADH sizes.

For a list of ADH sizes listed as "retired" and "announced for retirement" (sizes that are no longer available or soon to be unavailable for use), see [retired ADH sizes](./retired-sizes-list.md#adh-retired-sizes).

## Next steps
- For a list of retired sizes, see [Retired Azure VM sizes](./retired-sizes-list.md).
- For more information on VM sizes, see [Sizes for virtual machines in Azure](../sizes.md).
