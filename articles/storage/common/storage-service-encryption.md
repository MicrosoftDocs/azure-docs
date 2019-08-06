---
title: Azure Storage encryption for data at rest | Microsoft Docs
description: Azure Storage protects your data by automatically encrypting it before persisting it to the cloud. All data in an Azure Storage is encrypted and decrypted transparently using 256-bit AES encryption and is FIPS 140-2 compliant.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 08/06/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Azure Storage encryption for data at rest

Azure Storage automatically encrypts your data when persisting it to the cloud. Encryption protects your data and to help you to meet your organizational security and compliance commitments. Data in Azure Storage is encrypted and decrypted transparently using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available, and is FIPS 140-2 compliant. Azure Storage encryption is similar to BitLocker encryption on Windows.

Azure Storage encryption is enabled for all new and existing storage accounts and cannot be disabled. Because your data is secured by default, you don't need to modify your code or applications to take advantage of Azure Storage encryption.

Storage accounts are encrypted regardless of their performance tier (standard or premium) or deployment model (Azure Resource Manager or classic). All Azure Storage redundancy options support encryption, and all copies of a storage account are encrypted. All Azure Storage resources are encrypted, including blobs, disks, files, queues, and tables. All object metadata is also encrypted.

Encryption does not affect Azure Storage performance. There is no additional cost for Azure Storage encryption.

You can rely on Microsoft-managed keys for the encryption of your storage account, or you can manage encryption with your own keys, together with Azure Key Vault.

For more information about the cryptographic modules underlying Azure Storage encryption, see [Cryptography API: Next Generation](https://docs.microsoft.com/windows/desktop/seccng/cng-portal).

## Microsoft-managed keys

By default, your storage account uses Microsoft-managed encryption keys. You can see the encryption settings for your storage account in the **Encryption** section of the [Azure portal](https://portal.azure.com), as shown in the following image.

![View account encrypted with Microsoft-managed keys](media/storage-service-encryption/encryption-microsoft-managed-keys.png)

## Customer-managed keys

You can choose to manage Azure Storage encryption with your own keys. Customer-managed keys give you more flexibility to create, rotate, disable, and revoke access controls. You can also audit the encryption keys used to protect your data.

You have two options for providing customer-managed keys:

- You can specify a customer-managed key for the storage account. This key must be stored in Azure Key Vault. A key specified at the level of the storage account is used to encrypt all data in the storage account, including blobs, files, queues, and tables.
- You can specify a customer-managed key on a request to Blob storage. This key can be stored in Azure Key Vault or in another key store.

When a customer-managed key is specified for the storage account and on a request to Blob storage, the key specified on the request is used for encryption.
  
The following sections describe how to specify a customer-managed key for the storage account, or on an individual request to Blob storage.

### Customer-managed keys for the storage account

When you specify a customer-managed key at the level of the storage account, that key is used to encrypt and decrypt all data from all services in the storage account.

Use Azure Key Vault to manage your keys and audit your key usage. You can either create your own keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate keys. The storage account and the key vault must be in the same region, but they can be in different subscriptions. For more information about Azure Key Vault, see [What is Azure Key Vault?](../../key-vault/key-vault-overview.md).

To revoke access to customer-managed keys on the storage account, see [Azure Key Vault PowerShell](https://docs.microsoft.com/powershell/module/azurerm.keyvault/) and [Azure Key Vault CLI](https://docs.microsoft.com/cli/azure/keyvault). Revoking access effectively blocks access to all data in the storage account, as the encryption key is inaccessible by Azure Storage.

To learn how to use customer-managed keys with Azure Storage, see one of these articles:

- [Configure customer-managed keys for Azure Storage encryption from the Azure portal](storage-encryption-keys-portal.md)
- [Configure customer-managed keys for Azure Storage encryption from PowerShell](storage-encryption-keys-powershell.md)
- [Use customer-managed keys with Azure Storage encryption from Azure CLI](storage-encryption-keys-cli.md)

> [!IMPORTANT]
> Customer-managed keys rely on managed identities for Azure resources, a feature of Azure Active Directory (Azure AD). When you transfer a subscription from one Azure AD directory to another, managed identities are not updated and customer-managed keys may no longer work. For more information, see **Transferring a subscription between Azure AD directories** in [FAQs and known issues with managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/known-issues.md#transferring-a-subscription-between-azure-ad-directories).  

> [!NOTE]  
> Customer-managed keys are not supported for [Azure managed disks](../../virtual-machines/windows/managed-disks-overview.md).

### Customer-managed keys on a request (Blob storage only)

For Blob storage, you can specify customer-managed keys on the request. Including the encryption key on the request provides granular control over encryption settings for Blob storage operations. You can store the keys that you provide on a request in Azure Key Vault, or in another key store.

When you provide the encryption key as part of the request, Azure Storage performs encryption and decryption transparently while writing and reading data from Blob storage. A SHA-256 hash of the encryption key is written alongside a blob's contents and is used to verify that all subsequent operations against the blob use the same encryption key. Azure Storage does not store or manage the encryption key provided on the request. The key is securely discarded as soon as the encryption or decryption process completes.

When you send the encryption key as part of the request, you must establish a secure connection to Azure Storage using HTTPs.

For operations on blob snapshots, each snapshot can have its own encryption key.

#### Request headers for specifying encryption key information

The following headers are used to securely pass the encryption key information on a request:

|Request Header | Description |
|---------------|-------------|
|`x-ms-encryption-key` |Required. A Base64-encoded AES-256 encryption key value. |
|`x-ms-encryption-key-sha256`| Required. The Base64-encoded SHA256 of the encryption key. |
|`x-ms-encryption-algorithm` | Required. Specifies the algorithm to use when encrypting data using the given key. Must be AES256. |

#### Blob storage operations supporting customer-managed keys on the request

The following Blob storage operations support providing customer-managed keys on a request:

- Put Blob
- Put Block List
- Put Block
- Put Block from URL
- Put Page
- Put Page from URL
- Append Block
- Set Blob Properties
- Set Blob Metadata
- Get Blob
- Get Blob Properties
- Get Blob Metadata
- Set Blob Tier
- Snapshot Blob

#### Rotating customer-managed keys on the request

To rotate the key used to encrypt a blob on a request, use the [Copy Blob](/rest/api/storageservices/copy-blob) operation to overwrite the contents of the blob. Provide the original encryption key using the `x-ms-source-encryption-key` header. Provide the new encryption key using the `x-ms-encryption-key-header`. The key is rotated when the copy operation completes.

> [!IMPORTANT]
> The Azure portal cannot be used to read from or write to a container or blob that is encrypted with a key provided on the request.
>
> Be sure to protect the encryption key you provide on a request to Blob storage. If you attempt a write operation on a container or blob without the encryption key, the operation will fail, and you will lose access to the object.

## Azure Storage encryption versus disk encryption

With Azure Storage encryption, all Azure Storage accounts and the resources they contain are encrypted, including the page blobs that back Azure virtual machine disks. Additionally, Azure virtual machine disks may be encrypted with [Azure Disk Encryption](../../security/azure-security-disk-encryption-overview.md). Azure Disk Encryption uses industry-standard [BitLocker](https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-overview) on Windows and [DM-Crypt](https://en.wikipedia.org/wiki/Dm-crypt) on Linux to provide operating system-based encryption solutions that are integrated with Azure Key Vault.

## Next steps

- [What is Azure Key Vault?](../../key-vault/key-vault-overview.md)
