---
title: Migrate your Durable Functions app to version 4 of the Node.js programming model
description: This article shows you how to upgrade your existing Durable Functions apps running on v3 of the Node.js programming model to v4.
author: hossam-nasr
ms.service: azure-functions
ms.date: 04/06/2023
ms.devlang: javascript, typescript
ms.custom: devx-track-extended-java, devx-track-js
ms.author: azfuncdf
ms.topic: how-to
zone_pivot_groups: programming-languages-set-functions-nodejs
---

# Migrate your Durable Functions app to version 4 of the Node.js programming model

This article provides a guide to upgrade your existing Durable Functions app to version 4 of the Node.js programming model. Note that this article uses "TIP" banners to summarize the key steps needed to upgrade your app.

If you're interested in creating a brand new v4 app instead, you can follow the Visual Studio Code quickstarts for [JavaScript](./quickstart-js-vscode.md?pivots=nodejs-model-v4) and [TypeScript](./quickstart-ts-vscode.md?pivots=nodejs-model-v4).

>[!TIP]
> Before following this guide, make sure you follow the general [version 4 upgrade guide](../functions-node-upgrade-v4.md).

## Prerequisites

Before following this guide, make sure you follow these steps first:

- Install [Node.js](https://nodejs.org/en/download/releases) version 18.x+.
- Install [TypeScript](https://www.typescriptlang.org/) version 4.x+.
- Run your app on [Azure Functions Runtime](../functions-versions.md?tabs=v4&pivots=programming-language-javascript) version 4.25+.
- Install [Azure Functions Core Tools](../functions-run-local.md?tabs=v4) version 4.0.5382+.
- Review the general [Azure Functions Node.js programming model v4 upgrade guide](../functions-node-upgrade-v4.md).

## Upgrade the `durable-functions` npm package

>[!NOTE]
>The programming model version should not be confused with the `durable-functions` package version. `durable-functions` package version 3.x is required for the v4 programming model, while `durable-functions` version 2.x is required for the v3 programming model.

The v4 programming model is supported by the v3.x of the `durable-functions` npm package. In your programming model v3 app, you likely had `durable-functions` v2.x listed in your dependencies. Make sure to update to the v3.x of the `durable-functions` package.

>[!TIP]
> Upgrade to v3.x of the `durable-functions` npm package. You can do this with the following command:
>
> ```bash
> npm install durable-functions
> ```

## Register your Durable Functions Triggers

In the v4 programming model, declaring triggers and bindings in a separate `function.json` file is a thing of the past! Now you can register your Durable Functions triggers and bindings directly in code, using the new APIs found in the `app` namespace on the root of the `durable-functions` package. See the code snippets below for examples.

**Migrating an orchestration**

:::zone pivot="programming-language-javascript"
# [Model v4](#tab/nodejs-v4)

```javascript
const df = require('durable-functions');

const activityName = 'helloActivity';

df.app.orchestration('durableOrchestrator', function* (context) {
    const outputs = [];
    outputs.push(yield context.df.callActivity(activityName, 'Tokyo'));
    outputs.push(yield context.df.callActivity(activityName, 'Seattle'));
    outputs.push(yield context.df.callActivity(activityName, 'Cairo'));

    return outputs;
});
```

# [Model v3](#tab/nodejs-v3)

```javascript
const df = require("durable-functions");

const activityName = "hello"

module.exports = df.orchestrator(function* (context) {
    const outputs = [];
    outputs.push(yield context.df.callActivity(activityName, "Tokyo"));
    outputs.push(yield context.df.callActivity(activityName, "Seattle"));
    outputs.push(yield context.df.callActivity(activityName, "London"));

    return outputs;
});
```

```json
{
  "bindings": [
    {
      "name": "context",
      "type": "orchestrationTrigger",
      "direction": "in"
    }
  ]
}
```

---
:::zone-end

:::zone pivot="programming-language-typescript"
# [Model v4](#tab/nodejs-v4)

```typescript
import * as df from 'durable-functions';
import { OrchestrationContext, OrchestrationHandler } from 'durable-functions';

const activityName = 'hello';

const durableHello1Orchestrator: OrchestrationHandler = function* (context: OrchestrationContext) {
    const outputs = [];
    outputs.push(yield context.df.callActivity(activityName, 'Tokyo'));
    outputs.push(yield context.df.callActivity(activityName, 'Seattle'));
    outputs.push(yield context.df.callActivity(activityName, 'Cairo'));

    return outputs;
};
df.app.orchestration('durableOrchestrator', durableHello1Orchestrator);
```

# [Model v3](#tab/nodejs-v3)

```typescript
import * as df from "durable-functions"

const activityName = "hello"

const orchestrator = df.orchestrator(function* (context) {
    const outputs = [];
    outputs.push(yield context.df.callActivity(activityName, "Tokyo"));
    outputs.push(yield context.df.callActivity(activityName, "Seattle"));
    outputs.push(yield context.df.callActivity(activityName, "London"));

    return outputs;
});

export default orchestrator;
```

```json
{
  "bindings": [
    {
      "name": "context",
      "type": "orchestrationTrigger",
      "direction": "in"
    }
  ],
  "scriptFile": "../dist/durableOrchestrator/index.js"
}
```

---
:::zone-end


**Migrating an entity**

:::zone pivot="programming-language-javascript"

# [Model v4](#tab/nodejs-v4)

```javascript
const df = require('durable-functions');

df.app.entity('Counter', (context) => {
    const currentValue = context.df.getState(() => 0);
    switch (context.df.operationName) {
        case 'add':
            const amount = context.df.getInput();
            context.df.setState(currentValue + amount);
            break;
        case 'reset':
            context.df.setState(0);
            break;
        case 'get':
            context.df.return(currentValue);
            break;
    }
});
```

# [Model v3](#tab/nodejs-v3)

```javascript
const df = require("durable-functions");

module.exports = df.entity(function (context) {
    const currentValue = context.df.getState(() => 0);
    switch (context.df.operationName) {
        case "add":
            const amount = context.df.getInput();
            context.df.setState(currentValue + amount);
            break;
        case "reset":
            context.df.setState(0);
            break;
        case "get":
            context.df.return(currentValue);
            break;
    }
});
```

```json
{
  "bindings": [
    {
      "name": "context",
      "type": "entityTrigger",
      "direction": "in"
    }
  ]
}
```

---
:::zone-end

:::zone pivot="programming-language-typescript"

# [Model v4](#tab/nodejs-v4)

```typescript
import * as df from 'durable-functions';
import { EntityContext, EntityHandler } from 'durable-functions';

const counterEntity: EntityHandler<number> = (context: EntityContext<number>) => {
    const currentValue: number = context.df.getState(() => 0);
    switch (context.df.operationName) {
        case 'add':
            const amount: number = context.df.getInput();
            context.df.setState(currentValue + amount);
            break;
        case 'reset':
            context.df.setState(0);
            break;
        case 'get':
            context.df.return(currentValue);
            break;
    }
};
df.app.entity('Counter', counterEntity);
```

# [Model v3](#tab/nodejs-v3)

```typescript
import * as df from "durable-functions"

const entity = df.entity(function (context) {
    const currentValue = context.df.getState(() => 0) as number;
    switch (context.df.operationName) {
        case "add":
            const amount = context.df.getInput() as number;
            context.df.setState(currentValue + amount);
            break;
        case "reset":
            context.df.setState(0);
            break;
        case "get":
            context.df.return(currentValue);
            break;
    }
});

export default entity;
```

```json
{
  "bindings": [
    {
      "name": "context",
      "type": "entityTrigger",
      "direction": "in"
    }
  ],
  "scriptFile": "../dist/Counter/index.js"
}
```

----
:::zone-end

**Migrating an activity**

:::zone pivot="programming-language-javascript"

# [Model v4](#tab/nodejs-v4)

```javascript
const df = require('durable-functions');

df.app.activity('hello', {
    handler: (input) => {
        return `Hello, ${input}`;
    },
});
```

# [Model v3](#tab/nodejs-v3)

```javascript
module.exports = async function (context) {
    return `Hello, ${context.bindings.name}!`;
};
```

```json
{
  "bindings": [
    {
      "name": "name",
      "type": "activityTrigger",
      "direction": "in"
    }
  ]
}
```

---
:::zone-end

:::zone pivot="programming-language-typescript"
# [Model v4](#tab/nodejs-v4)

```typescript
import * as df from 'durable-functions';
import { ActivityHandler } from "durable-functions";

const helloActivity: ActivityHandler = (input: string): string => {
    return `Hello, ${input}`;
};

df.app.activity('hello', { handler: helloActivity });
```

# [Model v3](#tab/nodejs-v3)

```typescript
import { AzureFunction, Context } from "@azure/functions"

const helloActivity: AzureFunction = async function (context: Context): Promise<string> {
    return `Hello, ${context.bindings.name}!`;
};

export default helloActivity;
```

```json
{
  "bindings": [
    {
      "name": "name",
      "type": "activityTrigger",
      "direction": "in"
    }
  ],
  "scriptFile": "../dist/hello/index.js"
}
```

---
:::zone-end

>[!TIP]
> Remove `function.json` files from your Durable Functions app. Instead, register your durable functions using the methods on the `app` namespace: `df.app.orchestration()`, `df.app.entity()`, and `df.app.activity()`.


## Register your Durable Client input binding

In the v4 model, registering secondary input bindings, like durable clients, is also done in code! Use the `input.durableClient()` method to register a durable client input _binding_ to a function of your choice. In the function body, use `getClient()` to retrieve the client instance, as before. The example below shows an example using an HTTP triggered function.

:::zone pivot="programming-language-javascript"

# [Model v4](#tab/nodejs-v4)

```javascript
const { app } = require('@azure/functions');
const df = require('durable-functions');

app.http('durableHttpStart', {
    route: 'orchestrators/{orchestratorName}',
    extraInputs: [df.input.durableClient()],
    handler: async (_request, context) => {
        const client = df.getClient(context);
        // Use client in function body
    },
});
```

# [Model v3](#tab/nodejs-v3)

```javascript
const df = require("durable-functions");

module.exports = async function (context, req) {
    const client = df.getClient(context);
    // Use client in function body
};
```

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
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
      "type": "durableClient",
      "direction": "in"
    }
  ]
}
```

---
:::zone-end

:::zone pivot="programming-language-typescript"

# [Model v4](#tab/nodejs-v4)

```typescript
import { app, HttpHandler, HttpRequest, HttpResponse, InvocationContext } from '@azure/functions';
import * as df from 'durable-functions';

