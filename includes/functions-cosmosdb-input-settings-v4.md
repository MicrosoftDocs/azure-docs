---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/08/2022
ms.author: glenga
---
|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `cosmosDB`. |
|**direction** | Must be set to `in`. |
|**name** | The variable name used in function code that represents the list of documents with changes. |
|**connection** | The name of an app setting or setting container that specifies how to connect to the Azure Cosmos DB account being monitored. For more information, see [Connections](../articles/azure-functions/functions-bindings-cosmosdb-v2-input.md#connections).|
|**databaseName**  | The name of the Azure Cosmos DB database with the container being monitored. |
|**containerName** | The name of the container being monitored. |
|**partitionKey**| Specifies the partition key value for the lookup. May include binding parameters. It is required for lookups in [partitioned](../articles/cosmos-db/partitioning-overview.md#logical-partitions) containers.|
|**id**    | The ID of the document to retrieve. This property supports [binding expressions](../articles/azure-functions/functions-bindings-expressions-patterns.md). Don't set both the `id` and `sqlQuery` properties. If you don't set either one, the entire container is retrieved. |
|**sqlQuery**  | An Azure Cosmos DB SQL query used for retrieving multiple documents. The property supports runtime bindings, as in this example: `SELECT * FROM c where c.departmentId = {departmentId}`. Don't set both the `id` and `sqlQuery` properties. If you don't set either one, the entire container is retrieved.|
|**preferredLocations**| (Optional) Defines preferred locations (regions) for geo-replicated database accounts in the Azure Cosmos DB service. Values should be comma-separated. For example, `East US,South Central US,North Europe`. |
