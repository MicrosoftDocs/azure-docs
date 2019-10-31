---
title: Azure Storage encryption for data at rest | Microsoft Docs
description: Azure Storage protects your data by automatically encrypting it before persisting it to the cloud. You can rely on Microsoft-managed keys for the encryption of your storage account, or you can manage encryption with your own keys.
services: storage
author: tamram

ms.service: storage
ms.date: 10/02/2019
ms.topic: conceptual
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Azure Storage encryption for data at rest

Azure Storage automatically encrypts your data when persisting it to the cloud. Encryption protects your data and to help you to meet your organizational security and compliance commitments. Data in Azure Storage is encrypted and decrypted transparently using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available, and is FIPS 140-2 compliant. Azure Storage encryption is similar to BitLocker encryption on Windows.

Azure Storage encryption is enabled for all new and existing storage accounts and cannot be disabled. Because your data is secured by default, you don't need to modify your code or applications to take advantage of Azure Storage encryption.

Storage accounts are encrypted regardless of their performance tier (standard or premium) or deployment model (Azure Resource Manager or classic). All Azure Storage redundancy options support encryption, and all copies of a storage account are encrypted. All Azure Storage resources are encrypted, including blobs, disks, files, queues, and tables. All object metadata is also encrypted.

Encryption does not affect Azure Storage performance. There is no additional cost for Azure Storage encryption.

