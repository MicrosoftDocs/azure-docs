---
title: Azure Event Grid event hubs event schema
description: Describes the properties that are provided for event hubs events with Azure Event Grid
services: event-grid
author: tfitzmac

ms.service: event-grid
ms.topic: reference
ms.date: 08/17/2018
ms.author: tomfitz
---

# Azure Event Grid event schema for event hubs

This article provides the properties and schema for event hubs events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

For a list of sample scripts and tutorials, see [Event Hubs event source](event-sources.md#event-hubs).

### Available event types

Event Hubs emits the **Microsoft.EventHub.CaptureFileCreated** event type when a capture file is created.

## Example event

This sample event shows the schema of an event hubs event raised when the capture feature stores a file: 

```json
[
    {
        "topic": "/subscriptions/<guid>/resourcegroups/rgDataMigrationSample/providers/Microsoft.EventHub/namespaces/tfdatamigratens",
        "subject": "eventhubs/hubdatamigration",
        "eventType": "Microsoft.EventHub.CaptureFileCreated",
        "eventTime": "2017-08-31T19:12:46.0498024Z",
        "id": "14e87d03-6fbf-4bb2-9a21-92bd1281f247",
        "data": {
            "fileUrl": "https://tf0831datamigrate.blob.core.windows.net/windturbinecapture/tfdatamigratens/hubdatamigration/1/2017/08/31/19/11/45.avro",
            "fileType": "AzureBlockBlob",
            "partitionId": "1",
            "sizeInBytes": 249168,
            "eventCount": 1500,
            "firstSequenceNumber": 2400,
            "lastSequenceNumber": 3899,
            "firstEnqueueTime": "2017-08-31T19:12:14.674Z",
            "lastEnqueueTime": "2017-08-31T19:12:44.309Z"
        },
        "dataVersion": "",
        "metadataVersion": "1"
    }
]
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
| data | object | Event hub event data. |
| dataVersion | string | The schema version of the data object. The publisher defines the schema version. |
| metadataVersion | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| fileUrl | string | The path to the capture file. |
| fileType | string | The file type of the capture file. |
| partitionId | string | The shard ID. |
| sizeInBytes | integer | The file size. |
| eventCount | integer | The number of events in the file. |
| firstSequenceNumber | integer | The smallest sequence number from the queue. |
| lastSequenceNumber | integer | The last sequence number from the queue. |
| firstEnqueueTime | string | The first time from the queue. |
| lastEnqueueTime | string | The last time from the queue. |

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
* For information about handling event hubs events, see [Stream big data into a data warehouse](event-grid-event-hubs-integration.md).