---
title: .NET isolated process guide for .NET 5.0 in Azure Functions
description: Learn how to use a .NET isolated process to run your C# functions on .NET 5.0 out-of-process in Azure.  

ms.service: azure-functions
ms.topic: conceptual 
ms.date: 03/01/2021
ms.custom: template-concept 
#Customer intent: As a developer, I need to know how to create functions that run in an isolated process so that I can run my function code on current (not LTS) releases of .NET.
---

# Guide for running functions on .NET 5.0 in Azure

This article is an introduction to using C# to develop .NET isolated process functions, which run out-of-process in Azure Functions. Running out-of-process lets you decouple your function code from the Azure Functions runtime. It also provides a way for you to create and run functions that target the current .NET 5.0 release. 

| Getting started | Concepts| Samples |
|--|--|--| 
| <ul><li>[Using Visual Studio Code](dotnet-isolated-process-developer-howtos.md?pivots=development-environment-vscode)</li><li>[Using command line tools](dotnet-isolated-process-developer-howtos.md?pivots=development-environment-cli)</li><li>[Using Visual Studio](dotnet-isolated-process-developer-howtos.md?pivots=development-environment-vs)</li></ul> | <ul><li>[Hosting options](functions-scale.md)</li><li>[Monitoring](functions-monitoring.md)</li> | <ul><li>[Reference samples](https://github.com/Azure/azure-functions-dotnet-worker/tree/main/samples)</li></ul> |

If you don't need to support .NET 5.0 or run your functions out-of-process, you might want to instead [develop C# class library functions](functions-dotnet-class-library.md).

## Why .NET isolated process?

Previously Azure Functions has only supported a tightly integrated mode for .NET functions, which run [as a class library](functions-dotnet-class-library.md) in the same process as the host. This mode provides deep integration between the host process and the functions. For example, .NET class library functions can share binding APIs and types. However, this integration also requires a tighter coupling between the host process and the .NET function. For example, .NET functions running in-process are required to run on the same version of .NET as the Functions runtime. To enable you to run outside these constraints, you can now choose to run in an isolated process. This process isolation also lets you develop functions that use current .NET releases (such as .NET 5.0), not natively supported by the Functions runtime.

Because these functions run in a separate process, there are some [feature and functionality differences](#differences-with-net-class-library-functions) between .NET isolated function apps and .NET class library function apps.

### Benefits of running out-of-process

When running out-of-process, your .NET functions can take advantage of the following benefits: 

+ Fewer conflicts: because the functions run in a separate process, assemblies used in your app won't conflict with different version of the same assemblies used by the host process.  
+ Full control of the process: you control the start-up of the app and can control the configurations used and the middleware started.
+ Dependency injection: because you have full control of the process, you can use current .NET behaviors for dependency injection and incorporating middleware into your function app. 

## Supported versions

The only version of .NET that is currently supported to run out-of-process is .NET 5.0.

## .NET isolated project

A .NET isolated function project is basically a .NET console app project that targets .NET 5.0. The following are the basic files required in any .NET isolated project:

+ [host.json](functions-host-json.md) file.
+ [local.settings.json](functions-run-local.md#local-settings-file) file.
+ C# project file (.csproj) that defines the project and dependencies.
+ Program.cs file that's the entry point for the app.

## Package references

When running out-of-process, your .NET project uses a unique set of packages, which implement both core functionality and binding extensions. 

### Core packages 

The following packages are required to run your .NET functions in an isolated process:

+ [Microsoft.Azure.Functions.Worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker/)
+ [Microsoft.Azure.Functions.Worker.Sdk](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk/)

### Extension packages

Because functions that run in a .NET isolated process use different binding types, they require a unique set of binding extension packages. 

You'll find these extension packages under [Microsoft.Azure.Functions.Worker.Extensions](https://www.nuget.org/packages?q=Microsoft.Azure.Functions.Worker.Extensions).

## Start-up and configuration 

When using .NET isolated functions, you have access to the start-up of your function app, which is usually in Program.cs. You're responsible for creating and starting your own host instance. As such, you also have direct access to the configuration pipeline for your app. When running out-of-process, you can much more easily add configurations, inject dependencies, and run your own middleware. 

The following code shows an example of a [HostBuilder] pipeline:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/FunctionApp/Program.cs" id="docsnippet_startup":::

This code requires `using Microsoft.Extensions.DependencyInjection;`. 

A [HostBuilder] is used to build and return a fully initialized [IHost] instance, which you run asynchronously to start your function app. 

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/FunctionApp/Program.cs" id="docsnippet_host_run":::

### Configuration

The [ConfigureFunctionsWorkerDefaults] method is used to add the settings required for the function app to run out-of-process, which includes the following functionality:

+ Default set of converters.
+ Set the default [JsonSerializerOptions] to ignore casing on property names.
+ Integrate with Azure Functions logging.
+ Output binding middleware and features.
+ Function execution middleware.
+ Default gRPC support. 

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/FunctionApp/Program.cs" id="docsnippet_configure_defaults" :::   

Having access to the host builder pipeline means that you can also set any app-specific configurations during initialization. You can call the [ConfigureAppConfiguration] method on [HostBuilder] one or more times to add the configurations required by your function app. To learn more about app configuration, see [Configuration in ASP.NET Core](/aspnet/core/fundamentals/configuration/?view=aspnetcore-5.0&preserve-view=true). 

These configurations apply to your function app running in a separate process. To make changes to the functions host or trigger and binding configuration, you'll still need to use the [host.json file](functions-host-json.md).   

### Dependency injection

Dependency injection is simplified, compared to .NET class libraries. Rather than having to create a startup class to register services, you just have to call [ConfigureServices] on the host builder and use the extension methods on [IServiceCollection] to inject specific services. 

The following example injects a singleton service dependency:  
 
:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/FunctionApp/Program.cs" id="docsnippet_dependency_injection" :::

This code requires `using Microsoft.Extensions.DependencyInjection;`. To learn more, see [Dependency injection in ASP.NET Core](/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-5.0&preserve-view=true).

### Middleware

.NET isolated also supports middleware registration, again by using a model similar to what exists in ASP.NET. This model gives you the ability to inject logic into the invocation pipeline, and before and after functions execute.

The [ConfigureFunctionsWorkerDefaults] extension method has an overload that lets you register your own middleware, as you can see in the following example.  

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/CustomMiddleware/Program.cs" id="docsnippet_middleware_register" :::

For a more complete example of using custom middleware in your function app, see the [custom middleware reference sample](https://github.com/Azure/azure-functions-dotnet-worker/blob/main/samples/CustomMiddleware).

## Execution context

.NET isolated passes a [FunctionContext] object to your function methods. This object lets you get an [ILogger] instance to write to the logs by calling the [GetLogger] method and supplying a `categoryName` string. To learn more, see [Logging](#logging). 

## Bindings 

Bindings are defined by using attributes on methods, parameters, and return types. A function method is a method with a `Function` attribute and a trigger attribute applied to an input parameter, as shown in the following example:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Queue/QueueFunction.cs" id="docsnippet_queue_trigger" :::

The trigger attribute specifies the trigger type and binds input data to a method parameter. The previous example function is triggered by a queue message, and the queue message is passed to the method in the `myQueueItem` parameter.

The `Function` attribute marks the method as a function entry point. The name must be unique within a project, start with a letter and only contain letters, numbers, `_`, and `-`, up to 127 characters in length. Project templates often create a method named `Run`, but the method name can be any valid C# method name.

Because .NET isolated projects run in a separate worker process, bindings can't take advantage of rich binding classes, such as `ICollector<T>`, `IAsyncCollector<T>`, and `CloudBlockBlob`. There's also no direct support for types inherited from underlying service SDKs, such as [DocumentClient] and [BrokeredMessage]. Instead, bindings rely on strings, arrays, and serializable types, such as plain old class objects (POCOs). 

For HTTP triggers, you must use [HttpRequestData] and [HttpResponseData] to access the request and response data. This is because you  don't have access to the original HTTP request and response objects when running out-of-process.

For a complete set of reference samples for using triggers and bindings when running out-of-process, see the [binding extensions reference sample](https://github.com/Azure/azure-functions-dotnet-worker/blob/main/samples/Extensions). 

### Input bindings

A function can have zero or more input bindings that can pass data to a function. Like triggers, input bindings are defined by applying a binding attribute to an input parameter. When the function executes, the runtime tries to get data specified in the binding. The data being requested is often dependent on information provided by the trigger using binding parameters.  

### Output bindings

To write to an output binding, you must apply an output binding attribute to the function method, which defined how to write to the bound service. The value returned by the method is written to the output binding. For example, the following example writes a string value to a message queue named `functiontesting2` by using an output binding:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Queue/QueueFunction.cs" id="docsnippet_queue_output_binding" :::

### Multiple output bindings

The data written to an output binding is always the return value of the function. If you need to write to more than one output binding, you must create a custom return type. This return type must have the output binding attribute applied to one or more properties of the class. The following example from an HTTP trigger writes to both the HTTP response and a queue output binding:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/MultiOutput/MultiOutput.cs" id="docsnippet_multiple_outputs":::

The response from an HTTP trigger is always considered an output, so a return value attribute isn't required.

### HTTP trigger

HTTP triggers translates the incoming HTTP request message into an [HttpRequestData] object that is passed to the function. This object provides data from the request, including `Headers`, `Cookies`, `Identities`, `URL`, and optional a message `Body`. This object is a representation of the HTTP request object and not the request itself. 

Likewise, the function returns an [HttpResponseData] object, which provides data used to create the HTTP response, including message `StatusCode`, `Headers`, and optionally a message `Body`.  

The following code is an HTTP trigger 

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Http/HttpFunction.cs" id="docsnippet_http_trigger" :::

## Logging

In .NET isolated, you can write to logs by using an [ILogger] instance obtained from a [FunctionContext] object passed to your function. Call the [GetLogger] method, passing a string value that is the name for the category in which the logs are written. The category is usually the name of the specific function from which the logs are written. To learn more about categories, see the [monitoring article](functions-monitoring.md#log-levels-and-categories). 

The following example shows how to get an [ILogger] and write logs inside a function:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Http/HttpFunction.cs" id="docsnippet_logging" ::: 

Use various methods of [ILogger] to write various log levels, such as `LogWarning` or `LogError`. To learn more about log levels, see the [monitoring article](functions-monitoring.md#log-levels-and-categories).

An [ILogger] is also provided when using [dependency injection](#dependency-injection).

## Differences with .NET class library functions

This section describes the current state of the functional and behavioral differences running on .NET 5.0 out-of-process compared to .NET class library functions running in-process:

| Feature/behavior |  In-process (.NET Core 3.1) | Out-of-process (.NET 5.0) |
| ---- | ---- | ---- |
| .NET versions | LTS (.NET Core 3.1) | Current (.NET 5.0) |
| Core packages | [Microsoft.NET.Sdk.Functions](https://www.nuget.org/packages/Microsoft.NET.Sdk.Functions/) | [Microsoft.Azure.Functions.Worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker/)<br/>[Microsoft.Azure.Functions.Worker.Sdk](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk) | 
| Binding extension packages | [Microsoft.Azure.WebJobs.Extensions.*](https://www.nuget.org/packages?q=Microsoft.Azure.WebJobs.Extensions)  | Under [Microsoft.Azure.Functions.Worker.Extensions.*](https://www.nuget.org/packages?q=Microsoft.Azure.Functions.Worker.Extensions) | 
| Logging | [ILogger] passed to the function | [ILogger] obtained from [FunctionContext] |
| Cancellation tokens | [Supported](functions-dotnet-class-library.md#cancellation-tokens) | Not supported |
| Output bindings | Out parameters | Return values |
| Output binding types |  `IAsyncCollector`, [DocumentClient], [BrokeredMessage], and other client-specific types | Simple types, JSON serializable types, and arrays. |
| Multiple output bindings | Supported | [Supported](#multiple-output-bindings) |
| HTTP trigger | [HttpRequest]/[ObjectResult] | [HttpRequestData]/[HttpResponseData] |
| Durable Functions | [Supported](durable/durable-functions-overview.md) | Not supported | 
| Imperative bindings | [Supported](functions-dotnet-class-library.md#binding-at-runtime) | Not supported |
| function.json artifact | Generated | Not generated |
| Configuration | [host.json](functions-host-json.md) | [host.json](functions-host-json.md) and custom initialization |
| Dependency injection | [Supported](functions-dotnet-dependency-injection.md)  | [Supported](#dependency-injection) |
| Middleware | Not supported | Supported |
| Cold start times | Typical | Longer, because of just-in-time start-up. Run on Linux instead of Windows to reduce potential delays. |
| ReadyToRun | [Supported](functions-dotnet-class-library.md#readytorun) | _TBD_ |

## Known issues

For information on workarounds to know issues running .NET isolated process functions, see [this known issues page](https://aka.ms/AAbh18e). To report problems, [create an issue in this GitHub repository](https://github.com/Azure/azure-functions-dotnet-worker/issues/new/choose).  

## Next steps

+ [Learn more about triggers and bindings](functions-triggers-bindings.md)
+ [Learn more about best practices for Azure Functions](functions-best-practices.md)


[HostBuilder]: /dotnet/api/microsoft.extensions.hosting.hostbuilder?view=dotnet-plat-ext-5.0&preserve-view=true
[IHost]: /dotnet/api/microsoft.extensions.hosting.ihost?view=dotnet-plat-ext-5.0&preserve-view=true
[ConfigureFunctionsWorkerDefaults]: /dotnet/api/microsoft.extensions.hosting.workerhostbuilderextensions.configurefunctionsworkerdefaults?view=azure-dotnet&preserve-view=true#Microsoft_Extensions_Hosting_WorkerHostBuilderExtensions_ConfigureFunctionsWorkerDefaults_Microsoft_Extensions_Hosting_IHostBuilder_
[ConfigureAppConfiguration]: /dotnet/api/microsoft.extensions.hosting.hostbuilder.configureappconfiguration?view=dotnet-plat-ext-5.0&preserve-view=true
[IServiceCollection]: /dotnet/api/microsoft.extensions.dependencyinjection.iservicecollection?view=dotnet-plat-ext-5.0&preserve-view=true
[ConfigureServices]: /dotnet/api/microsoft.extensions.hosting.hostbuilder.configureservices?view=dotnet-plat-ext-5.0&preserve-view=true
[FunctionContext]: /dotnet/api/microsoft.azure.functions.worker.functioncontext?view=azure-dotnet&preserve-view=true
[ILogger]: /dotnet/api/microsoft.extensions.logging.ilogger?view=dotnet-plat-ext-5.0&preserve-view=true
[GetLogger]: /dotnet/api/microsoft.azure.functions.worker.functioncontextloggerextensions.getlogger?view=azure-dotnet&preserve-view=true
[DocumentClient]: /dotnet/api/microsoft.azure.documents.client.documentclient
[BrokeredMessage]: /dotnet/api/microsoft.servicebus.messaging.brokeredmessage
[HttpRequestData]: /dotnet/api/microsoft.azure.functions.worker.http.httprequestdata?view=azure-dotnet&preserve-view=true
[HttpResponseData]: /dotnet/api/microsoft.azure.functions.worker.http.httpresponsedata?view=azure-dotnet&preserve-view=true
[HttpRequest]: /dotnet/api/microsoft.aspnetcore.http.httprequest?view=aspnetcore-5.0&preserve-view=true
[ObjectResult]: /dotnet/api/microsoft.aspnetcore.mvc.objectresult?view=aspnetcore-5.0&preserve-view=true
[JsonSerializerOptions]: /dotnet/api/system.text.json.jsonserializeroptions?view=net-5.0&preserve-view=true
