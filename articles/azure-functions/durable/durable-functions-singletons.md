---
title: Singletons for Durable Functions - Azure
description: How to use singletons in the Durable Functions extension for Azure Functions.
author: cgillum
ms.topic: conceptual
ms.date: 11/03/2019
ms.author: azfuncdf
---

# Singleton orchestrators in Durable Functions (Azure Functions)

For background jobs, you often need to ensure that only one instance of a particular orchestrator runs at a time. You can ensure this kind of singleton behavior in [Durable Functions](durable-functions-overview.md) by assigning a specific instance ID to an orchestrator when creating it.

## Singleton example

The following example shows an HTTP-trigger function that creates a singleton background job orchestration. The code ensures that only one instance exists for a specified instance ID.

# [C#](#tab/csharp)

```cs
[FunctionName("HttpStartSingle")]
public static async Task<HttpResponseMessage> RunSingle(
    [HttpTrigger(AuthorizationLevel.Function, methods: "post", Route = "orchestrators/{functionName}/{instanceId}")] HttpRequestMessage req,
    [DurableClient] IDurableOrchestrationClient starter,
    string functionName,
    string instanceId,
    ILogger log)
{
    // Check if an instance with the specified ID already exists.
    var existingInstance = await starter.GetStatusAsync(instanceId);
    if (existingInstance == null)
    {
        // An instance with the specified ID doesn't exist, create one.
        dynamic eventData = await req.Content.ReadAsAsync<object>();
        await starter.StartNewAsync(functionName, instanceId, eventData);
        log.LogInformation($"Started orchestration with ID = '{instanceId}'.");
        return starter.CreateCheckStatusResponse(req, instanceId);
    }
    else
    {
        // An instance with the specified ID exists, don't create one.
        return req.CreateErrorResponse(
            HttpStatusCode.Conflict,
            $"An instance with ID '{instanceId}' already exists.");
    }
}
```

> [!NOTE]
> The previous C# code is for Durable Functions 2.x. For Durable Functions 1.x, you must use `OrchestrationClient` attribute instead of the `DurableClient` attribute, and you must use the `DurableOrchestrationClient` parameter type instead of `IDurableOrchestrationClient`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [JavaScript](#tab/javascript)

**function.json**

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in",
      "route": "orchestrators/{functionName}/{instanceId}",
      "methods": ["post"]
    },
    {
      "name": "starter",
      "type": "orchestrationClient",
      "direction": "in"
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    }
  ]
}
```

**index.js**

```javascript
const df = require("durable-functions");

module.exports = async function(context, req) {
    const client = df.getClient(context);

    const instanceId = req.params.instanceId;
    const functionName = req.params.functionName;

    // Check if an instance with the specified ID already exists.
    const existingInstance = await client.getStatus(instanceId);
    if (!existingInstance) {
        // An instance with the specified ID doesn't exist, create one.
        const eventData = req.body;
        await client.startNew(functionName, instanceId, eventData);
        context.log(`Started orchestration with ID = '${instanceId}'.`);
        return client.createCheckStatusResponse(req, instanceId);
    } else {
        // An instance with the specified ID exists, don't create one.
        return {
            status: 409,
            body: `An instance with ID '${instanceId}' already exists.`,
        };
    }
};
```

---

By default, instance IDs are randomly generated GUIDs. In the previous example, however, the instance ID is passed in route data from the URL. The code calls `GetStatusAsync`(C#) or `getStatus` (JavaScript) to check if an instance having the specified ID is already running. If no such instance is running, a new instance is created with that ID.

> [!NOTE]
> There is a potential race condition in this sample. If two instances of **HttpStartSingle** execute concurrently, both function calls will report success, but only one orchestration instance will actually start. Depending on your requirements, this may have undesirable side effects. For this reason, it is important to ensure that no two requests can execute this trigger function concurrently.

The implementation details of the orchestrator function don't actually matter. It could be a regular orchestrator function that starts and completes, or it could be one that runs forever (that is, an [Eternal Orchestration](durable-functions-eternal-orchestrations.md)). The important point is that there is only ever one instance running at a time.

## Next steps

> [!div class="nextstepaction"]
> [Learn about the native HTTP features of orchestrations](durable-functions-http-features.md)
