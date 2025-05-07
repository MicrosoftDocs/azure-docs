---
title: Quickstart - Join a Teams meeting from a web app
description: In this tutorial, you learn how to join a Teams meeting using the Azure Communication Services Calling SDK for JavaScript
author: tophpalmer
ms.author: rifox
ms.date: 03/10/2021
ms.topic: include
ms.service: azure-communication-services
---

In this quickstart, you learn how to join a Teams meeting using the Azure Communication Services Calling SDK for JavaScript.

## Sample Code
Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/join-calling-to-teams-meeting).

## Prerequisites

- A working [Communication Services calling web app](../../getting-started-with-calling.md).
- A [Teams deployment](/deployoffice/teams-install).
- The Minimum Version supported for Teams meeting ID and passcode join API : 1.17.1
- An [access token](../../../identity/access-tokens.md).

## Add the Teams UI controls

Replace code in index.html with following snippet.
Join the Teams meeting via Teams Meeting link or Teams MeetingId and Passcode.
The text boxes are used to enter the Teams meeting context and the button is used to join the specified meeting:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Communication Client - Calling Sample</title>
</head>
<body>
    <h4>Azure Communication Services</h4>
    <h1>Teams meeting join quickstart</h1>
    <input id="teams-link-input" type="text" placeholder="Teams meeting link"
        style="margin-bottom:1em; width: 300px;" />
    <p><input id="teams-meetingId-input" type="text" placeholder="Teams meetingId"
        style="margin-bottom:1em; width: 300px;" /></p>
    <p><input id="teams-passcode-input" type="text" placeholder="Teams meeting Passcode"
        style="margin-bottom:1em; width: 300px;" /></p>
        <p>Call state <span style="font-weight: bold" id="call-state">-</span></p>
        <p><span style="font-weight: bold" id="recording-state"></span></p>
    <div>
        <button id="join-meeting-button" type="button" disabled="false">
            Join Teams Meeting
        </button>
        <button id="hang-up-button" type="button" disabled="true">
            Hang Up
        </button>
    </div>
    <script src="./app.js" type="module"></script>
</body>

</html>
```

## Enable the Teams UI controls

Replace content of app.js file with following snippet.

```javascript
import { CallClient } from "@azure/communication-calling";
import { Features } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

let call;
let callAgent;
const meetingLinkInput = document.getElementById('teams-link-input');
const meetingIdInput = document.getElementById('teams-meetingId-input');
const meetingPasscodeInput = document.getElementById('teams-passcode-input');
const hangUpButton = document.getElementById('hang-up-button');
const teamsMeetingJoinButton = document.getElementById('join-meeting-button');
const callStateElement = document.getElementById('call-state');
const recordingStateElement = document.getElementById('recording-state');

async function init() {
    const callClient = new CallClient();
    const tokenCredential = new AzureCommunicationTokenCredential("<USER ACCESS TOKEN>");
    callAgent = await callClient.createCallAgent(tokenCredential, {displayName: 'Test user'});
    teamsMeetingJoinButton.disabled = false;
}
init();

hangUpButton.addEventListener("click", async () => {
    // end the current call
    await call.hangUp();
  
    // toggle button states
    hangUpButton.disabled = true;
    teamsMeetingJoinButton.disabled = false;
    callStateElement.innerText = '-';
  });

teamsMeetingJoinButton.addEventListener("click", () => {    
    // join with meeting link
    call = callAgent.join({meetingLink: meetingLinkInput.value}, {});

   //(or) to join with meetingId and passcode use the below code snippet.
   //call = callAgent.join({meetingId: meetingIdInput.value, passcode: meetingPasscodeInput.value}, {});
    
    call.on('stateChanged', () => {
        callStateElement.innerText = call.state;
    })

    call.api(Features.Recording).on('isRecordingActiveChanged', () => {
        if (call.api(Features.Recording).isRecordingActive) {
            recordingStateElement.innerText = "This call is being recorded";
        }
        else {
            recordingStateElement.innerText = "";
        }
    });
    // toggle button states
    hangUpButton.disabled = false;
    teamsMeetingJoinButton.disabled = true;
});
```

## Get the Teams meeting link

The Teams meeting link can be retrieved using Graph APIs, which is detailed in [Graph documentation](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true).
The Communication Services Calling SDK accepts a full Teams meeting link. This link is returned as part of the `onlineMeeting` resource, accessible under the [`joinWebUrl` property](/graph/api/resources/onlinemeeting?view=graph-rest-beta&preserve-view=true)
You can also get the required meeting information from the **Join Meeting** URL in the Teams meeting invite itself.

## Get the Teams meeting ID and passcode
* Graph API: Use Graph API to retrieve information about onlineMeeting resource and check the object in property joinMeetingIdSettings.
* Teams: In your Teams application, go to Calendar app and open details of a meeting. Online meetings have meeting ID and passcode in the definition of the meeting.
* Outlook: You can find the meeting ID & passcode in calendar events or in email meeting invites.

## Run the code

Run the following command to bundle your application host on a local webserver:

```console
npx webpack serve --config webpack.config.js
```

Open your browser and navigate to http://localhost:8080/. You should see the following:

:::image type="content" source="../../media/javascript/acs-join-teams-meeting-quickstart.PNG" alt-text="Screenshot of the completed JavaScript Application.":::

Insert the Teams context into the text box and press *Join Teams Meeting* to join the Teams meeting from within your Communication Services application.
