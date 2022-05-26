---
description: In this tutorial, you learn how to use the Calling composite on iOS
author: palatter

ms.author: palatter
ms.date: 10/10/2021
ms.topic: include
ms.service: azure-communication-services
---

[!INCLUDE [Public Preview Notice](../../../../includes/public-preview-include.md)]

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-ios) for Android and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-library-quick-start)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Mac running [Xcode](https://go.microsoft.com/fwLink/p/?LinkID=266532) 13+, along with a valid developer certificate installed into your Keychain. [CocoaPods](https://cocoapods.org/) must also be installed to fetch dependencies.
- A deployed Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md).
- Azure Communication Services Token. [See example.](../../../identity/quick-create-identity.md)

## Setting up

### Creating the Xcode project

In Xcode, create a new iOS project and select the **App** template. We'll be using UIKit storyboards. You're not going to create tests during this quickstart. Feel free to uncheck **Include Tests**.

![Screenshot showing the New Project template selection within Xcode.](../../media/xcode-new-project-template-select.png)

Name the project `UILibraryQuickStart` and select `Storyboard` under the `Interface` dropdown.

![Screenshot showing the New Project details within Xcode.](../../media/xcode-new-project-details.png)

### Install the package and dependencies with CocoaPods

1. Create a Podfile in your project root directory by running `pod init`.
    - If encounter error, update [CocoaPods](https://guides.cocoapods.org/using/getting-started.html) to latest version
2. Add the following to your Podfile:

```
platform :ios, '14.0'

target 'UILibraryQuickStart' do
    use_frameworks!
    pod 'AzureCommunicationUICalling', '1.0.0-beta.1'
end
```

3. Run `pod install --repo-update`.
4. Open the generated `.xcworkspace` with Xcode.
5. (Optional) For Mackbook Pro M1, install and enable [Rosetta](https://support.apple.com/en-us/HT211861) in Xcode.

### Request access to the microphone, camera, etc.

To access the device's hardware, update your app's Information Property List. Set the associated value to a `string` that will be included in the dialog the system uses to request access from the user.

Right-click the `Info.plist` entry of the project tree and select **Open As** > **Source Code**. Add the following lines the top level `<dict>` section, and then save the file.

```xml
<key>NSCameraUsageDescription</key>
<string></string>
<key>NSMicrophoneUsageDescription</key>
<string></string>
```

To verify requesting the permission is added correctly, view the `Info.plist` as **Open As** > **Property List** and should expect to see the following:

![Screenshot showing the Camera and Microphone privacy in Xcode.](../../media/xcode-info-plist.png)

### Turn off `Bitcode`
Set `Enable Bitcode` option to `No` in the project `Build Settings`. To find the setting, you have to change the filter from `Basic` to `All`, you can also use the search bar on the right.

![Screenshot showing the BitCode option in Xcode.](../../media/xcode-bitcode-option.png)

## Initialize composite

Go to 'ViewController'. Here we'll drop the following code to initialize our Composite Components for Call. Replace `<GROUP_CALL_ID>` with either your call group ID or `UUID()` to generate one. Also replace `<DISPLAY_NAME>` with your name, and `<USER_ACCESS_TOKEN>` with your token. The limit for string length of `<DISPLAY_NAME>` is 256.

```swift
import UIKit
import AzureCommunicationCalling
import AzureCommunicationUICalling

class ViewController: UIViewController {

    private var callComposite: CallComposite?

    override func viewDidLoad() {
        super.viewDidLoad()

        let button = UIButton(frame: CGRect(x: 100, y: 100, width: 200, height: 50))
        button.contentEdgeInsets = UIEdgeInsets(top: 10.0, left: 20.0, bottom: 10.0, right: 20.0)
        button.layer.cornerRadius = 10
        button.backgroundColor = .systemBlue
        button.setTitle("Start Experience", for: .normal)
        button.addTarget(self, action: #selector(startCallComposite), for: .touchUpInside)

        button.translatesAutoresizingMaskIntoConstraints = false
        self.view.addSubview(button)
        button.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true
        button.centerYAnchor.constraint(equalTo: view.centerYAnchor).isActive = true
    }

    @objc private func startCallComposite() {
        let callCompositeOptions = CallCompositeOptions()

        callComposite = CallComposite(withOptions: callCompositeOptions)

        let communicationTokenCredential = try! CommunicationTokenCredential(token: "<USER_ACCESS_TOKEN>")

        let options = GroupCallOptions(credential: communicationTokenCredential,
                                       groupId: UUID(uuidString: "<GROUP_CALL_ID>")!,
                                       displayName: "<DISPLAY_NAME>")
        callComposite?.launch(with: options)
    }
}
```

## Run the code

You can build and run your app on iOS simulator by selecting **Product** > **Run** or by using the (&#8984;-R) keyboard shortcut.

1) Tap `Start Experience`.
2) Accept audio permissions and select device, mic, and video settings.
3) Tap `Start Call`.

![Final look and feel of the quick start app](../../media/quick-start-calling-composite-running-ios.gif)

## Object Model

