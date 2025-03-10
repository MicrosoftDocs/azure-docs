---
title: Chat concepts in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services Chat concepts.
author: kperla97
manager: darmour
services: azure-communication-services
ms.author: chpalm
ms.date: 11/07/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: chat
---

# Chat concepts

Azure Communication Services Chat can help you add real-time text communication to your cross-platform applications. This page summarizes key Chat concepts and capabilities. See the [Communication Services Chat Software Development Kit (SDK) Overview](./sdk-features.md) for lists of SDKs, languages, platforms, and detailed feature support.

The Chat APIs provide an **auto-scaling** service for persistently stored text and data communication. Other key features include:

- **Custom Identity and Addressing** - Azure Communication Services provides generic [identities](../identity-model.md) to address communication endpoints. Clients use these identities to authenticate to the Azure service and communicate with each other in `chat threads` you control.
- **Encryption** - Chat SDKs encrypt traffic and prevents tampering on the wire.
- **Microsoft Teams Meetings** - Chat SDKs can [join Teams meetings](../../quickstarts/chat/meeting-interop.md) and communicate with Teams chat messages.
- **Real-time Notifications** - Chat SDKs use efficient persistent connectivity (WebSockets) to receive real-time notifications such as when a remote user is typing. When apps are running in the background, built-in functionality is available to [fire pop-up notifications](../notifications.md) ("toasts") to inform end users of new threads and messages.
- **Bot Extensibility** - It's easy to add Azure bots to the Chat service with [Azure Bot integration](../../quickstarts/chat/quickstart-botframework-integration.md).

## Chat overview

Chat conversations happen within **chat threads**. Chat threads have the following properties:

- A chat thread identity is its `ChatThreadId`. 
- Chat threads have between zero to 250 users as participants who can send messages to it. 
- A user can be a part an unlimited number of chat threads. 
- Only thread participants can send or receive messages, add participants, or remove participants. 
- Users are added as a participant to any chat threads that they create.

### User access
Azure Communication Services supports three levels of user access control, using the chat tokens. See [Identity and Tokens](../identity-model.md) for details. Participants don't have write-access to messages sent by other participants, which means only the message sender can update or delete their sent messages. If another participant tries to do that, they get an error. 

### Chat Data

Azure Communication Services stores chat threads according to the [data retention policy](/purview/create-retention-policies) in effect when the thread is created. You can update the retention policy if needed during the retention time period you set. After you delete a chat thread (by policy or by a Delete API request), it can't be retrieved.

[!INCLUDE [chat-retention-policy.md](../../includes/chat-retention-policy.md)]

You can choose between indefinite thread retention, automatic deletion between 30 and 90 days via the retention policy on the [Create Chat Thread API](/rest/api/communication/chat/chat/create-chat-thread), or immediate deletion using the APIs [Delete Chat Message](/rest/api/communication/chat/chat-thread/delete-chat-message) or [Delete Chat Thread](/rest/api/communication/chat/chat/delete-chat-thread). 

Any thread created before the new retention policy isn't affected unless you specifically change the policy for that thread. If you submit a support request for a deleted chat thread more than 30 days after the retention policy deleted that thread, it can no longer be retrieved and no information about that thread is available. If needed, [open a support ticket](/azure/azure-portal/supportability/how-to-create-azure-support-request) as quickly as possible within the 30 day window after you create a thread so we can assist you.

Chat thread participants can use `ListMessages` to view message history for a particular thread. The `ListMessages` API can't return the history of a thread if the thread is deleted. Users that are removed from a chat thread are able to view previous message history but can't send or receive new messages. Accidentally deleted messages aren't recoverable by the system. To learn more about data being stored in Azure Communication Services chat service, see [Region availability and data residency](../privacy.md).

For customers that use Virtual appointments, refer to our Teams Interoperability [user privacy](../interop/guest/privacy.md#chat-storage) for storage of chat messages in Teams meetings.

### Service limits

- The maximum number of participants allowed in a chat thread is 250.
- The maximum message size allowed is approximately 28 KB.
- For chat threads with more than 20 participants, read receipts and typing indicator features aren't supported.
- For Teams Interop scenarios, it's the number of Azure Communication Services users, not Teams users, that must be below 20 for the typing indicator feature to be supported.
- When creating a chat thread, you can set the retention policy between 30 and 90 days.
- Moreover, in Teams Interop scenarios, there are the following limitations:
    - The Teams user's display name in typing indicator event is blank.
    - Read receipt isn't supported.
    - Certain identities aren't supported, such as [Bot users](/microsoftteams/platform/bots/what-are-bots), [Skype users](https://support.microsoft.com/en-us/office/use-skype-in-microsoft-teams-4382ea15-f963-413d-8982-491c1b9ae3bf), [non-enterprise users](https://support.microsoft.com/en-us/office/learn-more-about-subscriptions-for-microsoft-teams-free-1061bbd0-6d97-46a6-8ca0-21059be3eee3), and similar.
  
## Chat architecture

There are two core parts to chat architecture: 1) Trusted service and 2) Client application.

:::image type="content" source="../../media/chat-architecture-updated.svg" alt-text="Diagram showing Communication Services' chat architecture.":::

 - **Trusted service:** To properly manage a chat session, you need a service that helps you connect to Communication Services by using your resource connection string. This service is responsible for creating chat threads, adding and removing participants, and issuing access tokens to users. For more information, see [Quickstart: Create and manage access tokens](../../quickstarts/identity/access-tokens.md) quickstart.
 - **Client app:**  The client application connects to your trusted service and receives the access tokens that users need to connect directly to Communication Services. After you create the chat thread and add participants, they can use the client application to connect to the chat thread and send messages. Participants can use real-time notifications in your client application to subscribe to message & thread updates from other members.

