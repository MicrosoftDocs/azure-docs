---
title: Upgrade your Durable Functions app to version 4 of the Node.js programming model
description: This article shows you how to upgrade your existing Durable Functions apps running on v3 of the Node.js programming model to v4.
author: hossam-nasr
ms.service: azure-functions
ms.date: 04/06/2023
ms.devlang: javascript, typescript
ms.author: azfuncdf
ms.topic: how-to
zone_pivot_groups: programming-languages-set-functions-nodejs
---

# Upgrade your Durable Functions app to version 4 of the Node.js programming model

>[!NOTE]
> Version 4 of the Node.js programming model is currently in public preview.

This article provides a guide to upgrade your existing Durable Functions app to newly released version 4 of the Node.js programming model for Azure Functions from the existing version 3. If you're instead interested in creating a brand new v4 app, follow the Visual Studio Code quickstarts for [JavaScript](./quickstart-js-vscode.md?pivots=nodejs-model-v4) and [TypeScript](./quickstart-ts-vscode.md?pivots=nodejs-model-v4). This article uses "TIP" sections to highlight the most important concrete actions you should take to upgrade your app. Before following this guide, make sure you follow the general [version 4 upgrade guide](../functions-node-upgrade-v4.md). You can also learn more about the new v4 programming model through the [Node.js developer reference](../functions-reference-node.md?pivots=nodejs-model-v4).

>[!TIP]
> Before following this guide, make sure you follow the general [version 4 upgrade guide](../functions-node-upgrade-v4.md).

## Prerequisites

Before following this guide, make sure you follow these steps first:

- Install have [Node.js](https://nodejs.org/en/download/releases) version 18.x+.
- Install [TypeScript](https://www.typescriptlang.org/) version 4.x+.
- Run your app on [Azure Functions Runtime](../functions-versions.md?tabs=v4&pivots=programming-language-javascript) version 4.16.5+.
- Install [Azure Functions Core Tools](../functions-run-local.md?tabs=v4) version 4.0.5095+.
- Follow the general [Azure Functions Node.js programming model v4 upgrade guide](../functions-node-upgrade-v4.md).

## Upgrade durable-functions npm package

The v4 programming model is supported by the v3.x of the `durable-functions` npm package. In v3, you likely had `durable-functions` v2.x listed in your dependencies. Make sure to update to the (currently in preview) v3.x of the package.

>[!TIP]
> Upgrade to the preview v3.x of the `durable-functions` npm package. You can do this with the following command:
>
> ```bash
> npm install durable-functions@preview
> ```

## Register your durable functions in code

In the v4 programming model, `function.json` files are a thing of the past! In v3, you would have to register your orchestration, entity, and activity triggers in a `function.json` file, and export your function implementation using `orchestrator()` or `entity()` APIs from the `durable-functions` package. With v3.x of `durable-functions`, APIs were added to the `app` namespace on the root of the package to allow you to register your durable orchestrations, entities, and activities directly in code! Find the below code snippets for examples.

#### Migrating an orchestration

:::zone pivot="programming-language-javascript"
# [v4 model](#tab/v4)

```JS
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

# [v3 model](#tab/v3)

```JS
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
# [v4 model](#tab/v4)

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

# [v3 model](#tab/v3)

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


#### Migrating an entity

:::zone pivot="programming-language-javascript"

# [v4 model](#tab/v4)

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

# [v3 model](#tab/v3)

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

# [v4 model](#tab/v4)

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

# [v3 model](#tab/v3)

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

#### Migrating an activity

:::zone pivot="programming-language-javascript"

# [v4 model](#tab/v4)

```javascript
const df = require('durable-functions');

df.app.activity('hello', {
    handler: (input) => {
        return `Hello, ${input}`;
    },
});
```

# [v3 model](#tab/v3)

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
# [v4 model](#tab/v4)

```typescript
import * as df from 'durable-functions';
import { ActivityHandler } from "durable-functions";

const helloActivity: ActivityHandler = (input: string): string => {
    return `Hello, ${input}`;
};

df.app.activity('hello', { handler: helloActivity });
```

# [v3 model](#tab/v3)

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


## Update your Durable Client input config

In the v4 model, registering extra inputs has been moved from `function.json` files to your own code! You can use the `input.durableClient()` method to register an extra durable client input to your preferred durable client function. You can then use `getClient()` to retrieve the client instance as before. See the example below using an HTTP trigger.

:::zone pivot="programming-language-javascript"

# [v4 model](#tab/v4)

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

# [v3 model](#tab/v3)

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

# [v4 model](#tab/v4)

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

# [v3 model](#tab/v3)

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
