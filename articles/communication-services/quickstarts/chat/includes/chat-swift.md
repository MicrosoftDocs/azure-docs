---
title: include file
description: include file
services: azure-communication-services
author: probableprime
manager: mikben
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/30/2021
ms.topic: include
ms.custom: include file
ms.author: rifox
---

## Prerequisites
Before you get started, make sure to:

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- Install [Xcode](https://developer.apple.com/xcode/) and [CocoaPods](https://cocoapods.org/). You use Xcode to create an iOS application for the quickstart, and CocoaPods to install dependencies.
- Create an Azure Communication Services resource. For details, see [Quickstart: Create and manage Communication Services resources](../../create-communication-resource.md). You'll need to **record your resource endpoint and connection string** for this quickstart.
- Create two users in Azure Communication Services, and issue them a [User Access Token](../../identity/access-tokens.md). Be sure to set the scope to **chat**, and **note the token string as well as the user_id string**. In this quickstart, you create a thread with an initial participant, and then add a second participant to the thread. You can also use the Azure CLI and run the command below with your connection string to create a user and an access token.

  ```azurecli-interactive
  az communication identity token issue --scope chat --connection-string "yourConnectionString"
  ```

  For details, see [Use Azure CLI to Create and Manage Access Tokens](../../identity/access-tokens.md?pivots=platform-azcli).

## Setting up

### Create a new iOS application

Open Xcode and select **Create a new Xcode project**. Then select **iOS** as the platform and **App** for the template.

For the project name, enter **ChatQuickstart**. Then select **Storyboard** as the interface, **UIKit App Delegate** as the life cycle, and **Swift** as the language.

Select **Next**, and choose the directory where you want the project to be created.

### Install the libraries

Use CocoaPods to install the necessary Communication Services dependencies.

From the command line, go inside the root directory of the `ChatQuickstart` iOS project. Create a Podfile with the following command: `pod init`.

Open the Podfile, and add the following dependencies to the `ChatQuickstart` target:

```
pod 'AzureCommunicationChat', '~> 1.3.3'
```

Install the dependencies with the following command: `pod install`. Note that this also creates an Xcode workspace.

After running `pod install`, re-open the project in Xcode by selecting the newly created `.xcworkspace`.

### Set up the placeholders

Open the workspace `ChatQuickstart.xcworkspace` in Xcode, and then open `ViewController.swift`.

In this quickstart, you add your code to `viewController`, and view the output in the Xcode console. This quickstart doesn't address building a user interface in iOS. 

At the top of `viewController.swift`, import the `AzureCommunication` and `AzureCommunicatonChat` libraries:

```
import AzureCommunicationCommon
import AzureCommunicationChat
```

Copy the following code into the `viewDidLoad()` method of `ViewController`:

```
override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.

        let semaphore = DispatchSemaphore(value: 0)
        DispatchQueue.global(qos: .background).async {
            do {
                // <CREATE A CHAT CLIENT>
                
                // <CREATE A CHAT THREAD>

                // <LIST ALL CHAT THREADS>

                // <GET A CHAT THREAD CLIENT>

                // <SEND A MESSAGE>

                // <SEND A READ RECEIPT >

                // <RECEIVE MESSAGES>

                // <ADD A USER>
                
                // <LIST USERS>
            } catch {
                print("Quickstart failed: \(error.localizedDescription)")
            }
        }
    }
```

For demonstration purposes, we'll use a semaphore to synchronize your code. In following steps, you replace the placeholders with sample code by using the Azure Communication Services Chat library.


### Create a chat client

To create a chat client, you'll use your Communication Services endpoint and the access token that was generated as part of the prerequisite steps.

Learn more about [User Access Tokens](../../identity/access-tokens.md).

This quickstart doesn't cover creating a service tier to manage tokens for your chat application, although it's recommended. Learn more about [Chat Architecture](../../../concepts/chat/concepts.md)

Replace the comment `<CREATE A CHAT CLIENT>` with the code snippet below:

```
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

Replace `<ACS_RESOURCE_ENDPOINT>` with the endpoint of your Azure Communication Services resource. Replace `<ACCESS_TOKEN>` with a valid Communication Services access token.

## Object model 

The following classes and interfaces handle some of the major features of the Azure Communication Services Chat SDK for iOS.

| Name                                   | Description                                                                                                                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ChatClient` | This class is needed for the chat functionality. You instantiate it with your subscription information, and use it to create, get, delete threads, and subscribe to chat events. |
| `ChatThreadClient` | This class is needed for the chat thread functionality. You obtain an instance via `ChatClient`, and use it to send, receive, update, and delete messages. You can also use it to add, remove, and get users, send typing notifications and read receipts. |

## Start a chat thread

`CreateChatThreadResult` is the response returned from creating a chat thread.
It contains a `chatThread` property which is the `ChatThreadProperties` object. This object contains the threadId which can be used to get a `ChatThreadClient` for performing operations on the created thread: add participants, send message, etc.

Replace the comment `<CREATE A CHAT THREAD>` with the code snippet below:

```
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

You're using a semaphore here to wait for the completion handler before continuing. In later steps, you'll use the `threadId` from the response returned to the completion handler.

## List all chat threads

After creating a chat thread we can list all chat threads by calling the `listChatThreads` method on `ChatClient`. Replace the comment `<LIST ALL CHAT THREADS>` with the following code:

```
chatClient.listThreads { result, _ in
    switch result {
    case let .success(threads):
        guard let chatThreadItems = threads.pageItems else {
            print("No threads returned.")
            return
        }

        for chatThreadItem in chatThreadItems {
            print("Thread id: \(chatThreadItem.id)")
        }
    case .failure:
        print("Failed to list threads")
    }
    semaphore.signal()
}
semaphore.wait()
```

## Get a chat thread client

The `createClient` method returns a `ChatThreadClient` for a thread that already exists. It can be used for performing operations on the created thread: add participants, send message, etc. threadId is the unique ID of the existing chat thread.

Replace the comment `<GET A CHAT THREAD CLIENT>` with the following code:

```
let chatThreadClient = try chatClient.createClient(forThread: threadId!)
```

## Send a message to a chat thread

Use the `send` method to send a message to a thread identified by threadId.

`SendChatMessageRequest` is used to describe the message request:

- Use `content` to provide the chat message content
- Use `senderDisplayName` to specify the display name of the sender
- Use `type` to specify the message type, such as 'text' or 'html'
- Use `metadata` optionally to include any additional data you want to send along with the message. This field provides a mechanism for developers to extend chat message functionality and add custom information for your use case. For example, when sharing a file link in the message, you might want to add 'hasAttachment:true' in metadata so that recipient's application can parse that and display accordingly.

`SendChatMessageResult` is the response returned from sending a message, it contains an ID, which is the unique ID of the message.

Replace the comment `<SEND A MESSAGE>` with the code snippet below:

```
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

## Send a read receipt

Use the `sendReadReceipt` method to post a read receipt event to a chat thread, on behalf of a user.
`messageId` is the unique ID of the chat message that was read.

Replace the comment `<SEND A READ RECEIPT>` with the code below:

```
if let id = messageId {
    chatThreadClient.sendReadReceipt(forMessage: id) { result, _ in
        switch result {
        case .success:
            print("Read receipt sent")
        case .failure:
            print("Failed to send read receipt")
        }
        semaphore.signal()
    }
    semaphore.wait()
} else {
    print("Cannot send read receipt without a message id")
}
```

## Receive chat messages from a chat thread

With real-time signaling, you can subscribe to listen for new incoming messages and update the current messages in memory accordingly. Azure Communication Services supports a [list of events that you can subscribe to](../../../concepts/chat/concepts.md#real-time-notifications).

Replace the comment `<RECEIVE MESSAGES>` with the code below. After enabling notifications, try sending new messages to see the ChatMessageReceivedEvents.

```
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

Alternatively you can retrieve chat messages by polling the `listMessages` method at specified intervals. See the following code snippet for `listMessages`

```
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

## Add a user as a participant to the chat thread

Once a thread is created, you can then add and remove users from it. By adding users, you give them access to be able to send messages to the thread, and add/remove other participant. Before calling `add`, ensure that you have acquired a new access token and identity for that user. The user will need that access token in order to initialize their chat client.

Use the `add` method of `ChatThreadClient` to add one or more participants to the chat thread. The following are the supported attributes for each thread participant(s):
- `id`, required, is the identity of the thread participant.
- `displayName`, optional, is the display name for the thread participant.
- `shareHistoryTime`, optional, time from which the chat history is shared with the participant.

Replace the comment `<ADD A USER>` with the following code:

```
let user = ChatParticipant(
    id: CommunicationUserIdentifier("<USER_ID>"),
    displayName: "Jane"
)

chatThreadClient.add(participants: [user]) { result, _ in
    switch result {
    case let .success(result):
        if let errors = result.invalidParticipants, !errors.isEmpty {
            print("Error adding participant")
        } else {
            print("Added participant")
        }
    case .failure:
        print("Failed to add the participant")
    }
    semaphore.signal()
}
semaphore.wait()
```

Replace `<USER_ID>` with the Communication Services user ID of the user to be added.

## List users in a thread

Use the `listParticipants` method to get all participants for a particular chat thread.

Replace the `<LIST USERS>` comment with the following code:

```
chatThreadClient.listParticipants { result, _ in
    switch result {
    case let .success(participantsResult):
        guard let participants = participantsResult.pageItems else {
            print("No participants returned.")
            return
        }

        for participant in participants {
            let user = participant.id as! CommunicationUserIdentifier
            print("User with id: \(user.identifier)")
        }
    case .failure:
        print("Failed to list participants")
    }
    semaphore.signal()
}
semaphore.wait()
```
## Push notifications

Push notifications notify clients of incoming messages in a chat thread in situations where the mobile app is not running in the foreground.
Currently sending chat push notifications with Notification Hub is supported for IOS SDK in version 1.3.0.
Please refer to the article [Enable Push Notification in your chat app](../../../tutorials/add-chat-push-notifications.md) for details.

## Run the code

In Xcode hit the Run button to build and run the project. In the console you can view the output from the code and the logger output from the ChatClient.

**Note:** Set `Build Settings > Build Options > Enable Bitcode` to `No`. Currently the AzureCommunicationChat SDK for iOS does not support enabling bitcode, the following [GitHub issue](https://github.com/Azure/azure-sdk-for-ios/issues/787) is tracking this.

## Sample Code
Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/add-chat).
