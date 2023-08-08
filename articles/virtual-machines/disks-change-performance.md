---
title: Performance tiers for Azure managed disks
description: Learn about performance tiers for managed disks.
author: roygara
ms.service: azure-disk-storage
ms.topic: how-to
ms.date: 05/23/2023
ms.author: rogarana
ms.custom: references_regions
---

# Performance tiers for managed disks

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The performance of your Azure managed disk is set when you create your disk, in the form of its performance tier. When you set the provisioned size of your disk, a performance tier is automatically selected. The performance tier determines the IOPS and throughput your managed disk has. The performance tier can be changed at deployment or afterwards, without changing the size of the disk and without downtime.

Changing the performance tier allows you to prepare for and meet higher demand without using your disk's bursting capability. It can be more cost-effective to change your performance tier rather than rely on bursting, depending on how long the additional performance is necessary. This is ideal for events that temporarily require a consistently higher level of performance, like holiday shopping, performance testing, or running a training environment. To handle these events, you can switch a disk to a higher performance tier without downtime, for as long as you need the additional performance. You can then return to the original tier without downtime when the additional performance is no longer necessary.

To learn more about how the performance of a disk works with the performance of a virtual machine, see [Virtual machine and disk performance](disks-performance.md).

## Restrictions

[!INCLUDE [virtual-machines-disks-performance-tiers-restrictions](../../includes/virtual-machines-disks-performance-tiers-restrictions.md)]

## How it works

When you first deploy or provision a disk, the baseline performance tier for that disk is set based on the provisioned disk size. You can use a performance tier higher than the original baseline to meet higher demand. When you no longer need that performance level, you can return to the initial baseline performance tier.

### Billing impact

Your billing changes as your performance tier changes. For example, if you provision a P10 disk (128 GiB), your baseline performance tier is set as P10 (500 IOPS and 100 MBps). You'll be billed at the P10 rate. You can upgrade the tier to match the performance of P50 (7,500 IOPS and 250 MBps) without increasing the disk size. During the time of the upgrade, you'll be billed at the P50 rate. When you no longer need the higher performance, you can return to the P10 tier. The disk will once again be billed at the P10 rate.

For billing information, see [Managed disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/).

## What tiers can be changed

The following table depicts which tiers each baseline performance tier can upgrade to.

| Disk size | Baseline performance tier | Can be upgraded to |
|----------------|-----|-------------------------------------|
| 4 GiB | P1 | P2, P3, P4, P6, P10, P15, P20, P30, P40, P50 |
| 8 GiB | P2 | P3, P4, P6, P10, P15, P20, P30, P40, P50 |
| 16 GiB | P3 | P4, P6, P10, P15, P20, P30, P40, P50 | 
| 32 GiB | P4 | P6, P10, P15, P20, P30, P40, P50 |
| 64 GiB | P6 | P10, P15, P20, P30, P40, P50 |
| 128 GiB | P10 | P15, P20, P30, P40, P50 |
| 256 GiB | P15 | P20, P30, P40, P50 |
| 512 GiB | P20 | P30, P40, P50 |
| 1 TiB | P30 | P40, P50 |
| 2 TiB | P40 | P50 |
| 4 TiB | P50 | None |
| 8 TiB | P60 |  P70, P80 |
| 16 TiB | P70 | P80 |
| 32 TiB | P80 | None |

## Next steps

To learn how to change your performance tier, see [portal](disks-performance-tiers-portal.md) or [PowerShell/CLI](disks-performance-tiers.md) articles.

