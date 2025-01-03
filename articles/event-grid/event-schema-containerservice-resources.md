---
title: Azure Resource Notifications - ContainerService events in Azure Event Grid
description: This article provides information on Azure Event Grid events supported by Azure Resource Notifications ContainerService events. It provides the schema and links to how-to articles. 
ms.topic: conceptual
ms.date: 11/14/2024
---

# Azure Resource Notifications - ContainerService events in Azure Event Grid (Preview)

The Azure Kubernetes Service (AKS) uses the Container Service Event Resources system topic to deliver preemptive notifications for scheduled maintenance activities on AKS clusters. This functionality enables the reception of push notifications for essential maintenance tasks across different event stages, including scheduled, initiated, completed, canceled, and failed. Notably, for scheduled stage, notifications are dispatched 7 days and 24 hours before the actual maintenance activity.


Notifications encompass:
- Maintenance initiated by AKS (for instance, Underlay migration, Konnectivity Tunnel Switch)
- Maintenance initiated by customers (such as Auto upgrade, Node OS upgrade, and weekly release windows)

These forward-looking notifications assist customers by offering the opportunity to better prepare for potential disruptions, ultimately aiming to minimize operational expenses.



This article provides the properties and the schema for Azure Resource Notifications ContainerService events. For an introduction to event schemas in general, see [Azure Event Grid event schema](event-schema.md). In addition, you can find samples of generated events and a link to a related article on how to create system topic for this topic type. 

## Event types
ContainerService  offers the following event type for consumption:

| Event type | Description |
| ---------- | ----------- |
| `Microsoft.ResourceNotifications.ContainerServiceEventResources.ScheduledEventEmitted` | provides advance notifications for scheduled maintenance events on AKS clusters. 

## Role-based access control
Currently, these events are exclusively emitted at the Azure subscription scope. It implies that the entity creating the event subscription for this topic type receives notifications throughout this Azure subscription. For security reasons, it's imperative to restrict the ability to create event subscriptions on this topic to principals with read access over the entire Azure subscription. To access data via this system topic, in addition to the generic permissions required by Event Grid, the following Azure Resource Notifications specific permission is necessary: ``.

Microsoft.ResourceNotifications/systemTopics/subscribeToContainerServiceEventResources/action


## Event schemas


# [Cloud event schema](#tab/cloud-event-schema)

Here's the schema:

```json
{
	"id": "string",
	"source": "string",
	"subject": "string",
	"type": "Microsoft.ResourceNotifications.ContainerServiceEventResources.ScheduledEventEmitted",
	"time ": "string in date-time",
	"data": {
		"resourceInfo": {
			"id": "string",
			"name": "string",
			"type": "string",
			"location": "string",
			"properties": {
				"description": "string",
				"eventId": "string",
				"eventSource": "string",
				"eventStatus": "string",
				"eventDetails": "string",
				"scheduledTime": "string in date-time",
				"startTime": "string in date-time",
				"lastUpdateTime": "string in date-time",
				"resources": "array of strings",
				"resourceType": "string"
			}
		},
		"operationalInfo": {
			"resourceEventTime": "string in date-time"
		},
		"apiVersion": "string"
	},
	"specversion": "string"
}
```

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- | 
| `id` | String | Unique identifier of the event |
| `source` | String | The Azure subscription for which this system topic is being created. |
| `subject` | String | Publisher defined path to the base resource on which this event is emitted. |
| `type` | String | Registered event type of this system topic type |
| `time` | String <br/> Format: `2022-11-07T18:43:09.2894075Z` | The time the event is generated based on the provider's UTC time |
| `data` | Object | Contains event data specific to the resource provider. For more information, see the next table. |
| `specversion` | String | CloudEvents schema specification version. |

# [Event Grid event schema](#tab/event-grid-event-schema)

Here's the schema:

```json
{
    "id": "string",
    "topic": "string",
    "subject": "string",
    "data": {
        "resourceInfo": {
            "id": "string",
            "name": "string",
            "type": "string",
            "location": "string",
            "properties": {
               "description": "string",
				"eventId": "string",
				"eventSource": "string",
				"eventStatus": "string",
				"eventDetails": "string",
				"scheduledTime": "string in date-time",
				"startTime": "string in date-time",
				"lastUpdateTime": "string in date-time",
				"resources": "array of strings",
				"resourceType": "string"
            }
        },
        "apiVersion": "string",
        "operationalInfo": {
            "resourceEventTime": "string in datetime"
        }
    },
    "eventType": "Microsoft.ResourceNotifications.ContainerServiceEventResources.ScheduledEventEmitted",
    "dataVersion": "string",
    "metadataVersion": "string",
    "eventTime": "string in date-time"
}
```

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- | 
| `id` | String | Unique identifier of the event |
| `topic` | String | The Azure subscription for which this system topic is being created |
| `subject` | String | Publisher defined path to the base resource on which this event is emitted. |
| `data` | Object | Contains event data specific to the resource provider. For more information, see the next table. |
| `eventType` | String | Registered event type of this system topic type |
| `dataVersion` | String | The schema version of the data object |
| `metadataVersion` | String | The schema version of the event metadata |
| `eventTime` | String <br/> Format: `2022-11-07T18:43:09.2894075Z` | The time the event is generated based on the provider's UTC time |


---

