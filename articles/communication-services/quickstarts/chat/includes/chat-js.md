---
title: include file
description: include file
services: azure-communication-services
author: mikben
manager: mikben
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 9/1/2020
ms.topic: include
ms.custom: include file
ms.author: mikben
---

## Prerequisites
Before you get started, make sure to:

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- Install [Node.js](https://nodejs.org/en/download/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 recommended).
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](../../create-communication-resource.md). You'll need to record your resource **endpoint** for this quickstart.
- A [User Access Token](../../access-tokens.md). Be sure to set the scope to "chat", and note the token string as well as the userId string.

## Setting up

### Create a new web application

First, open your terminal or command window create a new directory for your app, and navigate to it.

```console
mkdir chat-quickstart && cd chat-quickstart
```
   
Run `npm init -y` to create a **package.json** file with default settings.

```console
npm init -y
```

Use a text editor to create a file called **start-chat.js** in the project root directory. You'll add all the source code for this quickstart to this file in the following sections.

### Install the packages

Use the `npm install` command to install the below Communication Services client libraries for JavaScript.

```console
npm install @azure/communication-common --save

npm install @azure/communication-administration --save

npm install @azure/communication-signaling --save

npm install @azure/communication-chat --save

```

The `--save` option lists the library as a dependency in your **package.json** file.

### Set up the app framework

This quickstart uses webpack to bundle the application assets. Run the following command to install the webpack, webpack-cli and webpack-dev-server npm packages and list them as development dependencies in your **package.json**:

```console
npm install webpack webpack-cli webpack-dev-server --save-dev
```

Create an **index.html** file in the root directory of your project. We'll use this file as a template to add chat capability using the Azure Communication Chat client library for JavaScript.

Here is the code:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Communication Client - Chat Sample</title>
  </head>
  <body>
    <h4>Azure Communication Services</h4>
    <h1>Chat Quickstart</h1>
    <script src="./bundle.js"></script>
  </body>
</html>
```
Create a file in the root directory of your project called **client.js** to contain the application logic for this quickstart. 

### Create a chat client

To create a chat client in your web app, you'll use the Communications Service endpoint and the access token that was generated as part of pre-requisite steps. User access tokens enable you to build client applications that directly authenticate to Azure Communication Services. Once you generate these tokens on your server, pass them back to a client device. You need to use the `AzureCommunicationUserCredential` class from the `Common client library` to pass the token to your chat client.

Create a **client.js** file in the root directory of your project. We'll use this file to add chat capability using the Azure Communication Chat client library for JavaScript.

```JavaScript

import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationUserCredential } from '@azure/communication-common';

// Your unique Azure Communication service endpoint
let endpointUrl = 'https://<RESOURCE_NAME>.communication.azure.com';
let userAccessToken = '<USER_ACCESS_TOKEN>';

let chatClient = new ChatClient(endpointUrl, new AzureCommunicationUserCredential(userAccessToken));
console.log('Azure Communication Chat client created!');
```
Replace **ENDPOINT** with the one created before based on the [Create an Azure Communication Resource](../../create-communication-resource.md) documentation.
Replace **USER_ACCESS_TOKEN** with a token issued based on the [User Access Token](../../access-tokens.md) documentation.
Add this code to **client.js** file


### Run the code
Use the `webpack-dev-server` to build and run your app. Run the following command to bundle application host in on a local webserver:
```console
npx webpack-dev-server --entry ./client.js --output bundle.js --debug --devtool inline-source-map
```
Open your browser and navigate to http://localhost:8080/.
In the developer tools console within your browser you should see following:

```console
Azure Communication Chat client created!
```

## Object model 
The following classes and interfaces handle some of the major features of the Azure Communication Services Chat client library for JavaScript.

| Name                                   | Description                                                                                                                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ChatClient | This class is needed for the Chat functionality. You instantiate it with your subscription information, and use it to create, get and delete threads. |
| ChatThreadClient | This class is needed for the Chat Thread functionality. You obtain an instance via the ChatClient, and use it to send/receive/update/delete messages, add/remove/get users, send typing notifications and read receipts, subscribe chat events. |


## Start a chat thread

Use the `createThread` method to create a chat thread.

`createThreadRequest` is used to describe the thread request:

- Use `topic` to give a topic to this chat; Topic can be updated after the chat thread is created using the `UpdateThread` function. 
- Use `members` to list the members to be added to the chat thread;

When resolved, `createChatThread` method returns `threadId` which is used to perform operations on the newly created chat thread like adding members to the chat thread, sending messages, deleting message, etc.

```Javascript
async function createChatThread() {
   let createThreadRequest = {
       topic: 'Preparation for London conference',
       members: [{
                   user: { communicationUserId: '<USER_ID_FOR_JACK>' },
                   displayName: 'Jack'
               }, {
                   user: { communicationUserId: '<USER_ID_FOR_GEETA>' },
                   displayName: 'Geeta'
               }]
   };
   let chatThreadClient= await chatClient.createChatThread(createThreadRequest);
   let threadId = chatThreadClient.threadId;
   return threadId;
}

