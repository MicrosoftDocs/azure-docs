---
title: Develop for Azure Files with .NET
titleSuffix: Azure Storage
description: Learn how to develop .NET applications and services that use Azure Files to store data.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 10/02/2020
ms.author: kendownie
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-dotnet
---

# Develop for Azure Files with .NET

[!INCLUDE [storage-selector-file-include](../../../includes/storage-selector-file-include.md)]

Learn the basics of developing .NET applications that use [Azure Files](storage-files-introduction.md) to store data. This article shows how to create a simple console application to do the following with .NET and Azure Files:

- Get the contents of a file.
- Set the maximum size, or quota, for a file share.
- Create a shared access signature (SAS) for a file.
- Copy a file to another file in the same storage account.
- Copy a file to a blob in the same storage account.
- Create a snapshot of a file share.
- Restore a file from a share snapshot.
- Use Azure Storage Metrics for troubleshooting.

To learn more about Azure Files, see [What is Azure Files?](storage-files-introduction.md)

[!INCLUDE [storage-check-out-samples-dotnet](../../../includes/storage-check-out-samples-dotnet.md)]

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Understanding the .NET APIs

Azure Files provides two broad approaches to client applications: Server Message Block (SMB) and REST. Within .NET, the `System.IO` and `Azure.Storage.Files.Shares` APIs abstract these approaches.

API | When to use | Notes
----|-------------|------
[System.IO](/dotnet/api/system.io) | Your application: <ul><li>Needs to read/write files by using SMB</li><li>Is running on a device that has access over port 445 to your Azure Files account</li><li>Doesn't need to manage any of the administrative settings of the file share</li></ul> | File I/O implemented with Azure Files over SMB is generally the same as I/O with any network file share or local storage device. For an introduction to a number of features in .NET, including file I/O, see the [Console Application](/dotnet/csharp/tutorials/console-teleprompter) tutorial.
[Azure.Storage.Files.Shares](/dotnet/api/azure.storage.files.shares) | Your application: <ul><li>Can't access Azure Files by using SMB on port 445 because of firewall or ISP constraints</li><li>Requires administrative functionality, such as the ability to set a file share's quota or create a shared access signature</li></ul> | This article demonstrates the use of `Azure.Storage.Files.Shares` for file I/O using REST instead of SMB and management of the file share.

## Create the console application and obtain the assembly

You can use the Azure Files client library in any type of .NET app. These apps include Azure cloud, web, desktop, and mobile apps. In this guide, we create a console application for simplicity.

In Visual Studio, create a new Windows console application. The following steps show you how to create a console application in Visual Studio 2019. The steps are similar in other versions of Visual Studio.

1. Start Visual Studio and select **Create a new project**.
1. In **Create a new project**, choose **Console App (.NET Framework)** for C#, and then select **Next**.
1. In **Configure your new project**, enter a name for the app, and select **Create**.

Add all the code examples in this article to the `Program` class in the *Program.cs* file.

## Use NuGet to install the required packages

Refer to these packages in your project:

