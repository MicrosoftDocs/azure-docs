---
title: include file
description: include file
services: azure-communication-services
author: mikben
manager: mikben
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/30/2021
ms.topic: include
ms.custom: include file
ms.author: mikben
---

[!INCLUDE [Public Preview Notice](../../../includes/public-preview-include-chat.md)]

## Sample Code
Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/add-chat).

## Prerequisites
Before you get started, make sure to:

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- Install [Xcode](https://developer.apple.com/xcode/) and [CocoaPods](https://cocoapods.org/). You use Xcode to create an iOS application for the quickstart, and CocoaPods to install dependencies.
- Create an Azure Communication Services resource. For details, see [Quickstart: Create and manage Communication Services resources](../../create-communication-resource.md). For this quickstart, you need to record your resource endpoint.
- Create two users in Azure Communication Services, and issue them a [user access token](../../access-tokens.md). Be sure to set the scope to `chat`, and note the `token` string as well as the `userId` string. In this quickstart, you create a thread with an initial participant, and then add a second participant to the thread.

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
pod 'AzureCommunicationCommon', '~> 1.0'
pod 'AzureCommunicationChat', '~> 1.0.1'
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

Replace the comment `<CREATE A CHAT CLIENT>` with the following code:

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

This quickstart doesn't cover creating a service tier to manage tokens for your chat application, but that's recommended. For more information, see the "Chat architecture" section of [Chat concepts](../../../concepts/chat/concepts.md).

For more information about user access tokens, see [Quickstart: Create and manage access tokens](../../access-tokens.md).

## Object model 

The following classes and interfaces handle some of the major features of the Azure Communication Services Chat SDK for JavaScript.

| Name                                   | Description                                                                                                                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ChatClient` | This class is needed for the chat functionality. You instantiate it with your subscription information, and use it to create, get, delete threads, and subscribe to chat events. |
| `ChatThreadClient` | This class is needed for the chat thread functionality. You obtain an instance via `ChatClient`, and use it to send, receive, update, and delete messages. You can also use it to add, remove, and get users, send typing notifications and read receipts. |

## Start a chat thread

Now you use your `ChatClient` to create a new thread with an initial user.

Replace the comment `<CREATE A CHAT THREAD>` with the following code:

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

Now that you've created a chat thread, you can obtain a `ChatThreadClient` to perform operations within the thread.

Replace the comment `<GET A CHAT THREAD CLIENT>` with the following code:

```
let chatThreadClient = try chatClient.createClient(forThread: threadId!)
```

## Send a message to a chat thread

Replace the comment `<SEND A MESSAGE>` with the following code:

```
let message = SendChatMessageRequest(
    content: "Hello!",
    senderDisplayName: "Jack"
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

First, you construct the `SendChatMessageRequest`, which contains the content and sender's display name. This request can also contain the share history time, if you want to include it. The response returned to the completion handler contains the ID of the message that was sent.


## Send a read receipt

You can send a read receipt for a particular message by calling `ChatThreadClients` `sendReadReceipt` method. Replace the comment `<SEND A READ RECEIPT>` with the following code:

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

You can receive messages from a chat thread by calling the `listMessages()` method from `ChatThreadClient`. List messages includes system messages as well as user sent messages. For more information on the types of messages you can receive see [Message Types](../../../concepts/chat/concepts.md#message-types)

Replace the comment `<RECEIVE MESSAGES>` with the following code:

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

Replace the comment `<ADD A USER>` with the following code:

```
let user = ChatParticipant(
    id: CommunicationUserIdentifier("<USER_ID>"),
    displayName: "Jane"
)

chatThreadClient.add(participants: [user]) { result, _ in
    switch result {
    case let .success(result):
        (result.invalidParticipants != nil) ? print("Added participant") : print("Error adding participant")
    case .failure:
        print("Failed to add the participant")
    }
    semaphore.signal()
}
semaphore.wait()
```

Replace `<USER_ID>` with the Communication Services user ID of the user to be added.

When you're adding a participant to a thread, the response returned might contain errors. These errors represent failure to add particular participants.

## List users in a thread

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

## Run the code

In Xcode hit the Run button to build and run the project. In the console you can view the output from the code and the logger output from the ChatClient.

**Note:** Set `Build Settings > Build Options > Enable Bitcode` to `No`. Currently the AzureCommunicationChat SDK for iOS does not support enabling bitcode, the following [Github issue](https://github.com/Azure/azure-sdk-for-ios/issues/787) is tracking this.
