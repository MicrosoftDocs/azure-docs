---
author: palatter
ms.service: azure-communication-services
ms.topic: include
ms.date: 24/02/2021
ms.author: palatter
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../access-tokens.md)
- Optional: Complete the quickstart for [getting started with adding meeting composite to your application](../getting-started-with-meeting-composite.md)

## Setting up

### Creating the Xcode project

In Xcode, create a new iOS project and select the **Single View App** template. This quickstart uses the [UIKit framework](https://developer.apple.com/documentation/uikit), so you should set the the **Language** to **Swift** and the **User Interface** to **UIKit**. You're not going to create unit tests or UI tests during this quickstart. Feel free to uncheck **Include Unit Tests** and also uncheck **Include UI Tests**.

:::image type="content" source="../media/ios/xcode-new-project-details.png" alt-text="Screenshot showing the create new New Project window within Xcode.":::

### Install the package and dependencies with CocoaPods

1. Create a Podfile for your application, like this:

    ```
    platform :ios, '12.0'
    use_frameworks!
    
    target 'MeetingCompositeGettingStarted' do
        pod 'AzureCommunication', '~> 1.0.0-beta.8'
    end
    ```

2. Run `pod install`.
3. Open the `.xcworkspace` with XCode.

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

### Add a window reference to AppDelegate

Open your project's **AppDelegate.swift** file and add a reference for 'window'.

```swift
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
```

### Set up the app framework

Open your project's **ViewController.swift** file and add an `import` declaration to the top of the file to import the `AzureCommunication library` and the `MeetingUIClient`. 

```swift
import UIKit
import AzureCommunication
import MeetingUIClient
```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Meeting Composite library:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| MeetingClient | The MeetingClient is the main entry point to the Meeting library. |
| MeetingClientDelegate | The meeting client delegate is used to receive events, such as changes in call state. |
| MeetingJoinOptions | MeetingJoinOptions are used for configurable options such as display name. | 
| CallState | The CallState is used to for reporting call state changes. The options are as follows: connecting, waitingInLobby, connected, and ended. |

## Create and Authenticate the client

Initialize a `MeetingClient` instance with a User Access Token which will enable us to join meetings. Add the following code to the `viewDidLoad` callback in **ViewController.swift**:

```swift
        do {
            let communicationTokenRefreshOptions = CommunicationTokenRefreshOptions(initialToken: "<USER_ACCESS_TOKEN>", refreshProactively: true, tokenRefresher: fetchTokenAsync(completionHandler:))
            let credential = try CommunicationTokenCredential(with: communicationTokenRefreshOptions)
            meetingClient = MeetingUIClient(with: credential)
        }
        catch {
            print("Failed to create communication token credential")
        }
```

## Get the Teams meeting link

The Teams meeting link can be retrieved using Graph APIs. This is detailed in [Graph documentation](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta).
The Communication Services Calling SDK accepts a full Teams meeting link. This link is returned as part of the `onlineMeeting` resource, accessible under the [`joinWebUrl` property](/graph/api/resources/onlinemeeting?view=graph-rest-beta)
You can also get the required meeting information from the **Join Meeting** URL in the Teams meeting invite itself.

## Join a meeting

The `joinMeeting` method is set as the action that will be performed when the *Join Meeting* button is tapped. Update the implementation to join a meeting with the `MeetingClient`:

```swift

let meetingJoinOptions = MeetingJoinOptions(displayName: "John Smith")
    
meetingClient?.join(meetingUrl: meetingURL, meetingJoinOptions: meetingJoinOptions, completionHandler: { (error: Error?) in
    if (error != nil) {
        print("Join meeting failed: \(error!)")
    }
})

```

## Meeting Composite Events

Add the `MeetingUIClientDelegate` to your class.

```swift
class ViewController: UIViewController, MeetingUIClientDelegate {

    private var meetingClient: MeetingUIClient?
```

Set the `meetingUIClientDelegate` to `self`.

```swift
override func viewDidLoad() {
    super.viewDidLoad()
    
    meetingClient?.meetingUIClientDelegate = self
}
```

Implement the `didUpdateCallState` and `didUpdateRemoteParticipantCount` functions.

```swift
    func meetingUIClient(didUpdateCallState callState: CallState) {
        switch callState {
        case .connecting:
            print("Call state has changed to 'Connecting'")
        case .connected:
            print("Call state has changed to 'Connected'")
        case .waitingInLobby:
            print("Call state has changed to 'Waiting in Lobby'")
        case .ended:
            print("Call state has changed to 'Ended'")
        }
    }
    
    func meetingUIClient(didUpdateRemoteParticipantCount remoteParticpantCount: UInt) {
        print("Remote participant count has changed to: \(remoteParticpantCount)")
    }
```

## Assigning avatars for users

Add the `MeetingIdentityProviderDelegate` to your class.

```swift
class ViewController: UIViewController, MeetingIdentityProviderDelegate {

    private var meetingClient: MeetingUIClient?
```

Set the `MeetingIdentityProviderDelegate` to `self` before joining the meeting.

```swift
private func joinMeeting() {
    meetingClient?.meetingIdentityProviderDelegate = self
    let meetingJoinOptions = MeetingJoinOptions(displayName: "John Smith")

    meetingClient?.join(meetingUrl: meetingURL, meetingJoinOptions: meetingJoinOptions, completionHandler: { (error: Error?) in
        if (error != nil) {
            print("Join meeting failed: \(error!)")
        }
    })
}
```

Map each `userMri` with the corresponding avatar.

```swift
func avatarForUserMri(userMri: String, completionHandler completion: @escaping (UIImage?) -> Void) {
        if (userMri .starts(with: "8:teamsvisitor:")) {
            // Anonymous teams user will start with prefix 8:teamsvistor:
            let image = UIImage (named: "avatarPink")
            completion(image!)
        }
        else if (userMri .starts(with: "8:orgid:")) {
            // OrgID user will start with prefix 8:orgid:
            let image = UIImage (named: "avatarDoctor")
            completion(image!)
        }
        else if (userMri .starts(with: "8:acs:")) {
            // ACS user will start with prefix 8:acs:
            let image = UIImage (named: "avatarGreen")
            completion(image!)
        }
        else {
            completion(nil)
        }
}
```