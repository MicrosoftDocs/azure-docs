---
author: mikben
ms.service: azure-communication-services
ms.topic: include
ms.date: 06/30/2021
ms.author: mikben
---

## Models

### Events model
Each object in the calling sdk, has properties and collections values of which, change throughout the lifetime of the object.
Use the `on()` method to subscribe to objects' events, and use the `off()` method to unsubscribe from objects' events.

#### Properties
- You must inspect their initial values, and subscribe to the `'<property>Changed'` event for future value updates.

#### Collections
- You must inspect their initial values, and subscribe to the `'<collection>Updated'` event for future value updates.
- The `'<collection>Updated'` event's payload, has an `added` array that contains values that were added to the collection.
- The `'<collection>Updated'` event's payload also has a `removed` array that contains values that were removed from the collection.

```js
/*************************************
 * Example code - client.js          *
 * Convert this script into a        *
 * bundle.js that your html index    *
 * page can use.                     *
 *************************************/

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
let callAgent;
let deviceManager;
let call;
let incomingCall;
let localVideoStream;
let localVideoStreamRenderer;

// UI widgets
let userAccessToken = document.getElementById('user-access-token');
let calleeAcsUserId = document.getElementById('callee-acs-user-id');
let initializeCallAgentButton = document.getElementById('initialize-call-agent');
let startCallButton = document.getElementById('start-call-button');
let acceptCallButton = document.getElementById('accept-call-button');
let startVideoButton = document.getElementById('start-video-button');
let stopVideoButton = document.getElementById('stop-video-button');
let connectedLabel = document.getElementById('connectedLabel');
let remoteVideoContainer = document.getElementById('remoteVideoContainer');
let localVideoContainer = document.getElementById('localVideoContainer');

// Instantiate the Call Agent.
initializeCallAgentButton.onclick = async () => {
    try {
        const callClient = new CallClient(); 
        tokenCredential = new AzureCommunicationTokenCredential(userAccessToken.value.trim());
        callAgent = await callClient.createCallAgent(tokenCredential)
        // Set up a camera device to use.
        deviceManager = await callClient.getDeviceManager();
        await deviceManager.askDevicePermission({ video: true });
        await deviceManager.askDevicePermission({ audio: true });
        // Listen for an incoming call to accept.
        callAgent.on('incomingCall', async (args) => {
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

// Start an out-going call.
startCallButton.onclick = async () => {
    try {
        const localVideoStream = await createLocalVideoStream();
        const videoOptions = localVideoStream ? { localVideoStreams: [localVideoStream] } : undefined;
        call = callAgent.startCall([{ communicationUserId: calleeAcsUserId.value.trim() }], { videoOptions });
        // Subscribe to the call's properties and events.
        subscribeToCall(call);
    } catch (error) {
        console.error(error);
    }
}

// Accept the incoming call.
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
// Listen for property changes and collection updates.
subscribeToCall = (call) => {
    try {
        // Inspect the initial call.id value.
        console.log(`Call Id: ${call.id}`);
        //Subscribe to call's 'idChanged' event for value changes.
        call.on('idChanged', () => {
            console.log(`Call Id changed: ${call.id}`); 
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
                startVideoButton.disabled = false;
                stopVideoButton.disabled = false
            } else if (call.state === 'Disconnected') {
                connectedLabel.hidden = true;
                startCallButton.disabled = false;
                console.log(`Call ended, call end reason={code=${call.callEndReason.code}, subCode=${call.callEndReason.subCode}}`);
            }   
        });

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
        })
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
            })
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

        // Inspect the remoteParticipants current videoStreams and subscribe to them.
        remoteParticipant.videoStreams.forEach(remoteVideoStream => {
            subscribeToRemoteVideoStream(remoteVideoStream)
        });
        // Subscribe to the remoteParticipant's 'videoStreamsUpdated' event to be
        // notified when the remoteParticipant adds new videoStreams and removes video streams.
        remoteParticipant.on('videoStreamsUpdated', e => {
            // Subscribe to new remote participant's video streams that were added.
            e.added.forEach(remoteVideoStream => {
                subscribeToRemoteVideoStream(remoteVideoStream)
            });
            // Unsubscribe from remote participant's video streams that were removed.
            e.removed.forEach(remoteVideoStream => {
                console.log('Remote participant video stream was removed.');
            })
        });
    } catch (error) {
        console.error(error);
    }
}

// Subscribe to a remote participant's remote video stream obj.
// Listen for property changes and collection updates.
// When their remote video streams become available, display them in the UI.
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
```

