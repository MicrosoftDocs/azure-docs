---
title: Enable end-to-end encryption using encryption at host - Azure portal - managed disks
description: Use encryption at host to enable end-to-end encryption on your Azure managed disks - Azure portal.
author: roygara
ms.service: virtual-machines
ms.topic: how-to
ms.date: 08/24/2020
ms.author: rogarana
ms.subservice: disks
ms.custom: references_regions
---

# Use the Azure portal to enable end-to-end encryption using encryption at host

When you enable encryption at host, data stored on the VM host is encrypted at rest and flows encrypted to the Storage service. For conceptual information on encryption at host, as well as other managed disk encryption types, see:

* Linux: [Encryption at host - End-to-end encryption for your VM data](./disk-encryption.md#encryption-at-host---end-to-end-encryption-for-your-vm-data).

* Windows: [Encryption at host - End-to-end encryption for your VM data](./disk-encryption.md#encryption-at-host---end-to-end-encryption-for-your-vm-data).

## Restrictions

[!INCLUDE [virtual-machines-disks-encryption-at-host-restrictions](../../includes/virtual-machines-disks-encryption-at-host-restrictions.md)]

### Supported regions

[!INCLUDE [virtual-machines-disks-encryption-at-host-regions](../../includes/virtual-machines-disks-encryption-at-host-regions.md)]

### Supported VM sizes

[!INCLUDE [virtual-machines-disks-encryption-at-host-suported-sizes](../../includes/virtual-machines-disks-encryption-at-host-suported-sizes.md)]

## Prerequisites

In order to be able to use encryption at host for your VMs or virtual machine scale sets, you must get the feature enabled on your subscription. Send an email to encryptionAtHost@microsoft.com with your subscription Ids to get the feature enabled for your subscriptions.

Sign in to the Azure portal using the [provided link](https://aka.ms/diskencryptionupdates).

> [!IMPORTANT]
> You must use the [provided link](https://aka.ms/diskencryptionupdates) to access the Azure portal. Encryption at host is not currently visible in the public Azure portal without using the link.

### Create an Azure Key Vault and disk encryption set

Once the feature is enabled, you'll need to set up an Azure Key Vault and a disk encryption set, if you haven't already.

[!INCLUDE [virtual-machines-disks-encryption-create-key-vault-portal](../../includes/virtual-machines-disks-encryption-create-key-vault-portal.md)]

## Deploy a VM

You must deploy a new VM to enable encryption at host, it cannot be enabled on existing VMs.

1. Search for **Virtual Machines** and select **+ Add** to create a VM.
1. Create a new virtual machine, select an appropriate region and a supported VM size.
1. Fill in the other values on the **Basic** blade as you like, then proceed to the **Disks** blade.

    :::image type="content" source="media/virtual-machines-disks-encryption-at-host-portal/disks-encryption-at-host-basic-blade.png" alt-text="Screenshot of the virtual machine creation basics blade, region and V M size are highlighted.":::

1. On the **Disks** blade, select **Yes** for **Encryption at host**.
1. Make the remaining selections as you like.

    :::image type="content" source="media/virtual-machines-disks-encryption-at-host-portal/disks-encryption-at-host-disk-blade.png" alt-text="Screenshot of the virtual machine creation disks blade, encryption at host is highlighted.":::

1. Finish the VM deployment process, make selections that fit your environment.

You have now deployed a VM with encryption at host enabled, all its associated disks will be encrypted using encryption at host.

## Next steps

[Azure Resource Manager template samples](https://github.com/Azure-Samples/managed-disks-powershell-getting-started/tree/master/EncryptionAtHost)
