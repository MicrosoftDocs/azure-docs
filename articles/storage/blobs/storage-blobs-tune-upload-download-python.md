---
title: Performance tuning for uploads and downloads with Azure Storage client library for Python
titleSuffix: Azure Storage
description: Learn how to tune your uploads and downloads for better performance with Azure Storage client library for Python. 
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 07/07/2023
ms.devlang: python
ms.custom: devx-track-python, devguide-python, devx-track-python
---

# Performance tuning for uploads and downloads with Python

When an application transfers data using the Azure Storage client library for Python, there are several factors that can affect speed, memory usage, and even the success or failure of the request. To maximize performance and reliability for data transfers, it's important to be proactive in configuring client library transfer options based on the environment your app runs in.

This article walks through several considerations for tuning data transfer options. When properly tuned, the client library can efficiently distribute data across multiple requests, which can result in improved operation speed, memory usage, and network stability.

## Performance tuning for uploads

Properly tuning data transfer options is key to reliable performance for uploads. Storage transfers are partitioned into several subtransfers based on the values of these arguments. The maximum supported transfer size varies by operation and service version, so be sure to check the documentation to determine the limits. For more information on transfer size limits for Blob storage, see [Scale targets for Blob storage](scalability-targets.md#scale-targets-for-blob-storage).

### Set transfer options for uploads

The following arguments can be tuned based on the needs of your app:

- [max_single_put_size](#max_single_put_size): The maximum size for a blob to be uploaded with a single request. Defaults to 64 MiB.
- [max_block_size](#max_block_size): The maximum length of a transfer in bytes when uploading a block blob in chunks. Defaults to 4 MiB.
- `max_concurrency`: The maximum number of subtransfers that may be used in parallel.

> [!NOTE]
> The client libraries will use defaults for each data transfer option, if not provided. These defaults are typically performant in a data center environment, but not likely to be suitable for home consumer environments. Poorly tuned data transfer options can result in excessively long operations and even request timeouts. It's best to be proactive in testing these values, and tuning them based on the needs of your application and environment.

#### max_single_put_size

The `max_single_put_size` argument is the maximum blob size in bytes for a single request upload. If the blob size is less than or equal to `max_single_put_size`, the blob is uploaded with a single [Put Blob](/rest/api/storageservices/put-blob) request. If the blob size is greater than `max_single_put_size`, or if the blob size is unknown, the blob is uploaded in chunks using a series of [Put Block](/rest/api/storageservices/put-block) calls followed by [Put Block List](/rest/api/storageservices/put-block-list).

It's important to note that the value you specify for `max_block_size` *does not* limit the value that you define for `max_single_put_size`. The `max_single_put_size` argument defines a separate size limitation for a request to perform the entire operation at once, with no subtransfers. It's often the case that you want `max_single_put_size` to be *at least* as large as the value you define for `max_block_size`, if not larger.  Depending on the size of the data transfer, this approach can be more performant, as the transfer is completed with a single request and avoids the overhead of multiple requests.

If you're unsure of what value is best for your situation, a safe option is to set `max_single_put_size` to the same value used for `max_block_size`.

#### max_block_size

The `max_block_size` argument is the maximum length of a transfer in bytes when uploading a block blob in chunks. As mentioned earlier, this value *does not* limit `max_single_put_size`, which can be larger than `max_block_size`. 

To keep data moving efficiently, the client libraries may not always reach the `max_block_size` value for every transfer. Depending on the operation, the maximum supported value for transfer size can vary. For more information on transfer size limits for Blob storage, see the chart in [Scale targets for Blob storage](scalability-targets.md#scale-targets-for-blob-storage).

#### Code example

The following code example shows how to specify data transfer options when creating a `BlobClient` object, and how to upload data using that client object. The values provided in this sample aren't intended to be a recommendation. To properly tune these values, you need to consider the specific needs of your app.

```python
def upload_blob_transfer_options(self, account_url: str, container_name: str, blob_name: str):
    # Create a BlobClient object with data transfer options for upload
    blob_client = BlobClient(
        account_url=account_url, 
        container_name=container_name, 
        blob_name=blob_name,
        credential=DefaultAzureCredential(),
        max_block_size=1024*1024*4, # 4 MiB
        max_single_put_size=1024*1024*8 # 8 MiB
    )
    
    with open(file=os.path.join(r'file_path', blob_name), mode="rb") as data:
        blob_client = blob_client.upload_blob(data=data, overwrite=True, max_concurrency=2)
```

In this example, we set the number of parallel transfer workers to 2, using the `max_concurrency` argument on the method call. This configuration opens up to two connections simultaneously, allowing the upload to happen in parallel. During client instantiation, we set the `max_single_put_size` argument to 8 MiB. If the blob size is smaller than 8 MiB, only a single request is necessary to complete the upload operation. If the blob size is larger than 8 MiB, the blob is uploaded in chunks with a maximum chunk size of 4 MiB, as set by the `max_block_size` argument.

### Performance considerations for uploads

During an upload, the Storage client libraries split a given upload stream into multiple subuploads based on the configuration options defined during client construction. Each subupload has its own dedicated call to the REST operation. For a `BlobClient` object, this operation is [Put Block](/rest/api/storageservices/put-block). The Storage client library manages these REST operations in parallel (depending on transfer options) to complete the full upload.

You can learn how the client library handles buffering in the following sections.

> [!NOTE]
> Block blobs have a maximum block count of 50,000 blocks. The maximum size of your block blob, then, is 50,000 times `max_block_size`.

#### Buffering during uploads

The Storage REST layer doesn’t support picking up a REST upload operation where you left off; individual transfers are either completed or lost. To ensure resiliency for stream uploads, the Storage client libraries buffer data for each individual REST call before starting the upload. In addition to network speed limitations, this buffering behavior is a reason to consider a smaller value for `max_block_size`, even when uploading in sequence. Decreasing the value of `max_block_size` decreases the maximum amount of data that is buffered on each request and each retry of a failed request. If you're experiencing frequent timeouts during data transfers of a certain size, reducing the value of `max_block_size` reduces the buffering time, and may result in better performance.

By default, the SDK buffers data of `max_block_size` bytes per concurrent subupload request, but memory use can be limited to 4 MiB per request if the following conditions are met:

- The `max_block_size` argument must be greater than `min_large_block_upload_threshold`. The `min_large_block_upload_threshold` argument can be defined during client instantiation, and is the minimum chunk size in bytes required to use the memory efficient algorithm. The `min_large_block_upload_threshold` argument defaults to `4*1024*1024 + 1`.
- The provided stream must be seekable. A seekable stream is a stream that supports querying and modifying the current position within a stream.
- The blob must be a block blob.

While this strategy applies to most situations, it's still possible for more buffering to occur if your code is using other client library features that require buffering.

## Performance tuning for downloads

Properly tuning data transfer options is key to reliable performance for downloads. Storage transfers are partitioned into several subtransfers based on the values of these arguments.

### Set transfer options for downloads

The following arguments can be tuned based on the needs of your app:

- `max_chunk_get_size`: The maximum chunk size used for downloading a blob. Defaults to 4 MiB.
- `max_concurrency`: The maximum number of subtransfers that may be used in parallel.
- `max_single_get_size`: The maximum size for a blob to be downloaded in a single call. If the total blob size exceeds `max_single_get_size`, the remainder of the blob data is downloaded in chunks. Defaults to 32 MiB.

#### Code example

```python
def download_blob_transfer_options(self, account_url: str, container_name: str, blob_name: str):
    # Create a BlobClient object with data transfer options for download
    blob_client = BlobClient(
        account_url=account_url, 
        container_name=container_name, 
        blob_name=blob_name,
        credential=DefaultAzureCredential(),
        max_single_get_size=1024*1024*32, # 32 MiB
        max_chunk_get_size=1024*1024*4 # 4 MiB
    )

    with open(file=os.path.join(r'file_path', 'file_name'), mode="wb") as sample_blob:
        download_stream = blob_client.download_blob(max_concurrency=2)
        sample_blob.write(download_stream.readall())
```

### Performance considerations for downloads

During a download, the Storage client libraries split a given download request into multiple subdownloads based on the configuration options defined during client construction. Each subdownload has its own dedicated call to the REST operation. Depending on transfer options, the client libraries manage these REST operations in parallel to complete the full download.

#### max_single_get_size for downloads

During a download, the Storage client libraries make one download range request using `max_single_get_size` before doing anything else. During this initial download request, the client libraries know the total size of the resource. If the initial request successfully downloaded all of the content, the operation is complete. Otherwise, the client libraries continue to make range requests up to `max_chunk_get_size` until the full download is complete.

## Next steps

- To understand more about factors that can influence performance for Azure Storage operations, see [Latency in Blob storage](storage-blobs-latency.md).
- To see a list of design considerations to optimize performance for apps using Blob storage, see [Performance and scalability checklist for Blob storage](storage-performance-checklist.md).
