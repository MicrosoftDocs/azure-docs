## Install the SDK

Use the `npm install` command to install the Azure Communication Services calling and common SDKs for JavaScript.

```console
npm install @azure/communication-common --save
npm install @azure/communication-calling --save
```

## Initialize a CallClient instance, create a CallAgent instance, and access deviceManager

A CallClient, instance is required for most call operations. Let's create a new `CallClient` instance. You can configure it with custom options like a Logger instance.

When you have a `CallClient` instance, you can create a `CallAgent` instance by calling the `createCallAgent` method on the `CallClient` instance. This method asynchronously returns a `CallAgent` instance object.

The `createCallAgent` method uses `CommunicationTokenCredential` as an argument. It accepts a [user access token](../../../../quickstarts/access-tokens.md).

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
const callAgent = await callClient.createCallAgent(tokenCredential, {displayName: 'optional ACS user name'});
const deviceManager = await callClient.getDeviceManager()
```

### Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name                                | Description                                                                                                                              |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `CallClient`                        | The main entry point to the Calling SDK.                                                                                                 |
| `AzureCommunicationTokenCredential` | Implements the `CommunicationTokenCredential` interface, which is used to instantiate `callAgent`.                                       |
| `CallAgent`                         | Used to start and manage calls.                                                                                                          |
| `DeviceManager`                     | Used to manage media devices.                                                                                                            |
| `Call`                              | Used for representing a Call                                                                                                              |
| `LocalVideoStream`                  | Used for creating a local video stream for a camera device on the local system.                                                          |
| `RemoteParticipant`                 | Used for representing a remote participant in the Call                                                                                   |
| `RemoteVideoStream`                 | Used for representing a remote video stream from a Remote Participant.                                                                  |

> [!NOTE]
> The Calling SDK object instances shouldn't be considered to be a plain JavaScript objects. These are actual instances of various classes and therefore can't be serialized.