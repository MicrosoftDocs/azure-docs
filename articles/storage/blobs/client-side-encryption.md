---
title: Client-side encryption for blobs
titleSuffix: Azure Storage
description: The Blob Storage client library supports client-side encryption and integration with Azure Key Vault for users requiring encryption on the client.
services: storage
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: article
ms.date: 12/12/2022
ms.author: pauljewell
ms.reviewer: ozgun
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Client-side encryption for blobs

The [Azure Blob Storage client library for .NET](/dotnet/api/overview/azure/storage) supports encrypting data within client applications before uploading to Azure Storage, and decrypting data while downloading to the client. The library also supports integration with [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) for storage account key management.

> [!IMPORTANT]
> Blob Storage supports both service-side and client-side encryption. For most scenarios, Microsoft recommends using service-side encryption features for ease of use in protecting your data. To learn more about service-side encryption, see [Azure Storage encryption for data at rest](../common/storage-service-encryption.md).

For a step-by-step tutorial that leads you through the process of encrypting blobs using client-side encryption and Azure Key Vault, see [Encrypt and decrypt blobs in Microsoft Azure Storage using Azure Key Vault](../blobs/storage-encrypt-decrypt-blobs-key-vault.md).

## About client-side encryption

The Azure Blob Storage client library uses [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) in order to encrypt user data. There are two versions of client-side encryption available in the client library:

