---
author: glenga
ms.service: azure-functions
ms.topic: include
ms.date: 12/16/2025
ms.author: glenga
---

| Extension | Types| Support level |
| --- | --- | --- |
| [Azure Blob Storage][blob-sdk-types] | `BlobClient`<br/>`BlobContainerClient`<br/>`BlockBlobClient`<br/>`PageBlobClient`<br/>`AppendBlobClient` | Trigger: GA<br/>Input: GA |
| [Azure Cosmos DB][cosmos-sdk-types] | `CosmosClient`<br/>`Database`<br/>`Container` | Input: GA |
| [Azure Event Grid][eventgrid-sdk-types] | `CloudEvent`<br/>`EventGridEvent` | Trigger: GA |
| [Azure Event Hubs][eventhub-sdk-types] | `EventData`<br/>`EventHubProducerClient` | Trigger: GA |
| [Azure Queue Storage][queue-sdk-types] | `QueueClient`<br/>`QueueMessage` | Trigger: GA |
| [Azure Service Bus][servicebus-sdk-types] | `ServiceBusClient`<br/>`ServiceBusReceiver`<br/>`ServiceBusSender`<br/>`ServiceBusMessage` | Trigger: GA |
| [Azure Table Storage][tables-sdk-types] | `TableClient`<br/>`TableEntity` | Input: GA |

Considerations for SDK types:

+ When using [binding expressions](../articles/azure-functions/functions-bindings-expressions-patterns.md) that rely on trigger data, SDK types for the trigger itself cannot be used.
+ For output scenarios where you might use an SDK type, create and work with SDK clients directly instead of using an output binding.
+ The Azure Cosmos DB trigger uses the [Azure Cosmos DB change feed](/azure/cosmos-db/change-feed) and exposes change feed items as JSON-serializable types. As a result, SDK types aren't supported for this trigger.

[blob-sdk-types]: ../articles/azure-functions/functions-bindings-storage-blob.md?tabs=isolated-process%2Cextensionv5&pivots=programming-language-csharp#binding-types
[cosmos-sdk-types]: ../articles/azure-functions/functions-bindings-cosmosdb-v2.md?tabs=isolated-process%2Cextensionv4&pivots=programming-language-csharp#binding-types
[tables-sdk-types]: ../articles/azure-functions/functions-bindings-storage-table.md?tabs=isolated-process%2Ctable-api&pivots=programming-language-csharp#binding-types
[eventgrid-sdk-types]: ../articles/azure-functions/functions-bindings-event-grid.md?tabs=isolated-process%2Cextensionv3&pivots=programming-language-csharp#binding-types
[queue-sdk-types]: ../articles/azure-functions/functions-bindings-storage-queue.md?tabs=isolated-process%2Cextensionv5&pivots=programming-language-csharp#binding-types
[eventhub-sdk-types]: ../articles/azure-functions/functions-bindings-event-hubs.md?tabs=isolated-process%2Cextensionv5&pivots=programming-language-csharp#binding-types
[servicebus-sdk-types]: ../articles/azure-functions/functions-bindings-service-bus.md?tabs=isolated-process%2Cextensionv5&pivots=programming-language-csharp#binding-types