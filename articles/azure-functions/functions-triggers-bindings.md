---
title: Work with triggers and bindings in Azure Functions | Microsoft Docs
description: Learn how to use triggers and bindings in Azure Functions to connect your code execution to online events and cloud-based services.
services: functions
documentationcenter: na
author: lindydonna
manager: erikre
editor: ''
tags: ''
keywords: azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture

ms.assetid: cbc7460a-4d8a-423f-a63e-1cd33fef7252
ms.service: functions
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 05/30/2017
ms.author: donnam

---

# Azure Functions triggers and bindings concepts
Azure Functions allows you to write code in response to events in Azure and other services, through *triggers* and *bindings*. This article is a conceptual overview of triggers and bindings for all supported programming languages. Features that are common to all bindings are described here.

## Overview

Triggers and bindings are a declarative way to define how a function is invoked and what data it works with. A *trigger* defines how a function is invoked. A function must have exactly one trigger. Triggers have associated data, which is usually the payload that triggered the function. 

Input and output *bindings* provide a declarative way to connect to data from within your code. Similar to triggers, you specify connection strings and other properties in your function configuration. Bindings are optional and a function can have multiple input and output bindings. 

Using triggers and bindings, you can write code that is more generic and does not hardcode the details of the services with which it interacts. Data coming from services simply become input values for your function code. To output data to another service (such as creating a new row in Azure Table Storage), use the return value of the method. Or, if you need to output multiple values, use a helper object. Triggers and bindings have a **name** property, which is an identifier you use in your code to access the binding.

You can configure triggers and bindings in the **Integrate** tab in the Azure Functions portal. Under the covers, the UI modifies a file called *function.json* file in the function directory. You can edit this file by changing to the **Advanced editor**.

The following table shows the triggers and bindings that are supported with Azure Functions. 

[!INCLUDE [Full bindings table](../../includes/functions-bindings.md)]

### Example: queue trigger and table output binding

Suppose you want to write a new row to Azure Table Storage whenever a new message appears in Azure Queue Storage. This scenario can be implemented using an Azure Queue trigger and a Table output binding. 

A queue trigger requires the following information in the **Integrate** tab:

* The name of the app setting that contains the storage account connection string for the queue
* The queue name
* The identifier in your code to read the contents of the queue message, such as `order`.

To write to Azure Table Storage, use an output binding with the following details:

* The name of the app setting that contains the storage account connection string for the table
* The table name
* The identifier in your code to create output items, or the return value from the function.

Bindings use app settings for connection strings to enforce the best practice that *function.json* does not contain service secrets.

Then, use the identifiers you provided to integrate with Azure Storage in your code.

```cs
#r "Newtonsoft.Json"

using Newtonsoft.Json.Linq;

// From an incoming queue message that is a JSON object, add fields and write to Table Storage
// The method return value creates a new row in Table Storage
public static Person Run(JObject order, TraceWriter log)
{
    return new Person() { 
            PartitionKey = "Orders", 
            RowKey = Guid.NewGuid().ToString(),  
            Name = order["Name"].ToString(),
            MobileNumber = order["MobileNumber"].ToString() };  
}
 
public class Person
{
    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public string Name { get; set; }
    public string MobileNumber { get; set; }
}
```

```javascript
// From an incoming queue message that is a JSON object, add fields and write to Table Storage
// The second parameter to context.done is used as the value for the new row
module.exports = function (context, order) {
    order.PartitionKey = "Orders";
    order.RowKey = generateRandomId(); 

    context.done(null, order);
};

function generateRandomId() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}
```

Here is the *function.json* that corresponds to the preceding code. Note that the same configuration can be used, regardless of the language of the function implementation.

```json
{
  "bindings": [
    {
      "name": "order",
      "type": "queueTrigger",
      "direction": "in",
      "queueName": "myqueue-items",
      "connection": "MY_STORAGE_ACCT_APP_SETTING"
    },
    {
      "name": "$return",
      "type": "table",
      "direction": "out",
      "tableName": "outTable",
      "connection": "MY_TABLE_STORAGE_ACCT_APP_SETTING"
    }
  ]
}
```
To view and edit the contents of *function.json* in the Azure portal, click the **Advanced editor** option on the **Integrate** tab of your function.

For more code examples and details on integrating with Azure Storage, see [Azure Functions triggers and bindings for Azure Storage](functions-bindings-storage.md).

### Binding direction

All triggers and bindings have a `direction` property:

