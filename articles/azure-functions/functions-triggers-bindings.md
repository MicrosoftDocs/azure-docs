---
title: Triggers and bindings in Azure Functions
description: Learn how to use triggers and bindings in Azure Functions to connect your code execution to online events and cloud-based services.
services: functions
documentationcenter: na
author: ggailey777
manager: cfowler
editor: ''
tags: ''
keywords: azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture

ms.service: functions
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 11/21/2017
ms.author: glenga
---

# Azure Functions triggers and bindings concepts

This article is a conceptual overview of triggers and bindings in Azure Functions. Features that are common to all bindings and all supported languages are described here.

## Overview

A *trigger* defines how a function is invoked. A function must have exactly one trigger. Triggers have associated data, which is usually the payload that triggered the function.

Input and output *bindings* provide a declarative way to connect to data from within your code. Bindings are optional and a function can have multiple input and output bindings. 

Triggers and bindings let you avoid hardcoding the details of the services that you're working with. You function receives data (for example, the content of a queue message) in function parameters. You send data (for example, to create a queue message) by using the return value of the function, an `out` parameter, or a [collector object](functions-reference-csharp.md#writing-multiple-output-values).

When you develop functions by using the Azure portal, triggers and bindings are configured in a *function.json* file. The portal provides a UI for this configuration but you can edit the file directly by changing to the **Advanced editor**.

When you develop functions by using Visual Studio to create a class library, you configure triggers and bindings by decorating methods and parameters with attributes.

## Supported bindings

[!INCLUDE [Full bindings table](../../includes/functions-bindings.md)]

For information about which bindings are in preview or are approved for production use, see [Supported languages](supported-languages.md).

## Example: queue trigger and table output binding

Suppose you want to write a new row to Azure Table storage whenever a new message appears in Azure Queue storage. This scenario can be implemented using an Azure Queue storage trigger and an Azure Table storage output binding. 

Here's a *function.json* file for this scenario. 

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

The first element in the `bindings` array is the Queue storage trigger. The `type` and `direction` properties identify the trigger. The `name` property identifies the function parameter that will receive the queue message content. The name of the queue to monitor is in `queueName`, and the connection string is in the app setting identified by `connection`.

The second element in the `bindings` array is the Azure Table Storage output binding. The `type` and `direction` properties identify the binding. The `name` property specifies how the function will provide the new table row, in this case by using the function return value. The name of the table is in `tableName`, and the connection string is in the app setting identified by `connection`.

To view and edit the contents of *function.json* in the Azure portal, click the **Advanced editor** option on the **Integrate** tab of your function.

> [!NOTE]
> The value of `connection` is the name of an app setting that contains the connection string, not the connection string itself. Bindings use connection strings stored in app settings to enforce the best practice that *function.json* does not contain service secrets.

Here's C# script code that works with this trigger and binding. Notice that the name of the parameter that provides the queue message content is `order`; this name is required because the `name` property value in *function.json* is `order` 

```cs
#r "Newtonsoft.Json"

using Newtonsoft.Json.Linq;

// From an incoming queue message that is a JSON object, add fields and write to Table storage
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

The same function.json file can be used with a JavaScript function:

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

In a class library, the same trigger and binding information &mdash; queue and table names, storage accounts, function parameters for input and output &mdash; is provided by attributes:

```csharp
 public static class QueueTriggerTableOutput
 {
     [FunctionName("QueueTriggerTableOutput")]
     [return: Table("outTable", Connection = "MY_TABLE_STORAGE_ACCT_APP_SETTING")]
     public static Person Run(
         [QueueTrigger("myqueue-items", Connection = "MY_STORAGE_ACCT_APP_SETTING")]JObject order, 
         TraceWriter log)
     {
         return new Person() {
                 PartitionKey = "Orders",
                 RowKey = Guid.NewGuid().ToString(),
                 Name = order["Name"].ToString(),
                 MobileNumber = order["MobileNumber"].ToString() };
     }
 }

 public class Person
 {
     public string PartitionKey { get; set; }
     public string RowKey { get; set; }
     public string Name { get; set; }
     public string MobileNumber { get; set; }
 }
