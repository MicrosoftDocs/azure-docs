---
title: include file
description: include file
services: azure-communication-services
ms.date: 01/30/2024
ms.topic: include
author: sloanster
ms.author: micahvivion
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

## Prerequisites

1.  **Azure Account:** Make sure that your Azure account is active. New users can create a free account at [Microsoft Azure](https://azure.microsoft.com/free/).
2.  **Communication Services Resource:** Set up a [Communication Services Resource](../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp) via your Azure portal and note your connection string.
3.  **Azure CLI:** Follow the instructions to [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows?tabs=azure-cli)..
4.  **User Access Token:** Generate a user access token to instantiate the call client. You can create one using the Azure CLI as follows:
```console
az communication identity token issue --scope voip --connection-string "yourConnectionString"
```

For more information, see [Use Azure CLI to Create and Manage Access Tokens](../../quickstarts/identity/access-tokens.md?pivots=platform-azcli).

For Video Calling as a Teams user:

-   You can also use Teams identity. To generate an access token for a Teams User, see [Manage teams identity](../../quickstarts/manage-teams-identity.md?pivots=programming-language-javascript).
-   Obtain the Teams thread ID for call operations using the [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer). For information about creating a thread ID, see [Create chat - Microsoft Graph v1.0 > Example2: Create a group chat](/graph/api/chat-post?preserve-view=true&tabs=javascript&view=graph-rest-1.0#example-2-create-a-group-chat).

## Installation
To start the migration from Twilio iOS Video SDK, the first step is to install the Azure Communication Services calling iOS SDK to your project. You can configure these parameters using`Cocoapods`.

1. To create a Podfile for your application, open the terminal and navigate to the project folder and run: 

```ruby
pod init
```
2. Add the following code to the Podfile and save (make sure that "target" matches the name of your project):

```ruby
platform :ios, '13.0' 
use_frameworks! 
  
target 'AzureCommunicationCallingSample' do 
  pod 'AzureCommunicationCalling', '~> 2.6.0' 
end 
```
3. Set up the `.xcworkspace` projectcc
```shell
pod install
```
4. Open the `.xcworkspace` that was created by the pod install with Xcode.

## Authenticating to the SDK

To be able to use the Azure Communication Services calling SDK, you need to authenticate to the SDK using an access token.

### Twilio

From within the Twilio Video framework, the access token is used to connect to a room. By passing the token to ConnectOptions you can create the option to create or connect a room.

```swift
let connectOptions = ConnectOptions(token: accessToken) { 
 // Twilio Connect options goes here 
} 
 
let room =   TwilioVideoSDK.connect(
    options: connectOptions, 
    delegate: // The Room Delegate
)
```

### Azure Communication Services

```swift
// Create an instance of CallClient 
let callClient = CallClient() 
 
// A reference to the call agent, it will be initialized later 
var callAgent: CallAgent? 
 
// Embed the token in a CommunicationTokenCredential object 
let userCredential = try? CommunicationTokenCredential(token: token) 
 
// Create a CallAgent that will be used later to initiate or receive calls 
callClient.createCallAgent(userCredential: userCredential) { callAgent, error in 
	if error != nil { 
        // Raise the error to the user and return 
	} 
	self.callAgent = callAgent         
} 
```


| Class Name | Description          |
|-----------|----------------------|
|[CallClient](/objectivec/communication-services/calling/acscallclient) | The main class representing the entry point for the Calling SDK.|
|[CommunicationTokenCredential](https://azure.github.io/azure-sdk-for-ios/AzureCommunicationCommon/Classes/CommunicationTokenCredential.html)| The Azure Communication Services User token credential|
|[CallAgent](/objectivec/communication-services/calling/acscallagent)|The class responsible of managing calls on behalf of the authenticated user |

## Initiating an outgoing call 

### Twilio
Twilio Video iOS SDK doesn't have a concept of a call. Twilio has a concept of room where if user Bob wants to have a call with client Alice Bob can create a room and Alice has to connect to it by implementing a feature like push notification.

#### Connect to a room
When user Bob or user Alice wants to create or connect to a room, and they have a valid access token. They can pass the room name they want to create or connect to as a parameter of ConnectOptions.

```swift
let connectOptions = ConnectOptions(token: accessToken) { builder in 
	builder.roomName = "the-room"  
} 
 
room = TwilioVideoSDK.connect(options: connectOptions, delegate: self)
```

### Azure Communication Services

#### Connect to a call

Initiating a call with the Azure Communication Service Calling SDK consists of the following steps: 

1. Creating a call option object 
2. Creating an Array of Communication Identifiers 
3. Calling startCall method on the previously created CallAgent

```swift
let startCallOptions = StartCallOptions() // 1 
let callees = [CommunicationUserIdentifier(“IdendityToCall”)] // 2 
 
callAgent?.startCall(participants: callees, options: startCallOptions) { call, error in 
    // Check for error if no Error and the call object isn't nil then the call is being established       
}

```
#### Connect to a Team's call

##### With External Identity

Connecting to a team call is almost the same as connecting to a call. Instead of using StartCallOptions, the client application needs to use JoinCallOptions together with a TeamsMeeting locator.

The Teams meeting link can be retrieved using Graph APIs. You can read more about Graph APIs in the  [Graph documentation](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true).

```swift
let joinCallOptions = JoinCallOptions()
let teamsMeetingLinkLocator = TeamsMeetingLinkLocator(meetingLink: meetingLink)
    callAgent?.join(with: teamsMeetingLinkLocator, joinCallOptions: joinCallOptions) { call, error in
    // Handle error or set a CallDelegate delegate on the call if no error
}

```

## Accepting and joining a call

### Twilio 
As mentioned previously, Twilio Video iOS SDK doesn't have a concept of Call. Twilio has a concept of a room where if Bob wants to have a call with Alice. For different clients can join a video call by joining the same room.

### Azure Communication Services

#### Receiving incoming call
In order to be able to accept a call, the application needs to be able to receive a call.

#### Register for push notifications and handling incoming push notification 
An ACS client can select to receive push notifications to receive incoming calls. This [guide](/azure/communication-services/how-tos/calling-sdk/push-notifications?pivots=platform-ios#set-up-push-notifications) describes how to set up APNS for the Azure Communication Services calling framework.

#### Setting up the CallAgentDelegate

The Azure Communication Services calling SDK has a CallAgentDelegate that has a method that is called during an incoming call.

```swift
class ApplicationCallAgentDelegate: NSObject, CallAgentDelegate { 
 
    func callAgent(_ callAgent: CallAgent, didUpdateCalls args: CallsUpdatedEventArgs) {} 
 
    func callAgent(_ callAgent: CallAgent, didRecieveIncomingCall incomingCall: IncomingCall) { 
        // This is called when the application receives an incoming call 
        // An application could use this callback to  display an incoming call banner 
        // or report an incoming call to CallKit 
    } 
} 

```
In order to receive incoming calls, the application needs to add a CallAgentDelegate to its CallAgent.

```swift 
let callAgentDelegate = ApplicationCallAgentDelegate() 
callClient.createCallAgent(userCredential: userCredential) { callAgent, error in 
    if error != nil { 
        // Raise the error to the user and return 
    } 
    self.callAgent = callAgent 
    self.callAgent?.delegate = callAgentDelegate 
} 
```

With the CallAgentDelegate in place and associated with a CallAgent instance the application should be able to receive incoming calls.

#### Accept an incoming call

```swift
func acceptCall(incomingCall: IncomingCall) { 
    let options = AcceptCallOptions() 
    incomingCall.accept(options: options) {(call, error) in 
        if error != nil { 
            // Raise the error to the user and return 
        } 
      // The call is established clients can speak/view each other 
    }
} 
```
#### Class reference
|Class Name | Description          |
|-----------|----------------------|
|[CallAgentDelegate](/objectivec/communication-services/calling/acscallagentdelegate) | Defines a set of methods that are called by ACSCallAgent in response to important events. |
|[IncomingCall](/objectivec/communication-services/calling/acsincomingcall)| Describes an incoming call |


## Video 

### Starting and stopping video 

#### Twilio 

##### Accessing the camera 


With Twilio Video iOS SDK adding video to a call consists of 2 steps, accessing the camera and adding it to the local track list.

```swift
let options = CameraSourceOptions { (builder) in
    // Set the CameraSource options here
}
camera = CameraSource(options: options, delegate: aCameraDelegate)
```

##### Creating the LocalVideoTrack

Once the CameraSource is created, it can be associated to a LocalVideoTrack.

```swift
localVideoTrack = LocalVideoTrack(source: camera!, enabled: true, name: "Camera")
```

##### Adding the LocalVideoTrack to the call

**At connect time**

When a call connects, you can add the local video track to the call can be achieved by passing the local video track to the localVideo track list that can be set with ConnectOptions.

```swift
let connectOptions = ConnectOptions(token: accessToken) { builder in
     builder.videoTracks =  [localVideoTrack!]
}
```

**In an existing room**

In an existing room the local participant can publish a local video track via the `publishVideoTrack(_ : LocalVideoTrack)`` method.

```swift
room.localParticipant.publishVideoTrack(localVideoTrack)
```

#### Azure Communication Services

##### Accessing the camera

Accessing the camera is done through the DeviceManager. Grabbing an instance of the DeviceManager can be done with the following code.

```swift
self.callClient.getDeviceManager { (deviceManager, error) in
    if (error != nil) {
       // Display an error message to the user and exit the closure 
       return
    }
    self.deviceManager = deviceManager                 
}
```
##### Creating the LocalVideoStream

The deviceManager provides access to camera(s) that can be used to create a LocalVideoStream instance

```swift
LocalVideoStream(camera: deviceManager.cameras.first!)
```

##### Adding the LocalVideoStream to an existing call or while creating a room

**At connect time**

The localVideoStream can be added to the streams via the OutgoingVideoOptions of the StartCallOptions

```swift
var callOptions = StartCallOptions()
let outgoingVideoOptions = OutgoingVideoOptions()
outgoingVideoOptions.streams = [localVideoStream]
```

**In a call**

A video stream can be started by calling the startVideo method that takes a LocalVideoStream as a parameter.

```swift
call.startVideo(stream: localVideoStream) { error in
    if error != ni {
    	// Report the error to the user and return 
    }
}
```

#### Class reference
|Class Name | Description          |
|-----------|----------------------|
|[DeviceManager](/objectivec/communication-services/calling/acsdevicemanager#declaration) | Facilitates the interaction with the device |
|[LocalVideoStream](/objectivec/communication-services/calling/acslocalvideostream) | Local video stream information |
|[VideoDeviceInfo](/objectivec/communication-services/calling/acsvideodeviceinfo) | Information about a video device |
|OutgoingVideoOptions | Documentation isn't available yet |
|[Call](/objectivec/communication-services/calling/acscall)|Describes a call|


## Rendering video

### Twilio 

To render video using the TwilioVideo iOS SDK, an object conforming to the VideoRenderer protocol can be added to VideoTrack.

TwilioVideo iOS provides a ready to use VideoRenderer called VideoView, which is a subclass of UIView.

```swift
let videoView = VideoView(frame: CGRect.zero, delegate: nil)
```
Once an instance of VideoView is created a VideoTrack (local or remote) has a method addVideoRenderer that can be used to add the videoView created as a renderer.

```swift
localVideoTrack = LocalVideoTrack(source: camera, enabled: true, name: "Camera")
// Add renderer to video track for local preview
localVideoTrack!.addRenderer(videoView)
``````
### Azure Communication Services

To render video with Azure Communication Services calling, create a VideoStreamRenderer and pass a LocalVideoStream or a RemoteVideoStream as parameter

```swift
 let previewRenderer = try VideoStreamRenderer(localVideoStream: localVideoStream)
```

VideoStreamRenderer created can be used to create a VideoStreamRendererView, which renders the video stream passed to the VideoStreamRenderer.

```swift
let scalingMode = ScalingMode.fit
let options = CreateViewOptions(scalingMode:scalingMode)
let previewView = try previewRenderer.createView(withOptions:options)
```

#### Class reference

|Class Name | Description          |
|-----------|----------------------|
|[SaclingMode](/objectivec/communication-services/calling/acsscalingmode) | Enum for local and remote video scaling mode|
|[CreateViewOptions](/objectivec/communication-services/calling/acscreateviewoptions) | Options to be passed when rendering a Video |
|[VideoStreamRenderer](/objectivec/communication-services/calling/acsvideostreamrenderer) | Renderer for video rendering |
|OutgoingVideoOptions | Documentation isn't available yet |
|[VideoStreamRendererView](/objectivec/communication-services/calling/acsvideostreamrendererview)|View used to render video|

## Audio

### Toggling the microphone

#### Twilio

Muting and unmuting of the microphone is done through the LocalAudioTrack associated with the microphone.

**Muting the microphone**
```swift
self.localAudioTrack.isEnabled =  false
```

**Unmuting the microphone**
```swift
self.localAudioTrack.isEnabled =  true
```

#### Azure Communication Services
Muting and unmuting can be done by calling the muteOutgoingAudio and unmuteoutgoingAudio on the call object.

**Muting the microphone**
```swift
'call': call.muteOutgoingAudio() { error in
    if error == nil {
        isMuted = true
    } else {
       // Display an error to the user
    }
}
```

**Unmuting the microphone**
```swift
callBase.unmuteOutgoingAudio() { error in
    if error == nil {
        isMuted = true
    } else {
       // Display an error to the user
    }
}
```

## Dominant speaker feature

### Twilio
Dominant speaker updates are posted through RoomDelegate. 

``` swift
class ExampleRoomDelegate: NSObject, RoomDelegate {
    func dominantSpeakerDidChange(room: Room, participant: RemoteParticipant?) {
        // Do what is needed to update the UI
    }
}
```

### Azure Communication Services 
The first step to register for dominant speaker update is to grab an instance of the dominant speaker feature from the call object.

```swift
let dominantSpeakersFeature = call.feature(Features.dominantSpeakers)
```
Once an instance of the dominant speakers feature is obtained a DominantSpeakersCallFeatureDelegate can be attached to it.

```swift
dominantSpeakersFeature.delegate = DominantSpeakersDelegate()
public class DominantSpeakersDelegate : DominantSpeakersCallFeatureDelegate {
    public func dominantSpeakersCallFeature(_ dominantSpeakersCallFeature: DominantSpeakersCallFeature, didChangeDominantSpeakers args: PropertyChangedEventArgs) {
        // When the list changes, get the timestamp of the last change and the current list of Dominant Speakers
        let dominantSpeakersInfo = dominantSpeakersCallFeature.dominantSpeakersInfo
        let timestamp = dominantSpeakersInfo.lastUpdatedAt
        let dominantSpeakersList = dominantSpeakersInfo.speakers
    }
}
```

#### Class reference
| Class Name | Description          |
|-----------|----------------------|
|[Call](/objectivec/communication-services/calling/acscall) | Describes a call|
|DominantSpeakersDelegate | Documentation isn't available yet |
|DominantSpeakersCallFeature | Documentation isn't available yet |


## Event Listeners

Twilio and ACS propose various delegates to listen to call events. 

### Room / Call Events

#### Twilio: RoomDelegate
The RoomDelegate allows clients to listen to events related to the room, It has methods that will be called for the following events:
* the client has connected or fails to connect to a room
* the client is reconnecting to the room or has reconnected
* a remote participant as connected, disconnected, reconnected to the room
* the room recording has started or stopped
* the dominant speaker changes

#### Azure Communication Services: CallDelegate

The call delegate is covering some of the events that Twilio RoomDelegate. It contains the methods for the following events:
* the call Id changed
* the call state changed. This is where the connection event will be reported 
* the list of remote participants has been updated
* the local video stream has been updated
* the mute state changed

### RemoteParticipant Event

Both SDKs Twilio iOS Video and Azure Communication Services calling propose a remote participant delegate that allows clients to be notified about what is happening with each RemoteParticipant.

#### Twilio: RemoteParticipantDelegate

The RemoteParticipantDelegate will handle the following events.

* the remote participant has published or unpublished a media track (video, audio, data)
* the local participant has subscribed, failed to subscribe or unsubscribed to a remote media track (video, audio, data)
* the remote participant network quality changed
* the remote participant changed the priority of a track publication
* the remote participant has switch on/off its video track


#### Azure Communication Services: RemoteParticipantDelegate

The RemoteParticipantDelegate will handle the following events
* the remote participant state changed
* the remote participant is muted or not muted
* the remote participant is speaking
* the remote participant display name changed
* the remote participant added or removed a video stream

### Camera Events

#### Twilio
Twilio proposes a CameraSourceDelegate to notify client about the following events related to the camera:

* The camera source has been interrupted or has been resumed (when you put the app in background for example)
* The camera source failed
* The camera source is reporting system pressure

#### Azure Communication Services
Azure Communication Services calling proposes a DeviceManagerDelegate. It consists of a single method that will notify clients when video devices are added or removed on the current DeviceManager.

### Local Participant Events

#### Twilio
Twilio has a LocalParticpant delegate that allows client to receive updates about the following events:
* The local participant has published or failed to be published a media track (audio, video, data)
* The network quality level for the local participant changed

#### Azure Communication Services

Azure Communication Services calling has a CallAgent delegate that allows clients to listen to the call agent related event. It will be notified when:
* When calls are updated or created, in case of an incoming call or when an existing call is disconnected. 
* When an incoming call is received

#### Class reference
| Class Name | Description          |
|-----------|----------------------|
|[CallDelegate](/objectivec/communication-services/calling/acscalldelegate) | A set of methods that are called by calling SDK in response to important events.|
|[CallAgentDelegate](/objectivec/communication-services/calling/acscallagentdelegate) | A set of methods that are called by ACSCallAgent in response to important events. |
|[RemoteParticipantDelegate](/objectivec/communication-services/calling/acsremoteparticipantdelegate) | A set of methods that are called by ACSRemoteParticipant in response to important events. |
|[DeviceManagerDelegate](/objectivec/communication-services/calling/acsdevicemanagerdelegate)|A set of methods that are called by ACSDeviceManager in response to important events.|


## Ending a Call

### Twilio
Ending a call (i.e. disconnecting from a room)  is done via the `room.disconnect()` method.

### Azure Communication Services

Hanging up a call is done through the hangUp method of the call object.

```swift
call.hangUp(options: HangUpOptions()) { error in
            if error != nil {
                print("ERROR: It was not possible to hang up the call.")
            }
            self.call = nil
 }

```

#### Class reference

| Class Name | Description          |
|-----------|----------------------|
|[Call](/objectivec/communication-services/calling/acscall) | A set of methods that are called by ACSCall in response to important events.|
|[HangUp Options](/objectivec/communication-services/calling/acscallagentdelegate) | A Property bag class for hanging up a call |

## Additional features from the ACS SDK
Some features of the Azure Communication Services calling SDK described in the list below don’t have an equivalent in the Twilio iOS SDK.
### Raise Hand
[RaiseHand](/azure/communication-services/how-tos/calling-sdk/raise-hand?pivots=platform-ios) feature allows participants of a call to raise or lower hands.
### Video Background
Adding [VideoBackground](/azure/communication-services/quickstarts/voice-video-calling/get-started-video-effects?pivots=platform-ios) Allow users to blur the background in the video stream. 
### Video spotlights
[Spotlights](/azure/communication-services/how-tos/calling-sdk/spotlight?pivots=platform-ios) Allow users to pin and unpin videos.
