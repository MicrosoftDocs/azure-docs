---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/10/2021
ms.author: rifox
---

Get started with Azure Communication Services by using the Communication Services calling SDK to add one on one video calling to your app. You learn how to start and answer a video call using the Azure Communication Services Calling SDK for iOS.

## Sample Code

If you'd like to skip ahead to the end, you can download this quickstart as a sample on [GitHub](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/add-video-calling).

## Prerequisites

- Obtain an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Mac running [Xcode](https://developer.apple.com/xcode/), along with a valid developer certificate installed into your Keychain.
- Create an active Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md?tabs=windows&pivots=platform-azp). You need to **record your connection string** for this quickstart.
- A [User Access Token](../../../identity/access-tokens.md) for your Azure Communication Service. You can also use the Azure CLI and run the command with your connection string to create a user and an access token.

  ```azurecli-interactive
  az communication identity token issue --scope voip --connection-string "yourConnectionString"
  ```

  For details, see [Use Azure CLI to Create and Manage Access Tokens](../../../identity/access-tokens.md?pivots=platform-azcli).

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
  pod 'AzureCommunicationCalling', '~> 1.0.0'
end
```

3. Run pod install.

4. Open the `.xcworkspace` with Xcode.

### Using XCFramework directly

If you aren't using `CocoaPods` as a dependency manager, you can directly download the `AzureCommunicationCalling.xcframework` directly from our [release page](https://github.com/Azure/Communication/releases). 

Is important to know that `AzureCommunicationCalling` has a dependency on [`AzureCommunicationCommon`](https://github.com/Azure/azure-sdk-for-ios/tree/main/sdk/communication/AzureCommunicationCommon) so you need to install it as well in your project. 

>[!NOTE]
 > Although [`AzureCommunicationCommon`](https://github.com/Azure/azure-sdk-for-ios/tree/main/sdk/communication/AzureCommunicationCommon) is a pure swift package, you cannot install it using [`Swift Package Manager`](https://www.swift.org/package-manager/) to use it with `AzureCommunicationCalling` because the latter is an Objective-C framework and [`Swift Package Manager`](https://www.swift.org/package-manager/) deliberately do not support Swift ObjC interface headers by design which means is not possible to work together with `AzureCommunicationCalling` if installed using [`Swift Package Manager`](https://www.swift.org/package-manager/). You would have to either install via another dependency manager or generate a `xcframework` from [`AzureCommunicationCommon`](https://github.com/Azure/azure-sdk-for-ios/tree/main/sdk/communication/AzureCommunicationCommon) sources and import into your project.

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
| `CallAgent`                  | The `CallAgent` is used to start and manage calls.                                                                                                                                   |
| `CommunicationTokenCredential` | The `CommunicationTokenCredential` is used as the token credential to instantiate the `CallAgent`.                                                                                     |
| `CommunicationIdentifier`      | The `CommunicationIdentifier` is used to represent the identity of the user, which can be one of the following options: `CommunicationUserIdentifier`, `PhoneNumberIdentifier` or `CallingApplication`. |

## Create the Call Agent

Replace the implementation of the ContentView `struct` with some simple UI controls that enable a user to initiate and end a call. We add business logic to these controls in this quickstart.

```Swift
struct ContentView: View {
    @State var callee: String = ""
    @State var callClient: CallClient?
    @State var callAgent: CallAgent?
    @State var call: Call?
    @State var deviceManager: DeviceManager?
    @State var localVideoStream:[LocalVideoStream]?
    @State var incomingCall: IncomingCall?
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
                            Text("Start Call")
                        }.disabled(callAgent == nil)
                        Button(action: endCall) {
                            Text("End Call")
                        }.disabled(call == nil)
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
                            }.disabled(call == nil)
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
            
            // Initialize the CallAgent and access Device Manager
            
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

In order to initialize a `CallAgent` instance, you need a User Access Token, which enables it to make, and receive calls. Refer to the [user access token](../../../identity/access-tokens.md?pivots=programming-language-csharp) documentation, if you don't have a token available.

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

### Initialize the CallAgent and access Device Manager

