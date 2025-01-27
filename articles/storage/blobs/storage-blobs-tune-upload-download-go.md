---
title: Performance tuning for uploads and downloads with Azure Storage client library for Go
titleSuffix: Azure Storage
description: Learn how to tune your uploads and downloads for better performance with Azure Storage client library for Go. 
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 09/30/2024
ms.devlang: golang
ms.custom: devx-track-go, devguide-go, devx-track-go
---

# Performance tuning for uploads and downloads with Go

When an application transfers data using the Azure Storage client library for Go, there are several factors that can affect speed, memory usage, and even the success or failure of the request. To maximize performance and reliability for data transfers, it's important to be proactive in configuring client library transfer options based on the environment your app runs in.

This article walks through several considerations for tuning data transfer options. When properly tuned, the client library can efficiently distribute data across multiple requests, which can result in improved operation speed, memory usage, and network stability.

## Performance tuning for uploads

Properly tuning data transfer options is key to reliable performance for uploads. Storage transfers are partitioned into several subtransfers based on the values of these properties. The maximum supported transfer size varies by operation and service version, so be sure to check the documentation to determine the limits. For more information on transfer size limits for Blob storage, see [Scale targets for Blob storage](scalability-targets.md#scale-targets-for-blob-storage).

### Set transfer options for uploads

If the total blob size is less than or equal to 256 MB, the data is uploaded with a single [Put Blob](/rest/api/storageservices/put-blob) request. If the blob size is greater than 256 MB, or if the blob size is unknown, the blob is uploaded in chunks using a series of [Put Block](/rest/api/storageservices/put-block) calls followed by [Put Block List](/rest/api/storageservices/put-block-list).

The following properties can be configured and tuned based on the needs of your app:

- `BlockSize`: The maximum length of a transfer in bytes when uploading a block blob in chunks. Defaults to 4 MB.
- `Concurrency`: The maximum number of subtransfers that can be used in parallel. Defaults to 5.

These configuration options are available when uploading using the following methods:

- [UploadBuffer](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.UploadBuffer)
- [UploadStream](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.UploadStream)
- [UploadFile](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.UploadFile)

The [Upload](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blockblob#Client.Upload) method doesn't support these options, and uploads data in a single request.

> [!NOTE]
> The client libraries use defaults for each data transfer option, if not provided. These defaults are typically performant in a data center environment, but not likely to be suitable for home consumer environments. Poorly tuned data transfer options can result in excessively long operations and even request timeouts. It's best to be proactive in testing these values, and tuning them based on the needs of your application and environment.

#### BlockSize

The `BlockSize` argument is the maximum length of a transfer in bytes when uploading a block blob in chunks.

To keep data moving efficiently, the client libraries might not always reach the `BlockSize` value for every transfer. Depending on the operation, the maximum supported value for transfer size can vary. For more information on transfer size limits for Blob storage, see the chart in [Scale targets for Blob storage](scalability-targets.md#scale-targets-for-blob-storage).

#### Code example

The following code example shows how to define values for an [UploadFileOptions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#UploadFileOptions) instance and pass these configuration options as a parameter to [UploadFile](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.UploadFile).

The values provided in this sample aren't intended to be a recommendation. To properly tune these values, you need to consider the specific needs of your app.

```go
func uploadBlobWithTransferOptions(client *azblob.Client, containerName string, blobName string) {
    // Open the file for reading
    file, err := os.OpenFile("path/to/sample/file", os.O_RDONLY, 0)
    handleError(err)

    defer file.Close()

    // Upload the data to a block blob with transfer options
    _, err = client.UploadFile(context.TODO(), containerName, blobName, file,
        &azblob.UploadFileOptions{
            BlockSize:   int64(8 * 1024 * 1024), // 8 MiB
            Concurrency: uint16(2),
        })
    handleError(err)
}
```

In this example, we set the number of parallel transfer workers to 2, using the `Concurrency` field. This configuration opens up to two connections simultaneously, allowing the upload to happen in parallel. If the blob size is larger than 256 MB, the blob is uploaded in chunks with a maximum chunk size of 8 MiB, as set by the `Block_Size` field.

### Performance considerations for uploads

During an upload, the Storage client libraries split a given upload stream into multiple subuploads based on the configuration options defined during client construction. Each subupload has its own dedicated call to the REST operation. The Storage client library manages these REST operations in parallel (depending on transfer options) to complete the full upload.

You can learn how the client library handles buffering in the following sections.

> [!NOTE]
> Block blobs have a maximum block count of 50,000 blocks. The maximum size of your block blob, then, is 50,000 times `Block_Size`.

#### Buffering during uploads

The Storage REST layer doesn’t support picking up a REST upload operation where you left off; individual transfers are either completed or lost. To ensure resiliency for stream uploads, the Storage client libraries buffer data for each individual REST call before starting the upload. In addition to network speed limitations, this buffering behavior is a reason to consider a smaller value for `BlockSize`, even when uploading in sequence. Decreasing the value of `BlockSize` decreases the maximum amount of data that is buffered on each request and each retry of a failed request. If you're experiencing frequent timeouts during data transfers of a certain size, reducing the value of `BlockSize` reduces the buffering time, and might result in better performance.

## Performance tuning for downloads

Properly tuning data transfer options is key to reliable performance for downloads. Storage transfers are partitioned into several subtransfers based on the values of these properties.

### Set transfer options for downloads

The following properties can be tuned based on the needs of your app:

- `BlockSize`: The maximum chunk size used for downloading a blob. Defaults to 4 MB.
- `Concurrency`: The maximum number of subtransfers that can be used in parallel. Defaults to 5.

These options are available when downloading using the following methods:

- [DownloadBuffer](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.DownloadBuffer)
- [DownloadFile](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.DownloadFile)

The [DownloadStream](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.DownloadStream) method doesn't support these options, and downloads data in a single request.

#### Code example

The following code example shows how to define values for an [DownloadFileOptions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#DownloadFileOptions) instance and pass these configuration options as a parameter to [DownloadFile](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.DownloadFile).

The values provided in this sample aren't intended to be a recommendation. To properly tune these values, you need to consider the specific needs of your app.

```go
func downloadBlobTransferOptions(client *azblob.Client, containerName string, blobName string) {
    // Create or open a local file where we can download the blob
	file, err := os.Create("path/to/sample/file")
	handleError(err)

	// Download the blob to the local file
	_, err = client.DownloadFile(context.TODO(), containerName, blobName, file,
		&azblob.DownloadFileOptions{
			BlockSize:   int64(4 * 1024 * 1024), // 4 MiB
			Concurrency: uint16(2),
		})
	handleError(err)
}
```

### Performance considerations for downloads

During a download, the Storage client libraries split a given download request into multiple subdownloads based on the configuration options defined during client construction. Each subdownload has its own dedicated call to the REST operation. Depending on transfer options, the client libraries manage these REST operations in parallel to complete the full download.

## Related content

- This article is part of the Blob Storage developer guide for Go. See the full list of developer guide articles at [Build your app](storage-blob-go-get-started.md#build-your-app).
- To understand more about factors that can influence performance for Azure Storage operations, see [Latency in Blob storage](storage-blobs-latency.md).
- To see a list of design considerations to optimize performance for apps using Blob storage, see [Performance and scalability checklist for Blob storage](storage-performance-checklist.md).
