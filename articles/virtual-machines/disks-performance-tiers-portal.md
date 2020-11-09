---
title: Change the performance of Azure managed disks
description: Learn about performance tiers for managed disks, and learn how to change performance tiers for existing managed disks.
author: roygara
ms.service: virtual-machines
ms.topic: how-to
ms.date: 10/21/2020
ms.author: rogarana
ms.subservice: disks
ms.custom: references_regions
---

# Performance tiers for managed disks (preview)

[!INCLUDE [virtual-machines-disks-performance-tiers-intro](../../includes/virtual-machines-disks-performance-tiers-intro.md)]

## Restrictions

[!INCLUDE [virtual-machines-disks-performance-tiers-restrictions](../../includes/virtual-machines-disks-performance-tiers-restrictions.md)]

## Getting started

The following steps outline how to change the performance tier of your disk with the Azure portal:

1. Sign in to the Azure portal.
1. Navigate to the VM containing the disk you'd like to change.
1. Either deallocate the VM or detach the disk.
1. Select your disk
1. Select **Size + Performance**.
1. Select a tier that is different than the disk's current baseline.
1. Select **Save**.

## Next steps

If you need to resize a disk to take advantage of the higher performance tiers, see these articles:

- [Expand virtual hard disks on a Linux VM with the Azure CLI](linux/expand-disks.md)
- [Expand a managed disk attached to a Windows virtual machine](windows/expand-os-disk.md)
