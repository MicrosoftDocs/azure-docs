---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2021
ms.author: rifox
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-ios.md)]

> [!NOTE]
> When the application implements event delegates, it has to hold a strong reference to the objects that require event subscriptions. For example, when a `RemoteParticipant` object is returned on invoking the `call.addParticipant` method and the application sets the delegate to listen on `RemoteParticipantDelegate`, the application must hold a strong reference to the `RemoteParticipant` object. Otherwise, if this object gets collected, the delegate will throw a fatal exception when the Calling SDK tries to invoke the object.

## Place an outgoing call

To create and start a call, you need to call one of the APIs on `CallAgent` and provide the Communication Services identity of a user that you've provisioned by using the Communication Services Management SDK.

Call creation and start are synchronous. You'll receive a call instance that allows you to subscribe to all events on the call.

### Place a 1:1 call to a user or a 1:n call with users and PSTN

```swift
let callees = [CommunicationUser(identifier: 'UserId')]
self.callAgent?.startCall(participants: callees, options: StartCallOptions()) { (call, error) in
     if error == nil {
         print("Successfully started outgoing call")
         self.call = call
     } else {
         print("Failed to start outgoing call")
     }
}
```

### Place a 1:n call with users and PSTN
> [!NOTE]
> Please check [details of PSTN calling offering](../../../../concepts/numbers/sub-eligibility-number-capability.md). For preview program access, [apply to the early adopter program](https://aka.ms/ACS-EarlyAdopter).

To place the call to PSTN, you have to specify a phone number acquired with Communication Services.

```swift
let pstnCallee = PhoneNumberIdentifier(phoneNumber: '+1999999999')
let callee = CommunicationUserIdentifier('UserId')
self.callAgent?.startCall(participants: [pstnCallee, callee], options: StartCallOptions()) { (groupCall, error) in
     if error == nil {
         print("Successfully started outgoing call to multiple participants")
         self.call = groupCall
     } else {
         print("Failed to start outgoing call to multiple participants")
     }
}
```

## Join a room call

To join a `room` call, specify the `roomId` property as the `room` identifier. To join the call, use the `join` method and pass the `roomCallLocator`.

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

A `room` offers application developers better control over **who** can join a call, **when** they meet and **how** they collaborate. To learn more about `rooms`, you can read the [conceptual documentation](../../../../concepts/rooms/room-concept.md) or follow the [quick start guide](../../../../quickstarts/rooms/join-rooms-call.md).

## Join a group call
To join a call, you need to call one of the APIs on `CallAgent`.

```swift
let groupCallLocator = GroupCallLocator(groupId: UUID(uuidString: "uuid_string")!)
self.callAgent?.join(with: groupCallLocator, joinCallOptions: JoinCallOptions()) { (call, error) in
    if error == nil {
        print("Successfully joined group call")
        self.call = call
    } else {
        print("Failed to join group call")
    }
}
```

## Subscribe to an incoming call
Subscribe to an incoming call event.

```swift
final class IncomingCallHandler: NSObject, CallAgentDelegate, IncomingCallDelegate
{
    // Event raised when there is an incoming call
    public func callAgent(_ callAgent: CallAgent, didReceiveIncomingCall incomingcall: IncomingCall) {
        self.incomingCall = incomingcall
        // Subscribe to get OnCallEnded event
        self.incomingCall?.delegate = self
    }

    // Event raised when incoming call was not answered
    public func incomingCall(_ incomingCall: IncomingCall, didEnd args: PropertyChangedEventArgs) {
        print("Incoming call was not answered")
        self.incomingCall = nil
    }
}
```

### Accept an incoming call
To accept a call, call the `accept` method on a `IncomingCall` object.

```swift
self.incomingCall!.accept(options: AcceptCallOptions()) { (call, error) in
   if (error == nil) {
       print("Successfully accepted incoming call")
       self.call = call
   } else {
       print("Failed to accept incoming call")
   }
}

let firstCamera: VideoDeviceInfo? = self.deviceManager!.cameras.first
localVideoStreams = [LocalVideoStream]()
localVideoStreams!.append(LocalVideoStream(camera: firstCamera!))
let acceptCallOptions = AcceptCallOptions()
acceptCallOptions.videoOptions = VideoOptions(localVideoStreams: localVideoStreams!)
if let incomingCall = self.incomingCall {
    incomingCall.accept(options: acceptCallOptions) { (call, error) in
        if error == nil {
            print("Incoming call accepted")
        } else {
            print("Failed to accept incoming call")
        }
    }
} else {
  print("No incoming call found to accept")
}
```

## Perform mid-call operations

You can perform various operations during a call to manage settings related to video and audio.

### Mute and unmute

To mute or unmute the local endpoint, you can use the `mute` and `unmute` asynchronous APIs.

```swift
call!.mute { (error) in
    if error == nil {
        print("Successfully muted")
    } else {
        print("Failed to mute")
    }
}
```

Use the following code to unmute the local endpoint asynchronously.

```swift
call!.unmute { (error) in
    if error == nil {
        print("Successfully un-muted")
    } else {
        print("Failed to unmute")
    }
}
```

## Mute other participants
> [!NOTE]
> This API is provided as a public preview for developers and may change based on feedback that we receive.

To mute all other participants in a call, use the `muteAllRemoteParticipants` API on the call.

```swift
call!.muteAllRemoteParticipants { (error) in
    if error == nil {
        print("Successfully muted all remote participants.")
    } else {
        print("Failed to mute remote participants.")
    }
}
```

To mute a specific remote participant, use the `mute` API on a given remote participant.

```swift
remoteParticipant.mute { (error) in
    if error == nil {
        print("Successfully muted participant.")
    } else {
        print("Failed to mute participant.")
    }
}
```


## Manage remote participants

All remote participants are represented by the `RemoteParticipant` type and are available through the `remoteParticipants` collection on a call instance.

### List participants in a call

```swift
call.remoteParticipants
```

### Add a participant to a call

To add a participant to a call (either a user or a phone number), you can invoke `addParticipant`. This command will synchronously return a remote participant instance.

```swift
let remoteParticipantAdded: RemoteParticipant = call.add(participant: CommunicationUserIdentifier(identifier: "userId"))
```

### Remove a participant from a call
To remove a participant from a call (either a user or a phone number), you can invoke the `removeParticipant` API. This will resolve asynchronously.

```swift
call!.remove(participant: remoteParticipantAdded) { (error) in
    if (error == nil) {
        print("Successfully removed participant")
    } else {
        print("Failed to remove participant")
    }
}
```

### Get remote participant properties

```swift
// [RemoteParticipantDelegate] delegate - an object you provide to receive events from this RemoteParticipant instance
var remoteParticipantDelegate = remoteParticipant.delegate

// [CommunicationIdentifier] identity - same as the one used to provision a token for another user
var identity = remoteParticipant.identifier

// ParticipantStateIdle = 0, ParticipantStateEarlyMedia = 1, ParticipantStateConnecting = 2, ParticipantStateConnected = 3, ParticipantStateOnHold = 4, ParticipantStateInLobby = 5, ParticipantStateDisconnected = 6
var state = remoteParticipant.state

// [Error] callEndReason - reason why participant left the call, contains code/subcode/message
var callEndReason = remoteParticipant.callEndReason

// [Bool] isMuted - indicating if participant is muted
var isMuted = remoteParticipant.isMuted

// [Bool] isSpeaking - indicating if participant is currently speaking
var isSpeaking = remoteParticipant.isSpeaking

// RemoteVideoStream[] - collection of video streams this participants has
var videoStreams = remoteParticipant.videoStreams // [RemoteVideoStream, RemoteVideoStream, ...]
```