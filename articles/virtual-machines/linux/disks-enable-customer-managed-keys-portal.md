---
title: Azure portal - Enable customer-managed keys with SSE - managed disks
description: Enable customer-managed keys on your managed disks through the Azure portal.
author: roygara

ms.date: 07/10/2020
ms.topic: how-to
ms.author: rogarana
ms.service: virtual-machines
ms.subservice: disks
---

# Enable customer-managed keys with server-side encryption - managed disks - portal

Azure Disk Storage allows you to manage your own keys when using server-side encryption (SSE) for managed disks, if you choose. For conceptual information on SSE with customer managed keys, as well as other managed disk encryption types, see the [Customer-managed keys](disk-encryption.md#customer-managed-keys) section of our disk encryption article.

## Restrictions

For now, customer-managed keys have the following restrictions:

- If this feature is enabled for your disk, you cannot disable it.
    If you need to work around this, you must [copy all the data](disks-upload-vhd-to-managed-disk-cli.md#copy-a-managed-disk) to an entirely different managed disk that isn't using customer-managed keys.
[!INCLUDE [virtual-machines-managed-disks-customer-managed-keys-restrictions](../../../includes/virtual-machines-managed-disks-customer-managed-keys-restrictions.md)]

[!INCLUDE [virtual-machines-disks-encryption-portal](../../../includes/virtual-machines-disks-encryption-portal.md)]

> [!IMPORTANT]
> Customer-managed keys rely on managed identities for Azure resources, a feature of Azure Active Directory (Azure AD). When you configure customer-managed keys, a managed identity is automatically assigned to your resources under the covers. If you subsequently move the subscription, resource group, or managed disk from one Azure AD directory to another, the managed identity associated with the managed disks is not transferred to the new tenant, so customer-managed keys may no longer work. For more information, see [Transferring a subscription between Azure AD directories](../../active-directory/managed-identities-azure-resources/known-issues.md#transferring-a-subscription-between-azure-ad-directories).

## Next steps

- [Explore the Azure Resource Manager templates for creating encrypted disks with customer-managed keys](https://github.com/ramankumarlive/manageddiskscmkpreview))
- [Replicate machines with customer-managed keys enabled disks](../../site-recovery/azure-to-azure-how-to-enable-replication-cmk-disks.md)
- [Set up disaster recovery of VMware VMs to Azure with PowerShell](../../site-recovery/vmware-azure-disaster-recovery-powershell.md#replicate-vmware-vms)
- [Set up disaster recovery to Azure for Hyper-V VMs using PowerShell and Azure Resource Manager](../../site-recovery/hyper-v-azure-powershell-resource-manager.md#step-7-enable-vm-protection)
