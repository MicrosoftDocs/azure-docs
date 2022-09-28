---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/08/2022
ms.author: glenga
---
|function.json property | Description|
|---------|----------------------|
|**connectionStringSetting** | The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account being monitored. For more information, see [Connections](#connections).|
|**databaseName**  | The name of the Azure Cosmos DB database with the container being monitored. |
|**containerName** | The name of the container being monitored. |
|**createIfNotExists**  | A boolean value to indicate whether the container is created when it doesn't exist. The default is *false* because new containers are created with reserved throughput, which has cost implications. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/).  |
|**partitionKey**| When `createIfNotExists` is true, it defines the partition key path for the created container. May include binding parameters.|
|**containerThroughput** | When `createIfNotExists` is true, it defines the [throughput](../articles/cosmos-db/set-throughput.md) of the created container. |
|**preferredLocations**| (Optional) Defines preferred locations (regions) for geo-replicated database accounts in the Azure Cosmos DB service. Values should be comma-separated. For example, `East US,South Central US,North Europe`. |
|**useMultipleWriteLocations**| (Optional) When set to `true` along with `preferredLocations`, supports [multi-region writes](../articles/cosmos-db/how-to-manage-database-account.md#configure-multiple-write-regions) in the Azure Cosmos DB service. |