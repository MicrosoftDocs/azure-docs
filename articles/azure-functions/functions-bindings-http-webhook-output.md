---
title: Azure Functions HTTP output bindings
description: Learn how to return HTTP responses in Azure Functions.
ms.topic: reference
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 03/04/2022
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Functions HTTP output bindings

Use the HTTP output binding to respond to the HTTP request sender (HTTP trigger). This binding requires an HTTP trigger and allows you to customize the response associated with the trigger's request.

The default return value for an HTTP-triggered function is:

- `HTTP 204 No Content` with an empty body in Functions 2.x and higher
- `HTTP 200 OK` with an empty body in Functions 1.x

::: zone pivot="programming-language-csharp"
## Attribute

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries don't require an attribute. C# script instead uses a function.json configuration file as described in the [C# scripting guide](./functions-reference-csharp.md#http-output).

# [In-process](#tab/in-process)

A return value attribute isn't required. To learn more, see [Usage](#usage).

# [Isolated process](#tab/isolated-process)

A return value attribute isn't required. To learn more, see [Usage](#usage).

---

::: zone-end
::: zone pivot="programming-language-java"  
## Annotations

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the [HttpOutput](/java/api/com.microsoft.azure.functions.annotation.httpoutput) annotation to define an output variable other than the default variable returned by the function. This annotation supports the following settings:

+ [dataType](/java/api/com.microsoft.azure.functions.annotation.httpoutput.datatype)
+ [name](/java/api/com.microsoft.azure.functions.annotation.httpoutput.name)

::: zone-end 
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"  
## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

|Property  |Description  |
|---------|---------|
| **type** |Must be set to `http`. |
| **direction** | Must be set to `out`. |
| **name** | The variable name used in function code for the response, or `$return` to use the return value. |

::: zone-end 

## Usage

To send an HTTP response, use the language-standard response patterns. 

::: zone pivot="programming-language-csharp"
The response type depends on the C# mode:

# [In-process](#tab/in-process)

The HTTP triggered function returns a type of [IActionResult] or `Task<IActionResult>`.

# [Isolated process](#tab/isolated-process)

The HTTP triggered function returns an [HttpResponseData](/dotnet/api/microsoft.azure.functions.worker.http.httpresponsedata) object or a `Task<HttpResponseData>`. If the app uses [ASP.NET Core integration in .NET Isolated](./dotnet-isolated-process-guide.md#aspnet-core-integration-preview), it could also use [IActionResult], `Task<IActionResult>`, [HttpResponse], or `Task<HttpResponse>`.

[IActionResult]: /dotnet/api/microsoft.aspnetcore.mvc.iactionresult
[HttpResponse]: /dotnet/api/microsoft.aspnetcore.http.httpresponse

---

::: zone-end  
::: zone pivot="programming-language-java"  

For Java, use an [HttpResponseMessage.Builder](/java/api/com.microsoft.azure.functions.httpresponsemessage.builder) to create a response to the HTTP trigger. To learn more, see [HttpRequestMessage and HttpResponseMessage](functions-reference-java.md#httprequestmessage-and-httpresponsemessage).

::: zone-end 

For example responses, see the [trigger examples](./functions-bindings-http-webhook-trigger.md#example).

## Next steps

- [Run a function from an HTTP request](./functions-bindings-http-webhook-trigger.md)
