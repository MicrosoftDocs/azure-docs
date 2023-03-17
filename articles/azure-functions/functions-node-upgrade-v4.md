---
title: Upgrade to Azure Functions Node.js programming model v4.x
description: This article shows you how to upgrade your existing function apps running on version 3.x of the Node.js programming model to version 4.x.
ms.service: azure-functions
ms.date: 03/15/2023
ms.devlang: javascript, typescript
ms.topic: how-to
---

# Upgrade to Azure Functions Node.js programming model v4.x

The Node.js programming model for Azure Functions defines how you author serverless code in JavaScript or TypeScript. The version of the programming model matches the version of the [`@azure/functions`](https://www.npmjs.com/package/@azure/functions) npm package that should be included with your app. This article discusses the differences between both versions and how to upgrade an existing v3.x app. If you want to create a brand new v4.x app, see the tutorial for either [VS Code](./create-first-function-cli-node.md) or [Azure Functions Core Tools](./create-first-function-vs-code-node.md).


> [!NOTE]
> v4.x of the Node.js programming model is currently in public preview. This version number is _not_ the same thing as the Azure Functions [runtime version](./functions-versions.md), which is coincidentally using "4" as its latest major version. Lastly, you can't mix v3.x and v4.x of the programming models.

## Motivation

v4.x was designed with the following goals in mind:

- Provide a familiar and intuitive experience to Node.js developers
- Make the file structure flexible with support for full customization
- Switch to a code-centric approach for defining function configuration

## Prerequisites

Before you start upgrading your app, v4.x of the Node.js programming model is only supported with the following minimum versions:

- [`@azure/functions`](https://www.npmjs.com/package/@azure/functions) npm package v4.0.0-alpha.8+
- [Node.js](https://nodejs.org/en/download/releases/) v18+
- [TypeScript](https://www.typescriptlang.org/) v4+
- [Azure Functions Runtime](./functions-versions.md) v4.16+
- [Azure Functions Core Tools](./functions-run-local.md) v4.0.4915+ (if running locally)

## npm package

For the first time, the [`@azure/functions`](https://www.npmjs.com/package/@azure/functions) npm package contains the primary source code that backs the Node.js programming model for Azure Functions. Previously, that code shipped directly in Azure and the npm package only had the TypeScript types. Moving forward both JavaScript and TypeScript users need to include this package in their app. v3.x apps _can_ include the npm package, but it isn't required.

> [!TIP]
> _**Action Item**_: Make sure the `@azure/functions` package is listed in the `dependencies` section (not `devDependencies`) of your `package.json` file. You can install v4.x with the command 
> ```
> npm install @azure/functions@preview
> ```

## App entry point

v4.x of the programming model lets you structure your code however you want. The only files you need at the root of your app are `host.json` and `package.json`. Otherwise, you define the file structure by setting the `main` field in your `package.json` file. The `main` field can be set to a single file or multiple files by using a [glob pattern](https://wikipedia.org/wiki/Glob_(programming)). Common values for the `main` field may be:
- TypeScript
    - `dist/src/index.js`
    - `dist/src/functions/*.js`
- JavaScript
    - `src/index.js`
    - `src/functions/*.js`

> [!TIP]
> _**Action Item**_: Make sure you define a `main` field in your `package.json` file

## Order of arguments

The trigger input is now the first argument to your function handler instead of the invocation context. The invocation context, now the second argument, was simplified in v4.x and isn't as required as the trigger input - it can be left off if you aren't using it.

> [!TIP]
> _**Action Item**_: Switch the order of your arguments. For example if you are using an http trigger, switch `(context, request)` to either `(request, context)` or just `(request)` if you aren't using the context.

## Define function in code

Say goodbye 👋 to `function.json` files! All of the configuration that you were previously specifying in a `function.json` file is now defined directly in your TypeScript or JavaScript files. In addition, many properties now have a default so that you don't have to specify them every time.

> [!WARNING]
> You can't mix the v3.x and v4.x programming models. As soon as you register one v4.x function in your app, any v3.x functions registered in `function.json` files will be ignored.

# [v4.x](#tab/v4)

```javascript
const { app } = require("@azure/functions");

app.http('helloWorld1', {
  methods: ['GET', 'POST'],
  handler: async (request, context) => {
    context.log('Http function processed request');

    const name = request.query.get('name') 
      || await request.text() 
      || 'world';

    return { body: `Hello, ${name}!` };
  }
});
```

No `function.json` file! ✨

# [v3.x](#tab/v3)

```javascript
module.exports = async function (context, req) {
  context.log('HTTP function processed a request');

  const name = req.query.name
    || req.body
    || 'world';

  context.res = {
    body: `Hello, ${name}!`
  };
};
```

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

---

> [!TIP]
> _**Action Item**_: Move the config from your `function.json` file to your code. The type of the trigger will correspond to a method on the `app` object in the new model. For example, if you use an `httpTrigger` type in `function.json`, you will now call `app.http()` in your code to register the function. If you use `timerTrigger`, you will now call `app.timer()` and so on.


## Simplified context, inputs, and outputs

The `context` object has been simplified to reduce duplication and make it easier to write unit tests. For example, we streamlined the primary input and output so that they're only accessed as the argument and return value of your function handler. The primary input and output can't be accessed on the `context` object anymore, but you must still access _secondary_ inputs and outputs on the `context` object. For more information about secondary inputs and outputs, see the [Node.js developer guide](./functions-reference-node.md).

### Getting the primary input (trigger)

The primary input is also called the "trigger" and is the only required input or output. You must have one and only one trigger.

# [v4.x](#tab/v4)

v4.x only supports one way of getting the trigger input, as the first argument.

```javascript
async function helloWorld1(request, context) {
  const onlyOption = request;
```

# [v3.x](#tab/v3)

v3.x supports several different ways of getting the trigger input.

```javascript
async function helloWorld1(context, request) {
    const option1 = request;
    const option2 = context.req;
    const option3 = context.bindings.req;
```

---

> [!TIP]
> _**Action Item**_: Make sure you aren't using `context.req` or `context.bindings` to get the input.

### Setting the primary output

# [v4.x](#tab/v4)

v4.x only supports one way of setting the primary output, through the return value.

```javascript
return { 
  body: `Hello, ${name}!` 
};
```

# [v3.x](#tab/v3)

v3.x supports several different ways of setting the primary output.

```javascript
// Option 1
context.res = {
    body: `Hello, ${name}!`
};
// Option 2, but you can't use this option with any async code:
context.done(null, {
    body: `Hello, ${name}!`
});
// Option 3:
context.res.send(`Hello, ${name}!`);
// Option 4, if "name" in "function.json" is "res":
context.bindings.res = {
    body: `Hello, ${name}!`
}
// Option 5, if "name" in "function.json" is "$return":
return {
    body: `Hello, ${name}!`
};
```

---

> [!TIP]
> _**Action Item**_: Make sure you are always returning the output in your function handler, instead of setting it with the `context` object.

### Create a test context

v3.x doesn't support creating an invocation context outside of the Azure Functions runtime, making it difficult to author unit tests. v4.x allows you to create an instance of the invocation context, although the information during tests isn't detailed unless you add it yourself.

# [v4.x](#tab/v4)

```javascript
const testInvocationContext = new InvocationContext({
  functionName: 'testFunctionName',
  invocationId: 'testInvocationId'
});
```

# [v3.x](#tab/v3)

Not possible 😮

---

## New HTTP types

The http request and response types are now a subset of the [fetch standard](https://developer.mozilla.org/docs/Web/API/fetch) instead of being types unique to Azure Functions. The types use Node.js's [`undici`](https://undici.nodejs.org/) package, which follows the fetch standard and is [currently being integrated](https://github.com/nodejs/undici/issues/1737) into Node.js core.

### HttpRequest

# [v4.x](#tab/v4)
- _**Body**_. You can access the body using a method specific to the type you would like to receive:
    ```javascript
    const body = await request.text();
    const body = await request.json();
    const body = await request.formData();
    const body = await request.arrayBuffer();
    const body = await request.blob();
    ```
- _**Header**_:
    ```javascript
    const header = request.headers.get('content-type');
    ```
- _**Query param**_:
    ```javascript
    const name = request.query.get('name');
    ```

# [v3.x](#tab/v3)
- _**Body**_. You can access the body in several ways, but the type returned isn't always consistent:
    ```javascript
    // returns a string, object, or Buffer
    const body = request.body;
    // returns a string
    const body = request.rawBody;
    // returns a Buffer
    const body = request.bufferBody;
    // returns an object representing a form
    const body = await request.parseFormBody();
    ```
- _**Header**_. A header can be retrieved in several different ways:
    ```javascript
    const header = request.get('content-type');
    const header = request.headers.get('content-type');
    const header = context.bindingData.headers['content-type'];
    ```
- _**Query param**_:
    ```javascript
    const name = request.query.name;
    ```
---

### HttpResponse

# [v4.x](#tab/v4)
- _**Status**_:
    ```javascript
    return { status: 200 };
    ```
- _**Body**_:
    ```javascript
    return { body: "Hello, world!" };
    ```
- _**Header**_. You can set the header in two ways, depending if you're using the `HttpResponse` class or `HttpResponseInit` interface:
    ```javascript
    const response = new HttpResponse();
    response.headers.set('content-type', 'application/json');
    return response;
    ```
    ```javascript
    return {
      headers: { 'content-type': 'application/json' }
    };
    ```

# [v3.x](#tab/v3)
- _**Status**_. A status can be set in several different ways:
    ```javascript
    context.res.status(200);
    context.res = { status: 200}
    context.res = { statusCode: 200 };
    return { status: 200};
    return { statusCode: 200 };
    ```
- _**Body**_. A body can be set in several different ways:
    ```javascript
    context.res.send("Hello, world!");
    context.res.end("Hello, world!");
    context.res = { body: "Hello, world!" }
    return { body: "Hello, world!" };
    ```
- _**Header**_. A header can be set in several different ways:
    ```javascript
    response.set('content-type', 'application/json');
    response.setHeader('content-type', 'application/json');
    response.headers = { 'content-type': 'application/json' }
    context.res = {
      headers: { 'content-type': 'application/json' }
    };
    return {
      headers: { 'content-type': 'application/json' }
    };
    ```

---

> [!TIP]
> _**Action Item**_: Update any logic using the http request or response types to match the new methods. If you are using TypeScript, you should receive build errors if you use old methods.

## Troubleshooting

If you see the following error, make sure you're using the minimum versions required of all [prerequisites](#prerequisites):

> No job functions found. Try making your job classes and methods public. If you're using binding extensions (e.g. Azure Storage, ServiceBus, Timers, etc.) make sure you've called the registration method for the extension(s) in your startup code (e.g. builder.AddAzureStorage(), builder.AddServiceBus(), builder.AddTimers(), etc.).
