---
title: Azure Functions Node.js developer reference
description: Develop Azure Functions using JavaScript and TypeScript with the @azure/functions npm package, including programming models, triggers, bindings, and best practices.
ms.assetid: 45dedd78-3ff9-411f-bb4b-16d29a11384c
ms.topic: how-to
ms.date: 07/15/2026
ms.devlang: javascript
# ms.devlang: javascript, typescript
ms.custom:
  - devx-track-js
  - vscode-azure-extension-update-not-needed
  - build-2025
zone_pivot_groups: functions-nodejs-model
---

# Azure Functions Node.js developer reference

This reference covers how to develop Azure Functions using JavaScript and TypeScript with the [`@azure/functions`](https://www.npmjs.com/package/@azure/functions) npm package. For a general overview of Azure Functions concepts shared across all languages, see the [Azure Functions developer reference](functions-reference.md).

| Resource | Link |
| --- | --- |
| Create your first JavaScript function | [Visual Studio Code](./how-to-create-function-vs-code.md?pivot=programming-language-javascript)/[CLI](./create-first-function-azure-developer-cli.md?pivots=programming-language-javascript) |
| Create your first TypeScript function | [Visual Studio Code](./how-to-create-function-vs-code.md?pivot=programming-language-typescript)/[CLI](./create-first-function-azure-developer-cli.md?pivots=programming-language-typescript) |
| Scenarios and samples | [JavaScript](functions-scenarios.md?pivot=programming-language-javascript)/[TypeScript](functions-scenarios.md?pivot=programming-language-typescript) |
| API reference | [`@azure/functions` API](/javascript/api/%40azure/functions/) |

> [!NOTE]
> This article shows content for a specific programming model version based on the selector at the top of the page. The version you choose should match your [`@azure/functions`](https://www.npmjs.com/package/@azure/functions) npm package version. You can't mix v3 and v4 functions in the same app. If you don't have the package in your `package.json`, the default is v3.

## Programming model

Azure Functions for Node.js supports two programming model versions. **New projects should use v4.**

| Feature | v4 (recommended) | v3 |
| --- | --- | --- |
| Status | GA | GA (maintenance) |
| `@azure/functions` package | 4.x | 3.x |
| Function registration | Code-centric (`app.http()`, `app.timer()`) | File-based (`function.json`) |
| File structure | Flexible | Fixed (one folder per function) |
| Functions runtime version | 4.25+ | 4.x |
| Node.js versions | 24.x, 22.x | 24.x, 22.x |

::: zone pivot="nodejs-model-v4"  
In the Node.js v4 programming model, you register functions by importing the `app` object from `@azure/functions` and calling trigger-specific methods. The functions are defined directly in your code with a flexible file structure. Every function has a single *trigger* that starts its execution and can also have *bindings*, which are declarative connections to other services for reading input data or writing output data. For more information, see [Triggers and bindings](#triggers-and-bindings).

In the v4 model, you:
- Register functions by using trigger-specific methods like `app.http()`, `app.timer()`, and `app.storageQueue()`.
- Access the trigger input as the first argument to your handler (for example, `HttpRequest`).
- Return the primary output directly from the handler function.
- Use `context.extraInputs.get()` to read from extra input bindings like Blob Storage.
- Use `context.extraOutputs.set()` to write to extra output bindings like queues.
- Each function has exactly one trigger, but can have multiple extra inputs and outputs.
- You can cache data in global variables for reuse across invocations, but don't rely on this state to persist. The runtime can recycle your worker at any time.

::: zone-end

::: zone pivot="nodejs-model-v3"
In the Node.js v3 programming model, you define each function by using a `function.json` configuration file and corresponding JavaScript or TypeScript code. You organize functions in separate folders with specific file structures. Every function has a single *trigger* that starts its execution and can also have *bindings*, which are declarative connections to other services for reading input data or writing output data. For more information, see [Triggers and bindings](#triggers-and-bindings).

In the v3 model, you:
- Define triggers and bindings in a `function.json` file. Use `direction: "in"` for inputs and `direction: "out"` for outputs.
- Access the trigger input as the second argument to your handler, or read it from `context.bindings`.
- Set outputs by assigning values to `context.bindings` (for example, `context.bindings.outputQueue`). For HTTP, use `context.res`.
- TypeScript projects require a `scriptFile` property in `function.json` that points to the compiled JavaScript file.
- Each function has exactly one trigger, but can have multiple input and output bindings.
- You can cache data in global variables for reuse across invocations, but don't rely on this state to persist. The runtime can recycle your worker at any time.

::: zone-end

### Examples

::: zone pivot="nodejs-model-v4"

Here's a simple function that responds to an HTTP request:

#### [JavaScript](#tab/javascript)

```javascript
const { app } = require('@azure/functions');

app.http('httpTrigger', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const name = request.query.get('name') || 'World';
        context.log('HTTP trigger function processed a request.');
        
        return { body: `Hello, ${name}!` };
    }
});
```

#### [TypeScript](#tab/typescript)

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

export async function httpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const name = request.query.get('name') || 'World';
    context.log('HTTP trigger function processed a request.');
    
    return { body: `Hello, ${name}!` };
}

app.http('httpTrigger', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: httpTrigger
});
```

---

The following non-HTTP example uses a timer trigger:

#### [JavaScript](#tab/javascript)

```javascript
const { app } = require('@azure/functions');

app.timer('cleanupTimer', {
  schedule: '0 */5 * * * *',
  handler: async (myTimer, context) => {
    context.log('Timer trigger function ran at', new Date().toISOString());
  }
});
```

#### [TypeScript](#tab/typescript)

```typescript
import { app, InvocationContext, Timer } from '@azure/functions';

export async function cleanupTimer(myTimer: Timer, context: InvocationContext): Promise<void> {
  context.log('Timer trigger function ran at', new Date().toISOString());
}

app.timer('cleanupTimer', {
  schedule: '0 */5 * * * *',
  handler: cleanupTimer
});
```

---

The following example shows an HTTP trigger with a queue output binding:

#### [JavaScript](#tab/javascript)

```javascript
const { app, output } = require('@azure/functions');

const queueOutput = output.storageQueue({
  queueName: 'work-items',
  connection: 'AzureWebJobsStorage'
});

app.http('submitWorkItem', {
  methods: ['POST'],
  extraOutputs: [queueOutput],
  handler: async (request, context) => {
    const body = await request.json();
    context.extraOutputs.set(queueOutput, JSON.stringify(body));
    return { status: 202, jsonBody: { accepted: true } };
  }
});
```

#### [TypeScript](#tab/typescript)

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from '@azure/functions';

const queueOutput = output.storageQueue({
  queueName: 'work-items',
  connection: 'AzureWebJobsStorage'
});

export async function submitWorkItem(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const body = await request.json();
  context.extraOutputs.set(queueOutput, JSON.stringify(body));
  return { status: 202, jsonBody: { accepted: true } };
}

app.http('submitWorkItem', {
  methods: ['POST'],
  extraOutputs: [queueOutput],
  handler: submitWorkItem
});
```

---

::: zone-end

::: zone pivot="nodejs-model-v3"

Here's a simple function that responds to an HTTP request:

#### [JavaScript](#tab/javascript)

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "post"]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

```javascript
module.exports = async function (context, req) {
    const name = (req.query.name || (req.body && req.body.name)) || 'World';
    context.log('HTTP trigger function processed a request.');
    
    context.res = {
        body: `Hello, ${name}!`
    };
};
```

#### [TypeScript](#tab/typescript)

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "post"]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ],
  "scriptFile": "../dist/HttpTrigger1/index.js"
}
```

```typescript
import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const name = (req.query.name || (req.body && req.body.name)) || 'World';
    context.log('HTTP trigger function processed a request.');
    
    context.res = {
        body: `Hello, ${name}!`
    };
};

export default httpTrigger;
```

---

The following non-HTTP example uses a timer trigger:

#### [JavaScript](#tab/javascript)

```json
{
  "bindings": [
    {
      "name": "myTimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 */5 * * * *"
    }
  ]
}
```

```javascript
module.exports = async function (context, myTimer) {
    context.log('Timer trigger function ran at', new Date().toISOString());
};
```

#### [TypeScript](#tab/typescript)

```json
{
  "bindings": [
    {
      "name": "myTimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 */5 * * * *"
    }
  ],
  "scriptFile": "../dist/TimerTrigger/index.js"
}
```

```typescript
import { AzureFunction, Context } from '@azure/functions';

const timerTrigger: AzureFunction = async function (context: Context, myTimer: unknown): Promise<void> {
    context.log('Timer trigger function ran at', new Date().toISOString());
};

export default timerTrigger;
```

---

The following example shows an HTTP trigger with a queue output binding:

#### [JavaScript](#tab/javascript)

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post"]
    },
    {
      "type": "queue",
      "direction": "out",
      "name": "workItems",
      "queueName": "work-items",
      "connection": "AzureWebJobsStorage"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

```javascript
module.exports = async function (context, req) {
    const payload = req.body || {};
    context.bindings.workItems = JSON.stringify(payload);
    context.res = {
        status: 202,
        body: { accepted: true }
    };
};
```

#### [TypeScript](#tab/typescript)

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post"]
    },
    {
      "type": "queue",
      "direction": "out",
      "name": "workItems",
      "queueName": "work-items",
      "connection": "AzureWebJobsStorage"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ],
  "scriptFile": "../dist/HttpTrigger/index.js"
}
```

```typescript
import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const payload = req.body || {};
    context.bindings.workItems = JSON.stringify(payload);
    context.res = {
        status: 202,
        body: { accepted: true }
    };
};

export default httpTrigger;
```

---

::: zone-end

## Building your function app

