---
title: Known issues with Azure Data Lake Storage Gen2 | Microsoft Docs
description: Learn about the limitations and known issues with Azure Data Lake Storage Gen2
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 07/31/2019
ms.author: normesta
ms.reviewer: jamesbak
---
# Known issues with Azure Data Lake Storage Gen2

This article lists the features and tools that are not yet supported or only partially supported with storage accounts that have a hierarchical namespace (Azure Data Lake Storage Gen2).

<a id="blob-apis-disabled" />

## Blob storage APIs

Blob storage APIs are disabled to prevent feature operability issues that could arise because Blob Storage APIs aren't yet interoperable with Azure Data Lake Gen2 APIs.

> [!NOTE]
> If you enroll in the public preview of multi-protocol access on Data Lake Storage, then blob APIs and Data Lake Storage Gen2 APIs can operate on the same data. To learn more, see [multi-protocol access on Data Lake Storage](data-lake-storage-multi-protocol-access.md).

### What to do with existing tools, applications, and services

If any of these use Blob APIs, and you want to use them to work with all of the content that you upload to your account, then you have two options.

* **Option 1**: Don't enable a hierarchical namespace on your Blob storage account until Blob APIs become interoperable with Azure Data Lake Gen2 APIs. Using a storage account without a hierarchical namespace means you then don't have access to Data Lake Storage Gen2 specific features, such as directory and file system access control lists.

* **Option 2**: Enroll in the public preview of [multi-protocol access on Data Lake Storage](data-lake-storage-multi-protocol-access.md). Tools and applications that call Blob APIs, as well as Blob storage features, such as diagnostic logs, can work with accounts that have a hierarchical namespace.

### What to do if you used Blob APIs to load data before Blob APIs were disabled

If you used these APIs to load data before they were disabled, and you have a production requirement to access that data, then please contact Microsoft Support with the following information:

> [!div class="checklist"]
> * Subscription ID (the GUID, not the name).
> * Storage account name(s).
> * Whether you are actively impacted in production, and if so, for which storage accounts?.
> * Even if you are not actively impacted in production, tell us whether you need this data to be copied to another storage account for some reason, and if so, why?

Under these circumstances, we can restore access to the Blob API for a limited period of time so that you can copy this data into a storage account that doesn't have the hierarchical namespace feature enabled.

### Issues and limitations with using Blob APIs on accounts that have a hierarchical namespace

If you enroll in the public preview of multi-protocol access on Data Lake Storage, then blob APIs and Data Lake Storage Gen2 APIs can operate on the same data.

This section describes issues and limitations with using blob APIs and Data Lake Storage Gen2 APIs to operate on the same data.

* You can't use both Blob APIs and Data Lake Storage APIs to write to the same instance of a file.

