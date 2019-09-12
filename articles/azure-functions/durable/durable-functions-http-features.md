---
title: HTTP features in Durable Functions - Azure Functions
description: Learn about the integrated HTTP features in the Durable Functions extension for Azure Functions.
author: cgillum
manager: gwallace
keywords:
ms.service: azure-functions
ms.topic: conceptual
ms.date: 09/04/2019
ms.author: azfuncdf
---

# HTTP Features

Durable Functions has several features that make it easy to incorporate durable orchestrations and entities into HTTP workflows. This article goes into details about some of those features.

## Exposing HTTP APIs

Orchestrations and entities can be invoked and managed using HTTP requests. The Durable Functions extension exposes built-in HTTP APIs and also provides APIs for interacting with orchestrations and entities from within HTTP-triggered functions.

### Built-in HTTP APIs

The Durable Functions extension automatically adds a set of HTTP APIs to the Azure Functions host. These APIs allow you to interact with and manage orchestrations and entities without writing any code.

The following built-in HTTP APIs are supported.

* [Start new orchestration](durable-functions-http-api.md#start-orchestration)
* [Query orchestration instance](durable-functions-http-api.md#get-instance-status)
* [Terminate orchestration instance](durable-functions-http-api.md#terminate-instance)
* [Send an external event to an orchestration](durable-functions-http-api.md#raise-event)
* [Purge orchestration history](durable-functions-http-api.md#purge-single-instance-history)
* [Send an operation event to an entity](durable-functions-http-api.md#signal-entity)
* [Query the state of an entity](durable-functions-http-api.md#query-entity)

See the [HTTP APIs](durable-functions-http-api.md) article for a full description of all the built-in HTTP APIs exposed by the Durable Functions extension.

### HTTP API URL discovery

The [orchestration client binding](durable-functions-bindings.md#orchestration-client) exposes APIs that can be used to generate convenient HTTP response payloads. For example, it can create a response containing links to management APIs for a specific orchestration instance. Here is an example HTTP-trigger function that demonstrates how to use this API for a new orchestration instance:

#### Precompiled C#

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/HttpStart.cs)]

#### C# Script

[!code-csharp[Main](~/samples-durable-functions/samples/csx/HttpStart/run.csx)]

#### JavaScript (Functions 2.x only)

[!code-javascript[Main](~/samples-durable-functions/samples/javascript/HttpStart/index.js)]

#### Function.json

[!code-javascript[Main](~/samples-durable-functions/samples/javascript/HttpStart/function.json)]

Starting an orchestrator function using the HTTP trigger functions shown above can be done using any HTTP client. The following cURL command starts an orchestrator function named `DoWork`.

```bash
curl -X POST https://localhost:7071/orchestrators/DoWork -H "Content-Length: 0" -i
```

Here is an example response for an orchestration with `abc123` as its ID (some details removed for clarity):

```http
HTTP/1.1 202 Accepted
Content-Type: application/json; charset=utf-8
Location: http://localhost:7071/runtime/webhooks/durabletask/instances/abc123?code=XXX
Retry-After: 10

{
    "id": "abc123",
    "purgeHistoryDeleteUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123?code=XXX",
    "sendEventPostUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123/raiseEvent/{eventName}?code=XXX",
    "statusQueryGetUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123?code=XXX",
    "terminatePostUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123/terminate?reason={text}&code=XXX"
}
```

Each of the  `~Uri` fields in the previous example corresponds to built-in HTTP APIs. These APIs can be used to manage the target orchestration instance.

> [!NOTE]
> The format of the webhook URLs may differ depending on which version of the Azure Functions host you are running. The above example is for the Azure Functions 2.0 host.

For a description of all built-in HTTP APIs, see the [HTTP API reference](durable-functions-http-api.md) documentation.

### Async operation tracking

The HTTP response mentioned previously is designed to help implement long-running HTTP async APIs with Durable Functions. This pattern is sometimes referred to as the *Polling Consumer Pattern*. The client/server flow works as follows:

1. The client issues an HTTP request to start a long running process, such as an orchestrator function.
2. The target HTTP trigger returns an HTTP 202 response with a `Location` header with the `statusQueryGetUri` value.
3. The client polls the URL in the `Location` header. It continues to see HTTP 202 responses with a `Location` header.
4. When the instance completes (or fails), the endpoint in the `Location` header returns HTTP 200.

This protocol allows coordinating long-running processes with external clients or services that support polling an HTTP endpoint and following the `Location` header. Both the client and server implementations of this pattern are built into the Durable Functions HTTP APIs.

> [!NOTE]
> By default, all HTTP-based actions provided by [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/) support the standard asynchronous operation pattern. This capability makes it possible to embed a long-running durable function as part of a Logic Apps workflow. More details on Logic Apps support for asynchronous HTTP patterns can be found in the [Azure Logic Apps workflow actions and triggers documentation](../../logic-apps/logic-apps-workflow-actions-triggers.md).

> [!NOTE]
> Interacting with orchestrations can be done from any function type, not just HTTP-triggered functions.

For more information on how to manage orchestrations and entities using client APIs, see the [Instance management](durable-functions-instance-management.md) article.

## Consuming HTTP APIs

Orchestrator functions are not permitted to do I/O directly, as described in [orchestrator function code constraints](durable-functions-code-constraints.md). Instead, orchestrator functions typically call [activity functions](durable-functions-types-features-overview.md#activity-functions) that perform I/O operations.

Starting in Durable Functions 2.0, orchestrations are able to natively consume HTTP APIs using the [orchestration trigger binding](durable-functions-bindings.md#orchestration-trigger).

> [!NOTE]
> The ability to call HTTP endpoints directly from orchestrator functions is not yet available in JavaScript.

The following example code shows a C# orchestrator function making an outbound HTTP request using the `CallHttpAsync` .NET API:

```csharp
[FunctionName("CheckSiteAvailable")]
public static async Task CheckSiteAvailable(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    Uri url = context.GetInput<Uri>();

    // Makes an HTTP GET request to the specified endpoint
    DurableHttpResponse response = 
        await context.CallHttpAsync(HttpMethod.Get, url);

    if (response.StatusCode >= 400)
    {
        // handling of error codes goes here
    }
}
```

The "call HTTP" action enables you to the following things in your orchestrator functions:

* Call HTTP APIs directly from orchestration functions (with some limitations mentioned later).
* Automatic support client-side HTTP 202 status polling patterns.
* Use [Azure Managed Identities](../../active-directory/managed-identities-azure-resources/overview.md) to make authorized HTTP calls to other Azure endpoints.

The ability to consume HTTP APIs directly from orchestrator functions is intended as a convenience for a certain set of common scenarios. It's possible for you to implement all these features yourself using activity functions. In many cases, activity functions may give you more flexibility.

### HTTP 202 handling

The "call HTTP" API can automatically implement the client side of the *Polling Consumer Pattern*. If a called API returns an HTTP 202 response with a `Location` header, the orchestrator function will automatically poll the `Location` resource until a non-202 response comes back. The non-202 response will be the response returned to the orchestrator function code.

> [!NOTE]
> Orchestrator functions also natively support the server-side *Polling Consumer Pattern*, as described in [Async operation tracking](#async-operation-tracking). This means that orchestrations in one function app can easily coordinate the orchestrator functions in other function apps. This is similar to the [sub-orchestration](durable-functions-sub-orchestrations.md) concept, but with support for cross-app communication. This is particularly useful for Microservice-style application development.

### Managed identities

Durable Functions natively supports calling APIs that accept Azure AD tokens for authorization. This support uses [Azure managed identities](../../active-directory/managed-identities-azure-resources/overview.md) to acquire these tokens.

The following code is an example of a .NET orchestrator function that makes authenticated calls to restart a virtual machine using the Azure Resource Manager [Virtual Machines REST API](https://docs.microsoft.com/rest/api/compute/virtualmachines).

```csharp
[FunctionName("RestartVm")]
public static async Task RunOrchestrator(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    string subscriptionId = "mySubId";
    string resourceGroup = "myRG";
    string vmName = "myVM";
    
    // Automatically fetches an Azure AD token for resource = https://management.core.windows.net
    // and attaches it to the outgoing Azure Resource Manager API call.
    var restartRequest = new DurableHttpRequest(
        HttpMethod.Post, 
        new Uri($"https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Compute/virtualMachines/{vmName}/restart?api-version={apiVersion}"),
        tokenSource: new ManagedIdentityTokenSource("https://management.core.windows.net"));
    DurableHttpResponse restartResponse = await context.CallHttpAsync(restartRequest);
    if (restartResponse.StatusCode != HttpStatusCode.OK)
    {
        throw new ArgumentException($"Failed to restart VM: {restartResponse.StatusCode}: {restartResponse.Content}");
    }
}
```

In the previous example, the `tokenSource` parameter is configured to acquire Azure AD tokens for [Azure Resource Manager](../../azure-resource-manager/resource-group-overview.md) (identified by the "resource URI" `https://management.core.windows.net`). The example assumes that the current function app is either running locally or was deployed as an Azure Functions app with a managed identity. The local identity or the managed identity is assumed to have permission to manage VMs in the specified resource group, `myRG`.

At runtime, the configured token source automatically returns an OAuth 2.0 access token and adds it as a Bearer token to the `Authorization` header of the outgoing request. This model is an improvement over manually adding authorization headers to HTTP requests because:

* Token refresh is handled automatically. You don't have to worry about expired tokens.
* Tokens are never stored in the durable orchestration state.
* You don't have to write any code to deal with token acquisition.

A more complete example can be found in the [precompiled C# "RestartVMs" samples](https://github.com/Azure/azure-functions-durable-extension/blob/v2/samples/v2/precompiled/RestartVMs.cs).

Managed identities are not limited to Azure resource management. Managed identities can be used to access any API that accepts Azure AD bearer tokens, including first-party Azure services or third-party web applications. The third-party web app could even be another function app. For a list of first-party Azure services that support authentication with Azure AD, see [Azure services that support Azure AD authentication](../../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication).

### Limitations

The built-in support for calling HTTP APIs is a convenience feature and is not appropriate for all scenarios. HTTP requests sent by orchestrator functions and their responses are serialized and persisted as queue messages. This queueing behavior ensures HTTP calls are [reliable and safe for orchestration replay](durable-functions-orchestrations.md#reliability). However, this queuing behavior also means that:

* Each HTTP request involves additional latency when compared to a native HTTP client.
* Large request or response messages that can't fit into a queue message can significantly degrade orchestration performance. The potential performance degradation is because of the overhead of offloading message payloads to blob storage.
* Streaming, chunked, and binary payloads aren't supported.
* The ability to customize the behavior of the HTTP client is limited.

If any of these limitations may impact your use-case, consider instead using activity functions and language-specific HTTP client libraries to make outbound HTTP calls.

> [!NOTE]
> If you are a .NET developer, you might be wondering why this feature uses `DurableHttpRequest` and `DurableHttpResponse` types instead of the built-in .NET `HttpRequestMessage` and `HttpResponseMessage`. This design choice was intentional. The primary reason is that a custom types help ensure that users don't make incorrect assumptions about the supported behaviors of the internal HTTP client. Durable-specific types also make it possible to simplify the API design and more easily light up special features, such as [managed identity integration](#managed-identities) and the [polling consumer pattern](#http-202-handling).

## Next steps

> [!div class="nextstepaction"]
> [Learn about durable entities](durable-functions-entities.md)