---
title: Event schemas — Azure Event Grid IoT Edge | Microsoft Docs 
description: Event schemas in Event Grid on IoT Edge.  
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru
ms.subservice: iot-edge
ms.date: 05/10/2021
ms.topic: article
---

# Event schemas

Event Grid module accepts and delivers events in JSON format. There are currently three schemas that are supported by Event Grid: -

* **EventGridSchema**
* **CustomSchema**
* **CloudEventSchema**

You can configure the schema that a publisher must conform to during topic creation. If unspecified, it defaults to **EventGridSchema**. Events that don't conform to the expected schema will be rejected.

Subscribers can also configure the schema in which they want the events delivered. If unspecified, default is topic's schema.
Currently subscriber delivery schema has to match its topic's input schema. 

## EventGrid schema

EventGrid schema consists of a set of required properties that a publishing entity must conform to. Each publisher has to populate the top-level fields.

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
| topic | string | No | Should match the topic on which it's published. Event Grid populates it with the name of the topic on which it's published if unspecified. |
| subject | string | Yes | Publisher-defined path to the event subject. |
| eventType | string | Yes | Event type for this event source, for example, BlobCreated. |
| eventTime | string | Yes | The time the event is generated based on the provider's UTC time. |
| ID | string | No | Unique identifier for the event. |
| data | object | No | Used to capture event data that's specific to the publishing entity. |
| dataVersion | string | Yes | The schema version of the data object. The publisher defines the schema version. |
| metadataVersion | string | No | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

### Example — EventGrid schema event

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

In custom schema, there are no mandatory properties that are enforced like the EventGrid schema. Publishing entity can control the event schema entirely. It provides maximum flexibility and enables scenarios where you have an event-based system already in place and would like to reuse existing events and/or don't want to be tied down to a specific schema.

### Custom schema properties

No mandatory properties. It's up to the publishing entity to determine the payload.

### Example — Custom Schema Event

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

## CloudEvent schema

In addition to the above schemas, Event Grid natively supports events in the [CloudEvents JSON schema](https://github.com/cloudevents/spec/blob/master/json-format.md). CloudEvents is an open specification for describing event data. It simplifies interoperability by providing a common event schema for publishing, and consuming events. It is part of [CNCF](https://www.cncf.io/) and currently available version is 1.0-rc1.

### CloudEvent schema properties

Refer to [CloudEvents specification](https://github.com/cloudevents/spec/blob/master/json-format.md#3-envelope) on the mandatory envelope properties.

### Example — cloud event
```json
[{
       "id": "1807",
       "type": "recordInserted",
       "source": "myapp/vehicles/motorcycles",
       "time": "2017-08-10T21:03:07+00:00",
       "datacontenttype": "application/json",
       "data": {
            "make": "Ducati",
            "model": "Monster"
        },
        "dataVersion": "1.0",
        "specVersion": "1.0-rc1"
}]
```
