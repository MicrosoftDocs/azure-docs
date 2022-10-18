---
title: Use blob index tags to find data in Azure Blob Storage (.NET)
description: Learn how to categorize, manage, and query for blob objects by using the .NET client library.  
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

# Use blob index tags to manage and find data in Azure Blob Storage (.NET)

Blob index tags categorize data in your storage account using key-value tag attributes. These tags are automatically indexed and exposed as a searchable multi-dimensional index to easily find data. This article shows you how to set, get, and find data using blob index tags.

To learn more about this feature along with known issues and limitations, see [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md).

## Set and retrieve index tags

You can set and get index tags if your code has authorized access by using an account key or if your code uses a security principal that has been given the appropriate role assignments. For more information, see [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md).

#### Set tags

You can set tags by using either of the following methods:

- [SetTags](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.settags)
- [SetTagsAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.settagsasync)

The following example performs this task.

```csharp
public static async Task SetTags(BlobClient blobClient)
{
    Dictionary<string, string> tags = 
        new Dictionary<string, string>
    {
        { "Sealed", "false" },
        { "Content", "image" },
        { "Date", "2020-04-20" }
    };

    await blobClient.SetTagsAsync(tags);
}

```

You can delete all tags by passing an empty [Dictionary] into the [SetTags](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.settags) or [SetTagsAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.settagsasync) method as shown in the following example.

```csharp   
Dictionary<string, string> noTags = new Dictionary<string, string>();
await blobClient.SetTagsAsync(noTags);
```

| Related articles |
|--|
| [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md) |
| [Set Blob Tags](/rest/api/storageservices/set-blob-tags) (REST API) |

#### Get tags

You can get tags by using either of the following methods: 

- [GetTags](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.gettags)
- [GetTagsAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.gettagsasync)

The following example performs this task.

```csharp
public static async Task GetTags(BlobClient blobClient)
{
    Response<GetBlobTagResult> tagsResponse = await blobClient.GetTagsAsync();

    foreach (KeyValuePair<string, string> tag in tagsResponse.Value.Tags)
    {
        Console.WriteLine($"{tag.Key}={tag.Value}");
    }
}

```

## Filter and find data with blob index tags

You can use index tags to find and filter data if your code has authorized access by using an account key or if your code uses a security principal that has been given the appropriate role assignments. For more information, see [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md).

> [!NOTE]
> You can't use index tags to retrieve previous versions. Tags for previous versions aren't passed to the blob index engine. For more information, see [Conditions and known issues](storage-manage-find-blobs.md#conditions-and-known-issues).

You can find data by using either of the following methods: 

- [FindBlobsByTags](/dotnet/api/azure.storage.blobs.blobserviceclient.findblobsbytags)
- [FindBlobsByTagsAsync](/dotnet/api/azure.storage.blobs.blobserviceclient.findblobsbytagsasync)

The following example finds all blobs tagged with a date that falls between a specific range.

```csharp
public static async Task FindBlobsbyTags(BlobServiceClient serviceClient)
{
    string query = @"""Date"" >= '2020-04-20' AND ""Date"" <= '2020-04-30'";

    // Find Blobs given a tags query
    Console.WriteLine("Find Blob by Tags query: " + query + Environment.NewLine);

    List<TaggedBlobItem> blobs = new List<TaggedBlobItem>();
    await foreach (TaggedBlobItem taggedBlobItem in serviceClient.FindBlobsByTagsAsync(query))
    {
        blobs.Add(taggedBlobItem);
    }

    foreach (var filteredBlob in blobs)
    {
        
        Console.WriteLine($"BlobIndex result: ContainerName= {filteredBlob.BlobContainerName}, " +
            $"BlobName= {filteredBlob.BlobName}");
    }

}

```

## See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Get Blob Tags](/rest/api/storageservices/get-blob-tags) (REST API)
- [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags) (REST API)