This section covers the essential components for creating and structuring your Node function app, including the [`@azure/functions` library](#the-azurefunctions-library), [project structure](#folder-structure), and [package management](#package-management).

### The `@azure/functions` library

The `@azure/functions` TypeScript/JavaScript library provides the core types and functions you use to interact with the Azure Functions runtime. To see all types and methods available, visit the [`@azure/functions` API](/javascript/api/%40azure/functions/).

Your function code can use `@azure/functions` to:
- Register functions and define triggers (v4 model).
- Access strongly-typed trigger input data (for example, `HttpRequest`, `Timer`).
- Create typed output values (such as `HttpResponseInit`).
- Interact with runtime-provided context and binding data.

If you're using `@azure/functions` in your app, include it in your project dependencies:

```json
{
  "dependencies": {
    "@azure/functions": "^4.0.0"
  }
}
```

> [!NOTE]
> The `@azure/functions` library defines the programming surface for Node.js Azure Functions, but it isn't a general-purpose SDK. Use it specifically for authoring and running functions within the Azure Functions runtime.

### TypeScript configuration

For the best TypeScript development experience, ensure your `tsconfig.json` includes the proper configuration:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es6",
    "outDir": "dist",
    "rootDir": ".",
    "sourceMap": true,
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Folder structure

::: zone pivot="nodejs-model-v3"

#### [JavaScript](#tab/javascript)

A JavaScript project requires the folder structure shown in the following example:

```text
<project_root>/
 | - .vscode/
 | - node_modules/
 | - myFirstFunction/
 | | - index.js
 | | - function.json
 | - mySecondFunction/
 | | - index.js
 | | - function.json
 | - .funcignore
 | - host.json
 | - local.settings.json
 | - package.json
```

The main project folder, _<project_root>_, can contain the following files:

- **.vscode/**: (Optional) Contains the stored Visual Studio Code configuration. To learn more, see [Visual Studio Code settings](https://code.visualstudio.com/docs/getstarted/settings).
- **myFirstFunction/function.json**: Contains configuration for the function's trigger, inputs, and outputs. The name of the directory determines the name of your function.
- **myFirstFunction/index.js**: Stores your function code. To change this default file path, see [using scriptFile](#using-scriptfile).
- **.funcignore**: (Optional) Declares files that shouldn't get published to Azure. Usually, this file contains _.vscode/_ to ignore your editor setting, _test/_ to ignore test cases, and _local.settings.json_ to prevent local app settings from being published.
- **host.json**: Contains configuration options that affect all functions in a function app instance. This file gets published to Azure. Not all options are supported when running locally. To learn more, see [host.json](functions-host-json.md).
- **local.settings.json**: Used to store app settings and connection strings when running locally. This file doesn't get published to Azure. To learn more, see [local.settings.file](functions-develop-local.md#local-settings-file).
- **package.json**: Contains configuration options like a list of package dependencies, the main entry point, and scripts.

#### [TypeScript](#tab/typescript)

A TypeScript project requires the following folder structure:

```text
<project_root>/
 | - .vscode/
 | - dist/
 | - node_modules/
 | - myFirstFunction/
 | | - index.ts
 | | - function.json
 | - mySecondFunction/
 | | - index.ts
 | | - function.json
 | - .funcignore
 | - host.json
 | - local.settings.json
 | - package.json
 | - tsconfig.json
```

The main project folder, _<project_root>_, can contain the following files:

- **.vscode/**: (Optional) Contains the stored Visual Studio Code configuration. To learn more, see [Visual Studio Code settings](https://code.visualstudio.com/docs/getstarted/settings).
- **dist/**: Contains the compiled JavaScript code after you run a build. You can configure the name of this folder in your "tsconfig.json" file. It should match the `scriptFile` property in your "function.json" files.
- **myFirstFunction/function.json**: Contains configuration for the function's trigger, inputs, and outputs. The name of the directory determines the name of your function. For TypeScript projects, this file must contain a `scriptFile` property pointing to your compiled JavaScript.
- **myFirstFunction/index.ts**: Stores your function code. To change this default file path, see [using scriptFile](#using-scriptfile).
- **.funcignore**: (Optional) Declares files that shouldn't get published to Azure. Usually, this file contains _.vscode/_ to ignore your editor setting, _test/_ to ignore test cases, and _local.settings.json_ to prevent local app settings from being published.
- **host.json**: Contains configuration options that affect all functions in a function app instance. This file gets published to Azure. Not all options are supported when running locally. To learn more, see [host.json](functions-host-json.md).
- **local.settings.json**: Used to store app settings and connection strings when running locally. This file doesn't get published to Azure. To learn more, see [local.settings.file](functions-develop-local.md#local-settings-file).
- **package.json**: Contains configuration options like a list of package dependencies, the main entry point, and scripts.
- **tsconfig.json**: Contains TypeScript compiler options like the output directory.

---

::: zone-end

::: zone pivot="nodejs-model-v4"

#### [JavaScript](#tab/javascript)

A JavaScript project follows the recommended folder structure in the following example:

```text
<project_root>/
 | - .vscode/
 | - node_modules/
 | - src/
 | | - functions/
 | | | - myFirstFunction.js
 | | | - mySecondFunction.js
 | - test/
 | | - functions/
 | | | - myFirstFunction.test.js
 | | | - mySecondFunction.test.js
 | - .funcignore
 | - host.json
 | - local.settings.json
 | - package.json
```

The main project folder, _<project_root>_, can contain the following files:

- **.vscode/**: (Optional) Contains the stored Visual Studio Code configuration. To learn more, see [Visual Studio Code settings](https://code.visualstudio.com/docs/getstarted/settings).
- **src/functions/**: The default location for all functions and their related triggers and bindings.
- **test/**: (Optional) Contains the test cases of your function app.
- **.funcignore**: (Optional) Declares files that shouldn't get published to Azure. Usually, this file contains _.vscode/_ to ignore your editor setting, _test/_ to ignore test cases, and _local.settings.json_ to prevent local app settings from being published.
- **host.json**: Contains configuration options that affect all functions in a function app instance. This file gets published to Azure. Not all options are supported when running locally. To learn more, see [host.json](functions-host-json.md).
- **local.settings.json**: Used to store app settings and connection strings when running locally. This file doesn't get published to Azure. To learn more, see [local.settings.file](functions-develop-local.md#local-settings-file).
- **package.json**: Contains configuration options like a list of package dependencies, the main entry point, and scripts.

#### [TypeScript](#tab/typescript)

A TypeScript project follows the recommended folder structure in the following example:

```text
<project_root>/
 | - .vscode/
 | - dist/
 | - node_modules/
 | - src/
 | | - functions/
 | | | - myFirstFunction.ts
 | | | - mySecondFunction.ts
 | - test/
 | | - functions/
 | | | - myFirstFunction.test.ts
 | | | - mySecondFunction.test.ts
 | - .funcignore
 | - host.json
 | - local.settings.json
 | - package.json
 | - tsconfig.json
```

The main project folder, _<project_root>_, can contain the following files:

- **.vscode/**: (Optional) Contains the stored Visual Studio Code configuration. To learn more, see [Visual Studio Code settings](https://code.visualstudio.com/docs/getstarted/settings).
- **dist/**: Contains the compiled JavaScript code after you run a build. You can configure the name of this folder in your "tsconfig.json" file.
- **src/functions/**: The default location for all functions and their related triggers and bindings.
- **test/**: (Optional) Contains the test cases of your function app.
- **.funcignore**: (Optional) Declares files that shouldn't get published to Azure. Usually, this file contains _.vscode/_ to ignore your editor setting, _test/_ to ignore test cases, and _local.settings.json_ to prevent local app settings from being published.
- **host.json**: Contains configuration options that affect all functions in a function app instance. This file gets published to Azure. Not all options are supported when running locally. To learn more, see [host.json](functions-host-json.md).
- **local.settings.json**: Used to store app settings and connection strings when running locally. This file doesn't get published to Azure. To learn more, see [local.settings.file](functions-develop-local.md#local-settings-file).
- **package.json**: Contains configuration options like a list of package dependencies, the main entry point, and scripts.
- **tsconfig.json**: Contains TypeScript compiler options like the output directory.

---

::: zone-end

### Package management

Effective package management is crucial for Node.js Azure Functions projects. This section covers dependency management, package configuration, and best practices for maintaining your function app dependencies.

#### Managing dependencies

All Node.js Azure Functions projects use npm for package management. Your `package.json` file defines the project configuration, dependencies, and scripts needed to build and run your functions.

**Essential package.json structure:**

```json
{
  "name": "my-functions-app",
  "version": "1.0.0",
  "description": "Azure Functions Node.js app",
  "main": "src/index.js",
  "scripts": {
    "build": "tsc",
    "watch": "tsc -w",
    "prestart": "npm run build",
    "start": "func start",
    "test": "jest"
  },
  "dependencies": {
    "@azure/functions": "^4.0.0"
  },
  "devDependencies": {
    "@azure/functions-core-tools": "^4.0.4670",
    "@types/node": "^18.0.0",
    "typescript": "^4.0.0",
    "jest": "^29.0.0"
  }
}
```

#### Runtime vs. development dependencies

Separate your dependencies appropriately:

**Runtime dependencies (`dependencies`):**
- `@azure/functions`: The core Azure Functions library
- Business logic libraries (lodash, axios, and similar packages)
- Database drivers (mongodb, mssql, and similar packages)
- Azure SDK packages (@azure/storage-blob, @azure/cosmos, and similar packages)

**Development dependencies (`devDependencies`):**
- TypeScript compiler and type definitions
- Testing frameworks (Jest, Mocha)
- Build tools and linters
- Azure Functions Core Tools (for local development)

#### TypeScript-specific packages

For TypeScript projects, include these essential development dependencies:

```json
{
  "devDependencies": {
    "@types/node": "^18.0.0",
    "typescript": "^4.0.0",
    "@typescript-eslint/eslint-plugin": "^5.0.0",
    "@typescript-eslint/parser": "^5.0.0"
  }
}
```

#### Security and updates

Regularly update your dependencies to address security vulnerabilities:

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Audit for security issues
npm audit
npm audit fix
```

## Running and debugging

This section covers local development, debugging techniques, and testing strategies for Node.js Azure Functions.

#### Local development setup

**Prerequisites:**
- [Node.js](https://nodejs.org/) version 18.x or 20.x
- [Azure Functions Core Tools](functions-run-local.md) v4.x
- [Azure CLI](/cli/azure/install-azure-cli) (optional)

**Setup steps:**

1. **Install dependencies:**
   ```bash
   npm install
   ```

1. **Build TypeScript projects:**
   ```bash
   npm run build
   ```

1. **Start the local runtime:**
   ```bash
   npm start
   # or directly:
   func start
   ```

#### Environment configuration

Configure your local development environment by using `local.settings.json`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "NODE_ENV": "development",
    "CUSTOM_ENV_VARIABLE": "local-value"
  },
  "Host": {
    "LocalHttpPort": 7071,
    "CORS": "*",
    "CORSCredentials": false
  }
}
```

#### Debugging

**Visual Studio Code debugging:**

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Attach to Node Functions",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "preLaunchTask": "func: host start"
    }
  ]
}
```

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "func",
      "label": "func: host start",
      "command": "host start",
      "problemMatcher": "$func-node-watch",
      "isBackground": true,
      "options": {
        "cwd": "${workspaceFolder}"
      }
    }
  ]
}
```

**Command line debugging:**

```bash
# Start with debugging enabled
func start --p <port>

# For TypeScript, ensure you build first
npm run build
func start --p 9229
```

## Deployment

This section covers deployment strategies, CI/CD integration, and production best practices for Node.js Azure Functions.

#### Deployment methods

**1. Visual Studio Code deployment:**
- Install the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).
- Right-click your function app in the Azure panel.
- Select **Deploy to Function App**.

**2. Azure Functions Core Tools:**
```bash
# Deploy to Azure
func azure functionapp publish <FunctionAppName>

# Deploy with custom settings
func azure functionapp publish <FunctionAppName> --build local --publish-local-settings
```

**3. Azure CLI deployment:**
```bash
# Deploy from local folder
az functionapp deployment source config-zip \
  --resource-group <ResourceGroupName> \
  --name <FunctionAppName> \
  --src <PathToZipFile>
```

#### Production configuration

**Application settings in Azure:**

Configure environment variables for production:
- `WEBSITE_NODE_DEFAULT_VERSION`: Set to `~18` or `~20`.
- `FUNCTIONS_WORKER_RUNTIME`: Set to `node`.
- Connection strings and API keys as secure app settings.
- `NODE_ENV`: Set to `production`.

## Triggers and bindings

Azure Functions uses **triggers** to start function execution and **bindings** to connect your code to other services like storage, queues, and databases. In the Node.js programming model, you declare bindings differently depending on your model version.

Two main types of bindings exist:
- **Triggers** (input that starts the function)
- **Inputs and outputs** (extra data sources or destinations)

For more information about the available triggers and bindings, see [Triggers and Bindings in Azure Functions](./functions-triggers-bindings.md).

### Example: Timer Trigger with Blob Input
<a name="extra-inputs-and-outputs"></a>

::: zone pivot="nodejs-model-v4"

This function triggers every 10 minutes, reads from a Blob using extra inputs, and logs the blob content.

#### [JavaScript](#tab/javascript)

```javascript
const { app, input } = require('@azure/functions');

let CACHED_BLOB_DATA = null;

const blobInput = input.storageBlob({
    connection: 'BLOB_CONNECTION_SETTING',
    path: 'mycontainer/myblob.txt'
});

app.timer('TimerTriggerWithBlob', {
    schedule: '0 */10 * * * *',
    extraInputs: [blobInput],
    handler: async (myTimer, context) => {
        if (CACHED_BLOB_DATA === null) {
            // Read blob content and cache it
            CACHED_BLOB_DATA = context.extraInputs.get(blobInput);
            context.log(`Blob content cached: ${CACHED_BLOB_DATA?.substring(0, 100)}...`);
        }
        
        context.log(`Timer function executed at: ${new Date().toISOString()}`);
        context.log(`Using cached data of length: ${CACHED_BLOB_DATA?.length || 0}`);
    }
});
```

#### [TypeScript](#tab/typescript)

```typescript
import { app, InvocationContext, Timer, input } from '@azure/functions';