* If you write to a file by using Data Lake Storage Gen2 APIs, then that file's blocks won't be visible to calls to the [Get Block List](https://docs.microsoft.com/rest/api/storageservices/get-block-list) blob API.

* You can overwrite a file by using either Data Lake Storage Gen2 APIs or Blob APIs. This won't affect file properties.

* When you use the [List Blobs](https://docs.microsoft.com/rest/api/storageservices/list-blobs) operation without specifying a delimiter, the results will include both directories and blobs.

  If you choose to use a delimiter, use only a forward slash (`/`). This is the only supported delimiter.

* If you use the [Delete Blob](https://docs.microsoft.com/rest/api/storageservices/delete-blob) API to delete a directory, that directory will be deleted only if it's empty.

  This means that you can't use the Blob API delete directories recursively.

These Blob REST APIs aren't supported:

* [Put Blob (Page)](https://docs.microsoft.com/rest/api/storageservices/put-blob)
* [Put Page](https://docs.microsoft.com/rest/api/storageservices/put-page)
* [Get Page Ranges](https://docs.microsoft.com/rest/api/storageservices/get-page-ranges)
* [Incremental Copy Blob](https://docs.microsoft.com/rest/api/storageservices/incremental-copy-blob)
* [Put Page from URL](https://docs.microsoft.com/rest/api/storageservices/put-page-from-url)
* [Put Blob (Append)](https://docs.microsoft.com/rest/api/storageservices/put-blob)
* [Append Block](https://docs.microsoft.com/rest/api/storageservices/append-block)
* [Append Block from URL](https://docs.microsoft.com/rest/api/storageservices/append-block-from-url)

## Issues with Unmanaged Virtual Machine (VM) disks

Unmanaged VM disks are not supported in accounts that have a hierarchical namespace. If you want to enable a hierarchical namespace on a storage account, place unmanaged VM disks into a storage account that doesn't have the hierarchical namespace feature enabled.


## Support for other Blob storage features

The following table lists all other features and tools that are not yet supported or only partially supported with storage accounts that have a hierarchical namespace (Azure Data Lake Storage Gen2).

| Feature / Tool    | More information    |
|--------|-----------|
| **APIs for Data Lake Storage Gen2 storage accounts** | Partially supported <br><br>multi-protocol access on Data Lake Storage is currently in public preview. This preview enables you to use Blob APIs in the .NET, Java, Python SDKs with accounts that have a hierarchical namespace.  The SDKs don't yet contain APIs that enable you to interact with directories or set access control lists (ACLs). To perform those functions, you can use Data Lake Storage Gen2 **REST** APIs. |
| **AzCopy** | Version-specific support <br><br>Use only the latest version of AzCopy ([AzCopy v10](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-v10?toc=%2fazure%2fstorage%2ftables%2ftoc.json)). Earlier versions of AzCopy such as AzCopy v8.1, are not supported.|
| **Azure Blob storage lifecycle management policies** | Supported only if you enroll in the [multi-protocol access on Data Lake Storage](data-lake-storage-multi-protocol-access.md) preview. Cool and archive access tiers are supported only by the preview. The deletion of blob snapshots is not yet supported. |
| **Azure Content Delivery Network (CDN)** | Not yet supported|
| **Azure search** |Supported only if you enroll in the [multi-protocol access on Data Lake Storage](data-lake-storage-multi-protocol-access.md) preview.|
| **Azure Storage Explorer** | Version-specific support <br><br>Use only version `1.6.0` or higher. <br>Version `1.6.0` is available as a [free download](https://azure.microsoft.com/features/storage-explorer/).|
| **Blob container ACLs** |Not yet supported|
| **Blobfuse** |Not yet supported|
| **Custom domains** |Not yet supported|
| **File System Explorer** | Limited support |
| **Diagnostic logging** |Diagnostic logs are supported only if you enroll in the [multi-protocol access on Data Lake Storage](data-lake-storage-multi-protocol-access.md) preview. <br><br>Enabling logs in the Azure portal is not currently supported. Here's an example of how to enable the logs by using PowerShell. <br><br>`$storageAccount = Get-AzStorageAccount -ResourceGroupName <resourceGroup> -Name <storageAccountName>`<br><br>`Set-AzStorageServiceLoggingProperty -Context $storageAccount.Context -ServiceType Blob -LoggingOperations read,write,delete -RetentionDays <days>`. <br><br>Make sure to specify `Blob` as the value of the `-ServiceType` parameter as shown in this example. 
| **Immutable storage** |Not yet supported <br><br>Immutable storage gives the ability to store data in a [WORM (Write Once, Read Many)](https://docs.microsoft.com/azure/storage/blobs/storage-blob-immutable-storage) state.|
| **Object-level tiers** |Cool and archive tiers are supported only if you enroll in the [multi-protocol access on Data Lake Storage](data-lake-storage-multi-protocol-access.md) preview. <br><br> All other access tiers are not yet supported.|
| **Powershell and CLI support** | Limited functionality <br><br>Management operations such as creating an account is supported. Data plane operations such as uploading and downloading files is in public preview as part of [multi-protocol access on Data Lake Storage](data-lake-storage-multi-protocol-access.md). Working with directories and setting access control lists (ACLs) is not yet supported. |
| **Static websites** |Not yet supported <br><br>Specifically, the ability to serve files to [Static websites](https://docs.microsoft.com/azure/storage/blobs/storage-blob-static-website).|
| **Third party applications** | Limited support <br><br>Third party applications that use REST APIs to work will continue to work if you use them with Data Lake Storage Gen2. <br>Applications that call Blob APIs will likely work if you enroll in the public preview of [multi-protocol access on Data Lake Storage](data-lake-storage-multi-protocol-access.md). 
| **Versioning features** |Not yet supported <br><br>This includes [snapshots](https://docs.microsoft.com/rest/api/storageservices/creating-a-snapshot-of-a-blob) and [soft delete](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete).|


