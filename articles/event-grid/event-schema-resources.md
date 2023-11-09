---
title: Azure Resource Notifications - Resources events in Azure Event Grid
description: This article provides information on Azure Event Grid events supported by Azure Resource Notifications resources. It provides the schema and links to how-to articles. 
ms.topic: conceptual
ms.date: 10/06/2023
---

# Azure Resource Notifications - Azure Resource Manager events in Azure Event Grid (Preview)
The Azure Resource Management system topic provides insights into the life cycle of various Azure resources.

The Event Grid system topics for Azure subscriptions and Azure resource groups provide resource life cycle events using a broader range of event types including action, write, and delete events for scenarios involving success, failure, and cancellation. However, it's worth noting that they don't include the resource payload. For details about these events, see [Event Grid system topic for Azure subscriptions](event-schema-subscriptions.md) and [Event Grid system topic for Azure resource groups](event-schema-resource-groups.md). 

In contrast, the Azure Resource Notifications (ARN) powered Azure Resource Management system topic offers a more targeted selection of event types, specifically `CreatedOrUpdated` (corresponding to `ResourceWriteSuccess` in the Event Grid Azure subscription system topic), and `Deleted` (corresponding to `ResourceDeleteSuccess` in the Event Grid Azure subscription system topic). These events come with comprehensive payload information, making it easier for customers to apply filtering and refine their notification stream.

For the list of resource types exposed, see [Azure Resource Graph resources](/azure/governance/resource-graph/reference/supported-tables-resources#resources) or use the following Azure Resource Graph query. 

```kusto
resources
| distinct ['type']
```

> [!NOTE]
> Azure Resource Management system topic doesn't yet support all the resource types from the resources table of Azure Resource Graph. We are working on improving this experience. 

## Event types
ARN Resources system topic offers two event types for consumption:

| Event type | Description |
| ---------- | ----------- |
| `Microsoft.ResourceNotifications.Resources.CreatedOrUpdated` | Raised when a resource is successfully created or updated. |
| `Microsoft.ResourceNotifications.Resources.Deleted` | Raised when a resource is deleted. |

## Role-based access control
Currently, these events are exclusively emitted at the Azure subscription scope. It implies that the entity creating the event subscription for this topic type receives notifications throughout this Azure subscription. For security reasons, it's imperative to restrict the ability to create event subscriptions on this topic to principals with read access over the entire Azure subscription. To access data via this system topic, in addition to the generic permissions required by Event Grid, the following Azure Resource Notifications specific permission is necessary: `Microsoft.ResourceNotifications/systemTopics/subscribeToResources/action`.

## Event schemas
This section provides schemas for the `CreatedOrUpdated` and `Deleted` events. 

### Event schema for CreatedOrUpdated event

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
            "tags": "string",
            "properties": {
                "_comment": "<< object-unique-to-each-publisher >>"
            }
        },
        "apiVersion": "string",
        "operationalInfo": {
            "resourceEventTime": "datetime"
        }
    },
    "eventType": "string",
    "dataVersion": "string",
    "metadataVersion": "string",
    "eventTime": "string"
}
```



# [Cloud event schema](#tab/cloud-event-schema)

Here's the schema:

```json
{
    "id": "string",
    "source": "string",
    "subject": "string",
    "data": {
        "resourceInfo": {
            "id": "string",
            "name": "string",
            "type": "string",
            "location": "string",
            "tags": "string",
            "properties": {
                "_comment": "object-unique-to-each-publisher"
            }
        },
        "apiVersion": "string",
        "operationalInfo": {
            "resourceEventTime": "datetime"
        }
    },
    "type": "string",
    "specversion": "string",
    "time": "string"
}
```

---

### Event schema for Deleted event

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
            "type": "string"
        },
        "operationalInfo": {
            "resourceEventTime": "datetime"
        }
    },
    "eventType": "string",
    "dataVersion": "string",
    "metadataVersion": "string",
    "eventTime": "string"
}
```



# [Cloud event schema](#tab/cloud-event-schema)

Here's the schema:

```json
{
    "id": "string",
    "source": "string",
    "subject": "string",
    "data": {
        "resourceInfo": {
            "id": "string",
            "name": "string",
            "type": "string"
        },
        "operationalInfo": {
            "resourceEventTime": "datetime"
        }
    },
    "type": "string",
    "specversion": "string",
    "time": "string"
}
```

---

An event in the Event Grid event schema format has the following top-level properties:

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

An event in the cloud event schema format has the following top-level properties:

| Property | Type | Description |
| -------- | ---- | ----------- | 
| `id` | String | Unique identifier of the event |
| `source` | String | The Azure subscription for which this system topic is being created. |
| `subject` | String | Publisher defined path to the base resource on which this event is emitted. |
| `type` | String | Registered event type of this system topic type |
| `time` | String <br/> Format: `2022-11-07T18:43:09.2894075Z` | The time the event is generated based on the provider's UTC time |
| `data` | Object | Contains event data specific to the resource provider. For more information, see the next table. |
| `specversion` | String | CloudEvents schema specification version. |


