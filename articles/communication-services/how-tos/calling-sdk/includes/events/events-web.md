---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2021
ms.author: rifox
---
## Events on the Azure Communication Calling SDK

This guide describes the various events or properties changes your app can subscribe to. Subscribing to those events allows your app to be informed about state change in the calling SDK and react accordingly.

This guide assumes you went through the QuickStart or that you implemented an application that is able to make and receive calls. If you didn't complete the getting starting guide, refer to our [Quickstart](../../../../quickstarts/voice-video-calling/getting-started-with-calling.md).

Each object in the JavaScript calling SDK has `properties` and `collections`. Their values change throughout the lifetime of the object.
Use the `on()` method to subscribe to objects' events, and use the `off()` method to unsubscribe from objects' events.

### Properties
You can subscribe to the `'<property>Changed'` event to listen to value changes on the property.

#### Example of subscription on a property
In this example, we subscribe to changes in the value of the `isLocalVideoStarted` property.

```javascript
call.on('isLocalVideoStartedChanged', () => {
    // At that point the value call.isLocalVideoStarted is updated
    console.log(`isLocalVideoStarted changed: ${call.isLocalVideoStarted}`);
});
```

### Collections
You can subscribe to the '<collection>Updated' event to receive notifications about changes in an object collection. The '<collection>Updated' event is triggered whenever elements are added to or removed from the collection you're monitoring.

- The `'<collection>Updated'` event's payload, has an `added` array that contains values that were added to the collection.
- The `'<collection>Updated'` event's payload also has a `removed` array that contains values that were removed from the collection.

#### Example subscription on a collection

In this example, we subscribe to changes in values of the Call object `LocalVideoStream`.

```javascript
 call.on('localVideoStreamsUpdated', updateEvent => {
    updateEvent.added.forEach(async (localVideoStream) => {
      console.log(`e.added contains an array of LocalVideoStream that were added to the call`);
    });
    updateEvent.removed.forEach(localVideoStream => {
         console.log(`e.removed contains an array of LocalVideoStream that were removed from the call`);
    });
});
```

<!---------- CallAgent  object ---------->
### Events on the `CallAgent` object

#### Event Name: `incomingCall`
The `incomingCall` event is fires when an incoming is coming.

<details>
<summary>View event details</summary>

**How should your application react to the event ?**

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
</details>

#### Event Name: `callsUpdated`

**When does it occur ?**
The callsUpdated updated event is fired when a call is removed or added to the call agent. This event happens when the user makes, receives, or terminate call.

**How should your application react to the event ?**
Your application should update its UI based on the number of active calls for the CallAgent instance.

#### Event Name: `connectionStateChanged`

**When does it occur ?**
The `connectionStateChanged` event fired when the state of the `CallAgent` is updated.

