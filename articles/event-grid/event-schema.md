---
title: Azure Event Grid event schema
description: Describes the properties that are provided for events with Azure Event Grid
services: event-grid
author: banisadr
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 09/18/2017
ms.author: babanisa
---

# Azure Event Grid event schema

This article provides the properties and schema for events. Events consist of a set of five required string properties and a required data object. The properties are common to all events from any publisher. The data object contains properties that are specific to each publisher. For system topics, these properties are specific to the resource provider, such as Azure Storage or Azure Event Hubs.

Events are sent to Azure Event Grid in an array, which can contain multiple event objects. If there is only a single event, the array has a length of 1. The array can have a total size of up to 1 MB. Each event in the array is limited to 64 KB.
 
## Event properties

All events will contain the same following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| topic | string | Full resource path to the event source. This field is not writeable. |
| subject | string | Publisher-defined path to the event subject. |
| eventType | string | One of the registered event types for this event source. |
| eventTime | string | The time the event is generated based on the provider's UTC time. |
| id | string | Unique identifier for the event. |
| data | object | Event data specific to the resource provider. |

## Available event sources

The following event sources publish events for consumption via Event Grid:

* Resource groups (management operations)
* Azure subscriptions (management operations)
* Event hubs
* Custom topics

## Azure subscriptions

Azure subscriptions can now emit management events from Azure Resource Manager, such as when a VM is created or a storage account is deleted.

### Available event types

- **Microsoft.Resources.ResourceWriteSuccess**: Raised when a resource create or update operation succeeds.  
- **Microsoft.Resources.ResourceWriteFailure**: Raised when a resource create or update operation fails.  
- **Microsoft.Resources.ResourceWriteCancel**: Raised when a resource create or update operation is canceled.  
- **Microsoft.Resources.ResourceDeleteSuccess**: Raised when a resource delete operation succeeds.  
- **Microsoft.Resources.ResourceDeleteFailure**: Raised when a resource delete operation fails.  
- **Microsoft.Resources.ResourceDeleteCancel**: Raised when a resource delete operation is canceled. This happens when a template deployment is canceled.

### Example event schema

```json
[
    {
    "topic":"/subscriptions/{subscription-id}",
    "subject":"/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.EventGrid/eventSubscriptions/LogicAppdd584bdf-8347-49c9-b9a9-d1f980783501",
    "eventType":"Microsoft.Resources.ResourceWriteSuccess",
    "eventTime":"2017-08-16T03:54:38.2696833Z",
    "id":"25b3b0d0-d79b-44d5-9963-440d4e6a9bba",
    "data": {
        "authorization":"{azure_resource_manager_authorizations}",
        "claims":"{azure_resource_manager_claims}",
        "correlationId":"54ef1e39-6a82-44b3-abc1-bdeb6ce4d3c6",
        "httpRequest":"",
        "resourceProvider":"Microsoft.EventGrid",
        "resourceUri":"/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.EventGrid/eventSubscriptions/LogicAppdd584bdf-8347-49c9-b9a9-d1f980783501",
        "operationName":"Microsoft.EventGrid/eventSubscriptions/write",
        "status":"Succeeded",
        "subscriptionId":"{subscription-id}",
        "tenantId":"72f988bf-86f1-41af-91ab-2d7cd011db47"
        },
    }
]
```



## Resource groups

Resource groups can now emit management events from Azure Resource Manager, such as when a VM is created or a storage account is deleted.

### Available event types

- **Microsoft.Resources.ResourceWriteSuccess**: Raised when a resource create or update operation succeeds.  
- **Microsoft.Resources.ResourceWriteFailure**: Raised when a resource create or update operation fails.  
- **Microsoft.Resources.ResourceWriteCancel**: Raised when a resource create or update operation is canceled.  
- **Microsoft.Resources.ResourceDeleteSuccess**: Raised when a resource delete operation succeeds.  
- **Microsoft.Resources.ResourceDeleteFailure**: Raised when a resource delete operation fails.  
- **Microsoft.Resources.ResourceDeleteCancel**: Raised when a resource delete operation is canceled. This happens when a template deployment is canceled.

