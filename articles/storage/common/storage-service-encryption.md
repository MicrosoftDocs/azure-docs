---
title: Azure Storage encryption for data at rest
description: Azure Storage protects your data by automatically encrypting it before persisting it to the cloud. You can rely on Microsoft-managed keys for the encryption of your storage account, or you can manage encryption with your own keys.
services: storage
author: tamram

ms.service: storage
ms.date: 01/10/2020
ms.topic: conceptual
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Azure Storage encryption for data at rest

Azure Storage automatically encrypts your data when it is persisted it to the cloud. Azure Storage encryption protects your data and to help you to meet your organizational security and compliance commitments.

## About Azure Storage encryption

Data in Azure Storage is encrypted and decrypted transparently using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available, and is FIPS 140-2 compliant. Azure Storage encryption is similar to BitLocker encryption on Windows.

Azure Storage encryption is enabled for all new storage accounts, including both Resource Manager and classic storage accounts. Azure Storage encryption cannot be disabled. Because your data is secured by default, you don't need to modify your code or applications to take advantage of Azure Storage encryption.

Storage accounts are encrypted regardless of their performance tier (standard or premium) or deployment model (Azure Resource Manager or classic). All Azure Storage redundancy options support encryption, and all copies of a storage account are encrypted. All Azure Storage resources are encrypted, including blobs, disks, files, queues, and tables. All object metadata is also encrypted.

Encryption does not affect Azure Storage performance. There is no additional cost for Azure Storage encryption.

Every block blob, append blob, or page blob that was written to Azure Storage after October 20, 2017 is encrypted. Blobs created prior to this date continue to be encrypted by a background process. To force the encryption of a blob that was created before October 20, 2017, you can rewrite the blob. To learn how to check the encryption status of a blob, see [Check the encryption status of a blob](../blobs/storage-blob-encryption-status.md).

