---
title: Tutorial - Migrating from Twilio video to ACS
titleSuffix: An Azure Communication Services tutorial
description: In this tutorial, you learn how to migrate your calling product from Twilio to Azure Communication Services.
author: sloanster
services: azure-communication-services

ms.author: micahvivion
ms.date: 01/26/2024
ms.topic: how-to
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: template-how-to
---

# Migration Guide from Twilio Video to Azure Communication Services

This article provides guidance on how to migrate your existing Twilio Video implementation to the [Azure Communication Services' Calling SDK](../concepts/voice-video-calling/calling-sdk-features.md) for WebJS. Twilio Video and Azure Communication Services' calling SDK for WebJS are both cloud-based platforms that enable developers to add voice and video calling features to their web applications. However, there are some key differences between them that may affect your choice of platform or require some changes to your existing code if you decide to migrate. In this article, we will compare the main features and functionalities of both platforms and provide some guidance on how to migrate your existing Twilio Video implementation to Azure Communication Services' Calling SDK for WebJS.

## Key features of the Azure Communication Services calling SDK

-  Addressing - Azure Communication Services provides [identities](../concepts/identity-model.md) for authentication and addressing communication endpoints. These identities are used within Calling APIs, providing clients with a clear view of who is connected to a call (the roster).
-  Encryption - The Calling SDK safeguards traffic by encrypting it and preventing tampering along the way.
-  Device Management and Media - The SDK handles the management of audio and video devices, efficiently encodes content for transmission, and supports both screen and application sharing.
-  PSTN - The SDK can initiate voice calls with the traditional Public Switched Telephone Network (PSTN), [using phone numbers acquired either in the Azure portal](../quickstarts/telephony/get-phone-number.md) or programmatically.
-  Teams Meetings – Azure Communication Services is equipped to [join Teams meetings](../quickstarts/voice-video-calling/get-started-teams-interop.md) and interact with Teams voice and its video calls.
-  Notifications - Azure Communication Services provides APIs for notifying clients of incoming calls, allowing your application to listen to events (for example, incoming calls) even when your application is not running in the foreground.
-  User Facing Diagnostics (UFD) - Azure Communication Services utilizes [events](../concepts/voice-video-calling/user-facing-diagnostics.md) designed to provide insights into underlying issues that could affect call quality, allowing developers to subscribe to triggers such as weak network signals or muted microphones for proactive issue awareness.
-  Media Statics - Provides comprehensive insights into VoIP and video call [metrics](../concepts/voice-video-calling/media-quality-sdk.md), including call quality information, empowering developers to enhance communication experiences.
-  Video Constraints - Azure Communication Services offers APIs that control [video quality among other parameters](../quickstarts/voice-video-calling/get-started-video-constraints.md) during video calls. By adjusting parameters like resolution and frame rate, the SDK supports different call situations for varied levels of video quality.

**For a more detailed understanding of the capabilities of the Calling SDK for different platforms, consult** [**this document**](../concepts/voice-video-calling/calling-sdk-features.md#detailed-capabilities)**.**

If you're embarking on a new project from the ground up, see the [Quickstarts of the Calling SDK](../quickstarts/voice-video-calling/get-started-with-video-calling.md?pivots=platform-web).

**Prerequisites:**

1.  **Azure Account:** Confirm that you have an active subscription in your Azure account. New users can create a free Azure account [here](https://azure.microsoft.com/free/).
2.  **Node.js 18:** Ensure Node.js 18 is installed on your system; download can be found right [here](https://nodejs.org/en).
3.  **Communication Services Resource:** Set up a [Communication Services Resource](../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp) via your Azure portal and note down your connection string.
4.  **Azure CLI:** You can get the Azure CLI installer from [here](/cli/azure/install-azure-cli-windows?tabs=azure-cli)..
5.  **User Access Token:** Generate a user access token to instantiate the call client. You can create one using the Azure CLI as follows:
```console
az communication identity token issue --scope voip --connection-string "yourConnectionString"
```

For more information, see the guide on how to [Use Azure CLI to Create and Manage Access Tokens](../quickstarts/identity/access-tokens.md?pivots=platform-azcli).

For Video Calling as a Teams user:

-   You also can use Teams identity. For instructions on how to generate an access token for a Teams User, [follow this guide](../quickstarts/manage-teams-identity.md?pivots=programming-language-javascript).
-   Obtain the Teams thread ID for call operations using the [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer). Additional information on how to create a chat thread ID can be found [here](/graph/api/chat-post?preserve-view=true&tabs=javascript&view=graph-rest-1.0#example-2-create-a-group-chat).

### UI library

The UI Library simplifies the process of creating modern communication user interfaces using Azure Communication Services. It offers a collection of ready-to-use UI components that you can easily integrate into your application.

This prebuilt set of controls facilitates the creation of aesthetically pleasing designs using [Fluent UI SDK](https://developer.microsoft.com/en-us/fluentui#/) components and the development of audio/video communication experiences. If you wish to explore more about the UI Library, check out the [overview page](../concepts/ui-library/ui-library-overview.md), where you find comprehensive information about both web and mobile platforms.

### Calling support

The Azure Communication Services Calling SDK supports the following streaming configurations:

| Limit                                                                     | Web                                                                                                   | Windows/Android/iOS         |
|---------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|-----------------------------|
| Maximum \# of outgoing local streams that can be sent simultaneously      | 1 video and 1 screen sharing                                                                          | 1 video + 1 screen sharing  |
| Maximum \# of incoming remote streams that can be rendered simultaneously | 9 videos + 1 screen sharing on desktop browsers\*, 4 videos + 1 screen sharing on web mobile browsers | 9 videos + 1 screen sharing |

## Call Types in Azure Communication Services

Azure Communication Services offers various call types. The type of call you choose impacts your signaling schema, the flow of media traffic, and your pricing model. Further details can be found [here](../concepts/voice-video-calling/about-call-types.md).

-   Voice Over IP (VoIP) - This type of call involves one user of your application calling another over an internet or data connection. Both signaling and media traffic are routed over the internet.
-   Public Switched Telephone Network (PSTN) - When your users interact with a traditional telephone number, calls are facilitated via PSTN voice calling. In order to make and receive PSTN calls, you need to introduce telephony capabilities to your Azure Communication Services resource. Here, signaling and media employ a mix of IP-based and PSTN-based technologies to connect your users.
-   One-to-One Call - When one of your users connects with another through our SDKs. The call can be established via either VoIP or PSTN.
-   Group Call - Involved when three or more participants connect. Any combination of VoIP and PSTN-connected users can partake in a group call. A one-to-one call can evolve into a group call by adding more participants to the call, and one of these participants can be a bot.
-   Rooms Call - A Room acts as a container that manages activity between end-users of Azure Communication Services. It provides application developers with enhanced control over who can join a call, when they can meet, and how they collaborate. For a more comprehensive understanding of Rooms, please refer to the [conceptual documentation](../concepts/rooms/room-concept.md).

## Installation

### Install the Azure Communication Services calling SDK

Use the `npm install` command to install the Azure Communication Services Calling SDK for JavaScript.
```console
npm install @azure/communication-common npm install @azure/communication-calling
```

### Remove the Twilio SDK from the project

You can remove the Twilio SDK from your project by uninstalling the package
```console
npm uninstall twilio-video
```

## Object model

The following classes and interfaces handle some of the main features of the Azure Communication Services Calling SDK:

| **Name**                          | **Description**                                                                                                                                                                        |
|-----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| CallClient                        | The main entry point to the Calling SDK.                                                                                                                                               |
| AzureCommunicationTokenCredential | Implements the CommunicationTokenCredential interface, which is used to instantiate the CallAgent.                                                                                     |
| CallAgent                         | Used to start and manage calls.                                                                                                                                                        |
| Device Manager                    | Used to manage media devices.                                                                                                                                                          |
| Call                              | Used for representing a Call.                                                                                                                                                          |
| LocalVideoStream                  | Used for creating a local video stream for a camera device on the local system.                                                                                                        |
| RemoteParticipant                 | Used for representing a remote participant in the Call.                                                                                                                                |
| RemoteVideoStream                 | Used for representing a remote video stream from a Remote Participant.                                                                                                                 |
| LocalAudioStream                  | Represents a local audio stream for a local microphone device                                                                                                                          |
| AudioOptions                      | Audio options, which are provided when making an outgoing call or joining a group call                                                                                                  |
| AudioIssue                        | Represents the end of call survey audio issues, example responses would be NoLocalAudio - the other participants were unable to hear me, or LowVolume - the call’s audio volume was low |

When using in a Teams implementation there are a few differences:

-   Instead of `CallAgent` - use `TeamsCallAgent` for starting and managing Teams calls.
-   Instead of `Call` - use `TeamsCall` for representing a Teams Call.

## Initialize the Calling SDK (CallClient/CallAgent)

Using the `CallClient`, initialize a `CallAgent` instance. The `createCallAgent` method uses CommunicationTokenCredential as an argument. It accepts a [user access token](../quickstarts/identity/access-tokens.md?tabs=windows&pivots=programming-language-javascript).

### Device manager

#### Twilio

Twilio doesn't have a Device Manager analog, tracks are being created using the system’s default device. For customization, you should obtain the desired source track via:
```javascript
navigator.mediaDevices.getUserMedia()
```

And pass it to the track creation method.

#### Azure Communication Services
```javascript
const { CallClient } = require('@azure/communication-calling');  
const { AzureCommunicationTokenCredential} = require('@azure/communication-common'); 

const userToken = '<USER_TOKEN>';  
const tokenCredential = new AzureCommunicationTokenCredential(userToken); 

callClient = new CallClient(); 
const callAgent = await callClient.createCallAgent(tokenCredential, {displayName: 'optional user name'});
```

You can use the getDeviceManager method on the CallClient instance to access deviceManager.

```javascript
const deviceManager = await callClient.getDeviceManager(); 
// Get a list of available video devices for use.  
const localCameras = await deviceManager.getCameras(); 

// Get a list of available microphone devices for use.  
const localMicrophones = await deviceManager.getMicrophones();  

// Get a list of available speaker devices for use.  
const localSpeakers = await deviceManager.getSpeakers();
```

### Get device permissions

#### Twilio

Twilio Video asks for device permissions on track creation.

#### Azure Communication Services

Prompt a user to grant camera and/or microphone permissions:
```javascript
const result = await deviceManager.askDevicePermission({audio: true, video: true});
```

The output returns with an object that indicates whether audio and video permissions were granted:
```javascript
console.log(result.audio);  console.log(result.video);
```

## Starting a call

### Twilio

```javascript
import * as TwilioVideo from 'twilio-video';

const twilioVideo = TwilioVideo; 
let twilioRoom; 

twilioRoom = await twilioVideo.connect('token', { name: 'roomName', audio: false, video: false });
```

### Azure Communication Services

To create and start a call, use one of the APIs on `callAgent` and provide a user that you created through the Communication Services identity SDK.

Call creation and start are synchronous. The `call` instance allows you to subscribe to call events - subscribe to `stateChanged` event for value changes.
```javascript
call.on('stateChanged', async () =\> {  console.log(\`Call state changed: \${call.state}\`) });
``````

### Azure Communication Services 1:1 Call

To call another Communication Services user, use the `startCall` method on `callAgent` and pass the recipient's CommunicationUserIdentifier that you [created with the Communication Services administration library](../quickstarts/identity/access-tokens.md).
```javascript
const userCallee = { communicationUserId: '\<Azure_Communication_Services_USER_ID\>' };
const oneToOneCall = callAgent.startCall([userCallee]);
```

### Azure Communication Services Room Call

To join a `room` call, you can instantiate a context object with the `roomId` property as the room identifier. To join the call, use the join method and pass the context instance.
```javascript
const context = { roomId: '\<RoomId\>' };
const call = callAgent.join(context);
```
A **room** offers application developers better control over who can join a call, when they meet and how they collaborate. To learn more about **rooms**, you can read the [conceptual documentation](../concepts/rooms/room-concept.md) or follow the [quick start guide](../quickstarts/rooms/join-rooms-call.md).

### Azure Communication Services group Call

To start a new group call or join an ongoing group call, use the `join` method and pass an object with a groupId property. The `groupId` value has to be a GUID.
```javascript
const context = { groupId: '\<GUID\>'};
const call = callAgent.join(context);
```

### Azure Communication Services Teams call

Start a synchronous one-to-one or group call with `startCall` API on `teamsCallAgent`. You can provide `MicrosoftTeamsUserIdentifier` or `PhoneNumberIdentifier` as a parameter to define the target of the call. The method returns the `TeamsCall` instance that allows you to subscribe to call events.
```javascript
const userCallee = { microsoftTeamsUserId: '\<MICROSOFT_TEAMS_USER_ID\>' };
const oneToOneCall = teamsCallAgent.startCall(userCallee);
```

## Accepting and joining a call

### Twilio

The Twilio Video SDK the Participant is being created after joining the room, and it doesn't have any information about other rooms.

### Azure Communication Services

Azure Communication Services has the `CallAgent` instance, which emits an `incomingCall` event when the logged-in identity receives an incoming call.
```javascript
callAgent.on('incomingCall', async (call) =\>{
    // Incoming call
    });
```

The `incomingCall` event includes an `incomingCall` instance that you can accept or reject.

When starting/joining/accepting a call with video on, if the specified video camera device is being used by another process or if it's disabled in the system, the call starts with video off, and a `cameraStartFailed:` true call diagnostic will be raised.

```javascript
const incomingCallHandler = async (args: { incomingCall: IncomingCall }) => {  
  const incomingCall = args.incomingCall;  

  // Get incoming call ID  
  var incomingCallId = incomingCall.id  

  // Get information about this Call. This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of Azure Communication Services Calling Web SDK  
  var callInfo = incomingCall.info;  

  // Get information about caller  
  var callerInfo = incomingCall.callerInfo  
    
  // Accept the call  
  var call = await incomingCall.accept();  

  // Reject the call  
  incomingCall.reject();  

  // Subscribe to callEnded event and get the call end reason  
  incomingCall.on('callEnded', args =>  
  	{ console.log(args.callEndReason);  
  });  

  // callEndReason is also a property of IncomingCall  
  var callEndReason = incomingCall.callEndReason;  
};  

callAgentInstance.on('incomingCall', incomingCallHandler);

```

After starting a call, joining a call, or accepting a call, you can also use the callAgents' `callsUpdated` event to be notified of the new Call object and start subscribing to it.
```javascript
callAgent.on('callsUpdated', (event) => { 
  event.added.forEach((call) => { 
    // User joined call 
  }); 
  
  event.removed.forEach((call) => { 
    // User left call 
  }); 
});
```

For Azure Communication Services Teams implementation, check how to [Receive a Teams Incoming Call](../how-tos/cte-calling-sdk/manage-calls.md#receive-a-teams-incoming-call).

## Adding participants to call

### Twilio

Participants can't be added or removed from Twilio Room, they need to join the Room or disconnect from it themselves.

Local Participant in Twilio Room can be accessed this way:
```javascript
let localParticipant = twilioRoom.localParticipant;
```

Remote Participants in Twilio Room are represented with a map that has unique Participant SID as a key:
```javascript
twilioRoom.participants;
```

### Azure Communication Services

All remote participants are represented by `RemoteParticipant` type and available through `remoteParticipants` collection on a call instance.

The `remoteParticipants` collection returns a list of remote participants in a call:
```javascript
call.remoteParticipants; // [remoteParticipant, remoteParticipant....]
```

**Add participant:**

To add a participant to a call, you can use `addParticipant`. Provide one of the Identifier types. It synchronously returns the remoteParticipant instance.

The `remoteParticipantsUpdated` event from Call is raised when a participant is successfully added to the call.
```javascript
const userIdentifier = { communicationUserId: '<Azure_Communication_Services_USER_ID>' }; 
const remoteParticipant = call.addParticipant(userIdentifier);
```

**Remove participant:**

To remove a participant from a call, you can invoke `removeParticipant`. You have to pass one of the Identifier types. This method resolves asynchronously after the participant is removed from the call. The participant is also removed from the `remoteParticipants` collection.
```javascript
const userIdentifier = { communicationUserId: '<Azure_Communication_Services_USER_ID>' }; 
await call.removeParticipant(userIdentifier);

```

Subscribe to the call's `remoteParticipantsUpdated` event to be notified when new participants are added to the call or removed from the call.

```javascript
call.on('remoteParticipantsUpdated', e => {
    e.added.forEach(remoteParticipant => {
        // Subscribe to new remote participants that are added to the call
    });
 
    e.removed.forEach(remoteParticipant => {
        // Unsubscribe from participants that are removed from the call
    })

});
```

Subscribe to remote participant's `stateChanged` event for value changes.
```javascript
remoteParticipant.on('stateChanged', () => {
    console.log(`Remote participants state changed: ${remoteParticipant.state}`)
});
```

## Video

### Starting and stopping video

#### Twilio

```javascript
const videoTrack = await twilioVideo.createLocalVideoTrack({ constraints }); 
const videoTrackPublication = await localParticipant.publishTrack(videoTrack, { options });
```

Camera is enabled by default, however it can be disabled and enabled back if necessary:
```javascript
videoTrack.disable();
```
Or
```javascript
videoTrack.enable();
```

Later created video track should be attached locally:

```javascript
const videoElement = videoTrack.attach();
const localVideoContainer = document.getElementById( localVideoContainerId );
localVideoContainer.appendChild(videoElement);

```

Twilio Tracks rely on default input devices and reflect the changes in defaults. However, to change an input device, the previous Video Track should be unpublished:

```javascript
localParticipant.unpublishTrack(videoTrack);
```

And a new Video Track with the correct constraints should be created.

#### Azure Communication Services
To start a video while on a call, you have to enumerate cameras using the getCameras method on the `deviceManager` object. Then create a new instance of `LocalVideoStream` with the desired camera and then pass the `LocalVideoStream` object into the `startVideo` method of an existing call object:

```javascript
const deviceManager = await callClient.getDeviceManager();
const cameras = await deviceManager.getCameras();
const camera = cameras[0]
const localVideoStream = new LocalVideoStream(camera);
await call.startVideo(localVideoStream);
```

After you successfully start sending video, a LocalVideoStream instance of type Video is added to the localVideoStreams collection on a call instance.
```javascript
const localVideoStream = call.localVideoStreams.find( (stream) =\> { return stream.mediaStreamType === 'Video'} );
```

To stop local video while on a call, pass the localVideoStream instance that's being used for video:
```javascript
await call.stopVideo(localVideoStream);
```

You can switch to a different camera device while a video is sending by invoking switchSource on a localVideoStream instance:

```javascript
const cameras = await callClient.getDeviceManager().getCameras();
const camera = cameras[1];
localVideoStream.switchSource(camera);
```

If the specified video device is being used by another process, or if it's disabled in the system:

-   While in a call, if your video is off and you start video using call.startVideo(), this method throws a `SourceUnavailableError` and `cameraStartFailed` will be set to true.
-   A call to the `localVideoStream.switchSource()` method causes `cameraStartFailed` to be set to true. Our [Call Diagnostics guide](../concepts/voice-video-calling/call-diagnostics.md) provides additional information on how to diagnose call related issues.

To verify if the local video is on or off you can use `isLocalVideoStarted` API, which returns true or false:
```javascript
call.isLocalVideoStarted;
```

To listen for changes to the local video, you can subscribe and unsubscribe to the `isLocalVideoStartedChanged` event

```javascript
// Subscribe to local video event
call.on('isLocalVideoStartedChanged', () => {
    // Callback();
});
// Unsubscribe from local video event
call.off('isLocalVideoStartedChanged', () => {
    // Callback();
});

```

### Rendering a remote user video

#### Twilio

As soon as a Remote Participant publishes a Video Track, it needs to be attached. `trackSubscribed` event on Room or Remote Participant allows you to detect when the track can be attached:

```javascript
twilioRoom.on('participantConneted', (participant) => {
 participant.on('trackSubscribed', (track) => {
   const remoteVideoElement = track.attach();
   const remoteVideoContainer = document.getElementById(remoteVideoContainerId + participant.identity);
   remoteVideoContainer.appendChild(remoteVideoElement);
 });
});
```

Or

```javascript
twilioRoom..on('trackSubscribed', (track, publication, participant) => {
   const remoteVideoElement = track.attach();
   const remoteVideoContainer = document.getElementById(remoteVideoContainerId + participant.identity);
   remoteVideoContainer.appendChild(remoteVideoElement);
 });
});
```

#### Azure Communication Services

To list the video streams and screen sharing streams of remote participants, inspect the `videoStreams` collections:
```javascript
const remoteVideoStream: RemoteVideoStream = call.remoteParticipants[0].videoStreams[0];
const streamType: MediaStreamType = remoteVideoStream.mediaStreamType;
```

To render `RemoteVideoStream`, you have to subscribe to its `isAvailableChanged` event. If the `isAvailable` property changes to true, a remote participant is sending a stream. After that happens, create a new instance of `VideoStreamRenderer`, and then create a new `VideoStreamRendererView` instance by using the asynchronous createView method. You can then attach `view.target` to any UI element.

Whenever availability of a remote stream changes, you can destroy the whole `VideoStreamRenderer` or a specific `VideoStreamRendererView`. If you do decide to keep them it will result in displaying a blank video frame.

```javascript
// Reference to the html's div where we would display a grid of all remote video streams from all participants.
let remoteVideosGallery = document.getElementById('remoteVideosGallery');

subscribeToRemoteVideoStream = async (remoteVideoStream) => {
   let renderer = new VideoStreamRenderer(remoteVideoStream);
    let view;
    let remoteVideoContainer = document.createElement('div');
    remoteVideoContainer.className = 'remote-video-container';

    let loadingSpinner = document.createElement('div');
    // See the css example below for styling the loading spinner.
    loadingSpinner.className = 'loading-spinner';
    remoteVideoStream.on('isReceivingChanged', () => {
        try {
            if (remoteVideoStream.isAvailable) {
                const isReceiving = remoteVideoStream.isReceiving;
                const isLoadingSpinnerActive = remoteVideoContainer.contains(loadingSpinner);
                if (!isReceiving && !isLoadingSpinnerActive) {
                    remoteVideoContainer.appendChild(loadingSpinner);
                } else if (isReceiving && isLoadingSpinnerActive) {
                    remoteVideoContainer.removeChild(loadingSpinner);
                }
            }
        } catch (e) {
            console.error(e);
        }
    });

    const createView = async () => {
        // Create a renderer view for the remote video stream.
        view = await renderer.createView();
        // Attach the renderer view to the UI.
        remoteVideoContainer.appendChild(view.target);
        remoteVideosGallery.appendChild(remoteVideoContainer);
    }

    // Remote participant has switched video on/off
    remoteVideoStream.on('isAvailableChanged', async () => {
        try {
            if (remoteVideoStream.isAvailable) {
                await createView();
            } else {
                view.dispose();
                remoteVideosGallery.removeChild(remoteVideoContainer);
            }
        } catch (e) {
            console.error(e);
        }
    });

    // Remote participant has video on initially.
    if (remoteVideoStream.isAvailable) {
        try {
            await createView();
        } catch (e) {
            console.error(e);
        }
    }
    
    console.log(`Initial stream size: height: ${remoteVideoStream.size.height}, width: ${remoteVideoStream.size.width}`);
    remoteVideoStream.on('sizeChanged', () => {
        console.log(`Remote video stream size changed: new height: ${remoteVideoStream.size.height}, new width: ${remoteVideoStream.size.width}`);
    });
}

```

Subscribe to the remote participant's videoStreamsUpdated event to be notified when the remote participant adds new video streams and removes video streams.

```javascript
remoteParticipant.on('videoStreamsUpdated', e => {
    e.added.forEach(remoteVideoStream => {
        // Subscribe to new remote participant's video streams
    });

    e.removed.forEach(remoteVideoStream => {
        // Unsubscribe from remote participant's video streams
    });
});

```

### Virtual background

#### Twilio

To use Virtual Background, Twilio helper library should be installed:
```console
npm install @twilio/video-processors
```

New Processor instance should be created and loaded:

```javascript
import { GaussianBlurBackgroundProcessor } from '@twilio/video-processors';

const blurProcessor = new GaussianBlurBackgroundProcessor({ assetsPath: virtualBackgroundAssets });

await blurProcessor.loadModel();
```
As soon as the model is loaded the background can be added to the video track via addProcessor method:
```javascript
videoTrack.addProcessor(processor, {  inputFrameBufferType: 'video',  outputFrameBufferContextType: 'webgl2' });
```


#### Azure Communication Services

Use the npm install command to install the Azure Communication Services Effects SDK for JavaScript.
```console
npm install @azure/communication-calling-effects --save
```

> [!NOTE]
> To use video effects with the Azure Communication Calling SDK, once you've created a LocalVideoStream, you need to get the VideoEffects feature API of the LocalVideoStream to start/stop video effects:

```javascript
import * as AzureCommunicationCallingSDK from '@azure/communication-calling'; 

import { BackgroundBlurEffect, BackgroundReplacementEffect } from '@azure/communication-calling-effects'; 

// Get the video effects feature API on the LocalVideoStream 
// (here, localVideoStream is the LocalVideoStream object you created while setting up video calling)
const videoEffectsFeatureApi = localVideoStream.feature(AzureCommunicationCallingSDK.Features.VideoEffects); 

// Subscribe to useful events 
videoEffectsFeatureApi.on(‘effectsStarted’, () => { 
    // Effects started
});

videoEffectsFeatureApi.on(‘effectsStopped’, () => { 
    // Effects stopped
}); 

videoEffectsFeatureApi.on(‘effectsError’, (error) => { 
    // Effects error
});
```

To blur the background:

```javascript
// Create the effect instance 
const backgroundBlurEffect = new BackgroundBlurEffect(); 

// Recommended: Check support 
const backgroundBlurSupported = await backgroundBlurEffect.isSupported(); 

if (backgroundBlurSupported) { 
    // Use the video effects feature API we created to start effects
    await videoEffectsFeatureApi.startEffects(backgroundBlurEffect); 
}
```

For background replacement with an image you need to provide the URL of the image you want as the background to this effect. Currently supported image formats are: png, jpg, jpeg, tiff, bmp, and current supported aspect ratio is 16:9

```javascript
const backgroundImage = 'https://linkToImageFile'; 

// Create the effect instance 
const backgroundReplacementEffect = new BackgroundReplacementEffect({ 
    backgroundImageUrl: backgroundImage
}); 

// Recommended: Check support
const backgroundReplacementSupported = await backgroundReplacementEffect.isSupported(); 

if (backgroundReplacementSupported) { 
    // Use the video effects feature API as before to start/stop effects 
    await videoEffectsFeatureApi.startEffects(backgroundReplacementEffect); 
}
```

Changing the image for this effect can be done by passing it via the configured method:
```javascript
const newBackgroundImage = 'https://linkToNewImageFile'; 

await backgroundReplacementEffect.configure({ 
    backgroundImageUrl: newBackgroundImage
});
```

Switching effects can be done using the same method on the video effects feature API:

```javascript
// Switch to background blur 
await videoEffectsFeatureApi.startEffects(backgroundBlurEffect); 

// Switch to background replacement 
await videoEffectsFeatureApi.startEffects(backgroundReplacementEffect);
```

At any time if you want to check what effects are active, you can use the `activeEffects` property. The `activeEffects` property returns an array with the names of the currently active effects and returns an empty array if there are no affects active.
```javascript
// Using the video effects feature API
const currentActiveEffects = videoEffectsFeatureApi.activeEffects;
```

To stop effects:
```javascript
await videoEffectsFeatureApi.stopEffects();
```


## Audio

### Starting and stopping audio

#### Twilio

```javascript
const audioTrack = await twilioVideo.createLocalAudioTrack({ constraints });
const audioTrackPublication = await localParticipant.publishTrack(audioTrack, { options });
```

Microphone is enabled by default, however it can be disabled and enabled back if necessary:
```javascript
audioTrack.disable();
```

Or
```javascript
audioTrack.enable();
```

Created Audio Track should be attached by Local Participant the same way as Video Track:

```javascript
const audioElement = audioTrack.attach();
const localAudioContainer = document.getElementById(localAudioContainerId);
localAudioContainer.appendChild(audioElement);
```

And by Remote Participant:

```javascript
twilioRoom.on('participantConneted', (participant) => {
 participant.on('trackSubscribed', (track) => {
   const remoteAudioElement = track.attach();
   const remoteAudioContainer = document.getElementById(remoteAudioContainerId + participant.identity);
   remoteAudioContainer.appendChild(remoteAudioElement);
 });
});
```

Or

```javascript
twilioRoom..on('trackSubscribed', (track, publication, participant) => {
   const remoteAudioElement = track.attach();
   const remoteAudioContainer = document.getElementById(remoteAudioContainerId + participant.identity);
   remoteVideoContainer.appendChild(remoteAudioElement);
 });
});

```

It is impossible to mute incoming audio in Twilio Video SDK.

#### Azure Communication Services

```javascript
await call.startAudio();
```

To mute or unmute the local endpoint, you can use the mute and unmute asynchronous APIs:

```javascript
//mute local device (microphone / sent audio)
await call.mute();

//unmute local device (microphone / sent audio)
await call.unmute();
```

Mute incoming audio sets the call volume to 0. To mute or unmute the incoming audio, use the `muteIncomingAudio` and `unmuteIncomingAudio` asynchronous APIs:

```javascript
//mute local device (speaker)
await call.muteIncomingAudio();

//unmute local device (speaker)
await call.unmuteIncomingAudio();

```

### Detecting Dominant speaker

#### Twilio

To detect the loudest Participant in the Room, Dominant Speaker API can be used. It can be enabled in the connection options when joining the Group Room with at least 2 participants:
```javascript
twilioRoom = await twilioVideo.connect('token', { 
name: 'roomName', 
audio: false, 
video: false,
dominantSpeaker: true
}); 
```

When the loudest speaker in the Room will change, the dominantSpeakerChanged event is emitted:

```javascript
twilioRoom.on('dominantSpeakerChanged', (participant) => {
    // Highlighting the loudest speaker
});
```

#### Azure Communication Services

Dominant speakers for a call are an extended feature of the core Call API and allows you to obtain a list of the active speakers in the call. This is a ranked list, where the first element in the list represents the last active speaker on the call and so on.

In order to obtain the dominant speakers in a call, you first need to obtain the call dominant speakers feature API object:
```javascript
const callDominantSpeakersApi = call.feature(Features.CallDominantSpeakers);
```

Next you can obtain the list of the dominant speakers by calling `dominantSpeakers`. This has a type of `DominantSpeakersInfo`, which has the following members:

-   `speakersList` contains the list of the ranked dominant speakers in the call. These are represented by their participant ID.
-   `timestamp` is the latest update time for the dominant speakers in the call.
```javascript
let dominantSpeakers: DominantSpeakersInfo = callDominantSpeakersApi.dominantSpeakers;
```

Also, you can subscribe to the `dominantSpeakersChanged` event to know when the dominant speakers list has changed.

```javascript
const dominantSpeakersChangedHandler = () => {
    // Get the most up-to-date list of dominant speakers
    let dominantSpeakers = callDominantSpeakersApi.dominantSpeakers;
};
callDominantSpeakersApi.on('dominantSpeakersChanged', dominantSpeakersChangedHandler);

```

## Enabling screen sharing
### Twilio

To share the screen in Twilio Video, source track should be obtained via navigator.mediaDevices

Chromium-based browsers:
```javascript
const stream = await navigator.mediaDevices.getDisplayMedia({
   audio: false,
   video: true
 });
const track = stream.getTracks()[0];
```

Firefox and Safari:
```javascript
const stream = await navigator.mediaDevices.getUserMedia({ mediaSource: 'screen' });
const track = stream.getTracks()[0];
```

Obtain the screen share track can then be published and managed the same way as casual Video Track (see the “Video” section).

### Azure Communication Services

To start screen sharing while on a call, you can use asynchronous API `startScreenSharing`:
```javascript
await call.startScreenSharing();
```

After successfully starting to sending screen sharing, a `LocalVideoStream` instance of type `ScreenSharing` is created and is added to the `localVideoStreams` collection on the call instance.

```javascript
const localVideoStream = call.localVideoStreams.find( (stream) => { return stream.mediaStreamType === 'ScreenSharing'} );
```

To stop screen sharing while on a call, you can use asynchronous API `stopScreenSharing`:
```javascript
await call.stopScreenSharing();
```

To verify if screen sharing is on or off, you can use `isScreenSharingOn` API, which returns true or false:
```javascript
call.isScreenSharingOn;
```

To listen for changes to the screen share, you can subscribe and unsubscribe to the `isScreenSharingOnChanged` event

```javascript
// Subscribe to screen share event
call.on('isScreenSharingOnChanged', () => {
    // Callback();
});
// Unsubscribe from screen share event
call.off('isScreenSharingOnChanged', () => {
    // Callback();
});

```

## Media quality statistics

### Twilio

To collect real-time media stats, the getStats method can be used.
```javascript
const stats = twilioRoom.getStats();
```

### Azure Communication Services

Media quality statistics is an extended feature of the core Call API. You first need to obtain the mediaStatsFeature API object:

```javascript
const mediaStatsFeature = call.feature(Features.MediaStats);
```


To receive the media statistics data, you can subscribe `sampleReported` event or `summmaryReported` event:

- `sampleReported` event triggers every second. It's suitable as a data source for UI display or your own data pipeline.
- `summmaryReported` event contains the aggregated values of the data over intervals, which is useful when you just need a summary.

If you want control over the interval of the summmaryReported event, you need to define `mediaStatsCollectorOptions` of type `MediaStatsCollectorOptions`. Otherwise, the SDK uses default values.
```javascript
const mediaStatsCollectorOptions: SDK.MediaStatsCollectorOptions = {
    aggregationInterval: 10,
    dataPointsPerAggregation: 6
};

const mediaStatsCollector = mediaStatsFeature.createCollector(mediaStatsSubscriptionOptions);

mediaStatsCollector.on('sampleReported', (sample) => {
    console.log('media stats sample', sample);
});

mediaStatsCollector.on('summaryReported', (summary) => {
    console.log('media stats summary', summary);
});
```

In case you don't need to use the media statistics collector, you can call dispose method of `mediaStatsCollector`.

```javascript
mediaStatsCollector.dispose();
```


It's not necessary to call the dispose method of `mediaStatsCollector` every time the call ends, as the collectors are reclaimed internally when the call ends.

You can learn more about media quality statistics [here](../concepts/voice-video-calling/media-quality-sdk.md?pivots=platform-web).

## Diagnostics

### Twilio

To test connectivity, Twilio offers Preflight API - a test call is performed to identify signaling and media connectivity issues.

To launch the test, an access token is required:

```javascript
const preflightTest = twilioVideo.runPreflight(token);

// Emits when particular call step completes
preflightTest.on('progress', (progress) => {
  console.log(`Preflight progress: ${progress}`);
});

// Emits if the test has failed and returns error and partial test results
preflightTest.on('failed', (error, report) => {
  console.error(`Preflight error: ${error}`);
  console.log(`Partial preflight test report: ${report}`);
});

// Emits when the test has been completed successfully and returns the report
preflightTest.on('completed', (report) => {
  console.log(`Preflight test report: ${report}`);
});

```

Another way to identify network issues during the call is Network Quality API, which monitors Participant's network and provides quality metrics. It can be enabled in the connection options when joining the Group Room:

```javascript
twilioRoom = await twilioVideo.connect('token', { 
    name: 'roomName', 
    audio: false, 
    video: false,
    networkQuality: {
        local: 3, // Local Participant's Network Quality verbosity
        remote: 1 // Remote Participants' Network Quality verbosity
    }
});
```

When the network quality for Participant changes, a `networkQualityLevelChanged` event will be emitted:
```javascript
participant.on(networkQualityLevelChanged, (networkQualityLevel, networkQualityStats)  => {
    // Processing Network Quality stats
});
```

### Azure Communication Services
Azure Communication Services provides a feature called `"User Facing Diagnostics" (UFD)` that can be used to examine various properties of a call to determine what the issue might be. User Facing Diagnostics are events that are fired off that could indicate due to some underlying issue (poor network, the user has their microphone muted) that a user might have a poor experience.

User-facing diagnostics is an extended feature of the core Call API and allows you to diagnose an active call.
```javascript
const userFacingDiagnostics = call.feature(Features.UserFacingDiagnostics);
```

Subscribe to the diagnosticChanged event to monitor when any user-facing diagnostic changes:
```javascript
/**
 *  Each diagnostic has the following data:
 * - diagnostic is the type of diagnostic, e.g. NetworkSendQuality, DeviceSpeakWhileMuted
 * - value is DiagnosticQuality or DiagnosticFlag:
 *     - DiagnosticQuality = enum { Good = 1, Poor = 2, Bad = 3 }.
 *     - DiagnosticFlag = true | false.
 * - valueType = 'DiagnosticQuality' | 'DiagnosticFlag'
 */
const diagnosticChangedListener = (diagnosticInfo: NetworkDiagnosticChangedEventArgs | MediaDiagnosticChangedEventArgs) => {
    console.log(`Diagnostic changed: ` +
        `Diagnostic: ${diagnosticInfo.diagnostic}` +
        `Value: ${diagnosticInfo.value}` +
        `Value type: ${diagnosticInfo.valueType}`);

    if (diagnosticInfo.valueType === 'DiagnosticQuality') {
        if (diagnosticInfo.value === DiagnosticQuality.Bad) {
            console.error(`${diagnosticInfo.diagnostic} is bad quality`);

        } else if (diagnosticInfo.value === DiagnosticQuality.Poor) {
            console.error(`${diagnosticInfo.diagnostic} is poor quality`);
        }

    } else if (diagnosticInfo.valueType === 'DiagnosticFlag') {
        if (diagnosticInfo.value === true) {
            console.error(`${diagnosticInfo.diagnostic}`);
        }
    }
};

userFacingDiagnostics.network.on('diagnosticChanged', diagnosticChangedListener);
userFacingDiagnostics.media.on('diagnosticChanged', diagnosticChangedListener);

```

You can learn more about User Facing Diagnostics and the different diagnostic values available in [this article](../concepts/voice-video-calling/user-facing-diagnostics.md?pivots=platform-web).

ACS also provides a pre-call diagnostics API. To Access the Pre-Call API, you need to initialize a `callClient`, and provision an Azure Communication Services access token. There you can access the `PreCallDiagnostics` feature and the `startTest` method.

```javascript
import { CallClient, Features} from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

const callClient = new CallClient(); 
const tokenCredential = new AzureCommunicationTokenCredential("INSERT ACCESS TOKEN");
const preCallDiagnosticsResult = await callClient.feature(Features.PreCallDiagnostics).startTest(tokenCredential);
```

The Pre-Call API returns a full diagnostic of the device including details like device permissions, availability and compatibility, call quality stats and in-call diagnostics. The results are returned as a PreCallDiagnosticsResult object.

```javascript
export declare type PreCallDiagnosticsResult  = {
    deviceAccess: Promise<DeviceAccess>;
    deviceEnumeration: Promise<DeviceEnumeration>;
    inCallDiagnostics: Promise<InCallDiagnostics>;
    browserSupport?: Promise<DeviceCompatibility>;
    id: string;
    callMediaStatistics?: Promise<MediaStatsCallFeature>;
};
```

You can learn more about ensuring precall readiness [here](../concepts/voice-video-calling/pre-call-diagnostics.md).


## Event listeners

### Twilio

```javascript
twilioRoom.on('participantConneted', (participant) => { 
// Participant connected 
}); 

twilioRoom.on('participantDisconneted', (participant) => { 
// Participant Disconnected 
});

```

### Azure Communication Services

Each object in the JavaScript Calling SDK has properties and collections. Their values change throughout the lifetime of the object. Use the `on()` method to subscribe to objects' events, and use the `off()` method to unsubscribe from objects' events.

**Properties**

-   You must inspect their initial values, and subscribe to the `'\<property\>Changed'` event for future value updates.

**Collections**

-   You must inspect their initial values, and subscribe to the `'\<collection\>Updated'` event for future value updates.
-   The `'\<collection\>Updated'` event's payload, has an `added` array that contains values that were added to the collection.
-   The `'\<collection\>Updated'` event's payload also has a removed array that contains values that were removed from the collection.

## Leaving and ending sessions

### Twilio
```javascript
twilioVideo.disconnect();
```


### Azure Communication Services
```javascript
call.hangUp();

// Set the 'forEveryone' property to true to end call for all participants
call.hangUp({ forEveryone: true });

```

## Cleaning Up

If you want to [clean up and remove a Communication Services subscription](../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp#clean-up-resources), you can delete the resource or resource group.
