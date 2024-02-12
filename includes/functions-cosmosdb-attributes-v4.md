---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 04/14/2022
ms.author: glenga
---
|Attribute property | Description|
|---------|----------------------|
|**Connection** | The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account being monitored. For more information, see [Connections](#connections).|
|**DatabaseName**  | The name of the Azure Cosmos DB database with the container being monitored. |
|**ContainerName** | The name of the container being monitored. |
|**LeaseConnection** | (Optional) The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account that holds the lease container. <br><br> When not set, the `Connection` value is used. This parameter is automatically set when the binding is created in the portal. The connection string for the leases container must have write permissions.|
|**LeaseDatabaseName** | (Optional) The name of the database that holds the container used to store leases. When not set, the value of the `databaseName` setting is used. |
|**LeaseContainerName** | (Optional) The name of the container used to store leases. When not set, the value `leases` is used. |
|**CreateLeaseContainerIfNotExists** | (Optional) When set to `true`, the leases container is automatically created when it doesn't already exist. The default value is `false`. When using Microsoft Entra identities if you set the value to `true`, creating containers is not [an allowed operation](../articles/cosmos-db/sql/troubleshoot-forbidden.md#non-data-operations-are-not-allowed) and your Function won't be able to start.|
|**LeasesContainerThroughput** | (Optional) Defines the number of Request Units to assign when the leases container is created. This setting is only used when `CreateLeaseContainerIfNotExists` is set to `true`. This parameter is automatically set when the binding is created using the portal. |
|**LeaseContainerPrefix** | (Optional) When set, the value is added as a prefix to the leases created in the Lease container for this function. Using a prefix allows two separate Azure Functions to share the same Lease container by using different prefixes. |
|**FeedPollDelay**| (Optional) The time (in milliseconds) for the delay between polling a partition for new changes on the feed, after all current changes are drained. Default is 5,000 milliseconds, or 5 seconds.|
|**LeaseAcquireInterval**| (Optional) When set, it defines, in milliseconds, the interval to kick off a task to compute if partitions are distributed evenly among known host instances. Default is 13000 (13 seconds). |
|**LeaseExpirationInterval**| (Optional) When set, it defines, in milliseconds, the interval for which the lease is taken on a lease representing a partition. If the lease is not renewed within this interval, it will cause it to expire and ownership of the partition will move to another instance. Default is 60000 (60 seconds).|
|**LeaseRenewInterval**| (Optional) When set, it defines, in milliseconds, the renew interval for all leases for partitions currently held by an instance. Default is 17000 (17 seconds). |
|**MaxItemsPerInvocation**| (Optional) When set, this property sets the maximum number of items received per Function call. If operations in the monitored container are performed through stored procedures, [transaction scope](../articles/cosmos-db/stored-procedures-triggers-udfs.md#transactions) is preserved when reading items from the change feed. As a result, the number of items received could be higher than the specified value so that the items changed by the same transaction are returned as part of one atomic batch. |
|**StartFromBeginning**| (Optional) This option tells the Trigger to read changes from the beginning of the container's change history instead of starting at the current time. Reading from the beginning only works the first time the trigger starts, as in subsequent runs, the checkpoints are already stored. Setting this option to `true` when there are leases already created has no effect. |
| **StartFromTime** | (Optional) Gets or sets the date and time from which to initialize the change feed read operation. The recommended format is ISO 8601 with the UTC designator, such as `2021-02-16T14:19:29Z`. This is only used to set the initial trigger state. After the trigger has a lease state, changing this value has no effect. |
|**PreferredLocations**| (Optional) Defines preferred locations (regions) for geo-replicated database accounts in the Azure Cosmos DB service. Values should be comma-separated. For example, "East US,South Central US,North Europe". |
