---
author: mikben
ms.service: azure-communication-services
ms.topic: include
ms.date: 06/30/2021
ms.author: mikben
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Azure Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md).
- A user access token to enable the call client. [Get a user access token](../../../access-tokens.md).
- Optional: Complete the [Add voice calling to your app](../../getting-started-with-calling.md) quickstart.

## Set up your system

### Create the Xcode project

In Xcode, create a new iOS project and select the **Single View App** template. This quickstart uses the [SwiftUI framework](https://developer.apple.com/xcode/swiftui/), so you should set the **Language** to **Swift** and **User Interface** to **SwiftUI**. 

You're not going to create unit tests or UI tests during this quickstart. Feel free to clear the **Include Unit Tests** and **Include UI Tests** text boxes.

:::image type="content" source="../../media/ios/xcode-new-ios-project.png" alt-text="Screenshot that shows the window for creating a project within Xcode.":::

### Install the package and dependencies with CocoaPods

1. Create a Podfile for your application, like this:

   ```
   platform :ios, '13.0'
   use_frameworks!
   target 'AzureCommunicationCallingSample' do
     pod 'AzureCommunicationCalling', '~> 1.0.0'
   end
   ```

2. Run `pod install`.
3. Open `.xcworkspace` with Xcode.

### Request access to the microphone

To access the device's microphone, you need to update your app's information property list with `NSMicrophoneUsageDescription`. You set the associated value to a `string` that will be included in the dialog that the system uses to request access from the user.

Right-click the `Info.plist` entry of the project tree and select **Open As** > **Source Code**. Add the following lines in the top-level `<dict>` section, and then save the file.

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Need microphone access for VOIP calling.</string>
```

### Set up the app framework

Open your project's *ContentView.swift* file and add an `import` declaration to the top of the file to import the `AzureCommunicationCalling` library. In addition, import `AVFoundation`. You'll need it for audio permission requests in the code.

```swift
import AzureCommunicationCalling
import AVFoundation
```

## Learn the object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK for iOS.

> [!NOTE]
> This quickstart uses version 1.0.0-beta.8 of the Calling SDK.


| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| `CallClient` | `CallClient` is the main entry point to the Calling SDK.|
| `CallAgent` | `CallAgent` is used to start and manage calls. |
| `CommunicationTokenCredential` | `CommunicationTokenCredential` is used as the token credential to instantiate `CallAgent`.| 
| `CommunicationIdentifier` | `CommunicationIdentifier` is used to represent the identity of the user. The identity can be `CommunicationUserIdentifier`, `PhoneNumberIdentifier`, or `CallingApplication`. |

> [!NOTE]
> When the application implements event delegates, it has to hold a strong reference to the objects that require event subscriptions. For example, when a `RemoteParticipant` object is returned on invoking the `call.addParticipant` method and the application sets the delegate to listen on `RemoteParticipantDelegate`, the application must hold a strong reference to the `RemoteParticipant` object. Otherwise, if this object gets collected, the delegate will throw a fatal exception when the Calling SDK tries to invoke the object.

## Initialize CallAgent

To create a `CallAgent` instance from `CallClient`, you have to use a `callClient.createCallAgent` method that asynchronously returns a `CallAgent` object after it's initialized.

To create a call client, you have to pass a `CommunicationTokenCredential` object.

```swift

import AzureCommunication

let tokenString = "token_string"
var userCredential: CommunicationTokenCredential?
do {
    let options = CommunicationTokenRefreshOptions(initialToken: token, refreshProactively: true, tokenRefresher: self.fetchTokenSync)
    userCredential = try CommunicationTokenCredential(withOptions: options)
} catch {
    updates("Couldn't created Credential object", false)
    initializationDispatchGroup!.leave()
    return
}

// tokenProvider needs to be implemented by Contoso, which fetches a new token
public func fetchTokenSync(then onCompletion: TokenRefreshOnCompletion) {
    let newToken = self.tokenProvider!.fetchNewToken()
    onCompletion(newToken, nil)
}
```

Pass the `CommunicationTokenCredential` object that you created to `CallClient`, and set the display name.

```swift

self.callClient = CallClient()
let callAgentOptions = CallAgentOptions()
options.displayName = " iOS ACS User"

self.callClient!.createCallAgent(userCredential: userCredential!,
    options: callAgentOptions) { (callAgent, error) in
        if error == nil {
            print("Create agent succeeded")
            self.callAgent = callAgent
        } else {
            print("Create agent failed")
        }
})

