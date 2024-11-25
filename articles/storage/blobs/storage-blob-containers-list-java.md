---
title: List blob containers with Java
titleSuffix: Azure Storage
description: Learn how to list blob containers in your Azure Storage account using the Java client library.
services: storage
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 08/05/2024
ms.author: pauljewell
ms.devlang: java
ms.custom: devx-track-java, devguide-java, devx-track-extended-java
---

# List blob containers with Java

[!INCLUDE [storage-dev-guide-selector-list-container](../../../includes/storage-dev-guides/storage-dev-guide-selector-list-container.md)]

When you list the containers in an Azure Storage account from your code, you can specify several options to manage how results are returned from Azure Storage. This article shows how to list containers using the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme).

[!INCLUDE [storage-dev-guide-prereqs-java](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-java.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-java](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-java.md)]

#### Add import statements

Add the following `import` statements:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerList.java" id="Snippet_Imports":::

#### Authorization

The authorization mechanism must have the necessary permissions to list blob containers. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Contributor** or higher. To learn more, see the authorization guidance for [List Containers (REST API)](/rest/api/storageservices/list-containers2#authorization).

[!INCLUDE [storage-dev-guide-create-client-java](../../../includes/storage-dev-guides/storage-dev-guide-create-client-java.md)]

## About container listing options

When listing containers from your code, you can specify options to manage how results are returned from Azure Storage. You can specify the number of results to return in each set of results, and then retrieve the subsequent sets. You can also filter the results by a prefix, and return container metadata with the results. These options are described in the following sections.

To list containers in a storage account, call the following method:

- [listBlobContainers](/java/api/com.azure.storage.blob.blobserviceclient)

This method returns an iterable of type [BlobContainerItem](/java/api/com.azure.storage.blob.models.blobcontaineritem). Containers are ordered lexicographically by name.

### Manage how many results are returned

By default, a listing operation returns up to 5000 results at a time. To return a smaller set of results, provide a nonzero value for the size of the page of results to return. You can set this value using the following method:

- [ListBlobContainersOptions.setMaxResultsPerPage](/java/api/com.azure.storage.blob.models.listblobcontainersoptions#com-azure-storage-blob-models-listblobcontainersoptions-setmaxresultsperpage(java-lang-integer))

The examples presented in this article show you how to return results in pages. To learn more about pagination concepts, see [Pagination with the Azure SDK for Java](/azure/developer/java/sdk/pagination).

### Filter results with a prefix

To filter the list of containers, specify a string for the `prefix` parameter. The prefix string can include one or more characters. Azure Storage then returns only the containers whose names start with that prefix. You can set this value using the following method:

- [ListBlobContainersOptions.setPrefix](/java/api/com.azure.storage.blob.models.listblobcontainersoptions#com-azure-storage-blob-models-listblobcontainersoptions-setprefix(java-lang-string))

### Include container metadata

To include container metadata with the results, create a `BlobContainerListDetails` instance and pass `true` to the following method:

- [BlobContainerListDetails.setRetrieveMetadata](/java/api/com.azure.storage.blob.models.blobcontainerlistdetails#com-azure-storage-blob-models-blobcontainerlistdetails-setretrievemetadata(boolean))

Then pass the `BlobContainerListDetails` object to the following method:

- [ListBlobContainersOptions.setDetails](/java/api/com.azure.storage.blob.models.listblobcontainersoptions#com-azure-storage-blob-models-listblobcontainersoptions-setdetails(com-azure-storage-blob-models-blobcontainerlistdetails))

### Include deleted containers

To include soft-deleted containers with the results, create a `BlobContainerListDetails` instance and pass `true` to the following method:

- [BlobContainerListDetails.setRetrieveDeleted](/java/api/com.azure.storage.blob.models.blobcontainerlistdetails#com-azure-storage-blob-models-blobcontainerlistdetails-setretrievedeleted(boolean))

Then pass the `BlobContainerListDetails` object to the following method:

- [ListBlobContainersOptions.setDetails](/java/api/com.azure.storage.blob.models.listblobcontainersoptions#com-azure-storage-blob-models-listblobcontainersoptions-setdetails(com-azure-storage-blob-models-blobcontainerlistdetails))

## Code examples

The following example lists containers and filters the results by a specified prefix:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerList.java" id="Snippet_ListContainers":::

You can also return a smaller set of results, by specifying the size of the page of results to return:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerList.java" id="Snippet_ListContainersWithPaging":::

## Resources

To learn more about listing containers using the Azure Blob Storage client library for Java, see the following resources.

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerList.java)

### REST API operations

The Azure SDK for Java contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Java paradigms. The client library methods for listing containers use the following REST API operation:

- [List Containers](/rest/api/storageservices/list-containers2) (REST API)

[!INCLUDE [storage-dev-guide-resources-java](../../../includes/storage-dev-guides/storage-dev-guide-resources-java.md)]

## See also

- [Enumerating Blob Resources](/rest/api/storageservices/enumerating-blob-resources)

[!INCLUDE [storage-dev-guide-next-steps-java](../../../includes/storage-dev-guides/storage-dev-guide-next-steps-java.md)]
