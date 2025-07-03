---
author: fuyan
ms.service: azure-communication-services
ms.topic: include
ms.date: 05/06/2025
ms.author: fuyan
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

## Implement display name change

`DisplayNameChanged` is an `event` and `hasDisplayNameChanged` is a property of the class `RemoteParticipant`. You can get remote participants on `Call` object `remoteParticipants` property from the Calling SDK:

```js
const remoteParticipants = call.remoteParticipants;
```

### Check if remote participant has display name change

To check if display name changed, use the `hasDisplayNameChanged` property of the class `RemoteParticipant` . 

```js
// check if remoteParticipant has display name changed
const hasDisplayNameChanged = remoteParticipant.hasDisplayNameChanged;
```

### Get notification that displays name changed

Use the `PropertyChangedEventWithArgs` listener to subscribe the display name change event

```js
// get notification of a remote participant display name changed
remoteParticipant.on('displayNameChanged', (args: {newValue?: string, oldValue?: string, reason?: DisplayNameChangedReason}) => {
    console.log(`Display name changed from ${oldValue} to ${newValue} due to ${reason}`);
});
```

## SDK compatibility

The following table shows the minimum version of SDK that supports individual APIs.

| Operations | Web | Web UI | iOS | iOS UI | Android | Android UI | Windows | 
|-------------|-----|--------|-----|--------|---------|------------|---------|
|hasDisplayNameChanged property |1.34.1|❌|❌|❌|❌|❌|❌|
|DisplayNameChanged event |1.34.1|❌|❌|❌|❌|❌|❌|


