---
title: Use .NET to manage data in Azure Data Lake Storage Gen2
titleSuffix: Azure Storage
description: Use the Azure Storage client library for .NET to manage directories and files in storage accounts that have a hierarchical namespace enabled.
author: pauljewellmsft

ms.author: pauljewell
ms.service: azure-data-lake-storage
ms.date: 07/24/2023
ms.topic: how-to
ms.reviewer: prishet
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-dotnet
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

## Authorize access and connect to data resources

To work with the code examples in this article, you need to create an authorized [DataLakeServiceClient](/dotnet/api/azure.storage.files.datalake.datalakeserviceclient) instance that represents the storage account. You can authorize a `DataLakeServiceClient` object using Microsoft Entra ID, an account access key, or a shared access signature (SAS).

<a name='azure-ad'></a>

### [Microsoft Entra ID](#tab/azure-ad)

You can use the [Azure identity client library for .NET](/dotnet/api/overview/azure/identity-readme) to authenticate your application with Microsoft Entra ID.

Create a [DataLakeServiceClient](/dotnet/api/azure.storage.files.datalake.datalakeserviceclient) instance and pass in a new instance of the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) class.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Authorize_DataLake.cs" id="Snippet_AuthorizeWithAAD":::

To learn more about using `DefaultAzureCredential` to authorize access to data, see [How to authenticate .NET applications with Azure services](/dotnet/azure/sdk/authentication#defaultazurecredential).

### [SAS token](#tab/sas-token)

To use a shared access signature (SAS) token, provide the token as a string and initialize a [DataLakeServiceClient](/dotnet/api/azure.storage.files.datalake.datalakeserviceclient) object. If your account URL includes the SAS token, omit the credential parameter.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Authorize_DataLake.cs" id="Snippet_AuthorizeWithSAS":::

To learn more about generating and managing SAS tokens, see the following article:

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md?toc=/azure/storage/blobs/toc.json)

### [Account key](#tab/account-key)

You can authorize access to data using your account access keys (Shared Key). This example creates a [DataLakeServiceClient](/dotnet/api/azure.storage.files.datalake.datalakeserviceclient) instance that is authorized with the account key.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Authorize_DataLake.cs" id="Snippet_AuthorizeWithKey":::

[!INCLUDE [storage-shared-key-caution](../../../includes/storage-shared-key-caution.md)]

---

## Create a container

A container acts as a file system for your files. You can create a container by using the following method:

- [DataLakeServiceClient.CreateFileSystem](/dotnet/api/azure.storage.files.datalake.datalakeserviceclient.createfilesystemasync)

The following code example creates a container and returns a [DataLakeFileSystemClient](/dotnet/api/azure.storage.files.datalake.datalakefilesystemclient) object for later use:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD_DataLake.cs" id="Snippet_CreateContainer":::

## Create a directory

You can create a directory reference in the container by using the following method:

- [DataLakeFileSystemClient.CreateDirectoryAsync](/dotnet/api/azure.storage.files.datalake.datalakefilesystemclient.createdirectoryasync)

The following code example adds a directory to a container, then adds a subdirectory and returns a [DataLakeDirectoryClient](/dotnet/api/azure.storage.files.datalake.datalakedirectoryclient) object for later use:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD_DataLake.cs" id="Snippet_CreateDirectory":::

## Rename or move a directory

You can rename or move a directory by using the following method:

- [DataLakeDirectoryClient.RenameAsync](/dotnet/api/azure.storage.files.datalake.datalakedirectoryclient.renameasync)

Pass the path of the desired directory as a parameter. The following code example shows how to rename a subdirectory:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD_DataLake.cs" id="Snippet_RenameDirectory":::

The following code example shows how to move a subdirectory from one directory to a different directory:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD_DataLake.cs" id="Snippet_MoveDirectory":::

## Upload a file to a directory

You can upload content to a new or existing file by using the following method:

- [DataLakeFileClient.UploadAsync](/dotnet/api/azure.storage.files.datalake.datalakefileclient.uploadasync)

The following code example shows how to upload a local file to a directory using the `UploadAsync` method:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD_DataLake.cs" id="Snippet_UploadFile":::

You can use this method to create and upload content to a new file, or you can set the `overwrite` parameter to `true` to overwrite an existing file.

## Append data to a file

You can upload data to be appended to a file by using the following method:

- [DataLakeFileClient.AppendAsync](/dotnet/api/azure.storage.files.datalake.datalakefileclient.appendasync)

The following code example shows how to append data to the end of a file using these steps:

