---
title: List blobs with .NET - Azure Storage
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

This guide applies to the `Azure.Storage.Blobs` and `Azure.Storage.Files.DataLake` packages. Specifically, this looks at APIs that accept `StorageTransferOptions` as a parameter. This includes the following:
- `BlobClient.UploadAsync(Stream stream, ...)`
- `BlobClient.UploadAsync(string path, ...)`
- `BlobClient.DownloadToAsync(Stream stream, ...)`
- `BlobClient.DownloadToAsync(string path, ...)`
- `DataLakeFileClient.UploadAsync(Stream stream, ...)`
- `DataLakeFileClient.UploadAsync(string path, ...)`
- `DataLakeFileClient.ReadToAsync(Stream stream, ...)`
- `DataLakeFileClient.ReadToAsync(string path, ...)`

Properly tuning the values in [StorageTransferOptions](/dotnet/api/azure.storage.storagetransferoptions) is key to reliable performance for data transfer operations. Storage transfers are partitioned into several sub-transfers, or workers, based on the property values defined in this struct. The following table gives the name of each property in `StorageTransferOptions` and a brief description:

| Property | Description |
| --- | --- |
| [InitialTransferSize](/dotnet/api/azure.storage.storagetransferoptions.initialtransfersize) | The size of the first range request in bytes. Blobs smaller than this limit will be downloaded in a single request. Blobs larger than this limit will continue being downloaded in chunks of size MaximumTransferSize. | 
| [MaximumConcurrency](/dotnet/api/azure.storage.storagetransferoptions.maximumconcurrency) | The maximum number of workers that may be used in a parallel transfer. |
| [MaximumTransferSize](/dotnet/api/azure.storage.storagetransferoptions.maximumtransfersize) | The maximum length of an transfer in bytes. |


- `MaximumConcurrency`: the max number of parallel sub-transfers that can take place at once.
  - As of `Azure.Storage.Blobs` 12.10.0 and `Azure.Storage.Files.DataLake` 12.8.0, only async operations can perform these transfers in parallel. Synchronous operations will ignore this value and work in sequence.
  - The effectiveness of this value is subject to the restrictions set by .NET's connection pool limit, which may be hindering you by default. See this [blog post](https://devblogs.microsoft.com/azure-sdk/net-framework-connection-pool-limits/) for more details.
- `MaximumTransferSize`: the maximum data size of a sub-transfer, in bytes.
  - In an effort to keep data moving, the SDK may not always reach this value for every sub-transfer for a variety of reasons.
  - Different REST APIs have different maximum values they will support for transfer, and those values have changed across service versions. Check your documentation to determine the limits you can select for this value.

You also define a value for `InitialTransferSize`. Unlike the name may suggest, your `MaximumTransferSize` does **not** limit this value. In fact, it is often the case that you will want `InitialTransferSize` to be *at least* as large as your `MaximumTransferSize`, if not larger. `InitialTransferSize` defines a separate data size limitation for an initial attempt to do the entire operation at once with no sub-transfers. This cuts down on overhead for some data sizes relative to your `MaximumTransferSize`. If unsure of what is best for you, setting this to the same value used for `MaximumTransferSize` is a safe option.

While the class contains nullable values, the SDK will use defaults for each individual value when not provided. These defaults are typically fine in a data center environment, but likely not suitable for home consumer environments. Poorly tuned `StorageTransferOptions` can result in excessively long operations and even timeouts. It's best to be proactive in testing the values in `StorageTransferOptions`, and tuning them based on the needs of your application.

## Uploads

The Storage client libraries will split a given upload stream into various sub-uploads based on the values defined in `StorageTransferOptions`, each with their own dedicated REST call. With `BlobClient`, this will be [Put Block](https://docs.microsoft.com/rest/api/storageservices/put-block) and with `DataLakeFileClient`, this will be [Append Data](https://docs.microsoft.com/rest/api/storageservices/datalakestoragegen2/path/update). The Storage client library manages these REST operations in parallel (depending on transfer options) to complete the total upload.

*Note: block blobs have a maximum block count of 50,000. Your your blob therefore has a maximum size of 50,000 times `MaximumTransferSize`.*

### Buffering on Uploads

The Storage REST layer does not support resuming a REST upload where you left off; individual transfers are either completed or lost. Therefore, if a stream is not seekable, the storage SDK will buffer the data for each individual REST call before starting the upload. Outside of network speed, this is also why you may be interesting in setting a smaller value for `MaximumTransferSize` even when uploading in sequence; your `MaximumTransferSize` is the maximum division of data you will need to retry in the event of a failure.

If uploading with parallel REST calls to maximize network throughput, the SDK needs sources it can read from in parallel. Therefore, if uploading in parallel, the storage SDK will buffer the data for each individual REST call before starting the upload **even if the provided stream is already seekable**.

To avoid the Storage SDK buffering your data for upload, you must provide a seekable stream and ensure `MaximumConcurrency` is set to 1. Note that while this should be sufficient in most situations, your code could be using other features of the SDK that require buffering anyway, in which case buffering will occur.

### `InitialTransferSize` on Upload

When a seekable stream is provided, its length will be checked against this value. If the stream length is within this value, the entire stream will be uploaded as a single REST call, regardless of other `StorageTransferOptions` values. Otherwise, upload will be done in parts as described previously in this document.

*Note: when using `BlobClient`, an upload within the `InitialTransferSize` will be performed using [Put Blob](https://docs.microsoft.com/rest/api/storageservices/put-blob), rather than Put Block.*

`InitialTransferSize` has no effect on an unseekable stream and will be ignored.

## Downloads

The Storage SDK will split a given download request into various sub-downloads based on provided `StorageTransferOptions`, each with their own dedicated REST call. The Storage SDK manages these REST operations in parallel (depending on transfer options) to complete the the total download.

### Buffering on Downloads

While receiving multiple HTTP responses simultaneously with body contents will have memory implications, the Storage SDK does not explicitly add a buffer step for downloaded contents. The download REST responses are queued up in the correct order and their body contents are copied to the destination one at a time. The Storage SDK configures a 16 KB buffer for copying streams from HTTP response stream to caller-provided destination stream/filepath.

### `InitialTransferSize` on Download

The Storage SDK will make one download range request using `InitialTransferSize` before anything else. Upon downloading that range, total blob size will be known. If the initial request downloaded the whole blob, we are done! Otherwise, the download steps described previously will begin. 