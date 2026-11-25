---
title: Azure Web PubSub chat error codes
titleSuffix: Azure Web PubSub
description: Reference for error codes in Azure Web PubSub chat.
author: bjqian
ms.author: biqian
ms.service: azure-web-pubsub
ms.topic: reference
ms.date: 06/26/2026
---

# Chat error codes

When a chat operation fails, the service returns an error with a `code`. This page lists the codes by
area.

In the client SDK, the code is on `ChatError.code` (the SDK also defines a few client-side codes; see
the [Chat client SDK on GitHub](https://github.com/Azure/azure-webpubsub/tree/main/sdk/webpubsub-chat-client)).
In the REST API, it's the `code` in the error response. The service can add codes in newer versions,
so handle unknown codes too.

## General errors

| Code | When it occurs |
|------|----------------|
| `NoAnonymous` | An anonymous connection tried to use chat. A user ID is required. |
| `InvalidRequest` | The request was malformed. |
| `UnsupportedOperation` | The requested operation isn't supported. |
| `StorageUnavailable` | The chat storage is temporarily unavailable. |
| `UnsupportedMessageFormat` | The message format isn't supported. |
| `InternalError` | An unexpected server error occurred. |

## User errors

| Code | When it occurs |
|------|----------------|
| `InvalidUserId` | The user ID has invalid characters or is too long. |
| `LoginRequired` | The operation requires the user to be signed in. |
| `DuplicatedLogin` | The user is already signed in. |
| `UserNotFound` | The user doesn't exist. |
| `FailedInitializeUser` | The service couldn't initialize the user. |

## Room errors

| Code | When it occurs |
|------|----------------|
| `RoomNotFound` | The room doesn't exist. |
| `RoomAlreadyExists` | A room with that ID already exists. |
| `UserNotInRoom` | The user isn't a member of the room. |
| `UserAlreadyInRoom` | The user is already a member of the room. |
| `NoPermissionCreateRoom` | The user can't create rooms. |
| `NoPermissionInRoom` | The user lacks permission for the action in the room. |
| `FailedCreateRoom` | The service couldn't create the room. |
| `FailedManageRoomMember` | The service couldn't add or remove the member. |

## Conversation errors

| Code | When it occurs |
|------|----------------|
| `InvalidConversationId` | The conversation ID is invalid. |

## Message errors

| Code | When it occurs |
|------|----------------|
| `FailedSendMessage` | The service couldn't send the message. |
| `MessageNotFound` | The message doesn't exist in the conversation. |
| `InvalidMessageId` | The message ID is invalid. |

## Next steps

> [!div class="nextstepaction"]
> [Chat SDKs and REST API](chat-reference-sdk-and-rest.md)
