---
author: charithgunaratna
ms.service: azure-communication-services
ms.topic: include
ms.date: 02/04/2025
ms.author: charithg
---

> [!NOTE]
> This API is provided as a preview for developers and might change based on feedback that we receive. Don't use this API in a production environment. To use this API, use the beta release of the Azure Communication Services Calling Web SDK (1.31.1-beta.1 or higher).

## Install the SDK

Use the `npm install` command to install the Azure Communication Services Common and Calling SDK for JavaScript:

```console
npm install @azure/communication-common --save
npm install @azure/communication-calling --save
```

## Initialize required objects

A `CallClient` instance is required for most call operations. When you create a new `CallClient` instance, you can configure it with custom options like a `Logger` instance.

With the `CallClient` instance, you can create a `TeamsCallAgent` instance by calling the `createTeamsCallAgent`. This method asynchronously returns a `TeamsCallAgent` instance object.

The `createTeamsCallAgent` method uses `CommunicationTokenCredential` as an argument. It accepts a [user access token](../../../../quickstarts/identity/access-tokens.md).

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
const callClient = new CallClient(options);
const tokenCredential = new AzureCommunicationTokenCredential(userToken);
const callAgent = await callClient.createTeamsCallAgent(tokenCredential, {displayName: 'optional Azure Communication Services user name'});
const deviceManager = await callClient.getDeviceManager();
await deviceManager.askDevicePermission({ audio: true, video: true });
```

## Place a call on behalf of a Microsoft Teams user

Before placing a call behalf of a delegator, make sure delegate placing the call has `make calls` permission through [delegator call settings in Microsoft Teams](https://support.microsoft.com/office/share-a-phone-line-with-a-delegate-in-microsoft-teams-16307929-a51f-43fc-8323-3b1bf115e5a8)

To place a call on behalf of a Microsoft Teams user, specify `OnBehalfOfOptions` during start call. Replace `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` with the userId of the delegator and `yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy` with the userId of the callee.

```js
const onBehalfOfOptions = { userId: { microsoftTeamsUserId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" } }
const teamsCallOptions = { onBehalfOfOptions: onBehalfOfOptions };
const call = teamsCallAgent.startCall([{ microsoftTeamsUserId: "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy" }], teamsCallOptions);
```

## Receive a call on behalf of a Microsoft Teams user

To receive calls on behalf of a delegator,

- update delegate permission to enable "receive calls" through [delegator call settings in Microsoft Teams](https://support.microsoft.com/office/share-a-phone-line-with-a-delegate-in-microsoft-teams-16307929-a51f-43fc-8323-3b1bf115e5a8)
- set up simultaneous ring for delegates through [delegator call settings in Microsoft Teams](https://support.microsoft.com/office/call-forwarding-call-groups-and-simultaneous-ring-in-microsoft-teams-a88da9e8-1343-4d3c-9bda-4b9615e4183e)