- For triggers, the direction is always `in`
- Input and output bindings use `in` and `out`
- Some bindings support a special direction `inout`. If you use `inout`, only the **Advanced editor** is available in the **Integrate** tab.

## Using the function return type to return a single output

The preceding example shows how to use the function return value to provide output to a binding, which is achieved by using the special name parameter `$return`. (This is only supported in languages that have a return value, such as C#, JavaScript, and F#.) If a function has multiple output bindings, use `$return` for only one of the output bindings. 

```json
// excerpt of function.json
{
    "name": "$return",
    "type": "blob",
    "direction": "out",
    "path": "output-container/{id}"
}
```

The examples below show how return types are used with output bindings in C#, JavaScript, and F#.

```cs
// C# example: use method return value for output binding
public static string Run(WorkItem input, TraceWriter log)
{
    string json = string.Format("{{ \"id\": \"{0}\" }}", input.Id);
    log.Info($"C# script processed queue message. Item={json}");
    return json;
}
```

```cs
// C# example: async method, using return value for output binding
public static Task<string> Run(WorkItem input, TraceWriter log)
{
    string json = string.Format("{{ \"id\": \"{0}\" }}", input.Id);
    log.Info($"C# script processed queue message. Item={json}");
    return json;
}
```

```javascript
// JavaScript: return a value in the second parameter to context.done
module.exports = function (context, input) {
    var json = JSON.stringify(input);
    context.log('Node.js script processed queue message', json);
    context.done(null, json);
}
```

```fsharp
// F# example: use return value for output binding
let Run(input: WorkItem, log: TraceWriter) =
    let json = String.Format("{{ \"id\": \"{0}\" }}", input.Id)   
    log.Info(sprintf "F# script processed queue message '%s'" json)
    json
```

## Binding dataType property

In .NET, use the types to define the data type for input data. For instance, use `string` to bind to the text of a queue trigger and a byte array to read as binary.

For languages that are dynamically typed such as JavaScript, use the `dataType` property in the binding definition. For example, to read the content of an HTTP request in binary format, use the type `binary`:

```json
{
    "type": "httpTrigger",
    "name": "req",
    "direction": "in",
    "dataType": "binary"
}
```

Other options for `dataType` are `stream` and `string`.

## Resolving app settings
As a best practice, secrets and connection strings should be managed using app settings, rather than configuration files. This limits access to these secrets and makes it safe to store *function.json* in a public source control repository.

App settings are also useful whenever you want to change configuration based on the environment. For example, in a test environment, you may want to monitor a different queue or blob storage container.

App settings are resolved whenever a value is enclosed in percent signs, such as `%MyAppSetting%`. Note that the `connection` property of triggers and bindings is a special case and automatically resolves values as app settings. 

The following example is a queue trigger that uses an app setting `%input-queue-name%` to define the queue to trigger on.

```json
{
  "bindings": [
    {
      "name": "order",
      "type": "queueTrigger",
      "direction": "in",
      "queueName": "%input-queue-name%",
      "connection": "MY_STORAGE_ACCT_APP_SETTING"
    }
  ]
}
```

## Trigger metadata properties

In addition to the data payload provided by a trigger (such as the queue message that triggered a function), many triggers provide additional metadata values. These values can be used as input parameters in C# and F# or properties on the `context.bindings` object in JavaScript. 

For example, a queue trigger supports the following properties:

* QueueTrigger - triggering message content if a valid string
* DequeueCount
* ExpirationTime
* Id
* InsertionTime
* NextVisibleTime
* PopReceipt

Details of metadata properties for each trigger are described in the corresponding reference topic. Documentation is also available in the **Integrate** tab of the portal, in the **Documentation** section below the binding configuration area.  

For example, since blob triggers have some delays, you can use a queue trigger to run your function (see [Blob Storage Trigger](functions-bindings-storage-blob.md#storage-blob-trigger). The queue message would contain the blob filename to trigger on. Using the `queueTrigger` metadata property, you can specify this behavior all in your configuration, rather than your code.

```json
  "bindings": [
    {
      "name": "myQueueItem",
      "type": "queueTrigger",
      "queueName": "myqueue-items",
      "connection": "MyStorageConnection",
    },
    {
      "name": "myInputBlob",
      "type": "blob",
      "path": "samples-workitems/{queueTrigger}",
      "direction": "in",
      "connection": "MyStorageConnection"
    }
  ]
```

Metadata properties from a trigger can also be used in a *binding expression* for another binding, as described in the following section.

## Binding expressions and patterns

One of the most powerful features of triggers and bindings is *binding expressions*. Within your binding, you can define pattern expressions which can then be used in other bindings or your code. Trigger metadata can also be used in binding expressions, as show in the sample in the preceding section.

For example, suppose you want to resize images in particular blob storage container, similar to the **Image Resizer** template in the **New Function** page. Go to **New Function** -> Language **C#** -> Scenario **Samples** -> **ImageResizer-CSharp**. 

Here is the *function.json* definition:

```json
{
  "bindings": [
    {
      "name": "image",
      "type": "blobTrigger",
      "path": "sample-images/{filename}",
      "direction": "in",
      "connection": "MyStorageConnection"
    },
    {
      "name": "imageSmall",
      "type": "blob",
      "path": "sample-images-sm/{filename}",
      "direction": "out",
      "connection": "MyStorageConnection"
    }
  ],
}
```

Notice that the `filename` parameter is used in both the blob trigger definition as well as the blob output binding. This parameter can also be used in function code.

```csharp
// C# example of binding to {filename}
public static void Run(Stream image, string filename, Stream imageSmall, TraceWriter log)  
{
    log.Info($"Blob trigger processing: {filename}");
    // ...
} 
```

<!--TODO: add JavaScript example -->
<!-- Blocked by bug https://github.com/Azure/Azure-Functions/issues/248 -->


### Random GUIDs
Azure Functions provides a convenience syntax for generating GUIDs in your bindings, through the `{rand-guid}` binding expression. The following example uses this to generate a unique blob name: 

```json
{
  "type": "blob",
  "name": "blobOutput",
  "direction": "out",
  "path": "my-output-container/{rand-guid}"
}
```

### Current time

You can use the binding expression `DateTime`, which resolves to `DateTime.UtcNow`.

```json
{
  "type": "blob",
  "name": "blobOutput",
  "direction": "out",
  "path": "my-output-container/{DateTime}"
}
```

## Bind to custom input properties in a binding expression

Binding expressions can also reference properties that are defined in the trigger payload itself. For example, you may want to dynamically bind to a blob storage file from a filename provided in a webhook.

For example, the following *function.json* uses a property called `BlobName` from the trigger payload:

```json
{
  "bindings": [
    {
      "name": "info",
      "type": "httpTrigger",
      "direction": "in",
      "webHookType": "genericJson",
    },
    {
      "name": "blobContents",
      "type": "blob",
      "direction": "in",
      "path": "strings/{BlobName}",
      "connection": "AzureWebJobsStorage"
    },
    {
      "name": "res",
      "type": "http",
      "direction": "out"
    }
  ]
}
```

To accomplish this in C# and F#, you must define a POCO that defines the fields that will be deserialized in the trigger payload.

```csharp
using System.Net;

public class BlobInfo
{
    public string BlobName { get; set; }
}
  
public static HttpResponseMessage Run(HttpRequestMessage req, BlobInfo info, string blobContents)
{
    if (blobContents == null) {
        return req.CreateResponse(HttpStatusCode.NotFound);
    } 

    return req.CreateResponse(HttpStatusCode.OK, new {
        data = $"{blobContents}"
    });
}
```

In JavaScript, JSON deserialization is automatically performed and you can use the properties directly.

```javascript
module.exports = function (context, info) {
    if ('BlobName' in info) {
        context.res = {
            body: { 'data': context.bindings.blobContents }
        }
    }
    else {
        context.res = {
            status: 404
        };
    }
    context.done();
}
```

## Configuring binding data at runtime

In C# and other .NET languages, you can use an imperative binding pattern, as opposed to the declarative bindings in *function.json*. Imperative binding is useful when binding parameters need to be computed at runtime rather than design time. To learn more, see [Binding at runtime via imperative bindings](functions-reference-csharp.md#imperative-bindings) in the C# developer reference.

## Next steps
For more information on a specific binding, see the following articles:

- [HTTP and webhooks](functions-bindings-http-webhook.md)
- [Timer](functions-bindings-timer.md)
- [Queue storage](functions-bindings-storage-queue.md)
- [Blob storage](functions-bindings-storage-blob.md)
- [Table storage](functions-bindings-storage-table.md)
- [Event Hub](functions-bindings-event-hubs.md)
- [Service Bus](functions-bindings-service-bus.md)
- [Cosmos DB](functions-bindings-documentdb.md)
- [SendGrid](functions-bindings-sendgrid.md)
- [Twilio](functions-bindings-twilio.md)
- [Notification Hubs](functions-bindings-notification-hubs.md)
- [Mobile Apps](functions-bindings-mobile-apps.md)
- [External file](functions-bindings-external-file.md)