For more information about the cryptographic modules underlying Azure Storage encryption, see [Cryptography API: Next Generation](https://docs.microsoft.com/windows/desktop/seccng/cng-portal).

## About encryption key management

You can rely on Microsoft-managed keys for the encryption of your storage account, or you can manage encryption with your own keys. If you choose to manage encryption with your own keys, you have two options:

- You can specify a *customer-managed key* to use for encrypting and decrypting all data in the storage account. A customer-managed key is used to encrypt all data in all services in your storage account.
- You can specify a *customer-provided key* on Blob storage operations. A client making a read or write request against Blob storage can include an encryption key on the request for granular control over how blob data is encrypted and decrypted.

The following table compares key management options for Azure Storage encryption.

|                                        |    Microsoft-managed keys                             |    Customer-managed keys                                                                                                                        |    Customer-provided keys                                                          |
|----------------------------------------|-------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
|    Encryption/decryption operations    |    Azure                                              |    Azure                                                                                                                                        |    Azure                                                                         |
|    Azure Storage services supported    |    All                                                |    Blob storage, Azure Files                                                                                                               |    Blob storage                                                                  |
|    Key storage                         |    Microsoft key store    |    Azure Key Vault                                                                                                                              |    Azure Key Vault or any other key store                                                                 |
|    Key rotation responsibility         |    Microsoft                                          |    Customer                                                                                                                                     |    Customer                                                                      |
|    Key usage                           |    Microsoft                                          |    Azure portal, Storage Resource Provider REST API, Azure Storage management libraries, PowerShell, CLI        |    Azure Storage REST API (Blob storage), Azure Storage client libraries    |
|    Key access                          |    Microsoft only                                     |    Microsoft, Customer                                                                                                                    |    Customer only                                                                 |

The following sections describe each of the options for key management in greater detail.

## Microsoft-managed keys

By default, your storage account uses Microsoft-managed encryption keys. You can see the encryption settings for your storage account in the **Encryption** section of the [Azure portal](https://portal.azure.com), as shown in the following image.

![View account encrypted with Microsoft-managed keys](media/storage-service-encryption/encryption-microsoft-managed-keys.png)

## Customer-managed keys

You can choose to manage Azure Storage encryption at the level of the storage account with your own keys. When you specify a customer-managed key at the level of the storage account, that key is used to encrypt and decrypt all data in the storage account, including blob, queue, file, and table data.  Customer-managed keys offer greater flexibility to create, rotate, disable, and revoke access controls. You can also audit the encryption keys used to protect your data.

You must use Azure Key Vault to store your customer-managed keys. You can either create your own keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate keys. The storage account and the key vault must be in the same region, but they can be in different subscriptions. For more information about Azure Key Vault, see [What is Azure Key Vault?](../../key-vault/key-vault-overview.md).

This diagram shows how Azure Storage uses Azure Active Directory and Azure Key Vault to make requests using the customer-managed key:

![Diagram showing how customer-managed keys work in Azure Storage](media/storage-service-encryption/encryption-customer-managed-keys-diagram.png)

The following list explains the numbered steps in the diagram:

1. An Azure Key Vault admin grants permissions to encryption keys to the managed identity that's associated with the storage account.
2. An Azure Storage admin configures encryption with a customer-managed key for the storage account.
3. Azure Storage uses the managed identity that's associated with the storage account to authenticate access to Azure Key Vault via Azure Active Directory.
4. Azure Storage wraps the account encryption key with the customer key in Azure Key Vault.
5. For read/write operations, Azure Storage sends requests to Azure Key Vault to wrap and unwrap the account encryption key to perform encryption and decryption operations.

To revoke access to customer-managed keys on the storage account, see [Azure Key Vault PowerShell](https://docs.microsoft.com/powershell/module/azurerm.keyvault/) and [Azure Key Vault CLI](https://docs.microsoft.com/cli/azure/keyvault). Revoking access effectively blocks access to all data in the storage account, as the encryption key is inaccessible by Azure Storage.

Customer-managed keys are not supported for [Azure managed disks](../../virtual-machines/windows/managed-disks-overview.md).

To learn how to use customer-managed keys with Azure Storage, see one of these articles:

- [Configure customer-managed keys for Azure Storage encryption from the Azure portal](storage-encryption-keys-portal.md)
- [Configure customer-managed keys for Azure Storage encryption from PowerShell](storage-encryption-keys-powershell.md)
- [Use customer-managed keys with Azure Storage encryption from Azure CLI](storage-encryption-keys-cli.md)

> [!IMPORTANT]
> Customer-managed keys rely on managed identities for Azure resources, a feature of Azure Active Directory (Azure AD). When you configure customer-managed keys in the Azure portal, a managed identity is automatically assigned to your storage account under the covers. If you subsequently move the subscription, resource group, or storage account from one Azure AD directory to another, the managed identity associated with the storage account is not transferred to the new tenant, so customer-managed keys may no longer work. For more information, see **Transferring a subscription between Azure AD directories** in [FAQs and known issues with managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/known-issues.md#transferring-a-subscription-between-azure-ad-directories).  

## Customer-provided keys (preview)

Clients making requests against Azure Blob storage have the option to provide an encryption key on an individual request. Including the encryption key on the request provides granular control over encryption settings for Blob storage operations. Customer-provided keys (preview) can be stored in Azure Key Vault or in another key store.

### Encrypting read and write operations

When a client application provides an encryption key on the request, Azure Storage performs encryption and decryption transparently while reading and writing blob data. A SHA-256 hash of the encryption key is written alongside a blob's contents and is used to verify that all subsequent operations against the blob use the same encryption key. Azure Storage does not store or manage the encryption key that the client sends with the request. The key is securely discarded as soon as the encryption or decryption process is complete.

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

### Example: Use a customer-provided key to upload a blob in .NET

The following example creates a customer-provided key and uses that key to upload a blob. The code uploads a block, then commits the block list to write the blob to Azure Storage. The key is provided on the [BlobRequestOptions](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions) object by setting the [CustomerProvidedKey](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions.customerprovidedkey) property.

The key is created with the [AesCryptoServiceProvider](/dotnet/api/system.security.cryptography.aescryptoserviceprovider) class. To create an instance of this class in your code, add a `using` statement that references the `System.Security.Cryptography` namespace:

```csharp
public static void UploadBlobWithClientKey(CloudBlobContainer container)
{
    // Create a new key using the Advanced Encryption Standard (AES) algorithm.
    AesCryptoServiceProvider keyAes = new AesCryptoServiceProvider();

    // Specify the key as an option on the request.
    BlobCustomerProvidedKey customerProvidedKey = new BlobCustomerProvidedKey(keyAes.Key);
    var options = new BlobRequestOptions
    {
        CustomerProvidedKey = customerProvidedKey
    };

    string blobName = "sample-blob-" + Guid.NewGuid();
    CloudBlockBlob blockBlob = container.GetBlockBlobReference(blobName);

    try
    {
        // Create an array of random bytes.
        byte[] buffer = new byte[1024];
        Random rnd = new Random();
        rnd.NextBytes(buffer);

        using (MemoryStream sourceStream = new MemoryStream(buffer))
        {
            // Write the array of random bytes to a block.
            int blockNumber = 1;
            string blockId = Convert.ToBase64String(Encoding.ASCII.GetBytes(string.Format("BlockId{0}",
                blockNumber.ToString("0000000"))));

            // Write the block to Azure Storage.
            blockBlob.PutBlock(blockId, sourceStream, null, null, options, null);

            // Commit the block list to write the blob.
            blockBlob.PutBlockList(new List<string>() { blockId }, null, options, null);
        }
    }
    catch (StorageException e)
    {
        Console.WriteLine(e.Message);
        Console.ReadLine();
        throw;
    }
}
```

## Azure Storage encryption versus disk encryption

With Azure Storage encryption, all Azure Storage accounts and the resources they contain are encrypted, including the page blobs that back Azure virtual machine disks. Additionally, Azure virtual machine disks may be encrypted with [Azure Disk Encryption](../../security/azure-security-disk-encryption-overview.md). Azure Disk Encryption uses industry-standard [BitLocker](https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-overview) on Windows and [DM-Crypt](https://en.wikipedia.org/wiki/Dm-crypt) on Linux to provide operating system-based encryption solutions that are integrated with Azure Key Vault.

## Next steps

- [What is Azure Key Vault?](../../key-vault/key-vault-overview.md)
- [Configure customer-managed keys for Azure Storage encryption from the Azure portal](storage-encryption-keys-portal.md)
- [Configure customer-managed keys for Azure Storage encryption from PowerShell](storage-encryption-keys-powershell.md)
- [Configure customer-managed keys for Azure Storage encryption from Azure CLI](storage-encryption-keys-cli.md)
