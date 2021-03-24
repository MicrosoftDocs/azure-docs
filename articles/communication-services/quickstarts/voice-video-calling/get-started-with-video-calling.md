---
title: Quickstart - Add video calling to your app (JavaScript)
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to add video calling capabilities to your app using Azure Communication Services.
author: xumo-95
ms.author: mikben
ms.date: 03/10/2021
ms.topic: quickstart
ms.service: azure-communication-services
---

# QuickStart: Add 1:1 video calling to your app (JavaScript)

## Download Code

Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/add-1-on-1-video-calling)

## Prerequisites
- Obtain an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/en/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1)
- Create an active Communication Services resource. [Create a Communication Services resource](../create-communication-resource.md?pivots=platform-azp&tabs=windows).
- Create a User Access Token to instantiate the call client. [Learn how to create and manage user access tokens](../access-tokens.md?pivots=programming-language-csharp).

## Setting up
### Create a new Node.js application
Open your terminal or command window create a new directory for your app, and navigate to it.
```console
mkdir calling-quickstart && cd calling-quickstart
```
### Install the package
Use the `npm install` command to install the Azure Communication Services Calling client library for JavaScript.

This quickstart used Azure Communication Calling Client Library `1.0.0.beta-6`. 

```console
npm install @azure/communication-common --save
npm install @azure/communication-calling --save
```
### Set up the app framework

This quickstart uses webpack to bundle the application assets. Run the following command to install the `webpack`, `webpack-cli` and `webpack-dev-server` npm packages and list them as development dependencies in your `package.json`:

```console
npm install webpack@4.42.0 webpack-cli@3.3.11 webpack-dev-server@3.10.3 --save-dev
```
Create an `index.html` file in the root directory of your project. We'll use this file to configure a basic layout that will allow the user to place a 1:1 video call.

Here's the code:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Communication Client - 1:1 Video Calling Sample</title>
</head>

<body>
    <h4>Azure Communication Services</h4>
    <h1>1:1 Video Calling Quickstart</h1>
    <input 
    id="callee-id-input"
    type="text"
    placeholder="Who would you like to call?"
    style="margin-bottom:1em; width: 200px;"
    />

    <div>
    <button id="call-button" type="button" disabled="true">
        start call
    </button>
        &nbsp;
    <button id="hang-up-button" type="button" disabled="true">
        hang up
    </button>
        &nbsp;
    <button id="start-Video" type="button" disabled="true">
        start video
    </button>
        &nbsp;
    <button id="stop-Video" type="button" disabled="true">
        stop video
    </button>     
    </div>

    <div>Local Video</div>
    <div style="height:200px; width:300px; background-color:black; position:relative;">
      <div id="myVideo" style="background-color: black; position:absolute; top:50%; transform: translateY(-50%);">
      </div>     
    </div>
    <div>Remote Video</div>
    <div style="height:200px; width:300px; background-color:black; position:relative;"> 
      <div id="remoteVideo" style="background-color: black; position:absolute; top:50%; transform: translateY(-50%);">
      </div>
    </div>

    <script src="./bundle.js"></script>
</body>
</html>
```

Create a file in the root directory of your project called `client.js` to contain the application logic for this quickstart. Add the following code to import the calling client and get references to the DOM elements.

```JavaScript
import { CallClient, CallAgent, Renderer, LocalVideoStream } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

let call;
let callAgent;
const calleeInput = document.getElementById("callee-id-input");
const callButton = document.getElementById("call-button");
const hangUpButton = document.getElementById("hang-up-button");
const stopVideoButton = document.getElementById("stop-Video");
const startVideoButton = document.getElementById("start-Video");

