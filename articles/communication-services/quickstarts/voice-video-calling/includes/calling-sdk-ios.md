---
author: mikben
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/10/2021
ms.author: mikben
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../access-tokens.md)
- Optional: Complete the quickstart for [getting started with adding calling to your application](../getting-started-with-calling.md)

## Setting up

### Creating the Xcode project

> [!NOTE]
> This document uses version 1.0.0-beta.8 of the Calling SDK.

In Xcode, create a new iOS project and select the **Single View App** template. This quickstart uses the [SwiftUI framework](https://developer.apple.com/xcode/swiftui/), so you should set the the **Language** to **Swift** and the **User Interface** to **SwiftUI**. You're not going to create unit tests or UI tests during this quickstart. Feel free to uncheck **Include Unit Tests** and also uncheck **Include UI Tests**.

:::image type="content" source="../media/ios/xcode-new-ios-project.png" alt-text="Screenshot showing the create new New Project window within Xcode.":::

### Install the package and dependencies with CocoaPods

1. Create a Podfile for your application, like this:

   ```
   platform :ios, '13.0'
   use_frameworks!
   target 'AzureCommunicationCallingSample' do
     pod 'AzureCommunicationCalling', '~> 1.0.0-beta.8'
     pod 'AzureCommunication', '~> 1.0.0-beta.8'
     pod 'AzureCore', '~> 1.0.0-beta.8'
   end
   ```

2. Run `pod install`.
3. Open the `.xcworkspace` with XCode.

### Request access to the microphone

In order to access the device's microphone, you need to update your app's Information Property List with an `NSMicrophoneUsageDescription`. You set the associated value to a `string` that will be included in the dialog the system uses to request request access from the user.

Right-click the `Info.plist` entry of the project tree and select **Open As** > **Source Code**. Add the following lines the top level `<dict>` section, and then save the file.

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Need microphone access for VOIP calling.</string>
```

### Set up the app framework

Open your project's **ContentView.swift** file and add an `import` declaration to the top of the file to import the `AzureCommunicationCalling library`. In addition, import `AVFoundation`, we'll need this for audio permission request in the code.

```swift
import AzureCommunicationCalling
import AVFoundation
```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK for iOS.


| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| CallClient | The CallClient is the main entry point to the Calling SDK.|
| CallAgent | The CallAgent is used to start and manage calls. |
| CommunicationTokenCredential | The CommunicationTokenCredential is used as the token credential to instantiate the CallAgent.| 
| CommunicationIdentifier | The CommunicationIdentifier is used to represent the identity of the user which can be one of the following: CommunicationUserIdentifier/PhoneNumberIdentifier/CallingApplication. |

> [!NOTE]
> When implementing event delegates, the application has to hold a strong reference to the objects that require event subscriptions. For example, when a `RemoteParticipant` object is returned on invoking the `call.addParticipant` method and the application sets the delegate to listen on `RemoteParticipantDelegate`, the application must hold a strong reference to the `RemoteParticipant` object. Otherwise, if this object gets collected, the delegate will throw a fatal exception when the Calling SDK tries to invoke the object.

## Initialize the CallAgent

To create a `CallAgent` instance from `CallClient` you have to use `callClient.createCallAgent` method that asynchronously returns a `CallAgent` object once it's initialized

To create call client you have to pass a `CommunicationTokenCredential` object.

```swift

import AzureCommunication

let tokenString = "token_string"
var userCredential: CommunicationTokenCredential?
var userCredential: CommunicationTokenCredential?
   do {
       userCredential = try CommunicationTokenCredential(with: CommunicationTokenRefreshOptions(initialToken: token, 
                                                                     refreshProactively: true,
                                                                     tokenRefresher: self.fetchTokenSync))
   } catch {
       return
}

// tokenProvider needs to be implemented by contoso which fetches new token
public func fetchTokenSync(then onCompletion: TokenRefreshOnCompletion) {
    let newToken = self.tokenProvider!.fetchNewToken()
    onCompletion(newToken, nil)
}
```

Pass `CommunicationTokenCredential` object created above to `CallClient` and set the display name.

```swift

callClient = CallClient()
let callAgentOptions:CallAgentOptions = CallAgentOptions()!
options.displayName = " iOS User"

callClient?.createCallAgent(userCredential: userCredential!,
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

To create and start a call you need to call one of the APIs on `CallAgent` and provide the Communication Services Identity of a user that you've provisioned using the Communication Services Management SDK.

Call creation and start is synchronous. You'll receive call instance that allows you to subscribe to all events on the call.

### Place a 1:1 call to a user or a 1:n call with users and PSTN

```swift

let callees = [CommunicationUser(identifier: 'UserId')]
let oneToOneCall = self.callAgent.call(participants: callees, options: StartCallOptions())

```

### Place a 1:n call with users and PSTN
To place the call to PSTN you have to specify phone number acquired with Communication Services
```swift

let pstnCallee = PhoneNumberIdentifier(phoneNumber: '+1999999999')
let callee = CommunicationUserIdentifier(identifier: 'UserId')
let groupCall = self.callAgent.call(participants: [pstnCallee, callee], options: StartCallOptions())

```

### Place a 1:1 call with with video
To get a device manager instance please refer [here](#device-management)

```swift

let camera = self.deviceManager!.cameras!.first
let localVideoStream = LocalVideoStream(camera: camera)
let videoOptions = VideoOptions(localVideoStream: localVideoStream)

let startCallOptions = StartCallOptions()
startCallOptions?.videoOptions = videoOptions

let callee = CommunicationUserIdentifier(identifier: 'UserId')
let call = self.callAgent?.call(participants: [callee], options: startCallOptions)

```

### Join a group call
To join a call you need to call one of the APIs on *CallAgent*

```swift

let groupCallLocator = GroupCallLocator(groupId: UUID(uuidString: "uuid_string"))!
let call = self.callAgent?.join(with: groupCallLocator, joinCallOptions: JoinCallOptions())

```

### Subscribe for incoming call
Subscribe to incoming call event

```
final class IncomingCallHandler: NSObject, CallAgentDelegate, IncomingCallDelegate
{
    // Event raised when there is an incoming call
    public func onIncomingCall(_ callAgent: CallAgent!, incomingcall: IncomingCall!) {
        self.incomingCall = incomingcall
        // Subscribe to get OnCallEnded event
        self.incomingCall?.delegate = self
    }

    // Event raised when incoming call was not answered
    public func onCallEnded(_ incomingCall: IncomingCall!, args: PropertyChangedEventArgs!) {
        self.incomingCall = nil
    }
}
```

### Accept an incoming call
To accept a call, call the 'accept' method on a call object.
Set a delegate to the CallAgent 
```swift
final class CallHandler: NSObject, CallAgentDelegate
{
    public var incomingCall: Call?
 
    public func onCallsUpdated(_ callAgent: CallAgent!, args: CallsUpdatedEventArgs!) {
        if let incomingCall = args.addedCalls?.first(where: { $0.isIncoming }) {
            self.incomingCall = incomingCall
        }
    }
}

let firstCamera: VideoDeviceInfo? = self.deviceManager!.cameras!.first
let localVideoStream = LocalVideoStream(camera: firstCamera)
let acceptCallOptions = AcceptCallOptions()
acceptCallOptions!.videoOptions = VideoOptions(localVideoStream:localVideoStream!)
if let incomingCall = CallHandler().incomingCall {
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

## Push notification

Mobile push notification is the pop up notification you get in the mobile device. For calling, we will be focusing on VoIP (Voice over Internet Protocol) push notifications. We will be offering you the capabilities to register for push notification, to handle push notification, and to unregister push notification.

### Prerequisite

- Step 1: Xcode -> Signing & Capabilities -> Add Capability -> "Push Notifications"
- Step 2: Xcode -> Signing & Capabilities -> Add Capability -> "Background Modes"
- Step 3: "Background Modes" -> Select "Voice over IP" and "Remote notifications"

:::image type="content" source="../media/ios/xcode-push-notification.png" alt-text="Screenshot showing how to add capabilities in Xcode." lightbox="../media/ios/xcode-push-notification.png":::

#### Register for Push Notifications

In order to register for push notification, call registerPushNotification() on a *CallAgent* instance with a device registration token.

Register for push notification needs to be called after successful initialization. When the `callAgent` object is destroyed, `logout` will be called which will automatically unregister push notifications.


```swift

let deviceToken: Data = pushRegistry?.pushToken(for: PKPushType.voIP)
callAgent.registerPushNotifications(deviceToken: deviceToken) { (error) in
    if(error == nil) {
        print("Successfully registered to push notification.")
    } else {
        print("Failed to register push notification.")
    }
}

```

#### Push Notification Handling
In order to receive incoming calls push notifications, call *handlePushNotification()* on a *CallAgent* instance with a dictionary payload.

```swift

let callNotification = IncomingCallInformation.from(payload: pushPayload?.dictionaryPayload)

callAgent.handlePush(notification: callNotification) { (error) in
    if (error != nil) {
        print("Handling of push notification failed")
    } else {
        print("Handling of push notification was successful")
    }
}

```
#### Unregister Push Notification

Applications can unregister push notification at any time. Simply call the `unregisterPushNotification` method on *CallAgent*.
> [!NOTE]
> Applications are not automatically unregistered from push notification on logout.

```swift

callAgent.unregisterPushNotifications { (error) in
    if (error != nil) {
        print("Unregister of push notification failed, please try again")
    } else {
        print("Unregister of push notification was successful")
    }
}

```

## Mid-call operations

You can perform various operations during a call to manage settings related to video and audio.

### Mute and unmute

To mute or unmute the local endpoint you can use the `mute` and `unmute` asynchronous APIs:

```swift
call!.mute { (error) in
    if error == nil {
        print("Successfully muted")
    } else {
        print("Failed to mute")
    }
}

```

[Asynchronous] Local unmute

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

To start sending local video to other participants in the call, use `startVideo` API and pass `localVideoStream` with `camera`

```swift

let firstCamera: VideoDeviceInfo? = self.deviceManager!.cameras!.first
let localVideoStream = LocalVideoStream(camera: firstCamera)

call!.startVideo(stream: localVideoStream) { (error) in
    if (error == nil) {
        print("Local video started successfully")
    } else {
        print("Local video failed to start")
    }
}

```

Once you start sending video, the `LocalVideoStream` instance is added the `localVideoStreams` collection on a call instance:

```swift

call.localVideoStreams[0]

```

[Asynchronous] To stop local video, pass the `localVideoStream` returned from the invocation of `call.startVideo`:

```swift

call!.stopVideo(stream: localVideoStream) { (error) in
    if (error == nil) {
        print("Local video stopped successfully")
    } else {
        print("Local video failed to stop")
    }
}

```

## Remote participants management

All remote participants are represented by the `RemoteParticipant` type and are available through the `remoteParticipants` collection on a call instance:

### List participants in a call

```swift

call.remoteParticipants

```

### Remote participant properties

```swift

// [RemoteParticipantDelegate] delegate - an object you provide to receive events from this RemoteParticipant instance
var remoteParticipantDelegate = remoteParticipant.delegate

// [CommunicationIdentifier] identity - same as the one used to provision token for another user
var identity = remoteParticipant.identity

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

To add a participant to a call (either a user or a phone number) you can invoke `addParticipant`. 
This will synchronously return a remote participant instance.

```swift

let remoteParticipantAdded: RemoteParticipant = call.add(participant: CommunicationUserIdentifier(identifier: "userId"))

```

### Remove a participant from a call
To remove a participant from a call (either a user or a phone number) you can invoke the  `removeParticipant` API. This will resolve asynchronously.

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

Remote participants may initiate video or screen sharing during a call.

### Handle remote participant video/screen sharing streams

To list the streams of remote participants, inspect the `videoStreams` collections:

```swift

var remoteParticipantVideoStream = call.remoteParticipants[0].videoStreams[0]

```

### Remote video stream properties

```swift

var type: MediaStreamType = remoteParticipantVideoStream.type // 'MediaStreamTypeVideo'

var isAvailable: Bool = remoteParticipantVideoStream.isAvailable // indicates if remote stream is available

var id: Int = remoteParticipantVideoStream.id // id of remoteParticipantStream

```

### Render remote participant stream

To start rendering remote participant streams:

```swift

let renderer: Renderer? = Renderer(remoteVideoStream: remoteParticipantVideoStream)
let targetRemoteParticipantView: RendererView? = renderer?.createView(with: RenderingOptions(scalingMode: ScalingMode.crop))
// To update the scaling mode later
targetRemoteParticipantView.update(scalingMode: ScalingMode.fit)

```

### Remote video renderer methods and properties

```swift
// [Synchronous] dispose() - dispose renderer and all `RendererView` associated with this renderer. To be called when you have removed all associated views from the UI.
remoteVideoRenderer.dispose()
```

## Device management

`DeviceManager` lets you enumerate local devices that can be used in a call to transmit audio/video streams. It also allows you to request permission from a user to access microphone/camera. You can access `deviceManager` on the `callClient` object:

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

To access local devices, you can use enumeration methods on the Device Manager. Enumeration is a synchronous action.

```swift
// enumerate local cameras
var localCameras = deviceManager.cameras! // [VideoDeviceInfo, VideoDeviceInfo...]
// enumerate local cameras
var localMicrophones = deviceManager.microphones! // [AudioDeviceInfo, AudioDeviceInfo...]
// enumerate local cameras
var localSpeakers = deviceManager.speakers! // [AudioDeviceInfo, AudioDeviceInfo...]
``` 

### Set default microphone/speaker

Device manager allows you to set a default device that will be used when starting a call. If stack defaults are not set, Communication Services will fall back to OS defaults.

```swift
// get first microphone
var firstMicrophone = self.deviceManager!.cameras!.first
// [Synchronous] set microphone
deviceManager.setMicrophone(microphoneDevice: firstMicrophone)
// get first speaker
var firstSpeaker = self.deviceManager!.speakers!
// [Synchronous] set speaker
deviceManager.setSpeaker(speakerDevice: firstSpeaker)
```

### Local camera preview

You can use `Renderer` to begin rendering a stream from your local camera. This stream won't be send to other participants; it's a local preview feed. This is an asynchronous action.

```swift

let camera: VideoDeviceInfo = self.deviceManager!.getCameraList()![0]
let localVideoStream: LocalVideoStream = LocalVideoStream(camera: camera)
let renderer: Renderer = Renderer(localVideoStream: localVideoStream)
self.view = try renderer!.createView()

```

### Local camera preview properties

The renderer has set of properties and methods that allow you to control the rendering:

```swift

// Constructor can take in LocalVideoStream or RemoteVideoStream
let localRenderer = Renderer(localVideoStream:localVideoStream)
let remoteRenderer = Renderer(remoteVideoStream:remoteVideoStream)

// [StreamSize] size of the rendering view
localRenderer.size

// [RendererDelegate] an object you provide to receive events from this Renderer instance
localRenderer.delegate

// [Synchronous] create view
try! localRenderer.createView()

// [Synchronous] create view with rendering options
try! localRenderer.createView(with: RenderingOptions(scalingMode: ScalingMode.fit))

// [Synchronous] dispose rendering view
localRenderer.dispose()

```

## Eventing model

You can subscribe to most of the properties and collections to be notified when values change.

### Properties
To subscribe to `property changed` events:

```swift
call.delegate = self
// Get the property of the call state by doing get on the call's state member
public func onCallStateChanged(_ call: Call!,
                               args: PropertyChangedEventArgs!)
{
    print("Callback from SDK when the call state changes, current state: " + call.state.rawValue)
}

 // to unsubscribe
 self.call.delegate = nil

```

### Collections
To subscribe to `collection updated` events:

```swift
call.delegate = self
// Collection contains the streams that were added or removed only
public func onLocalVideoStreamsChanged(_ call: Call!,
                                       args: LocalVideoStreamsUpdatedEventArgs!)
{
    print(args.addedStreams.count)
    print(args.removedStreams.count)
}
// to unsubscribe
self.call.delegate = nil
```
