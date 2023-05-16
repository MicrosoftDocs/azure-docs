---
title: include file
description: include file
services: azure-communication-services
author: orwatson
manager: vravikumar

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/30/2021
ms.topic: include
ms.custom: include file
ms.author: orwatson
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../create-communication-resource.md).
- Create an [Application Insights Resources](/previous-versions/azure/azure-monitor/app/create-new-resource) in Azure portal.

## Setting Up

### Create a new Node.js app

If you already have an app using an Azure Communication Services library, and you are comfortable with JavaScript, feel free to skip to [Setup tracer](#setup-tracer).

To get started, you will need a JS app that uses any one of our client libraries. We will use the [@azure/communication-identity](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/communication/communication-identity) library to create our app. Follow the steps below to set up your sample app:

Open your terminal or command window, create a new directory, and navigate to it.

```console
mkdir export-js-telemetry && cd export-js-telemetry
```
Run `npm init -y` to create a **package.json** with default settings.

```console
npm init -y
```

### Install dependencies

Use the `npm install` command to install the dependencies our app will use.

```bash
npm install @azure/communication-identity @azure/monitor-opentelemetry-exporter @opentelemetry/node@^0.14.0 @opentelemetry/plugins-node-core --save
```

The `--save` option adds the libraries as dependencies in the **package.json** file created in the previous step.

It is important you not forget the specific version of `@opentelemetry/node@^0.14.0`. At the time of writing this guide, this is the latest version of the package that was fully compatible with `@azure/monitor-opentelemetry-exporter`.

### Add main app file

Create a file called **token.js** in the root of the directory. Add the following code to it:

```javascript
// token.js

const { CommunicationIdentityClient } = require("@azure/communication-identity");

async function main() {
  const ACS_CONNECTION_STRING = "<your-acs-connection-string>"
  const client = new CommunicationIdentityClient(ACS_CONNECTION_STRING);

  console.log("Creating user...")
  const user = await client.createUser();
  console.log(`User ${user.communicationUserId} was created successfully.\n`);

  console.log(`Issuing token for ${user.communicationUserId}...`);
  const { token } = await client.getToken(user, ["chat"]);
  console.log("Token issued successfully.\n")
  console.log(`${token}\n`);

  console.log(`Revoking token for ${user.communicationUserId}...`);
  await client.revokeTokens(user);
  console.log("Token revoked successfully.\n");

  console.log(`Deleting user ${user.communicationUserId}...`);
  await client.deleteUser(user);
  console.log("User deleted successfully.\n");
}

main().catch((error) => {
  console.log("Encountered an error:", error);
  process.exit(1);
});
```
## Setup tracer

Create a file called **tracing.js** in the root of the directory. Add the following code to it:

```javascript
// tracing.js

const azureSdkTracing = require("@azure/core-tracing");
const { AzureMonitorTraceExporter } = require("@azure/monitor-opentelemetry-exporter");
const { NodeTracerProvider } = require("@opentelemetry/node");
const { BatchSpanProcessor } = require("@opentelemetry/tracing");

const AI_CONNECTION_STRING = "<your-application-insights-connection-string>";
const provider = new NodeTracerProvider();
const azExporter = new AzureMonitorTraceExporter({
  connectionString: AI_CONNECTION_STRING
});

provider.addSpanProcessor(
  new BatchSpanProcessor(azExporter, {
    bufferSize: 1000, // 1000 spans
    bufferTimeout: 5000 // 5 seconds
  })
);

provider.register();

const tracer = provider.getTracer("sample tracer");
azureSdkTracing.setTracer(tracer);

exports.default = tracer;
```

### Add tracer to main app

Make the following updates to **token.js**:

Require **tracing.js**:

```javascript
const { CommunicationIdentityClient } = require("@azure/communication-identity");
const tracer = require("./tracing.js");

async function main() {
```

Create root span and export data

```javascript
  console.log("User deleted successfully.\n");
}

const rootSpan = tracer.startSpan("Root Identity Span");
tracer.withSpan(rootSpan, async function() {
  try {
    await main();
  } catch (error) {
    console.error("Error running sample:", error);
  } finally {
    // End the optional root span on completion
    rootSpan.end();
  }
}).then(function() {
  console.log("Awaiting batched span processor to export batched spans...");

  setTimeout(function() {
    console.log("Spans exported.");
  }, 6000);
});
```

## Run the code

Ensure you replace the placeholder texts with valid connection string values.

Use the node command to run the code you added to the **token.js** file.

```console
node token.js
```