const durableHttpStart: HttpHandler = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponse> => {
    const client = df.getClient(context);
    // Use client in function body
};

app.http('durableHttpStart', {
    route: 'orchestrators/{orchestratorName}',
    extraInputs: [df.input.durableClient()],
    handler: durableHttpStart,
});
```

# [Model v3](#tab/nodejs-v3)

```typescript
import * as df from "durable-functions"
import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const durableHttpStart: AzureFunction = async function (context: Context): Promise<any> {
    const client = df.getClient(context);
    // Use client in function body
};

export default durableHttpStart;
```

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
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
      "type": "durableClient",
      "direction": "in"
    }
  ],
  "scriptFile": "../dist/durableHttpStart/index.js"
}
```

---
:::zone-end

>[!TIP]
> Use the `input.durableClient()` method to register a durable client extra input to your client function. Use `getClient()` as normal to retrieve a `DurableClient` instance.

## Update your Durable Client API calls

In `v3.x` of `durable-functions`, multiple APIs on the `DurableClient` class (renamed from `DurableOrchestrationClient`) have been simplified to make calling them easier and more streamlined. For many optional arguments to APIs, you now pass one options object, instead of multiple discrete optional arguments. Below is an example of these changes:

:::zone pivot="programming-language-javascript"

# [Model v4](#tab/nodejs-v4)