The `data` object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `resourceInfo` | Object | Data specific to the resource. For more information, see the next table. |
| `apiVersion` | String | API version of the resource properties. |
| `operationalInfo` | Object | Details of operational information pertaining to the resource. | 

The `resourceInfo` object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- | 
| `id` | String | Publisher defined path to the event subject |
| `name` | String | This field indicates the event ID. It always takes the value of the last section of the `id` field. |
| `type` | String | The type of event that is being emitted.|
| `location` | String | Location or region where the resource is located. |
| `properties` | Object | Payload of the resource. For more information, see the next table. |


The `operationalInfo` object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- | 
| `resourceEventTime` | DateTime | Date and time when the resource was updated. |

The `ScheduledEventEmitted` event has the following properties: 

| Property | Type | Description |
| -------- | ---- | ----------- | 
| `description` | String | The description of the event. |
| `eventId` | String | The event ID of the event. |
| `eventSource` | String | The source of the event. |
| `eventStatus` | Enum (String) | Status of the event which can be – Scheduled, Started, Completed, Canceled, Failed. |
| `eventDetails` | String | The details of the event. |
| `scheduledTime`| String (date-time format) | The time of the event is scheduled to start.|
|`lastUpdateTime`| String (date-time format)| The last time the state of the event was updated.|
|`resources`| Array of Strings (Azure Resource Manager ID format)| The list of resources impacted by the event.|
|`resourceType`| String | The resource type of the event


## Example events

# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of a key-value modified event: 

```json
{
	"id": "5bdb52cf-5489-4845-86c8-7fe94a4fc6c1",
	"source": "/subscriptions/{subscription-id}",
	"subject": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerService/managedClusters/{managedcluster-name}/scheduledEvents/{event-id}",
	"data": {
		"resourceInfo": {
			"id": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerService/managedClusters/{managedcluster-name}/scheduledEvents/{event-id}",
			"name": "{event-id}",
			"type": "Microsoft.ContainerService/managedClusters/scheduledEvents",
			"properties": {
				"description": "ScheduledEvents",
				"eventId": "bbe82027-0444-4f73-897a-0bbfe3af66f1",
				"eventSource": "AutoUprader",
				"eventStatus": "Started",
				"eventDetails": "Start to upgrade security vhd",
				"scheduledTime": "2024-04-16T22:17:12.103268606Z",
				"startTime": "0001-01-01T00:00:00.0000000Z",
				"lastUpdateTime": "0001-01-01T00:00:00.0000000Z",
				"resources": [
				  "/subscriptions/{subscription-id}/resourcegroups/{rg-name}/providers/Microsoft.ContainerService/managedClusters/{managedcluster-name}"
				],
				"resourceType": "ManagedCluster"
			}
		},
		"operationalInfo": {
			"resourceEventTime": "2024-04-16T22:17:12.1032748"
		},
		"apiVersion": "2023-11-02-preview"
	},
	"type": "Microsoft.ResourceNotifications.ContainerServiceEventResources.ScheduledEventEmitted",
	"specversion": "1.0",
	"time": "2024-04-16T22:17:12.1032748Z"
}
```

# [Event Grid event schema](#tab/event-grid-event-schema)

```json
{
  "id": "5bdb52cf-5489-4845-86c8-7fe94a4fc6c1",
  "topic": "/subscriptions/{subscription-id}",
  "subject": "/subscriptions/{subscription-id}/resourcegroups/{rg-name}/providers/Microsoft.ContainerService/managedClusters/{managedcluster-name}/scheduledEvents/{event-id}",
  "data": {
    "resourceInfo": {
      "id": "/subscriptions/{subscription-id}/resourcegroups/{rg-name}/providers/Microsoft.ContainerService/managedClusters/{managedcluster-name}/{event-id}",
      "name": "{event-id}",
      "type": "Microsoft.ContainerService/managedClusters/scheduledEvents",
      "location": "westus2",
      "properties": {
        "description": "ScheduledEvents",
        "eventId": "bbe82027-0444-4f73-897a-0bbfe3af66f1",
        "eventSource": "AutoUprader",
        "eventStatus": "Started",
        "eventDetails": "Start to upgrade security vhd",
        "scheduledTime": "2024-04-16T22:17:12.103268606Z",
        "startTime": "0001-01-01T00:00:00.0000000Z",
        "lastUpdateTime": "0001-01-01T00:00:00.0000000Z",
        "resources": [
          "/subscriptions/{subscription-id}/resourcegroups/{rg-name}/providers/Microsoft.ContainerService/managedClusters/{managedcluster-name}"
        ],
        "resourceType": "ManagedCluster"
      }
    },
    "operationalInfo": {
      "resourceEventTime": "2024-04-16T22:17:12.1032748"
    },
    "apiVersion": "2023-11-02-preview"
  },
  "eventType": "Microsoft.ResourceNotifications.ContainerServiceEventResources.ScheduledEventEmitted",
  "dataVersion": "1",
  "metadataVersion": "1",
  "eventTime": "2024-04-16T22:17:12.1032748Z"
}
```

---

[!INCLUDE [contact-resource-notifications](./includes/contact-resource-notifications.md)]

## Next steps
See [Subscribe to Azure Resource Notifications - Container Service events](subscribe-to-resource-notifications-containerservice-events.md).
