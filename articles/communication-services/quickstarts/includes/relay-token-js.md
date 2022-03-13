---
title: include file
description: include file
services: Communication Services
author: rahulva
manager: shahen
ms.service: Communication Services
ms.subservice: Communication Services
ms.date: 06/30/2021
ms.topic: include
ms.custom: include file
ms.author: rahulva
---
> [!NOTE]
> Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/network-traversal-get-relay-config)

## Setting Up

### Create a new Node.js Application

Open your terminal or command window create a new directory for your app, and navigate to it.

```console
mkdir relay-token-quickstart && cd relay-token-quickstart
```
Run `npm init -y` to create a **package.json** file with default settings.

```console
npm init -y
```

### Install the package

Use the `npm install` command to install the Azure Communication Services Identity client library and Network Traversal library for JavaScript.

```console
npm install @azure/communication-identity --save
npm install @azure/communication-network-traversal --save
```

The `--save` option lists the library as a dependency in your **package.json** file.

### Set up the app framework

From the project directory:

1. Open a new text file in your code editor
2. Add the `require` directives to the top of file to use the Azure Communication Identity SDK and Network Traversal SDK
3. Create the structure for the program, including basic exception handling

   Use the following code to begin:

   ```javascript
   const { CommunicationIdentityClient } = require("@azure/communication-identity");
   const { CommunicationRelayClient } = require("@azure/communication-network-traversal");;

   const main = async () => {
     console.log("Azure Communication Services - Relay Token Quickstart")
  
     // Quickstart code goes here
   };

   main().catch((error) => {
     console.log("Encountered and error");
     console.log(error);
   })
   ```

4. Save the new file as **relay-token.js** in the *user-tokens-quickstart* directory.

### Authenticate the client

Instantiate a `CommunicationIdentityClient` with your connection string. The code below retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage your resource's connection string](../create-communication-resource.md#store-your-connection-string).

Add the following code to the `main` method:

```javascript
// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];

// Instantiate the identity client
const identityClient = new CommunicationIdentityClient(connectionString);
```

## Create an identity

Azure Communication Services maintains a lightweight identity directory. Use the `createUser` method to create a new entry in the directory with a unique `Id`. Store received identity with mapping to your application's users. For example, by storing them in your application server's database. The identity is required later to issue access tokens.

```javascript
let identityResponse = await identityClient.createUser();
console.log(`\nCreated an identity with ID: ${identityResponse.communicationUserId}`);
```

### Exchange the user access token for a relay token

Call the Azure Communication token service to exchange the user access token for a TURN service token

```javascript
    const relayClient = new CommunicationRelayClient(connectionString);
    console.log("Getting relay configuration");

    const config = await relayClient.getRelayConfiguration(identityResponse);
    console.log("RelayConfig", config);
```

### Use the token on the client as an ICE candidate

The token can now be deserialized and added and an ICE candidate with WebRTC in the client browser

```javascript  
var configuration = { iceServers: iceServers };
var peerConnection = new RTCPeerConnection(configuration);
```

## Run the code

From a console prompt, navigate to the directory containing the *issue-token.js* file, then execute the following `node` command to run the app.

```console
node ./relay-token.js
```