To create a CallAgent instance from a CallClient, use the `callClient.createCallAgent` method that asynchronously returns a CallAgent object once it's initialized. DeviceManager lets you enumerate local devices that can be used in a call to transmit audio/video streams. It also allows you to request permission from a user to access microphone/camera.

```Swift
self.callClient = CallClient()
self.callClient?.createCallAgent(userCredential: userCredential!) { (agent, error) in
    if error != nil {
        print("ERROR: It was not possible to create a call agent.")
        return
    }

    else {
        self.callAgent = agent
        print("Call agent successfully created.")
        self.callAgent!.delegate = incomingCallHandler
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

## Display local video

Before starting a call, you can manage settings related to video. In this quickstart, we introduce the implementation of toggling local video before or during a call.

First we need to access local cameras with `deviceManager`. Once the desired camera is selected, we can construct `LocalVideoStream` and create a `VideoStreamRenderer`, and then attach it to `previewView`. During the call, we can use `startVideo` or `stopVideo` to start or stop sending `LocalVideoStream` to remote participants. This function also works with handling incoming calls.

```Swift
func toggleLocalVideo() {
    // toggling video before call starts
    if (call == nil)
    {
        if(!sendingVideo)
        {
            self.callClient = CallClient()
            self.callClient?.getDeviceManager { (deviceManager, error) in
                if (error == nil) {
                    print("Got device manager instance")
                    self.deviceManager = deviceManager
                } else {
                    print("Failed to get device manager instance")
                }
            }
            guard let deviceManager = deviceManager else {
                return
            }
            let camera = deviceManager.cameras.first
            let scalingMode = ScalingMode.fit
            if (self.localVideoStream == nil) {
                self.localVideoStream = [LocalVideoStream]()
            }
            localVideoStream!.append(LocalVideoStream(camera: camera!))
            previewRenderer = try! VideoStreamRenderer(localVideoStream: localVideoStream!.first!)
            previewView = try! previewRenderer!.createView(withOptions: CreateViewOptions(scalingMode:scalingMode))
            self.sendingVideo = true
        }
        else{
            self.sendingVideo = false
            self.previewView = nil
            self.previewRenderer!.dispose()
            self.previewRenderer = nil
        }
    }
    // toggle local video during the call
    else{
        if (sendingVideo) {
            call!.stopVideo(stream: localVideoStream!.first!) { (error) in
                if (error != nil) {
                    print("cannot stop video")
                }
                else {
                    self.sendingVideo = false
                    self.previewView = nil
                    self.previewRenderer!.dispose()
                    self.previewRenderer = nil
                }
            }
        }
        else {
            guard let deviceManager = deviceManager else {
                return
            }
            let camera = deviceManager.cameras.first
            let scalingMode = ScalingMode.fit
            if (self.localVideoStream == nil) {
                self.localVideoStream = [LocalVideoStream]()
            }
            localVideoStream!.append(LocalVideoStream(camera: camera!))
            previewRenderer = try! VideoStreamRenderer(localVideoStream: localVideoStream!.first!)
            previewView = try! previewRenderer!.createView(withOptions: CreateViewOptions(scalingMode:scalingMode))
            call!.startVideo(stream:(localVideoStream?.first)!) { (error) in
                if (error != nil) {
                    print("cannot start video")
                }
                else {
                    self.sendingVideo = true
                }
            }
        }
    }
}
```

## Place an outgoing call

The `startCall` method is set as the action that is performed when the Start Call button is tapped. In this quickstart, outgoing calls are audio only by default. To start a call with video, we need to set `VideoOptions` with `LocalVideoStream` and pass it with `startCallOptions` to set initial options for the call.

```Swift
func startCall() {
        let startCallOptions = StartCallOptions()
        if(sendingVideo)
        {
            if (self.localVideoStream == nil) {
                self.localVideoStream = [LocalVideoStream]()
            }
            let videoOptions = VideoOptions(localVideoStreams: localVideoStream!)
            startCallOptions.videoOptions = videoOptions
        }
        let callees:[CommunicationIdentifier] = [CommunicationUserIdentifier(self.callee)]
        self.callAgent?.startCall(participants: callees, options: startCallOptions) { (call, error) in
            setCallAndObersever(call: call, error: error)
        }
    }
