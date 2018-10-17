---
title: Manage instances in Durable Functions - Azure
description: Learn how to manage instances in the Durable Functions extension for Azure Functions.
services: functions
author: cgillum
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 08/31/2018
ms.author: azfuncdf
---

# Manage instances in Durable Functions (Azure Functions)

[Durable Functions](durable-functions-overview.md) orchestration instances can be started, terminated, queried, and sent notification events. All instance management is done using the [orchestration client binding](durable-functions-bindings.md). This article goes into the details of each instance management operation.

## Starting instances

The [StartNewAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_StartNewAsync_) method on the [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) starts a new instance of an orchestrator function. Instances of this class can be acquired using the `orchestrationClient` binding. Internally, this method enqueues a message into the control queue, which then triggers the start of a function with the specified name that uses the `orchestrationTrigger` trigger binding. 

The task completes when the orchestration process is started. The orchestration process should start within 30 seconds. If it takes longer, a `TimeoutException` is thrown. 

The parameters to [StartNewAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_StartNewAsync_) are as follows:

* **Name**: The name of the orchestrator function to schedule.
* **Input**: Any JSON-serializable data that should be passed as the input to the orchestrator function.
* **InstanceId**: (Optional) The unique ID of the instance. If not specified, a random instance ID will be generated.

Here is a simple C# example:

```csharp
[FunctionName("HelloWorldManualStart")]
public static async Task Run(
    [ManualTrigger] string input,
    [OrchestrationClient] DurableOrchestrationClient starter,
    TraceWriter log)
{
    string instanceId = await starter.StartNewAsync("HelloWorld", input);
    log.Info($"Started orchestration with ID = '{instanceId}'.");
}
```

For non-.NET languages, the function output binding can be used to start new instances as well. In this case, any JSON-serializable object that has the above three parameters as fields can be used. For example, consider the following JavaScript function:

```js
module.exports = function (context, input) {
    var id = generateSomeUniqueId();
    context.bindings.starter = [{
        FunctionName: "HelloWorld",
        Input: input,
        InstanceId: id
    }];

    context.done(null);
};
```
The code above assumes that in the function.json file you have defined an out binding with name as "starter" and type as "orchestrationClient". If the binding is not defined, then the durable function instance will not be created.

For the durable function to be invoked the  function.json should be modified to have a binding for orchestration client as described below

```js
{
    "bindings": [{
        "name":"starter",
        "type":"orchestrationClient",
        "direction":"out"
    }]
}
```

> [!NOTE]
> We recommend that you use a random identifier for the instance ID. This will help ensure an equal load distribution when scaling orchestrator functions across multiple VMs. The proper time to use non-random instance IDs is when the ID must come from an external source or when implementing the [singleton orchestrator](durable-functions-singletons.md) pattern.

## Querying instances

The [GetStatusAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_GetStatusAsync_) method on the [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) class queries the status of an orchestration instance. It takes an `instanceId` (required), `showHistory` (optional), and `showHistoryOutput` (optional) as parameters. If `showHistory` is set to `true`, the response will contain the execution history. If `showHistoryOutput` is set to `true` as well, the execution history will contain activity outputs. The method returns an object with the following properties:

* **Name**: The name of the orchestrator function.
* **InstanceId**: The instance ID of the orchestration (should be the same as the `instanceId` input).
* **CreatedTime**: The time at which the orchestrator function started running.
* **LastUpdatedTime**: The time at which the orchestration last checkpointed.
* **Input**: The input of the function as a JSON value.
* **CustomStatus**: Custom orchestration status in JSON format. 
* **Output**: The output of the function as a JSON value (if the function has completed). If the orchestrator function failed, this property will include the failure details. If the orchestrator function was terminated, this property will include the provided reason for the termination (if any).
* **RuntimeStatus**: One of the following values:
    * **Pending**: The instance has been scheduled but has not yet started running.
    * **Running**: The instance has started running.
    * **Completed**: The instance has completed normally.
    * **ContinuedAsNew**: The instance has restarted itself with a new history. This is a transient state.
    * **Failed**: The instance failed with an error.
    * **Terminated**: The instance was abruptly terminated.
* **History**: The execution history of the orchestration. This field is only populated if `showHistory` is set to `true`.
    
This method returns `null` if the instance either doesn't exist or has not yet started running.

```csharp
[FunctionName("GetStatus")]
public static async Task Run(
    [OrchestrationClient] DurableOrchestrationClient client,
    [ManualTrigger] string instanceId)
{
    var status = await client.GetStatusAsync(instanceId);
    // do something based on the current status.
}
```
## Querying all instances

You can use the `GetStatusAsync` method to query the statuses of all orchestration instances. It doesn't take any parameters, or you can pass a `CancellationToken` object in case you want to cancel it. The method returns objects with the same properties as the `GetStatusAsync` method with parameters, except it doesn't return history. 