createChatThread().then(async threadId => {
   console.log(`Thread created:${threadId}`);
   // PLACEHOLDERS
   // <CREATE CHAT THREAD CLIENT>
   // <RECEIVE A CHAT MESSAGE FROM A CHAT THREAD>
   // <SEND MESSAGE TO A CHAT THREAD>
   // <LIST MESSAGES IN A CHAT THREAD>
   // <ADD NEW MEMBER TO THREAD>
   // <LIST MEMBERS IN A THREAD>
   // <REMOVE MEMBER FROM THREAD>
});
```

Replace **USER_ID_FOR_JACK** and **USER_ID_FOR_GEETA** with the user ids obtained from the previous step ( Create users and issue [User Access Tokens](../../access-tokens.md))

When you refresh your browser tab you should see the following in the console
```console
Thread created: <threadId>
```

## Get a chat thread client

The `getChatThreadClient` method returns a `chatThreadClient` for a thread that already exists. It can be used for performing operations on the created thread: add members, send message, etc. threadId is the unique ID of the existing chat thread.

```JavaScript

let chatThreadClient = await chatClient.getChatThreadClient(threadId);
console.log(`Chat Thread client for threadId:${chatThreadClient.threadId}`);

```
Add this code in place of the `<CREATE CHAT THREAD CLIENT>` comment in **client.js**, refresh your browser tab and check the console, you should see:
```console
Chat Thread client for threadId: <threadId>
```

## Send a message to a chat thread

Use `sendMessage` method to send a chat message to the thread you just created, identified by threadId.

`sendMessageRequest` describes the required fields of chat message request:

- Use `content` to provide the chat message content;

`sendMessageOptions` describes the optional fields of chat message request:

- Use `priority` to specify the chat message priority level, such as 'Normal' or 'High'; this property can be used to have UI indicator for the recipient user in your app to bring attention to the message or execute custom business logic.   
- Use `senderDisplayName` to specify the display name of the sender;

The response `sendChatMessageResult` contains an "id", which is the unique ID of that message.

```JavaScript

let sendMessageRequest =
{
    content: 'Hello Geeta! Can you share the deck for the conference?'
};
let sendMessageOptions =
{
    priority: 'Normal',
    senderDisplayName : 'Jack'
};
let sendChatMessageResult = await chatThreadClient.sendMessage(sendMessageRequest, sendMessageOptions);
let messageId = sendChatMessageResult.id;
console.log(`Message sent!, message id:${messageId}`);

```
Add this code in place of the `<SEND MESSAGE TO A CHAT THREAD>` comment in **client.js**, refresh your browser tab and check the console.
```console
Message sent!, message id:<number>
```

## Receive chat messages from a chat thread

With real-time signaling, you can subscribe to listen for new incoming messages and update the current messages in memory accordingly. Azure Communication Services supports a [list of events that you can subscribe to](../../../concepts/chat/concepts.md#real-time-signaling).

```JavaScript
// open notifications channel
await chatClient.startRealtimeNotifications();
// subscribe to new notification
chatClient.on("chatMessageReceived", (e) => {
    console.log("Notification chatMessageReceived!");
    // your code here
});

