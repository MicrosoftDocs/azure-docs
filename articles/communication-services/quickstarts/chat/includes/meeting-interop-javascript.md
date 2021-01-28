---
title: Quickstart - Join a Teams meeting
author: askaur
ms.author: askaur
ms.date: 12/08/2020
ms.topic: quickstart
ms.service: azure-communication-services
---

## Join the meeting chat 

Once Teams interoperability is enabled, a Communication Services user can join the Teams call as a guest user using the calling client library. Joining the call will add them as a participant to the meeting chat as well, where they can send and receive messages with other users on the call. The user will not have access to chat messages that were sent before they joined the call. 

## Get a Teams meeting chat thread for a Communication Services user

First, instantiate a `ChatThreadClient` for the meeting chat thread. Parse the meeting link or use the Graph APIs with the meeting ID to get the thread ID. 

- A Teams meeting link looks like this: `https://teams.microsoft.com/l/meetup-join/meeting_chat_thread_id/1606337455313?context=some_context_here`. The thread ID will be where `meeting_chat_thread_id` is in that link. 
- If you have the meeting ID, you can use [Graph API](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta) to get the thread ID. The [GET API](/graph/api/onlinemeeting-get?tabs=http%22+%5c&view=graph-rest-beta) response will have a `chatInfo` object that contains the `threadID`. 

Once you have the chat thread ID, you can get chat thread client using JavaScript chat client library: 

```javascript
let chatThreadClient = await chatClient.getChatThreadClient(threadId); 

console.log(`Chat Thread client for threadId:${chatThreadClient.threadId}`); 
```
  
The `chatThreadClient` can be used to list members in the chat thread, get chat history, and send messages.  

## Send and receive messages  

Use the `SendMessage` to send a message to the meeting chat. For receiving incoming messages, the ability to subscribe to events like `chatMessageReceived` is not supported as real-time signaling is not yet enabled for this scenario. To get the latest messages, you can poll the `ListMessages` API. For the interoperability scenario, the `ListMessages` API now supports returning three new message types:
- `RichText/HTML`
- `ThreadActivity/MemberJoined`
- `ThreadActivity/MemberLeft` </br>

For more info on message types, see [here](../../../concepts/chat/concepts.md). 

**Note** - Currently only sending and receiving messages is supported for interoperability scenarios with Teams. Other features like typing indicators and Communication Services users adding or removing other users from the Teams meeting are not yet supported.  

