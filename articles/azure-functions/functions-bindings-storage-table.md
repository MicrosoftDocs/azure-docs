---
title: Azure Functions Storage Table bindings | Microsoft Docs
description: Understand how to use Azure Storage bindings in Azure Functions.
services: functions
documentationcenter: na
author: christopheranderson
manager: erikre
editor: ''
tags: ''
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture

ms.assetid: 65b3437e-2571-4d3f-a996-61a74b50a1c2
ms.service: functions
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 10/28/2016
ms.author: chrande

---
# Azure Functions Storage table bindings
[!INCLUDE [functions-selector-bindings](../../includes/functions-selector-bindings.md)]

This article explains how to configure and code Azure Storage table bindings in Azure Functions. 
Azure Functions supports input and output bindings for Azure Storage tables.

The Storage table binding supports the following scenarios:

* **Read a single row in a C# or Node.js function** - Set `partitionKey` and `rowKey`. The `filter` and `take` properties are not used in this scenario.
* **Read multiple rows in a C# function** - The Functions runtime provides an `IQueryable<T>` object bound to the table. Type `T` must derive from `TableEntity` or implement `ITableEntity`. The `partitionKey`, `rowKey`, `filter`, and `take` properties are not used in this scenario; you can use the `IQueryable` object to do any filtering required. 
* **Read multiple rows in a Node function** - Set the `filter` and `take` properties. Don't set `partitionKey` or `rowKey`.
* **Write one or more rows in a C# function** - The Functions runtime provides an `ICollector<T>` or `IAsyncCollector<T>` bound to the table, where `T` specifies the schema of the entities you want to add. Typically, type `T` derives from `TableEntity` or implements `ITableEntity`, but it doesn't have to. The `partitionKey`, `rowKey`, `filter`, and `take` properties are not used in this scenario.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

<a name="input"></a>

## Storage table input binding
The Azure Storage table input binding enables you to use a storage table in your function. 

The Storage table input to a function uses the following JSON objects in the `bindings` array of function.json:

```json
{
    "name": "<Name of input parameter in function signature>",
    "type": "table",
    "direction": "in",
    "tableName": "<Name of Storage table>",
    "partitionKey": "<PartitionKey of table entity to read - see below>",
    "rowKey": "<RowKey of table entity to read - see below>",
    "take": "<Maximum number of entities to read in Node.js - optional>",
    "filter": "<OData filter expression for table input in Node.js - optional>",
    "connection": "<Name of app setting - see below>",
}
```

Note the following: 

