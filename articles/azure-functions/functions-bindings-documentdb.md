---
title: Azure Cosmos DB bindings for Functions | Microsoft Docs
description: Understand how to use Azure Cosmos DB triggers and bindings in Azure Functions.
services: functions
documentationcenter: na
author: christopheranderson
manager: cfowler
editor: ''
tags: ''
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture

ms.assetid: 3d8497f0-21f3-437d-ba24-5ece8c90ac85
ms.service: functions; cosmos-db
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 09/19/2017
ms.author: glenga

---
# Azure Cosmos DB bindings for Functions
[!INCLUDE [functions-selector-bindings](../../includes/functions-selector-bindings.md)]

This article explains how to configure and code Azure Cosmos DB bindings in Azure Functions. Functions supports trigger, input, and output bindings for Azure Cosmos DB.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

For more information on serverless computing with Azure Cosmos DB, see [Azure Cosmos DB: Serverless database computing using Azure Functions](..\cosmos-db\serverless-computing-database.md).

<a id="trigger"></a>
<a id="cosmosdbtrigger"></a>

## Azure Cosmos DB trigger

The Azure Cosmos DB Trigger uses the [Azure Cosmos DB Change Feed](../cosmos-db/change-feed.md) to listen for changes across partitions. The trigger requires a second collection that it uses to store _leases_ over the partitions.

Both the collection being monitored and the collection that contains the leases must be available for the trigger to work.

The Azure Cosmos DB trigger supports the following properties:

|Property  |Description  |
|---------|---------|
|**type** | Must be set to `cosmosDBTrigger`. |
|**name** | The variable name used in function code that represents the list of documents with changes. | 
|**direction** | Must be set to `in`. This parameter is set automatically when you create the trigger in the Azure portal. |
|**connectionStringSetting** | The name of an app setting that contains the connection string used to connect to the Azure Cosmos DB account being monitored. |
|**databaseName** | The name of the Azure Cosmos DB database with the collection being monitored. |
|**collectionName** | The name of the collection being monitored. |
| **leaseConnectionStringSetting** | (Optional) The name of an app setting that contains the connection string to the service which holds the lease collection. When not set, the `connectionStringSetting` value is used. This parameter is automatically set when the binding is created in the portal. |
| **leaseDatabaseName** | (Optional) The name of the database that holds the collection used to store leases. When not set, the value of the `databaseName` setting is used. This parameter is automatically set when the binding is created in the portal. |
| **leaseCollectionName** | (Optional) The name of the collection used to store leases. When not set, the value `leases` is used. |
| **createLeaseCollectionIfNotExists** | (Optional) When set to `true`, the leases collection is automatically created when it doesn't already exist. The default value is `false`. |
| **leaseCollectionThroughput** | (Optional) Defines the amount of Request Units to assign when the leases collection is created. This setting is only used When `createLeaseCollectionIfNotExists` is set to `true`. This parameter is  automatically set when the binding is created using the portal.

>[!NOTE] 
>The connection string used to connect to the leases collection must have write permissions.

These properties can be set in the Integrate tab for the function in the Azure portal or by editing the `function.json` project file.

## Using an Azure Cosmos DB trigger

This section contains examples of how to use the Azure Cosmos DB trigger. The examples assume a trigger metadata that looks like the following:

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
 
For an example of how to create a Azure Cosmos DB trigger from a function app in the portal, see [Create a function triggered by Azure Cosmos DB](functions-create-cosmos-db-triggered-function.md). 

### Trigger sample in C# #
```cs 
	#r "Microsoft.Azure.Documents.Client"
	using Microsoft.Azure.Documents;
	using System.Collections.Generic;
	using System;
	public static void Run(IReadOnlyList<Document> documents, TraceWriter log)
	{
		log.Verbose("Documents modified " + documents.Count);
		log.Verbose("First document Id " + documents[0].Id);
	}
```


### Trigger sample in JavaScript
```javascript
	module.exports = function (context, documents) {
		context.log('First document Id modified : ', documents[0].id);

		context.done();
	}
```

<a id="docdbinput"></a>

## DocumentDB API input binding
The DocumentDB API input binding retrieves an Azure Cosmos DB document and passes it to the named input parameter of the function. The document ID can be determined based on the trigger that invokes the function. 

The DocumentDB API input binding has the following properties in *function.json*:

|Property  |Description  |
|---------|---------|
|**name**     | Name of the binding parameter that represents the document in the function.  |
|**type**     | Must be set to `documentdb`.        |
|**databaseName** | The database containing the document.        |
|**collectionName**  | The name of the collection that contains the document. |
|**id**     | The ID of the document to retrieve. This property supports bindings parameters. To learn more, see [Bind to custom input properties in a binding expression](functions-triggers-bindings.md#bind-to-custom-input-properties-in-a-binding-expression). |
|**sqlQuery**     | An Azure Cosmos DB SQL query used for retrieving multiple documents. The query supports runtime bindings, such in the example: `SELECT * FROM c where c.departmentId = {departmentId}`.        |
|**connection**     |The name of the app setting containing your Azure Cosmos DB connection string.        |
|**direction**     | Must be set to `in`.         |

You cannot set both the **id** and **sqlQuery** properties. If neither are set, the entire collection is retrieved.

## Using a DocumentDB API input binding

* In C# and F# functions, when the function exits successfully, any changes made to the input document via named input parameters are automatically persisted. 
* In JavaScript functions, updates are not made automatically upon function exit. Instead, use `context.bindings.<documentName>In` and `context.bindings.<documentName>Out` to make updates. See the [JavaScript sample](#injavascript).

<a name="inputsample"></a>

## Input sample for single document
Suppose you have the following DocumentDB API input binding in the `bindings` array of function.json:

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

See the language-specific sample that uses this input binding to update the document's text value.

* [C#](#incsharp)
* [F#](#infsharp)
* [JavaScript](#injavascript)

<a name="incsharp"></a>
### Input sample in C# #

```cs
// Change input document contents using DocumentDB API input binding 
public static void Run(string myQueueItem, dynamic inputDocument)
{   
  inputDocument.text = "This has changed.";
}
```
<a name="infsharp"></a>

### Input sample in F# #

```fsharp
(* Change input document contents using DocumentDB API input binding *)
open FSharp.Interop.Dynamic
let Run(myQueueItem: string, inputDocument: obj) =
  inputDocument?text <- "This has changed."
```

This sample requires a `project.json` file that specifies the `FSharp.Interop.Dynamic` and `Dynamitey` NuGet 
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

<a name="injavascript"></a>

### Input sample in JavaScript

```javascript
// Change input document contents using DocumentDB API input binding, using context.bindings.inputDocumentOut
module.exports = function (context) {   
  context.bindings.inputDocumentOut = context.bindings.inputDocumentIn;
  context.bindings.inputDocumentOut.text = "This was updated!";
  context.done();
};
```

## Input sample with multiple documents

Suppose that you wish to retrieve multiple documents specified by a SQL query, using a queue trigger to customize the query parameters. 

In this example, the queue trigger provides a parameter `departmentId`.A queue message of `{ "departmentId" : "Finance" }` would return all records for the finance department. Use the following in *function.json*:

```
{
    "name": "documents",
    "type": "documentdb",
    "direction": "in",
    "databaseName": "MyDb",
    "collectionName": "MyCollection",
    "sqlQuery": "SELECT * from c where c.departmentId = {departmentId}"
    "connection": "CosmosDBConnection"
}
```

### Input sample with multiple documents in C#

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

### Input sample with multiple documents in JavaScript

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

## <a id="docdboutput"></a>DocumentDB API output binding
The DocumentDB API output binding lets you write a new document to an Azure Cosmos DB database. 
It has the following properties in *function.json*:

|Property  |Description  |
|---------|---------|
|**name**     | Name of the binding parameter that represents the document in the function.  |
|**type**     | Must be set to `documentdb`.        |
|**databaseName** | The database containing the collection where the document is created.     |
|**collectionName**  | The name of the collection where the document is created. |
|**createIfNotExists**     | A boolean value to indicate whether the collection is created when it doesn't exist. The default is *false*. This is because new collections are created with reserved throughput, which has cost implications. For more details, please visit the [pricing page](https://azure.microsoft.com/pricing/details/documentdb/).  |
|**connection**     |The name of the app setting containing your Azure Cosmos DB connection string.        |
|**direction**     | Must be set to `out`.         |

## Using a DocumentDB API output binding
This section shows you how to use your DocumentDB API output binding in your function code.

By default, when you write to the output parameter in your function, a document is created in your database. This document has an automatically generated GUID as the document ID. You can specify the document ID of output document by specifying the `id` property in the JSON object passed to the output parameter. 

>[!Note]  
>When you specify the ID of an existing document, it gets overwritten by the new output document. 

To output multiple documents, you can also bind to `ICollector<T>` or `IAsyncCollector<T>` where `T` is one of the supported types.

<a name="outputsample"></a>

## DocumentDB API output binding sample
Suppose you have the following DocumentDB API output binding in the `bindings` array of function.json:

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

And you have a queue input binding for a queue that receives JSON in the following format:

```json
{
  "name": "John Henry",
  "employeeId": "123456",
  "address": "A town nearby"
}
```

And you want to create Azure Cosmos DB documents in the following format for each record:

```json
{
  "id": "John Henry-123456",
  "name": "John Henry",
  "employeeId": "123456",
  "address": "A town nearby"
}
```

See the language-specific sample that uses this output binding to add documents to your database.

* [C#](#outcsharp)
* [F#](#outfsharp)
* [JavaScript](#outjavascript)

<a name="outcsharp"></a>

### Output sample in C# #

```cs
#r "Newtonsoft.Json"

using System;
using Newtonsoft.Json;
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

<a name="outfsharp"></a>

### Output sample in F# #

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

This sample requires a `project.json` file that specifies the `FSharp.Interop.Dynamic` and `Dynamitey` NuGet 
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

<a name="outjavascript"></a>

### Output sample in JavaScript

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
