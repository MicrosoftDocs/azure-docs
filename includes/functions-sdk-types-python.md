---
author: glenga
ms.service: azure-functions
ms.topic: include
ms.date: 12/15/2025
ms.author: glenga
---

| Extension | Types | Support level | Samples |
| --- | --- | --- | --- |
| [Azure Blob Storage](../articles/azure-functions/functions-bindings-storage-blob.md) | `BlobClient`<br/>`ContainerClient`<br/>`StorageStreamDownloader` | Trigger: GA<br/>Input: GA | [Quickstart](https://github.com/Azure-Samples/azure-functions-blob-sdk-bindings-python)<br/>[`BlobClient`](https://github.com/Azure/azure-functions-python-extensions/blob/dev/azurefunctions-extensions-bindings-blob/samples/blob_samples_blobclient/function_app.py)<br/>[`ContainerClient`](https://github.com/Azure/azure-functions-python-extensions/blob/dev/azurefunctions-extensions-bindings-blob/samples/blob_samples_containerclient/function_app.py)<br/>[`StorageStreamDownloader`](https://github.com/Azure/azure-functions-python-extensions/blob/dev/azurefunctions-extensions-bindings-blob/samples/blob_samples_storagestreamdownloader/function_app.py) |
| [Azure Cosmos DB](../articles/azure-functions/functions-bindings-cosmosdb-v2.md) | `CosmosClient`<br/>`DatabaseProxy`<br/>`ContainerProxy` | Input: preview | [Quickstart](https://github.com/Azure-Samples/azure-functions-cosmosdb-sdk-bindings-python)<br/> [`ContainerProxy`](https://github.com/Azure/azure-functions-python-extensions/blob/dev/azurefunctions-extensions-bindings-cosmosdb/samples/cosmosdb_samples_containerproxy/function_app.py)<br/>[`CosmosClient`](https://github.com/Azure/azure-functions-python-extensions/tree/dev/azurefunctions-extensions-bindings-cosmosdb/samples/cosmosdb_samples_cosmosclient/function_app.py)<br/>[`DatabaseProxy`](https://github.com/Azure/azure-functions-python-extensions/tree/dev/azurefunctions-extensions-bindings-cosmosdb/samples/cosmosdb_samples_databaseproxy/function_app.py) |
| [Azure Event Hubs](../articles/azure-functions/functions-bindings-event-hubs.md) | `EventData` | Trigger: preview | [Quickstart](https://github.com/Azure-Samples/azure-functions-eventhub-sdk-bindings-python)<br/> [`EventData`](https://github.com/Azure/azure-functions-python-extensions/blob/dev/azurefunctions-extensions-bindings-eventhub/samples/eventhub_samples_eventdata/function_app.py) |
| [Azure Service Bus](../articles/azure-functions/functions-bindings-service-bus.md) | `ServiceBusReceivedMessage` | Trigger: preview | [Quickstart](https://github.com/Azure/azure-functions-python-extensions/blob/dev/azurefunctions-extensions-bindings-servicebus/samples/README.md)<br/> [`ServiceBusReceivedMessage`](https://github.com/Azure/azure-functions-python-extensions/blob/dev/azurefunctions-extensions-bindings-servicebus/samples/servicebus_samples_single/function_app.py) |

Considerations for SDK types:

+ For output scenarios where you might use an SDK type, create and work with SDK clients directly instead of using an output binding.
+ The Azure Cosmos DB trigger uses the [Azure Cosmos DB change feed](/azure/cosmos-db/change-feed) and exposes change feed items as JSON-serializable types. As a result, SDK types aren't supported for this trigger.
