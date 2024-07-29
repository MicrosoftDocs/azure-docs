---
author: sloanster
ms.service: azure-communication-services
ms.topic: include
ms.date: 05/09/2024
ms.author: micahvivion
---
## Events on the Azure Communication Calling SDK

This guide describes the various events or properties changes your app can subscribe to. Subscribing to those events allows your app to be informed about state change in the calling SDK and react accordingly.

Tracking events is crucial because it enables your application's state to stay synchronized with the ACSCalling framework's state, all without requiring you to implement a pull mechanism on the SDK objects.

This guide assumes you went through the QuickStart or that you implemented an application that is able to make and receive calls. If you didn't complete the getting starting guide, refer to our [Quickstart](../../../../quickstarts/voice-video-calling/getting-started-with-calling.md).

Each object in the JavaScript calling SDK has `properties` and `collections`. Their values change throughout the lifetime of the object.
Use the `on()` method to subscribe to objects' events, and use the `off()` method to unsubscribe from objects' events.

### Properties
You can subscribe to the `'<property>Changed'` event to listen to value changes on the property.

### Example of subscription on a property
In this example, we subscribe to changes in the value of the `isLocalVideoStarted` property.

```javascript
call.on('isLocalVideoStartedChanged', () => {
    // At that point the value call.isLocalVideoStarted is updated
    console.log(`isLocalVideoStarted changed: ${call.isLocalVideoStarted}`);
});
```

## Collections
You can subscribe to the '\<collection>Updated' event to receive notifications about changes in an object collection. The '\<collection>Updated' event is triggered whenever elements are added to or removed from the collection you're monitoring.

- The `'<collection>Updated'` event's payload, has an `added` array that contains values that were added to the collection.
- The `'<collection>Updated'` event's payload also has a `removed` array that contains values that were removed from the collection.

### Example subscription on a collection

In this example, we subscribe to changes in values of the Call object `LocalVideoStream`.

```javascript
call.on('localVideoStreamsUpdated', updateEvent => {
    updateEvent.added.forEach(async (localVideoStream) => {
        // Contains an array of LocalVideoStream that were added to the call
        // Add a preview and start any processing if needed
        handleAddedLocalVideoStream(localVideoStream )
    });
    updateEvent.removed.forEach(localVideoStream => {
        // Contains an array of LocalVideoStream that were removed from the call
        // Remove the preview and stop any processing if needed
        handleRemovedLocalVideoStream(localVideoStream ) 
    });
});
```

<!---------- CallAgent  object ---------->
## Events on the `CallAgent` object

### Event Name: `incomingCall`

The `incomingCall` event fires when the client is receiving an incoming call.

**How should your application react to the event?**

Your application should notify the user of the incoming call. The notification prompt should propose the user to accept or refuse the call.

**Code sample:**
```javascript
callClient.on('incomingCall', (async (incomimgCallEvent) => {
    try {
        // Store a reference to the call object
        incomingCall = incomimgCallEvent.incomingCall; 
        // Update your UI to allow
        acceptCallButton.disabled = false; 
        callButton.disabled = true;
    } catch (error) {
        console.error(error);
    }
});
```

### Event Name: `callsUpdated`

The `callsUpdated` updated event is fired when a call is removed or added to the call agent. This event happens when the user makes, receives, or terminates a call.

**How should your application react to the event?**
Your application should update its UI based on the number of active calls for the CallAgent instance.

### Event Name: `connectionStateChanged`

The `connectionStateChanged` event fired when the signaling state of the `CallAgent` is updated.

**How should your application react to the event?**

Your application should update its UI based on the new state. The possible connection state values are `Connected` and `Disconnected`

**Code sample:**
```javascript
callClient.on('connectionStateChanged', (async (connectionStateChangedEvent) => {
    if (connectionStateChangedEvent.newState === "Connected") {
        enableCallControls() // Enable all UI element that allow user to make a call
    }

    if (connectionStateChangedEvent.newState === 'Disconnected') {
        if (typeof connectionStateChangedEvent.reason !== 'undefined') {
            alert(`Disconnected reason: ${connectionStateChangedEvent.reason}`)
        } 
        disableCallControls() // Disable all the UI element that allows the user to make a call
    }
});
```

<!---------- Call object ---------->
## Events on the `Call` object

### Event Name: `stateChanged`

The `stateChanged`  event is fired when the call state changes. For example, when a call goes from `connected` to `disconnected`.

**How should your application react to the event?**

Your application should update its UI accordingly. Disabling or enabling appropriate buttons and other UI elements based on the new call state.

**Code Sample:**

