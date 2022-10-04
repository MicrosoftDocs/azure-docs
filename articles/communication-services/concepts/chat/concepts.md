---
title: Chat concepts in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services Chat concepts.
author: tophpalmer
manager: chpalm
services: azure-communication-services
ms.author: chpalm
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: chat
---

# Chat concepts

Azure Communication Services Chat can help you add real-time text communication to your cross-platform applications. This page summarizes key Chat concepts and capabilities. See the [Communication Services Chat Software Development Kit (SDK) Overview](./sdk-features.md) for lists of SDKs, languages, platforms, and detailed feature support. 

The Chat APIs provide an **auto-scaling** service for persistently storied text and data communication. Other key features include:

- **Custom Identity and Addressing** - Azure Communication Services provides generic [identities](../identity-model.md) that are used to address communication endpoints. Clients use these identities to authenticate to the Azure service and communicate with each other in `chat threads` you control.
- **Encryption** - Chat SDKs encrypt traffic and prevents tampering on the wire.
- **Microsoft Teams Meetings** - Chat SDKs can [join Teams meetings](../../quickstarts/chat/meeting-interop.md) and communicate with Teams chat messages.
- **Real-time Notifications** - Chat SDKs use efficient persistent connectivity (WebSockets) to receive real-time notifications such as when a remote user is typing. When apps are running in the background, built-in functionality is available to [fire pop-up notifications](../notifications.md) ("toasts") to inform end users of new threads and messages.
**Service & Bot Extensibility** - REST APIs and server SDKs allow services to send and receive messages. Bots can be added easily with [Azure Bot Framework integration](../../quickstarts/chat/quickstart-botframework-integration.md).



## Chat overview

Chat conversations happen within **chat threads**. Chat threads have the following properties:

- A chat thread is uniquely identified by its `ChatThreadId`. 
- Chat threads have between zero to 250 users as participants who can send messages to it. 
- A user can be a part an unlimited number of chat threads. 
- Only thread participants can send or receive messages, add participants, or remove participants. 
- Users are automatically added as a participant to any chat threads that they create.

### User access
Typically the thread creator and participants have same level of access to the thread and can execute all related operations available in the SDK, including deleting it. Participants don't have write access to messages sent by other participants, which means only the message sender can update or delete their sent messages. If another participant tries to do that, they'll get an error. 

### Chat Data 
Azure stores chat messages until explicitly deleted. Chat thread participants can use `ListMessages` to view  message history for a particular thread. Users that are removed from a chat thread will be able to view previous message history but cannot send or receive new messages. To learn more about data being stored by Communication Services, refer to the [data residency and privacy page](../privacy.md).  

### Service limits
- The maximum number of participants allowed in a chat thread is 250.
- The maximum message size allowed is approximately 28 KB.
- For chat threads with more than 20 participants, read receipts and typing indicator features aren't supported.

## Chat architecture

There are two core parts to chat architecture: 1) Trusted Service and 2) Client Application.

:::image type="content" source="../../media/chat-architecture.png" alt-text="Diagram showing Communication Services' chat architecture.":::

 - **Trusted service:** To properly manage a chat session, you need a service that helps you connect to Communication Services by using your resource connection string. This service is responsible for creating chat threads, adding and removing participants, and issuing access tokens to users. More information about access tokens can be found in our [access tokens](../../quickstarts/access-tokens.md) quickstart.
 - **Client app:**  The client application connects to your trusted service and receives the access tokens that are used by users to connect directly to Communication Services. Once your trusted service has created the chat thread and added users as participants, they can use the client app to connect to the chat thread and send messages. Use real-time notifications feature, which we will discuss below, in your client app to subscribe to message & thread updates from other participants.


## Message types

As part of message history, Chat shares user-generated messages as well as system-generated messages. System messages are generated when a chat thread is updated and identify when a participant was added or removed or when the chat thread topic was updated. When you call `List Messages` or `Get Messages` on a chat thread, the result will contain both kind of messages in chronological order.

For user-generated messages, the message type can be set in `SendMessageOptions` when sending a message to chat thread. If no value is provided, Communication Services will default to `text` type. Setting this value is important when sending HTML. When `html` is specified, Communication Services will sanitize the content to ensure that it's rendered safely on client devices.
 - `text`: A plain text message composed and sent by a user as part of a chat thread. 
 - `html`: A formatted message using html, composed and sent by a user as part of chat thread. 

