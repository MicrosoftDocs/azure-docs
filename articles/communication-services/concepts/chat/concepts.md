---
title: Chat concepts in Azure Communication Services
description: Learn about Communication Services Chat concepts.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-communication-services

---
# Chat concepts

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

Azure Communication Services Chat client libraries can be used to add real-time text chat to your applications. This page summarizes key concepts and capabilities in the Chat system.

See the [Communication Services Chat client library Overview](./sdk-features.md) to learn more about specific client library languages and capabilities.

## Chat overview 

The core of chat are individual chat threads. A chat thread can contain many messages and many users. Every message belongs uniquely to a thread, and a user can be part of one or many threads. 

Each user in the chat thread is a called member. You can have up to 250 members in a chat thread. Only thread members can send and receive messages or add/remove members in a chat thread. Max message size allowed is approximately 28KB. Communication Services stores chat history until you execute a delete operation on the chat thread. You can retrieve all messages in a chat thread using the `List/Get Messages` operation.

For chat threads with more than 20 members, read receipts and typing indicator features are disabled. 

## Chat architecture

There are two core parts to chat architecture: 1) Trusted Service and 2) Client Application.

![Architecture Diagram](../../media/chat-architecture.png)

 - **Trusted Service:** To properly manage the chat session, you need a central service that will set up the chat session with Communication Services. In order to set up the session you'll need to pass through the full connection string, so it is preferable (and secure) to do this in a trusted environment. This service then will perform the following functions:
    - Create chat threads
    - Add/remove users from chat threads
    - Pass access tokens for chat thread to users. More information on access tokens [here](../../quickstarts/user-access-tokens.md)

 - **Client App:** A key aspect of a chat application is the end-user experience for sending and receiving messages and you have complete freedom over this front-end experience. The client app will need to perform two core functions:
    - Connect to your trusted service to receive required access tokens
    - Connect directly to Communication Services to send and receive messages using these tokens
    
## Message types

Apart from messages being sent by members in chat thread, Chat also exposes system generated messages called `Thread Activities` that are generated when a chat thread is updated. When you call List Messages or GetMessages on a chat thread, the result will contain the text messages as well as the system messages in chronological order to help identify when a member was added or removed or the chat thread topic was updated. Supported message types are:  

 - Text: Actual message composed and sent by user as part of chat conversation. 

 - `ThreadActivity/AddMember`: System message that indicates one or more members have been added to the chat thread. For example:
```xml
<addmember>
    <eventtime>1598478187549</eventtime>
    <initiator>8:acs:57b9bac9-df6c-4d39-a73b-26e944adf6ea_0e59221d-0c1d-46ae-9544-c963ce56c10b</initiator>
    <detailedinitiatorinfo>
        <friendlyName>User 1</friendlyName>
    </detailedinitiatorinfo>
    <rosterVersion>1598478184564</rosterVersion>
    <target>8:acs:57b9bac9-df6c-4d39-a73b-26e944adf6ea_0e59221d-0c1d-46ae-9544-c963ce56c10b</target>
    <detailedtargetinfo>
        <id>8:acs:57b9bac9-df6c-4d39-a73b-26e944adf6ea_0e59221d-0c1d-46ae-9544-c963ce56c10b</id>
        <friendlyName>User 1</friendlyName>
    </detailedtargetinfo>
    <target>8:acs:57b9bac9-df6c-4d39-a73b-26e944adf6ea_8540c0de-899f-5cce-acb5-3ec493af3800</target>
    <detailedtargetinfo>
        <id>8:acs:57b9bac9-df6c-4d39-a73b-26e944adf6ea_8540c0de-899f-5cce-acb5-3ec493af3800</id>
        <friendlyName>User 2</friendlyName>
    </detailedtargetinfo>
</addmember>
```  

 - `ThreadActivity/DeleteMember`: System message that indicates a member has been removed from the chat thread. For example:
```xml
<deletemember>
    <eventtime>1598478187642</eventtime>
    <initiator>8:acs:57b9bac9-df6c-4d39-a73b-26e944adf6ea_0e59221d-0c1d-46ae-9544-c963ce56c10b</initiator>
    <detailedinitiatorinfo>
        <friendlyName>User 1</friendlyName>
    </detailedinitiatorinfo>
    <rosterVersion>1598478184564</rosterVersion>
    <target>8:acs:57b9bac9-df6c-4d39-a73b-26e944adf6ea_8540c0de-899f-5cce-acb5-3ec493af3800</target>
    <detailedtargetinfo>
        <id>8:acs:57b9bac9-df6c-4d39-a73b-26e944adf6ea_8540c0de-899f-5cce-acb5-3ec493af3800</id>
        <friendlyName>User 2</friendlyName>
    </detailedtargetinfo>
</deletemember>
```

 - `ThreadActivity/TopicUpdate`: System message that indicates the topic has been updated. For example:
```xml
<topicupdate>
    <eventtime>1598477591811</eventtime>
    <initiator>8:acs:57b9bac9-df6c-4d39-a73b-26e944adf6ea_0e59221d-0c1d-46ae-9544-c963ce56c10b</initiator>
    <value>New topic</value>
</topicupdate>
```

## Real-time signaling 

The Chat JavaScript client library includes real-time signaling feature which allows clients to listen for real-time updates & incoming messages to a chat thread, without having to poll the APIs. Available events include:

 - `ChatMessageReceived` - when a new message is sent to a chat thread that the user is member of. This event is not sent for auto generated system messages which we discussed in the previous topic.  
 - `ChatMessageEdited` - when a message is edited in a chat thread that the user is member of. 
 - `ChatMessageDeleted` - when a message is deleted in a chat thread that the user is member of. 
 - `TypingIndicatorReceived` - when another member is typing a message in a chat thread that the user is member of. 
 - `ReadReceiptReceived` - when another member has read the message that user sent in a chat thread. 


## Chat Events 
Real-time signalling, described in the last section, is useful for your client applications to enable users to chat in real-time. Your service-tier can subscribe to get updates about chat related activity happening in clients by using Azure Event Grid. For more details, see [Event Handling conceptual](../event-handling.md).


## Using Cognitive Services with Chat client library to enable intelligent features
You can use [Azure Cognitive APIs](https://docs.microsoft.com/en-us/azure/cognitive-services/) with Chat client library to add intelligent features. Some of the scenarios that you can achive are : 
1. enable users to chat with each other in different languages. 
2. help a support agent prioritize tickets by detecting a negative sentiment of an incoming issue from a customer
3. analyse the incoming messages for key detection & entity recognition, and prompt relevant info to the user in your app based on the message content.


One of the ways of achieving this is by having your trusted service be a member in the chat thread. Lets say you want to enable lanaguage translation. This service will be responsible for listening to the messages being exchanged by other members, calling cognitive APIs to translate the content to desired language and sending the translated result as a message in the thread. This way, the message history will contain both orignal and translated messages. In the client application, you can add logic to show the original or translated message. See [this quickstart](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/quickstart-translate) to understand how to use Cognitive APIs to translate text to different languages. 

<!--todo: higher res image of this ![CS Architecture Diagram](../../media/chat-cognitive-service.png) -->

## Next steps

> [!div class="nextstepaction"]
> [Get started with chat](../../quickstarts/chat/get-started.md)

The following documents may be interesting to you:

- Familiarize yourself with the [Chat client library](sdk-features.md)
