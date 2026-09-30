---
title: Known issues with Azure Data Lake Storage
titleSuffix: Azure Storage
description: "Discover known issues and limitations of Azure Data Lake Storage with hierarchical namespace enabled. Learn how to avoid pitfalls with APIs and integrations."
author: normesta

ms.service: azure-data-lake-storage
ms.topic: concept-article
ms.date: 07/06/2026
ms.author: normesta
ms.reviewer: jamesbak
# Customer intent: As a data engineer, I want to understand the limitations and known issues of Azure Data Lake Storage so that I can effectively manage my data workflows and avoid potential pitfalls when using various APIs and integrations.
---

# Known issues with Azure Data Lake Storage

This article describes known issues and limitations of Azure Data Lake Storage for accounts that have the hierarchical namespace feature enabled. Use this information to manage your data workflows and avoid potential pitfalls when using various APIs and integrations.

> [!NOTE]
> Some of the features described in this article might not be supported in accounts that have Network File System (NFS) 3.0 support enabled. To view a table that shows the impact of feature support when various capabilities are enabled, see [Blob Storage feature support in Azure Storage accounts](storage-feature-support-in-storage-accounts.md).

## Feature, service, and platform support

Most Blob storage features, Azure service integrations, and open-source platforms are supported in accounts that have a hierarchical namespace. For complete lists, see:

- [Blob Storage features available in Azure Data Lake Storage](./storage-feature-support-in-storage-accounts.md)
- [Azure services that support Azure Data Lake Storage](data-lake-storage-supported-azure-services.md)
- [Open-source platforms that support Azure Data Lake Storage](data-lake-storage-supported-open-source-platforms.md)

## Blob storage APIs

Data Lake Storage APIs, NFS 3.0, and Blob APIs can operate on the same data.

This section describes issues and limitations with using blob APIs, NFS 3.0, and Data Lake Storage APIs to operate on the same data.

- You can't use blob APIs, NFS 3.0, and Data Lake Storage APIs to write to the same instance of a file. If you write to a file by using Data Lake Storage APIs or NFS 3.0, then that file's blocks aren't visible to calls to the [Get Block List](/rest/api/storageservices/get-block-list) blob API. The only exception is when you're overwriting. You can overwrite a file or blob by using either API or by using NFS 3.0 with the zero-truncate option (a POSIX-style operation that truncates the file to zero bytes before writing). 
 
  You can't overwrite blobs that are created by using a Data Lake Storage operation such as the [Path - Create](/rest/api/storageservices/datalakestoragegen2/path/create) operation by using [PutBlock](/rest/api/storageservices/put-block) or [PutBlockList](/rest/api/storageservices/put-block-list) operations. However, you can overwrite these blobs by using a [PutBlob](/rest/api/storageservices/put-blob) operation, subject to the maximum permitted blob size imposed by the corresponding api-version that PutBlob uses. 

- When you use the [List Blobs](/rest/api/storageservices/list-blobs) operation without specifying a delimiter, the results include both directories and blobs. If you choose to use a delimiter, use only a forward slash (`/`). This is the only supported delimiter.

- If you use the [Delete Blob](/rest/api/storageservices/delete-blob) API to delete a directory, the directory is deleted only if it's empty. This condition means that you can't use the Blob API to delete directories recursively.

These Blob REST APIs aren't supported:

- [Put Blob (Page)](/rest/api/storageservices/put-blob)
- [Put Page](/rest/api/storageservices/put-page)
- [Get Page Ranges](/rest/api/storageservices/get-page-ranges)
- [Incremental Copy Blob](/rest/api/storageservices/incremental-copy-blob)
- [Put Page from URL](/rest/api/storageservices/put-page-from-url)
- [Append Blob Seal](/rest/api/storageservices/append-blob-seal)

Unmanaged VM disks aren't supported in accounts that have a hierarchical namespace. If you want to enable a hierarchical namespace on a storage account, place unmanaged VM disks into a storage account that doesn't have the hierarchical namespace feature enabled.

<a id="api-scope-data-lake-client-library"></a>

## Support for setting access control lists (ACLs) recursively in Azure Data Lake Storage

