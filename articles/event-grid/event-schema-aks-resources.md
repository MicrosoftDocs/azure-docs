---
title: Azure Resource Notifications - AKS resources events in Azure Event Grid
description: This article provides information on Azure Event Grid events supported by Azure Resource Notifications AKS resources. It provides the schema and links to how-to articles. 
ms.topic: conceptual
ms.date: 10/29/2025
---

# Azure Resource Notifications - AKS Resources events in Azure Event Grid (Preview)
Azure Kubernetes Fleet Manager is designed to help customers upgrade multiple AKS clusters in a safe and controlled manner. The Fleet Manager service enables the creation of workflows that upgrade Kubernetes clusters in a specific sequence. Because upgrades carry significant risk, customers typically verify health metrics before and after each upgrade to prevent downtime or regressions. To enhance this process, Fleet Manager supports approvals via the use of a Gate resource. Gates allow customers to approve upgrades as the workflow progresses, providing greater control over the multi-cluster upgrade experience. AKS Resources offers 3 event types for Azure Kubernetes Fleet Manager Update Run Gates: `FleetGateCreated`, `FleetGateUpdated` and `FleetGateDeleted`.

This article provides the properties and the schema for Azure Resource Notifications AKS Resources events. For an introduction to event schemas in general, see [Azure Event Grid event schema](event-schema.md). In addition, you can find samples of generated events and a link to a related article on how to create system topic for this topic type. 

## Event types
AKS Resources offers three event types for consumption:

| Event type | Description |
| ---------- | ----------- |
| `Microsoft.ResourceNotifications.AKSResources.FleetGateCreated` | Raised when an Azure Kubernetes Fleet Manager Update Run reaches an instance of a Gate resource.|
| `Microsoft.ResourceNotifications.AKSResources.FleetGateUpdated` | Raised when the status of an Azure Kubernetes Fleet Manager Update Run Gate resource changes (Pending to Completed).|
| `Microsoft.ResourceNotifications.AKSResources.FleetGateDeleted` |  Raised when an Azure Kubernetes Fleet Manager Update Run which contains an instance of a Gate is deleted.|


## Role-based access control
Currently, these events are exclusively emitted at the Azure subscription scope. It implies that the entity creating the event subscription for this topic type receives notifications throughout this Azure subscription. For security reasons, it's imperative to restrict the ability to create event subscriptions on this topic to principals with read access over the entire Azure subscription. To access data via this system topic, in addition to the generic permissions required by Event Grid, the following Azure Resource Notifications specific permission is necessary: `Microsoft.ResourceNotifications/systemTopics/subscribeToAKSResources/action`.

## Event schemas


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
| `source` | String | The Azure subscription for which this system topic is being created. |
| `subject` | String | Publisher defined path to the base resource on which this event is emitted. |
| `type` | String | Registered event type of this system topic type. Value is one of Microsoft.ResourceNotifications.AKSResources.FleetGateCreated or Microsoft.ResourceNotifications.AKSResources.FleetGateUpdated or Microsoft.ResourceNotifications.AKSResources.FleetGateDeleted|
| `time` | String <br/> Format: `2022-11-07T18:43:09.2894075Z` | The time the event is generated based on the provider's UTC time |
| `data` | Object | Contains event data specific to the resource provider. For more information, see the next table. |
| `specversion` | String | CloudEvents schema specification version. |

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
            "properties": object,
        },
        "operationalInfo":{
			"resourceEventTime": date-time
		},
        "apiVersion": string 
    }, 
    "eventType": "Microsoft.ResourceNotifications.AKSResources.FleetGateCreated | Microsoft.ResourceNotifications.AKSResources.FleetGateUpdated | Microsoft.ResourceNotifications.AKSResources.FleetGateDeleted",
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
| `name` | String | This field indicates the Event-id. It always takes the value of the last section of the `id` field. |
| `type` | String | The type of event that is being emitted. In this context, it's either `Microsoft.ResourceNotifications.AKSResources.FleetGateCreated`, `Microsoft.ResourceNotifications.AKSResources.FleetGateUpdated`, `Microsoft.ResourceNotifications.AKSResources.FleetGateDeleted`|
| `properties` | Object | Payload of the resource. For more information, see the next table. |


The `operationalInfo` object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- | 
| `resourceEventTime` | DateTime | Date and time when the resource was updated. |


The `data` object has the following properties. 

### Properties for FleetGateCreated/FleetGateCreated/FleetGateDeleted event

```json
            "properties": {
                "displayName": string,
                "gateType": string,
                "provisioningState": string,
                "state": string,
                "target": object
            }
```

The `properties` object has the following properties: 

| Property | Type | Description |
| -------- | ---- | ----------- | 
| `displayName` | String | The optional name provided when defining the approval Gate in the update strategy.|
| `gateType` | String | 	The type of the Gate. There's only one valid choice of "Approval" for now. |
| `provisioningState` | String | Provisioning state of the Gate resource.|
| `state` | String | The state of the Gate. "Pending" = waiting approval; "Completed" = approval applied.|
| `target`| Object | The target that the Gate is controlling.|

