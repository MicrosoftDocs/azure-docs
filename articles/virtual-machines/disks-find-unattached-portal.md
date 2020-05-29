---
title: Identify unattached Azure disks - Azure Portal
description: How to find unattached Azure managed and unmanaged (VHDs/page blobs) disks by using the Azure portal.
author: roygara
ms.service: virtual-machines
ms.topic: how-to
ms.date: 05/29/2020
ms.author: rogarana
ms.subservice: disks
---

# Find and delete unattached Azure managed and unmanaged disks

When you delete a virtual machine (VM) in Azure, by default, any disks that are attached to the VM aren't deleted. This helps to prevent data loss due to the unintentional deletion of VMs. After a VM is deleted, you will continue to pay for unattached disks. This article shows you how to find and delete any unattached disks using the Azure portal, and reduce unnecessary costs.

## Managed disks: Find and delete unattached disks

Finding unattached disks in the Azure portal is easy.

1. Sign in to the Azure portal
1. Search for and select **Disks**.

    On this blade you are presented with a list of all your disks. Any disk which has **-** in the **Owner** column is an unattached disk.



    :::image type="content" source="media/disks-find-unattached-portal/Managed-disk-unattached.png" alt-text="Texthere" lightbox="media/disks-find-unattached-portal/managed-disk-owner-unattached.png":::

1. Select the unattached disk you'd like to delete, this opens the disk's blade.
1. On the disk's blade, you can confirm the disk state is unattached, then select **Delete**.

    :::image type="content" source="media/disks-find-unattached-portal/delete-managed-disk-unattached.png" alt-text="Confirmed":::

## Unmanaged disks: Find and delete unattached disks

Unmanaged disks are VHD files that are stored as [page blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs#about-page-blobs) in [Azure storage accounts](../storage/common/storage-account-overview.md).

If you have unmanaged disks that aren't attached and would like to delete them, the following process explains how:

1. Sign in to the Azure portal.
1. Search for and select **Disks(Classic)**.

    You are presented with a list of all your unmanaged disks. Any disk which has **-** in the **Attached to** column is an unattached disk.

    :::image type="content" source="media/disks-find-unattached-portal/Unmanaged-disks-unattached.png" alt-text="texthere":::

1. Select the unattached disk you'd like to delete, this brings up the disk's blade.

1. On the disk's blade, you can confirm it is unattached, since **Attached to** will still be **-**.

    :::image type="content" source="media/disks-find-unattached-portal/unmanaged-disk-unattached-select-blade.png" alt-text="texthere":::

1. Select delete.

    :::image type="content" source="media/disks-find-unattached-portal/delete-unmanaged-disk-unattached.png" alt-text="sdafsdf":::

## Next steps

For more information, see [Delete a storage account](../storage/common/storage-account-create.md#delete-a-storage-account) and [Identify Orphaned Disks Using PowerShell](https://blogs.technet.microsoft.com/ukplatforms/2018/02/21/azure-cost-optimisation-series-identify-orphaned-disks-using-powershell/)