---
title: HTTP features in Durable Functions - Azure Functions
description: Learn about the integrated HTTP features in the Durable Functions extension for Azure Functions.
services: functions
author: cgillum
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.topic: conceptual
ms.date: 09/04/2019
ms.author: azfuncdf
---

# HTTP Features

Durable Functions has several features that make it easy to encorporate durable orchestrations and entities into HTTP workflows. This article goes into details about some of those features.

## Exposing HTTP APIs

Orchestrations and entities can be invoked and managed using HTTP requests. You have a couple options for exposing your orchestrations as HTTP APIs:

### Built-in HTTP APIs

The Durable Functions extension automatically adds a set of HTTP APIs to the Azure Functions host. These APIs allow you to interact with and manage orchestrations and entities without writing any code.

TODO: Start-new example

TODO: Query example

TODO: Terminate example

See the [HTTP APIs](durable-functions-http-api.md) topic for more information on the built-in HTTP APIs exposed by the Durable Functions extension.

### HTTP trigger client functions

A [client function](durable-functions-types-features-overview.md#client-functions) is any function which can interact with an orchestration. You can create an [HTTP trigger function](../functions-bindings-http-webhook.md) that uses the [orchestration client output binding](durable-functions-bindings.md#orchestration-client) or the [entity client output binding]((durable-functions-bindings.md#entity-client) to start new orchestrations, send events to orchestrations or entities, query them, or even terminate existing orchestrations.

The following is an example of a .NET function which can invoke any orchestrator function.

```csharp
[FunctionName("HttpStart")]
public static async Task<HttpResponseMessage> Run(
    [HttpTrigger(AuthorizationLevel.Function, methods: "post", Route = "orchestrators/{functionName}")] HttpRequestMessage req,
    [DurableClient] IDurableOrchestrationClient starter,
    string functionName,
    ILogger log)
{
    // Function input comes from the request content.
    object eventData = await req.Content.ReadAsAsync<object>();
    string instanceId = await starter.StartNewAsync(functionName, eventData);

    log.LogInformation($"Started orchestration with ID = '{instanceId}'.");

    // Return an HTTP 202 status code with a Location header pointing to the new instance
    return starter.CreateCheckStatusResponse(req, instanceId);
}
```

The following code is the equivalent implementation in JavaScript:

**function.json**:
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in",
      "route": "orchestrators/{functionName}",
      "methods": ["get", "post"]
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    },
    {
      "name": "starter",
      "type": "orchestrationClient",
      "direction": "in"
    }
  ]
}
```

**JavaScript source code:**
```javascript
const df = require("durable-functions");

module.exports = async function (context, req) {
    const client = df.getClient(context);
    const instanceId = await client.startNew(req.params.functionName, undefined, req.body);

    context.log(`Started orchestration with ID = '${instanceId}'.`);

    return client.createCheckStatusResponse(context.bindingData.req, instanceId);
};
```

Using custom functions and bindings has the advantage of allowing you to customize the HTTP route to match your application semantics. It also allows you to customize the HTTP response which is returned to the client.

For more information on how to manage orchestrations and entities using client APIs, see the [Instance management](durable-functions-instance-management.md) topic.

## Consuming HTTP APIs

Orchestrator functions are not permitted to do I/O, as described in [orchestrator function code constraints](durable-functions-code-constraints.md). Instead, orchestrator functions must invoke [activity functions](durable-functions-types-features-overview.md#activity-functions) that do the I/O on behalf of the orchestration. However, starting in Durable Functions 2.0, orchestrations are able to natively consume HTTP APIs using a built-in "call HTTP" action.

The following example code shows a C# orchestrator function making an outbound HTTP request using the `CallHttpAsync` API:

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

The "call HTTP" action enables you to the following:

* Call HTTP APIs directly from orchestration functions (with some limitations mentioned later)
* Implement automatic client-side HTTP 202 status polling
* Leverage [Azure Managed Identities](../../active-directory/managed-identities-azure-resources/overview.md) to make authorized HTTP calls to other Azure endpoints.

It's possible for you to implement all these features yourself using activity functions, and in many cases activity functions may give you more flexibility. The ability to consume HTTP APIs directly from orchestrator functions is intended as a convenience for a certain set of common scenarios.

### Azure identity integration

### HTTP 202 handling

TODO: Link to the billing topic

### Managed identities

TODO: Managed identity

The following is an example of a .NET orchestrator function that makes authenticated calls to restart a virtual machine using the Azure Resource Manager [Virtual Machines REST API](https://docs.microsoft.com/rest/api/compute/virtualmachines).

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

TODO: Describe how the token source works

A more complete example can be found in the [precompiled C# "RestartVMs" samples](https://github.com/Azure/azure-functions-durable-extension/blob/v2/samples/v2/precompiled/RestartVMs.cs).

### Extensibility

TODO: Using dependency injection to customize the HTTP client behavior

## Next steps

> [!div class="nextstepaction"]
> [Learn about durable entities](durable-functions-entities.md)