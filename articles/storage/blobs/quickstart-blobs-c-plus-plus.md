---
title: "Quickstart: Azure Blob storage library v12 - C++"
description: In this quickstart, you learn how to use the Azure Blob storage client library version 12 for C++ to create a container and a blob in Blob (object) storage. Next, you learn how to download the blob to your local computer, and how to list all of the blobs in a container.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 09/30/2020
ms.service: storage
ms.subservice: blobs
ms.topic: quickstart
---

# Quickstart: Azure Blob storage client library v12 for C++

Get started with the Azure Blob storage client library v12 for C++. Azure Blob storage is Microsoft's object storage solution for the cloud. Follow steps to install the package and try out example code for basic tasks. Blob storage is optimized for storing massive amounts of unstructured data.

Use the Azure Blob storage client library v12 for C++ to:

- Create a container
- Upload a blob to Azure Storage
- List all of the blobs in a container
- Download the blob to your local computer
- Delete a container

Additional resources:

- [API reference documentation](https://azure.github.io/azure-sdk-for-cpp/storage.html)
- [Library source code](https://github.com/Azure/azure-sdk-for-cpp/tree/master/sdk/storage)
- [Package (Vcpkg)](https://www.nuget.org/packages/Azure.Storage.Blobs)
- [Samples](https://docs.microsoft.com/azure/storage/common/storage-samples-c-plus-plus?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#blob-samples)

[!INCLUDE [storage-multi-protocol-access-preview](../../../includes/storage-multi-protocol-access-preview.md)]

## Prerequisites

- [Azure subscription](https://azure.microsoft.com/free/)
- [Azure storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account)
- [Vcpkg - C and C++ package manager](https://github.com/microsoft/vcpkg/blob/master/docs/index.md)
- [LibCurl](https://curl.haxx.se/libcurl/)
- [LibXML2](http://www.xmlsoft.org/)

## Setting up

This section walks you through preparing a project to work with the Azure Blob storage client library v12 for C++.

### Install the packages

Install the Azure Blob storage client library for C++ package by using the `vcpkg install` command.

```console
vcpkg install azure-storage-blobs:x64-windows
```

### Create the project

In Visual Studio, create a C++ console application named *BlobQuickstartV12*.

### Set up the app framework

From the project directory:

1. Open the *BlobQuickstartV12.cpp* file in Visual Studio
1. Remove the ` std::wcout << "Hello, World!" << std::endl;` statement
1. Add `#include` statements

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_Includes":::

[!INCLUDE [storage-quickstart-credentials-include](../../../includes/storage-quickstart-credentials-include.md)]

## Object model

Azure Blob storage is optimized for storing massive amounts of unstructured data. Unstructured data is data that does not adhere to a particular data model or definition, such as text or binary data. Blob storage offers three types of resources:

- The storage account
- A container in the storage account
- A blob in the container

The following diagram shows the relationship between these resources.

![Diagram of Blob storage architecture](./media/storage-blobs-introduction/blob1.png)

Use the following C++ classes to interact with these resources:

- [BlobServiceClient](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_service_client.html): The `BlobServiceClient` class allows you to manipulate Azure Storage resources and blob containers.
- [BlobContainerClient](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_container_client.html): The `BlobContainerClient` class allows you to manipulate Azure Storage containers and their blobs.
- [BlobClient](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_client.html): The `BlobClient` class allows you to manipulate Azure Storage blobs.
- [BlockBlobClient](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_block_blob_client.html): The `BlockBlobClient` class 

## Code examples

These example code snippets show you how to perform the following with the Azure Blob storage client library for C++:

- [Get the connection string](#get-the-connection-string)
- [Create a container](#create-a-container)
- [Upload blobs to a container](#upload-blobs-to-a-container)
- [List the blobs in a container](#list-the-blobs-in-a-container)
- [Download blobs](#download-blobs)
- [Delete a container](#delete-a-container)

### Get the connection string

The code below retrieves the connection string for the storage account from the environment variable created in the [Configure your storage connection string](#configure-your-storage-connection-string) section.

Add this code inside `main()`:

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_ConnectionString":::

### Create a container

Create an instance of the [BlobContainerClient](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_container_client.html) class by calling the [CreateFromConnectionString](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_container_client.html#ad103d1e3a7ce7c53a82da887d12ce6fe) function. Then call [Create](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_container_client.html#a22a1e001068a4ec52bb1b6bd8b52c047) to create the actual container in your storage account.

> [!IMPORTANT]
> Container names must be lowercase. For more information about naming containers and blobs, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

Add this code to the end of `main()`:

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_CreateContainer":::

### Upload blobs to a container

The following code snippet:

1. Declares a string containing "Hello Azure!".
1. Gets a reference to a [BlockBlobClient](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_block_blob_client.html) object by calling the [GetBlockBlobClient](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_container_client.html#acd8c68e3f37268fde0010dd478ff048f) function on the container from the [Create a container](#create-a-container) section.
1. Uploads the string to the blob by calling the [​Upload​From](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_block_blob_client.html#af93af7e37f8806e39481596ef253f93d) function. This function creates the blob if it doesn't already exist, or updates it if it does.

Add this code to the end of `main()`:

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_UploadBlob":::

### List the blobs in a container

List the blobs in the container by calling the [ListBlobsFlatSegment](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_container_client.html#ac7712bc46909dc061d6bf554b496550c) function. In this case, only one blob has been added to the container, so the listing operation returns just that one blob.

Add this code to the end of `main()`:

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_ListBlobs":::

### Download blobs

Get the properties of the uploaded blob. Then, declare and resize a new `std::string` object by using the properties of the uploaded blob. Download the previously created blob into the new `std::string` object by calling the [​DownloadTo](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_client.html#aa844f37a8c216f3cb0f27912b114c4d2) function in the [BlobClient](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_client.html) base class. Finally, display the downloaded blob data.

Add this code to the end of `main()`:

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_DownloadBlob":::

### Delete a Blob

The following code deletes the blob from the Azure Blob storage container by calling the [BlobClient.Delete](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_client.html#a621eabcc8d23893ca1eb106494198615) function.

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_DeleteBlob":::

### Delete a container

The following code cleans up the resources the app created by deleting the entire container by using [BlobContainerClient.​Delete](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_container_client.html#aa6b1db52697ae92e9a1227e2e02a5178).

Add this code to the end of `main()`:

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_DeleteContainer":::

## Run the code

This app creates a string in memory and uploads it to a text file in Blob storage. The example then lists the blobs in the container, downloads the file, and displays the file contents.

The output of the app is similar to the following example:

```output
Azure Blob storage v12 - C++ quickstart sample
Creating container: myblobcontainer
Uploading blob: blob.txt
Listing blobs...
Blob name: blob.txt
Downloaded blob contents: Hello Azure!
Deleting blob: blob.txt
Deleting container: myblobcontainer
```

## Next steps

In this quickstart, you learned how to upload, download, and list blobs using C++.

To see Blob storage sample apps, continue to:

> [!div class="nextstepaction"]
> [Azure Blob storage SDK v12 for C++ sample](https://github.com/Azure/azure-sdk-for-cpp/tree/master/sdk/storage/azure-storage-blobs/sample)
