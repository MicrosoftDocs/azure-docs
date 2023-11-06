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

# Differences between isolated worker model and in-process model .NET Azure Functions

There are two process models for .NET functions:

[!INCLUDE [functions-dotnet-execution-model](../../includes/functions-dotnet-execution-model.md)] 

This article describes the current state of the functional and behavioral differences between the two models. To migrate from the in-process model to the isolated worker model, see [Migrate .NET apps from the in-process model to the isolated worker model][migrate].

## Execution mode comparison table 

Use the following table to compare feature and functional differences between the two models:

| Feature/behavior | Isolated worker process  |  In-process<sup>3</sup> |
| ---- | ---- | ---- |
| [Supported .NET versions](#supported-versions) | Long Term Support (LTS) versions<sup>6</sup>,<br/>Standard Term Support (STS) versions,<br/>.NET Framework | Long Term Support (LTS) versions<sup>6</sup> |
| Core packages | [Microsoft.Azure.Functions.Worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker/)<br/>[Microsoft.Azure.Functions.Worker.Sdk](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk) | [Microsoft.NET.Sdk.Functions](https://www.nuget.org/packages/Microsoft.NET.Sdk.Functions/) |
| Binding extension packages | [Microsoft.Azure.Functions.Worker.Extensions.*](https://www.nuget.org/packages?q=Microsoft.Azure.Functions.Worker.Extensions) | [Microsoft.Azure.WebJobs.Extensions.*](https://www.nuget.org/packages?q=Microsoft.Azure.WebJobs.Extensions)  |
| Durable Functions | [Supported](durable/durable-functions-dotnet-isolated-overview.md)| [Supported](durable/durable-functions-overview.md) |
| Model types exposed by bindings | Simple types<br/>JSON serializable types<br/>Arrays/enumerations<br/>[Service SDK types](dotnet-isolated-process-guide.md#sdk-types)<sup>4</sup> | Simple types<br/>[JSON serializable](/dotnet/api/system.text.json.jsonserializeroptions) types<br/>Arrays/enumerations<br/>Service SDK types<sup>4</sup> |
| HTTP trigger model types| [HttpRequestData] / [HttpResponseData]<br/>[HttpRequest] / [IActionResult] (using [ASP.NET Core integration][aspnetcore-integration])<sup>5</sup>| [HttpRequest] / [IActionResult]<sup>5</sup><br/>[HttpRequestMessage] / [HttpResponseMessage] |
| Output binding interactions | Return values in an expanded model with:<br/> - single or [multiple outputs](dotnet-isolated-process-guide.md#multiple-output-bindings)<br/> - arrays of outputs| Return values (single output only),<br/>`out` parameters,<br/>`IAsyncCollector` |
| Imperative bindings<sup>1</sup>  | Not supported - instead [work with SDK types directly](./dotnet-isolated-process-guide.md#register-azure-clients) | [Supported](functions-dotnet-class-library.md#binding-at-runtime) |
| Dependency injection | [Supported](dotnet-isolated-process-guide.md#dependency-injection) (improved model consistent with .NET ecosystem) | [Supported](functions-dotnet-dependency-injection.md)  |
| Middleware | [Supported](dotnet-isolated-process-guide.md#middleware) | Not supported |
| Logging | [`ILogger<T>`]/[`ILogger`] obtained from [FunctionContext](/dotnet/api/microsoft.azure.functions.worker.functioncontext) or via [dependency injection](dotnet-isolated-process-guide.md#dependency-injection)| [`ILogger`] passed to the function<br/>[`ILogger<T>`] via [dependency injection](functions-dotnet-dependency-injection.md) |
| Application Insights dependencies | [Supported](./dotnet-isolated-process-guide.md#application-insights) | [Supported](functions-monitoring.md#dependencies) |
| Cancellation tokens | [Supported](dotnet-isolated-process-guide.md#cancellation-tokens) | [Supported](functions-dotnet-class-library.md#cancellation-tokens) |
| Cold start times<sup>2</sup> | [Configurable optimizations](./dotnet-isolated-process-guide.md#performance-optimizations) | Optimized |
| ReadyToRun | [Supported](dotnet-isolated-process-guide.md#readytorun) | [Supported](functions-dotnet-class-library.md#readytorun) |

<sup>1</sup> When you need to interact with a service using parameters determined at runtime, using the corresponding service SDKs directly is recommended over using imperative bindings. The SDKs are less verbose, cover more scenarios, and have advantages for error handling and debugging purposes. This recommendation applies to both models.

<sup>2</sup> Cold start times may be additionally impacted on Windows when using some preview versions of .NET due to just-in-time loading of preview frameworks. This impact applies to both the in-process and out-of-process models but may be noticeable when comparing across different versions. This delay for preview versions isn't present on Linux plans.

<sup>3</sup> C# Script functions also run in-process and use the same libraries as in-process class library functions. For more information, see the [Azure Functions C# script (.csx) developer reference](functions-reference-csharp.md). 

<sup>4</sup> Service SDK types include types from the [Azure SDK for .NET](/dotnet/azure/sdk/azure-sdk-for-dotnet) such as [BlobClient](/dotnet/api/azure.storage.blobs.blobclient).

<sup>5</sup> ASP.NET Core types are not supported for .NET Framework.

<sup>6</sup> The isolated worker model supports .NET 8 [as a preview](./dotnet-isolated-process-guide.md#preview-net-versions). For information about .NET 8 plans, including future options for the in-process model, see the [Azure Functions Roadmap Update post](https://aka.ms/azure-functions-dotnet-roadmap).

[HttpRequest]: /dotnet/api/microsoft.aspnetcore.http.httprequest
[IActionResult]: /dotnet/api/microsoft.aspnetcore.mvc.iactionresult
[HttpRequestData]: /dotnet/api/microsoft.azure.functions.worker.http.httprequestdata?view=azure-dotnet&preserve-view=true 
[HttpResponseData]: /dotnet/api/microsoft.azure.functions.worker.http.httpresponsedata?view=azure-dotnet&preserve-view=true
[HttpRequestMessage]: /dotnet/api/system.net.http.httprequestmessage
[HttpResponseMessage]: /dotnet/api/system.net.http.httpresponsemessage

[aspnetcore-integration]: ./dotnet-isolated-process-guide.md#aspnet-core-integration

[!INCLUDE [functions-dotnet-supported-versions](../../includes/functions-dotnet-supported-versions.md)]

## Next steps

> [!div class="nextstepaction"]
> [Learn more about the isolated worker model](./dotnet-isolated-process-guide.md)

> [!div class="nextstepaction"]
> [Migrate to the isolated worker model][migrate]

[migrate]: ./migrate-dotnet-to-isolated-model.md

[`ILogger`]: /dotnet/api/microsoft.extensions.logging.ilogger
[`ILogger<T>`]: /dotnet/api/microsoft.extensions.logging.logger-1
