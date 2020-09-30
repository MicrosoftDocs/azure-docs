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

### Create the project

In Visual Studio, create a C++ application named *BlobQuickstartV12*.

### Install the packages

While still in the application directory, install the Azure Blob storage client library for C++ package by using the `vcpkg install` command.

```console
vcpkg install libxml2:x64-windows curl:x64-windows azure-storage-blobs:x64-windows
```

### Set up the app framework

From the project directory:

1. Open the *BlobQuickstartV12.cpp* file in your editor
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

- [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient): The `BlobServiceClient` class allows you to manipulate Azure Storage resources and blob containers.
- [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient): The `BlobContainerClient` class allows you to manipulate Azure Storage containers and their blobs.
- [BlobClient](/dotnet/api/azure.storage.blobs.blobclient): The `BlobClient` class allows you to manipulate Azure Storage blobs.
- [BlobDownloadInfo](/dotnet/api/azure.storage.blobs.models.blobdownloadinfo): The `BlobDownloadInfo` class represents the properties and content returned from downloading a blob.

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

Add this code inside the `main` method:

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_ConnectionString":::

### Create a container

Decide on a name for the new container. The code below appends a GUID value to the container name to ensure that it is unique.

> [!IMPORTANT]
> Container names must be lowercase. For more information about naming containers and blobs, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

Create an instance of the [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) class. Then, call the [CreateBlobContainerAsync](/dotnet/api/azure.storage.blobs.blobserviceclient.createblobcontainerasync) method to create the container in your storage account.

Add this code to the end of the `main` method:

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_CreateContainer":::

### Upload blobs to a container

The following code snippet:

1. Creates a text file in the local *data* directory.
1. Gets a reference to a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) object by calling the [GetBlobClient](/dotnet/api/azure.storage.blobs.blobcontainerclient.getblobclient) method on the container from the [Create a container](#create-a-container) section.
1. Uploads the local text file to the blob by calling the [​Upload​Async](/dotnet/api/azure.storage.blobs.blobclient.uploadasync#Azure_Storage_Blobs_BlobClient_UploadAsync_System_IO_Stream_System_Boolean_System_Threading_CancellationToken_) method. This method creates the blob if it doesn't already exist, and overwrites it if it does.

Add this code to the end of the `main` method:

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_UploadBlob":::

### List the blobs in a container

List the blobs in the container by calling the [GetBlobsAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.getblobsasync) method. In this case, only one blob has been added to the container, so the listing operation returns just that one blob.

Add this code to the end of the `main` method:

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_ListBlobs":::

### Download blobs

Download the previously created blob by calling the [​Download​Async](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.downloadasync) method. The example code adds a suffix of "DOWNLOADED" to the file name so that you can see both files in local file system.

Add this code to the end of the `main` method:

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_DownBlob":::

### Delete a Blob

The following code deletes the blob from the Azure Blob storage container.

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_DeleteBlob":::

### Delete a container

The following code cleans up the resources the app created by deleting the entire container by using [​DeleteAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.deleteasync). It also deletes the local files created by the app.

The app pauses for user input by calling `Console.ReadLine` before it deletes the blob, container, and local files. This is a good chance to verify that the resources were actually created correctly, before they are deleted.

Add this code to the end of the `main` method:

:::code language="cpp" source="~/azure-storage-snippets/blobs/quickstarts/C++/V12/BlobQuickstartV12/BlobQuickstartV12/BlobQuickstartV12.cpp" id="Snippet_DeleteContainer":::

## Run the code

This app creates a string in memory and uploads it to a text file in Blob storage. The example then lists the blobs in the container and downloads the file.

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
> [Azure Blob storage SDK v12 C++ samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples)

- For tutorials, samples, quick starts and other documentation, visit [Azure for .NET and .NET Core developers](/dotnet/azure/).
- To learn more about .NET Core, see [Get started with .NET in 10 minutes](https://www.microsoft.com/net/learn/get-started/).
