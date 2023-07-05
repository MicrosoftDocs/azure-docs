---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2021
ms.author: rifox
---
## Install the SDK

Use the `npm install` command to install the Azure Communication Services calling and common SDKs for JavaScript.

```console
npm install @azure/communication-common --save
npm install @azure/communication-calling --save
```

## Initialize required objects

A CallClient, instance is required for most call operations. Let's create a new `CallClient` instance. You can configure it with custom options like a Logger instance.

When you have a `CallClient` instance, you can create a `CallAgent` instance by calling the `createCallAgent` method on the `CallClient` instance. This method asynchronously returns a `CallAgent` instance object.

The `createCallAgent` method uses `CommunicationTokenCredential` as an argument. It accepts a [user access token](../../../../quickstarts/identity/access-tokens.md).

You can use the `getDeviceManager` method on the `CallClient` instance to access `deviceManager`.

```js
const { CallClient } = require('@azure/communication-calling');
const { AzureCommunicationTokenCredential} = require('@azure/communication-common');
const { AzureLogger, setLogLevel } = require("@azure/logger");

// Set the logger's log level
setLogLevel('verbose');

// Redirect log output to wherever desired. To console, file, buffer, REST API, etc...
AzureLogger.log = (...args) => {
    console.log(...args); // Redirect log output to console
};

const userToken = '<USER_TOKEN>';
callClient = new CallClient(options);
const tokenCredential = new AzureCommunicationTokenCredential(userToken);
const callAgent = await callClient.createCallAgent(tokenCredential, {displayName: 'optional Azure Communication Services user name'});
const deviceManager = await callClient.getDeviceManager()
```