---
title: Azure CosmosDB for MongoDB(vCore) Trigger for Azure Functions
description: Understand how to use Azure Cosmos DB for MongoDB(vCore) triggers and bindings in Azure Functions.
author: sajeetharan
ms.author: sasinnat
ms.topic: reference
ms.date: 08/05/2025
ms.custom: 
  - build-2025
---

# Azure Cosmos DB for MongoDB(vCore) bindings for Azure Functions

This article explains how to work with [Azure Cosmos DB for MongoDB vCore](/azure/cosmos-db/mongodb/vcore/introduction) bindings in Azure Functions. Azure Functions supports trigger, input, and output bindings for Azure Cosmos DB for MongoDB(vCore)


* The Azure Cosmos DB for MongoDB(vCore) bindings for the Functions runtime don't support Microsoft Entra authentication and managed identities. To improve security, you should upgrade to run on the latest version of the Functions runtime.

## Example

<!--Hard-code your examples or ideally add a link to the extension-specific code example in this repo: https://github.com/Azure/azure-functions-dotnet-worker/blob/main/samples/Extensions/ as in the following example:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="35-49":::
-->

## Attributes

The following table explains the binding configuration properties that you set in the function.json file and the CosmosDBMongoTrigger attribute.

|Parameter | Description|
|---------|----------------------|
|**FunctionId** |Optional, the Id of trigger |
|**DatabaseName** | The name of the database to which the parameter applies|
|**CollectionName** | The name of the database to which the parameter applies|
|**ConnectionStringSetting** | The name of the database to which the parameter applies|
|**TriggerLevel** | The name of the database to which the parameter applies|


## Usage

## Output

The Azure Cosmos DB for MongoDB(vCore) output binding lets you write a new document to an Azure Cosmos DB for MongoDB(vCore)

## Example

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
### TimerTrigger trigger 

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

```cs
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Sample
{
    public static class Sample
    {
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
    }
}

```
## Input

The Azure Cosmos DB for MongoDB(vCore) input binding lets you reretieve one or more Azure CosmosDB for MongoDB(vCore) documents.

## Example

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
### TimerTrigger trigger 

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

```cs
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

## Related articles
 
 - [Azure Cosmos DB for MongoDB(vCore)](./azure/cosmos-db/mongodb/vcore/introduction.md)
 - [Azure Azure Cosmos DB for MongoDB(vCore) bindings for Azure Functions](./azure/azure-functions/functions-bindings-overview-mongodb-vore-csharp-only)