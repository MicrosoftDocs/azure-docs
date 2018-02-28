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
* Get synchronously the output of an orchestration instance if completed within the allowed timeout period.

Each of these HTTP APIs is webhook operations that are handled directly by the Durable Task extension. They are not specific to any function in the function app.

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
> The format of the webhook URLs may differ depending on which version of the Azure Functions host you are running. The approach is for the Azure Functions 2.0 host.

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
| showHistory| Query string    | Optional parameter. If set to `true`, the orchestration execution history will be provided in the response.| 
| showHistoryOutput| Query string    | Optional parameter. If set to `true`, the activity outputs will be included in the orchestration execution history.| 

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
GET /webhookextensions/handler/DurableTaskExtension/instances/{instanceId}?taskHub={taskHub}&connection={connection}&code={systemKey}&showHistory={showHistory}&showHistoryOutput={showHistoryOutput}
```

#### Response

Several possible status code values can be returned.

* **HTTP 200 (OK)**: The specified instance is in a completed state.
* **HTTP 202 (Accepted)**: The specified instance is in progress.
* **HTTP 400 (Bad Request)**: The specified instance failed or was terminated.
* **HTTP 404 (Not Found)**: The specified instance doesn't exist or has not started running.

The response payload for the **HTTP 200** and **HTTP 202** cases is a JSON object with the following fields:

| Field           | Data type | Description |
|-----------------|-----------|-------------|
| runtimeStatus   | string    | The runtime status of the instance. Values include *Running*, *Pending*, *Failed*, *Canceled*, *Terminated*, *Completed*. |
| input           | JSON      | The JSON data used to initialize the instance. |
| output          | JSON      | The JSON output of the instance. This field is `null` if the instance is not in a completed state. |
| createdTime     | string    | The time at which the instance was created. Uses ISO 8601 extended notation. |
| lastUpdatedTime | string    | The time at which the instance last persisted. Uses ISO 8601 extended notation. |
| historyEvents   | JSON      | If `showHistory` query string parameter is set to `true`, the orchestration execution history will be added to the response. | 

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


## HTTP API synchronous response

The [DurableOrchestrationClient](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html) class exposes a [WaitForCompletionOrCreateCheckStatusResponseAsync](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html#Microsoft_Azure_WebJobs_DurableOrchestrationClient_WaitForCompletionOrCreateCheckStatusResponseAsync_) API that can be used to get synchronously the actual output from an orchestration instance. Here is an example HTTP-trigger function that demonstrates how to use this API with **2-seconds timeout** and **0.5-second retry interval**.

First, the function can be called with the following line:

```bash
    http POST http://localhost:7071/orchestrators/E1_HelloSequence/wait?timeout=2&retryInterval=0.5
```

Then the code that processes the HTTP request is:

<!-- The comments on the next line will be removed once the new feature is merged in master. -->
<!--[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/HttpSyncStart.cs)]-->
```csharp
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;

namespace VSSample
{
    public static class HttpSyncStart
    {
        private const string Timeout = "timeout";
        private const string RetryInterval = "retryInterval";

        [FunctionName("HttpSyncStart")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(
            AuthorizationLevel.Function, methods: "post", Route = "orchestrators/{functionName}/wait")]
            HttpRequestMessage req,
            [OrchestrationClient] DurableOrchestrationClientBase starter,
            string functionName,
            TraceWriter log)
        {
            // Function input comes from the request content.
            dynamic eventData = await req.Content.ReadAsAsync<object>();
            string instanceId = await starter.StartNewAsync(functionName, eventData);

            log.Info($"Started orchestration with ID = '{instanceId}'.");

            TimeSpan? timeout = GetTimeSpan(req, Timeout);
            TimeSpan? retryInterval = GetTimeSpan(req, RetryInterval);
            
            return await starter.WaitForCompletionOrCreateCheckStatusResponseAsync(
                req,
                instanceId,
                timeout,
                retryInterval);
        }

        private static TimeSpan? GetTimeSpan(HttpRequestMessage request, string queryParameterName)
        {
            var queryParameterStringValue = request.GetQueryNameValuePairs()?
                .FirstOrDefault(x => x.Key == queryParameterName)
                .Value;
            if (string.IsNullOrEmpty(queryParameterStringValue)) { return null; }
            return TimeSpan.FromSeconds(double.Parse(queryParameterStringValue));
        }
    }
}

