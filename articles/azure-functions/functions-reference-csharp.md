---
title: Azure Functions C# script developer reference
description: Understand how to develop Azure Functions using C# script.
ms.topic: conceptual
ms.custom: devx-track-csharp, ignite-2022
ms.date: 08/15/2023
---
# Azure Functions C# script (.csx) developer reference

<!-- When updating this article, make corresponding changes to any duplicate content in functions-dotnet-class-library.md -->

This article is an introduction to developing Azure Functions by using C# script (*.csx*).

Azure Functions lets you develop functions using C# in one of the following ways:

| Type | Execution process | Code extension | Development environment | Reference |
| --- | ---- | --- | --- | --- | 
| C# script | in-process | .csx | [Portal](functions-create-function-app-portal.md)<br/>[Core Tools](functions-run-local.md) | This article | 
| C# class library | in-process | .cs | [Visual Studio](functions-develop-vs.md)<br/>[Visual Studio Code](functions-develop-vs-code.md)<br />[Core Tools](functions-run-local.md)| [In-process C# class library functions](functions-dotnet-class-library.md) |
| C# class library (isolated worker process)| in an isolated worker process | .cs | [Visual Studio](functions-develop-vs.md)<br/>[Visual Studio Code](functions-develop-vs-code.md)<br />[Core Tools](functions-run-local.md) | [.NET isolated worker process functions](dotnet-isolated-process-guide.md) | 

This article assumes that you've already read the [Azure Functions developers guide](functions-reference.md).

## How .csx works

Data flows into your C# function via method arguments. Argument names are specified in a `function.json` file, and there are predefined names for accessing things like the function logger and cancellation tokens.

The *.csx* format allows you to write less "boilerplate" and focus on writing just a C# function. Instead of wrapping everything in a namespace and class, just define a `Run` method. Include any assembly references and namespaces at the beginning of the file as usual.

A function app's *.csx* files are compiled when an instance is initialized. This compilation step means things like cold start may take longer for C# script functions compared to C# class libraries. This compilation step is also why C# script functions are editable in the Azure portal, while C# class libraries aren't.

## Folder structure

The folder structure for a C# script project looks like the following example:

```
FunctionsProject
 | - MyFirstFunction
 | | - run.csx
 | | - function.json
 | | - function.proj
 | - MySecondFunction
 | | - run.csx
 | | - function.json
 | | - function.proj
 | - host.json
 | - extensions.csproj
 | - bin
```

There's a shared [host.json](functions-host-json.md) file that can be used to configure the function app. Each function has its own code file (.csx) and binding configuration file (function.json).

