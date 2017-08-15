---
title: Azure Event Grid event schema
description: Describes the properties that are provided for events with Azure Event Grid.
services: event-grid
author: banisadr
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 08/15/2017
ms.author: babanisa
---

# Event Grid event schema

This article provides the properties and schema for events. Events consist of a set of five required string properties and a required **data** object. The properties are common to all events from any publisher. The **data** object contains properties that are specific to each publisher. For system topics, these properties are specific to the resource provider, such as Storage or Event Hubs.

Events are sent to Azure Event Grid in an array, which can contain multiple event objects. If there is only a single event, the array has a length of 1. 
 
## Event properties

| Property | Type | Description |
| -------- | ---- | ----------- |
| topic | string | Full resource path to the event source. This field is not writeable. |
| subject | string | Publisher defined path to the event subject. |
| eventType | string | One of the registered event types for this event source. |
| eventTime | string | The time the event is generated based on the provider's UTC time. |
| id | string | Unique identifier for the event. |
| data | object | Event data specific to the resource provider. |

When publishing events to custom topics you should consider modeling the subject of your events to aid in routing and filtering.

## Example event schema

This sample event shows the schema of a storage event raised when a blob is created. 

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

* For an introduction to Event Grid, see [What is Event Grid?](overview.md)
* To learn about creating an Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).