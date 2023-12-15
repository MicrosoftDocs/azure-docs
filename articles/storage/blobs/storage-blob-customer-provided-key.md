---
title: Specify a customer-provided key on a request to Blob storage with .NET
titleSuffix: Azure Storage
description: Learn how to specify a customer-provided key on a request to Blob storage using .NET.
services: storage
author: akashdubey-ms

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 05/09/2022
ms.author: akashdubey
ms.reviewer: ozgun
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-dotnet
---

# Specify a customer-provided key on a request to Blob storage with .NET

Clients making requests against Azure Blob storage have the option to provide an AES-256 encryption key on an individual request. Including the encryption key on the request provides granular control over encryption settings for Blob storage operations. Customer-provided keys can be stored in Azure Key Vault or in another key store.

This article shows how to specify a customer-provided key on a request with .NET.

[!INCLUDE [storage-install-packages-blob-and-identity-include](../../../includes/storage-install-packages-blob-and-identity-include.md)]

To learn more about how to authenticate with the Azure Identity client library, see [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme).

## Use a customer-provided key to write to a blob

The following example provides an AES-256 key when uploading a blob with the v12 client library for Blob storage. The example uses the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) object to authorize the write request with Microsoft Entra ID, but you can also authorize the request with Shared Key credentials. For more information about using the DefaultAzureCredential class to authorize a managed identity to access Azure Storage, see [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme).

```csharp
async static Task UploadBlobWithClientKey(Uri blobUri,
                                          Stream data,
                                          byte[] key,
                                          string keySha256)
{
    // Create a new customer-provided key.
    // Key must be AES-256.
    var cpk = new CustomerProvidedKey(key);

    // Check the key's encryption hash.
    if (cpk.EncryptionKeyHash != keySha256)
    {
        throw new InvalidOperationException("The encryption key is corrupted.");
    }

    // Specify the customer-provided key on the options for the client.
    BlobClientOptions options = new BlobClientOptions()
    {
        CustomerProvidedKey = cpk
    };

    // Create the client object with options specified.
    BlobClient blobClient = new BlobClient(
        blobUri,
        new DefaultAzureCredential(),
        options);

    // If the container may not exist yet,
    // create a client object for the container.
    // The container client retains the credential and client options.
    BlobContainerClient containerClient =
        blobClient.GetParentBlobContainerClient();

    try
    {
        // Create the container if it does not exist.
        await containerClient.CreateIfNotExistsAsync();

        // Upload the data using the customer-provided key.
        await blobClient.UploadAsync(data);
    }
    catch (RequestFailedException e)
    {
        Console.WriteLine(e.Message);
        Console.ReadLine();
        throw;
    }
}
```

## Next steps

- [Provide an encryption key on a request to Blob storage](encryption-customer-provided-keys.md)
- [Azure Storage encryption for data at rest](../common/storage-service-encryption.md)
