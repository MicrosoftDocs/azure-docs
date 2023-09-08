---
title: Azure Resource Notifications - health resources events in Azure Event Grid
description: This article provides information on Azure Event Grid events supported by Azure Resource Notifications health resources. It provides the schema and links to how-to articles. 
ms.topic: conceptual
ms.date: 09/08/2023
---

# Azure Resouce Notifications - health resources events in Azure Event Grid
This article provides the properties and schema for Azure Resource Notification - health resources events. For an introduction to event schemas in general, see [Azure Event Grid event schema](event-schema.md). 

## Event types
Event Grid uses [event subscriptions](../concepts.md#event-subscriptions) to route event messages to subscribers. Azure Resource Notifications - health resources emit the following event types: 

| Event type | Description |
| ---------- | ----------- |
| Microsoft.ResourceNotifications.HealthResources.AvailabilityStatusChanged | Raised when the availability of a virtual machine (VM) changes. |
| Microsoft.ResourceNotifications.HealthResources.ResourceAnnotated | Raised when the health of your VM is impacted by availability impacting disruptions (see [Resource types and health checks](../service-health/resource-health-checks-resource-types)), the platform emits context as to why the disruption has occurred to assist you in responding appropriately. |

## Event schemas

# [Event Grid event schema](#tab/event-grid-event-schema)

Here is the schema:

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
                <<Different for AvailabilityStatusChanged event and ResourceAnnotatedEvent>>
            }
        },
        "apiVersion ": string 
    }, 
    "eventType": string,
    "dataVersion": string, 
    "metadataVersion": string, 
    "eventTime ": string 
}
```

The `properties` object is different for `AvailabilityStatusChanged` and `ResourceAnnotated` events. 

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

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- | 
| `id` | String | Unique identifier of the event |
| `topic` | String | The azure subscription for which this system topic is being created |
| `subject` | String | Publisher defined path about the event subject. Indicates what the event is about |
| `data` | Object | Contains event data specific to the resource provider. For more information, see the next table. |
| `eventType` | String | Registered event type of this system topic type |
| `dataVersion` | String | The schema version of the data object |
| `metadataVersion` | String | The schema version of the event metadata |
| `eventTime` | String <br/> Format: `2022-11-07T18:43:09.2894075Z` | The time the event is generated based on the provider's UTC time |

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
| `type` | String | The type of event that is being emitted. In this context it is `Microsoft.ResourceHealth/AvailabilityStatuses` |

For the `AvailabilityStatusChanged` event, the `properties` object has the following properties: 

| property | Type | Description |
| -------- | ---- | ----------- | 
| `targetResourceId` | String | The base resource for which the availability information is being requested |
| `targetResourceType` | String | The type of the base resource |
| `occurredTime` | String | The time when this actual event was emitted.  |
| `previousAvailabilityState` | String | Previous availability status |
| `availabilityState` | String | Current availability status – refer to this link for the values [Availability Statuses - Get By Resource - REST API (Azure Resource Health)](/rest/api/resourcehealth/2022-10-01/availability-statuses/get-by-resource) |

For the `ResourceAnnotated` event, the `properties` object has the following properties:

| property | Type | Description |
| -------- | ---- | ----------- | 
| `targetResourceId` | String | The base resource for which the annotation information is being requested |
| `targetResourceType` | String | The type of the base resource |
| `occurredTime` | String | Timestamp when the annotation was emitted by the Azure platform in response to availability-influencing event |
| `annotationName` | String | The name of the annotation. For the list of annotations and the corresponding descriptions, see [Resource Health virtual machine Health Annotations - Azure Service Health](../service-health/resource-health-vm-annotation.md) | Microsoft Learn |
| `reason` | String | Brief statement on why resource availability has changed or was influenced |
| `summary` | String | Detailed statement on the activity and cause for resource availability to change or be influenced |
| `context` | String | Determines whether resource availability was influenced due to Azure or user caused activity |
| `category` | String | Determines whether resource availability was influenced due to planned or unplanned activity. This is only applicable to `Platform-Initiated` events. |



# [Cloud event schema](#tab/cloud-event-schema)

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `source` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
| `type` | string | One of the registered event types for this event source. |
| `time` | string | The time the event is generated based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | App Configuration event data. |
| `specversion` | string | CloudEvents schema specification version. |

---

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
[{
  "id": "84e17ea4-66db-4b54-8050-df8f7763f87b",
  "source": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/microsoft.appconfiguration/configurationstores/contoso",
  "subject": "https://contoso.azconfig.io/kv/Foo?label=FizzBuzz",
  "data": {
    "key": "Foo",
    "label": "FizzBuzz",
    "etag": "FnUExLaj2moIi4tJX9AXn9sakm0"
  },
  "type": "Microsoft.AppConfiguration.KeyValueModified",
  "time": "2019-05-31T20:05:03Z",
  "specversion": "1.0"
}]
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
[{
  "id": "84e17ea4-66db-4b54-8050-df8f7763f87b",
  "source": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/microsoft.appconfiguration/configurationstores/contoso",
  "subject": "https://contoso.azconfig.io/kv/Foo?label=FizzBuzz",
  "data": {
    "key": "Foo",
    "label": "FizzBuzz",
    "etag": "FnUExLaj2moIi4tJX9AXn9sakm0"
  },
  "type": "Microsoft.AppConfiguration.KeyValueModified",
  "time": "2019-05-31T20:05:03Z",
  "specversion": "1.0"
}]
```
---



## Tutorials and how-tos

|Title | Description |
|---------|---------|
| [React to Azure App Configuration events by using Event Grid](../azure-app-configuration/concept-app-configuration-event.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Overview of integrating Azure App Configuration with Event Grid. |
| [Use Event Grid for data change notifications](../azure-app-configuration/howto-app-configuration-event.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Learn how to use Azure App Configuration event subscriptions to send key-value modification events to a web endpoint. |

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
* For an introduction to working with Azure App Configuration events, see [Use Event Grid for data change notifications](../azure-app-configuration/howto-app-configuration-event.md?toc=%2fazure%2fevent-grid%2ftoc.json). 