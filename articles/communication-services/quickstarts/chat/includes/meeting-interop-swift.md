---
title: Quickstart - Join a Teams meeting
author: askaur
ms.author: askaur
ms.date: 06/30/2021
ms.topic: include
ms.service: azure-communication-services
---

In this quickstart, you'll learn how to chat in a Teams meeting using the Azure Communication Services Chat SDK for iOS.

## Prerequisites 

- A [Teams deployment](/deployoffice/teams-install). 
- A working [calling app](../../voice-video-calling/get-started-teams-interop.md). 

## Joining the meeting chat 

A Communication Services user can join a Teams meeting as an anonymous user using the Calling SDK. Joining the meeting adds them as a participant to the meeting chat as well, where they can send and receive messages with other users in the meeting. The user will not have access to chat messages that were sent before they joined the meeting and they will not be able to send or receive messages after the meeting ends. To join the meeting and start chatting, you can follow the next steps.

## Add Chat to the Teams calling app

Delete the `Podfile.lock` and replace the contents of the Podfile with the following:

```
platform :ios, '13.0'
use_frameworks!

target 'AzureCommunicationCallingSample' do
  pod 'AzureCommunicationCalling', '~> 1.0.0-beta.12'
  pod 'AzureCommunicationChat', '~> 1.0.0-beta.11'
end
```

## Install the chat packages

Run `pod install` to install the AzureCommunicationChat package.
After installing, open the  `.xcworkspace` file.

## Set up the app framework

Import the AzureCommunicationChat package in `ContentView.swift` by adding the following snippet:

```
import AzureCommunicationChat
```

## Add the Teams UI controls

In `ContentView.swift` add the following snippet below the existing state variables. 

```
    // Chat
    @State var chatClient: ChatClient?
    @State var chatThreadClient: ChatThreadClient?
    @State var chatMessage: String = ""
    @State var meetingMessages: [MeetingMessage] = []

    let displayName: String = "<YOUR_DISPLAY_NAME_HERE>"
```

Replace `<YOUR_DISPLAY_NAME_HERE>` with the display name you'd like to use in the Chat.

Next we modify the form `Section` to display our chat messages and add UI controls for chatting.

Add the following snippet to the existing form. Right after the Text view `Text(recordingStatus)`, for recording status.

```
VStack(alignment: .leading) {
    ForEach(meetingMessages, id: \.id) { message in
        let currentUser: Bool = (message.displayName == self.displayName)
        let foregroundColor = currentUser ? Color.white : Color.black
        let background = currentUser ? Color.blue : Color(.systemGray6)
        let alignment = currentUser ? HorizontalAlignment.trailing : HorizontalAlignment.leading
        VStack {
            Text(message.displayName).font(Font.system(size: 10))
            Text(message.content)
        }
        .alignmentGuide(.leading) { d in d[alignment] }
        .padding(10)
        .foregroundColor(foregroundColor)
        .background(background)
        .cornerRadius(10)
    }
}.frame(minWidth: 0, maxWidth: .infinity)
TextField("Enter your message...", text: $chatMessage)
Button(action: sendMessage) {
    Text("Send Message")
}.disabled(chatThreadClient == nil)
```

Next change the title to `Chat Teams Quickstart`. Modify the following line with this title.

```
.navigationBarTitle("Chat Teams Quickstart")
```

## Enable the Teams UI controls

### Initialize the ChatClient

Instantiate the `ChatClient` and enable real-time notifications. We are using real-time notifications for receiving chat messages.

Inside the `NavigationView` `.onAppear`, add the snippet below, after the existing code that initializes the `CallAgent`.

```
// Initialize the ChatClient
do {
    let endpoint = "COMMUNICATION_SERVICES_RESOURCE_ENDPOINT_HERE>"
    let credential = try CommunicationTokenCredential(token: "<USER_ACCESS_TOKEN_HERE>")

    self.chatClient = try ChatClient(
        endpoint: endpoint,
        credential: credential,
        withOptions: AzureCommunicationChatClientOptions()
    )

    self.message = "ChatClient successfully created"

    // Start real-time notifications
    self.chatClient?.startRealTimeNotifications() { result in
        switch result {
        case .success:
            print("Real-time notifications started")
            // Receive chat messages
            self.chatClient?.register(event: ChatEventId.chatMessageReceived, handler: receiveMessage)
        case .failure:
            print("Failed to start real-time notifications")
            self.message = "Failed to enable chat notifications"
        }
    }
} catch {
    print("Unable to create ChatClient")
    self.message = "Please enter a valid endpoint and Chat token in source code"
    return
}
```

Replace `<COMMUNICATION_SERVICES_RESOURCE_ENDPOINT_HERE>` with the endpoint for your Communication Services resource.
Replace `<USER_ACCESS_TOKEN_HERE>` with an access token that has Chat scope. 

Read more about user access tokens: [User Access Token](../../identity/access-tokens.md)

### Initialize the ChatThreadClient

Inside the existing `joinTeamsMeeting()` function, we will initialize the `ChatThreadClient` after the user has joined the meeting.

