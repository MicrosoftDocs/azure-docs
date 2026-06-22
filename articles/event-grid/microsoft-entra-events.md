---
title: Microsoft Entra Event Schema
description: Discover the Microsoft Entra event types that Azure Event Grid supports, with schema details and sample event payloads for each event.
ms.topic: concept-article
ms.date: 06/16/2026
# Customer intent: I want to know what Microsoft Entra events are supported by Azure Event Grid.
---

# Microsoft Entra event types and schema in Azure Event Grid

This article provides the properties and schema for Microsoft Entra events that Microsoft Graph API publishes. For an introduction to event schemas, see [CloudEvents schema](cloud-event-schema.md).

## Available Microsoft Entra event types

Microsoft Graph API publishes the following Microsoft Entra events to Azure Event Grid. These events trigger when a [User](/graph/api/resources/user) or [Group](/graph/api/resources/group) is created, updated, or deleted in Microsoft Entra ID, or when those resources are modified through Microsoft Graph API.

> [!NOTE]
> Currently, a known issue causes a `UserUpdated` or `GroupUpdated` event to be generated when a user or a group is created.

| Event name | Description |
| ---------- | ----------- |
| `Microsoft.Graph.UserUpdated` | Triggered when a user in Microsoft Entra ID is **created** or **updated**. |
| `Microsoft.Graph.UserDeleted` | Triggered when a user in Microsoft Entra ID is **permanently deleted**. |
| `Microsoft.Graph.GroupUpdated` | Triggered when a group in Microsoft Entra ID is **created** or **updated**. |
| `Microsoft.Graph.GroupDeleted` | Triggered when a group in Microsoft Entra ID is **permanently deleted**. |

> [!NOTE]
> By default, deleting a user or a group is a soft delete operation. The user or group is marked as deleted but the user or group object still exists. Microsoft Graph API sends a `UserUpdated` or `GroupUpdated` event when a user or group is soft deleted. To permanently delete a user, go to the **Delete users** page in the Azure portal and select **Delete permanently**. Steps to permanently delete a group are similar.

## Microsoft Entra event examples

When a Microsoft Entra event triggers, Azure Event Grid sends data about that event to subscribing destinations. The following sections show example JSON payloads for each event type.

### Microsoft.Graph.UserUpdated event

```json
{
  "id": "0000aaaa-11bb-cccc-dd22-eeeeee333333",
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
      "sequenceNumber": "<sequence-number>"
    },
    "subscriptionExpirationDateTime": "2022-05-24T23:21:19.3554403+00:00",
    "subscriptionId": "<microsoft-graph-subscription-id>",
    "tenantId": "<tenant-id>"
  }
}
```

### Microsoft.Graph.UserDeleted event

```json
{
  "id": "1111bbbb-22cc-dddd-ee33-ffffff444444",
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
      "sequenceNumber": "<sequence-number>"
    },
    "subscriptionExpirationDateTime": "2022-05-24T23:21:19.3554403+00:00",
    "subscriptionId": "<microsoft-graph-subscription-id>",
    "tenantId": "<tenant-id>"
  }
}
```

### Microsoft.Graph.GroupUpdated event

```json
{
  "id": "2222cccc-33dd-eeee-ff44-aaaaaa555555",
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
      "sequenceNumber": "<sequence-number>"
    },
    "subscriptionExpirationDateTime": "2022-05-24T23:21:19.3554403+00:00",
    "subscriptionId": "<microsoft-graph-subscription-id>",
    "tenantId": "<tenant-id>"
  }
}
```

### Microsoft.Graph.GroupDeleted event

```json
{
  "id": "3333dddd-44ee-ffff-aa55-bbbbbbbb6666",
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
      "sequenceNumber": "<sequence-number>"
    },
    "subscriptionExpirationDateTime": "2022-05-24T23:21:19.3554403+00:00",
    "subscriptionId": "<microsoft-graph-subscription-id>",
    "tenantId": "<tenant-id>"
  }
}
```

## Microsoft Entra event properties

A Microsoft Entra event has the following top-level properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `source` | string | The tenant event source. This field isn't writable. Microsoft Graph API provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
| `type` | string | One of the event types for this event source. |
| `time` | string | The time the event is generated, based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | Event payload that provides the data about the resource state change. |
| `specversion` | string | CloudEvents schema specification version. |

### Data object properties

The `data` object in a Microsoft Entra event has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `changeType` | string | The type of resource state change, such as `created`, `updated`, or `deleted`. |
| `resource` | string | The resource identifier for which the event was raised. |
| `clientState` | string | A secret that you provide when creating the Microsoft Graph API subscription. |
| `@odata.type` | string | The Microsoft Graph API change type. |
| `@odata.id` | string | The Microsoft Graph API resource identifier for which the event was raised. |
| `id` | string | The resource identifier for which the event was raised. |
| `organizationId` | string | The Microsoft Entra tenant identifier. |
| `eventTime` | string | The time when the resource state changed. |
| `sequenceNumber` | string | A sequence number. |
| `subscriptionExpirationDateTime` | string | The time, in [Request for Comments (RFC) 3339](https://tools.ietf.org/html/rfc3339) format, when the Microsoft Graph API subscription expires. |
| `subscriptionId` | string | The Microsoft Graph API subscription identifier. |
| `tenantId` | string | The Microsoft Entra tenant identifier. |

## Related content

* For an introduction to Azure Event Grid's partner events, see [Partner Events overview](partner-events-overview.md).
* For information on how to subscribe to Microsoft Graph API to receive Microsoft Entra events, see [Subscribe to Microsoft Graph API events](subscribe-to-graph-api-events.md).
* For more information about creating an Azure Event Grid subscription, see [Create event subscription](subscribe-through-portal.md#create-event-subscriptions) and [Event Grid subscription schema](subscription-creation-schema.md).
