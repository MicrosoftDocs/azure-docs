---
title: Quickstart - Add joining a meeting to an iOS app using Azure Communication Services
description: In this quickstart, you learn how to use the Azure Communication Services Meeting Client library for iOS.
author: patricklatter
ms.author: palatter
ms.date: 01/25/2021
ms.topic: quickstart
ms.service: azure-communication-services
---

In this quickstart, you'll learn how to start a call using the Azure Communication Services Meeting Client library for iOS.

## Prerequisites

To complete this tutorial, you’ll need the following prerequisites:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A Mac running [Xcode](https://go.microsoft.com/fwLink/p/?LinkID=266532), along with a valid developer certificate installed into your Keychain.
- A deployed Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A [User Access Token](../../access-tokens.md) for your Azure Communication Service.

## Setting up

### Creating the Xcode project

In Xcode, create a new iOS project and select the **App** template. We will be using UIKit storyboards. You're not going to create tests during this quick start. Feel free to uncheck **Include Tests**.

:::image type="content" source="../media/ios/xcode-new-project-template-select.png" alt-text="Screenshot showing the New Project template selection within Xcode.":::

:::image type="content" source="../media/ios/xcode-new-project-details.png" alt-text="Screenshot showing the New Project details within Xcode.":::

### Install the package and dependencies with CocoaPods

1. Create a Podfile for your application, like this:

```
platform :ios, '13.0'
use_frameworks!

target 'AzureCommunicationCallingSample' do
    pod 'AzureCommunication', '~> 1.0.0-beta.7'
    pod 'AzureCore', '~> 1.0.0-beta.7'
end
```

2. Run `pod install`.
3. Open the `.xcworkspace` with Xcode.

### Request access to the microphone

In order to access the device's microphone, you need to update your app's Information Property List with an `NSMicrophoneUsageDescription`. You set the associated value to a `string` that will be included in the dialog the system uses to request access from the user.

Right-click the `Info.plist` entry of the project tree and select **Open As** > **Source Code**. Add the following lines the top level `<dict>` section, and then save the file.

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Need microphone access for VOIP calling.</string>
```

### Add the meeting composite framework

Download the framework from the latest release. Add the framework to the project target under the general tab.

< Add more here once we have private preview released >

### Set up the app framework

Open your project's **viewController.swift** file and add an `import` declaration to the top of the file to import the `AzureCommunication library` and the `MeetingSDK`. 

```swift
import UIKit
import AzureCommunication
import MeetingSDK
```

Replace the implementation of the `ViewController` class with a simple button to allow the user to join a meeting. We will attach business logic to the button in this quickstart.

```swift
class ViewController: UIViewController {

    private let joinOptions = JoinOptions(displayName: "John Smith", isMicrophoneMuted: false, isVideoOff: false)
    private var meetingClient: MeetingClient?
    private var communicationTokenCredential: CommunicationTokenCredential?
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Initialize meetingClient
    }

    @IBAction func joinMeetingTapped(_ sender: UIButton) {
        joinMeeting()
    }
    
    private func joinMeeting() {
        // Add join meeting logic
    }
}
```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Meeting Composite library:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| MeetingClient | The MeetingClient is the main entry point to the Meeting library.|
| MeetingClientDelegate | The CallAgent is used to start and manage calls. |
| JoinOptions | JoinOptions are used for configurable options such as display name, and is the microphone muted, etc. | 
| CallState | The CallState is used to for reporting call state changes. The options are as follows: connecting, waitingInLobby, connected, and ended. |

## Authenticate the client

Initialize a `MeetingClient` instance with a User Access Token which will enable us to make and receive calls. Add the following code to the `viewDidLoad` callback in **ViewController.swift**:

```swift
do {
    try communicationTokenCredential = CommunicationTokenCredential(token: <USER ACCESS TOKEN>)
    meetingClient = MeetingClient(with: communicationTokenCredential!)}
catch {
    print("Failed to create communication token credential")
}
```

You need to replace `<USER ACCESS TOKEN>` with a valid user access token for your resource. Refer to the [user access token](../../access-tokens.md) documentation if you don't already have a token available.

## Start a call

The `joinMeeting` method is set as the action that will be performed when the *Join Meeting* button is tapped. Update the implementation to start a call with the `MeetingClient`:

```swift
private func joinMeeting() {
    meetingClient?.joinMeeting(with: meetingURL, joinOptions: joinOptions, completionHandler: { (error: Error?) in
        if (error != nil) {
            print("Join meeting failed: \(error!)")
        }
    })
}
```

You also can use the properties in `JoinOptions` to set the initial options for the meeting (i.e. it allows starting the meeting with the microphone muted).

## Run the code

You can build and run your app on iOS simulator by selecting **Product** > **Run** or by using the (&#8984;-R) keyboard shortcut.

:::image type="content" source="../media/ios/quick-start-make-call.png" alt-text="Final look and feel of the quick start app":::

> [!NOTE]
> The first time you make a call, the system will prompt you for access to the microphone. In a production application, you should use the `AVAudioSession` API to [check the permission status](https://developer.apple.com/documentation/uikit/protecting_the_user_s_privacy/requesting_access_to_protected_resources) and gracefully update your application's behavior when permission is not granted.

## Sample Code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/meeting-sdk-ios-getting-started)