Inside the completion handler for the call to `self.callAgent?.join()`, add the code below the comment `// Initialize the ChatThreadClient`. The full code is shown below.

```
self.callAgent?.join(with: teamsMeetingLinkLocator, joinCallOptions: joinCallOptions) { (call, error) in
    if (error == nil) {
        self.call = call
        self.callObserver = CallObserver(self)
        self.call!.delegate = self.callObserver
        self.message = "Teams meeting joined successfully"

        // Initialize the ChatThreadClient
        do {
            guard let threadId = getThreadId(from: self.meetingLink) else {
                self.message = "Failed to join meeting chat"
                return
            }
            self.chatThreadClient = try chatClient?.createClient(forThread: threadId)
            self.message = "Joined meeting chat successfully"
        } catch {
            print("Failed to create ChatThreadClient")
            self.message = "Failed to join meeting chat"
            return
        }
    } else {
        print("Failed to join Teams meeting")
    }
}
```

Add the following helper function to the `ContentView`, this is used to retrieve the Chat thread ID from the Team's meeting link.

```
func getThreadId(from meetingLink: String) -> String? {
    if let range = self.meetingLink.range(of: "meetup-join/") {
        let thread = self.meetingLink[range.upperBound...]
        if let endRange = thread.range(of: "/")?.lowerBound {
            return String(thread.prefix(upTo: endRange))
        }
    }
    return nil
}
```

### Enable sending messages

Add the `sendMessage()` function to `ContentView`. This function uses the `ChatThreadClient` to send messages from the user.

```
func sendMessage() {
    let message = SendChatMessageRequest(
        content: self.chatMessage,
        senderDisplayName: self.displayName
    )
    
    self.chatThreadClient?.send(message: message) { result, _ in
        switch result {
        case .success:
            print("Chat message sent")
        case .failure:
            print("Failed to send chat message")
        }

        self.chatMessage = ""
    }
}
```

### Enable receiving messages

To receive messages, we implement the handler for `ChatMessageReceived` events. When new messages are sent to the thread, this handler adds the messages to the `meetingMessages` variable so they can be displayed in the UI.

First add the following struct to `ContentView.swift`. The UI uses the data in the struct to display our Chat messages.

```
struct MeetingMessage {
    let id: String
    let content: String
    let displayName: String
}
```

Next add the `receiveMessage()` function to `ContentView`. This is the handler that is called every time a `ChatMessageReceived` event occurs.

```
func receiveMessage(response: Any, eventId: ChatEventId) {
    let chatEvent: ChatMessageReceivedEvent = response as! ChatMessageReceivedEvent

    let displayName: String = chatEvent.senderDisplayName ?? "Unknown User"
    let content: String = chatEvent.message.replacingOccurrences(of: "<[^>]+>", with: "", options: String.CompareOptions.regularExpression)

    self.meetingMessages.append(
        MeetingMessage(
            id: chatEvent.id,
            content: content,
            displayName: displayName
        )
    )
}
```

### Leave the chat

When the user leaves the Team's meeting, we clear the Chat from the UI. The full code is shown below.

```
func leaveMeeting() {
    if let call = call {
        call.hangUp(options: nil, completionHandler: { (error) in
            if error == nil {
                self.message = "Leaving Teams meeting was successful"
                // Clear the chat
                self.meetingMessages.removeAll()
            } else {
                self.message = "Leaving Teams meeting failed"
            }
        })
    } else {
        self.message = "No active call to hanup"
    }
}
```

## Get a Teams meeting chat thread for a Communication Services user

The Teams meeting details can be retrieved using Graph APIs, detailed in [Graph documentation](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true). The Communication Services Calling SDK accepts a full Teams meeting link or a meeting ID. They are returned as part of the `onlineMeeting` resource, accessible under the [`joinWebUrl` property](/graph/api/resources/onlinemeeting?view=graph-rest-beta&preserve-view=true)

With the [Graph APIs](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true), you can also obtain the `threadID`. The response has a `chatInfo` object that contains the `threadID`.

You can also get the required meeting information and thread ID from the **Join Meeting** URL in the Teams meeting invite itself.
A Teams meeting link looks like this: `https://teams.microsoft.com/l/meetup-join/meeting_chat_thread_id/1606337455313?context=some_context_here`. The `threadID` is where `meeting_chat_thread_id` is in the link. Ensure that the `meeting_chat_thread_id` is unescaped before use. It should be in the following format: `19:meeting_ZWRhZDY4ZGUtYmRlNS00OWZaLTlkZTgtZWRiYjIxOWI2NTQ4@thread.v2`


## Run the code

Run the application. 

To join the Teams meeting, enter your Team's meeting link in the UI.

After you join the Team's meeting, you need to admit the user to the meeting in your Team's client. Once the user is admitted and has joined the chat, you are able to send and receive messages.

:::image type="content" source="../join-teams-meeting-chat-quickstart-ios.png" alt-text="Screenshot of the completed iOS Application.":::

> [!NOTE] 
> Certain features are currently not supported for interoperability scenarios with Teams. Learn more about the supported features, please see [Teams meeting capabilities for Teams external users](../../../concepts/interop/guest/capabilities.md)

