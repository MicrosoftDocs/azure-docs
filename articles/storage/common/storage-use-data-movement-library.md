---
title: Transfer data with the Data Movement library for .NET
titleSuffix: Azure Storage
description: Use the Data Movement library to move or copy data to or from blob and file content. Copy data to Azure Storage from local files, or copy data within or between storage accounts. Easily migrate your data to Azure Storage.
services: storage
author: pauljewellmsft

ms.service: azure-storage
ms.topic: how-to
ms.date: 02/11/2025
ms.author: pauljewell
ms.subservice: storage-common-concepts
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-dotnet
# Customer intent: "As a .NET developer working with Azure Storage, I want to transfer data using the Data Movement library, so that I can efficiently manage uploads, downloads, and copies of blobs and files within Azure Storage."
---

# Transfer data with the Data Movement library

The Azure Storage Data Movement library is a cross-platform open source library that is designed for high performance uploading, downloading, and copying of blobs and files. The Data Movement library provides convenient methods that aren't available in the Azure Storage client library for .NET. These methods allow you to set the number of parallel operations, track transfer progress, resume a canceled transfer, and more.

The Data Movement library is only available for .NET, and only supports Azure Blob Storage and Azure Files. You should consider these limitations and other [known issues](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/storage/Azure.Storage.DataMovement/KnownIssues.md#known-issues) when deciding whether to use the Data Movement library.

If you're migrating code from the older **Microsoft.Azure.Storage.DataMovement** library (version 2.X.X) to the current **Azure.Storage.DataMovement** library (version 12.X.X), see the [Migration guide](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/storage/Azure.Storage.DataMovement/MigrationGuide.md#migration-guide-from-microsoftazurestoragedatamovement-to-azurestoragedatamovement).


[API reference docs](/dotnet/api/azure.storage.datamovement) | [Source code](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/storage/Azure.Storage.DataMovement) | [Package (NuGet)](https://www.nuget.org/packages/Azure.Storage.DataMovement) | Samples: [Blobs](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/storage/Azure.Storage.DataMovement.Blobs/samples) / [Files.Shares](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/storage/Azure.Storage.DataMovement.Files.Shares/samples)

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Azure storage account - [create a storage account](storage-account-create.md)
- Latest [.NET SDK](https://dotnet.microsoft.com/download/dotnet) for your operating system. Be sure to get the SDK and not the runtime.

## Set up your environment

If you don't have an existing project, this section shows you how to set up a project to work with the Azure Blob Storage client library for .NET. The steps include package installation, adding `using` directives, and creating an authorized client object.

#### Install packages

From your project directory, install packages for the Azure Storage Data Movement client library and the Azure Identity client library using the `dotnet add package` command. The **Azure.Identity** package is needed for passwordless connections to Azure services.

```dotnetcli
dotnet add package Azure.Storage.DataMovement
dotnet add package Azure.Storage.DataMovement.Blobs
dotnet add package Azure.Identity
```

To work with extension library for Azure Files, install the **Azure.Storage.DataMovement.Files.Shares** package:

```dotnetcli
dotnet add package Azure.Storage.DataMovement.Files.Shares
```

#### Add `using` directives

To run the code examples in this article, add the following `using` directives:

```csharp
using Azure;
using Azure.Core;
using Azure.Identity;
using Azure.Storage.DataMovement;
using Azure.Storage.DataMovement.Blobs;
```

If you're using the extension library for Azure Files, add the following `using` directive:

```csharp
using Azure.Storage.DataMovement.Files.Shares;
```

#### Authorization

The authorization mechanism must have the necessary permissions to perform upload, download, or copy operations. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Contributor** or higher.

## About the Data Movement library

The Azure Storage Data Movement library consists of a common client library, and extension libraries for Azure Blob Storage and Azure Files. The common library provides the core functionality for transferring data, while the extension libraries provide functionality specific to Blob Storage and Azure Files. To learn more, see the following resources:

- [Azure.Storage.DataMovement](/dotnet/api/overview/azure/storage.datamovement-readme)
- [Azure.Storage.DataMovement.Blobs](/dotnet/api/overview/azure/storage.datamovement.blobs-readme)
- [Azure.Storage.DataMovement.Files.Shares](/dotnet/api/overview/azure/storage.datamovement.files.shares-readme)

## Create a `TransferManager` object

[TransferManager](/dotnet/api/azure.storage.datamovement.transfermanager) is the main class for starting and controlling all types of transfers, including upload, download, and copy. In this section, you learn how to create a `TransferManager` object to work with a local file system, Blob Storage, or Azure Files.

> [!NOTE]
> A best practice for Azure SDK client management is to treat a client as a singleton, meaning that a class only has one object at a time. There's no need to keep more than one instance of a client for a given set of constructor parameters or client options.

The following code shows how to create a `TransferManager` object:

```csharp
TransferManager transferManager = new(new TransferManagerOptions());
```

You can optionally provide an instance of [TransferManagerOptions](/dotnet/api/azure.storage.datamovement.transfermanageroptions) to the constructor, which applies certain configuration options to all transfers started by the `TransferManager` object. The following configuration options are available:

- [CheckpointStoreOptions](/dotnet/api/azure.storage.datamovement.transfermanageroptions.checkpointstoreoptions): Optional. Defines the options for creating a checkpoint used for saving transfer state so transfers can be resumed.
- [Diagnostics](/dotnet/api/azure.storage.datamovement.transfermanageroptions.diagnostics): Gets the transfer manager diagnostic options.
- [ErrorHandling](/dotnet/api/azure.storage.datamovement.transfermanageroptions.errorhandling): Optional. Defines how errors are handled during a transfer. Default is `StopOnAnyFailure`.
- [MaximumConcurrency](/dotnet/api/azure.storage.datamovement.transfermanageroptions.maximumconcurrency): The maximum number of workers that can be used in a parallel transfer.
- [ProvidersForResuming](/dotnet/api/azure.storage.datamovement.transfermanageroptions.providersforresuming): Resource providers for the transfer manager to use in resuming a transfer. Expects one provider for each storage provider in use. To learn more, see [Resume an existing transfer](#resume-an-existing-transfer).

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

BlobsStorageResourceProvider blobsProvider = new(tokenCredential);

// Get a container resource
StorageResource container = await blobsProvider.FromContainerAsync(
    new Uri("http://<storage-account-name>.blob.core.windows.net/sample-container"));

// Get a block blob resource - default is block blob
StorageResource blockBlob = await blobsProvider.FromBlobAsync(
    new Uri("http://<storage-account-name>.blob.core.windows.net/sample-container/sample-block-blob"),
    new BlockBlobStorageResourceOptions());

// Use a similar approach to get a page blob or append blob resource
```

You can also create a `StorageResource` object using a client object from **Azure.Storage.Blobs**.

```csharp
// Create a token credential
TokenCredential tokenCredential = new DefaultAzureCredential();

BlobContainerClient blobContainerClient = new(
    new Uri("https://<storage-account-name>.blob.core.windows.net/sample-container"),
    tokenCredential);
StorageResource containerResource = BlobsStorageResourceProvider.FromClient(blobContainerClient);

BlockBlobClient blockBlobClient = blobContainerClient.GetBlockBlobClient("sample-block-blob");
StorageResource blockBlobResource = BlobsStorageResourceProvider.FromClient(blockBlobClient);

// Use a similar approach to get a page blob or append blob resource
```

## Start a new transfer

All transfers need to specify a source and a destination. Both the source and destination are type `StorageResource`, which can be either `StorageResourceContainer` or `StorageResourceItem`. For a given transfer, the source and destination must be of the same kind. For example, if the source is a blob container, the destination must be a blob container.

You can start a new transfer by calling the following method:

- [TransferManager.StartTransferAsync](/dotnet/api/azure.storage.datamovement.transfermanager.starttransferasync)

This method returns a [TransferOperation](/dotnet/api/azure.storage.datamovement.transferoperation) object that represents the transfer. You can use the `TransferOperation` object to monitor the transfer progress or obtain the transfer ID. The transfer ID is a unique identifier for the transfer that's needed to [resume a transfer](#resume-an-existing-transfer) or pause a transfer.

You can optionally provide an instance of [TransferOptions](/dotnet/api/azure.storage.datamovement.transferoptions) to `StartTransferAsync` or `ResumeTransferAsync`, which applies certain configuration options to a specific transfer. The following configuration options are available:

- [CreationMode](/dotnet/api/azure.storage.datamovement.transferoptions.creationmode): Configures the behavior when a transfer encounters a resource that already exists. Defaults to `FailIfExists` when starting a new transfer. When you resume a transfer, the defaults can vary. For all resources successfully enumerated when the transfer started, `CreationMode` defaults to the initial value used. For any remaining resources, the regular default value applies.
- [InitialTransferSize](/dotnet/api/azure.storage.datamovement.transferoptions.initialtransfersize): The size of the first range request in bytes. Single transfer sizes smaller than this limit are uploaded or downloaded in a single request. Transfers larger than this limit continue being downloaded or uploaded in chunks of size [MaximumTransferChunkSize](/dotnet/api/azure.storage.datamovement.transferoptions.maximumtransferchunksize). The default value is 32 MiB. When you resume a transfer, the default value is the value specified when the transfer first started.
- [MaximumTransferChunkSize](/dotnet/api/azure.storage.datamovement.transferoptions.maximumtransferchunksize): The maximum size to use for each chunk when transferring data in chunks. The default value is 4 MiB. When you resume a transfer, the default value is the value specified when the transfer first started.
- [ProgressHandlerOptions](/dotnet/api/azure.storage.datamovement.transferoptions.progresshandleroptions): Optional. Options for changing behavior of the ProgressHandler.

### Example: Upload a local directory to a blob container

The following code example shows how to start a new transfer to upload a local directory to a blob container:

```csharp
// Create a token credential
TokenCredential tokenCredential = new DefaultAzureCredential();

TransferManager transferManager = new(new TransferManagerOptions());

BlobsStorageResourceProvider blobsProvider = new(tokenCredential);

string localDirectoryPath = "C:/path/to/directory";
Uri blobContainerUri = new Uri("https://<storage-account-name>.blob.core.windows.net/sample-container");

TransferOperation transferOperation = await transferManager.StartTransferAsync(
    sourceResource: LocalFilesStorageResourceProvider.FromDirectory(localDirectoryPath),
    destinationResource: await blobsProvider.FromContainerAsync(blobContainerUri));
await transferOperation.WaitForCompletionAsync();
```

### Example: Copy a container or blob

You can use the Data Movement library to copy between two `StorageResource` instances. For blob resources, the transfer uses the [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) operation, which performs a server-to-server copy.

The following code example shows how to start a new transfer to copy all blobs in a source blob container to a destination blob container. The destination container must already exist. In this example, we set [CreationMode](/dotnet/api/azure.storage.datamovement.storageresourcecreationmode) to `OverwriteIfExists` to overwrite any destination blobs that already exist. You can adjust the `CreationMode` property based on the needs of your app.

```csharp
Uri sourceContainerUri = new Uri("https://<storage-account-name>.blob.core.windows.net/source-container");
Uri destinationContainerUri = new Uri("https://<storage-account-name>.blob.core.windows.net/dest-container");

TransferOperation transferOperation = await transferManager.StartTransferAsync(
    sourceResource: await blobsProvider.FromContainerAsync(
        sourceContainerUri,
        new BlobStorageResourceContainerOptions()
        {
            BlobPrefix = "source/directory/prefix"
        }),
    destinationResource: await blobsProvider.FromContainerAsync(
        destinationContainerUri,
        new BlobStorageResourceContainerOptions()
        {
            // All source blobs are copied as a single type of destination blob
            // Defaults to block blob, if not specified
            BlobType = BlobType.Block,
            BlobPrefix = "destination/directory/prefix"
        }),
    transferOptions: new TransferOptions()
    {
        CreationMode = StorageResourceCreationMode.OverwriteIfExists,
    }
);
await transferOperation.WaitForCompletionAsync();
```

The following code example shows how to start a new transfer to copy a source blob to a destination blob. In this example, we set [CreationMode](/dotnet/api/azure.storage.datamovement.storageresourcecreationmode) to `OverwriteIfExists` to overwrite the destination blob if it already exists. You can adjust the `CreationMode` property based on the needs of your app.

```csharp
Uri sourceBlobUri = new Uri(
    "https://<storage-account-name>.blob.core.windows.net/source-container/source-blob");
Uri destinationBlobUri = new Uri(
    "https://<storage-account-name>.blob.core.windows.net/dest-container/dest-blob");

TransferOperation transferOperation = await transferManager.StartTransferAsync(
    sourceResource: await blobsProvider.FromBlobAsync(sourceBlobUri),
    destinationResource: await blobsProvider.FromBlobAsync(destinationBlobUri, new BlockBlobStorageResourceOptions()),
    transferOptions: new TransferOptions()
    {
        CreationMode = StorageResourceCreationMode.OverwriteIfExists,
    }
);
await transferOperation.WaitForCompletionAsync();
```

## Resume an existing transfer

By persisting transfer progress to disk, the Data Movement library allows you to resume a transfer that failed before completion, or was otherwise canceled or paused. To resume a transfer, the `TransferManager` object must be configured with `StorageResourceProvider` instances that are capable of reassembling the transfer from the persisted data. You can use the `ProvidersForResuming` property of the [TransferManagerOptions](/dotnet/api/azure.storage.datamovement.transfermanageroptions) class to specify the providers.

The following code example shows how to initialize a `TransferManager` object that's capable of resuming a transfer between the local file system and Blob Storage:

```csharp
// Create a token credential
TokenCredential tokenCredential = new DefaultAzureCredential();

TransferManager transferManager = new(new TransferManagerOptions()
{
    ProvidersForResuming = new List<StorageResourceProvider>()
    {
        new BlobsStorageResourceProvider(tokenCredential)
    }
});
```

To resume a transfer, call the following method:

- [TransferManager.ResumeTransferAsync](/dotnet/api/azure.storage.datamovement.transfermanager.resumetransferasync)

Provide the transfer ID of the transfer that you want to resume. The transfer ID is a unique identifier for the transfer that's returned as part of the `TransferOperation` object when the transfer is started. If you don't know the transfer ID value, you can call [TransferManager.GetTransfersAsync](/dotnet/api/azure.storage.datamovement.transfermanager.gettransfersasync) to find the transfer and its corresponding ID.

The following code example shows how to resume a transfer:

```csharp
TransferOperation resumedTransfer = await transferManager.ResumeTransferAsync(transferId: ID);
```

> [!NOTE]
> The location of the persisted transfer data is different than the default location if [TransferCheckpointStoreOptions](/dotnet/api/azure.storage.datamovement.transfercheckpointstoreoptions) is set as part of `TransferManagerOptions`. To resume transfers recorded with a custom checkpoint store, you must provide the same checkpoint store options for the `TransferManager` object that resumes the transfer.

## Monitor transfer progress

Transfers can be monitored and observed through several mechanisms, depending on the needs of your app. In this section, you learn how to monitor transfer progress using the `TransferOperation` object, and how to monitor a transfer using `TransferOptions` events.

### Example: Monitor transfer progress using the `TransferOperation` object

You can monitor transfer progress using the `TransferOperation` object returned by the `StartTransferAsync` method. You can also call [TransferManager.GetTransfersAsync](/dotnet/api/azure.storage.datamovement.transfermanager.gettransfersasync) to enumerate all transfers for a `TransferManager` object.

The following code example shows how to iterate over all transfers and write the state of each transfer to a log file:

```csharp
async Task CheckTransfersAsync(TransferManager transferManager)
{
    await foreach (TransferOperation transfer in transferManager.GetTransfersAsync())
    {
        using StreamWriter logStream = File.AppendText("path/to/log/file");
        logStream.WriteLine(Enum.GetName(typeof(TransferState), transfer.Status.State));
    }
}
```

[TransferStatus](/dotnet/api/azure.storage.datamovement.transferstatus) defines the status of the transfer job. `TransferStatus` includes the following properties:

| Property | Type | Description |
| --- | --- | --- |
| `HasCompletedSuccessfully` | Boolean | Represents if the transfer completes successfully without any failure or skipped items. |
| `HasFailedItems` | Boolean | Represents if transfer has any failure items. If set to `true`, the transfer has at least one failure item. If set to `false`, the transfer currently has no failures. |
| `HasSkippedItems` | Boolean | Represents if transfer has any skipped items. If set to `true`, the transfer has at least one skipped item. If set to `false`, the transfer currently has no skipped items. It's possible to never have any items skipped if `SkipIfExists` isn't enabled in [TransferOptions.CreationMode](/dotnet/api/azure.storage.datamovement.transferoptions.creationmode). |
| `State` | [TransferState](/dotnet/api/azure.storage.datamovement.transferstate) | Defines the types of the state a transfer can have. See [TransferState](/dotnet/api/azure.storage.datamovement.transferstate) for details. |

### Example: Monitor transfer progress using `TransferOptions` events

You can monitor transfer progress by listening for events provided by the [TransferOptions](/dotnet/api/azure.storage.datamovement.transferoptions) class. The `TransferOptions` instance is passed to the `StartTransferAsync` method and provides [events](/dotnet/api/azure.storage.datamovement.transferoptions#events) that are triggered when a transfer completes, fails, is skipped, or changes status.

The following code example shows how to listen for a transfer completion event using `TransferOptions`:

```csharp
async Task<TransferOperation> ListenToTransfersAsync(
    TransferManager transferManager,
    StorageResource source,
    StorageResource destination)
{
    TransferOptions transferOptions = new();
    transferOptions.ItemTransferCompleted += (TransferItemCompletedEventArgs args) =>
    {
        using (StreamWriter logStream = File.AppendText("path/to/log/file"))
        {
            logStream.WriteLine($"File Completed Transfer: {args.Source.Uri.AbsoluteUri}");
        }
        return Task.CompletedTask;
    };
    return await transferManager.StartTransferAsync(
        source,
        destination,
        transferOptions);
}
```

## Use extension methods for `BlobContainerClient`

For applications with existing code that uses the `BlobContainerClient` class from **Azure.Storage.Blobs**, you can use extension methods to start transfers directly from a `BlobContainerClient` object. The extension methods are provided in the [BlobContainerClientExtensions](/dotnet/api/azure.storage.blobs.blobcontainerclientextensions) class (or [ShareDirectoryClientExtensions](/dotnet/api/azure.storage.files.shares.sharedirectoryclientextensions) for Azure Files), and provide some of the benefits of using `TransferManager` with minimal code changes. In this section, you learn how to use the extension methods to perform transfers from a `BlobContainerClient` object.

Install the **Azure.Storage.Blobs** package if you don't have it already:

```dotnetcli
dotnet add package Azure.Storage.Blobs
```

Add the following `using` directives to the top of your code file:

```csharp
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
```

The following code example shows how to instantiate a `BlobContainerClient` for a blob container named `sample-container`: 

```csharp
// Create a token credential
TokenCredential tokenCredential = new DefaultAzureCredential();

BlobServiceClient client = new BlobServiceClient(
    new Uri("https://<storage-account-name>.blob.core.windows.net"),
    tokenCredential);

BlobContainerClient containerClient = client.GetBlobContainerClient("sample-container");
```

The following code example shows how to upload local directory contents to `sample-container` using `UploadDirectoryAsync`:

```csharp
TransferOperation transfer = await containerClient
    .UploadDirectoryAsync(WaitUntil.Started, "local/directory/path");

await transfer.WaitForCompletionAsync();
```

The following code example shows how to download the contents of `sample-container` to a local directory using `DownloadToDirectoryAsync`:

```csharp
TransferOperation transfer = await containerClient
    .DownloadToDirectoryAsync(WaitUntil.Started, "local/directory/path");

await transfer.WaitForCompletionAsync();
```

To learn more about the extension methods for `BlobContainerClient`, see [Extensions on BlobContainerClient](/dotnet/api/overview/azure/storage.datamovement.blobs-readme#extensions-on-blobcontainerclient).

## Next step

- Code samples for [DataMovement.Blobs](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/storage/Azure.Storage.DataMovement.Blobs/samples) and [DataMovement.Files.Shares](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/storage/Azure.Storage.DataMovement.Files.Shares/samples) are available in the Azure SDK for .NET GitHub repository.
