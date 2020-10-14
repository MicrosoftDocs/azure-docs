---
author: mikben
ms.service: azure-communication-services
ms.topic: include
ms.date: 9/1/2020
ms.author: mikben
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../access-tokens.md)
- Optional: Complete the quickstart for [getting started with adding calling to your application](../getting-started-with-calling.md)

## Setting up

### Creating the Xcode project

In Xcode, create a new iOS project and select the **Single View App** template. This quickstart uses the [SwiftUI framework](https://developer.apple.com/xcode/swiftui/), so you should set the the **Language** to **Swift** and the **User Interface** to **SwiftUI**. You're not going to create unit tests or UI tests during this quickstart. Feel free to uncheck **Include Unit Tests** and also uncheck **Include UI Tests**.

:::image type="content" source="../media/ios/xcode-new-ios-project.png" alt-text="Screenshot showing the create new New Project window within Xcode.":::

### Install the package

Add the Azure Communication Services Calling client library and its dependencies (AzureCore.framework and AzureCommunication.framework) to your project.

> [!NOTE]
> With the release of AzureCommunicationCalling SDK you will find a bash script `BuildAzurePackages.sh`. 
The script when run `sh ./BuildAzurePackages.sh` will give you the path to the generated framework packages which needs to be imported in the sample app in the next step. Note that you will need to set up Xcode Command Line Tools if you have not done so before you run the script: Start Xcode, select "Preferences -> Locations". Pick your Xcode version for the Command Line Tools. **Note that the BuildAzurePackages.sh script works only with Xcode 11.5 and above.**

1. Download the Azure Communication Services Calling client library for iOS.
2. In Xcode, click on your project file to and select the build target to open the project settings editor.
3. Under the **General** tab, scroll to the **Frameworks, Libraries, and Embedded Content** section and click the **"+"** icon.
4. In the bottom left of the dialog, chose **Add Files**, navigate to the **AzureCommunicationCalling.framework** directory of the un-zipped client library package.
    1. Repeat the last step for adding **AzureCore.framework** and **AzureCommunication.framework**.
5. Open the **Build Settings** tab of the project settings editor and scroll to the **Search Paths** section. Add a new **Framework Search Paths** entry for the directory containing the **AzureCommunicationCalling.framework**.
    1. Add another Framework Search Paths entry pointing to the folder containing the dependencies.

:::image type="content" source="../media/ios/xcode-framework-search-paths.png" alt-text="Screenshot showing updating the framework search paths within XCode.":::

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

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling client library for iOS.


| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| ACSCallClient | The ACSCallClient is the main entry point to the Calling client library.|
| ACSCallAgent | The ACSCallAgent is used to start and manage calls. |
| CommunicationUserCredential | The CommunicationUserCredential is used as the token credential to instantiate the CallAgent.| 
| CommunicationIndentifier | The CommunicationIndentifier is used to represent the identity of the user which can be one of the following: CommunicationUser/PhoneNumber/CallingApplication. |

> [!NOTE]
> When implementing event delegates, the application has to hold a strong reference to the objects that require event subscriptions. For example, when a `ACSRemoteParticipant` object is returned on invoking the `call.addParticipant` method and the application sets the delegate to listen on `ACSRemoteParticipantDelegate`, the application must hold a strong reference to the `ACSRemoteParticipant` object. Otherwise, if this object gets collected, the delegate will throw a fatal exception when the calling SDK tries to invoke the object.

## Initialize the ACSCallAgent

To create a `ACSCallAgent` instance from `ACSCallClient` you have to use `callClient.createCallAgent` method that asynchronously returns a `ACSCallAgent` object once it's initialized

To create call client you have to pass a `CommunicationUserCredential` object.

```swift

import AzureCommunication

let tokenString = "token_string"
var userCredential: CommunicationUserCredential?
do {
    userCredential = try CommunicationUserCredential(
        initialToken: tokenString, refreshProactively: true,
        tokenRefresher: self.fetchTokenSync
    )
} catch {
    print("Failed to create CommunicationCredential object")
}

// tokenProvider needs to be implemented by contoso which fetches new token
public func fetchTokenSync(then onCompletion: TokenRefreshOnCompletion) {
    let newToken = self.tokenProvider!.fetchNewToken()
    onCompletion(newToken, nil)
}
```

Pass CommunicationUserCredential object created above to ACSCallClient

```swift

callClient = ACSCallClient()
callClient?.createCallAgent(userCredential!,
    withCompletionHandler: { (callAgent, error) in
        if error == nil {
            print("Create agent succeeded")
            self.callAgent = callAgent
        } else {
            print("Create agent failed")
        }
})

```

## Place an outgoing call

To create and start a call you need to call one of the APIs on `ACSCallAgent` and provide the Communication Services Identity of a user that you've provisioned using the Communication Services Management client library.

Call creation and start is synchronous. You'll receive call instance that allows you to subscribe to all events on the call.

### Place a 1:1 call to a user or a 1:n call with users and PSTN

```swift

let callees = [CommunicationUser(identifier: 'acsUserId')]
let oneToOneCall = self.CallingApp.callAgent.call(participants: callees, options: ACSStartCallOptions())

```

### Place a 1:n call with users and PSTN
To place the call to PSTN you have to specify phone number acquired with Communication Services
```swift

let pstnCallee = PhoneNumber('+1999999999')
let callee = CommunicationUser(identifier: 'acsUserId')
let groupCall = self.CallingApp.callAgent.call(participants: [pstnCallee, callee], options: ACSStartCallOptions())

```

### Place a 1:1 call with with video
To get a device manager instance please refer [here](#device-management)

```swift

let camera = self.deviceManager!.getCameraList()![0]
let localVideoStream = ACSLocalVideoStream(camera)
let videoOptions = ACSVideoOptions(localVideoStream)

let startCallOptions = ACSStartCallOptions()
startCallOptions?.videoOptions = videoOptions

let callee = CommunicationUser(identifier: 'acsUserId')
let call = self.callAgent?.call([callee], options: startCallOptions)

```

### Join a group call
To join a call you need to call one of the APIs on *CallAgent*

```swift

let groupCallContext = ACSGroupCallContext()
groupCallContext?.groupId = UUID(uuidString: "uuid_string")!
let call = self.callAgent?.join(with: groupCallContext, joinCallOptions: ACSJoinCallOptions())

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
callAgent.registerPushNotifications(deviceToken,
                withCompletionHandler: { (error) in
    if(error == nil) {
        print("Successfully registered to push notification.")
    } else {
        print("Failed to register push notification.")
    }
})

```

#### Push Notification Handling
In order to receive incoming calls push notifications, call *handlePushNotification()* on a *CallAgent* instance with a dictionary payload.

```swift

let dictionaryPayload = pushPayload?.dictionaryPayload
callAgent.handlePushNotification(dictionaryPayload, withCompletionHandler: { (error) in
    if (error != nil) {
        print("Handling of push notification failed")
    } else {
        print("Handling of push notification was successful")
    }
})

```
#### Unregister Push Notification

Applications can unregister push notification at any time. Simply call the `unRegisterPushNotification` method on *CallAgent*.
> [!NOTE]
> Applications are not automatically unregistered from push notification on logout.

```swift

callAgent.unRegisterPushNotifications(completionHandler: { (error) in
    if (error != nil) {
        print("Unregister of push notification failed, please try again")
    } else {
        print("Unregister of push notification was successful")
    }
})

```

## Mid-call operations

You can perform various operations during a call to manage settings related to video and audio.

### Mute and unmute

To mute or unmute the local endpoint you can use the `mute` and `unmute` asynchronous APIs:

```swift
call.mute(completionHandler: { (error) in
    if error == nil {
        print("Successfully muted")
    } else {
        print("Failed to mute")
    }
})

```

[Asynchronous] Local unmute

```swift
call.unmute(completionHandler:{ (error) in
    if error == nil {
        print("Successfully un-muted")
    } else {
        print("Failed to unmute")
    }
})
```

### Start and stop sending local video

To start sending local video to other participants in the call, use `startVideo` API and pass `localVideoStream` with `camera`

```swift

let firstCamera: ACSVideoDeviceInfo? = self.deviceManager?.getCameraList()![0]
let localVideoStream = ACSLocalVideoStream(firstCamera)

call.startVideo(localVideoStream) { (error) in
    if (error == nil) {
        print("Local video started successfully")
    }
    else {
        print("Local video failed to start")
    }
}

```

Once you start sending video, the `ACSLocalVideoStream` instance is added the `localVideoStreams` collection on a call instance:

```swift

call.localVideoStreams[0]

```

[Asynchronous] To stop local video, pass the `localVideoStream` returned from the invocation of `call.startVideo`:

```swift

call.stopVideo(localVideoStream,{ (error) in
    if (error == nil) {
        print("Local video stopped successfully")
    }
    else {
        print("Local video failed to stop")
    }
}

```

## Remote participants management

All remote participants are represented by the `ACSRemoteParticipant` type and are available through the `remoteParticipants` collection on a call instance:

### List participants in a call

```swift

call.remoteParticipants

```

### Remote participant properties

```swift

// [ACSRemoteParticipantDelegate] delegate - an object you provide to receive events from this ACSRemoteParticipant instance
var remoteParticipantDelegate = remoteParticipant.delegate

// [CommunicationIdentifier] identity - same as the one used to provision token for another user
var identity = remoteParticipant.identity

// ACSParticipantStateIdle = 0, ACSParticipantStateEarlyMedia = 1, ACSParticipantStateConnecting = 2, ACSParticipantStateConnected = 3, ACSParticipantStateOnHold = 4, ACSParticipantStateInLobby = 5, ACSParticipantStateDisconnected = 6
var state = remoteParticipant.state

// [ACSError] callEndReason - reason why participant left the call, contains code/subcode/message
var callEndReason = remoteParticipant.callEndReason

// [Bool] isMuted - indicating if participant is muted
var isMuted = remoteParticipant.isMuted

// [Bool] isSpeaking - indicating if participant is currently speaking
var isSpeaking = remoteParticipant.isSpeaking

// ACSRemoteVideoStream[] - collection of video streams this participants has
var videoStreams = remoteParticipant.videoStreams // [ACSRemoteVideoStream, ACSRemoteVideoStream, ...]

```

### Add a participant to a call

To add a participant to a call (either a user or a phone number) you can invoke `addParticipant`. 
This will synchronously return a remote participant instance.

```swift

let remoteParticipantAdded: ACSRemoteParticipant = call.addParticipant(CommunicationUser(identifier: "userId"))

```

### Remove a participant from a call
To remove a participant from a call (either a user or a phone number) you can invoke the  `removeParticipant` API. This will resolve asynchronously.

```swift

call!.remove(remoteParticipantAdded) { (error) in
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

var type: ACSMediaStreamType = remoteParticipantVideoStream.type // 'ACSMediaStreamTypeVideo'

var isAvailable: Bool = remoteParticipantVideoStream.isAvailable // indicates if remote stream is available

var id: Int = remoteParticipantVideoStream.id // id of remoteParticipantStream

```

### Render remote participant stream

To start rendering remote participant streams:

```swift

let renderer: ACSRenderer? = ACSRenderer(remoteVideoStream: remoteParticipantVideoStream)
let targetRemoteParticipantView: ACSRendererView? = renderer?.createView(ACSRenderingOptions(ACSScalingMode.crop))
// To update the scaling mode later
targetRemoteParticipantView.update(ACSScalingMode.fit)

```

### Remote video renderer methods and properties

```swift
// [Bool] isRendering - indicating if stream is being rendered
remoteVideoRenderer.isRendering()
```

## Device management

`DeviceManager` lets you enumerate local devices that can be used in a call to transmit audio/video streams. It also allows you to request permission from a user to access microphone/camera. You can access `deviceManager` on the `callClient` object:

```swift

self.callClient!.getDeviceManager(
    completionHandler: { (deviceManager, error) in
        if (error == nil) {
            print("Got device manager instance")
            self.deviceManager = deviceManager
        } else {
            print("Failed to get device manager instance")
        }
    })
```

### Enumerate local devices

To access local devices, you can use enumeration methods on the Device Manager. Enumeration is a synchronous action.

```swift
// enumerate local cameras
var localCameras = deviceManager.getCameraList() // [ACSVideoDeviceInfo, ACSVideoDeviceInfo...]
// enumerate local cameras
var localMicrophones = deviceManager.getMicrophoneList() // [ACSAudioDeviceInfo, ACSAudioDeviceInfo...]
// enumerate local cameras
var localSpeakers = deviceManager.getSpeakerList() // [ACSAudioDeviceInfo, ACSAudioDeviceInfo...]
``` 

### Set default microphone/speaker

Device manager allows you to set a default device that will be used when starting a call. If stack defaults are not set, Communication Services will fall back to OS defaults.

```swift
// get first microphone
var firstMicrophone = self.deviceManager!.getMicrophoneList()![0]
// [Synchronous] set microphone
deviceManager.setMicrophone(ACSAudioDeviceInfo())
// get first speaker
var firstSpeaker = self.deviceManager!.getSpeakerList()![0]
// [Synchronous] set speaker
deviceManager.setSpeakers(ACSAudioDeviceInfo())
```

### Local camera preview

You can use `ACSRenderer` to begin rendering a stream from your local camera. This stream won't be send to other participants; it's a local preview feed. This is an asynchronous action.

```swift

let camera: ACSVideoDeviceInfo = self.deviceManager!.getCameraList()![0]
let localVideoStream: ACSLocalVideoStream = ACSLocalVideoStream(camera)
let renderer: ACSRenderer = ACSRenderer(localVideoStream: localVideoStream)
self.view = renderer!.createView(ACSRenderingOptions())

```

### Local camera preview properties

The renderer has set of properties and methods that allow you to control the rendering:

```swift

// Constructor can take in ACSLocalVideoStream or ACSRemoteVideoStream
let localRenderer = ACSRenderer(localVideoStream:localVideoStream)
let remoteRenderer = ACSRenderer(remoteVideoStream:remoteVideoStream)

// [ACSStreamSize] size of the rendering view
localRenderer.size

// [ACSRendererDelegate] an object you provide to receive events from this ACSRenderer instance
localRenderer.delegate

// [Synchronous] create view with rendering options
localRenderer.createView(options:ACSRenderingOptions())
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
public func onCallStateChanged(_ call: ACSCall!,
                               _ args: ACSPropertyChangedEventArgs!)
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
public func onLocalVideoStreamsChanged(_ call: ACSCall!,
                                       _ args: ACSLocalVideoStreamsUpdatedEventArgs!)
{
    print(args.addedStreams.count)
    print(args.removedStreams.count)
}
// to unsubscribe
self.call.delegate = nil
```
