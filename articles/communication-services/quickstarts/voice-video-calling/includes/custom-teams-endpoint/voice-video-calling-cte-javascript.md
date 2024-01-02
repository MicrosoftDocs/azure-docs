---
author: xixian73
ms.service: azure-communication-services
ms.topic: include
ms.date: 08/02/2022
ms.author: xixian
---

Get started with Azure Communication Services by using the Communication Services calling SDK to add 1:1 voice & video calling to your app. You'll learn how to start and answer a call using the Azure Communication Services Calling SDK for JavaScript.

## Sample Code

If you'd like to skip ahead to the end, you can download this quickstart as a sample on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/add-1-on-1-cte-video-calling).

## Prerequisites
- Obtain an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- You need to have [Node.js 18](https://nodejs.org/dist/v18.18.0/). You can use the msi installer to install it.
- Create an active Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md?pivots=platform-azp&tabs=windows).
- Create a User Access Token to instantiate the call client. [Learn how to create and manage user access tokens](../../../manage-teams-identity.md?pivots=programming-language-javascript).
- Obtain Teams thread ID to for call operations using [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer). Read more about [how to create chat thread ID](/graph/api/chat-post?preserve-view=true&tabs=javascript&view=graph-rest-1.0#example-2-create-a-group-chat).

## Setting up
### Create a new Node.js application
Open your terminal or command window create a new directory for your app, and navigate to the directory.
```console
mkdir calling-quickstart && cd calling-quickstart
```


Run `npm init -y` to create a **package.json** file with default settings.

```console
npm init -y
```
### Install the package
Use the `npm install` command to install the Azure Communication Services Calling SDK for JavaScript.
> [!IMPORTANT]
> This quickstart uses the latest Azure Communication Services Calling SDK version.
```console
npm install @azure/communication-common --save
npm install @azure/communication-calling --save
```
### Set up the app framework
This quickstart uses webpack to bundle the application assets. Run the following command to install the `webpack`, `webpack-cli` and `webpack-dev-server` npm packages and list them as development dependencies in your `package.json`:

```console
npm install copy-webpack-plugin@^11.0.0 webpack@^5.88.2 webpack-cli@^5.1.4 webpack-dev-server@^4.15.1 --save-dev
```
Create an `index.html` file in the root directory of your project. We'll use this file to configure a basic layout that will allow the user to place a 1:1 video call.

Here's the code:
```html
<!-- index.html -->
<!DOCTYPE html>
<html>
    <head>
        <title>Azure Communication Services - Teams Calling Web Application</title>
    </head>
    <body>
        <h4>Azure Communication Services - Teams Calling Web Application</h4>
        <input id="user-access-token"
            type="text"
            placeholder="User access token"
            style="margin-bottom:1em; width: 500px;"/>
        <button id="initialize-teams-call-agent" type="button">Login</button>
        <br>
        <br>
        <input id="callee-teams-user-id"
            type="text"
            placeholder="Microsoft Teams callee's id (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)"
            style="margin-bottom:1em; width: 500px; display: block;"/>
        <button id="start-call-button" type="button" disabled="true">Start Call</button>
        <button id="hangup-call-button" type="button" disabled="true">Hang up Call</button>
        <button id="accept-call-button" type="button" disabled="true">Accept Call</button>
        <button id="start-video-button" type="button" disabled="true">Start Video</button>
        <button id="stop-video-button" type="button" disabled="true">Stop Video</button>
        <br>
        <br>
        <div id="connectedLabel" style="color: #13bb13;" hidden>Call is connected!</div>
        <br>
        <div id="remoteVideoContainer" style="width: 40%;" hidden>Remote participants' video streams:</div>
        <br>
        <div id="localVideoContainer" style="width: 30%;" hidden>Local video stream:</div>
        <!-- points to the bundle generated from client.js -->
        <script src="./main.js"></script>
    </body>
</html>
```

## Azure Communication Services Calling Web SDK Object model

The following classes and interfaces handle some of the main features of the Azure Communication Services Calling SDK:

| Name                                | Description                                                                                                                              |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `CallClient`                        | The main entry point to the Calling SDK.                                                                                                 |
| `AzureCommunicationTokenCredential` | Implements the `CommunicationTokenCredential` interface, which is used to instantiate `teamsCallAgent`.                                       |
| `TeamsCallAgent`                         | Used to start and manage Teams calls.                                                                                                          |
| `DeviceManager`                     | Used to manage media devices.                                                                                                            |
| `TeamsCall`                              | Used for representing a Teams Call                                                                                                              |
| `LocalVideoStream`                  | Used for creating a local video stream for a camera device on the local system.                                                          |
| `RemoteParticipant`                 | Used for representing a remote participant in the Call                                                                                   |
| `RemoteVideoStream`                 | Used for representing a remote video stream from a Remote Participant.        

Create a file in the root directory of your project called `index.js` to contain the application logic for this quickstart. Add the following code to index.js:
```JavaScript
// Make sure to install the necessary dependencies
const { CallClient, VideoStreamRenderer, LocalVideoStream } = require('@azure/communication-calling');
const { AzureCommunicationTokenCredential } = require('@azure/communication-common');
const { AzureLogger, setLogLevel } = require("@azure/logger");
// Set the log level and output
setLogLevel('verbose');
AzureLogger.log = (...args) => {
    console.log(...args);
};
// Calling web sdk objects
let teamsCallAgent;
let deviceManager;
let call;
let incomingCall;
let localVideoStream;
let localVideoStreamRenderer;
// UI widgets
let userAccessToken = document.getElementById('user-access-token');
let calleeTeamsUserId = document.getElementById('callee-teams-user-id');
let initializeCallAgentButton = document.getElementById('initialize-teams-call-agent');
let startCallButton = document.getElementById('start-call-button');
let hangUpCallButton = document.getElementById('hangup-call-button');
let acceptCallButton = document.getElementById('accept-call-button');
let startVideoButton = document.getElementById('start-video-button');
let stopVideoButton = document.getElementById('stop-video-button');
let connectedLabel = document.getElementById('connectedLabel');
let remoteVideoContainer = document.getElementById('remoteVideoContainer');
let localVideoContainer = document.getElementById('localVideoContainer');
/**
 * Create an instance of CallClient. Initialize a TeamsCallAgent instance with a CommunicationUserCredential via created CallClient. TeamsCallAgent enables us to make outgoing calls and receive incoming calls. 
 * You can then use the CallClient.getDeviceManager() API instance to get the DeviceManager.
 */
initializeCallAgentButton.onclick = async () => {
    try {
        const callClient = new CallClient(); 
        tokenCredential = new AzureCommunicationTokenCredential(userAccessToken.value.trim());
        teamsCallAgent = await callClient.createTeamsCallAgent(tokenCredential)
        // Set up a camera device to use.
        deviceManager = await callClient.getDeviceManager();
        await deviceManager.askDevicePermission({ video: true });
        await deviceManager.askDevicePermission({ audio: true });
        // Listen for an incoming call to accept.
        teamsCallAgent.on('incomingCall', async (args) => {
            try {
                incomingCall = args.incomingCall;
                acceptCallButton.disabled = false;
                startCallButton.disabled = true;
            } catch (error) {
                console.error(error);
            }
        });
        startCallButton.disabled = false;
        initializeCallAgentButton.disabled = true;
    } catch(error) {
        console.error(error);
    }
}
/**
 * Place a 1:1 outgoing video call to a user
 * Add an event listener to initiate a call when the `startCallButton` is selected.
 * Enumerate local cameras using the deviceManager `getCameraList` API.
 * In this quickstart, we're using the first camera in the collection. Once the desired camera is selected, a
 * LocalVideoStream instance will be constructed and passed within `videoOptions` as an item within the
 * localVideoStream array to the call method. When the call connects, your application will be sending a video stream to the other participant. 
 */
startCallButton.onclick = async () => {
    try {
        const localVideoStream = await createLocalVideoStream();
        const videoOptions = localVideoStream ? { localVideoStreams: [localVideoStream] } : undefined;
        call = teamsCallAgent.startCall([{ microsoftTeamsUserId: calleeTeamsUserId.value.trim() }], { videoOptions: videoOptions });
        // Subscribe to the call's properties and events.
        subscribeToCall(call);
    } catch (error) {
        console.error(error);
    }
}
/**
 * Accepting an incoming call with a video
 * Add an event listener to accept a call when the `acceptCallButton` is selected.
 * You can accept incoming calls after subscribing to the `TeamsCallAgent.on('incomingCall')` event.
 * You can pass the local video stream to accept the call with the following code.
 */
acceptCallButton.onclick = async () => {
    try {
        const localVideoStream = await createLocalVideoStream();
        const videoOptions = localVideoStream ? { localVideoStreams: [localVideoStream] } : undefined;
        call = await incomingCall.accept({ videoOptions });
        // Subscribe to the call's properties and events.
        subscribeToCall(call);
    } catch (error) {
        console.error(error);
    }
}
// Subscribe to a call obj.
// Listen for property changes and collection udpates.
subscribeToCall = (call) => {
    try {
        // Inspect the initial call.id value.
        console.log(`Call Id: ${call.id}`);
        //Subsribe to call's 'idChanged' event for value changes.
        call.on('idChanged', () => {
            console.log(`Call ID changed: ${call.id}`); 
        });
        // Inspect the initial call.state value.
        console.log(`Call state: ${call.state}`);
        // Subscribe to call's 'stateChanged' event for value changes.
        call.on('stateChanged', async () => {
            console.log(`Call state changed: ${call.state}`);
            if(call.state === 'Connected') {
                connectedLabel.hidden = false;
                acceptCallButton.disabled = true;
                startCallButton.disabled = true;
                hangUpCallButton.disabled = false;
                startVideoButton.disabled = false;
                stopVideoButton.disabled = false;
            } else if (call.state === 'Disconnected') {
                connectedLabel.hidden = true;
                startCallButton.disabled = false;
                hangUpCallButton.disabled = true;
                startVideoButton.disabled = true;
                stopVideoButton.disabled = true;
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
// Listen for property changes and collection udpates.
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
        // notified when the remoteParticiapant adds new videoStreams and removes video streams.
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
hangUpCallButton.addEventListener("click", async () => {
    // end the current call
    await call.hangUp();
});
```


## Add the webpack local server code

Create a file in the root directory of your project called **webpack.config.js** to contain the local server logic for this quickstart. Add the following code to **webpack.config.js**:
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
Use the `webpack-dev-server` to build and run your app. Run the following command to bundle the application host in a local webserver:

```console
`npx webpack serve --config webpack.config.js`
```
Open your browser and on two tabs navigate to http://localhost:8080/. Tabs should show the similar result like the following image:
:::image type="content" source="../../media/javascript/1-on-1-video-calling-a.png" alt-text="Screenshot is showing two tabs in default view. Each tab will be used for different Teams user." lightbox="../../media/javascript/1-on-1-video-calling-a.png":::

On the first tab, enter a valid user access token. On the second tab, enter another different valid user access token. Refer to the [user access token documentation](../../../manage-teams-identity.md) if you don't already have access tokens available to use.
On both tabs, click on the "Initialize Call Agent" buttons. Tabs should show the similar result like the following image:
:::image type="content" source="../../media/javascript/1-on-1-video-calling-b.png" alt-text="Screenshot is showing steps to initialize each Teams user in the browser tab."  lightbox="../../media/javascript/1-on-1-video-calling-b.png":::

On the first tab, enter the Azure Communication Services user identity of the second tab, and select the "Start Call" button. The first tab will start the outgoing call to the second tab, and the second tab's "Accept Call" button becomes enabled:
:::image type="content" source="../../media/javascript/1-on-1-video-calling-c.png" alt-text="Screenshot is showing experience when Teams users initialize the SDK and shows steps to start a call to second user and way how to accept the call." lightbox="../../media/javascript/1-on-1-video-calling-c.png":::

From the second tab, select the "Accept Call" button. The call will be answered and connected. Tabs should show the similar result like the following image:
:::image type="content" source="../../media/javascript/1-on-1-video-calling-d.png" alt-text="Screenshot is showing two tabs, with ongoing call between two Teams users, each logged in the individual tab."  lightbox="../../media/javascript/1-on-1-video-calling-d.png":::

Both tabs are now successfully in a 1:1 video call. Both users can hear each other's audio and see each other video stream.
