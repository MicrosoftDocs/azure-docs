---
title: Azure Storage encryption for data at rest | Microsoft Docs
description: Azure Storage protects your data by automatically encrypting it before persisting it to the cloud. You can rely on Microsoft-managed keys for the encryption of your storage account, or you can manage encryption with your own keys.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 09/10/2019
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

## Key management

You can rely on Microsoft-managed keys for the encryption of your storage account, or you can manage encryption with your own keys. If you choose to manage encryption with your own keys, you can specify a customer-managed key that is used for encrypting and decrypting all data in the storage account. A client making a request against Blob storage can also provide an encryption key on an individual request for granular control over how Blob data is encrypted and decrypted.

The following table compares the key management options for Azure Storage encryption.

|                                        |    Microsoft-managed keys                             |    Customer-managed keys                                                                                                                        |    Client-provided keys                                                          |
|----------------------------------------|-------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
|    Encryption/decryption operations    |    Azure                                              |    Azure                                                                                                                                        |    Azure                                                                         |
|    Azure Storage services supported    |    All                                                |    Blob storage, Azure Files                                                                                                               |    Blob storage                                                                  |
|    Key storage                         |    Azure Key Vault    |    Azure Key Vault                                                                                                                              |    Any key store                                                                 |
|    Key rotation responsibility         |    Microsoft                                          |    Customer                                                                                                                                     |    Customer                                                                      |
|    Key usage                           |    Microsoft                                          |    Azure portal, Storage Resource Provider REST API, Azure Storage management libraries, PowerShell, CLI        |    Azure Storage REST API (Blob storage), Azure Storage client libraries    |
|    Key access                          |    Microsoft only                                     |    Microsoft, Customer                                                                                                                    |    Customer only                                                                 |

The following sections describe each of the options for key management in greater detail.

### Microsoft-managed keys

By default, your storage account uses Microsoft-managed encryption keys. You can see the encryption settings for your storage account in the **Encryption** section of the [Azure portal](https://portal.azure.com), as shown in the following image.

![View account encrypted with Microsoft-managed keys](media/storage-service-encryption/encryption-microsoft-managed-keys.png)

## Customer-managed keys

You can choose to manage Azure Storage encryption at the level of the storage account with your own keys. When you specify a customer-managed key at the level of the storage account, that key is used to encrypt and decrypt all data in the storage account, including blob, queue, file, and table data.  Customer-managed keys offer greater flexibility to create, rotate, disable, and revoke access controls. You can also audit the encryption keys used to protect your data.

You must use Azure Key Vault to store your customer-managed keys. You can either create your own keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate keys. The storage account and the key vault must be in the same region, but they can be in different subscriptions. For more information about Azure Key Vault, see [What is Azure Key Vault?](../../key-vault/key-vault-overview.md).

To revoke access to customer-managed keys on the storage account, see [Azure Key Vault PowerShell](https://docs.microsoft.com/powershell/module/azurerm.keyvault/) and [Azure Key Vault CLI](https://docs.microsoft.com/cli/azure/keyvault). Revoking access effectively blocks access to all data in the storage account, as the encryption key is inaccessible by Azure Storage.

Customer-managed keys are not supported for [Azure managed disks](../../virtual-machines/windows/managed-disks-overview.md).

To learn how to use customer-managed keys with Azure Storage, see one of these articles:

- [Configure customer-managed keys for Azure Storage encryption from the Azure portal](storage-encryption-keys-portal.md)
- [Configure customer-managed keys for Azure Storage encryption from PowerShell](storage-encryption-keys-powershell.md)
- [Use customer-managed keys with Azure Storage encryption from Azure CLI](storage-encryption-keys-cli.md)

> [!IMPORTANT]
> Customer-managed keys rely on managed identities for Azure resources, a feature of Azure Active Directory (Azure AD). When you transfer a subscription from one Azure AD directory to another, managed identities are not updated and customer-managed keys may no longer work. For more information, see **Transferring a subscription between Azure AD directories** in [FAQs and known issues with managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/known-issues.md#transferring-a-subscription-between-azure-ad-directories).  

## Client-provided keys (preview)

Clients making requests against Azure Blob storage have the option to providing an encryption key on an individual request to the service. Including the encryption key on the request provides granular control over encryption settings for Blob storage operations. Client-provided keys (preview) can be stored in Azure Key Vault or in another key store.

When a client provides the encryption key as part of the request, Azure Storage performs encryption and decryption transparently while writing and reading data from Blob storage. A SHA-256 hash of the encryption key is written alongside a blob's contents and is used to verify that all subsequent operations against the blob use the same encryption key. Azure Storage does not store or manage the encryption key that the client sends with the request. The key is securely discarded as soon as the encryption or decryption process is complete.

To send the encryption key as part of the request, a client must establish a secure connection to Azure Storage using HTTPS.

If the client provides a key on the request, and the storage account is also encrypted using a Microsoft-managed key or a customer-managed key, then Azure Storage will use the key provided by the client for encryption and decryption.

For operations on blob snapshots, each snapshot can have its own encryption key.

### Request headers for specifying client-provided keys

Clients can use the following headers to securely pass encryption key information on a request to Blob storage:

|Request Header | Description |
|---------------|-------------|
|`x-ms-encryption-key` |Required. A Base64-encoded AES-256 encryption key value. |
|`x-ms-encryption-key-sha256`| Required. The Base64-encoded SHA256 of the encryption key. |
|`x-ms-encryption-algorithm` | Required. Specifies the algorithm to use when encrypting data using the given key. Must be AES256. |

Specifying encryption keys on the request is optional. However, if you specify one of the headers listed above, you must specify all of them.

### Blob storage operations supporting client-provided keys

The following Blob storage operations support sending client-provided encryption keys on a request:

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
- [Set Blob Tier](/rest/api/storageservices/set-blob-tier)
- [Snapshot Blob](/rest/api/storageservices/snapshot-blob)

### Rotate client-provided keys

To rotate the key used to encrypt a blob on a request, use the [Copy Blob](/rest/api/storageservices/copy-blob) operation to overwrite the contents of the blob. Provide the original encryption key using the `x-ms-source-encryption-key` header. Provide the new encryption key using the `x-ms-encryption-key-header`. The key is rotated when the copy operation completes.

> [!IMPORTANT]
> The Azure portal cannot be used to read from or write to a container or blob that is encrypted with a key provided on the request.
>
> Be sure to protect the encryption key you provide on a request to Blob storage. If you attempt a write operation on a container or blob without the encryption key, the operation will fail, and you will lose access to the object.

### Example: Use a client-provided key to upload a blob

The following example creates a client-provided key and uses that key to upload a blob. The code uploads a block, then commits the block list to write the blob to Azure Storage.

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
