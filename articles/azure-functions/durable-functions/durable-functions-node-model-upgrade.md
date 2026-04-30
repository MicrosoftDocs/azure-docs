---
title: "Migrate Durable Functions to Node.js Programming Model v4"
description: Learn how to migrate your Durable Functions app from v3 to v4 of the Node.js programming model. Follow step-by-step instructions to upgrade triggers, bindings, and client APIs.
author: hossam-nasr
ms.service: azure-functions
ms.date: 04/06/2023
ms.devlang: javascript
# ms.devlang: javascript, typescript
ms.custom: devx-track-extended-java, devx-track-js, devx-track-ts
ms.author: azfuncdf
ms.topic: how-to
zone_pivot_groups: programming-languages-set-functions-nodejs
no-loc:
  - javascript
  - typescript
  - json
  - bash
---

# Migrate your Durable Functions app to version 4 of the Node.js programming model

This guide covers the Durable Functions-specific changes needed when upgrading to the v4 Node.js programming model. To create a new v4 app instead, see the quickstarts for [JavaScript](./quickstart-js-vscode.md?pivots=nodejs-model-v4) and [TypeScript](./quickstart-ts-vscode.md?pivots=nodejs-model-v4).

> [!IMPORTANT]
> Complete the general [Node.js v4 upgrade guide](../functions-node-upgrade-v4.md) first. This article covers only the extra Durable Functions-specific changes.

## Migration checklist

Use the following checklist to track your progress through each migration step:

| Step | Section |
| --- | --- |
| 1. Verify prerequisites | [Prerequisites](#prerequisites) |
| 2. Upgrade the npm package | [Upgrade the durable-functions npm package](#upgrade-the-durable-functions-npm-package) |
| 3. Replace `function.json` with code-based registration | [Register your Durable Functions triggers](#register-your-durable-functions-triggers) |
| 4. Register durable client in code | [Register your Durable Client input binding](#register-your-durable-client-input-binding) |
| 5. Update client API calls | [Update your Durable Client API calls](#update-your-durable-client-api-calls) |
| 6. Update `callHttp` calls | [Update calls to the callHttp API](#update-calls-to-the-callhttp-api) |
| 7. (TypeScript) Use new exported types | [Use new exported types for stronger type safety](#use-new-exported-types-for-stronger-type-safety) |

## Prerequisites

- [Node.js](https://nodejs.org/en/download/releases) version 18.x+
- [TypeScript](https://www.typescriptlang.org/) version 4.x+
- [Azure Functions Runtime](../functions-versions.md?tabs=v4&pivots=programming-language-javascript) version 4.25+
- [Azure Functions Core Tools](../functions-run-local.md?tabs=v4) version 4.0.5382+ (if running locally)

## Upgrade the `durable-functions` npm package

The programming model version and the `durable-functions` package version are different:

| Programming model | `durable-functions` package |
| --- | --- |
| v3 | 2.x |
| v4 | **3.x** |

Upgrade to the v3.x package:

```bash
npm install durable-functions
```

## Register your Durable Functions triggers

In the v4 model, you no longer declare triggers and bindings in a separate `function.json` file. Instead, register your Durable Functions triggers directly in code using the `df.app` namespace. After migrating each function, delete its `function.json` file.

| Function type | Registration method |
| --- | --- |
| Orchestration | `df.app.orchestration()` |
| Entity | `df.app.entity()` |
| Activity | `df.app.activity()` |

The following examples show the migration pattern for each function type.

**Orchestration**

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


**Entity**

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

**Activity**

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


## Register your Durable Client input binding

In the v4 model, registering secondary input bindings like durable clients is also done in code. Use `input.durableClient()` to register a durable client input _binding_, then use `getClient()` to retrieve the client instance. The following example uses an HTTP triggered function.

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

## Update your Durable Client API calls

Several APIs on `DurableClient` (renamed from `DurableOrchestrationClient`) now accept a single options object instead of multiple optional arguments. The most commonly affected APIs are `startNew` and `getStatus`; if you only use those APIs, you can skip the rest of the table. The following example shows the updated pattern:

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

The following table lists all the affected APIs:

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

## Update calls to the callHttp API

In v3.x of `durable-functions`, the `callHttp()` API was updated with the following changes:

| Change | Details |
| --- | --- |
| Arguments → options object | All arguments are now passed as a single options object, similar to [Express](https://expressjs.com/). |
| `uri` → `url` | Renamed for consistency. |
| `content` → `body` | Renamed for consistency. |
| `asynchronousPatternEnabled` → `enablePolling` | Renamed for clarity. |

If your orchestrations use `callHttp`, update the calls to the new syntax:

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

:::zone pivot="programming-language-typescript"

## Use new exported types for stronger type safety

The `durable-functions` package now exposes new types that weren't previously exported. These types allow you to more strongly type your functions and provide stronger type safety for your orchestrations, entities, and activities. They also improve IntelliSense for authoring these functions.

The following list includes some of the new exported types:

- `OrchestrationHandler`, and `OrchestrationContext` for orchestrations
- `EntityHandler` and `EntityContext` for entities
- `ActivityHandler` for activities
- `DurableClient` class for client functions

:::zone-end

## Troubleshooting

### "The orchestrator can’t execute without an OrchestratorStarted event"

If you see the following error, make sure you're running at least `v4.25` of the [Azure Functions Runtime](../functions-versions.md?tabs=v4&pivots=programming-language-javascript) or at least `v4.0.5382` of [Azure Functions Core Tools](../functions-run-local.md?tabs=v4) if running locally.

```bash
Exception: The orchestrator can not execute without an OrchestratorStarted event.
Stack: TypeError: The orchestrator can not execute without an OrchestratorStarted event.
```

### Functions not discovered after migration

If your functions aren't appearing after migration, verify that:

- You deleted or renamed the old `function.json` files. Leftover `function.json` files can conflict with code-based registrations.
- Your `df.app.orchestration()`, `df.app.entity()`, and `df.app.activity()` calls are being executed at startup (for example, in a file imported by your main entry point).

### Other issues

For other issues, file a bug report in the [azure-functions-durable-js GitHub repo](https://github.com/Azure/azure-functions-durable-js).

## Next steps

- [Create a Durable Functions app with JavaScript](./quickstart-js-vscode.md?pivots=nodejs-model-v4)
- [Create a Durable Functions app with TypeScript](./quickstart-ts-vscode.md?pivots=nodejs-model-v4)
- [Durable Functions patterns and concepts](durable-functions-overview.md)
- [`durable-functions` npm package changelog](https://github.com/Azure/azure-functions-durable-js/blob/main/CHANGELOG.md)