```

`CallObserver` and `RemotePariticipantObserver` are used to manage mid-call events and remote participants. We set the observers in the `setCallAndOberserver` function.

```Swift
func setCallAndObersever(call:Call!, error:Error?) {
    if (error == nil) {
        self.call = call
        self.callObserver = CallObserver(self)
        self.call!.delegate = self.callObserver
        self.remoteParticipantObserver = RemoteParticipantObserver(self)
    } else {
        print("Failed to get call object")
    }
}
```

## Answer an incoming call

To answer an incoming call, implement an `IncomingCallHandler` to display the incoming call banner in order to answer or decline the call. Put the following implementation in `IncomingCallHandler.swift`.

```Swift
final class IncomingCallHandler: NSObject, CallAgentDelegate, IncomingCallDelegate {
    public var contentView: ContentView?
    private var incomingCall: IncomingCall?

    private static var instance: IncomingCallHandler?
    static func getOrCreateInstance() -> IncomingCallHandler {
        if let c = instance {
            return c
        }
        instance = IncomingCallHandler()
        return instance!
    }

    private override init() {}
    
    public func callAgent(_ callAgent: CallAgent, didRecieveIncomingCall incomingCall: IncomingCall) {
        self.incomingCall = incomingCall
        self.incomingCall?.delegate = self
        contentView?.showIncomingCallBanner(self.incomingCall!)
    }
    
    public func callAgent(_ callAgent: CallAgent, didUpdateCalls args: CallsUpdatedEventArgs) {
        if let removedCall = args.removedCalls.first {
            contentView?.callRemoved(removedCall)
            self.incomingCall = nil
        }
    }
}
```

We need to create an instance of `IncomingCallHandler` by adding the following code to the `onAppear` callback in `ContentView.swift`:

```Swift
let incomingCallHandler = IncomingCallHandler.getOrCreateInstance()
incomingCallHandler.contentView = self
```

Set a delegate to the CallAgent after the CallAgent being successfully created:

```Swift
self.callAgent!.delegate = incomingCallHandler
```

Once there's an incoming call, the `IncomingCallHandler` calls the function `showIncomingCallBanner` to display `answer` and `decline` button.

```Swift
func showIncomingCallBanner(_ incomingCall: IncomingCall?) {
    isIncomingCall = true
    self.incomingCall = incomingCall
}
```

The actions attached to `answer` and `decline` are implemented as the following code. In order to answer the call with video, we need to turn on the local video and set the options of `AcceptCallOptions` with `localVideoStream`.

```Swift
func answerIncomingCall() {
    isIncomingCall = false
    let options = AcceptCallOptions()
    if (self.incomingCall != nil) {
        guard let deviceManager = deviceManager else {
            return
        }        
        if (self.localVideoStream == nil) {
            self.localVideoStream = [LocalVideoStream]()
        }
        if(sendingVideo)
        {
            let camera = deviceManager.cameras.first
            localVideoStream!.append(LocalVideoStream(camera: camera!))
            let videoOptions = VideoOptions(localVideoStreams: localVideoStream!)
            options.videoOptions = videoOptions
        }
        self.incomingCall!.accept(options: options) { (call, error) in
            setCallAndObersever(call: call, error: error)
        }
    }
}

func declineIncomingCall(){
    self.incomingCall!.reject { (error) in }
    isIncomingCall = false
}
```

## Remote participant video streams

We can create a `RemoteVideoStreamData` class to handle rendering video streams of remote participant.

```Swift
public class RemoteVideoStreamData : NSObject, RendererDelegate {
    public func videoStreamRenderer(didFailToStart renderer: VideoStreamRenderer) {
        owner.errorMessage = "Renderer failed to start"
    }
    
    private var owner:ContentView
    let stream:RemoteVideoStream
    var renderer:VideoStreamRenderer? {
        didSet {
            if renderer != nil {
                renderer!.delegate = self
            }
        }
    }
    
    var views:[RendererView] = []
    init(view:ContentView, stream:RemoteVideoStream) {
        owner = view
        self.stream = stream
    }
    
