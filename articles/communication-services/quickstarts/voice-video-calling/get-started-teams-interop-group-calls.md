---
title: Quickstart - Teams interop calls on Azure Communication Services
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you learn how to place Microsoft Teams interop calls with Azure Communication Calling SDK.
author: fizampou
ms.author: fizampou
ms.date: 04/04/2024
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

# Quickstart: Place interop calls between Azure Communication Services and Microsoft Teams

In this quickstart, you're going to learn how to start a call from Azure Communication Services user to Teams users. You're going to achieve it with the following steps:

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

Replace code in index.html with the following snippet. Place a call to the Teams users by specifying their <a href="#userIds">ID(s)</a>.
- The text box is used to enter the Teams user IDs you are planning to call. Enter one id for a 1:1 call, or multiple for a group call

```html
<!DOCTYPE html>
<html>
<head>
    <title>Communication Client - Calling Sample</title>
</head>
<body>
    <h4>Azure Communication Services</h4>
    <h1>Teams interop calling quickstart</h1>
    <input id="teams-id-input" type="text" placeholder="Teams ID(s)"
           style="margin-bottom:1em; width: 300px;" />
    <p>Call state <span style="font-weight: bold" id="call-state">-</span></p>
    <p><span style="font-weight: bold" id="recording-state"></span></p>
    <div>
        <button id="start-call-button" type="button" disabled="false">
            Start Call
        </button>
        <button id="hang-up-button" type="button" disabled="true">
            Hang Up
        </button>
    </div>
    <br>
    <div>
        <button id="mute-button" type="button" disabled="true"> Mute </button>
        <button id="unmute-button" type="button" disabled="true"> Unmute </button>
    </div>
    <br>
    <div>
        <button id="start-video-button" type="button" disabled="true">Start Video</button>
        <button id="stop-video-button" type="button" disabled="true">Stop Video</button>
    </div>
    <br>
    <br>
    <div id="remoteVideoContainer" style="width: 40%;" hidden>Remote participants' video streams:</div>
    <br>
    <div id="localVideoContainer" style="width: 30%;" hidden>Local video stream:</div>
    <!-- points to the bundle generated from client.js -->
    <script src="./main.js"></script>
</body>
</html>
```

Replace content of client.js file with following snippet.

