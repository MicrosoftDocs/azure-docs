---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/01/2022
ms.author: glenga
---
|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `cosmosDBTrigger`. |
|**direction** | Must be set to `in`. This parameter is set automatically when you create the trigger in the Azure portal. |
|**name** | The variable name used in function code that represents the list of documents with changes. |
|**connectionStringSetting** | The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account being monitored. For more information, see [Connections](#connections).|
|**databaseName**  | The name of the Azure Cosmos DB database with the collection being monitored. |
|**collectionName** | The name of the collection being monitored. |
|**leaseConnectionStringSetting** | (Optional) The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account that holds the lease collection. <br><br> When not set, the `connectionStringSetting` value is used. This parameter is automatically set when the binding is created in the portal. The connection string for the leases collection must have write permissions.|
|**leaseDatabaseName** | (Optional) The name of the database that holds the collection used to store leases. When not set, the value of the `databaseName` setting is used. |
|**leaseCollectionName** | (Optional) The name of the collection used to store leases. When not set, the value `leases` is used. |
|**createLeaseCollectionIfNotExists** | (Optional) When set to `true`, the leases collection is automatically created when it doesn't already exist. The default value is `false`. |
|**leasesCollectionThroughput** | (Optional) Defines the number of Request Units to assign when the leases collection is created. This setting is only used when `createLeaseCollectionIfNotExists` is set to `true`. This parameter is automatically set when the binding is created using the portal. |
|**leaseCollectionPrefix** | (Optional) When set, the value is added as a prefix to the leases created in the Lease collection for this function. Using a prefix allows two separate Azure Functions to share the same Lease collection by using different prefixes. |
|**feedPollDelay**| (Optional) The time (in milliseconds) for the delay between polling a partition for new changes on the feed, after all current changes are drained. Default is 5,000 milliseconds, or 5 seconds.|
|**leaseAcquireInterval**| (Optional) When set, it defines, in milliseconds, the interval to kick off a task to compute if partitions are distributed evenly among known host instances. Default is 13000 (13 seconds). |
|**leaseExpirationInterval**| (Optional) When set, it defines, in milliseconds, the interval for which the lease is taken on a lease representing a partition. If the lease is not renewed within this interval, it will cause it to expire and ownership of the partition will move to another instance. Default is 60000 (60 seconds).|
|**leaseRenewInterval**| (Optional) When set, it defines, in milliseconds, the renew interval for all leases for partitions currently held by an instance. Default is 17000 (17 seconds). |
|**checkpointInterval**| (Optional) When set, it defines, in milliseconds, the interval between lease checkpoints. Default is always after each Function call. |
| **checkpointDocumentCount** | (Optional) Customizes the amount of documents between lease checkpoints. Default is after every function call. |
|**maxItemsPerInvocation**| (Optional) When set, this property sets the maximum number of items received per Function call. If operations in the monitored collection are performed through stored procedures, [transaction scope](../articles/cosmos-db/stored-procedures-triggers-udfs.md#transactions) is preserved when reading items from the change feed. As a result, the number of items received could be higher than the specified value so that the items changed by the same transaction are returned as part of one atomic batch. |
|**startFromBeginning**| (Optional) This option tells the Trigger to read changes from the beginning of the collection's change history instead of starting at the current time. Reading from the beginning only works the first time the trigger starts, as in subsequent runs, the checkpoints are already stored. Setting this option to `true` when there are leases already created has no effect. |
|**preferredLocations**| (Optional) Defines preferred locations (regions) for geo-replicated database accounts in the Azure Cosmos DB service. Values should be comma-separated. For example, "East US,South Central US,North Europe". |
| **useMultipleWriteLocations** | (Optional) Enables multi-region accounts for writing to the leases collection. |