---
title: Get Started With Chat
description: TODO
author: mikben    
manager: jken
services: azure-project-spool

ms.author: gelli
ms.date: 06/26/2020
ms.topic: overview
ms.service: azure-project-spool

---


# Get Started With Chat

This quickstart will teach you how to use Azure Communication Services to send chat messages back and forth between two web application clients with the Javascript SDK.

## Prerequisites
Before you get started, make sure to:

> [!div class="checklist"]
> * [Create an Azure Communication Resource](https://review.docs.microsoft.com/en-us/azure/project-spool/quickstarts/create-a-communication-resource?branch=pr-en-us-104477)
> * Install [Node.js](https://nodejs.org)
> * Download the [Azure Communication Services - Chat SDK](https://github.com/Azure/communication-preview/releases)


## Install the package
Install the Azure Communication Services Javascript SDK

```bash
npm install @ic3/communicationservices-chat
```


## User Access Tokens
User access tokens enable you to build client applications that directly authenticate to Azure Communication Services. You generate these tokens on your server, pass them back to a client device, and then use them to initialize the Communication Services SDKs. Lear how to generate user access tokens from [User Access Tokens](https://review.docs.microsoft.com/en-us/azure/project-spool/concepts/user-access-tokens?branch=pr-en-us-104477).


## Create the chat client

```Javascript
import { ChatClient } from "@ic3/communicationservices-chat";
// Your unique Azure Communication service endpoint
let endpointUrl = 'https://<RESOURCE_NAME>.communcationservices.azure.com';
let chatClient = new ChatClient(endpointUrl, userAccessToken);
```
For the generation of  the userAccessToken, refer to  [User Access Tokens](https://review.docs.microsoft.com/en-us/azure/project-spool/concepts/user-access-tokens?branch=pr-en-us-104477).

## Create a thread with two users

Use the `createThread` method to create a chat thread.

`createThreadRequest` is used to describe the thread request:

- Use `topic` to give a thread topic;
- Use `isStickyThread` to specify if the thread's members are mutable, sticky thread has an immutable member list, members cannot be added or removed;
- Use `members` to list the thread members to be added to the thread;

`chatThread` is the response returned from creating a thread, it contains an `id` which is the unique ID of the thread.

```Javascript
let createThreadRequest =
{
    topic: 'topic',
    isStickyThread: false,
    members:
        [
            { id: 'AliceMemberId', displayName: 'Alice', memberRole: 'Admin' },
            { id: 'BobMemberId', displayName: 'Bob', memberRole: 'User' }
        ]
};
let chatThread= await chatClient.createThread(createThreadRequest);
let threadId = chatThread.id;
```

## Send a message to the thread

Use `sendMessage` method to sends a message to a thread identified by threadId.

`createMessageRequest` is used to describe the message request:

- Use `content` to provide the chat message content;
- Use `priority` to specify the message priority level, such as 'Normal' or 'High' ;
- Use `senderDisplayName` to specify the display name of the sender;
- Use `clientMessageId` to add a client-specific Id in a numeric unsigned Int64 format, which can be used for client deduping.

`messageResponse` is the response returned from sending a message, it contains an id, which is the unique ID of the message, and a clientMessageId.

```Javascript
let createMessageRequest =
{
    content: 'Hello Bob',
    priority: 'Normal',
    senderDisplayName : 'Alice',
    clientMessageId : 'clientMessageId'
};
let messageResponse = await chatClient.sendMessage(threadId, createMessageRequest);
let messageId = messageResponse.id;
```

## Receive messages from a thread

Currently you can retrieve chat messages using `getMessages` method, and it will require your application to poll ACS.

```Javascript
let messages = await chatClient.getMessages(threadId);
```

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../communication-services-apis-create-account.md#clean-up-resources)
- [Azure CLI](../../communication-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

In this quick start you learned how to:

> [!div class="checklist"]
> * Create a chat client
> * Create a thread with 2 users
> * Send a message to the thread
> * Receive messages from a thread