An HTML example code that can use a bundle generated from the above JavaScript example (`client.js`).
```html
<!-- index.html -->
<!DOCTYPE html>
<html>
    <head>
        <title>Azure Communication Services - Calling Web SDK</title>
    </head>
    <body>
        <h4>Azure Communication Services - Calling Web SDK</h4>
        <input id="user-access-token"
            type="text"
            placeholder="User access token"
            style="margin-bottom:1em; width: 500px;"/>
        <button id="initialize-call-agent" type="button">Initialize Call Agent</button>
        <br>
        <br>
        <input id="callee-acs-user-id"
            type="text"
            placeholder="Enter callee's ACS user identity in format: '8:acs:resourceId_userId'"
            style="margin-bottom:1em; width: 500px; display: block;"/>
        <button id="start-call-button" type="button" disabled="true">Start Call</button>
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
        <script src="./bundle.js"></script>
    </body>
</html>
```
Note that after starting call, joining call, or accepting call, you can also use
the callAgent's 'callsUpdated' event to be notified of the new Call object and
start subscribing to it.
```js
callAgent.on('callsUpdated', e => {
    // New Call object is added to callAgent.calls collection
    e.added.forEach(call => {
        call.remoteParticipants.forEach(remoteParticipant => {
            subscribeToRemoteParticipant(remoteParticipant);
        })
        call.on('remoteParticipantsUpdated', e => {
            e.added.forEach(remoteParticipant => {
                subscribeToRemoteParticipant(remoteParticipant)
            });
            e.removed.forEach(remoteParticipant => {
                console.log('Remote participant removed from the call.');
            })
        });
    })
})
```



### Join a Teams Meeting
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Web SDK

To join a Teams meeting, use the `join` method and pass a meeting link or a meeting's coordinates.

Join by using a meeting link:

```js
const locator = { meetingLink: '<MEETING_LINK>'}
const call = callAgent.join(locator);
```

Join by using meeting coordinates:

```js
const locator = {
    threadId: <thread id>,
    organizerId: <organizer id>,
    tenantId: <tenant id>,
    messageId: <message id>
}
const call = callAgent.join(locator);
```

## Receive an incoming call


See Call Diagnostics section to see how to handle this call diagnostic.






## Render remote participant video streams

To list the video streams and screen sharing streams of remote participants, inspect the `videoStreams` collections:

```js
const remoteVideoStream: RemoteVideoStream = call.remoteParticipants[0].videoStreams[0];
const streamType: MediaStreamType = remoteVideoStream.mediaStreamType;
```

To render `RemoteVideoStream`, you have to subscribe to it's `isAvailableChanged` event. If the `isAvailable` property changes to `true`, a remote participant is sending a stream. After that happens, create a new instance of `VideoStreamRenderer`, and then create a new `VideoStreamRendererView` instance by using the asynchronous `createView` method.  You can then attach `view.target` to any UI element.

Whenever availability of a remote stream changes you can choose to destroy the whole `VideoStreamRenderer`, a specific `VideoStreamRendererView`
or keep them, but this will result in displaying blank video frame.

```js
subscribeToRemoteVideoStream = async (remoteVideoStream) => {
    // Create a video stream renderer for the remote video stream.
    let videoStreamRenderer = new VideoStreamRenderer(remoteVideoStream);
    let view;
    const remoteVideoContainer = document.getElementById('remoteVideoContainer');
    const renderVideo = async () => {
        try {
            // Create a renderer view for the remote video stream.
            view = await videoStreamRenderer.createView();
            // Attach the renderer view to the UI.
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
```

