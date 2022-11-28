---
title: Shifting from Express.js to Azure Functions
description: Learn to refactor Express.js endpoints to Azure Functions.
ms.topic: conceptual
ms.date: 07/31/2020
ms.devlang: javascript
---

# Shifting from Express.js to Azure Functions

Express.js is one of the most popular Node.js frameworks for web developers and remains an excellent choice for building apps that serve API endpoints.

When migrating code to a serverless architecture, refactoring Express.js endpoints affects the following areas:

- **Middleware**: Express.js features a robust collection of middleware. Many middleware modules are no longer required in light of Azure Functions and [Azure API Management](../api-management/api-management-key-concepts.md) capabilities. Ensure you can replicate or replace any logic handled by essential middleware before migrating endpoints.

- **Differing APIs**: The API used to process both requests and responses differs among Azure Functions and Express.js. The following example details the required changes.

- **Default route**: By default, Azure Functions endpoints are exposed under the `api` route. Routing rules are configurable via [`routePrefix` in the _host.json_ file](./functions-bindings-http-webhook.md#hostjson-settings).

- **Configuration and conventions**: A Functions app uses the _function.json_ file to define HTTP verbs, define security policies, and can configure the function's [input and output](./functions-triggers-bindings.md). By default, the folder name that which contains the function files defines the endpoint name, but you can change the name via the `route` property in the [function.json](./functions-bindings-http-webhook-trigger.md#customize-the-http-endpoint) file.

> [!TIP]
> Learn more through the interactive tutorial [Refactor Node.js and Express APIs to Serverless APIs with Azure Functions](/training/modules/shift-nodejs-express-apis-serverless/).

## Example

### Express.js

The following example shows a typical Express.js `GET` endpoint.

```javascript
// server.js
app.get('/hello', (req, res) => {
  try {
    res.send("Success!");
  } catch(error) {
    const err = JSON.stringify(error);
    res.status(500).send(`Request error. ${err}`);
  }
});
```

When a `GET` request is sent to `/hello`, an `HTTP 200` response containing `Success` is returned. If the endpoint encounters an error, the response is an `HTTP 500` with the error details.

### Azure Functions

Azure Functions organizes configuration and code files into a single folder for each function. By default, the name of the folder dictates the function name.

For instance, a function named `hello` has a folder with the following files.

``` files
| - hello
|  - function.json
|  - index.js
```

The following example implements the same result as the above Express.js endpoint, but with Azure Functions.

# [JavaScript](#tab/javascript)

```javascript
// hello/index.js
module.exports = async function (context, req) {
  try {
    context.res = { body: "Success!" };
  } catch(error) {
    const err = JSON.stringify(error);
    context.res = {
      status: 500,
      body: `Request error. ${err}`
    };
  }
};
```

# [TypeScript](#tab/typescript)

```typescript
// hello/index.ts
import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    context.res = { body: "Success!" };
  } catch (error) {
    const err = JSON.stringify(error);
    context.res = {
      status: 500,
      body: `Request error. ${err}`,
    };
  }
};

export default httpTrigger;
```

---

When moving to Functions, the following changes are made:

- **Module:** The function code is implemented as a JavaScript module.

- **Context  and response object**: The [`context`](./functions-reference-node.md#context-object) allows you to communicate with the Function's runtime. From the context, you can read request data and set the function's response. Synchronous code requires you to call 1.x `context.done()` to complete execution, while 2.x+ `async` functions resolve the request implicitly.

- **Naming convention**: The folder name used to contain the Azure Functions files is used as the endpoint name by default (this can be overridden in the [function.json](./functions-bindings-http-webhook-trigger.md#customize-the-http-endpoint)).

- **Configuration**: You define the HTTP verbs in the [function.json](./functions-bindings-http-webhook-trigger.md#customize-the-http-endpoint) file such as `POST` or `PUT`.

The following _function.json_ file holds configuration information for the function.

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get"]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

By defining `get` in the `methods` array, the function is available to HTTP `GET` requests. If you want to your API to accept support `POST` requests, you can add `post` to the array as well.

## Next steps

- Learn more with the interactive tutorial [Refactor Node.js and Express APIs to Serverless APIs with Azure Functions](/training/modules/shift-nodejs-express-apis-serverless/)
