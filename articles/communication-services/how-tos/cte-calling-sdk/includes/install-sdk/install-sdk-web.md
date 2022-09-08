---
author: xixian73
ms.service: azure-communication-services
ms.topic: include
ms.date: 12/06/2021
ms.author: xixian
---
## Install the SDK

Use the `npm install` command to install the Azure Communication Services calling and common SDKs for JavaScript.

```console
npm install @azure/communication-common --save
npm install @azure/communication-calling --save
```

## Initialize required objects

Create a `CallClient` instance to initiate the calling stack. You can configure logging of calling SDK with the `AzureLogger` instance and `setLogLevel` method. You can get access to `deviceManager` for the operating system with the method `getDeviceManager`. 

Then use the method `createTeamsCallAgent` to create asynchronously a `TeamsCallAgent` instance that will manage incoming and outgoing calls for a Teams user. The method takes `CommunicationTokenCredential` as an argument representing [access token for Teams user](../../../../quickstarts/manage-teams-identity.md).

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
callClient = new CallClient();
const tokenCredential = new AzureCommunicationTokenCredential(userToken);
const teamsCallAgent = await callClient.createTeamsCallAgent(tokenCredential);
const deviceManager = await callClient.getDeviceManager();
```
