---
title: Azure Event Grid event schema
description: Describes the properties and schema for the proprietary, nonextensible, yet fully functional Event Grid format. 
ms.topic: reference
ms.date: 05/24/2023
---

# Azure Event Grid event schema

This article describes the Event Grid schema, which is a proprietary, nonextensible, yet fully functional event format. Event Grid still supports this event format and will continue to support it. However, [CloudEvents](cloud-event-schema.md) is the recommended event format to use. If you're using applications that use the Event Grid format, you may find useful the information in the [CloudEvents] section that describes the transformations between the Event Grid and CloudEvents format supported by Event Grid.

This article describes in detail the properties and schema for the Event Grid format. Events consist of a set of four required string properties. The properties are common to all events from any publisher. The data object has properties that are specific to each publisher. For system topics, these properties are specific to the resource provider, such as Azure Storage or Azure Event Hubs.

Event sources send events to Azure Event Grid in an array, which can have several event objects. When posting events to an Event Grid topic, the array can have a total size of up to 1 MB. Each event in the array is limited to 1 MB. If an event or the array is greater than the size limits, you receive the response **413 Payload Too Large**. Operations are charged in 64 KB increments though. So, events over 64 KB incur operations charges as though they were multiple events. For example, an event that is 130 KB would incur operations as though it were three separate events.

Event Grid sends the events to subscribers in an array that has a single event. This behavior may change in the future.

You can find the JSON schema for the Event Grid event and each Azure publisher's data payload in the [Event Schema store](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/eventgrid/data-plane).

## Event schema

The following example shows the properties that are used by all event publishers:

```json
[
  {
    "topic": string,
    "subject": string,
    "id": string,
    "eventType": string,
    "eventTime": string,
    "data":{
      object-unique-to-each-publisher
    },
    "dataVersion": string,
    "metadataVersion": string
  }
]
```

For example, the schema published for an Azure Blob storage event is:

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
    },
    "dataVersion": "",
    "metadataVersion": "1"
  }
]
```

## Event properties

All events have the same following top-level data:

| Property | Type | Required | Description |
| -------- | ---- | -------- | ----------- |
| `topic` | string | No, but if included, must match the Event Grid topic Azure Resource Manager ID exactly. If not included, Event Grid stamps onto the event. | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | Yes | Publisher-defined path to the event subject. |
| `eventType` | string | Yes | One of the registered event types for this event source. |
| eventTime | string | Yes | The time the event is generated based on the provider's UTC time. |
| `id` | string | Yes | Unique identifier for the event. |
| `data` | object | No | Event data specific to the resource provider. |
| `dataVersion` | string | No, but will be stamped with an empty value. | The schema version of the data object. The publisher defines the schema version. |
| `metadataVersion` | string | Not required, but if included, must match the Event Grid Schema `metadataVersion` exactly (currently, only `1`). If not included, Event Grid stamps onto the event. | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

To learn about the properties in the data object, see the event source:

* [Azure Policy](./event-schema-policy.md)
* [Azure subscriptions (management operations)](event-schema-subscriptions.md)
* [Container Registry](event-schema-container-registry.md)
* [Blob storage](event-schema-blob-storage.md)
* [Event Hubs](event-schema-event-hubs.md)
* [IoT Hub](event-schema-iot-hub.md)
* [Media Services](/azure/media-services/latest/monitoring/media-services-event-schemas?toc=%2fazure%2fevent-grid%2ftoc.json)
* [Resource groups (management operations)](event-schema-resource-groups.md)
* [Service Bus](event-schema-service-bus.md)
* [Azure SignalR](event-schema-azure-signalr.md)
* [Azure Machine Learning](event-schema-machine-learning.md)

For custom topics, the event publisher determines the data object. The top-level data should have the same fields as standard resource-defined events.

When publishing events to custom topics, create subjects for your events that make it easy for subscribers to know whether they're interested in the event. Subscribers use the subject to filter and route events. Consider providing the path for where the event happened, so subscribers can filter by segments of that path. The path enables subscribers to narrowly or broadly filter events. For example, if you provide a three segment path like `/A/B/C` in the subject, subscribers can filter by the first segment `/A` to get a broad set of events. Those subscribers get events with subjects like `/A/B/C` or `/A/D/E`. Other subscribers can filter by `/A/B` to get a narrower set of events.

Sometimes your subject needs more detail about what happened. For example, the **Storage Accounts** publisher provides the subject `/blobServices/default/containers/<container-name>/blobs/<file>` when a file is added to a container. A subscriber could filter by the path `/blobServices/default/containers/testcontainer` to get all events for that container but not other containers in the storage account. A subscriber could also filter or route by the suffix `.txt` to only work with text files.

## CloudEvents
CloudEvents is the recommended event format to use. Azure Event Grid continues investing in features related to at least [CloudEvents JSON](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md) format. Given the fact that some event sources like Azure services use the Event Grid format, the following table is provided to help you understand the transformation supported when using CloudEvents and Event Grid formats as an input schema in topics and as an output schema in event subscriptions. An Event Grid output schema can't be used when using CloudEvents as an input schema because CloudEvents supports [extension attributes](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/primer.md#cloudevent-attribute-extensions) that aren't supported by the Event Grid schema.

| Input schema       | Output schema
|--------------------|---------------------
| CloudEvents format | CloudEvents format
| Event Grid format  | CloudEvents format
| Event Grid format  | Event Grid format

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).