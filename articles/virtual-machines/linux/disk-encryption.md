---
title: Server-side encryption of Azure Managed Disks - Azure CLI
description: Azure Storage protects your data by encrypting it at rest before persisting it to Storage clusters. You can rely on Microsoft-managed keys for the encryption of your managed disks, or you can use customer-managed keys to manage encryption with your own keys.
author: roygara

ms.date: 07/07/2020
ms.topic: conceptual
ms.author: rogarana
ms.service: virtual-machines-linux
ms.subservice: disks
ms.custom: references_regions
---

# Server-side encryption of Azure Disk Storage 

Azure managed disks automatically encrypt your data by default when persisting it to the cloud. Server-side encryption (SSE) protects your data and helps you meet your organizational security and compliance commitments. 

Data in Azure managed disks is encrypted transparently using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available, and is FIPS 140-2 compliant. For more information about the cryptographic modules underlying Azure managed disks, see [Cryptography API: Next Generation](https://docs.microsoft.com/windows/desktop/seccng/cng-portal)

Server-side encryption does not impact the performance of managed disks and there is no additional cost. 

> [!NOTE]
> Temporary disks are not managed disks and are not encrypted by SSE unless you enable end-to-end encryption; for more information on temporary disks, see [Managed disks overview: disk roles](managed-disks-overview.md#disk-roles).

## End-to-end encryption

When you enable end-to-end encryption, you get: additional encryption on data-in-transit, encryption on the disk cache of all attached disks, and encryption of the temporary disk. This encryption can be managed either by the platform or through customer-managed keys.

### Double encryption at rest

With server-side encryption, you have the option to enable double encryption at rest for disks, snapshots, and images. If necessary for auditing or compliance needs, you can query the `Encryption.Type` property of your managed disk to find the current encryption status. You are not billed for double encryption at rest with every disk transaction.

Customers sets a new property Type for an instance of DiskEncryptionSet with value EncryptionAtRestWithPlatformAndCustomerKeys and then associate the DiskEncryptionSet with disks, snapshots and images for encrypting them at rest with double encryption.

### Double encryption in transit

Customers can enable the second layer of encryption for data-in-transit for OS and Data Disks by setting a new VM property EncryptionAtHost to True. The data-in-transit is encrypted with either CMK or PMK depending on the encryption type set on OS and Data Disks. For example, if a disk is encrypted with EncryptionAtRestWithCustomerKey then data-in-transit for the disk is encrypted with the Customer Key and if a disk is encrypted with EncryptionAtRestWithPlatformKey then data-in-transit for the disk is encrypted with the Platform Key. 

## About encryption key management

You can rely on platform-managed keys for the encryption of your managed disk, or you can manage encryption using your own keys. If you choose to manage encryption with your own keys, you can specify a *customer-managed key* to use for encrypting and decrypting all data in managed disks. 

The following sections describe each of the options for key management in greater detail.

### Platform-managed keys

By default, managed disks use platform-managed encryption keys. As of June 10, 2017, all new managed disks, snapshots, images, and new data written to existing managed disks are automatically encrypted-at-rest with platform-managed keys.

### Customer-managed keys

[!INCLUDE [virtual-machines-managed-disks-description-customer-managed-keys](../../../includes/virtual-machines-managed-disks-description-customer-managed-keys.md)]

#### Supported regions

[!INCLUDE [virtual-machines-disks-encryption-regions](../../../includes/virtual-machines-disks-encryption-regions.md)]

#### Restrictions

For now, customer-managed keys have the following restrictions:

- If this feature is enabled for your disk, you cannot disable it.
    If you need to work around this, you must [copy all the data](disks-upload-vhd-to-managed-disk-cli.md#copy-a-managed-disk) to an entirely different managed disk that isn't using customer-managed keys.
[!INCLUDE [virtual-machines-managed-disks-customer-managed-keys-restrictions](../../../includes/virtual-machines-managed-disks-customer-managed-keys-restrictions.md)]

> [!IMPORTANT]
> Customer-managed keys rely on managed identities for Azure resources, a feature of Azure Active Directory (Azure AD). When you configure customer-managed keys, a managed identity is automatically assigned to your resources under the covers. If you subsequently move the subscription, resource group, or managed disk from one Azure AD directory to another, the managed identity associated with managed disks isn't transferred to the new tenant, so customer-managed keys may no longer work. For more information, see [Transferring a subscription between Azure AD directories](../../active-directory/managed-identities-azure-resources/known-issues.md#transferring-a-subscription-between-azure-ad-directories).

## Server-side encryption versus Azure disk encryption

[Azure Disk Encryption for virtual machines and virtual machine scale sets](../../security/fundamentals/azure-disk-encryption-vms-vmss.md) leverages the [DM-Crypt](https://en.wikipedia.org/wiki/Dm-crypt) feature of Linux to encrypt managed disks with customer-managed keys within the guest VM.  Server-side encryption with customer-managed keys improves on ADE by enabling you to use any OS types and images for your VMs by encrypting data in the Storage service.

## Next steps

- [Enable end to end encryption](disks-enable-end-to-end-encryption.md)
- [Enable customer-managed keys for managed disks - CLI](disks-enable-customer-managed-keys-cli.md)
- [Enable customer-managed keys for managed disks - portal](disks-enable-customer-managed-keys-portal.md)
- [Enable customer-managed keys for your managed disk - PowerShell](../windows/disks-enable-customer-managed-keys-powershell.md)
- [What is Azure Key Vault?](../../key-vault/general/overview.md)
