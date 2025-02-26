---
title: Guide for running C# Azure Functions in an isolated worker process
description: Learn how to use the .NET isolated worker model to run your C# functions in Azure, which lets you run your functions on currently supported versions of .NET and .NET Framework.
ms.service: azure-functions
ms.topic: conceptual
ms.date: 09/05/2024
ms.custom:
  - template-concept
  - devx-track-dotnet
  - devx-track-azurecli
  - ignite-2023
recommendations: false
#Customer intent: As a developer, I need to know how to create functions that run in an isolated worker process so that I can run my function code on current (not LTS) releases of .NET.
---

# Guide for running C# Azure Functions in the isolated worker model

This article is an introduction to working with Azure Functions in .NET, using the isolated worker model. This model allows your project to target versions of .NET independently of other runtime components. For information about specific .NET versions supported, see [supported version](#supported-versions). 

Use the following links to get started right away building .NET isolated worker model functions.

| Getting started | Concepts| Samples |
|--|--|--| 
| <ul><li>[Using Visual Studio Code](create-first-function-vs-code-csharp.md?tabs=isolated-process)</li><li>[Using command line tools](create-first-function-cli-csharp.md?tabs=isolated-process)</li><li>[Using Visual Studio](functions-create-your-first-function-visual-studio.md?tabs=isolated-process)</li></ul> | <ul><li>[Hosting options](functions-scale.md)</li><li>[Monitoring](functions-monitoring.md)</li> | <ul><li>[Reference samples](https://github.com/Azure/azure-functions-dotnet-worker/tree/main/samples)</li></ul> |

To learn just about deploying an isolated worker model project to Azure, see [Deploy to Azure Functions](#deploy-to-azure-functions). 

## Benefits of the isolated worker model

There are two modes in which you can run your .NET class library functions: either [in the same process](functions-dotnet-class-library.md) as the Functions host runtime (_in-process_) or in an isolated worker process. When your .NET functions run in an isolated worker process, you can take advantage of the following benefits: 

+ **Fewer conflicts:** Because your functions run in a separate process, assemblies used in your app don't conflict with different versions of the same assemblies used by the host process. 
+ **Full control of the process**: You control the start-up of the app, which means that you can manage the configurations used and the middleware started.
+ **Standard dependency injection:** Because you have full control of the process, you can use current .NET behaviors for dependency injection and incorporating middleware into your function app.
+ **.NET version flexibility:** Running outside of the host process means that your functions can run on versions of .NET not natively supported by the Functions runtime, including the .NET Framework.  
 
If you have an existing C# function app that runs in-process, you need to migrate your app to take advantage of these benefits. For more information, see [Migrate .NET apps from the in-process model to the isolated worker model][migrate].

For a comprehensive comparison between the two modes, see [Differences between in-process and isolate worker process .NET Azure Functions](./dotnet-isolated-in-process-differences.md). 

[!INCLUDE [functions-dotnet-supported-versions](../../includes/functions-dotnet-supported-versions.md)]

## Project structure

A .NET project for Azure Functions using the isolated worker model is basically a .NET console app project that targets a supported .NET runtime. The following are the basic files required in any .NET isolated project:

+ C# project file (.csproj) that defines the project and dependencies.
+ Program.cs file that's the entry point for the app.
+ Any code files [defining your functions](#methods-recognized-as-functions).
+ [host.json](functions-host-json.md) file that defines configuration shared by functions in your project.
+ [local.settings.json](functions-develop-local.md#local-settings-file) file that defines environment variables used by your project when run locally on your machine.
 
For complete examples, see the [.NET 8 sample project](https://github.com/Azure/azure-functions-dotnet-worker/tree/main/samples/FunctionApp) and the [.NET Framework 4.8 sample project](https://github.com/Azure/azure-functions-dotnet-worker/tree/main/samples/NetFxWorker).

## Package references

A .NET project for Azure Functions using the isolated worker model uses a unique set of packages, for both core functionality and binding extensions. 

### Core packages 

The following packages are required to run your .NET functions in an isolated worker process:

+ [Microsoft.Azure.Functions.Worker]
+ [Microsoft.Azure.Functions.Worker.Sdk]

#### Version 2.x

The 2.x versions of the core packages change the supported frameworks and bring in support for new .NET APIs from these later versions. When you target .NET 9 or later, your app needs to reference version 2.0.0 or later of both packages.

When updating to the 2.x versions, note the following changes:

- Starting with version 2.0.0 of [Microsoft.Azure.Functions.Worker.Sdk]:
    - The SDK includes default configurations for [SDK container builds](/dotnet/core/docker/publish-as-container).
    - The SDK includes support for [`dotnet run`](/dotnet/core/tools/dotnet-run) when the [Azure Functions Core Tools](./functions-develop-local.md) is installed. On Windows, the Core Tools needs to be installed through a mechanism other than NPM.
- Starting with version 2.0.0 of [Microsoft.Azure.Functions.Worker]:
    - This version adds support for `IHostApplicationBuilder`. Some examples in this guide include tabs to show alternatives using `IHostApplicationBuilder`. These examples require the 2.x versions.
    - Service provider scope validation is included by default if run in a development environment. This behavior matches ASP.NET Core.
    - The `EnableUserCodeException` option is enabled by default. The property is now marked as obsolete.
    - The `IncludeEmptyEntriesInMessagePayload` option is enabled by default. With this option enabled, trigger payloads that represent collections always include empty entries. For example, if a message is sent without a body, an empty entry would still be present in `string[]` for the trigger data. The inclusion of empty entries facilitates cross-referencing with metadata arrays which the function may also reference. You can disable this behavior by setting `IncludeEmptyEntriesInMessagePayload` to `false` in the `WorkerOptions` service configuration.
    - The `ILoggerExtensions` class is renamed to `FunctionsLoggerExtensions`. The rename prevents an ambiguous call error when using `LogMetric()` on an `ILogger` instance.
    - For apps that use `HttpResponseData`, the `WriteAsJsonAsync()` method no longer will set the status code to `200 OK`. In 1.x, this overrode other error codes that had been set.
- The 2.x versions drop .NET 5 TFM support.

### Extension packages

Because .NET isolated worker process functions use different binding types, they require a unique set of binding extension packages. 

You find these extension packages under [Microsoft.Azure.Functions.Worker.Extensions](https://www.nuget.org/packages?q=Microsoft.Azure.Functions.Worker.Extensions).

## Start-up and configuration 

When you use the isolated worker model, you have access to the start-up of your function app, which is usually in `Program.cs`. You're responsible for creating and starting your own host instance. As such, you also have direct access to the configuration pipeline for your app. With .NET Functions isolated worker process, you can much more easily add configurations, inject dependencies, and run your own middleware. 

# [IHostBuilder](#tab/hostbuilder)

The following code shows an example of a [HostBuilder] pipeline:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/FunctionApp/Program.cs" id="docsnippet_startup":::

This code requires `using Microsoft.Extensions.DependencyInjection;`.

Before calling `Build()` on the `IHostBuilder`, you should:

- Call either `ConfigureFunctionsWebApplication()` if using [ASP.NET Core integration](#aspnet-core-integration) or `ConfigureFunctionsWorkerDefaults()` otherwise. See [HTTP trigger](#http-trigger) for details on these options.   
    If you're writing your application using F#, some trigger and binding extensions require extra configuration. See the setup documentation for the [Blobs extension][fsharp-blobs], the [Tables extension][fsharp-tables], and the [Cosmos DB extension][fsharp-cosmos] when you plan to use these extensions in an F# app.
- Configure any services or app configuration your project requires. See [Configuration](#configuration) for details.  
    If you're planning to use Application Insights, you need to call `AddApplicationInsightsTelemetryWorkerService()` and `ConfigureFunctionsApplicationInsights()` in the `ConfigureServices()` delegate. See [Application Insights](#application-insights) for details.

If your project targets .NET Framework 4.8, you also need to add `FunctionsDebugger.Enable();` before creating the HostBuilder. It should be the first line of your `Main()` method. For more information, see [Debugging when targeting .NET Framework](#debugging-when-targeting-net-framework).

The [HostBuilder] is used to build and return a fully initialized [`IHost`][IHost] instance, which you run asynchronously to start your function app. 

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/FunctionApp/Program.cs" id="docsnippet_host_run":::

# [IHostApplicationBuilder](#tab/ihostapplicationbuilder)

_To use `IHostApplicationBuilder`, your app must use version 2.x or later of the [core packages](#core-packages)._

The following code shows an example of an [IHostApplicationBuilder] pipeline:

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

builder.Services
    .AddApplicationInsightsTelemetryWorkerService()
    .ConfigureFunctionsApplicationInsights()
    .AddSingleton<IHttpResponderService, DefaultHttpResponderService>();

builder.Logging.Services.Configure<LoggerFilterOptions>(options =>
    {
        // The Application Insights SDK adds a default logging filter that instructs ILogger to capture only Warning and more severe logs. Application Insights requires an explicit override.
        // Log levels can also be configured using appsettings.json. For more information, see https://learn.microsoft.com/azure/azure-monitor/app/worker-service#ilogger-logs
        LoggerFilterRule defaultRule = options.Rules.FirstOrDefault(rule => rule.ProviderName
            == "Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider");
        if (defaultRule is not null)
        {
            options.Rules.Remove(defaultRule);
        }
    });

var host = builder.Build();
```

Before calling `Build()` on the `IHostApplicationBuilder`, you should:

- If you want to use [ASP.NET Core integration](#aspnet-core-integration), call `builder.ConfigureFunctionsWebApplication()`.
- If you're writing your application using F#, you might need to register some binding extensions. See the setup documentation for the [Blobs extension][fsharp-blobs], the [Tables extension][fsharp-tables], and the [Cosmos DB extension][fsharp-cosmos] when you plan to use these extensions in an F# app.
- Configure any services or app configuration your project requires. See [Configuration](#configuration) for details.
- If you're planning to use Application Insights, you need to call `AddApplicationInsightsTelemetryWorkerService()` and `ConfigureFunctionsApplicationInsights()` against the builder's `Services` property. See [Application Insights](#application-insights) for details.

If your project targets .NET Framework 4.8, you also need to add `FunctionsDebugger.Enable();` before creating the HostBuilder. It should be the first line of your `Main()` method. For more information, see [Debugging when targeting .NET Framework](#debugging-when-targeting-net-framework).

The [IHostApplicationBuilder] is used to build and return a fully initialized [`IHost`][IHost] instance, which you run asynchronously to start your function app. 

```csharp
await host.RunAsync();
```

---

[fsharp-blobs]: ./functions-bindings-storage-blob.md#install-extension
[fsharp-tables]: ./functions-bindings-storage-table.md#install-extension
[fsharp-cosmos]: ./functions-bindings-cosmosdb-v2.md#install-extension

### Configuration

The type of builder you use determines how you can configure the application.

# [IHostBuilder](#tab/hostbuilder)

The [ConfigureFunctionsWorkerDefaults] method is used to add the settings required for the function app to run. The method includes the following functionality:

+ Default set of converters.
+ Set the default [JsonSerializerOptions] to ignore casing on property names.
+ Integrate with Azure Functions logging.
+ Output binding middleware and features.
+ Function execution middleware.
+ Default gRPC support.

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/FunctionApp/Program.cs" id="docsnippet_configure_defaults" :::   

Having access to the host builder pipeline means that you can also set any app-specific configurations during initialization. You can call the [ConfigureAppConfiguration] method on [HostBuilder] one or more times to add any configuration sources required by your code. To learn more about app configuration, see [Configuration in ASP.NET Core](/aspnet/core/fundamentals/configuration). 

# [IHostApplicationBuilder](#tab/ihostapplicationbuilder)

The `FunctionsApplication.CreateBuilder()` method is used to add the settings required for the function app to run. The method includes the following functionality:

+ Default set of converters.
+ Set the default [JsonSerializerOptions] to ignore casing on property names.
+ Integrate with Azure Functions logging.
+ Output binding middleware and features.
+ Function execution middleware.
+ Default gRPC support.
+ Apply other defaults from [Host.CreateDefaultBuilder()](/dotnet/api/microsoft.extensions.hosting.host.createdefaultbuilder).

Having access to the builder pipeline means that you can also set any app-specific configurations during initialization. You can call extension methods on the builder's `Configuration` property to add any configuration sources required by your code. To learn more about app configuration, see [Configuration in ASP.NET Core](/aspnet/core/fundamentals/configuration). 

---

These configurations only apply to the worker code you author, and they don't directly influence the configuration of the Functions host or triggers and bindings. To make changes to the functions host or trigger and binding configuration, you still need to use the [host.json file](functions-host-json.md).

> [!NOTE]
> Custom configuration sources cannot be used for configuration of triggers and bindings. Trigger and binding configuration must be available to the Functions platform, and not just your application code. You can provide this configuration through the [application settings](../app-service/configure-common.md#configure-app-settings), [Key Vault references](../app-service/app-service-key-vault-references.md?toc=%2Fazure%2Fazure-functions%2Ftoc.json), or [App Configuration references](../app-service/app-service-configuration-references.md?toc=%2Fazure%2Fazure-functions%2Ftoc.json) features.

### Dependency injection

The isolated worker model uses standard .NET mechanisms for injecting services.
 
# [IHostBuilder](#tab/hostbuilder)

When you use a `HostBuilder`, call [ConfigureServices] on the host builder and use the extension methods on [IServiceCollection] to inject specific services. The following example injects a singleton service dependency:

```csharp
.ConfigureServices(services =>
{
    services.AddSingleton<IHttpResponderService, DefaultHttpResponderService>();
})
```

# [IHostApplicationBuilder](#tab/ihostapplicationbuilder)

When you use an `IHostApplicationBuilder`, you can use its `Services` property to access the [IServiceCollection]. The following example injects a singleton service dependency:

```csharp
builder.Services.AddSingleton<IHttpResponderService, DefaultHttpResponderService>();
```

---

This code requires `using Microsoft.Extensions.DependencyInjection;`. To learn more, see [Dependency injection in ASP.NET Core](/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-5.0&preserve-view=true).

#### Register Azure clients

Dependency injection can be used to interact with other Azure services. You can inject clients from the [Azure SDK for .NET](/dotnet/azure/sdk/azure-sdk-for-dotnet) using the [Microsoft.Extensions.Azure](https://www.nuget.org/packages/Microsoft.Extensions.Azure) package. After installing the package, [register the clients](/dotnet/azure/sdk/dependency-injection#register-clients) by calling `AddAzureClients()` on the service collection in `Program.cs`. The following example configures a [named client](/dotnet/azure/sdk/dependency-injection#configure-multiple-service-clients-with-different-names) for Azure Blobs:

# [IHostBuilder](#tab/hostbuilder)

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices((hostContext, services) =>
    {
        services.AddAzureClients(clientBuilder =>
        {
            clientBuilder.AddBlobServiceClient(hostContext.Configuration.GetSection("MyStorageConnection"))
                .WithName("copierOutputBlob");
        });
    })
    .Build();

host.Run();
```

# [IHostApplicationBuilder](#tab/ihostapplicationbuilder)

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

builder.Services
    .AddAzureClients(clientBuilder =>
        {
            clientBuilder.AddBlobServiceClient(builder.Configuration.GetSection("MyStorageConnection"))
                .WithName("copierOutputBlob");
        });

builder.Build().Run();
```

---

The following example shows how we can use this registration and [SDK types](#sdk-types) to copy blob contents as a stream from one container to another using an injected client:

```csharp
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Logging;

namespace MyFunctionApp
{
    public class BlobCopier
    {
        private readonly ILogger<BlobCopier> _logger;
        private readonly BlobContainerClient _copyContainerClient;

        public BlobCopier(ILogger<BlobCopier> logger, IAzureClientFactory<BlobServiceClient> blobClientFactory)
        {
            _logger = logger;
            _copyContainerClient = blobClientFactory.CreateClient("copierOutputBlob").GetBlobContainerClient("samples-workitems-copy");
            _copyContainerClient.CreateIfNotExists();
        }

        [Function("BlobCopier")]
        public async Task Run([BlobTrigger("samples-workitems/{name}", Connection = "MyStorageConnection")] Stream myBlob, string name)
        {
            await _copyContainerClient.UploadBlobAsync(name, myBlob);
            _logger.LogInformation($"Blob {name} copied!");
        }

    }
}
```

The [`ILogger<T>`][ILogger&lt;T&gt;] in this example was also obtained through dependency injection, so it's registered automatically. To learn more about configuration options for logging, see [Logging](#logging).

> [!TIP]
> The example used a literal string for the name of the client in both `Program.cs` and the function. Consider instead using a shared constant string defined on the function class. For example, you could add `public const string CopyStorageClientName = nameof(_copyContainerClient);` and then reference `BlobCopier.CopyStorageClientName` in both locations. You could similarly define the configuration section name with the function rather than in `Program.cs`.

### Middleware

The isolated worker model also supports middleware registration, again by using a model similar to what exists in ASP.NET. This model gives you the ability to inject logic into the invocation pipeline, and before and after functions execute.

The [ConfigureFunctionsWorkerDefaults] extension method has an overload that lets you register your own middleware, as you can see in the following example.  

# [IHostBuilder](#tab/hostbuilder)

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/CustomMiddleware/Program.cs" id="docsnippet_middleware_register" :::

# [IHostApplicationBuilder](#tab/ihostapplicationbuilder)

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

// Register our custom middlewares with the worker
builder
    .UseMiddleware<ExceptionHandlingMiddleware>()
    .UseMiddleware<MyCustomMiddleware>()
    .UseWhen<StampHttpHeaderMiddleware>((context) =>
    {
        // We want to use this middleware only for http trigger invocations.
        return context.FunctionDefinition.InputBindings.Values
                        .First(a => a.Type.EndsWith("Trigger")).Type == "httpTrigger";
    });

builder.Build().Run();
```

---

 The `UseWhen` extension method can be used to register a middleware that gets executed conditionally. You must pass to this method a predicate that returns a boolean value, and the middleware participates in the invocation processing pipeline when the return value of the predicate is `true`.

The following extension methods on [FunctionContext] make it easier to work with middleware in the isolated model.

| Method | Description |
| ---- | ---- |
| **`GetHttpRequestDataAsync`** | Gets the `HttpRequestData` instance when called by an HTTP trigger. This method returns an instance of `ValueTask<HttpRequestData?>`, which is useful when you want to read message data, such as request headers and cookies. |
| **`GetHttpResponseData`** | Gets the `HttpResponseData` instance when called by an HTTP trigger. |
|  **`GetInvocationResult`** | Gets an instance of `InvocationResult`, which represents the result of the current function execution. Use the `Value` property to get or set the value as needed. |
|  **`GetOutputBindings`** | Gets the output binding entries for the current function execution. Each entry in the result of this method is of type `OutputBindingData`. You can use the `Value` property to get or set the value as needed. | 
|  **`BindInputAsync`** | Binds an input binding item for the requested `BindingMetadata` instance. For example, you can use this method when you have a function with a `BlobInput` input binding that needs to be used by your middleware. |

This is an example of a middleware implementation that reads the `HttpRequestData` instance and updates the `HttpResponseData` instance during function execution:
 
:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/CustomMiddleware/StampHttpHeaderMiddleware.cs" id="docsnippet_middleware_example_stampheader" :::
 
This middleware checks for the presence of a specific request header(x-correlationId), and when present uses the header value to stamp a response header. Otherwise, it generates a new GUID value and uses that for stamping the response header. For a more complete example of using custom middleware in your function app, see the [custom middleware reference sample](https://github.com/Azure/azure-functions-dotnet-worker/blob/main/samples/CustomMiddleware).

### Customizing JSON serialization

The isolated worker model uses `System.Text.Json` by default. You can customize the behavior of the serializer by configuring services as part of your `Program.cs` file. This section covers general-purpose serialization and won't influence [HTTP trigger JSON serialization with ASP.NET Core integration](#json-serialization-with-aspnet-core-integration), which must be configured separately.

# [IHostBuilder](#tab/hostbuilder)

The following example shows this using `ConfigureFunctionsWebApplication`, but it will also work for `ConfigureFunctionsWorkerDefaults`:

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication((IFunctionsWorkerApplicationBuilder builder) =>
    {
        builder.Services.Configure<JsonSerializerOptions>(jsonSerializerOptions =>
        {
            jsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            jsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
            jsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;

            // override the default value
            jsonSerializerOptions.PropertyNameCaseInsensitive = false;
        });
    })
    .Build();

host.Run();
```

# [IHostApplicationBuilder](#tab/ihostapplicationbuilder)

```csharp
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder.Services.Configure<JsonSerializerOptions>(jsonSerializerOptions =>
    {
        jsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        jsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        jsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;

        // override the default value
        jsonSerializerOptions.PropertyNameCaseInsensitive = false;
    });

builder.Build().Run();
```

---

You might want to instead use JSON.NET (`Newtonsoft.Json`) for serialization. To do this, you would install the [`Microsoft.Azure.Core.NewtonsoftJson`](https://www.nuget.org/packages/Microsoft.Azure.Core.NewtonsoftJson) package. Then, in your service registration, you would reassign the `Serializer` property on the `WorkerOptions` configuration. The following example shows this using `ConfigureFunctionsWebApplication`, but it will also work for `ConfigureFunctionsWorkerDefaults`:

# [IHostBuilder](#tab/hostbuilder)

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication((IFunctionsWorkerApplicationBuilder builder) =>
    {
        builder.Services.Configure<WorkerOptions>(workerOptions =>
        {
            var settings = NewtonsoftJsonObjectSerializer.CreateJsonSerializerSettings();
            settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            settings.NullValueHandling = NullValueHandling.Ignore;

            workerOptions.Serializer = new NewtonsoftJsonObjectSerializer(settings);
        });
    })
    .Build();

host.Run();
```

# [IHostApplicationBuilder](#tab/ihostapplicationbuilder)

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder.Services.Configure<WorkerOptions>(workerOptions =>
    {
        var settings = NewtonsoftJsonObjectSerializer.CreateJsonSerializerSettings();
        settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        settings.NullValueHandling = NullValueHandling.Ignore;

        workerOptions.Serializer = new NewtonsoftJsonObjectSerializer(settings);
    });

builder.Build().Run();
```

---

## Methods recognized as functions

A function method is a public method of a public class with a `Function` attribute applied to the method and a trigger attribute applied to an input parameter, as shown in the following example:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Queue/QueueFunction.cs" id="docsnippet_queue_trigger" :::

The trigger attribute specifies the trigger type and binds input data to a method parameter. The previous example function is triggered by a queue message, and the queue message is passed to the method in the `myQueueItem` parameter.

The `Function` attribute marks the method as a function entry point. The name must be unique within a project, start with a letter and only contain letters, numbers, `_`, and `-`, up to 127 characters in length. Project templates often create a method named `Run`, but the method name can be any valid C# method name. The method must be a public member of a public class. It should generally be an instance method so that services can be passed in via [dependency injection](#dependency-injection).

## Function parameters

Here are some of the parameters that you can include as part of a function method signature:

- [Bindings](#bindings), which are marked as such by decorating the parameters as attributes. The function must contain exactly one trigger parameter.
- An [execution context object](#execution-context), which provides information about the current invocation.
- A [cancellation token](#cancellation-tokens), used for graceful shutdown.

### Execution context

.NET isolated passes a [FunctionContext] object to your function methods. This object lets you get an [`ILogger`][ILogger] instance to write to the logs by calling the [GetLogger] method and supplying a `categoryName` string. You can use this context to obtain an [`ILogger`][ILogger] without having to use dependency injection. To learn more, see [Logging](#logging). 

### Cancellation tokens

A function can accept a [CancellationToken](/dotnet/api/system.threading.cancellationtoken) parameter, which enables the operating system to notify your code when the function is about to be terminated. You can use this notification to make sure the function doesn't terminate unexpectedly in a way that leaves data in an inconsistent state.

Cancellation tokens are supported in .NET functions when running in an isolated worker process. The following example raises an exception when a cancellation request is received:

```csharp
[Function(nameof(ThrowOnCancellation))]
public async Task ThrowOnCancellation(
    [EventHubTrigger("sample-workitem-1", Connection = "EventHubConnection")] string[] messages,
    FunctionContext context,
    CancellationToken cancellationToken)
{
    _logger.LogInformation("C# EventHub {functionName} trigger function processing a request.", nameof(ThrowOnCancellation));

    foreach (var message in messages)
    {
        cancellationToken.ThrowIfCancellationRequested();
        await Task.Delay(6000); // task delay to simulate message processing
        _logger.LogInformation("Message '{msg}' was processed.", message);
    }
}
```
 
The following example performs clean-up actions when a cancellation request is received:

```csharp
[Function(nameof(HandleCancellationCleanup))]
public async Task HandleCancellationCleanup(
    [EventHubTrigger("sample-workitem-2", Connection = "EventHubConnection")] string[] messages,
    FunctionContext context,
    CancellationToken cancellationToken)
{
    _logger.LogInformation("C# EventHub {functionName} trigger function processing a request.", nameof(HandleCancellationCleanup));

    foreach (var message in messages)
    {
        if (cancellationToken.IsCancellationRequested)
        {
            _logger.LogInformation("A cancellation token was received, taking precautionary actions.");
            // Take precautions like noting how far along you are with processing the batch
            _logger.LogInformation("Precautionary activities complete.");
            break;
        }

        await Task.Delay(6000); // task delay to simulate message processing
        _logger.LogInformation("Message '{msg}' was processed.", message);
    }
}
```

## Bindings 

Bindings are defined by using attributes on methods, parameters, and return types. Bindings can provide data as strings, arrays, and serializable types, such as plain old class objects (POCOs). For some binding extensions, you can also [bind to service-specific types](#sdk-types) defined in service SDKs. 

For HTTP triggers, see the [HTTP trigger](#http-trigger) section.

For a complete set of reference samples using triggers and bindings with isolated worker process functions, see the [binding extensions reference sample](https://github.com/Azure/azure-functions-dotnet-worker/blob/main/samples/Extensions). 

### Input bindings

A function can have zero or more input bindings that can pass data to a function. Like triggers, input bindings are defined by applying a binding attribute to an input parameter. When the function executes, the runtime tries to get data specified in the binding. The data being requested is often dependent on information provided by the trigger using binding parameters.  

### Output bindings

To write to an output binding, you must apply an output binding attribute to the function method, which defines how to write to the bound service. The value returned by the method is written to the output binding. For example, the following example writes a string value to a message queue named `output-queue` by using an output binding:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Queue/QueueFunction.cs" id="docsnippet_queue_output_binding" :::

### Multiple output bindings

The data written to an output binding is always the return value of the function. If you need to write to more than one output binding, you must create a custom return type. This return type must have the output binding attribute applied to one or more properties of the class. The following example is an HTTP-triggered function using [ASP.NET Core integration](#aspnet-core-integration) which writes to both the HTTP response and a queue output binding:

```csharp
public class MultipleOutputBindings
{
    private readonly ILogger<MultipleOutputBindings> _logger;

    public MultipleOutputBindings(ILogger<MultipleOutputBindings> logger)
    {
        _logger = logger;
    }

    [Function("MultipleOutputBindings")]
    public MyOutputType Run([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");
        var myObject = new MyOutputType
        {
            Result = new OkObjectResult("C# HTTP trigger function processed a request."),
            MessageText = "some output"
        };
        return myObject;
    }

    public class MyOutputType
    {
        [HttpResult]
        public IActionResult Result { get; set; }

        [QueueOutput("myQueue")]
        public string MessageText { get; set; }
    }
}
```

When using custom return types for multiple output bindings with ASP.NET Core integration, you must add the `[HttpResult]` attribute to the property that provides the result. The `HttpResult` attribute is available when using [SDK 1.17.3-preview2 or later](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk/1.17.3-preview2) along with [version 3.2.0 or later of the HTTP extension](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Http/3.2.0) and [version 1.3.0 or later of the ASP.NET Core extension](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore/1.3.0).

### SDK types

For some service-specific binding types, binding data can be provided using types from service SDKs and frameworks. These provide more capability beyond what a serialized string or plain-old CLR object (POCO) can offer. To use the newer types, your project needs to be updated to use newer versions of core dependencies.

| Dependency | Version requirement |
|-|-|
|[Microsoft.Azure.Functions.Worker]| 1.18.0 or later |
|[Microsoft.Azure.Functions.Worker.Sdk]| 1.13.0 or later |

When testing SDK types locally on your machine, you also need to use [Azure Functions Core Tools](./functions-run-local.md), version 4.0.5000 or later. You can check your current version using the `func version` command.

Each trigger and binding extension also has its own minimum version requirement, which is described in the extension reference articles. The following service-specific bindings provide SDK types:

| Service | Trigger | Input binding | Output binding |
|-|-|-|-|
| [Azure Blobs][blob-sdk-types] | **Generally Available** | **Generally Available** | _SDK types not recommended.<sup>1</sup>_ | 
| [Azure Queues][queue-sdk-types] | **Generally Available** | _Input binding doesn't exist_ | _SDK types not recommended.<sup>1</sup>_ | 
| [Azure Service Bus][servicebus-sdk-types] | **Generally Available**  | _Input binding doesn't exist_ | _SDK types not recommended.<sup>1</sup>_ | 
| [Azure Event Hubs][eventhub-sdk-types] | **Generally Available** | _Input binding doesn't exist_ | _SDK types not recommended.<sup>1</sup>_ | 
| [Azure Cosmos DB][cosmos-sdk-types] | _SDK types not used<sup>2</sup>_ | **Generally Available**  |  _SDK types not recommended.<sup>1</sup>_ | 
| [Azure Tables][tables-sdk-types] | _Trigger doesn't exist_ | **Generally Available** |  _SDK types not recommended.<sup>1</sup>_ | 
| [Azure Event Grid][eventgrid-sdk-types] | **Generally Available** | _Input binding doesn't exist_ |  _SDK types not recommended.<sup>1</sup>_ | 

[blob-sdk-types]: ./functions-bindings-storage-blob.md?tabs=isolated-process%2Cextensionv5&pivots=programming-language-csharp#binding-types
[cosmos-sdk-types]: ./functions-bindings-cosmosdb-v2.md?tabs=isolated-process%2Cextensionv4&pivots=programming-language-csharp#binding-types
[tables-sdk-types]: ./functions-bindings-storage-table.md?tabs=isolated-process%2Ctable-api&pivots=programming-language-csharp#binding-types
[eventgrid-sdk-types]: ./functions-bindings-event-grid.md?tabs=isolated-process%2Cextensionv3&pivots=programming-language-csharp#binding-types
[queue-sdk-types]: ./functions-bindings-storage-queue.md?tabs=isolated-process%2Cextensionv5&pivots=programming-language-csharp#binding-types
[eventhub-sdk-types]: ./functions-bindings-event-hubs.md?tabs=isolated-process%2Cextensionv5&pivots=programming-language-csharp#binding-types
[servicebus-sdk-types]: ./functions-bindings-service-bus.md?tabs=isolated-process%2Cextensionv5&pivots=programming-language-csharp#binding-types

<sup>1</sup> For output scenarios in which you would use an SDK type, you should create and work with SDK clients directly instead of using an output binding. See [Register Azure clients](#register-azure-clients) for a dependency injection example.

<sup>2</sup> The Cosmos DB trigger uses the [Azure Cosmos DB change feed](/azure/cosmos-db/change-feed) and exposes change feed items as JSON-serializable types. The absence of SDK types is by-design for this scenario.

> [!NOTE]
> When using [binding expressions](./functions-bindings-expressions-patterns.md) that rely on trigger data, SDK types for the trigger itself cannot be used.

## HTTP trigger

[HTTP triggers](./functions-bindings-http-webhook-trigger.md) allow a function to be invoked by an HTTP request. There are two different approaches that can be used:

- An [ASP.NET Core integration model](#aspnet-core-integration) that uses concepts familiar to ASP.NET Core developers
- A [built-in model](#built-in-http-model), which doesn't require extra dependencies and uses custom types for HTTP requests and responses. This approach is maintained for backward compatibility with previous .NET isolated worker apps.

### ASP.NET Core integration

This section shows how to work with the underlying HTTP request and response objects using types from ASP.NET Core including [HttpRequest], [HttpResponse], and [IActionResult]. This model isn't available to [apps targeting .NET Framework][supported-versions], which should instead use the [built-in model](#built-in-http-model).

> [!NOTE]
> Not all features of ASP.NET Core are exposed by this model. Specifically, the ASP.NET Core middleware pipeline and routing capabilities are not available. ASP.NET Core integration requires you to use updated packages.

To enable ASP.NET Core integration for HTTP:

1. Add a reference in your project to the [Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore/) package, version 1.0.0 or later.

1. Update your project to use these specific package versions:

    + [Microsoft.Azure.Functions.Worker.Sdk](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk/), version 1.11.0. or later
    + [Microsoft.Azure.Functions.Worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker/), version 1.16.0 or later.

1. In your `Program.cs` file, update the host builder configuration to call `ConfigureFunctionsWebApplication()`. This replaces `ConfigureFunctionsWorkerDefaults()` if you would use that method otherwise. The following example shows a minimal setup without other customizations:

    # [IHostBuilder](#tab/hostbuilder)
    
    ```csharp
    using Microsoft.Azure.Functions.Worker;
    using Microsoft.Extensions.Hosting;
    
    var host = new HostBuilder()
        .ConfigureFunctionsWebApplication()
        .Build();
    
    host.Run();
    ```
    
    # [IHostApplicationBuilder](#tab/ihostapplicationbuilder)
    
    > [!NOTE]
    > Your application must reference version 2.0.0 or later of [Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore/) to use ASP.NET Core integration with `IHostApplicationBuilder`.

    ```csharp
    using Microsoft.Azure.Functions.Worker.Builder;
    using Microsoft.Extensions.Hosting;

    var builder = FunctionsApplication.CreateBuilder(args);

    builder.ConfigureFunctionsWebApplication();    

    builder.Build().Run();
    ```

    ---

1. Update any existing HTTP-triggered functions to use the ASP.NET Core types. This example shows the standard `HttpRequest` and an `IActionResult` used for a simple "hello, world" function:

    ```csharp
    [Function("HttpFunction")]
    public IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
    {
        return new OkObjectResult($"Welcome to Azure Functions, {req.Query["name"]}!");
    }
    ```

#### JSON serialization with ASP.NET Core integration

ASP.NET Core has its own serialization layer, and it is not affected by [customizing general serialization configuration](#customizing-json-serialization). To customize the serialization behavior used for your HTTP triggers, you need to include an `.AddMvc()` call as part of service registration. The returned `IMvcBuilder` can be used to modify ASP.NET Core's JSON serialization settings.

You can continue to use `HttpRequestData` and `HttpResponsedata` while using ASP.NET integration, though for most apps, it's better to instead use `HttpRequest` and `IActionResult`. Using `HttpRequestData`/`HttpResponseData` doesn't invoke the ASP.NET Core serialization layer and instead relies upon the [general worker serialization configuration](#customizing-json-serialization) for the app. However, when ASP.NET Core integration is enabled, you might still need to add configuration. The default behavior from ASP.NET Core is to disallow synchronous IO. To use a custom serializer that does not support asynchronous IO, such as `NewtonsoftJsonObjectSerializer`, you need to enable synchronous IO for your application by configuring the `KestrelServerOptions`.

The following example shows how to configure JSON.NET (`Newtonsoft.Json`) and the [Microsoft.AspNetCore.Mvc.NewtonsoftJson NuGet package](https://www.nuget.org/packages/Microsoft.AspNetCore.Mvc.NewtonsoftJson) for serialization using this approach:

# [IHostBuilder](#tab/hostbuilder)

```csharp
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(services =>
    {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();
        services.AddMvc().AddNewtonsoftJson();

        // Only needed if using HttpRequestData/HttpResponseData and a serializer that doesn't support asynchronous IO
        // services.Configure<KestrelServerOptions>(options => options.AllowSynchronousIO = true);
    })
    .Build();
host.Run();
```

# [IHostApplicationBuilder](#tab/ihostapplicationbuilder)

```csharp
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder.Services
    .AddApplicationInsightsTelemetryWorkerService()
    .ConfigureFunctionsApplicationInsights();

builder.Services.AddMvc().AddNewtonsoftJson();

// Only needed if using HttpRequestData/HttpResponseData and a serializer that doesn't support asynchronous IO
// builder.Services.Configure<KestrelServerOptions>(options => options.AllowSynchronousIO = true);

builder.Build().Run();
```

---

### Built-in HTTP model

In the built-in model, the system translates the incoming HTTP request message into an [HttpRequestData] object that is passed to the function. This object provides data from the request, including `Headers`, `Cookies`, `Identities`, `URL`, and optionally a message `Body`. This object is a representation of the HTTP request but isn't directly connected to the underlying HTTP listener or the received message. 

Likewise, the function returns an [HttpResponseData] object, which provides data used to create the HTTP response, including message `StatusCode`, `Headers`, and optionally a message `Body`.  

The following example demonstrates the use of `HttpRequestData` and `HttpResponseData`:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Http/HttpFunction.cs" id="docsnippet_http_trigger" :::

## Logging

You can write to logs by using an [`ILogger<T>`][ILogger&lt;T&gt;] or [`ILogger`][ILogger] instance. The logger can be obtained through [dependency injection](#dependency-injection) of an [`ILogger<T>`][ILogger&lt;T&gt;] or of an [ILoggerFactory]:

```csharp
public class MyFunction {
    
    private readonly ILogger<MyFunction> _logger;
    
    public MyFunction(ILogger<MyFunction> logger) {
        _logger = logger;
    }
    
    [Function(nameof(MyFunction))]
    public void Run([BlobTrigger("samples-workitems/{name}", Connection = "")] string myBlob, string name)
    {
        _logger.LogInformation($"C# Blob trigger function Processed blob\n Name: {name} \n Data: {myBlob}");
    }

}
```

The logger can also be obtained from a [FunctionContext] object passed to your function. Call the [GetLogger&lt;T&gt;] or [GetLogger] method, passing a string value that is the name for the category in which the logs are written. The category is usually the name of the specific function from which the logs are written. To learn more about categories, see the [monitoring article](functions-monitoring.md#log-levels-and-categories).

Use the methods of [`ILogger<T>`][ILogger&lt;T&gt;] and [`ILogger`][ILogger] to write various log levels, such as `LogWarning` or `LogError`. To learn more about log levels, see the [monitoring article](functions-monitoring.md#log-levels-and-categories). You can customize the log levels for components added to your code by registering filters:

# [IHostBuilder](#tab/hostbuilder)

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(services =>
    {
        // Registers IHttpClientFactory.
        // By default this sends a lot of Information-level logs.
        services.AddHttpClient();
    })
    .ConfigureLogging(logging =>
    {
        // Disable IHttpClientFactory Informational logs.
        // Note -- you can also remove the handler that does the logging: https://github.com/aspnet/HttpClientFactory/issues/196#issuecomment-432755765 
        logging.AddFilter("System.Net.Http.HttpClient", LogLevel.Warning);
    })
    .Build();
```

# [IHostApplicationBuilder](#tab/ihostapplicationbuilder)

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

// Registers IHttpClientFactory.
// By default this sends a lot of Information-level logs.
builder.Services.AddHttpClient();

// Disable IHttpClientFactory Informational logs.
// Note -- you can also remove the handler that does the logging: https://github.com/aspnet/HttpClientFactory/issues/196#issuecomment-432755765 
builder.Logging.AddFilter("System.Net.Http.HttpClient", LogLevel.Warning);
    
builder.Build().Run();
```

---

As part of configuring your app in `Program.cs`, you can also define the behavior for how errors are surfaced to your logs. The default behavior depends on the type of builder you're using.

# [IHostBuilder](#tab/hostbuilder)

When you use a `HostBuilder`, by default, exceptions thrown by your code can end up wrapped in an `RpcException`. To remove this extra layer, set the `EnableUserCodeException` property to "true" as part of configuring the builder:

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults(builder => {}, options =>
    {
        options.EnableUserCodeException = true;
    })
    .Build();

host.Run();
```

# [IHostApplicationBuilder](#tab/ihostapplicationbuilder)

When you use an `IHostApplicationBuilder`, by default, exceptions thrown by your code flow through the system without changes. No other configuration is required.

---

### Application Insights

You can configure your isolated process application to emit logs directly to [Application Insights](/azure/azure-monitor/app/app-insights-overview?tabs=net). This behavior replaces the default behavior of [relaying logs through the host](./configure-monitoring.md#custom-application-logs). Unless you are using .NET Aspire, configuring direct Application Insights integration is recommended because it gives you control over how those logs are emitted. 

Application Insights integration is not enabled by default in all setup experiences. Some templates will create Functions projects with the necessary packages and startup code commented out. If you want to use Application Insights integration, you can uncomment these lines in `Program.cs` and the project's `.csproj` file. The instructions in the rest of this section also describe how to enable the integration.

If your project is part of a [.NET Aspire orchestration](#net-aspire-preview), it uses OpenTelemetry for monitoring instead. You should not enable direct Application Insights integration within .NET Aspire projects. Instead, configure the Azure Monitor OpenTelemetry exporter as part of the [service defaults project](/dotnet/aspire/fundamentals/service-defaults#opentelemetry-configuration). If your Functions project uses Application Insights integration in a .NET Aspire context, the application will error on startup.

#### Install packages

To write logs directly to Application Insights from your code, add references to these packages in your project:

+ [Microsoft.Azure.Functions.Worker.ApplicationInsights](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.ApplicationInsights/), version 1.0.0 or later. 
+ [Microsoft.ApplicationInsights.WorkerService](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WorkerService).

You can run the following commands to add these references to your project: 

```dotnetcli
dotnet add package Microsoft.ApplicationInsights.WorkerService
dotnet add package Microsoft.Azure.Functions.Worker.ApplicationInsights
```

#### Configure startup

With the packages installed, you must call `AddApplicationInsightsTelemetryWorkerService()` and `ConfigureFunctionsApplicationInsights()` during service configuration in your `Program.cs` file, as in this example:

# [IHostBuilder](#tab/hostbuilder)

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
    
var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(services => {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();
    })
    .Build();

host.Run();
```

# [IHostApplicationBuilder](#tab/ihostapplicationbuilder)

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
    
var builder = FunctionsApplication.CreateBuilder(args);

builder.Services
    .AddApplicationInsightsTelemetryWorkerService()
    .ConfigureFunctionsApplicationInsights();

builder.Build().Run();
```

---

The call to `ConfigureFunctionsApplicationInsights()` adds an `ITelemetryModule`, which listens to a Functions-defined `ActivitySource`. This creates the dependency telemetry required to support distributed tracing. To learn more about `AddApplicationInsightsTelemetryWorkerService()` and how to use it, see [Application Insights for Worker Service applications](/azure/azure-monitor/app/worker-service).

#### Managing log levels

> [!IMPORTANT]
> The Functions host and the isolated process worker have separate configuration for log levels, etc. Any [Application Insights configuration in host.json](./functions-host-json.md#applicationinsights) will not affect the logging from the worker, and similarly, configuration made in your worker code will not impact logging from the host. You need to apply changes in both places if your scenario requires customization at both layers.

The rest of your application continues to work with `ILogger` and `ILogger<T>`. However, by default, the Application Insights SDK adds a logging filter that instructs the logger to capture only warnings and more severe logs. If you want to disable this behavior, remove the filter rule as part of service configuration:

# [IHostBuilder](#tab/hostbuilder)

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(services => {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();
    })
    .ConfigureLogging(logging =>
    {
        logging.Services.Configure<LoggerFilterOptions>(options =>
        {
            LoggerFilterRule defaultRule = options.Rules.FirstOrDefault(rule => rule.ProviderName
                == "Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider");
            if (defaultRule is not null)
            {
                options.Rules.Remove(defaultRule);
            }
        });
    })
    .Build();

host.Run();
```

# [IHostApplicationBuilder](#tab/ihostapplicationbuilder)

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

var builder = FunctionsApplication.CreateBuilder(args);

builder.Services
    .AddApplicationInsightsTelemetryWorkerService()
    .ConfigureFunctionsApplicationInsights();

builder.Logging.Services.Configure<LoggerFilterOptions>(options =>
    {
        LoggerFilterRule defaultRule = options.Rules.FirstOrDefault(rule => rule.ProviderName
            == "Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider");
        if (defaultRule is not null)
        {
            options.Rules.Remove(defaultRule);
        }
    });

builder.Build().Run();
```

---

## Performance optimizations

This section outlines options you can enable that improve performance around [cold start](./event-driven-scaling.md#cold-start).

In general, your app should use the latest versions of its core dependencies. At a minimum, you should update your project as follows:

1. Upgrade [Microsoft.Azure.Functions.Worker] to version 1.19.0 or later.
1. Upgrade [Microsoft.Azure.Functions.Worker.Sdk] to version 1.16.4 or later.
1. Add a framework reference to `Microsoft.AspNetCore.App`, unless your app targets .NET Framework.

The following snippet shows this configuration in the context of a project file:

```xml
  <ItemGroup>
    <FrameworkReference Include="Microsoft.AspNetCore.App" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.21.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="1.16.4" />
  </ItemGroup>
```

### Placeholders

Placeholders are a platform capability that improves cold start for apps targeting .NET 6 or later. To use this optimization, you must explicitly enable placeholders using these steps:

1. Update your project configuration to use the latest dependency versions, as detailed in the previous section.

1. Set the [`WEBSITE_USE_PLACEHOLDER_DOTNETISOLATED`](./functions-app-settings.md#website_use_placeholder_dotnetisolated) application setting to `1`, which you can do by using this [az functionapp config appsettings set](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-set) command:

    ```azurecli
    az functionapp config appsettings set -g <groupName> -n <appName> --settings 'WEBSITE_USE_PLACEHOLDER_DOTNETISOLATED=1'
    ```

    In this example, replace `<groupName>` with the name of the resource group, and replace `<appName>` with the name of your function app. 
 
1. Make sure that the [`netFrameworkVersion`](./functions-app-settings.md#netframeworkversion) property of the function app matches your project's target framework, which must be .NET 6 or later. You can do this by using this [az functionapp config set](/cli/azure/functionapp/config#az-functionapp-config-set) command:

    ```azurecli
    az functionapp config set -g <groupName> -n <appName> --net-framework-version <framework>
    ```

    In this example, also replace `<framework>` with the appropriate version string, such as `v8.0`, according to your target .NET version.
        
1. Make sure that your function app is configured to use a 64-bit process, which you can do by using this [az functionapp config set](/cli/azure/functionapp/config#az-functionapp-config-set) command:

    ```azurecli
    az functionapp config set -g <groupName> -n <appName> --use-32bit-worker-process false
    ```

> [!IMPORTANT]
> When setting the [`WEBSITE_USE_PLACEHOLDER_DOTNETISOLATED`](./functions-app-settings.md#website_use_placeholder_dotnetisolated) to `1`, all other function app configurations must be set correctly. Otherwise, your function app might fail to start.

### Optimized executor 

The function executor is a component of the platform that causes invocations to run. An optimized version of this component is enabled by default starting with version 1.16.2 of the SDK. No other configuration is required.

### ReadyToRun

You can compile your function app as [ReadyToRun binaries](/dotnet/core/deploying/ready-to-run). ReadyToRun is a form of ahead-of-time compilation that can improve startup performance to help reduce the effect of cold starts when running in a [Consumption plan](consumption-plan.md). ReadyToRun is available in .NET 6 and later versions and requires [version 4.0 or later](functions-versions.md) of the Azure Functions runtime.

ReadyToRun requires you to build the project against the runtime architecture of the hosting app. **If these are not aligned, your app will encounter an error at startup.** Select your runtime identifier from this table:

|Operating System | App is 32-bit<sup>1</sup> | Runtime identifier |
|-|-|-|
| Windows | True | `win-x86` |
| Windows | False | `win-x64` |
| Linux | True | N/A (not supported) |
| Linux | False | `linux-x64` | 

<sup>1</sup> Only 64-bit apps are eligible for some other performance optimizations.

To check if your Windows app is 32-bit or 64-bit, you can run the following CLI command, substituting `<group_name>` with the name of your resource group and `<app_name>` with the name of your application. An output of "true" indicates that the app is 32-bit, and "false" indicates 64-bit.

```azurecli
 az functionapp config show -g <group_name> -n <app_name> --query "use32BitWorkerProcess"
```

You can change your application to 64-bit with the following command, using the same substitutions:

```azurecli
az functionapp config set -g <group_name> -n <app_name> --use-32bit-worker-process false`
```

To compile your project as ReadyToRun, update your project file by adding the `<PublishReadyToRun>` and `<RuntimeIdentifier>` elements. The following example shows a configuration for publishing to a Windows 64-bit function app.

```xml
<PropertyGroup>
  <TargetFramework>net8.0</TargetFramework>
  <AzureFunctionsVersion>v4</AzureFunctionsVersion>
  <RuntimeIdentifier>win-x64</RuntimeIdentifier>
  <PublishReadyToRun>true</PublishReadyToRun>
</PropertyGroup>
```

If you don't want to set the `<RuntimeIdentifier>` as part of the project file, you can also configure this as part of the publishing gesture itself. For example, with a Windows 64-bit function app, the .NET CLI command would be:

```dotnetcli
dotnet publish --runtime win-x64
```

In Visual Studio, the **Target Runtime** option in the publish profile should be set to the correct runtime identifier. When set to the default value of **Portable**, ReadyToRun isn't used.

## Deploy to Azure Functions

When you deploy your function code project to Azure, it must run in either a function app or in a Linux container. The function app and other required Azure resources must exist before you deploy your code.  

You can also deploy your function app in a Linux container. For more information, see [Working with containers and Azure Functions](functions-how-to-custom-container.md). 

### Create Azure resources

You can create your function app and other required resources in Azure using one of these methods: 

+ [Visual Studio](functions-develop-vs.md#publish-to-azure): Visual Studio can create resources for you during the code publishing process.
+ [Visual Studio Code](functions-develop-vs-code.md#publish-to-azure): Visual Studio Code can connect to your subscription, create the resources needed by your app, and then publish your code.
+ [Azure CLI](create-first-function-cli-csharp.md#create-supporting-azure-resources-for-your-function): You can use the Azure CLI to create the required resources in Azure. 
+ [Azure PowerShell](./create-resources-azure-powershell.md#create-a-serverless-function-app-for-c): You can use Azure PowerShell to create the required resources in Azure. 
+ [Deployment templates](./functions-infrastructure-as-code.md): You can use ARM templates and Bicep files to automate the deployment of the required resources to Azure. Make sure your template includes any [required settings](#deployment-requirements).
+ [Azure portal](./functions-create-function-app-portal.md): You can create the required resources in the [Azure portal](https://portal.azure.com).

### Publish your application

After creating your function app and other required resources in Azure, you can deploy the code project to Azure using one of these methods:

+ [Visual Studio](functions-develop-vs.md#publish-to-azure): Simple manual deployment during development. 
+ [Visual Studio Code](functions-develop-vs-code.md?tabs=isolated-process&pivots=programming-language-csharp#republish-project-files): Simple manual deployment during development.
+ [Azure Functions Core Tools](functions-run-local.md?tabs=linuxisolated-process&pivots=programming-language-csharp#project-file-deployment): Deploy project file from the command line.
+ [Continuous deployment](./functions-continuous-deployment.md): Useful for ongoing maintenance, frequently to a [staging slot](./functions-deployment-slots.md). 
+ [Deployment templates](./functions-infrastructure-as-code.md#zip-deployment-package): You can use ARM templates or Bicep files to automate package deployments.

For more information, see [Deployment technologies in Azure Functions](functions-deployment-technologies.md).

#### Deployment payload

Many of the deployment methods make use of a zip archive. If you're creating the zip archive yourself, it must follow the structure outlined in this section. If it doesn't, your app may experience errors at startup.

The deployment payload should match the output of a `dotnet publish` command, though without the enclosing parent folder. The zip archive should be made from the following files:

- `.azurefunctions/`
- `extensions.json`
- `functions.metadata`
- `host.json`
- `worker.config.json`
- Your project executable (a console app)
- Other supporting files and directories peer to that executable

These files are generated by the build process, and they aren't meant to be edited directly.

When preparing a zip archive for deployment, you should only compress the contents of the output directory, not the enclosing directory itself. When the archive is extracted into the current working directory, the files listed above need to be immediately visible.

### Deployment requirements

There are a few requirements for running .NET functions in the isolated worker model in Azure, depending on the operating system:

### [Windows](#tab/windows)

+ [FUNCTIONS_WORKER_RUNTIME](functions-app-settings.md#functions_worker_runtime) must be set to a value of `dotnet-isolated`.
+ [netFrameworkVersion](functions-app-settings.md#netframeworkversion) must be set to the desired version.

### [Linux](#tab/linux)

+ [FUNCTIONS_WORKER_RUNTIME](functions-app-settings.md#functions_worker_runtime) must be set to a value of `dotnet-isolated`.
+ [`linuxFxVersion`](./functions-app-settings.md#linuxfxversion) must be set to the [correct base image](update-language-versions.md?tabs=azure-cli%2Clinux&pivots=programming-language-csharp#update-the-stack-configuration), like `DOTNET-ISOLATED|8.0`. 

---

When you create your function app in Azure using the methods in the previous section, these required settings are added for you. When you create these resources [by using ARM templates or Bicep files for automation](functions-infrastructure-as-code.md), you must make sure to set them in the template. 

## .NET Aspire (Preview)

[.NET Aspire](/dotnet/aspire/get-started/aspire-overview) is an opinionated stack that simplifies development of distributed applications in the cloud. You can enlist .NET 8 and .NET 9 isolated worker model projects in Aspire 9.0 orchestrations using preview support. The section outlines the core requirements for enlistment.

This integration requires specific setup:

- Use [Aspire 9.0 or later](/dotnet/aspire/fundamentals/setup-tooling) and the [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0). Aspire 9.0 supports the .NET 8 and .NET 9 frameworks.
- If you use Visual Studio, update to version 17.12 or later. You must also have the latest version of the Functions tools for Visual Studio. To check for updates, navigate to **Tools** > **Options**, choose **Azure Functions** under **Projects and Solutions**. Select **Check for updates** and install updates as prompted.
- In the [Aspire app host project](/dotnet/aspire/fundamentals/app-host-overview):
    - You must reference [Aspire.Hosting.Azure.Functions].
    - You must have a project reference to your Functions project.
    - In the app host's `Program.cs`, you must also include the project by calling `AddAzureFunctionsProject<TProject>()` on your `IDistributedApplicationBuilder`. This method is used instead of the `AddProject<TProject>()` that you use for other project types. If you just use `AddProject<TProject>()`, the Functions project will not start properly.
- In the Functions project:
    - You must reference the [2.x versions](#version-2x) of [Microsoft.Azure.Functions.Worker] and [Microsoft.Azure.Functions.Worker.Sdk]. You must also update any references you have to `Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore` to the 2.x version as well.
    - Your `Program.cs` should use the `IHostApplicationBuilder` version of [host instance startup](#start-up-and-configuration).
    - If you want to use your Aspire service defaults, you should include a project reference to the service defaults project. Before building your `IHostApplicationBuilder` in `Program.cs`, you should also include a call to `builder.AddServiceDefaults()`.
    - You shouldn't keep configuration in `local.settings.json`, aside from the `FUNCTIONS_WORKER_RUNTIME` setting, which should remain "dotnet-isolated". Other configuration should be set through the app host project.
    - You should remove any direct Application Insights integrations. Monitoring in Aspire is instead handled through its OpenTelemetry support.

The following example shows a minimal `Program.cs` for an App Host project:

```csharp
var builder = DistributedApplication.CreateBuilder(args);

builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject");

builder.Build().Run();
```

The following example shows a minimal `Program.cs` for a Functions project used in Aspire:

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.ConfigureFunctionsWebApplication();

builder.Build().Run();
```

This does not include the default Application Insights configuration that you see in many of the other `Program.cs` examples in this article. Instead, Aspire's OpenTelemetry integration is configured through the `builder.AddServiceDefaults()` call.

### Considerations and best practices for .NET Aspire integration

Consider the following points when evaluating .NET Aspire with Azure Functions:

- Support for Azure Functions with .NET Aspire is currently in preview. During the preview period, when you publish the Aspire solution to Azure, Functions projects are deployed as Azure Container Apps resources without event-driven scaling. Azure Functions support is not available for apps deployed in this mode.
- Trigger and binding configuration through Aspire is currently limited to specific integrations. See [Connection configuration with Aspire](#connection-configuration-with-aspire) for details.
- Your `Program.cs` should use the `IHostApplicationBuilder` version of [host instance startup](#start-up-and-configuration). This allows you to call `builder.AddServiceDefaults()` to add [.NET Aspire service defaults](/dotnet/aspire/fundamentals/service-defaults) to your Functions project.
- Aspire uses OpenTelemetry for monitoring. You can configure Aspire to export telemetry to Azure Monitor through the service defaults project. In many other Azure Functions contexts, you might include direct integration with Application Insights by registering the telemetry worker service. This is not recommended in Aspire and can lead to runtime errors with version 2.22.0 of `Microsoft.ApplicationInsights.WorkerService`. You should remove any direct Application Insights integrations from your Functions project when using Aspire.
- For Functions projects enlisted into an Aspire orchestration, most of the application configuration should come from the Aspire app host project. You should typically avoid setting things in `local.settings.json`, other than the `FUNCTIONS_WORKER_RUNTIME` setting. If the same environment variable is set by `local.settings.json` and Aspire, the system uses the Aspire version.
- Do not configure the Storage emulator for any connections in `local.settings.json`. Many Functions starter templates include the emulator as a default for `AzureWebJobsStorage`. However, emulator configuration can prompt some IDEs to start a version of the emulator that can conflict with the version that Aspire uses.

### Connection configuration with Aspire

Azure Functions requires a [host storage connection (`AzureWebJobsStorage`)](./functions-reference.md#connecting-to-host-storage-with-an-identity) for several of its core behaviors. When you call `AddAzureFunctionsProject<TProject>()` in your app host project, a default `AzureWebJobsStorage` connection is created and provided to the Functions project. This default connection uses the Storage emulator for local development runs and automatically provisions a storage account when deployed. For additional control, you can replace this connection by calling `.WithHostStorage()` on the Functions project resource.

The following example shows a minimal `Program.cs` for an app host project that replaces the host storage:

```csharp
var builder = DistributedApplication.CreateBuilder(args);

var myHostStorage = builder.AddAzureStorage("myHostStorage");

builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
    .WithHostStorage(myHostStorage);

builder.Build().Run();
```

> [!NOTE]
> When Aspire provisions the host storage in publish mode, it defaults to creating role assignments for the [Storage Account Contributor], [Storage Blob Data Contributor], [Storage Queue Data Contributor], and [Storage Table Data Contributor] roles.

Your triggers and bindings reference connections by name. Some Aspire integrations are enabled to provide these through a call to `WithReference()` on the project resource:

| Aspire integration                                                          | Notes                                                                                                                                                                                                |
|-----------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Azure Blobs](/dotnet/aspire/storage/azure-storage-blobs-integration)       | When Aspire provisions the resource, it defaults to creating role assignments for the [Storage Blob Data Contributor], [Storage Queue Data Contributor], and [Storage Table Data Contributor] roles. |
| [Azure Queues](/dotnet/aspire/storage/azure-storage-queues-integration)     | When Aspire provisions the resource, it defaults to creating role assignments for the [Storage Blob Data Contributor], [Storage Queue Data Contributor], and [Storage Table Data Contributor] roles. |
| [Azure Event Hubs](/dotnet/aspire/messaging/azure-event-hubs-integration)   | When Aspire provisions the resource, it defaults to creating a role assignment using the [Azure Event Hubs Data Owner] role.                                                                         |
| [Azure Service Bus](/dotnet/aspire/messaging/azure-service-bus-integration) | When Aspire provisions the resource, it defaults to creating a role assignment using the [Azure Service Bus Data Owner] role.                                                                        |

The following example shows a minimal `Program.cs` for an app host project that configures a queue trigger. In this example, the corresponding queue trigger has its `Connection` property set to "MyQueueTriggerConnection".

```csharp
var builder = DistributedApplication.CreateBuilder(args);

var myAppStorage = builder.AddAzureStorage("myAppStorage").RunAsEmulator();
var queues = myAppStorage.AddQueues("queues");

builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
    .WithReference(queues, "MyQueueTriggerConnection");

builder.Build().Run();
```

For other integrations, calls to `WithReference` set the configuration in a different way, making it available to [Aspire client integrations](/dotnet/aspire/fundamentals/integrations-overview#client-integrations), but not to triggers and bindings. For these integrations, you should call `WithEnvironment()` to pass the connection information for the trigger or binding to resolve. The following example shows how to set the environment variable "MyBindingConnection" for a resource that exposes a connection string expression:

```csharp
builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
    .WithEnvironment("MyBindingConnection", otherIntegration.Resource.ConnectionStringExpression);
```

You can configure both `WithReference()` and `WithEnvironment()` if you want a connection to be used both by Aspire client integrations and the triggers and bindings system.

For some resources, the structure of a connection might be different between when you run it locally and when you publish it to Azure. In the previous example, `otherIntegration` could be a resource that runs as an emulator, so `ConnectionStringExpression` would return an emulator connection string. However, when the resource is published, Aspire might set up an identity-based connection, and `ConnectionStringExpression` would return the service's URI. In this case, to set up [identity based connections for Azure Functions](./functions-reference.md#configure-an-identity-based-connection), you might need to provide a different environment variable name. The following example uses `builder.ExecutionContext.IsPublishMode` to conditionally add the necessary suffix:

```csharp
builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
    .WithEnvironment("MyBindingConnection" + (builder.ExecutionContext.IsPublishMode ? "__serviceUri" : ""), otherIntegration.Resource.ConnectionStringExpression);
```

Depending on your scenario, you may also need to adjust the permissions that will be assigned for an identity-based connection. You can use the [`ConfigureConstruct<T>()` method](/dotnet/api/aspire.hosting.azureconstructresourceextensions.configureconstruct) to customize how Aspire configures infrastructure when it publishes your project.

Consult each binding's [reference pages](./functions-triggers-bindings.md#supported-bindings) for details on the connection formats it supports and the permissions those formats require.

## Debugging

When running locally using Visual Studio or Visual Studio Code, you're able to debug your .NET isolated worker project as normal. However, there are two debugging scenarios that don't work as expected.   

### Remote Debugging using Visual Studio

Because your isolated worker process app runs outside the Functions runtime, you need to attach the remote debugger to a separate process. To learn more about debugging using Visual Studio, see [Remote Debugging](functions-develop-vs.md?tabs=isolated-process#remote-debugging).

### Debugging when targeting .NET Framework

If your isolated project targets .NET Framework 4.8, you need to take manual steps to enable debugging. These steps aren't required if using another target framework.

Your app should start with a call to `FunctionsDebugger.Enable();` as its first operation. This occurs in the `Main()` method before initializing a HostBuilder. Your `Program.cs` file should look similar to this:

# [IHostBuilder](#tab/hostbuilder)

```csharp
using System;
using System.Diagnostics;
using Microsoft.Extensions.Hosting;
using Microsoft.Azure.Functions.Worker;
using NetFxWorker;

namespace MyDotnetFrameworkProject
{
    internal class Program
    {
        static void Main(string[] args)
        {
            FunctionsDebugger.Enable();

            var host = new HostBuilder()
                .ConfigureFunctionsWorkerDefaults()
                .Build();

            host.Run();
        }
    }
}
```

# [IHostApplicationBuilder](#tab/ihostapplicationbuilder)

```csharp
using System;
using System.Diagnostics;
using Microsoft.Extensions.Hosting;
using Microsoft.Azure.Functions.Worker;
using NetFxWorker;

namespace MyDotnetFrameworkProject
{
    internal class Program
    {
        static void Main(string[] args)
        {
            FunctionsDebugger.Enable();

            var host = FunctionsApplication
                .CreateBuilder(args)
                .Build();

            host.Run();
        }
    }
}
```

---

Next, you need to manually attach to the process using a .NET Framework debugger. Visual Studio doesn't do this automatically for isolated worker process .NET Framework apps yet, and the "Start Debugging" operation should be avoided.

In your project directory (or its build output directory), run:

```azurecli
func host start --dotnet-isolated-debug
```

This starts your worker, and the process stops with the following message:

```azurecli
Azure Functions .NET Worker (PID: <process id>) initialized in debug mode. Waiting for debugger to attach...
```

Where `<process id>` is the ID for your worker process. You can now use Visual Studio to manually attach to the process. For instructions on this operation, see [How to attach to a running process](/visualstudio/debugger/attach-to-running-processes-with-the-visual-studio-debugger#BKMK_Attach_to_a_running_process).

After the debugger is attached, the process execution resumes, and you'll be able to debug.

## Preview .NET versions

Before a generally available release, a .NET version might be released in a _Preview_ or _Go-live_ state. See the [.NET Official Support Policy](https://dotnet.microsoft.com/platform/support/policy/dotnet-core) for details on these states.

While it might be possible to target a given release from a local Functions project, function apps hosted in Azure might not have that release available. Azure Functions can only be used with Preview or Go-live releases noted in this section.

Azure Functions doesn't currently work with any "Preview" or "Go-live" .NET releases. See [Supported versions][supported-versions] for a list of generally available releases that you can use.

### Using a preview .NET SDK

To use Azure Functions with a preview version of .NET, you need to update your project by:

1. Installing the relevant .NET SDK version in your development
1. Changing the `TargetFramework` setting in your `.csproj` file

When you deploy to your function app in Azure, you also need to ensure that the framework is made available to the app. During the preview period, some tools and experiences may not surface the new preview version as an option. If you don't see the preview version included in the Azure portal, for example, you can use the REST API, Bicep templates, or the Azure CLI to configure the version manually.

### [Windows](#tab/windows)

For apps hosted on Windows, use the following Azure CLI command. Replace `<groupName>` with the name of the resource group, and replace `<appName>` with the name of your function app. Replace `<framework>` with the appropriate version string, such as `v8.0`.

```azurecli
az functionapp config set -g <groupName> -n <appName> --net-framework-version <framework>
```

### [Linux](#tab/linux)

For apps hosted on Linux, use the following Azure CLI command. Replace `<groupName>` with the name of the resource group, and replace `<appName>` with the name of your function app. Replace `<version>` with the appropriate version string, such as `8.0`.

```azurecli
az functionapp config set -g <groupName> -n <appName> --linux-fx-version "dotnet-isolated|<version>"
```

---

### Considerations for using .NET preview versions

Keep these considerations in mind when using Functions with preview versions of .NET: 

+ When you author your functions in Visual Studio, you must use [Visual Studio Preview](https://visualstudio.microsoft.com/vs/preview/), which supports building Azure Functions projects with .NET preview SDKs. 

+ Make sure you have the latest Functions tools and templates. To update your tools:

    1. Navigate to **Tools** > **Options**, choose **Azure Functions** under **Projects and Solutions**.
    1. Select **Check for updates** and install updates as prompted.

+ During a preview period, your development environment might have a more recent version of the .NET preview than the hosted service. This can cause your function app to fail when deployed. To address this, you can specify the version of the SDK to use in [`global.json`](/dotnet/core/tools/global-json). 

    1. Run the `dotnet --list-sdks` command and note the preview version you're currently using during local development. 
    1. Run the `dotnet new globaljson --sdk-version <SDK_VERSION> --force` command, where `<SDK_VERSION>` is the version you're using locally. For example, `dotnet new globaljson --sdk-version dotnet-sdk-8.0.100-preview.7.23376.3 --force` causes the system to use the .NET 8 Preview 7 SDK when building your project.

> [!NOTE] 
> Because of the just-in-time loading of preview frameworks, function apps running on Windows can experience increased cold start times when compared against earlier GA versions.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about best practices for Azure Functions](functions-best-practices.md)

> [!div class="nextstepaction"]
> [Migrate .NET apps to the isolated worker model][migrate]

[migrate]: ./migrate-dotnet-to-isolated-model.md

[supported-versions]: #supported-versions

[Microsoft.Azure.Functions.Worker]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker/
[Microsoft.Azure.Functions.Worker.Sdk]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk/

[Aspire.Hosting.Azure.Functions]: https://www.nuget.org/packages/Aspire.Hosting.Azure.Functions

[Storage Account Contributor]: ../role-based-access-control/built-in-roles.md#storage-account-contributor
[Storage Blob Data Contributor]: ../role-based-access-control/built-in-roles.md#storage-blob-data-contributor
[Storage Queue Data Contributor]: ../role-based-access-control/built-in-roles.md#storage-queue-data-contributor
[Storage Table Data Contributor]: ../role-based-access-control/built-in-roles.md#storage-table-data-contributor
[Azure Event Hubs Data Owner]: ../role-based-access-control/built-in-roles.md#azure-event-hubs-data-owner
[Azure Service Bus Data Owner]: ../role-based-access-control/built-in-roles.md#azure-service-bus-data-owner

[HostBuilder]: /dotnet/api/microsoft.extensions.hosting.hostbuilder
[IHostApplicationBuilder]: /dotnet/api/microsoft.extensions.hosting.ihostapplicationbuilder
[IHost]: /dotnet/api/microsoft.extensions.hosting.ihost
[ConfigureFunctionsWorkerDefaults]: /dotnet/api/microsoft.extensions.hosting.workerhostbuilderextensions.configurefunctionsworkerdefaults?view=azure-dotnet&preserve-view=true#Microsoft_Extensions_Hosting_WorkerHostBuilderExtensions_ConfigureFunctionsWorkerDefaults_Microsoft_Extensions_Hosting_IHostBuilder_
[ConfigureAppConfiguration]: /dotnet/api/microsoft.extensions.hosting.hostbuilder.configureappconfiguration
[IServiceCollection]: /dotnet/api/microsoft.extensions.dependencyinjection.iservicecollection
[ConfigureServices]: /dotnet/api/microsoft.extensions.hosting.hostbuilder.configureservices
[FunctionContext]: /dotnet/api/microsoft.azure.functions.worker.functioncontext?view=azure-dotnet&preserve-view=true
[ILogger]: /dotnet/api/microsoft.extensions.logging.ilogger
[ILogger&lt;T&gt;]: /dotnet/api/microsoft.extensions.logging.ilogger-1
[ILoggerFactory]: /dotnet/api/microsoft.extensions.logging.iloggerfactory
[GetLogger]: /dotnet/api/microsoft.azure.functions.worker.functioncontextloggerextensions.getlogger
[GetLogger&lt;T&gt;]: /dotnet/api/microsoft.azure.functions.worker.functioncontextloggerextensions.getlogger#microsoft-azure-functions-worker-functioncontextloggerextensions-getlogger-1
[HttpRequestData]: /dotnet/api/microsoft.azure.functions.worker.http.httprequestdata?view=azure-dotnet&preserve-view=true
[HttpResponseData]: /dotnet/api/microsoft.azure.functions.worker.http.httpresponsedata?view=azure-dotnet&preserve-view=true
[HttpRequest]: /dotnet/api/microsoft.aspnetcore.http.httprequest
[HttpResponse]: /dotnet/api/microsoft.aspnetcore.http.httpresponse
[IActionResult]: /dotnet/api/microsoft.aspnetcore.mvc.iactionresult
[JsonSerializerOptions]: /dotnet/api/system.text.json.jsonserializeroptions
