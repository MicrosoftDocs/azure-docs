---
title: Azure Functions DocumentDB bindings | Microsoft Docs
description: Understand how to use Azure DocumentDB bindings in Azure Functions.
services: functions
documentationcenter: na
author: christopheranderson
manager: erikre
editor: ''
tags: ''
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture

ms.assetid: 3d8497f0-21f3-437d-ba24-5ece8c90ac85
ms.service: functions
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 04/18/2016
ms.author: chrande; glenga

---
# Azure Functions DocumentDB bindings
[!INCLUDE [functions-selector-bindings](../../includes/functions-selector-bindings.md)]

This article explains how to configure and code Azure DocumentDB bindings in Azure Functions. 
Azure Functions supports input and output bindings for DocumentDB.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

For more information on DocumentDB, see [Introduction to DocumentDB](../documentdb/documentdb-introduction.md) 
and [Build a DocumentDB console application](../documentdb/documentdb-get-started.md).

<a id="docdbinput"></a>

## DocumentDB input binding
The DocumentDB input binding retrieves a DocumentDB document and passes it to the named input parameter of the function. The document ID can be determined based on the trigger that invokes the function. 

The DocumentDB input binding has the following properties in *function.json*:

- `name` : Identifier name used in function code for the document
- `type` : must be set to "documentdb"
- `databaseName` : The database containing the document
- `collectionName` : The collection containing the document
- `id` : The Id of the document to retrieve. This property supports bindings parameters; see [Bind to custom input properties in a binding expression](functions-triggers-bindings.md#bind-to-custom-input-properties-in-a-binding-expression) in the article [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md).
- `sqlQuery` : A DocumentDB SQL query used for retrieving multiple documents. The query supports runtime bindings. For example: `SELECT * FROM c where c.departmentId = {departmentId}`
- `connection` : The name of the app setting containing your DocumentDB connection string
- `direction`  : must be set to `"in"`.

The properties `id` and `sqlQuery` cannot both be specified. If neither `id` nor `sqlQuery` is set, the entire collection is retrieved.

## Using a DocumentDB input binding

* In C# and F# functions, when the function exits successfully, any changes made to the input document via named input parameters are automatically persisted. 
* In JavaScript functions, updates are not made automatically upon function exit. Instead, use `context.bindings.<documentName>In` and `context.bindings.<documentName>Out` to make updates. See the [JavaScript sample](#injavascript).

<a name="inputsample"></a>

## Input sample for single document
Suppose you have the following DocumentDB input binding in the `bindings` array of function.json:

```json
{
  "name": "inputDocument",
  "type": "documentDB",
  "databaseName": "MyDatabase",
  "collectionName": "MyCollection",
  "id" : "{queueTrigger}",
  "connection": "MyAccount_DOCUMENTDB",     
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
// Change input document contents using DocumentDB input binding 
public static void Run(string myQueueItem, dynamic inputDocument)
{   
  inputDocument.text = "This has changed.";
}
```
<a name="infsharp"></a>

### Input sample in F# #

```fsharp
(* Change input document contents using DocumentDB input binding *)
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
// Change input document contents using DocumentDB input binding, using context.bindings.inputDocumentOut
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
    "connection": "DocumentDBConnection"
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

## <a id="docdboutput"></a>DocumentDB output binding
The DocumentDB output binding lets you write a new document to an Azure DocumentDB database. 
It has the following properties in *function.json*:

- `name` : Identifier used in function code for the new document
- `type` : must be set to `"documentdb"`
- `databaseName` : The database containing the collection where the new document will be created.
- `collectionName` : The collection where the new document will be created.
- `createIfNotExists` : A boolean value to indicate whether the collection will be created if it does not exist. The default is *false*. The reason for this is new collections are created with reserved throughput, which has pricing implications. For more details, please visit the [pricing page](https://azure.microsoft.com/pricing/details/documentdb/).
- `connection` : The name of the app setting containing your DocumentDB connection string
- `direction` : must be set to `"out"`

## Using a DocumentDB output binding
This section shows you how to use your DocumentDB output binding in your function code.

When you write to the output parameter in your function, by default a new document is generated in your database, with an automatically generated GUID as the document ID. You can specify the document ID of output document by specifying the `id` JSON property in
the output parameter. 

>[!Note]  
>When you specify the ID of an existing document, it gets overwritten by the new output document. 

To output multiple documents, you can also bind to `ICollector<T>` or `IAsyncCollector<T>` where `T` is one of the supported types.

<a name="outputsample"></a>

## DocumentDB output binding sample
Suppose you have the following DocumentDB output binding in the `bindings` array of function.json:

```json
{
  "name": "employeeDocument",
  "type": "documentDB",
  "databaseName": "MyDatabase",
  "collectionName": "MyCollection",
  "createIfNotExists": true,
  "connection": "MyAccount_DOCUMENTDB",     
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

And you want to create DocumentDB documents in the following format for each record:

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