```
Add this code in place of `<RECEIVE A CHAT MESSAGE FROM A CHAT THREAD>` comment in **client.js**.
Refresh your browser tab, you should see in the console a message `Notification chatMessageReceived`;

Alternatively you can retrieve chat messages by polling the `listMessages` method at specified intervals. 

```JavaScript

let pagedAsyncIterableIterator = await chatThreadClient.listMessages();
let nextMessage = await pagedAsyncIterableIterator.next();
 while (!nextMessage.done) {
     let chatMessage = nextMessage.value;
     console.log(`Message :${chatMessage.content}`);
     // your code here
     nextMessage = await pagedAsyncIterableIterator.next();
 }

```
Add this code in place of the `<LIST MESSAGES IN A CHAT THREAD>` comment in **client.js**.
Refresh your tab, in the console you should find list of messages sent in this chat thread.


`listMessages` returns the latest version of the message, including any edits or deletes that happened to the message using `updateMessage` and `deleteMessage`.
For deleted messages `chatMessage.deletedOn` returns a datetime value indicating when that message was deleted. For edited messages, `chatMessage.editedOn` returns a datetime indicating when the message was edited. The original time of message creation can be accessed using `chatMessage.createdOn` which can be used for ordering the messages.

`listMessages` returns different types of messages which can be identified by `chatMessage.type`. These types are:

- `Text`: Regular chat message sent by a thread member.

- `ThreadActivity/TopicUpdate`: System message that indicates the topic has been updated.

- `ThreadActivity/AddMember`: System message that indicates one or more members have been added to the chat thread.

- `ThreadActivity/RemoveMember`: System message that indicates a member has been removed from the chat thread.

For more details, see [Message Types](../../../concepts/chat/concepts.md#message-types).

## Add a user as member to the chat thread

Once a chat thread is created, you can then add and remove users from it. By adding users, you give them access to send messages to the chat thread, and add/remove other members. 
Before calling `addMembers` method, ensure that you have acquired a new access token and identity for that user. The user will need that access token in order to initialize their chat client.

`addMembersRequest` describes the request object wherein `members` lists the members to be added to the chat thread;
- `user`, required, is the communication user to be added to the chat thread.
- `displayName`, optional, is the display name for the thread member.
- `shareHistoryTime`, optional, is the time from which the chat history is shared with the member. To share history since the inception of the chat thread, set this property to any date equal to, or less than the thread creation time. To share no history previous to when the member was added, set it to the current date. To share partial history, set it to the date of your choice.

```JavaScript

let addMembersRequest =
{
    members: [
        {
            user: { communicationUserId: '<NEW_MEMBER_USER_ID>' },
            displayName: 'Jane'
        }
    ]
};

await chatThreadClient.addMembers(addMembersRequest);

```
Replace **NEW_MEMBER_USER_ID** with a [new user Id](../../access-tokens.md)
Add this code in place of the `<ADD NEW MEMBER TO THREAD>` comment in **client.js**

## List users in a chat thread
```JavaScript
async function listThreadMembers() {
   let pagedAsyncIterableIterator = await chatThreadClient.listMembers();
   let next = await pagedAsyncIterableIterator.next();
   while (!next.done) {
      let user = next.value;
      console.log(`User :${user.displayName}`);
      next = await pagedAsyncIterableIterator.next();
   }
}
await listThreadMembers();
```
Add this code in place of the `<LIST MEMBERS IN A THREAD>` comment in **client.js**, refresh your browser tab and check the console, you should see information about users in a thread.

## Remove user from a chat thread

Similar to adding a member, you can remove members from a chat thread. In order to remove, you'll need to track the ids of the members you have added.

Use `removeMember` method where `member` is the communication user to be removed from the thread.

```JavaScript

await chatThreadClient.removeMember({ communicationUserId: <MEMBER_ID> });
await listThreadMembers();
```
Replace **MEMBER_ID** with a User ID used in the previous step (<NEW_MEMBER_USER_ID>).
Add this code in place of the `<REMOVE MEMBER FROM THREAD>` comment in **client.js**,
