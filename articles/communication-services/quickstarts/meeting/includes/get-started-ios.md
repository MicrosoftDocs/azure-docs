---
title: Quickstart - Add joining a teams meeting to an iOS app using Azure Communication Services
description: In this quickstart, you'll learn how to use the Azure Communication Services Teams Embed library for iOS.
author: palatter
ms.author: palatter
ms.date: 01/25/2021
ms.topic: quickstart
ms.service: azure-communication-services
---

In this quickstart, you'll learn how to join a Teams meeting using the Azure Communication Services Teams Embed library for iOS.

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
    pod 'AzureCommunication', '~> 1.0.0-beta.8'
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
<key>NSBluetoothAlwaysUsageDescription</key>
<string></string>
<key>NSBluetoothPeripheralUsageDescription</key>
<string></string>
<key>NSCameraUsageDescription</key>
<string></string>
<key>NSContactsUsageDescription</key>
<string></string>
<key>NSMicrophoneUsageDescription</key>
<string></string>
```

### Add the Teams Embed framework

1. Download the [`MicrosoftTeamsSDK` iOS package.](https://github.com/Azure/communication-teams-embed/releases)
2. Create a `Frameworks` folder in the the project root. Ex. `\TeamsEmbedGettingStarted\Frameworks\`
3. Copy the downloaded `TeamsAppSDK.framework` and `MeetingUIClient.framework` frameworks to this folder.
4. Add the `TeamsAppSDK.framework` and the `MeetingUIClient.framework` to the project target under the general tab. Use the `Add Other` -> `Add Files...` to navigate to the framework files and add them.

:::image type="content" source="../media/ios/xcode-add-frameworks.png" alt-text="Screenshot showing the added frameworks in Xcode.":::

5. If it isn't already, add `$(PROJECT_DIR)/Frameworks` to `Framework Search Paths` under the project target build settings tab. To find the setting, you have change the filter from `basic` to `all`, you can also use the search bar on the right.

:::image type="content" source="../media/ios/xcode-add-framework-search-path.png" alt-text="Screenshot showing the framework search path in Xcode.":::

### Turn off Bitcode

Set `Enable Bitcode` option to `No` in the project build settings. To find the setting, you have change the filter from `basic` to `all`, you can also use the search bar on the right.

:::image type="content" source="../media/ios/xcode-bitcode-option.png" alt-text="Screenshot showing the BitCode option in Xcode.":::

### Add framework signing script

Select your app target and choose the `Build Phases` tab.  Then click the `+`, followed by `New Run Script Phase`. Ensure this new phase occurs after the `Embed Frameworks` phases.



:::image type="content" source="../media/ios/xcode-build-script.png" alt-text="Screenshot showing adding the build script in Xcode.":::

```bash
#!/bin/sh
if [ -d "${TARGET_BUILD_DIR}"/"${PRODUCT_NAME}".app/Frameworks/TeamsAppSDK.framework/Frameworks ]; then
    pushd "${TARGET_BUILD_DIR}"/"${PRODUCT_NAME}".app/Frameworks/TeamsAppSDK.framework/Frameworks
    for EACH in *.framework; do
        echo "-- signing ${EACH}"
        /usr/bin/codesign --force --deep --sign "${EXPANDED_CODE_SIGN_IDENTITY}" --entitlements "${TARGET_TEMP_DIR}/${PRODUCT_NAME}.app.xcent" --timestamp=none $EACH
        echo "-- moving ${EACH}"
        mv -nv ${EACH} ../../
    done
    rm -rf "${TARGET_BUILD_DIR}"/"${PRODUCT_NAME}".app/Frameworks/TeamsAppSDK.framework/Frameworks
    popd
    echo "BUILD DIR ${TARGET_BUILD_DIR}"
