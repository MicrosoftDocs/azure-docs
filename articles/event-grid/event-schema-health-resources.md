---
title: Azure Resource Notifications - health resources events in Azure Event Grid
description: This article provides information on Azure Event Grid events supported by Azure Resource Notifications health resources. It provides the schema and links to how-to articles. 
ms.topic: conceptual
ms.date: 09/26/2023
---

# Azure Resource Notifications - Health Resources events in Azure Event Grid
Health Resources system topic provides accurate, reliable, and complete health information for single instance virtual machines (VMs), virtual machine scale sets, and VMs in virtual machine scale sets. This information provides deeper insights into the various service problems that affect these Azure resources. Health Resources offers two event types for consumption:

- The `AvailabilityStatusChanged` event type provides insight into all the times your single instance VMs, VMs in virtual machine scale sets, or virtual machine scale sets themselves have been unavailable because of Azure service issues. For more information on the various health statuses, see [Azure Resource Health overview - Azure Service Health](../service-health/resource-health-overview.md#health-status).
- The `ResourceAnnotated` event type helps you to infer the availability state of your resources by providing crucial information on the reasons and causes for changes in availability. Using this data, you can take faster and more targeted mitigation measures. For more information on the various annotations emitted, see [Resource Health virtual machine Health Annotations](../service-health/resource-health-vm-annotation.md).

This article provides the properties and the schema for Azure Resource Notifications Health Resources events. For an introduction to event schemas in general, see [Azure Event Grid event schema](event-schema.md). In addition, you can find samples of generated events and a link to a related article on how to create system topic for this topic type. 

## Event types

| Event type | Description |
| ---------- | ----------- |
| `Microsoft.ResourceNotifications.HealthResources.AvailabilityStatusChanged` | Raised when the availability status of a single instance VM, a virtual machine scale set, or a VM in a virtual machine scale set changes. |
| `Microsoft.ResourceNotifications.HealthResources.ResourceAnnotated` | Raised when the health of a VM, a virtual machine scale set, or a VM in a virtual machine scale set, is impacted by availability impacting disruptions. The platform emits context as to why the disruption has occurred to assist you in responding appropriately.|

## Role-based access control
Currently, these events are exclusively emitted at the Azure subscription scope. It implies that the entity creating the event subscription for this topic type receives notifications throughout this Azure subscription. For security reasons, it's imperative to restrict the ability to create event subscriptions on this topic to principals with read access over the entire Azure subscription. To access data via this system topic, in addition to the generic permissions required by Event Grid, the following Azure Resource Notifications specific permission is necessary: `Microsoft.ResourceNotifications/systemTopics/subscribeToHealthResources/action`.

## Event schemas

# [Event Grid event schema](#tab/event-grid-event-schema)

Here's the schema:

```json
{
    "id": string,
    "topic": string,
    "subject": string,
    "data": {
        "resourceInfo": {
            "id": string,
            "name": string,
            "type": string,
            "properties": { 
                <<Different for AvailabilityStatusChanged event and ResourceAnnotated event>>            
            }
        },
        "operationalInfo":{
			"resourceEventTime": date-time
		},
        "apiVersion": string 
    }, 
    "eventType": string,
    "dataVersion": string, 
    "metadataVersion": string, 
    "eventTime": string 
}
```

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- | 
| `id` | String | Unique identifier of the event |
| `topic` | String | The Azure subscription for which this system topic is being created |
| `subject` | String | Publisher defined path about the event subject. Indicates what the event is about |
| `data` | Object | Contains event data specific to the resource provider. For more information, see the next table. |
| `eventType` | String | Registered event type of this system topic type |
| `dataVersion` | String | The schema version of the data object |
| `metadataVersion` | String | The schema version of the event metadata |
| `eventTime` | String <br/> Format: `2022-11-07T18:43:09.2894075Z` | The time the event is generated based on the provider's UTC time |



# [Cloud event schema](#tab/cloud-event-schema)

Here's the schema:

```json
{
    "id": string,
    "source": string,
    "subject": string,
    "type": string,
    "time ": string, 
    "data": {
        "resourceInfo": {
            "id": string,
            "name": string,
            "type": string,
            "properties": { 
                <<Different for AvailabilityStatusChanged event and ResourceAnnotated event>>            
            }
        },
        "operationalInfo":{
			"resourceEventTime": date-time
		},
        "apiVersion": string 
    }, 
    "specversion": string
}
```

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- | 
| `id` | String | Unique identifier of the event |
| `source` | String | The Azure subscription for which this system topic is being created |
| `subject` | String | Publisher defined path about the event subject. Indicates what the event is about |
| `type` | String | Registered event type of this system topic type |
| `time` | String <br/> Format: `2022-11-07T18:43:09.2894075Z` | The time the event is generated based on the provider's UTC time |
| `data` | Object | Contains event data specific to the resource provider. For more information, see the next table. |
| `specversion` | String | CloudEvents schema specification version. |

---

The `data` object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `resourceInfo` | Object | Data specific to the resource. For more information, see the next table. |
| `apiVersion` | String | Api version of the resource properties. |

The `resourceInfo` object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- | 
| `id` | String | Publisher defined path to the event subject |
| `properties` | Object | Payload of the resource. For more information, see the next table. |
| `name` | String | This value is always **current** for availability status events |
| `type` | String | The type of event that is being emitted. In this context, it's `Microsoft.ResourceHealth/AvailabilityStatuses` |


The `properties` within the `data` object is different for `AvailabilityStatusChanged` and `ResourceAnnotated` events. 

### Properties for the AvailabilityStatusChanged event

```json
            "properties": {
                "targetResourceId": string,
                "targetResourceType": string,
                "occurredTime": string,
                "previousAvailabilityState": string,
                "availabilityState": string
            }
```

For the `AvailabilityStatusChanged` event, the `properties` object has the following properties: 

| Property | Type | Description |
| -------- | ---- | ----------- | 
| `targetResourceId` | String | The base resource for which the availability information is being requested |
| `targetResourceType` | String | The type of the base resource |
| `occurredTime` | String | The time when this actual event was emitted.  |
| `previousAvailabilityState` | String | Previous availability status |
| `availabilityState` | String | Current availability status – refer to this link for the values [Availability Statuses - Get By Resource - REST API (Azure Resource Health)](/rest/api/resourcehealth/2022-10-01/availability-statuses/get-by-resource) |


### Properties for the ResourceAnnotated event

```json
            "properties": {
                "targetResourceId": string,
                "targetResourceType": string,
                "occurredTime": string,
                "annotationName": string,
                "reason": string,
                "summary": string,
                "context": string,
                "category": string,
            }
```

For the `ResourceAnnotated` event, the `properties` object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- | 
| `targetResourceId` | String | The base resource for which the annotation information is being requested |
| `targetResourceType` | String | The type of the base resource |
| `occurredTime` | String | Timestamp when the annotation was emitted by the Azure platform in response to availability-influencing event |
| `annotationName` | String | The name of the annotation. For the list of annotations and the corresponding descriptions, see [Resource Health virtual machine Health Annotations - Azure Service Health](../service-health/resource-health-vm-annotation.md) | 
| `reason` | String | Brief statement on why resource availability has changed or was influenced |
| `summary` | String | Detailed statement on the activity and cause for resource availability to change or be influenced |
| `context` | String | Determines whether resource availability was influenced due to Azure or user caused activity |
| `category` | String | Determines whether resource availability was influenced due to planned or unplanned activity. This property is only applicable to `Platform-Initiated` events. |


## Example events

### AvailabilityStatusChanged event 

# [Event Grid event schema](#tab/event-grid-event-schema)

```json
{
    "id": "1fb6fa94-d965-4306-abeq-4810f0774e97",
    "topic": "/subscriptions/00000000-0000-0000-0000-00000000000000",
    "subject": "/subscriptions/00000000-0000-0000-0000-00000000000000/resourceGroups/TestRG/providers/Microsoft.Compute/virtualMachines/virtualMachineTestHealth/providers/Microsoft.ResourceHealth/availabilityStatuses/current",
    "data": {
        "resourceInfo": {
            "id": "/subscriptions/00000000-0000-0000-0000-00000000000000/resourceGroups/TestRG/providers/Microsoft.Compute/virtualMachines/virtualMachineTestHealth/providers/Microsoft.ResourceHealth/availabilityStatuses/current",
            "name": "current",
            "type": "Microsoft.ResourceHealth/availabilityStatuses",
            "properties": {
                "targetResourceId": "/subscriptions/00000000-0000-0000-0000-00000000000000/resourceGroups/TestRG/providers/Microsoft.Compute/virtualMachines/virtualMachineTestHealth",
                "targetResourceType": "Microsoft.Compute/virtualMachines",
                "occurredTime": "2022-11-10T19:59:59.6470000Z",
                "previousAvailabilityState": "Unavailable",
                "availabilityState": "Available"
            }
        },
        "apiVersion": "2020-09-01"
    },
    "eventType": "Microsoft.ResourceNotifications.HealthResources.AvailabilityStatusChanged",
    "dataVersion": "1",
    "metadataVersion": "1",
    "eventTime": "2022-11-10T19:59:59.6470000Z"
}
```

# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of a key-value modified event: 

```json
{
    "id": "1fb6fa94-d965-4306-abeq-4810f0774e97",
    "source": "/subscriptions/00000000-0000-0000-0000-00000000000000",
    "subject": "/subscriptions/00000000-0000-0000-0000-00000000000000/resourceGroups/TestRG/providers/Microsoft.Compute/virtualMachines/virtualMachineTestHealth/providers/Microsoft.ResourceHealth/availabilityStatuses/current",
    "type": "Microsoft.ResourceNotifications.HealthResources.AvailabilityStatusChanged",
    "time": "2022-11-10T19:59:59.6470000Z",
    "data": {
        "resourceInfo": {
            "id": "/subscriptions/00000000-0000-0000-0000-00000000000000/resourceGroups/TestRG/providers/Microsoft.Compute/virtualMachines/virtualMachineTestHealth/providers/Microsoft.ResourceHealth/availabilityStatuses/current",
            "name": "current",
            "type": "Microsoft.ResourceHealth/availabilityStatuses",
            "properties": {
                "targetResourceId": "/subscriptions/00000000-0000-0000-0000-00000000000000/resourceGroups/TestRG/providers/Microsoft.Compute/virtualMachines/virtualMachineTestHealth",
                "targetResourceType": "Microsoft.Compute/virtualMachines",
                "occurredTime": "2022-11-10T19:59:59.6470000Z",
                "previousAvailabilityState": "Unavailable",
                "availabilityState": "Available"
            }
        },
        "apiVersion": "2020-09-01"
    },
    "specversion": "1.0"
}
```

---

### ResourceAnnotated event 

# [Event Grid event schema](#tab/event-grid-event-schema)

```json
{
    "id": "8945cf9b-e220-496e-ab4f-f3a239318995",
    "topic": "/subscriptions/0000000000-0000-0000-0000-0000000000000",
    "subject": "/subscriptions/0000000000-0000-0000-0000-0000000000000/resourceGroups/SampleTestRg/providers/Microsoft.Compute/virtualMachines/VirtualMachineTest8/providers/Microsoft.ResourceHealth/resourceAnnotations/current",
    "data": {
        "resourceInfo": {
            "id": "/subscriptions/0000000000-0000-0000-0000-0000000000000/resourceGroups/SampleTestRg/providers/Microsoft.Compute/virtualMachines/VirtualMachineTest8/providers/Microsoft.ResourceHealth/resourceAnnotations/current",
            "name": "current",
            "type": "Microsoft.ResourceHealth/resourceAnnotations",
            "properties": {
                "targetResourceId": "/subscriptions/0000000000-0000-0000-0000-0000000000000/resourceGroups/SampleTestRg/providers/Microsoft.Compute/virtualMachines/VirtualMachineTest8",
                "targetResourceType": "Microsoft.Compute/virtualMachines",
                "occurredTime": "2023-07-24T19:20:37.9245071Z",
                "annotationName": "VirtualMachineDeallocationInitiated",
                "reason": "Stopping and deallocating",
                "summary": "This virtual machine is stopped and deallocated as requested by an authorized user or process.",
                "context": "Customer Initiated",
                "category": "Not Applicable"
            }
        },
        "apiVersion": "2022-08-01"
    },
    "eventType": "Microsoft.ResourceNotifications.HealthResources.ResourceAnnotated",
    "dataVersion": "1",
    "metadataVersion": "1",
    "eventTime": "2023-07-24T19:20:37.9245071Z"
}
```

# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of a key-value modified event: 

```json
{
    "id": "8945cf9b-e220-496e-ab4f-f3a239318995",
    "source": "/subscriptions/0000000000-0000-0000-0000-0000000000000",
    "subject": "/subscriptions/0000000000-0000-0000-0000-0000000000000/resourceGroups/SampleTestRg/providers/Microsoft.Compute/virtualMachines/VirtualMachineTest8/providers/Microsoft.ResourceHealth/resourceAnnotations/current",
    "type": "Microsoft.ResourceNotifications.HealthResources.ResourceAnnotated",
    "time": "2023-07-24T19:20:37.9245071Z",
    "data": {
        "resourceInfo": {
            "id": "/subscriptions/0000000000-0000-0000-0000-0000000000000/resourceGroups/SampleTestRg/providers/Microsoft.Compute/virtualMachines/VirtualMachineTest8/providers/Microsoft.ResourceHealth/resourceAnnotations/current",
            "name": "current",
            "type": "Microsoft.ResourceHealth/resourceAnnotations",
            "properties": {
                "targetResourceId": "/subscriptions/0000000000-0000-0000-0000-0000000000000/resourceGroups/SampleTestRg/providers/Microsoft.Compute/virtualMachines/VirtualMachineTest8",
                "targetResourceType": "Microsoft.Compute/virtualMachines",
                "occurredTime": "2023-07-24T19:20:37.9245071Z",
                "annotationName": "VirtualMachineDeallocationInitiated",
                "reason": "Stopping and deallocating",
                "summary": "This virtual machine is stopped and deallocated as requested by an authorized user or process.",
                "context": "Customer Initiated",
                "category": "Not Applicable"
            }
        },
        "apiVersion": "2022-08-01"
    },
    "specversion": "1"
}
```

---

## Next steps
See [Subscribe to Azure Resource Notifications - Health Resources events](subscribe-to-resource-notifications-health-resources-events.md).