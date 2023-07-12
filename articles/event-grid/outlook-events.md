---
title: Outlook events in Azure Event Grid
description: This article describes Microsoft Outlook events in Azure Event Grid.
ms.topic: conceptual
ms.date: 06/09/2022
---

# Microsoft Outlook events

This article provides the properties and schema for Microsoft Outlook events, which are published by Microsoft Graph API. For an introduction to event schemas, see [CloudEvents schema](cloud-event-schema.md). 

## Available event types
These events are triggered when an Outlook event or an Outlook contact is created, updated or deleted or by operating over those resources using Microsoft Graph API. 

 | Event name | Description |
 | ---------- | ----------- |
 | **Microsoft.Graph.EventCreated** | Triggered when an event in Outlook is created. |
 | **Microsoft.Graph.EventUpdated** | Triggered when an event in Outlook is updated. |
 | **Microsoft.Graph.EventDeleted** | Triggered when an event in Outlook is deleted. |
 | **Microsoft.Graph.ContactCreated** | Triggered when a contact in Outlook is created. |
 | **Microsoft.Graph.ContactUpdated** | Triggered when a contact in Outlook is updated. |
 | **Microsoft.Graph.ContactDeleted** | Triggered when a contact in Outlook is deleted.  |

## Example event
When an event is triggered, the Event Grid service sends data about that event to subscribing destinations. This section contains an example of what that data would look like for each Outlook event.

### Microsoft.Graph.EventCreated event

```json
{
	"id": "00d8a100-2e92-4bfa-86e1-0056dacd0fce",
	"type": "Microsoft.Graph.EventCreated",
	"source": "/tenants/<tenant-id>/applications/<application-id>",
	"subject": "Events/<event-id>",
	"time": "2022-05-24T22:24:31.3062901Z",
	"datacontenttype": "application/json",
	"specversion": "1.0",
	"data": {
		"@odata.type": "#Microsoft.OutlookServices.Notification",
		"Id": null,
		"SubscriptionExpirationDateTime": "2019-02-14T23:56:30.1307708Z",
		"ChangeType": "created",
		"subscriptionId": "MTE1MTVlYTktMjVkZS00MjY3LWI1YzYtMjg0NzliZmRhYWQ2",
		"resource": "https://outlook.office365.com/api/beta/Users('userId@tenantId')/Events('<event id>')",
		"clientState": "<client state>",
		"resourceData": {
			"Id": "<event id>",
			"@odata.etag": "<tag id>",
			"@odata.id": "https://outlook.office365.com/api/beta/Users('userId@tenantId')/Events('<event id>')",
			"@odata.type": "#Microsoft.OutlookServices.Event",
			"OtherResourceData": "<some other resource data>"
		}
	}
}
```

### Microsoft.Graph.EventUpdated event

```json
{
	"id": "00d8a100-2e92-4bfa-86e1-0056dacd0fce",
	"type": "Microsoft.Graph.EventUpdated",
	"source": "/tenants/<tenant-id>/applications/<application-id>",
	"subject": "Events/<event-id>",
	"time": "2022-05-24T22:24:31.3062901Z",
	"datacontenttype": "application/json",
	"specversion": "1.0",
	"data": {
		"@odata.type": "#Microsoft.OutlookServices.Notification",
		"Id": null,
		"SubscriptionExpirationDateTime": "2019-02-14T23:56:30.1307708Z",
		"ChangeType": "updated",
		"subscriptionId": "MTE1MTVlYTktMjVkZS00MjY3LWI1YzYtMjg0NzliZmRhYWQ2",
		"resource": "https://outlook.office365.com/api/beta/Users('userId@tenantId')/Events('<event id>')",
		"clientState": "<client state>",
		"resourceData": {
			"Id": "<event id>",
			"@odata.etag": "<tag id>",
			"@odata.id": "https://outlook.office365.com/api/beta/Users('userId@tenantId')/Events('<event id>')",
			"@odata.type": "#Microsoft.OutlookServices.Event",
			"OtherResourceData": "<some other resource data>"
		}
	}
}
```
### Microsoft.Graph.EventDeleted event

```json
{
	"id": "00d8a100-2e92-4bfa-86e1-0056dacd0fce",
	"type": "Microsoft.Graph.EventDeleted",
	"source": "/tenants/<tenant-id>/applications/<application-id>",
	"subject": "Events/<event-id>",
	"time": "2022-05-24T22:24:31.3062901Z",
	"datacontenttype": "application/json",
	"specversion": "1.0",
	"data": {
		"@odata.type": "#Microsoft.OutlookServices.Notification",
		"Id": null,
		"SubscriptionExpirationDateTime": "2019-02-14T23:56:30.1307708Z",
		"ChangeType": "deleted",
		"subscriptionId": "MTE1MTVlYTktMjVkZS00MjY3LWI1YzYtMjg0NzliZmRhYWQ2",
		"resource": "https://outlook.office365.com/api/beta/Users('userId@tenantId')/Events('<event id>')",
		"clientState": "<client state>",
		"resourceData": {
			"Id": "<event id>",
			"@odata.etag": "<tag id>",
			"@odata.id": "https://outlook.office365.com/api/beta/Users('userId@tenantId')/Events('<event id>')",
			"@odata.type": "#Microsoft.OutlookServices.Event",
			"OtherResourceData": "<some other resource data>"
		}
	}
}
```

### Microsoft.Graph.ContactCreated event

