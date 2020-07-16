---
title: Azure Cosmos DB trigger for Functions 2.x and higher
description: Learn to use the Azure Cosmos DB trigger in Azure Functions.
author: craigshoemaker
ms.topic: reference
ms.date: 02/24/2020
ms.author: cshoe
ms.custom: tracking-python
---

# Azure Cosmos DB trigger for Azure Functions 2.x and higher

The Azure Cosmos DB Trigger uses the [Azure Cosmos DB Change Feed](../cosmos-db/change-feed.md) to listen for inserts and updates across partitions. The change feed publishes inserts and updates, not deletions.

For information on setup and configuration details, see the [overview](./functions-bindings-cosmosdb-v2.md).

<a id="example" name="example"></a>

# [C#](#tab/csharp)

The following example shows a [C# function](functions-dotnet-class-library.md) that is invoked when there are inserts or updates in the specified database and collection.

```cs
using Microsoft.Azure.Documents;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;

namespace CosmosDBSamplesV2
{
    public static class CosmosTrigger
    {
        [FunctionName("CosmosTrigger")]
        public static void Run([CosmosDBTrigger(
            databaseName: "ToDoItems",
            collectionName: "Items",
            ConnectionStringSetting = "CosmosDBConnection",
            LeaseCollectionName = "leases",
            CreateLeaseCollectionIfNotExists = true)]IReadOnlyList<Document> documents,
            ILogger log)
        {
            if (documents != null && documents.Count > 0)
            {
                log.LogInformation($"Documents modified: {documents.Count}");
                log.LogInformation($"First document Id: {documents[0].Id}");
            }
        }
    }
}
```

# [C# Script](#tab/csharp-script)

The following example shows a Cosmos DB trigger binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function writes log messages when Cosmos DB records are added or modified.

Here's the binding data in the *function.json* file:

```json
{
    "type": "cosmosDBTrigger",
    "name": "documents",
    "direction": "in",
    "leaseCollectionName": "leases",
    "connectionStringSetting": "<connection-app-setting>",
    "databaseName": "Tasks",
    "collectionName": "Items",
    "createLeaseCollectionIfNotExists": true
}
```

Here's the C# script code:

```cs
    #r "Microsoft.Azure.DocumentDB.Core"

    using System;
    using Microsoft.Azure.Documents;
    using System.Collections.Generic;
    using Microsoft.Extensions.Logging;

    public static void Run(IReadOnlyList<Document> documents, ILogger log)
    {
      log.LogInformation("Documents modified " + documents.Count);
      log.LogInformation("First document Id " + documents[0].Id);
    }
```

# [JavaScript](#tab/javascript)

The following example shows a Cosmos DB trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function writes log messages when Cosmos DB records are added or modified.

Here's the binding data in the *function.json* file:

```json
{
    "type": "cosmosDBTrigger",
    "name": "documents",
    "direction": "in",
    "leaseCollectionName": "leases",
    "connectionStringSetting": "<connection-app-setting>",
    "databaseName": "Tasks",
    "collectionName": "Items",
    "createLeaseCollectionIfNotExists": true
}
```

Here's the JavaScript code:

```javascript
    module.exports = function (context, documents) {
      context.log('First document Id modified : ', documents[0].id);

      context.done();
    }
```

# [Python](#tab/python)

The following example shows a Cosmos DB trigger binding in a *function.json* file and a [Python function](functions-reference-python.md) that uses the binding. The function writes log messages when Cosmos DB records are modified.

Here's the binding data in the *function.json* file:

```json
{
    "name": "documents",
    "type": "cosmosDBTrigger",
    "direction": "in",
    "leaseCollectionName": "leases",
    "connectionStringSetting": "<connection-app-setting>",
    "databaseName": "Tasks",
    "collectionName": "Items",
    "createLeaseCollectionIfNotExists": true
}
```

Here's the Python code:

```python
    import logging
    import azure.functions as func


    def main(documents: func.DocumentList) -> str:
        if documents:
            logging.info('First document Id modified: %s', documents[0]['id'])
```

# [Java](#tab/java)

This function is invoked when there are inserts or updates in the specified database and collection.

```java
    @FunctionName("cosmosDBMonitor")
    public void cosmosDbProcessor(
        @CosmosDBTrigger(name = "items",
            databaseName = "ToDoList",
            collectionName = "Items",
            leaseCollectionName = "leases",
            createLeaseCollectionIfNotExists = true,
            connectionStringSetting = "AzureCosmosDBConnection") String[] items,
            final ExecutionContext context ) {
                context.getLogger().info(items.length + "item(s) is/are changed.");
            }
```


In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@CosmosDBTrigger` annotation on parameters whose value would come from Cosmos DB.  This annotation can be used with native Java types, POJOs, or nullable values using `Optional<T>`.

---

## Attributes and annotations

# [C#](#tab/csharp)

In [C# class libraries](functions-dotnet-class-library.md), use the [CosmosDBTrigger](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.CosmosDB/Trigger/CosmosDBTriggerAttribute.cs) attribute.

The attribute's constructor takes the database name and collection name. For information about those settings and other properties that you can configure, see [Trigger - configuration](#configuration). Here's a `CosmosDBTrigger` attribute example in a method signature:

```csharp
    [FunctionName("DocumentUpdates")]
    public static void Run(
        [CosmosDBTrigger("database", "collection", ConnectionStringSetting = "myCosmosDB")]
    IReadOnlyList<Document> documents,
        ILogger log)
    {
        ...
    }
```

For a complete example, see [Trigger](#example).

# [C# Script](#tab/csharp-script)

Attributes are not supported by C# Script.

# [JavaScript](#tab/javascript)

Attributes are not supported by JavaScript.

# [Python](#tab/python)

Attributes are not supported by Python.

# [Java](#tab/java)

From the [Java functions runtime library](https://docs.microsoft.com/java/api/overview/azure/functions/runtime), use the `@CosmosDBInput` annotation on parameters that read data from Cosmos DB.

---

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `CosmosDBTrigger` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to `cosmosDBTrigger`. |
|**direction** | n/a | Must be set to `in`. This parameter is set automatically when you create the trigger in the Azure portal. |
|**name** | n/a | The variable name used in function code that represents the list of documents with changes. |
|**connectionStringSetting**|**ConnectionStringSetting** | The name of an app setting that contains the connection string used to connect to the Azure Cosmos DB account being monitored. |
|**databaseName**|**DatabaseName**  | The name of the Azure Cosmos DB database with the collection being monitored. |
|**collectionName** |**CollectionName** | The name of the collection being monitored. |
|**leaseConnectionStringSetting** | **LeaseConnectionStringSetting** | (Optional) The name of an app setting that contains the connection string to the Azure Cosmos DB account that holds the lease collection. When not set, the `connectionStringSetting` value is used. This parameter is automatically set when the binding is created in the portal. The connection string for the leases collection must have write permissions.|
|**leaseDatabaseName** |**LeaseDatabaseName** | (Optional) The name of the database that holds the collection used to store leases. When not set, the value of the `databaseName` setting is used. This parameter is automatically set when the binding is created in the portal. |
|**leaseCollectionName** | **LeaseCollectionName** | (Optional) The name of the collection used to store leases. When not set, the value `leases` is used. |
|**createLeaseCollectionIfNotExists** | **CreateLeaseCollectionIfNotExists** | (Optional) When set to `true`, the leases collection is automatically created when it doesn't already exist. The default value is `false`. |
|**leasesCollectionThroughput**| **LeasesCollectionThroughput**| (Optional) Defines the number of Request Units to assign when the leases collection is created. This setting is only used when `createLeaseCollectionIfNotExists` is set to `true`. This parameter is  automatically set when the binding is created using the portal.
|**leaseCollectionPrefix**| **LeaseCollectionPrefix**| (Optional) When set, the value is added as a prefix to the leases created in the Lease collection for this Function. Using a prefix allows two separate Azure Functions to share the same Lease collection by using different prefixes.
|**feedPollDelay**| **FeedPollDelay**| (Optional) The time (in milliseconds) for the delay between polling a partition for new changes on the feed, after all current changes are drained. Default is 5,000 milliseconds, or 5 seconds.
|**leaseAcquireInterval**| **LeaseAcquireInterval**| (Optional) When set, it defines, in milliseconds, the interval to kick off a task to compute if partitions are distributed evenly among known host instances. Default is 13000 (13 seconds).
|**leaseExpirationInterval**| **LeaseExpirationInterval**| (Optional) When set, it defines, in milliseconds, the interval for which the lease is taken on a lease representing a partition. If the lease is not renewed within this interval, it will cause it to expire and ownership of the partition will move to another instance. Default is 60000 (60 seconds).
|**leaseRenewInterval**| **LeaseRenewInterval**| (Optional) When set, it defines, in milliseconds, the renew interval for all leases for partitions currently held by an instance. Default is 17000 (17 seconds).
|**checkpointFrequency**| **CheckpointFrequency**| (Optional) When set, it defines, in milliseconds, the interval between lease checkpoints. Default is always after each Function call.
|**maxItemsPerInvocation**| **MaxItemsPerInvocation**| (Optional) When set, this property sets the maximum number of items received per Function call. If operations in the monitored collection are performed through stored procedures, [transaction scope](../cosmos-db/stored-procedures-triggers-udfs.md#transactions) is preserved when reading items from the Change Feed. As a result, the number of items received could be higher than the specified value so that the items changed by the same transaction are returned as part of one atomic batch.
|**startFromBeginning**| **StartFromBeginning**| (Optional) This option tells the Trigger to read changes from the beginning of the collection's change history instead of starting at the current time. Reading from the beginning only works the first time the Trigger starts, as in subsequent runs, the checkpoints are already stored. Setting this option to `true` when there are leases already created has no effect. |
|**preferredLocations**| **PreferredLocations**| (Optional) Defines preferred locations (regions) for geo-replicated database accounts in the Azure Cosmos DB service. Values should be comma-separated. For example, "East US,South Central US,North Europe". |

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Usage

The trigger requires a second collection that it uses to store _leases_ over the partitions. Both the collection being monitored and the collection that contains the leases must be available for the trigger to work.

>[!IMPORTANT]
> If multiple functions are configured to use a Cosmos DB trigger for the same collection, each of the functions should use a dedicated lease collection or specify a different `LeaseCollectionPrefix` for each function. Otherwise, only one of the functions will be triggered. For information about the prefix, see the [Configuration section](#configuration).

The trigger doesn't indicate whether a document was updated or inserted, it just provides the document itself. If you need to handle updates and inserts differently, you could do that by implementing timestamp fields for insertion or update.

## Next steps

- [Read an Azure Cosmos DB document (Input binding)](./functions-bindings-cosmosdb-v2-input.md)
- [Save changes to an Azure Cosmos DB document (Output binding)](./functions-bindings-cosmosdb-v2-output.md)