The `data` object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `resourceInfo` | Object | Data specific to the resource. For more information, see the next table. |
| `apiVersion` | String | API version of the resource properties. |
| `operationalInfo` | Object | Details of operational information pertaining to the resource. | 

The `resourceInfo` object has the following common properties across `CreatedOrUpdated` and `Deleted` events:

| Property | Type | Description |
| -------- | ---- | ----------- | 
| `id` | String | Publisher defined path to the event subject |
| `name` | String | This field indicates the Event-id. It always takes the value of the last section of the `id` field. |
| `type` | String | The type of event that is being emitted. In this context, it's either `Microsoft.ResourceNotifications.Resources.CreatedOrUpdated` or `Microsoft.ResourceNotifications.Resources.Deleted`. |

The `resourceInfo` object for the `CreatedOrUpdated` event has the following extra properties:

| Property | Type | Description |
| -------- | ---- | ----------- | 
| `location` | String | Location or region where the resource is located. |
| `tags` | String | Tags for the resource. |
| `properties` | Object | Payload of the resource. |

Only the `CreatedOrUpdated` event includes the `properties` object. The schema of this `properties` object is unique to each publisher. To discover the schema, see the [REST API documentation for the specific Azure resource](/rest/api/azure/). You can find an example in the **Examples events** section of this article. 
 
```json
            "properties": {
                "_comment": "<< object-unique-to-each-publisher >>"
            }
```

The `operationalInfo` object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- | 
| `resourceEventTime` | DateTime | Date and time when the resource was created or updated (for `CreatedOrUpdated` event), or deleted (for `Deleted` event). |

## Example events

### CreatedOrUpdated event 
This section shows the `CreatedOrUpdated` event generated when an Azure Storage account is created in the Azure subscription on which the system topic is created. 

# [Event Grid event schema](#tab/event-grid-event-schema)

```json
{
  "id": "4eef929a-a65c-47dd-93e2-46b8c17c6c17",
  "topic": "/subscriptions/{subscription-id}",
  "subject": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.Storage/storageAccounts/{storageAccount-name}",
  "data": {
    "resourceInfo": {
      "tags": {},
      "id": "/subscriptions/{subcription-id}/resourceGroups/{rg-name}/providers/Microsoft.Storage/storageAccounts/{storageAccount-name}",
      "name": "StorageAccount-name",
      "type": "Microsoft.Storage/storageAccounts",
      "location": "eastus",
      "properties": {
        "privateEndpointConnections": [],
        "minimumTlsVersion": "TLS1_2",
        "allowBlobPublicAccess": 1,
        "allowSharedKeyAccess": 1,
        "networkAcls": {
          "bypass": "AzureServices",
          "virtualNetworkRules": [],
          "ipRules": [],
          "defaultAction": "Allow"
        },
        "supportsHttpsTrafficOnly": 1,
        "encryption": {
          "requireInfrastructureEncryption": 0,
          "services": {
            "file": {
              "keyType": "Account",
              "enabled": 1,
              "lastEnabledTime": "2023-07-28T20:12:50.6380308Z"
            },
            "blob": {
              "keyType": "Account",
              "enabled": 1,
              "lastEnabledTime": "2023-07-28T20:12:50.6380308Z"
            }
          },
          "keySource": "Microsoft.Storage"
        },
        "accessTier": "Hot",
        "provisioningState": "Succeeded",
        "creationTime": "2023-07-28T20:12:50.4661564Z",
        "primaryEndpoints": {
          "dfs": "https://{storageAccount-name}.dfs.core.windows.net/",
          "web": "https://{storageAccount-name}.z13.web.core.windows.net/",
          "blob": "https://{storageAccount-name}.blob.core.windows.net/",
          "queue": "https://{storageAccount-name}.queue.core.windows.net/",
          "table": "https://{storageAccount-name}.table.core.windows.net/",
          "file": "https://{storageAccount-name}.file.core.windows.net/"
        },
        "primaryLocation": "eastus",
        "statusOfPrimary": "available",
        "secondaryLocation": "westus",
        "statusOfSecondary": "available",
        "secondaryEndpoints": {
          "dfs": "https://{storageAccount-name} -secondary.dfs.core.windows.net/",
          "web": "https://{storageAccount-name}-secondary.z13.web.core.windows.net/",
          "blob": "https://{storageAccount-name}-secondary.blob.core.windows.net/",
          "queue": "https://{storageAccount-name}-secondary.queue.core.windows.net/",
          "table": "https://{storageAccount-name}-secondary.table.core.windows.net/"
        }
      }
    },
    "apiVersion": "2019-06-01",
    "operationalInfo": {
      "resourceEventTime": "2023-07-28T20:13:10.8418063Z"
    }
  },
  "eventType": "Microsoft.ResourceNotifications.Resources.CreatedOrUpdated",
  "dataVersion": "1",
  "metadataVersion": "1",
  "eventTime": "2023-07-28T20:13:10.8418063Z"
}
```

# [Cloud event schema](#tab/cloud-event-schema)