```

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

### Place a 1:1 call with video
To get a device manager instance, see the section about [managing devices](#manage-devices).

```swift

let firstCamera = self.deviceManager!.cameras.first
self.localVideoStreams = [LocalVideoStream]()
self.localVideoStreams!.append(LocalVideoStream(camera: firstCamera!))
let videoOptions = VideoOptions(localVideoStreams: self.localVideoStreams!)

let startCallOptions = StartCallOptions()
startCallOptions.videoOptions = videoOptions

let callee = CommunicationUserIdentifier('UserId')
self.callAgent?.startCall(participants: [callee], options: startCallOptions) { (call, error) in
     if error == nil {
         print("Successfully started outgoing video call")
         self.call = call
     } else {
         print("Failed to start outgoing video call")
     }
}

```

### Join a group call
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

### Subscribe to an incoming call
Subscribe to an incoming call event.

```
final class IncomingCallHandler: NSObject, CallAgentDelegate, IncomingCallDelegate
{
    // Event raised when there is an incoming call
    public func callAgent(_ callAgent: CallAgent, didRecieveIncomingCall incomingcall: IncomingCall) {
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

## Set up push notifications

A mobile push notification is the pop-up notification that you get in the mobile device. For calling, we'll focus on VoIP (voice over Internet Protocol) push notifications. 

The following sections describe how to register for, handle, and unregister push notifications. Before you start those tasks, complete these prerequisites:

1. In Xcode, go to **Signing & Capabilities**. Add a capability by selecting **+ Capability**, and then select **Push Notifications**.
2. Add another capability by selecting **+ Capability**, and then select **Background Modes**.
3. Under **Background Modes**, select the **Voice over IP** and **Remote notifications** checkboxes.

:::image type="content" source="../../media/ios/xcode-push-notification.png" alt-text="Screenshot that shows how to add capabilities in Xcode." lightbox="../../media/ios/xcode-push-notification.png":::

### Register for push notifications

To register for push notifications, call `registerPushNotification()` on a `CallAgent` instance with a device registration token.

Registration for push notifications needs to happen after successful initialization. When the `callAgent` object is destroyed, `logout` will be called, which will automatically unregister push notifications.


```swift

let deviceToken: Data = pushRegistry?.pushToken(for: PKPushType.voIP)
callAgent.registerPushNotifications(deviceToken: deviceToken!) { (error) in
    if(error == nil) {
        print("Successfully registered to push notification.")
    } else {
        print("Failed to register push notification.")
    }
}

```

### Handle push notifications
To receive push notifications for incoming calls, call `handlePushNotification()` on a `CallAgent` instance with a dictionary payload.

```swift

let callNotification = PushNotificationInfo.fromDictionary(pushPayload.dictionaryPayload)

callAgent.handlePush(notification: callNotification) { (error) in
    if (error == nil) {
        print("Handling of push notification was successful")
    } else {
        print("Handling of push notification failed")
    }
}

```
### Unregister push notifications

Applications can unregister push notification at any time. Simply call the `unregisterPushNotification` method on `CallAgent`.

> [!NOTE]
> Applications are not automatically unregistered from push notifications on logout.

```swift

callAgent.unregisterPushNotification { (error) in
    if (error == nil) {
        print("Unregister of push notification was successful")
    } else {
       print("Unregister of push notification failed, please try again")
    }
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

### Start and stop sending local video

To start sending local video to other participants in a call, use the `startVideo` API and pass `localVideoStream` with `camera`.

```swift

let firstCamera: VideoDeviceInfo? = self.deviceManager!.cameras.first
let localVideoStream = LocalVideoStream(camera: firstCamera!)

call!.startVideo(stream: localVideoStream) { (error) in
    if (error == nil) {
        print("Local video started successfully")
    } else {
        print("Local video failed to start")
    }
}

```

After you start sending video, the `LocalVideoStream` instance is added the `localVideoStreams` collection on a call instance.

```swift

call.localVideoStreams

```

To stop local video, pass the `localVideoStream` instance returned from the invocation of `call.startVideo`. This is an asynchronous action.

```swift

call!.stopVideo(stream: localVideoStream) { (error) in
    if (error == nil) {
        print("Local video stopped successfully")
    } else {
        print("Local video failed to stop")
    }
}

```

## Manage remote participants

All remote participants are represented by the `RemoteParticipant` type and are available through the `remoteParticipants` collection on a call instance.

### List participants in a call

```swift

call.remoteParticipants

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

## Render remote participant video streams

Remote participants can initiate video or screen sharing during a call.

### Handle video-sharing or screen-sharing streams of remote participants

To list the streams of remote participants, inspect the `videoStreams` collections.

```swift

var remoteParticipantVideoStream = call.remoteParticipants[0].videoStreams[0]

```

### Get remote video stream properties

```swift

var type: MediaStreamType = remoteParticipantVideoStream.type // 'MediaStreamTypeVideo'

var isAvailable: Bool = remoteParticipantVideoStream.isAvailable // indicates if remote stream is available

var id: Int = remoteParticipantVideoStream.id // id of remoteParticipantStream

```

### Render remote participant streams

To start rendering remote participant streams, use the following code.

```swift

let renderer = VideoStreamRenderer(remoteVideoStream: remoteParticipantVideoStream)
let targetRemoteParticipantView = renderer?.createView(withOptions: CreateViewOptions(scalingMode: ScalingMode.crop))
// To update the scaling mode later
targetRemoteParticipantView.update(scalingMode: ScalingMode.fit)

```

### Get remote video renderer methods and properties

```swift
// [Synchronous] dispose() - dispose renderer and all `RendererView` associated with this renderer. To be called when you have removed all associated views from the UI.
remoteVideoRenderer.dispose()
```

## Manage devices

`DeviceManager` lets you enumerate local devices that can be used in a call to transmit audio or video streams. It also allows you to request permission from a user to access a microphone or camera. You can access `deviceManager` on the `callClient` object.

```swift

self.callClient!.getDeviceManager { (deviceManager, error) in
        if (error == nil) {
            print("Got device manager instance")
            self.deviceManager = deviceManager
        } else {
            print("Failed to get device manager instance")
        }
    }
```

### Enumerate local devices

To access local devices, you can use enumeration methods on the device manager. Enumeration is a synchronous action.

```swift
// enumerate local cameras
var localCameras = deviceManager.cameras // [VideoDeviceInfo, VideoDeviceInfo...]

``` 

### Get a local camera preview

You can use `Renderer` to begin rendering a stream from your local camera. This stream won't be sent to other participants; it's a local preview feed. This is an asynchronous action.

```swift

let camera: VideoDeviceInfo = self.deviceManager!.cameras.first!
let localVideoStream = LocalVideoStream(camera: camera)
let localRenderer = try! VideoStreamRenderer(localVideoStream: localVideoStream)
self.view = try! localRenderer.createView()

```

### Get local camera preview properties

The renderer has set of properties and methods that allow you to control the rendering.

```swift

// Constructor can take in LocalVideoStream or RemoteVideoStream
let localRenderer = VideoStreamRenderer(localVideoStream:localVideoStream)
let remoteRenderer = VideoStreamRenderer(remoteVideoStream:remoteVideoStream)

// [StreamSize] size of the rendering view
localRenderer.size

// [VideoStreamRendererDelegate] an object you provide to receive events from this Renderer instance
localRenderer.delegate

// [Synchronous] create view
try! localRenderer.createView()

// [Synchronous] create view with rendering options
try! localRenderer!.createView(withOptions: CreateViewOptions(scalingMode: ScalingMode.fit))

// [Synchronous] dispose rendering view
localRenderer.dispose()

```

## Record calls
> [!WARNING]
> Up until version 1.1.0 and beta release version 1.1.0-beta.1 of the ACS Calling iOS SDK has the `isRecordingActive` as part of the `Call` object and `didChangeRecordingState` is part of `CallDelegate` delegate. For new beta releases, those APIs have been moved as an extended feature of `Call` just like described below.
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling iOS SDK

Call recording is an extended feature of the core `Call` API. You first need to obtain the recording feature API object:

```swift
let callRecordingFeature = call.api(RecordingFeature.self)
```

Then, to check if the call is being recorded, inspect the `isRecordingActive` property of `callRecordingFeature`. It returns `Bool`.

```swift
let isRecordingActive = callRecordingFeature.isRecordingActive;
```

You can also subscribe to recording changes by implementing `RecordingFeatureDelegate` delegate on your class with the event `didChangeRecordingState`:

```swift
callRecordingFeature.delegate = self

// didChangeRecordingState is a member of RecordingFeatureDelegate
public func recordingFeature(_ recordingFeature: RecordingFeature, didChangeRecordingState args: PropertyChangedEventArgs) {
	let isRecordingActive = recordingFeature.isRecordingActive
}
```

If you want to start recording from your application, please first follow [Calling Recording overview](../../../../concepts/voice-video-calling/call-recording.md) for the steps to set up call recording.

Once you have the call recording setup on your server, from your iOS application you need to obtain the `ServerCallId` value from the call and then send it to your server to start the recording process. The `ServerCallId` value can be found using `getServerCallId()` from the `CallInfo` class, which can be found in the class object using `getInfo()`.

```swift
let serverCallId = call.info.getServerCallId(){ (serverId, error) in }
// Send serverCallId to your recording server to start the call recording.
```

When recording is started from the server, the event `didChangeRecordingState` will trigger and the value of `recordingFeature.isRecordingActive` will be `true`.

Just like starting the call recording, if you want to stop the call recording you need to get the `ServerCallId` and send it to your recording server so that it can stop the call recording.

```swift
let serverCallId = call.info.getServerCallId(){ (serverId, error) in }
// Send serverCallId to your recording server to stop the call recording.
```

When recording is stopped from the server, the event `didChangeRecordingState` will trigger and the value of `recordingFeature.isRecordingActive` will be `false`.

## Call transcription
> [!WARNING]
> Up until version 1.1.0 and beta release version 1.1.0-beta.1 of the ACS Calling iOS SDK has the `isTranscriptionActive` as part of the `Call` object and `didChangeTranscriptionState` is part of `CallDelegate` delegate. For new beta releases, those APIs have been moved as an extended feature of `Call` just like described below.
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling iOS SDK

Call transcription is an extended feature of the core `Call` API. You first need to obtain the transcription feature API object:

```swift
let callTranscriptionFeature = call.api(TranscriptionFeature.self)
```

Then, to check if the call is transcribed, inspect the `isTranscriptionActive` property of `callTranscriptionFeature`. It returns `Bool`.

```swift
let isTranscriptionActive = callTranscriptionFeature.isTranscriptionActive;
```

You can also subscribe to transcription changes by implementing `TranscriptionFeatureDelegate` delegate on your class with the event `didChangeTranscriptionState`:

```swift
callTranscriptionFeature.delegate = self

// didChangeTranscriptionState is a member of TranscriptionFeatureDelegate
public func transcriptionFeature(_ transcriptionFeature: TranscriptionFeature, didChangeTranscriptionState args: PropertyChangedEventArgs) {
	let isTranscriptionActive = transcriptionFeature.isTranscriptionActive
}
```

## Subscribe to notifications

You can subscribe to most of the properties and collections to be notified when values change.

### Properties
To subscribe to `property changed` events, use the following code.

```swift
call.delegate = self
// Get the property of the call state by getting on the call's state member
public func call(_ call: Call, didChangeState args: PropertyChangedEventArgs) {
{
    print("Callback from SDK when the call state changes, current state: " + call.state.rawValue)
}

 // to unsubscribe
 self.call.delegate = nil

```

### Collections
To subscribe to `collection updated` events, use the following code.

```swift
call.delegate = self
// Collection contains the streams that were added or removed only
public func call(_ call: Call, didUpdateLocalVideoStreams args: LocalVideoStreamsUpdatedEventArgs) {
{
    print(args.addedStreams.count)
    print(args.removedStreams.count)
}
// to unsubscribe
self.call.delegate = nil
```
