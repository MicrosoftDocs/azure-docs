---
title: Specify a customer-provided key on a request to Blob storage with .NET - Azure Storage
description: Learn how to specify a customer-provided key on a request to Blob storage using .NET.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 11/26/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Specify a customer-provided key on a request to Blob storage with .NET

Clients making requests against Azure Blob storage have the option to provide an encryption key on an individual request. Including the encryption key on the request provides granular control over encryption settings for Blob storage operations. Customer-provided keys (preview) can be stored in Azure Key Vault or in another key store.

This article shows how to specify a customer-provided key on a request with .NET.

[!INCLUDE [storage-install-packages-blob-and-identity-include](../../../includes/storage-install-packages-blob-and-identity-include.md)]

To learn more about how to authenticate with the Azure Identity client library from Azure Storage, see the section titled **Authenticate with the Azure Identity library** in [Authorize access to blobs and queues with Azure Active Directory and managed identities for Azure Resources](../common/storage-auth-aad-msi.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json#authenticate-with-the-azure-identity-library).

## Example: Use a customer-provided key to upload a blob

The following example creates a customer-provided key and uses that key to upload a blob. The code uploads a block, then commits the block list to write the blob to Azure Storage.

```csharp
async static Task UploadBlobWithClientKey(string accountName, string containerName,
    string blobName, Stream data, byte[] key)
{
    const string blobServiceEndpointSuffix = ".blob.core.windows.net";
    Uri accountUri = new Uri("https://" + accountName + blobServiceEndpointSuffix);

    // Specify the customer-provided key on the options for the client.
    BlobClientOptions options = new BlobClientOptions()
    {
        CustomerProvidedKey = new CustomerProvidedKey(key)
    };

    // Create a client object for the Blob service, including options.
    BlobServiceClient serviceClient = new BlobServiceClient(accountUri, 
        new DefaultAzureCredential(), options);

    // Create a client object for the container.
    // The container client retains the credential and client options.
    BlobContainerClient containerClient = serviceClient.GetBlobContainerClient(containerName);

    // Create a new block blob client object.
    // The blob client retains the credential and client options.
    BlobClient blobClient = containerClient.GetBlobClient(blobName);

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

- [Azure Storage encryption for data at rest](../common/storage-service-encryption.md)
- [Authorize access to blobs and queues with Azure Active Directory and managed identities for Azure Resources](../common/storage-auth-aad-msi.md)
