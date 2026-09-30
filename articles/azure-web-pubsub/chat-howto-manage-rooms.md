---
title: Create and manage rooms
titleSuffix: Azure Web PubSub
description: Create rooms, manage members in Chat for Azure Web PubSub.
author: bjqian
ms.author: biqian
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 06/26/2026
---

# Create and manage rooms

**Rooms** group members and their messages. This article shows how to create rooms and manage who's in
them—from your app with the **client SDK**, or from your server with the **REST API**.

The client SDK snippets assume you already have a connected `client`. See [Get started](chat-quickstart.md)
for how to connect.

## Create a room

Create a room with a title and an optional list of members. The user who creates the room is added
automatically and becomes its **operator**.

```javascript
const room = await client.createRoom("Project Falcon", ["bob", "carol"]);
console.log(`Created room ${room.roomId}`);
```

By default, the service assigns the room ID. To choose your own, pass it in the options:

```javascript
const room = await client.createRoom("Project Falcon", ["bob"], { roomId: "falcon" });
```

A room ID can be 1 to 64 characters, using letters, numbers, underscores, or hyphens.

## Add and remove members

Add a member by user ID. Adding members needs the `room.invite` permission.

```javascript
await client.addUserToRoom(room.roomId, "dave");
```

Remove a member. Removing members needs the `room.remove_user` permission.

```javascript
await client.removeUserFromRoom(room.roomId, "dave");
```

The other members in the room are notified when someone joins or leaves:

```javascript
client.on("member-joined", (event) => console.log(`${event.userId} joined ${event.roomId}`));
client.on("member-left", (event) => console.log(`${event.userId} left ${event.roomId}`));
```

## List a user's rooms

The `rooms` property holds the rooms you belong to:

```javascript
for (const room of client.rooms) {
  console.log(`${room.roomId}: ${room.title}`);
}
```

To react to rooms you join or leave during a session, handle the room events:

```javascript
client.on("room-joined", (event) => console.log(`joined ${event.room.roomId}`));
client.on("room-left", (event) => console.log(`left ${event.roomId}`));
```

To get a single room's details, including its current members, call `getRoomDetail`:

```javascript
const detail = await client.getRoomDetail(room.roomId, { withMembers: true });
console.log(detail.members);
```

## Manage rooms from your server

Your server can manage rooms and members with the Chat REST API, for administrative and backend
workflows. It can create, get, and delete rooms, and add, remove, and list room members. The REST API
isn't a one-to-one match for the client SDK.

For the endpoints, request formats, and authentication, see
[Chat SDKs and REST API](chat-reference-sdk-and-rest.md#rest-api).

## Next steps

> [!div class="nextstepaction"]
> [Send and read messages](chat-howto-messages.md)
