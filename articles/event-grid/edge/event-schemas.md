---
title: Event schemas - Azure Event Grid IoT Edge | Microsoft Docs 
description: Event schemas in Event Grid on IoT Edge.  
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: 
ms.date: 07/18/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Event schemas

Event Grid module accepts and delivers events in JSON format. There are currently two schemas that are supported by Event Grid: -

* **EventGridSchema**
* **CustomSchema**

You can configure the schema that a publisher needs to conform to during topic creation. If unspecified, it defaults to **EventGridSchema**. Events that do not conform to the expected schema will be rejected.

Subscribers can also configure the schema in which they want the events delivered. If unspecified, default will be topic's schema.
Currently subscriber delivery schema has to match its topic's input schema. 

## EventGrid schema

EventGrid schema consists of a set of required properties that a publishing entity needs to conform to. Each publisher has to populate the top-level fields.

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

### EventGrid schema properties
All events have the following top-level data:

| Property | Type | Required | Description |
| -------- | ---- | ----------- |-----------
| topic | string | No | Should match the topic on which it is published. Event Grid populates it with the name of the topic on which it is published if unspecified. |
| subject | string | Yes | Publisher-defined path to the event subject. |
| eventType | string | Yes | Event type for this event source, for example, BlobCreated. |
| eventTime | string | Yes | The time the event is generated based on the provider's UTC time. |
| id | string | No | Unique identifier for the event. |
| data | object | No | Used to capture Event data specific to the publishing entity. |
| dataVersion | string | Yes | The schema version of the data object. The publisher defines the schema version. |
| metadataVersion | string | No | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

### Example - EventGrid schema event

```json
[
  {
    "id": "1807",
    "eventType": "recordInserted",
    "subject": "myapp/vehicles/motorcycles",
    "eventTime": "2017-08-10T21:03:07+00:00",
    "data": {
      "make": "Ducati",
      "model": "Monster"
    },
    "dataVersion": "1.0"
  }
]
```

## CustomEvent schema

In custom schema, there are no mandatory properties that are enforced like the EventGrid schema. Publishing entity can control the event schema entirely. This provides maximum flexibility and enables scenarios where you have an event-based system already in place and would like to reuse existing events and/or do not want to be tied down to a specific schema.

### Custom schema properties

No mandatory properties. It is up to the publishing entity to determine the payload.

### Example - Custom Schema Event

```json
[
  {
    "eventdata": {
      "make": "Ducati",
      "model": "Monster"
    }
  }
]
```