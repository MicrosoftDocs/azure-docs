---
title: Create and manage a blob snapshot with .NET
titleSuffix: Azure Storage
description: Learn how to use the .NET client library to create a read-only snapshot of a blob to back up blob data at a given moment in time.
author: pauljewellmsft

ms.author: pauljewell
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 08/27/2020
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp, devx-track-dotnet
---

# Create and manage a blob snapshot with .NET

A snapshot is a read-only version of a blob that's taken at a point in time. This article shows how to create and manage blob snapshots using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage).

For more information about blob snapshots in Azure Storage, see [Blob snapshots](snapshots-overview.md).

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for .NET. To learn about setting up your project, including package installation, adding `using` directives, and creating an authorized client object, see [Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to work with blob snapshots. To learn more, see the authorization guidance for the following REST API operation:
    - [Snapshot Blob](/rest/api/storageservices/snapshot-blob#authorization)

## Create a snapshot

To create a snapshot of a block blob, use one of the following methods:

- [CreateSnapshot](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.createsnapshot)
- [CreateSnapshotAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.createsnapshotasync)

The following code example shows how to create a snapshot. Include a reference to the [Azure.Identity](https://www.nuget.org/packages/azure.identity) library to use your Azure AD credentials to authorize requests to the service. For more information about using the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) class to authorize a managed identity to access Azure Storage, see [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme).

```csharp
private static async Task CreateBlockBlobSnapshot(
    string accountName,
    string containerName, 
    string blobName,
    Stream data)
{
    const string blobServiceEndpointSuffix = ".blob.core.windows.net";
    Uri containerUri = 
        new Uri("https://" + accountName + blobServiceEndpointSuffix + "/" + containerName);

    // Get a container client object and create the container.
    BlobContainerClient containerClient = new BlobContainerClient(containerUri,
        new DefaultAzureCredential());
    await containerClient.CreateIfNotExistsAsync();

    // Get a blob client object.
    BlobClient blobClient = containerClient.GetBlobClient(blobName);

    try
    {
        // Upload text to create a block blob.
        await blobClient.UploadAsync(data);

        // Add blob metadata.
        IDictionary<string, string> metadata = new Dictionary<string, string>
        {
            { "ApproxBlobCreatedDate", DateTime.UtcNow.ToString() },
            { "FileType", "text" }
        };
        await blobClient.SetMetadataAsync(metadata);

        // Sleep 5 seconds.
        System.Threading.Thread.Sleep(5000);

        // Create a snapshot of the base blob.
        // You can specify metadata at the time that the snapshot is created.
        // If no metadata is specified, then the blob's metadata is copied to the snapshot.
        await blobClient.CreateSnapshotAsync();
    }
    catch (RequestFailedException e)
    {
        Console.WriteLine(e.Message);
        Console.ReadLine();
        throw;
    }
}
```

## Delete snapshots

To delete a blob, you must first delete any snapshots of that blob. You can delete a snapshot individually, or specify that all snapshots be deleted when the source blob is deleted. If you attempt to delete a blob that still has snapshots, an error results.

To delete a blob and its snapshots, use one of the following methods, and include the [DeleteSnapshotsOption](/dotnet/api/azure.storage.blobs.models.deletesnapshotsoption) enum:

- [Delete](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.delete)
- [DeleteAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.deleteasync)
- [DeleteIfExists](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.deleteifexists)
- [DeleteIfExistsAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.deleteifexistsasync)

The following code example shows how to delete a blob and its snapshots in .NET, where `blobClient` is an object of type [BlobClient](/dotnet/api/azure.storage.blobs.blobclient):

```csharp
await blobClient.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots, null, default);
```

## Copy a blob snapshot over the base blob

You can perform a copy operation to promote a snapshot over its base blob, as long as the base blob is in an online tier (hot or cool). The snapshot remains, but its destination is overwritten with a copy that can be read and written to.

The following code example shows how to copy a blob snapshot over the base blob:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopySnapshot.cs" id="Snippet_CopySnapshot":::

## Resources

To learn more about managing blob snapshots using the Azure Blob Storage client library for .NET, see the following resources.

For related code samples using deprecated .NET version 11.x SDKs, see [Code samples using .NET version 11.x](blob-v11-samples-dotnet.md#create-a-snapshot).

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]

### See also

- [Blob snapshots](snapshots-overview.md)
- [Blob versions](versioning-overview.md)
- [Soft delete for blobs](./soft-delete-blob-overview.md)
