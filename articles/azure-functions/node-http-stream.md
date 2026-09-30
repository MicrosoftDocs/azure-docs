---
title: Stream HTTP requests and responses in Azure Functions
description: Learn how to stream HTTP requests and responses in Node.js Azure Functions for processing large data, streaming OpenAI responses, and delivering dynamic content.
ms.topic: how-to
ms.date: 07/16/2026
ms.devlang: javascript
# ms.devlang: javascript, typescript
ms.custom:
  - devx-track-js
  - devx-track-ts
---

# Stream HTTP requests and responses in Node.js Azure Functions

This article describes how to stream HTTP requests and responses in your Node.js function app. Learn how to enable streaming, process large data, and handle real-time HTTP scenarios.

> [!NOTE]
> HTTP streams require the v4 programming model. If you're using v3, see the [migration guide](./functions-node-upgrade-v4.md) to upgrade.

## Overview

The HTTP streams feature makes it easier to process large data, stream OpenAI responses, deliver dynamic content, and support other core HTTP scenarios. It lets you stream requests to and responses from HTTP endpoints in your Node.js function app. Use HTTP streams in scenarios where your app requires real-time exchange and interaction between client and server over HTTP. You can also use HTTP streams to get the best performance and reliability for your apps when using HTTP.

## Prerequisites

- The [`@azure/functions` npm package](https://www.npmjs.com/package/@azure/functions) version 4.3.0 or later.
- [Azure Functions runtime](./functions-versions.md) version 4.28 or later.
- [Azure Functions Core Tools](./functions-run-local.md) version 4.0.5530 or later, which contains the correct runtime version.

## Enable streams

Use these steps to enable HTTP streams in your function app in Azure and in your local projects:

1. If you plan to stream large amounts of data, modify the [`FUNCTIONS_REQUEST_BODY_SIZE_LIMIT`](./functions-app-settings.md#functions_request_body_size_limit) setting in Azure. The default maximum body size allowed is `104857600`, which limits your requests to a size of about 100 MB.

1. For local development, also add `FUNCTIONS_REQUEST_BODY_SIZE_LIMIT` to the [local.settings.json file](./functions-develop-local.md#local-settings-file).

1. Add the following code to your app in any file included by your [main field](./functions-reference-node.md#programming-model).

### [JavaScript](#tab/javascript)

```javascript
const { app } = require("@azure/functions");

app.setup({ enableHttpStream: true });
```

### [TypeScript](#tab/typescript)

```typescript
import { app } from "@azure/functions";

app.setup({ enableHttpStream: true });
```

---

> [!TIP]
> Use `request.body` directly to get the most benefit from streaming. Methods like `request.text()` buffer the entire body and return a string, which defeats the purpose of streaming.

## Stream examples

The following example shows an HTTP triggered function that receives data through an HTTP POST request. The function streams this data to a specified output file:

### [JavaScript](#tab/javascript)

```javascript
const { app } = require("@azure/functions");
const fs = require("fs");
const path = require("path");

app.http("httpTriggerStreamRequest", {
  methods: ["POST"],
  handler: async (request, context) => {
    context.log("HTTP trigger function processed a request.");

    if (!request.body) {
      return {
        status: 400,
        body: "Request body is required"
      };
    }

    // Create a writable stream to a file
    const outputPath = path.join(__dirname, "streamed-output.txt");
    const writeStream = fs.createWriteStream(outputPath);

    try {
      // Stream the request body to the file
      const reader = request.body.getReader();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        
        if (value) {
          writeStream.write(value);
        }
      }

      writeStream.end();
      
      return {
        status: 200,
        body: "Data successfully streamed to file"
      };
    } catch (error) {
      context.log.error("Error streaming data:", error);
      return {
        status: 500,
        body: "Error processing stream"
      };
    }
  }
});
```

### [TypeScript](#tab/typescript)

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as fs from "fs";
import * as path from "path";

export async function httpTriggerStreamRequest(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("HTTP trigger function processed a request.");

  if (!request.body) {
    return {
      status: 400,
      body: "Request body is required"
    };
  }

  // Create a writable stream to a file
  const outputPath: string = path.join(__dirname, "streamed-output.txt");
  const writeStream: fs.WriteStream = fs.createWriteStream(outputPath);

  try {
    // Stream the request body to the file
    const reader = request.body.getReader();
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      
      if (value) {
        writeStream.write(value);
      }
    }

    writeStream.end();
    
    return {
      status: 200,
      body: "Data successfully streamed to file"
    };
  } catch (error) {
    context.log.error("Error streaming data:", error);
    return {
      status: 500,
      body: "Error processing stream"
    };
  }
}

app.http("httpTriggerStreamRequest", {
  methods: ["POST"],
  handler: httpTriggerStreamRequest
});
```

---

The following example shows an HTTP triggered function that streams a file's content as the response to incoming HTTP GET requests:

### [JavaScript](#tab/javascript)

```javascript
const { app } = require("@azure/functions");
const fs = require("fs");
const path = require("path");

app.http("httpTriggerStreamResponse", {
  methods: ["GET"],
  handler: async (request, context) => {
    context.log("HTTP trigger function processed a request.");

    const filePath = path.join(__dirname, "sample-data.txt");

    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return {
          status: 404,
          body: "File not found"
        };
      }

      // Create a readable stream from the file
      const readStream = fs.createReadStream(filePath);
      
      return {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
          "Transfer-Encoding": "chunked"
        },
        body: readStream
      };
    } catch (error) {
      context.log.error("Error streaming file:", error);
      return {
        status: 500,
        body: "Error streaming file"
      };
    }
  }
});
```

### [TypeScript](#tab/typescript)

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as fs from "fs";
import * as path from "path";

export async function httpTriggerStreamResponse(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("HTTP trigger function processed a request.");

  const filePath: string = path.join(__dirname, "sample-data.txt");

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return {
        status: 404,
        body: "File not found"
      };
    }

    // Create a readable stream from the file
    const readStream: fs.ReadStream = fs.createReadStream(filePath);
    
    return {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Transfer-Encoding": "chunked"
      },
      body: readStream
    };
  } catch (error) {
    context.log.error("Error streaming file:", error);
    return {
      status: 500,
      body: "Error streaming file"
    };
  }
}

app.http("httpTriggerStreamResponse", {
  methods: ["GET"],
  handler: httpTriggerStreamResponse
});
```

---

For a ready-to-run sample app that uses streams, check out this [example on GitHub](https://github.com/Azure-Samples/azure-functions-nodejs-stream).

## Related articles

- [Azure Functions Node.js developer reference](functions-reference-node.md)
- [HTTP trigger and bindings](functions-bindings-http-webhook.md)
- [Migrate to v4 of the Node.js programming model](functions-node-upgrade-v4.md)
