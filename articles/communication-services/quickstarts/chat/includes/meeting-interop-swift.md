---
title: Quickstart - Join a Teams meeting
author: eboltonmaggs
ms.author: eboltonmaggs
ms.date: 05/03/2024
ms.topic: include
ms.service: azure-communication-services
---

In this quickstart, you'll learn how to chat in a Teams meeting using the Azure Communication Services Chat SDK for iOS.

## Sample Code

If you'd like to skip ahead to the end, you can download this quickstart as a sample on [GitHub](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/join-chat-to-teams-meeting).

## Prerequisites 

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- A Mac running [Xcode](https://developer.apple.com/xcode/), along with a valid developer certificate installed into your Keychain.
- A [Teams deployment](/deployoffice/teams-install). 
- A [User Access Token](../../identity/access-tokens.md) for your Azure Communication Service. You can also use the Azure CLI and run the command with your connection string to create a user and an access token.

```azurecli-interactive
az communication identity token issue --scope voip --connection-string "yourConnectionString"
```
For details, see [Use Azure CLI to Create and Manage Access Tokens](../../identity/access-tokens.md?pivots=platform-azcli).


## Setting up

### Creating the Xcode project

In Xcode, create a new iOS project and select the Single View App template. This tutorial uses the [SwiftUI framework](https://developer.apple.com/xcode/swiftui/), so you should set the Language to Swift and the User Interface to SwiftUI. You're not going to create tests during this quick start. Feel free to uncheck Include Tests.

:::image type="content" source="../media/ios/xcode-new-ios-project.png" alt-text="Screenshot showing the New Project window within Xcode.":::


### Installing CocoaPods

Use this guide to [install CocoaPods](https://guides.cocoapods.org/using/getting-started.html) on your Mac.

### Install the package and dependencies with CocoaPods

1. To create a `Podfile` for your application, open the terminal and navigate to the project folder and run pod init.

1. Add the following code to the `Podfile` under the target, and save.

```ruby
target 'Chat Teams Interop' do
  # Comment the next line if you don't want to use dynamic frameworks
  use_frameworks!

  # Pods for Chat Teams Interop
  pod 'AzureCommunicationCalling'
  pod 'AzureCommunicationChat'
  
end
```
1. Run `pod install`.

1. Open the `.xcworkspace` file with Xcode.

### Request access to the microphone

In order to access the device's microphone, you need to update your app's Information Property List with an `NSMicrophoneUsageDescription`. You set the associated value to a `string` that was included in the dialog the system uses to request access from the user.

Under the target, select the `Info` tab and add a string for ‘Privacy -  Microphone Usage Description’

:::image type="content" source="../media/ios/xcode-add-microphone-permission.png" alt-text="Screenshot showing adding microphone usage within Xcode.":::

### Disable User Script Sandboxing

Some of the scripts within the linked libraries write files during the build process. To allow this, disable the User Script Sandboxing in Xcode.
Under the build settings, search for `sandbox` and set `User Script Sandboxing` to `No`.

:::image type="content" source="../media/ios/disable-user-script-sandbox.png" alt-text="Screenshot showing disabling user script sandboxing within Xcode.":::

## Joining the meeting chat 

A Communication Services user can join a Teams meeting as an anonymous user using the Calling SDK. Once a user has joined the Teams meeting, they can send and receive messages with other meeting attendees. The user won't have access to chat messages sent prior to joining, nor will they be able to send or receive messages when they aren't in the meeting. 
To join the meeting and start chatting, you can follow the next steps.

## Set up the app framework

Import the Azure Communication packages in `ContentView.swift` by adding the following snippet:

``` swift
import AVFoundation
import SwiftUI

import AzureCommunicationCalling
import AzureCommunicationChat
```


In `ContentView.swift` add the following snippet, just above the `struct ContentView: View` declaration:

```swift 
let endpoint = "<ADD_YOUR_ENDPOINT_URL_HERE>"
let token = "<ADD_YOUR_USER_TOKEN_HERE>"
let displayName: String = "Quickstart User"
```

Replace `<ADD_YOUR_ENDPOINT_URL_HERE>` with the endpoint for your Communication Services resource.
Replace `<ADD_YOUR_USER_TOKEN_HERE>` with the token generated above, via the Azure client command line.
Read more about user access tokens: [User Access Token](../../identity/access-tokens.md)

Replace `Quickstart User` with the display name you'd like to use in the Chat.

To hold the state, add the following variables to the `ContentView` struct:

```swift
  @State var message: String = ""
  @State var meetingLink: String = ""
  @State var chatThreadId: String = ""

  // Calling state
  @State var callClient: CallClient?
  @State var callObserver: CallDelegate?
  @State var callAgent: CallAgent?
  @State var call: Call?

  // Chat state
  @State var chatClient: ChatClient?
  @State var chatThreadClient: ChatThreadClient?
  @State var chatMessage: String = ""
  @State var meetingMessages: [MeetingMessage] = []

```

Now let's add the main body var to hold the UI elements. We attach business logic to these controls in this quickstart. Add the following code to the `ContentView` struct:

```swift
var body: some View {
    NavigationView {
      Form {
        Section {
          TextField("Teams Meeting URL", text: $meetingLink)
            .onChange(of: self.meetingLink, perform: { value in
              if let threadIdFromMeetingLink = getThreadId(from: value) {
                self.chatThreadId = threadIdFromMeetingLink
              }
            })
          TextField("Chat thread ID", text: $chatThreadId)
        }
        Section {
          HStack {
            Button(action: joinMeeting) {
              Text("Join Meeting")
            }.disabled(
              chatThreadId.isEmpty || callAgent == nil || call != nil
            )
            Spacer()
            Button(action: leaveMeeting) {
              Text("Leave Meeting")
            }.disabled(call == nil)
          }
          Text(message)
        }
        Section {
          ForEach(meetingMessages, id: \.id) { message in
            let currentUser: Bool = (message.displayName == displayName)
            let foregroundColor = currentUser ? Color.white : Color.black
            let background = currentUser ? Color.blue : Color(.systemGray6)
            let alignment = currentUser ? HorizontalAlignment.trailing : .leading
            
            HStack {
              if currentUser {
                Spacer()
              }
              VStack(alignment: alignment) {
                Text(message.displayName).font(Font.system(size: 10))
                Text(message.content)
                  .frame(maxWidth: 200)
              }

              .padding(8)
              .foregroundColor(foregroundColor)
              .background(background)
              .cornerRadius(8)

              if !currentUser {
                Spacer()
              }
            }
          }
          .frame(maxWidth: .infinity)
        }

        TextField("Enter your message...", text: $chatMessage)
        Button(action: sendMessage) {
          Text("Send Message")
        }.disabled(chatThreadClient == nil)
      }

      .navigationBarTitle("Teams Chat Interop")
    }

    .onAppear {
      // Handle initialization of the call and chat clients
    }
  }
```

### Initialize the ChatClient

Instantiate the `ChatClient` and enable message notifications. We're using real-time notifications for receiving chat messages. 

With the main body set up, let's add the functions to handle the setup of the call and chat clients.

In the `onAppear` function, add the following code to initialize the `CallClient` and `ChatClient`:

```swift
  if let threadIdFromMeetingLink = getThreadId(from: self.meetingLink) {
    self.chatThreadId = threadIdFromMeetingLink
  }
  // Authenticate
  do {
    let credentials = try CommunicationTokenCredential(token: token)
    self.callClient = CallClient()
    self.callClient?.createCallAgent(
      userCredential: credentials
    ) { agent, error in
      if let e = error {
        self.message = "ERROR: It was not possible to create a call agent."
        print(e)
        return
      } else {
        self.callAgent = agent
      }
    }
  
    // Start the chat client
    self.chatClient = try ChatClient(
      endpoint: endpoint,
      credential: credentials,
      withOptions: AzureCommunicationChatClientOptions()
    )
    // Register for real-time notifications
    self.chatClient?.startRealTimeNotifications { result in
      switch result {
      case .success:
        self.chatClient?.register(
          event: .chatMessageReceived,
          handler: receiveMessage
      )
      case let .failure(error):
        self.message = "Could not register for message notifications: " + error.localizedDescription
        print(error)
      }
    }
  } catch {
    print(error)
    self.message = error.localizedDescription
  }
```

### Add meeting join function

Add the following function to the `ContentView` struct to handle joining the meeting.

```swift
  func joinMeeting() {
    // Ask permissions
    AVAudioSession.sharedInstance().requestRecordPermission { (granted) in
      if granted {
        let teamsMeetingLink = TeamsMeetingLinkLocator(
          meetingLink: self.meetingLink
        )
        self.callAgent?.join(
          with: teamsMeetingLink,
          joinCallOptions: JoinCallOptions()
        ) {(call, error) in
          if let e = error {
            self.message = "Failed to join call: " + e.localizedDescription
            print(e.localizedDescription)
            return
          }

          self.call = call
          self.callObserver = CallObserver(self)
          self.call?.delegate = self.callObserver
          self.message = "Teams meeting joined successfully"
        }
      } else {
        self.message = "Not authorized to use mic"
      }
    }
  }

```


### Initialize the ChatThreadClient

We will initialize the `ChatThreadClient` after the user has joined the meeting. This requires us to check the meeting status from the delegate and then initialize the `ChatThreadClient` with the `threadId` when joined to the meeting.

Create the `connectChat()` function with the following code:

```swift
  func connectChat() {
    do {
      self.chatThreadClient = try chatClient?.createClient(
        forThread: self.chatThreadId
      )
      self.message = "Joined meeting chat successfully"
    } catch {
      self.message = "Failed to join the chat thread: " + error.localizedDescription
    }
  }
```

Add the following helper function to the `ContentView`, used to parse the Chat thread ID from the Team's meeting link, if possible. In the case that this extraction fails, the user will need to manually enter the Chat thread ID using Graph APIs to retrieve the thread ID.



```swift
 func getThreadId(from teamsMeetingLink: String) -> String? {
  if let range = teamsMeetingLink.range(of: "meetup-join/") {
    let thread = teamsMeetingLink[range.upperBound...]
    if let endRange = thread.range(of: "/")?.lowerBound {
      return String(thread.prefix(upTo: endRange))
    }
  }
  return nil
}
```

### Enable sending messages

Add the `sendMessage()` function to `ContentView`. This function uses the `ChatThreadClient` to send messages from the user.

```swift
func sendMessage() {
  let message = SendChatMessageRequest(
    content: self.chatMessage,
    senderDisplayName: displayName,
    type: .text
  )

  self.chatThreadClient?.send(message: message) { result, _ in
    switch result {
    case .success:
    print("Chat message sent")
    self.chatMessage = ""

    case let .failure(error):
    self.message = "Failed to send message: " + error.localizedDescription + "\n Has your token expired?"
    }
  }
}
```

### Enable receiving messages

To receive messages, we implement the handler for `ChatMessageReceived` events. When new messages are sent to the thread, this handler adds the messages to the `meetingMessages` variable so they can be displayed in the UI.

First add the following struct to `ContentView.swift`. The UI uses the data in the struct to display our Chat messages.

```swift
struct MeetingMessage: Identifiable {
  let id: String
  let date: Date
  let content: String
  let displayName: String

  static func fromTrouter(event: ChatMessageReceivedEvent) -> MeetingMessage {
    let displayName: String = event.senderDisplayName ?? "Unknown User"
    let content: String = event.message.replacingOccurrences(
      of: "<[^>]+>", with: "",
      options: String.CompareOptions.regularExpression
    )
    return MeetingMessage(
      id: event.id,
      date: event.createdOn?.value ?? Date(),
      content: content,
      displayName: displayName
    )
  }
}
```

Next add the `receiveMessage()` function to `ContentView`. This called when a messaging event occurs. Note that you need to register for all events that you want to handle in the `switch` statement via the `chatClient?.register()` method.

```swift
  func receiveMessage(event: TrouterEvent) -> Void {
    switch event {
    case let .chatMessageReceivedEvent(messageEvent):
      let message = MeetingMessage.fromTrouter(event: messageEvent)
      self.meetingMessages.append(message)

      /// OTHER EVENTS
      //    case .realTimeNotificationConnected:
      //    case .realTimeNotificationDisconnected:
      //    case .typingIndicatorReceived(_):
      //    case .readReceiptReceived(_):
      //    case .chatMessageEdited(_):
      //    case .chatMessageDeleted(_):
      //    case .chatThreadCreated(_):
      //    case .chatThreadPropertiesUpdated(_):
      //    case .chatThreadDeleted(_):
      //    case .participantsAdded(_):
      //    case .participantsRemoved(_):

    default:
      break
    }
  }
```

Finally, we need to implement the delegate handler for the call client. This handler is used to check the call status and initialize the chat client when the user joins the meeting.

```swift
class CallObserver : NSObject, CallDelegate {
  private var owner: ContentView

  init(_ view: ContentView) {
    owner = view
  }

  func call(
    _ call: Call,
    didChangeState args: PropertyChangedEventArgs
  ) {
    owner.message = CallObserver.callStateToString(state: call.state)
    if call.state == .disconnected {
      owner.call = nil
      owner.message = "Left Meeting"
    } else if call.state == .inLobby {
      owner.message = "Waiting in lobby (go let them in!)"
    } else if call.state == .connected {
      owner.message = "Connected"
      owner.connectChat()
    }
  }

  private static func callStateToString(state: CallState) -> String {
    switch state {
    case .connected: return "Connected"
    case .connecting: return "Connecting"
    case .disconnected: return "Disconnected"
    case .disconnecting: return "Disconnecting"
    case .earlyMedia: return "EarlyMedia"
    case .none: return "None"
    case .ringing: return "Ringing"
    case .inLobby: return "InLobby"
    default: return "Unknown"
    }
  }
}
```

### Leave the chat

When the user leaves the Team's meeting, we clear the Chat messages from the UI and hang up the call. The full code is shown below.

```swift
  func leaveMeeting() {
    if let call = self.call {
      self.chatClient?.unregister(event: .chatMessageReceived)
      self.chatClient?.stopRealTimeNotifications()

      call.hangUp(options: nil) { (error) in
        if let e = error {
          self.message = "Leaving Teams meeting failed: " + e.localizedDescription
        } else {
          self.message = "Leaving Teams meeting was successful"
        }
      }
      self.meetingMessages.removeAll()
    } else {
      self.message = "No active call to hangup"
    }
  }
```

## Get a Teams meeting chat thread for a Communication Services user

The Teams meeting details can be retrieved using Graph APIs, detailed in [Graph documentation](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true). The Communication Services Calling SDK accepts a full Teams meeting link or a meeting ID. They're returned as part of the `onlineMeeting` resource, accessible under the [`joinWebUrl` property](/graph/api/resources/onlinemeeting?view=graph-rest-beta&preserve-view=true)

With the [Graph APIs](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true), you can also obtain the `threadID`. The response has a `chatInfo` object that contains the `threadID`.

## Run the code

Run the application. 

To join the Teams meeting, enter your Team's meeting link in the UI.

After you join the Team's meeting, you need to admit the user to the meeting in your Team's client. Once the user is admitted and has joined the chat, you're able to send and receive messages.

:::image type="content" source="../join-teams-meeting-chat-quickstart-ios.png" alt-text="Screenshot of the completed iOS Application.":::

> [!NOTE] 
> Certain features are currently not supported for interoperability scenarios with Teams. Learn more about the supported features, please see [Teams meeting capabilities for Teams external users](../../../concepts/interop/guest/capabilities.md)