The binding extensions required in [version 2.x and later versions](functions-versions.md) of the Functions runtime are defined in the `extensions.csproj` file, with the actual library files in the `bin` folder. When developing locally, you must [register binding extensions](./functions-bindings-register.md#extension-bundles). When you develop functions in the Azure portal, this registration is done for you.

## Binding to arguments

Input or output data is bound to a C# script function parameter via the `name` property in the *function.json* configuration file. The following example shows a *function.json* file  and *run.csx* file for a queue-triggered function. The parameter that receives data from the queue message is named `myQueueItem` because that's the value of the `name` property.

```json
{
    "disabled": false,
    "bindings": [
        {
            "type": "queueTrigger",
            "direction": "in",
            "name": "myQueueItem",
            "queueName": "myqueue-items",
            "connection":"MyStorageConnectionAppSetting"
        }
    ]
}
```

```csharp
#r "Microsoft.WindowsAzure.Storage"

using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Queue;
using System;

public static void Run(CloudQueueMessage myQueueItem, ILogger log)
{
    log.LogInformation($"C# Queue trigger function processed: {myQueueItem.AsString}");
}
```

The `#r` statement is explained [later in this article](#referencing-external-assemblies).

## Supported types for bindings

Each binding has its own supported types; for instance, a blob trigger can be used with a string parameter, a POCO parameter, a `CloudBlockBlob` parameter, or any of several other supported types. The [binding reference article for blob bindings](functions-bindings-storage-blob-trigger.md#usage) lists all supported parameter types for blob triggers. For more information, see [Triggers and bindings](functions-triggers-bindings.md) and the [binding reference docs for each binding type](functions-triggers-bindings.md#next-steps).

[!INCLUDE [HTTP client best practices](../../includes/functions-http-client-best-practices.md)]

## Referencing custom classes

If you need to use a custom Plain Old CLR Object (POCO) class, you can include the class definition inside the same file or put it in a separate file.

The following example shows a *run.csx* example that includes a POCO class definition.

```csharp
public static void Run(string myBlob, out MyClass myQueueItem)
{
    log.Verbose($"C# Blob trigger function processed: {myBlob}");
    myQueueItem = new MyClass() { Id = "myid" };
}

public class MyClass
{
    public string Id { get; set; }
}
```

A POCO class must have a getter and setter defined for each property.

## Reusing .csx code

You can use classes and methods defined in other *.csx* files in your *run.csx* file. To do that, use `#load` directives in your *run.csx* file. In the following example, a logging routine named `MyLogger` is shared in *myLogger.csx* and loaded into *run.csx* using the `#load` directive:

Example *run.csx*:

```csharp
#load "mylogger.csx"

using Microsoft.Extensions.Logging;

public static void Run(TimerInfo myTimer, ILogger log)
{
    log.LogInformation($"Log by run.csx: {DateTime.Now}");
    MyLogger(log, $"Log by MyLogger: {DateTime.Now}");
}
```

Example *mylogger.csx*:

```csharp
public static void MyLogger(ILogger log, string logtext)
{
    log.LogInformation(logtext);
}
```

Using a shared *.csx* file is a common pattern when you want to strongly type the data passed between functions by using a POCO object. In the following simplified example, an HTTP trigger and queue trigger share a POCO object named `Order` to strongly type the order data:

Example *run.csx* for HTTP trigger:

```cs
#load "..\shared\order.csx"

using System.Net;
using Microsoft.Extensions.Logging;

public static async Task<HttpResponseMessage> Run(Order req, IAsyncCollector<Order> outputQueueItem, ILogger log)
{
    log.LogInformation("C# HTTP trigger function received an order.");
    log.LogInformation(req.ToString());
    log.LogInformation("Submitting to processing queue.");

    if (req.orderId == null)
    {
        return new HttpResponseMessage(HttpStatusCode.BadRequest);
    }
    else
    {
        await outputQueueItem.AddAsync(req);
        return new HttpResponseMessage(HttpStatusCode.OK);
    }
}
```

Example *run.csx* for queue trigger:

```cs
#load "..\shared\order.csx"

using System;
using Microsoft.Extensions.Logging;

public static void Run(Order myQueueItem, out Order outputQueueItem, ILogger log)
{
    log.LogInformation($"C# Queue trigger function processed order...");
    log.LogInformation(myQueueItem.ToString());

    outputQueueItem = myQueueItem;
}
```

Example *order.csx*:

```cs
public class Order
{
    public string orderId {get; set; }
    public string custName {get; set;}
    public string custAddress {get; set;}
    public string custEmail {get; set;}
    public string cartId {get; set; }

    public override String ToString()
    {
        return "\n{\n\torderId : " + orderId +
                  "\n\tcustName : " + custName +
                  "\n\tcustAddress : " + custAddress +
                  "\n\tcustEmail : " + custEmail +
                  "\n\tcartId : " + cartId + "\n}";
    }
}
```

You can use a relative path with the `#load` directive:

* `#load "mylogger.csx"` loads a file located in the function folder.
* `#load "loadedfiles\mylogger.csx"` loads a file located in a folder in the function folder.
* `#load "..\shared\mylogger.csx"` loads a file located in a folder at the same level as the function folder, that is, directly under *wwwroot*.

The `#load` directive works only with *.csx* files, not with *.cs* files.

## Binding to method return value

You can use a method return value for an output binding, by using the name `$return` in *function.json*. 

```json
{
    "name": "$return",
    "type": "blob",
    "direction": "out",
    "path": "output-container/{id}"
}
```

Here's the C# script code using the return value, followed by an async example:

```csharp
public static string Run(WorkItem input, ILogger log)
{
    string json = string.Format("{{ \"id\": \"{0}\" }}", input.Id);
    log.LogInformation($"C# script processed queue message. Item={json}");
    return json;
}
```

```csharp
public static Task<string> Run(WorkItem input, ILogger log)
{
    string json = string.Format("{{ \"id\": \"{0}\" }}", input.Id);
    log.LogInformation($"C# script processed queue message. Item={json}");
    return Task.FromResult(json);
}
```

Use the return value only if a successful function execution always results in a return value to pass to the output binding. Otherwise, use `ICollector` or `IAsyncCollector`, as shown in the following section.

## Writing multiple output values

To write multiple values to an output binding, or if a successful function invocation might not result in anything to pass to the output binding, use the [`ICollector`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/ICollector.cs) or [`IAsyncCollector`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/IAsyncCollector.cs) types. These types are write-only collections that are written to the output binding when the method completes.

This example writes multiple queue messages into the same queue using `ICollector`:

```csharp
public static void Run(ICollector<string> myQueue, ILogger log)
{
    myQueue.Add("Hello");
    myQueue.Add("World!");
}
```

## Logging

To log output to your streaming logs in C#, include an argument of type [ILogger](/dotnet/api/microsoft.extensions.logging.ilogger). We recommend that you name it `log`. Avoid using `Console.Write` in Azure Functions.

```csharp
public static void Run(string myBlob, ILogger log)
{
    log.LogInformation($"C# Blob trigger function processed: {myBlob}");
}
```

> [!NOTE]
> For information about a newer logging framework that you can use instead of `TraceWriter`, see the [ILogger](functions-dotnet-class-library.md#ilogger) documentation in the .NET class library developer guide.

### Custom metrics logging

You can use the `LogMetric` extension method on `ILogger` to create custom metrics in Application Insights. Here's a sample method call:

```csharp
logger.LogMetric("TestMetric", 1234);
```

This code is an alternative to calling `TrackMetric` by using the Application Insights API for .NET.

## Async

To make a function [asynchronous](/dotnet/csharp/programming-guide/concepts/async/), use the `async` keyword and return a `Task` object.

```csharp
public async static Task ProcessQueueMessageAsync(
        string blobName,
        Stream blobInput,
        Stream blobOutput)
{
    await blobInput.CopyToAsync(blobOutput, 4096);
}
```

You can't use `out` parameters in async functions. For output bindings, use the [function return value](#binding-to-method-return-value) or a [collector object](#writing-multiple-output-values) instead.

## Cancellation tokens

A function can accept a [CancellationToken](/dotnet/api/system.threading.cancellationtoken) parameter, which enables the operating system to notify your code when the function is about to be terminated. You can use this notification to make sure the function doesn't terminate unexpectedly in a way that leaves data in an inconsistent state.

The following example shows how to check for impending function termination.

```csharp
using System;
using System.IO;
using System.Threading;

public static void Run(
    string inputText,
    TextWriter logger,
    CancellationToken token)
{
    for (int i = 0; i < 100; i++)
    {
        if (token.IsCancellationRequested)
        {
            logger.WriteLine("Function was cancelled at iteration {0}", i);
            break;
        }
        Thread.Sleep(5000);
        logger.WriteLine("Normal processing for queue message={0}", inputText);
    }
}
```

## Importing namespaces

If you need to import namespaces, you can do so as usual, with the `using` clause.

```csharp
using System.Net;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

public static Task<HttpResponseMessage> Run(HttpRequestMessage req, ILogger log)
```

The following namespaces are automatically imported and are therefore optional:

* `System`
* `System.Collections.Generic`
* `System.IO`
* `System.Linq`
* `System.Net.Http`
* `System.Threading.Tasks`
* `Microsoft.Azure.WebJobs`
* `Microsoft.Azure.WebJobs.Host`

## Referencing external assemblies

For framework assemblies, add references by using the `#r "AssemblyName"` directive.

```csharp
#r "System.Web.Http"

using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

public static Task<HttpResponseMessage> Run(HttpRequestMessage req, ILogger log)
```

The following assemblies are automatically added by the Azure Functions hosting environment:

* `mscorlib`
* `System`
* `System.Core`
* `System.Xml`
* `System.Net.Http`
* `Microsoft.Azure.WebJobs`
* `Microsoft.Azure.WebJobs.Host`
* `Microsoft.Azure.WebJobs.Extensions`
* `System.Web.Http`
* `System.Net.Http.Formatting`

The following assemblies may be referenced by simple-name, by runtime version:

### [v2.x+](#tab/functionsv2)

* `Newtonsoft.Json`
* `Microsoft.WindowsAzure.Storage`<sup>*</sup>

<sup>*</sup>Removed in version 4.x of the runtime.

### [v1.x](#tab/functionsv1)

* `Newtonsoft.Json`
* `Microsoft.WindowsAzure.Storage`
* `Microsoft.ServiceBus`
* `Microsoft.AspNet.WebHooks.Receivers`
* `Microsoft.AspNet.WebHooks.Common`

---


In code, assemblies are referenced like the following example:

```csharp
#r "AssemblyName"
```

## Referencing custom assemblies

To reference a custom assembly, you can use either a *shared* assembly or a *private* assembly:

* Shared assemblies are shared across all functions within a function app. To reference a custom assembly, upload the assembly to a folder named `bin` in the root folder (wwwroot) of your function app.

* Private assemblies are part of a given function's context, and support side-loading of different versions. Private assemblies should be uploaded in a `bin` folder in the function directory. Reference the assemblies using the file name, such as `#r "MyAssembly.dll"`.

For information on how to upload files to your function folder, see the section on [package management](#using-nuget-packages).

### Watched directories

The directory that contains the function script file is automatically watched for changes to assemblies. To watch for assembly changes in other directories, add them to the `watchDirectories` list in [host.json](functions-host-json.md).

## Using NuGet packages

The way that both binding extension packages and other NuGet packages are added to your function app depends on the [targeted version of the Functions runtime](functions-versions.md).

### [v2.x+](#tab/functionsv2)

By default, the [supported set of Functions extension NuGet packages](functions-triggers-bindings.md#supported-bindings) are made available to your C# script function app by using extension bundles. To learn more, see [Extension bundles](functions-bindings-register.md#extension-bundles). 

If for some reason you can't use extension bundles in your project, you can also use the Azure Functions Core Tools to install extensions based on bindings defined in the function.json files in your app. When using Core Tools to register extensions, make sure to use the `--csx` option. To learn more, see [func extensions install](functions-core-tools-reference.md#func-extensions-install).

By default, Core Tools reads the function.json files and adds the required packages to an *extensions.csproj* C# class library project file in the root of the function app's file system (wwwroot). Because Core Tools uses dotnet.exe, you can use it to add any NuGet package reference to this extensions file. During installation, Core Tools builds the extensions.csproj to install the required libraries. Here's an example *extensions.csproj* file that adds a reference to *Microsoft.ProjectOxford.Face* version *1.1.0*:

```xml
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
        <TargetFramework>netstandard2.0</TargetFramework>
    </PropertyGroup>
    <ItemGroup>
        <PackageReference Include="Microsoft.ProjectOxford.Face" Version="1.1.0" />
    </ItemGroup>
</Project>
```
> [!NOTE]
> For C# script (.csx), you must set `TargetFramework` to a value of `netstandard2.0`. Other target frameworks, such as `net6.0`, aren't supported.

### [v1.x](#tab/functionsv1)

Version 1.x of the Functions runtime uses a *project.json* file to define dependencies. Here's an example *project.json* file:

```json
{
  "frameworks": {
    "net46":{
      "dependencies": {
        "Microsoft.ProjectOxford.Face": "1.1.0"
      }
    }
   }
}
```

Extension bundles aren't supported by version 1.x.

---

To use a custom NuGet feed, specify the feed in a *Nuget.Config* file in the function app root folder. For more information, see [Configuring NuGet behavior](/nuget/consume-packages/configuring-nuget-behavior).

If you're working on your project only in the portal, you'll need to manually create the extensions.csproj file or a Nuget.Config file directly in the site. To learn more, see [Manually install extensions](functions-how-to-use-azure-function-app-settings.md#manually-install-extensions).

## Environment variables

To get an environment variable or an app setting value, use `System.Environment.GetEnvironmentVariable`, as shown in the following code example:

```csharp
public static void Run(TimerInfo myTimer, ILogger log)
{
    log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
    log.LogInformation(GetEnvironmentVariable("AzureWebJobsStorage"));
    log.LogInformation(GetEnvironmentVariable("WEBSITE_SITE_NAME"));
}

public static string GetEnvironmentVariable(string name)
{
    return name + ": " +
        System.Environment.GetEnvironmentVariable(name, EnvironmentVariableTarget.Process);
}
```

## Retry policies

Functions supports two built-in retry policies. For more information, see [Retry policies](functions-bindings-error-pages.md#retry-policies).

### [Fixed delay](#tab/fixed-delay)

Here's the retry policy in the *function.json* file:

```json
{
    "disabled": false,
    "bindings": [
        {
            ....
        }
    ],
    "retry": {
        "strategy": "fixedDelay",
        "maxRetryCount": 4,
        "delayInterval": "00:00:10"
    }
}
```

|*function.json*&nbsp;property  | Description |
|---------|-------------|
|strategy|Use `fixedDelay`.|
|maxRetryCount|Required. The maximum number of retries allowed per function execution. `-1` means to retry indefinitely.|
|delayInterval|The delay that's used between retries. Specify it as a string with the format `HH:mm:ss`.|

### [Exponential backoff](#tab/exponential-backoff)

Here's the retry policy in the *function.json* file:

```json
{
    "disabled": false,
    "bindings": [
        {
            ....
        }
    ],
    "retry": {
        "strategy": "exponentialBackoff",
        "maxRetryCount": 5,
        "minimumInterval": "00:00:10",
        "maximumInterval": "00:15:00"
    }
}
```

|*function.json*&nbsp;property  | Description |
|---------|-------------|
|strategy|Use `exponentialBackoff`.|
|maxRetryCount|Required. The maximum number of retries allowed per function execution. `-1` means to retry indefinitely.|
|minimumInterval|The minimum retry delay. Specify it as a string with the format `HH:mm:ss`.|
|maximumInterval|The maximum retry delay. Specify it as a string with the format `HH:mm:ss`.|

---

<a name="imperative-bindings"></a>

## Binding at runtime

In C# and other .NET languages, you can use an [imperative](https://en.wikipedia.org/wiki/Imperative_programming) binding pattern, as opposed to the [*declarative*](https://en.wikipedia.org/wiki/Declarative_programming) bindings in *function.json*. Imperative binding is useful when binding parameters need to be computed at runtime rather than design time. With this pattern, you can bind to supported input and output bindings on-the-fly in your function code.

Define an imperative binding as follows:

- **Do not** include an entry in *function.json* for your desired imperative bindings.
- Pass in an input parameter [`Binder binder`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.Host/Bindings/Runtime/Binder.cs)
or [`IBinder binder`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/IBinder.cs).
- Use the following C# pattern to perform the data binding.

```cs
using (var output = await binder.BindAsync<T>(new BindingTypeAttribute(...)))
{
    ...
}
```

`BindingTypeAttribute` is the .NET attribute that defines your binding and `T` is an input or output type that's
supported by that binding type. `T` can't be an `out` parameter type (such as `out JObject`). For example, the
Mobile Apps table output binding supports
[six output types](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.MobileApps/MobileTableAttribute.cs#L17-L22),
but you can only use [ICollector\<T>](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/ICollector.cs)
or [`IAsyncCollector<T>`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/IAsyncCollector.cs) for `T`.

### Single attribute example

The following example code creates a [Storage blob output binding](functions-bindings-storage-blob-output.md)
with blob path that's defined at run time, then writes a string to the blob.

```cs
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host.Bindings.Runtime;

public static async Task Run(string input, Binder binder)
{
    using (var writer = await binder.BindAsync<TextWriter>(new BlobAttribute("samples-output/path")))
    {
        writer.Write("Hello World!!");
    }
}
```

[BlobAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.Extensions.Storage/Blobs/BlobAttribute.cs)
defines the [Storage blob](functions-bindings-storage-blob.md) input or output binding, and
[TextWriter](/dotnet/api/system.io.textwriter) is a supported output binding type.

### Multiple attributes example

The preceding example gets the app setting for the function app's main Storage account connection string (which is `AzureWebJobsStorage`). You can specify a custom app setting to use for the Storage account by adding the
[StorageAccountAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/StorageAccountAttribute.cs)
and passing the attribute array into `BindAsync<T>()`. Use a `Binder` parameter, not `IBinder`.  For example:

```cs
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host.Bindings.Runtime;

public static async Task Run(string input, Binder binder)
{
    var attributes = new Attribute[]
    {
        new BlobAttribute("samples-output/path"),
        new StorageAccountAttribute("MyStorageAccount")
    };

    using (var writer = await binder.BindAsync<TextWriter>(attributes))
    {
        writer.Write("Hello World!");
    }
}
```

The following table lists the .NET attributes for each binding type and the packages in which they're defined.

> [!div class="mx-codeBreakAll"]
> | Binding | Attribute | Add reference |
> |------|------|------|
> | Azure Cosmos DB | [`Microsoft.Azure.WebJobs.DocumentDBAttribute`](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.CosmosDB/CosmosDBAttribute.cs) | `#r "Microsoft.Azure.WebJobs.Extensions.CosmosDB"` |
> | Event Hubs | [`Microsoft.Azure.WebJobs.ServiceBus.EventHubAttribute`](https://github.com/Azure/azure-webjobs-sdk/blob/v2.x/src/Microsoft.Azure.WebJobs.ServiceBus/EventHubs/EventHubAttribute.cs), [`Microsoft.Azure.WebJobs.ServiceBusAccountAttribute`](https://github.com/Azure/azure-webjobs-sdk/blob/b798412ad74ba97cf2d85487ae8479f277bdd85c/test/Microsoft.Azure.WebJobs.ServiceBus.UnitTests/ServiceBusAccountTests.cs) | `#r "Microsoft.Azure.Jobs.ServiceBus"` |
> | Mobile Apps | [`Microsoft.Azure.WebJobs.MobileTableAttribute`](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.MobileApps/MobileTableAttribute.cs) | `#r "Microsoft.Azure.WebJobs.Extensions.MobileApps"` |
> | Notification Hubs | [`Microsoft.Azure.WebJobs.NotificationHubAttribute`](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/v2.x/src/WebJobs.Extensions.NotificationHubs/NotificationHubAttribute.cs) | `#r "Microsoft.Azure.WebJobs.Extensions.NotificationHubs"` |
> | Service Bus | [`Microsoft.Azure.WebJobs.ServiceBusAttribute`](https://github.com/Azure/azure-webjobs-sdk/blob/b798412ad74ba97cf2d85487ae8479f277bdd85c/test/Microsoft.Azure.WebJobs.ServiceBus.UnitTests/ServiceBusAttributeTests.cs), [`Microsoft.Azure.WebJobs.ServiceBusAccountAttribute`](https://github.com/Azure/azure-webjobs-sdk/blob/b798412ad74ba97cf2d85487ae8479f277bdd85c/test/Microsoft.Azure.WebJobs.ServiceBus.UnitTests/ServiceBusAccountTests.cs) | `#r "Microsoft.Azure.WebJobs.ServiceBus"` |
> | Storage queue | [`Microsoft.Azure.WebJobs.QueueAttribute`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/), [`Microsoft.Azure.WebJobs.StorageAccountAttribute`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/StorageAccountAttribute.cs) | |
> | Storage blob | [`Microsoft.Azure.WebJobs.BlobAttribute`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.Extensions.Storage/Blobs/BlobAttribute.cs), [`Microsoft.Azure.WebJobs.StorageAccountAttribute`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/StorageAccountAttribute.cs) | |
> | Storage table | [`Microsoft.Azure.WebJobs.TableAttribute`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs), [`Microsoft.Azure.WebJobs.StorageAccountAttribute`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/StorageAccountAttribute.cs) | |
> | Twilio | [`Microsoft.Azure.WebJobs.TwilioSmsAttribute`](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.Twilio/TwilioSMSAttribute.cs) | `#r "Microsoft.Azure.WebJobs.Extensions.Twilio"` |

## Convert a C# script app to a C# project

The easiest way to convert a C# script function app to a compiled C# class library project is to start with a new project. You can then, for each function, migrate the code and configuration from each run.csx file and function.json file in a function folder to a single new .cs class library code file. For example, when you have a C# script function named `HelloWorld` you'll have two files: `HelloWorld/run.csx` and `HelloWorld/function.json`. For this function, you create a code file named `HelloWorld.cs` in your new class library project.

If you are using C# scripting for portal editing, you can [download the app content to your local machine](./deployment-zip-push.md#download-your-function-app-files). Choose the **Site content** option instead of **Content and Visual Studio project**. You don't need to generate a project, and don't include application settings in the download. You're defining a new development environment, and this environment shouldn't have the same permissions as your hosted app environment.

These instructions show you how to convert C# script functions (which run in-process with the Functions host) to C# class library functions that run in an [isolated worker process](dotnet-isolated-process-guide.md). 

1. Complete the **Create a functions app project** section from your preferred quickstart:
   
   ### [Azure CLI](#tab/azure-cli)
   [Create a C# function in Azure from the command line](create-first-function-cli-csharp.md#create-a-local-function-project)
   ### [Visual Studio](#tab/vs)
   [Create your first C# function in Azure using Visual Studio](functions-create-your-first-function-visual-studio.md#create-a-function-app-project)
   ### [Visual Studio Code](#tab/vs-code) 
   [Create your first C# function in Azure using Visual Studio Code](create-first-function-vs-code-csharp.md#create-an-azure-functions-project)

   ---
    
1. If your original C# script code includes an `extensions.csproj` file or any `function.proj` files, copy the package references from these file and add them to the new project's `.csproj` file in the same `ItemGroup` with the Functions core dependencies.

    >[!TIP]
    >Conversion provides a good opportunity to update to the latest versions of your dependencies. Doing so may require additional code changes in a later step.

1. Copy the contents of the original `host.json` file into the new project's `host.json` file, except for the `extensionBundles` section (compiled C# projects don't use [extension bundles](functions-bindings-register.md#extension-bundles) and you must explicitly add references to all extensions used by your functions). When merging host.json files, remember that the [`host.json`](./functions-host-json.md) schema is versioned, with most apps using version 2.0. The contents of the `extensions` section can differ based on specific versions of the binding extensions used by your functions. See individual extension reference articles to learn how to correctly configure the host.json for your specific versions.

1. For any [shared files referenced by a `#load` directive](#reusing-csx-code), create a new `.cs` file for each of these shared references. It's simplest to create a new `.cs` file for each shared class definition. If there are static methods without a class, you need to define new classes for these methods. 

1. Perform the following tasks for each `<FUNCTION_NAME>` folder in your original project:

    1. Create a new file named `<FUNCTION_NAME>.cs`, replacing `<FUNCTION_NAME>` with the name of the folder that defined your C# script function. You can create a new function code file from one of the trigger-specific templates in the following way:
        ### [Azure CLI](#tab/azure-cli)
        Using the `func new --name <FUNCTION_NAME>` command and choosing the correct trigger template at the prompt.
        ### [Visual Studio](#tab/vs)
        Following [Add a function to your project](functions-develop-vs.md?tabs=isolated-process#add-a-function-to-your-project) in the Visual Studio guide.
        ### [Visual Studio Code](#tab/vs-code) 
        Following [Add a function to your project](functions-develop-vs-code.md?tabs=isolated-process#add-a-function-to-your-project) in the Visual Studio Code guide.
        
        ---
    1. Copy the `using` statements from your `run.csx` file and add them to the new file. You do not need any `#r` directives.
    1. For any `#load` statement in your `run.csx` file, add a new `using` statement for the namespace you used for the shared code.
    1. In the new file, define a class for your function under the namespace you are using for the project.
    1. Create a new method named `RunHandler` or something similar. This new method serves as the new entry point for the function.
    1. Copy the static method that represents your function, along with any functions it calls, from `run.csx` into your new class as a second method. From the new method you created in the previous step, call into this static method. This indirection step is helpful for navigating any differences as you continue the upgrade. You can keep the original method exactly the same and simply control its inputs from the new context. You may need to create parameters on the new method which you then pass into the static method call. After you have confirmed that the migration has worked as intended, you can remove this extra level of indirection. 
    1. For each binding in the `function.json` file, add the corresponding attribute to your new method. To quickly find binding examples, see [Manually add bindings based on examples](add-bindings-existing-function.md?tabs=csharp).
    1. Add any extension packages required by the bindings to your project, if you haven't already done so.
     
1. Recreate any application settings required by your app in the `Values` collection of the [local.settings.json file](functions-develop-local.md#local-settings-file).
 
1. Verify that your project runs locally:

      ### [Azure CLI](#tab/azure-cli)
      Use `func start` to run your app from the command line. For more information, see [Run functions locally](functions-run-local.md#start).
      ### [Visual Studio](#tab/vs)
      Follow the [Run functions locally](functions-develop-vs.md?tabs=isolated-process#run-functions-locally) section of the Visual Studio guide.
      ### [Visual Studio Code](#tab/vs-code) 
      Follow the [Run functions locally](functions-develop-vs-code.md?tabs=csharp#run-functions-locally) section of the Visual Studio Code guide.
      
      ---
   
1. Publish your project to a new function app in Azure:

      ### [Azure CLI](#tab/azure-cli)
      [Create your Azure resources](create-first-function-cli-csharp.md#create-supporting-azure-resources-for-your-function) and deploy the code project to Azure by using the `func azure functionapp publish <APP_NAME>` command. For more information, see [Deploy project files](functions-run-local.md#project-file-deployment).
      ### [Visual Studio](#tab/vs)
      Follow the [Publish to Azure](functions-develop-vs.md?tabs=isolated-process#publish-to-azure) section of the Visual Studio guide.
      ### [Visual Studio Code](#tab/vs-code) 
      Follow the [Create Azure resources](functions-develop-vs-code.md?tabs=csharp#publish-to-azure) section of the Visual Studio Code guide.
      
      ---
    
### Example function conversion

This section shows an example of the migration for a single function.

The original function in C# scripting has two files:
- `HelloWorld/function.json`
- `HelloWorld/run.csx`

The contents of `HelloWorld/function.json` are:

```json
{
  "bindings": [
    {
      "authLevel": "FUNCTION",
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
    }
  ]
}
```

The contents of `HelloWorld/run.csx` are:

```csharp
#r "Newtonsoft.Json"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string name = req.Query["name"];

    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    dynamic data = JsonConvert.DeserializeObject(requestBody);
    name = name ?? data?.name;

    string responseMessage = string.IsNullOrEmpty(name)
        ? "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response."
                : $"Hello, {name}. This HTTP triggered function executed successfully.";

            return new OkObjectResult(responseMessage);
}
```

After migrating to the isolated worker model with ASP.NET Core integration, these are replaced by a single `HelloWorld.cs`:

```csharp
using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

namespace MyFunctionApp
{
    public class HelloWorld
    {
        private readonly ILogger _logger;

        public HelloWorld(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<HelloWorld>();
        }

        [Function("HelloWorld")]
        public async Task<IActionResult> RunHandler([HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req)
        {
            return await Run(req, _logger);
        }

        // From run.csx
        public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string name = req.Query["name"];

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            name = name ?? data?.name;

            string responseMessage = string.IsNullOrEmpty(name)
                ? "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response."
                        : $"Hello, {name}. This HTTP triggered function executed successfully.";

            return new OkObjectResult(responseMessage);
        }
    }
}
```

## Binding configuration and examples

This section contains references and examples for defining triggers and bindings in C# script. 

### Blob trigger

The following table explains the binding configuration properties for C# script that you set in the *function.json* file. 

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `blobTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. |
|**name** | The name of the variable that represents the blob in function code. |
|**path** | The [container](../storage/blobs/storage-blobs-introduction.md#blob-storage-resources) to monitor.  May be a [blob name pattern](./functions-bindings-storage-blob-trigger.md#blob-name-patterns). |
|**connection** | The name of an app setting or setting collection that specifies how to connect to Azure Blobs. See [Connections](./functions-bindings-storage-blob-trigger.md#connections).|


The following example shows a blob trigger definition in a *function.json* file and code that uses the binding. The function writes a log when a blob is added or updated in the `samples-workitems` [container](../storage/blobs/storage-blobs-introduction.md#blob-storage-resources).

Here's the binding data in the *function.json* file:

```json
{
    "disabled": false,
    "bindings": [
        {
            "name": "myBlob",
            "type": "blobTrigger",
            "direction": "in",
            "path": "samples-workitems/{name}",
            "connection":"MyStorageAccountAppSetting"
        }
    ]
}
```

The string `{name}` in the blob trigger path `samples-workitems/{name}` creates a [binding expression](./functions-bindings-expressions-patterns.md) that you can use in function code to access the file name of the triggering blob. For more information, see [Blob name patterns](./functions-bindings-storage-blob-trigger.md#blob-name-patterns).

Here's C# script code that binds to a `Stream`:

```cs
public static void Run(Stream myBlob, string name, ILogger log)
{
   log.LogInformation($"C# Blob trigger function Processed blob\n Name:{name} \n Size: {myBlob.Length} Bytes");
}
```

Here's C# script code that binds to a `CloudBlockBlob`:

```cs
#r "Microsoft.WindowsAzure.Storage"

using Microsoft.WindowsAzure.Storage.Blob;

public static void Run(CloudBlockBlob myBlob, string name, ILogger log)
{
    log.LogInformation($"C# Blob trigger function Processed blob\n Name:{name}\nURI:{myBlob.StorageUri}");
}
```

### Blob input

The following table explains the binding configuration properties for C# script that you set in the *function.json* file. 

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `blob`. |
|**direction** | Must be set to `in`. |
|**name** | The name of the variable that represents the blob in function code.|
|**path** | The path to the blob. |
|**connection** | The name of an app setting or setting collection that specifies how to connect to Azure Blobs. See [Connections](./functions-bindings-storage-blob-input.md#connections).|

The following example shows blob input and output bindings in a *function.json* file and C# script code that uses the bindings. The function makes a copy of a text blob. The function is triggered by a queue message that contains the name of the blob to copy. The new blob is named *{originalblobname}-Copy*.

In the *function.json* file, the `queueTrigger` metadata property is used to specify the blob name in the `path` properties:

```json
{
  "bindings": [
    {
      "queueName": "myqueue-items",
      "connection": "MyStorageConnectionAppSetting",
      "name": "myQueueItem",
      "type": "queueTrigger",
      "direction": "in"
    },
    {
      "name": "myInputBlob",
      "type": "blob",
      "path": "samples-workitems/{queueTrigger}",
      "connection": "MyStorageConnectionAppSetting",
      "direction": "in"
    },
    {
      "name": "myOutputBlob",
      "type": "blob",
      "path": "samples-workitems/{queueTrigger}-Copy",
      "connection": "MyStorageConnectionAppSetting",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

Here's the C# script code:

```cs
public static void Run(string myQueueItem, string myInputBlob, out string myOutputBlob, ILogger log)
{
    log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");
    myOutputBlob = myInputBlob;
}
```

### Blob output

The following table explains the binding configuration properties for C# script that you set in the *function.json* file. 

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `blob`. |
|**direction** | Must be set to `out`. |
|**name** | The name of the variable that represents the blob in function code.|
|**path** | The path to the blob. |
|**connection** | The name of an app setting or setting collection that specifies how to connect to Azure Blobs. See [Connections](./functions-bindings-storage-blob-output.md#connections).|

The following example shows blob input and output bindings in a *function.json* file and C# script code that uses the bindings. The function makes a copy of a text blob. The function is triggered by a queue message that contains the name of the blob to copy. The new blob is named *{originalblobname}-Copy*.

In the *function.json* file, the `queueTrigger` metadata property is used to specify the blob name in the `path` properties:

```json
{
  "bindings": [
    {
      "queueName": "myqueue-items",
      "connection": "MyStorageConnectionAppSetting",
      "name": "myQueueItem",
      "type": "queueTrigger",
      "direction": "in"
    },
    {
      "name": "myInputBlob",
      "type": "blob",
      "path": "samples-workitems/{queueTrigger}",
      "connection": "MyStorageConnectionAppSetting",
      "direction": "in"
    },
    {
      "name": "myOutputBlob",
      "type": "blob",
      "path": "samples-workitems/{queueTrigger}-Copy",
      "connection": "MyStorageConnectionAppSetting",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

Here's the C# script code:

```cs
public static void Run(string myQueueItem, string myInputBlob, out string myOutputBlob, ILogger log)
{
    log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");
    myOutputBlob = myInputBlob;
}
```

### RabbitMQ trigger

The following example shows a RabbitMQ trigger binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function reads and logs the RabbitMQ message.

Here's the binding data in the *function.json* file:

```json
{​​
    "bindings": [
        {​​
            "name": "myQueueItem",
            "type": "rabbitMQTrigger",
            "direction": "in",
            "queueName": "queue",
            "connectionStringSetting": "rabbitMQConnectionAppSetting"
        }​​
    ]
}​​
```

Here's the C# script code:

```C#
using System;

public static void Run(string myQueueItem, ILogger log)
{​​
    log.LogInformation($"C# Script RabbitMQ trigger function processed: {​​myQueueItem}​​");
}​​
```

### Queue trigger

The following table explains the binding configuration properties for C# script that you set in the *function.json* file.

|function.json property | Description|
|------------|----------------------|
|**type** |Must be set to `queueTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction**|  In the *function.json* file only. Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. |
|**name** | The name of the variable that contains the queue item payload in the function code.  |
|**queueName** |  The name of the queue to poll. |
|**connection** | The name of an app setting or setting collection that specifies how to connect to Azure Queues. See [Connections](./functions-bindings-storage-queue-trigger.md#connections).|


The following example shows a queue trigger binding in a *function.json* file and C# script code that uses the binding. The function polls the `myqueue-items` queue and writes a log each time a queue item is processed.

Here's the *function.json* file:

```json
{
    "disabled": false,
    "bindings": [
        {
            "type": "queueTrigger",
            "direction": "in",
            "name": "myQueueItem",
            "queueName": "myqueue-items",
            "connection":"MyStorageConnectionAppSetting"
        }
    ]
}
```

Here's the C# script code:

```csharp
#r "Microsoft.WindowsAzure.Storage"

using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Queue;
using System;

public static void Run(CloudQueueMessage myQueueItem, 
    DateTimeOffset expirationTime, 
    DateTimeOffset insertionTime, 
    DateTimeOffset nextVisibleTime,
    string queueTrigger,
    string id,
    string popReceipt,
    int dequeueCount,
    ILogger log)
{
    log.LogInformation($"C# Queue trigger function processed: {myQueueItem.AsString}\n" +
        $"queueTrigger={queueTrigger}\n" +
        $"expirationTime={expirationTime}\n" +
        $"insertionTime={insertionTime}\n" +
        $"nextVisibleTime={nextVisibleTime}\n" +
        $"id={id}\n" +
        $"popReceipt={popReceipt}\n" + 
        $"dequeueCount={dequeueCount}");
}
```

### Queue output

The following table explains the binding configuration properties for C# script that you set in the *function.json* file. 

|function.json property | Description|
|---------|----------------------|
|**type** |Must be set to `queue`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** |  Must be set to `out`. This property is set automatically when you create the trigger in the Azure portal. |
|**name** |  The name of the variable that represents the queue in function code. Set to `$return` to reference the function return value.|
|**queueName** | The name of the queue. |
|**connection** | The name of an app setting or setting collection that specifies how to connect to Azure Queues. See [Connections](./functions-bindings-storage-queue-output.md#connections).|

The following example shows an HTTP trigger binding in a *function.json* file and C# script code that uses the binding. The function creates a queue item with a **CustomQueueMessage** object payload for each HTTP request received.

Here's the *function.json* file:

```json
{
  "bindings": [
    {
      "type": "httpTrigger",
      "direction": "in",
      "authLevel": "function",
      "name": "input"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    },
    {
      "type": "queue",
      "direction": "out",
      "name": "$return",
      "queueName": "outqueue",
      "connection": "MyStorageConnectionAppSetting"
    }
  ]
}
```

Here's C# script code that creates a single queue message:

```cs
public class CustomQueueMessage
{
    public string PersonName { get; set; }
    public string Title { get; set; }
}

public static CustomQueueMessage Run(CustomQueueMessage input, ILogger log)
{
    return input;
}
```

You can send multiple messages at once by using an `ICollector` or `IAsyncCollector` parameter. Here's C# script code that sends multiple messages, one with the HTTP request data and one with hard-coded values:

```cs
public static void Run(
    CustomQueueMessage input, 
    ICollector<CustomQueueMessage> myQueueItems, 
    ILogger log)
{
    myQueueItems.Add(input);
    myQueueItems.Add(new CustomQueueMessage { PersonName = "You", Title = "None" });
}
```

### Table input

This section outlines support for the [Tables API version of the extension](./functions-bindings-storage-table.md?tabs=in-process%2Ctable-api) only.

The following table explains the binding configuration properties for C# script that you set in the *function.json* file. 

|function.json property | Description|
|---------|----------------------|
|**type** |  Must be set to `table`. This property is set automatically when you create the binding in the Azure portal.|
|**direction** |  Must be set to `in`. This property is set automatically when you create the binding in the Azure portal. |
|**name** |  The name of the variable that represents the table or entity in function code. | 
|**tableName** |  The name of the table.| 
|**partitionKey** | Optional. The partition key of the table entity to read. | 
|**rowKey** |Optional. The row key of the table entity to read. Can't be used with `take` or `filter`.| 
|**take** | Optional. The maximum number of entities to return. Can't be used with `rowKey`. |
|**filter** | Optional. An OData filter expression for the entities to return from the table. Can't be used with `rowKey`.| 
|**connection** | The name of an app setting or setting collection that specifies how to connect to the table service. See [Connections](./functions-bindings-storage-table-input.md#connections). |

he following example shows a table input binding in a *function.json* file and C# script code that uses the binding. The function uses a queue trigger to read a single table row. 

The *function.json* file specifies a `partitionKey` and a `rowKey`. The `rowKey` value `{queueTrigger}` indicates that the row key comes from the queue message string.

```json
{
  "bindings": [
    {
      "queueName": "myqueue-items",
      "connection": "MyStorageConnectionAppSetting",
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
      "connection": "MyStorageConnectionAppSetting",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

Here's the C# script code:

```csharp
#r "Azure.Data.Tables"
using Microsoft.Extensions.Logging;
using Azure.Data.Tables;

public static void Run(string myQueueItem, Person personEntity, ILogger log)
{
    log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");
    log.LogInformation($"Name in Person entity: {personEntity.Name}");
}

public class Person : ITableEntity
{
    public string Name { get; set; }

    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
}
```

### Table output

This section outlines support for the [Tables API version of the extension](./functions-bindings-storage-table.md?tabs=in-process%2Ctable-api) only.

The following table explains the binding configuration properties for C# script that you set in the *function.json* file. 

|function.json property | Description|
|---|---|
|**type** |Must be set to `table`. This property is set automatically when you create the binding in the Azure portal.|
|**direction** |  Must be set to `out`. This property is set automatically when you create the binding in the Azure portal. |
|**name** |  The variable name used in function code that represents the table or entity. Set to `$return` to reference the function return value.| 
|**tableName** |The name of the table to which to write.| 
|**partitionKey** |The partition key of the table entity to write. | 
|**rowKey** | The row key of the table entity to write. | 
|**connection** | The name of an app setting or setting collection that specifies how to connect to the table service. See [Connections](./functions-bindings-storage-table-output.md#connections). |

The following example shows a table output binding in a *function.json* file and C# script code that uses the binding. The function writes multiple table entities.

Here's the *function.json* file:

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
      "connection": "MyStorageConnectionAppSetting",
      "name": "tableBinding",
      "type": "table",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

Here's the C# script code:

```csharp
public static void Run(string input, ICollector<Person> tableBinding, ILogger log)
{
    for (int i = 1; i < 10; i++)
        {
            log.LogInformation($"Adding Person entity {i}");
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

### Timer trigger

The following table explains the binding configuration properties for C# script that you set in the *function.json* file. 

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `timerTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. |
|**name** | The name of the variable that represents the timer object in function code. | 
|**schedule**| A [CRON expression](./functions-bindings-timer.md#ncrontab-expressions) or a [TimeSpan](./functions-bindings-timer.md#timespan) value. A `TimeSpan` can be used only for a function app that runs on an App Service Plan. You can put the schedule expression in an app setting and set this property to the app setting name wrapped in **%** signs, as in this example: "%ScheduleAppSetting%". |
|**runOnStartup**| If `true`, the function is invoked when the runtime starts. For example, the runtime starts when the function app wakes up after going idle due to inactivity. when the function app restarts due to function changes, and when the function app scales out. *Use with caution.* **runOnStartup** should rarely if ever be set to `true`, especially in production. |
|**useMonitor**| Set to `true` or `false` to indicate whether the schedule should be monitored. Schedule monitoring persists schedule occurrences to aid in ensuring the schedule is maintained correctly even when function app instances restart. If not set explicitly, the default is `true` for schedules that have a recurrence interval greater than or equal to 1 minute. For schedules that trigger more than once per minute, the default is `false`. |

The following example shows a timer trigger binding in a *function.json* file and a C# script function that uses the binding. The function writes a log indicating whether this function invocation is due to a missed schedule occurrence. The [`TimerInfo`](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions/Extensions/Timers/TimerInfo.cs) object is passed into the function.

Here's the binding data in the *function.json* file:

```json
{
    "schedule": "0 */5 * * * *",
    "name": "myTimer",
    "type": "timerTrigger",
    "direction": "in"
}
```

Here's the C# script code:

```csharp
public static void Run(TimerInfo myTimer, ILogger log)
{
    if (myTimer.IsPastDue)
    {
        log.LogInformation("Timer is running late!");
    }
    log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}" );  
}
```

### HTTP trigger

The following table explains the trigger configuration properties that you set in the *function.json* file:

|function.json property | Description|
|---------|---------------------|
| **type** | Required - must be set to `httpTrigger`. |
| **direction** | Required - must be set to `in`. |
| **name** | Required - the variable name used in function code for the request or request body. |
| **authLevel** |  Determines what keys, if any, need to be present on the request in order to invoke the function. For supported values, see [Authorization level](./functions-bindings-http-webhook-trigger.md#http-auth).  |
| **methods** | An array of the HTTP methods to which the function  responds. If not specified, the function responds to all HTTP methods. See [customize the HTTP endpoint](./functions-bindings-http-webhook-trigger.md#customize-the-http-endpoint). |
| **route** |  Defines the route template, controlling to which request URLs your function responds. The default value if none is provided is `<functionname>`. For more information, see [customize the HTTP endpoint](./functions-bindings-http-webhook-trigger.md#customize-the-http-endpoint). |
| **webHookType** | _Supported only for the version 1.x runtime._<br/><br/>Configures the HTTP trigger to act as a [webhook](https://en.wikipedia.org/wiki/Webhook) receiver for the specified provider. For supported values, see [WebHook type](./functions-bindings-http-webhook-trigger.md#webhook-type).|

The following example shows a trigger binding in a *function.json* file and a C# script function that uses the binding. The function looks for a `name` parameter either in the query string or the body of the HTTP request.

Here's the *function.json* file:

```json
{
    "disabled": false,
    "bindings": [
        {
            "authLevel": "function",
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
        }
    ]
}
```

Here's C# script code that binds to `HttpRequest`:

```cs
#r "Newtonsoft.Json"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string name = req.Query["name"];
    
    string requestBody = String.Empty;
    using (StreamReader streamReader =  new  StreamReader(req.Body))
    {
        requestBody = await streamReader.ReadToEndAsync();
    }
    dynamic data = JsonConvert.DeserializeObject(requestBody);
    name = name ?? data?.name;
    
    return name != null
        ? (ActionResult)new OkObjectResult($"Hello, {name}")
        : new BadRequestObjectResult("Please pass a name on the query string or in the request body");
}
```

You can bind to a custom object instead of `HttpRequest`. This object is created from the body of the request and parsed as JSON. Similarly, a type can be passed to the HTTP response output binding and returned as the response body, along with a `200` status code.

```csharp
using System.Net;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

public static string Run(Person person, ILogger log)
{   
    return person.Name != null
        ? (ActionResult)new OkObjectResult($"Hello, {person.Name}")
        : new BadRequestObjectResult("Please pass an instance of Person.");
}

public class Person {
     public string Name {get; set;}
}
```

### HTTP output

The following table explains the binding configuration properties that you set in the *function.json* file.

|Property  |Description  |
|---------|---------|
| **type** |Must be set to `http`. |
| **direction** | Must be set to `out`. |
| **name** | The variable name used in function code for the response, or `$return` to use the return value. |

### Event Hubs trigger

The following table explains the trigger configuration properties that you set in the *function.json* file:

|function.json property | Description|
|---------|----------------------|
|**type** |  Must be set to `eventHubTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** |  Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. |
|**name** |  The name of the variable that represents the event item in function code. |
|**eventHubName** | Functions 2.x and higher. The name of the event hub. When the event hub name is also present in the connection string, that value overrides this property at runtime. Can be referenced via [app settings](./functions-bindings-expressions-patterns.md#binding-expressions---app-settings) `%eventHubName%`. In version 1.x, this property is named `path`. |
|**consumerGroup** |An optional property that sets the [consumer group](../event-hubs/event-hubs-features.md#event-consumers) used to subscribe to events in the hub. If omitted, the `$Default` consumer group is used. |
|**connection** | The name of an app setting or setting collection that specifies how to connect to Event Hubs. See [Connections](./functions-bindings-event-hubs-trigger.md#connections).|


The following example shows an Event Hubs trigger binding in a *function.json* file and a C# script function    that uses the binding. The function logs the message body of the Event Hubs trigger.

The following examples show Event Hubs binding data in the *function.json* file for Functions runtime version 2.x and later versions. 

```json
{
  "type": "eventHubTrigger",
  "name": "myEventHubMessage",
  "direction": "in",
  "eventHubName": "MyEventHub",
  "connection": "myEventHubReadConnectionAppSetting"
}
```

Here's the C# script code:

```cs
using System;

public static void Run(string myEventHubMessage, TraceWriter log)
{
    log.Info($"C# function triggered to process a message: {myEventHubMessage}");
}
```

To get access to event metadata in function code, bind to an [EventData](/dotnet/api/microsoft.servicebus.messaging.eventdata) object. You can also access the same properties by using binding expressions in the method signature. The following example shows both ways to get the same data:

```cs
#r "Microsoft.Azure.EventHubs"

using System.Text;
using System;
using Microsoft.ServiceBus.Messaging;
using Microsoft.Azure.EventHubs;

public void Run(EventData myEventHubMessage,
    DateTime enqueuedTimeUtc,
    Int64 sequenceNumber,
    string offset,
    TraceWriter log)
{
    log.Info($"Event: {Encoding.UTF8.GetString(myEventHubMessage.Body)}");
    log.Info($"EnqueuedTimeUtc={myEventHubMessage.SystemProperties.EnqueuedTimeUtc}");
    log.Info($"SequenceNumber={myEventHubMessage.SystemProperties.SequenceNumber}");
    log.Info($"Offset={myEventHubMessage.SystemProperties.Offset}");

    // Metadata accessed by using binding expressions
    log.Info($"EnqueuedTimeUtc={enqueuedTimeUtc}");
    log.Info($"SequenceNumber={sequenceNumber}");
    log.Info($"Offset={offset}");
}
```

To receive events in a batch, make `string` or `EventData` an array:

```cs
public static void Run(string[] eventHubMessages, TraceWriter log)
{
    foreach (var message in eventHubMessages)
    {
        log.Info($"C# function triggered to process a message: {message}");
    }
}
```

### Event Hubs output

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|------------------------|
|**type** |  Must be set to `eventHub`. |
|**direction** | Must be set to `out`. This parameter is set automatically when you create the binding in the Azure portal. |
|**name** |  The variable name used in function code that represents the event. |
|**eventHubName** | Functions 2.x and higher. The name of the event hub. When the event hub name is also present in the connection string, that value overrides this property at runtime. In Functions 1.x, this property is named `path`.|
|**connection**  | The name of an app setting or setting collection that specifies how to connect to Event Hubs. To learn more, see [Connections](./functions-bindings-event-hubs-output.md#connections).|

The following example shows an event hub trigger binding in a *function.json* file and a C# script function that uses the binding. The function writes a message to an event hub.

The following examples show Event Hubs binding data in the *function.json* file for Functions runtime version 2.x and later versions. 

```json
{
    "type": "eventHub",
    "name": "outputEventHubMessage",
    "eventHubName": "myeventhub",
    "connection": "MyEventHubSendAppSetting",
    "direction": "out"
}
```

Here's C# script code that creates one message:

```cs
using System;
using Microsoft.Extensions.Logging;

public static void Run(TimerInfo myTimer, out string outputEventHubMessage, ILogger log)
{
    String msg = $"TimerTriggerCSharp1 executed at: {DateTime.Now}";
    log.LogInformation(msg);   
    outputEventHubMessage = msg;
}
```

Here's C# script code that creates multiple messages:

```cs
public static void Run(TimerInfo myTimer, ICollector<string> outputEventHubMessage, ILogger log)
{
    string message = $"Message created at: {DateTime.Now}";
    log.LogInformation(message);
    outputEventHubMessage.Add("1 " + message);
    outputEventHubMessage.Add("2 " + message);
}
```

### Event Grid trigger

The following table explains the binding configuration properties for C# script that you set in the *function.json* file. There are no constructor parameters or properties to set in the `EventGridTrigger` attribute.

|function.json property |Description|
|---------|---------|
| **type** | Required - must be set to `eventGridTrigger`. |
| **direction** | Required - must be set to `in`. |
| **name** | Required - the variable name used in function code for the parameter that receives the event data. |

The following example shows an Event Grid trigger defined in the *function.json* file.

Here's the binding data in the *function.json* file:

```json
{
  "bindings": [
    {
      "type": "eventGridTrigger",
      "name": "eventGridEvent",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

Here's an example of a C# script function that uses an  `EventGridEvent` binding parameter:

```csharp
#r "Azure.Messaging.EventGrid"
using Azure.Messaging.EventGrid;
using Microsoft.Extensions.Logging;

public static void Run(EventGridEvent eventGridEvent, ILogger log)
{
    log.LogInformation(eventGridEvent.Data.ToString());
}
```

Here's an example of a C# script function that uses a `JObject` binding parameter:

```cs
#r "Newtonsoft.Json"

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public static void Run(JObject eventGridEvent, TraceWriter log)
{
    log.Info(eventGridEvent.ToString(Formatting.Indented));
}
```

### Event Grid output

The following table explains the binding configuration properties for C# script that you set in the *function.json* file.

|function.json property | Description|
|---------|---------|----------------------|
|**type** |  Must be set to `eventGrid`. |
|**direction** | Must be set to `out`. This parameter is set automatically when you create the binding in the Azure portal. |
|**name** | The variable name used in function code that represents the event. |
|**topicEndpointUri** | The name of an app setting that contains the URI for the custom topic, such as `MyTopicEndpointUri`. |
|**topicKeySetting** | The name of an app setting that contains an access key for the custom topic. |

The following example shows the Event Grid output binding data in the *function.json* file.

```json
{
    "type": "eventGrid",
    "name": "outputEvent",
    "topicEndpointUri": "MyEventGridTopicUriSetting",
    "topicKeySetting": "MyEventGridTopicKeySetting",
    "direction": "out"
}
```

Here's C# script code that creates one event:

```cs
#r "Microsoft.Azure.EventGrid"
using System;
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Extensions.Logging;

public static void Run(TimerInfo myTimer, out EventGridEvent outputEvent, ILogger log)
{
    outputEvent = new EventGridEvent("message-id", "subject-name", "event-data", "event-type", DateTime.UtcNow, "1.0");
}
```

Here's C# script code that creates multiple events:

```cs
#r "Microsoft.Azure.EventGrid"
using System;
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Extensions.Logging;

public static void Run(TimerInfo myTimer, ICollector<EventGridEvent> outputEvent, ILogger log)
{
    outputEvent.Add(new EventGridEvent("message-id-1", "subject-name", "event-data", "event-type", DateTime.UtcNow, "1.0"));
    outputEvent.Add(new EventGridEvent("message-id-2", "subject-name", "event-data", "event-type", DateTime.UtcNow, "1.0"));
}
```

### Service Bus trigger

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|----------------------|
|**type** |  Must be set to `serviceBusTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. |
|**name** | The name of the variable that represents the queue or topic message in function code. |
|**queueName**| Name of the queue to monitor.  Set only if monitoring a queue, not for a topic.
|**topicName**| Name of the topic to monitor. Set only if monitoring a topic, not for a queue.|
|**subscriptionName**| Name of the subscription to monitor. Set only if monitoring a topic, not for a queue.|
|**connection**|  The name of an app setting or setting collection that specifies how to connect to Service Bus. See [Connections](./functions-bindings-service-bus-trigger.md#connections).|
|**accessRights**| Access rights for the connection string. Available values are `manage` and `listen`. The default is `manage`, which indicates that the `connection` has the **Manage** permission. If you use a connection string that does not have the **Manage** permission, set `accessRights` to "listen". Otherwise, the Functions runtime might fail trying to do operations that require manage rights. In Azure Functions version 2.x and higher, this property is not available because the latest version of the Service Bus SDK doesn't support manage operations.|
|**isSessionsEnabled**| `true` if connecting to a [session-aware](../service-bus-messaging/message-sessions.md) queue or subscription. `false` otherwise, which is the default value.|
|**autoComplete**| `true` when the trigger should automatically call complete after processing, or if the function code will manually call complete.<br/><br/>Setting to `false` is only supported in C#.<br/><br/>If set to `true`, the trigger completes the message automatically if the function execution completes successfully, and abandons the message otherwise.<br/><br/>When set to `false`, you are responsible for calling [MessageReceiver](/dotnet/api/microsoft.azure.servicebus.core.messagereceiver) methods to complete, abandon, or deadletter the message. If an exception is thrown (and none of the `MessageReceiver` methods are called), then the lock remains. Once the lock expires, the message is re-queued with the `DeliveryCount` incremented and the lock is automatically renewed.<br/><br/>This property is available only in Azure Functions 2.x and higher. |

The following example shows a Service Bus trigger binding in a *function.json* file and a C# script function that uses the binding. The function reads message metadata and logs a Service Bus queue message.

Here's the binding data in the *function.json* file:

```json
{
"bindings": [
    {
    "queueName": "testqueue",
    "connection": "MyServiceBusConnection",
    "name": "myQueueItem",
    "type": "serviceBusTrigger",
    "direction": "in"
    }
],
"disabled": false
}
```

Here's the C# script code:

```cs
using System;

public static void Run(string myQueueItem,
    Int32 deliveryCount,
    DateTime enqueuedTimeUtc,
    string messageId,
    TraceWriter log)
{
    log.Info($"C# ServiceBus queue trigger function processed message: {myQueueItem}");

    log.Info($"EnqueuedTimeUtc={enqueuedTimeUtc}");
    log.Info($"DeliveryCount={deliveryCount}");
    log.Info($"MessageId={messageId}");
}
```

### Service Bus output

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|---------|----------------------|
|**type** |Must be set to `serviceBus`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction**  | Must be set to `out`. This property is set automatically when you create the trigger in the Azure portal. |
|**name**  | The name of the variable that represents the queue or topic message in function code. Set to "$return" to reference the function return value. |
|**queueName**|Name of the queue.  Set only if sending queue messages, not for a topic.
|**topicName**|Name of the topic. Set only if sending topic messages, not for a queue.|
|**connection**|The name of an app setting or setting collection that specifies how to connect to Service Bus. See [Connections](./functions-bindings-service-bus-output.md#connections).|
|**accessRights** (v1 only)|Access rights for the connection string. Available values are `manage` and `listen`. The default is `manage`, which indicates that the `connection` has the **Manage** permission. If you use a connection string that does not have the **Manage** permission, set `accessRights` to "listen". Otherwise, the Functions runtime might fail trying to do operations that require manage rights. In Azure Functions version 2.x and higher, this property is not available because the latest version of the Service Bus SDK doesn't support manage operations.|

The following example shows a Service Bus output binding in a *function.json* file and a C# script function that uses the binding. The function uses a timer trigger to send a queue message every 15 seconds.

Here's the binding data in the *function.json* file:

```json
{
    "bindings": [
        {
            "schedule": "0/15 * * * * *",
            "name": "myTimer",
            "runsOnStartup": true,
            "type": "timerTrigger",
            "direction": "in"
        },
        {
            "name": "outputSbQueue",
            "type": "serviceBus",
            "queueName": "testqueue",
            "connection": "MyServiceBusConnection",
            "direction": "out"
        }
    ],
    "disabled": false
}
```

Here's C# script code that creates a single message:

```cs
public static void Run(TimerInfo myTimer, ILogger log, out string outputSbQueue)
{
    string message = $"Service Bus queue message created at: {DateTime.Now}";
    log.LogInformation(message); 
    outputSbQueue = message;
}
```

Here's C# script code that creates multiple messages:

```cs
public static async Task Run(TimerInfo myTimer, ILogger log, IAsyncCollector<string> outputSbQueue)
{
    string message = $"Service Bus queue messages created at: {DateTime.Now}";
    log.LogInformation(message); 
    await outputSbQueue.AddAsync("1 " + message);
    await outputSbQueue.AddAsync("2 " + message);
}
```

### Azure Cosmos DB v2 trigger

This section outlines support for the [version 4.x+ of the extension](./functions-bindings-cosmosdb-v2.md?tabs=in-process%2Cextensionv4) only.

The following table explains the binding configuration properties that you set in the *function.json* file.

[!INCLUDE [functions-cosmosdb-settings-v4](../../includes/functions-cosmosdb-settings-v4.md)]

The following example shows an Azure Cosmos DB trigger binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function writes log messages when Azure Cosmos DB records are added or modified.

Here's the binding data in the *function.json* file:

```json
{
    "type": "cosmosDBTrigger",
    "name": "documents",
    "direction": "in",
    "leaseContainerName": "leases",
    "connection": "<connection-app-setting>",
    "databaseName": "Tasks",
    "containerName": "Items",
    "createLeaseContainerIfNotExists": true
}
```

Here's the C# script code:

```cs
    using System;
    using System.Collections.Generic;
    using Microsoft.Extensions.Logging;

    // Customize the model with your own desired properties
    public class ToDoItem
    {
        public string id { get; set; }
        public string Description { get; set; }
    }

    public static void Run(IReadOnlyList<ToDoItem> documents, ILogger log)
    {
      log.LogInformation("Documents modified " + documents.Count);
      log.LogInformation("First document Id " + documents[0].id);
    }
```

### Azure Cosmos DB v2 input

This section outlines support for the [version 4.x+ of the extension](./functions-bindings-cosmosdb-v2.md?tabs=in-process%2Cextensionv4) only.

The following table explains the binding configuration properties that you set in the *function.json* file.

[!INCLUDE [functions-cosmosdb-input-settings-v4](../../includes/functions-cosmosdb-input-settings-v4.md)]

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

<a id="queue-trigger-look-up-id-from-string-c-script"></a>

#### Queue trigger, look up ID from string

The following example shows an Azure Cosmos DB input binding in a *function.json* file and a C# script function that uses the binding. The function reads a single document and updates the document's text value.

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

Here's the C# script code:

```cs
    using System;

    // Change input document contents using Azure Cosmos DB input binding
    public static void Run(string myQueueItem, dynamic inputDocument)
    {
      inputDocument.text = "This has changed.";
    }
```

<a id="queue-trigger-get-multiple-docs-using-sqlquery-c-script"></a>

#### Queue trigger, get multiple docs, using SqlQuery

The following example shows an Azure Cosmos DB input binding in a *function.json* file and a C# script function that uses the binding. The function retrieves multiple documents specified by a SQL query, using a queue trigger to customize the query parameters.

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

<a id="http-trigger-look-up-id-from-query-string-c-script"></a>

#### HTTP trigger, look up ID from query string

The following example shows a C# script function that retrieves a single document. The function is triggered by an HTTP request that uses a query string to specify the ID and partition key value to look up. That ID and partition key value are used to retrieve a `ToDoItem` document from the specified database and collection.

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
      "Id": "{Query.id}",
      "PartitionKey" : "{Query.partitionKeyValue}"
    }
  ],
  "disabled": false
}
```

Here's the C# script code:

```cs
using System.Net;
using Microsoft.Extensions.Logging;

public static HttpResponseMessage Run(HttpRequestMessage req, ToDoItem toDoItem, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    if (toDoItem == null)
    {
         log.LogInformation($"ToDo item not found");
    }
    else
    {
        log.LogInformation($"Found ToDo item, Description={toDoItem.Description}");
    }
    return req.CreateResponse(HttpStatusCode.OK);
}
```

<a id="http-trigger-look-up-id-from-route-data-c-script"></a>

#### HTTP trigger, look up ID from route data

The following example shows a C# script function that retrieves a single document. The function is triggered by an HTTP request that uses route data to specify the ID and partition key value to look up. That ID and partition key value are used to retrieve a `ToDoItem` document from the specified database and collection.

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
      "route":"todoitems/{partitionKeyValue}/{id}"
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
      "id": "{id}",
      "partitionKey": "{partitionKeyValue}"
    }
  ],
  "disabled": false
}
```

Here's the C# script code:

```cs
using System.Net;
using Microsoft.Extensions.Logging;

public static HttpResponseMessage Run(HttpRequestMessage req, ToDoItem toDoItem, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    if (toDoItem == null)
    {
         log.LogInformation($"ToDo item not found");
    }
    else
    {
        log.LogInformation($"Found ToDo item, Description={toDoItem.Description}");
    }
    return req.CreateResponse(HttpStatusCode.OK);
}
```

<a id="http-trigger-get-multiple-docs-using-sqlquery-c-script"></a>

#### HTTP trigger, get multiple docs, using SqlQuery

The following example shows a C# script function that retrieves a list of documents. The function is triggered by an HTTP request. The query is specified in the `SqlQuery` attribute property.

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
using Microsoft.Extensions.Logging;

public static HttpResponseMessage Run(HttpRequestMessage req, IEnumerable<ToDoItem> toDoItems, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    foreach (ToDoItem toDoItem in toDoItems)
    {
        log.LogInformation(toDoItem.Description);
    }
    return req.CreateResponse(HttpStatusCode.OK);
}
```

<a id="http-trigger-get-multiple-docs-using-documentclient-c-script"></a>

#### HTTP trigger, get multiple docs, using DocumentClient

The following example shows a C# script function that retrieves a list of documents. The function is triggered by an HTTP request. The code uses a `DocumentClient` instance provided by the Azure Cosmos DB binding to read a list of documents. The `DocumentClient` instance could also be used for write operations.

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
using Microsoft.Extensions.Logging;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, DocumentClient client, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    Uri collectionUri = UriFactory.CreateDocumentCollectionUri("ToDoItems", "Items");
    string searchterm = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "searchterm", true) == 0)
        .Value;

    if (searchterm == null)
    {
        return req.CreateResponse(HttpStatusCode.NotFound);
    }

    log.LogInformation($"Searching for word: {searchterm} using Uri: {collectionUri.ToString()}");
    IDocumentQuery<ToDoItem> query = client.CreateDocumentQuery<ToDoItem>(collectionUri)
        .Where(p => p.Description.Contains(searchterm))
        .AsDocumentQuery();

    while (query.HasMoreResults)
    {
        foreach (ToDoItem result in await query.ExecuteNextAsync())
        {
            log.LogInformation(result.Description);
        }
    }
    return req.CreateResponse(HttpStatusCode.OK);
}
```

### Azure Cosmos DB v2 output

This section outlines support for the [version 4.x+ of the extension](./functions-bindings-cosmosdb-v2.md?tabs=in-process%2Cextensionv4) only.

The following table explains the binding configuration properties that you set in the *function.json* file.

[!INCLUDE [functions-cosmosdb-output-settings-v4](../../includes/functions-cosmosdb-output-settings-v4.md)]

This section contains the following examples:

* [Queue trigger, write one doc](#queue-trigger-write-one-doc-c-script)
* [Queue trigger, write docs using IAsyncCollector](#queue-trigger-write-docs-using-iasynccollector-c-script)

<a id="queue-trigger-write-one-doc-c-script"></a>

#### Queue trigger, write one doc

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

Here's the C# script code:

```cs
    #r "Newtonsoft.Json"

    using Microsoft.Azure.WebJobs.Host;
    using Newtonsoft.Json.Linq;
    using Microsoft.Extensions.Logging;

    public static void Run(string myQueueItem, out object employeeDocument, ILogger log)
    {
      log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");

      dynamic employee = JObject.Parse(myQueueItem);

      employeeDocument = new {
        id = employee.name + "-" + employee.employeeId,
        name = employee.name,
        employeeId = employee.employeeId,
        address = employee.address
      };
    }
```

<a id="queue-trigger-write-docs-using-iasynccollector-c-script"></a>

#### Queue trigger, write docs using IAsyncCollector

To create multiple documents, you can bind to `ICollector<T>` or `IAsyncCollector<T>` where `T` is one of the supported types.

This example refers to a simple `ToDoItem` type:

```cs
namespace CosmosDBSamplesV2
{
    public class ToDoItem
    {
        public string id { get; set; }
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
using Microsoft.Extensions.Logging;

public static async Task Run(ToDoItem[] toDoItemsIn, IAsyncCollector<ToDoItem> toDoItemsOut, ILogger log)
{
    log.LogInformation($"C# Queue trigger function processed {toDoItemsIn?.Length} items");

    foreach (ToDoItem toDoItem in toDoItemsIn)
    {
        log.LogInformation($"Description={toDoItem.Description}");
        await toDoItemsOut.AddAsync(toDoItem);
    }
}
```

### Azure Cosmos DB v1 trigger

The following example shows an Azure Cosmos DB trigger binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function writes log messages when Azure Cosmos DB records are modified.

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
        log.Info("Documents modified " + documents.Count);
        log.Info("First document Id " + documents[0].Id);
    }
```

### Azure Cosmos DB v1 input

This section contains the following examples:

* [Queue trigger, look up ID from string](#queue-trigger-look-up-id-from-string-c-script)
* [Queue trigger, get multiple docs, using SqlQuery](#queue-trigger-get-multiple-docs-using-sqlquery-c-script)
* [HTTP trigger, look up ID from query string](#http-trigger-look-up-id-from-query-string-c-script)
* [HTTP trigger, look up ID from route data](#http-trigger-look-up-id-from-route-data-c-script)
* [HTTP trigger, get multiple docs, using SqlQuery](#http-trigger-get-multiple-docs-using-sqlquery-c-script)
* [HTTP trigger, get multiple docs, using DocumentClient](#http-trigger-get-multiple-docs-using-documentclient-c-script)

The HTTP trigger examples refer to a simple `ToDoItem` type:

```cs
namespace CosmosDBSamplesV1
{
    public class ToDoItem
    {
        public string Id { get; set; }
        public string Description { get; set; }
    }
}
```

<a id="queue-trigger-look-up-id-from-string-c-script"></a>

#### Queue trigger, look up ID from string

The following example shows an Azure Cosmos DB input binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function reads a single document and updates the document's text value.

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

Here's the C# script code:

```cs
    using System;

    // Change input document contents using Azure Cosmos DB input binding
    public static void Run(string myQueueItem, dynamic inputDocument)
    {
        inputDocument.text = "This has changed.";
    }
```

<a id="queue-trigger-get-multiple-docs-using-sqlquery-c-script"></a>

#### Queue trigger, get multiple docs, using SqlQuery

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

<a id="http-trigger-look-up-id-from-query-string-c-script"></a>

#### HTTP trigger, look up ID from query string

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
      "type": "documentDB",
      "name": "toDoItem",
      "databaseName": "ToDoItems",
      "collectionName": "Items",
      "connection": "CosmosDBConnection",
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

<a id="http-trigger-look-up-id-from-route-data-c-script"></a>

#### HTTP trigger, look up ID from route data

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
      "type": "documentDB",
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

<a id="http-trigger-get-multiple-docs-using-sqlquery-c-script"></a>

#### HTTP trigger, get multiple docs, using SqlQuery

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
      "type": "documentDB",
      "name": "toDoItems",
      "databaseName": "ToDoItems",
      "collectionName": "Items",
      "connection": "CosmosDBConnection",
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

<a id="http-trigger-get-multiple-docs-using-documentclient-c-script"></a>

#### HTTP trigger, get multiple docs, using DocumentClient

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
      "type": "documentDB",
      "name": "client",
      "databaseName": "ToDoItems",
      "collectionName": "Items",
      "connection": "CosmosDBConnection",
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

### Azure Cosmos DB v1 output

This section contains the following examples:

* Queue trigger, write one doc
* Queue trigger, write docs using `IAsyncCollector`

#### Queue trigger, write one doc

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
namespace CosmosDBSamplesV1
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
      "connection": "AzureWebJobsStorage"
    },
    {
      "type": "documentDB",
      "name": "toDoItemsOut",
      "databaseName": "ToDoItems",
      "collectionName": "Items",
      "connection": "CosmosDBConnection",
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

### Azure SQL trigger

More samples for the Azure SQL trigger are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-csx).


The example refers to a `ToDoItem` class and a corresponding database table:

:::code language="csharp" source="~/functions-sql-todo-sample/ToDoModel.cs" range="6-16":::

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="1-7":::

[Change tracking](./functions-bindings-azure-sql-trigger.md#set-up-change-tracking-required) is enabled on the database and on the table:

```sql
ALTER DATABASE [SampleDatabase]
SET CHANGE_TRACKING = ON
(CHANGE_RETENTION = 2 DAYS, AUTO_CLEANUP = ON);

ALTER TABLE [dbo].[ToDo]
ENABLE CHANGE_TRACKING;
```

The SQL trigger binds to a `IReadOnlyList<SqlChange<T>>`, a list of `SqlChange` objects each with two properties:
- **Item:** the item that was changed. The type of the item should follow the table schema as seen in the `ToDoItem` class.
- **Operation:** a value from `SqlChangeOperation` enum. The possible values are `Insert`, `Update`, and `Delete`.

The following example shows a SQL trigger in a function.json file and a [C# script function](functions-reference-csharp.md) that is invoked when there are changes to the `ToDo` table:

The following is binding data in the function.json file:

```json
{
    "name": "todoChanges",
    "type": "sqlTrigger",
    "direction": "in",
    "tableName": "dbo.ToDo",
    "connectionStringSetting": "SqlConnectionString"
}
```
The following is the C# script function:

```csharp
#r "Newtonsoft.Json"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

public static void Run(IReadOnlyList<SqlChange<ToDoItem>> todoChanges, ILogger log)
{
    log.LogInformation($"C# SQL trigger function processed a request.");

    foreach (SqlChange<ToDoItem> change in todoChanges)
    {
        ToDoItem toDoItem = change.Item;
        log.LogInformation($"Change operation: {change.Operation}");
        log.LogInformation($"Id: {toDoItem.Id}, Title: {toDoItem.title}, Url: {toDoItem.url}, Completed: {toDoItem.completed}");
    }
}
```

### Azure SQL input

More samples for the Azure SQL input binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-csx).

This section contains the following examples:

* [HTTP trigger, get row by ID from query string](#http-trigger-look-up-id-from-query-string-csharpscript)
* [HTTP trigger, delete rows](#http-trigger-delete-one-or-multiple-rows-csharpscript)

The examples refer to a `ToDoItem` class and a corresponding database table:

:::code language="csharp" source="~/functions-sql-todo-sample/ToDoModel.cs" range="6-16":::

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="1-7":::

<a id="http-trigger-look-up-id-from-query-string-csharpscript"></a>
#### HTTP trigger, get row by ID from query string

The following example shows an Azure SQL input binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function is triggered by an HTTP request that uses a query string to specify the ID. That ID is used to retrieve a `ToDoItem` record with the specified query.

> [!NOTE]
> The HTTP query string parameter is case-sensitive.
>

Here's the binding data in the *function.json* file:

```json
{
    "authLevel": "anonymous",
    "type": "httpTrigger",
    "direction": "in",
    "name": "req",
    "methods": [
        "get"
    ]
},
{
    "type": "http",
    "direction": "out",
    "name": "res"
},
{
    "name": "todoItem",
    "type": "sql",
    "direction": "in",
    "commandText": "select [Id], [order], [title], [url], [completed] from dbo.ToDo where Id = @Id",
    "commandType": "Text",
    "parameters": "@Id = {Query.id}",
    "connectionStringSetting": "SqlConnectionString"
}
```

Here's the C# script code:

```cs
#r "Newtonsoft.Json"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using System.Collections.Generic;

public static IActionResult Run(HttpRequest req, ILogger log, IEnumerable<ToDoItem> todoItem)
{
    return new OkObjectResult(todoItem);
}
```


<a id="http-trigger-delete-one-or-multiple-rows-csharpscript"></a>
#### HTTP trigger, delete rows

The following example shows an Azure SQL input binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding to execute a stored procedure with input from the HTTP request query parameter. In this example, the stored procedure deletes a single record or all records depending on the value of the parameter.

The stored procedure `dbo.DeleteToDo` must be created on the SQL database.

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="11-25":::

Here's the binding data in the *function.json* file:

```json
{
    "authLevel": "anonymous",
    "type": "httpTrigger",
    "direction": "in",
    "name": "req",
    "methods": [
        "get"
    ]
},
{
    "type": "http",
    "direction": "out",
    "name": "res"
},
{
    "name": "todoItems",
    "type": "sql",
    "direction": "in",
    "commandText": "DeleteToDo",
    "commandType": "StoredProcedure",
    "parameters": "@Id = {Query.id}",
    "connectionStringSetting": "SqlConnectionString"
}
```

:::code language="csharp" source="~/functions-sql-todo-sample/DeleteToDo.cs" range="4-30":::

Here's the C# script code:

```cs
#r "Newtonsoft.Json"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using System.Collections.Generic;

public static IActionResult Run(HttpRequest req, ILogger log, IEnumerable<ToDoItem> todoItems)
{
    return new OkObjectResult(todoItems);
}
```

### Azure SQL output

More samples for the Azure SQL output binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples/samples-csx).

This section contains the following examples:

* [HTTP trigger, write records to a table](#http-trigger-write-records-to-table-csharpscript)
* [HTTP trigger, write to two tables](#http-trigger-write-to-two-tables-csharpscript)

The examples refer to a `ToDoItem` class and a corresponding database table:

:::code language="csharp" source="~/functions-sql-todo-sample/ToDoModel.cs" range="6-16":::

:::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="1-7":::


<a id="http-trigger-write-records-to-table-csharpscript"></a>
#### HTTP trigger, write records to a table

The following example shows a SQL output binding in a function.json file and a [C# script function](functions-reference-csharp.md) that adds records to a table, using data provided in an HTTP POST request as a JSON body.

The following is binding data in the function.json file:

```json
{
    "authLevel": "anonymous",
    "type": "httpTrigger",
    "direction": "in",
    "name": "req",
    "methods": [
        "post"
    ]
},
{
    "type": "http",
    "direction": "out",
    "name": "res"
},
{
    "name": "todoItem",
    "type": "sql",
    "direction": "out",
    "commandText": "dbo.ToDo",
    "connectionStringSetting": "SqlConnectionString"
}
```

The following is sample C# script code:

```cs
#r "Newtonsoft.Json"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

public static IActionResult Run(HttpRequest req, ILogger log, out ToDoItem todoItem)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string requestBody = new StreamReader(req.Body).ReadToEnd();
    todoItem = JsonConvert.DeserializeObject<ToDoItem>(requestBody);

    return new OkObjectResult(todoItem);
}
```

<a id="http-trigger-write-to-two-tables-csharpscript"></a>
#### HTTP trigger, write to two tables

The following example shows a SQL output binding in a function.json file and a [C# script function](functions-reference-csharp.md) that adds records to a database in two different tables (`dbo.ToDo` and `dbo.RequestLog`), using data provided in an HTTP POST request as a JSON body and multiple output bindings.

The second table, `dbo.RequestLog`, corresponds to the following definition:

```sql
CREATE TABLE dbo.RequestLog (
    Id int identity(1,1) primary key,
    RequestTimeStamp datetime2 not null,
    ItemCount int not null
)
```

The following is binding data in the function.json file:

```json
{
    "authLevel": "anonymous",
    "type": "httpTrigger",
    "direction": "in",
    "name": "req",
    "methods": [
        "post"
    ]
},
{
    "type": "http",
    "direction": "out",
    "name": "res"
},
{
    "name": "todoItem",
    "type": "sql",
    "direction": "out",
    "commandText": "dbo.ToDo",
    "connectionStringSetting": "SqlConnectionString"
},
{
    "name": "requestLog",
    "type": "sql",
    "direction": "out",
    "commandText": "dbo.RequestLog",
    "connectionStringSetting": "SqlConnectionString"
}
```

The following is sample C# script code:

```cs
#r "Newtonsoft.Json"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

public static IActionResult Run(HttpRequest req, ILogger log, out ToDoItem todoItem, out RequestLog requestLog)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string requestBody = new StreamReader(req.Body).ReadToEnd();
    todoItem = JsonConvert.DeserializeObject<ToDoItem>(requestBody);

    requestLog = new RequestLog();
    requestLog.RequestTimeStamp = DateTime.Now;
    requestLog.ItemCount = 1;

    return new OkObjectResult(todoItem);
}

public class RequestLog {
    public DateTime RequestTimeStamp { get; set; }
    public int ItemCount { get; set; }
}
```

### RabbitMQ output

The following example shows a RabbitMQ output binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function reads in the message from an HTTP trigger and outputs it to the RabbitMQ queue.

Here's the binding data in the *function.json* file:

```json
{
    "bindings": [
        {
            "type": "httpTrigger",
            "direction": "in",
            "authLevel": "function",
            "name": "input",
            "methods": [
                "get",
                "post"
            ]
        },
        {
            "type": "rabbitMQ",
            "name": "outputMessage",
            "queueName": "outputQueue",
            "connectionStringSetting": "rabbitMQConnectionAppSetting",
            "direction": "out"
        }
    ]
}
```

Here's the C# script code:

```C#
using System;
using Microsoft.Extensions.Logging;

public static void Run(string input, out string outputMessage, ILogger log)
{
    log.LogInformation(input);
    outputMessage = input;
}
```
### SendGrid output

The following example shows a SendGrid output binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding.

Here's the binding data in the *function.json* file:

```json 
{
    "bindings": [
        {
          "type": "queueTrigger",
          "name": "mymsg",
          "queueName": "myqueue",
          "connection": "AzureWebJobsStorage",
          "direction": "in"
        },
        {
          "type": "sendGrid",
          "name": "$return",
          "direction": "out",
          "apiKey": "SendGridAPIKeyAsAppSetting",
          "from": "{FromEmail}",
          "to": "{ToEmail}"
        }
    ]
}
```

Here's the C# script code:

```csharp
#r "SendGrid"

using System;
using SendGrid.Helpers.Mail;
using Microsoft.Azure.WebJobs.Host;

public static SendGridMessage Run(Message mymsg, ILogger log)
{
    SendGridMessage message = new SendGridMessage()
    {
        Subject = $"{mymsg.Subject}"
    };
    
    message.AddContent("text/plain", $"{mymsg.Content}");

    return message;
}
public class Message
{
    public string ToEmail { get; set; }
    public string FromEmail { get; set; }
    public string Subject { get; set; }
    public string Content { get; set; }
}
```

### SignalR trigger

Here's example binding data in the *function.json* file:

```json
{
    "type": "signalRTrigger",
    "name": "invocation",
    "hubName": "SignalRTest",
    "category": "messages",
    "event": "SendMessage",
    "parameterNames": [
        "message"
    ],
    "direction": "in"
}
```

And, here's the code:

```cs
#r "Microsoft.Azure.WebJobs.Extensions.SignalRService"
using System;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Extensions.Logging;

public static void Run(InvocationContext invocation, string message, ILogger logger)
{
    logger.LogInformation($"Receive {message} from {invocationContext.ConnectionId}.");
}
```

### SignalR input

The following example shows a SignalR connection info input binding in a *function.json* file and a [C# Script function](functions-reference-csharp.md) that uses the binding to return the connection information.

Here's binding data in the *function.json* file:

Example function.json:

```json
{
    "type": "signalRConnectionInfo",
    "name": "connectionInfo",
    "hubName": "chat",
    "connectionStringSetting": "<name of setting containing SignalR Service connection string>",
    "direction": "in"
}
```

Here's the C# Script code:

```cs
#r "Microsoft.Azure.WebJobs.Extensions.SignalRService"
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

public static SignalRConnectionInfo Run(HttpRequest req, SignalRConnectionInfo connectionInfo)
{
    return connectionInfo;
}
```

You can set the `userId` property of the binding to the value from either header using a [binding expression](./functions-bindings-signalr-service-input.md#binding-expressions-for-http-trigger): `{headers.x-ms-client-principal-id}` or `{headers.x-ms-client-principal-name}`.

Example function.json:

```json
{
    "type": "signalRConnectionInfo",
    "name": "connectionInfo",
    "hubName": "chat",
    "userId": "{headers.x-ms-client-principal-id}",
    "connectionStringSetting": "<name of setting containing SignalR Service connection string>",
    "direction": "in"
}
```

Here's the C# Script code:

```cs
#r "Microsoft.Azure.WebJobs.Extensions.SignalRService"
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

public static SignalRConnectionInfo Run(HttpRequest req, SignalRConnectionInfo connectionInfo)
{
    // connectionInfo contains an access key token with a name identifier
    // claim set to the authenticated user
    return connectionInfo;
}
```

### SignalR output

Here's binding data in the *function.json* file:

Example function.json:

```json
{
  "type": "signalR",
  "name": "signalRMessages",
  "hubName": "<hub_name>",
  "connectionStringSetting": "<name of setting containing SignalR Service connection string>",
  "direction": "out"
}
```

Here's the C# Script code:

```cs
#r "Microsoft.Azure.WebJobs.Extensions.SignalRService"
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

public static Task Run(
    object message,
    IAsyncCollector<SignalRMessage> signalRMessages)
{
    return signalRMessages.AddAsync(
        new SignalRMessage
        {
            Target = "newMessage",
            Arguments = new [] { message }
        });
}
```

You can send a message only to connections that have been authenticated to a user by setting the *user ID* in the SignalR message.

Example function.json:

```json
{
  "type": "signalR",
  "name": "signalRMessages",
  "hubName": "<hub_name>",
  "connectionStringSetting": "<name of setting containing SignalR Service connection string>",
  "direction": "out"
}
```

Here's the C# script code:

```cs
#r "Microsoft.Azure.WebJobs.Extensions.SignalRService"
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

public static Task Run(
    object message,
    IAsyncCollector<SignalRMessage> signalRMessages)
{
    return signalRMessages.AddAsync(
        new SignalRMessage
        {
            // the message will only be sent to this user ID
            UserId = "userId1",
            Target = "newMessage",
            Arguments = new [] { message }
        });
}
```

You can send a message only to connections that have been added to a group by setting the *group name* in the SignalR message.

Example function.json:

```json
{
  "type": "signalR",
  "name": "signalRMessages",
  "hubName": "<hub_name>",
  "connectionStringSetting": "<name of setting containing SignalR Service connection string>",
  "direction": "out"
}
```

Here's the C# Script code:

```cs
#r "Microsoft.Azure.WebJobs.Extensions.SignalRService"
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

public static Task Run(
    object message,
    IAsyncCollector<SignalRMessage> signalRMessages)
{
    return signalRMessages.AddAsync(
        new SignalRMessage
        {
            // the message will be sent to the group with this name
            GroupName = "myGroup",
            Target = "newMessage",
            Arguments = new [] { message }
        });
}
```

SignalR Service allows users or connections to be added to groups. Messages can then be sent to a group. You can use the `SignalR` output binding to manage groups.

The following example adds a user to a group.

Example *function.json*

```json
{
    "type": "signalR",
    "name": "signalRGroupActions",
    "connectionStringSetting": "<name of setting containing SignalR Service connection string>",
    "hubName": "chat",
    "direction": "out"
}
```

*Run.csx*

```cs
#r "Microsoft.Azure.WebJobs.Extensions.SignalRService"
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

public static Task Run(
    HttpRequest req,
    ClaimsPrincipal claimsPrincipal,
    IAsyncCollector<SignalRGroupAction> signalRGroupActions)
{
    var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier);
    return signalRGroupActions.AddAsync(
        new SignalRGroupAction
        {
            UserId = userIdClaim.Value,
            GroupName = "myGroup",
            Action = GroupAction.Add
        });
}
```

The following example removes a user from a group.

Example *function.json*

```json
{
    "type": "signalR",
    "name": "signalRGroupActions",
    "connectionStringSetting": "<name of setting containing SignalR Service connection string>",
    "hubName": "chat",
    "direction": "out"
}
```

*Run.csx*

```cs
#r "Microsoft.Azure.WebJobs.Extensions.SignalRService"
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

public static Task Run(
    HttpRequest req,
    ClaimsPrincipal claimsPrincipal,
    IAsyncCollector<SignalRGroupAction> signalRGroupActions)
{
    var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier);
    return signalRGroupActions.AddAsync(
        new SignalRGroupAction
        {
            UserId = userIdClaim.Value,
            GroupName = "myGroup",
            Action = GroupAction.Remove
        });
}
```

### Twilio output

The following example shows a Twilio output binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function uses an `out` parameter to send a text message.

Here's binding data in the *function.json* file:

Example function.json:

```json
{
  "type": "twilioSms",
  "name": "message",
  "accountSidSetting": "TwilioAccountSid",
  "authTokenSetting": "TwilioAuthToken",
  "from": "+1425XXXXXXX",
  "direction": "out",
  "body": "Azure Functions Testing"
}
```

Here's C# script code:

```cs
#r "Newtonsoft.Json"
#r "Twilio"
#r "Microsoft.Azure.WebJobs.Extensions.Twilio"

using System;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.WebJobs.Extensions.Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

public static void Run(string myQueueItem, out CreateMessageOptions message,  ILogger log)
{
    log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");

    // In this example the queue item is a JSON string representing an order that contains the name of a
    // customer and a mobile number to send text updates to.
    dynamic order = JsonConvert.DeserializeObject(myQueueItem);
    string msg = "Hello " + order.name + ", thank you for your order.";

    // You must initialize the CreateMessageOptions variable with the "To" phone number.
    message = new CreateMessageOptions(new PhoneNumber("+1704XXXXXXX"));

    // A dynamic message can be set instead of the body in the output binding. In this example, we use
    // the order information to personalize a text message.
    message.Body = msg;
}
```

You can't use out parameters in asynchronous code. Here's an asynchronous C# script code example:

```cs
#r "Newtonsoft.Json"
#r "Twilio"
#r "Microsoft.Azure.WebJobs.Extensions.Twilio"

using System;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.WebJobs.Extensions.Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

public static async Task Run(string myQueueItem, IAsyncCollector<CreateMessageOptions> message,  ILogger log)
{
    log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");

    // In this example the queue item is a JSON string representing an order that contains the name of a
    // customer and a mobile number to send text updates to.
    dynamic order = JsonConvert.DeserializeObject(myQueueItem);
    string msg = "Hello " + order.name + ", thank you for your order.";

    // You must initialize the CreateMessageOptions variable with the "To" phone number.
    CreateMessageOptions smsText = new CreateMessageOptions(new PhoneNumber("+1704XXXXXXX"));

    // A dynamic message can be set instead of the body in the output binding. In this example, we use
    // the order information to personalize a text message.
    smsText.Body = msg;

    await message.AddAsync(smsText);
}
```

### Warmup trigger

The following example shows a warmup trigger in a *function.json* file and a [C# script function](functions-reference-csharp.md) that runs on each new instance when it's added to your app.

Not supported for version 1.x of the Functions runtime.

Here's the *function.json* file:

```json
{
    "bindings": [
        {
            "type": "warmupTrigger",
            "direction": "in",
            "name": "warmupContext"
        }
    ]
}
```

```cs
public static void Run(WarmupContext warmupContext, ILogger log)
{
    log.LogInformation("Function App instance is warm.");  
}
```


## Next steps

> [!div class="nextstepaction"]
> [Learn more about triggers and bindings](functions-triggers-bindings.md)

> [!div class="nextstepaction"]
> [Learn more about best practices for Azure Functions](functions-best-practices.md)
