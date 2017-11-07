---
title: Azure Event Grid event schema
description: Describes the properties that are provided for events with Azure Event Grid
services: event-grid
author: banisadr
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 11/06/2017
ms.author: babanisa
---

# Azure Event Grid event schema

This article provides the properties and schema for events. Events consist of a set of five required string properties and a required data object. The properties are common to all events from any publisher. The data object contains properties that are specific to each publisher. For system topics, these properties are specific to the resource provider, such as Azure Storage or Azure Event Hubs.

Events are sent to Azure Event Grid in an array, which can contain multiple event objects. If there is only a single event, the array has a length of 1. The array can have a total size of up to 1 MB. Each event in the array is limited to 64 KB.

## Available event types

Storage blobs raise the following event types:

- **Microsoft.Storage.BlobCreated**: Raised when a blob is created.
- **Microsoft.Storage.BlobDeleted**: Raised when a blob is deleted.

## Example event

This sample event shows the schema of a storage event raised when a blob is created: 

```json
[
  {
    "topic": "/subscriptions/{subscription-id}/resourceGroups/Storage/providers/Microsoft.Storage/storageAccounts/xstoretestaccount",
    "subject": "/blobServices/default/containers/oc2d2817345i200097container/blobs/oc2d2817345i20002296blob",
    "eventType": "Microsoft.Storage.BlobCreated",
    "eventTime": "2017-06-26T18:41:00.9584103Z",
    "id": "831e1650-001e-001b-66ab-eeb76e069631",
    "data": {
      "api": "PutBlockList",
      "clientRequestId": "6d79dbfb-0e37-4fc4-981f-442c9ca65760",
      "requestId": "831e1650-001e-001b-66ab-eeb76e000000",
      "eTag": "0x8D4BCC2E4835CD0",
      "contentType": "application/octet-stream",
      "contentLength": 524288,
      "blobType": "BlockBlob",
      "url": "https://oc2d2817345i60006.blob.core.windows.net/oc2d2817345i200097container/oc2d2817345i20002296blob",
      "sequencer": "00000000000004420000000000028963",
      "storageDiagnostics": {
        "batchId": "b68529f3-68cd-4744-baa4-3c0498ec19f0"
      }
    }
  }
]
```
 
## Event properties

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| topic | string | Full resource path to the event source. This field is not writeable. |
| subject | string | Publisher-defined path to the event subject. |
| eventType | string | One of the registered event types for this event source. |
| eventTime | string | The time the event is generated based on the provider's UTC time. |
| id | string | Unique identifier for the event. |
| data | object | Storage blob event data. |

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| api | string | The operation that triggered the event. |
| clientRequestId | string | A client-generated, opaque value with a 1 KB character limit that is recorded in the analytics logs when storage analytics logging is enabled. |
| requestId | string | The unique identifier for the request. You can be use it for troubleshooting the request. |
| eTag | string | The value that you can use to perform operations conditionally. |
| contentType | string | The content type specified for the blob. |
| contentLength | integer | The size of the blob in bytes. |
| blobType | string | The type of blob. |
| url | string | The path to the blob. |
| sequencer | string | A user-controlled value that you can use to track requests. |
| storageDiagnostics | object | Information about the storage diagnostics. |
 
## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md).
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
