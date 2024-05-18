---
title: Quickstart - Teams interop group calls on Azure Communication Services
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you learn how to place Microsoft Teams interop group calls with Azure Communication Calling SDK.
author: fizampou
ms.author: fizampou
ms.date: 04/04/2024
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other, devx-track-js
---

# Quickstart: Place interop group calls between Azure Communication Services and Microsoft Teams

In this quickstart, you're going to learn how to start a group call from Azure Communication Services user to Teams users. You're going to achieve it with the following steps:

1. Enable federation of Azure Communication Services resource with Teams Tenant.
2. Get identifiers of the Teams users.
3. Start a call with Azure Communication Services Calling SDK.

[!INCLUDE [Enable interoperability in your Teams tenant](../../concepts/includes/enable-interoperability-for-teams-tenant.md)]

## Sample Code

Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/place-interop-group-calls).

## Prerequisites

- A working [Communication Services calling web app](./getting-started-with-calling.md).
- A [Teams deployment](/deployoffice/teams-install).
- An [access token](../identity/access-tokens.md).

## Add the Call UI controls

Replace code in index.html with following snippet.
Place a group call to the Teams users by specifying their IDs.
The text boxes are used to enter the Teams user IDs planning to call and add in a group:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Communication Client - Calling Sample</title>
</head>
<body>
    <h4>Azure Communication Services</h4>
    <h1>Teams interop group call quickstart</h1>
    <input id="teams-ids-input" type="text" placeholder="Teams IDs split by comma"
           style="margin-bottom:1em; width: 300px;" />
    <p>Call state <span style="font-weight: bold" id="call-state">-</span></p>
    <p><span style="font-weight: bold" id="recording-state"></span></p>
    <div>
        <button id="place-group-call-button" type="button" disabled="false">
            Place group call
        </button>
        <button id="hang-up-button" type="button" disabled="true">
            Hang Up
        </button>
    </div>
    <script src="./client.js"></script>
</body>
</html>
```

Replace content of client.js file with following snippet.

```javascript
import { CallClient } from "@azure/communication-calling";
import { Features } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

let call;
let callAgent;
const teamsIdsInput = document.getElementById('teams-ids-input');
const hangUpButton = document.getElementById('hang-up-button');
const placeInteropGroupCallButton = document.getElementById('place-group-call-button');
const callStateElement = document.getElementById('call-state');
const recordingStateElement = document.getElementById('recording-state');

async function init() {
    const callClient = new CallClient();
    const tokenCredential = new AzureCommunicationTokenCredential("<USER ACCESS TOKEN>");
    callAgent = await callClient.createCallAgent(tokenCredential, { displayName: 'ACS user' });
    placeInteropGroupCallButton.disabled = false;
}
init();

hangUpButton.addEventListener("click", async () => {
    await call.hangUp();
    hangUpButton.disabled = true;
    teamsMeetingJoinButton.disabled = false;
    callStateElement.innerText = '-';
});

placeInteropGroupCallButton.addEventListener("click", () => {
    if (!teamsIdsInput.value) {
        return;
    }


    const participants = teamsIdsInput.value.split(',').map(id => {
        const participantId = id.replace(' ', '');
        return {
            microsoftTeamsUserId: `8:orgid:${participantId}`
        };
    })

    call = callAgent.startCall(participants);

    call.on('stateChanged', () => {
        callStateElement.innerText = call.state;
    })

    call.feature(Features.Recording).on('isRecordingActiveChanged', () => {
        if (call.feature(Features.Recording).isRecordingActive) {
            recordingStateElement.innerText = "This call is being recorded";
        }
        else {
            recordingStateElement.innerText = "";
        }
    });
    hangUpButton.disabled = false;
    placeInteropGroupCallButton.disabled = true;
});
```

## Get the Teams user IDs

The Teams user IDs can be retrieved using Graph APIs, which is detailed in [Graph documentation](/graph/api/user-get?tabs=http).

```console
https://graph.microsoft.com/v1.0/me
```

In results get the "id" field.

```json
    "userPrincipalName": "lab-test2-cq@contoso.com",
    "id": "31a011c2-2672-4dd0-b6f9-9334ef4999db"
```

## Run the code

Run the following command to bundle your application host on a local webserver:

```console
npx webpack-dev-server --entry ./client.js --output bundle.js --debug --devtool inline-source-map
```

Open your browser and navigate to http://localhost:8080/. You should see the following screen:

:::image type="content" source="./media/javascript/acs-group-teams-calls-quickstart.png" alt-text="Screenshot of the completed JavaScript Application.":::

Insert the Teams IDs into the text box split by comma and press *Place Group Call* to start the group call from within your Communication Services application.

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

For advanced flows using Call Automation, see the following articles:

- [Outbound calls with Call Automation](../call-automation/quickstart-make-an-outbound-call.md?tabs=visual-studio-code&pivots=programming-language-javascript)
- [Add Microsoft Teams user](../../how-tos/call-automation/teams-interop-call-automation.md?pivots=programming-language-javascript)

For more information, see the following articles:

- Check out our [calling hero sample](../../samples/calling-hero-sample.md)
- Get started with the [UI Library](../ui-library/get-started-composites.md)
- Learn about [Calling SDK capabilities](./getting-started-with-calling.md)
- Learn more about [how calling works](../../concepts/voice-video-calling/about-call-types.md)
