---
title: Send and read messages
titleSuffix: Azure Web PubSub
description: Send messages, mention users, and read message history in Chat for Azure Web PubSub.
author: bjqian
ms.author: biqian
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 06/26/2026
---

# Send and read messages

This article shows how to send messages to a room and read its history with the **client SDK**. From
your server, you can also read, edit, and delete messages with the **REST API**.

The client SDK snippets assume you already have a connected `client`. See [Get started](chat-quickstart.md)
for how to connect.

## Subscribe to messages

Handle the `message` event to receive messages in real time. It fires for new messages in the rooms
you belong to, **including the ones you send**.

```javascript
client.on("message", (event) => {
  const message = event.message;
  console.log(`[${event.roomId}] ${message.createdBy}: ${message.content.text}`);
});
```

The handler only delivers messages that arrive after you subscribe, so register it before you send.
It doesn't replay earlier messages; to load those, read the [message history](#read-message-history).

## Send a message

Send a text message to a room with `sendToRoom`. It returns the new message's ID. The max size of the message content is **64KB**.

```javascript
const result = await client.sendToRoom(room.roomId, "Hello, team!");
console.log(`Sent message ${result.messageId}`);
```

## Read message history

Read a room's past messages with `listRoomMessages`. It returns an async iterator that pages through
the room's history for you.

```javascript
for await (const message of client.listRoomMessages(room.roomId)) {
  console.log(`${message.createdBy}: ${message.content.text}`);
}
```

To control paging yourself, for example to load more messages as the user scrolls, use `byPage`.
Each page is an array of messages.

```javascript
const pages = client.listRoomMessages(room.roomId).byPage({ maxPageSize: 50 });
for await (const page of pages) {
  for (const message of page) {
    console.log(`${message.createdBy}: ${message.content.text}`);
  }
}
```

To read a range, pass `startId` or `endId`. Both are message IDs.

```javascript
const messages = client.listRoomMessages(room.roomId, { startId: "<message-id>" });
```

## Manage messages from your server

Your server can work with message history through the Chat REST API, for moderation, auditing, and
other backend tasks. It can read, edit, and delete messages.

> [!NOTE]
> Messages belong to a *conversation* (each room has a default one), so the message endpoints take a
> conversation ID rather than a room ID. Get a room's default conversation from its `defaultConversation`
> property, returned when you get the room through the REST API.

For the endpoints, request formats, and authentication, see
[Chat SDKs and REST API](chat-reference-sdk-and-rest.md#rest-api).

## Next steps

> [!div class="nextstepaction"]
> [Chat SDKs and REST API](chat-reference-sdk-and-rest.md)
