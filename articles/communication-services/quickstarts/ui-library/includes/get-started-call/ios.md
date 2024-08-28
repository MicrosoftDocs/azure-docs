---
author: palatter
ms.author: palatter
ms.date: 10/10/2021
ms.topic: include
ms.service: azure-communication-services
---

> [!VIDEO https://www.youtube.com/embed/Aq5VTLfXU_4]

Get the sample iOS application for this [QuickStart](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-calling) in the open source Azure Communication Services [UI Library for iOS](https://github.com/Azure/communication-ui-library-ios).

## Prerequisites

- An Azure account and an active Azure subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Mac running [Xcode](https://go.microsoft.com/fwLink/p/?LinkID=266532) 13 or later and a valid developer certificate installed in your keychain. [CocoaPods](https://cocoapods.org/) must also be installed to fetch dependencies.
- A deployed [Azure Communication Services resource](../../../create-communication-resource.md).
- An Azure Communication Services [access token](../../../identity/quick-create-identity.md).

## Set up the project

Complete the following sections to set up the quickstart project.

### Create a new Xcode project

In Xcode, create a new project:

1. In the **File** menu, select **New** > **Project**.

1. In **Choose a template for your new project**, select the **iOS** platform and select the **App** application template. The quickstart uses the UIKit storyboards. The quickstart doesn't create tests, so you can clear the **Include Tests** checkbox.

   :::image type="content" source="../../media/xcode-new-project-template-select.png" alt-text="Screenshot that shows the Xcode new project dialog, with iOS and the App template selected.":::

1. In **Choose options for your new project**, for the product name, enter **UILibraryQuickStart**. For the interface, select **Storyboard**.

   :::image type="content" source="../../media/xcode-new-project-details.png" alt-text="Screenshot that shows setting new project options in Xcode.":::

### Install the package and dependencies

1. (Optional) For MacBook with M1, install, and enable [Rosetta](https://support.apple.com/en-us/HT211861) in Xcode.

1. In your project root directory, run `pod init` to create a Podfile. If you encounter an error, update [CocoaPods](https://guides.cocoapods.org/using/getting-started.html) to the current version.

1. Add the following code to your Podfile. Replace `UILibraryQuickStart` with your project name.

    ```ruby
    platform :ios, '15.0'
    
    target 'UILibraryQuickStart' do
        use_frameworks!
        pod 'AzureCommunicationUICalling'
    end
    ```

1. Run `pod install --repo-update`.

1. In Xcode, open the generated.xcworkspace* file.

### Request access to device hardware

To access the device's hardware, including the microphone, and camera, update your app's information property list. Set the associated value to a string that's included in the dialog the system uses to request access from the user.

1. Right-click the `Info.plist` entry of the project tree and select **Open As** > **Source Code**. Add the following lines to the top level `<dict>` section, and then save the file.

   ```xml
   <key>NSCameraUsageDescription</key>
   <string></string>
   <key>NSMicrophoneUsageDescription</key>
   <string></string>
   ```

   Here's an example of the `Info.plist` source code in an Xcode file:

   :::image type="content" source="../../media/xcode-info-plist-source-code.png" alt-text="Screenshot that shows an example of the info plist source code in an Xcode file.":::

1. To verify that device permission requests are added correctly, select **Open As** > **Property List**. Check that the information property list looks similar to the following example:

   :::image type="content" source="../../media/xcode-info-plist.png" alt-text="Screenshot that shows the camera and microphone device privacy in Xcode.":::

### Turn off Bitcode

In the Xcode project, under **Build Settings**, set the **Enable Bitcode** option to **No**. To find the setting, change the filter from **Basic** to **All** or use the search bar.

:::image type="content" source="../../media/xcode-bitcode-option.png" alt-text="Screenshot that shows the Build Settings option to turn off Bitcode.":::

## Initialize the composite

To initialize the composite:

1. Go to `ViewController`.

1. Add the following code to initialize your composite components for a call. Replace `<GROUP_CALL_ID>` with either the group ID for your call or with `UUID()` to generate a group ID for the call. Replace `<DISPLAY_NAME>` with your name. (The string length limit for `<DISPLAY_NAME>` is 256 characters.) Replace `<USER_ACCESS_TOKEN>` with your access token. 

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
            let callCompositeOptions = CallCompositeOptions(displayName: "<DISPLAY_NAME>")
            let communicationTokenCredential = try! CommunicationTokenCredential(token: "<USER_ACCESS_TOKEN>")

            callComposite = CallComposite(credential: communicationTokenCredential, withOptions: callCompositeOptions)
  
            callComposite?.launch(locator: .groupCall(groupId: UUID(uuidString: "<GROUP_CALL_ID>")!))
        }
    }
    ```

## Run the code

To build and run your app on the iOS simulator, select **Product** > **Run** or use the (&#8984;-R) keyboard shortcut. Then, try out the call experience on the simulator:

1. Select **Start Experience**.

1. Accept audio permissions, and then select device, mic, and video settings.

1. Select **Start call**.

:::image type="content" source="../../media/quick-start-calling-composite-running-ios.gif" alt-text="GIF animation that demonstrates the final look and feel of the quickstart iOS app.":::

## Object model

The following classes and interfaces handle some key features of the Azure Communication Services UI client library:

| Name                                                                        | Description                                                                                  |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [CallComposite](#create-callcomposite) | Component that renders a call experience that has a participant gallery and controls |
| [CallCompositeOptions](#create-callcomposite) | Settings for options like themes and event handling |
| [ThemeOptions](#apply-theme-options) | Customization options for the composite theme |
| [LocalizationOptions](#apply-localization-options) | Language options for the composite |

## UI Library functionality

Get the code to create key communication features for your iOS application.

### Set up authentication

To set up authentication, inside the `startCallComposite` function, initialize a `CommunicationTokenCredential` instance. Replace `<USER_ACCESS_TOKEN>` with your access token.

```swift
let communicationTokenCredential = try! CommunicationTokenCredential(token: "<USER_ACCESS_TOKEN>")
```

If you don't already have an access token, [create an Azure Communication Services access token](../../../identity/quick-create-identity.md).


### Create CallComposite

To create `CallComposite`, inside the `startCallComposite` function, initialize a `CallCompositeOptions` instance with optional `<DISPLAY_NAME>` and a `CommunicationTokenCredential` instance:

```swift
@objc private func startCallComposite() {
    let callCompositeOptions = CallCompositeOptions(displayName: "<DISPLAY_NAME>")
    let communicationTokenCredential = try! CommunicationTokenCredential(token: "<USER_ACCESS_TOKEN>")

    callComposite = CallComposite(credential: communicationTokenCredential, withOptions: callCompositeOptions)
}
```

### Set up a group call

To set up a group call, inside the `startCallComposite` function, initialize a `.groupCall` locator. Replace `<GROUP_CALL_ID>` with the group ID for your call. 

```swift
// let uuid = UUID() to create a new call
let uuid = UUID(uuidString: "<GROUP_CALL_ID>")!
let locator = .groupCall(groupId: uuid)
```

For more information about using a group ID for calls, see [Manage calls](../../../../how-tos/calling-sdk/manage-calls.md).

### Join a Teams meeting

You can join to a Teams meeting using two mechanisms:

- Teams meeting URL or Teams meeting short URL
- Teams Meeting ID and Passcode

The Teams meeting link can be retrieved using Graph APIs, which is detailed in [Graph documentation](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true).

The Communication Services Calling SDK accepts a full Teams meeting link. This link is returned as part of the `onlineMeeting` resource, accessible under the [`joinWebUrl` property](/graph/api/resources/onlinemeeting?view=graph-rest-beta&preserve-view=true)
You can also get the required meeting information from the **Join Meeting** URL in the Teams meeting invite itself.

#### Join via Teams meeting URL

To join a Microsoft Teams meeting, inside the `startCallComposite` function, initialize an instance for the `.teamsMeeting` locator. Replace `<TEAMS_MEETING_LINK>` with the Teams meeting link for your call. Replace `<DISPLAY_NAME>` with your name.

```swift
let locator = .teamsMeeting(teamsLink: "<TEAMS_MEETING_LINK>")
```

#### Join via Teams Meeting ID and Passcode

The `teamMeetingId` locates a meeting using a meeting ID and passcode. These can be found under a Teams meeting's join info.
A Teams meeting ID is 12 characters long and consists of numeric digits grouped in threes (i.e. `000 000 000 000`).
A passcode consists of 6 alphabet characters (i.e. `aBcDeF`). The passcode is case sensitive.

```swift
let locator = .teamsMeetingId(meetingId: "<TEAMS_MEETING_ID>", meetingPasscode:  "<TEAMS_MEETING_PASSCODE>" )
```

### Set up a Room call

To set up an Azure Communication Services Rooms call, initialize a `CallCompositeRoomLocator` with a room ID.
While on the setup screen, `CallComposite` will enable camera and microphone to all participants with any room role. Actual up-to-date participant role and capabilities are retrieved from Azure Communication Services once call is connected.

For more information about Rooms, how to create and manage one see [Rooms QuickStart](../../../rooms/get-started-rooms.md)

```swift
let locator = .roomCall(roomId: "<ROOM_ID>")
```

### Set up a 1:N Outgoing call and incoming call push notifications

UI Library supports one-to-one VoIP call to dial users by communication identifier. To receive incoming call UI Library also supports registering for PUSH notifications. To learn more about the integration for Android and iOS platform and usage of the API, see [How to make one-to-one call and receive PUSH notifications.](../../../../how-tos/ui-library-sdk/one-to-one-calling.md)

### Launch the composite

Inside the `startCallComposite` function, call `launch` on the `CallComposite` instance:

```swift
callComposite?.launch(locator: locator)
```

### Subscribe to events

You can implement closures to act on composite events. The following errorCodes might be sent to the error handler:

- `callJoin`
- `callEnd`
- `cameraFailure`
- `tokenExpired`
- `microphonePermissionNotGranted`
- `networkConnectionNotAvailable`

The following example shows an error event for a failed composite event:

```swift
callComposite?.events.onError = { error in
    print("CallComposite failed with error:\(error)")
}
```

### Apply theme options

To customize the communication experience in your application, create custom theme options that implement the `ThemeOptions` protocol. Include an instance of the new class in `CallCompositeOptions`:

```swift
class CustomThemeOptions: ThemeOptions {
   var primaryColor: UIColor {
       return UIColor.red
   }
}
```

```swift
let callCompositeOptions = CallCompositeOptions(theme: CustomThemeOptions())
```

For more information about how theming works, see the [theming guide](../../../../how-tos/ui-library-sdk/theming.md).

### Apply localization options

To change the language in the composite, create custom localization options and include them in `CallCompositeOptions`.  By default, all text labels use English (`SupportedLocale.en`) strings. You can use `LocalizationOptions` to set a different value for `locale`. By default, UI Library includes a set of `locale` values that you can use with the UI components. `SupportedLocale.values` provides a list of all supported languages.

In the following example, the composite is localized to French (`fr`):

```swift
// Option1: Use IntelliSense to get locales UI Library supports.
let localizationOptions = LocalizationOptions(locale: SupportedLocale.frFR)

// Option2: If UI Library doesn't support the locale you set, the Swift Locale struct defaults to English.
let localizationOptions = LocalizationOptions(locale: Locale(identifier: "fr-FR"))

let callCompositeOptions = CallCompositeOptions(localization: localizationOptions) 
```

For more information about localization and for a list of supported languages, see the [localization guide](../../../../how-tos/ui-library-sdk/localization.md).

### Subscribe to CallComposite call state changed event

You can implement closures to act on composite events. The call states are sent to the call state changed handler.

The following example shows an event for a call state changed.

```swift
callComposite?.events.onCallStateChanged = { callStateEvent in
   print("CallComposite call state changed:\(callStateEvent.requestString)")
}
```

### Dismiss CallComposite and subscribe to dismissed event

To dismiss CallComposite, call `dismiss`. The following dismiss event be sent on call composite dismissed:

```swift
callComposite?.events.onDismissed = { dismissed in
   print("CallComposite dismissed:\(dismissed.errorCode)")
}

callComposite.dismiss()
```

### More features

The list of [use cases](../../../../concepts/ui-library/ui-library-use-cases.md) has detailed information about more features.

## Add notifications to your mobile app

Azure Communication Services integrates with [Azure Event Grid](../../../../../event-grid/overview.md) and [Azure Notification Hubs](../../../../../notification-hubs/notification-hubs-push-notification-overview.md), so you can [add push notifications](../../../../concepts/notifications.md) to your apps in Azure. You can use push notifications to send information from your application to users' mobile devices. A push notification can show a dialog, play a sound, or display an incoming call UI.
