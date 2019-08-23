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
ms.date: 12/07/2018
ms.author: azfuncdf
#Customer intent: As a developer, I want to understand the options provided for managing my Durable Functions orchestration instances, so I can keep my orchestrations running efficiently and make improvements.
---

# Manage instances in Durable Functions in Azure

If you're using the [Durable Functions](durable-functions-overview.md) extension for Azure Functions, or want to start doing so, make sure you're getting the best use out of it. You can optimize your Durable Functions orchestration instances by learning more about how to manage them. This article goes into the details of each instance management operation.

You can start and terminate instances, for example, and you can query instances, including the ability to query all instances and query instances with filters. Additionally, you can send events to instances, wait for orchestration completion, and retrieve HTTP management webhook URLs. This article covers other management operations, too, including rewinding instances, purging instance history, and deleting a task hub.

In Durable Functions, you have options for how you want to implement each of these management operations. This article provides examples that use the [Azure Functions Core Tools](../functions-run-local.md) for both .NET (C#) and JavaScript.

## Start instances

It's important to be able to start an instance of orchestration. This is commonly done when you are using a Durable Functions binding in another function's trigger.

The [StartNewAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_StartNewAsync_) method on the [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) (.NET) or `startNew` on the `DurableOrchestrationClient` (JavaScript) starts a new instance. You acquire instances of this class by using the `orchestrationClient` binding. Internally, this method enqueues a message into the control queue, which then triggers the start of a function with the specified name that uses the `orchestrationTrigger` trigger binding.

This async operation completes when the orchestration process is successfully scheduled. The orchestration process should start within 30 seconds. If it takes longer, you'll see a `TimeoutException`.

> [!WARNING]
> When developing locally in JavaScript, set the environment variable `WEBSITE_HOSTNAME` to `localhost:<port>` (for example, `localhost:7071`) to use methods on `DurableOrchestrationClient`. For more information about this requirement, see the [GitHub issue](https://github.com/Azure/azure-functions-durable-js/issues/28).

### .NET

The parameters to [StartNewAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_StartNewAsync_) are as follows:

* **Name**: The name of the orchestrator function to schedule.
* **Input**: Any JSON-serializable data that should be passed as the input to the orchestrator function.
* **InstanceId**: (Optional) The unique ID of the instance. If you don't specify this parameter, the method uses a random ID.

Here is a simple C# example:

```csharp
[FunctionName("HelloWorldManualStart")]
public static async Task Run(
    [ManualTrigger] string input,
    [OrchestrationClient] DurableOrchestrationClient starter,
    ILogger log)
{
    string instanceId = await starter.StartNewAsync("HelloWorld", input);
    log.LogInformation($"Started orchestration with ID = '{instanceId}'.");
}
```

### JavaScript (Functions 2.x only)

The parameters to `startNew` are as follows:

* **Name**: The name of the orchestrator function to schedule.
* **InstanceId**: (Optional) The unique ID of the instance. If you don't specify this parameter, the method uses a random ID.
* **Input**: (Optional) Any JSON-serializable data that should be passed as the input to the orchestrator function.

Here is a simple JavaScript example:

```javascript
const df = require("durable-functions");

module.exports = async function(context, input) {
    const client = df.getClient(context);

    const instanceId = await client.startNew("HelloWorld", undefined, input);
    context.log(`Started orchestration with ID = ${instanceId}.`);
};
```

> [!TIP]
> Use a random identifier for the instance ID. This helps ensure an equal load distribution when you're scaling orchestrator functions across multiple VMs. The proper time to use non-random instance IDs is when the ID must come from an external source, or when you're implementing the [singleton orchestrator](durable-functions-singletons.md) pattern.

### Azure Functions Core Tools

You can also start an instance directly by using the [Azure Functions Core Tools](../functions-run-local.md) `durable start-new` command. It takes the following parameters:

* **`function-name` (required)**: Name of the function to start.
* **`input` (optional)**: Input to the function, either inline or through a JSON file. For files, add a prefix to the path to the file with `@`, such as `@path/to/file.json`.
* **`id` (optional)**: ID of the orchestration instance. If you don't specify this parameter, the command uses a random GUID.
* **`connection-string-setting` (optional)**: Name of the application setting containing the storage connection string to use. The default is AzureWebJobsStorage.
* **`task-hub-name` (optional)**: Name of the Durable Functions task hub to use. The default is DurableFunctionsHub. You can also set this in [host.json](durable-functions-bindings.md#host-json) by using durableTask:HubName.

> [!NOTE]
> Core Tools commands assume you are running them from the root directory of a function app. If you explicitly provide the `connection-string-setting` and `task-hub-name` parameters, you can run the commands from any directory. Although you can run these commands without a function app host running, you might find that you can't observe some effects unless the host is running. For example, the `start-new` command enqueues a start message into the target task hub, but the orchestration doesn't actually run unless there is a function app host process running that can process the message.

The following command starts the function named HelloWorld, and passes the contents of the file `counter-data.json` to it:

```bash
func durable start-new --function-name HelloWorld --input @counter-data.json --task-hub-name TestTaskHub
```

## Query instances

As part of your effort to manage your orchestrations, you'll most likely need to gather information about the status of an orchestration instance (for example, whether it has completed normally or failed).

The [GetStatusAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_GetStatusAsync_) method on the [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) class (.NET) or the `getStatus` method on the `DurableOrchestrationClient` class (JavaScript) queries the status of an orchestration instance.

It takes an `instanceId` (required), `showHistory` (optional), `showHistoryOutput` (optional), and `showInput` (optional, .NET only) as parameters.

* **`showHistory`**: If set to `true`, the response contains the execution history.
* **`showHistoryOutput`**: If set to `true`, the execution history contains activity outputs.
* **`showInput`**: If set to `false`, the response won't contain the input of the function. The default value is `true`. (.NET only)

The method returns a JSON object with the following properties:

* **Name**: The name of the orchestrator function.
* **InstanceId**: The instance ID of the orchestration (should be the same as the `instanceId` input).
* **CreatedTime**: The time at which the orchestrator function started running.
* **LastUpdatedTime**: The time at which the orchestration last checkpointed.
* **Input**: The input of the function as a JSON value. This field isn't populated if `showInput` is false.
* **CustomStatus**: Custom orchestration status in JSON format.
* **Output**: The output of the function as a JSON value (if the function has completed). If the orchestrator function failed, this property includes the failure details. If the orchestrator function was terminated, this property includes the reason for the termination (if any).
* **RuntimeStatus**: One of the following values:
  * **Pending**: The instance has been scheduled but has not yet started running.
  * **Running**: The instance has started running.
  * **Completed**: The instance has completed normally.
  * **ContinuedAsNew**: The instance has restarted itself with a new history. This is a transient state.
  * **Failed**: The instance failed with an error.
  * **Terminated**: The instance was stopped abruptly.
* **History**: The execution history of the orchestration. This field is only populated if `showHistory` is set to `true`.

This method returns `null` if the instance either doesn't exist or has not yet started running.

### C#

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

### JavaScript (Functions 2.x only)

```javascript
const df = require("durable-functions");

module.exports = async function(context, instanceId) {
    const client = df.getClient(context);

    const status = await client.getStatus(instanceId);
    // do something based on the current status.
}
```

### Azure Functions Core Tools

It's also possible to get the status of an orchestration instance directly, by using the [Azure Functions Core Tools](../functions-run-local.md) `durable get-runtime-status` command. It takes the following parameters:

* **`id` (required)**: ID of the orchestration instance.
* **`show-input` (optional)**: If set to `true`, the response contains the input of the function. The default value is `false`.
* **`show-output` (optional)**: If set to `true`, the response contains the output of the function. The default value is `false`.
* **`connection-string-setting` (optional)**: Name of the application setting containing the storage connection string to use. The default is `AzureWebJobsStorage`.
* **`task-hub-name` (optional)**: Name of the Durable Functions task hub to use. The default is `DurableFunctionsHub`. It can also be set in [host.json](durable-functions-bindings.md#host-json), by using durableTask:HubName.

The following command retrieves the status (including input and output) of an instance with an orchestration instance ID of 0ab8c55a66644d68a3a8b220b12d209c. It assumes that you are running the `func` command from the root directory of the function app:

```bash
func durable get-runtime-status --id 0ab8c55a66644d68a3a8b220b12d209c --show-input true --show-output true
```

You can use the `durable get-history` command to retrieve the history of an orchestration instance. It takes the following parameters:

* **`id` (required)**: ID of the orchestration instance.
* **`connection-string-setting` (optional)**: Name of the application setting containing the storage connection string to use. The default is `AzureWebJobsStorage`.
* **`task-hub-name` (optional)**: Name of the Durable Functions task hub to use. The default is `DurableFunctionsHub`. It can also be set in host.json, by using durableTask:HubName.

```bash
func durable get-history --id 0ab8c55a66644d68a3a8b220b12d209c
```

## Query all instances

Rather than query one instance in your orchestration at a time, you might find it more efficient to query all of them at once.

You can use the `GetStatusAsync` (.NET) or `getStatusAll` (JavaScript) method to query the statuses of all orchestration instances. In .NET, you can pass a `CancellationToken` object in case you want to cancel it. The method returns objects with the same properties as the `GetStatusAsync` method with parameters.

### C#

```csharp
[FunctionName("GetAllStatus")]
public static async Task Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")]HttpRequestMessage req,
    [OrchestrationClient] DurableOrchestrationClient client,
    ILogger log)
{
    IList<DurableOrchestrationStatus> instances = await client.GetStatusAsync(); // You can pass CancellationToken as a parameter.
    foreach (var instance in instances)
    {
        log.LogInformation(JsonConvert.SerializeObject(instance));
    };
}
```

### JavaScript (Functions 2.x only)

```javascript
const df = require("durable-functions");

module.exports = async function(context, req) {
    const client = df.getClient(context);

    const instances = await client.getStatusAll();
    instances.forEach((instance) => {
        context.log(JSON.stringify(instance));
    });
};
```

### Azure Functions Core Tools

It's also possible to query instances directly, by using the [Azure Functions Core Tools](../functions-run-local.md) `durable get-instances` command. It takes the following parameters:

* **`top` (optional)**: This command supports paging. This parameter corresponds to the number of instances retrieved per request. The default is 10.
* **`continuation-token` (optional)**: A token to indicate which page or section of instances to retrieve. Each `get-instances` execution returns a token to the next set of instances.
* **`connection-string-setting` (optional)**: Name of the application setting containing the storage connection string to use. The default is `AzureWebJobsStorage`.
* **`task-hub-name` (optional)**: Name of the Durable Functions task hub to use. The default is `DurableFunctionsHub`. It can also be set in [host.json](durable-functions-bindings.md#host-json), by using durableTask:HubName.

```bash
func durable get-instances
```

## Query instances with filters

What if you don't really need all the information that a standard instance query can provide? For example, what if you're just looking for the orchestration creation time, or the orchestration runtime status? You can narrow your query by applying filters.

Use the `GetStatusAsync` (.NET) or `getStatusBy` (JavaScript) method to get a list of orchestration instances that match a set of predefined filters.

### C#

```csharp
[FunctionName("QueryStatus")]
public static async Task Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")]HttpRequestMessage req,
    [OrchestrationClient] DurableOrchestrationClient client,
    ILogger log)
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
        log.LogInformation(JsonConvert.SerializeObject(instance));
    };
}
```

### JavaScript (Functions 2.x only)

```javascript
const df = require("durable-functions");

module.exports = async function(context, req) {
    const client = df.getClient(context);

    const runtimeStatus = [
        df.OrchestrationRuntimeStatus.Completed,
        df.OrchestrationRuntimeStatus.Running,
    ];
    const instances = await client.getStatusBy(
        new Date(2018, 3, 10, 10, 1, 0),
        new Date(2018, 3, 10, 10, 23, 59),
        runtimeStatus
    );
    instances.forEach((instance) => {
        context.log(JSON.stringify(instance));
    });
};
```

### Azure Functions Core Tools

In the Azure Functions Core Tools, you can also use the `durable get-instances` command with filters. In addition to the aforementioned `top`, `continuation-token`, `connection-string-setting`, and `task-hub-name` parameters, you can use three filter parameters (`created-after`, `created-before`, and `runtime-status`).

* **`created-after` (optional)**: Retrieve the instances created after this date/time (UTC). ISO 8601 formatted datetimes accepted.
* **`created-before` (optional)**: Retrieve the instances created before this date/time (UTC). ISO 8601 formatted datetimes accepted.
* **`runtime-status` (optional)**: Retrieve the instances with a particular status (for example, running or completed). Can provide multiple (space separated) statuses.
* **`top` (optional)**: Number of instances retrieved per request. The default is 10.
* **`continuation-token` (optional)**: A token to indicate which page or section of instances to retrieve. Each `get-instances` execution returns a token to the next set of instances.
* **`connection-string-setting` (optional)**: Name of the application setting containing the storage connection string to use. The default is `AzureWebJobsStorage`.
* **`task-hub-name` (optional)**: Name of the Durable Functions task hub to use. The default is `DurableFunctionsHub`. It can also be set in [host.json](durable-functions-bindings.md#host-json), by using durableTask:HubName.

If you don't provide any filters (`created-after`, `created-before`, or `runtime-status`), the command simply retrieves `top` instances, with no regard to runtime status or creation time.

```bash
func durable get-instances --created-after 2018-03-10T13:57:31Z --created-before  2018-03-10T23:59Z --top 15
```

## Terminate instances

If you have an orchestration instance that is taking too long to run, or you just need to stop it before it completes for any reason, you have the option to terminate it.

You can use the [TerminateAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_TerminateAsync_) method of the [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) class (.NET), or the `terminate` method of the `DurableOrchestrationClient` class (JavaScript). The two parameters are an `instanceId` and a `reason` string, which are written to logs and to the instance status. A terminated instance stops running as soon as it reaches the next `await` (.NET) or `yield` (JavaScript) point, or it terminates immediately if it's already on an `await` or `yield`.

### C#

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

### JavaScript (Functions 2.x only)

```javascript
const df = require("durable-functions");

module.exports = async function(context, instanceId) {
    const client = df.getClient(context);

    const reason = "It was time to be done.";
    return client.terminate(instanceId, reason);
};
```

> [!NOTE]
> Instance termination doesn't currently propagate. Activity functions and sub-orchestrations run to completion, regardless of whether you've terminated the orchestration instance that called them.

### Azure Functions Core Tools

You can also terminate an orchestration instance directly, by using the [Azure Functions Core Tools](../functions-run-local.md) `durable terminate` command. It takes the following parameters:

* **`id` (required)**: ID of the orchestration instance to terminate.
* **`reason` (optional)**: Reason for termination.
* **`connection-string-setting` (optional)**: Name of the application setting containing the storage connection string to use. The default is `AzureWebJobsStorage`.
* **`task-hub-name` (optional)**: Name of the Durable Functions task hub to use. The default is `DurableFunctionsHub`. It can also be set in [host.json](durable-functions-bindings.md#host-json), by using durableTask:HubName.

The following command terminates an orchestration instance with an ID of 0ab8c55a66644d68a3a8b220b12d209c:

```bash
func durable terminate --id 0ab8c55a66644d68a3a8b220b12d209c --reason "It was time to be done."
```

## Send events to instances

In some scenarios, it's important for your orchestrator functions to be able to wait and listen for external events. This includes [monitor functions](durable-functions-concepts.md#monitoring) and functions that are waiting for [human interaction](durable-functions-concepts.md#human).

Send event notifications to running instances by using the [RaiseEventAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_RaiseEventAsync_) method of the [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) class (.NET) or the `raiseEvent` method of the `DurableOrchestrationClient` class (JavaScript). Instances that can handle these events are those that are awaiting a call to [WaitForExternalEvent](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html#Microsoft_Azure_WebJobs_DurableOrchestrationContext_WaitForExternalEvent_) (.NET) or `waitForExternalEvent` (JavaScript).

The parameters to [RaiseEventAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_RaiseEventAsync_) (.NET) and `raiseEvent` (JavaScript) are as follows:

* **InstanceId**: The unique ID of the instance.
* **EventName**: The name of the event to send.
* **EventData**: A JSON-serializable payload to send to the instance.

### C#

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

### JavaScript (Functions 2.x only)

```javascript
const df = require("durable-functions");

module.exports = async function(context, instanceId) {
    const client = df.getClient(context);

    const eventData = [ 1, 2, 3 ];
    return client.raiseEvent(instanceId, "MyEvent", eventData);
};
```

> [!IMPORTANT]
> If there is no orchestration instance with the specified instance ID, or if the instance is not waiting on the specified event name, the event message is discarded. For more information about this behavior, see the [GitHub issue](https://github.com/Azure/azure-functions-durable-extension/issues/29).

### Azure Functions Core Tools

You can also raise an event to an orchestration instance directly, by using the [Azure Functions Core Tools](../functions-run-local.md) `durable raise-event` command. It takes the following parameters:

* **`id` (required)**: ID of the orchestration instance.
* **`event-name` (optional)**: Name of the event to raise. The default is `$"Event_{RandomGUID}"`.
* **`event-data` (optional)**: Data to send to the orchestration instance. This can be the path to a JSON file, or you can provide the data directly on the command line.
* **`connection-string-setting` (optional)**: Name of the application setting containing the storage connection string to use. The default is `AzureWebJobsStorage`.
* **`task-hub-name` (optional)**: Name of the Durable Functions task hub to use. The default is `DurableFunctionsHub`. It can also be set in [host.json](durable-functions-bindings.md#host-json), by using durableTask:HubName.

```bash
func durable raise-event --id 0ab8c55a66644d68a3a8b220b12d209c --event-name MyEvent --event-data @eventdata.json
```

```bash
func durable raise-event --id 1234567 --event-name MyOtherEvent --event-data 3
```

## Wait for orchestration completion

In long-running orchestrations, you may want to wait and get the results of an orchestration. In these cases, it's also useful to be able to define a timeout period on the orchestration. If the timeout is exceeded, the state of the orchestration should be returned instead of the results.

The [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) class exposes a [WaitForCompletionOrCreateCheckStatusResponseAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_WaitForCompletionOrCreateCheckStatusResponseAsync_) API in .NET. You can use this API to get the actual output from an orchestration instance synchronously. In JavaScript, the `DurableOrchestrationClient` class exposes a `waitForCompletionOrCreateCheckStatusResponse` API for the same purpose. When they are not set, the methods use a default value of 10 seconds for `timeout`, and 1 second for `retryInterval`.  

Here is an example HTTP-trigger function that demonstrates how to use this API:

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/HttpSyncStart.cs)]

[!code-javascript[Main](~/samples-durable-functions/samples/javascript/HttpSyncStart/index.js)]

Call the function with the following line. Use 2 seconds for the timeout and 0.5 seconds for the retry interval:

```bash
    http POST http://localhost:7071/orchestrators/E1_HelloSequence/wait?timeout=2&retryInterval=0.5
```

Depending on the time required to get the response from the orchestration instance, there are two cases:

* The orchestration instances complete within the defined timeout (in this case 2 seconds), and the response is the actual orchestration instance output, delivered synchronously:

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

* The orchestration instances can't complete within the defined timeout, and the response is the default one described in [HTTP API URL discovery](durable-functions-http-api.md):

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
> The format of the webhook URLs might differ, depending on which version of the Azure Functions host you are running. The preceding example is for the Azure Functions 2.x host.

## Retrieve HTTP management webhook URLs

You can use an external system to monitor or raise events to an orchestration. External systems can communicate with Durable Functions through the webhook URLs that are part of the default response described in [HTTP API URL discovery](durable-functions-http-api.md). However, the webhook URLs also can be accessed programmatically in the orchestration client or in an activity function. Do this by using the [CreateHttpManagementPayload](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_CreateHttpManagementPayload_) method of the [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) class (.NET), or the `createHttpManagementPayload` method of the `DurableOrchestrationClient` class (JavaScript).

[CreateHttpManagementPayload](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_CreateHttpManagementPayload_) and `createHttpManagementPayload` have one parameter:

* **instanceId**: The unique ID of the instance.

The methods return an instance of [HttpManagementPayload](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.Extensions.DurableTask.HttpManagementPayload.html#Microsoft_Azure_WebJobs_Extensions_DurableTask_HttpManagementPayload_) (.NET) or an object (JavaScript), with the following string properties:

* **Id**: The instance ID of the orchestration (should be the same as the `InstanceId` input).
* **StatusQueryGetUri**: The status URL of the orchestration instance.
* **SendEventPostUri**: The "raise event" URL of the orchestration instance.
* **TerminatePostUri**: The "terminate" URL of the orchestration instance.
* **RewindPostUri**: The "rewind" URL of the orchestration instance.

Activity functions can send an instance of these objects to external systems to monitor or raise events to an orchestration:

### C#

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

### JavaScript (Functions 2.x only)

```javascript
const df = require("durable-functions");

modules.exports = async function(context, ctx) {
    const client = df.getClient(context);

    const payload = client.createHttpManagementPayload(ctx.instanceId);

    // send the payload to Cosmos DB
    context.bindings.document = JSON.stringify({
        id: ctx.instanceId,
        payload,
    });
};
```

## Rewind instances (preview)

If you have an orchestration failure for an unexpected reason, you can *rewind* the instance to a previously healthy state by using an API built for that purpose.

> [!NOTE]
> This API is not intended to be a replacement for proper error handling and retry policies. Rather, it is intended to be used only in cases where orchestration instances fail for unexpected reasons. For more details on error handling and retry policies, see the [Error handling](durable-functions-error-handling.md) topic.

Use the [RewindAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_RewindAsync_System_String_System_String_) (.NET) or `rewindAsync` (JavaScript) API to put the orchestration back into the *Running* state. Rerun the activity or suborchestration execution failures that caused the orchestration failure.

For example, let's say you have a workflow involving a series of [human approvals](durable-functions-concepts.md#human). Suppose there are a series of activity functions that notify someone that their approval is needed, and wait out the real-time response. After all of the approval activities have received responses or timed out, suppose that another activity fails due to an application misconfiguration, such as an invalid database connection string. The result is an orchestration failure deep into the workflow. With the `RewindAsync` (.NET) or `rewindAsync` (JavaScript) API, an application administrator can fix the configuration error, and rewind the failed orchestration back to the state immediately before the failure. None of the human-interaction steps need to be reapproved, and the orchestration can now complete successfully.

> [!NOTE]
> The *rewind* feature doesn't support rewinding orchestration instances that use durable timers.

### C#

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

### JavaScript (Functions 2.x only)

```javascript
const df = require("durable-functions");

module.exports = async function(context, instanceId) {
    const client = df.getClient(context);

    const reason = "Orchestrator failed and needs to be revived.";
    return client.rewind(instanceId, reason);
};
```

### Azure Functions Core Tools

You can also rewind an orchestration instance directly by using the [Azure Functions Core Tools](../functions-run-local.md) `durable rewind` command. It takes the following parameters:

* **`id` (required)**: ID of the orchestration instance.
* **`reason` (optional)**: Reason for rewinding the orchestration instance.
* **`connection-string-setting` (optional)**: Name of the application setting containing the storage connection string to use. The default is `AzureWebJobsStorage`.
* **`task-hub-name` (optional)**: Name of the Durable Functions task hub to use. The default is `DurableFunctionsHub`. It can also be set in [host.json](durable-functions-bindings.md#host-json), by using durableTask:HubName.

```bash
func durable rewind --id 0ab8c55a66644d68a3a8b220b12d209c --reason "Orchestrator failed and needs to be revived."
```

## Purge instance history

To remove all the data associated with an orchestration, you can purge the instance history. For example, you might want to get rid of Azure Table rows and large message blobs, if they exist. To do so, use the [PurgeInstanceHistoryAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_PurgeInstanceHistoryAsync_) API.

> [!NOTE]
> The `PurgeInstanceHistoryAsync` API is currently available only for C#.

 The method has two overloads. The first one purges history by the ID of the orchestration instance:

```csharp
[FunctionName("PurgeInstanceHistory")]
public static Task Run(
    [OrchestrationClient] DurableOrchestrationClient client,
    [ManualTrigger] string instanceId)
{
    return client.PurgeInstanceHistoryAsync(instanceId);
}
```

The second example shows a timer-triggered function that purges the history for all orchestration instances that completed after the specified time interval. In this case, it removes data for all instances completed 30 or more days ago. It's scheduled to run once per day, at 12 AM:

```csharp
[FunctionName("PurgeInstanceHistory")]
public static Task Run(
    [OrchestrationClient] DurableOrchestrationClient client,
    [TimerTrigger("0 0 12 * * *")]TimerInfo myTimer)
{
    return client.PurgeInstanceHistoryAsync(
                    DateTime.MinValue,
                    DateTime.UtcNow.AddDays(-30),  
                    new List<OrchestrationStatus>
                    {
                        OrchestrationStatus.Completed
                    });
}
```

> [!NOTE]
> For the time-triggered function process to succeed, the runtime status must be **Completed**, **Terminated**, or **Failed**.

### Azure Functions Core Tools

You can purge an orchestration instance's history by using the [Azure Functions Core Tools](../functions-run-local.md) `durable purge-history` command. Similar to the second C# example in the preceding section, it purges the history for all orchestration instances created during a specified time interval. You can further filter purged instances by runtime status. The command has several parameters:

* **`created-after` (optional)**: Purge the history of instances created after this date/time (UTC). ISO 8601 formatted datetimes accepted.
* **`created-before` (optional)**: Purge the history of instances created before this date/time (UTC). ISO 8601 formatted datetimes accepted.
* **`runtime-status` (optional)**: Purge the history of instances with a particular status (for example, running or completed). Can provide multiple (space separated) statuses.
* **`connection-string-setting` (optional)**: Name of the application setting containing the storage connection string to use. The default is `AzureWebJobsStorage`.
* **`task-hub-name` (optional)**: Name of the Durable Functions task hub to use. The default is `DurableFunctionsHub`. It can also be set in [host.json](durable-functions-bindings.md#host-json), by using durableTask:HubName.

The following command deletes the history of all failed instances created before November 14, 2018 at 7:35 PM (UTC).

```bash
func durable purge-history --created-before 2018-11-14T19:35:00.0000000Z --runtime-status failed
```

## Delete a task hub

Using the [Azure Functions Core Tools](../functions-run-local.md) `durable delete-task-hub` command, you can delete all storage artifacts associated with a particular task hub. This includes Azure storage tables, queues, and blobs. The command has two parameters:

* **`connection-string-setting` (optional)**: Name of the application setting containing the storage connection string to use. The default is `AzureWebJobsStorage`.
* **`task-hub-name` (optional)**: Name of the Durable Functions task hub to use. The default is `DurableFunctionsHub`. It can also be set in [host.json](durable-functions-bindings.md#host-json), by using durableTask:HubName.

The following command deletes all Azure storage data associated with the `UserTest` task hub.

```bash
func durable delete-task-hub --task-hub-name UserTest
```

## Next steps

> [!div class="nextstepaction"]
> [Learn how to use the HTTP APIs for instance management](durable-functions-http-api.md)
