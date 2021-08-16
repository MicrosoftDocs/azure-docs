---
title: Change the performance of Azure managed disks using the Azure portal
description: Learn how to change performance tiers for new and existing managed disks using the Azure portal.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 06/29/2021
ms.author: rogarana
ms.subservice: disks
ms.custom: references_regions
---

# Change your performance tier using the Azure portal

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


## Existing disks

The following steps outline how to change the performance tier of an existing disk:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to the VM containing the disk you'd like to change.
1. Either deallocate the VM or detach the disk.
1. Select your disk
1. Select **Size + Performance**.
1. In the **Performance tier** dropdown, select a tier other than the disk's current performance tier.
1. Select **Resize**.

:::image type="content" source="media/disks-performance-tiers-portal/change-tier-existing-disk.png" alt-text="Screenshot of the size + performance blade, performance tier is highlighted." lightbox="media/disks-performance-tiers-portal/performance-tier-settings.png":::

### Change the performance tier of a disk without downtime (preview)

You can also change your performance tier without downtime, so you don't have to deallocate your VM or detach your disk to change the tier.

### Prerequisites

Your disk must meet the requirements laid out in the [Change performance tier without downtime (preview)](#change-performance-tier-without-downtime-preview) section, if it does not, then changing the performance tier will incur downtime.

You must enable the feature for your subscription before you can change the performance tier of a disk without downtime. Please follow the steps below to enable the feature for your subscription:

1.	Execute the following command to register the feature for your subscription

    ```azurecli
    az feature register --namespace Microsoft.Compute --name LiveTierChange
    ```
 
1.	Confirm that the registration state is **Registered** (may take a few minutes) using the following command before trying out the feature.

    ```azurecli
    az feature show --namespace Microsoft.Compute --name LiveTierChange
    ```

### Change performance tier

Now that the feature has been registered, you can change applicable disk's performance tiers without downtime.

1. Sign in to the Azure portal from the following link: [https://aka.ms/diskPerfTiersPreview](https://aka.ms/diskPerfTiersPreview).
1. Navigate to the VM containing the disk you'd like to change.
1. Either deallocate the VM or detach the disk.
1. Select your disk
1. Select **Size + Performance**.
1. In the **Performance tier** dropdown, select a tier other than the disk's current performance tier.
1. Select **Resize**.

:::image type="content" source="media/disks-performance-tiers-portal/change-tier-existing-disk.png" alt-text="Screenshot of the size + performance blade, performance tier is highlighted." lightbox="media/disks-performance-tiers-portal/performance-tier-settings.png":::

## Next steps

If you need to resize a disk to take advantage of the higher performance tiers, see these articles:

- [Expand virtual hard disks on a Linux VM with the Azure CLI](linux/expand-disks.md)
- [Expand a managed disk attached to a Windows virtual machine](windows/expand-os-disk.md)
