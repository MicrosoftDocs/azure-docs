---
title: Azure Cosmos DB bindings for Functions
description: Understand how to use Azure Cosmos DB triggers and bindings in Azure Functions.
services: functions
documentationcenter: na
author: ggailey777
manager: cfowler
editor: ''
tags: ''
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture

ms.service: functions; cosmos-db
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 11/21/2017
ms.author: glenga
---

# Azure Cosmos DB bindings for Azure Functions

This article explains how to work with [Azure Cosmos DB](..\cosmos-db\serverless-computing-database.md) bindings in Azure Functions. Azure Functions supports trigger, input, and output bindings for Azure Cosmos DB.

> [!NOTE]
> This binding was originally named DocumentDB. In Functions version 1.x, only the trigger was renamed Cosmos DB; the input binding, output binding, and NuGet package retain the DocumentDB name. In [Functions version 2.x](functions-versions.md), the bindings and package were also renamed Cosmos DB. This article uses the 1.x names.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Packages

The Cosmos DB bindings for Functions version 1.x are provided in the [Microsoft.Azure.WebJobs.Extensions.DocumentDB](http://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DocumentDB) NuGet package. For Functions 2.x, the package is [Microsoft.Azure.WebJobs.Extensions.CosmosDB](http://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB). Source code for the bindings is in the [azure-webjobs-sdk-extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.CosmosDB/) GitHub repository.

[!INCLUDE [functions-package](../../includes/functions-package.md)]

## Trigger

The Azure Cosmos DB Trigger uses the [Azure Cosmos DB Change Feed](../cosmos-db/change-feed.md) to listen for changes across partitions. The change feed publishes inserts and updates, not deletions. 

## Trigger - example

See the language-specific example:

* [C#](#trigger---c-example)
* [C# script (.csx)](#trigger---c-script-example)
* [JavaScript](#trigger---javascript-example)

### Trigger - C# example

The following example shows a [C# function](functions-dotnet-class-library.md) that triggers from a specific database and collection.

```cs
    using System.Collections.Generic;
    using Microsoft.Azure.Documents;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Host;

    [FunctionName("DocumentUpdates")]
    public static void Run(
        [CosmosDBTrigger("database", "collection", ConnectionStringSetting = "myCosmosDB")]
    IReadOnlyList<Document> documents,
        TraceWriter log)
    {
            log.Info("Documents modified " + documents.Count);
            log.Info("First document Id " + documents[0].Id);
    }
```

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

## Trigger - attributes

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
| |**LeaseOptions** | Configure lease options by setting properties in an instance of the [Change​Feed​Host​Options](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.changefeedprocessor.changefeedhostoptions) class.

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Trigger - usage

The trigger requires a second collection that it uses to store _leases_ over the partitions. Both the collection being monitored and the collection that contains the leases must be available for the trigger to work.

 >[!IMPORTANT]
 > If multiple functions are configured to use a Cosmos DB trigger for the same collection, each of the functions should use a dedicated lease collection. Otherwise, only one of the functions will be triggered. 

The trigger doesn't indicate whether a document was updated or inserted, it just provides the document itself. If you need to handle updates and inserts differently, you could do that by implementing timestamp fields for insertion or update.

## Input

The Azure Cosmos DB input binding retrieves one or more Azure Cosmos DB documents and passes them to the input parameter of the function. The document ID or query parameters can be determined based on the trigger that invokes the function. 

>[!NOTE]
> Don't use Azure Cosmos DB input or output bindings if you're using MongoDB API on a Cosmos DB account. Data corruption is possible.

## Input - example 1

See the language-specific example that reads a single document:

* [C#](#input---c-example)
* [C# script (.csx)](#input---c-script-example)
* [F#](#input---f-example)
* [JavaScript](#input---javascript-example)

### Input - C# example

The following example shows a [C# function](functions-dotnet-class-library.md) that retrieves a single document from a specific database and collection. 

First, `Id` and `Maker` values for a `CarReview` instance are passed to a queue. The Cosmos DB binding uses `Id` and `Maker` from the queue message to retrieve the document from the database.

```cs
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Host;

    namespace CosmosDB
    {
        public static class SingleEntry
        {
            [FunctionName("SingleEntry")]
            public static void Run(
                [QueueTrigger("car-reviews", Connection = "StorageConnectionString")] CarReview carReview,
                [DocumentDB("cars", "car-reviews", PartitionKey = "{maker}", Id= "{id}", ConnectionStringSetting = "CarReviewsConnectionString")] CarReview document,
                TraceWriter log)
            {
                log.Info( $"Selected Review - {document?.Review}"); 
            }
        }
    }
```

Here's the `CarReview` POCO:

 ```cs
    public class CarReview
    {
        public string Id { get; set; }
        public string Maker { get; set; }
        public string Description { get; set; }
        public string Model { get; set; }
        public string Image { get; set; }
        public string Review { get; set; }
    }
 ```

### Input - C# script example

The following example shows a Cosmos DB input binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function reads a single document and updates the document's text value.

Here's the binding data in the *function.json* file:

```json
{
    "name": "inputDocument",
    "type": "documentDB",
    "databaseName": "MyDatabase",
    "collectionName": "MyCollection",
    "id" : "{queueTrigger}",
    "partitionKey": "{partition key value}",
    "connection": "MyAccount_COSMOSDB",     
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

<a name="infsharp"></a>

### Input - F# example

The following example shows a Cosmos DB input binding in a *function.json* file and a [F# function](functions-reference-fsharp.md) that uses the binding. The function reads a single document and updates the document's text value.

Here's the binding data in the *function.json* file:

```json
{
    "name": "inputDocument",
    "type": "documentDB",
    "databaseName": "MyDatabase",
    "collectionName": "MyCollection",
    "id" : "{queueTrigger}",
    "connection": "MyAccount_COSMOSDB",     
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

### Input - JavaScript example

The following example shows a Cosmos DB input binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function reads a single document and updates the document's text value.

Here's the binding data in the *function.json* file:

```json
{
    "name": "inputDocumentIn",
    "type": "documentDB",
    "databaseName": "MyDatabase",
    "collectionName": "MyCollection",
    "id" : "{queueTrigger_payload_property}",
    "partitionKey": "{queueTrigger_payload_property}",
    "connection": "MyAccount_COSMOSDB",     
    "direction": "in"
},
{
    "name": "inputDocumentOut",
    "type": "documentDB",
    "databaseName": "MyDatabase",
    "collectionName": "MyCollection",
    "createIfNotExists": false,
    "partitionKey": "{queueTrigger_payload_property}",
    "connection": "MyAccount_COSMOSDB",
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

## Input - example 2

See the language-specific example that reads multiple documents:

* [C#](#input---c-example-2)
* [C# script (.csx)](#input---c-script-example-2)
* [JavaScript](#input---javascript-example-2)

### Input - C# example 2

The following example shows a [C# function](functions-dotnet-class-library.md) that executes a SQL query. To use the `SqlQuery` parameter, you need to install the latest beta version of `Microsoft.Azure.WebJobs.Extensions.DocumentDB` NuGet package.

```csharp
    using System.Net;
    using System.Net.Http;
    using System.Collections.Generic;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.Http;

    [FunctionName("CosmosDBSample")]
    public static HttpResponseMessage Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestMessage req,
        [DocumentDB("test", "test", ConnectionStringSetting = "CosmosDB", SqlQuery = "SELECT top 2 * FROM c order by c._ts desc")] IEnumerable<object> documents)
    {
        return req.CreateResponse(HttpStatusCode.OK, documents);
    }
```

### Input - C# script example 2

The following example shows an Azure Cosmos DB input binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function retrieves multiple documents specified by a SQL query, using a queue trigger to customize the query parameters.

The queue trigger provides a parameter `departmentId`. A queue message of `{ "departmentId" : "Finance" }` would return all records for the finance department. 

Here's the binding data in the *function.json* file:

```json
{
    "name": "documents",
    "type": "documentdb",
    "direction": "in",
    "databaseName": "MyDb",
    "collectionName": "MyCollection",
    "sqlQuery": "SELECT * from c where c.departmentId = {departmentId}",
    "connection": "CosmosDBConnection"
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

### Input - JavaScript example 2

The following example shows an Azure Cosmos DB input binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function retrieves multiple documents specified by a SQL query, using a queue trigger to customize the query parameters.

The queue trigger provides a parameter `departmentId`. A queue message of `{ "departmentId" : "Finance" }` would return all records for the finance department. 

Here's the binding data in the *function.json* file:

```json
{
    "name": "documents",
    "type": "documentdb",
    "direction": "in",
    "databaseName": "MyDb",
    "collectionName": "MyCollection",
    "sqlQuery": "SELECT * from c where c.departmentId = {departmentId}",
    "connection": "CosmosDBConnection"
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

## Input - attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [DocumentDB](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/v2.x/src/WebJobs.Extensions.DocumentDB/DocumentDBAttribute.cs) attribute.

The attribute's constructor takes the database name and collection name. For information about those settings and other properties that you can configure, see [the following configuration section](#input---configuration). 

## Input - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `DocumentDB` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type**     || Must be set to `documentdb`.        |
|**direction**     || Must be set to `in`.         |
|**name**     || Name of the binding parameter that represents the document in the function.  |
|**databaseName** |**DatabaseName** |The database containing the document.        |
|**collectionName** |**CollectionName** | The name of the collection that contains the document. |
|**id**    | **Id** | The ID of the document to retrieve. This property supports [binding expressions](functions-triggers-bindings.md#binding-expressions-and-patterns). Don't set both the **id** and **sqlQuery** properties. If you don't set either one, the entire collection is retrieved. |
|**sqlQuery**  |**SqlQuery**  | An Azure Cosmos DB SQL query used for retrieving multiple documents. The property supports runtime bindings, as in this example: `SELECT * FROM c where c.departmentId = {departmentId}`. Don't set both the **id** and **sqlQuery** properties. If you don't set either one, the entire collection is retrieved.|
|**connection**     |**ConnectionStringSetting**|The name of the app setting containing your Azure Cosmos DB connection string.        |
|**partitionKey**|**PartitionKey**|Specifies the partition key value for the lookup. May include binding parameters.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Input - usage

In C# and F# functions, when the function exits successfully, any changes made to the input document via named input parameters are automatically persisted. 

In JavaScript functions, updates are not made automatically upon function exit. Instead, use `context.bindings.<documentName>In` and `context.bindings.<documentName>Out` to make updates. See the [JavaScript example](#input---javascript-example).

## Output

The Azure Cosmos DB output binding lets you write a new document to an Azure Cosmos DB database. 

>[!NOTE]
> Don't use Azure Cosmos DB input or output bindings if you're using MongoDB API on a Cosmos DB account. Data corruption is possible.

## Output - example

See the language-specific example:

* [C#](#output---c-example)
* [C# script (.csx)](#output---c-script-example)
* [F#](#output---f-example)
* [JavaScript](#output---javascript-example)

### Output - C# example

The following example shows a [C# function](functions-dotnet-class-library.md) that adds a document to a database, using data provided in message from Queue storage.

```cs
    using System;
    using Microsoft.Azure.WebJobs;

    [FunctionName("QueueToDocDB")]        
    public static void Run(
        [QueueTrigger("myqueue-items", Connection = "AzureWebJobsStorage")] string myQueueItem,
        [DocumentDB("ToDoList", "Items", Id = "id", ConnectionStringSetting = "myCosmosDB")] out dynamic document)
    {
        document = new { Text = myQueueItem, id = Guid.NewGuid() };
    }
```

### Output - C# script example

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
    "type": "documentDB",
    "databaseName": "MyDatabase",
    "collectionName": "MyCollection",
    "createIfNotExists": true,
    "connection": "MyAccount_COSMOSDB",     
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

To create multiple documents, you can bind to `ICollector<T>` or `IAsyncCollector<T>` where `T` is one of the supported types.

### Output - F# example

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
    "type": "documentDB",
    "databaseName": "MyDatabase",
    "collectionName": "MyCollection",
    "createIfNotExists": true,
    "connection": "MyAccount_COSMOSDB",     
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

### Output - JavaScript example

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
    "type": "documentDB",
    "databaseName": "MyDatabase",
    "collectionName": "MyCollection",
    "createIfNotExists": true,
    "connection": "MyAccount_COSMOSDB",     
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

## Output - attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [DocumentDB](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/v2.x/src/WebJobs.Extensions.DocumentDB/DocumentDBAttribute.cs) attribute.

The attribute's constructor takes the database name and collection name. For information about those settings and other properties that you can configure, see [Output - configuration](#output---configuration). Here's a `DocumentDB` attribute example in a method signature:

```csharp
    [FunctionName("QueueToDocDB")]        
    public static void Run(
        [QueueTrigger("myqueue-items", Connection = "AzureWebJobsStorage")] string myQueueItem,
        [DocumentDB("ToDoList", "Items", Id = "id", ConnectionStringSetting = "myCosmosDB")] out dynamic document)
    {
        ...
    }
```

For a complete example, see [Output - C# example](#output---c-example).

## Output - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `DocumentDB` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type**     || Must be set to `documentdb`.        |
|**direction**     || Must be set to `out`.         |
|**name**     || Name of the binding parameter that represents the document in the function.  |
|**databaseName** | **DatabaseName**|The database containing the collection where the document is created.     |
|**collectionName** |**CollectionName**  | The name of the collection where the document is created. |
|**createIfNotExists**  |**CreateIfNotExists**    | A boolean value to indicate whether the collection is created when it doesn't exist. The default is *false* because new collections are created with reserved throughput, which has cost implications. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/documentdb/).  |
|**partitionKey**|**PartitionKey** |When `CreateIfNotExists` is true, defines the partition key path for the created collection.|
|**collectionThroughput**|**CollectionThroughput**| When `CreateIfNotExists` is true, defines the [throughput](../cosmos-db/set-throughput.md) of the created collection.|
|**connection**    |**ConnectionStringSetting** |The name of the app setting containing your Azure Cosmos DB connection string.        |

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Output - usage

By default, when you write to the output parameter in your function, a document is created in your database. This document has an automatically generated GUID as the document ID. You can specify the document ID of the output document by specifying the `id` property in the JSON object passed to the output parameter. 

> [!Note]  
> When you specify the ID of an existing document, it gets overwritten by the new output document. 

## Exceptions and return codes

| Binding | Reference |
|---|---|
| CosmosDB | [CosmosDB Error Codes](https://docs.microsoft.com/en-us/rest/api/cosmos-db/http-status-codes-for-cosmosdb) |

## Next steps

> [!div class="nextstepaction"]
> [Go to a quickstart that uses a Cosmos DB trigger](functions-create-cosmos-db-triggered-function.md)

> [!div class="nextstepaction"]
> [Learn more about serverless database computing with Cosmos DB](..\cosmos-db\serverless-computing-database.md)

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)
