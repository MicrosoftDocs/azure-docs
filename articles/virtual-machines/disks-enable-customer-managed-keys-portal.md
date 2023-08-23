---
title: Azure portal - Enable customer-managed keys with SSE - managed disks
description: Enable customer-managed keys on your managed disks through the Azure portal.
author: roygara

ms.date: 02/22/2023
ms.topic: how-to
ms.author: rogarana
ms.service: azure-disk-storage
---

# Use the Azure portal to enable server-side encryption with customer-managed keys for managed disks

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: 

Azure Disk Storage allows you to manage your own keys when using server-side encryption (SSE) for managed disks, if you choose. For conceptual information on SSE with customer managed keys, and other managed disk encryption types, see the **Customer-managed keys** section of our disk encryption article: [Customer-managed keys](disk-encryption.md#customer-managed-keys)

## Restrictions

For now, customer-managed keys have the following restrictions:

[!INCLUDE [virtual-machines-managed-disks-customer-managed-keys-restrictions](../../includes/virtual-machines-managed-disks-customer-managed-keys-restrictions.md)]

The following sections cover how to enable and use customer-managed keys for managed disks:

[!INCLUDE [virtual-machines-disks-encryption-create-key-vault-portal](../../includes/virtual-machines-disks-encryption-create-key-vault-portal.md)]

## Deploy a VM

Now that you've created and set up your key vault and the disk encryption set, you can deploy a VM using the encryption.
The VM deployment process is similar to the standard deployment process, the only differences are that you need to deploy the VM in the same region as your other resources and you opt to use a customer managed key.

1. Search for **Virtual Machines** and select **+ Create** to create a VM.
1. On the **Basic** pane, select the same region as your disk encryption set and Azure Key Vault.
1. Fill in the other values on the **Basic** pane as you like.

    :::image type="content" source="media/virtual-machines-disk-encryption-portal/server-side-encryption-create-a-vm-region.png" alt-text="Screenshot of the VM creation experience, with the region value highlighted." lightbox="media/virtual-machines-disk-encryption-portal/server-side-encryption-create-a-vm-region.png":::

1. On the **Disks** pane, for **Key management** select your disk encryption set, key vault, and key in the drop-down.
1. Make the remaining selections as you like.

    :::image type="content" source="media/virtual-machines-disk-encryption-portal/server-side-encryption-create-vm-customer-managed-key-disk-encryption-set.png" alt-text="Screenshot of the VM creation experience, the disks pane, customer-managed key selected." lightbox="media/virtual-machines-disk-encryption-portal/server-side-encryption-create-vm-customer-managed-key-disk-encryption-set.png":::

## Enable on an existing disk

> [!CAUTION]
> Enabling disk encryption on any disks attached to a VM requires you to stop the VM.
    
1. Navigate to a VM that is in the same region as one of your disk encryption sets.
1. Open the VM and select **Stop**.

    :::image type="content" source="media/virtual-machines-disk-encryption-portal/server-side-encryption-stop-vm-to-encrypt-disk-fix.png" alt-text="Screenshot of the main overlay for your example VM, with the Stop button highlighted." lightbox="media/virtual-machines-disk-encryption-portal/server-side-encryption-stop-vm-to-encrypt-disk-fix.png":::

1. After the VM has finished stopping, select **Disks**, and then select the disk you want to encrypt.

    :::image type="content" source="media/virtual-machines-disk-encryption-portal/server-side-encryption-existing-disk-select.png" alt-text="Screenshot of your example VM, with the Disks pane open, the OS disk is highlighted, as an example disk for you to select." lightbox="media/virtual-machines-disk-encryption-portal/server-side-encryption-existing-disk-select.png":::

1. Select **Encryption** and under **Key management** select your key vault and key in the drop-down list, under **Customer-managed key**.
1. Select **Save**.

    :::image type="content" source="media/virtual-machines-disk-encryption-portal/server-side-encryption-encrypt-existing-disk-customer-managed-key.png" alt-text="Screenshot of your example OS disk, the encryption pane is open, encryption at rest with a customer-managed key is selected, as well as your example Azure Key Vault." lightbox="media/virtual-machines-disk-encryption-portal/server-side-encryption-encrypt-existing-disk-customer-managed-key.png":::

1. Repeat this process for any other disks attached to the VM you'd like to encrypt.
1. When your disks finish switching over to customer-managed keys, if there are no other attached disks you'd like to encrypt, start your VM.

> [!IMPORTANT]
> Customer-managed keys rely on managed identities for Azure resources, a feature of Azure Active Directory (Azure AD). When you configure customer-managed keys, a managed identity is automatically assigned to your resources under the covers. If you subsequently move the subscription, resource group, or managed disk from one Azure AD directory to another, the managed identity associated with the managed disks is not transferred to the new tenant, so customer-managed keys may no longer work. For more information, see [Transferring a subscription between Azure AD directories](../active-directory/managed-identities-azure-resources/known-issues.md#transferring-a-subscription-between-azure-ad-directories).

### Enable automatic key rotation on an existing disk encryption set

1. Navigate to the disk encryption set that you want to enable [automatic key rotation](disk-encryption.md#automatic-key-rotation-of-customer-managed-keys) on.
1. Under **Settings**, select **Key**.
1. Select **Auto key rotation** and select **Save**.

## Next steps

- [Explore the Azure Resource Manager templates for creating encrypted disks with customer-managed keys](https://github.com/ramankumarlive/manageddiskscmkpreview)
- [What is Azure Key Vault?](../key-vault/general/overview.md)
- [Replicate machines with customer-managed keys enabled disks](../site-recovery/azure-to-azure-how-to-enable-replication-cmk-disks.md)
- [Set up disaster recovery of VMware VMs to Azure with PowerShell](../site-recovery/vmware-azure-disaster-recovery-powershell.md#replicate-vmware-vms)
- [Set up disaster recovery to Azure for Hyper-V VMs using PowerShell and Azure Resource Manager](../site-recovery/hyper-v-azure-powershell-resource-manager.md#step-7-enable-vm-protection)
- See [Create a managed disk from a snapshot with CLI](scripts/create-managed-disk-from-snapshot.md#disks-with-customer-managed-keys) for a code sample.
