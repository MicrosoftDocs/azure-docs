---
title: HTTP APIs in Durable Functions - Azure
description: Learn how to implement HTTP APIs in the Durable Functions extension for Azure Functions.
services: functions
author: cgillum
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 09/06/2018
ms.author: azfuncdf
---

# HTTP APIs in Durable Functions (Azure Functions)

The Durable Task extension exposes a set of HTTP APIs that can be used to perform the following tasks:

* Fetch the status of an orchestration instance.
* Send an event to a waiting orchestration instance.
* Terminate a running orchestration instance.


Each of these HTTP APIs is a webhook operation that is handled directly by the Durable Task extension. They are not specific to any function in the function app.

> [!NOTE]
> These operations can also be invoked directly using the instance management APIs on the [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) class. For more information, see [Instance Management](durable-functions-instance-management.md).

## HTTP API URL discovery

The [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html)  class exposes a [CreateCheckStatusResponse](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_CreateCheckStatusResponse_) API that can be used to generate an HTTP response payload containing links to all the supported operations. Here is an example HTTP-trigger function that demonstrates how to use this API:

[!code-csharp[Main](~/samples-durable-functions/samples/csx/HttpStart/run.csx)]

This example function produces the following JSON response data. The data type of all fields is `string`.

| Field             |Description                           |
|-------------------|--------------------------------------|
| id                |The ID of the orchestration instance. |
| statusQueryGetUri |The status URL of the orchestration instance. |
| sendEventPostUri  |The "raise event" URL of the orchestration instance. |
| terminatePostUri  |The "terminate" URL of the orchestration instance. |
| rewindPostUri     |The "rewind" URL of the orchestration instance. |

Here is an example response:

```http
HTTP/1.1 202 Accepted
Content-Length: 923
Content-Type: application/json; charset=utf-8
Location: https://{host}/runtime/webhooks/durabletask/instances/34ce9a28a6834d8492ce6a295f1a80e2?taskHub=DurableFunctionsHub&connection=Storage&code=XXX

{
    "id":"34ce9a28a6834d8492ce6a295f1a80e2",
    "statusQueryGetUri":"https://{host}/runtime/webhooks/durabletask/instances/34ce9a28a6834d8492ce6a295f1a80e2?taskHub=DurableFunctionsHub&connection=Storage&code=XXX",
    "sendEventPostUri":"https://{host}/runtime/webhooks/durabletask/instances/34ce9a28a6834d8492ce6a295f1a80e2/raiseEvent/{eventName}?taskHub=DurableFunctionsHub&connection=Storage&code=XXX",
    "terminatePostUri":"https://{host}/runtime/webhooks/durabletask/instances/34ce9a28a6834d8492ce6a295f1a80e2/terminate?reason={text}&taskHub=DurableFunctionsHub&connection=Storage&code=XXX",
    "rewindPostUri":"https://{host}/runtime/webhooks/durabletask/instances/34ce9a28a6834d8492ce6a295f1a80e2/rewind?reason={text}&taskHub=DurableFunctionsHub&connection=Storage&code=XXX"
}
```
> [!NOTE]
> The format of the webhook URLs may differ depending on which version of the Azure Functions host you are running. The above example is for the Azure Functions 2.0 host.

## Async operation tracking

The HTTP response mentioned previously is designed to help implementing long-running HTTP async APIs with Durable Functions. This is sometimes referred to as the *Polling Consumer Pattern*. The client/server flow works as follows:

1. The client issues an HTTP request to start a long running process, such as an orchestrator function.
2. The target HTTP trigger returns an HTTP 202 response with a `Location` header with the `statusQueryGetUri` value.
3. The client polls the URL in the `Location` header. It continues to see HTTP 202 responses with a `Location` header.
4. When the instance completes (or fails), the endpoint in the `Location` header returns HTTP 200.

This protocol allows coordinating long-running processes with external clients or services that support polling an HTTP endpoint and following the `Location` header. The fundamental pieces are already built into the Durable Functions HTTP APIs.