The following classes and interfaces handle some of the major features of the Azure Communication Services UI client library:

| Name                                                                        | Description                                                                                  |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [CallComposite](#create-call-composite) | The composite renders a call experience with participant gallery and controls. |
| [CallCompositeOptions](#create-call-composite) | Includes options such as the theme configuration and the events handler. |
| [GroupCallOptions](#group-call) | The options for joining a group call, such as groupId. |
| [TeamsMeetingOptions](#teams-meeting) | The options for joining a Team's meeting, such as the meeting link. |
| [ThemeConfiguration](#apply-theme-configuration) | Allows you to customize the theme. |
| [LocalizationConfiguration](#apply-localization-configuration) | Allows you to set the language for the composite. |

## UI Library functionality

### Create call composite

Initialize a `CallCompositeOptions` instance and a `CallComposite` instance inside the `startCallComposite` function.

```swift
@objc private func startCallComposite() {
    let callCompositeOptions = CallCompositeOptions()

    callComposite = CallComposite(withOptions: callCompositeOptions)
}
```

### Setup authentication

Initialize a `CommunicationTokenCredential` instance inside the `startCallComposite` function. Replace `<USER_ACCESS_TOKEN>` with your token.

```swift
let communicationTokenCredential = try! CommunicationTokenCredential(token: "<USER_ACCESS_TOKEN>")
```

Refer to the [user access token](../../../identity/quick-create-identity.md) documentation if you don't already have a token available.

### Setup group call or Teams meeting options

Depending on what type of Call/Meeting you would like to set up, use the appropriate options object.

#### Group call

Initialize a `GroupCallOptions` instance inside the `startCallComposite` function. Replace `<GROUP_CALL_ID>` with your group ID for your call and `<DISPLAY_NAME>` with your name.

```swift
// let uuid = UUID() to create a new call
let uuid = UUID(uuidString: "<GROUP_CALL_ID>")!
let options = GroupCallOptions(credential: communicationTokenCredential,
                               groupId: uuid,
                               displayName: "<DISPLAY_NAME>")
```

#### Teams meeting

Initialize a `TeamsMeetingOptions` instance inside the `startCallComposite` function. Replace `<TEAMS_MEETING_LINK>` with your group ID for your call and `<DISPLAY_NAME>` with your name.

```swift
let options = TeamsMeetingOptions(credential: communicationTokenCredential,
                                  meetingLink: "<TEAMS_MEETING_LINK>",
                                  displayName: "<DISPLAY_NAME>")
```

#### Get a Microsoft Teams meeting link

A Microsoft Teams meeting link can be retrieved using Graph APIs. This process is detailed in [Graph documentation](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true).
The Communication Services Calling SDK accepts a full Microsoft Teams meeting link. This link is returned as part of the `onlineMeeting` resource, accessible under the [`joinWebUrl` property](/graph/api/resources/onlinemeeting?view=graph-rest-beta&preserve-view=true)
You can also get the required meeting information from the **Join Meeting** URL in the Teams meeting invite itself.

### Launch

Call `launch` on the `CallComposite` instance inside the `startCallComposite` function

```swift
callComposite?.launch(with: options)
```

### Subscribe to events

You can implement the closures to act on the events. An event for when the composite ended with an error is an example.

```swift
callComposite?.setTarget(didFail: { error in
    print("didFail with error:\(error)")
})
```
### Apply theme configuration

You can customize the theme by creating a custom theme configuration that implements the ThemeConfiguration protocol. You then include an instance of that new class in your CallCompositeOptions.

```swift
class CustomThemeConfiguration: ThemeConfiguration {
   var primaryColor: UIColor {
       return UIColor.red
   }
}
```

```swift
let callCompositeOptions = CallCompositeOptions(theme: CustomThemeConfiguration())
```

### Apply localization configuration

You can change the language by creating a custom localization configuration and include it to your `CallCompositeOptions`.  By default, all text labels use our English (`CommunicationUISupportedLocale.en`) strings. If desired, `LocalizationConfiguration` can be used to set a different `locale`. Out of the box, the UI library includes a set of `locale` usable with the UI components. `LocalizationConfiguration.supportedLanguages` provides a list of all supported languages. 

For the example below, the composite will be localized to French (`fr`). 

```swift
// Creating swift Locale struct
var localizationConfiguration = LocalizationConfiguration(locale: Locale(identifier: "fr-FR"))

// Use intellisense CommunicationUISupportedLocale to get supported Locale struct
localizationConfiguration = LocalizationConfiguration(locale: CommunicationUISupportedLocale.frFR)

let callCompositeOptions = CallCompositeOptions(localizationConfiguration: localizationConfiguration) 
```

## Add notifications into your mobile app

The push notifications allow you to send information from your application to users' mobile devices. You can use push notifications to show a dialog, play a sound, or display incoming call UI. Azure Communication Services provides integrations with [Azure Event Grid](../../../../../event-grid/overview.md) and [Azure Notification Hubs](../../../../../notification-hubs/notification-hubs-push-notification-overview.md) that enable you to add push notifications to your apps [follow the link.](../../../../concepts/notifications.md)

