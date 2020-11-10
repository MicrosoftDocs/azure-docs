---
title: Change the performance of Azure managed disks
description: Learn about performance tiers for managed disks, and learn how to change performance tiers for existing managed disks.
author: roygara
ms.service: virtual-machines
ms.topic: how-to
ms.date: 11/09/2020
ms.author: rogarana
ms.subservice: disks
ms.custom: references_regions
---

# Performance tiers for managed disks (preview)

[!INCLUDE [virtual-machines-disks-performance-tiers-intro](../../includes/virtual-machines-disks-performance-tiers-intro.md)]

## Restrictions

[!INCLUDE [virtual-machines-disks-performance-tiers-restrictions](../../includes/virtual-machines-disks-performance-tiers-restrictions.md)]

## Getting started

### New disks

The following steps show how to change the performance tier of your disk when you first create the disk:

1. Sign in to the Azure portal.
1. Navigate to the VM you'd like to create a new disk for.
1. When selecting the new disk, first choose the size, of disk you need.
1. Once you've selected a size, then select a different performance tier, to change its performance.
1. Select **OK** to create the disk.

:::image type="content" source="media/disks-performance-tiers-portal/create-new-disk-change-tier.png" alt-text="Screenshot of the disk creation blade, a disk is highlighted, and the performance tier dropdown is highlighted." lightbox="media/disks-performance-tiers-portal/performance-tier-settings.png":::


## Existing disks

The following steps outline how to change the performance tier of your disk with the Azure portal:

1. Sign in to the Azure portal.
1. Navigate to the VM containing the disk you'd like to change.
1. Either deallocate the VM or detach the disk.
1. Select your disk
1. Select **Size + Performance**.
1. Select a tier that is different than the disk's current baseline.
1. Select **Resize**.

:::image type="content" source="media/disks-performance-tiers-portal/change-tier-existing-disk.png" alt-text="Screenshot of the size + performance blade, performance tier is highlighted." lightbox="media/disks-performance-tiers-portal/performance-tier-settings.png":::

## Next steps

If you need to resize a disk to take advantage of the higher performance tiers, see these articles:

- [Expand virtual hard disks on a Linux VM with the Azure CLI](linux/expand-disks.md)
- [Expand a managed disk attached to a Windows virtual machine](windows/expand-os-disk.md)
