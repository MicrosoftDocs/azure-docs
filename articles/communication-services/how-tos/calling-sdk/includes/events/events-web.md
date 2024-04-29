---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2021
ms.author: rifox
---
## Events on the Azure Communication Calling SDK

This guide describes the various events or properties changes your app can subscribe to. Subscribing to those events allows your app to be informed about state change in the calling SDK and react accordingly.

This guide assumes you went through the QuickStart or have an application that is able to make and receive calls. If you didn't complete the getting starting guide, refer to our [Quickstart](../../../../quickstarts/voice-video-calling/getting-started-with-calling.md).

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
 call.on('localVideoStreamsUpdated', e => {
    e.added.forEach(async (lvs) => {
      console.log(`e.added contains an array of LocalVideoStream that were added to the call`);
    });
    e.removed.forEach(lvs => {
         console.log(`e.removed contains an array of LocalVideoStream that were removed from the call`);
    });
});
```

### Events on the `Call` object

#### Event Name: `stateChanged`

**When does it occur ?**

The `stateChanged`  events is fired when the call state changes. For example when a call goes from `connected` to `disconnected`.

**How should your application react to the event ?**

Your application should update its UI accordingly. Disabling or enabling appropriate buttons and other UI elements based on the new call state.

#### Event: `stateChanged`

**When does it occur ?**

The `stateChanged`  event is fired when the call state changes. For example when a call goes from `connected` to `disconnected`.

**How might your application react to the event ?**

Your application should update its UI accordingly. Disabling or enabling appropriate buttons and other UI elements based on the new call state.

#### Event: `idChanged`

**When does it occur ?**

The `idChanged`  event is fired when the id of a call changes. The id of a call changes when the call moves from `connecting` state to `connected`. Once the call is connected the ID of the call remains identitcal.

**How might your application react to the event ?**

Your application should save the new call ID but it can also be retreived from the call object later when needed.

#### Event: `isMutedChanged`

**When does it occur ?**

The `isMutedChanged` event is fired when the call is muted or unmuted.

**How might your application react to the event ?**

Your application should update the mute / unmute button to the proper state.

#### Event: `isScreenSharingOnChanged`

**When does it occur ?**

The `isScreenSharingOnChanged` event is fired when screensharing for the local user is enabled or disabled.

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

Your application should subrscibe to event for each added `RemoteParticipants` and unsubscribe of events for participant that are gone from the call.

**How might your application react to the event ?**

Your application should show a preview of the local video and enable or disable the camera activation button.

#### Event: `localVideoStreamsUpdated`

**When does it occur ?**

The `localVideoStreamsUpdated` event is fired when the list of remote particpants changes. These changes happen when particpants join or leave the call

**How might your application react to the event ?**

Your application should show previews for the `LocalVideoStream` added.

#### Event: `remoteAudioStreamsUpdated`

**When does it occur ?**

The `remoteAudioStreamsUpdated` event is fired when the list of remote audio stream. These changes happen when remote particpants add or remove audio streams to the call.

**How might your application react to the event ?**

If a stream was being processed and is now removed, the processing should be stopped. On the other hand, if a stream is added then the event reception is a good place to start the processing of the new audio stream.

#### Event: `totalParticipantCountChanged`

**When does it occur ?**

The `totalParticipantCountChanged` fires when the number of totalParticipant changed in a call.

**How might your application react to the event ?**

If your application is displaying a participant counter,  your application can update it's  participant counter when the event is received.

#### Event: `roleChanged`

**When does it occur ?**

The `roleChanged` participant fires when the localParticipant roles changes in the call. An example would be when the local particpant become presenter `ACSCallParticipantRolePresenter` in a call.

**How might your application react to the event ?**
Your application should enable or disabled button base on the user new role.