```javascript
call.on('stateChanged', (async (connectionStateChangedEvent) => {
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
```

### Event: `idChanged`

The `idChanged`  event is fired when the ID of a call changes. The ID of a call changes when the call moves from `connecting` state to `connected`. Once the call is connected, the ID of the call remains identical.

**How might your application react to the event?**

Your application should save the new call ID but it can also be retrieved from the call object later when needed.

**Code Sample:**

```javascript
let callId = "";
call.on('idChanged', (async (callIdChangedEvent) => {
  callId = call.id; // You can log it as the call ID is useful for debugging call issues
});
```

### Event: `isMutedChanged`

The `isMutedChanged` event is fired when the local audio is muted or unmuted.

**How might your application react to the event?**

Your application should update the mute / unmute button to the proper state.

**Code Sample:**

```javascript
call.on('isMutedChanged', (async (isMutedChangedEvent) => {
    microphoneButton.disabled = call.isMuted;       
});
```

### Event: `isScreenSharingOnChanged`

The `isScreenSharingOnChanged` event is fired when screen sharing for the local user is enabled or disabled.

**How might your application react to the event?**

Your application should show a preview and/or a warning to the user if the screen sharing became on.
If the screen sharing went off, then the application should remove the preview and warning.

**Code Sample:**

```javascript
call.on('isScreenSharingOnChanged', () => {
  if (!this.call.isScreenSharing) {
      displayStartScreenSharingButton();
      hideScreenSharingWarning()
      removeScreenSharingPreview();    
  } else {
      displayScreenSharingWarning()
      displayStopScreenSharingButton();
      renderScreenSharingPreview(); 
  }
});
```

### Event: `isLocalVideoStartedChanged`

The `isLocalVideoStartedChanged` event is fired when the user enabled our disabled its local video.

**How might your application react to the event?**

Your application should show a preview of the local video and enable or disable the camera activation button.

**Code Sample:**

```javascript
call.on('isLocalVideoStartedChanged', () => {
    showdDisableCameraButton(call.isLocalVideoStarted);
});
```

### Event: `remoteParticipantsUpdated`

Your application should subscribe to event for each added `RemoteParticipants` and unsubscribe of events for participants that have left the call.

**How might your application react to the event?**
Your application should show a preview of the local video and enable or disable the camera activation button.

**Code Sample:**

```javascript
call.on('remoteParticipantsUpdated', (remoteParticipantsUpdatedEvent) => {
    remoteParticipantsUpdatedEvent.added.forEach(participant => {
        // handleParticipant should
        //   - subscribe to the remote participants events 
        //   - update the UI 
        handleParticipant(participant);
    });
    
    remoteParticipantsUpdatedEvent.removed.forEach(participant => {
        // removeParticipant should
        //   - unsubcribe from the remote participants events 
        //   - update the UI  
        removeParticipant(participant);
    });
});
```

### Event: `localVideoStreamsUpdated`

The `localVideoStreamsUpdated` event is fired when the list of local video stream changes. These changes happen when the user starts or remove a video stream.

**How might your application react to the event?**

Your application should show previews for each of `LocalVideoStream` added. Your application should remove the preview and stop the processing for each `LocalVideoStream` removed.

**Code Sample:**

```javascript
call.on('localVideoStreamsUpdated', (localVideoStreamUpdatedEvent) => {
    localVideoStreamUpdatedEvent.added.forEach(addedLocalVideoStream => { 
        // Add a preview and start any processing if needed
        handleAddedLocalVideoStream(addedLocalVideoStream) 
    });

    localVideoStreamUpdatedEvent.removed.forEach(removedLocalVideoStream => {
         // Remove the preview and stop any processing if needed
        this.handleRemovedLocalVideoStream(removedLocalVideoStream) 
    });
});
```

### Event: `remoteAudioStreamsUpdated`

The `remoteAudioStreamsUpdated` event is fired when the list of remote audio stream changes. These changes happen when remote participants add or remove audio streams to the call.

**How might your application react to the event?**

If a stream was being processed and is now removed, the processing should be stopped. On the other hand, if a stream is added then the event reception is a good place to start the processing of the new audio stream.


### Event: `totalParticipantCountChanged`

The `totalParticipantCountChanged` fires when the number of totalParticipant changed in a call.

**How might your application react to the event?**

If your application is displaying a participant counter, your application can update its participant counter when the event is received.

**Code Sample:**

```javascript
call.on('totalParticipantCountChanged', () => {
    participantCounterElement.innerText = call.totalParticipantCount;
});
```

</details>

### Event: `roleChanged`

