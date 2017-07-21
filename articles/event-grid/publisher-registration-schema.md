---
title: Azure Event Grid published schema
description: Describes the properties for registering an Event Grid publisher.
services: event-grid
author: banisadr
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 07/07/2017
ms.author: babanisa
---

# Event Grid publisher schema

The Event Grid publisher registration schema enables a publisher to define the events that it publishes. You can consume these events through an event subscription. Event sources are grouped by resource provider.

Publishers may register more than one resource provider in the same registration by using an array.
 
## Publisher registration properties

Each resource provider defines a name, display name, and list of topic types. The resource provider defines a list of event types under each topic type. 

| Property | Type | Description |
| -------- | ---- | ----------- |
| name | string | Resource provider name for system event publishers (such as Microsoft.Storage). |
| displayName | string | Informal display name for a resource provider. |
| topicTypes | array | Collection of resource types and the events for each type.  |

### topicType object

| Property | Type | Description |
| -------- | ---- | ----------- |
| topicType | string | Top-level resource type in the resource provider that is the event source (such as storageAccounts). |
| eventTypes | array | Collection of events published by the event source. |

### eventType object 

| Property | Type | Description |
| -------- | ---- | ----------- |
| name | string | Name of the event. | 
| description | string | A description of the condition when the event is raised. | 
| subjectType | string | Publisher defined type name relative to the event source topic type. For example, **blobServices** for events on the properties of the storage account blob service. Or, **blobServices/containers/blobs** for events on the blob. Use an empty string for events on the topic type. |
| eventSchema | string | schema URL |


## Example registration

```json
{
  "publishers": [
    {
      "name": "Microsoft.Storage", 
      "displayName": "Microsoft Azure Storage",
      "topicTypes": [
        {
          "topicType": "storageAccounts", 
          "eventTypes": [
            {
              "name": "blobCreated",
              "description": "Raised when a new blob is created via PutBlob or PutBlockList operations.",
              "subjectType": "blobServices/containers/blobs", 
              "eventSchema": "..." 
            },
            {
              "name": "blobDeleted",
              "description": "Raised when a new blob is deleted via DeleteBlob",
              "subjectType": "blobServices/containers/blobs",
              "eventSchema": "..."
            },
            {
              "name": "containerCreated",
              "description": "Raised when a new blob container is created via the Create Container operation.",
              "subjectType": "blobServices/containers",
              "eventSchema": "..."
            },
            {
              "name": "containerDeleted",
              "description": "Raised when a new blob is deleted via the Delete Container operation",
              "subjectType": "blobServices/containers",
              "eventSchema": "..."
            },
            {
              "name": "servicePropertiesUpdated",
              "description": "Raised when the properties of the blob service in a storage account are modified.",
              "subjectType": "blobServices",
              "eventSchema": "..."
            },
            {
              "name": "storageAccountCreated",
              "description": "Raised when a storage account is created.",
              "subjectType": "",
              "eventSchema": "..."
            },
            {
              "name": "storageAccountDeleted",
              "description": "Raised when a storage account is deleted.",
              "subjectType": "",
              "eventSchema": "..."
            },
            {
              "name": "storageAccountUpdated",
              "description": "Raised when the properties of the storage account are modified.",
              "subjectType": "",
              "eventSchema": "..."
            }
          ]
        }
      ]
    }
  ]
}
```