### Remote video stream properties

Remote video streams have the following properties:

- `id`: The ID of a remote video stream.

  ```js
  const id: number = remoteVideoStream.id;
  ```

- `mediaStreamType`: Can be `Video` or `ScreenSharing`.

  ```js
  const type: MediaStreamType = remoteVideoStream.mediaStreamType;
  ```

- `isAvailable`: Whether a remote participant endpoint is actively sending a stream.

  ```js
  const type: boolean = remoteVideoStream.isAvailable;
  ```

### VideoStreamRenderer methods and properties
Create a `VideoStreamRendererView` instance that can be attached in the application UI to render the remote video stream, use asynchronous `createView()` method, it resolves when stream is ready to render and returns an object with `target` property that represents `video` element that can be appended anywhere in the DOM tree

  ```js
  await videoStreamRenderer.createView()
  ```

Dispose of `videoStreamRenderer` and all associated `VideoStreamRendererView` instances:

  ```js
  videoStreamRenderer.dispose()
  ```

### VideoStreamRendererView methods and properties

When you create a `VideoStreamRendererView`, you can specify the `scalingMode` and `isMirrored` properties. `scalingMode` can be `Stretch`, `Crop`, or `Fit`. If `isMirrored` is specified, the rendered stream is flipped vertically.

```js
const videoStreamRendererView: VideoStreamRendererView = await videoStreamRenderer.createView({ scalingMode, isMirrored });
```

Every `VideoStreamRendererView` instance has a `target` property that represents the rendering surface. Attach this property in the application UI:

```js
htmlElement.appendChild(view.target);
```

You can update `scalingMode` by invoking the `updateScalingMode` method:

```js
view.updateScalingMode('Crop')
```



## Call Feature Extensions

### Record calls
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Web SDK

Call recording is an extended feature of the core `Call` API. You first need to obtain the recording feature API object:

```js
const callRecordingApi = call.api(Features.Recording);
```

Then, to check if the call is being recorded, inspect the `isRecordingActive` property of `callRecordingApi`. It returns `Boolean`.

```js
const isRecordingActive = callRecordingApi.isRecordingActive;
```

You can also subscribe to recording changes:

```js
const isRecordingActiveChangedHandler = () => {
    console.log(callRecordingApi.isRecordingActive);
};

callRecordingApi.on('isRecordingActiveChanged', isRecordingActiveChangedHandler);

```

### Transfer calls
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Web SDK

Call transfer is an extended feature of the core `Call` API. You first need to get the transfer feature API object:

```js
const callTransferApi = call.api(Features.Transfer);
```

Call transfers involve three parties:

- *Transferor*: The person who initiates the transfer request.
- *Transferee*: The person who is being transferred.
- *Transfer target*: The person who is being transferred to.

Transfers follow these steps:

1. There's already a connected call between the *transferor* and the *transferee*. The *transferor* decides to transfer the call from the *transferee* to the *transfer target*.
1. The *transferor* calls the `transfer` API.
1. The *transferee* decides whether to `accept` or `reject` the transfer request to the *transfer target* by using a `transferRequested` event.
1. The *transfer target* receives an incoming call only if the *transferee* accepts the transfer request.

To transfer a current call, you can use the `transfer` API. `transfer` takes the optional `transferCallOptions`, which allows you to set a `disableForwardingAndUnanswered` flag:

- `disableForwardingAndUnanswered = false`: If the *transfer target* doesn't answer the transfer call, the transfer follows the *transfer target* forwarding and unanswered settings.
- `disableForwardingAndUnanswered = true`: If the *transfer target* doesn't answer the transfer call, the transfer attempt ends.

```js
// transfer target can be an ACS user
const id = { communicationUserId: <ACS_USER_ID> };
```

```js
// call transfer API
const transfer = callTransferApi.transfer({targetParticipant: id});
```

The `transfer` API allows you to subscribe to `transferStateChanged` and `transferRequested` events. A `transferRequested` event comes from a `call` instance; a `transferStateChanged` event and transfer `state` and `error` come from a `transfer` instance.

