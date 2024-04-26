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

#### Event Name**: `stateChanged`

**When does it occurs ?**
The `stateChanged`  events is fired when the call state changes. For example when a call goes from `connected` to `disconnected`.

**How should your application react to the event ?**
Your application should update its UI accordingly. Disabling or enabling appropriate buttons and other UI elements based on the new call state.