```

## Binding direction

All triggers and bindings have a `direction` property in the *function.json* file:

- For triggers, the direction is always `in`
- Input and output bindings use `in` and `out`
- Some bindings support a special direction `inout`. If you use `inout`, only the **Advanced editor** is available in the **Integrate** tab.

When you use [attributes in a class library](functions-dotnet-class-library.md) to configure triggers and bindings, the direction is provided in an attribute constructor or inferred from the parameter type.

## Using the function return type to return a single output

The preceding example shows how to use the function return value to provide output to a binding, which is specified in *function.json* by using the special value `$return` for the `name` property. (This is only supported in languages that have a return value, such as C# script, JavaScript, and F#.) If a function has multiple output bindings, use `$return` for only one of the output bindings. 

```json
// excerpt of function.json
{
    "name": "$return",
    "type": "blob",
    "direction": "out",
    "path": "output-container/{id}"
}
```

The examples below show how return types are used with output bindings in C# script, JavaScript, and F#.

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
    return Task.FromResult(json);
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

In .NET, use the parameter type to define the data type for input data. For instance, use `string` to bind to the text of a queue trigger, a byte array to read as binary and a custom type to deserialize to a POCO object.

For languages that are dynamically typed such as JavaScript, use the `dataType` property in the *function.json* file. For example, to read the content of an HTTP request in binary format, set `dataType` to `binary`:

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

The following example is an Azure Queue Storage trigger that uses an app setting `%input-queue-name%` to define the queue to trigger on.

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

You can use the same approach in class libraries:

```csharp
[FunctionName("QueueTrigger")]
public static void Run(
    [QueueTrigger("%input-queue-name%")]string myQueueItem, 
    TraceWriter log)
{
    log.Info($"C# Queue trigger function processed: {myQueueItem}");
}
```

## Trigger metadata properties

In addition to the data payload provided by a trigger (such as the queue message that triggered a function), many triggers provide additional metadata values. These values can be used as input parameters in C# and F# or properties on the `context.bindings` object in JavaScript. 

For example, an Azure Queue storage trigger supports the following properties:

* QueueTrigger - triggering message content if a valid string
* DequeueCount
* ExpirationTime
* Id
* InsertionTime
* NextVisibleTime
* PopReceipt

These metadata values are accessible in *function.json* file properties. For example, suppose you use a queue trigger and the queue message contains the name of a blob you want to read. In the *function.json* file, you can use `queueTrigger` metadata property in the blob `path` property, as shown in the following example:

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

Details of metadata properties for each trigger are described in the corresponding reference article. For an example, see [queue trigger metadata](functions-bindings-storage-queue.md#trigger---message-metadata). Documentation is also available in the **Integrate** tab of the portal, in the **Documentation** section below the binding configuration area.  

## Binding expressions and patterns

One of the most powerful features of triggers and bindings is *binding expressions*. In the configuration for a binding, you can define pattern expressions which can then be used in other bindings or your code. Trigger metadata can also be used in binding expressions, as shown in the preceding section.

For example, suppose you want to resize images in a particular blob storage container, similar to the **Image Resizer** template in the **New Function** page of the Azure portal (see the **Samples** scenario). 

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

Notice that the `filename` parameter is used in both the blob trigger definition and the blob output binding. This parameter can also be used in function code.

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

The same ability to use binding expressions and patterns applies to attributes in class libraries. For example, here is a image resizing function in a class library:

```csharp
[FunctionName("ResizeImage")]
[StorageAccount("AzureWebJobsStorage")]
public static void Run(
    [BlobTrigger("sample-images/{name}")] Stream image, 
    [Blob("sample-images-sm/{name}", FileAccess.Write)] Stream imageSmall, 
    [Blob("sample-images-md/{name}", FileAccess.Write)] Stream imageMedium)
{
    var imageBuilder = ImageResizer.ImageBuilder.Current;
    var size = imageDimensionsTable[ImageSize.Small];

    imageBuilder.Build(image, imageSmall,
        new ResizeSettings(size.Item1, size.Item2, FitMode.Max, null), false);

    image.Position = 0;
    size = imageDimensionsTable[ImageSize.Medium];

    imageBuilder.Build(image, imageMedium,
        new ResizeSettings(size.Item1, size.Item2, FitMode.Max, null), false);
}

public enum ImageSize { ExtraSmall, Small, Medium }

private static Dictionary<ImageSize, (int, int)> imageDimensionsTable = new Dictionary<ImageSize, (int, int)>() {
    { ImageSize.ExtraSmall, (320, 200) },
    { ImageSize.Small,      (640, 400) },
    { ImageSize.Medium,     (800, 600) }
};
```

### Create GUIDs

The `{rand-guid}` binding expression creates a GUID. The following example uses a GUID to create a unique blob name: 

```json
{
  "type": "blob",
  "name": "blobOutput",
  "direction": "out",
  "path": "my-output-container/{rand-guid}"
}
```

### Current time

The binding expression `DateTime` resolves to `DateTime.UtcNow`.

```json
{
  "type": "blob",
  "name": "blobOutput",
  "direction": "out",
  "path": "my-output-container/{DateTime}"
}
```

## Bind to custom input properties

Binding expressions can also reference properties that are defined in the trigger payload itself. For example, you may want to dynamically bind to a blob storage file from a filename provided in a webhook.

For example, the following *function.json* uses a property called `BlobName` from the trigger payload:

```json
{
  "bindings": [
    {
      "name": "info",
      "type": "httpTrigger",
      "direction": "in",
      "webHookType": "genericJson"
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

In C# and other .NET languages, you can use an imperative binding pattern, as opposed to the declarative bindings in *function.json* and attributes. Imperative binding is useful when binding parameters need to be computed at runtime rather than design time. To learn more, see [Binding at runtime via imperative bindings](functions-reference-csharp.md#imperative-bindings) in the C# developer reference.

## function.json file schema

The *function.json* file schema is available at [http://json.schemastore.org/function](http://json.schemastore.org/function).

## Handling binding errors

[!INCLUDE [bindings errors intro](../../includes/functions-bindings-errors-intro.md)]

For links to all relevant error topics for the various services supported by Functions, see the [Binding error codes](functions-bindings-error-pages.md#binding-error-codes) section of the [Azure Functions error handling](functions-bindings-error-pages.md) overview topic.  

## Next steps

For more information on a specific binding, see the following articles:

- [HTTP and webhooks](functions-bindings-http-webhook.md)
- [Timer](functions-bindings-timer.md)
- [Queue storage](functions-bindings-storage-queue.md)
- [Blob storage](functions-bindings-storage-blob.md)
- [Table storage](functions-bindings-storage-table.md)
- [Event Hub](functions-bindings-event-hubs.md)
- [Service Bus](functions-bindings-service-bus.md)
- [Azure Cosmos DB](functions-bindings-cosmosdb.md)
- [Microsoft Graph](functions-bindings-microsoft-graph.md)
- [SendGrid](functions-bindings-sendgrid.md)
- [Twilio](functions-bindings-twilio.md)
- [Notification Hubs](functions-bindings-notification-hubs.md)
- [Mobile Apps](functions-bindings-mobile-apps.md)
- [External file](functions-bindings-external-file.md)
