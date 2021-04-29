---
title: Quickstart - Add joining a Microsoft Teams meeting to an iOS app using Azure Communication Services
description: In this quickstart, you'll learn how to use the Azure Communication Services Teams Embed library for iOS.
author: palatter
ms.author: palatter
ms.date: 01/25/2021
ms.topic: quickstart
ms.service: azure-communication-services
---

In this quickstart, you'll learn how to join a Microsoft Teams meeting using the Azure Communication Services Teams Embed library for iOS.

## Prerequisites

To complete this quickstart, you’ll need the following prerequisites:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A Mac running [Xcode](https://go.microsoft.com/fwLink/p/?LinkID=266532), along with a valid developer certificate installed into your Keychain.
- A deployed Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A [User Access Token](../../access-tokens.md) for your Azure Communication Service.
- [CocoaPods](https://cocoapods.org/) installed for your build environment.

## Setting up

### Creating the Xcode project

In Xcode, create a new iOS project and select the **App** template. We will be using UIKit storyboards. You're not going to create tests during this quickstart. Feel free to uncheck **Include Tests**.

:::image type="content" source="../media/ios/xcode-new-project-template-select.png" alt-text="Screenshot showing the New Project template selection within Xcode.":::

Name the project `TeamsEmbedGettingStarted`.

:::image type="content" source="../media/ios/xcode-new-project-details.png" alt-text="Screenshot showing the New Project details within Xcode.":::

### Install the package and dependencies with CocoaPods

1. Create a Podfile for your application:

```
platform :ios, '12.0'
use_frameworks!

target 'TeamsEmbedGettingStarted' do
    pod 'AzureCommunication', '~> 1.0.0-beta.11'
end

azure_libs = [
'AzureCommunication',
'AzureCore']

post_install do |installer|
    installer.pods_project.targets.each do |target|
    if azure_libs.include?(target.name)
        puts "Adding BUILD_LIBRARY_FOR_DISTRIBUTION to #{target.name}"
        target.build_configurations.each do |config|
        xcconfig_path = config.base_configuration_reference.real_path
        File.open(xcconfig_path, "a") {|file| file.puts "BUILD_LIBRARY_FOR_DISTRIBUTION = YES"}
        end
    end
    end
end
```

2. Run `pod install`.
3. Open the generated `.xcworkspace` with Xcode.

### Request access to the microphone, camera, etc.

To access the device's hardware, update your app's Information Property List. Set the associated value to a `string` that will be included in the dialog the system uses to request access from the user.

Right-click the `Info.plist` entry of the project tree and select **Open As** > **Source Code**. Add the following lines the top level `<dict>` section, and then save the file.

```xml
<key>NSCameraUsageDescription</key>
<string></string>
<key>NSContactsUsageDescription</key>
<string></string>
<key>NSMicrophoneUsageDescription</key>
<string></string>
```

### Add the Teams Embed framework

1. Download the [`MicrosoftTeamsSDK` iOS package.](https://github.com/Azure/communication-teams-embed/releases)
2. Create a `Frameworks` folder in the project root. Ex. `\TeamsEmbedGettingStarted\Frameworks\`
3. Copy the downloaded `TeamsAppSDK.framework` and `MeetingUIClient.framework` and other frameworks provided in the release bundle to this folder.
4. Add the frameworks to the project target under the general tab. Use the `Add Other` -> `Add Files...` to navigate to the framework files and add them.

:::image type="content" source="../media/ios/xcode-add-frameworks.png" alt-text="Screenshot showing the added frameworks in Xcode.":::

5. If it isn't already, add `$(PROJECT_DIR)/Frameworks` to `Framework Search Paths` under the project target build settings tab. To find the setting, you have change the filter from `basic` to `all`, you can also use the search bar on the right.

:::image type="content" source="../media/ios/xcode-add-framework-search-path.png" alt-text="Screenshot showing the framework search path in Xcode.":::

### Turn off Bitcode

Set `Enable Bitcode` option to `No` in the project `Build Settings`. To find the setting, you have to change the filter from `Basic` to `All`, you can also use the search bar on the right.

:::image type="content" source="../media/ios/xcode-bitcode-option.png" alt-text="Screenshot showing the BitCode option in Xcode.":::


### Turn on Voice over IP background mode.

Select your app target and click the Capabilities tab.

Turn on `Background Modes` by clicking the `+ Capabilities` at the top and select `Background Modes`.

Select checkbox for `Voice over IP`.

:::image type="content" source="../media/ios/xcode-background-voip.png" alt-text="Screenshot showing enabled VOIP in Xcode.":::

### Add a window reference to AppDelegate

Open your project's **AppDelegate.swift** file and add a reference for 'window'.

```swift
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
```

### Add a button to the ViewController

Create a button in the `viewDidLoad` callback in **ViewController.swift**.

```swift
override func viewDidLoad() {
    super.viewDidLoad()
    
    let button = UIButton(frame: CGRect(x: 100, y: 100, width: 200, height: 50))
    button.backgroundColor = .black
    button.setTitle("Join Meeting", for: .normal)
    button.addTarget(self, action: #selector(joinMeetingTapped), for: .touchUpInside)
    
    button.translatesAutoresizingMaskIntoConstraints = false
    self.view.addSubview(button)
    button.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true
    button.centerYAnchor.constraint(equalTo: view.centerYAnchor).isActive = true
```

Create an outlet for the button in **ViewController.swift**.

```swift
@IBAction func joinMeetingTapped(_ sender: UIButton) {

}
```

### Set up the app framework

Open your project's **ViewController.swift** file and add an `import` declaration to the top of the file to import the `AzureCommunication library` and the `MeetingUIClient`. 

```swift
import UIKit
import AzureCommunication
import MeetingUIClient
```

Replace the implementation of the `ViewController` class with a simple button to allow the user to join a meeting. We will attach business logic to the button in this quickstart.

```swift
class ViewController: UIViewController {

    private var meetingUIClient: MeetingUIClient?
    
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

The following classes and interfaces handle some of the major features of the Azure Communication Services Teams Embed library:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| MeetingUIClient | The MeetingUIClient is the main entry point to the Teams Embed library. |
| MeetingUIClientMeetingJoinOptions | MeetingUIClientMeetingJoinOptions are used for configurable options such as display name. |
| MeetingUIClientGroupCallJoinOptions | MeetingUIClientMeetingJoinOptions are used for configurable options such as display name. |
| MeetingUIClientTeamsMeetingLinkLocator | MeetingUIClientTeamsMeetingLinkLocator is used to set the meeting URL for joining a meeting. |
| MeetingUIClientGroupCallLocator | MeetingUIClientGroupCallLocator is used for setting the group ID to join. |
| MeetingUIClientCallState | The MeetingUIClientCallState is used to for reporting call state changes. The options are as follows: `connecting`, `waitingInLobby`, `connected`, and `ended`. |
| MeetingUIClientDelegate | The MeetingUIClientDelegate is used to receive events, such as changes in call state. |
| MeetingUIClientIdentityProviderDelegate | The MeetingUIClientIdentityProviderDelegate is used to map user details to the users in a meeting. |
| MeetingUIClientUserEventDelegate | The MeetingUIClientUserEventDelegate provides information about user actions in the UI. |

## Create and Authenticate the client

Initialize a `MeetingUIClient` instance with a User Access Token, which will enable us to join meetings. Add the following code to the `viewDidLoad` callback in **ViewController.swift**:

```swift
do {
    let communicationTokenRefreshOptions = CommunicationTokenRefreshOptions(initialToken: "<USER_ACCESS_TOKEN>", refreshProactively: true, tokenRefresher: fetchTokenAsync(completionHandler:))
	let credential = try CommunicationTokenCredential(withOptions: communicationTokenRefreshOptions)
    meetingUIClient = MeetingUIClient(with: credential)
}
catch {
    print("Failed to create communication token credential")
}
```

Replace `<USER_ACCESS_TOKEN>` with a valid user access token for your resource. Refer to the [user access token](../../access-tokens.md) documentation if you don't already have a token available.

### Setup Token refreshing

Create a `fetchTokenAsync` method. Then add your `fetchToken` logic to get the user token.

```swift
private func fetchTokenAsync(completionHandler: @escaping TokenRefreshHandler) {
    func getTokenFromServer(completionHandler: @escaping (String) -> Void) {
        completionHandler("<USER_ACCESS_TOKEN>")
    }
    getTokenFromServer { newToken in
        completionHandler(newToken, nil)
    }
}
```

Replace `<USER_ACCESS_TOKEN>` with a valid user access token for your resource.

## Join a meeting

The `join` method is set as the action that will be performed when the *Join Meeting* button is tapped. Update the implementation to join a meeting with the `MeetingUIClient`:

```swift
private func joinMeeting() {
    let meetingJoinOptions = MeetingUIClientMeetingJoinOptions(displayName: "John Smith", enablePhotoSharing: true, enableNamePlateOptionsClickDelegate: true)
    let meetingLocator = MeetingUIClientTeamsMeetingLinkLocator(meetingLink: "<MEETING_URL>")
    meetingUIClient?.join(meetingLocator: meetingLocator, joinCallOptions: meetingJoinOptions, completionHandler: { (error: Error?) in
        if (error != nil) {
            print("Join meeting failed: \(error!)")
        }
    })
}
```

Replace `<MEETING URL>` with a Microsoft Teams meeting link.

### Get a Microsoft Teams meeting link

A Microsoft Teams meeting link can be retrieved using Graph APIs. This is detailed in [Graph documentation](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true).
The Communication Services Calling SDK accepts a full Microsoft Teams meeting link. This link is returned as part of the `onlineMeeting` resource, accessible under the [`joinWebUrl` property](/graph/api/resources/onlinemeeting?view=graph-rest-beta&preserve-view=true)
You can also get the required meeting information from the **Join Meeting** URL in the Teams meeting invite itself.

## Run the code

You can build and run your app on iOS simulator by selecting **Product** > **Run** or by using the (&#8984;-R) keyboard shortcut.

:::image type="content" source="../media/ios/quick-start-join-meeting.png" alt-text="Final look and feel of the quick start app":::

:::image type="content" source="../media/ios/quick-start-meeting-joined.png" alt-text="Final look and feel once the meeting has been joined":::

> [!NOTE]
> The first time you join a meeting, the system will prompt you for access to the microphone. In a production application, you should use the `AVAudioSession` API to [check the permission status](https://developer.apple.com/documentation/uikit/protecting_the_user_s_privacy/requesting_access_to_protected_resources) and gracefully update your application's behavior when permission is not granted.

## Add localization support based on your app

The Microsoft Teams SDK supports over 100 strings and resources. The framework bundle contains Base and English languages. The rest of them are included in the `Localizations.zip` file included with the package.

#### Add localizations to the SDK based on what your app supports

1. Determine what kind of localizations your application supports from the app Xcode Project > Info > Localizations list
2. Unzip the Localizations.zip included with the package
3. Copy the localization folders from the unzipped folder based on what your app supports to the root of the TeamsAppSDK.framework


## Sample Code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/teams-embed-ios-getting-started)
