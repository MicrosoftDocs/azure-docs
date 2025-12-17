---
author: glenga
ms.service: azure-functions
ms.topic: include
ms.date: 12/16/2025
ms.author: glenga
---

| Extension | Types| Support level |
| --- | --- | --- |
| [Azure Blob Storage](../articles/azure-functions/functions-bindings-storage-blob.md) | `BlobClient`<br/>`BlobContainerClient`<br/>`BlockBlobClient`<br/>`PageBlobClient`<br/>`AppendBlobClient` | Trigger: GA<br/>Input: GA |
| [Azure Cosmos DB](../articles/azure-functions/functions-bindings-cosmosdb-v2.md) | `CosmosClient`<br/>`Database`<br/>`Container` | Input: GA |
| [Azure Event Grid](../articles/azure-functions/functions-bindings-event-grid.md) | `CloudEvent`<br/>`EventGridEvent` | Trigger: GA |
| [Azure Event Hubs](../articles/azure-functions/functions-bindings-event-hubs.md) | `EventData`<br/>`EventHubProducerClient` | Trigger: GA |
| [Azure Queue Storage](../articles/azure-functions/functions-bindings-storage-queue.md) | `QueueClient`<br/>`QueueMessage` | Trigger: GA |
| [Azure Service Bus](../articles/azure-functions/functions-bindings-service-bus.md) | `ServiceBusClient`<br/>`ServiceBusReceiver`<br/>`ServiceBusSender`<br/>`ServiceBusMessage` | Trigger: GA |
| [Azure Table Storage](../articles/azure-functions/functions-bindings-storage-table.md) | `TableClient`<br/>`TableEntity` | Input: GA |

Considerations for SDK types:

+ When using [binding expressions](../articles/azure-functions/functions-bindings-expressions-patterns.md) that rely on trigger data, SDK types for the trigger itself cannot be used.
+ For output scenarios where you might use an SDK type, create and work with SDK clients directly instead of using an output binding.
+ The Azure Cosmos DB trigger uses the [Azure Cosmos DB change feed](/azure/cosmos-db/change-feed) and exposes change feed items as JSON-serializable types. As a result, SDK types aren't supported for this trigger.
