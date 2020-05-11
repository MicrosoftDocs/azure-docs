---
title: Azure Functions HTTP output bindings
description: Learn how to return HTTP responses in Azure Functions.
author: craigshoemaker

ms.topic: reference
ms.date: 02/21/2020
ms.author: cshoe
---

# Azure Functions HTTP output bindings

Use the HTTP output binding to respond to the HTTP request sender. This binding requires an HTTP trigger and allows you to customize the response associated with the trigger's request.

The default return value for an HTTP-triggered function is:

- `HTTP 204 No Content` with an empty body in Functions 2.x and higher
- `HTTP 200 OK` with an empty body in Functions 1.x

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file. For C# class libraries, there are no attribute properties that correspond to these *function.json* properties.

|Property  |Description  |
|---------|---------|
| **type** |Must be set to `http`. |
| **direction** | Must be set to `out`. |
| **name** | The variable name used in function code for the response, or `$return` to use the return value. |

## Usage

To send an HTTP response, use the language-standard response patterns. In C# or C# script, make the function return type `IActionResult` or `Task<IActionResult>`. In C#, a return value attribute isn't required.

For example responses, see the [trigger example](./functions-bindings-http-webhook-trigger.md#example).

## host.json settings

This section describes the global configuration settings available for this binding in versions 2.x and higher. The example host.json file below contains only the version 2.x+ settings for this binding. For more information about global configuration settings in versions 2.x and beyond, see [host.json reference for Azure Functions](functions-host-json.md).

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
| customHeaders|none|Allows you to set custom headers in the HTTP response. The previous example adds the `X-Content-Type-Options` header to the response to avoid content type sniffing. |
|dynamicThrottlesEnabled|true<sup>\*</sup>|When enabled, this setting causes the request processing pipeline to periodically check system performance counters like `connections/threads/processes/memory/cpu/etc` and if any of those counters are over a built-in high threshold (80%), requests will be rejected with a `429 "Too Busy"` response until the counter(s) return to normal levels.<br/><sup>\*</sup>The default in a Consumption plan is `true`. The default in a Dedicated plan is `false`.|
|hsts|not enabled|When `isEnabled` is set to `true`, the [HTTP Strict Transport Security (HSTS) behavior of .NET Core](/aspnet/core/security/enforcing-ssl?view=aspnetcore-3.0&tabs=visual-studio#hsts) is enforced, as defined in the [`HstsOptions` class](/dotnet/api/microsoft.aspnetcore.httpspolicy.hstsoptions?view=aspnetcore-3.0). The above example also sets the [`maxAge`](/dotnet/api/microsoft.aspnetcore.httpspolicy.hstsoptions.maxage?view=aspnetcore-3.0#Microsoft_AspNetCore_HttpsPolicy_HstsOptions_MaxAge) property to 10 days. Supported properties of `hsts` are: <table><tr><th>Property</th><th>Description</th></tr><tr><td>excludedHosts</td><td>A string array of host names for which the HSTS header isn't added.</td></tr><tr><td>includeSubDomains</td><td>Boolean value that indicates whether the includeSubDomain parameter of the Strict-Transport-Security header is enabled.</td></tr><tr><td>maxAge</td><td>String that defines the max-age parameter of the Strict-Transport-Security header.</td></tr><tr><td>preload</td><td>Boolean that indicates whether the preload parameter of the Strict-Transport-Security header is enabled.</td></tr></table>|
|maxConcurrentRequests|100<sup>\*</sup>|The maximum number of HTTP functions that are executed in parallel. This value allows you to control concurrency, which can help manage resource utilization. For example, you might have an HTTP function that uses a large number of system resources (memory/cpu/sockets) such that it causes issues when concurrency is too high. Or you might have a function that makes outbound requests to a third-party service, and those calls need to be rate limited. In these cases, applying a throttle here can help. <br/><sup>*</sup>The default for a Consumption plan is 100. The default for a Dedicated plan is unbounded (`-1`).|
|maxOutstandingRequests|200<sup>\*</sup>|The maximum number of outstanding requests that are held at any given time. This limit includes requests that are queued but have not started executing, as well as any in progress executions. Any incoming requests over this limit are rejected with a 429 "Too Busy" response. That allows callers to employ time-based retry strategies, and also helps you to control maximum request latencies. This only controls queuing that occurs within the script host execution path. Other queues such as the ASP.NET request queue will still be in effect and unaffected by this setting. <br/><sup>\*</sup>The default for a Consumption plan is 200. The default for a Dedicated plan is unbounded (`-1`).|
|routePrefix|api|The route prefix that applies to all routes. Use an empty string to remove the default prefix. |

## Next steps

- [Run a function from an HTTP request](./functions-bindings-http-webhook-trigger.md)