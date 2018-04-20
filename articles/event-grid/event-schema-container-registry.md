---
title: Azure Event Grid Container Registry event schema
description: Describes the properties that are provided for Container Reigstry events with Azure Event Grid
services: event-grid
author: tfitzmac
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 04/20/2018
ms.author: tomfitz
---

# Azure Event Grid event schema for Container Registry

This article provides the properties and schema for Container Registry events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

## Available event types

Blob storage emits the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.ContainerRegistry.ImagePushed | Raised when an image is pushed. |
| Microsoft.ContainerRegistry.ImageDeleted | Raised when an image is deleted. |

## Example event

The following example shows the schema of an image pushed event: 

```json
[{
  "topic": "",
  "subject": "",
  "eventType": "Microsoft.ContainerRegistry.ImagePushed",
  "eventTime": "2018-04-20T18:41:00.9584103Z",
  "id": "831e1650-001e-001b-66ab-eeb76e069631",
  "data": {
    "id": "",
    "timestamp": "",
    "action": "",
    "target": {
      "mediaType": "",
      "size": ,
      "digest": "",
      "length": ,
      "repository": "",
      "url": "",
      "tag": ""
    },
    "request": {
      "id": "",
      "addr": "",
      "host": "",
      "method": "",
      "useragent": ""
    },
    "actor": {
      "name": ""
    },
    "source": {
      "addr": "",
      "instanceID": ""
    },
  },
  "dataVersion": "",
  "metadataVersion": "1"
}]
```

The schema for an image deleted event is similar: 

```json
[{
  "topic": "",
  "subject": "",
  "eventType": "Microsoft.ContainerRegistry.ImageDeleted",
  "eventTime": "2018-04-20T18:41:00.9584103Z",
  "id": "831e1650-001e-001b-66ab-eeb76e069631",
  "data": {
    "id": "",
    "timestamp": "",
    "action": "",
    "target": {
      "mediaType": "",
      "size": ,
      "digest": "",
      "length": ,
      "repository": "",
      "url": "",
      "tag": ""
    },
    "request": {
      "id": "",
      "addr": "",
      "host": "",
      "method": "",
      "useragent": ""
    },
    "actor": {
      "name": ""
    },
    "source": {
      "addr": "",
      "instanceID": ""
    },
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
| id | string | The event ID. |
| timestamp | string | The time at which the event occurred. |
| action | string | The action that encompasses the provided event. |
| target | object | The target of the event. |
| request | object | The request that generated the event. |
| actor | object | The agent that initiated the event. For most situations, this value could be from the authorization context of the request. |
| source | object | The registry node that generated the event. Put differently, while the actor initiates the event, the source generates it. |

The target object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| mediaType | string | The MIME type of the referenced object. |
| size | integer | The number of bytes of the content. Same as Length field. |
| digest | string | The digest of the content, as defined by the Registry V2 HTTP API Specification. |
| length | integer | The number of bytes of the content. Same as Size field. |
| repository | string | The repository name. |
| url | string | The direct URL to the content. |
| tag | string | The tag name. |

The request object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| id | string | The ID of the request that initiated the event. |
| addr | string | The IP or hostname and possibly port of the client connection that initiated the event. This value is the RemoteAddr from the standard http request. |
| host | string | The externally accessible hostname of the registry instance, as specified by the http host header on incoming requests. |
| method | string | The request method that generated the event. |
| useragent | string | The user agent header of the request. |

The actor object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| name | string | The subject or username associated with the request context that generated the event. |

The source object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| addr | string | The IP or hostname and the port of the registry node that generated the event. Generally, this value will be resolved by os.Hostname() along with the running port. |
| instanceID | string | The running instance of an application. Changes after each restart. |

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
