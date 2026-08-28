---
title: List blobs with .NET
titleSuffix: Azure Storage
description: Learn how to list blobs in your storage account using the Azure Storage client library for .NET. Code examples show how to list blobs in a flat listing, or how to list blobs hierarchically, as though they were organized into directories or folders.
services: storage
author: stevenmatthew
ms.author: shaas

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 08/05/2024
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp, devx-track-dotnet
# Customer intent: "As a .NET developer, I want to list blobs in my storage account, so that I can manage and explore my storage resources efficiently using both flat and hierarchical structures."
---

# List blobs with .NET

[!INCLUDE [storage-dev-guide-selector-list-blob](../../../includes/storage-dev-guides/storage-dev-guide-selector-list-blob.md)]

This article shows how to list blobs by using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage).

[!INCLUDE [storage-dev-guide-prereqs-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-dotnet.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-dotnet.md)]

#### Authorization

The authorization mechanism must have the necessary permissions to list a blob. For authorization with Microsoft Entra ID (recommended), you need the Azure RBAC built-in role **Storage Blob Data Reader** or higher. To learn more, see the authorization guidance for [List Blobs (REST API)](/rest/api/storageservices/list-blobs#authorization).

## About blob listing options

When you list blobs from your code, you can specify a number of options to manage how results are returned from Azure Storage. You can specify the number of results to return in each set of results, and then retrieve the subsequent sets. You can specify a prefix to return blobs whose names begin with that character or string. You can list blobs in a flat listing structure or hierarchically. A hierarchical listing returns blobs as though they were organized into folders.

To list the blobs in a storage account, call one of these methods:

- [BlobContainerClient.GetBlobs](/dotnet/api/azure.storage.blobs.blobcontainerclient.getblobs)
- [BlobContainerClient.GetBlobsAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.getblobsasync)
- [BlobContainerClient.GetBlobsByHierarchy](/dotnet/api/azure.storage.blobs.blobcontainerclient.getblobsbyhierarchy)
- [BlobContainerClient.GetBlobsByHierarchyAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.getblobsbyhierarchyasync)

### Manage how many results are returned

By default, a listing operation returns up to 5000 results at a time, but you can specify the number of results that you want each listing operation to return. The examples presented in this article show you how to return results in pages. To learn more about pagination concepts, see [Pagination with the Azure SDK for .NET](/dotnet/azure/sdk/pagination).

### Filter results with a prefix

To filter the list of blobs, specify a string for the `prefix` parameter. The prefix string can include one or more characters. Azure Storage then returns only the blobs whose names start with that prefix.

### Return metadata

You can return blob metadata with the results by specifying the **Metadata** value for the [BlobTraits](/dotnet/api/azure.storage.blobs.models.blobtraits) enumeration.

### Flat listing versus hierarchical listing

Blobs in Azure Storage are organized in a flat paradigm, rather than a hierarchical paradigm (like a classic file system). However, you can organize blobs into *virtual directories* in order to mimic a folder structure. A virtual directory forms part of the name of the blob and is indicated by the delimiter character.

To organize blobs into virtual directories, use a delimiter character in the blob name. The default delimiter character is a forward slash (/), but you can specify any character as the delimiter.

If you name your blobs using a delimiter, then you can choose to list blobs hierarchically. For a hierarchical listing operation, Azure Storage returns any virtual directories and blobs beneath the parent object. You can call the listing operation recursively to traverse the hierarchy, similar to how you would traverse a classic file system programmatically.

## Use a flat listing

By default, a listing operation returns blobs in a flat listing. In a flat listing, blobs aren't organized by virtual directory.

The following example lists the blobs in the specified container by using a flat listing, with an optional segment size specified, and writes the blob name to a console window.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD.cs" id="Snippet_ListBlobsFlatListing":::

The sample output is similar to:

```console
Blob name: FolderA/blob1.txt
Blob name: FolderA/blob2.txt
Blob name: FolderA/blob3.txt
Blob name: FolderA/FolderB/blob1.txt
Blob name: FolderA/FolderB/blob2.txt
Blob name: FolderA/FolderB/blob3.txt
Blob name: FolderA/FolderB/FolderC/blob1.txt
Blob name: FolderA/FolderB/FolderC/blob2.txt
Blob name: FolderA/FolderB/FolderC/blob3.txt
```

> [!NOTE]
> The sample output shown assumes that you have a storage account with a flat namespace. If you enable the hierarchical namespace feature for your storage account, directories aren't virtual. Instead, they're concrete, independent objects. As a result, directories appear in the list as zero-length blobs.</br></br>For an alternative listing option when working with a hierarchical namespace, see [List directory contents (Azure Data Lake Storage)](data-lake-storage-directory-file-acl-dotnet.md#list-directory-contents).

## Use a hierarchical listing

When you call a listing operation hierarchically, Azure Storage returns the virtual directories and blobs at the first level of the hierarchy.

To list blobs hierarchically, call the [BlobContainerClient.GetBlobsByHierarchy](/dotnet/api/azure.storage.blobs.blobcontainerclient.getblobsbyhierarchy) or the [BlobContainerClient.GetBlobsByHierarchyAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.getblobsbyhierarchyasync) method.

The following example lists the blobs in the specified container by using a hierarchical listing, with an optional segment size specified, and writes the blob name to the console window.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD.cs" id="Snippet_ListBlobsHierarchicalListing":::

The sample output is similar to:

```console
Virtual directory prefix: FolderA/
Blob name: FolderA/blob1.txt
Blob name: FolderA/blob2.txt
Blob name: FolderA/blob3.txt

Virtual directory prefix: FolderA/FolderB/
Blob name: FolderA/FolderB/blob1.txt
Blob name: FolderA/FolderB/blob2.txt
Blob name: FolderA/FolderB/blob3.txt

Virtual directory prefix: FolderA/FolderB/FolderC/
Blob name: FolderA/FolderB/FolderC/blob1.txt
Blob name: FolderA/FolderB/FolderC/blob2.txt
Blob name: FolderA/FolderB/FolderC/blob3.txt
```

> [!NOTE]
> Blob snapshots can't be listed in a hierarchical listing operation.

### List blob versions or snapshots

To list blob versions or snapshots, specify the [BlobStates](/dotnet/api/azure.storage.blobs.models.blobstates) parameter with the **Version** or **Snapshot** field. The service returns versions and snapshots from oldest to newest.

The following code example shows how to list blob versions.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD.cs" id="Snippet_ListBlobVersions":::

## List blobs in Apache Arrow format (preview)

> [!IMPORTANT]
> Listing blobs in Apache Arrow format is currently in **PREVIEW**. This scenario requires a **beta (preview) version** of the Azure Blob Storage client library for .NET (for example, `Azure.Storage.Blobs` **12.30.0-beta.1** or later preview release). Preview features are provided without a service-level agreement and aren't recommended for production workloads. Some features might not be supported, or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This capability is built on the existing `List Blobs` API. Instead of using the default XML, it uses the compact, columnar [Apache Arrow](https://arrow.apache.org/) format as the response format on the wire. You enable it by setting a single option on the container listing call. The .NET SDK decodes Apache Arrow behind the scenes and still returns the same `BlobItem` objects. This approach improves listing throughput and reduces client-side CPU when enumerating large containers. It preserves the response contract that applications rely on.

> [!WARNING]
> Listing blobs in Apache Arrow format isn't supported on storage accounts that have hierarchical namespace (Azure Data Lake Storage) enabled.

To request Apache Arrow-formatted results, set the [ResponseFormat](/dotnet/api/azure.storage.blobs.models.getblobsoptions.responseformat?view=azure-dotnet-preview&preserve-view=true) property of [GetBlobsOptions](/dotnet/api/azure.storage.blobs.models.getblobsoptions?view=azure-dotnet-preview&preserve-view=true) to [StorageResponseFormat.Arrow](/dotnet/api/azure.storage.storageresponseformat?view=azure-dotnet-preview&preserve-view=true), then pass the options to the [BlobContainerClient.GetBlobs](/dotnet/api/azure.storage.blobs.blobcontainerclient.getblobs?view=azure-dotnet-preview&preserve-view=true) overload that accepts `GetBlobsOptions`. When using Apache Arrow output, you can also set the `StartFrom` and `EndBefore` properties to control the range of paths returned.

The following example lists the blobs in a container and requests the results in Apache Arrow format:

```csharp
using Azure.Storage;
using Azure.Storage.Blobs.Models;

GetBlobsOptions options = new GetBlobsOptions
{
    Prefix = "FolderA/",
    ResponseFormat = StorageResponseFormat.Arrow
};

foreach (BlobItem blobItem in containerClient.GetBlobs(options))
{
    Console.WriteLine("Blob name: " + blobItem.Name);
}
```

## Resources

To learn more about how to list blobs by using the Azure Blob Storage client library for .NET, see the following resources.

### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Azure REST API. By using these libraries, you can interact with REST API operations through familiar .NET paradigms. The client library methods for listing blobs use the following REST API operation:

- [List Blobs](/rest/api/storageservices/list-blobs) (REST API)

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]

### See also

- [Enumerating Blob Resources](/rest/api/storageservices/enumerating-blob-resources)
- [Blob versioning](versioning-overview.md)

[!INCLUDE [storage-dev-guide-next-steps-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-next-steps-dotnet.md)]

