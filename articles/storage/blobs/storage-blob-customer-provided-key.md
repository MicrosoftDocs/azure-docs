---
title: Specify a customer-provided key on a request to Blob storage with .NET - Azure Storage
description: Learn how to specify a customer-provided key on a request to Blob storage using .NET.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 11/20/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Specify a customer-provided key on a request to Blob storage with .NET

Clients making requests against Azure Blob storage have the option to provide an encryption key on an individual request. Including the encryption key on the request provides granular control over encryption settings for Blob storage operations. Customer-provided keys (preview) can be stored in Azure Key Vault or in another key store.

This article shows how to specify a customer-provided key on a request with .NET.

## Example: Use a customer-provided key to upload a blob in .NET

The following example creates a customer-provided key and uses that key to upload a blob. The code uploads a block, then commits the block list to write the blob to Azure Storage.

# [.NET v12](#tab/dotnet12)

```csharp
async static Task UploadBlobWithClientKey(string accountName, string containerName, string blobName)
{
    //BlobUriBuilder uriBuilder = new BlobUriBuilder(new Uri(string.Empty));

    //uriBuilder.Scheme = "https";
    //uriBuilder.AccountName = accountName;
    //uriBuilder.BlobContainerName = containerName;
    //uriBuilder.BlobName = blobName;

    // Construct the blob URI from the arguments.
    Uri blobUri = new Uri(string.Format("https://{0}.blob.core.windows.net/{1}/{2}",
                                                accountName,
                                                containerName,
                                                blobName));

    Uri containerUri = new Uri(string.Format("https://{0}.blob.core.windows.net/{1}",
                                                accountName,
                                                containerName));

    // Create a client object for the blob container.
    BlobContainerClient containerClient = new BlobContainerClient(containerUri,
                                                                    new DefaultAzureCredential());

    // Create a new key using the Advanced Encryption Standard (AES) algorithm.
    AesCryptoServiceProvider keyAes = new AesCryptoServiceProvider();

    // Specify the customer-provided key on the options for the blob client.
    BlobClientOptions options = new BlobClientOptions()
    {
        CustomerProvidedKey = new CustomerProvidedKey(keyAes.Key)
    };

    // Create a new block blob client object.
    BlockBlobClient blobClient = new BlockBlobClient(blobUri, new DefaultAzureCredential(), options);

    try
    {
        // Create the container if it does not exist.
        await containerClient.CreateIfNotExistsAsync();

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
            await blobClient.StageBlockAsync(blockId, sourceStream, null, null, null);

            // Commit the block list to write the blob.
            await blobClient.CommitBlockListAsync(new List<string>() { blockId }, null, null, null);
        }
    }
    catch (RequestFailedException e)
    {
        Console.WriteLine(e.Message);
        Console.ReadLine();
        throw;
    }
}
```

# [.NET v11](#tab/dotnet11)

Provide the encryption key on the [BlobRequestOptions](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions) object by setting the [CustomerProvidedKey](/dotnet/api/microsoft.azure.storage.blob.blobrequestoptions.customerprovidedkey) property.

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

---

## Example: Check whether an object is encrypted with a customer-provided key

# [.NET v12](#tab/dotnet12)

To determine whether a blob is encrypted, check the [BlobClientOptions.CustomerProvidedKey](/dotnet/api/azure.storage.blobs.blobclientoptions.customerprovidedkey) property.

```csharp
code here
```

# [.NET v11](#tab/dotnet11)

To determine whether a blob is encrypted, check the blob's [IsServerEncrypted](/dotnet/api/microsoft.azure.storage.blob.blobproperties.isserverencrypted) property.

```csharp
Console.WriteLine("Encryption status for blob {0}: {1}", blob.Name, blob.Properties.IsServerEncrypted);
```

## Next steps

[Azure Storage encryption for data at rest](../common/storage-service-encryption.md)
