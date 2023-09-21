---
title: Quickstart - Add calling to an iOS app using Azure Communication Services
description: In this quickstart, you learn how to use the Azure Communication Services Calling SDK for iOS.
author: tophpalmer
ms.author: rifox
ms.date: 03/10/2021
ms.topic: include
ms.service: azure-communication-services
---

In this quickstart, you learn how to start a call using the Azure Communication Services Calling SDK for iOS.

## Sample Code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/add-video-calling).

## Prerequisites

To complete this tutorial, you need the following prerequisites:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A Mac running [Xcode](https://go.microsoft.com/fwLink/p/?LinkID=266532), along with a valid developer certificate installed into your Keychain.
- A deployed Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md). You need to **record your connection string** for this quickstart.
- A [User Access Token](../../../identity/access-tokens.md) for your Azure Communication Service. You can also use the Azure CLI and run the command with your connection string to create a user and an access token.

  ```azurecli-interactive
  az communication identity token issue --scope voip --connection-string "yourConnectionString"
  ```

  For details, see [Use Azure CLI to Create and Manage Access Tokens](../../../identity/access-tokens.md?pivots=platform-azcli).
  
## Setting up

### Creating the Xcode project

In Xcode, create a new iOS project and select the **App** template. This tutorial uses the [SwiftUI framework](https://developer.apple.com/xcode/swiftui/), so you should set the **Language** to **Swift** and the **User Interface** to **SwiftUI**. You're not going to create tests during this quick start. Feel free to uncheck **Include Tests**.

:::image type="content" source="../../media/ios/xcode-new-ios-project.png" alt-text="Screenshot showing the New Project window within Xcode.":::

### Install the package and dependencies with CocoaPods

1. To create a Podfile for your application, open the terminal and navigate to the project folder and run:

   `pod init`

1. Add the following code to the Podfile and save (make sure that "target" matches the name of your project):

   ```
   platform :ios, '13.0'
   use_frameworks!

   target 'AzureCommunicationCallingSample' do
     pod 'AzureCommunicationCalling', '~> 1.0.0'
   end
   ```

1. Run `pod install`.

1. Open the `.xcworkspace` with Xcode.

### Request access to the microphone

In order to access the device's microphone, you need to update your app's Information Property List with an `NSMicrophoneUsageDescription`. You set the associated value to a `string` that was included in the dialog the system uses to request access from the user.

Right-click the `Info.plist` entry of the project tree and select **Open As** > **Source Code**. Add the following lines the top level `<dict>` section, and then save the file.

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Need microphone access for VOIP calling.</string>
```

### Set up the app framework

Open your project's **ContentView.swift** file and add an `import` declaration to the top of the file to import the `AzureCommunicationCalling library`. In addition, import `AVFoundation`, we need this code for audio permission request in the code.

```swift
import AzureCommunicationCalling
import AVFoundation
```

Replace the implementation of the `ContentView` struct with some simple UI controls that enable a user to initiate and end a call. We attach business logic to these controls in this quickstart.

```swift
struct ContentView: View {
    @State var callee: String = ""
    @State var callClient: CallClient?
    @State var callAgent: CallAgent?
    @State var call: Call?

    var body: some View {
        NavigationView {
            Form {
                Section {
                    TextField("Who would you like to call?", text: $callee)
                    Button(action: startCall) {
                        Text("Start Call")
                    }.disabled(callAgent == nil)
                    Button(action: endCall) {
                        Text("End Call")
                    }.disabled(call == nil)
                }
            }
            .navigationBarTitle("Calling Quickstart")
        }.onAppear {
            // Initialize call agent
        }
    }

    func startCall() {
        // Ask permissions
        AVAudioSession.sharedInstance().requestRecordPermission { (granted) in
            if granted {
                // Add start call logic
            }
        }
    }

    func endCall() {
        // Add end call logic
    }
}
```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling SDK:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| `CallClient` | The `CallClient` is the main entry point to the Calling SDK.|
| `CallAgent` | The `CallAgent` is used to start and manage calls. |
| `CommunicationTokenCredential` | The `CommunicationTokenCredential` is used as the token credential to instantiate the `CallAgent`.| 
| `CommunicationUserIdentifier` | The `CommunicationUserIdentifier` is used to represent the identity of the user, which can be one of the following options: `CommunicationUserIdentifier`,`PhoneNumberIdentifier` or `CallingApplication.` |

## Authenticate the client

Initialize a `CallAgent` instance with a User Access Token, which enables us to make and receive calls.

In the following code, you need to replace `<USER ACCESS TOKEN>` with a valid user access token for your resource. Refer to the [user access token](../../../identity/access-tokens.md) documentation if you don't already have a token available.

Add the following code to the `onAppear` callback in **ContentView.swift**:

```swift
var userCredential: CommunicationTokenCredential?
do {
    userCredential = try CommunicationTokenCredential(token: "<USER ACCESS TOKEN>")
} catch {
    print("ERROR: It was not possible to create user credential.")
    return
}

self.callClient = CallClient()

// Creates the call agent
self.callClient?.createCallAgent(userCredential: userCredential!) { (agent, error) in
    if error != nil {
        print("ERROR: It was not possible to create a call agent.")
        return
    }
    else {
        self.callAgent = agent
        print("Call agent successfully created.")
    }
}
```

## Start a call

The `startCall` method is set as the action that is performed when the *Start Call* button is tapped. Update the implementation to start a call with the `ASACallAgent`:

```swift
func startCall()
{
    // Ask permissions
    AVAudioSession.sharedInstance().requestRecordPermission { (granted) in
        if granted {
            // start call logic
            let callees:[CommunicationIdentifier] = [CommunicationUserIdentifier(self.callee)]
            self.callAgent?.startCall(participants: callees, options: StartCallOptions()) { (call, error) in
                if (error == nil) {
                    self.call = call
                } else {
                    print("Failed to get call object")
                }
            }
        }
    }
}
```

You also can use the properties in `StartCallOptions` to set the initial options for the call (that is, it allows starting the call with the microphone muted).

## End a call

Implement the `endCall` method to end the current call when the *End Call* button is tapped.

```swift
func endCall()
{    
    self.call!.hangUp(options: HangUpOptions()) { (error) in
        if (error != nil) {
            print("ERROR: It was not possible to hangup the call.")
        }
    }
}
```

## Run the code

You can build and run your app on iOS simulator by selecting **Product** > **Run** or by using the (&#8984;-R) keyboard shortcut.

:::image type="content" source="../../media/ios/quick-start-make-call.png" alt-text="Final look and feel of the quick start app":::

You can make an outbound VOIP call by providing a user ID in the text field and tapping the **Start Call** button. Calling `8:echo123` connects you with an echo bot, this feature is great for getting started and verifying your audio devices are working.

> [!NOTE]
> The first time you make a call, the system will prompt you for access to the microphone. In a production application, you should use the `AVAudioSession` API to [check the permission status](https://developer.apple.com/documentation/uikit/protecting_the_user_s_privacy/requesting_access_to_protected_resources) and gracefully update your application's behavior when permission is not granted.
