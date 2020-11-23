---
title: "Quickstart: Azure Blob Storage library v12 - C++"
description: In this quickstart, you learn how to use the Azure Blob Storage client library version 12 for C++ to create a container and a blob in Blob (object) storage. Next, you learn how to download the blob to your local computer, and how to list all of the blobs in a container.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 10/21/2020
ms.service: storage
ms.subservice: blobs
ms.topic: quickstart
---

# Quickstart: Azure Blob Storage client library v12 for C++

Get started with the Azure Blob Storage client library v12 for C++. Azure Blob Storage is Microsoft's object storage solution for the cloud. Follow steps to install the package and try out example code for basic tasks. Blob Storage is optimized for storing massive amounts of unstructured data.

Use the Azure Blob Storage client library v12 for C++ to:

- Create a container
- Upload a blob to Azure Storage
- List all of the blobs in a container
- Download the blob to your local computer
- Delete a container

Resources:

- [API reference documentation](https://azure.github.io/azure-sdk-for-cpp/storage.html)
- [Library source code](https://github.com/Azure/azure-sdk-for-cpp/tree/master/sdk/storage)
- [Samples](/azure/storage/common/storage-samples-c-plus-plus?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)

[!INCLUDE [storage-multi-protocol-access-preview](../../../includes/storage-multi-protocol-access-preview.md)]

## Prerequisites

- [Azure subscription](https://azure.microsoft.com/free/)
- [Azure storage account](/azure/storage/common/storage-quickstart-create-account)
- [C++ compiler](https://azure.github.io/azure-sdk/cpp_implementation.html#supported-platforms)
- [CMake](https://cmake.org/)
- [Vcpkg - C and C++ package manager](https://github.com/microsoft/vcpkg/blob/master/docs/index.md)
- [LibCurl](https://curl.haxx.se/libcurl/)
- [LibXML2](http://www.xmlsoft.org/)

## Setting up

This section walks you through preparing a project to work with the Azure Blob Storage client library v12 for C++.

### Install the packages

If you haven't already, install the LibCurl and LibXML2 packages by using the `vcpkg install` command.

```console
vcpkg.exe install libxml2:x64-windows curl:x64-windows
```

Follow the instructions on GitHub to acquire and build the [Azure SDK for C++](https://github.com/Azure/azure-sdk-for-cpp/).

### Create the project

In Visual Studio, create a new C++ console application for Windows called *BlobQuickstartV12*.

:::image type="content" source="./media/quickstart-blobs-c-plus-plus/vs-create-project.jpg" alt-text="Visual Studio dialog for configuring a new C++ Windows console app":::

Add the following libraries to the project:

- libcurl.lib
- libxml2.lib
- bcrypt.lib
- Crypt32.Lib
- WS2_32.Lib
- azure-core.lib
- azure-storage-common.lib
- azure-storage-blobs.lib

[!INCLUDE [storage-quickstart-credentials-include](../../../includes/storage-quickstart-credentials-include.md)]

## Object model

Azure Blob Storage is optimized for storing massive amounts of unstructured data. Unstructured data is data that doesn't adhere to a particular data model or definition, such as text or binary data. Blob Storage offers three types of resources:

- The storage account
- A container in the storage account
- A blob in the container

The following diagram shows the relationship between these resources.

![Diagram of Blob Storage architecture](./media/storage-blobs-introduction/blob1.png)

Use the following C++ classes to interact with these resources:

- [BlobServiceClient](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_service_client.html): The `BlobServiceClient` class allows you to manipulate Azure Storage resources and blob containers.
- [BlobContainerClient](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_container_client.html): The `BlobContainerClient` class allows you to manipulate Azure Storage containers and their blobs.
- [BlobClient](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_client.html): The `BlobClient` class allows you to manipulate Azure Storage blobs. It's the base class for all specialized blob classes.
- [BlockBlobClient](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_block_blob_client.html): The `BlockBlobClient` class allows you to manipulate Azure Storage block blobs.

## Code examples

These example code snippets show you how to do the following tasks with the Azure Blob Storage client library for C++:

- [Add include files](#add-include-files)
- [Get the connection string](#get-the-connection-string)
- [Create a container](#create-a-container)
- [Upload blobs to a container](#upload-blobs-to-a-container)
- [List the blobs in a container](#list-the-blobs-in-a-container)
- [Download blobs](#download-blobs)
- [Delete a container](#delete-a-container)

### Add include files

From the project directory:

1. Open the *BlobQuickstartV12.sln* solution file in Visual Studio
1. Inside Visual Studio, open the *BlobQuickstartV12.cpp* source file
1. Remove any code inside `main` that was autogenerated
1. Add `#include` statements

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_Includes":::

### Get the connection string

The code below retrieves the connection string for your storage account from the environment variable created in [Configure your storage connection string](#configure-your-storage-connection-string).

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
1. Gets a reference to a [BlockBlobClient](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_block_blob_client.html) object by calling [GetBlockBlobClient](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_container_client.html#acd8c68e3f37268fde0010dd478ff048f) on the container from the [Create a container](#create-a-container) section.
1. Uploads the string to the blob by calling the [​Upload​From](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_block_blob_client.html#af93af7e37f8806e39481596ef253f93d) function. This function creates the blob if it doesn't already exist, or updates it if it does.

Add this code to the end of `main()`:

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_UploadBlob":::

### List the blobs in a container

List the blobs in the container by calling the [ListBlobsFlatSegment](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_container_client.html#ac7712bc46909dc061d6bf554b496550c) function. Only one blob has been added to the container, so the operation returns just that blob.

Add this code to the end of `main()`:

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_ListBlobs":::

### Download blobs

Get the properties of the uploaded blob. Then, declare and resize a new `std::string` object by using the properties of the uploaded blob. Download the previously created blob into the new `std::string` object by calling the [​DownloadTo](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_client.html#aa844f37a8c216f3cb0f27912b114c4d2) function in the [BlobClient](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_client.html) base class. Finally, display the downloaded blob data.

Add this code to the end of `main()`:

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_DownloadBlob":::

### Delete a Blob

The following code deletes the blob from the Azure Blob Storage container by calling the [BlobClient.Delete](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_client.html#a621eabcc8d23893ca1eb106494198615) function.

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_DeleteBlob":::

### Delete a container

The following code cleans up the resources the app created by deleting the entire container by using [BlobContainerClient.​Delete](https://azuresdkdocs.blob.core.windows.net/$web/cpp/azure-storage-blobs/1.0.0-beta.2/class_azure_1_1_storage_1_1_blobs_1_1_blob_container_client.html#aa6b1db52697ae92e9a1227e2e02a5178).

Add this code to the end of `main()`:

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_DeleteContainer":::

## Run the code

This app creates a container and uploads a text file to Azure Blob Storage. The example then lists the blobs in the container, downloads the file, and displays the file contents. Finally, the app deletes the blob and the container.

The output of the app is similar to the following example:

```output
Azure Blob Storage v12 - C++ quickstart sample
Creating container: myblobcontainer
Uploading blob: blob.txt
Listing blobs...
Blob name: blob.txt
Downloaded blob contents: Hello Azure!
Deleting blob: blob.txt
Deleting container: myblobcontainer
```

## Next steps

In this quickstart, you learned how to upload, download, and list blobs using C++. You also learned how to create and delete an Azure Blob Storage container.

To see a C++ Blob Storage sample, continue to:

> [!div class="nextstepaction"]
> [Azure Blob Storage SDK v12 for C++ sample](https://github.com/Azure/azure-sdk-for-cpp/tree/master/sdk/storage/azure-storage-blobs/sample)
