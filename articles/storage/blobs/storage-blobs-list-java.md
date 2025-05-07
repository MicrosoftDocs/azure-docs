---
title: List blobs with Java
titleSuffix: Azure Storage
description: Learn how to list blobs in your storage account using the Azure Storage client library for Java. Code examples show how to list blobs in a flat listing, or how to list blobs hierarchically, as though they were organized into directories or folders.
services: storage
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 08/05/2024
ms.author: pauljewell
ms.devlang: java
ms.custom: devx-track-java, devguide-java, devx-track-extended-java
---

# List blobs with Java

[!INCLUDE [storage-dev-guide-selector-list-blob](../../../includes/storage-dev-guides/storage-dev-guide-selector-list-blob.md)]

This article shows how to list blobs with the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme).

[!INCLUDE [storage-dev-guide-prereqs-java](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-java.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-java](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-java.md)]

#### Add import statements

Add the following `import` statements:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobList.java" id="Snippet_Imports":::

#### Authorization

The authorization mechanism must have the necessary permissions to list a blob. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Reader** or higher. To learn more, see the authorization guidance for [List Blobs (REST API)](/rest/api/storageservices/list-blobs#authorization).

[!INCLUDE [storage-dev-guide-create-client-java](../../../includes/storage-dev-guides/storage-dev-guide-create-client-java.md)]

## About blob listing options

When you list blobs from your code, you can specify options to manage how results are returned from Azure Storage. You can specify the number of results to return in each set of results, and then retrieve the subsequent sets. You can specify a prefix to return blobs whose names begin with that character or string. And you can list blobs in a flat listing structure, or hierarchically. A hierarchical listing returns blobs as though they were organized into folders.

To list the blobs in a storage account, call one of these methods:

- [listBlobs](/java/api/com.azure.storage.blob.BlobContainerClient)
- [listBlobsByHierarchy](/java/api/com.azure.storage.blob.BlobContainerClient)

### Manage how many results are returned

By default, a listing operation returns up to 5000 results at a time, but you can specify the number of results that you want each listing operation to return. The examples presented in this article show you how to return results in pages. To learn more about pagination concepts, see [Pagination with the Azure SDK for Java](/azure/developer/java/sdk/pagination).

### Filter results with a prefix

To filter the list of blobs, pass a string as the `prefix` parameter to [ListBlobsOptions.setPrefix(String prefix)](/java/api/com.azure.storage.blob.models.listblobsoptions). The prefix string can include one or more characters. Azure Storage then returns only the blobs whose names start with that prefix.

### Flat listing versus hierarchical listing

Blobs in Azure Storage are organized in a flat paradigm, rather than a hierarchical paradigm (like a classic file system). However, you can organize blobs into *virtual directories* in order to mimic a folder structure. A virtual directory forms part of the name of the blob and is indicated by the delimiter character.

To organize blobs into virtual directories, use a delimiter character in the blob name. The default delimiter character is a forward slash (/), but you can specify any character as the delimiter.

If you name your blobs using a delimiter, then you can choose to list blobs hierarchically. For a hierarchical listing operation, Azure Storage returns any virtual directories and blobs beneath the parent object. You can call the listing operation recursively to traverse the hierarchy, similar to how you would traverse a classic file system programmatically.

## Use a flat listing

By default, a listing operation returns blobs in a flat listing. In a flat listing, blobs aren't organized by virtual directory.

The following example lists the blobs in the specified container using a flat listing:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobList.java" id="Snippet_ListBlobsFlat":::

Sample output is similar to:

```console
List blobs flat:
Name: file4.txt
Name: folderA/file1.txt
Name: folderA/file2.txt
Name: folderA/folderB/file3.txt
```

You can also specify options to filter list results or show additional information. The following example lists blobs with a specified prefix, and also lists deleted blobs:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobList.java" id="Snippet_ListBlobsFlatOptions":::

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

> [!NOTE]
> The sample output shown assumes that you have a storage account with a flat namespace. If you've enabled the hierarchical namespace feature for your storage account, directories are not virtual. Instead, they are concrete, independent objects. As a result, directories appear in the list as zero-length blobs.</br></br>For an alternative listing option when working with a hierarchical namespace, see [List directory contents (Azure Data Lake Storage)](data-lake-storage-directory-file-acl-java.md#list-directory-contents).

## Use a hierarchical listing

When you call a listing operation hierarchically, Azure Storage returns the virtual directories and blobs at the first level of the hierarchy.

To list blobs hierarchically, use the following method:

- [listBlobsByHierarchy](/java/api/com.azure.storage.blob.BlobContainerClient)

The following example lists the blobs in the specified container using a hierarchical listing:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobList.java" id="Snippet_ListBlobsHierarchical":::

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

## Resources

To learn more about how to list blobs using the Azure Blob Storage client library for Java, see the following resources.

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobList.java)

### REST API operations

The Azure SDK for Java contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Java paradigms. The client library methods for listing blobs use the following REST API operation:

- [List Blobs](/rest/api/storageservices/list-blobs) (REST API)

[!INCLUDE [storage-dev-guide-resources-java](../../../includes/storage-dev-guides/storage-dev-guide-resources-java.md)]

### See also

- [Enumerating Blob Resources](/rest/api/storageservices/enumerating-blob-resources)
- [Blob versioning](versioning-overview.md)

[!INCLUDE [storage-dev-guide-next-steps-java](../../../includes/storage-dev-guides/storage-dev-guide-next-steps-java.md)]