```javascript
const { CallClient, Features, VideoStreamRenderer, LocalVideoStream } = require('@azure/communication-calling');
const { AzureCommunicationTokenCredential } = require('@azure/communication-common');
const { AzureLogger, setLogLevel } = require("@azure/logger");

// Set the log level and output
setLogLevel('verbose');
AzureLogger.log = (...args) => {
    console.log(...args);
};
// Calling web sdk objects
let call;
let callAgent;
let localVideoStream;
let localVideoStreamRenderer;
// UI widgets
const teamsIdInput = document.getElementById('teams-id-input');
const hangUpButton = document.getElementById('hang-up-button');
const startInteropCallButton = document.getElementById('start-call-button');
const muteButton = document.getElementById('mute-button')
const unmuteButton = document.getElementById('unmute-button')
const callStateElement = document.getElementById('call-state');
const recordingStateElement = document.getElementById('recording-state');
const startVideoButton = document.getElementById('start-video-button');
const stopVideoButton = document.getElementById('stop-video-button');
const remoteVideoContainer = document.getElementById('remoteVideoContainer');
const localVideoContainer = document.getElementById('localVideoContainer');
/**
 * Create an instance of CallClient. Initialize a CallAgent instance with a CommunicationUserCredential via created CallClient. CallAgent enables us to make outgoing calls. 
 * You can then use the CallClient.getDeviceManager() API instance to get the DeviceManager.
 */
async function init() {
    try {
        const callClient = new CallClient();
        const tokenCredential = new AzureCommunicationTokenCredential("<USER ACCESS TOKEN>");
        callAgent = await callClient.createCallAgent(tokenCredential, { displayName: 'ACS user' });
        // Set up a camera device to use.
        deviceManager = await callClient.getDeviceManager();
        await deviceManager.askDevicePermission({ video: true });
        await deviceManager.askDevicePermission({ audio: true });
        startInteropCallButton.disabled = false;
    } catch(error) {
        console.error(error);
    }
}
init();

muteButton.addEventListener("click", async () => {
    try {
        await call.mute();
    } catch (error) {
        console.error(error)
    }
})

unmuteButton.onclick = async () => {
    try {
        await call.unmute();
    } catch (error) {
        console.error(error)
    }
}

startInteropCallButton.addEventListener("click", async () => {
    if (!teamsIdInput.value) {
        return;
    }
    try {
        const localVideoStream = await createLocalVideoStream();
        const videoOptions = localVideoStream ? { localVideoStreams: [localVideoStream] } : undefined;
        const participants = teamsIdInput.value.split(',').map(id => {
            const participantId = id.replace(' ', '');
            return {
                microsoftTeamsUserId: `${participantId}`
            };
        })
        call = callAgent.startCall(participants, {videoOptions: videoOptions})
        // Subscribe to the call's properties and events.
        subscribeToCall(call);
    } catch (error) {
        console.error(error);
    }

    call.feature(Features.Recording).on('isRecordingActiveChanged', () => {
        if (call.feature(Features.Recording).isRecordingActive) {
            recordingStateElement.innerText = "This call is being recorded";
        }
        else {
            recordingStateElement.innerText = "";
        }
    });
});

// Subscribe to a call obj.
// Listen for property changes and collection updates.
subscribeToCall = (call) => {
    try {
        // Inspect the initial call.id value.
        console.log(`Call Id: ${call.id}`);
        //Subscribe to call's 'idChanged' event for value changes.
        call.on('idChanged', () => {
            console.log(`Call ID changed: ${call.id}`); 
        });
        // Inspect the initial call.state value.
        console.log(`Call state: ${call.state}`);
        // Subscribe to call's 'stateChanged' event for value changes.
        call.on('stateChanged', async () => {
            console.log(`Call state changed: ${call.state}`);
            callStateElement.innerText = call.state;
            if(call.state === 'Connected') {
                startInteropCallButton.disabled = true;
                hangUpButton.disabled = false;
                startVideoButton.disabled = false;
                stopVideoButton.disabled = false;
                muteButton.disabled = false;
                unmuteButton.disabled = false;
            } else if (call.state === 'Disconnected') {
                startInteropCallButton.disabled = false;
                hangUpButton.disabled = true;
                startVideoButton.disabled = true;
                stopVideoButton.disabled = true;
                muteButton.disabled = true;
                unmuteButton.disabled = true;
                console.log(`Call ended, call end reason={code=${call.callEndReason.code}, subCode=${call.callEndReason.subCode}}`);
            }   
        });
        call.on('isLocalVideoStartedChanged', () => {
            console.log(`isLocalVideoStarted changed: ${call.isLocalVideoStarted}`);
        });
        console.log(`isLocalVideoStarted: ${call.isLocalVideoStarted}`);
        call.localVideoStreams.forEach(async (lvs) => {
            localVideoStream = lvs;
            await displayLocalVideoStream();
        });
        call.on('localVideoStreamsUpdated', e => {
            e.added.forEach(async (lvs) => {
                localVideoStream = lvs;
                await displayLocalVideoStream();
            });
            e.removed.forEach(lvs => {
               removeLocalVideoStream();
            });
        });
        
        // Inspect the call's current remote participants and subscribe to them.
        call.remoteParticipants.forEach(remoteParticipant => {
            subscribeToRemoteParticipant(remoteParticipant);
        });
        // Subscribe to the call's 'remoteParticipantsUpdated' event to be
        // notified when new participants are added to the call or removed from the call.
        call.on('remoteParticipantsUpdated', e => {
            // Subscribe to new remote participants that are added to the call.
            e.added.forEach(remoteParticipant => {
                subscribeToRemoteParticipant(remoteParticipant)
            });
            // Unsubscribe from participants that are removed from the call
            e.removed.forEach(remoteParticipant => {
                console.log('Remote participant removed from the call.');
            });
        });
    } catch (error) {
        console.error(error);
    }
}

// Subscribe to a remote participant obj.
// Listen for property changes and collection updates.
subscribeToRemoteParticipant = (remoteParticipant) => {
    try {
        // Inspect the initial remoteParticipant.state value.
        console.log(`Remote participant state: ${remoteParticipant.state}`);
        // Subscribe to remoteParticipant's 'stateChanged' event for value changes.
        remoteParticipant.on('stateChanged', () => {
            console.log(`Remote participant state changed: ${remoteParticipant.state}`);
        });
        // Inspect the remoteParticipants's current videoStreams and subscribe to them.
        remoteParticipant.videoStreams.forEach(remoteVideoStream => {
            subscribeToRemoteVideoStream(remoteVideoStream)
        });
        // Subscribe to the remoteParticipant's 'videoStreamsUpdated' event to be
        // notified when the remoteParticipant adds new videoStreams and removes video streams.
        remoteParticipant.on('videoStreamsUpdated', e => {
            // Subscribe to newly added remote participant's video streams.
            e.added.forEach(remoteVideoStream => {
                subscribeToRemoteVideoStream(remoteVideoStream)
            });
            // Unsubscribe from newly removed remote participants' video streams.
            e.removed.forEach(remoteVideoStream => {
                console.log('Remote participant video stream was removed.');
            })
        });
    } catch (error) {
        console.error(error);
    }
}
/**
 * Subscribe to a remote participant's remote video stream obj.
 * You have to subscribe to the 'isAvailableChanged' event to render the remoteVideoStream. If the 'isAvailable' property
 * changes to 'true' a remote participant is sending a stream. Whenever the availability of a remote stream changes
 * you can choose to destroy the whole 'Renderer' a specific 'RendererView' or keep them. Displaying RendererView without a video stream will result in a blank video frame. 
 */
subscribeToRemoteVideoStream = async (remoteVideoStream) => {
    // Create a video stream renderer for the remote video stream.
    let videoStreamRenderer = new VideoStreamRenderer(remoteVideoStream);
    let view;
    const renderVideo = async () => {
        try {
            // Create a renderer view for the remote video stream.
            view = await videoStreamRenderer.createView();
            // Attach the renderer view to the UI.
            remoteVideoContainer.hidden = false;
            remoteVideoContainer.appendChild(view.target);
        } catch (e) {
            console.warn(`Failed to createView, reason=${e.message}, code=${e.code}`);
        }	
    }
    
    remoteVideoStream.on('isAvailableChanged', async () => {
        // Participant has switched video on.
        if (remoteVideoStream.isAvailable) {
            await renderVideo();
        // Participant has switched video off.
        } else {
            if (view) {
                view.dispose();
                view = undefined;
                remoteVideoContainer.hidden = true;
            }
        }
    });
    // Participant has video on initially.
    if (remoteVideoStream.isAvailable) {
        await renderVideo();
    }
}

// Start your local video stream.
// This will send your local video stream to remote participants so they can view it.
startVideoButton.onclick = async () => {
    try {
        const localVideoStream = await createLocalVideoStream();
        await call.startVideo(localVideoStream);
    } catch (error) {
        console.error(error);
    }
}
// Stop your local video stream.
// This will stop your local video stream from being sent to remote participants.
stopVideoButton.onclick = async () => {
    try {
        await call.stopVideo(localVideoStream);
    } catch (error) {
        console.error(error);
    }
}

/**
 * To render a LocalVideoStream, you need to create a new instance of VideoStreamRenderer, and then
 * create a new VideoStreamRendererView instance using the asynchronous createView() method.
 * You may then attach view.target to any UI element. 
 */
// Create a local video stream for your camera device
createLocalVideoStream = async () => {
    const camera = (await deviceManager.getCameras())[0];
    if (camera) {
        return new LocalVideoStream(camera);
    } else {
        console.error(`No camera device found on the system`);
    }
}
// Display your local video stream preview in your UI
displayLocalVideoStream = async () => {
    try {
        localVideoStreamRenderer = new VideoStreamRenderer(localVideoStream);
        const view = await localVideoStreamRenderer.createView();
        localVideoContainer.hidden = false;
        localVideoContainer.appendChild(view.target);
    } catch (error) {
        console.error(error);
    } 
}
// Remove your local video stream preview from your UI
removeLocalVideoStream = async() => {
    try {
        localVideoStreamRenderer.dispose();
        localVideoContainer.hidden = true;
    } catch (error) {
        console.error(error);
    } 
}

// End the current call
hangUpButton.addEventListener("click", async () => {
    // end call
    await call.hangUp();
});
```

 <h2 id="userIds">Get the Teams user IDs</h2>

The Teams user IDs can be retrieved using Graph APIs, which is detailed in [Graph documentation](/graph/api/user-get?tabs=http).

```console
https://graph.microsoft.com/v1.0/me
```

In results get the "id" field.

```json
    "userPrincipalName": "lab-test2-cq@contoso.com",
    "id": "31a011c2-2672-4dd0-b6f9-9334ef4999db"
```

Or the same ID could be found in [Azure portal](https://aka.ms/portal) in Users tab:
![Screenshot of User Object ID in Azure portal.](./includes/teams-user/portal-user-id.png)

## Run the code

Run the following command to bundle your application host on a local webserver:

```console
npx webpack serve --config webpack.config.js
```

Open your browser and navigate to http://localhost:8080/. You should see the following screen:

:::image type="content" source="./media/javascript/ad-hoc-interop.png" alt-text="Screenshot of the completed JavaScript Application.":::

Insert the Teams ID(s) into the text box, split by commas if more than one, and press *Start Call* to start the call from within your Communication Services application.

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