```js
// transfer state
const transferState = transfer.state; // None | Transferring | Transferred | Failed

// to check the transfer failure reason
const transferError = transfer.error; // transfer error code that describes the failure if a transfer request failed
```

The *transferee* can accept or reject the transfer request initiated by the *transferor* in the `transferRequested` event by using `accept()` or `reject()` in `transferRequestedEventArgs`. You can access `targetParticipant` information and `accept` or `reject` methods in `transferRequestedEventArgs`.

```js
// Transferee to accept the transfer request
callTransferApi.on('transferRequested', args => {
    args.accept();
});

// Transferee to reject the transfer request
callTransferApi.on('transferRequested', args => {
    args.reject();
});
```

### Dominant speakers of a call
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Web SDK

Dominant speakers for a call is an extended feature of the core `Call` API and allows you to obtain a list of the active speakers in the call. 

This is a ranked list, where the first element in the list represents the last active speaker on the call and so on.

In order to obtain the dominant speakers in a call, you first need to obtain the call dominant speakers feature API object:

```js
const callDominantSpeakersApi = call.api(Features.CallDominantSpeakers);
```

Then, obtain the list of the dominant speakers by calling `dominantSpeakers`. This has a type of `DominantSpeakersInfo`, which has the following members:

- `speakersList` contains the list of the ranked dominant speakers in the call. These are represented by their participant ID.
- `timestamp` is the latest update time for the dominant speakers in the call.

```js
let dominantSpeakers: DominantSpeakersInfo = callDominantSpeakersApi.dominantSpeakers;
```
Also, you can subscribe to the `dominantSpeakersChanged` event to know when the dominant speakers list has changed

```js
const dominantSpeakersChangedHandler = () => {
    // Get the most up to date list of dominant speakers
    let dominantSpeakers = callDominantSpeakersApi.dominantSpeakers;
};
callDominantSpeakersApi.api(Features.CallDominantSpeakers).on('dominantSpeakersChanged', dominantSpeakersChangedHandler);
``` 
#### Handle the Dominant Speaker's video streams

Your application can use the `DominantSpeakers` feature to render one or more of dominant speaker's video streams, and keep updating UI whenever dominant speaker list updates. This can be achieved with the following code example.

