---
title: Azure Event Grid event schema
description: Describes the properties that are provided for events with Azure Event Grid
services: event-grid
author: banisadr
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 10/20/2017
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

## Custom topics

The data payload of your custom events is defined by you and can be any well formatted JSON object. The top-level data should contain the same fields as standard resource-defined events. When publishing events to custom topics, you should consider modeling the subject of your events to aid in routing and filtering.

### Example event

The following example shows an event for a custom topic:

```json
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
```

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md).
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
