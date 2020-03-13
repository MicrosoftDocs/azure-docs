---
title: Azure Functions custom handlers (preview)
description: Learn to use Azure Functions with any language or runtime version.
author: craigshoemaker
ms.author: cshoe
ms.date: 3/18/2020
ms.topic: article
---

# Azure Functions custom handlers (preview)

Every Functions app is executed by a language-specific handler. While Azure Functions supports many [language handlers](./supported-languages.md) by default, there are cases where you may want additional control over the app execution environment. Custom handlers give you this additional control.

Custom handlers are lightweight HTTP servers that receive events from the Functions host. Any language that supports HTTP primitives can implement a custom handler.

Custom handlers are best suited for situations where you want to:

- Implement a Functions app in a language beyond the officially supported languages
- Implement a Functions app in a language version not supported by default
- Have granular control over the app execution environment

With custom handlers, all [triggers and input and output bindings](./functions-triggers-bindings.md) are supported.

## Application structure

To implement a custom handler, you need the following files:

- A *host.json* file at the root of your app
- A command, script, or executable which runs a web server
- A *function.json* file for each function

The following diagram shows how these files look on the file system for a function named "order".

```bash
| /order
|   function.json
|
| host.json
```

### App configuration

The application is configured via the *host.json* file. This file tells the Functions host where to send requests by pointing to an executable that implements a server capable of processing HTTP events.

Ensure the *host.json* file is at the same level in the directory structure as the running web server. Some languages and toolchains may not place the this file at the application root by default.

### Function metadata

By convention, each function must have a folder named to match the function name, containing a *function.json* file.

### Response payload

By convention, function responses are formatted as key/value pairs. Supported keys include:

| Key           | Data type      | Remarks                                                      |
| ------------- | -------------- | ------------------------------------------------------------ |
| `Outputs`     | key/value pair | Holds response values as defined by the `bindings` array the *function.json* file.<br /><br />For instance, if a function is configured with a blob storage output binding named "blob", then `Outputs` contains a key named `blob`, which is set to the blob's value. |
| `Logs`        | array          | Messages appear in the Functions invocation logs.<br /><br />When running in Azure, logged messaged appear in Application Insights. |
| `ReturnValue` | string         | Used to provide a response when an output is configured as `$return` in the *function.json* file. |

