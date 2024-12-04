---
title: Transfer data with the Data Movement library for .NET
titleSuffix: Azure Storage
description: Use the Data Movement library to move or copy data to or from blob and file content. Copy data to Azure Storage from local files, or copy data within or between storage accounts. Easily migrate your data to Azure Storage.
services: storage
author: pauljewellmsft

ms.service: azure-storage
ms.topic: how-to
ms.date: 08/14/2024
ms.author: pauljewell
ms.subservice: storage-common-concepts
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-dotnet
---

# Transfer data with the Data Movement library

The Azure Storage Data Movement library is a cross-platform open source library that is designed for high performance uploading, downloading, and copying of blobs and files. The Data Movement library provides convenient methods that aren't available in the Azure Storage client library for .NET. These methods allow you to set the number of parallel operations, track transfer progress, resume a canceled transfer, and more.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Azure storage account - [create a storage account](../../articles/storage/common/storage-account-create.md)
- Latest [.NET SDK](https://dotnet.microsoft.com/download/dotnet) for your operating system. Be sure to get the SDK and not the runtime.

## Set up your environment

If you don't have an existing project, this section shows you how to set up a project to work with the Azure Blob Storage client library for .NET. The steps include package installation, adding `using` directives, and creating an authorized client object. For details, see [Get started with Azure Blob Storage and .NET](../../articles/storage/blobs/storage-blob-dotnet-get-started.md).

#### Install packages

From your project directory, install packages for the Azure Storage Data Movement client library and the Azure Identity client library using the `dotnet add package` command. The Azure.Identity package is needed for passwordless connections to Azure services.

```dotnetcli
dotnet add package Azure.Storage.DataMovement
dotnet add package Azure.Storage.DataMovement.Blobs
dotnet add package Azure.Identity
```

#### Add `using` directives

Add these `using` directives to the top of your code file:

```csharp
using Azure.Identity;
using Azure.Storage.DataMovement;
using Azure.Storage.DataMovement.Blobs;
```

#### Authorization

The authorization mechanism must have the necessary permissions to perform upload, download, or copy operations. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Contributor** or higher.

## About the Data Movement library

The Azure Storage Data Movement library consists of a common client library, and extension libraries for Azure Blob Storage and Azure Files. The common library provides the core functionality for transferring data, while the extension libraries provide functionality specific to Blob Storage and Azure Files. To learn more, see the following resources:

- [Azure.Storage.DataMovement](/dotnet/api/overview/azure/storage.datamovement-readme)
- [Azure.Storage.DataMovement.Blobs](/dotnet/api/overview/azure/storage.datamovement.blobs-readme)
- [Azure.Storage.DataMovement.Files.Shares](/dotnet/api/overview/azure/storage.datamovement.files.shares-readme)

## Create a `TransferManager` object

[TransferManager](/dotnet/api/azure.storage.datamovement.transfermanager) is the main class for starting and controlling all types of transfers, including upload, download, and copy. In this section, you learn how to create a `TransferManager` object to work with local files, Blob Storage, or Azure Files.

> [!NOTE]
> A best practice for Azure SDK client management is to treat a client as a singleton, meaning that a class only has one object at a time. There's no need to keep more than one instance of a client for a given set of constructor parameters or client options.

The following code shows how to create a `TransferManager` object:

```csharp
TransferManager transferManager = new(new TransferManagerOptions());
```

You can optionally provide an instance of [TransferManagerOptions] to the constructor, which applies certain configuration options to all transfers started by the `TransferManager` object.

## Create a `StorageResource` object

[StorageResource](/dotnet/api/azure.storage.datamovement.storageresource) is the base class for all storage resources, including blobs and files. To create a `StorageResource` object, use one of the following provider classes:

- [BlobsStorageResourceProvider](/dotnet/api/azure.storage.datamovement.blobs.blobsstorageresourceprovider): Use this class to create `StorageResource` instances for a blob container, block blob, append blob, or page blob. 
- [ShareFilesStorageResourceProvider](/dotnet/api/azure.storage.datamovement.files.shares.sharefilesstorageresourceprovider): Use this class to create `StorageResource` instances for a file or directory.
- [LocalFilesStorageResourceProvider](/dotnet/api/azure.storage.datamovement.localfilesstorageresourceprovider): Use this class to create `StorageResource` instances for a local file system.

### Create a `StorageResource` object for Blob Storage

The following code shows how to create a `StorageResource` object for blob containers and blobs using a `Uri`:

```csharp
// Create a token credential
TokenCredential tokenCredential = new DefaultAzureCredential();

BlobsStorageResourceProvider provider = new(tokenCredential);

// Get a container resource
StorageResource container = provider.FromContainer(
    new Uri("http://<storage-account-name>.blob.core.windows.net/sample-container"));

// Get a block blob resource - default is block blob
StorageResource blockBlob = provider.FromBlob(
    new Uri("http://<storage-account-name>.blob.core.windows.net/sample-container/sample-block-blob"),
    new BlockBlobStorageResourceOptions());

// Use a similar approach to get a page blob or append blob resource
```

You can also create a `StorageResource` object using a client object from **Azure.Storage.Blobs**:

```csharp
// Create a token credential
TokenCredential tokenCredential = new DefaultAzureCredential();

BlobsStorageResourceProvider provider = new(tokenCredential);

BlobContainerClient blobContainerClient = new(
    new Uri("https://<storage-account-name>.blob.core.windows.net/sample-container"),
    tokenCredential);
StorageResource containerResource = provider.FromClient(blobContainerClient);

BlockBlobClient blockBlobClient = new(
    new Uri("https://<storage-account-name>.blob.core.windows.net/sample-container/sample-block-blob"),
    tokenCredential);
StorageResource blockBlobResource = provider.FromClient(blockBlobClient);

// Use a similar approach to get a page blob or append blob resource
```

## Example: Start a new transfer

Transfers are defined by a source and a destination. Both the source and destination are type `StorageResource`, which can be either `StorageResourceContainer` or `StorageResourceItem`. For a given transfer, the source and destination must be of the same kind. For example, if the source is a blob container, the destination must be a blob container.

You can start a new transfer by calling the following method:

- [TransferManager.StartTransferAsync](/dotnet/api/azure.storage.datamovement.transfermanager.starttransferasync)

This method returns a [DataTransfer](/dotnet/api/azure.storage.datamovement.datatransfer) object that represents the transfer. You can use the `DataTransfer` object to monitor the transfer progress or obtain the transfer ID. The transfer ID is a unique identifier for the transfer that's needed to [resume a transfer](#example-resume-an-existing-transfer) or pause a transfer.

### Upload a local file to a blob

The following code example shows how to start a new transfer to upload a local file to a blob:

```csharp
// Create a token credential
TokenCredential tokenCredential = new DefaultAzureCredential();

TransferManager transferManager = new(new TransferManagerOptions());

LocalFilesStorageResourceProvider localFilesProvider = new();

BlobsStorageResourceProvider blobsProvider = new(tokenCredential);

string localFilePath = "C:/path/to/file.txt";
Uri blobUri = new Uri("https://<storage-account-name>.blob.core.windows.net/sample-container/sample-blob");

DataTransfer dataTransfer = await transferManager.StartTransferAsync(
    sourceResource: localFilesProvider.FromFile(localFilePath),
    destinationResource: blobsProvider.FromBlob(
        new Uri(blobUri)));
await dataTransfer.WaitForCompletionAsync();
```

### Copy a container or blob

You can use the Data Movement library to copy between two `StorageResource` instances. For blob resources, the transfer uses the [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) operation, which performs a server-to-server copy. 

The following code example shows how to start a new transfer to copy a source blob container to a destination blob container:

```csharp
Uri sourceContainerUri = new Uri("https://<storage-account-name>.blob.core.windows.net/source-container");
Uri destinationContainerUri = new Uri("https://<storage-account-name>.blob.core.windows.net/dest-container");

DataTransfer dataTransfer = await transferManager.StartTransferAsync(
    sourceResource: blobsProvider.FromContainer(
        sourceContainerUri,
        new BlobStorageResourceContainerOptions()
        {
            BlobDirectoryPrefix = "source/directory/prefix"
        }),
    destinationResource: blobsProvider.FromContainer(
        destinationContainerUri,
        new BlobStorageResourceContainerOptions()
        {
            // All source blobs are copied as a single type of destination blob
            // Defaults to block blob, if not specified
            BlobType = new(BlobType.Block),
            BlobDirectoryPrefix = "destination/directory/prefix"
        }
        )
    );
await dataTransfer.WaitForCompletionAsync();
```

The following code example shows how to start a new transfer to copy a source blob to a destination blob:

```csharp
Uri sourceBlobUri = new Uri(
    "https://<storage-account-name>.blob.core.windows.net/source-container/source-blob");
Uri destinationBlobUri = new Uri(
    "https://<storage-account-name>.blob.core.windows.net/dest-container/dest-blob");

DataTransfer dataTransfer = await transferManager.StartTransferAsync(
    sourceResource: blobs.FromBlob(sourceBlobUri),
    destinationResource: blobs.FromBlob(destinationBlobUri, new BlockBlobStorageResourceOptions()));
await dataTransfer.WaitForCompletionAsync();
```

## Example: Resume an existing transfer

By persisting transfer progress to disk, the Data Movement library allows you to resume a transfer that failed before completion, or was otherwise canceled or paused. To resume a transfer, the `TransferManager` object must be configured with `StorageResourceProvider` instances that are capable of reassembling the transfer from the persisted data. You can use the `ResumeProviders` property of the [TransferManagerOptions](/dotnet/api/azure.storage.datamovement.transfermanageroptions) class to specify the providers.

The following code example shows how to initialize a `TransferManager` object that's capable of resuming a transfer between the local file system and Blob Storage:

```csharp
// Create a token credential
TokenCredential tokenCredential = new DefaultAzureCredential();

LocalFilesStorageResourceProvider localFilesProvider = new();

BlobsStorageResourceProvider blobsProvider = new(tokenCredential);

TransferManager transferManager = new(new TransferManagerOptions()
{
    ResumeProviders = new List<StorageResourceProvider>()
    {
        localFilesProvider,
        blobsProvider
    }
});
```

To resume a transfer, call the following method:

- [TransferManager.ResumeTransferAsync](/dotnet/api/azure.storage.datamovement.transfermanager.resumetransferasync)

Provide the transfer ID of the transfer that you want to resume. The transfer ID is a unique identifier for the transfer that's returned as part of the `DataTransfer` object when the transfer is started. If you don't know the transfer ID value, you can call [TransferManager.GetTransfersAsync](/dotnet/api/azure.storage.datamovement.transfermanager.gettransfersasync) to find the transfer and it's corresponding ID.

The following code example shows how to resume a transfer:

```csharp
DataTransfer resumedTransfer = await transferManager.ResumeTransferAsync(transferId: ID);
```

> [!NOTE]
> The location of the persisted transfer data is different than the default location if [TransferCheckpointStoreOptions](/dotnet/api/azure.storage.datamovement.transfercheckpointstoreoptions) is set as part of`TransferManagerOptions`. To resume transfers recorded with a custom checkpoint store, you must provide the same checkpoint store options for the `TransferManager` object that resumes the transfer.

## Example: Monitor transfer progress

Transfers can be monitored and observed through several mechanisms, depending on the needs of your app. In this section, you learn how to monitor transfer progress using the `DataTransfer` object, and how to monitor a transfer using events.

## Example: Use extension methods for `BlobContainerClient`



## Next steps

[Azure Storage Data Movement library reference documentation](https://azure.github.io/azure-storage-net-data-movement).

[!INCLUDE [storage-try-azure-tools-blobs](../../../includes/storage-try-azure-tools-blobs.md)]