```csharp
[FunctionName("GetAllStatus")]
public static async Task Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")]HttpRequestMessage req,
    [OrchestrationClient] DurableOrchestrationClient client,
    TraceWriter log)
{
    IList<DurableOrchestrationStatus> instances = await starter.GetStatusAsync(); // You can pass CancellationToken as a parameter.
    foreach (var instance in instances)
    {
        log.Info(JsonConvert.SerializeObject(instance));
    };
}
```
## Querying instances with filters

You can also use the `GetStatusAsync` method to get a list of orchestration instances that match a set of predefined filters. Possible filter options include the orchestration creation time and the orchestration runtime status.

```csharp
[FunctionName("QueryStatus")]
public static async Task Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")]HttpRequestMessage req,
    [OrchestrationClient] DurableOrchestrationClient client,
    TraceWriter log)
{
    IEnumerable<OrchestrationRuntimeStatus> runtimeStatus = new List<OrchestrationRuntimeStatus> {
        OrchestrationRuntimeStatus.Completed,
        OrchestrationRuntimeStatus.Running
    };
    IList<DurableOrchestrationStatus> instances = await starter.GetStatusAsync(
        new DateTime(2018, 3, 10, 10, 1, 0),
        new DateTime(2018, 3, 10, 10, 23, 59),
        runtimeStatus
    ); // You can pass CancellationToken as a parameter.
    foreach (var instance in instances)
    {
        log.Info(JsonConvert.SerializeObject(instance));
    };
}
```

## Terminating instances

A running orchestration instance can be terminated using the [TerminateAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_TerminateAsync_) method of the [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) class. The two parameters are an `instanceId` and a `reason` string, which will be written to logs and to the instance status. A terminated instance will stop running as soon as it reaches the next `await` point, or it will terminate immediately if it is already on an `await`. 

```csharp
[FunctionName("TerminateInstance")]
public static Task Run(
    [OrchestrationClient] DurableOrchestrationClient client,
    [ManualTrigger] string instanceId)
{
    string reason = "It was time to be done.";
    return client.TerminateAsync(instanceId, reason);
}
```

> [!NOTE]
> Instance termination does not currently propagate. Activity functions and sub-orchestrations will run to completion regardless of whether the orchestration instance that called them has been terminated.

## Sending events to instances

Event notifications can be sent to running instances using the [RaiseEventAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_RaiseEventAsync_) method of the [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) class. Instances that can handle these events are those that are awaiting a call to [WaitForExternalEvent](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_WaitForExternalEvent_). 

The parameters to [RaiseEventAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_RaiseEventAsync_) are as follows:

* **InstanceId**: The unique ID of the instance.
* **EventName**: The name of the event to send.
* **EventData**: A JSON-serializable payload to send to the instance.

```csharp
[FunctionName("RaiseEvent")]
public static Task Run(
    [OrchestrationClient] DurableOrchestrationClient client,
    [ManualTrigger] string instanceId)
{
    int[] eventData = new int[] { 1, 2, 3 };
    return client.RaiseEventAsync(instanceId, "MyEvent", eventData);
}
```

> [!WARNING]
> If there is no orchestration instance with the specified *instance ID* or if the instance is not waiting on the specified *event name*, the event message is discarded. For more information about this behavior, see the [GitHub issue](https://github.com/Azure/azure-functions-durable-extension/issues/29).

## Wait for orchestration completion

The [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) class exposes a [WaitForCompletionOrCreateCheckStatusResponseAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_WaitForCompletionOrCreateCheckStatusResponseAsync_) API that can be used to get synchronously the actual output from an orchestration instance. The method uses default value of 10 seconds for `timeout` and 1 second for `retryInterval` when they are not set.  

Here is an example HTTP-trigger function that demonstrates how to use this API:

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/HttpSyncStart.cs)]

The function can be called with the following line using 2-seconds timeout and 0.5-second retry interval:

```bash
    http POST http://localhost:7071/orchestrators/E1_HelloSequence/wait?timeout=2&retryInterval=0.5
```

Depending on the time required to get the response from the orchestration instance there are two cases:

1. The orchestration instances complete within the defined timeout (in this case 2 seconds), the response is the actual orchestration instance output delivered synchronously:

    ```http
        HTTP/1.1 200 OK
        Content-Type: application/json; charset=utf-8
        Date: Thu, 14 Dec 2017 06:14:29 GMT
        Server: Microsoft-HTTPAPI/2.0
        Transfer-Encoding: chunked

        [
            "Hello Tokyo!",
            "Hello Seattle!",
            "Hello London!"
        ]
    ```

