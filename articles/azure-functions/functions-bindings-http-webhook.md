---
title: Azure Functions HTTP triggers and bindings
description: Learn to use HTTP triggers and bindings in Azure Functions.
ms.topic: reference
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 03/04/2022
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

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

---

The functionality of the extension varies depending on the extension version:

# [Functions v2.x+](#tab/functionsv2/in-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Http), version 3.x.

# [Functions v1.x](#tab/functionsv1/in-process)

Functions 1.x apps automatically have a reference the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

# [Functions v2.x+](#tab/functionsv2/isolated-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Http), version 3.x.

> [!NOTE]
> An additional extension package is needed for [ASP.NET Core integration in .NET Isolated](./dotnet-isolated-process-guide.md#aspnet-core-integration-preview)

# [Functions v1.x](#tab/functionsv1/isolated-process)

Functions 1.x doesn't support running in an isolated worker process.

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

## host.json settings

[!INCLUDE [functions-host-json-section-intro](../../includes/functions-host-json-section-intro.md)]

> [!NOTE]
> For a reference of host.json in Functions 1.x, see [host.json reference for Azure Functions 1.x](functions-host-json-v1.md#http).

```json
{
    "extensions": {
        "http": {
            "routePrefix": "api",
            "maxOutstandingRequests": 200,
            "maxConcurrentRequests": 100,
            "dynamicThrottlesEnabled": true,
            "hsts": {
                "isEnabled": true,
                "maxAge": "10"
            },
            "customHeaders": {
                "X-Content-Type-Options": "nosniff"
            }
        }
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
| customHeaders|none|Allows you to set custom headers in the HTTP response. The previous example adds the `X-Content-Type-Options` header to the response to avoid content type sniffing. This custom header applies to all HTTP triggered functions in the function app. |
|dynamicThrottlesEnabled|true<sup>\*</sup>|When enabled, this setting causes the request processing pipeline to periodically check system performance counters like `connections/threads/processes/memory/cpu/etc` and if any of those counters are over a built-in high threshold (80%), requests will be rejected with a `429 "Too Busy"` response until the counter(s) return to normal levels.<br/><sup>\*</sup>The default in a Consumption plan is `true`. The default in a Dedicated plan is `false`.|
|hsts|not enabled|When `isEnabled` is set to `true`, the [HTTP Strict Transport Security (HSTS) behavior of .NET Core](/aspnet/core/security/enforcing-ssl?tabs=visual-studio#hsts) is enforced, as defined in the [`HstsOptions` class](/dotnet/api/microsoft.aspnetcore.httpspolicy.hstsoptions). The above example also sets the [`maxAge`](/dotnet/api/microsoft.aspnetcore.httpspolicy.hstsoptions.maxage#Microsoft_AspNetCore_HttpsPolicy_HstsOptions_MaxAge) property to 10 days. Supported properties of `hsts` are: <table><tr><th>Property</th><th>Description</th></tr><tr><td>excludedHosts</td><td>A string array of host names for which the HSTS header isn't added.</td></tr><tr><td>includeSubDomains</td><td>Boolean value that indicates whether the includeSubDomain parameter of the Strict-Transport-Security header is enabled.</td></tr><tr><td>maxAge</td><td>String that defines the max-age parameter of the Strict-Transport-Security header.</td></tr><tr><td>preload</td><td>Boolean that indicates whether the preload parameter of the Strict-Transport-Security header is enabled.</td></tr></table>|
|maxConcurrentRequests|100<sup>\*</sup>|The maximum number of HTTP functions that are executed in parallel. This value allows you to control concurrency, which can help manage resource utilization. For example, you might have an HTTP function that uses a large number of system resources (memory/cpu/sockets) such that it causes issues when concurrency is too high. Or you might have a function that makes outbound requests to a third-party service, and those calls need to be rate limited. In these cases, applying a throttle here can help. <br/><sup>*</sup>The default for a Consumption plan is 100. The default for a Dedicated plan is unbounded (`-1`).|
|maxOutstandingRequests|200<sup>\*</sup>|The maximum number of outstanding requests that are held at any given time. This limit includes requests that are queued but have not started executing, as well as any in progress executions. Any incoming requests over this limit are rejected with a 429 "Too Busy" response. That allows callers to employ time-based retry strategies, and also helps you to control maximum request latencies. This only controls queuing that occurs within the script host execution path. Other queues such as the ASP.NET request queue will still be in effect and unaffected by this setting. <br/><sup>\*</sup>The default for a Consumption plan is 200. The default for a Dedicated plan is unbounded (`-1`).|
|routePrefix|api|The route prefix that applies to all routes. Use an empty string to remove the default prefix. |

## Next steps

- [Run a function from an HTTP request](./functions-bindings-http-webhook-trigger.md)
- [Return an HTTP response from a function](./functions-bindings-http-webhook-output.md)

[extension bundle]: ./functions-bindings-register.md#extension-bundles
[Update your extensions]: ./functions-bindings-register.md