```js
// RemoteParticipant obj representation of the dominant speaker
let dominantRemoteParticipant: RemoteParticipant;
// It is recommended to use a map to keep track of a stream's associated renderer
let streamRenderersMap: new Map<RemoteVideoStream, VideoStreamRenderer>();

function getRemoteParticipantForDominantSpeaker(dominantSpeakerIdentifier) {
    let dominantRemoteParticipant: RemoteParticipant;
    switch(dominantSpeakerIdentifier.kind) {
        case 'communicationUser': {
            dominantRemoteParticipant = currentCall.remoteParticipants.find(rm => {
                return (rm.identifier as CommunicationUserIdentifier).communicationUserId === dominantSpeakerIdentifier.communicationUserId
            });
            break;
        }
        case 'microsoftTeamsUser': {
            dominantRemoteParticipant = currentCall.remoteParticipants.find(rm => {
                return (rm.identifier as MicrosoftTeamsUserIdentifier).microsoftTeamsUserId === dominantSpeakerIdentifier.microsoftTeamsUserId
            });
            break;
        }
        case 'unknown': {
            dominantRemoteParticipant = currentCall.remoteParticipants.find(rm => {
                return (rm.identifier as UnknownIdentifier).id === dominantSpeakerIdentifier.id
            });
            break;
        }
    }
    return dominantRemoteParticipant;
}
// Handler function for when the dominant speaker changes
const dominantSpeakersChangedHandler = async () => {
    // Get the new dominant speaker's identifier
    const newDominantSpeakerIdentifier = currentCall.api(Features.DominantSpeakers).dominantSpeakers.speakersList[0];

     if (newDominantSpeakerIdentifier) {
        // Get the remote participant object that matches newDominantSpeakerIdentifier
        const newDominantRemoteParticipant = getRemoteParticipantForDominantSpeaker(newDominantSpeakerIdentifier);

        // Create the new dominant speaker's stream renderers
        const streamViews = [];
        for (const stream of newDominantRemoteParticipant.videoStreams) {
            if (stream.isAvailable && !streamRenderersMap.get(stream)) {
                const renderer = new VideoStreamRenderer(stream);
                streamRenderersMap.set(stream, renderer);
                const view = await videoStreamRenderer.createView();
                streamViews.push(view);
            }
        }

        // Remove the old dominant speaker's video streams by disposing of their associated renderers
        if (dominantRemoteParticipant) {
            for (const stream of dominantRemoteParticipant.videoStreams) {
                const renderer = streamRenderersMap.get(stream);
                if (renderer) {
                    streamRenderersMap.delete(stream);
                    renderer.dispose();
                }
            }
        }

        // Set the new dominant remote participant obj
        dominantRemoteParticipant = newDominantRemoteParticipant

        // Render the new dominant remote participant's streams
        for (const view of streamViewsToRender) {
            htmlElement.appendChild(view.target);
        }
     }
};

// When call is disconnected, set the dominant speaker to undefined
currentCall.on('stateChanged', () => {
    if (currentCall === 'Disconnected') {
        dominantRemoteParticipant = undefined;
    }
});

const dominantSpeakerIdentifier = currentCall.api(Features.DominantSpeakers).dominantSpeakers.speakersList[0];
dominantRemoteParticipant = getRemoteParticipantForDominantSpeaker(dominantSpeakerIdentifier);
currentCall.api(Features.DominantSpeakers).on('dominantSpeakersChanged', dominantSpeakersChangedHandler);

subscribeToRemoteVideoStream = async (stream: RemoteVideoStream, participant: RemoteParticipant) {
    let renderer: VideoStreamRenderer;

    const displayVideo = async () => {
        renderer = new VideoStreamRenderer(stream);
        streamRenderersMap.set(stream, renderer);
        const view = await renderer.createView();
        htmlElement.appendChild(view.target);
    }

    stream.on('isAvailableChanged', async () => {
        if (dominantRemoteParticipant !== participant) {
            return;
        }

        renderer = streamRenderersMap.get(stream);
        if (stream.isAvailable && !renderer) {
            await displayVideo();
        } else {
            streamRenderersMap.delete(stream);
            renderer.dispose();
        }
    });

    if (dominantRemoteParticipant !== participant) {
        return;
    }

    renderer = streamRenderersMap.get(stream);
    if (stream.isAvailable && !renderer) {
        await displayVideo();
    }
}
```

FUCK SAKE THIS IS A SEPARATE ARTICLE
### Call diagnostics
Call diagnostics is an extended feature of the core `Call` API and allows you to diagnose an active call.

```js
const callDiagnostics = call.api(Features.Diagnostics);
```

The following users facing diagnostics are available:

