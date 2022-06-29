---
title: Client-side encryption for blobs with .NET
titleSuffix: Azure Storage
description: The Blob Storage client library for .NET supports client-side encryption and integration with Azure Key Vault for maximum security for your Azure Storage applications.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 06/28/2022
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: common
ms.custom: devx-track-csharp
---

# Client-Side Encryption and Azure Key Vault for Microsoft Azure Storage

[!INCLUDE [storage-selector-client-side-encryption-include](../../../includes/storage-selector-client-side-encryption-include.md)]

## Overview

The [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage) supports encrypting data within client applications before uploading to Azure Storage, and decrypting data while downloading to the client. The library also supports integration with [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) for storage account key management.

> [!IMPORTANT]
> Azure Storage supports both service-side and client-side encryption. For most scenarios, Microsoft recommends using service-side encryption features for ease of use in protecting your data. To learn more about service-side encryption, see [Azure Storage encryption for data at rest](storage-service-encryption.md).

For a step-by-step tutorial that leads you through the process of encrypting blobs using client-side encryption and Azure Key Vault, see [Encrypt and decrypt blobs in Microsoft Azure Storage using Azure Key Vault](../blobs/storage-encrypt-decrypt-blobs-key-vault.md).

## How client-side encryption works

The Azure Storage client library uses [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) in order to encrypt user data. There are two versions of client-side encryption available in the client library:

- Version 2.x uses [Galois/Counter Mode (GCM)](https://en.wikipedia.org/wiki/Galois/Counter_Mode) mode with AES.
- Version 1.x uses [Cipher Block Chaining (CBC)](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Cipher-block_chaining_.28CBC.29) mode with AES.

> [!WARNING]
> Using version 1.x of client-side encryption is not recommended due to potential security concerns. If you are currently using version 1.x, we recommend that you update your application to use version 2.x and migrate your data.

### Encryption and decryption via the envelope technique

The Azure Storage client libraries use envelope encryption to encrypt and decrypt your data on the client side. Envelope encryption encrypts a key with one or more additional keys.

Encryption via the envelope technique works as follows:

1. The Azure Storage client library generates a content encryption key (CEK), which is a one-time-use symmetric key.
2. User data is encrypted using the CEK.
3. The CEK is then wrapped (encrypted) using the key encryption key (KEK). The KEK is identified by a key identifier and can be either an asymmetric key pair or a symmetric key. You can manage the KEK locally or store it in an Azure Key Vault.

    The Azure Storage client library itself never has access to KEK. The library invokes the key wrapping algorithm that is provided by Key Vault. Users can choose to use custom providers for key wrapping/unwrapping if desired.

4. The encrypted data is then uploaded to Azure Storage. The wrapped key together with some additional encryption metadata is either stored as metadata, in the case of blobs, or is interpolated with the encrypted data, in the case of queue messages and table entities.

Decryption via the envelope technique works as follows:

1. The Azure Storage client library assumes that the user is managing the KEK either locally or in an Azure Key Vault. The user does not need to know the specific key that was used for encryption. Instead, a key resolver which resolves different key identifiers to keys can be set up and used.
2. The client library downloads the encrypted data along with any encryption material that is stored in Azure Storage.
3. The wrapped CEK)is then unwrapped (decrypted) using the KEK. The client library does not have access to the KEK during this process, but only invokes the unwrapping algorithm of the Azure Key Vault or other key store.
4. The client library uses the CEK to decrypt the encrypted user data.

### Encryption/decryption on blob upload/download

The client library currently supports encryption of whole blobs only (???does this mean on upload???). For downloads, both complete and range downloads are supported.

During encryption, the client library generates a random initialization vector (IV) of 16 bytes and a random CEK of 32 bytes, and perform envelope encryption of the blob data using this information. The wrapped CEK and some additional encryption metadata are then stored as blob metadata along with the encrypted blob.

When downloading an entire blob, the wrapped CEK is unwrapped and used together with the IV to return the decrypted data to the client.

Downloading an arbitrary range in the encrypted blob involves adjusting the range provided by users in order to get a small amount of additional data that can be used to successfully decrypt the requested range.

All blob types (block blobs, page blobs, and append blobs) can be encrypted/decrypted using this scheme.

> [!WARNING]
> If you are editing or uploading your own metadata for the blob, you must ensure that the encryption metadata is preserved. If you upload new metadata without also preserving the encryption metadata, then the wrapped CEK, IV, and other metadata will be lost and you will not be able to retrieve the contents of the blob. Calling the [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata) operation always replaces all blob metadata.
>
> When reading from or writing to an encrypted blob, use whole blob upload commands, such as [Put Blob](/rest/api/storageservices/put-blob), and range or whole blob download commands, such as Get Blob. Avoid writing to an encrypted blob using protocol operations such as [Put Block](/rest/api/storageservices/put-block), [Put Block List](/rest/api/storageservices/put-block-list), [Put Page](/rest/api/storageservices/put-page), or [Append Block](/rest/api/storageservices/append-block). Calling these operations on an encrypted blob can corrupt it and make it unreadable.

