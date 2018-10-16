---
title: Triggers and bindings in Azure Functions
description: Learn how to use triggers and bindings in Azure Functions to connect your code execution to online events and cloud-based services.
services: functions
documentationcenter: na
author: ggailey777
manager: jeconnoc
keywords: azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture

ms.service: azure-functions
ms.devlang: multiple
ms.topic: reference
ms.date: 09/24/2018
ms.author: glenga
---

# Azure Functions triggers and bindings concepts

This article is a conceptual overview of triggers and bindings in Azure Functions. Features that are common to all bindings and all supported languages are described here.

## Overview

A *trigger* defines how a function is invoked. A function must have exactly one trigger. Triggers have associated data, which is usually the payload that triggered the function.

Input and output *bindings* provide a declarative way to connect to data from within your code. Bindings are optional and a function can have multiple input and output bindings. 

Triggers and bindings let you avoid hardcoding the details of the services that you're working with. Your function receives data (for example, the content of a queue message) in function parameters. You send data (for example, to create a queue message) by using the return value of the function. In C# and C# script, alternative ways to send data are `out` parameters and [collector objects](functions-reference-csharp.md#writing-multiple-output-values).

When you develop functions by using the Azure portal, triggers and bindings are configured in a *function.json* file. The portal provides a UI for this configuration but you can edit the file directly by changing to the **Advanced editor**.

When you develop functions by using Visual Studio to create a class library, you configure triggers and bindings by decorating methods and parameters with attributes.

## Example trigger and binding

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

The first element in the `bindings` array is the Queue storage trigger. The `type` and `direction` properties identify the trigger. The `name` property identifies the function parameter that receives the queue message content. The name of the queue to monitor is in `queueName`, and the connection string is in the app setting identified by `connection`.

The second element in the `bindings` array is the Azure Table Storage output binding. The `type` and `direction` properties identify the binding. The `name` property specifies how the function provides the new table row, in this case by using the function return value. The name of the table is in `tableName`, and the connection string is in the app setting identified by `connection`.

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

In a class library, the same trigger and binding information &mdash; queue and table names, storage accounts, function parameters for input and output &mdash; is provided by attributes instead of a function.json file. Here's an example:

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

## Supported bindings

[!INCLUDE [Full bindings table](../../includes/functions-bindings.md)]

For information about which bindings are in preview or are approved for production use, see [Supported languages](supported-languages.md).

## Register binding extensions

In some development environments, you have to explicitly *register* a binding that you want to use. Binding extensions are provided in NuGet packages, and to register an extension you install a package. The following table indicates when and how you register binding extensions.

