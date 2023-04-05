---
title: Create and list blob versions in .NET
titleSuffix: Azure Storage
description: Learn how to use the .NET client library to create a previous version of a blob.
author: tamram

ms.author: tamram
ms.service: storage
ms.topic: how-to
ms.date: 02/14/2023
ms.subservice: blobs
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Create and list blob versions in .NET

Blob versioning automatically creates a previous version of a blob anytime it is modified or deleted. When blob versioning is enabled, then you can restore an earlier version of a blob to recover your data if it is erroneously modified or deleted.

For optimal data protection, Microsoft recommends enabling both blob versioning and blob soft delete for your storage account. For more information, see [Blob versioning](versioning-overview.md) and [Soft delete for blobs](soft-delete-blob-overview.md).

## Modify a blob to trigger a new version

The following code example shows how to trigger the creation of a new version with the Azure Storage client library for .NET, version [12.5.1](https://www.nuget.org/packages/Azure.Storage.Blobs/12.5.1) or later. Before running this example, make sure you have enabled versioning for your storage account.

The example creates a block blob, and then updates the blob's metadata. Updating the blob's metadata triggers the creation of a new version. The example retrieves the initial version and the current version, and shows that only the current version includes the metadata.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD.cs" id="Snippet_UpdateVersionedBlobMetadata":::

## List blob versions

To list blob versions, specify the [BlobStates](/dotnet/api/azure.storage.blobs.models.blobstates) parameter with the **Version** field. Versions are listed from oldest to newest.

The following code example shows how to list blob versions.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CRUD.cs" id="Snippet_ListBlobVersions":::

## See also

- [Blob versioning](versioning-overview.md)
- [Enable and manage blob versioning](versioning-enable.md)