| Type    | Name                           | Description                                                     | Possible values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Use cases                                                                       |
| ------- | ------------------------------ | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Network | noNetwork                      | There is no network available.                                  | - Set to `True` when a call fails to start because there is no network available. <br/> - Set to `False` when there are ICE candidates present.                                                                                                                                                                                                                                                                                                                                                      | Device is not connected to a network.                                           |
| Network | networkRelaysNotReachable      | Problems with a network.                                        | - Set to `True` when the network has some constraint that is not allowing you to reach ACS relays. <br/> - Set to `False` upon making a new call.                                                                                                                                                                                                                                                                                                                                                    | During a call when the WiFi signal goes on and off.                             |  |
| Network | networkReconnect               | The connection was lost and we are reconnecting to the network. | - Set to `Poor` when the media transport connectivity is lost                                                                                                                                 <br/> - Set to `Bad` when the network is disconnected <br/> - Set to `Good` when a new session is connected.                                                                                                                                                                                           | Low bandwidth, no internet                                                      |
| Network | networkReceiveQuality          | An indicator regarding incoming stream quality.                 | - Set to `Bad` when there is a severe problem with receiving the stream. quality                                                                                                                           <br/> - Set to `Poor` when there is a mild problem with receiving the stream. quality                                                                                                                           <br/> - Set to `Good` when there is no problem with receiving the stream. | Low bandwidth                                                                   |
| Media   | noSpeakerDevicesEnumerated     | There is no audio output device (speaker) on the user's system. | - Set to `True` when there are no speaker devices on the system, and speaker selection is supported. <br/> - Set to `False` when there is a least 1 speaker device on the system, and speaker selection is supported.                                                                                                                                                                                                                                                                                | All speakers are unplugged                                                      |
| Media   | speakingWhileMicrophoneIsMuted | Speaking while being on mute.                                   | - Set to `True` when local microphone is muted and the local user is speaking. <br/> - Set to `False` when local user either stops speaking, or un-mutes the microphone. <br/> * Note: as of today, this isn't supported on safari yet, as the audio level samples are taken from webrtc. stats.                                                                                                                                                                                                     | During a call, mute your microphone and speak into it.                          |
| Media   | noMicrophoneDevicesEnumerated  | No audio capture devices (microphone) on the user's system      | - Set to `True` when there are no microphone devices on the system. <br/> - Set to `False` when there is at least 1 microphone device on the system.                                                                                                                                                                                                                                                                                                                                                 | All microphones are unplugged during the call.                                  |
| Media   | cameraFreeze                   | Camera stops producing frames for more than 5 seconds.          | - Set to `True` when the local video stream is frozen. This means the remote side is seeing your video frozen on their screen or it means that the remote participants are not rendering your video on their screen. <br/> - Set to `False` when the freeze ends and users can see your video as per normal.                                                                                                                                                                                         | The Camera was lost during the call or bad network caused the camera to freeze. |
| Media   | cameraStartFailed              | Generic camera failure.                                         | - Set to `True` when we fail to start sending local video because the camera device may have been disabled in the system or it is being used by another process~. <br/> - Set to `False` when selected camera device successfully sends local video. again.                                                                                                                                                                                                                                           | Camera failures                                                                 |
| Media   | cameraStartTimedOut            | Common scenario where camera is in bad state.                   | - Set to `True` when camera device times out to start sending video stream. <br/> - Set to `False` when selected camera device successfully sends local video again.                                                                                                                                                                                                                                                                                                                                 | Camera failures                                                                 |
| Media   | microphoneNotFunctioning       | Microphone is not functioning.                                  | - Set to `True` when we fail to start sending local audio stream because the microphone device may have been disabled in the system or it is being used by another process. This UFD takes about 10 seconds to get raised. <br/> - Set to `False` when microphone starts to successfully send audio stream again.                                                                                                                                                                                    | No microphones available, microphone access disabled in a system                |
| Media   | microphoneMuteUnexpectedly     | Microphone is muted                                             | - Set to `True` when microphone enters muted state unexpectedly. <br/> - Set to `False` when microphone starts to successfully send audio stream                                                                                                                                                                                                                                                                                                                                                     | Microphone is muted from the system.                                            |
| Media   | screenshareRecordingDisabled   | System screen sharing was denied by preferences in Settings.     | - Set to `True` when screen sharing permission is denied by system settings (sharing). <br/> - Set to `False` on successful stream acquisition. <br/> Note: This diagnostic only works on macOS.Chrome.                                                                                                                                                                                                                                                                                               | Screen recording is disabled in Settings.                                       |
| Media   | microphonePermissionDenied     | There is low volume from device or it’s almost silent on macOS. | - Set to `True` when audio permission is denied by system settings (audio). <br/> - Set to `False` on successful stream acquisition. <br/> Note: This diagnostic only works on macOS.                                                                                                                                                                                                                                                                                                                | Microphone permissions are disabled in the Settings.                            |
| Media   | cameraPermissionDenied         | Camera permissions were denied in settings.                     | - Set to `True` when camera permission is denied by system settings (video). <br/> - Set to `False` on successful stream acquisition. <br> Note: This diagnostic only works on macOS Chrome                                                                                                                                                                                                                                                                                                          | Camera permissions are disabled in the settings.                                |