> [!NOTE]
> By default, all HTTP-based actions provided by [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/) support the standard asynchronous operation pattern. This capability makes it possible to embed a long-running durable function as part of a Logic Apps workflow. More details on Logic Apps support for asynchronous HTTP patterns can be found in the [Azure Logic Apps workflow actions and triggers documentation](../logic-apps/logic-apps-workflow-actions-triggers.md#asynchronous-patterns).

## HTTP API reference

All HTTP APIs implemented by the extension take the following parameters. The data type of all parameters is `string`.

| Parameter  | Parameter Type  | Description |
|------------|-----------------|-------------|
| instanceId | URL             | The ID of the orchestration instance. |
| taskHub    | Query string    | The name of the [task hub](durable-functions-task-hubs.md). If not specified, the current function app's task hub name is assumed. |
| connection | Query string    | The **name** of the connection string for the storage account. If not specified, the default connection string for the function app is assumed. |
| systemKey  | Query string    | The authorization key required to invoke the API. |
| showHistory| Query string    | Optional parameter. If set to `true`, the orchestration execution history will be included in the response payload.| 
| showHistoryOutput| Query string    | Optional parameter. If set to `true`, the activity outputs will be included in the orchestration execution history.| 
| createdTimeFrom  | Query string    | Optional parameter. When specified, filters the list of returned instances which were created at or after the given ISO8601 timestamp.|
| createdTimeTo    | Query string    | Optional parameter. When specified, filters the list of returned instances which were created at or before the given ISO8601 timestamp.|
| runtimeStatus    | Query string    | Optional parameter. When specified, filters the list of returned instances based on their runtime status. To see the list of possible runtime status values, see the [Querying instances](durable-functions-instance-management.md) topic. |

`systemKey` is an authorization key auto-generated by the Azure Functions host. It specifically grants access to the Durable Task extension APIs and can be managed the same way as [other authorization keys](https://github.com/Azure/azure-webjobs-sdk-script/wiki/Key-management-API). The simplest way to discover the `systemKey` value is by using the `CreateCheckStatusResponse` API mentioned previously.

The next few sections cover the specific HTTP APIs supported by the extension and provide examples of how they can be used.

### Get instance status

Gets the status of a specified orchestration instance.

#### Request

For Functions 1.0, the request format is as follows:

```http
GET /admin/extensions/DurableTaskExtension/instances/{instanceId}?taskHub={taskHub}&connection={connection}&code={systemKey}
```

The Functions 2.0 format has all the same parameters but has a slightly different URL prefix:

```http
GET /runtime/webhooks/durabletask/instances/{instanceId}?taskHub={taskHub}&connection={connection}&code={systemKey}&showHistory={showHistory}&showHistoryOutput={showHistoryOutput}
```

#### Response

Several possible status code values can be returned.

* **HTTP 200 (OK)**: The specified instance is in a completed state.
* **HTTP 202 (Accepted)**: The specified instance is in progress.
* **HTTP 400 (Bad Request)**: The specified instance failed or was terminated.
* **HTTP 404 (Not Found)**: The specified instance doesn't exist or has not started running.
* **HTTP 500 (Internal Server Error)**: The specified instance failed with an unhandled exception.

The response payload for the **HTTP 200** and **HTTP 202** cases is a JSON object with the following fields:

| Field           | Data type | Description |
|-----------------|-----------|-------------|
| runtimeStatus   | string    | The runtime status of the instance. Values include *Running*, *Pending*, *Failed*, *Canceled*, *Terminated*, *Completed*. |
| input           | JSON      | The JSON data used to initialize the instance. |
| customStatus    | JSON      | The JSON data used for custom orchestration status. This field is `null` if not set. |
| output          | JSON      | The JSON output of the instance. This field is `null` if the instance is not in a completed state. |
| createdTime     | string    | The time at which the instance was created. Uses ISO 8601 extended notation. |
| lastUpdatedTime | string    | The time at which the instance last persisted. Uses ISO 8601 extended notation. |
| historyEvents   | JSON      | A JSON array containing the orchestration execution history. This field is `null` unless the `showHistory` query string parameter is set to `true`.  | 

Here is an example response payload including the orchestration execution history and activity outputs (formatted for readability):

```json
{
  "createdTime": "2018-02-28T05:18:49Z",
  "historyEvents": [
      {
          "EventType": "ExecutionStarted",
          "FunctionName": "E1_HelloSequence",
          "Timestamp": "2018-02-28T05:18:49.3452372Z"
      },
      {
          "EventType": "TaskCompleted",
          "FunctionName": "E1_SayHello",
          "Result": "Hello Tokyo!",
          "ScheduledTime": "2018-02-28T05:18:51.3939873Z",
          "Timestamp": "2018-02-28T05:18:52.2895622Z"
      },
      {
          "EventType": "TaskCompleted",
          "FunctionName": "E1_SayHello",
          "Result": "Hello Seattle!",
          "ScheduledTime": "2018-02-28T05:18:52.8755705Z",
          "Timestamp": "2018-02-28T05:18:53.1765771Z"
      },
      {
          "EventType": "TaskCompleted",
          "FunctionName": "E1_SayHello",
          "Result": "Hello London!",
          "ScheduledTime": "2018-02-28T05:18:53.5170791Z",
          "Timestamp": "2018-02-28T05:18:53.891081Z"
      },
      {
          "EventType": "ExecutionCompleted",
          "OrchestrationStatus": "Completed",
          "Result": [
              "Hello Tokyo!",
              "Hello Seattle!",
              "Hello London!"
          ],
          "Timestamp": "2018-02-28T05:18:54.3660895Z"
      }
  ],
  "input": null,
  "customStatus": { "nextActions": ["A", "B", "C"], "foo": 2 },
  "lastUpdatedTime": "2018-02-28T05:18:54Z",
  "output": [
      "Hello Tokyo!",
      "Hello Seattle!",
      "Hello London!"
  ],
  "runtimeStatus": "Completed"
}
```

The **HTTP 202** response also includes a **Location** response header that references the same URL as the `statusQueryGetUri` field mentioned previously.


### Get all instances status

You can also query all instances status. Remove the `instanceId` from the 'Get instance status' request. The parameters are the same as the 'Get instance status.' 

One thing to remember is that `connection` and `code` are optional. If you have anonymous auth on the function then code isn't required.
If you don't want to use a different blob storage connection string other than defined in the AzureWebJobsStorage app setting, then you can safely ignore the connection query string parameter.

#### Request

For Functions 1.0, the request format is as follows:

```http
GET /admin/extensions/DurableTaskExtension/instances/?taskHub={taskHub}&connection={connection}&code={systemKey}
```

The Functions 2.0 format has all the same parameters but a slightly different URL prefix: 

```http
GET /runtime/webhooks/durabletask/instances/?taskHub={taskHub}&connection={connection}&code={systemKey}
```

#### Request with filters

You can filter the request.

For Functions 1.0, the request format is as follows:

```http
GET /admin/extensions/DurableTaskExtension/instances/?taskHub={taskHub}&connection={connection}&code={systemKey}&createdTimeFrom={createdTimeFrom}&createdTimeTo={createdTimeTo}&runtimeStatus={runtimeStatus,runtimeStatus,...}
```

The Functions 2.0 format has all the same parameters but a slightly different URL prefix: 

```http
GET /runtime/webhooks/durableTask/instances/?taskHub={taskHub}&connection={connection}&code={systemKey}&createdTimeFrom={createdTimeFrom}&createdTimeTo={createdTimeTo}&runtimeStatus={runtimeStatus,runtimeStatus,...}
```

#### Response

Here is an example of response payloads including the orchestration status (formatted for readability):

```json
[
    {
        "instanceId": "7af46ff000564c65aafbfe99d07c32a5",
        "runtimeStatus": "Completed",
        "input": null,
        "customStatus": null,
        "output": [
            "Hello Tokyo!",
            "Hello Seattle!",
            "Hello London!"
        ],
        "createdTime": "2018-06-04T10:46:39Z",
        "lastUpdatedTime": "2018-06-04T10:46:47Z"
    },
    {
        "instanceId": "80eb7dd5c22f4eeba9f42b062794321e",
        "runtimeStatus": "Running",
        "input": null,
        "customStatus": null,
        "output": null,
        "createdTime": "2018-06-04T15:18:28Z",
        "lastUpdatedTime": "2018-06-04T15:18:38Z"
    },
    {
        "instanceId": "9124518926db408ab8dfe84822aba2b1",
        "runtimeStatus": "Completed",
        "input": null,
        "customStatus": null,
        "output": [
            "Hello Tokyo!",
            "Hello Seattle!",
            "Hello London!"
        ],
        "createdTime": "2018-06-04T10:46:54Z",
        "lastUpdatedTime": "2018-06-04T10:47:03Z"
    },
    {
        "instanceId": "d100b90b903c4009ba1a90868331b11b",
        "runtimeStatus": "Pending",
        "input": null,
        "customStatus": null,
        "output": null,
        "createdTime": "2018-06-04T15:18:39Z",
        "lastUpdatedTime": "2018-06-04T15:18:39Z"
    }
]
```

> [!NOTE]
> This operation can be very expensive in terms of Azure Storage I/O if there are a lot of rows in the Instances table. More details on Instance table can be found in the [Performance and scale in Durable Functions (Azure Functions)](https://docs.microsoft.com/azure/azure-functions/durable-functions-perf-and-scale#instances-table) documentation.
> 


### Raise event

Sends an event notification message to a running orchestration instance.

#### Request

For Functions 1.0, the request format is as follows:

```http
POST /admin/extensions/DurableTaskExtension/instances/{instanceId}/raiseEvent/{eventName}?taskHub=DurableFunctionsHub&connection={connection}&code={systemKey}
```

The Functions 2.0 format has all the same parameters but has a slightly different URL prefix:

```http
POST /runtime/webhooks/durabletask/instances/{instanceId}/raiseEvent/{eventName}?taskHub=DurableFunctionsHub&connection={connection}&code={systemKey}
```

Request parameters for this API include the default set mentioned previously as well as the following unique parameters:

| Field       | Parameter type  | Data tType | Description |
|-------------|-----------------|-----------|-------------|
| eventName   | URL             | string    | The name of the event that the target orchestration instance is waiting on. |
| {content}   | Request content | JSON      | The JSON-formatted event payload. |

#### Response

Several possible status code values can be returned.

* **HTTP 202 (Accepted)**: The raised event was accepted for processing.
* **HTTP 400 (Bad request)**: The request content was not of type `application/json` or was not valid JSON.
* **HTTP 404 (Not Found)**: The specified instance was not found.
* **HTTP 410 (Gone)**: The specified instance has completed or failed and cannot process any raised events.

Here is an example request that sends the JSON string `"incr"` to an instance waiting for an event named **operation**:

```
POST /admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a/raiseEvent/operation?taskHub=DurableFunctionsHub&connection=Storage&code=XXX
Content-Type: application/json
Content-Length: 6

"incr"
```

The responses for this API do not contain any content.

### Terminate instance

Terminates a running orchestration instance.

#### Request

For Functions 1.0, the request format is as follows:

```http
POST /admin/extensions/DurableTaskExtension/instances/{instanceId}/terminate?reason={reason}&taskHub={taskHub}&connection={connection}&code={systemKey}
```

The Functions 2.0 format has all the same parameters but has a slightly different URL prefix:

```http
POST /runtime/webhooks/durabletask/instances/{instanceId}/terminate?reason={reason}&taskHub={taskHub}&connection={connection}&code={systemKey}
```

Request parameters for this API include the default set mentioned previously as well as the following unique parameter.

| Field       | Parameter Type  | Data Type | Description |
|-------------|-----------------|-----------|-------------|
| reason      | Query string    | string    | Optional. The reason for terminating the orchestration instance. |

#### Response

Several possible status code values can be returned.

* **HTTP 202 (Accepted)**: The terminate request was accepted for processing.
* **HTTP 404 (Not Found)**: The specified instance was not found.
* **HTTP 410 (Gone)**: The specified instance has completed or failed.

Here is an example request that terminates a running instance and specifies a reason of **buggy**:

```
POST /admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a/terminate?reason=buggy&taskHub=DurableFunctionsHub&connection=Storage&code=XXX
```

The responses for this API do not contain any content.

## Rewind instance (preview)

Restores a failed orchestration instance into a running state by replaying the most recent failed operations.

#### Request

For Functions 1.0, the request format is as follows:

```http
POST /admin/extensions/DurableTaskExtension/instances/{instanceId}/rewind?reason={reason}&taskHub={taskHub}&connection={connection}&code={systemKey}
```

The Functions 2.0 format has all the same parameters but has a slightly different URL prefix:

```http
POST /runtime/webhooks/durabletask/instances/{instanceId}/rewind?reason={reason}&taskHub={taskHub}&connection={connection}&code={systemKey}
```

Request parameters for this API include the default set mentioned previously as well as the following unique parameter.

| Field       | Parameter Type  | Data Type | Description |
|-------------|-----------------|-----------|-------------|
| reason      | Query string    | string    | Optional. The reason for rewinding the orchestration instance. |

#### Response

Several possible status code values can be returned.

* **HTTP 202 (Accepted)**: The rewind request was accepted for processing.
* **HTTP 404 (Not Found)**: The specified instance was not found.
* **HTTP 410 (Gone)**: The specified instance has completed or was terminated.

Here is an example request that rewinds a failed instance and specifies a reason of **fixed**:

```
POST /admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a/rewind?reason=fixed&taskHub=DurableFunctionsHub&connection=Storage&code=XXX
```

The responses for this API do not contain any content.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to handle errors](durable-functions-error-handling.md)
