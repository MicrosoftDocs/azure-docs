---
title: HTTP APIs in Durable Functions - Azure
description: Learn how to implement HTTP APIs in the Durable Functions extension for Azure Functions.
services: functions
author: cgillum
manager: cfowler
editor: ''
tags: ''
keywords:
ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 09/29/2017
ms.author: azfuncdf
---

# HTTP APIs in Durable Functions (Azure Functions)

The Durable Task extension exposes a set of HTTP APIs that can be used to perform the following tasks:

* Fetch the status of an orchestration instance.
* Send an event to a waiting orchestration instance.
* Terminate a running orchestration instance.

Each of these HTTP APIs are webhook operations that are handled directly by the Durable Task extension. They are not specific to any function in the function app.

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

Here is an example response:

```http
HTTP/1.1 202 Accepted
Content-Length: 923
Content-Type: application/json; charset=utf-8
Location: https://{host}/webhookextensions/handler/DurableTaskExtension/instances/34ce9a28a6834d8492ce6a295f1a80e2?taskHub=DurableFunctionsHub&connection=Storage&code=XXX

{
    "id":"34ce9a28a6834d8492ce6a295f1a80e2",
    "statusQueryGetUri":"https://{host}/webhookextensions/handler/DurableTaskExtension/instances/34ce9a28a6834d8492ce6a295f1a80e2?taskHub=DurableFunctionsHub&connection=Storage&code=XXX",
    "sendEventPostUri":"https://{host}/webhookextensions/handler/DurableTaskExtension/instances/34ce9a28a6834d8492ce6a295f1a80e2/raiseEvent/{eventName}?taskHub=DurableFunctionsHub&connection=Storage&code=XXX",
    "terminatePostUri":"https://{host}/webhookextensions/handler/DurableTaskExtension/instances/34ce9a28a6834d8492ce6a295f1a80e2/terminate?reason={text}&taskHub=DurableFunctionsHub&connection=Storage&code=XXX"
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
> By default, all HTTP-based actions provided by [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/) support the standard asynchronous operation pattern. This makes it possible to embed a long-running durable function as part of a Logic Apps workflow. More details on Logic Apps support for asynchronous HTTP patterns can be found in the [Azure Logic Apps workflow actions and triggers documentation](../logic-apps/logic-apps-workflow-actions-triggers.md#asynchronous-patterns).

## HTTP API reference

All HTTP APIs implemented by the extension take the following parameters. The data type of all parameters is `string`.

| Parameter  | Parameter Type  | Description |
|------------|-----------------|-------------|
| instanceId | URL             | The ID of the orchestration instance. |
| taskHub    | Query string    | The name of the [task hub](durable-functions-task-hubs.md). If not specified, the current function app's task hub name is assumed. |
| connection | Query string    | The **name** of the connection string for the storage account. If not specified, the default connection string for the function app is assumed. |
| systemKey  | Query string    | The authorization key required to invoke the API. |

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
GET /webhookextensions/handler/DurableTaskExtension/instances/{instanceId}?taskHub={taskHub}&connection={connection}&code={systemKey}
```

#### Response

Several possible status code values can be returned.

* **HTTP 200 (OK)**: The specified instance is in a completed state.
* **HTTP 202 (Accepted)**: The specified instance is in progress.
* **HTTP 400 (Bad Request)**: The specified instance failed or was terminated.
* **HTTP 404 (Not Found)**: The specified instance doesn't exist or has not started running.

The response payload for the **HTTP 200** and **HTTP 202** cases is a JSON object with the following fields.

| Field           | Data type | Description |
|-----------------|-----------|-------------|
| runtimeStatus   | string    | The runtime status of the instance. Values include *Running*, *Pending*, *Failed*, *Canceled*, *Terminated*, *Completed*. |
| input           | JSON      | The JSON data used to initialize the instance. |
| output          | JSON      | The JSON output of the instance. This field is `null` if the instance is not in a completed state. |
| createdTime     | string    | The time at which the instance was created. Uses ISO 8601 extended notation. |
| lastUpdatedTime | string    | The time at which the instance last persisted. Uses ISO 8601 extended notation. |

Here is an example response payload (formatted for readability):

```json
{
  "runtimeStatus": "Completed",
  "input": null,
  "output": [
    "Hello Tokyo!",
    "Hello Seattle!",
    "Hello London!"
  ],
  "createdTime": "2017-10-06T18:30:24Z",
  "lastUpdatedTime": "2017-10-06T18:30:30Z"
}
```

The **HTTP 202** response also includes a **Location** response header that references the same URL as the `statusQueryGetUri` field mentioned previously.

### Raise event

Sends an event notification message to a running orchestration instance.

#### Request

For Functions 1.0, the request format is as follows:

```http
POST /admin/extensions/DurableTaskExtension/instances/{instanceId}/raiseEvent/{eventName}?taskHub=DurableFunctionsHub&connection={connection}&code={systemKey}
```

The Functions 2.0 format has all the same parameters but has a slightly different URL prefix:

```http
POST /webhookextensions/handler/DurableTaskExtension/instances/{instanceId}/raiseEvent/{eventName}?taskHub=DurableFunctionsHub&connection={connection}&code={systemKey}
```

Request parameters for this API include the default set mentioned previously as well as the following unique parameters.

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

Here is an example request that sends the JSON string `"incr"` to an instance waiting for an event named **operation** (taken from the [Counter](durable-functions-counter.md) sample):

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
DELETE /admin/extensions/DurableTaskExtension/instances/{instanceId}/terminate?reason={reason}&taskHub={taskHub}&connection={connection}&code={systemKey}
```

The Functions 2.0 format has all the same parameters but has a slightly different URL prefix:

```http
DELETE /webhookextensions/handler/DurableTaskExtension/instances/{instanceId}/terminate?reason={reason}&taskHub={taskHub}&connection={connection}&code={systemKey}
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
DELETE /admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a/terminate?reason=buggy&taskHub=DurableFunctionsHub&connection=Storage&code=XXX
```

The responses for this API do not contain any content.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to handle errors](durable-functions-error-handling.md)
