---
title: Storage queue as an event handler for Azure Event Grid events
description: Describes how you can use Azure storage queues as event handlers for Azure Event Grid events.
ms.topic: conceptual
ms.date: 03/01/2023
---

# Storage queue as an event handler for Azure Event Grid events
An event handler is the place where the event is sent. The handler takes some further action to process the event. Several Azure services are automatically configured to handle events and **Azure Queue Storage** is one of them. 

Use **Queue Storage** to receive events that need to be pulled. You might use Queue storage when you have a long running process that takes too long to respond. By sending events to Queue storage, the app can pull and process events on its own schedule.

> [!NOTE]
> - If there's no firewall or virtual network rules configured for the Azure Storage account, you can use both user-assigned and system-assigned identities to deliver events to the Azure Storage account. 
> - If a firewall or virtual network rule is configured for the Azure Storage account, you can use only the system-assigned managed identity if **Allow Azure services on the trusted service list to access the storage account** is also enabled on the storage account. You can't use user-assigned managed identity whether this option is enabled or not. 

## Tutorials
See the following tutorial for an example of using Queue storage as an event handler. 

|Title  |Description  |
|---------|---------|
| [Quickstart: route custom events to Azure Queue storage with Azure CLI and Event Grid](custom-event-to-queue-storage.md) | Describes how to send custom events to a Queue storage. |

## REST examples (for PUT)

### Storage queue as the event handler

```json
{
	"properties": 
	{
		"destination": 
		{
			"endpointType": "StorageQueue",
			"properties": 
			{
				"resourceId": "/subscriptions/<AZURE SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.Storage/storageAccounts/<STORAGE ACCOUNT NAME>",
				"queueName": "<QUEUE NAME>"
			}
		},
		"eventDeliverySchema": "EventGridSchema"
	}
}
```

### Storage queue as the event handler - delivery with managed identity

```json
{
	"properties": 
	{
		"deliveryWithResourceIdentity": 
		{
			"identity": 
			{
				"type": "SystemAssigned"
			},
			"destination": 
			{
				"endpointType": "StorageQueue",
				"properties": 
				{
					"resourceId": "/subscriptions/<AZURE SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.Storage/storageAccounts/<STORAGE ACCOUNT NAME>",
					"queueName": "<QUEUE NAME>"
				}
			}
		},
		"eventDeliverySchema": "EventGridSchema"
	}
}
```

### Storage queue as the event handler with a deadletter destination

```json
{
	"name": "",
	"properties": 
	{
		"destination": 
		{
			"endpointType": "StorageQueue",
			"properties": 
			{
				"resourceId": "/subscriptions/<AZURE SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.Storage/storageAccounts/<DESTINATION STORAGE>",
				"queueName": "queue1"
			}
		},
		"eventDeliverySchema": "EventGridSchema",
		"deadLetterDestination": 
		{
			"endpointType": "StorageBlob",
			"properties": 
			{
				"resourceId": "/subscriptions/<AZURE SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.Storage/storageAccounts/<DEADLETTER STORAGE>",
				"blobContainerName": "test"
			}
		}
	}
}
```

### Storage queue as the event handler with a deadletter destination - managed identity

```json
{
	"properties": 
	{
		"destination": 
		{
			"endpointType": "StorageQueue",
			"properties": 
			{
				"resourceId": "/subscriptions/<AZURE SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.Storage/storageAccounts/<DESTINATION STORAGE>",
				"queueName": "queue1"
			}
		},
		"eventDeliverySchema": "EventGridSchema",
		"deadLetterWithResourceIdentity": 
		{
			"identity": 
			{
				"type": "SystemAssigned"
			},
			"deadLetterDestination": 
			{
				"endpointType": "StorageBlob",
				"properties": 
				{
					"resourceId": "/subscriptions/<AZURE SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.Storage/storageAccounts/<DEADLETTER STORAGE>",
					"blobContainerName": "test"
				}
			}
		}
	}
}
```

## Next steps
See the [Event handlers](event-handlers.md) article for a list of supported event handlers. 
