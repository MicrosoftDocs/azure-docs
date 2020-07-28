---
title: Get Started With Chat (JS)
description: TODO
author: gelli  
manager: jken
services: azure-communication-services

ms.author: gelli
ms.date: 06/26/2020
ms.topic: overview
ms.service: azure-communication-services

---


# Get Started With Chat

This quickstart will teach you how to use Azure Communication Services to send chat messages back and forth between two web application clients with the Javascript SDK.

## Prerequisites
Before you get started, make sure to:

> [!div class="checklist"]
> * [Create an Azure Communication Resource](https://review.docs.microsoft.com/en-us/azure/project-spool/quickstarts/create-a-communication-resource?branch=pr-en-us-104477)
> * Install [Node.js](https://nodejs.org)
> * Download the [Acs web chat SDK](https://github.com/Azure/communication-preview/releases/download/0.1.147/acs-chat-client-web-sdk-0.1.147.zip) 



## Installing local npm tarballs
For this quickstart you will need the tarballs for packages: chat, configuration, common

After you've downloaded and unzipped a Release from the communication-preview repo ([here](https://github.com/Azure/communication-preview/releases)) you need to install the contained packages. Run `npm install <package>.tgz` to install a package.

Install `@azure/communication-common ` first because packages need to be installed in dependency order in order to succeed.

Navigate to the installed package in your `node_modules` folder to find a **README.md** for each package that explains usage with examples.

## User Access Tokens
User access tokens enable you to build client applications that directly authenticate to Azure Communication Services. You generate these tokens on your server, pass them back to a client device, and then use them to initialize the Communication Services SDKs. Lear how to generate user access tokens from [User Access Tokens](https://review.docs.microsoft.com/en-us/azure/project-spool/concepts/user-access-tokens?branch=pr-en-us-104477).


## Create the chat client

```Javascript
import { ChatClient } from '@azure/communicationservices-chat';

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
You can subscribe your application to listen for message received events and update the current messages in memory accordingly. 

```Javascript
        const clientOptions = {
            isTestEnv: true,
            signalingDisabled: false
        };

        var chatClient = new ChatClient('chatGatewayUrl', new UserAccessTokenCredential(token), clientOptions);

        chatClient.on("messageReceived", (e) => {
                console.log("Notification messageReceived!");
                //your code here
        });
```

Alternatively you can retrieve chat messages using the `getMessages` method on the chat client at specified intervals (polling). 

```Javascript
let messages = await chatClient.getMessages(threadId);
```

## Add Users to a thread
Once a thread is created, you can then add and remove users from that thread. By adding users, you give them access to be able to send messages to the thred.
You will need to start by getting a new access token and identity for that user. The user will need that access token in order to initialize their chat client.
More information on tokens here: [User Access Tokens](https://review.docs.microsoft.com/en-us/azure/project-spool/concepts/user-access-tokens?branch=pr-en-us-104477)
```Javascript
//Get a new token created for the user. The token response will contain a token and an identity for the user.
let userTokenResponse = await myTokenFunction();

await chatClient.addMembers(Thread_ID, {
    members : [
        {id: USER_ID, displayName: NAME, memberRole: ROLE}
    ]
});

//Pass back to the user the USER_ID and Access Token both of which you get from the User Token Response.

```
## Remove Users from a thread
Similar to above, you can also remove users from a thread. In order to remove, you will need to track the ids of the members you have added.
```Javascript

await chatClient.removeMember(Thread_ID, Memeber_ID);

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
> * Remove Users from a thread

Now you can try the [chat demo sample web application](group-chat-sample) and explore some more advanced features 
