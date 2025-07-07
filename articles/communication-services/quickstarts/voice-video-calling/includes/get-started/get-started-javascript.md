---
title: Add VOIP calling to a web app
description: This article describes how to add VOIP calling to a web app using the Azure Communication Services Calling SDK for JavaScript.
author: ddematheu
ms.author: dademath
ms.date: 05/10/2025
ms.topic: include
ms.service: azure-communication-services
---

This article describes how to start a call using the Azure Communication Services Calling SDK for JavaScript.

## Sample code

You can download the sample app from GitHub at [Add 1 on 1 voice calling to your application](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/add-1-on-1-voice-calling).

> [!NOTE] 
> Access outbound calling to an Azure Communication Services user using the [Azure Communication Services UI Library](https://azure.github.io/communication-ui-library/?path=/docs/composites-callcomposite-1-n-docs--docs). The UI Library enables developers to add a call client that is VoIP enabled into their application with only a couple lines of code.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- You need to have [Node.js 18](https://nodejs.org/dist/v18.18.0/). You can use the msi installer to install it.
- An active Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md). You need to **record your connection string** for this quickstart.
- A User Access Token to instantiate the call client. Learn how to [create and manage user access tokens](../../../identity/access-tokens.md). You can also use the Azure CLI and run the command with your connection string to create a user and an access token.


  ```azurecli-interactive
  az communication identity token issue --scope voip --connection-string "yourConnectionString"
  ```

  For details, see [Use Azure CLI to Create and Manage Access Tokens](../../../identity/access-tokens.md?pivots=platform-azcli).

## Set up

### Create a new Node.js application

Open your terminal or command window create a new directory for your app, and navigate to it.

```console
mkdir calling-quickstart
cd calling-quickstart
```

Run `npm init -y` to create a **package.json** file with default settings.

```console
npm init -y
```

### Install the package

Use the `npm install` command to install the Azure Communication Services Calling SDK for JavaScript.

```console
npm install @azure/communication-common --save
npm install @azure/communication-calling --save
```

The `--save` option lists the library as a dependency in your **package.json** file.

### Set up the app framework

This article uses webpack to bundle the application assets. Run the following command to install the `webpack`, `webpack-cli`, and `webpack-dev-server` npm packages and list them as development dependencies in your `package.json`:

```console
npm install copy-webpack-plugin@^11.0.0 webpack@^5.88.2 webpack-cli@^5.1.4 webpack-dev-server@^4.15.1 --save-dev
```

Here's the HTML you need to add to the `index.html` file:

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
      id="token-input"
      type="text"
      placeholder="User access token"
      style="margin-bottom:1em; width: 200px;"
    />
    </div>
    <button id="token-submit" type="button">
        Submit
    </button>
    <input 
      id="callee-id-input"
      type="text"
      placeholder="Who would you like to call?"
      style="margin-bottom:1em; width: 200px; display: block;"
    />
    <div>
      <button id="call-button" type="button" disabled="true">
        Start Call
      </button>
      &nbsp;
      <button id="accept-call-button" type="button" disabled="true">
        Accept Call
      </button>
      &nbsp;
      <button id="hang-up-button" type="button" disabled="true">
        Hang Up
      </button>
    </div>
    <script src="./main.js"></script>
  </body>
</html>
```

Create a file in the root directory of your project called **index.js** to contain the application logic for this quickstart. Add the following code to import the calling client and get references to the DOM elements so we can attach our business logic. 

```javascript
import { CallClient } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

let call;
let incomingCall;
let callAgent;
let deviceManager;
let tokenCredential;
const userToken = document.getElementById("token-input"); 
const calleeInput = document.getElementById("callee-id-input");
const submitToken = document.getElementById("token-submit");
const callButton = document.getElementById("call-button");
const hangUpButton = document.getElementById("hang-up-button");
const acceptCallButton = document.getElementById('accept-call-button');
```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name | Description |
| ---| --- |
| `CallClient` | The `CallClient` is the main entry point to the Calling SDK. |
| `CallAgent` | Use the `CallAgent` to start and manage calls. |
| `AzureCommunicationTokenCredential` | Use the `AzureCommunicationTokenCredential` class to implement the `CommunicationTokenCredential` interface, which instantiates the `CallAgent`. |

## Authenticate the client

You need to input a valid user access token for your resource into the text field and click **Submit**. If you don't already have a token available, see [user access token](../../../identity/access-tokens.md). Use the `CallClient` to initialize a `CallAgent` instance with a `CommunicationTokenCredential` that enables the app to make and receive calls.

Add the following code to **app.js**:

```javascript
submitToken.addEventListener("click", async () => {
  const callClient = new CallClient();
  const userTokenCredential = userToken.value;
    try {
      tokenCredential = new AzureCommunicationTokenCredential(userTokenCredential);
      callAgent = await callClient.createCallAgent(tokenCredential);
      deviceManager = await callClient.getDeviceManager();
      await deviceManager.askDevicePermission({ audio: true });
      callButton.disabled = false;
      submitToken.disabled = true;
      // Listen for an incoming call to accept.
      callAgent.on('incomingCall', async (args) => {
        try {
          incomingCall = args.incomingCall;
          acceptCallButton.disabled = false;
          callButton.disabled = true;
        } catch (error) {
          console.error(error);
        }
      });
    } catch(error) {
      window.alert("Please submit a valid token!");
    }
})
```

## Start a call

Add an event handler to initiate a call when the end user clicks the `callButton`:

```javascript
callButton.addEventListener("click", () => {
  // start a call
  const userToCall = calleeInput.value;
  call = callAgent.startCall(
      [{ id: userToCall }],
      {}
  );
  // toggle button states
  hangUpButton.disabled = false;
  callButton.disabled = true;
});
```

## End a call

Add an event listener to end the current call when the end user clicks the `hangUpButton`:

```javascript
hangUpButton.addEventListener("click", () => {
  // end the current call
  // The `forEveryone` property ends the call for all call participants.
  call.hangUp({ forEveryone: true });

  // toggle button states
  hangUpButton.disabled = true;
  callButton.disabled = false;
  submitToken.disabled = false;
  acceptCallButton.disabled = true;
});
```

## Accept an incoming call

Add an event listener to accept an incoming call to the `acceptCallButton`:

```javascript
acceptCallButton.onclick = async () => {
  try {
    call = await incomingCall.accept();
    acceptCallButton.disabled = true;
    hangUpButton.disabled = false;
  } catch (error) {
    console.error(error);
  }
}
```

## Add the webpack local server code

Create a file in the root directory of your project called `webpack.config.js` to contain the local server logic for this quickstart. Add the following code to `webpack.config.js`:

```javascript
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: './index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        static: {
            directory: path.join(__dirname, './')
        },
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                './index.html'
            ]
        }),
    ]
};
```

## Run the code

Use the command `npx webpack serve --config webpack.config.js` to run your application.

Open your browser and navigate to http://localhost:8080/. You should see the following screen:

:::image type="content" source="../../media/javascript/calling-javascript-app-2.png" alt-text="Screenshot of the completed JavaScript Application.":::

You can make an outbound VOIP call by providing a valid user access token and user ID in the corresponding text fields and clicking the **Start Call** button.

Calling `8:echo123` connects you with an echo bot, which gets you started and verifies your audio devices are working. Pass `{id: '8:echo123'}` to the `CallAgent.startCall()` API to call echo bot.

To call an Azure Communication Services communication user, pass `{communicationUserId: 'ACS_USER_ID'}` to the `CallAgent.startCall()` API.
