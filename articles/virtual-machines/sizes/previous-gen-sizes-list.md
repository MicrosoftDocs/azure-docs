---
title: Previous generation Azure VM sizes 
description: A list containing all previous generation VM size series and their replacement series.
author: mattmcinnes
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 01/31/2024
ms.author: mattmcinnes
ms.reviewer: iamwilliew
---

# Previous generation Azure VM sizes 

This article provides a list of all sizes that are considered "previous-gen". For sizes that require it there are 'migration guides' to help move to replacement sizes.

To learn more about size series retirement, see the [size series retirement overview](./retirement_overview.md).

> [!NOTE]
> Previous generation sizes **are not currently retired** and can still be used. 
> 
> These sizes will eventually be retired, so it is still recommended to migrate to the latest generation replacements as soon as possible.

## General Purpose previous-gen sizes

|Series name        |Replacement series  |Migration guide |
|-------------------|--------------------|----------------|
| Basic A-series    | [Av2-series](../av2-series.md) | |
| Standard A-series | [Av2-series](../av2-series.md) | |
| Compute-intensive A-series | [HB-series](../hb-series.md) | |
| D-series          | [Dav4-series](../dav4-dasv4-series.md) | |
| DC-series         | [DCsv2-series](../dcv2-series.md) | |
| DS-series         | [Dasv4-series](../dav4-dasv4-series.md) | |

For a list of retired general purpose sizes (sizes that are no longer available for use), see [retired general purpose sizes](./retired-sizes-list.md#general-purpose-retired-sizes).

## Compute optimized previous-gen sizes

|Series name        |Replacement series  |Migration guide |
|-------------------|--------------------|----------------|
| F-series       | [Fsv2-series](../fsv2-series.md) | |
| Fs-series      | [Fsv2-series](../fsv2-series.md) | |

For a list of retired compute optimized sizes (sizes that are no longer available for use), see [retired compute optimized sizes](./retired-sizes-list.md#compute-optimized-retired-sizes).

## Memory optimized previous-gen sizes

|Series name        |Replacement series  |Migration guide |
|-------------------|--------------------|----------------|
| GS-series        | [Easv4-series](../eav4-easv4-series.md) | |
| G-series         | [Easv4-series](../eav4-easv4-series.md) | |

For a list of retired memory optimized sizes (sizes that are no longer available for use), see [retired memory optimized sizes](./retired-sizes-list.md#memory-optimized-retired-sizes).

## Storage optimized previous-gen sizes

|Series name        |Replacement series  |Migration guide |
|-------------------|--------------------|----------------|
| Ls-series        | [Dasv4-series](../lsv2-series.md) | |

For a list of retired storage optimized sizes (sizes that are no longer available for use), see [retired storage optimized sizes](./retired-sizes-list.md#storage-optimized-retired-sizes).

## GPU accelerated previous-gen sizes

Currently there are no previous-gen GPU accelerated sizes.

For a list of retired gpu accelerated sizes (sizes that are no longer available for use), see [retired gpu accelerated sizes](./retired-sizes-list.md#gpu-accelerated-retired-sizes).

## FPGA accelerated previous-gen sizes

Currently there are no previous-gen FPGA accelerated sizes.

For a list of retired FPGA accelerated sizes (sizes that are no longer available for use), see [retired fpga accelerated sizes](./retired-sizes-list.md#fpga-accelerated-retired-sizes).

## HPC previous-gen sizes

Currently there are no previous-gen HPC sizes.

For a list of retired HPC sizes (sizes that are no longer available for use), see [retired HPC sizes](./retired-sizes-list.md#hpc-retired-sizes).

## ADH previous-gen sizes

Currently there are no previous-gen ADH sizes.

For a list of retired ADH sizes (sizes that are no longer available for use), see [retired ADH sizes](./retired-sizes-list.md#adh-retired-sizes).

## Next steps
- For a list of retired sizes, see [Retired Azure VM sizes](./retired-sizes-list.md).
- For more information on VM sizes, see [Sizes for virtual machines in Azure](../sizes.md).
