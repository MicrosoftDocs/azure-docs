---
author: nikuklic
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/21/2022
ms.author: nikuklic
---
[!INCLUDE [Emergency Calling Notice](../../../includes/emergency-calling-notice-include.md)]

## Sample Code
Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/add-1-on-1-phone-calling)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A [phone number acquired](../get-phone-number.md) in your Communication Services resource, or Azure Communication Services [direct routing configured](../../../concepts/telephony/direct-routing-provisioning.md)
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../access-tokens.md)

[!INCLUDE [Calling with JavaScript](../../voice-video-calling/includes/get-started/get-started-javascript-setup.md)]

Here's the code:

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
      id="callee-phone-input"
      type="text"
      placeholder="Who would you like to call?"
      style="margin-bottom:1em; width: 230px;"
    />
    <div>
      <button id="call-phone-button" type="button">
        Start Call
      </button>
      &nbsp;
      <button id="hang-up-phone-button" type="button" disabled="true">
        Hang Up
      </button>
    </div>
    <script src="./app.js"></script>
  </body>
</html>
```

Create a file in the root directory of your project called **app.js** to contain the application logic for this quickstart. Add the following code to import the calling client and get references to the DOM elements so we can attach our business logic.

```javascript
import { CallClient, CallAgent } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

let call;
let callAgent;

const calleePhoneInput = document.getElementById("callee-phone-input");
const callPhoneButton = document.getElementById("call-phone-button");
const hangUpPhoneButton = document.getElementById("hang-up-phone-button");

async function init() {
    const callClient = new CallClient();
    const tokenCredential = new AzureCommunicationTokenCredential('<USER ACCESS TOKEN with VoIP scope>');
    callAgent = await callClient.createCallAgent(tokenCredential);
    //callPhoneButton.disabled = false;
}

init();
```

## Start a call to phone

Specify phone number you acquired in Communication Services resource, that will be used to start the call:
> [!WARNING]
> Phone numbers should be provided in E.164 international standard format. (e.g.: +12223334444)

Add an event handler to initiate a call to the phone number you provided when the `callPhoneButton` is clicked:

```javascript
callPhoneButton.addEventListener("click", () => {
  // start a call to phone
  const phoneToCall = calleePhoneInput.value;
  call = callAgent.startCall(
    [{phoneNumber: phoneToCall}], { alternateCallerId: {phoneNumber: 'YOUR AZURE REGISTERED PHONE NUMBER HERE: +12223334444'}
  });
  // toggle button states
  hangUpPhoneButton.disabled = false;
  callPhoneButton.disabled = true;
});
```

## End a call to phone

Add an event listener to end the current call when the `hangUpPhoneButton` is clicked:

```javascript
hangUpPhoneButton.addEventListener("click", () => {
  // end the current call
  call.hangUp({
    forEveryone: true
  });

  // toggle button states
  hangUpPhoneButton.disabled = true;
  callPhoneButton.disabled = false;
});
```

The `forEveryone` property ends the call for all call participants.

## Run the code

Use the command `npx parcel index.html` to build and run your app.

Open your browser and navigate to `http://localhost:1234/`. You should see the following:

:::image type="content" source="../media/pstn-call/pstn-calling-javascript-app.png" alt-text="Screenshot of the completed JavaScript Application.":::

You can place a call to a real phone number by providing a phone number in the added text field and clicking the **Start Phone Call** button.