```javascript
const client = df.getClient(context)
const status = await client.getStatus('instanceId', {
    showHistory: false,
    showHistoryOutput: false,
    showInput: true
});
```

# [Model v3](#tab/nodejs-v3)

```javascript
const client = df.getClient(context);
const status = await client.getStatus('instanceId', false, false, true);
```

---
:::zone-end

:::zone pivot="programming-language-typescript"

# [Model v4](#tab/nodejs-v4)

```typescript
const client: DurableClient = df.getClient(context);
const status: DurableOrchestrationStatus = await client.getStatus('instanceId', {
    showHistory: false,
    showHistoryOutput: false,
    showInput: true
});
```

# [Model v3](#tab/nodejs-v3)

```typescript
const client: DurableOrchestrationClient = df.getClient(context);
const status: DurableOrchestrationStatus = await client.getStatus('instanceId', false, false, true);
```

---
:::zone-end

Below, find the full list of changes:

<table>
<tr>
<th> V3 model (durable-functions v2.x) </th>
<th> V4 model (durable-functions v3.x) </th>
</tr>
<tr>
<td>

```typescript
getStatus(
    instanceId: string,
    showHistory?: boolean,
    showHistoryOutput?: boolean,
    showInput?: boolean
): Promise<DurableOrchestrationStatus>
```
</td>
<td>

