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

### Available event types

Event Hubs raises the **Microsoft.EventHub.CaptureFileCreated** event type when a capture file is created.

## Example event

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


## Event Hubs

Event Hubs events are currently emitted only when a file is automatically sent to storage via the Capture feature.


### Example event



## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md).
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