### Example event

```json
[
    {
    "topic":"/subscriptions/{subscription-id}/resourceGroups/{resource-group}",
    "subject":"/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.EventGrid/eventSubscriptions/LogicAppdd584bdf-8347-49c9-b9a9-d1f980783501",
    "eventType":"Microsoft.Resources.ResourceWriteSuccess",
    "eventTime":"2017-08-16T03:54:38.2696833Z",
    "id":"25b3b0d0-d79b-44d5-9963-440d4e6a9bba",
    "data": {
        "authorization":"{azure_resource_manager_authorizations}",
        "claims":"{azure_resource_manager_claims}",
        "correlationId":"54ef1e39-6a82-44b3-abc1-bdeb6ce4d3c6",
        "httpRequest":"",
        "resourceProvider":"Microsoft.EventGrid",
        "resourceUri":"/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.EventGrid/eventSubscriptions/LogicAppdd584bdf-8347-49c9-b9a9-d1f980783501",
        "operationName":"Microsoft.EventGrid/eventSubscriptions/write",
        "status":"Succeeded",
        "subscriptionId":"{subscription-id}",
        "tenantId":"72f988bf-86f1-41af-91ab-2d7cd011db47"
        },
    }
]
```



## Event Hubs

Event Hubs events are currently emitted only when a file is automatically sent to storage via the Capture feature.

### Available event types

- **Microsoft.EventHub.CaptureFileCreated**: Raised when a capture file is created.

### Example event

This sample event shows the schema of an Event Hubs event raised when the Capture feature stores a file: 

```json
[
    {
        "topic": "/subscriptions/{subscription-id}/resourcegroups/{resource-group}/providers/Microsoft.EventHub/namespaces/{event-hubs-ns}",
        "subject": "eventhubs/eh1",
        "eventType": "Microsoft.EventHub.CaptureFileCreated",
        "eventTime": "2017-07-11T00:55:55.0120485Z",
        "id": "bd440490-a65e-4c97-8298-ef1eb325673c",
        "data": {
            "fileUrl": "https://gridtest1.blob.core.windows.net/acontainer/eventgridtest1/eh1/1/2017/07/11/00/54/54.avro",
            "fileType": "AzureBlockBlob",
            "partitionId": "1",
            "sizeInBytes": 0,
            "eventCount": 0,
            "firstSequenceNumber": -1,
            "lastSequenceNumber": -1,
            "firstEnqueueTime": "0001-01-01T00:00:00",
            "lastEnqueueTime": "0001-01-01T00:00:00"
        },
    }
]

```


## Azure Blob storage

>[!IMPORTANT]
>You must be registered for the Blob storage events preview to use Blob storage events. For more information about the preview program, see [Azure Blob storage events](https://docs.microsoft.com/azure/storage/blobs/storage-blob-event-overview#join-the-preview).  


### Available event types

- **Microsoft.Storage.BlobCreated**: Raised when a blob is created.
- **Microsoft.Storage.BlobDeleted**: Raised when a blob is deleted.

### Example event

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




## Custom topics

The data payload of your custom events is defined by you and can be any well formatted JSON object. The top-level data should contain the same fields as standard resource-defined events. When publishing events to custom topics, you should consider modeling the subject of your events to aid in routing and filtering.

### Example event

The following example shows an event for a custom topic:
````json
[
  {
    "topic": "/subscriptions/{subscription-id}/resourceGroups/Storage/providers/Microsoft.EventGrid/topics/myeventgridtopic",
    "subject": "/myapp/vehicles/motorcycles",    
    "id": "b68529f3-68cd-4744-baa4-3c0498ec19e2",
    "eventType": "recordInserted",
    "eventTime": "2017-06-26T18:41:00.9584103Z",
    "data":{
      "make": "Ducati",
      "model": "Monster"
    }
  }
]

````

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md).
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
