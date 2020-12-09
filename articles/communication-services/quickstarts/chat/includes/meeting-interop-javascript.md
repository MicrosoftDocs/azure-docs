---
title: Quickstart - Join a Teams meeting
author: askaur
ms.author: askaur
ms.date: 12/08/2020
ms.topic: quickstart
ms.service: azure-communication-services
---

## Join the meeting chat 

Once Teams interoperability is enabled and the pre-requisites are completed, an ACS user, Malini can join the Teams call as a guest user, using the calling SDK (pre-requisite #2). Joining the call will add her as a participant to the meeting chat as well and from here on, she can access the meeting chat, send and receive messages with other users on the call. Malini wont be able to see the chat history, if any, before she joined the call. 

## Get meeting chat thread for ACS user 

To show the meeting chat history to Malini in your chat app and enable her to send messages, you will first need to instantiate `ChatThreadClient` for the meeting chat thread. Parse the meeting link or use Graph APIs with meeting ID to get thread ID.  

- Sample meeting link https://teams.microsoft.com/l/meetup-join/meeting_chat_thread_id/1606337455313?context=some_context_here
where thread id will be populated in place of `meeting_chat_thread_id`. 
- If you have the meeting ID, you can use [Graph API](https://docs.microsoft.com/en-us/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta) to get the thread ID. The [GET API](https://docs.microsoft.com/en-us/graph/api/onlinemeeting-get?view=graph-rest-beta&tabs=http%22%20%5C) response will have `chatInfo` object which contains `threadID`. 

Once you have the chat thread id, you can get chat thread client using Javascript chat SDK, like below. 

```javascript
let chatThreadClient = await chatClient.getChatThreadClient(threadId); 

console.log(`Chat Thread client for threadId:${chatThreadClient.threadId}`); 
```
  
ChatThreadClient can be used to list members in the chat thread, get chat history, send messages.  

## Send & receive messages  

Use the `SendMessage` to send a message to the meeting chat. For receiving incoming messages, ACS user wont be able to subscribe to events like `chatMessageReceived` as real time signaling is not yet supported for this scenario. To get latest messages, poll the `ListMessages` API. For Interoperability scenario, ListMessages API now supports returning 3 new message types:
- `RichText/HTML`
- `ThreadActivity/MemberJoined`
- `ThreadActivity/MemberLeft` </br>
For more info on message types, see [here](../../../concepts/chat/concepts.md). 

**Note** - Currently only sending and receiving messages is supported for interoperability scenarios with Teams. Other features like typing indicators, ACS user being able to add or remove other users from the Teams meeting are not supported yet.  

 
