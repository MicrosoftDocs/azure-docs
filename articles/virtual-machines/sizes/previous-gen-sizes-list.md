---
title: Previous generation Azure VM size series
description: A list containing all previous generation and capacity limited VM size series.
author: mattmcinnes
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 02/02/2024
ms.author: mattmcinnes
ms.reviewer: iamwilliew
---

# Previous generation Azure VM size series

This article provides a list of all size series that are considered *previous-gen*. Status is listed as *next-gen available* or *capacity limited* based on capacity. For sizes that require it there are *migration guides* to help move to replacement sizes.

> [!NOTE]
> Series listed as *previous-gen* are **not currently retired** and can still be used.

## What are previous-gen size series?
Previous generations virtual machine size series are running on older hardware. While they can still be used and are fully supported, there are newer generations available. It's recommended to migrate to the latest generation replacements.

To learn more about previous-gen sizes, retirement, and the status states of previous-gen size series, see the [size series retirement overview](./retirement-overview.md).

## General purpose previous-gen sizes

|Series name                 | Status                 | Migration guide   |
|----------------------------|------------------------|-------------------|
| Basic A-series             | [Capacity limited](./retirement-overview.md#capacity-limited) |
| Standard A-series          | [Capacity limited](./retirement-overview.md#capacity-limited) |
| Compute-intensive A-series | [Capacity limited](./retirement-overview.md#capacity-limited) |
| Standard D-series          | [Capacity limited](./retirement-overview.md#capacity-limited) | 
| Preview DC-series          | [Capacity limited](./retirement-overview.md#capacity-limited) |
| DS-series                  | [Capacity limited](./retirement-overview.md#capacity-limited) |

For a list of general purpose sizes listed as "retired" and "announced for retirement" (sizes that are no longer available or soon to be unavailable for use), see [retired general purpose sizes](./retired-sizes-list.md#general-purpose-retired-sizes).

## Compute optimized previous-gen sizes

|Series name                | Status                  | Migration guide   |
|---------------------------|-------------------------|-------------------|
| F-series                  | [Next-gen available](./retirement-overview.md#next-gen-available) |                   |
| Fs-series                 | [Next-gen available](./retirement-overview.md#next-gen-available) |                   |

For a list of compute optimized sizes listed as "retired" and "announced for retirement" (sizes that are no longer available or soon to be unavailable for use), see [retired compute optimized sizes](./retired-sizes-list.md#compute-optimized-retired-sizes).

## Memory optimized previous-gen sizes

|Series name                | Replacement series      |Migration guide |
|---------------------------|-------------------------|----------------|
| GS-series                 | [Capacity limited](./retirement-overview.md#capacity-limited)  |                |
| G-series                  | [Capacity limited](./retirement-overview.md#capacity-limited)  |                |
| Memory-optimized D-series | [Capacity limited](./retirement-overview.md#capacity-limited)  |                |
| Memory-optimized DS-series| [Capacity limited](./retirement-overview.md#capacity-limited)  |                |

For a list of memory optimized sizes listed as "retired" and "announced for retirement" (sizes that are no longer available or soon to be unavailable for use), see [retired memory optimized sizes](./retired-sizes-list.md#memory-optimized-retired-sizes).

## Storage optimized previous-gen sizes

|Series name                | Replacement series   | Migration guide|
|---------------------------|----------------------|----------------|
| Ls-series                 | [Capacity limited](./retirement-overview.md#capacity-limited) |                |

For a list of storage optimized sizes listed as "retired" and "announced for retirement" (sizes that are no longer available or soon to be unavailable for use), see [retired storage optimized sizes](./retired-sizes-list.md#storage-optimized-retired-sizes).

## GPU accelerated previous-gen sizes

|Series name                 | Status                 | Migration guide   |
|----------------------------|------------------------|-------------------|
| NVv2-series                | [Next-gen available](./retirement-overview.md#next-gen-available) |                   |

For a list of GPU accelerated sizes listed as "retired" and "announced for retirement" (sizes that are no longer available or soon to be unavailable for use), see [retired GPU accelerated sizes](./retired-sizes-list.md#gpu-accelerated-retired-sizes).

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
