---
title: Change the performance of Azure managed disks using the Azure portal
description: Learn how to change performance tiers for new and existing managed disks using the Azure portal.
author: roygara
ms.service: azure-disk-storage
ms.topic: how-to
ms.date: 08/01/2023
ms.author: rogarana
ms.custom: references_regions
---

# Change your performance tier using the Azure portal

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

[!INCLUDE [virtual-machines-disks-performance-tiers-intro](../../includes/virtual-machines-disks-performance-tiers-intro.md)]

## Restrictions

[!INCLUDE [virtual-machines-disks-performance-tiers-restrictions](../../includes/virtual-machines-disks-performance-tiers-restrictions.md)]

## Getting started

### New disks

The following steps show how to change the performance tier of your disk when you first create the disk:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to the VM you'd like to create a new disk for.
1. When selecting the new disk, first choose the size, of disk you need.
1. Once you've selected a size, then select a different performance tier, to change its performance.
1. Select **OK** to create the disk.

:::image type="content" source="media/disks-performance-tiers-portal/new-disk-change-performance-tier.png" alt-text="Screenshot of the disk creation blade, a disk is highlighted, and the performance tier dropdown is highlighted." lightbox="media/disks-performance-tiers-portal/performance-tier-settings.png":::


### Change the performance tier of an existing disk

A disk's performance tier can be changed without downtime, so you don't have to deallocate your VM or detach your disk to change the tier.

### Change performance tier

1. Navigate to the VM containing the disk you'd like to change.
1. Select your disk
1. Select **Size + Performance** under **Settings**.
1. In the **Performance tier** dropdown, select a tier other than the disk's current performance tier.
1. Select **Resize**.

:::image type="content" source="media/disks-performance-tiers-portal/change-tier-existing-disk.png" alt-text="Screenshot of the size + performance blade, performance tier is highlighted." lightbox="media/disks-performance-tiers-portal/performance-tier-settings.png":::

## Next steps

If you need to resize a disk to take advantage of the higher performance tiers, see these articles:

- [Expand virtual hard disks on a Linux VM with the Azure CLI](linux/expand-disks.md)
- [Expand a managed disk attached to a Windows virtual machine](windows/expand-os-disk.md)
