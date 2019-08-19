---
title: Azure Event Grid blob storage event schema
description: Describes the properties that are provided for blob storage events with Azure Event Grid
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: reference
ms.date: 01/17/2019
ms.author: spelluru
---

# Azure Event Grid event schema for Blob storage

This article provides the properties and schema for blob storage events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

For a list of sample scripts and tutorials, see [Storage event source](event-sources.md#storage).

## List of events for Blob REST APIs

These events are triggered when a client creates, replaces, or deletes a blob by calling Blob REST APIs.

 |Event name |Description|
 |----------|-----------|
 |**Microsoft.Storage.BlobCreated** |Triggered when a blob is created or replaced. <br>Specifically, this event is triggered when clients use the `PutBlob`, `PutBlockList`, or `CopyBlob` operations that are available in the Blob REST API.   |
 |**Microsoft.Storage.BlobDeleted** |Triggered when a blob is deleted. <br>Specifically, this event is triggered when clients call the `DeleteBlob` operation that is available in the Blob REST API. |

> [!NOTE]
> If you want to ensure that the **Microsoft.Storage.BlobCreated** event is triggered only when a Block Blob is completely committed, filter the event for the `CopyBlob`, `PutBlob`, and `PutBlockList` REST API calls. These API calls trigger the **Microsoft.Storage.BlobCreated** event only after data is fully committed to a Block Blob. To learn how to create a filter, see [Filter events for Event Grid](https://docs.microsoft.com/azure/event-grid/how-to-filter-events).

## List of the events for Azure Data Lake Storage Gen 2 REST APIs

These events are triggered if you enable a hierarchical namespace on the storage account, and clients call Azure Data Lake Storage Gen2 REST APIs.

> [!NOTE]
> These events are in public preview and they are available only the **West US 2** and **West Central US** regions.

 |Event name|Description|
 |----------|-----------|
 |**Microsoft.Storage.BlobCreated** | Triggered when a blob is created or replaced. <br>Specifically, this event is triggered when clients use the `CreateFile` and `FlushWithClose` operations that are available in the Azure Data Lake Storage Gen2 REST API. |
 |**Microsoft.Storage.BlobDeleted** |Triggered when a blob is deleted. <br>Specifically, This event is also triggered when clients call the `DeleteFile` operation that is available in the Azure Data Lake Storage Gen2 REST API. |
 |**Microsoft.Storage.BlobRenamed**|Triggered when a blob is renamed. <br>Specifically, this event is triggered when clients use the `RenameFile` operation that is available in the Azure Data Lake Storage Gen2 REST API.|
 |**Microsoft.Storage.DirectoryCreated**|Triggered when a directory is created. <br>Specifically, this event is triggered when clients use the `CreateDirectory` operation that is available in the Azure Data Lake Storage Gen2 REST API.|
 |**Microsoft.Storage.DirectoryRenamed**|Triggered when a directory is renamed. <br>Specifically, this event is triggered when clients use the `RenameDirectory` operation that is available in the Azure Data Lake Storage Gen2 REST API.|
 |**Microsoft.Storage.DirectoryDeleted**|Triggered when a directory is deleted. <br>Specifically, this event is triggered when clients use the `DeleteDirectory` operation that is available in the Azure Data Lake Storage Gen2 REST API.|

> [!NOTE]
> If you want to ensure that the **Microsoft.Storage.BlobCreated** event is triggered only when a Block Blob is completely committed, filter the event for the `FlushWithClose` REST API call. This API call triggers the **Microsoft.Storage.BlobCreated** event only after data is fully committed to a Block Blob. To learn how to create a filter, see [Filter events for Event Grid](https://docs.microsoft.com/azure/event-grid/how-to-filter-events).

<a id="example-event" />

## The contents of an event response

When an event is triggered, the Event Grid service sends data about that event to subscribing endpoint.

This section contains an example of what that data would look like for each blob storage event.

### Microsoft.Storage.BlobCreated event

```json
[{
  "topic": "/subscriptions/{subscription-id}/resourceGroups/Storage/providers/Microsoft.Storage/storageAccounts/my-storage-account",
  "subject": "/blobServices/default/containers/test-container/blobs/new-file.txt",
  "eventType": "Microsoft.Storage.BlobCreated",
  "eventTime": "2017-06-26T18:41:00.9584103Z",
  "id": "831e1650-001e-001b-66ab-eeb76e069631",
  "data": {
    "api": "PutBlockList",
    "clientRequestId": "6d79dbfb-0e37-4fc4-981f-442c9ca65760",
    "requestId": "831e1650-001e-001b-66ab-eeb76e000000",
    "eTag": "0x8D4BCC2E4835CD0",
    "contentType": "text/plain",
    "contentLength": 524288,
    "blobType": "BlockBlob",
    "url": "https://my-storage-account.blob.core.windows.net/testcontainer/new-file.txt",
    "sequencer": "00000000000004420000000000028963",
    "storageDiagnostics": {
      "batchId": "b68529f3-68cd-4744-baa4-3c0498ec19f0"
    }
  },
  "dataVersion": "",
  "metadataVersion": "1"
}]
```

### Microsoft.Storage.BlobCreated event (Data Lake Storage Gen2)

If the blob storage account has a hierarchical namespace, the data looks similar to the previous example with the exception of the these changes:

* The `dataVersion` key is set to a value of `2`.

* The `data.api` key is set to the string `CreateFile` or `FlushWithClose`.

* The `contentOffset` key is included in the data set.

> [!NOTE]
> If applications use the `PutBlockList` operation to upload a new blob to the account, the data won't contain these changes.

```json
[{
  "topic": "/subscriptions/{subscription-id}/resourceGroups/Storage/providers/Microsoft.Storage/storageAccounts/my-storage-account",
  "subject": "/blobServices/default/containers/my-file-system/blobs/new-file.txt",
  "eventType": "Microsoft.Storage.BlobCreated",
  "eventTime": "2017-06-26T18:41:00.9584103Z",
  "id": "831e1650-001e-001b-66ab-eeb76e069631",
  "data": {
    "api": "CreateFile",
    "clientRequestId": "6d79dbfb-0e37-4fc4-981f-442c9ca65760",
    "requestId": "831e1650-001e-001b-66ab-eeb76e000000",
    "eTag": "0x8D4BCC2E4835CD0",
    "contentType": "text/plain",
    "contentLength": 0,
    "contentOffset": 0,
    "blobType": "BlockBlob",
    "url": "https://my-storage-account.dfs.core.windows.net/my-file-system/new-file.txt",
    "sequencer": "00000000000004420000000000028963",  
    "storageDiagnostics": {
    "batchId": "b68529f3-68cd-4744-baa4-3c0498ec19f0"
    }
  },
  "dataVersion": "2",
  "metadataVersion": "1"
}]
```

### Microsoft.Storage.BlobDeleted event

```json
[{
  "topic": "/subscriptions/{subscription-id}/resourceGroups/Storage/providers/Microsoft.Storage/storageAccounts/my-storage-account",
  "subject": "/blobServices/default/containers/testcontainer/blobs/file-to-delete.txt",
  "eventType": "Microsoft.Storage.BlobDeleted",
  "eventTime": "2017-11-07T20:09:22.5674003Z",
  "id": "4c2359fe-001e-00ba-0e04-58586806d298",
  "data": {
    "api": "DeleteBlob",
    "requestId": "4c2359fe-001e-00ba-0e04-585868000000",
    "contentType": "text/plain",
    "blobType": "BlockBlob",
    "url": "https://my-storage-account.blob.core.windows.net/testcontainer/file-to-delete.txt",
    "sequencer": "0000000000000281000000000002F5CA",
    "storageDiagnostics": {
      "batchId": "b68529f3-68cd-4744-baa4-3c0498ec19f0"
    }
  },
  "dataVersion": "",
  "metadataVersion": "1"
}]
```

### Microsoft.Storage.BlobDeleted event (Data Lake Storage Gen2)

If the blob storage account has a hierarchical namespace, the data looks similar to the previous example with the exception of the these changes:

* The `dataVersion` key is set to a value of `2`.

* The `data.api` key is set to the string `DeleteFile`.

* The `url` key contains the path `dfs.core.windows.net`.

> [!NOTE]
> If applications use the `DeleteBlob` operation to delete a blob from the account, the data won't contain these changes.

```json
[{
  "topic": "/subscriptions/{subscription-id}/resourceGroups/Storage/providers/Microsoft.Storage/storageAccounts/my-storage-account",
  "subject": "/blobServices/default/containers/my-file-system/blobs/file-to-delete.txt",
  "eventType": "Microsoft.Storage.BlobDeleted",
  "eventTime": "2017-06-26T18:41:00.9584103Z",
  "id": "831e1650-001e-001b-66ab-eeb76e069631",
    "data": {
    "api": "DeleteFile",
    "clientRequestId": "6d79dbfb-0e37-4fc4-981f-442c9ca65760",
    "requestId": "831e1650-001e-001b-66ab-eeb76e000000",
    "contentType": "text/plain",
    "blobType": "BlockBlob",
    "url": "https://my-storage-account.dfs.core.windows.net/my-file-system/file-to-delete.txt",
    "sequencer": "00000000000004420000000000028963",  
    "storageDiagnostics": {
    "batchId": "b68529f3-68cd-4744-baa4-3c0498ec19f0"
    }
  },
  "dataVersion": "2",
  "metadataVersion": "1"
}]
```

### Microsoft.Storage.BlobRenamed event

```json
[{
  "topic": "/subscriptions/{subscription-id}/resourceGroups/Storage/providers/Microsoft.Storage/storageAccounts/my-storage-account",
  "subject": "/blobServices/default/containers/my-file-system/blobs/my-renamed-file.txt",
  "eventType": "Microsoft.Storage.BlobRenamed",
  "eventTime": "2017-06-26T18:41:00.9584103Z",
  "id": "831e1650-001e-001b-66ab-eeb76e069631",
  "data": {
    "api": "RenameFile",
    "clientRequestId": "6d79dbfb-0e37-4fc4-981f-442c9ca65760",
    "requestId": "831e1650-001e-001b-66ab-eeb76e000000",
    "destinationUrl": "https://my-storage-account.dfs.core.windows.net/my-file-system/my-renamed-file.txt",
    "sourceUrl": "https://my-storage-account.dfs.core.windows.net/my-file-system/my-original-file.txt",
    "sequencer": "00000000000004420000000000028963",  
    "storageDiagnostics": {
    "batchId": "b68529f3-68cd-4744-baa4-3c0498ec19f0"
    }
  },
  "dataVersion": "1",
  "metadataVersion": "1"
}]
```

### Microsoft.Storage.DirectoryCreated event

```json
[{
  "topic": "/subscriptions/{subscription-id}/resourceGroups/Storage/providers/Microsoft.Storage/storageAccounts/my-storage-account",
  "subject": "/blobServices/default/containers/my-file-system/blobs/my-new-directory",
  "eventType": "Microsoft.Storage.DirectoryCreated",
  "eventTime": "2017-06-26T18:41:00.9584103Z",
  "id": "831e1650-001e-001b-66ab-eeb76e069631",
  "data": {
    "api": "CreateDirectory",
    "clientRequestId": "6d79dbfb-0e37-4fc4-981f-442c9ca65760",
    "requestId": "831e1650-001e-001b-66ab-eeb76e000000",
    "url": "https://my-storage-account.dfs.core.windows.net/my-file-system/my-new-directory",
    "sequencer": "00000000000004420000000000028963",  
    "storageDiagnostics": {
    "batchId": "b68529f3-68cd-4744-baa4-3c0498ec19f0"
    }
  },
  "dataVersion": "1",
  "metadataVersion": "1"
}]
```

### Microsoft.Storage.DirectoryRenamed event

```json
[{
  "topic": "/subscriptions/{subscription-id}/resourceGroups/Storage/providers/Microsoft.Storage/storageAccounts/my-storage-account",
  "subject": "/blobServices/default/containers/my-file-system/blobs/my-renamed-directory",
  "eventType": "Microsoft.Storage.DirectoryRenamed",
  "eventTime": "2017-06-26T18:41:00.9584103Z",
  "id": "831e1650-001e-001b-66ab-eeb76e069631",
  "data": {
    "api": "RenameDirectory",
    "clientRequestId": "6d79dbfb-0e37-4fc4-981f-442c9ca65760",
    "requestId": "831e1650-001e-001b-66ab-eeb76e000000",
    "destinationUrl": "https://my-storage-account.dfs.core.windows.net/my-file-system/my-renamed-directory",
    "sourceUrl": "https://my-storage-account.dfs.core.windows.net/my-file-system/my-original-directory",
    "sequencer": "00000000000004420000000000028963",  
    "storageDiagnostics": {
    "batchId": "b68529f3-68cd-4744-baa4-3c0498ec19f0"
    }
  },
  "dataVersion": "1",
  "metadataVersion": "1"
}]
```

### Microsoft.Storage.DirectoryDeleted event

```json
[{
  "topic": "/subscriptions/{subscription-id}/resourceGroups/Storage/providers/Microsoft.Storage/storageAccounts/my-storage-account",
  "subject": "/blobServices/default/containers/my-file-system/blobs/directory-to-delete",
  "eventType": "Microsoft.Storage.DirectoryDeleted",
  "eventTime": "2017-06-26T18:41:00.9584103Z",
  "id": "831e1650-001e-001b-66ab-eeb76e069631",
  "data": {
    "api": "DeleteDirectory",
    "clientRequestId": "6d79dbfb-0e37-4fc4-981f-442c9ca65760",
    "requestId": "831e1650-001e-001b-66ab-eeb76e000000",
    "url": "https://my-storage-account.dfs.core.windows.net/my-file-system/directory-to-delete",
    "recursive": "true", 
    "sequencer": "00000000000004420000000000028963",  
    "storageDiagnostics": {
    "batchId": "b68529f3-68cd-4744-baa4-3c0498ec19f0"
    }
  },
  "dataVersion": "1",
  "metadataVersion": "1"
}]
```

## Event properties

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| topic | string | Full resource path to the event source. This field is not writeable. Event Grid provides this value. |
| subject | string | Publisher-defined path to the event subject. |
| eventType | string | One of the registered event types for this event source. |
| eventTime | string | The time the event is generated based on the provider's UTC time. |
| id | string | Unique identifier for the event. |
| data | object | Blob storage event data. |
| dataVersion | string | The schema version of the data object. The publisher defines the schema version. |
| metadataVersion | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| api | string | The operation that triggered the event. |
| clientRequestId | string | a client-provided request id for the storage API operation. This id can be used to correlate to Azure Storage diagnostic logs using the "client-request-id" field in the logs, and can be provided in client requests using the "x-ms-client-request-id" header. See [Log Format](https://docs.microsoft.com/rest/api/storageservices/storage-analytics-log-format). |
| requestId | string | Service-generated request id for the storage API operation. Can be used to correlate to Azure Storage diagnostic logs using the "request-id-header" field in the logs and is returned from initiating API call in the 'x-ms-request-id' header. See [Log Format](https://docs.microsoft.com/rest/api/storageservices/storage-analytics-log-format). |
| eTag | string | The value that you can use to perform operations conditionally. |
| contentType | string | The content type specified for the blob. |
| contentLength | integer | The size of the blob in bytes. |
| blobType | string | The type of blob. Valid values are either "BlockBlob" or "PageBlob". |
| contentOffset | number | The offset in bytes of a write operation taken at the point where the event-triggering application completed writing to the file. <br>Appears only for events triggered on blob storage accounts that have a hierarchical namespace.|
| destinationUrl |string | The url of the file that will exist after the operation completes. For example, if a file is renamed, the `destinationUrl` property contains the url of the new file name. <br>Appears only for events triggered on blob storage accounts that have a hierarchical namespace.|
| sourceUrl |string | The url of the file that exists prior to the operation. For example, if a file is renamed, the `sourceUrl` contains the url of the original file name prior to the rename operation. <br>Appears only for events triggered on blob storage accounts that have a hierarchical namespace. |
| url | string | The path to the blob. <br>If the client uses a Blob REST API, then the url has this structure: *\<storage-account-name\>.blob.core.windows.net/\<container-name\>/\<file-name\>*. <br>If the client uses a Data Lake Storage REST API, then the url has this structure: *\<storage-account-name\>.dfs.core.windows.net/\<file-system-name\>/\<file-name\>*.
|
| recursive| string| `True` to perform the operation on all child directories; otherwise `False`. <br>Appears only for events triggered on blob storage accounts that have a hierarchical namespace. |
| sequencer | string | An opaque string value representing the logical sequence of events for any particular blob name.  Users can use standard string comparison to understand the relative sequence of two events on the same blob name. |
| storageDiagnostics | object | Diagnostic data occasionally included by the Azure Storage service. When present, should be ignored by event consumers. |

|Property|Type|Description|
 |-------------------|------------------------|-----------------------------------------------------------------------|

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
* For an introduction to working with blob storage events, see [Route Blob storage events - Azure CLI](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json). 