```json
{
	"id": "00d8a100-2e92-4bfa-86e1-0056dacd0fce",
	"type": "Microsoft.Graph.ContactCreated",
	"source": "/tenants/<tenant-id>/applications/<application-id>",
	"subject": "Contacts/<contact-id>",
	"time": "2022-05-24T22:24:31.3062901Z",
	"datacontenttype": "application/json",
	"specversion": "1.0",
	"data": {
		"@odata.type": "#Microsoft.OutlookServices.Notification",
		"Id": null,
		"SubscriptionExpirationDateTime": "2019-02-14T23:56:30.1307708Z",
		"ChangeType": "created",
		"subscriptionId": "MTE1MTVlYTktMjVkZS00MjY3LWI1YzYtMjg0NzliZmRhYWQ2",
		"resource": "https://outlook.office365.com/api/beta/Users('userId@tenantId')/Contacts('<contact id>')",
		"clientState": "<client state>",
		"resourceData": {
			"Id": "<contact id>",
			"@odata.etag": "<tag id>",
			"@odata.id": "https://outlook.office365.com/api/beta/Users('userId@tenantId')/Contacts('<contact id>')",
			"@odata.type": "#Microsoft.OutlookServices.Contact",
			"OtherResourceData": "<some other resource data>"
		}
	}
}
```

### Microsoft.Graph.ContactUpdated event

```json
{
	"id": "00d8a100-2e92-4bfa-86e1-0056dacd0fce",
	"type": "Microsoft.Graph.ContactUpdated",
	"source": "/tenants/<tenant-id>/applications/<application-id>",
	"subject": "Contacts/<contact-id>",
	"time": "2022-05-24T22:24:31.3062901Z",
	"datacontenttype": "application/json",
	"specversion": "1.0",
	"data": {
		"@odata.type": "#Microsoft.OutlookServices.Notification",
		"Id": null,
		"SubscriptionExpirationDateTime": "2019-02-14T23:56:30.1307708Z",
		"ChangeType": "updated",
		"subscriptionId": "MTE1MTVlYTktMjVkZS00MjY3LWI1YzYtMjg0NzliZmRhYWQ2",
		"resource": "https://outlook.office365.com/api/beta/Users('userId@tenantId')/Contacts('<contact id>')",
		"clientState": "<client state>",
		"resourceData": {
			"Id": "<contact id>",
			"@odata.etag": "<tag id>",
			"@odata.id": "https://outlook.office365.com/api/beta/Users('userId@tenantId')/Contacts('<contact id>')",
			"@odata.type": "#Microsoft.OutlookServices.Contact",
			"OtherResourceData": "<some other resource data>"
		}
	}
}
```
### Microsoft.Graph.ContactDeleted event

```json
{
	"id": "00d8a100-2e92-4bfa-86e1-0056dacd0fce",
	"type": "Microsoft.Graph.ContactDeleted",
	"source": "/tenants/<tenant-id>/applications/<application-id>",
	"subject": "Contacts/<contact-id>",
	"time": "2022-05-24T22:24:31.3062901Z",
	"datacontenttype": "application/json",
	"specversion": "1.0",
	"data": {
		"@odata.type": "#Microsoft.OutlookServices.Notification",
		"Id": null,
		"SubscriptionExpirationDateTime": "2019-02-14T23:56:30.1307708Z",
		"ChangeType": "deleted",
		"subscriptionId": "MTE1MTVlYTktMjVkZS00MjY3LWI1YzYtMjg0NzliZmRhYWQ2",
		"resource": "https://outlook.office365.com/api/beta/Users('userId@tenantId')/Contacts('<contact id>')",
		"clientState": "<client state>",
		"resourceData": {
			"Id": "<contact id>",
			"@odata.etag": "<tag id>",
			"@odata.id": "https://outlook.office365.com/api/beta/Users('userId@tenantId')/Contacts('<contact id>')",
			"@odata.type": "#Microsoft.OutlookServices.Contact",
			"OtherResourceData": "<some other resource data>"
		}
	}
}
```

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
| `tenantId` | string | The organization ID where the user or contact is kept. |
| `clientState` | string | A secret provided by the user at the time of the Graph API subscription creation. |
| `@odata.type` | string | The Graph API change type.   |
| `@odata.id` | string | The Graph API resource identifier for which the event was raised. |
| `id` | string | The resource identifier for which the event was raised. |
| `organizationId` | string | The Outlook tenant identifier.  |
| `eventTime` | string | The time at which the resource state occurred. |
| `sequenceNumber` | string | A sequence number. |
| `subscriptionExpirationDateTime` | string | The time in [RFC 3339](https://tools.ietf.org/html/rfc3339) format at which the Graph API subscription expires.  |
| `subscriptionId` | string | The Graph API subscription identifier. |
| `tenantId` | string | The Outlook tenant identifier.  |
| `otherResourceData` | string | Placeholder that represents one or more dynamic properties that may be included in the event. |


## Next steps

* For an introduction to Azure Event Grid's Partner Events, see [Partner Events overview](partner-events-overview.md)
* For information on how to subscribe to Microsoft Graph API to receive Outlook events, see [subscribe to Azure Graph API events](subscribe-to-graph-api-events.md).
* For information about Azure Event Grid event handlers, see [event handlers](event-handlers.md).
* For more information about creating an Azure Event Grid subscription, see [create event subscription](subscribe-through-portal.md#create-event-subscriptions) and [Event Grid subscription schema](subscription-creation-schema.md).
* For information about how to configure an event subscription to select specific events to be delivered, consult [event filtering](event-filtering.md). You may also want to refer to [filter events](how-to-filter-events.md).
