---
title: Azure DocumentDB Trigger
titleSuffix: Azure Functions
description: Learn how to use the Azure DocumentDB trigger in Azure Functions to monitor change streams for inserts and updates. Includes code examples and configuration guidance.
author: sajeetharan
ms.author: sasinnat
ms.topic: reference
ms.date: 11/19/2025
ms.custom:
  - sfi-ropc-nochange
---

# Azure DocumentDB trigger for Azure Functions

[!INCLUDE [functions-bindings-documentdb-preview](../../includes/functions-bindings-documentdb-preview.md)]

The [Azure DocumentDB](/azure/documentdb/overview) trigger monitors change streams for inserts and updates in your DocumentDB collections. This article explains how to configure and use the trigger in Azure Functions, including code examples and attribute parameters to help you respond to data changes in real-time.

The feed publishes only new and updated items. Watching for delete operations using change streams is currently not supported.

## Prerequisites

- An Azure subscription

  - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)

- An existing Azure DocumentDB cluster

  - If you don't have a cluster, create a [new cluster](/azure/documentdb/quickstart-portal)

  - [Change stream feature](/azure/documentdb/change-streams) enabled

- Azure Functions .NET 8.0 project using the legacy in-process worker model

- [`Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo` NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo)

- [`MongoDB.Driver` NuGet package](https://www.nuget.org/packages/MongoDB.Driver)

## Examples

This example shows a function triggered by an insert or replacement operation on a collection in Azure DocumentDB. The function logs the body of the changed document.

```csharp
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo;
using MongoDB.Bson;
using MongoDB.Driver;

public static class DocumentDBTrigger
{
    [FunctionName(nameof(DocumentDBTrigger))]
    public static void Run(
        [CosmosDBMongoTrigger(databaseName: "<database-name>",
                        collectionName: "<collection-name>",
                        ConnectionStringSetting = "AZURE_DOCUMENTDB_CONNECTION_STRING")]
        ChangeStreamDocument<BsonDocument> change,
        ILogger logger)
    {
        logger.LogInformation("C# Azure DocumentDB trigger function processed a change.");

        logger.LogInformation($"{change.FullDocument}");
    }
}
```

## Attributes

This table describes the binding configuration properties of the `CosmosDBMongoTrigger` attribute.

| Parameter | Description |
| --- | --- |
| **`FunctionId`** | (Optional) The ID of the trigger function. |
| **`DatabaseName`** | The name of the database monitored by the trigger for changes. A valid value is required unless `TriggerLevel` is set to `MonitorLevel.Cluster`. Otherwise, an empty string can be supplied. |
| **`CollectionName`** | The name of the collection in the database monitored by the trigger for changes. A valid value is required unless `TriggerLevel` is set to `MonitorLevel.Database` or `MonitorLevel.Cluster`. Otherwise, an empty string can be supplied. |
| **`ConnectionStringSetting`** | The name of an app setting or setting collection that specifies how to connect to the Azure DocumentDB cluster. |
| **`TriggerLevel`** | Indicates the level at which changes are monitored. Valid values of `MonitorLevel` are: `Collection`, `Database`, and `Cluster`. |

## Usage

Use the `TriggerLevel` parameter to set the scope of changes being monitored.

```csharp
[FunctionName(nameof(DocumentDBTrigger))]
public static void Run(
    [CosmosDBMongoTrigger(databaseName: "",
                    collectionName: "",
                    ConnectionStringSetting = "<name-of-app-setting>",
                    TriggerLevel = MonitorLevel.Cluster)]
    ChangeStreamDocument<BsonDocument> change,
    ILogger logger)
{
    logger.LogInformation("C# Azure DocumentDB trigger function processed a change.");

    logger.LogInformation($"{change.FullDocument}");
}
```

## Related articles
 
- [Azure DocumentDB](/azure/documentdb/overview)
- [Azure DocumentDB bindings for Azure Functions](functions-bindings-documentdb.md)
- [Azure DocumentDB input binding for Azure Functions](functions-bindings-documentdb-input.md)
- [Azure DocumentDB output binding for Azure Functions](functions-bindings-documentdb-output.md)
