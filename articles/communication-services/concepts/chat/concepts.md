---	
title: Chat concepts in Azure Communication Services	
titleSuffix: An Azure Communication Services concept document	
description: Learn about Communication Services Chat concepts.	
author: mikben	
manager: jken	
services: azure-communication-services	
ms.author: mikben	
ms.date: 09/30/2020	
ms.topic: overview	
ms.service: azure-communication-services	
---	

# Chat concepts	

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]	

Azure Communication Services Chat SDKs can be used to add real-time text chat to your applications. This page summarizes key Chat concepts and capabilities.	

See the [Communication Services Chat SDK Overview](./sdk-features.md) to learn more about specific SDK languages and capabilities.	

## Chat overview 	

Chat conversations happen within chat threads. A chat thread, uniquely identified by `ChatThreadId`, can have one or many users as participants who can send messages to it. A user can be a part of one or many chat threads. Only the thread participants have access to it and can do operations like send and recieve messages, add or remove others users or themselves. A user that created the chat thread is automatically added as participant to it.

### User access
Typically the thread creator and participants have same level of access to the thread and can execute all related operations available in the SDK, including deleting it. Participants don't have write access to messages sent by other participants, which means only the message sender can update or delete their sent messages. If another participant tries to do that, they'll get an error. 

If you want to limit access to chat features for a set of users, you can configure access as part of your trusted service. Your trusted service is the service that orchestrates the authentication and authorization of chat participants. We'll explore this in further detail below.  

### Chat Data 
Communication Services stores chat history until explicitly deleted. Chat thread participants can use `ListMessages` to view  message history for a particular thread. Users removed from a chat thread will be able to view previous message history, but they won't be able to send or receive new messages as part of that chat thread. A fully idle thread with no participants will be automatically deleted after 30 days. To learn more about data being stored by Communication Services, refer to documentation on [privacy](../privacy.md).  

### Service limits	
- The maximum number of participants allowed in a chat thread is 250.	
- The maximum message size allowed is approximately 28 KB. 	
- For chat threads with more than 20 participants, read receipts and typing indicator features aren't supported. 	

## Chat architecture	

There are two core parts to chat architecture: 1) Trusted Service and 2) Client Application.	

:::image type="content" source="../../media/chat-architecture.png" alt-text="Diagram showing Communication Services' chat architecture.":::	

 - **Trusted service:** To properly manage a chat session, you need a service that helps you connect to Communication Services by using your resource connection string. This service is responsible for creating chat threads, managing thread participant lists, and providing access tokens to users. More information about access tokens can be found in our [access tokens](../../quickstarts/access-tokens.md) quickstart.	
 - **Client app:**  The client application connects to your trusted service and receives the access tokens that are used to connect directly to Communication Services. After this connection is made, your client app can send and receive messages.	
We recommend generating access tokens using the trusted service tier. In this scenario the server side would be responsible for creating and managing users and issuing their tokens.	
    	
## Message types	

As part of message history, Chat shares user-generated messages as well as system-generated messages. System messages are generated when a chat thread is updated and can help identify when a participant was added or removed or when the chat thread topic was updated. When you call `List Messages` or `Get Messages` on a chat thread, the result will contain both kind of messages in chronological order.  
For user generated messages, the message type can be set in `SendMessageOptions` when sending a message to chat thread. If no value is provided, Communication Services will default to `text` type. Setting this value is important when sending HTML. When `html` is specified, Communication Services will sanitize the content to ensure that it's rendered safely on client devices.
 - `text`: A plain text message composed and sent by a user as part of a chat thread. 
 - `html`: A formatted message using html, composed and sent by a user as part of chat thread. 

Types of system messages: 
 - `participantAdded`: System message that indicates one or more participants have been added to the chat thread.
 - `participantRemoved`: System message that indicates a participant has been removed from the chat thread.
 - `topicUpdated`: System message that indicates the thread topic has been updated.

## Real-time notifications 	

Some SDKs (like the JavaScript Chat SDK) support real-time notifications. This feature lets clients listen to Communication Services for real-time updates and incoming messages to a chat thread without having to poll the APIs. Supported events include:
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

Real-time notifications can be used to provide a real-time chat experience for your users. To send push notifications for messages missed by your users while they were away, Communication Services integrates with Azure Event Grid to publish chat related events (post operation) which can be plugged into your custom app notification service. For more details, see [Server Events](https://docs.microsoft.com/azure/event-grid/event-schema-communication-services?toc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fcommunication-services%2Ftoc.json&bc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json).


## Build intelligent, AI powered chat experiences 	

You can use [Azure Cognitive APIs](../../../cognitive-services/index.yml) with the Chat SDK to build use cases like:

- Enable users to chat with each other in different languages. 	
- Help a support agent prioritize tickets by detecting a negative sentiment of an incoming message from a customer.	
- Analyze the incoming messages for key detection and entity recognition, and prompt relevant info to the user in your app based on the message content.

One way to achieve this is by having your trusted service act as a participant of a chat thread. Let's say you want to enable language translation. This service will be responsible for listening to the messages being exchanged by other participants [1], calling cognitive APIs to translate the content to desired language[2,3] and sending the translated result as a message in the chat thread[4].

This way, the message history will contain both original and translated messages. In the client application, you can add logic to show the original or translated message. See [this quickstart](../../../cognitive-services/translator/quickstart-translator.md) to understand how to use Cognitive APIs to translate text to different languages. 
	
:::image type="content" source="../media/chat/cognitive-services.png" alt-text="Diagram showing Cognitive Services interacting with Communication Services.":::	

## Next steps	

> [!div class="nextstepaction"]	
> [Get started with chat](../../quickstarts/chat/get-started.md)	

The following documents may be interesting to you:	
- Familiarize yourself with the [Chat SDK](sdk-features.md)
