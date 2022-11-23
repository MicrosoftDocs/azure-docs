---
title: Tune uploads and downloads with Azure Storage client library for .NET - Azure Storage
description: Learn how to tune your uploads and downloads for better performance with Azure Storage client library for .NET. 
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.service: storage
ms.topic: how-to
ms.date: 11/18/2022
ms.subservice: blobs
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp
---

# Tune your uploads and downloads with Azure Storage client library for .NET

When transferring data with the Azure Storage client libraries for .NET, there are many factors that can affect speed, memory usage, and even the success or failure of the request. For example, every time a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) method is called, an HTTP request is sent to the service. This request requires a connection to be established between the client and server, which is an expensive operation that takes time and resources to process.

This article walks through several considerations and best practices to improve performance on data transfers using client library methods. 

## Performance tuning with `StorageTransferOptions`

Properly tuning the values in [StorageTransferOptions](/dotnet/api/azure.storage.storagetransferoptions) is key to reliable performance for data transfer operations. Storage transfers are partitioned into several subtransfers, or workers, based on the property values defined in this struct. The following sections describe each property in `StorageTransferOptions` and offer guidance for proper tuning.

This article will focus primarily on block blobs, but this guidance applies to APIs that accept `StorageTransferOptions` as a parameter, including:

- `BlobClient.UploadAsync(Stream stream, ...)`
- `BlobClient.UploadAsync(string path, ...)`
- `BlobClient.DownloadToAsync(Stream stream, ...)`
- `BlobClient.DownloadToAsync(string path, ...)`
- `DataLakeFileClient.UploadAsync(Stream stream, ...)`
- `DataLakeFileClient.UploadAsync(string path, ...)`
- `DataLakeFileClient.ReadToAsync(Stream stream, ...)`
- `DataLakeFileClient.ReadToAsync(string path, ...)`

This example shows how to define values for `StorageTransferOptions` and pass these options into the call to `UploadAsync`:

```csharp
// Specify the StorageTransferOptions and upload data from file
BlobUploadOptions options = new BlobUploadOptions
{
    TransferOptions = new StorageTransferOptions
    {
        // Set the maximum number of parallel transfer workers to 1
        MaximumConcurrency = 1,

        // Set the initial transfer length to 4 MiB
        InitialTransferSize = 4 * 1024 * 1024,

        // Set the maximum length of a transfer to 4 MiB
        MaximumTransferSize = 4 * 1024 * 1024
    }
};

await blobClient.UploadAsync(localFilePath, options);
```

### `InitialTransferSize`

[InitialTransferSize](/dotnet/api/azure.storage.storagetransferoptions.initialtransfersize) is the size of the first range request in bytes. Blobs smaller than this size will be transferred in a single request. Blobs larger than this size will continue being transferred in chunks of size `MaximumTransferSize`.

It's important to note that `MaximumTransferSize` *doesn't* limit the value you define for `InitialTransferSize`. In fact, it's often the case that you'll want `InitialTransferSize` to be *at least* as large as the value you define for `MaximumTransferSize`, if not larger. `InitialTransferSize` defines a separate size limitation for an initial attempt to do the entire operation at once with no subtransfers. This cuts down on overhead for some data sizes relative to `MaximumTransferSize`. 

If you're unsure of what is best for you, a safe option is to set `InitialTransferSize` to the same value used for `MaximumTransferSize`.

### `MaximumConcurrency`
[MaximumConcurrency](/dotnet/api/azure.storage.storagetransferoptions.maximumconcurrency) is the maximum number of workers, or subtransfers, that may be used in a parallel transfer. Currently, only asynchronous operations can parallelize transfers. Synchronous operations will ignore this value and work in sequence.