- Subscribe to the `diagnosticChanged` event to monitor when any call diagnostic changes.
```js
/**
 *  Each diagnostic has the following data:
 * - diagnostic is the type of diagnostic, e.g. NetworkSendQuality, DeviceSpeakWhileMuted, etc...
 * - value is DiagnosticQuality or DiagnosticFlag:
 *     - DiagnosticQuality = enum { Good = 1, Poor = 2, Bad = 3 }.
 *     - DiagnosticFlag = true | false.
 * - valueType = 'DiagnosticQuality' | 'DiagnosticFlag'
 * - mediaType is the media type associated with the event, e.g. Audio, Video, ScreenShare. These are defined in `CallDiagnosticEventMediaType`.
 */
const diagnosticChangedListener = (diagnosticInfo: NetworkDiagnosticChangedEventArgs | MediaDiagnosticChangedEventArgs) => {
    console.log(`Diagnostic changed: ` +
        `Diagnostic: ${diagnosticInfo.diagnostic}` +
        `Value: ${diagnosticInfo.value}` + 
        `Value type: ${diagnosticInfo.valueType}` +
        `Media type: ${diagnosticInfo.mediaType}` +

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

callDiagnostics.network.on('diagnosticChanged', diagnosticChangedListener);
callDiagnostics.media.on('diagnosticChanged', diagnosticChangedListener);
```

- Get the latest call diagnostic values that were raised. If a diagnostic is undefined, that is because it was never raised.
```js
const latestNetworkDiagnostics = callDiagnostics.network.getLatest();
	
console.log(`noNetwork: ${latestNetworkDiagnostics.noNetwork.value}, ` +
    `value type = ${latestNetworkDiagnostics.noNetwork.valueType}`);
			
console.log(`networkReconnect: ${latestNetworkDiagnostics.networkReconnect.value}, ` +
    `value type = ${latestNetworkDiagnostics.networkReconnect.valueType}`);
			
console.log(`networkReceiveQuality: ${latestNetworkDiagnostics.networkReceiveQuality.value}, ` +
    `value type = ${latestNetworkDiagnostics.networkReceiveQuality.valueType}`);


const latestMediaDiagnostics = callDiagnostics.media.getLatest();
	
console.log(`speakingWhileMicrophoneIsMuted: ${latestMediaDiagnostics.speakingWhileMicrophoneIsMuted.value}, ` +
    `value type = ${latestMediaDiagnostics.speakingWhileMicrophoneIsMuted.valueType}`);
			
console.log(`cameraStartFailed: ${latestMediaDiagnostics.cameraStartFailed.value}, ` +
    `value type = ${latestMediaDiagnostics.cameraStartFailed.valueType}`);
			
console.log(`microphoneNotFunctioning: ${latestMediaDiagnostics.microphoneNotFunctioning.value}, ` +
    `value type = ${latestMediaDiagnostics.microphoneNotFunctioning.valueType}`);
```
## Releasing resources
1. How to properly release resources when a call is finished:
    - When the call is finished our SDK will terminate the signaling & media sessions leaving you with an instance of the call that holds the last state of it. You can still check callEndReason. If your app won't hold the reference to the Call instance then the JavaScript garbage collector will clean up everything so in terms of memory consumption your app should go back to initial state from before the call.
2. Which resource types are long-lived (app lifetime) vs. short-lived (call lifetime):
    - The following are considered to be "long-lived" resources - you can create them and keep referenced for a long time, they are very light in terms of resource(memory) consumption so won't impact perf:
        - CallClient
        - CallAgent
        - DeviceManager
    - The following are considered to be "short-lived" resources and are the ones that are playing some role in the call itself, emit events to the application, or are interacting with local media devices. These will consume more cpu&memory, but once call ends - SDK will clean up all the state and release resource:
        - Call - since it's the one holding the actual state of the call (both signaling and media).
        - RemoteParticipants - Represent the remote participants in the call.
        - VideoStreamRenderer with it's VideoStreamRendererViews - handling video rendering.