```json
{
  "id": "4eef929a-a65c-47dd-93e2-46b8c17c6c17",
  "source": "/subscriptions/{subscription-id}",
  "subject": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.Storage/storageAccounts/{storageAccount-name}",
  "data": {
    "resourceInfo": {
      "tags": {},
      "id": "/subscriptions/{subcription-id}/resourceGroups/{rg-name}/providers/Microsoft.Storage/storageAccounts/{storageAccount-name}",
      "name": "StorageAccount-name",
      "type": "Microsoft.Storage/storageAccounts",
      "location": "eastus",
      "properties": {
        "privateEndpointConnections": [],
        "minimumTlsVersion": "TLS1_2",
        "allowBlobPublicAccess": 1,
        "allowSharedKeyAccess": 1,
        "networkAcls": {
          "bypass": "AzureServices",
          "virtualNetworkRules": [],
          "ipRules": [],
          "defaultAction": "Allow"
        },
        "supportsHttpsTrafficOnly": 1,
        "encryption": {
          "requireInfrastructureEncryption": 0,
          "services": {
            "file": {
              "keyType": "Account",
              "enabled": 1,
              "lastEnabledTime": "2023-07-28T20:12:50.6380308Z"
            },
            "blob": {
              "keyType": "Account",
              "enabled": 1,
              "lastEnabledTime": "2023-07-28T20:12:50.6380308Z"
            }
          },
          "keySource": "Microsoft.Storage"
        },
        "accessTier": "Hot",
        "provisioningState": "Succeeded",
        "creationTime": "2023-07-28T20:12:50.4661564Z",
        "primaryEndpoints": {
          "dfs": "https://{storageAccount-name}.dfs.core.windows.net/",
          "web": "https://{storageAccount-name}.z13.web.core.windows.net/",
          "blob": "https://{storageAccount-name}.blob.core.windows.net/",
          "queue": "https://{storageAccount-name}.queue.core.windows.net/",
          "table": "https://{storageAccount-name}.table.core.windows.net/",
          "file": "https://{storageAccount-name}.file.core.windows.net/"
        },
        "primaryLocation": "eastus",
        "statusOfPrimary": "available",
        "secondaryLocation": "westus",
        "statusOfSecondary": "available",
        "secondaryEndpoints": {
          "dfs": "https://{storageAccount-name} -secondary.dfs.core.windows.net/",
          "web": "https://{storageAccount-name}-secondary.z13.web.core.windows.net/",
          "blob": "https://{storageAccount-name}-secondary.blob.core.windows.net/",
          "queue": "https://{storageAccount-name}-secondary.queue.core.windows.net/",
          "table": "https://{storageAccount-name}-secondary.table.core.windows.net/"
        }
      }
    },
    "apiVersion": "2019-06-01",
    "operationalInfo": {
      "resourceEventTime": "2023-07-28T20:13:10.8418063Z"
    }
  },
  "type": "Microsoft.ResourceNotifications.Resources.CreatedOrUpdated",
  "specversion": "1.0",
  "time": "2023-07-28T20:13:10.8418063Z"
}
```

---

### Deleted event 
This section shows the `Deleted` event generated when an Azure Storage account is deleted in the Azure subscription on which the system topic is created. 

# [Event Grid event schema](#tab/event-grid-event-schema)

```json
{
  "id": "d4611260-d179-4f86-b196-3a9d4128be2d",
  "topic": "/subscriptions/{subscription-id}",
  "subject": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.Storage/storageAccounts/{storageAccount-name}",
  "data": {
    "resourceInfo": {
      "id": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.Storage/storageAccounts/{storageAccount-name}",
      "name": "storageAccount-name",
      "type": "Microsoft.Storage/storageAccounts"
    },
    "operationalInfo": {
      "resourceEventTime": "2023-07-28T20:11:36.6347858Z"
    }
  },
  "eventType": "Microsoft.ResourceNotifications.Resources.Deleted",
  "dataVersion": "1",
  "metadataVersion": "1",
  "eventTime": "2023-07-28T20:11:36.6347858Z"
}
```

# [Cloud event schema](#tab/cloud-event-schema)


```json
{
  "id": "d4611260-d179-4f86-b196-3a9d4128be2d",
  "source": "/subscriptions/{subscription-id}",
  "subject": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.Storage/storageAccounts/{storageAccount-name}",
  "data": {
    "resourceInfo": {
      "id": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.Storage/storageAccounts/{storageAccount-name}",
      "name": "storageAccount-name",
      "type": "Microsoft.Storage/storageAccounts"
    },
    "operationalInfo": {
      "resourceEventTime": "2023-07-28T20:11:36.6347858Z"
    }
  },
  "type": "Microsoft.ResourceNotifications.Resources.Deleted",
  "specversion": "1.0",
  "time": "2023-07-28T20:11:36.6347858Z"
}
```

---

[!INCLUDE [contact-resource-notifications](./includes/contact-resource-notifications.md)]

## Next steps
See [Subscribe to Azure Resource Notifications - Resources events](subscribe-to-resource-notifications-resources-events.md).
