---
title: Migrate to v4 of the Node.js model for Azure Functions
description: This article shows you how to upgrade your existing function apps running on v3 of the Node.js programming model to v4.
ms.service: azure-functions
ms.date: 03/15/2023
ms.devlang: javascript, typescript
ms.custom: devx-track-js
ms.topic: how-to
---

# Migrate to version 4 of the Node.js programming model for Azure Functions

This article discusses the differences between version 3 and version 4 of the Node.js programming model and how to upgrade an existing v3 app. If you want to create a new v4 app instead of upgrading an existing v3 app, see the tutorial for either [Visual Studio Code (VS Code)](./create-first-function-cli-node.md) or [Azure Functions Core Tools](./create-first-function-vs-code-node.md). This article uses "tip" alerts to highlight the most important concrete actions that you should take to upgrade your app.

Version 4 is designed to provide Node.js developers with the following benefits:

- Provide a familiar and intuitive experience to Node.js developers.
- Make the file structure flexible with support for full customization.
- Switch to a code-centric approach for defining function configuration.

[!INCLUDE [Programming Model Considerations](../../includes/functions-nodejs-model-considerations.md)]

## Requirements

Version 4 of the Node.js programming model requires the following minimum versions:

- [`@azure/functions`](https://www.npmjs.com/package/@azure/functions) npm package v4.0.0
- [Node.js](https://nodejs.org/en/download/releases/) v18+
- [TypeScript](https://www.typescriptlang.org/) v4+
- [Azure Functions Runtime](./functions-versions.md) v4.25+
- [Azure Functions Core Tools](./functions-run-local.md) v4.0.5382+ (if running locally)

## Include the npm package

In v4, the [`@azure/functions`](https://www.npmjs.com/package/@azure/functions) npm package contains the primary source code that backs the Node.js programming model. In previous versions, that code shipped directly in Azure and the npm package had only the TypeScript types. You now need to include this package for both TypeScript and JavaScript apps. You _can_ include the package for existing v3 apps, but it isn't required.

> [!TIP]
> Make sure the `@azure/functions` package is listed in the `dependencies` section (not `devDependencies`) of your *package.json* file. You can install v4 by using the following command: 
> ```
> npm install @azure/functions
> ```

## Set your app entry point

In v4 of the programming model, you can structure your code however you want. The only files that you need at the root of your app are *host.json* and *package.json*.

Otherwise, you define the file structure by setting the `main` field in your *package.json* file. You can set the `main` field to a single file or multiple files by using a [glob pattern](https://wikipedia.org/wiki/Glob_(programming)). Common values for the `main` field might be:

- TypeScript:
  - `dist/src/index.js`
  - `dist/src/functions/*.js`
- JavaScript:
  - `src/index.js`
  - `src/functions/*.js`

> [!TIP]
> Make sure you define a `main` field in your *package.json* file.

## Switch the order of arguments

The trigger input, instead of the invocation context, is now the first argument to your function handler. The invocation context, now the second argument, is simplified in v4 and isn't as required as the trigger input. You can leave it off if you aren't using it.

> [!TIP]
> Switch the order of your arguments. For example, if you're using an HTTP trigger, switch `(context, request)` to either `(request, context)` or just `(request)` if you aren't using the context.

## Define your function in code

You no longer have to create and maintain those separate *function.json* configuration files. You can now fully define your functions directly in your TypeScript or JavaScript files. In addition, many properties now have defaults so that you don't have to specify them every time.

# [v4](#tab/v4)

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

# [v3](#tab/v3)

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
> Move the configuration from your *function.json* file to your code. The type of the trigger corresponds to a method on the `app` object in the new model. For example, if you use an `httpTrigger` type in *function.json*, call `app.http()` in your code to register the function. If you use `timerTrigger`, call `app.timer()`.

## Review your usage of context

In v4, the `context` object is simplified to reduce duplication and to make writing unit tests easier. For example, we streamlined the primary input and output so that they're accessed only as the argument and return value of your function handler.

You can't access the primary input and output on the `context` object anymore, but you must still access _secondary_ inputs and outputs on the `context` object. For more information about secondary inputs and outputs, see the [Node.js developer guide](./functions-reference-node.md#extra-inputs-and-outputs).

### Get the primary input as an argument

The primary input is also called the *trigger* and is the only required input or output. You must have one (and only one) trigger.

# [v4](#tab/v4)

Version 4 supports only one way of getting the trigger input, as the first argument:

```javascript
async function helloWorld1(request, context) {
  const onlyOption = request;
```

# [v3](#tab/v3)

Version 3 supports several ways of getting the trigger input:

```javascript
async function helloWorld1(context, request) {
    const option1 = request;
    const option2 = context.req;
    const option3 = context.bindings.req;
```

---

> [!TIP]
> Make sure you aren't using `context.req` or `context.bindings` to get the input.

### Set the primary output as your return value

# [v4](#tab/v4)

Version 4 supports only one way of setting the primary output, through the return value:

```javascript
return { 
  body: `Hello, ${name}!` 
};
```

# [v3](#tab/v3)

Version 3 supports several ways of setting the primary output:

```javascript
// Option 1
context.res = {
    body: `Hello, ${name}!`
};
// Option 2, but you can't use this option with any async code:
context.done(null, {
    body: `Hello, ${name}!`
});
// Option 3, but you can't use this option with any async code:
context.res.send(`Hello, ${name}!`);
// Option 4, if "name" in function.json is "res":
context.bindings.res = {
    body: `Hello, ${name}!`
}
// Option 5, if "name" in function.json is "$return":
return {
    body: `Hello, ${name}!`
};
```

---

> [!TIP]
> Make sure you always return the output in your function handler, instead of setting it with the `context` object.

### Create a test context

Version 3 doesn't support creating an invocation context outside the Azure Functions runtime, so authoring unit tests can be difficult. Version 4 allows you to create an instance of the invocation context, although the information during tests isn't detailed unless you add it yourself.

# [v4](#tab/v4)

```javascript
const testInvocationContext = new InvocationContext({
  functionName: 'testFunctionName',
  invocationId: 'testInvocationId'
});
```

# [v3](#tab/v3)

Not possible.

---

## Review your usage of HTTP types

The HTTP request and response types are now a subset of the [fetch standard](https://developer.mozilla.org/docs/Web/API/fetch). They're no longer unique to Azure Functions. 

The types use the [`undici`](https://undici.nodejs.org/) package in Node.js. This package follows the fetch standard and is [currently being integrated](https://github.com/nodejs/undici/issues/1737) into Node.js core.

### HttpRequest

# [v4](#tab/v4)

- *Body*. You can access the body by using a method specific to the type that you want to receive:

  ```javascript
    const body = await request.text();
    const body = await request.json();
    const body = await request.formData();
    const body = await request.arrayBuffer();
    const body = await request.blob();
    ```

- *Header*:

    ```javascript
    const header = request.headers.get('content-type');
    ```

- *Query parameter*:

    ```javascript
    const name = request.query.get('name');
    ```

# [v3](#tab/v3)

- *Body*. You can access the body in several ways, but the type returned isn't always consistent:

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

- *Header*. You can retrieve a header in several ways:

    ```javascript
    const header = request.get('content-type');
    const header = request.headers.get('content-type');
    const header = context.bindingData.headers['content-type'];
    ```

- *Query parameter*:

    ```javascript
    const name = request.query.name;
    ```

---

### HttpResponse

# [v4](#tab/v4)

- *Status*:

    ```javascript
    return { status: 200 };
    ```

- *Body*:

    ```javascript
    return { body: "Hello, world!" };
    ```

- *Header*. You can set the header in two ways, depending on whether you're using the `HttpResponse` class or the `HttpResponseInit` interface:

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

# [v3](#tab/v3)

- *Status*. You can set a status in several ways:

    ```javascript
    context.res.status(200);
    context.res = { status: 200}
    context.res = { statusCode: 200 };
    return { status: 200};
    return { statusCode: 200 };
    ```

- *Body*. You can set a body in several ways:

    ```javascript
    context.res.send("Hello, world!");
    context.res.end("Hello, world!");
    context.res = { body: "Hello, world!" }
    return { body: "Hello, world!" };
    ```

- *Header*. You can set a header in several ways:

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
> Update any logic by using the HTTP request or response types to match the new methods. If you're using TypeScript, you'll get build errors if you use old methods.

## Troubleshoot

See the [Node.js Troubleshoot guide](./functions-node-troubleshoot.md).