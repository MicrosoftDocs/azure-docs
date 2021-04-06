---
title: Use .NET to manage data in Azure Data Lake Storage Gen2
description: Use the Azure Storage client library for .NET to manage directories and files in storage accounts that has hierarchical namespace enabled.
author: normesta
ms.service: storage
ms.date: 02/17/2021
ms.author: normesta
ms.topic: how-to
ms.subservice: data-lake-storage-gen2
ms.reviewer: prishet
ms.custom: devx-track-csharp
---

# Use .NET to manage directories and files in Azure Data Lake Storage Gen2

This article shows you how to use .NET to create and manage directories and files in storage accounts that have a hierarchical namespace.

To learn about how to get, set, and update the access control lists (ACL) of directories and files, see [Use .NET to manage ACLs in Azure Data Lake Storage Gen2](data-lake-storage-acl-dotnet.md).

[Package (NuGet)](https://www.nuget.org/packages/Azure.Storage.Files.DataLake) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake) | [API reference](/dotnet/api/azure.storage.files.datalake) | [Gen1 to Gen2 mapping](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/GEN1_GEN2_MAPPING.md) | [Give Feedback](https://github.com/Azure/azure-sdk-for-net/issues)

## Prerequisites

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- A storage account that has hierarchical namespace enabled. Follow [these](create-data-lake-storage-account.md) instructions to create one.

## Set up your project

To get started, install the [Azure.Storage.Files.DataLake](https://www.nuget.org/packages/Azure.Storage.Files.DataLake/) NuGet package.

For more information about how to install NuGet packages, see [Install and manage packages in Visual Studio using the NuGet Package Manager](/nuget/consume-packages/install-use-packages-visual-studio).

Then, add these using statements to the top of your code file.

```csharp
using Azure;
using Azure.Storage.Files.DataLake;
using Azure.Storage.Files.DataLake.Models;
using Azure.Storage;
using System.IO;

```

## Connect to the account

To use the snippets in this article, you'll need to create a [DataLakeServiceClient](/dotnet/api/azure.storage.files.datalake.datalakeserviceclient) instance that represents the storage account. 

### Connect by using an account key

This is the easiest way to connect to an account. 

This example creates a [DataLakeServiceClient](/dotnet/api/azure.storage.files.datalake.datalakeserviceclient) instance by using an account key.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Authorize_DataLake.cs" id="Snippet_AuthorizeWithKey":::

### Connect by using Azure Active Directory (Azure AD)

You can use the [Azure identity client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/identity/Azure.Identity) to authenticate your application with Azure AD.

This example creates a [DataLakeServiceClient](/dotnet/api/azure.storage.files.datalake.datalakeserviceclient) instance by using a client ID, a client secret, and a tenant ID.  To get these values, see [Acquire a token from Azure AD for authorizing requests from a client application](../common/storage-auth-aad-app.md).

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Authorize_DataLake.cs" id="Snippet_AuthorizeWithAAD":::

> [!NOTE]
> For more examples, see the [Azure identity client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/identity/Azure.Identity) documentation..

## Create a container

A container acts as a file system for your files. You can create one by calling the [DataLakeServiceClient.CreateFileSystem](/dotnet/api/azure.storage.files.datalake.datalakeserviceclient.createfilesystemasync) method.

This example creates a container named `my-file-system`. 

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD_DataLake.cs" id="Snippet_CreateContainer":::

## Create a directory

Create a directory reference by calling the [DataLakeFileSystemClient.CreateDirectoryAsync](/dotnet/api/azure.storage.files.datalake.datalakefilesystemclient.createdirectoryasync) method.

This example adds a directory named `my-directory` to a container, and then adds a sub-directory named `my-subdirectory`. 

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD_DataLake.cs" id="Snippet_CreateDirectory":::

## Rename or move a directory

Rename or move a directory by calling the [DataLakeDirectoryClient.RenameAsync](/dotnet/api/azure.storage.files.datalake.datalakedirectoryclient.renameasync) method. Pass the path of the desired directory a parameter. 

This example renames a sub-directory to the name `my-subdirectory-renamed`.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD_DataLake.cs" id="Snippet_RenameDirectory":::

This example moves a directory named `my-subdirectory-renamed` to a sub-directory of a directory named `my-directory-2`. 

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD_DataLake.cs" id="Snippet_MoveDirectory":::

## Delete a directory

Delete a directory by calling the [DataLakeDirectoryClient.Delete](/dotnet/api/azure.storage.files.datalake.datalakedirectoryclient.delete) method.

This example deletes a directory named `my-directory`.  

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD_DataLake.cs" id="Snippet_DeleteDirectory":::

## Upload a file to a directory

First, create a file reference in the target directory by creating an instance of the [DataLakeFileClient](/dotnet/api/azure.storage.files.datalake.datalakefileclient) class. Upload a file by calling the [DataLakeFileClient.AppendAsync](/dotnet/api/azure.storage.files.datalake.datalakefileclient.appendasync) method. Make sure to complete the upload by calling the [DataLakeFileClient.FlushAsync](/dotnet/api/azure.storage.files.datalake.datalakefileclient.flushasync) method.

This example uploads a text file to a directory named `my-directory`. 

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD_DataLake.cs" id="Snippet_UploadFile":::

> [!TIP]
> If your file size is large, your code will have to make multiple calls to the [DataLakeFileClient.AppendAsync](/dotnet/api/azure.storage.files.datalake.datalakefileclient.appendasync). Consider using the [DataLakeFileClient.UploadAsync](/dotnet/api/azure.storage.files.datalake.datalakefileclient.uploadasync#Azure_Storage_Files_DataLake_DataLakeFileClient_UploadAsync_System_IO_Stream_) method instead. That way, you can upload the entire file in a single call.
>
> See the next section for an example.

## Upload a large file to a directory

Use the [DataLakeFileClient.UploadAsync](/dotnet/api/azure.storage.files.datalake.datalakefileclient.uploadasync#Azure_Storage_Files_DataLake_DataLakeFileClient_UploadAsync_System_IO_Stream_) method to upload large files without having to make multiple calls to the [DataLakeFileClient.AppendAsync](/dotnet/api/azure.storage.files.datalake.datalakefileclient.appendasync) method.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD_DataLake.cs" id="Snippet_UploadFileBulk":::

## Download from a directory 

First, create a [DataLakeFileClient](/dotnet/api/azure.storage.files.datalake.datalakefileclient) instance that represents the file that you want to download. Use the [DataLakeFileClient.ReadAsync](/dotnet/api/azure.storage.files.datalake.datalakefileclient.readasync)  method, and parse the return value to obtain a [Stream](/dotnet/api/system.io.stream) object. Use any .NET file processing API to save bytes from the stream to a file. 

This example uses a [BinaryReader](/dotnet/api/system.io.binaryreader) and a [FileStream](/dotnet/api/system.io.filestream) to save bytes to a file. 

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD_DataLake.cs" id="Snippet_DownloadBinaryFromDirectory":::

## List directory contents

List directory contents by calling the [FileSystemClient.GetPathsAsync](/dotnet/api/azure.storage.files.datalake.datalakefilesystemclient.getpathsasync) method, and then enumerating through the results.

This example, prints the names of each file that is located in a directory named `my-directory`.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD_DataLake.cs" id="Snippet_ListFilesInDirectory":::

## See also

- [API reference documentation](/dotnet/api/azure.storage.files.datalake)
- [Package (NuGet)](https://www.nuget.org/packages/Azure.Storage.Files.DataLake)
- [Samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake)
- [Gen1 to Gen2 mapping](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/GEN1_GEN2_MAPPING.md)
- [Known issues](data-lake-storage-known-issues.md#api-scope-data-lake-client-library)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-net/issues)