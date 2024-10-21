---
title: Performance tuning for uploads and downloads with Azure Storage client library for JavaScript
titleSuffix: Azure Storage
description: Learn how to tune your uploads and downloads for better performance with Azure Storage client library for JavaScript. 
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 08/05/2024
ms.devlang: javascript
ms.custom: devx-track-js, devguide-js, devx-track-js, devx-track-extended-js
---

# Performance tuning for uploads and downloads with JavaScript

When an application transfers data using the Azure Storage client library for JavaScript, there are several factors that can affect speed, memory usage, and even the success or failure of the request. To maximize performance and reliability for data transfers, it's important to be proactive in configuring client library transfer options based on the environment your app runs in.

This article walks through several considerations for tuning data transfer options. When properly tuned, the client library can efficiently distribute data across multiple requests, which can result in improved operation speed, memory usage, and network stability.

## Performance tuning for uploads

Properly tuning data transfer options is key to reliable performance for uploads. Storage transfers are partitioned into several subtransfers based on the values of these arguments. The maximum supported transfer size varies by operation and service version, so be sure to check the documentation to determine the limits. For more information on transfer size limits for Blob storage, see [Scale targets for Blob storage](scalability-targets.md#scale-targets-for-blob-storage).

### Set transfer options for uploads

You can configure properties in [BlockBlobParallelUploadOptions](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions) to improve performance for data transfer operations. The following table lists the properties you can configure, along with a description:

| Property | Description |
| --- | --- |
| [`blockSize`](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions#@azure-storage-blob-blockblobparalleluploadoptions-blocksize) | The maximum block size to transfer for each request as part of an upload operation. To learn more, see [blockSize](#blocksize). |
| [`maxSingleShotSize`](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions#@azure-storage-blob-blockblobparalleluploadoptions-maxsingleshotsize) | If the size of the data is less than or equal to this value, it's uploaded in a single put rather than broken up into chunks. If the data is uploaded in a single shot, the block size is ignored. Default value is 256 MB. If you customize this property, you must use a value less than or equal to 256 MB. To learn more, see [maxSingleShotSize](#maxsingleshotsize). |
| [`concurrency`](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions#@azure-storage-blob-blockblobparalleluploadoptions-concurrency) | The maximum number of parallel requests that are issued at any given time as a part of a single parallel transfer. |

> [!NOTE]
> The client libraries will use defaults for each data transfer option, if not provided. These defaults are typically performant in a data center environment, but not likely to be suitable for home consumer environments. Poorly tuned data transfer options can result in excessively long operations and even request timeouts. It's best to be proactive in testing these values, and tuning them based on the needs of your application and environment.

#### maxSingleShotSize

The `maxSingleShotSize` value is the maximum blob size in bytes for a single request upload.

If the size of the data is less than or equal to `maxSingleShotSize`, the blob is uploaded with a single [Put Blob](/rest/api/storageservices/put-blob) request. If the blob size is greater than `maxSingleShotSize`, or if the blob size is unknown, the blob is uploaded in chunks using a series of [Put Block](/rest/api/storageservices/put-block) calls followed by [`Put Block List`](/rest/api/storageservices/put-block-list).

It's important to note that the value you specify for `blockSize` *does not* limit the value that you define for `maxSingleShotSize`. The `maxSingleShotSize` argument defines a separate size limitation for a request to perform the entire operation at once, with no subtransfers. It's often the case that you want `maxSingleShotSize` to be *at least* as large as the value you define for `blockSize`, if not larger. Depending on the size of the data transfer, this approach can be more performant, as the transfer is completed with a single request and avoids the overhead of multiple requests.

If you're unsure of what value is best for your situation, a safe option is to set `maxSingleShotSize` to the same value used for `blockSize`.

#### blockSize

The `blockSize` value is the maximum length of a transfer in bytes when uploading a block blob in chunks. 

As mentioned earlier, this value *does not* limit `maxSingleShotSize`, which can be larger than `blockSize`. 

To keep data moving efficiently, the client libraries might not always reach the `blockSize` value for every transfer. Depending on the operation, the maximum supported value for transfer size can vary. For more information on transfer size limits for Blob storage, see the chart in [Scale targets for Blob storage](scalability-targets.md#scale-targets-for-blob-storage).

#### Code example

The following code example shows how to set values for [BlockBlobParallelUploadOptions](/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions) and include the options as part of an upload method call. The values provided in the samples aren't intended to be a recommendation. To properly tune these values, you need to consider the specific needs of your app.

```javascript
// Specify data transfer options
const uploadOptions = {
  blockSize: 4 * 1024 * 1024, // 4 MiB max block size
  concurrency: 2, // maximum number of parallel transfer workers
  maxSingleShotSize: 8 * 1024 * 1024, // 8 MiB initial transfer size
} 

// Create blob client from container client
const blockBlobClient = containerClient.getBlockBlobClient(blobName);

// Upload blob with transfer options
await blockBlobClient.uploadFile(localFilePath, uploadOptions);
```

In this example, we set the maximum number of parallel transfer workers to 2 using the `concurrency` property. We also set `maxSingleShotSize` to 8 MiB. If the blob size is smaller than 8 MiB, only a single request is necessary to complete the upload operation. If the blob size is larger than 8 MiB, the blob is uploaded in chunks with a maximum chunk size of 4 MiB, which we define in the `blockSize` property.

### Performance considerations for uploads

During an upload, the Storage client libraries split a given upload stream into multiple subuploads based on the configuration options defined by `BlockBlobParallelUploadOptions`. Each subupload has its own dedicated call to the REST operation. In this example, the operation is [Put Block](/rest/api/storageservices/put-block). The Storage client library manages these REST operations in parallel (depending on transfer options) to complete the full upload.

> [!NOTE]
> Block blobs have a maximum block count of 50,000 blocks. The maximum size of your block blob, then, is 50,000 times `block_size`.

#### Buffering during uploads

The Storage REST layer doesn’t support picking up a REST upload operation where you left off; individual transfers are either completed or lost. To ensure resiliency for stream uploads, the Storage client libraries buffer data for each individual REST call before starting the upload. In addition to network speed limitations, this buffering behavior is a reason to consider a smaller value for `blockSize`, even when uploading in sequence. Decreasing the value of `blockSize` decreases the maximum amount of data that is buffered on each request and each retry of a failed request. If you're experiencing frequent timeouts during data transfers of a certain size, reducing the value of `blockSize` reduces the buffering time, and might result in better performance.

## Performance tuning for downloads

Tuning data transfer options for downloads is available only when using the [downloadToBuffer](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-downloadtobuffer) method. This method downloads a blob in parallel to a buffer based on the values defined in [BlobDownloadToBufferOptions](/javascript/api/@azure/storage-blob/blobdownloadtobufferoptions). Other download methods don't support tuning data transfer options.

### Set transfer options for downloads

The following values can be tuned for downloads when using the `downloadToBuffer` method:

- [blockSize](/javascript/api/@azure/storage-blob/blobdownloadtobufferoptions#@azure-storage-blob-blobdownloadtobufferoptions-blocksize): The maximum block size to transfer for each request.
- [concurrency](/javascript/api/@azure/storage-blob/blobdownloadtobufferoptions#@azure-storage-blob-blobdownloadtobufferoptions-concurrency): The maximum number of parallel requests issued at any given time as a part of a single parallel transfer.

### Performance considerations for downloads

During a download using `downloadToBuffer`, the Storage client libraries split a given download request into multiple subdownloads based on the configuration options defined by `BlobDownloadToBufferOptions`. Each subdownload has its own dedicated call to the REST operation. Depending on transfer options, the client libraries manage these REST operations in parallel to complete the full download.

#### Code example

The following code example shows how to set values for [BlobDownloadToBufferOptions](/javascript/api/@azure/storage-blob/blobdownloadtobufferoptions) and include the options as part of a [downloadToBuffer](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-downloadtobuffer) method call. The values provided in the samples aren't intended to be a recommendation. To properly tune these values, you need to consider the specific needs of your app.

```javascript
// Specify data transfer options
    const downloadToBufferOptions = {
        blockSize: 4 * 1024 * 1024, // 4 MiB max block size
        concurrency: 2, // maximum number of parallel transfer workers
    }

    // Download data to buffer
    const result = await client.downloadToBuffer(offset, count, downloadToBufferOptions);
```

## Related content

- To understand more about factors that can influence performance for Azure Storage operations, see [Latency in Blob storage](storage-blobs-latency.md).
- To see a list of design considerations to optimize performance for apps using Blob storage, see [Performance and scalability checklist for Blob storage](storage-performance-checklist.md).
