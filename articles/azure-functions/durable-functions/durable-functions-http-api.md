---
title: HTTP APIs in Durable Functions - Azure Functions
description: Learn how to implement HTTP APIs in the Durable Functions extension for Azure Functions.
author: cgillum
ms.topic: reference
ms.service: azure-functions
ms.subservice: durable
ms.date: 01/23/2026
ms.author: azfuncdf
---

# HTTP API reference

The Durable Functions extension exposes a set of built-in HTTP APIs that can perform management tasks on [orchestrations](../../durable-task/common/programming-model-overview.md#orchestrators), [entities](../../durable-task/common/programming-model-overview.md#entities), and [task hubs](../../durable-task/common/durable-task-hubs.md). These HTTP APIs are extensibility webhooks that the Azure Functions host authorizes, but the Durable Functions extension handles directly.

Before using these HTTP APIs, make sure you have:

- A basic understanding of [Durable Task programming model concepts](../../durable-task/common/programming-model-overview.md) (orchestrators, activities, entities)
- A [Durable Functions project](../../durable-task/common/what-is-durable-task.md) initialized with configured bindings
- Access to your function app's base URL, task hub name, connection settings, and authorization key

## Base URL and common parameters

All HTTP APIs share the same base URL as your function app. When you develop locally using the [Azure Functions Core Tools](../functions-run-local.md), the base URL is typically `http://localhost:7071`. In the Azure Functions hosted service, the base URL is typically `https://{appName}.azurewebsites.net`. The extension also supports custom hostnames if configured on your App Service app.

All HTTP APIs implemented by the extension require the following parameters. The data type of all parameters is `string`.

| Parameter        | Parameter Type  | Description |
|------------------|-----------------|-------------|
| **`taskHub`**    | Query string    | The name of the [task hub](../../durable-task/common/durable-task-hubs.md). If not specified, the current function app's task hub name is assumed. |
| **`connection`** | Query string    | The **name** of the connection app setting for the backend storage provider. If not specified, the default connection configuration for the function app is assumed. |
| **`systemKey`**  | Query string    | The authorization key required to invoke the API. |

### How to obtain parameter values

**Using orchestration client bindings (recommended):**
Generate complete URLs automatically using [orchestration client binding](durable-functions-bindings.md#orchestration-client) APIs:
- .NET: `CreateCheckStatusResponse()`, `CreateHttpManagementPayload()`
- JavaScript: `createCheckStatusResponse()`, `createHttpManagementPayload()`

**Manual URL construction:**

- **`taskHub`**: Retrieved from `host.json` file:
  - **v2.x**: `extensions.durableTask.hubName`
  - **v1.x**: `durableTask.hubName`
  - Can also be configured via app settings using `%AppSettingName%` syntax

- **`connection`**: Name of the app setting containing the storage connection. Retrieved from `host.json`:
  - **v2.x**: `extensions.durableTask.storageProvider.connectionStringName` (defaults to `AzureWebJobsStorage` if not specified)
  - **v1.x**: `durableTask.azureStorageConnectionStringName` (defaults to `AzureWebJobsStorage` if not specified)
  - Can use connection strings or [identity-based connections](durable-functions-azure-storage-provider.md#identity-based-connections) (Microsoft Entra authentication)

- **`systemKey`**: Extension-specific authorization key for Durable Task APIs. Retrieved from Azure portal:
  1. Open your Function App
  1. Select **Functions** → **App keys** in the left menu
  1. Under **System keys** section, locate the key (usually auto-generated for the extension)
  1. Copy the key value
  
  ⚠️ **Security note**: The system key grants access to all Durable Functions HTTP APIs. Don't share it publicly or include it in client-side code.

Each HTTP API supports a consistent set of request/response patterns. The following sections provide information for each operation.

## Common API workflow

A typical orchestration lifecycle follows this sequence:

1. **Start orchestration** → `POST /runtime/webhooks/durabletask/orchestrators/{functionName}` → Returns instance ID and status URL
1. **Check status** → `GET /runtime/webhooks/durabletask/instances/{instanceId}` → Monitor progress
1. **Send event (optional)** → `POST /runtime/webhooks/durabletask/instances/{instanceId}/raiseEvent/{eventName}` → Send external signals
1. **Cleanup (optional)** → `DELETE /runtime/webhooks/durabletask/instances/{instanceId}` → Purge history

For operation details and request/response examples, see the reference below.

## Start orchestration

Starts executing a new instance of the specified orchestrator function.

### Request

> [!IMPORTANT]
> The URL format differs by Functions runtime version. Select the format that matches your environment.

**Functions runtime 2.x (recommended):**

```http
POST /runtime/webhooks/durabletask/orchestrators/{functionName}/{instanceId?}
     ?taskHub={taskHub}
     &connection={connectionName}
     &code={systemKey}
```

**Functions runtime 1.x (legacy):**

```http
POST /admin/extensions/DurableTaskExtension/orchestrators/{functionName}/{instanceId?}
     ?taskHub={taskHub}
     &connection={connectionName}
     &code={systemKey}
```

Request parameters for this API include the default set mentioned previously and the following unique parameters:

| Field              | Parameter type  | Description |
|--------------------|-----------------|-------------|
| **`functionName`** | URL             | The name of the orchestrator function to start. |
| **`instanceId`**   | URL             | Optional parameter. The ID of the orchestration instance. If not specified, the orchestrator function starts with a random instance ID. |
| **`{content}`**    | Request content | Optional. The JSON-formatted orchestrator function input. |

### Response

Several possible status code values can be returned.

- **HTTP 202 (Accepted)**: The specified orchestrator function was scheduled to start running. The `Location` response header contains a URL for polling the orchestration status.
- **HTTP 400 (Bad request)**: The specified orchestrator function doesn't exist, the specified instance ID isn't valid, or request content isn't valid JSON.

The following is an example request that starts a `RestartVMs` orchestrator function and includes a JSON object payload:

```http
POST /runtime/webhooks/durabletask/orchestrators/RestartVMs?code=XXX
Content-Type: application/json
Content-Length: 83

{
    "resourceGroup": "myRG",
    "subscriptionId": "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e"
}
```

The response payload for the **HTTP 202** cases is a JSON object with the following fields:

| Field                       | Description                          |
|-----------------------------|--------------------------------------|
| **`id`**                    |The ID of the orchestration instance. |
| **`statusQueryGetUri`**     |The status URL of the orchestration instance. |
| **`sendEventPostUri`**      |The "raise event" URL of the orchestration instance. |
| **`terminatePostUri`**      |The "terminate" URL of the orchestration instance. |
| **`purgeHistoryDeleteUri`** |The "purge history" URL of the orchestration instance. |
| **`rewindPostUri`**         |(preview) The "rewind" URL of the orchestration instance. |
| **`suspendPostUri`**        |The "suspend" URL of the orchestration instance. |
| **`resumePostUri`**         |The "resume" URL of the orchestration instance. |

The data type of all fields is `string`.

Here is an example response payload for an orchestration instance with `abc123` as its ID (formatted for readability):

```http
{
    "id": "abc123",
    "purgeHistoryDeleteUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123?code=XXX",
    "sendEventPostUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123/raiseEvent/{eventName}?code=XXX",
    "statusQueryGetUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123?code=XXX",
    "terminatePostUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123/terminate?reason={text}&code=XXX",
    "suspendPostUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123/suspend?reason={text}&code=XXX",
    "resumePostUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123/resume?reason={text}&code=XXX"
}
```

The HTTP response is intended to be compatible with the *Polling Consumer Pattern*. It also includes the following notable response headers:

- **Location**: The URL of the status endpoint, which contains the same value as the `statusQueryGetUri` field.
- **Retry-After**: The number of seconds to wait between polling operations. The default value is `10`.

For more information on the asynchronous HTTP polling pattern, see the [HTTP async operation tracking](durable-functions-http-features.md#async-operation-tracking) documentation.

## Get instance status

Gets the status of a specified orchestration instance. Use this to monitor orchestration progress and retrieve results.

### Request

**Functions runtime 2.x (recommended):**

```http
GET /runtime/webhooks/durabletask/instances/{instanceId}
    ?taskHub={taskHub}
    &connection={connectionName}
    &code={systemKey}
    &showHistory=[true|false]
    &showHistoryOutput=[true|false]
    &showInput=[true|false]
    &returnInternalServerErrorOnFailure=[true|false]
```

**Functions runtime 1.x (legacy):**

```http
GET /admin/extensions/DurableTaskExtension/instances/{instanceId}
    ?taskHub={taskHub}
    &connection={connectionName}
    &code={systemKey}
    &showHistory=[true|false]
    &showHistoryOutput=[true|false]
    &showInput=[true|false]
    &returnInternalServerErrorOnFailure=[true|false]
```

Request parameters for this API include the default set mentioned previously and the following unique parameters:

| Field                   | Parameter type  | Description |
|-------------------------|-----------------|-------------|
| **`instanceId`**        | URL             | The ID of the orchestration instance. |
| **`showInput`**         | Query string    | Optional parameter. If set to `false`, the function input isn't included in the response payload.|
| **`showHistory`**       | Query string    | Optional parameter. If set to `true`, the orchestration execution history is included in the response payload.|
| **`showHistoryOutput`** | Query string    | Optional parameter. If set to `true`, the function outputs are included in the orchestration execution history.|
| **`createdTimeFrom`**   | Query string    | Optional parameter. When specified, filters the list of returned instances that were created at or after the given ISO8601 timestamp.|
| **`createdTimeTo`**     | Query string    | Optional parameter. When specified, filters the list of returned instances that were created at or before the given ISO8601 timestamp.|
| **`runtimeStatus`**     | Query string    | Optional parameter. When specified, filters the list of returned instances based on their runtime status. To see the list of possible runtime status values, see the [Querying instances](../../durable-task/common/durable-task-instance-management.md) article. |
| **`returnInternalServerErrorOnFailure`**  | Query string    | Optional parameter. If set to `true`, this API returns an HTTP 500 response instead of a 200 if the instance is in a failure state. This parameter is intended for automated status polling scenarios. |

### Response

Several possible status code values can be returned.

- **HTTP 200 (OK)**: The specified instance is in a completed or failed state.
- **HTTP 202 (Accepted)**: The specified instance is in progress.
- **HTTP 400 (Bad Request)**: The specified instance failed or was terminated.
- **HTTP 404 (Not Found)**: The specified instance doesn't exist or hasn't started running.
- **HTTP 500 (Internal Server Error)**: Returned only when the `returnInternalServerErrorOnFailure` is set to `true` and the specified instance failed with an unhandled exception.

The response payload for the **HTTP 200** and **HTTP 202** cases is a JSON object with the following fields:

| Field                 | Data type | Description |
|-----------------------|-----------|-------------|
| **`runtimeStatus`**   | string    | The runtime status of the instance. Values include *Running*, *Pending*, *Failed*, *Canceled*, *Terminated*, *Completed*, *Suspended*. |
| **`input`**           | JSON      | The JSON data used to initialize the instance. This field is `null` if the `showInput` query string parameter is set to `false`.|
| **`customStatus`**    | JSON      | The JSON data used for custom orchestration status. This field is `null` if not set. |
| **`output`**          | JSON      | The JSON output of the instance. This field is `null` if the instance is not in a completed state. |
| **`createdTime`**     | string    | The time at which the instance was created. Uses ISO 8601 extended notation. |
| **`lastUpdatedTime`** | string    | The time at which the instance last persisted. Uses ISO 8601 extended notation. |
| **`historyEvents`**   | JSON      | A JSON array containing the orchestration execution history. This field is `null` unless the `showHistory` query string parameter is set to `true`. |

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

## Get all instances status

Queries the status of multiple orchestration instances at once. You can filter results by status, creation time, and instance ID prefix. Use this operation to monitor all active orchestrations or find specific instances.

### Request

**Functions runtime 2.x (recommended):**

```http
GET /runtime/webhooks/durabletask/instances?
    taskHub={taskHub}
    &connection={connectionName}
    &code={systemKey}
    &createdTimeFrom={timestamp}
    &createdTimeTo={timestamp}
    &runtimeStatus={runtimeStatus1,runtimeStatus2,...}
    &instanceIdPrefix={prefix}
    &showInput=[true|false]
    &top={integer}
```

**Functions runtime 1.x (legacy):**

```http
GET /admin/extensions/DurableTaskExtension/instances
    ?taskHub={taskHub}
    &connection={connectionName}
    &code={systemKey}
    &createdTimeFrom={timestamp}
    &createdTimeTo={timestamp}
    &runtimeStatus={runtimeStatus1,runtimeStatus2,...}
    &instanceIdPrefix={prefix}
    &showInput=[true|false]
    &top={integer}
```

Request parameters for this API include the default set mentioned previously and the following unique parameters:

| Field                   | Parameter type  | Description |
|-------------------------|-----------------|-------------|
| **`showInput`**         | Query string    | Optional parameter. If set to `false`, the function input isn't included in the response payload.|
| **`showHistoryOutput`** | Query string    | Optional parameter. If set to `true`, includes the function outputs in the orchestration execution history.|
| **`createdTimeFrom`**   | Query string    | Optional parameter. When specified, filters the list of returned instances that were created at or after the given ISO8601 timestamp.|
| **`createdTimeTo`**     | Query string    | Optional parameter. When specified, filters the list of returned instances that were created at or before the given ISO8601 timestamp.|
| **`runtimeStatus`**     | Query string    | Optional parameter. When specified, filters the list of returned instances based on their runtime status. To see the list of possible runtime status values, see the [Querying instances](../../durable-task/common/durable-task-instance-management.md) article. |
| **`instanceIdPrefix`**  | Query string    | Optional parameter. When specified, filters the list of returned instances to include only instances whose instance ID starts with the specified prefix string.  Available starting with [version 2.7.2](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask/2.7.2) of the extension. |
| **`top`**               | Query string    | Optional parameter. When specified, limits the number of instances returned by the query. |

### Response

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
> This operation can be expensive in terms of Azure Storage I/O if you're using the [Azure Storage provider](../../durable-task/common/durable-task-storage-providers.md#azure-storage) and there are many rows in the Instances table. For more information about the Instances table, see the [Azure Storage provider](durable-functions-azure-storage-provider.md#instances-table) documentation.

If more results exist, a continuation token is returned in the response header. The name of the header is `x-ms-continuation-token`.

> [!CAUTION]
> The query result might return fewer items than the limit specified by `top`. When you receive results, you should *always* check to see if there's a continuation token.

If you set the continuation token value in the next request header, you can get the next page of results. The name of the request header is also `x-ms-continuation-token`.

## Purge single instance history

Deletes the history and related artifacts for a specified orchestration instance. This operation frees storage resources and can't be undone.

### Request

**Functions runtime 2.x (recommended):**

```http
DELETE /runtime/webhooks/durabletask/instances/{instanceId}
    ?taskHub={taskHub}
    &connection={connection}
    &code={systemKey}
```

**Functions runtime 1.x (legacy):**

```http
DELETE /admin/extensions/DurableTaskExtension/instances/{instanceId}
    ?taskHub={taskHub}
    &connection={connection}
    &code={systemKey}
```

Request parameters for this API include the default set mentioned previously and the following unique parameters:

| Field             | Parameter type  | Description |
|-------------------|-----------------|-------------|
| **`instanceId`**  | URL             | The ID of the orchestration instance. |

### Response

The following HTTP status code values can be returned.

- **HTTP 200 (OK)**: The instance history was purged successfully.
- **HTTP 404 (Not Found)**: The specified instance doesn't exist.

The response payload for the **HTTP 200** case is a JSON object with the following field:

| Field                  | Data type | Description |
|------------------------|-----------|-------------|
| **`instancesDeleted`** | integer   | The number of instances deleted. For the single instance case, this value should always be `1`. |

Here is an example response payload (formatted for readability):

```json
{
    "instancesDeleted": 1
}
```

## Purge multiple instance histories

Deletes history and artifacts for multiple instances at once, filtered by status, creation time, or instance ID prefix. Use this to bulk-cleanup old instances and manage storage costs.

### Request

**Functions runtime 2.x (recommended):**

```http
DELETE /runtime/webhooks/durabletask/instances
    ?taskHub={taskHub}
    &connection={connectionName}
    &code={systemKey}
    &createdTimeFrom={timestamp}
    &createdTimeTo={timestamp}
    &runtimeStatus={runtimeStatus1,runtimeStatus2,...}
```

**Functions runtime 1.x (legacy):**

```http
DELETE /admin/extensions/DurableTaskExtension/instances
    ?taskHub={taskHub}
    &connection={connectionName}
    &code={systemKey}
    &createdTimeFrom={timestamp}
    &createdTimeTo={timestamp}
    &runtimeStatus={runtimeStatus1,runtimeStatus2,...}
```

Request parameters for this API include the default set mentioned previously and the following unique parameters:

| Field                 | Parameter type  | Description |
|-----------------------|-----------------|-------------|
| **`createdTimeFrom`** | Query string    | Filters the list of purged instances that were created at or after the given ISO8601 timestamp.|
| **`createdTimeTo`**   | Query string    | Optional parameter. When specified, filters the list of purged instances that were created at or before the given ISO8601 timestamp.|
| **`runtimeStatus`**   | Query string    | Optional parameter. When specified, filters the list of purged instances based on their runtime status. To see the list of possible runtime status values, see the [Querying instances](../../durable-task/common/durable-task-instance-management.md) article. |

> [!NOTE]
> This operation can be expensive in terms of Azure Storage I/O if you're using the [Azure Storage provider](../../durable-task/common/durable-task-storage-providers.md#azure-storage) and there are many rows in the Instances or History tables. For more information about these tables, see [Performance and scale in Durable Functions (Azure Functions)](durable-functions-azure-storage-provider.md#instances-table).

### Response

The following HTTP status code values can be returned.

- **HTTP 200 (OK)**: The instance history was purged successfully.
- **HTTP 404 (Not Found)**: No instances were found that match the filter expression.

The response payload for the **HTTP 200** case is a JSON object with the following field:

| Field                   | Data type | Description |
|-------------------------|-----------|-------------|
| **`instancesDeleted`**  | integer   | The number of instances deleted. |

Here is an example response payload (formatted for readability):

```json
{
    "instancesDeleted": 250
}
```

## Raise event

Sends an event notification message to a running orchestration instance. The orchestration must be waiting for this event by name using `WaitForExternalEvent` or `wait_for_external_event`.

### Request

**Functions runtime 2.x (recommended):**

```http
POST /runtime/webhooks/durabletask/instances/{instanceId}/raiseEvent/{eventName}
    ?taskHub={taskHub}
    &connection={connectionName}
    &code={systemKey}
```

**Functions runtime 1.x (legacy):**

```http
POST /admin/extensions/DurableTaskExtension/instances/{instanceId}/raiseEvent/{eventName}
    ?taskHub={taskHub}
    &connection={connectionName}
    &code={systemKey}
```

Request parameters for this API include the default set mentioned previously and the following unique parameters:

| Field             | Parameter type  | Description |
|-------------------|-----------------|-------------|
| **`instanceId`**  | URL             | The ID of the orchestration instance. |
| **`eventName`**   | URL             | The name of the event that the target orchestration instance is waiting on. |
| **`{content}`**   | Request content | The JSON-formatted event payload. |

### Response

Several possible status code values can be returned.

- **HTTP 202 (Accepted)**: The raised event was accepted for processing.
- **HTTP 400 (Bad request)**: The request content wasn't of type `application/json` or wasn't valid JSON.
- **HTTP 404 (Not Found)**: The specified instance wasn't found.
- **HTTP 410 (Gone)**: The specified instance has completed or failed and can't process any raised events.

Here is an example request that sends the JSON string `"incr"` to an instance waiting for an event named **operation**:

```http
POST /admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a/raiseEvent/operation?taskHub=DurableFunctionsHub&connection=Storage&code=XXX
Content-Type: application/json
Content-Length: 6

"incr"
```

The responses for this API don't contain any content.

## Terminate instance

Terminates a running orchestration instance.

### Request

**Functions runtime 2.x (recommended):**

```http
POST /runtime/webhooks/durabletask/instances/{instanceId}/terminate
    ?taskHub={taskHub}
    &connection={connectionName}
    &code={systemKey}
    &reason={text}
```

**Functions runtime 1.x (legacy):**

```http
POST /admin/extensions/DurableTaskExtension/instances/{instanceId}/terminate
    ?taskHub={taskHub}
    &connection={connectionName}
    &code={systemKey}
    &reason={text}
```

Request parameters for this API include the default set mentioned previously and the following unique parameter.

| Field             | Parameter Type  | Description |
|-------------------|-----------------|-------------|
| **`instanceId`**  | URL             | The ID of the orchestration instance. |
| **`reason`**      | Query string    | Optional. The reason for terminating the orchestration instance. |

### Response

Several possible status code values can be returned.

- **HTTP 202 (Accepted)**: The terminate request was accepted for processing.
- **HTTP 404 (Not Found)**: The specified instance wasn't found.
- **HTTP 410 (Gone)**: The specified instance has completed or failed.

Here is an example request that terminates a running instance and specifies a reason of **buggy**:

```
POST /admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a/terminate?reason=buggy&taskHub=DurableFunctionsHub&connection=Storage&code=XXX
```

The responses for this API don't contain any content.

## Suspend instance

Pauses a running orchestration instance without terminating it. The instance can be resumed later using the `resume` operation.

### Request

In version 2.x of the Functions runtime, the request is formatted as follows (multiple lines are shown for clarity):

```http
POST /runtime/webhooks/durabletask/instances/{instanceId}/suspend
    ?reason={text}
    &taskHub={taskHub}
    &connection={connectionName}
    &code={systemKey}
```

| Field             | Parameter Type  | Description |
|-------------------|-----------------|-------------|
| **`instanceId`**  | URL             | The ID of the orchestration instance. |
| **`reason`**      | Query string    | Optional. The reason for suspending the orchestration instance. |

### Response

Several possible status code values can be returned.

- **HTTP 202 (Accepted)**: The suspend request was accepted for processing. No response body is returned.
- **HTTP 404 (Not Found)**: The specified instance wasn't found.
- **HTTP 410 (Gone)**: The specified instance has completed, failed, or terminated and can't be suspended.

**Verification**: After receiving HTTP 202, query the instance status using `GET /runtime/webhooks/durabletask/instances/{instanceId}` to verify that `runtimeStatus` has changed to `"Suspended"`.

## Resume instance

Resumes execution of a previously suspended orchestration instance.

### Request

In version 2.x of the Functions runtime, the request is formatted as follows (multiple lines are shown for clarity):

```http
POST /runtime/webhooks/durabletask/instances/{instanceId}/resume
    ?reason={text}
    &taskHub={taskHub}
    &connection={connectionName}
    &code={systemKey}
```

| Field             | Parameter Type  | Description |
|-------------------|-----------------|-------------|
| **`instanceId`**  | URL             | The ID of the orchestration instance. |
| **`reason`**      | Query string    | Optional. The reason for resuming the orchestration instance. |

### Response

Several possible status code values can be returned.

- **HTTP 202 (Accepted)**: The resume request was accepted for processing. No response body is returned.
- **HTTP 404 (Not Found)**: The specified instance wasn't found.
- **HTTP 410 (Gone)**: The specified instance has completed, failed, or terminated and can't be resumed.

**Verification**: After receiving HTTP 202, query the instance status using `GET /runtime/webhooks/durabletask/instances/{instanceId}` to verify that `runtimeStatus` has changed to `"Running"`.

## Rewind instance (preview)

Restores a failed orchestration instance into a running state by replaying the most recent failed operations. This feature allows recovery from transient failures without manual intervention.

### Request

**Functions runtime 2.x (recommended):**

```http
POST /runtime/webhooks/durabletask/instances/{instanceId}/rewind
    ?taskHub={taskHub}
    &connection={connectionName}
    &code={systemKey}
    &reason={text}
```

**Functions runtime 1.x (legacy):**

```http
POST /admin/extensions/DurableTaskExtension/instances/{instanceId}/rewind
    ?taskHub={taskHub}
    &connection={connectionName}
    &code={systemKey}
    &reason={text}
```

Request parameters for this API include the default set mentioned previously and the following unique parameter.

| Field             | Parameter Type  | Description |
|-------------------|-----------------|-------------|
| **`instanceId`**  | URL             | The ID of the orchestration instance. |
| **`reason`**      | Query string    | Optional. The reason for rewinding the orchestration instance. |

### Response

Several possible status code values can be returned.

- **HTTP 202 (Accepted)**: The rewind request was accepted for processing.
- **HTTP 404 (Not Found)**: The specified instance wasn't found.
- **HTTP 410 (Gone)**: The specified instance has completed or was terminated.

Here is an example request that rewinds a failed instance and specifies a reason of **fixed**:

```http
POST /admin/extensions/DurableTaskExtension/instances/bcf6fb5067b046fbb021b52ba7deae5a/rewind?reason=fixed&taskHub=DurableFunctionsHub&connection=Storage&code=XXX
```

The responses for this API don't contain any content.

## Signal entity

Sends a one-way operation message to a [Durable Entity](../../durable-task/common/programming-model-overview.md#entities). If the entity doesn't exist, it's created automatically. Entity operations are processed sequentially and durably persisted.

> [!NOTE]
> Durable entities are available starting in Durable Functions 2.0.

### Request

The HTTP request is formatted as follows (multiple lines are shown for clarity):

```http
POST /runtime/webhooks/durabletask/entities/{entityName}/{entityKey}
    ?taskHub={taskHub}
    &connection={connectionName}
    &code={systemKey}
    &op={operationName}
```

Request parameters for this API include the default set mentioned previously and the following unique parameters:

| Field             | Parameter type  | Description |
|-------------------|-----------------|-------------|
| **`entityName`**  | URL             | The name (type) of the entity. |
| **`entityKey`**   | URL             | The key (unique ID) of the entity. |
| **`op`**          | Query string    | Optional. The name of the user-defined operation to invoke. |
| **`{content}`**   | Request content | The JSON-formatted event payload. |

Here is an example request that sends a user-defined "Add" message to a `Counter` entity named `steps`. The content of the message is the value `5`. If the entity doesn't already exist, this request creates it:

```http
POST /runtime/webhooks/durabletask/entities/Counter/steps?op=Add
Content-Type: application/json

5
```

> [!NOTE]
> By default with [class-based entities in .NET](durable-functions-dotnet-entities.md#defining-entity-classes), specifying the `op` value of `delete` deletes the state of an entity. If the entity defines an operation named `delete`, however, that user-defined operation is invoked instead.

### Response

This operation has several possible responses:

- **HTTP 202 (Accepted)**: The signal operation was accepted for asynchronous processing.
- **HTTP 400 (Bad request)**: The request content wasn't of type `application/json`, wasn't valid JSON, or had an invalid `entityKey` value.
- **HTTP 404 (Not Found)**: The specified `entityName` wasn't found.

A successful HTTP request doesn't contain any content in the response. A failed HTTP request might contain JSON-formatted error information in the response content.

## Get entity

Gets the state of the specified entity.

### Request

The HTTP request is formatted as follows (multiple lines are shown for clarity):

```http
GET /runtime/webhooks/durabletask/entities/{entityName}/{entityKey}
    ?taskHub={taskHub}
    &connection={connectionName}
    &code={systemKey}
```

### Response

This operation has two possible responses:

- **HTTP 200 (OK)**: The specified entity exists.
- **HTTP 404 (Not Found)**: The specified entity wasn't found.

A successful response contains the JSON-serialized state of the entity as its content.

### Example
To get the state of an existing `Counter` entity named `steps`:

```http
GET /runtime/webhooks/durabletask/entities/Counter/steps
```

If the `Counter` entity simply contained a number of steps saved in a `currentValue` field, the response content might look like the following (formatted for readability):

```json
{
    "currentValue": 5
}
```

## List entities

You can query for multiple entities by the entity name or by the last operation date.

### Request

The HTTP request is formatted as follows (multiple lines are shown for clarity):

```http
GET /runtime/webhooks/durabletask/entities/{entityName}
    ?taskHub={taskHub}
    &connection={connectionName}
    &code={systemKey}
    &lastOperationTimeFrom={timestamp}
    &lastOperationTimeTo={timestamp}
    &fetchState=[true|false]
    &top={integer}
```

Request parameters for this API include the default set mentioned previously and the following unique parameters:

| Field                       | Parameter type  | Description |
|-----------------------------|-----------------|-------------|
| **`entityName`**            | URL             | Optional. When specified, filters the list of returned entities by their entity name (case-insensitive). |
| **`fetchState`**            | Query string    | Optional parameter. If set to `true`, the entity state is included in the response payload. |
| **`lastOperationTimeFrom`** | Query string    | Optional parameter. When specified, filters the list of returned entities that processed operations after the given ISO8601 timestamp. |
| **`lastOperationTimeTo`**   | Query string    | Optional parameter. When specified, filters the list of returned entities that processed operations  before the given ISO8601 timestamp. |
| **`top`**                   | Query string    | Optional parameter. When specified, limits the number of entities returned by the query. |


### Response

A successful HTTP 200 response contains a JSON-serialized array of entities and optionally the state of each entity.

By default, the operation returns the first 100 entities that match the query criteria. The caller can specify a query string parameter value for `top` to return a different maximum number of results. If more results exist beyond what is returned, a continuation token is also returned in the response header. The name of the header is `x-ms-continuation-token`.

If you set the continuation token value in the next request header, you can get the next page of results. The name of the request header is also `x-ms-continuation-token`.

### Example - list all entities

To list all entities in the task hub:

```http
GET /runtime/webhooks/durabletask/entities
```

The response JSON might look like the following (formatted for readability):

```json
[
    {
        "entityId": { "key": "cats", "name": "counter" },
        "lastOperationTime": "2019-12-18T21:45:44.6326361Z",
    },
    {
        "entityId": { "key": "dogs", "name": "counter" },
        "lastOperationTime": "2019-12-18T21:46:01.9477382Z"
    },
    {
        "entityId": { "key": "mice", "name": "counter" },
        "lastOperationTime": "2019-12-18T21:46:15.4626159Z"
    },
    {
        "entityId": { "key": "radio", "name": "device" },
        "lastOperationTime": "2019-12-18T21:46:18.2616154Z"
    },
]
```

### Example - filtering the list of entities

To list the first two `counter` entities and fetch their state:

```http
GET /runtime/webhooks/durabletask/entities/counter?top=2&fetchState=true
```

The response JSON might look like the following (formatted for readability):

```json
[
    {
        "entityId": { "key": "cats", "name": "counter" },
        "lastOperationTime": "2019-12-18T21:45:44.6326361Z",
        "state": { "value": 9 }
    },
    {
        "entityId": { "key": "dogs", "name": "counter" },
        "lastOperationTime": "2019-12-18T21:46:01.9477382Z",
        "state": { "value": 10 }
    }
]
```

## Complete workflow example

This example demonstrates a full orchestration lifecycle using `curl` commands. You can also use Postman, Thunder Client, or any HTTP client.

### 1. Start an orchestration

Starting a new `ProcessOrder` orchestration with input data:

```bash
curl -X POST "http://localhost:7071/runtime/webhooks/durabletask/orchestrators/ProcessOrder" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORD-12345",
    "customerId": "CUST-789",
    "amount": 150.00
  }'
```

Response (HTTP 202):
```json
{
  "id": "abc123def456",
  "statusQueryGetUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123def456?code=XXX",
  "sendEventPostUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123def456/raiseEvent/{eventName}?code=XXX",
  "terminatePostUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123def456/terminate?reason={text}&code=XXX"
}
```

Save the instance ID: `abc123def456`

### 2. Poll for status

Check orchestration progress:

```bash
curl "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123def456?code=XXX"
```

Response while running (HTTP 202):
```json
{
  "runtimeStatus": "Running",
  "input": { "orderId": "ORD-12345", "customerId": "CUST-789", "amount": 150.00 },
  "output": null,
  "createdTime": "2026-01-23T10:30:00Z",
  "lastUpdatedTime": "2026-01-23T10:30:05Z"
}
```

Response when completed (HTTP 200):
```json
{
  "runtimeStatus": "Completed",
  "input": { "orderId": "ORD-12345", "customerId": "CUST-789", "amount": 150.00 },
  "output": { "status": "shipped", "trackingNumber": "TRK-98765" },
  "createdTime": "2026-01-23T10:30:00Z",
  "lastUpdatedTime": "2026-01-23T10:30:15Z"
}
```

### 3. Send an external event (optional)

If the orchestration is waiting for approval, send an approval event:

```bash
curl -X POST "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123def456/raiseEvent/ApprovalReceived?code=XXX" \
  -H "Content-Type: application/json" \
  -d '{ "approved": true, "reviewer": "manager@contoso.com" }'
```

Response: HTTP 202 (Accepted)

### 4. Clean up history (optional)

After the orchestration completes, purge its history:

```bash
curl -X DELETE "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123def456?code=XXX"
```

Response (HTTP 200):
```json
{
  "instancesDeleted": 1
}
```

## Next steps

> [!div class="nextstepaction"]
> [Learn how to use Application Insights to monitor your durable functions](durable-functions-diagnostics.md)