The `roleChanged` participant fires when the localParticipant roles changes in the call. An example would be when the local participant become presenter `ACSCallParticipantRolePresenter` in a call.

**How might your application react to the event?**
Your application should enable or disabled button base on the user new role.

**Code Sample:**

```javascript
call.on('roleChanged', () => {
    this.roleElement = call.role;
});
```

### Event: `mutedByOthers`

The `mutedByOthers` event happens when other participants in the call are muted by the local participant.


**How might your application react to the event?**
Your application should display a message to the user notifying it was muted.

**Code Sample:**

```javascript
call.on('mutedByOthers', () => {
    messageBanner.innerText = "You have been muted by other participant in this call";
});
```

<!---- RemoteParticipant  ---->
## Events on the `RemoteParticipant` object

### Event: `roleChanged`

The `roleChanged` event fires when the `RemotePartipant` role changes in the call. An example would be when the RemoteParticipant become presenter `ACSCallParticipantRolePresenter` in a call.

**How might your application react to the event?**
Your application should update its UI based on the `RemoteParticipant` new role.

**Code Sample:**

```javascript
remoteParticipant.on('roleChanged', () => {
    updateRole(remoteParticipant);
});
```

### Event: `isMutedChanged`

The `isMutedChanged` event fires when one of the `RemoteParticipant` mutes or unmute its microphone.

**How might your application react to the event?**

Your application may display an icon near by the view that displays the participant.

**Code Sample:**

```javascript
remoteParticipant.on('isMutedChanged', () => {
    updateMuteStatus(remoteParticipant); // Update the UI based on the mute state of the participant
});
```

### Event: `displayNameChanged`

The `displayNameChanged` when the name of the `RemoteParticipant` is updated.

**How might your application react to the event?**

Your application should update the name of the participant if it's being displayed in the UI.

**Code Sample:**

```javascript
remoteParticipant.on('displayNameChanged', () => {
    remoteParticipant.nameLabel.innerText = remoteParticipant.displayName;
});
```

### Event: `isSpeakingChanged`

The `isSpeakingChanged` when the dominant speaker in a call changes.

**How might your application react to the event?**

Your application UI should give priority to display the `RemotePartipant` who became dominant speaker.

**Code Sample:**

```javascript
remoteParticipant.on('isSpeakingChanged', () => {
    showAsRemoteSpeaker(remoteParticipant) // Display a speaking icon near the participant
});
```

### Event: `videoStreamsUpdated`

The `videoStreamsUpdated` when a remote participant adds or removes a VideoStream to/from the call.

**How might your application react to the event?**

If your application was processing a stream that is removed. Your application should stop the processing. When a new stream is added, your application may want to render or process it.

**Code Sample:**

```javascript
remoteParticipant.on('videoStreamsUpdated', (videoStreamsUpdatedEvent) => {

     videoStreamsUpdatedEvent.added.forEach(addedRemoteVideoStream => { 
       // Remove a renderer and start processing the stream if any processing is needed
        handleAddedRemoteVideoStream(addedRemoteVideoStream) 
    });

    videoStreamsUpdatedEvent.removed.forEach(removedRemoteVideoStream => {
        // Remove the renderer and stop processing the stream if any processing is ongoing
        this.handleRemovedRemoteVideoStream(removedRemoteVideoStream) 
    });
});
```

<!-- AudioEffectsFeature -->

## Event on the `AudioEffectsFeature` object

### Event: `effectsStarted`

This event occurs when the audio effect selected is applied to the audio stream. For example, when someone turns on Noise Suppression the `effectsStarted` will be fired.

**How might your application react to the event?**

Your application can display or enable a button that allows the user to disable the audio effect.

**Code Sample:**

```javascript
audioEffectsFeature.on('effectsStarted', (effects) => {
    stopEffectButton.style.visibility = "visible"; 
});
```

### Event: `effectsStopped`

This event occurs when the audio effect selected is applied to the audio stream. For example, when someone turns off Noise Suppression the `effectsStopped` will be fired.

**How might your application react to the event?**

Your application can display or enable a button that allows the user to enable the audio effect.

**Code Sample:**

```javascript
audioEffectsFeature.on('effectsStopped', (effects) => {
    startEffectButton.style.visibility = "visible"; 
});
```

### Event: `effectsError`

This event occurs when an error happens while an audio effect is started or applied.

**How might your application react to the event?**

Your application should display an alert or an error message that the audio effect isn't working as expected.

**Code Sample:**

```javascript
audioEffectsFeature.on('effectsError', (error) => {
    console.log(`Error with the audio effect ${error}`);
    alert(`Error with the audio effect`);
});
```
