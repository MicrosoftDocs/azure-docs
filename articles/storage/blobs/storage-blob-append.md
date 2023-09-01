---
title: Append data to a blob with .NET
titleSuffix: Azure Storage
description: Learn how to append data to a blob in Azure Storage by using the.NET client library. 
author: pauljewellmsft

ms.author: pauljewell
ms.date: 03/28/2022
ms.service: azure-storage
ms.topic: how-to
ms.devlang: csharp, python
ms.custom: devx-track-csharp, devx-track-dotnet
---

# Append data to a blob in Azure Storage using the .NET client library

You can append data to a blob by creating an append blob. Append blobs are made up of blocks like block blobs, but are optimized for append operations. Append blobs are ideal for scenarios such as logging data from virtual machines.

> [!NOTE]
> The examples in this article assume that you've created a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) object by using the guidance in the [Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md) article. Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. To learn how to create a container, see [Create a container in Azure Storage with .NET](storage-blob-container-create.md). 

## Create an append blob and append data

Use these methods to create an append blob.

- [Create](/dotnet/api/azure.storage.blobs.specialized.appendblobclient.create)
- [CreateAsync](/dotnet/api/azure.storage.blobs.specialized.appendblobclient.createasync)
- [CreateIfNotExists](/dotnet/api/azure.storage.blobs.specialized.appendblobclient.createifnotexists)
- [CreateIfNotExistsAsync](/dotnet/api/azure.storage.blobs.specialized.appendblobclient.createifnotexistsasync)

Use either of these methods to append data to that append blob:

- [AppendBlock](/dotnet/api/azure.storage.blobs.specialized.appendblobclient.appendblock)
- [AppendBlockAsync](/dotnet/api/azure.storage.blobs.specialized.appendblobclient.appendblockasync)

The maximum size in bytes of each append operation is defined by the [AppendBlobMaxAppendBlockBytes](/dotnet/api/azure.storage.blobs.specialized.appendblobclient.appendblobmaxappendblockbytes) property. The following example creates an append blob and appends log data to that blob. This example uses the [AppendBlobMaxAppendBlockBytes](/dotnet/api/azure.storage.blobs.specialized.appendblobclient.appendblobmaxappendblockbytes) property to determine whether multiple append operations are required.

```csharp
static async Task AppendToBlob(
    BlobContainerClient containerClient,
    MemoryStream logEntryStream,
    string logBlobName)
{
    AppendBlobClient appendBlobClient = containerClient.GetAppendBlobClient(logBlobName);

    await appendBlobClient.CreateIfNotExistsAsync();

    var maxBlockSize = appendBlobClient.AppendBlobMaxAppendBlockBytes;

    if (logEntryStream.Length <= maxBlockSize)
    {
        await appendBlobClient.AppendBlockAsync(logEntryStream);
    }
    else
    {
        var bytesLeft = logEntryStream.Length;

        while (bytesLeft > 0)
        {
            var blockSize = (int)Math.Min(bytesLeft, maxBlockSize);
            var buffer = new byte[blockSize];
            await logEntryStream.ReadAsync(buffer, 0, blockSize);
            await appendBlobClient.AppendBlockAsync(new MemoryStream(buffer));
            bytesLeft -= blockSize;
        }
    }
}
```

## See also

- [Understanding block blobs, append blobs, and page blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs)
- [OpenWrite](/dotnet/api/azure.storage.blobs.specialized.appendblobclient.openwrite) / [OpenWriteAsync](/dotnet/api/azure.storage.blobs.specialized.appendblobclient.openwriteasync)
- [Append Block](/rest/api/storageservices/append-block) (REST API)
