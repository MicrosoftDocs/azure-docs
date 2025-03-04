---
title: Migrating from Twilio Conversations Chat to Azure Communication Services Chat iOS
description: Guide describes how to migrate iOS apps from Twilio Conversations Chat to Azure Communication Services Chat SDK. 
services: azure-communication-services
ms.date: 08/28/2024
ms.topic: include
author: RinaRish
ms.author: ektrishi
ms.service: azure-communication-services
ms.subservice: chat
ms.custom: mode-other
---

## Prerequisites

- **Azure Account:** Make sure that your Azure account is active. New users can create a free account at [Microsoft Azure](https://azure.microsoft.com/free/).
- **Communication Services Resource:** Set up a [Communication Services Resource](../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp) via your Azure portal and note your connection string.
- **Azure CLI:** Follow the instructions to [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows?tabs=azure-cli).
- **User Access Token:** Generate a user access token to instantiate the call client. You can create one using the Azure CLI as follows:

```console
az communication identity token issue --scope voip --connection-string "yourConnectionString"
```

For more information, see [Use Azure CLI to Create and Manage Access Tokens](../../quickstarts/identity/access-tokens.md?pivots=platform-azcli).

## Installation

### Install the libraries

To start the migration from Twilio Conversations Chat, the first step is to install the Azure Communication Services Chat SDK for iOS to your project. You can configure these parameters using `CocoaPods`.

1. Create a Podfile for your application. Open the terminal, navigate to the project folder, and run:

 `pod init`

2. Add the following code to the Podfile and save (make sure that "target" matches the name of your project):

```
pod 'AzureCommunicationChat', '~> 1.3.5'
```

3. Set up the `.xcworkspace` project:

```shell
pod install
```

4. Open the `.xcworkspace` created by the pod install with Xcode.

### Authenticating to the SDK

To use the Azure Communication Services Chat SDK, you need to authenticate using an access token.

#### Twilio

The following code snippets presume the availability of a valid access token for Twilio Services.


```swift
static func getTokenUrlFromDefaults(identity: String, password: String) -> URL? {
        // Get token service absolute URL from settings
        guard let tokenServiceUrl = UserDefaults.standard.string(forKey: "ACCESS_TOKEN_SERVICE_URL"), !tokenServiceUrl.isEmpty else {
            return nil
        }
        return constructLoginUrl(tokenServiceUrl, identity: identity, password: password)
    }
```

#### Azure Communication Services

The following code snippets require a valid access token to initiate a `CallClient`.

You need a valid token. For more information, see [Create and Manage Access Tokens](../../quickstarts/identity/access-tokens.md).

```swift
// Create an instance of CallClient 
let callClient = CallClient() 
 
// A reference to the call agent, it will be initialized later 
var callAgent: CallAgent? 
 
// Embed the token in a CommunicationTokenCredential object 
let userCredential = try? CommunicationTokenCredential(token: "<USER_TOKEN>") 
 
// Create a CallAgent that will be used later to initiate or receive calls 
callClient.createCallAgent(userCredential: userCredential) { callAgent, error in 
 if error != nil { 
        // Raise the error to the user and return 
 } 
 self.callAgent = callAgent         
} 
```

### Initialize Chat Client

#### Twilio

The following code snippet initializes the chat client in Twilio.

```swift
func fetchAccessTokenAndInitializeClient() {
        let identity = "user_identity" // Replace with actual user identity
        let urlString = "http://localhost:3000/token?identity=\(identity)"
        
        guard let url = URL(string: urlString) else { return }
        
        let task = URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data, error == nil else {
                print("Error fetching token: \(String(describing: error))")
                return
            }
            
            do {
                if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
                   let token = json["token"] as? String {
                    self.initializeConversationsClient(withToken: token)
                }
            } catch {
                print("Error parsing token JSON: \(error)")
            }
        }
        
        task.resume()
    }
```m = TwilioVideoSDK.connect(options: connectOptions, delegate: self)
```

#### Azure Communication Services

To create a chat client, use your Communication Services endpoint and the access token generated as part of the prerequisite steps.

Replace `<ACS_RESOURCE_ENDPOINT>` with the endpoint of your Azure Communication Services resource. Replace `<ACCESS_TOKEN>` with a valid Communication Services access token.

```swift
let endpoint = "<ACS_RESOURCE_ENDPOINT>"
let credential =
try CommunicationTokenCredential(
    token: "<ACCESS_TOKEN>"
)
let options = AzureCommunicationChatClientOptions()

let chatClient = try ChatClient(
    endpoint: endpoint,
    credential: credential,
    withOptions: options
)
```

## Object model 

The following classes and interfaces handle some of the major features of the Azure Communication Services Chat SDK for iOS.

| Name                                   | Description                                                                                                                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ChatClient` | This class is needed for the chat function. You instantiate it with your subscription information, and use it to create, get, delete threads, and subscribe to chat events. |
| `ChatThreadClient` | This class is needed for the chat thread function. You get an instance via `ChatClient`, and use it to send, receive, update, and delete messages. You can also use it to add, remove, get users, and send typing notifications and read receipts. |


### Start a chat thread

#### Twilio

The following code snippet enables you to create a new chat thread.

```swift
    // the unique name of the conversation you create
    private let uniqueConversationName = "general"

    // For the quickstart, this will be the view controller
    weak var delegate: QuickstartConversationsManagerDelegate?

    // MARK: Conversations variables
    private var client: TwilioConversationsClient?
    private var conversation: TCHConversation?
    private(set) var messages: [TCHMessage] = []
    private var identity: String?

    func conversationsClient(_ client: TwilioConversationsClient, synchronizationStatusUpdated status: TCHClientSynchronizationStatus) {
        guard status == .completed else {
            return
        }

        checkConversationCreation { (_, conversation) in
           if let conversation = conversation {
               self.joinConversation(conversation)
           } else {
               self.createConversation { (success, conversation) in
                   if success, let conversation = conversation {
                       self.joinConversation(conversation)
                   }
               }
           }
        }
```

#### Azure Communication Services

The response returned from creating a chat thread is `CreateChatThreadResult`.
It contains a `chatThread` property, which is the `ChatThreadProperties` object. This object contains the `threadId`, which you can use to get a `ChatThreadClient` for performing operations on the created thread: add participants, send message, and so on.

Replace the comment `<CREATE A CHAT THREAD>` with the following code snippet:

```swift
let request = CreateChatThreadRequest(
    topic: "Quickstart",
    participants: [
        ChatParticipant(
            id: CommunicationUserIdentifier("<USER_ID>"),
            displayName: "Jack"
        )
    ]
)

var threadId: String?
chatClient.create(thread: request) { result, _ in
    switch result {
    case let .success(result):
        threadId = result.chatThread?.id

    case .failure:
        fatalError("Failed to create thread.")
    }
    semaphore.signal()
}
semaphore.wait()
```

Replace `<USER_ID>` with a valid Communication Services user ID.

You're using a semaphore here to wait for the completion handler before continuing. In later steps, use the `threadId` from the response returned to the completion handler.


### Get a chat thread client

#### Twilio

The following code snippet shows how to get a chat thread client in Twilio.

```swift
func conversationsClient(_ client: TwilioConversationsClient, synchronizationStatusUpdated status: TCHClientSynchronizationStatus) {
        guard status == .completed else {
            return
        }

        checkConversationCreation { (_, conversation) in
           if let conversation = conversation {
               self.joinConversation(conversation)
           } else {
               self.createConversation { (success, conversation) in
                   if success, let conversation = conversation {
                       self.joinConversation(conversation)
                   }
               }
           }
        }
    }
```

#### Azure Communication Services

The `createClient` method returns a `ChatThreadClient` for a thread that already exists. You can use it to perform operations on the created thread: add participants, send message, and so on.

The `threadId` is the unique ID of the existing chat thread.

Replace the comment `<GET A CHAT THREAD CLIENT>` with the following code:

```swift
let chatThreadClient = try chatClient.createClient(forThread: threadId!)
```

### Send a message to a chat thread

Unlike Twilio, Azure Communication Services doesn't have separate function to send text message or media.

#### Twilio

Send a regular text message in Twilio.

```swift
    func sendMessage(_ messageText: String,
                     completion: @escaping (TCHResult, TCHMessage?) -> Void) {

        let messageOptions = TCHMessageOptions().withBody(messageText)
        conversation?.sendMessage(with: messageOptions, completion: { (result, message) in
            completion(result, message)
        })

    }
```

Send media in Twilio:

```swift
/ The data for the image you would like to send
let data = Data()

// Prepare the message and send it
self.conversation.prepareMessage
    .addMedia(data: data, contentType: "image/jpeg", filename: "image.jpg", listener: .init(onStarted: {
        // Called when upload of media begins.
        print("Media upload started")
    }, onProgress: { bytes in
        // Called as upload progresses, with the current byte count.
        print("Media upload progress: \(bytes)")
    }, onCompleted: { sid in
        // Called when upload is completed, with the new mediaSid if successful.
        // Full failure details will be provided through sendMessage's completion.
        print("Media upload completed")
    }, onFailed: { error in
        // Called when upload is completed, with the new mediaSid if successful.
        // Full failure details will be provided through sendMessage's completion.
        print("Media upload failed with error: \(error)")
    }))
    .buildAndSend { result, message in
        if !result.isSuccessful {
            print("Creation failed: \(String(describing: result.error))")
        } else {
            print("Creation successful")
        }
    }
```

#### Azure Communication Services

Use the `send` method to send a message to a thread identified by `threadId`.

Use `SendChatMessageRequest` to describe the message request:

- Use `content` to provide the chat message content.
- Use `senderDisplayName` to specify the display name of the sender.
- Use `type` to specify the message type, such as `text` or `html`.
- Use `metadata` optionally to include any information you want to send along with the message. This field provides a mechanism for developers to extend chat message functionality and add custom information for your use case. For example, when sharing a file link in the message, you might want to add `hasAttachment:true` in metadata so that recipient's application can parse that and display accordingly.

The response returned from sending a message is`SendChatMessageResult`. It contains an ID, which is the unique ID of the message.

Replace the comment `<SEND A MESSAGE>` with the following code snippet:

```swift
let message = SendChatMessageRequest(
                        content: "Hello!",
                        senderDisplayName: "Jack",
                        type: .text,
                        metadata: [
                            "hasAttachment": "true",
                            "attachmentUrl": "https://contoso.com/files/attachment.docx"
                        ]
                    )

var messageId: String?

chatThreadClient.send(message: message) { result, _ in
    switch result {
    case let .success(result):
        print("Message sent, message id: \(result.id)")
        messageId = result.id
    case .failure:
        print("Failed to send message")
    }
    semaphore.signal()
}
semaphore.wait()
```

### Receive chat messages from a chat thread

Unlike Twilio, Azure Communication Services doesn't have a separate function to receive text message or media.

#### Twilio

The following code snippet shows how to receive a text message in Twilio.

```swift
// Called whenever a conversation we've joined receives a new message
    func conversationsClient(_ client: TwilioConversationsClient, conversation: TCHConversation,
                    messageAdded message: TCHMessage) {
        messages.append(message)

        // Changes to the delegate should occur on the UI thread
        DispatchQueue.main.async {
            if let delegate = self.delegate {
                delegate.reloadMessages()
                delegate.receivedNewMessage()
            }
        }
    }
```

Receive media in Twilio:

```swift
conversationsClient.getTemporaryContentUrlsForMedia(message.attachedMedia) { result, mediaSidToUrlMap in
    guard result.isSuccessful else {
        print("Couldn't get temporary urls with error: \(String(describing: result.error))")
        return
    }

    for (sid, url) in sidToUrlMap {
        print("\(sid) -> \(url)")
    }
}
```

#### Azure Communication Services

With real-time signaling, you can subscribe to listen for new incoming messages and update the current messages in memory accordingly. Azure Communication Services supports a [list of events that you can subscribe to](../../concepts/chat/concepts.md#real-time-notifications).

Replace the comment `<RECEIVE MESSAGES>` with the following code. After enabling notifications, try sending new messages to see the `ChatMessageReceivedEvents`.

```swift
chatClient.startRealTimeNotifications { result in
    switch result {
    case .success:
        print("Real-time notifications started.")
    case .failure:
        print("Failed to start real-time notifications.")
    }
    semaphore.signal()
}
semaphore.wait()

chatClient.register(event: .chatMessageReceived, handler: { response in
    switch response {
    case let .chatMessageReceivedEvent(event):
        print("Received a message: \(event.message)")
    default:
        return
    }
})
```

Alternatively you can retrieve chat messages by polling the `listMessages` method at specified intervals. See the following code snippet for `listMessages`.

```swift
chatThreadClient.listMessages { result, _ in
    switch result {
    case let .success(messagesResult):
        guard let messages = messagesResult.pageItems else {
            print("No messages returned.")
            return
        }

        for message in messages {
            print("Received message with id: \(message.id)")
        }

    case .failure:
        print("Failed to receive messages")
    }
    semaphore.signal()
}
semaphore.wait()
```

### Push notifications

Similar to Twilio, Azure Communication Services support push notifications. Push notifications notify clients of incoming messages in a chat thread if the mobile app isn't running in the foreground.

Currently sending chat push notifications with Notification Hub is supported for iOS SDK in version 1.3.0.

For more information, see [Enable Push Notification in your chat app](../../tutorials/add-chat-push-notifications.md).

