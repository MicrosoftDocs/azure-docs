---
title: Azure Web PubSub chat hub tutorial
description: A tutorial that shows how to build a real-time chat application using Azure Web PubSub chat hub. It walks through both the server-side negotiate flow and the client-side API, explaining why each step is required.
author: kevinguo-ed
ms.author: kevinguo
ms.service: azure-web-pubsub
ms.topic: quickstart
ms.date: 07/20/2026
---

# Tutorial: Build a simple chat app with a chat hub

In this tutorial, you build a simple real-time chat flow using a Web PubSub chat hub.

You:

* Set up a backend server to issue client access URLs
* Connect clients to a Web PubSub chat hub
* Create a room
* Send and receive messages
* Manage room membership

By the end, you have a working chat experience backed by Azure Web PubSub.

## Prerequisites

* An Azure subscription
* Node.js 18 or later

## Create a Web PubSub resource with a chat hub

Create an Azure Web PubSub resource and configure a chat hub named `demo-chat`.

## Install dependencies

### Server dependencies

```bash
npm install express @azure/web-pubsub @azure/web-pubsub-express
```

### Client dependencies

```bash
npm install @azure/web-pubsub-chat-client @azure/web-pubsub-client
```

## Step 1: Create the backend server

The backend server is responsible for:

* Authenticating users
* Issuing client access URLs

### Server code

```javascript
import express from 'express';
import { WebPubSubServiceClient } from '@azure/web-pubsub';
import { WebPubSubEventHandler } from '@azure/web-pubsub-express';

const hubName = 'demo-chat';
const port = process.env.PORT || 3000;

const connectionString = process.env.WEB_PUBSUB_CONNECTION_STRING;
if (!connectionString) {
  throw new Error('WEB_PUBSUB_CONNECTION_STRING is not set');
}

const app = express();

const serviceClient = new WebPubSubServiceClient(
  connectionString,
  hubName,
  { allowInsecureConnection: true }
);

```

### Why this step exists

Although the Web PubSub service supports anonymous connections, the most common production pattern uses a **server-issued access model**.

Your server generates a **time-limited client access URL** that encodes the user identity and permissions. This approach:

* Keeps credentials secure
* Allows your app to control authentication and authorization
* Aligns with enterprise security expectations


## Step 2: Add a negotiate endpoint

The negotiate endpoint returns a client access URL that chat clients use to connect.

```javascript
app.get('/negotiate', async (req, res) => {
  console.log(`received negotiate request: ${JSON.stringify(req.query)}`);

  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).send('Missing userId');
  }

  const token = await serviceClient.getClientAccessToken({
    userId,
  });

  res.json({
    url: token.url,
  });
});
```

### Why this step exists

**Chat clients must connect as a specific user.**

The negotiate endpoint is where your application:

* Maps app-level identity to a chat user
* Issues a scoped, temporary access URL
* Decides who is allowed to connect

In production, this endpoint typically:

* Verifies authentication (cookies, headers, tokens)
* Enforces authorization rules


## Step 3: Start the server

```javascript
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  console.log(`Event handler path: ${handler.path}`);
});
```

Your backend is now ready to accept client connections.


## Step 4: Connect clients to the chat hub

On the client, fetch access URLs from the server and log in to the `demo-chat` hub.

```javascript
import { ChatClient } from '@azure/web-pubsub-chat-client';
import { WebPubSubClient } from '@azure/web-pubsub-client';

// Get client access URL for Alice
const aliceUrl = await fetch('/negotiate?userId=alice')
  .then(r => r.json())
  .then(d => d.url);

const aliceWpsClient = await ChatClient.start(aliceUrl);
console.log(`Started as: ${aliceWpsClient.userId}`);

// Get client access URL for Charlie
const charlieUrl = await fetch('/negotiate?userId=charlie')
  .then(r => r.json())
  .then(d => d.url);

const charlieWpsClient = await ChatClient.start(charlieUrl);
console.log(`Started as: ${charlieWpsClient.userId}`);
```

### Why this step exists

The Web PubSub chat hub builds on the Web PubSub connection model. This authentication step:

* Establishes a real-time connection
* Associates the connection with a user identity
* Enables chat-specific features such as rooms and message history

## Step 5: Listen for chat events

Register listeners to receive real-time updates.

```javascript
alice.addListenerForNewMessage((notification) => {
  const msg = notification.message;
  console.log(`Alice received: ${msg.createdBy}: ${msg.content.text}`);
});

alice.addListenerForNewRoom((room) => {
  console.log(`Alice joined room: ${room.title}`);
});

charlie.addListenerForNewMessage((notification) => {
  const msg = notification.message;
  console.log(`Charlie received: ${msg.createdBy}: ${msg.content.text}`);
});

charlie.addListenerForNewRoom((room) => {
  console.log(`Charlie joined room: ${room.title}`);
});
```

### Why this step exists

Chat is inherently event-driven. These listeners allow your application to:

* React to incoming messages
* Update the UI when users join rooms
* Stay synchronized across multiple devices or browser tabs

## Step 6: Create a room and send messages

Create a room and add initial members:

```javascript
const room = await alice.createRoom('My Room', ['charlie']);
```

Send a message to the room:

```javascript
await alice.sendToRoom(room.roomId, 'Hello!');
```

Messages are delivered in real time to all room members.

### Why this step exists

Rooms provide structure for chat:

* They define who receives messages.
* They maintain message history.
* They allow chat to scale beyond one-to-one messaging.

## Step 7: Get message history

Retrieve previous messages from a room:

```javascript
const history = await alice.listRoomMessage(room.roomId, null, null);
```

### Why this step exists

Newly connected clients often need context.

Message history allows your app to:

* Render existing messages
* Resume chat after reconnects
* Support multi-device usage

## Step 8: Manage room members

Add a user to a room:

```javascript
await alice.addUserToRoom(room.roomId, 'bob');
```

Remove a user from a room:

```javascript
await alice.removeUserFromRoom(room.roomId, 'bob');
```

Membership changes take effect immediately.

## Step 9: Clean up

When the client no longer needs to receive messages:

```javascript
alice.stop();
charlie.stop();
```

## What you built

In this quickstart, you:

* Issued secure client access URLs from a server
* Connected clients to a chat hub
* Created and joined chat rooms
* Sent and received messages in real time
* Loaded message history
* Managed room membership

All without managing WebSocket servers, fan-out logic, or message persistence.
