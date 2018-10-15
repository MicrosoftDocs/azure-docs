---
title: Azure Cosmos DB bindings for Functions 2.x
description: Understand how to use Azure Cosmos DB triggers and bindings in Azure Functions.
services: functions
documentationcenter: na
author: ggailey777
manager: jeconnoc
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture

ms.service: azure-functions; cosmos-db
ms.devlang: multiple
ms.topic: reference
ms.date: 11/21/2017
ms.author: glenga
---

# Azure Cosmos DB bindings for Azure Functions 2.x

> [!div class="op_single_selector" title1="Select the version of the Azure Functions runtime you are using: "]
> * [Version 1](functions-bindings-cosmosdb.md)
> * [Version 2](functions-bindings-cosmosdb-v2.md)

This article explains how to work with [Azure Cosmos DB](..\cosmos-db\serverless-computing-database.md) bindings in Azure Functions 2.x. Azure Functions supports trigger, input, and output bindings for Azure Cosmos DB.

> [!NOTE]
> This article is for [Azure Functions version 2.x](functions-versions.md).  For information about how to use these bindings in Functions 1.x, see [Azure Cosmos DB bindings for Azure Functions 1.x](functions-bindings-cosmosdb.md).
>
> This binding was originally named DocumentDB. In Functions version 2.x, the trigger, bindings, and package are all named Cosmos DB.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Supported APIs

[!INCLUDE [SQL API support only](../../includes/functions-cosmosdb-sqlapi-note.md)]

## Packages - Functions 2.x

