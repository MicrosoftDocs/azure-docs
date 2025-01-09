---
author: pavelprystinka
ms.author: pprystinka
ms.date: 10/28/2024
ms.topic: include
ms.service: azure-communication-services
---

## Prerequisites

- An Azure account and an active Azure subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Mac running [Xcode](https://go.microsoft.com/fwLink/p/?LinkID=266532) 13 or later, and a valid developer certificate installed in your keychain. [CocoaPods](https://cocoapods.org/) must also be installed to fetch dependencies.
- A deployed [Azure Communication Services resource](../../../create-communication-resource.md).
- An Azure Communication Services [access token](../../../identity/quick-create-identity.md).

## Get a complete sample

You can get a [complete sample project](https://github.com/Azure-Samples/communication-services-calling-ui-with-chat-ios) from GitHub.

:::image type="content" source="../../media/call-chat-ios-experience.gif" alt-text="Animation to showcase the experience on iOS using call and chat in the same app.":::

## Set up the project

Complete the following sections to set up the quickstart project.

### Create a new Xcode project

In Xcode, create a new project:

1. On the **File** menu, select **New** > **Project**.

1. In **Choose a template for your new project**, select the **iOS** platform and select the **App** application template. The quickstart uses the UIKit storyboards. The quickstart doesn't create tests, so you can clear the **Include Tests** checkbox.

   :::image type="content" source="../../media/xcode-new-project-template-select.png" alt-text="Screenshot that shows the Xcode new project dialog, with iOS and the App template selected.":::

1. In **Choose options for your new project**, for the product name, enter **UILibraryQuickStart**. For the interface, select **Storyboard**.

   :::image type="content" source="../../media/xcode-new-project-details.png" alt-text="Screenshot that shows setting new project options in Xcode.":::

### Install the package and dependencies

1. (Optional) For MacBook with M1, install and enable [Rosetta](https://support.apple.com/HT211861) in Xcode.

1. In your project root directory, run `pod init` to create a Podfile. If you encounter an error, update [CocoaPods](https://guides.cocoapods.org/using/getting-started.html) to the current version.

1. Add the following code to your Podfile. Replace `UILibraryQuickStart` with your project name.

    ```ruby
    platform :ios, '15.0'
    
    target 'UILibraryQuickStart' do
        use_frameworks!
          pod 'AzureCommunicationUICalling', '1.12.0-beta.1'
          pod 'AzureCommunicationUIChat', '1.0.0-beta.4'
    end
    ```

1. Run `pod install --repo-update`.

1. In Xcode, open the *generated.xcworkspace* file.

### Request access to device hardware

To access the device's hardware, including the microphone and camera, update your app's information property list. Set the associated value to a string that's included in the dialog that the system uses to request access from the user.

1. Right-click the `Info.plist` entry of the project tree and select **Open As** > **Source Code**. Add the following lines to the top-level `<dict>` section, and then save the file.

   ```xml
   <key>NSCameraUsageDescription</key>
   <string></string>
   <key>NSMicrophoneUsageDescription</key>
   <string></string>
   ```

   Here's an example of the `Info.plist` source code in an Xcode file:

   :::image type="content" source="../../media/xcode-info-plist-source-code.png" alt-text="Screenshot that shows example source code for the information property list in an Xcode file.":::

1. To verify that device permission requests are added correctly, select **Open As** > **Property List**. Check that the information property list looks similar to the following example:

   :::image type="content" source="../../media/xcode-info-plist.png" alt-text="Screenshot that shows the camera and microphone device privacy in Xcode.":::

### Turn off Bitcode

In the Xcode project, under **Build Settings**, set the **Enable Bitcode** option to **No**. To find the setting, change the filter from **Basic** to **All** or use the search bar.

:::image type="content" source="../../media/xcode-bitcode-option.png" alt-text="Screenshot that shows the Build Settings option to turn off Bitcode.":::

### Download a Chat icon

1. Download an icon from the [GitHub repository](https://github.com/microsoft/fluentui-system-icons/blob/master/assets/Chat/SVG/ic_fluent_chat_24_regular.svg).
1. Open the downloaded file and change `fill` to `fill="#FFFFFF"`.
1. In Xcode, go to **Assets**. Create a new image set and name it **ic_fluent_chat_24_regular**. Select the downloaded file as the universal icon.

## Initialize the composite

To initialize the composite, go to `ViewController` and update connection settings:

- Replace `TEAM_MEETING_LINK` with the Teams meeting link.
- Replace `ACS_ENDPOINT` with your Azure Communication Services resource's endpoint.
- Replace `DISPLAY_NAME` with your name.
- Replace `USER_ID` with your Azure Communication Services user ID.
- Replace `USER_ACCESS_TOKEN` with your token.

### Get a Teams meeting chat thread for an Azure Communication Services user

You can retrieve Teams meeting details by using Graph APIs, as described in the [Graph documentation](/graph/api/onlinemeeting-createorget). The Azure Communication Services Calling SDK accepts a full Teams meeting link or a meeting ID. They're returned as part of the `onlineMeeting` resource, which is accessible under the [joinWebUrl](/graph/api/resources/onlineMeeting) property.

With the Graph APIs, you can also obtain the `threadID` value. The response has a `chatInfo` object that contains the `threadID` value.

```swift
import UIKit
import AzureCommunicationCalling
import AzureCommunicationUICalling
import AzureCommunicationUIChat
    
class ViewController: UIViewController {
    private let displayName = "USER_NAME"
    private let endpoint = "ACS_ENDPOINT"
    private let teamsMeetingLink = "TEAM_MEETING_LINK"
    private let chatThreadId = "CHAT_THREAD_ID"
    private let communicationUserId = "USER_ID"
    private let userToken = "USER_ACCESS_TOKEN"
    
    
    private var callComposite: CallComposite?
    private var chatAdapter: ChatAdapter?
    private var chatCompositeViewController: ChatCompositeViewController?
    
    private var startCallButton: UIButton?
    private var chatContainerView: UIView?

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBackground
        initControlBar()
    }

    @objc private func startCallComposite() {
        let callCompositeOptions = CallCompositeOptions(
            enableMultitasking: true,
            enableSystemPictureInPictureWhenMultitasking: true,
            displayName: displayName)
        
        let communicationTokenCredential = try! CommunicationTokenCredential(token: userToken)

        let callComposite = self.callComposite ?? CallComposite(credential: communicationTokenCredential, withOptions: callCompositeOptions)
        self.callComposite = callComposite
        
        callComposite.events.onCallStateChanged = { [weak self] callState in
            if callState.requestString == CallState.connected.requestString {
                self?.connectChat()
            }
        }
        
        let chatCustomButton = CustomButtonViewData(
            id: UUID().uuidString,
            image: UIImage(named: "ic_fluent_chat_24_regular")!,
            title: "Chat") { [weak self] _ in
                self?.callComposite?.isHidden = true
                self?.showChat()
            }
        let callScreenHeaderViewData = CallScreenHeaderViewData(customButtons: [chatCustomButton])
        let localOptions = LocalOptions(callScreenOptions: CallScreenOptions(headerViewData: callScreenHeaderViewData))
        callComposite.launch(locator: .teamsMeeting(teamsLink: teamsMeetingLink), localOptions: localOptions)
    }
    
    @objc private func connectChat() {
        let communicationIdentifier = CommunicationUserIdentifier(communicationUserId)
        guard let communicationTokenCredential = try? CommunicationTokenCredential(
            token: userToken) else {
            return
        }

        self.chatAdapter = ChatAdapter(
            endpoint: endpoint,
            identifier: communicationIdentifier,
            credential: communicationTokenCredential,
            threadId: chatThreadId,
            displayName: displayName)

        Task { @MainActor in
            guard let chatAdapter = self.chatAdapter else {
                return
            }
            try await chatAdapter.connect()
        }
    }
        
    @objc private func showChat() {
        guard let chatAdapter = self.chatAdapter,
              let chatContainerView = self.chatContainerView,
              self.chatCompositeViewController == nil else {
            return
        }
    
        let chatCompositeViewController = ChatCompositeViewController(with: chatAdapter)
        
        self.addChild(chatCompositeViewController)
        chatContainerView.addSubview(chatCompositeViewController.view)
        
        chatCompositeViewController.view.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            chatCompositeViewController.view.topAnchor.constraint(equalTo: chatContainerView.topAnchor),
            chatCompositeViewController.view.bottomAnchor.constraint(equalTo: chatContainerView.bottomAnchor),
            chatCompositeViewController.view.leadingAnchor.constraint(equalTo: chatContainerView.leadingAnchor),
            chatCompositeViewController.view.trailingAnchor.constraint(equalTo: chatContainerView.trailingAnchor)
        ])
        
        chatCompositeViewController.didMove(toParent: self)
        self.chatCompositeViewController = chatCompositeViewController
    }
        
    private func initControlBar() {
        let startCallButton = UIButton()
        self.startCallButton = startCallButton
        startCallButton.layer.cornerRadius = 10
        startCallButton.contentEdgeInsets = UIEdgeInsets(top: 6, left: 16, bottom: 6, right: 16)
        startCallButton.backgroundColor = .systemBlue
        startCallButton.setTitle("Call", for: .normal)
        startCallButton.addTarget(self, action: #selector(startCallComposite), for: .touchUpInside)
        startCallButton.translatesAutoresizingMaskIntoConstraints = false
                        
        let margin: CGFloat = 32.0
        
        let buttonsContainerView = UIView()
        buttonsContainerView.backgroundColor = .clear
        
        let buttonsStackView = UIStackView(arrangedSubviews: [startCallButton])
        buttonsStackView.axis = .horizontal
        buttonsStackView.alignment = .center
        buttonsStackView.distribution = .equalSpacing
        buttonsStackView.spacing = 10
        buttonsStackView.translatesAutoresizingMaskIntoConstraints = false
        buttonsStackView.heightAnchor.constraint(equalToConstant: 50).isActive = true
        
        buttonsContainerView.addSubview(buttonsStackView)

        buttonsContainerView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            buttonsStackView.topAnchor.constraint(equalTo: buttonsContainerView.topAnchor, constant: 8),
            buttonsStackView.bottomAnchor.constraint(equalTo: buttonsContainerView.bottomAnchor, constant: -8),
            buttonsStackView.leadingAnchor.constraint(equalTo: buttonsContainerView.leadingAnchor, constant: 16),
        ])
        
        let chatContainerView = UIView()
        self.chatContainerView = chatContainerView
        
        let verticalStackView = UIStackView(arrangedSubviews: [
            buttonsContainerView,
            chatContainerView
            ])
        verticalStackView.axis = .vertical
        verticalStackView.alignment = .fill
        verticalStackView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(verticalStackView)
        
        let margins = view.safeAreaLayoutGuide
        let constraints = [
            verticalStackView.leadingAnchor.constraint(equalTo: margins.leadingAnchor),
            verticalStackView.trailingAnchor.constraint(equalTo: margins.trailingAnchor),
            verticalStackView.topAnchor.constraint(equalTo: margins.topAnchor, constant: margin),
            verticalStackView.bottomAnchor.constraint(equalTo: margins.bottomAnchor, constant: -margin)
        ]
        NSLayoutConstraint.activate(constraints)
    }
}
```
