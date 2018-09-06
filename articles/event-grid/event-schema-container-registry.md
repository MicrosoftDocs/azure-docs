---
title: Azure Event Grid Container Registry event schema
description: Describes the properties that are provided for Container Reigstry events with Azure Event Grid
services: event-grid
author: tfitzmac
manager: timlt

ms.service: event-grid
ms.topic: reference
ms.date: 08/13/2018
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
  "id": "831e1650-001e-001b-66ab-eeb76e069631",
  "topic": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ContainerRegistry/registries/<name>",
  "subject": "aci-helloworld:v1",
  "eventType": "ImagePushed",
  "eventTime": "2018-04-25T21:39:47.6549614Z",
  "data": {
    "id": "31c51664-e5bd-416a-a5df-e5206bc47ed0",
    "timestamp": "2018-04-25T21:39:47.276585742Z",
    "action": "push",
    "target": {
      "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
      "size": 3023,
      "digest": "sha256:213bbc182920ab41e18edc2001e06abcca6735d87782d9cef68abd83941cf0e5",
      "length": 3023,
      "repository": "aci-helloworld",
      "tag": "v1"
    },
    "request": {
      "id": "7c66f28b-de19-40a4-821c-6f5f6c0003a4",
      "host": "demo.azurecr.io",
      "method": "PUT",
      "useragent": "docker/18.03.0-ce go/go1.9.4 git-commit/0520e24 os/windows arch/amd64 UpstreamClient(Docker-Client/18.03.0-ce \\\\(windows\\\\))"
    }
  },
  "dataVersion": "1.0",
  "metadataVersion": "1"
}]
```

The schema for an image deleted event is similar:

```json
[{
  "id": "f06e3921-301f-42ec-b368-212f7d5354bd",
  "topic": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ContainerRegistry/registries/<name>",
  "subject": "aci-helloworld",
  "eventType": "ImageDeleted",
  "eventTime": "2018-04-26T17:56:01.8211268Z",
  "data": {
    "id": "f06e3921-301f-42ec-b368-212f7d5354bd",
    "timestamp": "2018-04-26T17:56:00.996603117Z",
    "action": "delete",
    "target": {
      "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
      "digest": "sha256:213bbc182920ab41e18edc2001e06abcca6735d87782d9cef68abd83941cf0e5",
      "repository": "aci-helloworld"
    },
    "request": {
      "id": "aeda5b99-4197-409f-b8a8-ff539edb7de2",
      "host": "demo.azurecr.io",
      "method": "DELETE",
      "useragent": "python-requests/2.18.4"
    }
  },
  "dataVersion": "1.0",
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

The target object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| mediaType | string | The MIME type of the referenced object. |
| size | integer | The number of bytes of the content. Same as Length field. |
| digest | string | The digest of the content, as defined by the Registry V2 HTTP API Specification. |
| length | integer | The number of bytes of the content. Same as Size field. |
| repository | string | The repository name. |
| tag | string | The tag name. |

The request object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| id | string | The ID of the request that initiated the event. |
| addr | string | The IP or hostname and possibly port of the client connection that initiated the event. This value is the RemoteAddr from the standard http request. |
| host | string | The externally accessible hostname of the registry instance, as specified by the http host header on incoming requests. |
| method | string | The request method that generated the event. |
| useragent | string | The user agent header of the request. |

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
