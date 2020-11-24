---
title: Quickstart - Add VOIP calling to a web app using Azure Communication Services
description: In this tutorial, you learn how to use the Azure Communication Services Calling client library for JavaScript
author: ddematheu
ms.author: nimag
ms.date: 08/11/2020
ms.topic: quickstart
ms.service: azure-communication-services
---

In this quickstart, you'll learn how start a call using the Azure Communication Services Calling client library for JavaScript.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 recommended).
- An active Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A User Access Token to instantiate the call client. Learn how to [create and manage user access tokens](../../access-tokens.md).

## Setting up

### Create a new Node.js application

Open your terminal or command window create a new directory for your app, and navigate to it.

```console
mkdir calling-quickstart && cd calling-quickstart
```

Run `npm init -y` to create a **package.json** file with default settings.

```console
npm init -y
```

### Install the package

Use the `npm install` command to install the Azure Communication Services Calling client library for JavaScript.

```console
npm install @azure/communication-common --save
npm install @azure/communication-calling --save
```

The following versions of webpack are recommended for this quickstart:

```console
"webpack": "^4.42.0",
"webpack-cli": "^3.3.11",
"webpack-dev-server": "^3.10.3"
```

The `--save` option lists the library as a dependency in your **package.json** file.

### Set up the app framework

This quickstart uses webpack to bundle the application assets. Run the following command to install the webpack, webpack-cli and webpack-dev-server npm packages and list them as development dependencies in your **package.json**:

```console
npm install webpack webpack-cli webpack-dev-server --save-dev
```

Create an **index.html** file in the root directory of your project. We'll use this file to configure a basic layout that will allow the user to place a call to an Azure Communications Bot.

Here is the code:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Communication Client - Calling Sample</title>
  </head>
  <body>
    <h4>Azure Communication Services</h4>
    <h1>Calling Quickstart</h1>
    <input 
      id="callee-id-input"
      type="text"
      placeholder="Who would you like to call?"
      style="margin-bottom:1em; width: 200px;"
    />
    <div>
      <button id="call-button" type="button" disabled="true">
        Start Call
      </button>
      &nbsp;
      <button id="hang-up-button" type="button" disabled="true">
        Hang Up
      </button>
    </div>
    <script src="./bundle.js"></script>
  </body>
</html>
```

Create a file in the root directory of your project called **client.js** to contain the application logic for this quickstart. Add the following code to import the calling client and get references to the DOM elements so we can attach our business logic. 

```javascript
import { CallClient, CallAgent } from "@azure/communication-calling";
import { AzureCommunicationUserCredential } from '@azure/communication-common';

let call;
let callAgent;
const calleeInput = document.getElementById("callee-id-input");
const callButton = document.getElementById("call-button");
const hangUpButton = document.getElementById("hang-up-button");
```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling client library:

| Name                             | Description                                                                                                                                 |
| ---------------------------------| ------------------------------------------------------------------------------------------------------------------------------------------- |
| CallClient                       | The CallClient is the main entry point to the Calling client library.                                                                       |
| CallAgent                        | The CallAgent is used to start and manage calls.                                                                                            |
| AzureCommunicationUserCredential | The AzureCommunicationUserCredential class implements the CommunicationUserCredential interface which is used to instantiate the CallAgent. |


## Authenticate the client

You need to replace `<USER_ACCESS_TOKEN>` with a valid user access token for your resource. Refer to the [user access token](../../access-tokens.md) documentation if you don't already have a token available. Using the `CallClient`, initialize a `CallAgent` instance with a `CommunicationUserCredential` which will enable us to make and receive calls. Add the following code to **client.js**:

```javascript
async function init() {
    const callClient = new CallClient();
    const tokenCredential = new AzureCommunicationUserCredential("<USER ACCESS TOKEN>");
    callAgent = await callClient.createCallAgent(tokenCredential);
    callButton.disabled = false;
}
init();
```

## Start a call

Add an event handler to initiate a call when the `callButton` is clicked:

```javascript
callButton.addEventListener("click", () => {
    // start a call
    const userToCall = calleeInput.value;
    call = callAgent.call(
        [{ communicationUserId: userToCall }],
        {}
    );
    // toggle button states
    hangUpButton.disabled = false;
    callButton.disabled = true;
});
```

## End a call

Add an event listener to end the current call when the `hangUpButton` is clicked:

```javascript
hangUpButton.addEventListener("click", () => {
  // end the current call
  call.hangUp({ forEveryone: true });

  // toggle button states
  hangUpButton.disabled = true;
  callButton.disabled = false;
});
```

The `forEveryone` property ends the call for all call participants.

## Run the code

Use the `webpack-dev-server` to build and run your app. Run the following command to bundle application host in on a local webserver:

```console
npx webpack-dev-server --entry ./client.js --output bundle.js --debug --devtool inline-source-map
```

Open your browser and navigate to http://localhost:8080/. You should see the following:

:::image type="content" source="../media/javascript/calling-javascript-app.png" alt-text="Screenshot of the completed JavaScript Application.":::

You can make an outbound VOIP call by providing a user ID in the text field and clicking the **Start Call** button. Calling `8:echo123` connects you with an echo bot, this is great for getting started and verifying your audio devices are working.
