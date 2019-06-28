---
title: Use .NET with Azure Data Lake Storage Gen2
description: Use the Azure Storage Client Library for .NET to interact with Azure Blob storage accounts that have a hierarchical namespace.
services: storage
author: normesta
ms.service: storage
ms.date: 06/26/2019
ms.author: normesta
ms.topic: article
ms.component: data-lake-storage-gen2
---

# Use .NET with Azure Data Lake Storage Gen2

This guide shows you how to use .NET to interact with objects, manage directories, and set directory-level access permissions (access-control lists) in storage accounts that have a hierarchical namespace. 

To use the snippets presented in this article, you'll need to create a storage account, and then enable the hierarchical namespace feature on that account. See [Create a storage account](data-lake-storage-quickstart-create-account.md).

> [!NOTE]
> The snippets featured in this article use terms such as *blobs* and *containers* instead of *files* and *file systems*. That's because Azure Data Lake Storage Gen2 is built on blob storage, and in blob storage these terms mean the same things. This article refers to other articles that contain snippets for common tasks. Because those articles apply to all blob storage accounts regardless of whether hierarchical namespaces have been enabled, They'll use the terms *container* and *blob*. To avoid confusion, this article does the same.

## Set up your development environment

What you install depends on the operating system that you are running on your development computer.

### Windows

* Install [.NET Core for Windows](https://www.microsoft.com/net/download/windows) or the [.NET Framework](https://www.microsoft.com/net/download/windows) (included with Visual Studio for Windows)

* Install [Visual Studio for Windows](https://www.visualstudio.com/). If you are using .NET Core, installing Visual Studio is optional. 

* Install the [Azure Storage APIs for .NET](https://docs.microsoft.com/dotnet/api/overview/azure/storage?view=azure-dotnet).

### Linux

* Install [.NET Core for Linux](https://www.microsoft.com/net/download/linux)

* Optionally install [Visual Studio Code](https://www.visualstudio.com/) and the [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp&dotnetid=963890049.1518206068)

* Install the [Azure Storage APIs for .NET](https://docs.microsoft.com/dotnet/api/overview/azure/storage?view=azure-dotnet).

### macOS

* Install [.NET Core for macOS](https://www.microsoft.com/net/download/macos).

* Optionally install [Visual Studio for Mac](https://www.visualstudio.com/vs/visual-studio-mac/)

* Install the [Azure Storage APIs for .NET](https://docs.microsoft.com/dotnet/api/overview/azure/storage?view=azure-dotnet).

## Add library references to your code file

Add these using statements to your code file.

```cs
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
```

## Perform common blob tasks 

You can use the same set of APIs to interact with your data objects regardless of whether the account has a hierarchical namespace. To find snippets that help you perform common tasks such as creating a container (file system), uploading and downloading blobs (files), and deleting blobs and containers, see [Quickstart: Use .NET to create a blob in object storage](storage-quickstart-blobs-dotnet.md).

The rest of this article presents snippets that help you perform tasks related only to accounts that have a hierarchical namespace. 

## Add directory to a container

Intro text here

```cs
Snippet here
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.

## Rename or move a directory

Intro text here

```cs
Snippet here
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.

## Delete a directory from a container

Intro text here

```cs
Snippet here
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.

## Get the ACL for a directory

Intro text here

```cs
Snippet here
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.

## Set the ACL for a directory

Intro text here

```cs
Snippet here
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.

## Next steps

Explore more APIs in the [Microsoft.WindowsAzure.Storage.Blob](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob?view=azure-dotnet) namespace of the [Azure Storage APIs for .NET](https://docs.microsoft.com/dotnet/api/overview/azure/storage?view=azure-dotnet) docs.