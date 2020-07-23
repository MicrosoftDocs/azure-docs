---
title: Shifting from Express.js to Azure Functions
description: Refactoring Express.js endpoints to Azure Functions
author: craigshoemaker
ms.topic: conceptual
ms.date: 07/23/2020
ms.author: cshoe
---

# Shifting from Express.js to Azure Functions

Express.js is one of the most popular Node.js frameworks for web developers and remains an excellent choice for building apps that serve API endpoints.

When migrating code to a serverless architecture, refactoring Express.js endpoints affects the following areas:

- **Middleware**: Express.js features a robust collection of middleware. Some middleware modules are no longer required when moving to Azure Functions. Ensure you can replicate or replace any logic handled by essential middleware before migrating endpoints.

- **Differing APIs**: The API used to process both requests and responses differs among Azure Functions and Express.js. The following example details the required changes.

- **Default route**: By default, Azure Functions endpoints are exposed under the `api` route. Routing rules are configurable.

- **Configuration and conventions**: There are a few configuration and conventions you need to consider as you move to Azure Functions. A Functions app uses the _function.json_ file to define HTTP verbs, define security policies, and can configure the function's [input and output](./functions-triggers-bindings.md). Also, by convention, the folder name, which contains the function files defines the endpoint name.

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

When a `GET` request is sent to `/hello`, an `HTTP 200` response containing "Success" is returned. If the endpoint returns an error, the response is an `HTTP 500` with the error details.

### Azure Functions

The following example implements the same result as the Express.js endpoint, but with Azure Functions.

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
  context.done();
};
```

When moving to Functions, the following changes are made:

- **Module:** The function code is implemented as a JavaScript module that requires you to provide a value for `module.exports`.

- **Context  and response object**: The `context` object holds the `res` object, which allows you to define a response. To complete the function call, you need to call `context.done()`.

- **Naming convention**: The folder name used to contain the Azure Functions files is used as the endpoint name by default (this can be overridden in the _function.json_).

- **Configuration**: You define the HTTP verbs in the *function.json* file such as `POST, PUT`.

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

By defining `get` in the `methods` array, the function is available to HTTP `GET` requests.

## Next steps

- [Refactor Node.js and Express APIs to Serverless APIs with Azure Functions](https://docs.microsoft.com/learn/modules/shift-nodejs-express-apis-serverless/)
