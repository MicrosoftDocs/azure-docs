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