let CACHED_BLOB_DATA: string | null = null;

const blobInput = input.storageBlob({
    connection: 'BLOB_CONNECTION_SETTING',
    path: 'mycontainer/myblob.txt'
});

async function timerTriggerWithBlob(myTimer: Timer, context: InvocationContext): Promise<void> {
    if (CACHED_BLOB_DATA === null) {
        // Read blob content and cache it
        CACHED_BLOB_DATA = context.extraInputs.get(blobInput) as string;
        context.log(`Blob content cached: ${CACHED_BLOB_DATA?.substring(0, 100)}...`);
    }
    
    context.log(`Timer function executed at: ${new Date().toISOString()}`);
    context.log(`Using cached data of length: ${CACHED_BLOB_DATA?.length || 0}`);
}

app.timer('TimerTriggerWithBlob', {
    schedule: '0 */10 * * * *',
    extraInputs: [blobInput],
    handler: timerTriggerWithBlob
});
```

---

::: zone-end

::: zone pivot="nodejs-model-v3"

This function triggers every 10 minutes, reads from a Blob by using bindings configuration, and logs the blob content.

#### [JavaScript](#tab/javascript)

```json
{
  "scriptFile": "index.js",
  "bindings": [
    {
      "name": "myTimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 */10 * * * *"
    },
    {
      "name": "blobInput",
      "type": "blob",
      "direction": "in",
      "path": "mycontainer/myblob.txt",
      "connection": "AzureWebJobsStorage"
    }
  ]
}
```

```javascript
let CACHED_BLOB_DATA = null;

module.exports = async function (context, myTimer) {
    if (CACHED_BLOB_DATA === null) {
        // Read blob content and cache it
        CACHED_BLOB_DATA = context.bindings.blobInput;
        context.log(`Blob content cached: ${CACHED_BLOB_DATA?.substring(0, 100)}...`);
    }
    
    context.log(`Timer function executed at: ${new Date().toISOString()}`);
    context.log(`Using cached data of length: ${CACHED_BLOB_DATA?.length || 0}`);
};
```

#### [TypeScript](#tab/typescript)

```json
{
  "scriptFile": "../dist/TimerTriggerWithBlob/index.js",
  "bindings": [
    {
      "name": "myTimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 */10 * * * *"
    },
    {
      "name": "blobInput",
      "type": "blob",
      "direction": "in",
      "path": "mycontainer/myblob.txt",
      "connection": "AzureWebJobsStorage"
    }
  ]
}
```

```typescript
import { AzureFunction, Context } from "@azure/functions";

let CACHED_BLOB_DATA: string | null = null;

const timerTriggerWithBlob: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    if (CACHED_BLOB_DATA === null) {
        // Read blob content and cache it
        CACHED_BLOB_DATA = context.bindings.blobInput;
        context.log(`Blob content cached: ${CACHED_BLOB_DATA?.substring(0, 100)}...`);
    }
    
    context.log(`Timer function executed at: ${new Date().toISOString()}`);
    context.log(`Using cached data of length: ${CACHED_BLOB_DATA?.length || 0}`);
};

export default timerTriggerWithBlob;
```

---

::: zone-end

### Example: HTTP Trigger with Queue Output

::: zone pivot="nodejs-model-v4"

This function triggers on an HTTP request, writes a message to a storage queue, and returns an HTTP response.

#### [JavaScript](#tab/javascript)

```javascript
const { app, output } = require('@azure/functions');

const queueOutput = output.storageQueue({
    connection: 'AzureWebJobsStorage',
    queueName: 'myqueue'
});

app.http('httpTriggerWithQueue', {
    methods: ['GET', 'POST'],
    extraOutputs: [queueOutput],
    handler: async (request, context) => {
        const name = request.query.get('name') || 'World';
        const message = {
            id: context.invocationId,
            name: name,
            timestamp: new Date().toISOString()
        };

        // Write to queue output
        context.extraOutputs.set(queueOutput, JSON.stringify(message));
        context.log(`Message sent to queue: ${JSON.stringify(message)}`);

        return {
            body: `Hello, ${name}! Message queued successfully.`
        };
    }
});
```

#### [TypeScript](#tab/typescript)

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from '@azure/functions';

const queueOutput = output.storageQueue({
    connection: 'AzureWebJobsStorage',
    queueName: 'myqueue'
});

interface QueueMessage {
    id: string;
    name: string;
    timestamp: string;
}

async function httpTriggerWithQueue(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    const name = request.query.get('name') || 'World';
    const message: QueueMessage = {
        id: context.invocationId,
        name: name,
        timestamp: new Date().toISOString()
    };

    // Write to queue output
    context.extraOutputs.set(queueOutput, JSON.stringify(message));
    context.log(`Message sent to queue: ${JSON.stringify(message)}`);

    return {
        body: `Hello, ${name}! Message queued successfully.`
    };
}

app.http('httpTriggerWithQueue', {
    methods: ['GET', 'POST'],
    extraOutputs: [queueOutput],
    handler: httpTriggerWithQueue
});
```

---

::: zone-end

::: zone pivot="nodejs-model-v3"

This function triggers on an HTTP request, writes a message to a storage queue, and returns an HTTP response.

#### [JavaScript](#tab/javascript)

```json
{
  "scriptFile": "index.js",
  "bindings": [
    {
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "post"]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    },
    {
      "type": "queue",
      "direction": "out",
      "name": "outputQueue",
      "queueName": "myqueue",
      "connection": "AzureWebJobsStorage"
    }
  ]
}
```

```javascript
module.exports = async function (context, req) {
    const name = (req.query.name || (req.body && req.body.name)) || 'World';
    const message = {
        id: context.invocationId,
        name: name,
        timestamp: new Date().toISOString()
    };

    // Write to queue output
    context.bindings.outputQueue = JSON.stringify(message);
    context.log(`Message sent to queue: ${JSON.stringify(message)}`);

    return {
        status: 200,
        body: `Hello, ${name}! Message queued successfully.`
    };
};
```

#### [TypeScript](#tab/typescript)

```json
{
  "scriptFile": "../dist/HttpTriggerWithQueue/index.js",
  "bindings": [
    {
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "post"]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    },
    {
      "type": "queue",
      "direction": "out",
      "name": "outputQueue",
      "queueName": "myqueue",
      "connection": "AzureWebJobsStorage"
    }
  ]
}
```

```typescript
import { AzureFunction, Context, HttpRequest } from "@azure/functions";

interface QueueMessage {
    id: string;
    name: string;
    timestamp: string;
}

const httpTriggerWithQueue: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<any> {
    const name = (req.query.name || (req.body && req.body.name)) || 'World';
    const message: QueueMessage = {
        id: context.invocationId,
        name: name,
        timestamp: new Date().toISOString()
    };

    // Write to queue output
    context.bindings.outputQueue = JSON.stringify(message);
    context.log(`Message sent to queue: ${JSON.stringify(message)}`);

    return {
        status: 200,
        body: `Hello, ${name}! Message queued successfully.`
    };
};

export default httpTriggerWithQueue;
```

---

::: zone-end

The `app`, `trigger`, `input`, and `output` objects exported by the `@azure/functions` module provide type-specific methods for most types. For all the types that aren't supported, a `generic` method is provided to allow you to manually specify the configuration. The `generic` method can also be used if you want to change the default settings provided by a type-specific method.

The following example is a simple HTTP triggered function using generic methods instead of type-specific methods.

#### [JavaScript](#tab/javascript)

```javascript
const { app, output, trigger } = require("@azure/functions");

app.generic("helloWorld1", {
  trigger: trigger.generic({
    type: "httpTrigger",
    methods: ["GET", "POST"],
  }),
  return: output.generic({
    type: "http",
  }),
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);

    return { body: `Hello, world!` };
  },
});
```

#### [TypeScript](#tab/typescript)

```typescript
import {
  app,
  InvocationContext,
  HttpRequest,
  HttpResponseInit,
  output,
  trigger,
} from "@azure/functions";

async function helloWorld1(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  return { body: `Hello, world!` };
}

app.generic("helloWorld1", {
  trigger: trigger.generic({
    type: "httpTrigger",
    methods: ["GET", "POST"],
  }),
  return: output.generic({
    type: "http",
  }),
  handler: helloWorld1,
});
```