## Example: Encrypting and decrypting a blob

### Interface and dependencies

Two packages are required for Azure Key Vault integration:

- Azure.Core contains the `IKeyEncryptionKey` and `IKeyEncryptionKeyResolver` interfaces. The blob client library for .NET already defines it as a dependency.
- Azure.Security.KeyVault.Keys (v4.x) contains the Key Vault REST client, as well as cryptographic clients used with client-side encryption.

Azure Key Vault is designed for high-value master keys, and throttling limits per key vault are designed with this in mind. As of version 4.1.0 of Azure.Security.KeyVault.Keys, the `IKeyEncryptionKeyResolver` interface does not support key caching. Should caching be necessary due to throttling, [this sample](/samples/azure/azure-sdk-for-net/azure-key-vault-proxy/) can be followed to inject a caching layer into an `Azure.Security.KeyVault.Keys.Cryptography.KeyResolver` instance.

### Client API / Interface

Users can provide only a key, only a resolver, or both. Keys are identified using a key identifier and provides the logic for wrapping/unwrapping. Resolvers are used to resolve a key during the decryption process. It defines a resolve method that returns a key given a key identifier. This provides users the ability to choose between multiple keys that are managed in multiple locations.

- For encryption, the key is used always and the absence of a key will result in an error.
- For decryption:
  - If the key is specified and its identifier matches the required key identifier, that key is used for decryption. Otherwise, the resolver is attempted. If there is no resolver for this attempt, an error is thrown.
  - The key resolver is invoked if specified to get the key. If the resolver is specified but does not have a mapping for the key identifier, an error is thrown.

Create a **ClientSideEncryptionOptions** object and set it on client creation with **SpecializedBlobClientOptions**. You cannot set encryption options on a per-API basis. Everything else will be handled by the client library internally.

```csharp
// Your key and key resolver instances, either through KeyVault SDK or an external implementation
IKeyEncryptionKey key;
IKeyEncryptionKeyResolver keyResolver;

// Create the encryption options to be used for upload and download.
ClientSideEncryptionOptions encryptionOptions = new ClientSideEncryptionOptions(ClientSideEncryptionVersion.V2_0)
{
   KeyEncryptionKey = key,
   KeyResolver = keyResolver,
   // string the storage client will use when calling IKeyEncryptionKey.WrapKey()
   KeyWrapAlgorithm = "some algorithm name"
};

// Set the encryption options on the client options
BlobClientOptions options = new SpecializedBlobClientOptions() { ClientSideEncryption = encryptionOptions };

// Get your blob client with client-side encryption enabled.
// Client-side encryption options are passed from service to container clients, and container to blob clients.
// Attempting to construct a BlockBlobClient, PageBlobClient, or AppendBlobClient from a BlobContainerClient
// with client-side encryption options present will throw, as this functionality is only supported with BlobClient.
BlobClient blob = new BlobServiceClient(connectionString, options).GetBlobContainerClient("my-container").GetBlobClient("myBlob");

// Upload the encrypted contents to the blob.
blob.Upload(stream);

// Download and decrypt the encrypted contents from the blob.
MemoryStream outputStream = new MemoryStream();
blob.DownloadTo(outputStream);
```

A **BlobServiceClient** is not necessary to apply encryption options. They can also be passed into **BlobContainerClient**/**BlobClient** constructors that accept **BlobClientOptions** objects.

If a desired **BlobClient** object already exists but without client-side encryption options, an extension method exists to create a copy of that object with the given **ClientSideEncryptionOptions**. This extension method avoids the overhead of constructing a new **BlobClient** object from scratch.

```csharp
using Azure.Storage.Blobs.Specialized;

// Your existing BlobClient instance and encryption options
BlobClient plaintextBlob;
ClientSideEncryptionOptions encryptionOptions;

// Get a copy of plaintextBlob that uses client-side encryption
BlobClient clientSideEncryptionBlob = plaintextBlob.WithClientSideEncryptionOptions(encryptionOptions);
```

## Client-side encryption and performance

Note that encrypting your storage data results in additional performance overhead. The CEK and IV must be generated, the content itself must be encrypted, and additional meta-data must be formatted and uploaded. This overhead varies depending on the quantity of data being encrypted. We recommend that customers always test their applications for performance during development.

## Next steps

- [Tutorial: Encrypt and decrypt blobs in Microsoft Azure Storage using Azure Key Vault](../blobs/storage-encrypt-decrypt-blobs-key-vault.md)
- Download the [Azure Storage Client Library for .NET NuGet package](https://www.nuget.org/packages/WindowsAzure.Storage)
- Download the Azure Key Vault NuGet [Core](https://www.nuget.org/packages/Microsoft.Azure.KeyVault.Core/), [Client](https://www.nuget.org/packages/Microsoft.Azure.KeyVault/), and [Extensions](https://www.nuget.org/packages/Microsoft.Azure.KeyVault.Extensions/) packages
- Visit the [Azure Key Vault Documentation](../../key-vault/general/overview.md)
