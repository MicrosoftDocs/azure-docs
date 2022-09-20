---
title: Download a blob with .NET - Azure Storage
description: Learn how to download a blob in Azure Storage by using the .NET client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 03/28/2022
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: csharp, python
ms.custom: "devx-track-csharp, devx-track-python"
---

# Download a blob in Azure Storage using the .NET client library

You can download a blob by using any of the following methods:

- [DownloadTo](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.downloadto)
- [DownloadToAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.downloadtoasync)
- [DownloadContent](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.downloadcontent)
-[DownloadContentAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.downloadcontentasync)

You can also open a stream to read from a blob. The stream will only download the blob as the stream is read from. Use either of the following methods:

- [OpenRead](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.openread)
- [OpenReadAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.openreadasync)

> [!NOTE]
> The examples in this article assume that you've created a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) object by using the guidance in the [Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md) article.  
 
## Download to a file path

The following example downloads a blob by using a file path:

```csharp
public static async Task DownloadBlob(BlobClient blobClient, string localFilePath)
{
    await blobClient.DownloadToAsync(localFilePath);
}
```

## Download to a stream

The following example downloads a blob by creating a [Stream](/dotnet/api/system.io.stream) object and then downloading to that stream.

```csharp
public static async Task DownloadToStream(BlobClient blobClient, string localFilePath)
{
    FileStream fileStream = File.OpenWrite(localFilePath);
    await blobClient.DownloadToAsync(fileStream);
    fileStream.Close();
}
```

## Download to a string

The following example downloads a blob to a string. This example assumes that the blob is a text file.  

```csharp
public static async Task DownloadToText(BlobClient blobClient)
{
    BlobDownloadResult downloadResult = await blobClient.DownloadContentAsync();
    string downloadedData = downloadResult.Content.ToString();
    Console.WriteLine("Downloaded data:", downloadedData);
}
```

## Download from a stream

The following example downloads a blob by reading from a stream. 

```csharp
public static async Task DownloadfromStream(BlobClient blobClient, string localFilePath)
{
    using (var stream = await blobClient.OpenReadAsync())
    {
        FileStream fileStream = File.OpenWrite(localFilePath);
        await stream.CopyToAsync(fileStream);
    }
}

```

## See also

- [Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md)
- [DownloadStreaming](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.downloadstreaming) / [DownloadStreamingAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.downloadstreamingasync)
- [Get Blob](/rest/api/storageservices/get-blob) (REST API)