Types of system messages: 
 - `participantAdded`: System message that indicates one or more participants have been added to the chat thread.
 - `participantRemoved`: System message that indicates a participant has been removed from the chat thread.
 - `topicUpdated`: System message that indicates the thread topic has been updated.

## Real-time notifications

Some SDKs (like the JavaScript Chat SDK) support real-time notifications. This feature lets clients listen to Communication Services for real-time updates and incoming messages to a chat thread without having to poll the APIs. The client app can subscribe to following events:
 - `chatMessageReceived` - when a new message is sent to a chat thread by a participant.
 - `chatMessageEdited` - when a message is edited in a chat thread.
 - `chatMessageDeleted` - when a message is deleted in a chat thread.
 - `typingIndicatorReceived` - when another participant sends a typing indicator to the chat thread.
 - `readReceiptReceived` - when another participant sends a read receipt for a message they have read.
 - `chatThreadCreated` - when a chat thread is created by a Communication Services user.
 - `chatThreadDeleted` - when a chat thread is deleted by a Communication Services user.
 - `chatThreadPropertiesUpdated` - when chat thread properties are updated; currently, only updating the topic for the thread is supported.
 - `participantsAdded` - when a user is added as a chat thread participant.
 - `participantsRemoved` - when an existing participant is removed from the chat thread.
 - `realTimeNotificationConnected` - when real time notification is connected.
 - `realTimeNotificationDisconnected` -when real time notification is disconnected.

## Push notifications 	
To send push notifications for messages missed by your users while they were away, Communication Services provides two different ways to integrate: 
 - Use an Event Grid resource to subscribe to chat related events (post operation) which can be plugged into your custom app notification service. For more details, see [Server Events](../../../event-grid/event-schema-communication-services.md?bc=/azure/bread/toc.json&toc=/azure/communication-services/toc.json).
 - Connect a Notification Hub resource with Communication Services resource to send push notifications and notify your application users about incoming chats and messages when the mobile app is not running in the foreground.    
    
    IOS and Android SDK can support the below event:
   - `chatMessageReceived` - when a new message is sent to a chat thread by a participant.     
   
    Android SDK can support the below additional events:
   - `chatMessageEdited` - when a message is edited in a chat thread.	
   - `chatMessageDeleted` - when a message is deleted in a chat thread.	
   - `chatThreadCreated` - when a chat thread is created by a Communication Services user.	
   - `chatThreadDeleted` - when a chat thread is deleted by a Communication Services user.	
   - `chatThreadPropertiesUpdated` - when chat thread properties are updated; currently, only updating the topic for the thread is supported.	
   - `participantsAdded` - when a user is added as a chat thread participant. 	
   - `participantsRemoved` - when an existing participant is removed from the chat thread.

For more details, see [Push Notifications](../notifications.md).

> [!NOTE]
> Currently sending chat push notifications with Notification Hub is generally available in Android version 1.1.0 and in IOS version 1.3.0.

## Build intelligent, AI powered chat experiences

You can use [Azure Cognitive APIs](../../../cognitive-services/index.yml) with the Chat SDK to build use cases like:

- Enable users to chat with each other in different languages.
- Help a support agent prioritize tickets by detecting a negative sentiment of an incoming message from a customer.
- Analyze the incoming messages for key detection and entity recognition, and prompt relevant info to the user in your app based on the message content.

One way to achieve this is by having your trusted service act as a participant of a chat thread. Let's say you want to enable language translation. This service will be responsible for listening to the messages being exchanged by other participants [1], calling Cognitive APIs to translate the content to desired language[2,3] and sending the translated result as a message in the chat thread[4].

This way, the message history will contain both original and translated messages. In the client application, you can add logic to show the original or translated message. See [this quickstart](../../../cognitive-services/translator/quickstart-translator.md) to understand how to use Cognitive APIs to translate text to different languages. 

:::image type="content" source="../media/chat/cognitive-services.png" alt-text="Diagram showing Cognitive Services interacting with Communication Services.":::

## Next steps

> [!div class="nextstepaction"]
> [Get started with chat](../../quickstarts/chat/get-started.md)

The following documents may be interesting to you:
- Familiarize yourself with the [Chat SDK](sdk-features.md)
