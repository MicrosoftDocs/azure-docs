---
title: Azure Cosmos DB for MongoDB (vCore) Output Binding for Azure Functions
description: Understand how to use Azure Cosmos DB for MongoDB (vCore) output to write new items to the database.
author: sajeetharan
ms.author: sasinnat
ms.topic: reference
ms.date: 5/8/2025
ms.custom: 
  - build-2025
---

# Azure Cosmos DB for MongoDB (vCore) output binding for Azure Functions

This article explains how to work with the [Azure Cosmos DB for MongoDB vCore](/azure/cosmos-db/mongodb/vcore/introduction) output binding in Azure Functions. 

The Azure Cosmos DB for MongoDB (vCore) output binding lets you write a new document to an Azure Cosmos DB for MongoDB(vCore) collection.

[!INCLUDE [functions-bindings-mongodb-vcore-preview](../../includes/functions-bindings-mongodb-vcore-preview.md)]

## Example

This example shows a Timer trigger function that uses `CosmosDBMongoCollector` to add an item to the database:

```csharp
[FunctionName("OutputBindingSample")]
    public static async Task OutputBindingRun(
    [TimerTrigger("*/5 * * * * *")] TimerInfo myTimer,
    [CosmosDBMongo("%vCoreDatabaseBinding%", "%vCoreCollectionBinding%", ConnectionStringSetting = "vCoreConnectionStringBinding")] IAsyncCollector<TestClass> CosmosDBMongoCollector,
    ILogger log)
{
    log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");

    TestClass item = new TestClass()
    {
        id = Guid.NewGuid().ToString(),
        SomeData = "some random data"
    };
    await CosmosDBMongoCollector.AddAsync(item);
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
|**CreateIfNotExists** | (Optional) When set to true, creates the targeted database and collection when they don't already exist. |

## Usage

You can use the `CosmosDBMongo` attribute to obtain and work directly with the [MongoDB client](https://mongodb.github.io/mongo-csharp-driver/2.8/apidocs/html/T_MongoDB_Driver_IMongoClient.htm) in your function code:

:::code language="csharp" source="~/azure-functions-mongodb-extension/Sample/Sample.cs" range="17-29" ::: 

## Related articles
 
- [Azure Cosmos DB for MongoDB (vCore)](/azure/cosmos-db/mongodb/vcore/introduction)
- [Azure Cosmos DB for MongoDB (vCore) bindings for Azure Functions](functions-bindings-mongodb-vcore.md)
- [Azure Cosmos DB for MongoDB (vCore) trigger for Azure Functions](functions-bindings-mongodb-vcore-trigger.md)
- [Azure Cosmos DB for MongoDB (vCore) input binding for Azure Functions](functions-bindings-mongodb-vcore-input.md)
