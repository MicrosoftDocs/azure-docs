---
title: Create and manage container leases with .NET
titleSuffix: Azure Storage 
description: Learn how to manage a lock on a container in your Azure Storage account using the .NET client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 08/05/2024
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp, devx-track-dotnet
---

# Create and manage container leases with .NET

[!INCLUDE [storage-dev-guide-selector-lease-container](../../../includes/storage-dev-guides/storage-dev-guide-selector-lease-container.md)]

This article shows how to create and manage container leases using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage). You can use the client library to acquire, renew, release, and break container leases.

[!INCLUDE [storage-dev-guide-prereqs-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-dotnet.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-dotnet.md)]

#### Authorization

The authorization mechanism must have the necessary permissions to work with a container lease. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Contributor** or higher. To learn more, see the authorization guidance for [Lease Container (REST API)](/rest/api/storageservices/lease-container#authorization).

## About container leases

[!INCLUDE [storage-dev-guide-about-container-lease](../../../includes/storage-dev-guides/storage-dev-guide-about-container-lease.md)]

Lease operations are handled by the [BlobLeaseClient](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient) class, which provides a client containing all lease operations for blobs and containers. To learn more about blob leases using the client library, see [Create and manage blob leases with .NET](storage-blob-lease.md).

## Acquire a lease

When you acquire a container lease, you obtain a lease ID that your code can use to operate on the container. If the container already has an active lease, you can only request a new lease by using the active lease ID. However, you can specify a new lease duration.

To acquire a lease, create an instance of the [BlobLeaseClient](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient) class, and then use one of the following methods:

- [Acquire](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.acquire)
- [AcquireAsync](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.acquireasync)

The following example acquires a 30-second lease for a container:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/LeaseContainer.cs" id="Snippet_AcquireContainerLease":::

## Renew a lease

You can renew a container lease if the lease ID specified on the request matches the lease ID associated with the container. The lease can be renewed even if it has expired, as long as the container hasn't been leased again since the expiration of that lease. When you renew a lease, the duration of the lease resets.

To renew a lease, use one of the following methods on a [BlobLeaseClient](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient) instance:

- [Renew](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.renew)
- [RenewAsync](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.renewasync)

The following example renews a container lease:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/LeaseContainer.cs" id="Snippet_RenewContainerLease":::

## Release a lease

You can release a container lease if the lease ID specified on the request matches the lease ID associated with the container. Releasing a lease allows another client to acquire a lease for the container immediately after the release is complete.

You can release a lease using one of the following methods on a [BlobLeaseClient](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient) instance:

- [Release](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.release)
- [ReleaseAsync](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.releaseasync)

The following example releases a lease on a container:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/LeaseContainer.cs" id="Snippet_ReleaseContainerLease":::

## Break a lease

You can break a container lease if the container has an active lease. Any authorized request can break the lease; the request isn't required to specify a matching lease ID. A lease can't be renewed after it's broken, and breaking a lease prevents a new lease from being acquired for a period of time until the original lease expires or is released.

You can break a lease using one of the following methods on a [BlobLeaseClient](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient) instance:

- [Break](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.break)
- [BreakAsync](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.breakasync)

The following example breaks a lease on a container:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/LeaseContainer.cs" id="Snippet_BreakContainerLease":::

[!INCLUDE [storage-dev-guide-container-lease](../../../includes/storage-dev-guides/storage-dev-guide-container-lease.md)]

## Resources

To learn more about managing container leases using the Azure Blob Storage client library for .NET, see the following resources.

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/dotnet/BlobDevGuideBlobs/LeaseContainer.cs)

### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The client library methods for managing container leases use the following REST API operation:

- [Lease Container](/rest/api/storageservices/lease-container)

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]

### See also

- [Managing Concurrency in Blob storage](concurrency-manage.md)

[!INCLUDE [storage-dev-guide-next-steps-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-next-steps-dotnet.md)]