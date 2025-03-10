---
author: jiyoonlee
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/26/2024
ms.author: jiyoonlee
---

In this quickstart you are going to learn how to start a call from Azure Communication Services user to Teams Call Queue. You are going to achieve it with the following steps:

1. Enable federation of Azure Communication Services resource with Teams Tenant.
2. Select or create Teams Call Queue via Teams Admin Center.
3. Get email address of Call Queue via Teams Admin Center.
4. Get Object ID of the Call Queue via Graph API.
5. Start a call with Azure Communication Services Calling SDK.

If you'd like to skip ahead to the end, you can download this quickstart as a sample on [GitHub](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/add-video-calling).

[!INCLUDE [Enable interoperability in your Teams tenant](../../../../concepts/includes/enable-interoperability-for-teams-tenant.md)]

## Create or select Teams Call Queue

Teams Call Queue is a feature in Microsoft Teams that efficiently distributes incoming calls among a group of designated users or agents. It's useful for customer support or call center scenarios. Calls are placed in a queue and assigned to the next available agent based on a predetermined routing method. Agents receive notifications and can handle calls using Teams' call controls. The feature offers reporting and analytics for performance tracking. It simplifies call handling, ensures a consistent customer experience, and optimizes agent productivity. You can select existing or create new Call Queue via [Teams Admin Center](https://aka.ms/teamsadmincenter).

Learn more about how to create Call Queue using Teams Admin Center [here](/microsoftteams/create-a-phone-system-call-queue?tabs=general-info).

## Find Object ID for Call Queue

After Call queue is created, we need to find correlated Object ID to use it later for calls. Object ID is connected to Resource Account that was attached to Call Queue - open [Resource Accounts tab](https://admin.teams.microsoft.com/company-wide-settings/resource-accounts) in Teams Admin and find email.
:::image type="content" source="../../../media/teams-call-queue-resource-account.PNG" alt-text="Screenshot of Resource Accounts in Teams Admin Portal.":::
All required information for Resource Account can be found in [Microsoft Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer) using this email in the search.

```console
https://graph.microsoft.com/v1.0/users/lab-test2-cq-@contoso.com
```

In results we'll are able to find "ID" field

```json
    "userPrincipalName": "lab-test2-cq@contoso.com",
    "id": "31a011c2-2672-4dd0-b6f9-9334ef4999db"
```

To use in the calling App, we need to add a prefix to this ID. Currently, the following are supported:
- Public cloud Call Queue: `28:orgid:<id>`
- Government cloud Call Queue: `28:gcch:<id>`

## Prerequisites

- Obtain an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Mac running [Xcode](https://go.microsoft.com/fwLink/p/?LinkID=266532), along with a valid developer certificate installed into your Keychain.
- A deployed Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md). You need to **record your connection string** for this quickstart.
- A [User Access Token](../../../identity/access-tokens.md) for your Azure Communication Service. You can also use the Azure CLI and run the command with your connection string to create a user and an access token.

  ```azurecli-interactive
  az communication identity token issue --scope voip --connection-string "yourConnectionString"
  ```

  For details, see [Use Azure CLI to Create and Manage Access Tokens](../../../identity/access-tokens.md?pivots=platform-azcli).
- Minimum support for Teams calling applications: 2.15.0

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
     pod 'AzureCommunicationCalling', '~> 2.15.0'
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
            let callees:[CommunicationIdentifier] = [MicrosoftTeamsAppIdentifier(self.callee)]
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

> [!NOTE]
> The first time you make a call, the system will prompt you for access to the microphone. In a production application, you should use the `AVAudioSession` API to [check the permission status](https://developer.apple.com/documentation/uikit/protecting_the_user_s_privacy/requesting_access_to_protected_resources) and gracefully update your application's behavior when permission is not granted.



Manual steps to set up the call:

1. Launch the app using Xcode
2. Enter the Call Queue Object ID (with prefix), and select the "Start Call" button. Application will start the outgoing call to the Call Queue with given object ID.
3. Call is connected to the Call Queue.
4. Communication Services user is routed through Call Queue based on its configuration.
