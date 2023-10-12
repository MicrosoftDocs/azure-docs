---
title: Known issues with Azure Data Lake Storage Gen2
titleSuffix: Azure Storage
description: Learn about limitations and known issues of Azure Data Lake Storage Gen2.
author: normesta

ms.service: azure-data-lake-storage
ms.topic: conceptual
ms.date: 03/09/2023
ms.author: normesta
ms.reviewer: jamesbak
---

# Known issues with Azure Data Lake Storage Gen2

This article describes limitations and known issues for accounts that have the hierarchical namespace feature enabled.

> [!NOTE]
> Some of the features described in this article might not be supported in accounts that have Network File System (NFS) 3.0 support enabled. To view a table that shows the impact of feature support when various capabilities are enabled, see [Blob Storage feature support in Azure Storage accounts](storage-feature-support-in-storage-accounts.md).

## Supported Blob storage features

An increasing number of Blob storage features now work with accounts that have a hierarchical namespace. For a complete list, see [Blob Storage features available in Azure Data Lake Storage Gen2](./storage-feature-support-in-storage-accounts.md).

## Supported Azure service integrations

Azure Data Lake Storage Gen2 supports several Azure services that you can use to ingest data, perform analytics, and create visual representations. For a list of supported Azure services, see [Azure services that support Azure Data Lake Storage Gen2](data-lake-storage-supported-azure-services.md).

For more information, see [Azure services that support Azure Data Lake Storage Gen2](data-lake-storage-supported-azure-services.md).

## Supported open source platforms

Several open source platforms support Data Lake Storage Gen2. For a complete list, see [Open source platforms that support Azure Data Lake Storage Gen2](data-lake-storage-supported-open-source-platforms.md).

For more information, see [Open source platforms that support Azure Data Lake Storage Gen2](data-lake-storage-supported-open-source-platforms.md).

## Blob storage APIs

Data Lake Storage Gen2 APIs, NFS 3.0, and Blob APIs can operate on the same data.

This section describes issues and limitations with using blob APIs, NFS 3.0, and Data Lake Storage Gen2 APIs to operate on the same data.

- You can't use blob APIs, NFS 3.0, and Data Lake Storage APIs to write to the same instance of a file. If you write to a file by using Data Lake Storage Gen2 APIs or NFS 3.0, then that file's blocks won't be visible to calls to the [Get Block List](/rest/api/storageservices/get-block-list) blob API. The only exception is when you're overwriting. You can overwrite a file/blob using either API or with NFS 3.0 by using the zero-truncate option.

- When you use the [List Blobs](/rest/api/storageservices/list-blobs) operation without specifying a delimiter, the results include both directories and blobs. If you choose to use a delimiter, use only a forward slash (`/`). This is the only supported delimiter.

- If you use the [Delete Blob](/rest/api/storageservices/delete-blob) API to delete a directory, that directory is deleted only if it's empty. This means that you can't use the Blob API delete directories recursively.

These Blob REST APIs aren't supported:

- [Put Block](/rest/api/storageservices/put-block)
- [Put Block List](/rest/api/storageservices/put-block-list)
- [Put Blob (Page)](/rest/api/storageservices/put-blob)
- [Put Page](/rest/api/storageservices/put-page)
- [Get Page Ranges](/rest/api/storageservices/get-page-ranges)
- [Incremental Copy Blob](/rest/api/storageservices/incremental-copy-blob)
- [Put Page from URL](/rest/api/storageservices/put-page-from-url)

Unmanaged VM disks aren't supported in accounts that have a hierarchical namespace. If you want to enable a hierarchical namespace on a storage account, place unmanaged VM disks into a storage account that doesn't have the hierarchical namespace feature enabled.

<a id="api-scope-data-lake-client-library"></a>

## Support for setting access control lists (ACLs) recursively

The ability to apply ACL changes recursively from parent directory to child items is generally available. In the current release of this capability, you can apply ACL changes by using Azure Storage Explorer, PowerShell, Azure CLI, and the .NET, Java, and Python SDK. Support isn't yet available for the Azure portal.

## Access control lists (ACL) and anonymous read access

If [anonymous read access](./anonymous-read-access-overview.md) has been granted to a container, then ACLs have no effect on that container or the files in that container.  This only affects read requests.  Write requests will still honor the ACLs. We recommend requiring authorization for all requests to blob data.

<a id="known-issues-tools"></a>

## AzCopy

Use only the latest version of AzCopy ([AzCopy v10](../common/storage-use-azcopy-v10.md?toc=/azure/storage/tables/toc.json)). Earlier versions of AzCopy such as AzCopy v8.1, aren't supported.

<a id="storage-explorer"></a>

## Azure Storage Explorer

Use only versions `1.6.0` or higher.

<a id="explorer-in-portal"></a>

## Storage browser in the Azure portal

In the storage browser that appears in the Azure portal, you can't access a file or folder by specifying a path. Instead, you must browse through folders to reach a file.  Therefore, if an ACL grants a user read access to a file but not read access to all folders leading up to the file, that user won't be able to view the file in storage browser.  

<a id="third-party-apps"></a>

## Third party applications

Third party applications that use REST APIs to work will continue to work if you use them with Data Lake Storage Gen2. Applications that call Blob APIs will likely work.


## Windows Azure Storage Blob (WASB) driver

Currently, the WASB driver, which was designed to work with the Blob API only, encounters problems in a few common scenarios. Specifically, when it's a client to a hierarchical namespace enabled storage account. Multi-protocol access on Data Lake Storage won't mitigate these issues.

Using the WASB driver as a client to a hierarchical namespace enabled storage account isn't supported. Instead, we recommend that you use the [Azure Blob File System (ABFS)](data-lake-storage-abfs-driver.md) driver in your Hadoop environment. If you're trying to migrate off of an on-premises Hadoop environment with a version earlier than Hadoop branch-3, then please open an Azure Support ticket so that we can get in touch with you on the right path forward for you and your organization.

## Soft delete for blobs capability

If parent directories for soft-deleted files or directories are renamed, the soft-deleted items may not be displayed correctly in the Azure portal. In such cases you can use [PowerShell](soft-delete-blob-manage.md?tabs=dotnet#restore-soft-deleted-blobs-and-directories-by-using-powershell) or [Azure CLI](soft-delete-blob-manage.md?tabs=dotnet#restore-soft-deleted-blobs-and-directories-by-using-azure-cli) to list and restore the soft-deleted items.

## Events

If your account has an event subscription, read operations on the secondary endpoint will result in an error. To resolve this issue, remove event subscriptions. Using the Data Lake Storage endpoint (abfss://URI) for non-hierarchical namespace enabled accounts won't generate events, but the blob endpoint (wasb:// URI) will generate events.

> [!TIP]
> Read access to the secondary endpoint is available only when you enable read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS).
