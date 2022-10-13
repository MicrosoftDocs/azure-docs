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

To join a room call, set up your web application using the [Add video calling to your client app](../../voice-video-calling/get-started-with-video-calling.md?pivots=platform-ios) guide. Alternatively, you can download the video calling quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/Add%20Video%20Calling).

You'll need a User Access Token when initializing a CallAgent instance to join room calls. Once you have a token, Add the following code to the `onAppear` callback in `ContentView.swift`. You'll need to replace `<USER ACCESS TOKEN>` with a valid user access token for your resource:

```Swift
var userCredential: CommunicationTokenCredential?
do {
    userCredential = try CommunicationTokenCredential(token: "<USER ACCESS TOKEN>")
} catch {
    print("ERROR: It was not possible to create user credential.")
    return
}
```

To create a CallAgent instance from a CallClient, use the `callClient.createCallAgent` method that asynchronously returns a CallAgent object once it's initialized. DeviceManager lets you enumerate local devices that can be used in a call to transmit audio/video streams. It also allows you to request permission from a user to access microphone/camera. 

```Swift
self.callClient = CallClient()
self.callClient?.createCallAgent(userCredential: userCredential!) { (agent, error) in
    if error != nil {
        print("ERROR: It was not possible to create a call agent.")
        return
    } else {
        self.callAgent = agent
        print("Call agent successfully created.")
        self.callAgent!.delegate = callHandler
        self.callClient?.getDeviceManager { (deviceManager, error) in
            if (error == nil) {
                print("Got device manager instance")
                self.deviceManager = deviceManager
            } else {
                print("Failed to get device manager instance")
            }
        }
    }
}
```

The `joinRoomCall` method is set as the action that will be performed when the Join Room Call button is tapped.

```Swift
func joinRoomCall() {
    if self.callAgent == nil {
        print("CallAgent not initialized")
        return
    }
    
    if (self.roomId.isEmpty) {
        print("Room ID not set")
        return
    }
    
    // Join a call with a Room ID
    let options = JoinCallOptions()
    let audioOptions = AudioOptions()
    audioOptions.muted = self.muted
    
    options.audioOptions = audioOptions
    
    let roomCallLocator = RoomCallLocator(roomId: roomId)
    self.callAgent!.join(with: roomCallLocator, joinCallOptions: options) { (call, error) in
        self.setCallAndObserver(call: call, error: error)
    }
}
```

`CallObserver` is used to manage mid-call events and remote participants. We'll set the observers in the `setCallAndOberserver` function.

```Swift
func setCallAndObserver(call:Call!, error:Error?) {
    if (error == nil) {
        self.call = call
        self.callObserver = CallObserver(view:self)

        self.call!.delegate = self.callObserver

        if (self.call!.state == CallState.connected) {
            self.callObserver!.handleInitialCallState(call: call)
        }
    } else {
        print("Failed to get call object")
    }
}
```

To display the role of the local or remote call participants, subscribe to the handler below.

```swift
// Subscribe to changes for your role in a call
public func call(_ call: Call, didChangeRole args: PropertyChangedEventArgs) {
    // handle self-role change
}

// Subscribe to role changes for remote participants
func remoteParticipant(_ remoteParticipant: RemoteParticipant, didChangeRole args: PropertyChangedEventArgs) {
    // handle remote participant role change
}
```

You can learn more about roles of room call participants in the [rooms concept documentation](../../../concepts/rooms/room-concept.md#predefined-participant-roles-and-permissions).