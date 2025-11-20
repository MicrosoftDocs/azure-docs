---
title: Azure DocumentDB Output Binding
titleSuffix: Azure Functions
description: Learn how to use the Azure DocumentDB output binding in Azure Functions to write new documents to your database. Includes code examples and configuration guidance.
author: sajeetharan
ms.author: sasinnat
ms.topic: reference
ms.date: 11/19/2025
ms.custom:
  - sfi-ropc-nochange
---

# Azure DocumentDB output binding for Azure Functions

[!INCLUDE [functions-bindings-documentdb-preview](../../includes/functions-bindings-documentdb-preview.md)]

The [Azure DocumentDB](/azure/documentdb/overview) output binding lets you write new documents to an Azure DocumentDB collection from your Azure Functions. This article explains how to configure and use the output binding, including code examples for writing documents to your database.

## Prerequisites

- An Azure subscription

  - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)

- An existing Azure DocumentDB cluster

  - If you don't have a cluster, create a [new cluster](/azure/documentdb/quickstart-portal)

- Azure Functions .NET 8.0 project using the legacy in-process worker model

- [`Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo` NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo)

- [`MongoDB.Driver` NuGet package](https://www.nuget.org/packages/MongoDB.Driver)

## Example

This example shows an HTTP trigger function for an HTTP `POST` request. The request gets an expected `string` in the request body. Then the output binding adds a document to the collection.

```csharp
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo;
using MongoDB.Bson;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Mvc;

public static class DocumentDBOutput
{
    [FunctionName(nameof(DocumentDBOutput))]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "POST", Route = null)]
        string payload,
        [CosmosDBMongo(databaseName: "<database-name>",
                        collectionName: "<collection-name>",
                        ConnectionStringSetting = "<name-of-app-setting>")]
        IAsyncCollector<BsonDocument> collector,
        ILogger logger)
    {
        logger.LogInformation("C# Azure DocumentDB output function starting.");

        BsonDocument document = new()
        {
            { "message", payload },
            { "originator", nameof(DocumentDBOutput) },
            { "timestamp", BsonDateTime.Create(System.DateTime.UtcNow) }
        };

        await collector.AddAsync(document);

        return new OkObjectResult("Document added successfully.");
    }
}
```

Alternatively, use a C# record or class type to represent documents to add to the collection:

```csharp
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo;
using MongoDB.Bson;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson.Serialization.Attributes;

public static class DocumentDBOutput
{
    [FunctionName(nameof(DocumentDBOutput))]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "POST", Route = null)]
        ProductDocument payload,
        [CosmosDBMongo(databaseName: "<database-name>",
                        collectionName: "<collection-name>",
                        ConnectionStringSetting = "<name-of-app-setting>")]
        IAsyncCollector<ProductDocument> collector,
        ILogger logger)
    {
        logger.LogInformation("C# Azure DocumentDB output function starting.");

        await collector.AddAsync(payload);

        return new OkObjectResult("Document added successfully.");
    }
}

public sealed record ProductDocument(
    [property: BsonId]
    [property: BsonRepresentation(BsonType.ObjectId)] string id,
    string name,
    string category,
    int quantity,
    decimal price,
    bool sale
);
```

## Attributes

This table describes the binding configuration properties of the `CosmosDBMongoTrigger` attribute.

| Parameter | Description |
| --- | --- |
| **`FunctionId`** | (Optional) The ID of the trigger function. |
| **`DatabaseName`** | The name of the database targeted for the output data. |
| **`CollectionName`** | The name of the collection in the database targeted for the output data.|
| **`ConnectionStringSetting`** | The name of an app setting or setting collection that specifies how to connect to the Azure DocumentDB cluster targeted for the output data. |
| **`CreateIfNotExists`** | (Optional) When set to `true`, creates the targeted collection if it doesn't already exist. |

## Usage

Use the `CosmosDBMongo` attribute to insert a set of documents into a collection that might not exist:

```csharp
[FunctionName(nameof(DocumentDBOutput))]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "POST", Route = null)]
    BsonDocument payload,
    [CosmosDBMongo(databaseName: "<database-name>",
                    collectionName: "products",
                    ConnectionStringSetting = "<name-of-app-setting>",
                    CreateIfNotExists = true)]
    IAsyncCollector<BsonDocument> collector,
    ILogger logger)
{
    logger.LogInformation("C# Azure DocumentDB output function starting.");

    await collector.AddAsync(payload);

    return new OkObjectResult("Document added successfully.");
}
```

Alternatively, work directly with the [MongoDB client](https://mongodb.github.io/mongo-csharp-driver/2.8/apidocs/html/T_MongoDB_Driver_IMongoClient.htm) in your function code:

```csharp
[FunctionName(nameof(DocumentDBOutput))]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "POST", Route = null)]
    BsonDocument payload,
    [CosmosDBMongo(ConnectionStringSetting = "<name-of-app-setting>")]
    IMongoClient client,
    ILogger logger)
{
    logger.LogInformation("C# Azure DocumentDB function got a client.");

    IMongoDatabase database = client.GetDatabase("<database-name>");

    IMongoCollection<BsonDocument> collection = database.GetCollection<BsonDocument>("<collection-name>");

    await collection.InsertOneAsync(payload);

    return new OkObjectResult("Document added successfully.");
}
```

## Related articles
 
- [Azure DocumentDB](/azure/documentdb/overview)
- [Azure DocumentDB bindings for Azure Functions](functions-bindings-documentdb.md)
- [Azure DocumentDB trigger for Azure Functions](functions-bindings-documentdb-trigger.md)
- [Azure DocumentDB input binding for Azure Functions](functions-bindings-documentdb-input.md)