- [Azure core library for .NET](https://www.nuget.org/packages/Azure.Core/): This package is the implementation of the Azure client pipeline.
- [Azure Storage Blob client library for .NET](https://www.nuget.org/packages/Azure.Storage.Blobs/): This package provides programmatic access to blob resources in your storage account.
- [Azure Storage Files client library for .NET](https://www.nuget.org/packages/Azure.Storage.Files.Shares/): This package provides programmatic access to file resources in your storage account.
- [System Configuration Manager library for .NET](https://www.nuget.org/packages/System.Configuration.ConfigurationManager/): This package provides a class storing and retrieving values in a configuration file.

You can use NuGet to obtain the packages. Follow these steps:

1. In **Solution Explorer**, right-click your project and choose **Manage NuGet Packages**.
1. In **NuGet Package Manager**, select **Browse**. Then search for and choose **Azure.Core**, and then select **Install**.

   This step installs the package and its dependencies.

1. Search for and install these packages:

   - **Azure.Storage.Blobs**
   - **Azure.Storage.Files.Shares**
   - **System.Configuration.ConfigurationManager**

## Save your storage account credentials to the App.config file

Next, save your credentials in your project's *App.config* file. In **Solution Explorer**, double-click `App.config` and edit the file so that it is similar to the following example.

Replace `myaccount` with your storage account name and `mykey` with your storage account key.

:::code language="xml" source="~/azure-storage-snippets/files/howto/dotnet/dotnet-v12/app.config" highlight="5,6,7":::

> [!NOTE]
> The Azurite storage emulator does not currently support Azure Files. Your connection string must target an Azure storage account in the cloud to work with Azure Files.

## Add using directives

In **Solution Explorer**, open the *Program.cs* file, and add the following using directives to the top of the file.

:::code language="csharp" source="~/azure-storage-snippets/files/howto/dotnet/dotnet-v12/FileShare.cs" id="snippet_UsingStatements":::

## Access the file share programmatically

In the *Program.cs* file, add the following code to access the file share programmatically.

The following method creates a file share if it doesn't already exist. The method starts by creating a [ShareClient](/dotnet/api/azure.storage.files.shares.shareclient) object from a connection string. The sample then attempts to download a file we created earlier. Call this method from `Main()`.

:::code language="csharp" source="~/azure-storage-snippets/files/howto/dotnet/dotnet-v12/FileShare.cs" id="snippet_CreateShare":::

## Set the maximum size for a file share

Beginning with version 5.x of the Azure Files client library, you can set the quota (maximum size) for a file share. You can also check to see how much data is currently stored on the share.

Setting the quota for a share limits the total size of the files stored on the share. If the total size of files on the share exceeds the quota, clients can't increase the size of existing files. Clients also can't create new files, unless those files are empty.

The example below shows how to check the current usage for a share and how to set the quota for the share.

:::code language="csharp" source="~/azure-storage-snippets/files/howto/dotnet/dotnet-v12/FileShare.cs" id="snippet_SetMaxShareSize":::

### Generate a shared access signature for a file or file share

Beginning with version 5.x of the Azure Files client library, you can generate a shared access signature (SAS) for a file share or for an individual file.

The following example method returns a SAS on a file in the specified share.

:::code language="csharp" source="~/azure-storage-snippets/files/howto/dotnet/dotnet-v12/FileShare.cs" id="snippet_GetFileSasUri":::

For more information about creating and using shared access signatures, see [How a shared access signature works](../common/storage-sas-overview.md?toc=/azure/storage/files/toc.json#how-a-shared-access-signature-works).

## Copy files

Beginning with version 5.x of the Azure Files client library, you can copy a file to another file, a file to a blob, or a blob to a file.

You can also use AzCopy to copy one file to another or to copy a blob to a file or the other way around. See [Get started with AzCopy](../common/storage-use-azcopy-v10.md?toc=/azure/storage/files/toc.json).

> [!NOTE]
> If you are copying a blob to a file, or a file to a blob, you must use a shared access signature (SAS) to authorize access to the source object, even if you are copying within the same storage account.

### Copy a file to another file

The following example copies a file to another file in the same share. You can use [Shared Key authentication](/rest/api/storageservices/authorize-with-shared-key) to do the copy because this operation copies files within the same storage account.

:::code language="csharp" source="~/azure-storage-snippets/files/howto/dotnet/dotnet-v12/FileShare.cs" id="snippet_CopyFile":::

### Copy a file to a blob

The following example creates a file and copies it to a blob within the same storage account. The example creates a SAS for the source file, which the service uses to authorize access to the source file during the copy operation.

:::code language="csharp" source="~/azure-storage-snippets/files/howto/dotnet/dotnet-v12/FileShare.cs" id="snippet_CopyFileToBlob":::

You can copy a blob to a file in the same way. If the source object is a blob, then create a SAS to authorize access to that blob during the copy operation.

## Share snapshots

Beginning with version 8.5 of the Azure Files client library, you can create a share snapshot. You can also list or browse share snapshots and delete share snapshots. Once created, share snapshots are read-only.

### Create share snapshots

The following example creates a file share snapshot.

:::code language="csharp" source="~/azure-storage-snippets/files/howto/dotnet/dotnet-v12/FileShare.cs" id="snippet_CreateShareSnapshot":::

### List share snapshots

The following example lists the snapshots on a share.

:::code language="csharp" source="~/azure-storage-snippets/files/howto/dotnet/dotnet-v12/FileShare.cs" id="snippet_ListShareSnapshots":::

### List files and directories within share snapshots

The following example browses files and directories within share snapshots.

:::code language="csharp" source="~/azure-storage-snippets/files/howto/dotnet/dotnet-v12/FileShare.cs" id="snippet_ListSnapshotContents":::

### Restore file shares or files from share snapshots

Taking a snapshot of a file share enables you to recover individual files or the entire file share.

You can restore a file from a file share snapshot by querying the share snapshots of a file share. You can then retrieve a file that belongs to a particular share snapshot. Use that version to directly read or to restore the file.

:::code language="csharp" source="~/azure-storage-snippets/files/howto/dotnet/dotnet-v12/FileShare.cs" id="snippet_RestoreFileFromSnapshot":::

### Delete share snapshots

The following example deletes a file share snapshot.

:::code language="csharp" source="~/azure-storage-snippets/files/howto/dotnet/dotnet-v12/FileShare.cs" id="snippet_DeleteSnapshot":::

## Troubleshoot Azure Files by using metrics<a name="troubleshooting-azure-files-using-metrics"></a>

Azure Storage Analytics supports metrics for Azure Files. With metrics data, you can trace requests and diagnose issues.

You can enable metrics for Azure Files from the [Azure portal](https://portal.azure.com). You can also enable metrics programmatically by calling the [Set File Service Properties](/rest/api/storageservices/set-file-service-properties) operation with the REST API or one of its analogs in the Azure Files client library.

The following code example shows how to use the .NET client library to enable metrics for Azure Files.

:::code language="csharp" source="~/azure-storage-snippets/files/howto/dotnet/dotnet-v12/FileShare.cs" id="snippet_UseMetrics":::

If you encounter any problems, refer to [Troubleshoot Azure Files](/troubleshoot/azure/azure-storage/files-troubleshoot?toc=/azure/storage/files/toc.json).

## Next steps

For more information about Azure Files, see the following resources:

### Conceptual articles and videos

- [Azure Files: a frictionless cloud SMB file system for Windows and Linux](https://azure.microsoft.com/documentation/videos/azurecon-2015-azure-files-storage-a-frictionless-cloud-smb-file-system-for-windows-and-linux/)
- [Use Azure Files with Linux](storage-how-to-use-files-linux.md)

### Tooling support for File storage

- [Get started with AzCopy](../common/storage-use-azcopy-v10.md?toc=/azure/storage/files/toc.json)
- [Troubleshoot Azure Files](/troubleshoot/azure/azure-storage/files-troubleshoot?toc=/azure/storage/files/toc.json)

### Reference

- [Azure Storage APIs for .NET](/dotnet/api/overview/azure/storage)
- [File Service REST API](/rest/api/storageservices/File-Service-REST-API)

For related code samples using deprecated .NET version 11.x SDKs, see [Code samples using .NET version 11.x](files-samples-dotnet-v11.md).