- Create a [DataLakeFileClient](/dotnet/api/azure.storage.files.datalake.datalakefileclient) object to represent the file resource you're working with. 
- Upload data to the file using the  [DataLakeFileClient.AppendAsync](/dotnet/api/azure.storage.files.datalake.datalakefileclient.appendasync) method.
- Complete the upload by calling the [DataLakeFileClient.FlushAsync](/dotnet/api/azure.storage.files.datalake.datalakefileclient.flushasync) method to write the previously uploaded data to the file.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD_DataLake.cs" id="Snippet_AppendDataToFile":::

## Download from a directory

The following code example shows how to download a file from a directory to a local file using these steps:

- Create a [DataLakeFileClient](/dotnet/api/azure.storage.files.datalake.datalakefileclient) instance to represent the file that you want to download. 
- Use the [DataLakeFileClient.ReadAsync](/dotnet/api/azure.storage.files.datalake.datalakefileclient.readasync) method, then parse the return value to obtain a [Stream](/dotnet/api/system.io.stream) object. Use any .NET file processing API to save bytes from the stream to a file.

This example uses a [BinaryReader](/dotnet/api/system.io.binaryreader) and a [FileStream](/dotnet/api/system.io.filestream) to save bytes to a file.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD_DataLake.cs" id="Snippet_DownloadBinaryFromDirectory":::

## List directory contents

You can list directory contents by using the following method and enumerating the result:

- [FileSystemClient.GetPathsAsync](/dotnet/api/azure.storage.files.datalake.datalakefilesystemclient.getpathsasync)

Enumerating the paths in the result may make multiple requests to the service while fetching the values.

The following code example prints the names of each file that is located in a directory:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD_DataLake.cs" id="Snippet_ListFilesInDirectory":::

## Delete a directory

You can delete a directory by using the following method:

- [DataLakeDirectoryClient.Delete](/dotnet/api/azure.storage.files.datalake.datalakedirectoryclient.delete)

The following code example shows how to delete a directory:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD_DataLake.cs" id="Snippet_DeleteDirectory":::

## Restore a soft-deleted directory

You can use the Azure Storage client libraries to restore a soft-deleted directory. Use the following method to list deleted paths for a [DataLakeFileSystemClient](/dotnet/api/azure.storage.files.datalake.datalakefilesystemclient) instance:

- [GetDeletedPathsAsync](/dotnet/api/azure.storage.files.datalake.datalakefilesystemclient.getdeletedpathsasync)

Use the following method to restore a soft-deleted directory:

- [UndeletePathAsync](/dotnet/api/azure.storage.files.datalake.datalakefilesystemclient.undeletepathasync)

The following code example shows how to list deleted paths and restore a soft-deleted directory:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD_DataLake.cs" id="Snippet_RestoreDirectory":::

If you rename the directory that contains the soft-deleted items, those items become disconnected from the directory. If you want to restore those items, you have to revert the name of the directory back to its original name or create a separate directory that uses the original directory name. Otherwise, you receive an error when you attempt to restore those soft-deleted items.

## Create a user delegation SAS for a directory

To work with the code examples in this section, add the following `using` directive:

```csharp
using Azure.Storage.Sas;
```

The following code example shows how to generate a user delegation SAS for a directory when a hierarchical namespace is enabled for the storage account:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Sas.cs" id="Snippet_GetUserDelegationSasDirectory":::

The following example tests the user delegation SAS created in the previous example from a simulated client application. If the SAS is valid, the client application is able to list file paths for this directory. If the SAS is invalid (for example, the SAS is expired), the Storage service returns error code 403 (Forbidden).

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Sas.cs" id="Snippet_ListFilePathsWithDirectorySasAsync":::

To learn more about creating a user delegation SAS, see [Create a user delegation SAS with .NET](storage-blob-user-delegation-sas-create-dotnet.md).

## Create a service SAS for a directory

In a storage account with a hierarchical namespace enabled, you can create a service SAS for a directory. To create the service SAS, make sure you have installed version 12.5.0 or later of the [Azure.Storage.Files.DataLake](https://www.nuget.org/packages/Azure.Storage.Files.DataLake/) package.

The following example shows how to create a service SAS for a directory:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Sas.cs" id="Snippet_GetServiceSasUriForDirectory":::

To learn more about creating a service SAS, see [Create a service SAS with .NET](sas-service-create-dotnet.md).

## See also

- [API reference documentation](/dotnet/api/azure.storage.files.datalake)
- [Package (NuGet)](https://www.nuget.org/packages/Azure.Storage.Files.DataLake)
- [Samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake)
- [Gen1 to Gen2 mapping](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/GEN1_GEN2_MAPPING.md)
- [Known issues](data-lake-storage-known-issues.md#api-scope-data-lake-client-library)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-net/issues)
