---
title: Quickstart - Add calling to an iOS app using Azure Communication Services
description: In this quickstart, you learn how to use the Azure Communication Services Calling client library for iOS.
author: matthewrobertson
ms.author: marobert
ms.date: 07/24/2020
ms.topic: quickstart
ms.service: azure-communication-services
---

In this quickstart, you'll learn how to start a call using the Azure Communication Services Calling client library for iOS.

## Prerequisites

To complete this tutorial, you’ll need the following prerequisites:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A Mac running [Xcode](https://go.microsoft.com/fwLink/p/?LinkID=266532), along with a valid developer certificate installed into your Keychain.
- A deployed Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A [User Access Token](../../access-tokens.md) for your Azure Communication Service.

## Setting up

### Creating the Xcode project

In Xcode, create a new iOS project and select the **Single View App** template. This tutorial uses the [SwiftUI framework](https://developer.apple.com/xcode/swiftui/), so you should set the **Language** to **Swift** and the **User Interface** to **SwiftUI**. You're not going to create tests during this quick start. Feel free to uncheck **Include Tests**.

:::image type="content" source="../media/ios/xcode-new-ios-project.png" alt-text="Screenshot showing the New Project window within Xcode.":::

### Install the package

Add the Azure Communication Services Calling client library and its dependencies (AzureCore.framework and AzureCommunication.framework) to your project.

> [!NOTE]
> With the release of AzureCommunicationCalling SDK you will find a bash script `BuildAzurePackages.sh`. 
The script when run `sh ./BuildAzurePackages.sh` will give you the path to the generated framework packages which needs to be imported in the sample app in the next step. Note that you will need to set up Xcode Command Line Tools if you have not done so before you run the script: Start Xcode, select "Preferences -> Locations". Pick your Xcode version for the Command Line Tools. **BuildAzurePackages.sh script works only with Xcode 11.5 and above**

1. [Download](https://github.com/Azure/Communication/releases) the Azure Communication Services Calling client library for iOS.
2. In Xcode, click on your project file to and select the build target to open the project settings editor.
3. Under the **General** tab, scroll to the **Frameworks, Libraries, and Embedded Content** section and click the **"+"** icon.
4. In the bottom left of the dialog, use the drop-down chose **Add Files**, navigate to the **AzureCommunicationCalling.framework** directory of the unzipped client library package.
    1. Repeat the last step for adding **AzureCore.framework** and **AzureCommunication.framework**.
5. Open the **Build Settings** tab of the project settings editor and scroll to the **Search Paths** section. Add a new **Framework Search Paths** entry for the directory containing the **AzureCommunicationCalling.framework**.
    1. Add another Framework Search Paths entry pointing to the folder containing the dependencies.

:::image type="content" source="../media/ios/xcode-framework-search-paths.png" alt-text="Screenshot showing updating the framework search paths within XCode.":::

### Request access to the microphone

In order to access the device's microphone, you need to update your app's Information Property List with an `NSMicrophoneUsageDescription`. You set the associated value to a `string` that will be included in the dialog the system uses to request access from the user.

Right-click the `Info.plist` entry of the project tree and select **Open As** > **Source Code**. Add the following lines the top level `<dict>` section, and then save the file.

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Need microphone access for VOIP calling.</string>
```

### Set up the app framework

Open your project's **ContentView.swift** file and add an `import` declaration to the top of the file to import the `AzureCommunicationCalling library`. In addition, import `AVFoundation`, we will need this for audio permission request in the code.

```swift
import AzureCommunicationCalling
import AVFoundation
```

Replace the implementation of the `ContentView` struct with some simple UI controls that enable a user to initiate and end a call. We will attach business logic to these controls in this quickstart.

```swift
struct ContentView: View {
    @State var callee: String = ""
    @State var callClient: ACSCallClient?
    @State var callAgent: ACSCallAgent?
    @State var call: ACSCall?

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

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling client library:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| ACSCallClient | The CallClient is the main entry point to the Calling client library.|
| ACSCallAgent | The CallAgent is used to start and manage calls. |
| CommunicationUserCredential | The CommunicationUserCredential is used as the token credential to instantiate the CallAgent.| 
| CommunicationIdentifier | The CommunicationIdentifier is used to represent the identity of the user which can be one of the following: CommunicationUser/PhoneNumber/CallingApplication. |

## Authenticate the client

Initialize a `CallAgent` instance with a User Access Token which will enable us to make and receive calls. Add the following code to the `onAppear` callback in **ContentView.swift**:

```swift
var userCredential: CommunicationUserCredential?
do {
    userCredential = try CommunicationUserCredential(token: "<USER ACCESS TOKEN>")
} catch {
    print("ERROR: It was not possible to create user credential.")
    return
}

self.callClient = ACSCallClient()

// Creates the call agent
self.callClient?.createCallAgent(userCredential) { (agent, error) in
    if error != nil {
        print("ERROR: It was not possible to create a call agent.")
    }

    if let agent = agent {
        self.callAgent = agent
        print("Call agent successfully created.")
    }
}
```

You need to replace `<USER ACCESS TOKEN>` with a valid user access token for your resource. Refer to the [user access token](../../access-tokens.md) documentation if you don't already have a token available.

## Start a call

The `startCall` method is set as the action that will be performed when the *Start Call* button is tapped. Update the implementation to start a call with the `ASACallAgent`:

```swift
func startCall()
{
    // Ask permissions
    AVAudioSession.sharedInstance().requestRecordPermission { (granted) in
        if granted {
            // start call logic
            let callees:[CommunicationIdentifier] = [CommunicationUser(identifier: self.callee)]
            self.call = self.callAgent?.call(callees, options: ACSStartCallOptions())
        }
    }
}
```

You also can use the properties in `ACSStartCallOptions` to set the initial options for the call (i.e. it allows starting the call with the microphone muted).

## End a call

Implement the `endCall` method to end the current call when the *End Call* button is tapped.

```swift
func endCall()
{    
    self.call!.hangup(ACSHangupOptions()) { (error) in
        if (error != nil) {
            print("ERROR: It was not possible to hangup the call.")
        }
    }
}
```

## Run the code

You can build and run your app on iOS simulator by selecting **Product** > **Run** or by using the (&#8984;-R) keyboard shortcut.

:::image type="content" source="../media/ios/quick-start-make-call.png" alt-text="Final look and feel of the quick start app":::

You can make an outbound VOIP call by providing a user ID in the text field and tapping the **Start Call** button. Calling `8:echo123` connects you with an echo bot, this is great for getting started and verifying your audio devices are working. 

> [!NOTE]
> The first time you make a call, the system will prompt you for access to the microphone. In a production application, you should use the `AVAudioSession` API to [check the permission status](https://developer.apple.com/documentation/uikit/protecting_the_user_s_privacy/requesting_access_to_protected_resources) and gracefully update your application's behavior when permission is not granted.

## Sample Code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/Add%20Voice%20Calling)
