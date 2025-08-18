---
title: Azure Functions Binding Expressions and Patterns
description: Learn how to create various Azure Functions binding expressions based on common patterns.

ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp
ms.date: 02/18/2019
---

# Azure Functions binding expressions and patterns

One of the most powerful features of [triggers and bindings](./functions-triggers-bindings.md) in Azure Functions is *binding expressions*. In the `function.json` file and in function parameters and code, you can use expressions that resolve to values from various sources.

Most expressions are wrapped in curly braces. For example, in a queue trigger function, `{queueTrigger}` resolves to the queue message text. If the `path` property for a blob output binding is `container/{queueTrigger}` and a queue message `HelloWorld` triggers the function, a blob named `HelloWorld` is created.

## <a name = binding-expressions---app-settings></a>App settings

It's a best practice to manage secrets and connection strings by using app settings rather than configuration files. This practice limits access to these secrets and makes it safe to store files such as `function.json` in public source-control repositories.

App settings are also useful whenever you want to change a configuration based on the environment. For example, in a test environment, you might want to monitor a different container for queue storage or blob storage.

Binding expressions for app settings are identified differently from other binding expressions: they're wrapped in percent signs rather than curly braces. For example, if the path for a blob output binding is `%Environment%/newblob.txt` and the `Environment` app setting value is `Development`, a blob is created in the `Development` container.

When a function is running locally, values for app settings come from the `local.settings.json` file.

> [!NOTE]
> The `connection` property of triggers and bindings is a special case and automatically resolves values as app settings, without percent signs.

The following example is an Azure Queue Storage trigger that uses an app setting `%input_queue_name%` to define the queue to trigger on:

```json
{
  "bindings": [
    {
      "name": "order",
      "type": "queueTrigger",
      "direction": "in",
      "queueName": "%input_queue_name%",
      "connection": "MY_STORAGE_ACCT_APP_SETTING"
    }
  ]
}
```

You can use the same approach in class libraries:

```csharp
[FunctionName("QueueTrigger")]
public static void Run(
    [QueueTrigger("%input_queue_name%")]string myQueueItem, 
    ILogger log)
{
    log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");
}
```

## Trigger file name

The `path` value for a blob trigger can be a pattern that lets you refer to the name of the triggering blob in other bindings and function code. The pattern can also include filtering criteria that specify which blobs can trigger a function invocation.

For example, in the following binding for a blob trigger, the `path` pattern is `sample-images/{filename}`. This pattern creates a binding expression named `filename`.

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
    ...
```

You can then use the expression `filename` in an output binding to specify the name of the blob that you're creating:

```json
    ...
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

Function code has access to this same value by using `filename` as a parameter name:

```csharp
// C# example of binding to {filename}
public static void Run(Stream image, string filename, Stream imageSmall, ILogger log)  
{
    log.LogInformation($"Blob trigger processing: {filename}");
    // ...
} 
```

<!--TODO: add JavaScript example -->
<!-- Blocked by bug https://github.com/Azure/Azure-Functions/issues/248 -->

The same ability to use binding expressions and patterns applies to attributes in class libraries. In the following example, the attribute constructor parameters are the same `path` values as the preceding `function.json` examples:

```csharp
[FunctionName("ResizeImage")]
public static void Run(
    [BlobTrigger("sample-images/{filename}")] Stream image,
    [Blob("sample-images-sm/{filename}", FileAccess.Write)] Stream imageSmall,
    string filename,
    ILogger log)
{
    log.LogInformation($"Blob trigger processing: {filename}");
    // ...
}

```

You can also create expressions for parts of the file name. In the following example, the function is triggered only on file names that match a pattern: `anyname-anyfile.csv`.

```json
{
    "name": "myBlob",
    "type": "blobTrigger",
    "direction": "in",
    "path": "testContainerName/{date}-{filetype}.csv",
    "connection": "OrderStorageConnection"
}
```

For more information on how to use expressions and patterns in the blob path string, see the [reference for Azure Blob Storage bindings](functions-bindings-storage-blob.md).

## Trigger metadata

In addition to the data payload that a trigger provides (such as the content of the queue message that triggered a function), many triggers provide other metadata values. You can use these values as input parameters in C# and F# or as properties on the `context.bindings` object in JavaScript.

For example, an Azure Queue Storage trigger supports the following properties:

* `QueueTrigger` (triggering message content if the string is valid)
* `DequeueCount`
* `ExpirationTime`
* `Id`
* `InsertionTime`
* `NextVisibleTime`
* `PopReceipt`

These metadata values are accessible in the `function.json` file properties. For example, suppose you use a queue trigger and the queue message contains the name of a blob that you want to read. In the `function.json` file, you can use the `queueTrigger` metadata property in the blob `path` property, as shown in the following example:

```json
{
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
}
```

You can find details of metadata properties for each trigger in the corresponding reference article. For an example, see the [metadata for an Azure Queue Storage trigger](functions-bindings-storage-queue-trigger.md#message-metadata). Documentation is also available on the **Integrate** tab of the portal, in the **Documentation** section below the binding configuration area.  

## JSON payloads

In some scenarios, you can refer to the trigger payload's properties in the configuration for other bindings in the same function and in function code. This approach requires that the trigger payload is JSON and is smaller than a threshold specific to each trigger. Typically, the payload size needs to be less than 100 MB, but you should check the reference content for each trigger.

Using trigger payload properties might affect the performance of your application. It also forces the trigger parameter type to be a simple type (like a string) or a custom object type that represents JSON data. You can't use it with streams, clients, or other SDK types.

The following example shows the `function.json` file for a webhook function that receives a blob name in JSON: `{"BlobName":"HelloWorld.txt"}`. A blob input binding reads the blob, and the HTTP output binding returns the blob contents in the HTTP response. Notice that the blob input binding gets the blob name by referring directly to the `BlobName` property (`"path": "strings/{BlobName}"`).

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

For this approach to work in C# and F#, you need a class that defines the fields to be deserialized, as in the following example:

```csharp
using System.Net;
using Microsoft.Extensions.Logging;

public class BlobInfo
{
    public string BlobName { get; set; }
}
  
public static HttpResponseMessage Run(HttpRequestMessage req, BlobInfo info, string blobContents, ILogger log)
{
    if (blobContents == null) {
        return req.CreateResponse(HttpStatusCode.NotFound);
    } 

    log.LogInformation($"Processing: {info.BlobName}");

    return req.CreateResponse(HttpStatusCode.OK, new {
        data = $"{blobContents}"
    });
}
```

In JavaScript, JSON deserialization is automatically performed:

```javascript
module.exports = async function (context, info) {
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
}
```

### Dot notation

If some of the properties in your JSON payload are objects with properties, you can refer to them directly by using dot (`.`) notation. This notation doesn't work for [Azure Cosmos DB](./functions-bindings-cosmosdb-v2.md) or [Azure Table Storage](./functions-bindings-storage-table-output.md) bindings.

For example, suppose your JSON looks like this example:

```json
{
  "BlobName": {
    "FileName":"HelloWorld",
    "Extension":"txt"
  }
}
```

You can refer directly to `FileName` as `BlobName.FileName`. With this JSON format, here's what the `path` property in the preceding example would look like:

```json
"path": "strings/{BlobName.FileName}.{BlobName.Extension}",
```

In C#, you would need two classes:

```csharp
public class BlobInfo
{
    public BlobName BlobName { get; set; }
}
public class BlobName
{
    public string FileName { get; set; }
    public string Extension { get; set; }
}
```

## New GUIDs

The `{rand-guid}` binding expression creates a GUID. The following blob path in a `function.json` file creates a blob with a name like *50710cb5-84b9-4d87-9d83-a03d6976a682.txt*:

```json
{
  "type": "blob",
  "name": "blobOutput",
  "direction": "out",
  "path": "my-output-container/{rand-guid}.txt"
}
```

## Current date and time

The binding expression `DateTime` resolves to `DateTime.UtcNow`. The following blob path in a `function.json` file creates a blob with a name like *2018-02-16T17-59-55Z.txt*:

```json
{
  "type": "blob",
  "name": "blobOutput",
  "direction": "out",
  "path": "my-output-container/{DateTime}.txt"
}
```

## Binding at runtime

In C# and other .NET languages, you can use an imperative binding pattern, as opposed to the declarative bindings in `function.json` and attributes. Imperative binding is useful when binding parameters need to be computed at runtime rather than design time. To learn more, see the [C# developer reference](functions-dotnet-class-library.md#binding-at-runtime) or the [C# script developer reference](functions-reference-csharp.md#binding-at-runtime).

## Related content

* [Azure Functions triggers and bindings](functions-triggers-bindings.md)