let placeCallOptions;
let deviceManager;
let localVideoStream;
let rendererLocal;
let rendererRemote;
```
## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling client library:

| Name      | Description | 
| :---        |    :----   |
| CallClient  | The CallClient is the main entry point to the Calling client library.      |
| CallAgent  | The CallAgent is used to start and manage calls.        |
| DeviceManager | The DeviceManager is used to manage media devices.    |
| AzureCommunicationTokenCredential | The AzureCommunicationTokenCredential class implements the CommunicationTokenCredential interface which is used to instantiate the CallAgent.        |

## Authenticate the client and access DeviceManager

You need to replace <USER_ACCESS_TOKEN> with a valid user access token for your resource. Refer to the user access token documentation if you don't already have a token available. Using the CallClient, initialize a CallAgent instance with a CommunicationUserCredential which will enable us to make and receive calls. 
To access the DeviceManager a callAgent instance must first be created. You can then use the `getDeviceManager` method on the `CallClient` instance to get the `DeviceManager`.

Add the following code to `client.js`:

```JavaScript
async function init() {
    const callClient = new CallClient();
    const tokenCredential = new AzureCommunicationTokenCredential("<USER ACCESS TOKEN>");
    callAgent = await callClient.createCallAgent(tokenCredential, { displayName: 'optional ACS user name' });
    
    deviceManager = await callClient.getDeviceManager();
    callButton.disabled = false;
}
init();
```
## Place a 1:1 outgoing video call to a user

Add an event listener to initiate a call when the `callButton` is clicked:

First you have to enumerate local cameras using the deviceManager getCameraList API. In this quickstart we're using the first camera in the collection. Once the desired camera is selected, a LocalVideoStream instance will be constructed and passed within videoOptions as an item within the localVideoStream array to the call method. Once your call connects it will automatically start sending a video stream to the other participant. 

```JavaScript
callButton.addEventListener("click", async () => {
    const videoDevices = await deviceManager.getCameras();
    const videoDeviceInfo = videoDevices[0];
    localVideoStream = new LocalVideoStream(videoDeviceInfo);
    placeCallOptions = {videoOptions: {localVideoStreams:[localVideoStream]}};

    localVideoView();
    stopVideoButton.disabled = false;
    startVideoButton.disabled = true;

    const userToCall = calleeInput.value;
    call = callAgent.startCall(
        [{ communicationUserId: userToCall }],
        placeCallOptions
    );

    subscribeToRemoteParticipantInCall(call);

    hangUpButton.disabled = false;
    callButton.disabled = true;
});
```  
To render a `LocalVideoStream`, you need to create a new instance of `Renderer`, and then create a new RendererView instance using the asynchronous `createView` method. You may then attach `view.target` to any UI element. 

```JavaScript
async function localVideoView() {
    rendererLocal = new Renderer(localVideoStream);
    const view = await rendererLocal.createView();
    document.getElementById("myVideo").appendChild(view.target);
}
```
All remote participants are available through the `remoteParticipants` collection on a call instance. You need to subscribe to the remote participants of the current call and listen to the event `remoteParticipantsUpdated` to subscribe to added remote participants.

```JavaScript
function subscribeToRemoteParticipantInCall(callInstance) {
    callInstance.remoteParticipants.forEach( p => {
        subscribeToRemoteParticipant(p);
    })
    callInstance.on('remoteParticipantsUpdated', e => {
        e.added.forEach( p => {
            subscribeToRemoteParticipant(p);
        })
    });   
}
```
You can subscribe to the `remoteParticipants` collection of the current call and inspect the `videoStreams` collections to list the streams of each participant. You also need to subscribe to the remoteParticipantsUpdated event to handle added remote participants. 

```JavaScript
function subscribeToRemoteParticipant(remoteParticipant) {
    remoteParticipant.videoStreams.forEach(v => {
        handleVideoStream(v);
    });
    remoteParticipant.on('videoStreamsUpdated', e => {
        e.added.forEach(v => {
            handleVideoStream(v);
        })
    });
}
```
You have to subscribe to a `isAvailableChanged` event to render the `remoteVideoStream`. If the `isAvailable` property changes to `true`, a remote participant is sending a stream. Whenever availability of a remote stream changes you can choose to destroy the whole `Renderer`, a specific `RendererView` or keep them, but this will result in displaying blank video frame.
```JavaScript
function handleVideoStream(remoteVideoStream) {
    remoteVideoStream.on('availabilityChanged', async () => {
        if (remoteVideoStream.isAvailable) {
            remoteVideoView(remoteVideoStream);
        } else {
            rendererRemote.dispose();
        }
    });
    if (remoteVideoStream.isAvailable) {
        remoteVideoView(remoteVideoStream);
    }
}
```
To render a `RemoteVideoStream`, you need to create a new instance of `Renderer`, and then create a new `RendererView` instance using the asynchronous `createView` method. You may then attach `view.target` to any UI element. 

```JavaScript
async function remoteVideoView(remoteVideoStream) {
    rendererRemote = new Renderer(remoteVideoStream);
    const view = await rendererRemote.createView();
    document.getElementById("remoteVideo").appendChild(view.target);
}
```
## Receive an incoming call
To handle incoming calls you need to listen to the `incomingCall` event of `callAgent`. Once there is an incoming call, you need to enumerate local cameras and construct a `LocalVideoStream` instance to send a video stream to the other participant. You also need to subscribe to `remoteParticipants` to handle remote video streams. You can accept or reject the call through the `incomingCall` instance. 

Put the implementation in `init()` to handle incoming calls. 

```JavaScript
callAgent.on('incomingCall', async e => {
    const videoDevices = await deviceManager.getCameras();
    const videoDeviceInfo = videoDevices[0];
    localVideoStream = new LocalVideoStream(videoDeviceInfo);
    localVideoView();

    stopVideoButton.disabled = false;
    callButton.disabled = true;
    hangUpButton.disabled = false;

    const addedCall = await e.incomingCall.accept({videoOptions: {localVideoStreams:[localVideoStream]}});
    call = addedCall;

    subscribeToRemoteParticipantInCall(addedCall);   
});
```
## End the current call
Add an event listener to end the current call when the `hangUpButton` is clicked:
```JavaScript
hangUpButton.addEventListener("click", async () => {
    // dispose of the renderers
    rendererLocal.dispose();
    rendererRemote.dispose();
    // end the current call
    await call.hangUp();
    // toggle button states
    hangUpButton.disabled = true;
    callButton.disabled = false;
    stopVideoButton.disabled = true;
});
```
## Subscribe to call updates
You need to subscribe to the event when the remote participant ends the call to dispose of video renderers and toggle button states. 

Put the implementation in init() to subscribe to the `callsUpdated` event. 
 ```JavaScript 
