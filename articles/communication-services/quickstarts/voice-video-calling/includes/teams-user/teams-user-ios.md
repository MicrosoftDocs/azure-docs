---
title: Quickstart - Make a call to Teams user from an iOS app
description: In this tutorial, you learn how to make a call to Teams user using the Azure Communication Services Calling SDK for iOS
author: ruslanzdor
ms.author: ruslanzdor
ms.date: 07/19/2023
ms.topic: include
ms.service: azure-communication-services
---

## Prerequisites

- A working [Communication Services calling iOS app](../../getting-started-with-calling.md).
- A [Teams deployment](/deployoffice/teams-install).

We will use beta.12 of AzureCommunicationCalling SDK for this quickstart so we need to update the podfile and install the Pods again.

Replace your podfile with the following code to the Podfile and save (make sure that "target" matches the name of your project):

   ```
   platform :ios, '13.0'
   use_frameworks!

   target 'AzureCommunicationCallingSample' do
     pod 'AzureCommunicationCalling', '1.0.0-beta.12'
   end
   ```
Delete your Pods folder, Podfile.lock and the `.xcworkspace.` file.

Run `pod install` and open the `.xcworkspace` with Xcode.

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

Replace the implementation of the ContentView `struc`t with some simple UI controls that enable a user to initiate and end a call. We add business logic to these controls in this quickstart.

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

## Run the code

You can build and run your app on iOS simulator by selecting Product > Run or by using the (⌘-R) keyboard shortcut.