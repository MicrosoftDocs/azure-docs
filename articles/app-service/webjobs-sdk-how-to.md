---
title: How to use the Azure WebJobs SDK
description: Learn more about how to write code for the WebJobs SDK. Create  event-driven background processing jobs that access data in Azure services and third-party services.
services: app-service\web, storage
documentationcenter: .net
author: ggailey777
manager: cfowler
editor: 

ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 04/27/2018
ms.author: glenga
---

# How to use the Azure WebJobs SDK for event-driven background processing

This article provides guidance on how to write code for [the Azure WebJobs SDK](webjobs-sdk-get-started.md). The documentation applies to versions 2.x and 3.x except where noted otherwise. The main change introduced by 3.x is the use of .NET Core instead of .NET Framework.

>[!NOTE]
> [Azure Functions](../azure-functions/functions-overview.md) is built on the WebJobs SDK, and this article links to Azure Functions documentation for some topics. Note the following differences between Functions and the WebJobs SDK:
> * Azure Functions version 1.x corresponds to WebJobs SDK version 2.x, and Azure Functions 2.x corresponds to WebJobs SDK 3.x. Source code repositories follow the WebJobs SDK numbering, and many have v2.x branches, with the master branch currently having 3.x code.
> * Sample code for Azure Functions C# class libraries is like WebJobs SDK code except you don't need a `FunctionName` attribute in a WebJobs SDK project.
> * Some binding types are only supported in Functions, such as HTTP, webhook, and Event Grid (which is based on HTTP). 
> 
> For more information, see [Compare the WebJobs SDK and Azure Functions](../azure-functions/functions-compare-logic-apps-ms-flow-webjobs.md#compare-functions-and-webjobs). 

## Prerequisites

This article assumes you have read [Get started with the WebJobs SDK](webjobs-sdk-get-started.md).

## JobHost

The `JobHost` object is the runtime container for functions: it listens for triggers and calls functions. You create the `JobHost` in your code and write code to customize its behavior.

This is a key difference between using the WebJobs SDK directly and using it indirectly by using Azure Functions. In Azure Functions, the service controls the `JobHost`, and you can't customize it by writing code. Azure Functions lets you customize host behavior through settings in the *host.json* file. Those settings are strings, not code, which limits the kinds of customizations you can do.

### JobHost connection strings

The WebJobs SDK looks for Storage and Service Bus connection strings in  *local.settings.json* when you run locally, or in the WebJob's environment when you run in Azure. If you want to use your own names for these connection strings, or store them elsewhere, you can set them in code, as shown here:

```cs
static void Main(string[] args)
{
    var _storageConn = ConfigurationManager
        .ConnectionStrings["MyStorageConnection"].ConnectionString;

    var _dashboardConn = ConfigurationManager
        .ConnectionStrings["MyDashboardConnection"].ConnectionString;

    JobHostConfiguration config = new JobHostConfiguration();
    config.StorageConnectionString = _storageConn;
    config.DashboardConnectionString = _dashboardConn;
    JobHost host = new JobHost(config);
    host.RunAndBlock();
}
```

### JobHost development settings

The `JobHostConfiguration` class has a `UseDevelopmentSettings` method that you can call to make local development more efficient. Here are some of the settings that this method changes:

| Property | Development setting |
| ------------- | ------------- |
| `Tracing.ConsoleLevel` | `TraceLevel.Verbose` to maximize log output. |
| `Queues.MaxPollingInterval`  | A low value to ensure queue methods are triggered immediately.  |
| `Singleton.ListenerLockPeriod` | 15 seconds to aid in rapid iterative development. |

The following example shows how to use development settings. To make `config.IsDevelopment` return `true` when running locally, set a local environment variable named `AzureWebJobsEnv` with value `Development`.

```cs
static void Main()
{
    config = new JobHostConfiguration();

    if (config.IsDevelopment)
    {
        config.UseDevelopmentSettings();
    }

    var host = new JobHost(config);
    host.RunAndBlock();
}
```

### JobHost ServicePointManager settings

The .NET Framework contains an API called [ServicePointManager.DefaultConnectionLimit](https://msdn.microsoft.com/library/system.net.servicepointmanager.defaultconnectionlimit) that controls the number of concurrent connections to a host. We recommend that you increase this value from the default of 2 before starting your WebJobs host.

All outgoing HTTP requests that you make from a function by using `HttpClient` flow through the `ServicePointManager`. Once you hit the `DefaultConnectionLimit`, the `ServicePointManager` starts queueing requests before sending them. Suppose your `DefaultConnectionLimit` is set to 2 and your code makes 1,000 HTTP requests. Initially, only 2 requests are actually allowed through to the OS. The other 998 are queued until there’s room for them. That means your `HttpClient` may time out, because it *thinks* it’s made the request, but the request was never sent by the OS to the destination server. So you might see behavior that doesn't seem to make sense: your local `HttpClient` is taking 10 seconds to complete a request, but your service is returning every request in 200 ms. 

The default value for ASP.NET applications is `Int32.MaxValue`, and that's likely to work well for WebJobs running in a Basic or higher App Service plan. WebJobs typically need the Always On setting, and that's supported only by Basic and higher App Service plans. 

If your WebJob is running in a Free or Shared App Service Plan, your application is restricted by the App Service sandbox, which currently has a [connection limit of 300](https://github.com/projectkudu/kudu/wiki/Azure-Web-App-sandbox#per-sandbox-per-appper-site-numerical-limits). With an unbound connection limit in `ServicePointManager`, it's more likely that the sandbox connection threshold will be reached and the site shut down. In that case, setting `DefaultConnectionLimit` to something lower, like 50 or 100, can prevent this from happening and still allow for sufficient throughput.

The setting must be configured before any HTTP requests are made. For this reason, the WebJobs host shouldn't try to adjust the setting automatically; there may be HTTP requests that occur before the host starts and this can lead to unexpected behavior. The best approach is to set the value immediately in your `Main` method before initializing the `JobHost`, as shown in the following example

```csharp
static void Main(string[] args)
{
    // Set this immediately so that it is used by all requests.
    ServicePointManager.DefaultConnectionLimit = Int32.MaxValue;

    var host = new JobHost();
    host.RunAndBlock();
}
```

## Triggers

Functions must be public methods and must have one trigger attribute or the [NoAutomaticTrigger](#manual-trigger) attribute.

### Automatic trigger

Automatic triggers call a function in response to an event. For an example, see the queue trigger in the [Get started article](webjobs-sdk-get-started.md).

### Manual trigger

To trigger a function manually, use the `NoAutomaticTrigger` attribute, as shown in the following example:

```cs
static void Main(string[] args)
{
    JobHost host = new JobHost();
    host.Call(typeof(Program).GetMethod("CreateQueueMessage"), new { value = "Hello world!" });
}
```

```cs
[NoAutomaticTrigger]
public static void CreateQueueMessage(
    TextWriter logger,
    string value,
    [Queue("outputqueue")] out string message)
{
    message = value;
    logger.WriteLine("Creating queue message: ", message);
}
```

## Input and output bindings

Input bindings provide a declarative way to make data from Azure or third-party services available to your code. Output bindings provide a way to update data. The [Get started article](webjobs-sdk-get-started.md) shows an example of each.

You can use a method return value for an output binding, by applying the attribute to the method return value. See the example in the Azure Functions [Triggers and bindings](../azure-functions/functions-triggers-bindings.md#using-the-function-return-value) article.

## Binding types

The following trigger and binding types are included in the `Microsoft.Azure.WebJobs` package:

* Blob storage
* Queue storage
* Table storage

To use other trigger and binding types, install the NuGet package that contains them and call a `Use<binding>` method on the `JobHostConfiguration` object. For example, if you want to use a Timer trigger, install `Microsoft.Azure.WebJobs.Extensions` and call `UseTimers` in the `Main` method, as in this example:

```cs
static void Main()
{
    config = new JobHostConfiguration();
    config.UseTimers();
    var host = new JobHost(config);
    host.RunAndBlock();
}
```

You can find the package to install for a particular binding type in the **Packages** section of that binding type's [reference article](#binding-reference-information) for Azure Functions. An exception is the Files trigger and binding (for the local file system), which is not supported by Azure Functions. to use the Files binding, install `Microsoft.Azure.WebJobs.Extensions` and call `UseFiles`.

### UseCore

The `Microsoft.Azure.WebJobs.Extensions` package mentioned earlier also provides a special binding type that you can register by calling the `UseCore` method. This binding lets you define an [ExecutionContext](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions/Extensions/Core/ExecutionContext.cs) parameter in your function signature. The context object gives you access to the invocation ID, which you can use to correlate all logs produced by a given function invocation. Here's an example:

```cs
class Program
{
    static void Main()
    {
        config = new JobHostConfiguration();
        config.UseCore();
        var host = new JobHost(config);
        host.RunAndBlock();
    }
}
public class Functions
{
    public static void ProcessQueueMessage([QueueTrigger("queue")] string message,
        ExecutionContext executionContext,
        ILogger logger)
    {
        logger.LogInformation($"{message}\n{executionContext.InvocationId}");
    }
}
```

## Binding configuration

Many trigger and binding types let you configure their behavior by setting properties in a configuration object that you pass in to the `JobHost`.

### Queue trigger configuration

The settings you can configure for the Storage queue trigger are explained in the Azure Functions [host.json reference](../azure-functions/functions-host-json.md#queues). How to set them in a WebJobs SDK project is shown in the following example:

```cs
static void Main(string[] args)
{
    JobHostConfiguration config = new JobHostConfiguration();
    config.Queues.BatchSize = 8;
    config.Queues.NewBatchThreshold = 4;
    config.Queues.MaxDequeueCount = 4;
    config.Queues.MaxPollingInterval = TimeSpan.FromSeconds(15);
    JobHost host = new JobHost(config);
    host.RunAndBlock();
}
```

### Configuration for other bindings

Some trigger and binding types define their own custom configuration type. For example, the File trigger lets you specify the root path to monitor:

```cs
static void Main()
{
    config = new JobHostConfiguration();
    var filesConfig = new FilesConfiguration
    {
        RootPath = @"c:\data\import"
    };
    config.UseFiles(filesConfig);
    var host = new JobHost(config);
    host.RunAndBlock();
}
```

## Binding expressions

In attribute constructor parameters, you can use expressions that resolve to values from various sources. For example, in the following code, the path for the `BlobTrigger` attribute creates an expression named `filename`. When used for the output binding, `filename` resolves to the name of the triggering blob.
 
```cs
public static void CreateThumbnail(
    [BlobTrigger("sample-images/{filename}")] Stream image,
    [Blob("sample-images-sm/{filename}", FileAccess.Write)] Stream imageSmall,
    string filename,
    ILogger logger)
{
    logger.Info($"Blob trigger processing: {filename}");
    // ...
}
```

For more information about binding expressions, see [Binding expressions and patterns](../azure-functions/functions-triggers-bindings.md#binding-expressions-and-patterns) in the Azure Functions documentation.

### Custom binding expressions

Sometimes you want to specify a queue name, a blob name or container, or a table name in code rather than hard-code it. For example, you might want to specify the queue name for the `QueueTrigger` attribute in a configuration file or environment variable.

You can do that by passing in a `NameResolver` object to the `JobHostConfiguration` object. You include placeholders in trigger or binding attribute constructor parameters, and your `NameResolver` code provides the actual values to be used in place of those placeholders. The placeholders are identified by surrounding them with percent (%) signs, as shown in the following example:
 
```cs
public static void WriteLog([QueueTrigger("%logqueue%")] string logMessage)
{
    Console.WriteLine(logMessage);
}
```

This code lets you use a queue named logqueuetest in the test environment and one named logqueueprod in production. Instead of a hard-coded queue name, you specify the name of an entry in the `appSettings` collection. 

There is a default NameResolver that takes effect if you don't provide a custom one. The default gets values from app settings or environment variables.

Your `NameResolver` class gets the queue name from `appSettings` as shown in the following example:

```cs
public class CustomNameResolver : INameResolver
{
    public string Resolve(string name)
    {
        return ConfigurationManager.AppSettings[name].ToString();
    }
}
```

Pass your `NameResolver` class in to the `JobHost` object as shown in the following example:

```cs
 static void Main(string[] args)
{
    JobHostConfiguration config = new JobHostConfiguration();
    config.NameResolver = new CustomNameResolver();
    JobHost host = new JobHost(config);
    host.RunAndBlock();
}
```

Azure Functions implements `INameResolver` to get values from app settings, as shown in the example. When you use the WebJobs SDK directly, you can write a custom implementation that gets placeholder replacement values from whatever source you prefer. 

## Binding at runtime

If you need to do some work in your function before using a binding attribute such as `Queue`, `Blob`, or `Table`, you can use the `IBinder` interface.

The following example takes an input queue message and creates a new message with the same content in an output queue. The output queue name is set by code in the body of the function.

```cs
public static void CreateQueueMessage(
    [QueueTrigger("inputqueue")] string queueMessage,
    IBinder binder)
{
    string outputQueueName = "outputqueue" + DateTime.Now.Month.ToString();
    QueueAttribute queueAttribute = new QueueAttribute(outputQueueName);
    CloudQueue outputQueue = binder.Bind<CloudQueue>(queueAttribute);
    outputQueue.AddMessage(new CloudQueueMessage(queueMessage));
}
```

For more information, see [Binding at runtime](../azure-functions/functions-dotnet-class-library.md#binding-at-runtime) in the Azure Functions documentation.

## Binding reference information

Reference information about each binding type is provided in the Azure Functions documentation. Using Storage queue as an example, you'll find the following information in each binding reference article:

* [Packages](../azure-functions/functions-bindings-storage-queue.md#packages---functions-1x) - What package to install in order to include support for the binding in a WebJobs SDK project.
* [Examples](../azure-functions/functions-bindings-storage-queue.md#trigger---example) - The C# class library example applies to the WebJobs SDK; just omit the `FunctionName` attribute.
* [Attributes](../azure-functions/functions-bindings-storage-queue.md#trigger---attributes) - The attributes to use for the binding type.
* [Configuration](../azure-functions/functions-bindings-storage-queue.md#trigger---configuration) - Explanations of the attribute properties and constructor parameters.
* [Usage](../azure-functions/functions-bindings-storage-queue.md#trigger---usage) - What types you can bind to and information about how the binding works. For example: polling algorithm, poison queue processing.
  
For a list of binding reference articles, see **Supported bindings** in the [Triggers and bindings](../azure-functions/functions-triggers-bindings.md#supported-bindings) article for Azure Functions. In that list, the HTTP, webhook, and Event Grid bindings are supported only by Azure Functions, not by the WebJobs SDK.

## Disable attribute 

The [Disable](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/DisableAttribute.cs) attribute lets you control whether a function can be triggered. 

In the following example, if the app setting `Disable_TestJob` has a value of "1" or "True" (case insensitive), the function will not run. In that case, the runtime creates a log message *Function 'Functions.TestJob' is disabled*.

```cs
[Disable("Disable_TestJob")]
public static void TestJob([QueueTrigger("testqueue2")] string message)
{
    Console.WriteLine("Function with Disable attribute executed!");
}
```

When you change app setting values in the Azure portal, it causes the WebJob to be restarted, picking up the new setting.

The attribute can be declared at the parameter, method, or class level. The setting name can also contain binding expressions.

## Timeout attribute

The [Timeout](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/TimeoutAttribute.cs) attribute causes a function to be canceled if it doesn't complete within a specified amount of time. In the following example, the function would run for one day without the timeout. With the timeout, the function is canceled after 15 seconds.

```cs
[Timeout("00:00:15")]
public static async Task TimeoutJob(
    [QueueTrigger("testqueue2")] string message,
    CancellationToken token,
    TextWriter log)
{
    await log.WriteLineAsync("Job starting");
    await Task.Delay(TimeSpan.FromDays(1), token);
    await log.WriteLineAsync("Job completed");
}
```

You can apply the Timeout attribute at class or method level, and you can specify a global timeout by using `JobHostConfiguration.FunctionTimeout`. Class or method level timeouts override the global timeout.

## Singleton attribute

Use the [Singleton](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/SingletonAttribute.cs) attribute to ensure that only one instance of a function runs even when there are multiple instances of the host web app. It does this by implementing [distributed locking](#viewing-lease-blobs).

In the following example, only a single instance of the `ProcessImage` function runs at any given time:

```cs
[Singleton]
public static async Task ProcessImage([BlobTrigger("images")] Stream image)
{
     // Process the image
}
```

### SingletonMode.Listener

Some triggers have built-in support for concurrency management:

* **QueueTrigger** - Set `JobHostConfiguration.Queues.BatchSize` to 1.
* **ServiceBusTrigger** - Set `ServiceBusConfiguration.MessageOptions.MaxConcurrentCalls` to 1.
* **FileTrigger** - Set `FileProcessor.MaxDegreeOfParallelism` to 1.

You can use these settings to ensure that your function runs as a singleton on a single instance. To ensure only a single instance of the function is running when the web app scales out to multiple instances, apply a listener level Singleton lock on the function (`[Singleton(Mode = SingletonMode.Listener)]`). Listener locks are acquired on startup of the JobHost. If three scaled-out instances all start at the same time, only one of the instances acquires the lock and only one listener starts.

### Scope Values

You can specify a **scope expression/value** on the Singleton which will ensure that all executions of the function at that scope will be serialized. Implementing more granular locking in this way can allow for some level of parallelism for your function, while serializing other invocations as dictated by your requirements. For example, in the following example the scope expression binds to the `Region` value of the incoming message. If the queue contains 3 messages in Regions "East", "East", and "West" respectively, then the messages that have region "East" will be executed serially while the message with region "West" will be executed in parallel with those.

```csharp
[Singleton("{Region}")]
public static async Task ProcessWorkItem([QueueTrigger("workitems")] WorkItem workItem)
{
     // Process the work item
}

public class WorkItem
{
     public int ID { get; set; }
     public string Region { get; set; }
     public int Category { get; set; }
     public string Description { get; set; }
}
```

### SingletonScope.Host

The default scope for a lock is `SingletonScope.Function` meaning the lock scope (the blob lease path) is tied to the fully qualified function name. To lock across functions, specify `SingletonScope.Host` and use a scope ID name that is the same across all of the functions that you don't want to run simultaneously. In the following example, only one instance of `AddItem` or `RemoveItem` runs at a time:

```charp
[Singleton("ItemsLock", SingletonScope.Host)]
public static void AddItem([QueueTrigger("add-item")] string message)
{
     // Perform the add operation
}

[Singleton("ItemsLock", SingletonScope.Host)]
public static void RemoveItem([QueueTrigger("remove-item")] string message)
{
     // Perform the remove operation
}
```

### Viewing lease blobs

The WebJobs SDK uses [Azure blob leases](../storage/common/storage-concurrency.md#pessimistic-concurrency-for-blobs) under the covers to implement distributed locking. The lease blobs used by Singleton can be found in the `azure-webjobs-host` container in the `AzureWebJobsStorage` storage account under path "locks". For example, the lease blob path for the first `ProcessImage` example shown earlier might be `locks/061851c758f04938a4426aa9ab3869c0/WebJobs.Functions.ProcessImage`. All paths include the JobHost ID, in this case 061851c758f04938a4426aa9ab3869c0.

## Async functions

For information about how to code async functions, see the Azure Functions documentation on [Async Functions](../azure-functions/functions-dotnet-class-library.md#async).

## Cancellation tokens

For information about how to handle cancellation tokens, see the Azure Functions documentation on [cancellation tokens and graceful shutdown](../azure-functions/functions-dotnet-class-library.md#cancellation-tokens).

## Multiple instances

If your web app runs on multiple instances, a continuous WebJob runs on each instance, listening for triggers and calling functions. The various trigger bindings are designed to efficiently share work collaboratively across instances, so that scaling out to more instances allows you to handle more load.

The queue and blob triggers automatically prevent a function from processing a queue message or blob more than once; functions do not have to be idempotent.

The timer trigger automatically ensures that only one instance of the timer runs, so you don't get more than one function instance running at a given scheduled time.

If you want to ensure that only one instance of a function runs even when there are multiple instances of the host web app, you can use the [Singleton](#singleton) attribute.
	
## Filters 

Function Filters (preview) provide a way to customize the WebJobs execution pipeline with your own logic. Filters are similar to [ASP.NET Core Filters](https://docs.microsoft.com/aspnet/core/mvc/controllers/filters). They can be implemented as declarative attributes that are applied to your functions or classes. For more information, see [Function Filters](https://github.com/Azure/azure-webjobs-sdk/wiki/Function-Filters).

## Logging and monitoring

We recommend the logging framework that was developed for ASP.NET, and the [Get started](webjobs-sdk-get-started.md) article shows how to use it. 

### Log filtering

Every log created by an `ILogger` instance has an associated `Category` and `Level`. [LogLevel](https://docs.microsoft.com/aspnet/core/api/microsoft.extensions.logging.loglevel#Microsoft_Extensions_Logging_LogLevel) is an enumeration, and the integer code indicates relative importance:

|LogLevel    |Code|
|------------|---|
|Trace       | 0 |
|Debug       | 1 |
|Information | 2 |
|Warning     | 3 |
|Error       | 4 |
|Critical    | 5 |
|None        | 6 |

Each category can be independently filtered to a particular [LogLevel](https://docs.microsoft.com/aspnet/core/api/microsoft.extensions.logging.loglevel). For example, you might want to see all logs for blob trigger processing but only `Error` and higher for everything else.

To make it easier to specify filtering rules, the WebJobs SDK provides the `LogCategoryFilter` that can be passed into many of the existing logging providers, including Application Insights and Console.

The `LogCategoryFilter` has a `Default` property with an initial value of `Information`, meaning that any messages with levels of `Information`, `Warning`, `Error`, or `Critical` are logged, but any messages with levels of `Debug` or `Trace` are filtered away.

The `CategoryLevels` property allows you to specify log levels for specific categories so you can fine-tune the logging output. If no match is found within the `CategoryLevels` dictionary, the filter falls back to the `Default` value when deciding whether to filter the message.

The following example constructs a filter that by default filters all logs at the `Warning` level. Categories of `Function` or `Host.Results` are filtered at the `Error` level. The `LogCategoryFilter` compares the current category to all registered `CategoryLevels` and chooses the longest match. This means that the `Debug` level registered for `Host.Triggers` will match `Host.Triggers.Queue` or `Host.Triggers.Blob`. This allows you to control broader categories without needing to add each one.

```csharp
var filter = new LogCategoryFilter();
filter.DefaultLevel = LogLevel.Warning;
filter.CategoryLevels[LogCategories.Function] = LogLevel.Error;
filter.CategoryLevels[LogCategories.Results] = LogLevel.Error;
filter.CategoryLevels["Host.Triggers"] = LogLevel.Debug;

config.LoggerFactory = new LoggerFactory()
    .AddApplicationInsights(instrumentationKey, filter.Filter)
    .AddConsole(filter.Filter);
```

### Custom telemetry for Application Insights

Internally, the `TelemetryClient` created by the Application Insights provider for the WebJobs SDK uses the [ServerTelemetryChannel](https://github.com/Microsoft/ApplicationInsights-dotnet/blob/develop/src/ServerTelemetryChannel/ServerTelemetryChannel.cs). When the Application Insights endpoint is unavailable or throttling incoming requests, this channel [saves requests in the web app's file system and resubmits them later](http://apmtips.com/blog/2015/09/03/more-telemetry-channels).

The `TelemetryClient` is created by a class that implements `ITelemetryClientFactory`. By default, this is the [DefaultTelemetryClientFactory](https://github.com/Azure/azure-webjobs-sdk/blob/dev/src/Microsoft.Azure.WebJobs.Logging.ApplicationInsights/DefaultTelemetryClientFactory.cs).

If you want to modify any part of the Application Insights pipeline, you can supply your own `ITelemetryClientFactory`, and the host will use your class to construct a `TelemetryClient`. For example, this code overrides the `DefaultTelemetryClientFactory` to modify a property of the `ServerTelemetryChannel`:

```csharp
private class CustomTelemetryClientFactory : DefaultTelemetryClientFactory
{
    public CustomTelemetryClientFactory(string instrumentationKey, Func<string, LogLevel, bool> filter)
        : base(instrumentationKey, new SamplingPercentageEstimatorSettings(), filter)
    {
    }

    protected override ITelemetryChannel CreateTelemetryChannel()
    {
        ServerTelemetryChannel channel = new ServerTelemetryChannel();

        // change the default from 30 seconds to 15 seconds
        channel.MaxTelemetryBufferDelay = TimeSpan.FromSeconds(15);

        return channel;
    }
}
```

The SamplingPercentageEstimatorSettings object configures [adaptive sampling](https://docs.microsoft.com/azure/application-insights/app-insights-sampling#adaptive-sampling-at-your-web-server). This means that in certain high-volume scenarios, App Insights sends a selected subset of telemetry data to the server.

Once you've created the telemetry factory, you pass it in to the Application Insights logging provider:

```csharp
var clientFactory = new CustomTelemetryClientFactory(instrumentationKey, filter.Filter);

config.LoggerFactory = new LoggerFactory()
    .AddApplicationInsights(clientFactory);
```

## <a id="nextsteps"></a> Next steps

This guide has provided code snippets that demonstrate how to handle common scenarios for working with the WebJobs SDK. For complete samples, see [azure-webjobs-sdk-samples](https://github.com/Azure/azure-webjobs-sdk-samples).