The ability to apply ACL changes recursively from parent directory to child items is generally available. In the current release of this capability, you can apply ACL changes by using Azure Storage Explorer, PowerShell, Azure CLI, and the .NET, Java, Python, and Node.js SDKs. Support isn't yet available for the Azure portal.

## Access control lists (ACL) and anonymous read access

If [anonymous read access](./anonymous-read-access-overview.md) is granted to a container, then ACLs have no effect on that container or the files in that container. This restriction only affects read requests. Write requests still honor the ACLs. Require authorization for all requests to blob data.

## Private endpoints for Azure Data Lake Storage

If you're using private endpoints to access Azure Data Lake Storage (a storage account with hierarchical namespace enabled), you need to create one for both the **blob** and **dfs** sub-resources. Operations that target the Data Lake Storage (dfs) endpoint can be redirected to the Blob endpoint, and some operations (such as managing ACLs, creating directories, and deleting directories) require a DFS private endpoint. Creating private endpoints for both sub-resources ensures that all operations complete successfully. For more information, see [Use private endpoints for Azure Storage](../common/storage-private-endpoints.md).

<a id="known-issues-tools"></a>

## AzCopy with Azure Data Lake Storage

When you use AzCopy with accounts that have a hierarchical namespace enabled, only AzCopy v10 supports the required Data Lake Storage APIs. Use only the latest version of AzCopy ([AzCopy v10](../common/storage-use-azcopy-v10.md?toc=/azure/storage/tables/toc.json)). Earlier versions, such as AzCopy v8.1, aren't supported.

<a id="storage-explorer"></a>

## Azure Storage Explorer with Azure Data Lake Storage

When you use Azure Storage Explorer with storage accounts that have a hierarchical namespace enabled, use only versions `1.6.0` or higher. Earlier versions don't support the hierarchical namespace APIs required to manage files and directories.

<a id="explorer-in-portal"></a>

## Storage browser in the Azure portal

In the storage browser that appears in the Azure portal, you can't access a file or folder by specifying a path. Instead, you must browse through folders to reach a file. Therefore, if an ACL grants a user read access to a file but not read access to all folders leading up to the file, that user can't view the file in storage browser.  

<a id="third-party-apps"></a>

## Third-party applications

Third-party applications that use REST APIs to work continue to work if you use them with Data Lake Storage. Applications that call Blob APIs are likely to work.


## Windows Azure Storage Blob (WASB) driver

Currently, the WASB driver, which was designed to work with the Blob API only, encounters problems in a few common scenarios. Specifically, when it's a client to a hierarchical namespace enabled storage account. Multi-protocol access on Data Lake Storage doesn't mitigate these issues.

Using the WASB driver as a client to a hierarchical namespace enabled storage account isn't supported. Instead, use the [Azure Blob File System (ABFS)](data-lake-storage-abfs-driver.md) driver in your Hadoop environment. If you're trying to migrate off of an on-premises Hadoop environment with a version earlier than Hadoop branch-3, open an Azure Support ticket for help determining the right path forward for your organization.

## Soft delete for blobs in Azure Data Lake Storage

In storage accounts that have a hierarchical namespace, if you rename parent directories for soft-deleted files or directories, the Azure portal might not display the soft-deleted items correctly. In such cases, use [PowerShell](soft-delete-blob-manage.yml?tabs=dotnet#restore-soft-deleted-blobs-and-directories-by-using-powershell) or [Azure CLI](soft-delete-blob-manage.yml?tabs=dotnet#restore-soft-deleted-blobs-and-directories-by-using-azure-cli) to list and restore the soft-deleted items.

## Event subscriptions in Azure Data Lake Storage

In storage accounts that have a hierarchical namespace, if your account has an event subscription, read operations on the secondary endpoint (the read-only replica in geo-redundant storage accounts) result in an error. To resolve this issue, remove event subscriptions. Using the Data Lake Storage endpoint (abfss://URI) for non-hierarchical namespace enabled accounts doesn't generate events, but the blob endpoint (wasb:// URI) generates events.

> [!TIP]
> Read access to the secondary endpoint is available only when you enable read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS).