2. The orchestration instances cannot complete within the defined timeout (in this case 2 seconds), the response is the default one described in **HTTP API URL discovery**:

    ```http
        HTTP/1.1 202 Accepted
        Content-Type: application/json; charset=utf-8
        Date: Thu, 14 Dec 2017 06:13:51 GMT
        Location: http://localhost:7071/admin/extensions/DurableTaskExtension/instances/d3b72dddefce4e758d92f4d411567177?taskHub={taskHub}&connection={connection}&code={systemKey}
        Retry-After: 10
        Server: Microsoft-HTTPAPI/2.0
        Transfer-Encoding: chunked

        {
            "id": "d3b72dddefce4e758d92f4d411567177",
            "sendEventPostUri": "http://localhost:7071/admin/extensions/DurableTaskExtension/instances/d3b72dddefce4e758d92f4d411567177/raiseEvent/{eventName}?taskHub={taskHub}&connection={connection}&code={systemKey}",
            "statusQueryGetUri": "http://localhost:7071/admin/extensions/DurableTaskExtension/instances/d3b72dddefce4e758d92f4d411567177?taskHub={taskHub}&connection={connection}&code={systemKey}",
            "terminatePostUri": "http://localhost:7071/admin/extensions/DurableTaskExtension/instances/d3b72dddefce4e758d92f4d411567177/terminate?reason={text}&taskHub={taskHub}&connection={connection}&code={systemKey}",
            "rewindPostUri": "https://localhost:7071/admin/extensions/DurableTaskExtension/instances/d3b72dddefce4e758d92f4d411567177/rewind?reason={text}&taskHub={taskHub}&connection={connection}&code={systemKey}"
        }
    ```

> [!NOTE]
> The format of the webhook URLs may differ depending on which version of the Azure Functions host you are running. The preceding example is for the Azure Functions 2.0 host.

## Retrieving HTTP Management Webhook URLs

External systems can communicate with Durable Functions via the webhook URLs that are part of the default response described in [HTTP API URL discovery](durable-functions-http-api.md). However, the webhook URLs also can be accessed programmatically in the orchestration client or in an activity function via the [CreateHttpManagementPayload](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_CreateHttpManagementPayload_) method of the [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) class. 

[CreateHttpManagementPayload](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_CreateHttpManagementPayload_) has one parameter:

* **instanceId**: The unique ID of the instance.

The method returns an instance of the [HttpManagementPayload](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.Extensions.DurableTask.HttpManagementPayload.html#Microsoft_Azure_WebJobs_Extensions_DurableTask_HttpManagementPayload_) with the following string properties:

* **Id**: The instance ID of the orchestration (should be the same as the `InstanceId` input).
* **StatusQueryGetUri**: The status URL of the orchestration instance.
* **SendEventPostUri**: The "raise event" URL of the orchestration instance.
* **TerminatePostUri**: The "terminate" URL of the orchestration instance.
* **RewindPostUri**: The "rewind" URL of the orchestration instance.

Activity functions can send an instance of [HttpManagementPayload](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.Extensions.DurableTask.HttpManagementPayload.html#Microsoft_Azure_WebJobs_Extensions_DurableTask_HttpManagementPayload_) to external systems to monitor or raise events to an orchestration:

```csharp
[FunctionName("SendInstanceInfo")]
public static void SendInstanceInfo(
    [ActivityTrigger] DurableActivityContext ctx,
    [OrchestrationClient] DurableOrchestrationClient client,
    [DocumentDB(
        databaseName: "MonitorDB",
        collectionName: "HttpManagementPayloads",
        ConnectionStringSetting = "CosmosDBConnection")]out dynamic document)
{
    HttpManagementPayload payload = client.CreateHttpManagementPayload(ctx.InstanceId);

    // send the payload to Cosmos DB
    document = new { Payload = payload, id = ctx.InstanceId };
}
```

## Rewinding instances (preview)

A failed orchestration instance can be *rewound* into a previously healthy state using the [RewindAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_RewindAsync_System_String_System_String_) API. It works by putting the orchestration back into the *Running* state and re-running the activity and/or sub-orchestration execution failures that caused the orchestration failure.

> [!NOTE]
> This API is not intended to be a replacement for proper error handling and retry policies. Rather, it is intended to be used only in cases where orchestration instances fail for unexpected reasons. For more details on error handling and retry policies, please see the [Error handling](durable-functions-error-handling.md) topic.

One example use case for *rewind* is a workflow involving a series of [human approvals](durable-functions-overview.md#pattern-5-human-interaction). Suppose there are a series of activity functions that notify someone that their approval is needed and wait out the real-time response. After all of the approval activities have received responses or timed out, another activity fails due to an application misconfiguration (e.g. an invalid database connection string). The result is an orchestration failure deep into the workflow. With the `RewindAsync` API, an application administrator can fix the configuration error and *rewind* the failed orchestration back to the state immediately before the failure. None of the human-interaction steps need to be re-approved and the orchestration can now complete successfully.

> [!NOTE]
> The *rewind* feature does not support rewinding orchestration instances that use durable timers.

```csharp
[FunctionName("RewindInstance")]
public static Task Run(
    [OrchestrationClient] DurableOrchestrationClient client,
    [ManualTrigger] string instanceId)
{
    string reason = "Orchestrator failed and needs to be revived.";
    return client.RewindAsync(instanceId, reason);
}
```

## Next steps

> [!div class="nextstepaction"]
> [Learn how to use the HTTP APIs for instance management](durable-functions-http-api.md)
