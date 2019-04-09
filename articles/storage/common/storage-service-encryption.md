---
title: Azure Storage encryption for data at rest | Microsoft Docs
description: Azure Storage protects your data by automatically encrypting it before persisting it to the cloud. All data in Azure Storage, whether in blobs, disks, files, queues, or tables, is encrypted and decrypted transparently using 256-bit AES encryption and is FIPS 140-2 compliant.
services: storage
author: lakasa

ms.service: storage
ms.topic: article
ms.date: 03/14/2019
ms.author: lakasa
ms.subservice: common
---

# Azure Storage encryption for data at rest

Azure Storage automatically encrypts your data when persisting it to the cloud. Encryption protects your data and to help you to meet your organizational security and compliance commitments. Data in Azure Storage is encrypted and decrypted transparently using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available, and is FIPS 140-2 compliant. Azure Storage encryption is similar to BitLocker encryption on Windows.

Azure Storage encryption is enabled for all new and existing storage accounts and cannot be disabled. Because your data is secured by default, you don't need to modify your code or applications to take advantage of Azure Storage encryption. Storage accounts are encrypted regardless of their performance tier (standard or premium) or deployment model (Azure Resource Manager or classic). All Azure Storage redundancy options support encryption, and all copies of a storage account are encrypted. All Azure Storage resources are encrypted, including blobs, disks, files, queues, and tables.

Encryption does not affect Azure Storage performance. There is no additional cost for Azure Storage encryption.

For more information about the cryptographic modules underlying Azure Storage encryption, see [Cryptography API: Next Generation](https://docs.microsoft.com/windows/desktop/seccng/cng-portal).

## Key management

You can rely on Microsoft-managed keys for the encryption of your storage account, or you can manage encryption with your own keys, together with Azure Key Vault.

### Microsoft-managed encryption keys

By default, your storage account uses Microsoft-managed encryption keys. You can see the encryption settings for your storage account in the **Encryption** section of the [Azure portal](https://portal.azure.com), as shown in the following image.

![View account encrypted with Microsoft-managed keys](media/storage-service-encryption/encryption-microsoft-managed-keys.png)

### Custom encryption keys

You can manage Azure Storage encryption for blobs and files with custom keys. Custom keys give you more flexibility to create, rotate, disable, and revoke access controls. You can also audit the encryption keys used to protect your data. 

Use Azure Key Vault to manage your custom encryption keys. With Azure Key Vault, you can manage and control your keys and audit your key usage. You can either create your own encryption keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate the encryption keys. The storage account and the key vault must be in the same region, but they can be in different subscriptions. For more information about Azure Key Vault, see [What is Azure Key Vault?](../../key-vault/key-vault-overview.md).

To revoke access to custom keys, see [Azure Key Vault PowerShell](https://docs.microsoft.com/powershell/module/azurerm.keyvault/) and [Azure Key Vault CLI](https://docs.microsoft.com/cli/azure/keyvault). Revoking access effectively blocks access to all blobs in the storage account, as the account encryption key is inaccessible by Azure Storage.

To learn how to manage custom keys for Azure Storage, see [Manage custom keys for Azure Storage encryption with Key Vault](storage-service-encryption-customer-managed-keys.md).

> [!NOTE]  
> Customer-managed keys are not supported for [Azure managed disks](../../virtual-machines/windows/managed-disks-overview.md).

## Native storage encryption versus disk encryption

Azure Storage encryption is native to the Azure Storage service. All Azure Storage accounts and the resources they contain are encrypted, including the page blobs that back Azure virtual machine disks. 

Additionally, Azure virtual machine disks may be encrypted with [Azure Disk Encryption](../../security/azure-security-disk-encryption-overview.md). Azure Disk Encryption uses industry-standard [BitLocker](https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-overview) on Windows and [DM-Crypt](https://en.wikipedia.org/wiki/Dm-crypt) on Linux to provide operating system-based encryption solutions that are integrated with Azure Key Vault.

## Next steps

- [Manage custom keys for Azure Storage encryption with Key Vault](storage-service-encryption-customer-managed-keys.md)
- [What is Azure Key Vault?](../../key-vault/key-vault-overview.md)
