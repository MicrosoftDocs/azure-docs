---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2021
ms.author: rifox
---
## Set up your system

### Create the Xcode project

In Xcode, create a new iOS project and select the **Single View App** template. This quickstart uses the [SwiftUI framework](https://developer.apple.com/xcode/swiftui/), so you should set the **Language** to **Swift** and **User Interface** to **SwiftUI**. 

You're not going to create unit tests or UI tests during this quickstart. Feel free to clear the **Include Unit Tests** and **Include UI Tests** text boxes.

:::image type="content" source="../../../../quickstarts/voice-video-calling/media/ios/xcode-new-ios-project.png" alt-text="Screenshot that shows the window for creating a project within Xcode.":::

### Install the package and dependencies with CocoaPods

1. Create a Podfile for your application, like this:

    ```
    platform :ios, '13.0'
    use_frameworks!
    target 'AzureCommunicationCallingSample' do
        pod 'AzureCommunicationCalling', '~> 1.0.0'
    end
    ```
2. Run `pod install`.
3. Open `.xcworkspace` with Xcode.

### Request access to the microphone

To access the device's microphone, you need to update your app's information property list with `NSMicrophoneUsageDescription`. You set the associated value to a `string` that will be included in the dialog that the system uses to request access from the user.

Right-click the `Info.plist` entry of the project tree and select **Open As** > **Source Code**. Add the following lines in the top-level `<dict>` section, and then save the file.

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Need microphone access for VOIP calling.</string>
```

### Set up the app framework

Open your project's *ContentView.swift* file and add an `import` declaration to the top of the file to import the `AzureCommunicationCalling` library. In addition, import `AVFoundation`. You'll need it for audio permission requests in the code.

```swift
import AzureCommunicationCalling
import AVFoundation
```

## Initialize CallAgent

To create a `CallAgent` instance from `CallClient`, you have to use a `callClient.createCallAgent` method that asynchronously returns a `CallAgent` object after it's initialized.

To create a call client, you have to pass a `CommunicationTokenCredential` object.

```swift
import AzureCommunication

let tokenString = "token_string"
var userCredential: CommunicationTokenCredential?
do {
    let options = CommunicationTokenRefreshOptions(initialToken: token, refreshProactively: true, tokenRefresher: self.fetchTokenSync)
    userCredential = try CommunicationTokenCredential(withOptions: options)
} catch {
    updates("Couldn't created Credential object", false)
    initializationDispatchGroup!.leave()
    return
}

// tokenProvider needs to be implemented by Contoso, which fetches a new token
public func fetchTokenSync(then onCompletion: TokenRefreshOnCompletion) {
    let newToken = self.tokenProvider!.fetchNewToken()
    onCompletion(newToken, nil)
}
```

Pass the `CommunicationTokenCredential` object that you created to `CallClient`, and set the display name.

```swift
self.callClient = CallClient()
let callAgentOptions = CallAgentOptions()
options.displayName = " iOS Azure Communication Services User"

self.callClient!.createCallAgent(userCredential: userCredential!,
    options: callAgentOptions) { (callAgent, error) in
        if error == nil {
            print("Create agent succeeded")
            self.callAgent = callAgent
        } else {
            print("Create agent failed")
        }
})
```