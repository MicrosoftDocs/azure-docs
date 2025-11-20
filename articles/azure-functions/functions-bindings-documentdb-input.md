---
title: Azure DocumentDB Input Binding
titleSuffix: Azure Functions
description: Learn how to use Azure DocumentDB input binding in Azure Functions to retrieve and query documents from your database. Includes C# code examples and configuration guidance.
author: sajeetharan
ms.author: sasinnat
ms.topic: reference
ms.date: 11/19/2025
ms.custom:
  - sfi-ropc-nochange
---

# Azure DocumentDB input binding for Azure Functions

[!INCLUDE [functions-bindings-documentdb-preview](../../includes/functions-bindings-documentdb-preview.md)]

The [Azure DocumentDB](/azure/documentdb/overview) input binding in Azure Functions lets you retrieve one or more documents from your database. This article explains how to configure and use the input binding with C# code examples, including querying collections and working with the MongoDB client.

## Prerequisites

- An Azure subscription

  - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)

- An existing Azure DocumentDB cluster

  - If you don't have a cluster, create a [new cluster](/azure/documentdb/quickstart-portal)
  
  - [Change stream feature](/azure/documentdb/change-streams) enabled

- Azure Functions .NET 8.0 project using the legacy in-process worker model

- [`Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo` NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo)

- [`MongoDB.Driver` NuGet package](https://www.nuget.org/packages/MongoDB.Driver)

## Example

This example shows an HTTP trigger function for an HTTP `GET` request. The function then uses an input binding to query the target Azure DocumentDB collection for documents that match the filter `{ "price": { "$gte": 150 }}`:

```csharp
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo;
using System.Collections.Generic;
using MongoDB.Bson;

public static class DocumentDBInput
{
    [FunctionName(nameof(DocumentDBInput))]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "GET", Route = null)]
        HttpRequest request,
        [CosmosDBMongo(databaseName: "<database-name>",
                        collectionName: "<collection-name>",
                        ConnectionStringSetting = "<name-of-app-setting>",
                        QueryString = "{{ \"price\": {{ \"$gte\": 150 }} }}")]
        IEnumerable<BsonDocument> documents,
        ILogger logger)
    {
        logger.LogInformation("C# Azure DocumentDB function queried a collection.");

        return new OkObjectResult(documents);
    }
}
```

Alternatively, use a C# record or class type to represent documents returned from the collection:

```csharp
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public static class DocumentDBInput
{
    [FunctionName(nameof(DocumentDBInput))]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "GET", Route = null)]
        HttpRequest request,
        [CosmosDBMongo(databaseName: "<database-name>",
                        collectionName: "<collection-name>",
                        ConnectionStringSetting = "<name-of-app-setting>",
                        QueryString = "{{ \"price\": {{ \"$gte\": 150 }} }}")]
        IEnumerable<ProductDocument> products,
        ILogger logger)
    {
        logger.LogInformation("C# Azure DocumentDB function queried a collection.");

        return new OkObjectResult(products);
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
| **`DatabaseName`** | (Optional) The name of the database targeted by the input. |
| **`CollectionName`** | (Optional) The name of the collection in the database targeted by the input. |
| **`ConnectionStringSetting`** | The name of an app setting or setting collection that specifies how to connect to the Azure DocumentDB cluster. |
| **`QueryString`** | Defines the Mongo query expression used by the input binding return documents from the database. The query supports Azure Functions binding parameters. |

> [!NOTE]
> The `QueryString` parameter needs to be escaped with double curly brackets to account for Azure Function's built-in parameter binding. For more information, see [binding expressions and patterns](functions-bindings-expressions-patterns.md).

## Usage

Use the `CosmosDBMongo` attribute to retrieve a set of documents from the collection:

```csharp
[FunctionName(nameof(DocumentDBInput))]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "GET", Route = null)]
    HttpRequest request,
    [CosmosDBMongo(databaseName: "<database-name>",
                    collectionName: "<collection-name>",
                    ConnectionStringSetting = "<name-of-app-setting>")]
    IEnumerable<BsonDocument> documents,
    ILogger logger)
{
    logger.LogInformation("C# Azure DocumentDB function queried a collection.");

    return new OkObjectResult(documents);
}
```

Alternatively, work directly with the [MongoDB client](https://mongodb.github.io/mongo-csharp-driver/2.8/apidocs/html/T_MongoDB_Driver_IMongoClient.htm) in your function code:

```csharp
[FunctionName(nameof(DocumentDBInput))]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "GET", Route = null)]
    HttpRequest request,
    [CosmosDBMongo(ConnectionStringSetting = "<name-of-app-setting>")]
    IMongoClient client,
    ILogger logger)
{
    logger.LogInformation("C# Azure DocumentDB function got a client.");

    IMongoDatabase database = client.GetDatabase("<database-name>");

    IMongoCollection<BsonDocument> collection = database.GetCollection<BsonDocument>("<collection-name>");

    BsonDocument filter = []; // Empty filter to get all documents

    long count = await collection.CountDocumentsAsync(filter);

    return new OkObjectResult(new
    {
        documentsInCollection = count
    });
}
```

## Related articles
 
- [Azure DocumentDB](/azure/documentdb/overview)
- [Azure DocumentDB bindings for Azure Functions](functions-bindings-documentdb.md)
- [Azure DocumentDB trigger for Azure Functions](functions-bindings-documentdb-trigger.md)
- [Azure DocumentDB output binding for Azure Functions](functions-bindings-documentdb-output.md)