```typescript
getStatus(
    instanceId: string, 
    options?: GetStatusOptions
): Promise<DurableOrchestrationStatus>
```
</td>
</tr>
<tr>
<td>

```typescript
getStatusBy(
    createdTimeFrom: Date | undefined,
    createdTimeTo: Date | undefined,
    runtimeStatus: OrchestrationRuntimeStatus[]
): Promise<DurableOrchestrationStatus[]>
```

</td>
<td>

```typescript
getStatusBy(
    options: OrchestrationFilter
): Promise<DurableOrchestrationStatus[]>
```

</td>
</tr>
<tr>
<td>

```typescript
purgeInstanceHistoryBy(
    createdTimeFrom: Date,
    createdTimeTo?: Date,
    runtimeStatus?: OrchestrationRuntimeStatus[]
): Promise<PurgeHistoryResult>
```

</td>
<td>

```typescript
purgeInstanceHistoryBy(
    options: OrchestrationFilter
): Promise<PurgeHistoryResult>
```

</td>
</tr>
<tr>
<td>

```typescript
raiseEvent(
    instanceId: string,
    eventName: string,
    eventData: unknown,
    taskHubName?: string,
    connectionName?: string
): Promise<void>
```

</td>
<td>

```typescript
raiseEvent(
    instanceId: string,
    eventName: string,
    eventData: unknown,
    options?: TaskHubOptions
): Promise<void>
```

</td>
</tr>
<tr>
<td>

```typescript
readEntityState<T>(
    entityId: EntityId,
    taskHubName?: string,
    connectionName?: string
): Promise<EntityStateResponse<T>>
```

</td>
<td>

```typescript
readEntityState<T>(
    entityId: EntityId,
    options?: TaskHubOptions
): Promise<EntityStateResponse<T>>
```

</td>
</tr>
<tr>
<td>

