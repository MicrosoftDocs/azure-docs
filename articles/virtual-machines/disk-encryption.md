---
title: Server-side encryption of Azure managed disks
description: Azure Storage protects your data by encrypting it at rest before persisting it to Storage clusters. You can use customer-managed keys to manage encryption with your own keys, or you can rely on Microsoft-managed keys for the encryption of your managed disks.
author: roygara
ms.date: 04/15/2021
ms.topic: conceptual
ms.author: rogarana
ms.service: virtual-machines
ms.subservice: disks
ms.custom: references_regions
---

# Server-side encryption of Azure Disk Storage

Most Azure managed disks are encrypted with Azure Storage encryption, which uses server-side encryption (SSE) to protect your data and to help you meet your organizational security and compliance commitments. Azure Storage encryption automatically encrypts your data stored on Azure managed disks (OS and data disks) at rest by default when persisting it to the cloud. Disks with encryption at host enabled, however, are not encrypted through Azure Storage. For disks with encryption at host enabled, the server hosting your VM provides the encryption for your data, and that encrypted data flows into Azure Storage.

Data in Azure managed disks is encrypted transparently using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available, and is FIPS 140-2 compliant. For more information about the cryptographic modules underlying Azure managed disks, see [Cryptography API: Next Generation](/windows/desktop/seccng/cng-portal)

Azure Storage encryption does not impact the performance of managed disks and there is no additional cost. For more information about Azure Storage encryption, see [Azure Storage encryption](/azure/storage/common/storage-service-encryption).

> [!NOTE]
> Temporary disks are not managed disks and are not encrypted by SSE, unless you enable encryption at host.

## About encryption key management

You can rely on platform-managed keys for the encryption of your managed disk, or you can manage encryption using your own keys. If you choose to manage encryption with your own keys, you can specify a *customer-managed key* to use for encrypting and decrypting all data in managed disks. 

The following sections describe each of the options for key management in greater detail.

### Platform-managed keys

By default, managed disks use platform-managed encryption keys. All managed disks, snapshots, images, and data written to existing managed disks are automatically encrypted-at-rest with platform-managed keys.

### Customer-managed keys

[!INCLUDE [virtual-machines-managed-disks-description-customer-managed-keys](../../includes/virtual-machines-managed-disks-description-customer-managed-keys.md)]

#### Restrictions

For now, customer-managed keys have the following restrictions:

- If this feature is enabled for your disk, you cannot disable it.
    If you need to work around this, you must copy all the data using either the [Azure PowerShell module](windows/disks-upload-vhd-to-managed-disk-powershell.md#copy-a-managed-disk) or the [Azure CLI](linux/disks-upload-vhd-to-managed-disk-cli.md#copy-a-managed-disk), to an entirely different managed disk that isn't using customer-managed keys.
[!INCLUDE [virtual-machines-managed-disks-customer-managed-keys-restrictions](../../includes/virtual-machines-managed-disks-customer-managed-keys-restrictions.md)]

#### Supported regions

Customer-managed keys are available in all regions that managed disks are available.

Automatic key rotation is in preview and only available in the following regions:

- East US
- East US 2
- South Central US
- West US
- West US 2
- North Europe
- West Europe
- France Central

> [!IMPORTANT]
> Customer-managed keys rely on managed identities for Azure resources, a feature of Azure Active Directory (Azure AD). When you configure customer-managed keys, a managed identity is automatically assigned to your resources under the covers. If you subsequently move the subscription, resource group, or managed disk from one Azure AD directory to another, the managed identity associated with managed disks isn't transferred to the new tenant, so customer-managed keys may no longer work. For more information, see [Transferring a subscription between Azure AD directories](../active-directory/managed-identities-azure-resources/known-issues.md#transferring-a-subscription-between-azure-ad-directories).

To enable customer-managed keys for managed disks, see our articles covering how to enable it with either the [Azure PowerShell module](windows/disks-enable-customer-managed-keys-powershell.md), the [Azure CLI](linux/disks-enable-customer-managed-keys-cli.md) or the [Azure portal](disks-enable-customer-managed-keys-portal.md). To learn how to enable customer-managed keys with automatic key rotation, see [Set up an Azure Key Vault and DiskEncryptionSet with automatic key rotation (preview)](windows/disks-enable-customer-managed-keys-powershell.md#set-up-an-azure-key-vault-and-diskencryptionset-with-automatic-key-rotation-preview).

## Encryption at host - End-to-end encryption for your VM data

When you enable encryption at host, that encryption starts on the VM host itself, the Azure server that your VM is allocated to. The data for your temporary disk and OS/data disk caches are stored on that VM host. After enabling encryption at host, all this data is encrypted at rest and flows encrypted to the Storage service, where it is persisted. Essentially, encryption at host encrypts your data from end-to-end. Encryption at host does not use your VM's CPU and doesn't impact your VM's performance. 

Temporary disks and ephemeral OS disks are encrypted at rest with platform-managed keys when you enable end-to-end encryption. The OS and data disk caches are encrypted at rest with either customer-managed or platform-managed keys, depending on the selected disk encryption type. For example, if a disk is encrypted with customer-managed keys, then the cache for the disk is encrypted with customer-managed keys, and if a disk is encrypted with platform-managed keys then the cache for the disk is encrypted with platform-managed keys.

### Restrictions

[!INCLUDE [virtual-machines-disks-encryption-at-host-restrictions](../../includes/virtual-machines-disks-encryption-at-host-restrictions.md)]

#### Supported VM sizes

[!INCLUDE [virtual-machines-disks-encryption-at-host-suported-sizes](../../includes/virtual-machines-disks-encryption-at-host-suported-sizes.md)]

You may also find the VM sizes programmatically. To learn how to retrieve them programmatically, refer to the finding supported VM sizes section of either the [Azure PowerShell module](windows/disks-enable-host-based-encryption-powershell.md#finding-supported-vm-sizes) or [Azure CLI](linux/disks-enable-host-based-encryption-cli.md#finding-supported-vm-sizes) articles.

To enable end-to-end encryption using encryption at host, see our articles covering how to enable it with either the [Azure PowerShell module](windows/disks-enable-host-based-encryption-powershell.md), the [Azure CLI](linux/disks-enable-host-based-encryption-cli.md), or the [Azure portal](disks-enable-host-based-encryption-portal.md).

## Double encryption at rest

High security sensitive customers who are concerned of the risk associated with any particular encryption algorithm, implementation, or key being compromised can now opt for additional layer of encryption using a different encryption algorithm/mode at the infrastructure layer using platform managed encryption keys. This new layer can be applied to persisted OS and data disks, snapshots, and images, all of which will be encrypted at rest with double encryption.

### Supported regions

Double encryption is available in all regions that managed disks are available.

To enable double encryption at rest for managed disks, see our articles covering how to enable it with either the [Azure PowerShell module](windows/disks-enable-double-encryption-at-rest-powershell.md), the [Azure CLI](linux/disks-enable-double-encryption-at-rest-cli.md) or the [Azure portal](disks-enable-double-encryption-at-rest-portal.md).

## Server-side encryption versus Azure disk encryption

[Azure Disk Encryption](../security/fundamentals/azure-disk-encryption-vms-vmss.md) leverages either the [DM-Crypt](https://en.wikipedia.org/wiki/Dm-crypt) feature of Linux or the [BitLocker](/windows/security/information-protection/bitlocker/bitlocker-overview) feature of Windows to encrypt managed disks with customer-managed keys within the guest VM.  Server-side encryption with customer-managed keys improves on ADE by enabling you to use any OS types and images for your VMs by encrypting data in the Storage service.
> [!IMPORTANT]
> Customer-managed keys rely on managed identities for Azure resources, a feature of Azure Active Directory (Azure AD). When you configure customer-managed keys, a managed identity is automatically assigned to your resources under the covers. If you subsequently move the subscription, resource group, or managed disk from one Azure AD directory to another, the managed identity associated with managed disks is not transferred to the new tenant, so customer-managed keys may no longer work. For more information, see [Transferring a subscription between Azure AD directories](../active-directory/managed-identities-azure-resources/known-issues.md#transferring-a-subscription-between-azure-ad-directories).

## Next steps

- Enable end-to-end encryption using encryption at host with either the [Azure PowerShell module](windows/disks-enable-host-based-encryption-powershell.md), the [Azure CLI](linux/disks-enable-host-based-encryption-cli.md), or the [Azure portal](disks-enable-host-based-encryption-portal.md).
- Enable double encryption at rest for managed disks with either the [Azure PowerShell module](windows/disks-enable-double-encryption-at-rest-powershell.md), the [Azure CLI](linux/disks-enable-double-encryption-at-rest-cli.md) or the [Azure portal](disks-enable-double-encryption-at-rest-portal.md).
- Enable customer-managed keys for managed disks with either the [Azure PowerShell module](windows/disks-enable-customer-managed-keys-powershell.md), the [Azure CLI](linux/disks-enable-customer-managed-keys-cli.md) or the [Azure portal](disks-enable-customer-managed-keys-portal.md).
- [Explore the Azure Resource Manager templates for creating encrypted disks with customer-managed keys](https://github.com/ramankumarlive/manageddiskscmkpreview)
- [What is Azure Key Vault?](../key-vault/general/overview.md)
