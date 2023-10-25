---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 11/04/2022
ms.author: glenga
---
|function.json property | Description|
|---------|----------------------|
|**connection** | The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account being monitored. For more information, see [Connections](../articles/azure-functions/functions-bindings-cosmosdb-v2-output.md#connections).|
|**databaseName**  | The name of the Azure Cosmos DB database with the container being monitored. |
|**containerName** | The name of the container being monitored. |
|**createIfNotExists**  | A boolean value to indicate whether the container is created when it doesn't exist. The default is *false* because new containers are created with reserved throughput, which has cost implications. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/).  |
|**partitionKey**| When `createIfNotExists` is true, it defines the partition key path for the created container. May include binding parameters.|
|**containerThroughput** | When `createIfNotExists` is true, it defines the [throughput](../articles/cosmos-db/set-throughput.md) of the created container. |
|**preferredLocations**| (Optional) Defines preferred locations (regions) for geo-replicated database accounts in the Azure Cosmos DB service. Values should be comma-separated. For example, `East US,South Central US,North Europe`. |