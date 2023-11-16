---
title: Performance tuning for uploads and downloads with Azure Storage client library for .NET
titleSuffix: Azure Storage
description: Learn how to tune your uploads and downloads for better performance with Azure Storage client library for .NET. 
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 12/09/2022
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp, devx-track-dotnet
---

# Performance tuning for uploads and downloads with .NET

When an application transfers data using the Azure Storage client library for .NET, there are several factors that can affect speed, memory usage, and even the success or failure of the request. To maximize performance and reliability for data transfers, it's important to be proactive in configuring client library transfer options based on the environment your app runs in.

This article walks through several considerations for tuning data transfer options, and the guidance applies to any API that accepts `StorageTransferOptions` as a parameter. When properly tuned, the client library can efficiently distribute data across multiple requests, which can result in improved operation speed, memory usage, and network stability.

## Performance tuning with StorageTransferOptions

Properly tuning the values in [StorageTransferOptions](/dotnet/api/azure.storage.storagetransferoptions) is key to reliable performance for data transfer operations. Storage transfers are partitioned into several subtransfers based on the property values defined in an instance of this struct. The maximum supported transfer size varies by operation and service version, so be sure to check the documentation to determine the limits. For more information on transfer size limits for Blob storage, see [Scale targets for Blob storage](scalability-targets.md#scale-targets-for-blob-storage).

The following properties of `StorageTransferOptions` can be tuned based on the needs of your app:

- [InitialTransferSize](#initialtransfersize) - the size of the first request in bytes
- [MaximumConcurrency](#maximumconcurrency) - the maximum number of subtransfers that may be used in parallel
- [MaximumTransferSize](#maximumtransfersize) - the maximum length of a transfer in bytes

> [!NOTE]
> While the `StorageTransferOptions` struct contains nullable values, the client libraries will use defaults for each individual value, if not provided. These defaults are typically performant in a data center environment, but not likely to be suitable for home consumer environments. Poorly tuned `StorageTransferOptions` can result in excessively long operations and even request timeouts. It's best to be proactive in testing the values in `StorageTransferOptions`, and tuning them based on the needs of your application and environment.

### InitialTransferSize

[InitialTransferSize](/dotnet/api/azure.storage.storagetransferoptions.initialtransfersize) is the size of the first range request in bytes. An HTTP range request is a partial request, with the size defined by `InitialTransferSize` in this case. Blobs smaller than this size are transferred in a single request. Blobs larger than this size continue to be transferred in chunks of size `MaximumTransferSize`.

It's important to note that the value you specify for `MaximumTransferSize` *does not* limit the value that you define for `InitialTransferSize`. `InitialTransferSize` defines a separate size limitation for an initial request to perform the entire operation at once, with no subtransfers. It's often the case that you want `InitialTransferSize` to be *at least* as large as the value you define for `MaximumTransferSize`, if not larger.  Depending on the size of the data transfer, this approach can be more performant, as the transfer is completed with a single request and avoids the overhead of multiple requests.

If you're unsure of what value is best for your situation, a safe option is to set `InitialTransferSize` to the same value used for `MaximumTransferSize`.

> [!NOTE]
> When using a `BlobClient` object, uploading a blob smaller than the `InitialTransferSize` will be performed using [Put Blob](/rest/api/storageservices/put-blob), rather than [Put Block](/rest/api/storageservices/put-block).

### MaximumConcurrency
[MaximumConcurrency](/dotnet/api/azure.storage.storagetransferoptions.maximumconcurrency) is the maximum number of workers that may be used in a parallel transfer. Currently, only asynchronous operations can parallelize transfers. Synchronous operations ignore this value and work in sequence.

The effectiveness of this value is subject to connection pool limits in .NET, which may restrict performance by default in certain scenarios. To learn more about connection pool limits in .NET, see [.NET Framework Connection Pool Limits and the new Azure SDK for .NET](https://devblogs.microsoft.com/azure-sdk/net-framework-connection-pool-limits/).

### MaximumTransferSize

[MaximumTransferSize](/dotnet/api/azure.storage.storagetransferoptions.maximumtransfersize) is the maximum length of a transfer in bytes. As mentioned earlier, this value *does not* limit `InitialTransferSize`, which can be larger than `MaximumTransferSize`. 

To keep data moving efficiently, the client libraries may not always reach the `MaximumTransferSize` value for every transfer. Depending on the operation, the maximum supported value for transfer size can vary. For example, block blobs calling the [Put Block](/rest/api/storageservices/put-block#remarks) operation with a service version of 2019-12-12 or later have a maximum block size of 4000 MiB. For more information on transfer size limits for Blob storage, see the chart in [Scale targets for Blob storage](scalability-targets.md#scale-targets-for-blob-storage).

### Code example

The client library includes overloads for the `Upload` and `UploadAsync` methods, which accept a [StorageTransferOptions](/dotnet/api/azure.storage.storagetransferoptions) instance as part of a [BlobUploadOptions](/dotnet/api/azure.storage.blobs.models.blobuploadoptions) parameter. Similar overloads also exist for the `DownloadTo` and `DownloadToAsync` methods, using a [BlobDownloadToOptions](/dotnet/api/azure.storage.blobs.models.blobdownloadoptions) parameter.

The following code example shows how to define values for a `StorageTransferOptions` instance and pass these configuration options as a parameter to `UploadAsync`. The values provided in this sample aren't intended to be a recommendation. To properly tune these values, you need to consider the specific needs of your app.

```csharp
// Specify the StorageTransferOptions
BlobUploadOptions options = new BlobUploadOptions
{
    TransferOptions = new StorageTransferOptions
    {
        // Set the maximum number of parallel transfer workers
        MaximumConcurrency = 2,

        // Set the initial transfer length to 8 MiB
        InitialTransferSize = 8 * 1024 * 1024,

        // Set the maximum length of a transfer to 4 MiB
        MaximumTransferSize = 4 * 1024 * 1024
    }
};

// Upload data from a stream
await blobClient.UploadAsync(stream, options);
```

In this example, we set the number of parallel transfer workers to 2, using the `MaximumConcurrency` property. This configuration opens up to two connections simultaneously, allowing the upload to happen in parallel. The initial HTTP range request attempts to upload up to 8 MiB of data, as defined by the `InitialTransferSize` property. Note that `InitialTransferSize` only applies for uploads when [using a seekable stream](#initialtransfersize-on-upload). If the blob size is smaller than 8 MiB, only a single request is necessary to complete the operation. If the blob size is larger than 8 MiB, all subsequent transfer requests have a maximum size of 4 MiB, which we set with the `MaximumTransferSize` property.

## Performance considerations for uploads

During an upload, the Storage client libraries split a given upload stream into multiple subuploads based on the values defined in the `StorageTransferOptions` instance. Each subupload has its own dedicated call to the REST operation. For a `BlobClient` object or `BlockBlobClient` object, this operation is [Put Block](/rest/api/storageservices/put-block). For a `DataLakeFileClient` object, this operation is [Append Data](/rest/api/storageservices/datalakestoragegen2/path/update). The Storage client library manages these REST operations in parallel (depending on transfer options) to complete the full upload.

Depending on whether the upload stream is seekable or non-seekable, the client library handles buffering and `InitialTransferSize` differently, as described in the following sections. A seekable stream is a stream that supports querying and modifying the current position within a stream. To learn more about streams in .NET, see the [Stream class](/dotnet/api/system.io.stream#remarks) reference.

> [!NOTE]
> Block blobs have a maximum block count of 50,000 blocks. The maximum size of your block blob, then, is 50,000 times `MaximumTransferSize`.

### Buffering during uploads

The Storage REST layer doesn’t support picking up a REST upload operation where you left off; individual transfers are either completed or lost. To ensure resiliency for non-seekable stream uploads, the Storage client libraries buffer data for each individual REST call before starting the upload. In addition to network speed limitations, this buffering behavior is a reason to consider a smaller value for `MaximumTransferSize`, even when uploading in sequence. Decreasing the value of `MaximumTransferSize` decreases the maximum amount of data that is buffered on each request and each retry of a failed request. If you're experiencing frequent timeouts during data transfers of a certain size, reducing the value of `MaximumTransferSize` reduces the buffering time, and may result in better performance.

Another scenario where buffering occurs is when you're uploading data with parallel REST calls to maximize network throughput. The client libraries need sources they can read from in parallel, and since streams are sequential, the Storage client libraries buffer the data for each individual REST call before starting the upload. This buffering behavior occurs even if the provided stream is seekable.

To avoid buffering during an asynchronous upload call, you must provide a seekable stream and set `MaximumConcurrency` to 1. While this strategy should work in most situations, it's still possible for buffering to occur if your code is using other client library features that require buffering.

### InitialTransferSize on upload

When a seekable stream is provided for upload, the stream length is checked against the value of `InitialTransferSize`. If the stream length is less than this value, the entire stream is uploaded as a single REST call, regardless of other `StorageTransferOptions` values. Otherwise, the upload is done in multiple parts as described earlier. `InitialTransferSize` has no effect on a non-seekable stream and is ignored.

## Performance considerations for downloads

During a download, the Storage client libraries split a given download request into multiple subdownloads based on the values defined in the `StorageTransferOptions` instance. Each subdownload has its own dedicated call to the REST operation. Depending on transfer options, the client libraries manage these REST operations in parallel to complete the full download.

### Buffering during downloads

Receiving multiple HTTP responses simultaneously with body contents has implications for memory usage. However, the Storage client libraries don't explicitly add a buffer step for downloaded contents. Incoming responses are processed in order. The client libraries configure a 16-kilobyte buffer for copying streams from an HTTP response stream to a caller-provided destination stream or file path.

### InitialTransferSize on download

During a download, the Storage client libraries make one download range request using `InitialTransferSize` before doing anything else. During this initial download request, the client libraries know the total size of the resource. If the initial request successfully downloaded all of the content, the operation is complete. Otherwise, the client libraries continue to make range requests up to `MaximumTransferSize` until the full download is complete.

## Next steps

- To understand more about factors that can influence performance for Azure Storage operations, see [Latency in Blob storage](storage-blobs-latency.md).
- To see a list of design considerations to optimize performance for apps using Blob storage, see [Performance and scalability checklist for Blob storage](storage-performance-checklist.md).
