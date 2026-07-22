---
title: Configure roles and permissions
titleSuffix: Azure Web PubSub
description: Assign roles and create custom permission sets for Chat in Azure Web PubSub.
author: bjqian
ms.author: biqian
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 06/26/2026
---

# Configure roles and permissions

You configure roles and permissions through the **Chat REST API**, from your server. This article
covers the permissions, built-in roles, and the rules for assigning and creating roles.

> [!NOTE]
> The client SDK doesn't manage roles directly. Clients should interact with your server, and your server
> manages roles through the Chat REST API.

For the endpoints, request formats, and authentication, see
[Chat SDKs and REST API](chat-reference-sdk-and-rest.md#rest-api). 

## Permissions

Chat defines two kinds of permissions: **user permissions** and **room permissions**. The following
tables list the built-in permissions you assign to roles.

### User permissions

| Permission | Allows |
|------------|--------|
| `user.create_room` | Create rooms |
| `user.fetch_all_rooms` | List the rooms they belong to |

### Room permissions

| Permission | Allows |
|------------|--------|
| `room.publish_message` | Send messages |
| `room.history` | Read message history |
| `room.invite` | Add members |
| `room.remove_user` | Remove members |

## Roles

A role is a named set of permissions, and comes in two kinds:

- A **user role** applies to a user across the whole chat. Its name starts with `user.`, and you assign
  it to a user.
- A **room role** applies to a user within a single room. Its name starts with `room.`. Assigning a room role is also how you promote a member to operator.

### Built-in roles

Chat ships with one built-in user role and two built-in room roles. Use them as they are, or override a
built-in role by creating a [custom role](#custom-roles) with the same name.

The built-in **user role**, assigned to every user automatically the first time they sign in:

| Role | Permissions |
|------|-------------|
| `user.normal` | `user.create_room`, `user.fetch_all_rooms` |

The built-in **room roles**. When a user creates a room, they become its **operator**. Users added to
the room are **members**. An operator can do everything a member can, plus manage the room.

| Permission | Member (`room.member`) | Operator (`room.operator`) |
|------------|:---:|:---:|
| Send messages (`room.publish_message`) | ✓ | ✓ |
| Read history (`room.history`) | ✓ | ✓ |
| Add members (`room.invite`) | ✓ | ✓ |
| Remove members (`room.remove_user`) | — | ✓ |

### Custom roles

You can define your own role with the permissions you choose. The name must start with `user.` or
`room.`, and all its permissions must match that kind: a user role holds only user permissions, and a
room role holds only room permissions.