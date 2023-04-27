---
title: HTTP features in Durable Functions - Azure Functions
description: Learn about the integrated HTTP features in the Durable Functions extension for Azure Functions.
author: cgillum
ms.topic: conceptual
ms.date: 05/10/2022
ms.author: azfuncdf
ms.devlang: csharp, java, javascript, powershell, python
---

# HTTP Features

Durable Functions has several features that make it easy to incorporate durable orchestrations and entities into HTTP workflows. This article goes into detail about some of those features.

## Exposing HTTP APIs

Orchestrations and entities can be invoked and managed using HTTP requests. The Durable Functions extension exposes built-in HTTP APIs. It also provides APIs for interacting with orchestrations and entities from within HTTP-triggered functions.

### Built-in HTTP APIs

The Durable Functions extension automatically adds a set of HTTP APIs to the Azure Functions host. With these APIs, you can interact with and manage orchestrations and entities without writing any code.

The following built-in HTTP APIs are supported.

* [Start new orchestration](durable-functions-http-api.md#start-orchestration)
* [Query orchestration instance](durable-functions-http-api.md#get-instance-status)
* [Terminate orchestration instance](durable-functions-http-api.md#terminate-instance)
* [Send an external event to an orchestration](durable-functions-http-api.md#raise-event)
* [Purge orchestration history](durable-functions-http-api.md#purge-single-instance-history)
* [Send an operation event to an entity](durable-functions-http-api.md#signal-entity)
* [Get the state of an entity](durable-functions-http-api.md#get-entity)
* [Query the list of entities](durable-functions-http-api.md#list-entities)

See the [HTTP APIs article](durable-functions-http-api.md) for a full description of all the built-in HTTP APIs exposed by the Durable Functions extension.

### HTTP API URL discovery

The [orchestration client binding](durable-functions-bindings.md#orchestration-client) exposes APIs that can generate convenient HTTP response payloads. For example, it can create a response containing links to management APIs for a specific orchestration instance. The following examples show an HTTP-trigger function that demonstrates how to use this API for a new orchestration instance:

# [C#](#tab/csharp)

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/HttpStart.cs)]

# [JavaScript](#tab/javascript)

**index.js**

:::code language="javascript" source="~/azure-functions-durable-js/samples/HttpStart/index.js":::

**function.json**

:::code language="javascript" source="~/azure-functions-durable-js/samples/HttpStart/function.json":::

# [Python](#tab/python)

**__init__.py**

```python
import logging
import azure.functions as func
import azure.durable_functions as df

async def main(req: func.HttpRequest, starter: str) -> func.HttpResponse:
    client = df.DurableOrchestrationClient(starter)
    function_name = req.route_params['functionName']
    event_data = req.get_body()

    instance_id = await client.start_new(function_name, instance_id, event_data)
    
    logging.info(f"Started orchestration with ID = '{instance_id}'.")
    return client.create_check_status_response(req, instance_id)
```

**function.json**

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "authLevel": "function",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in",
      "route": "orchestrators/{functionName}",
      "methods": [
        "post",
        "get"
      ]
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

# [PowerShell](#tab/powershell)

**run.ps1**

```powershell
$FunctionName = $Request.Params.FunctionName
$InstanceId = Start-NewOrchestration -FunctionName $FunctionName
Write-Host "Started orchestration with ID = '$InstanceId'"

$Response = New-OrchestrationCheckStatusResponse -Request $Request -InstanceId $InstanceId
Push-OutputBinding -Name Response -Value $Response
```

**function.json**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "Request",
      "type": "httpTrigger",
      "direction": "in",
      "route": "orchestrators/{FunctionName}",
      "methods": [
        "post",
        "get"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "Response"
    },
    {
      "name": "starter",
      "type": "orchestrationClient",
      "direction": "in"
    }
  ]
}
```

# [Java](#tab/java)

```java
@FunctionName("HttpStart")
public HttpResponseMessage httpStart(
        @HttpTrigger(name = "req", route = "orchestrators/{functionName}") HttpRequestMessage<?> req,
        @DurableClientInput(name = "durableContext") DurableClientContext durableContext,
        @BindingName("functionName") String functionName,
        final ExecutionContext context) {

    DurableTaskClient client = durableContext.getClient();
    String instanceId = client.scheduleNewOrchestrationInstance(functionName);
    context.getLogger().info("Created new Java orchestration with instance ID = " + instanceId);
    return durableContext.createCheckStatusResponse(req, instanceId);
}
```

---

Starting an orchestrator function by using the HTTP-trigger functions shown previously can be done using any HTTP client. The following cURL command starts an orchestrator function named `DoWork`:

```bash
curl -X POST https://localhost:7071/orchestrators/DoWork -H "Content-Length: 0" -i
```

Next is an example response for an orchestration that has `abc123` as its ID. Some details have been removed for clarity.

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

In the previous example, each of the fields ending in `Uri` corresponds to a built-in HTTP API. You can use these APIs to manage the target orchestration instance.

> [!NOTE]
> The format of the webhook URLs depends on which version of the Azure Functions host you are running. The previous example is for the Azure Functions 2.0 host.

For a description of all built-in HTTP APIs, see the [HTTP API reference](durable-functions-http-api.md).

### Async operation tracking

The HTTP response mentioned previously is designed to help implement long-running HTTP async APIs with Durable Functions. This pattern is sometimes referred to as the *polling consumer pattern*. The client/server flow works as follows:

1. The client issues an HTTP request to start a long-running process like an orchestrator function.
1. The target HTTP trigger returns an HTTP 202 response with a Location header that has the value "statusQueryGetUri".
1. The client polls the URL in the Location header. The client continues to see HTTP 202 responses with a Location header.
1. When the instance finishes or fails, the endpoint in the Location header returns HTTP 200.

This protocol allows coordination of long-running processes with external clients or services that can poll an HTTP endpoint and follow the Location header. Both the client and server implementations of this pattern are built into the Durable Functions HTTP APIs.

> [!NOTE]
> By default, all HTTP-based actions provided by [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/) support the standard asynchronous operation pattern. This capability makes it possible to embed a long-running durable function as part of a Logic Apps workflow. You can find more details on Logic Apps support for asynchronous HTTP patterns in the [Azure Logic Apps workflow actions and triggers documentation](../../logic-apps/logic-apps-workflow-actions-triggers.md).

> [!NOTE]
> Interactions with orchestrations can be done from any function type, not just HTTP-triggered functions.

For more information on how to manage orchestrations and entities using client APIs, see the [Instance management article](durable-functions-instance-management.md).

## Consuming HTTP APIs

As described in the [orchestrator function code constraints](durable-functions-code-constraints.md), orchestrator functions can't do I/O directly. Instead, they typically call [activity functions](durable-functions-types-features-overview.md#activity-functions) that do I/O operations.

Starting with Durable Functions 2.0, orchestrations can natively consume HTTP APIs by using the [orchestration trigger binding](durable-functions-bindings.md#orchestration-trigger).

The following example code shows an orchestrator function making an outbound HTTP request:

# [C#](#tab/csharp)

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

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context){
    const url = context.df.getInput();
    const response = yield context.df.callHttp("GET", url)

    if (response.statusCode >= 400) {
        // handling of error codes goes here
    }
});
```
# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df
from datetime import datetime, timedelta

def orchestrator_function(context: df.DurableOrchestrationContext):
    url = context.get_input()
    response = yield context.call_http('GET', url)
    
    if response["statusCode"] >= 400:
        # handling of error codes goes here

main = df.Orchestrator.create(orchestrator_function)
```

# [PowerShell](#tab/powershell)

This feature isn't available in PowerShell.

# [Java](#tab/java)

This feature isn't available in Java.

---

By using the "call HTTP" action, you can do the following actions in your orchestrator functions:

* Call HTTP APIs directly from orchestration functions, with some limitations that are mentioned later.
* Automatically support client-side HTTP 202 status polling patterns.
* Use [Azure Managed Identities](../../active-directory/managed-identities-azure-resources/overview.md) to make authorized HTTP calls to other Azure endpoints.

The ability to consume HTTP APIs directly from orchestrator functions is intended as a convenience for a certain set of common scenarios. You can implement all of these features yourself using activity functions. In many cases, activity functions might give you more flexibility.

### HTTP 202 handling

The "call HTTP" API can automatically implement the client side of the polling consumer pattern. If a called API returns an HTTP 202 response with a Location header, the orchestrator function automatically polls the Location resource until receiving a response other than 202. This response will be the response returned to the orchestrator function code.

> [!NOTE]
> 1. Orchestrator functions also natively support the server-side polling consumer pattern, as described in [Async operation tracking](#async-operation-tracking). This support means that orchestrations in one function app can easily coordinate the orchestrator functions in other function apps. This is similar to the [sub-orchestration](durable-functions-sub-orchestrations.md) concept, but with support for cross-app communication. This support is particularly useful for microservice-style app development.
> 2. Due to a temporary limitation, the built-in HTTP polling pattern is not currently available in JavaScript/TypeScript and Python.

### Managed identities

Durable Functions natively supports calls to APIs that accept Azure Active Directory (Azure AD) tokens for authorization. This support uses [Azure managed identities](../../active-directory/managed-identities-azure-resources/overview.md) to acquire these tokens.

The following code is an example of an orchestrator function. The function makes authenticated calls to restart a virtual machine by using the Azure Resource Manager [virtual machines REST API](/rest/api/compute/virtualmachines).

# [C#](#tab/csharp)

```csharp
[FunctionName("RestartVm")]
public static async Task RunOrchestrator(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    string subscriptionId = "mySubId";
    string resourceGroup = "myRG";
    string vmName = "myVM";
    string apiVersion = "2019-03-01";
    
    // Automatically fetches an Azure AD token for resource = https://management.core.windows.net/.default
    // and attaches it to the outgoing Azure Resource Manager API call.
    var restartRequest = new DurableHttpRequest(
        HttpMethod.Post, 
        new Uri($"https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Compute/virtualMachines/{vmName}/restart?api-version={apiVersion}"),
        tokenSource: new ManagedIdentityTokenSource("https://management.core.windows.net/.default"));
    DurableHttpResponse restartResponse = await context.CallHttpAsync(restartRequest);
    if (restartResponse.StatusCode != HttpStatusCode.OK)
    {
        throw new ArgumentException($"Failed to restart VM: {restartResponse.StatusCode}: {restartResponse.Content}");
    }
}
```

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context) {
    const subscriptionId = "mySubId";
    const resourceGroup = "myRG";
    const vmName = "myVM";
    const apiVersion = "2019-03-01";
    const tokenSource = new df.ManagedIdentityTokenSource("https://management.core.windows.net/.default");

    // get a list of the Azure subscriptions that I have access to
    const restartResponse = yield context.df.callHttp(
        "POST",
        `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Compute/virtualMachines/${vmName}/restart?api-version=${apiVersion}`,
        undefined, // no request content
        undefined, // no request headers (besides auth which is handled by the token source)
        tokenSource);

    return restartResponse;
});
```

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df

def orchestrator_function(context: df.DurableOrchestrationContext):
    subscription_id = "mySubId"
    resource_group = "myRg"
    vm_name = "myVM"
    api_version = "2019-03-01"
    token_source = df.ManagedIdentityTokenSource("https://management.core.windows.net/.default")

    # get a list of the Azure subscriptions that I have access to
    restart_response = yield context.call_http("POST", 
        f"https://management.azure.com/subscriptions/{subscription_id}/resourceGroups/{resource_group}/providers/Microsoft.Compute/virtualMachines/{vm_name}/restart?api-version={api_version}",
        None,
        None,
        token_source)
    return restart_response

main = df.Orchestrator.create(orchestrator_function)
```

# [PowerShell](#tab/powershell) 

This feature isn't available in PowerShell.

# [Java](#tab/java)

This feature isn't available in Java.

---

In the previous example, the `tokenSource` parameter is configured to acquire Azure AD tokens for [Azure Resource Manager](../../azure-resource-manager/management/overview.md). The tokens are identified by the resource URI `https://management.core.windows.net/.default`. The example assumes that the current function app either is running locally or was deployed as a function app with a managed identity. The local identity or the managed identity is assumed to have permission to manage VMs in the specified resource group `myRG`.

At runtime, the configured token source automatically returns an OAuth 2.0 access token. The source then adds the token as a bearer token to the Authorization header of the outgoing request. This model is an improvement over manually adding authorization headers to HTTP requests for the following reasons:

* Token refresh is handled automatically. You don't need to worry about expired tokens.
* Tokens are never stored in the durable orchestration state.
* You don't need to write any code to manage token acquisition.

You can find a more complete example in the [precompiled C# RestartVMs sample](https://github.com/Azure/azure-functions-durable-extension/blob/dev/samples/precompiled/RestartVMs.cs).

Managed identities aren't limited to Azure resource management. You can use managed identities to access any API that accepts Azure AD bearer tokens, including Azure services from Microsoft and web apps from partners. A partner's web app can even be another function app. For a list of Azure services from Microsoft that support authentication with Azure AD, see [Azure services that support Azure AD authentication](../../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication).

### Limitations

The built-in support for calling HTTP APIs is a convenience feature. It's not appropriate for all scenarios.

HTTP requests sent by orchestrator functions and their responses are [serialized and persisted](durable-functions-serialization-and-persistence.md) as messages in the Durable Functions storage provider. This persistent queuing behavior ensures HTTP calls are [reliable and safe for orchestration replay](durable-functions-orchestrations.md#reliability). However, the persistent queuing behavior also has limitations:

* Each HTTP request involves additional latency when compared to a native HTTP client.
* Depending on the [configured storage provider](durable-functions-storage-providers.md), large request or response messages can significantly degrade orchestration performance. For example, when using Azure Storage, HTTP payloads that are too large to fit into Azure Queue messages are compressed and stored in Azure Blob storage.
* Streaming, chunked, and binary payloads aren't supported.
* The ability to customize the behavior of the HTTP client is limited.

If any of these limitations might affect your use case, consider instead using activity functions and language-specific HTTP client libraries to make outbound HTTP calls.

> [!NOTE]
> If you are a .NET developer, you might wonder why this feature uses the **DurableHttpRequest** and **DurableHttpResponse** types instead of the built-in .NET **HttpRequestMessage** and **HttpResponseMessage** types.
>
> This design choice is intentional. The primary reason is that custom types help ensure users don't make incorrect assumptions about the supported behaviors of the internal HTTP client. Types specific to Durable Functions also make it possible to simplify API design. They also can more easily make available special features like [managed identity integration](#managed-identities) and the [polling consumer pattern](#http-202-handling). 

### Extensibility (.NET only)

Customizing the behavior of the orchestration's internal HTTP client is possible using [Azure Functions .NET dependency injection](../functions-dotnet-dependency-injection.md). This ability can be useful for making small behavioral changes. It can also be useful for unit testing the HTTP client by injecting mock objects.

The following example demonstrates using dependency injection to disable TLS/SSL certificate validation for orchestrator functions that call external HTTP endpoints.

```csharp
public class Startup : FunctionsStartup
{
    public override void Configure(IFunctionsHostBuilder builder)
    {
        // Register own factory
        builder.Services.AddSingleton<
            IDurableHttpMessageHandlerFactory,
            MyDurableHttpMessageHandlerFactory>();
    }
}

public class MyDurableHttpMessageHandlerFactory : IDurableHttpMessageHandlerFactory
{
    public HttpMessageHandler CreateHttpMessageHandler()
    {
        // Disable TLS/SSL certificate validation (not recommended in production!)
        return new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback =
                HttpClientHandler.DangerousAcceptAnyServerCertificateValidator,
        };
    }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Learn about durable entities](durable-functions-entities.md)
