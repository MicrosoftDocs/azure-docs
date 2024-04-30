---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2021
ms.author: rifox
---
## Install the SDK

Use the `npm install` command to install the Azure Communication Services Common and Calling SDKs for JavaScript:

```console
npm install @azure/communication-common --save
npm install @azure/communication-calling --save
```

## Initialize required objects

A `CallClient` instance is required for most call operations. When you create a new `CallClient` instance, you can configure it with custom options like a `Logger` instance.

With the `CallClient` instance, you can create a `CallAgent` instance by calling the `createCallAgent`. This method asynchronously returns a `CallAgent` instance object.

The `createCallAgent` method uses `CommunicationTokenCredential` as an argument. It accepts a [user access token](../../../../quickstarts/identity/access-tokens.md).

You can use the `getDeviceManager` method on the `CallClient` instance to access `deviceManager`.

```js
const { CallClient } = require('@azure/communication-calling');
const { AzureCommunicationTokenCredential} = require('@azure/communication-common');
const { AzureLogger, setLogLevel } = require("@azure/logger");

// Set the logger's log level
setLogLevel('verbose');

// Redirect log output to console, file, buffer, REST API, or whatever location you want
AzureLogger.log = (...args) => {
    console.log(...args); // Redirect log output to console
};

const userToken = '<USER_TOKEN>';
callClient = new CallClient(options);
const tokenCredential = new AzureCommunicationTokenCredential(userToken);
const callAgent = await callClient.createCallAgent(tokenCredential, {displayName: 'optional Azure Communication Services user name'});
const deviceManager = await callClient.getDeviceManager()
```

### Manage ACS SDK connectivity for incoming calls

A `Call Agent` instance lets you start/join and manage incoming calls. Your `Call Agent` instance needs to be connected to ACS infrastructure to receive incoming calls. This connection is established when a `Call Agent` instance is created, but sometimes, for example when the network is unstable, the connection may not be set up, or it may break during the lifecycle of `Call Agent`. ACS SDK always tries to stay connected with ACS infrastructure. It keeps retrying to connect when the connection is lost.

You can check if `Call Agent` is connected to ACS infra by looking at the current value of `connectionState` property and listening to `connectionStateChanged` event from `Call Agent`.

```js
const connectionState = callAgentInstance.connectionState;
console.log(connectionState); // it may return either of 'Connected' | 'Disconnected'

const connectionStateCallback = (args) => {
    console.log(args); // it will return an object with oldState and newState, each of having a value of either of 'Connected' | 'Disconnected'
    // it will also return reason, either of 'invalidToken' | 'connectionIssue'
}
callAgentInstance.on('connectionStateChanged', connectionStateCallback);
```

The above example illustrates how to manage connection state, whenever connection state is:
- `Connected` - `Call Agent` instance is connected and capable of receiving notification from ACS infra. For example, receiving incoming call notifications.
- `Disconnected` - `Call Agent` instance is disconnected. It is a terminal state. `Call Agent` should be re-created. Users should make sure it has no network problems.
-- reason `invalidToken` - if ACS token expired or it's invalid and application failed to provide new valid token. `Call Agent` instance will disconnect with this reason.
-- reason `connectionIssue` - if the network is down, and after many retries `Call Agent` fails to re-connect, it will disconnect with this reason. It usually indicates client network issues and can be re-stored as soon as the connectivity issue is resolved.
