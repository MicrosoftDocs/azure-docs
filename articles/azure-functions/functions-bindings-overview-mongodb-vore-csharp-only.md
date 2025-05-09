---
title: Azure Cosmos DB for MongoDB(vCore) Trigger for Azure Functions
description:  Learn to use the Azure Cosmos DB for MongoDB(vCore) trigger in Azure Functions.
author: sajeetharan
ms.author: sasinnat
ms.topic: reference
ms.date: 5/8/2025
ms.custom: 
  - build-2025
---

# Azure Cosmos DB for MongoDB(vCore) trigger for Azure Functions 2.x and higher

The Azure Cosmos DB for MongoDB(vCore) Trigger uses the [Azure Cosmos DB for MongoDB(vCore) ChangeStream](/azure/cosmos-db/mongodb/change-streams) to listen for inserts and updates. The change feed publishes new and updated items, not including updates from deletions.

For information on setup and configuration details, see the [overview](./functions-bindings-mongodb-vcore-csharp-only.md).

## Install Extension 

The extension NuGet package you install depends on the C# mode you're using in your function app: 

# [Isolated worker model](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).


# [Functions 2.x+](#tab/functionsv2/in-process)

_This section describes using a [class library](./functions-dotnet-class-library.md). For [C# scripting], you would need to instead [install the extension bundle][Update your extensions], version 2.x or 3.x._

Working with the trigger and bindings requires that you reference the appropriate NuGet package. Install the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo/1.1.0-preview), version 3.x.

# [Extension 4.x+](#tab/extensionv4/isolated-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo/1.1.0-preview), version 4.x.


# [Functions 2.x+](#tab/functionsv2/isolated-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo/1.1.0-preview), version 3.x.

---

## Usage

The following example shows a C# Function that retrieves a single document when a document is updated/changed.

```cs
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using System;

namespace Sample
{

        [FunctionName("TriggerSample")]
        public static void TriggerRun(
           [CosmosDBMongoTrigger("vCoreDatabaseTrigger", "vCoreCollectionTrigger", ConnectionStringSetting = "vCoreConnectionStringTrigger")] ChangeStreamDocument<BsonDocument> doc,
           ILogger log)
        {
            log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");

            log.LogInformation(doc.FullDocument.ToString());
        }
}
```

## Related articles
 
 - [Azure Cosmos DB for MongoDB(vCore)](/azure/cosmos-db/mongodb/vcore/introduction.md)
 - [Azure Azure Cosmos DB for MongoDB(vCore) bindings for Azure Functions](/azure/azure-functions/functions-bindings-mongodb-vcore-csharp-only)