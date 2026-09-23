---
title: List blobs with Go
titleSuffix: Azure Storage
description: Learn how to list blobs in your storage account using the Azure Storage client library for Go. Code examples show how to list blobs in a flat listing, or how to list blobs hierarchically, as though they were organized into directories or folders.
services: storage
author: stevenmatthew

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 08/05/2024
ms.author: shaas
ms.devlang: golang
ms.custom: devx-track-go, devguide-go
# Customer intent: As a Go developer, I want to list blobs in my Azure Storage account so that I can retrieve and manage my data efficiently, using both flat and hierarchical listing options as needed.
---

# List blobs with Go

[!INCLUDE [storage-dev-guide-selector-list-blob](../../../includes/storage-dev-guides/storage-dev-guide-selector-list-blob.md)]

This article shows how to list blobs by using the [Azure Storage client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme).

[!INCLUDE [storage-dev-guide-prereqs-go](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-go.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-go](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-go.md)]

#### Authorization

The authorization mechanism must have the necessary permissions to upload a blob. For authorization with Microsoft Entra ID (recommended), you need the Azure RBAC built-in role **Storage Blob Data Reader** or higher. To learn more, see the authorization guidance for [List Blobs (REST API)](/rest/api/storageservices/list-blobs#authorization).

## About blob listing options

When you list blobs from your code, you can specify many options to manage how results are returned from Azure Storage. You can specify the number of results to return in each set of results, and then retrieve the subsequent sets. You can specify a prefix to return blobs whose names begin with that character or string. You can list blobs in a flat listing structure or hierarchically. A hierarchical listing returns blobs as though they were organized into folders.

To list the blobs in a container by using a flat listing, call the following method:

- [NewListBlobsFlatPager](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.NewListBlobsFlatPager)

To list the blobs in a container by using a hierarchical listing, call the following method from a container client object:

- [NewListBlobsHierarchyPager](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/container#Client.NewListBlobsHierarchyPager)

### Manage how many results are returned

By default, a listing operation returns up to 5000 results at a time. To return a smaller set of results, provide a nonzero value for the `MaxResults` field in [ListBlobsFlatOptions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/container#ListBlobsFlatOptions) or [ListBlobsHierarchyOptions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/container#ListBlobsFlatOptions).

### Filter results with a prefix

To filter the list of blobs returned, specify a string or character for the `Prefix` field in [ListBlobsFlatOptions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/container#ListBlobsFlatOptions) or [ListBlobsHierarchyOptions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/container#ListBlobsFlatOptions). The prefix string can include one or more characters. Azure Storage then returns only the blobs whose names start with that prefix.

### Include blob metadata or other information

To include blob metadata with the results, set the `Metadata` field to `true` as part of [ListBlobsInclude](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/container#ListBlobsInclude). Azure Storage includes metadata with each blob returned, so you don't need to fetch the blob metadata separately.

See [ListBlobsInclude](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/container#ListBlobsInclude) for additional options to include snapshots, versions, blob index tags, and other information with the results.

### Flat listing versus hierarchical listing

Blobs in Azure Storage are organized in a flat paradigm, rather than a hierarchical paradigm (like a classic file system). However, you can organize blobs into *virtual directories* in order to mimic a folder structure. A virtual directory forms part of the name of the blob and is indicated by the delimiter character.

To organize blobs into virtual directories, use a delimiter character in the blob name. The default delimiter character is a forward slash (/), but you can specify any character as the delimiter.

If you name your blobs using a delimiter, then you can choose to list blobs hierarchically. For a hierarchical listing operation, Azure Storage returns any virtual directories and blobs beneath the parent object. You can call the listing operation recursively to traverse the hierarchy, similar to how you would traverse a classic file system programmatically.

> [!NOTE]
> Blob snapshots cannot be listed in a hierarchical listing operation.

## Use a flat listing

By default, a listing operation returns blobs in a flat listing. In a flat listing, blobs aren't organized by virtual directory.

The following example lists the blobs in the specified container using a flat listing. This example includes blob snapshots and blob versions, if they exist:

:::code language="go" source="~/blob-devguide-go/cmd/list-blobs/list_blobs.go" id="snippet_list_blobs_flat":::

Sample output is similar to:

```console
List blobs flat:
file4.txt
folderA/file1.txt
folderA/file2.txt
folderA/folderB/file3.txt
```

The following example lists blobs in a container that begin with a specific prefix:

:::code language="go" source="~/blob-devguide-go/cmd/list-blobs/list_blobs.go" id="snippet_list_blobs_flat_options":::

When you pass a prefix string of "sample", the output is similar to:

```console
List blobs with prefix:
sample-blob1.txt
sample-blob2.txt
sample-blob3.txt
```

> [!NOTE]
> The sample output shown assumes that you have a storage account with a flat namespace. If you enable the hierarchical namespace feature for your storage account, directories aren't virtual. Instead, they're concrete, independent objects. As a result, directories appear in the list as zero-length blobs.
>
> For an alternative listing option when working with a hierarchical namespace, see [NewListPathsPager](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azdatalake/filesystem#Client.NewListPathsPager).

## Use a hierarchical listing

When you call a listing operation hierarchically, Azure Storage returns the virtual directories and blobs at the first level of the hierarchy.

To list blobs hierarchically, use the following method:

- [NewListBlobsHierarchyPager](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/container#Client.NewListBlobsHierarchyPager)

The following example lists the blobs in the specified container using a hierarchical listing. In this example, the prefix parameter is initially set to an empty string to list all blobs in the container. The example then calls the listing operation recursively to traverse the virtual directory hierarchy and list blobs. 

:::code language="go" source="~/blob-devguide-go/cmd/list-blobs/list_blobs.go" id="snippet_list_blobs_hierarchical":::

Sample output is similar to:

```console
Virtual directory prefix: folderA/
Blob: folderA/file1.txt
Blob: folderA/file2.txt
Blob: folderA/file3.txt
Virtual directory prefix: folderA/folderB/
Blob: folderA/folderB/file1.txt
Blob: folderA/folderB/file2.txt
Blob: folderA/folderB/file3.txt
```

[!INCLUDE [storage-dev-guide-code-samples-note-go](../../../includes/storage-dev-guides/storage-dev-guide-code-samples-note-go.md)]

## List blobs in Apache Arrow format (preview)

> [!IMPORTANT]
> Listing blobs in Apache Arrow format is currently in **PREVIEW**. This scenario requires a **beta (preview) version** of the Azure Storage client module for Go (for example, `github.com/Azure/azure-sdk-for-go/sdk/storage/azblob` **v1.8.1-beta.1** or later preview release). Preview features are provided without a service-level agreement and aren't recommended for production workloads. Some features might not be supported, or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This capability is built on the existing `List Blobs` API. Instead of using the default XML, it uses the compact, columnar [Apache Arrow](https://arrow.apache.org/) format as the response format on the wire. You enable it by setting a single option on the container listing call. The Go SDK decodes Apache Arrow behind the scenes and still returns the same `BlobItem` values. This approach improves listing throughput and reduces client-side CPU when enumerating large containers. It preserves the response contract that applications rely on.

> [!WARNING]
> Listing blobs in Apache Arrow format isn't supported on storage accounts that have hierarchical namespace (Azure Data Lake Storage) enabled.

To request Apache Arrow-formatted results, set the `ResponseFormat` field of [ListBlobsFlatOptions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob@v1.8.1-beta.1/container#ListBlobsFlatOptions) to [StorageResponseFormatArrow](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob@v1.8.1-beta.1/container#StorageResponseFormat), then pass the options to [NewListBlobsFlatPager](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob@v1.8.1-beta.1#Client.NewListBlobsFlatPager). When using Apache Arrow output, you can also set the `StartFrom` and `EndBefore` fields to control the range of paths returned.

The following example lists the blobs in a container and requests the results in Apache Arrow format:

```go
import (
    "context"

    "github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
    "github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
    "github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/container"
)

pager := client.NewListBlobsFlatPager("sample-container", &azblob.ListBlobsFlatOptions{
    Prefix:         to.Ptr("folderA/"),
    ResponseFormat: container.StorageResponseFormatArrow,
})

for pager.More() {
    resp, err := pager.NextPage(context.TODO())
    handleError(err)

    for _, blob := range resp.Segment.BlobItems {
        fmt.Println(*blob.Name)
    }
}
```

## Resources

To learn more about how to list blobs using the Azure Blob Storage client module for Go, see the following resources.

### Code samples

- View [code samples](https://github.com/Azure-Samples/blob-storage-devguide-go/blob/main/cmd/list-blobs/list_blobs.go) from this article (GitHub)

### REST API operations

The Azure SDK for Go contains libraries that build on top of the Azure REST API. By using these libraries, you can interact with REST API operations through familiar Go paradigms. The client library methods for listing blobs use the following REST API operation:

- [List Blobs](/rest/api/storageservices/list-blobs) (REST API)

[!INCLUDE [storage-dev-guide-resources-go](../../../includes/storage-dev-guides/storage-dev-guide-resources-go.md)]

### See also

- [Enumerating Blob Resources](/rest/api/storageservices/enumerating-blob-resources)
- [Blob versioning](versioning-overview.md)

[!INCLUDE [storage-dev-guide-next-steps-go](../../../includes/storage-dev-guides/storage-dev-guide-next-steps-go.md)]

