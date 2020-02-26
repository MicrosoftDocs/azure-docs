---
title: Known issues with Azure Data Lake Storage Gen2 | Microsoft Docs
description: Learn about the limitations and known issues with Azure Data Lake Storage Gen2
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 11/03/2019
ms.author: normesta
ms.reviewer: jamesbak
---
# Known issues with Azure Data Lake Storage Gen2

This article lists the features and tools that are not yet supported or only partially supported with storage accounts that have a hierarchical namespace (Azure Data Lake Storage Gen2).

<a id="blob-apis-disabled" />

## Issues and limitations with using Blob APIs

Blob APIs and Data Lake Storage Gen2 APIs can operate on the same data.

This section describes issues and limitations with using blob APIs and Data Lake Storage Gen2 APIs to operate on the same data.

* You can't use both Blob APIs and Data Lake Storage APIs to write to the same instance of a file. If you write to a file by using Data Lake Storage Gen2 APIs, then that file's blocks won't be visible to calls to the [Get Block List](https://docs.microsoft.com/rest/api/storageservices/get-block-list) blob API. You can overwrite a file by using either Data Lake Storage Gen2 APIs or Blob APIs. This won't affect file properties.

* When you use the [List Blobs](https://docs.microsoft.com/rest/api/storageservices/list-blobs) operation without specifying a delimiter, the results will include both directories and blobs. If you choose to use a delimiter, use only a forward slash (`/`). This is the only supported delimiter.

* If you use the [Delete Blob](https://docs.microsoft.com/rest/api/storageservices/delete-blob) API to delete a directory, that directory will be deleted only if it's empty. This means that you can't use the Blob API delete directories recursively.

These Blob REST APIs aren't supported:

* [Put Blob (Page)](https://docs.microsoft.com/rest/api/storageservices/put-blob)
* [Put Page](https://docs.microsoft.com/rest/api/storageservices/put-page)
* [Get Page Ranges](https://docs.microsoft.com/rest/api/storageservices/get-page-ranges)
* [Incremental Copy Blob](https://docs.microsoft.com/rest/api/storageservices/incremental-copy-blob)
* [Put Page from URL](https://docs.microsoft.com/rest/api/storageservices/put-page-from-url)
* [Put Blob (Append)](https://docs.microsoft.com/rest/api/storageservices/put-blob)
* [Append Block](https://docs.microsoft.com/rest/api/storageservices/append-block)
* [Append Block from URL](https://docs.microsoft.com/rest/api/storageservices/append-block-from-url)

Unmanaged VM disks are not supported in accounts that have a hierarchical namespace. If you want to enable a hierarchical namespace on a storage account, place unmanaged VM disks into a storage account that doesn't have the hierarchical namespace feature enabled.

<a id="api-scope-data-lake-client-library" />

## Filesystem Support in SDKs

- [.NET](data-lake-storage-directory-file-acl-dotnet.md), [Java](data-lake-storage-directory-file-acl-java.md) and [Python](data-lake-storage-directory-file-acl-python.md) support are in public preview. Other SDKs are not currently supported.
- Get and set ACL operations are not currently recursive.

## Filesystem Support in PowerShell and Azure CLI

- [PowerShell](data-lake-storage-directory-file-acl-powershell.md) and [Azure CLI](data-lake-storage-directory-file-acl-cli.md) support are in public preview.
- Get and set ACL operations are not currently recursive.

## Support for other Blob Storage features

The following table lists all other features and tools that are not yet supported or only partially supported with storage accounts that have a hierarchical namespace (Azure Data Lake Storage Gen2).

| Feature / Tool    | More information    |
|--------|-----------|
| **Account failover** |Not yet supported|
| **AzCopy** | Version-specific support <br><br>Use only the latest version of AzCopy ([AzCopy v10](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-v10?toc=%2fazure%2fstorage%2ftables%2ftoc.json)). Earlier versions of AzCopy such as AzCopy v8.1, are not supported.|
| **Azure Blob Storage lifecycle management policies** | Lifecycle management policies are supported (Preview).  Sign up for the preview of lifecycle management policies and archive access tier [here](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR2EUNXd_ZNJCq_eDwZGaF5VURjFLTDRGS0Q4VVZCRFY5MUVaTVJDTkROMi4u).   <br><br>All access tiers are supported. The archive access tier is currently in preview. The deletion of blob snapshots is not yet supported.  There are currently some bugs affecting lifecycle management policies and the archive access tier.  |
| **Azure Content Delivery Network (CDN)** | Not yet supported|
| **Azure search** |Supported (Preview)|
| **Azure Storage Explorer** | Version-specific support. <br><br>Use only versions `1.6.0` or higher. <br> There is currently a storage bug affecting version `1.11.0` that can result in authentication errors in certain scenarios. A fix for the storage bug is being rolled out, but as a workaround, we recommend that you use version `1.10.x` which is available as a [free download](https://docs.microsoft.com/azure/vs-azure-tools-storage-explorer-relnotes). `1.10.x` is not affected by the storage bug.|
| **Blob container ACLs** |Not yet supported|
| **Blobfuse** |Not yet supported|
| **Custom domains** |Not yet supported|
| **Storage Explorer in the Azure portal** | Limited support. ACLs are not yet supported. |
| **Diagnostic logging** |Diagnostic logs are supported (Preview). <br><br>Azure Storage Explorer 1.10.x can't be used for viewing diagnostic logs. To view logs, please use AzCopy or SDKs.
| **Immutable storage** |Not yet supported <br><br>Immutable storage gives the ability to store data in a [WORM (Write Once, Read Many)](https://docs.microsoft.com/azure/storage/blobs/storage-blob-immutable-storage) state.|
| **Object-level tiers** |Cool and archive tiers are supported. The archive tier is in preview. All other access tiers are not yet supported. <br><br> There are currently some bugs affecting the archive access tier.  Sign up for the preview of the archive access tier [here](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR2EUNXd_ZNJCq_eDwZGaF5VURjFLTDRGS0Q4VVZCRFY5MUVaTVJDTkROMi4u).|
| **Static websites** |Not yet supported <br><br>Specifically, the ability to serve files to [Static websites](https://docs.microsoft.com/azure/storage/blobs/storage-blob-static-website).|
| **Third party applications** | Limited support <br><br>Third party applications that use REST APIs to work will continue to work if you use them with Data Lake Storage Gen2. <br>Applications that call Blob APIs will likely work.|
|**Soft Delete** |Not yet supported|
| **Versioning features** |Not yet supported <br><br>This includes  [soft delete](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete), and other versioning features such as [snapshots](https://docs.microsoft.com/rest/api/storageservices/creating-a-snapshot-of-a-blob).|