The Azure Cosmos DB bindings for Functions version 2.x are provided in the [Microsoft.Azure.WebJobs.Extensions.CosmosDB](http://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB) NuGet package, version 3.x. Source code for the bindings is in the [azure-webjobs-sdk-extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.CosmosDB/) GitHub repository.

[!INCLUDE [functions-package-v2](../../includes/functions-package-v2.md)]

## Trigger

The Azure Cosmos DB Trigger uses the [Azure Cosmos DB Change Feed](../cosmos-db/change-feed.md) to listen for inserts and updates across partitions. The change feed publishes inserts and updates, not deletions.

## Trigger - example

See the language-specific example:

* [C#](#trigger---c-example)
* [C# script (.csx)](#trigger---c-script-example)
* [JavaScript](#trigger---javascript-example)
* [Java](#trigger---java-example)

[Skip trigger examples](#trigger---attributes)

### Trigger - C# example

The following example shows a [C# function](functions-dotnet-class-library.md) that is invoked when there are inserts or updates in the specified database and collection.

```cs
using Microsoft.Azure.Documents;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using System.Collections.Generic;

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
            TraceWriter log)
        {
            if (documents != null && documents.Count > 0)
            {
                log.Info($"Documents modified: {documents.Count}");
                log.Info($"First document Id: {documents[0].Id}");
            }
        }
    }
}
```

[Skip trigger examples](#trigger---attributes)

### Trigger - C# script example

The following example shows a Cosmos DB trigger binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function writes log messages when Cosmos DB records are modified.

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
    #r "Microsoft.Azure.Documents.Client"
    
    using System;
    using Microsoft.Azure.Documents;
    using System.Collections.Generic;
    

    public static void Run(IReadOnlyList<Document> documents, TraceWriter log)
    {
      log.Verbose("Documents modified " + documents.Count);
      log.Verbose("First document Id " + documents[0].Id);
    }
```

[Skip trigger examples](#trigger---attributes)

### Trigger - JavaScript example

The following example shows a Cosmos DB trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function writes log messages when Cosmos DB records are modified.

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

### Trigger - Java example

The following example shows a Cosmos DB trigger binding in *function.json* file and a [Java function](functions-reference-java.md) that uses the binding. The function is involved when there are inserts or updates in the specified database and collection.

```json
{
    "type": "cosmosDBTrigger",
    "name": "items",
    "direction": "in",
    "leaseCollectionName": "leases",
    "connectionStringSetting": "AzureCosmosDBConnection",
    "databaseName": "ToDoList",
    "collectionName": "Items",
    "createLeaseCollectionIfNotExists": false
}
```

Here's the Java code:

```java
    @FunctionName("cosmosDBMonitor")
    public void cosmosDbProcessor(
        @CosmosDBTrigger(name = "items",
            databaseName = "ToDoList",
            collectionName = "Items",
            leaseCollectionName = "leases",
            reateLeaseCollectionIfNotExists = true,
            connectionStringSetting = "AzureCosmosDBConnection") String[] items,
            final ExecutionContext context ) {
                context.getLogger().info(items.length + "item(s) is/are changed.");
            }
```


In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@CosmosDBTrigger` annotation on parameters whose value would come from Cosmos DB.  This annotation can be used with native Java types, POJOs, or nullable values using Optional<T>. 

## Trigger - C# attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [CosmosDBTrigger](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.CosmosDB/Trigger/CosmosDBTriggerAttribute.cs) attribute.

The attribute's constructor takes the database name and collection name. For information about those settings and other properties that you can configure, see [Trigger - configuration](#trigger---configuration). Here's a `CosmosDBTrigger` attribute example in a method signature:

```csharp
    [FunctionName("DocumentUpdates")]
    public static void Run(
        [CosmosDBTrigger("database", "collection", ConnectionStringSetting = "myCosmosDB")]
    IReadOnlyList<Document> documents,
        TraceWriter log)
    {
        ...
    }
```

For a complete example, see [Trigger - C# example](#trigger---c-example).


## Trigger - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `CosmosDBTrigger` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** || Must be set to `cosmosDBTrigger`. |
|**direction** || Must be set to `in`. This parameter is set automatically when you create the trigger in the Azure portal. |
|**name** || The variable name used in function code that represents the list of documents with changes. | 
|**connectionStringSetting**|**ConnectionStringSetting** | The name of an app setting that contains the connection string used to connect to the Azure Cosmos DB account being monitored. |
|**databaseName**|**DatabaseName**  | The name of the Azure Cosmos DB database with the collection being monitored. |
|**collectionName** |**CollectionName** | The name of the collection being monitored. |
|**leaseConnectionStringSetting** | **LeaseConnectionStringSetting** | (Optional) The name of an app setting that contains the connection string to the service which holds the lease collection. When not set, the `connectionStringSetting` value is used. This parameter is automatically set when the binding is created in the portal. The connection string for the leases collection must have write permissions.|
|**leaseDatabaseName** |**LeaseDatabaseName** | (Optional) The name of the database that holds the collection used to store leases. When not set, the value of the `databaseName` setting is used. This parameter is automatically set when the binding is created in the portal. |
|**leaseCollectionName** | **LeaseCollectionName** | (Optional) The name of the collection used to store leases. When not set, the value `leases` is used. |
|**createLeaseCollectionIfNotExists** | **CreateLeaseCollectionIfNotExists** | (Optional) When set to `true`, the leases collection is automatically created when it doesn't already exist. The default value is `false`. |
|**leasesCollectionThroughput**| **LeasesCollectionThroughput**| (Optional) Defines the amount of Request Units to assign when the leases collection is created. This setting is only used When `createLeaseCollectionIfNotExists` is set to `true`. This parameter is  automatically set when the binding is created using the portal.
|**leaseCollectionPrefix**| **LeaseCollectionPrefix**| (Optional) When set, it adds a prefix to the leases created in the Lease collection for this Function, effectively allowing two separate Azure Functions to share the same Lease collection by using different prefixes.
|**feedPollDelay**| **FeedPollDelay**| (Optional) When set, it defines, in milliseconds, the delay in between polling a partition for new changes on the feed, after all current changes are drained. Default is 5000 (5 seconds).
|**leaseAcquireInterval**| **LeaseAcquireInterval**| (Optional) When set, it defines, in milliseconds, the interval to kick off a task to compute if partitions are distributed evenly among known host instances. Default is 13000 (13 seconds).
|**leaseExpirationInterval**| **LeaseExpirationInterval**| (Optional) When set, it defines, in milliseconds, the interval for which the lease is taken on a lease representing a partition. If the lease is not renewed within this interval, it will cause it to expire and ownership of the partition will move to another instance. Default is 60000 (60 seconds).
|**leaseRenewInterval**| **LeaseRenewInterval**| (Optional) When set, it defines, in milliseconds, the renew interval for all leases for partitions currently held by an instance. Default is 17000 (17 seconds).
|**checkpointFrequency**| **CheckpointFrequency**| (Optional) When set, it defines, in milliseconds, the interval between lease checkpoints. Default is always after a successful Function call.
|**maxItemsPerInvocation**| **MaxItemsPerInvocation**| (Optional) When set, it customizes the maximum amount of items received per Function call.

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Trigger - usage

The trigger requires a second collection that it uses to store _leases_ over the partitions. Both the collection being monitored and the collection that contains the leases must be available for the trigger to work.

>[!IMPORTANT]
> If multiple functions are configured to use a Cosmos DB trigger for the same collection, each of the functions should use a dedicated lease collection or specify a different `LeaseCollectionPrefix` for each function. Otherwise, only one of the functions will be triggered. For information about the prefix, see the [Configuration section](#trigger---configuration).

The trigger doesn't indicate whether a document was updated or inserted, it just provides the document itself. If you need to handle updates and inserts differently, you could do that by implementing timestamp fields for insertion or update.

## Input

The Azure Cosmos DB input binding uses the SQL API to retrieve one or more Azure Cosmos DB documents and passes them to the input parameter of the function. The document ID or query parameters can be determined based on the trigger that invokes the function. 

## Input - examples

See the language-specific examples that read a single document by specifying an ID value:

* [C#](#input---c-examples)
* [C# script (.csx)](#input---c-script-examples)
* [JavaScript](#input---javascript-examples)
* [F#](#input---f-examples)
* [Java](#input---java-examples)

[Skip input examples](#input---attributes)

### Input - C# examples

This section contains the following examples:

* [Queue trigger, look up ID from JSON](#queue-trigger-look-up-id-from-json-c)
* [HTTP trigger, look up ID from query string](#http-trigger-look-up-id-from-query-string-c)
* [HTTP trigger, look up ID from route data](#http-trigger-look-up-id-from-route-data-c)
* [HTTP trigger, look up ID from route data, using SqlQuery](#http-trigger-look-up-id-from-route-data-using-sqlquery-c)
* [HTTP trigger, get multiple docs, using SqlQuery](#http-trigger-get-multiple-docs-using-sqlquery-c)
* [HTTP trigger, get multiple docs, using DocumentClient](#http-trigger-get-multiple-docs-using-documentclient-c)

The examples refer to a simple `ToDoItem` type:

```cs
namespace CosmosDBSamplesV2
{
    public class ToDoItem
    {
        public string Id { get; set; }
        public string Description { get; set; }
    }
}
```

[Skip input examples](#input---attributes)

#### Queue trigger, look up ID from JSON (C#)

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves a single document. The function is triggered by a queue message that contains a JSON object. The queue trigger parses the JSON into an object named `ToDoItemLookup`, which contains the ID to look up. That ID is used to retrieve a `ToDoItem` document from the specified database and collection.

```cs
namespace CosmosDBSamplesV2
{
    public class ToDoItemLookup
    {
        public string ToDoItemId { get; set; }
    }
}
```

```cs
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;

namespace CosmosDBSamplesV2
{
    public static class DocByIdFromJSON
    {
        [FunctionName("DocByIdFromJSON")]
        public static void Run(
            [QueueTrigger("todoqueueforlookup")] ToDoItemLookup toDoItemLookup,
            [CosmosDB(
                databaseName: "ToDoItems",
                collectionName: "Items",
                ConnectionStringSetting = "CosmosDBConnection", 
                Id = "{ToDoItemId}")]ToDoItem toDoItem,
            TraceWriter log)
        {
            log.Info($"C# Queue trigger function processed Id={toDoItemLookup?.ToDoItemId}");

            if (toDoItem == null)
            {
                log.Info($"ToDo item not found");
            }
            else
            {
                log.Info($"Found ToDo item, Description={toDoItem.Description}");
            }
        }
    }
}
```

[Skip input examples](#input---attributes)

#### HTTP trigger, look up ID from query string (C#)

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves a single document. The function is triggered by an HTTP request that uses a query string to specify the ID to look up. That ID is used to retrieve a `ToDoItem` document from the specified database and collection.

```cs
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;

namespace CosmosDBSamplesV2
{
    public static class DocByIdFromQueryString
    {
        [FunctionName("DocByIdFromQueryString")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]
                HttpRequest req,
            [CosmosDB(
                databaseName: "ToDoItems",
                collectionName: "Items",
                ConnectionStringSetting = "CosmosDBConnection", 
                Id = "{Query.id}")] ToDoItem toDoItem,
            TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");

            if (toDoItem == null)
            {
                log.Info($"ToDo item not found");
            }
            else
            {
                log.Info($"Found ToDo item, Description={toDoItem.Description}");
            }
            return new OkResult();
        }
    }
}
```

[Skip input examples](#input---attributes)

#### HTTP trigger, look up ID from route data (C#)

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves a single document. The function is triggered by an HTTP request that uses route data to specify the ID to look up. That ID is used to retrieve a `ToDoItem` document from the specified database and collection.

```cs
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;

namespace CosmosDBSamplesV2
{
    public static class DocByIdFromRouteData
    {
        [FunctionName("DocByIdFromRouteData")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", 
                Route = "todoitems/{id}")]HttpRequest req,
            [CosmosDB(
                databaseName: "ToDoItems",
                collectionName: "Items",
                ConnectionStringSetting = "CosmosDBConnection", 
                Id = "{id}")] ToDoItem toDoItem,
            TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");

            if (toDoItem == null)
            {
                log.Info($"ToDo item not found");
            }
            else
            {
                log.Info($"Found ToDo item, Description={toDoItem.Description}");
            }
            return new OkResult();
        }
    }
}
```

[Skip input examples](#input---attributes)

#### HTTP trigger, look up ID from route data, using SqlQuery (C#)

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves a single document. The function is triggered by an HTTP request that uses route data to specify the ID to look up. That ID is used to retrieve a `ToDoItem` document from the specified database and collection. 

The example shows how to use a binding expression in the `SqlQuery` parameter. You can pass route data to the `SqlQuery` parameter as shown, but currently [you can't pass query string values](https://github.com/Azure/azure-functions-host/issues/2554#issuecomment-392084583).


```cs
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using System.Collections.Generic;

namespace CosmosDBSamplesV2
{
    public static class DocByIdFromRouteDataUsingSqlQuery
    {
        [FunctionName("DocByIdFromRouteDataUsingSqlQuery")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", 
                Route = "todoitems2/{id}")]HttpRequest req,
            [CosmosDB("ToDoItems", "Items", 
                ConnectionStringSetting = "CosmosDBConnection", 
                SqlQuery = "select * from ToDoItems r where r.id = {id}")]
                IEnumerable<ToDoItem> toDoItems,
            TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");

            foreach (ToDoItem toDoItem in toDoItems)
            {
                log.Info(toDoItem.Description);
            }
            return new OkResult();
        }
    }
}
```

[Skip input examples](#input---attributes)

#### HTTP trigger, get multiple docs, using SqlQuery (C#)

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves a list of documents. The function is triggered by an HTTP request. The query is specified in the `SqlQuery` attribute property.

```cs
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using System.Collections.Generic;

namespace CosmosDBSamplesV2
{
    public static class DocsBySqlQuery
    {
        [FunctionName("DocsBySqlQuery")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]
                HttpRequest req,
            [CosmosDB(
                databaseName: "ToDoItems",
                collectionName: "Items",
                ConnectionStringSetting = "CosmosDBConnection", 
                SqlQuery = "SELECT top 2 * FROM c order by c._ts desc")]
                IEnumerable<ToDoItem> toDoItems,
            TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");
            foreach (ToDoItem toDoItem in toDoItems)
            {
                log.Info(toDoItem.Description);
            }
            return new OkResult();
        }
    }
}

```

[Skip input examples](#input---attributes)

#### HTTP trigger, get multiple docs, using DocumentClient (C#)

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves a list of documents. The function is triggered by an HTTP request. The code uses a `DocumentClient` instance provided by the Azure Cosmos DB binding to read a list of documents. The `DocumentClient` instance could also be used for write operations.

```cs
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CosmosDBSamplesV2
{
    public static class DocsByUsingDocumentClient
    {
        [FunctionName("DocsByUsingDocumentClient")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", 
                Route = null)]HttpRequest req,
            [CosmosDB(
                databaseName: "ToDoItems",
                collectionName: "Items",
                ConnectionStringSetting = "CosmosDBConnection")] DocumentClient client,
            TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");

            var searchterm = req.Query["searchterm"];
            if (string.IsNullOrWhiteSpace(searchterm))
            {
                return (ActionResult)new NotFoundResult();
            }

            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("ToDoItems", "Items");

            log.Info($"Searching for: {searchterm}");

            IDocumentQuery<ToDoItem> query = client.CreateDocumentQuery<ToDoItem>(collectionUri)
                .Where(p => p.Description.Contains(searchterm))
                .AsDocumentQuery();

            while (query.HasMoreResults)
            {
                foreach (ToDoItem result in await query.ExecuteNextAsync())
                {
                    log.Info(result.Description);
                }
            }
            return new OkResult();
        }
    }
}
```

[Skip input examples](#input---attributes)

### Input - C# script examples

This section contains the following examples:

* [Queue trigger, look up ID from string](#queue-trigger-look-up-id-from-string-c-script)
* [Queue trigger, get multiple docs, using SqlQuery](#queue-trigger-get-multiple-docs-using-sqlquery-c-script)
* [HTTP trigger, look up ID from query string](#http-trigger-look-up-id-from-query-string-c-script)
* [HTTP trigger, look up ID from route data](#http-trigger-look-up-id-from-route-data-c-script)
* [HTTP trigger, get multiple docs, using SqlQuery](#http-trigger-get-multiple-docs-using-sqlquery-c-script)
* [HTTP trigger, get multiple docs, using DocumentClient](#http-trigger-get-multiple-docs-using-documentclient-c-script)

The HTTP trigger examples refer to a simple `ToDoItem` type:

```cs
namespace CosmosDBSamplesV2
{
    public class ToDoItem
    {
        public string Id { get; set; }
        public string Description { get; set; }
    }
}
```

[Skip input examples](#input---attributes)

#### Queue trigger, look up ID from string (C# script)

The following example shows a Cosmos DB input binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function reads a single document and updates the document's text value.

Here's the binding data in the *function.json* file:

```json
{
    "name": "inputDocument",
    "type": "cosmosDB",
    "databaseName": "MyDatabase",
    "collectionName": "MyCollection",
    "id" : "{queueTrigger}",
    "partitionKey": "{partition key value}",
    "connectionStringSetting": "MyAccount_COSMOSDB",     
    "direction": "in"
}
```
The [configuration](#input---configuration) section explains these properties.

Here's the C# script code:

```cs
    using System;

    // Change input document contents using Azure Cosmos DB input binding 
    public static void Run(string myQueueItem, dynamic inputDocument)
    {   
      inputDocument.text = "This has changed.";
    }
```

[Skip input examples](#input---attributes)

#### Queue trigger, get multiple docs, using SqlQuery (C# script)

The following example shows an Azure Cosmos DB input binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function retrieves multiple documents specified by a SQL query, using a queue trigger to customize the query parameters.

The queue trigger provides a parameter `departmentId`. A queue message of `{ "departmentId" : "Finance" }` would return all records for the finance department. 

Here's the binding data in the *function.json* file:

```json
{
    "name": "documents",
    "type": "cosmosDB",
    "direction": "in",
    "databaseName": "MyDb",
    "collectionName": "MyCollection",
    "sqlQuery": "SELECT * from c where c.departmentId = {departmentId}",
    "connectionStringSetting": "CosmosDBConnection"
}
```

The [configuration](#input---configuration) section explains these properties.

Here's the C# script code:

```csharp
    public static void Run(QueuePayload myQueueItem, IEnumerable<dynamic> documents)
    {   
        foreach (var doc in documents)
        {
            // operate on each document
        }    
    }

    public class QueuePayload
    {
        public string departmentId { get; set; }
    }
```

[Skip input examples](#input---attributes)

#### HTTP trigger, look up ID from query string (C# script)

The following example shows a [C# script function](functions-reference-csharp.md) that retrieves a single document. The function is triggered by an HTTP request that uses a query string to specify the ID to look up. That ID is used to retrieve a `ToDoItem` document from the specified database and collection.

Here's the *function.json* file:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "type": "cosmosDB",
      "name": "toDoItem",
      "databaseName": "ToDoItems",
      "collectionName": "Items",
      "connectionStringSetting": "CosmosDBConnection",
      "direction": "in",
      "Id": "{Query.id}"
    }
  ],
  "disabled": true
}
```

Here's the C# script code:

```cs
using System.Net;

public static HttpResponseMessage Run(HttpRequestMessage req, ToDoItem toDoItem, TraceWriter log)
{
    log.Info("C# HTTP trigger function processed a request.");

    if (toDoItem == null)
    {
         log.Info($"ToDo item not found");
    }
    else
    {
        log.Info($"Found ToDo item, Description={toDoItem.Description}");
    }
    return req.CreateResponse(HttpStatusCode.OK);
}
```

[Skip input examples](#input---attributes)

#### HTTP trigger, look up ID from route data (C# script)

The following example shows a [C# script function](functions-reference-csharp.md) that retrieves a single document. The function is triggered by an HTTP request that uses route data to specify the ID to look up. That ID is used to retrieve a `ToDoItem` document from the specified database and collection.

Here's the *function.json* file:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in",
      "methods": [
        "get",
        "post"
      ],
      "route":"todoitems/{id}"
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "type": "cosmosDB",
      "name": "toDoItem",
      "databaseName": "ToDoItems",
      "collectionName": "Items",
      "connectionStringSetting": "CosmosDBConnection",
      "direction": "in",
      "Id": "{id}"
    }
  ],
  "disabled": false
}
```

Here's the C# script code:

```cs
using System.Net;

public static HttpResponseMessage Run(HttpRequestMessage req, ToDoItem toDoItem, TraceWriter log)
{
    log.Info("C# HTTP trigger function processed a request.");

    if (toDoItem == null)
    {
         log.Info($"ToDo item not found");
    }
    else
    {
        log.Info($"Found ToDo item, Description={toDoItem.Description}");
    }
    return req.CreateResponse(HttpStatusCode.OK);
}
```

[Skip input examples](#input---attributes)

#### HTTP trigger, get multiple docs, using SqlQuery (C# script)

The following example shows a [C# script function](functions-reference-csharp.md) that retrieves a list of documents. The function is triggered by an HTTP request. The query is specified in the `SqlQuery` attribute property.

Here's the *function.json* file:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "type": "cosmosDB",
      "name": "toDoItems",
      "databaseName": "ToDoItems",
      "collectionName": "Items",
      "connectionStringSetting": "CosmosDBConnection",
      "direction": "in",
      "sqlQuery": "SELECT top 2 * FROM c order by c._ts desc"
    }
  ],
  "disabled": false
}
```

Here's the C# script code:

```cs
using System.Net;

public static HttpResponseMessage Run(HttpRequestMessage req, IEnumerable<ToDoItem> toDoItems, TraceWriter log)
{
    log.Info("C# HTTP trigger function processed a request.");

    foreach (ToDoItem toDoItem in toDoItems)
    {
        log.Info(toDoItem.Description);
    }
    return req.CreateResponse(HttpStatusCode.OK);
}
```

[Skip input examples](#input---attributes)

#### HTTP trigger, get multiple docs, using DocumentClient (C# script)

The following example shows a [C# script function](functions-reference-csharp.md) that retrieves a list of documents. The function is triggered by an HTTP request. The code uses a `DocumentClient` instance provided by the Azure Cosmos DB binding to read a list of documents. The `DocumentClient` instance could also be used for write operations.

Here's the *function.json* file:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "type": "cosmosDB",
      "name": "client",
      "databaseName": "ToDoItems",
      "collectionName": "Items",
      "connectionStringSetting": "CosmosDBConnection",
      "direction": "inout"
    }
  ],
  "disabled": false
}
```

Here's the C# script code:

```cs
#r "Microsoft.Azure.Documents.Client"

using System.Net;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, DocumentClient client, TraceWriter log)
{
    log.Info("C# HTTP trigger function processed a request.");

    Uri collectionUri = UriFactory.CreateDocumentCollectionUri("ToDoItems", "Items");
    string searchterm = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "searchterm", true) == 0)
        .Value;

    if (searchterm == null)
    {
        return req.CreateResponse(HttpStatusCode.NotFound);
    }

    log.Info($"Searching for word: {searchterm} using Uri: {collectionUri.ToString()}");
    IDocumentQuery<ToDoItem> query = client.CreateDocumentQuery<ToDoItem>(collectionUri)
        .Where(p => p.Description.Contains(searchterm))
        .AsDocumentQuery();

    while (query.HasMoreResults)
    {
        foreach (ToDoItem result in await query.ExecuteNextAsync())
        {
            log.Info(result.Description);
        }
    }
    return req.CreateResponse(HttpStatusCode.OK);
}
```

[Skip input examples](#input---attributes)

### Input - JavaScript examples

This section contains the following examples that read a single document by specifying an ID value from various sources:

* [Queue trigger, look up ID from JSON](#queue-trigger-look-up-id-from-string-javascript)
* [HTTP trigger, look up ID from query string](#http-trigger-look-up-id-from-query-string-javascript)
* [HTTP trigger, look up ID from route data](#http-trigger-look-up-id-from-route-data-javascript)
* [Queue trigger, get multiple docs, using SqlQuery](#queue-trigger-get-multiple-docs-using-sqlquery-javascript)

[Skip input examples](#input---attributes)

#### Queue trigger, look up ID from JSON (JavaScript)

The following example shows a Cosmos DB input binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function reads a single document and updates the document's text value.

Here's the binding data in the *function.json* file:

```json
{
    "name": "inputDocumentIn",
    "type": "cosmosDB",
    "databaseName": "MyDatabase",
    "collectionName": "MyCollection",
    "id" : "{queueTrigger_payload_property}",
    "partitionKey": "{queueTrigger_payload_property}",
    "connectionStringSetting": "MyAccount_COSMOSDB",     
    "direction": "in"
},
{
    "name": "inputDocumentOut",
    "type": "cosmosDB",
    "databaseName": "MyDatabase",
    "collectionName": "MyCollection",
    "createIfNotExists": false,
    "partitionKey": "{queueTrigger_payload_property}",
    "connectionStringSetting": "MyAccount_COSMOSDB",
    "direction": "out"
}
```
The [configuration](#input---configuration) section explains these properties.

Here's the JavaScript code:

```javascript
    // Change input document contents using Azure Cosmos DB input binding, using context.bindings.inputDocumentOut
    module.exports = function (context) {   
    context.bindings.inputDocumentOut = context.bindings.inputDocumentIn;
    context.bindings.inputDocumentOut.text = "This was updated!";
    context.done();
    };
```

[Skip input examples](#input---attributes)

#### HTTP trigger, look up ID from query string (JavaScript)

The following example shows a [JavaScript function](functions-reference-node.md) that retrieves a single document. The function is triggered by an HTTP request that uses a query string to specify the ID to look up. That ID is used to retrieve a `ToDoItem` document from the specified database and collection.

Here's the *function.json* file:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "type": "cosmosDB",
      "name": "toDoItem",
      "databaseName": "ToDoItems",
      "collectionName": "Items",
      "connectionStringSetting": "CosmosDBConnection",
      "direction": "in",
      "Id": "{Query.id}"
    }
  ],
  "disabled": true
}
```

Here's the JavaScript code:

```javascript
module.exports = function (context, req, toDoItem) {
    context.log('JavaScript queue trigger function processed work item');
    if (!toDoItem)
    {
        context.log("ToDo item not found");
    }
    else
    {
        context.log("Found ToDo item, Description=" + toDoItem.Description);
    }

    context.done();
};
```

[Skip input examples](#input---attributes)

#### HTTP trigger, look up ID from route data (JavaScript)

The following example shows a [JavaScript function](functions-reference-node.md) that retrieves a single document. The function is triggered by an HTTP request that uses a query string to specify the ID to look up. That ID is used to retrieve a `ToDoItem` document from the specified database and collection.

Here's the *function.json* file:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in",
      "methods": [
        "get",
        "post"
      ],
      "route":"todoitems/{id}"
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "type": "cosmosDB",
      "name": "toDoItem",
      "databaseName": "ToDoItems",
      "collectionName": "Items",
      "connection": "CosmosDBConnection",
      "direction": "in",
      "Id": "{id}"
    }
  ],
  "disabled": false
}
```

Here's the JavaScript code:

```javascript
module.exports = function (context, req, toDoItem) {
    context.log('JavaScript queue trigger function processed work item');
    if (!toDoItem)
    {
        context.log("ToDo item not found");
    }
    else
    {
        context.log("Found ToDo item, Description=" + toDoItem.Description);
    }

    context.done();
};
```

[Skip input examples](#input---attributes)

#### Queue trigger, get multiple docs, using SqlQuery (JavaScript)

The following example shows an Azure Cosmos DB input binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function retrieves multiple documents specified by a SQL query, using a queue trigger to customize the query parameters.

The queue trigger provides a parameter `departmentId`. A queue message of `{ "departmentId" : "Finance" }` would return all records for the finance department. 

Here's the binding data in the *function.json* file:

```json
{
    "name": "documents",
    "type": "cosmosDB",
    "direction": "in",
    "databaseName": "MyDb",
    "collectionName": "MyCollection",
    "sqlQuery": "SELECT * from c where c.departmentId = {departmentId}",
    "connectionStringSetting": "CosmosDBConnection"
}
```

The [configuration](#input---configuration) section explains these properties.

Here's the JavaScript code:

```javascript
    module.exports = function (context, input) {    
        var documents = context.bindings.documents;
        for (var i = 0; i < documents.length; i++) {
            var document = documents[i];
            // operate on each document
        }	    
        context.done();
    };
```

[Skip input examples](#input---attributes)

<a name="infsharp"></a>

### Input - F# examples

The following example shows a Cosmos DB input binding in a *function.json* file and a [F# function](functions-reference-fsharp.md) that uses the binding. The function reads a single document and updates the document's text value.

Here's the binding data in the *function.json* file:

```json
{
    "name": "inputDocument",
    "type": "cosmosDB",
    "databaseName": "MyDatabase",
    "collectionName": "MyCollection",
    "id" : "{queueTrigger}",
    "connectionStringSetting": "MyAccount_COSMOSDB",     
    "direction": "in"
}
```

The [configuration](#input---configuration) section explains these properties.

Here's the F# code:

```fsharp
    (* Change input document contents using Azure Cosmos DB input binding *)
    open FSharp.Interop.Dynamic
    let Run(myQueueItem: string, inputDocument: obj) =
    inputDocument?text <- "This has changed."
```

This example requires a `project.json` file that specifies the `FSharp.Interop.Dynamic` and `Dynamitey` NuGet 
dependencies:

```json
{
    "frameworks": {
        "net46": {
            "dependencies": {
                "Dynamitey": "1.0.2",
                "FSharp.Interop.Dynamic": "3.0.0"
            }
        }
    }
}
```

To add a `project.json` file, see [F# package management](functions-reference-fsharp.md#package).

### Input - Java examples

The following example shows a Java function that retrieves a single document. The function is triggered by a HTTP request that uses a query string to specify the ID to look up. That ID is used to retrieve a ToDoItem document from the specified database and collection.

Here's the Java code:

```java
@FunctionName("getItem")
public String cosmosDbQueryById(
    @HttpTrigger(name = "req",
                  methods = {HttpMethod.GET},
                  authLevel = AuthorizationLevel.ANONYMOUS) Optional<String> dummy,
    @CosmosDBInput(name = "database",
                      databaseName = "ToDoList",
                      collectionName = "Items",
                      leaseCollectionName = "",
                      id = "{Query.id}"
                      connectionStringSetting = "AzureCosmosDBConnection") Optional<String> item,
    final ExecutionContext context
 ) {
    return item.orElse("Not found");
 }
 ```

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@CosmosDBInput` annotation on function parameters whose value would come from Cosmos DB.  This annotation can be used with native Java types, POJOs, or nullable values using Optional<T>. 

## Input - attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [CosmosDB](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.CosmosDB/CosmosDBAttribute.cs) attribute.

The attribute's constructor takes the database name and collection name. For information about those settings and other properties that you can configure, see [the following configuration section](#input---configuration). 

## Input - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `CosmosDB` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type**     || Must be set to `cosmosDB`.        |
|**direction**     || Must be set to `in`.         |
|**name**     || Name of the binding parameter that represents the document in the function.  |
|**databaseName** |**DatabaseName** |The database containing the document.        |
|**collectionName** |**CollectionName** | The name of the collection that contains the document. |
|**id**    | **Id** | The ID of the document to retrieve. This property supports [binding expressions](functions-triggers-bindings.md#binding-expressions-and-patterns). Don't set both the **id** and **sqlQuery** properties. If you don't set either one, the entire collection is retrieved. |
|**sqlQuery**  |**SqlQuery**  | An Azure Cosmos DB SQL query used for retrieving multiple documents. The property supports runtime bindings, as in this example: `SELECT * FROM c where c.departmentId = {departmentId}`. Don't set both the **id** and **sqlQuery** properties. If you don't set either one, the entire collection is retrieved.|
|**connectionStringSetting**     |**ConnectionStringSetting**|The name of the app setting containing your Azure Cosmos DB connection string.        |
|**partitionKey**|**PartitionKey**|Specifies the partition key value for the lookup. May include binding parameters.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Input - usage

In C# and F# functions, when the function exits successfully, any changes made to the input document via named input parameters are automatically persisted. 

In JavaScript functions, updates are not made automatically upon function exit. Instead, use `context.bindings.<documentName>In` and `context.bindings.<documentName>Out` to make updates. See the [JavaScript example](#input---javascript-example).

## Output

The Azure Cosmos DB output binding lets you write a new document to an Azure Cosmos DB database using the SQL API. 

## Output - examples

See the language-specific examples:

* [C#](#output---c-examples)
* [C# script (.csx)](#output---c-script-examples)
* [JavaScript](#output---javascript-examples)
* [F#](#output---f-examples)
* [Java](#output---java-example)

See also the [input example](#input---c-examples) that uses `DocumentClient`.

[Skip output examples](#output---attributes)

### Ouput - C# examples

This section contains the following examples:

* Queue trigger, write one doc
* Queue trigger, write docs using IAsyncCollector

The examples refer to a simple `ToDoItem` type:

```cs
namespace CosmosDBSamplesV2
{
    public class ToDoItem
    {
        public string Id { get; set; }
        public string Description { get; set; }
    }
}
```

[Skip output examples](#output---attributes)

#### Queue trigger, write one doc (C#)

The following example shows a [C# function](functions-dotnet-class-library.md) that adds a document to a database, using data provided in message from Queue storage.

```cs
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using System;

namespace CosmosDBSamplesV2
{
    public static class WriteOneDoc
    {
        [FunctionName("WriteOneDoc")]
        public static void Run(
            [QueueTrigger("todoqueueforwrite")] string queueMessage,
            [CosmosDB(
                databaseName: "ToDoItems",
                collectionName: "Items",
                ConnectionStringSetting = "CosmosDBConnection")]out dynamic document,
            TraceWriter log)
        {
            document = new { Description = queueMessage, id = Guid.NewGuid() };

            log.Info($"C# Queue trigger function inserted one row");
            log.Info($"Description={queueMessage}");
        }
    }
}
```

[Skip output examples](#output---attributes)

#### Queue trigger, write docs using IAsyncCollector (C#)

The following example shows a [C# function](functions-dotnet-class-library.md) that adds a collection of documents to a database, using data provided in a queue message JSON.

```cs
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using System.Threading.Tasks;

namespace CosmosDBSamplesV2
{
    public static class WriteDocsIAsyncCollector
    {
        [FunctionName("WriteDocsIAsyncCollector")]
        public static async Task Run(
            [QueueTrigger("todoqueueforwritemulti")] ToDoItem[] toDoItemsIn,
            [CosmosDB(
                databaseName: "ToDoItems",
                collectionName: "Items",
                ConnectionStringSetting = "CosmosDBConnection")]
                IAsyncCollector<ToDoItem> toDoItemsOut,
            TraceWriter log)
        {
            log.Info($"C# Queue trigger function processed {toDoItemsIn?.Length} items");

            foreach (ToDoItem toDoItem in toDoItemsIn)
            {
                log.Info($"Description={toDoItem.Description}");
                await toDoItemsOut.AddAsync(toDoItem);
            }
        }
    }
}
```

[Skip output examples](#output---attributes)

### Output - C# script examples

This section contains the following examples:

* Queue trigger, write one doc
* Queue trigger, write docs using IAsyncCollector

[Skip output examples](#output---attributes)

#### Queue trigger, write one doc (C# script)

The following example shows an Azure Cosmos DB output binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function uses a queue input binding for a queue that receives JSON in the following format:

```json
{
    "name": "John Henry",
    "employeeId": "123456",
    "address": "A town nearby"
}
```

The function creates Azure Cosmos DB documents in the following format for each record:

```json
{
    "id": "John Henry-123456",
    "name": "John Henry",
    "employeeId": "123456",
    "address": "A town nearby"
}
```

Here's the binding data in the *function.json* file:

```json
{
    "name": "employeeDocument",
    "type": "cosmosDB",
    "databaseName": "MyDatabase",
    "collectionName": "MyCollection",
    "createIfNotExists": true,
    "connectionStringSetting": "MyAccount_COSMOSDB",     
    "direction": "out"
}
```

The [configuration](#output---configuration) section explains these properties.

Here's the C# script code:

```cs
    #r "Newtonsoft.Json"

    using Microsoft.Azure.WebJobs.Host;
    using Newtonsoft.Json.Linq;

    public static void Run(string myQueueItem, out object employeeDocument, TraceWriter log)
    {
      log.Info($"C# Queue trigger function processed: {myQueueItem}");

      dynamic employee = JObject.Parse(myQueueItem);

      employeeDocument = new {
        id = employee.name + "-" + employee.employeeId,
        name = employee.name,
        employeeId = employee.employeeId,
        address = employee.address
      };
    }
```

#### Queue trigger, write docs using IAsyncCollector

To create multiple documents, you can bind to `ICollector<T>` or `IAsyncCollector<T>` where `T` is one of the supported types.

This example refers to a simple `ToDoItem` type:

```cs
namespace CosmosDBSamplesV2
{
    public class ToDoItem
    {
        public string Id { get; set; }
        public string Description { get; set; }
    }
}
```

Here's the function.json file:

```json
{
  "bindings": [
    {
      "name": "toDoItemsIn",
      "type": "queueTrigger",
      "direction": "in",
      "queueName": "todoqueueforwritemulti",
      "connectionStringSetting": "AzureWebJobsStorage"
    },
    {
      "type": "cosmosDB",
      "name": "toDoItemsOut",
      "databaseName": "ToDoItems",
      "collectionName": "Items",
      "connectionStringSetting": "CosmosDBConnection",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

Here's the C# script code:

```cs
using System;

public static async Task Run(ToDoItem[] toDoItemsIn, IAsyncCollector<ToDoItem> toDoItemsOut, TraceWriter log)
{
    log.Info($"C# Queue trigger function processed {toDoItemsIn?.Length} items");

    foreach (ToDoItem toDoItem in toDoItemsIn)
    {
        log.Info($"Description={toDoItem.Description}");
        await toDoItemsOut.AddAsync(toDoItem);
    }
}
```

[Skip output examples](#output---attributes)

### Output - JavaScript examples

The following example shows an Azure Cosmos DB output binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function uses a queue input binding for a queue that receives JSON in the following format:

```json
{
    "name": "John Henry",
    "employeeId": "123456",
    "address": "A town nearby"
}
```

The function creates Azure Cosmos DB documents in the following format for each record:

```json
{
    "id": "John Henry-123456",
    "name": "John Henry",
    "employeeId": "123456",
    "address": "A town nearby"
}
```

Here's the binding data in the *function.json* file:

```json
{
    "name": "employeeDocument",
    "type": "cosmosDB",
    "databaseName": "MyDatabase",
    "collectionName": "MyCollection",
    "createIfNotExists": true,
    "connectionStringSetting": "MyAccount_COSMOSDB",     
    "direction": "out"
}
```

The [configuration](#output---configuration) section explains these properties.

Here's the JavaScript code:

```javascript
    module.exports = function (context) {

      context.bindings.employeeDocument = JSON.stringify({ 
        id: context.bindings.myQueueItem.name + "-" + context.bindings.myQueueItem.employeeId,
        name: context.bindings.myQueueItem.name,
        employeeId: context.bindings.myQueueItem.employeeId,
        address: context.bindings.myQueueItem.address
      });

      context.done();
    };
```

[Skip output examples](#output---attributes)

### Output - F# examples

The following example shows an Azure Cosmos DB output binding in a *function.json* file and an [F# function](functions-reference-fsharp.md) that uses the binding. The function uses a queue input binding for a queue that receives JSON in the following format:

```json
{
    "name": "John Henry",
    "employeeId": "123456",
    "address": "A town nearby"
}
```

The function creates Azure Cosmos DB documents in the following format for each record:

```json
{
    "id": "John Henry-123456",
    "name": "John Henry",
    "employeeId": "123456",
    "address": "A town nearby"
}
```

Here's the binding data in the *function.json* file:

```json
{
    "name": "employeeDocument",
    "type": "cosmosDB",
    "databaseName": "MyDatabase",
    "collectionName": "MyCollection",
    "createIfNotExists": true,
    "connectionStringSetting": "MyAccount_COSMOSDB",     
    "direction": "out"
}
```
The [configuration](#output---configuration) section explains these properties.

Here's the F# code:

```fsharp
    open FSharp.Interop.Dynamic
    open Newtonsoft.Json

    type Employee = {
      id: string
      name: string
      employeeId: string
      address: string
    }

    let Run(myQueueItem: string, employeeDocument: byref<obj>, log: TraceWriter) =
      log.Info(sprintf "F# Queue trigger function processed: %s" myQueueItem)
      let employee = JObject.Parse(myQueueItem)
      employeeDocument <-
        { id = sprintf "%s-%s" employee?name employee?employeeId
          name = employee?name
          employeeId = employee?employeeId
          address = employee?address }
```

This example requires a `project.json` file that specifies the `FSharp.Interop.Dynamic` and `Dynamitey` NuGet 
dependencies:

```json
{
    "frameworks": {
        "net46": {
          "dependencies": {
            "Dynamitey": "1.0.2",
            "FSharp.Interop.Dynamic": "3.0.0"
           }
        }
    }
}
```

To add a `project.json` file, see [F# package management](functions-reference-fsharp.md#package).

## Output - Java examples

The following example shows a Java function that adds a document to a database with data from a message in Queue storage.

```java
@FunctionName("getItem")
@CosmosDBOutput(name = "database", databaseName = "ToDoList", collectionName = "Items", connectionStringSetting = "AzureCosmosDBConnection")
public String cosmosDbQueryById(
     @QueueTrigger(name = "msg", queueName = "myqueue-items", connection = "AzureWebJobsStorage") String message,
     final ExecutionContext context
)  {
     return "{ id: " + System.currentTimeMillis() + ", Description: " + message + " }";
   }
```

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@CosmosDBOutput` annotation on parameters that will be written to Cosmos DB.  The annotation parameter type should be OutputBinding<T>, where T is either a native Java type or a POJO.


## Output - attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [CosmosDB](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/v2.x/master/WebJobs.Extensions.CosmosDB/CosmosDBAttribute.cs) attribute.

The attribute's constructor takes the database name and collection name. For information about those settings and other properties that you can configure, see [Output - configuration](#output---configuration). Here's a `CosmosDB` attribute example in a method signature:

```csharp
    [FunctionName("QueueToDocDB")]        
    public static void Run(
        [QueueTrigger("myqueue-items", Connection = "AzureWebJobsStorage")] string myQueueItem,
        [CosmosDB("ToDoList", "Items", Id = "id", ConnectionStringSetting = "myCosmosDB")] out dynamic document)
    {
        ...
    }
```

For a complete example, see [Output - C# example](#output---c-example).

## Output - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `CosmosDB` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type**     || Must be set to `cosmosDB`.        |
|**direction**     || Must be set to `out`.         |
|**name**     || Name of the binding parameter that represents the document in the function.  |
|**databaseName** | **DatabaseName**|The database containing the collection where the document is created.     |
|**collectionName** |**CollectionName**  | The name of the collection where the document is created. |
|**createIfNotExists**  |**CreateIfNotExists**    | A boolean value to indicate whether the collection is created when it doesn't exist. The default is *false* because new collections are created with reserved throughput, which has cost implications. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/).  |
|**partitionKey**|**PartitionKey** |When `CreateIfNotExists` is true, defines the partition key path for the created collection.|
|**collectionThroughput**|**CollectionThroughput**| When `CreateIfNotExists` is true, defines the [throughput](../cosmos-db/set-throughput.md) of the created collection.|
|**connectionStringSetting**    |**ConnectionStringSetting** |The name of the app setting containing your Azure Cosmos DB connection string.        |

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Output - usage

By default, when you write to the output parameter in your function, a document is created in your database. This document has an automatically generated GUID as the document ID. You can specify the document ID of the output document by specifying the `id` property in the JSON object passed to the output parameter. 

> [!Note]  
> When you specify the ID of an existing document, it gets overwritten by the new output document. 

## Exceptions and return codes

| Binding | Reference |
|---|---|
| CosmosDB | [CosmosDB Error Codes](https://docs.microsoft.com/rest/api/cosmos-db/http-status-codes-for-cosmosdb) |

## Next steps

* [Learn more about serverless database computing with Cosmos DB](..\cosmos-db\serverless-computing-database.md)
* [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)

<!---
> [!div class="nextstepaction"]
> [Go to a quickstart that uses a Cosmos DB trigger](functions-create-cosmos-db-triggered-function.md)
--->
