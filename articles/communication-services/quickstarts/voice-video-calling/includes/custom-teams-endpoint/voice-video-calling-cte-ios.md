---
author: raosanat
ms.service: azure-communication-services
ms.topic: include
ms.date: 08/09/2023
ms.author: sanathr
---

Get started with Azure Communication Services by using the Communication Services calling SDK to add one on one video calling to your app. You learn how to start and answer a video call using the Azure Communication Services Calling SDK for iOS using Teams identity.

## Sample Code

If you'd like to skip ahead to the end, you can download this quickstart as a sample on [GitHub](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/add-video-calling-callkit).

## Prerequisites

- Obtain an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Mac running [Xcode](https://developer.apple.com/xcode/), along with a valid developer certificate installed into your Keychain.
- Create an active Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md?tabs=windows&pivots=platform-azp). You need to **record your connection string** for this quickstart.
- A [User Access Token](../../../manage-teams-identity.md) for your Azure Communication Service.
- Obtain Teams thread ID to for call operations using [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer). Read more about [how to create chat thread ID](/graph/api/chat-post?preserve-view=true&tabs=javascript&view=graph-rest-1.0#example-2-create-a-group-chat)

## Setting up

### Creating the Xcode project

In Xcode, create a new iOS project and select the Single View App template. This tutorial uses the [SwiftUI framework](https://developer.apple.com/xcode/swiftui/), so you should set the Language to Swift and the User Interface to SwiftUI. You're not going to create tests during this quick start. Feel free to uncheck Include Tests.

:::image type="content" source="../../media/ios/xcode-new-ios-project.png" alt-text="Screenshot showing the New Project window within Xcode.":::

### Installing CocoaPods

Use this guide to [install CocoaPods](https://guides.cocoapods.org/using/getting-started.html) on your Mac.

### Install the package and dependencies with CocoaPods

1. To create a `Podfile` for your application, open the terminal and navigate to the project folder and run pod init.

2. Add the following code to the `Podfile` and save. [See SDK support versions](../../../../concepts/voice-video-calling/calling-sdk-features.md?#ios-calling-sdk-support).

```
platform :ios, '13.0'
use_frameworks!

target 'VideoCallingQuickstart' do
  pod 'AzureCommunicationCalling', '~> 2.10.0'
end
```

3. Run pod install.

4. Open the `.xcworkspace` with Xcode.

### Request access to the microphone and camera

To access the device's microphone and camera, you need to update your app's Information Property List with an `NSMicrophoneUsageDescription` and `NSCameraUsageDescription`. You set the associated value to a string that includes the dialog the system uses to request access from the user.

Right-click the `Info.plist` entry of the project tree and select Open As > Source Code. Add the following lines the top level `<dict>` section, and then save the file.

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Need microphone access for VOIP calling.</string>
<key>NSCameraUsageDescription</key>
<string>Need camera access for video calling</string>
```

### Set up the app framework

Open your project's `ContentView.swift` file and add an import declaration to the top of the file to import the `AzureCommunicationCalling` library and `AVFoundation`. AVFoundation is used to capture audio permission from code.

```Swift
import AzureCommunicationCalling
import AVFoundation
```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK for iOS.

| Name                         | Description                                                                                                                                                                        |
| :--------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CallClient`                   | The `CallClient` is the main entry point to the Calling SDK.                                                                                                                         |
| `TeamsCallAgent`               | The `TeamsCallAgent` is used to start and manage calls.                                                                                                                                   |
| `TeamsIncomingCall`            | The `TeamsIncomingCall` is used to accept or reject incoming teams call.      |
| `CommunicationTokenCredential` | The `CommunicationTokenCredential` is used as the token credential to instantiate the `TeamsCallAgent`.                                                                                     |
| `CommunicationIdentifier`      | The `CommunicationIdentifier` is used to represent the identity of the user, which can be one of the following options: `CommunicationUserIdentifier`, `PhoneNumberIdentifier` or `CallingApplication`. |

## Create the Teams Call Agent

Replace the implementation of the ContentView `struct` with some simple UI controls that enable a user to initiate and end a call. We add business logic to these controls in this quickstart.

```Swift
struct ContentView: View {
    @State var callee: String = ""
    @State var callClient: CallClient?
    @State var teamsCallAgent: TeamsCallAgent?
    @State var teamsCall: TeamsCall?
    @State var deviceManager: DeviceManager?
    @State var localVideoStream:[LocalVideoStream]?
    @State var teamsIncomingCall: TeamsIncomingCall?
    @State var sendingVideo:Bool = false
    @State var errorMessage:String = "Unknown"

    @State var remoteVideoStreamData:[Int32:RemoteVideoStreamData] = [:]
    @State var previewRenderer:VideoStreamRenderer? = nil
    @State var previewView:RendererView? = nil
    @State var remoteRenderer:VideoStreamRenderer? = nil
    @State var remoteViews:[RendererView] = []
    @State var remoteParticipant: RemoteParticipant?
    @State var remoteVideoSize:String = "Unknown"
    @State var isIncomingCall:Bool = false
    
    @State var callObserver:CallObserver?
    @State var remoteParticipantObserver:RemoteParticipantObserver?

    var body: some View {
        NavigationView {
            ZStack{
                Form {
                    Section {
                        TextField("Who would you like to call?", text: $callee)
                        Button(action: startCall) {
                            Text("Start Teams Call")
                        }.disabled(teamsCallAgent == nil)
                        Button(action: endCall) {
                            Text("End Teams Call")
                        }.disabled(teamsCall == nil)
                        Button(action: toggleLocalVideo) {
                            HStack {
                                Text(sendingVideo ? "Turn Off Video" : "Turn On Video")
                            }
                        }
                    }
                }
                // Show incoming call banner
                if (isIncomingCall) {
                    HStack() {
                        VStack {
                            Text("Incoming call")
                                .padding(10)
                                .frame(maxWidth: .infinity, alignment: .topLeading)
                        }
                        Button(action: answerIncomingCall) {
                            HStack {
                                Text("Answer")
                            }
                            .frame(width:80)
                            .padding(.vertical, 10)
                            .background(Color(.green))
                        }
                        Button(action: declineIncomingCall) {
                            HStack {
                                Text("Decline")
                            }
                            .frame(width:80)
                            .padding(.vertical, 10)
                            .background(Color(.red))
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .topLeading)
                    .padding(10)
                    .background(Color.gray)
                }
                ZStack{
                    VStack{
                        ForEach(remoteViews, id:\.self) { renderer in
                            ZStack{
                                VStack{
                                    RemoteVideoView(view: renderer)
                                        .frame(width: .infinity, height: .infinity)
                                        .background(Color(.lightGray))
                                }
                            }
                            Button(action: endCall) {
                                Text("End Call")
                            }.disabled(teamsCall == nil)
                            Button(action: toggleLocalVideo) {
                                HStack {
                                    Text(sendingVideo ? "Turn Off Video" : "Turn On Video")
                                }
                            }
                        }
                        
                    }.frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                    VStack{
                        if(sendingVideo)
                        {
                            VStack{
                                PreviewVideoStream(view: previewView!)
                                    .frame(width: 135, height: 240)
                                    .background(Color(.lightGray))
                            }
                        }
                    }.frame(maxWidth:.infinity, maxHeight:.infinity,alignment: .bottomTrailing)
                }
            }
     .navigationBarTitle("Video Calling Quickstart")
        }.onAppear{
            // Authenticate the client
            
            // Initialize the TeamsCallAgent and access Device Manager
            
            // Ask for permissions
        }
    }
}

//Functions and Observers

struct PreviewVideoStream: UIViewRepresentable {
    let view:RendererView
    func makeUIView(context: Context) -> UIView {
        return view
    }
    func updateUIView(_ uiView: UIView, context: Context) {}
}

struct RemoteVideoView: UIViewRepresentable {
    let view:RendererView
    func makeUIView(context: Context) -> UIView {
        return view
    }
    func updateUIView(_ uiView: UIView, context: Context) {}
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

### Authenticate the client

In order to initialize a `TeamsCallAgent` instance, you need a User Access Token which enables it to make, and receive calls. Refer to the [user access token](../../../manage-teams-identity.md) documentation, if you don't have a token available.

Once you have a token, Add the following code to the `onAppear` callback in `ContentView.swift`. You need to replace `<USER ACCESS TOKEN>` with a valid **user access token** for your resource:

```Swift
var userCredential: CommunicationTokenCredential?
do {
    userCredential = try CommunicationTokenCredential(token: "<USER ACCESS TOKEN>")
} catch {
    print("ERROR: It was not possible to create user credential.")
    return
}
```

### Initialize the Teams CallAgent and access Device Manager

To create a `TeamsCallAgent` instance from a `CallClient`, use the `callClient.createTeamsCallAgent` method that asynchronously returns a `TeamsCallAgent` object once it's initialized. `DeviceManager` lets you enumerate local devices that can be used in a call to transmit audio/video streams. It also allows you to request permission from a user to access microphone/camera.

```Swift
self.callClient = CallClient()
let options = TeamsCallAgentOptions()
// Enable CallKit in the SDK
options.callKitOptions = CallKitOptions(with: createCXProvideConfiguration())
self.callClient?.createTeamsCallAgent(userCredential: userCredential, options: options) { (agent, error) in
    if error != nil {
        print("ERROR: It was not possible to create a Teams call agent.")
        return
    } else {
        self.teamsCallAgent = agent
        print("Teams Call agent successfully created.")
        self.teamsCallAgent!.delegate = teamsIncomingCallHandler
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

### Ask for permissions

We need to add the following code to the `onAppear` callback to ask for permissions for audio and video.

```Swift
AVAudioSession.sharedInstance().requestRecordPermission { (granted) in
    if granted {
        AVCaptureDevice.requestAccess(for: .video) { (videoGranted) in
            /* NO OPERATION */
        }
    }
}
```

## Place an outgoing call

The `startCall` method is set as the action that is performed when the Start Call button is tapped. In this quickstart, outgoing calls are audio only by default. To start a call with video, we need to set `VideoOptions` with `LocalVideoStream` and pass it with `startCallOptions` to set initial options for the call.

```Swift
let startTeamsCallOptions = StartTeamsCallOptions()
if sendingVideo  {
    if self.localVideoStream == nil  {
        self.localVideoStream = [LocalVideoStream]()
    }
    let videoOptions = VideoOptions(localVideoStreams: localVideoStream!)
    startTeamsCallOptions.videoOptions = videoOptions
}
let callees: [CommunicationIdentifier] = [CommunicationUserIdentifier(self.callee)]
self.teamsCallAgent?.startCall(participants: callees, options: startTeamsCallOptions) { (call, error) in
    // Handle call object if successful or an error.
}
```
## Join a Teams meeting

The `join` method allows user to join a teams meeting.

```Swift
let joinTeamsCallOptions = JoinTeamsCallOptions()
if sendingVideo
{
    if self.localVideoStream == nil {
        self.localVideoStream = [LocalVideoStream]()
    }
    let videoOptions = VideoOptions(localVideoStreams: localVideoStream!)
    joinTeamsCallOptions.videoOptions = videoOptions
}

// Join the Teams meeting muted
if isMuted
{
    let outgoingAudioOptions = OutgoingAudioOptions()
    outgoingAudioOptions.muted = true
    joinTeamsCallOptions.outgoingAudioOptions = outgoingAudioOptions
}

let teamsMeetingLinkLocator = TeamsMeetingLinkLocator(meetingLink: "https://meeting_link")

self.teamsCallAgent?.join(with: teamsMeetingLinkLocator, options: joinTeamsCallOptions) { (call, error) in
    // Handle call object if successful or an error.
}
```

`TeamsCallObserver` and `RemoteParticipantObserver` are used to manage mid-call events and remote participants. We set the observers in the `setTeamsCallAndObserver` function.

```Swift
func setTeamsCallAndObserver(call:TeamsCall, error:Error?) {
    if (error == nil) {
        self.teamsCall = call
        self.teamsCallObserver = TeamsCallObserver(self)
        self.teamsCall!.delegate = self.teamsCallObserver
        // Attach a RemoteParticipant observer
        self.remoteParticipantObserver = RemoteParticipantObserver(self)
    } else {
        print("Failed to get teams call object")
    }
}
```

## Answer an incoming call

To answer an incoming call, implement an `TeamsIncomingCallHandler` to display the incoming call banner in order to answer or decline the call. Put the following implementation in `TeamsIncomingCallHandler.swift`.

```Swift
final class TeamsIncomingCallHandler: NSObject, TeamsCallAgentDelegate, TeamsIncomingCallDelegate {
    public var contentView: ContentView?
    private var teamsIncomingCall: TeamsIncomingCall?

    private static var instance: TeamsIncomingCallHandler?
    static func getOrCreateInstance() -> TeamsIncomingCallHandler {
        if let c = instance {
            return c
        }
        instance = TeamsIncomingCallHandler()
        return instance!
    }

    private override init() {}
    
    func teamsCallAgent(_ teamsCallAgent: TeamsCallAgent, didReceiveIncomingCall incomingCall: TeamsIncomingCall) {
        self.teamsIncomingCall = incomingCall
        self.teamsIncomingCall.delegate = self
        contentView?.showIncomingCallBanner(self.teamsIncomingCall!)
    }
    
    func teamsCallAgent(_ teamsCallAgent: TeamsCallAgent, didUpdateCalls args: TeamsCallsUpdatedEventArgs) {
        if let removedCall = args.removedCalls.first {
            contentView?.callRemoved(removedCall)
            self.teamsIncomingCall = nil
        }
    }
}
```

We need to create an instance of `TeamsIncomingCallHandler` by adding the following code to the `onAppear` callback in `ContentView.swift`:

Set a delegate to the `TeamsCallAgent` after the `TeamsCallAgent` being successfully created:

```Swift
self.teamsCallAgent!.delegate = incomingCallHandler
```

Once there's an incoming call, the `TeamsIncomingCallHandler` calls the function `showIncomingCallBanner` to display `answer` and `decline` button.

```Swift
func showIncomingCallBanner(_ incomingCall: TeamsIncomingCall) {
    self.teamsIncomingCall = incomingCall
}
```

The actions attached to `answer` and `decline` are implemented as the following code. In order to answer the call with video, we need to turn on the local video and set the options of `AcceptCallOptions` with `localVideoStream`.

```Swift
func answerIncomingCall() {
    let options = AcceptTeamsCallOptions()
    guard let teamsIncomingCall = self.teamsIncomingCall else {
      print("No active incoming call")
      return
    }

    guard let deviceManager = deviceManager else {
      print("No device manager instance")
      return
    }

    if self.localVideoStreams == nil {
        self.localVideoStreams = [LocalVideoStream]()
    }

    if sendingVideo
    {
        guard let camera = deviceManager.cameras.first else {
            // Handle failure
            return
        }
        self.localVideoStreams?.append( LocalVideoStream(camera: camera))
        let videoOptions = VideoOptions(localVideoStreams: localVideosStreams!)
        options.videoOptions = videoOptions
    }

    teamsIncomingCall.accept(options: options) { (call, error) in
        // Handle call object if successful or an error.
    }
}

func declineIncomingCall() {
    self.teamsIncomingCall?.reject { (error) in 
        // Handle if rejection was successfully or not.
    }
}
```

## Subscribe to events

We can implement a `TeamsCallObserver` class to subscribe to a collection of events to be notified when values change during the call.

```Swift
public class TeamsCallObserver: NSObject, TeamsCallDelegate, TeamsIncomingCallDelegate {
    private var owner: ContentView
    init(_ view:ContentView) {
            owner = view
    }
        
    public func teamsCall(_ teamsCall: TeamsCall, didChangeState args: PropertyChangedEventArgs) {
        if(teamsCall.state == CallState.connected) {
            initialCallParticipant()
        }
    }

    // render remote video streams when remote participant changes
    public func teamsCall(_ teamsCall: TeamsCall, didUpdateRemoteParticipant args: ParticipantsUpdatedEventArgs) {
        for participant in args.addedParticipants {
            participant.delegate = self.remoteParticipantObserver
        }
    }

    // Handle remote video streams when the call is connected
    public func initialCallParticipant() {
        for participant in owner.teamsCall.remoteParticipants {
            participant.delegate = self.remoteParticipantObserver
            for stream in participant.videoStreams {
                renderRemoteStream(stream)
            }
            owner.remoteParticipant = participant
        }
    }
}
```

## Run the code

You can build and run your app on iOS simulator by selecting Product > Run or by using the (⌘-R) keyboard shortcut.
