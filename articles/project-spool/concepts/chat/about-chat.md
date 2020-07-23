---
title: About Chat
description: TODO
author: mikben    
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-project-spool

---

# About Chat

Chat is one of the multiple communication modalities being offered as part of Azure Communication Services. Use Chat APIs to enrich your line of business applications and customer support. Enjoy the performance and reliability offered by the platform that powers Skype & Teams - without the overhead of building and managing the infrastructure yourself.  

Features available in Private Preview:  

- Text based 1:1 or group chat. 
- Add/remove members 
- Set custom titles/topic to chats.  
- Edit/delete messages 
- Get notified when other chat members are typing in near real time.  
- Get read receipts for your sent messages.  
- Be notified of incoming messages when the app is active – no need to poll for new messages!  
- Add emojis to your conversation – unicode emojis supported.  
- Set priority for important messages at the time of composing the message. 
- Enable users to chat in different languages by integrating with Azure Cognitive services for language translation.  

The Chat SDK will available for multiple platforms, starting with Web this July.  

## Get Started

To send a message, you'll need:  

- An ACS resource. Check this quickstart on how to create one. [Link] 
- The Core SDK to get user auth tokens. This quickstart shows how. [Link]  
- The Chat SDK for the language you need from here. [Link] 

See this tutorial [Link] for a step by step guide with code samples on how to get started and send your first message. If you want to dig deeper and see what the SDK has to offer, explore our APIs in this reference doc. [Link] 


## Concepts

### Threads

A chat conversation is represented by a thread. Each user in the thread is a called member. Users can give a friendly name to group chat. Message history is stored until the thread is deleted using the DeleteThread API. To keep an inventory in your system, call GetMessages API before you delete the thread.   

Note: It is strongly advised to not use customer or production data while in preview. At the end of private preview, all customer generated data will be deleted. 

### Messages

#### Operations
The Chat API supports creating, editing, deleting & retrieval of messages. All messages are stamped with OriginalArrivalTime property that can be used to identify the order of incoming messages for a client.  

1. SendMessage creates a message and stamps it with a server generated MessageId – which is different than the client provided ClientMessageId. If the app logic is to retry failed messages immediately, there is a possibility of two different copies of message being created on the server due to request timeout or loss of connection. The two copies can be de-duplicated by looking for the ClientMessageId which will be the same.  

2. Edit & Delete operations work on the original message, updating message properties, such as ‘content’, ‘editTime’, ‘deleteTime’ and ‘version’. The latest copy of the message to display can be identified by looking at the value of ‘version’ property. 

#### Types

Up to this point, we've been talking about the user generated messages that a chat thread is composed of. ACS also exposes system generated messages called Thread Activities that are not part of the actual body of conversation between users but rather signify updates to a thread and can be used by developers to display more context in a chat thread. Eg Display exactly after which message was a user  added or removed from a group chat. Thread activities are part of thread’s message history and can be retrieved by calling GetMessages API. Supported message types:  

1. Text: Actual message composed and sent by user as part of chat conversation. 

2. ThreadActivity/AddMember: When a member is added to/joins a thread.  

3. ThreadActivity/RemoveMember: When a member leaves or is removed from a thread. 

4. ThreadActivity/TopicUpdate: When a topic for group chat is updated.  


### Events

If a user is active on their app, no need to poll for new messages. With Chat SDK, we deliver events directly to clients and provide support to register callbacks that will be executed whenever a new event is received. Currently, the events supported are:  

1. New Message: when user gets a new message. 

2. Typing Indicator - when another user is actively typing out a message in a thread that user is part of. 

3. Read Receipts – when the recipient of message has read user’s message.   

Events for edit and delete operations on messages is not available currently, so regularly poll for the list of messages at a predefined interval, to get edits and updates from other clients.  

For event properties and how to register callbacks, check out the API documentation.  