The `target` object has the following properties. 

### Properties for the `target` object

```json
            "target": {
                "id": string,
                "updateRunProperties": object,
            }
```

Description of the properties in `target` object

| Property | Type | Description |
| -------- | ---- | ----------- | 
| `id` | String | The full Azure resource identifier for the update run generating the event. |
| `updateRunProperties` | Object | Properties related to update run. see table below for further information |

### Properties under `updateRunProperties` object

| Property | Type | Description |
|----------|------|-------------|
| `group` | String | The name of the update group where the Gate is applied. Only present for groups.    |
| `name` | String | The name of the update run generating the event.     |
| `stage`| String | The name of the update stage. Can appear for stage gates and group gates within the stage.      |
| `timing`| String |  Denotes if the Gate is applied before or after the stage or group.    |


## Example events

### FleetGateCreated event 

# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of a FleetGateCreated modified event: 

```json
  {
    "source": "/subscriptions/{subscription-id}",
    "subject": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerService/fleets/{fleet-name}/gates/9i567df1-jh3a-281j-8eb8-123ac2el0t60",
    "type": "Microsoft.ResourceNotifications.AksResources.FleetGateCreated",
    "time": "2025-09-09T01:10:58.4955907Z",
    "id": "m7m4mf0x-740g-4c2d-a0ab-a4r8h4uuf018",
    "data": {
      "resourceInfo": {
        "id": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerService/fleets/{fleet-name}/gates/9i567df1-jh3a-281j-8eb8-123ac2el0t60",
        "name": "9i567df1-jh3a-281j-8eb8-123ac2el0t60",
        "type": "Microsoft.ContainerService/fleets/gates",
        "properties": {
          "displayName": "before-stage",
          "gateType": "Approval",
          "provisioningState": "Succeeded",
          "state": "Pending",
          "target": {
            "id": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerService/fleets/{fleet-name}/updateRuns/run-1",
            "updateRunProperties": {
              "name": "run-1",
              "stage": "stage-1",
              "timing": "Before"
            }
          }
        }
      },
      "operationalInfo": {
        "resourceEventTime": "2025-09-08T18:10:58.4955907-07:00"
      },
      "apiVersion": "2025-04-01-preview"
    },
    "specVersion": "1.0"
  }
```

# [Event Grid event schema](#tab/event-grid-event-schema)

```json
{
  "id": "m7m4mf0x-740g-4c2d-a0ab-a4r8h4uuf018",
  "topic": "/subscriptions/{subscription-id}",
  "subject": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerService/fleets/{fleet-name}/gates/9i567df1-jh3a-281j-8eb8-123ac2el0t60",
  "data": {
    "resourceInfo": {
      "id": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerService/fleets/{fleet-name}/gates/9i567df1-jh3a-281j-8eb8-123ac2el0t60",
      "name": "9i567df1-jh3a-281j-8eb8-123ac2el0t60",
      "type": "Microsoft.ContainerService/fleets/gates",
      "properties": {
        "displayName": "before-stage",
        "gateType": "Approval",
        "provisioningState": "Succeeded",
        "state": "Pending",
        "target": {
          "id": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerService/fleets/{fleet-name}/updateRuns/run-1",
          "updateRunProperties": {
            "name": "run-1",
            "stage": "stage-1",
            "timing": "Before"
          }
        }
      }
    },
    "operationalInfo": {
      "resourceEventTime": "2025-09-09T01:10:58.4955907+00:00"
    },
    "apiVersion": "2025-04-01-preview"
  },
  "eventType": "Microsoft.ResourceNotifications.AksResources.FleetGateCreated",
  "dataVersion": "1",
  "metadataVersion": "1",
  "eventTime": "2025-09-09T01:10:58.4955907Z"
}
```

---

### FleetGateUpdated event 

# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of a FleetGateUpdated event: 

```json
  {
    "source": "/subscriptions/{subscription-id}",
    "subject": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerService/fleets/{fleet-name}/gates/1k90uy67-e375-4xv6-z220-5197ekk1aka4",
    "type": "Microsoft.ResourceNotifications.AksResources.FleetGateUpdated",
    "time": "2025-09-09T01:12:25.8924289Z",
    "id": "a9f8d51g-c114-4565-buee-5q1jb6fb0b08",
    "data": {
      "resourceInfo": {
        "id": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerService/fleets/{fleet-name}/gates/1k90uy67-e375-4xv6-z220-5197ekk1aka4",
        "name": "1k90uy67-e375-4xv6-z220-5197ekk1aka4",
        "type": "Microsoft.ContainerService/fleets/gates",
        "properties": {
          "displayName": "before group",
          "gateType": "Approval",
          "provisioningState": "Succeeded",
          "state": "Completed",
          "target": {
            "id": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerService/fleets/{fleet-name}/updateRuns/run-1",
            "updateRunProperties": {
              "group": "group-1",
              "name": "run-1",
              "stage": "stage-1",
              "timing": "Before"
            }
          }
        }
      },
      "operationalInfo": {
        "resourceEventTime": "2025-09-08T18:12:25.8924289-07:00"
      },
      "apiVersion": "2025-04-01-preview"
    },
    "specVersion": "1.0"
  }
```

