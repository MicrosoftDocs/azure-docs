---
title: include file
description: include file
services: azure-communication-services
ms.date: 07/22/2024
ms.topic: include
author: RinaRish
ms.author: ektrishi
ms.service: azure-communication-services
ms.subservice: chat
ms.custom: mode-other
---

## Prerequisites

1.  **Azure Account:** Make sure that your Azure account is active. New users can create a free account at [Microsoft Azure](https://azure.microsoft.com/free/).
2.  **Node.js 18:** Ensure Node.js 18 is installed on your system. Download from [Node.js](https://nodejs.org/en).
3.  **Communication Services Resource:** Set up a [Communication Services Resource](../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp) via your Azure portal and note your connection string.
4.  **Azure CLI:** Follow the instructions to [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows?tabs=azure-cli)..
5.  **User Access Token:** Generate a user access token to instantiate the chat client. You can create one using the Azure CLI as follows:
```console
az communication identity token issue --scope voip --connection-string "yourConnectionString"
```

For more information, see [Use Azure CLI to Create and Manage Access Tokens](../../quickstarts/identity/access-tokens.md?pivots=platform-azcli).


## Installation

### Install the Azure Communication Services Chat SDK

Use the `npm install` command to install the below Communication Services SDKs for JavaScript.

```console
npm install @azure/communication-chat --save
```

The `--save` option lists the library as a dependency in your **package.json** file.


### Remove the Twilio SDK from the project

You can remove the Twilio SDK from your project by uninstalling the package.
```console
npm uninstall twilio-conversations
```

## Object model
The following classes and interfaces handle some of the major features of the Azure Communication Services Chat SDK for JavaScript.

| Name                                   | Description                                                                                                                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ChatClient | This class is needed for the Chat functionality. You instantiate it with your subscription information, and use it to create, get, delete threads, and subscribe to chat events. |
| ChatThreadClient | This class is needed for the Chat Thread functionality. You obtain an instance via the ChatClient, and use it to send/receive/update/delete messages, add/remove/get users, send typing notifications and read receipts. |

### Initialize the Chat Client

#### Twilio
```JavaScript
/* Initialization */
import { Client } from '@twilio/conversations';

const token = await fetch(token_url);
const client = new Client(token);
client.on('stateChanged', (state) => {
  if (state === 'failed') {
    // The client failed to initialize
    return;
  }

  if (state === 'initialized') {
    // Use the client
  }
});
```
#### Azure Communication Services
Similar to Twilio, the first ster is to get an **access token** as well as use the Communications Service **endpoint** that was generated as part of prerequisite steps. Replace those in code.

```JavaScript
import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

// Your unique Azure Communication service endpoint
let endpointUrl = '<replace with your resource endpoint>';
// The user access token generated as part of the pre-requisites
let userAccessToken = '<USER_ACCESS_TOKEN>';

let chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userAccessToken));
console.log('Azure Communication Chat client created!');
```

### Start a chat thread

#### Twilio
This is how you start a chat thread in Twilio Conversations.
Use `FriendlyName` to give human-readable name for this conversation.

```JavaScript
let conversation = await client.createConversation({
    friendlyName: "Testing Chat"
});
await conversation.join();
```

#### Azure Communication Services
Use the `createThread` method to create a chat thread.

`createThreadRequest` is used to describe the thread request:

- Use `topic` to give a topic to this chat. Topics can be updated after the chat thread is created using the `UpdateThread` function.
- Use `participants` to list the participants to be added to the chat thread.

When resolved, `createChatThread` method returns a `CreateChatThreadResult`. This model contains a `chatThread` property where you can access the `id` of the newly created thread. You can then use the `id` to get an instance of a `ChatThreadClient`. The `ChatThreadClient` can then be used to perform operation within the thread such as sending messages or listing participants.

```JavaScript
async function createChatThread() {
  const createChatThreadRequest = {
    topic: "Hello, World!"
  };
  const createChatThreadOptions = {
    participants: [
      {
        id: { communicationUserId: '<USER_ID>' },
        displayName: '<USER_DISPLAY_NAME>'
      }
    ]
  };
  const createChatThreadResult = await chatClient.createChatThread(
    createChatThreadRequest,
    createChatThreadOptions
  );
  const threadId = createChatThreadResult.chatThread.id;
  return threadId;
}
```

### Get a chat thread client

#### Twilio
This is how you get chat thread (conversation) in Twilio.
```JavaScript
if (selectedConversation) {
      conversationContent = (
        <Conversation
          conversationProxy={selectedConversation}
          myIdentity={this.state.name}
        />
      );
    } else if (status !== "success") {
      conversationContent = "Loading your conversation!";
    } else {
      conversationContent = "";
    }
```
#### Azure Communication Services
The `getChatThreadClient` method returns a `chatThreadClient` for a thread that already exists. It can be used for performing operations on the created thread: add participants, send message, etc. threadId is the unique ID of the existing chat thread.

```JavaScript
let chatThreadClient = chatClient.getChatThreadClient(threadId);
console.log(`Chat Thread client for threadId:${threadId}`);

```
Add this code in place of the `<CREATE CHAT THREAD CLIENT>` comment in **client.js**, refresh your browser tab and check the console, you should see:
```console
Chat Thread client for threadId: <threadId>
```

### Add a user as a participant to the chat thread
Once a chat thread is created, you can then add and remove users from it. By adding users, you give them access to send messages to the chat thread, and add/remove other participants.

#### Twilio
This is how you add a participant to a chat thread.
```JavaScript
// add chat participant to the conversation by its identity
await conversation.add('identity');

// adds yourself as a conversations sdk user to this conversation
// use after creating the conversation from the SDK
await conversation.join();

conversation.on('participantJoined', (participant) => {
  // fired when a participant has joined the conversation
});
```

#### Azure Communication Services
Before calling the `addParticipants` method, ensure that you've acquired a new access token and identity for that user. The user will need that access token in order to initialize their chat client.

`addParticipantsRequest` describes the request object wherein `participants` lists the participants to be added to the chat thread;
- `id`, required, is the communication identifier to be added to the chat thread.
- `displayName`, optional, is the display name for the thread participant.
- `shareHistoryTime`, optional, is the time from which the chat history is shared with the participant. To share history since the inception of the chat thread, set this property to any date equal to, or less than the thread creation time. To share no history previous to when the participant was added, set it to the current date. To share partial history, set it to the date of your choice.

```JavaScript

const addParticipantsRequest =
{
  participants: [
    {
      id: { communicationUserId: '<NEW_PARTICIPANT_USER_ID>' },
      displayName: 'Jane'
    }
  ]
};

await chatThreadClient.addParticipants(addParticipantsRequest);

```
Replace **NEW_PARTICIPANT_USER_ID** with a [new user ID](../../identity/access-tokens.md)

### Send a message to a chat thread
Unlike Twilio ACS does not have separate function to send text message or media.

#### Twilio
This is how you send text message in Twilio.
```JavaScript
// Send Text Message
await conversation
  .prepareMessage()
  .setBody('Hello!')
  .setAttributes({foo: 'bar'})
  .build()
  .send();

```
This is how you send media in Twilio.
```JavaScript
 const file =
  await fetch("https://v.fastcdn.co/u/ed1a9b17/52533501-0-logo.svg");
const fileBlob = await file.blob();
// Send a media message
const sendMediaOptions = {
    contentType: file.headers.get("Content-Type"),
    filename: "twilio-logo.svg",
    media: fileBlob
};

await conversation
  .prepareMessage()
  .setBody('Here is some media!')
  .addMedia(sendMediaOptions);

```

#### Azure Communication Services
Use `sendMessage` method to send a message to a thread identified by threadId.

`sendMessageRequest` is used to describe the message request:

- Use `content` to provide the chat message content;

`sendMessageOptions` is used to describe the operation optional params:

- Use `senderDisplayName` to specify the display name of the sender;
- Use `type` to specify the message type, such as 'text' or 'html';
This is how you accomplish the "Media" property in Twilio.
- Use `metadata` optionally to include any other data you want to send along with the message. This field provides a mechanism for developers to extend chat message functionality and add custom information for your use case. For example, when sharing a file link in the message, you might want to add 'hasAttachment: true' in metadata so that recipient's application can parse that and display accordingly. Please refer to the [following tutorial](../file-sharing-tutorial-acs-chat.md).

`SendChatMessageResult` is the response returned from sending a message, it contains an ID, which is the unique ID of the message.

```JavaScript
const sendMessageRequest =
{
  content: 'Please take a look at the attachment'
};
let sendMessageOptions =
{
  senderDisplayName : 'Jack',
  type: 'text',
  metadata: {
    'hasAttachment': 'true',
    'attachmentUrl': 'https://contoso.com/files/attachment.docx'
  }
};
const sendChatMessageResult = await chatThreadClient.sendMessage(sendMessageRequest, sendMessageOptions);
const messageId = sendChatMessageResult.id;
console.log(`Message sent!, message id:${messageId}`);
```

### Receive chat messages from a chat thread
Unlike Twilio ACS does not have separate function to receive text message or media. Azure Communication Services uses Azure Event Grid to handle events. To learn more please refer to [following tutorial](MicrosoftDocs/azure-docs-pr/articles/event-grid/event-schema-communication-services.md)

#### Twilio
This is how you receive text message in Twilio.
```JavaScript
// Receive text message
 let paginator =
  await conversation.getMessages(
    30,0,"backwards"
  );

const messages = paginator.items;
```
This is how you receive media in Twilio.
```JavaScript
// Receive media
// Return all media attachments (possibly empty array), without temporary urls
const media = message.attachedMedia;

// Get a temporary URL for the first media returned by the previous method
const mediaUrl = await media[0].getContentTemporaryUrl();
```

#### Azure Communication Services
With real-time signaling, you can subscribe to listen for new incoming messages and update the current messages in memory accordingly. Azure Communication Services supports a [list of events that you can subscribe to](../../../concepts/chat/concepts.md#real-time-notifications).

```JavaScript
// open notifications channel
await chatClient.startRealtimeNotifications();
// subscribe to new notification
chatClient.on("chatMessageReceived", (e) => {
  console.log("Notification chatMessageReceived!");
  // your code here
});

```

Alternatively you can retrieve chat messages by polling the `listMessages` method at specified intervals.

```JavaScript

const messages = chatThreadClient.listMessages();
for await (const message of messages) {
   // your code here
}

```
`listMessages` returns different types of messages that can be identified by `chatMessage.type`. 

For more details, see [Message Types](../../../concepts/chat/concepts.md#message-types).


#### Subscribe to connection status of real time notifications
Similar to Twilio Azure Communication Services allows to subscribe to event notifications.

Subscription to events `realTimeNotificationConnected` and `realTimeNotificationDisconnected` allows you to know when the connection to the call server is active.

```JavaScript
// subscribe to realTimeNotificationConnected event
chatClient.on('realTimeNotificationConnected', () => {
  console.log("Real time notification is now connected!");
  // your code here
});
// subscribe to realTimeNotificationDisconnected event
chatClient.on('realTimeNotificationDisconnected', () => {
  console.log("Real time notification is now disconnected!");
  // your code here
});
```
