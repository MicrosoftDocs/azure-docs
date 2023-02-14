---
title: Quickstart - Add VOIP calling to a web app using Azure Communication Services
description: In this tutorial, you learn how to use the Azure Communication Services Calling SDK for JavaScript
author: ddematheu
ms.author: dademath
ms.date: 03/21/2022
ms.topic: include
ms.service: azure-communication-services
---

In this quickstart, you'll learn how to start a call using the Azure Communication Services Calling SDK for JavaScript.

## Sample code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/add-1-on-1-voice-calling).

> [!NOTE] 
> Outbound calling to an Azure Communication Services user can be accessed using the [Azure Communication Services UI Library](https://azure.github.io/communication-ui-library/?path=/docs/quickstarts-1ton--page). The UI Library enables developers to add a call client that is VoIP enabled into their application with only a couple lines of code.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) active Long Term Support(LTS) versions are recommended.
- An active Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md). You'll need to **record your connection string** for this quickstart.
- A User Access Token to instantiate the call client. Learn how to [create and manage user access tokens](../../../access-tokens.md). You can also use the Azure CLI and run the command below with your connection string to create a user and an access token.

  ```azurecli-interactive
  az communication identity token issue --scope voip --connection-string "yourConnectionString"
  ```

  For details, see [Use Azure CLI to Create and Manage Access Tokens](../../../access-tokens.md?pivots=platform-azcli).

[!INCLUDE [Calling with JavaScript](./get-started-javascript-setup.md)]

Here's the html, that we need to add to the `index.html` file that we created:

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
      <button id="hang-up-button" type="button" disabled="true">
        Hang Up
      </button>
    </div>
    <script src="./app.js" type="module"></script>
  </body>
</html>
```

Create a file in the root directory of your project called **app.js** to contain the application logic for this quickstart. Add the following code to import the calling client and get references to the DOM elements so we can attach our business logic. 

```javascript
import { CallClient, CallAgent } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

let call;
let callAgent;
let tokenCredential = "";
const userToken = document.getElementById("token-input");
const calleeInput = document.getElementById("callee-id-input");
const submitToken = document.getElementById("token-submit");
const callButton = document.getElementById("call-button");
const hangUpButton = document.getElementById("hang-up-button");
```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name                             | Description                                                                                                                                 |
| ---------------------------------| ------------------------------------------------------------------------------------------------------------------------------------------- |
| CallClient                       | The CallClient is the main entry point to the Calling SDK.                                                                       |
| CallAgent                        | The CallAgent is used to start and manage calls.                                                                                            |
| AzureCommunicationTokenCredential | The AzureCommunicationTokenCredential class implements the CommunicationTokenCredential interface, which is used to instantiate the CallAgent. |

## Authenticate the client

You need to input a valid user access token for your resource into the text field and click 'Submit'. Refer to the [user access token](../../../access-tokens.md) documentation if you don't already have a token available. Using the `CallClient`, initialize a `CallAgent` instance with a `CommunicationTokenCredential` that will enable us to make and receive calls. 

Add the following code to **app.js**:

```javascript
submitToken.addEventListener("click", async () => {
  const callClient = new CallClient(); 
  const userTokenCredential = userToken.value;
    try {
      tokenCredential = new AzureCommunicationTokenCredential(userTokenCredential);
      callAgent = await callClient.createCallAgent(tokenCredential);
      callButton.disabled = false;
      submitToken.disabled = true;
    } catch(error) {
      window.alert("Please submit a valid token!");
    }
})
```

## Start a call

Add an event handler to initiate a call when the `callButton` is clicked:

```javascript
callButton.addEventListener("click", () => {
    // start a call
    const userToCall = calleeInput.value;

    // To call an Azure Communication Services communication user, use {communicationUserId: 'ACS_USER_ID'}.
    // To call echo bot, use {id: '8:echo123'}.
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

Add an event listener to end the current call when the `hangUpButton` is clicked:

```javascript
hangUpButton.addEventListener("click", () => {
  // end the current call
  call.hangUp({ forEveryone: true });

  // toggle button states
  hangUpButton.disabled = true;
  callButton.disabled = false;
  submitToken.disabled = false;
});
```

The `forEveryone` property ends the call for all call participants.

## Run the code

Use the command `npx parcel index.html` to run your application.

Open your browser and navigate to http://localhost:1234/. You should see the following:

:::image type="content" source="../../media/javascript/calling-javascript-app-2.png" alt-text="Screenshot of the completed JavaScript Application.":::

You can make an outbound VOIP call by providing a valid user access token and user ID in the corresponding text fields and clicking the **Start Call** button.

Calling `8:echo123` connects you with an echo bot, which is great for getting started and verifying your audio devices are working. Pass `{id: '8:echo123'}` to the CallAgent.startCall() API to call echobot.
To call an Azure Communication Services communication user, pass `{communicationUserId: 'ACS_USER_ID'}` to the `CallAgent.startCall()` API.
