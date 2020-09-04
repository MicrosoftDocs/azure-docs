

## Prerequisites
Before you get started, make sure to:

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- Install [Node.js](https://nodejs.org/en/download/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 recommended).
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](../../create-a-communication-resource.md). You'll need to record your resource **endpoint** for this quickstart.
- Obtain a `User Access Token` to enable the chat client. For details, see [here](../../user-access-tokens.md)

## Setting Up

### Create a new Node.js Application

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

## Object Model 
The following classes and interfaces handle some of the major features of the Azure Communication Services Chat SDK for JavaScript.

| Name                                   | Description                                                                                                                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ChatClient](../../../references/overview.md) | This class is needed for the Chat functionality. You instantiate it with your subscription information, and use it to create, get and delete threads. |
| [ChatThreadClient](../../../references/overview.md) | This class is needed for the Chat Thread functionality. You obtain an instance via the ChatClient, and use it to send/receive/update/delete messages, add/remove/get users, send typing notifications and read receipts, subscribe chat events. |

## Create a Chat Client

To create a chat client in your web app, you'll use the Communications Service endpoint and the access token that was generated as part of pre-requisite steps. User access tokens enable you to build client applications that directly authenticate to Azure Communication Services. Once you generate these tokens on your server, pass them back to a client device. You need to use the `CommunicationUserCredential` class from the `Common SDK` to pass the token to your chat client.

```JavaScript

import { ChatClient } from '@azure/communication-chat';
import { CommunicationUserCredential } from '@azure/communication-common';

// Your unique Azure Communication service endpoint
let endpointUrl = 'https://<RESOURCE_NAME>.communcationservices.azure.com';
let userAccessToken = //Retrieve value from your trusted service

let chatClient = new ChatClient(endpointUrl, new CommunicationUserCredential(userAccessToken));

```

## Get a Chat Thread Client

The `getChatThreadClient` method returns a `chatThreadClient` for a thread that already exists. It can be used for performing operations on the created thread: add members, send message, etc. threadId is the unique ID of the existing chat thread.

```JavaScript

let chatThreadClient = await chatClient.getChatThreadClient(threadId);

```

## Start a Chat Thread

Use the `createThread` method to create a chat thread.

`createThreadRequest` is used to describe the thread request:

- Use `topic` to give a topic to this chat; Topic can be updated after the chat thread is created using the `UpdateThread` function. 
- Use `members` to list the members to be added to the chat thread;

Response for createThread `chatThreadClient` is used to perform operations on the newly created chat thread like adding members to the chat thread, send message, delete message, etc.  It contains a `threadId` property which is the unique ID of the chat thread. 

```Javascript

let createThreadRequest =
{
    topic: 'Preparation for London conference',
    members:
        [
            {
                user: { communicationUserId: '<USER_ID_FOR_JACK>' },
                displayName: 'Jack'
            },
            {
                user: { communicationUserId: '<USER_ID_FOR_GEETA>' },
                displayName: 'Geeta'
            }
        ]
};
let chatThreadClient= await chatClient.createThread(createThreadRequest);
let threadId = chatThreadClient.threadId;

```

## Send Message to a Chat Thread

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

```

## Receive Messages from a Chat Thread

With real-time signaling, you can subscribe to listen for new incoming messages and update the current messages in memory accordingly. For complete list of events you can subscribe to, see event details [here](../../../concepts/chat/concepts.md#real-time-signaling-events).

```JavaScript

chatThreadClient.on("chatMessageReceived", (e) => {
    console.log("Notification chatMessageReceived!");
    // your code here
});

```

Alternatively you can retrieve chat messages by polling the `listMessages` method at specified intervals. 

```JavaScript

let pagedAsyncIterableIterator = await chatThreadClient.listMessages();
let next = await pagedAsyncIterableIterator.next();
while (!next.done) {
    let chatMessage = next.value;
    // your code here
    next = await pagedAsyncIterableIterator.next();
}

```

`listMessages` returns the latest version of the message, including any edits or deletes that happened to the message using `updateMessage` and `deleteMessage`.
For deleted messages `chatMessage.deletedOn` returns a datetime value indicating when that message was deleted. For edited messages, `chatMessage.editedOn` returns a datetime indicating when the message was edited. The original time of message creation can be accessed using `chatMessage.createdOn` which can be used for ordering the messages.

`listMessages` returns different types of messages which can be identified by `chatMessage.type`. These types are:

-`Text`: Regular chat message sent by a thread member.

-`ThreadActivity/TopicUpdate`: System message that indicates the topic has been updated.

-`ThreadActivity/AddMember`: System message that indicates one or more members have been added to the chat thread.

-`ThreadActivity/RemoveMember`: System message that indicates a member has been removed from the chat thread.

For more details, see [Message Types](../../../concepts/chat/concepts.md#message-types).

## Add a user as member to the Chat Thread

Once a chat thread is created, you can then add and remove users from it. By adding users, you give them access to send messages to the chat thread, and add/remove other members. 
Before calling `addMembers` method, ensure that you have acquired a new access token and identity for that user. The user will need that access token in order to initialize their chat client.

`addMembersRequest` describes the request object wherein `members` lists the members to be added to the chat thread;
- `id`, required, is the identity you get for this new user.
- `displayName`, optional, is the display name for the thread member.
- `shareHistoryTime`, optional, is the time from which the chat history is shared with the member. To share history since the inception of the chat thread, set this property to any date equal to, or less than the thread creation time. To share no history previous to when the member was added, set it to the current date. To share partial history, set it to the date of your choice.

```JavaScript

// Get a new token created for the user. The token response will contain a token and an identity for the user.
let userTokenResponse = await myTokenFunction();

let addMembersRequest =
{
    members: [
        {
            user: { communicationUserId: userTokenResponse.identity },
            displayName: NAME,
            shareHistoryTime: TIME
        }
    ]
};

await chatThreadClient.addMembers(addMembersRequest);

```

## Remove User from a Chat Thread

Similar to adding a member, you can remove members from a chat thread. In order to remove, you'll need to track the ids of the members you have added.

Use `removeMember` method where `memberId` is the ID of the member to be removed from the thread.

```JavaScript

await chatThreadClient.removeMember({ communicationUserId: memberId });

```

## Run the code

Use the `node` command to run the code you added to the **start-chat.js** file.

```console

node ./start-chat.js

```