See the [example for a sample payload](#server-implementation).

### Considerations

- Your app must respond to requests within 60 seconds or the host considers the request a failure and attempts a retry.

## Create a custom handler

Custom handlers can be implemented in any language that supports HTTP events. While Azure Functions [fully supports JavaScript and Node.js](./functions-reference-node.md), the following example shows how to implement a custom handler using JavaScript in Node.js for the purposes of instruction.

The scenario implemented in this example features a function named `order` that accepts a `POST` with a payload representing a product order.

```http
POST http://127.0.0.1:7071/api/order HTTP/1.1
content-type: application/json

{
  "id": 1005,
  "quantity": 2,
  "color": "black"
}
```

### Application configuration

A custom handler is defined by configuring the *host.json* file with details on how to start your HTTP server. The `httpWorker` section points to an execution target as defined by the `defaultExecutablePath`. The execution target may either be an executable or the combination of an executable and a target file.

For an app written in a compiled language, `defaultExecutablePath` points to an executable file.

```json
{
    "version": "2.0",
    "httpWorker": {
        "description": {
            "defaultExecutablePath": "server.exe"
        }
    }
}
```

For scripted apps, `defaultExecutablePath` points to the script language's executable and `defaultWorkerPath` points to the script file location. The following example shows how to a JavaScript app in Node.js is configured as a custom handler.

```json
{
    "version": "2.0",
    "httpWorker": {
        "description": {
            "defaultExecutablePath": "node",
            "defaultWorkerPath": "server.js"
        }
    }
}
```

You can also pass arguments using the `arguments` array:

```json
{
    "version": "2.0",
    "httpWorker": {
        "description": {
            "defaultExecutablePath": "node",
            "defaultWorkerPath": "server.js",
            "arguments": [ "--inspect" ] // allows you to set breakpoints for debugging 
        }
    }
}
```

Arguments are necessary for many debugging setups. See the [Debugging](#debugging) section for more detail. 

Standard triggers and input and output bindings are available by referencing [extension bundles](./functions-bindings-register.md) in your *host.json* file.

### Function definition

The following *function.json* file is no different from how you would define a function under any other context. Since the function name is *order*, this file is saved in a folder named "order".

```json
{
  "bindings": [
    {
      "type": "httpTrigger",
      "authLevel": "function",
      "direction": "in",
      "name": "req",
      "methods": ["post"]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    },
    {
      "type": "queue",
      "name": "message",
      "direction": "out",
      "queueName": "orders",
      "connection": "AzureWebJobsStorage"
    }
  ]
}

```

This function is defined as an [HTTP triggered function](./functions-bindings-http-webhook-trigger.md) that returns an [HTTP response](./functions-bindings-http-webhook-output.md) and outputs a [Queue storage](./functions-bindings-storage-queue-output.md) message.

### Server implementation

A web server is used to listen for requests coming through the `FUNCTIONS_HTTPWORKER_PORT`. 

>[!NOTE]
>The `FUNCTIONS_HTTPWORKER_PORT` is not the public facing port used to call the function. This port is used by the Functions host to call the custom handler.

```javascript
const express = require("express");
const app = express();

app.use(express.json());

const PORT = process.env.FUNCTIONS_HTTPWORKER_PORT;

app.post("/order", (req, res) => {
  const message = req.body.Data.req.Body;
  const response = {
    Outputs: {
      message: message,
      res: {
        statusCode: 200,
        body: "Order complete"
      }
    },
    Logs: ["order processed"]
  };
  res.json(response);
});

const server = app.listen(PORT, "localhost", () => {
  console.log(`Your port is ${PORT}`);
  const { address: host, port } = server.address();
  console.log(`Example app listening at http://${host}:${port}`);
});

```

Express.js is used to create a web server to handle HTTP events and is set to listen for requests via the `FUNCTIONS_HTTPWORKER_PORT`. 

The order function is defined at the path of `/order` and extracts the request payload to save as a queue message.  

The route for the order function here is `/order` and not `/api/order` because the function host is proxying the request to the custom handler. Once the Functions host receives the request, the proxied request sent to the handler at the handler's application root.

The message contents are available from the request via `req.body.Data.req.Body`. 

The function's response is formatted into a key/value pair where the `Outputs` member holds another key/value pair where the keys match the outputs as defined in the *function.json* file.

By setting `message` equal to the message that came in from the request, and `res` to the expected HTTP response, this function outputs a message to Queue Storage and returns an HTTP response.

## Debugging

To debug your Functions custom handler app, the `--inspect` flag needs to be included as an argument in the *host.json* file. 

> [!NOTE]
> The debugging configuration is part of your *host.json* file, which means that you may need to remove the `--inspect` argument before deploying to production.

```json
{
    "version": "2.0",
    "httpWorker": {
        "description": {
            "defaultExecutablePath": "node",
            "defaultWorkerPath": "server.js",
            "arguments": [ "--inspect" ] // allows you to set breakpoints for debugging 
        }
    }
}
```

With this configuration, you can start the Function's host process using the following command:

```bash
func host start
```

Once the process is started, you can attach a debugger and hit breakpoints.

### Visual Studio Code

The following example is a sample configuration that demonstrates how you can set up your *launch.json* file to connect your app to the Visual Studio Code debugger.

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

## Deploying

A custom handler can be deployed to any Azure Functions hosting option. If your handler requires custom dependencies (such as a language runtime), you may need to use a [custom container](./functions-create-function-linux-custom-image.md).
