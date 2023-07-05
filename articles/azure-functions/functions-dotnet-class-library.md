---
title: Develop C# class library functions using Azure Functions
description: Understand how to use C# to develop and publish code as class libraries that run in-process with the Azure Functions runtime.

ms.topic: conceptual
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-dotnet
ms.date: 10/12/2022
---
# Develop C# class library functions using Azure Functions

<!-- When updating this article, make corresponding changes to any duplicate content in functions-reference-csharp.md -->

This article is an introduction to developing Azure Functions by using C# in .NET class libraries.

>[!IMPORTANT]
>This article supports .NET class library functions that run in-process with the runtime. Your C# functions can also run out-of-process and isolated from the Functions runtime. The isolated worker process model is the only way to run non-LTS versions of .NET and .NET Framework apps in current versions of the Functions runtime. To learn more, see [.NET isolated worker process functions](dotnet-isolated-process-guide.md). 
>For a comprehensive comparison between isolated worker process and in-process .NET Functions, see [Differences between in-process and isolate worker process .NET Azure Functions](dotnet-isolated-in-process-differences.md).

As a C# developer, you may also be interested in one of the following articles:

| Getting started | Concepts| Guided learning/samples |
|--|--|--| 
| <ul><li>[Using Visual Studio](functions-create-your-first-function-visual-studio.md)</li><li>[Using Visual Studio Code](create-first-function-vs-code-csharp.md)</li><li>[Using command line tools](create-first-function-cli-csharp.md)</li></ul> | <ul><li>[Hosting options](functions-scale.md)</li><li>[Performance&nbsp;considerations](functions-best-practices.md)</li><li>[Visual Studio development](functions-develop-vs.md)</li><li>[Dependency injection](functions-dotnet-dependency-injection.md)</li></ul> | <ul><li>[Create serverless applications](/training/paths/create-serverless-applications/)</li><li>[C# samples](/samples/browse/?products=azure-functions&languages=csharp)</li></ul> |

Azure Functions supports C# and C# script programming languages. If you're looking for guidance on [using C# in the Azure portal](functions-create-function-app-portal.md), see [C# script (.csx) developer reference](functions-reference-csharp.md).

[!INCLUDE [functions-dotnet-supported-versions](../../includes/functions-dotnet-supported-versions.md)]

## Functions class library project

In Visual Studio, the **Azure Functions** project template creates a C# class library project that contains the following files:

* [host.json](functions-host-json.md) - stores configuration settings that affect all functions in the project when running locally or in Azure.
* [local.settings.json](functions-develop-local.md#local-settings-file) - stores app settings and connection strings that are used when running locally. This file contains secrets and isn't published to your function app in Azure. Instead, [add app settings to your function app](functions-develop-vs.md#function-app-settings).

When you build the project, a folder structure that looks like the following example is generated in the build output directory:

```
<framework.version>
 | - bin
 | - MyFirstFunction
 | | - function.json
 | - MySecondFunction
 | | - function.json
 | - host.json
```

This directory is what gets deployed to your function app in Azure. The binding extensions required in [version 2.x](functions-versions.md) of the Functions runtime are [added to the project as NuGet packages](./functions-develop-vs.md?tabs=in-process#add-bindings).

> [!IMPORTANT]
> The build process creates a *function.json* file for each function. This *function.json* file is not meant to be edited directly. You can't change binding configuration or disable the function by editing this file. To learn how to disable a function, see [How to disable functions](disable-function.md).


## Methods recognized as functions

In a class library, a function is a method with a `FunctionName` and a trigger attribute, as shown in the following example:

```csharp
public static class SimpleExample
{
    [FunctionName("QueueTrigger")]
    public static void Run(
        [QueueTrigger("myqueue-items")] string myQueueItem, 
        ILogger log)
    {
        log.LogInformation($"C# function processed: {myQueueItem}");
    }
} 
```

The `FunctionName` attribute marks the method as a function entry point. The name must be unique within a project, start with a letter and only contain letters, numbers, `_`, and `-`, up to 127 characters in length. Project templates often create a method named `Run`, but the method name can be any valid C# method name. The above example shows a static method being used, but functions aren't required to be static.

The trigger attribute specifies the trigger type and binds input data to a method parameter. The example function is triggered by a queue message, and the queue message is passed to the method in the `myQueueItem` parameter.

## Method signature parameters

The method signature may contain parameters other than the one used with the trigger attribute. Here are some of the other parameters that you can include:

* [Input and output bindings](functions-triggers-bindings.md) marked as such by decorating them with attributes.  
* An `ILogger` or `TraceWriter` ([version 1.x-only](functions-versions.md#creating-1x-apps)) parameter for [logging](#logging).
* A `CancellationToken` parameter for [graceful shutdown](#cancellation-tokens).
* [Binding expressions](./functions-bindings-expressions-patterns.md) parameters to get trigger metadata.

The order of parameters in the function signature doesn't matter. For example, you can put trigger parameters before or after other bindings, and you can put the logger parameter before or after trigger or binding parameters.

### Output bindings

A function can have zero or multiple output bindings defined by using output parameters. 

The following example modifies the preceding one by adding an output queue binding named `myQueueItemCopy`. The function writes the contents of the message that triggers the function to a new message in a different queue.

```csharp
public static class SimpleExampleWithOutput
{
    [FunctionName("CopyQueueMessage")]
    public static void Run(
        [QueueTrigger("myqueue-items-source")] string myQueueItem, 
        [Queue("myqueue-items-destination")] out string myQueueItemCopy,
        ILogger log)
    {
        log.LogInformation($"CopyQueueMessage function processed: {myQueueItem}");
        myQueueItemCopy = myQueueItem;
    }
}
```

Values assigned to output bindings are written when the function exits. You can use more than one output binding in a function by simply assigning values to multiple output parameters. 

The binding reference articles ([Storage queues](functions-bindings-storage-queue.md), for example) explain which parameter types you can use with trigger, input, or output binding attributes.

### Binding expressions example

The following code gets the name of the queue to monitor from an app setting, and it gets the queue message creation time in the `insertionTime` parameter.

```csharp
public static class BindingExpressionsExample
{
    [FunctionName("LogQueueMessage")]
    public static void Run(
        [QueueTrigger("%queueappsetting%")] string myQueueItem,
        DateTimeOffset insertionTime,
        ILogger log)
    {
        log.LogInformation($"Message content: {myQueueItem}");
        log.LogInformation($"Created at: {insertionTime}");
    }
}
```

## Autogenerated function.json

The build process creates a *function.json* file in a function folder in the build folder. As noted earlier, this file isn't meant to be edited directly. You can't change binding configuration or disable the function by editing this file. 

The purpose of this file is to provide information to the scale controller to use for [scaling decisions on the Consumption plan](event-driven-scaling.md). For this reason, the file only has trigger info, not input/output bindings.

The generated *function.json* file includes a `configurationSource` property that tells the runtime to use .NET attributes for bindings, rather than *function.json* configuration. Here's an example:

```json
{
  "generatedBy": "Microsoft.NET.Sdk.Functions-1.0.0.0",
  "configurationSource": "attributes",
  "bindings": [
    {
      "type": "queueTrigger",
      "queueName": "%input-queue-name%",
      "name": "myQueueItem"
    }
  ],
  "disabled": false,
  "scriptFile": "..\\bin\\FunctionApp1.dll",
  "entryPoint": "FunctionApp1.QueueTrigger.Run"
}
```

## Microsoft.NET.Sdk.Functions

The *function.json* file generation is performed by the NuGet package [Microsoft\.NET\.Sdk\.Functions](https://www.nuget.org/packages/Microsoft.NET.Sdk.Functions). 

The following example shows the relevant parts of the `.csproj` files that have different target frameworks of the same `Sdk` package:

# [v4.x](#tab/v4)

```xml
<PropertyGroup>
  <TargetFramework>net6.0</TargetFramework>
  <AzureFunctionsVersion>v4</AzureFunctionsVersion>
</PropertyGroup>
<ItemGroup>
  <PackageReference Include="Microsoft.NET.Sdk.Functions" Version="4.1.1" />
</ItemGroup>
```

# [v1.x](#tab/v1)

```xml
<PropertyGroup>
  <TargetFramework>net48</TargetFramework>
</PropertyGroup>
<ItemGroup>
  <PackageReference Include="Microsoft.NET.Sdk.Functions" Version="1.0.24" />
</ItemGroup>
```
---


Among the `Sdk` package dependencies are triggers and bindings. A 1.x project refers to 1.x triggers and bindings because those triggers and bindings target the .NET Framework, while 4.x triggers and bindings target .NET Core.

The `Sdk` package also depends on [Newtonsoft.Json](https://www.nuget.org/packages/Newtonsoft.Json), and indirectly on [WindowsAzure.Storage](https://www.nuget.org/packages/WindowsAzure.Storage). These dependencies make sure that your project uses the versions of those packages that work with the Functions runtime version that the project targets. For example, `Newtonsoft.Json` has version 11 for .NET Framework 4.6.1, but the Functions runtime that targets .NET Framework 4.6.1 is only compatible with `Newtonsoft.Json` 9.0.1. So your function code in that project also has to use `Newtonsoft.Json` 9.0.1.

The source code for `Microsoft.NET.Sdk.Functions` is available in the GitHub repo [azure\-functions\-vs\-build\-sdk](https://github.com/Azure/azure-functions-vs-build-sdk).

## Local runtime version

Visual Studio uses the [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools) to run Functions projects on your local computer. The Core Tools is a command-line interface for the Functions runtime.

If you install the Core Tools using the Windows installer (MSI) package or by using npm, it doesn't affect the Core Tools version used by Visual Studio. For the Functions runtime version 1.x, Visual Studio stores Core Tools versions in *%USERPROFILE%\AppData\Local\Azure.Functions.Cli* and uses the latest version stored there. For Functions 4.x, the Core Tools are included in the **Azure Functions and Web Jobs Tools** extension. For Functions 1.x, you can see what version is being used in the console output when you run a Functions project:

```terminal
[3/1/2018 9:59:53 AM] Starting Host (HostId=contoso2-1518597420, Version=2.0.11353.0, ProcessId=22020, Debug=False, Attempt=0, FunctionsExtensionVersion=)
```

## ReadyToRun

You can compile your function app as [ReadyToRun binaries](/dotnet/core/deploying/ready-to-run). ReadyToRun is a form of ahead-of-time compilation that can improve startup performance to help reduce the impact of [cold-start](event-driven-scaling.md#cold-start) when running in a [Consumption plan](consumption-plan.md).

ReadyToRun is available in .NET 6 and later versions and requires [version 4.0 of the Azure Functions runtime](functions-versions.md).

To compile your project as ReadyToRun, update your project file by adding the `<PublishReadyToRun>` and `<RuntimeIdentifier>` elements. The following is the configuration for publishing to a Windows 32-bit function app.

```xml
<PropertyGroup>
  <TargetFramework>net6.0</TargetFramework>
  <AzureFunctionsVersion>v4</AzureFunctionsVersion>
  <PublishReadyToRun>true</PublishReadyToRun>
  <RuntimeIdentifier>win-x86</RuntimeIdentifier>
</PropertyGroup>
```

> [!IMPORTANT]
> Starting in .NET 6, support for Composite ReadyToRun compilation has been added.  Check out [ReadyToRun Cross platform and architecture restrictions](/dotnet/core/deploying/ready-to-run).

You can also build your app with ReadyToRun from the command line. For more information, see the `-p:PublishReadyToRun=true` option in [`dotnet publish`](/dotnet/core/tools/dotnet-publish).

## Supported types for bindings

Each binding has its own supported types; for instance, a blob trigger attribute can be applied to a string parameter, a POCO parameter, a `CloudBlockBlob` parameter, or any of several other supported types. The [binding reference article for blob bindings](functions-bindings-storage-blob-trigger.md#usage) lists all supported parameter types. For more information, see [Triggers and bindings](functions-triggers-bindings.md) and the [binding reference docs for each binding type](functions-triggers-bindings.md#next-steps).

[!INCLUDE [HTTP client best practices](../../includes/functions-http-client-best-practices.md)]

## Binding to method return value

You can use a method return value for an output binding, by applying the attribute to the method return value. For examples, see [Triggers and bindings](./functions-bindings-return-value.md). 

Use the return value only if a successful function execution always results in a return value to pass to the output binding. Otherwise, use `ICollector` or `IAsyncCollector`, as shown in the following section.

## Writing multiple output values

To write multiple values to an output binding, or if a successful function invocation might not result in anything to pass to the output binding, use the [`ICollector`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/ICollector.cs) or [`IAsyncCollector`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/IAsyncCollector.cs) types. These types are write-only collections that are written to the output binding when the method completes.

This example writes multiple queue messages into the same queue using `ICollector`:

```csharp
public static class ICollectorExample
{
    [FunctionName("CopyQueueMessageICollector")]
    public static void Run(
        [QueueTrigger("myqueue-items-source-3")] string myQueueItem,
        [Queue("myqueue-items-destination")] ICollector<string> myDestinationQueue,
        ILogger log)
    {
        log.LogInformation($"C# function processed: {myQueueItem}");
        myDestinationQueue.Add($"Copy 1: {myQueueItem}");
        myDestinationQueue.Add($"Copy 2: {myQueueItem}");
    }
}
```

## Async

To make a function [asynchronous](/dotnet/csharp/programming-guide/concepts/async/), use the `async` keyword and return a `Task` object.

```csharp
public static class AsyncExample
{
    [FunctionName("BlobCopy")]
    public static async Task RunAsync(
        [BlobTrigger("sample-images/{blobName}")] Stream blobInput,
        [Blob("sample-images-copies/{blobName}", FileAccess.Write)] Stream blobOutput,
        CancellationToken token,
        ILogger log)
    {
        log.LogInformation($"BlobCopy function processed.");
        await blobInput.CopyToAsync(blobOutput, 4096, token);
    }
}
```

You can't use `out` parameters in async functions. For output bindings, use the [function return value](#binding-to-method-return-value) or a [collector object](#writing-multiple-output-values) instead.

## Cancellation tokens

A function can accept a [CancellationToken](/dotnet/api/system.threading.cancellationtoken) parameter, which enables the operating system to notify your code when the function is about to be terminated. You can use this notification to make sure the function doesn't terminate unexpectedly in a way that leaves data in an inconsistent state.

Consider the case when you have a function that processes messages in batches. The following Azure Service Bus-triggered function processes an array of [Message](/dotnet/api/microsoft.azure.servicebus.message) objects, which represents a batch of incoming messages to be processed by a specific function invocation:

```csharp
using Microsoft.Azure.ServiceBus;
using System.Threading;

namespace ServiceBusCancellationToken
{
    public static class servicebus
    {
        [FunctionName("servicebus")]
        public static void Run([ServiceBusTrigger("csharpguitar", Connection = "SB_CONN")]
               Message[] messages, CancellationToken cancellationToken, ILogger log)
        {
            try
            { 
                foreach (var message in messages)
                {
                    if (cancellationToken.IsCancellationRequested)
                    {
                        log.LogInformation("A cancellation token was received. Taking precautionary actions.");
                        //Take precautions like noting how far along you are with processing the batch
                        log.LogInformation("Precautionary activities --complete--.");
                        break;
                    }
                    else
                    {
                        //business logic as usual
                        log.LogInformation($"Message: {message} was processed.");
                    }
                }
            }
            catch (Exception ex)
            {
                log.LogInformation($"Something unexpected happened: {ex.Message}");
            }
        }
    }
}
```

## Logging

In your function code, you can write output to logs that appear as traces in Application Insights. The recommended way to write to the logs is to include a parameter of type [ILogger](/dotnet/api/microsoft.extensions.logging.ilogger), which is typically named `log`. Version 1.x of the Functions runtime used `TraceWriter`, which also writes to Application Insights, but doesn't support structured logging. Don't use `Console.Write` to write your logs, since this data isn't captured by Application Insights. 

### ILogger

In your function definition, include an [ILogger](/dotnet/api/microsoft.extensions.logging.ilogger) parameter, which supports [structured logging](https://softwareengineering.stackexchange.com/questions/312197/benefits-of-structured-logging-vs-basic-logging).

With an `ILogger` object, you call `Log<level>` [extension methods on ILogger](/dotnet/api/microsoft.extensions.logging.loggerextensions#methods) to create logs. The following code writes `Information` logs with category `Function.<YOUR_FUNCTION_NAME>.User.`:

```cs
public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, ILogger logger)
{
    logger.LogInformation("Request for item with key={itemKey}.", id);
```

To learn more about how Functions implements `ILogger`, see [Collecting telemetry data](functions-monitoring.md#collecting-telemetry-data). Categories prefixed with `Function` assume you're using an `ILogger` instance. If you choose to instead use an `ILogger<T>`, the category name may instead be based on `T`.  

### Structured logging

The order of placeholders, not their names, determines which parameters are used in the log message. Suppose you have the following code:

```csharp
string partitionKey = "partitionKey";
string rowKey = "rowKey";
logger.LogInformation("partitionKey={partitionKey}, rowKey={rowKey}", partitionKey, rowKey);
```

If you keep the same message string and reverse the order of the parameters, the resulting message text would have the values in the wrong places.

Placeholders are handled this way so that you can do structured logging. Application Insights stores the parameter name-value pairs and the message string. The result is that the message arguments become fields that you can query on.

If your logger method call looks like the previous example, you can query the field `customDimensions.prop__rowKey`. The `prop__` prefix is added to ensure there are no collisions between fields the runtime adds and fields your function code adds.

You can also query on the original message string by referencing the field `customDimensions.prop__{OriginalFormat}`.  

Here's a sample JSON representation of `customDimensions` data:

```json
{
  "customDimensions": {
    "prop__{OriginalFormat}":"C# Queue trigger function processed: {message}",
    "Category":"Function",
    "LogLevel":"Information",
    "prop__message":"c9519cbf-b1e6-4b9b-bf24-cb7d10b1bb89"
  }
}
```

### <a name="log-custom-telemetry-in-c-functions"></a>Log custom telemetry

There's a Functions-specific version of the Application Insights SDK that you can use to send custom telemetry data from your functions to Application Insights: [Microsoft.Azure.WebJobs.Logging.ApplicationInsights](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Logging.ApplicationInsights). Use the following command from the command prompt to install this package:

# [Command](#tab/cmd)

```cmd
dotnet add package Microsoft.Azure.WebJobs.Logging.ApplicationInsights --version <VERSION>
```

# [PowerShell](#tab/powershell)

```powershell
Install-Package Microsoft.Azure.WebJobs.Logging.ApplicationInsights -Version <VERSION>
```

---

In this command, replace `<VERSION>` with a version of this package that supports your installed version of [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs/). 

The following C# examples uses the [custom telemetry API](../azure-monitor/app/api-custom-events-metrics.md). The example is for a .NET class library, but the Application Insights code is the same for C# script.

# [v4.x](#tab/v4)

Version 2.x and later versions of the runtime use newer features in Application Insights to automatically correlate telemetry with the current operation. There's no need to manually set the operation `Id`, `ParentId`, or `Name` fields.

```cs
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using System.Linq;

namespace functionapp0915
{
    public class HttpTrigger2
    {
        private readonly TelemetryClient telemetryClient;

        /// Using dependency injection will guarantee that you use the same configuration for telemetry collected automatically and manually.
        public HttpTrigger2(TelemetryConfiguration telemetryConfiguration)
        {
            this.telemetryClient = new TelemetryClient(telemetryConfiguration);
        }

        [FunctionName("HttpTrigger2")]
        public Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)]
            HttpRequest req, ExecutionContext context, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");
            DateTime start = DateTime.UtcNow;

            // Parse query parameter
            string name = req.Query
                .FirstOrDefault(q => string.Compare(q.Key, "name", true) == 0)
                .Value;

            // Write an event to the customEvents table.
            var evt = new EventTelemetry("Function called");
            evt.Context.User.Id = name;
            this.telemetryClient.TrackEvent(evt);

            // Generate a custom metric, in this case let's use ContentLength.
            this.telemetryClient.GetMetric("contentLength").TrackValue(req.ContentLength);

            // Log a custom dependency in the dependencies table.
            var dependency = new DependencyTelemetry
            {
                Name = "GET api/planets/1/",
                Target = "swapi.co",
                Data = "https://swapi.co/api/planets/1/",
                Timestamp = start,
                Duration = DateTime.UtcNow - start,
                Success = true
            };
            dependency.Context.User.Id = name;
            this.telemetryClient.TrackDependency(dependency);

            return Task.FromResult<IActionResult>(new OkResult());
        }
    }
}
```

In this example, the custom metric data gets aggregated by the host before being sent to the customMetrics table. To learn more, see the [GetMetric](../azure-monitor/app/api-custom-events-metrics.md#getmetric) documentation in Application Insights. 

When running locally, you must add the `APPINSIGHTS_INSTRUMENTATIONKEY` setting, with the Application Insights key, to the [local.settings.json](functions-develop-local.md#local-settings-file) file.


# [v1.x](#tab/v1)

```cs
using System;
using System.Net;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Azure.WebJobs;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace functionapp0915
{
    public static class HttpTrigger2
    {
        private static string key = TelemetryConfiguration.Active.InstrumentationKey = 
            System.Environment.GetEnvironmentVariable(
                "APPINSIGHTS_INSTRUMENTATIONKEY", EnvironmentVariableTarget.Process);

        private static TelemetryClient telemetryClient = 
            new TelemetryClient() { InstrumentationKey = key };

        [FunctionName("HttpTrigger2")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]
            HttpRequestMessage req, ExecutionContext context, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");
            DateTime start = DateTime.UtcNow;

            // Parse query parameter
            string name = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "name", true) == 0)
                .Value;

            // Get request body
            dynamic data = await req.Content.ReadAsAsync<object>();

            // Set name to query string or body data
            name = name ?? data?.name;
         
            // Track an Event
            var evt = new EventTelemetry("Function called");
            UpdateTelemetryContext(evt.Context, context, name);
            telemetryClient.TrackEvent(evt);
            
            // Track a Metric
            var metric = new MetricTelemetry("Test Metric", DateTime.Now.Millisecond);
            UpdateTelemetryContext(metric.Context, context, name);
            telemetryClient.TrackMetric(metric);
            
            // Track a Dependency
            var dependency = new DependencyTelemetry
            {
                Name = "GET api/planets/1/",
                Target = "swapi.co",
                Data = "https://swapi.co/api/planets/1/",
                Timestamp = start,
                Duration = DateTime.UtcNow - start,
                Success = true
            };
            UpdateTelemetryContext(dependency.Context, context, name);
            telemetryClient.TrackDependency(dependency);
        }
        
        // Correlate all telemetry with the current Function invocation
        private static void UpdateTelemetryContext(TelemetryContext context, ExecutionContext functionContext, string userName)
        {
            context.Operation.Id = functionContext.InvocationId.ToString();
            context.Operation.ParentId = functionContext.InvocationId.ToString();
            context.Operation.Name = functionContext.FunctionName;
            context.User.Id = userName;
        }
    }    
}
```
---

Don't call `TrackRequest` or `StartOperation<RequestTelemetry>` because you'll see duplicate requests for a function invocation.  The Functions runtime automatically tracks requests.

Don't set `telemetryClient.Context.Operation.Id`. This global setting causes incorrect correlation when many functions are running simultaneously. Instead, create a new telemetry instance (`DependencyTelemetry`, `EventTelemetry`) and modify its `Context` property. Then pass in the telemetry instance to the corresponding `Track` method on `TelemetryClient` (`TrackDependency()`, `TrackEvent()`, `TrackMetric()`). This method ensures that the telemetry has the correct correlation details for the current function invocation.

## Testing functions

The following articles show how to run an in-process C# class library function locally for testing purposes:

+ [Visual Studio](functions-develop-vs.md#testing-functions)
+ [Visual Studio Code](functions-develop-vs-code.md?tabs=csharp#debugging-functions-locally)
+ [Command line](functions-run-local.md?tabs=v4%2Ccsharp%2Cazurecli%2Cbash#start)

## Environment variables

To get an environment variable or an app setting value, use `System.Environment.GetEnvironmentVariable`, as shown in the following code example:

```csharp
public static class EnvironmentVariablesExample
{
    [FunctionName("GetEnvironmentVariables")]
    public static void Run([TimerTrigger("0 */5 * * * *")]TimerInfo myTimer, ILogger log)
    {
        log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
        log.LogInformation(GetEnvironmentVariable("AzureWebJobsStorage"));
        log.LogInformation(GetEnvironmentVariable("WEBSITE_SITE_NAME"));
    }

    private static string GetEnvironmentVariable(string name)
    {
        return name + ": " +
            System.Environment.GetEnvironmentVariable(name, EnvironmentVariableTarget.Process);
    }
}
```

App settings can be read from environment variables both when developing locally and when running in Azure. When developing locally, app settings come from the `Values` collection in the *local.settings.json* file. In both environments, local and Azure, `GetEnvironmentVariable("<app setting name>")` retrieves the value of the named app setting. For instance, when you're running locally, "My Site Name" would be returned if your *local.settings.json* file contains `{ "Values": { "WEBSITE_SITE_NAME": "My Site Name" } }`.

The [System.Configuration.ConfigurationManager.AppSettings](/dotnet/api/system.configuration.configurationmanager.appsettings) property is an alternative API for getting app setting values, but we recommend that you use `GetEnvironmentVariable` as shown here.

## Binding at runtime

In C# and other .NET languages, you can use an [imperative](https://en.wikipedia.org/wiki/Imperative_programming) binding pattern, as opposed to the [*declarative*](https://en.wikipedia.org/wiki/Declarative_programming) bindings in attributes. Imperative binding is useful when binding parameters need to be computed at runtime rather than design time. With this pattern, you can bind to supported input and output bindings on-the-fly in your function code.

Define an imperative binding as follows:

- **Do not** include an attribute in the function signature for your desired imperative bindings.
- Pass in an input parameter [`Binder binder`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.Host/Bindings/Runtime/Binder.cs)
  or [`IBinder binder`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/IBinder.cs).
- Use the following C# pattern to perform the data binding.

  ```cs
  using (var output = await binder.BindAsync<T>(new BindingTypeAttribute(...)))
  {
      ...
  }
  ```

  `BindingTypeAttribute` is the .NET attribute that defines your binding, and `T` is an input or output type that's supported by that binding type. `T` can't be an `out` parameter type (such as `out JObject`). For example, the Mobile Apps table output binding supports [six output types](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.MobileApps/MobileTableAttribute.cs#L17-L22), but you can only use [ICollector\<T>](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/ICollector.cs) or [IAsyncCollector\<T>](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/IAsyncCollector.cs) with imperative binding.

### Single attribute example

The following example code creates a [Storage blob output binding](functions-bindings-storage-blob-output.md)
with blob path that's defined at run time, then writes a string to the blob.

```cs
public static class IBinderExample
{
    [FunctionName("CreateBlobUsingBinder")]
    public static void Run(
        [QueueTrigger("myqueue-items-source-4")] string myQueueItem,
        IBinder binder,
        ILogger log)
    {
        log.LogInformation($"CreateBlobUsingBinder function processed: {myQueueItem}");
        using (var writer = binder.Bind<TextWriter>(new BlobAttribute(
                    $"samples-output/{myQueueItem}", FileAccess.Write)))
        {
            writer.Write("Hello World!");
        };
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
public static class IBinderExampleMultipleAttributes
{
    [FunctionName("CreateBlobInDifferentStorageAccount")]
    public async static Task RunAsync(
            [QueueTrigger("myqueue-items-source-binder2")] string myQueueItem,
            Binder binder,
            ILogger log)
    {
        log.LogInformation($"CreateBlobInDifferentStorageAccount function processed: {myQueueItem}");
        var attributes = new Attribute[]
        {
        new BlobAttribute($"samples-output/{myQueueItem}", FileAccess.Write),
        new StorageAccountAttribute("MyStorageAccount")
        };
        using (var writer = await binder.BindAsync<TextWriter>(attributes))
        {
            await writer.WriteAsync("Hello World!!");
        }
    }
}
```

## Triggers and bindings 

[!INCLUDE [Supported triggers and bindings](../../includes/functions-bindings.md)]

## Next steps

> [!div class="nextstepaction"]
> [Learn more about triggers and bindings](functions-triggers-bindings.md)

> [!div class="nextstepaction"]
> [Learn more about best practices for Azure Functions](functions-best-practices.md)
