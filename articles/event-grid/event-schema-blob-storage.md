---
title: Azure Event Grid blob storage event schema
description: Describes the properties that are provided for blob storage events with Azure Event Grid
services: event-grid
author: tfitzmac

ms.service: event-grid
ms.topic: reference
ms.date: 08/17/2018
ms.author: tomfitz
---

# Azure Event Grid event schema for Blob storage

This article provides the properties and schema for blob storage events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

For a list of sample scripts and tutorials, see [Storage event source](event-sources.md#storage).

## Available event types

Blob storage emits the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.Storage.BlobCreated | Raised when a blob is created. |
| Microsoft.Storage.BlobDeleted | Raised when a blob is deleted. |

## Example event

The following example shows the schema of a blob created event: 

```json
[{
  "topic": "/subscriptions/{subscription-id}/resourceGroups/Storage/providers/Microsoft.Storage/storageAccounts/xstoretestaccount",
  "subject": "/blobServices/default/containers/testcontainer/blobs/testfile.txt",
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
    "url": "https://example.blob.core.windows.net/testcontainer/testfile.txt",
    "sequencer": "00000000000004420000000000028963",
    "storageDiagnostics": {
      "batchId": "b68529f3-68cd-4744-baa4-3c0498ec19f0"
    }
  },
  "dataVersion": "",
  "metadataVersion": "1"
}]
```

The schema for a blob deleted event is similar: 

```json
[{
  "topic": "/subscriptions/{subscription-id}/resourceGroups/Storage/providers/Microsoft.Storage/storageAccounts/xstoretestaccount",
  "subject": "/blobServices/default/containers/testcontainer/blobs/testfile.txt",
  "eventType": "Microsoft.Storage.BlobDeleted",
  "eventTime": "2017-11-07T20:09:22.5674003Z",
  "id": "4c2359fe-001e-00ba-0e04-58586806d298",
  "data": {
    "api": "DeleteBlob",
    "requestId": "4c2359fe-001e-00ba-0e04-585868000000",
    "contentType": "text/plain",
    "blobType": "BlockBlob",
    "url": "https://example.blob.core.windows.net/testcontainer/testfile.txt",
    "sequencer": "0000000000000281000000000002F5CA",
    "storageDiagnostics": {
      "batchId": "b68529f3-68cd-4744-baa4-3c0498ec19f0"
    }
  },
  "dataVersion": "",
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
| clientRequestId | string | A client-generated, opaque value with a 1-KB character limit. When you have enabled storage analytics logging, it is recorded in the analytics logs. |
| requestId | string | The unique identifier for the request. Use it for troubleshooting the request. |
| eTag | string | The value that you can use to perform operations conditionally. |
| contentType | string | The content type specified for the blob. |
| contentLength | integer | The size of the blob in bytes. |
| blobType | string | The type of blob. Valid values are either "BlockBlob" or "PageBlob". |
| url | string | The path to the blob. |
| sequencer | string | A user-controlled value that you can use to track requests. |
| storageDiagnostics | object | Information about the storage diagnostics. |
 
## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
* For an introduction to working with blob storage events, see [Route Blob storage events - Azure CLI](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json). 