For more information about the cryptographic modules underlying Azure Storage encryption, see [Cryptography API: Next Generation](https://docs.microsoft.com/windows/desktop/seccng/cng-portal).

## About encryption key management

You can rely on Microsoft-managed keys for the encryption of your storage account, or you can manage encryption with your own keys. If you choose to manage encryption with your own keys, you have two options:

- You can specify a *customer-managed key* with Azure Key Vault to use for encrypting and decrypting data in Blob storage and in Azure Files.<sup>1,2</sup>
- You can specify a *customer-provided key* on Blob storage operations. A client making a read or write request against Blob storage can include an encryption key on the request for granular control over how blob data is encrypted and decrypted.

The following table compares key management options for Azure Storage encryption.

|                                        |    Microsoft-managed keys                             |    Customer-managed keys                                                                                                                        |    Customer-provided keys                                                          |
|----------------------------------------|-------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
|    Encryption/decryption operations    |    Azure                                              |    Azure                                                                                                                                        |    Azure                                                                         |
|    Azure Storage services supported    |    All                                                |    Blob storage, Azure Files<sup>1,2</sup>                                                                                                               |    Blob storage                                                                  |
|    Key storage                         |    Microsoft key store    |    Azure Key Vault                                                                                                                              |    Azure Key Vault or any other key store                                                                 |
|    Key rotation responsibility         |    Microsoft                                          |    Customer                                                                                                                                     |    Customer                                                                      |
|    Key usage                           |    Microsoft                                          |    Azure portal, Storage Resource Provider REST API, Azure Storage management libraries, PowerShell, CLI        |    Azure Storage REST API (Blob storage), Azure Storage client libraries    |
|    Key access                          |    Microsoft only                                     |    Microsoft, Customer                                                                                                                    |    Customer only                                                                 |

<sup>1</sup> For information about creating an account that supports using customer-managed keys with Queue storage, see [Create an account that supports customer-managed keys for queues](account-encryption-key-create.md?toc=%2fazure%2fstorage%2fqueues%2ftoc.json).<br />
<sup>2</sup> For information about creating an account that supports using customer-managed keys with Table storage, see [Create an account that supports customer-managed keys for tables](account-encryption-key-create.md?toc=%2fazure%2fstorage%2ftables%2ftoc.json).

The following sections describe each of the options for key management in greater detail.

## Microsoft-managed keys

By default, your storage account uses Microsoft-managed encryption keys. You can see the encryption settings for your storage account in the **Encryption** section of the [Azure portal](https://portal.azure.com), as shown in the following image.

![View account encrypted with Microsoft-managed keys](media/storage-service-encryption/encryption-microsoft-managed-keys.png)

## Customer-managed keys with Azure Key Vault

You can manage Azure Storage encryption at the level of the storage account with your own keys. When you specify a customer-managed key at the level of the storage account, that key is used to protect and control access the root encryption key for the storage account which in turn is used to encrypt and decrypt all blob and file data. Customer-managed keys offer greater flexibility to create, rotate, disable, and revoke access controls. You can also audit the encryption keys used to protect your data.

You must use Azure Key Vault to store your customer-managed keys. You can either create your own keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate keys. The storage account and the key vault must be in the same region and in the same Azure Active Directory (Azure AD) tenant, but they can be in different subscriptions. For more information about Azure Key Vault, see [What is Azure Key Vault?](../../key-vault/key-vault-overview.md).

This diagram shows how Azure Storage uses Azure Active Directory and Azure Key Vault to make requests using the customer-managed key:

![Diagram showing how customer-managed keys work in Azure Storage](media/storage-service-encryption/encryption-customer-managed-keys-diagram.png)

The following list explains the numbered steps in the diagram:

1. An Azure Key Vault admin grants permissions to encryption keys to the managed identity that's associated with the storage account.
2. An Azure Storage admin configures encryption with a customer-managed key for the storage account.
3. Azure Storage uses the managed identity that's associated with the storage account to authenticate access to Azure Key Vault via Azure Active Directory.
4. Azure Storage wraps the account encryption key with the customer key in Azure Key Vault.
5. For read/write operations, Azure Storage sends requests to Azure Key Vault to wrap and unwrap the account encryption key to perform encryption and decryption operations.

### Enable customer-managed keys for a storage account

When you enable encryption with customer-managed keys for a storage account, Azure Storage wraps the account encryption key with the customer-managed key in the associated key vault. Enabling customer-managed keys does not impact performance, and the account is encrypted with the new key immediately, without any time delay.

A new storage account is always encrypted using Microsoft-managed keys. It's not possible to enable customer-managed keys at the time that the account is created. Customer-managed keys are stored in Azure Key Vault, and the key vault must be provisioned with access policies that grant key permissions to the managed identity that is associated with the storage account. The managed identity is available only after the storage account is created.

When you modify the key being used for Azure Storage encryption by enabling or disabling customer-managed keys, updating the key version, or specifying a different key, then the encryption of the root key changes, but the data in your Azure Storage account does not need to be re-encrypted.

To learn how to use customer-managed keys with Azure Key Vault for Azure Storage encryption, see one of these articles:

- [Configure customer-managed keys with Key Vault for Azure Storage encryption from the Azure portal](storage-encryption-keys-portal.md)
- [Configure customer-managed keys with Key Vault for Azure Storage encryption from PowerShell](storage-encryption-keys-powershell.md)
- [Configure customer-managed keys with Key Vault for Azure Storage encryption from Azure CLI](storage-encryption-keys-cli.md)

> [!IMPORTANT]
> Customer-managed keys rely on managed identities for Azure resources, a feature of Azure AD. Managed identities do not currently support cross-directory scenarios. When you configure customer-managed keys in the Azure portal, a managed identity is automatically assigned to your storage account under the covers. If you subsequently move the subscription, resource group, or storage account from one Azure AD directory to another, the managed identity associated with the storage account is not transferred to the new tenant, so customer-managed keys may no longer work. For more information, see **Transferring a subscription between Azure AD directories** in [FAQs and known issues with managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/known-issues.md#transferring-a-subscription-between-azure-ad-directories).  

### Store customer-managed keys in Azure Key Vault

To enable customer-managed keys on a storage account, you must use an Azure Key Vault to store your keys. You must enable both the **Soft Delete** and **Do Not Purge** properties on the key vault.

Only RSA keys of size 2048 are supported with Azure Storage encryption. For more information about keys, see **Key Vault keys** in [About Azure Key Vault keys, secrets and certificates](../../key-vault/about-keys-secrets-and-certificates.md#key-vault-keys).

### Rotate customer-managed keys

You can rotate a customer-managed key in Azure Key Vault according to your compliance policies. When the key is rotated, you must update the storage account to use the new key URI. To learn how to update the storage account to use a new version of the key in the Azure portal, see the section titled **Update the key version** in [Configure customer-managed keys for Azure Storage by using the Azure portal](storage-encryption-keys-portal.md).

Rotating the key does not trigger re-encryption of data in the storage account. There is no further action required from the user.

### Revoke access to customer-managed keys

To revoke access to customer-managed keys, use PowerShell or Azure CLI. For more information, see [Azure Key Vault PowerShell](/powershell/module/az.keyvault//) or [Azure Key Vault CLI](/cli/azure/keyvault). Revoking access effectively blocks access to all data in the storage account, as the encryption key is inaccessible by Azure Storage.

### Customer-managed keys for Azure managed disks (preview)

Customer-managed keys are also available for managing encryption of Azure managed disks (preview). Customer-managed keys behave differently for managed disks than for Azure Storage resources. For more information, see [Server side encryption of Azure managed disks](../../virtual-machines/windows/disk-encryption.md) for Windows or [Server side encryption of Azure managed disks](../../virtual-machines/linux/disk-encryption.md) for Linux.

## Customer-provided keys (preview)

Clients making requests against Azure Blob storage have the option to provide an encryption key on an individual request. Including the encryption key on the request provides granular control over encryption settings for Blob storage operations. Customer-provided keys (preview) can be stored in Azure Key Vault or in another key store.

For an example that shows how to specify a customer-provided key on a request to Blob storage, see [Specify a customer-provided key on a request to Blob storage with .NET](../blobs/storage-blob-customer-provided-key.md). 

### Encrypting read and write operations

When a client application provides an encryption key on the request, Azure Storage performs encryption and decryption transparently while reading and writing blob data. Azure Storage writes an SHA-256 hash of the encryption key alongside the blob's contents. The hash is used to verify that all subsequent operations against the blob use the same encryption key. 

Azure Storage does not store or manage the encryption key that the client sends with the request. The key is securely discarded as soon as the encryption or decryption process is complete.

When a client creates or updates a blob using a customer-provided key, then subsequent read and write requests for that blob must also provide the key. If the key is not provided on a request for a blob that has already been encrypted with a customer-provided key, then the request fails with error code 409 (Conflict).

If the client application sends an encryption key on the request, and the storage account is also encrypted using a Microsoft-managed key or a customer-managed key, then Azure Storage uses the key provided on the request for encryption and decryption.

To send the encryption key as part of the request, a client must establish a secure connection to Azure Storage using HTTPS.

Each blob snapshot can have its own encryption key.

### Request headers for specifying customer-provided keys

For REST calls, clients can use the following headers to securely pass encryption key information on a request to Blob storage:

|Request Header | Description |
|---------------|-------------|
|`x-ms-encryption-key` |Required for both write and read requests. A Base64-encoded AES-256 encryption key value. |
|`x-ms-encryption-key-sha256`| Required for both write and read requests. The Base64-encoded SHA256 of the encryption key. |
|`x-ms-encryption-algorithm` | Required for write requests, optional for read requests. Specifies the algorithm to use when encrypting data using the given key. Must be AES256. |

Specifying encryption keys on the request is optional. However, if you specify one of the headers listed above for a write operation, then you must specify all of them.

### Blob storage operations supporting customer-provided keys

The following Blob storage operations support sending customer-provided encryption keys on a request:

- [Put Blob](/rest/api/storageservices/put-blob)
- [Put Block List](/rest/api/storageservices/put-block-list)
- [Put Block](/rest/api/storageservices/put-block)
- [Put Block from URL](/rest/api/storageservices/put-block-from-url)
- [Put Page](/rest/api/storageservices/put-page)
- [Put Page from URL](/rest/api/storageservices/put-page-from-url)
- [Append Block](/rest/api/storageservices/append-block)
- [Set Blob Properties](/rest/api/storageservices/set-blob-properties)
- [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata)
- [Get Blob](/rest/api/storageservices/get-blob)
- [Get Blob Properties](/rest/api/storageservices/get-blob-properties)
- [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata)
- [Snapshot Blob](/rest/api/storageservices/snapshot-blob)

### Rotate customer-provided keys

To rotate an encryption key passed on the request, download the blob and re-upload it with the new encryption key.

> [!IMPORTANT]
> The Azure portal cannot be used to read from or write to a container or blob that is encrypted with a key provided on the request.
>
> Be sure to protect the encryption key that you provide on a request to Blob storage in a secure key store like Azure Key Vault. If you attempt a write operation on a container or blob without the encryption key, the operation will fail, and you will lose access to the object.

## Azure Storage encryption versus disk encryption

Azure Storage encryption encrypts the page blobs that back Azure virtual machine disks. Additionally, all Azure virtual machine disks, including local temp disks, may optionally be encrypted with [Azure Disk Encryption](../../security/azure-security-disk-encryption-overview.md). Azure Disk Encryption uses industry-standard [BitLocker](https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-overview) on Windows and [DM-Crypt](https://en.wikipedia.org/wiki/Dm-crypt) on Linux to provide operating system-based encryption solutions that are integrated with Azure Key Vault.

## Next steps

- [What is Azure Key Vault?](../../key-vault/key-vault-overview.md)
- [Configure customer-managed keys for Azure Storage encryption from the Azure portal](storage-encryption-keys-portal.md)
- [Configure customer-managed keys for Azure Storage encryption from PowerShell](storage-encryption-keys-powershell.md)
- [Configure customer-managed keys for Azure Storage encryption from Azure CLI](storage-encryption-keys-cli.md)
