---
title: Enable double encryption at rest - Azure portal - managed disks
description: Enable double encryption at rest for your managed disk data using the Azure portal.
author: roygara

ms.date: 02/06/2023
ms.topic: how-to
ms.author: rogarana
ms.service: azure-disk-storage
ms.custom: references_regions
---

# Use the Azure portal to enable double encryption at rest for managed disks

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark:

Azure Disk Storage supports double encryption at rest for managed disks. For conceptual information on double encryption at rest, and other managed disk encryption types, see the [Double encryption at rest](disk-encryption.md#double-encryption-at-rest) section of our disk encryption article.

## Restrictions

Double encryption at rest isn't currently supported with either Ultra Disks or Premium SSD v2 disks.

## Getting started

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Disk Encryption Sets**.

    :::image type="content" source="media/virtual-machines-disks-double-encryption-at-rest-portal/double-encryption-disk-encryption-sets-search.png" alt-text="Screenshot of the main Azure portal, disk encryption sets is highlighted in the search bar." lightbox="media/virtual-machines-disks-double-encryption-at-rest-portal/double-encryption-disk-encryption-sets-search.png":::

1. Select **+ Create**.
1. Select one of the supported regions.
1. For **Encryption type**, select **Double encryption with platform-managed and customer-managed keys**.

    > [!NOTE]
    > Once you create a disk encryption set with a particular encryption type, it cannot be changed. If you want to use a different encryption type, you must create a new disk encryption set.

1. Fill in the remaining info.

    :::image type="content" source="media/virtual-machines-disks-double-encryption-at-rest-portal/double-encryption-create-disk-encryption-set-blade.png" alt-text="Screenshot of the disk encryption set creation blade, regions and double encryption with platform-managed and customer-managed keys are highlighted." lightbox="media/virtual-machines-disks-double-encryption-at-rest-portal/double-encryption-create-disk-encryption-set-blade.png":::

1. Select an Azure Key Vault and key, or create a new one if necessary.

    > [!NOTE]
    > If you create a Key Vault instance, you must enable soft delete and purge protection. These settings are mandatory when using a Key Vault for encrypting managed disks, and protect you from losing data due to accidental deletion.

    :::image type="content" source="media/virtual-machines-disks-double-encryption-at-rest-portal/double-encryption-select-key-vault.png" alt-text="Screenshot of the Key Vault creation blade." lightbox="media/virtual-machines-disks-double-encryption-at-rest-portal/double-encryption-select-key-vault.png":::

1. Select **Create**.
1. Navigate to the disk encryption set you created, and select the error that is displayed. This will configure your disk encryption set to work.

    :::image type="content" source="media/virtual-machines-disks-double-encryption-at-rest-portal/double-encryption-disk-set-error.png" alt-text="Screenshot of the disk encryption set displayed error, the error text is: To associate a disk, image, or snapshot with this disk encryption set, you must grant permissions to the key vault." lightbox="media/virtual-machines-disks-double-encryption-at-rest-portal/double-encryption-disk-set-error.png":::

    A notification should pop up and succeed. Doing this will allow you to use the disk encryption set with your key vault.
    
    :::image type="content" source="media/virtual-machines-disks-double-encryption-at-rest-portal/disk-encryption-notification-success.png" alt-text="Screenshot of successful permission and role assignment for your key vault." lightbox="media/virtual-machines-disks-double-encryption-at-rest-portal/disk-encryption-notification-success.png":::

1. Navigate to your disk.
1. Select **Encryption**.
1. For **Key management**, select one of the keys under **Platform-managed and customer-managed keys**.
1. select **Save**.

    :::image type="content" source="media/virtual-machines-disks-double-encryption-at-rest-portal/double-encryption-enable-disk-blade.png" alt-text="Screenshot of the encryption blade for your managed disk, the aforementioned encryption type is highlighted." lightbox="media/virtual-machines-disks-double-encryption-at-rest-portal/double-encryption-enable-disk-blade.png":::

You have now enabled double encryption at rest on your managed disk.

## Next steps

- [Azure PowerShell - Enable customer-managed keys with server-side encryption - managed disks](./windows/disks-enable-customer-managed-keys-powershell.md)
- [Azure Resource Manager template samples](https://github.com/Azure-Samples/managed-disks-powershell-getting-started/tree/master/DoubleEncryption)
- [Enable customer-managed keys with server-side encryption - Examples](./linux/disks-enable-customer-managed-keys-cli.md#examples)