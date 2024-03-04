---
title: Performance tuning for uploads and downloads with Azure Storage client library for Java
titleSuffix: Azure Storage
description: Learn how to tune your uploads and downloads for better performance with Azure Storage client library for Java. 
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 09/22/2023
ms.devlang: java
ms.custom: devx-track-java, devguide-java, devx-track-java, devx-track-extended-java
---

# Performance tuning for uploads and downloads with Java

When an application transfers data using the Azure Storage client library for Java, there are several factors that can affect speed, memory usage, and even the success or failure of the request. To maximize performance and reliability for data transfers, it's important to be proactive in configuring client library transfer options based on the environment your app runs in.

This article walks through several considerations for tuning data transfer options. When properly tuned, the client library can efficiently distribute data across multiple requests, which can result in improved operation speed, memory usage, and network stability.

## Performance tuning for uploads

Properly tuning data transfer options is key to reliable performance for uploads. Storage transfers are partitioned into several subtransfers based on the values of these arguments. The maximum supported transfer size varies by operation and service version, so be sure to check the documentation to determine the limits. For more information on transfer size limits for Blob storage, see [Scale targets for Blob storage](scalability-targets.md#scale-targets-for-blob-storage).

### Set transfer options for uploads

You can configure the values in [ParallelTransferOptions](/java/api/com.azure.storage.blob.models.paralleltransferoptions) to improve performance for data transfer operations. The following values can be tuned for uploads based on the needs of your app:

- [maxSingleUploadSize](#maxsingleuploadsize): The maximum blob size in bytes for a single request upload.
- [blockSize](#blocksize): The maximum block size to transfer for each request.
- [maxConcurrency](#maxconcurrency): The maximum number of parallel requests issued at any given time as a part of a single parallel transfer.

> [!NOTE]
> The client libraries will use defaults for each data transfer option, if not provided. These defaults are typically performant in a data center environment, but not likely to be suitable for home consumer environments. Poorly tuned data transfer options can result in excessively long operations and even request timeouts. It's best to be proactive in testing these values, and tuning them based on the needs of your application and environment.

#### maxSingleUploadSize

The `maxSingleUploadSize` value is the maximum blob size in bytes for a single request upload. This value can be set using the following method:

- [`setMaxSingleUploadSizeLong(Long maxSingleUploadSize)`](/java/api/com.azure.storage.blob.models.paralleltransferoptions#com-azure-storage-blob-models-paralleltransferoptions-setmaxsingleuploadsizelong(java-lang-long))

If the size of the data is less than or equal to `maxSingleUploadSize`, the blob is uploaded with a single [Put Blob](/rest/api/storageservices/put-blob) request. If the blob size is greater than `maxSingleUploadSize`, or if the blob size is unknown, the blob is uploaded in chunks using a series of [Put Block](/rest/api/storageservices/put-block) calls followed by [Put Block List](/rest/api/storageservices/put-block-list).

It's important to note that the value you specify for `blockSize` *does not* limit the value that you define for `maxSingleUploadSize`. The `maxSingleUploadSize` argument defines a separate size limitation for a request to perform the entire operation at once, with no subtransfers. It's often the case that you want `maxSingleUploadSize` to be *at least* as large as the value you define for `blockSize`, if not larger.  Depending on the size of the data transfer, this approach can be more performant, as the transfer is completed with a single request and avoids the overhead of multiple requests.

If you're unsure of what value is best for your situation, a safe option is to set `maxSingleUploadSize` to the same value used for `blockSize`.

#### blockSize

The `blockSize` value is the maximum length of a transfer in bytes when uploading a block blob in chunks. This value can be set using the following method:

- [`setBlockSizeLong(Long blockSize)`](/java/api/com.azure.storage.blob.models.paralleltransferoptions#com-azure-storage-blob-models-paralleltransferoptions-setblocksizelong(java-lang-long))

The `blockSize` value is the maximum length of a transfer in bytes when uploading a block blob in chunks. As mentioned earlier, this value *does not* limit `maxSingleUploadSize`, which can be larger than `blockSize`. 

To keep data moving efficiently, the client libraries may not always reach the `blockSize` value for every transfer. Depending on the operation, the maximum supported value for transfer size can vary. For more information on transfer size limits for Blob storage, see the chart in [Scale targets for Blob storage](scalability-targets.md#scale-targets-for-blob-storage).

#### maxConcurrency

The `maxConcurrency` value is the maximum number of parallel requests issued at any given time as a part of a single parallel transfer. This value can be set using the following method:

- [`setMaxConcurrency(Integer maxConcurrency)`](/java/api/com.azure.storage.blob.models.paralleltransferoptions#com-azure-storage-blob-models-paralleltransferoptions-setmaxconcurrency(java-lang-integer))

#### Code example

Make sure you have the following `import` directive to use `ParallelTransferOptions` for an upload:

```java
import com.azure.storage.blob.models.*;
```

The following code example shows how to set values for [ParallelTransferOptions](/java/api/com.azure.storage.blob.models.paralleltransferoptions) and include the options as part of a [BlobUploadFromFileOptions](/java/api/com.azure.storage.blob.options.blobuploadfromfileoptions) instance. If you're not uploading from a file, you can set similar options using [BlobParallelUploadOptions](/java/api/com.azure.storage.blob.options.blobparalleluploadoptions). The values provided in this sample aren't intended to be a recommendation. To properly tune these values, you need to consider the specific needs of your app.

```java
ParallelTransferOptions parallelTransferOptions = new ParallelTransferOptions()
        .setBlockSizeLong((long) (4 * 1024 * 1024)) // 4 MiB block size
        .setMaxConcurrency(2)
        .setMaxSingleUploadSizeLong((long) 8 * 1024 * 1024); // 8 MiB max size for single request upload

BlobUploadFromFileOptions options = new BlobUploadFromFileOptions("<localFilePath>");
options.setParallelTransferOptions(parallelTransferOptions);

Response<BlockBlobItem> blockBlob = blobClient.uploadFromFileWithResponse(options, null, null);
```

In this example, we set the maximum number of parallel transfer workers to 2 using the `setMaxConcurrency` method. We also set `maxSingleUploadSize` to 8 MiB using the `setMaxSingleUploadSizeLong` method. If the blob size is smaller than 8 MiB, only a single request is necessary to complete the upload operation. If the blob size is larger than 8 MiB, the blob is uploaded in chunks with a maximum chunk size of 4 MiB, which we set using the `setBlockSizeLong` method.

### Performance considerations for uploads

During an upload, the Storage client libraries split a given upload stream into multiple subuploads based on the configuration options defined by `ParallelTransferOptions`. Each subupload has its own dedicated call to the REST operation. For a `BlobClient` object, this operation is [Put Block](/rest/api/storageservices/put-block). The Storage client library manages these REST operations in parallel (depending on transfer options) to complete the full upload.

> [!NOTE]
> Block blobs have a maximum block count of 50,000 blocks. The maximum size of your block blob, then, is 50,000 times `block_size`.

#### Buffering during uploads

The Storage REST layer doesn’t support picking up a REST upload operation where you left off; individual transfers are either completed or lost. To ensure resiliency for stream uploads, the Storage client libraries buffer data for each individual REST call before starting the upload. In addition to network speed limitations, this buffering behavior is a reason to consider a smaller value for `blockSize`, even when uploading in sequence. Decreasing the value of `blockSize` decreases the maximum amount of data that is buffered on each request and each retry of a failed request. If you're experiencing frequent timeouts during data transfers of a certain size, reducing the value of `blockSize` reduces the buffering time, and may result in better performance.

## Performance tuning for downloads

Properly tuning data transfer options is key to reliable performance for downloads. Storage transfers are partitioned into several subtransfers based on the values defined in `ParallelTransferOptions`.

### Set transfer options for downloads

The following values can be tuned for downloads based on the needs of your app:

- `blockSize`: The maximum block size to transfer for each request. You can set this value by using the [setBlockSizeLong](/java/api/com.azure.storage.common.paralleltransferoptions#com-azure-storage-common-paralleltransferoptions-setblocksizelong(java-lang-long)) method.
- `maxConcurrency`: The maximum number of parallel requests issued at any given time as a part of a single parallel transfer. You can set this value by using the [setMaxConcurrency](/java/api/com.azure.storage.common.paralleltransferoptions#com-azure-storage-common-paralleltransferoptions-setmaxconcurrency(java-lang-integer)) method.

#### Code example

Make sure you have the following `import` directive to use `ParallelTransferOptions` for a download:

```java
import com.azure.storage.common.*;
```

The following code example shows how to set values for [ParallelTransferOptions](/java/api/com.azure.storage.common.paralleltransferoptions) and include the options as part of a [BlobDownloadToFileOptions](/java/api/com.azure.storage.blob.options.blobdownloadtofileoptions) instance.

```java
ParallelTransferOptions parallelTransferOptions = new ParallelTransferOptions()
        .setBlockSizeLong((long) (4 * 1024 * 1024)) // 4 MiB block size
        .setMaxConcurrency(2);

BlobDownloadToFileOptions options = new BlobDownloadToFileOptions("<localFilePath>");
options.setParallelTransferOptions(parallelTransferOptions);

blobClient.downloadToFileWithResponse(options, null, null);
```

### Performance considerations for downloads

During a download, the Storage client libraries split a given download request into multiple subdownloads based on the configuration options defined by `ParallelTransferOptions`. Each subdownload has its own dedicated call to the REST operation. Depending on transfer options, the client libraries manage these REST operations in parallel to complete the full download.

## Next steps

- To understand more about factors that can influence performance for Azure Storage operations, see [Latency in Blob storage](storage-blobs-latency.md).
- To see a list of design considerations to optimize performance for apps using Blob storage, see [Performance and scalability checklist for Blob storage](storage-performance-checklist.md).
