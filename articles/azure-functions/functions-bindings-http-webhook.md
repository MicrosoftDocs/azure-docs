---
title: Azure Functions HTTP triggers and bindings
description: Learn to use HTTP triggers and bindings in Azure Functions.
author: ggailey777
ms.topic: reference
ms.date: 02/14/2020
ms.author: cshoe
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Functions HTTP triggers and bindings overview

Azure Functions may be invoked via HTTP requests to build serverless APIs and respond to [webhooks](https://en.wikipedia.org/wiki/Webhook).

| Action | Type |
|---------|---------|
| Run a function from an HTTP request | [Trigger](./functions-bindings-http-webhook-trigger.md) |
| Return an HTTP response from a function |[Output binding](./functions-bindings-http-webhook-output.md) |

::: zone pivot="programming-language-csharp"

## Install extension

The extension NuGet package you install depends on the C# mode you're using in your function app: 

# [In-process](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

# [Isolated process](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running functions on .NET 5.0 in Azure](dotnet-isolated-process-guide.md).

# [C# script](#tab/csharp-script)

Functions run as C# script, which is supported primarily for C# portal editing. To update existing binding extensions for C# script apps running in the portal without having to republish your function app, see [Update your extensions].

---

The functionality of the extension varies depending on the extension version:

# [Functions v2.x+](#tab/functionsv2/in-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Http), version 3.x.

# [Functions v1.x](#tab/functionsv1/in-process)

Functions 1.x apps automatically have a reference the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

# [Functions v2.x+](#tab/functionsv2/isolated-process)

Add the extension to your project by installing the [NuGet package], version 3.x.

# [Functions v1.x](#tab/functionsv1/isolated-process)

Functions 1.x doesn't support running in an isolated process.

# [Functions v2.x+](#tab/functionsv2/csharp-script)

This version of the extension should already be available to your function app with [extension bundle], version 2.x. 

# [Functions 1.x](#tab/functionsv1/csharp-script)

Functions 1.x apps automatically have a reference the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

---

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"  

## Install bundle

Starting with Functions version 2.x, the HTTP extension is part of an [extension bundle], which is specified in your host.json project file. To learn more, see [extension bundle].

# [Bundle v2.x](#tab/functionsv2)

This version of the extension should already be available to your function app with [extension bundle], version 2.x. 

# [Functions 1.x](#tab/functionsv1)

Functions 1.x apps automatically have a reference to the extension.

---

::: zone-end

## Next steps

- [Run a function from an HTTP request](./functions-bindings-http-webhook-trigger.md)
- [Return an HTTP response from a function](./functions-bindings-http-webhook-output.md)