## Build intelligent, AI-powered chat experiences

You can use Azure AI services with the Chat service to build use cases like:

- Help a support agent prioritize tickets by detecting a negative sentiment of an incoming message from a customer.
- Generate a summary at the end of the conversation to send to customer via email with next steps or follow up at a later date.
- Add an [Agent](https://www.microsoft.com/en-us/microsoft-copilot/microsoft-copilot-studio/) in an Azure Communication Services Chat channel with an Azure Bot and a [relay bot](/microsoft-copilot-studio/publication-connect-bot-to-azure-bot-service-channels#manage-conversation-sessions-with-your-power-virtual-agents-bot).
- Configure a bot to run on one or more social channels alongside the Chat channel.

:::image type="content" source="../media/chat/chat-and-open-ai.svg" alt-text="Diagram showing Azure Communication Services can be paired with Azure AI services.":::

## Message types

As part of message history, Chat shares user-generated messages and system-generated messages. 

System messages are generated when 
- a chat thread is updated
- a participant was added or removed 
- the chat thread topic was updated.

When you call `List Messages` or `Get Messages` on a chat thread, the result contains both kind of messages in chronological order. For user-generated messages, the message type can be set in `SendMessageOptions` when sending a message to chat thread. If no value is provided, Communication Services defaults to `text` type. Setting this value is important when sending HTML. When `html` is specified, Communication Services sanitizes the content to ensure that it rendered safely on client devices.
 - `text`: A plain text message composed and sent by a user as part of a chat thread. 
 - `html`: A formatted message using html, composed and sent by a user as part of chat thread. 

Types of system messages: 
 - `participantAdded`: System message that indicates one or more participants are in the chat thread.
 - `participantRemoved`: System message that indicates a participant is removed from the chat thread.
 - `topicUpdated`: System message that indicates the thread topic is updated.

## Real-time notifications

JavaScript Chat SDK supports real-time notifications. This feature lets clients listen to Communication Services for real-time updates and incoming messages to a chat thread without having to poll the APIs. 

The client app can subscribe to following events:
 - `chatMessageReceived` - when a new message is sent to a chat thread by a participant.
 - `chatMessageEdited` - when a message is edited in a chat thread.
 - `chatMessageDeleted` - when a message is deleted in a chat thread.
 - `typingIndicatorReceived` - when another participant sends a typing indicator to the chat thread.
 - `readReceiptReceived` - when another participant sends a read receipt for a message they have read.
 - `chatThreadCreated` - when a Communication Services user creates a chat thread.
 - `chatThreadDeleted` - when a Communication Services user deletes a chat thread.
 - `chatThreadPropertiesUpdated` - when chat thread properties are updated; currently, only updating the topic for the thread is supported.
 - `participantsAdded` - when a user is added as a chat thread participant.
 - `participantsRemoved` - when an existing participant is removed from the chat thread.
 - `realTimeNotificationConnected` - when real time notification is connected.
 - `realTimeNotificationDisconnected` -when real time notification is disconnected.

> [!NOTE] 
> Real time notifications are not to be used with server applications.

## Server events

This feature lets server applications listen to events such as when a message is sent and when a participant is joining or leaving the chat. Server applications can react to these events, adding/removing participants to the chat, archiving chats, performing analysis, and many other scenarios for orchestration. To see which chat events are available to developers, see [Azure Communication Services as an Azure Event Grid source](../../../event-grid/event-schema-communication-services.md?bc=/azure/bread/toc.json&toc=/azure/communication-services/toc.json).

## Push notifications 

Android and iOS Chat SDKs support push notifications. To send push notifications for messages missed by your participants while they were away, connect a Notification Hub resource with Communication Services resource to send push notifications. Doing so notifies your application participants about incoming chats and messages when the mobile app isn't running in the foreground.    
    
IOS and Android SDK support the following events:
- `chatMessageReceived` - when a participant sends a new message to a chat thread.     
   
Android SDK supports extra events:
- `chatMessageEdited` - when a participant edits a message in a chat thread.	
- `chatMessageDeleted` - when a participant deletes a message in a chat thread.	
- `chatThreadCreated` - when a Communication Services user creates a chat thread.	
- `chatThreadDeleted` - when a Communication Services user deletes a chat thread.	
- `chatThreadPropertiesUpdated` - when you update chat thread properties; currently, only updating the topic for the thread is supported.	
- `participantsAdded` - when you add a participant to a chat thread. 	
- `participantsRemoved` - when you remove an existing participant from the chat thread.

For more information, see [Push Notifications](../notifications.md).

> [!NOTE]
> Currently sending chat push notifications with Notification Hub is generally available in Android version 1.1.0 and in IOS version 1.3.0.

## Next steps

> [!div class="nextstepaction"]
> [Get started with chat](../../quickstarts/chat/get-started.md)


## Related articles

- Familiarize yourself with the [Chat SDK](./sdk-features.md)
- Access control for participants on a thread using [Identity and Tokens](../identity-model.md)
- Build an application or a mobile app with [UI Library](../ui-library/ui-library-overview.md)
