---
title: Azure Cosmos DB for MongoDB (vCore) Input Binding for Azure Functions
description: Understand how to use Azure Cosmos DB for MongoDB (vCore) input binding to read items from the database.
author: sajeetharan
ms.author: sasinnat
ms.topic: reference
ms.date: 5/8/2025
ms.custom: 
  - build-2025
---

# Azure Cosmos DB for MongoDB (vCore) input binding for Azure Functions

This article explains how to work with the [Azure Cosmos DB for MongoDB vCore](/azure/cosmos-db/mongodb/vcore/introduction) input binding in Azure Functions. 

The Azure Cosmos DB for MongoDB (vCore) input binding lets you retrieve one or more items as documents from the database.

[!INCLUDE [functions-bindings-mongodb-vcore-preview](../../includes/functions-bindings-mongodb-vcore-preview.md)]

## Example

This example shows a Timer trigger function that uses an input binding to execute a periodic query against the database:

```csharp
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Sample
{
    public static class Sample
    {
         [FunctionName("InputBindingSample")]
          public static async Task InputBindingRun(
            [TimerTrigger("*/5 * * * * *")] TimerInfo myTimer,
            [CosmosDBMongo("%vCoreDatabaseTrigger%", "%vCoreCollectionTrigger%", ConnectionStringSetting = "vCoreConnectionStringTrigger",
            QueryString = "%queryString%")] List<BsonDocument> docs,
            ILogger log)
          {
            log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");

            foreach (var doc in docs)
            {
                log.LogInformation(doc.ToString());
            }
          }
           
    }
}
```

The examples refer to a simple `TestClass` type:

```cs
namespace Sample
{
    public class TestClass
    {
        public string id { get; set; }
        public string SomeData { get; set; }
    }
}
```

## Attributes

This table describes the binding configuration properties of the `CosmosDBMongoTrigger` attribute.

|Parameter | Description|
|---------|----------------------|
|**FunctionId** | (Optional) The ID of the trigger function. |
|**DatabaseName** | The name of the database being monitored by the trigger for changes. |
|**CollectionName** | The name of the collection in the database being monitored by the trigger for changes.|
|**ConnectionStringSetting** | The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account being monitored. |
|**QueryString** | Defines the Mongo query expression used by the input binding return documents from the database. The query supports binding parameters. |

## Usage

You can use the `CosmosDBMongo` attribute to obtain and work directly with the [MongoDB client](https://mongodb.github.io/mongo-csharp-driver/2.8/apidocs/html/T_MongoDB_Driver_IMongoClient.htm) in your function code:

:::code language="csharp" source="~/azure-functions-mongodb-extension/Sample/Sample.cs" range="17-29" ::: 

## Related articles
 
- [Azure Cosmos DB for MongoDB (vCore)](/azure/cosmos-db/mongodb/vcore/introduction)
- [Azure Cosmos DB for MongoDB (vCore) bindings for Azure Functions](functions-bindings-mongodb-vcore.md)
- [Azure Cosmos DB for MongoDB (vCore) trigger for Azure Functions](functions-bindings-mongodb-vcore-trigger.md)
- [Azure Cosmos DB for MongoDB(vCore) output binding for Azure Functions](functions-bindings-mongodb-vcore-output.md)
