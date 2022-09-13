---
title: include file
description: include file
services: azure-communication-services
author: radubulboaca
manager: mariusu

ms.service: azure-communication-services
ms.date: 07/13/2022
ms.topic: include
ms.custom: include file
ms.author: radubulboaca
---

## Join a room call

To join a room call, set up your web application using the [Add video calling to your client app](../../voice-video-calling/get-started-with-video-calling.md?pivots=platform-android) guide. Alternatively, you can download the video calling quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/videoCallingQuickstart).

Create a `CallAgent` with a valid user token:

```Java
private fun createAgent() {
    val userToken: String = checkNotNull(null){"userToken must be set"}

    try {
        val credential = CommunicationTokenCredential(userToken)
        val callClient = CallClient()
        callAgent = callClient.createCallAgent(applicationContext, credential).get()
    } catch (ex: Exception) {
        Toast.makeText(applicationContext, "Failed to create call agent.", Toast.LENGTH_SHORT).show()
    }
}
```

Use the `CallAgent` and `RoomCallLocator` to join a room call, the `CallAgent.join` method will return a `Call` object:

```Java
val roomCallLocator = RoomCallLocator(roomId)
call = callAgent.join(applicationContext, roomCallLocator, joinCallOptions)
```

Subscribe to `Call` events to get updates:

```Java
call.addOnRemoteParticipantsUpdatedListener { args: ParticipantsUpdatedEvent? ->
    handleRemoteParticipantsUpdate(
        args!!
    )
}

call.addOnStateChangedListener { args: PropertyChangedEvent? ->
    this.handleCallOnStateChanged(
        args!!
    )
}
```

To display the role of the local or remote call participants, subscribe to the handler below.

```java
// Get your role in the call
call.getRole();

// Subscribe to changes for your role in a call
private void isCallRoleChanged(PropertyChangedEvent propertyChangedEvent) {
    // handle self-role change
}

call.addOnRoleChangedListener(isCallRoleChanged);

// Subscribe to role changes for remote participants
private void isRoleChanged(PropertyChangedEvent propertyChangedEvent) {
    // handle remote participant role change
}

remoteParticipant.addOnRoleChangedListener(isRoleChanged);

// Get role of the remote participant
remoteParticipant.getRole();
```

You can learn more about roles of room call participants in the [rooms concept documentation](../../../concepts/rooms/room-concept.md#predefined-participant-roles-and-permissions).