---
title: Delete and restore a blob container with .NET
titleSuffix: Azure Storage 
description: Learn how to delete and restore a blob container in your Azure Storage account using the .NET client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-storage
ms.topic: how-to
ms.date: 03/28/2022

ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp, devx-track-dotnet
---

# Delete and restore a blob container with .NET

This article shows how to delete containers with the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage). If you've enabled [container soft delete](soft-delete-container-overview.md), you can restore deleted containers.

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for .NET. To learn about setting up your project, including package installation, adding `using` directives, and creating an authorized client object, see [Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to delete a blob container, or to restore a soft-deleted container. To learn more, see the authorization guidance for the following REST API operations:
    - [Delete Container](/rest/api/storageservices/delete-container#authorization)
    - [Restore Container](/rest/api/storageservices/restore-container#authorization)

## Delete a container

To delete a container in .NET, use one of the following methods:

- [Delete](/dotnet/api/azure.storage.blobs.blobcontainerclient.delete)
- [DeleteAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.deleteasync)
- [DeleteIfExists](/dotnet/api/azure.storage.blobs.blobcontainerclient.deleteifexists)
- [DeleteIfExistsAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.deleteifexistsasync)

The **Delete** and **DeleteAsync** methods throw an exception if the container doesn't exist.

The **DeleteIfExists** and **DeleteIfExistsAsync** methods return a Boolean value indicating whether the container was deleted. If the specified container doesn't exist, then these methods return **False** to indicate that the container wasn't deleted.

After you delete a container, you can't create a container with the same name for at *least* 30 seconds. Attempting to create a container with the same name will fail with HTTP error code 409 (Conflict). Any other operations on the container or the blobs it contains will fail with HTTP error code 404 (Not Found).

The following example deletes the specified container, and handles the exception if the container doesn't exist:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Containers.cs" id="DeleteSampleContainerAsync":::

The following example shows how to delete all of the containers that start with a specified prefix.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Containers.cs" id="DeleteContainersWithPrefixAsync":::

## Restore a deleted container

When container soft delete is enabled for a storage account, a container and its contents may be recovered after it has been deleted, within a retention period that you specify. You can restore a soft-deleted container by calling either of the following methods of the [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) class.

- [UndeleteBlobContainer](/dotnet/api/azure.storage.blobs.blobserviceclient.undeleteblobcontainer)
- [UndeleteBlobContainerAsync](/dotnet/api/azure.storage.blobs.blobserviceclient.undeleteblobcontainerasync)

The following example finds a deleted container, gets the version ID of that deleted container, and then passes that ID into the [UndeleteBlobContainerAsync](/dotnet/api/azure.storage.blobs.blobserviceclient.undeleteblobcontainerasync) method to restore the container.

```csharp
public static async Task RestoreContainer(BlobServiceClient client, string containerName)
{
    await foreach (BlobContainerItem item in client.GetBlobContainersAsync
        (BlobContainerTraits.None, BlobContainerStates.Deleted))
    {
        if (item.Name == containerName && (item.IsDeleted == true))
        {
            try 
            { 
                await client.UndeleteBlobContainerAsync(containerName, item.VersionId);
            }
            catch (RequestFailedException e)
            {
                Console.WriteLine("HTTP error code {0}: {1}",
                e.Status, e.ErrorCode);
                Console.WriteLine(e.Message);
            }
        }
    }
}
```

## Resources

To learn more about deleting a container using the Azure Blob Storage client library for .NET, see the following resources.

### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The client library methods for deleting or restoring a container use the following REST API operations:

- [Delete Container](/rest/api/storageservices/delete-container) (REST API)
- [Restore Container](/rest/api/storageservices/restore-container) (REST API)

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]

### See also

- [Soft delete for containers](soft-delete-container-overview.md)
- [Enable and manage soft delete for containers](soft-delete-container-enable.md)
