---
title: Differences between in-process and isolate worker process .NET Azure Functions
description: Compares features and functionality differences between running .NET Functions in-process or as an isolated worker process. 
ms.service: azure-functions
ms.custom: devx-track-dotnet
ms.topic: conceptual 
ms.date: 08/03/2023
recommendations: false
#Customer intent: As a developer, I need to understand the differences between running in-process and running in an isolated worker process so that I can choose the best process model for my functions.
---

# Differences between in-process and isolated worker process .NET Azure Functions

There are two process models for .NET functions:

[!INCLUDE [functions-dotnet-execution-model](../../includes/functions-dotnet-execution-model.md)] 

This article describes the current state of the functional and behavioral differences between the two models. To migrate from the in-process model to the isolated worker model, see [Migrate .NET apps from the in-process model to the isolated worker model][migrate].

## Execution mode comparison table 

Use the following table to compare feature and functional differences between the two models:

| Feature/behavior |  In-process<sup>3</sup> | Isolated worker process  |
| ---- | ---- | ---- |
| [Supported .NET versions](#supported-versions) | Long Term Support (LTS) versions | Long Term Support (LTS) versions,<br/>Standard Term Support (STS) versions,<br/>.NET Framework |
| Core packages | [Microsoft.NET.Sdk.Functions](https://www.nuget.org/packages/Microsoft.NET.Sdk.Functions/) | [Microsoft.Azure.Functions.Worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker/)<br/>[Microsoft.Azure.Functions.Worker.Sdk](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk) | 
| Binding extension packages | [Microsoft.Azure.WebJobs.Extensions.*](https://www.nuget.org/packages?q=Microsoft.Azure.WebJobs.Extensions)  | [Microsoft.Azure.Functions.Worker.Extensions.*](https://www.nuget.org/packages?q=Microsoft.Azure.Functions.Worker.Extensions) | 
| Durable Functions | [Supported](durable/durable-functions-overview.md) | [Supported](durable/durable-functions-isolated-create-first-csharp.md?pivots=code-editor-visualstudio) (Support does not yet include Durable Entities) | 
| Model types exposed by bindings | Simple types<br/>[JSON serializable](/dotnet/api/system.text.json.jsonserializeroptions) types<br/>Arrays/enumerations<br/>Service SDK types<sup>4</sup> | Simple types<br/>JSON serializable types<br/>Arrays/enumerations<br/>[Service SDK types](dotnet-isolated-process-guide.md#sdk-types)<sup>4</sup> |
| HTTP trigger model types| [HttpRequest] / [IActionResult]<sup>5</sup><br/>[HttpRequestMessage] / [HttpResponseMessage] | [HttpRequestData] / [HttpResponseData]<br/>[HttpRequest] / [IActionResult] (as a [public preview extension][aspnetcore-integration])<sup>5</sup>|
| Output binding interactions | Return values (single output only),<br/>`out` parameters,<br/>`IAsyncCollector` | Return values in an expanded model with:<br/> - single or [multiple outputs](dotnet-isolated-process-guide.md#multiple-output-bindings)<br/> - arrays of outputs|
| Imperative bindings<sup>1</sup>  | [Supported](functions-dotnet-class-library.md#binding-at-runtime) | Not supported |
| Dependency injection | [Supported](functions-dotnet-dependency-injection.md)  | [Supported](dotnet-isolated-process-guide.md#dependency-injection) (improved model consistent with .NET ecosystem) |
| Middleware | Not supported | [Supported](dotnet-isolated-process-guide.md#middleware) |
| Logging | [ILogger] passed to the function<br/>[ILogger&lt;T&gt;] via [dependency injection](functions-dotnet-dependency-injection.md) | [ILogger&lt;T&gt;]/[ILogger] obtained from [FunctionContext](/dotnet/api/microsoft.azure.functions.worker.functioncontext) or via [dependency injection](dotnet-isolated-process-guide.md#dependency-injection)|
| Application Insights dependencies | [Supported](functions-monitoring.md#dependencies) | [Supported (public preview)](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.ApplicationInsights) |
| Cancellation tokens | [Supported](functions-dotnet-class-library.md#cancellation-tokens) | [Supported](dotnet-isolated-process-guide.md#cancellation-tokens) |
| Cold start times<sup>2</sup> | (Baseline) | Additionally includes process launch |
| ReadyToRun | [Supported](functions-dotnet-class-library.md#readytorun) | [Supported](dotnet-isolated-process-guide.md#readytorun) | 

<sup>1</sup> When you need to interact with a service using parameters determined at runtime, using the corresponding service SDKs directly is recommended over using imperative bindings. The SDKs are less verbose, cover more scenarios, and have advantages for error handling and debugging purposes. This recommendation applies to both models.

<sup>2</sup> Cold start times may be additionally impacted on Windows when using some preview versions of .NET due to just-in-time loading of preview frameworks. This impact applies to both the in-process and out-of-process models but may be noticeable when comparing across different versions. This delay for preview versions isn't present on Linux plans.

<sup>3</sup> C# Script functions also run in-process and use the same libraries as in-process class library functions. For more information, see the [Azure Functions C# script (.csx) developer reference](functions-reference-csharp.md). 

<sup>4</sup> Service SDK types include types from the [Azure SDK for .NET](/dotnet/azure/sdk/azure-sdk-for-dotnet) such as [BlobClient](/dotnet/api/azure.storage.blobs.blobclient). For the isolated process model, support from some extensions is currently in preview, and Service Bus triggers do not yet support message settlement scenarios.

<sup>5</sup> ASP.NET Core types are not supported for .NET Framework.

[HttpRequest]: /dotnet/api/microsoft.aspnetcore.http.httprequest
[IActionResult]: /dotnet/api/microsoft.aspnetcore.mvc.iactionresult
[HttpRequestData]: /dotnet/api/microsoft.azure.functions.worker.http.httprequestdata?view=azure-dotnet&preserve-view=true 
[HttpResponseData]: /dotnet/api/microsoft.azure.functions.worker.http.httpresponsedata?view=azure-dotnet&preserve-view=true
[HttpRequestMessage]: /dotnet/api/system.net.http.httprequestmessage
[HttpResponseMessage]: /dotnet/api/system.net.http.httpresponsemessage

[aspnetcore-integration]: ./dotnet-isolated-process-guide.md#aspnet-core-integration-preview

[!INCLUDE [functions-dotnet-supported-versions](../../includes/functions-dotnet-supported-versions.md)]

## Next steps

> [!div class="nextstepaction"]
> [Learn more about the isolated worker model](./dotnet-isolated-process-guide.md)

> [!div class="nextstepaction"]
> [Migrate to the isolated worker model][migrate]

[migrate]: ./migrate-dotnet-to-isolated-model.md

[ILogger]: /dotnet/api/microsoft.extensions.logging.ilogger
[ILogger&lt;T&gt;]: /dotnet/api/microsoft.extensions.logging.logger-1