- Version 2 uses [Galois/Counter Mode (GCM)](https://en.wikipedia.org/wiki/Galois/Counter_Mode) mode with AES.
- Version 1 uses [Cipher Block Chaining (CBC)](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Cipher-block_chaining_.28CBC.29) mode with AES.

> [!WARNING]
> Using version 1 of client-side encryption is no longer recommended due to a security vulnerability in the client library's implementation of CBC mode. For more information about this security vulnerability, see [Azure Storage updating client-side encryption in SDK to address security vulnerability](https://aka.ms/azstorageclientencryptionblog). If you are currently using version 1, we recommend that you update your application to use version 2 and migrate your data. See the following section, [Mitigate the security vulnerability in your applications](#mitigate-the-security-vulnerability-in-your-applications), for further guidance.

### Mitigate the security vulnerability in your applications

Due to a security vulnerability discovered in the Blob Storage client library's implementation of CBC mode, Microsoft recommends that you take one or more of the following actions immediately:

- Consider using service-side encryption features instead of client-side encryption. For more information about service-side encryption features, see [Azure Storage encryption for data at rest](../common/storage-service-encryption.md).

- If you need to use client-side encryption, then migrate your applications from client-side encryption v1 to client-side encryption v2.

The following table summarizes the steps you'll need to take if you choose to migrate your applications to client-side encryption v2:

| Client-side encryption status | Recommended actions |
|---|---|
| Application is using client-side encryption a version of the client library that supports only client-side encryption v1. | Update your application to use a version of the client library that supports client-side encryption v2. See [SDK support matrix for client-side encryption](#sdk-support-matrix-for-client-side-encryption) for a list of supported versions. [Learn more...](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/storage/Azure.Storage.Blobs/AzureStorageNetMigrationV12.md)<br/><br/>Update your code to use client-side encryption v2. [Learn more...](#example-encrypting-and-decrypting-a-blob-with-client-side-encryption-v2)<br/><br/>Download any encrypted data to decrypt it, then reencrypt it with client-side encryption v2. [Learn more...](#reencrypt-previously-encrypted-data-with-client-side-encryption-v2) |
| Application is using client-side encryption with a version of the client library that supports client-side encryption v2. | Update your code to use client-side encryption v2. [Learn more...](#example-encrypting-and-decrypting-a-blob-with-client-side-encryption-v2)<br/><br/>Download any encrypted data to decrypt it, then reencrypt it with client-side encryption v2. [Learn more...](#reencrypt-previously-encrypted-data-with-client-side-encryption-v2) |

Additionally, Microsoft recommends that you take the following steps to help secure your data:

- Configure your storage accounts to use private endpoints to secure all traffic between your virtual network (VNet) and your storage account over a private link. For more information, see [Use private endpoints for Azure Storage](../common/storage-private-endpoints.md).
- Limit network access to specific networks only.

### SDK support matrix for client-side encryption

The following table shows which versions of the client libraries for .NET, Java, and Python support which versions of client-side encryption:

|  | .NET | Java | Python |
|--|--|--|--|
| **Client-side encryption v2 and v1** | [Versions 12.13.0 and later](https://www.nuget.org/packages/Azure.Storage.Blobs) | [Versions 12.18.0 and later](https://search.maven.org/artifact/com.azure/azure-storage-blob) | [Versions 12.13.0 and later](https://pypi.org/project/azure-storage-blob) |
| **Client-side encryption v1 only** | Versions 12.12.0 and earlier | Versions 12.17.0 and earlier | Versions 12.12.0 and earlier |

If your application is using client-side encryption with an earlier version of the .NET, Java, or Python client library, you must first upgrade your code to a version that supports client-side encryption v2. Next, you must decrypt and re-encrypt your data with client-side encryption v2. If necessary, you can use a version of the client library that supports client-side encryption v2 side-by-side with an earlier version of the client library while you are migrating your code. For code examples, see [Example: Encrypting and decrypting a blob with client-side encryption v2](#example-encrypting-and-decrypting-a-blob-with-client-side-encryption-v2).

## How client-side encryption works

The Azure Blob Storage client libraries use envelope encryption to encrypt and decrypt your data on the client side. Envelope encryption encrypts a key with one or more additional keys.

The Blob Storage client libraries rely on Azure Key Vault to protect the keys that are used for client-side encryption. For more information about Azure Key Vault, see [What is Azure Key Vault?](../../key-vault/general/overview.md).

### Encryption and decryption via the envelope technique

Encryption via the envelope technique works as follows:

1. The Azure Storage client library generates a content encryption key (CEK), which is a one-time-use symmetric key.
1. User data is encrypted using the CEK.
1. The CEK is then wrapped (encrypted) using the key encryption key (KEK). The KEK is identified by a key identifier and can be either an asymmetric key pair or a symmetric key. You can manage the KEK locally or store it in an Azure Key Vault.

    The Azure Storage client library itself never has access to KEK. The library invokes the key wrapping algorithm that is provided by Key Vault. Users can choose to use custom providers for key wrapping/unwrapping if desired.

1. The encrypted data is then uploaded to Azure Blob Storage. The wrapped key together with some additional encryption metadata is stored as metadata on the blob.

Decryption via the envelope technique works as follows:

1. The Azure Storage client library assumes that the user is managing the KEK either locally or in an Azure Key Vault. The user doesn't need to know the specific key that was used for encryption. Instead, a key resolver that resolves different key identifiers to keys can be set up and used.
1. The client library downloads the encrypted data along with any encryption material that is stored in Azure Storage.
1. The wrapped CEK) is then unwrapped (decrypted) using the KEK. The client library doesn't have access to the KEK during this process, but only invokes the unwrapping algorithm of the Azure Key Vault or other key store.
1. The client library uses the CEK to decrypt the encrypted user data.

### Encryption/decryption on blob upload/download

The Blob Storage client library supports encryption of whole blobs only on upload. For downloads, both complete and range downloads are supported.

During encryption, the client library generates a random initialization vector (IV) of 16 bytes and a random CEK of 32 bytes, and performs envelope encryption of the blob data using this information. The wrapped CEK and some additional encryption metadata are then stored as blob metadata along with the encrypted blob.

When a client downloads an entire blob, the wrapped CEK is unwrapped and used together with the IV to return the decrypted data to the client.

Downloading an arbitrary range in the encrypted blob involves adjusting the range provided by users in order to get a small amount of additional data that can be used to successfully decrypt the requested range.

All blob types (block blobs, page blobs, and append blobs) can be encrypted/decrypted using this scheme.

> [!WARNING]
> If you are editing or uploading your own metadata for the blob, you must ensure that the encryption metadata is preserved. If you upload new metadata without also preserving the encryption metadata, then the wrapped CEK, IV, and other metadata will be lost and you will not be able to retrieve the contents of the blob. Calling the [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata) operation always replaces all blob metadata.
>
> When reading from or writing to an encrypted blob, use whole blob upload commands, such as [Put Blob](/rest/api/storageservices/put-blob), and range or whole blob download commands, such as Get Blob. Avoid writing to an encrypted blob using protocol operations such as [Put Block](/rest/api/storageservices/put-block), [Put Block List](/rest/api/storageservices/put-block-list), [Put Page](/rest/api/storageservices/put-page), or [Append Block](/rest/api/storageservices/append-block). Calling these operations on an encrypted blob can corrupt it and make it unreadable.

## Example: Encrypting and decrypting a blob with client-side encryption v2

The code example in this section shows how to use client-side encryption v2 to encrypt and decrypt a blob.

> [!IMPORTANT]
> If you have data that has been previously encrypted with client-side encryption v1, then you'll need to decrypt that data and reencrypt it with client-side encryption v2. See the guidance and sample for your client library below.

### [.NET](#tab/dotnet)

To use client-side encryption from your .NET code, reference the [Blob Storage client library](/dotnet/api/overview/azure/storage.blobs-readme). Make sure that you are using version 12.13.0 or later. If you need to migrate from version 11.x to version 12.13.0, see the [Migration guide](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/storage/Azure.Storage.Blobs/AzureStorageNetMigrationV12.md).

Two additional packages are required for Azure Key Vault integration for client-side encryption:

- The **Azure.Core** package provides the `IKeyEncryptionKey` and `IKeyEncryptionKeyResolver` interfaces. The Blob Storage client library for .NET already defines this assembly as a dependency.
- The **Azure.Security.KeyVault.Keys** package (version 4.x and later) provides the Key Vault REST client and the cryptographic clients that are used with client-side encryption. You'll need to ensure that this package is referenced in your project if you're using Azure Key Vault as your key store.

    Azure Key Vault is designed for high-value master keys, and throttling limits per key vault reflect this design. As of version 4.1.0 of Azure.Security.KeyVault.Keys, the `IKeyEncryptionKeyResolver` interface doesn't support key caching. Should caching be necessary due to throttling, you can use the approach demonstrated in [this sample](/samples/azure/azure-sdk-for-net/azure-key-vault-proxy/) to inject a caching layer into an `Azure.Security.KeyVault.Keys.Cryptography.KeyResolver` instance.

Developers can provide a key, a key resolver, or both a key and a key resolver. Keys are identified using a key identifier that provides the logic for wrapping and unwrapping the CEK. A key resolver is used to resolve a key during the decryption process. The key resolver defines a resolve method that returns a key given a key identifier. The resolver provides users the ability to choose between multiple keys that are managed in multiple locations.

On encryption, the key is used always and the absence of a key will result in an error.

On decryption, if the key is specified and its identifier matches the required key identifier, that key is used for decryption. Otherwise, the client library attempts to call the resolver. If there's no resolver specified, then the client library throws an error. If a resolver is specified, then the key resolver is invoked to get the key. If the resolver is specified but doesn't have a mapping for the key identifier, then the client library throws an error.

To use client-side encryption, create a **ClientSideEncryptionOptions** object and set it on client creation with **SpecializedBlobClientOptions**. You can't set encryption options on a per-API basis. Everything else will be handled by the client library internally.

```csharp
// Your key and key resolver instances, either through Azure Key Vault SDK or an external implementation.
IKeyEncryptionKey key;
IKeyEncryptionKeyResolver keyResolver;

// Create the encryption options to be used for upload and download.
ClientSideEncryptionOptions encryptionOptions = new ClientSideEncryptionOptions(ClientSideEncryptionVersion.V2_0)
{
   KeyEncryptionKey = key,
   KeyResolver = keyResolver,
   // String value that the client library will use when calling IKeyEncryptionKey.WrapKey()
   KeyWrapAlgorithm = "some algorithm name"
};

// Set the encryption options on the client options.
BlobClientOptions options = new SpecializedBlobClientOptions() { ClientSideEncryption = encryptionOptions };

// Create blob client with client-side encryption enabled.
// Client-side encryption options are passed from service clients to container clients, 
// and from container clients to blob clients.
// Attempting to construct a BlockBlobClient, PageBlobClient, or AppendBlobClient from a BlobContainerClient
// with client-side encryption options present will throw, as this functionality is only supported with BlobClient.
BlobClient blob = new BlobServiceClient(connectionString, options).GetBlobContainerClient("my-container").GetBlobClient("myBlob");

// Upload the encrypted contents to the blob.
blob.Upload(stream);

// Download and decrypt the encrypted contents from the blob.
MemoryStream outputStream = new MemoryStream();
blob.DownloadTo(outputStream);
```

You can apply encryption options to a **BlobServiceClient**, **BlobContainerClient**, or **BlobClient** constructors that accept **BlobClientOptions** objects.

If a **BlobClient** object already exists in your code but lacks client-side encryption options, then you can use an extension method to create a copy of that object with the given **ClientSideEncryptionOptions**. This extension method avoids the overhead of constructing a new **BlobClient** object from scratch.

```csharp
using Azure.Storage.Blobs.Specialized;

// An existing BlobClient instance and encryption options.
BlobClient plaintextBlob;
ClientSideEncryptionOptions encryptionOptions;

// Get a copy of the blob that uses client-side encryption.
BlobClient clientSideEncryptionBlob = plaintextBlob.WithClientSideEncryptionOptions(encryptionOptions);
```

After you update your code to use client-side encryption v2, make sure that you deencrypt and reencrypt any existing encrypted data, as described in [Reencrypt previously encrypted data with client-side encryption v2](#reencrypt-previously-encrypted-data-with-client-side-encryption-v2).

### [Java](#tab/java)

To use client-side encryption from your Java code, reference the [Blob Storage client library](/java/api/overview/azure/storage-blob-readme). Make sure that you are using version 12.18.0 or later. If you need to migrate from an earlier version of the Java client library, see the [Blob Storage migration guide for Java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/storage/azure-storage-blob/migrationGuides/V8_V12.md).

For sample code that shows how to use client-side encryption v2 from Java, see [ClientSideEncryptionV2Uploader.java](https://github.com/wastore/azure-storage-samples-for-java/blob/f1621c807a4b2be8b6e04e226cbf0a288468d7b4/ClientSideEncryptionMigration/src/main/java/ClientSideEncryptionV2Uploader.java).

After you update your code to use client-side encryption v2, make sure that you deencrypt and reencrypt any existing encrypted data, as described in [Reencrypt previously encrypted data with client-side encryption v2](#reencrypt-previously-encrypted-data-with-client-side-encryption-v2).

### [Python](#tab/python)

To use client-side encryption from your Python code, reference the [Blob Storage client library](/python/api/overview/azure/storage-blob-readme). Make sure that you are using version 12.13.0 or later. If you need to migrate from an earlier version of the Python client library, see the [Blob Storage migration guide for Python](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/storage/azure-storage-blob/migration_guide.md).

The following example shows how to use client-side migration v2 from Python:

```python
blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
    blob_client.require_encryption = True
    blob_client.key_encryption_key = kek
    blob_client.encryption_version = ‘2.0’  # Use Version 2.0!

    with open("decryptedcontentfile.txt", "rb") as stream:
        blob_client.upload_blob(stream, overwrite=OVERWRITE_EXISTING)
```

After you update your code to use client-side encryption v2, make sure that you deencrypt and reencrypt any existing encrypted data, as described in [Reencrypt previously encrypted data with client-side encryption v2](#reencrypt-previously-encrypted-data-with-client-side-encryption-v2).

---

## Reencrypt previously encrypted data with client-side encryption v2

Any data that was previously encrypted with client-side encryption v1 must be decrypted and then reencrypted with client-side encryption v2 to mitigate the security vulnerability. Decryption requires downloading the data and reencryption requires reuploading it to Blob Storage.

### [.NET](#tab/dotnet)

For a sample project that shows how to migrate data from client-side encryption v1 to v2 and how to encrypt data with client-side encryption v2 in .NET, see the [Encryption migration sample project](https://github.com/wastore/azure-storage-samples-for-net/tree/master/ClientSideEncryptionMigration).

### [Java](#tab/java)

For a sample project that shows how to migrate data from client-side encryption v1 to v2 and how to encrypt data with client-side encryption v2 in Java, see [ClientSideEncryptionV2Uploader](https://github.com/wastore/azure-storage-samples-for-java/blob/f1621c807a4b2be8b6e04e226cbf0a288468d7b4/ClientSideEncryptionMigration/src/main/java/ClientSideEncryptionV2Uploader.java).

### [Python](#tab/python)

For a sample project that shows how to migrate data from client-side encryption v1 to v2 and how to encrypt data with client-side encryption v2 in Python, see [Client Side Encryption Migration from V1 to V2](https://github.com/wastore/azure-storage-samples-for-python/tree/master/ClientSideEncryptionToServerSideEncryptionMigrationSamples/ClientSideEncryptionV1ToV2).

---

## Client-side encryption and performance

Keep in mind that encrypting your storage data results in additional performance overhead. When you use client-side encryption in your application, the client library must securely generate the CEK and IV, encrypt the content itself, communicate with your chosen keystore for key-enveloping, and format and upload additional metadata. This overhead varies depending on the quantity of data being encrypted. We recommend that customers always test their applications for performance during development.

## Next steps

- [Azure Storage updating client-side encryption in SDK to address security vulnerability](https://aka.ms/azstorageclientencryptionblog)
- [Azure Storage encryption for data at rest](../common/storage-service-encryption.md)
- [Azure Key Vault documentation](../../key-vault/general/overview.md)