    public func videoStreamRenderer(didRenderFirstFrame renderer: VideoStreamRenderer) {
        let size:StreamSize = renderer.size
        owner.remoteVideoSize = String(size.width) + " X " + String(size.height)
    }
}
```

## Subscribe to events

We can implement a `CallObserver` class to subscribe to a collection of events to be notified when values change during the call.

```Swift
public class CallObserver: NSObject, CallDelegate, IncomingCallDelegate {
    private var owner: ContentView
    init(_ view:ContentView) {
            owner = view
    }
        
    public func call(_ call: Call, didChangeState args: PropertyChangedEventArgs) {
        if(call.state == CallState.connected) {
            initialCallParticipant()
        }
    }

    // render remote video streams when remote participant changes
    public func call(_ call: Call, didUpdateRemoteParticipant args: ParticipantsUpdatedEventArgs) {
        for participant in args.addedParticipants {
            participant.delegate = owner.remoteParticipantObserver
            for stream in participant.videoStreams {
                if !owner.remoteVideoStreamData.isEmpty {
                    return
                }
                let data:RemoteVideoStreamData = RemoteVideoStreamData(view: owner, stream: stream)
                let scalingMode = ScalingMode.fit
                data.renderer = try! VideoStreamRenderer(remoteVideoStream: stream)
                let view:RendererView = try! data.renderer!.createView(withOptions: CreateViewOptions(scalingMode:scalingMode))
                data.views.append(view)
                self.owner.remoteViews.append(view)
                owner.remoteVideoStreamData[stream.id] = data
            }
            owner.remoteParticipant = participant
        }
    }

    // Handle remote video streams when the call is connected
    public func initialCallParticipant() {
        for participant in owner.call!.remoteParticipants {
            participant.delegate = owner.remoteParticipantObserver
            for stream in participant.videoStreams {
                renderRemoteStream(stream)
            }
            owner.remoteParticipant = participant
        }
    }
    
    //create render for RemoteVideoStream and attach it to view
    public func renderRemoteStream(_ stream: RemoteVideoStream!) {
        if !owner.remoteVideoStreamData.isEmpty {
            return
        }
        let data:RemoteVideoStreamData = RemoteVideoStreamData(view: owner, stream: stream)
        let scalingMode = ScalingMode.fit
        data.renderer = try! VideoStreamRenderer(remoteVideoStream: stream)
        let view:RendererView = try! data.renderer!.createView(withOptions: CreateViewOptions(scalingMode:scalingMode))
        self.owner.remoteViews.append(view)
        owner.remoteVideoStreamData[stream.id] = data
    }
}
```

## Remote participant Management

All remote participants are represented with the `RemoteParticipant` type and are available through the `remoteParticipants` collection on a call instance.

We can implement a `RemoteParticipantObserver` class to subscribe to the updates on remote video streams of remote participants.

```Swift
public class RemoteParticipantObserver : NSObject, RemoteParticipantDelegate {
    private var owner:ContentView
    init(_ view:ContentView) {
        owner = view
    }

    public func renderRemoteStream(_ stream: RemoteVideoStream!) {
        let data:RemoteVideoStreamData = RemoteVideoStreamData(view: owner, stream: stream)
        let scalingMode = ScalingMode.fit
        data.renderer = try! VideoStreamRenderer(remoteVideoStream: stream)
        let view:RendererView = try! data.renderer!.createView(withOptions: CreateViewOptions(scalingMode:scalingMode))
        self.owner.remoteViews.append(view)
        owner.remoteVideoStreamData[stream.id] = data
    }
    
    // render RemoteVideoStream when remote participant turns on the video, dispose the renderer when remote video is off
    public func remoteParticipant(_ remoteParticipant: RemoteParticipant, didUpdateVideoStreams args: RemoteVideoStreamsEventArgs) {
        for stream in args.addedRemoteVideoStreams {
            renderRemoteStream(stream)
        }
        for stream in args.removedRemoteVideoStreams {
            for data in owner.remoteVideoStreamData.values {
                data.renderer?.dispose()
            }
            owner.remoteViews.removeAll()
        }
    }
}
```

## Run the code

You can build and run your app on iOS simulator by selecting Product > Run or by using the (⌘-R) keyboard shortcut.
