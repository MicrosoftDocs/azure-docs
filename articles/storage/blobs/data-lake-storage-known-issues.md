---
title: Known issues with Azure Data Lake Storage Gen2 | Microsoft Docs
description: Learn about the limitations and known issues with Azure Data Lake Storage Gen2
services: storage
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 04/26/2019
ms.author: normesta

---
# Known issues with Azure Data Lake Storage Gen2

This article lists features and tools that aren't yet supported with Azure Data Lake Storage Gen2. This article also describes features and tools that have limited support and how to work around those limitations.

## Features and tools that are not yet supported

- Blob storage APIs
  
  These APIs are disabled to prevent inadvertent data access issues that could arise because Blob Storage APIs aren't yet interoperable with Azure Data Lake Gen2 APIs.

  For more details, see the [Blob storage APIs are disabled for Data Lake Storage Gen2 storage accounts](#blob-apis-disabled) section of this article.

- Versioning features
  
  Includes [snapshots](https://docs.microsoft.com/rest/api/storageservices/creating-a-snapshot-of-a-blob) and [soft delete](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete).

- Object-level tiers

  Premium, Hot, Cold, and Archive tiers.

- Azure Blob storage Lifecycle management policies

- Diagnostic logs

- Blob container ACLs

- Blobfuse

- Static websites]

  The ability to serve files to [Static websites](https://docs.microsoft.com/azure/storage/blobs/storage-blob-static-website).

- Immutable storage

  The ability to store data in a [WORM (Write Once, Read Many) state](https://docs.microsoft.com/azure/storage/blobs/storage-blob-immutable-storage).

- Custom domains

- Azure Content Delivery Network (CDN)

- Azure search

## Features and tools that have limited support

- Powershell and CLI support
  
  You can create an account by using Powershell or the CLI. You can't perform operations or set access control lists on file systems, directories, and files.

- APIs for Data Lake Storage Gen2 storage accounts
  
  You can use Data Lake Storage Gen2 REST APIs, but APIs in other Blob SDKs such as the .NET, Java, Python SDKs are not yet available.

- AzCopy

  Use only the latest version of AzCopy ([AzCopy v10](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-v10?toc=%2fazure%2fstorage%2ftables%2ftoc.json)). Earlier versions of AzCopy such as AzCopy v8.1, are not supported.

- Azure Storage Explorer

  Use only version `1.6.0` or higher.

  Version `1.6.0` is available as a [free download](https://azure.microsoft.com/features/storage-explorer/).

- File System Explorer

  This tool has only limited support for Data Lake Storage Gen2.

- Third party applications

  Third party applications that use REST APIs to work will continue to work if you use them with Data Lake Storage Gen2.

  If you have an application that uses Blob APIs, that application will most likely have issues if you use that application with Data Lake Storage Gen2. To learn more, see the [Blob storage APIs are disabled for Data Lake Storage Gen2 storage accounts](#blob-apis-disabled) section of this article.

<a id="blob-apis-disabled" />


## Blob storage APIs are disabled for Data Lake Storage Gen2 storage accounts

Blob storage APIs are disabled to prevent inadvertent data access issues that could arise because Blob Storage APIs aren't yet interoperable with Azure Data Lake Gen2 APIs.

If you have tools, applications, services, or scripts that use Blob APIs, and you want to use them to work with all of the content that you upload to your account, then don't enable a hierarchical namespace on your Blob storage account until Blob APIs become interoperable with Azure Data Lake Gen2 APIs. Using a storage account without a hierarchical namespace means you then don't have access to Data Lake Storage Gen2 specific features, such as directory and file system access control lists.

Unmanaged Virtual Machine (VM) disks depend upon the disabled Blob Storage APIs, so if you want to enable a hierarchical namespace on a storage account, consider placing unmanaged VM disks into a storage account that doesn't have the hierarchical namespace feature enabled.

If you used these APIs to load data before they were disabled, and you have a production requirement to access that data, then please contact Microsoft Support with the following information:

> [!div class="checklist"]
> * Subscription ID (the GUID, not the name).
> * Storage account name(s).
> * Whether you are actively impacted in production, and if so, for which storage accounts?.
> * Even if you are not actively impacted in production, tell us whether you need this data to be copied to another storage account for some reason, and if so, why?

Under these circumstances, we can restore access to the Blob API for a limited period of time so that you can copy this data into a storage account that doesn't have the hierarchical namespace feature enabled.