# [Event Grid event schema](#tab/event-grid-event-schema)

```json
{
  "id": "a9f8d51g-c114-4565-buee-5q1jb6fb0b08",
  "topic": "/subscriptions/{subscription-id}",
  "subject": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerService/fleets/{fleet-name}/gates/1k90uy67-e375-4xv6-z220-5197ekk1aka4",
  "data": {
    "resourceInfo": {
      "id": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerService/fleets/{fleet-name}/gates/1k90uy67-e375-4xv6-z220-5197ekk1aka4",
      "name": "1k90uy67-e375-4xv6-z220-5197ekk1aka4",
      "type": "Microsoft.ContainerService/fleets/gates",
      "properties": {
        "displayName": "before group",
        "gateType": "Approval",
        "provisioningState": "Succeeded",
        "state": "Completed",
        "target": {
          "id": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerService/fleets/{fleet-name}/updateRuns/run-1",
          "updateRunProperties": {
            "group": "group-1",
            "name": "run-1",
            "stage": "stage-1",
            "timing": "Before"
          }
        }
      }
    },
    "operationalInfo": {
      "resourceEventTime": "2025-09-09T01:12:25.8924289+00:00"
    },
    "apiVersion": "2025-04-01-preview"
  },
  "eventType": "Microsoft.ResourceNotifications.AksResources.FleetGateUpdated",
  "dataVersion": "1",
  "metadataVersion": "1",
  "eventTime": "2025-09-09T01:12:25.8924289Z"
}
```

---
### FleetGateDeleted event 

# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of a FleetGateDeleted modified event: 

```json
  {
    "source": "/subscriptions/{subscription-id}",
    "subject": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerService/fleets/{fleet-name}/gates/8a63212d-9dp1-4oa6-8135-14ghghg311ea6",
    "type": "Microsoft.ResourceNotifications.AksResources.FleetGateDeleted",
    "time": "2025-09-22T09:01:22.5495164Z",
    "id": "48e92180-a34e-57b2-b989-7056ccd42c0b",
    "data": {
      "resourceInfo": {
        "id": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerService/fleets/{fleet-name}/gates/8a63212d-9dp1-4oa6-8135-14ghghg311ea6",
        "name": "8a63212d-9dp1-4oa6-8135-14ghghg311ea6",
        "type": "Microsoft.ContainerService/fleets/gates",
        "properties": {
          "displayName": "stage-after",
          "gateType": "Approval",
          "provisioningState": "Succeeded",
          "state": "Pending",
          "target": {
            "id": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerService/fleets/{fleet-name}/updateRuns/run-delete",
            "updateRunProperties": {
              "name": "run-delete",
              "stage": "stage-1",
              "timing": "After"
            }
          }
        }
      },
      "operationalInfo": {
        "resourceEventTime": "2025-09-22T02:01:22.5495164-07:00"
      },
      "apiVersion": "2025-04-01-preview"
    },
    "specVersion": "1.0"
  }
```

# [Event Grid event schema](#tab/event-grid-event-schema)

```json
{
  "id": "48e92180-a34e-57b2-b989-7056ccd42c0b",
  "topic": "/subscriptions/{subscription-id}",
  "subject": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerService/fleets/{fleet-name}/gates/8a63212d-9dp1-4oa6-8135-14ghghg311ea6",
  "data": {
    "resourceInfo": {
      "id": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerService/fleets/{fleet-name}/gates/8a63212d-9dp1-4oa6-8135-14ghghg311ea6",
      "name": "8a63212d-9dp1-4oa6-8135-14ghghg311ea6",
      "type": "Microsoft.ContainerService/fleets/gates",
      "properties": {
        "displayName": "stage-after",
        "gateType": "Approval",
        "provisioningState": "Succeeded",
        "state": "Pending",
        "target": {
          "id": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerService/fleets/{fleet-name}/updateRuns/run-delete",
          "updateRunProperties": {
            "name": "run-delete",
            "stage": "stage-1",
            "timing": "After"
          }
        }
      }
    },
    "operationalInfo": {
      "resourceEventTime": "2025-09-22T09:01:22.5495164+00:00"
    },
    "apiVersion": "2025-04-01-preview"
  },
  "eventType": "Microsoft.ResourceNotifications.AksResources.FleetGateDeleted",
  "dataVersion": "1",
  "metadataVersion": "1",
  "eventTime": "2025-09-22T09:01:22.5495164Z"
}
```

---

[!INCLUDE [contact-resource-notifications](./includes/contact-resource-notifications.md)]

## Next steps
See [Subscribe to Azure Resource Notifications - AKS Resources events](subscribe-to-resource-notifications-aks-resources-events.md).
