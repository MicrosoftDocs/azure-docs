---
title: .NET isolated guide for .NET 5.0 in Azure Functions
description: Learn how to run .NET class library functions, such as functions that run on .NET 5.0, out-of-process in Azure Functions.  

ms.service: azure-functions
ms.topic: conceptual 
ms.date: 02/06/2021
ms.custom: template-concept 
---

# Guide for running functions on .NET 5.0 in Azure

_.NET 5.0 support is currently in preview._

This article is an introduction to using C# to develop .NET isolated functions, which run out-of-process in Azure Functions. Running out-of-process provides a way for you to create and run functions that target the current .NET 5.0 release. 

## Why .NET isolated

The Azure Functions runtime is basically an ASP.NET application, which offers deep integration between the runtime and [.NET class library functions](functions-dotnet-class-library.md). As a result of this integration, significant investment is required when supporting new versions of .NET. Because of the importance of .NET to Microsoft and Azure, Functions needs to be able to support all current versions of .NET, both Long Term Support (LTS) versions (such as .NET Core 3.1) and current releases (such as .NET 5.0). You can learn more about .NET version support on the [.NET support policy page](https://dotnet.microsoft.com/platform/support/policy). For more information about .NET versions supported as in-process apps, see [Runtime version](functions-dotnet-class-library.md#runtime-version) in the .NET class library guide. 

Running .NET isolated functions out-of-process lets Functions support both current releases of .NET and LTS releases. This solution is an interim one to developing and running functions developed using the latest versions of .NET in the current .NET support model. In the short term, there are some [feature and functionality differences](#differences-with-net-class-libraries) between .NET isolated function apps and .NET class library function apps, run in-process with the runtime. 

.NET isolated uses an ou-of-process .NET worker process when running your .NET functions. This is the same basic architecture used by the other non-.NET languages supported by Functions. 

### Benefits of running out-of-process

When running out of process, .NET isolated functions don't have access to the kind of deep integration as when being loaded as class libraries by the main process. This isolation has particular effects on logging, HTTP messaging, and binding return types. However, there are benefits for .NET isolated to being able to run out-of-process, which include the following:

+ Run on .NET 5.0: the main benefit is being able to run on .NET 5.0 and using the latest version of .NET.
+ Fewer conflicts: because the functions run in a separate process, assemblies used in your app won't conflict with different version of the same assemblies used by the host process.   
+ Full control of the process: you control the start-up of the app and can control the configurations used and the middleware started.
+ Dependency injection: because you have full control of the process, you can use .NET Core behaviors for dependency injection and incorporating middleware into your function app. 

## Prerequisites 

You must have the following software installed on your local computer to be able to create and deploy functions that use .NET 5.0.

* [.NET 5.x](https://dotnet.microsoft.com/download/dotnet/5.0) (5.1 recommended)

* [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools) version 3.0.3160, or a later version.

## Supported versions

The only version of .NET that is currently supported to run out-of-process is .NET 5.0.

## .NET isolated project

A .NET isolated function project is basically a .NET console app project that targets .NET 5.0. The basic files required in any .NET isolated project are the following:

+ [host.json](functions-host-json.md) file.
+ [local.settings.json](functions-run-local.md#local-settings-file) file.
+ C# project file (.csproj) that defines the project and dependencies.
+ Program.cs file that's the entry point for the app.

## Package references

The .NET isolated worker process requires a separate set of packages from regular .NET functions. You'll also need to add any binding extension packages to your project.

Add the following packages to your project:

+ [Microsoft.Azure.Functions.Worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker/)

+ 
+ 

## Start-up and configuration 

When using .NET isolated functions, you have access to the start-up of your function app, which is usually in program.cs. Because you are responsible for creating and starting your own host instance, you have direct access to the configuration pipeline and can much more easily inject dependencies and run middleware. 

The following code shows an example of a HostBuilder pipeline:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/FunctionApp/Program.cs" range="20-33":::

A `HostBuilder` is used to build and return a fully initialized `IHost` instance, which you run asynchronously to start your function app. 

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/FunctionApp/Program.cs" range="35":::

### Configuration

Configuration for Functions-specific behaviors is still done by using the [host.json file](functions-host-json.md). However, having access to the host builder pipeline means that you can set any app-specific configurations during initialization. 

The following example shows how to add configuration `args` read from the command line: 
 
:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/FunctionApp/Program.cs" range="21-24" :::

The `ConfigureAppConfiguration` method is used to configure the rest of the build process and application. This example also uses an [IConfigurationBuilder](/dotnet/api/microsoft.extensions.configuration.iconfigurationbuilder?view=dotnet-plat-ext-5.0), which makes it easier to add multiple configuration items. Because `ConfigureAppConfiguration` returns the same instance of [`IConfiguration `](/dotnet/api/microsoft.extensions.configuration.iconfiguration?view=dotnet-plat-ext-5.0), you can also just call it multiple times to add multiple configuration items. You can access the full set of configurations from both [`HostBuilderContext.Configuration`](/dotnet/api/microsoft.extensions.hosting.hostbuildercontext.configuration?view=dotnet-plat-ext-5.0) and [`IHost.Services`](/dotnet/api/microsoft.extensions.hosting.ihost.services?view=dotnet-plat-ext-5.0).

To learn more about configuration, see [Configuration in ASP.NET Core](/aspnet/core/fundamentals/configuration/?view=aspnetcore-5.0). 

### Dependency injection

Dependency injection is simplified, compared .NET class libraries. Rather than having to create a startup class to register services, you just have to call `ConfigureServices` on the host builder and use the extension methods on [`IServiceCollection`](/dotnet/api/microsoft.extensions.dependencyinjection.iservicecollection?view=dotnet-plat-ext-5.0) to inject specific services. 

The following example injects a singleton service dependency:  
 
:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/FunctionApp/Program.cs" range="29-32" :::

To learn more, see [Dependency injection in ASP.NET Core](aspnet/core/fundamentals/dependency-injection?view=aspnetcore-5.0).

### Middleware

.NET isolated also supports middleware registration, again by using a model similar to what exists in ASP.NET. This gives you the ability to inject logic into the invocation pipeline, pre- and post-function executions.

While the full middleware registration set of APIs is not yet exposed, middleware registration is supported and we've added an example to the sample application under the Middleware folder.

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/FunctionApp/Program.cs" range="25-28" :::

To learn more, see [ASP.NET Core middleware](/aspnet/core/fundamentals/middleware/?view=aspnetcore-5.0).

## Execution context

.NET isolated passes a `FunctionContext` object to your function methods. This object lets you get an [`ILogger`](/dotnet/api/microsoft.extensions.logging.ilogger?view=dotnet-plat-ext-5.0) instance to write to the logs by calling the `GetLogger` method and supplying a `categoryName` string. To learn more, see [Logging](#logging).

## Bindings 

Bindings are defined by using attributes on methods, parameters, and return types. A function method is a static method with a `Function` and a trigger attribute applied to an input parameter, as shown in the following example:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/SampleApp/Queue/QueueFunction.cs" range="13-16" :::

The trigger attribute specifies the trigger type and binds input data to a method parameter. The previous example function is triggered by a queue message, and the queue message is passed to the method in the `myQueueItem` parameter.

The `Function` attribute marks the method as a function entry point. The name must be unique within a project, start with a letter and only contain letters, numbers, `_`, and `-`, up to 127 characters in length. Project templates often create a method named `Run`, but the method name can be any valid C# method name.

Because .NET isolated projects run in a separate worker process, bindings can't take advantage of rich binding classes, such as `ICollector<T>`, `IAsyncCollector<T>`, and `CloudBlockBlob`. There's also no direct support for types inherited from underlying service SDKs, such as [DocumentClient](/dotnet/api/microsoft.azure.documents.client.documentclient?view=azure-dotnet) and [BrokeredMessage](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage?view=azure-dotnet). Instead, bindings rely on strings, arrays, and serializable types, such as POCO objects. 

For HTTP triggers, you also don't have access to the original HTTP request and response objects. 

### Input bindings

In addition to the trigger, a function can have zero or more other input bindings. Like triggers, input bindings are defined by applying a binding attribute to an input parameter. When the function executes, the runtime tries to get data specified in the binding. The data being requested is often dependent on information provided by the trigger using binding parameters.  

### Output bindings

To write to an output binding, you must apply an output binding attribute to the function method, which defined how to write to the bound service. The value returned by the method is written to the output binding. For example, the following example writes a string value to a message queue named `functiontesting2` by using an output binding:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/SampleApp/Queue/QueueFunction.cs" range="13-23" :::

### Multiple output bindings

The data written to an output binding is always the return value of the function. If you need to write to more than one output binding, you must create a custom return type. This return type must have the output binding attribute applied to one or more properties of the class. The following example writes to both an HTTP response and a queue output binding:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/FunctionApp/Function1/Function1.cs" range="18-53" :::

### HTTP trigger

HTTP triggers translates the incoming HTTP request message into an `HttpRequestData` object that is passed to the function. This object provides data from the request, including `Headers`, `Cookies`, `Identities`, `URL`, and optional a message `Body`. This object is a representation of the HTTP request object and not the request itself. 

Likewise, the function returns an `HttpReponseData` object, which provides data used to create the HTTP response, including message `StatusCode`, `Headers`, and optionally a message `Body`.  

The following code is an HTTP trigger 

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/SampleApp/Http/HttpFunction.cs" range="15-30" :::

## Logging

In .NET isolated, you can write to logs by using an [`ILogger`](/dotnet/api/microsoft.extensions.logging.ilogger?view=dotnet-plat-ext-5.0) instance obtained from a `FunctionContext` object passed to your function. Call the `GetLogger` method, passing a string value that is the name for the category in which the logs are written. The category is usually the name of the specific function from which the logs are written. To learn more about categories, see the [monitoring article](functions-monitoring.md#log-levels-and-categories). 

The following example shows how to get an `ILogger` and write logs inside a function:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/SampleApp/Http/HttpFunction.cs" range="19-20" ::: 

Use various method of `ILogger` to write various log levels, such as `LogWarning` or `LogError`. To learn more about log levels, see the [monitoring article](functions-monitoring.md#log-levels-and-categories).

## Differences with .NET class library functions

This section described the functional and behavioral differences running on .NET 5.0 out-of-process compared to .NET class library functions running in process:

| Feature/behavior |  In-process (.NET Core 3.1) | Out-of-process (.NET 5.0) |
| ---- | ---- | ---- |
| .NET versions | LTS (.NET Core 3.1) | Current (.NET 5.0) |
| Core packages | [Microsoft.NET.Sdk.Functions](https://www.nuget.org/packages/Microsoft.NET.Sdk.Functions/) | [Microsoft.Azure.Functions.Worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker/)<br/>[Microsoft.Azure.Functions.Worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk) | 
| Binding extension packages | [`Microsoft.Azure.WebJobs.Extensions.*`](https://www.nuget.org/packages?q=Microsoft.Azure.WebJobs.Extensions)  | Under [`Microsoft.Azure.Functions.Worker.Extensions.*`](https://www.nuget.org/packages?q=Microsoft.Azure.Functions.Worker.Extensions) | 
| Logging | [`ILogger`](/dotnet/api/microsoft.extensions.logging.ilogger?view=dotnet-plat-ext-5.0) passed to the function | [`ILogger`](/dotnet/api/microsoft.extensions.logging.ilogger?view=dotnet-plat-ext-5.0) obtained from `FunctionContext` |
| Cancellation tokens | [Supported](functions-dotnet-class-library.md#cancellation-tokens) | Not supported |
| Output bindings | Out parameters | Return values |
| Output binding types |  `IAsyncCollector`, [DocumentClient](/dotnet/api/microsoft.azure.documents.client.documentclient?view=azure-dotnet), [BrokeredMessage](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage?view=azure-dotnet), and other client-specific types | Simple types, JSON serializable types, and arrays. |
| Multiple output bindings | Supported | [Supported](#multiple-output-bindings) |
| HTTP trigger | [`HttpRequest`](/dotnet/api/microsoft.aspnetcore.http.httprequest?view=aspnetcore-5.0)/[`ObjectResult`](/dotnet/api/microsoft.aspnetcore.mvc.objectresult?view=aspnetcore-5.0) | `HttpRequestData`/`HttpResponseData` |
| Durable Functions | [Supported](durable/durable-functions-overview.md) | Not supported | 
| Imperative bindings | [Supported](functions-dotnet-class-library.md#binding-at-runtime) | Not supported |
| function.json artifact | Generated | Not generated |
| Configuration | [host.json](functions-host-json.md) | [host.json](functions-host-json.md) and [custom initialization](#configuration) |
| Dependency injection | [Supported](functions-dotnet-dependency-injection.md)  | [Supported](#dependency-injection) |
| Middleware | Not supported | [Supported](#middleware) |
| Cold start times | Typical | Longer (due to just-in-time start-up). Run on Linux instead of Windows to reduce potential delays. |
| ReadyToRun | [Supported](functions-dotnet-class-library.md#readytorun) | _TBD_ |


## Next steps

+ [Learn more about triggers and bindings](functions-triggers-bindings.md)
+ [Learn more about best practices for Azure Functions](functions-best-practices.md)

