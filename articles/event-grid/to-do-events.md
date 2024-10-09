---
title: Microsoft ToDo events
description: This article describes Microsoft ToDo event types and provides event samples.
ms.topic: conceptual
ms.date: 12/6/2023
---

# Microsoft ToDo events

This article provides the properties and schema for Microsoft ToDo Task events, which are published by Microsoft Graph API. For an introduction to event schemas, see [CloudEvents schema](cloud-event-schema.md). 

## Available event types
These events are triggered when a [todoTask](/graph/api/resources/todotask) is created, updated, or deleted by operating over those resources using Microsoft Graph API. Note that you can only subscribe to changes from a specific task list.

 | Event name | Description |
 | ---------- | ----------- |
 | **Microsoft.Graph.ToDoCreated** | Triggered when a todoTask in Microsoft ToDo task list is created.|
 | **Microsoft.Graph.ToDoUpdated** | Triggered when a todoTask in Microsoft ToDo task list is updated.|
 | **Microsoft.Graph.ToDoDeleted** | Triggered when a todoTask in Microsoft ToDo task list is deleted.|

## Example event
When an event is triggered, the Event Grid service sends data about that event to subscribing destinations. This section contains an example of what that data would look like for each Microsoft Security Alert event.

### Microsoft.Graph.ToDoCreated event

```json
{
  "id": "00d8a100-2e92-4bfa-86e1-0056dacd0fce",
  "type": "Microsoft.Graph.ToDoCreated",
  "source": "/tenants/<tenant-id>/applications/<application-id>",
  "subject": "TodoTask/<ToDoTask-id>",
  "time": "2022-05-24T22:24:31.3062901Z",
  "datacontenttype": "application/json",
  "specversion": "1.0",
  "data": {
    "expirationDateTime": "2023-10-01T06:21:57-07:00",
    "changeType": "Created",
    "subscriptionId": "<guid>",
    "resource": "todob2/graph/v1/users(<user-id>)/tasks",
    "clientState": "<user-provided secret>",
    "resourceData": {
      "id": "<ToDoTask-id>",
      "@odata.type": "#microsoft.graph.todoTask"
    }
  }
}
```

### Microsoft.Graph.ToDoUpdated event

```json
{
  "id": "00d8a100-2e92-4bfa-86e1-0056dacd0fce",
  "type": "Microsoft.Graph.ToDoUpdated",
  "source": "/tenants/<tenant-id>/applications/<application-id>",
  "subject": "TodoTask/<ToDoTask-id>",
  "time": "2022-05-24T22:24:31.3062901Z",
  "datacontenttype": "application/json",
  "specversion": "1.0",
  "data": {
    "expirationDateTime": "2023-10-01T06:21:57-07:00",
    "changeType": "Updated",
    "subscriptionId": "<guid>",
    "resource": "todob2/graph/v1/users(<user-id>)/tasks",
    "clientState": "<user-provided secret>",
    "resourceData": {
      "id": "<ToDoTask-id>",
      "@odata.type": "#microsoft.graph.todoTask"
    }
  }
}
```

### Microsoft.Graph.ToDoDeleted event

```json
{
  "id": "00d8a100-2e92-4bfa-86e1-0056dacd0fce",
  "type": "Microsoft.Graph.ToDoDeleted",
  "source": "/tenants/<tenant-id>/applications/<application-id>",
  "subject": "TodoTask/<ToDoTask-id>",
  "time": "2022-05-24T22:24:31.3062901Z",
  "datacontenttype": "application/json",
  "specversion": "1.0",
  "data": {
    "expirationDateTime": "2023-10-01T06:21:57-07:00",
    "changeType": "Deleted",
    "subscriptionId": "<guid>",
    "resource": "todob2/graph/v1/users(<user-id>)/tasks",
    "clientState": "<user-provided secret>",
    "resourceData": {
     "id": "<ToDoTask-id>",
     "@odata.type": "#microsoft.graph.todoTask"
    }
  }
}
```
---

## Event properties

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `source` | string | The tenant event source. This field isn't writeable. Microsoft Graph API provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
| `type` | string | One of the event types for this event source. |
| `time` | string | The time the event is generated based on the provider's UTC time |
| `id` | string | Unique identifier for the event. |
| `data` | object | Event payload that provides the data about the resource state change. |
| `specversion` | string | CloudEvents schema specification version. |

---

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `changeType` | string | The type of resource state change. |
| `resource` | string | The resource identifier for which the event was raised. |
| `tenantId` | string | The organization ID where the alert was raised. |
| `clientState` | string | A secret provided by the user at the time of the Graph API subscription creation. |
| `@odata.type` | string | The Graph API change type.   |
| `@odata.id` | string | The Graph API resource identifier for which the event was raised. |
| `id` | string | The resource identifier for which the event was raised. |
| `subscriptionExpirationDateTime` | string | The time in [RFC 3339](https://tools.ietf.org/html/rfc3339) format at which the Graph API subscription expires.  |
| `subscriptionId` | string | The Graph API subscription identifier. |
| `tenantId` | string | The Microsoft Entra tenant identifier.  |


## Next steps

* For an introduction to Azure Event Grid's Partner Events, see [Partner Events overview](partner-events-overview.md)
* For information on how to subscribe to Microsoft Graph API to receive events, see [subscribe to Microsoft Graph API events](subscribe-to-graph-api-events.md).
* For information about Azure Event Grid event handlers, see [event handlers](event-handlers.md).
* For more information about creating an Azure Event Grid subscription, see [create event subscription](subscribe-through-portal.md#create-event-subscriptions) and [Event Grid subscription schema](subscription-creation-schema.md).
* For information about how to configure an event subscription to select specific events to be delivered, see [event filtering](event-filtering.md). You might also want to refer to [filter events](how-to-filter-events.md).