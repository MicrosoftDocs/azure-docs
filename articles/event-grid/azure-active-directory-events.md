---
title: Azure Active Directory events
description: This article describes Azure AD event types and provides event samples.
ms.topic: conceptual
ms.date: 09/19/2023
---

# Azure Active Directory events

This article provides the properties and schema for Azure Active Directory (Azure AD) events, which are published by Microsoft Graph API. For an introduction to event schemas, see [CloudEvents schema](cloud-event-schema.md). 

## Available event types
These events are triggered when a [User](/graph/api/resources/user) or [Group](/graph/api/resources/group) is created, updated, or deleted in Azure AD or by operating over those resources using Microsoft Graph API. 

 | Event name | Description |
 | ---------- | ----------- |
 | **Microsoft.Graph.UserUpdated** | Triggered when a user in Azure AD is created or updated. |
 | **Microsoft.Graph.UserDeleted** | Triggered when a user in Azure AD is permanently deleted. |
 | **Microsoft.Graph.GroupUpdated** | Triggered when a group in Azure AD is created or updated. |
 | **Microsoft.Graph.GroupDeleted** | Triggered when a group in Azure AD is permanently deleted.  |

> [!NOTE]
> By default, deleting a user or a group is only a soft delete operation, which means that the user or group is marked as deleted but the user or group object still exists. Microsoft Graph sends an updated event when users are soft deleted. To permanently delete a user, navigate to the **Delete users** page in the Azure portal and select **Delete permanently**. Steps to permanently delete a group are similar.  

## Example event
When an event is triggered, the Event Grid service sends data about that event to subscribing destinations. This section contains an example of what that data would look like for each Azure AD event.

### Microsoft.Graph.UserUpdated event

```json
{
  "id": "00d8a100-2e92-4bfa-86e1-0056dacd0fce",
  "type": "Microsoft.Graph.UserUpdated",
  "source": "/tenants/<tenant-id>/applications/<application-id>",
  "subject": "Users/<user-id>",
  "time": "2022-05-24T22:24:31.3062901Z",
  "datacontenttype": "application/json",
  "specversion": "1.0",
  "data": {
    "changeType": "updated",
    "clientState": "<guid>",
    "resource": "Users/<user-id>",
    "resourceData": {
      "@odata.type": "#Microsoft.Graph.User",
      "@odata.id": "Users/<user-id>",
      "id": "<user-id>",
      "organizationId": "<tenant-id>",
      "eventTime": "2022-05-24T22:24:31.3062901Z",
      "sequenceNumber": <sequence-number>
    },
    "subscriptionExpirationDateTime": "2022-05-24T23:21:19.3554403+00:00",
    "subscriptionId": "<microsoft-graph-subscription-id>",
    "tenantId": "<tenant-id>
  }
}
```
### Microsoft.Graph.UserDeleted event

```json
{
  "id": "00d8a100-2e92-4bfa-86e1-0056dacd0fce",
  "type": "Microsoft.Graph.UserDeleted",
  "source": "/tenants/<tenant-id>/applications/<application-id>",
  "subject": "Users/<user-id>",
  "time": "2022-05-24T22:24:31.3062901Z",
  "datacontenttype": "application/json",
  "specversion": "1.0",
  "data": {
    "changeType": "deleted",
    "clientState": "<guid>",
    "resource": "Users/<user-id>",
    "resourceData": {
      "@odata.type": "#Microsoft.Graph.User",
      "@odata.id": "Users/<user-id>",
      "id": "<user-id>",
      "organizationId": "<tenant-id>",
      "eventTime": "2022-05-24T22:24:31.3062901Z",
      "sequenceNumber": <sequence-number>
    },
    "subscriptionExpirationDateTime": "2022-05-24T23:21:19.3554403+00:00",
    "subscriptionId": "<microsoft-graph-subscription-id>",
    "tenantId": "<tenant-id>
  }
}
```

### Microsoft.Graph.GroupUpdated event

```json
{
  "id": "00d8a100-2e92-4bfa-86e1-0056dacd0fce",
  "type": "Microsoft.Graph.GroupUpdated",
  "source": "/tenants/<tenant-id>/applications/<application-id>",
  "subject": "Groups/<group-id>",
  "time": "2022-05-24T22:24:31.3062901Z",
  "datacontenttype": "application/json",
  "specversion": "1.0",
  "data": {
    "changeType": "updated",
    "clientState": "<guid>",
    "resource": "Groups/<group-id>",
    "resourceData": {
      "@odata.type": "#Microsoft.Graph.Group",
      "@odata.id": "Groups/<group-id>",
      "id": "<group-id>",
      "organizationId": "<tenant-id>",
      "eventTime": "2022-05-24T22:24:31.3062901Z",
      "sequenceNumber": <sequence-number>
    },
    "subscriptionExpirationDateTime": "2022-05-24T23:21:19.3554403+00:00",
    "subscriptionId": "<microsoft-graph-subscription-id>",
    "tenantId": "<tenant-id>
  }
}
```

### Microsoft.Graph.GroupDeleted event

```json
{
  "id": "00d8a100-2e92-4bfa-86e1-0056dacd0fce",
  "type": "Microsoft.Graph.GroupDeleted",
  "source": "/tenants/<tenant-id>/applications/<application-id>",
  "subject": "Groups/<group-id>",
  "time": "2022-05-24T22:24:31.3062901Z",
  "datacontenttype": "application/json",
  "specversion": "1.0",
  "data": {
    "changeType": "deleted",
    "clientState": "<guid>",
    "resource": "Groups/<group-id>",
    "resourceData": {
      "@odata.type": "#Microsoft.Graph.Group",
      "@odata.id": "Groups/<group-id>",
      "id": "<group-id>",
      "organizationId": "<tenant-id>",
      "eventTime": "2022-05-24T22:24:31.3062901Z",
      "sequenceNumber": <sequence-number>
    },
    "subscriptionExpirationDateTime": "2022-05-24T23:21:19.3554403+00:00",
    "subscriptionId": "<microsoft-graph-subscription-id>",
    "tenantId": "<tenant-id>
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
| `tenantId` | string | The organization ID where the user or group is kept. |
| `clientState` | string | A secret provided by the user at the time of the Graph API subscription creation. |
| `@odata.type` | string | The Graph API change type.   |
| `@odata.id` | string | The Graph API resource identifier for which the event was raised. |
| `id` | string | The resource identifier for which the event was raised. |
| `organizationId` | string | The Azure AD tenant identifier.  |
| `eventTime` | string | The time when the resource state changed. |
| `sequenceNumber` | string | A sequence number. |
| `subscriptionExpirationDateTime` | string | The time in [RFC 3339](https://tools.ietf.org/html/rfc3339) format at which the Graph API subscription expires.  |
| `subscriptionId` | string | The Graph API subscription identifier. |
| `tenantId` | string | The Azure AD tenant identifier.  |


## Next steps

* For an introduction to Azure Event Grid's Partner Events, see [Partner Events overview](partner-events-overview.md)
* For information on how to subscribe to Microsoft Graph API to receive Azure AD events, see [subscribe to Azure Graph API events](subscribe-to-graph-api-events.md).
* For information about Azure Event Grid event handlers, see [event handlers](event-handlers.md).
* For more information about creating an Azure Event Grid subscription, see [create event subscription](subscribe-through-portal.md#create-event-subscriptions) and [Event Grid subscription schema](subscription-creation-schema.md).
* For information about how to configure an event subscription to select specific events to be delivered, see [event filtering](event-filtering.md). You may also want to refer to [filter events](how-to-filter-events.md).