---

::: zone-end

<a name="context-object"></a>

## Invocation context

::: zone pivot="nodejs-model-v3"

Each invocation of your function receives an invocation `context` object. Use this object to read inputs, set outputs, write to logs, and access various metadata. In the v3 model, you always pass the context object as the first argument to your handler.

The `context` object includes the following properties:

| Property | Description |
| --- | --- |
| **`invocationId`** | The ID of the current function invocation. |
| **`executionContext`** | See [execution context](#contextexecutioncontext). |
| **`bindings`** | See [bindings](#contextbindings). |
| **`bindingData`** | Metadata about the trigger input for this invocation, excluding the value itself. For example, an [event hub trigger](./functions-bindings-event-hubs-trigger.md) has an `enqueuedTimeUtc` property. |
| **`traceContext`** | The context for distributed tracing. For more information, see [`Trace Context`](https://www.w3.org/TR/trace-context/). |
| **`bindingDefinitions`** | The configuration of your inputs and outputs, as defined in `function.json`. |
| **`req`** | See [HTTP request](#http-request). |
| **`res`** | See [HTTP response](#http-response). |

### context.executionContext

The `context.executionContext` object has the following properties:

| Property | Description |
| --- | --- |
| **`invocationId`** | The ID of the current function invocation. |
| **`functionName`** | The name of the function that you're invoking. The name of the folder containing the `function.json` file determines the name of the function. |
| **`functionDirectory`** | The folder containing the `function.json` file. |
| **`retryContext`** | See [retry context](#contextexecutioncontextretrycontext). |

#### context.executionContext.retryContext

The `context.executionContext.retryContext` object has the following properties:

| Property | Description |
| --- | --- |
| **`retryCount`** | A number representing the current retry attempt. |
| **`maxRetryCount`** | Maximum number of times an execution is retried. A value of `-1` means to retry indefinitely. |
| **`exception`** | Exception that caused the retry. |

<a name="contextbindings-property"></a>

### context.bindings

Use the `context.bindings` object to read inputs or set outputs. The following example is a [storage queue trigger](./functions-bindings-storage-queue-trigger.md) that uses `context.bindings` to copy a [storage blob input](./functions-bindings-storage-blob-input.md) to a [storage blob output](./functions-bindings-storage-blob-output.md). The queue message's content replaces `{queueTrigger}` as the file name to be copied, with the help of a [binding expression](./functions-bindings-expressions-patterns.md).

```json
{
    "name": "myQueueItem",
    "type": "queueTrigger",
    "direction": "in",
    "connection": "storage_APPSETTING",
    "queueName": "helloworldqueue"
},
{
    "name": "myInput",
    "type": "blob",
    "direction": "in",
    "connection": "storage_APPSETTING",
    "path": "helloworld/{queueTrigger}"
},
{
    "name": "myOutput",
    "type": "blob",
    "direction": "out",
    "connection": "storage_APPSETTING",
    "path": "helloworld/{queueTrigger}-copy"
}
```

#### [JavaScript](#tab/javascript)

```javascript
module.exports = async function (context, myQueueItem) {
  const blobValue = context.bindings.myInput;
  context.bindings.myOutput = blobValue;
};
```

#### [TypeScript](#tab/typescript)

```typescript
import { AzureFunction, Context } from "@azure/functions";

const queueTrigger1: AzureFunction = async function (
  context: Context,
  myQueueItem: string
): Promise<void> {
  const blobValue = context.bindings.myInput;
  context.bindings.myOutput = blobValue;
};

export default queueTrigger1;
```

---

<a name="contextdone-method"></a>

### context.done

The `context.done` method is deprecated. Before Azure Functions supported async functions, you signaled your function was done by calling `context.done()`:

#### [JavaScript](#tab/javascript)

```javascript
module.exports = function (context, request) {
  context.log("this pattern is now deprecated");
  context.done();
};
```

#### [TypeScript](#tab/typescript)

```typescript
import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = function (
  context: Context,
  request: HttpRequest
): void {
  context.log("this pattern is now deprecated");
  context.done();
};

export default httpTrigger;
```

---

Remove the call to `context.done()`. Mark your function as async so that it returns a promise (even if you don't `await` anything). As soon as your function finishes (in other words, the returned promise resolves), the v3 model knows your function is done.

#### [JavaScript](#tab/javascript)

```javascript
module.exports = async function (context, request) {
  context.log("you don't need context.done or an awaited call");
};
```

#### [TypeScript](#tab/typescript)

```typescript
import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  request: HttpRequest
): Promise<void> {
  context.log("you don't need context.done or an awaited call");
};

export default httpTrigger;
```

---

::: zone-end

::: zone pivot="nodejs-model-v4"

Each invocation of your function receives an invocation `context` object. This object contains information about your invocation and methods for logging. In the v4 model, you typically pass the `context` object as the second argument to your handler.

The `InvocationContext` class includes the following properties:

| Property | Description |
| --- | --- |
| **`invocationId`** | The ID of the current function invocation. |
| **`functionName`** | The name of the function. |
| **`extraInputs`** | Used to get the values of extra inputs. For more information, see [extra inputs and outputs](#extra-inputs-and-outputs). |
| **`extraOutputs`** | Used to set the values of extra outputs. For more information, see [extra inputs and outputs](#extra-inputs-and-outputs). |
| **`retryContext`** | See [retry context](#retry-context). |
| **`traceContext`** | The context for distributed tracing. For more information, see [`Trace Context`](https://www.w3.org/TR/trace-context/). |
| **`triggerMetadata`** | Metadata about the trigger input for this invocation, not including the value itself. For example, an [event hub trigger](./functions-bindings-event-hubs-trigger.md) has an `enqueuedTimeUtc` property. |
| **`options`** | The options used when registering the function, after they're validated and defaults are explicitly specified. |

### Retry context

The `retryContext` object has the following properties:

| Property | Description |
| --- | --- |
| **`retryCount`** | A number representing the current retry attempt. |
| **`maxRetryCount`** | Maximum number of times an execution is retried. A value of `-1` means to retry indefinitely. |
| **`exception`** | Exception that caused the retry. |

For more information, see [`retry-policies`](./functions-bindings-error-pages.md#retry-policies).

::: zone-end

<a name="contextlog-method"></a>
<a name="write-trace-output-to-logs"></a>

## Logging

In Azure Functions, use `context.log()` to write logs. Azure Functions integrates with Azure Application Insights to better capture your function app logs. Application Insights, part of Azure Monitor, provides facilities for collection, visual rendering, and analysis of both application logs and your trace outputs. To learn more, see [monitoring Azure Functions](functions-monitoring.md).

> [!NOTE]
> If you use the alternative Node.js `console.log` method, the app-level logs are tracked but aren't associated with any specific function. Use `context` for logging instead of `console` so that all logs are associated with a specific function.

The following example writes a log at the default "information" level, including the invocation ID:

### [JavaScript](#tab/javascript)

```javascript
context.log(`Something has happened. Invocation ID: "${context.invocationId}"`);
```

### [TypeScript](#tab/typescript)

```typescript
context.log(`Something has happened. Invocation ID: "${context.invocationId}"`);
```

---

<a name="trace-levels"></a>

### Log levels

In addition to the default `context.log` method, use the following methods to write logs at specific levels:

::: zone pivot="nodejs-model-v3"

| Method | Description |
| --- | --- |
| **`context.log.error()`** | Writes an error-level event to the logs. |
| **`context.log.warn()`** | Writes a warning-level event to the logs. |
| **`context.log.info()`** | Writes an information-level event to the logs. |
| **`context.log.verbose()`** | Writes a trace-level event to the logs. |

::: zone-end

::: zone pivot="nodejs-model-v4"

| Method | Description |
| --- | --- |
| **`context.trace()`** | Writes a trace-level event to the logs. |
| **`context.debug()`** | Writes a debug-level event to the logs. |
| **`context.info()`** | Writes an information-level event to the logs. |
| **`context.warn()`** | Writes a warning-level event to the logs. |
| **`context.error()`** | Writes an error-level event to the logs. |

::: zone-end

<a name="configure-the-trace-level-for-logging"></a>

### Configure log level

Functions enables you to define the threshold level for tracking and viewing logs. To set the threshold, use the `logging.logLevel` property in the `host.json` file. This property lets you define a default level for all functions or a threshold for each individual function. For more information, see [How to configure monitoring for Azure Functions](configure-monitoring.md).

## Track custom data

By default, Azure Functions writes output as traces to Application Insights. For more control, use the [Application Insights Node.js SDK](https://github.com/microsoft/applicationinsights-node.js) to send custom logs, metrics, and dependencies to your Application Insights instance.

> [!NOTE]
> Methods in the Application Insights Node.js SDK might change over time. There might be minor syntax differences from the examples shown here. For the latest API usage examples, see the [Application Insights Node.js SDK documentation](https://github.com/microsoft/applicationinsights-node.js).

::: zone pivot="nodejs-model-v4"  
For distributed tracing in the Node.js v4 programming model, use the [`@azure/functions-opentelemetry-instrumentation`](https://www.npmjs.com/package/@azure/functions-opentelemetry-instrumentation) package instead of the Application Insights SDK. This package provides OpenTelemetry-based automatic instrumentation for Azure Functions. For more information, see the [OpenTelemetry Azure Functions Instrumentation for Node.js](https://github.com/Azure/azure-functions-nodejs-opentelemetry) GitHub repository.  
::: zone-end

### [JavaScript](#tab/javascript)

```javascript
const appInsights = require("applicationinsights");
appInsights.setup();
const client = appInsights.defaultClient;

module.exports = async function (context, request) {
  // Use this with 'tagOverrides' to correlate custom logs to the parent function invocation.
  var operationIdOverride = {
    "ai.operation.id": context.traceContext.traceparent,
  };

  client.trackEvent({
    name: "my custom event",
    tagOverrides: operationIdOverride,
    properties: { customProperty2: "custom property value" },
  });
  client.trackException({
    exception: new Error("handled exceptions can be logged with this method"),
    tagOverrides: operationIdOverride,
  });
  client.trackMetric({
    name: "custom metric",
    value: 3,
    tagOverrides: operationIdOverride,
  });
  client.trackTrace({
    message: "trace message",
    tagOverrides: operationIdOverride,
  });
  client.trackDependency({
    target: "http://dbname",
    name: "select customers proc",
    data: "SELECT * FROM Customers",
    duration: 231,
    resultCode: 0,
    success: true,
    dependencyTypeName: "ZSQL",
    tagOverrides: operationIdOverride,
  });
  client.trackRequest({
    name: "GET /customers",
    url: "http://myserver/customers",
    duration: 309,
    resultCode: 200,
    success: true,
    tagOverrides: operationIdOverride,
  });
};
```

### [TypeScript](#tab/typescript)

```typescript
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as appInsights from "applicationinsights";

appInsights.setup();
const client = appInsights.defaultClient;

const httpTrigger: AzureFunction = async function (
  context: Context,
  request: HttpRequest
): Promise<void> {
  // Use this with 'tagOverrides' to correlate custom logs to the parent function invocation.
  var operationIdOverride = {
    "ai.operation.id": context.traceContext.traceparent,
  };

  client.trackEvent({
    name: "my custom event",
    tagOverrides: operationIdOverride,
    properties: { customProperty2: "custom property value" },
  });
  client.trackException({
    exception: new Error("handled exceptions can be logged with this method"),
    tagOverrides: operationIdOverride,
  });
  client.trackMetric({
    name: "custom metric",
    value: 3,
    tagOverrides: operationIdOverride,
  });
  client.trackTrace({
    message: "trace message",
    tagOverrides: operationIdOverride,
  });
  client.trackDependency({
    target: "http://dbname",
    name: "select customers proc",
    data: "SELECT * FROM Customers",
    duration: 231,
    resultCode: 0,
    success: true,
    dependencyTypeName: "ZSQL",
    tagOverrides: operationIdOverride,
  });
  client.trackRequest({
    name: "GET /customers",
    url: "http://myserver/customers",
    duration: 309,
    resultCode: 200,
    success: true,
    tagOverrides: operationIdOverride,
  });
};

export default httpTrigger;
```

---

The `tagOverrides` parameter sets the `operation_Id` to the function's invocation ID. This setting enables you to correlate all the automatically generated and custom logs for a given function invocation.

<a name="http-triggers-and-bindings"></a>

## HTTP triggers

::: zone pivot="nodejs-model-v3"

HTTP and webhook triggers use request and response objects to represent HTTP messages.

::: zone-end

::: zone pivot="nodejs-model-v4"

HTTP and webhook triggers use `HttpRequest` and `HttpResponse` objects to represent HTTP messages. The classes represent a subset of the [fetch standard](https://developer.mozilla.org/docs/Web/API/fetch), using Node.js's [`undici`](https://undici.nodejs.org/) package.

::: zone-end

<a name="request-object"></a>
<a name="accessing-the-request-and-response"></a>

### HTTP request

::: zone pivot="nodejs-model-v3"

Access the request in several ways:

- **As the second argument to your function:**

  #### [JavaScript](#tab/javascript)

  ```javascript
  module.exports = async function (context, request) {
      context.log(`Http function processed request for url "${request.url}"`);
  ```

  #### [TypeScript](#tab/typescript)

  ```typescript
  const httpTrigger: AzureFunction = async function (context: Context, request: HttpRequest): Promise<void> {
      context.log(`Http function processed request for url "${request.url}"`);
  ```

  ***

- **From the `context.req` property:**

  #### [JavaScript](#tab/javascript)

  ```javascript
  module.exports = async function (context, request) {
      context.log(`Http function processed request for url "${context.req.url}"`);
  ```

  #### [TypeScript](#tab/typescript)

  ```typescript
  const httpTrigger: AzureFunction = async function (context: Context, request: HttpRequest): Promise<void> {
      context.log(`Http function processed request for url "${context.req.url}"`);
  ```

  ***

- **From the named input bindings:** This option works the same as any non-HTTP binding. The binding name in `function.json` must match the key on `context.bindings`, or "request1" in the following example:

  ```json
  {
    "name": "request1",
    "type": "httpTrigger",
    "direction": "in",
    "authLevel": "anonymous",
    "methods": ["get", "post"]
  }
  ```

  #### [JavaScript](#tab/javascript)

  ```javascript
  module.exports = async function (context, request) {
      context.log(`Http function processed request for url "${context.bindings.request1.url}"`);
  ```

  #### [TypeScript](#tab/typescript)

  ```typescript
  const httpTrigger: AzureFunction = async function (context: Context, request: HttpRequest): Promise<void> {
      context.log(`Http function processed request for url "${context.bindings.request1.url}"`);
  ```

  ***

The `HttpRequest` object has the following properties:

| Property | Type | Description |
| --- | --- | --- |
| **`method`** | `string` | HTTP request method used to invoke this function. |
| **`url`** | `string` | Request URL. |
| **`headers`** | `Record<string, string>` | HTTP request headers. This object is case sensitive. Use `request.getHeader('header-name')` instead, which is case insensitive. |
| **`query`** | `Record<string, string>` | Query string parameter keys and values from the URL. |
| **`params`** | `Record<string, string>` | Route parameter keys and values. |
| **`user`** | `HttpRequestUser \| null` | Object representing logged-in user, either through Functions authentication, SWA Authentication, or null when no such user is logged in. |
| **`body`** | `Buffer \| string \| any` | If the media type is "application/octet-stream" or "multipart/\*", `body` is a Buffer. If the value is a JSON parse-able string, `body` is the parsed object. Otherwise, `body` is a string. |
| **`rawBody`** | `string` | The body as a string. Despite the name, this property doesn't return a Buffer. |
| **`bufferBody`** | `Buffer` | The body as a buffer. |

::: zone-end

::: zone pivot="nodejs-model-v4"

You can access the request as the first argument to your handler for an HTTP triggered function.

#### [JavaScript](#tab/javascript)

```javascript
async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
```

#### [TypeScript](#tab/typescript)

```typescript
async function helloWorld1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
```

---

The `HttpRequest` object has the following properties:

| Property | Type | Description |
| --- | --- | --- |
| **`method`** | `string` | HTTP request method used to invoke this function. |
| **`url`** | `string` | Request URL. |
| **`headers`** | [`Headers`](https://developer.mozilla.org/docs/Web/API/Headers) | HTTP request headers. |
| **`query`** | [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) | Query string parameter keys and values from the URL. |
| **`params`** | `Record<string, string>` | Route parameter keys and values. |
| **`user`** | `HttpRequestUser \| null` | Object representing logged-in user, either through Functions authentication, SWA Authentication, or null when no such user is logged in. |
| **`body`** | [`ReadableStream \| null`](https://developer.mozilla.org/docs/Web/API/ReadableStream) | Body as a readable stream. |
| **`bodyUsed`** | `boolean` | A boolean indicating if the body is already read. |

To access a request or response's body, use the following methods:

| Method | Return Type |
| --- | --- |
| **`arrayBuffer()`** | [`Promise<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) |
| **`blob()`** | [`Promise<Blob>`](https://developer.mozilla.org/docs/Web/API/Blob) |
| **`formData()`** | [`Promise<FormData>`](https://developer.mozilla.org/docs/Web/API/FormData) |
| **`json()`** | `Promise<unknown>` |
| **`text()`** | `Promise<string>` |

> [!NOTE]
> You can run the body functions only once. Subsequent calls resolve with empty strings or ArrayBuffers.

::: zone-end

<a name="response-object"></a>

### HTTP response

::: zone pivot="nodejs-model-v3"

You can set the response in several ways. For example, you can use:

- **Set the `context.res` property:**

  #### [JavaScript](#tab/javascript)

  ```javascript
  module.exports = async function (context, request) {
      context.res = { body: `Hello, world!` };
  ```

  #### [TypeScript](#tab/typescript)

  ```typescript
  const httpTrigger: AzureFunction = async function (context: Context, request: HttpRequest): Promise<void> {
      context.res = { body: `Hello, world!` };
  ```

  ***

- **Return the response:** If your function is async and you set the binding name to `$return` in your `function.json`, you can return the response directly instead of setting it on `context`.

  ```json
  {
    "type": "http",
    "direction": "out",
    "name": "$return"
  }
  ```

  #### [JavaScript](#tab/javascript)

  ```javascript
  module.exports = async function (context, request) {
      return { body: `Hello, world!` };
  ```

  #### [TypeScript](#tab/typescript)

  ```typescript
  const httpTrigger: AzureFunction = async function (context: Context, request: HttpRequest): Promise<HttpResponseSimple> {
      return { body: `Hello, world!` };
  ```

  ***

- **Set the named output binding:** This option works the same as any non-HTTP binding. The binding name in `function.json` must match the key on `context.bindings`, or "response1" in the following example:

  ```json
  {
    "type": "http",
    "direction": "out",
    "name": "response1"
  }
  ```

  #### [JavaScript](#tab/javascript)

  ```javascript
  module.exports = async function (context, request) {
      context.bindings.response1 = { body: `Hello, world!` };
  ```

  #### [TypeScript](#tab/typescript)

  ```typescript
  const httpTrigger: AzureFunction = async function (context: Context, request: HttpRequest): Promise<void> {
      context.bindings.response1 = { body: `Hello, world!` };
  ```

  ***

- **Call `context.res.send()`:** This option is deprecated. It implicitly calls `context.done()` and you can't use it in an async function.

  #### [JavaScript](#tab/javascript)

  ```javascript
  module.exports = function (context, request) {
      context.res.send(`Hello, world!`);
  ```

  #### [TypeScript](#tab/typescript)

  ```typescript
  const httpTrigger: AzureFunction = function (context: Context, request: HttpRequest): void {
      context.res.send(`Hello, world!`);
  ```

  ***

If you create a new object when setting the response, that object must match the `HttpResponseSimple` interface, which has the following properties:

| Property | Type | Description |
| --- | --- | --- |
| **`headers`** | `Record<string, string>` (optional) | HTTP response headers. |
| **`cookies`** | `Cookie[]` (optional) | HTTP response cookies. |
| **`body`** | `any` (optional) | HTTP response body. |
| **`statusCode`** | `number` (optional) | HTTP response status code. If not set, defaults to `200`. |
| **`status`** | `number` (optional) | The same as `statusCode`. This property is ignored if `statusCode` is set. |

You can also modify the `context.res` object without overwriting it. The default `context.res` object uses the `HttpResponseFull` interface, which supports the following methods in addition to the `HttpResponseSimple` properties:

| Method | Description |
| --- | --- |
| **`status()`** | Sets the status. |
| **`setHeader()`** | Sets a header field. **NOTE:** `res.set()` and `res.header()` are also supported and do the same thing. |
| **`getHeader()`** | Gets a header field. **NOTE:** `res.get()` is also supported and does the same thing. |
| **`removeHeader()`** | Removes a header. |
| **`type()`** | Sets the "content-type" header. |
| **`send()`** | This method is deprecated. It sets the body and calls `context.done()` to indicate a sync function is finished. **NOTE:** `res.end()` is also supported and does the same thing. |
| **`sendStatus()`** | This method is deprecated. It sets the status code and calls `context.done()` to indicate a sync function is finished. |
| **`json()`** | This method is deprecated. It sets the "content-type" to "application/json", sets the body, and calls `context.done()` to indicate a sync function is finished. |

::: zone-end

::: zone pivot="nodejs-model-v4"

You can set the response in several ways. For example, you can use:

- **A simple interface with type `HttpResponseInit`:** This option is the most concise way of returning responses.

  #### [JavaScript](#tab/javascript)

  ```javascript
  return { body: `Hello, world!` };
  ```

  #### [TypeScript](#tab/typescript)

  ```typescript
  return { body: `Hello, world!` };
  ```

  ***

  The `HttpResponseInit` interface has the following properties:

  | Property | Type | Description |
  | --- | --- | --- |
  | **`body`** | `BodyInit` (optional) | HTTP response body as one of [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`AsyncIterable<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob), [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData), [`Iterable<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), [`NodeJS.ArrayBufferView`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams), `null`, or `string`. |
  | **`jsonBody`** | `any` (optional) | A JSON-serializable HTTP Response body. If set, the `HttpResponseInit.body` property is ignored in favor of this property. |
  | **`status`** | `number` (optional) | HTTP response status code. If not set, defaults to `200`. |
  | **`headers`** | [`HeadersInit`](https://developer.mozilla.org/docs/Web/API/Headers) (optional) | HTTP response headers. |
  | **`cookies`** | `Cookie[]` (optional) | HTTP response cookies. |

- **As a class with type `HttpResponse`:** This option provides helper methods for reading and modifying various parts of the response like the headers.

  #### [JavaScript](#tab/javascript)

  ```javascript
  const response = new HttpResponse({ body: `Hello, world!` });
  response.headers.set("content-type", "application/json");
  return response;
  ```

  #### [TypeScript](#tab/typescript)

  ```typescript
  const response = new HttpResponse({ body: `Hello, world!` });
  response.headers.set("content-type", "application/json");
  return response;
  ```

  ***

  The `HttpResponse` class accepts an optional `HttpResponseInit` as an argument to its constructor and has the following properties:

  | Property       | Type                                                            | Description                                                       |
  | -------------- | --------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------- |
  | **`status`**   | `number`                                                        | HTTP response status code.                                        |
  | **`headers`**  | [`Headers`](https://developer.mozilla.org/docs/Web/API/Headers) | HTTP response headers.                                            |
  | **`cookies`**  | `Cookie[]`                                                      | HTTP response cookies.                                            |
  | **`body`**     | [`ReadableStream                                                | null`](https://developer.mozilla.org/docs/Web/API/ReadableStream) | Body as a readable stream. |
  | **`bodyUsed`** | `boolean`                                                       | A boolean indicating if the body is already read.      |

::: zone-end

### HTTP streams

HTTP streams is a feature that makes it easier to process large data, stream OpenAI responses, deliver dynamic content, and support other core HTTP scenarios. It lets you stream requests to and responses from HTTP endpoints in your Node.js function app. Use HTTP streams in scenarios where your app requires real-time exchange and interaction between client and server over HTTP. You can also use HTTP streams to get the best performance and reliability for your apps when using HTTP.

::: zone pivot="nodejs-model-v3"

> [!IMPORTANT]
> HTTP streams aren't supported in the v3 model. [Upgrade to the v4 model](./functions-node-upgrade-v4.md) to use the HTTP streaming feature.
> The existing `HttpRequest` and `HttpResponse` types in programming model v4 already support various ways of handling the message body, including as a stream.
::: zone-end  
::: zone pivot="nodejs-model-v4"

### Prerequisites

- The [`@azure/functions` npm package](https://www.npmjs.com/package/@azure/functions) version 4.3.0 or later.
- [Azure Functions runtime](./functions-versions.md) version 4.28 or later.
- [Azure Functions Core Tools](./functions-run-local.md) version 4.0.5530 or later, which contains the correct runtime version.

### Enable streams

Use these steps to enable HTTP streams in your function app in Azure and in your local projects:

1. If you plan to stream large amounts of data, modify the [`FUNCTIONS_REQUEST_BODY_SIZE_LIMIT`](./functions-app-settings.md#functions_request_body_size_limit) setting in Azure. The default maximum body size allowed is `104857600`, which limits your requests to a size of about 100 MB.

1. For local development, also add `FUNCTIONS_REQUEST_BODY_SIZE_LIMIT` to the [local.settings.json file](./functions-develop-local.md#local-settings-file).

1. Add the following code to your app in any file included by your [main field](#programming-model).

   #### [JavaScript](#tab/javascript)

   ```javascript
   const { app } = require("@azure/functions");

   app.setup({ enableHttpStream: true });
   ```

   #### [TypeScript](#tab/typescript)

   ```typescript
   import { app } from "@azure/functions";

   app.setup({ enableHttpStream: true });
   ```

   ***

### Stream examples

The following example shows an HTTP triggered function that receives data through an HTTP POST request. The function streams this data to a specified output file:

#### [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/httpTriggerStreamRequest.js" :::

#### [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/httpTriggerStreamRequest.ts" :::

---

The following example shows an HTTP triggered function that streams a file's content as the response to incoming HTTP GET requests:

#### [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/httpTriggerStreamResponse.js" :::

#### [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/httpTriggerStreamResponse.ts" :::

---

For a ready-to-run sample app that uses streams, check out this [example on GitHub](https://github.com/Azure-Samples/azure-functions-nodejs-stream).

### Stream considerations

- Use `request.body` to get the most benefit from using streams. You can still use methods like `request.text()`, which always return the body as a string.
  ::: zone-end

## Hooks

::: zone pivot="nodejs-model-v3"

The v3 model doesn't support hooks. [Upgrade to the v4 model](./functions-node-upgrade-v4.md) to use hooks.

::: zone-end
::: zone pivot="nodejs-model-v4"

Use a hook to execute code at different points in the Azure Functions lifecycle. The order in which you register hooks determines the order in which they're executed. You can register hooks from any file in your app. Two scopes of hooks exist: "app" level and "invocation" level.

### Invocation hooks

Invocation hooks run once per invocation of your function. A `preInvocation` hook runs before the function runs, and a `postInvocation` hook runs after the function runs. By default, your hook executes for all trigger types, but you can also filter by type. The following example shows how to register an invocation hook and filter by trigger type:

#### [JavaScript](#tab/javascript)

```javascript
const { app } = require('@azure/functions');

// Pre-invocation hook with trigger filtering
app.hook.preInvocation('httpPreInvocation', async (context) => {
  context.hookData.startTime = Date.now();
  context.invocationContext.log(`Pre-invocation hook executed for ${context.invocationContext.functionName}`);
    
  // Add custom headers or modify function handler if needed
  if (context.functionHandler.name === 'httpTrigger') {
    context.invocationContext.log('HTTP function detected, preparing request processing');
  }
}, {
  filter: ['httpTrigger']
});

// Post-invocation hook
app.hook.postInvocation('httpPostInvocation', async (context) => {
  const duration = Date.now() - context.hookData.startTime;
  context.invocationContext.log(`Function ${context.invocationContext.functionName} completed in ${duration}ms`);
    
  // Log results or errors
  if (context.error) {
    context.invocationContext.log.error(`Function failed: ${context.error.message}`);
  } else {
    context.invocationContext.log(`Function succeeded with result: ${JSON.stringify(context.result)}`);
  }
}, {
  filter: ['httpTrigger']
});
```

#### [TypeScript](#tab/typescript)

```typescript
import { app, PreInvocationContext, PostInvocationContext, HttpRequest, HttpResponseInit } from '@azure/functions';

// Pre-invocation hook with trigger filtering
app.hook.preInvocation('httpPreInvocation', async (context: PreInvocationContext) => {
  context.hookData.startTime = Date.now();
  context.invocationContext.log(`Pre-invocation hook executed for ${context.invocationContext.functionName}`);
    
  // Add custom headers or modify function handler if needed
  if (context.functionHandler.name === 'httpTrigger') {
    context.invocationContext.log('HTTP function detected, preparing request processing');
  }
}, {
  filter: ['httpTrigger']
});

// Post-invocation hook
app.hook.postInvocation('httpPostInvocation', async (context: PostInvocationContext) => {
  const duration = Date.now() - context.hookData.startTime;
  context.invocationContext.log(`Function ${context.invocationContext.functionName} completed in ${duration}ms`);
    
  // Log results or errors
  if (context.error) {
    context.invocationContext.log.error(`Function failed: ${context.error.message}`);
  } else {
    context.invocationContext.log(`Function succeeded with result: ${JSON.stringify(context.result)}`);
  }
}, {
  filter: ['httpTrigger']
});
```

---

The first argument to the hook handler is a context object specific to that hook type.

The `PreInvocationContext` object has the following properties:

| Property                | Description                                                                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`inputs`**            | The arguments you pass to the invocation.                                                                                                                                  |
| **`functionHandler`**   | The function handler for the invocation. Changes to this value affect the function itself.                                                                               |
| **`invocationContext`** | The [invocation context](#invocation-context) object passed to the function.                                                                                             |
| **`hookData`**          | The recommended place to store and share data between hooks in the same scope. Use a unique property name so that it doesn't conflict with other hooks' data. |

The `PostInvocationContext` object has the following properties:

| Property                | Description                                                                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`inputs`**            | The arguments you pass to the invocation.                                                                                                                                  |
| **`result`**            | The result of the function. Changes to this value affect the overall result of the function.                                                                             |
| **`error`**             | The error thrown by the function, or null/undefined if there's no error. Changes to this value affect the overall result of the function.                                |
| **`invocationContext`** | The [invocation context](#invocation-context) object passed to the function.                                                                                             |
| **`hookData`**          | The recommended place to store and share data between hooks in the same scope. Use a unique property name so that it doesn't conflict with other hooks' data. |

### App hooks

The runtime executes app hooks once per instance of your app. It runs `appStart` hooks during startup and `appTerminate` hooks during termination. App terminate hooks have a limited time to execute and don't execute in all scenarios.

The Azure Functions runtime currently [doesn't support](https://github.com/Azure/azure-functions-host/issues/8222) context logging outside of an invocation. Use the Application Insights [npm package](https://www.npmjs.com/package/applicationinsights) to log data during app level hooks.

The following example registers app hooks:

#### [JavaScript](#tab/javascript)

```javascript
const { app } = require('@azure/functions');
const appInsights = require('applicationinsights');

// Initialize Application Insights for app-level logging
appInsights.setup().start();
const client = appInsights.defaultClient;

// App start hook
app.hook.appStart('appStartup', async (context) => {
  context.hookData.appStartTime = Date.now();
  context.hookData.initializationData = {};
    
  // Initialize shared resources, database connections, etc.
  client.trackEvent({
    name: 'FunctionAppStarted',
    properties: {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version
    }
  });
    
  // Set up global configurations
  process.env.APP_INITIALIZED = 'true';
});

// App terminate hook
app.hook.appTerminate('appShutdown', async (context) => {
  const uptime = Date.now() - context.hookData.appStartTime;
    
  // Cleanup resources, close connections, etc.
  client.trackEvent({
    name: 'FunctionAppTerminated',
    properties: {
      uptime: uptime,
      timestamp: new Date().toISOString()
    }
  });
    
  // Flush Application Insights data
  await new Promise((resolve) => client.flush({ callback: resolve }));
});
```

#### [TypeScript](#tab/typescript)

```typescript
import { app, AppStartContext, AppTerminateContext } from '@azure/functions';
import * as appInsights from 'applicationinsights';

// Initialize Application Insights for app-level logging
appInsights.setup().start();
const client = appInsights.defaultClient;

interface AppHookData {
  appStartTime: number;
  initializationData: Record<string, any>;
}

// App start hook
app.hook.appStart('appStartup', async (context: AppStartContext) => {
  const hookData = context.hookData as AppHookData;
  hookData.appStartTime = Date.now();
  hookData.initializationData = {};
    
  // Initialize shared resources, database connections, etc.
  client.trackEvent({
    name: 'FunctionAppStarted',
    properties: {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version
    }
  });
    
  // Set up global configurations
  process.env.APP_INITIALIZED = 'true';
});

// App terminate hook
app.hook.appTerminate('appShutdown', async (context: AppTerminateContext) => {
  const hookData = context.hookData as AppHookData;
  const uptime = Date.now() - hookData.appStartTime;
    
  // Cleanup resources, close connections, etc.
  client.trackEvent({
    name: 'FunctionAppTerminated',
    properties: {
      uptime: uptime,
      timestamp: new Date().toISOString()
    }
  });
    
  // Flush Application Insights data
  await new Promise<void>((resolve) => client.flush({ callback: resolve }));
});
```

---

The first argument to the hook handler is a context object specific to that hook type.

The `AppStartContext` object has the following property:

| Property       | Description                                                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`hookData`** | The recommended place to store and share data between hooks in the same scope. Use a unique property name so that it doesn't conflict with other hooks' data. |

The `AppTerminateContext` object has the following property:

| Property       | Description                                                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`hookData`** | The recommended place to store and share data between hooks in the same scope. Use a unique property name so that it doesn't conflict with other hooks' data. |

::: zone-end

## Hook best practices

When using hooks in your Azure Functions, consider these best practices:

### Performance considerations

- Keep hook execution time minimal to avoid impacting function performance.
- Use asynchronous operations where possible to prevent blocking.
- Consider the overhead of hooks when processing high-volume requests.

### Error handling

- Always include proper error handling in your hooks.
- Don't let hook failures cause function failures unless absolutely necessary.
- Log hook errors appropriately for debugging.

### Data sharing

- Use `hookData` to share information between pre and post invocation hooks.
- Use unique property names to avoid conflicts with other hooks.
- Clean up hook data when no longer needed to prevent memory leaks.

### Filtering

- Use trigger type filtering to ensure hooks only run for relevant functions.
- Be specific with your filters to optimize performance.

## Scaling and concurrency

By default, Azure Functions automatically monitors the load on your application and creates more host instances for Node.js as needed. Azure Functions uses built-in (not user configurable) thresholds for different trigger types to decide when to add instances, such as the age of messages and queue size for `QueueTrigger`. For more information, see [How the Consumption and Premium plans work](event-driven-scaling.md).

This scaling behavior is sufficient for many Node.js applications. For CPU-bound applications, you can improve performance further by using multiple language worker processes. You can increase the number of worker processes per host from the default of 1 up to a max of 10 by using the [FUNCTIONS_WORKER_PROCESS_COUNT](functions-app-settings.md#functions_worker_process_count) application setting. Azure Functions then tries to evenly distribute simultaneous function invocations across these workers. This behavior makes it less likely that a CPU-intensive function blocks other functions from running. The setting applies to each host that Azure Functions creates when scaling out your application to meet demand.

> [!WARNING]
> Use the `FUNCTIONS_WORKER_PROCESS_COUNT` setting with caution. Multiple processes running in the same instance can lead to unpredictable behavior and increase function load times. If you use this setting, [running from a package file](./run-functions-from-deployment-package.md) can offset these downsides.

## Node version

You can see the current version that the runtime is using by logging `process.version` from any function. See [`supported versions`](#programming-model) for a list of Node.js versions supported by each programming model.

### Setting the Node version

The way that you upgrade your Node.js version depends on the OS on which your function app runs.

#### [Windows](#tab/windows)

When it runs on Windows, set the Node.js version by using the [`WEBSITE_NODE_DEFAULT_VERSION`](./functions-app-settings.md#website_node_default_version) application setting. Update this setting either by using the Azure CLI or in the Azure portal.

#### [Linux](#tab/linux)

When the function app runs on Linux, the [linuxFxVersion](./functions-app-settings.md#linuxfxversion) site setting determines the Node.js version. You can update this setting by using Azure CLI.

---

For more information about Node.js versions, see [Supported versions](#programming-model).

Before upgrading your Node.js version, make sure your function app is running on the latest version of the Azure Functions runtime. If you need to upgrade your runtime version, see [Migrate apps from Azure Functions version 3.x to version 4.x](migrate-version-3-version-4.md?pivots=programming-language-javascript).

#### [Azure CLI](#tab/azure-cli/windows)

Run the Azure CLI [`az functionapp config appsettings set`](/cli/azure/functionapp/config#az-functionapp-config-appsettings-set) command to update the Node.js version for your function app running on Windows:

```azurecli-interactive
az functionapp config appsettings set  --settings WEBSITE_NODE_DEFAULT_VERSION=~22 \
 --name <FUNCTION_APP_NAME> --resource-group <RESOURCE_GROUP_NAME>
```

This command sets the [`WEBSITE_NODE_DEFAULT_VERSION` application setting](./functions-app-settings.md#website_node_default_version) to the supported LTS version `~22`.

#### [Azure portal](#tab/azure-portal/windows)

Use the following steps to change the Node.js version:

[!INCLUDE [functions-set-nodejs-version-portal](../../includes/functions-set-nodejs-version-portal.md)]

#### [Azure CLI](#tab/azure-cli/linux)

Run the Azure CLI [`az functionapp config set`](/cli/azure/functionapp/config#az-functionapp-config-set) command to update the Node.js version for your function app running on Linux:

```azurecli-interactive
az functionapp config set --linux-fx-version "node|22" --name "<FUNCTION_APP_NAME>" \
 --resource-group "<RESOURCE_GROUP_NAME>"
```

This command sets the base image of the Linux function app to Node.js version 22.

#### [Azure portal](#tab/azure-portal/linux)

> [!NOTE]  
> You can't change the Node.js version in the Azure portal when your function app runs on Linux in a Consumption plan. Instead, use the Azure CLI.

For Premium and Dedicated plans, use the following steps to change the Node.js version:

[!INCLUDE [functions-set-nodejs-version-portal](../../includes/functions-set-nodejs-version-portal.md)]

---

After you make changes, your function app restarts. To learn more about Functions support for Node.js, see [Language runtime support policy](./language-support-policy.md).

<a name="access-environment-variables-in-code"></a>

## Environment variables

Use environment variables to manage operational secrets, such as connection strings, keys, and endpoints. Also use them for environmental settings, like profiling variables. Add environment variables in both your local and cloud environments, and access them through `process.env` in your function code.

The following example logs the `WEBSITE_SITE_NAME` environment variable:

::: zone pivot="nodejs-model-v3"

### [JavaScript](#tab/javascript)

```javascript
module.exports = async function (context) {
  context.log(`WEBSITE_SITE_NAME: ${process.env["WEBSITE_SITE_NAME"]}`);
};
```

### [TypeScript](#tab/typescript)

```typescript
const httpTrigger: AzureFunction = async function (
  context: Context,
  request: HttpRequest
): Promise<void> {
  context.log(`WEBSITE_SITE_NAME: ${process.env["WEBSITE_SITE_NAME"]}`);
};
```

---

::: zone-end

::: zone pivot="nodejs-model-v4"

### [JavaScript](#tab/javascript)

```javascript
async function timerTrigger1(myTimer, context) {
  context.log(`WEBSITE_SITE_NAME: ${process.env["WEBSITE_SITE_NAME"]}`);
}
```

### [TypeScript](#tab/typescript)

```typescript
async function timerTrigger1(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log(`WEBSITE_SITE_NAME: ${process.env["WEBSITE_SITE_NAME"]}`);
}
```

---

::: zone-end

### In local development environment

When you run locally, your functions project includes a [`local.settings.json` file](./functions-run-local.md), where you store your environment variables in the `Values` object.

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "CUSTOM_ENV_VAR_1": "hello",
    "CUSTOM_ENV_VAR_2": "world"
  }
}
```

### In Azure cloud environment

When you run in Azure, the function app lets you set and use [Application settings](functions-app-settings.md), such as service connection strings, and exposes these settings as environment variables during execution.

[!INCLUDE [Function app settings](../../includes/functions-app-settings.md)]

### Worker environment variables

Node.js has several Functions environment variables that are specific to it:

#### languageWorkers__node__arguments

Use this setting to specify custom arguments when starting your Node.js process. Most often, you use it locally to start the worker in debug mode, but you can also use it in Azure if you need custom arguments.

> [!WARNING]
> If possible, avoid using `languageWorkers__node__arguments` in Azure because it can negatively affect cold start times. Rather than using prewarmed workers, the runtime has to start a new worker from scratch by using your custom arguments.

#### logging**logLevel**Worker

Use this setting to adjust the default log level for Node.js-specific worker logs. By default, only warning or error logs are shown, but you can set it to `information` or `debug` to help diagnose issues with the Node.js worker. For more information, see [configuring log levels](./configure-monitoring.md#configure-log-levels).

## <a name="ecmascript-modules"></a>ECMAScript modules (preview)

> [!NOTE]
> ECMAScript modules are currently a preview feature in Node.js 14 or higher in Azure Functions.

[ECMAScript modules](https://nodejs.org/docs/latest-v14.x/api/esm.html#esm_modules_ecmascript_modules) (ES modules) are the new official standard module system for Node.js. So far, the code samples in this article use the CommonJS syntax. When running Azure Functions in Node.js 14 or higher, you can choose to write your functions by using ES modules syntax.

To use ES modules in a function, change its filename to use a `.mjs` extension. The following _index.mjs_ file example is an HTTP triggered function that uses ES modules syntax to import the `uuid` library and return a value.

::: zone pivot="nodejs-model-v3"

### [JavaScript](#tab/javascript)

```javascript
import { v4 as uuidv4 } from "uuid";

async function httpTrigger1(context, request) {
  context.res.body = uuidv4();
}

export default httpTrigger;
```

### [TypeScript](#tab/typescript)

```typescript
import { AzureFunction, Context } from "@azure/functions";
import { v4 as uuidv4 } from "uuid";

const httpTrigger: AzureFunction = async function (
  context: Context,
  request: HttpRequest
): Promise<void> {
  context.res.body = uuidv4();
};

export default httpTrigger;
```

---

::: zone-end

::: zone pivot="nodejs-model-v4"

### [JavaScript](#tab/javascript)

```javascript
import { v4 as uuidv4 } from "uuid";

async function httpTrigger1(request, context) {
  return { body: uuidv4() };
}

app.http("httpTrigger1", {
  methods: ["GET", "POST"],
  handler: httpTrigger1,
});
```

### [TypeScript](#tab/typescript)

```typescript
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { v4 as uuidv4 } from "uuid";

async function httpTrigger1(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  return { body: uuidv4() };
}

app.http("httpTrigger1", {
  methods: ["GET", "POST"],
  handler: httpTrigger1,
});
```

---

::: zone-end

::: zone pivot="nodejs-model-v3"

## Configure function entry point

Use the `function.json` properties `scriptFile` and `entryPoint` to set the location and name of your exported function. When you use TypeScript, you need the `scriptFile` property and it should point to the compiled JavaScript.

### Using `scriptFile`

By default, a JavaScript function runs from `index.js`. This file shares the same parent directory as the corresponding `function.json` file.

Use `scriptFile` to organize your folder structure. The following example shows one way to set up your folders:

```text
<project_root>/
 | - node_modules/
 | - myFirstFunction/
 | | - function.json
 | - lib/
 | | - sayHello.js
 | - host.json
 | - package.json
```

The `function.json` file for `myFirstFunction` should include a `scriptFile` property that points to the file with the exported function to run.

```json
{
  "scriptFile": "../lib/sayHello.js",
  "bindings": [
    ...
  ]
}
```

### Using `entryPoint`

In the v3 model, you must export a function by using `module.exports` so the function can be found and run. By default, the function that runs when triggered is the only export from that file. It can also be the export named `run` or the export named `index`. The following example sets `entryPoint` in `function.json` to a custom value, "logHello":

```json
{
  "entryPoint": "logHello",
  "bindings": [
    ...
  ]
}
```

#### [JavaScript](#tab/javascript)

```javascript
async function logHello(context) {
  context.log("Hello, world!");
}

module.exports = { logHello };
```

#### [TypeScript](#tab/typescript)

```typescript
import { AzureFunction, Context } from "@azure/functions";

const logHello: AzureFunction = async function (
  context: Context
): Promise<void> {
  context.log("Hello, world!");
};

export default { logHello };
```

---

::: zone-end

<a name="considerations-for-javascript-functions"></a>

## Recommendations

This section describes several impactful patterns for Node.js apps that you should follow.

### Choose single-vCPU App Service plans

When you create a function app that uses the App Service plan, select a single-vCPU plan rather than a plan with multiple vCPUs. Today, Functions runs Node.js functions more efficiently on single-vCPU VMs, and using larger VMs doesn't bring the expected performance improvements. When necessary, you can scale out by adding more single-vCPU VM instances, or you can enable autoscale. For more information, see [Scale instance count manually or automatically](/azure/azure-monitor/autoscale/autoscale-get-started?toc=/azure/app-service/toc.json).

<a name="cold-start"></a>

### Run from a package file

When you develop Azure Functions in the serverless hosting model, cold starts are a reality. _Cold start_ refers to the first time your function app starts after a period of inactivity, taking longer to start up. For Node.js apps with large dependency trees in particular, cold start can be significant. To speed up the cold start process, [run your functions as a package file](run-functions-from-deployment-package.md) when possible. Many deployment methods use this model by default, but if you're experiencing large cold starts, check to make sure you're running this way.

<a name="connection-limits"></a>

### Use `async` and `await`

When writing Azure Functions in Node.js, write code by using the `async` and `await` keywords. Writing code by using `async` and `await` instead of callbacks or `.then` and `.catch` with Promises helps you avoid two common problems:

- Throwing uncaught exceptions that [crash the Node.js process](https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly), potentially affecting the execution of other functions.
- Unexpected behavior, such as missing logs from `context.log`, caused by asynchronous calls that aren't properly awaited.

::: zone pivot="nodejs-model-v4"

In the following example, the asynchronous method `fs.readFile` is invoked with an error-first callback function as its second parameter. This code causes both of the issues previously mentioned. An exception that isn't explicitly caught in the correct scope can crash the entire process (issue #1). Returning without ensuring the callback finishes means the HTTP response sometimes has an empty body (issue #2).

#### [JavaScript](#tab/javascript)
```javascript
// DO NOT USE THIS CODE
const { app } = require('@azure/functions');
const fs = require('fs');

app.http('httpTriggerBadAsync', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        let fileData;
        fs.readFile('./helloWorld.txt', (err, data) => {
            if (err) {
                context.error(err);
                // BUG #1: This will result in an uncaught exception that crashes the entire process
                throw err;
            }
            fileData = data;
        });
        // BUG #2: fileData is not guaranteed to be set before the invocation ends
        return { body: fileData };
    },
});
```


#### [TypeScript](#tab/typescript)
```typescript
// DO NOT USE THIS CODE
import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import * as fs from 'fs';

export async function httpTriggerBadAsync(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    let fileData: Buffer;
    fs.readFile('./helloWorld.txt', (err, data) => {
        if (err) {
            context.error(err);
            // BUG #1: This will result in an uncaught exception that crashes the entire process
            throw err;
        }
        fileData = data;
    });
    // BUG #2: fileData is not guaranteed to be set before the invocation ends
    return { body: fileData };
}

app.http('httpTriggerBadAsync', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: httpTriggerBadAsync,
});
```

---
::: zone-end
::: zone pivot="nodejs-model-v3"

In the following example, the asynchronous method `fs.readFile` is invoked with an error-first callback function as its second parameter. This code causes both of the previously mentioned problems. An exception that isn't explicitly caught in the correct scope can crash the entire process (problem #1). Calling the deprecated `context.done()` method outside of the scope of the callback can signal the function is finished before the file is read (problem #2). In this example, calling `context.done()` too early results in missing log entries starting with `Data from file:`.

#### [JavaScript](#tab/javascript)

```javascript
// NOT RECOMMENDED PATTERN
const fs = require("fs");

module.exports = function (context) {
  fs.readFile("./hello.txt", (err, data) => {
    if (err) {
      context.log.error("ERROR", err);
      // BUG #1: This will result in an uncaught exception that crashes the entire process
      throw err;
    }
    context.log(`Data from file: ${data}`);
    // context.done() should be called here
  });
  // BUG #2: Data is not guaranteed to be read before the Azure Function's invocation ends
  context.done();
};
```

#### [TypeScript](#tab/typescript)

```typescript
// NOT RECOMMENDED PATTERN
import { AzureFunction, Context } from "@azure/functions";
import * as fs from "fs";

const trigger1: AzureFunction = function (context: Context): void {
  fs.readFile("./hello.txt", (err, data) => {
    if (err) {
      context.log.error("ERROR", err);
      // BUG #1: This will result in an uncaught exception that crashes the entire process
      throw err;
    }
    context.log(`Data from file: ${data}`);
    // context.done() should be called here
  });
  // BUG #2: Data is not guaranteed to be read before the Azure Function's invocation ends
  context.done();
};

export default trigger1;
```

---

::: zone-end

Use the `async` and `await` keywords to help avoid both of these problems. Most APIs in the Node.js ecosystem now support promises in some form. For example, starting in version 14, Node.js provides an `fs/promises` API to replace the `fs` callback API.

In the following example, any unhandled exceptions thrown during the function execution only fail the individual invocation that raised the exception. The `await` keyword means that steps following `readFile` only execute after it's complete.

::: zone pivot="nodejs-model-v4"

#### [JavaScript](#tab/javascript)
```javascript
// Recommended pattern
const { app } = require('@azure/functions');
const fs = require('fs/promises');

app.http('httpTriggerGoodAsync', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const fileData = await fs.readFile('./helloWorld.txt');
            return { body: fileData };
        } catch (err) {
            context.error(err);
            // This rethrown exception will only fail the individual invocation, instead of crashing the whole process
            throw err;
        }
    },
});
```


#### [TypeScript](#tab/typescript)
```typescript
// Recommended pattern
import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import * as fs from 'fs/promises';

export async function httpTriggerGoodAsync(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    try {
        const fileData = await fs.readFile('./helloWorld.txt');
        return { body: fileData };
    } catch (err) {
        context.error(err);
        // This rethrown exception will only fail the individual invocation, instead of crashing the whole process
        throw err;
    }
}

app.http('httpTriggerGoodAsync', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: httpTriggerGoodAsync,
});
```


---

::: zone-end
::: zone pivot="nodejs-model-v3"
When you use `async` and `await`, you don't need to call the `context.done()` callback.

#### [JavaScript](#tab/javascript)

```javascript
// Recommended pattern
const fs = require("fs/promises");

module.exports = async function (context) {
  let data;
  try {
    data = await fs.readFile("./hello.txt");
  } catch (err) {
    context.log.error("ERROR", err);
    // This rethrown exception will be handled by the Functions Runtime and will only fail the individual invocation
    throw err;
  }
  context.log(`Data from file: ${data}`);
};
```

#### [TypeScript](#tab/typescript)

```typescript
// Recommended pattern
import { AzureFunction, Context } from "@azure/functions";
import * as fs from "fs/promises";

const trigger1: AzureFunction = async function (
  context: Context
): Promise<void> {
  let data: Buffer;
  try {
    data = await fs.readFile("./hello.txt");
  } catch (err) {
    context.log.error("ERROR", err);
    // This rethrown exception will be handled by the Functions Runtime and will only fail the individual invocation
    throw err;
  }
  context.log(`Data from file: ${data}`);
};

export default trigger1;
```

---

::: zone-end

## Troubleshoot

See the [Node.js Troubleshoot guide](./functions-node-troubleshoot.md).

## Next steps

For more information, see the following resources:

- [Best practices for Azure Functions](functions-best-practices.md)
- [Azure Functions developer reference](functions-reference.md)
- [Azure Functions triggers and bindings](functions-triggers-bindings.md)



