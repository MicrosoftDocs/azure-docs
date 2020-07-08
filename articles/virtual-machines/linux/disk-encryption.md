---
title: Server-side encryption of Azure Managed Disks - Azure CLI
description: Azure Storage protects your data by encrypting it at rest before persisting it to Storage clusters. You can rely on Microsoft-managed keys for the encryption of your managed disks, or you can use customer-managed keys to manage encryption with your own keys.
author: roygara

ms.date: 06/30/2020
ms.topic: conceptual
ms.author: rogarana
ms.service: virtual-machines-linux
ms.subservice: disks
ms.custom: references_regions
---

# Server-side encryption of Azure Disk Storage

Server-side encryption (SSE) protects your data and helps you meet your organizational security and compliance commitments. SSE automatically encrypts your data stored on Azure managed disks (OS and data disks) at rest by default when persisting it to the cloud. 

Data in Azure managed disks is encrypted transparently using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available, and is FIPS 140-2 compliant. For more information about the cryptographic modules underlying Azure managed disks, see [Cryptography API: Next Generation](https://docs.microsoft.com/windows/desktop/seccng/cng-portal)

Server-side encryption does not impact the performance of managed disks and there is no additional cost. 

## About encryption key management

You can rely on platform-managed keys for the encryption of your managed disk, or you can manage encryption using your own keys. If you choose to manage encryption with your own keys, you can specify a *customer-managed key* to use for encrypting and decrypting all data in managed disks. 

The following sections describe each of the options for key management in greater detail.

### Platform-managed keys

By default, managed disks use platform-managed encryption keys. As of June 10, 2017, all new managed disks, snapshots, images, and new data written to existing managed disks are automatically encrypted-at-rest with platform-managed keys.

### Customer-managed keys

[!INCLUDE [virtual-machines-managed-disks-description-customer-managed-keys](../../../includes/virtual-machines-managed-disks-description-customer-managed-keys.md)]

#### Restrictions

For now, customer-managed keys have the following restrictions:

- If this feature is enabled for your disk, you cannot disable it.
    If you need to work around this, you must [copy all the data](disks-upload-vhd-to-managed-disk-cli.md#copy-a-managed-disk) to an entirely different managed disk that isn't using customer-managed keys.
[!INCLUDE [virtual-machines-managed-disks-customer-managed-keys-restrictions](../../../includes/virtual-machines-managed-disks-customer-managed-keys-restrictions.md)]

> [!IMPORTANT]
> Customer-managed keys rely on managed identities for Azure resources, a feature of Azure Active Directory (Azure AD). When you configure customer-managed keys, a managed identity is automatically assigned to your resources under the covers. If you subsequently move the subscription, resource group, or managed disk from one Azure AD directory to another, the managed identity associated with managed disks isn't transferred to the new tenant, so customer-managed keys may no longer work. For more information, see [Transferring a subscription between Azure AD directories](../../active-directory/managed-identities-azure-resources/known-issues.md#transferring-a-subscription-between-azure-ad-directories).

## Encryption at VM host (preview)

When you enable encryption at host, data stored on the VM host is encrypted at rest and flows encrypted to the Storage service. The temp disks are encrypted at rest with platform-managed keys. The cache of OS and data disks is encrypted at rest with either platform-managed keys or customer-managed keys depending on the encryption type set on disk data flows encrypted to Storage service. For example, if a disk is encrypted with customer-managed keys the cache for the disk is encrypted with customer-managed keys and if a disk is encrypted with platform-managed keys then the cache for the disk is encrypted with platform-managed keys.

### Limitations

[!INCLUDE [virtual-machines-disks-encryption-at-host-restrictions](../../../includes/virtual-machines-disks-encryption-at-host-restrictions.md)]

#### Supported VM sizes

[!INCLUDE [virtual-machines-disks-encryption-at-host-suported-sizes](../../../includes/virtual-machines-disks-encryption-at-host-suported-sizes.md)]

## Double encryption at rest

High security sensitive customers who are concerned of the risk associated with any particular encryption algorithm, implementation , or key being compromised can now opt for additional layer of encryption using a different encryption algorithm/mode at the infrastructure layer using platform managed encryption keys 

Customers sets a new property Type for an instance of DiskEncryptionSet with value EncryptionAtRestWithPlatformAndCustomerKeys and then associate the DiskEncryptionSet with disks, snapshots and images for encrypting them at rest with double encryption.


## Server-side encryption versus Azure disk encryption

[Azure Disk Encryption for virtual machines and virtual machine scale sets](../../security/fundamentals/azure-disk-encryption-vms-vmss.md) leverages the [DM-Crypt](https://en.wikipedia.org/wiki/Dm-crypt) feature of Linux to encrypt managed disks with customer-managed keys within the guest VM.  Server-side encryption with customer-managed keys improves on ADE by enabling you to use any OS types and images for your VMs by encrypting data in the Storage service.

## Next steps

- [Enable encryption at host (preview)](disks-enable-encryption-at-host.md)
- [Enable customer-managed keys for managed disks - CLI](disks-enable-customer-managed-keys-cli.md)
- [Enable customer-managed keys for managed disks - portal](disks-enable-customer-managed-keys-portal.md)
- [Enable customer-managed keys for your managed disk - PowerShell](../windows/disks-enable-customer-managed-keys-powershell.md)
- [What is Azure Key Vault?](../../key-vault/general/overview.md)