The effectiveness of this value is subject to connection pool limits in .NET, which may restrict performance by default in certain scenarios. To learn more about connection pool limits in .NET, see [.NET Framework Connection Pool Limits and the new Azure SDK for .NET](https://devblogs.microsoft.com/azure-sdk/net-framework-connection-pool-limits/).

### `MaximumTransferSize`

[MaximumTransferSize](/dotnet/api/azure.storage.storagetransferoptions.maximumtransfersize) is the maximum length of a transfer in bytes. As mentioned earlier, this value *doesn't* limit `InitialTransferSize`, which can be larger than `MaximumTransferSize`. To keep data moving efficiently, the client libraries may not always reach this value for every transfer. Depending on the REST API, the maximum supported value for transfer size can vary. For example, block blobs calling the [Put Block](/rest/api/storageservices/put-block#remarks) operation with a service version of 2019-12-12 or later have a maximum block size of 4000 MiB. For more information on transfer size limits for Blob storage, see the chart in [Scale targets for Blob storage](scalability-targets.md#scale-targets-for-blob-storage).

While the `StorageTransferOptions` struct contains nullable values, the client libraries will use defaults for each individual value, if not provided. These defaults are typically performant in a data center environment, but not likely to be suitable for home consumer environments. Poorly tuned `StorageTransferOptions` can result in excessively long operations and even request timeouts. It's best to be proactive in testing the values in `StorageTransferOptions`, and tuning them based on the needs of your application and environment.

## Uploads

During an upload, the Storage client libraries will split a given upload stream into multiple subuploads based on the values defined in `StorageTransferOptions`. Each subupload has its own dedicated call to the REST operation. For a `BlobClient` object or `BlockBlobClient` object, this operation is [Put Block](/rest/api/storageservices/put-block). For a `DataLakeFileClient` object, this operation is [Append Data](/rest/api/storageservices/datalakestoragegen2/path/update). The Storage client library manages these REST operations in parallel (depending on transfer options) to complete the full upload.

> [!NOTE]
> Block blobs have a maximum block count of 50,000 blocks. The maximum size of your block blob, then, is 50,000 times `MaximumTransferSize`.

### Buffering on uploads

The Storage REST layer doesn’t support picking up a REST upload operation where you left off. Individual transfers are either completed or lost. To ensure resiliency for non-seekable stream uploads, the Storage client libraries buffer data for each individual REST call before starting the upload. In addition to network speed limitations, this buffering behavior is a reason to consider a smaller value for `MaximumTransferSize`, even when uploading in sequence. `MaximumTransferSize` is the maximum division of data to be retried after a connection failure, so a smaller value will reduce the buffering time.

Another scenario where buffering occurs is when you're uploading data with parallel REST calls to maximize network throughput. The client libraries need sources they can read from in parallel, and since streams are sequential, the Storage client libraries will buffer the data for each individual REST call before starting the upload. This buffering behavior occurs even if the provided stream is seekable.

To avoid this buffering behavior during an asynchronous upload call, you must provide a seekable stream and set `MaximumConcurrency` to 1. While this strategy should work in most situations, it's still possible for buffering to occur if your code is using other client library features that require buffering.

### `InitialTransferSize` on upload

When a seekable stream is provided for upload, the stream length will be checked against the value of `InitialTransferSize`. If the stream length is less than this value, the entire stream will be uploaded as a single REST call, regardless of other `StorageTransferOptions` values. Otherwise, upload will be done in multiple parts as described earlier. `InitialTransferSize` has no effect on a non-seekable stream and will be ignored.

> [!NOTE]
> When using a `BlobClient` object, an upload within the `InitialTransferSize` will be performed using [Put Blob](/rest/api/storageservices/put-blob), rather than [Put Block](/rest/api/storageservices/put-block).

## Downloads

During a download, the Storage client libraries will split a given download request into multiple subdownloads based on the values defined in `StorageTransferOptions`. Each subdownload has its own dedicated call to the REST operation. The client libraries manage these REST operations in parallel (depending on transfer options) to complete the full download.

### Buffering on downloads

Receiving multiple HTTP responses simultaneously with body contents has implications for memory usage. However, the Storage client libraries don't explicitly add a buffer step for downloaded contents. Incoming responses are processed in order. The client libraries configure a 16-kilobyte buffer for copying streams from an HTTP response stream to caller-provided destination stream or file path.

### `InitialTransferSize` on download

The Storage client libraries will make one download range request using `InitialTransferSize` before doing anything else. During this initial download request, the client libraries will know total resource size. If the initial request downloaded all of the content, the operation is complete. Otherwise, the download steps described earlier will continue until the request is completed.