**How should your application react to the event ?**
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
         disableCallControls() 
    }
});
```

<!---------- Call object ---------->
### Events on the `Call` object

#### Event Name: `stateChanged`

**When does it occur ?**

The `stateChanged`  event is fired when the call state changes. For example, when a call goes from `connected` to `disconnected`.

**How should your application react to the event ?**

Your application should update its UI accordingly. Disabling or enabling appropriate buttons and other UI elements based on the new call state.

#### Event: `stateChanged`

**When does it occur ?**

The `stateChanged`  event is fired when the call state changes. For example, when a call goes from `connected` to `disconnected`.

**How might your application react to the event ?**

Your application should update its UI accordingly. Disabling or enabling appropriate buttons and other UI elements based on the new call state.

#### Event: `idChanged`

**When does it occur ?**

The `idChanged`  event is fired when the ID of a call changes. The ID of a call changes when the call moves from `connecting` state to `connected`. Once the call is connected, the ID of the call remains identical.

**How might your application react to the event ?**

Your application should save the new call ID but it can also be retrieved from the call object later when needed.

#### Event: `isMutedChanged`

**When does it occur ?**

The `isMutedChanged` event is fired when the call is muted or unmuted.

**How might your application react to the event ?**

Your application should update the mute / unmute button to the proper state.

#### Event: `isScreenSharingOnChanged`

**When does it occur ?**

The `isScreenSharingOnChanged` event is fired when screen sharing for the local user is enabled or disabled.

**How might your application react to the event ?**

Your application should show a preview and/or a warning to the user if the screen sharing became on.
If the screen sharing went off, then the application should remove the preview and warning.

#### Event: `isLocalVideoStartedChanged`

**When does it occur ?**

The `isLocalVideoStartedChanged` event is fired when the user enabled our disabled its local video.

**How might your application react to the event ?**

Your application should show a preview of the local video and enable or disable the camera activation button.

#### Event: `remoteParticipantsUpdated`

**When does it occur ?**

Your application should subscribe to event for each added `RemoteParticipants` and unsubscribe of events for participant that are gone from the call.

**How might your application react to the event ?**

Your application should show a preview of the local video and enable or disable the camera activation button.

#### Event: `localVideoStreamsUpdated`

**When does it occur ?**

The `localVideoStreamsUpdated` event is fired when the list of remote participants changes. These changes happen when participants join or leave the call.

**How might your application react to the event ?**

Your application should show previews for the `LocalVideoStream` added.

#### Event: `remoteAudioStreamsUpdated`

**When does it occur ?**

The `remoteAudioStreamsUpdated` event is fired when the list of remote audio stream. These changes happen when remote participants add or remove audio streams to the call.

**How might your application react to the event ?**

If a stream was being processed and is now removed, the processing should be stopped. On the other hand, if a stream is added then the event reception is a good place to start the processing of the new audio stream.

#### Event: `totalParticipantCountChanged`

**When does it occur ?**

The `totalParticipantCountChanged` fires when the number of totalParticipant changed in a call.

**How might your application react to the event ?**

If your application is displaying a participant counter, your application can update its participant counter when the event is received.

#### Event: `roleChanged`

**When does it occur ?**

The `roleChanged` participant fires when the localParticipant roles changes in the call. An example would be when the local participant become presenter `ACSCallParticipantRolePresenter` in a call.

**How might your application react to the event ?**
Your application should enable or disabled button base on the user new role.

<!---- RemoteParticipant  ---->

### Events on the `RemoteParticipant` object

#### Event: `stateChanged`

**When does it occur ?**

The `stateChanged` event fires when the `RemotePartipant` role changes in the call. An example would be when the RemoteParticipant become presenter `ACSCallParticipantRolePresenter` in a call.

**How might your application react to the event ?**
Your application should update its UI based on the `RemoteParticipant` new role.

#### Event: `isMutedChanged`

**When does it occur ?**

The `isMutedChanged` event fires when one of the `RemoteParticipant` mutes or unmute its microphone.

**How might your application react to the event ?**

Your application may display an icon near by the view that displays the participant.

#### Event: `displayNameChanged`

**When does it occur ?**

The `displayNameChanged` when the name of the `RemoteParticipant` is updated.

**How might your application react to the event ?**

Your application should update the name of the participant if it's being displayed in the UI.

#### Event: `roleChanged`

**When does it occur ?**

The `roleChanged` when the role of the `RemoteParticipant` is updated.

**How might your application react to the event ?**

Your application should update its UI based on the new role of the participant.

#### Event: `isSpeakingChanged`

**When does it occur ?**

The `isSpeakingChanged` when the dominant speaker in a call changes.

**How might your application react to the event ?**

Your application UI should give priority to display the `RemotePartipant` who became dominant speaker.

#### Event: `videoStreamsUpdated`

**When does it occur ?**

The `videoStreamsUpdated` when a remote participant adds or remove a VideoStream to/from the call.

**How might your application react to the event ?**

If your application was processing a stream that is removed. Your application should stop the processing. When a new stream is added your application may want to render or process it.
