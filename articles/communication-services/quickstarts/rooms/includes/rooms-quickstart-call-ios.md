---
title: include file
description: include file
services: azure-communication-services
author: mrayyan
manager: alexokun

ms.service: azure-communication-services
ms.date: 07/20/2023
ms.topic: include
ms.custom: include file
ms.author: t-siddiquim
---


## Join a Room call

To follow along with this quickstart, you can download the Room Call quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/join-room-call).


## Setting up
### Creating the Xcode project
In Xcode, create a new iOS project and select the Single View App template. This tutorial uses the [SwiftUI framework](https://developer.apple.com/xcode/swiftui/), so you should set the Language to Swift and the User Interface to SwiftUI.

:::image type="content" source="../../voice-video-calling/media/ios/xcode-new-ios-project.png" alt-text="Screenshot showing the New Project window within Xcode.":::

### Installing CocoaPods
Please use this guide to [install CocoaPods](https://guides.cocoapods.org/using/getting-started.html) on your Mac. 

### Install the package and dependencies with CocoaPods
1. To create a Podfile for your application open the terminal and navigate to the project folder and run pod init.

2. Add the following code to the Podfile and save:

```
platform :ios, '13.0'
use_frameworks!

target 'roomsquickstart' do
  pod 'AzureCommunicationCalling', '~> 2.5.0'
end
```

3. Run pod install.

4. Open the .xcworkspace with Xcode.


### Request access to the Microphone and Camera
To access the device's microphone and camera, you need to update your app's Information Property List with an `NSMicrophoneUsageDescription` and `NSCameraUsageDescription`. You set the associated value to a string that will be included in the dialog the system uses to request access from the user.

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
| CallClient                   | The CallClient is the main entry point to the Calling SDK.                                                                                                                         |
| CallAgent                    | The CallAgent is used to start and manage calls.                                                                                                                                   |
| CommunicationTokenCredential | The CommunicationTokenCredential is used as the token credential to instantiate the CallAgent.                                                                                     |
| CommunicationIdentifier      | The CommunicationIdentifier is used to represent the identity of the user which can be one of the following: CommunicationUserIdentifier/PhoneNumberIdentifier/CallingApplication. |
| RoomCallLocator | The RoomCallLocator is used by CallAgent to join a Room call|

## Create the Call Agent
Replace the implementation of the ContentView struct with some simple UI controls that enable a user to initiate and end a call. We will attach business logic to these controls in this quickstart.

```Swift
struct ContentView: View {    
    @State var roomId: String = ""
    @State var callObserver:CallObserver?
    @State var previewRenderer: VideoStreamRenderer? = nil
    @State var previewView: RendererView? = nil
    @State var sendingLocalVideo: Bool = false
    @State var speakerEnabled: Bool = false
    @State var muted: Bool = false
    @State var callClient: CallClient?
    @State var call: Call?
    @State var callHandler: CallHandler?
    @State var callAgent: CallAgent?
    @State var deviceManager: DeviceManager?
    @State var localVideoStreams: [LocalVideoStream]?
    @State var callState: String = "Unknown"
    @State var showAlert: Bool = false
    @State var alertMessage: String = ""
    @State var participants: [[Participant]] = [[]]
    
    var body: some View {
        NavigationView {
            ZStack {
                if (call == nil) {
                    Form {
                        Section {
                            TextField("Room ID", text: $roomId)
                            Button(action: joinRoomCall) {
                                Text("Join Room Call")
                            }
                        }
                    }
                    .navigationBarTitle("Rooms Quickstart")
                } else {
                    ZStack {
                        VStack {
                            ForEach(participants, id:\.self) { array in
                                HStack {
                                    ForEach(array, id:\.self) { participant in
                                        ParticipantView(self, participant)
                                    }
                                }
                                .frame(maxWidth: .infinity, maxHeight: 200, alignment: .topLeading)
                            }
                        }
                        .background(Color.black)
                        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                        VStack {
                            if (sendingLocalVideo) {
                                HStack {
                                    RenderInboundVideoView(view: $previewView)
                                        .frame(width:90, height:160)
                                        .padding(10)
                                        .background(Color.green)
                                }
                                .frame(maxWidth: .infinity, alignment: .trailing)
                            }
                            HStack {
                                Button(action: toggleMute) {
                                    HStack {
                                        Text(muted ? "Unmute" : "Mute")
                                    }
                                    .frame(width:80)
                                    .padding(.vertical, 10)
                                    .background(Color(.lightGray))
                                }
                                Button(action: toggleLocalVideo) {
                                    HStack {
                                        Text(sendingLocalVideo ? "Video-Off" : "Video-On")
                                    }
                                    .frame(width:80)
                                    .padding(.vertical, 10)
                                    .background(Color(.lightGray))
                                }
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            HStack {
                                Button(action: leaveRoomCall) {
                                    HStack {
                                        Text("Leave Room Call")
                                    }
                                    .frame(width:80)
                                    .padding(.vertical, 10)
                                    .background(Color(.red))
                                }
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            HStack {
                                Text("Status:")
                                Text(callState)
                            }
                            .padding(.vertical, 10)
                        }
                        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomLeading)
                    }
                }
            }
        }
        .onAppear{
            // Authenticate the client
            // Initialize the CallAgent and access Device Manager
            // Ask for permissions
        }
    }
}

//Functions and Observers

struct HomePageView_Previews: PreviewProvider {
    static var previews: some View {
        HomePageView()
    }
}
```

### Authenticate the Client
In order to initialize a CallAgent instance we need a User Access Token which will enable us to join Room calls. 

Once you have a token, Add the following code to the `onAppear` callback in `ContentView.swift`. You will need to replace `<USER ACCESS TOKEN>` with a valid user access token for your resource:

```Swift
var userCredential: CommunicationTokenCredential?
do {
    userCredential = try CommunicationTokenCredential(token: "<USER ACCESS TOKEN>")
} catch {
    print("ERROR: It was not possible to create user credential.")
    return
}
```

### Initialize the CallAgent and access the Device Manager
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

## Joining a Room call
The `joinRoomCall` method is set as the action that will be performed when the Join Room Call button is tapped. In this quickstart, calls are audio only by default but can have video enabled once a Room has been joined.

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

## Leaving a Room call
The `leaveRoomCall` method is set as the action that will be performed when the Leave Room Call button is tapped. It handles leaving a call and cleans up any resources that were created.

```swift
private func leaveRoomCall() {
    if (self.sendingLocalVideo) {
        self.call!.stopVideo(stream: self.localVideoStreams!.first!) { (error) in
            if (error != nil) {
                print("Failed to stop video")
            } else {
                self.sendingLocalVideo = false
                self.previewView = nil
                self.previewRenderer?.dispose()
                self.previewRenderer = nil
            }
        }
    }
    self.call?.hangUp(options: nil) { (error) in }
    self.participants.removeAll()
    self.call?.delegate = nil
    self.call = nil
}
```

## Broadcasting video
During a Room call we can use `startVideo` or `stopVideo` to start or stop sending `LocalVideoStream` to remote participants.

```Swift
func toggleLocalVideo() {
    if (self.sendingLocalVideo) {
        self.call!.stopVideo(stream: self.localVideoStreams!.first!) { (error) in
            if (error != nil) {
                print("Cannot stop video")
            } else {
                self.sendingLocalVideo = false
                self.previewView = nil
                self.previewRenderer!.dispose()
                self.previewRenderer = nil
            }
        }
    } else {
        let availableCameras = self.deviceManager!.cameras
        let scalingMode:ScalingMode = .crop
        if (self.localVideoStreams == nil) {
            self.localVideoStreams = [LocalVideoStream]()
        }
        self.localVideoStreams!.append(LocalVideoStream(camera: availableCameras.first!))
        self.previewRenderer = try! VideoStreamRenderer(localVideoStream: self.localVideoStreams!.first!)
        self.previewView = try! previewRenderer!.createView(withOptions: CreateViewOptions(scalingMode:scalingMode))
        self.call!.startVideo(stream: self.localVideoStreams!.first!) { (error) in
            if (error != nil) {
                print("Cannot start video")
            }
            else {
                self.sendingLocalVideo = true
            }
        }
    }
}
```

## Muting local audio
During a Room call we can use `mute` or `unMute` to mute or unmute our microphone.

```swift
func toggleMute() {
    if (self.muted) {
        call!.unmuteOutgoingAudio(completionHandler: { (error) in
            if error == nil {
                self.muted = false
            }
        })
    } else {
        call!.muteOutgoingAudio(completionHandler: { (error) in
            if error == nil {
                self.muted = true
            }
        })
    }
}
```

## Handling call updates
To deal with call updates, implement an `CallHandler` to handle update events. Put the following implementation in `CallHandler.swift`.

```Swift
final class CallHandler: NSObject, CallAgentDelegate {
    public var owner: ContentView?

    private static var instance: CallHandler?
    static func getOrCreateInstance() -> CallHandler {
        if let c = instance {
            return c
        }
        instance = CallHandler()
        return instance!
    }

    private override init() {}
    
    public func callAgent(_ callAgent: CallAgent, didUpdateCalls args: CallsUpdatedEventArgs) {
        if let removedCall = args.removedCalls.first {
            owner?.call = nil
        }
    }
}
```

We need to create an instance of `CallHandler` by adding the following code to the `onAppear` callback in `ContentView.swift`:

```Swift
self.callHandler = CallHandler.getOrCreateInstance()
self.callHandler.owner = self
```

Set a delegate to the CallAgent after the CallAgent being successfully created:

```Swift
self.callAgent!.delegate = callHandler
```

## Remote participant management
All remote participants are represented by the `RemoteParticipant` type and are available through the `remoteParticipants` collection on a call instance. We can implement a `Participant` class to manage the updates on remote video streams of remote participants amongst other things.

```swift
class Participant: NSObject, RemoteParticipantDelegate, ObservableObject {
    private var videoStreamCount = 0
    private let innerParticipant:RemoteParticipant
    private let call:Call
    private var renderedRemoteVideoStream:RemoteVideoStream?
    
    @Published var state:ParticipantState = ParticipantState.disconnected
    @Published var isMuted:Bool = false
    @Published var isSpeaking:Bool = false
    @Published var hasVideo:Bool = false
    @Published var displayName:String = ""
    @Published var videoOn:Bool = true
    @Published var renderer:VideoStreamRenderer? = nil
    @Published var rendererView:RendererView? = nil
    @Published var scalingMode: ScalingMode = .fit

    init(_ call: Call, _ innerParticipant: RemoteParticipant) {
        self.call = call
        self.innerParticipant = innerParticipant
        self.displayName = innerParticipant.displayName

        super.init()

        self.innerParticipant.delegate = self

        self.state = innerParticipant.state
        self.isMuted = innerParticipant.isMuted
        self.isSpeaking = innerParticipant.isSpeaking
        self.hasVideo = innerParticipant.videoStreams.count > 0
        if(self.hasVideo) {
            handleInitialRemoteVideo()
        }
    }

    deinit {
        self.innerParticipant.delegate = nil
    }

    func getMri() -> String {
        Utilities.toMri(innerParticipant.identifier)
    }

    func set(scalingMode: ScalingMode) {
        if self.rendererView != nil {
            self.rendererView!.update(scalingMode: scalingMode)
        }
        self.scalingMode = scalingMode
    }
    
    func handleInitialRemoteVideo() {
        renderedRemoteVideoStream = innerParticipant.videoStreams[0]
        renderer = try! VideoStreamRenderer(remoteVideoStream: renderedRemoteVideoStream!)
        rendererView = try! renderer!.createView()
    }

    func toggleVideo() {
        if videoOn {
            rendererView = nil
            renderer?.dispose()
            videoOn = false
        }
        else {
            renderer = try! VideoStreamRenderer(remoteVideoStream: innerParticipant.videoStreams[0])
            rendererView = try! renderer!.createView()
            videoOn = true
        }
    }

    func remoteParticipant(_ remoteParticipant: RemoteParticipant, didUpdateVideoStreams args: RemoteVideoStreamsEventArgs) {
        let hadVideo = hasVideo
        hasVideo = innerParticipant.videoStreams.count > 0
        if videoOn {
            if hadVideo && !hasVideo {
                // Remote user stopped sharing
                rendererView = nil
                renderer?.dispose()
            } else if hasVideo && !hadVideo {
                // remote user started sharing
                renderedRemoteVideoStream = innerParticipant.videoStreams[0]
                renderer = try! VideoStreamRenderer(remoteVideoStream: renderedRemoteVideoStream!)
                rendererView = try! renderer!.createView()
            } else if hadVideo && hasVideo {
                if args.addedRemoteVideoStreams.count > 0 {
                    if renderedRemoteVideoStream?.id == args.addedRemoteVideoStreams[0].id {
                        return
                    }
    
                    // remote user added a second video, so switch to the latest one
                    guard let rendererTemp = renderer else {
                        return
                    }
                    rendererTemp.dispose()
                    renderedRemoteVideoStream = args.addedRemoteVideoStreams[0]
                    renderer = try! VideoStreamRenderer(remoteVideoStream: renderedRemoteVideoStream!)
                    rendererView = try! renderer!.createView()
                } else if args.removedRemoteVideoStreams.count > 0 {
                    if args.removedRemoteVideoStreams[0].id == renderedRemoteVideoStream!.id {
                        // remote user stopped sharing video that we were rendering but is sharing
                        // another video that we can render
                        renderer!.dispose()

                        renderedRemoteVideoStream = innerParticipant.videoStreams[0]
                        renderer = try! VideoStreamRenderer(remoteVideoStream: renderedRemoteVideoStream!)
                        rendererView = try! renderer!.createView()
                    }
                }
            }
        }
    }

    func remoteParticipant(_ remoteParticipant: RemoteParticipant, didChangeDisplayName args: PropertyChangedEventArgs) {
        self.displayName = innerParticipant.displayName
    }
}

class Utilities {
    @available(*, unavailable) private init() {}

    public static func toMri(_ id: CommunicationIdentifier?) -> String {

        if id is CommunicationUserIdentifier {
            let communicationUserIdentifier = id as! CommunicationUserIdentifier
            return communicationUserIdentifier.identifier
        } else {
            return "<nil>"
        }
    }
}
```


## Remote participant video streams
We can create a `ParticipantView` to handle the rendering of video streams of remote participants. Put the implementation in `ParticipantView.swift`

```Swift
struct ParticipantView : View, Hashable {
    static func == (lhs: ParticipantView, rhs: ParticipantView) -> Bool {
        return lhs.participant.getMri() == rhs.participant.getMri()
    }

    private let owner: HomePageView

    @State var showPopUp: Bool = false
    @State var videoHeight = CGFloat(200)
    @ObservedObject private var participant:Participant

    var body: some View {
        ZStack {
            if (participant.rendererView != nil) {
                HStack {
                    RenderInboundVideoView(view: $participant.rendererView)
                }
                .background(Color(.black))
                .frame(height: videoHeight)
                .animation(Animation.default)
            } else {
                HStack {
                    Text("No incoming video")
                }
                .background(Color(.red))
                .frame(height: videoHeight)
            }
        }
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(participant.getMri())
    }

    init(_ owner: HomePageView, _ participant: Participant) {
        self.owner = owner
        self.participant = participant
    }

    func resizeVideo() {
        videoHeight = videoHeight == 200 ? 150 : 200
    }

    func showAlert(_ title: String, _ message: String) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            self.owner.alertMessage = message
            self.owner.showAlert = true
        }
    }
}

struct RenderInboundVideoView: UIViewRepresentable {
    @Binding var view:RendererView!

    func makeUIView(context: Context) -> UIView {
        return UIView()
    }

    func updateUIView(_ uiView: UIView, context: Context) {
        for view in uiView.subviews {
            view.removeFromSuperview()
        }
        if (view != nil) {
            uiView.addSubview(view)
        }
    }
}
```

## Subscribe to events
We can implement a `CallObserver` class to subscribe to a collection of events to be notified when values, like `remoteParticipants`, change during the call.

```Swift
public class CallObserver : NSObject, CallDelegate
{
    private var owner: ContentView
    private var firstTimeCallConnected: Bool = true
    
    init(view: ContentView) {
        owner = view
        super.init()
    }

    public func call(_ call: Call, didChangeState args: PropertyChangedEventArgs) {
        let state = CallObserver.callStateToString(state:call.state)
        owner.callState = state
        if (call.state == CallState.disconnected) {
            owner.leaveRoomCall()
        }
        else if (call.state == CallState.connected) {
            if(self.firstTimeCallConnected) {
                self.handleInitialCallState(call: call);
            }
            self.firstTimeCallConnected = false;
        }
    }

    public func handleInitialCallState(call: Call) {
        // We want to build a matrix with max 2 columns

        owner.callState = CallObserver.callStateToString(state:call.state)
        var participants = [Participant]()

        // Add older/existing participants
        owner.participants.forEach { (existingParticipants: [Participant]) in
            participants.append(contentsOf: existingParticipants)
        }
        owner.participants.removeAll()

        // Add new participants to the collection
        for remoteParticipant in call.remoteParticipants {
            let mri = Utilities.toMri(remoteParticipant.identifier)
            let found = participants.contains { (participant) -> Bool in
                participant.getMri() == mri
            }

            if !found {
                let participant = Participant(call, remoteParticipant)
                participants.append(participant)
            }
        }

        // Convert 1-D array into a 2-D array with 2 columns
        var indexOfParticipant = 0
        while indexOfParticipant < participants.count {
            var newParticipants = [Participant]()
            newParticipants.append(participants[indexOfParticipant])
            indexOfParticipant += 1
            if (indexOfParticipant < participants.count) {
                newParticipants.append(participants[indexOfParticipant])
                indexOfParticipant += 1
            }
            owner.participants.append(newParticipants)
        }
    }

    public func call(_ call: Call, didUpdateRemoteParticipant args: ParticipantsUpdatedEventArgs) {
        var participants = [Participant]()
        // Add older/existing participants
        owner.participants.forEach { (existingParticipants: [Participant]) in
            participants.append(contentsOf: existingParticipants)
        }
        owner.participants.removeAll()

        // Remove deleted participants from the collection
        args.removedParticipants.forEach { p in
            let mri = Utilities.toMri(p.identifier)
            participants.removeAll { (participant) -> Bool in
                participant.getMri() == mri
            }
        }

        // Add new participants to the collection
        for remoteParticipant in args.addedParticipants {
            let mri = Utilities.toMri(remoteParticipant.identifier)
            let found = participants.contains { (view) -> Bool in
                view.getMri() == mri
            }

            if !found {
                let participant = Participant(call, remoteParticipant)
                participants.append(participant)
            }
        }

        // Convert 1-D array into a 2-D array with 2 columns
        var indexOfParticipant = 0
        while indexOfParticipant < participants.count {
            var array = [Participant]()
            array.append(participants[indexOfParticipant])
            indexOfParticipant += 1
            if (indexOfParticipant < participants.count) {
                array.append(participants[indexOfParticipant])
                indexOfParticipant += 1
            }
            owner.participants.append(array)
        }
    }

    private static func callStateToString(state:CallState) -> String {
        switch state {
        case .connected: return "Connected"
        case .connecting: return "Connecting"
        case .disconnected: return "Disconnected"
        case .disconnecting: return "Disconnecting"
        case .none: return "None"
        default: return "Unknown"
        }
    }
}
```

## Run the code
You can build and run your app on iOS simulator by selecting Product > Run or by using the (⌘-R) keyboard shortcut.




The ability to join a room call and display the roles of call participants is available in the iOS Mobile Calling SDK version [2.5.0](https://github.com/Azure/Communication/releases/tag/v2.5.0) and above.

You can learn more about roles of room call participants in the [rooms concept documentation](../../../concepts/rooms/room-concept.md#predefined-participant-roles-and-permissions).