fi
```

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
| MeetingUIClientDelegate | The MeetingUIClientDelegate is used to receive events, such as changes in call state. |
| MeetingJoinOptions | MeetingJoinOptions are used for configurable options such as display name. | 
| CallState | The CallState is used to for reporting call state changes. The options are as follows: connecting, waitingInLobby, connected, and ended. |

## Create and Authenticate the client

Initialize a `MeetingUIClient` instance with a User Access Token which will enable us to join meetings. Add the following code to the `viewDidLoad` callback in **ViewController.swift**:

```swift
do {
    let communicationTokenRefreshOptions = CommunicationTokenRefreshOptions(initialToken: "<USER_ACCESS_TOKEN>", refreshProactively: true, tokenRefresher: fetchTokenAsync(completionHandler:))
    let credential = try CommunicationTokenCredential(with: communicationTokenRefreshOptions)
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
private func fetchTokenAsync(completionHandler: @escaping TokenRefreshOnCompletion) {
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

The `joinMeeting` method is set as the action that will be performed when the *Join Meeting* button is tapped. Update the implementation to join a meeting with the `MeetingUIClient`:

```swift
private func joinMeeting() {
    let meetingJoinOptions = MeetingJoinOptions(displayName: "John Smith")
        
    meetingUIClient?.join(meetingUrl: "<MEETING_URL>", meetingJoinOptions: meetingJoinOptions, completionHandler: { (error: Error?) in
        if (error != nil) {
            print("Join meeting failed: \(error!)")
        }
    })
}
```

Replace `<MEETING URL>` with a teams meeting link.

### Get a Teams meeting link

A Teams meeting link can be retrieved using Graph APIs. This is detailed in [Graph documentation](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true).
The Communication Services Calling SDK accepts a full Teams meeting link. This link is returned as part of the `onlineMeeting` resource, accessible under the [`joinWebUrl` property](/graph/api/resources/onlinemeeting?view=graph-rest-beta&preserve-view=true)
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

## Preparation for App Store upload

Remove i386 and x86_64 architectures from the frameworks in case of archiving.

Add the `i386` and `x86_64` architectures removing script to the Build Phases before the framework codesign phase if you'd like to archive your application.

In the Project Navigator, select your project. In the Editor pane, go to Build Phases → Click on + sign → Create a New Run Script Phase.

```bash
echo "Target architectures: $ARCHS"
APP_PATH="${TARGET_BUILD_DIR}/${WRAPPER_NAME}"
find "$APP_PATH" -name '*.framework' -type d | while read -r FRAMEWORK
do
FRAMEWORK_EXECUTABLE_NAME=$(defaults read "$FRAMEWORK/Info.plist" CFBundleExecutable)
FRAMEWORK_EXECUTABLE_PATH="$FRAMEWORK/$FRAMEWORK_EXECUTABLE_NAME"
echo "Executable is $FRAMEWORK_EXECUTABLE_PATH"
echo $(lipo -info "$FRAMEWORK_EXECUTABLE_PATH")
FRAMEWORK_TMP_PATH="$FRAMEWORK_EXECUTABLE_PATH-tmp"
# remove simulator's archs if location is not simulator's directory
case "${TARGET_BUILD_DIR}" in
*"iphonesimulator")
    echo "No need to remove archs"
    ;;
*)
    if $(lipo "$FRAMEWORK_EXECUTABLE_PATH" -verify_arch "i386") ; then
    lipo -output "$FRAMEWORK_TMP_PATH" -remove "i386" "$FRAMEWORK_EXECUTABLE_PATH"
    echo "i386 architecture removed"
    rm "$FRAMEWORK_EXECUTABLE_PATH"
    mv "$FRAMEWORK_TMP_PATH" "$FRAMEWORK_EXECUTABLE_PATH"
    fi
    if $(lipo "$FRAMEWORK_EXECUTABLE_PATH" -verify_arch "x86_64") ; then
    lipo -output "$FRAMEWORK_TMP_PATH" -remove "x86_64" "$FRAMEWORK_EXECUTABLE_PATH"
    echo "x86_64 architecture removed"
    rm "$FRAMEWORK_EXECUTABLE_PATH"
    mv "$FRAMEWORK_TMP_PATH" "$FRAMEWORK_EXECUTABLE_PATH"
    fi
    ;;
esac
echo "Completed for executable $FRAMEWORK_EXECUTABLE_PATH"
echo $(lipo -info "$FRAMEWORK_EXECUTABLE_PATH")
done
```

## Sample Code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/teams-embed-ios-getting-started)
