---
title: include file
description: include file
services: azure-communication-services
author: shahen
manager: nimag
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 08/20/2020
ms.topic: include
ms.custom: include file
ms.author: shahen
---

<!--[API reference documentation](#todo-api-reference-documentation) | [Package (NuGet)](#todo-nuget) | [Samples](#todo-samples)-->

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 recommended).
- An active Communication Services resource [Create a Communication Services resource](../../create-a-communication-resource.md).
- A user access token for your Communication Services resource with `voip` permissions [Create and Manage User Access Tokens](../../user-access-tokens.md)

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

### Set up the app framework

From the project directory:

1. Open a new text file in your code editor
2. Add a `require` call to load the `CommunicationIdentityClient`
3. Create the structure for the program, including basic exception handling

Use the following code to get started:

```javascript
const { CommunicationIdentityClient } = require('@azure/communication-administration');

const main = async () => {
  console.log("Azure Communication Services - Relay Token Quickstart")

  // Quickstart code goes here
};

main().catch((error) => {
  console.log("Encountered and error");
  console.log(error);
})
```

Save the new file as **relay-token.js** in the *user-tokens-quickstart* directory.

## Exchange the user access token for a relay token

Call the Azure Communication Services token service to exchange the user access token you retrieved as a pre-requisite for a TURN service token:

```javascript  

const accessToken = INSERT_ACCESS_TOKEN_PREREQ

const tokenResponse = await fetch(`https://edge.skype.com/trap/tokens`, {
    method: 'get' ,
    headers: {
        'X-Skypetoken': accessToken,
        'api-version': '2' },
});

const iceServers = (await tokenResponse.json());

```

## Use the token on the client as an ICE candidate

The token can now be deserialized and added to an ICE candidate with WebRTC in the client browser:

```javascript  

var Administration = { iceServers: iceServers };
var peerConnection = new RTCPeerConnection(configuration);

```

## Run the code

From a console prompt, navigate to the directory containing the *issue-token.js* file, then execute the following `node` command to run the app.

```console
node ./relay-token.js
```