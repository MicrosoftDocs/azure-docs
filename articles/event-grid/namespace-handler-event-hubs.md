---
title: Event hubs as event handler for Azure Event Grid namespaces
description: Describes how you can use an Azure event hub as an event handler for Azure Event Grid namespaces.
ms.topic: conceptual
ms.custom:
  - ignite-2023
ms.date: 11/15/2023
---

# Azure Event hubs as a handler destination in subscriptions to Azure Event Grid namespace topics

An event handler is the place where the event is sent. The handler takes an action to process the event. Currently, **Azure Event Hubs** is the only handler supported as a destination for subscriptions to namespace topics.

Use **Event Hubs** when your solution gets events from Event Grid faster than it can process the events. Once the events are in an event hub, your application can process events from the event hub at its own schedule. You can scale your event processing to handle the incoming events.

## Message headers

Here are the properties you receive in the header of an event or message sent to Event Hubs:

| Property name | Description |
| ------------- | ----------- |
| `aeg-subscription-name` | Name of the event subscription. |
| `aeg-delivery-count` | Number of attempts made for the event. |
| `aeg-output-event-id` | System generated event ID. |
| `aeg-compatibility-mode-enabled` | This property is only available and set when delivering via Event Grid namespaces. Currently the only possible value is *false*. It's intended to help event handlers to distinguish between events delivered via Event Grid namespaces vs Event Grid custom topics/system topics/partner namespaces etc. |
| `aeg-metadata-version` | Metadata version of the event. Represents the spec version for cloud event schema. |

## REST examples

### Event subscription with Event Hubs as event handler using system assigned identity

```json
{
  "properties": {
    "deliveryConfiguration": {
      "deliveryMode": "Push",
      "push": {
        "deliveryWithResourceIdentity": {
          "identity": {
            "type": "SystemAssigned"
          },
          "destination": {
            "endpointType": "EventHub",
            "properties": {
              "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/{resource-group}/providers/Microsoft.EventHub/namespaces/{namespace-name}/eventhubs/{eventhub-name}"
            }
          }
        }
      }
    }
  }
}
```

### Event subscription with Event Hubs as event handler using user assigned identity

```json
{
  "properties": {
    "deliveryConfiguration": {
      "deliveryMode": "Push",
      "push": {
        "deliveryWithResourceIdentity": {
          "identity": {
            "type": "UserAssigned",
            "userAssignedIdentities": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/{resource-group}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{user-identity-name}"
          },
          "destination": {
            "endpointType": "EventHub",
            "properties": {
              "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/{resource-group}/providers/Microsoft.EventHub/namespaces/{namespace-name}/eventhubs/{eventhub-name}"
            }
          }
        }
      }
    }
  }
}
```

### Event subscription with deadletter destination configured on an Event Hubs event handler

```json
{
  "properties": {
    "deliveryConfiguration": {
      "deliveryMode": "Push",
      "push": {
        "deliveryWithResourceIdentity": {
          "identity": {
            "type": "UserAssigned",
            "userAssignedIdentities": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/{resource-group}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{user-identity-name}"
          },
          "destination": {
            "endpointType": "EventHub",
            "properties": {
              "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/{resource-group}/providers/Microsoft.EventHub/namespaces/{namespace-name}/eventhubs/{eventhub-name}"
            }
          }
        },
        "deadLetterDestinationWithResourceIdentity": {
          "identity": {
            "type": "UserAssigned",
            "userAssignedIdentities": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/{resource-group}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{user-identity-name}"
          },
          "deadLetterDestination": {
            "endpointType": "StorageBlob",
            "properties": {
              "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/{resource-group}/providers/Microsoft.Storage/storageAccounts/{storage-account-name}",
              "blobContainerName": "{blob-container-name}"
            }
          }
        }
      }
    }
  }
}
```

### Event subscription with delivery properties configured on an Event Hubs event handler

```json
{
  "properties": {
    "deliveryConfiguration": {
      "deliveryMode": "Push",
      "push": {
        "deliveryWithResourceIdentity": {
          "identity": {
            "type": "SystemAssigned"
          },
          "destination": {
            "endpointType": "EventHub",
            "properties": {
              "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/{resource-group}/providers/Microsoft.EventHub/namespaces/{namespace-name}/eventhubs/{eventhub-name}",
              "deliveryAttributeMappings": [
                {
                  "name": "somestaticname",
                  "type": "Static",
                  "properties": {
                    "value": "somestaticvalue"
                  }
                },
                {
                  "name": "somedynamicname",
                  "type": "Dynamic",
                  "properties": {
                    "sourceField": "subject"
                  }
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

## Event Hubs specific delivery properties

Event subscriptions allow you to set up HTTP headers that are included in delivered events. This capability allows you to set custom headers that the destination requires. You can set custom headers on the events that are delivered to Azure Event Hubs.

If you need to publish events to a specific partition within an event hub, set the `PartitionKey` property on your event subscription to specify the partition key that identifies the target event hub partition.

| Header name | Header type |
| :-- | :-- |
|`PartitionKey` | Static or dynamic |

For more information, see [Custom delivery properties on namespaces](namespace-delivery-properties.md).

## Next steps

- [Event Grid namespaces push delivery](namespace-push-delivery-overview.md).