|Development environment |Registration<br/> in Functions 1.x  |Registration<br/> in Functions 2.x  |
|---------|---------|---------|
|Azure portal|Automatic|[Automatic with prompt](#azure-portal-development)|
|Local using Azure Functions Core Tools|Automatic|[Use Core Tools CLI commands](#local-development-azure-functions-core-tools)|
|C# class library using Visual Studio 2017|[Use NuGet tools](#c-class-library-with-visual-studio-2017)|[Use NuGet tools](#c-class-library-with-visual-studio-2017)|
|C# class library using Visual Studio Code|N/A|[Use .NET Core CLI](#c-class-library-with-visual-studio-code)|

The following binding types are exceptions that don't require explicit registration because they are automatically registered in all versions and environments: HTTP and timer.

### Azure portal development

This section applies only to Functions 2.x. Binding extensions don't have to be explicitly registered in Functions 1.x.

When you create a function or add a binding, you are prompted when the extension for the trigger or binding requires registration. Respond to the prompt by clicking **Install** to register the extension. Installation can take up to 10 minutes on a consumption plan.

You need only install each extension one time for a given function app. For supported bindings that are not available in the portal or to update the an installed extension, you can also [manually install or update Azure Functions binding extensions from the portal](install-update-binding-extensions-manual.md).  

### Local development Azure Functions Core Tools

This section applies only to Functions 2.x. Binding extensions don't have to be explicitly registered in Functions 1.x.

[!INCLUDE [functions-core-tools-install-extension](../../includes/functions-core-tools-install-extension.md)]

<a name="local-csharp"></a>
### C# class library with Visual Studio 2017

In **Visual Studio 2017**, you can install packages from the Package Manager Console using the [Install-Package](https://docs.microsoft.com/nuget/tools/ps-ref-install-package) command, as shown in the following example:

```powershell
Install-Package Microsoft.Azure.WebJobs.ServiceBus --Version <target_version>
```

The name of the package to use for a given binding is provided in the reference article for that binding. For an example, see the [Packages section of the Service Bus binding reference article](functions-bindings-service-bus.md#packages---functions-1x).

Replace `<target_version>` in the example with a specific version of the package, such as `3.0.0-beta5`. Valid versions are listed on the individual package pages at [NuGet.org](https://nuget.org). The major versions that correspond to Functions runtime 1.x or 2.x are specified in the reference article for the binding.

### C# class library with Visual Studio Code

In **Visual Studio Code**, you can install packages from the command prompt using the [dotnet add package](https://docs.microsoft.com/dotnet/core/tools/dotnet-add-package) command in the .NET Core CLI, as shown in the following example:

```terminal
dotnet add package Microsoft.Azure.WebJobs.ServiceBus --version <target_version>
```

The .NET Core CLI can only be used for Azure Functions 2.x development.

The name of the package to use for a given binding is provided in the reference article for that binding. For an example, see the [Packages section of the Service Bus binding reference article](functions-bindings-service-bus.md#packages---functions-1x).

Replace `<target_version>` in the example with a specific version of the package, such as `3.0.0-beta5`. Valid versions are listed on the individual package pages at [NuGet.org](https://nuget.org). The major versions that correspond to Functions runtime 1.x or 2.x are specified in the reference article for the binding.

## Binding direction

All triggers and bindings have a `direction` property in the *function.json* file:

- For triggers, the direction is always `in`
- Input and output bindings use `in` and `out`
- Some bindings support a special direction `inout`. If you use `inout`, only the **Advanced editor** is available in the **Integrate** tab.

When you use [attributes in a class library](functions-dotnet-class-library.md) to configure triggers and bindings, the direction is provided in an attribute constructor or inferred from the parameter type.

## Using the function return value

In languages that have a return value, you can bind an output binding to the return value:

* In a C# class library, apply the output binding attribute to the method return value.
* In other languages, set the `name` property in *function.json* to `$return`.

If there are multiple output bindings, use the return value for only one of them.

In C# and C# script, alternative ways to send data to an output binding are `out` parameters and [collector objects](functions-reference-csharp.md#writing-multiple-output-values).

See the language-specific example showing use of the return value:

* [C#](#c-example)
* [C# script (.csx)](#c-script-example)
* [F#](#f-example)
* [JavaScript](#javascript-example)

### C# example

Here's C# code that uses the return value for an output binding, followed by an async example:

```cs
[FunctionName("QueueTrigger")]
[return: Blob("output-container/{id}")]
public static string Run([QueueTrigger("inputqueue")]WorkItem input, TraceWriter log)
{
    string json = string.Format("{{ \"id\": \"{0}\" }}", input.Id);
    log.Info($"C# script processed queue message. Item={json}");
    return json;
}
```

```cs
[FunctionName("QueueTrigger")]
[return: Blob("output-container/{id}")]
public static Task<string> Run([QueueTrigger("inputqueue")]WorkItem input, TraceWriter log)
{
    string json = string.Format("{{ \"id\": \"{0}\" }}", input.Id);
    log.Info($"C# script processed queue message. Item={json}");
    return Task.FromResult(json);
}
```

### C# script example

Here's the output binding in the *function.json* file:

```json
{
    "name": "$return",
    "type": "blob",
    "direction": "out",
    "path": "output-container/{id}"
}
```

Here's the C# script code, followed by an async example:

```cs
public static string Run(WorkItem input, TraceWriter log)
{
    string json = string.Format("{{ \"id\": \"{0}\" }}", input.Id);
    log.Info($"C# script processed queue message. Item={json}");
    return json;
}
```

```cs
public static Task<string> Run(WorkItem input, TraceWriter log)
{
    string json = string.Format("{{ \"id\": \"{0}\" }}", input.Id);
    log.Info($"C# script processed queue message. Item={json}");
    return Task.FromResult(json);
}
```

### F# example

Here's the output binding in the *function.json* file:

```json
{
    "name": "$return",
    "type": "blob",
    "direction": "out",
    "path": "output-container/{id}"
}
```

Here's the F# code:

```fsharp
let Run(input: WorkItem, log: TraceWriter) =
    let json = String.Format("{{ \"id\": \"{0}\" }}", input.Id)   
    log.Info(sprintf "F# script processed queue message '%s'" json)
    json
```

### JavaScript example

Here's the output binding in the *function.json* file:

```json
{
    "name": "$return",
    "type": "blob",
    "direction": "out",
    "path": "output-container/{id}"
}
```

In JavaScript, the return value goes in the second parameter for `context.done`:

```javascript
module.exports = function (context, input) {
    var json = JSON.stringify(input);
    context.log('Node.js script processed queue message', json);
    context.done(null, json);
}
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

## Binding expressions and patterns

One of the most powerful features of triggers and bindings is *binding expressions*. In the *function.json* file and in function parameters and code, you can use expressions that resolve to values from various sources.

Most expressions are identified by wrapping them in curly braces. For example, in a queue trigger function, `{queueTrigger}` resolves to the queue message text. If the `path` property for a blob output binding is `container/{queueTrigger}` and the function is triggered by a queue message `HelloWorld`, a blob named `HelloWorld` is created.

Types of binding expressions

* [App settings](#binding-expressions---app-settings)
* [Trigger file name](#binding-expressions---trigger-file-name)
* [Trigger metadata](#binding-expressions---trigger-metadata)
* [JSON payloads](#binding-expressions---json-payloads)
* [New GUID](#binding-expressions---create-guids)
* [Current date and time](#binding-expressions---current-time)

### Binding expressions - app settings

As a best practice, secrets and connection strings should be managed using app settings, rather than configuration files. This limits access to these secrets and makes it safe to store files such as *function.json* in public source control repositories.

App settings are also useful whenever you want to change configuration based on the environment. For example, in a test environment, you may want to monitor a different queue or blob storage container.

App setting binding expressions are identified differently from other binding expressions: they are wrapped in percent signs rather than curly braces. For example if the blob output binding path is `%Environment%/newblob.txt` and the `Environment` app setting value is `Development`, a blob will be created in the `Development` container.

When a function is running locally, app setting values come from the *local.settings.json* file.

Note that the `connection` property of triggers and bindings is a special case and automatically resolves values as app settings, without percent signs. 

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

### Binding expressions - trigger file name

The `path` for a Blob trigger can be a pattern that lets you refer to the name of the triggering blob in other bindings and function code. The pattern can also include filtering criteria that specify which blobs can trigger a function invocation.

For example, in the following Blob trigger binding, the `path` pattern is `sample-images/{filename}`, which creates a binding expression named `filename`:

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

The expression `filename` can then be used in an output binding to specify the name of the blob being created:

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
public static void Run(Stream image, string filename, Stream imageSmall, TraceWriter log)  
{
    log.Info($"Blob trigger processing: {filename}");
    // ...
} 
```

<!--TODO: add JavaScript example -->
<!-- Blocked by bug https://github.com/Azure/Azure-Functions/issues/248 -->

The same ability to use binding expressions and patterns applies to attributes in class libraries. In the following example, the attribute constructor parameters are the same `path` values as the preceding *function.json* examples: 

```csharp
[FunctionName("ResizeImage")]
public static void Run(
    [BlobTrigger("sample-images/{filename}")] Stream image,
    [Blob("sample-images-sm/{filename}", FileAccess.Write)] Stream imageSmall,
    string filename,
    TraceWriter log)
{
    log.Info($"Blob trigger processing: {filename}");
    // ...
}

```

You can also create expressions for parts of the file name such as the extension. For more information on how to use expressions and patterns in the Blob path string, see the [Storage blob binding reference](functions-bindings-storage-blob.md).
 
### Binding expressions - trigger metadata

In addition to the data payload provided by a trigger (such as the content of the queue message that triggered a function), many triggers provide additional metadata values. These values can be used as input parameters in C# and F# or properties on the `context.bindings` object in JavaScript. 

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

### Binding expressions - JSON payloads

When a trigger payload is JSON, you can refer to its properties in configuration for other bindings in the same function and in function code.

The following example shows the *function.json* file for a webhook function that receives a blob name in JSON: `{"BlobName":"HelloWorld.txt"}`. A Blob input binding reads the blob, and the HTTP output binding returns the blob contents in the HTTP response. Notice that the Blob input binding gets the blob name by referring directly to the `BlobName` property (`"path": "strings/{BlobName}"`)

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

For this to work in C# and F#, you need a class that defines the fields to be deserialized, as in the following example:

```csharp
using System.Net;

public class BlobInfo
{
    public string BlobName { get; set; }
}
  
public static HttpResponseMessage Run(HttpRequestMessage req, BlobInfo info, string blobContents, TraceWriter log)
{
    if (blobContents == null) {
        return req.CreateResponse(HttpStatusCode.NotFound);
    } 

    log.Info($"Processing: {info.BlobName}");

    return req.CreateResponse(HttpStatusCode.OK, new {
        data = $"{blobContents}"
    });
}
```

In JavaScript, JSON deserialization is automatically performed.

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

#### Dot notation

If some of the properties in your JSON payload are objects with properties, you can refer to those directly by using dot notation. For example, suppose your JSON looks like this:

```json
{"BlobName": {
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

### Binding expressions - create GUIDs

The `{rand-guid}` binding expression creates a GUID. The following blob path in a `function.json` file creates a blob with a name like *50710cb5-84b9-4d87-9d83-a03d6976a682.txt*.

```json
{
  "type": "blob",
  "name": "blobOutput",
  "direction": "out",
  "path": "my-output-container/{rand-guid}"
}
```

### Binding expressions - current time

The binding expression `DateTime` resolves to `DateTime.UtcNow`. The following blob path in a `function.json` file creates a blob with a name like *2018-02-16T17-59-55Z.txt*.

```json
{
  "type": "blob",
  "name": "blobOutput",
  "direction": "out",
  "path": "my-output-container/{DateTime}"
}
```

## Binding at runtime

In C# and other .NET languages, you can use an imperative binding pattern, as opposed to the declarative bindings in *function.json* and attributes. Imperative binding is useful when binding parameters need to be computed at runtime rather than design time. To learn more, see the [C# developer reference](functions-dotnet-class-library.md#binding-at-runtime) or the [C# script developer reference](functions-reference-csharp.md#binding-at-runtime).

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
