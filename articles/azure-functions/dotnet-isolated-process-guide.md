---
title: Guide for running C# Azure Functions in an isolated worker process
description: Learn how to use a .NET isolated worker process to run your C# functions in Azure, which supports non-LTS versions of .NET and .NET Framework apps.  

ms.service: azure-functions
ms.topic: conceptual 
ms.date: 09/29/2022
ms.custom: template-concept 
recommendations: false
#Customer intent: As a developer, I need to know how to create functions that run in an isolated worker process so that I can run my function code on current (not LTS) releases of .NET.
---

# Guide for running C# Azure Functions in an isolated worker process

This article is an introduction to using C# to develop .NET isolated worker process functions, which runs Azure Functions in an isolated worker process. This allows you to decouple your function code from the Azure Functions runtime, check out [supported version](#supported-versions) for Azure functions in an isolated worker process. [In-process C# class library functions](functions-dotnet-class-library.md) aren't supported on .NET 7.0. 

| Getting started | Concepts| Samples |
|--|--|--| 
| <ul><li>[Using Visual Studio Code](create-first-function-vs-code-csharp.md?tabs=isolated-process)</li><li>[Using command line tools](create-first-function-cli-csharp.md?tabs=isolated-process)</li><li>[Using Visual Studio](functions-create-your-first-function-visual-studio.md?tabs=isolated-process)</li></ul> | <ul><li>[Hosting options](functions-scale.md)</li><li>[Monitoring](functions-monitoring.md)</li> | <ul><li>[Reference samples](https://github.com/Azure/azure-functions-dotnet-worker/tree/main/samples)</li></ul> |

## Why .NET isolated worker process?

Previously Azure Functions has only supported a tightly integrated mode for .NET functions, which run [as a class library](functions-dotnet-class-library.md) in the same process as the host. This mode provides deep integration between the host process and the functions. For example, .NET class library functions can share binding APIs and types. However, this integration also requires a tighter coupling between the host process and the .NET function. For example, .NET functions running in-process are required to run on the same version of .NET as the Functions runtime. To enable you to run outside these constraints, you can now choose to run in an isolated worker process. This process isolation also lets you develop functions that use current .NET releases (such as .NET 7.0), not natively supported by the Functions runtime. Both isolated worker process and in-process C# class library functions run on .NET 6.0. To learn more, see [Supported versions](#supported-versions). 

Because these functions run in a separate process, there are some [feature and functionality differences](#differences-with-net-class-library-functions) between .NET isolated function apps and .NET class library function apps.

### Benefits of running out-of-process

When your .NET functions run out-of-process, you can take advantage of the following benefits: 

+ Fewer conflicts: because the functions run in a separate process, assemblies used in your app won't conflict with different version of the same assemblies used by the host process.  
+ Full control of the process: you control the start-up of the app and can control the configurations used and the middleware started.
+ Dependency injection: because you have full control of the process, you can use current .NET behaviors for dependency injection and incorporating middleware into your function app. 

[!INCLUDE [functions-dotnet-supported-versions](../../includes/functions-dotnet-supported-versions.md)]

## .NET isolated project

A .NET isolated function project is basically a .NET console app project that targets a supported .NET runtime. The following are the basic files required in any .NET isolated project:

+ [host.json](functions-host-json.md) file.
+ [local.settings.json](functions-develop-local.md#local-settings-file) file.
+ C# project file (.csproj) that defines the project and dependencies.
+ Program.cs file that's the entry point for the app.
+ Any code files [defining your functions](#bindings).
 
For complete examples, see the [.NET 6 isolated sample project](https://github.com/Azure/azure-functions-dotnet-worker/tree/main/samples/FunctionApp) and the [.NET Framework 4.8 isolated sample project](https://github.com/Azure/azure-functions-dotnet-worker/tree/main/samples/NetFxWorker).

> [!NOTE]
> To be able to publish your isolated function project to either a Windows or a Linux function app in Azure, you must set a value of `dotnet-isolated` in the remote [FUNCTIONS_WORKER_RUNTIME](functions-app-settings.md#functions_worker_runtime) application setting. To support [zip deployment](deployment-zip-push.md) and [running from the deployment package](run-functions-from-deployment-package.md) on Linux, you also need to update the `linuxFxVersion` site config setting to `DOTNET-ISOLATED|7.0`. To learn more, see [Manual version updates on Linux](set-runtime-version.md#manual-version-updates-on-linux). 

## Package references

When your functions run out-of-process, your .NET project uses a unique set of packages, which implement both core functionality and binding extensions. 

### Core packages 

The following packages are required to run your .NET functions in an isolated worker process:

+ [Microsoft.Azure.Functions.Worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker/)
+ [Microsoft.Azure.Functions.Worker.Sdk](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk/)

### Extension packages

Because functions that run in a .NET isolated worker process use different binding types, they require a unique set of binding extension packages. 

You'll find these extension packages under [Microsoft.Azure.Functions.Worker.Extensions](https://www.nuget.org/packages?q=Microsoft.Azure.Functions.Worker.Extensions).

## Start-up and configuration 

When using .NET isolated functions, you have access to the start-up of your function app, which is usually in Program.cs. You're responsible for creating and starting your own host instance. As such, you also have direct access to the configuration pipeline for your app. When you run your functions out-of-process, you can much more easily add configurations, inject dependencies, and run your own middleware. 

The following code shows an example of a [HostBuilder] pipeline:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/FunctionApp/Program.cs" id="docsnippet_startup":::

This code requires `using Microsoft.Extensions.DependencyInjection;`. 

A [HostBuilder] is used to build and return a fully initialized [IHost] instance, which you run asynchronously to start your function app. 

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/FunctionApp/Program.cs" id="docsnippet_host_run":::

> [!IMPORTANT]
> If your project targets .NET Framework 4.8, you also need to add `FunctionsDebugger.Enable();` before creating the HostBuilder. It should be the first line of your `Main()` method. See [Debugging when targeting .NET Framework](#debugging-when-targeting-net-framework) for more information.

### Configuration

The [ConfigureFunctionsWorkerDefaults] method is used to add the settings required for the function app to run in an isolated worker process, which includes the following functionality:

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

 The `UseWhen` extension method can be used to register a middleware which gets executed conditionally. A predicate which returns a boolean value needs to be passed to this method and the middleware will be participating in the invocation processing pipeline if the return value of the predicate is true.

The following extension methods on [FunctionContext] make it easier to work with middleware in the isolated model.

| Method | Description |
| ---- | ---- |
| **`GetHttpRequestDataAsync`** | Gets the `HttpRequestData` instance when called by an HTTP trigger. This method returns an instance of `ValueTask<HttpRequestData?>`, which is useful when you want to read message data, such as request headers and cookies. |
| **`GetHttpResponseData`** | Gets the `HttpResponseData` instance when called by an HTTP trigger. |
|  **`GetInvocationResult`** | Gets an instance of `InvocationResult`, which represents the result of the current function execution. Use the `Value` property to get or set the value as needed. |
|  **` GetOutputBindings`** | Gets the output binding entries for the current function execution. Each entry in the result of this method is of type `OutputBindingData`. You can use the `Value` property to get or set the value as needed. | 
|  **` BindInputAsync`** | Binds an input binding item for the requested `BindingMetadata` instance. For example, you can use this method when you have a function with a `BlobInput` input binding that needs to be accessed or updated by your middleware. |

The following is an example of a middleware implementation which reads the `HttpRequestData` instance and updates the `HttpResponseData` instance during function execution. This middleware checks for the presence of a specific request header(x-correlationId), and when present uses the header value to stamp a response header. Otherwise, it generates a new GUID value and uses that for stamping the response header.
 
:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/CustomMiddleware/StampHttpHeaderMiddleware.cs" id="docsnippet_middleware_example_stampheader" :::
 
For a more complete example of using custom middleware in your function app, see the [custom middleware reference sample](https://github.com/Azure/azure-functions-dotnet-worker/blob/main/samples/CustomMiddleware).

## Cancellation tokens

A function can accept a [CancellationToken](/dotnet/api/system.threading.cancellationtoken) parameter, which enables the operating system to notify your code when the function is about to be terminated. You can use this notification to make sure the function doesn't terminate unexpectedly in a way that leaves data in an inconsistent state.

Cancellation tokens are supported in .NET functions when running in an isolated worker process. The following example raises an exception when a cancellation request has been received:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Net7Worker/EventHubCancellationToken.cs" id="docsnippet_cancellation_token_throw":::
 
The following example performs clean-up actions if a cancellation request has been received:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Net7Worker/EventHubCancellationToken.cs" id="docsnippet_cancellation_token_cleanup":::

## ReadyToRun

You can compile your function app as [ReadyToRun binaries](/dotnet/core/deploying/ready-to-run). ReadyToRun is a form of ahead-of-time compilation that can improve startup performance to help reduce the impact of [cold-start](event-driven-scaling.md#cold-start) when running in a [Consumption plan](consumption-plan.md).

ReadyToRun is available in .NET 3.1, .NET 6 (both in-process and isolated worker process), and .NET 7, and it requires [version 3.0 or later](functions-versions.md) of the Azure Functions runtime.

To compile your project as ReadyToRun, update your project file by adding the `<PublishReadyToRun>` and `<RuntimeIdentifier>` elements. The following is the configuration for publishing to a Windows 32-bit function app.

```xml
<PropertyGroup>
  <TargetFramework>net6.0</TargetFramework>
  <AzureFunctionsVersion>v4</AzureFunctionsVersion>
  <RuntimeIdentifier>win-x86</RuntimeIdentifier>
  <PublishReadyToRun>true</PublishReadyToRun>
</PropertyGroup>
```

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

To write to an output binding, you must apply an output binding attribute to the function method, which defined how to write to the bound service. The value returned by the method is written to the output binding. For example, the following example writes a string value to a message queue named `myqueue-output` by using an output binding:

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

## Debugging when targeting .NET Framework

If your isolated project targets .NET Framework 4.8, the current preview scope requires manual steps to enable debugging. These steps are not required if using another target framework.

Your app should start with a call to `FunctionsDebugger.Enable();` as its first operation. This occurs in the `Main()` method before initializing a HostBuilder. Your `Program.cs` file should look similar to the following:

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

Next, you need to manually attach to the process using a .NET Framework debugger. Visual Studio doesn't do this automatically for isolated worker process .NET Framework apps yet, and the "Start Debugging" operation should be avoided.

In your project directory (or its build output directory), run:

```azurecli
func host start --dotnet-isolated-debug
```

This will start your worker, and the process will stop with the following message:

```azurecli
Azure Functions .NET Worker (PID: <process id>) initialized in debug mode. Waiting for debugger to attach...
```

Where `<process id>` is the ID for your worker process. You can now use Visual Studio to manually attach to the process. For instructions on this operation, see [How to attach to a running process](/visualstudio/debugger/attach-to-running-processes-with-the-visual-studio-debugger#BKMK_Attach_to_a_running_process).

Once the debugger is attached, the process execution will resume and you will be able to debug.

## Differences with .NET class library functions

This section describes the current state of the functional and behavioral differences running on out-of-process compared to .NET class library functions running in-process:

| Feature/behavior |  In-process | Out-of-process  |
| ---- | ---- | ---- |
| .NET versions | .NET Core 3.1<br/>.NET 6.0 | .NET 6.0<br/>.NET 7.0 (Preview)<br/>.NET Framework 4.8 (GA) |
| Core packages | [Microsoft.NET.Sdk.Functions](https://www.nuget.org/packages/Microsoft.NET.Sdk.Functions/) | [Microsoft.Azure.Functions.Worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker/)<br/>[Microsoft.Azure.Functions.Worker.Sdk](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk) | 
| Binding extension packages | [Microsoft.Azure.WebJobs.Extensions.*](https://www.nuget.org/packages?q=Microsoft.Azure.WebJobs.Extensions)  | [Microsoft.Azure.Functions.Worker.Extensions.*](https://www.nuget.org/packages?q=Microsoft.Azure.Functions.Worker.Extensions) | 
| Durable Functions | [Supported](durable/durable-functions-overview.md) | [Supported (public preview)](https://github.com/microsoft/durabletask-dotnet#usage-with-azure-functions) | 
| Model types exposed by bindings | Simple types<br/>JSON serializable types<br/>Arrays/enumerations<br/>Service SDK types such as [BlobClient]<br/>`IAsyncCollector` (for output bindings) | Simple types<br/>JSON serializable types<br/>Arrays/enumerations |
| HTTP trigger model types| [HttpRequest]/[ObjectResult] | [HttpRequestData]/[HttpResponseData] |
| Output binding interaction | Return values (single output only)<br/>`out` parameters<br/>`IAsyncCollector` | Return values (expanded model with single or [multiple outputs](#multiple-output-bindings)) |
| Imperative bindings<sup>1</sup>  | [Supported](functions-dotnet-class-library.md#binding-at-runtime) | Not supported |
| Dependency injection | [Supported](functions-dotnet-dependency-injection.md)  | [Supported](#dependency-injection) |
| Middleware | Not supported | [Supported](#middleware) |
| Logging | [ILogger] passed to the function<br/>[ILogger&lt;T&gt;] via dependency injection | [ILogger]/[ILogger&lt;T&gt;] obtained from [FunctionContext] or via [dependency injection](#dependency-injection)|
| Application Insights dependencies | [Supported](functions-monitoring.md#dependencies) | [Supported (public preview)](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.ApplicationInsights) |
| Cancellation tokens | [Supported](functions-dotnet-class-library.md#cancellation-tokens) | [Supported](#cancellation-tokens) |
| Cold start times<sup>2</sup> | (Baseline) | Additionally includes process launch |
| ReadyToRun | [Supported](functions-dotnet-class-library.md#readytorun) | [Supported](#readytorun) | 

<sup>1</sup> When you need to interact with a service using parameters determined at runtime, using the corresponding service SDKs directly is recommended over using imperative bindings. The SDKs are less verbose, cover more scenarios, and have advantages for error handling and debugging purposes. This recommendation applies to both models.

<sup>2</sup> Cold start times may be additionally impacted on Windows when using some preview versions of .NET due to just-in-time loading of preview frameworks. This applies to both the in-process and out-of-process models but may be particularly noticeable if comparing across different versions. This delay for preview versions is not present on Linux plans.

## Remote Debugging using Visual Studio

Because your isolated worker process app runs outside the Functions runtime, you need to attach the remote debugger to a separate process. To learn more about debugging using Visual Studio, see [Remote Debugging](functions-develop-vs.md?tabs=isolated-process#remote-debugging).
## Next steps

+ [Learn more about triggers and bindings](functions-triggers-bindings.md)
+ [Learn more about best practices for Azure Functions](functions-best-practices.md)


[HostBuilder]: /dotnet/api/microsoft.extensions.hosting.hostbuilder
[IHost]: /dotnet/api/microsoft.extensions.hosting.ihost
[ConfigureFunctionsWorkerDefaults]: /dotnet/api/microsoft.extensions.hosting.workerhostbuilderextensions.configurefunctionsworkerdefaults?view=azure-dotnet&preserve-view=true#Microsoft_Extensions_Hosting_WorkerHostBuilderExtensions_ConfigureFunctionsWorkerDefaults_Microsoft_Extensions_Hosting_IHostBuilder_
[ConfigureAppConfiguration]: /dotnet/api/microsoft.extensions.hosting.hostbuilder.configureappconfiguration
[IServiceCollection]: /dotnet/api/microsoft.extensions.dependencyinjection.iservicecollection
[ConfigureServices]: /dotnet/api/microsoft.extensions.hosting.hostbuilder.configureservices
[FunctionContext]: /dotnet/api/microsoft.azure.functions.worker.functioncontext?view=azure-dotnet&preserve-view=true
[ILogger]: /dotnet/api/microsoft.extensions.logging.ilogger
[ILogger&lt;T&gt;]: /dotnet/api/microsoft.extensions.logging.ilogger-1
[GetLogger]: /dotnet/api/microsoft.azure.functions.worker.functioncontextloggerextensions.getlogger?view=azure-dotnet&preserve-view=true
[BlobClient]: /dotnet/api/azure.storage.blobs.blobclient?view=azure-dotnet&preserve-view=true
[DocumentClient]: /dotnet/api/microsoft.azure.documents.client.documentclient
[BrokeredMessage]: /dotnet/api/microsoft.servicebus.messaging.brokeredmessage
[HttpRequestData]: /dotnet/api/microsoft.azure.functions.worker.http.httprequestdata?view=azure-dotnet&preserve-view=true
[HttpResponseData]: /dotnet/api/microsoft.azure.functions.worker.http.httpresponsedata?view=azure-dotnet&preserve-view=true
[HttpRequest]: /dotnet/api/microsoft.aspnetcore.http.httprequest
[ObjectResult]: /dotnet/api/microsoft.aspnetcore.mvc.objectresult
[JsonSerializerOptions]: /dotnet/api/system.text.json.jsonserializeroptions