```

And depending on the time required to get the response from the orchestration instance there are two cases:

1. The **orchestration instances complete within the defined timeout** (in this case 2 seconds), then the response is the actual orchestration instance output delivered synchronously:

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

2. The **orchestration instances cannot complete within the defined timeout** (in this case 2 seconds), then the response is the default one described in **HTTP API URL discovery**:

```http
    HTTP/1.1 202 Accepted
    Content-Type: application/json; charset=utf-8
    Date: Thu, 14 Dec 2017 06:13:51 GMT
    Location: http://localhost:7071/admin/extensions/DurableTaskExtension/instances/d3b72dddefce4e758d92f4d411567177?taskHub=SampleHubVS&connection=Storage&code=m3SSX//9kxava8OfPn1/LQbYdEge59JxMwiPSPB11EuTzbqFIAn1HA==
    Retry-After: 10
    Server: Microsoft-HTTPAPI/2.0
    Transfer-Encoding: chunked

    {
        "id": "d3b72dddefce4e758d92f4d411567177",
        "sendEventPostUri": "http://localhost:7071/admin/extensions/DurableTaskExtension/instances/d3b72dddefce4e758d92f4d411567177/raiseEvent/{eventName}?taskHub=SampleHubVS&connection=Storage&code=m3SSX//9kxava8OfPn1/LQbYdEge59JxMwiPSPB11EuTzbqFIAn1HA==",
        "statusQueryGetUri": "http://localhost:7071/admin/extensions/DurableTaskExtension/instances/d3b72dddefce4e758d92f4d411567177?taskHub=SampleHubVS&connection=Storage&code=m3SSX//9kxava8OfPn1/LQbYdEge59JxMwiPSPB11EuTzbqFIAn1HA==",
        "terminatePostUri": "http://localhost:7071/admin/extensions/DurableTaskExtension/instances/d3b72dddefce4e758d92f4d411567177/terminate?reason={text}&taskHub=SampleHubVS&connection=Storage&code=m3SSX//9kxava8OfPn1/LQbYdEge59JxMwiPSPB11EuTzbqFIAn1HA=="
    }
```

> [!NOTE]
> The format of the webhook URLs may differ depending on which version of the Azure Functions host you are running. The preceding example is for the Azure Functions 2.0 host.

## Synchronous response details

This HTTP response approach supports synchronous interaction. The client/server flow works as follows:

1. The client issues an HTTP request to start a long running process, such as an orchestrator function.
2. The orchestration instance is started.
3. The client is waiting for a response.
4. If the orchestration instance completes within the defined timeout, the target HTTP trigger returns an HTTP 200 response with the orchestration instance output delivered synchronously.
5. If the orchestration instance cannot complete within the defined timeout, the response is the default one described in **HTTP API URL discovery**.

This protocol allows coordinating long-running processes with external clients or services that support synchronous client/server communication. The fundamental pieces are already built into the Durable Functions HTTP APIs.

> [!NOTE]
> By default, all HTTP-based actions provided by [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/) support the standard asynchronous operation pattern. This capability makes it possible to embed a long-running durable function as part of a Logic Apps workflow. More details on Logic Apps support for asynchronous HTTP patterns can be found in the [Azure Logic Apps workflow actions and triggers documentation](../logic-apps/logic-apps-workflow-actions-triggers.md#asynchronous-patterns).

## Request 

If the HTTP trigger function has the following route `Route = "orchestrators/{functionName}/wait"` and it supports query string parameters for **timeout** and **retryInterval**, the request is:

```http
POST /orchestrators/E1_HelloSequence/wait?timeout={timeout}&retryInterval={retryInterval}
```

## Response 

Several possible status code values can be returned:

* **HTTP 200 (OK)**: The orchestration instance completed within the timeout and its output is provided in the response body.
* **HTTP 202 (Accepted)**: The orchestration instance did not complete within the timeout and the response is the default one described in **HTTP API URL discovery**.
* **HTTP 400 (Bad Request)**: The **retryInterval** parameter has greater value than the **timeout** parameter.

## HTTP API reference

The `WaitForCompletionOrCreateCheckStatusResponseAsync` method takes the following parameters: 

| Parameter      | Parameter Type     | Description |
|----------------|--------------------|-------------|
| request        | HttpRequestMessage | The HTTP request that triggered the current function. |
| instanceId     | string             | The unique ID of the instance to check. |
| timeout        | TimeSpan           | Total allowed timeout for output from the durable function. The default value is 10 seconds.|
| retryInterval  | TimeSpan           | The timeout between checks for output from the durable function. The default value is 1 second. |


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