callAgent.on('callsUpdated', e => {
    e.removed.forEach(removedCall => {
        // dispose of video renders
        rendererLocal.dispose();
        rendererRemote.dispose();
        // toggle button states
        hangUpButton.disabled = true;
        callButton.disabled = false;
        stopVideoButton.disabled = true;
    })
})
```

## Start and end video during the call
You can stop the video during the current call by adding an event listener to the Stop Video button to dispose of the renderer of `localVideoStream`. 
 ```JavaScript       
stopVideoButton.addEventListener("click", async () => {
    await call.stopVideo(localVideoStream);
    rendererLocal.dispose();
    startVideoButton.disabled = false;
    stopVideoButton.disabled = true;
});
```
You can add an event listener to the Start Video button to turn the video back on when it was stopped during the current call. 
```JavaScript
startVideoButton.addEventListener("click", async () => {
    await call.startVideo(localVideoStream);
    localVideoView();
    stopVideoButton.disabled = false;
    startVideoButton.disabled = true;
});
```
## Run the code
Use the `webpack-dev-server` to build and run your app. Run the following command to bundle application host in on a local webserver:

```console
npx webpack-dev-server --entry ./client.js --output bundle.js --debug --devtool inline-source-map
```
Open your browser and navigate to http://localhost:8080/. You should see the following:

:::image type="content" source="./media/javascript/1-on-1-video-calling.png" alt-text="1 on 1 video calling page":::

You can make an 1:1 outgoing video call by providing a user ID in the text field and clicking the Start Call button. 

## Sample Code
You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/add-1-on-1-video-calling).

## Clean up resources
If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md?pivots=platform-azp&tabs=windows#clean-up-resources).

## Next steps
For more information, see the following articles:
- Check out our [web calling sample](../../samples/web-calling-sample.md)
- Learn about [calling client library capabilities](./calling-client-samples.md?pivots=platform-web)
- Learn more about [how calling works](../../concepts/voice-video-calling/about-call-types.md)