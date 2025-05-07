---
title: Use blob index tags to manage and find data with .NET
titleSuffix: Azure Storage
description: Learn how to categorize, manage, and query for blob objects by using the .NET client library.  
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 08/05/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp, devx-track-dotnet
---

# Use blob index tags to manage and find data with .NET

[!INCLUDE [storage-dev-guide-selector-index-tags](../../../includes/storage-dev-guides/storage-dev-guide-selector-index-tags.md)]

This article shows how to use blob index tags to manage and find data using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage).

[!INCLUDE [storage-dev-guide-prereqs-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-dotnet.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-dotnet.md)]

#### Authorization

The authorization mechanism must have the necessary permissions to work with blob index tags. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Owner** or higher. To learn more, see the authorization guidance for [Get Blob Tags (REST API)](/rest/api/storageservices/get-blob-tags#authorization), [Set Blob Tags (REST API)](/rest/api/storageservices/set-blob-tags#authorization), or [Find Blobs by Tags (REST API)](/rest/api/storageservices/find-blobs-by-tags#authorization).

[!INCLUDE [storage-dev-guide-about-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-about-blob-tags.md)]

## Set tags

[!INCLUDE [storage-dev-guide-auth-set-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-auth-set-blob-tags.md)]

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

## Get tags

[!INCLUDE [storage-dev-guide-auth-get-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-auth-get-blob-tags.md)]

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

[!INCLUDE [storage-dev-guide-auth-filter-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-auth-filter-blob-tags.md)]

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

## Resources

To learn more about how to use index tags to manage and find data using the Azure Blob Storage client library for .NET, see the following resources.

### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The client library methods for managing and using blob index tags use the following REST API operations:

- [Get Blob Tags](/rest/api/storageservices/get-blob-tags) (REST API)
- [Set Blob Tags](/rest/api/storageservices/set-blob-tags) (REST API)
- [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags) (REST API)

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]

### See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)

[!INCLUDE [storage-dev-guide-next-steps-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-next-steps-dotnet.md)]