```typescript
rewind(
    instanceId: string,
    reason: string,
    taskHubName?: string,
    connectionName?: string
): Promise<void>`
```

</td>
<td>

```typescript
rewind(
    instanceId: string, 
    reason: string, 
    options?: TaskHubOptions
): Promise<void>
```

</td>
</tr>
<tr>
<td>

```typescript
signalEntity(
    entityId: EntityId,
    operationName?: string,
    operationContent?: unknown,
    taskHubName?: string,
    connectionName?: string
): Promise<void>
```
</td>
<td>

```typescript
signalEntity(
    entityId: EntityId, 
    operationName?: string,
    operationContent?: unknown,
    options?: TaskHubOptions
): Promise<void>
```
</td>
</tr>
<tr>
<td>

```typescript
startNew(
    orchestratorFunctionName: string,
    instanceId?: string,
    input?: unknown
): Promise<string>
```

</td>
<td>

```typescript
startNew(
    orchestratorFunctionName: string, 
    options?: StartNewOptions
): Promise<string>;
```

</td>
</tr>
<tr>
<td>

```typescript
waitForCompletionOrCreateCheckStatusResponse(
    request: HttpRequest,
    instanceId: string,
    timeoutInMilliseconds?: number,
    retryIntervalInMilliseconds?: number
): Promise<HttpResponse>;
```

</td>
<td>

```typescript
waitForCompletionOrCreateCheckStatusResponse(
    request: HttpRequest,
    instanceId: string,
    waitOptions?: WaitForCompletionOptions
): Promise<HttpResponse>;
```

</td>
</tr>
</table>

>[!TIP]
> Make sure to update your `DurableClient` API calls from discrete optional arguments to options objects, where applicable. See the list above for all APIs affected. 


## Update calls to callHttp API

In v3.x of `durable-functions`, the `callHttp()` API for `DurableOrchestrationContext` was updated. The following changes were made:

- Accept one options object for all arguments, instead of multiple optional arguments, to be more similar to frameworks such as [Express](https://expressjs.com/).
- Rename `uri` argument to `url`
- Rename `content` argument to `body`
- Deprecate `asynchronousPatternEnabled` flag in favor of `enablePolling`.

If your orchestrations used the `callHttp` API, make sure to update these API calls to conform to the above changes. Find an example below:

:::zone pivot="programming-language-javascript"

# [Model v4](#tab/nodejs-v4)

```javascript
const restartResponse = yield context.df.callHttp({
    method: "POST",
    url: `https://example.com`,
    body: "body",
    enablePolling: false
});
```

# [Model v3](#tab/nodejs-v3)

```javascript
const response = yield context.df.callHttp(
    "POST",
    `https://example.com`,
    "body", // request content
    undefined, // no request headers
    undefined, // no token source
    false // disable polling
);
```

---
:::zone-end

:::zone pivot="programming-language-typescript"

# [Model v4](#tab/nodejs-v4)

```typescript
const restartResponse = yield context.df.callHttp({
    method: "POST",
    url: `https://example.com`,
    body: "body",
    enablePolling: false
});
```

# [Model v3](#tab/nodejs-v3)

```javascript
const response = yield context.df.callHttp(
    "POST",
    `https://example.com`,
    "body", // request content
    undefined, // no request headers
    undefined, // no token source
    false // disable polling
);
```

---
:::zone-end

> [!TIP]
> Update your API calls to `callHttp` inside your orchestrations to use the new options object.

:::zone pivot="programming-language-typescript"

## Leverage new types

The `durable-functions` package now exposes new types that weren't previously exported! This allows you to more strongly type your functions and provide stronger type safety for your orchestrations, entities, and activities! This also improves intellisense for authoring these functions.

Below are some of the new exported types:

- `OrchestrationHandler`, and `OrchestrationContext` for orchestrations
- `EntityHandler` and `EntityContext` for entities
- `ActivityHandler` for activities
- `DurableClient` class for client functions

> [!TIP]
> Strongly type your functions by leveraging new types exported from the `durable-functions` package!

:::zone-end

## Troubleshooting

If you see the following error when running your orchestration code, make sure you are running on at least `v4.25` of the [Azure Functions Runtime](../functions-versions.md?tabs=v4&pivots=programming-language-javascript) or at least `v4.0.5382` of [Azure Functions Core Tools](../functions-run-local.md?tabs=v4) if running locally.

```bash
Exception: The orchestrator can not execute without an OrchestratorStarted event.
Stack: TypeError: The orchestrator can not execute without an OrchestratorStarted event.
```

If that doesn't work, or if you encounter any other issues, you can always file a bug report in [our GitHub repo](https://github.com/Azure/azure-functions-durable-js).
