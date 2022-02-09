---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/08/2022
ms.author: glenga
---
|Attribute property | Description|
|---------|----------------------|
|**Connection** | The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account being queried. For more information, see [Connections](#connections).|
|**DatabaseName**  | The name of the Azure Cosmos DB database with the container being monitored. |
|**ContainerName** | The name of the container being monitored. |
|**PartitionKey**| Specifies the partition key value for the lookup. May include binding parameters. It is required for lookups in [partitioned](../articles/cosmos-db/partitioning-overview.md#logical-partitions) containers.|
|**Id**    | The ID of the document to retrieve. This property supports [binding expressions](../articles/azure-functions/functions-bindings-expressions-patterns.md). Don't set both the `Id` and `SqlQuery` properties. If you don't set either one, the entire container is retrieved. |
|**SqlQuery**  | An Azure Cosmos DB SQL query used for retrieving multiple documents. The property supports runtime bindings, as in this example: `SELECT * FROM c where c.departmentId = {departmentId}`. Don't set both the `Id` and `SqlQuery` properties. If you don't set either one, the entire container is retrieved.|
|**PreferredLocations**| (Optional) Defines preferred locations (regions) for geo-replicated database accounts in the Azure Cosmos DB service. Values should be comma-separated. For example, `East US,South Central US,North Europe`. |