* Use `partitionKey` and `rowKey` together to read a single entity. These properties are optional. 
* `connection` must contain the name of an app setting that contains a storage connection string. In the Azure portal, the standard editor in the **Integrate** tab configures this app setting for you when you create a Storage account or selects an existing one. You can also [configure this app setting manually](functions-how-to-use-azure-function-app-settings.md#settings).  

<a name="inputusage"></a>

## Input usage
In C# functions, you bind to the input table entity (or entities) by using a named parameter in your function signature, like `<T> <name>`.
Where `T` is the data type that you want to deserialize the data into, and `paramName` is the name you specified in the 
[input binding](#input). In Node.js functions, you access the input table entity (or entities) using `context.bindings.<name>`.

The input data can be deserialized in Node.js or C# functions. The deserialized objects have `RowKey` and `PartitionKey` properties.

In C# functions, you can also bind to any of the following types, and the Functions runtime will attempt to 
deserialize the table data using that type:

* Any type that implements `ITableEntity`
* `IQueryable<T>`

<a name="inputsample"></a>

## Input sample
Supposed you have the following function.json, which uses a queue trigger to read a single table row. The JSON specifies `PartitionKey` 
`RowKey`. `"rowKey": "{queueTrigger}"` indicates that the row key comes from the queue message string.

```json
{
  "bindings": [
    {
      "queueName": "myqueue-items",
      "connection": "MyStorageConnection",
      "name": "myQueueItem",
      "type": "queueTrigger",
      "direction": "in"
    },
    {
      "name": "personEntity",
      "type": "table",
      "tableName": "Person",
      "partitionKey": "Test",
      "rowKey": "{queueTrigger}",
      "connection": "MyStorageConnection",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

See the language-specific sample that reads a single table entity.

* [C#](#inputcsharp)
* [F#](#inputfsharp)
* [Node.js](#inputnodejs)

<a name="inputcsharp"></a>

### Input sample in C# #
```csharp
public static void Run(string myQueueItem, Person personEntity, TraceWriter log)
{
    log.Info($"C# Queue trigger function processed: {myQueueItem}");
    log.Info($"Name in Person entity: {personEntity.Name}");
}

public class Person
{
    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public string Name { get; set; }
}
```

<a name="inputfsharp"></a>

### Input sample in F# #
```fsharp
[<CLIMutable>]
type Person = {
  PartitionKey: string
  RowKey: string
  Name: string
}

let Run(myQueueItem: string, personEntity: Person) =
    log.Info(sprintf "F# Queue trigger function processed: %s" myQueueItem)
    log.Info(sprintf "Name in Person entity: %s" personEntity.Name)
```

<a name="inputnodejs"></a>

### Input sample in Node.js
```javascript
module.exports = function (context, myQueueItem) {
    context.log('Node.js queue trigger function processed work item', myQueueItem);
    context.log('Person entity name: ' + context.bindings.personEntity.Name);
    context.done();
};
```

<a name="output"></a>

## Storage table output binding
The Azure Storage table output binding enables you to write entities to a Storage table in your function. 

The Storage table output for a function uses the following JSON objects in the `bindings` array of function.json:

```json
{
    "name": "<Name of input parameter in function signature>",
    "type": "table",
    "direction": "out",
    "tableName": "<Name of Storage table>",
    "partitionKey": "<PartitionKey of table entity to write - see below>",
    "rowKey": "<RowKey of table entity to write - see below>",
    "connection": "<Name of app setting - see below>",
}
```

Note the following: 

* Use `partitionKey` and `rowKey` together to write a single entity. These properties are optional. You can also
  specify `PartitionKey` and `RowKey` when you create the entity objects in your function code.
* `connection` must contain the name of an app setting that contains a storage connection string. In the Azure portal, the standard editor in the **Integrate** tab configures this app setting for you when you create a Storage account or selects an existing one. You can also [configure this app setting manually](functions-how-to-use-azure-function-app-settings.md#settings). 

<a name="outputusage"></a>

## Output usage
In C# functions, you bind to the table output by using the named `out` parameter in your function signature, like `out <T> <name>`,
where `T` is the data type that you want to serialize the data into, and `paramName` is the name you specified in the 
[output binding](#output). In Node.js functions, you access the table output using `context.bindings.<name>`.

You can serialize objects in Node.js or C# functions. In C# functions, you can also bind to the following types:

* Any type that implements `ITableEntity`
* `ICollector<T>` (to output multiple entities. See [sample](#outcsharp).)
* `IAsyncCollector<T>` (async version of `ICollector<T>`)
* `CloudTable` (using the Azure Storage SDK. See [sample](#readmulti).)

<a name="outputsample"></a>

## Output sample
The following *function.json* and *run.csx* example shows how to write multiple table entities.

```json
{
  "bindings": [
    {
      "name": "input",
      "type": "manualTrigger",
      "direction": "in"
    },
    {
      "tableName": "Person",
      "connection": "MyStorageConnection",
      "name": "tableBinding",
      "type": "table",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

See the language-specific sample that creates multiple table entities.

* [C#](#outcsharp)
* [F#](#outfsharp)
* [Node.js](#outnodejs)

<a name="outcsharp"></a>

### Output sample in C# #
```csharp
public static void Run(string input, ICollector<Person> tableBinding, TraceWriter log)
{
    for (int i = 1; i < 10; i++)
        {
            log.Info($"Adding Person entity {i}");
            tableBinding.Add(
                new Person() { 
                    PartitionKey = "Test", 
                    RowKey = i.ToString(), 
                    Name = "Name" + i.ToString() }
                );
        }

}

public class Person
{
    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public string Name { get; set; }
}

```
<a name="outfsharp"></a>

### Output sample in F# #
```fsharp
[<CLIMutable>]
type Person = {
  PartitionKey: string
  RowKey: string
  Name: string
}

let Run(input: string, tableBinding: ICollector<Person>, log: TraceWriter) =
    for i = 1 to 10 do
        log.Info(sprintf "Adding Person entity %d" i)
        tableBinding.Add(
            { PartitionKey = "Test"
              RowKey = i.ToString()
              Name = "Name" + i.ToString() })
```

<a name="outnodejs"></a>

### Output sample in Node.js
```javascript
module.exports = function (context) {

    context.bindings.tableBinding = [];

    for (var i = 1; i < 10; i++) {
        context.bindings.tableBinding.push({
            PartitionKey: "Test",
            RowKey: i.toString(),
            Name: "Name " + i
        });
    }
    
    context.done();
};
```

<a name="readmulti"></a>

## Sample: Read multiple table entities in C#  #
The following *function.json* and C# code example reads entities for a partition key that is specified in the queue message.

```json
{
  "bindings": [
    {
      "queueName": "myqueue-items",
      "connection": "MyStorageConnection",
      "name": "myQueueItem",
      "type": "queueTrigger",
      "direction": "in"
    },
    {
      "name": "tableBinding",
      "type": "table",
      "connection": "MyStorageConnection",
      "tableName": "Person",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

The C# code adds a reference to the Azure Storage SDK so that the entity type can derive from `TableEntity`.

```csharp
#r "Microsoft.WindowsAzure.Storage"
using Microsoft.WindowsAzure.Storage.Table;

public static void Run(string myQueueItem, IQueryable<Person> tableBinding, TraceWriter log)
{
    log.Info($"C# Queue trigger function processed: {myQueueItem}");
    foreach (Person person in tableBinding.Where(p => p.PartitionKey == myQueueItem).ToList())
    {
        log.Info($"Name: {person.Name}");
    }
}

public class Person : TableEntity
{
    public string Name { get; set; }
}
```

## Next steps
[!INCLUDE [next steps](../../includes/functions-bindings-next-steps.md)]

