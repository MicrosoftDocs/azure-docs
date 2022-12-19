---
title: List blobs with Python - Azure Storage
description: Learn how to list blobs in your storage account using the Azure Storage client library for Python. Code examples show how to list blobs in a flat listing, or how to list blobs hierarchically, as though they were organized into directories or folders.
services: storage
author: pauljewellmsft

ms.service: storage
ms.topic: how-to
ms.date: 11/16/2022
ms.author: pauljewell
ms.subservice: blobs
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# List blobs using the Azure Storage client library for Python

This article shows how to list blobs with the [Azure Storage client library for Python](/python/api/overview/azure/storage).

When you list blobs from your code, you can specify many options to manage how results are returned from Azure Storage. You can specify the number of results to return in each set of results, and then retrieve the subsequent sets. You can specify a prefix to return blobs whose names begin with that character or string. And you can list blobs in a flat listing structure, or hierarchically. A hierarchical listing returns blobs as though they were organized into folders.

## Understand blob listing options

To list the blobs in a storage account, call one of these methods:

- [BlobContainerClient.listBlobs](/java/api/com.azure.storage.blob.BlobContainerClient#com-azure-storage-blob-blobcontainerclient-listblobs())
- [BlobContainerClient.listBlobsByHierarchy](/java/api/com.azure.storage.blob.BlobContainerClient#com-azure-storage-blob-blobcontainerclient-listblobsbyhierarchy(java-lang-string))

### Flat listing versus hierarchical listing

Blobs in Azure Storage are organized in a flat paradigm, rather than a hierarchical paradigm (like a classic file system). However, you can organize blobs into *virtual directories* in order to mimic a folder structure. A virtual directory forms part of the name of the blob and is indicated by the delimiter character.

To organize blobs into virtual directories, use a delimiter character in the blob name. The default delimiter character is a forward slash (/), but you can specify any character as the delimiter.

If you name your blobs using a delimiter, then you can choose to list blobs hierarchically. For a hierarchical listing operation, Azure Storage returns any virtual directories and blobs beneath the parent object. You can call the listing operation recursively to traverse the hierarchy, similar to how you would traverse a classic file system programmatically.

If you've enabled the hierarchical namespace feature on your account, directories aren't virtual. Instead, they're concrete, independent objects. Therefore, directories appear in the list as zero-length blobs.

## Use a flat listing

By default, a listing operation returns blobs in a flat listing. In a flat listing, blobs aren't organized by virtual directory.

The following example lists the blobs in the specified container using a flat listing:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-list.py" id="Snippet_ListBlobsFlat":::

Sample output is similar to:

```console
List blobs flat:
Name: file4.txt
Name: folderA/file1.txt
Name: folderA/file2.txt
Name: folderA/folderB/file3.txt
```

You can also specify options to filter list results or show additional information. The following example lists blobs with a specified prefix, and also lists deleted blobs:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-list.py" id="Snippet_ListBlobsFlatOptions":::

Sample output is similar to:

```console
List blobs flat:
Page 1
Name: file4.txt, Is deleted? false
Name: file5-deleted.txt, Is deleted? true
Page 2
Name: folderA/file1.txt, Is deleted? false
Name: folderA/file2.txt, Is deleted? false
Page 3
Name: folderA/folderB/file3.txt, Is deleted? false
```

## Use a hierarchical listing

When you call a listing operation hierarchically, Azure Storage returns the virtual directories and blobs at the first level of the hierarchy.

To list blobs hierarchically, use the following method:

- [BlobContainerClient.listBlobsByHierarchy](/java/api/com.azure.storage.blob.BlobContainerClient#com-azure-storage-blob-blobcontainerclient-listblobsbyhierarchy(java-lang-string-com-azure-storage-blob-models-listblobsoptions-java-time-duration))

The following example lists the blobs in the specified container using a hierarchical listing:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-list.py" id="Snippet_ListBlobsHierarchical":::

Sample output is similar to:

```console
List blobs hierarchical:
Blob name: file4.txt
Virtual directory prefix: /folderA/
Blob name: folderA/file1.txt
Blob name: folderA/file2.txt
Virtual directory prefix: /folderA/folderB/
Blob name: folderA/folderB/file3.txt
```

> [!NOTE]
> Blob snapshots cannot be listed in a hierarchical listing operation.

## Next steps

- [View code sample in GitHub](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Python/blob-devguide/blob-devguide/blob-list.py)
- [List Blobs](/rest/api/storageservices/list-blobs) (REST API)
- [Enumerating Blob Resources](/rest/api/storageservices/enumerating-blob-resources)
- [Blob versioning](versioning-overview.md)