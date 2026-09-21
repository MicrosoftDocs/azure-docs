---
title: Azure Web PubSub Chat service SDK for JavaScript
titleSuffix: Azure Web PubSub
description: Find the package, API reference, source, and samples for the Azure Web PubSub Chat service SDK for JavaScript.
author: Y-Sindo
ms.author: zityang
ms.service: azure-web-pubsub
ms.topic: reference
ms.date: 09/16/2026
ms.custom: devx-track-js
---

# Azure Web PubSub Chat service SDK for JavaScript

The Azure Web PubSub Chat service SDK for JavaScript lets trusted server applications manage Chat roles, users, rooms, room members, conversations, and persisted messages. It can also generate access URLs for Chat WebSocket clients.

The service SDK doesn't maintain an end-user WebSocket connection or send messages as a connected user. For real-time client operations, see [Get started with Azure Web PubSub Chat](chat-quickstart.md).

> [!IMPORTANT]
> Azure Web PubSub Chat and the JavaScript Chat service SDK are in preview. The beta SDK API can change before general availability.

## SDK resources

Use the SDK README as the source of truth for installation, authentication, examples, and troubleshooting:

- [JavaScript SDK README](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/web-pubsub/web-pubsub-chat/README.md)
- [npm package](https://www.npmjs.com/package/@azure/web-pubsub-chat)
- [API reference](/javascript/api/@azure/web-pubsub-chat)
- [Source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/web-pubsub/web-pubsub-chat/src)
- [Samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/web-pubsub/web-pubsub-chat/samples/v1-beta)
- [Changelog](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/web-pubsub/web-pubsub-chat/CHANGELOG.md)

Before using the SDK, create an [Azure Web PubSub resource](howto-develop-create-instance.md) and [enable Chat on a hub](chat-howto-enable-chat.md).

## Next steps

- [Chat SDKs and REST API](chat-reference-sdk-and-rest.md)
- [Create and manage rooms](chat-howto-manage-rooms.md)
- [Configure roles and permissions](chat-howto-roles-permissions.md)
- [Chat REST API](/rest/api/webpubsub/dataplane/webpubsubchat/web-pub-sub-chat-service)